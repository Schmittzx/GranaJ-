import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionsListScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Title style={styles.title}>Minhas Transações</Title>
        <Text style={styles.text}>A lista de todas as suas movimentações financeiras.</Text>
        {/* Lista de transações será adicionada aqui */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default TransactionsListScreen;