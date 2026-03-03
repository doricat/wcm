import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../../types/dialog";
import { DraggableDialogPaperComponent } from "../../components/DraggableDialogPaperComponent";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { dialogSlotProps } from "../../components/props";

interface Payload extends OpenDialogOptions<void> {
    element: HTMLDivElement;
    areaCode: string | null;
}

type Props = DialogProps<Payload, void>;

export function PolygonAnnotationPropDialog(props: Props) {
    const { open, payload, onClose } = props;
    const title = payload.areaCode ? `库区标注：${payload.areaCode}` : '几何标注';

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>{title}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>

            </DialogContent>
            <DialogActions />
        </Dialog>
    );
}