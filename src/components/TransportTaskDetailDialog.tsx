import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { abortTask, canAbort, canContinue, canRepeat, canTriggerEnd, canTriggerStart, triggerTaskEnd, triggerTaskStart, type TransportTaskMapModel } from "../types/transportTask";
import { getSourceLocation, getTargetLocation } from "../types/utils";
import { useAtom } from "jotai";
import { clickedLocationAtom, shelvesAtom, transportTasksAtom } from "../store";
import { toYYYYMMDDHHmmss } from "../utils/datetime";
import { dialogSlotProps } from "./props";
import { useDialog } from "../hooks/useDialog";
import { DialogCloseButton } from "./DialogCloseButton";
import { useEffect, useState } from "react";

interface Payload extends OpenDialogOptions<void> {
    code: string;
}

type Props = DialogProps<Payload, void>;

export function TransportTaskDetailDialog(props: Props) {
    const { open, payload, onClose } = props;
    const dialog = useDialog();
    const [tasks, setTasks] = useAtom(transportTasksAtom);
    const [shelves, setShelves] = useAtom(shelvesAtom);
    const [clickedLocation, setClickedLocation] = useAtom(clickedLocationAtom);
    const [task, setTask] = useState<TransportTaskMapModel | null>(null);

    const doSetTask = () => {
        setTask(tasks.find(x => x.code === payload.code) ?? null);
    };

    useEffect(() => {
        doSetTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload.code]);

    const triggerStart = async () => {
        if (!task) {
            return;
        }

        const b = await dialog.confirm(`确定触发开始 ${task.code}？`, { severity: 'warning' });
        if (b) {
            triggerTaskStart(task);
            setTasks([...tasks]);

            const shelf = shelves.find(x => x.code === task.shelfCode);
            if (shelf) {
                shelf.locationCode = null;
                setShelves([...shelves]);
            }
        }
    };

    const triggerEnd = async () => {
        if (!task) {
            return;
        }

        const b = await dialog.confirm(`确定触发结束 ${task.code}？`, { severity: 'warning' });
        if (b) {
            triggerTaskEnd(task);
            setTasks(tasks.filter(x => x.code !== task.code));

            const shelf = shelves.find(x => x.code === task.shelfCode);
            if (shelf) {
                shelf.locationCode = task.endLocationCode;
                setShelves([...shelves]);
            }

            if (clickedLocation && (clickedLocation === task.startLocationCode || clickedLocation === task.endLocationCode)) {
                setClickedLocation(null);
            }
        }
    };

    const abort = async () => {
        if (!task) {
            return;
        }

        const b = await dialog.confirm(`确定中断任务 ${task.code}？`, { severity: 'warning' });
        if (b) {
            abortTask(task);
            setTasks(tasks.filter(x => x.code !== task.code));

            if (clickedLocation && (clickedLocation === task.startLocationCode || clickedLocation === task.endLocationCode)) {
                setClickedLocation(null);
            }
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>搬运任务 {payload.code}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                {
                    task ? (
                        <>
                            <Typography variant="body1" align="left"><b>任务类型</b> {task.businessTypeName}</Typography>
                            <Typography variant="body1" align="left"><b>任务编码</b> {task.code}</Typography>
                            <Typography variant="body1" align="left"><b>状态</b> {task.status}</Typography>
                            <Typography variant="body1" align="left"><b>优先级</b> {task.priority}</Typography>
                            <Typography variant="body1" align="left"><b>AGV编号</b> {task.agvCode}</Typography>
                            <Typography variant="body1" align="left"><b>货架编码</b> {task.shelfCode}</Typography>
                            <Typography variant="body1" align="left"><b>源位置</b> {getSourceLocation(task)}</Typography>
                            <Typography variant="body1" align="left"><b>目的位置</b> {getTargetLocation(task)}</Typography>
                            <Typography variant="body1" align="left"><b>外部任务编号</b> {task.externalTaskCode}</Typography>
                            <Typography variant="body1" align="left"><b>创建用户</b> {task.createdBy}</Typography>
                            <Typography variant="body1" align="left"><b>创建时间</b> {toYYYYMMDDHHmmss(task.createdAt)}</Typography>
                            <Typography variant="body1" align="left"><b>离开时间</b> {toYYYYMMDDHHmmss(task.leavedAt)}</Typography>
                            <Typography variant="body1" align="left"><b>到达时间</b> {toYYYYMMDDHHmmss(task.arrivedAt)}</Typography>
                            <Typography variant="body1" align="left"><b>调度时间</b> {toYYYYMMDDHHmmss(task.scheduledAt)}</Typography>
                            <Typography variant="body1" align="left"><b>提示信息</b> {task.message}</Typography>
                        </>
                    ) : null
                }
            </DialogContent>
            <DialogActions>
                {
                    task ? (
                        <>
                            <Button size="small" variant="contained" disabled={!canContinue(task)} color="inherit">继续</Button>
                            <Button size="small" variant="contained" disabled={!canTriggerStart(task)} onClick={triggerStart} color="inherit">触发开始</Button>
                            <Button size="small" variant="contained" disabled={!canTriggerEnd(task)} onClick={triggerEnd} color="primary">触发结束</Button>
                            <Button size="small" variant="contained" disabled={!canAbort(task)} onClick={abort} color="warning">中断</Button>
                            <Button size="small" variant="contained" disabled={!canRepeat(task)} color="inherit">复制</Button>
                        </>
                    ) : null
                }
            </DialogActions>
        </Dialog>
    );
}