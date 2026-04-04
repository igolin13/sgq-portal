import { useState } from 'react'
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { salvarItem } from '../../../services/sharepointService'
import { SHAREPOINT_CONFIG } from '../../../config/sharepoint'

const SELECIONADORAS = [
  'Ana Souza', 'Beatriz Lima', 'Carla Mendes', 'Daniela Costa',
  'Fernanda Alves', 'Gabriela Santos', 'Helena Rocha', 'Isabela Nunes',
]
const MAQUINAS = ['Env 1', 'Env 3', 'Env 5', 'Env 6', 'Lito 2', 'Lito 4', 'Lito 5', 'Lito 6']
const TIPOS    = ['Seleção Normal', 'Seleção Especial', 'Retrabalho']
const DEFEITOS_LIST = [
  'Amassado', 'Arranhado', 'Cor fora do padrão', 'Dobra', 'Empenado',
  'Falta de tinta', 'Furado', 'Manchado', 'Riscado', 'Sujo', 'Traço', 'Trinca',
]

const FORM_INICIAL = {
  data: new Date().toISOString().slice(0, 10),
  tipo: '', selecionadora: '', maquina: '',
  op: '', fardo: '', horaInicio: '', horaFim: '',
  folhasBoas: '', folhasPerda: '',
}

const OBRIGATORIOS = ['data','tipo','selecionadora','maquina','op','fardo','horaInicio','horaFim','folhasBoas','folhasPerda']

export default function ApontamentoSelecao({ onSalvo }) {
  const [form,        setForm]        = useState(FORM_INICIAL)
  const [defeitos,    setDefeitos]    = useState([])
  const [novoDefeito, setNovoDefeito] = useState({ defeito: '', quantidade: '' })
  const [erros,       setErros]       = useState({})
  const [erroDefeitos,setErroDefeitos]= useState('')
  const [status,      setStatus]      = useState(null)

  const folhasBoas  = parseInt(form.folhasBoas)  || 0
  const folhasPerda = parseInt(form.folhasPerda) || 0
  const total       = folhasBoas + folhasPerda
  const somaDefeitos = defeitos.reduce((acc, d) => acc + (parseInt(d.quantidade) || 0), 0)
  const defeitosOk   = folhasPerda === 0 || somaDefeitos === folhasPerda

  function campo(f, v) {
    setForm(p => ({ ...p, [f]: v }))
    setErros(p => ({ ...p, [f]: false }))
    setErroDefeitos('')
  }

  function adicionarDefeito() {
    if (!novoDefeito.defeito || !novoDefeito.quantidade) return
    setDefeitos(p => [...p, { ...novoDefeito, id: Date.now() }])
    setNovoDefeito({ defeito: '', quantidade: '' })
    setErroDefeitos('')
  }

  function validar() {
    const e = {}
    OBRIGATORIOS.forEach(c => { if (!form[c]) e[c] = true })
    setErros(e)

    let erroD = ''
    if (folhasPerda > 0 && somaDefeitos !== folhasPerda) {
      erroD = `A soma dos defeitos (${somaDefeitos}) deve ser igual às folhas de perda (${folhasPerda}).`
    }
    setErroDefeitos(erroD)

    return Object.keys(e).length === 0 && !erroD
  }

  async function salvar(sair = false) {
    if (!validar()) return
    setStatus('salvando')
    try {
      await salvarItem(SHAREPOINT_CONFIG.listas.apontamentoSelecao, { ...form, defeitos, total })
      setStatus('sucesso')
      setTimeout(() => {
        setStatus(null)
        setForm(FORM_INICIAL)
        setDefeitos([])
        if (sair && onSalvo) onSalvo({ ...form, defeitos, total })
      }, 2200)
    } catch {
      setStatus('erro')
      setTimeout(() => setStatus(null), 3500)
    }
  }

  const inputSt = (f) => ({
    width: '100%', padding: '11px 13px', borderRadius: 9, fontSize: 14,
    border: `1.5px solid ${erros[f] ? '#ef4444' : '#d1d5db'}`,
    background: erros[f] ? '#fff5f5' : '#fff',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  })
  const selSt = (f) => ({ ...inputSt(f), cursor: 'pointer' })
  const lbl = (t, req = true) => (
    <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {t}{req && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </div>
  )
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
  const g3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }

  if (status === 'sucesso') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '70px 40px', background: '#fff', borderRadius: 16 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={44} color="#16a34a"/>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#15803d' }}>Apontamento salvo!</div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>Registro enviado com sucesso.</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1.5px solid #f3f4f6' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🗂</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>Apontamento de Seleção</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>Campos com * são obrigatórios</div>
        </div>
      </div>

      {/* Data e Tipo */}
      <div style={g2}>
        <div>{lbl('Data')}<input type="date" value={form.data} onChange={e => campo('data', e.target.value)} style={inputSt('data')}/></div>
        <div>
          {lbl('Tipo')}
          <select value={form.tipo} onChange={e => campo('tipo', e.target.value)} style={selSt('tipo')}>
            <option value="">Selecione...</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Selecionadora e Máquina */}
      <div style={g2}>
        <div>
          {lbl('Selecionadora')}
          <select value={form.selecionadora} onChange={e => campo('selecionadora', e.target.value)} style={selSt('selecionadora')}>
            <option value="">Selecione...</option>
            {SELECIONADORAS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          {lbl('Linha / Máquina')}
          <select value={form.maquina} onChange={e => campo('maquina', e.target.value)} style={selSt('maquina')}>
            <option value="">Selecione...</option>
            {MAQUINAS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* OP e Fardo */}
      <div style={g2}>
        <div>{lbl('OP')}<input type="text" placeholder="Ex: 2024-1234" value={form.op} onChange={e => campo('op', e.target.value)} style={inputSt('op')}/></div>
        <div>{lbl('Nº Fardo')}<input type="number" placeholder="0" min="0" value={form.fardo} onChange={e => campo('fardo', e.target.value)} style={inputSt('fardo')}/></div>
      </div>

      {/* Horários */}
      <div style={g2}>
        <div>{lbl('Horário Início')}<input type="time" value={form.horaInicio} onChange={e => campo('horaInicio', e.target.value)} style={inputSt('horaInicio')}/></div>
        <div>{lbl('Horário Fim')}<input type="time" value={form.horaFim} onChange={e => campo('horaFim', e.target.value)} style={inputSt('horaFim')}/></div>
      </div>

      {/* Folhas + Total */}
      <div style={g3}>
        <div>{lbl('Folhas Boas')}<input type="number" placeholder="0" min="0" value={form.folhasBoas} onChange={e => campo('folhasBoas', e.target.value)} style={inputSt('folhasBoas')}/></div>
        <div>{lbl('Folhas Perda')}<input type="number" placeholder="0" min="0" value={form.folhasPerda} onChange={e => campo('folhasPerda', e.target.value)} style={inputSt('folhasPerda')}/></div>
        <div>
          {lbl('Total da OP', false)}
          <div style={{ padding: '11px 13px', borderRadius: 9, background: '#fef3c7', border: '1.5px solid #fde68a', fontSize: 15, fontWeight: 700, color: '#92400e' }}>
            {total.toLocaleString('pt-BR')} fls
          </div>
        </div>
      </div>

      {/* Seção de defeitos */}
      <div style={{ background: '#fffbeb', border: `1.5px solid ${erroDefeitos ? '#ef4444' : '#fde68a'}`, borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#78350f', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Defeitos encontrados
          </div>
          {/* Contador soma vs perda */}
          {folhasPerda > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, background: defeitosOk ? '#f0fdf4' : '#fff5f5', border: `1px solid ${defeitosOk ? '#86efac' : '#fca5a5'}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: defeitosOk ? '#16a34a' : '#ef4444' }}/>
              <span style={{ fontSize: 12, fontWeight: 700, color: defeitosOk ? '#15803d' : '#dc2626' }}>
                {somaDefeitos} / {folhasPerda} fls de perda
              </span>
            </div>
          )}
        </div>

        {/* Adicionar defeito */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px auto', gap: 10, alignItems: 'flex-end', marginBottom: defeitos.length ? 14 : 0 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 5 }}>Defeito</div>
            <select value={novoDefeito.defeito} onChange={e => setNovoDefeito(p => ({ ...p, defeito: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14, border: '1.5px solid #d1d5db', background: '#fff', outline: 'none', cursor: 'pointer' }}>
              <option value="">Selecione...</option>
              {DEFEITOS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 5 }}>Qtd</div>
            <input type="number" placeholder="0" min="1" value={novoDefeito.quantidade}
              onChange={e => setNovoDefeito(p => ({ ...p, quantidade: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') adicionarDefeito() }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14, border: '1.5px solid #d1d5db', background: '#fff', outline: 'none' }}/>
          </div>
          <button onClick={adicionarDefeito}
            style={{ height: 42, padding: '0 16px', borderRadius: 8, background: '#f59e0b', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15}/> Add
          </button>
        </div>

        {/* Lista de defeitos */}
        {defeitos.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderRadius: 8, background: '#fff', border: '1px solid #fde68a', marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: '#374151' }}>{d.defeito}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#92400e' }}>{d.quantidade} fls</span>
              <button onClick={() => setDefeitos(p => p.filter(x => x.id !== d.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={15}/>
              </button>
            </div>
          </div>
        ))}

        {defeitos.length === 0 && (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', padding: '8px 0' }}>
            {folhasPerda > 0 ? `Adicione defeitos para totalizar ${folhasPerda} folha(s) de perda` : 'Nenhum defeito adicionado'}
          </div>
        )}

        {/* Erro defeitos */}
        {erroDefeitos && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 14px', borderRadius: 8, background: '#fff5f5', border: '1px solid #fca5a5' }}>
            <AlertCircle size={14} color="#ef4444"/>
            <span style={{ fontSize: 13, color: '#dc2626' }}>{erroDefeitos}</span>
          </div>
        )}
      </div>

      {/* Feedback campos obrigatórios */}
      {Object.keys(erros).length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 9, background: '#fff5f5', border: '1px solid #fca5a5' }}>
          <AlertCircle size={16} color="#ef4444"/>
          <span style={{ fontSize: 13, color: '#dc2626' }}>Preencha todos os campos obrigatórios marcados em vermelho.</span>
        </div>
      )}

      {/* Botões */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button onClick={() => { setForm(FORM_INICIAL); setDefeitos([]); setErros({}); setErroDefeitos('') }}
          style={{ flex: 1, padding: '13px 0', borderRadius: 10, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Limpar
        </button>
        <button onClick={() => salvar(false)} disabled={status === 'salvando'}
          style={{ flex: 1, padding: '13px 0', borderRadius: 10, background: '#fffbeb', border: '1.5px solid #f59e0b', color: '#92400e', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: status === 'salvando' ? 0.7 : 1 }}>
          {status === 'salvando' ? 'Salvando...' : 'Salvar rascunho'}
        </button>
        <button onClick={() => salvar(true)} disabled={status === 'salvando'}
          style={{ flex: 2, padding: '13px 0', borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: status === 'salvando' ? 0.7 : 1 }}>
          {status === 'salvando' ? 'Salvando...' : '✓ Salvar e sair'}
        </button>
      </div>
    </div>
  )
}
