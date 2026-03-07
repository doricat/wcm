import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../../types/dialog";
import { DraggableDialogPaperComponent } from "../../components/DraggableDialogPaperComponent";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { dialogSlotProps } from "../../components/props";
import { NumberField } from "../../components/NumberField";
import { useEffect, useState } from "react";
import { MuiColorInput } from "mui-color-input";

interface Payload extends OpenDialogOptions<void> {
    element: HTMLParagraphElement;
}

type Props = DialogProps<Payload, void>;

export function TextAnnotationPropDialog(props: Props) {
    const { open, payload, onClose } = props;
    const [size, setSize] = useState(0);
    const [color, setColor] = useState('');

    useEffect(() => {
        setSize(Number.parseInt(payload.element.style.fontSize.replace('px', '')));
        setColor(payload.element.style.color);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>文本标注：{payload.element.textContent}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <Stack spacing={1}>
                    <NumberField label="字体大小(PX)" size="small" fullWidth required min={12} max={999} defaultValue={size} onValueChange={x => setFontSize(payload.element, x!)} />
                    <MuiColorInput format="hex" size="small" fullWidth value={color} onChange={x => {
                        setColor(x);
                        setElementColor(payload.element, x);
                    }} />
                </Stack>
            </DialogContent>
            <DialogActions />
        </Dialog>
    );
}

function setFontSize(el: HTMLParagraphElement, size: number) {
    let css = (el.getAttribute('style') || '').trim();

    css = css.replace(/font-size\s*:\s*[^;]+;?/gi, '');
    css = css.replace(/;\s*$/, '');

    const newRule = `font-size:${size}px`;
    css = css ? css + ';' + newRule : newRule;

    el.setAttribute('style', css);
}

function setElementColor(el: HTMLParagraphElement, color: string) {
    let css = (el.getAttribute('style') || '').trim();

    css = css.replace(/color\s*:\s*[^;]+;?/gi, '');
    css = css.replace(/;\s*$/, '');

    const newRule = `color:${color}`;
    css = css ? css + ';' + newRule : newRule;

    el.setAttribute('style', css);
}