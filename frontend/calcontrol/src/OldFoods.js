import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import TodayFoodList from './TodayFoodList';
import { getDateFood } from './actions';
import NavBar from './NavBar';
import { Label, Input, Button } from 'reactstrap';
import './OldFoods.css';

/** Allows user to search for foods entered on specified date. User can then edit that information if they want **/
const OldFoods = () =>{

    const {username} = useParams();
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();

    const handleChange = (e) => {
        if(e.target.name === 'month'){
            setMonth(e.target.value);
        } else if(e.target.name === 'day'){
            setDay(e.target.value);
        } else if(e.target.name === 'year'){
            setYear(e.target.value)
        }
    }

    const handleSearch = () =>{
        let searchDate = `${month}-${day}-${year}`;

        let dateCheck = Date.parse(searchDate);

        if(isNaN(dateCheck)){
            alert('Please enter a valid date')
        } else {
            dispatch(getDateFood(username, searchDate));
        }
    }

    const handleBack = () =>{
        history.goBack();
    }

    let {foods} = useSelector(store => store.foods);

    return(
        <>
        <NavBar />
        <h2 className='oldFoods-title'>Enter the date of foods you want to edit</h2>
        <Label className='oldFoods-label' htmlFor='month' >Month</Label>
        <Input className='oldFoods-input col-xs-10 col-md-4' type='text' name='month' placeholder={1} onChange={handleChange} value={month}></Input>
        <Label className='oldFoods-label' htmlFor='day'>Day</Label>
        <Input className='oldFoods-input col-xs-10 col-md-4' type='text' name='day' placeholder={1} onChange={handleChange} value={day}></Input>
        <Label className='oldFoods-label' htmlFor='year'>Year</Label>
        <Input className='oldFoods-input col-xs-10 col-md-4' type='text' name='year' placeholder={2021} onChange={handleChange} value={year}></Input>
        <Button className='oldFoods-search-btn' onClick={handleSearch}>Search</Button>
        <Button className='oldFoods-back-btn' onClick={handleBack}>Back</Button>
        {foods !== undefined && foods[0] ? <TodayFoodList foods={foods}/> : null}
    </>
    )
}

export default OldFoods;