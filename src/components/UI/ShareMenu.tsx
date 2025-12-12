"use client";
import { useState } from "react";
import { IconButton, Menu, MenuItem, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const domain = process.env.NEXT_PUBLIC_VERCEL_URL;

const ShareMenu: React.FC<
  { link?: string; path?: string } & React.ComponentProps<typeof IconButton>
> = ({ link, path, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const open = Boolean(anchorEl);

  const url = link ? link : domain ? domain + path : "";

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setShowCopyAlert(true);
    handleClose();
  };

  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url,
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}`,
    instagram: `https://www.instagram.com/share?url=${encodeURIComponent(
      url,
    )}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
    handleClose();
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "share-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        {...props}
      >
        <ShareIcon />
      </IconButton>

      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="mt-2"
      >
        <MenuItem
          onClick={() => handleShare("whatsapp")}
          className="flex items-center gap-3 hover:bg-green-50"
        >
          <WhatsAppIcon className="text-green-600" />
          <span>WhatsApp</span>
        </MenuItem>

        <MenuItem
          onClick={() => handleShare("linkedin")}
          className="flex items-center gap-3 hover:bg-blue-50"
        >
          <LinkedInIcon className="text-blue-600" />
          <span>LinkedIn</span>
        </MenuItem>

        <MenuItem
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-3 hover:bg-sky-50"
        >
          <TwitterIcon className="text-sky-500" />
          <span>Twitter</span>
        </MenuItem>

        <MenuItem
          onClick={() => handleShare("facebook")}
          className="flex items-center gap-3 hover:bg-blue-50"
        >
          <FacebookIcon className="text-blue-600" />
          <span>Facebook</span>
        </MenuItem>

        <MenuItem
          onClick={() => handleShare("instagram")}
          className="flex items-center gap-3 hover:bg-pink-50"
        >
          <InstagramIcon className="text-pink-600" />
          <span>Instagram</span>
        </MenuItem>

        <MenuItem
          onClick={handleCopyLink}
          className="flex items-center gap-3 hover:bg-gray-50"
        >
          <ContentCopyIcon className="text-gray-600" />
          <span>Copy Link</span>
        </MenuItem>
      </Menu>

      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopyAlert(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default ShareMenu;
