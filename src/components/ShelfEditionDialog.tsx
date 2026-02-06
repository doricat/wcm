import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { dialogSlotProps } from "./props";
import { useRef } from "react";
import { DialogCloseButton } from "./DialogCloseButton";
import type { ShelfMapElementModel } from "../types/shelf";
import { ShelfEditionForm } from "./ShelfEditionForm";

interface Payload extends OpenDialogOptions<void> {
    shelf: ShelfMapElementModel;
}

type Props = DialogProps<Payload, void>;

export function ShelfEditionDialog(props: Props) {
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
            <DialogTitle style={{ cursor: 'move' }}>编辑货架 {payload.shelf.code}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <ShelfEditionForm ref={formRef} shelf={payload.shelf} />
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" onClick={handleClick}>提交</Button>
            </DialogActions>
        </Dialog>
    );
}