import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDialogLoadingButton } from "../hooks/useDialogLoadingButton";
import type { ConfirmDialogProps } from "../types/dialog";

export function ConfirmDialog(props: ConfirmDialogProps) {
    const { open, payload, onClose } = props;
    const cancelButtonProps = useDialogLoadingButton(() => onClose(false));
    const okButtonProps = useDialogLoadingButton(() => onClose(true));

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={() => onClose(false)}>
            <DialogTitle>{payload.title ?? '提示'}</DialogTitle>
            <DialogContent>{payload.msg}</DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" color="inherit" disabled={!open} {...cancelButtonProps}>
                    {payload.cancelText ?? '取消'}
                </Button>
                <Button size="small" variant="contained" color={payload.severity} disabled={!open} {...okButtonProps}>
                    {payload.okText ?? '确认'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}