const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#4CAF50', // Verde para elementos principais
    secondary: '#2196F3', // Azul para elementos secundários
    success: '#4CAF50', // Verde para sucesso (entradas)
    danger: '#F44336', // Vermelho para perigo (saídas)
    textSecondary: '#666', // Texto secundário (cinza)
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#66BB6A',
    secondary: '#42A5F5',
    success: '#66BB6A',
    danger: '#EF5350',
    textSecondary: '#AAA',
  },
  // Você pode escolher qual tema usar ou implementar a troca de tema
  // Para simplificar, vou usar apenas 'primary', 'success', 'danger', etc. diretamente
  // ou referenciar como Colors.light.primary no exemplo.
  primary: '#4CAF50', // Verde primário
  secondary: '#2196F3', // Azul secundário
  success: '#4CAF50', // Verde para sucesso
  danger: '#F44336', // Vermelho para perigo
  warning: '#FFC107', // Amarelo para atenção
  info: '#03A9F4', // Azul claro para informação
  background: '#F5F5F5', // Fundo de tela geral
  cardBackground: '#FFFFFF', // Fundo para Cards
  textPrimary: '#333333', // Cor principal do texto
  textSecondary: '#666666', // Cor secundária do texto
};