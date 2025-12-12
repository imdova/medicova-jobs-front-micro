import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  message?: string;
  onDelete: () => void;
  onClose: () => void;
  loading?: boolean;
  color?: "error" | "success" | "warning";
  buttonText?: string;
  hardDeleteText?: string; // ✅ NEW prop
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  title,
  message,
  onDelete,
  onClose,
  loading,
  color = "error",
  buttonText = "Yes Delete",
  hardDeleteText,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const colors: Record<"error" | "success" | "warning", string> = {
    success: "text-green-600",
    warning: "text-amber-600",
    error: "text-red-600",
  };

  const handleDeleteClick = () => {
    if (hardDeleteText) {
      if (inputValue !== hardDeleteText) {
        setError("Text does not match. Please type it exactly.");
        return;
      }
    }
    onDelete();
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 10,
        },
      }}
    >
      <DialogTitle className={colors[color]}>{title}</DialogTitle>
      <DialogContent>
        <p className="text-muted-foreground">{message}</p>

        {hardDeleteText && (
          <div className="mt-4">
            <p className="text-sm text-red-500">
              To confirm, type this exactly: <strong>{hardDeleteText}</strong>
            </p>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              margin="dense"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          No
        </Button>
        <Button
          onClick={handleDeleteClick}
          color={color}
          variant="contained"
          disabled={loading}
        >
          {loading ? "loading..." : buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
