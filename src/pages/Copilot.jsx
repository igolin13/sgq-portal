import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import TopBar from '../components/TopBar'

const initialMessages = [
  { role: 'ai', text: 'Olá! Sou o Copilot do SGQ. Tenho acesso a documentos, NCs, riscos, fornecedores e auditorias 5S. Como posso ajudar?' },
]

const responses = {
  'pop-001':  'POP-001 — Controle de documentos | Versão: 3.2 | Status: Vigente | Última revisão: Jan/2026.',
  'pop-012':  'POP-012 — Calibração de instrumentos | Versão: 2.1 | Status: Revisão pendente ⚠️ | Vence em 7 dias. Recomendo iniciar revisão.',
  'nc':       'Existem 18 NCs abertas, sendo 5 em atraso. As mais críticas: NC-043 (Produção) e NC-045 (Logística). Deseja analisar alguma?',
  'risco':    'Há 8 riscos críticos mapeados. Os principais sem responsável: R-01 (Falha TOTVS) e R-08 (Rastreabilidade). Deseja um plano de mitigação?',
  'venc':     '3 documentos vencem nos próximos 30 dias: POP-012 (07/04), IT-015 (15/04), FRM-003 (28/04). Envio lembretes automáticos?',
  'forn':     'Fornecedor F-012 (Químicos do Sul) está em análise há 15 dias. F-031 (EPI Seguro) foi bloqueado por reprovação. Total: 67 fornecedores ativos.',
  'audit':    'Próxima auditoria interna prevista para Abril/2026. 3 achados pendentes da última auditoria em Logística. Deseja ver o plano de ação?',

  '5s':       'Última auditoria 5S — Mar/2026:\n• Produção: 7.8 ↑\n• Qualidade: 9.1 ↑ (melhor setor)\n• Logística: 7.6 ↑\n• Manutenção: 8.0 ↑\n\nMédia geral: 8.1 — todos os setores evoluíram em relação a Fev/26.',
  'produ':    'Produção — Auditoria 5S Mar/26:\n• Seiri (Utilização): 8\n• Seiton (Organização): 7\n• Seiso (Limpeza): 8\n• Seiketsu (Padronização): 7\n• Shitsuke (Disciplina): 9\nMédia: 7.8 ✅',
  'qualid':   'Qualidade — Auditoria 5S Mar/26:\n• Seiri: 9 | Seiton: 9 | Seiso: 9\n• Seiketsu: 9 | Shitsuke: 10\nMédia: 9.1 🏆 Melhor setor do mês!',
  'logís':    'Logística — Auditoria 5S Mar/26:\n• Seiri: 7 | Seiton: 8 | Seiso: 7\n• Seiketsu: 8 | Shitsuke: 8\nMédia: 7.6 ✅',
  'logis':    'Logística — Auditoria 5S Mar/26:\n• Seiri: 7 | Seiton: 8 | Seiso: 7\n• Seiketsu: 8 | Shitsuke: 8\nMédia: 7.6 ✅',
  'manut':    'Manutenção — Auditoria 5S Mar/26:\n• Seiri: 8 | Seiton: 8 | Seiso: 8\n• Seiketsu: 8 | Shitsuke: 8\nMédia: 8.0 ✅',
  'seiri':    'Seiri (Utilização) — Mar/26:\n• Produção: 8 | Qualidade: 9 | Logística: 7 | Manutenção: 8\nMelhor desempenho: Qualidade. Atenção: Logística com nota 7.',
  'seiton':   'Seiton (Organização) — Mar/26:\n• Produção: 7 | Qualidade: 9 | Logística: 8 | Manutenção: 8\nProdução é o ponto de atenção com nota 7.',
  'seiso':    'Seiso (Limpeza) — Mar/26:\n• Produção: 8 | Qualidade: 9 | Logística: 7 | Manutenção: 8\nLogística precisa de atenção na limpeza (nota 7).',
  'seiketsu': 'Seiketsu (Padronização) — Mar/26:\n• Produção: 7 | Qualidade: 9 | Logística: 8 | Manutenção: 8\nProdução com menor nota em padronização (7).',
  'shitsuke': 'Shitsuke (Disciplina) — Mar/26:\n• Produção: 9 | Qualidade: 10 | Logística: 8 | Manutenção: 8\nExcelente disciplina em todos os setores! Qualidade com nota máxima.',
  'evolu':    'Evolução 5S (últimos 6 meses):\nOut/25 → Mar/26\n• Produção: 6.2 → 7.8 (+1.6) ✅\n• Qualidade: 7.8 → 9.1 (+1.3) ✅\n• Logística: 5.9 → 7.6 (+1.7) ✅\n• Manutenção: 6.8 → 8.0 (+1.2) ✅\nTodos os setores em melhoria contínua!',
  'melhor':   'O melhor setor no 5S de Mar/26 é Qualidade com média 9.1, nota máxima (10) em Shitsuke (Disciplina). Parabéns à equipe!',
  'pior':     'O setor com menor nota no 5S de Mar/26 é Logística com média 7.6, puxada pela limpeza (Seiso: 7) e utilização (Seiri: 7). Recomendo plano de ação.',

  'auditoria':  'Auditorias de Processo — Mar/26:\n• Semana 4 em andamento: 4 auditorias planejadas\n• Produção, Manutenção, Administrativo e Qualidade\n• 2 ainda não executadas esta semana\nDeseja ver os detalhes ou registrar um resultado?',
'aud-001':    'AUD-001 — Produção | Auditoria de Processo | 03/03/26\nResultado: Parcialmente conforme\n• 12 conformidades | 3 NCs | 1 observação\nAchado principal: Controle de temperatura e EPI inadequado.',
'aud-002':    'AUD-002 — Qualidade | Auditoria de Sistema | 05/03/26\nResultado: Conforme ✅\n• 18 conformidades | 1 NC | 2 observações\nAchado: POP-001 desatualizado — já corrigido em 10/03.',
'aud-003':    'AUD-003 — Logística | Auditoria de Processo | 07/03/26\nResultado: Não conforme ⚠️\n• 9 conformidades | 4 NCs | 0 observações\nAchado: Falhas graves na rastreabilidade de lotes expedidos.',
'cronograma': 'Cronograma de auditorias Mar/26:\n• Semana 1: 3 realizadas ✅\n• Semana 2: 2 realizadas ✅ | 1 não realizada ⚠️\n• Semana 3: 3 realizadas ✅\n• Semana 4: 4 planejadas | 0 concluídas ainda\nTotal do mês: 8 realizadas de 13 planejadas.',
'planejamento':'Próximas auditorias planejadas (Semana 4):\n• 24/03 — Produção | Manhã | Igor Bittencourt\n• 25/03 — Manutenção | Tarde | Carlos Mendes\n• 26/03 — Administrativo | Manhã | Ana Ferreira\n• 28/03 — Qualidade | Tarde | Maria Silva',
'nao realiz': 'Auditoria não realizada — Semana 2:\n• RH | Auditoria de Sistema | 14/03/26 | Ana Ferreira\nMotivo não registrado. Recomendo reagendar para a Semana 4.',

'planejamento': 'Planejamento Anual 2026:\n• Progresso geral: 32%\n• Concluídas: 18 atividades\n• Em andamento: 3\n• Atrasadas: 3\n\nCategorias: Treinamentos (38%), Análise de Material (25%), BPF (44%), Auditoria Interna (33%), Externas (10%).',

'treinamento':  'Treinamentos 2026:\n• Jan/Fev: BPF produção ✅ | HACCP ✅ | Segurança ✅\n• Mar: BPF em andamento\n• Próximos: Mai (HACCP), Ago (BPF), Set (HACCP)\nProgresso: 38%',

'bpf':          'Auditoria de BPF 2026:\n• Jan: Produção ✅ | Fev: Produção ✅\n• Mar: sem auditoria BPF planejada\n• Próximas: Abr (Produção), Jul (Produção), Out (Produção)\nProgresso: 44% — melhor categoria do planejamento.',

'iso':          'Renovação ISO 9001:\n• Prevista para Agosto/2026\n• Responsável: Igor Bittencourt\n• Status: Planejado\nRecomendo iniciar preparação em Junho — 2 meses de antecedência.',

'mapa':         'Auditoria MAPA / Vigilância Sanitária:\n• Prevista para Março/2026\n• Status: Em andamento\n• Responsável: Igor Bittencourt\nAtenção: auditoria do mês atual — verificar documentação.',

'atrasad':      'Atividades atrasadas no planejamento:\n• Treinamento de segurança do trabalho — previsto Jan, não concluído\n• BPF Laboratório — previsto Jan, não concluído\n• Auditoria fornecedor — verificar status\nRecomendo priorizar regularização antes do fechamento do trimestre.',

'progresso':    'Progresso do planejamento 2026 (Mar):\n• Treinamentos: 38% ↑\n• Análise de material: 25%\n• Auditoria BPF: 44% ↑ melhor\n• Auditoria interna: 33%\n• Auditorias externas: 10% (maioria no 2º semestre)\nMédia geral: 32%',
}

function getResponse(input) {
  const q = input.toLowerCase()
  for (const [key, val] of Object.entries(responses)) {
    if (q.includes(key)) return val
  }
  return 'Entendido! Posso ajudar com:\n• Documentos — versões, revisões, buscas\n• Não Conformidades — análise, atrasos\n• Gestão de Risco — responsáveis, mitigação\n• Fornecedores — status, avaliações\n• Auditoria 5S — notas por setor e senso, evolução\n\nTente: "5S de março", "nota da produção", "evolução 5S" ou "melhor setor".'
}

const suggestions = [
  'Resultado 5S de março',
  'Nota da produção no 5S',
  'Evolução 5S',
  'Quais NCs estão em atraso?',
  'Melhor setor no 5S',
  'Riscos sem responsável',
  'Cronograma de auditorias',
  'Próximas auditorias da semana',
  'Progresso do planejamento',
  'Atividades atrasadas',
]

export default function Copilot() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(text) {
    const msg = text || input.trim()
    if (!msg) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(msg) }])
    }, 500)
  }

  return (
    <>
      <TopBar system="SGQ" moduleName="Copilot IA" user={{ name: "Igor Bittencourt", role: "Gestão da Qualidade", initials: "IB" }} />
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 120px)', marginTop: 24 }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-[#185FA5] flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Copilot SGQ</p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Documentos · NCs · Riscos · Fornecedores · 5S
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
              m.role === 'user'
                ? 'bg-[#185FA5] text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Pergunte sobre 5S, documentos, NCs, riscos ou fornecedores..."
            className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
          />
          <button
            onClick={() => send()}
            className="bg-[#185FA5] text-white px-4 py-2.5 rounded-xl hover:bg-[#0c447c] transition-colors flex items-center gap-2"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}