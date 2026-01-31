import React from "react";

export function useDialogLoadingButton(onClose: () => Promise<void>) {
    const [loading, setLoading] = React.useState(false);
    const handleClick = async () => {
        try {
            setLoading(true);
            await onClose();
        } finally {
            setLoading(false);
        }
    };
    return {
        onClick: handleClick,
        loading
    };
}