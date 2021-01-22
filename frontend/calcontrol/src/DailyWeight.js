import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { addDailyWeight } from './actions';
import { Form, FormGroup, Label, Input, InputGroupAddon, InputGroupText,
         Button, CustomInput, Fade, Alert } from 'reactstrap';
import './DailyWeight.css';

/** Form where user can submit a daily weigh in **/
const DailyWeight = () =>{
    
    const [unit, setUnit] = useState('metric');
    const [weight, setWeight] = useState("");
    const [error, setError] = useState(null);
    const {username} = useParams();
    const history = useHistory();

    const changeUnit = (e) =>{
        if(unit === 'metric'){
            setUnit('imperial');
        } else {
            setUnit('metric');
        }
    }

    const handleChange = (e) =>{
        const {value} = e.target;

        setWeight(value);
    }

    /** Adds users weight for the day, handles invalid weight data (empty or NaN) converts weight based on
     *  current unit selected (always adds to database in metric) **/
    const handleSubmit = async(e) =>{
        e.preventDefault();

        let weightCheck;

        if(weight === '' || isNaN(parseInt(weight))){
            setError('Please enter a valid weight');
            setTimeout(()=>{
                setError(null);
            }, 2000);
        }
        if(unit === 'imperial'){
            weightCheck = Math.round(parseFloat(weight) * 0.453592 * 2) / 2
            await addDailyWeight(username, weightCheck)
        } else {
            await addDailyWeight(username, weight)
        }

        history.push(`/user/${username}/checkin`);
        
    }

    const handleCancel = () =>{
        history.goBack();
    }

    return(
        <>
        <div className="dailyWeightForm-div col-xs-12 col-md-6 col-lg-4">
        <Form className='dailyWeightForm' onSubmit={handleSubmit}>
            <h1 className='dailyWeightForm-title'>Daily Weigh In</h1>
            <CustomInput className="dailyWeightForm-switch unit-switch" onClick={changeUnit} type="switch" id="CustomSwitch" name="customSwitch" label={unit} />
            <FormGroup>
                <Label className='dailyWeightForm-label' for="weight">Weight</Label>
                <InputGroupAddon name="weight_unit" id="weight_unit" addonType='append'>
                <Input type="text" name="weight" id="weight" placeholder='100' value={weight} onChange={handleChange}/>
                        <InputGroupText>
                            {unit === 'metric' ? "kg" : "lb"}
                        </InputGroupText>
                    </InputGroupAddon>
            </FormGroup>
            <Button className='dailyWeightForm-add-btn'>Add</Button>
            <Button className='dailyWeightForm-cancel-btn' onClick={handleCancel} type='button'>Cancel</Button>
        </Form>
        </div>
        {error === null ? null : 
        <Fade in={error}>
            <Alert className='dailyWeightForm-alert col-xs-12 col-md-6 col-lg-4' color='warning'>{error}</Alert>
        </Fade>
        }
        </>
    )
}

export default DailyWeight;