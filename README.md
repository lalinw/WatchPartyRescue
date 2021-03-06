
# Watch Party Rescue 

An answer to the dreaded 'what-should-we-watch?!' when planning for an anime (or movie) night. WatchPartyRescue is here to **R**escue your **W**atch **P**arty! :)
Watch Party Rescue currently only supports `plan to watch` list type from [MyAnimeList](https://myanimelist.net/).

💡 Users' list settings must be set to `public` in order to fetch their data.  
> ![Public list settings](/documentation/mal_list_public.png)
***
### Project Status
This project is currently under development. MVP is available under the `main` branch

### Developer notes 🐈
Watch Party Rescue is a passion project as well as a self-demanded utility project. Currently, MyAnimeList offers the capability for comparison between one user's watchlist and one other user's. However, the results shows all anime from each user's list and their scoring, excluding group comparison and categorization details. 

This application allows the comparison between **multiple** users' lists with a quick look to each title's key information at a glance, and compares titles under the `plan to watch` list (more list type specification may be added as a future feature). 


## Features

1. #### Compare yours and your friends' `plan to watch` list, and see the titles you have in common. 
> (gif)

2. #### Display your name separate from your list account username.
> - [x] Log in as an existing user
> - [ ] Changing your display name
> - [ ] Changing associated MyAnimelist account name 
>  (image)

3. #### Create & share sessions with your friends.
> - [x] Session naming & re-naming
> - [x] Share session by link
>  (gif)

4. #### Remove any session member AND their movie titles when they are no longer attending your event.  
>  (gif)

5. #### QoL features 
> - [x] Alert user if input is invalid
> - [x] Confirmation required to remove another user from session
> - [x] Re-naming session name in-component
> - [x] Disable interactive elements when appropriate 
> - [ ] Visual indicater when the firebase call is pending/completed
> - [ ] User-specific fetch details
> - [ ] Caching of expensive calls locally
> - [ ] Filtering based on common users, episodes, released date, etc.

***

## The Technical Details

WatchPartyRescue is a web application written using [ReactJS](https://reactjs.org/).

Database: [Google Firestore](https://firebase.google.com/products/firestore)

API: 
- [Jikan API](https://jikan.moe/)
- *TBD: Letterboxd*


