-- Insere os três registos de mensagens na tabela 'mensagens'
-- NOTA: O 'id_mensagem' (SERIAL) é omitido e será gerado automaticamente.
INSERT INTO Mensagem (
    id_atendimento,
    conteudo_texto,
    data_hora_envio,
    remetente_tipo,
    tipo_analise
)
VALUES
    (4, 'Aumentar este campo, talvez o texto venha inteiro...', '2025-09-19 17:54:00', 'Cliente', 'Compra'),
    (5, 'Um, dois, três, PIM...', '2025-09-19 17:54:00', 'Cliente', 'Consulta'),
    (6, 'Vendedor: "Olá [Nome do Cliente]! Tudo bem? Sou a Maria da [Nome da Empresa]. Vi que você demonstrou interesse no nosso novo [Nome do Produto]. Posso te apresentar como ele pode resolver [problema específico do cliente] e facilitar o seu dia a dia?" Cliente: "Olá, Maria! Tudo sim, obrigado. Vi que tem umas funcionalidades interessantes, mas queria saber se ele é compatível com o meu sistema atual. E qual o preço para este modelo?', '2025-09-19 17:54:00', 'Cliente', 'Consulta');