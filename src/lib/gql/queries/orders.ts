import { graphql } from "$lib/gql/generated";
import type { OrderFragmentFragment } from "$lib/gql/generated/graphql";
import { subgraphClient } from "$lib/stores";
import type { CombinedError } from "@urql/svelte";
import { writable, type Readable, derived } from "svelte/store";

const orderFragment = graphql(`
    fragment OrderFragment on Order {
        id
        owner { id }
        orderJSONString
        orderActive
        validInputs {
            vaultId
            tokenVault {
                id
                balance
                balanceDisplay
                token {
                    name
                    decimals
                    symbol
                }
            }
        }
        validOutputs {
            vaultId
            tokenVault {
                id
                balance
                balanceDisplay
                token {
                    name
                    decimals
                    symbol
                }
            }
        }
    }
`)

const orderEntities = graphql(`query orderEntities {
    orders {
      ...OrderFragment
    }
  }`)

const orderEntitiesForOwners = graphql(`query orderEntitiesForOwners ($owners: [String!]) {
    orders (where: {owner_in: $owners}){
      ...OrderFragment
    }
  }`)


/**
 * General query for take order entities.
 * Optionally filter by owners, orders.
 * 
 * Returns a stores with the result of the query, the owners and orders variables and a refresh function.
 * Modifying the owners or orders stores, or calling the refresh function, will trigger a new query and update the result store.
 * @param options 
 */
export const queryOrders = (options?: { owners?: string[], orders?: string[] }) => {
    const owners = writable(options?.owners || null)
    const orders = writable(options?.orders || null)
    const refreshStore = writable(1)

    const result: Readable<{ data?: OrderFragmentFragment[], error?: CombinedError }> = derived(
        [subgraphClient, owners, refreshStore],
        ([$subgraphClient, $owners, $refreshStore], set) => {
            if ($subgraphClient) {
                let queryPromise

                if ($owners) {
                    console.log('querying for owners')
                    queryPromise = $subgraphClient
                        .query(orderEntitiesForOwners, { owners: $owners })
                        .toPromise();
                } else {
                    queryPromise = $subgraphClient
                        .query(orderEntities, {})
                        .toPromise();
                }

                queryPromise.then((result) => {
                    if (result.data?.orders) {
                        set({ data: result.data.orders as OrderFragmentFragment[] });
                    } else if (result.error) {
                        set({ error: result.error });
                    }
                });
            } else {
                // Set the derived store value to `null` when the `$subgraphClient` is `null`
                set({});
            }
        }
    );

    const refresh = () => {
        refreshStore.update(n => n + 1);
    }

    return { result, owners, orders, refresh };
}