import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../config/supabase';
import { Box } from '@mui/material';

function Login() {
  return (
    <Box
      sx={{
        p: 2,
        m: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'inherit',
        maxWidth: 350,
        display: 'flex',
        '&>div': { width: '100%' },
      }}
    >
      <Auth
        supabaseClient={supabase}
        localization={{
          variables: {
            sign_in: {
              email_input_placeholder: '',
              password_input_placeholder: '',
            },
          },
        }}
        appearance={{
          style: {
            container: {
              width: '100%',
            },
          },
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'primary',
                brandAccent: '#5526FF',
                defaultButtonBackground: '#5526FF',
                defaultButtonBackgroundHover: '#5526FF',
                inputText: 'text.primary'
              },
            },
          },
        }}
        providers={[]}
        view='sign_in'
        showLinks={false}
      />
    </Box>
  );
}

export default Login;
