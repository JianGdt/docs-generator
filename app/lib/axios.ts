import "server-only"
import axios from 'axios';
import { auth } from './auth';

export async function createAuthAxios() {
  const session = await auth();
  
  return axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Authorization: session?.user ? `Bearer ${session.user.id}` : '',
    },
  });
}