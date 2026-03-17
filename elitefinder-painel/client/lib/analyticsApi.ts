const API_BASE = import.meta.env.VITE_ANALYTICS_API_BASE || 'http://localhost:5001';
const N8N_METRICS_ENDPOINT = import.meta.env.VITE_N8N_METRICS_ENDPOINT || 'http://localhost:5000/webhook/api/analytics/metrics';
const N8N_METRICS_EXTENDED_ENDPOINT = import.meta.env.VITE_N8N_METRICS_EXTENDED_ENDPOINT || 'http://localhost:5000/webhook/api/analytics/metrics-extended';

export interface OverallMetricsData {
  total: number;
  avgScore: string | number;
  positivePercent: string | number;
  negativePercent: string | number;
  topAttendant?: string;
}

export interface OverallAnalyticsResponse {
  overallMetrics: OverallMetricsData;
  serviceMetrics: Record<string, any>;
  typeScoreAverages: Record<string, any>;
}

export interface ExtendedOverallMetrics {
  total: number;
  avgHandlingMinutes: number;
  abandonmentPercent: number;
}

export interface ExtendedAnalyticsResponse {
  overallMetrics: ExtendedOverallMetrics;
  typeDistribution: Record<string, number>;
  typeScoreAverages: Record<string, number>;
}

// Fetch overall metrics (avgScore, sentimentos, top attendant)
export async function apiFetchMetricsOverall(timeRange: string = 'MES_ATUAL'): Promise<OverallAnalyticsResponse | null> {
  try {
    const url = new URL(N8N_METRICS_ENDPOINT);
    url.searchParams.append('timeRange', timeRange);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      console.error(`Erro ao buscar metricas overall: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data[0] as OverallAnalyticsResponse;
    if (data.overallMetrics) return data as OverallAnalyticsResponse;
    return null;
  } catch (error) {
    console.error('Erro ao buscar metricas overall:', error);
    return null;
  }
}

// Fetch extended metrics (time, abandonment, distribution)
export async function apiFetchMetricsExtended(timeRange: string = 'MES_ATUAL'): Promise<ExtendedAnalyticsResponse | null> {
  try {
    const url = new URL(N8N_METRICS_EXTENDED_ENDPOINT);
    url.searchParams.append('timeRange', timeRange);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      console.error(`Erro ao buscar metricas extended: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data[0] as ExtendedAnalyticsResponse;
    if (data.overallMetrics) return data as ExtendedAnalyticsResponse;
    return null;
  } catch (error) {
    console.error('Erro ao buscar metricas extended:', error);
    return null;
  }
}

// Backward compat: apiFetchMetrics now fetches extended
export async function apiFetchMetrics(timeRange: string = 'MES_ATUAL'): Promise<ExtendedAnalyticsResponse | null> {
  return apiFetchMetricsExtended(timeRange);
}

export async function apiFetchConversations(limit = 5): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE}/conversas?limit=${limit}`);
    if (!response.ok) throw new Error('Erro ao buscar conversas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    return [];
  }
}

export async function apiProcessAll(limit = 5): Promise<{ total_processados: number; resultados: any[] }> {
  try {
    const response = await fetch(`${API_BASE}/processar-todas-conversas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit })
    });
    if (!response.ok) throw new Error('Erro ao processar conversas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao processar conversas:', error);
    return { total_processados: 0, resultados: [] };
  }
}

export async function apiExportCsv(conversationId: number): Promise<Blob> {
  const response = await fetch(`${API_BASE}/conversas/${conversationId}/csv`);
  if (!response.ok) throw new Error('Erro ao exportar CSV');
  return await response.blob();
}
