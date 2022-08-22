<template>
  <div class="lv-meng">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="8">
            <v-textarea
              color="#666"
              filled
              counter
              background-color="#fff"
              name="License"
              label="请在此粘贴License文本进行查询"
              v-model="license"
              rows="15"
              class="license-text mt-4"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="mx-auto" cols="auto">
        <v-btn v-if="isLoading" depressed disabled
          >loading..(>40 seconds)
        </v-btn>
        <v-btn
          v-else
          depressed
          color="blue-grey"
          class="white--text"
          middle
          @click="licenseInquire"
        >
          提交
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-if="hasResult">
      <v-col cols="12" v-if="hasFullTextMatch">
        <v-alert color="#badbcc">
          <div class="d-flex align-center">
            <v-icon dark right color="#008000">
              mdi-checkbox-marked-circle
            </v-icon>
            <span style="color: #0f5132">文本完全匹配为:</span>
            <div class="copy-info">
              <a
                :href="'/license/' + fullTextMatchLicenseId"
                target="_blank"
                class="text-decoration-none mx-2"
                ><strong>{{ fullTextMatchLicense }}</strong></a
              >
              <div v-show="copyShow">复制成功</div>
            </div>
            <v-icon @click="copy"> mdi-arrange-bring-forward </v-icon>
          </div>
        </v-alert>
      </v-col>
      <v-col cols="12" v-if="!hasFullTextMatch && isResultConsistent">
        <v-alert color="#badbcc">
          <div class="d-flex align-center">
            <v-icon dark right color="#008000">
              mdi-checkbox-marked-circle
            </v-icon>
            <span style="color: #0f5132">不同算法的最高匹配结果都为:</span>
            <a
              :href="'/license/' + consistentLicenseId"
              target="_blank"
              class="text-decoration-none mx-2"
              ><strong>{{ consistentLicense }}</strong></a
            >
            <v-icon @click="copy"> mdi-arrange-bring-forward </v-icon>
          </div>
        </v-alert>
      </v-col>
      <v-col cols="12" v-if="!hasFullTextMatch && !isResultConsistent">
        <v-alert color="#fff3cd">
          <div class="d-flex align-center">
            <v-icon dark right color="#664d03"> mdi-alert </v-icon>
            <span style="color: #664d03">
              未出现文本完全匹配且不同算法最高匹配结果不同，请注意鉴别
            </span>
          </div>
        </v-alert>
      </v-col>
      <v-col
        :cols="filterScanResultList().length > 1 ? 6 : 12"
        v-for="scanResult in filterScanResultList()"
        :key="scanResult.algorithm"
      >
        <template>
          <v-banner class="mb-5" size="18">
            {{ scanResult.algorithm }}
          </v-banner>
          <!-- <v-data-table
            :headers="tableHeaders"
            :items="scanResult.licenses"
            class="elevation-1"
            hide-default-footer
            disable-sort
          >
            <template v-slot:item.spdx_license_identifier="{ item }">
              <a
                :href="'/license/' + item.id"
                target="_blank"
                class="text-decoration-none"
              >
                {{ item.spdx_license_identifier }}
              </a>
              <span class="right-star"> </span>
              <span class="hover-tooltip-text">文本完全匹配</span>
            </template>
          </v-data-table> -->
          <v-simple-table class="license-table mx-5">
            <template>
              <thead>
                <tr>
                  <th v-for="item in tableHeaders" :key="item.value">
                    {{ item.text }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, index) in scanResult.licenses"
                  :key="item.id"
                  :class="{
                    'license-success':
                      (hasFullTextMatch &&
                        item.id === fullTextMatchLicenseId) ||
                      (isResultConsistent && item.id === consistentLicenseId),
                    'license-warning':
                      !hasFullTextMatch && !isResultConsistent && index === 0,
                  }"
                >
                  <td
                    v-for="element in tableHeaders"
                    :key="item.id + element.value"
                  >
                    <template v-if="element.text === 'SPDX Identifier'">
                      <a
                        :href="'/license/' + item.id"
                        target="_blank"
                        class="text-decoration-none"
                      >
                        <strong>{{ item.spdx_license_identifier }}</strong>
                      </a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            style="pointer-events: auto"
                            v-bind="attrs"
                            v-on="on"
                            small
                          >
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>文本完全匹配</span>
                      </v-tooltip>
                      <!-- <span
                        v-if="item.sim_type == 'ExactFullText'"
                        class="right-star"
                      >
                        <v-icon small>
                          mdi-alert-circle
                        </v-icon>
                      </span>
                      <span
                        v-if="item.sim_type == 'ExactFullText'"
                        class="hover-tooltip-text"
                        >文本完全匹配</span
                      > -->
                    </template>
                    <template v-else>
                      {{ item[element.value] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
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
      copyShow: false,
      copyTimer: null,
      license: "",
      tableHeaders: [
        { text: "SPDX Identifier", value: "spdx_license_identifier" },
        { text: "全称", value: "name" },
        { text: "相似度", value: "sim_score" },
      ],
      scanResultList: [],
      hasResult: false,
      isResultConsistent: false,
      consistentLicense: "",
      consistentLicenseId: "",
      hasFullTextMatch: false,
      fullTextMatchLicense: "",
      fullTextMatchLicenseId: "",
    };
  },
  methods: {
    selectRow(items) {
      console.log(items);
    },
    filterScanResultList() {
      return this.scanResultList.filter((item) => item.licenses.length);
    },
    // 复制
    copy() {
      let domUrl = document.createElement("input");
      domUrl.value = this.hasFullTextMatch
        ? this.fullTextMatchLicense
        : this.consistentLicense;
      domUrl.id = "creatDom";
      document.body.appendChild(domUrl);
      domUrl.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      let creatDom = document.getElementById("creatDom");
      creatDom.parentNode.removeChild(creatDom);
      if (this.copyShow) {
        clearTimeout(this.copyTimer);
      } else {
        this.copyShow = true;
      }
      this.copyTimer = setTimeout(() => {
        this.copyShow = false;
        clearTimeout(this.copyTimer);
      }, 1000);
    },
    // 获取扫描结果
    async licenseInquire() {
      let res = this.$apollo
        .query({
          query: QUERY_SNIPPET,
          variables: { snippet: this.license },
          fetchPolicy: "no-cache",
        })
        .then(({ data }) => {
          //console.log("result: "+JSON.stringify(this.result))
          this.result = jsonPath.query(
            JSON.parse(data.querySnippet),
            "$.*"
          )[0][0];
          //console.log(this.result)
          this.isClosed = false;
        });
      return;
      this.isLoading = true;
      this.hasResult = false;
      this.isResultConsistent = false;
      this.hasFullTextMatch = false;
      try {
        // const result = await licenseInquire({ licenseText: this.license })
        let result = {
          summary: "不同算法扫描都指向同一最有可能的license",
          scanResultList: [
            {
              algorithm: "scancode算法扫描结果",
              licenses: [
                {
                  id: "463",
                  spdx_license_identifier: "0BSD",
                  name: "BSD Zero Clause License",
                  sim_score: "1.00000",
                  sim_type: "scancode",
                },
              ],
            },
            {
              algorithm: "wordFrequencySimilarity算法扫描结果",
              licenses: [
                {
                  id: "463",
                  spdx_license_identifier: "0BSD",
                  name: "BSD Zero Clause License",
                  sim_score: "1.00000",
                  sim_type: "wordFrequencySimilarity",
                },
              ],
            },
            {
              algorithm: "tfidf算法扫描结果",
              licenses: [
                {
                  id: "463",
                  spdx_license_identifier: "0BSD",
                  name: "BSD Zero Clause License",
                  sim_score: "1.00000",
                  sim_type: "TF-IDF Cosine Sim",
                },
                {
                  id: "463",
                  spdx_license_identifier: "0BSD",
                  name: "BSD Zero Clause License",
                  sim_score: "1.00000",
                  sim_type: "ExactFullText",
                },
                {
                  id: "629",
                  spdx_license_identifier: "ISC",
                  name: "ISC License",
                  sim_score: "0.83372",
                  sim_type: "TF-IDF Cosine Sim",
                },
                {
                  id: "451",
                  spdx_license_identifier: "HPND",
                  name: "Historical Permission Notice and Disclaimer",
                  sim_score: "0.62166",
                  sim_type: "TF-IDF Cosine Sim",
                },
                {
                  id: "508",
                  spdx_license_identifier: "SMLNJ",
                  name: "Standard ML of New Jersey License",
                  sim_score: "0.44622",
                  sim_type: "TF-IDF Cosine Sim",
                },
              ],
            },
            {
              algorithm: "Ngram算法扫描结果",
              licenses: [
                {
                  id: "463",
                  spdx_license_identifier: "0BSD",
                  name: "BSD Zero Clause License",
                  sim_score: "1.00000",
                  sim_type: "ExactFullText",
                },
                {
                  id: "463",
                  spdx_license_identifier: "0BSD",
                  name: "BSD Zero Clause License",
                  sim_score: "1.00000",
                  sim_type: "CosineSim",
                },
                {
                  id: "629",
                  spdx_license_identifier: "ISC",
                  name: "ISC License",
                  sim_score: "0.95333",
                  sim_type: "CosineSim",
                },
                {
                  id: "451",
                  spdx_license_identifier: "HPND",
                  name: "Historical Permission Notice and Disclaimer",
                  sim_score: "0.83411",
                  sim_type: "CosineSim",
                },
                {
                  id: "508",
                  spdx_license_identifier: "SMLNJ",
                  name: "Standard ML of New Jersey License",
                  sim_score: "0.81368",
                  sim_type: "CosineSim",
                },
              ],
            },
          ],
        };
        this.hasResult = true;
        this.scanResultList = result.scanResultList;
        this.filter(result);
        this.isResultConsistent =
          result.summary === "不同算法扫描都指向同一最有可能的license";
      } catch {
      } finally {
        this.isLoading = false;
      }
    },
    filter(data) {
      let scanResultList = data.scanResultList;
      for (let i = 0; i < scanResultList.length; i++) {
        for (let j = 0; j < scanResultList[i].licenses.length; j++) {
          if (data.summary === "不同算法扫描都指向同一最有可能的license") {
            this.consistentLicense =
              scanResultList[i].licenses[0].spdx_license_identifier;
            this.consistentLicenseId = scanResultList[i].licenses[0].id;
          }
          if (scanResultList[i].licenses[j].sim_type === "ExactFullText") {
            this.hasFullTextMatch = true;
            this.fullTextMatchLicense =
              scanResultList[i].licenses[j].spdx_license_identifier;
            this.fullTextMatchLicenseId = scanResultList[i].licenses[j].id;
            scanResultList[i].licenses = scanResultList[i].licenses.slice(
              j,
              j + 1
            );
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.link {
  text-decoration: none;
}
.copy-info {
  position: relative;
  > div {
    font-size: 14px;
    position: absolute;
    background-color: black;
    color: white;
    border-radius: 6px;
    text-align: center;
    top: 30px;
    left: 50%; /*定位到中间偏右一点*/
    transform: translate(-50%, 0); /*width的一半，左移到正中间*/
    padding: 5px;
    user-select: none;
    white-space: nowrap;
  }
}
.license-text {
  line-height: 1;
  ::v-deep label {
    line-height: 1.5;
  }
  ::v-deep textarea {
    padding: 2px;
    font-size: 14px;
  }
}
.license-success {
  color: #0f5132;
  background-color: #badbcc;
  &:hover {
    background: #badbcc !important;
  }
}
.license-warning {
  color: #664d03;
  background-color: #fff3cd;
  &:hover {
    background: #fff3cd !important;
  }
}

tr,
td {
  &:hover {
    background: transparent !important;
  }
}
</style>
