<script setup lang="ts">
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { RouterLink } from 'vue-router';
import { gridOutline, trendingUpOutline, trendingDownOutline, settingsOutline, walletOutline } from 'ionicons/icons';
import { session } from '../store';

defineProps<{ title: string; heading?: string; description: string }>();
const links = [
  { path: 'dashboard', label: 'Dashboard', icon: gridOutline },
  { path: 'receitas', label: 'Receitas', icon: trendingUpOutline },
  { path: 'despesas', label: 'Despesas', icon: trendingDownOutline },
  { path: 'configuracoes', label: 'Configurações', icon: settingsOutline },
];
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="workspace">
        <aside class="sidebar">
          <router-link class="brand" to="/dashboard"><ion-icon :icon="walletOutline" /> Meu Dinheiro</router-link>
          <span class="eyebrow">SEU CONTROLE FINANCEIRO</span>
          <nav>
            <router-link v-for="link in links" :key="link.path" :to="'/' + link.path">
              <ion-icon :icon="link.icon" /><span>{{ link.label }}</span>
            </router-link>
          </nav>
          <div class="sidebar-bottom">
            <span class="privacy-dot"></span> Um espaço só seu
            <small>Clareza para suas próximas escolhas.</small>
          </div>
        </aside>
        <main class="main">
          <header class="topbar">
            <span>MINHAS FINANÇAS / {{ title.toLocaleUpperCase('pt-BR') }}</span>
            <span class="user-email">{{ session?.user.email }}</span>
          </header>
          <div class="heading">
            <div>
              <span class="eyebrow">CADA ESCOLHA CONTA</span>
              <h1>{{ heading || title }}</h1>
              <p>{{ description }}</p>
            </div>
            <slot name="actions" />
          </div>
          <slot />
          <footer>Meu Dinheiro · Mais organização, mais tranquilidade.</footer>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>
