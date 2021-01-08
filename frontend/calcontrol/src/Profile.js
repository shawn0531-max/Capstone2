import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getChartInfo, getUserInfo, getWeightInfo, getRecommendations, 
         updateCheckDate, updateRecommends, updateBiweekWeight } from './actions';
import { twoWeeksCheck } from './helpers/twoWeeksCheck';
import { calChangeCheck } from './helpers/calChangeCheck';
import { changeCalLogic } from './helpers/changeCalLogic';
import { calUpdateCalc } from './helpers/calUpdateCalc';
import NavBar from './NavBar';
import TrackingChart from './TrackingChart';
import { Input, InputGroup, Label } from 'reactstrap';


const Profile = () =>{

    let dateToday = new Date()
    let yearToday = dateToday.getFullYear();
    let monthToday = dateToday.getMonth() + 1;
    
    const history = useHistory();
    const dispatch = useDispatch();
    const {username} = useParams();
    const [dateInfo, setDateInfo] = useState({monthNum: monthToday, 'year': yearToday});

    useEffect(()=> {

        dispatch(getUserInfo(username));
        dispatch(getChartInfo(username, dateInfo.monthNum, dateInfo.year));
        dispatch(getRecommendations(username));
    }, [dispatch, username, dateInfo])

    let weightsArr = [];
    let calsArr = [];
    let info = useSelector(store => store.info);
    let {user} = useSelector(store => store.user);
    let recommends = useSelector(store => store.recommendations);

    const getWeights = async(startDate, endDate) =>{
        let weights = await getWeightInfo(username, startDate, endDate);
        return weights;
    }
    
    let weightResp;
    let weeklyWeightChange;
    let newCalTotal;
    let newWeight;

    if(user.biweek_check_date){
        let check = twoWeeksCheck(user.biweek_check_date, dateToday)
        if (check){
            setTimeout(async()=>{
                weightResp = await getWeights(check[1], check[0]);
                if(weightResp){
                    weeklyWeightChange = calChangeCheck(weightResp);
                    let cal = changeCalLogic(calChangeCheck(weightResp), user.curr_goal);
                    if(cal === 'BMRL'){
                        let today = Date();
                        today = today.slice(4,15);
                        setTimeout( async()=>{
                            let resp = await updateCheckDate(username, today);
                            history.push(`/user/${username}/infoBMR/${cal}`);
                        },0)
                    } else if(cal === 'BMRG'){
                        let today = Date();
                        today = today.slice(4,15);
                        setTimeout( async()=>{
                            let resp = await updateCheckDate(username, today);
                            history.push(`/user/${username}/infoBMR/${cal}`);
                        },0)
                    } else if(cal === 'BMRM'){
                        let today = Date();
                        today = today.slice(4,15);
                        setTimeout( async()=>{
                            let resp = await updateCheckDate(username, today);
                            history.push(`/user/${username}/infoBMR/${cal}`);
                        },0)
                    } else {
                        if(recommends.cals){
                            newCalTotal = parseFloat(recommends.cals) + cal;    
                            newWeight = parseFloat(user.curr_weight) + (weeklyWeightChange * 2);

                            let newMacros = calUpdateCalc(user.curr_goal, newCalTotal, newWeight);
    
                            setTimeout(async()=>{
                                let updateRecs = await updateRecommends(username, [newCalTotal, newMacros]);
                                if(updateRecs.data){
                                    let weightCheck = await updateBiweekWeight(username, newWeight);
                                    if(weightCheck.data){
                                        let thisDay = Date();
                                        thisDay = thisDay.slice(4,15);
                                        let resp = await updateCheckDate(username, thisDay);
                                        if(resp.biweek_check_date){
                                            alert(`Recommended calories are updated every two weeks upon log in based on your weight change and goals. This time your new goals are ${newCalTotal} calories, ${newMacros.protein}g protein, ${newMacros.carbs}g carbs, ${newMacros.fats}g fat`)
                                        }
                                    }
                                }
                            }, 0)
                        }
                    }
                }
                
            }, 0);
        }
    }
    
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
            <div>
                { user.username ?
            <>
                    <Label className='label-user-info' htmlFor='username'>Username:</Label>
                    <p className='user-info' name='username'>{user.username}</p>
                    <Label className='label-user-info' htmlFor='date'>Joined on:</Label>
                    <p className='user-info' name='date'>{user.date_joined.slice(5,10)+ '-' +user.date_joined.slice(0,4)}</p>
                    <br/>
                    <Label className='label-user-info' htmlFor='height'>Height:</Label>
                    <p className='user-info' name='height'>{user.curr_height}</p>
                    <Label className='label-user-info' htmlFor='weight'>Weight:</Label>
                    <p className='user-info' name='weight'>{user.curr_weight}</p>
                    <Label className='label-user-info' htmlFor='age'>Age:</Label>
                    <p className='user-info' name='age'>{user.curr_age}</p>
                    <br/>
                    <Label className='label-user-info' htmlFor='activity'>Activity:</Label>
                    <p className='user-info' name='activity'>{user.curr_activity}</p>
                    <Label className='label-user-info' htmlFor='goal'>Goal:</Label>
                    <p className='user-info' name='goal'>{user.curr_goal}</p>
                    <Label className='label-user-info' htmlFor='experience'>Experience:</Label>
                    <p className='user-info' name='experience'>{user.curr_experience}</p>
                    <Link to={`/user/${username}/editBMR`} >Edit Profile</Link>
                    {/* <Link to={`/user/${username}/prevfoods`} >Edit Old Foods</Link> */}
                    <Link to={`/user/${username}/editinfo`}>Change Password/Email</Link>
                    </>
                    :
                    null}
            </div>

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