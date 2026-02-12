import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { shelvesAtom } from "../store";
import { Controller, useFormContext } from "react-hook-form";
import type { ShelfMapElementModel } from "../types/shelf";

export function ShelfAutocomplete(props: { label?: string; required: boolean; disabled?: boolean; }) {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext<{ shelfCode: string; }>();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<ShelfMapElementModel[]>([]);
    const shelves = useAtomValue(shelvesAtom);

    const doSearch = () => {
        setOptions(shelves.filter(x => x.code.toLowerCase().includes(inputValue.toLowerCase())));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, shelves]);

    return (
        <Controller name="shelfCode" control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={{ code: value, model: '', enabled: true, locationCode: null }}
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
                    renderInput={(params) => <TextField {...params} required={props.required} slotProps={textFieldSlotProps} variant="outlined" label={props.label} error={!!error} helperText={error?.message} inputRef={ref} />}
                />
            )}
        />
    );
}