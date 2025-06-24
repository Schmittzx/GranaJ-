
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { TransactionProvider } from '../data/TransactionContext';
import { supabase } from '../data/supabaseClient';


const TEST_USER_EMAIL = 'teste@admin.com'; 
const TEST_USER_PASSWORD = 'teste';      

async function signInTestUser() {
  
  const GENERIC_PLACEHOLDER_EMAIL = 'seu-email-de-teste@example.com';
  const GENERIC_PLACEHOLDER_PASSWORD = 'sua-senha-de-teste';

  if (
    !TEST_USER_EMAIL || TEST_USER_EMAIL === GENERIC_PLACEHOLDER_EMAIL ||
    !TEST_USER_PASSWORD || TEST_USER_PASSWORD === GENERIC_PLACEHOLDER_PASSWORD
  ) {
    console.warn(
      'AVISO NO LOGIN DE TESTE: As constantes TEST_USER_EMAIL ou TEST_USER_PASSWORD no arquivo app/_layout.tsx ainda contêm valores de placeholder genéricos ou estão vazias. O login de teste programático será ignorado.'
    );
    console.warn(
      'Para que o login de teste funcione, por favor, crie um usuário de teste no painel do Supabase (em Authentication > Users) e depois atualize as constantes TEST_USER_EMAIL e TEST_USER_PASSWORD neste arquivo (app/_layout.tsx) com as credenciais REAIS desse usuário.'
    );
    return;
  }

  console.log(`[TESTE] Tentando login com usuário: ${TEST_USER_EMAIL}`);
  if (!supabase) { 
    console.error("[TESTE] Cliente Supabase (importado) não está definido. Verifique a importação do 'supabaseClient' em app/_layout.tsx.");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  if (error) {
    console.error(`[TESTE] Erro no login de teste do Supabase para o usuário ${TEST_USER_EMAIL}:`, error.message);
    if (error.message.toLowerCase().includes("invalid login credentials")) {
        console.error("[TESTE] DICA: Verifique se o e-mail e a senha do usuário de teste ('" + TEST_USER_EMAIL + "', '" + TEST_USER_PASSWORD + "') estão corretos e se o usuário realmente existe e está ativo no seu painel do Supabase (Authentication > Users).");
    } else if (error.message.toLowerCase().includes("email not confirmed")) {
        console.error("[TESTE] DICA: O e-mail deste usuário de teste precisa ser confirmado. Verifique o painel do Supabase (Authentication > Users), selecione o usuário e procure uma opção para confirmar o e-mail manualmente ou reenviar o e-mail de confirmação (se a confirmação de e-mail estiver habilitada no seu projeto Supabase).");
    }
  } else {
    if (data && data.user) {
      console.log('[TESTE] Usuário de teste logado com sucesso no Supabase! ID do Usuário:', data.user.id);
    } else if (data && data.session && data.session.user) {
      console.log('[TESTE] Sessão de teste restaurada/ativa no Supabase. ID do Usuário da Sessão:', data.session.user.id);
    } else {
      console.warn('[TESTE] Login de teste do Supabase parece ter sido bem-sucedido (sem erro retornado), mas não recebemos dados de usuário ou sessão válidos na resposta. Verifique a resposta da API:', data);
    }
  }
}


export default function RootLayout() {
  useEffect(() => {
    
    signInTestUser();
  }, []); 

  return (
    <PaperProvider>
      <TransactionProvider>
        <Stack>
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          {}
        </Stack>
      </TransactionProvider>
    </PaperProvider>
  );
}