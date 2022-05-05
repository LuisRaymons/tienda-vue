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
              <v-text-field v-model="searchprecio" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>

            <v-data-table :headers="headertable" :items="data" :search="searchprecio">
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
            <v-form ref="formvalidproductprecio" v-model="validformproductprecio" lazy-validation>
              <v-card-text></v-card-text>
              <v-select v-model="selectproductoprecionew" :items="itemsproductprecios" :rules="[() => !!selectproductoprecionew || 'Seleccione el producto para asignar precio']" label="Seleccione el producto para asignar precio" outlined required></v-select>
              <v-text-field v-model="precioproduct" type="number" label="Precio" outlined :rules="[() => !!precioproduct || 'El precio es requerido']" required>
              </v-text-field>

              <v-btn large color="primary" @click="saveproductprice">Guardar</v-btn>
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
                <v-form ref="formvalidproductprecioedit" v-model="validformproductprecioedit" lazy-validation>
                  <v-card-text></v-card-text>
                  <input type="hidden" v-model="idprecioproducto">

                  <v-text-field v-model="selectproductoprecioedit" label="Producto" outlined :rules="[() => !!selectproductoprecioedit || 'El producto es requerido']" disabled required>
                  </v-text-field>

                  <v-text-field v-model="precioproductedit" type="number" label="Precio" outlined :rules="[() => !!precioproductedit || 'El precio es requerido']" required>
                  </v-text-field>

                </v-form>

              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="saveproductpriceedit">Guardar</v-btn>
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
  name:'PrecioProductoView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        headertable: [
            {text:'id',value:'id'},
            {text:'precio',value:'precio'},
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
        searchprecio:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,

        validformproductprecio: true,
        selectproductoprecionew: '',
        itemsproductprecios: [],
        precioproduct:'',

        modaledit: false,
        validformproductprecioedit: true,
        idprecioproducto:0,
        selectproductoprecioedit: '',
        precioproductedit: ''
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/producto/precio/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){
          this.data = [];
          var datos = response.data.data;
          datos.forEach((precio) => {
            this.data.push(precio);
          });

        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;
    },
    loadingproduct(){
      var formdataexistproductprice = new FormData();
      formdataexistproductprice.append('api_token',localStorage.getItem('token_user'));
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/producto/precio/missing',formdataexistproductprice).then((response) => {
        if(response.data.code == 200){

          var datosprice = response.data.data;
          this.itemsproductprecios = [];
          datosprice.forEach((precio) => {
            this.itemsproductprecios.push(precio['nombre']);
          });

        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;
    },
    saveproductprice(){
      if(this.$refs.formvalidproductprecio.validate()){
        var formdataprecioproductonew = new FormData();
        formdataprecioproductonew.append('api_token',localStorage.getItem('token_user'));
        formdataprecioproductonew.append('product',this.selectproductoprecionew);
        formdataprecioproductonew.append('price',this.precioproduct);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/producto/precio/add',formdataprecioproductonew).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.$refs.formvalidproductprecio.reset();
            this.loadingtabledata();
            this.loadingproduct();
          } else if(response.data.code == 402){
            this.msmalert = response.data.msm;
            this.alertactive = true;
          }
        }).catch((error) =>{
          console.log("Error en el try catch");
          console.log(error);
        });
        this.overlay = false;
      }
    },
    saveproductpriceedit(){
      if(this.$refs.formvalidproductprecioedit.validate()){
        var formdataprecioproductoedit = new FormData();
        formdataprecioproductoedit.append('api_token',localStorage.getItem('token_user'));
        formdataprecioproductoedit.append('id',this.idprecioproducto);
        formdataprecioproductoedit.append('price',this.precioproductedit);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/producto/precio/update',formdataprecioproductoedit).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.modaledit = false;
            this.loadingtabledata();
            this.loadingproduct();
          } else if(response.data.code == 402){
            this.msmalert = response.data.msm;
            this.alertactive = true;
          }
        }).catch((error) =>{
          console.log("Error en el try catch");
          console.log(error);
        });
        this.overlay = false;
      }
    },
    editar(data){
      this.idprecioproducto = data.id;
      this.selectproductoprecioedit  = data.producto;
      this.precioproductedit = data.precio;

      this.modaledit = true;
    },
    eliminar(data){
      this.$confirm('¿Deseas eliminar precio del producto :  ' + data.producto + '?').then((res) => {
        if(res){
          var formdatadestroy = new FormData();
          formdatadestroy.append("api_token",localStorage.getItem('token_user'));
          formdatadestroy.append("id",data.id);

          this.overlay = true;

          this.axios.post(process.env.VUE_APP_URL + '/producto/precio/delete',formdatadestroy).then((response) => {

            if(response.data.code == 200){
              this.loadingtabledata();
              this.msmalert = response.data.msm;
              this.alertactive = true;

            } else if(response.data.code == 402){
              this.msmalert = response.data.msm;
              this.alertactive = true;
              this.loadingtabledata();
            }
          }).catch((error) =>{
            console.log("Error en el try catch");
            console.log(error);
          });
          this.overlay = false;
        }
      })
    }
  },
  mounted(){
    this.loadingtabledata();
    this.loadingproduct();
  }
}
</script>

<style lang="css" scoped>
</style>
