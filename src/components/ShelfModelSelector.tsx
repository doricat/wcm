import { Autocomplete, TextField } from "@mui/material";
import { textFieldSlotProps } from "./props";
import { useAtomValue } from "jotai";
import { shelfModelsAtom } from "../store";
import { Controller, useFormContext } from "react-hook-form";

export function ShelfModelSelector(props: { label?: string; required: boolean; }) {
    const { control } = useFormContext<{ shelfModels: string[]; }>();
    const options = useAtomValue(shelfModelsAtom);

    return (
        <Controller name="shelfModels" control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete
                    multiple
                    value={value}
                    onChange={(_, option) => onChange(option)}
                    fullWidth={true}
                    options={options}
                    forcePopupIcon={false}
                    size="small"
                    renderInput={(params) => <TextField {...params} required={props.required} slotProps={textFieldSlotProps} variant="outlined" label={props.label} error={!!error} helperText={error?.message} inputRef={ref} />}
                />
            )}
        />
    );
}