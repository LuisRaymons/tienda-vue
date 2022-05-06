<template lang="html">
  <div>
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent  v-bind:drawer="drawer"/>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-overlay :value="overlay" :z-index="zIndex">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          <h6>Cargando informacion</h6>
        </v-overlay>

        <v-snackbar v-model="alertactive" :timeout="timeout" :multi-line="multiLine">
           {{msmalert}}
           <template v-slot:action="{ attrs }">
             <v-btn color="blue" text v-bind="attrs" @click="alertactive = false">
               Close
             </v-btn>
           </template>
        </v-snackbar>

         <v-row>
           <v-col cols="12" sm="6">
           </v-col>

           <v-col cols="12" sm="6">
             <v-text-field v-model="searchalmacen" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
             </v-text-field>
           </v-col>
         </v-row>

         <v-data-table :headers="headertable" :items="data" :search="searchalmacen">
           <template v-slot:[`item.actions`]="{ item }">
              <v-icon  small class="mr-2" @click="editar(item)">
                mdi-pencil
              </v-icon>
            </template>
         </v-data-table>

         <!--- Model editar -->
         <v-dialog v-model="modaledit" transition="dialog-top-transition" max-width="600">
           <template v-slot:default="dialog">
             <v-card>
               <v-toolbar color="primary" dark>Modificar Almacen</v-toolbar>
               <v-card-text>
                 <v-card-text></v-card-text>
                 <v-form ref="formvalidalmacendit" v-model="validformalmacenedit" lazy-validation>
                   <input type="hidden" v-model="ideditalmacen">
                   <input type="hidden" v-model="productalmacen">
                   <v-text-field v-model="entrynumber" type="number" label="Entradas" outlined :rules="[v => v.length > 0 || 'Se requiere de un numero para las entradas',v => Number.isInteger(v) || 'El valor debe ser un número entero',v => v > 0 || 'El valor debe ser mayor que cero.']" required>
                   </v-text-field>

                   <v-text-field v-model="exitnumber" type="number" label="Salidas" outlined :rules="[v => v.length > 0 || 'Se requiere de un numero para las salidas',v => Number.isInteger(v) || 'El valor debe ser un número entero',v => v > 0 || 'El valor debe ser mayor que cero.']" required>
                   </v-text-field>

                   <v-text-field v-model="stocknumber" type="number" label="Stock" outlined :rules="[v => v.length > 0 || 'Se requiere de un numero para las stock',v => Number.isInteger(v) || 'El valor debe ser un número entero',v => v > 0 || 'El valor debe ser mayor que cero.']" required>
                   </v-text-field>
                 </v-form>
               </v-card-text>
               <v-card-actions class="justify-end">
                 <v-btn large color="primary" @click="savealmacenedit">Guardar</v-btn>
                 <v-btn large color="secondary" @click="dialog.value = false">Close</v-btn>
               </v-card-actions>
             </v-card>
           </template>
         </v-dialog>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import HeaderComponent from '../components/layout/HeaderComponent.vue'
import SliderbarComponent from '../components/layout/SliderbarComponent.vue'

export default {
  name:'AlmacenView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        overlay: false,
        zIndex: 300,
        headertable: [
            {text:'id',value:'id'},
            {text:'entrada',value:'entrada'},
            {text:'salida',value:'salida'},
            {text:'stock',value:'stock'},
            {text:'usuario',value:'usuario'},
            {text:'producto',value:'producto'},
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
        searchalmacen:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,
        modaledit: false,
        validformalmacenedit: true,
        ideditalmacen:'',
        productalmacen:'',
        entrynumber:'',
        exitnumber:'',
        stocknumber:''
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/almacen/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datos = response.data.data;
          this.data = [];
          datos.forEach((almacen) => {
            this.data.push(almacen);
          });
          this.overlay = false;

        }
      }).catch((error) =>{
        this.overlay = false;
        console.log("Error en el try catch");
        console.log(error);
      });

    },
    savealmacenedit(){
      if(this.$refs.formvalidalmacendit.validate()){
        var formdataalmacenedit = new FormData();
        formdataalmacenedit.append('api_token',localStorage.getItem('token_user')); // ideditproduct

        formdataalmacenedit.append('id',this.ideditalmacen);
        formdataalmacenedit.append('entry',this.entrynumber);
        formdataalmacenedit.append('exit',this.exitnumber);
        formdataalmacenedit.append('stock',this.stocknumber);
        formdataalmacenedit.append('product',this.productalmacen);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/almacen/update',formdataalmacenedit).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.modaledit = false;
            this.loadingtabledata();

          } else if(response.data.code == 402){
            this.msmalert = response.data.msm;
            this.alertactive = true;
          }
          this.overlay = false;
        }).catch((error) =>{
          this.overlay = false;
          console.log("Error en el try catch");
          console.log(error);
        });
      }
    },
    editar(data){
      this.overlay =  true;
      this.modaledit = true;
      this.ideditalmacen = data.id;
      this.entrynumber = data.entrada;
      this.exitnumber = data.salida;
      this.stocknumber = data.stock;
      this.productalmacen = data.producto;
      this.overlay =  false;
    }
  },
  mounted(){
    this.loadingtabledata();
  }
}
</script>

<style lang="css" scoped>
</style>
