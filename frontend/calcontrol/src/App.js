import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './Home';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import BMRForm from './BMRForm';
import CheckIn from './CheckIn';
import Profile from './Profile';
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
       <Route exact path="/user/:username/BMR">
        <BMRForm />
       </Route>
       <Route exact path="/user/:username/profile">
         <Profile />
       </Route>
     </Switch>
    </div>
  );
}

export default App;
