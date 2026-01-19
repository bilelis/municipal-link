import { User, Bien, Location, Vente, Paiement, DashboardStats } from '@/types';

const API_BASE_URL = 'http://localhost/municipal-link-api/backend/api';

/**
 * Enhanced Fetch Wrapper with JWT and CORS Error Catching
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    });

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers,
            mode: 'cors',
        });

        if (response.status === 204) return {} as T;

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error: any) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.error('CORS or Network Error detected.');
            throw new Error('Impossible de contacter le serveur (Erreur de réseau ou CORS).');
        }
        throw error;
    }
}

export const api = {
    auth: {
        login: (credentials: { email: string; password: string }) =>
            fetchAPI<any>('auth.php', { method: 'POST', body: JSON.stringify(credentials) }),
    },
    biens: {
        getAll: () => fetchAPI<Bien[]>('biens.php'),
        create: (data: any) => fetchAPI<any>('biens.php', { method: 'POST', body: JSON.stringify(data) }),
        update: (data: any) => fetchAPI<any>('biens.php', { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => fetchAPI<any>(`biens.php?id=${id}`, { method: 'DELETE' }),
    },
    locations: {
        getAll: () => fetchAPI<Location[]>('locations.php'),
        create: (data: any) => fetchAPI<any>('locations.php', { method: 'POST', body: JSON.stringify(data) }),
        update: (data: any) => fetchAPI<any>('locations.php', { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => fetchAPI<any>(`locations.php?id=${id}`, { method: 'DELETE' }),
    },
    ventes: {
        getAll: () => fetchAPI<Vente[]>('ventes.php'),
        create: (data: any) => fetchAPI<any>('ventes.php', { method: 'POST', body: JSON.stringify(data) }),
    },
    paiements: {
        getAll: () => fetchAPI<Paiement[]>('paiements.php'),
        create: (data: any) => fetchAPI<any>('paiements.php', { method: 'POST', body: JSON.stringify(data) }),
        update: (data: any) => fetchAPI<any>('paiements.php', { method: 'PUT', body: JSON.stringify(data) }),
    },
    stats: {
        getDashboard: () => fetchAPI<DashboardStats>('stats.php'),
    },
};
