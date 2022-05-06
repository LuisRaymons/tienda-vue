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
              <v-text-field v-model="searchcompra" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>

            <v-data-table :headers="headertable" :items="data" :search="searchcompra">
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
            <v-form ref="formvalidcompra" v-model="validformcompra" lazy-validation>
              <v-card-text></v-card-text>

              <v-text-field v-model="itemproduct" type="number" label="Cantidad de productos" outlined :rules="[() => !!itemproduct || 'Se requiere de un numero de entradas']"  @keypress="isNumber($event)" required>
              </v-text-field>

              <v-text-field v-model="pricetotal" type="number" label="Precio Total de la compra" outlined :rules="[() => !!pricetotal || 'Se requiere de un precio total']" required>
              </v-text-field>

              <v-row>
                <v-col cols="12" sm="10">
                  <v-file-input v-model="fileimgcompra" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-img :lazy-src="imgsrc" max-height="80" max-width="80" :src="imgsrc"></v-img>
                </v-col>
              </v-row>

              <v-select v-model="selectproduct" :items="itemproducts" :rules="[() => !!selectproduct || 'Seleccione una producto']" label="Seleccione una producto" outlined required></v-select>
              <v-select v-model="selectpromotor" :items="itempromotor" :rules="[() => !!selectpromotor || 'Seleccione una promotor']" label="Seleccione un promotor" outlined required></v-select>
              <v-btn large color="primary" @click="savecompra">Guardar</v-btn>
            </v-form>
          </v-tab-item>
        </v-tabs-items>

        <!--- Model editar -->
        <v-dialog v-model="modaledit" transition="dialog-top-transition" max-width="600">
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Modificar Producto</v-toolbar>
              <v-card-text>
                <v-card-text></v-card-text>
                <v-form ref="formvalidcompraedit" v-model="validformcompraedit" lazy-validation>
                  <v-card-text></v-card-text>
                  <input type="hidden" v-model="ideditcompra">

                  <v-text-field v-model="itemproductedit" type="number" label="Cantidad de productos" outlined :rules="[() => !!itemproductedit || 'Se requiere de un numero de entradas']"  @keypress="isNumber($event)" required>
                  </v-text-field>

                  <v-text-field v-model="pricetotaledit" type="number" label="Precio Total de la compra" outlined :rules="[() => !!pricetotaledit || 'Se requiere de un precio total']" required>
                  </v-text-field>

                  <v-row>
                    <v-col cols="12" sm="10">
                      <v-file-input v-model="fileimgcompraedit" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-img :lazy-src="imgsrcedit" max-height="80" max-width="80" :src="imgsrcedit"></v-img>
                    </v-col>
                  </v-row>

                  <v-select v-model="selectproductedit" :items="itemproducts" :rules="[() => !!selectproductedit || 'Seleccione una producto']" label="Seleccione una producto" outlined required></v-select>
                  <v-select v-model="selectpromotoredit" :items="itempromotor" :rules="[() => !!selectpromotoredit || 'Seleccione una promotor']" label="Seleccione un promotor" outlined required></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="savecompraedit">Guardar</v-btn>
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
  name:'CompraView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        overlay: false,
        zIndex: 300,
        headertable: [
            {text:'id',value:'id'},
            {text:'folio',value:'folio'},
            {text:'cantidad_stock',value:'cantidad_stock'},
            {text:'precio_total',value:'precio_total'},
            {text:'img',value:'img'},
            {text:'promotor',value:'promotor'},
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
        searchcompra:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,

        validformcompra:true,
        itemproduct:'',
        pricetotal:'',
        fileimgcompra:[],
        imgsrc:'',
        selectproduct:'',
        itemproducts:[],
        selectpromotor:'',
        itempromotor:[],

        modaledit:false,
        validformcompraedit:true,
        ideditcompra:0,
        itemproductedit:0,
        pricetotaledit:0.00,
        fileimgcompraedit:[],
        imgsrcedit:'',
        selectproductedit:'',
        selectpromotoredit:''
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/compra/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datos = response.data.data;
          this.data = [];
          datos.forEach((promotor) => {
            this.data.push(promotor);
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

          var datosproduct = response.data.data;
          this.itemproducts = [];
          datosproduct.forEach((product) => {
            this.itemproducts.push(product['nombre']);
          });

        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    loadingpromotor(){
      var formdatapromotors = new FormData();
      formdatapromotors.append('api_token',localStorage.getItem('token_user'));

      this.axios.post(process.env.VUE_APP_URL + '/promotor/get/all',formdatapromotors).then((response) => {
        if(response.data.code == 200){
          var datospromotor = response.data.data;
          this.itempromotor = [];
          datospromotor.forEach((promotor) => {
            this.itempromotor.push(promotor['nombre']);
          });

        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    savecompra(){
      if(this.$refs.formvalidcompra.validate()){
        var formdatacompranew = new FormData();
        formdatacompranew.append('api_token',localStorage.getItem('token_user'));

        formdatacompranew.append('stock',this.itemproduct);
        formdatacompranew.append('precio',this.pricetotal);
        formdatacompranew.append('product',this.selectproduct);
        formdatacompranew.append('promotor',this.selectpromotor);
        formdatacompranew.append('userid',localStorage.getItem('id_user'));

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/compra/add',formdatacompranew).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.$refs.formvalidcompra.reset();
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
    savecompraedit(){
      if(this.$refs.formvalidcompraedit.validate()){
        var formdatacompraedit = new FormData();
        formdatacompraedit.append('api_token',localStorage.getItem('token_user'));
        formdatacompraedit.append('id',this.ideditcompra);
        formdatacompraedit.append('stock',this.itemproductedit);
        formdatacompraedit.append('precio',this.pricetotaledit);
        formdatacompraedit.append('producto',this.selectproductedit);
        formdatacompraedit.append('promotor',this.selectpromotoredit);
        formdatacompraedit.append('user',localStorage.getItem('id_user'));

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/compra/update',formdatacompraedit).then((response) => {
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
      this.ideditcompra = data.id;
      this.itemproductedit = data.cantidad_stock;
      this.pricetotaledit = data.precio_total;
      this.imgsrcedit = data.img;
      this.selectproductedit = data.producto;
      this.selectpromotoredit = data.promotor;

      this.modaledit = true;
      this.overlay =  false;
    },
    eliminar(data){
      this.$confirm('¿Deseas eliminar la compra con folio:  ' + data.folio + '?').then((res) => {
        if(res){
          var formdatadestroy = new FormData();
          formdatadestroy.append("api_token",localStorage.getItem('token_user'));
          formdatadestroy.append("id",data.id);

          this.overlay = true;

          this.axios.post(process.env.VUE_APP_URL + '/compra/delete',formdatadestroy).then((response) => {

            if(response.data.code == 200){
              this.loadingtabledata();
              this.msmalert = response.data.msm;
              this.alertactive = true;

            } else if(response.data.code == 402){
              this.msmalert = response.data.msm;
              this.alertactive = true;
              this.loadingtabledata();
            }
            this.overlay = false;
          }).catch((error) =>{
            this.overlay = false;
            console.log("Error en el try catch");
            console.log(error);
          });
        }
      })
    },
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      console.log(charCode);
      var numberscode = [48,49,50,51,52,53,54,55,56,57]
      //if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode == 46 && charCode == 101) {
      if (!numberscode.includes(charCode)) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  },
  mounted(){
    this.loadingtabledata();
    this.loadingproducts();
    this.loadingpromotor();
  }
}
</script>

<style lang="css" scoped>
</style>
