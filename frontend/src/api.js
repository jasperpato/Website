const BASE = import.meta.env.VITE_API_URL

export async function register(email, password) {
  const res = await fetch(`${BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data
}

export async function verifyCode(email, code) {
  const res = await fetch(`${BASE}/auth/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, code }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Verification failed')
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Login failed')
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

export function getToken() {
  return localStorage.getItem('access')
}

export async function getCategories() {
  const res = await fetch(`${BASE}/categories/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Failed to fetch categories')
  return data
}

export async function addWord(word, categoryId = null) {
  const res = await fetch(`${BASE}/words/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ word, category: categoryId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to add word')
  return data
}
