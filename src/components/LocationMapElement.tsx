import { Badge, Paper, Stack, Typography } from "@mui/material";
import { type LocationMapElementModel } from "../types/location";
import { getLocationStyle } from "../types/map";
import type { ShelfMapElementModel } from "../types/shelf";
import type { TransportTaskMapModel } from "../types/transportTask";
import { groupByMaterial, type InventoryMapModel } from "../types/inventory";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
    location: LocationMapElementModel;
    shelf?: ShelfMapElementModel;
    inventories: InventoryMapModel[];
    arriveTasks: TransportTaskMapModel[];
    leaveTask?: TransportTaskMapModel;
    onlyShelf: boolean;
}

export function LocationMapElement(props: Props) {
    const { location, shelf, inventories, arriveTasks, leaveTask, onlyShelf } = props;
    let b = false;
    const elements = [];
    if (!onlyShelf) {
        if (inventories.length === 1) {
            elements.push(<Typography key={inventories[0].code} variant="body2">{inventories[0].materialCode}</Typography>);
        } else if (inventories.length > 1) {
            const groups = groupByMaterial(inventories);
            for (const item of groups) {
                elements.push(<Typography key={item[0]} variant="body2" style={{ fontSize: '10px' }}>{item[0]} X{item[1].length}</Typography>);
            }
        }
    }

    let closeIcon = null;
    if (!location.enabled || shelf?.enabled === false) {
        closeIcon = (
            <div style={{ position: 'absolute', width: `${location.w}px`, height: `${location.h}px`, opacity: 0.5 }}>
                <CloseIcon color="warning" style={{ fontSize: `${Math.min(location.w, location.h)}px` }} />
            </div>
        );
    }

    let lockIcon = null;
    if (arriveTasks.length > 0) {
        lockIcon = (
            <div style={{ position: 'absolute', width: `${location.w}px`, height: `${location.h}px`, opacity: 0.5 }}>
                <LockIcon color="info" style={{ fontSize: `${Math.min(location.w, location.h)}px` }} />
            </div>
        );

        b = shelf != undefined && shelf.locationCode == null;
    }

    return (
        <Paper elevation={0} variant="outlined" className="map-location-box" style={getLocationStyle(location, b)} data-location-code={location.code}>
            <Badge badgeContent={leaveTask ? 1 : 0} color="secondary" variant="dot" style={{ pointerEvents: 'none' }}>
                <div style={{ width: `${location.w}px`, height: `${location.h}px`, position: 'relative', alignContent: 'center' }}>
                    {closeIcon}
                    {lockIcon}
                    <Stack spacing={0} alignItems="center" justifyItems="flex-start" style={{ height: '100%' }}>
                        <Typography variant="subtitle1">{location.code}</Typography>
                        {shelf ? <Typography variant="body2">{shelf.code}</Typography> : null}
                        {elements}
                    </Stack>
                </div>
            </Badge>
        </Paper>
    );
}