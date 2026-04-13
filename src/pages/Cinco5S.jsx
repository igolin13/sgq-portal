import { useState } from 'react'
import TopBar from '../components/TopBar'
import { Plus, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const SENSOS = [
  { key:'seiri',    label:'Seiri',    desc:'Utilização'   },
  { key:'seiton',   label:'Seiton',   desc:'Organização'  },
  { key:'seiso',    label:'Seiso',    desc:'Limpeza'      },
  { key:'seiketsu', label:'Seiketsu', desc:'Padronização' },
  { key:'shitsuke', label:'Shitsuke', desc:'Disciplina'   },
]

const SETORES_SIMPLES = ['Litografia','Qualidade','Manutenção','Área']

const ESTRUTURA = [
  { setor:'Litografia', cor:'#185FA5', bg:'#E6F1FB', areas:['Env 1','Env 3','Env 5','Env 6','Lito 2','Lito 4','Lito 5','Lito 6'] },
  { setor:'Qualidade',  cor:'#0F6E56', bg:'#E1F5EE', areas:['Seleção Litografia'] },
  { setor:'Manutenção', cor:'#712B13', bg:'#FAECE7', areas:['Mecânica','Elétrica','Lubrificação'] },
  { setor:'Área',       cor:'#854F0B', bg:'#FAEEDA', areas:['G0','G1','G2','G3','G4','G5','G6','G7','G8'] },
]

const CORES_LINHA = ['#185FA5','#0F6E56','#712B13','#854F0B']

const historico = [
  { mes:'Out/25', Litografia:6.2, Qualidade:7.8, Manutenção:6.8, Área:5.9 },
  { mes:'Nov/25', Litografia:6.8, Qualidade:8.1, Manutenção:7.0, Área:6.4 },
  { mes:'Dez/25', Litografia:7.0, Qualidade:8.3, Manutenção:7.2, Área:6.8 },
  { mes:'Jan/26', Litografia:7.4, Qualidade:8.5, Manutenção:7.5, Área:7.1 },
  { mes:'Fev/26', Litografia:7.1, Qualidade:8.8, Manutenção:7.8, Área:7.3 },
  { mes:'Mar/26', Litografia:7.8, Qualidade:9.1, Manutenção:8.0, Área:7.6 },
]

const auditoriaAtual = {
  mes:'Mar/26', data:'15/03/2026', auditor:'Igor Bittencourt',
  resultados: {
    Litografia: { seiri:8, seiton:7, seiso:8, seiketsu:7, shitsuke:9 },
    Qualidade:  { seiri:9, seiton:9, seiso:9, seiketsu:9, shitsuke:10 },
    Manutenção: { seiri:8, seiton:8, seiso:8, seiketsu:8, shitsuke:8 },
    Área:       { seiri:7, seiton:8, seiso:7, seiketsu:8, shitsuke:8 },
  }
}

function gerarNotasArea(seed) {
  const base = [7,8,9,6,7,8,9,7,8,6]
  return {
    seiri:    base[(seed*3)%10],
    seiton:   base[(seed*7)%10],
    seiso:    base[(seed*2)%10],
    seiketsu: base[(seed*5)%10],
    shitsuke: base[(seed*4)%10],
  }
}

function gerarHistArea(seed) {
  return ['Dez/25','Jan/26','Fev/26','Mar/26'].map((mes,i) => ({
    mes, nota: parseFloat(Math.min(10,(5+(seed%4)+i*0.3+(seed%3)*0.2)).toFixed(1))
  }))
}

function montarDadosArea() {
  const d = {}; let s = 1
  ESTRUTURA.forEach(({setor,areas}) => {
    d[setor] = {}
    areas.forEach(area => { d[setor][area] = { notas:gerarNotasArea(s), historico:gerarHistArea(s) }; s++ })
  })
  return d
}

function media(notas) {
  const v = Object.values(notas||{}).filter(x => x !== '' && x !== undefined)
  if (!v.length) return null
  return (v.reduce((a,b)=>a+parseFloat(b),0)/v.length).toFixed(1)
}

function notaCor(n) {
  const v = parseFloat(n)
  if (isNaN(v)) return { bg:'bg-gray-100', text:'text-gray-400', bar:'#e5e7eb' }
  if (v >= 8) return { bg:'bg-green-50',  text:'text-green-700',  bar:'#639922' }
  if (v >= 6) return { bg:'bg-amber-50',  text:'text-amber-700',  bar:'#BA7517' }
  return           { bg:'bg-red-50',    text:'text-red-600',    bar:'#E24B4A' }
}

function tendencia(setor) {
  const len = historico.length
  const diff = (historico[len-1][setor] - historico[len-2][setor]).toFixed(1)
  if (diff > 0) return { color:'text-green-600', label:`+${diff}` }
  if (diff < 0) return { color:'text-red-500',   label:diff       }
  return              { color:'text-gray-400',  label:'0'        }
}

const radarData = SENSOS.map(s => ({
  senso: s.label,
  ...Object.fromEntries(SETORES_SIMPLES.map(st => [st, auditoriaAtual.resultados[st][s.key]]))
}))

const novoLancamento = () => Object.fromEntries(SENSOS.map(s => [s.key, '']))

export default function Cinco5S() {
  const [aba, setAba]               = useState('dashboard')
  const [setorDetalhe, setSetorDetalhe] = useState('Litografia')
  const [dadosArea, setDadosArea]   = useState(montarDadosArea())
  const [abertos, setAbertos]       = useState({ Litografia:true })
  const [areaAberta, setAreaAberta] = useState({})
  const [form, setForm]             = useState({ setor:ESTRUTURA[0].setor, area:ESTRUTURA[0].areas[0], mes:'', auditor:'', notas:novoLancamento() })
  const [salvo, setSalvo]           = useState(false)

  function toggleSetor(s)  { setAbertos(p => ({ ...p, [s]: !p[s] })) }
  function toggleArea(key) { setAreaAberta(p => ({ ...p, [key]: !p[key] })) }

  function setNota(key, val) {
    const n = Math.min(10, Math.max(0, Number(val)))
    setForm(f => ({ ...f, notas: { ...f.notas, [key]: isNaN(n) ? '' : n } }))
  }

  function salvar() {
    const { setor, area, notas } = form
    if (!setor || !area) return
    setDadosArea(prev => {
      const c = JSON.parse(JSON.stringify(prev))
      if (!c[setor]) c[setor] = {}
      if (!c[setor][area]) c[setor][area] = { notas:{}, historico:[] }
      c[setor][area].notas = { ...notas }
      c[setor][area].historico = [...(c[setor][area].historico||[]), { mes:form.mes||'Mar/26', nota:parseFloat(media(notas)||0) }].slice(-6)
      return c
    })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const mediaGeral = (SETORES_SIMPLES.reduce((a,s) => a + parseFloat(media(auditoriaAtual.resultados[s])||0), 0) / SETORES_SIMPLES.length).toFixed(1)
  const areasSelecionadas = ESTRUTURA.find(e => e.setor === form.setor)?.areas || []

  const ABAS = [
    { id:'dashboard', label:'Dashboard'        },
    { id:'por_setor', label:'Por setor'         },
    { id:'historico', label:'Histórico'         },
    { id:'lancar',    label:'Lançar auditoria'  },
  ]

  return (
    <>
      <TopBar system="SGQ" moduleName="Gestão 5S" user={{ name: "Igor Bittencourt", role: "Gestão da Qualidade", initials: "IB" }} />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1">
          {ABAS.map(t => (
            <button key={t.id} onClick={() => setAba(t.id)}
              className={`text-sm px-4 py-1.5 rounded-md transition-colors whitespace-nowrap ${aba===t.id?'bg-[#185FA5] text-white font-medium':'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-400">Última auditoria: {auditoriaAtual.data} · {auditoriaAtual.auditor}</div>
      </div>

      {/* ── DASHBOARD ── */}
      {aba === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SETORES_SIMPLES.map((s,i) => {
              const med  = media(auditoriaAtual.resultados[s])
              const cor  = notaCor(med)
              const tend = tendencia(s)
              const cfg  = ESTRUTURA.find(e=>e.setor===s)
              return (
                <button key={s} onClick={() => { setSetorDetalhe(s); setAba('por_setor') }}
                  className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{background:cfg.bg,color:cfg.cor}}>{s}</span>
                    <span className={`text-xs flex items-center gap-0.5 ${tend.color}`}>{tend.label}</span>
                  </div>
                  <div className={`text-3xl font-medium mb-1 ${cor.text}`}>{med}</div>
                  <div className="text-xs text-gray-400">média dos 5 sensos</div>
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${parseFloat(med)*10}%`,background:cor.bar}}/>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700">Radar 5S — {auditoriaAtual.mes}</h2>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${notaCor(mediaGeral).bg} ${notaCor(mediaGeral).text}`}>Geral: {mediaGeral}</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f0f0f0"/>
                  <PolarAngleAxis dataKey="senso" tick={{fontSize:11,fill:'#9ca3af'}}/>
                  {SETORES_SIMPLES.map((s,i) => (
                    <Radar key={s} name={s} dataKey={s} stroke={CORES_LINHA[i]} fill={CORES_LINHA[i]} fillOpacity={0.08} strokeWidth={2} dot={false}/>
                  ))}
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {SETORES_SIMPLES.map((s,i) => (
                  <span key={s} className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{background:CORES_LINHA[i]}}/>{s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Notas por senso — {auditoriaAtual.mes}</h2>
              <div className="space-y-3">
                {SENSOS.map(({key,label,desc}) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{label} <span className="text-gray-400">· {desc}</span></span>
                      <div className="flex gap-2">
                        {SETORES_SIMPLES.map((s,i) => (
                          <span key={s} className="text-xs font-medium" style={{color:CORES_LINHA[i]}}>
                            {auditoriaAtual.resultados[s][key]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {SETORES_SIMPLES.map((s,i) => (
                        <div key={s} className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${auditoriaAtual.resultados[s][key]*10}%`,background:CORES_LINHA[i]}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── POR SETOR — acordeão duplo ── */}
      {aba === 'por_setor' && (
        <div className="space-y-3">
          {ESTRUTURA.map(({setor, cor, bg, areas}) => {
            const isSetorOpen  = !!abertos[setor]
            const mediasSetor  = areas.map(a => parseFloat(media(dadosArea[setor]?.[a]?.notas||{})||0)).filter(v=>v>0)
            const mediaSetor   = mediasSetor.length ? (mediasSetor.reduce((a,b)=>a+b,0)/mediasSetor.length).toFixed(1) : media(auditoriaAtual.resultados[setor])
            const bom   = mediasSetor.filter(v=>v>=8).length
            const atenc = mediasSetor.filter(v=>v>=6&&v<8).length
            const ruim  = mediasSetor.filter(v=>v<6).length

            return (
              <div key={setor} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Header do setor */}
                <button onClick={() => toggleSetor(setor)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{background:bg,color:cor}}>
                    {setor.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[14px] font-medium text-gray-800">{setor}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{areas.length} área{areas.length>1?'s':''}</span>
                      {mediaSetor && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${notaCor(mediaSetor).bg} ${notaCor(mediaSetor).text}`}>
                          Média: {mediaSetor}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {bom>0   && <span className="text-[11px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>{bom} boa{bom>1?'s':''}</span>}
                      {atenc>0 && <span className="text-[11px] text-amber-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"/>{atenc} atenção</span>}
                      {ruim>0  && <span className="text-[11px] text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"/>{ruim} crítica{ruim>1?'s':''}</span>}
                    </div>
                  </div>
                  <div style={{color:cor}}>{isSetorOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</div>
                </button>

                {/* Áreas do setor */}
                {isSetorOpen && (
                  <div className="border-t border-gray-100">
                    {areas.map((area, idx) => {
                      const areaKey    = `${setor}__${area}`
                      const isAreaOpen = !!areaAberta[areaKey]
                      const notasArea  = dadosArea[setor]?.[area]?.notas || {}
                      const histArea   = dadosArea[setor]?.[area]?.historico || []
                      const medArea    = media(notasArea)
                      const nc         = medArea ? notaCor(medArea) : null

                      return (
                        <div key={area} className={idx>0?'border-t border-gray-50':''}>
                          <button onClick={() => toggleArea(areaKey)}
                            className="w-full flex items-center gap-3 py-3 hover:bg-gray-50/30 transition-colors text-left"
                            style={{paddingLeft:56,paddingRight:20}}>
                            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                              style={{background:bg,color:cor}}>
                              {area.substring(0,2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-medium text-gray-700">{area}</span>
                                {medArea && <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${nc.bg} ${nc.text}`}>{medArea}</span>}
                              </div>
                              {!isAreaOpen && medArea && (
                                <div className="flex gap-3 mt-0.5">
                                  {SENSOS.map(s => (
                                    <span key={s.key} className="text-[10px] text-gray-400">
                                      {s.label}: <span className={`font-medium ${notaCor(notasArea[s.key]).text}`}>{notasArea[s.key]}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{color:cor,opacity:.7}}>{isAreaOpen?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</div>
                          </button>

                          {isAreaOpen && (
                            <div className="pb-5 space-y-4" style={{paddingLeft:72,paddingRight:20}}>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Notas — Mar/26</p>
                                  <div className="space-y-3">
                                    {SENSOS.map(({key,label,desc}) => {
                                      const nota = notasArea[key]
                                      const nc2  = nota!==undefined ? notaCor(nota) : {bar:'#e5e7eb',bg:'',text:'text-gray-400'}
                                      return (
                                        <div key={key}>
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600">{label} <span className="text-gray-400">· {desc}</span></span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${nc2.bg} ${nc2.text}`}>{nota??'—'}</span>
                                          </div>
                                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{width:`${(nota||0)*10}%`,background:cor}}/>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  {medArea && (
                                    <div className={`mt-3 flex items-center justify-between px-3 py-2 rounded-lg ${nc.bg}`}>
                                      <span className={`text-xs font-medium ${nc.text}`}>Média geral da área</span>
                                      <span className={`text-lg font-medium ${nc.text}`}>{medArea}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Evolução histórica</p>
                                  {histArea.length>0 ? (
                                    <ResponsiveContainer width="100%" height={150}>
                                      <LineChart data={histArea}>
                                        <XAxis dataKey="mes" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                                        <YAxis domain={[0,10]} tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false} width={20}/>
                                        <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'0.5px solid #e5e7eb'}} formatter={v=>[v.toFixed(1),'Nota']}/>
                                        <Line type="monotone" dataKey="nota" stroke={cor} strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  ) : (
                                    <div className="text-xs text-gray-400 text-center py-8">Sem histórico disponível</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── HISTÓRICO ── */}
      {aba === 'historico' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Evolução das notas médias</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={historico}>
                <XAxis dataKey="mes" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,10]} tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} width={24}/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'0.5px solid #e5e7eb'}} formatter={(v,n)=>[v.toFixed(1),n]}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12,paddingTop:12}}/>
                {SETORES_SIMPLES.map((s,i) => (
                  <Line key={s} type="monotone" dataKey={s} stroke={CORES_LINHA[i]} strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Mês</th>
                  {SETORES_SIMPLES.map(s => <th key={s} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{s}</th>)}
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Geral</th>
                </tr>
              </thead>
              <tbody>
                {[...historico].reverse().map((row,i) => {
                  const geral = (SETORES_SIMPLES.reduce((a,s)=>a+row[s],0)/SETORES_SIMPLES.length).toFixed(1)
                  const isLast = i===0
                  return (
                    <tr key={row.mes} className={`border-b border-gray-50 last:border-0 ${isLast?'bg-blue-50/30':'hover:bg-gray-50/40'}`}>
                      <td className="px-5 py-3 text-xs font-medium text-gray-600">
                        {row.mes}{isLast && <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">atual</span>}
                      </td>
                      {SETORES_SIMPLES.map(s => {
                        const nc = notaCor(row[s])
                        return (
                          <td key={s} className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${nc.bg} ${nc.text}`}>{row[s].toFixed(1)}</span>
                          </td>
                        )
                      })}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${notaCor(geral).bg} ${notaCor(geral).text}`}>{geral}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── LANÇAR AUDITORIA ── */}
      {aba === 'lancar' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardList size={18} className="text-blue-600"/>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-800">Lançar nova auditoria 5S</h2>
              <p className="text-xs text-gray-400">Preencha as notas de 0 a 10 para cada senso</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Setor</label>
              <select value={form.setor}
                onChange={e => {
                  const novo = e.target.value
                  const primeiraArea = ESTRUTURA.find(s=>s.setor===novo)?.areas[0]||''
                  setForm(f=>({...f,setor:novo,area:primeiraArea}))
                }}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {ESTRUTURA.map(e=><option key={e.setor}>{e.setor}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Área</label>
              <select value={form.area} onChange={e=>setForm(f=>({...f,area:e.target.value}))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {areasSelecionadas.map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mês de referência</label>
              <input type="month" value={form.mes} onChange={e=>setForm(f=>({...f,mes:e.target.value}))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Auditor responsável</label>
              <input type="text" value={form.auditor} onChange={e=>setForm(f=>({...f,auditor:e.target.value}))}
                placeholder="Nome do auditor"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"/>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notas por senso</p>
            {SENSOS.map(({key,label,desc}) => {
              const nota = form.notas[key]
              const nc   = nota!=='' ? notaCor(nota) : null
              return (
                <div key={key} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-gray-400 ml-2">{desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {nota!=='' && nc && (
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{width:`${nota*10}%`,background:nc.bar}}/>
                      </div>
                    )}
                    <input type="number" min="0" max="10" step="0.1"
                      value={nota} onChange={e=>setNota(key,e.target.value)}
                      placeholder="0–10"
                      className={`w-20 text-center text-sm border rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 font-medium transition-colors ${nc?`${nc.bg} ${nc.text} border-transparent`:'border-gray-200'}`}/>
                  </div>
                </div>
              )
            })}
          </div>

          {Object.values(form.notas).some(v=>v!=='') && (
            <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700">Média calculada — {form.setor} · {form.area}:</span>
              <span className={`text-xl font-medium ${notaCor(media(form.notas)).text}`}>{media(form.notas)??'—'}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={salvar}
              className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#0c447c] transition-colors">
              <Plus size={15}/>Salvar auditoria
            </button>
            {salvo && (
              <span className="text-sm text-green-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>
                Auditoria salva com sucesso!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  )
}