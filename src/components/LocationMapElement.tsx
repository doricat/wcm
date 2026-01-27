import { Paper, Stack, Typography } from "@mui/material";
import { type LocationMapElementModel } from "../types/location";
import { getLocationStyle } from "../types/map";
import type { ShelfMapElementModel } from "../types/shelf";
import type { TransportTaskMapModel } from "../types/transportTask";
import type { InventoryMapModel } from "../types/inventory";
import { scaleAtom } from "../store";
import { useAtomValue } from "jotai";

interface Props {
    location: LocationMapElementModel;
    shelf: ShelfMapElementModel | null;
    inventories: InventoryMapModel[];
    arriveTasks: TransportTaskMapModel[];
    leaveTask: TransportTaskMapModel | null;
}

export function LocationMapElement(props: Props) {
    const scale = useAtomValue(scaleAtom);
    const b = scale > 0.42;
    return (
        <Paper elevation={0} variant="outlined" className="map-location-box" style={getLocationStyle(props.location)} data-location-code={props.location.code}>
            <Stack spacing={0} alignItems="center" justifyItems="flex-start" style={{ height: '100%', pointerEvents: 'none' }}>
                <Typography variant="subtitle1">{props.location.code}</Typography>
                {props.shelf && b ? <Typography variant="body2">{props.shelf.code}</Typography> : null}
                {props.inventories.length == 1 && b ? <Typography variant="body2">{props.inventories[0].materialCode}</Typography> : null}
            </Stack>
        </Paper>
    );
}