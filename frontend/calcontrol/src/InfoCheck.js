import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getUserInfo } from './actions';
import { calCalc } from './helpers/calCalc';
import { postRecommendations, getRecommendations, updateRecommends } from './actions';
import { Spinner, Label, Button } from 'reactstrap';

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
        <div>
        {!user.curr_bmr ? 
        <>
        <Spinner className="text-default">
        </Spinner>
        </>
        :
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

                    <h2>Is this information correct?</h2>
                    <div>
                        <Button onClick={handleCorrect}>Correct</Button>
                        <Button onClick={handleEdit}>Edit</Button>
                    </div>
        </>
        }
        </div>
    )
}

export default InfoCheck;