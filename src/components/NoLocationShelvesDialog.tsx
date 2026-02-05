import { Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridActionsCell, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import type { DialogProps, OpenDialogOptions } from "../types/dialog";
import { DraggableDialogPaperComponent } from "./DraggableDialogPaperComponent";
import { useAtomValue } from "jotai";
import { inventoriesAtom, shelvesAtom, transportTasksAtom } from "../store";
import type { NoLocationShelfMapElementModel } from "../types/shelf";
import { getYesOrNo, transportTaskStatuses } from "../types/enums";
import { useMemo } from "react";

type Props = DialogProps<OpenDialogOptions<void>, void>;

export function NoLocationShelvesDialog(props: Props) {
    const { open, onClose } = props;
    const shelves = useAtomValue(shelvesAtom);
    const tasks = useAtomValue(transportTasksAtom);
    const inventories = useAtomValue(inventoriesAtom);
    const list: NoLocationShelfMapElementModel[] = [];

    const columns: GridColDef<NoLocationShelfMapElementModel>[] = useMemo(() => [
        {
            field: 'actions', headerName: '操作', type: 'actions', renderCell: (params) => (
                <GridActionsCell {...params}>
                    <GridActionsCellItem icon={<EditIcon />} label="Bind" />
                </GridActionsCell>
            )
        },
        { field: 'code', headerName: '编码', width: 90, sortable: false },
        { field: 'model', headerName: '型号', sortable: false },
        { field: 'enabled', headerName: '是否启用', sortable: false, valueGetter: (value: boolean) => getYesOrNo(value) },
        { field: 'hasInventory', headerName: '绑定库存', sortable: false, valueGetter: (value: boolean) => getYesOrNo(value) },
    ], []);

    for (const item of shelves) {
        if (item.locationCode || tasks.some(x => x.shelfCode == item.code && x.status >= transportTaskStatuses.pending && x.status <= transportTaskStatuses.renewable)) {
            continue;
        }

        list.push({
            hasInventory: inventories.some(x => x.shelfCode == item.code),
            code: item.code,
            model: item.model,
            enabled: item.enabled,
            locationCode: null
        });
    }

    return (
        <Dialog maxWidth="sm" fullWidth open={open} PaperComponent={DraggableDialogPaperComponent} hideBackdrop disableEscapeKeyDown disableEnforceFocus
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
            <DialogTitle style={{ cursor: 'move' }}>异常货架</DialogTitle>
            <IconButton onClick={() => onClose()} sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <DataGrid
                    rows={list}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 25,
                            }
                        }
                    }}
                    pageSizeOptions={[25, 50, 100]}
                    getRowId={(x: NoLocationShelfMapElementModel) => x.code}
                    density="compact"
                    disableRowSelectionOnClick
                />
            </DialogContent>
        </Dialog>
    );
}