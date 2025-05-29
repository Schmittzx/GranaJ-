import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper'; // Importe os componentes do Paper
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors'; // Importe suas cores
import { useTransactions } from '../../data/TransactionContext'; // Importe o hook do seu contexto

const HomeScreen: React.FC = () => {
  const { getBalance, loading } = useTransactions(); // Use o hook para acessar a função de saldo e o estado de loading
  const { totalEntries, totalExits, currentBalance } = getBalance(); // Obtenha os valores do saldo

  // Definir a cor do saldo com base no valor
  const balanceColor = currentBalance >= 0 ? Colors.success : Colors.danger;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados financeiros...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Title style={styles.header}>Resumo Financeiro</Title>

        {/* Card de Saldo Atual */}
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Paragraph style={styles.cardLabel}>Saldo Atual</Paragraph>
            <Title style={[styles.balanceValue, { color: balanceColor }]}>
              R$ {currentBalance.toFixed(2).replace('.', ',')} {/* Formato R$ com vírgula */}
            </Title>
          </Card.Content>
        </Card>

        {/* Cards de Entradas e Saídas */}
        <View style={styles.summaryCardsContainer}>
          <Card style={[styles.summaryCard, styles.entriesCard]}>
            <Card.Content>
              <Paragraph style={styles.cardLabel}>Entradas</Paragraph>
              <Title style={[styles.summaryValue, { color: Colors.success }]}>
                R$ {totalEntries.toFixed(2).replace('.', ',')}
              </Title>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, styles.exitsCard]}>
            <Card.Content>
              <Paragraph style={styles.cardLabel}>Saídas</Paragraph>
              <Title style={[styles.summaryValue, { color: Colors.danger }]}>
                R$ {totalExits.toFixed(2).replace('.', ',')}
              </Title>
            </Card.Content>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Centraliza os cards horizontalmente
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  balanceCard: {
    width: '100%',
    marginBottom: 20,
    elevation: 5, // Sombra mais proeminente para o saldo principal
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    paddingVertical: 10, // Espaçamento interno vertical
  },
  cardLabel: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1, // Divide o espaço igualmente entre os dois cards
    marginHorizontal: 5,
    elevation: 3, // Sombra menor
    borderRadius: 10,
    backgroundColor: Colors.cardBackground,
    paddingVertical: 8,
  },
  entriesCard: {
    // Adicione estilos específicos se quiser, como background sutil
    // backgroundColor: Colors.success + '10', // Exemplo: um verde bem clarinho
  },
  exitsCard: {
    // backgroundColor: Colors.danger + '10', // Exemplo: um vermelho bem clarinho
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;