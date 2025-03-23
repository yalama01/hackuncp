import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';
import LinkedInAuth from '../components/LinkedInAuth';
import { submitProjectProposal } from '../services/api';

interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  bio: string;
  linkedinUrl: string;
  suggestedMessage: string;
  isConnected?: boolean;
}

const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Sustainability Director',
    organization: 'GreenTech Solutions',
    location: 'San Francisco, CA',
    bio: 'Leading sustainability initiatives and helping organizations transition to greener practices. Specialized in renewable energy and circular economy solutions.',
    linkedinUrl: 'https://linkedin.com/in/sarah-chen',
    suggestedMessage: 'Hi Sarah, I noticed your work in renewable energy at GreenTech Solutions. I\'m working on a similar project and would love to connect about potential collaboration opportunities.',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Environmental Consultant',
    organization: 'EcoConsult',
    location: 'New York, NY',
    bio: 'Environmental consultant with expertise in sustainable agriculture and water resource management. Helping businesses implement eco-friendly practices.',
    linkedinUrl: 'https://linkedin.com/in/michael-rodriguez',
    suggestedMessage: 'Hello Michael, I saw your recent work in sustainable agriculture at EcoConsult. I\'m developing a similar initiative and would value your insights.',
  },
];

const Home = () => {
  const [idea, setIdea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [messageEdit, setMessageEdit] = useState('');
  const [editRequest, setEditRequest] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!idea || !city || !state || !country || !postalCode || !latitude || !longitude) {
      setSubmitStatus('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const proposal = {
        event_summary: idea,
        location: {
          city,
          state,
          country,
          postal_code: postalCode,
          coordinates: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
        },
      };

      await submitProjectProposal(proposal);
      setSubmitStatus('Project proposal submitted successfully!');
      handleSearch(); // Search for potential collaborators
    } catch (error) {
      console.error('Error submitting project proposal:', error);
      setSubmitStatus('Failed to submit project proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPeople(mockPeople);
    setIsSearching(false);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setMessageEdit(person.suggestedMessage);
    setEditRequest('');
  };

  const handleMessageUpdate = () => {
    if (selectedPerson) {
      const updatedMessage = messageEdit;
      setPeople(prevPeople =>
        prevPeople.map(person =>
          person.id === selectedPerson.id
            ? { ...person, suggestedMessage: updatedMessage }
            : person
        )
      );
      setSelectedPerson(prev => prev ? { ...prev, suggestedMessage: updatedMessage } : null);
      setEditRequest('');
    }
  };

  const handleLinkedInAuth = async () => {
    // Simulate LinkedIn authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAuthenticated(true);
  };

  const handleConnectAndSend = async (person: Person) => {
    if (!isAuthenticated) {
      setConnectionStatus('Please connect with LinkedIn first');
      return;
    }

    setIsConnecting(true);
    try {
      // Simulate API calls for connecting and sending message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPeople(prevPeople =>
        prevPeople.map(p =>
          p.id === person.id
            ? { ...p, isConnected: true }
            : p
        )
      );
      
      setConnectionStatus(`Successfully connected with ${person.name} and sent message`);
    } catch (error) {
      setConnectionStatus('Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Find Your Sustainability Network
      </Typography>

      {/* LinkedIn Auth */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <LinkedInAuth onAuth={handleLinkedInAuth} isAuthenticated={isAuthenticated} />
      </Box>

      {/* Project Proposal Form */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Describe your sustainability idea or project"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Example: A super awesome community garden 20sq ft"
          required
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Charlotte"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="NC"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="USA"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="28202"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="35.2271"
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-80.8431"
              type="number"
              required
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Project Proposal'}
        </Button>
      </Box>

      {submitStatus && (
        <Alert severity={submitStatus.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {submitStatus}
        </Alert>
      )}

      {connectionStatus && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {connectionStatus}
        </Alert>
      )}

      {/* Results Grid */}
      <Grid container spacing={3}>
        {people.map((person) => (
          <Grid item xs={12} md={6} key={person.id}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {person.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {person.role} at {person.organization}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {person.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  {person.bio}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<LinkedInIcon />}
                  href={person.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </Button>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handlePersonClick(person)}
                >
                  Draft Message
                </Button>
                {person.isConnected && (
                  <Typography color="success.main">
                    ✓ Connected
                  </Typography>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Message Draft Dialog */}
      <Dialog
        open={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Draft Message for {selectedPerson?.name}
        </DialogTitle>
        <DialogContent>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {messageEdit}
            </Typography>
          </Paper>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="How would you like to modify this message?"
            value={editRequest}
            onChange={(e) => setEditRequest(e.target.value)}
            placeholder="Example: Make it more formal, focus on their expertise in renewable energy, or mention their recent project..."
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPerson(null)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleMessageUpdate}
            disabled={!editRequest}
          >
            Update Message
          </Button>
          {selectedPerson && !selectedPerson.isConnected && (
            <Button
              variant="contained"
              color="primary"
              startIcon={isConnecting ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={() => handleConnectAndSend(selectedPerson)}
              disabled={isConnecting || !isAuthenticated}
            >
              Connect & Send
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 