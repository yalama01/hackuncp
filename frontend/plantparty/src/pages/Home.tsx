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
  IconButton,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { motion } from 'framer-motion';
import Markdown from 'markdown-to-jsx';
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
  matchScore: number;
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
    matchScore: 92,
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
    matchScore: 78,
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
  const [isCooldown, setIsCooldown] = useState(false);

  // Custom Markdown options for styling
  const markdownOptions = {
    overrides: {
      h1: {
        component: Typography,
        props: {
          variant: 'h4',
          gutterBottom: true,
        },
      },
      h2: {
        component: Typography,
        props: {
          variant: 'h5',
          gutterBottom: true,
        },
      },
      h3: {
        component: Typography,
        props: {
          variant: 'h6',
          gutterBottom: true,
        },
      },
      p: {
        component: Typography,
        props: {
          variant: 'body2',
          paragraph: true,
        },
      },
    },
  };

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
    if (!idea || !addressInput) {
      setSubmitStatus('Please fill in all required fields');
      return;
    }

    if (isCooldown) {
      setSubmitStatus('Please wait before submitting again');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // First validate the location with Photon API
      const validationResponse = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(addressInput)}&limit=1`);
      const validationData = await validationResponse.json();

      if (!validationData.features || validationData.features.length === 0) {
        setSubmitStatus('Invalid location. Please select a location from the suggestions.');
        return;
      }

      const validatedPlace = validationData.features[0];
      const props = validatedPlace.properties || {};
      const lat = validatedPlace.geometry?.coordinates[1];
      const lng = validatedPlace.geometry?.coordinates[0];

      const proposal = {
        project_overview: idea,
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

      const response = await submitProjectProposal(proposal);
      
      // Check if response contains feedback
      if ('feedback' in response) {
        setSubmitStatus(response.feedback);
        setPeople([]);
      } else {
        // Handle people list response
        setSubmitStatus('Project proposal submitted successfully!');
        const transformedPeople = response.people_list.map((person, index) => ({
          id: index.toString(),
          name: person.name,
          role: person.current_job_title || 'Professional',
          organization: person.company_name || 'Organization',
          location: person.location || 'Location not specified',
          bio: person.bio || '',
          linkedinUrl: person.linkedin_url || '#',
          suggestedMessage: person.email_draft || 'Hello, I would like to connect regarding a sustainability project.',
          matchScore: person.score || 0,
        }));
        setPeople(transformedPeople);
      }
      
      // Start cooldown
      setIsCooldown(true);
      setTimeout(() => {
        setIsCooldown(false);
      }, 5000); // 5 seconds cooldown

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

  const getMatchColor = (score: number) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Grow Your Sustainability Network
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
          label="What's your sustainability idea?"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Example: Build a beautiful community garden to help broaden access to fresh produce, educate about sustainable farming practices, and create a green gathering space for our neighborhood."
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
          disabled={isSubmitting || isCooldown}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {isSubmitting ? 'Growing...' : isCooldown ? 'Please wait...' : 'Grow My Idea'}
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
          <Grid item xs={12} key={person.id}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  {/* Person Info Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h5">
                        {person.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Match Score: {person.matchScore}%
                        </Typography>
                        <Box sx={{ width: 40, height: 4, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                          <Box
                            sx={{
                              width: `${person.matchScore}%`,
                              height: '100%',
                              bgcolor: getMatchColor(person.matchScore),
                              transition: 'width 0.3s ease-in-out',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {person.role} at {person.organization}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {person.location}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Markdown options={markdownOptions}>
                        {person.bio}
                      </Markdown>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        startIcon={<LinkedInIcon />}
                        href={person.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Profile
                      </Button>
                      {person.isConnected && (
                        <Typography color="success.main" sx={{ display: 'inline-block', ml: 2 }}>
                          ✓ Connected
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Email Draft Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Suggested Message
                      </Typography>
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          value={person.suggestedMessage}
                          onChange={(e) => {
                            setPeople(prevPeople =>
                              prevPeople.map(p =>
                                p.id === person.id
                                  ? { ...p, suggestedMessage: e.target.value }
                                  : p
                              )
                            );
                          }}
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <IconButton
                          onClick={() => navigator.clipboard.writeText(person.suggestedMessage)}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                          }}
                          title="Copy to clipboard"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Message Draft Dialog */}
      <Dialog
        open={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            width: '100%',
            maxWidth: '500px',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedPerson?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedPerson?.role} at {selectedPerson?.organization}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedPerson?.matchScore}%
              </Typography>
              <Box sx={{ width: 60, height: 4, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${selectedPerson?.matchScore}%`,
                    height: '100%',
                    bgcolor: getMatchColor(selectedPerson?.matchScore || 0),
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Markdown options={markdownOptions}>
                {selectedPerson?.bio || ''}
              </Markdown>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Suggested Message
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={messageEdit}
                onChange={(e) => setMessageEdit(e.target.value)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <IconButton
                onClick={() => navigator.clipboard.writeText(messageEdit)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPerson(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
