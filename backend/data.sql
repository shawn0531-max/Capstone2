DROP DATABASE IF EXISTS "calcontrol_test";

CREATE DATABASE "calcontrol_test";

\c "calcontrol_test"

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_weights;
DROP TABLE IF EXISTS user_calories;
DROP TABLE IF EXISTS user_favs;
DROP TABLE IF EXISTS recommendations;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username varchar UNIQUE NOT NULL,
    user_password varchar NOT NULL,
    email varchar,
    date_joined date NOT NULL,
    curr_weight int NOT NULL DEFAULT 0,
    weight_unit varchar DEFAULT 'kg',
    curr_height int NOT NULL DEFAULT 0,
    height_unit varchar DEFAULT 'cm',
    curr_age int NOT NULL DEFAULT 0,
    curr_activity varchar NOT NULL DEFAULT 'NA',
    curr_goal varchar NOT NULL DEFAULT 'NA',
    curr_experience varchar NOT NULL DEFAULT 'NA',
    gender varchar NOT NULL DEFAULT 'NA',
    curr_BMR int NOT NULL DEFAULT 0
);

CREATE TABLE user_favs(
    id SERIAL PRIMARY KEY,
    item_name varchar NOT NULL,
    cals int NOT NULL,
    protein int NOT NULL,
    carbs int NOT NULL,
    fat int NOT NULL
);

CREATE TABLE user_weights(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL REFERENCES users ON DELETE CASCADE,
    user_weight dec NOT NULL,
    date_weighed date NOT NULL
);

CREATE TABLE user_cals(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL REFERENCES users ON DELETE CASCADE,
    user_cal int NOT NULL,
    date_cal date NOT NULL
);

CREATE TABLE recommendations(
    username varchar PRIMARY KEY REFERENCES users ON DELETE CASCADE,
    calories int NOT NULL,
    protein int NOT NULL,
    carbs int NOT NULL,
    fats int NOT NULL 
);

INSERT INTO users (username, user_password, email, date_joined, curr_weight, curr_height, curr_age,
                   curr_activity, curr_goal, curr_experience, gender, curr_BMR) values
                   ('shawn1', 'shawn1', 'shawn1@test.com', '10/10/2019', 95, 185, 22, 'Very Active',
                    'Gain Weight', 'Intermediate', 'Male', 2955);

INSERT INTO user_weights (user_id, user_weight, date_weighed) values 
(1, 85, '01-Jan-2019'), (1, 85.5, '02-Jan-2019'), (1, 86, '03-Jan-2019'), (1, 86, '04-Jan-2019'),
(1, 87, '05-Jan-2019'), (1, 88, '06-Jan-2019'), (1, 87, '07-Jan-2019'), (1, 87, '08-Jan-2019'),
(1, 88.5, '09-Jan-2019'), (1, 88.5, '10-Jan-2019'), (1, 89, '11-Jan-2019'), (1, 88, '12-Jan-2019'),
(1, 90.5, '13-Jan-2019'), (1, 90, '14-Jan-2019'), (1, 90, '15-Jan-2019'), (1, 90.5, '16-Jan-2019'),
(1, 92, '17-Jan-2019'), (1, 92, '18-Jan-2019'), (1, 92, '19-Jan-2019'), (1, 92.5, '20-Jan-2019'),
(1, 92, '21-Jan-2019'), (1, 92.5, '22-Jan-2019'), (1, 93.5, '23-Jan-2019'), (1, 93.5, '24-Jan-2019'),
(1, 93, '25-Jan-2019'), (1, 94, '26-Jan-2019'), (1, 94, '27-Jan-2019'),
(1, 85, '01-Aug-2019'), (1, 85.5, '02-Aug-2019'), (1, 86, '03-Aug-2019'), (1, 86, '04-Aug-2019'),
(1, 87, '05-Aug-2019'), (1, 88, '06-Aug-2019'), (1, 87, '07-Aug-2019'), (1, 87, '08-Aug-2019'),
(1, 88.5, '09-Aug-2019'), (1, 88.5, '10-Aug-2019'), (1, 89, '11-Aug-2019'), (1, 88, '12-Aug-2019'),
(1, 90.5, '13-Aug-2019'), (1, 90, '14-Aug-2019'), (1, 90, '15-Aug-2019'), (1, 90.5, '16-Aug-2019'),
(1, 92, '17-Aug-2019'), (1, 92, '18-Aug-2019'), (1, 92, '19-Aug-2019'), (1, 92.5, '20-Aug-2019'),
(1, 92, '21-Aug-2019'), (1, 92.5, '22-Aug-2019'), (1, 93.5, '23-Aug-2019'), (1, 93.5, '24-Aug-2019'),
(1, 93, '25-Aug-2019'), (1, 94, '26-Aug-2019'), (1, 94, '27-Aug-2019'),
(1, 85, '01-Dec-2019'), (1, 85.5, '02-Dec-2019'), (1, 86, '03-Dec-2019'), (1, 86, '04-Dec-2019'),
(1, 87, '05-Dec-2019'), (1, 88, '06-Dec-2019'), (1, 87, '07-Dec-2019'), (1, 87, '08-Dec-2019'),
(1, 88.5, '09-Dec-2019'), (1, 88.5, '10-Dec-2019'), (1, 89, '11-Dec-2019'), (1, 88, '12-Dec-2019'),
(1, 90.5, '13-Dec-2019'), (1, 90, '14-Dec-2019'), (1, 90, '15-Dec-2019'), (1, 90.5, '16-Dec-2019'),
(1, 92, '17-Dec-2019'), (1, 92, '18-Dec-2019'), (1, 92, '19-Dec-2019'), (1, 92.5, '20-Dec-2019'),
(1, 92, '21-Dec-2019'), (1, 92.5, '22-Dec-2019'), (1, 93.5, '23-Dec-2019'), (1, 93.5, '24-Dec-2019'),
(1, 93, '25-Dec-2019'), (1, 94, '26-Dec-2019'), (1, 94, '27-Dec-2019');

INSERT INTO user_cals (user_id, user_cal, date_cal) values 
(1, 3100, '01-Dec-2019'), (1, 3100, '02-Dec-2019'), (1, 3100, '03-Dec-2019'), (1, 3100, '04-Dec-2019'),
(1, 3100, '05-Dec-2019'), (1, 3100, '06-Dec-2019'), (1, 3100, '07-Dec-2019'), (1, 3100, '08-Dec-2019'),
(1, 3300, '09-Dec-2019'), (1, 3300, '10-Dec-2019'), (1, 3300, '11-Dec-2019'), (1, 3300, '12-Dec-2019'),
(1, 3300, '13-Dec-2019'), (1, 3300, '14-Dec-2019'), (1, 3300, '15-Dec-2019'), (1, 3500, '16-Dec-2019'),
(1, 3500, '17-Dec-2019'), (1, 3500, '18-Dec-2019'), (1, 3500, '19-Dec-2019'), (1, 3500, '20-Dec-2019'),
(1, 3650, '21-Dec-2019'), (1, 3650, '22-Dec-2019'), (1, 3650, '23-Dec-2019'), (1, 3650, '24-Dec-2019'),
(1, 3800, '25-Dec-2019'), (1, 3800, '26-Dec-2019'), (1, 3800, '27-Dec-2019');

\q