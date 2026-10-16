import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, CheckCircleIcon, CloseCircleIcon, Icon } from "@/components/ui/icon";
import {
    Toast as GSToast,
    ToastDescription,
    ToastTitle,
    useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import React from "react";

export const useAppToast = () => {
    const toast = useToast();

    const cssVar = (name: string) => `hsl(var(--${name}))`;

    const showToast = (
        type: "success" | "error" | "info",
        message: string,
        description?: string
    ) => {
        const newId = Math.random().toString();

        const { icon, ...restConfig } = {
            success: {
                icon: CheckCircleIcon,
                background: "bg-card",
                textColor: "text-card-foreground",
                iconColor: "text-primary",
                border: "border-[1px] border-primary",
                action: "success",
            },
            error: {
                icon: CloseCircleIcon,
                background: "bg-card",
                textColor: "text-card-foreground",
                iconColor: "text-destructive",
                border: "border-[1px] border-destructive",
                action: "error",
            },
            info: {
                icon: AlertCircleIcon,
                background: "bg-card",
                textColor: "text-card-foreground",
                iconColor: "text-secondary",
                border: "border-[1px] border-secondary",
                action: "info",
            },
        }[type];

        toast.show({
            id: newId,
            placement: "top",
            duration: 3000,
            render: ({ id }) => {
                return (
                    <GSToast
                        variant="solid"
                        action="success"
                        nativeID={`toast-${id}`}
                        className={`p-4 border-2 border-blue-600  w-full shadow-hard-5 max-w-[440px] flex-row justify-between ${restConfig.background}`}
                    >
                        <HStack space="md">
                            <Icon as={icon} className={`${restConfig.iconColor} mt-0.5`} />
                            <VStack space="xs">
                                <ToastTitle className={`font-semibold ${restConfig.textColor}`}>
                                    {message}
                                </ToastTitle>
                                {description && (
                                    <ToastDescription size="sm">{description}</ToastDescription>
                                )}
                            </VStack>
                        </HStack>
                    </GSToast>
                );
            },
        });
    };

    return {
        success: (msg: string, desc?: string) => showToast("success", msg, desc),
        error: (msg: string, desc?: string) => showToast("error", msg, desc),
        info: (msg: string, desc?: string) => showToast("info", msg, desc),
    };
};
