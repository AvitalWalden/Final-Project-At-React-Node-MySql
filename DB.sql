/* Create the database */
USE projectDB;

CREATE DATABASE  IF NOT EXISTS projectDB;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS addresses;

CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255),
    street VARCHAR(255),
    zipcode VARCHAR(255)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR(255),
    username VARCHAR(255) not null UNIQUE,
    email VARCHAR(255),
    address_id INT,
    phone VARCHAR(255),
    role VARCHAR(255),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE passwords (
    id INT primary key,
    password VARCHAR(255) not null,
    FOREIGN KEY (id) REFERENCES users(id)
);

