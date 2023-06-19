const express = require("express");
const app = express();
const port = 7500;

//use express router
app.use("/", require("./routes/routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error Occured: ${err}`);
  }
  console.log(`Server Running On Port ${port}`);
});
