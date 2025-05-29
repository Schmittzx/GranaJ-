import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Transaction } from '../.expo/types/Transaction'; // Certifique-se que o caminho e o nome do arquivo estão corretos!

// 1. Definir a interface do contexto para TypeScript
interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  getBalance: () => { totalEntries: number; totalExits: number; currentBalance: number };
  loading: boolean; // Para indicar se os dados estão sendo carregados
  // deleteTransaction: (id: string) => Promise<void>; // Exemplo: se for adicionar funcionalidade de delete
}

// 2. Criar o Contexto
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Chave para armazenar os dados no AsyncStorage
const STORAGE_KEY = '@grana_ja_transactions';

// 3. Criar o Provedor do Contexto
interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  // Efeito para carregar as transações do AsyncStorage quando o componente monta
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true); // Começa a carregar
        const storedTransactions = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTransactions) {
          // Garante que o parse é feito apenas se houver algo
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error('Failed to load transactions from AsyncStorage:', error);
        // Em um app real, você pode querer exibir uma mensagem para o usuário ou logar o erro
      } finally {
        setLoading(false); // Termina de carregar, mesmo se houver erro
      }
    };
    loadTransactions();
  }, []); // O array vazio garante que roda apenas uma vez ao montar (componentDidMount)

  // Função para salvar as transações no AsyncStorage E atualizar o estado local
  const saveTransactions = useCallback(async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
      setTransactions(newTransactions); // Atualiza o estado local para re-renderizar componentes
    } catch (error) {
      console.error('Failed to save transactions to AsyncStorage:', error);
      // Opcional: Reverter o estado (setTransactions(transactions)) ou mostrar um erro para o usuário
    }
  }, []); // Essa função não depende de `transactions` porque recebe a nova lista como argumento

  // Função para adicionar uma nova transação
  const addTransaction = useCallback(async (newTransactionData: Omit<Transaction, 'id' | 'date'>) => {
    // Adiciona um ID único e a data/hora atual
    const transactionToAdd: Transaction = {
      ...newTransactionData,
      id: Date.now().toString(), // ID único simples baseado em timestamp
      date: new Date().toISOString(), // Data e hora atual em formato ISO 8601
    };
    const updatedTransactions = [...transactions, transactionToAdd]; // Adiciona a nova transação à lista existente
    await saveTransactions(updatedTransactions); // Salva a lista atualizada e atualiza o estado
  }, [transactions, saveTransactions]); // Depende de `transactions` para pegar a lista atual e de `saveTransactions`

  // Função para calcular o saldo (entradas - saídas)
  const getBalance = useCallback(() => {
    const totalEntries = transactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.value, 0);

    const totalExits = transactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.value, 0);

    const currentBalance = totalEntries - totalExits;

    return { totalEntries, totalExits, currentBalance };
  }, [transactions]); // Recalcula apenas quando `transactions` muda

  /*
  // Exemplo de função para deletar transação (se for implementar mais tarde)
  const deleteTransaction = useCallback(async (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);
  */

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getBalance,
        loading,
        // deleteTransaction, // Adicione aqui se for usar
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// 4. Hook customizado para usar o Contexto
// Este hook é o que você importará e usará em suas telas
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};