import axios from 'axios';
import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert, Fade} from 'reactstrap';
import jwt from 'jsonwebtoken';
import NavBar from './NavBar';
import './SignupForm.css';

const DBAPI = 'http://localhost:5000'

/** Form for user to register and input email and password **/
const SignupForm = () => {

    // set empty initial state for the form, sets up useHistory
    const INITIAL_STATE = {username:"", password:"", email:""};
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState(false);
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
        let token;
        try {
            token = await axios.post(`${DBAPI}/user/signup`,{
                "username": formData.username,
                "password": formData.password,
                "email": formData.email
            });
                    // resets form to initial values
            setFormData(INITIAL_STATE);
            // sends user to BMR calculation form
            sessionStorage.setItem('token', token.data.token);
            let user = jwt.decode(token.data.token);
            let name = user.username;
            history.push(`/user/${name}/BMR`);
        } catch (err) {
            setError('Username already in use. Please choose a different username.')
            setTimeout(()=>{
                setError(null);
                setFormData(INITIAL_STATE);
            }, 2000)
        }
    };

  return (
    <>
    <NavBar />
    <div className='formSignup-div col-md-4'>
        <Form className='formSignup' onSubmit={handleSubmit}>
        <FormGroup>
            <Label className='itemform-signup-label' htmlFor="username">Username</Label>
            <Input autoFocus={true} type="text" name="username" id="username" onChange={handleChange} placeholder="Username" value={formData.username}/>
        </FormGroup>
        <FormGroup>
            <Label className='itemform-signup-label' htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" onChange={handleChange} placeholder="***********" value={formData.password} />
        </FormGroup>
        <FormGroup>
            <Label className='itemform-signup-label' htmlFor="email">Email</Label>
            <Input type="text" name="email" id="email" onChange={handleChange} placeholder="example@test.com" value={formData.email} />
        </FormGroup>  
        <Button className='itemform-signup-btn'>Sign Up</Button>
        </Form>
        <br></br>
    </div>
        {error === null ? null : 
        <Fade in={error}>
            <Alert className='formSignup-alert col-md-4' color='warning'>{error}</Alert>
        </Fade>
        }
    </>
  );
}

export default SignupForm;