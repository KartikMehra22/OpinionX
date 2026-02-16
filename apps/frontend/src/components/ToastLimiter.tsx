"use client";

import { useToasterStore, toast } from "react-hot-toast";
import { useEffect } from "react";

export default function ToastLimiter() {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= 3)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);

    return null;
}
