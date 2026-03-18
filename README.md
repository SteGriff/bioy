# Bible in One Year

A way to check readings and save/sync notes for each day.

Originally built on glitch.com in 2018 while I was learning Node/Express. Now built to run using disco.cloud or a general docker host.

My instance is <https://bioy.sign.me.uk>

## Setup Data

Open a terminal in the root of the project, and run

```
node sql/migrations.mjs
```

...to populate the SQL tables.

## Design Notes

 * I had to cut scope so only the `GeneralNotes` field is used.
 * When you open a Modal, the reading is put into `activeReading`
 * When you click Save, the server either creates or updates the matching row in the Notes table
 * There is a server method for `setDone` which I was going to trigger when you click the checkbox (in a table row) but it wasn't working because the `v-on:click` happens before `v-model` is updated, so it was submitting the old value or `undefined`.
 * `Day` numbers are considered to be unique - if we go onto a second year (with separate notes) we need to expand this idea to use a composite key or something
 * I didn't make any components but I probably should have done!
 * Initial login encodes the `<form>` element but future authentication requests use the `username` and `password` stored in the Vue model.
 * Every API request is authenticated
