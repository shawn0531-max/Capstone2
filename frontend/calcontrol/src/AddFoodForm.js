import React, { useEffect, useState } from 'react';
import { searchFoodApi } from './actions';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';
import { postNewFood, addFav, getAllFavs } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const AddFoodForm = () =>{

    const {username, food} = useParams();
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(100);
    const history = useHistory();

    useEffect(()=>{

        dispatch(searchFoodApi(food));
        dispatch(getAllFavs(username));

    }, [dispatch, food, username])

    const foodItem = useSelector(store => store.foods);
    const favs = useSelector(store => store.favorites);

    let name;
    let cals = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let foodObj = {};


    if(foodItem.foods !== undefined){
        if(foodItem.foods.items !== undefined){
            name = foodItem.foods.items[0].name
            cals = (foodItem.foods.items[0].calories * (amount/100)).toFixed(1);
            protein = (foodItem.foods.items[0].protein_g * (amount/100)).toFixed(1);
            carbs = (foodItem.foods.items[0].carbohydrates_total_g * (amount/100)).toFixed(1);
            fat = (foodItem.foods.items[0].fat_total_g * (amount/100)).toFixed(1);
        }
    }

    const handleChange = e => {
        setAmount(e.target.value);
    };

    const handleAdd = () =>{
        foodObj = {
            'food': name,
            'cals': cals,
            'protein': protein,
            'carbs': carbs,
            'fat': fat,
            'amount': amount
        }

        dispatch(postNewFood(username, foodObj));

        history.push(`/user/${username}/checkin`);

    };

    const handleBack = () =>{
        history.goBack();
    }

    const handleFavAdd = async () =>{
        let resp = await addFav(username, name, cals, protein, carbs, fat);
    }

    return(
        <div className='col-md-6 col-xl-8'>
        {foodItem.foods !== undefined ?
        <Form onSubmit={handleAdd}>
            <h3>{name}</h3>
            <Button onClick={handleFavAdd}><FontAwesomeIcon icon={faStar}></FontAwesomeIcon></Button>
            <FormGroup>
                <Label for="cals">Calories</Label>
                <Input disabled={true} type="text" name="cals" id="cals" 
                value={cals} 
                />
            </FormGroup>
            <FormGroup>
                <Label for="protein">Protein</Label>
                <Input disabled={true} type="text" name="protein" id="protein"
                value={protein}
                />
            </FormGroup>
            <FormGroup>
                <Label for="carbs">Carbohydrates</Label>
                <Input disabled={true} type="text" name="carbs" id="carbs" 
                value={carbs}
                />
            </FormGroup>
            <FormGroup>
                <Label for="fat">Fat</Label>
                <Input disabled={true} type="text" name="fat" id="fat" 
                value={fat}
                />
            </FormGroup>
            <FormGroup>
                <Label for="amount">Amount</Label>
                <Input type="text" name="amount" id="amount" value={amount} onChange={handleChange}/>
            </FormGroup>
            <Button>Add Food</Button>
            <Button type='button' onClick={handleBack}>Cancel</Button>
        </Form>
        :
        null}
        </div>
    )
}

export default AddFoodForm;