import axios from 'axios'

const API_URL = 'http://localhost:8000'

export const login = async (email: string, password: string) =>{
    const response = await axios.post(`${API_URL}/login`, {email, password})
    localStorage.setItem('token', response.data.token)
    return response.data
}

export const signup = async (username: string, email: string, password: string, role: string)=>{
    const response = await axios.post(`${API_URL}/signup`, {username, email, password, role})
    return response.data
}

export const getToken = () =>{
    return localStorage.getItem('token')
}

export const logout = () =>{
    localStorage.removeItem('token')
}

