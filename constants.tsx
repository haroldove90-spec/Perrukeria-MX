
import React from 'react';
import type { Pet, Service, Appointment, Promotion, GalleryImage, Client } from './types';

export const WHATSAPP_NUMBER = "5215512345678"; // Replace with actual number

export const MOCK_PETS: Pet[] = [
  { id: 1, name: 'Max', breed: 'Golden Retriever', age: 3, imageUrl: 'https://appdesignmex.com/dog01.png' },
  { id: 2, name: 'Luna', breed: 'Poodle Mix', age: 1, imageUrl: 'https://appdesignmex.com/dog02.png' },
  { id: 3, name: 'Rocky', breed: 'Yorkshire Terrier', age: 2, imageUrl: 'https://appdesignmex.com/dog03.png' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 1, name: 'Juan Perez', petIds: [1], joinedDate: '2024-05-10' },
  { id: 2, name: 'Maria Garcia', petIds: [2], joinedDate: '2024-06-22' },
  { id: 3, name: 'Carlos Lopez', petIds: [3], joinedDate: '2024-03-15' },
];

export const MOCK_SERVICES: Service[] = [
  { id: 1, name: 'Baño y Corte', description: 'Baño completo con shampoo especial y corte de pelo a tijera o máquina.', price: 500, duration: 90 },
  { id: 2, name: 'Solo Baño', description: 'Baño relajante con productos hipoalergénicos.', price: 300, duration: 60 },
  { id: 3, name: 'Corte de Uñas', description: 'Corte y limado de uñas profesional.', price: 150, duration: 20 },
  { id: 4, name: 'Paquete Completo VIP', description: 'Incluye baño, corte, corte de uñas, limpieza de oídos y glándulas.', price: 750, duration: 120 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 1, petId: 1, serviceId: 4, clientName: 'Juan Perez', date: '2024-08-15', time: '10:00 AM', status: 'Scheduled' },
  { id: 2, petId: 2, serviceId: 1, clientName: 'Maria Garcia', date: '2024-08-15', time: '01:00 PM', status: 'Scheduled' },
  { id: 3, petId: 3, serviceId: 2, clientName: 'Carlos Lopez', date: '2024-08-10', time: '03:00 PM', status: 'Completed' },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: 1, title: '20% Descuento en tu Primer Servicio', description: 'Reserva tu primera cita con nosotros y obtén un 20% de descuento en cualquier paquete.' },
  { id: 2, title: 'Amigo Fiel', description: 'Trae a un amigo y ambos recibirán un 15% de descuento en su próximo servicio.' },
];

export const MOCK_GALLERY: GalleryImage[] = [
  { id: 1, imageUrl: 'https://appdesignmex.com/dog04.png', caption: 'Una sonrisa Colgate' },
  { id: 2, imageUrl: 'https://appdesignmex.com/dog05.png', caption: 'Relajado y feliz' },
  { id: 3, imageUrl: 'https://appdesignmex.com/dog06.png', caption: 'Mirada de modelo' },
  { id: 4, imageUrl: 'https://appdesignmex.com/dog01.png', caption: 'Un cliente consentido' },
  { id: 5, imageUrl: 'https://appdesignmex.com/dog02.png', caption: '¡Pura frescura de cachorro!' },
  { id: 6, imageUrl: 'https://appdesignmex.com/dog03.png', caption: 'Estilo y elegancia' },
];

// SVG Icons
export const HomeIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
export const ScissorsIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-4.879-4.879L12 12m2.121-2.121L19 5m-4.879 4.879L12 12M5 19l4.879-4.879M5 5l4.879 4.879m0 0L12 12" /><circle cx="8" cy="8" r="2" /><circle cx="16" cy="16" r="2" /></svg>);
export const CalendarIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
export const GiftIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 00-2 2h2zm0 13l-4-4h8l-4 4zm0 0V8m-4 4h8" /></svg>);
// FIX: Corrected typo `constImageIcon` to `const ImageIcon`.
export const ImageIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
export const PetIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
export const ChartIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
export const UserGroupIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
