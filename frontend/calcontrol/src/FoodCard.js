import React from 'react';
import {v4 as uuid} from 'uuid';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardText, CardTitle, Button, Row, Col, Label} from 'reactstrap';
import './FoodCard.css';

/** Card shown after food search with information on the food in question **/
const FoodCard = ({foods}) =>{

    const history = useHistory();
    const {username} = useParams();

    const handleClick = (e) =>{
        history.push(`/user/${username}/add/${e.target.id}`);
    }
    
    return (
        <>
        {
            foods ?
            foods.map(food =>(
        <Col key={uuid()} className='foodcard col-xs-12 col-md-5 col-lg-3'>
        <Card>
            <CardHeader className='foodcard-head'>{food.name} (per 100 grams)</CardHeader>
                <CardBody className='foodcard-body'>
                    <Row>
                        <Label htmlFor='cals' tag="h5"><b>Calories:</b></Label>
                        <CardTitle name='cals' tag="h5">{food.calories}</CardTitle>
                    </Row>
                    <Row>
                        <Label htmlFor='protein'><b>Protein:</b></Label>
                        <CardText name='protein'>{food.protein_g}</CardText>
                    </Row>
                    <Row>
                        <Label htmlFor='carbs'><b>Carbohydrates:</b></Label>
                        <CardText name='carbs'>{food.carbohydrates_total_g}</CardText>
                    </Row>
                    <Row>
                        <Label htmlFor='fats'><b>Fats:</b></Label>
                        <CardText name='fats'>{food.fat_total_g}</CardText>
                    </Row>
                        <Button id={food.name} onClick={handleClick}>Enter Amount</Button>
                </CardBody>
        </Card>
        </Col>
            ))
            :
            null
        }
        </>
    )
}

export default FoodCard;