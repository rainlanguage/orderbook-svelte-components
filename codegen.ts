import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'https://api.thegraph.com/subgraphs/name/siddharth2207/slsohysubgraph',
    documents: ['src/lib/gql/queries/**/*.ts'],
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './src/lib/gql/generated/': {
            preset: 'client',
            plugins: [],
            config: {
                useTypeImports: true,
                enumsAsTypes: true
            }
        },
    },
};

export default config;