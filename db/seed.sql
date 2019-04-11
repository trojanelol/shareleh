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

ALTER SEQUENCE users_uid_seq RESTART WITH 1;
ALTER SEQUENCE items_iid_seq RESTART WITH 1;
ALTER SEQUENCE rounds_rid_seq RESTART WITH 1;
ALTER SEQUENCE bids_bid_seq RESTART WITH 1;
ALTER SEQUENCE item_review_irid_seq RESTART WITH 1;
ALTER SEQUENCE borrower_review_brid_seq RESTART WITH 1;
ALTER SEQUENCE lender_review_lrid_seq RESTART WITH 1;

-- Only for first timer
-- CREATE EXTENSION pgcrypto;

-- Users
INSERT INTO users (username, password) VALUES ('user1', crypt('password1', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('admin', crypt('AAaa11', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('user3', crypt('password3', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('user4', crypt('password4', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('mcholton0', crypt('password5', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('tkraut1', crypt('password6', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('bnugent2', crypt('password7', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('eyacob3', crypt('password8', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('bwastall4', crypt('password9', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('ncoleson5', crypt('password10', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('imatcham6', crypt('password11', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('agullis7', crypt('password12', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('osparrowe8', crypt('password13', gen_salt('bf', 8)));
INSERT INTO users (username, password) VALUES ('dfeye9', crypt('password14', gen_salt('bf', 8)));

INSERT INTO
admins (uid)
VALUES (2);

-- Tasks

INSERT INTO tasks (tname, description) VALUES ('UPLOAD_ITEM', 'Upload an item');
INSERT INTO tasks (tname, description) VALUES ('FOLLOW_USER','Follow another user');
INSERT INTO tasks (tname, description) VALUES ('ADD_TO_WISHLIST','Add an item to wishlist');


-- Create bidding round when uploading item trigger
-- Dropped at end of seed file
CREATE OR REPLACE FUNCTION trig_new_bidding_round_func()
RETURNS TRIGGER AS $$
DECLARE
	round_id integer;
BEGIN
	INSERT INTO rounds (iid) VALUES (NEW.iid) RETURNING rid INTO round_id;
	UPDATE items SET current_round = round_id;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;


CREATE TRIGGER trig_upload_item_round
AFTER INSERT ON items
FOR EACH ROW
EXECUTE PROCEDURE trig_new_bidding_round_func();


-- Items

INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Playstation 4', 1, 1.00, 'Literally unplayable.', 'east', '2019-05-07'::date);
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Cactus Plant', 1, 2.00, 'Fake.', 'north', '2019-06-07'::date);
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Pie Decoration', 1, 3.00, '3.1415926535', 'west', '2019-07-07'::date);
INSERT INTO items (name, lid, price, description, location) VALUES ('Mini Portable BBQ Grill Rack', 1, 4.00, 'Portable Grill, Handle at the side for easy usage, Vent holes at the side of racks', 'west');
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Impreza WRX', 7, 78.33, 'Subaru', 'west', to_date('07/01/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Celica', 9, 149.88, 'Toyota', 'south', to_date('10/22/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Sequoia', 9, 120.85, 'Toyota', 'west', to_date('08/20/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('F450', 4, 217.56, 'Ford', 'central', to_date('10/25/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Corsica', 4, 259.1, 'Chevrolet', 'west', to_date('09/24/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Express 1500', 3, 142.19, 'Chevrolet', 'north', to_date('09/16/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Blazer', 6, 88.57, 'Chevrolet', 'west', to_date('06/29/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('A8', 4, 204.8, 'Audi', 'central', to_date('01/31/2019', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Viper RT/10', 4, 202.38, 'Dodge', 'east', to_date('12/06/2018', 'MM/DD/YYYY'));
INSERT INTO items (name, lid, price, description, location, start_date) VALUES ('Suburban 2500', 7, 96.01, 'Chevrolet', 'east', to_date('08/07/2018', 'MM/DD/YYYY'));

-- Categories

INSERT INTO item_categories (iid, cname) VALUES (1, 'Video Games');
INSERT INTO item_categories (iid, cname) VALUES (2, 'Furniture');
INSERT INTO item_categories (iid, cname) VALUES (3, 'Party Sets');
INSERT INTO item_categories (iid, cname) VALUES (4, 'Kitchenware');
INSERT INTO item_categories (iid, cname) VALUES (5, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (6, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (7, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (8, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (9, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (10, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (11, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (12, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (13, 'Vehicles');
INSERT INTO item_categories (iid, cname) VALUES (14, 'Vehicles');
-- Reviews

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 5, 'Fantastic condition. Thought it was brand new.',  '2019-06-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (3, 2, 3, 'Looked too real for a decoration.',  '2019-07-07'::date);

INSERT INTO item_review (iid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 4, 'No 4k support',  '2019-08-07'::date);

INSERT INTO lender_review (lid, reviewer_id, rating, comments, review_date)
VALUES (1, 2, 5, 'Super friendly lender',  '2019-08-07'::date);

-- Bids
INSERT INTO bids (rid, brid, bid_price, bid_comments, return_date, bid_date)
VALUES (1,5,5.00,'I want to try overcooked.','2019-07-07','2019-06-13 00:00:00.000');

INSERT INTO bids (rid,brid,bid_price,bid_comments,bid_date)
VALUES (1,3,2.00,'I need a bluray player.','2019-06-16 00:00:00.000');

UPDATE rounds SET winning_bid_id = 1 WHERE rid = 1;

INSERT INTO rounds (iid) VALUES (1);

INSERT INTO bids (rid,brid,bid_price,bid_comments,bid_date)
VALUES (11,5,5.00,'Overcooked 2. Lend me again please','2019-07-13 00:00:00.000');

INSERT INTO bids (rid,brid,bid_price,bid_comments,bid_date)
VALUES (11,3,2.00,'I still really want to watch that bluray movie.','2019-07-16 00:00:00.000');

--remove item upload trigger
DROP TRIGGER IF EXISTS trig_upload_item_round ON items;