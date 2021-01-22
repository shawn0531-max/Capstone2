import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getAllFavs, deleteFav, getDailyCals } from './actions';
import NavBar from './NavBar';
import { Table, Button } from 'reactstrap';
import './FavFoods.css';

/** Table of user favorites that allows user to add foods for daily calorie/macro totals or remove a favorite **/
const FavFoods = () =>{

    const dispatch = useDispatch();
    const history = useHistory();
    const {username} = useParams();

    useEffect(() =>{
        dispatch(getAllFavs(username));
        dispatch(getDailyCals(username));
    }, [dispatch, username])

    let {favs} = useSelector(store => store.favorites);
    let {cals} = useSelector(store => store.cals)

    const handleAddCals = (e) =>{
        history.push(`/user/${username}/add/${e.target.id}`)
    }

    /** Confirms user wants to remove a favorite from the list **/
    const handleDelete = (e) =>{

        let remove = window.confirm('Do you want to remove this item from your favorites?');

        if(remove){
            deleteFav(e.target.id, username);
            setTimeout(()=>{
                favs = dispatch(getAllFavs(username));
            }, 0)
        }
    }

    return(
        <>
        <NavBar />
        <h1 className='favList-title'>Favorite Foods and Drinks</h1>
        {<Table className='favList-table'>
        <thead>
            <tr key={Math.floor(Math.random()*100)}>
            <th></th>
            <th className='favList-headers'>Food</th>
            <th className='favList-headers'>Calories</th>
            <th className='favList-headers'>Protein</th>
            <th className='favList-headers'>Carbohydrates</th>
            <th className='favList-headers'>Fat</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            {   !favs.favs ?
                favs.map(fav =>(
                    
                    <tr key={fav.id}>  
                        <td><Button className='favList-add-btn' disabled={cals === undefined ? false : true} onClick={handleAddCals} id={fav.food}>Add</Button></td>    
                        <th className='favList-data'>{fav.food}</th>
                        <td className='favList-data'>{fav.cals}</td>
                        <td className='favList-data'>{fav.protein}</td>
                        <td className='favList-data'>{fav.carbs}</td>
                        <td className='favList-data'>{fav.fat}</td>
                        <td><Button className='favList-remove-btn' onClick={handleDelete} id={fav.id} color='danger'>Remove</Button></td>
                    </tr>
                    
                ))
                :
                null
            }
        </tbody>
        </Table>}
        </>
    )
}

export default FavFoods;