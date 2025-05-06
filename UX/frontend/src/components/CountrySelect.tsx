import { countries } from '@/utils/data/countries';
import { Autocomplete, Box, TextField } from '@mui/material';
import { SetStateAction, SyntheticEvent } from 'react';
import { ContactForm } from '@/types/types';

type CountrySelectProps = {
  formData: ContactForm,
  setFormData: React.Dispatch<SetStateAction<ContactForm>>

}



export default function CountrySelect({ setFormData, formData }: CountrySelectProps) {
  const handleChange = (e: SyntheticEvent<Element, Event>) => {
    const fullCountry = countries.find(c => c.code === (e.target as HTMLInputElement).value)
    setFormData({ ...formData, ['telephone']: fullCountry })
  }

  return (
    <Autocomplete
      onChange={handleChange}
      id="country-select"
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            />
            {option.label} +{option.phone}
          </Box>
        );
      }}
      renderInput={(params) => (
        <Box position={'relative'}>
          <Box sx={{
            position: 'absolute', zIndex: 2, top: '50%', transform: 'translateY(-50%)',
            left: '20px'
          }}>
            <img
              loading="lazy"
              width="33"
              srcSet={`https://flagcdn.com/w40/${formData?.telephone?.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${formData?.telephone?.code?.toLowerCase()}.png`}
              alt=""
            />
          </Box>
          <TextField
            sx={{
              pl: '116px',
              '& > .MuiInputBase-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
            }}
            {...params}
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                autoComplete: 'new-password',
              },
            }}
          >
          </TextField>
        </Box>
      )
      }
    />
  );
}