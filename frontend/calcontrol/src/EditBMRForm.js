import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { getUserInfo } from './actions';
import { Button, Form, FormGroup, Label, Input, CustomInput, FormText, Modal,
        ModalHeader, ModalBody, ModalFooter, Row, Col, InputGroup, InputGroupAddon,
        InputGroupText, Fade, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import NavBar from './NavBar';
import './EditBMRForm.css';

const DBAPI = 'http://localhost:5000'

/** Form that allows user to update their current information such as goal, activity level, experience level **/
const EditBMRForm = () => {

    // set empty initial state for the form, sets up useHistory
    const INITIAL_STATE = {curr_height:"", curr_age:"", curr_activity: "", curr_goal: "",
                           curr_experience: "", gender: ""};
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [activeModal, setActiveModal] = useState(false);
    const [BMRModal, setBMRModal] = useState(false);
    const [unit, setUnit] = useState("metric");
    const [error, setError] = useState(null);
    const {username} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    // Searches for user on page load if user display old values as placeholders

    useEffect(()=>{
        dispatch(getUserInfo(username));
    }, [dispatch, username]);

    let {user} = useSelector(store => store.user);

    // updates info in form inputs
    const handleChange = e => {
        const {name, value} = e.target;
        
        setFormData(formData => ({
            ...formData,
            [name]:value
        }));
    };

    // setting unit with switch
    const changeUnit = (e) =>{
        if(unit === 'metric'){
            setUnit('imperial');
        } else {
            setUnit('metric');
        }
    }

    const toggleActivity = () => setActiveModal(!activeModal);
    const toggleBMR = () => setBMRModal(!BMRModal);
    
    /** Updates user's BMR if needs to be recalculated, handles invalid data entry **/
    const handleSubmit = async(e) => {
        e.preventDefault();

        let height;

        if (unit === 'imperial'){
            height = Math.round(formData.curr_height * 2.54 * 2) / 2
        }

        if(formData.curr_height === "" || isNaN(parseFloat(formData.curr_height))){
            setError('Please enter a valid height')
        } else if(formData.curr_age === "" || isNaN(parseInt(formData.curr_age))){
            setError("Please enter a valid age");
        } else if(formData.curr_activity === ""){
            setError("Please select your activity level");
        } else if(formData.curr_goal === ""){
            setError("Please select your goal");
        } else if(formData.curr_experience === ""){
            setError("Please select your experience level");
        } else if(formData.gender === ""){
            setError("Please select your gender");
        } else {
            await axios.patch(`${DBAPI}/user/${username}/BMR`,{
                "curr_weight": user.curr_weight,
                "curr_height": height || Math.round(parseFloat(formData.curr_height * 2)) / 2,
                "curr_age": formData.curr_age || user.curr_age,
                "curr_activity": formData.curr_activity || user.curr_activity,
                "curr_goal": formData.curr_goal || user.curr_goal,
                "curr_experience": formData.curr_experience || user.curr_experience,
                "gender": formData.gender || user.gender
            });
            
            // resets form to initial values
            setFormData(INITIAL_STATE);
            // sends user to view all entered info
            history.push(`/user/${username}/info`);
        }

        setTimeout(()=>{
            setError(null);
        }, 2000);
    };

  return (
      <>
        <NavBar />
    <div className='editbmrForm-div col-md-4'>
        <Form className='editbmrForm' onSubmit={handleSubmit}>
        <Row className='editbmrForm-titleRow'>
        <h3 className='editbmrForm-title'>BMR Calculator </h3>
        <Button className='editbmrForm-bmr-btn' onClick={toggleBMR}><FontAwesomeIcon className='editbmrForm-icon' icon={faInfo}/></Button>
        </Row>
        <CustomInput className="unit-switch editbmrForm-slider" onClick={changeUnit} type="switch" id="exampleCustomSwitch" name="customSwitch" label={unit} />
        <Row>
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="curr_weight">Weight</Label>
                <InputGroup>
                <Input disabled={true} autoFocus={true} type="text" name="curr_weight" id="curr_weight" onChange={handleChange} 
                placeholder={user.curr_weight !== '0' ? user.curr_weight : 100}/>
                    <InputGroupAddon name="weight_unit" id="weight_unit" addonType='append'>
                        <InputGroupText>
                            {unit === 'metric' ? "kg" : "lb"}
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </FormGroup>
        </Col>
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="curr_height">Height</Label>
                <InputGroup>
                <Input type="text" name="curr_height" id="curr_height" onChange={handleChange} 
                placeholder={user.curr_height !== '0' ? user.curr_height : 180} value={formData.curr_height}/>
                <InputGroupAddon name="weight_unit" id="weight_unit" addonType='append'>
                        <InputGroupText>
                            {unit === 'metric' ? "cm" : "inch"}
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </FormGroup>
        </Col> 
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="curr_age">Age</Label>
                <Input type="text" name="curr_age" id="curr_age" onChange={handleChange} placeholder={user.curr_age ? user.curr_age : 22} value={formData.curr_age} />
            </FormGroup>
        </Col> 
        </Row>
        <Row>
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="curr_activity">Activity Level</Label>
                <Input type="select" name="curr_activity" id="curr_activity" onChange={handleChange} value={formData.curr_activity}>
                <option disabled value="" hidden>{user.curr_activity ? user.curr_activity : "Choose an option..."}</option>
                <option>Sedentary</option>
                <option>Lightly Active</option>
                <option>Moderately Active</option>
                <option>Very Active</option>
                <option>Extra Active</option>
                </Input>
                <FormText className='editbmrForm-activity-info' onClick={toggleActivity}>
                    Click here for information on activity level
                </FormText>
            </FormGroup>
        </Col> 
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="curr_goal">Goal</Label>
                <Input type="select" name="curr_goal" id="curr_goal" onChange={handleChange} value={formData.curr_goal}>
                <option disabled value="" hidden>{user.curr_goal ? user.curr_goal : "Choose an option..."}</option>
                <option>Lose Weight</option>
                <option>Maintain Weight</option>
                <option>Gain Weight</option>
                </Input>
            </FormGroup>
        </Col> 
        </Row>
        <Row>
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="curr_experience">Experience</Label>
                <Input type="select" name="curr_experience" id="curr_experience" onChange={handleChange} value={formData.curr_experience}>
                <option disabled value="" hidden>{user.curr_experience ? user.curr_experience : "Choose an option..."}</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                </Input>
            </FormGroup>
        </Col> 
        <Col>
            <FormGroup>
                <Label className='editbmrForm-label' htmlFor="gender">Gender</Label>
                <Input type="select" name="gender" id="gender" onChange={handleChange} value={formData.gender}>
                <option disabled value="" hidden>{user.gender ? user.gender : "Choose an option..."}</option>
                <option>Male</option>
                <option>Female</option>
                </Input>
            </FormGroup>
        </Col> 
        </Row>
        <Button className='editbmrForm-btn'>Calculate</Button>
        </Form>
        <br/>
        {error === null ? null : 
        <Fade in={error}>
            <Alert color='warning'>{error}</Alert>
        </Fade>
        }
        <Modal className='modal-editbmr' isOpen={activeModal} toggle={toggleActivity}>
        <ModalHeader className='modal-editbmr-title' toggle={toggleActivity}>Activity Levels</ModalHeader>
        <ModalBody className='modal-editbmr-body'>
          <ol>
              <li><b>Sedentary</b>: Little to no exercise</li>
              <li><b>Lightly Active</b>: Light exercise 1-3 days a week</li>
              <li><b>Moderately Active</b>: Moderate exercise 3-5 days a week</li>
              <li><b>Very Active</b>: Moderate exercise 6-7 days a week</li>
              <li><b>Extra Active</b>: Hard exercise 6-7 days a week (very physical job) </li>
          </ol>
        </ModalBody>
        <ModalFooter className='modal-editbmr-footer'>
          <Button color="secondary" onClick={toggleActivity}>Okay</Button>
        </ModalFooter>
      </Modal>
        <Modal className='modal-editbmr' isOpen={BMRModal} toggle={toggleBMR}>
        <ModalHeader className='modal-editbmr-title' toggle={toggleBMR}>Basal Metabolic Rate (BMR)</ModalHeader>
        <ModalBody className='modal-editbmr-body'>
          <p>
            This calcuation will give an estimate of the minimum number of calories your body requires for basic functions.
          </p>
        </ModalBody>
        <ModalFooter className='modal-editbmr-footer'>
          <Button color="secondary" onClick={toggleBMR}>Okay</Button>
        </ModalFooter>
      </Modal>
    </div>
    </>
  );
}

export default EditBMRForm;