import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { LocationMapElementModel } from "../types/location";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { locationsAtom } from "../store";
import { Controller, useFormContext } from "react-hook-form";

export function LocationAutocomplete(props: { label?: string; required: boolean; disabled?: boolean; }) {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext<{ locationCode: string; }>();
    const [inputValue, setInputValue] = useState('');
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
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={{ code: value, level: 0, externalCode: '', shelfModels: [], enabled: true, areaCode: '', x: 0, y: 0, w: 0, h: 0 }}
                    inputValue={inputValue}
                    onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                    noOptionsText={inputValue.length === 0 ? null : "无匹配项"}
                    onChange={(_, option) => onChange(option?.code ?? '')}
                    fullWidth={true}
                    options={options}
                    forcePopupIcon={false}
                    getOptionKey={option => option.code}
                    getOptionLabel={option => option.code}
                    size="small"
                    disabled={props.disabled ?? false}
                    renderInput={(params) => <TextField {...params} required slotProps={textFieldSlotProps} variant="outlined" label={props.label} error={!!error} helperText={error?.message} inputRef={ref} />}
                />
            )}
        />
    );
}