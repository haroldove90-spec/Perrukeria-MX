import React, { useState } from 'react';
import { MOCK_APPOINTMENTS, MOCK_PETS, MOCK_SERVICES, MOCK_CLIENTS, ChartIcon, CalendarIcon, ScissorsIcon, UserGroupIcon } from '../constants';
import type { Appointment, Service, Client } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

type AdminViewType = 'dashboard' | 'appointments' | 'clients' | 'services';

const AdminHeader = () => (
    <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-30 flex items-center">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
    </header>
);

const Dashboard = () => {
    const upcomingAppointments = MOCK_APPOINTMENTS.filter(a => a.status === 'Scheduled');
    const totalClients = new Set(MOCK_APPOINTMENTS.map(a => a.clientName)).size;
    const totalRevenue = MOCK_APPOINTMENTS
        .filter(a => a.status === 'Completed')
        .reduce((sum, appt) => {
            const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
            return sum + (service?.price || 0);
        }, 0);
    
    const chartData = MOCK_SERVICES.map(service => ({
        name: service.name,
        'Citas': MOCK_APPOINTMENTS.filter(a => a.serviceId === service.id).length
    }));

    return (
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-500">Ingresos Totales</h3>
                    <p className="text-3xl font-bold text-[#2BB8C9]">${totalRevenue}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-500">Clientes Activos</h3>
                    <p className="text-3xl font-bold text-[#E9691E]">{totalClients}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-500">Citas Pendientes</h3>
                    <p className="text-3xl font-bold text-[#FAAB2C]">{upcomingAppointments.length}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Popularidad de Servicios</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-20} textAnchor="end" height={80} interval={0} fontSize={12} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Citas" fill="#2BB8C9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Citas del Día</h3>
                <div className="space-y-3">
                {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt => {
                    const pet = MOCK_PETS.find(p => p.id === appt.petId);
                    const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
                    return (
                        <div key={appt.id} className="p-3 border rounded-md">
                             <p className="font-bold">{service?.name} para {pet?.name}</p>
                             <p className="text-sm text-gray-600">Cliente: {appt.clientName}</p>
                             <p className="text-sm text-gray-600">Hora: {appt.time}</p>
                        </div>
                    )
                }) : <p className="text-gray-500">No hay citas para hoy.</p>}
                </div>
            </div>
        </div>
    );
};

const AppointmentManager = () => {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

    const handleStatusChange = (id: number, status: Appointment['status']) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Gestionar Citas</h2>
            <div className="bg-white rounded-lg shadow-md">
                <table className="w-full text-sm text-left responsive-table">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                        <tr>
                            <th className="p-3">Mascota</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Servicio</th>
                            <th className="p-3">Fecha y Hora</th>
                            <th className="p-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appt => {
                            const pet = MOCK_PETS.find(p => p.id === appt.petId);
                            const service = MOCK_SERVICES.find(s => s.id === appt.serviceId);
                            return (
                                <tr key={appt.id} className="border-b hover:bg-gray-50">
                                    <td data-label="Mascota" className="p-3 font-semibold">{pet?.name}</td>
                                    <td data-label="Cliente" className="p-3">{appt.clientName}</td>
                                    <td data-label="Servicio" className="p-3">{service?.name}</td>
                                    <td data-label="Fecha y Hora" className="p-3">{appt.date} {appt.time}</td>
                                    <td data-label="Estado" className="p-3">
                                        <select
                                            value={appt.status}
                                            onChange={(e) => handleStatusChange(appt.id, e.target.value as Appointment['status'])}
                                            className="p-1 rounded border bg-white w-full"
                                        >
                                            <option>Scheduled</option>
                                            <option>Completed</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ClientManager = () => {
    const clients = MOCK_CLIENTS;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>
            <div className="bg-white rounded-lg shadow-md">
                <table className="w-full text-sm text-left responsive-table">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Mascotas</th>
                            <th className="p-3">Miembro Desde</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => {
                            const clientPets = MOCK_PETS.filter(p => client.petIds.includes(p.id));
                            return (
                                <tr key={client.id} className="border-b hover:bg-gray-50">
                                    <td data-label="Nombre" className="p-3 font-semibold">{client.name}</td>
                                    <td data-label="Mascotas" className="p-3">{clientPets.map(p => p.name).join(', ')}</td>
                                    <td data-label="Miembro Desde" className="p-3">{client.joinedDate}</td>
                                    <td data-label="Acciones" className="p-3">
                                        <button className="text-blue-600 hover:underline">Ver Perfil</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ServiceManager = () => {
    const [services, setServices] = useState(MOCK_SERVICES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            setServices(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };
    
    const handleAddNew = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleSave = (service: Service) => {
        if (editingService && editingService.id) {
            setServices(prev => prev.map(s => s.id === service.id ? service : s));
        } else {
            const newService = { ...service, id: Date.now() };
            setServices(prev => [...prev, newService]);
        }
        setIsModalOpen(false);
        setEditingService(null);
    };

    const ServiceModal = ({ service, onSave, onCancel }: { service: Partial<Service> | null, onSave: (service: Service) => void, onCancel: () => void }) => {
        const [formData, setFormData] = useState({
            name: service?.name || '',
            description: service?.description || '',
            price: service?.price || 0,
            duration: service?.duration || 0,
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'duration' ? Number(value) : value }));
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ ...service, ...formData } as Service);
        };
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">{service ? 'Editar' : 'Añadir'} Servicio</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del servicio" className="w-full p-2 border rounded" required />
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" required />
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Precio" className="w-full p-2 border rounded" required />
                        <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duración (minutos)" className="w-full p-2 border rounded" required />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded">Cancelar</button>
                            <button type="submit" className="bg-[#2BB8C9] text-white py-2 px-4 rounded">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestión de Servicios</h2>
                <button onClick={handleAddNew} className="bg-[#E9691E] text-white font-bold py-2 px-4 rounded-lg shadow transition-transform hover:scale-105">
                    + Añadir Servicio
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md">
                <table className="w-full text-sm text-left responsive-table">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Precio</th>
                            <th className="p-3">Duración</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id} className="border-b hover:bg-gray-50">
                                <td data-label="Nombre" className="p-3 font-semibold">{service.name}</td>
                                <td data-label="Precio" className="p-3">${service.price}</td>
                                <td data-label="Duración" className="p-3">{service.duration} min</td>
                                <td data-label="Acciones" className="p-3 space-x-2">
                                    <button onClick={() => handleEdit(service)} className="text-blue-600 hover:underline">Editar</button>
                                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ServiceModal service={editingService} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
        </div>
    );
};

const AdminSideBar = ({ activeView, onNavigate }: { activeView: AdminViewType, onNavigate: (view: AdminViewType) => void }) => {
    const navItems = [
        { view: 'dashboard', icon: ChartIcon, label: 'Dashboard' },
        { view: 'appointments', icon: CalendarIcon, label: 'Citas' },
        { view: 'clients', icon: UserGroupIcon, label: 'Clientes' },
        { view: 'services', icon: ScissorsIcon, label: 'Servicios' },
    ] as const;

    return (
        <div className="w-16 md:w-56 bg-gray-900 text-white flex flex-col">
            <div className="p-4 hidden md:block">
                <h2 className="text-lg font-bold">Admin</h2>
            </div>
            <nav className="flex-grow">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={`flex items-center p-4 w-full text-left transition-colors ${activeView === item.view ? 'bg-[#E9691E]' : 'hover:bg-gray-700'}`}
                    >
                        <item.icon className="w-6 h-6 mr-0 md:mr-3 flex-shrink-0" />
                        <span className="hidden md:inline">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};


const AdminView: React.FC = () => {
    const [activeView, setActiveView] = useState<AdminViewType>('dashboard');

    const renderView = () => {
        switch(activeView) {
            case 'dashboard': return <Dashboard />;
            case 'appointments': return <AppointmentManager />;
            case 'clients': return <ClientManager />;
            case 'services': return <ServiceManager />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <AdminSideBar activeView={activeView} onNavigate={setActiveView} />
            <div className="flex-grow bg-gray-100 overflow-x-hidden">
                <AdminHeader />
                <main>{renderView()}</main>
            </div>
        </div>
    );
};

export default AdminView;