"use client";

import Link from "next/link";
import { useState } from "react";
import { AiOutlineHome, AiOutlineUsergroupAdd, AiOutlineLogout } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        // Lógica para cerrar sesión
        localStorage.removeItem("token"); // Ajusta según tu lógica
        router.push("/"); // Redirige al login
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <nav
                className={`${
                    isCollapsed ? "w-20" : "w-64"
                } bg-blue-600 text-white min-h-screen transition-all duration-300`}
            >
                <div className="flex items-center justify-between px-4 py-4">
                    <h1
                        className={`text-2xl font-bold transition-opacity duration-300 ${
                            isCollapsed ? "opacity-0 hidden" : "opacity-100"
                        }`}
                    >
                        SharkCat
                    </h1>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-white focus:outline-none"
                    >
                        ☰
                    </button>
                </div>
                <ul className="mt-8 space-y-4">
                    <li>
                        <Link href="/admin">
                            <div className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg transition-all cursor-pointer">
                                <AiOutlineHome size={24} />
                                {!isCollapsed && <span className="ml-4">Home</span>}
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/list">
                            <div className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg transition-all cursor-pointer">
                                <AiOutlineUsergroupAdd size={24} />
                                {!isCollapsed && <span className="ml-4">Listado de Usuarios</span>}
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/agregar-categorias">
                            <div className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg transition-all cursor-pointer">
                                <FaPlusCircle size={24} />
                                {!isCollapsed && <span className="ml-4">Agregar Categorías</span>}
                            </div>
                        </Link>
                    </li>
                    {/* Opción de Cerrar Sesión */}
                    <li>
                        <div
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 hover:bg-red-700 rounded-lg transition-all cursor-pointer"
                        >
                            <AiOutlineLogout size={24} className="text-red-500" />
                            {!isCollapsed && <span className="ml-4 text-red-500">Cerrar Sesión</span>}
                        </div>
                    </li>
                </ul>
            </nav>

            {/* Main content */}
            <main className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow p-6">{children}</div>
            </main>
        </div>
    );
}
