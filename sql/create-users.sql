create table Users 
(
  ID integer primary key autoincrement,
	Username nvarchar(100),
  Password nvarchar(100)
);

create table Messages
(
  ID integer primary key autoincrement,
  UserID integer,
  Message nvarchar(255)
);
