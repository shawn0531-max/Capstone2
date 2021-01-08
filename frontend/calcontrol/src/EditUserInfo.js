import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, updateUser } from './actions';
import { Form, FormGroup, Label, Input, Button, Row } from 'reactstrap';

const EditUserInfo = () =>{

    const INITAIL_STATE = {oldPass: "", newPass: "", confirmNewPass: "", newEmail: "", confirmNewEmail: ""}
    const dispatch = useDispatch();
    const {username} = useParams();
    const [formData, setFormData] = useState(INITAIL_STATE);
    const history = useHistory();

    useEffect(() =>{
        dispatch(getUserInfo(username));
    }, [dispatch, username])

    const {user} = useSelector(store => store.user);

    const handleChange = (e) =>{
        const {name, value} = e.target;

        setFormData(formData =>({
            ...formData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(formData.oldPass === ""){
            alert('Please enter your old password')
        } else if(formData.confirmNewPass === ""){
            alert('Please confirm your new password')
        } else if(formData.confirmNewEmail === ""){
            alert('Please confirm your new email')
        } else if(formData.newEmail !== formData.confirmNewEmail){
            alert('Both email entries must match')
        } else if(formData.newPass !== formData.confirmNewPass){
            alert('Both new password entries must match')
        } else {
            let resp = await updateUser(username, formData.oldPass, formData.confirmNewPass, formData.confirmNewEmail);
            if(resp.data.status === 401){
                alert(resp.data.message);
            } else {
                history.push(`/user/${username}/profile`);
            }
        }
    }

    const handleBack = () =>{
        history.goBack();
    }
    return(
        <div className='col-xs-12 col-md-8 col-lg-6 col-xl-6'>
        {user.username ? <h5>{user.username}</h5> : null}
        <Form onSubmit={handleSubmit}>
            <Row>
                <FormGroup>
                    <Label for="newEmail">New Email</Label>
                    <Input type="email" name="newEmail" id="newEmail" placeholder={user.email ? user.email : "user@test.com"} 
                    onChange={handleChange} value={formData.newEmail}/>
                </FormGroup>
                <FormGroup>
                    <Label for="confirmNewEmail">Confirm New Email</Label>
                    <Input type="email" name="confirmNewEmail" id="confirmNewEmail" placeholder={user.email ? user.email : "user@test.com"} 
                    onChange={handleChange} value={formData.confirmNewEmail}/>
                </FormGroup>
            </Row>
            <Row>
                <FormGroup>
                    <Label for="newPass">New Password</Label>
                    <Input type="password" name="newPass" id="newPass" placeholder="*******" 
                    onChange={handleChange} value={formData.newPass}/>
                </FormGroup>
                <FormGroup>
                    <Label for="confirmNewPass">Confirm New Password</Label>
                    <Input type="password" name="confirmNewPass" id="confirmNewPass" placeholder="*******" 
                    onChange={handleChange} value={formData.confirmNewPass}/>
                </FormGroup>
            </Row>
            <Row>
                <FormGroup>
                    <Label for="oldPass">Old Password</Label>
                    <Input type="password" name="oldPass" id="oldPass" placeholder="*******" 
                    onChange={handleChange} value={formData.oldPass}/>
                </FormGroup>
                </Row>
            <Button>Submit</Button>
            <Button type='button' onClick={handleBack}>Cancel</Button>
        </Form>
        </div>
    )
}

export default EditUserInfo;