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
              <v-text-field v-model="searchcliente" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>

            <v-data-table :headers="headertable" :items="data" :search="searchcliente">
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
            <v-form ref="formvalidclient" v-model="validformcategoria" lazy-validation>
              <v-card-text></v-card-text>
              <v-text-field v-model="nameclient" label="Nombre" outlined :rules="[() => !!nameclient || 'El nombre es requerido']" required>
              </v-text-field>
              <v-text-field v-model="lastnameclient" label="Apellidos" outlined :rules="[() => !!lastnameclient || 'Los apellidos son requerido']" required>
              </v-text-field>
              <v-text-field v-model="phoneclient" label="Telefono" outlined :rules="[() => !!phoneclient || 'El telefono es requerido']" required>
              </v-text-field>
              <v-text-field v-model="addressclient" label="Direccion" outlined :rules="[() => !!addressclient || 'La direccion es requerido']" required>
              </v-text-field>
              <v-text-field v-model="cpclient" label="Codigo Postal" outlined :rules="[() => !!cpclient || 'El codigo postal es requerido']" @change="searchcp" required>
              </v-text-field>
              <v-select v-model="selectedcoloniaclient" :items="itemscolonia" :rules="[() => !!selectedcoloniaclient || 'Seleccione una colonia']" label="Seleccione un codigo postal" outlined required></v-select>

              <v-row>
                <v-col cols="12" sm="10">
                  <v-file-input v-model="fileimgclient" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-img :lazy-src="imgsrc" max-height="80" max-width="80" :src="imgsrc"></v-img>
                </v-col>
              </v-row>
              <v-btn large color="primary" @click="savecliente">Guardar</v-btn>
            </v-form>
          </v-tab-item>
        </v-tabs-items>

        <!--- Model editar -->
        <v-dialog v-model="modaledit" transition="dialog-top-transition" max-width="600">
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Modificar Cliente</v-toolbar>
              <v-card-text>
                <v-card-text></v-card-text>
                <v-form ref="formvalidclienteedit" v-model="validformcategoriaedit" lazy-validation>
                  <input type="hidden" v-model="idclientedit">
                  <v-text-field v-model="nameclientedit" label="Nombre" outlined :rules="[() => !!nameclientedit || 'El nombre es requerido']" required>
                  </v-text-field>
                  <v-text-field v-model="lastnameclientedit" label="Apellidos" outlined :rules="[() => !!lastnameclientedit || 'Los apellidos son requerido']" required>
                  </v-text-field>
                  <v-text-field v-model="phoneclientedit" label="Telefono" outlined :rules="[() => !!phoneclientedit || 'El telefono es requerido']" required>
                  </v-text-field>
                  <v-text-field v-model="addressclientedit" label="Direccion" outlined :rules="[() => !!addressclientedit || 'La direccion es requerido']" required>
                  </v-text-field>
                  <v-text-field v-model="cpclientedit" label="Codigo Postal" outlined :rules="[() => !!cpclientedit || 'El codigo postal es requerido']" @change="searchcp" required>
                  </v-text-field>
                  <v-select v-model="selectedcoloniaclientedit" :items="itemsclientcolonia" label="Seleccione un codigo postal" outlined></v-select>

                  <v-row>
                    <v-col cols="12" sm="10">
                      <v-file-input v-model="fileimgclientedit" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-img :lazy-src="imgsrcedit" max-height="80" max-width="80" :src="imgsrcedit"></v-img>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="saveclienteedit">Guardar</v-btn>
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
  name:'ClienteView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        headertable: [
            {text:'id',value:'id'},
            {text:'nombre',value:'nombre'},
            {text:'apellidos',value:'apellidos'},
            {text:'telefono',value:'telefono'},
            {text:'direccion',value:'direccion'},
            {text:'cp',value:'cp'},
            {text:'colonia',value:'colonia'},
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
        searchcliente:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,
        modaledit: false,
        validformcategoriaedit: true,
        idclientedit:'',
        nameclientedit:'',
        lastnameclientedit:'',
        phoneclientedit:'',
        addressclientedit:'',
        cpclientedit:'',
        itemsclientcolonia:[],
        selectedcoloniaclientedit:'',
        fileimgclientedit:[],
        imgsrcedit:'',
        validformcategoria:true,
        nameclient:'',
        lastnameclient:'',
        phoneclient:'',
        addressclient:'',
        cpclient:'',
        selectedcoloniaclient:'',
        itemscolonia:[],
        fileimgclient:[],
        imgsrc:''
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/cliente/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datos = response.data.data;
          this.data = [];
          datos.forEach((cliente) => {
            //console.log(cliente);
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
      this.idclientedit =  data.id,
      this.nameclientedit = data.nombre;
      this.lastnameclientedit = data.apellidos;
      this.phoneclientedit = data.telefono;
      this.addressclientedit = data.direccion;
      this.cpclientedit = data.cp;
      this.imgsrcedit = data.img;
      this.modaledit = true;

      var formdatatable = new FormData();
      formdatatable.append('CP',data.cp);

      this.axios.post(process.env.VUE_APP_URL + '/codigo/postal',formdatatable).then((response) => {
        if(response.data.code == 200){

          var datos = response.data.data;
          datos.forEach((cpdatos) => {
            this.itemsclientcolonia.push(cpdatos['colonia']);
          });
          this.selectedcoloniaclientedit = data.colonia;
        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
    },
    eliminar(data){
      this.$confirm('¿Deseas eliminar la cliente ' + data.nombre + "  " + data.apellidos + '?').then((res) => {
        if(res){
          var formdatadestroy = new FormData();
          formdatadestroy.append("api_token",localStorage.getItem('token_user'));
          formdatadestroy.append("id",data.id);

          this.overlay = true;

          this.axios.post(process.env.VUE_APP_URL + '/cliente/delete',formdatadestroy).then((response) => {

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
    },
    savecliente(){
      if(this.$refs.formvalidclient.validate()){
        var formdataclientedit = new FormData();
        formdataclientedit.append("api_token",localStorage.getItem('token_user'));
        formdataclientedit.append("name",this.nameclient);
        formdataclientedit.append("lastname",this.lastnameclient);
        formdataclientedit.append("phone",this.phoneclient);
        formdataclientedit.append("address",this.addressclient);
        formdataclientedit.append("cp",this.cpclient);
        formdataclientedit.append("colonia",this.selectedcoloniaclient);
        formdataclientedit.append("img",this.fileimgclient);

        this.overlay = true;

        this.axios.post(process.env.VUE_APP_URL + '/cliente/add',formdataclientedit).then((response) => {

          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.$refs.formvalidclient.reset();
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
    saveclienteedit(){
      if(this.$refs.formvalidclienteedit.validate()){

        var formdataclientedit = new FormData();
        formdataclientedit.append("api_token",localStorage.getItem('token_user'));
        formdataclientedit.append("id",this.idclientedit);
        formdataclientedit.append("name",this.nameclientedit);
        formdataclientedit.append("lastname",this.lastnameclientedit);
        formdataclientedit.append("phone",this.phoneclientedit);
        formdataclientedit.append("address",this.addressclientedit);
        formdataclientedit.append("cp",this.cpclientedit);
        formdataclientedit.append("colonia",this.selectedcoloniaclientedit);
        formdataclientedit.append("img",this.fileimgclientedit);

        this.overlay = true;

        this.axios.post(process.env.VUE_APP_URL + '/cliente/update',formdataclientedit).then((response) => {

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
    searchcp(){

      var cp = 0;
      if(this.cpclient != ''){
        cp = this.cpclient;
        this.itemscolonia = [];
      } else if(this.cpclientedit != ''){
        cp = this.cpclientedit;
        this.itemsclientcolonia = [];
      }

      var formdatacp = new FormData();
      formdatacp.append("CP",cp);

      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/codigo/postal',formdatacp).then((response) => {

        if(response.data.code == 200){
          var datoscp = response.data.data;

          datoscp.forEach((cps) => {
            if(this.cpclient != ''){
              this.itemscolonia.push(cps['colonia']);
            } else if(this.cpclientedit != ''){
              this.itemsclientcolonia.push(cps['colonia']);
            }
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
