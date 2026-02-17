import { TransportTaskCounter } from "./TransportTaskCounter";
import { SearchBar } from "./SearchBar";
import { CtrlGroup } from "./CtrlGroup";
import { ViewPort } from "./ViewPort";
import { LoadingProgress } from "./LoadingProgress";
import { useEffect, useState } from "react";
import { getAreas, getLocations, getShelves, getInventories, getTrasnportTasks } from "../../clients/map";
import { useAtom, useSetAtom } from "jotai";
import { areasAtom, locationsAtom, shelvesAtom, inventoriesAtom, transportTasksAtom } from "../../store";
import { useSearchParams } from "react-router";

export function Home() {
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState<number[]>([0, 0]);
    const [searchParams, ] = useSearchParams();

    const setAreas = useSetAtom(areasAtom);
    const [locations, setLocations] = useAtom(locationsAtom);
    const setShelves = useSetAtom(shelvesAtom);
    const setInventories = useSetAtom(inventoriesAtom);
    const setTransportTasks = useSetAtom(transportTasksAtom);

    const loadElements = async () => {
        setLoading(true);

        const areas = await getAreas();
        const locationList = searchParams.get('from') === 'editor' ? locations : await getLocations();
        const shelves = await getShelves();
        const inventories = await getInventories();
        const transpotTasks = await getTrasnportTasks();

        let mapW = 0;
        let mapH = 0;

        for (const location of locationList) {
            mapW = Math.max(location.x + location.w, mapW);
            mapH = Math.max(location.y + location.h, mapH);
        }

        setSize([mapW, mapH]);

        setAreas(areas);
        setLocations(locationList);
        setShelves(shelves);
        setInventories(inventories);
        setTransportTasks(transpotTasks);

        setLoading(false);
    };

    useEffect(() => {
        loadElements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ userSelect: 'none' }}>
            {
                loading
                    ? <LoadingProgress />
                    :
                    <>
                        <TransportTaskCounter />
                        <SearchBar />
                        <CtrlGroup />
                    </>
            }
            <ViewPort mapW={size[0]} mapH={size[1]} />
        </div>
    );
}