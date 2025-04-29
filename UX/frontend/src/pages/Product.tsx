import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';

function Product() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState('')

  const handleClose = () => setModalOpen(false)

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { src } = e.target as HTMLImageElement
    setModalImg(src)
    setModalOpen(true)
  }

  // Modal Style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };

  return (
    <>
      <Stack component={'section'}
        sx={{
          gap: '179px',
          height: 1920, justifyContent: 'center', alignItems: 'center',
          backgroundImage: `url("${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//ivana-cajina-asuyh-_ZX54-unsplash%20(1)%201-3%202.png")`, backgroundSize: 'contain'
        }}>
        <Typography variant='h2'>Terra X9 in numbers</Typography>

        {/* Planets */}
        <Stack sx={{ height: 651, justifyContent: 'center', textAlign: 'center' }}>
          <Stack direction={'row'} id='planets' sx={{ gap: '120px', alignItems: 'center', position: 'relative' }}>
            <Box position={'relative'}>
              <video autoPlay muted loop src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//planet_1A.mp4`} style={{ clipPath: 'circle(49% at center)', width: 104, height: 102.667, zIndex: 2, filter: 'saturate(100%) saturate(79%) hue-rotate(258deg) brightness(70%) opacity(1) contrast(1)', position: 'relative' }} />
              <Stack sx={{ position: 'absolute', alignItems: 'center', gap: '24px', top: '-220px', left: '-62px' }}>
                <Stack width={230} gap={'8px'}>
                  <Typography variant='subheading2' fontWeight={400} fontSize={28} letterSpacing={'2.8px'}>≥3.0h</Typography>
                  <Typography variant='subheading2'>Battery Life</Typography>
                </Stack>
                <Box role='presentation' sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }} />
              </Stack>
            </Box>
            <Box position={'relative'}>
              <video autoPlay muted loop src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//planet_2A.mp4`} style={{ clipPath: 'circle(49% at center)', width: 131.401, height: 129.377, zIndex: 2, filter: 'saturate(100%) saturate(79%) hue-rotate(258deg) brightness(70%) opacity(1) contrast(1)', position: 'relative' }} />
              <Stack sx={{ position: 'absolute', alignItems: 'center', gap: '24px', bottom: '-220px', left: '-69px', flexDirection: 'column-reverse' }}>
                <Stack width={270} gap={'8px'}>
                  <Typography variant='subheading2'>Arm Rotation Range</Typography>
                  <Typography variant='subheading2'>360°</Typography>
                </Stack>
                <Box role='presentation' sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }} />
              </Stack>
            </Box>
            <Box position={'relative'}>
              <video autoPlay muted loop src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//planet_1A.mp4`} style={{ clipPath: 'circle(49% at center)', width: 191, height: 188.551, zIndex: 2, filter: 'saturate(100%) saturate(79%) hue-rotate(258deg) brightness(70%) opacity(1) contrast(1)', position: 'relative' }} />
              <Stack sx={{ position: 'absolute', alignItems: 'center', gap: '24px', top: '-220px', left: '-24px' }}>
                <Stack width={240} gap={'8px'}>
                  <Typography variant='subheading2' fontWeight={400} letterSpacing={'2.8px'} fontSize={28}>1080px</Typography>
                  <Typography variant='subheading2'>Camera Resolution</Typography>
                </Stack>
                <Box role='presentation' sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }} />
              </Stack>
            </Box>
            <Box position={'relative'}>
              <video autoPlay muted loop src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//planet_2A.mp4`} style={{ clipPath: 'circle(49% at center)', width: 131.401, height: 129.377, zIndex: 2, filter: 'saturate(100%) saturate(79%) hue-rotate(258deg) brightness(70%) opacity(1) contrast(1)', position: 'relative' }} />
              <Stack sx={{ position: 'absolute', alignItems: 'center', gap: '24px', bottom: '-220px', left: '-69px', flexDirection: 'column-reverse' }}>
                <Stack width={270} gap={'8px'}>
                  <Typography variant='subheading2'>Wireless connection</Typography>
                  <Typography variant='subheading2'>150–300m</Typography>
                </Stack>
                <Box role='presentation' sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }} />
              </Stack>
            </Box>
            <Box position={'relative'}>
              <video autoPlay muted loop src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//planet_1A.mp4`} style={{ clipPath: 'circle(49% at center)', width: 104, height: 102.667, zIndex: 2, filter: 'saturate(100%) saturate(79%) hue-rotate(258deg) brightness(70%) opacity(1) contrast(1)', position: 'relative' }} />
              <Stack sx={{ position: 'absolute', alignItems: 'center', gap: '24px', top: '-220px', left: '-62px' }}>
                <Stack width={230} gap={'8px'}>
                  <Typography variant='subheading2' fontWeight={400} letterSpacing={'2.8px'} fontSize={28}>2.0 m/s</Typography>
                  <Typography variant='subheading2'>Max Speed</Typography>
                </Stack>
                <Box role='presentation' sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }} />
              </Stack>
            </Box>
          </Stack>
          <Box sx={{
            height: '1px', width: '100%', border: '1px dashed rgba(255,255,255,0.4)', position: 'absolute', maxWidth: 1280, alignSelf: 'center', zIndex: 1,
            '&::before': { width: '10px', height: '10px', content: '""', backgroundColor: '#FFF', display: 'block', left: '-7px', top: '-5px', position: 'relative', borderRadius: '20px' },
            '&::after': { width: '10px', height: '10px', content: '""', backgroundColor: '#FFF', display: 'block', right: '-7px', top: '-5px', position: 'absolute', borderRadius: '20px' },
          }} />
        </Stack>
      </Stack>

      {/* Gallery */}
      <Stack component={'section'}
        sx={{ backgroundImage: `url("${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images//ivana-cajina-asuyh-_ZX54-unsplash%20(1)%201-3%202.png")`, backgroundSize: 'contain', backgroundPosition: 'left', textAlign: 'center', gap: '100px', pt: '29px', position: 'relative' }}>
        <Typography variant='h2'>Gallery</Typography>

        <Box sx={{
          '& > .MuiBox-root': { borderRadius: '6px' }, maxWidth: 1064, height: 628, gap: '20px', alignSelf: 'center',
          gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(12, 1fr)', display: 'grid'
        }}>
          <Button onClick={handleOpen} sx={{ gridColumn: 1, gridRow: '1 / span 4' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_1.png`} />
          </Button>
          <Box sx={{ gridColumn: 1, gridRow: '5 / span 4' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_row_1_2_marek-piwnicki-_1ZZDjSSIHw-unsplash.png`} />
          </Box>
          <Box sx={{ gridColumn: 1, gridRow: '9 / span 4' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_row_1_3_albert-hyseni-qGvaeZRc80w-unsplash.png`} />
          </Box>
          <Box sx={{ gridColumn: '2 / span 2', gridRow: '1 / span 6', overflow: 'hidden' }}>
            <video autoPlay muted loop src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_video.mp4`} style={{ objectFit: 'cover', height: '100%', borderRadius: '6px' }} />
          </Box>
          <Box sx={{ gridColumn: 2, gridRow: '7 / span 6' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_row_2_2.png`} />
          </Box>
          <Box sx={{ gridColumn: 4, gridRow: '1 / span 3' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_col_4.png`} />
          </Box>
          <Box sx={{ gridColumn: 4, gridRow: '4 / span 3' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_col_4_2.png`} />
          </Box>
          <Box sx={{ gridColumn: '3 / span 2', gridRow: '7 / span 3' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_row_3_2sergey-koznov-qimwsOfk1xk-unsplash.png`} />
          </Box>
          <Box sx={{ gridColumn: '5', gridRow: '1 / span 6' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/jonny-caspari-yEgA4vFw198-unsplash.png`} />
          </Box>
          <Box sx={{ gridColumn: '5', gridRow: '7 / span 3' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_col_5_row_3_pascal-bullan-FvjTuvw0TjE-unsplash.png`} />
          </Box>
          <Box sx={{ gridColumn: '5', gridRow: '10 / span 3' }}>
            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/gallery/grid_col_5_row_4_azri-hanafi-41Y5LWOiBR4-unsplash.png`} />
          </Box>
        </Box>

        {/* MODAL: Shows enlarged image */}
        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ style }}>
            <img src={modalImg} />
            <IconButton>

            </IconButton>
          </Box>
        </Modal>


        {/* Decorative element */}
        <Box
          // Decorative element
          aria-hidden='true'
          sx={{
            height: 151,
            background:
              'linear-gradient(180deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.51) 25.48%, rgba(5, 3, 12, 0.83) 59.13%, #05030C 98.08%)',
          }}
        />
      </Stack>


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
    </>
  )
}

export default Product;