# Bible in One Year

## Setup

Open the Console (Ctrl+Shift+X and allow popup), then run:

    sqlite3 .data/sqlite.db
    .read sql/create.sql
    .read sql/insert-readings.sql
    select * from Readings
  
You should see a table of readings pop out

## API

<https://bioy.glitch.me/getReadings>