import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { motion } from 'framer-motion';

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
}

const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Initial Connection',
    category: 'Networking',
    template: 'Hi {name}, I noticed your work in {interest} and would love to connect about potential collaboration opportunities.',
  },
  {
    id: '2',
    name: 'Project Partnership',
    category: 'Collaboration',
    template: 'Hello {name}, I\'m working on a {projectType} project and would value your expertise in {expertise}. Would you be interested in discussing potential partnership?',
  },
  {
    id: '3',
    name: 'Resource Sharing',
    category: 'Support',
    template: 'Hi {name}, I saw your recent post about {topic} and thought you might find this resource helpful: {resource}. Let me know if you\'d like to discuss further!',
  },
];

const MessageDraft = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [recipientOrg, setRecipientOrg] = useState('');
  const [projectType, setProjectType] = useState('');
  const [expertise, setExpertise] = useState('');
  const [topic, setTopic] = useState('');
  const [resource, setResource] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const generateMessage = () => {
    let message = selectedTemplate
      ? mockTemplates.find((t) => t.id === selectedTemplate)?.template || ''
      : customMessage;

    // Replace placeholders with actual values
    message = message
      .replace('{name}', recipientName)
      .replace('{interest}', topic)
      .replace('{projectType}', projectType)
      .replace('{expertise}', expertise)
      .replace('{topic}', topic)
      .replace('{resource}', resource);

    setGeneratedMessage(message);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Craft Your Message
      </Typography>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Message Details
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Message Template</InputLabel>
              <Select
                value={selectedTemplate}
                label="Message Template"
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <MenuItem value="">Custom Message</MenuItem>
                {mockTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!selectedTemplate && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Custom Message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Recipient Role"
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Recipient Organization"
              value={recipientOrg}
              onChange={(e) => setRecipientOrg(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Project Type"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Resource"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={generateMessage}
              sx={{ mb: 2 }}
            >
              Generate Message
            </Button>
          </Paper>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{ p: 3, height: '100%' }}
          >
            <Typography variant="h6" gutterBottom>
              Generated Message
            </Typography>

            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                minHeight: '200px',
                position: 'relative',
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {generatedMessage || 'Your generated message will appear here...'}
              </Typography>

              {generatedMessage && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Tooltip title="Copy to clipboard">
                    <IconButton onClick={copyToClipboard} size="small">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open in LinkedIn">
                    <IconButton
                      href="https://www.linkedin.com/messaging"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessageDraft; 