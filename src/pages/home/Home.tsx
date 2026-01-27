import { TransportTaskCounter } from "./TransportTaskCounter";
import { SearchBar } from "./SearchBar";
import { CtrlGroup } from "./CtrlGroup";
import { ViewPort } from "./ViewPort";
import { LoadingProgress } from "./LoadingProgress";
import { useEffect, useState } from "react";
import { getAreas, getLocations, getShelves, getInventories, getTrasnportTasks } from "../../clients/map";
import { useSetAtom } from "jotai";
import { areasAtom, locationsAtom, shelvesAtom, inventoriesAtom, transportTasksAtom } from "../../store";

export function Home() {
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState<number[]>([0, 0]);

    const setAreas = useSetAtom(areasAtom);
    const setLocations = useSetAtom(locationsAtom);
    const setShelves = useSetAtom(shelvesAtom);
    const setInventories = useSetAtom(inventoriesAtom);
    const setTransportTasks = useSetAtom(transportTasksAtom);

    const loadElements = async () => {
        setLoading(true);

        const areas = await getAreas();
        const locations = await getLocations();
        const shelves = await getShelves();
        const inventories = await getInventories();
        const transpotTasks = await getTrasnportTasks();

        let canvasW = 0;
        let canvasH = 0;

        for (const location of locations) {
            canvasW = Math.max(location.x + location.w, canvasW);
            canvasH = Math.max(location.y + location.h, canvasH);
        }

        setSize([canvasW, canvasH]);

        setAreas(areas);
        setLocations(locations);
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
                        <SearchBar refresh={loadElements} />
                        <CtrlGroup />
                    </>
            }
            <ViewPort canvasW={size[0]} canvasH={size[1]} />
        </div>
    );
}