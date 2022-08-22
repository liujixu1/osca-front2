import Vue from "vue";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import VueApollo from "vue-apollo";
Vue.use(VueApollo);

const cache = new InMemoryCache();
//var defaultOptions: WatchQueryFetchPolicy = "cache-and-network"
const apolloClient = new ApolloClient({
  cache,
  uri: "/graphql",
  // 不使用缓存，每次都重新取
  defaultOptions: "network-only"
});
export default new VueApollo({
  defaultClient: apolloClient
});
