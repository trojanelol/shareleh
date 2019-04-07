DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users_tasks CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS user_following CASCADE;
DROP TABLE IF EXISTS lender_review CASCADE;
DROP TABLE IF EXISTS borrower_review CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS item_review CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS items_rounds CASCADE;

CREATE TABLE users (
	uid			INTEGER,
	username	VARCHAR(60)		UNIQUE,
	password	VARCHAR(60),
	email		VARCHAR(60)		UNIQUE,
	name		VARCHAR(60),
	PRIMARY KEY(uid)	
);

CREATE TABLE tasks (
	tid 			INTEGER PRIMARY KEY,
	description 	TEXT
);

CREATE TABLE admins (
	uid 		INTEGER		PRIMARY KEY REFERENCES users(uid)
);

CREATE TABLE users_tasks (
	tid 			INTEGER REFERENCES tasks(tid),
	uid 			INTEGER REFERENCES users(uid),
	PRIMARY KEY(tid, uid)
);

CREATE TABLE items (
	iid 				INTEGER PRIMARY KEY,
	lender_id			INTEGER REFERENCES users(uid),
	name 				citext,
	lender_price		INTEGER NOT NULL DEFAULT 0,
	lender_comments 	TEXT,
	location			VARCHAR,
	start_date 			DATE NOT NULL DEFAULT CURRENT_DATE,
	end_date 			DATE NOT NULL DEFAULT '9999-01-01'	
);

CREATE TABLE rounds (
	rid 				INTEGER PRIMARY KEY
);

CREATE TABLE bids (
	bid 				INTEGER PRIMARY KEY,
	round				INTEGER REFERENCES rounds(rid),
	borrower 			INTEGER REFERENCES users(uid),
	borrower_price		INTEGER,
	return_date			DATE,
	borrower_comments	TEXT,
	bid_date			TIMESTAMP
);

CREATE TABLE user_following (
	follower_id 		INTEGER,
	following_id		INTEGER,
	PRIMARY KEY(follower_id, following_id),
	FOREIGN KEY(follower_id) REFERENCES users(uid),
	FOREIGN KEY(following_id) REFERENCES users(uid)
);

CREATE TABLE lender_review (
	lender_rid 		INTEGER PRIMARY KEY,
	lid 			INTEGER REFERENCES users(uid),
	reviewer_id 	INTEGER REFERENCES users(uid),
	rating			INTEGER,
	comments 		TEXT,
	review_date 	TIMESTAMP
);

CREATE TABLE borrower_review (
	borrower_rid 	INTEGER PRIMARY KEY,
	bid 			INTEGER REFERENCES users(uid),
	reviewer_id 	INTEGER REFERENCES users(uid),
	rating			INTEGER,
	comments 		TEXT,
	review_date 	TIMESTAMP
);

CREATE TABLE item_categories (
	item_id		INTEGER,
	uid			INTEGER,
	PRIMARY KEY(item_id, uid),
	FOREIGN KEY(item_id) REFERENCES items(iid),
	FOREIGN KEY(uid) REFERENCES users(uid)
);

CREATE TABLE wishlist (
	item_id			INTEGER,
	uid 			INTEGER,
	PRIMARY KEY(item_id, uid),
	FOREIGN KEY(item_id) REFERENCES items(iid),
	FOREIGN KEY(uid) REFERENCES users(uid)
);

CREATE TABLE item_review (
	item_rid 		INTEGER PRIMARY KEY,
	items_id 		INTEGER REFERENCES items(iid),
	reviewer_id 	INTEGER REFERENCES users(uid),
	rating			INTEGER,
	comments 		TEXT,
	review_date 	TIMESTAMP
);

CREATE TABLE items_rounds (
	current_round 	INTEGER UNIQUE REFERENCES rounds(rid),
	item_id 		INTEGER REFERENCES items(iid),
	winning_bid_id 	INTEGER UNIQUE REFERENCES bids(bid)
);