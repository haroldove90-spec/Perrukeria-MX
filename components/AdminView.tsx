
import React, { useState } from 'react';
import { MOCK_APPOINTMENTS, MOCK_PETS, MOCK_SERVICES, ChartIcon, CalendarIcon, ScissorsIcon, UserGroupIcon } from '../constants';
import type { Appointment } from '../types';
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
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left">
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
                                    <td className="p-3 font-semibold">{pet?.name}</td>
                                    <td className="p-3">{appt.clientName}</td>
                                    <td className="p-3">{service?.name}</td>
                                    <td className="p-3">{appt.date} {appt.time}</td>
                                    <td className="p-3">
                                        <select
                                            value={appt.status}
                                            onChange={(e) => handleStatusChange(appt.id, e.target.value as Appointment['status'])}
                                            className="p-1 rounded border bg-white"
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
            case 'clients': return <div className="p-4"><h2 className="text-2xl font-bold">Gestión de Clientes (Próximamente)</h2></div>;
            case 'services': return <div className="p-4"><h2 className="text-2xl font-bold">Gestión de Servicios (Próximamente)</h2></div>;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <AdminSideBar activeView={activeView} onNavigate={setActiveView} />
            <div className="flex-grow bg-gray-100">
                <AdminHeader />
                <main>{renderView()}</main>
            </div>
        </div>
    );
};

export default AdminView;
