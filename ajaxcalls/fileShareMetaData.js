var fileDetails;
var CFHPlistview = {
    listView: $('#mainContent .panel-data .LVfileName a'),
    selectCheckbox: $('#mainContent .LVcheckBox input[type="checkbox"]'),
    removeComments: function (commentId) {
        var apiUrl = apicallurl+"/comments/" + commentId;
        $.ajax({
            type: "DELETE",
            url: apiUrl,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function () {
            },
            complete:function(xhr, statusText,res){
                if(xhr.status > 300){
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },

    updateComments: function (commentData, commentId) {
        var apiUrl = apicallurl+"/comments/update/" + commentId + "?comment=" + commentData+"";
        $.ajax({
            type: "POST",
            url: apiUrl,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (comments) {
                var commentInfo=comments;
                $('[cid="'+commentId+'"]').parents("li").html('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;">  Posted by '+commentInfo.user.lastName+', '+jQuery.timeago(commentInfo.commentDate)+' </div> <div class="user-content" style="font-size:20px;">'+commentInfo.comment+'</div> <div class="btn-group"><button class="button  mini" cid='+commentInfo.id+' id="editComment"><i class="icon-pencil"></i> Edit</button><button class="button  mini" cid='+commentInfo.id+' style="margin-left: 5px;" id="deleteComment"><i class="icon-remove"></i> Delete</button></div></div>');
            },
            complete:function(xhr, statusText){
                if(xhr.status > 300){
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    updateStatus: function (status,fid) {
        $.each(fid,function(i,f){
            var apiUrl = apicallurl+"/fileshare/updatestatus/"+status+"?fileId="+encodeURIComponent(f);
            $.ajax({
                type: "POST",
                url: apiUrl,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function () {
                },
                complete:function(xhr, statusText){
                    if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                        showNotyNotification("error","Operation Failed");
                    }
                }
            });
        });
    },
    getFileComments: function (fileId) {
        var fileComments;
        var apiUrl = apicallurl+"/comments/file?fileId=" + fileId;
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
            success: function (fileCommentsData) {
                fileComments = fileCommentsData;
            },
            complete:function(xhr, statusText){
                if(xhr.status > 300){
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
        return fileComments;
    },

    getFileDetails: function (fileid,cid) {
        var apiUrl;
        var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
        var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
        var _check = sessionStorage.getItem("source");
        //sessionStorage.removeItem("source");
	if((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source") ||(_srcCldName === "SHARED_DRIVES" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination") ||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")){
       /*  if((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")){*/
            apiUrl = apicallurl+"/filefolder/onlineSync?fileId="+encodeURIComponent(fileid)+"&fetchCollabInfo=true";
        }

	else if(!((_srcCldName === "WASABI" && _check === "source")||(_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "GOOGLE_STORAGE" && _check === "source")||(_srcCldName === "AZURE_OBJECT_STORAGE" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "source")||(_srcCldName === "AMAZON" && _check === "source") || (_srcCldName === "SHARED_DRIVES" && _check === "source")||(_dstnCldName === "WASABI" && _check === "destination") ||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "GOOGLE_STORAGE" && _check === "destination")||(_dstnCldName === "AZURE_OBJECT_STORAGE" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID" && _check === "destination")||(_dstnCldName === "AMAZON" && _check === "destination")||(_dstnCldName === "SHARED_DRIVES" && _check === "destination")))
      /*   else if(!((_srcCldName === "DROP_BOX" && _check === "source")||(_srcCldName === "ONEDRIVE" && _check === "source")||(_srcCldName === "G_DRIVE" && _check === "source")||(_srcCldName === "BOX" && _check === "source")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "source")||(_dstnCldName === "DROP_BOX" && _check === "destination")||(_dstnCldName === "ONEDRIVE" && _check === "destination")||(_dstnCldName === "G_DRIVE" && _check === "destination")||(_dstnCldName === "BOX" && _check === "destination")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER" && _check === "destination")))*/
            apiUrl = apicallurl+"/filefolder/info?fileId="+encodeURIComponent(fileid)+"&fetchCollabInfo=true";
 
        if(cid == undefined) {
            apiUrl += "&cloudId="
        }else{
            apiUrl += "&cloudId="+cid
        }
        var fileDetails = null;
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
            success: function (fileDetailsData) {
                return fileDetails = fileDetailsData;
            },
            complete:function(xhr, statusText){
                if(xhr.status == 404){
                    return fileDetails = null;
                }else if(xhr.status == 500){
                    return fileDetails = null;
                }
                else if(xhr.status > 300){
                    showNotyNotification('error','Operation failed.');
                }
            }
        });
        return fileDetails;
    },

    showMetaData: function (curEle, fileId, fileObj) {
        var addedOnData;
        var objSize;
        var metaData = '<div class="defaultFloat Metacontainer" id="Metacontainer">';
        var thumbimg;
        var imgSrc;
        var pagename = PageName;
        var objectName;
        var objExtn;
        if(pagename == "Share with Me" || pagename == "Share by Me" || pagename == "InnerWorkSpace"){
            objectName=fileObj.file.objectName;
            objExtn=fileObj.file.objectExtn;
            addedOnData=fileObj.file.createdTime;
            objSize=fileObj.file.objectSize;
            thumbimg = fileObj.file.thumbLink;
        }else{
            objectName=fileObj.objectName;
            objExtn=fileObj.objectExtn;
            addedOnData=fileObj.createdTime;
            objSize=fileObj.objectSize;
            thumbimg = fileObj.thumbLink;
        }

        if(thumbimg == null){
            imgSrc = "../img/profileImage.PNG";
        }else{
            imgSrc = thumbimg;
        }
        addedOnData = CFManageCloudAccountsAjaxCall.getDateConversion(addedOnData);
        objSize = CFManageCloudAccountsAjaxCall.getObjectSize(objSize);
        metaData = metaData + '<div class="col-md-3"><div class="previewthumb"><img class="img-responsive" src="'+imgSrc+'" /></div>';
        metaData = metaData + '<div class="metadata"><p>' + objectName + '<i class="editFilename"></i></p>';
        metaData = metaData + '<p>Added on : ' + addedOnData + '</p><p>File Type : ' + objExtn + '</p>';
        metaData = metaData + '<p>File Size : ' + objSize + '</p></div><div class="metadatacontrols">';
        metaData = metaData + '<input type="password" class="form-control" placeholder="Set Password" /><input type="text" class="calendar" id="datepicker" placeholder="MM/DD/YYYY" data-days="" val=""/>';
        metaData = metaData + '<a href="#" class="btn default metaBtn" ><strong>Find Duplicates</strong></a>';
        metaData = metaData + '<a href="#" class="btn default metaBtn"><strong>Find Versions</strong></a>';
        metaData = metaData + '</div></div><div class="col-md-9 content"><div class="panel-group" id="accordion">';
        metaData = metaData + '<div class="panel panel-default"><div class="panel-heading shared-heading"><h4 class="panel-title">';
        metaData = metaData + '<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Shared With - <span id="sharedCount"></span></a><i class="cancleUpdate btn3 btn-secondary">Cancel</i><i class="addNewemail btn3 btn-secondary">Add New</i><input type="button" name="Edit" class="saveEmail pull-right btn3 btn-secondary" value="Edit"/></h4></div>';
        metaData = metaData + '<div id="collapseOne" class="panel-collapse collapse shared-data">';
        metaData = metaData + '<div class="panel-body">';
        metaData = metaData + '<div class="emailsList"><div class="shareEmails">Shared with</div><div class="readEmail">Read</div><div class="editEmail">Edit</div><div class="coOwnerEmails">CoOwner</div></div>';
        metaData = metaData + '</div></div></div><div class="panel panel-default">';
        //Tags
        metaData = metaData + '<div class="panel-heading tags-heading"><h4 class="panel-title">';
        metaData = metaData + '<a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Tags - <span id="tagsCount"></span></a>';
        metaData = metaData + '</h4></div><div id="collapseTwo" class="panel-collapse collapse tags-data">';
        metaData = metaData + '<div class="panel-body">';
        metaData = metaData + '<div id="addTags" class="ms-ctn ms-ctn-bootstrap-focus" style="width: 250px; float: left;"><div id="ms-trigger-1" class="ms-trigger"><div class="ms-trigger-ico"></div></div><input id="ms-input-1" type="text" class="" value="Type or click here" style="width: 208px;"><div class="ms-helper " style="display: none;">No suggestions</div></div>';
        metaData = metaData + '</div></div></div><div class="panel panel-default">';
        //Comments
        metaData = metaData + '<div class="panel-heading  comments-heading"><h4 class="panel-title">';
        metaData = metaData + '<a data-toggle="collapse" data-parent="#accordion" href="#collapseThree">Comments - <span id="commentCount"></span></a></h4></div>';
        metaData = metaData + '<div id="collapseThree" class="panel-collapse collapse comments-data">';
        metaData = metaData + '<div class="panel-body"><div class="commentContainer"><textarea rows="1" cols="50"  class="form-control"></textarea>';
        metaData = metaData + '<button type="button" name="addComment" class="pull-right btn3 btn-secondary">Add Comment</button></div>';
        metaData = metaData + '</div></div></div></div></div></div>';

        $('#Metacontainer').remove();
        curEle.after(metaData);
        $('#Metacontainer').slideUp(0).slideDown();

        var currentDate = new Date(); // Todays date
        $('#mainContent').find("#datepicker").datepicker({
            inline: true,
            showOtherMonths: true,
            dateFormat: 'mm/dd/yy',
            onSelect: function (date) {
                var selectedDate = $('#datepicker').datepicker('getDate');
                Date.prototype.DaysBetween = function () {
                    var intMilDay = 24 * 60 * 60 * 1000;
                    var intMilDif = arguments[0] - this;
                    return Math.floor(intMilDif / intMilDay);
                };
                var days = currentDate.DaysBetween(selectedDate);
                $(this).attr('data-days', days);
            }
        });

    },
    selectFiles: function () {
    },
    commentsDisplay: function (fileId) {
        var commentsData = CFHPlistview.getFileComments(fileId);
        var commentsLength = commentsData.length;
        var cname = JSON.parse(localStorage.getItem('CFUser'));
        var commentsContainer = $("#mainContent").find('.comments-data').children('.panel-body');
        commentsContainer.find('p').remove();
        for (var i = 0; i < commentsLength; i++) {
            var createdDate = CFManageCloudAccountsAjaxCall.getDateConversion(commentsData[i].user.createdDate);
            commentsContainer.append('<p id="' + commentsData[i].id + '"><b>' + commentsData[i].user.userName + '<i> -' + createdDate + '</i></b></br><i class="commentData">' + commentsData[i].comment + '</i><i class="editComments"></i><i class="removeComments"></i></p>');
        }
    },
    addCommenttoFile: function (fileId, thisData) {
        var ajaxUrl = apicallurl+"/comments/create?fileId=" + fileId + "&comment=" + thisData+"&workspaceId="+WorkSpaceId+"";
        $.ajax({
            url: ajaxUrl,
            type: 'PUT',
            dataType: 'json',
            data: 'commentObj',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (comments) {
                $('#workspaceAct').html('');
                workspaceActicities(WorkSpaceId, 1);
                $('#fileComments').prepend('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Posted by '+localStorage.getItem("UserName")+', '+jQuery.timeago(comments.commentDate)+' </div> <div class="user-content" style="font-size:20px;">'+comments.comment+'</div> <div class="btn-group"><button class="button  mini" cid='+comments.id+' id="editComment"><i class="icon-pencil"></i> Edit</button><button cid='+comments.id+' class="button  mini" style="margin-left:5px;" id="deleteComment"><i class="icon-remove"></i> Delete</button></div></div></li>');
            },
            complete:function(xhr, statusText){
                if(xhr.status > 300){
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    getFileShare: function (fileID) {
        var fileShareData;
        var apiUrl = apicallurl+"/fileshare/file?fileId=" + fileID + "&fetchCollabInfo=true";
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
            success: function (fileShareDetails) {
                fileShareData = fileShareDetails;
            },
            statusCode:{
                404: function(){
                    fileShareData = 0;
                }
            }
        });
        return fileShareData;
    },
    getPublicFileShare: function (fileID) {
        var fileShareData;
        var apiUrl = apicallurl+"/fileshare/openfileshare?fileId=" + encodeURIComponent(fileID);
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
            success: function (fileShareDetails) {
                fileShareData = fileShareDetails;
            },
            statusCode:{
                404: function(){
                    fileShareData = 0;
                }
            }
        });
        return fileShareData;
    },
    //Display share with emails
    sharedFilesWith: function (fileId) {
        var fileShareData = CFHPlistview.getFileShare(fileId);
        var readEmailsLength=0;
        var editEmailsLength=0;
        var coOwnerEmailsLength=0;
        if(fileShareData.readEmails != null){
            readEmailsLength = fileShareData.readEmails.length;
        }
        if(fileShareData.editEmails != null){
            editEmailsLength = fileShareData.editEmails.length;
        }
        if(fileShareData.coOwnerEmails != null){
            coOwnerEmailsLength = fileShareData.coOwnerEmails.length;
        }
        var sharedcount = readEmailsLength + editEmailsLength + coOwnerEmailsLength;

        var fileShareContainer = $("#mainContent").find('.shared-heading').siblings('.shared-data').children('.panel-body');

        for (var i = 0; i < readEmailsLength; i++) {
            fileShareContainer.append('<p></i><span class="allEmails">' + fileShareData.readEmails[i] + '</span><input type="checkbox" name="readEmail" checked> <input type="checkbox" name="editEmails"> <input type="checkbox" name="coOwnerEmails"><i class="deleteEmail"></p>');
        }
        for (var i = 0; i < editEmailsLength; i++) {
            fileShareContainer.append('<p><span class="allEmails">' + fileShareData.editEmails[i] + '</span><input type="checkbox" name="readEmail" checked> <input type="checkbox" name="editEmails" checked> <input type="checkbox" name="coOwnerEmails" ><i class="deleteEmail"></p>');
            for (var j = 0; j < readEmailsLength; j++) {
                if (fileShareData.readEmails[j] == fileShareData.editEmails[i]) {
                    var selectedFile = fileShareContainer.children().children("span:contains(" + fileShareData.readEmails[j] + ")");
                    selectedFile.siblings('input[name="editEmails"]').attr('checked', 'checked');
                    selectedFile.parent("p:not(:eq(0))").remove();
                }
            }
        }
        for (var i = 0; i < coOwnerEmailsLength; i++) {
            fileShareContainer.append('<p><span class="allEmails">' + fileShareData.coOwnerEmails[i] + '</span><input type="checkbox" name="readEmail" checked> <input type="checkbox" name="editEmails" checked disabled="disabled"> <input type="checkbox" name="coOwnerEmails" checked><i class="deleteEmail"></p>');
            for (var j = 0; j < readEmailsLength; j++) {
                if (fileShareData.readEmails[j] == fileShareData.coOwnerEmails[i]) {
                    var selectedFile = fileShareContainer.children().children("span:contains(" + fileShareData.readEmails[j] + ")");
                    selectedFile.siblings('input[name="coOwnerEmails"]').attr('checked', 'checked');
                    selectedFile.parent("p:not(:eq(0))").remove();
                }
            }
            for (var k = 0; k < editEmailsLength; k++) {
                if (fileShareData.editEmails[k] == fileShareData.coOwnerEmails[i]) {
                    var selectedFile = fileShareContainer.children().children("span:contains(" + fileShareData.editEmails[k] + ")");
                    selectedFile.siblings('input[name="coOwnerEmails"]').attr('checked', 'checked');
                    // selectedFile.parent('p:eq(1)').remove();
                    selectedFile.parent("p:not(:eq(0))").remove();
                }
            }
        }
    },
    //Add New FileShare email
    addNewFileshare: function (addFileObj,domainAdd,notes){
        var apiurl = apicallurl+"/fileshare/create?domainUrl="+domainUrl+""+domainAdd+"&notes="+notes;
        $.ajax({
            url: apiurl,
            type: "PUT",
            cache:false,
            data: addFileObj,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (addFileObj) {
                unCheckFile();

            },
            complete:function(xhr, statusText){
                if(xhr.status == 200){
                    //$.smallBox({title:"File(s) has been successfully shared.",color:"#1ba1e2",timeout:notifyTime,sound:false});
                    showNotyNotification("notify","File(s) has been successfully shared.");
                }
                else if(xhr.status > 300){
                    unCheckFile();
                    //$.smallBox({title:"Operation Failed.",color:"#1ba1e2",timeout:notifyTime,sound:false});
                    showNotyNotification("notify","Operation Failed.");
                }
            }
        });
    },
    //Add FileShare email
    addFileshare: function (addFileObj,notes) {
        var apiurl = apicallurl+"/fileshare/add/collab?domainUrl="+domainUrl+"publicNew&notes="+notes;
        $.ajax({
            url: apiurl,
            type: "POST",
            cache:false,
            data: addFileObj,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (addFileObj) {
                unCheckFile();
            },
            complete:function(xhr, statusText){
                if(xhr.status == 200) {
                    //$.smallBox({title:"Collaborator added successfully.",color:"#1ba1e2",timeout:notifyTime,sound:false});
                    showNotyNotification("notify","Collaborator added successfully.");
                }
                if(xhr.status > 300){
                    unCheckFile();
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    //Delete FileShare email
    removeFileshare: function (deleteObj,fileId) {
        var apiurl = apicallurl+"/fileshare/remove/collab";
        $.ajax({
            url: apiurl,
            type: "POST",
            data: deleteObj,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (deleteObj) {
                unCheckFile();
                $('[id="'+fileId+'"]').parent('.panel-data').remove();
                $('[id="'+fileId+'"]').parent('.file').remove();
                if($('#LVContent').children('div').length == 0){
                    $('.LVHcheckBox input').prop("disabled",true);
                }
            },
            complete:function(xhr, statusText){
                if(xhr.status > 300){
                    unCheckFile();
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    //Delete FileShare For SharedByMe Page
    deleteFileshare: function (fid) {
        var fileid = encodeURIComponent(fid);
        var apiurl = apicallurl+"/fileshare/delete?fileId="+fileid;
        $.ajax({
            url: apiurl,
            type: "DELETE",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (deleteObj) {
                $('#page-header .LVfileName[id="'+fid+'"]').parent().remove();
                $('#page-header strong.filename[id="'+fid+'"]').parent().remove();
                if($('#LVContent').children('div').length == 0){
                    $('.LVHcheckBox input').prop("disabled",true);
                }
            },
            complete:function(xhr, statusText){
                if(xhr.status > 300){
                    unCheckFile();
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    //Updated shared with
    updateEmailsShared: function (updateEmail) {
        var apiurl = apicallurl+"/fileshare/edit/permissions?domainUrl="+domainUrl;
        $.ajax({
            url: apiurl,
            type: "POST",
            cache:false,
            data: updateEmail,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (updateEmail) {
                unCheckFile();
                $("#mainContent").find('.shared-data').find('input[name="readEmail"]:checked').prop("disabled", true);
            },
            complete:function(xhr, statusText){
                if(xhr.status == 200){
                    //$.smallBox({title:"Updated file share permissions successfully.",color:"#1ba1e2",timeout:notifyTime,sound:false});
                    showNotyNotification("notify","Updated file share permissions successfully.");
                }
                if(xhr.status > 300){
                    unCheckFile();
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    //Modify Share
    modifyShare: function (objectdata,notes) {
        var apiurl = apicallurl+"/fileshare/modify?notes="+notes;
        $.ajax({
            url: apiurl,
            type: "POST",
            cache:false,
            data: objectdata,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (thisObject) {
                var file = thisObject.file;
                var _listStaus = $('#LVContent .LVfileName[id="'+file.id+'"]').find('sup:eq(0)');
                var _thumbStatus = $('#ThumbnailContent .filename[id="'+file.id+'"]').parent('div').find('sup');
                _listStaus.removeAttr('class');
                _thumbStatus.removeAttr('class');
                if(thisObject.sharePassword != "NOT_REQUIRED"){
                    _listStaus.addClass('Protected');
                    _thumbStatus.addClass('LVPublic Protected');
                }
                else{
                    _listStaus.addClass(thisObject.status);
                    _thumbStatus.addClass('LVPublic '+thisObject.status+'');
                }
                unCheckFile();
            },
            complete:function(xhr, statusText){
                if(xhr.status > 300){
                    unCheckFile();
                    //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },
    //File/Floder Rename
    renameFileFolder: function (fileId, editedVal, cloudId,renameObject) {
        editedVal = encodeURIComponent(editedVal);
        function contactus_formfield(boundary, name, value) {
            var text = "";
            text += '' + boundary + '\r\n' + 'Content-Disposition: form-data; name="';
            text += name;
            text += '"\r\n\r\n';
            text += value;
            text += '\r\n';
            return text;
        }

        var boundary = '----WebKitFormBoundary' + Math.floor(Math.random() * 32768) + Math.floor(Math.random() * 32768) + Math.floor(Math.random() * 32768);

        var data = "";
        data += contactus_formfield(boundary, "fileId", fileId);
        data += contactus_formfield(boundary, "newName", editedVal);
        data += contactus_formfield(boundary, "cloudId", cloudId);
        data += boundary;
        var apiUrl = apicallurl + "/filefolder/rename";
        var sharedFolderID = "";
        if (PageName == "InnerWorkSpace") {
            var sid = $('#workspaceFiles').find('.cf-back').attr('sid');
            if(sid == undefined){
                sharedFolderID = "";
            }else {
                sharedFolderID = sid;
            }
            apiUrl += "?workspaceId="+WorkSpaceId+"&sharedFolderId="+encodeURIComponent(sharedFolderID);
        }
        if(previousPage == "Share by Me"){
            var sid = $('#breadCrumbdync').children('li:eq(1)').attr('id');
            if(sid != undefined && sid != "undefined"){
                sharedFolderID = sid;
                apiUrl += "?sharedFolderId="+encodeURIComponent(sharedFolderID);
            }
        }
        else if(previousPage == "Share with Me"){
            var sid = $('#breadCrumbdync').children('li:eq(1)').attr('id');
            if(sid != undefined && sid != "undefined"){
                sharedFolderID = sid;
                apiUrl += "?sharedFolderId="+encodeURIComponent(sharedFolderID);
            }
        }
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: false,
            dataType: "json",
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
            },
            success: function (object) {
                renameObject = object;
                if (renameObject.directory == false) {
                    //$.smallBox({title: "File renamed successfully.", color: "#1ba1e2", timeout: notifyTime, sound: false});
                    showNotyNotification("notify","File renamed successfully.");
                }else {
                    //$.smallBox({title: "Folder renamed successfully.", color: "#1ba1e2", timeout: notifyTime, sound: false});
                    showNotyNotification("notify","Folder renamed successfully.");
                }
                unCheckFile();
            },
            complete: function (xhr) {
                var test = xhr.getResponseHeader('exception');
                if (xhr.status == 406) {
                    renameObject = null;
                    showNotyNotification('notify',test + ".");
                    //$.smallBox({title: test + ".", color: "#1ba1e2", timeout: notifyTime, sound: false});
                    $('#ListContent').find('.renameInput').css('border-color', 'red');
                }else if (xhr.status == 404) {
                    renameObject = null;
                    if (PageName == "InnerWorkSpace") {
                        test = "Source file may have been deleted / moved. Please remove and add the file in the workspace";
                    }
                    showNotyNotification('error',test + ".");
                }else if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
        return renameObject;
    },

    init: function () {
        CFHPlistview.selectFiles();
        var fileId;
        var cloudId;
        $('#mainContent').not('#ThumbnailContent .addFilethumb').on('click', '#ThumbnailContent .file a', function () {
            fileId = $(this).attr('id');
            cloudId = $(this).parent().attr('id');
        });
        /*$('#mainContent').on('click', '.panel-data .LVfileName a', function () {
            fileId = $(this).parent('.LVfileName').attr('id');
            cloudId = $(this).parents('.panel-data').children('.LVdrive').attr('id');
            var offset = $( this ).offset();
            offset = offset.top;
            if (!$(this).hasClass('active')) {
                unCheckFile();
                var curEle = $(this).parent().parent();
                var pagename = PageName;
                var commentsCount;
                var sharedCount;
                var tagsCount;
                var fileShared;
                if(pagename == "Share with Me" || pagename == "Share by Me" || pagename == "InnerWorkSpace"){
                    var fileObj = CFHPlistview.getFileShare(fileId);
                    commentsCount = fileObj.file.commentsCount;
                    sharedCount = fileObj.file.sharedCount;
                    tagsCount = fileObj.file.tags.length;
                    fileShared=true;
                }else{
                    var fileObj = CFHPlistview.getFileDetails(fileId);
                    commentsCount = fileObj.commentsCount;
                    sharedCount = fileObj.sharedCount;
                    tagsCount = fileObj.tags.length;
                    fileShared=fileObj.fileShared;
                }
                CFHPlistview.showMetaData(curEle, fileId, fileObj);
                $('#Metacontainer').append('<i id="closeMetaCont">X</i>');
                CFHPlistview.listView.removeClass('active');
                $(this).addClass('active');
                $('#mainContent').find('#sharedCount').html(sharedCount);
                $('#mainContent').find('#commentCount').html(commentsCount);
                $('#mainContent').find('#tagsCount').html(tagsCount);
                $("#mainContent").find('p').find('input[name="readEmail"], input[name="editEmails"], input[name="coOwnerEmails"]').attr("disabled", true);
                $("#mainContent").find('.saveEmail, .addNewemail').hide();
            }else {
                $('#Metacontainer').slideUp();
                $(this).removeClass('active');
            }
            return false;
        });*/

        $('#mainContent').on('click', '.tags-heading a', function () {
            //Adding Tags
            if(!$('#mainContent').find('.tags-data').hasClass('in')){
                var tagsData = CFHPlistview.getFileTags(fileId);
                var userId=localStorage.getItem('UserId');
                var tagLength = tagsData.length;
                var tLength=0;
                for (var i = 0; i < tagLength; i++) {
                    if(userId == tagsData[i].user.id){
                        tLength=tLength+1;
                    }
                }
                var tagContainer = $(this).parents('.tags-heading').siblings('.tags-data').children('.panel-body');
                $('#mainContent').find('#tagsCount').html(tLength);
                tagContainer.find('p').remove();
                for (var i = 0; i < tagLength; i++) {
                    var userId=localStorage.getItem('UserId');
                    if(userId == tagsData[i].user.id){
                        tagContainer.append('<p id="' + tagsData[i].id + '"><i class="fileTag">' + tagsData[i].tag + '</i><i class="editFileTag"></i> <i class="removeFileTag"></i></p>');
                    }
                }

                $("#mainContent").find('input.saveEmail, .addNewemail, .cancleUpdate').hide();
                $("#mainContent").find('input[value="Save"]').val('Edit');
                var alluserTags = CFHPlistview.getallTagsofUser();
                var addTags = tagContainer.find('#addTags');

                var ms = $(addTags).magicSuggest({
                    width: 250,
                    sortOrder: 'tagName',
                    selectionPosition: 'right',
                    displayField: 'tagName',
                    data: alluserTags
                });

                $(ms).on('selectionchange', function (event, combo, selection) {
                    var tagId = $('#mainContent').find('.ms-sel-ctn').find('input').val();
                    var thisObject = [];
                    thisObject = ms.getValue([]);
                    var thisObjectLength = thisObject.length;
                    var selectedTagID = thisObject[thisObjectLength - 1];
                    var thistext = $('#mainContent').find('.ms-sel-ctn').find('.ms-sel-item:last').text();
                    var tlength=$('#addTags').siblings('p').length;
                    var bool;
                    for(var i=0;i<tlength;i++){
                        var text=$('#Metacontainer i.fileTag:eq('+i+')').text();
                        if(text == thistext){
                            bool =true;
                        }
                    }
                    if(bool == true){
                        $('#addTags').css("border","red");
                        return false;
                    }
                    tagContainer.find('#addTags').after('<p id="' + selectedTagID + '"><i class="fileTag">' + thistext + '</i><i class="editFileTag"></i> <i class="removeFileTag"></i></p>');
                    //tags count
                    var tagsCount = $('#mainContent').find('.tags-data .panel-body p').size();
                    $('#mainContent').find('#tagsCount').html(tagsCount);
                    if (selectedTagID == thistext) {
                        //var newTagcreated = thistext;
                        CFHPlistview.createTagsGlobal(thistext, fileId);
                    } else {
                        CFHPlistview.addTagtoFiles(selectedTagID, fileId);
                    }
                });
            }
        });

        //Update File name
        $('#mainContent').on('click', '.editFilename', function () {
            var thisParent = $(this).parent('p');
            var MfileIcon = thisParent.parents('.Metacontainer').prev('.panel-data').find('.LVfileName').attr('name');
            var MfileExten = thisParent.parents('.Metacontainer').prev('.panel-data').find('.LVfileName').children('p').attr('fexten');
            var FileIcon;
            if(MfileIcon == "FILE"){FileIcon = "LVFILE";}
            if(MfileIcon == "FOLDER"){FileIcon = "LVFOLDER";}
            var currentFilename = thisParent.text();
            thisParent.html('<input type="text" value="' + currentFilename + '" class="categoryInput"/>');
            $(this).parent('p').remove();
            var editTagInput = $('.categoryInput');
            editTagInput.val(currentFilename);
            $('.categoryInput').focus();
            $('.categoryInput').focusout(function(){
                $(this).parent('p').html(currentFilename);
                $('.metadata').children('p:first').append('<i class="editFilename"></i>');
            });

            editTagInput.keydown(function(event)
            {
                var inputValue = $(this).val();
                if (event.keyCode == 13) {
                    thisParent.html('<p>' + inputValue + '<i class="editFilename"></i></p>');
                    thisParent.parents('.Metacontainer').prev('.panel-data').find('.LVfileName').html('<i class="'+FileIcon+' pull-left"></i><p class="pull-left" name="'+inputValue+'" fexten="'+MfileExten+'">'+inputValue+'</p><a href="#" title=""><i class="MetaDataIcon"></i></a>');
                    inputValue = CFManageCloudAccountsAjaxCall.getMaxChars(inputValue,14);
                    $('#mainContent').find('#ThumbnailContent .selected .filename').html(inputValue);
                    CFHPlistview.renameFileFolder(fileId, inputValue, cloudId);
                }else if(event.keyCode == 27){
                    var editedVal = $(this).val();
                    thisParent.text(editedVal);
                    $('.metadata').children('p:first').append('<i class="editFilename"></i>');
                }

            });
        });

        //RemoveTag form file
        $('#mainContent').on('click', '.removeFileTag', function () {
            var tagId = $(this).parent('p').attr('id');
            CFHPlistview.removeTagFile(tagId, fileId);
            $(this).parent('p').remove();
            //tags count
            var tagsCount = $('#mainContent').find('.tags-data .panel-body p').size();
            $('#mainContent').find('#tagsCount').html(tagsCount);
        });
        //Updated Tag
        $('#mainContent').on('click', '.editFileTag', function () {
            var tagId = $(this).parent('p').attr('id');
            var tagName = $(this).siblings('.fileTag').text();
            $(this).siblings('.fileTag').html('<input type="text" class="thisVal" value="' + tagName + '" autofocus/>');
            $('.fileTag .thisVal').focus();
            var tagInput = $('#mainContent').find('.fileTag input[type="text"]');

            $('.fileTag .thisVal').focusout(function(){
                $(this).parent('.fileTag').html(tagName);
            });
            tagInput.keypress(function (event) {
                var inputValue = $(this).val();
                if (event.keyCode == 13) {
                    var newTagName = inputValue;
                    CFHPlistview.updateTagFile(tagId, newTagName);
                    $(this).parent('.fileTag').html('<i class="fileTag">' + newTagName + '</i>');
                }
            });

        });

        $('#mainContent').on('click', '#closeMetaCont', function () {
            $('#Metacontainer').slideUp();
            $('.LVfileName a').removeClass('active');
            $(this).parents().parents().find('.selected').removeClass('active').removeClass('selected');
        });
        //Display Comment/GetComments for a File
        $('#mainContent').on('click', '.comments-heading a', function () {
            if(!$('#mainContent').find('.comments-data').hasClass('in')){
                CFHPlistview.commentsDisplay(fileId);
            }
            $("#mainContent").find('input.saveEmail, .addNewemail, .cancelUpdate').hide();
            $("#mainContent").find('input[value="Save"]').val('Edit');
        });
        //Add Comments / CreateComment on a File
        $('#mainContent').on('click', 'button[name="addComment"]', function () {
            var thisData = $(this).siblings('textarea').val();
            CFHPlistview.addCommenttoFile(fileId, thisData);
            $(this).siblings('textarea').val(" ");
        });
        //Remove Comments
        $('#mainContent').on('click', '.removeComments', function () {
            var commentId = $(this).parent('p').attr('id');
            CFHPlistview.removeComments(commentId);
            $(this).parent('p').remove();
            //comment count
            var commentCount = $('#mainContent').find('.comments-data .panel-body p').size();
            $('#mainContent').find('#commentCount').html(commentCount);
        });
        //updateComments
        $('#mainContent').on('click', '.editComments', function () {
            var thisComment = $(this).parent('p');
            var commentId = thisComment.attr('id');
            var currentCommentData = thisComment.find('i.commentData').text();
            thisComment.find('.editComments').hide();
            thisComment.find('i.commentData').html('<textarea rows="1" cols="50" autofocus>' + currentCommentData + '</textarea>');

            $('i.commentData textarea').focus();
            $('i.commentData textarea').focusout(function(){
                $(this).parent('i').html(currentCommentData);
                thisComment.find('.editComments').show();
            });

            thisComment.find('i.commentData textarea').keypress(function (event) {
                var commentData = $(this).val();
                if (event.keyCode == 13) {
                    thisComment.find('i.commentData').html(commentData);
                    thisComment.find('.editComments').show();
                    CFHPlistview.updateComments(commentData, commentId);
                }
            });
        });
        $('#mainContent').on('click', '.shared-heading a', function () {
            if(!$(this).parents('.shared-heading').siblings('.shared-data').hasClass('in')){
                $('#mainContent').find('.shared-data').find('p').remove();
                $("#mainContent").find('input.saveEmail').show();
                var pagename = PageName;
                var fileShared;
                if(pagename == "Share with Me" || pagename == "Share by Me" || pagename == "InnerWorkSpace"){
                    fileShared=true;
                }else{
                    var fileObj = CFHPlistview.getFileDetails(fileId);
                    fileShared=fileObj.fileShared;
                }
                if(fileShared == true){
                    CFHPlistview.sharedFilesWith(fileId);
                }
                $('#mainContent').find('#sharedCount').html();
                $("#mainContent").find('.shared-data').find('input:checkbox').each(function () {
                    $("#mainContent").find('.shared-data').find('input:checkbox').prop("disabled", true)
                });
                $("#mainContent").find('.shared-data').find('.deleteEmail').each(function () {
                    $("#mainContent").find('.shared-data').find('.deleteEmail').hide();
                });
            }
            else {
                $('#mainContent').find('.shared-data').find('p').remove();
                $("#mainContent").find('input.saveEmail').hide();
                $("#mainContent").find('input.saveEmail').val("Edit");
                $("#mainContent").find('.cancleUpdate').hide();
                $("#mainContent").find('.addNewemail').hide();
                $("#mainContent").find('.shared-data').find('.deleteEmail').each(function () {
                    $("#mainContent").find('.shared-data').find('.deleteEmail').hide();
                });
            };
        });
        //Add share email
        $('#mainContent').on('click', '.addEmail button', function () {
            var readEmail = $(this).parents('.addEmail').children('input[name="Email"]').val().toLowerCase();
            var emailCount = $('#mainContent').find('span.allEmails').length;
            var readEmailsVal = "",
                editEmailsVal = "",
                coOwnerEmailsVal = "";
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

            if (!emailReg.test(readEmail)) {
                //$('#CFsignupform .statusMesg').text('Please enter a valid e-mail address.');
                $(this).parents('.addEmail').children('input[name="Email"]').css('border-color', 'red');
                $('#CFSEmail').focus();
                return false;
            }
            for (var i = 0; i < emailCount; i++) {
                var availableEmail = $('#mainContent').find('.shared-data').children('.panel-body').children('p').children('span:eq(' + i + ')').text();
                if (readEmail == availableEmail) {
                    return false;
                }
            }

            // var fileID = "0An4WuuyeSWSbdFZKTVNucGhiZDRoczZCNEh2b2lYekE";
            var fileID = fileId;

            var addFileObj = {
                'fileId': fileID
            };

            if ($(this).siblings('input[name="coOwnerEmails"]').is(':checked')) {
                addFileObj.coOwnerEmails = readEmail;
                $(this).siblings('input[name="coOwnerEmails"],input[name="editEmails"],input[name="readEmail"]').attr('checked', 'checked');
                $(this).siblings('input[name="editEmails"]').attr('disabled', 'true');
            }
            if (!$(this).siblings('input[name="coOwnerEmails"]').is(':checked')){
                if ($(this).siblings('input[name="editEmails"]').is(':checked')) {
                    addFileObj.editEmails = readEmail;
                    $(this).siblings('input[name="editEmails"],input[name="readEmail"]').attr('checked', 'checked');
                }
            }
            if (!$(this).siblings('input[name="editEmails"]').is(':checked')) {
                if ($(this).siblings('input[name="readEmail"]').is(':checked')) {
                    addFileObj.readEmails = readEmail;
                }
            }
            var currentData = $(this).parent('.addEmail').html();
            $(this).parents('.emailsList').after('<p class="currentElem">' + currentData + '</p>');
            var currentElem = $('#mainContent').find('.currentElem');
            currentElem.children('input[type="text"], button').remove();
            currentElem.children('i').replaceWith('<i class="deleteEmail"></i>');
            currentElem.prepend('<span class="allEmails">' + readEmail + '</span>');
            $('#mainContent').find('.currentElem').removeClass('currentElem');
            $(this).parent('.addEmail').remove();
            //shared count
            var sharedCount = $('#mainContent').find('.shared-data .panel-body p').size();
            $('#mainContent').find('#sharedCount').html(sharedCount);
            //Call for New email
            var pcount = $('#mainContent').find('.shared-data ').children('.panel-body').find('p').size();
            if(pcount == 1){
                var addOnkeys = {"maxViews":"10000", "maxDays":"30", "status":"SHARED", "sharePassword":""};
                var addFileObj = $.extend( addOnkeys, addFileObj );
                CFHPlistview.addNewFileshare(addFileObj);
                return false;
            }
            //Call for Add email
            CFHPlistview.addFileshare(addFileObj);
        });
        //Addnewemail
        $('#mainContent').on('click', '.addNewemail', function () {
            if($('.addEmail:has(input type=["text"])').length > 0){
                return false;
            }
            var newEmaildata = '<div class="addEmail"><input type="text" name="Email" value=""/><input type="checkbox" name="readEmail" checked="" disabled> <input type="checkbox" name="editEmails"><input type="checkbox" name="coOwnerEmails"><i class="removeEmail"></i><button>Add</button></div>';
            $('#mainContent').find('.shared-data').find('.panel-body').children('div').append(newEmaildata);

            var emailValidat = $('#mainContent').find('.shared-data').find('.panel-body').find('.addEmail');
            emailValidat.on('click', 'input[name="coOwnerEmails"]', function () {
                if ($(this).is(':checked') == true) {
                    $(this).siblings('input[name="readEmail"], input[name="editEmails"]').prop('checked', true);
                    $(this).siblings('input[name="readEmail"], input[name="editEmails"]').prop("disabled", true);
                } else {
                    $(this).siblings('input[name="editEmails"]').prop("disabled", false);
                }
            });
        });
        $('#mainContent').on('click', '.removeEmail', function () {
            var thisaddEmail = $('#mainContent').find('.shared-data').find('.panel-body').find('.addEmail');
            thisaddEmail.remove();
        });

        /*Multiple Share*/
        $('#CFFileShare').click(function(){
            var email = $('#UserShareEmail').val().toLowerCase();
            var pwd = $('#UserSharePwd').val();
            var repwd = $('#UserShareRepwd').val();
            var comments=$('#UserShareComments').val();
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

            var maxDays = $('.addShareContent').find('input.calendar').attr('data-days');
            var lalength=$('#shareENames').children('i').length;
            var domainAdd;
            var status;
            var publiccheck = $('#CFPublic').prop('checked');

            if(maxDays.length == 0){
                maxDays = 30;
            }
            if(lalength <= 0){
                if(email == ""){
                    $('#shareFiles .statusMesg').text('Please enter email.');
                    $('#UserShareEmail').focus();
                    return false;
                }else if(email != ""){
                    email=email.split(',');
                    for(var i=0;i<email.length;i++){
                        if(!emailReg.test(email[i])){
                            $('#shareFiles .statusMesg').text('Please enter valid email address.');
                            $('#UserShareEmail').focus();
                            return false;
                        }
                        CFManageCloudAccountsAjaxCall.getSharefileUsername(email[i]);
                        $('#addUsersToShare').append('<p><span class="allemailsshare">'+email[i]+'</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails"><input type="checkbox" class="coowner" name="coOwnerEmails"><i class="deleteUserEmail"></i></p>');
                    }
                }
            }
            if(pwd != repwd){
                $('#shareFiles .statusMesg').text('Password and Reenter Password does not match.');
                $('#enterPswd').focus();
                return false;
            }
            bl1:
            {   var updateemail="";
                var emailCount = $('.addShareContent').find('span.allemailsshare').length;
                if(FromfileId.length == 1){
                    updateemail="";

                    for(var n=0;n<emailCount;n++){
                        var currentRow = $('.addShareContent').find('#addUsersToShare').children('p:eq(' + n + ')');
                        var currentEmail = currentRow.children('span').text();
                        if (currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
                            updateemail += 'coOwnerEmails=' + currentEmail + '&';
                            currentRow.children('input[name="coOwnerEmails"]').attr('checked', 'checked');
                        }
                        if (!currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
                            if (currentRow.children('input[name="editEmails"]').is(':checked')) {
                                updateemail += 'editEmails=' + currentEmail + '&';
                                currentRow.children('input[name="editEmails"]').attr('checked', 'checked');
                            }
                        }
                        if (!currentRow.children('input[name="editEmails"]').is(':checked')) {
                            if (currentRow.children('input[name="readEmails"]').is(':checked')) {
                                updateemail += 'readEmails=' + currentEmail + '&';
                            }
                        }
                    }
                    var fileShared;
                    if(PageName == "Share with Me" ){
                        fileShared = true;
                    }else{
                        var fileShareData=CFHPlistview.getFileDetails(FromfileId[0]);
                        fileShared=fileShareData.fileShared;
                    }
                    if(fileShared == true){
                        updateemail += 'fileId=' + FromfileId[0] ;
                        if(comments != ""){
                            CFHPlistview.addCommenttoFile(FromfileId[0], comments);
                        }
                        CFHPlistview.updateEmailsShared(updateemail);
                        CFHPlistview.modifyShare(FromfileId[0], pwd, maxDays);
                        if(publiccheck){
                            domainAdd="public";
                            status="PUBLIC";
                            CFHPlistview.updateStatus(status);
                        }
                        else{
                            domainAdd="sharedFile";
                            status="SHARED";
                            CFHPlistview.updateStatus(status);
                        }

                        break bl1;
                    } else{
                        var maxViews=10000;
                        if(publiccheck){
                            domainAdd="public";
                            status="PUBLIC";

                        }else{
                            domainAdd="sharedFile";
                            status="SHARED";

                        }
                        var	gname="";
                        updateemail += 'maxDays=' + maxDays + '&';
                        updateemail += 'maxViews='+maxViews+ '&';
                        updateemail += 'status='+status+ '&';
                        updateemail += 'group='+gname+ '&';
                        updateemail += 'sharePassword='+pwd+ '&';
                        for(var i=0;i<FromfileId.length;i++){
                            updateemail += 'fileId=' + FromfileId[i]+ '&'; ;
                            if(comments != ""){
                                CFHPlistview.addCommenttoFile(FromfileId[i], comments);
                            }
                        }
                        CFHPlistview.addNewFileshare(updateemail,domainAdd);
                    }
                }

                if(FromfileId.length  > 1){
                    updateemail="";
                    for(var n=0;n<emailCount;n++){
                        var currentRow = $('.addShareContent').find('#addUsersToShare').children('p:eq(' + n + ')');
                        var currentEmail = currentRow.children('span').text();
                        if (currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
                            updateemail += 'coOwnerEmails=' + currentEmail + '&';
                            currentRow.children('input[name="coOwnerEmails"]').attr('checked', 'checked');
                        }
                        if (!currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
                            if (currentRow.children('input[name="editEmails"]').is(':checked')) {
                                updateemail += 'editEmails=' + currentEmail + '&';
                                currentRow.children('input[name="editEmails"]').attr('checked', 'checked');
                            }
                        }
                        if (!currentRow.children('input[name="editEmails"]').is(':checked')) {
                            if (currentRow.children('input[name="readEmails"]').is(':checked')) {
                                updateemail += 'readEmails=' + currentEmail + '&';
                            }
                        }
                    }

                    var maxViews=10000;
                    if(publiccheck){
                        domainAdd="public";
                        status="PUBLIC";
                    }else{
                        domainAdd="sharedFile";
                        status="SHARED";
                    }
                    var	gname="";
                    updateemail += 'maxDays=' + maxDays + '&';
                    updateemail += 'maxViews='+maxViews+ '&';
                    updateemail += 'status='+status+ '&';
                    updateemail += 'group='+gname+ '&';
                    updateemail += 'sharePassword='+gname+ '&';
                    for(var i=0;i<FromfileId.length;i++){
                        updateemail += 'fileId=' + FromfileId[i]+ '&'; ;
                        if(comments != ""){
                            CFHPlistview.addCommenttoFile(FromfileId[i], comments);
                        }
                    }
                    CFHPlistview.addNewFileshare(updateemail,domainAdd);
                }
            }
        });
        function fileShareadd(){
            var email = $('#UserShareEmail').val().toLowerCase();
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            email = email.split(',');

            for(var i=0;i<email.length;i++){
                if (!emailReg.test(email[i])) {
                    $('#shareFiles .statusMesg').text('Please enter valid email');
                    $('#UserShareEmail').focus();
                    return false;
                }
                var pcount=$('.addShareContent').find('#addUsersToShare').children('p').length;
                for(var j=0;j<pcount;j++){
                    var currentRow = $('.addShareContent').find('#addUsersToShare').children('p:eq(' + j + ')');
                    if(email[i] == currentRow.children('span').text()){
                        $('#shareFiles .statusMesg').text('The user already available.');
                        $('#enterPswd').focus();
                        return false;
                    }
                }
            }

            var updateemail="";
            if(FromfileId.length == 1){
                updateemail="";
                for(var j=0;j<email.length;j++){
                    updateemail += 'readEmails=' + email[j] + '&';
                }
                var fileInfo=CFHPlistview.getFileDetails(FromfileId[0]);
                if(fileInfo.fileShared == true){
                    updateemail += 'fileId=' + FromfileId[0];
                    CFHPlistview.addFileshare(updateemail);
                }
            }
            for(var i=0;i<email.length;i++){
                CFManageCloudAccountsAjaxCall.getSharefileUsername(email[i]);
                $('#addUsersToShare').append('<p><span class="allemailsshare">'+email[i]+'</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails"><input type="checkbox" class="coowner" name="coOwnerEmails"><i class="deleteUserEmail"></i></p>');
                var emailValidat =   $('.addShareContent').find('#addUsersToShare').find('p');
                emailValidat.on('click', 'input[name="coOwnerEmails"]', function () {
                    if ($(this).is(':checked') == true) {
                        $(this).siblings('input[name="readEmails"], input[name="editEmails"]').prop('checked', true);
                        $(this).siblings('input[name="readEmails"], input[name="editEmails"]').prop("disabled", true);
                    }else{
                        $(this).siblings('input[name="editEmails"]').prop("disabled", false);
                    }
                });
                $('#UserShareEmail').val('');
            }
        }
        /* $('.addUsersShare').click(function(){ */
        $('#shareFiles').on('click','.addUsersShare',function(){
            fileShareadd();
        });

        $('.userInputSEmail').keypress(function(event) {
            if (event.keyCode == 13) {
                fileShareadd();
            }
        });
// remove username & email Id..........

        $('.addShareContent').on('click','.removeTag1',function(){
            var username=$(this).parent('span').text();
            CFManageCloudAccountsAjaxCall.getShareUseremail(username);
            $(this).parent('span').parent('i').remove();
            var uname;
            $.each(sharemailsUnames, function(key, value) {
                if(value == username){
                    uname=key;
                }
            });

            var pcount=$('.addShareContent').find('#addUsersToShare').children('p').length;
            for(var j=0;j<pcount;j++){
                var currentRow = $('.addShareContent').find('#addUsersToShare').children('p:eq(' + j + ')');
                if(uname == currentRow.children('span').text()){
                    if(FromfileId.length == 1){
                        var fileInfo=CFHPlistview.getFileDetails(FromfileId[0]);
                        if(fileInfo.fileShared == true){
                            var deleteObj = {
                                'fileId': FromfileId[0]
                            };
                            if (currentRow.children('span').siblings('input[name="readEmails"]').is(':checked')) {
                                deleteObj.readEmails = uname;
                            }
                            if (currentRow.children('span').siblings('input[name="editEmails"]').is(':checked')) {
                                deleteObj.editEmails = uname;
                            }
                            if (currentRow.children('span').siblings('input[name="coOwnerEmails"]').is(':checked')) {
                                deleteObj.coOwnerEmails = uname;
                            }
                            CFHPlistview.deleteFileshare(deleteObj);
                        }
                    }
                }
            }
            $(this).parent('span').parent('i').remove();
        });
        //add new user email..
        $('.addShareContent').on('click', '.addnewshareuseremail', function () {
            if($('#addUsersToShare p span:has(input)').length > 0){
                return false;
            }
            var newEmaildata = '<p><span class="allemailsshare"><input type="text"  val="" placeholder="" class="addNewShareEmail"/></span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails" ><input type="checkbox" class="coowner" name="coOwnerEmails"><i class="deleteUserEmail"></i></p>';
            $('#addUsersToShare').prepend(newEmaildata);

            var emailValidat =   $('.addShareContent').find('#addUsersToShare').find('p');
            emailValidat.on('click', 'input[name="coOwnerEmails"]', function () {
                if ($(this).is(':checked') == true) {
                    $(this).siblings('input[name="readEmails"], input[name="editEmails"]').prop('checked', true);
                    $(this).siblings('input[name="readEmail"], input[name="editEmails"]').prop("disabled", true);
                }else{
                    $(this).siblings('input[name="editEmails"]').prop("disabled", false);
                }
            });
            $('.addNewShareEmail').keypress(function(event) {
                if (event.keyCode == 13) {
                    var editedVal = $(this).val().toLowerCase();
                    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    if (!emailReg.test(editedVal)) {
                        $('#shareFiles .statusMesg').text('Please enter valid email');
                        $('#UserShareEmail').focus();
                        return false;
                    }
                    var pcount=$('.addShareContent').find('#addUsersToShare').children('p').length;
                    for(var j=0;j<pcount;j++){
                        var currentRow = $('.addShareContent').find('#addUsersToShare').children('p:eq(' + j + ')');
                        if(editedVal == currentRow.children('span').text()){
                            $(this).parent('span').parent('p').html('');
                            $('#Msg .statusMesg').text('The user already available.');
                            $('#enterPswd').focus();
                            return false;
                        }
                    }
                    var updateemail="";
                    if(FromfileId.length == 1){
                        var fileInfo=CFHPlistview.getFileDetails(FromfileId[0]);
                        if(fileInfo.fileShared == true){
                            if ($(this).parent().siblings('input[name="coOwnerEmails"]').is(':checked')) {
                                updateemail += 'coOwnerEmails=' + editedVal + '&';
                                $(this).parent('span').parent('p').html('<span class="allemailsshare">'+editedVal+'</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails" checked disabled><input type="checkbox" class="coowner" name="coOwnerEmails" checked><i class="deleteUserEmail"></i>');
                            }
                            if (!$(this).parent().siblings('input[name="coOwnerEmails"]').is(':checked')){
                                if ($(this).parent().siblings('input[name="editEmails"]').is(':checked')) {
                                    updateemail += 'editEmails=' + editedVal + '&';
                                    $(this).parent('span').parent('p').html('<span class="allemailsshare">'+editedVal+'</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails" checked><input type="checkbox" class="coowner" name="coOwnerEmails" ><i class="deleteUserEmail"></i>');
                                }
                            }
                            if (!$(this).parent().siblings('input[name="editEmails"]').is(':checked')) {
                                if ($(this).parent().siblings('input[name="readEmail"]').is(':checked')) {
                                    updateemail += 'readEmails=' + editedVal + '&';
                                }
                            }
                            updateemail += 'fileId=' + FromfileId[0];
                            CFHPlistview.addFileshare(updateemail);
                        }else{
                            if ($(this).parent().siblings('input[name="coOwnerEmails"]').is(':checked')) {
                                updateemail += 'coOwnerEmails=' + editedVal + '&';
                                $(this).parent('span').parent('p').html('<span class="allemailsshare">'+editedVal+'</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails" checked disabled><input type="checkbox" class="coowner" name="coOwnerEmails" checked><i class="deleteUserEmail"></i>');
                            }
                            if (!$(this).parent().siblings('input[name="coOwnerEmails"]').is(':checked')){
                                if ($(this).parent().siblings('input[name="editEmails"]').is(':checked')) {
                                    updateemail += 'editEmails=' + editedVal + '&';
                                    $(this).parent('span').parent('p').html('<span class="allemailsshare">'+editedVal+'</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails" checked><input type="checkbox" class="coowner" name="coOwnerEmails" ><i class="deleteUserEmail"></i>');
                                }
                            }
                            if (!$(this).parent().siblings('input[name="editEmails"]').is(':checked')) {
                                if ($(this).parent().siblings('input[name="readEmail"]').is(':checked')) {
                                    updateemail += 'readEmails=' + editedVal + '&';
                                }
                            }
                        }
                    }
                    CFManageCloudAccountsAjaxCall.getSharefileUsername(editedVal);
                }
            });
        });
// remove username & email Id in AccessSettings..........
        $('#addUsersToShare').on('click', '.deleteUserEmail', function () {
            var email=$(this).siblings('span').text();
            $.each(sharemailsUnames, function(key, value) {
                if(key == email){
                    var uname=value;
                    var lcount=$('.addShareContent').find('#shareENames').children('i').length;
                    for(var j=0;j<lcount;j++){
                        var currentRow = $('.addShareContent').find('#shareENames').children('i:eq(' + j + ')');
                        if(uname == currentRow.children('span').text()){
                            currentRow.remove();
                        }
                    }
                }
            });
            if(FromfileId.length == 1){
                var fileInfo=CFHPlistview.getFileDetails(FromfileId[0]);
                if(fileInfo.fileShared == true){
                    var deleteObj = {
                        'fileId': FromfileId[0]
                    };
                    if ($(this).siblings('input[name="readEmails"]').is(':checked')) {
                        deleteObj.readEmails = email;
                    }
                    if ($(this).siblings('input[name="editEmails"]').is(':checked')) {
                        deleteObj.editEmails = email;
                    }
                    if ($(this).siblings('input[name="coOwnerEmails"]').is(':checked')) {
                        deleteObj.coOwnerEmails = email;
                    }
                    $(this).parent('p').remove();
                    CFHPlistview.deleteFileshare(deleteObj);
                }
            }
            $(this).parent().remove();
        });
        //deleteEmail
        $('#mainContent').on('click', '.deleteEmail', function () {
            var currentEmail = $(this).siblings('span').text();
            var readEmailsVal = "",
                editEmailsVal = "",
                coOwnerEmailsVal = "";

            var deleteObj = {
                'fileId': fileId
            };

            if ($(this).siblings('input[name="readEmail"]').is(':checked')) {
                readEmailsVal = "readEmails";
                deleteObj.readEmails = currentEmail;
            }
            if ($(this).siblings('input[name="editEmails"]').is(':checked')) {
                editEmailsVal = "editEmails";
                deleteObj.editEmails = currentEmail;
            }
            if ($(this).siblings('input[name="coOwnerEmails"]').is(':checked')) {
                deleteObj.coOwnerEmails = currentEmail;
            }
            $(this).parent('p').remove();
            //shared count
            var sharedCount = $('#mainContent').find('.shared-data .panel-body p').size();
            $('#mainContent').find('#sharedCount').html(sharedCount);
            CFHPlistview.deleteFileshare(deleteObj);
        });
        //Edit button
        $('#mainContent').on('click', 'input[value="Edit"]', function () {
            $("#mainContent").find('p').find('input[name="editEmails"], input[name="coOwnerEmails"]').attr("disabled", false);
            $('#mainContent').find('.addNewemail').show();
            $('#mainContent').find('.cancleUpdate').show();

            $('#mainContent').find('.metadatacontrols').find('input').show();
            $("#mainContent").find('.shared-data').find('.deleteEmail').each(function () {
                $("#mainContent").find('.shared-data').find('.deleteEmail').show();
            });
            $(this).val('Save');
            $("#mainContent").find(".shared-data").find('input[name="editEmails"]:checked').each(function () {
                $("#mainContent").find(".shared-data").find('input[name="editEmails"]:checked').prop("disabled", true)
            });
        });

        $('#mainContent').on('click', 'p input[name="coOwnerEmails"]', function () {
            if ($(this).is(':checked') == true) {
                $(this).siblings('input[name="readEmail"], input[name="editEmails"]').prop('checked', true);
                $(this).siblings('input[name="readEmail"], input[name="editEmails"]').prop("disabled", true);
            } else {
                $(this).siblings('input[name="editEmails"]').prop("disabled", false);
            }
        });

        //Cancle update
        $('#mainContent').on('click', '.cancleUpdate', function () {
            $("#mainContent").find('.addNewemail').hide();
            $("#mainContent").find('input[value="Save"]').val('Edit');
            $("#mainContent").find('.shared-data').find('.deleteEmail').each(function () {
                $("#mainContent").find('.shared-data').find('.deleteEmail').hide();
            });
            $('#mainContent').find('.metadatacontrols').find('input').hide();
            $(this).hide();

            $("#mainContent").find(".shared-data").find('input:checkbox').each(function () {
                $("#mainContent").find(".shared-data").find('input:checkbox').prop("disabled", true)
            });
        });

        //Updated shared with / save
        $('#mainContent ').on('click', '#Metacontainer input[value="Save"]', function () {
            var fileId;
            fileId = $(this).parents('.content').parents('.Metacontainer').prev('.panel-data').children('.LVfileName').attr('id');
            if(fileId == null){
                fileId = $('#ThumbnailContent').find('.selected').children('a.filethumbnail').attr('id');
            }
            $("#mainContent").find('.addNewemail, .cancleUpdate').hide();

            var emailCount = $('#mainContent').find('span.allEmails').length;
            var readEmailsVal = "",
                editEmailsVal = "",
                coOwnerEmailsVal = "";
            var emailArray = new Array();
            var fileID = fileId;
            $('#mainContent').find('.metadatacontrols').find('input').hide();
            if ($(this).val() == 'Save') {
                $("#mainContent").find('p').find('input[name="readEmail"], input[name="editEmails"], input[name="coOwnerEmails"]').attr("disabled", true);
            }
            $(this).val('Edit');
            $("#mainContent").find('.shared-data').find('.deleteEmail').each(function () {
                $("#mainContent").find('.shared-data').find('.deleteEmail').hide();
            });
            var updateEmail = "";
            for (var i = 0; i < emailCount; i++) {
                var saveEmailObj = {
                    'fileId': fileID
                };
                var currentRow = $('#mainContent').find('.shared-data').children('.panel-body').children('p:eq(' + i + ')');
                var currentEmail = currentRow.children('span').text();
                if (currentRow.children('input[name="readEmail"]').is(':checked')) {
                    readEmailsVal = "readEmails";
                    updateEmail += 'readEmails=' + currentEmail + '&';
                }
                if (currentRow.children('input[name="editEmails"]').is(':checked')) {
                    editEmailsVal = "editEmails";
                    updateEmail += 'editEmails=' + currentEmail + '&';
                }
                if (currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
                    updateEmail += 'coOwnerEmails=' + currentEmail + '&';
                }
            }
            updateEmail += 'fileId=' + fileId;
            CFHPlistview.updateEmailsShared(updateEmail);
            var filePwd = $('#mainContent').find('.metadatacontrols').find('input[type="password"]').val();
            var maxDays = $('#mainContent').find('.metadatacontrols').find('input.calendar').attr('data-days');
            if(maxDays.length == 0){
                maxDays = 30;
            }
            CFHPlistview.modifyShare(fileId, filePwd, maxDays);
        });
    }
};

var CFHPthumbnail = {
    thumbNail : $("#mainContent #ThumbnailContent > div.file"),
    thumbNailCheck : $("#mainContent #ThumbnailContent input.fileCheck"),
    currentFile : null,
    checkFile : function(){
        var thumbnails = $('#mainContent').find('#ThumbnailContent .file');
        var selectedCount = thumbnails.find('input.fileCheck:checked').length;
        if(selectedCount > 0){
            thumbnails.addClass('active').removeClass('checked');
            thumbnails.find('input.fileCheck:checked').each(function(){
                $(this).parent().addClass('checked');
            });
        }else{
            unCheckFile();
            thumbnails.not(CFHPthumbnail.currentFile).removeClass('active checked');
        }
    },

    UncheckFile : function(){
        var thumbnails = $('#mainContent').find('#ThumbnailContent .file');
        var selectedCount = thumbnails.find('input.fileCheck:checked').length;
        if(selectedCount <= 0){
            thumbnails.removeClass('active checked');
        }
    },
    selectFiles: function () {

    },

    init : function() {
        CFHPthumbnail.selectFiles();
        var mainContent = $("#mainContent");
        var thumbNails = mainContent.find('#ThumbnailContent .file');
        var thumbNailsCheck = mainContent.find('#ThumbnailContent input.fileCheck');
        thumbNails.hover(function () {
            $(this).addClass('active');
            CFHPthumbnail.currentFile = this;
        }, function () {
            CFHPthumbnail.UncheckFile();
        });
        thumbNailsCheck.on('click', function () {
            CFHPthumbnail.checkFile();
        });
        /*mainContent.not('#ThumbnailContent .addFilethumb').on('click', '#ThumbnailContent .file a', function () {
            var fileId = $(this).attr('id');
            //var cloudId = $(this).parent('file').attr('id');
            var pagename = PageName;
            var fileObj;
            if (pagename == "Share with Me" || pagename == "Share by Me") {
                fileObj = CFHPlistview.getFileShare(fileId);
            } else {
                fileObj = CFHPlistview.getFileDetails(fileId);
            }
            if (!$(this).parent().hasClass('selected')) {
                mainContent.find('#ThumbnailContent .file ').removeClass('selected');
                var curEle = $(this).parent();
                CFHPthumbnail.showMetaData(curEle, fileId, fileObj);
                $('#Metacontainer').append('<i id="closeMetaCont">X</i>');
                thumbNails.removeClass('selected');
                $(this).parent().addClass('selected');
                var tagsData = CFHPlistview.getFileTags(fileId);
                var userId = localStorage.getItem('UserId');
                var tagLength = tagsData.length;
                var tLength = 0;
                for (var i = 0; i < tagLength; i++) {
                    if (userId == tagsData[i].user.id) {
                        tLength = tLength + 1;
                    }
                }
                mainContent.find('#tagsCount').html(tLength);
                mainContent.find('#sharedCount').html(fileObj.sharedCount);
                mainContent.find('#commentCount').html(fileObj.commentsCount);
                mainContent.find('.saveEmail, .addNewemail').hide();
            } else {
                $('#Metacontainer').slideUp();
                $(this).parent().removeClass('selected');
            }
            return false;
        });*/
    }
};
$('#access').click(function(){
    $('.shareHeader a').removeClass('share-active');
    $(this).addClass('share-active');
    $('#sharecontent').addClass('divdisplay');
    $('#accesscontent').removeClass('divdisplay');
});
$('#share').click(function(){
    $('.shareHeader a').removeClass('share-active');
    $(this).addClass('share-active');
    $('#sharecontent').removeClass('divdisplay');
    $('#accesscontent').addClass('divdisplay');
});

function unCheckFile(){
    $("#page-header input[type='checkbox']").prop('checked',false);
    $('#page-header').find('.panel-dataHoverClass').each(function(){
        $(this).removeClass('panel-dataHoverClass');
    });
    disableActionPanel();
    if(PageName == 'WorkSpace'){
        $('#CFEditWorkSpace').addClass('buttonDisable');
    }
}