import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItemButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { getLocations } from "../types/utils";
import { transportTasksAtom } from "../store";
import { useAtomValue } from "jotai";
import { transportTaskStatuses } from "../types/enums";
import { useState } from "react";
import type { TransportTaskMapModel } from "../types/transportTask";
import { useDialog } from "../hooks/useDialog";
import { TransportTaskDetailDialog } from "./TransportTaskDetailDialog";

interface Payload extends OpenDialogOptions<void> {
    title: string;
    status: number;
}

type Props = DialogProps<Payload, void>;

export function TransportTasksDialog(props: Props) {
    const { open, payload, onClose } = props;
    const dialog = useDialog();
    const [task, setTask] = useState<TransportTaskMapModel | null>(null);
    const allTasks = useAtomValue(transportTasksAtom);
    const tasks = payload.status === transportTaskStatuses.executing
        ? allTasks.filter(x => x.status === transportTaskStatuses.executing || x.status === transportTaskStatuses.renewable)
        : allTasks.filter(x => x.status === payload.status);

    const viewDetail = async () => {
        if (!task) {
            return;
        }

        await dialog.open(TransportTaskDetailDialog, { code: task.code });
    };

    const abort = async () => {
        if (!task) {
            return;
        }

        const b = await dialog.confirm(`确定中断任务 ${task.code}？`, { severity: 'warning' });
        if (b) {
            // TODO
        }
    };

    const buttons = [];
    if (payload.status === transportTaskStatuses.pending) {
        buttons.push(<Button key="b0" size="small" variant="contained" color="inherit">触发调度</Button>);
    } else if (payload.status === transportTaskStatuses.executing || payload.status === transportTaskStatuses.renewable) {
        buttons.push(<Button key="b1" size="small" variant="contained" color="inherit" disabled={!task} onClick={viewDetail}>详情</Button>);
    } else if (payload.status === transportTaskStatuses.exceptional) {
        buttons.push(<Button key="b2" size="small" variant="contained" color="warning" disabled={!task} onClick={abort}>中断</Button>);
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus
            slotProps={{
                root: {
                    sx: {
                        pointerEvents: 'none'
                    }
                },
                paper: {
                    sx: {
                        pointerEvents: 'auto'
                    }
                }
            }}>
            <DialogTitle style={{ cursor: 'move' }}>{payload.title}</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <List>
                    {
                        tasks.map(x => (
                            <ListItemButton key={x.code} onClick={() => setTask(x)} selected={x === task} style={{ flexDirection: 'column', alignItems: 'start' }}>
                                <Typography variant="body1" align="left"><b>任务类型</b> {x.businessTypeName}</Typography>
                                <Typography variant="body1" align="left"><b>任务编码</b> {x.code}</Typography>
                                <Typography variant="body1" align="left"><b>货架编码</b> {x.shelfCode}</Typography>
                                <Typography variant="body1" align="left"><b>源/目的</b> {getLocations(x)}</Typography>
                                <Typography variant="body1" align="left"><b>创建时间</b> {x.createdAt}</Typography>
                            </ListItemButton>
                        ))
                    }
                </List>
            </DialogContent>
            <DialogActions>
                {buttons}
            </DialogActions>
        </Dialog>
    );
}