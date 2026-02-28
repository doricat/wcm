import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../../types/dialog";
import { DraggableDialogPaperComponent } from "../../components/DraggableDialogPaperComponent";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { useRef } from "react";
import { AddAnnotationForm } from "./AddAnnotationForm";
import { dialogSlotProps } from "../../components/props";

interface Payload extends OpenDialogOptions<void> {
    x: number;
    y: number;
}

type Props = DialogProps<Payload, void>;

export function AddAnnotationDialog(props: Props) {
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
            <DialogTitle style={{ cursor: 'move' }}>添加标注</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <AddAnnotationForm ref={formRef} x={payload.x} y={payload.y} />
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" onClick={handleClick}>提交</Button>
            </DialogActions>
        </Dialog>
    );
}