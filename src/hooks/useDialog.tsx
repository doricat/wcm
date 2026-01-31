import React from "react";
import type { DialogHook, OpenConfirmDialog } from "../types/dialog";
import { useEventCallback } from "@mui/material";
import { DialogsContext } from "../types/DialogContext";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function useDialog(): DialogHook {
    const dialogsContext = React.useContext(DialogsContext);
    if (!dialogsContext) {
        throw new Error('Dialogs context was used without a provider.');
    }

    const { open, close } = dialogsContext;
    const confirm = useEventCallback<OpenConfirmDialog>((msg, { onClose, ...options } = {}) => open(ConfirmDialog, { ...options, msg }, { onClose }));

    return React.useMemo(() => {
        return {
            confirm,
            open,
            close
        };
    }, [confirm, open, close]);
}