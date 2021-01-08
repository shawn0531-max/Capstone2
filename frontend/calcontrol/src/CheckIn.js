import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, getRecommendations, getDateFood, getDailyWeight,
         addDailyCals, getDailyCals } from './actions';
import axios from 'axios';
import NavBar from './NavBar';
import FoodCard from './FoodCard';
import TodayFoodList from './TodayFoodList';
import { Spinner, Progress, Badge, InputGroup, Input,
         Button, InputGroupAddon , UncontrolledCollapse, Row} from 'reactstrap';
import './CheckIn.css';

const CheckIn = () =>{

    const FoodAPI = 'https://api.calorieninjas.com/v1/nutrition';
    const api_key = 'abzfQrMaqXyvSxbZv72JRA==ATIcRZPxiYS74NxH';
    const dispatch = useDispatch();
    const history = useHistory();
    const {username} = useParams();
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [addingFood, setAddingFood] = useState(false);
    const [foods, setFoods] = useState(undefined);

    let totalCals = 0;
    let totalProtein = 0;
    let totalCarbs= 0;
    let totalFat = 0;
    let minGoal = 0;
    let date = Date();
    date = date.slice(4,15);

    useEffect(()=> {
        dispatch(getUserInfo(username));
        // dispatch(getOldWeights(username, twoWeeksCalc()));
        dispatch(getRecommendations(username));
        dispatch(getDateFood(username, date));
        dispatch(getDailyWeight(username));
        dispatch(getDailyCals(username));
    }, [dispatch, username, date])

    let {user} = useSelector(store => store.user);
    let weights = useSelector(store => store.weights);
    let cals = useSelector(store => store.cals);
    let recommendations = useSelector(store => store.recommendations);
    let foodToday = useSelector(store => store.foods);

    if(foodToday.foods){
        for(let i = 0; i < foodToday.foods.length; i++){
            totalCals += parseFloat(foodToday.foods[i].cals);
            totalProtein += parseFloat(foodToday.foods[i].protein);
            totalCarbs += parseFloat(foodToday.foods[i].carbs);
            totalFat += parseFloat(foodToday.foods[i].fat);
        }

        totalCals = totalCals.toFixed(1);
        totalProtein = totalProtein.toFixed(1);
        totalCarbs = totalCarbs.toFixed(1);
        totalFat = totalFat.toFixed(1);

        if(recommendations.cals){
            minGoal = (totalCals / recommendations.cals).toFixed(2)
        }
    }

    const handleChange = e =>{
        const {value} = e.target;

        setSearch(value);
    }

    const handleSearch = async() =>{
        setIsSearching(true);
        let resp = await axios.get(`${FoodAPI}?query=${search}`,{
            headers: {'X-Api-Key': api_key}
        });

        if(resp.data.items){
            setFoods(resp.data.items)
            setIsSearching(false);
        }

        setSearch("");
    }


    const toggleAdd = () =>{
        if(!addingFood){
            setFoods(undefined);
        }
        setAddingFood(!addingFood);
    }

    const handleWeightAdd = () =>{
        history.push(`/user/${username}/addweight`);
    }

    const handleEndDay = async() =>{
        let resp = await addDailyCals(username, totalCals, recommendations.cals);

        if(resp.data !== 'Already entered'){
            alert(`${totalCals} calories have been added for ${date}`)
            cals = await getDailyCals(username);
        } else {
            alert('You have already entered your calories for today.');
            cals = await getDailyCals(username);
        }
    }

    return(
        <>
            <NavBar />
        { !user.username ?
            <>
            <Spinner className="text-default">
            </Spinner>
            </>
            :
            <>
            <div>
                <div className='user-div col-xs-12 col-md-8 col-xl-8'>
                        <h4><b>Daily Goals</b></h4>
                        <Row>
                        <p className="macros">Calories: {totalCals ? totalCals : 0} of {recommendations.cals} <Badge color='success' pill={true}> </Badge></p>
                        <p className="macros">Protein: {totalProtein ? totalProtein : 0} of {recommendations.protein} grams <Badge color='danger' pill={true}> </Badge></p>
                        <p className="macros">Carbohydrates: {totalCarbs ? totalCarbs : 0} of {recommendations.carbs} grams <Badge color='primary' pill={true}> </Badge></p>
                        <p className="macros">Fats: {totalFat ? totalFat : 0} of {recommendations.fat} grams <Badge color='warning' pill={true}> </Badge></p>
                        </Row>
                    <br/>
                    <div className='progress-div'>
                    <Progress multi>
                        <Progress bar color="danger" value={totalProtein/recommendations.protein} max={3}>{((totalProtein/recommendations.protein)*100).toFixed(1)} %</Progress>
                        <Progress bar color='primary' value={totalCarbs/recommendations.carbs} max={3}>{((totalCarbs/recommendations.carbs)*100).toFixed(1)} %</Progress>
                        <Progress bar color="warning" value={totalFat/recommendations.fat} max={3}>{((totalFat/recommendations.fat)*100).toFixed(1)} %</Progress>
                    </Progress>
                    
                    <Progress bar color="success" value={totalCals/recommendations.cals} max={1}>{((totalCals/recommendations.cals)*100).toFixed(1)} %</Progress>
                    
                    </div>
                </div>
            </div>
            <div>
                <Button disabled={cals === null && minGoal > 0.65 ? false : true} onClick={handleEndDay} color="primary">
                End Day
                </Button>
                <Button disabled={weights === null ? false : true} onClick={handleWeightAdd} color="primary">
                Daily Weigh In
                </Button>
                <Button color="primary" id="toggleragain">
                See Food
                </Button>
                <Button disabled={cals === null ? false : true} color="primary" id="toggler" onClick={toggleAdd}>
                {addingFood ? "Done" : "Add food for today"}
                </Button>
                <UncontrolledCollapse toggler="#toggleragain">
                    {foodToday.foods ? 
                    <TodayFoodList foods={foodToday.foods} cals={cals} />
                    :
                    null
                    }
                </UncontrolledCollapse>
                <UncontrolledCollapse toggler="#toggler">
                    <InputGroup>
                        <Input placeholder="Seach for food or drink" onChange={handleChange} value={search}/>
                        <InputGroupAddon addonType="append"><Button onClick={handleSearch}>Click to search</Button></InputGroupAddon>
                    </InputGroup>
            {
                <>
                {isSearching ? 
                <Spinner className="text-default">
                </Spinner>
                :
                <FoodCard foods={foods}/>}
                </>
            }
                </UncontrolledCollapse>
            </div>
            </>
        }
        </>
    )
}

export default CheckIn;
