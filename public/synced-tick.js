Vue.component('synced-tick', {
  props: ['value', 'loggedIn', 'reading'],
  template: `<div>
			<label :for="name">
				{{name}}
			</label>
			<input
				:id="name"
				:name="name"
				:value="value"
				v-on:input="$emit('input', $event.target.value)"/>
			</div>`
});

`<input type="checkbox" name="done"
v-if="loggedIn"
v-model="reading.Done"
v-on:click="setDone(reading)"
v-on:input="$emit('input', $event.target.value)>`