import React, { useState } from 'react';

import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, HelperText, RadioButton, Text, TextInput, Title } from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../../constants/Colors';

import { useTransactions } from '../../data/TransactionContext';



const AddTransactionScreen: React.FC = () => {

  const [value, setValue] = useState('');

  const [description, setDescription] = useState('');

  const [category, setCategory] = useState('');

  const [type, setType] = useState<'entrada' | 'saida'>('entrada');

  const [valueError, setValueError] = useState(false);

  const [descriptionError, setDescriptionError] = useState(false);

  const [categoryError, setCategoryError] = useState(false);



  const { addTransaction } = useTransactions();



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

    const parsedValue = parseFloat(value.replace(',', '.'));



    if (isNaN(parsedValue) || parsedValue <= 0) {

      setValueError(true);

      hasError = true;

    } else {

      setValueError(false);

    }



    if (!description.trim()) {

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

     

      await addTransaction(

        {

          value: parsedValue,

          description: description.trim(),

          category: category.trim(),

          type: type,

        },

        new Date()

      );

      Alert.alert('Sucesso', 'Transação adicionada com sucesso!');

      resetForm();

    } catch (error: any) { // Adicionando 'any' para 'error' para acessar 'message'

      console.error('Erro ao adicionar transação:', error);

      Alert.alert('Erro', error.message || 'Não foi possível adicionar a transação. Tente novamente.');

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

              setValueError(false);

            }}

            keyboardType="numeric"

            mode="outlined"

            style={styles.input}

            error={valueError}

            left={<TextInput.Icon icon="currency-usd" />}

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

            left={<TextInput.Icon icon="pencil-outline" />}

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

            left={<TextInput.Icon icon="tag-outline" />}

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

    marginBottom: 5,

    backgroundColor: Colors.cardBackground,

  },

  radioGroupContainer: {

    width: '100%',

    marginTop: 20,

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

    backgroundColor: Colors.primary,

    borderRadius: 8,

  },

  buttonLabel: {

    fontSize: 18,

    fontWeight: 'bold',

    color: Colors.cardBackground,

  },

});



export default AddTransactionScreen;