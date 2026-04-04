// ── CONFIGURAÇÃO SHAREPOINT / MICROSOFT GRAPH API ─────────────────────────
// Preencha as variáveis abaixo antes de ativar a integração com SharePoint.
// As credenciais são geradas no Azure Active Directory (portal.azure.com).

export const SHAREPOINT_CONFIG = {
  tenantId:  'SEU_TENANT_ID',   // ID do tenant no Azure AD
  clientId:  'SEU_CLIENT_ID',   // ID do aplicativo registrado no Azure AD
  siteUrl:   'https://suaempresa.sharepoint.com/sites/qualidade',

  // IDs das listas no SharePoint (obter após criar as listas)
  listas: {
    apontamentoSelecao:    'ID_LISTA_APONTAMENTO_SELECAO',
    estoqueSelecao:        'ID_LISTA_ESTOQUE_SELECAO',
    movEstoque:            'ID_LISTA_MOVIMENTACOES_ESTOQUE',
    inspecaoLitografia:    'ID_LISTA_INSPECAO_LITOGRAFIA',
    inspecaoEnvernizadeira:'ID_LISTA_INSPECAO_ENVERNIZADEIRA',
    liberacaoCarga:        'ID_LISTA_LIBERACAO_CARGA',
    fardoRetido:           'ID_LISTA_FARDO_RETIDO',
  },

  // Escopos de permissão necessários
  scopes: [
    'https://graph.microsoft.com/Sites.ReadWrite.All',
    'https://graph.microsoft.com/Files.ReadWrite.All',
  ],
}

export const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0'

// ── MSAL CONFIG (Microsoft Authentication Library) ────────────────────────
// Instalar: npm install @azure/msal-browser @azure/msal-react
export const MSAL_CONFIG = {
  auth: {
    clientId:    SHAREPOINT_CONFIG.clientId,
    authority:   `https://login.microsoftonline.com/${SHAREPOINT_CONFIG.tenantId}`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage' },
}
