import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import {
  Box,
  Button,
  List,
  ListItem,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AuthMFA from './AuthMFA';
import { Factor } from '@supabase/supabase-js';

function Settings() {
  const { signOut, session, MFAStatus } = useAuth();
  const [qr, setQr] = useState('');
  const [factors, setFactors] = useState<Factor[]>(session?.user.factors ?? []);
  const [hasScanned, setHasScanned] = useState(false);

  // Modal functionality
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    enroll();
  };

  const handleClose = () => {
    setOpen(false);
    if (!MFAStatus) return setHasScanned(false)
  };

  // Enrollment flow
  async function enroll() {
    const newDeviceName = `Device ${factors.length + 1}`;
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'TerraX9',
      friendlyName: newDeviceName,
    });

    if (error && error.status === 422) {
      const deviceToRemove = factors.find(
        (factor) => factor.friendly_name === newDeviceName
      );
      if (!deviceToRemove) throw new Error('Cannot find device to remove')
      unEnroll(deviceToRemove.id);
      return enroll();
    } else if (error) throw new Error(`Auth error: ${error}`);

    if (!data) return;
    setQr(data.totp.qr_code);
  }

  // Listing all factors (testing)
  async function listFactors() {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw new Error(`Auth error: ${error}`);
    return data;
  }

  // Remove MFA Factor
  async function unEnroll(id: string) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (error) console.error(error);
    await supabase.auth.refreshSession()
    listFactors().then((data) => setFactors(data.totp));
  }

  return (
    <Stack
      component='div'
      sx={{
        minHeight: 500,
        maxWidth: 650,
        margin: '0 auto',
        p: 4,
        display: 'flex',
        gap: 4,
      }}
    >
      <Box component='section'>
        <Typography
          variant='h2'
          sx={{ fontSize: '18px', mb: 2 }}
        >
          Options
        </Typography>
        <Button onClick={signOut}>Log out</Button>
      </Box>

      <Box component='section'>
        <Typography
          variant='h2'
          sx={{ fontSize: '18px', mb: 2 }}
        >
          Multi-Factor Authentication
        </Typography>
        <Box sx={{ width: 'fit-content' }}></Box>
        {factors.length > 0 ? (
          <>
            <List>
              {factors.map((factor, index) => (
                <ListItem
                  key={factor.id}
                  sx={{ justifyContent: 'space-between', p: 0 }}
                >
                  <Typography>
                    {factor.friendly_name ?? `Device ${index + 1}`}
                  </Typography>
                  <Button onClick={() => unEnroll(factor.id)}>Remove</Button>
                </ListItem>
              ))}
            </List>
            <Button onClick={handleOpen}>Add Another Device</Button>
          </>
        ) : (
          <Button onClick={handleOpen}>Enable MFA</Button>
        )}
      </Box>

      {/* Modal: Enabling MFA */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            backgroundColor: 'primary.background',
            width: 'fit-content',
            p: 4,
            m: '5rem auto',
          }}
        >
          {qr && !hasScanned && (
            <>
              <img
                src={qr}
                alt=''
                style={{ margin: '0 auto' }}
              />
              <Button onClick={() => setHasScanned(true)}>
                I have scanned the QR Code
              </Button>
            </>
          )}
          {hasScanned && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <AuthMFA onSuccess={() => window.location.reload()} />
            </Box>
          )}
        </Box>
      </Modal>
    </Stack>
  );
}

export default Settings;
