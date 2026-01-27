import { Refresh, Settings, Edit } from "@mui/icons-material";
import { TextField, Paper, Stack, Box, IconButton } from "@mui/material";

interface Props {
    refresh: () => Promise<void>;
}

export function SearchBar(props: Props) {
    return (
        <Box sx={{ position: 'absolute', zIndex: 99, translate: 'calc(100vw / 2 - 250px) 5px', width: '450px', opacity: 0.8 }}>
            <Paper elevation={0} variant="outlined" sx={{ padding: '4px' }}>
                <Stack direction="row" spacing={2}>
                    <TextField size="small" variant="outlined" placeholder="搜索" fullWidth={true} />
                    <IconButton size="medium">
                        <Settings />
                    </IconButton>
                    <IconButton size="medium">
                        <Edit />
                    </IconButton>
                    <IconButton size="medium" onClick={async () => await props.refresh()}>
                        <Refresh />
                    </IconButton>
                </Stack>
            </Paper>
        </Box>
    );
}