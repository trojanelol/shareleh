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
