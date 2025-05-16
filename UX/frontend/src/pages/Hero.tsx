import { Box, Button, Link, Typography } from '@mui/material';
import { useContent } from '../hooks/useContent';
import { Marquee } from '@/components/magicui/marquee';
import { ReviewCard } from '@/components/ReviewCard';
import { useNavigate } from 'react-router';

function Hero() {
  const { reviews } = useContent();
  const navigate = useNavigate();

  // Split reviews in two rows
  const firstRow = reviews?.slice(0, reviews?.length / 2);
  const secondRow = reviews?.slice(reviews?.length / 2);

  return (
    <Box
      sx={{
        '& section': { minHeight: '500px' },
      }}
    >
      <Box
        // Banner Section
        component='section'
        id='hero_banner'
        sx={{ minHeigth: 1000, width: '100vw', position: 'relative' }}
      >
        <img
          style={{ width: '100%' }}
          src={`${import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/images//new_hero.png`}
          alt=''
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            width: '74%',
            position: 'absolute',
            top: '38%',
            left: '11vw',
            height: '24.9%',
          }}
        >
          <Typography
            variant='h1'
            color='text.primary'
            sx={{ fontSize: 'clamp(18px, 2.1vw, 168px)' }}
          >
            TERRA-X9 Interplanetary Rover
          </Typography>
          <Typography
            variant='body1'
            color='text.primary'
            sx={{
              mt: '16px',
              maxWidth: '56%',
              fontSize: 'clamp(14px, 1.2vw, 2rem)',
              mb: '2vw',
            }}
          >
            <Typography
              sx={{ display: 'inline-block', fontSize: 'inherit' }}
              fontWeight={700}
              component={'span'}
            >
              TERRA-X9
            </Typography>{' '}
            produce all-terrain, real-time controlled interplanetary rovers with
            360° vision, smart object collection, and seamless wireless
            control—right from your device.
          </Typography>
          <Button
            onClick={() => navigate('/product')}
            variant='contained'
            sx={{
              zIndex: 2,
              fontSize: 'clamp(14px, 1vw, 30px)',
              paddingLeft: 'clamp(18px, 1vw, 28px)',
              paddingRight: 'clamp(18px, 1vw, 28px)',
              paddingTop: 'clamp(10px, 1vw, 20px)',
              paddingBottom: 'clamp(10px, 1vw, 20px)',
            }}
          >
            More about the rover
          </Button>
        </Box>
      </Box>
      {/* Reviews section */}
      <Box
        component='section'
        id='reviews'
        position='relative'
        sx={{
          backgroundImage:
            'url("https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images//gabriele-garanzelli-PzO_CitnJdI-unsplash%201-3%203.png")',
          height: 1080,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          // Decorative element top
          role='presentation'
          sx={{
            height: 151,
            background:
              'linear-gradient(0deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.51) 25.48%, rgba(5, 3, 12, 0.83) 59.13%, #05030C 98.08%)',
          }}
        />

        <Box>
          <Typography
            variant='h2'
            sx={{ textAlign: 'center', mb: '114px' }}
          >
            Our clients reviews
          </Typography>
          <Box
            sx={{
              gap: '30px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <Box
              // Decorative element left
              aria-hidden='true'
              sx={{
                width: '20vw',
                height: '100%',
                background:
                  'linear-gradient(-90deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.53) 24.04%, rgba(5, 3, 12, 0.83) 43.75%, #05030C 76.92%)',
                position: 'absolute',
                left: 0,
                zIndex: 3,
              }}
            />

            <Marquee
              pauseOnHover={true}
              className='w-full p-0 pt-1'
            >
              {firstRow?.map((review) => (
                <ReviewCard
                  key={review.client}
                  review={review}
                />
              ))}
            </Marquee>
            <Marquee
              pauseOnHover={true}
              className='w-full p-0 pb-1'
              reverse={true}
            >
              {secondRow?.map((review) => (
                <ReviewCard
                  key={review.client}
                  review={review}
                />
              ))}
            </Marquee>
            <Box
              // Decorative element right
              role='presentation'
              sx={{
                width: '20vw',
                maxWidth: 428,
                height: '100%',
                background:
                  'linear-gradient(90deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.53) 24.04%, rgba(5, 3, 12, 0.83) 43.75%, #05030C 76.92%)',
                position: 'absolute',
                right: 0,
                zIndex: 3,
              }}
            />
          </Box>
        </Box>
        <Box
          // Decorative element
          aria-hidden='true'
          sx={{
            height: 151,
            background:
              'linear-gradient(180deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.51) 25.48%, rgba(5, 3, 12, 0.83) 59.13%, #05030C 98.08%)',
          }}
        />
      </Box>

      {/* Interested In Purchasing Section */}
      <Box
        component='section'
        id='interested_in_purchasing'
        sx={{ height: 999, position: 'relative' }}
      >
        {/* Decorative: Background gradients + Design element */}
        <Box
          aria-hidden='true'
          id='left-gradient'
          sx={{
            width: 805,
            height: 805,
            position: 'absolute',
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(85, 38, 255, 0.70) 0%, rgba(24, 7, 87, 0.00) 100%)',
            left: 'calc(-1 * ((910px / 2) + 50px))',
            top: '-89px',
          }}
        />
        <Box
          aria-hidden='true'
          id='right-gradient'
          sx={{
            width: 910,
            height: 910,
            position: 'absolute',
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(85, 38, 255, 0.70) 0%, rgba(24, 7, 87, 0.00) 100%)',
            right: 'calc(-1 * (910px / 2))',
            bottom: '-200px',
            zIndex: 2,
          }}
        />
        <Box
          aria-hidden='true'
          sx={{
            position: 'absolute',
            backgroundImage:
              'url("https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images//design_el.png")',
            width: 579,
            height: 387,
            backgroundPosition: 'bottom',
            zIndex: 4,
            right: '17.03vw',
            top: '313.55px',
          }}
        />

        <Box
          // Interested in purchasing 'Content of value'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              zIndex: 3,
              width: 'clamp(200px, 80vw, 1276px)',
            }}
          >
            <Typography
              variant='h2'
              color='text.main'
            >
              Curious about what’s next?
            </Typography>
            <Typography
              variant='body1'
              color='text.main'
              sx={{ maxWidth: 724 }}
            >
              Reach out to request the full brief and, if you're ready to dive
              deeper, book a consultation with our team. We'll walk you through
              the rover’s core technologies, mission capabilities, and how it
              fits into the future of space mobility.
            </Typography>
            <Link
              variant='button'
              href='/contact'
            >
              Get in touch
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
