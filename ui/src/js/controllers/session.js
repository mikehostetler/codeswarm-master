define(function () {
    
    var session = {
        
        get: function () {
            if (localStorage.getItem("session")) {
                return JSON.parse(localStorage.getItem("session"));
            } else {
                return false;
            }
        },
        
        set: function (data) {
            localStorage.setItem("session", JSON.stringify(data));
        }
    };
    
    return session;
    
});