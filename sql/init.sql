create table Users (
    name        varchar(50),
    password    varchar(50),
    cid         integer not null,
    email       varchar(50),
    phone       integer,
    primary key(cid)   
);