create table Users 
(
  ID integer primary key autoincrement,
	Username nvarchar(100),
  Password nvarchar(100)
);

create table Notes
(
  ID integer primary key autoincrement,
  UserID integer,
  OTN
);
