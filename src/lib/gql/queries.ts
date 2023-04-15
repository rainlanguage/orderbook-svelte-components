import { graphql } from "./generated";

export const takeOrderHistoryQuery = graphql(`query takeOrderHistory {
    takeOrderEntities {
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
    }
  }`)