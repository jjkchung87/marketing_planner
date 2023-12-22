import React, {useState, useEffect, useContext} from 'react';
import useFields from '../../hooks/useFields'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { Button, Form, Message} from 'semantic-ui-react'

const Login = ({handleLogin}) => {

    const {currentUser} = useContext(UserContext) 
    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate()
    const initialValue = {
                            email:"harper3@human.com",
                            password:"harper123"
                        }

    const [formData, handleChange, resetFormData ] = useFields(initialValue)

  /******************************************************************************************************
    Console log form data and form errors
  *******************************************************************************************************/
    console.debug(
      "LoginForm",
      "login=", typeof login,
      "formData=", formData,
      "formErrors", formErrors,
  );
  
  /******************************************************************************************************
    Handle redirecting to homepage if currentUser
  *******************************************************************************************************/
    useEffect(()=> {if(currentUser) navigate("/")}) 

  /******************************************************************************************************
    Handle submitting login form
  *******************************************************************************************************/

    const handleSubmit = async (e) => {
        e.preventDefault()
        let result = await handleLogin(formData)
        if (result.success) {
        navigate('/')
        } else {
          setFormErrors(result.errors);
        }
    }

    return (
        <div className="Login">
            <h3 className="Login-header">Login</h3>
            <Form className="Login-form" onSubmit={handleSubmit}>
            <Form.Input
                    label="Email"
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    fluid
                />
                <Form.Input
                    label="Password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    fluid
                />
                  {formErrors.length
                    ? <Message color="red" content={formErrors} />
                    : null}
              <Button primary type='submit'>Submit</Button>
          </Form>
        </div>
    )

}

export default Login;