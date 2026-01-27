import { Paper, Stack, Typography } from "@mui/material";
import { type LocationMapElementModel } from "../types/location";
import { getLocationStyle } from "../types/map";
import type { ShelfMapElementModel } from "../types/shelf";
import type { TransportTaskMapModel } from "../types/transportTask";
import type { InventoryMapModel } from "../types/inventory";

interface Props {
    location: LocationMapElementModel;
    shelf: ShelfMapElementModel | null;
    inventories: InventoryMapModel[];
    arriveTasks: TransportTaskMapModel[];
    leaveTask: TransportTaskMapModel | null;
    onlyShelf: boolean;
}

export function LocationMapElement(props: Props) {
    return (
        <Paper elevation={0} variant="outlined" className="map-location-box" style={getLocationStyle(props.location)} data-location-code={props.location.code}>
            <Stack spacing={0} alignItems="center" justifyItems="flex-start" style={{ height: '100%', pointerEvents: 'none' }}>
                <Typography variant="subtitle1">{props.location.code}</Typography>
                {props.shelf ? <Typography variant="body2">{props.shelf.code}</Typography> : null}
                {!props.onlyShelf && props.inventories.length == 1 ? <Typography variant="body2">{props.inventories[0].materialCode}</Typography> : null}
            </Stack>
        </Paper>
    );
}