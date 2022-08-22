<template>
  <div>loading...</div>
</template>

<script>
import gql from "graphql-tag";
import Cookies from "js-cookie";
export default {
  methods: {
    async setAuth() {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation {
            generateAppAPIToken
          }
        `,
      });
      window.localStorage.setItem("jwt", data.generateAppAPIToken);
    },
    async getUser() {
      const { data } = await this.$apollo.query({
        query: gql`
          query {
            me {
              id
              role
              giteeLogin
              giteeAvatarUrl
              githubLogin
              githubAvatarUrl
            }
          }
        `,
      });
      this.$store.set("user/userInfo", data.me);
      // localStorage.setItem("userInfo", JSON.stringify(data.me));
    },
  },
  async mounted() {
    this.setAuth();
    await this.getUser();
    this.$router.replace("/");
  },
};
</script>

<style></style>
