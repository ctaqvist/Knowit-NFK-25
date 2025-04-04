import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../config/supabase';

function Login() {

  return (
    <Auth supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
      view='sign_in'
      showLinks={false} />

  )
}

export default Login;
