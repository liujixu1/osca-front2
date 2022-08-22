<template>
  <v-list
    expand
    nav
    v-bind="$attrs"
    v-on="$listeners"
    flat
  >
    <template v-for="(item, i) in items">
      <default-list-group
        v-if="item.items"
        :key="`${item.title}-group-${i}`"
        :item="item"
        :level="1"
      />

      <default-list-item
        v-else
        :key="`${item.title}-item-${i}`"
        :item="item"
        :level="1"
      />
    </template>
  </v-list>
</template>

<script>
  export default {
    name: 'DefaultList',

    components: {
      DefaultListGroup: () => import('./ListGroup'),
      DefaultListItem: () => import('./ListItem'),
    },

    props: {
      items: {
        type: Array,
        default: () => ([]),
      },
    },
  }
</script>
