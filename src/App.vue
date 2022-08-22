<template>
  <div>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </div>
</template>

<script>
import '@/styles/overrides.sass'

export default {
  name: 'App',
  metaInfo: {
    title: 'New Dis',
    titleTemplate: '%s | Material Dashboard Free',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  // mounted() {
  //   document.cookie =
  //     'auth-cookie=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTg3NDE0MTEsInN1YiI6Ijg0In0.MoG4G_JLgAxBts_drJjjQ0BI86VbOjOgNR8ZCicn6Os'
  // }
}
</script>
<style>
html {
  overflow-y: auto !important;
}
</style>
