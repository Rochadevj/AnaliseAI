-- SCRIPT DE INCLUSÃO DOS DADOS (DML - Data Manipulation Language)
-- Insere uma nova linha na tabela 'analises_atendimento'.
-- NOTA: O 'id_analise' (que é SERIAL) é omitido, e o PostgreSQL
-- irá atribuir o próximo valor sequencial (ex: 1, 2, 3...).
INSERT INTO analises_atendimento (
    id_atendimento,
    saudacao_inicial,
    uso_nome_cliente,
    rapport_empatia,
    uso_emojis,
    tom_conversa,
    erros_gramaticais,
    resolutividade,
    tempo_resposta,
    indicios_venda,
    sentimento_geral,
    tipo_atendimento,
    pontuacao_geral,
    observacoes,
    data_analise
)
VALUES (
    4,
    'NÃO',
    'NÃO',
    'MEDIA',
    'ADEQUADO',
    'NEUTRO',
    'NENHUM',
    'MEDIA',
    'ADEQUADO',
    'NÃO',
    'NEUTRO',
    'OUTROS',
    50,
    'Análise não disponível - modo teste',
    '2025-09-20 09:00:00'
);
