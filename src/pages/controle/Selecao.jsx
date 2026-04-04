import { useState } from 'react'
import { Plus, Minus, Download, ClipboardList, Package, Clock } from 'lucide-react'
import ApontamentoSelecao from './formularios/ApontamentoSelecao'
import { exportarParaCSV } from '../../services/sharepointService'

// ── Dados mock ──────────────────────────────────────────────────────────────
const ESTOQUE_INICIAL = [
  { id:1, item:'Fita adesiva transparente', qtd:48,  unidade:'rolos', minimo:10, },
  { id:2, item:'Caixa de papelão 40x30x20', qtd:120, unidade:'un',   minimo:50, },
  { id:3, item:'Luvas de borracha M',        qtd:6,   unidade:'pares', minimo:20, },
  { id:4, item:'Etiqueta adesiva branca',    qtd:500, unidade:'un',   minimo:100, },
  { id:5, item:'Caneta marcadora preta',     qtd:8,   unidade:'un',   minimo:5, },
]

const HISTORICO_MOCK = [
  { id:'AP-001', data:'04/04/26', tipo:'Seleção Normal',   selecionadora:'Ana Souza',      maquina:'Lito 2', op:'2026-0101', fardo:12, folhasBoas:4820, folhasPerda:180, total:5000, turno:'Manhã' },
  { id:'AP-002', data:'04/04/26', tipo:'Retrabalho',        selecionadora:'Beatriz Lima',   maquina:'Env 3',  op:'2026-0099', fardo:7,  folhasBoas:2100, folhasPerda:400, total:2500, turno:'Tarde' },
  { id:'AP-003', data:'03/04/26', tipo:'Seleção Especial',  selecionadora:'Carla Mendes',   maquina:'Lito 5', op:'2026-0098', fardo:3,  folhasBoas:990,  folhasPerda:10,  total:1000, turno:'Manhã' },
  { id:'AP-004', data:'03/04/26', tipo:'Seleção Normal',   selecionadora:'Daniela Costa',  maquina:'Env 1',  op:'2026-0097', fardo:21, folhasBoas:8700, folhasPerda:300, total:9000, turno:'Noite' },
  { id:'AP-005', data:'02/04/26', tipo:'Seleção Normal',   selecionadora:'Ana Souza',      maquina:'Lito 4', op:'2026-0090', fardo:5,  folhasBoas:3200, folhasPerda:300, total:3500, turno:'Tarde' },
]

const MOV_MOCK = [
  { id:1, data:'03/04/26', tipo:'Entrada', item:'Fita adesiva transparente', qtd:20, responsavel:'Igor Bittencourt', motivo: '' },
  { id:2, data:'02/04/26', tipo:'Saída',   item:'Luvas de borracha M',        qtd:10, responsavel:'Ana Souza',       motivo: 'Uso na linha 2' },
  { id:3, data:'01/04/26', tipo:'Entrada', item:'Caixa de papelão 40x30x20', qtd:100, responsavel:'Carlos Mendes',  motivo: '' },
]

function statusEstoque(qtd, minimo) {
  if (qtd === 0)          return { label:'Crítico', cor:'#dc2626', bg:'#fff5f5', border:'#fca5a5' }
  if (qtd <= minimo)      return { label:'Baixo',   cor:'#d97706', bg:'#fffbeb', border:'#fde68a' }
  return                         { label:'OK',      cor:'#16a34a', bg:'#f0fdf4', border:'#86efac' }
}

const COR = '#f59e0b'
const COR_DK = '#92400e'
const COR_BG = '#fffbeb'

export default function Selecao() {
  const [secao,      setSecao]      = useState('apontamento')
  const [estoque,    setEstoque]    = useState(ESTOQUE_INICIAL)
  const [movs,       setMovs]       = useState(MOV_MOCK)
  const [historico]                 = useState(HISTORICO_MOCK)
  const [modalMov,   setModalMov]   = useState(null)  // null | 'entrada' | 'saida'
  const [formMov,    setFormMov]    = useState({ item:'', qtd:'', responsavel:'', motivo:'', data: new Date().toISOString().slice(0,10) })
  const [filtroData, setFiltroData] = useState({ inicio:'', fim:'' })

  function confirmarMovimento() {
    if (!formMov.item || !formMov.qtd || !formMov.responsavel) return
    const novasMov = [{ id: Date.now(), data: formMov.data, tipo: modalMov === 'entrada' ? 'Entrada' : 'Saída', ...formMov }, ...movs]
    setMovs(novasMov)
    setEstoque(prev => prev.map(e => {
      if (e.item !== formMov.item) return e
      const delta = parseInt(formMov.qtd) || 0
      return { ...e, qtd: modalMov === 'entrada' ? e.qtd + delta : Math.max(0, e.qtd - delta) }
    }))
    setModalMov(null)
    setFormMov({ item:'', qtd:'', responsavel:'', motivo:'', data: new Date().toISOString().slice(0,10) })
  }

  function exportarHistorico() {
    let dados = historico
    if (filtroData.inicio) dados = dados.filter(r => r.data >= filtroData.inicio)
    if (filtroData.fim)    dados = dados.filter(r => r.data <= filtroData.fim)
    exportarParaCSV(dados, 'historico_selecao')
  }

  const secaoBtnSt = (id) => ({
    flex: 1, padding: '14px 10px', borderRadius: 12, cursor: 'pointer', border: 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    background: secao === id ? COR : '#fff',
    color: secao === id ? '#fff' : '#6b7280',
    fontWeight: 600, fontSize: 14, transition: 'all .2s',
    boxShadow: secao === id ? `0 4px 12px ${COR}40` : '0 1px 3px rgba(0,0,0,0.08)',
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Botões de sub-seção */}
      <div style={{ display:'flex', gap:12 }}>
        <button style={secaoBtnSt('apontamento')} onClick={() => setSecao('apontamento')}>
          <ClipboardList size={22}/>
          <span>Novo Apontamento</span>
        </button>
        <button style={secaoBtnSt('estoque')} onClick={() => setSecao('estoque')}>
          <Package size={22}/>
          <span>Estoque</span>
        </button>
        <button style={secaoBtnSt('historico')} onClick={() => setSecao('historico')}>
          <Clock size={22}/>
          <span>Histórico</span>
        </button>
      </div>

      {/* ── Apontamento ── */}
      {secao === 'apontamento' && (
        <ApontamentoSelecao onSalvo={() => setSecao('historico')}/>
      )}

      {/* ── Estoque ── */}
      {secao === 'estoque' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Ações */}
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

          {/* Tabela de estoque */}
          <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:10 }}>
              <Package size={16} color={COR}/>
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

          {/* Histórico de movimentações */}
          <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6' }}>
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
        </div>
      )}

      {/* ── Histórico ── */}
      {secao === 'historico' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Filtros e export */}
          <div style={{ background:'#fff', borderRadius:14, padding:18, display:'flex', gap:12, alignItems:'flex-end', flexWrap:'wrap', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:5 }}>Data início</div>
              <input type="date" value={filtroData.inicio} onChange={e => setFiltroData(p=>({...p,inicio:e.target.value}))}
                style={{ padding:'9px 12px', borderRadius:8, border:'1.5px solid #d1d5db', fontSize:14, outline:'none' }}/>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:5 }}>Data fim</div>
              <input type="date" value={filtroData.fim} onChange={e => setFiltroData(p=>({...p,fim:e.target.value}))}
                style={{ padding:'9px 12px', borderRadius:8, border:'1.5px solid #d1d5db', fontSize:14, outline:'none' }}/>
            </div>
            <button onClick={exportarHistorico}
              style={{ padding:'9px 18px', borderRadius:8, background:COR, border:'none', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
              <Download size={15}/> Exportar CSV
            </button>
          </div>

          {/* Tabela de histórico */}
          <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#1f2937' }}>Apontamentos de seleção</span>
              <span style={{ fontSize:13, color:'#9ca3af' }}>{historico.length} registros</span>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#f9fafb' }}>
                  {['ID','Data','Tipo','Selecionadora','Máquina','OP','Fardo','Boas','Perda','Total'].map(h=>(
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:0.4, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historico.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: i ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding:'11px 14px', color:'#6b7280', fontFamily:'monospace', fontSize:12 }}>{r.id}</td>
                    <td style={{ padding:'11px 14px', color:'#374151', whiteSpace:'nowrap' }}>{r.data}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:600, background:COR_BG, color:COR_DK }}>{r.tipo}</span>
                    </td>
                    <td style={{ padding:'11px 14px', color:'#374151' }}>{r.selecionadora}</td>
                    <td style={{ padding:'11px 14px', color:'#374151' }}>{r.maquina}</td>
                    <td style={{ padding:'11px 14px', color:'#374151', fontFamily:'monospace', fontSize:12 }}>{r.op}</td>
                    <td style={{ padding:'11px 14px', color:'#374151', textAlign:'center' }}>{r.fardo}</td>
                    <td style={{ padding:'11px 14px', color:'#16a34a', fontWeight:600 }}>{r.folhasBoas.toLocaleString('pt-BR')}</td>
                    <td style={{ padding:'11px 14px', color:'#dc2626', fontWeight:600 }}>{r.folhasPerda.toLocaleString('pt-BR')}</td>
                    <td style={{ padding:'11px 14px', color:'#1f2937', fontWeight:700 }}>{r.total.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal movimentação de estoque ── */}
      {modalMov && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:16 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:440, display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ fontSize:17, fontWeight:700, color:'#1f2937' }}>
              {modalMov === 'entrada' ? '📦 Entrada de material' : '📤 Saída de material'}
            </div>
            {[
              { key:'item', label:'Item', type:'select' },
              { key:'qtd',  label:'Quantidade', type:'number' },
              { key:'data', label:'Data', type:'date' },
              { key:'responsavel', label:'Responsável', type:'text' },
              ...(modalMov==='saida' ? [{ key:'motivo', label:'Motivo', type:'text' }] : []),
            ].map(({ key, label: lbl, type }) => (
              <div key={key}>
                <div style={{ fontSize:12, fontWeight:600, color:'#4b5563', marginBottom:5 }}>{lbl}</div>
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
              <button onClick={confirmarMovimento}
                style={{ flex:1, padding:'12px 0', borderRadius:9, background: modalMov==='entrada' ? '#16a34a' : '#dc2626', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
