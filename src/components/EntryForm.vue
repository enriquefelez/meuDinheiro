<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonSpinner } from '@ionic/vue';
import { categories, parseMoney, localDate, type Entry, type Kind } from '../lib/finance';
import { supabase,errorMessage } from '../lib/supabase';
import { session } from '../store';
const props=defineProps<{kind:Kind;entry:Entry|null}>();
const emit=defineEmits<{saved:[];cancel:[]}>();
const descricao=ref(props.entry?.descricao||'');const valor=ref(props.entry?Number(props.entry.valor).toFixed(2).replace('.',','):'');const categoria=ref(props.entry?.categoria||categories[props.kind][0]);const data=ref(props.entry?.data||localDate());const busy=ref(false);const message=ref('');
async function save(){if(busy.value)return;message.value='';let amount:number;
try{amount=parseMoney(valor.value);}catch(e){message.value=(e as Error).message;return;}
if(!descricao.value.trim()||descricao.value.trim().length>200||!data.value||!categories[props.kind].includes(categoria.value)){message.value='Preencha os campos. A descrição deve ter até 200 caracteres.';return;}
if(!session.value||!supabase){message.value='Entre novamente para salvar.';return;}
busy.value=true;
try{const payload={descricao:descricao.value.trim(),valor:amount/100,categoria:categoria.value,data:data.value,user_id:session.value.user.id};const result=props.entry?await supabase.from(props.kind).update(payload).eq('id',props.entry.id).eq('user_id',session.value.user.id).select('id').single():await supabase.from(props.kind).insert(payload).select('id').single();if(result.error)throw result.error;emit('saved');}catch(e){message.value=errorMessage(e);}finally{busy.value=false;}}
</script>
<template><section class="panel editor"><h2>{{entry?'Editar':'Novo'}} lançamento · {{kind}}</h2><form @submit.prevent="save"><label>Descrição<input v-model="descricao" required maxlength="200" placeholder="Ex.: compra do mês"></label><div class="form-grid"><label>Valor (R$)<input v-model="valor" inputmode="decimal" required placeholder="0,00"></label><label>Data<input type="date" v-model="data" required></label></div><label>Categoria<select v-model="categoria"><option v-for="category in categories[kind]" :key="category">{{category}}</option></select></label><p role="alert" class="error" v-if="message">{{message}}</p><div class="actions"><ion-button type="submit" :disabled="busy"><ion-spinner v-if="busy" name="dots"/><span v-else>Salvar lançamento</span></ion-button><ion-button fill="clear" :disabled="busy" @click="emit('cancel')">Cancelar</ion-button></div></form></section></template>
