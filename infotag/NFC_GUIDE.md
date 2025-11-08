# 📱 Como Usar a Funcionalidade NFC

## 🔧 Requisitos

### Dispositivos Compatíveis
- **Android**: A maioria dos smartphones com Android 10+ e NFC
- **Navegadores**: Chrome, Edge, Samsung Internet
- **iOS**: ⚠️ Infelizmente, o Safari no iOS não suporta Web NFC API ainda

### Permissões Necessárias
- NFC ativado no dispositivo
- Permissão do navegador para acessar NFC
- HTTPS (obrigatório para funcionar em produção)

## 📋 Como Funciona

### 1. **Ativar o Leitor NFC**
   - Clique no botão **"Ativar Leitor NFC"** na página inicial
   - O navegador solicitará permissão para acessar o NFC
   - Autorize o acesso

### 2. **Aproximar a Pulseira**
   - Mantenha a parte traseira do celular próxima à pulseira NFC
   - A leitura é instantânea (1-2 segundos)
   - Você verá uma mensagem de sucesso quando ler

### 3. **Visualizar Dados**
   - Automaticamente redirecionará para a página do paciente
   - Todas as informações médicas serão exibidas

## 🏷️ Como Gravar Pulseiras NFC

### Tags NFC Recomendadas
- **Tipo**: NTAG213, NTAG215 ou NTAG216
- **Memória**: Mínimo 144 bytes
- **Formato**: Circulares ou de pulseira
- **Compatibilidade**: NFC Forum Type 2

### Aplicativos para Gravar
- **Android**: 
  - NFC Tools (Gratuito)
  - TagWriter by NXP
  - NFC TagWriter by NXP

### Passo a Passo para Gravar

1. **Instale um app de gravação NFC** (ex: NFC Tools)

2. **Abra o app e selecione "Escrever"**

3. **Adicione um registro de texto**:
   - Tipo: Texto
   - Conteúdo: `PAC001` (ou o ID do paciente)

4. **Aproxime a tag NFC do celular**

5. **Aguarde a confirmação de gravação**

### Formato de Dados para Produção

Para um sistema real, você pode gravar:
- **URL direta**: `https://infotag.com/patient/PAC001`
- **Apenas ID**: `PAC001` (mais seguro)

## 🔒 Segurança

### Boas Práticas
- ✅ Use HTTPS obrigatoriamente
- ✅ Implemente autenticação de profissionais
- ✅ Criptografe dados sensíveis
- ✅ Registre todos os acessos (logs)
- ✅ Use IDs únicos e não sequenciais
- ✅ Adicione senha/PIN nas tags se possível

### Proteção das Tags
- Bloqueie a gravação após configurar (read-only)
- Use tags com senha para prevenir alterações
- Implemente validação do ID no servidor

## 🧪 Testando NFC

### Em Desenvolvimento (localhost)
```bash
# O NFC só funciona em HTTPS, mas localhost é exceção
npm run dev
# Acesse: http://localhost:3000
```

### Para Testar em Dispositivo Real
1. Use ngrok ou similar para criar um túnel HTTPS:
```bash
npx ngrok http 3000
```

2. Ou faça deploy em:
   - Vercel (automático com HTTPS)
   - Netlify
   - GitHub Pages

## 📱 Alternativas ao NFC

### QR Code (Recomendado para iOS)
- Funciona em todos os dispositivos
- Não requer permissões especiais
- Use bibliotecas como `react-qr-code` ou `qrcode`

### Como Adicionar QR Code
```bash
cd /workspaces/INFOTAG/infotag
npm install qrcode
```

Depois crie um componente para gerar QR Codes com os IDs dos pacientes.

## 🚨 Troubleshooting

### "NFC não suportado"
- Verifique se o dispositivo tem NFC
- Confirme que o NFC está ativado nas configurações
- Use um navegador compatível (Chrome Android)

### "Erro ao ler pulseira"
- Aproxime mais o celular da tag
- Tente diferentes posições
- Verifique se a tag está funcionando
- Confirme que a tag tem dados gravados

### "Permissão negada"
- Recarregue a página
- Limpe as permissões do site
- Autorize novamente

## 📚 Recursos Úteis

- [Web NFC API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API)
- [Can I Use - Web NFC](https://caniuse.com/webnfc)
- [NFC Forum](https://nfc-forum.org/)

---

© 2025 INFOTAG - Sistema de Identificação Médica
