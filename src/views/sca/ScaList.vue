<template>
  <v-card>
    <v-card-title class=""> 风险数据看板 </v-card-title>
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
        <span class="primary--text pointer">
          {{ item.iron }}
        </span>
      </template>
      <!-- <template v-slot:item.name="{ item }">

      <a href="" class="text-decoration-none">
        {{ item.name }}
      </a>
    </template> -->
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    repoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        {
          text: '代码仓',
          value: 'url'
        },
        { text: '最新扫描时间', value: 'updateTime' },
        { text: '任务状态', value: 'fat' },
        { text: '分支', value: 'monitoredBranch' },
        { text: 'Commitld', value: 'protein' },
        { text: '风险总数', value: 'iron' },
        { text: '待处理风险数', value: 'iron' }
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
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%'
        }
      ]
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
