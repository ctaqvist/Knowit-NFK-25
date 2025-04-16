import { Review } from '@/types/types';
import { Box, Typography } from '@mui/material';

export const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <Box
      sx={{
        width: 342,
        gap: '14px',
        display: 'flex',
        textAlign: 'center',
        p: '30px 28px 36px 28px',
        backgroundColor: 'rgb(255 255 255/ 10%)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '14px',
        transition: 'background-color 150ms',
        flexDirection: 'column',
        height: 185,
        backdropFilter: 'blur(7.5px)',
        border: '1px solid rgba(188, 197, 255, 0.8)',
        '&:hover': { backgroundColor: 'rgba(188, 197, 255, 0.24)' }, // Hover state
      }}
    >
      <Typography // Client Name
        variant='caption'
        sx={{
          fontSize: 20,
          fontWeight: 500,
          textTransform: 'uppercase',
          lineHeight: 1.1,
        }}
      >
        {review.client}
      </Typography>
      <Typography // Content of review
        variant='body1'
        sx={{ fontSize: 16, fontWeight: 400, lineHeight: 1.3 }}
      >{`“${review.content}”`}</Typography>
    </Box>
  );
};
