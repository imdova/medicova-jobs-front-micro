
import React from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    maxWidth?: string;
    fullWidth?: boolean;
    children: React.ReactNode;
};

export const ModalWrapper: React.FC<ModalProps> = ({
    open,
    onClose,
    maxWidth = "600px",
    fullWidth = false,
    children,
}) => {
    if (!open) return null;

    return (
        <div className="absolute z-50 inset-0">
            {/* Gray backdrop inside the parent */}
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />

            {/* Modal content container */}
            <div
                className="absolute left-1/2 top-1/2 max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-base bg-white p-2 shadow-md"
                style={{
                    width: fullWidth ? "100%" : undefined,
                    maxWidth: maxWidth,
                }}
            >
                {children}
            </div>
        </div>
    );
};
export const BasicWrapper: React.FC<ModalProps> = ({
    open,
    children,
}) => {
    if (!open) return null;
    return (children);
};
