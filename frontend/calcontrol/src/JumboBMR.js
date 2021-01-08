import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

const JumboBMR = () => {

    const {username, BMR} = useParams();
    const history = useHistory();
    
    const handleClick = () =>{
        history.push(`/user/${username}/editBMR`);
    }

  return (
    <div>
      <Jumbotron>
        <h2 className="display-3">BMR Change</h2>
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
        <p className="lead">Please re-calculate your BMR. Your weight has changed too much for your goal to maintain your current weight.</p>
        :
        null
        }
          <Button type='button' onClick={handleClick} color="primary">Okay</Button>
      </Jumbotron>
    </div>
  );
};

export default JumboBMR;