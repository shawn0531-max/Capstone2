import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getOneFood, editFoodInfo } from './actions';
import NavBar from './NavBar';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import './EditFoodForm.css';

/** Form that allows the user to change the amount of specified food entered for that day **/
const EditFoodForm = () =>{

    const {username, foodId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [newAmount, setNewAmount] = useState(100);

    useEffect(() =>{
        dispatch(getOneFood(username, foodId));

    }, [dispatch, username, foodId]);

    let {food} = useSelector(store => store.foods);

    const handleChange = e =>{
        setNewAmount(e.target.value);
    }

    /** Allows user to change food amount for the day which changes calorie and macro totals **/
    const handleEditSubmit = e =>{
        e.preventDefault();

        let foodObj = {
            'cals': parseFloat((food[0].cals * (newAmount / food[0].amount)).toFixed(1)),
            'protein': parseFloat((food[0].protein * (newAmount / food[0].amount)).toFixed(1)),
            'carbs': parseFloat((food[0].carbs * (newAmount / food[0].amount)).toFixed(1)),
            'fat': parseFloat((food[0].fat * (newAmount / food[0].amount)).toFixed(1)),
            'amount': parseInt(newAmount)
        }

        dispatch(editFoodInfo(foodId, foodObj, username));

        history.push(`/user/${username}/checkin`)
    }

    const handleBack = () =>{
        history.goBack();
    }

    return(
        <>
        <NavBar />
        <div className='editFoodForm-div col-xs-12 col-md-6'>
        {food !== undefined ?
        <Form className='editFoodForm' onSubmit={handleEditSubmit}>
            <h1 className='editFoodForm-title'>{food[0].food}</h1>
            <FormGroup>
                <Label className='editFoodForm-label' htmlFor="cals">Calories</Label>
                <Input disabled={true} type="text" name="cals" id="cals" 
                value={(food[0].cals * (newAmount / food[0].amount)).toFixed(1)} 
                />
            </FormGroup>
            <FormGroup>
                <Label className='editFoodForm-label' htmlFor="protein">Protein</Label>
                <Input disabled={true} type="text" name="protein" id="protein"
                value={(food[0].protein * (newAmount / food[0].amount)).toFixed(1)}
                />
            </FormGroup>
            <FormGroup>
                <Label className='editFoodForm-label' htmlFor="carbs">Carbohydrates</Label>
                <Input disabled={true} type="text" name="carbs" id="carbs" 
                value={(food[0].carbs * (newAmount / food[0].amount)).toFixed(1)}
                />
            </FormGroup>
            <FormGroup>
                <Label className='editFoodForm-label' htmlFor="fat">Fat</Label>
                <Input disabled={true} type="text" name="fat" id="fat" 
                value={(food[0].fat * (newAmount / food[0].amount)).toFixed(1)}
                />
            </FormGroup>
            <Row>
                <Col>
                    <FormGroup>
                        <Label className='editFoodForm-label' htmlFor="oldAmount">Old Amount</Label>
                        <Input disabled={true} type="text" name="oldAmount" id="oldAmount" value={food[0].amount} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label className='editFoodForm-label' htmlFor="newAmount">New Amount</Label>
                        <Input type="text" name="newAmount" id="newAmount" onChange={handleChange} value={newAmount} />
                    </FormGroup>
                </Col>
            </Row>
            <Button className='editFoodForm-edit-btn'>Edit Food</Button>
            <Button className='editFoodForm-back-btn' type='button' onClick={handleBack}>Back</Button>
        </Form>
        :
        null}
        </div>
        </>
    )
}

export default EditFoodForm;