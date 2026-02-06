import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { locationsAtom, shelvesAtom, inventoriesAtom, transportTasksAtom, selectedElementAtom } from "../store";
import { getShelfModels } from "../types/location";
import { getYesOrNo, transportTaskStatuses } from "../types/enums";
import { groupByMaterial, type InventoryMapModel } from "../types/inventory";
import { Fragment } from "react/jsx-runtime";
import { useDialog } from "../hooks/useDialog";
import { TransportTaskCreationDialog } from "./TransportTaskCreationDialog";
import { TransportTaskDetailDialog } from "./TransportTaskDetailDialog";
import { InventoryDialog } from "./InventoryDialog";
import { InventoryEditDialog } from "./InventoryEditDialog";
import { DialogCloseButton } from "./DialogCloseButton";
import { dialogSlotProps } from "./props";
import { TransportTasksDialog } from "./TransportTasksDialog";
import type { ShelfMapElementModel } from "../types/shelf";
import { ShelfEditionDialog } from "./ShelfEditionDialog";

interface Payload extends OpenDialogOptions<void> {
    code: string;
}

type Props = DialogProps<Payload, void>;

export function LocationDialog(props: Props) {
    const { open, payload, onClose } = props;
    const dialog = useDialog();
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const [inventories, setInventories] = useAtom(inventoriesAtom);
    const tasks = useAtomValue(transportTasksAtom);
    const setSelectedElement = useSetAtom(selectedElementAtom);

    const location = locations.find(x => x.code == payload.code);
    const shelf = shelves.find(x => x.locationCode === payload.code);
    const shelfInventories = shelf ? inventories.filter(x => x.shelfCode === shelf.code) : [];
    const locationTasks = tasks.filter(x => (x.startLocationCode === payload.code || x.endLocationCode === payload.code) && x.status >= transportTaskStatuses.pending && x.status <= transportTaskStatuses.renewable);

    const transferShelf = async (shelfCode: string) => {
        setSelectedElement(null);
        await dialog.open(TransportTaskCreationDialog, { shelfCode: shelfCode });
    };

    const transferShelfToHere = async () => {
        setSelectedElement(null);
        await dialog.open(TransportTaskCreationDialog, { toLocationCode: payload.code });
    };

    const viewTask = async () => {
        if (locationTasks.length === 1) {
            await dialog.open(TransportTaskDetailDialog, { code: locationTasks[0].code });
        } else if (locationTasks.length > 1) {
            await dialog.open(TransportTasksDialog, { status: transportTaskStatuses.executing, title: `库位 ${payload.code} 执行中的任务`, tasks: locationTasks });
        }
    };

    const bindInventory = async (shelfCode: string) => {
        await dialog.open(InventoryEditDialog, { shelfCode: shelfCode });
    };

    const editInventory = async (shelfCode: string, inventory: InventoryMapModel) => {
        await dialog.open(InventoryEditDialog, { shelfCode: shelfCode, inventory: inventory });
    };

    const deleteInventory = async (inventory: InventoryMapModel) => {
        const b = await dialog.confirm(`确定删除库存 ${inventory.code}？`, { severity: 'warning' });
        if (b) {
            const arr = inventories.filter(x => x.code !== inventory.code);
            setInventories(arr);
        }
    };

    const viewInventories = async (shelfCode: string) => {
        await dialog.open(InventoryDialog, { shelfCode: shelfCode });
    };

    const editShelf = async (shelf: ShelfMapElementModel) => {
        await dialog.open(ShelfEditionDialog, { shelf: shelf });
    };

    const shelfContent = shelf
        ? (
            <>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">货架编码</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{shelf.code}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">货架型号</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{shelf.model}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">货架状态</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">启用 {getYesOrNo(shelf.enabled)} 锁定 {getYesOrNo(tasks.some(x => x.shelfCode === shelf.code))}</Typography>
                </Grid>
            </>
        )
        : null;

    const inventoriesContent = shelfInventories.length > 0
        ? (
            <>
                <Grid size={12}>
                    <Divider />
                </Grid>
                <Grid size={12}>
                    {shelfInventories.length === 1 ? <LocationInventoryPanel inventory={shelfInventories[0]} /> : <LocationInventoriesPanel inventories={shelfInventories} />}
                </Grid>
            </>
        )
        : null;

    const locationContent = location
        ? (
            <Grid container spacing={0.5} alignItems="center">
                <Grid size={4}>
                    <Typography variant="body1">仓储位置</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{`${location.areaCode}/${location.code}`}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">适配货架型号</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{getShelfModels(location)}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">外部编码</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{location.externalCode}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">库位等级</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{location.level}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="body1">库位状态</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">启用 {getYesOrNo(location.enabled)} 锁定 {getYesOrNo(tasks.some(x => x.endLocationCode === location.code))}</Typography>
                </Grid>

                {shelfContent}
                {inventoriesContent}
            </Grid>
        )
        : null;

    const buttons = [];
    if (!shelf) {
        if (location?.enabled === true && !locationTasks.some(x => x.endLocationCode === payload.code)) {
            buttons.push(<Button key="b0" size="small" variant="contained" color="inherit" onClick={transferShelfToHere}>调度货架到此</Button>);
        }

        if (locationTasks.length > 0) {
            buttons.push(<Button key="b1" size="small" variant="contained" color="inherit" onClick={viewTask}>查看任务</Button>);
        }
    } else {
        if (locationTasks.length === 0) {
            buttons.push(<Button key="b2" size="small" variant="contained" color="inherit" onClick={() => transferShelf(shelf.code)}>调度货架</Button>);
        } else {
            if (locationTasks.length > 0) {
                buttons.push(<Button key="b3" size="small" variant="contained" color="inherit" onClick={viewTask}>查看任务</Button>);
            }
        }

        if (shelfInventories.length === 0) {
            buttons.push(<Button key="b4" size="small" variant="contained" color="inherit" onClick={() => bindInventory(shelf.code)}>绑定库存</Button>);
        } else if (shelfInventories.length === 1) {
            buttons.push(<Button key="b5" size="small" variant="contained" color="inherit" onClick={() => editInventory(shelf.code, shelfInventories[0])}>编辑库存</Button>);
            buttons.push(<Button key="b6" size="small" variant="contained" color="warning" onClick={() => deleteInventory(shelfInventories[0])}>删除库存</Button>);
        } else {
            buttons.push(<Button key="b7" size="small" variant="contained" color="inherit" onClick={() => viewInventories(shelf.code)}>查看多箱库存</Button>);
        }

        if (locationTasks.length === 0) {
            buttons.push(<Button key="b8" size="small" variant="contained" color="inherit" onClick={() => editShelf(shelf)}>编辑货架</Button>);
        }
    }

    if (locationTasks.length === 0) {
        buttons.push(<Button key="b9" size="small" variant="contained" color="inherit">编辑库位</Button>);
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus slotProps={dialogSlotProps}>
            <DialogTitle style={{ cursor: 'move' }}>{`库位 ${payload.code}`}</DialogTitle>
            <DialogCloseButton close={onClose} />
            <DialogContent>
                {locationContent}
            </DialogContent>
            <DialogActions>
                {buttons}
            </DialogActions>
        </Dialog>
    );
}

function LocationInventoryPanel({ inventory }: { inventory: InventoryMapModel }) {
    return (
        <Grid container spacing={0.5} alignItems="center">
            <Grid size={4}>
                <Typography variant="body1">箱标签</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.code}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">供应商</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.supplierCode}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">物料</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.materialCode}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">批次号</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.batchNo}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">数量</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.qty}</Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body1">状态</Typography>
            </Grid>
            <Grid size={8}>
                <Typography variant="body2">{inventory.status}</Typography>
            </Grid>
        </Grid>
    );
}

function LocationInventoriesPanel({ inventories }: { inventories: InventoryMapModel[] }) {
    const groups = groupByMaterial(inventories);
    const elements = [];
    for (const item of groups) {
        elements.push(
            <Fragment key={item[0]}>
                <Grid size={4}>
                    <Typography variant="body1">物料</Typography>
                </Grid>
                <Grid size={8}>
                    <Typography variant="body2">{item[0]} X{item[1].length}</Typography>
                </Grid>
            </Fragment>
        );
    }

    return (
        <Grid container spacing={0.5} alignItems="center">
            {elements}
        </Grid>
    );
}