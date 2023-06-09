var notifyTime = 4000;
var notifyError = 2000;
var sharepointListId;
var _cccount = 1;
var ONE_KB = 1024;
var ONE_MB = ONE_KB * ONE_KB;
var ONE_GB = ONE_KB * ONE_MB;
var _page_Num =1;
var CFManageCloudAccountsAjaxCall = {

    //CloudFuze Users
    getAuthDetails: function () {
        var dt = new Date();
        var time = dt.getTime();
        if (localStorage.getItem("time") != null) {
            if (time - localStorage.getItem("time") >= 7200000) {
                alertError("Your session has expired.  Please log in again.");
                setTimeout(function () {
                    $('.cf-logout').trigger("click");
                    window.location.href = "index.html";
                }, 2000);
            }
        }
        localStorage.setItem("time", time);
        $.ajaxSetup({
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    var a = window.location.pathname;
                    var b = /cloudmanager/i.test(a);
                    /*if (b) {
                        return false;
                    }
                    else*/
					if (PageName == "InnerFolders" && previousPage == "Share with Me") {
                        return false;
                    }
		 else {
                        var notification = {};
                        if (localStorage.getItem('UserAuthDetails') == undefined
                            || localStorage.getItem('UserAuthDetails') == null
                            || localStorage.getItem('UserAuthDetails') == 'null') {
                            alertSuccess("You have been logged out");
                        } else {
                            alertSuccess("Your password was changed.Please relogin");
                        }
                        setTimeout(function () {
                            $('.cf-logout').trigger("click"); 
                            window.location.href = "index.html"; 
                        }, 3000);
                    }
                } else if (jqXHR.status === 503) {
                    alertSuccess("Server is under maintanance.");
                }
            }
        });
        return localStorage.getItem("UserAuthDetails");
    },
    getUserId: function () {
        return localStorage != null ? localStorage.getItem("UserId") : '';
    },
    getUserEmail: function () {
        return JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
    },
    isPaidUser: function () {
        var apiUrl = apicallurl + "/subscription/status/" + CFManageCloudAccountsAjaxCall.getUserId();
        var isPaidUser = false;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (isPaid) {
                isPaidUser = isPaid;
            }
        });
        return isPaidUser;
    },
    isCustomUser: function() {
        var _isCustomUser = false;
        var _url = apicallurl + "/report/entuser/validate/"+CFManageCloudAccountsAjaxCall.getUserId();
        $.ajax({
            type: "GET",
            url: _url,
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (result) {
                if(result && result == true){
                    if($("#sixGbmsg")){
                        $("#sixGbmsg").css("display","none");

                        $("#cusDelta").css("display","");

                    }
                    _isCustomUser = true;
                }
            }
        });
		setTimeout(function(){
			$("#CFShowLoading").modal("hide")
			},500);
        return _isCustomUser; 
    },

    //CloudFuze Clouds
    getAllClouds: function (src,dstn,page) {
        // var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/get/all";
        var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/get/all/cloud";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (AllClouds) {
                if (AllClouds.length == 0 && count == 1) {
                    sessionStorage.setItem('clouds', false);
                } else {
                    sessionStorage.setItem('clouds', true);
                }
                AllCloudsInfo = AllClouds;
                CloudName = [];
                CloudId = [];
                CLParent = [];
                PrimaryEmail = [];
                CLDisplayName = [];
                UserType = [];
                totalNumOfClouds = AllCloudsInfo.length;
                addedCldsList = CloudName;
                totalodfbUsers = 0;
                totaldbfbUsers = 0;
				totalDataSize = 0;
				totalDomains =[];
                $.each(AllClouds, function (i, cloudObj) {
                    if(cloudObj.cloudName ==="ONEDRIVE_BUSINESS_ADMIN"){
                        totalodfbUsers =  totalodfbUsers + cloudObj.totolClouds; 
                    }
                    if(cloudObj.cloudName ==="DROPBOX_BUSINESS"){
                        totaldbfbUsers =  totaldbfbUsers + cloudObj.totolClouds;
                    }
					if(!(UserType.includes('ADMIN'))){
						totalDataSize = totalDataSize + cloudObj.usedSpace;
						
					}
                    CloudName.push(cloudObj.cloudName);
                    CloudId.push(cloudObj.id);
					if(cloudObj.domainList != null){
					for(var i=0;i<cloudObj.domainList.length;i++){
						totalDomains.push(cloudObj.domainList[i]);
					}
					}
				
                    CLParent.push(cloudObj.rootFolderId);
                    var dispname = cloudObj.userDisplayName;
                    var clemail = cloudObj.cloudUserId;
                    UserType.push(cloudObj.userType);
                    if (clemail != null) {
                        clemail = clemail.split('|');
                        PrimaryEmail.push(clemail[clemail.length - 1]);
                    }

                    if (dispname == null || dispname.length == 0) {
                        CLDisplayName.push(clemail[clemail.length - 1]);
                    } else {
                        CLDisplayName.push(dispname);
                    }

                    if (cloudObj.loadLock && /fileManager.html/.test(window.location.href)) {
                        CFManageCloudAccountsAjaxCall.CloudSyncStatus(cloudObj.id);
                    }
                });
				

			/*	if (totalNumOfClouds !== 0) {
					setTimeout(function () {
						totalDataSize = CFManageCloudAccountsAjaxCall.getObjectSize(totalDataSize);
					if(localStorage.getItem('CFUser') != undefined && localStorage.getItem('CFUser') != null){ 
						activecampaign.getContactDtls(JSON.parse(localStorage.getItem('CFUser')).primaryEmail); 
						}
						}, 3000);
}*/
                return true;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    if(localStorage.getItem("storageVal") == null){
                        alertSuccess("You have been logged out");
                    }
                    else
                        alertError("Operation Failed");
                }            }
        });
    },
    getClouds: function (cldId) {
        var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/get/all/cloud";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (AllClouds) {
                if (AllClouds.length == 0 && count == 1) {
                    sessionStorage.setItem('clouds', false);
                } else {
                    sessionStorage.setItem('clouds', true);
                }
                AllCloudsInfo = AllClouds;
                CloudName = [];
                CloudId = [];
                CLParent = [];
                PrimaryEmail = [];
                CLDisplayName = [];
                UserType = [];
                totalNumOfClouds = AllCloudsInfo.length;
                addedCldsList = CloudName;
                totalodfbUsers = 0;
                totaldbfbUsers = 0;
                $.each(AllClouds, function (i, cloudObj) {
                    CloudName.push(cloudObj.cloudName);
                    CloudId.push(cloudObj.id);
                    CLParent.push(cloudObj.rootFolderId);
                    var dispname = cloudObj.userDisplayName;
                    var clemail = cloudObj.cloudUserId;
                    UserType.push(cloudObj.userType);
                    if (clemail != null) {
                        clemail = clemail.split('|');
                        PrimaryEmail.push(clemail[clemail.length - 1]);
                    }

                    if (dispname == null || dispname.length == 0) {
                        CLDisplayName.push(clemail[clemail.length - 1]);
                    } else {
                        CLDisplayName.push(dispname);
                    }

                    if (cloudObj.loadLock && /fileManager.html/.test(window.location.href)) {
                        CFManageCloudAccountsAjaxCall.CloudSyncStatus(cloudObj.id);
                    }
                    for(j=0;j<AllCloudsInfo.length;j++) {
                        if (AllCloudsInfo[j].id === cldId) {
                            if (AllCloudsInfo[i].cloudName === "GOOGLE_SHARED_DRIVES" || AllCloudsInfo[i].cloudName === "EGNYTE_ADMIN" || AllCloudsInfo[i].cloudName === "G_SUITE" || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID"|| AllCloudsInfo[i].cloudName === "BOX_BUSINESS"|| AllCloudsInfo[i].cloudName === "SHAREPOINT_ONLINE_BUSINESS") {
                                if (AllCloudsInfo[j].totolClouds != null) {
                                    CFManageCloudAccountsAjaxCall.progressOfUsers(cldId, AllCloudsInfo[j].cloudName);
                                } else {
                                    setTimeout(function () {
                                        CFManageCloudAccountsAjaxCall.getClouds(AllCloudsInfo[i].id);
                                    }, 60000);
                                }
                            }
                        }
                    }
                });
                return true;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    if(localStorage.getItem("storageVal") == null){
                        alertSuccess("You have been logged out");
                    }
                    else
                        alertError("Operation Failed");
                }            }
        });
    },
    getAllCloudTitles: function () {
        var uniqueCloudNames = CloudName.filter(function (itm, i, CloudName) {
            return i == CloudName.indexOf(itm);
        });
        $.each(uniqueCloudNames, function (i, CName) {
            var CFCName;
            $.each(CLName, function (key, value) {
                if (key == CName) {
                    CFCName = value;
                }
            });
            if (MultiUserClouds.indexOf(CName) == -1){
                $('#CloudDriveList').append('<li style="padding-left:0;border-bottom: 1px solid #024A5B;"><i class="Driveicon" id="' + CName + '"></i><a href="#" class="cltrigger">' + CFCName + '</a><ul class="clsubmenu" style="display: none;" id="' + CName + '"></ul></li>');
            }

            CFManageCloudAccountsAjaxCall.getAllCloudChilds(CloudName, CName, CFCName, CloudId, CLParent);
        });
    },
    getAllCloudChilds: function (CloudName, CName, CFCName, CloudId, CLParent) {
        for (var i = 0; i < CloudName.length; i++) {
            if (CName == CloudName[i] && (MultiUserClouds.indexOf(CName) == -1)) {
                var _a = AllCloudsInfo[i].cloudStatus == "INACTIVE" ? "cf-warning ErrorRefresh" : "lnil lnil-reload";
                $("#CloudDriveList").find(".clsubmenu[id='" + CName + "']").append('<li style="padding-left:10px;height:23px;"' +
                    ' id="' + CloudId[i] + '" class="getCloudFiles" pid="' + CLParent[i] + '">' +
                    '<p class="cloudDispName">' + CLDisplayName[i] + '</p>' +
                    '<i class="' + _a + '" style="font-size:15px" id="' + CloudId[i] + '"></i></li>');
            }
        }
    },
    getAllCloudTitlesSettings: function (CloudName, CloudId) {
        $('#manageclouddiv').children('div').html('');
        for (var i = 0; i < CloudName.length; i++) {
            if(AllCloudsInfo[i].userType === "ADMIN") {
                if(AllCloudsInfo[i].cloudName === "GOOGLE_SHARED_DRIVES" || AllCloudsInfo[i].cloudName === "EGNYTE_ADMIN" || AllCloudsInfo[i].cloudName === "G_SUITE" || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID" || AllCloudsInfo[i].cloudName === "BOX_BUSINESS"||AllCloudsInfo[i].cloudName === "SHAREPOINT_ONLINE_BUSINESS"){
                    if (AllCloudsInfo[i].totolClouds === null || AllCloudsInfo[i].totolClouds === 0) {
			
                        var html = '<div class="cloudsinfo" id="cloudInfo" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 5px;height:80px;width:100%;margin-bottom: 2%;">'+ 
	'<div id="mngCloudIcon" style="width: 7%;padding: 1.5% 1%;float:left;text-align:center;padding-top: 1%;"><div class="bg-cfIcon"></div></div>'+
	'<div id="mngCloudName" style="width: 22%;padding:2.7% 1%;float:left;color:#1F2129;font-weight:500;"><span>' + CLName[CloudName[i]] + '</span></div>'+
	'<div id="mngCloudData" style="width: 20%;padding: 2% 1%;float:left;">'+
	'<div style="width: 100%;" id="incrementProgress"><p id="usersDisplay" class="userCount'+AllCloudsInfo[i].id+'" style="color: #707070;font-size: 12px;width: 135px;float: left;margin-bottom: 2%;">0 out of 0 Users </p><span id="percentOfUsers" style="font-size: 12px;font-weight: 600;float: left;color: #000;">0%</span>'+
	'<div class="progress" style="height: 6px;width: 170px;border-radius: 15px;background: #d9534f;"><div class="progress-bar progress-bar-success progressGreen" role="progressbar" style="width:64%;background: #4CAF50;height: 100%;border-radius: 25px;"></div></div></div></div>'+
	'<div id="mngCloudSync" style="width: 3%;padding: 2.7% 3.8% 0% 0%;float:left;"><i class="lnir lnir-spinner-arrow" id="reAuthorizeCld" title="Reauthenticate users" style="font-size: 15px;font-weight:600;"></i><img src="../img/retry.gif" id="AuthorizeCld" title="Authenticating users"  style="margin-left: 61%;height: 20px;width: 20px;cursor: pointer;margin-top: 12%;display: none"/></div>'+
	'<div id="mngCloudEmail" style="width: 28%;padding: 2.7% 1%;float:left;"><span title="titleEmail">emailId</span></div>'+
	'<div id="mngCloudType" style="width: 8%;padding: 2.7% 1%;float:left;"><span>userType</span></div>'+
	'<div id="mngCloudRemove" style="width: 6%;padding: 2.7% 2%;float:left;text-align: right;"><i cldId="' + AllCloudsInfo[i].id + '" id="delCld"  data-action="delete" data-id="' + AllCloudsInfo[i].id + '"  data-toggle="modal" data-target="#CFCLdeleteModal" class="lnil lnil-trash-can-alt" style="font-size: 17px;cursor:pointer;"></i></div>'+
	'<div id="' + AllCloudsInfo[i].id + '" name="' + AllCloudsInfo[i].cloudName + '"class="getCloudsInfo" style="width: 4%;padding: 2.7% 1%;float:left;text-align:center;cursor:pointer;"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 20px;font-weight:600;"></i></div><hr id="manageInfoHr" style="margin-top: 8%;width: 96%;display:none">'+
	'<div class="appendcloudDetails" style="width: 96%;margin: 2%;border-radius: 5px;display:none"></div></div>';
                        CFManageCloudAccountsAjaxCall.getClouds(AllCloudsInfo[i].id);
                    }
                    else {
                        var cldname = AllCloudsInfo[i].cloudName;
                        var cldId = AllCloudsInfo[i].id;
                        var totalCount = AllCloudsInfo[i].totolClouds;
                        if (AllCloudsInfo[i].notProvisioned > 0 || AllCloudsInfo[i].provisionedClouds > 0 || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS") {
                            if (AllCloudsInfo[i].notProvisioned !== null || AllCloudsInfo[i].notProvisioned !== 0) {
                                var prvsnLen = AllCloudsInfo[i].provisionedClouds;
                                var prvsnWidth = Math.round(prvsnLen / totalCount * 100);
                                if (AllCloudsInfo[i].notProvisioned !== AllCloudsInfo[i].totolClouds) {
                                    if (prvsnWidth === 0) {
                                        prvsnWidth = 2;
                                    }
                                }

									   var html = '<div class="cloudsinfo" id="cloudInfo" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 5px;height:80px;width:100%;margin-bottom: 2%;">'+
	'<div id="mngCloudIcon" style="width: 7%;padding: 1.5% 1%;float:left;text-align:center;padding-top: 1%;"><div class="bg-cfIcon"></div></div>'+
	'<div id="mngCloudName" style="width: 22%;padding:2.7% 1%;float:left;color:#1F2129;font-weight:500;"><span>' + CLName[CloudName[i]] + '</span></div>'+
	'<div id="mngCloudData" style="width: 20%;padding: 2% 1%;float:left;">'+
	'<div style="width: 100%;" id="incrementProgress"><p id="usersDisplay" class="userCount'+AllCloudsInfo[i].id+'" style="color: #707070;font-size: 12px;width: 135px;float: left;margin-bottom: 2%;">'+prvsnLen+' out of ' + totalCount + ' Users </p><span id="percentOfUsers" style="font-size: 12px;font-weight: 600;float: left;color: #000;">100%</span>'+
	'<div class="progress" style="height: 6px;width: 170px;border-radius: 15px;background: #d9534f;"><div class="progress-bar progress-bar-success progressGreen" role="progressbar" style="width:'+prvsnWidth+'%;background: #4CAF50;height: 100%;border-radius: 25px;"></div></div></div></div>'+
	'<div id="mngCloudSync" style="width: 3%;padding: 2.7% 3.8% 0% 0%;float:left;"><i class="lnir lnir-spinner-arrow" id="reAuthorizeCld" title="Reauthenticate users" style="font-size: 15px;font-weight:600;"></i><img src="../img/retry.gif" id="AuthorizeCld" title="Authenticating users"  style="margin-left: 61%;height: 20px;width: 20px;cursor: pointer;margin-top: 12%;display: none"/></div>'+
	'<div id="mngCloudEmail" style="width: 28%;padding: 2.7% 1%;float:left;"><span title="titleEmail">emailId</span></div>'+
	'<div id="mngCloudType" style="width: 8%;padding: 2.7% 1%;float:left;"><span>userType</span></div>'+
	'<div id="mngCloudRemove" style="width: 6%;padding: 2.7% 2%;float:left;text-align: right;"><i cldId="' + AllCloudsInfo[i].id + '" id="delCld"  data-action="delete" data-id="' + AllCloudsInfo[i].id + '" data-toggle="modal" data-target="#CFCLdeleteModal" class="lnil lnil-trash-can-alt" style="font-size: 17px;cursor:pointer;"></i></div>'+ 
	'<div id="' + AllCloudsInfo[i].id + '" name="' + AllCloudsInfo[i].cloudName + '"class="getCloudsInfo" style="width: 4%;padding: 2.7% 1%;float:left;text-align:center;cursor:pointer;"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 20px;font-weight:600;cursor:pointer;"></i></div><hr id="manageInfoHr" style="margin-top: 8%;width: 96%;display:none">'+
	'<div class="appendcloudDetails" style="width: 96%;margin: 2%;border-radius: 5px;display:none"></div></div>';
                            } else {
                             
									var html = '<div class="cloudsinfo" id="cloudInfo" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 5px;height:80px;width:100%;margin-bottom: 2%;">'+
	'<div id="mngCloudIcon" style="width: 7%;padding: 1.5% 1%;float:left;text-align:center;padding-top: 1%;"><div class="bg-cfIcon"></div></div>'+
	'<div id="mngCloudName" style="width: 22%;padding:2.7% 1%;float:left;color:#1F2129;font-weight:500;"><span>' + CLName[CloudName[i]] + '</span></div>'+
	'<div id="mngCloudData" style="width: 20%;padding: 2% 1%;float:left;">'+
	'<div style="width: 100%;" id="incrementProgress"><p id="usersDisplay" class="userCount'+AllCloudsInfo[i].id+'" style="color: #707070;font-size: 12px;width: 135px;float: left;margin-bottom: 2% 1%;">'+totalCount+' out of ' + totalCount + ' Users </p><span id="percentOfUsers" style="font-size: 12px;font-weight: 600;float: left;color: #000;">100%</span>'+
	'<div class="progress" style="height: 6px;width: 170px;border-radius: 15px;background: #d9534f;"><div class="progress-bar progress-bar-success progressGreen" role="progressbar" style="width:100%;background: #4CAF50;height: 100%;border-radius: 25px;"></div></div></div></div>'+
	'<div id="mngCloudSync" style="width: 3%;padding: 2.7% 3.8% 0% 0%;float:left;"><i class="lnir lnir-spinner-arrow" id="reAuthorizeCld" title="Reauthenticate users" style="font-size: 15px;font-weight:600;"></i><img src="../img/retry.gif" id="AuthorizeCld" title="Authenticating users"  style="margin-left: 61%;height: 20px;width: 20px;cursor: pointer;margin-top: 12%;display: none"/></div>'+
	'<div id="mngCloudEmail" style="width: 28%;padding: 2.7% 1%;float:left;"><span title="titleEmail">emailId</span></div>'+
	'<div id="mngCloudType" style="width: 8%;padding: 2.7% 1%;float:left;"><span>userType</span></div>'+
	'<div id="mngCloudRemove" style="width: 6%;padding: 2.7% 2%;float:left;text-align: right;"><i cldId="' + AllCloudsInfo[i].id + '" id="delCld"  data-action="delete" data-id="' + AllCloudsInfo[i].id + '" data-toggle="modal" data-target="#CFCLdeleteModal" class="lnil lnil-trash-can-alt" style="font-size: 17px;cursor:pointer;"></i></div>'+
	'<div id="' + AllCloudsInfo[i].id + '" name="' + AllCloudsInfo[i].cloudName + '"class="getCloudsInfo" style="width: 4%;padding: 2.7% 1%;float:left;text-align:center;cursor:pointer;"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 20px;font-weight:600;"></i></div><hr id="manageInfoHr" style="margin-top: 8%;width: 96%;display:none">'+
	'<div class="appendcloudDetails" style="width: 96%;margin: 2%;border-radius: 5px;display:none"></div></div>';
                            }
                        }
                        else {
                            var _progress = CFManageCloudAccountsAjaxCall.progress(cldId, cldname);
                            var _prvsnWidth = Math.round(_progress/totalCount*100);
                       
								var html = '<div class="cloudsinfo" id="cloudInfo" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 5px;height:80px;width:100%;margin-bottom: 2%;">'+
	'<div id="mngCloudIcon" style="width: 7%;padding: 1.5% 1%;float:left;text-align:center;padding-top: 1%;"><div class="bg-cfIcon"></div></div>'+
	'<div id="mngCloudName" style="width: 20%;padding:2.7% 1%;float:left;color:#1F2129;font-weight:500;"><span>' + CLName[CloudName[i]] + '</span></div>'+
	'<div id="mngCloudData" style="width: 22%;padding: 2%;float:left;">'+
	'<div style="width: 100%;" id="incrementProgress"><p id="usersDisplay" class="userCount'+AllCloudsInfo[i].id+'" style="color: #707070;font-size: 12px;width: 135px;float: left;margin-bottom: 2% 1%;">'+_progress+' out of ' + totalCount + ' Users </p><span id="percentOfUsers" style="font-size: 12px;font-weight: 600;float: left;color: #000;">0%</span>'+
	'<div class="progress" style="height: 6px;width: 170px;border-radius: 15px;background: #d9534f;"><div class="progress-bar progress-bar-success progressGreen" role="progressbar" style="width:'+_prvsnWidth+'%;background: #4CAF50;height: 100%;border-radius: 25px;"></div></div></div></div>'+
	'<div id="mngCloudSync" style="width: 3%;padding: 2.7% 3.8% 0% 0%;float:left;"><i class="lnir lnir-spinner-arrow" id="reAuthorizeCld" title="Reauthenticate users" style="font-size: 15px;font-weight:600;"></i><img src="../img/retry.gif" id="AuthorizeCld" title="Authenticating users"  style="margin-left: 61%;height: 20px;width: 20px;cursor: pointer;margin-top: 12%;display: none"/></div>'+
	'<div id="mngCloudEmail" style="width: 28%;padding: 2.7% 1%;float:left;"><span title="titleEmail">emailId</span></div>'+
	'<div id="mngCloudType" style="width: 8%;padding: 2.7% 1%;float:left;"><span>userType</span></div>'+
	'<div id="mngCloudRemove" style="width: 6%;padding: 2.7% 2%;float:left;text-align: right;"><i cldId="' + AllCloudsInfo[i].id + '" id="delCld"  data-action="delete" data-id="' + AllCloudsInfo[i].id + '" data-toggle="modal" data-target="#CFCLdeleteModal" class="lnil lnil-trash-can-alt" style="font-size: 17px;cursor:pointer;"></i></div>'+
	'<div id="' + AllCloudsInfo[i].id + '" name="' + AllCloudsInfo[i].cloudName + '"class="getCloudsInfo" style="width: 4%;padding: 2.7% 1%;float:left;text-align:center;cursor:pointer;"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 20px;font-weight:600;"></i></div><hr id="manageInfoHr" style="margin-top: 8%;width: 96%;display:none">'+
	'<div class="appendcloudDetails" style="width: 96%;margin: 2%;border-radius: 5px;display:none"></div></div>';
                            CFManageCloudAccountsAjaxCall.progressOfUsers(cldId,AllCloudsInfo[i].cloudName);
                        }
                    }
                }
                else{
               
						var html = '<div class="cloudsinfo" id="cloudInfo" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 5px;height:80px;width:100%;margin-bottom: 2%;">'+
	'<div id="mngCloudIcon" style="width: 7%;padding: 1.5% 1%;float:left;text-align:center;padding-top: 1%;"><div class="bg-cfIcon"></div></div>'+
	'<div id="mngCloudName" style="width: 46%;padding:2.7% 1%;float:left;color:#1F2129;font-weight:500;"><span>' + CLName[CloudName[i]] + '</span></div>'+
	'<div id="mngCloudEmail" style="width: 28%;padding: 2.7% 1%;float:left;"><span title="titleEmail">emailId</span></div>'+
	'<div id="mngCloudType" style="width: 8%;padding: 2.7% 1%;float:left;"><span>userType</span></div>'+
	'<div id="mngCloudRemove" style="width: 6%;padding: 2.7% 2%;float:left;text-align: right;"><i cldId="' + AllCloudsInfo[i].id + '" id="delCld"  data-action="delete" data-id="' + AllCloudsInfo[i].id + '" data-toggle="modal" data-target="#CFCLdeleteModal" class="lnil lnil-trash-can-alt" style="font-size: 17px;cursor:pointer;"></i></div>'+
	'<div id="' + AllCloudsInfo[i].id + '" name="' + AllCloudsInfo[i].cloudName + '"class="getCloudsInfo" style="width: 4%;padding: 2.7% 1%;float:left;text-align:center;cursor:pointer;"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 20px;font-weight:600;"></i></div><hr id="manageInfoHr" style="margin-top: 8%;width: 96%;display:none">'+
	'<div class="appendcloudDetails" style="width: 96%;margin: 2%;border-radius: 5px;display:none"></div></div>';
                }
            }
            else {
             
			  var html = '<div class="cloudsinfo" id="cloudInfo" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 5px;height:80px;width:100%;margin-bottom: 2%;">'+
	'<div id="mngCloudIcon" style="width: 7%;padding: 1.5% 1%;float:left;text-align:center;padding-top: 1%;"><div class="bg-cfIcon"></div></div>'+
	'<div id="mngCloudName" style="width: 46%;padding:2.7% 1%;float:left;color:#1F2129;font-weight:500;"><span>' + CLName[CloudName[i]] + '</span></div>'+
	'<div id="mngCloudEmail" style="width: 28%;padding: 2.7% 1%;float:left;"><span title="titleEmail">emailId</span></div>'+
	'<div id="mngCloudType" style="width: 8%;padding: 2.7% 1%;float:left;"><span>userType</span></div>'+
	'<div id="mngCloudRemove" style="width: 6%;padding: 2.7% 2%;float:left;text-align: right;"><i cldId="' + AllCloudsInfo[i].id + '" id="delCld"  data-action="delete" data-id="' + AllCloudsInfo[i].id + '" data-toggle="modal" data-target="#CFCLdeleteModal" class="lnil lnil-trash-can-alt" style="font-size: 17px;cursor:pointer;"></i></div>'+
	'<div id="' + AllCloudsInfo[i].id + '" name="' + AllCloudsInfo[i].cloudName + '"class="getCloudsInfo" style="width: 4%;padding: 2.7% 1%;float:left;text-align:center;cursor:pointer;"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 20px;font-weight:600;"></i></div><hr id="manageInfoHr" style="margin-top: 8%;width: 96%;display:none">'+
	'<div class="appendcloudDetails" style="width: 96%;margin: 2%;border-radius: 5px;display:none"></div></div>';
            }
            if(AllCloudsInfo[i].cloudName === "DROP_BOX" || AllCloudsInfo[i].cloudName === "AMAZON" || AllCloudsInfo[i].cloudName === "ORANGE" || AllCloudsInfo[i].cloudName === "FTP"){
				var title = AllCloudsInfo[i].userDisplayName;
                var email = CFManageCloudAccountsAjaxCall.getMaxChars(AllCloudsInfo[i].userDisplayName, 30);
            }
            else if(AllCloudsInfo[i].cloudName === "NETWORK_FILESHARES"){
			var title = AllCloudsInfo[i].cloudUserId.split('|')[2];
                var email = CFManageCloudAccountsAjaxCall.getMaxChars(AllCloudsInfo[i].cloudUserId.split('|')[2], 30);
            }
            else {
			var title = AllCloudsInfo[i].cloudUserId.split('|')[1];
                var email = CFManageCloudAccountsAjaxCall.getMaxChars(AllCloudsInfo[i].cloudUserId.split('|')[1], 30);
            }
            if (AllCloudsInfo[i].userType === "ADMIN"){ 
                var User = 'Multiuser';
            }
            else{
                var User = 'Singleuser'; 
            }
            var appendhtml = html.replace('emailId',email).replace('userType',User).replace('titleEmail',title).replace('cfIcon',AllCloudsInfo[i].cloudName);
		
            $('#manageclouddiv').children('div').append(appendhtml);
            var notPrvsn = AllCloudsInfo[i].notProvisioned;
            if(AllCloudsInfo[i].cloudAddingStatus === false ||  notPrvsn === null || notPrvsn === 0){
                if(AllCloudsInfo[i].cloudAddingStatus === false){
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#reAuthorizeCld').css('display','none');
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#AuthorizeCld').css('display','').addClass('retry');
                }
                else
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#reAuthorizeCld').css('pointer-events','none').css('opacity','0.4');
            }
            else{
                if(AllCloudsInfo[i].reauthorization === false){
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#reAuthorizeCld').css('display','none');
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#AuthorizeCld').css('display','').addClass('retry');
                }
                else{
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#AuthorizeCld').css('display','none').removeClass('retry');
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#reAuthorizeCld').css('display','');
                }
            }
            if(AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS") {
                $('#manageclouddiv #' + AllCloudsInfo[i].id).parent().find('#AuthorizeCld').css('display', 'none').removeClass('retry');
                $('#manageclouddiv #' + AllCloudsInfo[i].id).parent().find('#reAuthorizeCld').css('pointer-events', 'none').css('opacity', '0.4');
            }
			  if(AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName === "BOX_BUSINESS" ||AllCloudsInfo[i].cloudName === "SHAREPOINT_ONLINE_BUSINESS" || AllCloudsInfo[i].cloudName === "G_SUITE") {
                       $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#AuthorizeCld').css('display','none').removeClass('retry');
                    $('#manageclouddiv #' + AllCloudsInfo[i].id ).parent().find('#reAuthorizeCld').css('display','').css('pointer-events', 'auto').css('opacity', '1');
            }
        }

    },
    progress: function (CldId, cldName) {
        var usersCount;
        $.ajax({
            type: 'GET',
            url: apicallurl + "/users/clouds/multiUser/count?adminCloudId="+CldId+"&cloudName="+cldName, 
            async: false,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                usersCount = data;
            }
        });
        return usersCount;
    },
    progressOfUsers: function (CldId, cldName) {
        var usersCount;
        $.ajax({
            type: 'GET',
            url: apicallurl + "/users/clouds/multiUser/count?adminCloudId="+CldId+"&cloudName="+cldName,
            async: true,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                usersCount = data;
                for (var i = 0; i < AllCloudsInfo.length; i++) {
                    if (AllCloudsInfo[i].id === CldId) {
                        if (usersCount === AllCloudsInfo[i].totolClouds) {
                            var parent =  $('#manageclouddiv #' + CldId).children('.'+ CldId).children('#incrementProgress');
                            var wid = Math.round(usersCount/AllCloudsInfo[i].totolClouds*100);
                            parent.children('div').find('.progressGreen').css('width', wid+'%');
                            parent.find('#percentOfUsers').css('display','');
                            parent.find('#percentOfUsers').text('100%');
                            parent.find('#usersDisplay').css('display','');
                            parent.find('#usersDisplay').text(usersCount+' out of '+usersCount+' Users');
                            $('#manageclouddiv #' + AllCloudsInfo[i].id ).find('#AuthorizeCld').css('display','none').removeClass('retry');
                            $('#manageclouddiv #' + AllCloudsInfo[i].id ).find('#reAuthorizeCld').css('display','');
                            var parent = $('#manageclouddiv #' + AllCloudsInfo[i].id ).find('#reAuthorizeCld');
                            cloudAddingStatus(CldId,parent);

                        } else {
                            var parent =  $('#manageclouddiv #' + CldId).children('.'+ CldId).children('#incrementProgress');
                            var wid = Math.round(usersCount/AllCloudsInfo[i].totolClouds*100);
                            parent.children('div').find('.progressGreen').css('width', wid+'%');
                            parent.find('#percentOfUsers').css('display','');
                            parent.find('#percentOfUsers').text(wid+'%');
                            parent.find('#usersDisplay').css('display','');
                            parent.find('#usersDisplay').text(usersCount+' out of '+AllCloudsInfo[i].totolClouds+' Users');
                            setTimeout(function () {
                                CFManageCloudAccountsAjaxCall.progressOfUsers(CldId, cldName);
                            }, 30000);
                        }
                    }
                }
            }
        });
        return usersCount;
    },

    getAllCloudDetails: function (CldId) {
       // CFManageCloudAccountsAjaxCall.getAllClouds();
        for (var i = 0; i < CloudName.length; i++) {
            var appendHtml;
            if(CldId === AllCloudsInfo[i].id){
                if(AllCloudsInfo[i].userType === "ADMIN") {
                    var added = AllCloudsInfo[i].provisionedClouds;
                    var notAdded = AllCloudsInfo[i].notProvisioned;
                    var total = AllCloudsInfo[i].totolClouds;
                    if (total === null || total === 0){
                        if(AllCloudsInfo[i].cloudName === "GOOGLE_SHARED_DRIVES" || AllCloudsInfo[i].cloudName === "EGNYTE_ADMIN" || AllCloudsInfo[i].cloudName === "G_SUITE" || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")
                            total = 0;
                        else
                            total = '----';
                    }
                    if (notAdded === null || notAdded === 0){
                        if(AllCloudsInfo[i].cloudName === "GOOGLE_SHARED_DRIVES" || AllCloudsInfo[i].cloudName === "EGNYTE_ADMIN" || AllCloudsInfo[i].cloudName === "G_SUITE" || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")
                            notAdded = 0;
                        else
                            notAdded = '----';
                    }
                    if (added === null || added === 0){
                        if(AllCloudsInfo[i].cloudName === "GOOGLE_SHARED_DRIVES" || AllCloudsInfo[i].cloudName === "EGNYTE_ADMIN" || AllCloudsInfo[i].cloudName === "G_SUITE" || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS" || AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN"|| AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")
                            added = 0;
                        else
                            added = '----';
                    } 
                    if(AllCloudsInfo[i].notProvisioned === null || AllCloudsInfo[i].notProvisioned === 0){
						if(AllCloudsInfo[i].cloudName === "BOX_BUSINESS"){
                        var multi_html = '<div class="table-responsive box" id="cloudDetails" style="background: white;border: 1px solid #e5e5e5;border-radius: 5px;font-size:12px;overflow-x:hidden;"><table class="table table-condensed" style="font-size: 14px;margin-bottom:0;"><tbody><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Name</div><div style="width: 65%;float: right;font-size:12px;" title="dispName">displayName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Total Users</div><div style="width: 50%;float: right;font-size:12px;">totalUsers</div></td><td rowspan="2" style="width: 25%;padding: 0.35rem 0.5rem;"><div style="width: 100%;float: left;color:#FF4C4C;font-size:12px;"><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding:4%;font-weight:bold;">Users Not Added</span><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding: 4% 9%;margin-left: -2%;">notAddedUsers</span></div></td><td class="innerPlus" style="width: 15%;padding: 0.35rem 0.5rem;"  id="'+CldId+'"><div><a class="failedUsers" href="#" style="color:#FF4C4C;text-decoration:underline;font-weight:bold;font-size:12px;opacity:0.4;pointer-events:none;">Failed Users Details</a></div></td></tr><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Domain Name</div><div style="width: 65%;float: right;font-size:12px;" title="nameofDomain">domainName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Added Users</div><div style="width: 50%;float: right;font-size:12px;">addedUsers</div></td><td style="width: 15%;color:#0062ff;"  id="'+CldId+'"><div id="userDataDtls" style="width: 65%;float: left;font-weight: bold;font-size:12px;">Users Data Size</div><div style="width:35%;float:right;"><a href="#" id="dataDtls" style="text-decoration: underline;"><i class="lnil lnil-download" style="font-weight:bold;"></i></a></div></td></tr><tr class="appendUsersList" style="display: none"></tr></tbody></table></div>';
						}
						else{
                        var multi_html = '<div class="table-responsive box" id="cloudDetails" style="background: white;border: 1px solid #e5e5e5;border-radius: 5px;font-size:12px;overflow-x:hidden;"><table class="table table-condensed" style="font-size: 14px;margin-bottom:0;"><tbody><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Name</div><div style="width: 65%;float: right;font-size:12px;" title="dispName">displayName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Total Users</div><div style="width: 50%;float: right;font-size:12px;">totalUsers</div></td><td rowspan="2" style="width: 25%;padding: 0.35rem 0.5rem;"><div style="width: 100%;float: left;color:#FF4C4C;font-size:12px;"><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding:4%;font-weight:bold;">Users Not Added</span><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding: 4% 9%;margin-left: -2%;">notAddedUsers</span></div></td><td rowspan="2" class="innerPlus" style="width: 15%;padding: 0.35rem 0.5rem;"  id="'+CldId+'"><div><a class="failedUsers" href="#" style="color:#FF4C4C;text-decoration:underline;font-weight:bold;font-size:12px;opacity:0.4;pointer-events:none;">Failed Users Details</a></div></td></tr><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Domain Name</div><div style="width: 65%;float: right;font-size:12px;" title="nameofDomain">domainName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Added Users</div><div style="width: 50%;float: right;font-size:12px;">addedUsers</div></td></tr><tr class="appendUsersList" style="display: none"></tr></tbody></table></div>';
						} 
					}
                    else{ 
						if(AllCloudsInfo[i].cloudName === "BOX_BUSINESS"){
                        var multi_html = '<div class="table-responsive box" id="cloudDetails" style="background: white;border: 1px solid #e5e5e5;border-radius: 5px;font-size:12px;overflow-x:hidden;"><table class="table table-condensed" style="font-size: 14px;margin-bottom:0;"><tbody><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Name</div><div style="width: 65%;float: right;font-size:12px;" title="dispName">displayName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Total Users</div><div style="width: 50%;float: right;font-size:12px;">totalUsers</div></td><td rowspan="2" style="width: 25%;padding: 0.35rem 0.5rem;"><div style="width: 100%;float: left;color:#FF4C4C;font-size:12px;"><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding:4%;font-weight:bold;">Users Not Added</span><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding: 4% 9%;margin-left: -2%;">notAddedUsers</span></div></td><td class="innerPlus" style="width: 15%;padding: 0.35rem 0.5rem;"  id="'+CldId+'"><div><a class="failedUsers" href="#" style="color:#FF4C4C;text-decoration:underline;font-weight:bold;font-size:12px;opacity:0.4;pointer-events:none;">Failed Users Details</a></div></td></tr><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Domain Name</div><div style="width: 65%;float: right;font-size:12px;" title="nameofDomain">domainName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Added Users</div><div style="width: 50%;float: right;font-size:12px;">addedUsers</div></td><td style="width: 15%;color:#0062ff;"  id="'+CldId+'"><div id="userDataDtls" style="width: 65%;float: left;font-weight: bold;font-size:12px;">Users Data Size</div><div style="width:35%;float:right;"><a href="#" id="dataDtls" style="text-decoration: underline;"><i class="lnil lnil-download" style="font-weight:bold;"></i></a></div></td></tr><tr class="appendUsersList" style="display: none"></tr></tbody></table></div>';
						}
						else{					
                         var multi_html = '<div class="table-responsive box" id="cloudDetails" style="background: white;border: 1px solid #e5e5e5;border-radius: 5px;font-size:12px;overflow-x:hidden;"><table class="table table-condensed" style="font-size: 14px;margin-bottom:0;"><tbody><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Name</div><div style="width: 65%;float: right;font-size:12px;" title="dispName">displayName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Total Users</div><div style="width: 50%;float: right;font-size:12px;">totalUsers</div></td><td rowspan="2" style="width: 25%;padding: 0.35rem 0.5rem;"><div style="width: 100%;float: left;color:#FF4C4C;font-size:12px;"><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding:4%;font-weight:bold;">Users Not Added</span><span style="background: #FFF0F0 0% 0% no-repeat padding-box;border-radius: 4px;padding: 4% 9%;margin-left: -2%;">notAddedUsers</span></div></td><td rowspan="2" class="innerPlus" style="width: 15%;padding: 0.35rem 0.5rem;"  id="'+CldId+'"><div><a class="failedUsers" href="#" style="color:#FF4C4C;text-decoration:underline;font-size:12px;font-weight:bold;">Failed Users Details</a></div></td></tr><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 35%;padding: 0.35rem 0.5rem;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Domain Name</div><div style="width: 65%;float: right;font-size:12px;" title="nameofDomain">domainName</div></td><td style="width: 20%;padding: 0.35rem 0.5rem;"><div style="width: 50%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Added Users</div><div style="width: 50%;float: right;font-size:12px;">addedUsers</div></td></tr><tr class="appendUsersList" style="display: none"></tr></tbody></table></div>';
                    }
					}
				appendHtml = multi_html.replace('dispName',AllCloudsInfo[i].userDisplayName).replace('displayName',CFManageCloudAccountsAjaxCall.getMaxChars(AllCloudsInfo[i].userDisplayName, 30)).replace('totalUsers',total).replace('nameofDomain',AllCloudsInfo[i].domainName).replace('domainName',CFManageCloudAccountsAjaxCall.getMaxChars(AllCloudsInfo[i].domainName, 30)).replace('addedUsers',added).replace('notAddedUsers',notAdded);
                }
                else{
                    var used = AllCloudsInfo[i].usedSpace;
                    var notUsed = AllCloudsInfo[i].availableSpace;
                    var _total = AllCloudsInfo[i].totalSpace;
                    if (used === null || used === 0){
                        used = '----';
                    }
                    else
                        used = CFManageCloudAccountsAjaxCall.getObjectSize(used);
                    if (notUsed === null || notUsed === 0){
                        notUsed = '----';
                    }
                    else
                        notUsed = CFManageCloudAccountsAjaxCall.getObjectSize(notUsed);
                    if (_total === null || _total === 0){
                        _total = '----';
                    }
                    else
                        _total = CFManageCloudAccountsAjaxCall.getObjectSize(_total);
                    if (AllCloudsInfo[i].loadLock === false){
                        var syncIcon = '<i class="lnil lnil-reload" id="refreshIcon" style="font-weight:600;"></i>',
                            syncStatus = 'Completed';
                    }
                    else {
                        var syncIcon = '<i class="cloudSpinn" id="refreshIcon" style="font-weight:600;"></i>', 
                            syncStatus = 'In Progress';
                    }
                    var single_html = '<div class="table-responsive box" id="cloudDetails" style="background: white;border: 1px solid #e5e5e5;border-radius: 5px;overflow-x:hidden;"><table class="table table-condensed" style="font-size: 12px;"><tbody><tr style="height: 5vh;border: 2px solid #FFFFFF"><td style="width: 33%;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Name</div><div style="width: 65%;float: right;font-size:12px;" title="dispName">displayName</div></td><td style="width: 33%;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Sync</div><div style="width: 65%;float: right;">syncIcon</div></td><td style="width: 33%;"><div style="width: 40%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Sync Status</div><div style="width: 60%;float: right;font-size:12px;" id="initialVal">syncStatus</div></td></tr><tr style="height: 5vh;border: 2px solid #FFFFFF" class="CloudSync"><td style="width: 33%;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Total Space</div><div style="width: 65%;float: right;font-size:12px;">totalSpace</div></td><td style="width: 33%;"><div style="width: 35%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Used Space</div><div style="width: 65%;float: right;font-size:12px;">usedSpace</div></td><td style="width: 33%;"><div style="width: 40%;float: left;font-weight: bold;font-size:12px;color:#1f2129;">Available Space</div><div style="width: 60%;float: right;font-size:12px;">availabeSpace</div></td></tbody></table></div>';
					
                    appendHtml = single_html.replace('dispName',AllCloudsInfo[i].userDisplayName).replace('displayName',CFManageCloudAccountsAjaxCall.getMaxChars(AllCloudsInfo[i].userDisplayName, 30)).replace('totalSpace',_total).replace('syncIcon',syncIcon).replace('refreshIcon',AllCloudsInfo[i].id).replace('usedSpace',used).replace('syncStatus',syncStatus).replace('availabeSpace',notUsed); 
                }
            } 
        }
		$('#manageclouddiv #' + CldId).closest('#cloudInfo').css('height','auto');  
		$('#manageclouddiv #' + CldId).next().css('display','');
        $('#manageclouddiv #' + CldId).next().next('.appendcloudDetails').append(appendHtml).css('display', '');
        CFManageCloudAccountsAjaxCall.CloudSyncStatus(CldId);
    },
    failedUserDetails: function (CldId) {
        for (var i = 0; i < CloudName.length; i++) {
            if(CldId === AllCloudsInfo[i].id) {
                var cldName = AllCloudsInfo[i].cloudName;
                $('#manageclouddiv #' + CldId + '.innerPlus').parent('tr').next().next('.appendUsersList').html('');
                var html = '<td colspan="4"><div class="table-responsive box" style="background: white;margin: 2%;width: 96%;box-shadow: none!important;"><table class="table table-condensed" style="font-size: 14px;border: 1px solid lightgray;"><thead style="background: #0062FF;color: white;border-radius:4px;"><tr><th style="font-weight: 500;width: 33%;padding: .5rem;padding-left:2%;font-size:12px;">Username</th><th style="font-weight: 500;width: 27%;padding: .5rem;font-size:12px;">Description</th><th style="font-weight: 500;width: 40%;padding: .5rem;font-size:12px;">Solution</th></tr></thead><tbody class="innerList"></tbody></table></div><div class="pagination p1" style="padding: 0;margin: 0;margin-left: 32%;border-radius: 0;width: 100%;text-align: center;"> <ul class="paginationReport" class="pagination-sm"></ul> </div></td>';
                $('#manageclouddiv #' + CldId + '.innerPlus').parent('tr').next().next('.appendUsersList').append(html).css('display', 'table-row');
				
                $('#manageclouddiv .paginationReport').empty();
                $('#manageclouddiv .paginationReport').removeData("twbs-pagination");
                $('#manageclouddiv .paginationReport').unbind("page");
                CFManageCloudAccountsAjaxCall.failedUsers(CldId, cldName,1);
            }
        }

    },
    failedUsers: function (CldId, cldName,pageNo) {
        var pageSize = 10;
        $.ajax({
            type: 'GET',
            url: apicallurl + "/users/clouds/multiUser/notprovisioned?adminCloudId="+CldId+"&cloudName="+cldName+"&pageNo="+pageNo+"&pageSize="+pageSize,
            async: false,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                $('#manageclouddiv #' + CldId + '.innerPlus').parent('tr').next('.appendUsersList').find('tbody').html('');
                if(data.length !== 0) {
                    var appendHtml;
                    for (i = 0; i < AllCloudsInfo.length; i++) {
                        if (AllCloudsInfo[i].id == CldId)
                            var count = Math.ceil(AllCloudsInfo[i].notProvisioned / 10);
                    }
                    $("#manageclouddiv .paginationReport").twbsPagination({
                        totalPages: count,
                        visiblePages: 6,
                        startPage:1,
                        next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                        prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
                        first: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
                        last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                        onPageClick: function (event, pageNo) {
                            if (pageNo == 1) {
                                $("#manageclouddiv .paginationReport").twbsPagination({totalPages: count});
                            }
                            CFManageCloudAccountsAjaxCall.failedUsers(CldId, cldName, pageNo);
                        }
                    });
                    for (var j = 0; j < data.length; j++) {
                        var _html = '<tr style="height: 5vh;"><td style="border: 1px solid lightgray;font-size:12px;padding:2%;" title="usersmail">userName</td><td style="border: 1px solid lightgray;font-size:12px;">description</td><td style="border: 1px solid lightgray;font-size:12px;">solution</td></tr>';
                        appendHtml = _html.replace('userName', CFManageCloudAccountsAjaxCall.getMaxChars(data[j].userEmail,40)).replace('usersmail', data[j].userEmail).replace('description', data[j].description).replace('solution', data[j].solution);
                        $('#manageclouddiv #' + CldId).next().next('.appendcloudDetails').find('.innerList').append(appendHtml);
                    }
                }
                else{
                    $('#manageclouddiv #' + CldId).next().next('.appendcloudDetails').find('.innerList').html('');
                }
            }
        });
    },
    renameCloud: function (a) {
        var _u = apicallurl + "/users/update/cloud/displayname/" + a.id + '?displayName=' + a.name;
        var _b = false;
        $.ajax({
            type: 'POST',
            url: _u,
            async: false,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (s) {
                return _b = true;
            },
            complete: function (xhr) {
                if (xhr.status > 300) {
                    return _b = false;
                }
            }
        });
        return _b;
    },
    CloudSyncStatus: function (cloudid) {
        var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/loadstatus?cloudId=" + cloudid;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            success: function (Syncstatus) {
                if (Syncstatus == false) {
                    $('#cloudDetails').find('[id="' + cloudid + '"].cloudSpinn').addClass('lnil lnil-reload').removeClass('cloudSpinn');
					$("#initialVal").text("Completed");
                    if (PageName == "CloudDrive") {
                        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, 1);
                    }
                    if (PageName == "InnerFolders" && !$('#CFSharedWithMe').parent().hasClass('active')) {
                        CFManageCloudAccountsAjaxCall.gotoInnerFolderandFiles(SingleCloudId, SinglePId, 1);
                    }
                    if (PageName == "move") {
                        $('.cloudSpinn').addClass('lnil lnil-reload').removeClass('cloudSpinn');
						$("#initialVal").text("Completed")
                        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, 1);
                    }
                }
                if (Syncstatus == true) {
					$("#initialVal").text("In Progress");
                    $('#cloudDetails').find('[id="' + cloudid + '"].lnil.lnil-reload').addClass('cloudSpinn').removeClass('lnil lnil-reload');
                    if (PageName == "move") {
						$("#initialVal").text("In Progress")
                        $('.cloudSpinn').addClass('cloudSpinn').removeClass('lnil lnil-reload');
                        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, 1);
                    }
                    setTimeout(function () {
                        CFManageCloudAccountsAjaxCall.CloudSyncStatus(cloudid);
                    }, 15000);
                }
            }
        });
    },
    refreshcloud: function (cloudId1) {
        if (cloudId1 != undefined && cloudId1 != null && cloudId1 != '') {
            cloudId = cloudId1;
        } else {
            cloudId = "all";
        }
        var data = "";
        var apiUrl = apicallurl + "/filefolder/refresh/cache/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/" + cloudId;
        $.ajax({
            type: "post",
            url: apiUrl,
            data: data,
            headers: {
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            success: function (data) {
                CFManageCloudAccountsAjaxCall.CloudSyncStatus(cloudId);
            },
            complete: function (xhr) {
                if (xhr.status > 300) {
                }
            }
        });
    },

    //CloudFuze Events
    getAllEvents: function (number, len) {
        var apiUrl = apicallurl + "/events/all?page_size=" + len + "&page_nbr=" + number;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (events) {
                var _notiFooterBtn = $(".notification_footer button");
                var _notiBody = $(".notification_body");
                $('#notify_count').show();
                if (events.length < 10) {
                    _notiFooterBtn.addClass('buttonDisable');
                }
                _notiFooterBtn.attr('page', number);
                _notiFooterBtn.attr('size', len);
                if (number == 1) {
                    _notiBody.html('');
                    if (events == null || events.length == 0) {
                        $('#notify_count').hide();
                        $('.notification_footer button,.notification_head #ignore,.notification_head #clear').addClass('buttonDisable');
                        _notiBody.append("<li style='font-weight: bold;text-align: center'>You don't have any notifications.</li>");
                    }
                }
                var event = {
                    "FILESHARE": "icon-sharedbyicon",
                    "WORKSPACE": "cf-workspace",
                    "WORKSPACE_FILE_ADDED": "cf-file-text",
                    "WORKSPACE_FILE_VIEWED": "cf-eye4",
                    "GROUPS": 'cf-group2'
                };
                var linktype = {
                    "FILESHARE": "pages/fileManager.html?shared=true&fileId=",
                    "WORKSPACE": "pages/workspace.html?wspaceshared=true&workspaceId=",
                    "WORKSPACE_FILE_ADDED": "pages/workspace.html?wspaceshared=true&workspaceId=",
                    "WORKSPACE_FILE_VIEWED": "pages/workspace.html?wspaceshared=true&workspaceId=",
                    "SHAREBYME": "pages/fileManager.html?sharebyme=true&fileId="
                };
                if (events != null || events.length != 0) {
                    $.each(events, function (i, e) {
                        var icon, description, link, color, status = '';
                        icon = event[e.eventType];
                        var _owner = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
                        var _link = linktype[e.eventType];
                        if (e.ownerEmailId != null && e.ownerEmailId == _owner) {
                            _link = linktype['SHAREBYME'];
                        }
                        link = domainUrl + _link + e.eventRef;
                        if (e.isRead == false) {
                            color = "green";
                            status = "notify_unred";
                        } else {
                            color = "gray";
                        }
                        var _html = '<li type="' + e.eventType + '" class="' + status + '">' +
                            '<i id="' + e.id + '" class="cf-cross32"></i>' +
                            '<span class="icon"><i class="' + icon + '"></i>' +
                            '<i class="cf-circle2 ' + color + '" style="font-size:7px"></i></span>' +
                            '<span class="content"><a data-target="' + link + '">' +
                            '<p style="margin:0">' + e.description + '</p></a></span>' +
                            '</li>';

                        _notiBody.append(_html);
                    });
                }
                return true;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                }
            }
        });
    },
    getEventCount: function () {
        if (localStorage.getItem('UserAuthDetails') == undefined
            || localStorage.getItem('UserAuthDetails') == null
            || localStorage.getItem('UserAuthDetails') == 'null') {
            return;
        }
        var apiUrl = apicallurl + "/events/count";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (eventCount) {
                var notiCnt = $("#notify_count");
                var _shareWithmeCount = $("#CFSharedWithMe").find("#count");
                if (eventCount == null) {
                    notiCnt.hide();
                    $('#CFSharedWithMe #count').hide();
                    $('.cf-workspace').next('.badge').hide();
                }
                if (eventCount != null) {
                    if (eventCount.all > 0) {
                        notiCnt.show();
                        notiCnt.text(eventCount.all);
                    } else {
                        $('#notify_count').text('').hide();
                    }
                    if (eventCount.fileShare > 0) {
                        _shareWithmeCount.show();
                        _shareWithmeCount.text(eventCount.fileShare);
                    } else {
                        _shareWithmeCount.hide();
                    }

                    var _monBadge = $(".cf-workspace").next(".badge");
                    if (eventCount.workspace > 0 || eventCount.workspaceFileAdded > 0) {
                        var count = parseInt(eventCount.workspace) + parseInt(eventCount.workspaceFileAdded);
                        _monBadge.show();
                        _monBadge.text(count);
                    } else {
                        _monBadge.hide();
                    }
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                }
            }
        });
    },
    doIgnoreEvents: function (eventId) {
        var apiUrl = "";
        if (eventId == "FILESHARE" || eventId == "WORKSPACE" || eventId == "WORKSPACE_FILE_ADDED" || eventId == "WORKSPACE_FILE_VIEWED") {
            apiUrl = apicallurl + "/events/markAsReadByType/" + eventId;
        } else {
            apiUrl = apicallurl + "/events/markAsRead/" + eventId;
        }
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (isMarked) {
                var _notBody = $(".notification_body");
                if (eventId == "all") {
                    _notBody.find(".cf-circle2.green").each(function () {
                        $(this).removeClass('green').addClass('gray');
                    });
                } else {
                    var type = _notBody.find('#' + eventId + '').closest('li').attr('type');
                    var count = parseInt($('#notify_count').text());
                    count = count - 1;
                    _notBody.find('#' + eventId + '').closest('li').find('.cf-circle2').removeClass('green').addClass('gray');
                }
            },
            complete: function (xhr, statusText) {
                if (eventId == "all") {
                    $('#cf_notification').fadeToggle('slow');
                }
                if (xhr.status > 300) {
                }
            }
        });
    },
    doClearAllEvents: function (eventId) {
        var apiUrl = apicallurl + "/events/clear/" + eventId;
        $.ajax({
            type: "DELETE",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function () {
                var _shWithmeCount = $("#CFSharedWithMe").find("#count");
                if (eventId == "all") {
                    $('.notification_body>li').each(function () {
                        $(this).remove();
                    });
                    $('#notify_count').text('').hide();
                    $('.cf-workspace').next('.badge').text('').hide();
                    _shWithmeCount.text('').hide();
                    $('.notification_footer button,.notification_head #ignore,.notification_head #clear').addClass('buttonDisable');
                } else {
                    var _notBody = $(".notification_body");
                    var type = _notBody.find('#' + eventId + '').closest('li').attr('type');
                    var count = parseInt($('#notify_count').text());
                    count = count - 1;
                    if (count > 0) {
                        $('#notify_count').text(count);
                    } else {
                        $('#notify_count').text('').hide();
                    }
                    _notBody.find('#' + eventId + '').closest('li').remove();
                    var text;
                    if (type == "FILESHARE") {
                        text = parseInt(_shWithmeCount.text());
                        text = text - 1;
                        if (text > 0) {
                            _shWithmeCount.text(text);
                        } else {
                            _shWithmeCount.text('').hide();
                        }
                    } else {
                        var _monBadge = $(".cf-workspace").next(".badge");
                        text = parseInt(_monBadge.text());
                        text = text - 1;
                        if (text > 0) {
                            _monBadge.text(text);
                        } else {
                            _monBadge.text('').hide();
                        }
                    }
                    if (_notBody.children('li').length < 0) {
                        $('.notification_footer button,.notification_head #ignore,.notification_head #clear').addClass('buttonDisable');
                    }
                }
            },
            complete: function (xhr, statusText) {
                $('#cf_notification').fadeToggle('slow');
                if (xhr.status > 300) {
                }
            }
        });
    },
    getActivities: function (PageNumber, PageSize) {
        var apiUrl = apicallurl + "/analytics/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_nbr=" + PageNumber + "&page_size=" + PageSize + "";
        var ActivitesInfo;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (Activities) {
                ActivitesInfo = Activities;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
        return ActivitesInfo;
    },

    //******** sorting file names ***********//
    getSortFiles: function (sortCond, PageNumber) {
        var apiUrl;
        if (PageName == "Folders") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=false";
        }
        else if (PageName == "CloudDrive") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + SingleCloudId + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=true";
        }
        else if (PageName == "Home") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=true";
        }
        else if (PageName == "InnerFolders") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + InnerCloudId[0] + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=" + InnerFolderId[0] + "&isAllFiles=true";
        }
        else if (PageName == "Share by Me") {
            apiUrl = apicallurl + "/fileshare/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_nbr=1&page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&sharedBy=me";
        }
        else if (PageName == "Share with Me") {
            apiUrl = apicallurl + "/fileshare/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_nbr=1&page_size=50&isAscen=" + urlParameterObject.isAscen + "&fetchCollabInfo=true&orderField=" + sortCond + "&sharedBy=others";
        }
        else if (PageName == "All Items") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&fetchCollabInfo=true&page_nbr=" + PageNumber + "";
        }
        else if (PageName == "Category") {
            apiUrl = apicallurl + "/category/files/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/category?categoryId=" + globalCategoryId + "&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond;
        }
        else if (PageName == "Recent files") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber;
        }
        else if (PageName == "Favorites") {
            return false;
        }
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (SortFiles) {
                if (PageName == "Share with Me" || PageName == "Share by Me") {
                    CFManageCategoryAjaxCall.getSharedFileNames(SortFiles);
                }
                else {
                    CFManageCloudAccountsAjaxCall.getAllFileNames(SortFiles, PageNumber);
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    alertError("Operation Failed");
                }
            }
        });
    },
    getSortFilesD: function (sortCond, PageNumber) {
        var apiUrl;
        if (PageName == "Folders") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=false";
        } else if (PageName == "CloudDrive") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + SingleCloudId + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=true";
        } else if (PageName == "Home") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=true";
        } else if (PageName == "InnerFolders") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + InnerCloudId[0] + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=" + InnerFolderId[0] + "&isAllFiles=true";
        } else if (PageName == "Share by Me") {
            apiUrl = apicallurl + "/fileshare/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_nbr=1&page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&sharedBy=me";
        } else if (PageName == "Share with Me") {
            apiUrl = apicallurl + "/fileshare/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_nbr=1&page_size=50&isAscen=" + urlParameterObject.isAscen + "&fetchCollabInfo=true&orderField=" + sortCond + "&sharedBy=others";
        } else if (PageName == "All Items") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&fetchCollabInfo=true&page_nbr=" + PageNumber + "&isAllFiles=true";
        } else if (PageName == "Recent files") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond + "&page_nbr=" + PageNumber;
        } else if (PageName == "Category") {
            apiUrl = apicallurl + "/category/files/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/category?categoryId=" + globalCategoryId + "&isAscen=" + urlParameterObject.isAscen + "&orderField=" + sortCond;
        } else if (PageName == "Favorites") {
            return false;
        }
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (SortDFiles) {
                if (PageName == "Share with Me" || PageName == "Share by Me") {
                    CFManageCategoryAjaxCall.getSharedFileNames(SortDFiles);
                }
                else {
                    CFManageCloudAccountsAjaxCall.getAllFileNames(SortDFiles, PageNumber);
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    alertError("Operation Failed");
                }
            }
        });
    },

    //CloudFuze Files
    getAllFiles: function (PageNumber) {
        var apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles;
        var _a = '';
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (s) {
                return _a = s;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
        return _a;
    },
    getAllFileNames: function (ALLFilesForAllClouds, PageNumber, fileshareUrl, sharedFolderId) {
        enblePanel();
        $('#LVHeader #CFHSortFileName,#LVHeader #CFHSortfileSize').removeAttr('style');
        $("#LVHeader").find(".LVHFavorites").removeAttr('style');
        if (ALLFilesForAllClouds.length == 1 || ALLFilesForAllClouds.length == 0) {
            $('#ScrollBarScrolling').addClass('divdisplay');
            $('#spinner2').hide();
        }
        if (PageNumber == 1) {
            $('#ThumbnailContent').html('');
            $('#LVContent').html('');
            totalFiles = 0;
        }
        if (PageName == 'move' || PageName == 'innermove' || PageName == 'back' || PageName == 'scrollDown') {
            var _moveSrc = $("#moveSource");
            var _moveDest = $("#moveDestination");
            if (moveCheckSum == 'source' && PageNumber == 1) {
                _moveSrc.append('<div style="width:87.2%;height:40px;margin: 0 auto;padding: 2%;padding-left: 5px;background: #F2F3FF 0% 0% no-repeat padding-box;margin-top: 3.5%;"><input type="checkbox" style="margin:0;margin-left:12px;width:10px;height:10px;" name="moveSourceCheckbox" id="moveSourceCheckbox"><span style="margin-left: 3%;width:90%;color:#1F2129;font-weight:600;">File / Folder Name</span></div>');
                if(ALLFilesForAllClouds.length == 0 && moveCheckSum == 'source'){
                    $('#movecheckModal').attr('disabled', true).removeClass('blue');
                    $("#moveSourceCheckbox").attr("disabled", true); 
                } 
                _moveSrc.append('<div class="list-group" style="max-height: 45vh;width: 87%;height:45vh;margin: 0px 6.5%;">');
                $('#moveSource').scrollTop($('#moveSource').scrollTop() - 10);
            } 
            if (moveCheckSum == 'dest' && PageNumber == 1) {
                _moveDest.append('<div class="list-group" style="height:auto;margin-top: 4%;">');
                $('#moveDestination').scrollTop($('#moveSource').scrollTop() - 10); 
            }
            var _srcToken = localStorage.getItem("_scrollSrcTokenVal");
            var _dstnToken = localStorage.getItem("_scrollDstnTokenVal");
            if (AllCloudsInfo[i].cloudName == "AMAZON" && moveCheckSum == 'source' && _srcToken != "null" && _srcToken != null) {

                _moveSrc.siblings('#movePageShowMore').show();
                _moveSrc.siblings('#movePageShowMore').attr('movepagenumber', PageNumber);

            }
            else if (AllCloudsInfo[i].cloudName == "AMAZON" && moveCheckSum == 'dest' && _dstnToken != "null" && _dstnToken != null) {

                _moveDest.siblings('#movePageShowMore').show();
                _moveDest.siblings('#movePageShowMore').attr('movepagenumber', PageNumber);

            }
            else if (AllCloudsInfo[i].cloudName == "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum == 'source' && _srcToken != "null" && _srcToken != null) {

                _moveSrc.siblings('#movePageShowMore').show();
                _moveSrc.siblings('#movePageShowMore').attr('movepagenumber', PageNumber);

            }
            else if (AllCloudsInfo[i].cloudName == "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum == 'dest' && _dstnToken != "null" && _dstnToken != null) {

                _moveDest.siblings('#movePageShowMore').show();
                _moveDest.siblings('#movePageShowMore').attr('movepagenumber', PageNumber);

            }
            else if (ALLFilesForAllClouds.length > 49) {
                if (moveCheckSum == 'source') {
                    _moveSrc.siblings('#movePageShowMore').show();
                    _moveSrc.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                }
                if (moveCheckSum == 'dest') {
                    _moveDest.siblings('#movePageShowMore').show();
                    _moveDest.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                }
            }
            /*   else if (ALLFilesForAllClouds.length > 24 && AllCloudsInfo[i].cloudName == "G_DRIVE" ||ALLFilesForAllClouds.length > 24 && AllCloudsInfo[i].cloudName == "BOX") {
                   if (moveCheckSum == 'source') {
                       _moveSrc.siblings('#movePageShowMore').show();
                       _moveSrc.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                   }
                   if (moveCheckSum == 'dest') {
                       _moveDest.siblings('#movePageShowMore').show();
                       _moveDest.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                   }
               }
               else if (ALLFilesForAllClouds.length > 48 && AllCloudsInfo[i].cloudName == "GOOGLE_STORAGE" && (PageNumber == 1)) {
                   if (moveCheckSum == 'source') {
                       _moveSrc.siblings('#movePageShowMore').show();
                       _moveSrc.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                   }
                   if (moveCheckSum == 'dest') {
                       _moveDest.siblings('#movePageShowMore').show();
                       _moveDest.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                   }
               } */
            else if ((ALLFilesForAllClouds.length > 24 && AllCloudsInfo[i].cloudName == "G_DRIVE")||(ALLFilesForAllClouds.length > 24 && AllCloudsInfo[i].cloudName == "SHARED_DRIVES")) {
                if (moveCheckSum == 'source') {
                    _moveSrc.siblings('#movePageShowMore').show();
                    _moveSrc.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                }
                if (moveCheckSum == 'dest') {
                    _moveDest.siblings('#movePageShowMore').show();
                    _moveDest.siblings('#movePageShowMore').attr('movepagenumber', PageNumber)
                }
            }
            else {
                if (moveCheckSum == 'source') {
                    _moveSrc.siblings('#movePageShowMore').hide();
                    _moveSrc.siblings('#movePageShowMore').removeAttr('movepagenumber');
                }
                if (moveCheckSum == 'dest') {
                    _moveDest.siblings('#movePageShowMore').hide();
                    _moveDest.siblings('#movePageShowMore').removeAttr('movepagenumber');
                }
            }
        }
		if (ALLFilesForAllClouds.length > 49 && AllCloudsInfo[i].cloudName == "BOX" && moveCheckSum == 'source') {
                _scroll = true;
            }
		else if (ALLFilesForAllClouds.length > 49 && AllCloudsInfo[i].cloudName == "BOX" && moveCheckSum == 'dest') {
                _scrolll = true; 
            }
		var count =0;
        $.each(ALLFilesForAllClouds, function (i, AllCloudFileNames) {
            if (AllCloudFileNames != null && AllCloudFileNames.objectName != null && AllCloudFileNames.objectName != " " && AllCloudFileNames.objectName != "") {
                var objectName = AllCloudFileNames.objectName;
                var objectSize = AllCloudFileNames.objectSize;
                var cloudName = AllCloudFileNames.cloudName;
                var cloudId = AllCloudFileNames.cloudId;
				if(AllCloudFileNames.cloudName == "ONEDRIVE_BUSINESS"){
				var fileId = AllCloudFileNames.destId;
				}
				else{
                var fileId = AllCloudFileNames.id;
				} 
                var parent = AllCloudFileNames.parent;	
				var sorc = CFManageCloudAccountsAjaxCall.getMaxChars(objectName, 30);
                var pl = /\</g;
                var pl1 = /\>/g;
                var pl2 = /\"/g;
                var pl3 = /\'/g;
                var src1 = sorc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                var sourc = objectName;
                var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			    var src3 = fileId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');

                if(AllCloudFileNames.parentFileRef !== null)
                    var grandParent = AllCloudFileNames.parentFileRef.parent;
                if(AllCloudFileNames.previousParentIds !== null)
                    var prevPrntId = AllCloudFileNames.previousParentIds;
                var fileExten = AllCloudFileNames.objectExtn;
                var filetype1 = AllCloudFileNames.directory,
                    type = AllCloudFileNames.type;
                var filetype;

                if (fileshareUrl != undefined) {
                    fileshareUrl = fileshareUrl.replace(/([?|&]fileId=)[^\&]+/, '$1' + fileId);
                    fileshareUrl = fileshareUrl + "&isShared=true";
                }
                if (filetype1 == false && type == "SECTION") {
                    filetype = "NOTE"
                }
                if (filetype1 == false && type=="SITE") {
                    filetype = "SITE"
                }
                else if (filetype1 == false) {
                    filetype = "FILE"
                }
                else if(filetype1 == true && type == "NOTEBOOK"){
                    filetype = "NOTEBOOK"
                }
                else if (filetype1 == true && type == "SITE") {
                    filetype = "SITE"
                }
                else if (filetype1 == true && type == "DOCUMENT_LIBRARY") {
                    filetype = "DOCUMENT_LIBRARY"
                }
                else if (filetype1 == true && type == "DRIVE") {
                    filetype = "DRIVE"
                }
                else if (filetype1 == true) {
                    filetype = "FOLDER"
                } else if (filetype1 == null && AllCloudFileNames.fileType == null) {
                    filetype = "SITE"
                }
                else if (filetype1 == undefined || filetype1 == null) {
                    filetype = "SITE"
                }
                var favourite = AllCloudFileNames.favourite;
                var favouriteicon = favourite == true ? heartFill : heart;
                var fileIcon = CFManageCloudAccountsAjaxCall.getFileIcon(fileExten, filetype);
                var dateCreated = AllCloudFileNames.createdTime == null ? "___" : CFManageCloudAccountsAjaxCall.getDateConversion(AllCloudFileNames.createdTime);
                var dateModified = AllCloudFileNames.modifiedTime == null ? "___" : CFManageCloudAccountsAjaxCall.getDateConversion(AllCloudFileNames.modifiedTime);

                if (PageName == "InnerWorkspaceFolders") {
                    var _workFile = '<tr class="gradeA">' +
                        '<td class="wsfcheckbox" style="width:32px"><input type="checkbox" /></td>' +
                        '<td class="sorting_1" style="cursor:pointer;" name=' + filetype1 +
                        ' cloudid=' + AllCloudFileNames.cloudId + ' fileper=' + AllCloudFileNames.id +
                        ' data-type=' + AllCloudFileNames.fileType + ' fexten=' + AllCloudFileNames.objectExtn +
                        ' id=' + AllCloudFileNames.id + ' title="' + src2 + '">' + src1 + '</td>' +
                        '<td class=" ">' + CFManageCloudAccountsAjaxCall.getObjectSize(AllCloudFileNames.objectSize, filetype) +
                        '</td><td class=" ">' + CFManageCloudAccountsAjaxCall.getDateConversion(AllCloudFileNames.modifiedTime) + '</td></tr>'

                    $("#workspaceFiles").append(_workFile);
                }
                else if (PageName == 'move' || PageName == 'innermove' || PageName == 'back' || PageName =='scrollDown') {
                    var typeicon = '';
                    if (filetype == "FILE" || filetype == "NOTE") {
                        typeicon = "lnil lnil-files";
                    } else if (filetype == "FOLDER" || filetype == "NOTEBOOK" || filetype == "DOCUMENT_LIBRARY" || filetype == "DRIVE") {
                        typeicon = "lnil lnil-folder";
                    }
                    else if (filetype == "SITE") {
                        typeicon = "lnil lnil-world-2";
						count = 1;
                    }
                    var a = $('.box').find('div').hasClass('srce');
                    var b = $('.box').find('div').hasClass('destn');
					if(count ==1){
					$("#movecheckModal").prop('disabled', true).removeClass('blue');
	
					}
                    if ((filetype == "FILE" || filetype == "NOTE") && (a || b)) {
                        var _srcFile = '';
                        var _destFile = '';
                        moveCheckSum == 'source' ? $("#moveSource").find(".list-group").append(_srcFile) : $("#moveDestination").find(".list-group").append(_destFile);
                    }
                    else {
                        if(grandParent === null || grandParent === undefined){
                            var _srcFile = '<span class="list-group-item dropabbleParent fileSpan"  srcParent="' + parent + '"  id="' + src3 + '" cid="' +
                                cloudId + '" style="height:30px;padding:4px;border-radius:0px;padding:1%;">' +
                                '<input type="checkbox" style="float:left;margin-left:2.5%;margin-top:1.5%;width:10px;height:10px;" name="srcfile"/>' +
                                '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" size="' + objectSize +
                                '" style="width:92%;font-weight:100"><i style="float:left;margin:4px 10px 0px 10px;cursor:move;font-size:18px;" class="' + typeicon + ' fileIcon"></i>' +
                                '<p class="fileP"  title="'+src2+'" style="float:left;cursor:move;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                src1 + '</p></label><i id="verifyStatus"></i></span>'; 
                            if(prevPrntId !== undefined){
                                var _srcFile = '<span class="list-group-item dropabbleParent fileSpan" prevParentId ="'+prevPrntId+'" srcParent="' + parent + '"  id="' + src3 + '" cid="' +
                                    cloudId + '" style="height:30px;padding:4px;border-radius:0px;padding:1%;">' +
                                    '<input type="checkbox" style="float:left;margin-left:2.5%;margin-top:1.5%;width:10px;height:10px;" name="srcfile"/>' +
                                    '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" size="' + objectSize +
                                    '" style="width:92%;font-weight:100"><i style="float:left;margin:4px 10px 0px 10px;cursor:move;font-size:18px;" class="' + typeicon + ' fileIcon"></i>' +
                                    '<p class="fileP"  title="'+src2+'" style="float:left;cursor:move;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                    src1 + '</p></label><i id="verifyStatus"></i></span>';
                            }

                        }
                        else{
                            var _srcFile = '<span class="list-group-item dropabbleParent"  srcParent="' + parent + '" srcGrandParent="' + grandParent + '" id="' + src3 + '" cid="' +
                                cloudId + '" style="height:30px;padding:4px;border-radius:0px;padding:1%;">' +
                                '<input type="checkbox" style="float:left;margin-left:2.5%;margin-top:1.5%;width:10px;height:10px;" name="srcfile"/>' +
                                '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" size="' + objectSize +
                                '" style="width:92%;font-weight:100"><i style="float:left;margin:4px 10px 0px 10px;cursor:move;font-size:18px;" class="' + typeicon + '"></i>' +
                                '<p  title="'+src2+'" style="float:left;cursor:move;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                src1 + '</p></label><i id="verifyStatus"></i></span>';
                            if(prevPrntId !== undefined){
                                var _srcFile = '<span class="list-group-item dropabbleParent"  prevParentId ="'+prevPrntId+'" srcParent="' + parent + '" srcGrandParent="' + grandParent + '" id="' + src3 + '" cid="' +
                                    cloudId + '" style="height:30px;padding:4px;border-radius:0px;padding:1%;">' +
                                    '<input type="checkbox" style="float:left;margin-left:2.5%;margin-top:1.5%;width:10px;height:10px;" name="srcfile"/>' +
                                    '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" size="' + objectSize +
                                    '" style="width:92%;font-weight:100"><i style="float:left;margin:4px 10px 0px 10px;cursor:move;font-size:18px;" class="' + typeicon + '"></i>' +
                                    '<p title="'+src2+'" style="float:left;cursor:move;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                    src1 + '</p></label><i id="verifyStatus"></i></span>';
                            }
							
                        }

                        var _destInput = filetype1 == true ? '<input type="radio" style="float:left;margin-left:2%;margin-top:1.5%;width:10px;height:10px;" name="srcfile" />' : '<input type="radio" style="float:left;opacity:0.2;margin-left:2.5%;margin-top:1.5%;width:10px;height:10px;" name="srcfile" disabled />';
                        if(grandParent === null || grandParent === undefined){
                            var _destFile = '<span class="list-group-item dropabbleParent fileSpan" dstnParent="'+ parent +'" id="' + src3 + '" cid="' +
                                cloudId + '" style="height:30px;padding:4px;border-radius:0px;padding:1%;">' + _destInput +
                                '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" style="width:92%;font-weight:100">' +
                                '<i class="' + typeicon + ' fileIcon" style="float:left;margin:4px 10px 0px 10px;cursor:pointer;font-size:18px;"></i>' +
                                '<p class="fileP" title="'+src2+'" style="float:left;cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                src1 + '</p></label><i id="verifyStatus"></i></span>';
                            if(prevPrntId !== undefined){
                                var _destFile = '<span class="list-group-item dropabbleParent fileSpan"  prevParentId ="'+prevPrntId+'" dstnParent="'+ parent +'" id="' + src3 + '" cid="' +
                                    cloudId + '" style="height:30px;padding:4px;border-radius:0px;padding:1%;">' + _destInput +
                                    '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" style="width:92%;font-weight:100">' +
                                    '<i class="' + typeicon + ' fileIcon" style="float:left;margin:4px 10px 0px 10px;cursor:pointer;font-size:18px;"></i>'+ 
				    '<p class="fileP" title="'+src2+'" style="float:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13pxmargin:0;margin-top:0.5%;font-weight:400;">' +
                                    src1 + '</p></label><i id="verifyStatus"></i></span>'; 
                            }
                        }

                        else{
                            var _destFile = '<span class="list-group-item dropabbleParent" dstnGrandParent="' + grandParent + '" dstnParent="'+ parent +'" id="' + src3 + '" cid="' +
                                cloudId + '" style="height:30px;padding:4px;border-radius:0px;color:#1F2129;padding:1%;">' + _destInput +
                                '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" style="width:92%;font-weight:100">' +
                                '<i class="' + typeicon + '" style="float:left;margin:4px 10px 0px 10px;cursor:pointer;font-size:18px;"></i>' +
                                '<p  title="'+src2+'" style="float:left;cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                src1 + '</p></label><i id="verifyStatus"></i></span>';
                            if(prevPrntId !== undefined){
                                var _destFile = '<span class="list-group-item dropabbleParent" prevParentId ="'+prevPrntId+'"  dstnGrandParent="' + grandParent + '" dstnParent="'+ parent +'" id="' + fileId + '" cid="' +
                                    cloudId + '" style="height:30px;padding:4px;border-radius:0px;color:#1F2129;padding:1%;">' + _destInput +
                                    '<label data-type="' + filetype + '" id="' + src3 + '" cid="' + cloudId + '" style="width:92%;font-weight:100">' +
                                    '<i class="' + typeicon + '" style="float:left;margin:4px 10px 0px 10px;cursor:pointer;font-size:18px;"></i>' +
                                    '<p  title="'+src2+'" style="float:left;cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:13pxmargin:0;margin-top: 0.5%;font-weight:400;">' +
                                    src1 + '</p></label><i id="verifyStatus"></i></span>'; 
                            }
                        }

  
                        moveCheckSum == 'source' ? $("#moveSource").find(".list-group").append(_srcFile) : $("#moveDestination").find(".list-group").append(_destFile);
                    }
                }
                else {
                    var _shareHtml = sharedFolderId != undefined ? 'fileShare="' + fileshareUrl + '" sharedFolderId="' + sharedFolderId + '">' : '>';

                    /*var _shareStatus = AllCloudFileNames.fileShareStatus == 'INACTIVE' ? 'INACTIVE' : '';*/

                    var _Lfile = '<div class="panel-data" id="' + parent + '" data-type="' + filetype + '">' +
                        '<div class="LVcheckBox" name="' + filetype + '"><input type="checkbox"/></div>' +
                        //'<div class="LVfileName" id="' + fileId + '" style="height:20px" name="' + filetype + '" ' + _shareHtml +
                        '<div class="LVfileName" id="' + fileId.replace('"','&quot;') + '" style="height:20px" name="' + filetype + '" ' + _shareHtml +
                        '<i class="pull-left LV' + filetype + '"></i>' +
                        /*'<sup class="share ' + _shareStatus + '"></sup>' +*/
                        '<p class="pull-left displvfilename" name="' + objectName + '" fexten="' + fileExten + '">'
                        + CFManageCloudAccountsAjaxCall.getMaxChars(objectName,50) + '</p>' +
                        '<i class="LVShare' + AllCloudFileNames.fileShared + '"></i></div>' +
                        '<div class="LVFavorites"><a href="#" id="LVFavorite" class="' + favouriteicon + '"></a></div>' +
                        '<div class="LVfileSize" data-type=' + objectSize + ' style="cursor:pointer;">'
                        + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div>' +
                        '<div class="LVdrive" id="' + cloudId + '">' + CLName[cloudName] + '</div>' +
                        '<div class="LVaddedDate">' + dateCreated + '</div><div class="LVmodifiedDate">' + dateModified + '</div></div>';

                    $("#LVContent").append(_Lfile);

                    var _TFile = '<div class="file ' + fileIcon + '" id="' + cloudId + '" style="cursor:pointer;" data-type="' + filetype + '">' +
                        '<i title="' + objectName + '" class="filethumbnail" name="' + filetype + '"></i>' +
                        '<strong class="filename" pid="' + parent + '" id="' + fileId + '" fexten="' + fileExten + '">'
                        + CFManageCloudAccountsAjaxCall.getMaxChars(objectName,14) + '</strong><div' +
                        ' class="filesize"' +
                        ' data-type='
                        + objectSize + '>' + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div>' +
                        '<input type="checkbox" class="fileCheck" name="' + filetype + '"/>' +
                        '<i id="ThFav" class="' + favouriteicon + '" style="cursor:pointer;"></i></div>';

                    $("#ThumbnailContent").append(_TFile);
                }
                if (previousPage == "Share with Me" && PageName == "InnerFolders") {
                    $(".LVFavorites").addClass('buttonDisable');
                    $("#LVContent").children(".panel-data").attr('fileper', FilePer[0]);
                    $("#ThumbnailContent").children(".file").attr('fileper', FilePer[0]);
                }
            }
            if (i == ALLFilesForAllClouds.length - 1) {
                if (PageName == 'move' || PageName == 'innermove' || PageName == 'moveLanding') {
                    $('#spinner2').hide();
                }
                else if (previousPage == "Share with Me") {
                    if ($.inArray('owner', FilePer) > -1) { 

                    }
                }
            }
        });
	if($('#moveSource input[name="moveSourceCheckbox"]:checked').length > 0){
		$('#moveSource').find('input[type="checkbox"]').each(function(){
			$(this).prop('checked',true);
			$(this).parent('span').addClass('fileActive');
		});
	}/*else{
		$('#moveSource').find('input[type="checkbox"]').each(function(){
			$(this).prop('checked',false);
			$('#moveSource').find('.fileActive').each(function(){
				$(this).removeClass('fileActive');
			});
		});
	}*/		
        if (PageName == 'move' || PageName == 'innermove' || PageName == 'back' || PageName =='scrollDown') {
            $("#moveSource").find(".list-group-item").draggable({
                cursor: 'move',
                containment: 'document',
                helper: helperEvent,
                revert: function (is_valid_drop) {
                   if (!is_valid_drop) {
                  /*       $("#moveSource").find(".fileActive").each(function () {
                            $(this).removeClass('fileActive');
                        });*/
                        $("#moveSource").find("input").each(function () {
                            $(this).attr('checked', false);
                        });
                        return 'invalid';
                    }
                },
                cursorAt: {top: 0, left: 0}
            });
            $("#moveSource").find(".list-group-item").selectable();
            $("#moveDestination").find(".list-group-item").droppable({
                accept: '#moveSource .list-group-item',
                drop: dropEventHandler,
                greedy: true,
                over: function () {
                    $(this).addClass('draghover').removeClass('dropabbleParent');
                },
                out: function () {
                    $(this).addClass('dropabbleParent').removeClass('draghover')
                }
            });
            $("#moveDestination").find(".list-group").droppable({
                greedy: true,
                accept: '#moveSource .list-group-item',
                drop: rootDropEventHandler,
                hoverClass: 'rootDragHover'
            });
            if (moveCheckSum == 'source' && PageNumber == 1) {
                $("#moveSource").append('</div>');
            }
            if (moveCheckSum == 'dest' && PageNumber == 1) {
                $("#moveDestination").append('</div>');
            }
            $("#moveSource").on('click', '.list-group-item', function (e) {
                if (e.ctrlKey) {
                    $(this).children('input').attr('checked', true);
                    $(this).addClass('fileActive');
                }
            });
        }
        if (ALLFilesForAllClouds.length < 50) {
            if (PageName == "Home" || PageName == "Folders" || PageName == "InnerFolders" || PageName == "AllFiles" ||PageName == "All Files"|| PageName == "All Items" || PageName == "Recent files" || PageName == "Category" || PageName == "CloudDrive" || PageName == "search") {
                setTimeout(function () {
                    $('#listShowMore').addClass('divdisplay').text('Show more files...')
                }, 100);
            }
        } else {
            setTimeout(function () {
                $('#listShowMore').removeClass('divdisplay').text('Show more files...');
            }, 100);
        }
        if (ALLFilesForAllClouds.length < 40) {
            if (PageName == "Favorites") {
                setTimeout(function () {
                    $('#listShowMore').addClass('divdisplay').text('Show more files...');
                }, 100);
            }
        } else if (PageName == "Favorites") {
            setTimeout(function () {
                $('#listShowMore').removeClass('divdisplay').text('Show more files...');
            }, 100);
        }

        $('#CFRecentSpinner').removeClass('ajaxLoadImage');
        $('#CFRecentSpinner').addClass(spinnerClass);
        if (PageName == 'Recent files') {
            setTimeout(function () {
                $('#spinner1').addClass('divdisplay');
            }, 100);
        } else {
            setTimeout(function () {
                $('#spinner1').addClass('divdisplay');
            }, 100);
        }
        if (ALLFilesForAllClouds.length == 0) {
            $('.LVHcheckBox input').prop("disabled", true);
        } else {
            $('.LVHcheckBox input').prop("disabled", false);
        }
        if (PageName == "move" || PageName == "innermove" ||PageName == "back" || PageName == "moveLanding" || PageName == 'scrollDown') {

        } else {
            if ($('#mainContentWrapper').hasScrollBar() == true) {
                $('#mainContentWrapper').css('width', '100%');
            } else if ($('#mainContentWrapper').hasScrollBar() == false) {
                $('#mainContentWrapper').css('width', '99%');
            }
        }
        if (selectEvent != undefined && selectEvent != null) {
            selectEvent.init();
        }
    },
    getAllFolders: function (toId, PageNumber) {
        var apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + toId + "?page_size=40&isAscen=false&orderField=createdTime&page_nbr=" + PageNumber + "&fetchCollabInfo=true&folderId=&isAllFiles=false";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (FoldersOfGivenCloud) {
                if (FoldersOfGivenCloud.length > 0) {
                    $.each(FoldersOfGivenCloud, function (i, Folders) {

                    });
                }
                return false;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    }, 
    getChildFolders: function (CId, FId) {
        var apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + CId + "?page_size=40&isAscen=false&orderField=createdTime&page_nbr=1&fetchCollabInfo=true&folderId=" + FId + "&isAllFiles=false";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (ChildFolders) {
                if (ChildFolders.length > 0) {
                    $.each(ChildFolders, function (i, Folders) {
                        $('#MoveToFunctionality ul#' + FId + '').append('<li id="' + Folders.id + '" ><div style="display: inline-block;width: 100%;padding-left:10px; "><a href="javascript:void(0)" id="' + Folders.id + '" name="Folder" style="float:left;" class="arrw"></a><i style="float:left;padding-left:5px; color:#fff;" class="loc" id="' + Folders.id + '" name="Folder">' + Folders.objectName + '</i></div><ul id="' + Folders.id + '"></ul></li>');
                    });
                }
                return false;
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getIpInfo: function (ip) {
        var apiUrl = domainUrl+"/proxy/ip/" + ip;
        var ipInfo;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            success: function (IpInfo) {
                ipInfo = IpInfo;
            },
            complete: function (xhr) {
                if (xhr.status > 300) {
                    ipInfo = ip;
                }
            }
        });
        return ipInfo;
    },

    //Universal Functions
    getFileIcon: function (fileExten, filetype) {
        var fileIcon;
        var icons = ["jpg", "pdf", "xlsx", "ppt", "ai", "avi", "csv", "dll", "dmg", "exe", "flv", "gif", "jpg", "mov", "mpg", "png", "psd", "wma", "doc", "docx", "xls"];
        if (fileExten != undefined && fileExten != null && filetype == "FILE") {
            if ($.inArray(fileExten, icons) > -1) {
                return fileIcon = fileExten;
            }
            else {
                return fileIcon = "DefaultIcon";
            }
        }
        else if (fileExten == null && filetype == "FOLDER") {
            return fileIcon = "folder";
        } else if (filetype == "SITE") {
            return fileIcon = "SITE";
        }else if(filetype == "NOTEBOOK"){
            return fileIcon = "folder";
        }
        else if(filetype == "NOTE"){
            return fileIcon = "DefaultIcon";
        }
        else {
            return fileIcon = "DefaultIcon";
        }
    },
    getMaxChars: function (a, b) {
       a = a.replace(/  +/g, ' ');
        a = a.replace("<",'&lt;');
        var f = "...";
        var c = parseInt(b / 2);
        var d = a != undefined ? a.length : 0;
        if (a == "" || d < b) {
            return a;
        } else {
            var e = a;
            a = e.substring(0, b - c - 3) + f + e.substring(e.length - c);
        }
        return a;
    },
    getListObjectName: function (objectName) {
        var maxCharacters = 50;
        if (PageName == "InnerWorkSpace") {
            maxCharacters = 50;
        } else {
            maxCharacters = 40;
        }
        return CFManageCloudAccountsAjaxCall.getMaxChars(objectName, maxCharacters);
    },
    getThumbObjectName: function (objectName) {
        var maxCharacters = 14;
        if (PageName == "InnerWorkSpace") {
            maxCharacters = 26;
        } else {
            maxCharacters = 14;
        }
        return CFManageCloudAccountsAjaxCall.getMaxChars(objectName, maxCharacters);
    },

    getObjectSizeInGB: function (sizeBytes, type) {
        if (sizeBytes == undefined || sizeBytes == null || sizeBytes == 0) {
            return "___";
        } else if (type == "FOLDER") {
            return "___";
        } else {
            var displaySize = "___";
            displaySize = parseFloat(sizeBytes / ONE_GB).toFixed(2) + " GB";
            return displaySize;
        }
    },
    getObjectSize: function (sizeBytes, type) {
        if (sizeBytes == undefined || sizeBytes == null || sizeBytes == 0) {
            return "___";
        } else if (type == "FOLDER") {
            return "___";
        } else {
            var displaySize = "___";
            var fsize = 0;
            if (Math.round(sizeBytes / ONE_GB) > 0) {
                fsize = sizeBytes / ONE_GB;
                displaySize = parseFloat(fsize).toFixed(2) + " GB";
            } else if (Math.round(sizeBytes / ONE_MB) > 0) {
                fsize = sizeBytes / ONE_MB;
                displaySize = parseFloat(fsize).toFixed(2) + " MB";
            } else if (Math.round(sizeBytes / ONE_KB) > 0) {
                fsize = sizeBytes / ONE_KB;
                displaySize = parseFloat(fsize).toFixed(2) + " KB";
            } else {
                displaySize = sizeBytes + " Bytes";
            }
            return displaySize;
        }
    },
    getCloudName: function (cloudName) {
        $.each(CLName, function (key, value) {
            if (key == cloudName) {
                cloudName = value;
            }
        });
        return cloudName;
    },
    getDateConversion: function (dateToConvert) {
        if (dateToConvert == undefined || dateToConvert == null || dateToConvert == "") {
            dateToConvert = "___";
            return dateToConvert;
        }
        var date = new Date(dateToConvert);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (month < 10) {
            month = "0" + month;
        }
        var marr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        month = month - 1;
        dateToConvert = marr[month] + " " + day + ", " + year;
        if (date == "Invalid Date") {
            dateToConvert = "___";
        }
        return dateToConvert;
    },
    moveToAjaxCall: function (moveFileObject, files, sharePointListItemId ) {
        var jsonArray = {
            "fromRootId": moveFileObject.fromId,
            "toRootId": moveFileObject.toId,
            "type": "MOVE_WORKSPACE",
            "fromCloudId": {
                "id": moveFileObject.fromCId
            },
            "toCloudId": {
                "id": moveFileObject.toCId
            },
            "fromCloudSpace": null,
            "toCloudSpace": null,
            "validSpace": true,
            "errorDescription": null,
            "totalFolders": null,
            "totalFiles": null,
            "moveFoldersStatus": false,
            "totalFilesAndFolders": 0,
            "userEmails": moveFileObject.userEmails,
            "threadBy": null,
            "retry": 0,
            "useEncryptKey": false,
            "notify": moveFileObject.notify,
            "fileMove": false,
            "success": false
        };
        //srikanth		
               var gprt=$("#moveSource").find(".list-group").find("span").attr("srcgrandparent")
				if(($('#moveSourceCheckbox').is(':checked'))&&(gprt==null||gprt==""))
				{
					jsonArray.fromRootId = $("#moveSource").find(".list-group").find("span").attr("srcparent");
				}
        //srikanth end
        var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	var _dstCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
        if(_srcCldName == "WASABI" ||_srcCldName == "DROP_BOX" ||_srcCldName == "ONEDRIVE" || _srcCldName == "G_DRIVE" ||_srcCldName == "BOX" ||_srcCldName == "GOOGLE_STORAGE" ||_srcCldName == "AZURE_OBJECT_STORAGE"||_srcCldName == "SHAREPOINT_ONLINE_CONSUMER"||_srcCldName == "SHAREPOINT_CONSUMER_HYBRID"||_srcCldName == "AMAZON"||_srcCldName == "SHARED_DRIVES"){
            /* if(_srcCldName == "DROP_BOX" ||_srcCldName == "ONEDRIVE" || _srcCldName == "G_DRIVE" ||_srcCldName == "BOX" ||_srcCldName == "SHAREPOINT_ONLINE_CONSUMER"){*/

            var apiurl = apicallurl + "/move/consumer/create";
        }
        else
            var apiurl = apicallurl + "/move/clouds/files?isCopy=" + moveFileObject.isCopy;

if(_srcCldName == "FTP" ||_dstCldName == "SHAREPOINT_ONLINE_CONSUMER" || (_srcCldName == "NTLM_STORAGE" && _dstCldName == "G_DRIVE") || (_srcCldName == "NTLM_STORAGE" && _dstCldName == "SHARED_DRIVES")){
		   var apiurl = apicallurl + "/move/consumer/create"; 
		}
        if(_srcCldName == "NTLM_STORAGE" ||_dstCldName == "SHAREPOINT_CONSUMER_HYBRID"){
            jsonArray.sharePointListItemId = sharePointListItemId;
        }
        //srikanth		
				if(($('#moveSourceCheckbox').is(':checked'))&&(gprt==null||gprt==""))
				{
                    var b1=[];
                    var rootid=$("#moveSource").find(".list-group").find("span").attr("srcparent");
                    b1.push(rootid);
					jsonArray.fileIds=b1;
				}
                else{
        jsonArray.fileIds =files;
                   }
        var MoveToJson = JSON.stringify(jsonArray);

        $.ajax({
            type: 'POST',
            url: apiurl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            data: MoveToJson,
            dataType: 'json', 
            success: function (move) {
			//	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'sourceCloud',move.fromCloudName);
			//	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'destinationCloud',move.toCloudName);
              
                var moveId = move.id; 
                var moveProgress = move.processStatus;
               /* if(move.fromCloudId.cloudName === "NTLM_STORAGE" && move.toCloudId.cloudName ==="SHAREPOINT_CONSUMER_HYBRID"){*/
			 
                    $("#CFShowLoading").css("display","none");
                    $('.alertScs .msg').css("margin-top","-2%");
                        alertSuccess("Your migration has been initiated. You can monitor it here or log off and see the migration report that will be emailed to you.");
					
					setTimeout(function () {
                      //  $('#moveReports').trigger('click');
					  window.location.href = "reports.html#personal";
                        localStorage.setItem("MigtnDone","consumer");
                    }, 2000);
                

                switch (moveProgress) {
                    case "PROCESSED"        :
			        //    activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'testMigrationCompleted','Yes');
                        $("#moveProgressBar").find(".progress-bar-success").css('width', '100%');
                        setTimeout(function () {
                            $("#moveProgressBar").hide();
                            $("#moveProgressBar").find(".progress-bar-success").css('width', '0%');
                        }, 2000);
                        $('#moveSource [id="' + move.fromRootId + '"]').children('input').prop('checked', false);
                        $('#moveSource [id="' + move.fromRootId + '"]').fadeOut(500);

                        break;
                    case "IN_PROGRESS"        :
                        CFManageCloudAccountsAjaxCall.getStatus(moveId);
                        break;
                    case "NOT_PROCESSED":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId);
                        break;
                    case "SUSPENDED":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId);
                        break;
                    case "PROCESSED_WITH_SOME_ERRORS":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId);
                        break;
                    case "PROCESSED_WITH_SOME_WARNINGS":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId);
                        break;
                    case "ERROR"                :
                        break;
                }
            },
            complete: function (xhr) {
                if (xhr.status > 300) {
                    unCheckFile();
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getStatus: function (moveId, drag) {
        var apiUrl = apicallurl + "/move/clouds/status/" + moveId + "";
        setTimeout(function () {
            $.ajax({
                type: "GET",
                url: apiUrl,
                async: false,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (status) {
                    var moveStatus = status.processStatus;
                    if (drag == false) {
                        var tolal_files = status.totalFilesAndFolders;
                        var moved_folders = status.totalFolders;
                        var moved_files = 0;
                        if (status.totalFiles != null) {
                            moved_files = status.totalFiles;
                        }
                        var totalFiles = moved_folders + moved_files;
                        var moveProgress = (totalFiles / tolal_files) * 100 + "%";
                        $("#moveProgressBar").find(".progress-bar-success").css('width', moveProgress);
                    }
                    switch (moveStatus) {
                        case "PROCESSED"        :
				         //activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'testMigrationCompleted','Yes');
                         //   zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail, 'trial');
                            $("#moveProgressBar").find(".progress-bar-success").css('width', '100%');
                            setTimeout(function () {
                                $('#moveProgressBar').hide();
                                $("#moveProgressBar").find(".progress-bar-success").css('width', '0%');
                            }, 2000);
                            $('#moveSource [id="' + status.fromRootId + '"]').children('input').prop('checked', false);
                            $('#moveSource [id="' + status.fromRootId + '"]').fadeOut(500);
                            break;
                        case "IN_PROGRESS"        :
                            CFManageCloudAccountsAjaxCall.getStatus(status.id);
                            break;
                        case "NOT_PROCESSED":
                            CFManageCloudAccountsAjaxCall.getStatus(status.id);
                            break;
                        case "SUSPENDED"                :
                            $("#moveProgressBar").hide();
                            $("#moveProgressBar").find(".progress-bar-success").css('width', '0%');
                            break;
                        case "ERROR"                :
                            $("#moveProgressBar").hide();
                            $("#moveProgressBar").find(".progress-bar-success").css('width', '0%');
                            break;
                        case "PROCESSED_WITH_SOME_ERRORS"                :
                            $("#moveProgressBar").hide();
                            $("#moveProgressBar").find(".progress-bar-success").css('width', '0%');
                            break;
                        case "PROCESSED_WITH_SOME_WARNINGS"                :
                            $("#moveProgressBar").hide();
                            $("#moveProgressBar").find(".progress-bar-success").css('width', '0%');
                            break;
                    }
                },
                complete: function (xhr) {
                    if (xhr.status > 300) {
                        unCheckFile();
                        //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                        alertError("Operation Failed");
                    }
                }
            });
        }, 10000);
    },
    moveToVerify: function (fromfid, fromcid, tofid, tocid) {
        $('#VerifyMsg').removeAttr('class').html('');
        var moveVerify = {
            "fromCloudId": {
                "id": fromcid
            },
            "toCloudId": {
                "id": tocid
            },
            "fromRootId": fromfid,
            "toRootId": tofid,
            "deleteOriginalFiles": false,
            "createdTime": "",
            "modifiedTime": "",
            "userEmails": [],
            "useEncryptKey": false,
            "notify": false,
            "fileMove": false,
            "success": false
        };
        var jsondata = JSON.stringify(moveVerify);
        var apiUrl = apicallurl + "/move/verify";
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: true,
            dataType: "json",
            data: jsondata,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
            },
            statusCode: {
                202: function () {
                    $("#VerifyMsg").addClass('verifySuccess');
                    $("#VerifyMsg").text('Verified Successfully.');
                },
                406: function () {
                    $("#VerifyMsg").addClass('verifyFailure');
                    $("#VerifyMsg").text('Already exists in destination folder. Please verify and correct.');
                },
                400: function () {
                    $("#VerifyMsg").addClass('verifyFailure');
                    $("#VerifyMsg").text('Request failed..try again.');
                }
            }
        });
    },
    movereportForGiveId: function (moveId, page, status) {
        if(status == undefined)
            status='all';

        var apiUrl = apicallurl + "/move/movereport?workspaceId=" + moveId + "&page_nbr=" + page + "&status="+ status;
        var totalmoved;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                if(status != "all" && !data.length){
                    $("#moveReportFilesList").html("");
                    $("#"+moveId).siblings(".hide-report2").find("#moveReportFilesList").html("");
                    return false;
                }
                var moveStatus = {
                    "PROCESSED": "Processed",
                    "IN_PROGRESS": "In Progress",
                    "NOT_PROCESSED": "In queue",
                    "ERROR": "Error",
                    "IN_QUEUE": "In queue",
                    "WARNING": "Warning",
                    "SUSPENDED": "Suspended",
                    "PROCESSED_WITH_SOME_ERRORS": "Processed with some errors",
                    "PROCESSED_WITH_SOME_WARNINGS": "Processed with some warnings",
                    "PROCESSED_WITH_SOME_CONFLICTS":"Processed with some conflicts",
                    "CONFLICT":"Conflict",
                    "CANCEL": "Cancel",
                    "PAUSE":"Pause"
                };
				
                if (data == undefined || data == null || data.length < 1) {
                    $('#moveReportsForUser #'+moveId+' #getMoveDetails').children().removeClass("cf-minus5").addClass("cf-plus5disabled");
                    $('#spinner2').hide();
				alertSuccess('No migration details found. ');
				$("#CFShowLoading").hide();
                    return false;
                }
	
                var count = CFManageCloudAccountsAjaxCall.fileFolderCount(moveId);
                if(count.totalFiles !=null)
                {
                    var _errCount;
                    if(count.errorCount ||(count.errorCount == 0)){
                        _errCount =count.errorCount;
                    }
                    else{
                        _errCount =count.conflictCount;
                    }
                    $("#"+moveId).next().find("#_totfiles").text("No. of Files/Folders : " + (count.totalFiles + count.totalFolders));
                    $("#"+moveId).next().find("#_movefolders").text("Conflict Files/Folders : "+_errCount);
                    $("#"+moveId).next().find("#_movefiles").text("Processed Files/Folders : "+count.processedCount );
                }
                $("#"+moveId).next().next().find("#_prcsdCnt").text("No: of Processed files : "+count.processedCount);
                $("#"+moveId).next().next().find("#_wrngCnt").text("No: of Warned files : "+count.warningCount);
                $("#"+moveId).next().next().find("#_errCnt").text("No: of Conflict files : "+_errCount);
                var folderCount = count == null ? 'N/A' : count.totalFolders;
                var fileCount = count == null ? 'N/A' : count.totalFiles;
                if (page) {
                    totalmoved = folderCount + fileCount;
                    var _fmCldId,_toCldId,_exists=false;
                    if(data[0].fromCloud){
                        _exists = true;
                    }
                    else{
                        _exists = false;
                    }
                    if(_exists){
                        _fmCldId = data[0].fromCloud.id;
                        _toCldId = data[0].toCloud.id;
                    }
                    else{
                        _fmCldId = data[0].fromCloudId.id;
                        _toCldId = data[0].toCloudId.id;
                    }
                    var formCloud = _fmCldId;
                    var toCloud = _toCldId;
                   
                    $('#moveDetailedReport').children('div:eq(2)').remove();
                    var _fcn = formCloud != null ? formCloud.cloudName : 'Not Available',
                        _fcd = formCloud != null ? formCloud.userDisplayName : 'Not Available',
                        _tcn = toCloud != null ? toCloud.cloudName : 'Not Available',
                        _tcd = toCloud != null ? toCloud.userDisplayName : 'Not Available';
                    
                }
                $('#moveReportFilesList').find('li:last-child').remove();
                $("#"+moveId).next().next().next().find("#moveReportFilesList").html('');
                CFManageCloudAccountsAjaxCall.appendMoveFiles(data, moveStatus, page);
               
                var _id;
                var _pgntnCnt,_errCount;
                if(count.errorCount ||(count.errorCount == 0)){
                    _errCount =count.errorCount;
                }
                else{
                    _errCount =count.conflictCount;
                }
                switch(status){
                   
                    case "PROCESSED" : _pgntnCnt = count.processedCount;
                        break;
                    case "ERROR" : _pgntnCnt = _errCount;
                        break;
                    case "IN_PROGRESS" : _pgntnCnt = _errCount;
                        break;
                    default : _pgntnCnt = totalmoved;
                        break;
                }
               
                var _d=Math.ceil(_pgntnCnt/20);

                $("#"+moveId).next().next().next().find("#moveFiles_pagination").twbsPagination({
                    totalPages: _d,
                    visiblePages: 10,
                    onPageClick: function (event, page) {
                        if(page==1){
                            var _pgntnCnt;
                            switch(status){
                                case "PROCESSED" : _pgntnCnt = count.processedCount;
                                    break;
                                case "ERROR" : _pgntnCnt = _errCount;
                                    break;
                                case "IN_PROGRESS" : _pgntnCnt = _errCount;
                                    break;
                                default : _pgntnCnt = totalmoved;
                                    break;
                            }
                            var _d=Math.ceil(_pgntnCnt/20);
                            $("#"+moveId).next().next().next().find("#moveFiles_pagination").twbsPagination({totalPages:_d});

                        }

                        _id=moveId;
                        var _status = $("#moveReportsContainer").find("#" + moveId + ".selectpicker").val();
                        CFManageCloudAccountsAjaxCall.movereportForGiveId(moveId,page,_status);
                    }
                });
                $('#CFShowLoading').hide();
                $("#"+moveId).next().show();
                //$("#"+moveId).next().next().show();
                $("#"+moveId).next().next().next().show();
            }
        });
    },
   

    fileFolderCount: function (a,_this) {
		if(_this == undefined){
		var apiCall = apicallurl + "/move/moveworkspacefilefoldercount?workspaceId=" + a;	
		}
		else if((_this.parents('tr:eq(0)').attr('srccldname') == "BOX_BUSINESS" && _this.parents('tr:eq(0)').attr('dstncldname') == "ONEDRIVE_BUSINESS_ADMIN")||(_this.parents('tr:eq(0)').attr('srccldname') == "G_SUITE" && _this.parents('tr:eq(0)').attr('dstncldname') == "AMAZON")||(_this.parents('tr:eq(0)').attr('srccldname') == "GOOGLE_SHARED_DRIVES" && _this.parents('tr:eq(0)').attr('dstncldname') == "AMAZON")||(_this.parents('tr:eq(0)').attr('srccldname') == "SHAREFILE_BUSINESS" && _this.parents('tr:eq(0)').attr('dstncldname') == "EGNYTE_ADMIN")||(_this.parents('tr:eq(0)').attr('srccldname') == "BOX_BUSINESS" && _this.parents('tr:eq(0)').attr('dstncldname') == "DROPBOX_BUSINESS")||(_this.parents('tr:eq(0)').attr('srccldname') == "G_SUITE" && _this.parents('tr:eq(0)').attr('dstncldname') == "DROPBOX_BUSINESS") ||(_this.parents('tr:eq(0)').attr('srccldname') == "EGNYTE_ADMIN" && _this.parents('tr:eq(0)').attr('dstncldname') == "AZURE_OBJECT_STORAGE") ||(_this.parents('tr:eq(0)').attr('srccldname') == "G_SUITE" && _this.parents('tr:eq(0)').attr('dstncldname') == "AMAZON")){ 
		var apiCall = apicallurl + "/move/filefolderinfo/moveworkspacefilefoldercount?workspaceId=" + a;
		}
		else{
		var apiCall = apicallurl + "/move/moveworkspacefilefoldercount?workspaceId=" + a;		
		}
        var _b;
        $.ajax({
            url: apiCall,
            type: 'get',
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (s) {
                return _b = s;
            }
        });
        return _b;
    },
    appendMoveFiles: function (data, b) {
        var _status = ["CANCEL", "WARNING", "ERROR","CONFLICT"];
        var moveId=data[0].moveWorkSpaceId;
        $("#"+moveId).next().find("#moveReportFilesList").html('');
        $.each(data, function (i, file) {
            var fi = file.cfFileMini;
            var filetype = '';
            if (fi.directory == true) {
                filetype = "lnil lnil-folder";
            }
            else if (fi.directory == false) {
                filetype = "lnil lnil-files";
            }
            var fileName = ['All Files', 'My Drive', 'SkyDrive', "", 'My Files & Folders', 'cloudian'];
            var parent1 = fi.parentFileRef;
            var parent = '';
            var fstatus = file.processStatus;
            if (parent1 == null || $.inArray(parent1.objectName, fileName) > -1) {
                parent = '&lt;root&gt;';
            }
            else {
                parent = parent1.objectName;
            }
            var _a = $.inArray(file.processStatus, _status) > -1;
            file.processStatus = b[file.processStatus];
            var _errorDesc = "";
            if (_a) {
                _errorDesc = JSON.stringify(file.errorDescription);
                _a = '<i id="_error' + file.id + '" class="cf-warning3" style="margin-left:5px;color:red"></i>';
            }
            else {
                _errorDesc = "";
                _a = "<i></i>" 
            }
            
            $("#"+moveId).next().next().next().find("#moveReportFilesList").append('<tr>' +
                '<td class="" title="' + fi.objectName + '" ><i class="blockCode ' + filetype + '" style="margin-right:4%;font-size:16px;"></i>' + CFManageCloudAccountsAjaxCall.getMaxChars(fi.objectName,30) + '</td>' +
                '<td class="' + fstatus + '">' + file.processStatus + _a + '</td>' +
                '<td>' + CFManageCloudAccountsAjaxCall.getObjectSize(fi.objectSize, filetype) + '</td>' +
                '<td>' + CFManageCloudAccountsAjaxCall.getDateConversion(file.createdTime) + '</td></tr>');if ($('#_error' + file.id).length) {
                $('#_error' + file.id).attr("title", _errorDesc);
            }
        });
    },
    getAllMoveStatusForUser: function () {
        var apiUrl = apicallurl + "/move/list?page_size=30&page_nbr=" + _page_Num;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json", 
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                var moveStatus = [
                    {"key": "PROCESSED", "value": "Processed"},
                    {"key": "IN_PROGRESS", "value": "In Progress"},
                    {"key": "NOT_PROCESSED", "value": "In queue"},
                    {"key": "ERROR", "value": "Error"},
                    {"key": "IN_QUEUE", "value": "In queue"},
                    {"key": "WARNING", "value": "Warning"},
                    {"key": "SUSPENDED", "value": "Suspended"},
                    {"key": "PROCESSED_WITH_SOME_ERRORS", "value": "Processed with some errors"},
                    {"key": "PROCESSED_WITH_SOME_WARNINGS", "value": "Processed with some warnings"},
                    {"key": "PROCESSED_WITH_SOME_CONFLICTS", "value": "Processed with some conflicts"},
                    {"key": "PROCESSED_WITH_SOME_PAUSE", "value": "Trial completed and paused"},
                    {"key": "CONFLICT", "value": "Conflict"},
                    {"key": "CANCEL", "value": "Cancel"},
                    {"key": "PAUSE", "value": "Pause"}
                ];
                if (_page_Num == 1) {
                    $("#moveReportsForUser").html(''); 
                }
                var _ertitle = "";
                var _erClass = "";
                var _status = ["CANCEL", "WARNING", "ERROR"];
                $.each(data, function (i, move) {
				if(move.fromCloudId !== null){
				srcImage = '../img/PNG/'+move.fromCloudId.cloudName+'.png';
				}
				else{
				srcImage="";
				}
				if(move.toCloudId !== null){
				destImage = '../img/PNG/'+move.toCloudId.cloudName+'.png';
				}
				else{
				destImage="";
				}
                    if((move.multiUserMove == true) || (move.consumerBackup == true)){ 
                    }
                    else if (move.fromCloudId != null && move.toCloudId != null) {
                        var fromCloud = move.fromCloudId;
                        var toCloud = move.toCloudId;
                        var totalFiles = move.totalFilesAndFolders;
                        var colorClass = move.processStatus;
                        _ertitle = move.errorDescription != null ? move.errorDescription : "Error occurred while moving the files, please contact the support team";
                        var _ar = $.inArray(move.processStatus, _status) > -1;
                        _erClass = _ar == true ? "cf-warning3" : "";
                        $.each(moveStatus, function (i, code) {
                            if (code.key == move.processStatus) {
                                move.processStatus = code.value;
                            }
                        });
                        toCloud.userDisplayName = toCloud.userDisplayName == null ? toCloud.cloudUserId.split('|')[toCloud.cloudUserId.split('|').length  - 1] : toCloud.userDisplayName;
                        fromCloud.userDisplayName = fromCloud.userDisplayName == null ? fromCloud.cloudUserId.split('|')[fromCloud.cloudUserId.split('|').length - 1] : fromCloud.userDisplayName;
                      /*  if(i==0 && colorClass === "PROCESSED"){
					     activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'testMigrationCompleted','Yes');       
                        }*/
			
                        if (totalFiles == 0) {
                            var _filterHtml = '';
                            if(move.fileName == null){
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="'+ move.errorCount +'">'+
                                    '<td>Undefined</td>'+  
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.fromCloudId.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+fromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(fromCloud.userDisplayName,25) + '</span></td>'+
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.toCloudId.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+toCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(toCloud.userDisplayName,25) + '</span></td>'+
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>'+
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>'+
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
                                    '<td style="text-align:center;">_cancelImg</td>'+
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>'+
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>'+
                                    _filterHtml +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">'+
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>'+
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">'+
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
	if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{ 
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
                            }
                            else {
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                   
                                    '<td title="'+move.fileName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(move.fileName, 25) + '</td>' +
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.fromCloudId.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+fromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(fromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.toCloudId.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+toCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(toCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>' +
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+ 
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td>' +
									 '</tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' +
                                    _filterHtml +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
                            	if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
							}
                        }
                        else {
                            var _filterHtml = '';
                            if(move.fileName == null) { 
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="'+ move.errorCount +'">'+
                                    
                                    '<td>Undefined</td>'+
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.fromCloudId.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+fromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(fromCloud.userDisplayName,25) + '</span></td>'+
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.toCloudId.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+toCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(toCloud.userDisplayName,25) + '</span></td>'+
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>'+
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>'+
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>'+
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>'+
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">'+
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>'+
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">'+
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
                            	if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);   
							}
                            else{

                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                    
                                    '<td title="'+move.fileName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(move.fileName, 25) + '</td>' +
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.fromCloudId.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+fromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(fromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left"><div class="drive" id="' + move.toCloudId.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+toCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(toCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>'+
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' +
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
	if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
                            }
                        }
                    }
                    else if (move.fromCloudId == null || move.toCloudId == null) {
                        totalFiles = move.totalFilesAndFolders;
                        colorClass = move.processStatus;
                        _ertitle = move.errorDescription != null ? move.errorDescription : "Error occurred while moving the files, please contact the support team";
                        var _ar = $.inArray(move.processStatus, _status) > -1;
                        _erClass = _ar == true ? "cf-warning3" : "";
                        var ToCloud, FromCloud;

                        if (move.fromCloudId == null && move.toCloudId != null) {
                            ToCloud = move.toCloudId;
                            FromCloud = {};
                            FromCloud.id = "Not Available";
                            FromCloud.cloudName = "Not_Available";
                            FromCloud.userDisplayName = "Not Available";
                            ToCloud.userDisplayName = ToCloud.userDisplayName == null ? ToCloud.cloudUserId.split('|')[ToCloud.cloudUserId.split('|').length - 1] : ToCloud.userDisplayName;
                        }
                        else if (move.toCloudId == null && move.fromCloudId != null) {
                            FromCloud = move.fromCloudId;
                            ToCloud = {};
                            ToCloud.id = "Not Available";
                            ToCloud.cloudName = "Not_Available";
                            ToCloud.userDisplayName = "Not Available";
                            FromCloud.userDisplayName = FromCloud.userDisplayName == null ? FromCloud.cloudUserId.split('|')[FromCloud.cloudUserId.split('|').length - 1] : FromCloud.userDisplayName;
                        }
                        else if (move.toCloudId == null && move.fromCloudId == null) {
                            ToCloud = {};
                            ToCloud.id = "Not Available";
                            ToCloud.cloudName = "Not_Available";
                            ToCloud.userDisplayName = "Not Available";
                            FromCloud = {};
                            FromCloud.id = "Not Available";
                            FromCloud.cloudName = "Not_Available";
                            FromCloud.userDisplayName = "Not Available";
                        }
                        $.each(moveStatus, function (i, code) {
                            if (code.key == move.processStatus) {
                                move.processStatus = code.value;
                            }
                        });
                        if (totalFiles == 0) {
                            var _filterHtml = '';
                            if(move.fileName == null){
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="'+ move.errorCount +'">'+
                                 
                                    '<td>Undefined</td>'+
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + FromCloud.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+FromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(FromCloud.userDisplayName,25) + '</span></td>'+
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + ToCloud.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+ToCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(ToCloud.userDisplayName,25) + '</span></td>'+
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>'+
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>'+
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+				 	 				
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle disabled" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;color: rgba(51,51,51,0.65);"></i></td></tr>'+
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>'+
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">'+
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>'+
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">'+
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
	if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
                            }
                            else {
                               var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                    
                                    '<td title="'+move.fileName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(move.fileName, 25) + '</td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + FromCloud.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+FromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(FromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + ToCloud.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+ToCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(ToCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>' +
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle disabled" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;color: rgba(51,51,51,0.65);"></i></td></tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' +
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
                            	if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
							}
                        }
                        else if( move.processStatus == "Suspended") {
                      
                            var _filterHtml = '';
                            
                            if (move.fileName == null) {
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                   
                                    '<td>Undefined</td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + FromCloud.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+FromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(FromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + ToCloud.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+ToCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(ToCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>'+
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									 '<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' +
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr>thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
					if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
                            } else {
                               var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                   
                                    '<td title="'+move.fileName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(move.fileName, 25) + '</td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + FromCloud.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+FromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(FromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + ToCloud.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+ToCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(ToCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>'+
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									 '<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' + 
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
                            
								if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
					}
                        }
                        else {
                       
                            var _filterHtml = '';
                            
                            if (move.fileName == null) {
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                    
                                    '<td>Undefined</td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + FromCloud.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+FromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(FromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + ToCloud.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+ToCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(ToCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>' +
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' +
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
									if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
							
					$('#moveReportsForUser').append(_html);

                            } else { 
                                var _html = '<tr id="' + move.id + '" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc" data-errorcount="' + move.errorCount + '">' +
                                    
                                    '<td title="'+move.fileName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(move.fileName, 25) + '</td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + FromCloud.cloudName + '"></div></div><span style="display: block;padding-top:4%;float: left;" title="'+FromCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(FromCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><div class="Driveicon pull-left" style="display:none;"><div class="drive" id="' + ToCloud.cloudName + '"></div></div><span style="display:block;padding-top:4%;float: left;" title="'+ToCloud.userDisplayName+'">' + CFManageCloudAccountsAjaxCall.getMaxChars(ToCloud.userDisplayName, 25) + '</span></td>' +
                                    '<td><span class="' + colorClass + '">' + move.processStatus + '</span></td>' +
                                    '<td style="padding-left: 15px;">' + jQuery.timeago(move.createdTime) + '</td>' +
									'<td style="text-align:center;"><i class="lnil lnil-download" id="dwnldPrsnlRpt" style="text-align: center;cursor: pointer;color: #1220f6;font-weight: 600;font-size: 14px;"></i></td>'+
									'<td style="text-align:center;">_cancelImg</td>'+
									'<td mid="' + move.id + '" id="getMoveDetails"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>' +
                                    '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td style="text-align: center;padding-top:2%;" colspan="7"><div  id="_totfiles" style="border-radius: 4px;color:#1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefiles" style="border-radius: 4px;color:#00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div><div id="_movefolders" style="border-radius: 4px;color:#FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;"></div></td><td></td></tr>' +
                                    _filterHtml + '<tr class="hide-report1" style="display: none;font-weight: bold;font-size: 14px;height:40px"><td></td><td id="_prcsdCnt" style="text-align: center"></td><td id="_wrngCnt" style="text-align: right"></td><td></td><td id="_errCnt"></td><td class="_filter" align="right">' +
                                    _filterHtml + '<tr class="hide-report2" style="display:none"><td colspan="8"><table class="table" style="margin-left: 5%;width: 90%;"><thead style="background:#f2f3ff;"><tr><th style="width:30%;">File Name</th><th style="width:28%;">Status</th><th style="width:20%;">Size</th><th style="width:22%;">Created Date</th></tr></thead>' +
                                    '<tbody id="moveReportFilesList"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center">' +
                                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';
                             
							if(colorClass == "CANCEL" ||colorClass == "NOT_PROCESSED" ||colorClass == "PROCESSED" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS" ||colorClass == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"||colorClass == "PROCESSED_WITH_SOME_ERRORS"||colorClass == "PROCESSED_WITH_SOME_PAUSE"||colorClass == "PROCESSED_WITH_SOME_WARNINGS"||colorClass == "ERROR"||colorClass == "COMPLETED" ||colorClass == "CONFLICT"){
							_html = _html.replace('_cancelImg','<i class="lnil lnil-cross-circle" style="text-align: center;cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');
							}
							
							else{
						_html =	_html.replace('_cancelImg','<i class="lnil lnil-cross-circle cancelMig" style="text-align: center;cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>');								
							}
					$('#moveReportsForUser').append(_html);
							}
                        }
						if(move.fromCloudId !== null){
						$('#moveReportsForUser').find('tr#'+move.id).children('td:eq(1)').children('.Driveicon').css('display','block');
						}
						if(move.toCloudId !== null){
						$('#moveReportsForUser').find('tr#'+move.id).children('td:eq(2)').children('.Driveicon').css('display','block');	
						}
                    }
					
                });
                setTimeout(function () {
                    $('#showMoreReports').text('Show more reports.');
                    $('#CFShowLoading').hide();
                    if ($(".cf-plus5").length == 30 && data.length == 30) { 
                        $('#showMoreReports').show();
                    }
                    else {
                        $('#showMoreReports').hide();
                    }
                }, 1000);
				if(data.length == 30 && $('#moveReportsForUser tr:visible').length <30){
					_page_Num = _page_Num +1;
					CFManageCloudAccountsAjaxCall.getAllMoveStatusForUser(); 
				}
            }
        });
    },
    getAllMoveStatusForSyncUser: function () {
        var apiUrl = apicallurl + "/move/consumer/get/moveJob?page_size=60&page_nbr=" + PageNumber; 
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                var moveStatus =
                    {
                        "PROCESSED": "Processed",
                        "COMPLETED":"Completed",
                        "IN_PROGRESS": "In Progress",
                        "NOT_PROCESSED": "In queue",
                        "ERROR": "Error",
                        "IN_QUEUE": "In queue",
                        "WARNING": "Warning",
                        "SUSPENDED": "Suspended",
                        "PROCESSED_WITH_SOME_ERRORS": "Processed with some errors",
                        "PROCESSED_WITH_SOME_WARNINGS": "Processed with some warnings",
                        "PROCESSED_WITH_SOME_CONFLICTS":"Processed with some conflicts",
                        "CONFLICT":"Conflict",
                        "CANCEL": "Cancel",
                        "PAUSE":"Pause",
                        "CONSUMERTRAIL_COMPLETED":"Consumer Trail Completed"
                    };
                if (PageNumber == 1) {
                    $("#moveSyncReportsForUser").html('');
                }
                var _ResumeImg, _cancelImg, iconsArray = [];
                var _len = data.length;
                for (var i = 0; i < _len; i++) {
                    if((data[i].fromCloudId == null || data[i].toCloudId == null) && (data[i].jobStatus == "CANCEL")){
                        _cancelImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                        _ResumeImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2" class="dsblePause">'; 
                    }
                    else {
                        if (data[i].jobStatus == "CANCEL") {
                            _ResumeImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2" class="dsblePause">';
                            _cancelImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            //  $(".fa-download").css("opacity", "0.2").css("cursor", "not-allowed");
                        }
                        else if (data[i].jobStatus == "PAUSE") {
                            _ResumeImg = '<img src="../img/Resume.png" style="cursor: pointer;" class="conSyncPause">'; 
                            _cancelImg = '<i class="lnil lnil-cross-circle cnclConBtn" style="cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            //    $(".fa-download").css("opacity", "0.2").css("cursor", "not-allowed");
                        }
                        else if (data[i].jobStatus == "IN_PROGRESS") {
                            _ResumeImg = '<img src="../img/Pause.png" style="cursor: pointer;" class="conSyncPause">';  
                            _cancelImg = '<i class="lnil lnil-cross-circle cnclConBtn" style="cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            //   $(".fa-download").css("opacity", "0.2").css("cursor", "not-allowed");
                        }
                        else if (data[i].jobStatus == "COMPLETED" || data[i].jobStatus == "PROCESSED_WITH_SOME_CONFLICTS") {
                            _ResumeImg = '<img src="../img/Pause.png" style="cursor: pointer;" class="conSyncPause">';
                            _cancelImg = '<i class="lnil lnil-cross-circle cnclConBtn" style="cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            //   $(".fa-download").css("opacity", "0.2").css("cursor", "not-allowed");
                        }
                        else if (data[i].jobStatus == "SUSPENDED") {
                            _ResumeImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2" class="dsblePause">';
                            _cancelImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            //   $(".fa-download").css("opacity", "0.2").css("cursor", "not-allowed");
                        }
                        else if (data[i].jobStatus == "CONSUMERTRAIL_COMPLETED") {
                            _ResumeImg = '<img src="../img/Resume.png" style="cursor: pointer;" class="conSyncPause">'; 
                            _cancelImg = '<i class="lnil lnil-cross-circle cnclConBtn" style="cursor: pointer;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            //    $(".fa-download").css("opacity", "0.2").css("cursor", "not-allowed");
                        } 
                    }
                    var obj = {
                        display: _ResumeImg,
                        cancel: _cancelImg
                    };
                    iconsArray.push(obj);
                }
                var _appendHtml ='<tr id="jobID" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc;border-top: 1px solid #ccc!important">'+
                    
			'<td title="jobname">JobName</td>'+
                    '<td><span class="stats">JobStatus</span></td>'+
                    '<td>createdTime</td>'+
                    '<td style="padding-left: 4%;"> _ResumeImg</td>'+
                    '<td style="padding-left: 2.5%;">_cancelImg</td>'+
                    '<td mid="jobId" id="getMoveSyncDetails"  jobstatus = "Status" workspaceLength="wsLngth"><i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td></tr>'+
                    '<tr class="report" style="display:none;border-bottom: none!important;"><td colspan="6" ><table class="main-table" style="width: 90%;margin: 2% 5%;"><thead class="tab-header" style="background: #f2f3ff"><tr><td style="width: 24%;font-weight:bold;">From</td><td style="width: 24%;font-weight:bold;">To</td><td style="width:25%;font-weight:bold;">Status</td><td style="width: 15%;font-weight:bold;">Date</td><td style="width:4%;font-weight:bold;"></td></tr></thead>'+
                    '<tbody id="moveReportIteration"></tbody><tfoot><tr style="border:none !important;"><th colspan="5"><div class="pagination" style="display: flex;justify-content: center;">' +
                    '<ul id="moveIterationPagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></td></tr>';

                _len = data.length;
                $("#moveSyncReportsForUser").html(''); 
                for(var i = 0; i < _len; i++){
                    var _data = data[i],_html;
                  /*  if(i==0 && _data.jobStatus === "PROCESSED"){
					    activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'testMigrationCompleted','Yes');
					}*/
                    if(_data.jobStatus != "STARTED"){
					_html = _appendHtml.replace('jobID',data[i].id).replace('jobId',data[i].id).replace('wsLngth',data[i].listOfMoveWorkspaceId.length).replace('jobname',data[i].jobName).replace('JobName',CFManageCloudAccountsAjaxCall.getMaxChars(data[i].jobName, 25)).replace('stats',data[i].jobStatus).replace('JobStatus',moveStatus[data[i].jobStatus]).replace('Status',data[i].jobStatus).replace('createdTime',jQuery.timeago(data[i].createdTime)).replace('_ResumeImg',iconsArray[i].display).replace('_cancelImg',iconsArray[i].cancel);
                        $("#moveSyncReportsForUser").append(_html);
                    }
                }

                setTimeout(function () {
                    $('#showMoreReports').text('Show more reports.');
                    $('#CFShowLoading').hide();
                    if ($(".cf-plus5").length == 30 && data.length == 30) {
                        $('#showMoreReports').show();
                    }
                    else {
                        $('#showMoreReports').hide(); 
                    }
                }, 1000);
            }
        });
    },
    SyncReports: function (jobid,pageNumber,workSpaceLen) {
        $("#moveSyncReportsForUser").find('#'+jobid).next(".report").show();
        var apiUrl = apicallurl + "/move/consumer/get/list/"+jobid+"?page_nbr="+pageNumber+"&page_size=50";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {

                var moveStatus =
                    {
                        "PROCESSED": "Processed",
                        "IN_PROGRESS": "In Progress",
                        "NOT_PROCESSED": "In queue",
                        "ERROR": "Error",
                        "IN_QUEUE": "In queue",
                        "WARNING": "Warning",
                        "SUSPENDED": "Suspended",
                        "PROCESSED_WITH_SOME_ERRORS": "Processed with some errors",
                        "PROCESSED_WITH_SOME_WARNINGS": "Processed with some warnings",
                        "PROCESSED_WITH_SOME_CONFLICTS":"Processed with some conflicts",
                        "CONFLICT":"Conflict",
                        "CANCEL": "Cancel",
                        "PAUSE":"Pause",
                        "PROCESSED_WITH_SOME_PAUSE": "Trial completed and paused",
                        "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE":"Trial completed and pause with conflicts"
                    };

                var _appendHtml ='<tr id="jobID" style="font-size: 14px;height: 40px;border-bottom:1px solid #ccc;border-top: 1px solid #ccc!important" TotalCount = "totalFiles" PrcsdCount ="processedFiles" conflictCount ="ConflictFiles">'+
                    '<td><div class="Driveicon pull-left"><div class="drive" id="fromCldName"></div></div><span style="display: block;margin-top: 5px;float: left;" id="cldIdFrom" title="fromCloudName">' + CFManageCloudAccountsAjaxCall.getMaxChars('fromCloudName',25) + '</span></td>'+
                    '<td><div class="Driveicon pull-left"><div class="drive" id="toCldName"></div></div><span style="display:block;margin-top: 5px;float: left;" id="cldIdTo" title="toCloudName">' + CFManageCloudAccountsAjaxCall.getMaxChars('toCloudName',25) + '</span></td>'+
                    '<td><span class="stats">JobStatus</span></td>'+
                    '<td>createdTime</td><td id="jobId" class="getSyncReportDetails" jobstatus= "Status"><i class="lnil lnil-chevron-down-circle cf-plus5" style="color: #0062FF;font-size: 18px;font-weight: 600;margin-left: 7px;cursor: pointer;"></i></td>'+
                    '<tr class="FilesDetails" style="display: none;font-weight: bold;font-size: 14px;height:40px;border-bottom: none!important;"><td colspan="5" ><div><div style="padding-top: 2%;margin-left: 4.5%;margin-right: -12%"><div class="col-md-3" id="_totfiles" style="text-align: center;margin-right: 5%;float:left;border-radius: 4px;color:#1F2129;padding: 0.5%;margin-bottom: 2%;width:25%;">No. of Files/Folders :</div><div class="col-md-3" id="_movefiles" style="width:25%;text-align: center;margin-right: 5%;border-radius: 4px;color:#00C64F;padding: 0.5%;float:left;margin-bottom: 2%;">Processed Files/Folders :</div><div class="col-md-3" id="_movefolders" style="width:25%;text-align: center;border-radius: 4px;color:#FF4C4C;padding: 0.5%;float:left;margin-bottom: 2%;">Conflict Files/Folders :</div><div class="form-group statusDropDown col-md-3"></div></div>'+
                    '<div class="InnerReport" style="padding-top: 2%;"><table class="main-table" style="width: 80%;margin: 2% 10%;margin-top: auto;"><thead class="tab-header" style="background: #f2f3ff"><tr><td style="width: 28%;padding-left:1%">File Name</td><td style="width: 24%;">Status</td><td style="width:25%;">Size</td><td style="width: 15%;">Date</td></tr></thead>'+
                    '<tbody id="moveReportFilesList" style="font-weight: 400;"></tbody><tfoot><tr style="border:none !important;"><th colspan="4"><div class="pagination" style="display: flex;justify-content: center;margin-top: 5%;">'+
                    '<ul id="moveFiles_pagination" class="pagination-sm users_footer" style="margin:0;display: flex;justify-content: center"></ul></div></th></tr></tfoot></table></div></div></td></tr>';

                _len = data.length;
                var count = workSpaceLen;
                $("#"+jobid).next().find("#moveReportIteration").html('');
                $("#"+jobid).next().find("#moveReportIteration").find('li:last-child').remove();
                for(var i = 0; i < _len; i++){
                    var _data = data[i],_html;
                    if(_data.jobStatus != "STARTED"){
                        _html = _appendHtml.replace('jobID',data[i].jobId).replace('fromCldName',data[i].fromCloudName).replace('srcImage','../img/PNG/'+data[i].fromCloudName+'.png').replace('toCldName',data[i].toCloudName).replace('destImage','../img/PNG/'+data[i].toCloudName+'.png').replace('fromCloudName',data[i].fromMailId).replace('fromCloudName',data[i].fromMailId).replace('toCloudName',data[i].toMailId).replace('toCloudName',data[i].toMailId).replace('stats',data[i].processStatus).replace('JobStatus',moveStatus[data[i].processStatus]).replace('createdTime',jQuery.timeago(data[i].createdTime)).replace('jobId',data[i].id).replace('Status',data[i].processStatus).replace('totalFiles',data[i].totalFilesAndFolders).replace('processedFiles',data[i].processedCount).replace('ConflictFiles',data[i].conflictCount); 
					
                        $("#"+jobid).next().find("#moveReportIteration").append(_html);
                        if(data[i].fromCloudId === null  || data[i].toCloudId === null){
                            $("#cldIdFrom").css('opacity','0.5');
                            $("#cldIdTo").css('opacity','0.5');
                        }
                    }
                }
                if (pageNumber) {
                    totalmoved = count;
                }
                var pageCount;
                switch(status){
                    case "PROCESSED" : pageCount = count.processedCount;
                        break;
                    case "ERROR" : pageCount = _errCount;
                        break;
                    case "IN_PROGRESS" : pageCount = totalmoved;
                        break;
                    default : pageCount = totalmoved;
                        break;
                }
				if(pageCount == undefined){
				pageCount = 1;
				}
                var _d=Math.ceil(pageCount/20);

                $("#"+jobid).next().find("#moveIterationPagination").twbsPagination({
                    totalPages: _d,
                    visiblePages: 10,
                    onPageClick: function (event, pageNumber) {
                        if(pageNumber==1){
                            var pageCount;
                            switch(status){
                                case "PROCESSED" : pageCount = count.processedCount;
                                    break;
                                case "ERROR" : pageCount = _errCount;
                                    break;
                                case "IN_PROGRESS" : pageCount = totalmoved;
                                    break;
                                default : pageCount = totalmoved;
                                    break;
                            }
                            var _d=Math.ceil(pageCount/20);
                            $("#"+jobid).next().find("#moveIterationPagination").twbsPagination({totalPages:_d});

                        }
                        _id=jobid;
                        var _syncStatus = $("#moveSyncReportsContainer").find("#" + jobid + ".selectpicker").val();
                        CFManageCloudAccountsAjaxCall.SyncReports(jobid,pageNumber);
                    }
                });
                $('#CFShowLoading').hide();
                /*    $("#"+jobid).next().show();
                    $("#"+jobid).next().next().next().show(); */
            }
        });
        setTimeout(function () {
            $('#showMoreReports').text('Show more reports.');   
            $('#CFShowLoading').hide();
            if ($(".cf-plus5").length == 30 && data.length == 30) {
                $('#showMoreReports').show();
            }
            else {
                $('#showMoreReports').hide();
            }
        }, 1000);
    },

    moveSyncInnerReports: function (moveId, page, status, state) {
        $(state).show();
        $(state).find(".InnerReport").show();
        if(status == undefined)
            status='all';

        var apiUrl = apicallurl + "/move/movereport?workspaceId=" + moveId + "&page_nbr=" + page;
        var totalmoved;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                var moveStatus = {
                    "PROCESSED": "Processed",
                    "IN_PROGRESS": "In Progress",
                    "NOT_PROCESSED": "In queue",
                    "ERROR": "Error",
                    "IN_QUEUE": "In queue",
                    "WARNING": "Warning",
                    "SUSPENDED": "Suspended",
                    "PROCESSED_WITH_SOME_ERRORS": "Processed with some errors",
                    "PROCESSED_WITH_SOME_WARNINGS": "Processed with some warnings",
                    "PROCESSED_WITH_SOME_CONFLICTS":"Processed with some conflicts",
                    "CONFLICT":"Conflict",
                    "CANCEL": "Cancel",
                    "PAUSE":"Pause"
                };
                $("#moveReportFilesList").html("");
                var count = CFManageCloudAccountsAjaxCall.fileFolderCount(moveId);
                if(count.totalFiles !=null)
                {
                    var _errCount;
                    if(count.errorCount ||(count.errorCount == 0)){
                        _errCount =count.errorCount;
                    }
                    else{
                        _errCount =count.conflictCount;
                    }
                    $("#"+moveId).parent().next().find("#_totfiles").text("No. of Files/Folders : " + (count.totalFiles + count.totalFolders));
                    $("#"+moveId).parent().next().find("#_movefolders").text("Conflict Files/Folders : "+_errCount);
                    $("#"+moveId).parent().next().find("#_movefiles").text("Processed Files/Folders : "+count.processedCount );
                }
                if (data == undefined || data == null || data.length < 1) {
                    // $('.report #'+moveId+' #getSyncReportDetails').children().removeClass("cf-minus5").addClass("cf-plus5disabled");
                    $('#spinner2').hide();
				alertSuccess('No migration details found. '); 
				$("#CFShowLoading").hide();
                    return false;
                }
                var folderCount = count == null ? 'N/A' : count.totalFolders;
                var fileCount = count == null ? 'N/A' : count.totalFiles;
                if (page) { 
                    totalmoved = folderCount + fileCount;
                    var _fmCldId,_toCldId,_exists=false;
                    if(data[0].fromCloud){
                        _exists = true;
                    }
                    else{ 
                        _exists = false;
                    }
                    if(_exists){
                        _fmCldId = data[0].fromCloud.id; 
                        _toCldId = data[0].toCloud.id;
                    }
                    else{
                        _fmCldId = data[0].fromCloudId.id;
                        _toCldId = data[0].toCloudId.id;
                    }
                    var formCloud = _fmCldId;
                    var toCloud = _toCldId;
                    var _fcn = formCloud != null ? formCloud.cloudName : 'Not Available',
                        _fcd = formCloud != null ? formCloud.userDisplayName : 'Not Available',
                        _tcn = toCloud != null ? toCloud.cloudName : 'Not Available',
                        _tcd = toCloud != null ? toCloud.userDisplayName : 'Not Available';
                }
                $("#"+moveId).parent().next().find("#moveReportFilesList").find('li:last-child').remove();
                $("#"+moveId).parent().next().find("#moveReportFilesList").html('');
                CFManageCloudAccountsAjaxCall.appendSyncMoveFiles(data, moveStatus, page);
                var _id;
                var _pgntnCnt,_errCount;
                if(count.errorCount ||(count.errorCount == 0)){
                    _errCount =count.errorCount;
                }
                else{
                    _errCount =count.conflictCount;
                }
                switch(status){
                    case "PROCESSED" : _pgntnCnt = count.processedCount;
                        break;
                    case "ERROR" : _pgntnCnt = _errCount;
                        break;
                    case "IN_PROGRESS" : _pgntnCnt = totalmoved;
                        break;
                    default : _pgntnCnt = totalmoved;
                        break;
                }
                var _d=Math.ceil(_pgntnCnt/20);

                $("#"+moveId).parent().next().find("#moveFiles_pagination").twbsPagination({
                    totalPages: _d,
                    visiblePages: 10,
                    onPageClick: function (event, page) {
                        if(page==1){
                            var _pgntnCnt;
                            switch(status){
                                case "PROCESSED" : _pgntnCnt = count.processedCount;
                                    break;
                                case "ERROR" : _pgntnCnt = _errCount;
                                    break;
                                case "IN_PROGRESS" : _pgntnCnt = totalmoved;
                                    break;
                                default : _pgntnCnt = totalmoved;
                                    break;
                            }
                            var _d=Math.ceil(_pgntnCnt/20);
                            $("#"+moveId).parent().next().find("#moveFiles_pagination").twbsPagination({totalPages:_d});

                        }
                        _id=moveId;
                        var _syncStatus = $("#moveSyncReportsContainer").find("#" + moveId + ".selectpicker").val();
                        CFManageCloudAccountsAjaxCall.moveSyncInnerReports(moveId,page,_syncStatus);
                    }
                });
                $('#CFShowLoading').hide();
                $("#"+moveId).next().show();
                $("#"+moveId).next().next().next().show();
            }
        });
    },
    appendSyncMoveFiles: function (data, b) {
        var _status = ["CANCEL", "WARNING", "ERROR","CONFLICT"];
        var moveId=data[0].moveWorkSpaceId;
        $("#"+moveId).next().find("#moveReportFilesList").html('');
        $.each(data, function (i, file) {
            var fi = file.cfFileMini;
            var filetype = '';
            if (fi.directory == true) {
                filetype = "lnil lnil-folder";
            }
            else if (fi.directory == false) {
                filetype = 'lnil lnil-files';
            }
            var fileName = ['All Files', 'My Drive', 'SkyDrive', "", 'My Files & Folders', 'cloudian'];
            var parent1 = fi.parentFileRef;
            var parent = '';
            var fstatus = file.processStatus;
            if (parent1 == null || $.inArray(parent1.objectName, fileName) > -1) {
                parent = '&lt;root&gt;';
            }
            else {
                parent = parent1.objectName;
            }
            var _a = $.inArray(file.processStatus, _status) > -1;
            file.processStatus = b[file.processStatus];
            var _errorDesc = "";
            if (_a) {
                _errorDesc = JSON.stringify(file.errorDescription);
                _a = '<i id="_error' + file.id + '" class="cf-warning3" style="margin-left:5px;color:red"></i>';
            }
            else {
                _errorDesc = "";
                _a = "<i></i>"
            }
            $("#"+moveId).parent().next().find("#moveReportFilesList").append('<tr style="height: 4.5vh;border-bottom: 1px solid #e5e5e5;">' +
                '<td class="" title="' + fi.objectName + '" style="padding-left:1%" ><i class="blockCode ' + filetype + '" style="margin-right:4%;font-size:16px;"></i><span>' + CFManageCloudAccountsAjaxCall.getMaxChars(fi.objectName,25) + '</span></td>' +
                '<td class="' + fstatus + '">' + file.processStatus + _a + '</td>' +
                '<td>' + CFManageCloudAccountsAjaxCall.getObjectSize(fi.objectSize, filetype) + '</td>' +
                '<td>' + CFManageCloudAccountsAjaxCall.getDateConversion(file.createdTime) + '</td></tr>');if ($('#_error' + file.id).length) {
                $('#_error' + file.id).attr("title", _errorDesc);
            }
        });
    },

    copyToAjaxCall: function (fromfid, fromcid, tofid, tocid, len) {
        if (tofid === 0) {
            tofid = tocid;
        }
        var jsonArray = {
            "fromRootId": fromfid,
            "toRootId": tofid,
            "type": "MOVE_WORKSPACE",
            "fromCloudId": {
                "id": fromcid
            },
            "toCloudId": {
                "id": tocid
            },
            "fromCloudSpace": null,
            "toCloudSpace": null,
            "validSpace": true,
            "errorDescription": null,
            "totalFolders": null,
            "totalFiles": null,
            "moveFoldersStatus": false,
            "totalFilesAndFolders": 0,
            "userEmails": null,
            "threadBy": null,
            "retry": 0,
            "useEncryptKey": false,
            "notify": true,
            "fileMove": false,
            "success": false
        };
        var MoveToJson = JSON.stringify(jsonArray);
        $.ajax({
            type: 'POST',
            url: apicallurl + "/move/clouds/files?isCopy=true",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            data: MoveToJson,
            dataType: 'json',
            success: function (move) {
                var moveId = move.id;
                var moveProgress = move.processStatus;
                switch (moveProgress) {
                    case "PROCESSED"        :
                        break;

                    case "IN_PROGRESS"        :
                        CFManageCloudAccountsAjaxCall.getStatus(moveId, len);
                        break;

                    case "NOT_PROCESSED":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId, len);
                        break;

                    case "SUSPENDED":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId, len);
                        break;
                    case "PROCESSED_WITH_SOME_ERRORS":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId, len);
                        break;
                    case "PROCESSED_WITH_SOME_WARNINGS":
                        CFManageCloudAccountsAjaxCall.getStatus(moveId, len);
                        break;

                    case "ERROR"                :
                        break;
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    unCheckFile();
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
				alertError("Operation Failed");
                }
            }
        });
    },
    getAllRootFoldersAndFiles: function (idofCloud, PageNumber,parentId,prevparentid) {
        $("#refreshcloudinmove").hide();
        var apiUrl;
        for(var i=0;i<AllCloudsInfo.length;i++){
            if(AllCloudsInfo[i].id  == idofCloud){
                break;
            }
        }
        if (HomePageOnload == "Home") {
            $('#breadCrumbdync').empty();
            appendBreadCrumb("Home", "Home", "Home");
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles;
        }
        if (PageName == "Folders") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles;
        }
        else if (PageName == "CloudDrive") {
            if (previousPage == 'innermove' && PageName == 'CloudDrive') {
                if (moveCheckSum == 'source') {
                    apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + idofCloud + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=true";
                }
                else {
                    apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + idofCloud + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=false";
                }
                PageName = previousPage;
                previousPage = "";
            } else {
                apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + idofCloud + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles;
            }
        }
        else if (PageName == "Home") {
            $("#breadCrumbdync").empty();
            $("#breadCrumbdync").append('<li id="Home" class="BCRFList" cloudId="Home" fileId="All Files"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">Files</a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a href="#"> All Files</a></li>');
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles;
        }
        else if (PageName == "InnerFolders") {
            apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles;
            $('#LVContent .panel-data[name="back"]').remove();
        }
        else if (PageName == 'move' || PageName == 'back') {
            var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
            var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
            var _check = sessionStorage.getItem("source");
            //sessionStorage.removeItem("source");
            if((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "SHARED_DRIVES" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")) {
                /*  if((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")) { */
                var _scrollSrcTokenVal,_scrollDstnTokenVal,_pageSizeVal;

                /*   if(_srcCldName === "G_DRIVE" && _check === "source" ||_srcCldName === "BOX" && _check === "source"){ */
                if((_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "SHARED_DRIVES" && _check === "source")){
                    _pageSizeVal ="&page_size=25";
                }
                /*	  else if(_dstnCldName === "G_DRIVE" &&  _check === "destination" ||_dstnCldName === "BOX" &&  _check === "destination"){ */
                else if((_dstnCldName === "G_DRIVE" &&  _check === "destination")||(_dstnCldName === "SHARED_DRIVES" &&  _check === "destination")){
                    _pageSizeVal ="&page_size=25";
                }
                else if(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source"){
                    $('#RestrictionMOVE').modal('show');
                    $("#CFShowLoading").css("display","none");
                    return false;
                }

                else
                    _pageSizeVal ="&page_size=50";

                var _srcTokenVal = $("#moveSource").attr('srcNextPageToken');
                $("#moveSource").removeAttr('srcNextPageToken');

                if(PageName == 'move' && _scroll==true){
                    _scrollSrcTokenVal=localStorage.getItem('_scrollSrcTokenVal');
                  //  _scrollDstnTokenVal=localStorage.getItem('_scrollDstnTokenVal');
                }
				 if(PageName == 'move' && _scrolll==true){
                  //  _scrollSrcTokenVal=localStorage.getItem('_scrollSrcTokenVal');
                    _scrollDstnTokenVal=localStorage.getItem('_scrollDstnTokenVal');
                }

                var _dstnTokenVal = $("#moveDestination").attr('dstnNextPageToken');
                $("#moveDestination").removeAttr('dstnNextPageToken');

                if ((moveCheckSum == 'dest') && _dstnTokenVal) {
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId + "&nextPreviousId=" + encodeURIComponent(_dstnTokenVal);
                }
                if ((moveCheckSum == 'dest') && _scrollDstnTokenVal &&  _scrolll==true) {
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId + "&nextPreviousId=" + encodeURIComponent(_scrollDstnTokenVal);
                }
                else if ((moveCheckSum == 'dest')&& (PageName == 'move')) {
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId;
                }
                if ((moveCheckSum == 'source') && _srcTokenVal) {
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId + "&nextPreviousId=" + encodeURIComponent(_srcTokenVal);
                }
                if ((moveCheckSum == 'source') && _scrollSrcTokenVal &&  _scroll==true) {
                    if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") {
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId + "&nextPreviousId=" + encodeURIComponent(_scrollSrcTokenVal);
                    }
                    else
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId + "&nextPreviousId=" + encodeURIComponent(_scrollSrcTokenVal);
                }
                else if (moveCheckSum == 'source' && (PageName == 'move')) {
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + AllCloudsInfo[i].rootFolderId;
                }
                else if(moveCheckSum == 'source' && PageName == 'back'){
                    var _token = localStorage.getItem("_scrollSrcTokenVal");
                    if ((_token == "null") || (_token == " ") || (_token == undefined) || (_token.length == 0)) {
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent(SingleCloudId) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    } else {
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    }
                }
                else if(moveCheckSum == 'dest' && PageName == 'back'){
                    var _token = localStorage.getItem("_scrollDstnTokenVal");
                    if ((_token == "null") || (_token == " ") || (_token == undefined) || (_token.length == 0)) {
                        if (_dstnCldName=== "SHAREPOINT_CONSUMER_HYBRID") {
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent(SingleCloudId) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId)+ "&parentId="+parentId;
                        }
                        else
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent(SingleCloudId) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    } else {
                        if (_dstnCldName=== "SHAREPOINT_CONSUMER_HYBRID") {
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId)+ "&parentId="+parentId;
                        }
                        else
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    }
                }
            }
            else if(!((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "SHARED_DRIVES" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")))
            /*   else if(!((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")))*/
                apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + idofCloud + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=true";
        }
        else if (PageName == 'innermove' || PageName == 'back'|| PageName == 'scrollDown') {
            var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
            var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
            var _check = sessionStorage.getItem("source");
            if((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "SHARED_DRIVES" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")|| (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")){
                /* if((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")){*/
                var _pageSizeVal,_scrollSrcTokenVal1,_scrollDstnTokenVal1;
                /* if(_srcCldName === "G_DRIVE" && _check === "source" ||_srcCldName === "BOX" && _check === "source"){ */
                if((_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "SHARED_DRIVES" && _check === "source")){
                    _pageSizeVal ="&page_size=25";
                }
                /* else if(_dstnCldName === "G_DRIVE" &&  _check === "destination" ||_dstnCldName === "BOX" &&  _check === "destination" ){ */
                else if((_dstnCldName === "G_DRIVE" &&  _check === "destination")||(_dstnCldName === "SHARED_DRIVES" &&  _check === "destination") ){
                    _pageSizeVal ="&page_size=25";
                }
                else
                    _pageSizeVal ="&page_size=50";

                var _srcInnerTokenVal = $("#moveSource").attr('innerSrcNextPageToken');
                $("#moveSource").removeAttr('innerSrcNextPageToken');

                if(PageName == 'innermove' && _scroll==true){
                    _scrollSrcTokenVal1='';
                }
				if(PageName == 'innermove' && _scrolll==true){
                    _scrollDstnTokenVal1='';
                }

                if(PageName == 'scrollDown' && _scroll==true){
                    _scrollSrcTokenVal=localStorage.getItem('_scrollSrcTokenVal');
                }
				if(PageName == 'scrollDown' && _scrolll==true){
                    _scrollDstnTokenVal=localStorage.getItem('_scrollDstnTokenVal');
                }
                var _dstnInnerTokenVal = $("#moveDestination").attr('innerDstnNextPageToken');
                $("#moveDestination").removeAttr('innerDstnNextPageToken');


                if ((moveCheckSum == 'dest') && (_scrollDstnTokenVal||PageName == 'scrollDown') &&  _scrolll==true) {
                    if (_dstnCldName=== "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum === "dest") {
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber +_pageSizeVal + "&folderId=" + encodeURIComponent($(".list-group-item.dropabbleParent.ui-droppable").attr("dstnparent")) +"&nextPreviousId=" + encodeURIComponent(_scrollDstnTokenVal) + "&parentId="+parentId;
                    }
                    else
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber +_pageSizeVal + "&folderId=" +  encodeURIComponent($(".list-group-item.dropabbleParent.ui-droppable").attr("dstnparent")) +"&nextPreviousId=" +encodeURIComponent(_scrollDstnTokenVal);
                }
                else if((moveCheckSum == 'dest') && (PageName == 'innermove')) {
                    if ($("#moveDestination .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid") == undefined || $("#moveDestination .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").length === 0) {
                        if (_dstnCldName=== "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum === "dest") {
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId) + "&parentId="+parentId;
                        }
                        else
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    } else {
                        if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum === "dest") {
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + SinglePId+ "&parentId="+parentId;
                        }
                        else
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    }
                }                if ((moveCheckSum == 'source') && (_scrollSrcTokenVal||PageName == 'scrollDown') &&  _scroll==true) {
                    if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum === "source") {
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid")) + "?page_nbr=" + PageNumber +_pageSizeVal + "&folderId=" + encodeURIComponent($(".list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("srcparent")) +"&nextPreviousId=" + encodeURIComponent(_scrollSrcTokenVal) 	+ "&parentId="+parentId;
                    }
                    else
                        apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid")) + "?page_nbr=" + PageNumber +_pageSizeVal + "&folderId=" + encodeURIComponent($(".list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("srcparent")) +"&nextPreviousId=" +encodeURIComponent(_scrollSrcTokenVal);
                }
                else if(moveCheckSum == 'source' && (PageName == 'innermove')) {
                    if ($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid") == undefined || $("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").length === 0) {
                        if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum === "source") {
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + SinglePId + "&parentId="+parentId;
                        }
                        else
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + AllCloudsInfo[i].id + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    } else {
                        if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && moveCheckSum === "source") {
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + SinglePId+ "&parentId="+parentId;
                        }
                        else
                            apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid")) + "?page_nbr=" + PageNumber + _pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                    }
                }
                else if(moveCheckSum == 'source' && PageName == 'back'){
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveSource .list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("cid")) + "?page_nbr=" + PageNumber +_pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                }
                else if(moveCheckSum == 'dest' && PageName == 'back'){
                    apiUrl = apicallurl + "/filefolder/userId/" + localStorage.getItem('UserId') + "/cloudId/" + encodeURIComponent($("#moveDestination .list-group-item.dropabbleParent.ui-droppable").attr("cid")) + "?page_nbr=" + PageNumber +_pageSizeVal + "&folderId=" + encodeURIComponent(SinglePId);
                }
            }
            else if(!((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "SHARED_DRIVES" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")))
            /*  else if(!((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination"))) */
                apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + SingleCloudId + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=" + encodeURIComponent(SinglePId) + "&isAllFiles=true";
        }

        if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
            var json ={
                "previousParentIds":prevparentid
            };

            $.ajax({
                type: "POST",
                url: apiUrl,
                data : JSON.stringify(json),
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (RootFoldersandFiles) {
                    var destbackId, destbackPrevId;
                    var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                    var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                    var _check = sessionStorage.getItem("source");
                    if (RootFoldersandFiles.length) {
                        if (moveCheckSum == 'source' && (PageName == 'move' || PageName == 'back' || PageName == 'scrollDown')) {
                            $("#moveSource").attr("srcNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                        }
                        if (moveCheckSum == 'dest' && (PageName == 'move' || PageName == 'back' || PageName == 'scrollDown')) {
                            $("#moveDestination").attr("dstnNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                        }
                        if (moveCheckSum == 'source' && (PageName == 'innermove' || PageName == 'scrollDown')) {
                            $("#moveSource").attr("innerSrcNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);

                        }
                        if (moveCheckSum == 'dest' && (PageName == 'innermove' || PageName == 'scrollDown')) {
                            $("#moveDestination").attr("innerDstnNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);

                        }
                    } else if (RootFoldersandFiles.length == 0 && moveCheckSum == 'source') {
                        localStorage.removeItem("_scrollSrcTokenVal");

                    }
                    else if (RootFoldersandFiles.length == 0 && moveCheckSum == 'dest') {

                        localStorage.removeItem("_scrollDstnTokenVal");
                    }

                    var fileName = ['All Files', 'My Drive', 'SkyDrive', '', 'My Files & Folders', 'cloudian', ""];
                    var type = '';
                    if (PageName == 'move' || PageName == 'innermove' || PageName == 'back' || PageName == 'scrollDown') {
                        // $('#spinner2').hide();
                        $("#CFShowLoading").css("display", "none");
                        if (RootFoldersandFiles.length != 0 && RootFoldersandFiles[0].parentFileRef == null && RootFoldersandFiles[0].cloudName !== "SHAREPOINT_CONSUMER_HYBRID") {
                            var _a = ["AMAZON", "SALES_FORCE", "DOCUMENTUM", "CLOUDIAN", "CENTURYLINK"];

                            if ($.inArray(RootFoldersandFiles[0].cloudName, _a) > -1) {
                                if (moveCheckSum == 'dest') {
                                    $("#move-header").find("#dynamicDestCloudName").attr('fid', RootFoldersandFiles[0].parent);
                                }
                            }
                            type = 'getClouds';
                        } else if (RootFoldersandFiles.length == 0) {
                            var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                            var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                            var _check = sessionStorage.getItem("source");
                            if ((_srcCldName === "WASABI" && _check === "source") ||(_srcCldName === "DROP_BOX" && _check === "source") || (_srcCldName === "ONEDRIVE" && _check === "source") || (_srcCldName === "G_DRIVE" && _check === "source") || (_srcCldName === "SHARED_DRIVES" && _check === "source") || (_srcCldName === "BOX" && _check === "source") || (_srcCldName === "GOOGLE_STORAGE" && _check === "source") || (_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source") || (_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source") || (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") || (_srcCldName === "AMAZON" && _check === "source") || (_dstnCldName === "WASABI" && _check === "destination") ||(_dstnCldName === "DROP_BOX" && _check === "destination") || (_dstnCldName === "ONEDRIVE" && _check === "destination") || (_dstnCldName === "G_DRIVE" && _check === "destination") || (_dstnCldName === "SHARED_DRIVES" && _check === "destination") || (_dstnCldName === "BOX" && _check === "destination") || (_dstnCldName === "GOOGLE_STORAGE" && _check === "destination") || (_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination") || (_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination") || (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") || (_dstnCldName === "AMAZON" && _check === "destination")) {
                                var fileDetails = CFHPlistview.getFileDetails(SinglePId, SingleCloudId);
                            } else
                                var fileDetails = CFHPlistview.getFileDetails(SinglePId, SingleCloudId);

                            if (fileDetails == undefined || fileDetails == null || fileDetails == "") {
                                if (moveCheckSum == 'source') {
                                    var _srcShowMore = $("#moveSource").siblings("#movePageShowMore"); 
                                    _srcShowMore.hide();
                                    _srcShowMore.attr('movepagenumber', '-1');
                                    if (SinglePId == 0) {
                                        $("#moveSource").html('');
                                        $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top: 1%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-src" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                                        CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
                                    } 
                                }
                                if (moveCheckSum == 'dest') {
                                    var _destShowMore = $("#moveDestination").siblings("#movePageShowMore");
                                    _destShowMore.hide();
                                    _destShowMore.attr('movepagenumber', '-1')
                                    if (SinglePId == 0) {
                                        $("#moveDestination").html(''); 
                                        $("#moveDestination").append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top: 0.5%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-dstn" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                                        CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
                                    }
                                }
                                return false;
                            }
                            if (moveCheckSum == 'dest') {
                                $("#move-header").find("#dynamicDestCloudName").attr('fid', fileDetails.id);
                            }
                            if ($.inArray(fileDetails.objectName, fileName) > -1) {
                                type = 'getClouds';
                            } else {
                                type = fileDetails.parent;
                                if (type == null && ((_srcCldName === "WASABI" && _check === "source") ||(_srcCldName === "DROP_BOX" && _check === "source") || (_srcCldName === "ONEDRIVE" && _check === "source") || (_srcCldName === "G_DRIVE" && _check === "source") || (_srcCldName === "SHARED_DRIVES" && _check === "source")|| (_srcCldName === "BOX" && _check === "source") || (_srcCldName === "GOOGLE_STORAGE" && _check === "source") || (_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source") || (_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source") || (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") || (_srcCldName === "AMAZON" && _check === "source") || (_dstnCldName === "WASABI" && _check === "destination") || (_dstnCldName === "DROP_BOX" && _check === "destination") || (_dstnCldName === "ONEDRIVE" && _check === "destination") || (_dstnCldName === "G_DRIVE" && _check === "destination")|| (_dstnCldName === "SHARED_DRIVES" && _check === "destination") || (_dstnCldName === "BOX" && _check === "destination") || (_dstnCldName === "GOOGLE_STORAGE" && _check === "destination") || (_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination") || (_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination") || (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") || (_dstnCldName === "AMAZON" && _check === "destination"))) {
                                    /*if(type == null && ((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination"))){ */
                                    if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                        if ($('[data-type="destback"]').attr('id') == undefined) {
                                            type = 'getClouds';
                                        } else if (PageName === "back")
                                            type = $('[data-type="destback"]').attr('id');
                                        else
                                            type = $('#moveDestination .list-group-item.dropabbleParent.ui-droppable').attr('dstnparent');
                                        destbackId = $('[data-type="destback"]').attr('previousParentId');
                                        destbackPrevId = $('#moveDestination .list-group-item.dropabbleParent.ui-droppable').attr('id');
                                    } else
                                        type = 'getClouds';
                                }
                            }
                        } else {
                            if (RootFoldersandFiles[0].parent.split(':')[RootFoldersandFiles[0].parent.split(':').length - 1] == "SITE")
                                sharepointListId = RootFoldersandFiles[0].parent;
                            if ($('[data-type="destback"]').attr('id') == undefined)
                                type = 'getClouds';
                            else if ($('[data-type="destback"]').attr('id') == '/' && PageName == "back")
                                type = 'getClouds';
                            else {
                                var prevLen = RootFoldersandFiles[0].previousParentIds.split('*').length - 2;
                                var prev = RootFoldersandFiles[0].previousParentIds.split('*')[prevLen];
                                type = prev;
                            }
                        }
                        if (moveCheckSum == 'source' && PageNumber == 1) {
                            $("#moveSource").html('');
                          //  $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top: 2%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-src" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                          $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top: 2%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div>')
                        }
                        if (moveCheckSum == 'dest' && PageNumber == 1) {
                            $("#moveDestination").html('');
                          //  $("#moveDestination").append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top: 0.5%;margin-right: -15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-dstn" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                           $("#moveDestination").append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top: 0.5%;margin-right: -15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div>')
                             if (RootFoldersandFiles.length) {
                                $("#move-header").find("#dynamicDestCloudName").attr('fid', RootFoldersandFiles[0].parent);
                                if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_CONSUMER_HYBRID") {
                                    $('[data-type="destback"]').attr('previousParentId', RootFoldersandFiles[0].previousParentIds);
                                }
                            } else {
                                $('[data-type="destback"]').attr('previousParentId', destbackId + '*' + destbackPrevId);

                            }
                        }
                    }
                    CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
                },
                complete: function (xhr) {
                    if (xhr.status > 300) {
                        alertError("Operation Failed");
                        $('CFShowLoading').css('display', 'none');
                    }
                }
            });
        }
        else {
            $.ajax({
                type: "GET",
                url: apiUrl,
                   async: false,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (RootFoldersandFiles) { 
				
                    var destbackId, destbackPrevId;
                    var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                    var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
					if(!(_srcCldName === "BOX")){
				_scroll = false;
				_scrolll = false;
				}
                    var _check = sessionStorage.getItem("source");
                    if ((((_srcCldName == "WASABI" && _check == "source") ||(_srcCldName == "DROP_BOX" && _check == "source") || (_srcCldName == "ONEDRIVE" && _check == "source") || (_srcCldName == "G_DRIVE" && _check == "source") || (_srcCldName == "SHARED_DRIVES" && _check == "source") || (_srcCldName == "BOX" && _check == "source") || (_srcCldName == "GOOGLE_STORAGE" && _check == "source") || (_srcCldName == "AZURE_OBJECT_STORAGE" && _check == "source") || (_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source") || (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") || (_srcCldName === "AMAZON" && _check === "source")) && (RootFoldersandFiles.length)) || (((_dstnCldName == "WASABI" && _check == "destination") ||(_dstnCldName == "DROP_BOX" && _check == "destination") || (_dstnCldName == "ONEDRIVE" && _check == "destination") || (_dstnCldName == "G_DRIVE" && _check == "destination") || (_dstnCldName == "SHARED_DRIVES" && _check == "destination") || (_dstnCldName == "BOX" && _check == "destination") || (_dstnCldName == "GOOGLE_STORAGE" && _check == "destination") || (_dstnCldName == "AZURE_OBJECT_STORAGE" && _check == "destination") || (_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination") || (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") || (_dstnCldName === "AMAZON" && _check === "destination")) && (RootFoldersandFiles.length))) {
                        /* if((((_srcCldName =="DROP_BOX" && _check =="source") ||(_srcCldName =="ONEDRIVE" && _check =="source")|| (_srcCldName =="G_DRIVE" && _check =="source") || (_srcCldName =="BOX" && _check =="source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")) && (RootFoldersandFiles.length)) ||(((_dstnCldName =="DROP_BOX" && _check =="destination") ||(_dstnCldName =="ONEDRIVE" && _check =="destination")|| (_dstnCldName =="G_DRIVE" && _check =="destination") || (_dstnCldName =="BOX" && _check =="destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")) && (RootFoldersandFiles.length))) { */
                        if (moveCheckSum == 'source' && (PageName == 'move' || PageName == 'back' || PageName == 'scrollDown')) {
                            if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") {
                                $("#moveSource").attr("srcNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveSource").attr("srcNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }

                        }
                        if (moveCheckSum == 'dest' && (PageName == 'move' || PageName == 'back' || PageName == 'scrollDown')) {
                            if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                $("#moveDestination").attr("dstnNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveDestination").attr("dstnNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }
                        }
                        if (moveCheckSum == 'source' && (PageName == 'innermove' || PageName == 'scrollDown')) {
                            if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") {
                                $("#moveSource").attr("innerSrcNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveSource").attr("innerSrcNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                //localStorage.setItem("_scrollSrcTokenVal1",RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }
                        }
                        if (moveCheckSum == 'dest' && (PageName == 'innermove' || PageName == 'scrollDown')) {
                            if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                $("#moveDestination").attr("innerDstnNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveSource").attr("innerDstnNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                //localStorage.setItem("_scrollDstnTokenVal1",RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }
                        }
                    } else if (RootFoldersandFiles.length == 0 && moveCheckSum == 'source') {
                        localStorage.removeItem("_scrollSrcTokenVal");

                    }
                    else if (RootFoldersandFiles.length == 0 && moveCheckSum == 'dest') {

                        localStorage.removeItem("_scrollDstnTokenVal");
                    }

                    var fileName = ['All Files', 'My Drive', 'SkyDrive', '', 'My Files & Folders', 'cloudian', ""];
                    /*if(isProd){
                     fileName.push('CloudFuze');
                     }else{
                     fileName.push('Cloudfuze Dev');
                     }*/
                    var type = '';
                    if (PageName == 'move' || PageName == 'innermove' || PageName == 'back' || PageName == 'scrollDown') {
                        // $('#spinner2').hide();
                        $("#CFShowLoading").css("display", "none");
                        if (RootFoldersandFiles.length != 0 && RootFoldersandFiles[0].parentFileRef == null && RootFoldersandFiles[0].cloudName !== "SHAREPOINT_CONSUMER_HYBRID") {
                            var _a = ["AMAZON", "SALES_FORCE", "DOCUMENTUM", "CLOUDIAN", "CENTURYLINK"];

                            if ($.inArray(RootFoldersandFiles[0].cloudName, _a) > -1) {
                                if (moveCheckSum == 'dest') {
                                    $("#move-header").find("#dynamicDestCloudName").attr('fid', RootFoldersandFiles[0].parent);
                                }
                            }
                            type = 'getClouds';
                        } else if (RootFoldersandFiles.length == 0) {
                            var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                            var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                            var _check = sessionStorage.getItem("source");
                        if((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source") || (_srcCldName == "SHARED_DRIVES" && _check == "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")){
                                var fileDetails = CFHPlistview.getFileDetails(SinglePId, SingleCloudId);
                            } else
                                var fileDetails = CFHPlistview.getFileDetails(SinglePId, SingleCloudId);

                            if (fileDetails == undefined || fileDetails == null || fileDetails == "") {
                                if (moveCheckSum == 'source') {
                                    var _srcShowMore = $("#moveSource").siblings("#movePageShowMore"); 
                                    _srcShowMore.hide(); 
                                    _srcShowMore.attr('movepagenumber', '-1');
                                    if (SinglePId == 0) {
                                        $("#moveSource").html('');
                                       // $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top: 1%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-src" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                                          $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top: 1%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div>')
                                      CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
                                    }
                                } 
                                if (moveCheckSum == 'dest') {
                                    var _destShowMore = $("#moveDestination").siblings("#movePageShowMore");
                                    _destShowMore.hide();
                                    _destShowMore.attr('movepagenumber', '-1')
                                    if (SinglePId == 0) {
                                        $("#moveDestination").html('');
                                      //  $("#moveDestination").append('<div data-type="destback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top: 0.5%;margin-right: -15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-dstn" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                                          $("#moveDestination").append('<div data-type="destback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top: 0.5%;margin-right: -15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div>')
                                      CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
                                    }
                                }
                                return false;
                            }
                            if (moveCheckSum == 'dest') {
                                $("#move-header").find("#dynamicDestCloudName").attr('fid', fileDetails.id);
                            }
                            if ($.inArray(fileDetails.objectName, fileName) > -1) {
                                type = 'getClouds'; 
                            } else {
                                type = fileDetails.parent;
                                if (type == null && ((_srcCldName === "WASABI" && _check === "source") ||(_srcCldName === "DROP_BOX" && _check === "source") || (_srcCldName === "ONEDRIVE" && _check === "source") || (_srcCldName === "G_DRIVE" && _check === "source") || (_srcCldName === "BOX" && _check === "source") || (_srcCldName === "GOOGLE_STORAGE" && _check === "source") || (_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source") || (_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source") || (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") || (_srcCldName === "AMAZON" && _check === "source") || (_dstnCldName === "WASABI" && _check === "destination") ||(_dstnCldName === "DROP_BOX" && _check === "destination") || (_dstnCldName === "ONEDRIVE" && _check === "destination") || (_dstnCldName === "G_DRIVE" && _check === "destination") || (_dstnCldName === "BOX" && _check === "destination") || (_dstnCldName === "GOOGLE_STORAGE" && _check === "destination") || (_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination") || (_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination") || (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") || (_dstnCldName === "AMAZON" && _check === "destination"))) {
                                    /*if(type == null && ((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination"))){ */
                                    if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                        if ($('[data-type="destback"]').attr('id') == undefined) {
                                            type = 'getClouds';
                                        } else if (PageName === "back")
                                            type = $('[data-type="destback"]').attr('id');
                                        else
                                            type = $('#moveDestination .list-group-item.dropabbleParent.ui-droppable').attr('dstnparent');
                                        destbackId = $('[data-type="destback"]').attr('previousParentId');
                                        destbackPrevId = $('#moveDestination .list-group-item.dropabbleParent.ui-droppable').attr('id');
                                    } else
                                        type = 'getClouds';
                                }
                            }
                        } else {
                            if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_CONSUMER_HYBRID") {
                                if (RootFoldersandFiles[0].parent.split(':')[RootFoldersandFiles[0].parent.split(':').length - 1] == "SITE")
                                    sharepointListId = RootFoldersandFiles[0].parent;
                                if ($('[data-type="destback"]').attr('id') == undefined)
                                    type = 'getClouds';
                                else if ($('[data-type="destback"]').attr('id') == '/' && PageName == "back")
                                    type = 'getClouds';
                                else {
                                    var prevLen = RootFoldersandFiles[0].previousParentIds.split('*').length - 2;
                                    var prev = RootFoldersandFiles[0].previousParentIds.split('*')[prevLen];
                                    type = prev;
                                }
                            } else {
                                var type1 = RootFoldersandFiles[0].parentFileRef;
                                if ($.inArray(type1.objectName, fileName) > -1 && type1.parentFileRef == null) {
                                    type = 'getClouds';
                                    if (moveCheckSum == 'dest') {
                                        $('#dynamicDestCloudName').attr('check', 'droot');
                                        $("#move-header").find("#dynamicDestCloudName").attr('fid', type1.id);
                                    }
                                } else if (moveCheckSum == 'dest') {
                                    type = type1.parent;
                                    $("#move-header").find("#dynamicDestCloudName").attr('fid', type1.id);
                                } else if (moveCheckSum == 'source') {
                                    type = type1.parent;
                                }
                            }
                        }
                        if (moveCheckSum == 'source' && PageNumber == 1) {
                            $("#moveSource").html('');
                           // $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding:2%;margin-bottom:2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top:1%;margin-right:-9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-src" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>');
                          $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding:2%;margin-bottom:2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top:1%;margin-right:-9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div>');
                         }
                        if (moveCheckSum == 'dest' && PageNumber == 1) {
                            $("#moveDestination").html('');
                           // $("#moveDestination").append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px;padding:2%;margin-bottom:2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top:0.5%;margin-right:-15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-dstn" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                             $("#moveDestination").append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px;padding:2%;margin-bottom:2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top:0.5%;margin-right:-15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div>')
                           if (RootFoldersandFiles.length) {
                                $("#move-header").find("#dynamicDestCloudName").attr('fid', RootFoldersandFiles[0].parent); 
                                if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_CONSUMER_HYBRID") {
                                    $('[data-type="destback"]').attr('previousParentId', RootFoldersandFiles[0].previousParentIds);
                                }
                            } else {
                                $('[data-type="destback"]').attr('previousParentId', destbackId + '*' + destbackPrevId);

                            }
                        }
                    }
                    CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);

                    if (PageName != 'move') {
                        if (RootFoldersandFiles.length == 0) {
                            InnerCloudId = [];
                            InnerFolderId = [];
                            setTimeout(function () {
                                var _brcrdyncFchild;

                                if (moveCheckSum == 'source') {
                                    _brcrdyncFchild = $('#breadCrumbdyncmove > :nth-child(2)');
                                } else {
                                    _brcrdyncFchild = $('#breadCrumbdyncmovedest > :nth-child(2)');
                                }

                                _brcrdyncFchild.nextAll().remove();
                                //var fileObj = CFHPlistview.getFileDetails(fid);
                                //   var fileObject = CFHPlistview.getFileDetails(SinglePId);
                                var fileCount = 0;
                                do {
                                    //var fileName = ['All Files', 'My Drive', 'SkyDrive', "", 'My Files & Folders', 'cloudian'];
                                    if (fileObject != undefined && fileObject != null) {
                                        if (fileObject.directory == true) {
                                            InnerCloudId.push(fileObject.cloudId);
                                            InnerFolderId.push(fileObject.id);
                                        }
                                        if (fileObject.parentFileRef != undefined || fileObject.parentFileRef != null) {
                                            if ($.inArray(fileObject.objectName, fileName) < 0) {
                                                _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject.id + '"' +
                                                    'class="BCRFList" cloudid="' + fileObject.cloudId + '">' +
                                                    '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject.objectName + '</a></li>');
                                                fileObject = fileObject.parentFileRef;
                                                fileCount = fileCount + 1;
                                            }
                                        } else if ($.inArray(fileObject.objectName, fileName) < 0) {
                                            _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject.id + '"' +
                                                'class="BCRFList" cloudid="' + fileObject.cloudId + '">' +
                                                '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer">' + fileObject.objectName + '</a></li>');
                                            break;
                                        }
                                        if ($.inArray(fileObject.objectName, fileName) > -1) {
                                            fileCount = 5;
                                        }
                                    } else {
                                        fileCount = 5;
                                    }
                                } while (fileCount < 5);
                            }, 500);
                        } else {
                            var _brcrdyncFchild;//$("#breadCrumbdyncmove").find("li:first-child");

                            if (moveCheckSum == 'source') {
                                _brcrdyncFchild = $('#breadCrumbdyncmove > :nth-child(2)');
                            } else {
                                _brcrdyncFchild = $('#breadCrumbdyncmovedest > :nth-child(2)');
                            }
                            _brcrdyncFchild.nextAll().remove();
                            var fileObject = RootFoldersandFiles;
                            var fileCount = 0;
                            var test = [];
                            InnerCloudId = [];
                            InnerFolderId = [];
                            do {
                                test = [];
                                if (fileObject[0].parentFileRef != undefined || fileObject[0].parentFileRef != null) {
                                    if (fileCount > 0) {
                                        if (fileObject[0].directory == true) {
                                            InnerCloudId.push(fileObject[0].cloudId);
                                            InnerFolderId.push(fileObject[0].id);
                                        }
                                        if ($.inArray(fileObject.objectName, fileName) < 0) {
                                            _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject[0].id + '" class="BCRFList" cloudid="' + fileObject[0].cloudId + '"><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject[0].objectName + '</a></li>');
                                        }
                                        if ($.inArray(fileObject.objectName, fileName) > 0) {
                                            fileCount = 5;
                                        }
                                    }
                                    fileObject = fileObject[0].parentFileRef;
                                    test.push(fileObject);
                                    fileObject = test;
                                    fileCount = fileCount + 1;
                                } else {
                                    fileCount = fileCount + 1;
                                    if (fileObject[0].directory == true) {
                                        InnerCloudId.push(fileObject[0].cloudId);
                                        InnerFolderId.push(fileObject[0].id);
                                        if ($.inArray(fileObject[0].objectName, fileName) > 0) {
                                            fileCount = 5;
                                        }
                                    }
                                    if ($.inArray(fileObject[0].objectName, fileName) < 0) {
                                        _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject[0].id + '" class="BCRFList" cloudid="' + fileObject[0].cloudId + '"><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject[0].objectName + '</a></li>');
                                        break;
                                    }
                                    if ($.inArray(fileObject[0].objectName, fileName) > -1) {
                                        fileCount = 5;
                                    }
                                }
                            } while (fileCount < 5);
                        }
                        setTimeout(function () {
                            var _brCrdync;
                            if (moveCheckSum == 'source') {
                                _brCrdync = $("#breadCrumbdyncmove");
                            } else {
                                _brCrdync = $("#breadCrumbdyncmovedest");
                            }
                            var liLength = _brCrdync.children('li').length;
                            var _brCrdyncChild;

                            for (var i = 0; i < liLength - 1; i++) {
                                _brCrdyncChild = _brCrdync.children("li:eq(" + i + ")").children("a");
                                _brCrdyncChild.css('color', 'blue');
                                _brCrdyncChild.css('text-decoration', 'underline');
                                _brCrdyncChild.css('cursor', 'pointer');
                            }
                            var lastFol = liLength - 1;
                            _brCrdync.children('li:eq(' + lastFol + ')').children('a').css('cursor', 'default');
                        }, 520);
                    }
                    if (RootFoldersandFiles.length) {
                        if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_ONLINE") {
                            $('#CFUploadFiles').parents(".fm").addClass('buttonDisable');
                        }
                    }

                },
                complete: function (xhr) {
                    if (xhr.status > 300) {
                        alertError("Operation Failed");
                        $('CFShowLoading').css('display', 'none');
                    }
                }
            });
        }
    },
	
	    searchAllRootFoldersAndFiles: function (idofCloud,parentId,searchTerm) {
        
       var _url = apicallurl+"/move/consumer/search/"+idofCloud+"?parent="+parentId+"&searchTerm="+encodeURIComponent(searchTerm)+"&pageSize=10";
            $.ajax({
                type: "GET",
                url: _url,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (RootFoldersandFiles) { 
				if(RootFoldersandFiles.length == 0){
					alertSuccess("No such file(s)/folder(s) found");
				}
                    var destbackId, destbackPrevId;
                    var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                    var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
					if(!(_srcCldName === "BOX")){
				_scroll = false;
				_scrolll = false;
				}
                    var _check = sessionStorage.getItem("source");
                    if ((((_srcCldName == "DROP_BOX" && _check == "source") || (_srcCldName == "ONEDRIVE" && _check == "source") || (_srcCldName == "G_DRIVE" && _check == "source") || (_srcCldName == "SHARED_DRIVES" && _check == "source") || (_srcCldName == "BOX" && _check == "source") || (_srcCldName == "GOOGLE_STORAGE" && _check == "source") || (_srcCldName == "AZURE_OBJECT_STORAGE" && _check == "source") || (_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source") || (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") || (_srcCldName === "AMAZON" && _check === "source")) && (RootFoldersandFiles.length)) || (((_dstnCldName == "DROP_BOX" && _check == "destination") || (_dstnCldName == "ONEDRIVE" && _check == "destination") || (_dstnCldName == "G_DRIVE" && _check == "destination") || (_dstnCldName == "SHARED_DRIVES" && _check == "destination") || (_dstnCldName == "BOX" && _check == "destination") || (_dstnCldName == "GOOGLE_STORAGE" && _check == "destination") || (_dstnCldName == "AZURE_OBJECT_STORAGE" && _check == "destination") || (_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination") || (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") || (_dstnCldName === "AMAZON" && _check === "destination")) && (RootFoldersandFiles.length))) {
                        if (moveCheckSum == 'source' && (PageName == 'move' || PageName == 'back' || PageName == 'scrollDown')) {
                            if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") {
                                $("#moveSource").attr("srcNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveSource").attr("srcNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }

                        }
                        if (moveCheckSum == 'dest' && (PageName == 'move' || PageName == 'back' || PageName == 'scrollDown')) {
                            if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                $("#moveDestination").attr("dstnNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveDestination").attr("dstnNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }
                        }
                        if (moveCheckSum == 'source' && (PageName == 'innermove' || PageName == 'scrollDown')) {
                            if (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") {
                                $("#moveSource").attr("innerSrcNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveSource").attr("innerSrcNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                //localStorage.setItem("_scrollSrcTokenVal1",RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollSrcTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }
                        }
                        if (moveCheckSum == 'dest' && (PageName == 'innermove' || PageName == 'scrollDown')) {
                            if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                $("#moveDestination").attr("innerDstnNextPageToken", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[RootFoldersandFiles.length - 1].nextPageToken);
                            } else {
                                $("#moveSource").attr("innerDstnNextPageToken", RootFoldersandFiles[0].nextPageToken);
                                //localStorage.setItem("_scrollDstnTokenVal1",RootFoldersandFiles[0].nextPageToken);
                                localStorage.setItem("_scrollDstnTokenVal", RootFoldersandFiles[0].nextPageToken);
                            }
                        }
                    } else if (RootFoldersandFiles.length == 0 && moveCheckSum == 'source') {
                        localStorage.removeItem("_scrollSrcTokenVal");

                    }
                    else if (RootFoldersandFiles.length == 0 && moveCheckSum == 'dest') {

                        localStorage.removeItem("_scrollDstnTokenVal");
                    }

                    var fileName = ['All Files', 'My Drive', 'SkyDrive', '', 'My Files & Folders', 'cloudian', ""];
                    /*if(isProd){
                     fileName.push('CloudFuze');
                     }else{
                     fileName.push('Cloudfuze Dev');
                     }*/
                    var type = '';
                    if (PageName == 'move' || PageName == 'innermove' || PageName == 'back' || PageName == 'scrollDown') {
                        // $('#spinner2').hide();
                        $("#CFShowLoading").css("display", "none");
                        if (RootFoldersandFiles.length != 0 && RootFoldersandFiles[0].parentFileRef == null && RootFoldersandFiles[0].cloudName !== "SHAREPOINT_CONSUMER_HYBRID") {
                            var _a = ["AMAZON", "SALES_FORCE", "DOCUMENTUM", "CLOUDIAN", "CENTURYLINK"];

                            if ($.inArray(RootFoldersandFiles[0].cloudName, _a) > -1) {
                                if (moveCheckSum == 'dest') {
                                    $("#move-header").find("#dynamicDestCloudName").attr('fid', RootFoldersandFiles[0].parent);
                                }
                            }
                            type = 'getClouds';
                        } else if (RootFoldersandFiles.length == 0) {
                            var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                            var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
                            var _check = sessionStorage.getItem("source");
                        if((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source") || (_srcCldName == "SHARED_DRIVES" && _check == "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")){
                                var fileDetails = CFHPlistview.getFileDetails(SinglePId, SingleCloudId);
                            } else
                                var fileDetails = CFHPlistview.getFileDetails(SinglePId, SingleCloudId);

                            if (fileDetails == undefined || fileDetails == null || fileDetails == "") {
                                if (moveCheckSum == 'source') {
                                    var _srcShowMore = $("#moveSource").siblings("#movePageShowMore"); 
                                    _srcShowMore.hide(); 
                                    _srcShowMore.attr('movepagenumber', '-1');
                                    if (SinglePId == 0) {
                                        $("#moveSource").html('');
                                        $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top: 1%;margin-right: -9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-src" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                                        CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
												$("#moveSource").find('#autocomplete').val(srcInpVal);
                                    }
                                } 
                                if (moveCheckSum == 'dest') {
                                    var _destShowMore = $("#moveDestination").siblings("#movePageShowMore");
                                    _destShowMore.hide();
                                    _destShowMore.attr('movepagenumber', '-1')
                                    if (SinglePId == 0) {
                                        $("#moveDestination").html('');
                                        $("#moveDestination").append('<div data-type="destback" style="width: 50%;cursor:pointer;height:30px;padding: 2%;margin-bottom: 2%;" name="' + name + '" id="getClouds" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top: 0.5%;margin-right: -15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-dstn" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                                        CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);
												$("#moveDestination").find('#autocomplete').val(destInpVal);
                                    }
                                }
                                return false;
                            }
                            if (moveCheckSum == 'dest') {
                                $("#move-header").find("#dynamicDestCloudName").attr('fid', fileDetails.id);
                            }
                            if ($.inArray(fileDetails.objectName, fileName) > -1) {
                                type = 'getClouds';
                            } else {
                                type = fileDetails.parent;
                                if (type == null && ((_srcCldName === "DROP_BOX" && _check === "source") || (_srcCldName === "ONEDRIVE" && _check === "source") || (_srcCldName === "G_DRIVE" && _check === "source") || (_srcCldName === "BOX" && _check === "source") || (_srcCldName === "GOOGLE_STORAGE" && _check === "source") || (_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source") || (_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source") || (_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source") || (_srcCldName === "AMAZON" && _check === "source") || (_dstnCldName === "DROP_BOX" && _check === "destination") || (_dstnCldName === "ONEDRIVE" && _check === "destination") || (_dstnCldName === "G_DRIVE" && _check === "destination") || (_dstnCldName === "BOX" && _check === "destination") || (_dstnCldName === "GOOGLE_STORAGE" && _check === "destination") || (_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination") || (_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination") || (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") || (_dstnCldName === "AMAZON" && _check === "destination"))) {
                                    /*if(type == null && ((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination"))){ */
                                    if (_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination") {
                                        if ($('[data-type="destback"]').attr('id') == undefined) {
                                            type = 'getClouds';
                                        } else if (PageName === "back")
                                            type = $('[data-type="destback"]').attr('id');
                                        else
                                            type = $('#moveDestination .list-group-item.dropabbleParent.ui-droppable').attr('dstnparent');
                                        destbackId = $('[data-type="destback"]').attr('previousParentId');
                                        destbackPrevId = $('#moveDestination .list-group-item.dropabbleParent.ui-droppable').attr('id');
                                    } else
                                        type = 'getClouds';
                                }
                            }
                        } else {
                            if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_CONSUMER_HYBRID") {
                                if (RootFoldersandFiles[0].parent.split(':')[RootFoldersandFiles[0].parent.split(':').length - 1] == "SITE")
                                    sharepointListId = RootFoldersandFiles[0].parent;
                                if ($('[data-type="destback"]').attr('id') == undefined)
                                    type = 'getClouds';
                                else if ($('[data-type="destback"]').attr('id') == '/' && PageName == "back")
                                    type = 'getClouds';
                                else {
                                    var prevLen = RootFoldersandFiles[0].previousParentIds.split('*').length - 2;
                                    var prev = RootFoldersandFiles[0].previousParentIds.split('*')[prevLen];
                                    type = prev;
                                }
                            } else {
                                var type1 = RootFoldersandFiles[0].parentFileRef;
                                if ($.inArray(type1.objectName, fileName) > -1 && type1.parentFileRef == null) {
                                    type = 'getClouds';
                                    if (moveCheckSum == 'dest') {
                                        $('#dynamicDestCloudName').attr('check', 'droot');
                                        $("#move-header").find("#dynamicDestCloudName").attr('fid', type1.id);
                                    }
                                } else if (moveCheckSum == 'dest') {
                                    type = type1.parent;
                                    $("#move-header").find("#dynamicDestCloudName").attr('fid', type1.id);
                                } else if (moveCheckSum == 'source') {
                                    type = type1.parent;
                                }
                            }
                        }
                        if (moveCheckSum == 'source' && PageNumber == 1) {
                            $("#moveSource").html('');
                            $("#moveSource").append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px;padding:2%;margin-bottom:2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 10%;margin-top:1%;margin-right:-9%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-src" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>');
							$("#moveSource").find('#autocomplete').val(srcInpVal);
						}
                        if (moveCheckSum == 'dest' && PageNumber == 1) {
                            $("#moveDestination").html('');
                            $("#moveDestination").append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px;padding:2%;margin-bottom:2%;" name="' + name + '" id="' + type + '" cid="' + SingleCloudId + '"><i style="width:20%;float: left;display: block;font-size: 18px;margin-left: 5%;margin-top:0.5%;margin-right:-15%;" class="lnil lnil-arrow-left-circle cf-back"></i><span>Back</span></div><div class="custom-search-input-dstn" style="width: 54%;height: 5vh;padding: 5px;position:relative;margin-left: 3%;float: right;margin-top: -7%;"><input type="text" placeholder="Search Files/Folders" style="width: 89%;height: 5vh;border-radius: 3px;border: 2px solid #0062FF;" id="autocomplete" autocomplete="off" class=""><button type="button" style="background: white;position: absolute;height: 4vh;left: 78%;border-radius: 3px;border: none;top: 25%;outline:none;"><i class="fa fa-search" title="Search" style="color: #0062FF;font-size:14px;"></i></button></div>')
                            $("#moveDestination").find('#autocomplete').val(destInpVal);
							if (RootFoldersandFiles.length) {
                                $("#move-header").find("#dynamicDestCloudName").attr('fid', RootFoldersandFiles[0].parent); 
                                if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_CONSUMER_HYBRID") {
                                    $('[data-type="destback"]').attr('previousParentId', RootFoldersandFiles[0].previousParentIds);
                                }
                            } else {
                                $('[data-type="destback"]').attr('previousParentId', destbackId + '*' + destbackPrevId);

                            }
                        }
                    }
                    CFManageCloudAccountsAjaxCall.getAllFileNames(RootFoldersandFiles, PageNumber);

                    if (PageName != 'move') {
                        if (RootFoldersandFiles.length == 0) {
                            InnerCloudId = [];
                            InnerFolderId = [];
                            setTimeout(function () {
                                var _brcrdyncFchild;

                                if (moveCheckSum == 'source') {
                                    _brcrdyncFchild = $('#breadCrumbdyncmove > :nth-child(2)');
                                } else {
                                    _brcrdyncFchild = $('#breadCrumbdyncmovedest > :nth-child(2)');
                                }

                                _brcrdyncFchild.nextAll().remove();
                                //var fileObj = CFHPlistview.getFileDetails(fid);
                                //   var fileObject = CFHPlistview.getFileDetails(SinglePId);
                                var fileCount = 0;
                                do {
                                    //var fileName = ['All Files', 'My Drive', 'SkyDrive', "", 'My Files & Folders', 'cloudian'];
                                    if (fileObject != undefined && fileObject != null) {
                                        if (fileObject.directory == true) {
                                            InnerCloudId.push(fileObject.cloudId);
                                            InnerFolderId.push(fileObject.id);
                                        }
                                        if (fileObject.parentFileRef != undefined || fileObject.parentFileRef != null) {
                                            if ($.inArray(fileObject.objectName, fileName) < 0) {
                                                _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject.id + '"' +
                                                    'class="BCRFList" cloudid="' + fileObject.cloudId + '">' +
                                                    '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject.objectName + '</a></li>');
                                                fileObject = fileObject.parentFileRef;
                                                fileCount = fileCount + 1;
                                            }
                                        } else if ($.inArray(fileObject.objectName, fileName) < 0) {
                                            _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject.id + '"' +
                                                'class="BCRFList" cloudid="' + fileObject.cloudId + '">' +
                                                '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer">' + fileObject.objectName + '</a></li>');
                                            break;
                                        }
                                        if ($.inArray(fileObject.objectName, fileName) > -1) {
                                            fileCount = 5;
                                        }
                                    } else {
                                        fileCount = 5;
                                    }
                                } while (fileCount < 5);
                            }, 500);
                        } else {
                            var _brcrdyncFchild;//$("#breadCrumbdyncmove").find("li:first-child");

                            if (moveCheckSum == 'source') {
                                _brcrdyncFchild = $('#breadCrumbdyncmove > :nth-child(2)');
                            } else {
                                _brcrdyncFchild = $('#breadCrumbdyncmovedest > :nth-child(2)');
                            }
                            _brcrdyncFchild.nextAll().remove();
                            var fileObject = RootFoldersandFiles;
                            var fileCount = 0;
                            var test = [];
                            InnerCloudId = [];
                            InnerFolderId = [];
                            do {
                                test = [];
                                if (fileObject[0].parentFileRef != undefined || fileObject[0].parentFileRef != null) {
                                    if (fileCount > 0) {
                                        if (fileObject[0].directory == true) {
                                            InnerCloudId.push(fileObject[0].cloudId);
                                            InnerFolderId.push(fileObject[0].id);
                                        }
                                        if ($.inArray(fileObject.objectName, fileName) < 0) {
                                            _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject[0].id + '" class="BCRFList" cloudid="' + fileObject[0].cloudId + '"><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject[0].objectName + '</a></li>');
                                        }
                                        if ($.inArray(fileObject.objectName, fileName) > 0) {
                                            fileCount = 5;
                                        }
                                    }
                                    fileObject = fileObject[0].parentFileRef;
                                    test.push(fileObject);
                                    fileObject = test;
                                    fileCount = fileCount + 1;
                                } else {
                                    fileCount = fileCount + 1;
                                    if (fileObject[0].directory == true) {
                                        InnerCloudId.push(fileObject[0].cloudId);
                                        InnerFolderId.push(fileObject[0].id);
                                        if ($.inArray(fileObject[0].objectName, fileName) > 0) {
                                            fileCount = 5;
                                        }
                                    }
                                    if ($.inArray(fileObject[0].objectName, fileName) < 0) {
                                        _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject[0].id + '" class="BCRFList" cloudid="' + fileObject[0].cloudId + '"><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject[0].objectName + '</a></li>');
                                        break;
                                    }
                                    if ($.inArray(fileObject[0].objectName, fileName) > -1) {
                                        fileCount = 5;
                                    }
                                }
                            } while (fileCount < 5);
                        }
                        setTimeout(function () {
                            var _brCrdync;
                            if (moveCheckSum == 'source') {
                                _brCrdync = $("#breadCrumbdyncmove");
                            } else {
                                _brCrdync = $("#breadCrumbdyncmovedest");
                            }
                            var liLength = _brCrdync.children('li').length;
                            var _brCrdyncChild;

                            for (var i = 0; i < liLength - 1; i++) {
                                _brCrdyncChild = _brCrdync.children("li:eq(" + i + ")").children("a");
                                _brCrdyncChild.css('color', 'blue');
                                _brCrdyncChild.css('text-decoration', 'underline');
                                _brCrdyncChild.css('cursor', 'pointer');
                            }
                            var lastFol = liLength - 1;
                            _brCrdync.children('li:eq(' + lastFol + ')').children('a').css('cursor', 'default');
                        }, 520);
                    }
                    if (RootFoldersandFiles.length) {
                        if (RootFoldersandFiles[0].cloudName === "SHAREPOINT_ONLINE") {
                            $('#CFUploadFiles').parents(".fm").addClass('buttonDisable');
                        }
                    }

                },
                complete: function (xhr) {
                    if (xhr.status > 300) {
                        alertError("Operation Failed");
                        $('CFShowLoading').css('display', 'none');
                    }
                }
            });
        
    },
    getAllHomeFolders: function (PageNumber) {
        $.ajax({
            type: "GET",
            url: apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/all?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + PageNumber + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=&isAllFiles=" + urlParameterObject.isAllFiles,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (Folders) {
                CFManageCloudAccountsAjaxCall.getAllFileNames(Folders, PageNumber);
            },
            complete: function (xhr) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: 2000});
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                    $('#spinner1').addClass('divdisplay');
                }
            }
        });
    },
    gotoInnerFolderandFiles: function (cid, fid, pgn, fileshareUrl, sharedFolderId, sharedPassword) {
        PageNumber = pgn;
        var apiUrl = apicallurl + "/filefolder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "/childfolders/" + cid + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&page_nbr=" + pgn + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&folderId=" + encodeURIComponent(fid) + "&isAllFiles=" + urlParameterObject.isAllFiles;
        if (sharedFolderId != undefined) {
            apiUrl = apiUrl + "&sharedFolderId=" + sharedFolderId;
        }
        if (sharedPassword != undefined) {
            apiUrl = apiUrl + "&sharePassword=" + sharedPassword;
        }
        var _share = $('#sharePasswordModel'),
            breadCrumb = $("#breadCrumbdync");
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (gotoInnerFolderandFiles) {
                _share.modal('hide');
                _share.find('input').val('');
                CFManageCloudAccountsAjaxCall.getAllFileNames(gotoInnerFolderandFiles, pgn, fileshareUrl, sharedFolderId);
                var fileName = ['All Files', 'My Drive', 'SkyDrive', '', 'My Files & Folders', 'cloudian', ""];
                /*if(isProd){
                 fileName.push('Cloudfuze');
                 }else{
                 fileName.push('Cloudfuze Dev');
                 }*/
                var fileObj;
                if (previousPage == "Share with Me") {
                    fileObj = CFHPlistview.getFileDetails(SinglePId, cid);
                    if (fileObj.id != undefined && fileObj.id != sharedFolderId && fileshareUrl != "back") {
                        breadCrumb.append('<li style="cursor:pointer;" id="' + fileObj.id + '" class="BCRFList" cloudid="' + fileObj.cloudId + '">' +
                            '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span>' +
                            '<a style="cursor:pointer;">' + fileObj.objectName + '</a></li>');
                    }
                    else if (fileObj.parentFileRef == null && fileshareUrl == "forword") {
                        breadCrumb.append('<li style="cursor:pointer;" id="' + fileObj.id + '" class="BCRFList" cloudid="' + fileObj.cloudId + '">' +
                            '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span>' +
                            '<a style="cursor:pointer;">' + fileObj.objectName + '</a></li>');
                    }
                    else if (fileObj.parentFileRef != null && fileshareUrl == "forword") {
                        breadCrumb.append('<li style="cursor:pointer;" id="' + fileObj.id + '" class="BCRFList" cloudid="' + fileObj.cloudId + '">' +
                            '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span>' +
                            '<a style="cursor:pointer;">' + fileObj.objectName + '</a></li>');
                    }
                }
                else if (previousPage == "Share by Me") {
                    fileObj = CFHPlistview.getFileDetails(SinglePId, cid);
                    if (fileshareUrl != "back") {
                        breadCrumb.append('<li style="cursor:pointer;" id="' + fileObj.id + '" class="BCRFList" cloudid="' + fileObj.cloudId + '">' +
                            '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span>' +
                            '<a style="cursor:pointer;">' + fileObj.objectName + '</a></li>');
                    }
                }
                else if (gotoInnerFolderandFiles.length == 0) {
                    InnerCloudId = [];
                    InnerFolderId = [];
                    setTimeout(function () {
                        var _brcrdyncFchild = breadCrumb.find("li:first-child");
                        _brcrdyncFchild.nextAll().remove();
                        //var fileObj = CFHPlistview.getFileDetails(fid);
                        var fileObject = CFHPlistview.getFileDetails(fid);
                        var fileCount = 0;
                        do {
                            //var fileName = ['All Files', 'My Drive', 'SkyDrive', "", 'My Files & Folders', 'cloudian'];
                            if (fileObject != undefined || fileObject != null) {
                                if (fileObject.directory == true) {
                                    InnerCloudId.push(fileObject.cloudId);
                                    InnerFolderId.push(fileObject.id);
                                }
                                if (fileObject.parentFileRef != undefined || fileObject.parentFileRef != null) {
                                    if ($.inArray(fileObject.objectName, fileName) < 0) {
                                        _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject.id + '"' +
                                            'class="BCRFList" cloudid="' + fileObject.cloudId + '">' +
                                            '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject.objectName + '</a></li>');
                                        fileObject = fileObject.parentFileRef;
                                        fileCount = fileCount + 1;
                                    }
                                }
                                else if ($.inArray(fileObject.objectName, fileName) < 0) {
                                    _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject.id + '"' +
                                        'class="BCRFList" cloudid="' + fileObject.cloudId + '">' +
                                        '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer">' + fileObject.objectName + '</a></li>');
                                    break;
                                }
                                if ($.inArray(fileObject.objectName, fileName) > -1) {
                                    fileCount = 5;
                                }
                            }
                            else{
                                fileCount = 5;
                            }
                        } while (fileCount < 5);
                    }, 500);
                }
                else {
                    var _brcrdyncFchild = $("#breadCrumbdync").find("li:first-child");
                    _brcrdyncFchild.nextAll().remove();
                    var fileObject = gotoInnerFolderandFiles;
                    var fileCount = 0;
                    var test = [];
                    InnerCloudId = [];
                    InnerFolderId = [];
                    do {
                        test = [];
                        if (fileObject[0].parentFileRef != undefined || fileObject[0].parentFileRef != null) {
                            if (fileCount > 0) {
                                if (fileObject[0].directory == true) {
                                    InnerCloudId.push(fileObject[0].cloudId);
                                    InnerFolderId.push(fileObject[0].id);
                                }
                                if ($.inArray(fileObject.objectName, fileName) < 0) {
                                    _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject[0].id + '" class="BCRFList" cloudid="' + fileObject[0].cloudId + '"><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject[0].objectName + '</a></li>');
                                }
                                if ($.inArray(fileObject.objectName, fileName) > 0) {
                                    fileCount = 5;
                                }
                            }
                            fileObject = fileObject[0].parentFileRef;
                            test.push(fileObject);
                            fileObject = test;
                            fileCount = fileCount + 1;
                        } else {
                            fileCount = fileCount + 1;
                            if (fileObject[0].directory == true) {
                                InnerCloudId.push(fileObject[0].cloudId);
                                InnerFolderId.push(fileObject[0].id);
                                if ($.inArray(fileObject[0].objectName, fileName) > 0) {
                                    fileCount = 5;
                                }
                            }
                            if ($.inArray(fileObject[0].objectName, fileName) < 0) {
                                _brcrdyncFchild.after('<li style="cursor:pointer;" id="' + fileObject[0].id + '" class="BCRFList" cloudid="' + fileObject[0].cloudId + '"><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a style="cursor:pointer;">' + fileObject[0].objectName + '</a></li>');
                                break;
                            }
                            if ($.inArray(fileObject[0].objectName, fileName) > -1) {
                                fileCount = 5;
                            }
                        }
                    } while (fileCount < 5);
                }
                setTimeout(function () {
                    var _brCrdync = $("#breadCrumbdync");
                    var liLength = _brCrdync.children('li').length;
                    var _brCrdyncChild;
                    for (var i = 0; i < liLength - 1; i++) {
                        _brCrdyncChild = _brCrdync.children("li:eq(" + i + ")").children("a");
                        _brCrdyncChild.css('color', 'blue');
                        _brCrdyncChild.css('text-decoration', 'underline');
                        _brCrdyncChild.css('cursor', 'pointer');
                    }
                    var lastFol = liLength - 1;
                    _brCrdync.children('li:eq(' + lastFol + ')').children('a').css('cursor', 'default');
                }, 520);
                var test = $("#CloudDriveList").find(".catactive").closest(".clsubmenu").attr('id');
                var array = ["EGNYTE_STORAGE"];
                if ($.inArray(test, array) > -1) {
                    var testId = fid.split('/');
                    var len = testId.length;
                    if (testId[2] == "Private") {
                        $('#CFUploadFiles').parent().addClass('buttonDisable');
                    }
                    else if (testId.length == 3 && testId[2] == "Shared") {
                        $('#CFUploadFiles').parent().addClass('buttonDisable');
                    }
                }
                if(test == "SHAREPOINT_ONLINE")
                {
                    if(PageName == "SharepointSite")
                        $('#CFUploadFiles').parents(".fm").addClass('buttonDisable');
                    else
                        $('#CFUploadFiles').parents(".fm").removeClass('buttonDisable');

                }
            },
            complete: function (xhr, statusText) {
                $('#' + viewTrack + '').trigger('click');
                $('#CFSharePwdButton').removeClass('disable');
                if (xhr.status == 401) {
                    _share.find("input").val('');
                    _share.modal("show");
                    _share.find('.button.blue').removeClass('buttonDisable');
                    setTimeout(function () {
                        _share.find("input").focus();
                    }, 2);
                } else if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getRecentFilesandFolders: function (PageNumber) {
        var apiUrl = apicallurl + '/filefolder/user/' + CFManageCloudAccountsAjaxCall.getUserId() + '/cloud/all?page_size=50&fetchCollabInfo=' + urlParameterObject.fetchCollabInfo + '&isAscen=' + urlParameterObject.isAscen + '&orderField=' + urlParameterObject.orderField + '&page_nbr=' + PageNumber + '';
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (RecentFiles) {
                CFManageCloudAccountsAjaxCall.getAllFileNames(RecentFiles, PageNumber);
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    createFolder: function (SingleCloudId, SinglePId, FolderName) {
        var _ab = false;
        //var renameReg = /(%)/;
        //if (renameReg.test(FolderName)) {
        //    $('#creating').addClass('divdisplay');
        //    $.smallBox({
        //        title: "% is not allowed in folder name.",
        //        color: "#e35e00",
        //        timeout: notifyTime,
        //        sound: false
        //    });
        //alertError("% is not allowed in folder name.");
        //    return false;
        //}
        // var renameReg = /[+]/;
        // if (renameReg.test(FolderName)) {
        //    $('#creating').addClass('divdisplay');
        //    $.smallBox({
        //        title: "+ is not allowed in folder name.",
        //        color: "#e35e00",
        //        timeout: notifyTime,
        //        sound: false
        //    });
        //alertError("% is not allowed in folder name.");
        //    return false;
        // }
        var sid;
        if (previousPage == "Share with Me") {
            sid = encodeURIComponent($('#breadCrumbdync').children('li:eq(1)').attr('id'));
        }
        else if (previousPage == "Share by Me") {
            sid = encodeURIComponent($('#breadCrumbdync').children('li:eq(1)').attr('id'));
        }
        if (sid == undefined || sid == "undefined") {
            sid = "";
        }
        var apiUrl = apicallurl + "/filefolder/create/folder/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?sharedFolderId=" + sid;
        var cloudId = SingleCloudId;
        var parentId = SinglePId;
        var checkboxName = "isSecure";
        var checkboxEncrypt = false;
        var boundary = '-----WebKitFormBoundary' + Math.floor(Math.random() * 32768) + Math.floor(Math.random() * 32768) + Math.floor(Math.random() * 32768);
        var parentname = "parentId";
        var NewName = FolderName;
        var foldername = "newName";
        var cloudName = "cloudId";
        var data = contactus_formfield(boundary, parentname, parentId);
        data += contactus_formfield(boundary, foldername, encodeURIComponent(NewName));
        data += contactus_formfield(boundary, cloudName, cloudId);
        data += contactus_formfield(boundary, checkboxName, checkboxEncrypt);
        data += boundary;
        function contactus_formfield(boundary, name, value) {
            var text = "";
            text += '--' + boundary + '\r\n' + 'Content-Disposition: form-data; name="';
            text += name;
            text += '"\r\n\r\n';
            text += value;
            text += '\r\n';
            return text;
        }

        $.ajax({
            type: "PUT",
            url: apiUrl,
            data: data,
            async: false,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            success: function (CreateFolder) {
                var objectName = CreateFolder.objectName;
                var objectSize = CreateFolder.objectSize;
                var cloudName = CreateFolder.cloudName;
                var cloudId = CreateFolder.cloudId;
                var fileId = CreateFolder.id;
                var parent = CreateFolder.parent;
                var fileExten = CreateFolder.objectExtn;
                var filetype1 = CreateFolder.directory;
                var filetype;
                if (filetype1 == false) {
                    filetype = "FILE"
                }
                if (filetype1 == true) {
                    filetype = "FOLDER"
                }
                var favourite = CreateFolder.favourite;
                var favouriteicon;
                if (favourite == true) {
                    favouriteicon = heartFill;
                } else if (favourite == false) {
                    favouriteicon = heart;
                }
                var userType = FilePer[0];
                var fileIcon = CFManageCloudAccountsAjaxCall.getFileIcon(fileExten, filetype);
                var dateCreated = CFManageCloudAccountsAjaxCall.getDateConversion(CreateFolder.createdTime);
                var dateModified = CFManageCloudAccountsAjaxCall.getDateConversion(CreateFolder.modifiedTime);
                if (PageName == "InnerFolders" || PageName == "CloudDrive") {
                    $("#ThumbnailContent").prepend('<div class="file ' + fileIcon + '" id="' + cloudId + '" style="cursor:pointer;" data-type=' + filetype + ' ><i title="' + objectName + '" class="filethumbnail" name="FOLDER"></i><strong class="filename" id="' + fileId + '" fexten="' + fileExten + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(objectName,14) + '</strong><div class="filesize">' + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div><input type="checkbox" class="fileCheck" /><a href="#" id="' + fileId + '"><!--i class="MetaDataIcon"></i--></a><i id="ThFav" class="' + favouriteicon + '" style="cursor:pointer;"></i></div>');
                    $("#LVContent").find(".panel-data:first").remove();
                    $("#LVContent").prepend('<div class="panel-data" id="' + parent + '" data-type=' + filetype + '><div  class="LVcheckBox" name="' + filetype + '"><input type="checkbox"/></div><div class="LVfileName" id="' + fileId + '" style="height:20px" name="' + filetype + '"><i class="LV' + filetype + ' pull-left"></i><p class="pull-left" name="' + objectName + '" fexten="' + fileExten + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(objectName,50) + '</p><a href="#" title=""><!--i class="MetaDataIcon"></i--></a></div><div class="LVFavorites"><a href="#" id="LVFavorite" class="' + favouriteicon + '"></a></div><div class="LVfileSize" style="cursor:pointer;">' + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div><div class="LVdrive" id="' + cloudId + '">' + CLName[cloudName] + '</div><div class="LVaddedDate">' + dateCreated + '</div><div class="LVmodifiedDate">' + dateModified + '</div></div>');

                    if (sharedFolderId != null && sharedFolderId != undefined)
                        var fileinfo1 = CFHPlistview.getFileShare(sharedFolderId);
                    if (previousPage == "Share with Me" && fileinfo1) {
                        $("#LVContent").children(".panel-data").attr('fileper', FilePer[0]);
                        $("#ThumbnailContent").children(".file").attr('fileper', FilePer[0]);
                    }


                } else if (PageName == "Favorites") {
                    $("#ThumbnailContent").find(".file:first").remove();
                    $("#ThumbnailContent").prepend('<div class="file ' + fileIcon + '" id="' + cloudId + '" style="cursor:pointer;" data-type=' + filetype + '><i title="' + objectName + '" class="filethumbnail" ></i><strong class="filename" id="' + fileId + '" fexten="' + fileExten + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(objectName,14) + '</strong><div class="filesize">' + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div><input type="checkbox" class="fileCheck" /><a href="#" id="' + fileId + '"><!--i class="MetaDataIcon"></i--></a><i id="ThFav" class="' + heartFill + '" style="cursor:pointer;"></i></div>');
                    $("#LVContent").find(".panel-data:first").remove();
                    $("#LVContent").prepend('<div class="panel-data" id="' + parent + '" data-type=' + filetype + '><div class="LVcheckBox" name="' + filetype + '"><input type="checkbox"/></div><div class="LVfileName" id="' + fileId + '" style="height:20px" name="' + filetype + '"><i class="LV' + filetype + ' pull-left"></i><p class="pull-left" name="' + objectName + '" fexten="' + fileExten + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(objectName,50) + '</p><a href="#" title=""><!--i class="MetaDataIcon"></i--></a></div><div class="LVFavorites"><a href="#" id="LVFavorite" class="' + heartFill + '"></a></div><div class="LVfileSize" style="cursor:pointer;">' + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div><div class="LVdrive" id="' + cloudId + '">' + CLName[cloudName] + '</div><div class="LVaddedDate">' + dateCreated + '</div><div class="LVmodifiedDate">' + dateModified + '</div></div>');
                    if (PageName == "Favorites") {
                        CFManageCategoryAjaxCall.addFavouriteFile(fileId);
                    }
                }
                $("#creating").addClass("divdisplay");
                $("#CFCreateFolder").prop('disabled', false);
                $("#mainContent").find(".FolderOk").remove();
                $("#mainContent").find(".FolderCancel").remove();
//				$('.LVHcheckBox input').prop("disabled",false);
                if (selectEvent != undefined && selectEvent != null) {
                    selectEvent.init();
                }
            },
            complete: function (xhr, statusText) {
                $('#creating').addClass('divdisplay');
                var text = xhr.getResponseHeader('exception');
                if (xhr.status == 406) {
                    renameObject = null;
                    if (text == "Can't be null or empty. Length must be 3 to 63 symbols..") {
                        // $.smallBox({
                        //     title: "Folder name must be between 3 to 63 characters",
                        //     color: "#1ba1e2",
                        //     timeout: notifyTime,
                        //     sound: false
                        // });
                        alertSuccess("Folder name must be between 3 to 63 characters");
                    } else {
                        //$.smallBox({title: text + ".", color: "#1ba1e2", timeout: notifyTime, sound: false});
                        alertSuccess(text);
                    }
                    $("#mainContent").find(".CFTHCreateFolder").css('border-color', 'red');
                }
                else if (xhr.status == 403) {
                    if (text != undefined || text != null || text != "") {
                        //$.smallBox({title: text, color: "#e35e00", timeout: notifyError, sound: false})
					alertError(text);
                    }
                }
                else if (xhr.status == 500) {
                    if (/Folder Unique Name: The Folder API Name/i.test(text)) {
                        var _a = "Folder name must begin with a letter, not include spaces, not end with an underscore," +
                            " and not contain two consecutive underscores.";
                        //$.smallBox({title: _a, color: "#1ba1e2", timeout: notifyTime, sound: false});
                        alertSuccess(_a);
                        $("#mainContent").find(".CFTHCreateFolder").css('border-color', 'red');
                    } else if (/Create folder operation failed/i.test(text)) {
                        //$.smallBox({title: text, color: "#1ba1e2", timeout: notifyTime, sound: false});
                        alertSuccess(text);
                        $("#mainContent").find(".CFTHCreateFolder").css('border-color', 'red');
                    }
                }
                else if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                    $("#mainContent").find(".CFTHCreateFolder").css('border-color', 'red');
                } else if (xhr.status == 200) {
                    _ab = true;
                    var _x = $('#secondary').find('.active').children('a').attr('id');
                    if (_x == 'CFSharedWithMe') {
                        $("#LVContent").find('.LVFavorites').addClass('buttonDisable');
                    }
                }
            }
        });
        return _ab;
    },
    searchFiles: function (searchTerm, PageNumber) {
        var apiUrl;
        if (previousPage == "Folders" || previousPage == "WorkSpace" || previousPage == "InnerWorkSpace") {
            return false;
        } else {
            apiUrl = apicallurl + "/filefolder/search/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_size=50&isAscen=false&fetchCollabInfo=true&orderField=modifiedTime&page_nbr=" + PageNumber + "&query=" + searchTerm;
        }
        $.ajax({
            url: apiUrl,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                // if(data.length < 1){
                //     return alertSuccess('No Search Results found.'); 
                // }else{
                //     CFManageCloudAccountsAjaxCall.getAllFileNames(data, PageNumber);
                // }

                if(data.length < 1){
                    $('#LVContent').html('');
                    $('#ThumbnailContent').html('');
                    $("#listShowMore").hide();
                    // hideCreateControls(true);
                    enableCrateControls1(true,true);


                    return alertSuccess('No Search Results found.');
                }else{
                    CFManageCloudAccountsAjaxCall.getAllFileNames(data, PageNumber);
                }
            }
        });
    },

    getWorkSpaceForaUser: function () {
        var apiUrl = apicallurl + "/workspace/user?isAscen=true";
        var ListViewChildCount = $('#LVContent').children('div').length;
        $("#LVContent > div").remove();
        $("#ThumbnailContent > div").remove();
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (workspace) {
                if (workspace.length == 0) {
                    $('#CFEditWorkSpace').hide();
                    $('#NoWorkspaces').show();
                } else {
                    $('#CFEditWorkSpace').show();
                    $('#NoWorkspaces').hide();
                }
                var _leftNav = $('#leftNav');
                _leftNav.html('');
                $.each(workspace, function (i, e) {
                    if (e.user != null) {
                        var workspaceName = e.workspaceName;
                        var workspaceId = e.id;
                        var type = e.type;
                        var filesCount = 0;
                        var foldersCount = 0;
                        var noofFilesLabel = "0 Folders, 0 Files";
                        var shareObjects = [];
                        var listLock;

                        if (e.files != null) {
                            $.each(e.files, function (i, sf) {
                                if (sf != null) {
                                    shareObjects.push(sf);
                                }
                            });
                            $.each(shareObjects, function (i, sobj) {
                                if (sobj != null) {
                                    if (sobj.directory == true) {
                                        foldersCount = foldersCount + 1;
                                    } else {
                                        filesCount = filesCount + 1;
                                    }
                                }
                            });

                            noofFilesLabel = foldersCount > 1 || foldersCount == 0 ? foldersCount + ' Folders, ' : foldersCount + ' Folder, ';

                            noofFilesLabel += filesCount > 1 || filesCount == 0 ? filesCount + ' Files ' : filesCount + ' File ';
                        }

                        if (e.password == "" || e.password == "NOT_REQUIRED" || e.password == "IGNORE_UPDATE") {
                            workspaceLock = "workspaceLockFalse";
                            listLock = "";
                        } else {
                            workspaceLock = "workspaceLockTrue";
                            listLock = "cf-locked";
                        }

                        var _left = '<li class="getFilesForWorkspace" title="' + workspaceName + '">' +
                            '<a href="#" id="' + workspaceId + '">' +
                            '<i class="cf-workspace" style="display: inline-block;margin:0"></i>' +
                            '<i style="font-size:13px" class="' + listLock + '"></i><span>' + workspaceName + '</span></a></li>';

                        var _thumb = '<div class="file ' + type + '" name="Workspace" style="cursor:pointer;position:relative">' +
                            '<span class="badge" style="display: none;position: absolute;right: 3px;top: 3px;background: #dc0d17;color: #fff;" ' +
                            'id="notify_file_count"></span>' +
                            '<i title="' + workspaceName + '" class="filethumbnail cf-workspace wsIcon" name="Workspace"></i>' +
                            '<strong class="filename" id="' + workspaceId + '" name="' + workspaceName + '" fexten="null">'
                            + CFManageCloudAccountsAjaxCall.getMaxChars(workspaceName,14) + '</strong>' +
                            '<div class="filesize"> ' + noofFilesLabel + '</div><input type="checkbox" class="fileCheck" />' +
                            '<p href="#" id="' + workspaceId + '"></p><i style="cursor:pointer;" id="wsLock" class="' + workspaceLock + '"></i>' +
                            '</div>';

                        _leftNav.append(_left);

                        $('#ThumbnailContent').append(_thumb);
                    }
                });
                $('#spinner1').addClass('divdisplay');
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
        if (selectEvent != undefined && selectEvent != null) {
            selectEvent.init();
        }
    },
    getSharefileUsername: function (email) {
        var apiUrl = apicallurl + "/users/all";
        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            dataType: 'json',
            success: function (userData) {
                if (userData != "") {
                    bl1:{
                        for (var i = 0; i < userData.length; i++) {
                            if (userData[i].primaryEmail == email) {
                                $('#shareENames').append("<i><span class='label label-default' style='float:left;'>" + userData[i].userName + "<i class='removeTag1'></i></span></i>");
                                sharemailsUnames[email] = userData[i].userName;
                                break bl1;
                            }
                        }
                        sharemailsUnames[email] = email;
                        $('#shareENames').append("<i><span class='label label-default' style='float:left;'>" + email + "<i class='removeTag1'></i></span></i>");
                    }
                    $('#shareFiles .statusMesg').text('');
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getShareUseremail: function (username) {
        var apiUrl = apicallurl + "/users/all";
        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            dataType: 'json',
            success: function (userData) {
                if (userData != "") {
                    bl1:{
                        for (var i = 0; i < userData.length; i++) {

                            var email = userData[i].primaryEmail;
                            var pcount = $('.addShareContent').find('#addUsersToShare').children('p').length;
                            for (var j = 0; j < pcount; j++) {
                                var currentRow = $('.addShareContent').find('#addUsersToShare').children('p:eq(' + j + ')');
                                if (email == currentRow.children('span').text()) {
                                    currentRow.html('');
                                    break bl1;
                                }
                                if (username == currentRow.children('span').text()) {
                                    currentRow.html('');
                                    break bl1;
                                }
                            }
                        }
                    }
                    $("#shareFiles").find(".statusMesg").text('');
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getFilesForaWorkSpace: function (WorkSpaceId, PageNumber) {
        var apiUrl = apicallurl + "/workspace/info/" + WorkSpaceId;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (WSInfo) {
                $('#workspaceFiles').html('');
                var ShareObjects = [];
                var Files = [];
                var filetype = '12';
                PageNumber = 1;
                if (WSInfo.shares != null) {
                    $.each(WSInfo.shares, function (i, WSShare) {
                        ShareObjects.push(WSShare);
                    });
                    $.each(ShareObjects, function (i, sobj) {
                        if (sobj.file != null) {
                            Files.push(sobj.file);
                        }
                    });
                }
                $.each(Files, function (i, file) {
                    var filetype1 = file.directory;
                    var filetype;
                    var fileClass = "";
                    if (filetype1 == false) {
                        filetype = "FIL";
                        fileClass = "sorting_1";
                    }
                    if (filetype1 == true) {
                        filetype = "FOLDER";
                        fileClass = "folder";
                    }
                    $('#workspaceFiles').append('<tr class="gradeA"><td class="wsfcheckbox" style="width:32px"><input type="checkbox" /></td><td class="' + fileClass + '" style="cursor:pointer;" name=' + filetype1 + ' cloudid=' + file.cloudId + '  id=' + file.id + ' title="' + file.objectName + '">' + file.objectName + '</td><td class=" ">' + CFManageCloudAccountsAjaxCall.getObjectSize(file.objectSize, filetype) + '</td><td class=" ">' + CFManageCloudAccountsAjaxCall.getDateConversion(file.modifiedTime) + '</td></tr>');
                });
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
        var pagename = PageName;
        if (pagename == "InnerWorkSpace" || pagename == "Share with Me") {
            $('#LVHeader').children('.LVHFavorites').hide();
            $("#mainContent").find(".LVcheckBox").find('input:checkbox').each(function () {
                $("#mainContent").find(".LVFavorites").hide();
            });
            $("#mainContent").find(".file").find('input:checkbox').each(function () {
                $("#mainContent").find(".file").find('input:checkbox').prop('checked', false);
                $(".container").find(".cf-heart32").hide();
            });
        }
    },
    deleteFile: function (fileId) {
        apiUrl = apicallurl + "/filefolder/delete?fileId=" + fileId;
        $.ajax({
            type: "DELETE",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (DeleteFile) {
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 204) {
                    unCheckFile();
                    $('#LVContent .LVfileName[id="' + fileId + '"]').parent('.panel-data').remove();
                    $('#LVContent .panel-data[id="' + fileId + '"]').each(function () {
                        $(this).remove();
                    });
                    $('#ThumbnailContent strong[id="' + fileId + '"]').parent('.file').remove();
                    $('#ThumbnailContent .file[id="' + fileId + '"]').each(function () {
                        $(this).remove();
                    });
                    if ($('#LVContent').children('div').length == 0) {
                        $('.LVHcheckBox input').prop("disabled", true);
                    }
                }
                else if (xhr.status == 406 || xhr.status == 404) {
                    var ex = xhr.getResponseHeader('exception');
                    var text = "The requested file might have deleted or moved from the Cloud . Please verify.";
                    if (ex == "Delete not accepting") {
                        text = "Folder delete is not allowed in WebDav.";
                    }
                    else if (ex == "Delete is not allowed for SalesForce") {
                        text = ex;
                    }
                    //$.smallBox({title: text, color: "#e35e00", timeout: notifyError});
                    alertError(text);
                }
                else if (xhr.status > 300) {
                    unCheckFile();
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
                $('#deleting').addClass("divdisplay");
                $('#spinner2').addClass("divdisplay");
            }
        });
    },
    getUsername: function (email) {
        var apiUrl = apicallurl + "/users/all";
        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            dataType: 'json',
            success: function (userData) {
                if (userData != "") {
                    bl1:{
                        for (var i = 0; i < userData.length; i++) {
                            if (userData[i].primaryEmail == email) {
                                $('#userDataWS').removeClass('divdisplay');
                                $('#userDataWS').append("<i><span class='label label-default' style='float:left;'>" + userData[i].userName + "<i class='removeTag1'></i></span></i>");
                                mailsUnames[email] = userData[i].userName;
                                break bl1;
                            }
                        }
                        mailsUnames[email] = email;
                        $('#userDataWS').append("<i><span class='label label-default' style='float:left;'>" + email + "<i class='removeTag1'></i></span></i>");
                    }
                    $('#Msg .statusMesg').text('');
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getUseremail: function (username) {
        var apiUrl = apicallurl + "/users/all";
        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            dataType: 'json',
            success: function (userData) {
                if (userData != "") {
                    bl1:{
                        for (var i = 0; i < userData.length; i++) {
                            var email = userData[i].primaryEmail;
                            var pcount = $('.addWorkspaceContent').find('#addUsers').children('p').length;
                            for (var j = 0; j < pcount; j++) {
                                var currentRow = $('.addWorkspaceContent').find('#addUsers').children('p:eq(' + j + ')');
                                if (email == currentRow.children('span').text()) {
                                    currentRow.remove();
                                    break bl1;
                                }
                                if (username == currentRow.children('span').text()) {
                                    currentRow.remove();
                                    break bl1;
                                }
                            }
                        }
                    }
                    $('#Msg .statusMesg').text('');
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    addFilesToWorkspace: function (wsId, fileId) {
        var fileIds = '';
        if (typeof fileId == "object" || typeof fileId == Array) {
            for (var i = 0; i < fileId.length; i++) {
                fileIds += 'fileId=' + encodeURIComponent(fileId[i]) + '&';
            }
        } else {
            fileIds = "fileId=" + fileId;
        }
        var apiUrl = apicallurl + "/workspace/addFiles/" + wsId + "?" + fileIds + "&domainUrl=" + domainUrl + "publicNew";
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (AllClouds) {
                if (PageName == 'InnerWorkSpace') {
                } else {
                    unCheckFile();
                    // $.smallBox({
                    //     title: "File(s) added to workspace successfully.",
                    //     color: "#1ba1e2",
                    //     timeout: notifyTime
                    // });
                    alertSuccess("File(s) added to workspace successfully.");
                    $('#workspaceAct').html('');
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 403) {
                    unCheckFile();
                    // $.smallBox({
                    //     title: "You have only view permission.You can't add to files this workspace.",
                    //     color: "#1ba1e2",
                    //     timeout: notifyTime
                    // });
                    alertSuccess("You have only view permission.You can't add to files this workspace.");
                }
            }
        });
    },
    deleteWorkspaceFile: function (wsId, fileId) {
        var wdid = encodeURIComponent(fileId);
        var fileIds = '';
        if (typeof fileId == "object" || typeof fileId == Array) {
            for (var i = 0; i < fileId.length; i++) {
                fileIds += 'fileId=' + encodeURIComponent(fileId[i]) + '&';
            }
        } else {
            fileIds = "fileId=" + fileId;
        }
        var apiUrl = apicallurl + "/workspace/removeFiles/" + wsId + "?" + fileIds;
        var sid = $('tbody[id="workspaceFiles"]').find('.cf-back').attr('sid');
        if (sid != undefined) {
            apiUrl += "sharedFolderId=" + encodeURIComponent(sid); 
        } else {
            apiUrl += "sharedFolderId=";
        }
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: true,
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (DeleteFile) {
                $('#deleting').addClass("divdisplay");
                $('#fileComments').html('');
                $('#addingComments').addClass("divdisplay");
                $.each(fileId, function (i, fid) {
                    $('[id="' + encodeURIComponent(fid) + '"]').parents('.gradeA').remove();
                });
                if ($('#workspaceFiles').children('tr').length == 0) {
                    $('#NoFilesWorkspace').show();
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Opertion Failed.", color: "#1ba1e2", timeout: notifyError});
                    alertError("Opertion Failed.");
                }
                $('#wsdeleting').hide();
            }
        });
    },
    getReportObjectSize: function (a) {
        if (a == undefined || a == null || a == 0) {
            return 0;
        } else {
            return CFManageCloudAccountsAjaxCall.getObjectSize(a, "");
        }
    },
    deleteWorspace: function (wid) {
        var apiUrl = apicallurl + "/workspace/delete/" + wid;
        $.ajax({
            type: "DELETE",
            url: apiUrl,
            async: false,
            dataType: "json",
            data: "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (DeleteFile) {
            },
            statusCode: {
                204: function () {
                    $('[id="' + wid + '"]').parent('.file').remove();
                    $('[id="' + wid + '"]').parent('li').remove();
                    var wslength = $('#ThumbnailContent strong.filename').length;
                    if (wslength == 0) {
                        $('#CFEditWorkSpace').hide();
                        $('#NoWorkspaces').show();
                    }
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 403) {
                    var userDetails = JSON.parse(localStorage.getItem("CFUser"));
                    var email = userDetails.primaryEmail;
                    // $.smallBox({
                    //     title: "This emailid " + email + " not authorized.",
                    //     color: "#1ba1e2",
                    //     timeout: notifyTime
                    // });
                    alertSuccess("This emailid " + email + " not authorized.");
                    return false;
                }
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    removeWorkspace: function (wid, updateemail) {
        apiUrl = apicallurl + "/workspace/remove/collab";
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: true,
            dataType: "json",
            data: updateemail,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (DeleteFile) {
            },
            statusCode: {
                200: function () {
                    $('[id="' + wid + '"]').parent('.file').remove();
                    $('[id="' + wid + '"]').parent('li').remove();
                    var wslength = $('#ThumbnailContent strong.filename').length;
                    if (wslength.length == 0) {
                        $('#CFEditWorkSpace').hide();
                        $('#NoWorkspaces').show();
                    }
                },
                204: function () {
                    $('[id="' + wid + '"]').parent('.file').remove();
                    $('[id="' + wid + '"]').parent('li').remove();
                    var wslength = $('#ThumbnailContent strong.filename').length;
                    if (wslength == 0) {
                        $('#CFEditWorkSpace').hide();
                        $('#NoWorkspaces').show();
                    }
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 403) {
                    var userDetails = JSON.parse(localStorage.getItem("CFUser"));
                    var email = userDetails.primaryEmail;
                    // $.smallBox({
                    //     title: "This emailid " + email + " not authorized.",
                    //     color: "#1ba1e2",
                    //     timeout: notifyTime
                    // });
                    alertSuccess("This emailid " + email + " not authorized.");
                    return false;
                }
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    sendEntLeadRequest: function (requestData) {
        var apiUrl = apicallurl + "/users/entLeadRequest?domianUrl=" + encodeURIComponent(domainUrl);
        $.ajax({
            type: "PUT",
            url: apiUrl,
            async: false,
            data: requestData,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                //$.smallBox({title: "Request sent successfully.", color: "#1ba1e2", timeout: notifyTime});
                alertSuccess("Request sent successfully.");
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    createCategoryGlobal: function (CatName) {
        var bool;
        var apiUrl = apicallurl + "/category/create?categoryName=" + CatName + "";
        $.ajax({
            type: "PUT",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                newCategory = true;
                var testlength = $('#categoryList #' + data.id + '').length;
                CFManageCloudAccountsAjaxCall.addCategoryToFiles(data.id, FromfileId);
                if (testlength >= 1) {
                    return false
                }
                else {
                    $('#categoryList').append('<li id=' + data.id + ' class="getFiles"><a href="#">' + data.categoryName + '</a><i class="removeCategory" data-toggle="modal" data-target="#myModal2"></i><i class="editCategory"></i></li>');
                }

            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    addCategoryToFiles: function (CatgoryId, fileId) {
        var catID = CatgoryId;
        var fileIds = '';
        var fid;
        if (typeof fileId == "object" || typeof fileId == Array) {
            for (var i = 0; i < fileId.length; i++) {
                fid = encodeURIComponent(fileId[i]);
                fileIds += 'fileIds=' + fid + '&';
            }
            fileIds = fileIds.substring(0, fileIds.length - 1);
        }
        else {
            fid = encodeURIComponent(fileId);
            fileIds = "fileIds=" + fid;
        }
        if (catID == "undefined") {
            return false;
        }
        else {
            sendGAEvents("Add to category Ok", PageName + "/" + catID + "/" + fileIds);
            //_gaq.push(['_trackEvent',"Add to category Ok", localStorage.getItem('UserId'),PageName+"/"+catID+"/"+fileIds]);
            var apiUrl = apicallurl + "/category/add/" + catID;
            $.ajax({
                type: "POST",
                url: apiUrl,
                async: false,
                dataType: "json",
                data: fileIds,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (data) {
                    unCheckFile();
                    catID = "undefined";
                },
                complete: function (xhr, statusText) {
                    if (xhr.status == 200) {
                        unCheckFile();
                        // $.smallBox({
                        //     title: "File(s) added to category successfully.",
                        //     color: "#1ba1e2",
                        //     timeout: notifyTime
                        // });
                        alertSuccess("File(s) added to category successfully.");
                        catID = "undefined";
                    }
                    if (xhr.status > 300) {
                        unCheckFile();
                        //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                        alertError("Operation Failed");
                    }
                }
            });
        }
    },
    deleteCloud: function (a) {
        localStorage.removeItem("mulUsrDst");
        localStorage.removeItem("mulUsrSrc");
        localStorage.removeItem("multiUsrSrcClds");
        localStorage.removeItem("multiUsrDstClds");
        localStorage.removeItem("multiUsrSrcCldsMul");
        localStorage.removeItem("multiUsrDstCldsMul");
        localStorage.removeItem("mappedClouds");
        localStorage.removeItem("selectedClds");
        var _a = false;
        var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/cloud/delete/" + a + "";
        $.ajax({
            type: 'DELETE',
            url: apiUrl,
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            success: function (json) {
            },
            statusCode: {
                204: function () {
                    return _a = true;
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
        return _a;
    },
    updateUserName: function (Updatedusername) {
        var userData = JSON.parse(localStorage.getItem('CFUser'));
        userData.lastName = Updatedusername;
        var UpdateUser = JSON.stringify(userData);
        var apiUrl = apicallurl + "/users/update/" + CFManageCloudAccountsAjaxCall.getUserId();
        $.ajax({
            type: 'POST',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            data: UpdateUser,
            dataType: 'json',
            success: function (json) {
                var userObject = JSON.parse(localStorage.getItem('CFUser'));
                userObject.lastName = Updatedusername;
                localStorage.setItem('CFUser', JSON.stringify(userObject));
                localStorage.setItem('UserName', Updatedusername);
                $('#homenavbarcollapse').parent().children('.navbar-right').children().children('.dropdown-toggle').html('<span>' + json.lastName + '</span><b class="caret"></b>');
                $('.ProfileContent').html('');
                $('.ProfileContent').text(json.lastName);
                var isCusUser = checkIsaCustomUserForLogin(localStorage.getItem("UserId"));

                if (lastsubsresponse == undefined && isCusUser === false){ 
                    ver = "(Trial User)";
                    $('#dash-uname').text(Updatedusername + ver); 
					$('#dash-uname1').text(Updatedusername + ver); 
                }
                else
                    $('#dash-uname').text(Updatedusername);
				$('#dash-uname1').text(Updatedusername);
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },

    updateMobileNumber:function (Updatedusername) {
        var userData = JSON.parse(localStorage.getItem('CFUser'));
        userData.mobileNumber = Updatedusername;
        var UpdateUser = JSON.stringify(userData);
        var apiUrl = apicallurl + "/users/update/" + CFManageCloudAccountsAjaxCall.getUserId();
        $.ajax({
            type: 'POST',
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            data: UpdateUser,
            dataType: 'json',
            success: function (json) {
                var userObject = JSON.parse(localStorage.getItem('CFUser'));
                userObject.mobileNumber = Updatedusername;
                localStorage.setItem('CFUser', JSON.stringify(userObject));
                localStorage.setItem('mobileNumber', Updatedusername);
				var data ={
                    "name" : userObject.lastName,
                    "email" : userObject.primaryEmail,
					"phone" : userObject.mobileNumber
                };
			//	activecampaign.createContact(data);
			//	zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'phoneNumber', Updatedusername);
                $('#homenavbarcollapse').parent().children('.navbar-right').children().children('.dropdown-toggle').html('<span>' + json.mobileNumber + '</span><b class="caret"></b>');
                $('.ProfileContentmobile').html('');
                $('.ProfileContentmobile').text(json.mobileNumber);
                if(json.mobileNumber.length ==0 ){
                    $('.ProfileContentmobile').text('Not Available');
                    localStorage.setItem('mobileNumber', 'Not Available');
                }


            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });
    },
    getCloudsFromConfig: function () {
        var apiUrl = apicallurl + "/subdomain/user/clouds/info";
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (cloudConfig) {//cloud_webdav_header cloud_ecm_header cloud_ecm_message
                if (cloudConfig != undefined && cloudConfig != null) {
                    if (cloudConfig.cloudsList != undefined && cloudConfig.cloudsList.length > 0) {
                        var ecmClouds = ["CMIS", "SHAREFILE", "ALFRESCO", "WALRUS", "SHAREPOINT_2013", "SHAREPOINT_2010", "DOCUMENTUM", "CLOUDIAN",
                            "AZURE_OBJECT_STORAGE", "GENERIC_OBJECT_STORAGE", "NTLM_STORAGE"];
                        var webdavClouds = ["WEBDAV"];
                        var ecmCloudCount = 0;
                        var webdavCloudCount = 0;
                        $.each(CLName, function (i, e) {
                            if ($.inArray(i, cloudConfig.cloudsList) == -1) {
                                var div;
                                if (i == "DOCUMENTUM") {
                                    div = $('.cloudImgDocu').closest('a').parent();
                                    div.remove();
                                } else if (i == "WALRUS") {
                                    div = $('.cloudImgEUCA').closest('a').parent();
                                    div.remove();
                                } else {
                                    div = $('.cloudImg' + i + '').closest('a').parent();
                                    div.remove();
                                }
                            } else {
                                if ($.inArray(i, ecmClouds) != -1) {
                                    ecmCloudCount++;
                                } else if ($.inArray(i, webdavClouds) != -1) {
                                    webdavCloudCount++;
                                }
                            }
                        });
                        if (ecmCloudCount == 0) {
                            $('#cloud_ecm_header').remove();
                        }
                        if (webdavCloudCount == 0) {
                            $('#cloud_webdav_header').remove();
                        }
                    }
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                    alertError("Operation Failed");
                }
            }
        });

    },
    showNotification: function (a, b) {
        // var c = '#1ba1e2';
        // var t = 4000;
        // if (a == 'error') {
        //     c = '#e35e00';
        //     t = 1500;
        // } else if (a == 'notify') {
        //     c = '#1ba1e2';
        //     t = 2000;
        // } else if (a == 'warn') {
        //     c = '#f86227';
        //     t = 1500;
        // }
        //$.smallBox({title: b, color: c, timeout: t});
        showNotyNotification(a,b);
    }
};

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

$('#priviewPswd').keypress(function(e) {
    if (e.which == 13) {
        $('.CFPriviewPwdok').trigger('click');
    }
});

function CFHideContents(){
    $('#CFHSortFileName').children('span').html('');
    $('#CFHSortfileSize').children('span').html('');
    $('#CFHSortAddedOn').children('span').html('');
    $('#CFHSortModifiedOn').children('span').html('');
    $('#CFHSortCloudDrive').children('span').html('');
    //var fileControls = $('.filecontrols');
    disableActionPanel(actionPanel);
    //fileControls.addClass('buttonDisable');
    $('#LVWContentHeader').addClass('divdisplay');
    $('#ThumbnailContent').hide();
    $('#ThumbnailContent').parent('.slimScrollDiv').hide();
    $('#LVContentHeader').addClass('divdisplay');
    $('#LVContent').hide();
    $('#AccountSettings').hide();
    $('#ReportsContent').hide();
    $('#HomeContent').hide();
    $('#CFCreateWorkSpace').hide();
    $('.fileview').hide();
    $('#LVContentHeader input[type="checkbox"]').prop('checked', false);
    $('#page-header .searchbox').show();
    urlParameterObject = {
        "isAscen":"false",
        "fetchCollabInfo":"true",
        "folderId":"",
        "isAllFiles":"true",
        "orderField":"modifiedTime"
    };
    $('#CFHSortModifiedOn').children('span').html("&#9650");
}
function CFShowContents(){
    var pagename = PageName;
    $('#LVHeader').children('.LVHFavorites').show();
    $('#LVHeader').children('.LVHFavorites').text("Favorites");
    if(pagename == "Reports"){
        $('#HomeContent').show();
        $('#ReportsContent').show();
        $('#ListContent').parent('.slimScrollDiv').hide();
    }
    else if(pagename == "WorkSpace"){
        $('.workspaceUpload#CFUploadFiles').addClass('buttonDisable');
        $('#HomeContent , #LVContent, .fileview').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVWContentHeader').removeClass('divdisplay');
    }
    else if(pagename == "Folders" ){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity', '0.2');
        urlParameterObject.isAllFiles = "false";
    }
    else if(pagename == "Category"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity','');
        $('#CFUploadFiles').removeClass('buttonDisable');
    }
    else if(pagename == "Home" || pagename == "Recent files" || pagename =="Favorites" || pagename =="All Items" || pagename =="Tag"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity','');
    }
    else if(pagename == "InnerFolders" && previousPage == "Share with Me"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity','');
    }
    else if(pagename == "CloudDrive" || pagename == "InnerFolders"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity','');
    }
    else if(pagename == "SharepointSite"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity','');
    }
    else if(pagename =="Share by Me" || pagename =="Share with Me"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('.fileview').show();
        $('.filecontrols #shareData > div').css('opacity','');
    }
    else if(pagename == "InnerWorkSpace"){
        $('#HomeContent').show();
        $('#LVContent').show();
        $('#ListContent').parent('.slimScrollDiv').show();
        $('#LVContentHeader').removeClass('divdisplay');
        $('#CFEditWorkSpace').show();
        $('#CFCreateWorkSpace').show();
        $('.fileCreatecontrols #CFCreateWorkSpace').hide();
        if(AllCloudsInfo.length >= 1){
            $('.workspaceUpload#CFUploadFiles').removeClass('buttonDisable');
        }
    }
}
var downCount = 0;
function downloadURL(url) {
    if(sharedFolderId == undefined || sharedFolderId == ""){
        sharedFolderId = "";
    }
    var sid = '';
    if (PageName != "Share with Me" && previousPage != "Share with Me") {
        var url1 = url;
        if(PageName == "InnerWorkSpace"){
            sid = $('tbody[id="workspaceFiles"]').find('.cf-back').attr('sid');
            if(sid != undefined){
                url1 +="&sharedFolderId="+encodeURIComponent(sid);
            }else{
                url1 +="&sharedFolderId=";
            }
        }
        $.get(url1+'&isDownloading=false', function () {
        }).fail(function (data) {
            if (data.status == 404 || data.status == 406) {
                var test = '';
                if (PageName == 'InnerWorkSpace') {
                    test = "The requested file might have deleted or moved from the Cloud . Please verify and add to the workspace.";
                }else {
                    test = "The requested file might have deleted or moved from the Cloud . Please verify.";
                }
                alertError(test);
            }
        });
    }
    if(PageName == "InnerWorkSpace"){
        sid = $('tbody[id="workspaceFiles"]').find('.cf-back').attr('sid');
        if(sid != undefined){
            url = url+"&sharedFolderId="+encodeURIComponent(sid);
        }
    }
    var hiddenIFrameID = 'hiddenDownloader' + downCount;
    downCount = downCount + 1;
    iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
    setTimeout(function () {
        if (PageName != "InnerWorkSpace") {
            unCheckFile();
        }
    }, 1000);
}
function appendBreadCrumb(fileId,cloudId,displayname,isBase){
    if(isBase==undefined ||isBase==true){
        $('#breadCrumbdync').append('<li style="cursor:pointer;" id='+fileId+' class="BCRFList" cloudId='+cloudId+' fileId='+fileId+'><a style="cursor:pointer;">'+displayname.substr(0,30)+'</a><span class="divider"></span></li>');
    }else{
        $('#breadCrumbdync').append('<li style="cursor:pointer;" id='+fileId+' class="BCRFList" cloudId='+cloudId+'><a style="cursor:pointer;">&nbsp;/&nbsp;'+displayname.substr(0,30)+'</a><span class="divider"></span></li>');
    }
}

// $('#moveSource').on('click','.lnil.lnil-reload',function(){
//     $(this).removeClass('lnil lnil-reload').addClass('cloudSpinn');
//     var id = $(this).parent().attr('id');
//    // sendGAEvents("Clicked on Cloud Sync",id);
//    // refreshCloud.push(id);
//     $.smallBox({title:'Preparing files to move.',color:"#1ba1e2",timeout:2000});
//alertSuccess('Preparing files to move.');
//     //CFManageCloudAccountsAjaxCall.refreshcloud(id);
// });

$('#refreshcloudmovesrc').on('click',function(e){
 
    //$.smallBox({title:'Preparing files to move.',color:"#1ba1e2",timeout:2000});
    alertSuccess('Preparing files to move.');
});

$('#breadCrumbdyncmove').on('click', 'li.BCRFList', function(e){
    var fileId = $(this).attr('id');
    moveCheckSum = 'source';
    // if(fileId == SinglePId){
    //     return false;
    // }
    PageName = 'innermove';
    $(this).children('a:last').css("color","");
    $(this).children('a:last').css("text-decoration","none");
    var cloudId = $(this).attr('cloudid');
    var PageNumber =1;
    var nextfiles = $(this).next();
    $('#breadCrumbdyncmove li').show();
    if(fileId == "cloud"){
        $('#breadCrumbdyncmove li').hide();
        CFManageCloudAccountsAjaxCall.getAllClouds();
        $('#dynamicCloudName').siblings('i').removeAttr('id');

        var dispanme = '';
        // if(moveCheckSum == null || moveCheckSum == ''){
        //     $('#moveSource , #moveDestination').html('');
        // }
        // else if(moveCheckSum == 'source'){
        $('#moveSource').html('');
        $('#moveSource').siblings('#movePageShowMore').hide();
        // }
        // else if(moveCheckSum == 'dest'){
        //     $('#moveDestination').html('');
        //     $('#moveDestination').siblings('#movePageShowMore').hide();
        // }
        $.each(AllCloudsInfo,function(i,cloud){
            var email = cloud.cloudUserId;
            email = email.split('|');
            email = email[email.length - 1];
            if(cloud.userDisplayName != '' || cloud.userDisplayName != null){dispanme = cloud.userDisplayName;}
            else{dispanme = email;}
            var _warning = cloud.cloudStatus == "INACTIVE" ? "cf-warning" : "";
            //cloud.cloudName != "BOX_BUSINESS" && cloud.cloudName != "DROPBOX_BUSINESS" && cloud.cloudName != "ONEDRIVE_BUSINESS_ADMIN"
            if((MultiUserClouds.indexOf(cloud.cloudName) == -1))
            {
                $('.span6 #moveSource').append('<div class="moveCloudBlock button '+_warning+'" style="width:150px;padding:0" type="button">' +
                    '<div class="move '+cloud.cloudName+'" cid="'+cloud.id+'" pid="'+cloud.rootFolderId+'"></div>' +
                    '<p id="userEmail">'+dispanme+'</p></div>');
            }

        });
        PageName = 'moveLanding';
        $('#moveSource').siblings('.tab-header').children('#dynamicCloudName').html('');
        $('#moveSource').siblings('.tab-header').children('#totalfiles').html('');
    }else if(fileId == 'cloudFolders'){
        PageNumber = 1;
        SingleCloudId = cloudId;
        previousPage = PageName;
        PageName = 'CloudDrive';
        SinglePId = SingleCloudId;
        $('#spinner2').show();
        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber);
    }
    else{
        SinglePId = fileId;
        SingleCloudId = cloudId;
        PageNumber = 1;
        if(fileId == 'allcloud')//if we click on the cloud name to get all files from a cloud
        {
            PageName='move';
        }
        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(cloudId, PageNumber);
    }
    $(this).nextAll().remove();
});

$('#breadCrumbdyncmovedest').on('click', 'li.BCRFList', function(e){
    var fileId = $(this).attr('id');

    var navid = $(this).attr('id');
    var cloudid= $(this).attr('cid');
    PageName = 'innermove';
    moveCheckSum = 'dest';

    if(navid == SinglePId){
        return false;
    }
    $(this).children('a:last').css("color","");
    $(this).children('a:last').css("text-decoration","none");
    var cloudId = $(this).attr('cloudid');
    var PageNumber =1;
    var nextfiles = $(this).next();
    $('#breadCrumbdyncmovedest li').show();
    if(navid == "cloud"){
        $('#breadCrumbdyncmovedest li').hide();
        CFManageCloudAccountsAjaxCall.getAllClouds();
        $('#breadCrumbdyncmovedest').siblings('i').removeAttr('id');
        $('#dynamicDestCloudName').siblings('i').removeAttr('id');

        var dispanme = '';
        // if(moveCheckSum == null || moveCheckSum == ''){
        //     $('#moveSource , #moveDestination').html('');
        // }
        // else if(moveCheckSum == 'source'){
        $('#moveDestination').html('');
        $('#moveDestination').siblings('#movePageShowMore').hide();
        // }
        // else if(moveCheckSum == 'dest'){
        //     $('#moveDestination').html('');
        //     $('#moveDestination').siblings('#movePageShowMore').hide();
        // }
        $.each(AllCloudsInfo,function(i,cloud){
            var email = cloud.cloudUserId;
            email = email.split('|');
            email = email[email.length - 1];
            var _warning = cloud.cloudStatus == "INACTIVE" ? "cf-warning" : "";
            if(cloud.userDisplayName != '' || cloud.userDisplayName != null){dispanme = cloud.userDisplayName;}
            else{dispanme = email}
            $('#moveDestination').append('<div class="moveCloudBlock button '+_warning +'" type="button" style="padding:0">' +
                '<input type="radio"  name="destCloud" class="destCloudInput" style="display:none;">' +
                '<div class="move '+cloud.cloudName+'"  cid="'+cloud.id+'" pid="'+cloud.rootFolderId+'" style="margin-left:30px"></div>' +
                '<p id="userEmail">'+dispanme+'</p></div>');
            $('#moveDestination .moveCloudBlock').droppable({accept:'#moveSource .list-group-item',drop:dropEventHandler,over:function(){$(this).addClass('moveCloudBlockDragHover').removeClass('moveCloudBlock');},out:function(){$(this).removeClass('moveCloudBlockDragHover').addClass('moveCloudBlock');}});
        });
        PageName = 'moveLanding';
        $('#moveDestination').siblings('.tab-header').children('#dynamicDestCloudName').html('');
        $('#moveDestination').siblings('.tab-header').children('#totalfilesdestination').html('');
    }else if(navid == 'cloudFolders'){
        PageNumber = 1;
        SingleCloudId = cloudId;
        previousPage = PageName;
        PageName = 'CloudDrive';
        SinglePId = SingleCloudId;
        $('#spinner2').show();
        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber);
    }
    else{
        SinglePId = navid;
        SingleCloudId = cloudId;
        PageNumber = 1;
        if(navid == 'allcloud')//if we click on the cloud name to get all files from a cloud
        {
            PageName='move';
        }
        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(cloudId, PageNumber);
    }
    $(this).nextAll().remove();
});


$('#breadCrumbdync').on('click', 'li.BCRFList', function(e) {
    var fileId = $(this).attr('id');

    if (fileId == SinglePId) {
        return false;
    }
    $(this).children('a:last').css("color", "");
    $(this).children('a:last').css("text-decoration", "none");
    var cloudId = $(this).attr('cloudid');
    var PageNumber = 1;
    var nextfiles = $(this).next();
    $('#breadCrumbdync li').show();
    if (fileId == "cloud") {
        $('#CloudDriveList li [id="' + SingleCloudId + '"] p').trigger('click');
    }
    else if (fileId.trim() == "Home") {
        $('#homeHome').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "RecentFiles") {
        $('#CFRecentFilesAndFolders').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "FavouriteFiles") {
        $('#favourite').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "ShareByMe") {
        $('#CFSharedByMe').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "ShareWithMe") {
        $('#CFSharedWithMe').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "Workspace") {
        $('#homeWorkspace').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "Folders") {
        $('#homeFolder').trigger('click');
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (fileId == "AllFiles") {
        var _AllFiles = CFManageCloudAccountsAjaxCall.getAllFiles(PageNumber);
        CFManageCloudAccountsAjaxCall.getAllFileNames(_AllFiles, PageNumber);
        InnerCloudId = [];
        InnerFolderId = [];
    }
    else if (PageName == "Category") {
        return false;
    }
    else {
        SinglePId = fileId;
        var _fileDetails = CFHPlistview.getFileDetails(fileId);

        var _type = _fileDetails != undefined ? _fileDetails.type : null;
        var _isDir = _fileDetails != undefined ? _fileDetails.directory : null;
        var _a;
        if (_isDir == false) {
            _a = "File";
        }
        else if (_isDir == true) {
            _a = "Folder";
        }
        else if (_type == "SITE" && _isDir == null) {
            _a = "Site";
        }
        PageName = _a == "Site" ? "SharepointSite" : "InnerFolders";
        CFHideContents();
        CFShowContents();
        InnerCloudId = [];
        InnerFolderId = [];
        if (previousPage == "Share with Me" || previousPage == "Share by Me") {
            sharedFolderId = $('#breadCrumbdync').children('li:eq(1)').attr('id');
            CFManageCloudAccountsAjaxCall.gotoInnerFolderandFiles(cloudId, fileId, PageNumber, 'back', sharedFolderId);
        }
        else {
            CFManageCloudAccountsAjaxCall.gotoInnerFolderandFiles(cloudId, fileId, PageNumber);
        }
    }
    $(this).nextAll().remove();
});
var currentDate = new Date(); // Todays date
$("#datepicker3").datepicker({ //('#sharecontent').find
    minDate: currentDate,
    inline: true,
    showOtherMonths: true,
    dateFormat: 'mm/dd/yy',
    onSelect: function (date) {
        var selectedDate = $('#datepicker3').datepicker('getDate');
        Date.prototype.DaysBetween = function () {
            var intMilDay = 24 * 60 * 60 * 1000;
            var intMilDif = arguments[0] - this;
            return Math.floor(intMilDif / intMilDay);
        };
        var days = currentDate.DaysBetween(selectedDate);
        $(this).attr('data-days', days);
    }
});

$('#move-header').on('scroll',function() {
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-40) {
	_page_Num = _page_Num +1;
	 if (window.location.hash == "#backup" || ((!(BrowserDetect.browser == "Safari"))&& window.location.hash.includes("#backup")))
            {				
				CFManageCloudAccountsAjaxCall.getAllMoveStatusForSyncUser();
								
            }
            else if (window.location.hash == "#team" || ((!(BrowserDetect.browser == "Safari"))&& window.location.hash.includes("#team")))
            {
if(!($(".jobsRow").find("i").hasClass("fa-chevron-circle-up")))
            	{
               mappingOptions.appendMigrationJobs(1,150);
            	}

              // mappingOptions.appendMigrationJobs(1,150);
            }
			else{
			
			CFManageCloudAccountsAjaxCall.getAllMoveStatusForUser();
			}
	}
});

//Delete Cloud
$('#manageclouddiv').on('click', '[data-action="delete"]' , function(){
    sendGAEvents("Delete Cloud");
    var _id = $(this).attr('data-id');
    $('#CFCLDelete').attr("data-type",_id);
    var parent = $(this).closest('#cloudInfo');
    var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/get/cloud/movestatus?cloudId="+_id;
    var status=0;
    $.ajax({
        type: "GET",
        url: apiUrl,
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            status=data;
            if(data>0)
            {
                $('#CFCLdeleteModal h4').text('Cloud you have selected to delete is associated with file migration. Do you want to delete it anyway?');
            }
            else
            {
                if((parent.attr('name')==="DROPBOX_BUSINESS") || (parent.attr('name')==="ONEDRIVE_BUSINESS_ADMIN")) {
                    var s = parent.find('#percentOfUsers').text();
                    var t = parent.find('#AuthorizeCld').hasClass('retry');
                    if ((s !== '100%' )|| t){
                        $('#CFCLdeleteModal h4').text("The cloud you want delete is currently being processed. Do you wish to delete it anyway?");
                    }
                    else
                        $('#CFCLdeleteModal h4').text('Are you sure you want to delete the selected Cloud?');
                }
                else
                    $('#CFCLdeleteModal h4').text('Are you sure you want to delete the selected Cloud?');
            }
        },
        complete: function (xhr, statusText) {
            if (xhr.status > 300) {
                if(localStorage.getItem("storageVal") == null){
                    alertSuccess("You have been logged out");
                }
                //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                else
                    alertError("Operation Failed");
            }
        }
    });
    $('#CFCLdeleteModal').modal('show');
});

$('#CFCLDelete').on('click',function() {
    sendGAEvents("Delete Cloud Yes");
	//activecampaign.eventTrack('Delete Cloud',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    var _id = $(this).attr('data-type');
    var _r = CFManageCloudAccountsAjaxCall.deleteCloud(_id);

    var _parent = $('#manageclouddiv');

    if(_r){
        alertSuccess('Cloud deleted successfully.');
        _parent.find('[id="'+_id+'"]').parent().remove();
       // _parent.find('[id="'+_id+'"]').remove();

    }else {

    }

    var index = $.inArray(_id, CloudId);
    PrimaryEmail.splice(index,1);
    CloudId.splice(index,1);
    CloudName.splice(index,1);
    CLParent.splice(index,1);
    AllCloudsInfo.splice(index, 1);
    $('#CFCLdeleteModal').modal('hide');
});

//Rename Cloud
$('#manageclouddiv').on('click','[data-action="edit"]',function(){
    sendGAEvents("cloud Rename");
	//activecampaign.eventTrack('Cloud Rename',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    var _parent = $(this).closest('td');
    var _old = _parent.html();
    var _name = $(this).prev().text().trim();
    var _new = '<input type="text" style="width:73%" class="form-control slim-form-control" value="'+_name+'"><span' +
        ' data-action="rename"><i' +
        ' class="cf-check"></i><i class="cf-times" data-action="cancel"></i></span>';
    _parent.html(_new);

    var _input = _parent.find('input');

    $('[data-action="cancel"]').on('click',function(){
        _parent.html(_old);
    });

    $('[data-action="rename"]').on('click',function(){
        var user = /[^a-zA-Z ]/;
        var userlen = /[^a-zA-Z ]{2,20}/;
        var _val = _input.val().trim();

        if(_val.length < 1){
            _input.addClass('danger');
            return alertError('Please Enter Displayname');
        }
        else if(_val.length < 6 || _val.length > 20){
            _input.addClass('danger');
            return alertError("Name must be 6-20 characters in length.");
        }/*
         else if(user.test(_val)){
         _input.addClass('danger');
         return showNotyNotification('error',"Name can contain only letters (A-Z and" +
         " a-z).");
         }
         else if(userlen.test(_val)){
         _input.addClass('danger');
         return showNotyNotification('error',"Name must be 2-20 characters in length.");
         }*/
        else{
            _input.removeClass('danger');
            var _CloudID = $(this).closest('tr').attr('data-cloud');
            var _a = {
                id:_CloudID,
                name:_val
            };
            var _r  = CFManageCloudAccountsAjaxCall.renameCloud(_a);
            if(_r){
                var _html = '<span style="padding-right: 30px;">'+_val+'</span><i style="padding-right:10px;" class="cf-pencil9 pull-right"' +
                    ' data-action="edit"></i>';
                $('body').off('mouseup');
                _parent.html(_html);
            }else{
                return alertError('Cloud rename failed.');
            }
        }
    });

    $('body').on('mouseup', function (e) {
        if (_input.is(e.target) ||
            _input.next().find('i').is(e.target)
        ) {}
        else {
            $('[data-action="cancel"]').trigger('click');
            $('body').off('mouseup');
        }
    });

});

function getParameterByName( name,href ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( href );
    if( results == null ) {
        return "";
    }else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

function enableCrateControls1(c,u){
    var _c = $("#CFCreateFolder").parent(),
        _u =$('#CFUploadFiles').parent();

    if(c){
        _c.addClass('buttonDisable');
    }else{
        _c.removeClass('buttonDisable');
    }

    if(u){
        _u.addClass('buttonDisable');
    }else{
        _u.removeClass('buttonDisable');
    }
}

function clearSorting(){
    $('#CFHSortfileSize').children('span').html('');
    $('#CFHSortAddedOn').children('span').html('');
    $('#CFHSortModifiedOn').children('span').html('');
    $('#CFHSortCloudDrive').children('span').html('');
    $('#CFHSortFileName').children('span').html('');
}
function helperEvent(e,ui){
    if($('#moveSource input:checked').length == 0){
        this.classList.add('fileActive');
        var noneid = e.currentTarget.id;
        $('[id="'+noneid+'"] input').attr('checked',true);
        $('[id="'+noneid+'"]').addClass('fileActive');
    }
    var helperList = $('<div class="draggable-helper" ></div>');
    if ($(this).is('.fileActive')){
        helperList.append($(this).siblings('.fileActive').addBack().clone());
    }
    var fid=[];
    var cid = [];
    $(helperList[0]).find('label').each(function(){
        fid.push($(this).attr('id'));
        cid.push($(this).attr('cid'));
    });
    var helperText = "";
    if(fid.length == 1){
        sendGAEvents("Drag Single File"); 
        //_gaq.push(['_trackEvent',"Drag Single File", localStorage.getItem('UserId')]);
        var fileName = helperList.find('label').children('p').text();
        helperText = "<span fid='"+fid+"' cid='"+cid+"' style='z-index:99999;width:100px;padding:5px;background:#0062FF;color:#fff;font-size:10px;word-wrap:break-word'>"+fileName+"</"+"span>";
    }else if(fid.length < 1){
        sendGAEvents("Drag Multiple File");
        //_gaq.push(['_trackEvent',"Drag Multiple File", localStorage.getItem('UserId')]);
        helperText = "<span fid='"+fid+"' cid='"+cid+"' style='z-index:99999;width:100px;padding:5px;background:#0062FF;color:#fff;font-size:10px;word-wrap:break-word'>Please select File </"+"span>";
    }else{
        helperText = "<span fid='"+fid+"' cid='"+cid+"' style='z-index:99999;width:100px;padding:5px;background:#0062FF;color:#fff;font-size:10px;word-wrap:break-word'>Move "+fid.length+" item</"+"span>";
    }
    return helperText;
}
function dropEventHandler(e,ui) {
    sendGAEvents("Drop in Folder");
    //_gaq.push(['_trackEvent',"Drop in Folder", localStorage.getItem('UserId')]); 
    $("#moveSource").find(".list-group-item").each(function () {
        $(this).removeClass('fileActive');
    });
    $("#moveDestination").find("input").removeAttr('checked');
    var tofid = '';
    var tocid = '';
    var fromfid = [];
    var fromcid = [];
    var htmlCont = '';
    /*Extract Html content from Helper object*/
    htmlCont = ui.helper[0].outerHTML;
    fromfid = $(htmlCont).attr('fid');
    fromfid = fromfid.split(",");
    if ($("#moveSource").find("input:checked").length < 1) {
        ui.draggable.draggable('option', 'revert', true);
        $('#moveSource [id="' + fromfid + '"]').children('input').attr('checked', 'false');
        $('#moveDestination').find('.draghover').addClass('dropabbleParent').removeClass('draghover');
        $("#moveDestination").find(".list-group-item").each(function () {
            $(this).removeClass('fileActive');
        });
        $("#moveDestination").children('.button.ui-droppable').each(function () {
            $(this).removeClass('fileActive').removeClass('moveCloudBlockDragHover').addClass('moveCloudBlock');
        });
        return false;
    }else {
        // $('.draghover').each(function(){
        //     $(this).removeClass('draghover').addClass('dropabbleParent');
        // })
        // $('#moveSource').find('input').prop('checked',false);
        // $('#moveSource').find('.ui-selectee').each(function(){
        //     $(this).removeClass('fileActive');
        // })
        // $('#moveDestination div').removeClass('rootDragHover');
        //return ui.draggable.draggable('option', 'revert', false);
        ui.draggable.draggable('option', 'revert', false);
    }
    fromcid = $(htmlCont).attr('cid');
    fromcid = fromcid.split(",");
    for (var i = 0; i < fromfid.length; i++) {
        $('#moveSource [id="' + fromfid[i] + '"]').children('input').attr('checked', 'true');
        $('#moveSource span[id="' + fromfid[i] + '"]').addClass('fileActive');
    }
    /*Check Page State and set Page Name*/
    var test = $(this).find('input').attr('name');
    if (test == 'destCloud') {
        PageName = 'moveLanding';
        tofid = $(this).find('.move').attr('pid');
        tocid = $(this).find('.move').attr('cid');
        $(this).find('input').attr('checked', true);
    }else if (test == 'srcfile') {
        if ($('#dynamicDestCloudName').attr('check') == 'droot') {
            PageName = 'move';
        }else {
            PageName = 'innermove';
        }
        test = $('#dynamicDestCloudName').attr('check');
        $('#dynamicDestCloudName').removeAttr('check');
        $('#dynamicDestCloudName').attr('recheck',test);
        tofid = $(this).find('label').attr('id');
        tocid = $(this).find('label').attr('cid');
        $(this).find('input').attr('checked', true);
    }
    if (PageName == 'moveLanding') {
        tofid = $(this).find('.move').attr('pid');
        tocid = $(this).find('.move').attr('cid');
        //$(this).find('.move').parent().addClass('cloudActive')
        $('#moveDestination .dropabbleParent[id="' + tocid + '"]').children('input').attr('checked', 'true');
        $('#moveDestination .move[cid="' + tocid + '"]').prev('input').attr('checked', 'true');
        $('#moveDestination .ui-droppable').each(function () {
            $(this).removeClass('moveCloudBlockDragHover').addClass('moveCloudBlock')
        });
    }
    if ($('input:checked').length > 0) {
        if ($('[type="radio"]:checked').length > 0) {
            $('#movecheckModal').removeAttr('disabled').addClass('blue');
            $('#backUpBtn').removeAttr('disabled').addClass('blue');
        }
        if ($('[type="checkbox"]:checked').length == 0) {
            $('#movecheckModal').prop('disabled', true).removeClass('blue');
            $('#backUpBtn').prop('disabled', true).removeClass('blue');
        }
    }
    if (PageName == 'moveLanding') {
        $('#moveDestination .ui-droppable.button').each(function () {
            $(this).removeClass('fileActive');
        });
        $('[cid="' + tocid + '"]').parent('.ui-droppable.button').addClass('fileActive');
    }
    if (PageName == 'move' || PageName == 'innermove'|| PageName == 'back') {
        $('#moveDestination .list-group-item').each(function () {
            $(this).removeClass('fileActive').removeClass('draghover');
        });
        $('#moveDestination .ui-droppable[id="' + tofid + '"]').addClass('fileActive').addClass('dropabbleParent');
    }
    $('#movecheckModal').trigger('click');
    $('#movecheckModal').prop('disabled', false).addClass('blue'); 
    $('#backUpBtn').trigger('click');
    $('#backUpBtn').prop('disabled', true).removeClass('blue');
}
function rootDropEventHandler(e,ui){
    sendGAEvents("Drop in Root");
    //_gaq.push(['_trackEvent',"Drop in Root", localStorage.getItem('UserId')]);
    var test = $('#dynamicDestCloudName').attr('recheck');
    if(test != undefined || test != null){
        $('#dynamicDestCloudName').attr('check',test);
        $('#dynamicDestCloudName').removeAttr('recheck');
    }
    var tofid = '';
    var tocid = '';
    var fromfid = [];
    var fromcid = [];
    var htmlCont = '';
    htmlCont = ui.helper[0].outerHTML;
    fromfid = $(htmlCont).attr('fid');
    fromfid = fromfid.split(",");
    if(fromfid[0]== ""){
        ui.draggable.draggable('option', 'revert', true);
        $('#moveSource input,#moveDestination input').attr('checked', false);
        $('#moveDestination').find('.draghover').addClass('dropabbleParent').removeClass('draghover');
        $("#moveDestination").find(".list-group-item").each(function () {
            $(this).removeClass('fileActive');
        });
        $('#moveDestination').children('.button.ui-droppable').each(function () {
            $(this).removeClass('fileActive').removeClass('moveCloudBlockDragHover').addClass('moveCloudBlock');
        });
        return false;
    }else{
        ui.draggable.draggable('option', 'revert', false);
    }
    $('#moveDestination').find('span.fileActive').removeClass('fileActive');
    $('input[type="radio"]:checked').prop('checked',false);
    $('#movecheckModal').trigger('click');
    $('#backUpBtn').trigger('click');
}

$("#moveReportsContainer").on('change',".selectpicker",function() {
    var check=$(this).val();
    var id=$(this).attr("id");
    CFManageCloudAccountsAjaxCall.movereportForGiveId(id,1,check);
});
$("#moveSyncReportsContainer").on('change',".selectpicker",function() {
    var check=$(this).val();
    var id=$(this).attr("id");
    CFManageCloudAccountsAjaxCall.movereportForGiveId(id,1,check);
});

$(document).on('click', '.lnil.lnil-reload', function(){
    $(this).removeClass('lnil lnil-reload').addClass('cloudSpinn');
    $(this).closest('tr').children().find('#initialVal').html("In Progress");
    var id = $(this).attr('id');
    sendGAEvents("Clicked on Cloud Sync",id);
	//activecampaign.eventTrack('Cloud Sync',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    //_gaq.push(['_trackEvent',  , localStorage.getItem('UserId'),id]);
    refreshCloud.push(id);
    CFManageCloudAccountsAjaxCall.refreshcloud(id);
});
$(document).on('click', '#dwnldPrsnlRpt',function () {
	var _wid = $(this).parents('tr').attr("id");
       $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/download/consumerMigrationReport/"+ _wid,
        async: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        complete: function (xhr) {
            var data = xhr.responseText;
            if (xhr.status == 200) {
                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'personal_migration_report_' + _wid + '.csv';
                document.body.appendChild(link);
                link.setAttribute("type", "hidden");
                link.click();
            }
            else if (xhr.status == 202) {
                alertSuccess("Report is in Progress,will be ready in few minutes");
            }
        }
    });

});
$(document).on('click', '.cancelMig',function () {
	var _wid = $(this).parents('tr').attr("id");
	var parents= $(this);
       $.ajax({
        type: "GET",
        url: apicallurl + "/move/cancelConsumerMigration/workspaceId?workSpaceId="+_wid+"&status=CANCEL&userId="+localStorage.UserId, 
        async: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(), 
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"  
        },
        success: function (data) {
         parents.parents("tr").children('td:eq(3)').html('Cancel').css("color", "red").css("font-weight", "bold");  
		 parents.parents("tr").children('td:eq(6)').children('i').css("opacity","0.2").css("cursor","not-allowed"); 
            }
    });

});
$(document).on('click', '.conSyncPause', function(){
    var jobId = $(this).parent().parent().attr('id');
    sendGAEvents("Clicked on consumer sync Pause button");
    var _val;
    var parent = $(this);
    if($(this).attr('src') === "../img/Resume.png" ){
        $(this).attr('src',"../img/Pause.png");
        _val="RESUME";
    }
    else if($(this).attr('src') === "../img/Pause.png" ){
        $(this).attr('src',"../img/Resume.png");
        _val="PAUSE";
    }
    if(($(this).parent().siblings().find('span').hasClass('CONSUMERTRAIL_COMPLETED')) || ($(this).parent().siblings().hasClass('CONSUMERTRAIL_COMPLETED'))){
        $(this).attr('src',"../img/Pause.png");
        _val="trial_Resume";
    }
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/consumer/update/sync/" + jobId + "?schedulerStatus=" + _val,
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            if (data.jobStatus === "IN_PROGRESS") {
                parent.parents("tr").children('td:eq(1)').html('In Progress').css("color", "blue").css("font-weight", "bold");
            }
            else if (data.jobStatus === "PAUSE") {
                parent.parents("tr").children('td:eq(1)').html('Pause').css("color", "red").css("font-weight", "bold");
            }
            else if (data.jobStatus === "CONSUMERTRAIL_COMPLETED") {
                parent.parents("tr").children('td:eq(3)').find(".conSyncPause").attr('src',"../img/Resume.png");
                parent.parents("tr").children('td:eq(1)').html('Consumer Trail Completed').css("color", "green").css("font-weight", "bold");
                parent.parents("tr").children('td:eq(1)').addClass('CONSUMERTRAIL_COMPLETED');
            }
            else if (data.threadStatus) {
                if (status === "PROCESSED" || status === "ERROR" || status === "SUSPENDED" || status === "PROCESSED_WITH_SOME_ERRORS" || status === "PROCESSED_WITH_SOME_WARNINGS" || status === "CANCEL" || status === "PROCESSED_WITH_SOME_CONFLICTS" || status === "CONFLICT")
                    $('.pauseResumeVal').css("color", "red").css("cursor", "not-allowed").css("opacity", "0.2");
            }
        }
    });
});

$(document).on('click', '.cnclConBtn', function(){
    var jobId = $(this).parent().parent().attr('id');
    sendGAEvents("Clicked on consumer sync cancel button");
    var _val ="STOP";
    var parent = $(this);
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/consumer/update/sync/" + jobId + "?schedulerStatus=" + _val,
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            if (data.jobStatus === "CANCEL") {
                parent.parents("tr").children('td:eq(1)').html('Cancel').css("color", "red").css("font-weight", "bold");
                //parent.parents("tr").children('td:eq(5)').find(".fa-download").css("opacity","0.2").css("cursor","not-allowed");
                parent.parents("tr").children('td:eq(3)').find(".conSyncPause").css("opacity", "0.2").css("cursor", "not-allowed");
                parent.parents("tr").children('td:eq(4)').find(".cnclConBtn").css("opacity", "0.2").css("cursor", "not-allowed");
            }
            else if (data.threadStatus) {
                if (status === "PROCESSED" || status === "ERROR" || status === "SUSPENDED" || status === "PROCESSED_WITH_SOME_ERRORS" || status === "PROCESSED_WITH_SOME_WARNINGS" || status === "CANCEL" || status === "PROCESSED_WITH_SOME_CONFLICTS" || status === "CONFLICT")
                    $('.pauseResumeVal').css("color", "red").css("cursor", "not-allowed").css("opacity", "0.2");
            }
        }
    });
});
//manage clouds
$(document).on('click','#manageclouddiv .getCloudsInfo .lnil-chevron-down-circle',function () {
    sendGAEvents("Clicked on plus icon to show cloud information");
    var $parentTr = $(this).closest( ".getCloudsInfo" );
    $('#manageclouddiv .appendcloudDetails').html('').css('display','none');
    $('#manageclouddiv .getCloudsInfo').find('.fa-chevron-circle-up').removeClass('fa fa-chevron-circle-up').addClass('lnil lnil-chevron-down-circle').css("font-size","20px");
	$(".cloudsinfo").css('height','80px');
	$('#manageclouddiv #manageInfoHr').css('display','none');
    $(this).removeClass('lnil lnil-chevron-down-circle').addClass('fa fa-chevron-circle-up').css("font-size","22px");
    CFManageCloudAccountsAjaxCall.getAllCloudDetails($($parentTr).attr('id'));
});
$(document).on('click','#manageclouddiv .getCloudsInfo .fa-chevron-circle-up',function () {
    sendGAEvents("Clicked on minus icon to hide cloud information");
    $(this).removeClass('fa fa-chevron-circle-up').addClass('lnil lnil-chevron-down-circle').css("font-size","20px");
	$('#manageclouddiv #manageInfoHr').css('display','none');
	$(".cloudsinfo").css('height','80px');
    $('#manageclouddiv .appendcloudDetails').html('').css('display','none');
});

$(document).on('click','#manageclouddiv .appendcloudDetails .innerPlus .failedUsers',function () {
    sendGAEvents("Clicked on plus icon to show failed users list for a cloud");
    var $parentTr = $(this).closest( ".innerPlus" ); 
    $('#manageclouddiv .appendcloudDetails .appendUsersList').html('').css('display','none');
    $('#manageclouddiv .appendcloudDetails .innerPlus').find('.failedUsersminus').removeClass('failedUsersminus').addClass('failedUsers');
    $(this).removeClass('failedUsers').addClass('failedUsersminus');
    CFManageCloudAccountsAjaxCall.failedUserDetails($($parentTr).attr('id'));
});
$(document).on('click','#manageclouddiv .appendcloudDetails .innerPlus .failedUsersminus',function () {
    sendGAEvents("Clicked on plus icon to hide failed users list for a cloud");
    $(this).removeClass('failedUsersminus').addClass('failedUsers');
    $('#manageclouddiv .appendcloudDetails  .appendUsersList').html('').css('display','none');
});

$(document).on('click','#manageclouddiv #reAuthorizeCld',function () {
    sendGAEvents("Clicked on reauthorize cloud");
	//activecampaign.eventTrack('Reauthorize cloud',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    var cldName = $(this).parent().siblings(".getCloudsInfo").attr('name');
    var cldId = $(this).parent().siblings(".getCloudsInfo").attr('id');
    var parent = $(this);
    parent.css('display', 'none');
    parent.next().css('display', '').addClass('retry');
    cloudStatus(cldId,cldName,parent);

});
function cloudStatus(cldId,cldName,parent) {
    $.ajax({
        type: "GET",
        url: apicallurl + "/users/"+localStorage.getItem('UserId')+"/"+cldId+"/updateRootFolder?cloudName="+cldName,
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            if(data === "success"){
                cloudAddingStatus(cldId,parent);
            }
        }
    }); 
}
function cloudAddingStatus(cldId,parent) {
    $.ajax({
        type: 'GET',
        async: false,
        url: apicallurl + "/users/" + localStorage.getItem("UserId") + "/" + cldId + "/status",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("UserAuthDetails"),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
        },
        success: function (data) {
            if (data.reauthorization == true) {
                if(data.notProvisioned === null || data.notProvisioned === 0){
                    parent.next().css('display','none').removeClass('retry');
                    parent.css('display','');
                }
                else{
                    parent.next().css('display','none').removeClass('retry');
                    parent.css('display','');
                }
                var usersCount = data.provisionedClouds;
                var _parent =  $('#manageclouddiv #' + cldId).children('.'+ cldId).children('#incrementProgress');
                var wid = Math.round(usersCount/data.totolClouds*100);
                if (data.notProvisioned !== data.totolClouds) {
                    if (wid === 0) {
                        wid = 2;
                    }
                }
                $('.userCount'+cldId).siblings('.progress').find('.progressGreen').css('width', wid+'%');
                 //To Test
		 CFManageCloudAccountsAjaxCall.getAllClouds();
                _parent.children('div').find('.progressGreen').css('width', wid+'%');
                if(data.notProvisioned > null || data.notProvisioned > 0){
                    _parent.children('.progress').css('background','#d9534f');
                }
                 $('.userCount'+cldId).text(usersCount+' out of '+data.totolClouds+' Users');
                _parent.find('#usersDisplay').text(usersCount+' out of '+data.totolClouds+' Users');
            }
            else {
                parent.css('display','none');
                parent.next().css('display','').addClass('retry');
                setTimeout(function () {
                    cloudAddingStatus(cldId,parent);
                }, 15000);
            }
        },
    });
}
function checkIsaCustomUserForLogin(_userId) {
    var valid = false;
    var _url = apicallurl + "/report/entuser/validate/"+_userId;//+localStorage.getItem("UserId");
    $.ajax({
        type: "GET",
        url: _url,
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (result) {
            //alert("@ checkIsaCustomUser result22 = "+result);
            if(result == true){
                valid = true;
            }else{
                valid = false;
            }
        }
    });
    return valid;
}
/*$(document).find('#teamOpted').click(function () {
    if(AllCloudsInfo.length !== 0){
        for(var i=0;i<AllCloudsInfo.length;i++) {
            if (AllCloudsInfo[i].userType === "ADMIN") {
			activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'teamMigrationOpted','Yes');
             //   zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail, 'teamMigrationOpted');
                break;
            }
        }
    }

});*/
$(document).on('click',"#dataDtls",function(){
	var id=$(this).parents('td').attr('id');
	$.ajax({
        type: "GET",
        url: apicallurl + "/mapping/download/userdata?adminCloudId=" + id,
        async: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        complete: function (xhr) {
            var data = xhr.responseText;
            if (xhr.status == 200) {
                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'user_data_report_' + id + '.csv';
                document.body.appendChild(link);
                link.setAttribute("type", "hidden");
                link.click();
            }
			else if (xhr.status == 202) {
                alertSuccess("Report is in Progress,will be ready in few minutes");
		//$("#dataDtls").trigger('click');
            }
           
        }
    });
});
/*$(document).find('.active').click(function () {
        if(localStorage.getItem("MigtnDone") === "consumer" || localStorage.getItem("MigtnDone") === "multiUser"){

        }
        else{
            zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,'navClick',"","","","");
        }

    });*/
/*$(document).on('click', '#failedUsersReport',function () {
    var admincloudId =$(this).parent().parent().attr('data-cloud') ;
    var cloudName = $(this).parent().siblings().find('.Driveicon1').attr('id');
        $.ajax({ 
            type: "GET",
            url: apicallurl + "/users/download/unprovisioned/"+admincloudId+"?cloudName="+cloudName,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            },
            success: function (data, textStatus, xhr) {
                var response = xhr.getResponseHeader("Content-Disposition").trim(); 
                var fileName = response.split('=')[1];
                Users = data;
                Users = "data:application/csv," + encodeURIComponent(Users);
                var x = document.createElement("a");
                x.setAttribute("href", Users);
                x.setAttribute("download", fileName);
                document.body.appendChild(x);
                x.click();
            },

            error: function (err) {
                console.error(err);
            }
        });
}); */

