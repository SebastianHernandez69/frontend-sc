"use client";

import { useState, useEffect } from "react";

interface Category {
  idCategoria: number;
  categoria: string;
  imgCategoria: string;
}

interface Materia {
  idMateria: number;
  materia: string;
  imgMateria: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedOption, setSelectedOption] = useState<"categories" | "materias" | null>(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddMateriaForm, setShowAddMateriaForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoria: "", imgFile: null as File | null });
  const [newMateria, setNewMateria] = useState({
    idCategoria: "",
    materia: "",
    imgFile: null as File | null,
  });

  const getToken = () => sessionStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        alert(`Error al obtener las categorías: ${error.message}`);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const allMaterias: Materia[] = [];
        for (const category of categories) {
          const response = await fetch(`${apiUrl}/categories/materia/${category.idCategoria}`, {
           method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
          if (response.ok) {
            const materiasData = await response.json();
            allMaterias.push(...materiasData);
          }
        }
        setMaterias(allMaterias);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
        alert(`Error al obtener las materias: ${error.message}`);
      }
    };

    if (selectedOption === "materias") {
      fetchMaterias();
    }
  }, [selectedOption, categories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoria", newCategory.categoria);
    if (newCategory.imgFile) {
      formData.append("file", newCategory.imgFile);
    }

    try {
      const response = await fetch(`${apiUrl}/materia/categoria/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar la categoría.");
      }

      alert("Categoría agregada con éxito.");
      setShowAddCategoryForm(false);
      setNewCategory({ categoria: "", imgFile: null });
      setCategories((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddMateria = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("idCategoria", newMateria.idCategoria);
    formData.append("materia", newMateria.materia);
    if (newMateria.imgFile) {
      formData.append("file", newMateria.imgFile);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
    try {
      const response = await fetch(`${apiUrl}/materia/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar la materia.");
      }

      alert("Materia agregada con éxito.");
      setShowAddMateriaForm(false);
      setNewMateria({ idCategoria: "", materia: "", imgFile: null });
      setMaterias((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error al agregar materia:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedOption === "categories" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setSelectedOption("categories")}
        >
          Categorías
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedOption === "materias" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setSelectedOption("materias")}
        >
          Materias
        </button>
      </div>

      {selectedOption === "categories" && (
        <>
          <div className="mb-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
            >
              Agregar Categoría
            </button>
            {showAddCategoryForm && (
              <form className="bg-white p-4 rounded shadow-md mt-4" onSubmit={handleAddCategory}>
                <h3 className="text-lg font-semibold mb-4">Agregar Categoría</h3>
                <label className="block mb-2">
                  Nombre de la Categoría:
                  <input
                    type="text"
                    value={newCategory.categoria}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, categoria: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </label>
                <label className="block mb-2">
                  Imagen de la Categoría:
                  <input
                    type="file"
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, imgFile: e.target.files?.[0] || null })
                    }
                    className="border p-2 rounded w-full"
                  />
                </label>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Guardar
                </button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.idCategoria} className="bg-pink-400 p-4 rounded-lg text-center shadow-md">
                <img
                  src={category.imgCategoria}
                  alt={category.categoria}
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="mt-2 text-white font-semibold">{category.categoria}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedOption === "materias" && (
        <>
          <div className="mb-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddMateriaForm(!showAddMateriaForm)}
            >
              Agregar Materia
            </button>
            {showAddMateriaForm && (
              <form className="bg-white p-4 rounded shadow-md mt-4" onSubmit={handleAddMateria}>
                <h3 className="text-lg font-semibold mb-4">Agregar Materia</h3>
                <label className="block mb-2">
                  Categoría:
                  <select
                    value={newMateria.idCategoria}
                    onChange={(e) =>
                      setNewMateria({ ...newMateria, idCategoria: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map((category) => (
                      <option key={category.idCategoria} value={category.idCategoria}>
                        {category.categoria}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block mb-2">
                  Nombre de la Materia:
                  <input
                    type="text"
                    value={newMateria.materia}
                    onChange={(e) =>
                      setNewMateria({ ...newMateria, materia: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </label>
                <label className="block mb-2">
                  Imagen de la Materia:
                  <input
                    type="file"
                    onChange={(e) =>
                      setNewMateria({ ...newMateria, imgFile: e.target.files?.[0] || null })
                    }
                    className="border p-2 rounded w-full"
                  />
                </label>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Guardar
                </button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {materias.map((materia) => (
              <div key={materia.idMateria} className="bg-blue-400 p-4 rounded-lg text-center shadow-md">
                <img
                  src={materia.imgMateria}
                  alt={materia.materia}
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="mt-2 text-white font-semibold">{materia.materia}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
