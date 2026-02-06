import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { DialogCloseButton } from "./DialogCloseButton";
import { dialogSlotProps } from "./props";
import { inventoriesAtom } from "../store";
import { useAtom } from "jotai";
import type { InventoryMapModel } from "../types/inventory";
import { useState } from "react";
import { useDialog } from "../hooks/useDialog";
import { InventoryEditDialog } from "./InventoryEditDialog";

interface Payload extends OpenDialogOptions<void> {
    shelfCode: string;
}

type Props = DialogProps<Payload, void>;

export function InventoryDialog(props: Props) {
    const { open, payload, onClose } = props;
    const [inventory, setInventory] = useState<InventoryMapModel | null>(null);
    const [inventories, setInventories] = useAtom(inventoriesAtom);
    const dialog = useDialog();
    const shelfInventories = inventories.filter(x => x.shelfCode === payload.shelfCode);

    const bindInventory = async () => {
        await dialog.open(InventoryEditDialog, { shelfCode: payload.shelfCode });
    };

    const editInventory = async () => {
        if (inventory) {
            await dialog.open(InventoryEditDialog, { shelfCode: payload.shelfCode, inventory: inventory });
        }
    };

    const deleteInventory = async () => {
        if (inventory) {
            const b = await dialog.confirm(`确定删除库存 ${inventory.code}？`, { severity: 'warning' });
            if (b) {
                const arr = inventories.filter(x => x.code !== inventory.code);
                setInventories(arr);
            }
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>货架 {payload.shelfCode} 库存详情</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                <List>
                    {
                        shelfInventories.map(x => (
                            <ListItemButton key={x.code} onClick={() => setInventory(x)} selected={x === inventory} style={{ flexDirection: 'column', alignItems: 'start' }}>
                                <Typography variant="body1" align="left"><b>箱标签</b> {x.code}</Typography>
                                <Typography variant="body1" align="left"><b>供应商</b> {x.supplierCode}</Typography>
                                <Typography variant="body1" align="left"><b>物料</b> {x.materialCode}</Typography>
                                <Typography variant="body1" align="left"><b>批次号</b> {x.batchNo}</Typography>
                                <Typography variant="body1" align="left"><b>数量</b> {x.qty}</Typography>
                                <Typography variant="body1" align="left"><b>状态</b> {x.status}</Typography>
                            </ListItemButton>
                        ))
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="contained" color="inherit" onClick={bindInventory}>新增库存</Button>
                <Button size="small" variant="contained" color="inherit" disabled={!inventory} onClick={editInventory}>编辑库存</Button>
                <Button size="small" variant="contained" color="warning" disabled={!inventory} onClick={deleteInventory}>删除库存</Button>
            </DialogActions>
        </Dialog>
    );
}