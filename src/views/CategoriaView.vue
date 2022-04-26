<template>
  <div class="home">
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent v-bind:drawer="drawer"/>

    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-tabs v-model="tab" background-color="transparent" color="basil" grow right>
          <v-tab>One</v-tab>
          <v-tab>Two</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-data-table :headers="headertable" :items="datos" :pagination.sync="pagination">
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <h3>tab Dos</h3>
          </v-tab-item>
        </v-tabs-items>

      <!--
        <v-data-table :headers="headertable" :items="datos" :pagination.sync="pagination">
        </v-data-table>
      -->
      </v-container>
    </v-main>

  </div>
</template>

<script>
  import HeaderComponent from '../components/layout/HeaderComponent.vue'
  import SliderbarComponent from '../components/layout/SliderbarComponent.vue'

  export default {
    name: 'CategoriaView',
    components: {HeaderComponent,SliderbarComponent},
    data:()=>{
        return {
          drawer: true,
          headertable: [{text:'id',value:'id'},{text:'nombre',value:'nombre'}],
          datos:[],
          tab:null,
          pagination: {
            descending: true,
            page: 1,
            rowsPerPage: 5,
            sortBy: "date",
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

        this.axios.post(process.env.VUE_APP_URL + '/categoria/producto/get/all',formdatatable).then((response) => {

          if(response.data.code == 200){

            var datos = response.data.data;
            datos.forEach((categoria) => {
              this.datos.push(categoria);
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

<style media="screen">

</style>
