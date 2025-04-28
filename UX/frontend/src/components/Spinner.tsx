import { Box, CircularProgress } from '@mui/material';

function Spinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '500px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default Spinner;
