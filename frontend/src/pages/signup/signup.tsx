import React, {useEffect, useContext, useState} from 'react';
import useFields from '../../hooks/useFields'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext'
import { Box, TextField, Button, Typography } from '@mui/material';
// import './Signup.css'
import { SignupFormDataType } from '../../types/types';

type SignupProps = {
  handleSignup: (formData: SignupFormDataType) => Promise<{ success: boolean; errors?: string[] }>;
}

const Signup: React.FC<SignupProps> = ({handleSignup}) => {
  
  const userContext = useContext(UserContext);

  // Check if userContext is not null before accessing currentUser
  if (!userContext) {
    // Handle the case where userContext is null
    console.error("UserContext is not available.");
    return null; // or handle this scenario appropriately
  }

  const { currentUser } = userContext;
    const navigate = useNavigate()
    const [formErrors, setFormErrors] = useState<string[]>([]); // Define the type of formErrors
    const initialValue = {
                            firstName:"Harper",
                            lastName:"Chung",
                            password:"harper123",
                            email:"harper@human.com",
                            role: "Marketing Manager"
                        }


    const [formData, handleChange, resetFormData ] = useFields(initialValue)

  /******************************************************************************************************
    Handle redirecting to homepage if currentUser
  *******************************************************************************************************/
    useEffect(()=> {if(currentUser) navigate("/")}) 

  /******************************************************************************************************
    Handle submitting signup form
  *******************************************************************************************************/
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = await handleSignup(formData);
      if (result.success) {
          navigate('/');
      } else {
          setFormErrors(result.errors || []);
      }
  }

  return (
    <Box className="Signup" sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h3" component="h3" className="Signup-heading" sx={{ mb: 2 }}>
        Sign Up
      </Typography>
      <Box component="form" className="Signup-form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          label="First Name"
          name="firstName"
          type="text"
          onChange={handleChange}
          value={formData.firstName || ''}
          fullWidth
          margin="normal"          
        />
        <TextField
          label="Last Name"
          name="lastName"
          type="text"
          onChange={handleChange}
          value={formData.lastName || ''}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="text"
          onChange={handleChange}
          value={formData.email || ''}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Role"
          name="role"
          type="text"
          onChange={handleChange}
          value={formData.role || ''}
          fullWidth
          margin="normal"
        />
         <TextField
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password || ''}
          fullWidth
          margin="normal"
        />
        {formErrors.length > 0 && (
          <Box color="red" sx={{ my: 2 }}>
            {formErrors.map((error, idx) => (
              <Typography key={idx} variant="body2">{error}</Typography>
            ))}
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, mb: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );

}

export default Signup;