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
    "\n    fragment OrderFragment on Order {\n        id\n        owner { id }\n        orderJSONString\n        orderActive\n        validInputs {\n            vaultId\n            tokenVault {\n                id\n                balance\n                balanceDisplay\n                token {\n                    name\n                    decimals\n                    symbol\n                }\n            }\n        }\n        validOutputs {\n            vaultId\n            tokenVault {\n                id\n                balance\n                balanceDisplay\n                token {\n                    name\n                    decimals\n                    symbol\n                }\n            }\n        }\n    }\n": types.OrderFragmentFragmentDoc,
    "query orderEntities {\n    orders {\n      ...OrderFragment\n    }\n  }": types.OrderEntitiesDocument,
    "query orderEntitiesForOwners ($owners: [String!]) {\n    orders (where: {owner_in: $owners}){\n      ...OrderFragment\n    }\n  }": types.OrderEntitiesForOwnersDocument,
    "fragment TakeOrderEntitiesFragment on TakeOrderEntity {\n\tid\n\tinput\n\tinputDisplay\n\toutput\n\toutputDisplay\n\t\ttimestamp\n\t\torder {\n\t\t\tid\n\t\t\towner {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t\tinputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\toutputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\tsender {\n\t\t\tid\n\t\t}\n\t\ttransaction {\n\t\t\ttimestamp\n\t\t\tid\n\t\t}\n    }": types.TakeOrderEntitiesFragmentFragmentDoc,
    "query takeOrderEntities {\n    takeOrderEntities {\n      ...TakeOrderEntitiesFragment\n    }\n  }": types.TakeOrderEntitiesDocument,
    "query takeOrderEntitiesForOwners ($owners: [String!]) {\n    takeOrderEntities (where: {order_: {owner_in: $owners}}) {\n      ...TakeOrderEntitiesFragment\n    }\n  }": types.TakeOrderEntitiesForOwnersDocument,
    "query takeOrderEntitiesForOwnersOrders ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderEntitiesFragment\n    }\n  }": types.TakeOrderEntitiesForOwnersOrdersDocument,
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
export function graphql(source: "\n    fragment OrderFragment on Order {\n        id\n        owner { id }\n        orderJSONString\n        orderActive\n        validInputs {\n            vaultId\n            tokenVault {\n                id\n                balance\n                balanceDisplay\n                token {\n                    name\n                    decimals\n                    symbol\n                }\n            }\n        }\n        validOutputs {\n            vaultId\n            tokenVault {\n                id\n                balance\n                balanceDisplay\n                token {\n                    name\n                    decimals\n                    symbol\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    fragment OrderFragment on Order {\n        id\n        owner { id }\n        orderJSONString\n        orderActive\n        validInputs {\n            vaultId\n            tokenVault {\n                id\n                balance\n                balanceDisplay\n                token {\n                    name\n                    decimals\n                    symbol\n                }\n            }\n        }\n        validOutputs {\n            vaultId\n            tokenVault {\n                id\n                balance\n                balanceDisplay\n                token {\n                    name\n                    decimals\n                    symbol\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query orderEntities {\n    orders {\n      ...OrderFragment\n    }\n  }"): (typeof documents)["query orderEntities {\n    orders {\n      ...OrderFragment\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query orderEntitiesForOwners ($owners: [String!]) {\n    orders (where: {owner_in: $owners}){\n      ...OrderFragment\n    }\n  }"): (typeof documents)["query orderEntitiesForOwners ($owners: [String!]) {\n    orders (where: {owner_in: $owners}){\n      ...OrderFragment\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TakeOrderEntitiesFragment on TakeOrderEntity {\n\tid\n\tinput\n\tinputDisplay\n\toutput\n\toutputDisplay\n\t\ttimestamp\n\t\torder {\n\t\t\tid\n\t\t\towner {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t\tinputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\toutputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\tsender {\n\t\t\tid\n\t\t}\n\t\ttransaction {\n\t\t\ttimestamp\n\t\t\tid\n\t\t}\n    }"): (typeof documents)["fragment TakeOrderEntitiesFragment on TakeOrderEntity {\n\tid\n\tinput\n\tinputDisplay\n\toutput\n\toutputDisplay\n\t\ttimestamp\n\t\torder {\n\t\t\tid\n\t\t\towner {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t\tinputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\toutputToken {\n\t\t\tname\n\t\t\tsymbol\n\t\t\tdecimals\n\t\t}\n\t\tsender {\n\t\t\tid\n\t\t}\n\t\ttransaction {\n\t\t\ttimestamp\n\t\t\tid\n\t\t}\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query takeOrderEntities {\n    takeOrderEntities {\n      ...TakeOrderEntitiesFragment\n    }\n  }"): (typeof documents)["query takeOrderEntities {\n    takeOrderEntities {\n      ...TakeOrderEntitiesFragment\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query takeOrderEntitiesForOwners ($owners: [String!]) {\n    takeOrderEntities (where: {order_: {owner_in: $owners}}) {\n      ...TakeOrderEntitiesFragment\n    }\n  }"): (typeof documents)["query takeOrderEntitiesForOwners ($owners: [String!]) {\n    takeOrderEntities (where: {order_: {owner_in: $owners}}) {\n      ...TakeOrderEntitiesFragment\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query takeOrderEntitiesForOwnersOrders ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderEntitiesFragment\n    }\n  }"): (typeof documents)["query takeOrderEntitiesForOwnersOrders ($owners: [String!]) {\n    takeOrderEntities (where: {sender_in: $owners}) {\n      ...TakeOrderEntitiesFragment\n    }\n  }"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;