import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


const supabaseUrl = 'https://ejuzzmfccfitncsozfqw.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXp6bWZjY2ZpdG5jc296ZnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTc5MjAsImV4cCI6MjA2NDY3MzkyMH0.pnAoXn3hTwdckcQRCAR_ULq62evvhwenebRiS64jYDQ'; 
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL ou Anon Key não foram definidas. Verifique suas variáveis de ambiente ou o arquivo de configuração do Supabase.'
  );
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {

  },
});

console.log('Supabase client inicializado.');