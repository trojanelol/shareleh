create table Users (
    name        varchar(50),
    password    varchar(50),
    cid         integer not null,
    email       varchar(50),
    phone       integer,
    primary key(cid)   
);

create table Orders (
    oid         integer not null,
    pid         integer,
    coid        integer,
    cid         integer,
    orderdate   varchar(10),
    quantity    integer,
    DeliveryStatus  varchar(10),
);