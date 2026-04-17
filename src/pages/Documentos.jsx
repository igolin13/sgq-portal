import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye, Download, Search, Plus } from 'lucide-react'
import TopBar from '../components/TopBar'

const tiposDoc = [
  {
    sigla: 'PO',
    nome: 'Procedimento Operacional',
    cor: '#185FA5',
    corBg: '#E6F1FB',
    docs: [
      { codigo: 'PO-001', titulo: 'Controle de documentos',        versao: '3.2', revisao: 'Jan/26', status: 'vigente' },
      { codigo: 'PO-002', titulo: 'Calibração de instrumentos',    versao: '2.1', revisao: 'Out/25', status: 'revisao' },
      { codigo: 'PO-003', titulo: 'Inspeção de recebimento',       versao: '1.5', revisao: 'Mar/26', status: 'vigente' },
      { codigo: 'PO-004', titulo: 'Controle de processo produtivo',versao: '2.0', revisao: 'Fev/26', status: 'vigente' },
    ],
  },
  {
    sigla: 'PA',
    nome: 'Procedimento Administrativo',
    cor: '#0F6E56',
    corBg: '#E1F5EE',
    docs: [
      { codigo: 'PA-001', titulo: 'Gestão de fornecedores',        versao: '1.3', revisao: 'Jan/26', status: 'vigente' },
      { codigo: 'PA-002', titulo: 'Controle de registros',         versao: '2.0', revisao: 'Dez/25', status: 'revisao' },
      { codigo: 'PA-003', titulo: 'Análise crítica da direção',    versao: '1.1', revisao: 'Mar/26', status: 'vigente' },
    ],
  },
  {
    sigla: 'PSA',
    nome: 'Procedimento de Segurança de Alimentos',
    cor: '#854F0B',
    corBg: '#FAEEDA',
    docs: [
      { codigo: 'PSA-001', titulo: 'Análise de perigos HACCP',     versao: '4.0', revisao: 'Fev/26', status: 'vigente' },
      { codigo: 'PSA-002', titulo: 'Controle de temperaturas',     versao: '2.3', revisao: 'Jan/26', status: 'vigente' },
      { codigo: 'PSA-003', titulo: 'Higienização de equipamentos', versao: '1.8', revisao: 'Dez/25', status: 'obsoleto' },
      { codigo: 'PSA-004', titulo: 'Rastreabilidade de lotes',     versao: '3.1', revisao: 'Mar/26', status: 'vigente' },
    ],
  },
  {
    sigla: 'PG',
    nome: 'Procedimento Gerencial',
    cor: '#712B13',
    corBg: '#FAECE7',
    docs: [
      { codigo: 'PG-001', titulo: 'Manual da qualidade',           versao: '5.1', revisao: 'Dez/25', status: 'obsoleto' },
      { codigo: 'PG-002', titulo: 'Gestão de não conformidades',   versao: '3.0', revisao: 'Fev/26', status: 'vigente' },
      { codigo: 'PG-003', titulo: 'Auditoria interna',             versao: '2.2', revisao: 'Mar/26', status: 'vigente' },
    ],
  },
]

const statusStyle = {
  vigente:  { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Vigente'  },
  revisao:  { bg: 'bg-amber-50',  text: 'text-amber-700',  label: 'Revisão'  },
  obsoleto: { bg: 'bg-red-50',    text: 'text-red-600',    label: 'Obsoleto' },
}

function contarStatus(docs) {
  return {
    vigente:  docs.filter(d => d.status === 'vigente').length,
    revisao:  docs.filter(d => d.status === 'revisao').length,
    obsoleto: docs.filter(d => d.status === 'obsoleto').length,
  }
}

export default function Documentos() {
  const [abertos, setAbertos] = useState({ PO: true })
  const [search, setSearch] = useState('')

  function toggle(sigla) {
    setAbertos(prev => ({ ...prev, [sigla]: !prev[sigla] }))
  }

  return (
    <>
      <TopBar system="SGQ" moduleName="Documentos" user={{ name: "Igor Bittencourt", role: "Gestão da Qualidade", initials: "IB" }} />
    <div className="space-y-3" style={{ paddingTop: 24 }}>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar documento por código ou título..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors">
          <Plus size={15} />Novo documento
        </button>
      </div>

      {tiposDoc.map(({ sigla, nome, cor, corBg, docs }) => {
        const isOpen = !!abertos[sigla]
        const counts = contarStatus(docs)

        const filtrados = search
          ? docs.filter(d =>
              d.codigo.toLowerCase().includes(search.toLowerCase()) ||
              d.titulo.toLowerCase().includes(search.toLowerCase())
            )
          : docs

        if (search && filtrados.length === 0) return null

        return (
          <div key={sigla} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggle(sigla)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ background: corBg, color: cor }}
              >
                {sigla}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-medium text-gray-800">{nome}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{docs.length} documentos</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {counts.vigente > 0 && (
                    <span className="text-[11px] text-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      {counts.vigente} vigente{counts.vigente > 1 ? 's' : ''}
                    </span>
                  )}
                  {counts.revisao > 0 && (
                    <span className="text-[11px] text-amber-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                      {counts.revisao} em revisão
                    </span>
                  )}
                  {counts.obsoleto > 0 && (
                    <span className="text-[11px] text-red-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      {counts.obsoleto} obsoleto{counts.obsoleto > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ color: cor }}>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {(isOpen || search) && filtrados.length > 0 && (
              <div className="border-t border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70">
                      <th className="text-left text-xs text-gray-400 font-medium px-5 py-2.5">Código</th>
                      <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Título</th>
                      <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Versão</th>
                      <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Revisão</th>
                      <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((doc) => {
                      const s = statusStyle[doc.status]
                      return (
                        <tr
                          key={doc.codigo}
                          className="border-t border-gray-50 hover:bg-gray-50/40 transition-colors"
                        >
                          <td className="px-5 py-3 font-mono text-xs text-gray-500">{doc.codigo}</td>
                          <td className="px-4 py-3 text-gray-800">{doc.titulo}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{doc.versao}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{doc.revisao}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
                              {s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors">
                                <Eye size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors">
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}

      {search && tiposDoc.every(t =>
        !t.docs.some(d =>
          d.codigo.toLowerCase().includes(search.toLowerCase()) ||
          d.titulo.toLowerCase().includes(search.toLowerCase())
        )
      ) && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
          Nenhum documento encontrado para "{search}"
        </div>
      )}
    </div>
    </>
  )
}