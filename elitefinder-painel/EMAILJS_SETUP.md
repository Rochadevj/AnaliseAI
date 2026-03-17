# Configuração do EmailJS para Formulário de Suporte

## Passo 1: Criar conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

## Passo 2: Adicionar serviço de email

1. No dashboard do EmailJS, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha "Gmail" (ou outro provedor)
4. Conecte sua conta: henriquerocha1357@gmail.com
5. Anote o **Service ID** (ex: service_abc123)

## Passo 3: Criar template de email

1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Use este conteúdo:

**Subject:**
```
[Elite Finder Support] {{subject}}
```

**Body:**
```
Nova solicitação de suporte recebida:

Nome: {{from_name}}
Email: {{from_email}}
Assunto: {{subject}}

Mensagem:
{{message}}

---
Enviado através do painel Elite Finder
```

4. Clique em "Save" e anote o **Template ID** (ex: template_xyz789)

## Passo 4: Obter Public Key

1. Vá em "Account" > "General"
2. Copie sua **Public Key** (ex: user_1a2b3c4d5e6f)

## Passo 5: Atualizar código

No arquivo `client/pages/Configuracoes.tsx`, localize estas linhas:

```typescript
service_id: 'service_elitefinder', // SUBSTITUA pelo seu Service ID
template_id: 'template_suporte',   // SUBSTITUA pelo seu Template ID
user_id: 'YOUR_PUBLIC_KEY',        // SUBSTITUA pela sua Public Key
```

E substitua pelos valores que você anotou.

## Exemplo final:

```typescript
service_id: 'service_abc123',
template_id: 'template_xyz789',
user_id: 'user_1a2b3c4d5e6f',
```

## Testando

1. Salve as alterações
2. Acesse a página de Configurações
3. Preencha o formulário de suporte
4. Clique em "Enviar Mensagem"
5. Verifique seu email: henriquerocha1357@gmail.com

## Limites do plano gratuito

- 200 emails/mês
- Perfeito para suporte inicial

## Troubleshooting

Se não receber emails:
1. Verifique a pasta de spam
2. Confirme que as credenciais estão corretas
3. Teste no dashboard do EmailJS primeiro
4. Verifique se o serviço Gmail está conectado

---

Qualquer dúvida, consulte: https://www.emailjs.com/docs/
