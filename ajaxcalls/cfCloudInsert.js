var notifyTime = 4000;
var notifyError = 2000;

function apiPutData(userId,cloudaccesstoken,cloudrefreshtoken,cloudUserId,cloudName,userDisplayName,authorizationCode,isAzureFileShare) {
    var arr1;
    $('#myModal button').trigger('click');
    if (cloudName == "FTP") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "rootFolderId": authorizationCode,
            "cloudUserId": cloudUserId,
	    "businessCloud": false
        };
    }else if(cloudName === "FTP_BUSINESS"){
    cloudName = "FTP";
    arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": "FTP",
            "userId": userId,
            "userDisplayName": userDisplayName,
            "rootFolderId": authorizationCode,
            "cloudUserId": cloudUserId,
	    "businessCloud": true
        };	
    }
    else if (cloudName == "WEBDAV" || cloudName == "YANDEX_DISK" || cloudName == "AXWAY") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": authorizationCode
        };
    }
    else if (cloudName == "AMAZON" || cloudName == "WASABI" || cloudName == "AMAZON_GLACIER") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": "/"
        };
    }
		else if(cloudName == "AMAZON1"){
	cloudName = "AMAZON";
	arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": "/",
			"businessCloud":true
        };
	
	}
    else if (cloudName == "WALRUS" || cloudName == "CLOUDIAN" || cloudName == "CENTURYLINK") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName, //static
            "userId": userId, //CF userId
            "userDisplayName": userDisplayName, //cloud emailId
            "cloudUserId": cloudUserId, //accessKey
            "rootFolderId": "/"

        };
    }
    else if (cloudName == "SUGAR_SYNC") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName, //static
            "userId": userId, //CF userId
            "userDisplayName": userDisplayName, //cloud emailId
            "cloudUserId": "SUGAR_SYNC|" + cloudUserId, //accessKey
            "rootFolderId": "/"
        };
    }
    else if (cloudName == "DOCUMENTUM") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName, //static
            "userId": userId, //CF userId
            "userDisplayName": userDisplayName, //cloud emailId
            "cloudUserId": cloudUserId, //accessKey
            "rootFolderId": '/admin/'
        };
    }
    else if (cloudName == "SHAREPOINT_2010") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName, //static
            "userId": userId, //CF userId
            "userDisplayName": userDisplayName, //cloud emailId
            "cloudUserId": cloudUserId, //accessKey
            "rootFolderId": authorizationCode
        };
    }
    else if (cloudName == "SHAREPOINT_2013") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName, //static
            "userId": userId, //CF userId
            "userDisplayName": userDisplayName, //cloud emailId
            "cloudUserId": cloudUserId, //accessKey
            "rootFolderId": authorizationCode
        };
    }
    else if (cloudName == "ALFRESCO") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": authorizationCode
        };
    }
    else if (cloudName == "AZURE_OBJECT_STORAGE") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": "/",
	    "azureFileShare": isAzureFileShare,
        };
    }
    else if (cloudName == "GENERIC_OBJECT_STORAGE") {
        var clname = {
            "Cloudian": "CLOUDIAN",
            "Eucalyptus": "WALRUS",
            "HPHelion": ""
        };
        $.each(clname, function (key, value) {
            if (key == authorizationCode) {
                authorizationCode = value;
            }
        });
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": authorizationCode,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": "/"
        };
    }
    else if (cloudName == "NTLM_STORAGE" || cloudName == "CIFS") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": cloudrefreshtoken
        }
    }
    else if (cloudName == "CMIS") {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId,
            "rootFolderId": "/"
        };
    }
    else {
        arr1 = {
            "cloudStatus": "ACTIVE",
            "type": "CLOUD",
            "loadLock": false,
            "cloudName": cloudName,
            "userId": userId,
            "userDisplayName": userDisplayName,
            "cloudUserId": cloudUserId
        };
    }

	if (cloudName == "AZURE_OBJECT_STORAGE") {
	var apiUrl = apicallurl + "/users/" + userId + "/cloud/multiUser/create";
	method = "POST";	
	}
	else{
    var apiUrl = apicallurl + "/users/" + userId + "/cloud/create";
	method = "PUT";
	}
    if (cloudName == "SUGAR_SYNC" || cloudName == "NTLM_STORAGE") {
        arr1.accesstoken =  cloudaccesstoken;
    }
    else {
        arr1.accesstoken =  cloudaccesstoken;
        arr1.refreshtoken = cloudrefreshtoken;
    }

    $('#OauthButtons button:first').click();

    $.ajax({
        type: method,
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.UserAuthDetails
	    //make_base_auth(userId, getValidToken(userId))
            /*"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"*/
        },
        /*data:{signupdata:signupjson,"csurl":'http://localhost/cloudfuze/services/v1/users/add'},*/
        data: JSON.stringify(arr1),
        dataType: 'json',
        success: function (cloudObj) {
        },
        statusCode: {
            200: function (cloudObj) {
				if(cloudObj.length == undefined){
					cloudObj = cloudObj;
				}
				else{
					cloudObj = cloudObj[0];
				}
                if (cloudObj.length == 0) {
                    alertError("Failed in registering " + CLName[cloudName] + ' Please try again.');
                } else {
                    var test = $.inArray(cloudObj.id, CloudId);
                    if (test < 0) {
                        //  showNotyNotification('notify', CLName[cloudName] + ' Added successfully.');
                        alertSuccess('Account Added successfully.');
						activecampaign.eventTrack(cloudObj.cloudName,JSON.parse(localStorage.CFUser).primaryEmail,'Cloud Added');
                        $('#cm-managecloud').trigger('click');
                        //$.smallBox({title:textNotification,color:"#a4c400",timeout:notifyTime});
                        validations.cleandata();
                        localStorage.removeItem("boxtype");
                        AllCloudsInfo.push(cloudObj); 
                        CloudName.push(cloudObj.cloudName);
                        CloudId.push(cloudObj.id);
                        CLParent.push(cloudObj.rootFolderId);
                        CLDisplayName.push(cloudObj.userDisplayName);
                        if (cloudObj.cloudUserId != null) {
                            var clemail = cloudObj.cloudUserId.split('|');
                            PrimaryEmail.push(clemail[1]);
                        } else {
                            PrimaryEmail.push(cloudObj.userDisplayName)
                        }
                        $('#CloudDriveList').html('');
                        $('#MoveToFunctionality > ul#CloudDrives').html('');
                        $('#CFHGetClouds > ul#CloudDrives').html('');
                        CFManageCloudAccountsAjaxCall.getAllCloudTitles();
                    } else {
                        alertError(CLName[cloudName] + ' Already registered' +
                            ' with us.');
                    }
                }
            }
        },
        complete: function (xhr, statusText) {
            var Exception = xhr.getResponseHeader('exception');
            if(xhr.status == 409){
                alertError(CLName[cloudName]+' Already registered with us.');
            }
            else if(xhr.status == 403){
                alertError(Exception+".");
            }
            else if (xhr.status > 300 && xhr.status != 409) {
                alertError("Failed in registering "+CLName[cloudName]+' Please try again.');
            }
        }
    });
}
function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}