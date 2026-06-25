import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, Phone, Clock, Send, CheckCircle2 } from "lucide-react";

const services = [
  "First & Second Fix Carpentry",
  "Fire Door Installation & Inspection",
  "Door Installation",
  "Kitchen Installation",
  "Flooring Installation",
  "Fitted Wardrobes & Bespoke Storage",
  "Property Maintenance & Multitrade Services",
  "Minor Plumbing",
  "Tiling & Re-Grouting",
  "Commercial Fit-Out Carpentry",
  "Other / General Enquiry"
];

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a phone number"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please tell us a bit about your project"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log("Form submitted:", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Get In Touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4"
          >
            Request a Free Quote
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground text-lg">
            Tell us about your project and we'll come back to you with a no-obligation quotation.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/40 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shrink-0 h-fit">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold font-heading mb-1">Email Us</p>
                <a href="mailto:info@essexcarpenters.co.uk" className="text-primary hover:underline text-sm break-all">
                  info@essexcarpenters.co.uk
                </a>
                <p className="text-xs text-muted-foreground mt-1">We aim to respond within 24 hours</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/40 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shrink-0 h-fit">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold font-heading mb-1">Call Us</p>
                <p className="text-muted-foreground text-sm">[Phone number available on request]</p>
                <p className="text-xs text-muted-foreground mt-1">Mon–Fri 7am–6pm · Sat 8am–2pm</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/40 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shrink-0 h-fit">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold font-heading mb-2">Business Hours</p>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex justify-between gap-4"><span>Monday – Friday</span><span>7:00am – 6:00pm</span></div>
                  <div className="flex justify-between gap-4"><span>Saturday</span><span>8:00am – 2:00pm</span></div>
                  <div className="flex justify-between gap-4"><span>Sunday</span><span>Closed</span></div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-4"
                >
                  <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading">Thank You!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    We've received your enquiry and will be in touch within 24 hours with your free quotation.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Your Name</label>
                      <input
                        {...register("name")}
                        placeholder="John Smith"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/60"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Email Address</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/60"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Phone Number</label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+44 7700 000000"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/60"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">Service Required</label>
                      <select
                        {...register("service")}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                      >
                        <option value="">Select a service...</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Tell Us About Your Project</label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Please describe the work you need done, the location, and any other details that would help us provide an accurate quote..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/60 resize-none"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Request Free Quote
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    No obligation · We respond within 24 hours
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
