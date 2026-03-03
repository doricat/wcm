import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../../types/dialog";
import { DraggableDialogPaperComponent } from "../../components/DraggableDialogPaperComponent";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { dialogSlotProps } from "../../components/props";
import { useEffect, useState } from "react";
import { MuiColorInput } from "mui-color-input";

interface Payload extends OpenDialogOptions<void> {
    element: HTMLDivElement;
    areaCode: string | null;
}

type Props = DialogProps<Payload, void>;

export function PolygonAnnotationPropDialog(props: Props) {
    const { open, payload, onClose } = props;
    const [bgColor, setBgColor] = useState('');

    useEffect(() => {
        setBgColor(payload.element.style.backgroundColor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const title = payload.areaCode ? `库区标注：${payload.areaCode}` : '几何标注';

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>{title}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <MuiColorInput format="hex" size="small" fullWidth value={bgColor} onChange={x => {
                    setBgColor(x);
                    setElementBgColor(payload.element, x);
                }} />
            </DialogContent>
            <DialogActions />
        </Dialog>
    );
}

function setElementBgColor(el: HTMLDivElement, color: string) {
    let css = (el.getAttribute('style') || '').trim();

    css = css.replace(/background-color\s*:\s*[^;]+;?/gi, '');
    css = css.replace(/;\s*$/, '');

    const newRule = `background-color:${color}`;
    css = css ? css + ';' + newRule : newRule;

    el.setAttribute('style', css);
}