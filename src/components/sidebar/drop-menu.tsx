"use client"

import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

type PhotoProp = {
    profilePhoto?: string
}

const DropdownProfile: React.FC<PhotoProp> = ({profilePhoto}) => {

    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem("access_token");
        router.push("/auth/login")
    }

    const handleChangePassword = () => {
        router.push("/auth/change-pass"); // Redirige a la página de change password.
      };

    return(
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <img src={profilePhoto} alt="" className="rounded-full" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-5">
                    <DropdownMenuItem onClick={handleChangePassword}>Cambiar contraseña</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleLogout}>Cerrar sesion</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default DropdownProfile;