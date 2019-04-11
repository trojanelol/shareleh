-- helper function that drops all tables in the current database (commented out for safety)
-- DO $$ DECLARE
--   r RECORD;
-- BEGIN
--   FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
--     EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
--   END LOOP;
-- END $$;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS user_following CASCADE;
DROP TABLE IF EXISTS item_review CASCADE;
DROP TABLE IF EXISTS borrower_review CASCADE;
DROP TABLE IF EXISTS lender_review CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS user_tasks CASCADE;

DROP EXTENSION IF EXISTS citext;
CREATE EXTENSION citext;

DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION pgcrypto;

CREATE TABLE users (
    uid         SERIAL,
    username    TEXT NOT NULL UNIQUE,
    password    TEXT,
    PRIMARY KEY (uid)
);

CREATE TABLE admins (
    uid    INTEGER REFERENCES users (uid),
    PRIMARY KEY (uid)
);

/*current_round point to current/latest bidding round
	check current_round with rounds to see winning bid 
	(and then bids table for winning borrower)
	
	available will have 3 states
	true: available
	false: on loan
	null: deleted/removed (nt sure if this will backfire)
*/
CREATE TABLE items (
    iid            SERIAL,
    current_round  INTEGER, -- REFERENCES rounds (rid)
    name           CITEXT    NOT NULL,
    lender_id      INTEGER NOT NULL REFERENCES users (uid),
    price          NUMERIC(15,2) NOT NULL DEFAULT 0,
    description    TEXT,
    location       CITEXT,
	available      BOOLEAN DEFAULT TRUE,
    start_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date       DATE NOT NULL DEFAULT '9999-01-01',
    PRIMARY KEY (iid)
);

CREATE TABLE rounds (
    rid               SERIAL,
    iid               INTEGER NOT NULL, -- REFERENCES items (iid)
    winning_bid_id    INTEGER, -- REFERENCES bids (bid)
    PRIMARY KEY (rid)
);

CREATE TABLE bids (
    bid                  SERIAL,
    rid                  INTEGER, -- REFERENCES rounds (rid)
    borrower_id          INTEGER REFERENCES users (uid),
    bid_price            NUMERIC(15,2) NOT NULL DEFAULT 0,
    bid_comments         TEXT,
    return_date          DATE,
    bid_date             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bid)
);

ALTER TABLE items ADD CONSTRAINT items_current_round_fkey FOREIGN KEY (current_round) REFERENCES rounds (rid);
ALTER TABLE rounds ADD CONSTRAINT rounds_iid_fkey FOREIGN KEY (iid) REFERENCES items (iid);
ALTER TABLE rounds ADD CONSTRAINT rounds_winning_bid_id_fkey FOREIGN KEY (winning_bid_id) REFERENCES bids (bid);
ALTER TABLE bids ADD CONSTRAINT bids_rid_fkey FOREIGN KEY (rid) REFERENCES rounds (rid);

CREATE TABLE user_following (
    follower_id     INTEGER REFERENCES users (uid),
    following_id    INTEGER REFERENCES users (uid),
    PRIMARY KEY (follower_id, following_id),
	CHECK (follower_id <> following_id)
);

CREATE TABLE item_review (
    irid           SERIAL,
    iid            INTEGER REFERENCES items (iid),
    reviewer_id    INTEGER REFERENCES users (uid),
    rating         INTEGER NOT NULL,
    comments       TEXT,
    review_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (irid)
);

CREATE TABLE borrower_review (
    brid           SERIAL,
    borrower_id    INTEGER REFERENCES users (uid),
    reviewer_id    INTEGER REFERENCES users (uid),
    rating         INTEGER NOT NULL,
    comments       TEXT,
    review_date    TIMESTAMP,
    PRIMARY KEY (brid)
);

CREATE TABLE lender_review (
    lrid           SERIAL,
    lender_id      INTEGER REFERENCES users (uid),
    reviewer_id    INTEGER REFERENCES users (uid),
    rating         INTEGER NOT NULL,
    comments       TEXT,
    review_date    TIMESTAMP,
    PRIMARY KEY (lrid)
);

CREATE TABLE wishlist (
    uid    INTEGER REFERENCES users (uid),
    iid    INTEGER REFERENCES items (iid),
    PRIMARY KEY (uid, iid)
);

CREATE TABLE item_categories (
    iid      INTEGER REFERENCES items (iid),
    cname    CITEXT,
    PRIMARY KEY(iid, cname)
);

CREATE TABLE tasks (
	tname          CITEXT PRIMARY KEY,
	description    TEXT NOT NULL
);

CREATE TABLE user_tasks (
	task_name    CITEXT REFERENCES tasks(tname),
	uid          INTEGER REFERENCES users(uid),
	PRIMARY KEY(task_name, uid)
);

-- CREATE OR REPLACE FUNCTION update_changetimestamp_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.changetimestamp = now(); 
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';
-- CREATE TRIGGER update_ab_changetimestamp BEFORE UPDATE
-- ON ab FOR EACH ROW EXECUTE PROCEDURE 
-- update_changetimestamp_column();
--
-- CREATE OR REPLACE FUNCTION trigger_set_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;


/* Task triggers */

-- Upload item trigger
CREATE OR REPLACE FUNCTION trig_upload_item_func()
RETURNS TRIGGER AS $$
BEGIN

	IF NOT EXISTS (SELECT * FROM user_tasks WHERE user_tasks.uid = NEW.lender_id AND user_tasks.task_name = 'UPLOAD_ITEM') THEN
		INSERT INTO user_tasks (task_name, uid) VALUES ('UPLOAD_ITEM', NEW.lender_id);
	END IF;

	RETURN NEW;
END

$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_upload_item
AFTER INSERT ON items
FOR EACH ROW
EXECUTE PROCEDURE trig_upload_item_func();

-- Follow another user trigger
CREATE OR REPLACE FUNCTION trig_follow_user_func()
RETURNS TRIGGER AS $$
BEGIN

	IF NOT EXISTS (SELECT * FROM user_tasks WHERE user_tasks.uid = NEW.follower_id AND user_tasks.task_name = 'FOLLOW_USER') THEN
		INSERT INTO user_tasks (task_name, uid) VALUES ('FOLLOW_USER', NEW.follower_id);
	END IF;

	RETURN NEW;
END

$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_follow_user ON user_following;

CREATE TRIGGER trig_follow_user
AFTER INSERT ON user_following
FOR EACH ROW
EXECUTE PROCEDURE trig_follow_user_func();

-- Add an item to wishlist trigger

CREATE OR REPLACE FUNCTION trig_add_to_wishlist_func()
RETURNS TRIGGER AS $$
BEGIN

	IF NOT EXISTS (SELECT * FROM user_tasks WHERE user_tasks.uid = NEW.uid AND user_tasks.task_name = 'ADD_TO_WISHLIST') THEN
		INSERT INTO user_tasks (task_name, uid) VALUES ('ADD_TO_WISHLIST', NEW.uid);
	END IF;

	RETURN NEW;
END

$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_add_to_wishlist ON wishlist;

CREATE TRIGGER trig_add_to_wishlist
AFTER INSERT ON wishlist
FOR EACH ROW
EXECUTE PROCEDURE trig_add_to_wishlist_func();

-- Trigger 1: Borrower banned from bidding if his/her rating is 0 < rating < 2
CREATE OR REPLACE FUNCTION trig_borrower_bid_ban()
RETURNS TRIGGER AS
$$
    BEGIN
        IF AVG(rating) > 0 AND AVG(rating) < 2 THEN
        	RAISE NOTICE 'You have a cumulative rating score that is lower than 2. You are banned from bidding.';
        RETURN NULL;
    END;
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_borrower_bid_ban;

CREATE TRIGGER trig_borrower_bid_ban
BEFORE INSERT ON borrower_review
FOR EACH ROW
EXECUTE PROCEDURE trig_borrower_bid_ban();
