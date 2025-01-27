import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const deleteUser = async (id: string) => {
  try {
    const endpoint = id === 'current' ? `${API_URL}/api/users/me` : `${API_URL}/api/users/${id}`;
    const response = await axios.delete(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('No tienes autorización para realizar esta acción');
    } else if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado');
    }
    throw new Error('Error al eliminar el usuario');
  }
}; 