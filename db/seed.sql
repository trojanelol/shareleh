DELETE FROM wishlist;
DELETE FROM item_categories;
DELETE FROM item_review;
DELETE FROM borrower_review;
DELETE FROM lender_review;
DELETE FROM bids;
DELETE FROM rounds;
DELETE FROM items;
DELETE FROM user_following;
DELETE FROM user_tasks;
DELETE FROM tasks;
DELETE FROM admins;
DELETE FROM users;

-- Users

INSERT INTO
users (username, password)
VALUES ('user1', 'user1password');

INSERT INTO
users (username, password)
VALUES ('user2', 'user2password');

INSERT INTO
users (username, password)
VALUES ('user3', 'user3password');

INSERT INTO
users (username, password)
VALUES ('user4', 'user4password');

INSERT INTO 
admins (uid) 
VALUES (2);

-- Tasks

INSERT INTO tasks (tname, description) VALUES ('UPLOAD_ITEM', 'Upload an item');

INSERT INTO tasks (tname, description) VALUES ('FOLLOW_USER','Follow another user');

INSERT INTO tasks (tname, description) VALUES ('ADD_TO_WISHLIST','Add an item to wishlist');

INSERT INTO tasks (tname, description) VALUES ('BID', 'Bid for an item');

-- Items

INSERT INTO
items (name, lid, price, description, location, start_date)
VALUES ('Playstation 4', 1, 1.00, 'Literally unplayable.', 'east', '2019-05-07'::date);

INSERT INTO
items (name, lid, price, description, location, start_date)
VALUES ('Cactus Plant', 1, 2.00, 'Fake.', 'north', '2019-06-07'::date);

INSERT INTO
items (name, lid, price, description, location, start_date)
VALUES ('Pie Decoration', 1, 3.00, '3.1415926535', 'west', '2019-07-07'::date);

INSERT INTO
items (name, lid, price, description, location)
VALUES ('Mini Portable BBQ Grill Rack', 1, 4.00, 'Portable Grill, Handle at the side for easy usage, Vent holes at the side of racks', 'west');

-- Categories

INSERT INTO 
item_categories (iid, cname) 
VALUES (1, 'Gaming');

INSERT INTO 
item_categories (iid, cname) 
VALUES (2, 'Furniture');

INSERT INTO 
item_categories (iid, cname) 
VALUES (3, 'Outdoors');

INSERT INTO 
item_categories (iid, cname) 
VALUES (4, 'Kitchen');

INSERT INTO
item_categories (iid, cname)
VALUES (5, Health);

INSERT INTO
item_categories (iid, cname)
VALUES (6, Baby);

INSERT INTO
item_categories (iid, cname)
VALUES (7, Music);

INSERT INTO
item_categories (iid, cname)
VALUES (8,Shoes);

INSERT INTO
item_categories (iid, cname)
VALUES (9, Beauty);

INSERT INTO
item_categories (iid, cname)
VALUES (10, Home);

INSERT INTO
item_categories (iid, cname)
VALUES (11, Garden);

INSERT INTO
item_categories (iid, cname)
VALUES (12, Movies);

-- Reviews

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 4.6, 'Fantastic condition. Thought it was brand new.',  '2019-06-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (3, 2, 2.6, 'Looked too real for a decoration.',  '2019-07-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 3.6, 'No 4k support',  '2019-08-07'::date);

INSERT INTO lender_review (lid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 4.7, 'Super friendly lender',  '2019-08-07'::date);
