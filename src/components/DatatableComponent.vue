<template lang="html">
  <div>
    <h3>Datatable</h3>
    <v-data-table :headers="headertable" :items="data" :items-per-page="itempag" :page="1">
    </v-data-table>
  </div>
</template>

<script>
export default {
  name:'DatatableComponent',
  props:['headertable','data','itempag'],
  data:()=>{
    return {

    }
  },
  mounted(){
    console.log("----------------Entre datatable----------------");
    console.log(this.data)
    console.log(this.itempag)
  }

}
</script>

<style lang="css" scoped>
</style>
