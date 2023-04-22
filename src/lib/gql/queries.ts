import { subgraphClient } from "$lib/stores";
import { derived, writable, type Readable } from "svelte/store";
import { graphql } from "./generated";
import type { TakeOrderHistoryFragmentFragment } from "$lib/gql/generated/graphql";
import type { CombinedError } from "@urql/svelte";

const takeOrderHistoryFragment = graphql(`fragment TakeOrderHistoryFragment on TakeOrderEntity {
	id
	input
	inputDisplay
	output
	outputDisplay
		timestamp
		order {
			id
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

const takeOrderHistory = graphql(`query takeOrderHistory {
    takeOrderEntities {
      ...TakeOrderHistoryFragment
    }
  }`)

const takeOrderHistoryForOwners = graphql(`query takeOrderHistoryForOwners ($owners: [String!]) {
    takeOrderEntities (where: {sender_in: $owners}) {
      ...TakeOrderHistoryFragment
    }
  }`)

const takeOrderHistoryForOwnersOrders = graphql(`query takeOrderHistoryForOwnersOrders ($owners: [String!]) {
    takeOrderEntities (where: {sender_in: $owners}) {
      ...TakeOrderHistoryFragment
    }
  }`)

/**
 * General query for take order history.
 * Optionally filter by owners, orders.
 * 
 * Returns a stores with the result of the query, the owners and orders variables and a refresh function.
 * Modifying the owners or orders stores, or calling the refresh function, will trigger a new query and update the result store.
 * @param options 
 */
export const queryTakeOrderHistory = (options?: { owners?: string[], orders?: string[] }) => {
	const owners = writable(options?.owners || null)
	const orders = writable(options?.orders || null)
	const refreshStore = writable(1)

	const result: Readable<{ data?: TakeOrderHistoryFragmentFragment[], error?: CombinedError }> = derived(
		[subgraphClient, owners, orders, refreshStore],
		([$subgraphClient, $owners, $orders, $refreshStore], set) => {
			if ($subgraphClient) {
				let queryPromise

				if ($owners?.length && $orders?.length) {
					queryPromise = $subgraphClient
						.query(takeOrderHistoryForOwnersOrders, { owners: $owners, orders: $orders })
						.toPromise();
				}
				else if ($owners) {
					queryPromise = $subgraphClient
						.query(takeOrderHistoryForOwners, { owners: $owners })
						.toPromise();
				} else {
					queryPromise = $subgraphClient
						.query(takeOrderHistory, {})
						.toPromise();
				}

				queryPromise.then((result) => {
					if (result.data?.takeOrderEntities) {
						set({ data: result.data.takeOrderEntities as TakeOrderHistoryFragmentFragment[] });
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