import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Cable, Cloud, LifeBuoy, GraduationCap, Activity, CheckCircle2, ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { formatZAR } from "@/lib/catalog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Installation, Cloud Management & Support Services | Studio Connect" },
      {
        name: "description",
        content:
          "Site surveys, professional installation, Ruijie Cloud onboarding, 24/7 monitoring and engineer training for Reyee networks across South Africa.",
      },
      { property: "og:title", content: "Network Services | Studio Connect" },
      {
        property: "og:description",
        content: "Site surveys, installation, cloud onboarding, monitoring and training.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: ClipboardList,
    name: "Site survey & design",
    price: 2500,
    unit: "per site",
    body: "Predictive coverage modelling, PoE load calculation and a costed bill of materials within two business days.",
    details: {
      description: "Our comprehensive site survey provides a detailed analysis of your network requirements, ensuring optimal coverage and performance before installation begins.",
      features: [
        "On-site physical inspection and measurement",
        "RF spectrum analysis and interference mapping",
        "Heat map coverage prediction with Ekahau or similar",
        "PoE power budget calculation for all devices",
        "Structured cabling route planning and BOM",
        "Detailed technical report with floor plans",
        "Costed proposal with itemized equipment list",
        "2-year design guarantee on recommended solution"
      ],
      deliverables: [
        "Site survey report (PDF)",
        "Coverage heat maps",
        "Equipment bill of materials",
        "Installation cost estimate",
        "Project timeline"
      ],
      timeline: "2-3 business days from site visit",
      image: "/images/WhatsApp Image 2026-08-13 at 11.25.37 AM.jpeg"
    }
  },
  {
    icon: Cable,
    name: "Professional installation",
    price: 4500,
    unit: "per day",
    body: "Mounting, structured cabling, labelling, throughput verification and a signed commissioning report.",
    details: {
      description: "Expert installation by certified technicians ensures your network is deployed correctly, efficiently, and ready for production use from day one.",
      features: [
        "Certified low-voltage technicians on site",
        "Cat6/Cat6a structured cabling to TIA standards",
        "Professional mounting (wall, ceiling, rack)",
        "Cable management and labeling system",
        "Device configuration and cloud binding",
        "Throughput and connectivity verification",
        "Site cleanup and waste removal",
        "Comprehensive handover documentation"
      ],
      deliverables: [
        "Commissioning certificate",
        "As-built network diagram",
        "Device inventory with serial numbers",
        "Admin credentials (sealed envelope)",
        "Warranty registration"
      ],
      timeline: "1-3 days depending on site size",
      image: "/images/WhatsApp Image 2026-08-13 at 11.25.38 AM.jpeg"
    }
  },
  {
    icon: Cloud,
    name: "Ruijie Cloud onboarding",
    price: 1800,
    unit: "per tenant",
    body: "Tenant setup, device binding, config templates, alert routing and role-based admin access.",
    details: {
      description: "Complete cloud platform configuration that enables centralized management, monitoring, and automation of your entire network infrastructure.",
      features: [
        "Ruijie Cloud tenant creation and branding",
        "Device discovery and cloud binding",
        "Multi-site organization and grouping",
        "VLAN and SSID template creation",
        "Alert threshold configuration and routing",
        "Role-based access control (RBAC) setup",
        "Dashboard customization for your KPIs",
        "Mobile app configuration for admins"
      ],
      deliverables: [
        "Cloud tenant credentials",
        "Admin user accounts",
        "Configuration templates",
        "Alert routing setup",
        "Training documentation"
      ],
      timeline: "1 business day",
      image: "/images/WhatsApp Image 2026-08-13 at 11.25.38 AM (1).jpeg"
    }
  },
  {
    icon: Activity,
    name: "Managed monitoring",
    price: 950,
    unit: "per site / month",
    body: "24/7 NOC monitoring of WAN health, PoE load and client counts with proactive incident handling.",
    details: {
      description: "Round-the-clock network monitoring from our Johannesburg NOC ensures issues are detected and resolved before they impact your business operations.",
      features: [
        "24/7/365 NOC monitoring from Johannesburg",
        "Real-time alerting for critical events",
        "WAN uptime and latency tracking",
        "PoE power budget monitoring",
        "Wireless client health metrics",
        "Bandwidth utilization analysis",
        "Automated ticket creation and escalation",
        "Monthly performance and uptime reports"
      ],
      deliverables: [
        "Monthly uptime report",
        "Incident log with resolution times",
        "Network health dashboard access",
        "Proactive recommendations"
      ],
      timeline: "Ongoing monthly service",
      image: "/images/WhatsApp Image 2026-08-13 at 11.25.38 AM (2).jpeg"
    }
  },
  {
    icon: LifeBuoy,
    name: "Priority support SLA",
    price: 1450,
    unit: "per site / month",
    body: "Four-hour response, remote remediation, advance hardware replacement and a named account engineer.",
    details: {
      description: "Premium support package with guaranteed response times, dedicated engineering resources, and advance hardware replacement to minimize downtime.",
      features: [
        "4-hour response SLA (24/7/365)",
        "Named account engineer assigned",
        "Direct phone and email hotline",
        "Remote access for troubleshooting",
        "On-site dispatch within 24 hours",
        "Advance hardware replacement (RMA)",
        "Quarterly business reviews (QBR)",
        "Priority queue for all requests"
      ],
      deliverables: [
        "SLA agreement document",
        "Named engineer contact details",
        "Quarterly performance reports",
        "Root cause analysis (RCA) for incidents"
      ],
      timeline: "Ongoing monthly service",
      image: "/images/WhatsApp Image 2026-08-13 at 11.25.37 AM (1).jpeg"
    }
  },
  {
    icon: GraduationCap,
    name: "Engineer training",
    price: 6800,
    unit: "per cohort",
    body: "Two-day hands-on Reyee course covering cloud management, VLAN design, VPN and troubleshooting.",
    details: {
      description: "Comprehensive training program that equips your IT team with the skills needed to manage, troubleshoot, and optimize Ruijie Reyee network deployments.",
      features: [
        "2-day hands-on training course",
        "Ruijie Cloud platform deep dive",
        "VLAN design and implementation",
        "Wireless best practices and optimization",
        "VPN configuration (IPsec, L2TP)",
        "Advanced troubleshooting techniques",
        "Real-world scenario labs",
        "Certificate of completion"
      ],
      deliverables: [
        "Training materials (digital)",
        "Lab exercise scenarios",
        "Reference guides and cheat sheets",
        "Course completion certificate",
        "90-day post-training email support"
      ],
      timeline: "2 consecutive days (flexible scheduling)",
      image: "/images/WhatsApp Image 2026-08-13 at 11.25.37 AM.jpeg"
    }
  },
];

function ServicesPage() {
  const [selectedService, setSelectedService] = React.useState<typeof services[0] | null>(null);

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
            Services
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            Hardware is half the job. We do the other half.
          </h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            Transparent, fixed-fee services — survey to handover to ongoing management.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {services.map((s) => (
          <Dialog key={s.name} open={selectedService?.name === s.name} onOpenChange={(open) => !open && setSelectedService(null)}>
            <DialogTrigger asChild>
              <article
                onClick={() => setSelectedService(s)}
                className="card-lift flex flex-col rounded-2xl border border-border/70 bg-card p-7 cursor-pointer transition-all hover:border-primary/50"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent">
                  <s.icon className="size-6 text-primary" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">{s.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <p className="mt-5 border-t border-border pt-4">
                  <span className="font-display text-2xl font-bold">{formatZAR(s.price)}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{s.unit}</span>
                </p>
                <Button variant="ghost" className="mt-3 w-full text-primary hover:text-primary">
                  Learn more <ArrowRight className="ml-2 size-4" />
                </Button>
              </article>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-gradient">
                    <s.icon className="size-6 text-primary-foreground" aria-hidden="true" />
                  </span>
                  <div>
                    <DialogTitle className="text-2xl">{s.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-display text-xl font-bold text-primary">{formatZAR(s.price)}</span>
                      <span className="ml-2">{s.unit}</span>
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              {s.details && (
                <div className="space-y-6 pt-4">
                  {s.details.image && (
                    <div className="overflow-hidden rounded-xl">
                      <img 
                        src={s.details.image} 
                        alt={s.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="text-base text-foreground leading-relaxed">
                      {s.details.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                      What's Included
                    </h3>
                    <ul className="grid gap-2">
                      {s.details.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-surface p-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">
                        Deliverables
                      </h3>
                      <ul className="space-y-1">
                        {s.details.deliverables.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg bg-surface p-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">
                        Timeline
                      </h3>
                      <p className="text-sm text-muted-foreground">{s.details.timeline}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button asChild className="flex-1 bg-emerald-gradient text-primary-foreground hover:opacity-90">
                      <Link to="/contact">Request Quote</Link>
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedService(null)} className="flex-1">
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-gradient px-8 py-14 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold">Book an engineer</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Tell us the site type and timeline. We'll confirm availability within one business day.
          </p>
          <Button asChild size="lg" className="mt-7 bg-background text-foreground hover:bg-background/90">
            <Link to="/contact">Start a booking</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
