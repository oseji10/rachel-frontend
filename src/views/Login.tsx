'use client'

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
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Mode } from '@/@core/types'

// Component Imports
import Logo from '@/components/layout/shared/Logo'
import Illustrations from '@/components/Illustrations'

// Config Imports
import themeConfig from '@/configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import axios from 'axios';


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

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  // const authBackground = useImageVariant(lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push('/')
  }

  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  const login = async (e) => {
    e.preventDefault()
    const payload = {
      email: formData.email,
      password: formData.password
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )
  
      setFormData(initialFormData); 
      localStorage.setItem('authToken', response.data.token);
      router.push('/dashboard')
      return response.data.user;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/about' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography className='mbs-1'>Please sign-in to your account with your email and password</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={login} className='flex flex-col gap-5'>
              <TextField 
              autoFocus 
              fullWidth 
              label='Email'
              value={formData.email}
              onChange={e => handleFormChange('email', e.target.value)}
              />
              <TextField
                fullWidth
                label='Password'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleFormChange('password', e.target.value)}
                InputProps={{
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
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit'>
                Log In
              </Button>
              {/* <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography component={Link} href='/register' color='primary'>
                  Create an account
                </Typography>
              </div> */}
              {/* <Divider className='gap-3'>or</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div> */}
            </form>
          </div>
        </CardContent>
      </Card>
      {/* <Illustrations/> */}
    </div>
  )
}

export default Login
