import "server-only"
import axios from 'axios';
import { auth } from './auth';

export async function createAuthAxios() {
  const session = await auth();
  
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    headers: {
      Authorization: session?.user ? `Bearer ${session.user.id}` : '',
    },
  });
}