import { useState } from 'react'
import { ListChecks, ArrowLeft, Download } from 'lucide-react'
import InspecaoLitografia     from './controle/formularios/InspecaoLitografia'
import InspecaoEnvernizadeira from './controle/formularios/InspecaoEnvernizadeira'
import LiberacaoCarga         from './controle/formularios/LiberacaoCarga'
import FardoRetido            from './controle/formularios/FardoRetido'
import { exportarParaCSV }    from '../services/sharepointService'

// ── Dados mock ──────────────────────────────────────────────────────────────
const HISTORICOS_INICIAIS = {
  litografia: [
    { data:'04/04/26', maquina:'Lito 02', op:'2026-0101', inspetor:'Glauber',   expediente:'Sim',             resultado:'Aprovado' },
    { data:'04/04/26', maquina:'Lito 04', op:'2026-0100', inspetor:'Thais',     expediente:'Sim',             resultado:'Não conforme' },
    { data:'03/04/26', maquina:'Lito 05', op:'2026-0098', inspetor:'Roger',     expediente:'Máquina parada',  resultado:'—' },
    { data:'03/04/26', maquina:'Lito 06', op:'2026-0097', inspetor:'Raony',     expediente:'Sim',             resultado:'Aprovado com ressalva' },
    { data:'02/04/26', maquina:'Lito 02', op:'2026-0090', inspetor:'Glauber',   expediente:'Sim',             resultado:'Aprovado' },
  ],
  envernizadeira: [
    { data:'04/04/26', maquina:'Env 01', op:'2026-0101', inspetor:'Thais',      expediente:'Sim',              resultado:'Aprovado' },
    { data:'04/04/26', maquina:'Env 03', op:'2026-0099', inspetor:'Roger',      expediente:'Sim',              resultado:'Não conforme' },
    { data:'03/04/26', maquina:'Env 05', op:'2026-0098', inspetor:'Maycki',     expediente:'Máquina em manutenção', resultado:'—' },
    { data:'03/04/26', maquina:'Env 06', op:'2026-0097', inspetor:'Raony',      expediente:'Sim',              resultado:'Aprovado' },
    { data:'02/04/26', maquina:'Env 01', op:'2026-0090', inspetor:'Luiz Guilherme', expediente:'Sim',         resultado:'Aprovado' },
  ],
  carga: [
    { data:'04/04/26', turno:'07x15', inspetor:'GLAUBER',       supervisor:'ALEXANDRE', qtdEmbalado:120, qtdRetido:5 },
    { data:'04/04/26', turno:'15x23', inspetor:'THAIS',         supervisor:'DANIEL',    qtdEmbalado:98,  qtdRetido:2 },
    { data:'03/04/26', turno:'07x15', inspetor:'ROGER',         supervisor:'JHUAN',     qtdEmbalado:200, qtdRetido:0 },
    { data:'03/04/26', turno:'23x07', inspetor:'LUIZ GUILHERME',supervisor:'MAURO',     qtdEmbalado:87,  qtdRetido:13 },
    { data:'02/04/26', turno:'07x15', inspetor:'RAONY',         supervisor:'ROBSON',    qtdEmbalado:150, qtdRetido:3 },
  ],
  fardo: [
    { data:'04/04/26', maquina:'LITO 02', op:'2026-0101', fardo:'003', quantidade:500, sit:'L10',            inspetor:'GLAUBER' },
    { data:'04/04/26', maquina:'ENV 03',  op:'2026-0099', fardo:'007', quantidade:800, sit:'L99',            inspetor:'THAIS' },
    { data:'03/04/26', maquina:'LITO 05', op:'2026-0098', fardo:'002', quantidade:300, sit:'ANÁLISE',        inspetor:'ROGER' },
    { data:'03/04/26', maquina:'ENV 01',  op:'2026-0097', fardo:'011', quantidade:1200,sit:'MATERIAL VIRGEM',inspetor:'RAONY' },
    { data:'02/04/26', maquina:'LITO 04', op:'2026-0090', fardo:'001', quantidade:200, sit:'L10',            inspetor:'MAYCKI' },
  ],
}

const CONTAGEM_HOJE_INICIAL = { litografia:2, envernizadeira:2, carga:2, fardo:2 }

// ── Config dos botões ───────────────────────────────────────────────────────
const BOTOES = [
  {
    key:'litografia', emoji:'🔍', titulo:'Inspeção Litografia', sub:'Lito 02 / 04 / 05 / 06 / Digital',
    cor:'#3b82f6', corBg:'#eff6ff', corBorder:'#bfdbfe',
    colunas:    ['Data','Máquina','OP','Inspetor','Expediente','Resultado'],
    camposCols: ['data','maquina','op','inspetor','expediente','resultado'],
  },
  {
    key:'envernizadeira', emoji:'✨', titulo:'Inspeção Envernizadeira', sub:'Env 01 / 03 / 05 / 06',
    cor:'#10b981', corBg:'#f0fdf4', corBorder:'#a7f3d0',
    colunas:    ['Data','Máquina','OP','Inspetor','Expediente','Resultado'],
    camposCols: ['data','maquina','op','inspetor','expediente','resultado'],
  },
  {
    key:'carga', emoji:'🚛', titulo:'Liberação de Fardos', sub:'Bancas de embalagem',
    cor:'#0ea5e9', corBg:'#f0f9ff', corBorder:'#bae6fd',
    colunas:    ['Data','Turno','Inspetor','Supervisor','Embalados','Retidos'],
    camposCols: ['data','turno','inspetor','supervisor','qtdEmbalado','qtdRetido'],
  },
  {
    key:'fardo', emoji:'📦', titulo:'Fardo Retido pela Qualidade', sub:'Registro de retenções',
    cor:'#ef4444', corBg:'#fef2f2', corBorder:'#fca5a5',
    colunas:    ['Data','Máquina','OP','Nº Fardo','Qtd','SIT','Inspetor'],
    camposCols: ['data','maquina','op','fardo','quantidade','sit','inspetor'],
  },
]

const COR_RESULTADO = {
  'Aprovado':               { cor:'#16a34a', bg:'#f0fdf4' },
  'Não conforme':           { cor:'#dc2626', bg:'#fff5f5' },
  'Aprovado com ressalva':  { cor:'#d97706', bg:'#fffbeb' },
  'Liberado':               { cor:'#16a34a', bg:'#f0fdf4' },
  'Liberado com ressalvas': { cor:'#d97706', bg:'#fffbeb' },
  'Retido':                 { cor:'#dc2626', bg:'#fff5f5' },
}

// ── Página principal ────────────────────────────────────────────────────────
export default function Inspecao() {
  const [ativo,      setAtivo]      = useState(null)
  const [contagens,  setContagens]  = useState(CONTAGEM_HOJE_INICIAL)
  const [historicos, setHistoricos] = useState(HISTORICOS_INICIAIS)
  const [abaForm,    setAbaForm]    = useState('form') // 'form' | 'historico'
  const [filtro,     setFiltro]     = useState({ inicio:'', fim:'' })

  const btnConf = ativo ? BOTOES.find(b => b.key === ativo) : null
  const hist    = historicos[ativo] || []

  function onSalvoForm(dados) {
    if (!ativo) return
    setContagens(p => ({ ...p, [ativo]: (p[ativo] || 0) + 1 }))
    setHistoricos(p => ({ ...p, [ativo]: [dados, ...p[ativo]] }))
    setAbaForm('historico')
  }

  function exportarHist() {
    const dados = hist.filter(r => {
      if (filtro.inicio && r.data < filtro.inicio) return false
      if (filtro.fim    && r.data > filtro.fim)    return false
      return true
    })
    exportarParaCSV(dados, `inspecao_${ativo}`)
  }

  function abrirBotao(key) {
    setAtivo(key)
    setAbaForm('form')
    setFiltro({ inicio:'', fim:'' })
  }

  // ── Grade de botões ─────────────────────────────────────────────────────
  if (!ativo) {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:"'DM Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(59,130,246,0.4)' }}>
              <ListChecks size={26} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#1f2937', lineHeight:1.2 }}>Inspeção</div>
              <div style={{ fontSize:13, color:'#9ca3af', marginTop:2 }}>Litografia · Envernizadeira · Liberação · Fardo Retido</div>
            </div>
          </div>
          <div style={{ padding:'6px 16px', borderRadius:20, background:'#eff6ff', border:'1.5px solid #bfdbfe', fontSize:12, fontWeight:700, color:'#1d4ed8', letterSpacing:0.5 }}>
            CQ — Inspeção
          </div>
        </div>

        {/* Grade 2×2 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {BOTOES.map(b => (
            <button key={b.key} onClick={() => abrirBotao(b.key)}
              style={{ padding:'32px 24px', borderRadius:20, border:`2px solid ${b.corBorder}`, background:b.corBg, cursor:'pointer', textAlign:'left', transition:'all .2s', display:'flex', flexDirection:'column', gap:14 }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${b.cor}25` }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ fontSize:44, lineHeight:1 }}>{b.emoji}</div>
                <div style={{ background:b.cor, color:'#fff', fontSize:12, fontWeight:700, borderRadius:20, padding:'4px 12px', lineHeight:1.5 }}>
                  {contagens[b.key]} hoje
                </div>
              </div>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:'#1f2937', marginBottom:4 }}>{b.titulo}</div>
                <div style={{ fontSize:13, color:'#6b7280' }}>{b.sub}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:b.cor, display:'flex', alignItems:'center', gap:6 }}>
                Abrir formulário <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Formulário + painel lateral ─────────────────────────────────────────
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, fontFamily:"'DM Sans', sans-serif" }}>

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => setAtivo(null)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, background:'#fff', border:'1px solid #e5e7eb', color:'#374151', fontSize:13, fontWeight:500, cursor:'pointer' }}>
          <ArrowLeft size={14}/> Voltar
        </button>
        <span style={{ fontSize:14, color:'#9ca3af' }}>Inspeção /</span>
        <span style={{ fontSize:14, fontWeight:600, color:'#374151' }}>{btnConf?.titulo}</span>
      </div>

      {/* Abas form/histórico */}
      <div style={{ display:'flex', gap:0, background:'#f3f4f6', borderRadius:10, padding:4, width:'fit-content' }}>
        {[['form','Formulário'],['historico','Histórico']].map(([k, l]) => (
          <button key={k} onClick={() => setAbaForm(k)}
            style={{ padding:'8px 20px', borderRadius:8, border:'none', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .15s',
              background: abaForm===k ? btnConf?.cor : 'transparent',
              color: abaForm===k ? '#fff' : '#6b7280' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'flex-start' }}>

        {/* Coluna principal */}
        <div>
          {abaForm === 'form' && (
            <>
              {ativo === 'litografia'     && <InspecaoLitografia     onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
              {ativo === 'envernizadeira' && <InspecaoEnvernizadeira  onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
              {ativo === 'carga'          && <LiberacaoCarga          onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
              {ativo === 'fardo'          && <FardoRetido             onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
            </>
          )}

          {abaForm === 'historico' && (
            <div style={{ background:'#fff', borderRadius:16, padding:22, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                <span style={{ fontSize:15, fontWeight:700, color:'#1f2937' }}>Histórico — {btnConf?.titulo}</span>
                <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                  <input type="date" value={filtro.inicio} onChange={e => setFiltro(p=>({...p,inicio:e.target.value}))}
                    style={{ padding:'7px 10px', borderRadius:7, border:'1.5px solid #d1d5db', fontSize:13, outline:'none' }}/>
                  <span style={{ color:'#9ca3af', fontSize:13 }}>até</span>
                  <input type="date" value={filtro.fim} onChange={e => setFiltro(p=>({...p,fim:e.target.value}))}
                    style={{ padding:'7px 10px', borderRadius:7, border:'1.5px solid #d1d5db', fontSize:13, outline:'none' }}/>
                  <button onClick={exportarHist}
                    style={{ padding:'7px 14px', borderRadius:7, background:btnConf?.cor, border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                    <Download size={13}/> CSV
                  </button>
                </div>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ background:'#f9fafb' }}>
                      {btnConf?.colunas.map(c => (
                        <th key={c} style={{ padding:'9px 13px', textAlign:'left', fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:0.4, whiteSpace:'nowrap' }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hist.map((r, i) => (
                      <tr key={i} style={{ borderTop: i ? '1px solid #f3f4f6' : 'none' }}>
                        {btnConf?.camposCols.map(c => {
                          const val = r[c] ?? '—'
                          const isResult = c === 'resultado'
                          const cfg = isResult ? COR_RESULTADO[val] : null
                          return (
                            <td key={c} style={{ padding:'10px 13px', whiteSpace:'nowrap' }}>
                              {isResult && cfg
                                ? <span style={{ padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:700, color:cfg.cor, background:cfg.bg }}>{val}</span>
                                : <span style={{ color:'#374151' }}>{val}</span>
                              }
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    {hist.length === 0 && (
                      <tr><td colSpan={btnConf?.colunas.length} style={{ padding:'24px', textAlign:'center', color:'#9ca3af', fontSize:13 }}>Nenhum registro encontrado</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Painel lateral — últimos 5 registros */}
        {abaForm === 'form' && (
          <div style={{ background:'#fff', borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:10, position:'sticky', top:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:btnConf?.cor }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>Últimos 5 registros</span>
            </div>
            {hist.slice(0, 5).map((r, i) => {
              const cfg = COR_RESULTADO[r.resultado]
              return (
                <div key={i} style={{ padding:'11px 13px', borderRadius:10, background:'#f9fafb', border:'1px solid #f3f4f6', display:'flex', flexDirection:'column', gap:4 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color:'#6b7280' }}>{r.data}</span>
                    {r.resultado && cfg
                      ? <span style={{ fontSize:11, fontWeight:700, color:cfg.cor, background:cfg.bg, padding:'2px 7px', borderRadius:5 }}>{r.resultado}</span>
                      : r.sit
                        ? <span style={{ fontSize:11, fontWeight:700, color:'#6b7280', background:'#f3f4f6', padding:'2px 7px', borderRadius:5 }}>{r.sit}</span>
                        : null
                    }
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#374151' }}>
                    {r.maquina || r.inspetor || '—'}{r.op ? ` · OP: ${r.op}` : ''}
                  </div>
                  {r.inspetor && r.maquina && (
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{r.inspetor}</div>
                  )}
                </div>
              )
            })}
            {hist.length === 0 && (
              <div style={{ padding:'20px 0', textAlign:'center', fontSize:13, color:'#9ca3af' }}>Nenhum registro hoje</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
