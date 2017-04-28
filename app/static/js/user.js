
var UserModule = (function(){
    var email;
    var accessToken;
    var refreshToken;
    var accessHash;

    function setEmail(inEmail){
        email = inEmail;
    }

    function getEmail(){
        return email;
    }

    function setAccessToken(inAccessToken){
        accessToken = inAccessToken;
    }

    function getAccessToken(){
        return accessToken;
    }

    function setRefreshToken(inRefreshToken){
        refreshToken = inRefreshToken;
    }

    function getRefreshToken(){
        return refreshToken;
    }

    return {
        'setEmail':setEmail,
        'getEmail':getEmail,
        'setAccessToken':setAccessToken,
        'getAccessToken':getAccessToken,
        'setRefreshToken':setRefreshToken,
        'getRefreshToken':getRefreshToken
    }
})();
