<template lang="html">
  <div>
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent  v-bind:drawer="drawer"/>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-overlay :value="overlay" :z-index="zIndex">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
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
             <v-btn depressed color="primary" @click="modalnewventa = !modalnewventa">
                Nueva Venta
              </v-btn>
           </v-col>

           <v-col cols="12" sm="6">
             <v-text-field v-model="searchventa" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
             </v-text-field>
           </v-col>
         </v-row>

          <v-data-table :headers="headertable" :items="data" :search="searchventa">
            <template v-slot:[`item.actions`]="{ item }">
               <v-icon  small class="mr-2" @click="detail(item)">
                 mdi-ballot-outline
               </v-icon>
               <v-icon small @click="editar(item)">
                 mdi-delete
               </v-icon>
             </template>
          </v-data-table>

          <!--- Model Nueva venta -->
          <v-dialog v-model="modalnewventa" transition="dialog-top-transition" max-width="900">
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" dark>Nueva venta</v-toolbar>
                <v-card-text>

                  <v-row>
                    <v-col cols="12" sm="8">
                      <v-card-text>Crear Venta</v-card-text>
                      <v-form ref="formvalidventanew" v-model="validformventanew" lazy-validation>

                        <v-select v-model="selectclient" :items="itemclients" item-text="text" item-value="value" :rules="[() => !!selectclient || 'Seleccione una cliente']" label="Seleccione una cliente" outlined required>
                        </v-select>

                        <v-row>
                          <v-col cols="12" sm="10">
                            <v-select v-model="selectproduct" :items="itemsproducts" item-text="text" item-value="value" :rules="[() => !!selectproduct || 'Seleccione un productos']" label="Seleccione un productos" outlined required>
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="2">
                            <v-btn class="mx-2" fab dark color="indigo" @click="btnaddproduct">
                              <v-icon dark>
                                mdi-plus
                              </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>

                        <v-select v-model="selectpagotype" :items="itemspagostype" item-text="text" item-value="value" :rules="[() => !!selectpagotype || 'Seleccione el tipo de pago']" label="Seleccione el tipo de pago" outlined required>
                        </v-select>
                      </v-form>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <h3>Nueva venta</h3>
                      <table>
                        <thead>
                          <tr bgcolor="#6043ff">
                            <th>Cantidad</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Accion</th>
                          </tr>
                        </thead>
                        <tbody>
                        </tbody>
                      </table>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn large color="secondary" @click="dialog.value = false">Cancelar</v-btn>
                  <v-btn large color="primary" @click="paypalventa">Pagar</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>


          <!--- Model editar -->
          <v-dialog v-model="modaldetailventa" transition="dialog-top-transition" max-width="600">
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" dark>Detalle de la venta</v-toolbar>
                <v-card-text>
                  <v-card-text></v-card-text>
                  <h3>Detalle de la venta</h3>
                  <div class="modal-body">
                    <h5>Detalle de la venta <span class="detailmodaltext">{{facturaid}}</span></h5>
                    <h5>Cliente <span class="detailmodaltext">{{clienteventa}}</span></h5>
                    <h5>Atendido por <span class="detailmodaltext">{{userventa}}</span></h5>
                    <h5>Pago <span class="detailmodaltext">{{pagoventa}}</span></h5>

                    <div id="tablecontainer">
                      <table width="100%" border="">
                        <thead>
                          <tr bgcolor="blue" id="idtableventadetail">
                            <th>cantidad</th>
                            <th>producto</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in datosdetailtable" :key="item.producto">
                            <td>{{item.cantidad}}</td>
                            <td>{{item.producto}}</td>
                          </tr>

                        </tbody>
                      </table>
                    </div>

                  </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn large color="secondary" @click="dialog.value = false">Aceptar</v-btn>
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
  name:'VentaView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        overlay: false,
        zIndex: 300,
        headertable: [
            {text:'id',value:'id'},
            {text:'factura',value:'factura'},
            {text:'precio_total',value:'precio_total'},
            {text:'pago',value:'pago'},
            {text:'cliente',value:'cliente'},
            {text:'usuario',value:'usuario'},
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
        searchventa:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,
        modaldetailventa:false,

        facturaid:'',
        clienteventa:'',
        userventa:'',
        pagoventa:'',
        datosdetailtable: [],
        modalnewventa:false,
        validformventanew:true,
        selectclient:'',
        itemclients:[],
        selectproduct:'',
        itemsproducts:[],
        selectpagotype:'',
        itemspagostype:[]
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
          this.overlay = false;

        }
      }).catch((error) =>{
        this.overlay = false;
        console.log("Error en el try catch");
        console.log(error);
      });

    },
    loadingclients(){
      var formdataclients = new FormData();
      formdataclients.append('api_token',localStorage.getItem('token_user'));

      this.axios.post(process.env.VUE_APP_URL + '/cliente/get/all',formdataclients).then((response) => {
        if(response.data.code == 200){

          var datosclients = response.data.data;
          this.itemclients = [];
          datosclients.forEach((client) => {
            this.itemclients.push({"value":client['id'],"text":client['nombre']});
          });
          this.overlay = false;

        }
      }).catch((error) =>{
        this.overlay = false;
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    loadingproducts(){
      var formdataproducts = new FormData();
      formdataproducts.append('api_token',localStorage.getItem('token_user'));

      this.axios.post(process.env.VUE_APP_URL + '/producto/get/all',formdataproducts).then((response) => {
        if(response.data.code == 200){

          var datosproducts = response.data.data;
          this.itemsproducts = [];
          datosproducts.forEach((product) => {
            this.itemsproducts.push({"value":product['id'],"text":product['nombre']});
          });
          this.overlay = false;

        }
      }).catch((error) =>{
        this.overlay = false;
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    loadingtypepago(){

      this.axios.get(process.env.VUE_APP_URL + '/get/pago').then((response) => {
        if(response.data.code == 200){

          var datostypepago = response.data.data;
          this.itemspagostype = [];
          datostypepago.forEach((typepay) => {
            this.itemspagostype.push({"value":typepay['id'],"text":typepay['name']});
          });
          this.overlay = false;

        }
      }).catch((error) =>{
        this.overlay = false;
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    editar(data){
      this.overlay =  true;
      console.log("-----------Modificando registro-------------");
      console.log(data);
      this.overlay =  false;
    },
    detail(data){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('id',data.id);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/venta/detalle/one',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datosdetail = response.data.data;

          this.facturaid = datosdetail[0].factura;
          this.clienteventa = datosdetail[0].cliente;
          this.userventa = datosdetail[0].usuario;
          this.pagoventa = datosdetail[0].tipopago;

          this.datosdetailtable = [];

          datosdetail.forEach((vd) => {
            this.datosdetailtable.push(vd);
          });

          this.modaldetailventa = true;
          this.overlay =  false;
        }
      }).catch((error) =>{
        this.overlay = false;
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;
    },
    btnaddproduct(){
      console.log("----------Agregando producto-------------");
      console.log(this.selectproduct);
    },
    paypalventa(){
      console.log("-------------recontandando datos de la venta---------------");
    }
  },
  mounted(){
    this.loadingtabledata();
    this.loadingclients();
    this.loadingproducts();
    this.loadingtypepago();
  }
}
</script>

<style lang="css" scoped>
  .detailmodaltext{
    color:red;
  }
  #idtableventadetail{
    color: white;
    text-align: center;
  }
</style>
