import { RefreshCw } from 'lucide-react'
import TopBar from '../components/TopBar'

const fornecedores = [
  { codigo: 'F-001', nome: 'Aço Brasil Ltda',       categoria: 'Matéria-prima', avaliacao: 'Aprovado',  status: 'ativo' },
  { codigo: 'F-012', nome: 'Químicos do Sul',        categoria: 'Insumos',       avaliacao: 'Em análise',status: 'pendente' },
  { codigo: 'F-023', nome: 'Logística Rápida ME',    categoria: 'Serviços',      avaliacao: 'Aprovado',  status: 'ativo' },
  { codigo: 'F-031', nome: 'EPI Seguro Comércio',    categoria: 'EPI',           avaliacao: 'Reprovado', status: 'bloqueado' },
  { codigo: 'F-045', nome: 'TecnoMet Ind.',          categoria: 'Matéria-prima', avaliacao: 'Aprovado',  status: 'ativo' },
]

const statusStyle = {
  ativo:     { bg: 'bg-green-50', text: 'text-green-700', label: 'Ativo' },
  pendente:  { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pendente' },
  bloqueado: { bg: 'bg-red-50',   text: 'text-red-600',   label: 'Bloqueado' },
}

export function Fornecedores() {
  return (
    <>
      <TopBar system="SGQ" moduleName="Fornecedores" user={{ name: "Igor Bittencourt", role: "Gestão da Qualidade", initials: "IB" }} />
    <div className="space-y-4" style={{ paddingTop: 24 }}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{fornecedores.length} fornecedores cadastrados</span>
        <button className="flex items-center gap-2 text-sm border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
          <RefreshCw size={14} />Sincronizar TOTVS
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Código</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Razão social</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Categoria</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Avaliação</th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map(f => {
              const s = statusStyle[f.status]
              return (
                <tr key={f.codigo} className="border-b border-gray-50 hover:bg-gray-50/50 last:border-0 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{f.codigo}</td>
                  <td className="px-4 py-3 text-gray-800">{f.nome}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{f.categoria}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{f.avaliacao}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default Fornecedores