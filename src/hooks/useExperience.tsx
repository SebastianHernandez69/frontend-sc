import { Conocimiento, Experience } from "@/app/home/interfaces/experience"
import { useEffect, useState } from "react"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const useFetchData = <T,>(endpoint: string, setData: React.Dispatch<React.SetStateAction<T | null>>) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = sessionStorage.getItem("access_token");
            if (!access_token) {
                setError("No access token available");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${apiUrl}${endpoint}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error al obtener los datos: ${res.status}`);
                }

                const result: T = await res.json();
                setData(result);
            } catch (err) {
                console.error(`Error fetching data from ${endpoint}:`, err);
                setError((err as Error).message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, setData]);

    return { loading, error };
};

export const useExperience = () => {
    const [experiencias, setExperiencias] = useState<Experience[] | null>(null);
    const [conocimientos, setConocimientos] = useState<Conocimiento[] | null>(null);

    const { loading: loadingExp, error: errorExp } = useFetchData<Experience[]>("/experience/user/get", setExperiencias);
    const { loading: loadingCon, error: errorCon } = useFetchData<Conocimiento[]>("/experience/user/conocimiento/get", setConocimientos);

    const loading = loadingExp || loadingCon;
    const error = errorExp || errorCon;

    return {
        experiencias,
        conocimientos,
        loading,
        error,
        setExperiencias,
        setConocimientos,
    };
};
