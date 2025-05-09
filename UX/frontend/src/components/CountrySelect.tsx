import {
    INITIAL_COUNTRIES,
} from '@/utils/data/countries';
import { Box, Button, MenuItem, Popover, TextField } from '@mui/material';
import {
    ChangeEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import { ContactForm } from '@/types/types';
import Icon from './Icon';

type CountrySelectProps = {
    formData: ContactForm;
    setFormData: React.Dispatch<SetStateAction<ContactForm>>;
};

export default function CountrySelect({
    setFormData,
    formData,
}: CountrySelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState(INITIAL_COUNTRIES);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const anchorRef = useRef(null)

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            telephone: {
                ...formData.telephone,
                number: e.target.value,
            },
        });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSelectCountry = (e: React.MouseEvent<HTMLLIElement>) => {
        document.querySelector('.selectedCountry')?.classList.remove('selectedCountry')
        const target = e.currentTarget as HTMLLIElement;
        const value = target.dataset.value;
        e.currentTarget.setAttribute('aria-selected', 'true')

        target.classList.add('selectedCountry')
        const country = countries.find(c => c.code === value)
        if (!country) return;
        setFormData({
            ...formData,
            telephone: {
                ...country,
                number: formData.telephone.number
            }
        })

        const el = document.querySelector('#number-input') as HTMLInputElement
        if (el) el.style.paddingLeft = (`${(country.phone.length + 1) * 5}px`)
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        const filteredCountries = INITIAL_COUNTRIES.filter(c => c.label.toLowerCase().includes(e.target.value))
        setCountries(filteredCountries)
    }

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                const el = document.querySelector(`[data-value="${formData.telephone.code}"]`)
                if (!el) return;
                el.classList.add('selectedCountry')
                el.setAttribute('aria-selected', 'true')
            }, 10)
        }
    }, [open])

    return (
        <Box sx={{ display: 'flex', }}
            ref={anchorRef}>
            <Button
                id='country-select'
                aria-label='Optional: Select country'
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuOpen}

                sx={{
                    height: 61, borderRadius: 0, border: '1px solid rgba(188, 197, 255, 1)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', width: 96, gap: '10px', backgroundColor: 'rgba(188, 197, 255, 0.3)', borderRight: 0,

                    '&:focus': { boxShadow: '8px 10px 14px 0px rgba(85, 38, 255, 0.24), inset 0px 0px 0px 2px rgba(85, 38, 255, 1)', border: '1px solid rgba(85, 38, 255, 1)' }
                }}
            >
                <img
                    loading='lazy'
                    width='33'
                    srcSet={`https://flagcdn.com/w40/${formData?.telephone?.code?.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${formData?.telephone?.code?.toLowerCase()}.png`}
                    alt=''
                    style={{ borderRadius: 2 }}
                />
                <Icon
                    src='/src/assets/Icon_arrow_down.svg'
                    width='18px'
                    height='14px'
                    alt='Expand'
                />
            </Button>
            <TextField
                variant='outlined'
                disabled
                value={`+${formData.telephone.phone}`}

                sx={{
                    width: '100%', maxWidth: 317,
                    '& .MuiInputBase-root': { borderRadius: 0, paddingRight: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
                    '& input': { paddingRight: 0, borderRight: 'none' },
                    '& input.Mui-disabled': { color: 'white', opacity: 1, WebkitTextFillColor: 'white', }
                }}
            />
            <TextField
                value={formData.telephone.number}
                onChange={handleNumberChange}
                inputProps={{
                    autocomplete: 'new-password',
                    form: {
                        autocomplete: 'off',
                    },
                }}
                id='number-input'
                sx={{
                    flex: 1, position: 'absolute', right: 0, width: 317,
                    backgroundColor: 'transparent',
                    '& .MuiInputBase-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 0, backgroundColor: 'transparent', paddingLeft: '40px' }
                }}
            />

            {
                open && (
                    <Popover
                        role='combobox'
                        id='country-select-menu'
                        onClose={handleMenuClose}
                        anchorEl={anchorEl}
                        open={open}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}

                    >
                        <MenuItem sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute' }}>
                                <Icon src='/src/assets/Icon_search.svg' />
                            </Box>
                            <TextField
                                placeholder='Search for country'
                                id='custom-search'
                                variant='standard'
                                value={searchTerm}
                                onChange={handleSearch}
                                slotProps={{ input: { disableUnderline: true } }}

                                onKeyDown={(e) => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        const firstItem = document.querySelector('.MuiMenuItem-root')?.nextElementSibling;
                                        if (firstItem instanceof HTMLElement) {
                                            firstItem.focus();
                                        }
                                    }
                                }}
                            />
                        </MenuItem>
                        {countries.map(c => (
                            <MenuItem key={c.code}
                                data-value={c.code}
                                onClick={handleSelectCountry}
                                onKeyDown={(e) => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        const nextField = document.querySelector('#number-input');
                                        if (nextField instanceof HTMLElement) {
                                            setAnchorEl(null)
                                        }
                                    }
                                }}
                            >

                                <img
                                    loading='lazy'
                                    width='20'
                                    srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                                    src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                    alt=''
                                    style={{ borderRadius: 2 }}
                                />
                                {`${c.label} (+${c.phone})`}
                            </MenuItem>
                        ))
                        }
                    </Popover >
                )
            }
        </Box >
    );
}
