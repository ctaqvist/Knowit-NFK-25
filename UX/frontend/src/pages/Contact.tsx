import CountrySelect from '@/components/CountrySelect';
import BasicDateCalendar from '@/components/DateCalendar';
import Icon from '@/components/Icon';
import { ContactForm } from '@/types/types';
import { timeSlots } from '@/utils/data/contact';
import { formatDate } from '@/utils/format';
import {
  Box,
  Button,
  Collapse,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

function Contact() {
  const [wantsToBook, setWantsToBook] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    surName: '',
    companyName: '',
    email: '',
    telephone: {
      code: 'SE',
      label: 'Sweden',
      phone: '+46',
      number: '',
    },
    businessField: '',
    message: '',
    booking: null,
  });

  useEffect(() => {
    if (!wantsToBook) return resetBooking();
    setFormData({ ...formData, ['booking']: { date: '', time: '' } });
  }, [wantsToBook]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //const isValid = validateInput(name, value);
    setFormData({ ...formData, [name]: value as string });
    //setFormValidity({ ...formValidity, [name]: isValid });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    //const isValid = validateInput(name, value as string)
    setFormData({ ...formData, [name]: value as string });
    //setFormValidity({ ...formValidity, [name]: isValid });
  };

  const handleUpdateTime = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    setFormData({
      ...formData,
      ['booking']: {
        date: formData?.booking?.date ?? null,
        time: (e.target as HTMLButtonElement).value,
      },
    });
  };

  const resetBooking = () => {
    setFormData({ ...formData, ['booking']: null });
  };

  useEffect(() => {
    if (wantsToBook) {
      console.log('Date: ', formData.booking?.date);
    }
  }, [formData.booking?.date]);

  return (
    <Box
      id='contact'
      sx={{
        maxWidth: 847,
        pt: '230px',
        justifySelf: 'center',
        width: '100%',
        minHeight: 1254,
      }}
    >
      <Typography
        component={'h1'}
        textAlign={'center'}
        variant='h2'
        mb={'90px'}
      >
        Get in touch!
      </Typography>

      <Stack
        sx={{
          '& > .MuiStack-root': { gap: '20px', flexDirection: 'row' },
          '& > .MuiStack-root > .MuiStack-root': {
            gap: '16px',
            flex: 1,
            position: 'relative',
            zIndex: 2
          },
          gap: '56px',
          pb: '230px',

          '.MuiTextField-root': { height: 64 },
        }}
      >
        <Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='firstName'
            >
              Name{' '}
              <Box
                component='span'
                color='main.error'
              >
                {' '}
                *
              </Box>
            </Typography>
            <TextField
              onChange={handleInputChange}
              id='firstName'
              placeholder='Enter your name'
              variant='outlined'
              required
              value={formData.firstName}
              name='firstName'
            />
          </Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='surName'
            >
              Surname{' '}
              <Box
                component='span'
                color='main.error'
              >
                {' '}
                *
              </Box>
            </Typography>
            <TextField
              onChange={handleInputChange}
              id='surName'
              placeholder='Enter your name'
              variant='outlined'
              required
              value={formData.surName}
              name='surName'
            />
          </Stack>
        </Stack>

        <Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='companyName'
            >
              Company name{' '}
              <Box
                component='span'
                color='main.error'
              >
                {' '}
                *
              </Box>
            </Typography>
            <TextField
              onChange={handleInputChange}
              id='companyName'
              placeholder='Enter company name'
              variant='outlined'
              required
              value={formData.companyName}
              name='companyName'
            />
          </Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='email'
            >
              E-mail{' '}
              <Box
                component='span'
                color='main.error'
              >
                {' '}
                *
              </Box>
            </Typography>
            <TextField
              onChange={handleInputChange}
              id='email'
              placeholder='Enter your e-mail'
              variant='outlined'
              required
              value={formData.email}
              name='email'
            />
          </Stack>
        </Stack>

        <Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='country-select'
            >
              Telephone
            </Typography>
            <CountrySelect
              setFormData={setFormData}
              formData={formData}
            />
          </Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='businessField'
            >
              Business Field{' '}
              <Box
                component='span'
                color='main.error'
              >
                {' '}
                *
              </Box>
            </Typography>
            <Select
              defaultValue={'Select an option'}
              id='businessField'
              IconComponent={KeyboardArrowDownRoundedIcon}
              onChange={handleSelectChange}
              name='businessField'
            >
              <MenuItem
                disabled
                value='Select an option'
                sx={{ display: 'none' }}
              >
                Select an option
              </MenuItem>
              <MenuItem value='Mining & Resource Extraction'>
                Mining & Resource Extraction
              </MenuItem>
              <MenuItem value='Construction & Infrastructure'>
                Construction & Infrastructure
              </MenuItem>
              <MenuItem value='Space Logistics & Maintenance'>
                Space Logistics & Maintenance
              </MenuItem>
              <MenuItem value='Scientific Research'>
                Scientific Research
              </MenuItem>
              <MenuItem value='Energy Sector'>Energy Sector</MenuItem>
              <MenuItem value='Agriculture & Terraforming'>
                Agriculture & Terraforming
              </MenuItem>
              <MenuItem value='Other'>Other (specify in message)</MenuItem>
            </Select>
          </Stack>
        </Stack>
        <Stack>
          <Stack>
            <Typography
              variant='subheading2'
              component='label'
              htmlFor='message'
            >
              Message{' '}
              <Box
                component='span'
                color='main.error'
              >
                {' '}
                *
              </Box>
            </Typography>
            <TextField
              onChange={handleInputChange}
              multiline
              rows={10}
              sx={{ minHeight: '304px !important' }}
              id='firstName'
              placeholder='Enter your name'
              variant='outlined'
              required
              value={formData.message}
              name='message'
            />
          </Stack>
        </Stack>

        <Stack sx={{ gap: '36px', position: 'relative', zIndex: 5 }}>
          <Stack
            direction={'row'}
            sx={{ gap: '40px !important', }}
          >
            <Button
              onClick={() => setWantsToBook(!wantsToBook)}
              sx={{
                width: 88,
                height: 88,
                border: '1px solid #BCC5FF',
                padding: '20px',
                backgroundColor: 'rgba(188, 197, 255, 0.10)',
                borderRadius: '10px',
                position: 'relative',
                zIndex: 5
              }}
            >
              <Box
                sx={{
                  transform: wantsToBook ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 200ms',
                }}
              >
                <Icon
                  src='/src/assets/Plus.svg'
                  width='48px'
                  height='48px'
                />
              </Box>
            </Button>
            <Stack>
              <Typography variant='subheading2'>
                Want to book a consultation?
              </Typography>
              <Typography
                variant='body2'
                maxWidth={494}
              >
                A consultation provides expert insights into our interplanetary
                rovers to help you explore with confidence.
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Collapse in={wantsToBook}>
          <Stack
            sx={{
              flexDirection: 'column !important', gap: '48px !important',
              transition: 'height 200ms',
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: '42px !important',
                transition: 'top 50ms',
                opacity: wantsToBook ? 1 : 0,
                // Container styling
                '& > .MuiStack-root': { gap: '36px !important', zIndex: 2, position: 'relative' },
              }}
            >
              <Stack sx={{ width: 370 }}>
                <Stack>
                  <Typography variant='subheading2'>Select a date</Typography>
                  <Typography variant='body3'>Monday - Friday</Typography>
                </Stack>
                <BasicDateCalendar
                  setFormData={setFormData}
                  formData={formData}
                />
              </Stack>

              <Stack sx={{ maxWidth: 434 }}>
                <Stack>
                  <Typography variant='subheading2'>
                    Select a time slot
                  </Typography>
                  <Typography variant='body3'>
                    UTC +1:00 (CET - Sweden)
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    gap: '40px',
                    justifyContent: 'space-between',
                  }}
                >
                  {timeSlots.map((slot) => (
                    <Button
                      variant='outlined'
                      key={slot}
                      value={slot}
                      onClick={handleUpdateTime}
                      sx={{
                        backgroundColor:
                          formData.booking?.time === slot
                            ? 'rgba(85, 38, 255, 1)'
                            : 'rgba(188, 197, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(188, 197, 255, 1)',
                        padding: '16px',
                        borderRadius: '10px',
                        width: 197,
                        fontFamily: 'Instrument Sans, sans-serif',
                        fontSize: 18,
                        fontWeight: 400,
                      }}
                    >
                      {slot}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            <Collapse in={formData.booking?.date && formData.booking.time ? true : false}>
              {formData.booking && formData.booking.date && formData.booking.time &&
                <Stack sx={{ gap: '8px !important' }}>
                  <Typography variant='subheading2'>Selected slot:</Typography>
                  <Stack sx={{ flexDirection: 'row', gap: '10px' }}>
                    <Typography
                      variant='body2'
                      component='p'
                    >
                      <Typography
                        fontWeight={700}
                        variant='body2'
                        component={'span'}
                      >
                        Day:{' '}
                      </Typography>
                      {formatDate(formData?.booking?.date)}
                    </Typography>
                    <Typography
                      variant='body2'
                      component='p'
                    >
                      <Typography
                        fontWeight={700}
                        variant='body2'
                        component={'span'}
                      >
                        Time:{' '}
                      </Typography>
                      {formData.booking?.time}
                    </Typography>
                  </Stack>
                </Stack>
              }

            </Collapse>
          </Stack>
        </Collapse>

        <Button
          variant='contained'
          size='small'
          sx={{ mt: '24px' }}
        >
          Submit the form
        </Button>
      </Stack>
      {/* Decorative Elements */}
      <Box
        aria-hidden='true'
        id='left-gradient'
        sx={{
          zIndex: 0,
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
          overflow: 'hidden',
          zIndex: 0,
          bottom: '-200px',
          position: 'absolute',
          right: 0,
          width: 428,
        }}
      >
        <Box
          sx={{
            width: 909,
            height: 910,
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(85, 38, 255, 0.70) 0%, rgba(24, 7, 87, 0.00) 100%)',
          }}
        />
      </Box>
    </Box >
  );
}

export default Contact;
