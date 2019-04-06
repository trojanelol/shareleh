
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS borrower_review CASCADE;
DROP TABLE IF EXISTS lender_review CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS item_review CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS basket CASCADE;
DROP TABLE IF EXISTS basket_items CASCADE;
DROP TABLE IF EXISTS user_following CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS user_tasks CASCADE;

CREATE TABLE users (
	uid			INTEGER,
	username	VARCHAR(60)		UNIQUE,
	password	VARCHAR(60),
	email		VARCHAR(60)		UNIQUE,
	name		VARCHAR(60),
	PRIMARY KEY(uid)	
);

CREATE TABLE admins (
	uid 		INTEGER		PRIMARY KEY REFERENCES users(uid)
);

CREATE TABLE items (
	iid					INTEGER,
	lender_id 			INTEGER	NOT NULL REFERENCES users(uid),
	current_round		INTEGER UNIQUE REFERENCES rounds(rid),
	name 				VARCHAR(60),
	lender_price 		INTEGER NOT NULL DEFAULT 0,
	lender_comments 	TEXT,
	start_date			DATE,
	end_date			DATE DEFAULT 9999
);

CREATE TABLE rounds (
	rid 				INTEGER PRIMARY KEY,
	item_id 			INTEGER REFERENCES items(iid),
	winning_bid_id		INTEGER UNIQUE REFERENCES rounds(rid),
	name 				VARCHAR(60),
	lender_price		INTEGER NOT NULL DEFAULT 0,
	lender_comments 	TEXT,
	location			VARCHAR(60),
	start_date			DATE,
	end_date			DATE DEFAULT 9999
);

CREATE TABLE bids (
	bid 				INTEGER PRIMARY KEY
	round				INTEGER REFERENCES rounds(rid),
	borrower 			INTEGER REFERENCES users(uid),
	borrower_price		INTEGER,
	return_date			DATE,
	borrower_comments	TEXT,
	bid_date			TIMESTAMP
);

CREATE TABLE user_following (
	follower_id 		INTEGER PRIMARY KEY REFERENCES users(uid),
	following_id		INTEGER PRIMARY KEY REFERENCES users(uid),
);










CREATE TABLE admins (
	aid           SERIAL,
	name          VARCHAR(60),
	username      VARCHAR(60),
	password      VARCHAR(60)      NOT NULL,
	email         VARCHAR (355)    UNIQUE NOT NULL,
	created_on    TIMESTAMP        NOT NULL DEFAULT current_timestamp,
	last_login    TIMESTAMP,
	PRIMARY KEY (aid)
);

CREATE TABLE borrower_review (
	brid           SERIAL,
	borrower_id    INTEGER    NOT NULL REFERENCES users(uid),
	reviewer_id    INTEGER    NOT NULL REFERENCES users(uid),
	rating         INTEGER,
	description    TEXT,
	review_date    TIMESTAMP,
	PRIMARY KEY (brid)
);


CREATE TABLE lender_review (
	lrid           SERIAL,
	lender_id      INTEGER    NOT NULL REFERENCES users(uid),
	reviewer_id    INTEGER    NOT NULL REFERENCES users(uid),
	rating         INTEGER,
	description    TEXT,
	review_date    TIMESTAMP,
	PRIMARY KEY (lrid)
);

CREATE TABLE items (
	iid            SERIAL,
	name           TEXT    NOT NULL,
	price          INTEGER,
	description    TEXT,
	location       TEXT,
	start_time     TIMESTAMP,
	end_time       TIMESTAMP,
	PRIMARY KEY (iid)
);

CREATE TABLE item_review (
	irid           SERIAL     PRIMARY KEY,
	item_id        INTEGER    NOT NULL REFERENCES items(iid),
	rating         INTEGER    NOT NULL,
	description    TEXT,
	reviewer_id    INTEGER    NOT NULL REFERENCES users(uid),
	review_date    TIMESTAMP
);

CREATE TABLE categories (
	cid     SERIAL    PRIMARY KEY,
	name    VARCHAR(60)
);

CREATE TABLE item_categories (
	items_id         INTEGER	NOT NULL REFERENCES items(iid),
	categories_id    INTEGER	NOT NULL REFERENCES categories(cid)
);

CREATE TABLE offers (
	ofid               SERIAL       PRIMARY KEY,
	user_id            INTEGER      NOT NULL REFERENCES users(uid),
	item_id            INTEGER      NOT NULL REFERENCES items(iid),
	price              INTEGER,
	deadline		   TIMESTAMP    NOT NULL,
	pickup_location    TEXT,
	return_location    TEXT	
);

CREATE TABLE basket (
	bid        SERIAL     PRIMARY KEY,
	user_id    INTEGER    NOT NULL REFERENCES users(uid)
);

CREATE TABLE basket_items (
	basket_id    SERIAL     NOT NULL REFERENCES basket(bid),
	item_id      INTEGER    NOT NULL REFERENCES items(iid)
);

CREATE TABLE user_following (
	follower_id     INTEGER    NOT NULL REFERENCES users(uid),
	following_id    INTEGER    NOT NULL REFERENCES users(uid),
	PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE tasks (
	tid              SERIAL     PRIMARY KEY,
	description      TEXT,
	reward_amount    INTEGER    DEFAULT 0
);

CREATE TABLE user_tasks (
	task_id    INTEGER    NOT NULL REFERENCES tasks(tid),
	user_id    INTEGER    NOT NULL REFERENCES users(uid),
	PRIMARY KEY (task_id, user_id)
);




