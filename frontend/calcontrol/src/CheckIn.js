import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOldWeights, getUserInfo } from './actions';
import { twoWeeksCalc } from './helpers/twoWeeksCalc';
import { calChangeCheck } from './helpers/calChangeCheck';
import NavBar from './NavBar';
import { Spinner, Label, ListGroup, ListGroupItem, Progress, Badge } from 'reactstrap';
import './CheckIn.css';

const CheckIn = () =>{

    const dispatch = useDispatch();
    const {username} = useParams();

    useEffect(()=> {
        dispatch(getUserInfo(username));
        dispatch(getOldWeights(username, twoWeeksCalc()));
    }, [dispatch, username])
    
    
    let {user} = useSelector(store => store.user)
    let {weights} = useSelector(store => store.weights)

    
    if(weights.length > 0){
        calChangeCheck(weights);
    }

    return(
        <>
            <NavBar />
        { !user.id ?
            <>
            <Spinner className="text-default">
            </Spinner>
            </>
            :
            <>
            <div>
                <div className='user-div col-xs-12 col-md-8 col-xl-8'>
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
                    <div className='progress-div'>
                    <Progress multi>
                        <Progress bar color="danger" value={0.55} max={1}>protein %</Progress>
                        <Progress bar color='primary' value={0.45} max={1}>carbs %</Progress>
                        <Progress bar color="warning" value={0.2} max={1}>fat %</Progress>
                    </Progress>
                    </div>
                </div>
                <div className='list-div col-xs-12 col-md-4 col-xl-4'>
                    <ListGroup>
                        <ListGroupItem><b>Daily Goals</b><Badge></Badge></ListGroupItem>
                        <ListGroupItem>Calories eaten of recommended</ListGroupItem>
                        <ListGroupItem>Protein eaten of recommended <Badge color='danger' pill={true}> </Badge></ListGroupItem>
                        <ListGroupItem>Carbohydrates eaten of recommended <Badge color='primary' pill={true}> </Badge></ListGroupItem>
                        <ListGroupItem>Fats eaten of recommended <Badge color='warning' pill={true}> </Badge></ListGroupItem>
                    </ListGroup>
                </div>
            </div>
            </>
        }
        </>
    )
}

export default CheckIn;
