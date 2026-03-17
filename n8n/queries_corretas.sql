-- ============================================
-- QUERIES CORRETAS PARA O N8N WORKFLOW
-- Copie e cole no workflow n8n-Melhorias_v4
-- ============================================

-- ====================
-- Query Overall Metrics
-- Node: "Query Overall Metrics1"
-- ====================
SELECT 
  COUNT(*) as total,
  ROUND(AVG(aq.pontuacao_geral)::numeric, 1) as avgScore,
  ROUND(COUNT(CASE WHEN aq.sentimento_geral = 'Positivo' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)::numeric, 1) as positivePercent,
  ROUND(COUNT(CASE WHEN aq.sentimento_geral = 'Negativo' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)::numeric, 1) as negativePercent,
  ROUND(COUNT(CASE WHEN aq.sentimento_geral = 'Neutro' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)::numeric, 1) as neutralPercent
FROM atendimento a
JOIN analisequalidade aq ON a.id_atendimento = aq.id_atendimento
WHERE {{ $json.dateFilter }};


-- ====================
-- Query Top Attendant
-- Node: "Query Top Attendant2"
-- ====================
SELECT 
  a.id_atendente,
  a.nome_cliente as nome_atendente,
  ROUND(AVG(aq.pontuacao_geral)::numeric, 1) as avg_score,
  COUNT(*) as total_atendimentos
FROM atendimento a
JOIN analisequalidade aq ON a.id_atendimento = aq.id_atendimento
WHERE {{ $json.dateFilter }}
GROUP BY a.id_atendente, a.nome_cliente
ORDER BY avg_score DESC
LIMIT 1;


-- ====================
-- Query Service Metrics
-- Node: "Query Service Metrics2"
-- ====================
SELECT 
  ROUND(AVG(EXTRACT(EPOCH FROM (a.data_hora_fim - a.data_hora_inicio)) / 60)::numeric, 1) as avgHandlingMinutes,
  COUNT(CASE WHEN a.status_atendimento = 'Abandonado' THEN 1 END) as abandonedCount,
  COUNT(*) as totalCount,
  ROUND(COUNT(CASE WHEN a.status_atendimento = 'Abandonado' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)::numeric, 1) as abandonmentPercent,
  COUNT(CASE WHEN aq.tipo_atendimento = 'Dúvida' THEN 1 END) as duvida_count,
  COUNT(CASE WHEN aq.tipo_atendimento = 'Reclamação' THEN 1 END) as reclamacao_count,
  COUNT(CASE WHEN aq.tipo_atendimento = 'Suporte Técnico' THEN 1 END) as suporte_count,
  COUNT(CASE WHEN aq.tipo_atendimento = 'Vendas' THEN 1 END) as vendas_count
FROM atendimento a
JOIN analisequalidade aq ON a.id_atendimento = aq.id_atendimento
WHERE {{ $json.dateFilter }};


-- ====================
-- Query Type Averages
-- Node: "Query Type Averages2"
-- ====================
SELECT 
  aq.tipo_atendimento,
  ROUND(AVG(aq.pontuacao_geral)::numeric, 1) as avg_score,
  COUNT(*) as total_count
FROM atendimento a
JOIN analisequalidade aq ON a.id_atendimento = aq.id_atendimento
WHERE {{ $json.dateFilter }}
GROUP BY aq.tipo_atendimento
ORDER BY avg_score DESC;


-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. A tabela é "analisequalidade" (tudo junto, minúsculo)
-- 2. A coluna de relacionamento é "id_atendimento" (não "id")
-- 3. Sempre usar JOIN para garantir apenas atendimentos COM análise
-- 4. NULLIF previne divisão por zero
-- 5. O filtro de data vem do node "Build Date Filter2"
-- ============================================
