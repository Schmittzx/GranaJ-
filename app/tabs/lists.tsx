
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Link } from 'expo-router';
import { Button, Card, Paragraph, Title, useTheme } from 'react-native-paper';
import { Transaction } from '../../.expo/types/Transaction';
import Colors from '../../constants/Colors';
import { useTransactions } from '../../data/TransactionContext';
export default function TransactionListScreen() {
  const { transactions, loading, loadTransactions, dbError } = useTransactions();
  const theme = useTheme(); // Para usar cores do tema do React Native Paper

  const onRefresh = useCallback(async () => {
    console.log('Atualizando lista de transações...');
    await loadTransactions(); // Função do contexto para recarregar do Supabase
  }, [loadTransactions]);

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
  const isEntrada = item.type === 'entrada';
  const valueColor = isEntrada ? Colors.success : Colors.danger;
  const iconName = isEntrada ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline';

  return (
    // 👇 A mudança está aqui, na propriedade 'href' do Link 👇
    <Link
      href={{
        pathname: "/transaction/[id]", // O caminho do arquivo da rota dinâmica
        params: { id: item.id },      // Um objeto com os parâmetros
      }}
      asChild
    >
      <TouchableOpacity>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons name={iconName} size={34} color={valueColor} style={styles.icon} />
            <View style={styles.infoContainer}>
              <Text style={styles.descriptionText} numberOfLines={1}>{item.description}</Text>
              <Text style={styles.categoryText}>{item.category || 'Sem categoria'}</Text>
              <Text style={styles.dateText}>
                {format(new Date(item.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </Text>
            </View>
            <Text style={[styles.valueText, { color: valueColor }]}>
              {isEntrada ? '+' : '-'} R$ {item.value.toFixed(2).replace('.', ',')}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Link>
  );
};

  // Nenhuma mudança necessária no JSX abaixo
  if (loading && transactions.length === 0) {
    // Mostra indicador de loading apenas no carregamento inicial
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando transações...</Text>
      </SafeAreaView>
    );
  }

  if (dbError) {
    return (
      <SafeAreaView style={styles.centered}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>Erro ao carregar transações:</Text>
        <Text style={styles.errorDetailText}>{dbError}</Text>
        <Button onPress={onRefresh} mode="contained" style={styles.retryButton}>
          Tentar Novamente
        </Button>
      </SafeAreaView>
    );
  }

  if (!loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <MaterialCommunityIcons name="information-outline" size={48} color={Colors.textSecondary} />
        <Text style={styles.emptyText}>Nenhuma transação registrada ainda.</Text>
        <Paragraph style={styles.emptySubText}>Adicione sua primeira transação na aba "Adicionar"!</Paragraph>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Title style={styles.title}>Minhas Transações</Title>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        refreshControl={
          <RefreshControl
            refreshing={loading} 
            onRefresh={onRefresh} 
            colors={[Colors.primary]} 
            tintColor={Colors.primary} // tintColor para iOS
          />
        }
      />
    </SafeAreaView>
  );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background || '#f0f0f0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background || '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground || '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  valueText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 18,
    color: Colors.danger,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: Colors.primary
  }
});