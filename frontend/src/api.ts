const BASE = import.meta.env.VITE_API_URL

export interface User {
    email: string
    username: string
    is_staff: boolean
}

export interface Category {
    id: number
    name: string
    color: string
    card_order: number
    board_order: number
}

export interface Word {
    id: number
    word: string
    category: Category | null
    submitted_at: string
    approved: boolean | null
}

export interface Feedback {
    id: number
    name: string
    message: string
    user: number | null
    public: boolean
    submitted_at: string
}

export class ApiError extends Error {
    status?: number
    message: string

    constructor(message: string, status?: number) {
        super(message)
        this.message = message
        this.status = status
    }
}

function decodeJwt(token: string): { exp?: number } | null {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

function isTokenExpired(token: string): boolean {
    const payload = decodeJwt(token)
    if (!payload?.exp) return true
    return Date.now() / 1000 > payload.exp - 30 // 30s buffer
}

function storeTokens(access: string, refresh: string) {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
}

export async function refreshAccessToken(): Promise<string> {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) throw new ApiError('No refresh token')
    
    const res = await fetch(`${BASE}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    })

    const data = await res.json()
    if (!res.ok) throw new ApiError('Session expired')
    
    localStorage.setItem('access', data.access)

    return data.access
}

export async function getValidToken(): Promise<string> {
    let token = localStorage.getItem('access')
    
    if (!token || isTokenExpired(token)) {
        token = await refreshAccessToken()
    }

    return token
}

export function getStoredEmail(): string | null {
    return localStorage.getItem('email')
}

export function getStoredIsStaff(): boolean {
    return localStorage.getItem('is_staff') === 'true'
}

export async function getMe(): Promise<User> {
    const token = await getValidToken()
    
    const res = await fetch(`${BASE}/auth/me/`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })

    const data = await res.json()
    if (!res.ok) throw new ApiError('Failed to fetch user')
    
    localStorage.setItem('is_staff', data.is_staff)
    
    return data
}

export async function updateUser(username: string, password: string): Promise<User> {
    const token = await getValidToken()
    
    const res = await fetch(`${BASE}/auth/update/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    check_error(res, data)
    
    localStorage.setItem('is_staff', data.is_staff)
    
    return data
}

function check_error(res: Response, data?: any, errorMessage?: string) {
    if (!res.ok) {
        if (res.status === 401) throw new ApiError('Credentials are incorrect', 401)
        if (res.status === 429) throw new ApiError('Too many requests, come back later', 429)
        throw new ApiError(errorMessage || data.error || data.message || "Error occurred", res.status)
    }
}

export async function register(email: string): Promise<unknown> {
    const res = await fetch(`${BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })

    const data = await res.json()
    check_error(res, data)
    
    return data
}

export async function submitCode(email: string, code: string): Promise<unknown> {
    const res = await fetch(`${BASE}/auth/submit_code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
    })

    const data = await res.json()
    check_error(res, data)

    storeTokens(data.access, data.refresh)
    localStorage.setItem('email', email)

    return data
}

export async function login(email: string, password: string): Promise<unknown> {
    const res = await fetch(`${BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    check_error(res, data)

    storeTokens(data.access, data.refresh)
    localStorage.setItem('email', email)
    
    return data
}

export async function loginWithCode(email: string): Promise<unknown> {
    const res = await fetch(`${BASE}/auth/login_with_code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })

    const data = await res.json()
    check_error(res, data)
    
    return data
}

export async function logout(): Promise<void> {
    const refresh = localStorage.getItem('refresh')

    if (refresh) {
        try {
            await fetch(`${BASE}/auth/logout/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            })
        } catch {
            // ignore network ApiErrors, still clear local session below
        }
    }

    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('email')
}

export async function getWords(): Promise<Word[]> {
    const res = await fetch(`${BASE}/api/words/`)
    const data = await res.json()
    if (!res.ok) throw new ApiError('Failed to fetch words')
    return data
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE}/api/categories/`)

    const data = await res.json()
    if (!res.ok) throw new ApiError('Failed to fetch categories')

    return data
}

export async function reportWord(id: number): Promise<Word> {
    // const token = await getValidToken()

    const res = await fetch(`${BASE}/api/words/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reported: true }),
    })

    const result = await res.json()
    check_error(res, result)

    return result
}

export async function getFeedback(): Promise<Feedback[]> {
    const res = await fetch(`${BASE}/api/feedback/`)

    const data = await res.json()
    if (!res.ok) throw new ApiError('Failed to fetch feedback')

    return data
}

export async function postFeedback(name: string, message: string, isPublic: boolean = false): Promise<Feedback> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (getStoredEmail()) {
        try {
            headers['Authorization'] = `Bearer ${await getValidToken()}`
        } catch { }
    }

    const res = await fetch(`${BASE}/api/feedback/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, message, public: isPublic }),
    })

    const data = await res.json()
    check_error(res, data)

    return data
}

export async function addWord(word: string, categoryId: number | null = null): Promise<Word> {
    const token = await getValidToken()

    const res = await fetch(`${BASE}/api/words/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ word, category_id: categoryId }),
    })
    const data = await res.json()
    check_error(res, data)

    return data
}
