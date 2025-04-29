import { CustomFile } from '@/types/types';
import { IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Icon from './Icon';

function File({ file, handleRemoveUpload }: {
  file: CustomFile,
  handleRemoveUpload: (file: CustomFile) => void,
}) {
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false)

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
      setTimeout(() => Promise.resolve(file.success = true), 1000)
      file.success = true
    } catch (error: any) {
      file.success = false;
      file.message = error.message;
    } finally {
      file.loading = false;
    }
  }

  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(() => {
        setProgress(progress + 1);
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      checkFile(file)
    }
  }, [progress]);


  return (
    <Stack sx={{ gap: '14px' }}>
      <Stack key={file.name} sx={{
        backgroundColor: 'rgba(255,255,255,0.1)', padding: '14px 24px',
        borderRadius: '10px', border: `${file.success ? '1px solid #BCC5FF' : '1px solid #FF3131'}`
      }}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{ width: '100%', alignItems: 'center' }}
        >
          <Typography>{file.name}</Typography>
          <IconButton sx={{
            filter:
              `${!file.success ? 'brightness(0) saturate(100%) invert(29%) sepia(63%) saturate(1954%) hue-rotate(337deg) brightness(105%) contrast(107%)' : ''}`
          }} onClick={() => handleRemoveUpload(file)}>
            <Icon
              src={file.success ? '/src/assets/Icon_delete.svg' : '/src/assets/Icon_remove.svg'}
              height='24px'
            />
          </IconButton>
        </Stack>
        {progress < 100 && <LinearProgress variant="determinate" value={progress} />}
      </Stack>
      {file.message && <Typography variant='body2' color='main.error'>{file.message}</Typography>}
    </Stack>
  )
}

export default File;