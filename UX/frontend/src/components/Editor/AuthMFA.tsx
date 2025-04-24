import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

function AuthMFA({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const { signOut } = useAuth()

  const handleSubmit = () => {
    setError('');
    (async () => {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) {
        throw factors.error;
      }
      const totpFactor = factors.data.all[0];
      if (!totpFactor) {
        throw new Error('No TOTP factors found!');
      }
      const factorId = totpFactor.id;
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setError(challenge.error.message);
        throw challenge.error;
      }
      const challengeId = challenge.data.id;
      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });
      if (verify.error) {
        setError(verify.error.message);
        throw verify.error;
      }
      onSuccess();
    })();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 400,
        m: '5rem auto'
      }}>
      <Typography
        sx={{ mb: 1 }}
        variant='body3'
      >
        Please enter the code from your authenticator app
      </Typography>
      {error && <Box className='error'>{error}</Box>}
      <TextField
        variant='outlined'
        type='text'
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value.trim())}
      />
      <Box>
        <Button
          sx={{ my: 2, mr: 1 }}
          variant='text_contained'
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          sx={{ my: 2 }}
          variant='outlined'
          onClick={signOut}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default AuthMFA;
