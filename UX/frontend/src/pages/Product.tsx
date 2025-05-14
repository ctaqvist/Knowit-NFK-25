import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Spinner from '@/components/Spinner';
import { featureData } from '@/utils/data/product';
import Icon from '@/components/Icon';
import { useNavigate } from 'react-router';

function Product() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setModalOpen(false);

  function expandGalleryMedia(src: string) {
    setLoading(true);
    setModalSrc(src);
    setModalOpen(true);
  }

  // Modal Style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  };

  return (
    <>
      {/* Feature section */}
      <Stack
        component={'section'}
        sx={{
          height: 1085,
          backgroundImage: `url("${import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/images//feature_section.png")`,
          backgroundPositionX: 'center',
          backgroundSize: 'cover',
        }}
      >
        <Typography
          variant='h2'
          sx={{
            top: 162,
            justifySelf: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          Main features
        </Typography>

        {featureData.map((feature) => (
          <Stack
            key={feature.title}
            sx={{
              position: 'absolute',
              minWidth: 150,
              textWrap: 'pretty',
              lineHeight: 'normal',
              gap: '6px',
              ...feature.style,
            }}
          >
            <Stack
              direction='row'
              alignItems={'center'}
              gap={'6px'}
            >
              <Icon src={`/src/assets/${feature.icon}`} />
              <Typography variant='subheading2'>{feature.title}</Typography>
            </Stack>
            <Typography variant='body3'>{feature.details}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* Statistics Section */}
      <Stack
        component={'section'}
        sx={{
          gap: '100px',
          height: 1311,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url("${import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/images//ivana-cajina-asuyh-_ZX54-unsplash%20(1)%201-3%202.png")`,
          backgroundSize: 'contain',
          position: 'relative',
        }}
      >
        <Box
          role='presentation'
          sx={{
            height: 196,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            background:
              'linear-gradient(180deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.89) 78.85%, #05030C 98.08%)',
          }}
        />
        <Box
          role='presentation'
          sx={{
            height: 196,
            width: '100%',
            position: 'absolute',
            top: 0,
            background:
              'linear-gradient(0deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.89) 78.85%, #05030C 98.08%)',
          }}
        />
        <Typography variant='h2'>Terra X9 in numbers</Typography>

        {/* Planets */}
        <Stack
          sx={{ height: 651, justifyContent: 'center', textAlign: 'center' }}
        >
          <Stack
            direction={'row'}
            id='planets'
            sx={{ gap: '120px', alignItems: 'center', position: 'relative' }}
          >
            <Box position={'relative'} className='planet-wrapper'>
              <video
                autoPlay
                muted
                loop
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images//planet_1_greyscale.mp4`}
                style={{
                  clipPath: 'circle(49% at center)',
                  width: 104,
                  height: 102.667,
                  zIndex: 2,
                  position: 'relative',
                }}
              />
              <Stack
                sx={{
                  position: 'absolute',
                  alignItems: 'center',
                  gap: '24px',
                  top: '-220px',
                  left: '-62px',
                }}
              >
                <Stack
                  width={230}
                  gap={'8px'}
                >
                  <Typography
                    variant='subheading2'
                    fontWeight={400}
                    fontSize={28}
                    letterSpacing={'2.8px'}
                  >
                    ≥3.0h
                  </Typography>
                  <Typography variant='subheading2'>Battery Life</Typography>
                </Stack>
                <Box
                  role='presentation'
                  sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }}
                />
              </Stack>
            </Box>
            <Box className='planet-wrapper'>
              <video
                autoPlay
                muted
                loop
                className='planet'
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images//planet_2_greyscale.mp4`}
                style={{
                  clipPath: 'circle(49% at center)',
                  width: 131.401,
                  height: 129.377,
                  zIndex: 2,
                  position: 'relative',
                }}
              />
              <Stack
                sx={{
                  position: 'absolute',
                  alignItems: 'center',
                  gap: '24px',
                  bottom: '-220px',
                  left: '-69px',
                  flexDirection: 'column-reverse',
                }}
              >
                <Stack
                  width={270}
                  gap={'8px'}
                >
                  <Typography variant='subheading2'>
                    Arm Rotation Range
                  </Typography>
                  <Typography variant='subheading2'>360°</Typography>
                </Stack>
                <Box
                  role='presentation'
                  sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }}
                />
              </Stack>
            </Box>
            <Box className='planet-wrapper'>
              <video
                autoPlay
                muted

                loop
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images//planet_1_greyscale.mp4`}
                style={{
                  clipPath: 'circle(49% at center)',
                  width: 191,
                  height: 188.551,
                  zIndex: 2,
                  position: 'relative',
                }}
              />
              <Stack
                sx={{
                  position: 'absolute',
                  alignItems: 'center',
                  gap: '24px',
                  top: '-220px',
                  left: '-24px',
                }}
              >
                <Stack
                  width={240}
                  gap={'8px'}
                >
                  <Typography
                    variant='subheading2'
                    fontWeight={400}
                    letterSpacing={'2.8px'}
                    fontSize={28}
                  >
                    1080px
                  </Typography>
                  <Typography variant='subheading2'>
                    Camera Resolution
                  </Typography>
                </Stack>
                <Box
                  role='presentation'
                  sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }}
                />
              </Stack>
            </Box>
            <Box className='planet-wrapper'>
              <video
                autoPlay
                muted
                loop
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images//planet_2_greyscale.mp4`}
                style={{
                  clipPath: 'circle(49% at center)',
                  width: 131.401,
                  height: 129.377,
                  zIndex: 2,
                  position: 'relative',
                }}
              />
              <Stack
                sx={{
                  position: 'absolute',
                  alignItems: 'center',
                  gap: '24px',
                  bottom: '-220px',
                  left: '-69px',
                  flexDirection: 'column-reverse',
                }}
              >
                <Stack
                  width={270}
                  gap={'8px'}
                >
                  <Typography variant='subheading2'>
                    Wireless connection
                  </Typography>
                  <Typography variant='subheading2'>150–300m</Typography>
                </Stack>
                <Box
                  role='presentation'
                  sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }}
                />
              </Stack>
            </Box>
            <Box className='planet-wrapper'>
              <video
                autoPlay
                muted
                loop
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images//planet_1_greyscale.mp4`}
                style={{
                  clipPath: 'circle(49% at center)',
                  width: 104,
                  height: 102.667,
                  zIndex: 2,
                  position: 'relative',
                }}
              />
              <Stack
                sx={{
                  position: 'absolute',
                  alignItems: 'center',
                  gap: '24px',
                  top: '-220px',
                  left: '-62px',
                }}
              >
                <Stack
                  width={230}
                  gap={'8px'}
                >
                  <Typography
                    variant='subheading2'
                    fontWeight={400}
                    letterSpacing={'2.8px'}
                    fontSize={28}
                  >
                    2.0 m/s
                  </Typography>
                  <Typography variant='subheading2'>Max Speed</Typography>
                </Stack>
                <Box
                  role='presentation'
                  sx={{ width: '1px', height: 110, backgroundColor: '#FFF' }}
                />
              </Stack>
            </Box>
          </Stack>
          <Box
            sx={{
              height: '1px',
              width: '100%',
              border: '1px dashed rgba(255,255,255,0.4)',
              position: 'absolute',
              maxWidth: 1280,
              alignSelf: 'center',
              zIndex: 1,
              '&::before': {
                width: '10px',
                height: '10px',
                content: '""',
                backgroundColor: '#FFF',
                display: 'block',
                left: '-7px',
                top: '-5px',
                position: 'relative',
                borderRadius: '20px',
              },
              '&::after': {
                width: '10px',
                height: '10px',
                content: '""',
                backgroundColor: '#FFF',
                display: 'block',
                right: '-7px',
                top: '-5px',
                position: 'absolute',
                borderRadius: '20px',
              },
            }}
          />
        </Stack>
      </Stack>

      {/* Get in touch */}
      <Stack
        component='section'
        sx={{
          backgroundImage: `url("${import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/images//get_in_touch.png")`,
          height: 1160,
          width: '100%',
        }}
      >
        <Stack sx={{ width: '74%', m: 'auto', height: 590 }}>
          <Stack sx={{ mb: '64px', gap: '16px' }}>
            <Typography variant='subheading'>TERRA-X9 Wireless</Typography>
            <Typography
              variant='body1'
              sx={{ maxWidth: 738 }}
            >
              The Terra-X9 wireless tablet control system provides a stable
              connection with less than 0.1 seconds latency anywhere in the
              world, intuitive touchscreen navigation, and multi-device
              collaboration — all protected by fail-safe protocols.
            </Typography>
          </Stack>
          <Stack sx={{ mb: '40px', gap: '16px' }}>
            <Typography
              variant='subheading'
              sx={{ maxWidth: { xs: 300, md: '100%' } }}
            >
              Want to explore further?
            </Typography>
            <Typography
              variant='body1'
              sx={{ maxWidth: { xs: 400, lg: 588 } }}
            >
              Our team will guide you through the rover’s capabilities, core
              technologies, and how it fits your mission needs.
            </Typography>
          </Stack>
          <Button
            variant='contained'
            onClick={() => navigate('/contact')}
          >
            Get in touch
          </Button>
        </Stack>
      </Stack>

      {/* Gallery */}
      <Stack
        component={'section'}
        sx={{
          backgroundImage: `url("${import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/images//ivana-cajina-asuyh-_ZX54-unsplash%20(1)%201-3%202.png")`,
          backgroundSize: 'contain',
          backgroundPosition: 'left',
          textAlign: 'center',
          gap: '100px',
          pt: '29px',
          position: 'relative',
        }}
      >
        <Box
          role='presentation'
          sx={{
            height: 196,
            width: '100%',
            position: 'absolute',
            top: 0,
            background:
              'linear-gradient(0deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.89) 78.85%, #05030C 98.08%)',
          }}
        />
        <Typography
          variant='h2'
          sx={{ zIndex: 5, position: 'relative' }}
        >
          Gallery
        </Typography>

        <Box
          sx={{
            '& .MuiBox-root': { borderRadius: '6px', overflow: 'hidden' },
            maxWidth: 1064,
            height: 628,
            gap: '20px',
            alignSelf: 'center',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'repeat(12, 1fr)',
            display: 'grid',
            '& > .MuiButtonBase-root': { p: 0 },
            '& img': { height: '100%' },
          }}
        >
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/0.jpg'
              )
            }
            sx={{ gridColumn: 1, gridRow: '1 / span 4', p: 0 }}
          >
            <img
              src={`${import.meta.env.VITE_SUPABASE_URL
                }/storage/v1/object/public/images/gallery/0.png`}
            />
          </Button>
          <Button
            sx={{ gridColumn: 1, gridRow: '5 / span 4' }}
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/1.jpg'
              )
            }
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/1.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/2.jpg'
              )
            }
            sx={{ gridColumn: 1, gridRow: '9 / span 4' }}
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/2.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/grid_video.mp4'
              )
            }
            sx={{
              gridColumn: '2 / span 2',
              gridRow: '1 / span 6',
              overflow: 'hidden',
              borderRadius: '6px',
            }}
          >
            <Box sx={{ height: '100%' }}>
              <video
                autoPlay
                muted
                loop
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/grid_video.mp4`}
                style={{
                  objectFit: 'cover',
                  height: '100%',
                }}
              />
            </Box>
          </Button>
          <Button
            sx={{ gridColumn: 2, gridRow: '7 / span 6' }}
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/4.jpg'
              )
            }
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/4.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/5.jpg'
              )
            }
            sx={{ gridColumn: 4, gridRow: '1 / span 3' }}
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/5.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/6.jpg'
              )
            }
            sx={{ gridColumn: 4, gridRow: '4 / span 3' }}
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/6.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/7.jpg'
              )
            }
            sx={{ gridColumn: '3 / span 2', gridRow: '7 / span 6' }}
          >
            <Box sx={{ height: '100%', }}>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/7.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/8.jpg'
              )
            }
            sx={{ gridColumn: '5', gridRow: '1 / span 6' }}
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/8.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/9.jpg'
              )
            }
            sx={{ gridColumn: '5', gridRow: '7 / span 3' }}
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/9.png`}
              />
            </Box>
          </Button>
          <Button
            onClick={() =>
              expandGalleryMedia(
                'https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images/gallery/full/10.jpg'
              )
            }
            sx={{ gridColumn: '5', gridRow: '10 / span 3' }}
          >
            <Box>
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL
                  }/storage/v1/object/public/images/gallery/10.png`}
              />
            </Box>
          </Button>
        </Box>

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
      {/* MODAL: Shows enlarged image */}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box sx={{ style, display: 'flex', position: 'relative' }}>
          {loading && <Spinner />}
          {modalSrc.endsWith('mp4') ? (
            <video
              autoPlay
              muted
              loop
              src={modalSrc}
              onCanPlay={() => setLoading(false)}
            />
          ) : (
            <img
              onLoad={() => setLoading(false)}
              style={{ maxHeight: '80vh' }}
              src={modalSrc}
            />
          )}
          {modalSrc && !loading && (
            <IconButton
              onClick={() => setModalOpen(false)}
              sx={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Product;
