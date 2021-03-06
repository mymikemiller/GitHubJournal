function replyToDabble() {
  console.log('starting replyToDabble');
  
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
  var date = email.getDate()
  var dateString = date.getFullYear() + "-" + (date.getMonth()+1).toString().lpad(0,2) + "-" + date.getDate().toString().lpad(0,2);
 
  //console.log({ message: 'Got email threads', count: threads.length, date_of_newest_thread: dateString });
  
  // Get the list of commits using the GitHub API
  // This is the format: https://api.github.com/search/commits?sort=author-date&q=author-email:mikem.exe@gmail.com&author-date=2016-08-15..2016-08-16                                                                                
  var query = 'author-email:mikem.exe@gmail.com';
  var url = 'https://api.github.com/search/commits'
  + '?q=' + encodeURIComponent(query)
  + '+sort:author-date'
  //+ "+author-date:" + dateString
  + "+author-date:2020-01-01..2020-04-18"
  //+ "+author-date:2020-04-15"
  
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
  var commits= {}
  
  //console.log({ message: 'Got GitHub commits response', data: data });
  
  // fill commits map with commit objects keyed on the repository
  for (var i=0; i<data.items.length; i++) {
    var item = data.items[i];
    var repositoryName = item.repository.name
    var commit = item.commit
    if (!(repositoryName in commits)) {
      commits[repositoryName] = [];
    }
    commits[repositoryName].push(commit);
  }
   
  // Generate a message to write in the email to Dabble.me
  // Start with the repository name based on the first commit
  // Only reply to the email if there are actually any GitHub commits
  var text = '';
  if (data.items.length > 0) {
    for(var repo in commits) {
      text += "\nToday's GitHub commits for " + repo + ':\n';
      for(var key in commits[repo]) {
        var commit = commits[repo][key];
        text += '•  ' + commit.message + '\n';
      }
    }
    
    console.log({ message: 'Replying to email', text: text });
    
    // Reply to the email we found earlier
    email.reply(text)
  }
}
