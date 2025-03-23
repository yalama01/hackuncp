import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SchoolIcon from '@mui/icons-material/School';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course';
  category: string;
  tags: string[];
  url: string;
  author: string;
  date: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Getting Started with Sustainable Projects',
    description: 'A comprehensive guide to launching your first sustainability initiative, including planning, stakeholder engagement, and measuring impact.',
    type: 'article',
    category: 'Getting Started',
    tags: ['Planning', 'Stakeholder Engagement', 'Impact Measurement'],
    url: 'https://example.com/getting-started-guide',
    author: 'Sarah Chen',
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Sustainable Project Management Best Practices',
    description: 'Learn the essential principles and methodologies for managing sustainability projects effectively.',
    type: 'video',
    category: 'Project Management',
    tags: ['Project Management', 'Methodology', 'Best Practices'],
    url: 'https://example.com/project-management-video',
    author: 'Michael Rodriguez',
    date: '2024-03-10',
  },
  {
    id: '3',
    title: 'Introduction to Circular Economy',
    description: 'An online course covering the fundamentals of circular economy principles and their application in business.',
    type: 'course',
    category: 'Education',
    tags: ['Circular Economy', 'Business', 'Sustainability'],
    url: 'https://example.com/circular-economy-course',
    author: 'Dr. Emily Thompson',
    date: '2024-03-01',
  },
  // Add more mock resources as needed
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = Array.from(new Set(mockResources.map((r) => r.category)));
  const allTags = Array.from(new Set(mockResources.flatMap((r) => r.tags)));

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    const matchesType = selectedTab === 0 || 
      (selectedTab === 1 && resource.type === 'article') ||
      (selectedTab === 2 && resource.type === 'video') ||
      (selectedTab === 3 && resource.type === 'course');
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <ArticleIcon />;
      case 'video':
        return <VideoLibraryIcon />;
      case 'course':
        return <SchoolIcon />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Resources & Guides
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search resources..."
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
        
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          sx={{ mt: 2, mb: 2 }}
        >
          <Tab label="All" />
          <Tab label="Articles" />
          <Tab label="Videos" />
          <Tab label="Courses" />
        </Tabs>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Resources Grid */}
      <Grid container spacing={3}>
        {filteredResources.map((resource) => (
          <Grid item xs={12} md={6} key={resource.id}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getResourceIcon(resource.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {resource.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  By {resource.author} • {new Date(resource.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" paragraph>
                  {resource.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resource.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resource
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Resources; 