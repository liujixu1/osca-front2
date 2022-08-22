<template>
  <div>
    <!-- <v-dialog
      v-model="dialog"
      width="300"
    >
      <el-card
      >
      <v-card-title>
        登录
      </v-card-title>
      <v-card-subtitle>
        请选择登录方式
      </v-card-subtitle>
      </el-card>
    </v-dialog> -->
    <v-dialog v-model="dialog" width="500" transition="dialog-top-transition">
      <v-card>
        <v-card-title class="text-h4 pb-4"> 登录 </v-card-title>
        <v-card-subtitle> 请选择登录方式 </v-card-subtitle>
        <v-card-text>
          <v-btn block color="warning" class="mb-5 text-h5" @click="giteeLogin">
            gitee
          </v-btn>
          <v-btn block color="warning" class="text-h5" @click="githubLogin">
            github
          </v-btn>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import gql from 'graphql-tag'
const QUERY_GITEE = gql`
  query {
    authUrl {
      gitee
    }
  }
`
const QUERY_GITHUB = gql`
  query {
    authUrl {
      github
    }
  }
`
const QUERY_USERINFO = gql`
  query {
    me {
      id
      giteeLogin
      giteeAvatarUrl
      githubAvatarUrl
      githubLogin
    }
  }
`
export default {
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    openLoginDialog() {
      this.dialog = true
    },
    async giteeLogin() {
      const { data } = await this.$apollo.query({
        query: QUERY_GITEE,
        fetchPolicy: 'no-cache'
      })
      this.dialog = false
      // this.$router.push('/loginloading')
      location.href = data.authUrl.gitee
    },
    async githubLogin() {
      const { data } = await this.$apollo.query({
        query: QUERY_GITHUB,
        fetchPolicy: 'no-cache'
      })
      location.href = data.authUrl.github + '?state=1'
    }
  }
}
</script>

<style></style>
