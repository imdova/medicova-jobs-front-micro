import React, { useState } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

interface CopyButtonProps extends IconButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyText = (text: string) => {
    if (isCopied) return;
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    navigator.clipboard.writeText(text);
  };

  return (
    <IconButton
      onClick={() => copyText(text)}
      className="p-0 md:ml-2"
      aria-label="copy"
      {...props}
    >
      {isCopied ? (
        <CheckIcon className="h-4 w-4 text-primary md:h-5 md:w-5" />
      ) : (
        <ContentCopyIcon className="h-4 w-4 md:h-5 md:w-5" />
      )}
    </IconButton>
  );
};

export default CopyButton;
