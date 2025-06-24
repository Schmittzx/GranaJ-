# GranaJá: App de Controle Financeiro

## Visão Geral
Aplicativo para gerenciamento de finanças pessoais que permite o controle de receitas e despesas. Os dados são persistidos na nuvem com Supabase.

---

## Funcionalidades Implementadas
- **CRUD de Transações:**
  - Cadastro de novas transações (entradas e saídas).
  - Listagem de todas as transações com `FlatList`.
  - Navegação para tela de detalhes de cada transação.
  - Edição de transações existentes.
  - Exclusão de transações com alerta de confirmação.
- **Painel de Resumo:** Exibição de total de entradas, saídas e saldo atual.

---

## Screenshots
*Substitua os textos abaixo pelos links das suas imagens.*

**Tela de Resumo:**
*[COLE O LINK DA IMAGEM AQUI]*

**Tela de Lista de Transações:**
*[COLE O LINK DA IMAGEM AQUI]*

**Tela de Edição:**
*[COLE O LINK DA IMAGEM AQUI]*

---

## Tecnologias
- React Native (com Expo)
- TypeScript
- Expo Router
- Supabase (PostgreSQL)
- React Native Paper
- date-fns

---

## Como Executar
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Schmittzx/GranaJ-.git](https://github.com/Schmittzx/GranaJ-.git)
    ```
2.  **Acesse a pasta:**
    ```bash
    cd GranaJ-
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Configure o Supabase:**
    - No arquivo `data/supabaseClient.ts`, insira sua URL e Chave Anon do projeto Supabase.
5.  **Inicie o projeto:**
    ```bash
    npx expo start --clear
    ```
