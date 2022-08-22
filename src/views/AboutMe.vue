<template>
  <div>
    <v-card>
      <v-card-title class="text-h4 pb-4"> 我的账号 </v-card-title>
      <v-card-text v-if="userInfo">
        id:{{ userInfo.id }} role:{{ userInfo.role }}
        <v-card>
          <v-card-title class="text-h4 pb-4 ma-6"> gitee账号 </v-card-title>
          <v-card-text>
            <template v-if="userInfo.giteeLogin">
              <v-avatar v-bind="attrs" v-on="on" size="50px" class="ml-5">
                <img
                  :src="userInfo.giteeAvatarUrl"
                  :alt="userInfo.giteeAvatarUrl"
                />
              </v-avatar>
              {{ userInfo.giteeLogin }}
            </template>
            <template v-else>
              <v-btn class="ml-5" color="primary" @click="bindGitee">
                绑定账号
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title class="text-h4 pb-4 ma-6"> github账号 </v-card-title>
          <v-card-text>
            <template v-if="!userInfo.githubLogin">
              <v-avatar v-bind="attrs" v-on="on" size="50px" class="ml-5">
                <img
                  :src="userInfo.githubAvatarUrl"
                  :alt="userInfo.githubAvatarUrl"
                />
              </v-avatar>
              {{ userInfo.giteeLogin }}
            </template>
            <template v-else>
              <v-btn class="ml-5" color="primary" @click="bindGithub">
                绑定账号
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-text>
        暂未获取到相关信息，请先登录
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { sync } from 'vuex-pathify'
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
export default {
  computed: {
    userInfo: sync('user/userInfo'),
  },
  methods: {
    async bindGitee() {
      const { data } = await this.$apollo.query({
        query: QUERY_GITEE,
        fetchPolicy: 'no-cache',
      })
      location.href = data.authUrl.gitee + '?state=1'
    },
    async bindGithub() {
      const { data } = await this.$apollo.query({
        query: QUERY_GITHUB,
        fetchPolicy: 'no-cache',
      })
      location.href = data.authUrl.github + '?state=1'
    },
  },
}
</script>

<style></style>
