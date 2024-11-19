import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/admin',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'listado',
    path: '/admin/listado',
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
  },
  {
    title: 'Categorias y Materias',
    path: '/admin/Categorias',
    icon: <Icon icon="lucide:circle-check-big" width="24" height="24" />,
  },
  {
    title: 'Perfil',
    path: '/admin',
    icon: <Icon icon="lucide:circle-user" width="24" height="24" />,
  },
];


