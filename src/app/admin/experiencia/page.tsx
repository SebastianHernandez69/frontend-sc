"use client";

import InstitucionesPuestos from "./AgregarExperiencia";


export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4">
        <h1 className="text-center text-3xl font-bold">Agregar Experiencia</h1>
      </header>
      <main className="container mx-auto py-8 px-4">
        <InstitucionesPuestos></InstitucionesPuestos>
      </main>
    </div>
  );
}
