import { AlertCircle, FileText, ShieldAlert, Truck, TrendingUp, TrendingDown, Clock } from 'lucide-react'

const metrics = [
  { label: 'Documentos ativos', value: 142, sub: '+3 este mês',   trend: 'up',   icon: FileText,     color: 'bg-blue-50 text-blue-600' },
  { label: 'NCs abertas',        value: 18,  sub: '5 em atraso',   trend: 'down', icon: AlertCircle,  color: 'bg-red-50 text-red-500' },
  { label: 'Riscos críticos',    value: 8,   sub: '2 sem responsável', trend: 'down', icon: ShieldAlert, color: 'bg-amber-50 text-amber-600' },
  { label: 'Fornecedores',       value: 67,  sub: '4 pendentes',   trend: 'up',   icon: Truck,        color: 'bg-green-50 text-green-600' },
]

const ncPorArea = [
  { area: 'Produção',   qty: 7,  pct: 70, color: '#D85A30' },
  { area: 'Qualidade',  qty: 4,  pct: 40, color: '#BA7517' },
  { area: 'Logística',  qty: 3,  pct: 30, color: '#1D9E75' },
  { area: 'Manutenção', qty: 2,  pct: 20, color: '#1D9E75' },
  { area: 'RH',         qty: 2,  pct: 20, color: '#1D9E75' },
]

const alertas = [
  { msg: 'NC-045 sem análise de causa',    meta: 'Venceu há 3 dias · Produção',  status: 'danger' },
  { msg: 'Risco R-08 sem responsável',     meta: 'Crítico · Gestão de Risco',    status: 'danger' },
  { msg: 'POP-012 revisão vence em 7d',    meta: 'Versão 2.1 · Qualidade',       status: 'warn' },
  { msg: 'Auditoria interna concluída',    meta: '3 achados · Logística',         status: 'ok' },
  { msg: 'Fornecedor F-012 em análise',    meta: 'Químicos do Sul · Pendente',   status: 'warn' },
]

const statusColor = {
  danger: 'bg-red-400',
  warn:   'bg-amber-400',
  ok:     'bg-green-400',
}

const statusBadge = {
  danger: 'bg-red-50 text-red-600',
  warn:   'bg-amber-50 text-amber-700',
  ok:     'bg-green-50 text-green-700',
}

const statusLabel = {
  danger: 'Urgente',
  warn:   'Atenção',
  ok:     'OK',
}

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(({ label, value, sub, trend, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-start">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
              <p className="text-2xl font-medium text-gray-800">{value}</p>
              <p className={`text-xs flex items-center gap-1 mt-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">NCs por área</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Este mês</span>
          </div>
          <div className="space-y-3">
            {ncPorArea.map(({ area, qty, pct, color }) => (
              <div key={area} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">{area}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-xs text-gray-500 w-4 text-right">{qty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">Alertas recentes</h2>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">5 urgentes</span>
          </div>
          <div className="space-y-2">
            {alertas.map(({ msg, meta, status }) => (
              <div key={msg} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor[status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-700 truncate">{msg}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} />{meta}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusBadge[status]}`}>
                  {statusLabel[status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}