<template lang="html">
  <v-app-bar app color="black" elevate-on-scroll elevation="4" dark scroll-target="#scrolling-techniques-6" absolute>
      <v-app-bar-nav-icon @click="$emit('drawerEvent')"></v-app-bar-nav-icon>
      <v-toolbar-title>Tienda LRVA</v-toolbar-title>
      <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  name:'HeaderComponent',
  data:()=>{
    return {
      msm:'Hola'
    }
  }
}
</script>

<style lang="css" scoped>
</style>
