import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, RadioButton, Text, TextInput, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors'; // Importe suas cores
import { useTransactions } from '../../data/TransactionContext'; // Importe o hook do seu contexto

const AddTransactionScreen: React.FC = () => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'entrada' | 'saida'>('entrada'); // 'entrada' por padrão
  const [valueError, setValueError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const { addTransaction } = useTransactions(); // Use o hook para acessar a função de adicionar
  
  // Função para resetar os campos do formulário
  const resetForm = () => {
    setValue('');
    setDescription('');
    setCategory('');
    setType('entrada');
    setValueError(false);
    setDescriptionError(false);
    setCategoryError(false);
  };

  const handleAddTransaction = async () => {
    let hasError = false;
    const parsedValue = parseFloat(value.replace(',', '.')); // Garante que a vírgula é tratada como ponto

    if (isNaN(parsedValue) || parsedValue <= 0) {
      setValueError(true);
      hasError = true;
    } else {
      setValueError(false);
    }

    if (!description.trim()) { // .trim() remove espaços em branco no início/fim
      setDescriptionError(true);
      hasError = true;
    } else {
      setDescriptionError(false);
    }

    if (!category.trim()) {
      setCategoryError(true);
      hasError = true;
    } else {
      setCategoryError(false);
    }

    if (hasError) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    try {
      await addTransaction({
        value: parsedValue,
        description: description.trim(),
        category: category.trim(),
        type: type,
      });
      Alert.alert('Sucesso', 'Transação adicionada com sucesso!');
      resetForm(); // Limpa o formulário após o sucesso
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a transação. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title style={styles.title}>Registrar Transação</Title>

          <TextInput
            label="Valor"
            value={value}
            onChangeText={text => {
              setValue(text);
              setValueError(false); // Remove erro ao digitar
            }}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            error={valueError}
            left={<TextInput.Icon icon="currency-usd" />} // Ícone de dólar
          />
          {valueError && <HelperText type="error" visible={valueError}>
            O valor deve ser um número positivo.
          </HelperText>}

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={text => {
              setDescription(text);
              setDescriptionError(false);
            }}
            mode="outlined"
            style={styles.input}
            error={descriptionError}
            left={<TextInput.Icon icon="pencil-outline" />} // Ícone de lápis
          />
          {descriptionError && <HelperText type="error" visible={descriptionError}>
            A descrição não pode ser vazia.
          </HelperText>}

          <TextInput
            label="Categoria"
            value={category}
            onChangeText={text => {
              setCategory(text);
              setCategoryError(false);
            }}
            mode="outlined"
            style={styles.input}
            error={categoryError}
            left={<TextInput.Icon icon="tag-outline" />} // Ícone de tag
          />
          {categoryError && <HelperText type="error" visible={categoryError}>
            A categoria não pode ser vazia.
          </HelperText>}

          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Tipo de Transação:</Text>
            <RadioButton.Group onValueChange={newValue => setType(newValue as 'entrada' | 'saida')} value={type}>
              <View style={styles.radioOption}>
                <RadioButton value="entrada" color={Colors.success} />
                <Text style={styles.radioText}>Entrada (Receita)</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="saida" color={Colors.danger} />
                <Text style={styles.radioText}>Saída (Despesa)</Text>
              </View>
            </RadioButton.Group>
          </View>

          <Button
            mode="contained"
            onPress={handleAddTransaction}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="plus-circle"
          >
            Registrar Transação
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Permite que o conteúdo cresça e o ScrollView funcione
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
    marginBottom: 5, // Ajustado para dar espaço para HelperText
    backgroundColor: Colors.cardBackground,
  },
  radioGroupContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    elevation: 1, // Sombra sutil
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
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.cardBackground, // Texto do botão branco
  },
});

export default AddTransactionScreen;