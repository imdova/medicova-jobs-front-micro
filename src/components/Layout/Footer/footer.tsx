import { Button, IconButton, TextField } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import Link from "next/link";
import Logo from "@/components/UI/logo";

const Footer = () => {
  return (
    <footer className="relative bg-opacity-10 bg-[url('/images/footer-background.jpg')] bg-cover bg-center">
      <div className="bg-[#0b2441d8] px-4">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 py-12 text-white md:grid-cols-5 lg:grid-cols-8">
          {/* Column 1 - Logo and Social */}
          <div className="col-span-3 flex flex-col items-center space-y-4 md:items-start">
            <Logo type="footer" alt="Logo" width={300} height={300} />
            <p className="text-center text-[#D6DDEB] sm:text-start">
              Browse Jobs by Career Level Employers and Recruiters, go to our
              RECRUITMENT SERVICES. Great platform for the job seeker that
              passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="col-span-1 flex flex-col space-y-2">
            <h3 className="mb-4 text-xl font-bold">About</h3>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Companies
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Advice
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Column 3 - Resources */}
          <div className="col-span-1 flex flex-col space-y-2">
            <h3 className="mb-4 text-xl font-bold">Resources</h3>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Help Docs
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Guide
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Updates
            </Link>
            <Link
              href="#"
              className="text-[#D6DDEB] transition-colors hover:text-white"
            >
              Contact Us
            </Link>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="col-span-3 flex flex-col space-y-3">
            <h3 className="mb-4 text-xl font-bold">Get job notifications</h3>
            <p className="text-[#D6DDEB]">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex gap-2 pt-8">
              <TextField
                placeholder="Enter your email"
                size="small"
                className="rounded-base bg-white"
                fullWidth
              />
              <Button variant="contained" color="primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t border-white p-4 text-white">
          <p className="px-4">
            © Copyright 2025. All Rights Reserved by IMDOVA
          </p>
          <div className="flex space-x-4 px-4">
            <IconButton className="cursor-pointer bg-white/10 p-2 text-white shadow-md transition-colors hover:text-blue-500">
              <Facebook className="h-5 w-5" />
            </IconButton>
            <IconButton className="cursor-pointer bg-white/10 p-2 text-white shadow-md transition-colors hover:text-blue-400">
              <Twitter className="h-5 w-5" />
            </IconButton>
            <IconButton className="cursor-pointer bg-white/10 p-2 text-white shadow-md transition-colors hover:text-pink-500">
              <Instagram className="h-5 w-5" />
            </IconButton>
            <IconButton className="cursor-pointer bg-white/10 p-2 text-white shadow-md transition-colors hover:text-blue-600">
              <LinkedIn className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
