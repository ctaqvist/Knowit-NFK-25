import { INITIAL_COUNTRIES as countries, INITIAL_COUNTRIES } from '@/utils/data/countries';
import { Autocomplete, Box, TextField } from '@mui/material';
import {
    ChangeEvent,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useState,
} from 'react';
import { ContactForm, CountryType } from '@/types/types';
import Icon from './Icon';

type CountrySelectProps = {
    formData: ContactForm;
    setFormData: React.Dispatch<SetStateAction<ContactForm>>;
};
type OptionType = CountryType | { isSearchField: true; label: string, key: string };

export default function CountrySelect({
    setFormData,
    formData,
}: CountrySelectProps) {
    const [countrySelectOpen, setCountrySelectOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState(INITIAL_COUNTRIES)

    const handleChange = (e: SyntheticEvent) => {
        const { value } = (e.target as HTMLLIElement).dataset;
        const country = countries.find((c) => c.code === value);
        if (!country) return;
        setFormData({
            ...formData,
            telephone: {
                ...country,
                number: formData.telephone.number,
            },
        });
        setCountrySelectOpen(false);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { number: currentNumber } = formData.telephone

        let formattedNumber = e.target.value.slice(0, currentNumber.length + 1)
        setFormData({
            ...formData,
            telephone: {
                ...formData.telephone,
                number: formattedNumber
            },
        });
    };

    const handleAutocompleteInputChange = (
        _event: React.SyntheticEvent,
        newValue: string,
    ) => {
        setSearchTerm(newValue);
        console.log('autocompletete change', newValue);
    };

    /*
    * Function to trigger dropdown
    * When pressing the visual select
     */
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
        if (countrySelectOpen) {
            setTimeout(() => {
                const el = document.querySelector(
                    `[data-value="${formData.telephone.code}"]`
                );
                if (!el) return;
                el.classList.add('selectedCountry');
            }, 10)
        }
    }, [countrySelectOpen]);

    const Searchfield = () => (
        <TextField
            placeholder='Search for country'
            sx={{ width: '100%' }}
            variant='standard'
            value={searchTerm}
            id='custom-search'
            slotProps={{ input: { disableUnderline: true } }}

        />
    );

    return (
        <Autocomplete
            sx={{
                position: 'relative',
                height: 64,
                '& .MuiInputBase-root:not(:has(#number-input))': {
                    backdropFilter: 'blur(25px)'
                },

                // // Style the search field to match dropdown
                // '.MuiAutocomplete-inputRoot': {
                //     top: '61px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                //     border: 'none', boxShadow: 'none !important',
                //     '&:focus': { border: 'none !important' },
                //     backdropFilter: 'blur(25px)', '&:hover': { border: 'none' },
                //     '&:has(input:focus, fieldset:focus, :focus)': { border: 'none' },
                // }
            }}
            popupIcon={<></>}
            inputValue={searchTerm}
            onInputChange={handleAutocompleteInputChange}
            value={formData.telephone}
            onChange={handleChange}
            id='country-select'
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                if ('isSearchField' in option && option.isSearchField) {
                    return (
                        <Box
                            key={key}
                            component='li'
                            sx={{ width: '100%', px: 2 }}
                        >
                            <Searchfield />
                        </Box>
                    );
                }

                return (
                    <Box
                        key={option.code}
                        data-value={option.code}
                        component='li'
                        sx={{
                            gap: '9px',
                            fontSize: 16,
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
                            paddingRight: 0,
                            maxHeight: 62,
                            position: 'absolute',
                            width: 318.5,
                            right: 0,
                            zIndex: 5,
                            height: 64,
                            '& .MuiInputBase-root': {
                                maxHeight: 64,
                                p: 0,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                paddingRight: '0 !important',
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
