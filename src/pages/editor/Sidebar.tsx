import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useAtomValue, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { inventoriesAtom, hiddenLocationsAtom, shelvesAtom } from "../../store";
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
    const [locations, setLocations] = useAtom(hiddenLocationsAtom);
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
                <Button size="small" variant="contained" color="inherit" onClick={() => navigate('/?from=editor')}>返回地图</Button>
                <Button size="small" variant="contained" color="inherit">保存</Button>
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