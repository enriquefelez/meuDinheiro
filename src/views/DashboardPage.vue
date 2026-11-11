<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { IonButton, IonSpinner } from '@ionic/vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';
import AppLayout from '../components/AppLayout.vue';
import PeriodFilter from '../components/PeriodFilter.vue';
import { errorMessage } from '../lib/supabase';
import { filtered, dark, periodValid, loadEntries } from '../store';
import { money, summarize } from '../lib/finance';
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
const summary = computed(() => summarize(filtered.value.receitas, filtered.value.despesas));
const chartBase = computed<ApexOptions>(() => ({
    theme: { mode: dark.value ? 'dark' : 'light' },
    chart: { background: 'transparent', toolbar: { show: false }, fontFamily: 'inherit' },
    colors: ['#16865d', '#dc684d', '#5287c6', '#c5a24c', '#9171b5', '#59aaa4', '#b57389'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    noData: { text: 'Sem lançamentos no período' },
    tooltip: { y: { formatter: (value: number) => money(Math.round(value * 100)) } },
}));
const pieOptions = computed<ApexOptions>(() => ({
    ...chartBase.value,
    labels: Object.keys(summary.value.byCategory),
    stroke: { width: 0 },
}));
const barOptions = computed<ApexOptions>(() => ({
    ...chartBase.value,
    colors: ['#16865d', '#dc684d'],
    xaxis: { categories: summary.value.months.map(m => `${m.slice(5)}/${m.slice(0, 4)}`) },
    yaxis: { labels: { formatter: (value: number) => money(Math.round(value * 100)) } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
}));
</script>

<template>
  <app-layout title="Dashboard" heading="Sua vida financeira, em dia." description="Uma visão clara do que entra, do que sai e do que fica.">
    <p v-if="error" role="alert" class="notice error">
      {{ error }} <ion-button size="small" fill="clear" @click="refresh">Tentar novamente</ion-button>
    </p>
    <period-filter />
    <div v-if="loading" role="status" class="loading"><ion-spinner /> Atualizando seus lançamentos…</div>
    <template v-else-if="!error && periodValid">
      <section class="summary-grid">
        <article class="panel balance">
          <span>SALDO DO PERÍODO</span><h2>{{ money(summary.balance) }}</h2><small>Receitas menos despesas</small>
        </article>
        <article class="panel">
          <span class="income">↗ TOTAL DE RECEITAS</span><h2>{{ money(summary.totalIncome) }}</h2><small>Entradas no período</small>
        </article>
        <article class="panel">
          <span class="expense">↘ TOTAL DE DESPESAS</span><h2>{{ money(summary.totalExpenses) }}</h2><small>Saídas no período</small>
        </article>
      </section>

      <section class="charts-grid">
        <article class="panel">
          <h2>Para onde vai seu dinheiro?</h2>
          <p>Despesas por categoria</p>
          <VueApexCharts
          v-if="Object.keys(summary.byCategory).length"
          type="donut" height="300" :options="pieOptions"
          :series="Object.values(summary.byCategory).map(value => value / 100)"
          />
          <div v-else class="empty">Ainda não há despesas neste período.</div>
        </article>
        <article class="panel">
          <h2>Entradas e saídas</h2>
          <p>Compare seus movimentos mês a mês</p>
          <VueApexCharts v-if="summary.months.length" type="bar" height="300" :options="barOptions" :series="summary.series" />
          <div v-else class="empty">Seus gráficos aparecem quando você adicionar lançamentos.</div>
        </article>
      </section>

      <section class="indicators">
        <article class="panel"><small>Maior gasto por categoria</small><strong>{{ summary.top }}</strong></article>
        <article class="panel"><small>Total de lançamentos</small><strong>{{ summary.count }}</strong></article>
        <article class="panel">
          <small>Despesas em relação às receitas</small>
          <strong>{{ summary.percent === null ? 'Sem receitas no período' : summary.percent.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' }}</strong>
        </article>
      </section>
    </template>
  </app-layout>
</template>
