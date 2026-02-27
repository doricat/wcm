import { TransportTaskCounter } from "./TransportTaskCounter";
import { SearchBar } from "./SearchBar";
import { CtrlGroup } from "./CtrlGroup";
import { ViewPort } from "./ViewPort";
import { LoadingProgress } from "../../components/LoadingProgress";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { mapLocationsAtom } from "../../store";

export function Home() {
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState<number[]>([0, 0]);
    const mapLocations = useAtomValue(mapLocationsAtom);

    const loadElements = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let mapW = 0;
        let mapH = 0;

        for (const location of mapLocations) {
            mapW = Math.max(location.x + location.w, mapW);
            mapH = Math.max(location.y + location.h, mapH);
        }

        setSize([mapW + 50, mapH + 50]);

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