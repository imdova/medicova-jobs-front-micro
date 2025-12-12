import React from "react";
import { DialogTitle, Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ModalHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  handleCancel?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  error,
  handleCancel,
}) => (
  <>
    <DialogTitle className="border-b border-gray-200 !p-2 text-lg font-bold">
      <div className="flex items-start">
        <div className="flex-1 p-2">
          {title}
          {description &&
            (typeof description === "string" ? (
              <p className="mt-1 text-sm font-normal text-muted-foreground">
                {description}
              </p>
            ) : (
              description
            ))}
        </div>
        {handleCancel && (
          <IconButton size="small" onClick={handleCancel}>
            <Close className="h-5 w-5" />
          </IconButton>
        )}
      </div>
    </DialogTitle>
    {error && (
      <Alert severity="error" className="my-1 !w-full">
        <p className="text-sm">{error}</p>
      </Alert>
    )}
  </>
);
