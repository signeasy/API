var ConstantModule = (function(){

    var AUTH_HOST = "https://api-ext-beta.getsigneasy.com";//SignEasy API host
    var APP_HOST = "https://himalaya-beta.getsigneasy.com";//Your app host
    var AUTH_AUTHORIZE = "/oauth2/authorize";
    var AUTH_TOKEN = "/oauth2/token";
    var CLIENT_ID = "3UTLjFewlcTjPmrygIGOlt7WzgZyXb0G0o7lykFx";//Add your client ID;
    var CLIENT_SECRET = "YAA7LfekjDiPyDIaS8hURt813HX7HS0jGlwuzNE42yI90SVK0Q";//Add your client Secret;
    var AUTH_REDIRECT_URI = APP_HOST+"/redirect";
    var SCOPE = "original:create original:read signed:create user:read files:read";
    var AUTHORIZATION_CODE;

    var URL_AUTHORIZE = AUTH_HOST + AUTH_AUTHORIZE + "?" + "response_type=code&"
                        + "client_id=" + CLIENT_ID +"&"+ "redirect_uri="
                        + AUTH_REDIRECT_URI + "&" + "scope=" + SCOPE;

    function getAccessTokenUrl() {
        return AUTH_HOST + AUTH_TOKEN + "?"
                                + "client_id=" + CLIENT_ID + "&"
                                + "client_secret=" + CLIENT_SECRET+ "&"
                                + "redirect_uri=" + AUTH_REDIRECT_URI
                                + "&grant_type="+ "authorization_code"
                                + "&code=" + AUTHORIZATION_CODE;
    }

    function getRefreshTokenUrl() {
        return AUTH_HOST + AUTH_TOKEN + "?"
                            + "client_id=" + CLIENT_ID + "&"
                            + "client_secret=" + CLIENT_SECRET + "&"
                            + "grant_type=" + "refresh_token" + "&"
                            + "refresh_token=" + UserModule.getRefreshToken();
    }

    function getPendingFilesUrl() {
        return AUTH_HOST + "/v1/files/original/";
    }

    function getUploadFilesUrl() {
        return APP_HOST + "/upload";
    }

    function getAuthCode(code){
        return AUTHORIZATION_CODE;
    }

    function setAuthCode(code){
        AUTHORIZATION_CODE = code;
    }

    function getSigningUrl(){
        return AUTH_HOST + "/v1/signing/url/";
    }

    function getWebappUrl() {
        return SE_WEBAPP_HOST + "#/embedded-signing?hash=";
    }

    return {
        'URL_AUTHORIZE': URL_AUTHORIZE,
        'APP_HOST': APP_HOST,
        'setAuthCode': setAuthCode,
        'getAccessTokenUrl': getAccessTokenUrl,
        'getRefreshTokenUrl':getRefreshTokenUrl,
        'getPendingFilesUrl':getPendingFilesUrl,
        'getUploadFilesUrl':getUploadFilesUrl,
        'getSigningUrl':getSigningUrl,
        'getWebappUrl':getWebappUrl,
        'getAuthCode':getAuthCode
    }
})();
