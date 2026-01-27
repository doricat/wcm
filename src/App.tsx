import { CssBaseline } from "@mui/material";
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Home } from "./pages/home/Home";

const router = createBrowserRouter([
    {
        children: [
            {
                path: '*',
                Component: Home,
            },
        ],
    },
]);

export function App() {
    return (
        <>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
        </>
    );
}