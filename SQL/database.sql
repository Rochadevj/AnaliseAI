CREATE TABLE Atendimento (
    id_atendimento SERIAL PRIMARY KEY,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP,
    canal_origem VARCHAR(100),
    id_cliente INTEGER NOT NULL,
    id_atendente INTEGER NOT NULL,
    status_atendimento VARCHAR(50),
    nome_cliente VARCHAR(100) NOT NULL,
    telefone_cliente VARCHAR(20)
);

CREATE INDEX idx_atendimento_cliente ON Atendimento(id_cliente);
CREATE INDEX idx_atendimento_atendente ON Atendimento(id_atendente);
CREATE INDEX idx_atendimento_status ON Atendimento(status_atendimento);

CREATE TABLE Mensagem (
    id_mensagem SERIAL PRIMARY KEY,
    id_atendimento INTEGER NOT NULL,
    conteudo_texto TEXT NOT NULL,
    data_hora_envio TIMESTAMP NOT NULL,
    remetente_tipo VARCHAR(50) NOT NULL,
    tipo_analise VARCHAR(50),
    CONSTRAINT fk_mensagem_atendimento FOREIGN KEY (id_atendimento) 
      REFERENCES Atendimento (id_atendimento) ON DELETE CASCADE
);

CREATE INDEX idx_mensagem_idatendimento ON Mensagem(id_atendimento);
CREATE INDEX idx_mensagem_datahora ON Mensagem(data_hora_envio);

CREATE TABLE AnaliseQualidade (
    id_analise SERIAL PRIMARY KEY,
    id_atendimento INTEGER NOT NULL,
    saudacao_inicial VARCHAR(10) NOT NULL,
    uso_nome_cliente VARCHAR(10) NOT NULL,
    rapport_empatia VARCHAR(50) NOT NULL,
    uso_emojis VARCHAR(50) NOT NULL,
    tom_conversa VARCHAR(50) NOT NULL,
    erros_gramaticais VARCHAR(50) NOT NULL,
    resolutividade VARCHAR(50) NOT NULL,
    tempo_resposta VARCHAR(50) NOT NULL,
    indicios_venda VARCHAR(10) NOT NULL,
    sentimento_geral VARCHAR(50) NOT NULL,
    tipo_atendimento VARCHAR(50) NOT NULL,
    pontuacao_geral INTEGER NOT NULL,
    observacoes TEXT,
    data_analise TIMESTAMP NOT NULL,
    CONSTRAINT fk_analise_atendimento FOREIGN KEY (id_atendimento)
      REFERENCES Atendimento (id_atendimento) ON DELETE CASCADE 
);



CREATE INDEX idx_analise_idatendimento ON AnaliseQualidade(id_atendimento);
CREATE INDEX idx_analise_dataanalise ON AnaliseQualidade(data_analise);

CREATE TABLE Relatorio (
    id_relatorio SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    data_geracao TIMESTAMP NOT NULL,
    periodo_analise VARCHAR(100)
);

CREATE INDEX idx_relatorio_data ON Relatorio(data_geracao);

CREATE TABLE RelatorioAnalise (
    id_relatorio INT NOT NULL,
    id_analise INT NOT NULL,
    CONSTRAINT pk_relatorioanalise PRIMARY KEY (id_relatorio, id_analise),
    CONSTRAINT fk_relatorioanalise_relatorio FOREIGN KEY (id_relatorio) 
      REFERENCES Relatorio (id_relatorio) ON DELETE CASCADE,
    CONSTRAINT fk_relatorioanalise_analise FOREIGN KEY (id_analise)
      REFERENCES AnaliseQualidade (id_analise) ON DELETE CASCADE
);
	
CREATE INDEX idx_relatorioanalise_analise ON RelatorioAnalise(id_analise);