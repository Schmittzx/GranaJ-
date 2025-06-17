# 💰 GranaJá - Seu Controle Financeiro Pessoal


## 📝 Descrição

GranaJá é um aplicativo móvel desenvolvido como parte de um projeto de estudo para ajudar no controle de finanças pessoais. Com uma interface simples e intuitiva, o aplicativo permite que o usuário registre suas entradas e saídas, visualize um resumo financeiro e gerencie suas transações de forma eficaz. Este projeto foi construído utilizando React Native com Expo e integra-se com o Supabase para persistência de dados.

## ✨ Funcionalidades Principais

* **CRUD Completo de Transações:**
    * **Adicionar:** Formulário para registrar novas receitas ou despesas.
    * **Listar:** Tela com um histórico completo de todas as transações, com scroll infinito e "puxar para atualizar".
    * **Detalhes:** Visualização de detalhes completos de uma transação específica.
    * **Editar:** Formulário preenchido para atualizar informações de uma transação existente.
    * **Excluir:** Opção para deletar transações com um alerta de confirmação.
* **Resumo Financeiro:** Um painel na tela inicial que exibe o total de entradas, saídas e o saldo atual, com cores indicativas.
* **Persistência de Dados na Nuvem:** Todas as informações são salvas em um banco de dados PostgreSQL na nuvem utilizando o Supabase.
* **Interface Refinada:** Layout limpo, com ícones e componentes da biblioteca React Native Paper para uma experiência de usuário agradável.

## 🛠️ Tecnologias Utilizadas

* **React Native**
* **Expo** (com Expo Router para navegação)
* **TypeScript**
* **Supabase** (Banco de dados PostgreSQL e Autenticação)
* **React Native Paper** (Biblioteca de componentes de UI)
* **date-fns** (Para formatação de datas)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão LTS)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* [Expo Go](https://expo.dev/client) app no seu smartphone (Android ou iOS)
