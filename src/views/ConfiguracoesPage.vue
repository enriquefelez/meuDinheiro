<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonToggle } from '@ionic/vue';
import AppLayout from '../components/AppLayout.vue';
import { session, dark, applyTheme } from '../store';
import { supabase, errorMessage } from '../lib/supabase';
const router = useRouter();
const error = ref('');
const loggingOut = ref(false);
async function logout() {
    if (loggingOut.value)
        return;
    loggingOut.value = true;
    error.value = '';
    try {
        const result = await supabase!.auth.signOut();
        if (result.error)
            throw result.error;
        session.value = null;
        await router.replace('/login');
    }
    catch (e) {
        error.value = errorMessage(e);
    }
    finally {
        loggingOut.value = false;
    }
}
</script>

<template>
  <app-layout title="Configurações" description="Deixe este espaço do seu jeito.">
    <p v-if="error" role="alert" class="notice error">{{ error }}</p>
    <section class="panel settings">
      <h2>Preferências</h2>
      <div class="setting-row">
        <div><strong>Modo escuro</strong><p>A preferência fica salva neste dispositivo.</p></div>
        <ion-toggle aria-label="Modo escuro" :checked="dark" @ionChange="dark = $event.detail.checked; applyTheme()" />
      </div>
      <hr>
      <h2>Sua conta</h2>
      <p>{{ session?.user.email }}</p>
      <ion-button color="danger" fill="outline" :disabled="loggingOut" @click="logout">{{ loggingOut ? 'Saindo…' : 'Sair da conta' }}</ion-button>
    </section>
  </app-layout>
</template>
