import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getOneFood, editFoodInfo } from './actions';
import NavBar from './NavBar';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

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

    const handleEditSubmit = e =>{
        e.preventDefault();

        let foodObj = {
            'cals': (food[0].cals * (newAmount / food[0].amount)).toFixed(1),
            'protein': (food[0].protein * (newAmount / food[0].amount)).toFixed(1),
            'carbs': (food[0].carbs * (newAmount / food[0].amount)).toFixed(1),
            'fat': (food[0].fat * (newAmount / food[0].amount)).toFixed(1),
            'amount': newAmount
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
        <div className='col-md-6 col-xl-8'>
        {food !== undefined ?
        <Form onSubmit={handleEditSubmit}>
            <h3>{food[0].food}</h3>
            <FormGroup>
                <Label htmlFor="cals">Calories</Label>
                <Input disabled={true} type="text" name="cals" id="cals" 
                value={(food[0].cals * (newAmount / food[0].amount)).toFixed(1)} 
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="protein">Protein</Label>
                <Input disabled={true} type="text" name="protein" id="protein"
                value={(food[0].protein * (newAmount / food[0].amount)).toFixed(1)}
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="carbs">Carbohydrates</Label>
                <Input disabled={true} type="text" name="carbs" id="carbs" 
                value={(food[0].carbs * (newAmount / food[0].amount)).toFixed(1)}
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="fat">Fat</Label>
                <Input disabled={true} type="text" name="fat" id="fat" 
                value={(food[0].fat * (newAmount / food[0].amount)).toFixed(1)}
                />
            </FormGroup>
            <Row>
                <Col>
                    <FormGroup>
                        <Label htmlFor="oldAmount">Old Amount</Label>
                        <Input disabled={true} type="text" name="oldAmount" id="oldAmount" value={food[0].amount} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label htmlFor="newAmount">New Amount</Label>
                        <Input type="text" name="newAmount" id="newAmount" onChange={handleChange} value={newAmount} />
                    </FormGroup>
                </Col>
            </Row>
            <Button>Edit Food</Button>
            <Button type='button' onClick={handleBack}>Back</Button>
        </Form>
        :
        null}
        </div>
        </>
    )
}

export default EditFoodForm;