import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { salvarItem } from '../../../services/sharepointService'
import { SHAREPOINT_CONFIG } from '../../../config/sharepoint'

const TURNOS = ['07x15', '15x23', '23x07']

const INSPETORES = ['GLAUBER', 'LUIZ GUILHERME', 'THAIS', 'ROGER', 'RAONY', 'MAYCKI']

const SUPERVISORES = ['ALEXANDRE', 'DANIEL', 'JHUAN', 'JEFFERSON', 'MAURO', 'ROBSON']

const FORM_VAZIO = {
  data: new Date().toISOString().slice(0, 10),
  turno: '', inspetor: '', supervisor: '',
  qtdEmbalado: '', qtdRetido: '', observacao: '',
}

const OBRIGATORIOS = ['data', 'turno', 'inspetor', 'supervisor', 'qtdEmbalado', 'qtdRetido']

export default function LiberacaoCarga({ onSalvo, onCancelar }) {
  const [form,   setForm]   = useState(FORM_VAZIO)
  const [erros,  setErros]  = useState({})
  const [status, setStatus] = useState(null)

  function campo(f, v) { setForm(p => ({ ...p, [f]: v })); setErros(p => ({ ...p, [f]: false })) }

  function validar() {
    const e = {}
    OBRIGATORIOS.forEach(c => { if (!form[c] && form[c] !== 0) e[c] = true })
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function salvar() {
    if (!validar()) return
    setStatus('salvando')
    try {
      await salvarItem(SHAREPOINT_CONFIG.listas.liberacaoCarga, form)
      setStatus('sucesso')
      setTimeout(() => { setStatus(null); if (onSalvo) onSalvo(form) }, 2000)
    } catch {
      setStatus('erro')
      setTimeout(() => setStatus(null), 3500)
    }
  }

  const inputSt = (f) => ({
    width: '100%', padding: '13px 15px', borderRadius: 10, fontSize: 15,
    border: `2px solid ${erros[f] ? '#ef4444' : '#d1d5db'}`,
    background: erros[f] ? '#fff5f5' : '#fff',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color .15s',
  })
  const selSt = (f) => ({ ...inputSt(f), cursor: 'pointer' })
  const lbl = (t, req = true) => (
    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {t}{req && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </div>
  )
  const g2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }

  if (status === 'sucesso') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 40px', background: '#fff', borderRadius: 16 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={44} color="#16a34a"/>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>Liberação registrada!</div>
        <div style={{ fontSize: 14, color: '#6b7280' }}>Liberação de Fardos salva com sucesso.</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1.5px solid #f3f4f6' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🚛</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>Liberação de Fardos nas Bancas de Embalagem</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>Campos com * são obrigatórios</div>
        </div>
      </div>

      {/* DADOS INICIAIS */}
      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', background: '#0369a1' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Dados iniciais</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={g2}>
            <div>
              {lbl('Data')}
              <input type="date" value={form.data} onChange={e => campo('data', e.target.value)} style={inputSt('data')}/>
            </div>
            <div>
              {lbl('Turno')}
              <select value={form.turno} onChange={e => campo('turno', e.target.value)} style={selSt('turno')}>
                <option value="">Selecione...</option>
                {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={g2}>
            <div>
              {lbl('Inspetor')}
              <select value={form.inspetor} onChange={e => campo('inspetor', e.target.value)} style={selSt('inspetor')}>
                <option value="">Selecione...</option>
                {INSPETORES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              {lbl('Supervisor')}
              <select value={form.supervisor} onChange={e => campo('supervisor', e.target.value)} style={selSt('supervisor')}>
                <option value="">Selecione...</option>
                {SUPERVISORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUÇÃO */}
      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', background: '#0f6e56' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Produção</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={g2}>
            <div>
              {lbl('Qtd de fardos embalados')}
              <input type="number" placeholder="0" min="0" value={form.qtdEmbalado} onChange={e => campo('qtdEmbalado', e.target.value)} style={inputSt('qtdEmbalado')}/>
            </div>
            <div>
              {lbl('Qtd de fardos retidos')}
              <input type="number" placeholder="0" min="0" value={form.qtdRetido} onChange={e => campo('qtdRetido', e.target.value)} style={inputSt('qtdRetido')}/>
            </div>
          </div>

          {/* Totalizador visual */}
          {(form.qtdEmbalado || form.qtdRetido) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: '#f0fdf4', border: '1.5px solid #86efac', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Embalados</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>{form.qtdEmbalado || 0}</div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: '#fff5f5', border: '1.5px solid #fca5a5', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Retidos</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626' }}>{form.qtdRetido || 0}</div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: '#eff6ff', border: '1.5px solid #bfdbfe', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Total</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1d4ed8' }}>
                  {(parseInt(form.qtdEmbalado) || 0) + (parseInt(form.qtdRetido) || 0)}
                </div>
              </div>
            </div>
          )}

          <div>
            {lbl('Observação', false)}
            <textarea value={form.observacao} onChange={e => campo('observacao', e.target.value)}
              placeholder="Observações sobre a liberação..."
              style={{ width: '100%', padding: '11px 13px', borderRadius: 10, fontSize: 14, border: '1.5px solid #d1d5db', background: '#fff', outline: 'none', minHeight: 90, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}/>
          </div>
        </div>
      </div>

      {Object.keys(erros).length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 9, background: '#fff5f5', border: '1px solid #fca5a5' }}>
          <AlertCircle size={16} color="#ef4444"/>
          <span style={{ fontSize: 13, color: '#dc2626' }}>Preencha todos os campos obrigatórios.</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancelar} style={{ flex: 1, padding: '14px 0', borderRadius: 10, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button onClick={salvar} disabled={status === 'salvando'}
          style={{ flex: 2, padding: '14px 0', borderRadius: 10, background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: status === 'salvando' ? 0.7 : 1 }}>
          {status === 'salvando' ? 'Salvando...' : '✓ Confirmar Liberação'}
        </button>
      </div>
    </div>
  )
}
