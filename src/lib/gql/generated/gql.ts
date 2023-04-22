/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment TakeOrderHistoryFragment on TakeOrderEntity {\n\tid\n\tinput\n\tinputDisplay\n\toutput\n\toutputDisplay\n\t\ttimestamp\n\t\torder {\n\t\t\tid\n\t\t}\n\t\tinputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\toutputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\tsender {\n\t\t\tid\n\t\t}\n\t\ttransaction {\n\t\t\ttimestamp\n\t\t\tid\n\t\t}\n    }": types.TakeOrderHistoryFragmentFragmentDoc,
    "query takeOrderHistory {\n    takeOrderEntities {\n      ...TakeOrderHistoryFragment\n    }\n  }": types.TakeOrderHistoryDocument,
    "query takeOrderHistoryForOwners ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderHistoryFragment\n    }\n  }": types.TakeOrderHistoryForOwnersDocument,
    "query takeOrderHistoryForOwnersOrders ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderHistoryFragment\n    }\n  }": types.TakeOrderHistoryForOwnersOrdersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TakeOrderHistoryFragment on TakeOrderEntity {\n\tid\n\tinput\n\tinputDisplay\n\toutput\n\toutputDisplay\n\t\ttimestamp\n\t\torder {\n\t\t\tid\n\t\t}\n\t\tinputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\toutputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\tsender {\n\t\t\tid\n\t\t}\n\t\ttransaction {\n\t\t\ttimestamp\n\t\t\tid\n\t\t}\n    }"): (typeof documents)["fragment TakeOrderHistoryFragment on TakeOrderEntity {\n\tid\n\tinput\n\tinputDisplay\n\toutput\n\toutputDisplay\n\t\ttimestamp\n\t\torder {\n\t\t\tid\n\t\t}\n\t\tinputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\toutputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\tsender {\n\t\t\tid\n\t\t}\n\t\ttransaction {\n\t\t\ttimestamp\n\t\t\tid\n\t\t}\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query takeOrderHistory {\n    takeOrderEntities {\n      ...TakeOrderHistoryFragment\n    }\n  }"): (typeof documents)["query takeOrderHistory {\n    takeOrderEntities {\n      ...TakeOrderHistoryFragment\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query takeOrderHistoryForOwners ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderHistoryFragment\n    }\n  }"): (typeof documents)["query takeOrderHistoryForOwners ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderHistoryFragment\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query takeOrderHistoryForOwnersOrders ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderHistoryFragment\n    }\n  }"): (typeof documents)["query takeOrderHistoryForOwnersOrders ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderHistoryFragment\n    }\n  }"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;