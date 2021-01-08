export const twoWeeksCheck = (dateLastCheck, date) =>{

    let checkDate = new Date(dateLastCheck);  
    
    let endDate = new Date(checkDate.setDate(checkDate.getDate() + 14));
    
    let today = new Date(date);
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if(Math.floor((today-endDate) / 86400000) >= 0){


        return [ `${year}-${month}-${day}`, dateLastCheck.slice(0,10)]
    } else {
        return false
    }

}