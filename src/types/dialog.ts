export interface DialogProps<P = undefined, R = void> {
    payload: P;
    open: boolean;
    onClose: (result: R) => Promise<void>;
}

export type DialogComponent<P, R> = React.ComponentType<DialogProps<P, R>>;

export interface OpenDialog {
    <P extends undefined, R>(Component: DialogComponent<P, R>, payload?: P, options?: OpenDialogOptions<R>): Promise<R>;
    <P, R>(Component: DialogComponent<P, R>, payload: P, options?: OpenDialogOptions<R>): Promise<R>;
}

export interface CloseDialog {
    <R>(dialog: Promise<R>, result: R): Promise<R>;
}

export interface OpenDialogOptions<R> {
    onClose?: (result: R) => Promise<void>;
}

export interface ConfirmOptions extends OpenDialogOptions<boolean> {
    title?: React.ReactNode;
    okText?: React.ReactNode;
    severity?: 'error' | 'info' | 'success' | 'warning';
    cancelText?: React.ReactNode;
}

export interface ConfirmDialogPayload extends ConfirmOptions {
    msg: React.ReactNode;
}

export type ConfirmDialogProps = DialogProps<ConfirmDialogPayload, boolean>;

export interface OpenConfirmDialog {
    (msg: React.ReactNode, options?: ConfirmOptions): Promise<boolean>;
}

export interface DialogHook {
    confirm: OpenConfirmDialog;
    open: OpenDialog;
}