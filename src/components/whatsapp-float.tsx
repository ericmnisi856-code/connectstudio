import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp chat button
 * Opens WhatsApp chat with the business phone number
 */
export function WhatsAppFloat() {
  const phoneNumber = "27766768658"; // +27 76 676 8658 in international format without + or spaces
  const message = encodeURIComponent("Hi, I'm interested in your network solutions!");

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 sm:size-16"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="size-7 sm:size-8" />
      <span className="absolute -top-1 -right-1 flex size-4 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
      <span className="absolute -top-1 -right-1 flex size-4 rounded-full bg-emerald-500"></span>
    </button>
  );
}
