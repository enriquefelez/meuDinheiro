export type Kind = 'receitas' | 'despesas';
export interface Entry { id: string; descricao: string; valor: number; categoria: string; data: string; user_id: string }
export const categories = { receitas: ['Salário','Freelance','Investimentos','Outros'], despesas: ['Alimentação','Transporte','Moradia','Educação','Lazer','Saúde','Outros'] };
export const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const cents = (value: number) => Math.round(Number(value) * 100);
export function parseMoney(input: string): number {
  const clean = input.trim();
  if (!/^(\d+|\d{1,3}(\.\d{3})+)(,\d{1,2})?$/.test(clean)) throw new Error('Informe um valor como 1.234,56, maior que zero.');
  const [whole, decimal = ''] = clean.replaceAll('.', '').split(',');
  const result = Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
  if (!Number.isSafeInteger(result) || result <= 0 || result > 999999999999) throw new Error('O valor deve ser positivo e menor que 10 bilhões.');
  return result;
}
export const dateLabel = (date: string) => date.split('-').reverse().join('/');
export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export const inPeriod = (entry: Entry, start: string, end: string) => (!start || entry.data >= start) && (!end || entry.data <= end);
export function summarize(income: Entry[], expenses: Entry[]) {
  const totalIncome = income.reduce((sum,e) => sum+cents(e.valor),0);
  const totalExpenses = expenses.reduce((sum,e) => sum+cents(e.valor),0);
  const byCategory: Record<string,number> = {};
  expenses.forEach(e => { byCategory[e.categoria] = (byCategory[e.categoria] || 0) + cents(e.valor); });
  const months = [...new Set([...income,...expenses].map(e => e.data.slice(0,7)))].sort();
  return { totalIncome, totalExpenses, balance: totalIncome-totalExpenses, count: income.length+expenses.length, percent: totalIncome ? totalExpenses/totalIncome*100 : null, byCategory, top: Object.entries(byCategory).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'Sem despesas', months, series: [income, expenses].map((rows,i)=>({name:i?'Despesas':'Receitas',data:months.map(month=>rows.filter(e=>e.data.startsWith(month)).reduce((sum,e)=>sum+cents(e.valor),0)/100)})) };
}
