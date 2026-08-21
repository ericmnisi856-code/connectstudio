import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Studio Connect — Quotes, Bookings & Enquiries" },
      {
        name: "description",
        content:
          "Request a quote, book a site survey or log a support request with Studio Connect's Johannesburg network team.",
      },
      { property: "og:title", content: "Contact Studio Connect" },
      {
        property: "og:description",
        content: "Request a quote, book a site survey or reach our support team.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(1500),
});

function ContactPage() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [sent, setSent] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    const result = schema.safeParse(data);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    
    // Format WhatsApp message
    const whatsappNumber = "27766768658";
    const whatsappMessage = `
*New Contact Form Enquiry*

*Name:* ${data.name}
*Email:* ${data.email}
*Phone:* ${data.phone || 'Not provided'}
*Company:* ${data.company || 'Not provided'}

*Message:*
${data.message}
    `.trim();
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    setSent(true);
    toast.success("Opening WhatsApp to send your enquiry!");
    e.currentTarget.reset();
  }

  return (
    <>
      <section className="relative bg-brand-gradient">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: "url('/images/WhatsApp Image 2026-08-13 at 11.25.37 AM (1).jpeg')" }}
          aria-hidden="true" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Let's spec your site</h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            Quotes, site surveys and support requests all start here.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8">
        <form 
          onSubmit={onSubmit} 
          className="rounded-2xl border border-border/70 bg-card p-8" 
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name" error={errors["name"]} />
            <Field id="email" label="Email" type="email" error={errors["email"]} />
            <Field id="phone" label="Phone (optional)" error={errors["phone"]} />
            <Field id="company" label="Company (optional)" error={errors["company"]} />
          </div>
          <div className="mt-5">
            <Label htmlFor="message">How can we help?</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              maxLength={1500}
              className="mt-2"
              placeholder="Site type, number of users or cameras, timeline…"
            />
            {errors["message"] && (
              <p className="mt-1.5 text-sm text-destructive">{errors["message"]}</p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-6 bg-emerald-gradient text-primary-foreground hover:opacity-90"
          >
            {sent ? "Send another enquiry" : "Send enquiry"}
          </Button>
        </form>

        <aside className="space-y-4">
          {[
            { icon: Phone, title: "Sales", body: "076 676 8658", link: "tel:+27766768658" },
            { icon: Mail, title: "Email", body: "accounts@connectstudio.co.za", link: "mailto:accounts@connectstudio.co.za" },
            { icon: MapPin, title: "Office", body: "14 Empire Road, Parktown, Johannesburg", link: null },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border/70 bg-surface p-6">
              <c.icon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold">{c.title}</h2>
              {c.link ? (
                <a href={c.link} className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary">
                  {c.body}
                </a>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              )}
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}

function Field({
  id,
  label,
  type = "text",
  error,
}: {
  id: string;
  label: string;
  type?: string;
  error?: string | undefined;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} className="mt-2" maxLength={255} />
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
