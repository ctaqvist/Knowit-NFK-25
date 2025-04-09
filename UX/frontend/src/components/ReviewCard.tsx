import { FormattedReview } from '@/types/types';
import { Box, Typography } from '@mui/material';

export const ReviewCard = ({ review }: { review: FormattedReview }) => {
  return (
    <Box
      sx={{ maxWidth: 400, gap: 6, display: 'flex', textAlign: 'center' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 200
      }}>
        <Typography variant='body1'
          sx={{
            fontStyle: 'italic',
            fontSize: '1.2rem',
            fontWeight: 100,
            mb: 1
          }}
        >{`“${review.content}”`}</Typography>
        <Typography variant='caption' sx={{
          fontSize: '0.9rem',
          fontWeight: 700
        }}>
          {review.client}
        </Typography>
      </Box>
    </Box>
  );
};
