import { adminApi } from '@/api/adminApi';
import { contentApi } from '@/api/contentApi';
import CustomTabPanel from '@/components/CustomTabPanel';
import { RenderQuestion } from '@/components/Editor/RenderQuestion';
import FileUpload from '@/components/FileUpload';
import Icon from '@/components/Icon';
import { useContent } from '@/hooks/useContent';
import { DownloadableFiles, FAQ } from '@/types/types';
import { validateNewFile } from '@/utils/editor/validate.support';
import {
  Alert,
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

function Support() {
  const { pages, getContent } = useContent();
  const [alert, setAlert] = useState<{
    show: boolean;
    timeout: NodeJS.Timeout | null;
    severity: 'success' | 'error';
    message: string;
  }>({
    show: false,
    timeout: null,
    severity: 'success',
    message: '',
  });
  const [searchterm, setSearchTerm] = useState('');
  const [tab, setTab] = useState(0);
  const [FAQ, setFAQ] = useState<null | (FAQ & { isNew: boolean })>(null);

  /*--------------handlers----------------- */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleNewFAQ = () =>
    setFAQ({
      question: '',
      answer: '',
      isNew: true,
      id: crypto.randomUUID(),
      category: tab === 0 ? 'deliveryFAQ' : 'applicationFAQ',
    });

  const handlePreview = async (file: DownloadableFiles) => {
    try {
      const response = await contentApi.getFile(file);
      const url = URL.createObjectURL(response);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error(error);
    }
  };



  const handleFAQChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (FAQ) {
      setFAQ({ ...FAQ, [name]: value });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;

    if (!files) return;
    const FILE_VALIDITY = validateNewFile(files);
    if ('errorMessage' in FILE_VALIDITY)
      return showAlert(FILE_VALIDITY.errorMessage!, 'error');

    const newFile = new File([files[0]], name, {
      type: files[0].type,
      lastModified: files[0].lastModified,
    });

    const result = await adminApi.updateFile(
      name as DownloadableFiles,
      newFile
    );
    if (result.error)
      return showAlert('Something went wrong when updating file', 'error');
    showAlert(
      `${name.includes('_') ? name.split('_').join(' ') : name
      } has been updated! Note that it takes a minute to view the updated version`,
      'success'
    );
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    if (alert.timeout) clearTimeout(alert.timeout);
    const timeout = setTimeout(
      () => setAlert({ ...alert, ['show']: false }),
      5000
    );
    setAlert({
      show: true,
      severity: severity,
      message: message,
      timeout: timeout,
    });
  };

  const handleUpdateFAQ = async () => {
    if (!FAQ || !pages) return;
    const { isNew, ...rest } = FAQ;
    if (!rest.question || !rest.answer)
      return showAlert('Missing question or answer input', 'error');

    // Add if new, replace if not
    if (isNew) {
      pages.support.FAQ.push(rest)
    } else {
      const index = pages.support.FAQ.findIndex(q => q.id === rest.id)
      pages.support.FAQ.splice(index, 1, rest)
    }

    const updatedPage = {
      ...pages.support,
      FAQ: pages.support.FAQ,
    };

    const result = await adminApi.updatePage('support', updatedPage);
    console.log(result)
    if (!result.error) {
      getContent();
      setTimeout(() => triggerAnimation(FAQ.id), 10);
      setFAQ(null);
    }
  };

  const triggerAnimation = (id: string) => {
    const el = document.querySelector(`[data-id='${id}']`);
    if (!el) return console.log('No element found');
    el.classList.add('saved-FAQ');
    // setTimeout(() => el.classList.remove('saved-FAQ'), 5000)
  };

  const filteredFAQ = (category: FAQ[]) => {
    return category.filter(
      (q) =>
        q.question.toLowerCase().includes(searchterm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchterm.toLowerCase())
    );
  };

  const deliveryFAQ =
    pages?.support.FAQ.filter((q) => q.category === 'deliveryFAQ') || [];
  const applicationFAQ =
    pages?.support.FAQ.filter((q) => q.category === 'applicationFAQ') || [];

  return (
    <Box sx={{ py: '101px', px: 2 }}>
      {alert.show && (
        <Alert
          sx={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      )}
      <Stack
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 0, md: '30px' },
        }}
      >
        {/* Manage FAQ and downloads */}
        <Stack
          gap={'48px'}
          maxWidth={630}
          sx={{
            flex: 1,
            mx: 'auto',
            mb: { xs: '100px', md: 0 },
          }}
        >
          <Typography
            variant='subheading'
            sx={{ pb: '20px', borderBottom: '1px solid #BDD5FF' }}
          >
            Manage FAQ & Downloads
          </Typography>
          <Stack gap={'36px'}>
            <Button
              variant='contained'
              size={'xsmall'}
              onClick={handleNewFAQ}
              disabled={FAQ && !FAQ.isNew ? true : false}
              sx={{
                '& > span ': { marginRight: 0 },
                gap: '12px',
              }}
              startIcon={
                <Icon
                  src='/src/assets/Icon_add_circle.svg'
                  width='24px'
                />
              }
            >
              New FAQ
            </Button>
            <Stack gap={'16px'}>
              <Typography variant='subheading2'>Question</Typography>
              <TextField
                name='question'
                value={(FAQ && FAQ.question) ?? ''}
                disabled={FAQ === null ? true : false}
                onChange={handleFAQChange}
                required
                placeholder='Enter question'
                sx={{
                  '& .MuiInputBase-root': { backdropFilter: 'blur(20px)' },
                  '& .Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.14) !important',
                    WebkitTextFillColor: 'rgba(255, 255, 255, 0.14) !important',
                  },
                }}
              />
            </Stack>
            <Stack gap={'16px'}>
              <Typography variant='subheading2'>Answer</Typography>
              <TextField
                name='answer'
                value={(FAQ && FAQ.answer) ?? ''}
                multiline
                rows='6'
                disabled={FAQ === null ? true : false}
                onChange={handleFAQChange}
                required
                placeholder='Enter answer'
                sx={{
                  '& .MuiInputBase-root': { backdropFilter: 'blur(20px)' },
                  '& .Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.14) !important',
                    WebkitTextFillColor: 'rgba(255, 255, 255, 0.14) !important',
                  },
                }}
              />
            </Stack>
          </Stack>
          <Box sx={{ mb: '100px' }}>
            <Button
              variant='contained'
              size={'xsmall'}
              disabled={FAQ === null ? true : false}
              sx={{ mr: '20px' }}
              onClick={handleUpdateFAQ}
            >
              {(!FAQ || FAQ.isNew) && 'Add Question'}
              {FAQ && !FAQ.isNew && 'Save Changes'}
            </Button>
            <Button
              onClick={() => setFAQ(null)}
              variant='contained'
              size={'xsmall'}
              color='grey'
              disabled={FAQ === null ? true : false}
            >
              Cancel
            </Button>
          </Box>

          <Stack gap={'64px'}>
            <Typography
              variant='subheading'
              sx={{ pb: '20px', borderBottom: '1px solid #BDD5FF' }}
            >
              Manage Downloads
            </Typography>
            <Box>
              <Stack
                direction={'row'}
                sx={{ mb: '32px', gap: '20px', alignItems: 'end' }}
              >
                <Icon
                  src='/src/assets/Icon_manual.svg'
                  height='50px'
                  width='40px'
                />
                <Typography
                  variant='subheading2'
                  sx={{ maxWidth: 284, textWrap: 'pretty' }}
                >
                  TERRA-x9 Instruction Manual
                </Typography>
                <Typography variant='body2'>
                  (v1.0, {pages?.support.manuals.instructionManual.size})
                </Typography>
              </Stack>
              <Box>
                <Button
                  variant='contained'
                  size={'xsmall'}
                  sx={{ mr: '20px' }}
                  onClick={() =>
                    (
                      document.querySelector(
                        '#fileupload_IM'
                      )! as HTMLButtonElement
                    ).click()
                  }
                >
                  <FileUpload
                    id='fileupload_IM'
                    tabIndex={-1}
                    name='Instruction_Manual'
                    type='file'
                    onChange={handleUpload}
                  />
                  Upload new version
                </Button>
                <Button
                  variant='contained'
                  size={'xsmall'}
                  color='grey'
                  onClick={() => handlePreview('Instruction_Manual')}
                >
                  View current
                </Button>
              </Box>
            </Box>
            <Box>
              <Stack
                direction={'row'}
                sx={{ mb: '32px', gap: '20px', alignItems: 'end' }}
              >
                <Icon
                  src='/src/assets/Icon_GPSR.svg'
                  height='50px'
                  width='48px'
                />
                <Typography
                  variant='subheading2'
                  sx={{ maxWidth: 284, textWrap: 'pretty' }}
                >
                  GPSR (General Product Safety Regulation)
                </Typography>
                <Typography variant='body2'>
                  (v1.0, {pages?.support.manuals.GPSR.size})
                </Typography>
              </Stack>
              <Box>
                <Button
                  onClick={() =>
                    (
                      document.querySelector(
                        '#fileupload_GPSR'
                      )! as HTMLButtonElement
                    ).click()
                  }
                  variant='contained'
                  size={'xsmall'}
                  sx={{ mr: '20px' }}
                >
                  <FileUpload
                    id='fileupload_GPSR'
                    tabIndex={-1}
                    type='file'
                    name='GPSR'
                    onChange={handleUpload}
                  />
                  Upload new version
                </Button>
                <Button
                  variant='contained'
                  size={'xsmall'}
                  color='grey'
                  onClick={() => handlePreview('GPSR')}
                >
                  View current
                </Button>
              </Box>
            </Box>
          </Stack>
        </Stack>

        {/* Divider */}
        <Box
          role='presentation'
          sx={{
            width: { xs: 0, md: '1px' },
            bgcolor: '#BCC5FF',
            display: 'block',
          }}
        />

        {/* Select FAQ */}
        <Stack
          gap={'48px'}
          maxWidth={630}
          sx={{ flex: 1, mx: 'auto' }}
        >
          <Typography
            variant='subheading'
            sx={{ pb: '20px', borderBottom: '1px solid #BDD5FF' }}
          >
            Select FAQ
          </Typography>

          <Stack gap={'36px'}>
            <Stack sx={{ pt: 0, gap: '16px' }}>
              <Typography variant='subheading2'>Section</Typography>
              <Tabs
                onChange={handleTabChange}
                slotProps={{
                  indicator: { style: { display: 'none' } },
                }}
                value={tab}
                sx={{
                  borderBottom: 'none',
                  maxHeight: 52,
                  borderRadius: '10px',

                  '& .MuiTab-root': {
                    borderRadius: '10px',
                    fontSize: 16,
                    boxShadow: 'none',
                    color: 'rgba(255, 255, 255, 0.70)',
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'rgba(188, 197, 255, 0.50)',
                    color: '#FFF',
                  },
                  '& .MuiTabs-list': {
                    position: 'relative',
                  },
                  '& .MuiTabs-list::after': {
                    content: '""',
                    width: '1px',
                    height: '34px',
                    display: 'block',
                    bgcolor: 'white',
                    position: 'absolute',
                    left: '50%',
                    justifySelf: 'center',
                    alignSelf: 'center',
                  },
                }}
              >
                <Tab label='Purchase & Delivery' />
                <Tab label='Terra-X9 & Application' />
              </Tabs>
            </Stack>

            <TextField
              value={searchterm}
              onChange={handleSearch}
              placeholder='Search for a question'
              className='editor-custom-search'
              sx={{
                '& .MuiInputBase-root': { pl: '54px' },
              }}
            />
            <Stack
              gap={'24px'}
              sx={{
                '& .FAQstack': {
                  maxHeight: 886,
                  overflowY: 'scroll',
                  scrollbarColor: 'white transparent',
                  scrollbarWidth: 'thin',
                  gap: '24px',
                  position: 'relative',
                },
              }}
            >
              <Typography variant='subheading2'>
                Select question to edit
              </Typography>
              <CustomTabPanel
                value={tab}
                index={0}
              >
                <Stack className='FAQstack'>
                  {searchterm &&
                    filteredFAQ(deliveryFAQ).map((q) =>
                      RenderQuestion({
                        entry: q,
                        handleClick: setFAQ,
                        selectedId: FAQ && FAQ.id,
                      })
                    )}

                  {!searchterm &&
                    deliveryFAQ.map((q) =>
                      RenderQuestion({
                        entry: q,
                        handleClick: setFAQ,
                        selectedId: FAQ && FAQ.id,
                      })
                    )}
                </Stack>
              </CustomTabPanel>
              <CustomTabPanel
                value={tab}
                index={1}
              >
                <Stack className='FAQstack'>
                  {searchterm &&
                    filteredFAQ(applicationFAQ).map((q) =>
                      RenderQuestion({
                        entry: q,
                        handleClick: setFAQ,
                        selectedId: FAQ && FAQ.id,
                      })
                    )}

                  {!searchterm &&
                    applicationFAQ.map((q) =>
                      RenderQuestion({
                        entry: q,
                        handleClick: setFAQ,
                        selectedId: FAQ && FAQ.id,
                      })
                    )}
                </Stack>
              </CustomTabPanel>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Support;
