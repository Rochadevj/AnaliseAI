# Elite Finder – Automação Inteligente de Análise e Registro de Atendimentos via WhatsApp

Este projeto é uma solução completa para analisar a qualidade de atendimentos realizados por canais como o WhatsApp. Utilizando um back-end em Python, um banco de dados PostgreSQL e integração com ferramentas de automação, o sistema é capaz de processar conversas, aplicar análises de qualidade baseadas em IA e persistir esses dados para geração de relatórios.

## Índice

* [Sobre o Projeto](#sobre-o-projeto)
* [Funcionalidades](#funcionalidades)
* [Arquitetura da Solução](#arquitetura-da-solução)
* [Pré-requisitos](#pré-requisitos)
* [Instalação e Execução](#instalação-e-execução)
* [Estrutura dos Diretórios](#estrutura-dos-diretórios)
* [Guia de Instalação do Docker Desktop no Windows](#guia-de-instalação-do-docker-desktop-no-windows)
* [Solução de Problemas Comuns](#solução-de-problemas-comuns)

## Sobre o Projeto

O objetivo principal é automatizar a análise de qualidade de interações entre atendentes e clientes. O serviço de back-end WAHA, n8n, API Open AI e PostgreSQL recebe as mensagens de uma conversa, realiza uma análise que usa o modelo GPT-4 a conversa e armazena o resultado de forma estruturada em um banco de dados.

## Funcionalidades

* **Análise de Conversas:** Processamento de mensagens para extrair métricas de qualidade.
* **Persistência de Dados:** Armazenamento dos resultados da análise em um banco de dados PostgreSQL.
* **Ambiente Containerizado:** Todos os serviços são gerenciados pelo Docker, facilitando a configuração e a execução.
* **Integração Flexível:** Projetado para se integrar com plataformas de mensagens (como WhatsApp via WAHA) e ferramentas de workflow (n8n).

## Arquitetura da Solução

A solução é composta por microsserviços que se comunicam dentro de uma rede Docker:

1.  **WAHA / n8n:** Gateway para integração, captura as mensagens do WhatsApp. O n8n processa e formata os dados, enviando-os para o back-end.
2.  **API Open AI (GPT-4):** Recebe os dados da conversa, executa a lógica de análise e salva os resultados no banco de dados.
3.  **PostgreSQL:** Armazena permanentemente os dados dos atendimentos, mensagens e as análises de qualidade.
4.  **pgAdmin:** Interface gráfica para gerenciar o banco de dados, permite o acesso e a administração manual do banco de dados.
5.  **Redis:** Cache de dados e broker de mensagens. Usado para gerenciar filas de análise ou cache, otimizando o desempenho.
6.  **Orquestração de Containers:** Docker e Docker Compose
7.  **n8n:** Ferramenta de automação de workflows, atua na orquestração de todo o serviço. Captura e processa os dados, executa a lógica de IA e se comunica com o banco de dados.
8.  **FRONT X front x front*


## Pré-requisitos

Para executar este projeto, você precisará ter as seguintes ferramentas instaladas em sua máquina:

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)

## Instalação e Execução

Siga os passos abaixo para configurar e iniciar a aplicação. Este modo inicia todos os serviços (WAHA, n8n, PostgreSQL, Frontend, etc.) de uma vez.

1.  **Clone o Repositório**

    ```bash
    git clone <https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Inicie os Serviços com Docker Compose**
    Abra um terminal na raiz do projeto e execute o seguinte comando:

    ```bash
    docker-compose up --build -d
    ```
    * O comando `docker-compose up` irá baixar as imagens necessárias e iniciar todos os containers.
    * A flag `--build` força a reconstrução da imagem local, garantindo que alterações no código ou no `requirements.txt` sejam aplicadas.
    * A flag `-d` (detached mode) executa os containers em segundo plano.

3.  **Verifique se os serviços estão rodando**
    Você pode listar os containers em execução com:
    ```bash
    docker-compose ps
    ```

    Os serviços estarão disponíveis nas seguintes portas locais:
 
    * **PostgreSQL:** `localhost:5432`
    * **pgAdmin 4 (Admin do Banco):** `http://localhost:5050`
    * **n8n:** `http://localhost:5678`
    * **WAHA:** `http://localhost:3000`
    * **Redis:** `localhost:6379`

4.  **Acessando o Banco de Dados com pgAdmin**
    * Acesse `http://localhost:5050`.
    * Faça login com as credenciais definidas no `docker-compose.yml` (padrão: `admin@admin.com` / `admin`).

5.  **Parando a Aplicação**
    Para parar todos os serviços, execute na raiz do projeto:
    ```bash
    docker-compose down
    ```



## Estrutura dos Diretórios

```text
├── SQL/                    # Scripts de inicialização do banco de dados.
│   └── database.sql        # Schema das tabelas, índices e relações.
├── ia_analyzer.py      # Integração do Back-end ao Banco de dados.
├── n8n/                    # Volume para dados do n8n.
├── .gitignore              # Arquivos e diretórios a serem ignorados pelo Git.
├── docker-compose.yml      # Arquivo principal que define e orquestra os serviços.
├── LICENSE                 # Licença do projeto.
├── README.md               # Esta documentação.
└── requirements.txt        # Dependências Python para o serviço ia-analyzer.
```

## Guia de Instalação do Docker Desktop no Windows
O Docker Desktop é a aplicação oficial que permite construir, rodar e gerenciar containers de forma fácil no seu computador.

#### 1. Download do Instalador
Acesse o site oficial do Docker: https://www.docker.com/products/docker-desktop/

Clique no botão de download para "Docker Desktop for Windows".

#### 2. Execute o Instalador
Encontre o arquivo baixado e execute-o como administrador (clique com o botão direito > "Executar como administrador").

#### 3. Configuração da Instalação
Uma janela de instalação aparecerá.

* Importante: Deixe a opção "Use WSL 2 instead of Hyper-V (recommended)" (Usar WSL 2 ao invés de Hyper-V) marcada. Esta é a configuração padrão e recomendada para o melhor desempenho.

Clique em "Ok". O instalador começará a baixar e instalar todos os pacotes necessários.

#### 4. Reinicie o Computador
Ao final da instalação, o Docker Desktop solicitará que você reinicie o computador. Isso é obrigatório para aplicar todas as mudanças no sistema, especialmente as configurações do WSL 2.

Salve seu trabalho e reinicie.

#### 5. Verificando a Instalação
Após o computador reiniciar, o Docker Desktop deve iniciar automaticamente. Um ícone de baleia aparecerá na sua bandeja do sistema (perto do relógio).

* Abra o terminal e verifique a versão:

    ```bash
    docker version
    ``` 
Você deverá ver informações sobre o `Client` e o `Server`, indicando que a comunicação está funcionando.

Rode seu Primeiro Container (Teste Definitivo):

Este é o teste clássico para confirmar que tudo está funcionando:

```bash
docker run hello-world
```
Se tudo estiver correto, você verá a mensagem "Hello from Docker!" no seu terminal.


## Solução de Problemas Comuns
* Erro `WSL 2 installation is incomplete`:

Se o Docker avisar que a instalação do WSL 2 está incompleta, você pode precisar atualizar o kernel dele manualmente.

Abra o PowerShell como Administrador e rode o comando: `wsl --update`

Após a atualização, reinicie o Docker Desktop.

* Virtualização não habilitada:

Se o Docker falhar ao iniciar, reinicie o computador e entre na `BIOS/UEFI` (geralmente pressionando F2, F10 ou Del durante a inicialização).

Procure por configurações chamadas `Virtualization Technology` `Intel VT-x`, `AMD-V` ou `SVM Mode` e garanta que elas estejam `Enabled` (Habilitadas).


