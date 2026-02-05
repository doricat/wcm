import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { dialogSlotProps } from "./props";
import { TransportTaskCreationForm } from "./TransportTaskCreationForm";
import { useRef } from "react";

interface Payload extends OpenDialogOptions<void> {
    shelfCode?: string;
    toLocationCode?: string;
}

type Props = DialogProps<Payload, void>;

export function TransportTaskCreationDialog(props: Props) {
    const { open, payload, onClose } = props;
    const formRef = useRef<{ submit: () => Promise<boolean> } | null>(null);

    const handleClick = async () => {
        if (formRef.current) {
            const b = await formRef.current.submit();
            if (b) {
                onClose();
            }
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>新增调度任务</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <TransportTaskCreationForm ref={formRef} shelfCode={payload.shelfCode} toLocationCode={payload.toLocationCode} />
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" onClick={handleClick}>提交</Button>
            </DialogActions>
        </Dialog>
    );
}