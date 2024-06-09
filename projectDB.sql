CREATE DATABASE IF NOT EXISTS projectDB;
USE projectDB;

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS order_gifts;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS lotteries_tickets;
DROP TABLE IF EXISTS lottery;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS gifts;




-- Create tables
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255),
    street VARCHAR(255),
    zipcode VARCHAR(255)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    address_id INT,
    phone VARCHAR(255),
    Bonus INT,
    role VARCHAR(255),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE passwords (
    user_id INT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE gifts (
    gift_id INT AUTO_INCREMENT PRIMARY KEY,
    winner_id INT,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL
);

CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donate_id INT,
    user_id INT,
    gift_id INT,
    description VARCHAR(255),
    FOREIGN KEY (donate_id) REFERENCES users(user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    lotteries_tickets_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    gift_id INT,
    order_date DATE,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id) ON DELETE CASCADE
);

CREATE TABLE lottery (
    lottery_id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE,
    end_date DATE
);

CREATE TABLE order_gifts (
    order_id INT,
    gift_id INT,
    PRIMARY KEY (order_id, gift_id),
    FOREIGN KEY (order_id) REFERENCES orders(lotteries_tickets_id) ON DELETE CASCADE,
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id) ON DELETE CASCADE
);

-- Insert addresses
INSERT INTO addresses (city, street, zipcode) VALUES
('Tel Aviv', 'Rothschild', '12345'),
('Jerusalem', 'Jaffa', '54321'),
('Haifa', 'Ben Gurion', '67890'),
('Rishon LeZion', 'Herzl', '11223'),
('Ashdod', 'Yitzhak Rabin', '33445'),
('Netanya', 'Herzl', '55667'),
('Beersheba', 'Derech Eilat', '77889'),
('Holon', 'Sokolov', '99000'),
('Bnei Brak', 'Rabbi Akiva', '11111'),
('Ramat Gan', 'Ayalon', '22222');

-- Insert users
INSERT INTO users (name, username, email, address_id, phone, Bonus, role) VALUES
('John Doe', 'johndoe', 'john@example.com', 1, '050-1234567', 0, 'user'),
('Jane Smith', 'janesmith', 'jane@example.com', 2, '050-2345678', 0, 'admin'),
('David Cohen', 'davidcohen', 'david@example.com', 3, '050-3456789', 0, 'user'),
('Rachel Levi', 'rachellevi', 'rachel@example.com', 4, '050-4567890', 0, 'user'),
('Michael Rosen', 'michaelrosen', 'michael@example.com', 5, '050-5678901', 0, 'user'),
('Sarah Gold', 'sarahgold', 'sarah@example.com', 6, '050-6789012', 0, 'admin'),
('Daniel Katz', 'danielkatz', 'daniel@example.com', 7, '050-7890123', 0, 'user'),
('Esther Green', 'esthergreen', 'esther@example.com', 8, '050-8901234', 0, 'user'),
('Yossi Azulay', 'yossiazulay', 'yossi@example.com', 9, '050-9012345', 0, 'user'),
('Leah Bar', 'leahbar', 'leah@example.com', 10, '050-0123456', 0, 'admin');

-- Insert passwords
INSERT INTO passwords (user_id, password) VALUES
(1, 'hashed_password1'),
(2, 'hashed_password2'),
(3, 'hashed_password3'),
(4, 'hashed_password4'),
(5, 'hashed_password5'),
(6, 'hashed_password6'),
(7, 'hashed_password7'),
(8, 'hashed_password8'),
(9, 'hashed_password9'),
(10, 'hashed_password10');

-- Insert gifts
INSERT INTO gifts (winner_id, name, price, image_url) VALUES
(NULL, 'Toy Car', '50', '1'),
(NULL, 'Doll', '60', '2'),
(NULL, 'Board Game', '80', '3'),
(NULL, 'Bicycle', '200', '4'),
(NULL, 'Book', '30', '5'),
(NULL, 'Puzzle', '40', '6'),
(NULL, 'Lego Set', '100', '7'),
(NULL, 'Action Figure', '70', '8'),
(NULL, 'Drone', '300', '9'),
(NULL, 'Tablet', '500', '10');

-- Insert donations
INSERT INTO donations (donate_id, user_id, gift_id, description) VALUES
(1, 1, 1, 'Donation for kids'),
(2, 2, 2, 'Charity donation'),
(3, 3, 3, 'Gift for orphanage'),
(4, 4, 4, 'Support for local school'),
(5, 5, 5, 'Community donation'),
(6, 6, 6, 'Help for underprivileged children'),
(7, 7, 7, 'Support for hospital'),
(8, 8, 8, 'Charity for needy families'),
(9, 9, 9, 'Assistance for elderly'),
(10, 10, 10, 'Help for disaster victims');

-- Insert orders
INSERT INTO orders (user_id, gift_id, order_date, quantity) VALUES
(1, 1, '2024-05-23', 1),
(2, 2, '2024-05-24', 1),
(3, 3, '2024-05-25', 1),
(4, 4, '2024-05-26', 1),
(5, 5, '2024-05-27', 1),
(6, 6, '2024-05-28', 1),
(7, 7, '2024-05-29', 1),
(8, 8, '2024-05-30', 1),
(9, 9, '2024-05-31', 1),
(10, 10, '2024-06-01', 1);

-- Insert lotteries
INSERT INTO lottery (start_date, end_date) VALUES
('2024-06-01', '2024-06-30'),
('2024-07-01', '2024-07-31'),
('2024-08-01', '2024-08-31'),
('2024-09-01', '2024-09-30'),
('2024-10-01', '2024-10-31'),
('2024-11-01', '2024-11-30'),
('2024-12-01', '2024-12-31'),
('2025-01-01', '2025-01-31'),
('2025-02-01', '2025-02-28'),
('2025-03-01', '2025-03-31');

-- Insert order_gifts
INSERT INTO order_gifts (order_id, gift_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- Hash the passwords
UPDATE passwords SET password = SHA2(password, 256) WHERE user_id > 0;
