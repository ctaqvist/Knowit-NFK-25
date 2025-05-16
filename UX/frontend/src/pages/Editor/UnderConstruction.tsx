import { Stack, Typography } from '@mui/material';
import claw_arm from '../../assets/claw_arm_full.svg'


function UnderConstruction() {
  return (
    <Stack sx={{ width: 750, alignItems: 'center', gap: '29px', m: 'auto', justifyContent: 'center', minHeight: 600 }}>
      <img style={{ width: 300 }} src={claw_arm} />
      <Typography variant='h1' component='span'>Under Construction</Typography>
    </Stack>
  )
}

export default UnderConstruction