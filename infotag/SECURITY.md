# 🔒 Sistema de Segurança e Auditoria - INFOTAG

## 📋 Visão Geral

O sistema INFOTAG agora possui um robusto sistema de segurança e auditoria que garante:

- ✅ **Autenticação obrigatória** para cada acesso
- ✅ **Registro de todos os acessos** (logs de auditoria)
- ✅ **Bloqueio de navegação** entre pacientes
- ✅ **Sessões com expiração** automática
- ✅ **Rastreabilidade completa** de quem acessou o quê

## 🛡️ Recursos de Segurança

### 1. **Autenticação Obrigatória**

Cada vez que um profissional tenta acessar um prontuário, deve fornecer:

- **Nome Completo**: Identificação do profissional
- **Justificativa**: Motivo do acesso (ex: "Atendimento emergencial SAMU")

```typescript
// Exemplo de autenticação
authenticate(patientId, justification, professionalName)
```

### 2. **Controle de Sessão**

- Uma sessão permite acesso a **apenas um paciente por vez**
- **Impossível** navegar para outro paciente sem nova autenticação
- Sessão expira automaticamente em **30 minutos**
- Botão de logout força o término da sessão

### 3. **Logs de Auditoria**

Todos os acessos são registrados com:

```json
{
  "patientId": "PAC001",
  "timestamp": "2025-11-08T14:30:00Z",
  "professionalName": "Dr. João Silva",
  "justification": "Atendimento de emergência - SAMU"
}
```

Os logs são salvos em `localStorage` e podem ser exportados.

### 4. **Tela de Acesso Negado**

Se alguém tentar acessar um paciente sem autenticação:
- ❌ Acesso é **bloqueado imediatamente**
- ⚠️ Mensagem de segurança é exibida
- 🔄 Redirecionamento automático para página inicial

## 📊 Página de Auditoria

Acesse: `/audit`

### Credenciais de Administrador (Demo):
- **Senha**: `admin123`

### Recursos da Página:
- 📋 Lista completa de acessos
- 🕐 Data e hora de cada acesso
- 👨‍⚕️ Nome do profissional
- 📝 Justificativa fornecida
- 🔢 Contador total de acessos

## 🔐 Como Funciona

### Fluxo de Acesso Seguro:

```
1. Usuário tenta acessar paciente
   ↓
2. Modal de autenticação aparece
   ↓
3. Preenche nome + justificativa
   ↓
4. Sistema registra no log
   ↓
5. Cria sessão única para este paciente
   ↓
6. Permite visualização dos dados
   ↓
7. Ao sair, sessão é destruída
```

### Bloqueios Implementados:

❌ **Não é possível:**
- Acessar outro paciente sem nova autenticação
- Voltar ao histórico do navegador e ver outro paciente
- Copiar/compartilhar URL para terceiros acessarem
- Acessar dados sem deixar rastro no log

✅ **É possível:**
- Ver os dados apenas do paciente autenticado
- Fazer logout a qualquer momento
- Administradores verem todos os logs

## 🚨 Avisos de Segurança

### Na Tela de Acesso:
```
⚠️ ACESSO AUDITADO E REGISTRADO
Este acesso será registrado para fins de auditoria e segurança.
Uso indevido será investigado.
```

### Na Tela do Paciente:
- Banner amarelo com aviso de auditoria
- Nome do profissional sempre visível
- Botão de logout destacado

## 📱 Integração com NFC

A autenticação também funciona com NFC:

1. Aproxima pulseira NFC
2. Sistema lê o ID
3. **Modal de autenticação aparece**
4. Profissional preenche dados
5. Acesso liberado

## 🔧 Configurações de Segurança

### Tempo de Sessão
```typescript
// Configurado em: contexts/AuthContext.tsx
setTimeout(() => {
  logout();
}, 30 * 60 * 1000); // 30 minutos
```

### Storage dos Logs
```typescript
localStorage.setItem('infotag_access_logs', JSON.stringify(logs));
```

## 📈 Melhorias Recomendadas para Produção

### Obrigatório:
1. ✅ Backend real com banco de dados
2. ✅ Autenticação com JWT ou OAuth
3. ✅ Criptografia de dados sensíveis
4. ✅ HTTPS obrigatório
5. ✅ Rate limiting
6. ✅ Backup automático de logs
7. ✅ Alertas de acessos suspeitos

### Recomendado:
- 🔐 Autenticação de dois fatores (2FA)
- 📧 Notificação por email de acessos
- 🎫 Sistema de credenciais profissionais
- 📱 Biometria no mobile
- 🔍 Análise de padrões de acesso
- 🚫 Blacklist de IPs suspeitos

## 🧪 Testando a Segurança

### Teste 1: Acesso Direto Bloqueado
```
1. Acesse: http://localhost:3000/patient/PAC001
2. Resultado: Tela de "Acesso Negado"
```

### Teste 2: Navegação Bloqueada
```
1. Faça login em PAC001
2. Tente acessar PAC002 pela URL
3. Resultado: Tela de "Acesso Negado"
```

### Teste 3: Logs Registrados
```
1. Faça login em um paciente
2. Acesse /audit com senha: admin123
3. Veja seu acesso registrado
```

### Teste 4: Sessão Expira
```
1. Faça login
2. Aguarde 30 minutos
3. Sessão será destruída automaticamente
```

## 📊 Visualizando Logs

### Via Interface Web:
1. Vá para `/audit`
2. Digite senha: `admin123`
3. Veja todos os acessos

### Via Console do Navegador:
```javascript
// Ver logs salvos
const logs = JSON.parse(localStorage.getItem('infotag_access_logs'));
console.table(logs);
```

### Exportar Logs:
```javascript
// Copiar para clipboard
const logs = localStorage.getItem('infotag_access_logs');
navigator.clipboard.writeText(logs);
```

## ⚖️ Aspectos Legais

### LGPD Compliance:
- ✅ Rastreabilidade de acessos
- ✅ Justificativa obrigatória
- ✅ Identificação do profissional
- ✅ Logs com timestamp
- ⚠️ Implementar: Consentimento do paciente
- ⚠️ Implementar: Direito ao esquecimento

### Regulamentações Médicas:
- CFM: Prontuário eletrônico
- SBIS: Certificação de sistemas
- ICP-Brasil: Assinatura digital

## 🆘 Troubleshooting

### "Acesso Negado" inesperado?
- Verifique se fez logout acidental
- Limpe o cache do navegador
- Refaça a autenticação

### Logs não aparecem?
- Verifique `localStorage` do navegador
- Não use modo anônimo
- Verifique permissões de storage

### Sessão expira muito rápido?
- Ajuste o timeout em `AuthContext.tsx`
- Padrão: 30 minutos

## 📞 Suporte

Para questões de segurança:
- 🔒 **Email**: security@infotag.com
- 📱 **Emergência**: 0800-INFOTAG
- 🐛 **Bugs**: GitHub Issues

---

© 2025 INFOTAG - Sistema Seguro de Identificação Médica 🔒
