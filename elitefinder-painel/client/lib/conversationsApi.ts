const N8N_CONVERSATIONS_EXPORT_ENDPOINT = import.meta.env.VITE_N8N_CONVERSATIONS_EXPORT_ENDPOINT || 'https://n8n.marketsharedigital.com.br/webhook/api/conversations/export';
const N8N_CONVERSATIONS_AUDIT_ENDPOINT = import.meta.env.VITE_N8N_CONVERSATIONS_AUDIT_ENDPOINT || 'https://n8n.marketsharedigital.com.br/webhook/api/conversations/audit';

export interface ExportFilters {
	timeRange?: 'HOJE' | 'MES_ATUAL' | 'ULTIMO_MES' | 'ULTIMOS_6_MESES' | 'PERSONALIZADO';
	sentiment?: 'Todos' | 'Positivo' | 'Neutro' | 'Negativo';
	startDate?: string;
	endDate?: string;
	idAtendimento?: number;
	cliente?: string;
}

export interface AuditFilters {
	timeRange?: 'HOJE' | 'MES_ATUAL' | 'ULTIMO_MES' | 'ULTIMOS_6_MESES' | 'PERSONALIZADO';
	sentiment?: 'Todos' | 'Positivo' | 'Neutro' | 'Negativo';
	tipo?: 'Todos' | 'Dúvida' | 'Reclamação' | 'Suporte Técnico' | 'Vendas';
	search?: string;
	startDate?: string;
	endDate?: string;
	limit?: number;
	offset?: number;
}

export interface AuditConversation {
	id_atendimento: number;
	nome_cliente: string;
	telefone_cliente: string;
	canal_origem: string;
	empresa: string;
	id_atendente: string;
	data_hora: string;
	sentimento_geral: string;
	tipo_atendimento: string;
	pontuacao_geral: number;
	total_mensagens: number;
	venda: boolean;
	mensagem_trecho: string;
	duracao_minutos: number;
}

export interface AuditResponse {
	total: number;
	conversations: AuditConversation[];
}

export async function apiExportConversationsCsv(filters: ExportFilters = {}): Promise<Blob> {
	const url = new URL(N8N_CONVERSATIONS_EXPORT_ENDPOINT);
	if (filters.timeRange) url.searchParams.append('timeRange', filters.timeRange);
	if (filters.sentiment) url.searchParams.append('sentiment', filters.sentiment);
	if (filters.startDate) url.searchParams.append('startDate', filters.startDate);
	if (filters.endDate) url.searchParams.append('endDate', filters.endDate);
	if (typeof filters.idAtendimento === 'number') url.searchParams.append('idAtendimento', String(filters.idAtendimento));
	if (filters.cliente) url.searchParams.append('cliente', filters.cliente);

	const response = await fetch(url.toString(), { method: 'GET' });
	if (!response.ok) throw new Error(`Erro ao exportar CSV (${response.status})`);
	
	// n8n retorna JSON com campo "csv" contendo o texto CSV
	const data = await response.json();
	let csvText = data.csv || '';

	// Adiciona o BOM para o Excel entender UTF-8 e troca vírgula por ponto e vírgula
	csvText = '\uFEFF' + csvText.replace(/,/g, ';');
	
	// Converte o texto CSV para Blob
	return new Blob([csvText], { type: 'text/csv;charset=utf-8' });
}

export async function apiFetchAuditConversations(filters: AuditFilters = {}): Promise<AuditResponse> {
	const url = new URL(N8N_CONVERSATIONS_AUDIT_ENDPOINT);
	if (filters.timeRange) url.searchParams.append('timeRange', filters.timeRange);
	if (filters.sentiment) url.searchParams.append('sentiment', filters.sentiment);
	if (filters.tipo) url.searchParams.append('tipo', filters.tipo);
	if (filters.search) url.searchParams.append('search', filters.search);
	if (filters.startDate) url.searchParams.append('startDate', filters.startDate);
	if (filters.endDate) url.searchParams.append('endDate', filters.endDate);
	if (filters.limit) url.searchParams.append('limit', String(filters.limit));
	if (filters.offset) url.searchParams.append('offset', String(filters.offset));

	const response = await fetch(url.toString(), { method: 'GET' });
	if (!response.ok) throw new Error(`Erro ao buscar auditoria (${response.status})`);
	
	const data = await response.json();
	// n8n retorna um objeto {total, conversations} direto (ou array com 1 objeto)
	if (Array.isArray(data) && data.length > 0) {
		return data[0];
	}
	// Se vier como objeto direto, retorna
	if (data.total !== undefined && data.conversations !== undefined) {
		return data;
	}
	return { total: 0, conversations: [] };
}

// Default export for simpler imports
export default apiExportConversationsCsv;

