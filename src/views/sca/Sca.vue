<template>
  <div>
    <v-tabs v-model="tabs" align-with-title class="mb-5 tab">
      <v-tab href="#one"> 版本扫描 </v-tab>
      <v-tab href="#two"> pr扫描 </v-tab>
      <v-tabs-slider color="pink"></v-tabs-slider>
    </v-tabs>
    <v-row>
      <v-col cols="6">
        <v-select
          @change="communityChange"
          v-model="communityId"
          :items="communityList"
          item-text="name"
          item-value="id"
          label="社区"
        >
        </v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          @change="repoChange"
          v-model="repoId"
          :items="repoList"
          label="仓库"
        >
        </v-select>
      </v-col>
    </v-row>
    <sca-detail v-if="repoId" />
    <ScaList v-else :repoList="repoList" />
  </div>
</template>

<script>
import ScaList from './ScaList.vue'
import ScaDetail from './ScaDetail.vue'
import gql from 'graphql-tag'
const QUERY_COMMUNITIES = gql`
  query {
    communities {
      id
      name
    }
  }
`
const QUERY_REPOS = gql`
  query($id: ID!) {
    community(id: $id) {
      id
      repositories {
        id
        repoType
        url
        monitoredBranch
        updateTime
      }
    }
  }
`
export default {
  components: {
    ScaList,
    ScaDetail
  },
  data() {
    return {
      tabs: '',
      communityId: '',
      communityList: [1, 2, 3],
      repoId: '',
      repoList: [1, 2, 3]
    }
  },
  methods: {
    communityChange() {
      console.log(this.communityId)
      this.getRepoList()
    },
    repoChange() {},
    async getCommunityList() {
      const { data } = await this.$apollo.query({
        query: QUERY_COMMUNITIES,
        fetchPolicy: 'no-cache'
      })
      this.communityList = data.communities
      this.communityId = this.communityList[0]?.id
      this.communityChange()
    },
    async getRepoList() {
      this.repoId = ''
      const { data } = await this.$apollo.query({
        query: QUERY_REPOS,
        variables: { id: this.communityId },
        fetchPolicy: 'no-cache'
      })
      this.repoList = data.community.repositories
    }
  },
  mounted() {
    this.getCommunityList()
  }
}
</script>

<style scoped>
.tab {
  font-size: 14px;
}
</style>
