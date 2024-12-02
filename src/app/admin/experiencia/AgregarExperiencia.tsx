"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";


interface Institucion {
  idInstitucion: number;
  institucion: string;
}

interface Puesto {
  idPuesto: number;
  puesto: string;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function InstitucionesPuestos() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [selectedOption, setSelectedOption] = useState<"instituciones" | "puestos" | null>(null);
  const [showAddInstitucionForm, setShowAddInstitucionForm] = useState(false);
  const [showAddPuestoForm, setShowAddPuestoForm] = useState(false);
  const [newInstitucion, setNewInstitucion] = useState({ institucion: "" });
  const [newPuesto, setNewPuesto] = useState({ puesto: "" });

  const getToken = () => sessionStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const response = await fetch(`${apiUrl}/experience/instituciones`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setInstituciones(data);
      } catch (error) {
        console.error("Error al obtener las instituciones:", error);
        toast.error(`Error al obtener las instituciones: ${error.message}`);
      }
    };

    const fetchPuestos = async () => {
      try {
        const response = await fetch(`${apiUrl}/experience/puestos`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setPuestos(data);
      } catch (error: any) {
        console.error("Error al obtener los puestos:", error);
        toast.error(`Error al obtener los puestos: ${error.message}`);
      }
    };

    fetchInstituciones();
    fetchPuestos();
  }, []);

  const handleAddInstitucion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/experience/instituciones/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newInstitucion),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar la institución.");
      }

      toast.success("Institución agregada con éxito.");
      setShowAddInstitucionForm(false);
      setNewInstitucion({ institucion: "" });
      setInstituciones((prev) => [...prev, data]);
    } catch (error: any) {
      console.error("Error al agregar institución:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAddPuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/experience/puestos/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newPuesto),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar el puesto.");
      }

      toast.success("Puesto agregado con éxito.");
      setShowAddPuestoForm(false);
      setNewPuesto({ puesto: "" });
      setPuestos((prev) => [...prev, data]);
    } catch (error: any) {
      console.error("Error al agregar puesto:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-6 mb-8 mt-8">
        <button
          className={`px-4 py-2 rounded ${selectedOption === "instituciones" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setSelectedOption("instituciones")}
        >
          Instituciones
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedOption === "puestos" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setSelectedOption("puestos")}
        >
          Puestos
        </button>
      </div>

      {selectedOption === "instituciones" && (
        <>
          <div className="mb-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddInstitucionForm(!showAddInstitucionForm)}
            >
              Agregar Institución
            </button>
            {showAddInstitucionForm && (
              <form className="bg-white p-4 rounded shadow-md mt-4" onSubmit={handleAddInstitucion}>
                <h3 className="text-lg font-semibold mb-4">Agregar Institución</h3>
                <label className="block mb-2">
                  Nombre de la Institución:
                  <input
                    type="text"
                    value={newInstitucion.institucion}
                    onChange={(e) => setNewInstitucion({ ...newInstitucion, institucion: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </label>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Guardar
                </button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {instituciones.map((institucion) => (
              <div key={institucion.idInstitucion} className="bg-pink-400 p-4 rounded-lg text-center shadow-md">
                <p className="mt-2 text-white font-semibold">{institucion.institucion}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedOption === "puestos" && (
        <>
          <div className="mb-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddPuestoForm(!showAddPuestoForm)}
            >
              Agregar Puesto
            </button>
            {showAddPuestoForm && (
              <form className="bg-white p-4 rounded shadow-md mt-4" onSubmit={handleAddPuesto}>
                <h3 className="text-lg font-semibold mb-4">Agregar Puesto</h3>
                <label className="block mb-2">
                  Nombre del Puesto:
                  <input
                    type="text"
                    value={newPuesto.puesto}
                    onChange={(e) => setNewPuesto({ ...newPuesto, puesto: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </label>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Guardar
                </button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {puestos.map((puesto) => (
              <div key={puesto.idPuesto} className="bg-pink-400 p-4 rounded-lg text-center shadow-md">
                <p className="mt-2 text-white font-semibold">{puesto.puesto}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}