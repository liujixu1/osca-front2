<template>
  <div class="lv-meng text-center my-4 pa-4">
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="2" class="px-4 py-2 card">
          <v-textarea
            clearable
            color="#666"
            filled
            counter
            background-color="#f5f5f5"
            label="Please input your code snippet"
            v-model="code"
            rows="15"
            class="license-text mt-4"
          ></v-textarea>
          <!-- <v-icon> mdi-close-circle </v-icon> -->
          <v-btn v-if="isLoading" depressed disabled>loading... </v-btn>
          <v-btn
            v-else
            depressed
            color="blue-grey"
            class="white--text"
            middle
            @click="submit"
          >
            submit
          </v-btn>

        </v-card>
      </v-col>
      <v-col cols="12">
        <v-alert
          v-if="result"
          transition="scale-transition"
          text
          color="info"
          variant="contained-text"
          class="text-left"
        >
          <template v-for="(value, key, i) in result">
            <v-divider
              class="my-4 info"
              style="opacity: 0.22"
              v-if="i !== 0"
              :key="i"
            ></v-divider>
            <h3 style="font-size: 20px; font-weight: bold" :key="i">
              {{ key }}
            </h3>
            <pre :key="i">{{ JSON.stringify(value, null, 4) }}</pre>
          </template>
        </v-alert>
        <v-alert color="#fff3cd" transition="scale-transition" v-else>
          <div class="d-flex align-center">
            <v-icon dark right color="#664d03" class="mr-2"> mdi-alert </v-icon>
            <span style="color: #664d03"> 暂无数据 </span>
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { test, licenseInquire } from '@/api/lvMeng'
import gql from "graphql-tag";
import jsonPath from "jsonpath";
const QUERY_SNIPPET = gql`
  query ($snippet: String!) {
    querySnippet(snippet: $snippet)
  }
`;
export default {
  data() {
    return {
      isLoading: false,
      code: "",
      result: null,
    };
  },
  methods: {
    // 获取扫描结果
    async submit() {
      this.result = null;
      try {
        this.isLoading = true;
        let { data } = await this.$apollo.query({
          query: QUERY_SNIPPET,
          variables: { snippet: this.code },
          fetchPolicy: "no-cache",
        });
        // let data = {
        //   querySnippet:
        //     '{\n"1657020776_6941261091797652072.script": [{"id": "none","server": {"version": "4.5.2","kb_version": {"monthly":"22.06", "daily":"22.07.05"}}}]\n}\r\n',
        // };
        this.result = jsonPath.query(
          JSON.parse(data.querySnippet),
          "$.*"
        )[0][0];
      } catch (err) {
        console.log(err);
        this.result = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.code-text {
  line-height: 1;
  ::v-deep label {
    line-height: 1.5;
  }
  ::v-deep textarea {
    padding: 2px;
    font-size: 14px;
  }
}
.card {
  overflow-y: auto;
}
</style>
