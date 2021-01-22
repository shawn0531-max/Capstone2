import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './Home';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import BMRForm from './BMRForm';
import CheckIn from './CheckIn';
import Profile from './Profile';
import InfoCheck from './InfoCheck';
import AddFoodForm from './AddFoodForm';
import EditFoodForm from './EditFoodForm';
import OldFoods from './OldFoods';
import EditUserInfo from './EditUserInfo';
import FavFoods from './FavFoods';
import EditBMRForm from './EditBMRForm';
import DailyWeight from './DailyWeight';
import JumboBMR from './JumboBMR';
import UpdateInfo from './UpdateInfo';
import './App.css';

function App() {
  return (
    <div className="App">
     <Switch>
       <Route exact path="/">
        <Home />
       </Route>
       <Route exact path="/signup">
        <SignupForm />
       </Route>
       <Route exact path="/login">
        <LoginForm />
       </Route>
       <Route exact path="/user/:username/checkin">
        <CheckIn />
       </Route>
       <Route exact path="/user/:username/info">
        <InfoCheck />
       </Route>
       <Route exact path="/user/:username/BMR">
        <BMRForm />
       </Route>
       <Route exact path="/user/:username/infoBMR/:BMR">
        <JumboBMR />
       </Route>
       <Route exact path="/user/:username/editBMR">
        <EditBMRForm />
       </Route>
       <Route exact path="/user/:username/profile">
         <Profile />
       </Route>
       <Route exact path='/user/:username/update'>
         <UpdateInfo />
       </Route>
       <Route exact path="/user/:username/prevfoods">
         <OldFoods />
       </Route>
       <Route exact path="/user/:username/editinfo">
         <EditUserInfo />
       </Route>
       <Route exact path="/user/:username/favorites">
         <FavFoods />
       </Route>
       <Route exact path="/user/:username/add/:food">
        <AddFoodForm />
       </Route>
       <Route exact path="/user/:username/addweight">
         <DailyWeight />
       </Route>
       <Route exact path="/user/:username/edit/:foodId">
         <EditFoodForm />
       </Route>
     </Switch>
    </div>
  );
}

export default App;
