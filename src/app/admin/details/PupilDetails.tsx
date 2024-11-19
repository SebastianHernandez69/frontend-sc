"use client";

export default function PupilDetails({ user }: { user: any }) {
    return (
        <>
            <p className="mb-4"><strong>Primer Nombre:</strong> {user.nombre.primerNombre}</p>
            <p className="mb-4"><strong>Segundo Nombre:</strong> {user.nombre.segundoNombre}</p>
            <p className="mb-4"><strong>Primer Apellido:</strong> {user.nombre.primerApellido}</p>
            <p className="mb-4"><strong>Segundo Apellido:</strong> {user.nombre.segundoApellido}</p>
            <p className="mb-4"><strong>Teléfono:</strong> {user.telefono}</p>
            <p className="mb-4"><strong>DNI:</strong> {user.dni}</p>
            <p className="mb-4">
                <strong>Valoración:</strong>{" "}
                <span className="ml-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <span
                            key={index}
                            className={`inline-block text-xl ${
                                index < user.valoracion ? "text-yellow-500" : "text-gray-300"
                            }`}
                        >
                            ★
                        </span>
                    ))}
                </span>
            </p>
        </>
    );
}
