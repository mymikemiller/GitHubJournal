# GitHubJournal

### Create a google scripts project<br>
Go to script.google.com

### Give the project a name <br>
Paste the code into Code.gs<br>
In the GitHub API section, change the committer-email from mikem.exe@gmail.com to your email address<br>

### Set up a timer to run this script nightly:<br>
Edit > Current project's triggers<br>
Click to add a trigger<br>
Select the function to run (replyToDabble)<br>
Time Driven, Day Timer, Midnight to 1am<br>
Save

The code will now run nightly and reply to the most recent dabble.me email with that day's git commits
