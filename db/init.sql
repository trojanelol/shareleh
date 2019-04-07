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

DROP EXTENSION IF EXISTS citext;

CREATE EXTENSION citext;

CREATE TABLE users (
	uid			SERIAL,
	username	VARCHAR(60)		UNIQUE,
	password	text,
	name		VARCHAR(60),
	PRIMARY KEY(uid)	
);

CREATE TABLE tasks (
	tid 			SERIAL PRIMARY KEY,
	description 	TEXT
);

CREATE TABLE admins (
	uid 		SERIAL		PRIMARY KEY REFERENCES users(uid)
);

CREATE TABLE users_tasks (
	tid 			INTEGER REFERENCES tasks(tid),
	uid 			INTEGER REFERENCES users(uid),
	PRIMARY KEY(tid, uid)
);

CREATE TABLE items (
	iid 				SERIAL PRIMARY KEY,
	lid					INTEGER REFERENCES users(uid),
	name 				citext,
	price			INTEGER NOT NULL DEFAULT 0,
	description	 		TEXT,
	location			citext,
	start_date 			DATE NOT NULL DEFAULT CURRENT_DATE,
	end_date 			DATE NOT NULL DEFAULT '9999-01-01'	
);

CREATE TABLE rounds (
	rid 				SERIAL PRIMARY KEY
);

CREATE TABLE bids (
	bid 				SERIAL PRIMARY KEY,
	rid					INTEGER REFERENCES rounds(rid),
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
	lrid 			SERIAL PRIMARY KEY,
	lid 			INTEGER REFERENCES users(uid),
	reviewer_id 	INTEGER REFERENCES users(uid),
	rating			REAL NOT NULL,
	comments 		TEXT,
	review_date 	TIMESTAMP
);

CREATE TABLE borrower_review (
	brid		 	SERIAL PRIMARY KEY,
	bid 			INTEGER REFERENCES users(uid),
	reviewer_id 	INTEGER REFERENCES users(uid),
	rating			REAL NOT NULL,
	comments 		TEXT,
	review_date 	TIMESTAMP
);

CREATE TABLE item_categories (
	iid				INTEGER,
	cname			citext,
	PRIMARY KEY(iid, cname),
	FOREIGN KEY(iid) REFERENCES items(iid)
);

CREATE TABLE wishlist (
	iid			INTEGER,
	uid 		INTEGER,
	PRIMARY KEY(iid, uid),
	FOREIGN KEY(iid) REFERENCES items(iid),
	FOREIGN KEY(uid) REFERENCES users(uid)
);

CREATE TABLE item_review (
	irid	 		SERIAL PRIMARY KEY,
	iid 			INTEGER REFERENCES items(iid),
	reviewer_id 	INTEGER REFERENCES users(uid),
	rating			REAL NOT NULL,
	comments 		TEXT,
	review_date 	TIMESTAMP
);

CREATE TABLE items_rounds (
	current_round 	INTEGER UNIQUE REFERENCES rounds(rid),
	item_id 		INTEGER REFERENCES items(iid),
	winning_bid_id 	INTEGER UNIQUE REFERENCES bids(bid)
);