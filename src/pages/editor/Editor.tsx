import { Stack } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { MapCanvas } from "./MapCanvas";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LoadingProgress } from "../../components/LoadingProgress";

export function Editor() {
    const ref = useRef<{ saveLayout: () => void } | null>(null);
    const [loading, setLoading] = useState(false);

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
        <>
            {
                loading
                    ? <LoadingProgress />
                    :
                    <DndProvider backend={HTML5Backend}>
                        <Stack direction="row">
                            <Sidebar save={() => {
                                if (ref.current) {
                                    ref.current.saveLayout();
                                }
                            }} />
                            <MapCanvas ref={ref} />
                        </Stack>
                    </DndProvider>
            }
        </>
    );
}