import { useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import InspecaoLitografia    from './formularios/InspecaoLitografia'
import InspecaoEnvernizadeira from './formularios/InspecaoEnvernizadeira'
import LiberacaoCarga        from './formularios/LiberacaoCarga'
import FardoRetido           from './formularios/FardoRetido'
import { exportarParaCSV }   from '../../services/sharepointService'

// ── Dados mock ──────────────────────────────────────────────────────────────
const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '/').slice(0,8) + new Date().getFullYear().toString().slice(2)

const HISTORICOS = {
  litografia: [
    { data:'04/04/26', maquina:'Lito 2', op:'2026-0101', inspetor:'Igor Bittencourt', resultado:'Aprovado',           qtd:5000 },
    { data:'04/04/26', maquina:'Lito 4', op:'2026-0100', inspetor:'Maria Silva',      resultado:'Reprovado',          qtd:2000 },
    { data:'03/04/26', maquina:'Lito 5', op:'2026-0098', inspetor:'Carlos Mendes',    resultado:'Aprovado',           qtd:8000 },
    { data:'03/04/26', maquina:'Lito 6', op:'2026-0097', inspetor:'Ana Ferreira',     resultado:'Aprovado com ressalvas', qtd:3000 },
    { data:'02/04/26', maquina:'Lito 2', op:'2026-0090', inspetor:'Igor Bittencourt', resultado:'Aprovado',           qtd:6000 },
  ],
  envernizadeira: [
    { data:'04/04/26', maquina:'Env 1', op:'2026-0101', inspetor:'Maria Silva',      resultado:'Aprovado', viscosidade:22, temperatura:185 },
    { data:'04/04/26', maquina:'Env 3', op:'2026-0099', inspetor:'Carlos Mendes',    resultado:'Reprovado', viscosidade:28, temperatura:190 },
    { data:'03/04/26', maquina:'Env 5', op:'2026-0098', inspetor:'Igor Bittencourt', resultado:'Aprovado', viscosidade:21, temperatura:182 },
    { data:'03/04/26', maquina:'Env 6', op:'2026-0097', inspetor:'Ana Ferreira',     resultado:'Aprovado', viscosidade:23, temperatura:183 },
    { data:'02/04/26', maquina:'Env 1', op:'2026-0090', inspetor:'Paulo Oliveira',   resultado:'Aprovado', viscosidade:22, temperatura:185 },
  ],
  carga: [
    { data:'04/04/26', nf:'00011234', cliente:'Embalagens ABC', resultado:'Liberado',                inspetor:'Igor Bittencourt', volumes:12 },
    { data:'04/04/26', nf:'00011235', cliente:'Gráfica XYZ',    resultado:'Liberado com ressalvas',  inspetor:'Maria Silva',      volumes:8  },
    { data:'03/04/26', nf:'00011220', cliente:'Indústrias Beta',resultado:'Liberado',                inspetor:'Carlos Mendes',    volumes:20 },
    { data:'03/04/26', nf:'00011218', cliente:'Embalagens ABC', resultado:'Retido',                  inspetor:'Ana Ferreira',     volumes:4  },
    { data:'02/04/26', nf:'00011200', cliente:'Gráfica XYZ',    resultado:'Liberado',               inspetor:'Igor Bittencourt', volumes:16 },
  ],
  fardo: [
    { data:'04/04/26', maquina:'Lito 2', op:'2026-0101', fardo:3,  motivo:'Defeito visual',         destino:'Retrabalho', folhas:500 },
    { data:'04/04/26', maquina:'Env 3',  op:'2026-0099', fardo:7,  motivo:'Fora de especificação',  destino:'Descarte',   folhas:800 },
    { data:'03/04/26', maquina:'Lito 5', op:'2026-0098', fardo:2,  motivo:'Aguardando análise',     destino:'—',          folhas:300 },
    { data:'03/04/26', maquina:'Env 1',  op:'2026-0097', fardo:11, motivo:'Defeito visual',         destino:'Retrabalho', folhas:1200 },
    { data:'02/04/26', maquina:'Lito 4', op:'2026-0090', fardo:1,  motivo:'Outros',                 destino:'Aprovado após análise', folhas:200 },
  ],
}

// Contagem de registros hoje (mock)
const CONTAGEM_HOJE = { litografia: 2, envernizadeira: 2, carga: 2, fardo: 2 }

const BOTOES = [
  {
    key: 'litografia',
    emoji: '🔍',
    titulo: 'Inspeção Litografia',
    sub: 'Lito 2 / 4 / 5 / 6',
    cor: '#3b82f6', corBg: '#eff6ff', corBorder: '#bfdbfe',
    colunas: ['Data','Máquina','OP','Inspetor','Resultado','Qtd'],
    camposColunas: ['data','maquina','op','inspetor','resultado','qtd'],
  },
  {
    key: 'envernizadeira',
    emoji: '✨',
    titulo: 'Inspeção Envernizadeira',
    sub: 'Env 1 / 3 / 5 / 6',
    cor: '#10b981', corBg: '#f0fdf4', corBorder: '#a7f3d0',
    colunas: ['Data','Máquina','OP','Inspetor','Viscosidade','Resultado'],
    camposColunas: ['data','maquina','op','inspetor','viscosidade','resultado'],
  },
  {
    key: 'carga',
    emoji: '🚛',
    titulo: 'Liberação de Carga',
    sub: 'Conferência e liberação',
    cor: '#0ea5e9', corBg: '#f0f9ff', corBorder: '#bae6fd',
    colunas: ['Data','NF','Cliente','Volumes','Inspetor','Resultado'],
    camposColunas: ['data','nf','cliente','volumes','inspetor','resultado'],
  },
  {
    key: 'fardo',
    emoji: '📦',
    titulo: 'Fardo Retido pela Qualidade',
    sub: 'Registro de retenções',
    cor: '#ef4444', corBg: '#fef2f2', corBorder: '#fca5a5',
    colunas: ['Data','Máquina','OP','Fardo','Motivo','Destino'],
    camposColunas: ['data','maquina','op','fardo','motivo','destino'],
  },
]

const COR_RESULTADO = {
  'Aprovado':                { cor:'#16a34a', bg:'#f0fdf4' },
  'Reprovado':               { cor:'#dc2626', bg:'#fff5f5' },
  'Aprovado com ressalvas':  { cor:'#d97706', bg:'#fffbeb' },
  'Liberado':                { cor:'#16a34a', bg:'#f0fdf4' },
  'Liberado com ressalvas':  { cor:'#d97706', bg:'#fffbeb' },
  'Retido':                  { cor:'#dc2626', bg:'#fff5f5' },
}

export default function Inspecao() {
  const [ativo,         setAtivo]         = useState(null)  // null | 'litografia' | ...
  const [contagens,     setContagens]     = useState(CONTAGEM_HOJE)
  const [historicosLocal, setHistoricosLocal] = useState(HISTORICOS)
  const [filtroData,    setFiltroData]    = useState({ inicio:'', fim:'' })
  const [abaForm,       setAbaForm]       = useState('form') // 'form' | 'historico'

  const btnConf = ativo ? BOTOES.find(b => b.key === ativo) : null

  function onSalvoForm(dados) {
    if (!ativo) return
    setContagens(p => ({ ...p, [ativo]: (p[ativo] || 0) + 1 }))
    setHistoricosLocal(p => ({ ...p, [ativo]: [dados, ...p[ativo]] }))
    setAbaForm('historico')
  }

  function exportarHist() {
    const dados = historicosLocal[ativo] || []
    exportarParaCSV(dados, `inspecao_${ativo}`)
  }

  // ── Grade de botões ────────────────────────────────────────────────────
  if (!ativo) {
    return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {BOTOES.map(b => (
          <button key={b.key} onClick={() => { setAtivo(b.key); setAbaForm('form') }}
            style={{
              padding:'32px 24px', borderRadius:20, border:`2px solid ${b.corBorder}`,
              background: b.corBg, cursor:'pointer', textAlign:'left', transition:'all .2s',
              display:'flex', flexDirection:'column', gap:14,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${b.cor}25` }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div style={{ fontSize:44, lineHeight:1 }}>{b.emoji}</div>
              <div style={{ background: b.cor, color:'#fff', fontSize:12, fontWeight:700, borderRadius:20, padding:'4px 12px', lineHeight:1.5 }}>
                {contagens[b.key]} hoje
              </div>
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:700, color:'#1f2937', marginBottom:4 }}>{b.titulo}</div>
              <div style={{ fontSize:13, color:'#6b7280' }}>{b.sub}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color: b.cor }}>
              <span>Abrir formulário</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    )
  }

  // ── Formulário + histórico lateral ─────────────────────────────────────
  const hist = historicosLocal[ativo] || []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => setAtivo(null)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, background:'#fff', border:'1px solid #e5e7eb', color:'#374151', fontSize:13, fontWeight:500, cursor:'pointer' }}>
          <ArrowLeft size={14}/> Voltar
        </button>
        <span style={{ fontSize:14, color:'#9ca3af' }}>Inspeção /</span>
        <span style={{ fontSize:14, fontWeight:600, color:'#374151' }}>{btnConf?.titulo}</span>
      </div>

      {/* Abas form / histórico */}
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

        {/* Formulário */}
        <div>
          {abaForm === 'form' && (
            <>
              {ativo === 'litografia'    && <InspecaoLitografia    onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
              {ativo === 'envernizadeira'&& <InspecaoEnvernizadeira onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
              {ativo === 'carga'         && <LiberacaoCarga         onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
              {ativo === 'fardo'         && <FardoRetido            onSalvo={onSalvoForm} onCancelar={() => setAtivo(null)}/>}
            </>
          )}
          {abaForm === 'historico' && (
            <div style={{ background:'#fff', borderRadius:16, padding:22, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'#1f2937' }}>Histórico — {btnConf?.titulo}</div>
                <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                  <input type="date" value={filtroData.inicio} onChange={e=>setFiltroData(p=>({...p,inicio:e.target.value}))}
                    style={{ padding:'7px 10px', borderRadius:7, border:'1.5px solid #d1d5db', fontSize:13, outline:'none' }}/>
                  <span style={{ color:'#9ca3af', fontSize:13 }}>até</span>
                  <input type="date" value={filtroData.fim} onChange={e=>setFiltroData(p=>({...p,fim:e.target.value}))}
                    style={{ padding:'7px 10px', borderRadius:7, border:'1.5px solid #d1d5db', fontSize:13, outline:'none' }}/>
                  <button onClick={exportarHist}
                    style={{ padding:'7px 14px', borderRadius:7, background: btnConf?.cor, border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
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
                        {btnConf?.camposColunas.map(c => {
                          const val = r[c] ?? '—'
                          const isResultado = ['resultado'].includes(c)
                          const cfg = isResultado ? COR_RESULTADO[val] : null
                          return (
                            <td key={c} style={{ padding:'10px 13px', whiteSpace:'nowrap' }}>
                              {isResultado && cfg
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
          <div style={{ background:'#fff', borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:12, position:'sticky', top:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: btnConf?.cor }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>Últimos 5 registros</span>
            </div>
            {hist.slice(0, 5).map((r, i) => {
              const cfg = COR_RESULTADO[r.resultado]
              return (
                <div key={i} style={{ padding:'11px 13px', borderRadius:10, background:'#f9fafb', border:'1px solid #f3f4f6', display:'flex', flexDirection:'column', gap:5 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color:'#6b7280' }}>{r.data}</span>
                    {r.resultado && cfg && (
                      <span style={{ fontSize:11, fontWeight:700, color:cfg.cor, background:cfg.bg, padding:'2px 8px', borderRadius:5 }}>{r.resultado}</span>
                    )}
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#374151' }}>
                    {r.maquina || r.nf || '—'} · {r.op || r.cliente || '—'}
                  </div>
                  <div style={{ fontSize:11, color:'#9ca3af' }}>{r.inspetor || r.responsavel || '—'}</div>
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
