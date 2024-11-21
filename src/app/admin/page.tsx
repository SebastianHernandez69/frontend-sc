"use client";

import { AiOutlineUsergroupAdd, AiOutlineLogout } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewPage() {
    const router = useRouter();

    const handleLogout = () => {
        // Lógica para cerrar sesión
        // Por ejemplo, eliminar el token del localStorage o cookies
        localStorage.removeItem("token"); // Ajusta según tu lógica
        router.push("/"); // Redirigir al login después de cerrar sesión
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                Bienvenido
            </h1>
            <p className="mt-4 text-lg text-center mb-8">
                Selecciona una opción para continuar:
            </p>

            {/* Galería de opciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Tarjeta para Listado de Usuarios */}
                <Link href="/admin/list">
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                        <AiOutlineUsergroupAdd size={48} className="text-blue-500 mb-4" />
                        <h2 className="text-xl font-bold">Listado de Usuarios</h2>
                        <p className="text-gray-600 text-center mt-2">
                            Administra los usuarios registrados.
                        </p>
                    </div>
                </Link>

                {/* Tarjeta para Agregar Categorías */}
                <Link href="/admin/Categorias">
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                        <FaPlusCircle size={48} className="text-green-500 mb-4" />
                        <h2 className="text-xl font-bold">Agregar Categorías</h2>
                        <p className="text-gray-600 text-center mt-2">
                            Crea nuevas categorías para tus datos.
                        </p>
                    </div>
                </Link>

                {/* Tarjeta para Cerrar Sesión */}
                <div
                    onClick={handleLogout}
                    className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                >
                    <AiOutlineLogout size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-red-500">Cerrar Sesión</h2>
                    <p className="text-gray-600 text-center mt-2">
                        Sal de tu cuenta de forma segura.
                    </p>
                </div>
            </div>
        </div>
    );
}
