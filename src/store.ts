import { ref, computed } from 'vue';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { inPeriod, type Entry, type Kind } from './lib/finance';
export const session = ref<Session|null>(null);
export const rows = ref<Record<Kind,Entry[]>>({receitas:[],despesas:[]});
export const start = ref(''); export const end = ref('');
export const periodValid = computed(()=>!start.value || !end.value || start.value<=end.value);
export const filtered = computed(()=>({receitas:periodValid.value?rows.value.receitas.filter(e=>inPeriod(e,start.value,end.value)):[],despesas:periodValid.value?rows.value.despesas.filter(e=>inPeriod(e,start.value,end.value)):[]}));
export const dark = ref(localStorage.getItem('theme') === 'dark');
export function applyTheme() { document.documentElement.classList.toggle('ion-palette-dark',dark.value); localStorage.setItem('theme',dark.value?'dark':'light'); }
applyTheme();
export const ready = (async()=>{
  if (!supabase) return;
  supabase.auth.onAuthStateChange((_event, next)=> { if (session.value?.user.id !== next?.user.id) rows.value={receitas:[],despesas:[]}; session.value=next; });
  const {data,error} = await supabase.auth.getSession(); if (!error) session.value=data.session;
})();
export async function loadEntries() {
  if (!supabase || !session.value) return;
  const userId = session.value.user.id;
  const fetchTable = async(kind:Kind) => {
    const all:Entry[]=[];
    for(let offset=0;;offset+=500) {
      const {data,error}=await supabase!.from(kind).select('*').eq('user_id',userId).order('data',{ascending:false}).order('id').range(offset,offset+499);
      if(error) throw error; all.push(...data as Entry[]); if(data.length<500) break;
    }
    return all;
  };
  const [receitas,despesas] = await Promise.all([fetchTable('receitas'),fetchTable('despesas')]);
  if(session.value?.user.id===userId) rows.value={receitas,despesas};
}
