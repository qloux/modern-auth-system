import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  settings: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  stats: {
    tasksCompleted: number;
    tasksCreated: number;
    joinDate: string;
  };
}

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileData, setProfileData] = useState<UserProfile>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User'),
    settings: {
      notifications: true,
      darkMode: false,
      language: i18n.language,
    },
    stats: {
      tasksCompleted: 0,
      tasksCreated: 0,
      joinDate: new Date().toISOString(),
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(t('profile.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updatedData = {
        name: profileData.name,
        settings: {
          notifications: profileData.settings.notifications,
          language: profileData.settings.language,
          darkMode: profileData.settings.darkMode
        }
      };
      await updateUserProfile(updatedData);
      setSuccess(t('profile.saveSuccess'));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    setProfileData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        language: newLang,
      },
    }));
  };

  const handleThemeToggle = () => {
    setProfileData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        darkMode: !prev.settings.darkMode,
      },
    }));
    toggleTheme();
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError(t('profile.passwordMismatch'));
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await userAPI.updatePassword(oldPassword, newPassword);
      setSuccess(t('profile.passwordChanged'));
      setShowPasswordDialog(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setError(t('profile.passwordChangeError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      setError(null);
      await userAPI.deleteAccount();
      // The API service will remove the token
      window.location.href = '/login';
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(t('profile.deleteError'));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Container maxWidth="lg" className="profile-container">
          <Card className="profile-card">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Skeleton variant="circular" width={100} height={100} />
                <Box sx={{ ml: 3, flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="40%" height={24} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={400} />
            </Paper>
          </Card>
        </Container>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="page-container">
      <Container maxWidth="lg" className="profile-container">
        <Card className="profile-card">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Paper elevation={3} sx={{ 
            p: 3, 
            borderRadius: 2,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={profileData.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  mr: 3,
                  border: '4px solid',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {profileData.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {profileData.email}
                </Typography>
              </Box>
              <IconButton 
                onClick={handleEditToggle} 
                color="primary"
                sx={{
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                  },
                }}
              >
                {isEditing ? <CancelIcon /> : <EditIcon />}
              </IconButton>
            </Box>

            {/* Stats Section */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">{t('profile.stats.tasksCompleted')}</Typography>
                    <Typography variant="h3">{profileData.stats.tasksCompleted}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: 'secondary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">{t('profile.stats.tasksCreated')}</Typography>
                    <Typography variant="h3">{profileData.stats.tasksCreated}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: 'success.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">{t('profile.stats.memberSince')}</Typography>
                    <Typography variant="h6">
                      {new Date(profileData.stats.joinDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Personal Information */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
              {t('profile.personalInfo')}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('profile.name')}
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  disabled
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Settings Cards */}
            <Grid container spacing={3}>
              {/* Notifications */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%',
                  background: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <NotificationsIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="h6" color="primary">
                        {t('profile.notifications')}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.settings.notifications}
                          onChange={() =>
                            setProfileData({
                              ...profileData,
                              settings: {
                                ...profileData.settings,
                                notifications: !profileData.settings.notifications,
                              },
                            })
                          }
                          disabled={!isEditing}
                        />
                      }
                      label={t('profile.enableNotifications')}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Theme */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%',
                  background: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaletteIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {t('profile.theme')}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isDarkMode}
                          onChange={handleThemeToggle}
                          color="primary"
                        />
                      }
                      label={t('profile.darkMode')}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Language */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%',
                  background: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LanguageIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="h6" color="primary">
                        {t('profile.language')}
                      </Typography>
                    </Box>
                    <TextField
                      select
                      fullWidth
                      value={profileData.settings.language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      disabled={!isEditing}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                    </TextField>
                  </CardContent>
                </Card>
              </Grid>

              {/* Security */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%',
                  background: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {t('profile.security')}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      onClick={() => setShowPasswordDialog(true)}
                      sx={{ 
                        mb: 2,
                        fontWeight: 500,
                        width: '100%',
                      }}
                    >
                      {t('profile.changePassword')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setShowDeleteDialog(true)}
                      sx={{ 
                        width: '100%',
                        fontWeight: 500,
                      }}
                    >
                      {t('profile.deleteAccount')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
              <DialogTitle sx={{ fontWeight: 600 }}>{t('profile.changePassword')}</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label={t('profile.oldPassword')}
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label={t('profile.newPassword')}
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label={t('profile.confirmPassword')}
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowPasswordDialog(false)} color="inherit">
                  {t('common.cancel')}
                </Button>
                <Button onClick={handlePasswordChange} color="primary" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : t('common.save')}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
              <DialogTitle sx={{ fontWeight: 600, color: 'error.main' }}>
                {t('profile.deleteAccountConfirm')}
              </DialogTitle>
              <DialogContent>
                <Typography>
                  {t('profile.deleteAccountWarning')}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowDeleteDialog(false)} color="inherit">
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleDeleteAccount} color="error" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : t('profile.deleteAccount')}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Save Button */}
            {isEditing && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ mr: 2 }}
                >
                  {saving ? t('common.saving') : t('common.save')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditToggle}
                  disabled={saving}
                  startIcon={<CancelIcon />}
                >
                  {t('common.cancel')}
                </Button>
              </Box>
            )}
          </Paper>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
