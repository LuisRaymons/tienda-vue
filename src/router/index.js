import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CategoriaView from '../views/CategoriaView'
import ClienteView from '../views/ClienteView'
import UsuarioView from '../views/UsuarioView'
import ProductoView from '../views/ProductoView'
import AlmacenView from '../views/AlmacenView'
import PromotorView from '../views/PromotorView'
import CompraView from '../views/CompraView'
import VentaView from '../views/VentaView'
import PrecioProductoView from '../views/PrecioProductoView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/categoria/producto',
    name: 'categoria',
    component: CategoriaView
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: ClienteView
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: UsuarioView
  },
  {
    path: '/producto',
    name: 'producto',
    component: ProductoView
  },
  {
    path: '/almacen',
    name: 'almacen',
    component: AlmacenView
  },
  {
    path: '/promotor',
    name: 'promotor',
    component: PromotorView
  },
  {
    path: '/compra',
    name: 'compra',
    component: CompraView
  },
  {
    path: '/venta',
    name: 'venta',
    component: VentaView
  },
  {
    path: '/precio/producto',
    name: 'precioproducto',
    component: PrecioProductoView
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
