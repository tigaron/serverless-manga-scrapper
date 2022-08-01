import app from "./src/app.js";
const port = 8000;

app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});