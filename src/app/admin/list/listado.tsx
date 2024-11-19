"use client";

import { useState, useEffect } from "react";
import UserRow from "../user/UserRow";
import TutorDetails from "../details/TutorDetails";
import PupilDetails from "../details/PupilDetails";

export default function ListadoUsuarios() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Base URL del backend
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false); // Estado para manejar el refresco

    // Cargar los usuarios
    useEffect(() => {
        async function fetchUsers() {
            try {
                const responseRole1 = await fetch(`${apiUrl}/admin/get-users?idRol=1`);
                const responseRole2 = await fetch(`${apiUrl}/admin/get-users?idRol=2`);

                if (!responseRole1.ok || !responseRole2.ok) {
                    throw new Error("Error al obtener los usuarios");
                }

                const role1Users = await responseRole1.json();
                const role2Users = await responseRole2.json();

                setUsers([...role1Users, ...role2Users]);
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        }

        fetchUsers();
    }, [apiUrl, refresh]); // Dependencia en `refresh` para recargar cuando cambie

    const toggleUserStatus = async (user) => {
        try {
            const response = await fetch(`${apiUrl}/admin/user/change-state/${user.idUsuario}`, {
                method: "PUT",
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el estado del usuario");
            }

            const result = await response.json();
            console.log(result.message);

            // Disparar un refresco de datos
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
        }
    };

    const showDetails = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Listado de Usuarios</h1>
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-lg">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 bg-green-500 text-white">
                            Nombre
                        </th>
                        <th className="border border-gray-300 px-4 py-2 bg-green-500 text-white">
                            Correo
                        </th>
                        <th className="border border-gray-300 px-4 py-2 bg-green-500 text-white">
                            Rol
                        </th>
                        <th className="border border-gray-300 px-4 py-2 bg-green-500 text-white">
                            Estado
                        </th>
                        <th className="border border-gray-300 px-4 py-2 bg-green-500 text-white">
                            Acción
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow
                            key={user.idUsuario}
                            user={user}
                            toggleUserStatus={() => toggleUserStatus(user)}
                            showDetails={showDetails}
                        />
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-3/4 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            {selectedUser.rol.idRol === 1 ? "Perfil del Tutor" : "Perfil del Pupilo"}
                        </h2>
                        <div className="flex">
                            <div className="w-1/3 flex flex-col items-center">
                                <img
                                    src={selectedUser.fotoPerfil}
                                    alt={`${selectedUser.nombre.primerNombre} ${selectedUser.nombre.primerApellido}`}
                                    className="w-32 h-32 rounded-full mb-4"
                                />
                                <p className="text-lg font-semibold">
                                    {`${selectedUser.nombre.primerNombre} ${selectedUser.nombre.segundoNombre} ${selectedUser.nombre.primerApellido} ${selectedUser.nombre.segundoApellido}`}
                                </p>
                                <p className="text-gray-500">{selectedUser.correo}</p>
                            </div>

                            <div className="w-2/3 ml-8">
                                {selectedUser.rol.idRol === 1 ? (
                                    <TutorDetails user={selectedUser} />
                                ) : (
                                    <PupilDetails user={selectedUser} />
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
