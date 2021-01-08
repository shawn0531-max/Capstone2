
export const calCalc =  (BMR, goal, experience, activity, gender, currWeight) =>{

    let activityObj = {'Sendentary': 1.2, 'Lightly Active': 1.375, 'Moderately Active': 1.55,
                   'Very Active': 1.725, 'Extra Active': 1.9}

    let maleExperienceObj = {'Beginner': 300, 'Intermediate': 200, 'Advanced': 100}
    let femaleExperienceObj = {'Beginner': 200, 'Intermediate': 150, 'Advanced': 100}

    let totalCals = Math.round(activityObj[activity] * BMR);
    let macros = {}
    if(gender === "Male"){
        if (goal === 'Gain Weight'){
            totalCals = Math.round(totalCals + maleExperienceObj[experience]);
            macros = gainMacros(totalCals, currWeight);
        } else if (goal === "Lose Weight"){
            totalCals = Math.round(totalCals - maleExperienceObj[experience]);
            macros = loseMacros(totalCals, currWeight);
        } else {
            macros = maintainMacros(totalCals, currWeight);
        }
    }
    if(gender === "Female"){
        if (goal === 'Gain Weight'){
            totalCals = Math.round(totalCals + femaleExperienceObj[experience]);
            macros = gainMacros(totalCals, currWeight);
        } else if (goal === "Lose Weight"){
            totalCals = Math.round(totalCals - femaleExperienceObj[experience]);
            macros = loseMacros(totalCals, currWeight);
        } else {
            macros = maintainMacros(totalCals, currWeight);
        }
    }

    return [totalCals, macros];
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