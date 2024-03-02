import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient('https://backboard.railway.app/graphql/v2', {
    headers: {
        authorization: 'Bearer ' + process.env.API_KEY,
    },
});
