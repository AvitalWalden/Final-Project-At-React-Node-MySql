USE projectDB;

CREATE DATABASE IF NOT EXISTS projectDB;

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS lotteries_tickets;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS lottery;

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
    name VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    gift_id INT,
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id)
);

CREATE TABLE lotteries_tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    winner_id INT,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id),
    FOREIGN KEY (winner_id) REFERENCES users(user_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    gift_id INT,
    order_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id)
);

CREATE TABLE lottery (
    lottery_id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE,
    end_date DATE
);


-- הוספת כתובות
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

-- הוספת משתמשים
INSERT INTO users (name, username, email, address_id, phone, role) VALUES 
('John Doe', 'johndoe', 'john@example.com', 1, '050-1234567', 'user'),
('Jane Smith', 'janesmith', 'jane@example.com', 2, '050-2345678', 'admin'),
('David Cohen', 'davidcohen', 'david@example.com', 3, '050-3456789', 'user'),
('Rachel Levi', 'rachellevi', 'rachel@example.com', 4, '050-4567890', 'user'),
('Michael Rosen', 'michaelrosen', 'michael@example.com', 5, '050-5678901', 'user'),
('Sarah Gold', 'sarahgold', 'sarah@example.com', 6, '050-6789012', 'admin'),
('Daniel Katz', 'danielkatz', 'daniel@example.com', 7, '050-7890123', 'user'),
('Esther Green', 'esthergreen', 'esther@example.com', 8, '050-8901234', 'user'),
('Yossi Azulay', 'yossiazulay', 'yossi@example.com', 9, '050-9012345', 'user'),
('Leah Bar', 'leahbar', 'leah@example.com', 10, '050-0123456', 'admin');

-- הוספת סיסמאות
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

-- הוספת מתנות
INSERT INTO gifts (name, price, image_url) VALUES 
('Toy Car', '50', 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fpery.co.il%2Fwp-content%2Fuploads%2F2020%2F05%2FKia-Stonic-2020.png&tbnid=QSZNmO6EMoDRuM&vet=1&imgrefurl=https%3A%2F%2Fpery.co.il%2Fproduct%2F%25D7%25A8%25D7%259B%25D7%2591-%25D7%2591%25D7%2599%25D7%25A0%25D7%2595%25D7%25A0%25D7%2599-d-103%2F&docid=0dTM5E0BXtwP7M&w=600&h=600&source=sh%2Fx%2Fim%2Fm1%2F1&kgs=07cf014f94906bec&shem=abme%2Cssim%2Ctrie'),
('Doll', '60', 'http://example.com/doll.jpg'),
('Board Game', '80', 'http://example.com/boardgame.jpg'),
('Bicycle', '200', 'http://example.com/bicycle.jpg'),
('Book', '30', 'http://example.com/book.jpg'),
('Puzzle', '40', 'http://example.com/puzzle.jpg'),
('Lego Set', '100', 'http://example.com/lego.jpg'),
('Action Figure', '70', 'http://example.com/actionfigure.jpg'),
('Drone', '300', 'http://example.com/drone.jpg'),
('Tablet', '500', 'http://example.com/tablet.jpg');

-- הוספת תרומות
INSERT INTO donations (user_id, gift_id, description) VALUES 
(1, 1, 'Donation for kids'),
(2, 2, 'Charity donation'),
(3, 3, 'Gift for orphanage'),
(4, 4, 'Support for local school'),
(5, 5, 'Community donation'),
(6, 6, 'Help for underprivileged children'),
(7, 7, 'Support for hospital'),
(8, 8, 'Charity for needy families'),
(9, 9, 'Assistance for elderly'),
(10, 10, 'Help for disaster victims');

-- הוספת כרטיסי הגרלה
INSERT INTO lotteries_tickets (donation_id, winner_id) VALUES 
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

-- הוספת הזמנות
INSERT INTO orders (user_id, gift_id, order_date) VALUES 
(1, 1, '2024-05-23'),
(2, 2, '2024-05-24'),
(3, 3, '2024-05-25'),
(4, 4, '2024-05-26'),
(5, 5, '2024-05-27'),
(6, 6, '2024-05-28'),
(7, 7, '2024-05-29'),
(8, 8, '2024-05-30'),
(9, 9, '2024-05-31'),
(10, 10, '2024-06-01');

-- הוספת הגרלות
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