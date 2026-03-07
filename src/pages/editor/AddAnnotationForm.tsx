import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import { useForm, FormProvider, useWatch, useFormContext, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useImperativeHandle } from "react";
import { useAtom } from "jotai";
import { polygonAnnotationsAtom, textAnnotationsAtom } from "../../store";
import { AreaAutocomplete } from "../../components/AreaAutocomplete";
import { textFieldSlotProps } from "../../components/props";
import { generateId } from "../../utils";

const schema = yup.object({
    typeCode: yup.string().required('类型是必须的').max(10, '类型最多10个字符'),
    areaCode: yup.string().max(50, '库区编码最多50个字符').default('').when('typeCode', {
        is: 'area',
        then: x => x.required('库区是必须的')
    }),
    textCotent: yup.string().max(50, '文本内容最多50个字符').default('').when('typeCode', {
        is: 'text',
        then: x => x.required('文本内容是必须的')
    })
}).required();

type FormValues = yup.InferType<typeof schema>;

interface Props {
    x: number;
    y: number;
    ref?: React.Ref<{ submit: () => Promise<boolean>; }>;
}

export function AddAnnotationForm({ x, y, ref }: Props) {
    const [polygonAnnotations, setPolygonAnnotations] = useAtom(polygonAnnotationsAtom);
    const [textAnnotations, setTextAnnotations] = useAtom(textAnnotationsAtom);

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            typeCode: 'polygon',
            areaCode: '',
            textCotent: ''
        }
    });

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = methods;

    const values = useWatch({ control });

    const onSubmit = async (data: FormValues) => {
        if (data.typeCode === 'polygon' || data.typeCode === 'area') {
            const b = data.typeCode === 'area';
            setPolygonAnnotations([...polygonAnnotations, { id: generateId(), type: b ? 'area' : null, areaCode: b ? data.areaCode : null, x: x, y: y, w: 100, h: 100, backgroundColor: 'aliceblue' }]);
        } else {
            setTextAnnotations([...textAnnotations, { id: generateId(), content: data.textCotent, x: x, y: y, size: 20, w: 100, h: 100, color: '#000' }]);
        }
        reset();
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)();
            return isValid;
        }
    }));

    return (
        <FormProvider {...methods}>
            <Box component="form">
                <Stack spacing={1}>
                    <PolygonTypeSelector label="标注类型" required />
                    {values.typeCode === 'area' ? <AreaAutocomplete label="库区" required /> : null}
                    {values.typeCode === 'text' ? <TextField label="文本内容" variant="outlined" size="small" slotProps={textFieldSlotProps} fullWidth required error={!!errors.textCotent} helperText={errors.textCotent?.message} {...register('textCotent')} /> : null}
                </Stack>
            </Box>
        </FormProvider>
    );
}

const polygonTypes = [
    { code: 'polygon', name: '矩形' },
    { code: 'area', name: '库区' },
    { code: 'text', name: '文本' }
];

function PolygonTypeSelector(props: { label?: string; required: boolean; }) {
    const { control } = useFormContext<{ typeCode: string; }>();

    return (
        <Controller name="typeCode" control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Autocomplete
                    value={polygonTypes.find(x => x.code === value) ?? null}
                    onChange={(_, option) => onChange(option?.code ?? '')}
                    fullWidth={true}
                    options={polygonTypes}
                    forcePopupIcon={false}
                    size="small"
                    getOptionKey={option => option.code}
                    getOptionLabel={option => option.name}
                    renderOption={(props, option) => (
                        <li {...props} key={option.code}>
                            {option.name}
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} required={props.required} slotProps={textFieldSlotProps} variant="outlined" label={props.label} error={!!error} helperText={error?.message} inputRef={ref} />}
                />
            )}
        />
    );
}