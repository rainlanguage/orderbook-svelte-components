import { subgraphClient } from "$lib/stores";
import { derived, writable, type Readable } from "svelte/store";
import { graphql } from "../generated";
import type { TakeOrderEntitiesFragmentFragment } from "$lib/gql/generated/graphql";
import type { CombinedError } from "@urql/svelte";

const takeOrderEntitiesFragment = graphql(`fragment TakeOrderEntitiesFragment on TakeOrderEntity {
	id
	input
	inputDisplay
	output
	outputDisplay
		timestamp
		order {
			id
			owner {
				id
			}
		}
		inputToken {
			name
			symbol
			decimals
		}
		outputToken {
			name
			symbol
			decimals
		}
		sender {
			id
		}
		transaction {
			timestamp
			id
		}
    }`
)

const takeOrderEntities = graphql(`query takeOrderEntities {
    takeOrderEntities {
      ...TakeOrderEntitiesFragment
    }
  }`)

const takeOrderEntitiesForOwners = graphql(`query takeOrderEntitiesForOwners ($owners: [String!]) {
    takeOrderEntities (where: {order_: {owner_in: $owners}}) {
      ...TakeOrderEntitiesFragment
    }
  }`)

const takeOrderEntitiesForOwnersOrders = graphql(`query takeOrderEntitiesForOwnersOrders ($owners: [String!]) {
    takeOrderEntities (where: {sender_in: $owners}) {
      ...TakeOrderEntitiesFragment
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
export const queryTakeOrderEntities = (options?: { owners?: string[], orders?: string[] }) => {
	const owners = writable(options?.owners || null)
	const orders = writable(options?.orders || null)
	const refreshStore = writable(1)

	const result: Readable<{ data?: TakeOrderEntitiesFragmentFragment[], error?: CombinedError }> = derived(
		[subgraphClient, owners, orders, refreshStore],
		([$subgraphClient, $owners, $orders, $refreshStore], set) => {
			if ($subgraphClient) {
				let queryPromise

				if ($owners?.length && $orders?.length) {
					queryPromise = $subgraphClient
						.query(takeOrderEntitiesForOwnersOrders, { owners: $owners, orders: $orders })
						.toPromise();
				}
				else if ($owners) {
					console.log('querying for owners')
					queryPromise = $subgraphClient
						.query(takeOrderEntitiesForOwners, { owners: $owners })
						.toPromise();
				} else {
					queryPromise = $subgraphClient
						.query(takeOrderEntities, {})
						.toPromise();
				}

				queryPromise.then((result) => {
					if (result.data?.takeOrderEntities) {
						set({ data: result.data.takeOrderEntities as TakeOrderEntitiesFragmentFragment[] });
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