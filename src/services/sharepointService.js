// ── SHAREPOINT SERVICE ────────────────────────────────────────────────────
// Funções de integração com Microsoft Graph API / SharePoint Lists.
// Atualmente rodando em modo MOCK — substitua as implementações quando
// as credenciais do Azure AD estiverem configuradas em src/config/sharepoint.js

import { SHAREPOINT_CONFIG, GRAPH_API_BASE } from '../config/sharepoint'

// ── AUTH (substituir por MSAL quando configurado) ─────────────────────────
async function getToken() {
  // TODO: Implementar com MSAL
  // import { PublicClientApplication } from '@azure/msal-browser'
  // import { MSAL_CONFIG } from '../config/sharepoint'
  // const msalInstance = new PublicClientApplication(MSAL_CONFIG)
  // await msalInstance.initialize()
  // const accounts = msalInstance.getAllAccounts()
  // const result = await msalInstance.acquireTokenSilent({
  //   scopes: SHAREPOINT_CONFIG.scopes,
  //   account: accounts[0],
  // })
  // return result.accessToken
  return 'mock-token'
}

// ── SALVAR ITEM ───────────────────────────────────────────────────────────
export async function salvarItem(listaId, dados) {
  // TODO: substituir pelo fetch real abaixo quando integração ativa
  // const token = await getToken()
  // const siteId = await getSiteId()
  // const res = await fetch(`${GRAPH_API_BASE}/sites/${siteId}/lists/${listaId}/items`, {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ fields: dados }),
  // })
  // if (!res.ok) throw new Error('Erro ao salvar item')
  // return res.json()

  console.log('[SharePoint MOCK] salvarItem:', listaId, dados)
  await new Promise(r => setTimeout(r, 600)) // simula latência
  return { id: Date.now(), ...dados }
}

// ── BUSCAR ITENS ──────────────────────────────────────────────────────────
export async function buscarItens(listaId, filtros = {}) {
  // TODO: const token = await getToken()
  // let url = `${GRAPH_API_BASE}/sites/${siteId}/lists/${listaId}/items?expand=fields`
  // if (filtros.dataInicio) url += `&$filter=fields/Data ge '${filtros.dataInicio}'`
  // if (filtros.dataFim)    url += ` and fields/Data le '${filtros.dataFim}'`
  // const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  // return (await res.json()).value

  console.log('[SharePoint MOCK] buscarItens:', listaId, filtros)
  await new Promise(r => setTimeout(r, 400))
  return []
}

// ── ATUALIZAR ITEM ────────────────────────────────────────────────────────
export async function atualizarItem(listaId, itemId, dados) {
  // TODO: PATCH ${GRAPH_API_BASE}/sites/${siteId}/lists/${listaId}/items/${itemId}/fields
  console.log('[SharePoint MOCK] atualizarItem:', listaId, itemId, dados)
  await new Promise(r => setTimeout(r, 400))
  return { id: itemId, ...dados }
}

// ── DELETAR ITEM ──────────────────────────────────────────────────────────
export async function deletarItem(listaId, itemId) {
  // TODO: DELETE ${GRAPH_API_BASE}/sites/${siteId}/lists/${listaId}/items/${itemId}
  console.log('[SharePoint MOCK] deletarItem:', listaId, itemId)
  await new Promise(r => setTimeout(r, 300))
  return true
}

// ── EXPORTAR PARA CSV (abre no Excel) ────────────────────────────────────
// Gera um arquivo .csv com BOM UTF-8 para compatibilidade com Excel em PT-BR.
// Para exportar .xlsx, instalar: npm install xlsx
// e substituir esta função pela implementação com SheetJS.
export function exportarParaCSV(dados, nomeArquivo = 'relatorio') {
  if (!dados || dados.length === 0) {
    alert('Nenhum registro para exportar no período selecionado.')
    return
  }

  const cabecalhos = Object.keys(dados[0])
  const linhas = dados.map(row =>
    cabecalhos.map(h => {
      const val = row[h] ?? ''
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
      return `"${str.replace(/"/g, '""')}"`
    }).join(';')
  )

  const csv = [cabecalhos.join(';'), ...linhas].join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `${nomeArquivo}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ── BUSCAR ID DO SITE ─────────────────────────────────────────────────────
async function getSiteId() {
  const token = await getToken()
  const hostname = new URL(SHAREPOINT_CONFIG.siteUrl).hostname
  const sitePath = new URL(SHAREPOINT_CONFIG.siteUrl).pathname
  const res = await fetch(
    `${GRAPH_API_BASE}/sites/${hostname}:${sitePath}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.id
}
