import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Icon from '@/components/Icon';
import {
  CustomFile,
  DownloadableFiles,
  SupportForm,
  SupportFormValidity,
} from '@/types/types';
import { contentApi } from '@/api/contentApi';
import React, { useState } from 'react';
import { validateInput, validateSupportForm } from '@/utils/validate';
import FileUpload from '@/components/FileUpload';
import LinearProgress from '@mui/material/LinearProgress';

const INITIAL_FORM_DATA = {
  f_name_input: '',
  s_name_input: '',
  email_input: '',
  serial_input: '',
  issue_category_input: '',
  issue_description_input: '',
  date_input: '',
  fileUploads: {
    loading: false,
    files: [],
  },
};

function Support() {
  const [formData, setFormData] = useState<SupportForm>(INITIAL_FORM_DATA);
  const [alert, setAlert] = useState<{
    show: boolean;
    severity: 'error' | 'success';
    message: string;
    timeout: NodeJS.Timeout | null;
  }>({
    show: false,
    severity: 'success',
    message: '',
    timeout: null,
  });

  const [formValidity, setFormValidity] = useState<SupportFormValidity>({
    f_name_input: undefined,
    s_name_input: undefined,
    email_input: undefined,
    serial_input: undefined,
    issue_category_input: undefined,
    issue_description_input: true,
    date_input: undefined,
  });

  const handleDownload = async (file: DownloadableFiles) => {
    try {
      const response = await contentApi.getFile(file);
      const url = URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isValid = validateInput(name, value) ? undefined : true;
    setFormData({ ...formData, [name]: value as string });
    setFormValidity({ ...formValidity, [name]: isValid });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    const isValid = validateInput(name, value as string) ? undefined : true;
    setFormData({ ...formData, [name]: value as string });
    setFormValidity({ ...formValidity, [name]: isValid });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files) return;
    if (formData.fileUploads.files.length + files.length > 5)
      return showAlert('Maximum of 5 images allowed', 'error');

    setFormData({
      ...formData,
      ['fileUploads']: {
        loading: true,
        files: [...formData.fileUploads.files, ...Array.from(files)],
      },
    });

    // Check file validity
    for (const file of files) {
      checkFile(file as CustomFile);
    }
  };

  async function checkFile(file: CustomFile) {
    const MAX_IMAGE_SIZE_IN_BYTES = 2 * 1024 * 1024;

    try {
      file.loading = true;

      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        throw new Error(
          'The document is not supported, please delete and upload a .png or .jpeg file.'
        );
      }
      if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
        throw new Error('File is too large. Max size is 2MB.');
      }

      file.success = true
    } catch (error: any) {
      file.success = false;
      file.message = error.message;
    } finally {
      file.loading = false;
    }
  }

  const handleSubmit = () => {
    const VALIDITY = validateSupportForm(formData);
    setFormValidity(VALIDITY);
    if (Object.values(VALIDITY).includes(true)) return;
    resetSupportForm();
    showAlert('Your support form has been sent!', 'success');
  };

  const resetSupportForm = () => setFormData(INITIAL_FORM_DATA);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    if (alert.timeout) clearTimeout(alert.timeout);
    const timeout = setTimeout(
      () => setAlert({ ...alert, ['show']: false }),
      4000
    );
    setAlert({
      show: true,
      severity: severity,
      message: message,
      timeout: timeout,
    });
  };

  const handleRemoveUpload = (fileToRemove: CustomFile) => {
    const filteredFiles = formData.fileUploads.files.filter(
      (file) => file !== fileToRemove
    );
    setFormData({
      ...formData,
      ['fileUploads']: {
        files: filteredFiles,
        loading: false,
      },
    });
  };


  const failedFiles = formData.fileUploads.files.filter(
    (file) => !file.success
  );
  const loadingFiles = formData.fileUploads.files.filter(
    (file) => file.loading
  );
  const uploadedFiles = formData.fileUploads.files.filter(
    (file) => file.success
  );

  return (
    <Box
      sx={{
        pt: 12,
        '& > .MuiBox-root': { mx: 'auto' },
      }}
    >
      {alert.show && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Box>
      )}

      {/* FAQ Section */}
      <Box
        component='section'
        id='FAQ'
        sx={{
          pb: '253px',
          maxWidth: 846,
          '& .MuiBox-root': { mx: 'auto' },
          '& .MuiTypography-subheading': {
            marginBottom: '24px',
            display: 'block',
          },
        }}
      >
        <Typography
          variant='h1'
          sx={{ textAlign: 'center', mb: '125px', mt: '68.11px' }}
        >
          Support
        </Typography>

        {/* FAQ First section: Terra-X9 & Application */}
        <Box sx={{ mb: '70px' }}>
          <Typography variant='subheading'>Terra-X9 & Application</Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel1-content'
              id='panel1-header'
            >
              <Typography variant='body2'>
                How do I control the Terra-X9 through the app?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                You can control the Terra-X9 through the application, which
                provides a smooth steering and driving mode, and real-time
                video-overview. It includes features such as light control for
                night vision, image capturing and an image. Sapien vulputate
                lorem facilisis scelerisque leo mauris id. Ornare semper
                pharetra netus sodales bibendum. Ipsum orci amet sem egestas
                porta nunc facilisi felis ornare. Id nulla nisl nibh eu proin
                dignissim tincidunt. Arcu purus scelerisque amet vitae
                adipiscing feugiat tristique a nibh. Non nisi eu donec sodales.
                Sit sagittis lectus urna sit orci adipiscing enim est. Viverra
                turpis leo cursus diam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel2-content'
              id='panel2-header'
            >
              <Typography variant='body2'>Can I name my rover?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                Yes! You can personalize your rover by giving it a unique name,
                unless you’d like to refer to it as its initial serial-number.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel3-content'
              id='panel3-header'
            >
              <Typography variant='body2'>
                Where can I find the serial number to my rover?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                When opening the settings in the application you will find the
                serial number to the rover you are currently connected to. If
                your user account has access to multiple rovers, the serial
                number for all rovers can be found on the connection page of the
                application.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel4-content'
              id='panel5-header'
            >
              <Typography variant='body2'>
                What kind of environments can the Terra-X9 handle?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                The Terra-X9 is designed for all terrain and surfaces, it can
                withstand dust storms, extreme temperatures, and rocky
                landscapes.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel6-content'
              id='panel6-header'
            >
              <Typography variant='body2'>
                Can I connect to multiple rovers?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                Yes, the app supports multi-rover management, allowing you to
                control and monitor multiple rovers, though not at the same
                time.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* FAQ Second section: Purchase & Delivery */}
        <Box sx={{ maxWidth: 846 }}>
          <Typography
            variant='subheading'
            sx={{ marginBottom: '24px' }}
          >
            {' '}
            Purchase & Delivery
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel7-content'
              id='panel7-header'
            >
              <Typography variant='body2'>
                Why do I need a consultation before purchasing?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                A consultation ensures the Terra-X9 is customized to your
                company’s specific mission needs, ensuring that you make a
                confident and informed purchase, fully aligned with your goals.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel8-content'
              id='panel8-header'
            >
              <Typography variant='body2'>
                How is the Terra-X9 delivered?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                The Terra-X9 is delivered via secure transport for
                interplanetary missions and conditions.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel9-content'
              id='panel9-header'
            >
              <Typography variant='body2'>
                How long does it take to receive the rover after purchase?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                Delivery typically takes 6-12 weeks, depending on mission
                requirements.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel10-content'
              id='panel10-header'
            >
              <Typography variant='body2'>
                What kind of support do I get after purchase?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                You can reach out to us anytime through our support page on the
                product website, where we’re always ready to assist you.
                Additionally, the rover’s instruction manual is available for
                download on the same page whenever you need it.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel11-content'
              id='panel11-header'
            >
              <Typography variant='body2'>
                What is your order cancellation policy?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                The Terra-X9 comes with a standard 24-month warranty covering
                hardware defects and software support. Extended warranties are
                also available.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel12-content'
              id='panel12-header'
            >
              <Typography variant='body2'>
                Is there a warranty included when I purchase a Terra-X9?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                Yes, the Terra-X9 comes with a standard 24-month warranty
                covering hardware defects and software support. Extended
                warranties are also available.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        {/* Decorative: Background gradients + Design element */}
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
      </Box>

      {/* Contact Form Section */}
      <Box
        component='section'
        id='contact-form'
        sx={{ position: 'relative' }}
      >
        <Box
          sx={{
            pb: '224px',
            maxWidth: 846,
            mx: 'auto',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <Typography
            variant='h2'
            sx={{ textAlign: 'center', mb: '90px' }}
          >
            Customer support form
          </Typography>
          <FormControl sx={{ width: '100%' }}>
            <Stack
              sx={{
                width: '100%',
                gap: '56px',
                '& > .MuiStack-root': { minHeight: 155 },
              }}
            >
              <Stack
                direction={'row'}
                sx={{
                  '& > .MuiStack-root': { flex: 1, gap: '24px' },
                  gap: '20px',
                }}
              >
                <Stack>
                  <label htmlFor='f_name_input'>
                    Name{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </label>
                  <TextField
                    autoComplete='off'
                    error={formValidity.f_name_input}
                    value={formData.f_name_input}
                    onChange={handleInputChange}
                    name='f_name_input'
                    required
                    id='f_name_input'
                    placeholder='Enter your name'
                    variant='outlined'
                    helperText={
                      formValidity.f_name_input && (
                        <Stack
                          gap={'6px'}
                          direction='row'
                        >
                          <Icon
                            src='/src/assets/alert_sign.svg'
                            width='28px'
                          />
                          Invalid name
                        </Stack>
                      )
                    }
                  />
                </Stack>
                <Stack>
                  <label htmlFor='s_name_input'>
                    Surname{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </label>
                  <TextField
                    autoComplete='off'
                    error={formValidity.s_name_input}
                    value={formData.s_name_input}
                    onChange={handleInputChange}
                    name='s_name_input'
                    required
                    id='s_name_input'
                    placeholder='Enter your surname'
                    variant='outlined'
                    helperText={
                      formValidity.s_name_input && (
                        <Stack
                          gap={'6px'}
                          direction='row'
                          component={'p'}
                        >
                          <Icon
                            src='/src/assets/alert_sign.svg'
                            width='28px'
                          />
                          Invalid name
                        </Stack>
                      )
                    }
                  />
                </Stack>
              </Stack>
              <Stack
                direction={'row'}
                sx={{
                  '& > .MuiStack-root': { flex: 1, gap: '24px' },
                  gap: '20px',
                }}
              >
                <Stack>
                  <label htmlFor='email_input'>
                    E-mail{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </label>
                  <TextField
                    autoComplete='off'
                    error={formValidity.email_input}
                    value={formData.email_input}
                    onChange={handleInputChange}
                    name='email_input'
                    required
                    id='email_input'
                    placeholder='Enter your e-mail'
                    variant='outlined'
                    sx={{ gap: '6px' }}
                    helperText={
                      formValidity.email_input && (
                        <Stack
                          gap={'6px'}
                          direction='row'
                        >
                          <Icon
                            src='/src/assets/alert_sign.svg'
                            width='28px'
                          />
                          Invalid email
                        </Stack>
                      )
                    }
                  />
                </Stack>
                <Stack>
                  <label
                    htmlFor='serial_input'
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box>
                      Serial number of the rover{' '}
                      <Box
                        component='span'
                        color='main.error'
                      >
                        *
                      </Box>
                    </Box>
                    <Tooltip
                      placement='right-start'
                      arrow
                      title='Serial number can be found at the bottom of the rover base'
                    >
                      <Box>
                        <Icon
                          src='/src/assets/Icon_info.svg'
                          width='27px'
                        />
                      </Box>
                    </Tooltip>
                  </label>
                  <TextField
                    autoComplete='off'
                    error={formValidity.serial_input}
                    value={formData.serial_input}
                    onChange={handleInputChange}
                    name='serial_input'
                    required
                    id='serial_input'
                    placeholder='RX-3728HW-90TERRA'
                    variant='outlined'
                    helperText={
                      formValidity.serial_input && (
                        <Stack
                          gap={'6px'}
                          direction='row'
                        >
                          <Icon
                            src='/src/assets/alert_sign.svg'
                            width='28px'
                          />
                          Invalid serial number
                        </Stack>
                      )
                    }
                  />
                </Stack>
              </Stack>
              <Stack
                direction={'row'}
                sx={{
                  '& > .MuiStack-root': { flex: 1, gap: '24px' },
                  gap: '20px',
                }}
              >
                <Stack>
                  <label htmlFor='issue_category_input'>
                    Issue category{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      id='issue_category_input'
                      name='issue_category_input'
                      labelId='demo-simple-select-label'
                      value={formData.issue_category_input}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value='Wheels'>Wheels</MenuItem>
                      <MenuItem value='Base'>Base</MenuItem>
                      <MenuItem value='Battery'>Battery</MenuItem>
                      <MenuItem value='Camera'>Camera</MenuItem>
                      <MenuItem value='Claw Arm'>Claw Arm</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack>
                  <label htmlFor='date_input'>
                    Approximate date issue began
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </label>
                  <TextField
                    autoComplete='off'
                    onChange={handleInputChange}
                    value={formData.date_input}
                    error={formValidity.date_input}
                    name='date_input'
                    required
                    id='date_input'
                    placeholder='Enter approximate date'
                    variant='outlined'
                    helperText={
                      formValidity.date_input && (
                        <Stack
                          gap={'6px'}
                          direction='row'
                        >
                          <Icon
                            src='/src/assets/alert_sign.svg'
                            width='28px'
                          />
                          Invalid date
                        </Stack>
                      )
                    }
                  />
                </Stack>
              </Stack>
              <Stack sx={{ gap: '24px' }}>
                <label htmlFor='issue_description_input'>
                  Describe the problem{' '}
                  <Box
                    component='span'
                    color='main.error'
                  >
                    *
                  </Box>
                </label>
                <TextField
                  autoComplete='off'
                  value={formData.issue_description_input}
                  onChange={handleInputChange}
                  name='issue_description_input'
                  multiline
                  rows={10}
                  required
                  id='issue_description_input'
                  placeholder=''
                  variant='outlined'
                />
              </Stack>
              <Stack sx={{ gap: '24px' }}>
                <label htmlFor='file_upload_input'>File upload (if any)</label>
                <Button
                  variant='contained'
                  component='label'
                  role={undefined}
                  tabIndex={-1}
                  id='file_upload_input'
                  sx={{
                    backgroundColor: 'rgba(24, 7, 87, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    borderRadius: '10px',
                    gap: '8px',
                    py: '45px',
                    textTransform: 'initial',
                    '&:hover': {
                      boxShadow: 'none',
                      backgroundColor: 'rgba(24, 7, 87, 1)',
                      borderStyle: 'dashed',
                    },
                  }}
                >
                  <FileUpload
                    type='file'
                    onChange={handleUpload}
                    multiple
                  />
                  <img src='/src/assets/Icon_upload.svg' />
                  <Typography
                    variant='body1'
                    sx={{ fontWeight: 600 }}
                  >
                    Browse files
                  </Typography>
                  <Typography variant='body3'>
                    Or drag and drop files here
                  </Typography>
                </Button>

                {/* UPLOADING FILES */}
                {loadingFiles.length > 0 || failedFiles.length > 0 &&
                  <Typography variant='subheading2'>
                    Uploading -{' '}
                    {`${loadingFiles.length}/${formData.fileUploads.files.length}`}
                  </Typography>}

                {loadingFiles.map(file => (
                  <Stack key={file.name} sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)', padding: '14px 24px',
                    borderRadius: '10px', border: '1px solid #BCC5FF', gap: '16px'

                  }}>
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      sx={{ width: '100%', alignItems: 'center' }}
                    >
                      <Typography>{file.name}</Typography>
                      <IconButton onClick={() => handleRemoveUpload(file)}>
                        <Icon
                          src='/src/assets/Icon_delete.svg'
                          height='24px'
                        />
                      </IconButton>
                    </Stack>
                    {file.loading && <LinearProgress />}
                  </Stack>
                ))}
                {/* FAILED FILES */}
                {failedFiles.map(file => (
                  <Stack gap={'14px'}>
                    <Stack key={file.name} sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)', padding: '14px 24px',
                      borderRadius: '10px', border: '1px solid #FF3131'
                    }}>
                      <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        sx={{ width: '100%', alignItems: 'center' }}
                      >
                        <Typography>{file.name}</Typography>
                        <IconButton onClick={() => handleRemoveUpload(file)} sx={{
                          filter: 'brightness(0) saturate(100%) invert(39%) sepia(86%) saturate(4609%) hue-rotate(343deg) brightness(109%) contrast(108%)'
                        }}>
                          <Icon
                            src='/src/assets/Icon_remove.svg'
                            height='24px'
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                    <Typography variant='body2' color='main.error'>{file.message}</Typography>
                  </Stack>
                ))}
                {/* UPLOADED FILES */}
                {uploadedFiles.length > 0 && <Typography variant='subheading2'>Uploaded - {`${uploadedFiles.length}/${formData.fileUploads.files.length}`}</Typography>}
                {uploadedFiles.map((file) => {
                  return (
                    <Stack key={file.name} sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)', padding: '14px 24px',
                      borderRadius: '10px', border: '1px solid #BCC5FF'
                    }}>
                      <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        sx={{ width: '100%', alignItems: 'center' }}
                      >
                        <Typography>{file.name}</Typography>
                        <IconButton onClick={() => handleRemoveUpload(file)}>
                          <Icon
                            src='/src/assets/Icon_delete.svg'
                            height='24px'
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                  );
                })}

              </Stack>
              <Button
                variant='contained'
                onClick={handleSubmit}
              >
                Submit the form
              </Button>
            </Stack>
          </FormControl>
        </Box>
        <Box
          aria-hidden='true'
          id='design-element-right'
          sx={{
            zIndex: 0,
            position: 'absolute',
            backgroundImage: 'url("/src/assets/design_element.png")',
            right: 0,
            bottom: 0,
            width: '50%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <Box
          aria-hidden='true'
          id='design-element-left'
          sx={{
            zIndex: 0,
            position: 'absolute',
            backgroundImage: 'url("/src/assets/design_element.png")',
            left: 0,
            top: 0,
            transform: 'rotate(180deg)',
            width: '50%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </Box>

      {/* Downloads Section */}
      <Box
        component='section'
        id='downloads'
        sx={{
          backgroundImage:
            'url("https://qxlvyblcyywkxiqtbcrb.supabase.co/storage/v1/object/public/images//gabriele-garanzelli-PzO_CitnJdI-unsplash%201-3%203.png")',
          height: 888,
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
      >
        <Box
          // Decorative element top
          component={'button'}
          role='presentation'
          sx={{
            height: 151,
            background:
              'linear-gradient(0deg, rgba(5, 3, 12, 0.00) 0%, rgba(5, 3, 12, 0.51) 25.48%, rgba(5, 3, 12, 0.83) 59.13%, #05030C 98.08%)',
          }}
        />

        <Typography
          variant='h2'
          sx={{ mb: '130px' }}
        >
          Downloads
        </Typography>

        <Stack
          direction={'row'}
          sx={{
            '& img': { height: '60px' },
            maxWidth: 846,
            mx: 'auto',
            justifyContent: 'space-between',
            '& > .MuiStack-root': { maxWidth: 305, gap: '24px' },
            '& .MuiButton-root': { alignSelf: 'center', mt: '16px' },
          }}
        >
          <Stack>
            <img src='/src/assets/Icon_manual.svg' />
            <Typography
              sx={{ fontSize: 20 }}
              variant='subheading'
              component='p'
            >
              TERRA-x9 Instruction Manual
            </Typography>
            <Button
              component={'button'}
              onClick={() => handleDownload('Instruction_Manual')}
              variant='contained'
              size='small'
              endIcon={<Icon src='/src/assets/Icon_download.svg' />}
            >
              Download
            </Button>
          </Stack>
          <Stack>
            <img src='/src/assets/Icon_GPSR.svg' />
            <Typography
              sx={{ fontSize: 20 }}
              variant='subheading'
              component='p'
            >
              GPSR (General Product Safety Regulation)
            </Typography>
            <Button
              component='label'
              tabIndex={-1}
              role={undefined}
              onClick={() => handleDownload('GPSR')}
              variant='contained'
              size='small'
              endIcon={<Icon src='/src/assets/Icon_download.svg' />}
            >
              Download
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default Support;
