import { Autocomplete, TextField, type AutocompleteProps } from "@mui/material";
import { useEffect, useState } from "react";
import type { LocationMapElementModel } from "../types/location";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { locationsAtom } from "../store";
import { Controller, useFormContext } from "react-hook-form";

type Props = { label?: string; } & Omit<AutocompleteProps<LocationMapElementModel, false, false, false>, 'renderInput'>;

export function LocationAutocomplete(props: Props) {
    const [open, setOpen] = useState(false);
    const { control, formState: { defaultValues } } = useFormContext<{ locationCode: string; }>();
    const [inputValue, setInputValue] = useState(defaultValues?.locationCode ?? '');
    const [options, setOptions] = useState<LocationMapElementModel[]>([]);
    const locations = useAtomValue(locationsAtom);

    const doSearch = () => {
        setOptions(locations.filter(x => x.code.toLowerCase().includes(inputValue.toLowerCase())));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, locations]);

    return (
        <Controller name="locationCode" control={control}
            render={({ field: { onChange, ref }, fieldState: { error } }) => (
                <Autocomplete open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    inputValue={inputValue}
                    onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                    noOptionsText={inputValue.length === 0 ? null : "无匹配项"}
                    onChange={(_, option) => onChange(option?.code ?? '')}
                    fullWidth={true}
                    options={options}
                    forcePopupIcon={false}
                    getOptionKey={option => option.code}
                    getOptionLabel={option => option.code}
                    renderInput={(params) => <TextField {...params} slotProps={textFieldSlotProps} size="small" variant="outlined" label={props.label} error={!!error} helperText={error?.message} inputRef={ref} />}
                />
            )}
        />
    );
}