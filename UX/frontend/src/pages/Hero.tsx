import { Box, Button, Typography } from '@mui/material';
import { useContent } from '../hooks/useContent';
import { Marquee } from '@/components/magicui/marquee';
import { ReviewCard } from '@/components/ReviewCard';


function Hero() {
  const { pages, reviews } = useContent()

  return (
    <Box
      sx={{
        '& section': {
          minHeight: '500px',
        },
        '& section:not(#reviews)': {
          p: 4
        }
      }}
    >
      <Box component='section' id='hero_banner'
        sx={{
          //Image is currently static
          backgroundImage: 'url("https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images//actionvance-t7EL2iG3jMc-unsplash%201-2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          height: '700px'
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'end',
            height: '100%',
            textAlign: 'end'
          }}>
          <Typography variant='h1' color='text.light'>{pages?.hero.banner.heading.value}</Typography>
          <Typography variant='body1' color='text.light'
            sx={{
              mt: 2,
              maxWidth: '600px'
            }}
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem hic eveniet, dicta nostrum corporis laudantium architecto inventore ut facilis deserunt sed voluptatum labore itaque unde at cupiditate delectus. Laborum, vel.</Typography>
        </Box>
      </Box>
      <Box component='section' id='find_out_more'>
        <Box>

          <Typography variant='h2' color='text.light'>Leader in the field</Typography>
          <Typography variant='body1' color='text.light'>Using the latest technologies, we've crafted an interstellar experience</Typography>
          <Button variant='contained'>DISCOVER</Button>
        </Box>
      </Box>
      <Box component='section' id='reviews'>
        <Marquee
          className='w-full'
        >{reviews?.map(review => <ReviewCard key={review.client} review={review} />)}</Marquee>
      </Box>
    </Box>
  )
}

export default Hero;