import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, getRecommendations, getDateFood, getDailyWeight,
         addDailyCals, getDailyCals } from './actions';
import axios from 'axios';
import NavBar from './NavBar';
import FoodCard from './FoodCard';
import TodayFoodList from './TodayFoodList';
import { Spinner, Progress, Badge, InputGroup, Input, Button, 
         InputGroupAddon , UncontrolledCollapse, Row, Fade, Alert} from 'reactstrap';
import './CheckIn.css';

/** User's can visualize calorie/macros progress for the day through progress bars, add daily weigh in,
 *  search for foods to add on the day, see foods included in the day, and submit calorie total for the day **/
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
    const [seeFood, setSeeFood] = useState(false);
    const [error, setError] = useState({'val': null, 'color': 'warning'});

    let totalCals = 0;
    let totalProtein = 0;
    let totalCarbs= 0;
    let totalFat = 0;
    let minGoal = 0;
    let date = Date();
    date = date.slice(4,15);

    useEffect(()=> {
        try {
            dispatch(getUserInfo(username));
            dispatch(getRecommendations(username));
            dispatch(getDateFood(username, date));
            dispatch(getDailyWeight(username));
            dispatch(getDailyCals(username)); 
        } catch (err) {
            
        }
    }, [dispatch, username, date])

    let {user} = useSelector(store => store.user);
    let {weights} = useSelector(store => store.weights);
    let {cals} = useSelector(store => store.cals);
    let recommendations = useSelector(store => store.recommendations);
    let foodToday = useSelector(store => store.foods);

    /** Calculates calorie and macro totals for the day to set up progress bars **/
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

    /** Allows user to search food API CalorieNinjas, handles error if search returns nothing **/
    const handleSearch = async() =>{
        setIsSearching(true);
        let resp = await axios.get(`${FoodAPI}?query=${search}`,{
            headers: {'X-Api-Key': api_key}
        });

        if(resp.data.items.length === 0){
            setError({'val': 'Item not found. Please check spelling or use of spaces and try again', 'color': 'warning'})
            setTimeout(()=>{
                setError({'val': null, 'color': 'warning'});
            }, 2000);
        }
        if(resp.data.items){
            setFoods(resp.data.items)
            setIsSearching(false);
        }

        setSearch("");
    }

    /** Toggles the collapses on corresponding button click and allows only one open at a time **/
    const toggleAdd = () =>{
        setAddingFood(!addingFood);
        setSeeFood(false);
    }

    const toggleSee =() =>{
        setSeeFood(!seeFood);
        setAddingFood(false);
    }

    const handleWeightAdd = () =>{
        history.push(`/user/${username}/addweight`);
    }

    /** Submits users total calories and recommended calories for the day **/
    const handleEndDay = async() =>{
        let resp = await addDailyCals(username, parseFloat(totalCals), parseFloat(recommendations.cals));

        if(resp.data !== 'Already entered'){
            setError({'val': `${totalCals} calories have been added for ${date}`, 'color': 'success'});
            setTimeout(()=>{
                setError({'val': null, 'color': 'warning'});
            }, 2000);
            cals = await getDailyCals(username);
            window.location.reload();
        } else {
            alert({'val': 'You have already entered your calories for today.', 'color': 'danger'});
            setTimeout(()=>{
                setError({'val': null, 'color': 'warning'});
            }, 2000);
            cals = await getDailyCals(username);
        }
    }    
    
    return(
        <>
            <NavBar />
        { !user.username ?
            <>
            <Spinner className="checkin-spinner">
            </Spinner>
            </>
            :
            <>
            <div>
                <div className='user-div col-xs-12 col-md-8 col-xl-8'>
                        <h1 className='checkin-title'><b>Daily Goals</b></h1>
                        <Row className='checkin-label-row col-xs-12 col-md-12 col-lg-8 col-xl-8'>
                        <p className="macros">Calories: {totalCals ? totalCals : 0} of {recommendations.cals} <Badge className='checkin-badge' color='success' pill={true}> </Badge></p>
                        <p className="macros">Protein: {totalProtein ? totalProtein : 0} of {recommendations.protein} grams <Badge className='checkin-badge' color='danger' pill={true}> </Badge></p>
                        </Row>
                        <Row className='checkin-label-row col-xs-12 col-md-12 col-lg-9 col-xl-9'>
                        <p className="macros">Carbohydrates: {totalCarbs ? totalCarbs : 0} of {recommendations.carbs} grams <Badge className='checkin-badge' color='primary' pill={true}> </Badge></p>
                        <p className="macros">Fats: {totalFat ? totalFat : 0} of {recommendations.fat} grams <Badge className='checkin-badge' color='warning' pill={true}> </Badge></p>
                        </Row>
                    <br/>
                    <div className='checkin-progress-div col-xs-12'>
                    <Progress multi>
                        <Progress bar color="danger" value={totalProtein/recommendations.protein} max={3}>{((totalProtein/recommendations.protein)*100).toFixed(1)} %</Progress>
                        <Progress bar color='primary' value={totalCarbs/recommendations.carbs} max={3}>{((totalCarbs/recommendations.carbs)*100).toFixed(1)} %</Progress>
                        <Progress bar color="warning" value={totalFat/recommendations.fat} max={3}>{((totalFat/recommendations.fat)*100).toFixed(1)} %</Progress>
                    </Progress>
                    
                    <Progress className='checkin-cal-progress' bar color="success" value={totalCals/recommendations.cals} max={1}>{((totalCals/recommendations.cals)*100).toFixed(1)} %</Progress>
                    
                    </div>
                </div>
            </div>
            <div>
                <Button className='checkin-btn' disabled={cals === undefined && minGoal > 0.65 ? false : true} onClick={handleEndDay} color="primary">
                End Day
                </Button>
                <Button className='checkin-btn' disabled={weights === undefined ? false : true} onClick={handleWeightAdd} color="primary">
                Daily Weigh In
                </Button>
                <Button className='checkin-btn' color="primary" id="toggleragain" onClick={toggleSee}>
                See Food
                </Button>
                <Button className='checkin-btn' disabled={cals === undefined ? false : true} color="primary" id="toggler" onClick={toggleAdd}>
                {addingFood ? "Close Food Search" : "Add food for today"}
                </Button>
                <UncontrolledCollapse className='checkin-foods col-xs-10 col-md-10' toggler='#toggleragain' isOpen={seeFood ? true : false}>
                    {foodToday.foods ? 
                    <TodayFoodList foods={foodToday.foods} cals={cals} />
                    :
                    null
                    }
                </UncontrolledCollapse>
                <UncontrolledCollapse className='checkin-search' toggler="#toggler" isOpen={addingFood ? true : false}>
                    <InputGroup className='checkin-search-group col-xs-12 col-md-6 col-lg-4 col-xl-4'>
                        <Input placeholder="Search for food or drink" onChange={handleChange} value={search}/>
                        <InputGroupAddon addonType="append"><Button onClick={handleSearch}>Click to search</Button></InputGroupAddon>
                    </InputGroup>
            
                
                {isSearching ? 
                <Spinner className="checkin-spinner">
                </Spinner>
                :
                <FoodCard foods={foods}/>
                }
            
            {
                error.val === null ? null 
                : 
                <Fade in={error.val}>
                    <Alert className='checkin-alert' color={error.color}>{error.val}</Alert>
                </Fade>
                
            }
                </UncontrolledCollapse>
            </div>
            </>
        }
        </>
    )
}

export default CheckIn;
