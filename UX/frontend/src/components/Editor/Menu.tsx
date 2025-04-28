import { useContent } from '@/hooks/useContent';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import Settings from './Settings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Menu() {
  const { pages } = useContent()
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!pages) return
  }, [pages])

  if (!pages) return

  return (
    <>
      <Tabs onChange={handleChange} value={value}>
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
        Support page
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Settings />
      </CustomTabPanel>
    </>
  )
}

export default Menu;