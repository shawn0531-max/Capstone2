DROP DATABASE IF EXISTS "calcontrol_test";

CREATE DATABASE "calcontrol_test";

\c "calcontrol_test"

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_weights;
DROP TABLE IF EXISTS user_calories;
DROP TABLE IF EXISTS user_favs;
DROP TABLE IF EXISTS recommendations;

CREATE TABLE users(
    username varchar PRIMARY KEY UNIQUE NOT NULL,
    user_password varchar NOT NULL,
    email varchar,
    date_joined date NOT NULL,
    curr_weight dec NOT NULL DEFAULT 0,
    curr_height dec NOT NULL DEFAULT 0,
    curr_age int NOT NULL DEFAULT 0,
    curr_activity varchar NOT NULL DEFAULT 'NA',
    curr_goal varchar NOT NULL DEFAULT 'NA',
    curr_experience varchar NOT NULL DEFAULT 'NA',
    gender varchar NOT NULL DEFAULT 'NA',
    curr_BMR int NOT NULL DEFAULT 0,
    biweek_check_date date NOT NULL
);

CREATE TABLE user_favs(
    id SERIAL PRIMARY KEY,
    username varchar REFERENCES users ON DELETE CASCADE,
    food varchar UNIQUE NOT NULL,
    cals dec NOT NULL,
    protein dec NOT NULL,
    carbs dec NOT NULL,
    fat dec NOT NULL
);

CREATE TABLE user_weights(
    id SERIAL PRIMARY KEY,
    username varchar NOT NULL REFERENCES users ON DELETE CASCADE,
    user_weight dec NOT NULL,
    date_weighed date NOT NULL
);

CREATE TABLE user_cals(
    id SERIAL PRIMARY KEY,
    username varchar NOT NULL REFERENCES users ON DELETE CASCADE,
    user_cal dec NOT NULL,
    recommended_cals dec NOT NULL,
    date_cal date NOT NULL
);

CREATE TABLE recommendations(
    username varchar PRIMARY KEY REFERENCES users ON DELETE CASCADE,
    cals dec NOT NULL,
    protein dec NOT NULL,
    carbs dec NOT NULL,
    fat dec NOT NULL 
);

CREATE TABLE foods(
    id SERIAL PRIMARY KEY,
    username varchar REFERENCES users ON DELETE CASCADE,
    food varchar NOT NULL,
    cals dec NOT NULL,
    protein dec NOT NULL,
    carbs dec NOT NULL,
    fat dec NOT NULL,
    amount dec NOT NULL,
    date_added date NOT NULL
);

INSERT INTO users (username, user_password, email, date_joined, curr_weight, curr_height, curr_age,
                   curr_activity, curr_goal, curr_experience, gender, curr_BMR, biweek_check_date) values
                   ('shawn1', 'shawn1', 'shawn1@test.com', '12/23/2020', 95, 185, 22, 'Very Active',
                    'Gain Weight', 'Intermediate', 'Male', 1797, '12/23/2020');

INSERT INTO user_weights (username, user_weight, date_weighed) values 
('shawn1', 85, '01-Jan-2020'), ('shawn1', 85.5, '02-Jan-2020'), ('shawn1', 86, '03-Jan-2020'), ('shawn1', 86, '04-Jan-2020'),
('shawn1', 87, '05-Jan-2020'), ('shawn1', 88, '06-Jan-2020'), ('shawn1', 87, '07-Jan-2020'), ('shawn1', 87, '08-Jan-2020'),
('shawn1', 88.5, '09-Jan-2020'), ('shawn1', 88.5, '10-Jan-2020'), ('shawn1', 89, '11-Jan-2020'), ('shawn1', 88, '12-Jan-2020'),
('shawn1', 90.5, '13-Jan-2020'), ('shawn1', 90, '14-Jan-2020'), ('shawn1', 90, '15-Jan-2020'), ('shawn1', 90.5, '16-Jan-2020'),
('shawn1', 92, '17-Jan-2020'), ('shawn1', 92, '18-Jan-2020'), ('shawn1', 92, '19-Jan-2020'), ('shawn1', 92.5, '20-Jan-2020'),
('shawn1', 92, '21-Jan-2020'), ('shawn1', 92.5, '22-Jan-2020'), ('shawn1', 93.5, '23-Jan-2020'), ('shawn1', 93.5, '24-Jan-2020'),
('shawn1', 93, '25-Jan-2020'), ('shawn1', 94, '26-Jan-2020'), ('shawn1', 94, '27-Jan-2020'),
('shawn1', 85, '01-Aug-2020'), ('shawn1', 85.5, '02-Aug-2020'), ('shawn1', 86, '03-Aug-2020'), ('shawn1', 86, '04-Aug-2020'),
('shawn1', 87, '05-Aug-2020'), ('shawn1', 88, '06-Aug-2020'), ('shawn1', 87, '07-Aug-2020'), ('shawn1', 87, '08-Aug-2020'),
('shawn1', 88.5, '09-Aug-2020'), ('shawn1', 88.5, '10-Aug-2020'), ('shawn1', 89, '11-Aug-2020'), ('shawn1', 88, '12-Aug-2020'),
('shawn1', 90.5, '13-Aug-2020'), ('shawn1', 90, '14-Aug-2020'), ('shawn1', 90, '15-Aug-2020'), ('shawn1', 90.5, '16-Aug-2020'),
('shawn1', 92, '17-Aug-2020'), ('shawn1', 92, '18-Aug-2020'), ('shawn1', 92, '19-Aug-2020'), ('shawn1', 92.5, '20-Aug-2020'),
('shawn1', 92, '21-Aug-2020'), ('shawn1', 92.5, '22-Aug-2020'), ('shawn1', 93.5, '23-Aug-2020'), ('shawn1', 93.5, '24-Aug-2020'),
('shawn1', 93, '25-Aug-2020'), ('shawn1', 94, '26-Aug-2020'), ('shawn1', 94, '27-Aug-2020'),
('shawn1', 85, '01-Dec-2020'), ('shawn1', 85.5, '02-Dec-2020'), ('shawn1', 86, '03-Dec-2020'), ('shawn1', 86, '04-Dec-2020'),
('shawn1', 87, '05-Dec-2020'), ('shawn1', 88, '06-Dec-2020'), ('shawn1', 87, '07-Dec-2020'), ('shawn1', 87, '08-Dec-2020'),
('shawn1', 88.5, '09-Dec-2020'), ('shawn1', 88.5, '10-Dec-2020'), ('shawn1', 89, '11-Dec-2020'), ('shawn1', 88, '12-Dec-2020'),
('shawn1', 90.5, '13-Dec-2020'), 
('shawn1', 90, '25-Dec-2020'), ('shawn1', 90, '26-Dec-2020'), ('shawn1', 90.5, '27-Dec-2020'),
('shawn1', 92, '28-Dec-2020'), ('shawn1', 92, '29-Dec-2020'), ('shawn1', 92, '30-Dec-2020'), ('shawn1', 92, '31-Dec-2020'),
('shawn1', 92, '01-Jan-2021'), ('shawn1', 92, '02-Jan-2021'), ('shawn1', 92, '03-Jan-2021'), ('shawn1', 93, '04-Jan-2021'),
('shawn1', 93, '05-Jan-2021'), ('shawn1', 93, '06-Jan-2021'), ('shawn1', 93, '07-Jan-2021');

INSERT INTO user_cals (username, user_cal, recommended_cals,  date_cal) values 
('shawn1', 3100, 3120, '01-Dec-2020'), ('shawn1', 3100, 3120, '02-Dec-2020'), ('shawn1', 3100, 3120, '03-Dec-2020'), ('shawn1', 3100, 3120, '04-Dec-2020'),
('shawn1', 3100, 3120, '05-Dec-2020'), ('shawn1', 3100, 3120, '06-Dec-2020'), ('shawn1', 3100, 3120, '07-Dec-2020'), ('shawn1', 3100, 3120, '08-Dec-2020'),
('shawn1', 3300, 3400, '09-Dec-2020'), ('shawn1', 3300, 3400, '10-Dec-2020'), ('shawn1', 3300, 3400, '11-Dec-2020'), ('shawn1', 3300, 3400, '12-Dec-2020'),
('shawn1', 3300, 3400, '13-Dec-2020'), 
('shawn1', 3300, 3400, '25-Dec-2020'), ('shawn1', 3300, 3400, '26-Dec-2020'), ('shawn1', 3500, 3525, '27-Dec-2020'),
('shawn1', 3500, 3525, '28-Dec-2020'), ('shawn1', 3500, 3525, '29-Dec-2020'), ('shawn1', 3500, 3525, '30-Dec-2020'), ('shawn1', 3500, 3525, '31-Dec-2020'),
('shawn1', 3650, 3700, '01-Jan-2021'), ('shawn1', 3650, 3700, '02-Jan-2021'), ('shawn1', 3650, 3700, '03-Jan-2021'), ('shawn1', 3650, 3700, '04-Jan-2021'),
('shawn1', 3800, 3900, '05-Jan-2021'), ('shawn1', 3800, 3900, '06-Jan-2021'), ('shawn1', 3800, 3900, '07-Jan-2021');

INSERT INTO recommendations (username, cals, protein, carbs, fat) values
('shawn1', 3300, 262, 423, 62);

\q