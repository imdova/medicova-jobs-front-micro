"use client";
import { useState } from "react";
import {
  Button,
  IconButton,
  ButtonProps as MuiButtonProps,
  IconButtonProps,
  Tooltip,
} from "@mui/material";

// Define btnVariant types
type Variant = "button" | "icon";

type BaseModalProps = { isOpen: boolean; onClose: () => void };

interface BaseProps<T> {
  componentProps: T;
  ModalComponent: React.FC<T & BaseModalProps>;
  children: React.ReactNode;
  btnVariant?: Variant;
  title?: string;
  disabled?: boolean;
}

interface ButtonSpecificProps extends Omit<MuiButtonProps, "onClick"> {
  btnVariant?: "button";
}

interface IconSpecificProps extends Omit<IconButtonProps, "onClick"> {
  btnVariant?: "icon";
}

type AddNewJobButtonProps<T> = BaseProps<T> &
  (ButtonSpecificProps | IconSpecificProps);

function OpenModalButton<T>({
  children,
  componentProps,
  ModalComponent,
  btnVariant = "icon", // default to icon
  title,
  ...props
}: AddNewJobButtonProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);

  // Render the appropriate component based on btnVariant
  const renderButton = () => {
    if (btnVariant === "button") {
      return (
        <Button {...(props as MuiButtonProps)} onClick={onOpen}>
          {children}
        </Button>
      );
    }

    return (
      <IconButton {...(props as IconButtonProps)} onClick={onOpen}>
        {children}
      </IconButton>
    );
  };

  return (
    <>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={onClose}
        {...componentProps}
      />
      <Tooltip title={title}>
        {/* Wrap in span to prevent Tooltip disabled button issue */}
        {renderButton()}
      </Tooltip>
    </>
  );
}

export default OpenModalButton;
