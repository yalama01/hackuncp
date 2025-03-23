import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

const Navbar = () => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <LocalFloristIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
          }}
        >
          Fertilizer
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 