import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getChartInfo } from './actions';
import NavBar from './NavBar';
import TrackingChart from './TrackingChart';
import { Input, InputGroup, Label } from 'reactstrap';


const Profile = () =>{

    let dateToday = new Date()
    let yearToday = dateToday.getFullYear();
    let monthToday = dateToday.getMonth() + 1;
    
    
    const dispatch = useDispatch();
    const {username} = useParams();
    const [dateInfo, setDateInfo] = useState({monthNum: monthToday, 'year': yearToday});

    useEffect(()=> {

        dispatch(getChartInfo(username, dateInfo.monthNum, dateInfo.year));
    
    }, [dispatch, username, dateInfo])

    let weightsArr = [];
    let calsArr = [];
    let info = useSelector(store => store.info)
    
   if(!info.info){
        for(let i = 0; i < info[0][0].length; i++){
            weightsArr.push(Number(info[0][0][i].user_weight));
        }
        for(let j = 0; j < info[0][1].length; j++){
            calsArr.push(Number(info[0][1][j].user_cal));
        }
   }

   const handleChange = e => {
    const {name, value} = e.target;
    
    setDateInfo(info =>({
        ...info,
        [name]: value
    }));
};

   
    return(
        <>
        <NavBar />
        <div>
            <h1>Profile</h1>
            <InputGroup>
            <Label htmlFor='monthNum'>Month</Label>
            <Input type='select' name='monthNum' id='monthNum' onChange={handleChange} value={dateInfo.monthNum}>
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
            </Input>
            <Label htmlFor='year'>Year</Label>
            <Input type='select' name='year' id='year' onChange={handleChange} value={dateInfo.year}>
            <option disabled value="" hidden>Choose an option...</option>
                <option>2019</option>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
            </Input>
            </InputGroup>
            {!info.info ? <TrackingChart weightsArr={!info.info ? weightsArr : []} calsArr={!info.info ? calsArr : []} />
                       : null}
            
        </div>
        </>
    )
}

export default Profile;