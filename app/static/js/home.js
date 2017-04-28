var HomeModule = (function() {

    var mFileName = "Test2.pdf"
    var fileId;
    var modal;
    var inputModal;

    // Get the <span> element that closes the modal
    var spanCloseButton;

    function getEmailId(){
        return prompt("Enter your email id");
    }

    function getNewFileName(){
        return prompt("Enter new file name if you want it changed (add .pdf)");
    }

    function processChildMessage(message) {
        ConstantModule.setAuthCode(message);
        getAccessToken();
    }

    function onSignWithSignEasyClicked(){
        if(!hasSession()){
            return popupCenter(ConstantModule.URL_AUTHORIZE,'Authorize',500,500);
        } else {
            if(ConstantModule.getAuthCode() && !hasSession()){
                getAccessToken();
            } else {
                if(fileId){
                    onOpenInWebapp();
                } else {
                    uploadFile();
                }
            }
        }
    }
    function hasSession(){
        return UserModule.getAccessToken();
    }

    function signWithSignEasy() {
        if(UserModule.getAccessToken()) {
            getAllPendingFiles();
        } else {
            return popupCenter(ConstantModule.URL_AUTHORIZE,'Authorize',500,500);//!window.open(URL_AUTHORIZE, 'Authorize', 'width=500,height=500');
        }
    }

    function onSELoginButtonClicked(){
        if(!UserModule.getAccessToken()) {
            return popupCenter(ConstantModule.URL_AUTHORIZE,'Authorize',500,500);//!window.open(URL_AUTHORIZE, 'Authorize', 'width=500,height=500');
        }
    }

    function loginUser(email){
        closeModal();
        if(email && typeof email === 'string'){
            var url = ConstantModule.APP_HOST+"/login";
            var params = "email=" + email;
            NetworkingModule.post(url, params, function(resp, err){
                if(!err){
                    var login_resp = JSON.parse(resp);
                    UserModule.setEmail(login_resp.email);
                    UserModule.setAccessToken(login_resp.access_token);
                    UserModule.setRefreshToken(login_resp.refresh_token);
                    setEmailIdOnPage();
                    setButtonVisibility();
                } else {
                    console.log(err,'loginUser');
                }
            })
        } else {
            onLoginCLicked();
        }
    }

    function getAccessToken(){
        var url = ConstantModule.getAccessTokenUrl();
        NetworkingModule.post(url, null, function(resp, err) {
            if(!err){
                var access_token_resp = JSON.parse(resp);
                UserModule.setAccessToken(access_token_resp.access_token);
                UserModule.setRefreshToken(access_token_resp.refresh_token);
                setUserToken();
                uploadFile();
            } else {
                console.log(err,'getAccessToken');
            }
        });
    }

    function setUserToken(){
        var url = ConstantModule.APP_HOST+"/token";
        var params = "email=" + UserModule.getEmail()
                    + "&" + "access_token=" + UserModule.getAccessToken()
                    + "&" + "refresh_token=" + UserModule.getRefreshToken();
        NetworkingModule.post(url, params, function(resp, err){
            if(!err){
                console.log('Saved tokens');
                setButtonVisibility();
            } else {
                console.log(err,'setUserToken');
            }
        });
    }

    function refreshAccessToken(callback){
        var url = ConstantModule.getRefreshTokenUrl();
        NetworkingModule.post(url, null, function(resp, err) {
            if(!err){
                var access_token_resp = JSON.parse(resp);
                UserModule.setAccessToken(access_token_resp.access_token);
                UserModule.setRefreshToken(access_token_resp.refresh_token);
                setUserToken();
                callback();
            } else {
                console.log(err,'refreshAccessToken');
                callback();
            }
        });
    }

    function getAllPendingFiles(){
        var urlPending = ConstantModule.getPendingFilesUrl();
        NetworkingModule.getv4(urlPending,function(resp,err){
            if(!err){
                console.log(resp);
            } else {
                alert(err);
            }
        },getAllPendingFiles);
    }

    function setEmailIdOnPage(){
        if(UserModule.getEmail()){
            document.getElementById("fieldUsername").textContent = "You are logged in as " + UserModule.getEmail();
        } else {
            document.getElementById("fieldUsername").textContent = "You are not logged in";
        }
    }

    function onLoginCLicked(){
        showInputModal("Please enter your username","Login",loginUser);
    }

    function uploadFile(inFileName){
        var finalFileName = mFileName;
        if(inFileName && typeof inFileName === 'string'){
            finalFileName = inFileName;
        }
        uploadFileRequest(fixFileNames(finalFileName));
        closeModal();
        showModal("Uploading file.... <br><br>"+ "File Name : <i>"+fixFileNames(finalFileName),"</i>Uploading",null);
    }

    function fixFileNames(inFileName){
        var outFileName = inFileName;
        if(!(inFileName.indexOf('pdf') >= 0)){
            outFileName =  outFileName + ".pdf";
        }
        return outFileName;
    }

    function uploadFileRequest(fileName){
        var urlOriginal = ConstantModule.getUploadFilesUrl();
        NetworkingModule.postMultipartv4(urlOriginal,function(resp,err){
            if(!err){
                console.log(resp);
                var uploadResp = JSON.parse(resp);
                fileId = uploadResp.id;
                closeModal();
                if(fileId){
                    showModal("File:  <i>"+ fileName +"</i>  successfully uploaded. \n \nClick to Sign with SignEasy","SIGN",onOpenInWebapp);
                } else if(uploadResp.error_code && uploadResp.error_code === "filename_exists"){
                    showInputModal("File already exists. Rename to upload","Rename",uploadFile);
                }
            } else {
                alert(err);
            }

        },uploadFileRequest,fileName);
    }

    function setButtonVisibility(){
        if(!UserModule.getEmail()){
            setEnabled(false,'logoutButton');
            setEnabled(true,'loginButton');
            setVisible(false,'openInWebapp');
            setVisible(false,'documentView');
        } else if(UserModule.getAccessToken()){
            setEnabled(true,'logoutButton');
            setEnabled(false,'loginButton');
            setVisible(true,'openInWebapp');
            setEnabled(true,'openInWebapp');
            setVisible(true,'documentView');
        } else {
            setEnabled(false,'logoutButton');
            setEnabled(false,'loginButton');
            setVisible(true,'openInWebapp');
            setEnabled(true,'openInWebapp');
            setVisible(true,'documentView');
        }
    }

    function setEnabled(isVisible, id){
        document.getElementById(id).disabled = !isVisible;
    }

    function setVisible(isVisible, id){
        if(isVisible){
            document.getElementById(id).style.visibility = "visible";
        } else {
            document.getElementById(id).style.visibility = "hidden";
        }
    }

    function onLogoutClicked(){
        var url = ConstantModule.APP_HOST+"/logout";
        var params = "email=" + UserModule.getEmail();
        NetworkingModule.post(url, params, function(resp, err){
            if(!err){
                var login_resp = JSON.parse(resp);
                UserModule.setEmail("");
                UserModule.setAccessToken(login_resp.access_token);
                UserModule.setRefreshToken(login_resp.refresh_token);
                setEmailIdOnPage();
                setButtonVisibility();
            } else {
                console.log(err,'logout');
            }
        });

    }

    function onOpenInWebapp(){
        closeModal();
        if(fileId){
            var popWindow = popupCenter('', 'Sign With SignEasy', 1280, 800);//window.open('', '_blank');
            popWindow.onload = function () {
                popWindow.document.write('Loading preview...');
            };
            NetworkingModule.postv4(ConstantModule.getSigningUrl(),function(resp,err){
                if(!err){
                    var signingResp = JSON.parse(resp);
                    console.log(signingResp.url);
                    popWindow.location.href = signingResp.url;
                } else {
                    alert(err);
                    popWindow.document.write('Something went wrong');
                }

            },onOpenInWebapp,"file_id="+fileId);
        } else {
            window.alert("Please Upload the file");
        }
    }

    function openInNewTab(inUrl) {
        var win = window.open(inUrl, '_blank');
    }
    function popupCenter(url, title, w, h) {
    // Fixes dual-screen position Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined
                        ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined
                        ? window.screenTop : screen.top;

    var width = window.innerWidth
                ? window.innerWidth
                : document.documentElement.clientWidth
                ? document.documentElement.clientWidth
                : screen.width;

    var height = window.innerHeight
                ? window.innerHeight
                : document.documentElement.clientHeight
                ? document.documentElement.clientHeight
                : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    return window.open(url, title, 'scrollbars=yes, width='
                        + w + ', height=' + h + ', top='
                        + top + ', left=' + left);

    }

    // When the user clicks the button, open the modal
    function showModal(message, buttonText, callback) {
        modal = document.getElementById('genericModal');
        modal.style.display = "block";
        document.getElementById('modalMessage').innerHTML = message;
        document.getElementById('modalButton').innerHTML = buttonText;
        document.getElementById('modalButton').addEventListener("click", callback);
    }

    // When the user clicks the button, open the modal
    function showInputModal(message, buttonText, callback) {
        modal = document.getElementById('genericInputModal');
        modal.style.display = "block";
        document.getElementById('modalInputMessage').innerHTML = message;
        document.getElementById('modalInputButton').innerHTML = buttonText;
        document.getElementsByName("inputText")[0].value = "";
        document.getElementsByName("inputText")[0].focus();
        document.getElementById('modalInputButton').addEventListener("click", function(){
            callback(document.getElementsByName("inputText")[0].value)
        });
    }

    function submitHandler(){
        document.getElementById('modalInputButton').click();
        return false;
    }

    // When the user clicks on <span> (x), close the modal
    function closeModal() {
        clearModalButtonListener("modalButton");
        clearModalButtonListener("modalInputButton");
        modal = document.getElementById('genericModal');
        modal.style.display = "none";

        inputModal = document.getElementById('genericInputModal');
        inputModal.style.display = "none";
    }

    function clearModalButtonListener(modalbuttonTag){
        var old_element = document.getElementById(modalbuttonTag);
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == inputModal) {
            inputModal.style.display = "none";
        }
    }

    return {
        'processChildMessage': processChildMessage,
        'signWithSignEasy': signWithSignEasy,
        'loginUser': loginUser,
        'refreshAccessToken': refreshAccessToken,
        'setUserToken': setUserToken,
        'onLoginCLicked': onLoginCLicked,
        'onLogoutClicked':onLogoutClicked,
        'onSELoginButtonClicked':onSELoginButtonClicked,
        'onOpenInWebapp':onOpenInWebapp,
        'showModal':showModal,
        'closeModal':closeModal,
        'onSignWithSignEasyClicked':onSignWithSignEasyClicked,
        'submitHandler':submitHandler
    };

})();
