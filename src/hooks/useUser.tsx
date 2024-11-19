import { UserProfile } from "@/app/home/interfaces/UserProfile";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useUser = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (user || !loading) {
            return;
        }
        
        const fetchUser = async () => {
            const access_token = sessionStorage.getItem("access_token");

            if(!access_token){
                throw new Error(`No token`)
            }

            try {
                const res = await fetch(`${apiUrl}/user/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error al obtener datos del usuario: ${res.status}`);
                }

                const data: UserProfile = await res.json();
                setUser(data);
            } catch (error) {
                console.error(`Error al obtener los datos del usuario: ${error}`);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [user, loading]);

    return { user, loading, setUser };
};
