var app = new Vue({
  el: '#app',
  data: {
    message: '',
    loggedIn: false,
    modal: false,
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
    createUser : function()
    {
      self=this;
      self.message="Registering...";
      var formData = getFormData($('.js-form'));
      console.log(formData);
      $.post('/createUser', formData, function(response){
        console.log(response);
        self.message="";
        self.loggedIn = true;
      })
      .fail(function(data){
        self.showMessage(data.responseText);
        self.loggedIn = false;
      });
    },
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
        self.loggedIn = true;
      })
      .fail(function(data){
        self.showMessage(data.responseText);
        self.loggedIn = false;
      });
    },
    showMessage: function(msg)
    {
      this.message = "😓 Error: " + msg;
    },
    openModal: function()
    {
      this.modal = true;
    },
    closeModal : function()
    {
      this.modal = false;
    }
  }
});

function getFormData($form){
    var formData = $form.serializeArray();
    var data = {};
    $.map(formData, n=>data[n['name']] = n['value']);
    return data;
}
