'use client';

// React Imports
import { useState } from 'react'
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    await initializeCsrf();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/login`, payload);
  
      const data = response.data;
  
      if (data) {
        Cookies.set('authToken', data.token, { secure: true, sameSite: 'strict' });
        Cookies.set('role', data.user.role, { secure: true, sameSite: 'strict' });
        Cookies.set('name', response.data.user.firstName + ' ' + response.data.user.lastName)
        Cookies.set('firstName', response.data.user.firstName);
        Cookies.set('lastName', response.data.user.lastName);
        Cookies.set('phoneNumber', response.data.user.phoneNumber);
        
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex bg-cover bg-center bg-no-repeat' style={{ backgroundImage: 'url(/images/eyeglasses.jpeg)' }}>
      <div className='w-full md:w-1/2 flex items-center justify-end p-6 bg-black bg-opacity-50'>
        <Card className='w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden'>
          <CardContent className='p-8 sm:p-12'>
            <Link href='/' className='flex justify-center items-center mb-8'>
              <Logo />
            </Link>
            <div className='flex flex-col gap-6'>
              <div>
                <Typography variant='h3' className='text-3xl font-bold text-gray-800'>
                  {/* {`Welcome to ${themeConfig.templateName}! 👋`} */}
                </Typography>
                <Typography className='mt-2 text-gray-600'>
                  Sign in with your email and password
                </Typography>
              </div>
              {errorMessage && <Typography className='text-red-500 bg-red-100 p-3 rounded'>{errorMessage}</Typography>}
              {successMessage && <Typography className='text-green-500 bg-green-100 p-3 rounded'>{successMessage}</Typography>}
              <form noValidate autoComplete='off' onSubmit={handleLogin} className='flex flex-col gap-6'>
                <TextField
                  autoFocus
                  fullWidth
                  label='Email'
                  value={formData.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  variant='outlined'
                  className='rounded-lg'
                  InputProps={{
                    className: 'bg-white'
                  }}
                />
                <TextField
                  fullWidth
                  label='Password'
                  id='outlined-adornment-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => handleFormChange('password', e.target.value)}
                  variant='outlined'
                  className='rounded-lg'
                  InputProps={{
                    className: 'bg-white',
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <div className='flex justify-between items-center flex-wrap gap-4'>
                  <FormControlLabel
                    control={<Checkbox color='primary' />}
                    label='Remember me'
                    className='text-gray-700'
                  />
                  <Typography
                    component={Link}
                    href='/forgot-password'
                    className='text-blue-600 hover:text-blue-800 transition-colors'
                  >
                    Forgot password?
                  </Typography>
                </div>
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  disabled={isLoading}
                  className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg shadow-md transition-all duration-300'
                  startIcon={isLoading && <CircularProgress size={20} />}
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='hidden md:block w-1/2 bg-gradient-to-b from-transparent to-black/50'></div>
    </div>
  )
}

export default Login