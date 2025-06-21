/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  status: 'active' | 'inactive' | 'pending';
  alerts_enabled: boolean;
  notifications_enabled: boolean;
  profile_image: string;
  team_id?: string;
  location?: string;
  last_login?: string;
  created_at?: string;
}

interface Config {
  alerts_enabled: boolean;
  notifications_enabled: boolean;
  location?: string;
}

interface Stats {
  users: number;
  voters: number;
  interactions: number;
  campaigns: number;
  alerts: number;
}

export const useDemoUsers = () => {
  const demoUsers: User[] = [
    {
      id: '1',
      name: 'Samantha Smith',
      email: 'samantha.smith@example.com',
      role: 'admin',
      status: 'active',
      alerts_enabled: true,
      notifications_enabled: true,
      profile_image: '/avatars/avatar-1.png',
      location: 'Bogotá, Colombia',
      last_login: '2024-03-15T14:30:00Z',
      created_at: '2023-01-20T09:15:00Z'
    },
    {
      id: '2',
      name: 'Ricardo Gomez',
      email: 'ricardo.gomez@example.com',
      role: 'manager',
      status: 'active',
      alerts_enabled: true,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-2.png',
      team_id: 'team-alpha',
      location: 'Medellín, Colombia',
      last_login: '2024-03-14T18:45:00Z',
      created_at: '2023-02-10T11:00:00Z'
    },
    {
      id: '3',
      name: 'Isabella Rodriguez',
      email: 'isabella.rodriguez@example.com',
      role: 'agent',
      status: 'pending',
      alerts_enabled: false,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-3.png',
      team_id: 'team-beta',
      location: 'Cali, Colombia',
      created_at: '2023-03-01T16:20:00Z'
    },
    {
      id: '4',
      name: 'Alejandro Vargas',
      email: 'alejandro.vargas@example.com',
      role: 'agent',
      status: 'inactive',
      alerts_enabled: false,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-4.png',
      team_id: 'team-alpha',
      location: 'Barranquilla, Colombia',
      last_login: '2024-03-01T10:00:00Z',
      created_at: '2023-04-05T08:00:00Z'
    },
    {
      id: '5',
      name: 'Sofia Castro',
      email: 'sofia.castro@example.com',
      role: 'agent',
      status: 'active',
      alerts_enabled: true,
      notifications_enabled: true,
      profile_image: '/avatars/avatar-5.png',
      team_id: 'team-beta',
      location: 'Cartagena, Colombia',
      last_login: '2024-03-15T09:00:00Z',
      created_at: '2023-05-12T12:30:00Z'
    },
    {
      id: '6',
      name: 'Daniel Hernandez',
      email: 'daniel.hernandez@example.com',
      role: 'agent',
      status: 'active',
      alerts_enabled: true,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-6.png',
      team_id: 'team-alpha',
      location: 'Pereira, Colombia',
      last_login: '2024-03-15T16:00:00Z',
      created_at: '2023-06-18T14:45:00Z'
    },
    {
      id: '7',
      name: 'Valentina Lopez',
      email: 'valentina.lopez@example.com',
      role: 'agent',
      status: 'pending',
      alerts_enabled: false,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-7.png',
      team_id: 'team-beta',
      location: 'Manizales, Colombia',
      created_at: '2023-07-22T10:20:00Z'
    },
    {
      id: '8',
      name: 'Gabriel Perez',
      email: 'gabriel.perez@example.com',
      role: 'agent',
      status: 'inactive',
      alerts_enabled: false,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-8.png',
      team_id: 'team-alpha',
      location: 'Bucaramanga, Colombia',
      last_login: '2024-02-29T11:30:00Z',
      created_at: '2023-08-28T17:00:00Z'
    },
    {
      id: '9',
      name: 'Camila Torres',
      email: 'camila.torres@example.com',
      role: 'agent',
      status: 'active',
      alerts_enabled: true,
      notifications_enabled: true,
      profile_image: '/avatars/avatar-9.png',
      team_id: 'team-beta',
      location: 'Pasto, Colombia',
      last_login: '2024-03-14T08:00:00Z',
      created_at: '2023-09-03T09:40:00Z'
    },
    {
      id: '10',
      name: 'Samuel Diaz',
      email: 'samuel.diaz@example.com',
      role: 'agent',
      status: 'active',
      alerts_enabled: true,
      notifications_enabled: false,
      profile_image: '/avatars/avatar-10.png',
      team_id: 'team-alpha',
      location: 'Cúcuta, Colombia',
      last_login: '2024-03-15T13:15:00Z',
      created_at: '2023-10-10T15:55:00Z'
    }
  ];

  const productionConfig: Config = {
    alerts_enabled: true,
    notifications_enabled: true,
    location: 'Colombia'
  };

  const demoConfig: Config = {
    alerts_enabled: false,
    notifications_enabled: false,
    location: 'Demo'
  };

  const productionUserTemplate: Omit<User, 'id' | 'name' | 'email'> = {
    role: 'agent',
    status: 'pending',
    alerts_enabled: false,
    notifications_enabled: false,
    profile_image: '/avatars/default.png'
  };

  const FIXED_PASSWORD = 'Password123!';

  const demoStats: Stats = {
    users: 10,
    voters: 500,
    interactions: 2500,
    campaigns: 25,
    alerts: 120
  };

  const productionStats: Stats = {
    users: 5,
    voters: 100,
    interactions: 300,
    campaigns: 5,
    alerts: 30
  };

  const databaseStats = {
    demo: {
      users: demoUsers.length,
      voters: 2,
      interactions: 15,
      campaigns: 3,
      alerts: 4
    },
    production: {
      users: 0,
      voters: 0,
      interactions: 0,
      campaigns: 0,
      alerts: 0
    }
  };

  return {
    demoUsers,
    productionConfig,
    demoConfig,
    productionUserTemplate,
    FIXED_PASSWORD,
    demoStats,
    productionStats,
    databaseStats
  };
};
