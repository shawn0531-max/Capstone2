import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getRecommendations } from './actions';
import { Jumbotron, Button } from 'reactstrap';
import './UpdateInfo.css';

  /** Notifies user that their recommendations have been updated and shows them the new values **/
const UpdateInfo = () => {

    const {username} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{

        dispatch(getRecommendations(username));

    }, [dispatch, username]);

    let recommendations = useSelector(store => store.recommendations);

    const handleClick = () =>{
        history.push(`/user/${username}/profile`);
    }

    return (
        <div>
          <Jumbotron className='updateInfo-jumbo col-xs-10 col-md-9'>
            <h1 className="display-3">Recommendations Updated</h1>
            <p className="lead">{recommendations.cals ? 
            `Recommended calories are updated every two weeks upon log in based on your weight change and goals. 
            This time your new goals are ${recommendations.cals} calories, ${recommendations.protein}g protein, ${recommendations.carbs}g carbs, ${recommendations.fats}g fat`
            :
            null
            }
            </p>
            <p className="lead">
              <Button className='updateInfo-btn' onClick={handleClick} color="secondary">Okay</Button>
            </p>
          </Jumbotron>
        </div>
      );
}

export default UpdateInfo;