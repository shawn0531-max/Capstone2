
export const calUpdateCalc = (goal, cals, weight) =>{

    let macros = {};

    if(goal === 'Gain Weight'){
        macros = gainMacros(cals, weight);
    } else if(goal === "Lose Weight"){
        macros = loseMacros(cals, weight);
    } else if(goal === 'Maintain Weight'){
        macros = maintainMacros(cals, weight);
    }

    return macros;
}

const gainMacros = (totalCals, currWeight) =>{
    let protein = Math.round(2.65 * currWeight);
    let fats = Math.floor(0.66 * currWeight);
    let carbs = Math.floor((totalCals - (protein * 4) - (fats * 9)) / 4);

    return {'protein': protein, 'fats': fats, 'carbs': carbs}
}

const maintainMacros = (totalCals, currWeight) =>{
    let protein = Math.round(2.2 * currWeight);
    let fats = Math.floor(0.88 * currWeight);
    let carbs = Math.floor((totalCals - (protein * 4) - (fats * 9)) / 4);

    return {'protein': protein, 'fats': fats, 'carbs': carbs}
}

const loseMacros = (totalCals, currWeight) =>{
    let protein = Math.round(2.4 * currWeight);
    let fats = Math.floor(0.66 * currWeight);
    let carbs = Math.floor((totalCals - (protein * 4) - (fats * 9)) / 4);

    return {'protein': protein, 'fats': fats, 'carbs': carbs}
}