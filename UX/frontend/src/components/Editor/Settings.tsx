import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import {
  Box,
  Button,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Factor } from '@supabase/supabase-js';

function Settings() {
  const { signOut } = useAuth();
  const [factors, setFactors] = useState<Factor[]>([]);

  // List all factors
  async function listFactors() {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw new Error(`Auth error: ${error}`);
    return data;
  }

  // List factors upon mount
  useEffect(() => {
    if (factors.length < 1) listFactors().then(data => setFactors(data.totp))
  }, [])

  // Remove MFA Factor
  async function unEnroll(id: string) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (error) console.error(error);
    await supabase.auth.refreshSession()
    signOut().then(() => window.location.reload())
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
        {factors.length > 0 && (
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
          </>
        )}
      </Box>
    </Stack>
  );
}

export default Settings;
