import { useState, useRef, useEffect } from 'react';
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
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EditIcon from '@mui/icons-material/Edit';
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
  
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [messageEdit, setMessageEdit] = useState('');
  const [editRequest, setEditRequest] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  // ────────────────────────────────────────────────────────────────────────────
  //  Fetch suggestions from Photon
  //    - Called whenever the user types in the address text field
  // ────────────────────────────────────────────────────────────────────────────
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      // Example: limit=5 => at most 5 suggestions
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching suggestions from Photon:', error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (feature: any) => {
    setSelectedPlace(feature);
    
    // You might want to show the full address in the TextField
    const placeName = feature?.properties?.name || '';
    const city = feature?.properties?.city || '';
    const state = feature?.properties?.state || '';
    const country = feature?.properties?.country || '';
    
    // Combine them into a user-friendly string
    const fullAddress = [placeName, city, state, country].filter(Boolean).join(', ');
    setAddressInput(fullAddress);

    // Clear suggestions after selection
    setSuggestions([]);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInput(value);
    fetchSuggestions(value);
  };

  const handleSubmit = async () => {
    if (!idea || !selectedPlace) {
      setSubmitStatus('Please fill in all required fields');
      return;
    }

    // Parse location components from Photon response
    const props = selectedPlace?.properties || {};
    const lat = selectedPlace?.geometry?.coordinates[1];
    const lng = selectedPlace?.geometry?.coordinates[0];

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const proposal = {
        event_summary: idea,
        location: {
          city: props.city || '',
          state: props.state || '',
          country: props.country || '',
          postal_code: props.postcode || '',
          coordinates: {
            latitude: lat || 0,
            longitude: lng || 0,
          },
        },
      };

      await submitProjectProposal(proposal);
      setSubmitStatus('Project proposal submitted successfully!');
      setPeople(mockPeople);
    } catch (error) {
      console.error('Error submitting project proposal:', error);
      setSubmitStatus('Failed to submit project proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    // Simulating LinkedIn OAuth flow
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
      // Simulate an API call to connect and send a message
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

  // Handler for opening the dialog and prepping the message
  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setMessageEdit(person.suggestedMessage);
    setEditRequest('');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Find Your Sustainability Network
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <LinkedInAuth onAuth={handleLinkedInAuth} isAuthenticated={isAuthenticated} />
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
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

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            label="Search Address (via Photon)"
            placeholder="Type an address or place..."
            value={addressInput}
            onChange={handleAddressChange}
          />

          {/* Display suggestions in a simple dropdown */}
          {suggestions.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                zIndex: 999,
                width: '100%',
                maxHeight: 300,
                overflowY: 'auto',
              }}
              elevation={3}
            >
              {suggestions.map((feature, index) => {
                const props = feature.properties;
                const displayName = [
                  props.name,
                  props.city,
                  props.state,
                  props.country
                ]
                  .filter(Boolean)
                  .join(', ');
                return (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      borderBottom: '1px solid #ddd',
                      cursor: 'pointer',
                      ':hover': { backgroundColor: '#f0f0f0' },
                    }}
                    onClick={() => handleSelectSuggestion(feature)}
                  >
                    {displayName}
                  </Box>
                );
              })}
            </Paper>
          )}
        </Box>

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
        <Alert
          severity={submitStatus.includes('success') ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
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
              borderRadius: 1,
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
            placeholder="Example: Make it more formal, focus on their expertise in renewable energy..."
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
