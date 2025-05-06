import { countries } from '@/utils/data/countries';
import { Autocomplete, Box, TextField } from '@mui/material';
import { SetStateAction, SyntheticEvent } from 'react';
import { ContactForm } from '@/types/types';

type CountrySelectProps = {
    formData: ContactForm;
    setFormData: React.Dispatch<SetStateAction<ContactForm>>;
};

export default function CountrySelect({
    setFormData,
    formData,
}: CountrySelectProps) {
    const handleChange = (event: SyntheticEvent, value: any | null) => {
        if (!value) return;

        setFormData({
            ...formData,
            telephone: {
                ...value,
                number: formData.telephone.number,
            },
        });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        ['telephone']: {
          ...formData.telephone,
          ['number']: e.target.value,
        },
      });
    };

    return (
        <Autocomplete
            sx={{
                position: 'relative',
                height: 64,
                '& .MuiInputBase-root:not(:has(#number-input))': {backgroundColor: 'rgba(188, 197, 255, 0.3)'}
            }}
            defaultValue={formData.telephone}
            value={formData.telephone}
            onChange={handleChange}
            id='country-select'
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <Box
                        value={option.code}
                        key={key}
                        component='li'
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        <img
                            loading='lazy'
                            width='20'
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=''
                        />
                        {option.label} +{option.phone}
                    </Box>
                );
            }}
            renderInput={(params) => (
                <Box position={'relative'}>
                    <Box
                        sx={{
                            position: 'absolute',
                            zIndex: 2,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: '20px',
                        }}
                    >
                        <img
                            loading='lazy'
                            width='33'
                            srcSet={`https://flagcdn.com/w40/${formData?.telephone?.code?.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${formData?.telephone?.code?.toLowerCase()}.png`}
                            alt=''
                        />
                    </Box>

                    <TextField
                      id='number-input'
                        onChange={handleNumberChange}
                        value={formData.telephone.number}
                        onClick={(e) => {
                            e.stopPropagation();
                            (e.target as HTMLButtonElement).focus()
                        }}
                        sx={{
                            position: 'absolute',

                            right: 0,
                            zIndex: 5,
                            height: 64,
                            '& .MuiInputBase-root': {
                                p: 0,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }
                        }}
                    />
                    <TextField
                        sx={{
                            caretColor: 'transparent',
                            height: 64,
                            '& ': { height: '100%' },
                        }}
                        {...params}
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                                autoComplete: 'new-password',
                                value: ''
                            },
                            
                        }}
                    ></TextField>
                </Box>
            )}
        />
    );
}
