<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonButton, IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { supabase, configured, errorMessage } from '../lib/supabase';
import { session } from '../store';
const router = useRouter();
const email = ref('');
const password = ref('');
const confirm = ref('');
const busy = ref(false);
const message = ref('');
async function submit() {
    if (busy.value)
        return;
    message.value = '';
    if (!configured) {
        message.value = 'Configure o arquivo .env seguindo o README para conectar ao Supabase.';
        return;
    }
    if (!email.value.trim() || password.value.length < 8) {
        message.value = 'Informe um e-mail válido e senha com pelo menos 8 caracteres.';
        return;
    }
    if (password.value !== confirm.value) {
        message.value = 'As senhas devem ser iguais.';
        return;
    }
    busy.value = true;
    try {
        const result = await supabase!.auth.signUp({
            email: email.value.trim(),
            password: password.value,
            options: { emailRedirectTo: window.location.origin + window.location.pathname },
        });
        if (result.error)
            throw result.error;
        if (result.data.session) {
            session.value = result.data.session;
            await router.replace('/dashboard');
        }
        else {
            message.value = 'Confira seu e-mail e abra o link de confirmação. Depois volte para entrar. Caso já tenha conta, use a opção Entrar.';
            password.value = '';
            confirm.value = '';
        }
    }
    catch (error) {
        message.value = errorMessage(error);
    }
    finally {
        busy.value = false;
    }
}
</script>

<template>
  <ion-page>
    <ion-content>
      <main class="auth-layout">
        <section class="auth-story">
          <span class="brand">◈ Meu Dinheiro</span>
          <span class="eyebrow">MAIS CLAREZA, MAIS TRANQUILIDADE</span>
          <h1>Seu dinheiro.<br>Suas escolhas.<br>Seu futuro.</h1>
          <p>Organize suas contas e acompanhe cada conquista em um só lugar.</p>
          <div class="story-note">↗ Um pequeno hábito hoje.<br>Uma vida mais organizada amanhã.</div>
        </section>
        <section class="auth-form panel">
          <span class="eyebrow">BEM-VINDO AO MEU DINHEIRO</span>
          <h2>Crie sua conta</h2>
          <p>Comece a cuidar das suas finanças.</p>
          <p v-if="!configured" class="notice">Conexão pendente: preencha o .env e execute o SQL em database.</p>
          <form @submit.prevent="submit">
            <label>E-mail<input v-model="email" type="email" required autocomplete="email" placeholder="voce@exemplo.com">
            </label>
            <label>Senha<input v-model="password" type="password" required minlength="8" autocomplete="new-password" placeholder="Pelo menos 8 caracteres">
            </label>
            <label>Confirme a senha<input v-model="confirm" type="password" required minlength="8" autocomplete="new-password">
            </label>
            <p role="status" class="notice" v-if="message">{{message}}</p>
            <ion-button expand="block" type="submit" :disabled="busy">
              <ion-spinner v-if="busy" name="dots"/>
              <span v-else>Criar conta →</span>
            </ion-button>
          </form>
          <ion-button fill="clear" expand="block" :disabled="busy" router-link="/login">Já tenho conta. Entrar</ion-button>
          <small>Seus registros são privados e vinculados à sua conta.</small>
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>
