import { useState } from 'react'
import { Plus, ChevronDown, TrendingUp, TrendingDown, Minus, ClipboardList } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const SETORES = ['Produção', 'Qualidade', 'Logística', 'Manutenção']
const SENSOS = [
  { key: 'seiri',    label: 'Seiri',    desc: 'Utilização' },
  { key: 'seiton',  label: 'Seiton',   desc: 'Organização' },
  { key: 'seiso',   label: 'Seiso',    desc: 'Limpeza' },
  { key: 'seiketsu',label: 'Seiketsu', desc: 'Padronização' },
  { key: 'shitsuke',label: 'Shitsuke', desc: 'Disciplina' },
]

const COR_SETOR = {
  'Produção':   { bg: '#E6F1FB', text: '#0C447C', dot: '#185FA5' },
  'Qualidade':  { bg: '#EAF3DE', text: '#27500A', dot: '#639922' },
  'Logística':  { bg: '#FAEEDA', text: '#633806', dot: '#BA7517' },
  'Manutenção': { bg: '#FAECE7', text: '#712B13', dot: '#D85A30' },
}

const historico = [
  { mes: 'Out/25', Produção: 6.2, Qualidade: 7.8, Logística: 5.9, Manutenção: 6.8 },
  { mes: 'Nov/25', Produção: 6.8, Qualidade: 8.1, Logística: 6.4, Manutenção: 7.0 },
  { mes: 'Dez/25', Produção: 7.0, Qualidade: 8.3, Logística: 6.8, Manutenção: 7.2 },
  { mes: 'Jan/26', Produção: 7.4, Qualidade: 8.5, Logística: 7.1, Manutenção: 7.5 },
  { mes: 'Fev/26', Produção: 7.1, Qualidade: 8.8, Logística: 7.3, Manutenção: 7.8 },
  { mes: 'Mar/26', Produção: 7.8, Qualidade: 9.1, Logística: 7.6, Manutenção: 8.0 },
]

const auditoriaAtual = {
  mes: 'Mar/26',
  data: '15/03/2026',
  auditor: 'Igor Bittencourt',
  resultados: {
    Produção:   { seiri: 8, seiton: 7, seiso: 8, seiketsu: 7, shitsuke: 9 },
    Qualidade:  { seiri: 9, seiton: 9, seiso: 9, seiketsu: 9, shitsuke: 10 },
    Logística:  { seiri: 7, seiton: 8, seiso: 7, seiketsu: 8, shitsuke: 8 },
    Manutenção: { seiri: 8, seiton: 8, seiso: 8, seiketsu: 8, shitsuke: 8 },
  }
}

function media(notas) {
  const vals = Object.values(notas)
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
}

function notaCor(n) {
  const v = parseFloat(n)
  if (v >= 8) return { bg: 'bg-green-50', text: 'text-green-700', bar: '#639922' }
  if (v >= 6) return { bg: 'bg-amber-50', text: 'text-amber-700', bar: '#BA7517' }
  return { bg: 'bg-red-50', text: 'text-red-600', bar: '#E24B4A' }
}

function tendencia(setor) {
  const len = historico.length
  const atual = historico[len - 1][setor]
  const ant   = historico[len - 2][setor]
  const diff  = (atual - ant).toFixed(1)
  if (diff > 0) return { icon: <TrendingUp size={13} />, color: 'text-green-600', label: `+${diff}` }
  if (diff < 0) return { icon: <TrendingDown size={13} />, color: 'text-red-500', label: diff }
  return { icon: <Minus size={13} />, color: 'text-gray-400', label: '0' }
}

const radarData = SENSOS.map(s => ({
  senso: s.label,
  Produção:   auditoriaAtual.resultados['Produção'][s.key],
  Qualidade:  auditoriaAtual.resultados['Qualidade'][s.key],
  Logística:  auditoriaAtual.resultados['Logística'][s.key],
  Manutenção: auditoriaAtual.resultados['Manutenção'][s.key],
}))

const CORES_LINHA = ['#185FA5', '#639922', '#BA7517', '#D85A30']

const novoAuditoria = () => Object.fromEntries(
  SENSOS.map(s => [s.key, ''])
)

export default function Cinco5S() {
  const [aba, setAba] = useState('dashboard')
  const [setorDetalhe, setSetorDetalhe] = useState(null)
  const [form, setForm] = useState({
    setor: SETORES[0],
    mes: '',
    auditor: '',
    notas: novoAuditoria(),
  })
  const [salvo, setSalvo] = useState(false)

  function setNota(key, val) {
    const n = Math.min(10, Math.max(0, Number(val)))
    setForm(f => ({ ...f, notas: { ...f.notas, [key]: isNaN(n) ? '' : n } }))
  }

  function salvar() {
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const mediaGeral = (
    SETORES.reduce((acc, s) => acc + parseFloat(media(auditoriaAtual.resultados[s])), 0) / SETORES.length
  ).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'detalhe',   label: 'Por setor' },
            { id: 'historico', label: 'Histórico' },
            { id: 'lancar',    label: 'Lançar auditoria' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setAba(t.id)}
              className={`text-sm px-4 py-1.5 rounded-md transition-colors ${
                aba === t.id
                  ? 'bg-[#185FA5] text-white font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-400">Última auditoria: {auditoriaAtual.data} · {auditoriaAtual.auditor}</div>
      </div>

      {aba === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SETORES.map(s => {
              const med = media(auditoriaAtual.resultados[s])
              const cor = notaCor(med)
              const tend = tendencia(s)
              const c = COR_SETOR[s]
              return (
                <button
                  key={s}
                  onClick={() => { setSetorDetalhe(s); setAba('detalhe') }}
                  className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>{s}</span>
                    <span className={`text-xs flex items-center gap-0.5 ${tend.color}`}>{tend.icon}{tend.label}</span>
                  </div>
                  <div className={`text-3xl font-medium mb-1 ${cor.text}`}>{med}</div>
                  <div className="text-xs text-gray-400">média dos 5 sensos</div>
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${parseFloat(med) * 10}%`, background: cor.bar }} />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700">Radar 5S — {auditoriaAtual.mes}</h2>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${notaCor(mediaGeral).bg} ${notaCor(mediaGeral).text}`}>
                  Geral: {mediaGeral}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis dataKey="senso" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  {SETORES.map((s, i) => (
                    <Radar key={s} name={s} dataKey={s} stroke={CORES_LINHA[i]} fill={CORES_LINHA[i]} fillOpacity={0.08} strokeWidth={2} dot={false} />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {SETORES.map((s, i) => (
                  <span key={s} className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: CORES_LINHA[i] }} />{s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Notas por senso — {auditoriaAtual.mes}</h2>
              <div className="space-y-3">
                {SENSOS.map(({ key, label, desc }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{label} <span className="text-gray-400">· {desc}</span></span>
                      <div className="flex gap-2">
                        {SETORES.map((s, i) => (
                          <span key={s} className="text-xs font-medium" style={{ color: CORES_LINHA[i] }}>
                            {auditoriaAtual.resultados[s][key]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {SETORES.map((s, i) => (
                        <div key={s} className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${auditoriaAtual.resultados[s][key] * 10}%`,
                            background: CORES_LINHA[i]
                          }} />
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

      {aba === 'detalhe' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {SETORES.map((s, i) => (
              <button
                key={s}
                onClick={() => setSetorDetalhe(s)}
                className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                  setorDetalhe === s
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
                style={setorDetalhe === s ? { background: CORES_LINHA[i] } : {}}
              >
                {s}
              </button>
            ))}
          </div>

          {setorDetalhe && (() => {
            const notas = auditoriaAtual.resultados[setorDetalhe]
            const med = media(notas)
            const cor = notaCor(med)
            const idx = SETORES.indexOf(setorDetalhe)
            const c = COR_SETOR[setorDetalhe]
            return (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-medium text-gray-800">{setorDetalhe}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Auditoria {auditoriaAtual.mes} · {auditoriaAtual.data}</p>
                  </div>
                  <div className={`text-3xl font-medium ${cor.text}`}>{med} <span className="text-sm font-normal text-gray-400">/ 10</span></div>
                </div>
                <div className="space-y-4">
                  {SENSOS.map(({ key, label, desc }) => {
                    const nota = notas[key]
                    const nc = notaCor(nota)
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <span className="text-xs text-gray-400 ml-2">{desc}</span>
                          </div>
                          <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${nc.bg} ${nc.text}`}>{nota}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${nota * 10}%`, background: CORES_LINHA[idx] }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {aba === 'historico' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Evolução das notas médias</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={historico}>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e5e7eb' }}
                  formatter={(v, n) => [v.toFixed(1), n]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                {SETORES.map((s, i) => (
                  <Line key={s} type="monotone" dataKey={s} stroke={CORES_LINHA[i]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Mês</th>
                  {SETORES.map(s => (
                    <th key={s} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{s}</th>
                  ))}
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Geral</th>
                </tr>
              </thead>
              <tbody>
                {[...historico].reverse().map((row, i) => {
                  const geral = (SETORES.reduce((a, s) => a + row[s], 0) / SETORES.length).toFixed(1)
                  const isLast = i === 0
                  return (
                    <tr key={row.mes} className={`border-b border-gray-50 last:border-0 ${isLast ? 'bg-blue-50/30' : 'hover:bg-gray-50/40'}`}>
                      <td className="px-5 py-3 text-xs font-medium text-gray-600">
                        {row.mes} {isLast && <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">atual</span>}
                      </td>
                      {SETORES.map((s, j) => {
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

      {aba === 'lancar' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardList size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-800">Lançar nova auditoria 5S</h2>
              <p className="text-xs text-gray-400">Preencha as notas de 0 a 10 para cada senso</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Setor</label>
              <select
                value={form.setor}
                onChange={e => setForm(f => ({ ...f, setor: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
              >
                {SETORES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mês de referência</label>
              <input
                type="month"
                value={form.mes}
                onChange={e => setForm(f => ({ ...f, mes: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Auditor responsável</label>
              <input
                type="text"
                value={form.auditor}
                onChange={e => setForm(f => ({ ...f, auditor: e.target.value }))}
                placeholder="Nome do auditor"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notas por senso</p>
            {SENSOS.map(({ key, label, desc }) => {
              const nota = form.notas[key]
              const nc = nota !== '' ? notaCor(nota) : null
              return (
                <div key={key} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-gray-400 ml-2">{desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {nota !== '' && (
                      <div className="flex-1 w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${nota * 10}%`, background: nc?.bar || '#ccc' }} />
                      </div>
                    )}
                    <input
                      type="number"
                      min="0" max="10" step="0.1"
                      value={nota}
                      onChange={e => setNota(key, e.target.value)}
                      placeholder="0–10"
                      className={`w-20 text-center text-sm border rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 font-medium transition-colors ${
                        nc ? `${nc.bg} ${nc.text} border-transparent` : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {Object.values(form.notas).some(v => v !== '') && (
            <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700">Média calculada:</span>
              <span className="text-xl font-medium text-blue-700">
                {(Object.values(form.notas).filter(v => v !== '').reduce((a, b) => a + parseFloat(b), 0) /
                  Object.values(form.notas).filter(v => v !== '').length).toFixed(1)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={salvar}
              className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#0c447c] transition-colors"
            >
              <Plus size={15} />Salvar auditoria
            </button>
            {salvo && (
              <span className="text-sm text-green-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Auditoria salva com sucesso!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}