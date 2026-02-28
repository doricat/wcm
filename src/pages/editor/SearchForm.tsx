import { Box, Stack } from "@mui/material";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AreaAutocomplete } from "../../components/AreaAutocomplete";
import { LocationAutocomplete } from "../../components/LocationAutocomplete";
import { useEffect } from "react";
import type { LocationModel } from "../../types/location";

const schema = yup.object({
    areaCode: yup.string().max(50).default(''),
    locationCode: yup.string().max(50).default('')
}).required();

type FormValues = yup.InferType<typeof schema>;

export function SearchForm(props: { locations: LocationModel[]; notify: (areaCode: string, locationCode: string) => void; }) {
    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            areaCode: '',
            locationCode: ''
        }
    });

    const { control } = methods;
    const values = useWatch({ control });

    useEffect(() => {
        props.notify(values.areaCode ?? '', values.locationCode ?? '');
    }, [values, props]);

    return (
        <FormProvider {...methods}>
            <Box component="form">
                <Stack spacing={1}>
                    <AreaAutocomplete required={false} label="库区" />
                    <LocationAutocomplete required={false} label="库位" locations={props.locations} />
                </Stack>
            </Box>
        </FormProvider>
    );
}