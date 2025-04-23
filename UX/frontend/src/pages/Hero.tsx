import { Box, Button, Typography } from '@mui/material';
import { useContent } from '../hooks/useContent';
import { Marquee } from '@/components/magicui/marquee';
import { ReviewCard } from '@/components/ReviewCard';

function Hero() {
  const { pages, reviews } = useContent();

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
        sx={{ height: 1000, position: 'relative' }}>

        {/* Video */}
        <video autoPlay loop muted style={{ height: 1000 }} src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//hero_banner.mp4`} />
        <Box aria-hidden='true'
          sx={{ height: 150, width: '100%', background: 'linear-gradient(0deg, #05030C, rgba(0,0,0,0))', position: 'absolute', bottom: 0 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'center', md: 'end' },
            margin: '0 auto',
            width: 'clamp(200px, 80vw, 1276px)',
            textAlign: { xs: 'center', sm: 'center', md: 'end' },
            position: 'absolute', top: 479, right: 'clamp(5vw, 10vw, 321px)'
          }}
        >
          <Typography
            variant='h1'
            color='text.primary'
          >
            {pages?.hero?.banner?.heading?.value ?? 'Seamless Pickup, Beyond Planets'}
          </Typography>
          <Typography
            variant='body1'
            color='text.primary'
            sx={{
              mt: '16px',
              maxWidth: 629,
              fontSize: 20,
              lineHeight: '30px',
              mb: '32px',
            }}
          >
            TERRA-X9 produce all-terrain, real-time controlled interplanetary
            rovers with 360° vision, smart object collection, and seamless
            wireless control—right from your device.
          </Typography>
          <Button variant='contained'>Discover more</Button>
        </Box>
      </Box>
      <Box
        // Interested in purchasing Section
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
              Interested in purchasing?
            </Typography>
            <Typography
              variant='body1'
              color='text.main'
              sx={{ maxWidth: 724 }}
            >
              Book a consultation through our contact form, and we’ll help you
              through the next step of purchasing interplanetary rover TERRA-X9
              with confidence!
            </Typography>
            <Button variant='contained'>BOOK A CONSULTATION</Button>
          </Box>
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
          <Box sx={{ gap: '30px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
                zIndex: 3
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
                zIndex: 3
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
    </Box>
  );
}

export default Hero;
