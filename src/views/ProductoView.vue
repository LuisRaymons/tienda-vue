<template lang="html">
  <div>
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent  v-bind:drawer="drawer"/>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-snackbar v-model="alertactive" :timeout="timeout" :multi-line="multiLine">
           {{msmalert}}
           <template v-slot:action="{ attrs }">
             <v-btn color="blue" text v-bind="attrs" @click="alertactive = false">
               Close
             </v-btn>
           </template>
         </v-snackbar>

        <v-tabs v-model="tab" >
          <v-tab>Datos</v-tab>
          <v-tab>Registro</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-row no-gutters>
            <v-col cols="12" sm="6">
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="searchproducto" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>

            <v-data-table :headers="headertable" :items="data" :search="searchproducto">
              <template v-slot:[`item.actions`]="{ item }">
                 <v-icon  small class="mr-2" @click="editar(item)">
                   mdi-pencil
                 </v-icon>
                 <v-icon small @click="eliminar(item)">
                   mdi-delete
                 </v-icon>
               </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <h3>tab Dos</h3>
          </v-tab-item>
        </v-tabs-items>

      </v-container>
    </v-main>
  </div>
</template>

<script>
import HeaderComponent from '../components/layout/HeaderComponent.vue'
import SliderbarComponent from '../components/layout/SliderbarComponent.vue'

export default {
  name:'ProductoView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        headertable: [
            {text:'id',value:'id'},
            {text:'nombre',value:'nombre'},
            {text:'descripcion',value:'descripcion'},
            {text:'precioPorKilo',value:'precioPorKilo'},
            {text:'img',value:'img'},
            { text: 'Actions', value: 'actions', sortable: false }
        ],
        data:[],
        pagination: {
          descending: true,
          page: 1,
          rowsPerPage: 5,
          //totalItems: 50,
          rowsPerPageItems: [5, 10, 15, 20]
        },
        tab:null,
        searchproducto:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/producto/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){
          var datos = response.data.data;
          datos.forEach((cliente) => {
            this.data.push(cliente);
          });
        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;
    },
    editar(data){
      console.log("-----------Modificando registro-------------");
      console.log(data);
    },
    eliminar(data){
      console.log("--------------eliminando registro--------------");
      console.log(data);
    }

  },
  mounted(){
    this.loadingtabledata();
  }

}
</script>

<style lang="css" scoped>
</style>
