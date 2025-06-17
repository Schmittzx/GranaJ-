import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useTransactions } from '../../data/TransactionContext';

const HomeScreen: React.FC = () => {
  const { getBalance, loading } = useTransactions();
  const { totalEntries, totalExits, currentBalance } = getBalance();

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

        <Card style={styles.balanceCard}>
          <Card.Content>
            <Paragraph style={styles.cardLabel}>Saldo Atual</Paragraph>
            <Title style={[styles.balanceValue, { color: balanceColor }]}>
              R$ {currentBalance.toFixed(2).replace('.', ',')}
            </Title>
          </Card.Content>
        </Card>

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
    alignItems: 'center',
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
    elevation: 5,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    paddingVertical: 10,
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
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: Colors.cardBackground,
    paddingVertical: 8,
  },
  entriesCard: {},
  exitsCard: {},
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;