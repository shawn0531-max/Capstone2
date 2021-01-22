import React from 'react';
import { Scatter } from 'react-chartjs-2';

/** Chart that allows user to see their change in weight and calories for a month/year pair **/
const TrackingChart = ({info}) =>{

  let weightsArr = undefined;
  let calsArr = undefined;
  let weightData = [];
  let calData = [];
  let dateArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                 '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                 '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']


  if(info){
    weightsArr = info[0][0];
    calsArr = info[0][1];
  }

  /** Sets up weight array for 31 days so values display correctly on chart **/
  for(let i = 0; i < dateArr.length; i++){
    for(let j = 0; j < weightsArr.length; j++){
      let day = weightsArr[j].date_weighed.slice(8,10);

      if(day === dateArr[i]){
        weightData.push(parseFloat(weightsArr[j].user_weight));
        break
      } else if(j === weightsArr.length - 1){
        weightData.push(0);
        break
      }
    }
  } 

  /** Sets up calorie array for 31 days so values display correctly on chart **/
  for(let i = 0; i < dateArr.length; i++){
    for(let j = 0; j < calsArr.length; j++){
      let day = calsArr[j].date_cal.slice(8,10);
      
      if(day === dateArr[i]){
        calData.push(parseFloat(calsArr[j].user_cal));
        break
      } else if (j === calsArr.length - 1){
        calData.push(0);
        break
      }
    }
  }

  let maxW = 0;
  let minW = 500;
  let maxC = 0;
  let minC = 9999;
  
  /** Determines minimum and maximum weight axis values based on user weights **/
  if(weightsArr !== undefined){
    for(let i = 0; i < weightsArr.length; i++){
      if(parseFloat(weightsArr[i].user_weight) > maxW){
        maxW = parseFloat(weightsArr[i].user_weight);
      }
      if(parseFloat(weightsArr[i].user_weight) < minW){
        minW = parseFloat(weightsArr[i].user_weight);
      }
    }
  }
  
    /** Determines minimum and maximum calorie axis values based on user calories **/
  if(calsArr !== undefined){
    for(let j = 0; j < calsArr.length; j++){
      if(parseFloat(calsArr[j].user_cal) > maxC){
        maxC = parseFloat(calsArr[j].user_cal)
      }
      if(parseFloat(calsArr[j].user_cal) < minC){
        minC = parseFloat(calsArr[j].user_cal)
      }
    }
  }

  /** Sets default axis mins and maxs if corresponding arrays are empty **/
  if(calsArr.length === 0){
    minC = 250;
    maxC = 750;
    }
  if(weightsArr.length === 0){
    minW = 10;
    maxW = 90;
    }

  let data = {
    datasets: [
      {
        label: 'Weights',
        xAxisId: 'x',
        id: "weights",
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(32, 143, 214)',
        pointBorderColor: 'rgba(32, 143, 214)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: 'rgb(32, 143, 214)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data:  [
          {x: dateArr[0] , y: weightData[0]}, {x: dateArr[1] , y: weightData[1]}, {x: dateArr[2] , y: weightData[2]},
          {x: dateArr[3] , y: weightData[3]}, {x: dateArr[4] , y: weightData[4]}, {x: dateArr[5] , y: weightData[5]},
          {x: dateArr[6] , y: weightData[6]}, {x: dateArr[7] , y: weightData[7]}, {x: dateArr[8] , y: weightData[8]},
          {x: dateArr[9] , y: weightData[9]}, {x: dateArr[10] , y: weightData[10]}, {x: dateArr[11] , y: weightData[11]}, 
          {x: dateArr[12] , y: weightData[12]}, {x: dateArr[13] , y: weightData[13]}, {x: dateArr[14] , y: weightData[14]}, 
          {x: dateArr[15] , y: weightData[15]}, {x: dateArr[16] , y: weightData[16]}, {x: dateArr[17] , y: weightData[17]}, 
          {x: dateArr[18] , y: weightData[18]}, {x: dateArr[19] , y: weightData[19]}, {x: dateArr[20] , y: weightData[20]}, 
          {x: dateArr[21] , y: weightData[21]}, {x: dateArr[22] , y: weightData[22]}, {x: dateArr[23] , y: weightData[23]}, 
          {x: dateArr[24] , y: weightData[24]}, {x: dateArr[25] , y: weightData[25]}, {x: dateArr[26] , y: weightData[26]}, 
          {x: dateArr[27] , y: weightData[27]}, {x: dateArr[28] , y: weightData[28]}, {x: dateArr[29] , y: weightData[29]}, 
          {x: dateArr[30] , y: weightData[30]}
        ],
        yAxisID: "A",
      } , 
      {
        label: 'Calories',
        xAxisId: 'x',
        id: "calories",
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgb(32, 214, 32)',
        pointBorderColor: 'rgba(32, 214, 32)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: 'rgb(32, 214, 32)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data:  [
          {x: dateArr[0] , y: calData[0]}, {x: dateArr[1] , y: calData[1]}, {x: dateArr[2] , y: calData[2]},
          {x: dateArr[3] , y: calData[3]}, {x: dateArr[4] , y: calData[4]}, {x: dateArr[5] , y: calData[5]},
          {x: dateArr[6] , y: calData[6]}, {x: dateArr[7] , y: calData[7]}, {x: dateArr[8] , y: calData[8]},
          {x: dateArr[9] , y: calData[9]}, {x: dateArr[10] , y: calData[10]}, {x: dateArr[11] , y: calData[11]}, 
          {x: dateArr[12] , y: calData[12]}, {x: dateArr[13] , y: calData[13]}, {x: dateArr[14] , y: calData[14]}, 
          {x: dateArr[15] , y: calData[15]}, {x: dateArr[16] , y: calData[16]}, {x: dateArr[17] , y: calData[17]}, 
          {x: dateArr[18] , y: calData[18]}, {x: dateArr[19] , y: calData[19]}, {x: dateArr[20] , y: calData[20]}, 
          {x: dateArr[21] , y: calData[21]}, {x: dateArr[22] , y: calData[22]}, {x: dateArr[23] , y: calData[23]}, 
          {x: dateArr[24] , y: calData[24]}, {x: dateArr[25] , y: calData[25]}, {x: dateArr[26] , y: calData[26]}, 
          {x: dateArr[27] , y: calData[27]}, {x: dateArr[28] , y: calData[28]}, {x: dateArr[29] , y: calData[29]}, 
          {x: dateArr[30] , y: calData[30]
          }
        ],
        yAxisID: "B",
      } 
    ]
  };

  return (

      <div>
        {info[0][0][0] ? 
        <Scatter data={data} 
        options={{
          title:{
            display:true,
            text:'Calories/Weight Tracking',
            fontSize:25,
            fontColor: 'rgb(207, 207, 207)'
          },
          legend:{
            display:true,
            position:'top',
            labels: {
              fontColor: 'rgb(207, 207, 207)',
              fontSize: 15
            }
          },
          scales:{
            xAxes:
            [{ 
              type: 'linear',
              position: 'bottom',
              ticks: {
                max: 31,
                min: 1,
                major: 1,
                minor: 1,
                fontColor: 'rgb(207, 207, 207)',
                fontSize: 15
              }
            }]
            ,
            yAxes: [
            {  
              scaleLabel: {
                display: true,
                labelString: 'Weights',
                fontColor: 'rgb(207, 207, 207)',
                fontSize: 18
              },
              id: "A",
              type: "linear",
              display: true,
              position: 'left',
              ticks: {
                max: maxW + 10,
                min: minW - 10,
                major: 10,
                fontColor: 'rgb(207, 207, 207)',
                fontSize: 15
              }
            },  
            {
              scaleLabel: {
                display: true,
                labelString: 'Calories',
                fontColor: 'rgb(207, 207, 207)',
                fontSize: 18
              },
              id: "B",
              type: "linear",
              display: true,
              position: 'right',
              ticks: {
                max: maxC + 250,
                min: minC - 250,
                fontColor: 'rgb(207, 207, 207)',
                fontSize: 15
              }
            }
          ]
        },
      }}
        />
      :
      null
      }
      </div>    
    )
  }
  
  export default TrackingChart;