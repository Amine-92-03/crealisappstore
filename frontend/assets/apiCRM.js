var listener = 0;
export default class InsertRecordsAPI {

	async insertRecords()	{
		var url = "https://www.zohoapis.eu/crm/v2/Leads"
        var parameters = new Map()
        var headers = new Map()
        var token = {
            grant_type : "refresh_token",
            client_id:"1000.JFGTCHR5OPMCMP7BR3FI88JV5OXBHY",
            client_secret: "b2d797218b022b4930df18a67ce330c88184870c85",
            refresh_token: "1000.d0c9e3458460dc2ef79674fe7e38ed02.11ff38932cc7959ed210c85cc2676d22",
            redirectUrl:"",
            scope:"ZohoCRM.users.ALL"
            // ZohoCRM.bulk.read,ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,Aaaserver.profile.Read,ZohoCRM.org.ALL,profile.userphoto.READ,ZohoFiles.files.ALL,ZohoCRM.bulk.ALL,ZohoCRM.settings.variable_groups.ALL
        }
        console.log('token',token);
        var accesstoken = await new InsertRecordsAPI().getToken(token)
       
        // console.log('accesstoken',accesstoken);
        // return 1
        headers.set("Authorization", "Zoho-oauthtoken " + accesstoken)
        var requestMethod = "POST"
        var reqBody = {"data":[{"Last_Name":"Lead_changed","Email":"newcrmapi@zoho.com","Company":"abc","Lead_Status":"Contacted"},{"Last_Name":"New Lead","Email":"newlead@zoho.com","Company":"abc","Lead_Status":"Contacted"}],"trigger":["approval","workflow","blueprint"]}
        var params = "";
        parameters.forEach(function(value, key) {
            if (parameters.has(key)) {
                if (params) {
                    params = params + key + '=' + value + '&';
                }
                else {
                    params = key + '=' + value + '&';
                }
            }
        });
        var apiHeaders = {};
        if(headers) {
            headers.forEach(function(value, key) {
                apiHeaders[key] = value;
            });
        }
        if (params.length > 0){
            url = url + '?' + params.substring(0, params.length - 1);
        }
        var requestObj = {
            uri : url,
            method : requestMethod,
            headers : apiHeaders,
            body : JSON.stringify(reqBody),
            encoding: "utf8",
            allowGetBody : true,
			throwHttpErrors : false
        };
        var result = await new InsertRecordsAPI().makeAPICall(requestObj);
        console.log(result.status)
        console.log(result.response)
	}

    async getToken(token) {

        if(listener == 0) {

            window.addEventListener("storage", function(reponse) {
                if(reponse.key === "access_token" && (reponse.oldValue != reponse.newValue || reponse.oldValue == null)){
                    location.reload();
                }
                if(reponse.key === "access_token"){
                    sessionStorage.removeItem("__auth_process");
                }
            }, false);
            listener = 1;
            if(sessionStorage.getItem("__auth_process")) {
                sessionStorage.removeItem("__auth_process");
            }
        }
        ["granted_for_session", "access_token","expires_in","expires_in_sec","location","api_domain","state","__token_init","__auth_process"].forEach(function (k) {
            var isKeyExists = localStorage.hasOwnProperty(k);
            if(isKeyExists) {
                sessionStorage.setItem(k, localStorage[k]);
            }
            localStorage.removeItem(k);
        });
        var valueInStore = sessionStorage.getItem("access_token");
        var tokenInit = sessionStorage.getItem("__token_init");
        if(tokenInit != null && valueInStore != null && Date.now() >= parseInt(tokenInit) + 59 * 60 * 1000){ // check after 59th minute
            valueInStore = null;
            sessionStorage.removeItem("access_token");
        }

        var auth_process = sessionStorage.getItem("__auth_process");
        if ((valueInStore == null && auth_process == null) || (valueInStore == 'undefined' && (auth_process == null || auth_process == "true"))) {
            var accountsUrl = "https://accounts.zoho.eu/oauth/v2/auth"
            var clientId;
            var scope;
            var redirectUrl;
            if(token != null) {
                clientId = token.client_Id;
                scope = token.scope;
                redirectUrl = token.redirectUrl;
            }

            var fullGrant = sessionStorage.getItem("full_grant");
            var grantedForSession = sessionStorage.getItem("granted_for_session");
            if(sessionStorage.getItem("__token_init") != null && ((fullGrant != null && "true" == full_grant) || (grantedForSession != null && "true" == grantedForSession))) {
                accountsUrl += '/refresh';
            }
            if (clientId && scope) {
                sessionStorage.setItem("__token_init", Date.now());
                sessionStorage.removeItem("access_token");
                sessionStorage.setItem("__auth_process", "true");
                window.open(accountsUrl + "?" + "scope" + "=" + scope + "&"+ "client_id" +"=" + clientId + "&response_type=token&state=zohocrmclient&redirect_uri=" + redirectUrl);
                ["granted_for_session", "access_token","expires_in","expires_in_sec","location","api_domain","state","__token_init","__auth_process"].forEach(function (k) {
                    var isKeyExists = localStorage.hasOwnProperty(k);
                    if(isKeyExists){
                        sessionStorage.setItem(k, localStorage[k]);
                    }
                    localStorage.removeItem(k);
                });
                valueInStore = sessionStorage.getItem("access_token");
            }
        }
        if(token != null && valueInStore != 'undefined'){
            token.accessToken = valueInStore;
        }
        return token.accessToken;
    }

    async makeAPICall(requestDetails) {
        return new Promise(function (resolve, reject) {
            var body, xhr, i;
            body = requestDetails.body || null;
            xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open(requestDetails.method, requestDetails.uri, true);
            for (i in requestDetails.headers) {
                xhr.setRequestHeader(i, requestDetails.headers[i]);
            }
            xhr.send(body);
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    resolve(xhr);
                }
            }
        })
    }
}
