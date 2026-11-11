<script setup lang="ts">
import { IonApp } from '@ionic/vue';
import { RouterView, useRouter } from 'vue-router';
import { watch } from 'vue';
import { session } from './store';
const router=useRouter();
watch(session,next=>{if(!next) void router.replace('/login');});
</script>
<template><ion-app><router-view /></ion-app></template>
