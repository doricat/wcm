import { Box, Stack } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { locationsAtom, selectedElementAtom, shelvesAtom, transportTasksAtom } from "../store";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import { createNew } from "../types/transportTask";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { ShelfAutocomplete } from "./ShelfAutocomplete";

const schema = yup.object({
    shelfCode: yup.string().required('请选择货架或在地图上选择').max(50, '货架最多50个字符'),
    locationCode: yup.string().required('请选择库位或在地图上选择').max(50, '库位最多50个字符')
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

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            shelfCode: shelfCode ?? '',
            locationCode: toLocationCode ?? ''
        }
    });

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { isValid }
    } = methods;

    const onSubmit = async (data: FormValues) => {
        setTasks([...tasks, createNew(data.shelfCode, data.locationCode, shelves, locations, tasks)]);
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return isValid;
        }
    }));

    if (selectedElement) {
        if (selectedElement.type === 'shelf') {
            if (!shelfCode) {
                setValue('shelfCode', selectedElement.code, { shouldValidate: true });
            }
        } else {
            if (!toLocationCode) {
                setValue('locationCode', selectedElement.code, { shouldValidate: true });
            }
        }

        setSelectedElement(null);
    }

    return (
        <FormProvider {...methods}>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={1}>
                    <ShelfAutocomplete label="货架" required disabled={!!shelfCode} />
                    <LocationAutocomplete label="库位" required disabled={!!toLocationCode} />
                </Stack>
            </Box>
        </FormProvider>
    );
});