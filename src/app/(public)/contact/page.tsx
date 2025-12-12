import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "./ContactForm";
import Footer from "@/components/Layout/Footer/footer";

export default function ContactUsPage() {
  return (
    <div>
      <main>
        {/* About Review Content  */}
        <section className="relative py-8 pt-[70px]">
          <Image
            className="absolute left-0 top-0 h-full object-cover"
            src={"/images/courseOverview-1.jpg"}
            alt="About Background"
            width={1440}
            height={720}
          />
          <div className="absolute left-0 top-0 h-full w-full bg-secondary opacity-85"></div>
          <div className="relative flex h-full items-center">
            <div className="container relative mx-auto px-6 lg:max-w-[1170px]">
              <div className="flex w-full flex-col items-center justify-between gap-6 lg:flex-row">
                <Image
                  width={400}
                  height={400}
                  className="rounded-e-[40px] rounded-ss-[50px] object-cover"
                  src={"/images/contact_us_1.jpg"}
                  alt="About Background"
                />
                <div className="max-w-[550px]">
                  <h1 className="mb-6 text-5xl font-bold text-main">
                    Contact Us
                  </h1>
                  <h1 className="mb-4 text-5xl font-bold text-white">
                    Welcome To IMETS Medical School
                  </h1>
                  <p className="text-xl text-white">
                    Need something cleared up? Here are our most frequently
                    asked questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* contact information and contact form  */}
        <section className="py-16">
          <div className="container mx-auto px-6 lg:max-w-[1170px]">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="w-full">
                <h2 className="mb-3 text-3xl font-bold text-main">
                  We would love to hear from you
                </h2>
                <p className="mb-3 text-lg text-muted-foreground">
                  Need something cleared up? Here are our most frequently asked
                  questions.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="p-3">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#042B7626] text-main">
                      <Mail size={25} />
                    </div>
                    <span className="mb-2 block text-xl font-semibold text-main">
                      Email
                    </span>
                    <p className="mb-2 text-muted-foreground">
                      Our friendly team is here to help.
                    </p>
                    <span className="text-main">contact@imetsedu.com</span>
                  </div>
                  <div className="p-3">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#042B7626] text-main">
                      <Phone size={25} />
                    </div>
                    <span className="mb-2 block text-xl font-semibold text-main">
                      Phone
                    </span>
                    <p className="mb-2 text-muted-foreground">
                      Sat-Thr from 10am to 6pm.
                    </p>
                    <span className="text-main">+201008815007</span>
                  </div>
                  <div className="p-3">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#042B7626] text-main">
                      <MapPin size={25} />
                    </div>
                    <span className="mb-2 block text-xl font-semibold text-main">
                      Office
                    </span>
                    <p className="mb-2 text-muted-foreground">
                      Come say hello at our office HQ.
                    </p>
                    <span className="text-main">
                      Alserag Mall, Makram Ebeid Nasr City, cairo Egypt
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full">
                {/* Contact Form */}
                <h2 className="mb-3 text-3xl font-bold text-main">
                  Get in touch
                </h2>
                <p className="mb-3 text-lg text-muted-foreground">
                  We would love to hear from you. Please fill out this form.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
