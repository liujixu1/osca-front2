<template>
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    class="v-bar--underline header"
    color="#fff"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="70"
    flat
  >
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

    <default-drawer-toggle class="hidden-sm-and-down" />

    <v-toolbar-title class="font-weight-light text-h5" v-text="name" />

    <v-spacer />

    <default-search class="hidden-sm-and-down" />

    <default-go-home />

    <!-- <default-notifications /> -->

    <default-account />
  </v-app-bar>
</template>

<script>
// Utilities
import { get, sync } from "vuex-pathify";
export default {
  name: "DefaultBar",

  components: {
    DefaultAccount: () =>
      import(
        /* webpackChunkName: "default-account" */
        "./widgets/Account"
      ),
    DefaultDrawerToggle: () =>
      import(
        /* webpackChunkName: "default-drawer-toggle" */
        "./widgets/DrawerToggle"
      ),
    DefaultGoHome: () =>
      import(
        /* webpackChunkName: "default-go-home" */
        "./widgets/GoHome"
      ),
    DefaultNotifications: () =>
      import(
        /* webpackChunkName: "default-notifications" */
        "./widgets/Notifications"
      ),
    DefaultSearch: () =>
      import(
        /* webpackChunkName: "default-search" */
        "./widgets/Search"
      ),
  },

  computed: {
    ...sync("app", ["drawer", "mini"]),
    name: get("route/name"),
  },
};
</script>
<style lang="scss" scoped>
.header {
  background: #fff;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
    0 1px 18px 0 rgb(0 0 0 / 12%);
}
</style>
