import { Box, Stack, IconButton } from "@mui/material";
import { Layers, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useAtom } from "jotai";
import { scaleAtom } from "../../store";

const arr = [1, 0.91, 0.83, 0.75, 0.68, 0.62, 0.56, 0.51, 0.47, 0.42, 0.39, 0.35, 0.32, 0.29, 0.26, 0.24, 0.22];

export function CtrlGroup() {
    const [scale, setScale] = useAtom(scaleAtom);
    const handleZoom = (isZoomIn: boolean) => {
        let i = arr.findIndex(x => x === scale);
        if (i >= 0) {
            if (isZoomIn) {
                i--;
            } else {
                i++;
            }

            if (i >= 0 && i < arr.length) {
                setScale(arr[i]);
            }
        }
    };

    return (
        <Box style={{ position: 'absolute', zIndex: 99, translate: '10px calc(100vh - 150px)' }}>
            <Stack spacing={1}>
                <IconButton size="medium">
                    <Layers />
                </IconButton>
                <IconButton size="medium" onClick={() => handleZoom(true)}>
                    <ZoomIn />
                </IconButton>
                <IconButton size="medium" onClick={() => handleZoom(false)}>
                    <ZoomOut />
                </IconButton>
            </Stack>
        </Box>
    );
}