import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
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
  const [verifyError, setVerifyError] = useState('');
  const [wantsToEnroll, setWantsToEnroll] = useState(false)
  const { signOut } = useAuth()

  const onEnableClicked = async () => {
    setError('');
    setVerifyError('')
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setVerifyError(challenge.error.message);
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
        setVerifyError('Invalid TOTP code entered')
        throw new Error()
      }

      sessionStorage.removeItem('QR')
      onEnrolled();
    } catch (err: any) {
      console.error(`Failed to verify MFA: `, err)
      setError(err.message ?? 'Unexpected error');
    }
  };

  useEffect(() => {
    if (wantsToEnroll) {
      (async () => {
        try {
          setError('')
          setVerifyError('')
          const { data: listData, error: listError } = await supabase.auth.mfa.listFactors();
          if (listError) throw listError;

          // Only allow one device per user
          if (listData.totp.length > 0) throw new Error('We only allow one device per user. If you wish to change the device, log in and remove the active device the settings')

          // If the user has started the process, it will be stored until it activates
          if (listData.all[0] && listData.totp.length < 1) {
            setFactorId(listData.all[0].id)
            const STORED_QR = JSON.parse(sessionStorage.getItem('QR') ?? '')
            if (!STORED_QR) throw new Error(`No stored QR was found`)
            return setQR(STORED_QR)
          }

          // If none exist, attempt to enroll a new one
          const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
            issuer: 'TerraX9',
            friendlyName: 'Device 1'
          });

          if (enrollError) throw enrollError;

          setFactorId(enrollData.id);
          setQR(enrollData.totp.qr_code);
          sessionStorage.setItem('QR', JSON.stringify(enrollData.totp.qr_code))
        } catch (err: any) {
          setWantsToEnroll(false)
          console.error(err)
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
        p: 2,
        gap: 2,
      }}
    >
      {
        wantsToEnroll ?
          (
            <Stack direction='row' gap={2}>

              {qr && <img style={{ width: 250, height: 250 }} src={qr} alt="QR code unavailable" />}
              <Stack sx={{ py: 2, flex: 1, width: 290 }} direction={'column'} gap={2}>
                {verifyError ? <Typography variant='body2' color="error">{verifyError}</Typography> : <Typography variant='body2'>Enter the code provided by your authenticator app below</Typography>}
                <TextField
                  onFocus={() => setVerifyError('')}
                  variant="outlined"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.trim())}
                  sx={{
                    letterSpacing: '4px',
                    '& .MuiInputBase-root': { fontSize: '1.5rem' }
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="text_contained" onClick={onEnableClicked}>
                    Enable
                  </Button>
                  <Button variant="outlined" onClick={() => setWantsToEnroll(false)}>
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </Stack>
          )
          :

          error ? (
            <>
              <Typography variant='body2' color="error">{error}</Typography>
              <Button variant='text_contained' onClick={signOut}>Return</Button>
            </>
          )
            :
            <Stack sx={{ maxWidth: 400, gap: 2 }}>
              <Typography>We require all administrators to enable Multi-Factor Authentication</Typography>
              <Stack direction='row' gap={1}>
                <Button variant='text_contained' onClick={() => setWantsToEnroll(true)}>Enable</Button>
                <Button variant='outlined' onClick={signOut}>Cancel</Button>
              </Stack>
            </Stack>
      }
    </Box >
  );
}
