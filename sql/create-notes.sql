create table Notes
(
  ID integer primary key autoincrement,
  UserID integer,
  Day integer,
  Done bit,
  OTNote text,
  NTNote text,
  PPNote text,
  GeneralNote text
);