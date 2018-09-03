var app = new Vue({
    el: '#app',
    data: {
      loggedIn : false,
      readings : []
    },
    mounted : function()
    {
      self = this;
      $.get('/getReadings', function(data)
      {
        self.readings = JSON.parse(data);
      });
    },
    methods : {
     getNotes : function()
      {
        self = this;
        self.message="Getting notes...";
        var formData = getFormData($('.js-form'));
        console.log(formData);
        $.get('/getNotes', formData, function(response){
           console.log(response); 
          self.notes = JSON.parse(response);
          self.message="Notes loaded";
        })
        .fail(function(data){
          self.showMessage(data.responseText);
        });
      },
      showMessage: function(msg)
      {
        this.message = "😓 Error: " + msg;
      }
    }
  });