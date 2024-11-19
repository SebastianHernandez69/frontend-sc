// components/FormLogin.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  correo: z.string().nonempty('El correo es obligatorio').email('Ingresa un correo válido'),
  password: z.string().nonempty('La contraseña es obligatoria'),
});

type LoginDto = z.infer<typeof loginSchema>;
type DecodedToken = { rol: number };

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormLogin() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const alertError = (message: string) => {
    toast.warning(message, { position: 'top-center' });
  };

  const onSubmit: SubmitHandler<LoginDto> = async (data) => {
    if (!apiUrl) {
      console.error('La URL de la API no está configurada.');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/auth/log-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alertError('Correo o contraseña inválidos');
        return;
      }

      const responseData = await res.json();
      const access_token = responseData.access_token;

      const decodedToken = jwtDecode<DecodedToken>(access_token);
      const userRole = decodedToken.rol;

      sessionStorage.setItem('access_token', access_token);
      router.refresh();

      if (userRole === 3) {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <motion.form
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-[45vh] sm:w-[60vh] max-w-md bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg space-y-6"
      >
        <div className="flex justify-center text-6xl text-gray-800 mb-4">
          <FaUserCircle />
        </div>

        <div className="flex justify-center font-bold text-2xl text-gray-800">
          Iniciar Sesión
        </div>

        <div>
          <Input
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Correo"
            {...register('correo')}
          />
          {errors.correo && (
            <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>
          )}
        </div>

        <div>
          <Input
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Contraseña"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end text-sm text-gray-700 space-x-1">
          <span>¿No tienes una cuenta?</span>
          <a href="/auth/register" className="font-medium text-blue-700 hover:underline">
            Regístrate
          </a>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Log in
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
