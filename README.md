# Bible in One Year

## Setup

Open the Console (Ctrl+Shift+X and allow popup), then run:

    sqlite3 .data/sqlite.db
    .read sql/create-readings.sql
    .read sql/create-users.sql
    .read sql/create-notes.sql
    .read sql/insert-readings.sql
    select * from Readings
  
You should see a table of readings pop out

## Design Notes

 * I had to cut scope so only the `GeneralNotes` field is used.
 * When you open a Modal, the reading is put into `activeReading`
 * When you click Save, the server either creates or updates the matching row in the Notes table
 * `Day` numbers are considered to be unique - if we go onto a second year (with separate notes) we need to expand this idea to use a composite key or something
 * I didn't make any components but I probably should have done!
 * Initial login encodes the `<form>` element but future authentication requests use the `username` and `password` stored in the Vue model.
 * Every API requ

## API

<https://bioy.glitch.me/getReadings>