function replyToDabble() {
  
  // Allow padding of strings so we can add "0" to dates if necessary
  String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
  }
  
  // Get the most recent Dabble.me email
  var threads = GmailApp.search('from:"Dabble me"', 0, 1);
  for(var i = 0; i < threads.length; i++) {
    thread = threads[i]
  }
  var email = threads[0].getMessages()[0]
  
  // Find the date
  var date = email.getDate() //new Date("Aug 14 2017"); //new Date();
  var dateString = date.getFullYear() + "-" + (date.getMonth()+1).toString().lpad(0,2) + "-" + date.getDate().toString().lpad(0,2);
  
  // Get the list of commits using the GitHub API
  // This is the format: https://api.github.com/search/commits?sort=committer-date&q=committer-email:mikem.exe@gmail.com&committer-date=2016-08-15..2016-08-16                                                                                
  var query = 'committer-email:mikem.exe@gmail.com';
  var url = 'https://api.github.com/search/commits'
  + '?q=' + encodeURIComponent(query)
  + '+sort:committer-date'
  + "+committer-date:" + dateString
  //+ "+committer-date:2017-08-14..2017-08-14"
  
  var headers = {
    'Accept': 'application/vnd.github.cloak-preview',
    'muteHttpExceptions': true
  };
  var options =
      {
        "headers": headers,
      };
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json);
  var commitMessages = []
  
  // fill commitMessages with objects {date=x, message=y}
  for (var i=0; i<data.items.length; i++) { 
    commitMessages.push({"date":new Date(Date.parse(data.items[i].commit.committer.date)),
                         "message": data.items[i].commit.message})
  }

  // Loop through the commitMessages, printing out all the objects
  for (var i=0; i<commitMessages.length; i++) { 
    var date = commitMessages[i].date;
    var message = commitMessages[i].message;
  }
   
  // Generate a message to write in the email to Dabble.me
  // Start with the repository name based on the first commit
  // Only reply to the email if there are actually any GitHub commits
  if (data.items.length > 0) {
    var text = ""
    var repository = data.items[0].repository.name + "\n\n"
    var text = "\n\nToday's github commits for: " + repository;
    for(var i = 0; i < commitMessages.length; i++) {
      var message = commitMessages[i]
      text += message.message + "\n\n"
    }
    
    // Reply to the email we found earlier
    email.reply(text)
  }
}
