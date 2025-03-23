import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { motion } from 'framer-motion';

interface UserProfile {
  name: string;
  role: string;
  organization: string;
  bio: string;
  interests: string[];
  skills: string[];
  linkedinUrl: string;
  email: string;
  notifications: {
    newConnections: boolean;
    resourceUpdates: boolean;
    projectUpdates: boolean;
  };
}

const mockProfile: UserProfile = {
  name: 'John Doe',
  role: 'Sustainability Manager',
  organization: 'EcoTech Solutions',
  bio: 'Passionate about creating sustainable solutions for businesses. Currently leading initiatives in renewable energy and waste reduction.',
  interests: ['Renewable Energy', 'Waste Management', 'Circular Economy'],
  skills: ['Project Management', 'Stakeholder Engagement', 'Environmental Impact Assessment'],
  linkedinUrl: 'https://linkedin.com/in/john-doe',
  email: 'john.doe@ecotech.com',
  notifications: {
    newConnections: true,
    resourceUpdates: true,
    projectUpdates: false,
  },
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockProfile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleNotificationToggle = (key: keyof UserProfile['notifications']) => {
    setEditedProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    size="small"
                  />
                ) : (
                  profile.name
                )}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedProfile.role}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({ ...prev, role: e.target.value }))
                    }
                    size="small"
                  />
                ) : (
                  `${profile.role} at ${profile.organization}`
                )}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<LinkedInIcon />}
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                >
                  View LinkedIn Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Profile Information</Typography>
                {!isEditing ? (
                  <Tooltip title="Edit Profile">
                    <IconButton onClick={handleEdit}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Box>
                    <Button onClick={handleCancel} sx={{ mr: 1 }}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    value={isEditing ? editedProfile.bio : profile.bio}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organization"
                    value={isEditing ? editedProfile.organization : profile.organization}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({ ...prev, organization: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Interests and Skills */}
              <Typography variant="h6" gutterBottom>
                Interests & Skills
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedProfile.interests.join(', ')}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          interests: e.target.value.split(',').map((i) => i.trim()),
                        }))
                      }
                      helperText="Separate interests with commas"
                    />
                  ) : (
                    profile.interests.map((interest) => (
                      <Chip key={interest} label={interest} color="primary" />
                    ))
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedProfile.skills.join(', ')}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          skills: e.target.value.split(',').map((s) => s.trim()),
                        }))
                      }
                      helperText="Separate skills with commas"
                    />
                  ) : (
                    profile.skills.map((skill) => (
                      <Chip key={skill} label={skill} variant="outlined" />
                    ))
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Notification Settings */}
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={editedProfile.notifications.newConnections}
                    onChange={() => handleNotificationToggle('newConnections')}
                    disabled={!isEditing}
                  />
                }
                label="New Connection Requests"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editedProfile.notifications.resourceUpdates}
                    onChange={() => handleNotificationToggle('resourceUpdates')}
                    disabled={!isEditing}
                  />
                }
                label="Resource Updates"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editedProfile.notifications.projectUpdates}
                    onChange={() => handleNotificationToggle('projectUpdates')}
                    disabled={!isEditing}
                  />
                }
                label="Project Updates"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 