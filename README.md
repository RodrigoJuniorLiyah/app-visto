# 📸 App Visto - Galeria de Fotos Inteligente

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Styled%20Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
</div>

<br>

<div align="center">
  <h3>🎯 Teste Técnico - Desenvolvedor Mobile</h3>
  <p>Uma aplicação moderna de galeria de fotos com recursos avançados de captura, organização e comparação de imagens.</p>
</div>

---

## 🚀 Funcionalidades

### 📱 **Captura Inteligente**
- **Câmera nativa** com alternância entre frontal/traseira
- **Metadados automáticos** (data, hora, localização GPS)
- **Títulos personalizáveis** para cada foto
- **Qualidade otimizada** para armazenamento eficiente

### 🖼️ **Galeria Avançada**
- **Visualização em grid** responsivo
- **Busca inteligente** por título, data ou localização
- **Modo de seleção múltipla** para ações em lote
- **Pull-to-refresh** para atualização de conteúdo
- **Estados vazios** com call-to-action

### 🔍 **Análise e Comparação**
- **Comparação side-by-side** de duas fotos
- **Métricas detalhadas** (diferença de tempo, localização)
- **Navegação contextual** entre fotos relacionadas
- **Tutorial interativo** para novos usuários

### 🎨 **Interface Moderna**
- **Tema claro/escuro** com toggle automático
- **Design responsivo** otimizado para mobile
- **Animações fluidas** e transições suaves
- **Componentes reutilizáveis** e bem estruturados

---

## 🛠️ Tecnologias e Bibliotecas

### **Core Framework**
- **[React Native](https://reactnative.dev/)** - Framework mobile multiplataforma
- **[Expo](https://expo.dev/)** - Plataforma de desenvolvimento e deploy
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript

### **Navegação e Roteamento**
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - Roteamento baseado em arquivos
- **[React Navigation](https://reactnavigation.org/)** - Navegação nativa

### **Estilização**
- **[Styled Components](https://styled-components.com/)** - CSS-in-JS para React Native
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** - Gradientes nativos

### **Funcionalidades Nativas**
- **[Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)** - Captura de fotos
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)** - Geolocalização
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** - Gerenciamento de arquivos
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** - Compartilhamento nativo
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Seleção de imagens

### **UI/UX**
- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** - Safe areas
- **[Expo Vector Icons](https://docs.expo.dev/guides/icons/)** - Ícones nativos
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Animações performáticas

### **Gerenciamento de Estado**
- **React Context API** - Gerenciamento de tema global
- **AsyncStorage** - Persistência de dados locais
- **Singleton Pattern** - Gerenciamento de serviços

---

## 📋 Pré-requisitos

### **Sistema Operacional**
- **Windows 10/11** (recomendado)
- **macOS** (para desenvolvimento iOS)
- **Linux** (Ubuntu 18.04+)

### **Ferramentas Necessárias**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** ([Download](https://git-scm.com/))

### **Para Android**
- **Android Studio** ([Download](https://developer.android.com/studio))
- **Android SDK** (API Level 33+)
- **Emulador Android** ou **Dispositivo físico**

### **Para iOS** (opcional)
- **Xcode** 14+ (apenas no macOS)
- **iOS Simulator** ou **Dispositivo iOS**

---

## 🚀 Como Executar

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/app-visto.git
cd app-visto
```

### **2. Instale as Dependências**
```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### **3. Execute o Projeto**

#### **Opção A: Expo Go (Recomendado - Mais Rápido)**
```bash
npx expo start
```
- Instale o **Expo Go** no seu celular
- Escaneie o QR code que aparece no terminal
- O app abrirá automaticamente no seu dispositivo

#### **Opção B: Emulador Android**
```bash
# Inicie o emulador Android primeiro
npx expo start --android
```

#### **Opção C: Dispositivo Físico**
```bash
# Conecte seu Android via USB
npx expo start --android

# Ou para iOS
npx expo start --ios
```

### **4. Build de Produção**
```bash
# Android APK
npx expo build:android

# iOS (apenas no macOS)
npx expo build:ios
```

---

## 📱 Estrutura do Projeto

```
app-visto/
├── 📁 app/                          # Páginas da aplicação
│   ├── 📁 (tabs)/                   # Navegação por abas
│   │   ├── 📁 Home/                 # Tela inicial
│   │   ├── 📁 Gallery/              # Galeria de fotos
│   │   ├── 📁 Camera/               # Captura de fotos
│   │   ├── 📁 PhotoDetail/          # Detalhes da foto
│   │   └── 📁 PhotoComparison/       # Comparação de fotos
│   └── 📄 _layout.tsx               # Layout raiz
├── 📁 components/                   # Componentes reutilizáveis
│   ├── 📄 ModernHeader.tsx          # Cabeçalho moderno
│   ├── 📄 ThemeToggle.tsx           # Toggle de tema
│   └── 📄 ThemeProvider.tsx         # Provedor de tema
├── 📁 Styles/                       # Estilos organizados
│   ├── 📁 Home/                     # Estilos da Home
│   ├── 📁 Gallery/                  # Estilos da Galeria
│   ├── 📁 Camera/                   # Estilos da Câmera
│   ├── 📁 PhotoDetail/              # Estilos do PhotoDetail
│   └── 📁 PhotoComparison/         # Estilos da Comparação
├── 📁 services/                     # Serviços da aplicação
│   ├── 📄 PhotoStorage.ts           # Gerenciamento de fotos
│   └── 📄 TutorialService.ts        # Serviço de tutorial
├── 📁 contexts/                     # Contextos React
│   └── 📄 ThemeContext.ts           # Contexto de tema
├── 📁 types/                        # Definições TypeScript
│   └── 📄 photo.ts                  # Tipos de foto
└── 📁 constants/                    # Constantes
    └── 📄 theme.ts                  # Configuração de tema
```

---

## 🎨 Arquitetura e Padrões

### **📐 Organização de Código**
- **Separação de responsabilidades** clara
- **Componentes funcionais** com hooks
- **Estilos centralizados** por tela
- **Tipagem TypeScript** completa

### **🎯 Padrões de Design**
- **Singleton Pattern** para serviços
- **Context API** para estado global
- **Custom Hooks** para lógica reutilizável
- **Styled Components** para estilização

### **📱 Responsividade**
- **Design mobile-first**
- **Safe areas** para dispositivos com notch
- **Orientação adaptativa**
- **Touch targets** otimizados

---

## 🔧 Configurações de Performance

### **⚡ Otimizações Aplicadas**
- **Gradle otimizado** (4GB RAM, parallel builds)
- **Metro bundler** configurado
- **Cache inteligente** para builds
- **Bundle splitting** automático

### **📊 Métricas de Performance**
- **Tempo de build**: ~2-3 minutos
- **Hot reload**: <1 segundo
- **Bundle size**: Otimizado
- **Memory usage**: Controlado

---

## 🧪 Testes e Qualidade

### **✅ Checklist de Funcionalidades**
- [x] Captura de fotos com metadados
- [x] Armazenamento local seguro
- [x] Busca e filtros
- [x] Comparação de fotos
- [x] Tema claro/escuro
- [x] Navegação fluida
- [x] Responsividade
- [x] Performance otimizada

### **🔍 Validações**
- **TypeScript** sem erros
- **ESLint** configurado
- **Prettier** para formatação
- **Husky** para pre-commit hooks

---

## 📚 Documentação Adicional

### **🔗 Links Úteis**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Styled Components](https://styled-components.com/docs)

### **📖 Recursos de Aprendizado**
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Mobile Design Patterns](https://material.io/design)

---

## 🤝 Contribuição

Este é um **teste técnico** desenvolvido para demonstrar habilidades em:
- **React Native** e **Expo**
- **TypeScript** e tipagem
- **Arquitetura** de aplicações mobile
- **UI/UX** moderno
- **Performance** e otimização

---

## 📄 Licença

Este projeto foi desenvolvido como **teste técnico** para avaliação de competências em desenvolvimento mobile.

---

<div align="center">
  <p>Desenvolvido com ❤️ usando React Native + Expo</p>
  <p><strong>Teste Técnico - Desenvolvedor Mobile</strong></p>
</div>