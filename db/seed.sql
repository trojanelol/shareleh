DELETE FROM items_rounds;
DELETE FROM wishlist;
DELETE FROM item_categories;
DELETE FROM item_review;
DELETE FROM borrower_review;
DELETE FROM lender_review;
DELETE FROM bids;
DELETE FROM rounds;
DELETE FROM items;
DELETE FROM user_following;
DELETE FROM users_tasks;
DELETE FROM tasks;
DELETE FROM admins;
DELETE FROM users;


INSERT INTO users (username, password, name) VALUES
('normaluser', 'password', 'normal');

INSERT INTO users (username, password, name) VALUES
('admin', 'password', 'adminname');

INSERT INTO users (username, password, name) VALUES
('normaluser2', 'password', 'normal2');

INSERT INTO admins (uid) VALUES
(2);


INSERT INTO items (name, lid, description, location, price, start_date) VALUES
('Playstation 4', 1, 'Can be eaten. Trust me.', 'east', 5, '2019-05-07'::date);

INSERT INTO items (name, lid, description, location, start_date) VALUES
('Cactus Plant', 1, 'Fake.', 'north', '2019-06-07'::date);

INSERT INTO items (name, lid, description, location, start_date) VALUES
('Pie Decoration', 1, '3.1415926535', 'west', '2019-07-07'::date);

INSERT INTO items (name, lid, description, location) VALUES
('Mini Portable BBQ Grill Rack', 1, 'Portable Grill, Handle at the side for easy usage, Vent holes at the side of racks', 'central');

-- Temp categories
INSERT INTO item_categories (iid, cname) VALUES (1, 'Gaming');

INSERT INTO item_categories (iid, cname) VALUES (3, 'Furniture');

INSERT INTO item_categories (iid, cname) VALUES (4, 'Outdoors');

INSERT INTO item_categories (iid, cname) VALUES (4, 'Kitchen');

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 4.6, 'Fantastic condition. Thought it was brand new.',  '2019-06-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (3, 2, 2.6, 'Looked too real for a decoration.',  '2019-07-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 3.6, 'No 4k support',  '2019-08-07'::date);
