
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Pet, Service, Appointment, Client } from '../types';
import { MOCK_PETS, MOCK_SERVICES, MOCK_APPOINTMENTS, MOCK_CLIENTS } from '../constants';

interface DataContextType {
  pets: Pet[];
  services: Service[];
  appointments: Appointment[];
  clients: Client[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: number) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const addService = (service: Service) => {
    setServices(prev => [...prev, service]);
  };

  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const deleteService = (id: number) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addPet = (petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now(),
    };
    setPets(prev => [...prev, newPet]);
  };

  return (
    <DataContext.Provider value={{
      pets,
      services,
      appointments,
      clients,
      addAppointment,
      updateAppointmentStatus,
      addService,
      updateService,
      deleteService,
      addPet
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
