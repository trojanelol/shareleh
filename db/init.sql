-- helper function that drops all tables in the current database (commented out for safety)
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

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
DROP TABLE IF EXISTS users_tasks CASCADE;

DROP EXTENSION IF EXISTS citext;
CREATE EXTENSION citext;

CREATE TABLE users (
    uid SERIAL,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    PRIMARY KEY (uid)
);

CREATE TABLE admins (
    uid INTEGER REFERENCES users (uid),
    PRIMARY KEY (uid)
);

CREATE TABLE items (
    iid SERIAL,
    current_round INTEGER, -- REFERENCES rounds (rid)
    item_name citext NOT NULL,
    lender INTEGER NOT NULL REFERENCES users (uid),
    lender_price NUMERIC(15,2) NOT NULL DEFAULT 0,
    lender_comments TEXT,
    location citext,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT '9999-01-01',
    PRIMARY KEY (iid)
);

CREATE TABLE rounds (
    rid SERIAL,
    item INTEGER NOT NULL, -- REFERENCES items (iid)
    winning_bid INTEGER, -- REFERENCES bids (bid)
    PRIMARY KEY (rid)
);

CREATE TABLE bids (
    bid SERIAL,
    round INTEGER, -- REFERENCES rounds (rid)
    borrower INTEGER REFERENCES users (uid),
    borrower_price NUMERIC(15,2) NOT NULL DEFAULT 0,
    borrower_comments TEXT,
    return_date DATE,
    bid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bid)
);

ALTER TABLE items ADD CONSTRAINT items_current_round_fkey FOREIGN KEY (current_round) REFERENCES rounds (rid);
ALTER TABLE rounds ADD CONSTRAINT rounds_item_fkey FOREIGN KEY (item) REFERENCES items (iid);
ALTER TABLE rounds ADD CONSTRAINT rounds_winning_bid_fkey FOREIGN KEY (winning_bid) REFERENCES bids (bid);
ALTER TABLE bids ADD CONSTRAINT bids_round_fkey FOREIGN KEY (round) REFERENCES rounds (rid);

CREATE TABLE user_following (
    follower INTEGER REFERENCES users (uid),
    following INTEGER REFERENCES users (uid),
    PRIMARY KEY (follower, following)
);

CREATE TABLE item_review (
    irid SERIAL,
    item INTEGER REFERENCES items (iid),
    reviewer INTEGER REFERENCES users (uid),
    rating INTEGER NOT NULL,
    comments TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (irid)
);

CREATE TABLE borrower_review (
    brid SERIAL,
    borrower INTEGER REFERENCES users (uid),
    reviewer  INTEGER REFERENCES users (uid),
    rating INTEGER NOT NULL,
    comments TEXT,
    review_date TIMESTAMP,
    PRIMARY KEY (brid)
);

CREATE TABLE lender_review (
    lrid SERIAL,
    lender INTEGER REFERENCES users (uid),
    reviewer INTEGER REFERENCES users (uid),
    rating INTEGER NOT NULL,
    comments TEXT,
    review_date TIMESTAMP,
    PRIMARY KEY (lrid)
);

CREATE TABLE wishlist (
    usr INTEGER REFERENCES users (uid),
    item INTEGER REFERENCES items (iid),
    PRIMARY KEY (usr, item)
);

CREATE TABLE items_categories (
    item INTEGER REFERENCES items (iid),
    category citext,
    PRIMARY KEY(item, category)
);

CREATE TABLE tasks (
    tid SERIAL,
    task citext,
    description TEXT,
    PRIMARY KEY (tid)
);

CREATE TABLE users_tasks (
    usr INTEGER REFERENCES users (uid),
    task INTEGER REFERENCES tasks (tid),
    PRIMARY KEY(usr, task)
);

CREATE OR REPLACE FUNCTION update_changetimestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.changetimestamp = now(); 
    RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_ab_changetimestamp BEFORE UPDATE
ON ab FOR EACH ROW EXECUTE PROCEDURE 
update_changetimestamp_column();

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
