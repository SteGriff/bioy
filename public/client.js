var app = new Vue({
  el: '#app',
  data: {
    message: '',
    loggedIn: false,
    modal: false,
    modalField: null,
    modalTitle: '',
    readings : [],
    notes: []
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
      var formData = getFormData($('.js-form'));
      formData['field'] = self.modalField;
      formData['note'] = self.note;
      console.log(formData);
      $.post('/addMessage', formData, function(response){
        console.log(response); 
        self.message="done!";
      })
      .fail(function(data){
        self.showMessage(data.responseText);
      });
    },
    toggleDone : function(day, done)
    {
      self=this;
      self.message="Saving...";
      var formData = getFormData($('.js-form'));
      formData['day'] = day;
      formData['done'] = done;
      $.post('/setDone', formData, function(response){
        console.log(response); 
        self.message="Saved";
      })
      .fail(function(data){
        self.showMessage(data.responseText);
      });
    }
    showMessage: function(msg)
    {
      this.message = "😓 Error: " + msg;
    },
    openModal: function(field, title)
    {
      this.modalField = field;
      this.modalTitle = title;
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
