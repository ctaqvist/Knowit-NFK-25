import { countries } from '@/utils/data/countries';
import { Autocomplete, Box, TextField } from '@mui/material';
import { SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { ContactForm, CountryType } from '@/types/types';
import Icon from './Icon';

type CountrySelectProps = {
    formData: ContactForm;
    setFormData: React.Dispatch<SetStateAction<ContactForm>>;
};

export default function CountrySelect({
    setFormData,
    formData,
}: CountrySelectProps) {
    const [countrySelectOpen, setCountrySelectOpen] = useState(false);


    const handleChange = (e: SyntheticEvent) => {
        const { value } = (e.target as HTMLLIElement).dataset
        const country = countries.find(c => c.code === value)
        if (!country) return;
        setFormData({
            ...formData,
            telephone: {
                ...country,
                number: formData.telephone.number,
            },
        });
        setCountrySelectOpen(false)
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            telephone: {
                ...formData.telephone,
                number: e.target.value
            },
        });
    };

    const triggerAutocompleteDropdown = () => {
        const input = document.querySelector<HTMLInputElement>('#country-select');
        if (input) {
            input.focus();

            input.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: countrySelectOpen ? 'Escape' : 'ArrowDown',
                    bubbles: true,
                })
            );
            setCountrySelectOpen((prev) => !prev);
        }
    };

    useEffect(() => {
        const el = document.querySelector(`[data-value="${formData.telephone.code}"]`)
        if (!el) return
        el.classList.add('selectedCountry')
    }, [countrySelectOpen])

    return (
        <Autocomplete
            sx={{
                position: 'relative',
                height: 64,
                '& .MuiInputBase-root:not(:has(#number-input))': {
                    backgroundColor: 'rgba(188, 197, 255, 0.3)',
                },
            }}
            defaultValue={formData.telephone}
            value={formData.telephone}
            id='country-select'
            options={countries}
            autoHighlight
            onChange={handleChange}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    /**
                     * Options
                     */
                    <Box
                        key={option.code}
                        data-value={option.code}
                        component='li'
                        sx={{
                            gap: '9px', fontSize: 16,
                            '& > img': { flexShrink: 0, width: 33, borderRadius: '2px' },
                        }}
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
                /*
                 * Visual "Select"
                 */
                <Box position={'relative'}>
                    <Box
                        sx={{
                            width: '96px',
                            position: 'absolute',
                            zIndex: 2,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: '20px',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            '&:hover': { cursor: 'pointer' },
                        }}
                        onClick={triggerAutocompleteDropdown}
                    >
                        <Box
                            component='img'
                            onClick={triggerAutocompleteDropdown}
                            borderRadius={'2px'}
                            loading='lazy'
                            sx={{ marginRight: 0 }}
                            width='33px'
                            srcSet={`https://flagcdn.com/w40/${formData?.telephone?.code?.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${formData?.telephone?.code?.toLowerCase()}.png`}
                            alt=''
                        />
                        <Icon
                            src='/src/assets/Icon_arrow_down.svg'
                            width='18px'
                            height='14px'
                        />
                    </Box>

                    <TextField
                        /**
                         * Phone number input
                         */
                        id='number-input'
                        onChange={handleNumberChange}
                        value={formData.telephone.number}
                        onClick={(e) => {
                            e.stopPropagation();
                            (e.target as HTMLButtonElement).focus();
                        }}
                        sx={{
                            maxHeight: 64,
                            position: 'absolute',
                            width: 318.5,
                            right: 0,
                            zIndex: 5,
                            height: 64,
                            '& .MuiInputBase-root': {
                                p: 0,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            },
                        }}
                    />
                    <TextField
                        /**
                         * Select for countries
                         */
                        sx={{
                            caretColor: 'transparent',
                            height: 64,
                            '&:hover, .MuiInputBase-root:hover, input:hover': {
                                cursor: 'pointer',
                            },

                        }}
                        {...params}
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                                autoComplete: 'new-password',
                                value: '',
                            },
                        }}
                    ></TextField>
                </Box>
            )}
        />
    );
}
