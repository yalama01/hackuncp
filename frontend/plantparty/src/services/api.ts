import axios from 'axios';

interface Location {
  city: string;
  state: string;
  country: string;
  postal_code: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface ProjectProposal {
  project_overview: string;
  location: Location;
}

const api = axios.create({
  baseURL: 'http://0.0.0.0:8001', // Backend API URL
});

export const submitProjectProposal = async (proposal: ProjectProposal) => {
  try {
    const response = await api.post('/api/project/proposal', proposal);
    return response.data;
  } catch (error) {
    console.error('Error submitting project proposal:', error);
    throw error;
  }
}; 