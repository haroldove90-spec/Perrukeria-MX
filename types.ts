
export enum Role {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  imageUrl: string;
  notes?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface Appointment {
  id: number;
  petId: number;
  serviceId: number;
  clientName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
}

export interface Client {
  id: number;
  name: string;
  petIds: number[];
  joinedDate: string;
}
