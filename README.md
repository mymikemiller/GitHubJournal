# GitHubJournal

Create a google scripts project (go to script.google.com)
Give the project a name
Paste the code into Code.gs
In thee GitHub API section, change the committer-email from mikem.exe@gmail.com to your email address

Set up a timer to run this script nightly:
Edit > Current project's triggers
Click to add a trigger
Select the function to run (replyToDabble)
Time Driven, Day Timer, Midnight to 1am
Save

The code will now run nightly and reply to the most recent dabble.me email with that day's git commits