var express = require("express"),
    app = express();

app.get("/:project", function(req, res){
    
    res.send(req.params.project);

});

app.listen(1337);