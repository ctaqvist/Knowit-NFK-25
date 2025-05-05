import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
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
import FAQ from '@/utils/data/supportFAQ';
import Accordion from '@/components/CustomAccordion';

const INITIAL_FORM_DATA = {
  f_name_input: '',
  s_name_input: '',
  email_input: '',
  serial_input: '',
  issue_category_input: 'Select an option',
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
    f_name_input: '',
    s_name_input: '',
    email_input: '',
    serial_input: '',
    issue_category_input: '',
    issue_description_input: '',
    date_input: '',
  });

  const handleDownload = async (file: DownloadableFiles) => {
    try {
      const response = await contentApi.getFile(`files`, file);
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
    const isValid = validateInput(name, value);
    setFormData({ ...formData, [name]: value as string });
    setFormValidity({ ...formValidity, [name]: isValid });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    const isValid = validateInput(name, value as string)
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
      for (const uploadedFile of formData.fileUploads.files) {
        if (uploadedFile.name === file.name) {
          throw new Error(`A file with this name has already been uploaded`)
        }
      }

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

    // Make sure all fields are filled in before proceeding
    for (const value of Object.values(VALIDITY)) {
      if (value.length > 0) return;
    }
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
          {FAQ.applicationFAQ.map(q => <Accordion key={q.summary} summary={q.summary} details={q.details} />)}
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
          {FAQ.deliveryFAQ.map(q => <Accordion key={q.summary} summary={q.summary} details={q.details} />)}
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
        sx={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            pb: '224px',
            maxWidth: 846,
            mx: 'auto',
            position: 'relative',
            zIndex: 3,
            '& .MuiFormHelperText-root': { mt: 0 }
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
                gap: '40px',
                '& > .MuiStack-root': { minHeight: 155 },
              }}
            >
              <Stack
                direction={'row'}
                sx={{
                  '& > .MuiStack-root': { flex: 1, gap: '16px' },
                  gap: '20px',
                }}
              >
                <Stack>
                  <Typography htmlFor='f_name_input' variant='h4' component='label'>
                    Name{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </Typography>
                  <TextField
                    sx={{ gap: '6px' }}
                    autoComplete='off'
                    error={formValidity.f_name_input ? true : false}
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
                          {formValidity.f_name_input}
                        </Stack>
                      )
                    }
                  />
                </Stack>
                <Stack>
                  <Typography htmlFor='s_name_input' variant='h4' component='label'>
                    Surname{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </Typography>
                  <TextField
                    sx={{ gap: '6px' }}
                    autoComplete='off'
                    error={formValidity.s_name_input ? true : false}
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
                          {formValidity.s_name_input}
                        </Stack>
                      )
                    }
                  />
                </Stack>
              </Stack>
              <Stack
                direction={'row'}
                sx={{
                  '& > .MuiStack-root': { flex: 1, gap: '16px' },
                  gap: '20px',
                }}
              >
                <Stack>
                  <Typography htmlFor='email_input' variant='h4' component='label'>
                    E-mail{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </Typography>
                  <TextField
                    autoComplete='off'
                    error={formValidity.email_input ? true : false}
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
                          {formValidity.email_input}
                        </Stack>
                      )
                    }
                  />
                </Stack>
                <Stack>
                  <Typography
                    component='label' variant='h4'
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
                          width='24px'
                        />
                      </Box>
                    </Tooltip>
                  </Typography>
                  <TextField
                    sx={{ gap: '6px' }}
                    autoComplete='off'
                    error={formValidity.serial_input ? true : false}
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
                          {formValidity.serial_input}
                        </Stack>
                      )
                    }
                  />
                </Stack>
              </Stack>
              <Stack
                direction={'row'}
                sx={{
                  '& > .MuiStack-root': { flex: 1, gap: '16px' },
                  gap: '20px',
                }}
              >
                <Stack>
                  <Typography component='label' variant='h4' htmlFor='issue_category_input'>
                    Issue category{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </Typography>
                  <FormControl fullWidth sx={{ gap: '6px' }}>
                    <Select
                      error={formValidity.issue_category_input ? true : false}
                      id='issue_category_input'
                      name='issue_category_input'
                      labelId='demo-simple-select-label'
                      value={formData.issue_category_input}
                      onChange={handleSelectChange}
                      sx={{
                        '&:has([value="Select an option"]': { color: 'rgb(93 92 101)' },
                      }}
                    >
                      {formValidity.issue_category_input && <FormHelperText>{formValidity.issue_category_input}</FormHelperText>}

                      <MenuItem disabled value="Select an option" sx={{ display: 'none' }}>
                        Select an option
                      </MenuItem>
                      <MenuItem value='Wheels'>Wheels</MenuItem>
                      <MenuItem value='Base'>Base</MenuItem>
                      <MenuItem value='Battery'>Battery</MenuItem>
                      <MenuItem value='Camera'>Camera</MenuItem>
                      <MenuItem value='Claw Arm'>Claw Arm</MenuItem>
                    </Select>
                    {formValidity.issue_category_input &&
                      <Stack
                        gap={'6px'}
                        direction='row' alignItems={'center'}
                      >
                        <Icon
                          src='/src/assets/alert_sign.svg'
                          width='28px'
                        />
                        <FormHelperText sx={{ color: '#FF3131' }}>
                          {formValidity.issue_category_input}
                        </FormHelperText>
                      </Stack>
                    }
                  </FormControl>
                </Stack>
                <Stack>
                  <Typography variant='h4' component='label' htmlFor='date_input'>
                    Approximate date issue began{' '}
                    <Box
                      component='span'
                      color='main.error'
                    >
                      *
                    </Box>
                  </Typography>
                  <TextField
                    sx={{ gap: '6px' }}
                    autoComplete='off'
                    onChange={handleInputChange}
                    value={formData.date_input}
                    error={formValidity.date_input ? true : false}
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
                          {formValidity.date_input}
                        </Stack>
                      )
                    }
                  />
                </Stack>
              </Stack>
              <Stack sx={{ gap: '16px' }}>
                <Typography variant='h4' component='label' htmlFor='issue_description_input'>
                  Describe the problem{' '}
                  <Box
                    component='span'
                    color='main.error'
                  >
                    *
                  </Box>
                </Typography>
                <TextField
                  autoComplete='off'
                  value={formData.issue_description_input}
                  error={formValidity.issue_description_input ? true : false}
                  onChange={handleInputChange}
                  name='issue_description_input'
                  multiline
                  rows={10}
                  required
                  id='issue_description_input'
                  placeholder=''
                  variant='outlined'
                  sx={{ gap: '6px' }}
                  helperText={
                    formValidity.issue_description_input && (
                      <Stack
                        gap={'6px'}
                        direction='row'
                      >
                        <Icon
                          src='/src/assets/alert_sign.svg'
                          width='28px'
                        />
                        {formValidity.issue_description_input}
                      </Stack>
                    )
                  }
                />
              </Stack>
              <Stack sx={{ gap: '16px' }}>
                <Typography component='label' variant='h4' htmlFor='file_upload_input'>File upload (if any)</Typography>
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
                  <Typography mt={'12px'} variant='subheading2'>
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
                {uploadedFiles.length > 0 && <Typography variant='subheading2' mt={'20px'}>Uploaded - {`${uploadedFiles.length}/${formData.fileUploads.files.length}`}</Typography>}
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
                sx={{ mt: '40px' }}
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
