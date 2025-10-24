import React, { ComponentPropsWithoutRef } from "react";

type Props = {
    size?: number;
    color?: "primary" | "primary-foreground" | "secondary" | "secondary-foreground" | "white";
}

type SpinnerProps = ComponentPropsWithoutRef<"div"> & Props;

export const Spinner = ({ size = 5, color, className, ...rest }: SpinnerProps) => {
    return (
        <div
            className={`animate-spin rounded-full border-2 border-${color || "primary"} border-t-transparent h-${size} w-${size} ${className}`}
            {...rest}
        />
    );
};
