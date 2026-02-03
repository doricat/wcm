import { Badge, Paper, Stack, Typography } from "@mui/material";
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
    leaveTask?: TransportTaskMapModel;
    onlyShelf: boolean;
}

export function LocationMapElement(props: Props) {
    const { location, shelf, inventories, leaveTask, onlyShelf } = props;
    return (
        <Paper elevation={0} variant="outlined" className="map-location-box" style={getLocationStyle(location)} data-location-code={location.code}>
            <Badge badgeContent={leaveTask ? 1 : 0} color="secondary" variant="dot" style={{ pointerEvents: 'none' }}>
                <div style={{ width: `${location.w}px`, height: `${location.h}px`, position: 'relative', alignContent: 'center' }}>
                    <Stack spacing={0} alignItems="center" justifyItems="flex-start" style={{ height: '100%', position: 'relative' }}>
                        <Typography variant="subtitle1">{location.code}</Typography>
                        {shelf ? <Typography variant="body2">{shelf.code}</Typography> : null}
                        {!onlyShelf && inventories.length == 1 ? <Typography variant="body2">{inventories[0].materialCode}</Typography> : null}
                    </Stack>
                </div>
            </Badge>
        </Paper>
    );
}