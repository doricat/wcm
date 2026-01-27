import { LinearProgress } from "@mui/material";

export function LoadingProgress() {
    return (
        <div style={{ height: '100%', width: '100%', margin: 0, position: 'fixed', backgroundColor: '#FAFAFA', zIndex: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <div style={{ width: '500px', textAlign: 'center' }}>
                    <LinearProgress color="primary" />
                    <p>地图元素加载中......</p>
                </div>
            </div>
        </div>
    );
}