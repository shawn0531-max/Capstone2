import axios from 'axios';
import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import jwt from 'jsonwebtoken';
import NavBar from './NavBar';

const DBAPI = 'http://localhost:5000'

const SignupForm = () => {

    // set empty initial state for the form, sets up useHistory
    const INITIAL_STATE = {username:"", password:"", email:""};
    const [formData, setFormData] = useState(INITIAL_STATE);
    const history = useHistory();

    // updates info in form inputs
    const handleChange = e => {
        const {name, value} = e.target;
        
        setFormData(formData => ({
            ...formData,
            [name]:value
        }));
    };

    // on submit updates snacks/drinks in DB, then uses setDrinks/setSnacks depending on which is selected on form
    const handleSubmit = async(e) => {
        e.preventDefault();

        let token = await axios.post(`${DBAPI}/user/signup`,{
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
    };

  return (
    <>
    <NavBar />
    <div className='itemform col-md-4'>
        <Form onSubmit={handleSubmit}>
        <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input autoFocus={true} type="text" name="username" id="username" onChange={handleChange} placeholder="Username" value={formData.username}/>
        </FormGroup>
        <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" onChange={handleChange} placeholder="***********" value={formData.password} />
        </FormGroup>
        <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input type="text" name="email" id="email" onChange={handleChange} placeholder="example@test.com" value={formData.email} />
        </FormGroup>  
        <Button>Sign Up</Button>
        </Form>
    </div>
    </>
  );
}

export default SignupForm;