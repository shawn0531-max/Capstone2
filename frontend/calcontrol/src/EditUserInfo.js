import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, updateUser } from './actions';
import { Form, FormGroup, Label, Input, Button, Row, Fade, Alert } from 'reactstrap';
import './EditUserInfo.css';

/** Form that allows user to change their password and email **/
const EditUserInfo = () =>{

    const INITAIL_STATE = {oldPass: "", newPass: "", confirmNewPass: "", newEmail: "", confirmNewEmail: ""}
    const dispatch = useDispatch();
    const {username} = useParams();
    const [formData, setFormData] = useState(INITAIL_STATE);
    const history = useHistory();
    const [error, setError] = useState({'value': null, 'color': 'warning'});
    
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

    /** Allows user to update password and email, handles values not matching and incorrect old password**/
    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(formData.oldPass === ""){
            setError({'value':'Please enter your old password', 'color': 'warning'});
        } else if(formData.confirmNewPass === ""){
            setError({'value': 'Please confirm your new password', 'color': 'warning'});
        } else if(formData.confirmNewEmail === ""){
            setError({'value': 'Please confirm your new email', 'color': 'warning'});
        } else if(formData.newEmail !== formData.confirmNewEmail){
            setError({'value': 'Both email entries must match', 'color': 'danger'});
        } else if(formData.newPass !== formData.confirmNewPass){
            setError({'value':'Both new password entries must match', 'color': 'danger'});
        } else {
            try{
                await updateUser(username, formData.oldPass, formData.confirmNewPass, formData.confirmNewEmail);
                history.push(`/user/${username}/profile`);
            } catch(err){
                setError({'value': 'Your old password does not match. Please check your spelling', 'color': 'danger'});
            }
        }

        setTimeout(()=>{
            setError(null);
        }, 2000)
    }

    const handleBack = () =>{
        history.goBack();
    }
    return(
        <>
        <div className='editInfo-div col-xs-12 col-md-6'>
        {user.username ? <h2 className='editInfo-title'>{user.username}</h2> : null}
        <Form className='editInfo-form' onSubmit={handleSubmit}>
            <Row className='editInfo-row'>
                <FormGroup className='editInfo-group'>
                    <Label className='editInfo-label' for="newEmail">New Email</Label>
                    <Input className='editInfo-input' type="email" name="newEmail" id="newEmail" placeholder={user.email ? user.email : "user@test.com"} 
                    onChange={handleChange} value={formData.newEmail}/>
                </FormGroup>
                <FormGroup className='editInfo-group'>
                    <Label className='editInfo-label' for="confirmNewEmail">Confirm New Email</Label>
                    <Input className='editInfo-input' type="email" name="confirmNewEmail" id="confirmNewEmail" placeholder={user.email ? user.email : "user@test.com"} 
                    onChange={handleChange} value={formData.confirmNewEmail}/>
                </FormGroup>
            </Row>
            <Row className='editInfo-row'>
                <FormGroup className='editInfo-group'>
                    <Label className='editInfo-label' for="newPass">New Password</Label>
                    <Input className='editInfo-input' type="password" name="newPass" id="newPass" placeholder="*******" 
                    onChange={handleChange} value={formData.newPass}/>
                </FormGroup>
                <FormGroup className='editInfo-group'>
                    <Label className='editInfo-label' for="confirmNewPass">Confirm New Password</Label>
                    <Input className='editInfo-input' type="password" name="confirmNewPass" id="confirmNewPass" placeholder="*******" 
                    onChange={handleChange} value={formData.confirmNewPass}/>
                </FormGroup>
            </Row>
            <Row className='editInfo-row'>
                <FormGroup>
                    <Label className='editInfo-label' for="oldPass">Old Password</Label>
                    <Input type="password" name="oldPass" id="oldPass" placeholder="*******" 
                    onChange={handleChange} value={formData.oldPass}/>
                </FormGroup>
                </Row>
            <Button className='editInfo-submit-btn'>Submit</Button>
            <Button className='editInfo-cancel-btn' type='button' onClick={handleBack}>Cancel</Button>
        </Form>
        </div>
        {error.value === null ? null : 
        <Fade in={error.value}>
            <Alert className='editInfo-alert col-md-4' color={error.color}>{error.value}</Alert>
        </Fade>
        }
        </>
    )
}

export default EditUserInfo;