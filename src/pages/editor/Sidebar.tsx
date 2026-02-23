import { Button, Stack } from "@mui/material";
import { useAtomValue, useAtom } from "jotai";
import { inventoriesAtom, locationsAtom, shelvesAtom } from "../../store";
import type { InventoryMapModel } from "../../types/inventory";
import { getLocationElementId } from "../../types/location";
import { LocationItem } from "./LocationItem";
import { SearchForm } from "./SearchForm";
import { useState } from "react";

export function Sidebar(props: { save: () => void; }) {
    const [locations, setLocations] = useAtom(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const [value, setValue] = useState<{ areaCode: string; locationCode: string }>({ areaCode: '', locationCode: '' });

    const handleDropEnd = (code: string) => {
        setLocations(prev => {
            return prev.filter(x => x.code !== code);
        });
    };

    const locationElements = [];
    for (const location of locations) {
        if ((value.areaCode !== '' && location.areaCode !== value.areaCode) || (value.locationCode !== '' && location.code !== value.locationCode)) {
            continue;
        }

        const shelf = shelves.find(x => x.locationCode == location.code);
        let shelfInventories: InventoryMapModel[] = [];
        if (shelf) {
            shelfInventories = inventories.filter(x => x.shelfCode == shelf.code);
        }

        locationElements.push(<LocationItem key={getLocationElementId(location)} location={location} shelf={shelf} inventories={shelfInventories} dropEnd={handleDropEnd} />);
    }

    return (
        <Stack spacing={1.5} style={{ height: '100vh', width: '230px', borderRight: '1px solid grey', padding: '4px', overflow: 'scroll' }}>
            <Stack spacing={1} direction="row">
                <Button size="small" variant="contained" color="inherit" onClick={props.save}>保存</Button>
            </Stack>
            <SearchForm locations={value.areaCode === '' ? locations : locations.filter(x => x.areaCode === value.areaCode)} notify={(areaCode, locationCode) => setValue({ areaCode, locationCode })} />
            <Stack direction="row" justifyContent="flex-start" flexWrap="wrap">
                {locationElements}
            </Stack>
        </Stack>
    );
}