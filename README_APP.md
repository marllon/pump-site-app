# 🩺 Controle de Cateter - Bomba de Insulina

Aplicativo móvel para iOS desenvolvido em React Native que ajuda pacientes diabéticos a gerenciar a rotação dos locais de aplicação do cateter da bomba de insulina.

## ✨ Funcionalidades

- **📍 Rastreamento de Localizações**: 8 zonas corporais (abdômen, pernas, glúteos, lombar)
- **🧠 Sugestão Inteligente**: Algoritmo que sugere a próxima localização ideal baseado no histórico
- **📊 Histórico Completo**: Acompanhamento detalhado de todas as aplicações
- **📈 Estatísticas**: Análise de uso por localização e intervalos médios
- **📝 Observações**: Adicione notas personalizadas a cada aplicação
- **📤 Exportação**: Compartilhe dados para consultas médicas
- **💾 Armazenamento Local**: Todos os dados ficam no seu dispositivo

## 🎯 Zonas de Aplicação

O aplicativo permite registrar aplicações nas seguintes localizações:

- **Abdômen**: Esquerdo e Direito
- **Pernas**: Esquerda e Direita  
- **Glúteos**: Esquerdo e Direito
- **Lombar**: Esquerdo e Direito

## 🧬 Algoritmo de Sugestão

O sistema usa um algoritmo inteligente que considera:

1. **Evita repetições**: Nunca sugere a mesma localização da última aplicação
2. **Rotação de zonas**: Prioriza zonas diferentes da anterior
3. **Alternância de lados**: Alterna entre esquerdo e direito
4. **Histórico recente**: Analisa os últimos 30 dias de uso
5. **Balanceamento**: Prioriza localizações menos utilizadas

## 🚀 Instalação e Configuração

### Pré-requisitos

Certifique-se de ter o ambiente React Native configurado:

- [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup)
- Node.js (versão 16 ou superior)
- Xcode (para iOS)
- Android Studio (para Android)

### Instalação

1. **Clone o repositório** (ou baixe o projeto)
```bash
git clone [url-do-repositorio]
cd app-cateter
```

2. **Instale as dependências**
```bash
npm install
```

3. **Para iOS, instale os pods**
```bash
cd ios && pod install && cd ..
```

### Executando o Aplicativo

1. **Inicie o Metro Server**
```bash
npm start
```

2. **Execute no dispositivo/emulador**

Para iOS:
```bash
npm run ios
```

Para Android:
```bash
npm run android
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   └── BodyMap.tsx      # Mapa corporal interativo
├── screens/             # Telas do aplicativo
│   ├── HomeScreen.tsx   # Tela principal
│   └── HistoryScreen.tsx # Histórico e estatísticas
├── types/               # Definições TypeScript
│   └── index.ts         # Tipos e constantes
└── utils/               # Utilitários
    ├── storage.ts       # Gerenciamento de dados
    └── suggestion.ts    # Algoritmo de sugestão
```

## 📱 Como Usar

### Primeira Aplicação
1. Abra o aplicativo
2. O sistema sugerirá "Abdômen Esquerdo" como primeira localização
3. Selecione a localização desejada no mapa corporal
4. Adicione observações (opcional)
5. Toque em "✅ Aplicar Cateter"

### Aplicações Subsequentes  
1. O app mostrará automaticamente a sugestão baseada no seu histórico
2. A sugestão aparece destacada em laranja
3. Você pode aceitar a sugestão ou escolher outra localização
4. O histórico é atualizado automaticamente

### Visualizar Histórico
1. Toque em "📊 Ver Histórico Completo"
2. Visualize todas as aplicações anteriores
3. Consulte estatísticas de uso por localização
4. Exporte dados para compartilhar com seu médico

## 🔒 Privacidade e Segurança

- **Armazenamento Local**: Todos os dados ficam apenas no seu dispositivo
- **Sem Internet**: O app funciona completamente offline
- **Sem Coleta de Dados**: Nenhuma informação é enviada para servidores externos
- **Controle Total**: Você pode exportar ou limpar seus dados a qualquer momento

## 🩺 Para Profissionais de Saúde

O aplicativo gera relatórios que podem ser exportados e compartilhados durante consultas médicas, incluindo:

- Histórico completo de aplicações com datas e horários
- Estatísticas de uso por localização corporal  
- Intervalos médios entre trocas de cateter
- Observações específicas de cada aplicação
- Dados em formato JSON para análise técnica

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Executar no iOS
npm run ios

# Executar no Android  
npm run android

# Iniciar Metro
npm start

# Executar testes
npm test

# Verificar lint
npm run lint
```

### Tecnologias Utilizadas

- **React Native 0.82.1**: Framework principal
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **AsyncStorage**: Armazenamento local
- **React Native Vector Icons**: Ícones

## 📋 Requisitos do Sistema

### iOS
- iOS 13.0 ou superior
- iPhone compatível

### Android  
- Android API Level 21 (Android 5.0) ou superior
- Dispositivo Android compatível

## 🆘 Suporte e Troubleshooting

### Problemas Comuns

1. **Erro ao executar no iOS**: Certifique-se de que os pods estão instalados
2. **Erro no Android**: Verifique se o emulador está rodando
3. **Dados não salvam**: Verifique as permissões de armazenamento

### Limpeza de Cache

```bash
# Limpar cache do Metro
npm start -- --reset-cache

# Limpar build Android
cd android && ./gradlew clean && cd ..

# Reinstalar dependências
rm -rf node_modules && npm install
```

## 🤝 Contribuições

Este é um projeto de código aberto voltado para a comunidade diabética. Sugestões e melhorias são bem-vindas!

## ⚕️ Aviso Médico

Este aplicativo é uma ferramenta de auxílio para o controle pessoal e **não substitui a orientação médica profissional**. Sempre consulte seu endocrinologista para orientações sobre o uso da bomba de insulina e rotação de cateter.

---

**Desenvolvido com ❤️ para a comunidade diabética**