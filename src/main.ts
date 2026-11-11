import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/palettes/dark.class.css';
import './style.css';
import App from './App.vue';
import LoginPage from './views/LoginPage.vue';
import CadastroPage from './views/CadastroPage.vue';
import DashboardPage from './views/DashboardPage.vue';
import ReceitasPage from './views/ReceitasPage.vue';
import DespesasPage from './views/DespesasPage.vue';
import ConfiguracoesPage from './views/ConfiguracoesPage.vue';
import { ready, session } from './store';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/cadastro', component: CadastroPage },
    { path: '/dashboard', component: DashboardPage },
    { path: '/receitas', component: ReceitasPage },
    { path: '/despesas', component: DespesasPage },
    { path: '/configuracoes', component: ConfiguracoesPage },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
});
router.beforeEach(async (to) => {
  await ready;
  const publicPage = to.path === '/login' || to.path === '/cadastro';
  if (!session.value && !publicPage) return '/login';
  if (session.value && publicPage) return '/dashboard';
});
createApp(App).use(IonicVue).use(router).mount('#app');
