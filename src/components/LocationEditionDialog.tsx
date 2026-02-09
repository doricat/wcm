import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { dialogSlotProps } from "./props";
import { DialogCloseButton } from "./DialogCloseButton";
import { useRef } from "react";
import type { LocationMapElementModel } from "../types/location";
import { LocationEditionForm } from "./LocationEditionForm";

interface Payload extends OpenDialogOptions<void> {
    location: LocationMapElementModel;
}

type Props = DialogProps<Payload, void>;

export function LocationEditionDialog(props: Props) {
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
            <DialogTitle style={{ cursor: 'move' }}>编辑库位 {payload.location.code}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <LocationEditionForm ref={formRef} location={payload.location} />
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" onClick={handleClick}>提交</Button>
            </DialogActions>
        </Dialog>
    );
}