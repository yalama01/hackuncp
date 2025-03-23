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
  event_summary: string;
  location: Location;
}

const api = axios.create({
  baseURL: 'http://localhost:8000', // Update this with your actual API base URL
});

export const submitProjectProposal = async (proposal: ProjectProposal) => {
  try {
    const response = await api.post('/project/proposal', proposal);
    return response.data;
  } catch (error) {
    console.error('Error submitting project proposal:', error);
    throw error;
  }
}; 