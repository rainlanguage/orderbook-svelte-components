import { subgraphClient } from "$lib/stores";
import { derived, writable, type Readable } from "svelte/store";
import { graphql } from "../generated";
import type { TakeOrderEntitiesDynamicFilterQuery, TakeOrderEntity_Filter } from "$lib/gql/generated/graphql";
import type { CombinedError } from "@urql/svelte";

const takeOrderEntitiesQuery = graphql(`query takeOrderEntitiesDynamicFilter ($filters: TakeOrderEntity_filter) {
    takeOrderEntities (where: $filters) {
		id
	input
	inputDisplay
	output
	outputDisplay
		timestamp
		order {
			orderHash
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

	const result: Readable<{ data?: TakeOrderEntitiesDynamicFilterQuery['takeOrderEntities'], error?: CombinedError }> = derived(
		[subgraphClient, owners, orders, refreshStore],
		([$subgraphClient, $owners, $orders, $refreshStore], set) => {
			if ($subgraphClient) {
				let filters: TakeOrderEntity_Filter = {}
				if ($owners?.length) filters.order_ = { owner_in: $owners }
				if ($orders?.length) filters.order_ = { ...filters.order_, orderHash_in: $orders }

				$subgraphClient.query(takeOrderEntitiesQuery, { filters }).toPromise().then((result) => {
					if (result.data?.takeOrderEntities) {
						set({ data: result.data.takeOrderEntities });
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