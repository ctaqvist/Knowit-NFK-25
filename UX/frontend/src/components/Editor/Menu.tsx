import { useContent } from '@/hooks/useContent';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import Settings from './Settings';
import Support from '@/pages/Editor/pages/Support';
import CustomTabPanel from '../CustomTabPanel';


function Menu() {
  const { pages } = useContent()
  const [value, setValue] = useState(2);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!pages) return
  }, [pages])

  if (!pages) return

  return (
    <Box id='editor-menu' sx={{
      p: 0
    }}>
      <Tabs onChange={handleChange} value={value}
        sx={{ backdropFilter: 'blur(20px)' }}>
        <Tab label='Hero' />
        <Tab label='Product' />
        <Tab label='Support' />
        <Tab label='Settings' />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        Hero Page
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Product page
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Support />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Settings />
      </CustomTabPanel>
    </Box>
  )
}

export default Menu;