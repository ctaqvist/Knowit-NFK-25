import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export function EnrollMFA({
  onEnrolled,
}: {
  onEnrolled: () => void;
}) {
  const [factorId, setFactorId] = useState('');
  const [qr, setQR] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [wantsToEnroll, setWantsToEnroll] = useState(false)
  const { signOut } = useAuth()

  const onEnableClicked = async () => {
    setError('');
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setError(challenge.error.message);
        return;
      }

      const { id: challengeId } = challenge.data;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });

      if (verify.error) {
        await supabase.auth.refreshSession();
        setError(verify.error.message);
        return;
      }

      onEnrolled();
    } catch (err: any) {
      setError(err.message ?? 'Unexpected error');
    }
  };

  useEffect(() => {
    if (wantsToEnroll) {
      (async () => {
        try {
          // First check for any existing unverified factors
          const { data: listData, error: listError } = await supabase.auth.mfa.listFactors();
          if (listError) throw listError;

          const unverifiedFactor = listData?.all.find(f => f.status === 'unverified' && f.factor_type === 'totp');

          if (unverifiedFactor) {
            setFactorId(unverifiedFactor.id);
            return;
          }

          // If none exist, attempt to enroll a new one
          const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
            issuer: 'TerraX9',
          });




          if (enrollError) throw enrollError;

          setFactorId(enrollData.id);
          setQR(enrollData.totp.qr_code);
        } catch (err: any) {
          setError(err.message ?? 'Failed to enroll MFA');
        }
      })();
    }
  }, [wantsToEnroll]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        margin: '5rem auto',
        p: 4,
        gap: 2,
        maxWidth: 500
      }}
    >
      {
        wantsToEnroll ?
          (
            <>
              {error && <Typography variant='body1' color="error">Sorry, there was an issue enabling MFA. Try again later or contact IT support</Typography>}
              {qr && <img src={qr} alt="QR code unavailable" />}

              <TextField
                variant="outlined"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.trim())}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="button" variant="outlined" onClick={onEnableClicked}>
                  Enable
                </Button>
                <Button type="button" variant="outlined" onClick={() => setWantsToEnroll(false)}>
                  Cancel
                </Button>
              </Box>

            </>
          )
          :
          <>
            <Typography>We require all administrators to enable Multi-Factor Authentication</Typography>
            <Box>
              <Button onClick={() => setWantsToEnroll(true)}>Enable</Button>
              <Button onClick={signOut}>Cancel</Button>
            </Box>
          </>
      }
    </Box>
  );
}
