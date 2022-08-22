<template>
  <div v-if="visible" class="drawer">
    <div v-show="visible" class="v-drawer" :style="{ width: width + 'px' }">
      <div v-if="title" class="text-h3 drawer-title">
        <span class="text">{{ title }}</span>
        <v-icon @click="close">mdi-close</v-icon>
      </div>
      <div class="drawer-body"><slot></slot></div>
    </div>
    <v-overlay :value="visible"></v-overlay>
  </div>
</template>

<script>
export default {
  name: 'Drawer',
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '400'
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    close() {
      // this.visible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-drawer {
  box-shadow: 0 8px 10px -5px rgb(0 0 0 / 20%), 0 16px 24px 2px rgb(0 0 0 / 14%),
    0 6px 30px 5px rgb(0 0 0 / 12%);
  height: 100vh;
  background: white;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  .drawer-title {
    // border-bottom: 1px solid #ccc;
    padding: 5px 10px;
    display: flex;
    .text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px;
  }
}</style
>>
