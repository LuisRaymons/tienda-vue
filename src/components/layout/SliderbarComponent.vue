<template lang="html">
  <div>
    <v-navigation-drawer v-bind:value="drawer" app class="black accent-4" dark>
      <v-list-item-avatar>
        <v-img :src="imgavatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="whitetext">{{emailavatar}}</v-list-item-title>
      </v-list-item-content>

      <v-list>
          <v-list-item :to="{name:'home'}">
            <!-- Dashoboard-->
            <v-list-item-icon>
              <v-icon>mdi-car-cruise-control</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Categoria-->
          <v-list-item :to="{name:'categoria'}">
            <v-list-item-icon>
              <v-icon>mdi-layers-triple-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Categoria
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Cliente-->
          <v-list-item :to="{name:'cliente'}">
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Cliente</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Usuario-->
          <v-list-item :to="{name:'usuario'}">
            <v-list-item-icon>
              <v-icon>mdi-account-network</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Usuario</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Producto-->
          <v-list-item :to="{name:'producto'}">
            <v-list-item-icon>
              <v-icon>mdi-tag</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Producto</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Almacen-->
          <v-list-item :to="{name:'almacen'}">
            <v-list-item-icon>
              <v-icon>mdi-warehouse</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Almacen</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Promotor-->
          <v-list-item :to="{name:'promotor'}">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Promotor</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Compra-->
          <v-list-item :to="{name:'compra'}">
            <v-list-item-icon>
              <v-icon>mdi-cart-arrow-down</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Compra</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Venta-->
          <v-list-item :to="{name:'venta'}">
            <v-list-item-icon>
              <v-icon>mdi-cart-arrow-up</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Venta</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Precio producto-->
          <v-list-item :to="{name:'precioproducto'}">
            <v-list-item-icon>
              <v-icon>mdi-currency-usd-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Precio Producto</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name:'SliderbarComponent',
  props:['drawer'],
  data: () => ({
    links: [
      ['mdi-car-cruise-control', 'Dashboard'],
      ['mdi-layers-triple-outline', 'Categoria'],
      ['mdi-account-group', 'Cliente'],
      ['mdi-account-network', 'Usuario'],
      ['mdi-tag', 'Producto'],
      ['mdi-warehouse', 'Almacen'],
      ['mdi-account-circle', 'Promotor'],
      ['mdi-cart-arrow-down', 'Compra'],
      ['mdi-cart-arrow-up', 'Venta'],
      ['mdi-currency-usd-off', 'Precio Producto'],
    ],
    imgavatar: localStorage.getItem('img_user'),
    emailavatar: localStorage.getItem('email_user')
  }),
   mounted(){
     console.log("----------------Creacion de headers----------------");
   }
}
</script>

<style lang="css" scoped>
  .whitetext{
    color:white;
  }
</style>
