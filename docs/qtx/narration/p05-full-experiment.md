You tap your weather app, and a moment later there's tomorrow's forecast. Where did it come from?

Your app asked for it. That was an API request. An API gives one program the rules for asking another for information or for asking it to do something.

Think of a labeled service counter. You know where to go and what details to give. Your app also knows what form the answer will take.

For tomorrow's forecast, the app sends the location and day over the network to a server. The server checks the request. It might have the weather data stored already, or it might need to ask another service. Then it puts the response together.

What usually comes back is structured data. There's a temperature, say, along with a chance of rain and a short description. Your app reads those values and turns them into the icons and numbers on your screen.

Sometimes that trip goes wrong. The connection might drop. Or the request might reach the server with a detail missing, or while the server's busy. When the app gets a status code, that helps it tell what happened.

On a successful trip, the server supplies the forecast and your app puts it on screen. Both can do their part because they share the API's rules.
