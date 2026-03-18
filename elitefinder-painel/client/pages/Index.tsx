import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Gauge, TrendingUp, TrendingDown, Users, CheckCircle, XCircle, Calendar, FileText, Bell, AlertTriangle, X, Clock, BarChart2, Eye } from 'lucide-react';
import Login from './Login';
import logo from '../assets/12597368.png';
import { apiFetchMetricsOverall, apiFetchMetricsExtended, OverallAnalyticsResponse, ExtendedAnalyticsResponse } from '../lib/analyticsApi';
import { apiExportConversationsCsv, apiFetchAuditConversations, AuditConversation } from '../lib/conversationsApi';
import { fetchWahaQrBlob, getWahaSession, logoutWahaSession, startWahaSession, stopWahaSession } from '../lib/wahaApi';

// Dados simulados caso a IA não responda
const mockAnalyticsData = [
  { id: 1, attendant: 'João S.', empresa: 'Tech Solutions Ltda', score: 9.2, sentiment: 'Positivo', type: 'Venda Concluída', message: 'Adorei o atendimento! Muito obrigada pela rapidez e clareza.', timestamp: '2025-10-10', criteria: { saudacao: 'Adequada', empatia: 'Alta', tempo: 'Rápido' } },
  { id: 2, attendant: 'Maria L.', empresa: 'Comércio Brasil S.A', score: 5.5, sentiment: 'Negativo', type: 'Reclamação', message: 'Péssimo! Demorou muito para responder e não resolveu meu problema.', timestamp: '2025-10-11', criteria: { saudacao: 'Ausente', empatia: 'Baixa', tempo: 'Lento' } },
  { id: 3, attendant: 'Pedro H.', empresa: 'Distribuidora Central', score: 8.8, sentiment: 'Neutro', type: 'Dúvida', message: 'Gostaria de saber sobre os preços dos produtos e formas de pagamento.', timestamp: '2025-10-12', criteria: { saudacao: 'Adequada', empatia: 'Moderada', tempo: 'Rápido' } },
  { id: 4, attendant: 'Maria L.', empresa: 'Logística Express', score: 7.1, sentiment: 'Neutro', type: 'Suporte Técnico', message: 'De novo esse sistema falhando? Ridículo! Mas o atendente ajudou.', timestamp: '2025-10-12', criteria: { saudacao: 'Adequada', empatia: 'Moderada', tempo: 'Rápido' } },
  { id: 5, attendant: 'João S.', empresa: 'Varejo Premium', score: 9.8, sentiment: 'Positivo', type: 'Elogio', message: 'Excelente produto! Recomendo para todos. Qualidade incrível.', timestamp: '2025-10-13', criteria: { saudacao: 'Adequada', empatia: 'Alta', tempo: 'Rápido' } },
  { id: 6, attendant: 'Pedro H.', empresa: 'Importadora Global', score: 4.2, sentiment: 'Negativo', type: 'Cancelamento', message: 'Quero cancelar meu pedido. Atendimento muito ruim e demorado.', timestamp: '2025-10-14', criteria: { saudacao: 'Ausente', empatia: 'Baixa', tempo: 'Lento' } },
  { id: 7, attendant: 'Maria L.', empresa: 'Fornecedora Nacional', score: 6.9, sentiment: 'Neutro', type: 'Informação', message: 'Ainda não enviaram meu pedido. Estava nervoso, mas ele resolveu.', timestamp: '2025-10-14', criteria: { saudacao: 'Adequada', empatia: 'Baixa', tempo: 'Razoável' } },
];

export default function Index() {
  // Controle de fluxo (login → waha → dashboard) com persistência
  const [step, setStep] = useState<'login' | 'waha' | 'dashboard'>(() => {
    // Recupera o estado salvo no localStorage
    const savedStep = localStorage.getItem('eliteFinder_sessionStep');
    return (savedStep as 'login' | 'waha' | 'dashboard') || 'login';
  });

  // Salva o step no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('eliteFinder_sessionStep', step);
  }, [step]);

  // Sessão WAHA
  const [connectionStatus, setConnectionStatus] = useState('Aguardando QR Code');
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartStatus, setRestartStatus] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);
  const [lastStatus, setLastStatus] = useState<string>('');
  const [authInProgress, setAuthInProgress] = useState(false);
  const [wahaNumber, setWahaNumber] = useState<string>('N/A');


  // Helper para calcular intervalos de tempo
  const getRangeDates = (range: string) => {
    const today = new Date();
    const format = (d: Date) => d.toISOString().split('T')[0];
    switch (range) {
      case 'HOJE': {
        return { start: format(today), end: format(today) };
      }
      case 'MES_ATUAL': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start: format(start), end: format(end) };
      }
      case 'ULTIMO_MES': {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: format(start), end: format(end) };
      }
      case 'ULTIMOS_6_MESES': {
        const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start: format(start), end: format(end) };
      }
      default: {
        // PERSONALIZADO mantém datas atuais
        return { start: startDate, end: endDate };
      }
    }
  };

  // Dados e filtros
  const [conversations, setConversations] = useState<AuditConversation[]>([]);
  const [conversationsTotal, setConversationsTotal] = useState(0);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState<'HOJE' | 'MES_ATUAL' | 'ULTIMO_MES' | 'ULTIMOS_6_MESES' | 'PERSONALIZADO'>('MES_ATUAL');
  // Inicializa datas conforme intervalo padrão (Mês Atual)
  const initialRange = getRangeDates('MES_ATUAL');
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);

  // Métricas em tempo real do N8N
  const [realMetricsOverall, setRealMetricsOverall] = useState<OverallAnalyticsResponse | null>(null);
  const [realMetricsExtended, setRealMetricsExtended] = useState<ExtendedAnalyticsResponse | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Carrega métricas e conversas do N8N quando o timeRange/filtros mudam
  useEffect(() => {
    const loadMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError(null);
      try {
        const [overall, extended] = await Promise.all([
          apiFetchMetricsOverall(timeRange),
          apiFetchMetricsExtended(timeRange)
        ]);
        
        if (overall) setRealMetricsOverall(overall);
        if (extended) setRealMetricsExtended(extended);
        
        if (!overall && !extended) {
          setMetricsError('Não foi possível carregar as métricas');
        }
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
        setMetricsError('Erro ao conectar com o servidor de métricas');
      } finally {
        setMetricsLoading(false);
      }
    };

    const loadAuditConversations = async () => {
      setConversationsLoading(true);
      try {
        const filters: any = { 
          timeRange, 
          sentiment: filter !== 'Todos' ? filter : undefined,
          search: searchTerm || undefined,
          limit: 100 
        };
        if (timeRange === 'PERSONALIZADO') {
          filters.startDate = startDate;
          filters.endDate = endDate;
        }
        const result = await apiFetchAuditConversations(filters);
        setConversations(result.conversations || []);
        setConversationsTotal(result.total || 0);
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
        setConversations([]);
        setConversationsTotal(0);
      } finally {
        setConversationsLoading(false);
      }
    };

    // Carrega apenas se estiver no dashboard
    if (step === 'dashboard') {
      loadMetrics();
      loadAuditConversations();
    }
  }, [timeRange, filter, searchTerm, startDate, endDate, step]);

  // Atualiza datas quando o intervalo muda (exceto Personalizado)
  useEffect(() => {
    if (timeRange !== 'PERSONALIZADO') {
      const r = getRangeDates(timeRange);
      setStartDate(r.start);
      setEndDate(r.end);
    }
  }, [timeRange]);

  // Sistema de Alertas/Notificações
  const [showAlerts, setShowAlerts] = useState(false);
  const [readAlerts, setReadAlerts] = useState<number[]>([]);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // Palavras-chave negativas para detecção
  const negativeKeywords = ['péssimo', 'ruim', 'problema', 'cancelar', 'ridículo', 'demorou', 'não resolveu', 'falhou', 'nervoso'];

  // Exportar CSV via N8N
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const filters: any = { timeRange, sentiment: filter };
      if (timeRange === 'PERSONALIZADO') {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }
      const blob = await apiExportConversationsCsv(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `conversas_${today}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erro ao exportar CSV:', e);
      alert('Falha ao exportar CSV. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // --- ETAPA 1: LOGIN ---
  // Login agora decide: se já conectado, vai direto ao dashboard; senão, mostra QR (WAHA)
  const startSessionWithFallback = async () => {
    try {
      const { response: res, data } = await startWahaSession();
      if (res.ok) return true;
      // Se já estiver iniciada (422), também é sucesso
      if (res.status === 422) {
        if (data.message?.includes('already started')) return true;
      }
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err);
    }
    return false;
  };

  const handleLogin = async () => {
    setIsCheckingConnection(true);
    setSessionError(null);
    try {
      const { response: res, data } = await getWahaSession();
      if (res.ok) {
        if (data?.status === 'WORKING' || data?.status === 'CONNECTED' || data?.status === 'READY') {
          setConnectionStatus('Ativo');
          setStep('dashboard');
          setIsCheckingConnection(false);
          return;
        }
        if (data?.status === 'STOPPED' || data?.status === 'FAILED') {
          const started = await startSessionWithFallback();
          if (started) {
            await new Promise(r => setTimeout(r, 1200));
            const { response: checkRes, data: checkData } = await getWahaSession();
            if (checkRes.ok) {
              if (checkData?.status === 'WORKING' || checkData?.status === 'CONNECTED' || checkData?.status === 'READY') {
                setConnectionStatus('Ativo');
                setStep('dashboard');
                setIsCheckingConnection(false);
                return;
              }
            }
          } else {
            setSessionError('Falha ao iniciar sessão (422). Gerando QR para nova autenticação.');
          }
        }
      }
    } catch {/* ignora e cai em fallback */}
    // Fallback imediato para tela WAHA + gerar QR
    setIsCheckingConnection(false);
    setAttempts(a => a + 1);
    setStep('waha');
    setConnectionStatus('Aguardando QR Code');
    fetchQR();
  };


  const location = useLocation();
  useEffect(() => {
    // @ts-ignore - location.state pode ser qualquer coisa
    const st = (location as any)?.state;
    if (st?.fromSettings) {
      // Quando voltar das configurações, cair direto no dashboard
      setStep('dashboard');
      return;
    }
    if (st?.forceLogin) {
      // Quando vier da Home pedindo login, forçar tela de login e limpar persistência
      localStorage.removeItem('eliteFinder_sessionStep');
      setStep('login');
    }
  }, [location]);

  // --- ETAPA 2: MONITORAR STATUS DO WAHA ---
  useEffect(() => {
    // Só monitora na tela WAHA; no dashboard não precisa polling
    if (step !== 'waha') return;

    let cancelled = false;
    const fetchStatus = async () => {
      // Enquanto reiniciando ou carregando QR, mantenha o status fixo para evitar flicker
      if (isRestarting || isLoadingQR || isRecovering) {
        if (!cancelled) setConnectionStatus('Aguardando QR Code');
        return;
      }

      try {
        const { response: res, data } = await getWahaSession();
        if (!res.ok) {
          if (!cancelled) setConnectionStatus('Erro ao conectar');
          return;
        }
        const currentStatus = data.status;
        
        // Log apenas quando status muda
        if (currentStatus !== lastStatus && !cancelled) {
          console.log('Status WAHA:', lastStatus, '→', currentStatus);
          setLastStatus(currentStatus);
        }
        
        // Detectar conexão bem-sucedida
        if (currentStatus === 'WORKING') {
          if (!cancelled) {
            console.log('✅ WhatsApp conectado! Redirecionando ao dashboard...');
            setConnectionStatus('Ativo');
            setQrSrc(null);
            setSessionError(null);
            setFailedAttempts(0);
            setAuthInProgress(false);
            // Captura número do WAHA
            if (data.me?.id) {
              const numero = data.me.id.split('@')[0];
              setWahaNumber(numero);
            }
            setStep('dashboard');
          }
        } else if (currentStatus === 'SCAN_QR_CODE') {
          if (!cancelled) {
            setConnectionStatus('Aguardando QR Code');
            setAuthInProgress(false);
          }
        } else if (currentStatus === 'STARTING') {
          if (!cancelled) {
            setConnectionStatus('Iniciando...');
            setAuthInProgress(false);
          }
        } else if (currentStatus === 'PAIRING') {
          // Status de emparelhamento - celular está processando
          if (!cancelled) {
            console.log('📱 Autenticando no celular...');
            setConnectionStatus('Autenticando...');
            setAuthInProgress(true);
            setSessionError(null);
          }
        } else if (currentStatus === 'FAILED') {
          // FALHA DETECTADA - Verificar se não estava em processo de autenticação
          if (!cancelled && !isRecovering) {
            // Se estava em PAIRING antes, pode ser falha legítima de timeout
            const wasAuthenticating = lastStatus === 'PAIRING' || authInProgress;
            
            console.error('❌ Sessão FAILED detectada.');
            console.log('Estava autenticando?', wasAuthenticating);
            
            setConnectionStatus('Falha na conexão');
            setAuthInProgress(false);
            setFailedAttempts(prev => prev + 1);
            
            if (wasAuthenticating) {
              setSessionError('⏱️ Timeout na autenticação. O celular demorou muito. Tente novamente e seja mais rápido ao confirmar.');
            } else {
              setSessionError('A conexão falhou. Gerando novo QR Code automaticamente...');
            }
            
            // Auto-recovery com delay maior para não interferir
            setTimeout(async () => {
              if (cancelled) return;
              setIsRecovering(true);
              
              try {
                console.log('🔄 Iniciando auto-recovery...');
                await stopWahaSession();
                await new Promise(r => setTimeout(r, 2000));
                await startWahaSession();
                await new Promise(r => setTimeout(r, 3000));
                
                setQrSrc(null);
                fetchQR();
              } catch (err) {
                console.error('Erro no auto-recovery:', err);
                setSessionError('Erro ao recuperar sessão. Clique em "Gerar novo QR Code".');
              } finally {
                setIsRecovering(false);
              }
            }, 2000);
          }
        } else if (currentStatus === 'STOPPED') {
          if (!cancelled) {
            setConnectionStatus('Desativado');
            setAuthInProgress(false);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
        if (!cancelled) {
          if (isRestarting || isLoadingQR || isRecovering) {
            setConnectionStatus('Aguardando QR Code');
          } else {
            setConnectionStatus('Erro ao conectar');
          }
        }
      }
    };

    fetchStatus();
    // Polling apenas na tela WAHA (800ms para detectar conexão rápido)
    const interval = setInterval(fetchStatus, 800);
    return () => { cancelled = true; clearInterval(interval); };
  }, [step, isRestarting, isLoadingQR, isRecovering, lastStatus, authInProgress]);


  // Buscar QR Code WAHA quando necessário
  const fetchQR = async () => {
    setIsLoadingQR(true);
    setSessionError(null);
    try {
      const res = await fetchWahaQrBlob();
      if (res.ok) {
        const blob = await res.blob();
        setQrSrc(URL.createObjectURL(blob));
        setIsLoadingQR(false);
        setConnectionStatus('Aguardando QR Code');
        return;
      }
      // Se 422, sessão pode não estar em SCAN_QR_CODE ainda
      if (res.status === 422) {
        setSessionError('Sessão não está pronta para QR. Aguarde alguns segundos e clique em "Gerar QR Code".');
      } else {
        setSessionError(`Erro ao obter QR Code (${res.status}). Verifique o WAHA.`);
      }
    } catch (err) {
      console.error('Erro ao buscar QR:', err);
      setSessionError('Não foi possível conectar ao WAHA. Verifique se está rodando na porta 3000.');
    }
    setIsLoadingQR(false);
  };

  // Gerar QR Code ao clicar no botão
  const handleGenerateQR = () => {
    setQrSrc(null);
    setConnectionStatus('Aguardando QR Code');
    setIsLoadingQR(true);
    fetchQR();
  };
  useEffect(() => {
    if (step === 'waha') {
        if (attempts === 0) {
          const ensureStarted = async () => {
            try {
              const { response: statusRes, data: statusData } = await getWahaSession();
              if (statusRes.ok) {
                console.log('Status inicial da sessão:', statusData.status);
              
              // Se já está WORKING, vai direto pro dashboard
              if (statusData?.status === 'WORKING') {
                setConnectionStatus('Ativo');
                setStep('dashboard');
                return;
              }
              
              // Se está SCAN_QR_CODE, só buscar QR
              if (statusData?.status === 'SCAN_QR_CODE') {
                console.log('Sessão aguardando QR, buscando...');
                fetchQR();
                return;
              }
            }
          } catch (err) {
            console.error('Erro ao verificar status inicial:', err);
          }
          
          // Caso contrário, tenta iniciar a sessão
          console.log('Iniciando sessão WAHA...');
          const started = await startSessionWithFallback();
            if (started) {
              // Aguarda um pouco para a sessão entrar em SCAN_QR_CODE
              setTimeout(async () => {
                try {
                  const { response: checkRes, data: checkData } = await getWahaSession();
                  if (checkRes.ok) {
                    console.log('Status pós-start:', checkData.status);
                  
                  if (checkData?.status === 'WORKING') {
                    setConnectionStatus('Ativo');
                    setStep('dashboard');
                    return;
                  }
                }
              } catch (err) {
                console.error('Erro ao verificar pós-start:', err);
              }
              // Busca QR independente do resultado
              fetchQR();
            }, 2000); // Aumentado para 2s para dar tempo da sessão inicializar
          } else {
            setSessionError('Falha ao iniciar sessão WAHA. Verifique se o serviço está rodando.');
          }
        };
        void ensureStarted();
      }
    }
  }, [step, attempts]);

  // Polling já está verificando status, SSE removido (endpoint dá 404)
  // O polling em useEffect detectará WORKING/CONNECTED e avançará para dashboard


  // Reiniciar sessão WAHA com limpeza de cache e mensagens de status
  const handleRestart = async () => {
    // Sinaliza loading de QR imediatamente e mantém usuário na UI de carregamento
    setIsRestarting(true);
    setIsLoadingQR(true);
    setQrSrc(null);
    setConnectionStatus('Aguardando QR Code');
    setRestartStatus('Desconectando sessão...');
    try {
      // 1. Fazer logout da sessão atual
      await logoutWahaSession();
      setRestartStatus('Aguardando desconexão...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Fazer stop da sessão para limpar cache
      setRestartStatus('Limpando cache da sessão...');
      await stopWahaSession();
      setRestartStatus('Cache limpo. Preparando reconexão...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Iniciar sessão novamente
      setRestartStatus('Reconectando à sessão WAHA...');
      await startWahaSession();

      // 4. Aguardar e buscar novo QR
      setRestartStatus('Buscando novo QR Code...');
      setTimeout(() => {
        setRestartStatus(null);
        // Mantém isRestarting true até o QR terminar de carregar visualmente
        fetchQR().finally(() => {
          setIsRestarting(false);
        });
        setConnectionStatus('Aguardando QR Code');
      }, 800);
    } catch (error) {
      console.error('Erro ao reiniciar sessão:', error);
      setIsRestarting(false);
      setRestartStatus(null);
      alert('Erro ao reiniciar a sessão. Tente novamente.');
    }
  };

  // Encerrar Sessão WAHA
  const handleLogout = async () => {
    try {
      await logoutWahaSession();
      setConnectionStatus('Desativado');
      // Limpa o localStorage ao fazer logout
      localStorage.removeItem('eliteFinder_sessionStep');
      setStep('waha');
    } catch {
      alert('Erro ao encerrar a sessão WAHA.');
    }
  };

  // Métricas
  const overallMetrics = useMemo(() => {
    // Usa dados reais do /api/analytics/metrics quando disponível
    if (realMetricsOverall?.overallMetrics) {
      const m = realMetricsOverall.overallMetrics;
      const avgScoreNum = typeof m.avgScore === 'string' ? parseFloat(m.avgScore) : m.avgScore;
      return {
        avgScore: String(m.avgScore),
        total: m.total ?? 0,
        positivePercent: String(m.positivePercent),
        negativePercent: String(m.negativePercent),
        topAttendant: m.topAttendant || 'N/A',
        trendIcon: avgScoreNum > 7.5 ? TrendingUp : TrendingDown,
        trendColor: avgScoreNum > 7.5 ? 'text-green-500' : 'text-red-500',
      };
    }

    // Fallback para dados reais de conversations
    const filteredByDate = conversations.filter(c => {
      const dt = c.data_hora ? c.data_hora.split('T')[0] : '';
      return dt >= startDate && dt <= endDate;
    });
    const totalMock = filteredByDate.length;
    const avgScoreRaw = totalMock > 0 ? filteredByDate.reduce((sum, c) => sum + Number(c.pontuacao_geral || 0), 0) / totalMock : 0;
    const avgScore = avgScoreRaw.toFixed(1);
    const positiveCount = filteredByDate.filter(c => c.sentimento_geral === 'Positivo').length;
    const negativeCount = filteredByDate.filter(c => c.sentimento_geral === 'Negativo').length;
    const performance = filteredByDate.reduce((acc, curr) => {
      acc[curr.id_atendente] = acc[curr.id_atendente] || { count: 0, totalScore: 0 };
      acc[curr.id_atendente].count++;
      acc[curr.id_atendente].totalScore += Number(curr.pontuacao_geral || 0);
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);
    const topAttendant = Object.entries(performance).sort(
      ([, a], [, b]) =>
        ((b as { count: number; totalScore: number }).totalScore / (b as { count: number; totalScore: number }).count) -
        ((a as { count: number; totalScore: number }).totalScore / (a as { count: number; totalScore: number }).count)
    )[0];

    const base = {
      avgScore,
      total: totalMock,
      positivePercent: totalMock > 0 ? ((positiveCount / totalMock) * 100).toFixed(0) : '0',
      negativePercent: totalMock > 0 ? ((negativeCount / totalMock) * 100).toFixed(0) : '0',
      topAttendant: topAttendant
        ? `${topAttendant[0]} (${((topAttendant[1] as { totalScore: number; count: number }).totalScore / (topAttendant[1] as { totalScore: number; count: number }).count).toFixed(1)})`
        : 'N/A',
      trendIcon: avgScoreRaw > 7.5 ? TrendingUp : TrendingDown,
      trendColor: avgScoreRaw > 7.5 ? 'text-green-500' : 'text-red-500',
    };

    // Se vier total real do N8N extended, substitui o total
    if (realMetricsExtended?.overallMetrics) {
      return { ...base, total: realMetricsExtended.overallMetrics.total ?? base.total };
    }

    return base;
  }, [realMetricsOverall, realMetricsExtended, conversations, startDate, endDate]);

  // Helpers para novas métricas de atendimento
  const getHandlingMinutes = (c: AuditConversation) => {
    // Usa duracao_minutos real se disponível
    return Number(c.duracao_minutos || 0);
  };

  const isAbandoned = (c: AuditConversation) => {
    const msg = (c.mensagem_trecho || '').toLowerCase();
    if (c.tipo_atendimento === 'Cancelamento') return true;
    const negTriggers = ['não resolveu', 'cancelar', 'péssimo', 'ruim', 'demorou', 'insatisfeito'];
    const triggered = negTriggers.some(k => msg.includes(k));
    return c.sentimento_geral === 'Negativo' && (triggered || Number(c.pontuacao_geral || 0) < 6);
  };

  const formatDurationMinutes = (minutes: number) => {
    const mins = Number.isFinite(minutes) ? Math.round(minutes) : 0;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    if (hrs <= 0) return `${mins} min`;
    if (rem === 0) return `${hrs}h`;
    return `${hrs}h ${rem}min`;
  };

  // Métricas de Atendimento (Tempo médio, Abandono, Distribuição por Tipo)
  const serviceMetrics = useMemo(() => {
    if (realMetricsExtended?.overallMetrics) {
      const total = realMetricsExtended.overallMetrics.total ?? 0;
      const avgHandlingMinutes = Math.round(realMetricsExtended.overallMetrics.avgHandlingMinutes ?? 0);
      const abandonmentPercent = Math.round(realMetricsExtended.overallMetrics.abandonmentPercent ?? 0);
      const abandonedCount = Math.round((abandonmentPercent / 100) * total);

      const distEntries = Object.entries(realMetricsExtended.typeDistribution || {});
      const typeDistribution = distEntries
        .map(([type, count]) => ({
          type,
          count,
          percent: total > 0 ? Math.round((Number(count) / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      return { avgHandlingMinutes, abandonedCount, abandonmentPercent, total, typeDistribution };
    }

    const filteredByDate = conversations.filter(c => {
      const dt = c.data_hora ? c.data_hora.split('T')[0] : '';
      return dt >= startDate && dt <= endDate;
    });
    const total = filteredByDate.length;
    const handlingList = filteredByDate.map(getHandlingMinutes);
    const avgHandlingMinutes = handlingList.length > 0
      ? Math.round(handlingList.reduce((a, b) => a + b, 0) / handlingList.length)
      : 0;

    const abandonedCount = filteredByDate.filter(isAbandoned).length;
    const abandonmentPercent = total > 0 ? Math.round((abandonedCount / total) * 100) : 0;

    const typeCounts: Record<string, number> = {};
    filteredByDate.forEach(c => {
      typeCounts[c.tipo_atendimento] = (typeCounts[c.tipo_atendimento] || 0) + 1;
    });
    const typeDistribution = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count, percent: total > 0 ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);

    return { avgHandlingMinutes, abandonedCount, abandonmentPercent, total, typeDistribution };
  }, [realMetricsExtended, conversations, startDate, endDate]);

  // Score médio por tipo de conversa
  const typeScoreAverages = useMemo(() => {
    if (realMetricsExtended?.typeScoreAverages) {
      const distMap = realMetricsExtended.typeDistribution || {};
      return Object.entries(realMetricsExtended.typeScoreAverages)
        .map(([type, avg]) => ({
          type,
          avg: Number(Number(avg).toFixed(1)),
          count: Number(distMap[type] || 0),
        }))
        .sort((a, b) => b.avg - a.avg);
    }

    const filteredByDate = conversations.filter(c => {
      const dt = c.data_hora ? c.data_hora.split('T')[0] : '';
      return dt >= startDate && dt <= endDate;
    });
    const perType: Record<string, { total: number; count: number }> = {};
    filteredByDate.forEach(c => {
      if (!perType[c.tipo_atendimento]) perType[c.tipo_atendimento] = { total: 0, count: 0 };
      perType[c.tipo_atendimento].total += Number(c.pontuacao_geral) || 0;
      perType[c.tipo_atendimento].count += 1;
    });
    return Object.entries(perType)
      .map(([type, v]) => ({ type, avg: Number((v.total / v.count).toFixed(1)), count: v.count }))
      .sort((a, b) => b.avg - a.avg);
  }, [realMetricsExtended, conversations, startDate, endDate]);

  // Conversas já vêm filtradas do endpoint, mas aplicamos filtro de sentimento local se necessário
  // (o endpoint já filtra por data e search)

  // Detectar alertas críticos
  const criticalAlerts = useMemo(() => {
    return conversations
      .map(c => {
        const alerts = [];
        
        // Alerta 1: Score crítico (< 5.0)
        const score = Number(c.pontuacao_geral || 0);
        if (score < 5.0 && score > 0) {
          alerts.push({
            id: c.id_atendimento,
            type: 'score',
            severity: 'high',
            title: 'Score Crítico',
            description: `Score de ${score.toFixed(1)} detectado`,
            conversation: c,
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          });
        }
        
        // Alerta 2: Palavras-chave negativas
        const detectedKeywords = negativeKeywords.filter(keyword => 
          (c.mensagem_trecho || '').toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (detectedKeywords.length > 0) {
          alerts.push({
            id: c.id_atendimento,
            type: 'keyword',
            severity: detectedKeywords.length > 2 ? 'high' : 'medium',
            title: 'Palavras-chave Negativas',
            description: `Detectado: ${detectedKeywords.join(', ')}`,
            conversation: c,
            keywords: detectedKeywords,
            icon: AlertTriangle,
            color: detectedKeywords.length > 2 ? 'text-red-600' : 'text-orange-600',
            bgColor: detectedKeywords.length > 2 ? 'bg-red-50' : 'bg-orange-50',
            borderColor: detectedKeywords.length > 2 ? 'border-red-200' : 'border-orange-200'
          });
        }
        
        // Alerta 3: Sentimento negativo + tipo reclamação/cancelamento
        if (c.sentimento_geral === 'Negativo' && (c.tipo_atendimento === 'Reclamação' || c.tipo_atendimento === 'Cancelamento')) {
          alerts.push({
            id: c.id_atendimento,
            type: 'critical_negative',
            severity: 'high',
            title: 'Reclamação/Cancelamento Detectado',
            description: `${c.tipo_atendimento} com sentimento negativo`,
            conversation: c,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          });
        }
        
        return alerts;
      })
      .flat()
      .sort((a, b) => {
        // Ordenar por severidade e depois por ID
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
      });
  }, [conversations, startDate, endDate, negativeKeywords]);

  // Contar alertas não lidos
  const unreadAlertsCount = criticalAlerts.filter(alert => !readAlerts.includes(alert.id)).length;

  // Marcar alerta como lido
  const markAlertAsRead = (alertId: number) => {
    if (!readAlerts.includes(alertId)) {
      setReadAlerts([...readAlerts, alertId]);
    }
  };

  // Marcar todos como lidos
  const markAllAlertsAsRead = () => {
    setReadAlerts(criticalAlerts.map(alert => alert.id));
  };

  // ===================== TELA 1: LOGIN =====================
  if (step === 'login') {
    // Passa wrapper para aceitar função async sem alterar o tipo do componente Login
    if (isCheckingConnection) {
      return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
          <img src={logo} alt="Logo" className="w-28 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Elite Finder</h1>
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="text-gray-600 text-lg font-medium">Verificando conexão...</p>
            <p className="text-gray-500 text-sm">Aguarde enquanto validamos sua sessão</p>
          </div>
        </div>
      );
    }
    return <Login onLogin={() => { void handleLogin(); }} />;
  }

  // ===================== TELA 2: CONEXÃO WAHA =====================
 if (step === 'waha') {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <img src={logo} alt="Logo" className="w-28 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel WhatsApp - Plataforma de Análise</h1>
      {sessionError && (
        <div className="text-xs mb-4 px-4 py-2 rounded-md bg-red-50 border border-red-200 text-red-600 max-w-md">
          {sessionError}
        </div>
      )}
      
      {failedAttempts > 0 && (
        <div className="text-xs mb-4 px-4 py-2 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 max-w-md">
          ⚠️ Tentativa {failedAttempts} - {failedAttempts >= 3 ? 'Se continuar falhando, verifique: internet do celular estável, WhatsApp atualizado, sem bloqueios de firewall.' : 'Escaneie o QR rapidamente e mantenha o celular com internet estável.'}
        </div>
      )}
      
      {authInProgress && (
        <div className="text-xs mb-4 px-4 py-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700 max-w-md animate-pulse">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="font-semibold">📱 Autenticando no celular...</span>
          </div>
          <p className="mt-1 text-[11px]">Aguarde enquanto o WhatsApp confirma a conexão. Não feche o app!</p>
        </div>
      )}
      
      {/* Modal de Termos de Uso (branding genérico) */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Termos de Uso da Plataforma</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Aceitação dos Termos</h3>
                <p className="text-gray-600 mb-4">Ao utilizar esta plataforma de análise e conectar sua conta WhatsApp Business, você declara que leu, compreendeu e aceita estes termos e a política de privacidade.</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Uso da Plataforma</h3>
                <p className="text-gray-600 mb-4">Ao conectar sua conta, você autoriza nossa plataforma a:</p>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Acessar e analisar conversas de atendimento</li>
                  <li>Processar mensagens via inteligência artificial</li>
                  <li>Gerar relatórios e métricas de qualidade</li>
                  <li>Armazenar dados de forma segura e criptografada</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Privacidade e Segurança</h3>
                <p className="text-gray-600 mb-4">Tratamos os dados conforme a LGPD. Garantimos:</p>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Criptografia nas comunicações</li>
                  <li>Armazenamento seguro</li>
                  <li>Não compartilhamento indevido</li>
                  <li>Direito de solicitar exclusão de dados</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Responsabilidades</h3>
                <p className="text-gray-600 mb-4">Você é responsável por manter a confidencialidade de suas credenciais e pelo uso adequado dos recursos.</p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Modificações</h3>
                <p className="text-gray-600 mb-4">Podemos ajustar estes termos; alterações relevantes serão comunicadas.</p>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Para ler a versão completa, acesse:{' '}
                    <a 
                      href="/termos" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                    >
                      Página Completa de Termos
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                Li e Aceito os Termos
              </button>
            </div>
          </div>
        </div>
      )}

      {connectionStatus === 'Aguardando QR Code' && (

        <div className="text-center">
          {isRecovering && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                <p className="text-sm font-semibold text-yellow-800">Recuperando sessão...</p>
              </div>
              <p className="text-xs text-yellow-600">A conexão anterior falhou. Gerando novo QR Code...</p>
            </div>
          )}
          {qrSrc || isLoadingQR ? (
            <>
              <div className="relative p-4 border rounded-lg shadow mb-6 bg-white mx-auto w-fit">
                {qrSrc ? (
                  <>
                    <img src={qrSrc} alt="QR Code de autenticação" className="h-64 w-64 mx-auto" />
                    {/* Overlay cinza se termos não aceitos */}
                    {!termsAccepted && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 rounded-lg flex flex-col items-center justify-center p-6">
                        <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-2xl">
                          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-gray-800 mb-2">Antes de continuar</h3>
                          <p className="text-sm text-gray-600 mb-4">Por favor, leia e aceite nossos termos de uso para escanear o QR Code</p>
                          <button
                            onClick={() => setShowTermsModal(true)}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                          >
                            Ler Termos de Uso
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-64 w-64 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500 text-sm">Carregando QR Code...</p>
                  </div>
                )}
              </div>
              {termsAccepted ? (
                <p className="text-sm text-gray-600 mb-4">Escaneie o código acima com seu WhatsApp</p>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  Aceite os{' '}
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                  >
                    termos de uso
                  </button>
                  {' '}para escanear o QR Code
                </p>
              )}
              
              {/* Dicas para evitar falhas */}
              {termsAccepted && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl max-w-md mx-auto shadow-sm">
                  <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span> Como escanear corretamente:
                  </p>
                  <ol className="text-xs text-blue-800 space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">1.</span>
                      <span>Abra o <strong>WhatsApp</strong> no celular</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">2.</span>
                      <span>Toque em <strong>⋮ (menu)</strong> → <strong>Aparelhos conectados</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">3.</span>
                      <span>Toque em <strong>"Conectar um aparelho"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">4.</span>
                      <span>Aponte a câmera para o QR Code acima</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">5.</span>
                      <span className="font-semibold text-red-700">Aguarde até aparecer "Conectado" aqui na tela!</span>
                    </li>
                  </ol>
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-[10px] text-yellow-900 font-semibold">
                      ⚠️ IMPORTANTE: Mantenha o celular com internet <strong>estável</strong> durante todo o processo (pode levar 10-30 segundos)
                    </p>
                  </div>
                </div>
              )}
              
              <button
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-400"
                onClick={handleRestart}
                disabled={isRestarting || isRecovering}
              >
                {isRestarting || isRecovering ? 'Gerando novo QR...' : 'Gerar novo QR Code'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-100 mb-4">
                  <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Conectar WhatsApp</h2>
                <p className="text-sm text-gray-600 mb-6">Clique no botão abaixo para gerar o QR Code e conectar sua conta</p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                <button
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-400 font-semibold shadow-lg"
                  onClick={handleGenerateQR}
                  disabled={isLoadingQR}
                >
                  {isLoadingQR ? 'Carregando...' : 'Gerar QR Code'}
                </button>
                <button
                  className="px-8 py-3 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-semibold shadow-sm"
                  onClick={() => {
                    setSessionError(null);
                    setAttempts(0);
                    setQrSrc(null);
                    setConnectionStatus('Aguardando QR Code');
                    void (async () => {
                      const ok = await startSessionWithFallback();
                      if (!ok) {
                        setSessionError('Falha ao iniciar sessão. Verifique o WAHA e tente novamente.');
                      }
                      fetchQR();
                    })();
                  }}
                >
                  Tentar Novamente Conexão
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Mensagens de status específicas removidas; a navegação ocorre automaticamente ao conectar */}
    </div>
  );
}

  // ===================== TELA 3: DASHBOARD =====================
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-3 sm:p-4 md:p-6 lg:p-10">
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Elite Finder - Dashboard de Qualidade</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Análise em tempo real dos atendimentos via WhatsApp Business
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Botão de Alertas/Notificações */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative px-3 sm:px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition duration-150 flex items-center gap-2"
              title="Ver alertas e notificações"
            >
              <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Alertas</span>
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Overlay para mobile */}
            {showAlerts && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                onClick={() => setShowAlerts(false)}
              />
            )}

            {/* Dropdown de Alertas */}
            {showAlerts && (
              <div className="fixed sm:absolute left-0 right-0 sm:left-auto sm:right-0 top-auto sm:top-14 bottom-0 sm:bottom-auto w-full sm:w-96 bg-white sm:rounded-xl rounded-t-3xl shadow-2xl border-t sm:border border-gray-200 z-50 max-h-[85vh] sm:max-h-[500px] overflow-hidden flex flex-col">
                {/* Header do Dropdown */}
                <div className="p-4 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    {/* Drag handle visual para mobile */}
                    <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full absolute top-2 left-1/2 -translate-x-1/2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-base">
                        <Bell className="w-5 h-5 text-indigo-600" />
                        Alertas Críticos
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {unreadAlertsCount > 0 ? `${unreadAlertsCount} não lido(s)` : 'Tudo certo!'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAlerts(false)}
                    className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lista de Alertas */}
                <div className="overflow-y-auto flex-1">
                  {criticalAlerts.length > 0 ? (
                    <>
                      {unreadAlertsCount > 0 && (
                        <div className="p-3 border-b border-gray-100 bg-indigo-50">
                          <button
                            onClick={markAllAlertsAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Marcar todos como lidos
                          </button>
                        </div>
                      )}
                      {criticalAlerts.map((alert, index) => {
                        const isRead = readAlerts.includes(alert.id);
                        const Icon = alert.icon;
                        
                        return (
                          <div
                            key={`${alert.id}-${alert.type}-${index}`}
                            className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer ${
                              !isRead ? 'bg-blue-50/30' : ''
                            }`}
                            onClick={() => {
                              markAlertAsRead(alert.id);
                              // Scroll para a conversa na tabela
                              const element = document.getElementById(`conversation-${alert.conversation.id}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                element.classList.add('ring-2', 'ring-indigo-400', 'ring-offset-2');
                                setTimeout(() => {
                                  element.classList.remove('ring-2', 'ring-indigo-400', 'ring-offset-2');
                                }, 2000);
                              }
                              setShowAlerts(false);
                            }}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className={`p-1.5 sm:p-2 rounded-lg ${alert.bgColor} ${alert.borderColor} border flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${alert.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h4 className={`text-xs sm:text-sm font-semibold ${alert.color} leading-tight`}>
                                    {alert.title}
                                  </h4>
                                  {!isRead && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{alert.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                                  <span className="font-medium truncate">{alert.conversation.attendant}</span>
                                  <span className="text-[10px] sm:text-xs whitespace-nowrap">{alert.conversation.timestamp}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                  "{alert.conversation.message.substring(0, 50)}..."
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700">Nenhum alerta crítico</p>
                      <p className="text-xs text-gray-500 mt-1">Todos os atendimentos estão dentro dos padrões!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/configuracoes"
            className="px-3 sm:px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition duration-150"
            title="Abrir página de configurações"
          >
            <span className="hidden sm:inline">Configurações</span>
            <span className="sm:hidden">Config</span>
          </Link>
          <button
            onClick={handleRestart}
            className="px-3 sm:px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition duration-150"
            disabled={isRestarting}
            title="Limpar cache e reconectar à sessão WAHA (útil para resolver erros de conexão)"
          >
            {isRestarting ? (restartStatus || 'Reiniciando...') : <span className="hidden sm:inline">Limpar Cache e Reiniciar</span>}
            {isRestarting ? (restartStatus || 'Reiniciando...') : <span className="sm:hidden">Reiniciar</span>}
          </button>

          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-red-700 transition duration-150 shadow-sm"
            title="Desconectar e encerrar sessão atual"
          >
            <span className="hidden sm:inline">Encerrar Sessão</span>
            <span className="sm:hidden">Sair</span>
          </button>
        </div>
      </header>

      {/* Status de sincronização - Dados do N8N */}
      {metricsLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-blue-200"></div>
          <span className="text-sm text-blue-700">Sincronizando métricas do servidor...</span>
        </div>
      )}
      {metricsError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700">{metricsError}</span>
        </div>
      )}
      {realMetricsOverall && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">Dados em tempo real do N8N - {new Date().toLocaleTimeString('pt-BR')}</span>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
        {/* Volume Total */}
        <div className="group bg-gradient-to-br from-white to-indigo-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-indigo-100 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-indigo-100 rounded-lg sm:rounded-xl group-hover:bg-indigo-200 transition-colors">
              <FileText className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
            </div>
          </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Volume Total</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">{overallMetrics.total}</h2>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">Período selecionado</p>
        </div>
        <div className="group bg-gradient-to-br from-white to-blue-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-colors ${overallMetrics.trendColor === 'text-green-500' ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-100 group-hover:bg-red-200'}`}>
              <Gauge className={`w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 ${overallMetrics.trendColor}`} />
            </div>
            {overallMetrics.trendIcon && <overallMetrics.trendIcon className={`w-4 sm:w-5 h-4 sm:h-5 ${overallMetrics.trendColor}`} />}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Pontuação Média (IA)</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-1">{overallMetrics.avgScore}</h2>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">{`Total de ${overallMetrics.total} atendimentos`}</p>
        </div>
        <div className="group bg-gradient-to-br from-white to-green-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-green-100 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-green-100 rounded-lg sm:rounded-xl group-hover:bg-green-200 transition-colors">
              <CheckCircle className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">% Sentimento Positivo</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mt-1">{overallMetrics.positivePercent}%</h2>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">Confiabilidade IA: 94%</p>
        </div>
        <div className="group bg-gradient-to-br from-white to-teal-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-teal-100 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-teal-100 rounded-lg sm:rounded-xl group-hover:bg-teal-200 transition-colors">
              <Users className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Melhor Atendente (Score)</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600 mt-1">{overallMetrics.topAttendant.split(' ')[0]}</h2>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">{`Score: ${overallMetrics.topAttendant.split(' ')[1] || 'N/A'}`}</p>
        </div>
        <div className="group bg-gradient-to-br from-white to-red-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-red-100 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-red-100 rounded-lg sm:rounded-xl group-hover:bg-red-200 transition-colors">
              <TrendingDown className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">% Sentimento Negativo</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mt-1">{overallMetrics.negativePercent}%</h2>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">{`${overallMetrics.negativePercent}% negativas`}</p>
        </div>
      </section>

      

      {/* Card de Alertas Críticos - Apenas se houver 3+ alertas e não foi dispensado (acima dos filtros) */}
      {criticalAlerts.length >= 3 && !dismissedBanner && (
        <section className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 rounded-2xl shadow-lg border-l-4 border-red-500 relative">
            {/* Botão Fechar */}
            <button
              onClick={() => setDismissedBanner(true)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 hover:bg-red-100 rounded-lg transition-colors group"
              title="Dispensar este alerta"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-hover:text-red-600" />
            </button>

            <div className="flex flex-col sm:flex-row items-start justify-between pr-8 sm:pr-10 gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-red-100 rounded-xl flex-shrink-0">
                  <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    ⚠️ {criticalAlerts.length} Alerta{criticalAlerts.length > 1 ? 's' : ''} Crítico{criticalAlerts.length > 1 ? 's' : ''} Detectado{criticalAlerts.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    Conversas com score baixo, palavras-chave negativas ou reclamações identificadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {criticalAlerts.filter(a => a.type === 'score').length > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        {criticalAlerts.filter(a => a.type === 'score').length} Score Crítico
                      </span>
                    )}
                    {criticalAlerts.filter(a => a.type === 'keyword').length > 0 && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        {criticalAlerts.filter(a => a.type === 'keyword').length} Palavras Negativas
                      </span>
                    )}
                    {criticalAlerts.filter(a => a.type === 'critical_negative').length > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        {criticalAlerts.filter(a => a.type === 'critical_negative').length} Reclamações/Cancelamentos
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAlerts(true)}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-red-700 transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Bell className="w-4 h-4" />
                Ver Todos
              </button>
            </div>
          </div>
        </section>
      )}


      <section className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Coluna 2-3: Filtros */}
        {/* <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"> */}
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
              <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
            Exportação e Filtros
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Período (KPIs & Tabela)</label>
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value as typeof timeRange)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm transition duration-150 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="HOJE">Hoje</option>
                <option value="MES_ATUAL">Mês Atual</option>
                <option value="ULTIMO_MES">Último Mês</option>
                <option value="ULTIMOS_6_MESES">Últimos 6 Meses</option>
                <option value="PERSONALIZADO">Personalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data Início</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  disabled={timeRange !== 'PERSONALIZADO'}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${timeRange !== 'PERSONALIZADO' ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data Fim</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  disabled={timeRange !== 'PERSONALIZADO'}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${timeRange !== 'PERSONALIZADO' ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Filtro de Sentimento</label>
              <select
                className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm transition duration-150 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Positivo">Positivo</option>
                <option value="Neutro">Neutro</option>
                <option value="Negativo">Negativo</option>
              </select>
            </div>
            <div className="lg:col-span-1">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full px-3 sm:px-4 py-2 ${isExporting ? 'bg-gray-600' : 'bg-gray-800'} text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-900 transition flex items-center justify-center shadow-sm`}
              >
                <FileText className="w-4 h-4 mr-1 sm:mr-2" /> 
                {isExporting ? (
                  <span>Gerando CSV...</span>
                ) : (
                  <>
                    <span className="hidden sm:inline">Exportar ({overallMetrics.total})</span>
                    <span className="sm:hidden">Exportar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Tabela --- */}
      {/* KPIs de Atendimento: Tempo Médio & Abandono (abaixo dos filtros) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Tempo Médio de Atendimento</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">{formatDurationMinutes(serviceMetrics.avgHandlingMinutes)}</h2>
          <p className="text-xs text-gray-400 mt-2">Do primeiro contato à última resposta do atendente</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <XCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Taxa de Abandono</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">{serviceMetrics.abandonmentPercent}%</h2>
          <p className="text-xs text-gray-400 mt-2">{serviceMetrics.abandonedCount} de {serviceMetrics.total} conversas</p>
        </div>
      </section>

      {/* Distribuição + Score Médio por Tipo de Conversa */}
      <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" /> Distribuição e Score Médio por Tipo
          </h3>
          <span className="text-xs text-gray-500">Período selecionado</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Distribuição */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Volume por Tipo</h4>
            {serviceMetrics.typeDistribution.length > 0 ? (
              <div className="space-y-4">
                {serviceMetrics.typeDistribution.map(item => {
                  const colorMap: Record<string, string> = {
                    'Dúvida': 'bg-blue-600',
                    'Informação': 'bg-slate-600',
                    'Venda Concluída': 'bg-emerald-600',
                    'Elogio': 'bg-green-600',
                    'Reclamação': 'bg-red-600',
                    'Cancelamento': 'bg-rose-600',
                    'Suporte Técnico': 'bg-amber-600',
                  };
                  const barColor = colorMap[item.type] || 'bg-gray-400';
                  return (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{item.type}</span>
                        <span className="text-gray-500">{item.count} • {item.percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-2 ${barColor} transition-all duration-300`} style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sem dados no período selecionado.</p>
            )}
          </div>
          {/* Score médio por tipo */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Score Médio por Tipo</h4>
            {typeScoreAverages.length > 0 ? (
              <div className="space-y-3">
                {typeScoreAverages.map(item => (
                  <div key={item.type} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{item.type}</span>
                      <span className="text-[11px] text-gray-500">{item.count} conversa{item.count > 1 ? 's' : ''}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.avg >= 8 ? 'text-green-600' : item.avg >= 6 ? 'text-orange-500' : 'text-red-600'}`}>{item.avg}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sem dados no período selecionado.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-200 pb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Auditoria de Conversas ({conversationsTotal} Encontradas)</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por termo ou atendente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atendente</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Empresa</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Data</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentimento</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Tipo (IA)</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">Mensagem (Trecho)</th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {conversationsLoading ? (
                <tr>
                  <td colSpan={8} className="px-3 sm:px-6 py-10 text-center text-gray-500 text-sm sm:text-base">
                    Carregando conversas...
                  </td>
                </tr>
              ) : conversations.length > 0 ? (
                conversations.map(c => (
                  <tr 
                    key={c.id_atendimento} 
                    id={`conversation-${c.id_atendimento}`}
                    className="hover:bg-gray-50 transition duration-100"
                  >
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{c.id_atendente}</td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 hidden md:table-cell">{c.empresa || 'N/A'}</td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell">
                      {c.data_hora ? new Date(c.data_hora).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900">{Number(c.pontuacao_geral).toFixed(1)}</td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          c.sentimento_geral === 'Positivo'
                            ? 'bg-green-100 text-green-800'
                            : c.sentimento_geral === 'Negativo'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {c.sentimento_geral}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{c.tipo_atendimento}</td>
                    <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-gray-500 max-w-xs truncate hidden xl:table-cell">{c.mensagem_trecho}</td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center text-xs sm:text-sm font-medium">
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition duration-150"
                          onClick={() =>
                            alert(
                              `Detalhes da Conversa ${c.id_atendimento}:\nCliente: ${c.nome_cliente}\nTelefone: ${c.telefone_cliente}\nPontuação: ${c.pontuacao_geral}\nAtendente: ${c.id_atendente}\nDuração: ${c.duracao_minutos.toFixed(1)} min\nMensagens: ${c.total_mensagens}\n\nTrecho: "${c.mensagem_trecho}"`
                            )
                          }
                        >
                          <span className="hidden sm:inline">Detalhes</span>
                          <span className="sm:hidden">Ver</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 sm:px-6 py-10 text-center text-gray-500 text-sm sm:text-base">
                    Nenhuma conversa encontrada no período ou com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        © 2025 Elite Finder. Análise automatizada por Agente IA.
      </footer>
    </div>
  );
}
