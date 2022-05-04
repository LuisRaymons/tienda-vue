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
            <v-form ref="formvalidproduct" v-model="validformproduct" lazy-validation>
              <v-card-text></v-card-text>
              <v-text-field v-model="name" label="Nombre" outlined :rules="[() => !!name || 'El nombre es requerido']" required>
              </v-text-field>

              <v-textarea v-model="description" outlined name="input-7-4" label="Descripcion"></v-textarea>

              <v-checkbox v-model="checkboxpricekilo">
                <template v-slot:label>
                  <div>
                    Precio por Kilo
                  </div>
                </template>
              </v-checkbox>
              <v-row>
                <v-col cols="12" sm="10">
                  <v-file-input v-model="fileimgproduct" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-img :lazy-src="imgsrc" max-height="80" max-width="80" :src="imgsrc"></v-img>
                </v-col>
              </v-row>

              <v-select v-model="selectcategoria" :items="itemcategorias" :rules="[() => !!selectcategoria || 'Seleccione una categoria']" label="Seleccione una categoria" outlined required></v-select>
              <v-btn large color="primary" @click="saveproduct">Guardar</v-btn>
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
                <v-form ref="formvalidproductedit" v-model="validformproductedit" lazy-validation>
                  <v-card-text></v-card-text>
                  <input type="hidden" v-model="ideditproduct">
                  <v-text-field v-model="nameedit" label="Nombre" outlined :rules="[() => !!nameedit || 'El nombre es requerido']" required>
                  </v-text-field>

                  <v-textarea v-model="descriptionedit" outlined name="input-7-4" label="Descripcion"></v-textarea>

                  <v-checkbox v-model="checkboxpricekiloedit">
                    <template v-slot:label>
                      <div>
                        Precio por Kilo
                      </div>
                    </template>
                  </v-checkbox>
                  <v-row>
                    <v-col cols="12" sm="10">
                      <v-file-input v-model="fileimgproductedit" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-img :lazy-src="imgsrcedit" max-height="80" max-width="80" :src="imgsrcedit"></v-img>
                    </v-col>
                  </v-row>

                  <v-select v-model="selectcategoriaedit" :items="itemcategorias" :rules="[() => !!selectcategoriaedit || 'Seleccione una categoria']" label="Seleccione una categoria" outlined required></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="saveproductedit">Guardar</v-btn>
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
        validformproduct: true,
        name: '',
        description: '',
        checkboxpricekilo:false,
        fileimgproduct: [],
        imgsrc: '',
        selectcategoria:'',
        itemcategorias:[],

        modaledit: false,
        validformproductedit:true,
        ideditproduct:'',
        nameedit:'',
        descriptionedit:'',
        checkboxpricekiloedit:false,
        fileimgproductedit: [],
        imgsrcedit: '',
        selectcategoriaedit: '',
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
    loadingctegoria(){
      var formdatacategoria = new FormData();
      formdatacategoria.append('api_token',localStorage.getItem('token_user'));

      this.axios.post(process.env.VUE_APP_URL + '/categoria/producto/get/all',formdatacategoria).then((response) => {
        if(response.data.code == 200){
          var datos = response.data.data;
          datos.forEach((categoria) => {
            this.itemcategorias.push(categoria['nombre']);
          });
        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    saveproduct(){
      if(this.$refs.formvalidproduct.validate()){
        var formdatanewproduct = new FormData();
        formdatanewproduct.append('api_token',localStorage.getItem('token_user'));

        formdatanewproduct.append('name',this.name);
        formdatanewproduct.append('description',this.description);
        formdatanewproduct.append('categoria',this.selectcategoria);
        formdatanewproduct.append('pricekilo',this.checkboxpricekilo);
        formdatanewproduct.append('img',this.fileimgproduct);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/producto/add',formdatanewproduct).then((response) => {
          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.$refs.formvalidproduct.reset();
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
    saveproductedit(){

      if(this.$refs.formvalidproductedit.validate()){
        var formdataeditproduct = new FormData();
        formdataeditproduct.append('api_token',localStorage.getItem('token_user'));

        formdataeditproduct.append('id',this.ideditproduct);
        formdataeditproduct.append('name',this.nameedit);
        formdataeditproduct.append('description',this.descriptionedit);
        formdataeditproduct.append('categoria',this.selectcategoriaedit);
        formdataeditproduct.append('pricekilo',this.checkboxpricekiloedit);
        formdataeditproduct.append('img',this.fileimgproductedit);

        this.overlay = true;
        this.axios.post(process.env.VUE_APP_URL + '/producto/update',formdataeditproduct).then((response) => {
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
      this.ideditproduct = data.id;
      this.nameedit = data.nombre;
      this.descriptionedit = data.descripcion;
      this.checkboxpricekiloedit = (data.precioPorKilo == "true") ? true : false;
      this.imgsrcedit = data.img;
      this.selectcategoriaedit = data.categoria;

      this.modaledit = true;
    },
    eliminar(data){
      this.$confirm('¿Deseas eliminar al producto ' + data.nombre + '?').then((res) => {
        if(res){
          var formdatadestroy = new FormData();
          formdatadestroy.append("api_token",localStorage.getItem('token_user'));
          formdatadestroy.append("id",data.id);

          this.overlay = true;

          this.axios.post(process.env.VUE_APP_URL + '/producto/delete',formdatadestroy).then((response) => {

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
    this.loadingctegoria();
  }

}
</script>

<style lang="css" scoped>
</style>
