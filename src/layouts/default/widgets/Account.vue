<template>
  <div>
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
      v-if="userInfo"
      min-width="120px"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-avatar v-bind="attrs" v-on="on" size="32px" class="ml-5">
          <img
            :src="userInfo.giteeAvatarUrl || userInfo.githubAvatarUrl"
            :alt="userInfo.giteeAvatarUrl || userInfo.githubAvatarUrl"
          />
        </v-avatar>
      </template>
      <v-list :tile="false" flat nav>
        <v-list>
          <v-list-item>
            <v-list-item-title @click="linkMe">我的</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="logout">退出</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-list>

      <!--
    <v-list :tile="false" flat nav>
      <template v-for="(p, i) in profile">
        <v-divider v-if="p.divider" :key="`divider-${i}`" class="mb-2 mt-2" />

        <app-bar-item v-else :key="`item-${i}`" to="/">
          <v-list-item-title v-text="p.title" />
        </app-bar-item>
      </template>
    </v-list> -->
    </v-menu>
    <v-btn v-else class="ml-2" color="primary" @click="login" depressed>
      登录
    </v-btn>
    <login-dialog ref="login" />
  </div>
</template>

<script>
import { get, sync } from "vuex-pathify";
import LoginDialog from "../../../views/login/LoginDIalog.vue";

// import Login  from '@/views/Login'
export default {
  name: "DefaultAccount",

  data: () => ({
    profile: [
      { title: "Profile" },
      { title: "Settings" },
      { divider: true },
      { title: "退出" },
    ],
  }),
  components: {
    LoginDialog,
  },
  computed: {
    userInfo: sync("user/userInfo"),
    jwt() {
      return localStorage.getItem("jwt");
    },
  },
  methods: {
    login() {
      this.$refs["login"].openLoginDialog();
      // window.location.reload()
    },
    logout() {
      // console.log("loginout");
      localStorage.removeItem("jwt");
      this.userInfo = null;
      this.$router.push("/");
    },
    linkMe() {
      this.$router.push("/aboutme");
    },
  },
};
</script>
