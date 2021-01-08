 const twoWeeksCalc = (oldDate) =>{
    let date = new Date();
    
    
    // let currMonth = date.getMonth() + 1;
    // let currDay = date.getDate();
    // let currYear = date.getFullYear() - 1;


    console.log(oldDate)
    return (date - oldDate)

    
    // let twoWeeksObj;
    // let twoWeeksMonth;
    // let twoWeeksYear;
    // let twoWeeksDay;

    // let afterLongMonths = [2, 4, 6, 9, 11, 1];

    // if(currMonth === 3){
    //     twoWeeksObj = {'1':'16', '2':'17', '3':'18', '4':'19', '5':'20', '6':'21', '7':'22',
    //                 '8':'23', '9':'24', '10':'25', '11':'26', '12':'27', '13':'28'}
    // } else if(afterLongMonths.includes(currMonth)) {
    //     twoWeeksObj = {'1':'19',  '2':'20', '3':'21', '4':'22', '5':'23', '6':'24', '7':'25',
    //                 '8':'26', '9':'27', '10':'28', '11':'29', '12':'30', '13':'31'}
    // } else {
    //     twoWeeksObj = {'1':'18',  '2':'19', '3':'20', '4':'21', '5':'22', '6':'23', '7':'24',
    //                 '8':'25', '9':'26', '10':'27', '11':'28', '12':'29', '13':'30'}
    // }

    // if(currMonth === 1 && currDay < 14){
    //     twoWeeksYear = parseInt(currYear) - 1;
    // } else {
    //     twoWeeksYear = currYear;
    // }

    // if(currDay < 14){
    //     twoWeeksDay = twoWeeksObj[currDay.toString()];
    //     if(currMonth === 1){
    //         twoWeeksMonth = 12;
    //     } else {
    //         twoWeeksMonth = currMonth - 1;
    //     }
    // } else {
    //     twoWeeksDay = currDay - 13;
    //     twoWeeksMonth = currMonth;
    // }

    // return ([`${twoWeeksYear}-${twoWeeksMonth}-${twoWeeksDay}`, `${currYear}-${currMonth}-${currDay}`])
}