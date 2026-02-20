import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { supplersAtom } from "../store";
import { Controller, useFormContext } from "react-hook-form";
import type { Supplier } from "../types/supplier";
import { getDisplayName } from "../utils";

export function SupplierAutocomplete(props: { label?: string; required: boolean; }) {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext<{ supplierCode: string; }>();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<Supplier[]>([]);
    const suppliers = useAtomValue(supplersAtom);

    const doSearch = () => {
        setOptions(suppliers.filter(x => x.code.toLowerCase().includes(inputValue.toLowerCase())));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, suppliers]);

    return (
        <Controller name="supplierCode" control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={suppliers.find(x => x.code === value) ?? null}
                    isOptionEqualToValue={(option, selected) => option.code === selected.code}
                    inputValue={inputValue}
                    onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                    noOptionsText={inputValue.length === 0 ? null : "无匹配项"}
                    onChange={(_, option) => onChange(option?.code ?? '')}
                    fullWidth={true}
                    options={options}
                    forcePopupIcon={false}
                    getOptionKey={option => option.code}
                    getOptionLabel={option => option.code}
                    renderOption={(props, option) => (
                        <li {...props} key={option.code}>
                            {getDisplayName(option.code, option.name)}
                        </li>
                    )}
                    size="small"
                    renderInput={(params) => <TextField {...params} required={props.required} slotProps={textFieldSlotProps} variant="outlined" label={props.label} error={!!error} helperText={error?.message} inputRef={ref} />}
                />
            )}
        />
    );
}