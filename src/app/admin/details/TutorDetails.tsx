"use client";

export default function TutorDetails({ user }: { user: any }) {
    return (
        <>
            <div className="border-b-2 border-gray-300 mb-4">
                <h3 className="text-xl font-semibold text-blue-500 mb-2">Datos Personales</h3>
                <p className="mb-2"><strong>Primer Nombre:</strong> {user.nombre.primerNombre}</p>
                <p className="mb-2"><strong>Segundo Nombre:</strong> {user.nombre.segundoNombre}</p>
                <p className="mb-2"><strong>Primer Apellido:</strong> {user.nombre.primerApellido}</p>
                <p className="mb-2"><strong>Segundo Apellido:</strong> {user.nombre.segundoApellido}</p>
                <p className="mb-2"><strong>Correo:</strong> {user.correo}</p>
                <p className="mb-2"><strong>Horario de Consultas:</strong></p>
                <p className="text-blue-600 bg-blue-100 inline-block px-4 py-1 rounded-md">
                    {new Date(user.horarioDisponibleInicio).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(user.horarioDisponibleFin).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-blue-500 mb-2">Materias</h3>
                <ul className="list-disc list-inside">
                    <li>Matemáticas</li>
                    <li>Física</li>
                    <li>Programación</li>
                </ul>
            </div>
        </>
    );
}
