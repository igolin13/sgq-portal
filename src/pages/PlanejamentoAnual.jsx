import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const ANO = 2026
const MES_ATUAL = 2 // março = índice 2

const CATEGORIAS = [
    { id: 'treinamento', label: 'Treinamentos', cor: '#185FA5', bg: '#E6F1FB' },
    { id: 'material', label: 'Análise de Material', cor: '#0F6E56', bg: '#E1F5EE' },
    { id: 'bpf', label: 'Auditoria de BPF', cor: '#854F0B', bg: '#FAEEDA' },
    { id: 'interna', label: 'Auditoria Interna', cor: '#712B13', bg: '#FAECE7' },
    { id: 'externa', label: 'Auditorias Externas / Cert.', cor: '#534AB7', bg: '#EEEDFE' },
]

const statusCfg = {
    planejado: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Planejado' },
    andamento: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Em andamento' },
    concluido: { bg: 'bg-green-50', text: 'text-green-700', label: 'Concluído' },
    atrasado: { bg: 'bg-red-50', text: 'text-red-600', label: 'Atrasado' },
    nao_aplic: { bg: 'bg-gray-50', text: 'text-gray-300', label: 'N/A' },
}

// cel: status por mês [Jan..Dez]
// P=planejado, A=andamento, C=concluido, X=atrasado, -=N/A
function parseCel(str) {
    const map = { P: 'planejado', A: 'andamento', C: 'concluido', X: 'atrasado', '-': 'nao_aplic' }
    return str.split('').map(c => map[c] || 'nao_aplic')
}

const atividadesIniciais = [
    // TREINAMENTOS
    { id: 1, cat: 'treinamento', nome: 'Treinamento de BPF — equipe produção', resp: 'Igor Bittencourt', meses: parseCel('CCAP----PPPP'), obs: '' },
    { id: 2, cat: 'treinamento', nome: 'Treinamento HACCP — manipuladores', resp: 'Maria Silva', meses: parseCel('-C--P---P---'), obs: '' },
    { id: 3, cat: 'treinamento', nome: 'Treinamento de segurança do trabalho', resp: 'Igor Bittencourt', meses: parseCel('C---P---P---'), obs: '' },
    { id: 4, cat: 'treinamento', nome: 'Treinamento SGQ — novos colaboradores', resp: 'Maria Silva', meses: parseCel('CCAPP---PPPP'), obs: '' },
    // ANÁLISE DE MATERIAL
    { id: 5, cat: 'material', nome: 'Análise microbiológica — matéria-prima', resp: 'Igor Bittencourt', meses: parseCel('CCAPPPPPPPP P'), obs: '' },
    { id: 6, cat: 'material', nome: 'Análise físico-química — produto acabado', resp: 'Maria Silva', meses: parseCel('CCAPPPPPPPPP'), obs: '' },
    { id: 7, cat: 'material', nome: 'Análise de água — ponto de uso', resp: 'Igor Bittencourt', meses: parseCel('CCAPPPPPPPPP'), obs: '' },
    // AUDITORIA BPF
    { id: 8, cat: 'bpf', nome: 'Auditoria de BPF — área de produção', resp: 'Igor Bittencourt', meses: parseCel('CC-P--P--P--'), obs: '' },
    { id: 9, cat: 'bpf', nome: 'Auditoria de BPF — estoque e armazenagem', resp: 'Maria Silva', meses: parseCel('-C--P---P---'), obs: '' },
    { id: 10, cat: 'bpf', nome: 'Auditoria de BPF — laboratório', resp: 'Igor Bittencourt', meses: parseCel('--CP----P---'), obs: '' },
    // AUDITORIA INTERNA
    { id: 11, cat: 'interna', nome: 'Auditoria interna — Sistema SGQ', resp: 'Igor Bittencourt', meses: parseCel('-C---P------'), obs: '' },
    { id: 12, cat: 'interna', nome: 'Auditoria interna — Processo produtivo', resp: 'Maria Silva', meses: parseCel('--CP--------'), obs: '' },
    { id: 13, cat: 'interna', nome: 'Reunião de análise crítica da direção', resp: 'Igor Bittencourt', meses: parseCel('------P-----'), obs: '' },
    // AUDITORIA EXTERNA
    { id: 14, cat: 'externa', nome: 'Auditoria de renovação ISO 9001', resp: 'Igor Bittencourt', meses: parseCel('-------P----'), obs: '' },
    { id: 15, cat: 'externa', nome: 'Auditoria MAPA / Vigilância Sanitária', resp: 'Igor Bittencourt', meses: parseCel('--P---------'), obs: '' },
    { id: 16, cat: 'externa', nome: 'Auditoria de fornecedor crítico', resp: 'Maria Silva', meses: parseCel('----P---P---'), obs: '' },
]

function calcProgresso(atividade) {
    const validos = atividade.meses.filter(m => m !== 'nao_aplic')
    const concluidos = atividade.meses.filter(m => m === 'concluido').length
    if (validos.length === 0) return 0
    return Math.round((concluidos / validos.length) * 100)
}

function CelulaStatus({ status, mes, ativo, onClick }) {
    const isPast = mes < MES_ATUAL
    const isCurrent = mes === MES_ATUAL

    if (status === 'nao_aplic') return (
        <td className="px-1 py-2 text-center">
            <div className="w-7 h-7 mx-auto rounded flex items-center justify-center text-gray-200 text-xs">—</div>
        </td>
    )

    const cores = {
        planejado: isCurrent ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : isPast ? 'bg-red-50 text-red-400 ring-1 ring-red-200' : 'bg-gray-100 text-gray-400',
        andamento: 'bg-blue-500 text-white',
        concluido: 'bg-green-500 text-white',
        atrasado: 'bg-red-500 text-white',
    }

    const icons = {
        planejado: isPast ? '!' : '·',
        andamento: '▶',
        concluido: '✓',
        atrasado: '✕',
    }

    const realStatus = status === 'planejado' && isPast ? 'atrasado' : status

    return (
        <td className="px-1 py-2 text-center" onClick={() => onClick(mes)}>
            <div className={`w-7 h-7 mx-auto rounded-md flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${cores[realStatus] || cores[status]}`}>
                {icons[realStatus] || icons[status]}
            </div>
        </td>
    )
}

function ModalAtividade({ atividade, cat, onSave, onClose }) {
    const [form, setForm] = useState({ ...atividade })

    function toggleMes(idx) {
        const seq = ['nao_aplic', 'planejado', 'andamento', 'concluido', 'atrasado']
        const atual = form.meses[idx]
        const prox = seq[(seq.indexOf(atual) + 1) % seq.length]
        const novos = [...form.meses]
        novos[idx] = prox
        setForm(f => ({ ...f, meses: novos }))
    }

    const prog = calcProgresso(form)

    return (
        <div style={{ minHeight: 480, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 0', borderRadius: 'var(--border-radius-lg)' }}>
            <div className="bg-white rounded-xl border border-gray-100 w-full max-w-2xl mx-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cat.bg, color: cat.cor }}>{cat.label}</span>
                        </div>
                        <h2 className="text-sm font-medium text-gray-800">{form.nome}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Nome da atividade</label>
                            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Responsável</label>
                            <input value={form.resp} onChange={e => setForm(f => ({ ...f, resp: e.target.value }))}
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status por mês — clique para alterar</p>
                            <span className="text-xs text-gray-400">Progresso: <span className="font-medium text-gray-700">{prog}%</span></span>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            {MESES.map((mes, idx) => {
                                const st = form.meses[idx]
                                const isPast = idx < MES_ATUAL
                                const realSt = st === 'planejado' && isPast ? 'atrasado' : st
                                const cores = {
                                    nao_aplic: 'bg-gray-50 text-gray-300 border-gray-100',
                                    planejado: idx === MES_ATUAL ? 'bg-blue-50 text-blue-600 border-blue-200' : isPast ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-100 text-gray-500 border-gray-200',
                                    andamento: 'bg-blue-500 text-white border-blue-500',
                                    concluido: 'bg-green-500 text-white border-green-500',
                                    atrasado: 'bg-red-500 text-white border-red-500',
                                }
                                return (
                                    <button key={idx} onClick={() => toggleMes(idx)}
                                        className={`rounded-lg border px-2 py-2 text-center transition-all hover:opacity-80 ${cores[realSt] || cores[st]}`}>
                                        <div className="text-xs font-medium">{mes}</div>
                                        <div className="text-[10px] mt-0.5 opacity-70">
                                            {st === 'nao_aplic' ? 'N/A' : st === 'planejado' && isPast ? 'Atrasado' : st === 'planejado' ? 'Planejado' : st === 'andamento' ? 'Andamento' : st === 'concluido' ? 'Concluído' : 'Atrasado'}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        <div className="flex gap-3 mt-3 flex-wrap">
                            {[
                                { st: 'planejado', cor: 'bg-gray-200', label: 'Planejado' },
                                { st: 'andamento', cor: 'bg-blue-500', label: 'Em andamento' },
                                { st: 'concluido', cor: 'bg-green-500', label: 'Concluído' },
                                { st: 'atrasado', cor: 'bg-red-500', label: 'Atrasado' },
                                { st: 'nao_aplic', cor: 'bg-gray-100', label: 'N/A' },
                            ].map(({ st, cor, label }) => (
                                <span key={st} className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span className={`w-3 h-3 rounded-sm inline-block ${cor}`} />{label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Observações</label>
                        <textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))}
                            rows={2} placeholder="Observações, pendências ou notas..."
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none" />
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button onClick={onClose} className="flex-1 text-sm border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50">Cancelar</button>
                        <button onClick={() => onSave(form)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#185FA5] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#0c447c] transition-colors">
                            <CheckCircle size={15} />Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const STORAGE_KEY = 'planejamento_abertos'

export default function PlanejamentoAnual() {
    const [atividades, setAtividades] = useState(atividadesIniciais)
    const [abertos, setAbertos] = useState(() => {
        try {
            const salvo = localStorage.getItem(STORAGE_KEY)
            if (salvo) return JSON.parse(salvo)
        } catch {}
        return Object.fromEntries(CATEGORIAS.map(c => [c.id, false]))
    })
    const [itemAtivo, setItemAtivo] = useState(null)
    const [catAtiva, setCatAtiva] = useState(null)
    const [anoVis, setAnoVis] = useState(ANO)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(abertos))
    }, [abertos])

    function toggle(cat) { setAbertos(p => ({ ...p, [cat]: !p[cat] })) }

    function salvar(form) {
        setAtividades(prev => prev.map(a => a.id === form.id ? form : a))
        setItemAtivo(null)
    }

    function novaAtividade(catId) {
        const nova = {
            id: Date.now(), cat: catId, nome: 'Nova atividade', resp: 'Igor Bittencourt',
            meses: Array(12).fill('nao_aplic'), obs: ''
        }
        setAtividades(p => [...p, nova])
        const cat = CATEGORIAS.find(c => c.id === catId)
        setItemAtivo(nova)
        setCatAtiva(cat)
    }

    // stats globais
    const total = atividades.reduce((a, i) => a + i.meses.filter(m => m !== 'nao_aplic').length, 0)
    const concluido = atividades.reduce((a, i) => a + i.meses.filter(m => m === 'concluido').length, 0)
    const atrasado = atividades.reduce((a, i) => a + i.meses.filter((m, idx) => m === 'planejado' && idx < MES_ATUAL).length, 0)
    const progGeral = total > 0 ? Math.round((concluido / total) * 100) : 0

    if (itemAtivo && catAtiva) return (
        <ModalAtividade atividade={itemAtivo} cat={catAtiva} onSave={salvar} onClose={() => { setItemAtivo(null); setCatAtiva(null) }} />
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-400 mb-1">Progresso geral</p>
                    <p className="text-2xl font-medium text-gray-800">{progGeral}%</p>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progGeral}%` }} />
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><CheckCircle size={18} className="text-green-600" /></div>
                    <div><p className="text-xs text-gray-400">Concluídas</p><p className="text-xl font-medium text-green-700">{concluido}</p></div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Planejadas</p><p className="text-xl font-medium text-blue-600">{total - concluido - atrasado}</p></div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><AlertCircle size={18} className="text-red-500" /></div>
                    <div><p className="text-xs text-gray-400">Atrasadas</p><p className="text-xl font-medium text-red-600">{atrasado}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ minWidth: 900 }}>
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 sticky left-0 bg-gray-50 z-10" style={{ minWidth: 220 }}>Atividade</th>
                                <th className="text-left text-xs text-gray-500 font-medium px-3 py-3" style={{ width: 110 }}>Responsável</th>
                                <th className="text-center text-xs text-gray-500 font-medium px-1 py-3" style={{ width: 44 }}>%</th>
                                {MESES.map((m, idx) => (
                                    <th key={m} className={`text-center text-xs font-medium px-1 py-3 ${idx === MES_ATUAL ? 'text-blue-600' : 'text-gray-500'}`} style={{ width: 38 }}>
                                        {m}
                                        {idx === MES_ATUAL && <div className="w-1 h-1 rounded-full bg-blue-500 mx-auto mt-0.5" />}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {CATEGORIAS.map(cat => {
                                const lista = atividades.filter(a => a.cat === cat.id)
                                const isOpen = abertos[cat.id]
                                const catConcluido = lista.reduce((a, i) => a + i.meses.filter(m => m === 'concluido').length, 0)
                                const catTotal = lista.reduce((a, i) => a + i.meses.filter(m => m !== 'nao_aplic').length, 0)
                                const catProg = catTotal > 0 ? Math.round((catConcluido / catTotal) * 100) : 0

                                return [
                                    <tr key={`cat-${cat.id}`} className="border-t border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                        onClick={() => toggle(cat.id)}>
                                        <td className="px-4 py-3 sticky left-0 bg-white z-10" colSpan={3}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                                                    style={{ background: cat.bg, color: cat.cor }}>
                                                    {cat.label.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="text-[13px] font-medium text-gray-800">{cat.label}</span>
                                                    <span className="text-xs text-gray-400 ml-2">{lista.length} atividade{lista.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center gap-2 ml-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all" style={{ width: `${catProg}%`, background: cat.cor }} />
                                                    </div>
                                                    <span className="text-xs font-medium" style={{ color: cat.cor }}>{catProg}%</span>
                                                </div>
                                                <div className="ml-auto text-gray-400">
                                                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                                </div>
                                            </div>
                                        </td>
                                        {MESES.map((_, idx) => <td key={idx} className="px-1 py-3" />)}
                                    </tr>,

                                    isOpen && lista.map(atv => {
                                        const prog = calcProgresso(atv)
                                        return (
                                            <tr key={atv.id} className="border-t border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                <td className="px-4 py-2 sticky left-0 bg-white z-10" style={{ paddingLeft: 52 }}>
                                                    <span className="text-xs text-gray-700 truncate block max-w-[180px]" title={atv.nome}>{atv.nome}</span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="text-xs text-gray-400 truncate block max-w-[100px]" title={atv.resp}>{atv.resp.split(' ')[0]}</span>
                                                </td>
                                                <td className="px-1 py-2 text-center">
                                                    <span className="text-[10px] font-medium text-gray-500">{prog}%</span>
                                                </td>
                                                {atv.meses.map((st, idx) => (
                                                    <CelulaStatus key={idx} status={st} mes={idx} onClick={() => {
                                                        setCatAtiva(cat)
                                                        setItemAtivo(atv)
                                                    }} />
                                                ))}
                                            </tr>
                                        )
                                    }),

                                    isOpen && (
                                        <tr key={`add-${cat.id}`} className="border-t border-gray-50">
                                            <td colSpan={15} className="px-4 py-2" style={{ paddingLeft: 52 }}>
                                                <button onClick={() => novaAtividade(cat.id)}
                                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Plus size={12} />Adicionar atividade
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ]
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center gap-4 px-1">
                {[
                    { cor: 'bg-green-500', label: 'Concluído' },
                    { cor: 'bg-blue-500', label: 'Em andamento' },
                    { cor: 'bg-gray-200', label: 'Planejado' },
                    { cor: 'bg-red-500', label: 'Atrasado' },
                    { cor: 'bg-gray-100', label: 'N/A' },
                ].map(({ cor, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className={`w-3 h-3 rounded-sm inline-block ${cor}`} />{label}
                    </span>
                ))}
                <span className="text-xs text-gray-400 ml-auto">Clique em qualquer célula para editar · {ANO}</span>
            </div>
        </div>
    )
}