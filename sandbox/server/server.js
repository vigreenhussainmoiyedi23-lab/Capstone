
import app from "./src/app.js";
import { ConnectToDb } from "./src/config/db.js";
await ConnectToDb(0)
app.listen(3000, () => {
    console.log("Example app listening on port 3000 !");
}); 