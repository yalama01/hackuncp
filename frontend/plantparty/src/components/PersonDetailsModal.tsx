import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

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

interface PersonDetailsModalProps {
  person: Person | null;
  open: boolean;
  onClose: () => void;
  onMessageUpdate: (message: string) => void;
}

const PersonDetailsModal = ({ person, open, onClose, onMessageUpdate }: PersonDetailsModalProps) => {
  const [message, setMessage] = useState(person?.suggestedMessage || '');

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = event.target.value;
    setMessage(newMessage);
    onMessageUpdate(newMessage);
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  if (!person) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" component="div">
            {person.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Match: {person.matchScore}%
            </Typography>
            <Box sx={{ width: 60, height: 6, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
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
        <Typography variant="subtitle1" color="text.secondary">
          {person.role} at {person.organization}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
            {person.bio}
          </Typography>
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
              value={message}
              onChange={handleMessageChange}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Tooltip title="Copy message">
              <IconButton
                onClick={handleCopyMessage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonDetailsModal; 