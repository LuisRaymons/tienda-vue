<template>
  <div class="home">
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent v-bind:drawer="drawer"/>

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
              <v-text-field v-model="searchcategoria" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>
            <v-data-table :headers="headertable" :items="datos" :search="searchcategoria">
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
            <v-row no-gutters>
              <v-col cols="12" sm="12">
                <v-card-text></v-card-text>
                <v-form ref="formvalidcategorianew" v-model="validformcategoria" lazy-validation>
                  <v-text-field v-model="namecategoria"  label="Nombre" outlined :rules="[() => !!namecategoria || 'El nombre es requerido']" required autofocus>
                  </v-text-field>
                  <v-btn large color="primary" @click="savecategorianew">
                    Guardar
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>

        <!--- Model editar -->
        <v-dialog v-model="modaledit" transition="dialog-top-transition" max-width="600">

          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Modificar categoria de producto</v-toolbar>
              <v-card-text>
                <v-card-text></v-card-text>
                <v-form ref="formvalidcategoriaedit" v-model="validformcategoriaedit" lazy-validation>
                  <input type="hidden" v-model="idcategoriaedit">
                  <v-text-field v-model="namecategoriaedit" label="Nombre" outlined :rules="[() => !!namecategoriaedit || 'El nombre es requerido']" required autofocus>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="savecategoriaedit">Guardar</v-btn>
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
    name: 'CategoriaView',
    components: {HeaderComponent,SliderbarComponent},
    data:()=>{
        return {
          drawer: true,
          overlay: false,
          zIndex: 300,
          headertable: [{text:'id',value:'id'},{text:'nombre',value:'nombre'},{ text: 'Actions', value: 'actions', sortable: false }],
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
          searchcategoria:'',
          namecategoria: '',
          validformcategoria: true,
          msmalert:'',
          alertactive:false,
          multiLine: true,
          timeout: 4000,
          modaledit:false,
          validformcategoriaedit:true,
          idcategoriaedit: '',
          namecategoriaedit: '',
          modaldelete: false
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
            this.data = [];
            datos.forEach((categoria) => {
              this.datos.push(categoria);
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
        this.idcategoriaedit = data.id;
        this.namecategoriaedit = data.nombre;
        this.modaledit = true;
        this.overlay = false;
      },
      eliminar(data){
        this.$confirm('¿Deseas eliminar la categoria ' + data.nombre + '?').then((res) => {
          if(res){
            var formdatadestroy = new FormData();
            formdatadestroy.append("api_token",localStorage.getItem('token_user'));
            formdatadestroy.append("id",data.id);
            this.overlay =  true;

            this.axios.post(process.env.VUE_APP_URL + '/categoria/producto/delete',formdatadestroy).then((response) => {

              if(response.data.code == 200){
                this.loadingtabledata();
                this.msmalert = response.data.msm;
                this.alertactive = true;

              } else if(response.data.code == 402){
                this.msmalert = response.data.msm;
                this.alertactive = true;
                this.loadingtabledata();
              }
              this.overlay =  false;
            }).catch((error) =>{
              this.overlay = false;
              console.log("Error en el try catch");
              console.log(error);
            });

          }
        })
      },
      savecategorianew(){
        if(this.$refs.formvalidcategorianew.validate()){

          var formdata = new FormData();
          formdata.append("api_token",localStorage.getItem('token_user'));
          formdata.append("nombre",this.namecategoria);
          this.overlay =  true;

          this.axios.post(process.env.VUE_APP_URL + '/categoria/producto/add',formdata).then((response) => {

            if(response.data.code == 200){
              this.msmalert = response.data.data;
              this.alertactive = true;
              this.$refs.formvalidcategorianew.reset()
              this.loadingtabledata();
            } else if(response.data.code == 402){
              this.msmalert = response.data.msm;
              this.alertactive = true;
            }
            this.overlay =  false;
          }).catch((error) =>{
            this.overlay =  false;
            console.log("Error en el try catch");
            console.log(error);
          });
        }
      },
      savecategoriaedit(){
        if(this.$refs.formvalidcategoriaedit.validate()){

          var formdataeditcategoria = new FormData();
          formdataeditcategoria.append('api_token',localStorage.getItem('token_user'));
          formdataeditcategoria.append('id',this.idcategoriaedit);
          formdataeditcategoria.append('nombre',this.namecategoriaedit);
          this.overlay =  true;

          this.axios.post(process.env.VUE_APP_URL + '/categoria/producto/update',formdataeditcategoria).then((response) => {
            if(response.data.code == 200){
              this.msmalert = response.data.msm;
              this.alertactive = true;
              this.loadingtabledata();
              this.modaledit = false;
            } else if(response.data.code == 402){
              this.msmalert = response.data.msm;
              this.alertactive = true;
            }
            this.overlay =  false;
          }).catch((error) =>{
            this.overlay =  false;
            console.log("Error en el try catch");
            console.log(error);
          });


        }
      }
    },
    mounted(){
      this.loadingtabledata();
    },

  }
</script>

<style media="screen">

</style>
