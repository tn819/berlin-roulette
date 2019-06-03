Berlin roulette
User preference and geo-location friend-matching app

| Description             | Tech                                                  | Overview                                                                                                          |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Front-end               | Redux, React, ReactRouter, CSS, Animations, Keyframes | Dynamic page and templating structure                                                                             |
| Back-end                | Node, Express, Express Router                         | Node server and routing set-up                                                                                    |
| Database                | Postgres SQL, Redis with Raccoon package              | Node server and routing set-up                                                                                    |
| Scripting               | JS, jQuery                                            | touch and animation handling                                                                                      |
| Authentication/Security | bcrypt, cookie-session, csurf                         | user log-in handled securely with bcrypt, common web security concerns addressed via csurf, cookies, other set-up |

## build steps

```
npm install

concurrent dev script execution (webpack + node server):
npm run dev

requires ENV variables for DATABASE_URL (postgres url), AWS_KEY, AWS_SECRET, s3Url (AWS bucket url)
RACCOON_REDIS_URL (redis cloud instance url), RACCOON_REDIS_PORT (redis cloud port), RACCOON_REDIS_AUTH (redis cloud instance key)
```

## landing page

friend requests, built-in pop up group live chat
![alt text](https://raw.githubusercontent.com/tn819/berlin-roulette/master/public/landing-page.png)

## form page

dynamically provide availability and preferences
![alt text](https://raw.githubusercontent.com/tn819/berlin-roulette/master/public/form.gif)

## match page

matching algorithm results!
![alt text](https://raw.githubusercontent.com/tn819/berlin-roulette/master/public/matches.gif)
