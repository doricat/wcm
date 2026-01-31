import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from "@mui/material";
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { useAtomValue } from "jotai";
import { locationsAtom, shelvesAtom, inventoriesAtom, transportTasksAtom } from "../store";
import { getShelfModels } from "../types/location";
import { getYesOrNo } from "../types/enums";
import type { InventoryMapModel } from "../types/inventory";
import { Fragment } from "react/jsx-runtime";

interface Payload extends OpenDialogOptions<void> {
    code: string;
}

type Props = DialogProps<Payload, void>;

export function LocationDialog(props: Props) {
    const { open, payload, onClose } = props;
    const locations = useAtomValue(locationsAtom);
    const shelves = useAtomValue(shelvesAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const tasks = useAtomValue(transportTasksAtom);

    const location = locations.find(x => x.code == payload.code);
    const shelf = shelves.find(x => x.locationCode === payload.code);
    const shelfInventories = shelf ? inventories.filter(x => x.shelfCode === shelf.code) : [];
    const locationTasks = tasks.filter(x => x.startLocationCode === payload.code || x.endLocationCode === payload.code);

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
            <Grid container spacing={1} alignItems="center">
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
        if (locationTasks.length === 0) {
            buttons.push(<Button key="b0" size="small" variant="contained" color="inherit">调度货架到该库位</Button>);
        } else {
            buttons.push(<Button key="b1" size="small" variant="contained" color="inherit">查看任务</Button>);
        }
    } else {
        if (locationTasks.length === 0) {
            buttons.push(<Button key="b2" size="small" variant="contained" color="inherit">调度货架</Button>);
        } else {
            if (locationTasks.length === 1) {
                buttons.push(<Button key="b3" size="small" variant="contained" color="inherit">查看任务</Button>);
            } else {
                buttons.push(<Button key="b4" size="small" variant="contained" color="inherit">查看离开任务</Button>);
                buttons.push(<Button key="b5" size="small" variant="contained" color="inherit">查看到达任务</Button>);
            }
        }

        if (shelfInventories.length === 0) {
            buttons.push(<Button key="b6" size="small" variant="contained" color="inherit">绑定库存</Button>);
        } else if (shelfInventories.length === 1) {
            buttons.push(<Button key="b7" size="small" variant="contained" color="inherit">编辑库存</Button>);
            buttons.push(<Button key="b8" size="small" variant="contained" color="warning">删除库存</Button>);
        } else {
            buttons.push(<Button key="b9" size="small" variant="contained" color="inherit">查看多箱库存</Button>);
        }
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown
            slotProps={{
                root: {
                    sx: {
                        pointerEvents: 'none'
                    }
                },
                paper: {
                    sx: {
                        pointerEvents: 'auto'
                    }
                }
            }}>
            <DialogTitle style={{ cursor: 'move' }}>{`库位 ${payload.code}`}</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
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
        <Grid container spacing={1} alignItems="center">
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
    const groups = inventories.reduce((x, y) => {
        const arr = x.get(y.materialCode);
        if (arr) {
            arr.push(y);
        } else {
            x.set(y.materialCode, [y]);
        }

        return x;
    }, new Map<string, InventoryMapModel[]>());

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
        <Grid container spacing={1} alignItems="center">
            {elements}
        </Grid>
    );
}