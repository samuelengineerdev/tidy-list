import React, { ComponentPropsWithoutRef } from "react";

type Props = {
    size?: number;
}

type SpinnerProps = ComponentPropsWithoutRef<"div"> & Props;

export const Spinner = ({ size = 5, className, ...rest }: SpinnerProps) => {
    return (
        <div
            className={`animate-spin rounded-full border-2 border-primary border-t-transparent h-${size} w-${size} ${className}`}
            {...rest}
        />
    );
};
