
export const calChangeCheck = (entriesArr = []) =>{
    let weightsArr = [];

    if(entriesArr !== []){
        for(let i = 0; i < entriesArr.length; i++){
            weightsArr.push(parseFloat(entriesArr[i].user_weight));
        }
    }
   
    let numberEntries = weightsArr.length;
    let weightChangeArr = [];

    for(let i = 0; i < weightsArr.length; i++){
        let j = i + 1;
        if(j < weightsArr.length){
            weightChangeArr.push(weightsArr[j] - weightsArr[i]);
        };
    };

    let totalWeightChange = 0.0;
    for(let i = 0; i < weightChangeArr.length; i++){
        totalWeightChange += weightChangeArr[i]
    }

    let weeklyWeightChange = totalWeightChange / (numberEntries/7);

    return weeklyWeightChange;
}