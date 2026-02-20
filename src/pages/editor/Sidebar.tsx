import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useAtomValue, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { inventoriesAtom, locationsAtom, shelvesAtom, mapLocationsAtom } from "../../store";
import { textFieldSlotProps } from "../../components/props";
import type { InventoryMapModel } from "../../types/inventory";
import { getLocationElementId } from "../../types/location";
import { LocationItem } from "./LocationItem";
import { filterTake } from "../../types/utils";
import { useNavigate } from "react-router";

export function Sidebar() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [locations, setLocations] = useAtom(locationsAtom);
    const [mapLocations, setMapLocations] = useAtom(mapLocationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const navigate = useNavigate();

    const doSearch = () => {
        setOptions(filterTake(locations, x => x.code.toLowerCase().includes(inputValue.toLowerCase()), 20).map(x => x.code));
    };

    useEffect(() => {
        if (open) {
            doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, open, locations]);

    const handleDropEnd = (code: string) => {
        setLocations(prev => {
            return prev.filter(x => x.code !== code);
        });
    };

    const handleSave = () => {
        const elements = document.querySelectorAll('.map-canvas .map-location-box');
        for (const item of elements) {
            const style = window.getComputedStyle(item);
            const transform = style.transform || 'none';
            if (transform === 'none') {
                continue;
            }

            const matrixStr = transform.match(/matrix(3d)?\((.*?)\)/);
            if (!matrixStr) {
                continue;
            }

            const matrixValues = matrixStr[2].split(/\s*,\s*/).map(Number);
            let x = matrixValues[4];
            let y = matrixValues[5];

            const translate = style.translate || 'none';
            if (translate !== 'none') {
                const translateValues = translate.split(/\s+/).map(x => Number.parseFloat(x.replace('px', '')));
                if (translateValues.length === 1) {
                    translateValues.push(0);
                }
                
                x += translateValues[0];
                y += translateValues[1];
            }

            x = Math.round(x);
            y = Math.round(y);

            const code = item.getAttribute('data-location-code');
            if (code) {
                const index = mapLocations.findIndex(x => x.code === code);
                if (index >= 0) {
                    const location = mapLocations[index];
                    mapLocations.splice(index, 1);
                    mapLocations.push({ ...location, x, y });

                    (item as HTMLDivElement).style.transform = 'none';
                }
            }
        }

        setMapLocations([...mapLocations]);
    };

    const locationElements = [];
    for (const location of locations) {
        if (value !== '' && location.code !== value) {
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
        <Stack spacing={1} style={{ height: '100vh', width: '210px', borderRight: '1px solid grey', padding: '4px' }}>
            <Stack spacing={1} direction="row">
                <Button size="small" variant="contained" color="inherit" onClick={() => navigate('/')}>返回地图</Button>
                <Button size="small" variant="contained" color="inherit" onClick={handleSave}>保存</Button>
            </Stack>

            <Autocomplete open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={value}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                noOptionsText={inputValue.length === 0 ? null : "无匹配项"}
                onChange={(_, option) => setValue(option ?? '')}
                fullWidth={true}
                options={options}
                forcePopupIcon={false}
                size="small"
                renderInput={(params) => <TextField {...params} slotProps={textFieldSlotProps} variant="outlined" placeholder="搜索库位" />}
            />
            <Stack direction="row" justifyContent="flex-start" flexWrap="wrap">
                {locationElements}
            </Stack>
        </Stack>
    );
}