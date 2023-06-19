const express = require("express");
const app = express();
const port = 7500;

app.listen(port, (err) => {
  if (err) {
    console.log(`Error Occured: ${err}`);
  }
  console.log(`Server Running On Port ${port}`);
});
