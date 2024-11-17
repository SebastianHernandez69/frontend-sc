import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/home',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'listado',
    path: '/admin/listado',
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
  },
  {
    title: 'Preguntas contestadas',
    path: '/home/categorias',
    icon: <Icon icon="lucide:circle-check-big" width="24" height="24" />,
  },
  {
    title: 'Chat',
    path: '/home/chat',
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },
  {
    title: 'Perfil',
    path: '/home/profile',
    icon: <Icon icon="lucide:circle-user" width="24" height="24" />,
  },
];


