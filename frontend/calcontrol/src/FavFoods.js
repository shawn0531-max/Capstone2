import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getAllFavs, deleteFav, getDailyCals } from './actions';
import NavBar from './NavBar';
import { Table, Button } from 'reactstrap';

const FavFoods = () =>{

    const dispatch = useDispatch();
    const history = useHistory();
    const {username} = useParams();

    useEffect(() =>{
        dispatch(getAllFavs(username));
        dispatch(getDailyCals(username));
    }, [dispatch, username])

    let favs = useSelector(store => store.favorites);
    let {cals} = useSelector(store => store.cals)

    const handleAddCals = (e) =>{
        history.push(`/user/${username}/add/${e.target.id}`)
    }

    const handleDelete = (e) =>{

        let remove = window.confirm('Do you want to remove this item from your favorites?');

        if(remove){
            let resp = deleteFav(e.target.id, username);
            setTimeout(()=>{
                favs = dispatch(getAllFavs(username));
            }, 0)
        }
    }

    return(
        <>
        <NavBar />
        {<Table>
        <thead>
            <tr key={Math.floor(Math.random()*100)}>
            <th></th>
            <th></th>
            <th>Food</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbohydrates</th>
            <th>Fat</th>
            </tr>
        </thead>
        <tbody>
            {   !favs.favs ?
                favs.map(fav =>(
                    
                    <tr key={fav.id}>
                        <td><Button onClick={handleDelete} id={fav.id} >Remove</Button></td>   
                        <td><Button disabled={cals === null ? false : true} onClick={handleAddCals} id={fav.food}>Add</Button></td>    
                        <th>{fav.food}</th>
                        <td>{fav.cals}</td>
                        <td>{fav.protein}</td>
                        <td>{fav.carbs}</td>
                        <td>{fav.fat}</td>
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