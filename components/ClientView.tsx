
import React, { useState, useCallback } from 'react';
import { HomeIcon, ScissorsIcon, CalendarIcon, GiftIcon, ImageIcon, PetIcon } from '../constants';
import type { Pet, Service, Appointment } from '../types';
import { MOCK_PROMOTIONS, MOCK_GALLERY } from '../constants';
import FloatingWhatsAppButton from './FloatingWhatsAppButton';
import { useGeolocation } from '../hooks/useGeolocation';
import { useData } from '../context/DataContext';

type ClientViewType = 'home' | 'services' | 'appointments' | 'promotions' | 'gallery';

const ClientHeader = () => (
    <header className="bg-[#E9691E] text-white p-4 shadow-md sticky top-0 z-30 flex items-center justify-center">
        <img src="https://appdesignmex.com/perrukeriamx.png" alt="Logo" className="w-[98px] h-[51.7px]" />
    </header>
);

const AddPetModal = ({ onClose, onSave }: { onClose: () => void, onSave: (pet: Omit<Pet, 'id'>) => void }) => {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            breed,
            age: Number(age),
            imageUrl: 'https://appdesignmex.com/dog01.png' // Default image for new pets
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
                <h3 className="text-xl font-bold mb-4">Agregar Mascota</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="Raza" value={breed} onChange={e => setBreed(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="number" placeholder="Edad" value={age} onChange={e => setAge(e.target.value)} className="w-full p-2 border rounded" required />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="text-gray-500 py-2 px-4">Cancelar</button>
                        <button type="submit" className="bg-[#E9691E] text-white py-2 px-4 rounded-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ onNavigate }: { onNavigate: (view: ClientViewType) => void }) => {
    const { pets, appointments, services, addPet } = useData();
    const [isAddPetOpen, setIsAddPetOpen] = useState(false);

    // Filter appointments for "Juan Perez" (Mock user) for the demo
    const myAppointments = appointments.filter(a => a.clientName === 'Juan Perez' && a.status === 'Scheduled');

    return (
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
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-700">Mis Mascotas</h3>
                    <button onClick={() => setIsAddPetOpen(true)} className="text-[#2BB8C9] text-sm font-bold border border-[#2BB8C9] px-2 py-1 rounded-full hover:bg-[#2BB8C9] hover:text-white transition">+ Agregar</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pets.map(pet => (
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
                {myAppointments.length > 0 ? myAppointments.map(appt => {
                    const pet = pets.find(p => p.id === appt.petId);
                    const service = services.find(s => s.id === appt.serviceId);
                    return (
                        <div key={appt.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 mb-2">
                            <CalendarIcon className="w-8 h-8 text-[#E9691E]" />
                            <div>
                                <p className="font-bold">{service?.name} para {pet?.name}</p>
                                <p className="text-sm text-gray-600">{appt.date} a las {appt.time}</p>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-gray-500 text-center p-4 bg-white rounded-lg shadow-md">No tienes citas programadas.</p>
                )}
            </div>
            {isAddPetOpen && <AddPetModal onClose={() => setIsAddPetOpen(false)} onSave={addPet} />}
        </div>
    );
};


const Services = ({ onNavigate }: { onNavigate: (view: ClientViewType) => void }) => {
  const { services, pets, addAppointment } = useData();
  const { position, loading, error, getLocation } = useGeolocation();
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number>(pets[0]?.id || 0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleBookingStart = (service: Service) => {
    setBookingService(service);
    getLocation();
    // Default date/time for better UX
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime("10:00");
  };

  const confirmBooking = () => {
    if (!bookingService || !selectedPetId || !date || !time) return;

    addAppointment({
        petId: selectedPetId,
        serviceId: bookingService.id,
        clientName: 'Juan Perez', // Hardcoded for this demo
        date: date,
        time: time, // Simple format
        status: 'Scheduled'
    });
    setBookingService(null);
    onNavigate('appointments'); // Go to appointments view
  };

  return(
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Nuestros Servicios</h2>
      {services.map(service => (
        <div key={service.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-[#E9691E]">{service.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
              <p className="text-sm text-gray-500 mt-2">{service.duration} min</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-xl font-bold text-gray-800">${service.price}</p>
              <button onClick={() => handleBookingStart(service)} className="mt-2 bg-[#2BB8C9] text-white font-semibold py-1 px-4 text-sm rounded-full shadow transition-transform hover:scale-105">
                Reservar
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {bookingService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">Reservar {bookingService.name}</h3>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Elige tu Mascota</label>
                        <select 
                            className="w-full border rounded p-2 bg-gray-50"
                            value={selectedPetId}
                            onChange={(e) => setSelectedPetId(Number(e.target.value))}
                        >
                            {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fecha</label>
                        <input type="date" className="w-full border rounded p-2" value={date} onChange={e => setDate(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Hora Preferida</label>
                        <input type="time" className="w-full border rounded p-2" value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                  </div>

                  <div className="mb-4">
                      {loading && <p className="text-[#FAAB2C] text-sm">Obteniendo ubicación...</p>}
                      {error && <p className="text-red-500 text-xs">No se pudo obtener ubicación (opcional).</p>}
                      {position && (
                          <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                             <span className="font-bold">✓ Ubicación detectada</span>
                             <br />Lat: {position.coords.latitude.toFixed(3)}...
                          </div>
                      )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button onClick={confirmBooking} className="bg-[#E9691E] text-white py-2 px-6 rounded-lg font-bold shadow-md hover:bg-[#d55815]">
                        Confirmar Cita
                    </button>
                    <button onClick={() => setBookingService(null)} className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg">
                        Cancelar
                    </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

const Appointments = () => {
  const { appointments, pets, services } = useData();
  // Filter for demo user
  const myAppointments = appointments.filter(a => a.clientName === 'Juan Perez');

  return (
    <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Mis Citas</h2>
        {myAppointments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No tienes historial de citas.</div>
        ) : (
            myAppointments.slice().reverse().map(appt => {
                const pet = pets.find(p => p.id === appt.petId);
                const service = services.find(s => s.id === appt.serviceId);
                const statusColor = appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                const statusText = appt.status === 'Scheduled' ? 'Programada' : appt.status === 'Completed' ? 'Completada' : 'Cancelada';
                
                return (
                    <div key={appt.id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">{service?.name || 'Servicio eliminado'}</p>
                                <p className="text-sm font-semibold text-[#E9691E]">Mascota: {pet?.name || 'Desconocida'}</p>
                                <p className="text-sm text-gray-600">{appt.date} - {appt.time}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                {statusText}
                            </span>
                        </div>
                    </div>
                );
            })
        )}
    </div>
  );
};

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
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-30 pb-safe">
            <div className="flex justify-around max-w-xl mx-auto">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${activeView === item.view ? 'text-[#E9691E]' : 'text-gray-500 hover:text-[#E9691E]'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
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
            case 'services': return <Services onNavigate={setActiveView} />;
            case 'appointments': return <Appointments />;
            case 'promotions': return <Promotions />;
            case 'gallery': return <Gallery />;
            default: return <Dashboard onNavigate={setActiveView} />;
        }
    };
    
    return (
        <>
            <ClientHeader />
            <main className="pb-24"> 
                {renderView()}
            </main>
            <FloatingWhatsAppButton />
            <BottomNavBar activeView={activeView} onNavigate={setActiveView} />
        </>
    );
};

export default ClientView;
