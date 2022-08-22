<template>
  <v-card>
    <v-card-title class=""> 风险数据详情 </v-card-title>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      class="elevation-1"
      :light="true"
      disable-sort
    >
      <template v-slot:item.name="{ item }">
        <span class="primary--text pointer">
          {{ item.name }}
        </span>
      </template>
      <template v-slot:item.iron="{ item }">
        <span @click="openDetail" class="primary--text pointer">
          {{ item.iron }}
        </span>
      </template>
      <!-- <template v-slot:item.name="{ item }">

      <a href="" class="text-decoration-none">
        {{ item.name }}
      </a>
    </template> -->
    </v-data-table>
    <drawer title="test" width="800" :visible.sync="drawerVisible">
      <v-tabs v-model="tabs" align-with-title class="mb-5">
        <v-tab href="#one"> 疑似开源代码片段 </v-tab>
        <v-tabs-slider color="pink"></v-tabs-slider>
      </v-tabs>
      <div class="drawer-content">
        <div>
          <monaco-editor type="local" height="100px" />
        </div>
        <div>
          <monaco-editor />
        </div>
      </div>
    </drawer>
  </v-card>
</template>

<script>
import MonacoEditor from './MonacoEditot.vue'
export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      tabs: '',
      drawerVisible: false,
      headers: [
        {
          text: '文件名',
          value: 'name'
        },
        { text: '类型', value: 'calories' },
        { text: '代码行', value: 'fat' },
        { text: '开源软件代码行', value: 'carbs' },
        { text: '匹配度', value: 'protein' },
        { text: '组件名称', value: 'iron' },
        { text: '开源软件文件名', value: 'iron' },
        { text: '分析结果', value: 'iron' },
        { text: '风险状态', value: 'iron' },
        { text: '漏洞', value: 'iron' }
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%'
        }
      ]
    }
  },
  methods: {
    openDetail() {
      this.drawerVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.drawer-content {
  width: 100%;
  display: flex;
  > div {
    width: 50%;
  }
}
</style>
