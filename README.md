# Watch Party Rescue 

An answer to the dreaded 'what-should-we-watch?!' when planning for an anime (or movie) night. WatchPartyRescue is here to Rescue your Watch Party! :)

Watch Party Rescue currently only supports `plan to watch` list from [MyAnimeList](https://myanimelist.net/).
**Note: Users' list must be public in order to fetch their data.**

## Features

Compare yours and your friends' `plan to watch` list, and see the titles you have in common.
<gif>

Display your name separate from your list account username.
- Logging in as an existing user is now available
- *Coming soon: Changing your display name*
- *Coming soon: Changing associated MyAnimelist account name*
<image>

Create & share sessions with your friends. 
- Session naming and re-naming is now available
- Share by link is now available
<gif>

Remove any session member AND their movie titles when they are no longer attending your event.
<gif>

QoL features:
- Re-naming session name in component
- Disable interactive elements when conditions are not met 
- *Coming soon: loading visuals to indicate when the firebase call is completed*
- *Coming soon: Filtering based on common users, episodes, released date, etc.*

## The Technical Details

WatchPartyRescue is a web application written using [ReactJS](https://reactjs.org/).

Database: [Google Firestore](https://firebase.google.com/products/firestore)

API: [Jikan API](https://jikan.moe/)

### Developer notes
Watch Party Rescue is a passion project as well as a self-demanded utility project. Currently, MyAnimeList offers the capability to compare a user's watchlist to one other user's. However, the comparison shows all anime title from each user's list and their scoring, which excludes group comparison and categorization details. 

This application allows the comparison between **multiple** users' lists and compares titles under the `plan to watch` list (list type specification may be added as a future feature). 