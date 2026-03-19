Vue.use(VueLocalStorage, {
  bind: true
});

var app = new Vue({
  el: '#app',
  localStorage : {
    username : {
      default: ''
    },
    password : {
      default: ''
    }
  },
  data: {
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
    fetch('/getReadings')
      .then(response => response.json())
      .then(data => {
        self.readings = data;
      })
      .catch(err => console.error('Error fetching readings:', err));
    
    if (self.username && self.password)
    {
      self.getNotes();
    }
  },
  computed : {
    readingDay : function()
    {
      var today = new Date();
      var septFirst = getMostRecentSeptFirst(today);
      var day = getDayDiff(septFirst, today);
      console.log(day);
      return day;
    }
  },
  methods : {
    createUser : function()
    {
      self=this;
      self.message="Registering...";
      var formData = {
        username: self.username,
        password: self.password
      };
      console.log(formData);
      fetch('/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
      })
      .then(response => {
        console.log(response);
        self.message="";
        self.loggedIn = true;
      })
      .catch(err => {
        self.showMessage(err.message);
        self.loggedIn = false;
      });
    },
   getNotes : function()
    {
      self = this;
      self.message="Getting notes...";
      var formData = self.newRequest();
      console.log(formData);
      var params = new URLSearchParams(formData);
      fetch('/getNotes?' + params)
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
          }
          return response.json();
        })
        .then(data => {
          self.notes = data;
          for(var nx in self.notes)
          {
            var note = self.notes[nx];
            self.updateReading(note.Day, note.GeneralNote, note.Done);
          }
          self.message="Notes loaded";
          self.loggedIn = true;
        })
        .catch(err => {
          self.showMessage(err.message);
          self.loggedIn = false;
        });
    },
    updateReading : function(day, note, done)
    {
      self=this;
      var reading = self.readings.filter(r => r.Day === day)[0];
      reading.GeneralNote = note;
      reading.Done = done;
    },
    saveNote : function()
    {
      self=this;
      self.message="Saving...";
      var formData = self.newRequest();
      formData['day'] = self.activeReading.Day;
      formData['note'] = self.activeReading.GeneralNote;
      formData['done'] = self.activeReading.Done;
      console.log(formData);
      fetch('/saveNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
      })
      .then(response => {
        console.log(response); 
        self.message="Saved!";
        self.updateReading(self.activeReading.Day, self.activeReading.GeneralNote, self.activeReading.Done);
        self.closeModal();
      })
      .catch(err => {
        self.showMessage(err.message);
      });
    },
    logout : function()
    {
      this.username = '';
      this.password = '';
      this.message = '';
      this.loggedIn = false;
      this.modal = false;
      this.notes = [];
      this.activeReading = null;
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
      this.activeReading = reading;
      this.modal = true;
    },
    closeModal : function()
    {
      this.modal = false;
    },
    summary : function(reading)
    {
      return reading.OT + "; " + reading.NT + "; " + reading.PP; 
    },
    truncate : function(note)
    {
      return note.substring(0,20) + '...'; 
    }
  }
});



function getMostRecentSeptFirst(aDate)
{
	var bibleYear = aDate.getFullYear();
	var monthNum = aDate.getMonth() + 1;
	if (monthNum < 9) { bibleYear -= 1; }

	var mostRecentSeptFirst = new Date(bibleYear + "-09-01");
	return mostRecentSeptFirst;
}

function getDayDiff(early, late)
{
	var diff = late - early;
	return Math.ceil(diff / 86400000); 
}