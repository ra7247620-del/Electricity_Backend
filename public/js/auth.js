const API_BASE = '/api';

function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

async function apiCall(endpoint, options = {}) {
    const token = getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    // If token expired, try to refresh
    if (response.status === 401) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_BASE}/auth/refresh-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                });

                const refreshData = await refreshResponse.json();
                
                if (refreshData.success) {
                    setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
                    
                    // Retry original request
                    headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
                    response = await fetch(`${API_BASE}${endpoint}`, {
                        ...options,
                        headers
                    });
                } else {
                    clearAuth();
                    window.location.href = 'login.html';
                    return null;
                }
            } catch (error) {
                clearAuth();
                window.location.href = 'login.html';
                return null;
            }
        } else {
            clearAuth();
            window.location.href = 'login.html';
            return null;
        }
    }

    return response.json();
}

function checkAuth() {
    const user = getUser();
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const adminLink = document.getElementById('adminLink');
    const logoutLink = document.getElementById('logoutLink');

    if (user) {
        if (loginLink) loginLink.classList.add('d-none');
        if (registerLink) registerLink.classList.add('d-none');
        if (dashboardLink) dashboardLink.classList.remove('d-none');
        if (logoutLink) logoutLink.classList.remove('d-none');
        
        if (user.role === 'admin' && adminLink) {
            adminLink.classList.remove('d-none');
        }
    } else {
        if (loginLink) loginLink.classList.remove('d-none');
        if (registerLink) registerLink.classList.remove('d-none');
        if (dashboardLink) dashboardLink.classList.add('d-none');
        if (adminLink) adminLink.classList.add('d-none');
        if (logoutLink) logoutLink.classList.add('d-none');
    }
}

function logout() {
    const token = getAccessToken();
    if (token) {
        fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch(() => {});
    }
    clearAuth();
    window.location.href = 'index.html';
}

// Protect dashboard and admin pages
function requireAuth() {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    const user = getUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}
