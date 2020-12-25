import axios from 'axios';
import React, {useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, CustomInput, FormText, Modal,
        ModalHeader, ModalBody, ModalFooter, Row, Col, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import NavBar from './NavBar';

const DBAPI = 'http://localhost:5000'

const BMRForm = () => {

    // set empty initial state for the form, sets up useHistory
    const INITIAL_STATE = {curr_weight:"", weight_unit: "kg", curr_height:"", height_unit: "cm",
                           curr_age:"", curr_activity: "", curr_goal: "", curr_experience: "", gender: ""};
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [activeModal, setActiveModal] = useState(false);
    const [BMRModal, setBMRModal] = useState(false);
    const [unit, setUnit] = useState("metric");
    const {username} = useParams();
    const history = useHistory();

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
            setUnit('standard');
            
        } else {
            setUnit('metric')
        }
    }

    const toggleActivity = () => setActiveModal(!activeModal);
    const toggleBMR = () => setBMRModal(!BMRModal);
    
    // on submit updates snacks/drinks in DB, then uses setDrinks/setSnacks depending on which is selected on form
    const handleSubmit = async(e) => {
        e.preventDefault();

        let weight;
        let height;

        if (unit === 'standard'){
            weight = Math.round(formData.curr_weight * 0.453592)
            height = Math.round(formData.curr_height * 2.54)
        }

        await axios.patch(`${DBAPI}/user/${username}/BMR`,{
            "curr_weight": weight || formData.curr_weight,
            "curr_height": height || formData.curr_height,
            "curr_age": formData.curr_age,
            "curr_activity": formData.curr_activity,
            "curr_goal": formData.curr_goal,
            "curr_experience": formData.curr_experience,
            "gender": formData.gender
        });

        

        // resets form to initial values
        setFormData(INITIAL_STATE);
        // sends user to check-in page
        history.push(`/user/${username}/checkin`);
    };

  return (
      <>
        <NavBar />
    <div className='itemform col-md-4'>
        <Form onSubmit={handleSubmit}>
        <Row>
        <h3>BMR Calculator </h3><Button onClick={toggleBMR}><FontAwesomeIcon  icon={faInfo} /></Button>
        <CustomInput className="unit-switch" onClick={changeUnit} type="switch" id="exampleCustomSwitch" name="customSwitch" label={unit} />
        </Row>
        <Row>
        <Col>
            <FormGroup>
                <Label htmlFor="curr_weight">Weight</Label>
                <InputGroup>
                <Input autoFocus={true} type="text" name="curr_weight" id="curr_weight" onChange={handleChange} placeholder="100" value={formData.curr_weight}/>
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
                <Label htmlFor="curr_height">Height</Label>
                <InputGroup>
                <Input type="text" name="curr_height" id="curr_height" onChange={handleChange} placeholder="180" value={formData.curr_height}/>
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
                <Label htmlFor="curr_age">Age</Label>
                <Input type="text" name="curr_age" id="curr_age" onChange={handleChange} placeholder="22" value={formData.curr_age} />
            </FormGroup>
        </Col> 
        </Row>
        <Row>
        <Col>
            <FormGroup>
                <Label htmlFor="curr_activity">Activity Level</Label>
                <Input type="select" name="curr_activity" id="curr_activity" onChange={handleChange} value={formData.curr_activity}>
                <option disabled value="" hidden>Choose an option...</option>
                <option>Sedentary</option>
                <option>Lightly Active</option>
                <option>Moderately Active</option>
                <option>Very Active</option>
                <option>Extra Active</option>
                </Input>
                <FormText onClick={toggleActivity} color="muted">
                    Click here for information on activity level
                </FormText>
            </FormGroup>
        </Col> 
        <Col>
            <FormGroup>
                <Label htmlFor="curr_goal">Goal</Label>
                <Input type="select" name="curr_goal" id="curr_goal" onChange={handleChange} value={formData.curr_goal}>
                <option disabled value="" hidden>Choose an option...</option>
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
                <Label htmlFor="curr_experience">Experience</Label>
                <Input type="select" name="curr_experience" id="curr_experience" onChange={handleChange} value={formData.curr_experience}>
                <option disabled value="" hidden>Choose an option...</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                </Input>
            </FormGroup>
        </Col> 
        <Col>
            <FormGroup>
                <Label htmlFor="gender">Gender</Label>
                <Input type="select" name="gender" id="gender" onChange={handleChange} value={formData.gender}>
                <option disabled value="" hidden>Choose an option...</option>
                <option>Male</option>
                <option>Female</option>
                </Input>
            </FormGroup>
        </Col> 
        </Row>
        <Button>Calculate</Button>
        </Form>
        <Modal isOpen={activeModal} toggle={toggleActivity}>
        <ModalHeader toggle={toggleActivity}>Activity Levels</ModalHeader>
        <ModalBody>
          <ol>
              <li><b>Sedentary</b>: Little to no exercise</li>
              <li><b>Lightly Active</b>: Light exercise 1-3 days a week</li>
              <li><b>Moderately Active</b>: Moderate exercise 3-5 days a week</li>
              <li><b>Very Active</b>: Moderate exercise 6-7 days a week</li>
              <li><b>Extra Active</b>: Hard exercise 6-7 days a week (very physical job) </li>
          </ol>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleActivity}>Okay</Button>
        </ModalFooter>
      </Modal>
        <Modal isOpen={BMRModal} toggle={toggleBMR}>
        <ModalHeader toggle={toggleBMR}>Basal Metabolic Rate (BMR)</ModalHeader>
        <ModalBody>
          <p>
            This calcuation will give an estimate of the minimum number of calories your body requires for basic functions.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleBMR}>Okay</Button>
        </ModalFooter>
      </Modal>
    </div>
    </>
  );
}

export default BMRForm;