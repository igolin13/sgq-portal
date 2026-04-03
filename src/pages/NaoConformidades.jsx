import { useState } from 'react'
import {
  Plus, Search, X, CheckCircle, Clock, AlertCircle,
  Paperclip, ChevronRight, AlertTriangle, Filter,
  TrendingDown, User, Tag, ArrowRight, ChevronDown,
  RefreshCw, ShieldAlert
} from 'lucide-react'

// ─── CONSTANTES ───────────────────────────────────────────────────
const MAQUINAS      = ['', 'Env 1', 'Env 3', 'Env 5', 'Env 6', 'Lito 2', 'Lito 4', 'Lito 5', 'Lito 6']
const EFICACIA_OPTS = ['', 'Eficaz', 'Parcialmente eficaz', 'Não eficaz — reabrir NC']
const VERIF_OPTS    = ['', 'Não verificado', 'Eficaz — sem recorrência', 'Recorrência detectada']

const TIPO_CFG = {
  'Externa':    { cor:'#3b82f6', bg:'rgba(59,130,246,.15)'  },
  'Interna':    { cor:'#f59e0b', bg:'rgba(245,158,11,.15)'  },
  'Fornecedor': { cor:'#8b5cf6', bg:'rgba(139,92,246,.15)'  },
}
const SIT_CFG = {
  'Aberta':             { cor:'#3b82f6', bg:'rgba(59,130,246,.15)',   icon:AlertCircle  },
  'Em análise':         { cor:'#f59e0b', bg:'rgba(245,158,11,.15)',   icon:Search       },
  'Em andamento':       { cor:'#f59e0b', bg:'rgba(245,158,11,.15)',   icon:RefreshCw    },
  'Aguardando amostra': { cor:'#94a3b8', bg:'rgba(148,163,184,.12)',  icon:Clock        },
  'Encerrada':          { cor:'#10b981', bg:'rgba(16,185,129,.15)',   icon:CheckCircle  },
}

// ─── UTILITÁRIOS ──────────────────────────────────────────────────
function addDiasUteis(base, dias) {
  let d = new Date(base), c = 0
  while (c < dias) { d.setDate(d.getDate()+1); if (d.getDay()!==0&&d.getDay()!==6) c++ }
  return d
}
function parseDataBR(s) {
  if (!s||s==='N/A'||s==='—') return null
  const p = s.split('/'); if (p.length!==3) return null
  return new Date(Number(p[2]), Number(p[1])-1, Number(p[0]))
}
function formatDataBR(d) { return d ? d.toLocaleDateString('pt-BR') : '—' }
function calcularPrazo(da, dm) {
  const base = dm&&dm!=='N/A'&&dm!=='' ? parseDataBR(dm) : parseDataBR(da)
  return base ? addDiasUteis(base, 7) : null
}
function diasAtraso(prazo) {
  if (!prazo) return null
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  return Math.ceil((hoje - prazo) / 86400000)
}
function addDias(base, n) {
  const d = new Date(base); d.setDate(d.getDate() + n); return d
}
function isoParaBR(iso) {
  if (!iso) return ''
  const [y,m,d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// ─── VALIDAÇÃO ────────────────────────────────────────────────────
function validarNC(form) {
  const e = []
  if (!form.nCliente?.trim())                  e.push({ aba:'nc',          campo:'Nº Cliente'           })
  if (!form.cliente?.trim())                   e.push({ aba:'nc',          campo:'Cliente'              })
  if (!form.tipo?.trim())                      e.push({ aba:'nc',          campo:'Tipo'                 })
  if (!form.situacao?.trim())                  e.push({ aba:'nc',          campo:'Situação'             })
  if (!form.dataAbertura?.trim())              e.push({ aba:'nc',          campo:'Data de abertura'     })
  if (!form.operacional?.qtdReclamada?.trim()) e.push({ aba:'operacional', campo:'Quantidade reclamada' })
  if (!form.operacional?.dataProd?.trim())     e.push({ aba:'operacional', campo:'Data de produção'     })
  if (!form.operacional?.maquina?.trim())      e.push({ aba:'operacional', campo:'Máquina'              })
  if (!form.operacional?.operador?.trim())     e.push({ aba:'operacional', campo:'Operador'             })
  if (!form.eficacia?.causaRaiz?.trim())       e.push({ aba:'eficacia',    campo:'Análise de causa'     })
  if (!form.eficacia?.acaoContencao?.trim())   e.push({ aba:'eficacia',    campo:'Ação de contenção'    })
  if (!form.eficacia?.acaoCorrecao?.trim())    e.push({ aba:'eficacia',    campo:'Ação de correção'     })
  if (!form.eficacia?.acaoPreventiva?.trim())  e.push({ aba:'eficacia',    campo:'Ação preventiva'      })
  if (!form.eficacia?.prazoAcao?.trim())       e.push({ aba:'eficacia',    campo:'Prazo da ação'        })
  if (!form.eficacia?.dataRealizada?.trim())   e.push({ aba:'eficacia',    campo:'Data realizada'       })
  if (!form.eficacia?.evidencia?.trim())       e.push({ aba:'eficacia',    campo:'Evidência'            })
  if (!form.eficacia?.avaliacao?.trim())       e.push({ aba:'eficacia',    campo:'Avaliação de eficácia'})
  return e
}

// eficacia base vazio
const eficaciaVazio = {
  causaRaiz:'', acaoContencao:'', acaoCorrecao:'', acaoPreventiva:'',
  prazoAcao:'', dataRealizada:'', evidencia:'', avaliacao:'', resultado:'',
  reincidente:'', reincidenteQtd:'', reincidenteRNC:'',
  v30data:'', v30resultado:'', v30obs:'',
  v60data:'', v60resultado:'', v60obs:'',
  v90data:'', v90resultado:'', v90obs:'',
}

// ─── DADOS ────────────────────────────────────────────────────────
const ncIniciais = [
  { id:1, rnc:'154/2025', nCliente:'44',    cliente:'Pampeano',        tipo:'Externa',    defeito:'Falha na aplicação do verniz',                      classificacao:'Não Conformidade Existente', situacao:'Em análise',         dataAbertura:'30/12/2025', dataAmostra:'N/A',        responsavel:'Igor Bittencourt', area:'Litografia', origem:'Sistema', retornoResposta:'', operacional:{qtdReclamada:'',    dataProd:'',           maquina:'',       operador:'',          operadorEstufa:'', observacao:''}, eficacia:{ ...eficaciaVazio } },
  { id:2, rnc:'155/2025', nCliente:'12',    cliente:'Ambev',           tipo:'Externa',    defeito:'Rótulo com impressão borrada',                      classificacao:'Não Conformidade Nova',      situacao:'Aberta',             dataAbertura:'05/01/2026', dataAmostra:'08/01/2026', responsavel:'Igor Bittencourt', area:'Impressão',  origem:'Sistema', retornoResposta:'', operacional:{qtdReclamada:'500', dataProd:'02/01/2026', maquina:'Lito 4', operador:'João Silva', operadorEstufa:'Carlos M.', observacao:'Lote afetado: L-2024'}, eficacia:{ ...eficaciaVazio, causaRaiz:'Desgaste do cilindro', acaoContencao:'Segregação do lote', acaoCorrecao:'Substituição do cilindro', acaoPreventiva:'Revisão do plano de manutenção', prazoAcao:'2026-01-20', dataRealizada:'18/01/2026', evidencia:'Relatório técnico', avaliacao:'Eficaz', resultado:'Nova amostra aprovada pelo cliente', reincidente:'nao' } },
  { id:3, rnc:'157/2026', nCliente:'33',    cliente:'Natura',          tipo:'Externa',    defeito:'Embalagem com rebarba na solda',                    classificacao:'Não Conformidade Existente', situacao:'Aguardando amostra', dataAbertura:'01/03/2026', dataAmostra:'',           responsavel:'Igor Bittencourt', area:'Embalagem',  origem:'Sistema', retornoResposta:'', operacional:{qtdReclamada:'',    dataProd:'',           maquina:'',       operador:'',          operadorEstufa:'', observacao:''}, eficacia:{ ...eficaciaVazio } },
  { id:4, rnc:'158/2026', nCliente:'F-012', cliente:'Químicos do Sul', tipo:'Fornecedor', defeito:'Matéria-prima fora da especificação de viscosidade', classificacao:'Não Conformidade Nova',      situacao:'Aberta',             dataAbertura:'15/03/2026', dataAmostra:'17/03/2026', responsavel:'Igor Bittencourt', area:'Qualidade',  origem:'Portal',  retornoResposta:'', operacional:{qtdReclamada:'',    dataProd:'',           maquina:'',       operador:'',          operadorEstufa:'', observacao:''}, eficacia:{ ...eficaciaVazio } },
]
const ncEncerradasIniciais = [
  { id:10, rnc:'150/2025', nCliente:'22', cliente:'BRF', tipo:'Externa', defeito:'Cor fora do padrão aprovado', classificacao:'Não Conformidade Existente', situacao:'Encerrada', dataAbertura:'10/11/2025', dataAmostra:'12/11/2025', responsavel:'Igor Bittencourt', area:'Litografia', origem:'Sistema', retornoResposta:'23/11/2025', operacional:{qtdReclamada:'1200',dataProd:'05/11/2025',maquina:'Lito 2',operador:'Pedro A.',operadorEstufa:'',observacao:'Lote L-1198'}, eficacia:{ ...eficaciaVazio, causaRaiz:'Troca de fornecedor de tinta sem validação prévia', acaoContencao:'Segregação e retrabalho do lote', acaoCorrecao:'Validação do novo fornecedor', acaoPreventiva:'Processo de qualificação obrigatório', prazoAcao:'2025-11-25', dataRealizada:'23/11/2025', evidencia:'Relatório de validação v1.2', avaliacao:'Eficaz', resultado:'Cor aprovada em nova amostra', reincidente:'nao', v30resultado:'Eficaz — sem recorrência', v60resultado:'Eficaz — sem recorrência' } },
]

// ─── ESTILOS COMPARTILHADOS ──────────────────────────────────────
const INPUT = (erro) => ({
  width:'100%', boxSizing:'border-box',
  padding:'10px 14px', borderRadius:10,
  background: erro ? 'rgba(239,68,68,.08)' : 'rgba(255,255,255,.05)',
  border: `1px solid ${erro ? 'rgba(239,68,68,.4)' : 'rgba(255,255,255,.1)'}`,
  color:'#fff', fontSize:13, fontFamily:'DM Sans', outline:'none',
  transition:'border-color .15s',
})
const SELECT = (erro) => ({ ...INPUT(erro), cursor:'pointer', appearance:'none', WebkitAppearance:'none' })
const TEXTAREA = (erro) => ({ ...INPUT(erro), resize:'none', lineHeight:1.6 })
const LABEL = { display:'block', fontSize:11, fontWeight:600, color:'rgba(255,255,255,.45)', letterSpacing:.8, textTransform:'uppercase', marginBottom:6 }
const SECTION = { background:'rgba(255,255,255,.03)', border:'0.5px solid rgba(255,255,255,.07)', borderRadius:12, padding:'18px 20px', display:'flex', flexDirection:'column', gap:14 }
const SECTION_TITLE = { fontSize:10, fontWeight:700, color:'rgba(255,255,255,.28)', letterSpacing:2.5, textTransform:'uppercase', marginBottom:2 }

// ─── CAMPO WRAPPER ────────────────────────────────────────────────
function Campo({ label, erro, opcional, children }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
        <span style={LABEL}>{label}</span>
        {opcional && <span style={{ fontSize:10, color:'rgba(255,255,255,.25)', fontStyle:'italic' }}>opcional</span>}
        {erro && <span style={{ fontSize:10, color:'#ef4444', display:'flex', alignItems:'center', gap:3 }}><AlertTriangle size={10}/>obrigatório</span>}
      </div>
      {children}
    </div>
  )
}

// ─── DADOS SISTEMA (somente leitura) ─────────────────────────────
function SistemaGrid({ form, prazoStr, dias }) {
  return (
    <div style={SECTION}>
      <div style={SECTION_TITLE}>Dados do sistema</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 24px' }}>
        {[
          ['Nº RNC',              form.rnc],
          ['Área',                form.area || '—'],
          ['Data de abertura',    form.dataAbertura],
          ['Prazo (7 dias úteis)', prazoStr],
          ['Defeito',             form.defeito,      true],
          ['Classificação',       form.classificacao, true],
        ].map(([lbl, val, full]) => (
          <div key={lbl} style={full ? { gridColumn:'1/-1' } : {}}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginBottom:3 }}>{lbl}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:500 }}>{val || '—'}</div>
          </div>
        ))}
      </div>
      {dias !== null && (
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:600,
          background: dias>0?'rgba(239,68,68,.15)':dias===0?'rgba(245,158,11,.15)':'rgba(16,185,129,.15)',
          color:       dias>0?'#fca5a5'            :dias===0?'#fcd34d'              :'#6ee7b7',
          border:`1px solid ${dias>0?'rgba(239,68,68,.25)':dias===0?'rgba(245,158,11,.25)':'rgba(16,185,129,.25)'}` }}>
          <Clock size={11}/>
          {dias>0 ? `${dias}d em atraso` : dias===0 ? 'Vence hoje' : `${Math.abs(dias)}d restantes`}
        </div>
      )}
    </div>
  )
}

// ─── FORMULÁRIO NC — MODAL CENTRALIZADO ──────────────────────────
function FormularioNC({ nc, onSave, onClose }) {
  const [aba, setAba]                   = useState('nc')
  const [form, setForm]                 = useState({ ...nc, operacional:{...nc.operacional}, eficacia:{...eficaciaVazio, ...nc.eficacia} })
  const [tentouEncerrar, setTentouEncerrar] = useState(false)
  const [errosSalvar, setErrosSalvar]   = useState([])

  function set(f,v)  { setForm(p => ({ ...p, [f]:v })) }
  function setOp(f,v){ setForm(p => ({ ...p, operacional:{...p.operacional,[f]:v} })) }
  function setEf(f,v){ setForm(p => ({ ...p, eficacia:{...p.eficacia,[f]:v} })) }

  const prazo    = calcularPrazo(form.dataAbertura, form.dataAmostra)
  const dias     = diasAtraso(prazo)
  const prazoStr = prazo ? formatDataBR(prazo) : '—'
  const tipoC    = TIPO_CFG[form.tipo]    || TIPO_CFG['Interna']
  const sitC     = SIT_CFG[form.situacao] || SIT_CFG['Aberta']

  const errosTodos   = validarNC(form)
  const mostrarErros = tentouEncerrar ? errosTodos : errosSalvar
  const campoErro    = (c) => mostrarErros.some(e => e.campo === c)
  const abaErro      = (a) => mostrarErros.some(e => e.aba === a)

  function handleEncerrar() {
    setTentouEncerrar(true)
    const erros = validarNC(form)
    if (erros.length) { setErrosSalvar(erros); setAba(erros[0].aba); return }
    onSave({ ...form, situacao:'Encerrada' })
  }

  const STEPS = [
    { id:'nc',          num:1, label:'Não conformidade'     },
    { id:'operacional', num:2, label:'Operacional'           },
    { id:'eficacia',    num:3, label:'Eficácia & recorrência'},
  ]

  const iFocus = (e) => { e.target.style.borderColor='rgba(59,130,246,.5)'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,.08)' }
  const iBlur  = (e) => { e.target.style.borderColor=e.target.getAttribute('data-erro')==='1'?'rgba(239,68,68,.4)':'rgba(255,255,255,.1)'; e.target.style.boxShadow='none' }

  // verificações de recorrência pós-ação
  const prazoAcaoDate = form.eficacia.prazoAcao ? new Date(form.eficacia.prazoAcao) : null
  const verifs = prazoAcaoDate ? [
    { key:'v30', dias:30, label:'30 dias', date: isoParaBR(addDias(prazoAcaoDate,30).toISOString().slice(0,10)) },
    { key:'v60', dias:60, label:'60 dias', date: isoParaBR(addDias(prazoAcaoDate,60).toISOString().slice(0,10)) },
    { key:'v90', dias:90, label:'90 dias', date: isoParaBR(addDias(prazoAcaoDate,90).toISOString().slice(0,10)) },
  ] : []

  const recorrenciaDetectada = verifs.some(v => form.eficacia[`${v.key}resultado`] === 'Recorrência detectada')

  return (
    <>
      {/* Overlay com modal centralizado */}
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:40, backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
        onClick={onClose}>

        {/* Modal */}
        <div onClick={e => e.stopPropagation()}
          style={{ width:'min(940px, 100%)', maxHeight:'92vh', background:'linear-gradient(180deg,#0c1628 0%,#0a1020 100%)', borderRadius:18, border:'1px solid rgba(255,255,255,.1)', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,.7)', position:'relative' }}>

          {/* ── CABEÇALHO MODAL ── */}
          <div style={{ padding:'22px 28px 0', borderBottom:'0.5px solid rgba(255,255,255,.07)', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontFamily:'DM Mono', letterSpacing:1 }}>{form.rnc || 'Nova NC'}</span>
                  <div style={{ width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,.2)' }}/>
                  {form.tipo && (
                    <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:tipoC.bg, color:tipoC.cor }}>{form.tipo}</span>
                  )}
                  <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:sitC.bg, color:sitC.cor, display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:sitC.cor }}/>
                    {form.situacao}
                  </span>
                  {errosTodos.length>0 && (
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(245,158,11,.12)', color:'#fcd34d', display:'flex', alignItems:'center', gap:5 }}>
                      <AlertTriangle size={10}/>{errosTodos.length} campo{errosTodos.length>1?'s':''} pendente{errosTodos.length>1?'s':''}
                    </span>
                  )}
                  {recorrenciaDetectada && (
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(239,68,68,.15)', color:'#fca5a5', display:'flex', alignItems:'center', gap:5 }}>
                      <ShieldAlert size={10}/>Recorrência detectada
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize:17, fontWeight:600, color:'#fff', margin:0, lineHeight:1.3 }}>
                  {form.defeito || 'Nova não conformidade'}
                </h2>
              </div>
              <button onClick={onClose}
                style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.06)', border:'0.5px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, marginLeft:16, transition:'all .15s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.12)';e.currentTarget.style.color='#fff'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.color='rgba(255,255,255,.5)'}}>
                <X size={15}/>
              </button>
            </div>

            {/* Stepper */}
            <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:-1 }}>
              {STEPS.map((s, i) => {
                const ativa = aba === s.id
                const temErro = abaErro(s.id)
                return (
                  <button key={s.id} onClick={() => setAba(s.id)}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px',
                      borderBottom:`2px solid ${ativa?(temErro?'#ef4444':'#3b82f6'):'transparent'}`,
                      background:'transparent', border:'none',
                      borderBottom:`2px solid ${ativa?(temErro?'#ef4444':'#3b82f6'):'transparent'}`,
                      cursor:'pointer', transition:'all .15s' }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0,
                      background: ativa?(temErro?'#ef4444':'#3b82f6'):temErro?'rgba(239,68,68,.2)':'rgba(255,255,255,.08)',
                      color: ativa?'#fff':temErro?'#ef4444':'rgba(255,255,255,.4)' }}>
                      {temErro ? <AlertTriangle size={11}/> : s.num}
                    </div>
                    <span style={{ fontSize:13, fontWeight: ativa?600:400, color: ativa?(temErro?'#ef4444':'#fff'):temErro?'rgba(239,68,68,.7)':'rgba(255,255,255,.4)', whiteSpace:'nowrap' }}>
                      {s.label}
                    </span>
                    {i < STEPS.length-1 && <div style={{ width:1, height:16, background:'rgba(255,255,255,.08)', marginLeft:10 }}/>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── CONTEÚDO ── */}
          <div style={{ flex:1, overflowY:'auto', padding:'24px 28px' }}>

            {/* ── ABA 1: NÃO CONFORMIDADE ── */}
            {aba === 'nc' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <SistemaGrid form={form} prazoStr={prazoStr} dias={dias}/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Campo label="Nº Cliente" erro={campoErro('Nº Cliente')}>
                    <input value={form.nCliente} onChange={e=>set('nCliente',e.target.value)}
                      placeholder="Nº do pedido do cliente" data-erro={campoErro('Nº Cliente')?'1':'0'}
                      style={INPUT(campoErro('Nº Cliente'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <Campo label="Cliente" erro={campoErro('Cliente')}>
                    <input value={form.cliente} onChange={e=>set('cliente',e.target.value)}
                      placeholder="Nome do cliente" data-erro={campoErro('Cliente')?'1':'0'}
                      style={INPUT(campoErro('Cliente'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <Campo label="Tipo" erro={campoErro('Tipo')}>
                    <div style={{ position:'relative' }}>
                      <select value={form.tipo} onChange={e=>set('tipo',e.target.value)}
                        style={SELECT(campoErro('Tipo'))} onFocus={iFocus} onBlur={iBlur}>
                        <option>Externa</option><option>Interna</option><option>Fornecedor</option>
                      </select>
                      <ChevronDown size={13} color="rgba(255,255,255,.4)" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                    </div>
                  </Campo>
                  <Campo label="Situação" erro={campoErro('Situação')}>
                    <div style={{ position:'relative' }}>
                      <select value={form.situacao} onChange={e=>set('situacao',e.target.value)}
                        style={SELECT(campoErro('Situação'))} onFocus={iFocus} onBlur={iBlur}>
                        <option>Aberta</option><option>Em análise</option><option>Em andamento</option>
                        <option>Aguardando amostra</option><option>Encerrada</option>
                      </select>
                      <ChevronDown size={13} color="rgba(255,255,255,.4)" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                    </div>
                  </Campo>
                  <Campo label="Data chegada amostra" opcional>
                    <input value={form.dataAmostra} onChange={e=>set('dataAmostra',e.target.value)}
                      placeholder="DD/MM/AAAA ou N/A" style={INPUT(false)} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <Campo label="Retorno da resposta" opcional>
                    <input value={form.retornoResposta||''} onChange={e=>set('retornoResposta',e.target.value)}
                      placeholder="DD/MM/AAAA" style={INPUT(false)} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                </div>
              </div>
            )}

            {/* ── ABA 2: OPERACIONAL ── */}
            {aba === 'operacional' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <SistemaGrid form={form} prazoStr={prazoStr} dias={dias}/>
                <div style={SECTION_TITLE}>Dados operacionais</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Campo label="Quantidade reclamada" erro={campoErro('Quantidade reclamada')}>
                    <input value={form.operacional.qtdReclamada} onChange={e=>setOp('qtdReclamada',e.target.value)}
                      placeholder="Ex: 500 unidades" data-erro={campoErro('Quantidade reclamada')?'1':'0'}
                      style={INPUT(campoErro('Quantidade reclamada'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <Campo label="Data de produção" erro={campoErro('Data de produção')}>
                    <input value={form.operacional.dataProd} onChange={e=>setOp('dataProd',e.target.value)}
                      placeholder="DD/MM/AAAA" data-erro={campoErro('Data de produção')?'1':'0'}
                      style={INPUT(campoErro('Data de produção'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <Campo label="Máquina" erro={campoErro('Máquina')}>
                    <div style={{ position:'relative' }}>
                      <select value={form.operacional.maquina} onChange={e=>setOp('maquina',e.target.value)}
                        style={SELECT(campoErro('Máquina'))} onFocus={iFocus} onBlur={iBlur}>
                        {MAQUINAS.map(m=><option key={m} value={m}>{m||'Selecione...'}</option>)}
                      </select>
                      <ChevronDown size={13} color="rgba(255,255,255,.4)" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                    </div>
                  </Campo>
                  <Campo label="Operador" erro={campoErro('Operador')}>
                    <input value={form.operacional.operador} onChange={e=>setOp('operador',e.target.value)}
                      placeholder="Nome do operador" data-erro={campoErro('Operador')?'1':'0'}
                      style={INPUT(campoErro('Operador'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <Campo label="Operador de estufa" opcional>
                    <input value={form.operacional.operadorEstufa} onChange={e=>setOp('operadorEstufa',e.target.value)}
                      placeholder="Nome do operador de estufa" style={INPUT(false)} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Campo label="Observação" opcional>
                      <textarea value={form.operacional.observacao} onChange={e=>setOp('observacao',e.target.value)}
                        rows={3} placeholder="Observações adicionais sobre a ocorrência..."
                        style={TEXTAREA(false)} onFocus={iFocus} onBlur={iBlur}/>
                    </Campo>
                  </div>
                </div>
              </div>
            )}

            {/* ── ABA 3: EFICÁCIA & RECORRÊNCIA ── */}
            {aba === 'eficacia' && (
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <SistemaGrid form={form} prazoStr={prazoStr} dias={dias}/>

                {/* Bloco 1 — Análise de causa */}
                <div style={SECTION}>
                  <div style={SECTION_TITLE}>Análise de causa e ações corretivas</div>
                  <Campo label="Análise de causa (5 Porquês)" erro={campoErro('Análise de causa')}>
                    <textarea value={form.eficacia.causaRaiz} onChange={e=>setEf('causaRaiz',e.target.value)}
                      placeholder={'1. Por quê ocorreu?\n2. Por quê esse motivo existiu?\n3. Por quê não foi detectado?\n4. Por quê o controle falhou?\n5. Causa raiz:'}
                      rows={5} data-erro={campoErro('Análise de causa')?'1':'0'}
                      style={TEXTAREA(campoErro('Análise de causa'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <Campo label="Ação de contenção" erro={campoErro('Ação de contenção')}>
                      <textarea value={form.eficacia.acaoContencao} onChange={e=>setEf('acaoContencao',e.target.value)}
                        rows={3} placeholder="Ação imediata para conter o problema..."
                        data-erro={campoErro('Ação de contenção')?'1':'0'}
                        style={TEXTAREA(campoErro('Ação de contenção'))} onFocus={iFocus} onBlur={iBlur}/>
                    </Campo>
                    <Campo label="Ação de correção" erro={campoErro('Ação de correção')}>
                      <textarea value={form.eficacia.acaoCorrecao} onChange={e=>setEf('acaoCorrecao',e.target.value)}
                        rows={3} placeholder="Ação para eliminar a não conformidade..."
                        data-erro={campoErro('Ação de correção')?'1':'0'}
                        style={TEXTAREA(campoErro('Ação de correção'))} onFocus={iFocus} onBlur={iBlur}/>
                    </Campo>
                  </div>
                  <Campo label="Ação preventiva" erro={campoErro('Ação preventiva')}>
                    <textarea value={form.eficacia.acaoPreventiva} onChange={e=>setEf('acaoPreventiva',e.target.value)}
                      rows={2} placeholder="Ação para evitar recorrência..."
                      data-erro={campoErro('Ação preventiva')?'1':'0'}
                      style={TEXTAREA(campoErro('Ação preventiva'))} onFocus={iFocus} onBlur={iBlur}/>
                  </Campo>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                    <Campo label="Prazo da ação" erro={campoErro('Prazo da ação')}>
                      <input type="date" value={form.eficacia.prazoAcao} onChange={e=>setEf('prazoAcao',e.target.value)}
                        data-erro={campoErro('Prazo da ação')?'1':'0'}
                        style={{ ...INPUT(campoErro('Prazo da ação')), colorScheme:'dark' }} onFocus={iFocus} onBlur={iBlur}/>
                    </Campo>
                    <Campo label="Data realizada" erro={campoErro('Data realizada')}>
                      <input value={form.eficacia.dataRealizada} onChange={e=>setEf('dataRealizada',e.target.value)}
                        placeholder="DD/MM/AAAA" data-erro={campoErro('Data realizada')?'1':'0'}
                        style={INPUT(campoErro('Data realizada'))} onFocus={iFocus} onBlur={iBlur}/>
                    </Campo>
                    <Campo label="Evidência" erro={campoErro('Evidência')}>
                      <div style={{ display:'flex', gap:6 }}>
                        <input value={form.eficacia.evidencia} onChange={e=>setEf('evidencia',e.target.value)}
                          placeholder="Arquivo ou descrição"
                          data-erro={campoErro('Evidência')?'1':'0'}
                          style={{ ...INPUT(campoErro('Evidência')), flex:1 }} onFocus={iFocus} onBlur={iBlur}/>
                        <button style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0 12px', borderRadius:10, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.5)', cursor:'pointer', flexShrink:0 }}>
                          <Paperclip size={13}/>
                        </button>
                      </div>
                    </Campo>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <Campo label="Avaliação de eficácia" erro={campoErro('Avaliação de eficácia')}>
                      <div style={{ position:'relative' }}>
                        <select value={form.eficacia.avaliacao} onChange={e=>setEf('avaliacao',e.target.value)}
                          data-erro={campoErro('Avaliação de eficácia')?'1':'0'}
                          style={SELECT(campoErro('Avaliação de eficácia'))} onFocus={iFocus} onBlur={iBlur}>
                          {EFICACIA_OPTS.map(o=><option key={o} value={o}>{o||'Selecione...'}</option>)}
                        </select>
                        <ChevronDown size={13} color="rgba(255,255,255,.4)" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                      </div>
                    </Campo>
                    <Campo label="Resultado da avaliação" opcional>
                      <textarea value={form.eficacia.resultado} onChange={e=>setEf('resultado',e.target.value)}
                        rows={1} placeholder="Descreva o resultado da verificação..."
                        style={TEXTAREA(false)} onFocus={iFocus} onBlur={iBlur}/>
                    </Campo>
                  </div>
                  {form.eficacia.avaliacao && (
                    <div style={{ padding:'12px 16px', borderRadius:10, fontSize:13, fontWeight:500,
                      background: form.eficacia.avaliacao==='Eficaz'?'rgba(16,185,129,.1)':form.eficacia.avaliacao==='Parcialmente eficaz'?'rgba(245,158,11,.1)':'rgba(239,68,68,.1)',
                      border:`1px solid ${form.eficacia.avaliacao==='Eficaz'?'rgba(16,185,129,.25)':form.eficacia.avaliacao==='Parcialmente eficaz'?'rgba(245,158,11,.25)':'rgba(239,68,68,.25)'}`,
                      color: form.eficacia.avaliacao==='Eficaz'?'#6ee7b7':form.eficacia.avaliacao==='Parcialmente eficaz'?'#fcd34d':'#fca5a5',
                      display:'flex', alignItems:'center', gap:8 }}>
                      {form.eficacia.avaliacao==='Eficaz'
                        ? <><CheckCircle size={15}/>Ação eficaz — NC pode ser encerrada</>
                        : form.eficacia.avaliacao==='Parcialmente eficaz'
                        ? <><AlertTriangle size={15}/>Ação parcialmente eficaz — revisar plano</>
                        : <><ShieldAlert size={15}/>Ação não eficaz — reabrir com nova análise</>}
                    </div>
                  )}
                </div>

                {/* Bloco 2 — Análise de reincidência */}
                <div style={SECTION}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <RefreshCw size={13} color="rgba(255,255,255,.4)"/>
                    <div style={SECTION_TITLE}>Análise de reincidência</div>
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginTop:-6, marginBottom:4, lineHeight:1.5 }}>
                    Identifique se este defeito/causa já ocorreu anteriormente. NCs reincidentes exigem revisão do plano de ação.
                  </div>

                  {/* Toggle reincidente */}
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,.6)', flex:1 }}>Esta NC é reincidente (mesmo defeito ou causa raiz)?</span>
                    <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, padding:3 }}>
                      {[['sim','Sim','rgba(239,68,68,.8)'],['nao','Não','#10b981'],['','Indefinido','rgba(255,255,255,.3)']].map(([val,lbl,cor])=>(
                        <button key={val} onClick={()=>setEf('reincidente',val)}
                          style={{ padding:'6px 14px', borderRadius:6, fontSize:12, fontWeight:form.eficacia.reincidente===val?600:400, cursor:'pointer', border:'none', transition:'all .15s',
                            background: form.eficacia.reincidente===val?`${cor}22`:'transparent',
                            color: form.eficacia.reincidente===val?cor:'rgba(255,255,255,.35)',
                            outline: form.eficacia.reincidente===val?`1px solid ${cor}44`:'none' }}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.eficacia.reincidente === 'sim' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, padding:'14px', borderRadius:10, background:'rgba(239,68,68,.06)', border:'1px solid rgba(239,68,68,.15)' }}>
                      <div style={{ gridColumn:'1/-1', fontSize:12, color:'#fca5a5', display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                        <ShieldAlert size={13}/>Este defeito/causa já ocorreu antes. Verifique se as ações anteriores foram realmente eficazes.
                      </div>
                      <Campo label="Ocorrências nos últimos 12 meses" opcional>
                        <input type="number" min="1" value={form.eficacia.reincidenteQtd} onChange={e=>setEf('reincidenteQtd',e.target.value)}
                          placeholder="Qtd. de vezes" style={INPUT(false)} onFocus={iFocus} onBlur={iBlur}/>
                      </Campo>
                      <Campo label="RNC anterior relacionada" opcional>
                        <input value={form.eficacia.reincidenteRNC} onChange={e=>setEf('reincidenteRNC',e.target.value)}
                          placeholder="Ex: 140/2025" style={INPUT(false)} onFocus={iFocus} onBlur={iBlur}/>
                      </Campo>
                    </div>
                  )}
                </div>

                {/* Bloco 3 — Verificações pós-ação */}
                <div style={SECTION}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <RefreshCw size={13} color="rgba(255,255,255,.4)"/>
                    <div style={SECTION_TITLE}>Verificações pós-ação (monitoramento de eficácia)</div>
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginTop:-6, marginBottom:4, lineHeight:1.5 }}>
                    Após a conclusão da ação corretiva, registre as verificações programadas para confirmar que o problema não voltou a ocorrer.
                    {prazoAcaoDate && <span style={{ color:'rgba(255,255,255,.5)' }}> Datas calculadas a partir do prazo da ação.</span>}
                  </div>

                  {!prazoAcaoDate && (
                    <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.15)', fontSize:12, color:'#fcd34d', display:'flex', alignItems:'center', gap:8 }}>
                      <AlertTriangle size={13}/>Defina o Prazo da ação (bloco acima) para calcular automaticamente as datas de verificação.
                    </div>
                  )}

                  {verifs.length > 0 && verifs.map(v => {
                    const resultado  = form.eficacia[`${v.key}resultado`]
                    const obs        = form.eficacia[`${v.key}obs`]
                    const recorrente = resultado === 'Recorrência detectada'
                    const eficaz     = resultado === 'Eficaz — sem recorrência'
                    return (
                      <div key={v.key} style={{ padding:'14px 16px', borderRadius:12, background: recorrente?'rgba(239,68,68,.07)':eficaz?'rgba(16,185,129,.07)':'rgba(255,255,255,.03)', border:`1px solid ${recorrente?'rgba(239,68,68,.2)':eficaz?'rgba(16,185,129,.2)':'rgba(255,255,255,.07)'}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexWrap:'wrap' }}>
                          <div style={{ width:28, height:28, borderRadius:8, background: recorrente?'rgba(239,68,68,.15)':eficaz?'rgba(16,185,129,.15)':'rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            {eficaz ? <CheckCircle size={13} color="#10b981"/> : recorrente ? <ShieldAlert size={13} color="#ef4444"/> : <Clock size={13} color="rgba(255,255,255,.4)"/>}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:12, fontWeight:600, color: recorrente?'#fca5a5':eficaz?'#6ee7b7':'rgba(255,255,255,.7)' }}>Verificação de {v.label}</div>
                            <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:1 }}>Prevista para: {v.date}</div>
                          </div>
                          <div style={{ position:'relative' }}>
                            <select value={resultado} onChange={e=>setEf(`${v.key}resultado`,e.target.value)}
                              style={{ ...SELECT(false), width:'220px', fontSize:12, padding:'7px 32px 7px 12px',
                                color: recorrente?'#fca5a5':eficaz?'#6ee7b7':'rgba(255,255,255,.6)',
                                background: recorrente?'rgba(239,68,68,.1)':eficaz?'rgba(16,185,129,.1)':'rgba(255,255,255,.05)' }}>
                              {VERIF_OPTS.map(o=><option key={o} value={o}>{o||'Selecionar resultado...'}</option>)}
                            </select>
                            <ChevronDown size={12} color="rgba(255,255,255,.4)" style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                          </div>
                        </div>
                        {recorrente && (
                          <div style={{ padding:'8px 10px', borderRadius:8, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.15)', fontSize:12, color:'#fca5a5', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                            <AlertTriangle size={12}/>Problema reincidente — esta NC deve ser reaberta e o plano de ação revisado.
                          </div>
                        )}
                        <Campo label={`Observações da verificação de ${v.label}`} opcional>
                          <textarea value={obs} onChange={e=>setEf(`${v.key}obs`,e.target.value)}
                            rows={2} placeholder="Descreva o resultado da verificação e as evidências encontradas..."
                            style={TEXTAREA(false)} onFocus={iFocus} onBlur={iBlur}/>
                        </Campo>
                      </div>
                    )
                  })}
                </div>

                {/* Erros de encerramento */}
                {tentouEncerrar && errosTodos.length>0 && (
                  <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, fontWeight:600, color:'#fca5a5', marginBottom:10 }}>
                      <AlertTriangle size={14}/>Campos obrigatórios pendentes:
                    </div>
                    {errosTodos.map((e,i)=>(
                      <button key={i} onClick={()=>setAba(e.aba)}
                        style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, color:'rgba(239,68,68,.7)', background:'none', border:'none', cursor:'pointer', padding:'3px 0', width:'100%', textAlign:'left' }}>
                        <div style={{ width:4, height:4, borderRadius:'50%', background:'#ef4444' }}/>
                        {e.campo} <ArrowRight size={10}/> Aba {e.aba==='nc'?'1':e.aba==='operacional'?'2':'3'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RODAPÉ ── */}
          <div style={{ padding:'16px 28px', borderTop:'0.5px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'rgba(0,0,0,.2)' }}>
            <div style={{ display:'flex', gap:8 }}>
              {aba !== 'nc' && (
                <button onClick={()=>setAba(aba==='eficacia'?'operacional':'nc')}
                  style={{ padding:'9px 18px', borderRadius:9, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.6)', fontSize:13, cursor:'pointer' }}>
                  ← Voltar
                </button>
              )}
              <button onClick={()=>onSave({...form})}
                style={{ padding:'9px 18px', borderRadius:9, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.6)', fontSize:13, cursor:'pointer' }}>
                Salvar rascunho
              </button>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {aba !== 'eficacia' ? (
                <button onClick={()=>setAba(aba==='nc'?'operacional':'eficacia')}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 22px', borderRadius:9, background:'linear-gradient(135deg,#185FA5,#0c447c)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  Próximo <ChevronRight size={14}/>
                </button>
              ) : (
                <button onClick={handleEncerrar}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 22px', borderRadius:9,
                    background: errosTodos.length&&tentouEncerrar ? 'rgba(239,68,68,.15)' : 'linear-gradient(135deg,#059669,#047857)',
                    border: errosTodos.length&&tentouEncerrar ? '1px solid rgba(239,68,68,.3)' : 'none',
                    color: errosTodos.length&&tentouEncerrar ? '#fca5a5' : '#fff',
                    fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  <CheckCircle size={14}/>
                  {errosTodos.length&&tentouEncerrar ? `${errosTodos.length} campo${errosTodos.length>1?'s':''} pendente${errosTodos.length>1?'s':''}` : 'Encerrar NC'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── TELA PRINCIPAL ───────────────────────────────────────────────
export default function NaoConformidades() {
  const [abertas, setAbertas]         = useState(ncIniciais)
  const [encerradas, setEncerradas]   = useState(ncEncerradasIniciais)
  const [aba, setAba]                 = useState('abertas')
  const [search, setSearch]           = useState('')
  const [filtroTipo, setFiltroTipo]   = useState('todos')
  const [ncAtiva, setNcAtiva]         = useState(null)
  const [novaNC, setNovaNC]           = useState(false)

  const novoForm = {
    id:Date.now(), rnc:'', nCliente:'', cliente:'', tipo:'Externa',
    defeito:'', classificacao:'Não Conformidade Nova', situacao:'Aberta',
    dataAbertura:new Date().toLocaleDateString('pt-BR'),
    dataAmostra:'', responsavel:'Igor Bittencourt', retornoResposta:'', area:'Qualidade', origem:'Portal',
    operacional:{qtdReclamada:'',dataProd:'',maquina:'',operador:'',operadorEstufa:'',observacao:''},
    eficacia:{ ...eficaciaVazio },
  }

  function salvarNC(form) {
    if (form.situacao==='Encerrada') {
      setAbertas(p => p.filter(n=>n.id!==form.id))
      setEncerradas(p => [form,...p])
    } else {
      const existe = abertas.find(n=>n.id===form.id)
      if (existe) setAbertas(p=>p.map(n=>n.id===form.id?form:n))
      else setAbertas(p=>[form,...p])
    }
    setNcAtiva(null); setNovaNC(false)
  }

  const atrasadas    = abertas.filter(n=>{ const p=calcularPrazo(n.dataAbertura,n.dataAmostra); return p&&diasAtraso(p)>0 }).length
  const comPendentes = abertas.filter(n=>validarNC(n).length>0).length

  const filtrar = lista => lista.filter(n=>{
    const ms = [n.rnc,n.cliente,n.defeito,n.area].join(' ').toLowerCase().includes(search.toLowerCase())
    const mt = filtroTipo==='todos' || n.tipo===filtroTipo
    return ms && mt
  })

  const listaAtual  = filtrar(aba==='abertas' ? abertas : encerradas)
  const totalAberto = abertas.length

  const COLUNAS = ['RNC', 'Cliente', 'Defeito / Responsável', 'Tipo', 'Área', 'Abertura', 'Prazo', 'Situação', '']

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:'100vh', background:'linear-gradient(150deg,#070d1c 0%,#0b1428 60%,#080f1e 100%)', margin:'-24px', padding:'28px 28px 48px', color:'#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* ── CABEÇALHO ── */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.28)', letterSpacing:2.5, textTransform:'uppercase', fontFamily:'DM Mono', marginBottom:8 }}>
            SGQ · Módulo de ocorrências
          </div>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#fff', margin:'0 0 6px', letterSpacing:-.4 }}>Não Conformidades</h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.35)', margin:0 }}>Registro, rastreabilidade e avaliação de eficácia — Grupo Incoflandres</p>
        </div>
        <button onClick={()=>setNovaNC(true)}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:10, background:'linear-gradient(135deg,#185FA5,#0c447c)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 0 24px rgba(24,95,165,.35)', transition:'all .15s', whiteSpace:'nowrap', marginTop:4 }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow='0 0 32px rgba(24,95,165,.55)'}
          onMouseLeave={e=>e.currentTarget.style.boxShadow='0 0 24px rgba(24,95,165,.35)'}>
          <Plus size={15}/> Nova NC
        </button>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Em aberto',  valor:totalAberto,       cor:'#3b82f6', icon:AlertCircle,   sub:'registro'+(totalAberto!==1?'s':'')           },
          { label:'Atrasadas',  valor:atrasadas,         cor:'#ef4444', icon:TrendingDown,   sub:atrasadas>0?'fora do prazo':'dentro do prazo' },
          { label:'Pendentes',  valor:comPendentes,      cor:'#f59e0b', icon:AlertTriangle,  sub:'campo'+(comPendentes!==1?'s':'')+' em falta' },
          { label:'Encerradas', valor:encerradas.length, cor:'#10b981', icon:CheckCircle,    sub:'concluída'+(encerradas.length!==1?'s':'')    },
        ].map(({ label, valor, cor, icon:Icon, sub }) => (
          <div key={label} style={{ background:'rgba(255,255,255,.04)', border:`0.5px solid ${cor}20`, borderRadius:16, padding:'20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${cor},${cor}88)` }}/>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:2, textTransform:'uppercase', fontFamily:'DM Mono' }}>{label}</span>
              <Icon size={15} color={cor} style={{ opacity:.7 }}/>
            </div>
            <div style={{ fontSize:34, fontWeight:700, color, fontFamily:'DM Mono', lineHeight:1, marginBottom:4 }}>{valor}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── ALERT BANNER ── */}
      {(atrasadas>0||comPendentes>0) && (
        <div style={{ padding:'12px 18px', borderRadius:12, background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.2)', display:'flex', alignItems:'center', gap:12, marginBottom:20, fontSize:13, color:'#fcd34d' }}>
          <AlertTriangle size={15} style={{ flexShrink:0 }}/>
          <span>
            {atrasadas>0 && <strong>{atrasadas} NC{atrasadas>1?'s':''} em atraso</strong>}
            {atrasadas>0&&comPendentes>0&&' · '}
            {comPendentes>0 && <strong>{comPendentes} com campos incompletos</strong>}
            . Clique na linha para editar.
          </span>
        </div>
      )}

      {/* ── PAINEL DA TABELA ── */}
      <div style={{ background:'rgba(255,255,255,.03)', border:'0.5px solid rgba(255,255,255,.07)', borderRadius:16, overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{ padding:'14px 18px', borderBottom:'0.5px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:9, padding:3, gap:2 }}>
            {[['abertas','Em aberto',abertas.length,'#3b82f6'],['encerradas','Encerradas',encerradas.length,'#10b981']].map(([id,lbl,cnt,cor])=>(
              <button key={id} onClick={()=>setAba(id)}
                style={{ padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:aba===id?600:400, cursor:'pointer', border:'none', transition:'all .15s',
                  background:aba===id?`${cor}20`:'transparent',
                  color:aba===id?cor:'rgba(255,255,255,.4)',
                  outline:aba===id?`1px solid ${cor}30`:'none' }}>
                {lbl}
                <span style={{ marginLeft:6, padding:'1px 7px', borderRadius:20, fontSize:10, fontWeight:700,
                  background:aba===id?`${cor}25`:'rgba(255,255,255,.06)', color:aba===id?cor:'rgba(255,255,255,.3)' }}>{cnt}</span>
              </button>
            ))}
          </div>

          <div style={{ position:'relative', flex:1, minWidth:220 }}>
            <Search size={14} color='rgba(255,255,255,.3)' style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
            <input placeholder="Buscar por RNC, cliente, defeito, área..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ width:'100%', boxSizing:'border-box', padding:'8px 12px 8px 36px', background:'rgba(255,255,255,.05)', border:'0.5px solid rgba(255,255,255,.09)', borderRadius:9, color:'#fff', fontSize:13, fontFamily:'DM Sans', outline:'none', transition:'border-color .15s' }}
              onFocus={e=>e.target.style.borderColor='rgba(59,130,246,.4)'}
              onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.09)'}/>
          </div>

          <div style={{ position:'relative' }}>
            <Filter size={13} color='rgba(255,255,255,.3)' style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
            <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}
              style={{ padding:'8px 32px 8px 32px', background:'rgba(255,255,255,.05)', border:'0.5px solid rgba(255,255,255,.09)', borderRadius:9, color:'rgba(255,255,255,.7)', fontSize:12, fontFamily:'DM Sans', outline:'none', cursor:'pointer', appearance:'none' }}>
              <option value="todos">Todos os tipos</option>
              <option value="Externa">Externa</option>
              <option value="Interna">Interna</option>
              <option value="Fornecedor">Fornecedor</option>
            </select>
            <ChevronDown size={12} color='rgba(255,255,255,.35)' style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
          </div>

          <span style={{ fontSize:12, color:'rgba(255,255,255,.25)', marginLeft:'auto', fontFamily:'DM Mono' }}>
            {listaAtual.length} registro{listaAtual.length!==1?'s':''}
          </span>
        </div>

        {/* Tabela */}
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'0.5px solid rgba(255,255,255,.07)' }}>
                {COLUNAS.map(c => (
                  <th key={c} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'rgba(255,255,255,.25)', letterSpacing:1.2, textTransform:'uppercase', whiteSpace:'nowrap', background:'rgba(0,0,0,.15)' }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listaAtual.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,.2)' }}>
                    <AlertCircle size={28} style={{ margin:'0 auto 10px', display:'block', opacity:.4 }}/>
                    <div style={{ fontSize:14 }}>Nenhuma não conformidade encontrada</div>
                    <div style={{ fontSize:12, marginTop:4, color:'rgba(255,255,255,.15)' }}>Ajuste os filtros ou registre uma nova NC</div>
                  </td>
                </tr>
              )}

              {listaAtual.map((nc, idx) => {
                const prazo    = calcularPrazo(nc.dataAbertura, nc.dataAmostra)
                const dias     = diasAtraso(prazo)
                const tipoC    = TIPO_CFG[nc.tipo]    || TIPO_CFG['Interna']
                const sitC     = SIT_CFG[nc.situacao] || SIT_CFG['Aberta']
                const atrasada = dias !== null && dias > 0
                const SitIcon  = sitC.icon

                return (
                  <tr key={nc.id} onClick={()=>setNcAtiva(nc)}
                    style={{ borderBottom:'0.5px solid rgba(255,255,255,.05)', cursor:'pointer', transition:'background .12s',
                      background: atrasada ? 'rgba(239,68,68,.04)' : 'transparent' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.04)'}
                    onMouseLeave={e=>e.currentTarget.style.background=atrasada?'rgba(239,68,68,.04)':'transparent'}>

                    {/* RNC */}
                    <td style={{ padding:'14px 16px', whiteSpace:'nowrap' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:3, height:34, borderRadius:2, background:tipoC.cor, opacity:.8, flexShrink:0 }}/>
                        <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.55)', fontFamily:'DM Mono' }}>{nc.rnc}</span>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ fontWeight:500, color:'rgba(255,255,255,.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:130 }}>{nc.cliente}</div>
                      {nc.nCliente && <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:1 }}>Nº {nc.nCliente}</div>}
                    </td>

                    {/* Defeito */}
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ color:'rgba(255,255,255,.85)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:300 }}>{nc.defeito}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:1, display:'flex', alignItems:'center', gap:4 }}>
                        <User size={10}/>{nc.responsavel}
                      </div>
                    </td>

                    {/* Tipo */}
                    <td style={{ padding:'14px 16px', whiteSpace:'nowrap' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:6, background:tipoC.bg, color:tipoC.cor }}>
                        {nc.tipo}
                      </span>
                    </td>

                    {/* Área */}
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,.45)', display:'flex', alignItems:'center', gap:4 }}>
                        <Tag size={11} color='rgba(255,255,255,.25)'/>{nc.area}
                      </span>
                    </td>

                    {/* Data abertura */}
                    <td style={{ padding:'14px 16px', whiteSpace:'nowrap' }}>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,.4)', fontFamily:'DM Mono' }}>{nc.dataAbertura}</span>
                    </td>

                    {/* Prazo */}
                    <td style={{ padding:'14px 16px', whiteSpace:'nowrap' }}>
                      {dias !== null ? (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:7,
                          background: dias>0?'rgba(239,68,68,.15)':dias===0?'rgba(245,158,11,.15)':'rgba(16,185,129,.12)',
                          color:      dias>0?'#fca5a5'            :dias===0?'#fcd34d'              :'#6ee7b7',
                          border:     `1px solid ${dias>0?'rgba(239,68,68,.25)':dias===0?'rgba(245,158,11,.25)':'rgba(16,185,129,.2)'}` }}>
                          <Clock size={10}/>
                          {dias>0 ? `${dias}d atraso` : dias===0 ? 'Vence hoje' : `${Math.abs(dias)}d restam`}
                        </span>
                      ) : (
                        <span style={{ fontSize:12, color:'rgba(255,255,255,.2)' }}>—</span>
                      )}
                    </td>

                    {/* Situação — coluna de destaque */}
                    <td style={{ padding:'14px 16px', whiteSpace:'nowrap' }}>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:9,
                        background:sitC.bg, border:`1px solid ${sitC.cor}30` }}>
                        <SitIcon size={13} color={sitC.cor}/>
                        <span style={{ fontSize:12, fontWeight:600, color:sitC.cor }}>{nc.situacao}</span>
                      </div>
                    </td>

                    {/* Seta */}
                    <td style={{ padding:'14px 16px', textAlign:'center' }}>
                      <ChevronRight size={15} color='rgba(255,255,255,.2)'/>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        {listaAtual.length > 0 && (
          <div style={{ padding:'12px 18px', borderTop:'0.5px solid rgba(255,255,255,.06)', background:'rgba(0,0,0,.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,.25)', fontFamily:'DM Mono' }}>
              {listaAtual.length} de {(aba==='abertas'?abertas:encerradas).length} registros
            </span>
            {aba==='abertas' && atrasadas>0 && (
              <span style={{ fontSize:12, color:'#fca5a5', display:'flex', alignItems:'center', gap:5 }}>
                <AlertTriangle size={12}/>{atrasadas} fora do prazo
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {(ncAtiva || novaNC) && (
        <FormularioNC
          nc={ncAtiva || novoForm}
          onSave={salvarNC}
          onClose={()=>{ setNcAtiva(null); setNovaNC(false) }}
        />
      )}
    </div>
  )
}
