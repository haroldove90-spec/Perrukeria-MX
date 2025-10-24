
import React, { useState, useCallback } from 'react';
import { HomeIcon, ScissorsIcon, CalendarIcon, GiftIcon, ImageIcon, PetIcon } from '../constants';
import type { Pet, Service, Appointment, Promotion, GalleryImage } from '../types';
import { MOCK_PETS, MOCK_SERVICES, MOCK_APPOINTMENTS, MOCK_PROMOTIONS, MOCK_GALLERY } from '../constants';
import FloatingWhatsAppButton from './FloatingWhatsAppButton';
import { useGeolocation } from '../hooks/useGeolocation';

type ClientViewType = 'home' | 'services' | 'appointments' | 'promotions' | 'gallery';

const ClientHeader = () => (
    <header className="bg-[#E9691E] text-white p-4 shadow-md sticky top-0 z-30 flex items-center justify-center">
        <img src="https://appdesignmex.com/perrukeriamx.png" alt="Logo" className="w-[98px] h-[51.7px]" />
    </header>
);

const Dashboard = ({ onNavigate }: { onNavigate: (view: ClientViewType) => void }) => (
    <div className="p-4 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido a La Perrukeria MX!</h2>
            <p className="text-gray-600 mt-2">El mejor cuidado para tu mejor amigo, ¡directo a tu puerta!</p>
            <button
                onClick={() => onNavigate('services')}
                className="mt-4 bg-[#FAAB2C] text-black font-bold py-2 px-6 rounded-full shadow-lg transition-transform hover:scale-105"
            >
                Reservar una Cita
            </button>
        </div>

        <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Mis Mascotas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_PETS.map(pet => (
                    <div key={pet.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                        <img src={pet.imageUrl} alt={pet.name} className="w-20 h-20 rounded-full object-cover mb-2 border-4 border-[#2BB8C9]" />
                        <p className="font-bold text-gray-800">{pet.name}</p>
                        <p className="text-sm text-gray-500">{pet.breed}</p>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Próximas Citas</h3>
            {MOCK_APPOINTMENTS.filter(a => a.status === 'Scheduled').slice(0, 1).map(appt => {
                const pet = MOCK_PETS.find(p => p.id === appt.petId);
                const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
                return (
                    <div key={appt.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <CalendarIcon className="w-8 h-8 text-[#E9691E]" />
                        <div>
                            <p className="font-bold">{service?.name} para {pet?.name}</p>
                            <p className="text-sm text-gray-600">{appt.date} a las {appt.time}</p>
                        </div>
                    </div>
                );
            })}
             {MOCK_APPOINTMENTS.filter(a => a.status === 'Scheduled').length === 0 && <p className="text-gray-500 text-center p-4 bg-white rounded-lg shadow-md">No tienes citas programadas.</p>}
        </div>
    </div>
);


const Services = () => {
  const { position, loading, error, getLocation } = useGeolocation();
  const [booking, setBooking] = useState<Service | null>(null);

  const handleBooking = useCallback((service: Service) => {
    setBooking(service);
    getLocation();
  }, [getLocation]);

  return(
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Nuestros Servicios</h2>
      {MOCK_SERVICES.map(service => (
        <div key={service.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-[#E9691E]">{service.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
              <p className="text-sm text-gray-500 mt-2">{service.duration} min</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-xl font-bold text-gray-800">${service.price}</p>
              <button onClick={() => handleBooking(service)} className="mt-2 bg-[#2BB8C9] text-white font-semibold py-1 px-4 text-sm rounded-full shadow transition-transform hover:scale-105">
                Reservar
              </button>
            </div>
          </div>
        </div>
      ))}
      {booking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 text-center shadow-xl w-full max-w-sm">
                  <h3 className="text-xl font-bold mb-2">Confirmando tu cita...</h3>
                  <p className="mb-4">Solicitando tu ubicación para el servicio de <span className="font-semibold">{booking.name}</span>.</p>
                  {loading && <p className="text-[#FAAB2C]">Buscando ubicación...</p>}
                  {error && <p className="text-red-500">Error: {error.message}</p>}
                  {position && (
                      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-left text-sm my-4">
                          <p className="font-bold">¡Ubicación confirmada!</p>
                          <p>Lat: {position.coords.latitude.toFixed(4)}, Lon: {position.coords.longitude.toFixed(4)}</p>
                           <p className="mt-2 text-xs">Un agente se pondrá en contacto por WhatsApp para confirmar los detalles.</p>
                      </div>
                  )}
                  <button onClick={() => setBooking(null)} className="mt-4 bg-gray-300 text-gray-800 py-2 px-6 rounded-full">Cerrar</button>
              </div>
          </div>
      )}
    </div>
  );
}

const Appointments = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Mis Citas</h2>
    {MOCK_APPOINTMENTS.map(appt => {
      const pet = MOCK_PETS.find(p => p.id === appt.petId);
      const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
      const statusColor = appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      return (
        <div key={appt.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{service?.name} para {pet?.name}</p>
              <p className="text-sm text-gray-600">{appt.date} a las {appt.time}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
              {appt.status}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

const Promotions = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Promociones Especiales</h2>
    {MOCK_PROMOTIONS.map(promo => (
      <div key={promo.id} className="bg-gradient-to-br from-[#FAAB2C] to-[#E9691E] text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold">{promo.title}</h3>
        <p className="mt-2">{promo.description}</p>
      </div>
    ))}
  </div>
);

const Gallery = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Nuestros Clientes Felices</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {MOCK_GALLERY.map(image => (
        <div key={image.id} className="overflow-hidden rounded-lg shadow-md">
          <img src={image.imageUrl} alt={image.caption} className="w-full h-full object-cover transition-transform hover:scale-110" />
        </div>
      ))}
    </div>
  </div>
);

const BottomNavBar = ({ activeView, onNavigate }: { activeView: ClientViewType, onNavigate: (view: ClientViewType) => void }) => {
    const navItems = [
        { view: 'home', icon: HomeIcon, label: 'Inicio' },
        { view: 'services', icon: ScissorsIcon, label: 'Servicios' },
        { view: 'appointments', icon: CalendarIcon, label: 'Citas' },
        { view: 'promotions', icon: GiftIcon, label: 'Promos' },
        { view: 'gallery', icon: ImageIcon, label: 'Galería' },
    ] as const;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-30">
            <div className="flex justify-around max-w-xl mx-auto">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${activeView === item.view ? 'text-[#E9691E]' : 'text-gray-500 hover:text-[#E9691E]'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const ClientView: React.FC = () => {
    const [activeView, setActiveView] = useState<ClientViewType>('home');

    const renderView = () => {
        switch (activeView) {
            case 'home': return <Dashboard onNavigate={setActiveView} />;
            case 'services': return <Services />;
            case 'appointments': return <Appointments />;
            case 'promotions': return <Promotions />;
            case 'gallery': return <Gallery />;
            default: return <Dashboard onNavigate={setActiveView} />;
        }
    };
    
    return (
        <>
            <ClientHeader />
            <main className="pb-20"> 
                {renderView()}
            </main>
            <FloatingWhatsAppButton />
            <BottomNavBar activeView={activeView} onNavigate={setActiveView} />
        </>
    );
};

export default ClientView;