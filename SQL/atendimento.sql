-- Insere os quatro registos de atendimento na tabela.
INSERT INTO atendimentos (
    data_hora_inicio,
    data_hora_fim,
    canal_origem,
    id_cliente,
    id_atendente,
    status_atendimento,
    nome_cliente,
    telefone_cliente
)
VALUES
    ('2025-09-15 10:00:00', '2025-09-15 10:30:00', 'WhatsApp', 1, 101, 'Encerrado', 'Joao', '+555199256965'),
    ('2025-09-15 10:00:00', '2025-09-15 10:30:00', 'WhatsApp', 2, 102, 'Encerrado', 'Maria', '+555199255825'),
    ('2025-09-15 10:00:00', '2025-09-15 10:30:00', 'WhatsApp', 3, 101, 'Encerrado', 'Tiago', '+555199252585'),
    ('2025-09-19 16:00:00', '2025-09-19 17:00:00', 'WhatsApp', 4, 104, 'Encerrado', 'Moises', '+555199224415');
