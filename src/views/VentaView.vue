<template lang="html">
  <div>
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent  v-bind:drawer="drawer"/>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-data-table :headers="headertable" :items="data" :pagination="pagination">
        </v-data-table>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import HeaderComponent from '../components/layout/HeaderComponent.vue'
import SliderbarComponent from '../components/layout/SliderbarComponent.vue'

export default {
  name:'VentaView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        headertable: [
            {text:'id',value:'id'},
            {text:'factura',value:'factura'},
            {text:'precio_total',value:'precio_total'},
            {text:'pago',value:'pago'},
            {text:'cliente',value:'cliente'},
            {text:'usuario',value:'usuario'}
        ],
        data:[],
        pagination: {
          descending: true,
          page: 1,
          rowsPerPage: 5,
          //totalItems: 50,
          rowsPerPageItems: [5, 10, 15, 20]
        },
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/venta/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datos = response.data.data;
          datos.forEach((venta) => {
            this.data.push(venta);
          });

        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;
    }
  },
  mounted(){
    this.loadingtabledata();
  }
}
</script>

<style lang="css" scoped>
</style>
