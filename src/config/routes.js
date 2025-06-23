import AllTasks from '@/components/pages/AllTasks';
import Today from '@/components/pages/Today';
import Upcoming from '@/components/pages/Upcoming';
import Archive from '@/components/pages/Archive';
import Settings from '@/components/pages/Settings';

export const routes = {
  allTasks: {
    id: 'allTasks',
    label: 'All Tasks',
    path: '/all-tasks',
    icon: 'List',
    component: AllTasks
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
    component: Upcoming
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;