import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, Clock, FileText } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Technical Support & Warranty | Studio Connect" },
      {
        name: "description",
        content:
          "Get help with Reyee gateways and routers: warranty terms, RMA process, response times and answers to the questions we field most often.",
      },
      { property: "og:title", content: "Technical Support | Studio Connect" },
      {
        property: "og:description",
        content: "Warranty, RMA and troubleshooting help for Ruijie Reyee networks.",
      },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  {
    q: "What warranty do Reyee routers carry?",
    a: "All EG gateways and NBR security routers ship with a 3-year Ruijie warranty. Wireless routers carry 2 years. Studio Connect handles the RMA on your behalf and can supply advance replacement under a priority SLA.",
  },
  {
    q: "Can you manage devices we already own?",
    a: "Yes. If the hardware is Reyee and still supported, we bind it to your Ruijie Cloud tenant, audit the configuration and bring it onto the same monitoring and alerting as new kit.",
  },
  {
    q: "How fast do you respond to a fault?",
    a: "Standard support is next business day. Priority SLA customers get a four-hour response window, 24/7, with remote remediation attempted immediately on ticket creation.",
  },
  {
    q: "Do you deliver outside Gauteng?",
    a: "We deliver nationwide within 2–4 business days and have installation partners in Cape Town, Durban, Gqeberha and Bloemfontein.",
  },
  {
    q: "Can I order without installation?",
    a: "Absolutely. Hardware-only orders ship pre-staged if you send us the config brief, or factory-default if you'd rather configure it yourself.",
  },
  {
    q: "How does billing work for managed sites?",
    a: "Managed monitoring and SLAs are billed monthly in arrears per site, with a 30-day notice period. Hardware is invoiced on dispatch.",
  },
];

function SupportPage() {
  return (
    <>
      <section className="relative bg-brand-gradient">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: "url('/images/WhatsApp Image 2026-08-13 at 11.25.37 AM.jpeg')" }}
          aria-hidden="true" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
            Support
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">We pick up the phone</h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            Real engineers in Johannesburg, not a ticket queue that goes quiet.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[
          { icon: Phone, title: "Support line", body: "+27 11 568 0421", note: "Mon–Fri, 07:00–18:00" },
          { icon: Mail, title: "Email", body: "support@studioconnect.co.za", note: "Replies within 4 hours" },
          { icon: Clock, title: "Emergency SLA", body: "24/7 for priority sites", note: "4-hour response" },
          { icon: FileText, title: "RMA", body: "We handle the paperwork", note: "Advance swap available" },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border/70 bg-card p-6">
            <c.icon className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-sm font-semibold">{c.title}</h2>
            <p className="mt-1.5 text-sm text-foreground">{c.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-border/70 bg-surface p-8 text-center">
          <p className="text-sm text-muted-foreground">Still stuck?</p>
          <Button asChild className="mt-4 bg-emerald-gradient text-primary-foreground hover:opacity-90">
            <Link to="/contact">Log a support request</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
