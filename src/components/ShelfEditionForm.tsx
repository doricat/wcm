import { Box, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Stack, Switch, TextField } from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textFieldSlotProps } from "./props";
import { shelfModelsAtom, shelvesAtom, transportTasksAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { ShelfMapElementModel } from "../types/shelf";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { customEventTypes } from "../types/enums";
import type { SelectedElement } from "../types/map";

const schema = yup.object({
    code: yup.string().required(),
    model: yup.string().required(),
    enabled: yup.boolean().required(),
    locationCode: yup.string().notRequired().max(50, '库位最多50个字符').default('')
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    shelf: ShelfMapElementModel;
}

export const ShelfEditionForm = forwardRef((props: Props, ref: React.Ref<{ submit: () => Promise<boolean> }>) => {
    const { shelf } = props;
    const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
    const [shelves, setShelves] = useAtom(shelvesAtom);
    const shelfModels = useAtomValue(shelfModelsAtom);
    const tasks = useAtomValue(transportTasksAtom);

    useEffect(() => {
        const handleEvt = (evt: CustomEventInit<{ code: string; }>) => {
            if (evt.detail) {
                setSelectedElement({ code: evt.detail.code, type: 'location' });
            }
        };

        window.addEventListener(customEventTypes.locationSelected, handleEvt);

        return () => {
            window.removeEventListener(customEventTypes.locationSelected, handleEvt);
        }
    }, []);

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            code: shelf.code,
            model: shelf.model,
            enabled: shelf.enabled,
            locationCode: shelf.locationCode ?? ''
        }
    });

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue
    } = methods;

    const onSubmit = async (data: FormValues) => {
        if (data.locationCode !== '') {
            if (tasks.some(x => x.endLocationCode === data.locationCode)) {
                throw new Error('指定的库存存在活动任务');
            }

            if (shelves.some(x => x.code !== shelf.code && x.locationCode === data.locationCode)) {
                throw new Error('指定的库存存在其他货架');
            }
        }

        const arr = shelves.filter(x => x.code !== shelf.code);
        arr.push({ code: shelf.code, model: data.model, enabled: data.enabled, locationCode: data.locationCode === '' ? null : data.locationCode });
        setShelves(arr);
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return isValid;
        }
    }));

    useEffect(() => {
        if (selectedElement && selectedElement.type === 'location') {
            setValue('locationCode', selectedElement.code, { shouldValidate: true });
        }

    }, [selectedElement, setValue]);

    return (
        <FormProvider {...methods}>
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
                    <LocationAutocomplete label="绑定库位" required={false} />
                </Stack>
            </Box>
        </FormProvider>
    );
});