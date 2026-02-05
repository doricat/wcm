import { Box, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { textFieldSlotProps } from "./props";
import { locationsAtom, selectedElementAtom, shelvesAtom, transportTasksAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import { createNew } from "../types/transportTask";

const schema = yup.object({
    shelfCode: yup.string().required("请选择货架或在地图上选择").max(50, "货架最多50个字符"),
    toLocationCode: yup.string().required("请选择库位或在地图上选择").max(50, "库位最多50个字符")
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    shelfCode?: string;
    toLocationCode?: string;
}

export const TransportTaskCreationForm = forwardRef((props: Props, ref: React.Ref<{ submit: () => Promise<boolean> }>) => {
    const { shelfCode, toLocationCode } = props;
    const [selectedElement, setSelectedElement] = useAtom(selectedElementAtom);
    const [tasks, setTasks] = useAtom(transportTasksAtom);
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            shelfCode: shelfCode ?? '',
            toLocationCode: toLocationCode ?? ''
        }
    });

    const onSubmit = async (data: FormValues) => {
        setTasks([...tasks, createNew(data.shelfCode, data.toLocationCode, shelves, locations)]);
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return true;
        }
    }));

    if (selectedElement) {
        if (selectedElement.type === 'shelf') {
            if (!shelfCode) {
                setValue('shelfCode', selectedElement.code);
            }
        } else {
            if (!toLocationCode) {
                setValue('toLocationCode', selectedElement.code);
            }
        }

        setSelectedElement(null);
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1}>
                <TextField label="货架" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.shelfCode} helperText={errors.shelfCode?.message} {...register('shelfCode')} />
                <TextField label="库位" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.toLocationCode} helperText={errors.toLocationCode?.message} {...register('toLocationCode')} />
            </Stack>
        </Box>
    );
});