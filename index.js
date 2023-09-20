const express = require('express')
const app = express();

// config
const PORT = 8080;



// create server
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})