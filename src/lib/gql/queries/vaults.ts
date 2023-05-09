import { subgraphClient } from "$lib/stores";
import { derived, writable, type Readable } from "svelte/store";
import { graphql } from "../generated";
import type { TakeOrderEntitiesFragmentFragment, TokenVaultFragmentFragment } from "$lib/gql/generated/graphql";
import type { CombinedError } from "@urql/svelte";


const tokenVaultsFragment = graphql(`fragment TokenVaultFragment on TokenVault {
        vaultId
        orders {
            id
            orderActive
            expression
            expressionDeployer
        }
        owner {
            id 
        }
            balance
            balanceDisplay
            id
        token {
            symbol
            name
            decimals
            id
        }
    }`
)

const tokenVaults = graphql(`query tokenVaults {
    tokenVaults {
      ...TokenVaultFragment
    }
  }`)

const tokenVaultsForOwners = graphql(`query tokenVaultsForOwners ($owners: [String!]) {
    tokenVaults (where: {owner_in: $owners}) {
      ...TokenVaultFragment
    }
  }`)


/**
 * General query for vaults
 * Optionally filter by owners, orders.
 * 
 * Returns a stores with the result of the query, the owners and orders variables and a refresh function.
 * Modifying the owners or orders stores, or calling the refresh function, will trigger a new query and update the result store.
 * @param options 
 */
export const queryTokenVaults = (options?: { owners?: string[], orders?: string[] }) => {
    const owners = writable(options?.owners || null)
    const orders = writable(options?.orders || null)
    const refreshStore = writable(1)

    const result: Readable<{ data?: TokenVaultFragmentFragment[], error?: CombinedError }> = derived(
        [subgraphClient, owners, refreshStore],
        ([$subgraphClient, $owners, $refreshStore], set) => {
            if ($subgraphClient) {
                let queryPromise

                if ($owners) {
                    console.log('querying for owners', $owners)
                    queryPromise = $subgraphClient
                        .query(tokenVaultsForOwners, { owners: $owners })
                        .toPromise();
                } else {
                    queryPromise = $subgraphClient
                        .query(tokenVaults, {})
                        .toPromise();
                }

                queryPromise.then((result) => {
                    if (result.data?.tokenVaults) {
                        set({ data: result.data.tokenVaults as TokenVaultFragmentFragment[] });
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