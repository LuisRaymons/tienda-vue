<template>
  <v-app id="inspire">
    <v-content id="backgroundcontainer">
      <v-container>
        <v-overlay :value="overlay" :z-index="zIndex">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
          <h6>Cargando informacion</h6>
        </v-overlay>
        <v-row>

          <v-col md="5" offset-md="4" id="tabloginregister">
            <v-toolbar color="#4050af">
              <v-tabs horizontal v-model="tablogin">
                <v-tabs-slider color="white"></v-tabs-slider>
                <v-tab key="login">Login</v-tab>
                <v-tab key="register">Register</v-tab>
              </v-tabs>
            </v-toolbar>
            <v-tabs-items v-model="tablogin" >
              <v-tab-item key="login" class="backoudblue">
                <v-card flat color="#4050af">
                  <h3 class="text-center">Login</h3>
                  <v-img max-height="143" max-width="143" src="../assets/user-login2.png" id="iconlogin"></v-img>
                  <v-col md="10" offset-md="1">
                  <v-form ref="form" v-model="loginform" lazy-validation>
                    <v-text-field v-model="emaillogin" :rules="[() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emaillogin) || 'Correo con un formato incorrecto']" label="Correo electronico" outlined required></v-text-field>
                    <v-text-field v-model="passwordlogin" :rules="[() => !!passwordlogin || 'Se requiere de una contrasea']" label="Contraseña" outlined :append-icon="showpassworlogin ? 'mdi-eye' : 'mdi-eye-off'" :type="showpassworlogin ? 'text' : 'password'" @click:append="showpassworlogin = !showpassworlogin" required></v-text-field>
                    <v-btn color="#3779d9" class="btn-x-large" @click="loginuserfn">Entrar</v-btn>
                  </v-form>
                </v-col>
                </v-card>
              </v-tab-item>
              <v-tab-item key="register" class="backoudblue">
                <v-card color="#4050af">
                  <h3 class="text-center">Register</h3>
                  <v-col md="10" offset-md="1">
                    <v-form ref="form" v-model="registerform" lazy-validation>
                      <v-text-field v-model="nameregister" :rules="[() => !!nameregister || 'Se requiere de un nombre']" label="Nombre" outlined required></v-text-field>
                      <v-text-field v-model="emailregister" :rules="[() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailregister) || 'Correo con un formato incorrecto']" label="Correo electronico" outlined required></v-text-field>
                      <v-text-field v-model="passwordregister" :rules="[() => !!passwordregister || 'Se requiere de una contrasea']" label="Contraseña" outlined :append-icon="showpassworregister ? 'mdi-eye' : 'mdi-eye-off'" :type="showpassworregister ? 'text' : 'password'" @click:append="showpassworregister = !showpassworregister" required></v-text-field>
                      <v-text-field v-model="confirmpasswordregister" :rules="[() => !!confirmpasswordregister || 'Se requiere de una contrasea']" label="Contraseña" outlined :append-icon="showpassworconfirmregister ? 'mdi-eye' : 'mdi-eye-off'" :type="showpassworconfirmregister ? 'text' : 'password'" @click:append="showpassworconfirmregister = !showpassworconfirmregister" required></v-text-field>
                      <v-btn color="#3779d9" class="btn-x-large" @click="createuserfn">Crear cuenta</v-btn>

                      <h5 class="textcenterparrafo">Recuerda que su cuenta debe</h5>
                      <h5 class="textcenterparrafo">ser activada por un administrador</h5>
                    </v-form>
                  </v-col>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<style media="screen">
  #backgroundcontainer{
    top: 50%;
    background-image: url('../assets/loginfondo3.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  #tabloginregister{
    top:70%;
    background-color: rgba(0, 0, 0, 0.2);
    margin-top: 5%;
  }
  .text-center{
        text-align: center;
        margin-top: 5%;
        color: red;
  }
  #iconlogin{
    margin: auto;
  }
  .backoudblue{
    background-color: #4050af;
  }
  .btn-x-large{
    width: 100%;
  }
  .textcenterparrafo{
    margin-top: 5%;
    color: rgb(223, 30, 30);
    font-weight: bold;
    text-align: center;
  }
</style>

<script>
export default {
  name: 'LoginView',
  data: () => ({
    overlay: false,
    zIndex: 300,
    tablogin: null,
    loginform: true,
    emaillogin: '',
    passwordlogin: '',
    showpassworlogin: false,
    registerform: true,
    nameregister: '',
    emailregister: '',
    passwordregister: '',
    confirmpasswordregister: '',
    showpassworregister: false,
    showpassworconfirmregister: false
  }),
  methods:{
    loginuserfn(){
      var formlogin = new FormData();
      formlogin.append('email',this.emaillogin);
      formlogin.append('password',this.passwordlogin);
      this.overlay = true;

      this.axios.post(process.env.VUE_APP_URL + '/login',formlogin).then((response) => {
        console.log(response.data.code);
        if(response.data.code == 200){
          localStorage.setItem('id_user',response.data.data.id);
          localStorage.setItem('name_user',response.data.data.name);
          localStorage.setItem('email_user',response.data.data.email);
          localStorage.setItem('token_user',response.data.data.api_token);
          localStorage.setItem('img_user',process.env.VUE_APP_URL_IMG +  '/' + response.data.data.img);
          localStorage.setItem('type_user',response.data.data.type);
          //console.log(this.$router);
          this.$router.push('home');
        }
      }).catch((error) =>{
        console.log("Error en el try catch");
        console.log(error);
      });
      this.overlay = false;


      console.log("Logeando");
    },
    createuserfn(){
      console.log("Creando el usurio");
    }
  }
}
</script>
