USE projectDB;

CREATE DATABASE IF NOT EXISTS projectDB;

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS lotteries_tickets;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS lottery;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS addresses;

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

CREATE TABLE token (
token_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
refreshToken VARCHAR(255),
FOREIGN KEY (user_id) REFERENCES users(user_id)
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
image_url VARCHAR(500) NOT NULL,
FOREIGN KEY (winner_id) REFERENCES users(user_id) ON DELETE CASCADE
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
order_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
order_date DATE,
FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE lottery (
lottery_id INT AUTO_INCREMENT PRIMARY KEY,
start_date DATE,
end_date DATE
);

CREATE TABLE lotteries_tickets (
lotteries_tickets_id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT,
quantity INT,
gift_id INT,
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
FOREIGN KEY (gift_id) REFERENCES gifts(gift_id) ON DELETE CASCADE
);

CREATE TABLE shopping_cart (
cart_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
gift_id INT,
quantity INT,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
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
('John Doe', 'johndoe', 'A0583295187@gmail.com', 1, '050-1234567', 0, 'user'),
('Jane Smith', 'janesmith', 'n025711858@gmail.com', 2, '050-2345678', 0, 'admin'),
('David Cohen', 'davidcohen', 'n025711858@gmail.com', 3, '050-3456789', 0, 'user'),
('Rachel Levi', 'rachellevi', 'n025711858@gmail.com', 4, '050-4567890', 0, 'user'),
('Michael Rosen', 'michaelrosen', 'n025711858@gmail.com', 5, '050-5678901', 0, 'user'),
('Sarah Gold', 'sarahgold', 'n025711858@gmail.com', 6, '050-6789012', 0, 'admin'),
('Daniel Katz', 'danielkatz', 'n025711858@gmail.com', 7, '050-7890123', 0, 'user'),
('Esther Green', 'esthergreen', 'n025711858@gmail.com', 8, '050-8901234', 0, 'user'),
('Yossi Azulay', 'yossiazulay', 'odeya2424@gmail.com', 9, '050-9012345', 0, 'user'),
('Leah Bar', 'leahbar', 'ormi2424@gmail.com', 10, '050-0123456', 0, 'admin');

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
(1, 'Tesla', '50', '1.jpg'),
(2, 'Kitchen renovation', '60', '2.jpg'),
(3, 'Living room', '80', '3.jpg'),
(NULL, 'sofas', '200', '4.jpg'),
(NULL, '2 nights in the north', '30', '5.jpg'),
(NULL, 'Three days at the Kiner Galil hotel', '40', '6.jpg'),
(NULL, 'Flight to Cyprus', '100', '7.jpg'),
(NULL, 'Flight to Switzerland', '70', '8.jpg'),
(NULL, 'Children Room', '300', '9.jpg'),
(NULL, 'A designed kitchen', '500', '10.jpg'),
(NULL, 'Youth bed + dresser + closet', '50', '11.jpg'),
(NULL, 'Baby room', '60', '12.jpg'),
(NULL, 'Flight to Austria', '80', '13.jpg'),
(NULL, 'Flight to France', '200', '14.jpg'),
(NULL, 'Buying for NIS 500 in Mashbir', '30', '15.jpg'),
(NULL, 'Bastashi', '40', '16.jpg'),
(NULL, 'printer', '100', '17.jpg'),
(NULL, 'Bedroom closet', '70', '18.jpg'),
(NULL, 'dryer', '300', '19.jpg'),
(NULL, 'computer', '500', '20.jpg'),
(NULL, 'refrigerator', '50', '21.jpg'),
(NULL, 'surprise gift', '60', '22.jpg'),
(NULL, 'Tommy brands plug', '80', '23.jpg'),
(NULL, '2000 NIS on the Next website', '200', '24.jpg'),
(NULL, 'kitchen table', '30', '25.jpg'),
(NULL, 'gold bracelet', '40', '26.jpg'),
(NULL, 'Brand watch', '100', '27.jpg'),
(NULL, 'Six suborders', '70', '28.jpg'),
(NULL, 'Brand watch for men', '300', '29.jpg');

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
INSERT INTO orders (user_id, order_date) VALUES
(1, '2024-05-23'),
(2, '2024-05-24'),
(3, '2024-05-25'),
(4, '2024-05-26'),
(5, '2024-05-27'),
(6, '2024-05-28'),
(7, '2024-05-29'),
(8, '2024-05-30'),
(9, '2024-05-31'),
(10,'2024-06-01');

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

-- Insert lotteries_tickets
INSERT INTO lotteries_tickets (order_id, quantity, gift_id) VALUES
(1, 10, 1),
(1, 20, 1),
(3, 30, 3),
(4, 40, 4),
(5, 50, 1),
(6, 60, 6),
(7, 70, 7),
(8, 80, 8),
(9, 90, 9),
(10, 100, 10);
-- Insert shopping_cart
INSERT INTO shopping_cart (user_id, gift_id, quantity) VALUES
(1, 1, 2),
(2, 3, 1);

INSERT INTO token (user_id,refreshToken) VALUES
(1, NULL),
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL),
(6, NULL),
(7, NULL),
(8, NULL),
(9, NULL),
(10, NULL);

-- Hash the passwords
UPDATE passwords SET password = SHA2(password, 256) WHERE user_id > 0;