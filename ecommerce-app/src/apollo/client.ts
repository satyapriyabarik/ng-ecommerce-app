import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    //uri: 'http://localhost:8080/graphql'
    uri: 'http://cartwebapp-env.eba-nqvthugx.ap-south-1.elasticbeanstalk.com/graphql' // Replace with your deployed server URL

});

const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
