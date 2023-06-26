import axios from 'axios';
import queryString from 'query-string';
import { PetopiaInterface, PetopiaGetQueryInterface } from 'interfaces/petopia';
import { GetQueryInterface } from '../../interfaces';

export const getPetopias = async (query?: PetopiaGetQueryInterface) => {
  const response = await axios.get(`/api/petopias${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPetopia = async (petopia: PetopiaInterface) => {
  const response = await axios.post('/api/petopias', petopia);
  return response.data;
};

export const updatePetopiaById = async (id: string, petopia: PetopiaInterface) => {
  const response = await axios.put(`/api/petopias/${id}`, petopia);
  return response.data;
};

export const getPetopiaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/petopias/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePetopiaById = async (id: string) => {
  const response = await axios.delete(`/api/petopias/${id}`);
  return response.data;
};
