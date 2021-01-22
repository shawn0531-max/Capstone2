import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';
import './JumboBMR.css';

/** Displays information to user if it is determined based on weight change that
 *  their BMR information needs updated **/
const JumboBMR = () => {

    const {username, BMR} = useParams();
    const history = useHistory();
    
    const handleClick = () =>{
        history.push(`/user/${username}/editBMR`);
    }

  return (
    <div>
      <Jumbotron className='BMR-jumbo col-xs-10 col-md-9'>
        <h2 className="display-3 BMR-title">BMR Change</h2>
        {BMR === 'BMRL' ? 
        <p className="lead">Please re-calculate your BMR. Your change in weight is too rapid. We aim for slow consistent weight loss.</p>
        :
        null
        }
        {BMR === 'BMRG' ? 
        <p className="lead">Please re-calculate your BMR. Your change in weight is too rapid. We aim for slow consistent weight gain to limit fat gain and prioritize muscle gain.</p>
        :
        null
        }
        {BMR === 'BMRM' ? 
        <p className="lead">Please re-calculate your BMR. Your weight has changed too much for your goal of maintaining your current weight.</p>
        :
        null
        }
          <Button className='BMR-jumbo-btn' type='button' onClick={handleClick} color="secondary">Okay</Button>
      </Jumbotron>
    </div>
  );
};

export default JumboBMR;