import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { deleteFoodInfo, getDailyCals, getDateFood } from './actions';
import { Table, Button } from 'reactstrap';
import './TodayFoodList.css';

/** Table that displays food added by the user for the current day **/
const TodayFoodList = ({foods = undefined}) =>{

    const dispatch = useDispatch();
    const history = useHistory();
    const {username} = useParams();

    useEffect(()=>{
        dispatch(getDailyCals(username));
    }, [dispatch, username]);

    let {cals} = useSelector(store => store.cals);

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
            <th className='foodlist-table-headers'>Food</th>
            <th className='foodlist-table-headers'>Calories</th>
            <th className='foodlist-table-headers'>Protein</th>
            <th className='foodlist-table-headers'>Carbohydrates</th>
            <th className='foodlist-table-headers'>Fat</th>
            <th className='foodlist-table-headers'>Amount</th>
            </tr>
        </thead>
        <tbody>
            {   foods[0] ?
                foods.map(food =>(
                    
                    <tr key={food.id}>
                        <td><Button className='foodlist-table-remove-btn' disabled={cals === undefined ? false : true} onClick={confirmDelete} id={food.id} color='danger'>Remove</Button></td>   
                        <td><Button className='foodlist-table-edit-btn' disabled={cals === undefined ? false : true} onClick={handleEdit} id={food.id} color='light'>Edit</Button></td>    
                        <th className='foodlist-table-data'>{food.food}</th>
                        <td className='foodlist-table-data'>{food.cals}</td>
                        <td className='foodlist-table-data'>{food.protein}</td>
                        <td className='foodlist-table-data'>{food.carbs}</td>
                        <td className='foodlist-table-data'>{food.fat}</td>
                        <td className='foodlist-table-data'>{food.amount}</td>
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