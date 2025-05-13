import { Stack, Typography } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { FAQ } from '@/types/types';

type RenderQuestionProps = {
  entry: FAQ,
  handleClick: (faq: FAQ & { isNew: boolean }) => void;
  selectedId: string | null
}

export const RenderQuestion = ({ entry, handleClick, selectedId }: RenderQuestionProps) => (
  <Stack
    key={entry.question}
    component={'button'}
    className={selectedId === entry.id ? 'FAQ-selected' : ''}
    data-id={entry.id}
    onClick={() =>
      handleClick({
        question: entry.question,
        answer: entry.answer,
        isNew: false,
        id: entry.id,
        category: entry.category
      })
    }
    sx={{
      gap: '16px',
      padding: '28px',
      flexDirection: 'row',
      borderRadius: '10px',
      backgroundColor: 'rgba(188, 197, 255, 0.10)',
      backdropFilter: 'blur(20px)',
      textAlign: 'start',
      '&:hover': { cursor: 'pointer' },
    }}
  >
    <MenuRoundedIcon />
    <Stack gap={'14px'}>
      <Typography
        variant='body2'
        fontWeight={700}
      >
        {entry.question}
      </Typography>
      <Typography variant='body2'>{entry.answer}</Typography>
    </Stack>
  </Stack>
);
