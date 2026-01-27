import { Paper, Box, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { exceptionalShelfQtyAtom, transportTaskStatisticalDataAtom } from "../../store";

export function TransportTaskCounter() {
    const statisticalData = useAtomValue(transportTaskStatisticalDataAtom);
    const qty = useAtomValue(exceptionalShelfQtyAtom);

    return (
        <Box style={{ position: 'absolute', zIndex: 99, translate: '10px 10px', textAlign: 'center', opacity: 0.8 }}>
            <Paper elevation={0} variant="outlined" sx={{ padding: '4px' }}>
                <Stack direction="row" spacing={2}>
                    <div>
                        <Typography variant="body2">待执行</Typography>
                        <Typography variant="h6" style={{ cursor: 'pointer' }}>{statisticalData.pending}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">异常任务</Typography>
                        <Typography variant="h6" color="error" style={{ cursor: 'pointer' }}>{statisticalData.exceptional}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">执行中</Typography>
                        <Typography variant="h6" color="success" style={{ cursor: 'pointer' }}>{statisticalData.executing}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">异常货架</Typography>
                        <Typography variant="h6" color="warning" style={{ cursor: 'pointer' }}>{qty}</Typography>
                    </div>
                </Stack>
            </Paper>
        </Box>
    );
}