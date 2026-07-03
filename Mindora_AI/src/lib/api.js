const API_BASE = 'http://localhost:8080/api'

export const getToken = () => localStorage.getItem('mindora_token')
export const setToken = (token) => localStorage.setItem('mindora_token', token)
export const removeToken = () => localStorage.removeItem('mindora_token')

async function request(method, path, body = null, requireAuth = false) {
  const headers = { 'Content-Type': 'application/json' }

  if (requireAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || `Lỗi ${res.status}`)
  }

  return data
}

export const api = {
  get:    (path)         => request('GET',    path, null, true),
  post:   (path, body)   => request('POST',   path, body, false),
  postAuth: (path, body) => request('POST',   path, body, true),
  put:    (path, body)   => request('PUT',    path, body, true),
  patch:  (path, body)   => request('PATCH',  path, body, true),
  delete: (path)         => request('DELETE', path, null, true),
}
