<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { IonButton, IonSpinner, alertController } from '@ionic/vue';
import AppLayout from '../components/AppLayout.vue';
import PeriodFilter from '../components/PeriodFilter.vue';
import { filtered, loadEntries, session, periodValid } from '../store';
import { supabase, errorMessage } from '../lib/supabase';
import { categories, parseMoney, localDate, cents, dateLabel, money, type Entry, type Kind } from '../lib/finance';
const kind: Kind = 'despesas';
// Carregamento dos registros e estado da página.
const loading = ref(false);
const error = ref('');
async function refresh() {
    loading.value = true;
    error.value = '';
    try {
        await loadEntries();
    }
    catch (e) {
        error.value = errorMessage(e);
    }
    finally {
        loading.value = false;
    }
}
onMounted(refresh);
// Inclusão, edição, confirmação e exclusão.
const entries = computed(() => filtered.value[kind]);
const success = ref('');
const editing = ref(false);
const selected = ref<Entry | null>(null);
const removing = ref<string | null>(null);
function add() { selected.value = null; editing.value = true; success.value = ''; }
function edit(entry: Entry) { selected.value = entry; editing.value = true; success.value = ''; }
async function saved() {
    editing.value = false;
    success.value = 'Lançamento salvo com sucesso.';
    await refresh();
}
async function doRemove(entry: Entry) {
    if (removing.value)
        return;
    removing.value = entry.id;
    success.value = '';
    try {
        if (!supabase || !session.value)
            throw new Error('Sessão indisponível');
        const result = await supabase.from(kind).delete()
            .eq('id', entry.id).eq('user_id', session.value.user.id).select('id').single();
        if (result.error)
            throw result.error;
        success.value = 'Lançamento excluído.';
        await refresh();
    }
    catch (e) {
        error.value = errorMessage(e);
    }
    finally {
        removing.value = null;
    }
}
async function remove(entry: Entry) {
    const alert = await alertController.create({
        header: 'Excluir lançamento?',
        message: `Deseja excluir “${entry.descricao}”? Esta ação não pode ser desfeita.`,
        buttons: [
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Excluir', role: 'destructive', handler: () => { void doRemove(entry); } },
        ],
    });
    await alert.present();
}
// Campos e validação do formulário desta página.
const descricao = ref('');
const valor = ref('');
const categoria = ref(categories[kind][0]);
const data = ref(localDate());
const busy = ref(false);
const message = ref('');
watch([selected, editing], () => {
    descricao.value = selected.value?.descricao || '';
    valor.value = selected.value ? Number(selected.value.valor).toFixed(2).replace('.', ',') : '';
    categoria.value = selected.value?.categoria || categories[kind][0];
    data.value = selected.value?.data || localDate();
    message.value = '';
}, { flush: 'sync' });
async function save() {
    if (busy.value)
        return;
    message.value = '';
    let amount: number;
    try {
        amount = parseMoney(valor.value);
    }
    catch (e) {
        message.value = (e as Error).message;
        return;
    }
    if (!descricao.value.trim() || descricao.value.trim().length > 200 || !data.value || !categories[kind].includes(categoria.value)) {
        message.value = 'Preencha os campos. A descrição deve ter até 200 caracteres.';
        return;
    }
    if (!session.value || !supabase) {
        message.value = 'Entre novamente para salvar.';
        return;
    }
    busy.value = true;
    try {
        const payload = { descricao: descricao.value.trim(), valor: amount / 100, categoria: categoria.value, data: data.value, user_id: session.value.user.id };
        const result = selected.value ? await supabase.from(kind).update(payload).eq('id', selected.value.id).eq('user_id', session.value.user.id).select('id').single() : await supabase.from(kind).insert(payload).select('id').single();
        if (result.error)
            throw result.error;
        await saved();
    }
    catch (e) {
        message.value = errorMessage(e);
    }
    finally {
        busy.value = false;
    }
}
</script>

<template>
  <app-layout title="Despesas" description="Organize seus lançamentos e acompanhe seus movimentos.">
    <template #actions>
      <ion-button @click="add">+ Nova despesa</ion-button>
    </template>
    <p v-if="error" role="alert" class="notice error">{{ error }} <ion-button size="small" fill="clear" @click="refresh">Tentar novamente</ion-button>
    </p>
    <p v-if="success" role="status" class="notice">{{ success }}</p>
    <period-filter />
    <div v-if="loading" role="status" class="loading">
      <ion-spinner /> Atualizando suas despesas…</div>
    <template v-else-if="!error && periodValid">
      <section v-if="editing" class="panel editor">
        <h2>{{selected?'Editar':'Novo'}} lançamento · {{kind}}</h2>
        <form @submit.prevent="save">
          <label>Descrição<input v-model="descricao" required maxlength="200" placeholder="Ex.: compra do mês">
          </label>
          <div class="form-grid">
            <label>Valor (R$)<input v-model="valor" inputmode="decimal" required placeholder="0,00">
            </label>
            <label>Data<input type="date" v-model="data" required>
            </label>
          </div>
          <label>Categoria<select v-model="categoria">
              <option v-for="category in categories[kind]" :key="category">{{category}}</option>
            </select>
          </label>
          <p role="alert" class="error" v-if="message">{{message}}</p>
          <div class="actions">
            <ion-button type="submit" :disabled="busy">
              <ion-spinner v-if="busy" name="dots"/>
              <span v-else>Salvar lançamento</span>
            </ion-button>
            <ion-button fill="clear" :disabled="busy" @click="editing = false">Cancelar</ion-button>
          </div>
        </form>
      </section>
      <section class="panel list">
        <div class="list-header">
          <h2>Seus lançamentos</h2>
          <small>{{ entries.length }} registro(s)</small>
        </div>
        <div v-if="!entries.length" class="empty">
          <h3>Um novo começo para suas contas</h3>
          <p>Nenhum lançamento neste período. Use o botão acima para adicionar.</p>
        </div>
        <article v-for="entry in entries" :key="entry.id" class="entry">
        <span class="entry-icon expense">↘</span>
          <div class="entry-description">
            <strong>{{ entry.descricao }}</strong>
            <small>{{ entry.categoria }} · {{ dateLabel(entry.data) }}</small>
          </div>
          <strong class="expense">{{ money(cents(entry.valor)) }}</strong>
          <div class="entry-actions">
            <ion-button fill="clear" size="small" :disabled="!!removing" @click="edit(entry)">Editar</ion-button>
            <ion-button fill="clear" color="danger" size="small" :disabled="!!removing" @click="remove(entry)">Excluir</ion-button>
          </div>
        </article>
      </section>
    </template>
  </app-layout>
</template>
