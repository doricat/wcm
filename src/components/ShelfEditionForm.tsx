import { Box, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Stack, Switch, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textFieldSlotProps } from "./props";
import { selectedElementAtom, shelfModelsAtom, shelvesAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import type { ShelfMapElementModel } from "../types/shelf";

const schema = yup.object({
    code: yup.string().required(),
    model: yup.string().required(),
    enabled: yup.boolean().required(),
    locationCode: yup.string().required("请选择库位或在地图上选择").max(50, "库位最多50个字符")
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    shelf: ShelfMapElementModel;
}

export const ShelfEditionForm = forwardRef((props: Props, ref: React.Ref<{ submit: () => Promise<boolean> }>) => {
    const { shelf } = props;
    const [selectedElement, setSelectedElement] = useAtom(selectedElementAtom);
    const [shelves, setShelves] = useAtom(shelvesAtom);
    const shelfModels = useAtomValue(shelfModelsAtom);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            code: shelf.code,
            model: shelf.model,
            enabled: shelf.enabled,
            locationCode: shelf.locationCode ?? ''
        }
    });

    const onSubmit = async (data: FormValues) => {
        const arr = shelves.filter(x => x.code !== shelf.code);
        arr.push({ code: shelf.code, model: data.model, enabled: data.enabled, locationCode: data.locationCode === '' ? null : data.locationCode });
        setShelves(arr);
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return true;
        }
    }));

    if (selectedElement) {
        if (selectedElement.type === 'location') {
            setValue('locationCode', selectedElement.code);
        }

        setSelectedElement(null);
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1}>
                <TextField label="货架编码" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required disabled  {...register('code')} />
                <FormControl fullWidth variant="outlined" size="small" required error={!!errors.model}>
                    <InputLabel>货架型号</InputLabel>
                    <Controller name="model" control={control}
                        render={({ field }) => (
                            <Select label="货架型号" {...field} value={field.value ?? ''}>
                                {shelfModels.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                            </Select>
                        )}
                    />
                    {errors.model && <FormHelperText>{errors.model?.message}</FormHelperText>}
                </FormControl>
                <Controller name="enabled" control={control}
                    render={({ field }) => (
                        <FormControlLabel control={<Switch checked={field.value} {...field} name="enabled" />} label="是否启用" />
                    )}
                />
                <TextField label="绑定库位" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.locationCode} helperText={errors.locationCode?.message} {...register('locationCode')} />
            </Stack>
        </Box>
    );
});