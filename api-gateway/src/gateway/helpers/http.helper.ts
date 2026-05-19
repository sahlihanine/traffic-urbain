import axios from 'axios';

export async function callService(url: string, query: string, variables?: any) {
  try {
    const response = await axios.post(url, { query, variables }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data.errors) {
      // ← Transmet le vrai message d'erreur du microservice
      const errorMessage = response.data.errors[0]?.message || 'Erreur inconnue';
      throw new Error(errorMessage);
    }

    return response.data.data;
  } catch (error: any) {
    // ← Si c'est déjà une erreur qu'on a lancée, on la retransmet
    if (error.message && !error.message.includes('Service error')) {
      throw new Error(error.message);
    }
    throw new Error(`Service error: ${error.message}`);
  }
}