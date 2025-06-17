import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, Paragraph, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Transaction } from '../../.expo/types/Transaction';
import Colors from '../../constants/Colors';
import { useTransactions } from '../../data/TransactionContext';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, loading, deleteTransaction } = useTransactions();
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (transactions.length > 0 && id) {
      const foundTransaction = transactions.find(t => t.id === id);
      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        console.warn(`Transação com ID ${id} não encontrada no contexto.`);
      }
    }
  }, [id, transactions]);

  const handleDelete = () => {
    if (!id || !transaction) {
      Alert.alert("Erro", "ID da transação ou objeto da transação não encontrado.");
      return;
    }

    Alert.alert(
      "Excluir Transação",
      `Você tem certeza que deseja excluir a transação "${transaction.description}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(id);
              Alert.alert("Sucesso", "Transação excluída com sucesso!");
              if (router.canGoBack()) {
                router.back();
              }
            } catch (error: any) {
              console.error("Erro na UI ao tentar excluir:", error);
              Alert.alert("Erro", `Não foi possível excluir a transação: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (id) {
      router.push(`/transaction/edit/${id}`);
    } else {
      Alert.alert("Erro", "Não foi possível encontrar o ID da transação para edição.");
    }
  };

  if (loading && !transaction) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Erro' }} />
        <View style={styles.centered}>
          <Title>Transação não encontrada</Title>
          <Paragraph>Não foi possível encontrar os detalhes para esta transação.</Paragraph>
          <Button onPress={() => router.back()} style={{ marginTop: 20 }}>
            Voltar para a Lista
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const isEntrada = transaction.type === 'entrada';
  const valueColor = isEntrada ? Colors.success : Colors.danger;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Detalhes da Transação`,
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
        }}
      />
      <Card style={styles.card}>
        <Card.Title
          title={transaction.description}
          titleStyle={styles.cardTitle}
          subtitle={transaction.category || 'Sem categoria'}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Content>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="cash" size={24} color={Colors.textSecondary} />
            <Text style={[styles.valueText, { color: valueColor }]}>
              {isEntrada ? '+' : '-'} R$ {transaction.value.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={24} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {format(new Date(transaction.date), "EEEE, dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          icon="pencil"
          mode="contained"
          onPress={handleEdit}
          style={[styles.button, { backgroundColor: Colors.secondary }]}
          labelStyle={styles.buttonLabel}
        >
          Editar
        </Button>
        <Button
          icon="delete"
          mode="contained"
          onPress={handleDelete}
          style={[styles.button, { backgroundColor: Colors.danger }]}
          labelStyle={styles.buttonLabel}
        >
          Excluir
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#f0f0f0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: -8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  valueText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  detailText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 16,
    flexShrink: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});