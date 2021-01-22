import React, { useEffect, useState } from 'react';
import { searchFoodApi } from './actions';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';
import { postNewFood, addFav, getAllFavs } from './actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Form, FormGroup, Label, Input, Button, Row } from 'reactstrap';
import './AddFoodForm.css';

/** Form where user can change the amount of food eaten for the day **/
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
    let {favs} = useSelector(store => store.favorites);

    let name;
    let cals = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let foodObj = {};

    /** Uses food information as placeholders until user changes the amount eaten **/
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
            'cals': parseFloat(cals),
            'protein': parseFloat(protein),
            'carbs': parseFloat(carbs),
            'fat': parseFloat(fat),
            'amount': parseFloat(amount)
        }

        dispatch(postNewFood(username, foodObj));

        history.push(`/user/${username}/checkin`);

    };

    const handleBack = () =>{
        history.goBack();
    }

    /** Sets up array to check for user's favorites, if current food is in this array the star will be gold **/
    let favArr = [];

    if(favs){
        if(favs.length > 0){
            for(let i = 0; i < favs.length; i++){
                favArr.push(favs[i].food);
            }
        }
    }
    /** Adds food to favorites if it isn't already favorited **/
    const handleFavAdd = async (e) =>{
        let targetId = document.querySelector(".addfoodform-fav-btn");
        
        if(targetId.id === 'notFav'){
            try {
                await addFav(username, name, parseFloat(cals), parseFloat(protein), parseFloat(carbs), parseFloat(fat));
            } catch (err) {
                alert("You can remove a favorite by going to your favorites page")
            }
        } else {
            alert("You can remove a favorite by going to your favorites page")
        }

        dispatch(getAllFavs(username));
    }
   
    return(
        <div className='addfoodform col-xs-12 col-md-6'>
        {foodItem.foods !== undefined ?
        <Form onSubmit={handleAdd}>
            <Row className='addfoodform-titleRow'>
            <h1 className='addfoodform-title'>{name}</h1>
            <Button id={favArr.includes(name) ? 'fav' : 'notFav'} type='button' className='addfoodform-fav-btn' onClick={handleFavAdd}><FontAwesomeIcon id={favArr.includes(name) ? 'starfav' : 'starnotFav'} className='addfoodform-icon' icon={faStar}></FontAwesomeIcon></Button>
            </Row>
            <FormGroup>
                <Label className='addfoodform-label' for="cals">Calories</Label>
                <Input disabled={true} type="text" name="cals" id="cals" 
                value={cals} 
                />
            </FormGroup>
            <FormGroup>
                <Label className='addfoodform-label' for="protein">Protein</Label>
                <Input disabled={true} type="text" name="protein" id="protein"
                value={protein}
                />
            </FormGroup>
            <FormGroup>
                <Label className='addfoodform-label' for="carbs">Carbohydrates</Label>
                <Input disabled={true} type="text" name="carbs" id="carbs" 
                value={carbs}
                />
            </FormGroup>
            <FormGroup>
                <Label className='addfoodform-label' for="fat">Fat</Label>
                <Input disabled={true} type="text" name="fat" id="fat" 
                value={fat}
                />
            </FormGroup>
            <FormGroup>
                <Label className='addfoodform-label' for="amount">Amount</Label>
                <Input type="text" name="amount" id="amount" value={amount} onChange={handleChange}/>
            </FormGroup>
            <Button className='addfoodform-add-btn'>Add Food</Button>
            <Button className='addfoodform-cancel-btn' type='button' onClick={handleBack}>Cancel</Button>
        </Form>
        :
        null}
        </div>
    )
}

export default AddFoodForm;