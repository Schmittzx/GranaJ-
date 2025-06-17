import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Transaction } from '../.expo/types/Transaction';
import { supabase } from '../data/supabaseClient';

interface SupabaseTransaction {
  id: number;
  user_id?: string;
  created_at: string;
  value: number;
  description: string;
  category: string | null;
  type: 'entrada' | 'saida';
  date: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (
    transactionData: Omit<Transaction, 'id' | 'date' | 'created_at' | 'user_id'>,
    transactionDate: Date
  ) => Promise<void>;
  loadTransactions: () => Promise<void>;
  getBalance: () => {
    totalEntries: number;
    totalExits: number;
    currentBalance: number;
  };
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'user_id'>>
  ) => Promise<void>;
  loading: boolean;
  dbError: string | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const mapSupabaseTransactionToApp = (
    dbTransaction: SupabaseTransaction
  ): Transaction => {
    return {
      ...dbTransaction,
      id: dbTransaction.id.toString(),
      category: dbTransaction.category || '',
    };
  };

  const loadTransactionsFromSupabase = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        setDbError(`Falha ao carregar transações: ${error.message}`);
        setTransactions([]);
        throw error;
      }
      if (data) {
        const loadedTransactions = data.map(mapSupabaseTransactionToApp);
        setTransactions(loadedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (error: any) {
      if (!dbError) {
        setDbError(`Exceção ao carregar: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadTransactionsFromSupabase().catch(err => {
          console.error("Falha ao carregar transações na inicialização:", err.message);
        });
      } else {
        setLoading(false);
        setTransactions([]);
      }
    });
  }, [loadTransactionsFromSupabase]);

  const addTransaction = useCallback(
    async (
      newTransactionData: Omit<Transaction, 'id' | 'date' | 'created_at' | 'user_id'>,
      transactionDate: Date
    ) => {
      setLoading(true);
      setDbError(null);
      const transactionToInsert = {
        value: newTransactionData.value,
        description: newTransactionData.description,
        category: newTransactionData.category || null,
        type: newTransactionData.type,
        date: transactionDate.toISOString(),
      };
      try {
        const { data: insertedData, error } = await supabase
          .from('transactions')
          .insert(transactionToInsert)
          .select()
          .single();
        if (error) {
          setDbError(`Falha ao adicionar transação: ${error.message}`);
          throw error;
        }
        if (insertedData) {
          const newTransaction = mapSupabaseTransactionToApp(
            insertedData as SupabaseTransaction
          );
          setTransactions(prev =>
            [newTransaction, ...prev].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        }
      } catch (error: any) {
        if (!dbError) {
          setDbError(`Exceção ao adicionar: ${error.message}`);
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setDbError(null);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        setDbError(`Falha ao excluir transação: ${error.message}`);
        throw error;
      }
      setTransactions(prevTransactions =>
        prevTransactions.filter(transaction => transaction.id !== id)
      );
    } catch (error: any) {
      if (!dbError) {
        setDbError(`Exceção ao excluir: ${error.message}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'user_id'>>
    ) => {
      setLoading(true);
      setDbError(null);

      try {
        const { data: updatedData, error } = await supabase
          .from('transactions')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          setDbError(`Falha ao atualizar transação: ${error.message}`);
          throw error;
        }

        if (updatedData) {
          const updatedTransaction = mapSupabaseTransactionToApp(
            updatedData as SupabaseTransaction
          );
          setTransactions(prevTransactions =>
            prevTransactions.map(t => (t.id === id ? updatedTransaction : t))
          );
        }
      } catch (error: any) {
        if (!dbError) {
          setDbError(`Exceção ao atualizar: ${error.message}`);
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBalance = useCallback(() => {
    const totalEntries = transactions
      .filter((t: Transaction) => t.type === 'entrada')
      .reduce((sum: number, t: Transaction) => sum + t.value, 0);
    const totalExits = transactions
      .filter((t: Transaction) => t.type === 'saida')
      .reduce((sum: number, t: Transaction) => sum + t.value, 0);
    const currentBalance = totalEntries - totalExits;
    return { totalEntries, totalExits, currentBalance };
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        loadTransactions: loadTransactionsFromSupabase,
        getBalance,
        deleteTransaction,
        updateTransaction,
        loading,
        dbError,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      'useTransactions deve ser usado dentro de um TransactionProvider'
    );
  }
  return context;
};