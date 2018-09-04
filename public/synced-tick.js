

`<input type="checkbox" name="done"
 v-if="loggedIn"
 v-model="reading.Done"
 v-on:click="setDone(reading)">`