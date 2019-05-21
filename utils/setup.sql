DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    pic VARCHAR(255),
    station VARCHAR(500),
    latitude FLOAT,
    longitude FLOAT,
    availability DATE [],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY NOT NULL,
    station VARCHAR(500),
    latitude FLOAT,
    longitude FLOAT,
    members INTEGER[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY NOT NULL,
    userid SERIAL NOT NULL references users(userid) on DELETE CASCADE,
    comment TEXT NOT NULL,
    receiver INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
