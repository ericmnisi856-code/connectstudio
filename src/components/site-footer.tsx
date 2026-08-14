import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

import { categories } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-gradient-to-b from-primary-deep/95 to-slate-900/98 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent pointer-events-none" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/images/logo.png" 
              alt="Studio Connect" 
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-emerald-100/90">
            Authorised Ruijie Reyee partner supplying, installing and managing cloud networks for
            South African businesses.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-emerald-200">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/80">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to="/products"
                  search={{ category: c.id }}
                  className="transition-colors hover:text-emerald-200"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products" className="transition-colors hover:text-emerald-200">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-emerald-200">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/80">
            <li>
              <Link to="/solutions" className="transition-colors hover:text-emerald-200">
                Solutions
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-emerald-200">
                Services
              </Link>
            </li>
            <li>
              <Link to="/support" className="transition-colors hover:text-emerald-200">
                Support
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-emerald-200">
                About us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-emerald-200">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-emerald-300" aria-hidden="true" /> 
              <a href="tel:+27766768658" className="transition-colors hover:text-emerald-200">
                076 676 8658
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-emerald-300" aria-hidden="true" /> 
              <a href="mailto:accounts@connectstudio.co.za" className="transition-colors hover:text-emerald-200">
                accounts@connectstudio.co.za
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-emerald-700/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-emerald-100/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Studio Connect. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Prices include 15% VAT where indicated. E&amp;OE.</span>
            <Link to="/admin" className="transition-colors hover:text-emerald-200">
              Staff login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
