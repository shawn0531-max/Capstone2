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
import './Profile.css';

  /** Displays user's current information, shows graph of weights/calories based on month/year paring,
   *  allows user to change password/email or their current information **/
const Profile = () =>{

    let dateToday = new Date()
    let yearToday = dateToday.getFullYear();
    let monthToday = dateToday.getMonth() + 1;
    
    const history = useHistory();
    const dispatch = useDispatch();
    const {username} = useParams();
    const [dateInfo, setDateInfo] = useState({monthNum: monthToday, 'year': yearToday});

    useEffect(()=> {
        try {
            dispatch(getUserInfo(username));
            dispatch(getChartInfo(username, dateInfo.monthNum, dateInfo.year));
            dispatch(getRecommendations(username));  
        } catch (err) {
            console.log(err)
        }
    }, [dispatch, username, dateInfo])

    let info = useSelector(store => store.info);
    let {user} = useSelector(store => store.user);
    let recommends = useSelector(store => store.recommendations);

      /** Gets user weights from previous two weeks to determine changes to recommendations **/
    const getWeights = async(startDate, endDate) =>{
        let weights = await getWeightInfo(username, startDate, endDate);
        return weights;
    }
    
    let weightResp;
    let weeklyWeightChange;
    let newCalTotal;
    let newWeight;

    if(user.biweek_check_date){
          /** Checks if it has been two weeks since the last weight change check returns the two dates
           *  or false if it hasn't been two weeks **/
        let check = twoWeeksCheck(user.biweek_check_date, dateToday)
        if (check){
            setTimeout(async()=>{
                /** If it has been two weeks get the weights in the date range in the form of an array **/
                weightResp = await getWeights(check[1], check[0]);
                if(weightResp){
                    /** Calculates weight change per week from weight array **/
                    weeklyWeightChange = calChangeCheck(weightResp);
                    /** Checks if calories need to be changed based on determined logic that uses weight change per week
                     *  and current user goal. If weight change is too much returns BMR(L,G,M) string meaning user should
                     *  re-enter their information for their BMR else returns suggested change in calories per day **/
                    let cal = changeCalLogic(calChangeCheck(weightResp), user.curr_goal);
                    /** If weight change is too much redirects user to informational page on why they should update their
                     *  BMR information **/
                    if(cal === 'BMRL'){
                        let today = Date();
                        today = today.slice(4,15);
                        setTimeout( async()=>{
                            await updateCheckDate(username, today);
                            history.push(`/user/${username}/infoBMR/${cal}`);
                        },0)
                    } else if(cal === 'BMRG'){
                        let today = Date();
                        today = today.slice(4,15);
                        setTimeout( async()=>{
                            await updateCheckDate(username, today);
                            history.push(`/user/${username}/infoBMR/${cal}`);
                        },0)
                    } else if(cal === 'BMRM'){
                        let today = Date();
                        today = today.slice(4,15);
                        setTimeout( async()=>{
                        await updateCheckDate(username, today);
                            history.push(`/user/${username}/infoBMR/${cal}`);
                        },0)
                    } else {
                        /** If change in calories is returned calculate a new daily calorie total and updates
                         *  current user weight based on weight change **/
                        if(recommends.cals){
                            newCalTotal = parseFloat(recommends.cals) + cal;    
                            newWeight = parseFloat(user.curr_weight) + (weeklyWeightChange * 2);

                            /** Calculates new daily macro totals based on current goal, new daily calories total, 
                             *  and new weight **/
                            let newMacros = calUpdateCalc(user.curr_goal, newCalTotal, newWeight);
    
                            setTimeout(async()=>{
                                /** Updates recommendations, updates current user weight, 
                                 *  sets the check date to two weeks from current date and
                                 *  sends user to informational page about changes that happened**/
                                let updateRecs = await updateRecommends(username, [newCalTotal, newMacros]);
                                if(updateRecs.data){
                                    let weightCheck = await updateBiweekWeight(username, newWeight);
                                    if(weightCheck.data){
                                        let thisDay = Date();
                                        thisDay = thisDay.slice(4,15);
                                        let resp = await updateCheckDate(username, thisDay);
                                        if(resp.biweek_check_date){
                                            history.push(`/user/${username}/update`);
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
        <div className='profile-info-div'>
            <h1 className='profile-title'>Profile</h1>
            <div>
                { user.username ?
            <>
                    <Label className='profile-label-user-info' htmlFor='username'>Username:</Label>
                    <p className='profile-user-info' name='username'>{user.username}</p>
                    <Label className='profile-label-user-info' htmlFor='date'>Joined on:</Label>
                    <p className='profile-user-info' name='date'>{user.date_joined.slice(5,10)+ '-' +user.date_joined.slice(0,4)}</p>
                    <Label className='profile-label-user-info' htmlFor='height'>Height:</Label>
                    <p className='profile-user-info' name='height'>{user.curr_height}</p>
                    <Label className='profile-label-user-info' htmlFor='weight'>Weight:</Label>
                    <p className='profile-user-info' name='weight'>{user.curr_weight}</p>
                    <Label className='profile-label-user-info' htmlFor='age'>Age:</Label>
                    <p className='profile-user-info' name='age'>{user.curr_age}</p>
                    <br/>
                    <Label className='profile-label-user-info' htmlFor='activity'>Activity:</Label>
                    <p className='profile-user-info' name='activity'>{user.curr_activity}</p>
                    <Label className='profile-label-user-info' htmlFor='goal'>Goal:</Label>
                    <p className='profile-user-info' name='goal'>{user.curr_goal}</p>
                    <Label className='profile-label-user-info' htmlFor='experience'>Experience:</Label>
                    <p className='profile-user-info' name='experience'>{user.curr_experience}</p>
                    <br/>
                    <Link className='profile-edit-link' to={`/user/${username}/editBMR`} >Edit Profile</Link>
                    {/* <Link to={`/user/${username}/prevfoods`} >Edit Old Foods</Link> */}
                    <Link className='profile-change-link' to={`/user/${username}/editinfo`}>Change Password/Email</Link>
                    </>
                    :
                    null}
            </div>
            <div className='profile-input-div col-md-6 col-lg-8 col-xl-8'>
            <InputGroup className='profile-month-year-group'>
            <Label className='profile-month-label' htmlFor='monthNum'>Month</Label>
            <Input className='profile-month-input' type='select' name='monthNum' id='monthNum' onChange={handleChange} value={dateInfo.monthNum}>
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
            <Label className='profile-year-label' htmlFor='year'>Year</Label>
            <Input className='profile-year-input' type='select' name='year' id='year' onChange={handleChange} value={dateInfo.year}>
            <option disabled value="" hidden>Choose an option...</option>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
                <option>2029</option>
                <option>2030</option>
            </Input>
            </InputGroup>
            </div>
            {!info.info ? <TrackingChart info={info} />
                       : <h3 className='profile-noinfo'>No information yet</h3>}
            
        </div>
        </>
    )
}

export default Profile;