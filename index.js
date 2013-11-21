var express = require("express"),
    app = express();

app.get("/:project", function(req, res){
    
    res.send(req.params.build);

});

app.listen(1337);