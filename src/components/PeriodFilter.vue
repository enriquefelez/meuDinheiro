<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { start,end,periodValid } from '../store';
import { localDate,dateLabel } from '../lib/finance';
function month(){const now=new Date();start.value=localDate(new Date(now.getFullYear(),now.getMonth(),1));end.value=localDate(new Date(now.getFullYear(),now.getMonth()+1,0));}
</script>
<template><section class="panel period"><div><strong>Seu período</strong><small>{{start?dateLabel(start):'Desde o início'}} — {{end?dateLabel(end):'Hoje e próximos registros'}}</small></div><label>De<input aria-label="Data inicial" type="date" v-model="start"></label><label>Até<input aria-label="Data final" type="date" v-model="end"></label><ion-button size="small" fill="outline" @click="month">Este mês</ion-button><ion-button size="small" fill="clear" @click="start='';end=''">Todo o período</ion-button><p v-if="!periodValid" role="alert" class="error">A data inicial deve ser anterior ou igual à final.</p></section></template>
