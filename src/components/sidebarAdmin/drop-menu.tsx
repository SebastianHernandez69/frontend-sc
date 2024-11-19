"use client";

import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

type PhotoProp = {
    profilePhoto?: string;
};

const DropdownProfile: React.FC<PhotoProp> = ({ profilePhoto }) => {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem("access_token");
        router.push("/auth/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* Si no hay profilePhoto, se muestra un ícono o un marcador */}
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">?</span> {/* Placeholder */}
                    </div>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-5">
                <DropdownMenuItem>Cambiar contraseña</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownProfile;
