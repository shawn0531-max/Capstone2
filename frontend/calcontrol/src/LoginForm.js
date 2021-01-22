import axios from 'axios';
import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Fade, Alert} from 'reactstrap';
import jwt from 'jsonwebtoken';
import NavBar from './NavBar';
import './LoginForm.css';

const DBAPI = 'http://localhost:5000'

/** Form for user to login **/
const LoginForm = () => {

    // set empty initial state for the form, sets up useHistory
    const INITIAL_STATE = {username:"", password:""};
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState(null);
    const history = useHistory();

    // updates info in form inputs
    const handleChange = e => {
        const {name, value} = e.target;
        
        setFormData(formData => ({
            ...formData,
            [name]:value
        }));
    };

    
    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            let token = await axios.post(`${DBAPI}/user/login`,{
                "username": formData.username,
                "password": formData.password
            });
            // resets form to initial values
            setFormData(INITIAL_STATE);
            // sends user to profile page
            sessionStorage.setItem('token', token.data.token);
            let user = jwt.decode(token.data.token);
            let name = user.username;
            history.push(`/user/${name}/profile`);
        } catch (err) {
            setError('Incorrect username/password combination. Please try again.')
            setTimeout(()=>{
                setError(null);
                setFormData(INITIAL_STATE);
            }, 2000)
        }


    };

  return (
    <>
    <NavBar />
    <div className='loginform col-md-4'>
        <Form onSubmit={handleSubmit}>
        <FormGroup>
            <Label className='loginform-label' htmlFor="username">Username</Label>
            <Input autoFocus={true} type="text" name="username" id="username" onChange={handleChange} placeholder="Username" value={formData.username}/>
        </FormGroup>
        <FormGroup>
            <Label className='loginform-label' htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" onChange={handleChange} placeholder="***********" value={formData.password} />
        </FormGroup>  
        <Button className='loginform-btn'>Log In</Button>
        </Form>
        <br></br>
    </div>
        {error === null ? null : 
        <Fade in={error}>
            <Alert className='loginform-alert col-md-4' color='danger'>{error}</Alert>
        </Fade>
        }
    </>
  );
}

export default LoginForm;