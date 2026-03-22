import { AlertTriangle, Send } from 'lucide-react'
import { useState } from 'react'

const riscos = [
  { codigo: 'R-01', desc: 'Falha no sistema TOTVS',          area: 'TI',         nivel: 'critico', responsavel: '—',          status: 'sem_resp' },
  { codigo: 'R-03', desc: 'NC crítica em auditoria',         area: 'Qualidade',  nivel: 'critico', responsavel: 'M. Silva',   status: 'mitigando' },
  { codigo: 'R-08', desc: 'Perda de rastreabilidade',        area: 'Logística',  nivel: 'alto',    responsavel: '—',          status: 'sem_resp' },
  { codigo: 'R-15', desc: 'Equipamento sem calibração',      area: 'Manutenção', nivel: 'alto',    responsavel: 'C. Mendes',  status: 'controlado' },
  { codigo: 'R-22', desc: 'Documentos sem revisão periódica',area: 'Qualidade',  nivel: 'medio',   responsavel: 'A. Ferreira',status: 'controlado' },
]

const nivelStyle = {
  critico:  { bg: 'bg-red-50',    text: 'text-red-600',    label: 'Crítico', bar: '#E24B4A', pct: 90 },
  alto:     { bg: 'bg-amber-50',  text: 'text-amber-700',  label: 'Alto',    bar: '#EF9F27', pct: 65 },
  medio:    { bg: 'bg-blue-50',   text: 'text-blue-600',   label: 'Médio',   bar: '#378ADD', pct: 35 },
}

const statusStyle = {
  sem_resp:   { bg: 'bg-red-50',    text: 'text-red-600',   label: 'Sem responsável' },
  mitigando:  { bg: 'bg-amber-50',  text: 'text-amber-700', label: 'Em mitigação' },
  controlado: { bg: 'bg-green-50',  text: 'text-green-700', label: 'Controlado' },
}

const cobr = [
  { risco: 'R-01 — Sem responsável definido',     dest: 'Diretoria',  urgencia: 'danger', quando: 'Hoje' },
  { risco: 'R-08 — Plano de ação vence em 2 dias',dest: 'Carlos M.',  urgencia: 'warn',   quando: 'Hoje' },
  { risco: 'R-22 — Ação concluída no prazo',      dest: 'Ana F.',     urgencia: 'ok',     quando: '20/03' },
]

const urgStyle = { danger: 'bg-red-400', warn: 'bg-amber-400', ok: 'bg-green-400' }

export default function GestaoRisco() {
  const [filtro, setFiltro] = useState('todos')

  const filtered = riscos.filter(r => filtro === 'todos' || r.nivel === filtro)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['todos','critico','alto','medio'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filtro === f ? 'bg-[#185FA5] text-white border-[#185FA5]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-sm bg-[#185FA5] text-white px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors">
          <AlertTriangle size={14} />Novo risco
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Código</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Risco</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Área</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Nível</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Responsável</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const n = nivelStyle[r.nivel]
              const s = statusStyle[r.status]
              return (
                <tr key={r.codigo} className="border-b border-gray-50 hover:bg-gray-50/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.codigo}</td>
                  <td className="px-4 py-3 text-gray-800">{r.desc}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.area}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${n.pct}%`, background: n.bar }} />
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.bg} ${n.text}`}>{n.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.responsavel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Cobranças automáticas</h2>
        <div className="space-y-2">
          {cobr.map(c => (
            <div key={c.risco} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${urgStyle[c.urgencia]}`} />
              <div className="flex-1">
                <p className="text-[13px] text-gray-700">{c.risco}</p>
                <p className="text-[11px] text-gray-400">Responsável: {c.dest} · {c.quando}</p>
              </div>
              <button className="text-xs border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 text-gray-600">
                {c.urgencia === 'ok' ? 'Ver' : 'Cobrar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}