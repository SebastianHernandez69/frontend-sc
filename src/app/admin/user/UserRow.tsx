export default function UserRow({ user, toggleUserStatus, showDetails }) {
    const userFullName = `${user.nombre.primerNombre} ${user.nombre.segundoNombre} ${user.nombre.primerApellido} ${user.nombre.segundoApellido}`;
    const userTypeLabel = user.rol.rol;

    return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{userFullName}</td>
            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{user.correo}</td>
            <td className="px-6 py-4 text-sm text-gray-500 text-center">{userTypeLabel}</td>
            <td className="px-6 py-4 text-sm text-center">
                <button
                    onClick={toggleUserStatus}
                    className={`px-4 py-2 rounded-full ${
                        user.isenabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    } text-white transition duration-200`}
                >
                    {user.isenabled ? "Habilitado" : "Deshabilitado"}
                </button>
            </td>
            <td className="px-6 py-4 text-sm text-center">
                <button
                    onClick={() => showDetails(user)}
                    className="px-4 py-2 text-sm rounded-full bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
                >
                    Ver Detalles
                </button>
            </td>
        </tr>
    );
}
