'use client';

// React Imports
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import Logo from '@/components/layout/shared/Logo'

// Config Imports
import themeConfig from '@/configs/themeConfig'

// Axios Import
import axios from 'axios'
import Cookies from 'js-cookie';
import api, { initializeCsrf } from '../app/utils/api';

type FormData = {
  email: string
  password: string
}

const initialFormData: FormData = {
  email: '',
  password: ''
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const router = useRouter()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        payload,
        { withCredentials: true }
      );
      
      const {
        message,
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        access_token,
      } = response.data;

      const userData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        access_token,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setSuccessMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div className='min-h-screen flex bg-cover bg-center bg-no-repeat' style={{ backgroundImage: 'url(/images/eyeglasses.jpeg)' }}>
      <div className='w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-6 bg-black bg-opacity-50'>
        <Card className='w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden transform transition-all hover:shadow-3xl hover:-translate-y-1'>
          <CardContent className='p-8 sm:p-10'>
            <div className='flex flex-col items-center mb-8'>
              <Link href='/' className='mb-6'>
                <Logo />
              </Link>
              <Typography variant='h4' className='text-2xl font-bold text-gray-800 text-center'>
                Welcome to {themeConfig.templateName}
              </Typography>
              <Typography variant='body2' className='mt-2 text-gray-600 text-center'>
                Please sign in to continue
              </Typography>
            </div>
            
            {errorMessage && (
              <div className='mb-4 p-3 bg-red-50 rounded-lg border border-red-200'>
                <Typography className='text-red-600'>{errorMessage}</Typography>
              </div>
            )}
            
            {successMessage && (
              <div className='mb-4 p-3 bg-green-50 rounded-lg border border-green-200'>
                <Typography className='text-green-600'>{successMessage}</Typography>
              </div>
            )}
            
            <form onSubmit={handleLogin} className='space-y-5'>
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
                variant='outlined'
                className='rounded-lg'
                InputProps={{
                  className: 'bg-white',
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-mail-line text-gray-400' />
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label='Password'
                type={isPasswordShown ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleFormChange('password', e.target.value)}
                variant='outlined'
                className='rounded-lg'
                InputProps={{
                  className: 'bg-white',
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-lock-line text-gray-400' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        className='text-gray-400 hover:text-gray-600'
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <div className='flex items-center justify-between'>
                <FormControlLabel
                  control={<Checkbox color='primary' />}
                  label='Remember me'
                  className='text-gray-600'
                />
                <Link 
                  href='/forgot-password' 
                  className='text-sm text-blue-600 hover:text-blue-800 transition-colors'
                >
                  Forgot password?
                </Link>
              </div>
              
              <Button
                fullWidth
                size='large'
                variant='contained'
                type='submit'
                disabled={isLoading}
                className='h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md transition-all duration-300'
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} color='inherit' thickness={5} className='mr-2' />
                    Signing In...
                  </>
                ) : 'Sign In'}
              </Button>
            </form>
            
            <div className='mt-6 text-center'>
              <Typography variant='body2' className='text-gray-600'>
                Don't have an account?{' '}
                <Link 
                  href='/register' 
                  className='text-blue-600 hover:text-blue-800 font-medium transition-colors'
                >
                  Create one
                </Link>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login