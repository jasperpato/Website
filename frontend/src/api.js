const BASE = import.meta.env.VITE_API_URL

function decodeJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

function isTokenExpired(token) {
    const payload = decodeJwt(token)
    if (!payload?.exp) return true
    return Date.now() / 1000 > payload.exp - 30 // 30s buffer
}

function storeTokens(access, refresh) {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
}

export async function refreshAccessToken() {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) throw new Error('No refresh token')
    const res = await fetch(`${BASE}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error('Session expired')
    localStorage.setItem('access', data.access)
    return data.access
}

export async function getValidToken() {
    let token = localStorage.getItem('access')
    if (!token || isTokenExpired(token)) {
        token = await refreshAccessToken()
    }
    return token
}

export function getStoredEmail() {
    return localStorage.getItem('email')
}

export function getStoredIsStaff() {
    return localStorage.getItem('is_staff') === 'true'
}

export async function getMe() {
    const token = await getValidToken()
    const res = await fetch(`${BASE}/auth/me/`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error('Failed to fetch user')
    localStorage.setItem('is_staff', data.is_staff)
    return data
}

export async function register(email) {
    const res = await fetch(`${BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) {
        const error = new Error(data.error || 'Registration failed')
        error.status = res.status
        throw error
    }
    return data
}

export async function verifyCode(email, code) {
    const res = await fetch(`${BASE}/auth/submit_code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Verification failed')
    storeTokens(data.access, data.refresh)
    localStorage.setItem('email', email)
    return data
}

export async function login(email, password) {
    const res = await fetch(`${BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Login failed')
    storeTokens(data.access, data.refresh)
    localStorage.setItem('email', email)
    return data
}

export async function logout() {
    const refresh = localStorage.getItem('refresh')

    if (refresh) {
        try {
            await fetch(`${BASE}/auth/logout/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            })
        } catch {
            // ignore network errors, still clear local session below
        }
    }

    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('email')
}

export async function getWords({ limit = 100, sorted_by = 'alphabetical', ascending = true, approved_only = false } = {}) {
    const params = new URLSearchParams({ limit, sorted_by, ascending, approved_only })
    const res = await fetch(`${BASE}/words/?${params}`)
    const data = await res.json()
    if (!res.ok) throw new Error('Failed to fetch words')
    return data
}

export async function getCategories() {
    const token = await getValidToken()
    const res = await fetch(`${BASE}/categories/`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error('Failed to fetch categories')
    return data
}

export async function updateWord(id, data) {
    const token = await getValidToken()
    const res = await fetch(`${BASE}/words/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || 'Failed to update word')
    return result
}

export async function addWord(word, categoryId = null) {
    const token = await getValidToken()
    const res = await fetch(`${BASE}/words/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ word, category_id: categoryId }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to add word')
    return data
}
