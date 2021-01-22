import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getUserInfo } from './actions';
import { calCalc } from './helpers/calCalc';
import { postRecommendations, getRecommendations, updateRecommends } from './actions';
import { Spinner, Label, Button } from 'reactstrap';
import './InfoCheck.css';

/** Form that allows user to verify information entered for BMR calculation before continuing **/
const InfoCheck = () =>{

    const dispatch = useDispatch();
    const history = useHistory();
    const {username} = useParams();

    
    useEffect(()=>{
        dispatch(getUserInfo(username));
        dispatch(getRecommendations(username));
    }, [dispatch, username]);

    const {user} = useSelector(store => store.user);
    const {recommendations} = useSelector(store => store);

    let infoArr;

    if(user.curr_bmr){
        infoArr = calCalc(user.curr_bmr, user.curr_goal, user.curr_experience, user.curr_activity, user.gender, user.curr_weight)
    }

    const handleCorrect = async() =>{
        if(recommendations.cals){
            await updateRecommends(username, infoArr);
            history.push(`/user/${username}/profile`);
        } else{
            dispatch(postRecommendations(username, infoArr));
            history.push(`/user/${username}/profile`);
        }
    }

    const handleEdit = () =>{
        history.goBack();
    }

    return(
        <div className='infoCheck-div'>
        {!user.curr_bmr ? 
        <>
            <Spinner className="text-default">
            </Spinner>
        </>
        :
        <>
            <h1 className='infoCheck-title'>Is this information correct?</h1>
            <hr className='infoCheck-hr'/>
            <Label className='infoCheck-label-user-info' htmlFor='username'>Username:</Label>
            <p className='infoCheck-user-info' name='username'>{user.username}</p>
            <Label className='infoCheck-label-user-info' htmlFor='date'>Joined on:</Label>
            <p className='infoCheck-user-info' name='date'>{user.date_joined.slice(5,10)+ '-' +user.date_joined.slice(0,4)}</p>
            <br/>
            <Label className='infoCheck-label-user-info' htmlFor='height'>Height:</Label>
            <p className='infoCheck-user-info' name='height'>{user.curr_height}</p>
            <Label className='infoCheck-label-user-info' htmlFor='weight'>Weight:</Label>
            <p className='infoCheck-user-info' name='weight'>{user.curr_weight}</p>
            <Label className='infoCheck-label-user-info' htmlFor='age'>Age:</Label>
            <p className='infoCheck-user-info' name='age'>{user.curr_age}</p>
            <br/>
            <Label className='infoCheck-label-user-info' htmlFor='activity'>Activity:</Label>
            <p className='infoCheck-user-info' name='activity'>{user.curr_activity}</p>
            <Label className='infoCheck-label-user-info' htmlFor='goal'>Goal:</Label>
            <p className='infoCheck-user-info' name='goal'>{user.curr_goal}</p>
            <Label className='infoCheck-label-user-info' htmlFor='experience'>Experience:</Label>
            <p className='infoCheck-user-info' name='experience'>{user.curr_experience}</p>
            <div>
                <br/>
                <Button className='infoCheck-correct-btn' onClick={handleCorrect}>Correct</Button>
                <Button className='infoCheck-edit-btn' onClick={handleEdit}>Edit</Button>
            </div>
        </>
        }
        </div>
    )
}

export default InfoCheck;