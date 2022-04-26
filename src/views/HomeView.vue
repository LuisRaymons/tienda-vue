<template>
  <div class="home">
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent  v-bind:drawer="drawer"/>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <h3>View HomeView</h3>
      </v-container>
    </v-main>

  </div>
</template>

<script>
  import HeaderComponent from '../components/layout/HeaderComponent.vue'
  import SliderbarComponent from '../components/layout/SliderbarComponent.vue'

  export default {
    name: 'HomeView',
    components: {HeaderComponent,SliderbarComponent},
    data:()=>{
        return {
          drawer: true
        }
    }
  }
</script>

<style media="screen">

</style>
