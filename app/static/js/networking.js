var NetworkingModule = (function(){

    var REFRESH_TRY_COUNT = 5;
    var refreshCount = 0;

    function post(inUrl, inParams, callback) {
        var http = new XMLHttpRequest();
        var url = inUrl;
        var params = inParams;
        console.log(inUrl);
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4){
                if(http.status == 200) {
                    callback(http.responseText,null);
                } else if(http.status != 200){
                    callback(null,"Something went wrong");
                }
            }
        }
        http.send(params);
    }

    function getv1(inUrl, callback, caller) {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function() {
            if(http.readyState == 4){
                if (http.status == 200){
                    callback(http.responseText,null);
                } else if(http.status == 401){
                    onUnauthorized(caller)
                }
                else {
                    callback(null,"Something went wrong");
                }
            }
        }
        console.log(inUrl);
        http.open("GET", inUrl, true); // true for asynchronous
        http.setRequestHeader('Authorization', 'Bearer '+ UserModule.getAccessToken());
        http.send(null);
    }

    function postv1(inUrl, callback, caller, params) {
        var http = new XMLHttpRequest();
        var url = inUrl;
        console.log(url);
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.setRequestHeader('Authorization', 'Bearer '+ UserModule.getAccessToken());

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4){
                if(http.status == 200 ||  http.status == 201) {
                    callback(http.responseText);
                } else if(http.status != 200){
                    console.log(http.responseText);
                    if(http.status == 401){
                        onUnauthorized(caller)
                    }
                } else {
                    callback(null,"Something went wrong");
                }
            }
        }
        http.send(params);
    }

    function postMultipartv1(inUrl, callback, caller,fileName) {
        var http = new XMLHttpRequest();
        var url = inUrl;
        var params_name = "name=";
        var params;
        if(fileName){
            params = params_name+fileName;
        } else {
            params = params_name+'form4.pdf'
        }
        console.log(url);
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.setRequestHeader('Authorization', 'Bearer '+ UserModule.getAccessToken());

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4){
                if(http.status == 200 ||  http.status == 201) {
                    //console.log(http.responseText);
                    callback(http.responseText,null);
                } else if(http.status != 200){
                    //console.log(http.responseText);
                    callback(http.responseText,null);
                    if(http.status == 401){
                        onUnauthorized(caller)
                    }
                } else {
                    callback(null,"Something went wrong");
                }
            }
        }
        http.send(params);
    }

    function onUnauthorized(caller){
        if(refreshCount < REFRESH_TRY_COUNT){
            HomeModule.refreshAccessToken(caller);
            refreshCount++;
        } else {
            refreshCount = 0;
            UserModule.setAccessToken("");
            UserModule.setRefreshToken("");
            HomeModule.setUserToken();
            alert('You have not authorized the app or you have revoked the permissions.');
        }
    }

    return {
        'post' : post,
        'getv1': getv1,
        'postMultipartv1' : postMultipartv1,
        'postv1': postv1
    };

})();
