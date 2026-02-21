import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { materialsAtom } from "../store";
import { Controller, useFormContext } from "react-hook-form";
import type { Material } from "../types/material";
import { getDisplayName } from "../utils";
import { filterTake } from "../types/utils";

export function MaterialAutocomplete(props: { label?: string; required: boolean; }) {
    const [open, setOpen] = useState(false);
    const { control } = useFormContext<{ materialCode: string; }>();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<Material[]>([]);
    const materials = useAtomValue(materialsAtom);

    const doSearch = () => {
        setOptions(filterTake(materials, x => x.code.toLowerCase().includes(inputValue.toLowerCase()), 20));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, materials]);

    return (
        <Controller name="materialCode" control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={materials.find(x => x.code === value) ?? null}
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