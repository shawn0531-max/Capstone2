# CalControl

Link to site - 

API link - https://api.calorieninjas.com/v1/nutrition

##Setup

To run locally:  
- Clone github repository  
- npm install to install package.json  
- create a database for the sql file to place the data  
- in command line: psql < data.sql  
 

##Features  
- **Search** - Users are able to search CalorieNinjas API for foods and drinks  
- **User Favorites** - Users can store foods and drinks in their favorites to make adding daily information easier  
- **Chart** - Users can visualize changes in weight and daily calorie intake on a graph for month/year pairings  
- **Daily Progress Tracking** - Users can add foods and drinks to their daily intake and the see the progress being made as items are added on progress bars
- **Biweekly Calorie Adjustments** - Every two weeks users weekly weight change is calculated and based on their goals and weight change calories could be adjusted to better align weight gain/loss with the user's goals  

##User Flow  
A simple homepage with welcome graphics. Users can sign in or register on the site with the navigation bar. After registering users are prompted for information to calculate their basal metabolic rate (BMR). The BMR is the daily calories a person's body needs to function with routine activities. This will be used with a user's goals (weight gain, loss, or maintenance), activity levels, exercise experience level, and gender to calculate a user's daily caloric needs. User's can then add foods and drinks to daily intake and track daily progress.  At the end of each day users can submit their total calories and macronutrients for the day. Users are encouraged to do daily weigh ins as well. On the profile page users can see their weights and calories for the month and year they have selected (defaults to current month and year). This app aims to make users more aware of their calorie consumption to aid in achieving their weight goals.

##Technologies  
-  HTML
-  CSS
-  Postgres  
-  Javascript
-  Express  
-  Node  
-  React
-  Reactstrap
-  Redux
