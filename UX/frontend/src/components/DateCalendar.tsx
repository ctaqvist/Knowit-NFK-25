import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { SetStateAction } from 'react';
import { ContactForm } from '@/types/types';
import { Dayjs } from 'dayjs';

type BasicDateCalendarProps = {
  formData: ContactForm;
  setFormData: React.Dispatch<SetStateAction<ContactForm>>
}

export default function BasicDateCalendar({ setFormData, formData }: BasicDateCalendarProps) {

  const handleChange = (date: Dayjs | null) => {
    if (!date) return;

    setFormData({
      ...formData,
      booking: {
        ...formData.booking!,
        date: date.add(1, 'day').toISOString().slice(0, 10)
      },
    });
  };

  function CustomDay(
    props: PickersDayProps
  ) {
    const { day } = props;
    const dayOfWeek = day.day(); // Sunday: 0, Saturday: 6
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return <span style={{ display: 'none' }} />; // Hide weekends
    }
    return <PickersDay {...props} />;
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
      views={['day']}
        onChange={handleChange}
        shouldDisableDate={(date) => date.day() === 0 || date.day() === 6}
        slots={{ day: CustomDay, }}
        disableHighlightToday

        sx={{
          backgroundColor: 'rgba(188, 197, 255, 0.1)', border: '1px solid rgba(188, 197, 255, 1)', borderRadius: '10px', padding: '41px 40px', m: 0, gap: '30px', maxHeight: '100%', height: '100%', maxWidth: 370, width: '100%', position: 'relative',

          // Month/Year select
          '& .MuiPickersCalendarHeader-labelContainer': {margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)'},
          '& .MuiPickersArrowSwitcher-root': {width: '100%', justifyContent: 'space-between'},

          // Calendar header
          '& .MuiPickersCalendarHeader-root': { margin: 0, p: 0, overflow: 'hidden' },
          '& .MuiPickersCalendarHeader-root::-webkit-scrollbar': { display: 'none' },
          '& .css-1r48rix-MuiButtonBase-root-MuiIconButton-root-MuiPickersCalendarHeader-switchViewButton': { display: 'none' },
          '& path': { fill: 'rgba(85, 38, 255, 1)' },
          '& .MuiPickersCalendarHeader-root button': { p: 0 },

          // Weekday label
          '& .MuiDayCalendar-header': { justifyContent: 'space-between', mb: '10px' },
          '& .MuiDayCalendar-weekDayLabel': { color: 'rgba(85, 38, 255, 1)', fontWeight: 700, fontFamily: 'Instrument Sans, sans-serif', fontSize: 20 },
          '& .MuiPickersDay-root': { fontFamily: 'Instrument Sans, sans-serif', fontSize: 18 },
          '& .css-1ckygne-MuiButtonBase-root-MuiPickersDay-root.Mui-disabled:not(.Mui-selected)': { color: 'white', opacity: 0.3 },
          '& .MuiDayCalendar-weekContainer': { justifyContent: 'space-between', mb: '10px' },

          // Do not show Saturday + Sunday label
          '& .MuiDayCalendar-header :is([aria-label="Saturday"], [aria-label="Sunday"])': { display: 'none' },

          // Selected State
          '& .Mui-selected': { backgroundColor: 'rgba(85, 38, 255, 1) !important' },


          '& .MuiPickersSlideTransition-root': { height: 230, minHeight: 200, overflow: 'hidden' }

        }}
        disablePast
      />
    </LocalizationProvider>
  );
}
