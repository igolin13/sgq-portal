import { useState } from 'react'
import { Plus, Search, Eye, X, ChevronDown, ChevronUp, Paperclip, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const ncIniciais = [
  {
    id: 1, codigo: 'NC-041', area: 'Produção',   abertura: '10/03/26', prazo: '24/03/26',
    descricao: 'Falha no controle de temperatura do processo de pasteurização.',
    status: 'andamento', origem: 'TOTVS',
    causa: '', acaoCorretiva: '', responsavel: '', prazoAcao: '', eficacia: '', evidencia: '',
  },
  {
    id: 2, codigo: 'NC-042', area: 'Qualidade',  abertura: '12/03/26', prazo: '26/03/26',
    descricao: 'Formulário de controle preenchido incorretamente por operador.',
    status: 'andamento', origem: 'TOTVS',
    causa: 'Operador não treinado no novo formulário.',
    acaoCorretiva: 'Realizar treinamento com toda a equipe.',
    responsavel: 'Maria Silva', prazoAcao: '2026-03-28', eficacia: '', evidencia: '',
  },
  {
    id: 3, codigo: 'NC-043', area: 'Produção',   abertura: '14/03/26', prazo: '21/03/26',
    descricao: 'Produto lote #4421 fora de especificação de pH.',
    status: 'atrasado', origem: 'TOTVS',
    causa: '', acaoCorretiva: '', responsavel: '', prazoAcao: '', eficacia: '', evidencia: '',
  },
  {
    id: 4, codigo: 'NC-044', area: 'Manutenção', abertura: '15/03/26', prazo: '29/03/26',
    descricao: 'Equipamento EQ-07 operando sem certificado de calibração vigente.',
    status: 'analise', origem: 'TOTVS',
    causa: 'Calibração venceu e não foi renovada no prazo.',
    acaoCorretiva: 'Agendar calibração imediata e revisar cronograma.',
    responsavel: 'Carlos Mendes', prazoAcao: '2026-03-25', eficacia: '', evidencia: '',
  },
  {
    id: 5, codigo: 'NC-045', area: 'Logística',  abertura: '18/03/26', prazo: '18/03/26',
    descricao: 'Lote L-2203 entregue ao cliente sem rastreabilidade completa.',
    status: 'atrasado', origem: 'TOTVS',
    causa: '', acaoCorretiva: '', responsavel: '', prazoAcao: '', eficacia: '', evidencia: '',
  },
]

const ncConcluidas = [
  {
    id: 10, codigo: 'NC-038', area: 'Produção',  abertura: '10/02/26', prazo: '24/02/26', conclusao: '22/02/26',
    descricao: 'Temperatura de armazenamento acima do limite especificado.',
    status: 'concluido', origem: 'TOTVS',
    causa: 'Falha no sensor de temperatura da câmara fria.',
    acaoCorretiva: 'Substituição do sensor e revisão do plano de manutenção preventiva.',
    responsavel: 'Carlos Mendes', prazoAcao: '2026-02-20', eficacia: 'Eficaz', evidencia: 'Relatório técnico anexado.',
  },
  {
    id: 11, codigo: 'NC-039', area: 'Qualidade', abertura: '14/02/26', prazo: '28/02/26', conclusao: '26/02/26',
    descricao: 'Não conformidade em auditoria interna — item 8.5.2 da ISO.',
    status: 'concluido', origem: 'TOTVS',
    causa: 'Procedimento POP-012 desatualizado.',
    acaoCorretiva: 'Revisão e aprovação do POP-012.',
    responsavel: 'Maria Silva', prazoAcao: '2026-02-25', eficacia: 'Eficaz', evidencia: 'POP-012 v2.2 aprovado.',
  },
  {
    id: 12, codigo: 'NC-040', area: 'Logística', abertura: '20/02/26', prazo: '06/03/26', conclusao: '04/03/26',
    descricao: 'Divergência no inventário de matéria-prima.',
    status: 'concluido', origem: 'TOTVS',
    causa: 'Falha no processo de conferência de recebimento.',
    acaoCorretiva: 'Treinamento da equipe de recebimento e revisão do IT-023.',
    responsavel: 'Ana Ferreira', prazoAcao: '2026-03-04', eficacia: 'Eficaz', evidencia: 'Lista de presença treinamento.',
  },
]

const statusCfg = {
  andamento: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400', label: 'Em andamento' },
  atrasado:  { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400',   label: 'Atrasado' },
  analise:   { bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400',  label: 'Em análise' },
  concluido: { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400', label: 'Concluído' },
}

const eficaciaOpts = ['', 'Eficaz', 'Parcialmente eficaz', 'Não eficaz — reabrir NC']

function FormularioNC({ nc, onSave, onClose }) {
  const [form, setForm] = useState({ ...nc })
  const vemTotvs = nc.origem === 'TOTVS'

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  return (
    <div style={{ minHeight: 500, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 0', borderRadius: 'var(--border-radius-lg)' }}>
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-2xl mx-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-medium text-gray-800">{form.codigo} — {form.area}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Abertura: {form.abertura} · Prazo: {form.prazo}</p>
          </div>
          <div className="flex items-center gap-2">
            {vemTotvs && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Origem: TOTVS</span>}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Dados do TOTVS</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-gray-400">Código:</span> <span className="font-medium text-gray-700">{form.codigo}</span></div>
                <div><span className="text-gray-400">Área:</span> <span className="font-medium text-gray-700">{form.area}</span></div>
                <div><span className="text-gray-400">Abertura:</span> <span className="font-medium text-gray-700">{form.abertura}</span></div>
                <div><span className="text-gray-400">Prazo:</span> <span className="font-medium text-gray-700">{form.prazo}</span></div>
              </div>
              <div className="text-xs mt-2">
                <span className="text-gray-400">Descrição:</span>
                <p className="text-gray-700 mt-0.5">{form.descricao}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Análise de causa (5 Porquês)</p>
            <textarea
              value={form.causa}
              onChange={e => set('causa', e.target.value)}
              placeholder="1. Por quê ocorreu?&#10;2. Por quê esse motivo existiu?&#10;3. Por quê não foi detectado?&#10;4. Por quê o controle falhou?&#10;5. Causa raiz:"
              rows={5}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ação corretiva</label>
              <textarea
                value={form.acaoCorretiva}
                onChange={e => set('acaoCorretiva', e.target.value)}
                placeholder="Descreva a ação corretiva a ser tomada..."
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Responsável pela ação</label>
                <input
                  value={form.responsavel}
                  onChange={e => set('responsavel', e.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Prazo da ação</label>
                <input
                  type="date"
                  value={form.prazoAcao}
                  onChange={e => set('prazoAcao', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Evidência de conclusão</label>
            <div className="flex gap-2">
              <input
                value={form.evidencia}
                onChange={e => set('evidencia', e.target.value)}
                placeholder="Descreva ou cite o arquivo de evidência..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
              />
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
                <Paperclip size={13} />Anexar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Avaliação de eficácia</label>
            <select
              value={form.eficacia}
              onChange={e => set('eficacia', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
            >
              {eficaciaOpts.map(o => <option key={o} value={o}>{o || 'Selecione...'}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => onSave({ ...form, status: 'andamento' })}
              className="flex-1 text-sm border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Salvar rascunho
            </button>
            <button
              onClick={() => onSave({ ...form, status: 'concluido', conclusao: new Date().toLocaleDateString('pt-BR').replace(/\//g, '/') })}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={15} />Encerrar NC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NaoConformidades() {
  const [aba, setAba] = useState('abertas')
  const [abertas, setAbertas] = useState(ncIniciais)
  const [concluidas, setConcluidas] = useState(ncConcluidas)
  const [search, setSearch] = useState('')
  const [ncAtiva, setNcAtiva] = useState(null)
  const [novaNC, setNovaNC] = useState(false)

  const novoForm = {
    id: Date.now(), codigo: '', area: 'Produção', abertura: new Date().toLocaleDateString('pt-BR'),
    prazo: '', descricao: '', status: 'andamento', origem: 'Manual',
    causa: '', acaoCorretiva: '', responsavel: '', prazoAcao: '', eficacia: '', evidencia: '',
  }

  function salvarNC(form) {
    if (form.status === 'concluido') {
      setAbertas(prev => prev.filter(n => n.id !== form.id))
      setConcluidas(prev => [form, ...prev])
    } else {
      setAbertas(prev => prev.map(n => n.id === form.id ? form : n))
    }
    setNcAtiva(null)
    setNovaNC(false)
  }

  function salvarNova(form) {
    setAbertas(prev => [{ ...form, codigo: `NC-${String(Date.now()).slice(-3)}` }, ...prev])
    setNovaNC(false)
  }

  const filtrarAbertas = abertas.filter(n =>
    n.codigo.toLowerCase().includes(search.toLowerCase()) ||
    n.area.toLowerCase().includes(search.toLowerCase()) ||
    n.descricao.toLowerCase().includes(search.toLowerCase())
  )

  const filtrarConcluidas = concluidas.filter(n =>
    n.codigo.toLowerCase().includes(search.toLowerCase()) ||
    n.area.toLowerCase().includes(search.toLowerCase())
  )

  const atrasadas = abertas.filter(n => n.status === 'atrasado').length
  const semCausa  = abertas.filter(n => !n.causa).length

  if (ncAtiva) return <FormularioNC nc={ncAtiva} onSave={salvarNC} onClose={() => setNcAtiva(null)} />
  if (novaNC)  return <FormularioNC nc={novoForm} onSave={salvarNova} onClose={() => setNovaNC(false)} />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Em aberto</p>
            <p className="text-xl font-medium text-gray-800">{abertas.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Atrasadas</p>
            <p className="text-xl font-medium text-red-600">{atrasadas}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Concluídas</p>
            <p className="text-xl font-medium text-green-700">{concluidas.length}</p>
          </div>
        </div>
      </div>

      {atrasadas > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span><strong>{atrasadas} NC{atrasadas > 1 ? 's' : ''} em atraso</strong> e <strong>{semCausa} sem análise de causa</strong>. Clique para completar.</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-gray-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => setAba('abertas')}
            className={`text-sm px-4 py-1.5 rounded-md transition-colors ${aba === 'abertas' ? 'bg-[#185FA5] text-white font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Em aberto ({abertas.length})
          </button>
          <button
            onClick={() => setAba('concluidas')}
            className={`text-sm px-4 py-1.5 rounded-md transition-colors ${aba === 'concluidas' ? 'bg-green-600 text-white font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Concluídas ({concluidas.length})
          </button>
        </div>
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por código, área ou descrição..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400"
          />
        </div>
        <button
          onClick={() => setNovaNC(true)}
          className="flex items-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0c447c] transition-colors whitespace-nowrap"
        >
          <Plus size={14} />Nova NC
        </button>
      </div>

      {aba === 'abertas' && (
        <div className="space-y-2">
          {filtrarAbertas.map(nc => {
            const s = statusCfg[nc.status]
            const completo = nc.causa && nc.acaoCorretiva && nc.responsavel
            return (
              <div
                key={nc.id}
                onClick={() => setNcAtiva(nc)}
                className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{nc.codigo}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{nc.area}</span>
                    {nc.origem === 'TOTVS' && <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded">TOTVS</span>}
                  </div>
                  <p className="text-sm text-gray-800 truncate">{nc.descricao}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />Prazo: {nc.prazo}</span>
                    {nc.responsavel && <span className="text-xs text-gray-400">Resp: {nc.responsavel}</span>}
                    {!completo && <span className="text-xs text-amber-600 flex items-center gap-1">⚠ Campos pendentes</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                  <Eye size={15} className="text-gray-300" />
                </div>
              </div>
            )
          })}
          {filtrarAbertas.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
              Nenhuma NC em aberto encontrada.
            </div>
          )}
        </div>
      )}

      {aba === 'concluidas' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Código</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Descrição</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Área</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Conclusão</th>
                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Eficácia</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtrarConcluidas.map(nc => (
                <tr key={nc.id} className="border-b border-gray-50 hover:bg-gray-50/40 last:border-0 cursor-pointer" onClick={() => setNcAtiva(nc)}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{nc.codigo}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs max-w-xs truncate">{nc.descricao}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{nc.area}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{nc.conclusao}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      nc.eficacia === 'Eficaz' ? 'bg-green-50 text-green-700' :
                      nc.eficacia === 'Parcialmente eficaz' ? 'bg-amber-50 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{nc.eficacia || '—'}</span>
                  </td>
                  <td className="px-4 py-3"><Eye size={14} className="text-gray-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrarConcluidas.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Nenhuma NC concluída encontrada.</div>
          )}
        </div>
      )}
    </div>
  )
}