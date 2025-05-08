import { MenuItem, Select, TextField } from '@mui/material';
import {
    ChangeEvent,
    SetStateAction,
    SyntheticEvent,
    useState,
} from 'react';
import { ContactForm } from '@/types/types';
import { INITIAL_COUNTRIES } from '@/utils/data/countries';

type CountrySelectProps = {
    formData: ContactForm;
    setFormData: React.Dispatch<SetStateAction<ContactForm>>;
};

export default function CountrySelect2({
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
        setFormData({
            ...formData,
            telephone: {
                ...formData.telephone,
                number: e.target.value,
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

    const handleSelectChange = () => { };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);
        const FILTERED_COUNTRIES = countries.filter((c) =>
            c.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCountries(FILTERED_COUNTRIES)
    };

    return (
        <>
            <Select onChange={handleSelectChange}>
                <MenuItem
                    disabled
                    value='Select an option'
                    sx={{ display: 'none' }}
                ></MenuItem>
                <TextField
                    placeholder='Search for country'
                    variant='standard'
                />

                {countries.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                        <img
                            loading='lazy'
                            width='20'
                            srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                            alt=''
                        />
                        {c.label} +{c.phone}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
}
