import { Paper, Box, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { exceptionalShelfQtyAtom, transportTaskStatisticalDataAtom } from "../../store";
import { useDialog } from "../../hooks/useDialog";
import { transportTaskStatuses } from "../../types/enums";
import { TransportTasksDialog } from "../../components/TransportTasksDialog";

export function TransportTaskCounter() {
    const statisticalData = useAtomValue(transportTaskStatisticalDataAtom);
    const qty = useAtomValue(exceptionalShelfQtyAtom);
    const dialog = useDialog();

    const viewTasks = async (status: number, title: string) => {
        await dialog.open(TransportTasksDialog, { status: status, title: title });
    };

    return (
        <Box style={{ position: 'absolute', zIndex: 99, translate: '10px 10px', textAlign: 'center', opacity: 0.8 }}>
            <Paper elevation={0} variant="outlined" sx={{ padding: '4px' }}>
                <Stack direction="row" spacing={2}>
                    <div>
                        <Typography variant="body2">待执行</Typography>
                        <Typography variant="h6" style={{ cursor: 'pointer' }} onClick={() => viewTasks(transportTaskStatuses.pending, '待执行')}>{statisticalData.pending}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">异常任务</Typography>
                        <Typography variant="h6" color="error" style={{ cursor: 'pointer' }} onClick={() => viewTasks(transportTaskStatuses.exceptional, '异常任务')}>{statisticalData.exceptional}</Typography>
                    </div>
                    <div>
                        <Typography variant="body2">执行中</Typography>
                        <Typography variant="h6" color="success" style={{ cursor: 'pointer' }} onClick={() => viewTasks(transportTaskStatuses.executing, '执行中')}>{statisticalData.executing}</Typography>
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