// app/transaction/edit/[id].tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    Button,
    RadioButton,
    TextInput,
    Title,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../constants/Colors'; // ❗ Verifique se este caminho está correto
import { useTransactions } from '../../../data/TransactionContext'; // ❗ Verifique se este caminho está correto

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, updateTransaction, loading } = useTransactions();
  const router = useRouter();

  // Estados para controlar os campos do formulário
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  
  // Estado para saber se os dados já foram carregados no formulário
  const [isReady, setIsReady] = useState(false);

  // Este useEffect é a chave: ele roda quando a tela carrega e preenche o formulário
  useEffect(() => {
    if (transactions.length > 0 && id) {
      const transactionToEdit = transactions.find(t => t.id === id);
      if (transactionToEdit) {
        // Preenche os estados do formulário com os dados da transação encontrada
        setValue(transactionToEdit.value.toString());
        setDescription(transactionToEdit.description);
        setCategory(transactionToEdit.category);
        setType(transactionToEdit.type);
        setIsReady(true); // Marca o formulário como pronto para ser exibido
      } else {
        // Se, por algum motivo, a transação não for encontrada, avisa e volta
        Alert.alert('Erro', 'Transação não encontrada.');
        if (router.canGoBack()) router.back();
      }
    }
  }, [id, transactions]);

  // Função chamada ao salvar as alterações
  const handleUpdateTransaction = async () => {
    const parsedValue = parseFloat(value.replace(',', '.'));
    if (isNaN(parsedValue) || parsedValue <= 0 || !description.trim()) {
      Alert.alert(
        'Erro de Validação',
        'Por favor, preencha a descrição e um valor numérico positivo.'
      );
      return;
    }

    // Objeto apenas com os campos que queremos atualizar
    const updates = {
      value: parsedValue,
      description: description.trim(),
      category: category.trim(),
      type: type,
    };

    try {
      if (!id) throw new Error('ID da transação não encontrado.');
      
      // Chama a função 'updateTransaction' do nosso contexto
      await updateTransaction(id, updates);
      
      Alert.alert('Sucesso!', 'Transação atualizada com sucesso.');

      // Volta para a tela de detalhes após salvar
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        `Não foi possível atualizar a transação: ${error.message}`
      );
    }
  };

  // Mostra um indicador de carregamento enquanto busca os dados da transação
  if (!isReady) {
    return <ActivityIndicator style={styles.centered} animating={true} size="large" />;
  }

  // Renderiza o formulário (muito similar ao de adicionar)
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Editar Transação',
          headerStyle: { backgroundColor: Colors.secondary },
          headerTintColor: '#fff',
        }}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title style={styles.title}>Editar Transação</Title>
          <TextInput
            label="Valor"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Categoria"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Tipo de Transação:</Text>
            <RadioButton.Group
              onValueChange={newValue => setType(newValue as 'entrada' | 'saida')}
              value={type}
            >
              <View style={styles.radioOption}>
                <RadioButton value="entrada" color={Colors.success} />
                <Text style={styles.radioText}>Entrada</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="saida" color={Colors.danger} />
                <Text style={styles.radioText}>Saída</Text>
              </View>
            </RadioButton.Group>
          </View>
          <Button
            mode="contained"
            onPress={handleUpdateTransaction}
            style={styles.button}
            loading={loading} // Mostra um loading no botão durante a chamada ao Supabase
          >
            Salvar Alterações
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Reutilize os estilos do seu formulário de 'add.tsx' aqui
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.textPrimary,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: Colors.cardBackground,
  },
  radioGroupContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    elevation: 1,
  },
  radioGroupLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  button: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
});