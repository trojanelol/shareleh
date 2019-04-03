DELETE FROM users;
DELETE FROM admins;
DELETE FROM borrower_review;
DELETE FROM lender_review;
DELETE FROM items;
DELETE FROM item_review;
DELETE FROM categories;
DELETE FROM item_categories;
DELETE FROM offers;
DELETE FROM basket;
DELETE FROM basket_items;
DELETE FROM user_following;
DELETE FROM tasks;
DELETE FROM user_tasks;


INSERT INTO users (name, username, password, email) VALUES
('normal', 'normaluser', 'password1', 'normal@shareleh.com');

INSERT INTO admins (name, username, password, email) VALUES
('adminname', 'admin', 'password2', 'admin@shareleh.com');

INSERT INTO items (name, description, location) VALUES
('Potato', 'Can be eaten. Trust me.', 'east');

INSERT INTO items (name, description, location) VALUES
('Cactus', 'Fake.', 'north');

INSERT INTO items (name, description, location) VALUES
('Pie', '3.1415926535', 'west');

INSERT INTO items (name, description, location) VALUES
('Mini Portable BBQ Grill Rack', 'Portable Grill, Handle at the side for easy usage, Vent holes at the side of racks', 'central');