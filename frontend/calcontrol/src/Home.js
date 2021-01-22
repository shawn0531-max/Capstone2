import React from 'react';
import NavBar from './NavBar';
import './Home.css';

/** Welcome page **/
const Home = () =>{
    return(
        <>
            <NavBar />
            <h2 className="homeWelcome">Welcome to...</h2>
            <h1 className="homeTitle">CalControl</h1>
        </>
    )
}

export default Home;