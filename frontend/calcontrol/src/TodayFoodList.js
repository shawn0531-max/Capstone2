import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { deleteFoodInfo, getDateFood } from './actions';
import { Table, Button } from 'reactstrap';

const TodayFoodList = ({foods = undefined}, {cals}) =>{

    const dispatch = useDispatch();
    const history = useHistory();
    const {username} = useParams();


    const confirmDelete = (e) =>{

        let date = Date();
        date = date.slice(4,15);

        let doDelete = window.confirm('Do you want to delete this item?');

        if(doDelete){
            dispatch(deleteFoodInfo(username, e.target.id));
            setTimeout(()=>{
               foods =  dispatch(getDateFood(username, date));
            }, 0);
        }
    }

    const handleEdit = (e) =>{
        history.push(`/user/${username}/edit/${e.target.id}`)
    }

    return(
        <Table>
        <thead>
            <tr key={0}>
            <th></th>
            <th></th>
            <th>Food</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbohydrates</th>
            <th>Fat</th>
            <th>amount</th>
            </tr>
        </thead>
        <tbody>
            {   foods[0] ?
                foods.map(food =>(
                    
                    <tr key={food.id}>
                        <td><Button disabled={cals === null ? false : true} onClick={confirmDelete} id={food.id} >Remove</Button></td>   
                        <td><Button disabled={cals === null ? false : true} onClick={handleEdit} id={food.id}>Edit</Button></td>    
                        <th>{food.food}</th>
                        <td>{food.cals}</td>
                        <td>{food.protein}</td>
                        <td>{food.carbs}</td>
                        <td>{food.fat}</td>
                        <td>{food.amount}</td>
                    </tr>
                    
                ))
                :
                null
            }
        </tbody>
        </Table>
    )
}

export default TodayFoodList;