import React, { useState } from 'react';
import { ChartIcon, CalendarIcon, ScissorsIcon, UserGroupIcon } from '../constants';
import type { Appointment, Service } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useData } from '../context/DataContext';

type AdminViewType = 'dashboard' | 'appointments' | 'clients' | 'services';

const AdminHeader = () => (
    <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-30 flex items-center justify-between">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
    </header>
);

const DashboardAppointmentItem: React.FC<{ appt: Appointment }> = ({ appt }) => {
    const { pets, services } = useData();
    const pet = pets.find(p => p.id === appt.petId);
    const service = services.find(s => s.id === appt.serviceId);
    return (
        <div className="p-3 border rounded-md flex justify-between items-center bg-gray-50">
            <div>
                <p className="font-bold text-gray-800">{service?.name} para {pet?.name}</p>
                <p className="text-sm text-gray-600">Cliente: {appt.clientName}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-[#E9691E]">{appt.date}</p>
                <p className="text-sm text-gray-600">{appt.time}</p>
            </div>
        </div>
    )
}

const Dashboard = () => {
    const { appointments, services } = useData();

    const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled');
    const totalClients = new Set(appointments.map(a => a.clientName)).size;
    const totalRevenue = appointments
        .filter(a => a.status === 'Completed')
        .reduce((sum, appt) => {
            const service = services.find(s => s.id === appt.serviceId);
            return sum + (service?.price || 0);
        }, 0);
    
    const chartData = services.map(service => ({
        name: service.name,
        'Citas': appointments.filter(a => a.serviceId === service.id).length
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
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Citas" fill="#2BB8C9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Próximas Citas</h3>
                <div className="space-y-3">
                {upcomingAppointments.length > 0 ? upcomingAppointments.slice(0, 5).map(appt => {
                    // We need to access pets here, but for dashboard simplicity we might not have it in this scope directly easily without prop drilling 
                    // or grabbing from context again. Let's grab it.
                    // (See below component definition for context usage)
                    return <DashboardAppointmentItem key={appt.id} appt={appt} />
                }) : <p className="text-gray-500">No hay citas pendientes.</p>}
                </div>
            </div>
        </div>
    );
};

const AppointmentManager = () => {
    const { appointments, updateAppointmentStatus, pets, services } = useData();

    // Sort: Scheduled first, then by date
    const sortedAppointments = [...appointments].sort((a, b) => {
        if (a.status === 'Scheduled' && b.status !== 'Scheduled') return -1;
        if (a.status !== 'Scheduled' && b.status === 'Scheduled') return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Gestionar Citas</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                        {sortedAppointments.map(appt => {
                            const pet = pets.find(p => p.id === appt.petId);
                            const service = services.find(s => s.id === appt.serviceId);
                            return (
                                <tr key={appt.id} className="border-b hover:bg-gray-50">
                                    <td data-label="Mascota" className="p-3 font-semibold">{pet?.name || 'Desconocido'}</td>
                                    <td data-label="Cliente" className="p-3">{appt.clientName}</td>
                                    <td data-label="Servicio" className="p-3">{service?.name || 'Servicio Borrado'}</td>
                                    <td data-label="Fecha y Hora" className="p-3">{appt.date} {appt.time}</td>
                                    <td data-label="Estado" className="p-3">
                                        <select
                                            value={appt.status}
                                            onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as Appointment['status'])}
                                            className={`p-1 rounded border w-full font-medium ${
                                                appt.status === 'Scheduled' ? 'text-blue-600 border-blue-300 bg-blue-50' :
                                                appt.status === 'Completed' ? 'text-green-600 border-green-300 bg-green-50' :
                                                'text-red-600 border-red-300 bg-red-50'
                                            }`}
                                        >
                                            <option value="Scheduled">Programada</option>
                                            <option value="Completed">Completada</option>
                                            <option value="Cancelled">Cancelada</option>
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
    const { clients, pets } = useData();

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
                            const clientPets = pets.filter(p => client.petIds.includes(p.id));
                            return (
                                <tr key={client.id} className="border-b hover:bg-gray-50">
                                    <td data-label="Nombre" className="p-3 font-semibold">{client.name}</td>
                                    <td data-label="Mascotas" className="p-3">
                                        {clientPets.length > 0 ? clientPets.map(p => p.name).join(', ') : 'Sin mascotas registradas'}
                                    </td>
                                    <td data-label="Miembro Desde" className="p-3">{client.joinedDate}</td>
                                    <td data-label="Acciones" className="p-3">
                                        <button className="text-blue-600 hover:underline">Ver Historial</button>
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

// Moved ServiceModal outside to prevent re-rendering issues causing input focus loss
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
                <h3 className="text-xl font-bold mb-4">{service?.id ? 'Editar' : 'Añadir'} Servicio</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Nombre</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Precio ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Duración (min)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">Cancelar</button>
                        <button type="submit" className="bg-[#2BB8C9] text-white py-2 px-4 rounded hover:bg-[#2399a8]">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ServiceManager = () => {
    const { services, addService, updateService, deleteService } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            deleteService(id);
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
            updateService(service);
        } else {
            const newService = { ...service, id: Date.now() };
            addService(newService);
        }
        setIsModalOpen(false);
        setEditingService(null);
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
                                    <button onClick={() => handleEdit(service)} className="text-blue-600 hover:underline font-medium">Editar</button>
                                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline font-medium">Eliminar</button>
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
        <div className="w-16 md:w-56 bg-gray-900 text-white flex flex-col fixed md:relative h-full z-20">
            <div className="p-4 hidden md:block">
                <h2 className="text-lg font-bold">Admin</h2>
            </div>
            <nav className="flex-grow mt-14 md:mt-0">
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
            <div className="flex-grow bg-gray-100 overflow-x-hidden ml-16 md:ml-0">
                <AdminHeader />
                <main>{renderView()}</main>
            </div>
        </div>
    );
};

export default AdminView;