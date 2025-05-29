import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors'; // Importe suas cores

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary, // Cor da aba ativa (defina em constants/Colors.ts)
        tabBarInactiveTintColor: Colors.textSecondary, // Cor da aba inativa
        headerShown: false, // Oculta o cabeçalho padrão das telas
        tabBarStyle: {
          backgroundColor: Colors.background, // Cor de fundo da barra de abas
          height: 60, // Altura da barra de abas
          paddingBottom: 5, // Espaçamento interno inferior
          paddingTop: 5, // Espaçamento interno superior
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index" // Esta é a tela inicial da sua primeira aba (Resumo)
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="add" // Esta será a tela para adicionar novas transações
        options={{
          title: 'Adicionar',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="list" // Esta será a tela para listar todas as transações
        options={{
          title: 'Transações',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={28} />
          ),
        }}
      />
      {/* Você pode adicionar mais abas aqui, se precisar */}
    </Tabs>
  );
}