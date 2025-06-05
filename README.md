# TaskCanvas

# Run Locally

This app is designed to read and save json data. However, fetching a file path (e.g. file://pathToFile) is prohibited by CORS. Therefore, run `npx http-server [path] -c-1 -p 8081` and connect to the app by going to `http://localhost:8081`. This way, the json data can be fetched from a http path (e.g. http://pathToFile) which is allowed by CORS. Note: the `-c-1` is used to disable caching which makes it easier to refresh the webpage and see changes. Also `-p 8081` changes the port to 8081 which seems to also help seeing the updates immediately.

# Note

This project uses BabelStandalone to parse react code into JavaScript.