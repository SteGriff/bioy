var app = new Vue({
  el: '#app',
  data: {
    username : '',
    password : '',
    message: '',
    loggedIn: false,
    modal: false,
    readings : [],
    notes: [],
    activeReading : null
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
      var formData = self.newRequest();
      console.log(formData);
      $.get('/getNotes', formData, function(response){
        console.log(response); 
        self.notes = JSON.parse(response);
        console.log(self.notes);
        self.message="Notes loaded";
        self.loggedIn = true;
      })
      .fail(function(data){
        self.showMessage(data.responseText);
        self.loggedIn = false;
      });
    },
    saveNote : function()
    {
      self=this;
      self.message="Saving...";
      var formData = self.newRequest();
      formData['field'] = self.modalField;
      formData['note'] = self.activeReading.GeneralNote;
      formData['done'] = self.activeReading.Done;
      console.log(formData);
      $.post('/saveNote', formData, function(response){
        console.log(response); 
        self.message="Saved!";
      })
      .fail(function(data){
        self.showMessage(data.responseText);
      });
    },
    newRequest: function()
    {
      return {
        'username' : this.username,
        'password' : this.password
      };
    },
    showMessage: function(msg)
    {
      this.message = "😓 Error: " + msg;
    },
    openModal: function(reading)
    {
      console.log("openModal", reading)
      this.activeReading = reading;
      this.modal = true;
    },
    closeModal : function()
    {
      console.log("closeModal");
      this.modal = false;
    },
    summary : function(reading)
    {
      return reading.OT + "; " + reading.NT + "; " + reading.PP; 
    }
  }
});

function getFormData($form){
    var formData = $form.serializeArray();
    var data = {};
    $.map(formData, n=>data[n['name']] = n['value']);
    return data;
}
