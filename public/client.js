var app = new Vue({
    el: '#app',
    data: {
      readings : []
    },
    mounted : function()
    {
      self = this;
      const whenReady = function() {
        self.readings = JSON.parse(this.responseText);
      }

      // request the dreams from our app's sqlite database
      const dreamRequest = new XMLHttpRequest();
      dreamRequest.onload = whenReady;
      dreamRequest.open('get', '/getReadings');
      dreamRequest.send();

    }  
  });