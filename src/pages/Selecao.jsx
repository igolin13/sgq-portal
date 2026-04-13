import { useState } from 'react'
import { ClipboardList, Package, ArrowLeft, Plus, Minus, Download } from 'lucide-react'
import TopBar from '../components/TopBar'
import ApontamentoSelecao from './controle/formularios/ApontamentoSelecao'
import { exportarParaCSV } from '../services/sharepointService'

// ── Dados mock ──────────────────────────────────────────────────────────────
const ESTOQUE_INICIAL = [
  { id:1, item:'Fita adesiva transparente', qtd:48,  unidade:'rolos',  minimo:10  },
  { id:2, item:'Caixa de papelão 40x30x20', qtd:120, unidade:'un',     minimo:50  },
  { id:3, item:'Luvas de borracha M',        qtd:6,   unidade:'pares',  minimo:20  },
  { id:4, item:'Etiqueta adesiva branca',    qtd:500, unidade:'un',     minimo:100 },
  { id:5, item:'Caneta marcadora preta',     qtd:8,   unidade:'un',     minimo:5   },
]

const HISTORICO_MOCK = [
  { data:'04/04/26', tipo:'Seleção Normal',  selecionadora:'Ana Souza',     maquina:'Lito 2', op:'2026-0101', fardo:12, horaInicio:'07:00', horaFim:'09:30', folhasBoas:4820, folhasPerda:180, total:5000, defeitos:[{defeito:'Manchado',quantidade:'120'},{defeito:'Riscado',quantidade:'60'}] },
  { data:'04/04/26', tipo:'Retrabalho',       selecionadora:'Beatriz Lima',  maquina:'Env 3',  op:'2026-0099', fardo:7,  horaInicio:'10:00', horaFim:'12:00', folhasBoas:2100, folhasPerda:400, total:2500, defeitos:[{defeito:'Amassado',quantidade:'250'},{defeito:'Furado',quantidade:'150'}] },
  { data:'03/04/26', tipo:'Seleção Especial', selecionadora:'Carla Mendes',  maquina:'Lito 5', op:'2026-0098', fardo:3,  horaInicio:'13:00', horaFim:'14:30', folhasBoas:990,  folhasPerda:10,  total:1000, defeitos:[{defeito:'Dobra',quantidade:'10'}] },
  { data:'03/04/26', tipo:'Seleção Normal',  selecionadora:'Daniela Costa', maquina:'Env 1',  op:'2026-0097', fardo:21, horaInicio:'15:00', horaFim:'18:00', folhasBoas:8700, folhasPerda:300, total:9000, defeitos:[{defeito:'Traço',quantidade:'200'},{defeito:'Trinca',quantidade:'100'}] },
  { data:'02/04/26', tipo:'Seleção Normal',  selecionadora:'Ana Souza',     maquina:'Lito 4', op:'2026-0090', fardo:5,  horaInicio:'07:00', horaFim:'09:00', folhasBoas:3200, folhasPerda:300, total:3500, defeitos:[{defeito:'Sujo',quantidade:'300'}] },
]

const MOV_MOCK = [
  { id:1, data:'03/04/26', tipo:'Entrada', item:'Fita adesiva transparente', qtd:20, responsavel:'Igor Bittencourt', motivo:'' },
  { id:2, data:'02/04/26', tipo:'Saída',   item:'Luvas de borracha M',        qtd:10, responsavel:'Ana Souza',       motivo:'Uso na linha 2' },
  { id:3, data:'01/04/26', tipo:'Entrada', item:'Caixa de papelão 40x30x20', qtd:100, responsavel:'Carlos Mendes',  motivo:'' },
]

function statusEstoque(qtd, minimo) {
  if (qtd === 0)       return { label:'Crítico', cor:'#dc2626', bg:'#fff5f5', border:'#fca5a5' }
  if (qtd <= minimo)   return { label:'Baixo',   cor:'#d97706', bg:'#fffbeb', border:'#fde68a' }
  return                      { label:'OK',      cor:'#16a34a', bg:'#f0fdf4', border:'#86efac' }
}

const COR = '#f59e0b'

// ── Exportação dual ──────────────────────────────────────────────────────────
function exportarDual(historico, filtroInicio, filtroFim) {
  let dados = [...historico]
  if (filtroInicio) dados = dados.filter(r => r.data >= filtroInicio)
  if (filtroFim)    dados = dados.filter(r => r.data <= filtroFim)

  if (dados.length === 0) { alert('Nenhum registro no período selecionado.'); return }

  // Planilha 1 — Apontamentos completos (sem coluna defeitos)
  const ap1 = dados.map(r => ({
    Data: r.data, Tipo: r.tipo, Selecionadora: r.selecionadora,
    Linha: r.maquina, OP: r.op, 'Nº Fardo': r.fardo,
    'Hora Início': r.horaInicio, 'Hora Fim': r.horaFim,
    'Folhas Boas': r.folhasBoas, 'Folhas Perda': r.folhasPerda, Total: r.total,
  }))

  // Planilha 2 — Somente defeitos (uma linha por defeito)
  const ap2 = []
  dados.forEach(r => {
    if (!r.defeitos || r.defeitos.length === 0) {
      ap2.push({ Data: r.data, Tipo: r.tipo, Selecionadora: r.selecionadora, Linha: r.maquina, OP: r.op, 'Nº Fardo': r.fardo, Defeito: '—', Quantidade: 0 })
    } else {
      r.defeitos.forEach(d => {
        ap2.push({ Data: r.data, Tipo: r.tipo, Selecionadora: r.selecionadora, Linha: r.maquina, OP: r.op, 'Nº Fardo': r.fardo, Defeito: d.defeito, Quantidade: d.quantidade })
      })
    }
  })

  exportarParaCSV(ap1, 'selecao_apontamentos')
  // Pequeno delay para não bloquear o download duplo
  setTimeout(() => exportarParaCSV(ap2, 'selecao_defeitos'), 500)
}

// ── Componente Estoque ────────────────────────────────────────────────────────
function Estoque() {
  const [estoque,  setEstoque]  = useState(ESTOQUE_INICIAL)
  const [movs,     setMovs]     = useState(MOV_MOCK)
  const [modalMov, setModalMov] = useState(null)
  const [formMov,  setFormMov]  = useState({ item:'', qtd:'', responsavel:'', motivo:'', data: new Date().toISOString().slice(0,10) })

  function confirmarMov() {
    if (!formMov.item || !formMov.qtd || !formMov.responsavel) return
    setMovs(p => [{ id: Date.now(), tipo: modalMov === 'entrada' ? 'Entrada' : 'Saída', ...formMov }, ...p])
    setEstoque(prev => prev.map(e => {
      if (e.item !== formMov.item) return e
      const delta = parseInt(formMov.qtd) || 0
      return { ...e, qtd: modalMov === 'entrada' ? e.qtd + delta : Math.max(0, e.qtd - delta) }
    }))
    setModalMov(null)
    setFormMov({ item:'', qtd:'', responsavel:'', motivo:'', data: new Date().toISOString().slice(0,10) })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => setModalMov('entrada')}
          style={{ flex:1, padding:'13px 0', borderRadius:10, background:'#f0fdf4', border:'1.5px solid #86efac', color:'#15803d', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Plus size={18}/> Entrada de material
        </button>
        <button onClick={() => setModalMov('saida')}
          style={{ flex:1, padding:'13px 0', borderRadius:10, background:'#fff5f5', border:'1.5px solid #fca5a5', color:'#dc2626', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Minus size={18}/> Saída de material
        </button>
      </div>

      <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ padding:'13px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:8 }}>
          <Package size={15} color={COR}/>
          <span style={{ fontSize:14, fontWeight:700, color:'#1f2937' }}>Itens em estoque</span>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f9fafb' }}>
              {['Item','Qtd atual','Unidade','Mínimo','Status'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {estoque.map((e, i) => {
              const s = statusEstoque(e.qtd, e.minimo)
              return (
                <tr key={e.id} style={{ borderTop: i ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding:'12px 16px', fontSize:14, color:'#374151', fontWeight:500 }}>{e.item}</td>
                  <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700, color: e.qtd <= e.minimo ? '#dc2626' : '#1f2937' }}>{e.qtd.toLocaleString('pt-BR')}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, color:'#6b7280' }}>{e.unidade}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, color:'#6b7280' }}>{e.minimo}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, color:s.cor, background:s.bg, border:`1px solid ${s.border}` }}>{s.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ padding:'13px 20px', borderBottom:'1px solid #f3f4f6' }}>
          <span style={{ fontSize:14, fontWeight:700, color:'#1f2937' }}>Movimentações recentes</span>
        </div>
        {movs.map((m, i) => (
          <div key={m.id} style={{ padding:'12px 20px', borderTop: i ? '1px solid #f9fafb' : 'none', display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ width:64, fontSize:12, fontWeight:700, color: m.tipo==='Entrada'?'#16a34a':'#dc2626', background: m.tipo==='Entrada'?'#f0fdf4':'#fff5f5', padding:'3px 8px', borderRadius:6, textAlign:'center' }}>{m.tipo}</span>
            <span style={{ fontSize:13, color:'#374151', flex:1 }}>{m.item}</span>
            <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{m.qtd} un</span>
            <span style={{ fontSize:12, color:'#9ca3af' }}>{m.data}</span>
            <span style={{ fontSize:12, color:'#9ca3af' }}>{m.responsavel}</span>
          </div>
        ))}
      </div>

      {/* Modal movimentação */}
      {modalMov && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:16 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:440, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontSize:17, fontWeight:700, color:'#1f2937' }}>
              {modalMov === 'entrada' ? '📦 Entrada de material' : '📤 Saída de material'}
            </div>
            {[
              { key:'item', label:'Item', type:'select' },
              { key:'qtd',  label:'Quantidade', type:'number' },
              { key:'data', label:'Data', type:'date' },
              { key:'responsavel', label:'Responsável', type:'text' },
              ...(modalMov==='saida' ? [{ key:'motivo', label:'Motivo', type:'text' }] : []),
            ].map(({ key, label, type }) => (
              <div key={key}>
                <div style={{ fontSize:12, fontWeight:600, color:'#4b5563', marginBottom:5 }}>{label}</div>
                {type === 'select'
                  ? <select value={formMov[key]} onChange={e => setFormMov(p=>({...p,[key]:e.target.value}))}
                      style={{ width:'100%', padding:'10px 12px', borderRadius:8, fontSize:14, border:'1.5px solid #d1d5db', background:'#fff', outline:'none', cursor:'pointer' }}>
                      <option value="">Selecione...</option>
                      {estoque.map(e => <option key={e.id} value={e.item}>{e.item}</option>)}
                    </select>
                  : <input type={type} value={formMov[key]} onChange={e => setFormMov(p=>({...p,[key]:e.target.value}))}
                      style={{ width:'100%', padding:'10px 12px', borderRadius:8, fontSize:14, border:'1.5px solid #d1d5db', background:'#fff', outline:'none', boxSizing:'border-box' }}/>
                }
              </div>
            ))}
            <div style={{ display:'flex', gap:10, paddingTop:4 }}>
              <button onClick={() => setModalMov(null)} style={{ flex:1, padding:'12px 0', borderRadius:9, background:'#f3f4f6', border:'1px solid #e5e7eb', color:'#6b7280', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Cancelar
              </button>
              <button onClick={confirmarMov}
                style={{ flex:1, padding:'12px 0', borderRadius:9, background: modalMov==='entrada'?'#16a34a':'#dc2626', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Componente Apontamento + Histórico ────────────────────────────────────────
function ApontamentoView() {
  const [historico,  setHistorico]  = useState(HISTORICO_MOCK)
  const [aba,        setAba]        = useState('form') // 'form' | 'historico'
  const [filtro,     setFiltro]     = useState({ inicio:'', fim:'' })

  function onSalvo(dados) {
    setHistorico(p => [{ ...dados, data: new Date().toLocaleDateString('pt-BR') }, ...p])
    setAba('historico')
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'flex-start' }}>

      {/* Coluna principal */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* Abas form/histórico */}
        <div style={{ display:'flex', gap:0, background:'#f3f4f6', borderRadius:10, padding:4, width:'fit-content' }}>
          {[['form','Formulário'],['historico','Histórico']].map(([k, l]) => (
            <button key={k} onClick={() => setAba(k)}
              style={{ padding:'8px 20px', borderRadius:8, border:'none', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .15s',
                background: aba===k ? COR : 'transparent',
                color: aba===k ? '#fff' : '#6b7280' }}>
              {l}
            </button>
          ))}
        </div>

        {aba === 'form' && <ApontamentoSelecao onSalvo={onSalvo}/>}

        {aba === 'historico' && (
          <div style={{ background:'#fff', borderRadius:16, padding:22, display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <span style={{ fontSize:15, fontWeight:700, color:'#1f2937' }}>Histórico de apontamentos</span>
              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                <input type="date" value={filtro.inicio} onChange={e => setFiltro(p=>({...p,inicio:e.target.value}))}
                  style={{ padding:'7px 10px', borderRadius:7, border:'1.5px solid #d1d5db', fontSize:13, outline:'none' }}/>
                <span style={{ color:'#9ca3af', fontSize:13 }}>até</span>
                <input type="date" value={filtro.fim} onChange={e => setFiltro(p=>({...p,fim:e.target.value}))}
                  style={{ padding:'7px 10px', borderRadius:7, border:'1.5px solid #d1d5db', fontSize:13, outline:'none' }}/>
                <button onClick={() => exportarDual(historico, filtro.inicio, filtro.fim)}
                  style={{ padding:'7px 14px', borderRadius:7, background:COR, border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Download size={13}/> Exportar (2 planilhas)
                </button>
              </div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#f9fafb' }}>
                    {['Data','Tipo','Selecionadora','Linha','OP','Fardo','Boas','Perda','Total','Defeitos'].map(h => (
                      <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:0.4, whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historico.map((r, i) => (
                    <tr key={i} style={{ borderTop: i ? '1px solid #f3f4f6' : 'none' }}>
                      <td style={{ padding:'10px 12px', color:'#374151', whiteSpace:'nowrap' }}>{r.data}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ padding:'3px 8px', borderRadius:5, fontSize:11, fontWeight:600, background:'#fffbeb', color:'#92400e' }}>{r.tipo}</span>
                      </td>
                      <td style={{ padding:'10px 12px', color:'#374151' }}>{r.selecionadora}</td>
                      <td style={{ padding:'10px 12px', color:'#374151' }}>{r.maquina}</td>
                      <td style={{ padding:'10px 12px', color:'#6b7280', fontFamily:'monospace', fontSize:12 }}>{r.op}</td>
                      <td style={{ padding:'10px 12px', color:'#374151', textAlign:'center' }}>{r.fardo}</td>
                      <td style={{ padding:'10px 12px', color:'#16a34a', fontWeight:600 }}>{(r.folhasBoas||0).toLocaleString('pt-BR')}</td>
                      <td style={{ padding:'10px 12px', color:'#dc2626', fontWeight:600 }}>{(r.folhasPerda||0).toLocaleString('pt-BR')}</td>
                      <td style={{ padding:'10px 12px', color:'#1f2937', fontWeight:700 }}>{(r.total||0).toLocaleString('pt-BR')}</td>
                      <td style={{ padding:'10px 12px', color:'#6b7280', fontSize:12 }}>
                        {r.defeitos?.length ? `${r.defeitos.length} tipo(s)` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Painel lateral — últimos 5 */}
      {aba === 'form' && (
        <div style={{ background:'#fff', borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:10, position:'sticky', top:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:COR }}/>
            <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>Últimos 5 apontamentos</span>
          </div>
          {historico.slice(0, 5).map((r, i) => (
            <div key={i} style={{ padding:'11px 13px', borderRadius:10, background:'#f9fafb', border:'1px solid #f3f4f6', display:'flex', flexDirection:'column', gap:4 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'#6b7280' }}>{r.data}</span>
                <span style={{ fontSize:11, fontWeight:700, color:'#92400e', background:'#fffbeb', padding:'2px 7px', borderRadius:5 }}>{r.tipo}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:500, color:'#374151' }}>{r.selecionadora} · {r.maquina}</div>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ fontSize:11, color:'#16a34a', fontWeight:600 }}>✓ {(r.folhasBoas||0).toLocaleString('pt-BR')} boas</span>
                <span style={{ fontSize:11, color:'#dc2626', fontWeight:600 }}>✗ {(r.folhasPerda||0).toLocaleString('pt-BR')} perda</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Página principal Seleção ──────────────────────────────────────────────────
const COR_DK = '#92400e'
const COR_BG = '#fffbeb'

export default function Selecao() {
  const [vista, setVista] = useState(null) // null | 'apontamento' | 'estoque'

  const botoes = [
    { key:'apontamento', emoji:'🗂', titulo:'Apontamento', sub:'Registrar seleção de folhas', cor:'#f59e0b', corBg:'#fffbeb', corBorder:'#fde68a' },
    { key:'estoque',     emoji:'📦', titulo:'Estoque',      sub:'Materiais e movimentações',  cor:'#3b82f6', corBg:'#eff6ff', corBorder:'#bfdbfe' },
  ]

  return (
    <>
      <TopBar system="CQ" moduleName="Controle de Qualidade" user={{ name: "Igor Bittencourt", role: "Gestão da Qualidade", initials: "IB" }} />
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:"'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(245,158,11,0.4)' }}>
            <ClipboardList size={26} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:'#1f2937', lineHeight:1.2 }}>Seleção</div>
            <div style={{ fontSize:13, color:'#9ca3af', marginTop:2 }}>Apontamento · Estoque</div>
          </div>
        </div>
        <div style={{ padding:'6px 16px', borderRadius:20, background:COR_BG, border:'1.5px solid #fde68a', fontSize:12, fontWeight:700, color:COR_DK, letterSpacing:0.5 }}>
          CQ — Seleção
        </div>
      </div>

      {/* Botões grandes ou breadcrumb */}
      {!vista ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:600 }}>
          {botoes.map(b => (
            <button key={b.key} onClick={() => setVista(b.key)}
              style={{ padding:'36px 28px', borderRadius:20, border:`2px solid ${b.corBorder}`, background:b.corBg, cursor:'pointer', textAlign:'left', transition:'all .2s', display:'flex', flexDirection:'column', gap:16 }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${b.cor}25` }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ fontSize:48, lineHeight:1 }}>{b.emoji}</div>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:'#1f2937', marginBottom:4 }}>{b.titulo}</div>
                <div style={{ fontSize:13, color:'#6b7280' }}>{b.sub}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:b.cor, display:'flex', alignItems:'center', gap:6 }}>
                Abrir <span>→</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => setVista(null)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, background:'#fff', border:'1px solid #e5e7eb', color:'#374151', fontSize:13, fontWeight:500, cursor:'pointer' }}>
            <ArrowLeft size={14}/> Voltar
          </button>
          <span style={{ fontSize:14, color:'#9ca3af' }}>Seleção /</span>
          <span style={{ fontSize:14, fontWeight:600, color:'#374151' }}>
            {botoes.find(b => b.key === vista)?.titulo}
          </span>
        </div>
      )}

      {/* Conteúdo */}
      {vista === 'apontamento' && <ApontamentoView/>}
      {vista === 'estoque'     && <Estoque/>}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
    </>
  )
}
