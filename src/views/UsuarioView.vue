<template lang="html">
  <div>
    <HeaderComponent @drawerEvent="drawer = !drawer"/>
    <SliderbarComponent v-bind:drawer="drawer"/>
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
              <v-text-field v-model="searchusuario" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined>
              </v-text-field>
            </v-col>
           </v-row>

            <v-data-table :headers="headertable" :items="data" :search="searchusuario">
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
            <v-form ref="formvaliduser" v-model="validformuser" lazy-validation>
              <v-card-text></v-card-text>
              <v-text-field v-model="nameuser" label="Nombre" outlined :rules="[() => !!nameuser || 'El nombre es requerido']" required>
              </v-text-field>
              <v-text-field v-model="emailuser" label="Correo" outlined :rules="[() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailuser) || 'Correo con un formato incorrecto']" required>
              </v-text-field>
              <v-text-field v-model="passworduser" label="Contraseña" outlined :rules="[() => !!passworduser || 'La contraseña es requerido']" :append-icon="showpassworduser ? 'mdi-eye' : 'mdi-eye-off'" :type="showpassworduser ? 'text' : 'password'" @click:append="showpassworduser = !showpassworduser" required>
              </v-text-field>
              <v-text-field v-model="confirmpassuser" label="Confirmar Contraseña" outlined :rules="[() => !!confirmpassuser || 'La confirmacion de contraseña es requerido']" :append-icon="showconfirmpassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showconfirmpassword ? 'text' : 'password'" @click:append="showconfirmpassword = !showconfirmpassword" required>
              </v-text-field>
              <v-select v-model="selecttipouser" :items="itemsusertype" :rules="[() => !!selecttipouser || 'Seleccione un tipo de usuario']" label="Seleccione un tipo de usuario" outlined required></v-select>

              <v-row>
                <v-col cols="12" sm="10">
                  <v-file-input v-model="fileimguser" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-img :lazy-src="imgsrc" max-height="80" max-width="80" :src="imgsrc"></v-img>
                </v-col>
              </v-row>
              <v-btn large color="primary" @click="saveuser">Guardar</v-btn>
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
                <v-form ref="formvaliduseredit" v-model="validformuseredit" lazy-validation>
                  <v-card-text></v-card-text>
                  <input type="hidden" v-model="iduseredit">
                  <v-text-field v-model="nameuseredit" label="Nombre" outlined :rules="[() => !!nameuseredit || 'El nombre es requerido']" required>
                  </v-text-field>
                  <v-text-field v-model="emailuseredit" label="Correo" outlined :rules="[() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailuseredit) || 'Correo con un formato incorrecto']" required>
                  </v-text-field>

                  <v-switch v-model="switchchangepasswords" :label="`La contraseña : ${(switchchangepasswords == true) ? 'Va a cambiar' : 'No va cambiado'}`"></v-switch>

                  <div v-if="switchchangepasswords == true">
                    <v-text-field v-model="passworduseredit" label="Contraseña" outlined :rules="[() => !!passworduseredit || 'La contraseña es requerido']" :append-icon="showpassworduseredit ? 'mdi-eye' : 'mdi-eye-off'" :type="showpassworduseredit ? 'text' : 'password'" @click:append="showpassworduseredit = !showpassworduseredit" required>
                    </v-text-field>
                    <v-text-field v-model="confirmpassuseredit" label="Confirmar Contraseña" outlined :rules="[() => !!confirmpassuseredit || 'La confirmacion de contraseña es requerido']" :append-icon="showconfirmpasswordedit ? 'mdi-eye' : 'mdi-eye-off'" :type="showconfirmpasswordedit ? 'text' : 'password'" @click:append="showconfirmpasswordedit = !showconfirmpasswordedit" required>
                    </v-text-field>
                  </div>

                  <v-select v-model="selecttipouseredit" :items="itemsusertype" :rules="[() => !!selecttipouseredit || 'Seleccione un tipo de usuario']" label="Seleccione un tipo de usuario" outlined required></v-select>

                  <v-row>
                    <v-col cols="12" sm="10">
                      <v-file-input v-model="fileimguser" show-size counter outlined label="Seleccionar archivo"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-img :lazy-src="imgsrc" max-height="80" max-width="80" :src="imgsrc"></v-img>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn large color="primary" @click="saveusereedit">Guardar</v-btn>
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
  name:'UsuarioView',
  components: {HeaderComponent,SliderbarComponent},
  data:()=>{
      return {
        drawer: true,
        headertable: [
            {text:'id',value:'id'},
            {text:'nombre',value:'name'},
            {text:'correo',value:'email'},
            {text:'img',value:'img'},
            {text:'direccion',value:'type'},
            {text:'Api Token',value:'api_token'},
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
        searchusuario:'',
        msmalert:'',
        alertactive:false,
        multiLine: true,
        timeout: 4000,
        validformuser: true,
        nameuser: '',
        emailuser: '',
        passworduser: '',
        confirmpassuser: '',
        selecttipouser:'',
        itemsusertype:['Administrador','Vendedor','Cliente'],
        fileimguser:[],
        imgsrc: '',
        showpassworduser: false,
        showconfirmpassword: false,
        modaledit:false,
        validformuseredit:true,
        iduseredit: '',
        nameuseredit:'',
        emailuseredit:'',
        passworduseredit:'',
        showpassworduseredit:false,
        confirmpassuseredit:'',
        showconfirmpasswordedit:false,
        selecttipouseredit:'',
        switchchangepasswords:false,
        chengepassword:false
      }
  },
  methods:{
    loadingtabledata(){
      var formdatatable = new FormData();
      formdatatable.append('api_token',localStorage.getItem('token_user'));
      formdatatable.append('numpag',20);
      formdatatable.append('pag',1);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/usuario/get/all',formdatatable).then((response) => {
        if(response.data.code == 200){
          var datos = response.data.data;
          this.data = [];
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
    saveuser(){
      if(this.$refs.formvaliduser.validate()){
        var formdatauser = new FormData();
        formdatauser.append("api_token",localStorage.getItem('token_user'));
        formdatauser.append("name",this.nameuser);
        formdatauser.append("email",this.emailuser);
        formdatauser.append("password",this.passworduser);
        formdatauser.append("confirmpassword",this.confirmpassuser);
        formdatauser.append("typeuser",this.selecttipouser);

        this.overlay = true;

        this.axios.post(process.env.VUE_APP_URL + '/usuario/add',formdatauser).then((response) => {

          if(response.data.code == 200){
            this.msmalert = response.data.msm;
            this.alertactive = true;
            this.$refs.formvaliduser.reset();
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
    saveusereedit(){
      if(this.$refs.formvaliduseredit.validate()){
        var formdatauseredit = new FormData();
        formdatauseredit.append("api_token",localStorage.getItem('token_user'));
        formdatauseredit.append("id",this.iduseredit);
        formdatauseredit.append("name",this.nameuseredit);
        formdatauseredit.append("email",this.emailuseredit);
        formdatauseredit.append("password",this.passworduseredit);
        formdatauseredit.append("confirmpassword",this.confirmpassuseredit);
        formdatauseredit.append("typeuser",this.selecttipouseredit);

        this.overlay = true;

        this.axios.post(process.env.VUE_APP_URL + '/usuario/update',formdatauseredit).then((response) => {

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
      this.iduseredit = data.id;
      this.nameuseredit = data.name;
      this.emailuseredit = data.email;
      //this.passworduseredit = ;
      //this.confirmpassuseredit = data.;
      this.selecttipouseredit = data.type;
      this.imgsrc = data.img;
      this.modaledit = true;
    },
    eliminar(data){
      this.$confirm('¿Deseas eliminar al usuario ' + data.name + '?').then((res) => {
        if(res){
          var formdatadestroy = new FormData();
          formdatadestroy.append("api_token",localStorage.getItem('token_user'));
          formdatadestroy.append("id",data.id);

          this.overlay = true;

          this.axios.post(process.env.VUE_APP_URL + '/usuario/delete',formdatadestroy).then((response) => {

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
