import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { motion } from 'framer-motion';

interface Connection {
  id: string;
  name: string;
  role: string;
  organization: string;
  interests: string[];
  bio: string;
  linkedinUrl: string;
}

const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Sustainability Director',
    organization: 'GreenTech Solutions',
    interests: ['Renewable Energy', 'Circular Economy', 'Carbon Reduction'],
    bio: 'Leading sustainability initiatives and helping organizations transition to greener practices.',
    linkedinUrl: 'https://linkedin.com/in/sarah-chen',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Environmental Consultant',
    organization: 'EcoConsult',
    interests: ['Waste Management', 'Sustainable Agriculture', 'Water Conservation'],
    bio: 'Specializing in sustainable agriculture and water resource management.',
    linkedinUrl: 'https://linkedin.com/in/michael-rodriguez',
  },
  // Add more mock connections as needed
];

const Network = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const allInterests = Array.from(
    new Set(mockConnections.flatMap((conn) => conn.interests))
  );

  const filteredConnections = mockConnections.filter((connection) => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesInterests = selectedInterests.length === 0 ||
      selectedInterests.every((interest) => connection.interests.includes(interest));
    
    return matchesSearch && matchesInterests;
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Find Your Sustainability Network
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, organization, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {allInterests.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              onClick={() => toggleInterest(interest)}
              color={selectedInterests.includes(interest) ? 'primary' : 'default'}
              variant={selectedInterests.includes(interest) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Connections Grid */}
      <Grid container spacing={3}>
        {filteredConnections.map((connection) => (
          <Grid item xs={12} md={6} key={connection.id}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {connection.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {connection.role} at {connection.organization}
                </Typography>
                <Typography variant="body2" paragraph>
                  {connection.bio}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {connection.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<LinkedInIcon />}
                  href={connection.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </Button>
                <Button variant="contained" color="primary">
                  Connect
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Network; 