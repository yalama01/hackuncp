import axios from 'axios';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  coordinates?: Coordinates;
}

interface ProjectProposal {
  project_overview: string;
  location: Location;
}

interface PersonInfo {
  name: string;
  score?: number;
  email_draft?: string;
  bio?: string;
  location?: string;
  linkedin_url?: string;
  emails: string[];
  current_job_title?: string;
  company_name?: string;
}

interface PeopleListResponse {
  people_list: PersonInfo[];
}

interface FeedbackResponse {
  feedback: string;
}

type ApiResponse = PeopleListResponse | FeedbackResponse;

const api = axios.create({
  baseURL: 'http://0.0.0.0:8001', // Backend API URL
});

export const submitProjectProposal = async (proposal: ProjectProposal): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/project/proposal', proposal);
    return response.data;
  } catch (error) {
    console.error('Error submitting project proposal:', error);
    throw error;
  }
}; 