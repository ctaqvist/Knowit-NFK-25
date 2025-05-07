import { countries } from '@/utils/data/countries';
import { Autocomplete, Box, TextField } from '@mui/material';
import { SetStateAction, SyntheticEvent, useState } from 'react';
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
        console.log('value', (e.target as HTMLLIElement).value)
        const { value } = (e.target as HTMLLIElement)
        if (!value) return;
        // setFormData({
        //     ...formData,
        //     telephone: {
        //         ...value,
        //         number: formData.telephone.number,
        //     },
        // });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        const countryCode = formData.telephone.phone;
        let number = inputValue.startsWith(countryCode)
            ? inputValue.slice(countryCode.length)
            : inputValue;

        setFormData({
            ...formData,
            telephone: {
                ...formData.telephone,
                number,
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

    return (
        <Autocomplete
            sx={{
                position: 'relative',
                height: 64,
                '& .MuiInputBase-root:not(:has(#number-input))': {
                    backgroundColor: 'rgba(188, 197, 255, 0.3)',
                },
                // Listbox
                '& .MuiAutocomplete-paper, #country-select-listbox': { backgroundColor: 'red' }
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
                    /**
                     * Options
                     */
                    <Box
                        key={option.code}
                        component='li'
                        sx={{
                            '& > img': { mr: 2, flexShrink: 0 },
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
                        value={`${formData.telephone.phone}${formData.telephone.number}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            (e.target as HTMLButtonElement).focus();
                        }}
                        sx={{
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
