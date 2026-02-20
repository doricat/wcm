import { Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { LocationModel } from "../../types/location";
import type { ShelfMapElementModel } from "../../types/shelf";
import { groupByMaterial, type InventoryMapModel } from "../../types/inventory";
import { useDrag } from "react-dnd";
import { useCallback, useRef } from "react";

interface Props {
    location: LocationModel;
    shelf?: ShelfMapElementModel;
    inventories: InventoryMapModel[];
    dropEnd: (code: string) => void;
}

export function LocationItem(props: Props) {
    const { location, shelf, inventories, dropEnd } = props;
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'location',
        item: location,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<{ code: string, offset: { x: number; y: number; } | null }>();
            if (item && dropResult) {
                dropEnd(item.code);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    const setRef = useCallback((node: HTMLDivElement | null) => {
        ref.current = node;
        drag(node);
    }, [drag]);

    const elements = [];
    if (inventories.length === 1) {
        elements.push(<Typography key={inventories[0].code} variant="body2">{inventories[0].materialCode}</Typography>);
    } else if (inventories.length > 1) {
        const groups = groupByMaterial(inventories);
        for (const item of groups) {
            elements.push(<Typography key={item[0]} variant="body2" style={{ fontSize: '10px' }}>{item[0]} X{item[1].length}</Typography>);
        }
    }

    let closeIcon = null;
    if (!location.enabled || shelf?.enabled === false) {
        closeIcon = (
            <div style={{ position: 'absolute', width: `100px`, height: `100px`, opacity: 0.5 }}>
                <CloseIcon color="warning" style={{ fontSize: `100px` }} />
            </div>
        );
    }

    return (
        <Paper ref={setRef} elevation={0} variant="outlined" style={{ width: `100px`, height: `100px`, cursor: 'move', userSelect: 'none', opacity: `${isDragging ? 0.4 : 1}` }} data-location-code={location.code}>
            <div style={{ width: `100px`, height: `100px`, position: 'relative', alignContent: 'center' }}>
                {closeIcon}
                <Stack spacing={0} alignItems="center" justifyItems="flex-start" style={{ height: '100%' }}>
                    <Typography variant="subtitle1">{location.code}</Typography>
                    {shelf ? <Typography variant="body2">{shelf.code}</Typography> : null}
                    {elements}
                </Stack>
            </div>
        </Paper>
    );
}