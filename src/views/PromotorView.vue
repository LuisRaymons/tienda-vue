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
              <v-text-field v-model="searchpromotor" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>

            <v-data-table :headers="headertable" :items="data" :search="searchpromotor">
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
            <v-form ref="formvalidpromotor" v-model="validformpromotor" lazy-validation>
              <v-card-text></v-card-text>
              <v-text-field v-model="namepromotor" label="Nombre" outlined :rules="[() => !!namepromotor || 'El nombre es requerido']" required>
              </v-text-field>

              <v-text-field v-model="addresspromotor" label="Direcion" outlined :rules="[() => !!addresspromotor || 'La direccion es requerida']" required>
              </v-text-field>

              <v-text-field v-model="phonepromotor" label="Telefono" outlined :rules="[() => !!phonepromotor || 'El telefono es requerido']" required>
              </v-text-field>

              <v-text-field v-model="webpromotor" label="Citio Web" outlined>
              </v-text-field>

              <v-row>
                <v-col cols="12" sm="10">
                  <v-file-input v-model="fileimgpromotor" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-img :lazy-src="imgsrc" max-height="80" max-width="80" :src="imgsrc"></v-img>
                </v-col>
              </v-row>

              <v-btn large color="primary" @click="savepromotor">Guardar</v-btn>
            </v-form>
          </v-tab-item>
        </v-tabs-items>

        <!--- Model editar -->
        <v-dialog v-model="modaledit" transition="dialog-top-transition" max-width="600">
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Modificar Promotor</v-toolbar>
              <v-card-text>
                <v-card-text></v-card-text>
                <v-form ref="formvalidpromotoredit" v-model="validformpromotoredit" lazy-validation>
                  <v-card-text></v-card-text>
                  <input type="hidden" v-model="idpromotoredit">
                  <v-text-field v-model="namepromotoredit" label="Nombre" outlined :rules="[() => !!namepromotoredit || 'El nombre es requerido']" required>
                  </v-text-field>

                  <v-text-field v-model="addresspromotoredit" label="Direcion" outlined :rules="[() => !!addresspromotoredit || 'La direccion es requerida']" required>
                  </v-text-field>

                  <v-text-field v-model="phonepromotoredit" label="Telefono" outlined :rules="[() => !!phonepromotoredit || 'El telefono es requerido']" required>
                  </v-text-field>

                  <v-text-field v-model="webpromotoredit" label="Citio Web" outlined>
                  </v-text-field>

                  <v-row>
                    <v-col cols="12" sm="10">
                      <v-file-input v-model="fileimgpromotoredit" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-img :lazy-src="imgsrcedit" max-height="80" max-width="80" :src="imgsrcedit"></v-img>
                    </v-col>
                  </v-row>

                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="savepromotoredit">Guardar</v-btn>
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
  name:'PromotorView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        headertable: [
            {text:'id',value:'id'},
            {text:'nombre',value:'nombre'},
            {text:'direccion',value:'direccion'},
            {text:'telefono',value:'telefono'},
            {text:'sitioWeb',value:'sitioWeb'},
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
        searchpromotor:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,

        validformpromotor:true,
        namepromotor:'',
        addresspromotor:'',
        phonepromotor:'',
        webpromotor:'',
        fileimgpromotor:[],
        imgsrc:'',

        idpromotoredit:'',
        modaledit:'',
        validformpromotoredit:true,
        namepromotoredit:'',
        addresspromotoredit:'',
        phonepromotoredit:'',
        webpromotoredit:'',
        fileimgpromotoredit:[],
        imgsrcedit:'',

      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/promotor/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datos = response.data.data;
          this.data  = [];
          datos.forEach((promotor) => {
            this.data.push(promotor);
          });

        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;
    },
    savepromotor(){

      if(this.$refs.formvalidpromotor.validate()){
        var formnewpromotor = new FormData();
        formnewpromotor.append('api_token',localStorage.getItem('token_user'));
        formnewpromotor.append('name',this.namepromotor);
        formnewpromotor.append('address',this.addresspromotor);
        formnewpromotor.append('phone',this.phonepromotor);
        formnewpromotor.append('website',this.webpromotor);
        formnewpromotor.append('img',this.fileimgpromotor);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/promotor/add',formnewpromotor).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.$refs.formvalidpromotor.reset();
            this.loadingtabledata();
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
    savepromotoredit(){
      if(this.$refs.formvalidpromotoredit.validate()){
        var formdatapromotoredit = new FormData();
        formdatapromotoredit.append('api_token',localStorage.getItem('token_user'));

        formdatapromotoredit.append('id',this.idpromotoredit);
        formdatapromotoredit.append('name',this.namepromotoredit);
        formdatapromotoredit.append('address',this.addresspromotoredit);
        formdatapromotoredit.append('phone',this.phonepromotoredit);
        formdatapromotoredit.append('website',this.webpromotoredit);
        formdatapromotoredit.append('img',this.fileimgpromotoredit);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/promotor/update',formdatapromotoredit).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.modaledit = false;
            this.loadingtabledata();
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

      this.idpromotoredit = data.id;
      this.namepromotoredit = data.nombre;
      this.addresspromotoredit = data.direccion;
      this.phonepromotoredit = data.telefono;
      this.webpromotoredit = data.sitioWeb;
      this.imgsrcedit = data.img;

      this.modaledit = true;
    },
    eliminar(data){

      this.$confirm('¿Deseas eliminar al promotor ' + data.nombre + '?').then((res) => {
        if(res){
          var formdatadestroy = new FormData();
          formdatadestroy.append("api_token",localStorage.getItem('token_user'));
          formdatadestroy.append("id",data.id);

          this.overlay = true;

          this.axios.post(process.env.VUE_APP_URL + '/promotor/delete',formdatadestroy).then((response) => {

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
  }
}
</script>

<style lang="css" scoped>
</style>
