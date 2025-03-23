import { Button, Box, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface LinkedInAuthProps {
  onAuth: () => void;
  isAuthenticated: boolean;
}

const LinkedInAuth = ({ onAuth, isAuthenticated }: LinkedInAuthProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {isAuthenticated ? (
        <Typography color="success.main">
          ✓ Connected to LinkedIn
        </Typography>
      ) : (
        <Button
          variant="outlined"
          startIcon={<LinkedInIcon />}
          onClick={onAuth}
          sx={{
            borderColor: '#0077B5',
            color: '#0077B5',
            '&:hover': {
              borderColor: '#0077B5',
              backgroundColor: 'rgba(0, 119, 181, 0.04)',
            },
          }}
        >
          Connect with LinkedIn
        </Button>
      )}
    </Box>
  );
};

export default LinkedInAuth; 