import { AccordionDetails, AccordionSummary, Accordion as MUIAccordion, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type CustomAccordionProps = {
  summary: string;
  details: string;
}

function Accordion({ summary, details }: CustomAccordionProps) {
  return (
    <MUIAccordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color='primary' />}
        aria-controls={`panel`}
        id='panel1-header'
        sx={{
          '& :focus-within, :focus-visible': { border: '2px solid white' },
          '& .MuiSvgIcon-root': { width: 40, height: 40 }
        }}

      >
        <Typography variant='body2'>
          {summary}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant='body2'>
          {details}
        </Typography>
      </AccordionDetails>
    </MUIAccordion>
  )
}

export default Accordion