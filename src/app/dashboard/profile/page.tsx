'use client';

// React Imports
import { useEffect, useState } from 'react';

// MUI Imports
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Axios Import
import axios from 'axios';
import Cookies from 'js-cookie';


type FormData = {
  
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
}

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword_confirmation, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [selectedUser, setSelectedUser] = useState();

  const handleToggleVisibility = (field) => {
    if (field === 'current') setShowCurrentPassword((prev) => !prev);
    if (field === 'new') setShowNewPassword((prev) => !prev);
    if (field === 'confirm') setShowConfirmPassword((prev) => !prev);
  };


  useEffect(() => {
    const fetchUser= async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/change-password`);
        setSelectedUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments data.');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const token = Cookies.get('authToken');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== newPassword_confirmation) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/change-password`,
        {
          currentPassword,
          newPassword,
          newPassword_confirmation
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      <Card className="max-w-md w-full">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Update Profile
          </Typography>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              fullWidth
              type='text'
              label="First Name"
              value={selectedUser.firstName}
          onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
       
            />
            <TextField
              fullWidth
              type='text'
              label="Last Name"
              value={selectedUser.lastName}
          onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
       
            />

<TextField
              fullWidth
              type='text'
              label="Email"
              value={selectedUser.email}
          onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
       
            />

<TextField
              fullWidth
              type='text'
              label="Phone Number"
              value={selectedUser.phoneNumber}
          onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
       
            />

<TextField
              fullWidth
              type={showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleVisibility('current')}>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleVisibility('new')}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              value={newPassword_confirmation}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleVisibility('confirm')}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
