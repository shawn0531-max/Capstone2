/** Takes weight change per week and user's current goal as arguments
 *  Returns suggested calorie change based on the two **/
export const changeCalLogic = (weightChange, goal) =>{
    let cals = 0;

    if(goal === 'Lose Weight'){
        if(weightChange >= -0.2){
            cals = -100;
        } else if(weightChange <= -1.5 && weightChange >= -2.0){
            cals = 50;
        } else if(weightChange < -2.0 && weightChange >= -2.5){
            cals = 100;
        } else if(weightChange < 2.5){
            cals = 'BMRL';
        }
    }

    if(goal === 'Gain Weight'){
        if(weightChange <= 0.1){
            cals = 100;
        } else if(weightChange >= 0.75 && weightChange <= 1.25){
            cals = -50
        } else if(weightChange > 1.25 && weightChange <= 1.5){
            cals = -150
        } else if(weightChange > 1.5){
            cals = 'BMRG'
        }
    }

    if(goal === 'Maintain Weight'){
        if(weightChange <= -0.7 && weightChange >= -1){
            cals = 75;
        } else if(weightChange < -1 && weightChange >= -1.5){
            cals = 150;
        } else if(weightChange < -1.5){
            cals = 'BMRM';
        } else if(weightChange >= 0.7 && weightChange <= 1){
            cals = -75;
        } else if(weightChange > 1 && weightChange <= 1.5){
            cals = -150;
        } else if(weightChange > 1.5){
            cals = 'BMRM';
        }
    }

    return cals;
}