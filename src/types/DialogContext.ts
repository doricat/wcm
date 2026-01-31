import React from "react";
import type { CloseDialog, OpenDialog } from "./dialog";

export const DialogsContext = React.createContext<{ open: OpenDialog; close: CloseDialog; } | null>(null);