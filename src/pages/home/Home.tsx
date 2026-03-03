import { TransportTaskCounter } from "./TransportTaskCounter";
import { SearchBar } from "./SearchBar";
import { CtrlGroup } from "./CtrlGroup";
import { ViewPort } from "./ViewPort";
import { LoadingProgress } from "../../components/LoadingProgress";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { mapSizeAtom } from "../../store";

export function Home() {
    const [loading, setLoading] = useState(false);
    const mapSize = useAtomValue(mapSizeAtom);

    const loadElements = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
            <ViewPort mapW={mapSize.w} mapH={mapSize.h} />
        </div>
    );
}