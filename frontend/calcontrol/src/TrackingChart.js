import React, { useEffect } from 'react';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

const TrackingChart = ({weightsArr, calsArr}) =>{

  let check = true;

  
  let maxW = 0;
  let minW = 500;
  let maxC = 0;
  let minC = 9999;
  
  
  if(weightsArr){
    for(let i = 0; i < weightsArr.length; i++){
      if(weightsArr[i] > maxW){
        maxW = weightsArr[i]
      }
      if(weightsArr[i] < minW){
        minW = weightsArr[i]
      }
    }
  }
  
  if(calsArr){
    for(let j = 0; j < calsArr.length; j++){
      if(calsArr[j] > maxC){
        maxC = calsArr[j]
      }
      if(calsArr[j] < minC){
        minC = calsArr[j]
      }
    }
  }
  
  const INITIAL_STATE = {'labels': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  'datasets': [{
    'label': 'weight',
    'yAxisID': 'weight',
    'lineTension': 0.3,
    'backgroundColor': 'rgba(0,0,0,0)',
    'borderColor': 'rgba(68, 72, 82,1)',
    'borderWidth': 4,
    'data': weightsArr
                   },
  {
    'label': 'calories',
    'yAxisID': 'calories',
    'lineTension': 0.3,
    'backgroundColor': 'rgba(0,0,0,0)',
    'borderColor': 'rgba(47, 104, 255,1)',
    'borderWidth': 4,
    'data': calsArr
  }
]}
                  
                  
                  
  const [chartInfo, setChartInfo] = useState(INITIAL_STATE);
                  
  useEffect(()=>{
    setChartInfo({'labels': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    'datasets': [{
      'label': 'weight',
      'yAxisID': 'weight',
      'lineTension': 0.3,
      'backgroundColor': 'rgba(0,0,0,0)',
      'borderColor': 'rgba(68, 72, 82,1)',
      'borderWidth': 4,
      'data': weightsArr
    },
    {
      'label': 'calories',
      'yAxisID': 'calories',
      'lineTension': 0.3,
      'backgroundColor': 'rgba(0,0,0,0)',
      'borderColor': 'rgba(47, 104, 255,1)',
      'borderWidth': 4,
      'data': calsArr
    }
  ]})
}, [weightsArr, calsArr])

if(weightsArr.length === 0 && calsArr.length === 0){
  check = !check
}

  return (
                  <div>
        {check ? <Line
          data={chartInfo}
          options={{
            title:{
              display:true,
              text:'Calories/Weight Tracking',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            },
            scales:{
              yAxes: [
                {   id: 'weight',
                type: 'linear',
                position: 'left',
                ticks: {
                  max: maxW + 10,
                  min: minW - 10,
                  major: 10,
                  minor: 5
                }
              },
              {
                id: 'calories',
                type: 'linear',
                position: 'right',
                ticks: {
                  max: maxC + 250,
                  min: minC - 250,
                }
              }
            ]
          },
        }}
        /> : <p>No info</p>}
      </div>    
    )
  }
  
  export default TrackingChart;