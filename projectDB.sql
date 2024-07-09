USE projectDB;

CREATE DATABASE IF NOT EXISTS projectDB;

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS fundraisers;
DROP TABLE IF EXISTS packages;
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
DROP TABLE IF EXISTS packages;

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
    email VARCHAR(255) UNIQUE,
    address_id INT,
    phone VARCHAR(255),
    role ENUM('user', 'admin', 'fundraiser') DEFAULT 'user',
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
    isChecked bool DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id) ON DELETE CASCADE
);

CREATE TABLE packages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	short_description VARCHAR(255),
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
	amount INT,
    image_url VARCHAR(500)
);

CREATE TABLE fundraisers (
    fundraiser_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bonus INT,
    status ENUM('pending', 'approved', 'blocked') DEFAULT 'pending',
    debt DECIMAL(10, 2),
    people_fundraised INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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
('Ramat Gan', 'Ayalon', '22222'),
('Eilat', 'Begin', '33333'),
('Ashkelon', 'Hagoren', '44444'),
('Herzliya', 'Hamesila', '55555'),
('Modiin', 'Hadar', '66666'),
('Ra\'anana', 'Ha\'Emek', '77777'),
('Petah Tikva', 'Arlozorov', '88888'),
('Kfar Saba', 'Haharoshet', '99999'),
('Rehovot', 'Herzl', '12346'),
('Hod Hasharon', 'Hanesiim', '54322'),
('Bat Yam', 'Herzl', '67891');


-- Insert users
INSERT INTO users (name, username, email, address_id, phone, role) VALUES
('michal Doe', 'michal', 'A058587@gmail.com', 1, '050-1234567',  'admin'),
('Jane Smith', 'janesmith', 'n025711858@gmail.com', 2, '050-2345678',  'fundraiser'),
('David Cohen', 'davidcohen', 'M0583295188@gmail.com', 3, '050-3456789', 'user'),
('Rachel Levi', 'rachellevi', 'NW0548455073@gmail.com', 4, '050-4567890',  'user'),
('Michael Rosen', 'michaelrosen', 'chinesesalewe@gmail.com', 5, '050-5678901',  'user'),
('Sarah Gold', 'sarahgold', 'hadassa26162@gmail.com', 6, '050-6789012',  'fundraiser'),
('Daniel Katz', 'danielkatz', 'efratk354@gmail.com', 7, '050-7890123',  'fundraiser'),
('Esther Green', 'esthergreen', 'efratmilet@gmail.com', 8, '050-8901234',  'user'),
('Yossi Azulay', 'yossiazulay', 'odeya2424@gmail.com', 9, '050-9012345',  'user'),
('Leah Bar', 'leahbar', 'ormi2424@gmail.com', 10, '050-0123456',  'fundraiser'),
('Tom Hanks', 'tomhanks', 'tomhanks@example.com', 11, '050-2233445', 'user'),
('Emma Watson', 'emmawatson', 'emmawatson@example.com', 12, '050-3344556', 'fundraiser'),
('Robert Downey', 'robertdowney', 'robertdowney@example.com', 13, '050-4455667', 'user'),
('Scarlett Johansson', 'scarlettj', 'scarlettj@example.com', 14, '050-5566778', 'user'),
('Chris Evans', 'chrisevans', 'chrisevans@example.com', 15, '050-6677889', 'user'),
('Gal Gadot', 'galgadot', 'galgadot@example.com', 16, '050-7788990', 'fundraiser'),
('Mark Ruffalo', 'markruffalo', 'markruffalo@example.com', 17, '050-8899001', 'fundraiser'),
('Zendaya Coleman', 'zendaya', 'zendaya@example.com', 18, '050-9900011', 'user'),
('Chris Hemsworth', 'chrishems', 'chrishems@example.com', 19, '050-0011223', 'user'),
('Brie Larson', 'brielarson', 'brielarson@example.com', 20, '050-1122334', 'fundraiser');

-- Insert passwords
INSERT INTO passwords (user_id, password) VALUES
(1, '12345678'),
(2, 'hashed_password2'),
(3, 'hashed_password3'),
(4, 'hashed_password4'),
(5, 'hashed_password5'),
(6, 'hashed_password6'),
(7, 'hashed_password7'),
(8, 'hashed_password8'),
(9, 'hashed_password9'),
(10, 'hashed_password10'),
(11, 'hashed_password11'),
(12, 'hashed_password12'),
(13, 'hashed_password13'),
(14, 'hashed_password14'),
(15, 'hashed_password15'),
(16, 'hashed_password16'),
(17, 'hashed_password17'),
(18, 'hashed_password18'),
(19, 'hashed_password19'),
(20, 'hashed_password20');

-- Insert gifts
INSERT INTO gifts (winner_id, name, price, image_url) VALUES
(1, 'Tesla', '50', '1.jpg'),
(2, 'Kitchen renovation', '60', '2.jpg'),
(3, 'Living room', '80', '3.jpg'),
(NULL, 'sofas', '200', '4.jpg'),
(NULL, '2 nights in the north', '30', '5.jpg'),
(NULL, 'Three days at the Kiner Galil', '40', '6.jpg'),
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
(10, 10, 10, 'Help for disaster victims'),
(11, 11, 11, 'Donation for new project'),
(12, 12, 12, 'Community support'),
(13, 13, 13, 'Health care assistance'),
(14, 14, 14, 'Donation for education'),
(15, 15, 15, 'Support for arts'),
(16, 16, 16, 'Donation for sports'),
(17, 17, 17, 'Environmental support'),
(18, 18, 18, 'Animal welfare donation'),
(19, 19, 19, 'Support for homeless'),
(20, 20, 20, 'Donation for libraries');


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
(10,'2024-06-01'),
(11, '2024-06-02'),
(12, '2024-06-03'),
(13, '2024-06-04'),
(14, '2024-06-05'),
(15, '2024-06-06'),
(16, '2024-06-07'),
(17, '2024-06-08'),
(18, '2024-06-09'),
(19, '2024-06-10'),
(20, '2024-06-11');


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
('2025-03-01', '2025-03-31'),
('2025-04-01', '2025-04-30'),
('2025-05-01', '2025-05-31'),
('2025-06-01', '2025-06-30'),
('2025-07-01', '2025-07-31'),
('2025-08-01', '2025-08-31'),
('2025-09-01', '2025-09-30'),
('2025-10-01', '2025-10-31'),
('2025-11-01', '2025-11-30'),
('2025-12-01', '2025-12-31'),
('2026-01-01', '2026-01-31');

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
(10, 100, 10),
(2, 20, 2),
(3, 30, 3),
(4, 40, 4),
(5, 50, 5),
(6, 60, 6),
(7, 70, 7),
(8, 80, 8),
(9, 90, 9),
(10, 100, 10),
(11, 110, 11);

-- Insert shopping_cart
INSERT INTO shopping_cart (user_id, gift_id, quantity) VALUES
(1, 1, 2),
(2, 3, 1),
(3, 4, 1),
(4, 5, 2),
(5, 6, 3),
(6, 7, 4),
(7, 8, 5),
(8, 9, 6),
(9, 10, 7),
(10, 11, 8),
(11, 12, 9),
(12, 13, 10);


INSERT INTO token (user_id, refreshToken) VALUES
(1, NULL),
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL),
(6, NULL),
(7, NULL),
(8, NULL),
(9, NULL),
(10, NULL),
(11, NULL),
(12, NULL),
(13, NULL),
(14, NULL),
(15, NULL),
(16, NULL),
(17, NULL),
(18, NULL),
(19, NULL),
(20, NULL);

-- Insert packages
INSERT INTO packages (name,short_description, description, price,amount, image_url) VALUES
(	'Basic Package',	'A luxurious package containing premium gifts',	'The Basic Package includes a selection of high-quality items ideal for special occasions. It features premium chocolates, gourmet snacks, and a curated assortment of pampering essentials.',	1000.00,	10,	'packages.jpg'),
(	'Standard Package',	'A value-packed package with a variety of gifts',	'The Standard Package offers a diverse array of gifts suitable for any celebration. It includes artisanal treats, a choice of fine wines or spirits, and deluxe grooming products.',	500.00,	50,	'packages.jpg'),
(	'Premium Package',	'An exclusive package with exceptional gifts',	'The Premium Package is designed for those seeking luxury and sophistication. It showcases rare delicacies, exclusive wines, designer accessories, and personalized keepsakes.',	750.00,	75,	'packages.jpg');

INSERT INTO fundraisers (user_id, bonus, debt, people_fundraised) VALUES
(6, 50, 100.00, 10),
(7, 30, 200.00, 5),
(16, 40, 150.00, 8),
(17, 20, 250.00, 6),
(1, 60, 300.00, 12),
(2, 10, 50.00, 3),
(3, 35, 180.00, 9),
(4, 25, 210.00, 7),
(5, 45, 90.00, 4),
(8, 55, 400.00, 15);


-- Hash the passwords
UPDATE passwords SET password = SHA2(password, 256) WHERE user_id > 0;
