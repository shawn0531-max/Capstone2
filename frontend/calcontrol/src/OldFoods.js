import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import TodayFoodList from './TodayFoodList';
import { getDateFood } from './actions';
import NavBar from './NavBar';
import { Label, Input, Button } from 'reactstrap';

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
        <h5>Enter the date of foods you want to edit</h5>
        <Label htmlFor='month' >Month: </Label>
        <Input type='text' name='month' placeholder={1} onChange={handleChange} value={month}></Input>
        <Label htmlFor='day'>Day: </Label>
        <Input type='text' name='day' placeholder={1} onChange={handleChange} value={day}></Input>
        <Label htmlFor='year'>Year: </Label>
        <Input type='text' name='year' placeholder={2021} onChange={handleChange} value={year}></Input>
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={handleBack}>Back</Button>
        {foods !== undefined && foods[0] ? <TodayFoodList foods={foods}/> : null}
    </>
    )
}

export default OldFoods;