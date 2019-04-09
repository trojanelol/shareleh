DELETE FROM users;
DELETE FROM admins;
DELETE FROM items;
DELETE FROM rounds;
DELETE FROM bids;
DELETE FROM user_following;
DELETE FROM item_review;
DELETE FROM borrower_review;
DELETE FROM lender_review;
DELETE FROM wishlist;
DELETE FROM item_categories;
DELETE FROM tasks;
DELETE FROM users_tasks;

-- users

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
items (item_name, lender, lender_price, lender_comments, location, start_date)
VALUES ('Playstation 4', 1, 1.00, 'Can be eaten. Trust me.', 'east', '2019-05-07'::date);

-- items

INSERT INTO
items (item_name, lender, lender_price, lender_comments, location, start_date)
VALUES ('Cactus Plant', 2, 2.00, 'Fake.', 'north', '2019-06-07'::date);

INSERT INTO
items (item_name, lender, lender_price, lender_comments, location, start_date)
VALUES ('Pie Decoration', 3, 3.00, '3.1415926535', 'west', '2019-07-07'::date);

INSERT INTO
items (item_name, lender, lender_price, lender_comments, location)
VALUES ('Mini Portable BBQ Grill Rack', 4, 4.00, 'Portable Grill, Handle at the side for easy usage, Vent holes at the side of racks', 'west');

-- categories

INSERT INTO items_categories (item, category) VALUES (1, 'Gaming');

INSERT INTO items_categories (item, category) VALUES (2, 'Furniture');

INSERT INTO items_categories (item, category) VALUES (3, 'Outdoors');

INSERT INTO items_categories (item, category) VALUES (4, 'Kitchen');

-- reviews

INSERT INTO item_review (item, reviewer, rating, comments, review_date)
VALUES (1, 2, 4.6, 'Fantastic condition. Thought it was brand new.',  '2019-06-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (3, 2, 2.6, 'Looked too real for a decoration.',  '2019-07-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 3.6, 'No 4k support',  '2019-08-07'::date);

INSERT INTO lender_review (lid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 4.7, 'Super friendly lender',  '2019-08-07'::date);
