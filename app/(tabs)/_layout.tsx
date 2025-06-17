import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary, 
        tabBarInactiveTintColor: Colors.textSecondary, 
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: Colors.background, 
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="add" 
        options={{
          title: 'Adicionar',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="lists" 
        options={{
          title: 'Transações',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={28} />
          ),
        }}
      />

      {/* 👇 MUDANÇA APLICADA AQUI 👇 */}
      {/* Esta linha diz ao Expo Router para não criar um botão na barra de abas para a rota "explore" */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}