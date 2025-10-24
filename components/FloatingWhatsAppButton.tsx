
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

const FloatingWhatsAppButton: React.FC = () => {
  const message = encodeURIComponent("Hola! Quisiera más información sobre los servicios de La Perrukeria MX.");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-5 md:bottom-8 md:right-8 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 z-40"
      aria-label="Contactar por WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.31 12.69a6.5 6.5 0 017.38-7.38l.01.01a6.5 6.5 0 01-7.39 7.37z" opacity=".2" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.93 6.02l-.18.35a6.5 6.5 0 009.24 9.24l.35-.18a1.5 1.5 0 011.66.67l.83 1.66a1.5 1.5 0 01-.67 2.01l-1.66.83a1.5 1.5 0 01-2.01-.67c-1.89-3.79-5.96-7.85-9.74-9.74a1.5 1.5 0 01-.67-2.01l.83-1.66a1.5 1.5 0 012.01-.67l1.66.83a1.5 1.5 0 01.67 1.66z" clipRule="evenodd" />
      </svg>
    </a>
  );
};

export default FloatingWhatsAppButton;
