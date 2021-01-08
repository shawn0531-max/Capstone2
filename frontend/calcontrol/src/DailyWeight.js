import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { addDailyWeight } from './actions';
import { Form, FormGroup, Label, Input, InputGroupAddon, InputGroupText, Button, CustomInput } from 'reactstrap';

const DailyWeight = () =>{
    
    const [unit, setUnit] = useState('metric');
    const [weight, setWeight] = useState("");
    const {username} = useParams();
    const history = useHistory();

    const changeUnit = (e) =>{
        if(unit === 'metric'){
            setUnit('standard');
        } else {
            setUnit('metric');
        }
    }

    const handleChange = (e) =>{
        const {value} = e.target;

        setWeight(value);
    }


    const handleSubmit = async(e) =>{
        e.preventDefault();

        let weightCheck;
        let resp;

        if(unit === 'standard'){
            weightCheck = Math.round(parseFloat(weight) * 0.453592 * 2) / 2
            resp = await addDailyWeight(username, weightCheck)
        } else {
            resp = await addDailyWeight(username, weight)
        }

        history.push(`/user/${username}/checkin`);
    }

    const handleCancel = () =>{
        history.goBack();
    }

    return(
        <div className="col-xs-12 col-md-6 col-lg-4">
        <Form onSubmit={handleSubmit}>
            <CustomInput className="unit-switch" onClick={changeUnit} type="switch" id="CustomSwitch" name="customSwitch" label={unit} />
            <FormGroup>
                <Label for="weight">Weight</Label>
                <InputGroupAddon name="weight_unit" id="weight_unit" addonType='append'>
                <Input type="text" name="weight" id="weight" placeholder='100' value={weight} onChange={handleChange}/>
                        <InputGroupText>
                            {unit === 'metric' ? "kg" : "lb"}
                        </InputGroupText>
                    </InputGroupAddon>
            </FormGroup>
            <Button>Add</Button>
            <Button onClick={handleCancel} type='button'>Cancel</Button>
        </Form>
        </div>
    )
}

export default DailyWeight;