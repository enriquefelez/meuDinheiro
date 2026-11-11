import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMoney,summarize,inPeriod,dateLabel,type Entry } from '../src/lib/finance.ts';
const entry=(valor:number,data='2026-11-11',categoria='Outros'):Entry=>({id:'id',user_id:'user',descricao:'Registro',valor,data,categoria});
test('valores brasileiros, centavos e entradas inválidas',()=>{assert.equal(parseMoney('1.234,56'),123456);assert.equal(parseMoney('0,01'),1);assert.equal(parseMoney('12,5'),1250);for(const value of ['0','-1','1,234','abc','1.23','10000000000'])assert.throws(()=>parseMoney(value));});
test('somas em centavos evitam erro de ponto flutuante',()=>{const result=summarize([entry(.1),entry(.2)],[entry(.1)]);assert.equal(result.totalIncome,30);assert.equal(result.balance,20);assert.equal(result.count,3);assert.ok(Math.abs(result.percent!-100/3)<1e-10);});
test('estado vazio e ausência de receitas',()=>{const result=summarize([],[]);assert.equal(result.percent,null);assert.equal(result.balance,0);assert.deepEqual(result.months,[]);assert.equal(result.top,'Sem despesas');assert.equal(summarize([],[entry(10)]).balance,-1000);});
test('meses separam anos em ordem cronológica e agrupam categoria',()=>{const result=summarize([entry(20,'2026-01-10'),entry(10,'2025-12-10')],[entry(3,'2026-01-12','Lazer'),entry(7,'2026-01-13','Lazer')]);assert.deepEqual(result.months,['2025-12','2026-01']);assert.deepEqual(result.series[0].data,[10,20]);assert.equal(result.byCategory.Lazer,1000);assert.equal(result.top,'Lazer');});
test('filtros incluem extremos e datas não mudam com fuso',()=>{assert.equal(inPeriod(entry(1),'2026-11-11','2026-11-11'),true);assert.equal(inPeriod(entry(1),'2026-11-12',''),false);assert.equal(inPeriod(entry(1),'','2026-11-10'),false);assert.equal(inPeriod(entry(1),'',''),true);assert.equal(dateLabel('2026-01-01'),'01/01/2026');});

