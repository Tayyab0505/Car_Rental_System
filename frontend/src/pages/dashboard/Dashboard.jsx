import { Navigate, Route, Routes } from "react-router-dom";
import SideBar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin'

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideBar />
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<Navigate to={isAdmin ? 'overview' : 'cars'} />} />
                    {isAdmin && <Route path="overview" element={<Overview />} />}
                    <Route path="cars" element={<Cars />} />
                    <Route path="bookings" element={<Bookings />} />
                </Routes>
            </main>
        </div>
    )
}