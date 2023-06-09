var CFWlistview = {
    //listView: $('#mainContent .panel-data .LVfileName[name="WORKSPACE"] p>i'),
    selectCheckbox: $('#mainContent .LVcheckBox input[type="checkbox"]'),
    //Get Ws Details
    getWorkspaceDetails: function (wsid) {
        var apiUrl = apicallurl + "/workspace/info/" + wsid + "?fetchCollabInfo=true";
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
            success: function (wsDetailsData) {
                wsdetails = wsDetailsData;
                wsDetails = wsdetails;
            },
            complete: function (xhr, statusText) {
            }
        });
        return wsdetails;
    },

    getWorkspaceActivities: function (wsid, PageNumber) {
        var _parent = $('#workspaceAct');
        var apiUrl = apicallurl + "/analytics/report/" + localStorage.getItem("UserId") + "?reportType=WorkSpaceActivity&workspaceId=" + wsid + "&page_nbr=" + PageNumber + "&page_size=5";
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
            success: function (wsDetailsData) {
                if(PageNumber == 1){
                    _parent.html('');
                }
                if (wsDetailsData.length == 0 && PageNumber == 1) {
                    var _html = '<li class="separator noactivity"><div class="article-post" style="margin-left:23px;">' +
                        '<div class="user-content">This workspace does not have any activity.</div></div></li>';
                    _parent.append(_html);
                }else{
                    _parent.find('.noactivity').remove();
                    $.each(wsDetailsData,function(i,e){
                        if (e.message != null) {
                            var _html = '<li class="separator"><div class="article-post" style="margin-left:23px;"><div class="user-content">'
                                + e.message + '<b> ' + jQuery.timeago(e.tstamp) + ' </b> </div></div></li>';

                            _parent.append(_html);
                        }
                    });
                }
                if (wsDetailsData.length > 4) {
                    $('#showMoreWorkAct').removeClass("divdisplay");
                }
                $('#spinner1').addClass("divdisplay");
            }
        });
    },

    addCollabrator: function (addFileObj) {
        var apiurl = apicallurl + "/workspace/add/collab?domainUrl=" + domainUrl + "/WssharedNew";
        $.ajax({
            url: apiurl,
            type: "POST",
            data: addFileObj,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (addFileObj) {
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
            },
            error: function (error) {
            }
        });
    },

    //Delete Workspace Delete email
    deleteFileshare: function (deleteObj) {
        var apiurl = apicallurl + "/workspace/remove/collab";
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
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
            },
            error: function (error) {
            }
        });
    },

    //Updated shared with
    updateEmailsShared: function (updateEmail) {
        var apiurl = apicallurl + "/workspace/edit/permissions";
        $.ajax({
            url: apiurl,
            type: "POST",
            data: updateEmail,
            dataType: 'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (updateEmail) {
                $("#mainContent").find('.shared-data').find('input[name="readEmailWs"]:checked').prop("disabled", true);
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
                else if(xhr.status == 200){
                    //$.smallBox({title: "Permissions updated successfully.", color: "#e35e00", timeout: notifyTime, sound: false});
                    showNotyNotification("error","Permissions updated successfully.");
                }
            }
        });

    },

    //workspace Rename
    renameWorkspace: function (wsId, updatewname, editedVal, password) {
        var apiUrl = apicallurl + "/workspace/rename?workspaceId=" + wsId + "";
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: false,
            dataType: "json",
            data: updatewname,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (object) {
                renameObject = object;
                disableActionPanel(actionPanel);
                $('#workspaceAct').html('');
                workspaceActicities(WorkSpaceId, 1);
                if (password == "IGNORE_UPDATE" || password == "NOT_REQUIRED" || password == "" || password == undefined || password == "workspaceLockFalse") {
                    $('[id="' + wsId + '"]').siblings('i[id = "wsLock"]').attr("class", "workspaceLockFalse");
                    $('#secondary [id="' + wsId + '"]').children('i:last').attr('class', '');
                }else {
                    $('[id="' + wsId + '"]').siblings('i[id = "wsLock"]').attr("class", "workspaceLockTrue");
                    $('#secondary [id="' + wsId + '"]').children('i:last').attr('class', 'cf-locked');
                }
                var _ws = $("strong[id='" + wsId + "']");
                _ws.html(CFManageCloudAccountsAjaxCall.getMaxChars(editedVal,14));
                _ws.attr("name", editedVal);
                _ws.siblings('i').attr("title", editedVal);
                $('.getFilesForWorkspace [id="' + wsId + '"]').children('span').text(editedVal);
                if(PageName == 'InnerWorkSpace'){
                    $('#headerText').text(editedVal);
                }
                   if(PageName == "WorkSpace")
                   {
                
                  $('#CFEditWorkSpace').addClass('buttonDisable');

                  }
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 403) {
                    disableActionPanel(actionPanel);
                    var userDetails = JSON.parse(localStorage.getItem("CFUser"));
                    var email = userDetails.primaryEmail;
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                    return false;
                }
                if (xhr.status > 300) {
                    disableActionPanel(actionPanel);
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
            },
            error: function (error) {
            }
        });
        return renameObject;
    },

    //delete workspace ajax call
    deleteWorspace: function (wid) {
        apiUrl = apicallurl + "/workspace/delete/" + wid;
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
            success: function (DeleteFile) {
            },
            statusCode: {
                204: function () {
                    $('[id="' + wid + '"]').parent('.panel-data').remove();
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 403) {
                    var userDetails = JSON.parse(localStorage.getItem("CFUser"));
                    var email = userDetails.primaryEmail;
                    //$.smallBox({title: "This emailid " + email + " not authorized.", color: "#1ba1e2", timeout: notifyTime, sound: false});
                    showNotyNotification("notify","This emailid "+email+" not authorized.");
                    return false;
                }
            },
            error: function (error) {
            }
        });
    },

    //commentsDisplay
    commentsDisplay: function (wsId) {
        var workspaceInfo = CFWlistview.getWorkspaceDetails(wsId);
        //var cname = JSON.parse(localStorage.getItem('CFUser'));
        var commentsContainer = $("#mainContent").find('.comments-data').children('.panel-body');
        commentsContainer.find('p').remove();
        var notes = $.trim(workspaceInfo.notes);
        if(notes != undefined && notes != null && notes != ''){
            var _notes = $("#notes");
            _notes.val(notes);
            _notes.prop("disabled", "true");
            _notes.siblings('button:eq(0)').attr("id", "editNoteButton");
            $('#editNoteButton').text("Edit Note");
            _notes.siblings('button:eq(1)').addClass("divdisplay");
        }
    },

    //Add comments to Wokspace
    addCommentsWorkspace: function (wsId, updatwname, thisData) {
        var ajaxUrl = apicallurl + "/workspace/rename?workspaceId=" + wsId + "";
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            data: updatwname,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (commentObj) {
                if(commentObj != undefined && commentObj.notes != undefined && commentObj.notes != null && commentObj.notes != ''){
                    var _notes = $("#notes");
                    _notes.val(commentObj.notes);
                    _notes.siblings('button:eq(0)').attr("id", "editNoteButton");
                    $('#editNoteButton').text("Edit Note");
                    $('.commentContainer').find('#notes').prop("disabled", true);
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
            }
        });
    },

    //updateComments
    updateNotes: function (updatewnotes, wsId) {
        var apiUrl = apicallurl + "/workspace/rename?workspaceId=" + wsId + "";
        $.ajax({
            type: "POST",
            url: apiUrl,
            dataType: "json",
            data: updatewnotes,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function () {
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                    showNotyNotification("error","Operation Failed");
                }
            },
            error: function (error) {
            }
        });
    },

    navigateWorkspaceFolders :function(object) {
        var apiUrl = "";
        if (object.sharedFolderId == 'undefined' || object.sharedFolderId == undefined) {
            apiUrl = apicallurl + "/filefolder/user/" + localStorage.getItem('UserId') + "/childfolders/" + object.cloudId + "?folderId=" + encodeURIComponent(object.folderId) + "&sharedFolderId=" + encodeURIComponent(object.folderId) + "&workspaceId=" + WorkSpaceId;
            object.sharedFolderId = object.folderId;
        }else {
            apiUrl = apicallurl + "/filefolder/user/" + localStorage.getItem('UserId') + "/childfolders/" + object.cloudId + "?folderId=" + encodeURIComponent(object.folderId) + "&sharedFolderId=" + encodeURIComponent(object.sharedFolderId) + "&workspaceId=" + WorkSpaceId;
        }
        $.ajax({
            type: 'GET',
            url: apiUrl,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                $('#workspaceFiles').html('');
                $('#workspaceFiles').append('<tr class="gradeA" style="display:inline-table" cid="'+object.cloudId+'">' +
                    '<td class="wsfcheckbox"></td>' +
                    '<td class="LVFILEIcon"></td>' +
                    '<td class="sorting_1" style="cursor:default"><span style="display:inline-block;width:100%"><i sid="'+object.sharedFolderId+'" fid="'+object.folderId+'" class="cf-back" style="font-size:20pt"></i></span></td>' +
                    '<td style="width:13.5%;padding: 2px 2px 0 2px;"></td>' +
                    '<td class=" " style="width:20%;padding: 2px 2px 0 2px;"></td>' +
                    '<td style="font-size: 20px;width:7%;padding: 3px 8px 0 5px;"></td>' +
                    '</tr>');
                if (data != null || data != undefined) {
                    CFWlistview.appendWorkspaceFiles(data, object);
                }
            }
        });
    },

    appendWorkspaceFiles:function(Files,object) {
        var details = CFHPlistview.getFileDetails(object.folderId);
        if(details != undefined || details != null){
            appendNavigation(details);
        }
        $.each(Files, function (i, file) {
            var fileExtn = file.objectExtn;
            var filetype;
            if (file.directory == false) {
                filetype = "FIL";
                fileClass = "sorting_1";
            }else{
                filetype = "FOLDER";
                fileClass = "folder";
            }
            var datatype = file.directory == true ? "Folder" :  "File";
            var version = "design";
            $('#workspaceFiles').append('<tr pid="'+file.parent+'" data-type="'+datatype+'" shareId="'+object.sharedFolderId+'" class="gradeA" fexten=' + fileExtn + ' style="display:inline-table">' +
            '<td class="wsfcheckbox"><input type="checkbox" /></td>' +
            '<td class="LVFILEIcon"><i class="LV' + filetype + '" style="width: 22px;height: 29px;display: block;margin-top: 0px;cursor:pointer;"></i></td>' +
            '<td class="' + fileClass + '" name=' + encodeURIComponent(file.objectName) + ' cloudid=' + file.cloudId + ' id=' + encodeURIComponent(file.id) + ' data-type=' + file.objectSize + ' title="'+file.objectName+'">' +
            '<span style="display:inline-block;width:100%">' + CFManageCloudAccountsAjaxCall.getMaxChars(file.objectName,50) + '</span>' +
            '<td style="width:13.5%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getObjectSize(file.objectSize, filetype) + '</td>' +
            '<td class=" " style="width:20%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getDateConversion(file.modifiedTime) + '</td>' +
            '<td style="font-size: 20px;width:7%;padding: 3px 8px 0 5px;"><i class="cf-comments2" id="getComments"></i></td></tr>');
        });
    },

    goToWorkspace : function (workSpaceId,workSpaceName){

    var wsId = workSpaceId;
    var wsname = workSpaceName;
    
    $('#FooterLinks').css('width', '80%');
    sendGAEvents("Workspace","Navigate in to WorkSpace");
   
    wsdetails = CFWlistview.getWorkspaceDetails(wsId);
    if(wsdetails.status == "INACTIVE"){
        return showNotyNotification('error',wsdetails.workspaceName+' is Disabled by Admin.');
    }
    var UserObj = JSON.parse(localStorage.getItem('CFUser'));
    var uemail = UserObj.primaryEmail;
        $('#spinner1').removeClass("divdisplay");
        setTimeout(function () {
            wsClick(wsId, wsname, wsdetails);
        }, 100);
    

    },

    init: function () {
        //CFWlistview.selectFiles();
        var wsId;
        var mainContent = $('#mainContent');
        mainContent.not('#ThumbnailContent .addFilethumb').on('click', '#ThumbnailContent .file p', function () {
            wsId = $(this).attr('id');
            cloudId = $(this).parent().attr('id');
        });

        //Update Workspace name		
        mainContent.on('click', '.editFilenameWs', function () {
            var thisParent = $(this).parent('p');
            var MfileIcon = thisParent.parents('.Metacontainer').prev('.panel-data').find('.LVfileName').attr('name');
            var MfileExten = thisParent.parents('.Metacontainer').prev('.panel-data').find('.LVfileName').children('p').attr('fexten');
            var FileIcon;
            if (MfileIcon == "FILE") {
                FileIcon = "LVFILE";
            }
            if (MfileIcon == "FOLDER") {
                FileIcon = "LVFOLDER";
            }
            var currentFilename = thisParent.text();
            thisParent.html('<input type="text"  value="' + currentFilename +
            '" class="categoryInput1" style="margin-left:40px;" autofocus/>');
            $(this).parent('p').remove();
            var editTagInput = $('.categoryInput1');
            editTagInput.val(currentFilename);
            editTagInput.focus();
            editTagInput.focusout(function () {
                $(this).parent('p').html(currentFilename);
                $('.metadata').children('p:first').append('<i class="editFilenameWs"></i>');

            });
            editTagInput.keydown(function (event) {
                var inputValue = $(this).val();
                if (event.keyCode == 13) {
                    thisParent.html('<p>' + inputValue + '<i class="editFilename"></i></p>');
                    thisParent.parents('.Metacontainer').prev('.panel-data').find('.LVfileName').html('<i class="' + FileIcon + ' pull-left"></i><p class="pull-left" name="' + inputValue + '" fexten="' + MfileExten + '">' + inputValue + '</p><a href="#" title=""><i class="MetaDataIcon"></i></a>');
                    inputValue = CFManageCloudAccountsAjaxCall.getMaxChars(inputValue,14);
                    $('#mainContent').find('#ThumbnailContent .selected .filename').html(inputValue);
                    var updatwname = "";
                    var notes = "NOT_REQUIRED";
                    updatwname += 'name=' + inputValue + '&';
                    updatwname += 'notes=' + notes + '&';
                    updatwname += 'password=' + notes;
                    CFWlistview.renameWorkspace(wsId, updatwname);
                } else if (event.keyCode == 27) {
                    var editedVal = $(this).val();
                    thisParent.text(editedVal);
                    $('.metadata').children('p:first').append('<i class="editFilenameWs"></i>');
                }
            });
        });
        //Display Comment/GetComments for a File
        mainContent.on('click', '.comments-heading1 a', function () {
            if (!$('#mainContent').find('.comments-data').hasClass('in')) {
                CFWlistview.commentsDisplay(wsId);
            }
            $("#mainContent").find('input.saveEmailWs, .addNewemailWs, .cancelUpdateWs').hide();
            $("#mainContent").find('input[value="Save"]').val('Edit');
        });
        //Add Comments / CreateComment on a File
        mainContent.on('click', '#addNoteButton', function () {
            var thisData = $.trim($(this).siblings('textarea').val());
            if (thisData != "") {
                var updatwname = "";
                var empty = "NOT_REQUIRED";
                updatwname += 'name=' + empty + '&';
                updatwname += 'notes=' + thisData + '&';
                updatwname += 'password=' + empty;
                $('#addNoteButton').text("Edit Note");
                CFWlistview.addCommentsWorkspace(wsId, updatwname, thisData);
            }
        });
        mainContent.on('click', '#editNoteButton', function () {
            $('.commentContainer').find('#notes').prop("disabled", false);
            $('#notes').siblings('#editNoteButton').attr("id", "saveNoteButton");
            $('#saveNoteButton').text("Save Note");
            $('#notes').siblings('button:eq(1)').removeClass("divdisplay");
        });
        mainContent.on('click', '#cancelNoteButton', function () {
            $('#notes').siblings('#saveNoteButton').attr("id", "editNoteButton");
            $('#editNoteButton').text("Edit Note");
            $('#notes').siblings('button:eq(1)').addClass("divdisplay");
            $('.commentContainer').find('#notes').prop("disabled", true);
        });

        mainContent.on('click', '#saveNoteButton', function () {
            var thisData = $.trim($(this).siblings('textarea').val());
            var updatwname = "";
            var empty = "NOT_REQUIRED";
            updatwname += 'name=' + empty + '&';
            updatwname += 'notes=' + thisData + '&';
            updatwname += 'password=' + empty;
            if (thisData != "") {
                $('#notes').siblings('#saveNoteButton').attr("id", "editNoteButton");
                $('#editNoteButton').text("Edit Note");
                $('.commentContainer').find('#notes').prop("disabled", true);
                $('#notes').siblings('button:eq(1)').addClass("divdisplay");
                CFWlistview.addCommentsWorkspace(wsId, updatwname, thisData);
            } else {
                $('#notes').siblings('#saveNoteButton').attr("id", "addNoteButton");
                $('#addNoteButton').text("Add Note");
                $('#notes').siblings('button:eq(1)').addClass("divdisplay");
                CFWlistview.addCommentsWorkspace(wsId, updatwname, thisData);
            }
        });
        mainContent.on('click', '.shared-heading1 a', function () {
            var _mncontent = $("#mainContent");
            if (!$(this).parents('.shared-heading1').siblings('.shared-data').hasClass('in')) {
                _mncontent.find('.shared-data').find('p').remove();
                _mncontent.find('.editEmailWs').show();
                CFWlistview.sharedFilesWith(wsId);
                _mncontent.find('.shared-data').find('input:checkbox').each(function () {
                    _mncontent.find('.shared-data').find('input:checkbox').prop("disabled", true);
                });
                _mncontent.find('.shared-data').find('.deleteEmailWs').each(function () {
                    _mncontent.find('.shared-data').find('.deleteEmailWs').hide();
                });
            } else {
                _mncontent.find('.shared-data').find('p').remove();
                _mncontent.find('.saveEmailWs, .addNewemailWs, .cancleUpdateWs').hide();
                _mncontent.find('.editEmailWs[value="Edit"]').hide();
                _mncontent.find('.shared-data').find('.deleteEmailWs').each(function () {
                    _mncontent.find('.shared-data').find('.deleteEmailWs').hide();
                });
                var _mncontentEdit = _mncontent.find("input[name = 'Edit']");
                _mncontentEdit.removeClass('saveEmailWs');
                _mncontentEdit.val('Edit');
                _mncontentEdit.addClass('editEmailWs');
            }
        });

        //Add share email
        mainContent.on('click', '.addEmailWs button', function () {
            var readEmail = $(this).parents('.addEmailWs').children('input[name="Email"]').val().toLowerCase();
            var emailCount = $('#mainContent').find('span.allEmailsWs').length;
            /*var readEmailsVal = "",
                editEmailsVal = "",
                coOwnerEmailsVal = "";*/
            if (!emailReg.test(readEmail)) {
                //$('#CFsignupform .statusMesg').text('Please enter a valid e-mail address.');
                $(this).parents('.addEmailWs').children('input[name="Email"]').css('border-color', 'red');
                $('#CFSEmail').focus();
                return false;
            }
            for (var i = 0; i < emailCount; i++) {
                var availableEmail = $('#mainContent').find('.shared-data').children('.panel-body').children('p').children('span:eq(' + i + ')').text();
                if (readEmail == availableEmail) {
                    return false;
                }
            }
            var addFileObj = {
                'workspaceId': wsId
            };
            if ($(this).siblings('input[name="coOwnerEmailsWs"]').is(':checked')) {
                addFileObj.coOwnerEmails = readEmail;
                $(this).siblings('input[name="coOwnerEmailsWs"],input[name="editEmailsWs"],input[name="readEmailsWs"]').attr('checked', 'checked');
                $(this).siblings('input[name="editEmailsWs"]').attr('disabled', 'true');
            }
            if (!$(this).siblings('input[name="coOwnerEmailsWs"]').is(':checked')) {
                if ($(this).siblings('input[name="editEmailsWs"]').is(':checked')) {
                    addFileObj.editEmails = readEmail;
                    $(this).siblings('input[name="editEmailsWs"],input[name="readEmailsWs"]').attr('checked', 'checked');
                }
            }
            if (!$(this).siblings('input[name="editEmailsWs"]').is(':checked')) {
                if ($(this).siblings('input[name="readEmailWs"]').is(':checked')) {
                    addFileObj.readEmails = readEmail;
                }
            }
            var currentData = $(this).parent('.addEmailWs').html();
            $(this).parents('.emailsList').after('<p class="currentElem">' + currentData + '</p>');
            var currentElem = $('#mainContent').find('.currentElem');
            currentElem.children('input[type="text"], button').remove();
            currentElem.children('i').replaceWith('<i class="deleteEmailWs"></i>');
            currentElem.prepend('<span class="allEmailsWs">' + readEmail + '</span>');
            $('#mainContent').find('.currentElem').removeClass('currentElem');
            $(this).parent('.addEmailWs').remove();
            //shared count
            var sharedCount = $('#mainContent').find('.shared-data .panel-body p').size();
            $('#mainContent').find('#sharedCount').html(sharedCount);
            $('#mainContent').find('.sCount').html(sharedCount);
            CFWlistview.addCollabrator(addFileObj);
        });
        //Addnewemail
        mainContent.on('click', '.addNewemailWs', function () {

            var newEmaildata = '<div class="addEmailWs"><input type="text" name="Email" value=""/><input type="checkbox" name="readEmailWs" checked="" disabled> <input type="checkbox" name="editEmailsWs"><input type="checkbox" name="coOwnerEmailsWs"><i class="removeEmailWs"></i><button>Add</button></div>';
            $('#mainContent').find('.shared-data').find('.panel-body').children('div').append(newEmaildata);
            var emailValidat = $('#mainContent').find('.shared-data').find('.panel-body').find('.addEmailWs');
            emailValidat.on('click', 'input[name="coOwnerEmailsWs"]', function () {
                if ($(this).is(':checked') == true) {
                    $(this).siblings('input[name="readEmailWs"], input[name="editEmailsWs"]').prop('checked', true);
                    $(this).siblings('input[name="readEmailWs"], input[name="editEmailsWs"]').prop("disabled", true);
                } else {
                    $(this).siblings('input[name="editEmailsWs"]').prop("disabled", false);
                }
            });
        });
        mainContent.on('click', '.removeEmailWs', function () {
            var thisaddEmail = $('#mainContent').find('.shared-data').find('.panel-body').find('.addEmailWs');
            thisaddEmail.remove();
        });
        //deleteEmail
        mainContent.on('click', '.deleteEmailWs', function () {
            var currentEmail = $(this).siblings('span').text();
            var deleteObj = {
                'workspaceId': wsId
            };
            if ($(this).siblings('input[name="coOwnerEmailsWs"]').is(':checked')) {
                deleteObj.coOwnerEmails = currentEmail;
            }
            if (!$(this).siblings('input[name="coOwnerEmailsWs"]').is(':checked')) {
                if ($(this).siblings('input[name="editEmailsWs"]').is(':checked')) {
                    deleteObj.editEmails = currentEmail;
                }
            }
            if (!$(this).siblings('input[name="editEmailsWs"]').is(':checked')) {
                if ($(this).siblings('input[name="readEmailWs"]').is(':checked')) {
                    deleteObj.readEmails = currentEmail;
                }
            }

            $(this).parent('p').remove();
            var sharedCount = $('#mainContent').find('.shared-data .panel-body p').size();
            $('#mainContent').find('#sharedCount').html(sharedCount);
            $('#mainContent').find('.sCount').html(sharedCount);
            CFWlistview.deleteFileshare(deleteObj);
        });

        //Edit button
        mainContent.on('click', '.editEmailWs', function () {
            var emailCount = $('#mainContent').find('span.allEmailsWs').length;
            for (var i = 0; i < emailCount; i++) {
                var currentRow = $('#mainContent').find('.shared-data').children('.panel-body').children('p:eq(' + i + ')');
                //var currentEmail = currentRow.children('span').text();
                currentRow.children('input[name="coOwnerEmailsWs"]').attr("disabled", false);
                if (currentRow.children('input[name="coOwnerEmailsWs"]').is(':checked')) {
                    currentRow.children('input[name="coOwnerEmailsWs"]').attr("disabled", false);
                    currentRow.children('input[name="editEmailsWs"]').attr("disabled", true);
                }
                if (!currentRow.children('input[name="coOwnerEmailsWs"]').is(':checked')) {
                    if (currentRow.children('input[name="editEmailsWs"]').is(':checked')) {
                        currentRow.children('input[name="editEmailsWs"]').attr("disabled", false);
                        currentRow.children('input[name="coOwnerEmailsWs"]').attr("disabled", false);
                    }
                }
                if (!currentRow.children('input[name="editEmailsWs"]').is(':checked')) {
                    if (currentRow.children('input[name="readEmailWs"]').is(':checked')) {
                        currentRow.children('input[name="editEmailsWs"]').attr("disabled", false);
                    }
                }
            }
            $("#mainContent").find('.shared-data').find('.deleteEmailWs').each(function () {
                $("#mainContent").find('.shared-data').find('.deleteEmailWs').show();
            });
            $('#mainContent').find('.addNewemailWs').show();
            $('#mainContent').find('.cancleUpdateWs').show();
            $('#mainContent').find('.metadatacontrols').find('input').show();
            $(this).val('Save');
            $(this).addClass('saveEmailWs');
            $(this).removeClass('editEmailWs');

        });

        mainContent.on('change', 'p input[name="coOwnerEmailsWs"]', function () {
            if ($(this).is(':checked') == true) {
                $(this).siblings('input[name="readEmailWs"], input[name="editEmailsWs"]').prop('checked', true);
                $(this).siblings('input[name="readEmailWs"], input[name="editEmailsWs"]').prop("disabled", true);
            } else {
                $(this).siblings('input[name="editEmailsWs"]').prop("disabled", false);
            }
        });

        //Cancle update	
        mainContent.on('click', '.cancleUpdateWs', function () {
            $("#mainContent").find('.addNewemailWs').hide();
            $("#mainContent").find('input[value="Save"]').val('Edit');
            $('#mainContent').find('.metadatacontrols').find('input').hide();
            $(this).hide();
            $("#mainContent").find('.shared-data').find('.deleteEmailWs').each(function () {
                $("#mainContent").find('.shared-data').find('.deleteEmailWs').hide();
            });
            $(this).siblings('input').removeClass('saveEmailWs');
            $(this).siblings('input').addClass('editEmailWs');
            $("#mainContent").find(".shared-data").find('input:checkbox').each(function () {
                $("#mainContent").find(".shared-data").find('input:checkbox').prop("disabled", true)
            });
        });
        //Updated shared with / save
        mainContent.on('click', '#MetacontainerWs .saveEmailWs', function () {
            var wsId;
            if (viewTrack == "GView") {
                wsId = $('#ThumbnailContent').find('.selected').children('strong').attr('id');
            } else {
                wsId = $(this).parents('.content').parents('.Metacontainer').prev('.panel-data').children('.LVfileName[name="WORKSPACE"]').attr('id');
            }

            $("#mainContent").find('.addNewemailWs, .cancleUpdateWs').hide();
            $("#mainContent").find('.shared-data').find('.deleteEmailWs').each(function () {
                $("#mainContent").find('.shared-data').find('.deleteEmailWs').hide();
            });
            var emailCount = $('#mainContent').find('span.allEmailsWs').length;
            var readEmailsVal = "",
                editEmailsVal = "",
                coOwnerEmailsVal = "";
            var emailArray = [];

            $('#mainContent').find('.metadatacontrols').find('input').hide();
            if ($(this).val() == 'Save') {
                $("#mainContent").find('p').find('input[name="readEmailWs"], input[name="editEmailsWs"], input[name="coOwnerEmailsWs"]').attr("disabled", true);

            }
            $(this).val('Edit');
            $(this).removeClass('saveEmailWs');
            $(this).addClass('editEmailWs');

            var updateEmail = "";
            for (var i = 0; i < emailCount; i++) {
                var currentRow = $('#mainContent').find('.shared-data').children('.panel-body').children('p:eq(' + i + ')');
                var currentEmail = currentRow.children('span').text();
                if (currentRow.children('input[name="coOwnerEmailsWs"]').is(':checked')) {
                    updateEmail += 'coOwnerEmails=' + currentEmail + '&';
                }
                if (!currentRow.children('input[name="coOwnerEmailsWs"]').is(':checked')) {
                    if (currentRow.children('input[name="editEmailsWs"]').is(':checked')) {
                        updateEmail += 'editEmails=' + currentEmail + '&';
                    }
                }
                if (!currentRow.children('input[name="editEmailsWs"]').is(':checked')) {
                    if (currentRow.children('input[name="readEmailWs"]').is(':checked')) {
                        readEmailsVal = "readEmails";
                        updateEmail += 'readEmails=' + currentEmail + '&';
                    }
                }
            }
            updateEmail += 'workspaceId=' + wsId;
            CFWlistview.updateEmailsShared(updateEmail);
        });
    },

    showEditWorkspace : function(){
        sendGAEvents("Workspace",PageName+" / Edit Workspace");
        $('#tabName').text("Edit Workspace");
        var UserObj = JSON.parse(localStorage.getItem('CFUser'));
        $('#ownerMail').text(wsdetails.user.primaryEmail);
        $('#messageNotes').prop("disabled", false);
        $('#statusMsg').text('');
        $('#workspaceEmailId').css('border-color', '');
        $('#workspaceName').css('border-color', '');
        $('#workspaceEmailId').prop("disabled", false);
        $('#workspaceName').prop("disabled", false);
        $('#setPwdtoWs').prop("disabled", false);
        $('.addnewuseremail').prop("disabled", false);
        $('#WorkspaceSettings').addClass("divdisplay");
        $('#workSpaceFiles #advanceIcon').removeClass("icon-minus");
        $('#workSpaceFiles #advanceIcon').addClass("icon-plus");
        $('.removeTag1').show();
        $('.removeEmail1').show();
        $('#spinner1').addClass("divdisplay");
        $('#advancedWorkspaceUsers ').find('tr').each(function () {
            $('#advancedWorkspaceUsers ').find('tr').find('input').prop("disabled", true);
            $('#advancedWorkspaceUsers ').find('tr').find('td:eq(4)').children().show();
        });
        $('.workspaceAccessUserTH').find('td:eq(4)').show();
        $('#addNewWorkspaceUser').show();
        $('#workspaceSubmit').text("Update");
        $('#workspaceSubmit').attr("id", "CFEditWs");
        setTimeout(function(){$('#workspaceName').focus();},500);
        $('#WorkspaceUserNames').html("");
        $('#CFCreateWorkSpace input').val();
        $('#addUsers').html('');
        $('#workSpaceFiles .statusMesg').text('');
        $('#messageNotes').val('');
        $('#workSpaceFiles input').val('');
        $('#advancedWorkspaceUsers').html('');
        $('#addWorkspaceUser').css("opacity", "1");
        $('#addWorkspaceUser').css('pointer-events', 'auto');
        $('#WsdisplayMsg').text('');
        workspacemailsUnames = [];
        var wsDetails = "";
        if (FromfileId.length == 1 || WorkSpaceId.length > 1) {
            if (PageName == "InnerWorkSpace") {
                wsDetails = CFWlistview.getWorkspaceDetails(WorkSpaceId);
            }else{
                wsDetails = wsdetails;
            }
            var owner = wsDetails.coOwnerEmails;
            var read = wsDetails.readEmails;
            var edit = wsDetails.editEmails;
            $('#workspaceName').val(wsDetails.workspaceName);
            var password = wsDetails.password;
            if (password == "IGNORE_UPDATE" || password == "NOT_REQUIRED" || password == "" || password == "null" || password == "undefined") {
                $('.setPassword').fadeOut();
                $('#setPwdtoWs input[type="checkbox"]').prop('checked', false);
            }else {
                $('#setPwdtoWs input[type="checkbox"]').prop('checked', true);
                $('.setPassword').val(password);
                $('.setPassword').fadeIn();
            }
            if (read != null) {
                $.each(read, function (i, re) {
                    if ($.inArray(re, edit) > -1) {
                        edit = $.grep(edit, function (i) {
                            return i != re;
                        });
                    }
                });
            }
            if (edit != null) {
                $.each(edit, function (i, ed) {
                    if ($.inArray(ed, owner) > -1) {
                        owner = $.grep(owner, function (i) {
                            return i != ed;
                        });
                    }
                });
            }
            var emails = [];
            if (owner != null) {
                if (owner.length > 0) {
                    $.merge(emails, owner);
                }
            }
            if (edit != null) {
                if (edit.length > 0) {
                    emails = $.merge(emails, edit);
                }
            }
            if (read != null) {
                if (read.length > 0) {
                    emails = $.merge(emails, read);
                }
            }

            if (wsDetails.notes != '' || wsDetails.notes != undefined) {
                $('#messageNotes').val(wsDetails.notes);
            }
            workspacemailsUnames = emails;
            $.each(emails, function (i, em) {
                var jsondata;
                $('#WorkspaceUserNames').append('<span id="' + em + '" class="label label-default" style="float:left;margin:2px;">' + em + '<i class="removeTag1"></i></span>');
                if ($.inArray(em, owner) > -1) {
                    $('#advancedWorkspaceUsers').append('<tr id="' + em + '" type="owner" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + em + '</td><td style="width:15%;" class="WorkspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS" checked disabled/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS" checked/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                }
                if ($.inArray(em, edit) > -1) {
                    $('#advancedWorkspaceUsers').append('<tr id="' + em + '" type="edit" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + em + '</td><td style="width:15%;" class="WorkspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS" checked/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                }
                if ($.inArray(em, read) > -1) {
                    $('#advancedWorkspaceUsers').append('<tr id="' + em + '" type="read" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + em + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                }
            });
        }
        var uemail = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
        wsDetails = wsdetails;
        if(wsDetails.readEmails != null && $.inArray(uemail,wsDetails.readEmails) > -1){
            $('#workspaceEmailId').prop("disabled", true);
            $('#workspaceName').prop("disabled", true);
            $('.setPassword').prop("disabled", true);
            $('.setPassword').prop("disabled", true);
            $('#messageNotes').prop("disabled", true);
            $('#addNewWorkspaceUser').hide();
            $('#userDataWS').find('.removeTag1').hide();
            $('#advancedWorkspaceUsers ').find('tr').each(function () {
                $('#advancedWorkspaceUsers ').find('tr').find('input').prop("disabled", true);
                $('#advancedWorkspaceUsers ').find('tr').find('td:eq(4)').hide();
            });
            setTimeout(function () {
                $('.removeTag1').hide();
            }, 2500);
            toastr.error("You have only view Permission.You can't edit this workspace.");
        }
        else if(wsDetails.editEmails != null && $.inArray(uemail,wsDetails.editEmails) > -1){
            $('#workspaceEmailId').prop("disabled", true);
            $('#workspaceName').prop("disabled", true);
            $('.setPassword').prop("disabled", true);
            $('#addNewWorkspaceUser').hide();
            $('#addWorkspaceUser').css("opacity", "0.2");
            $('#addWorkspaceUser').css('pointer-events', 'none');
            $('#userDataWS').find('.removeTag1').hide();
            $('#setPwdtoWs input[type="checkbox"]').prop("disabled", true);
            $('#advancedWorkspaceUsers ').find('tr').each(function () {
                $('#advancedWorkspaceUsers ').find('tr').find('input').prop("disabled", true);
                $('#advancedWorkspaceUsers ').find('tr').find('td:eq(4)').children().hide();
            });
            setTimeout(function () {
                $('.removeTag1').hide();
            }, 3500);
        }
        if (PageName == "WorkSpace" || PageName == "InnerWorkSpace") {
            var me = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
            $('[id="' + me + '"]').children('td:eq(4)').children('i').hide();
            $('[id="' + me + '"]').children('td:eq(4)').children('i').parent().append('<span id="me">Me</span>');
            $('span[id="' + me + '"]').children('i').hide();
            $('[id="' + me + '"]').children('i').parent().append('<span id="me">(me)</span>');
            $('#advancedWorkspaceUsers').children('[id="' + me + '"]').find('#cownerASAS,.removeEmail').prop("disabled", "true");
        }
        $('#workSpaceFiles').modal('show');

    }
};

//Edit Workspace
$('.fileCreatecontrols').on('click','#CFEditWorkSpace', function() {
    var _ab = [" ","NOT_REQUIRED"];
    if($.inArray(wsdetails.password,_ab) < 0){
        wsdetails.editws = true;
        $('#myPasswordModel1').find('#wsPswd').val('');
        return $('#myPasswordModel1').modal('show');
    }
    else{
        CFWlistview.showEditWorkspace();
    }
});



function appendNavigation(details){
    if(details.parentFileRef == undefined || details.parentFileRef == null){
        var pid = $('.cf-back').attr('sid');
        $('.cf-back').attr('pid',pid);
        $('.cf-back').attr('fid',pid);
        $('.cf-back').attr('child',false);
    }else{
        var fileName = ['All Files','My Drive','SkyDrive',"",'My Files & Folders','cloudian'];
        var parent1 = details.parentFileRef;
        if(parent1 == null || $.inArray(parent1.objectName,fileName) > -1){
            var pid = $('.cf-back').attr('sid');
            $('.cf-back').attr('pid',pid);
            $('.cf-back').attr('fid',pid);
            $('.cf-back').attr('child',false);
        }else{
            $('.cf-back').attr('fid',details.id);
            $('.cf-back').attr('pid',details.parent);
            $('.cf-back').attr('child',true);
        }
    }
}

var CFWthumbnail = {
    thumbNail: $('#mainContent #ThumbnailContent > div.file'),
    thumbNailCheck: $('#mainContent #ThumbnailContent input.fileCheck'),
    currentFile: null,
    checkFile: function () {
        var thumbnails = $('#mainContent').find('#ThumbnailContent .file');
        var selectedCount = thumbnails.find('input.fileCheck:checked').length;
        if (selectedCount > 0) {
            thumbnails.addClass('active').removeClass('checked');
            thumbnails.find('input.fileCheck:checked').each(function () {
                $(this).parent().addClass('checked');
            });
        } else {
            thumbnails.not(CFHPthumbnail.currentFile).removeClass('active checked');
        }

    },
    UncheckFile: function () {
        var thumbnails = $('#mainContent').find('#ThumbnailContent .file');
        var selectedCount = thumbnails.find('input.fileCheck:checked').length;
        if (selectedCount <= 0) {
            thumbnails.removeClass('active checked');
        }
    },
    /*showMetaData: function (curObject, wsId, wsObj) {
        var curEle = $(curObject);
        var curPosition = curEle.position();
        var nextEle = curEle.next();
        var nextPosition = nextEle.position();
        var workspaceName = wsDetails.workspaceName;
        var workspaceId = wsDetails.id;
        var comments = wsDetails.notes;
        var type = wsDetails.type;
        var filesCount = 0;
        var shareObjects = [];
        var OwnerName = wsDetails.user.lastName;
        var collab = [];
        var TotalCollab;
        var ce = wsDetails.coOwnerEmails;
        var re = wsDetails.readEmails;
        var ee = wsDetails.editEmails;
        var celength = 0;
        var eelength = 0;
        var relength = 0;
        if (wsDetails.coOwnerEmails != null) {
            celength = wsDetails.coOwnerEmails.length;
        }
        if (wsDetails.editEmails != null) {
            eelength = wsDetails.editEmails.length;
        }
        if (wsDetails.readEmails != null) {
            relength = wsDetails.readEmails.length;
        }
        var sCount = celength + eelength + relength;
        if (wsDetails.shares != null) {
            $.each(wsDetails.shares, function (i, sf) {
                if (sf != null) {
                    shareObjects.push(sf);
                }
            });
            $.each(shareObjects, function (i, sobj) {
                if (sobj.file != null) {
                    filesCount = filesCount + 1;
                }
            });
        }
        if (ce != null || re != null || ee != null) {
            if (ce != null) {
                $.each(ce, function (i, cee) {
                    collab.push(cee);
                });
            }
            if (re != null) {
                $.each(re, function (i, ree) {
                    collab.push(ree);
                });
            }
            if (ee != null) {
                $.each(ee, function (i, eee) {
                    collab.push(eee);
                });
            }
            var uniqueEmails = collab.filter(function (itm, i, Collab1) {
                return i == Collab1.indexOf(itm);
            });
            TotalCollab = uniqueEmails.length;
        }else {
            TotalCollab = 0;
        }

        var addedOnData = CFManageCloudAccountsAjaxCall.getDateConversion(wsObj.creationDate);
        var objSize = CFManageCloudAccountsAjaxCall.getObjectSize(wsObj.objectSize);
        var thumbimg = wsObj.thumbLink;

        var metaData = '<div class="defaultFloat Metacontainer" id="MetacontainerWs">';
        metaData = metaData + '<div class="col-md-3"><div class="previewthumb"><img class="img-responsive" src="" /></div>';
        metaData = metaData + '<div class="metadata"><p>' + workspaceName + '<i class="editFilenameWs"></i></p>';
        metaData = metaData + '<p>Owner Name:' + OwnerName + '</p><p>Added on : ' + addedOnData + '</p><p>No. Of Files : ' + filesCount + '</p>';
        metaData = metaData + '<p>No.Of Collaborators : ' + TotalCollab + '</p></div><div class="metadatacontrols">';
        //metaData = metaData + '<input type="text" id="datepicker">';
        /!* metaData = metaData + '<input type="password" class="form-control" placeholder="Set Password" /><input type="text" class="calendar" id="datepicker2" placeholder="MM/DD/YYYY" data-days="" val=""/>'; *!/
        metaData = metaData + '<a href="#" class="btn default metaBtn" ><strong>Find Duplicates</strong></a>';
        metaData = metaData + '<a href="#" class="btn default metaBtn"><strong>Find Versions</strong></a>';
        metaData = metaData + '</div></div><div class="col-md-9 content"><div class="panel-group" id="accordion">';
        metaData = metaData + '<div class="panel panel-default"><div class="panel-heading shared-heading1"><h4 class="panel-title">';
        metaData = metaData + '<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Collaborators - <span id="sharedCount">' + sCount + '</span></a><i class="cancleUpdateWs btn3 btn-secondary">Cancel</i><i class="addNewemailWs btn3 btn-secondary">Add New</i><input type="button" name="Edit" class="editEmailWs pull-right btn3 btn-secondary" value="Edit"/></h4></div>';
        metaData = metaData + '<div id="collapseOne" class="panel-collapse collapse shared-data">';
        metaData = metaData + '<div class="panel-body">';
        metaData = metaData + '<div class="emailsList"><div class="shareEmails">Shared with</div><div class="readEmail">Read</div><div class="editEmail">Edit</div><div class="coOwnerEmails">CoOwner</div></div>';
        metaData = metaData + '</div></div></div><div class="panel panel-default">';
        //Comments
        metaData = metaData + '<div class="panel-heading  comments-heading1"><h4 class="panel-title">';
        metaData = metaData + '<a data-toggle="collapse" data-parent="#accordion" href="#collapseThree">Notes<span id="commentCount"></span></a></h4></div>';
        metaData = metaData + '<div id="collapseThree" class="panel-collapse collapse comments-data">';
        metaData = metaData + '<div class="panel-body"><div class="commentContainer"><textarea rows="4" cols="56"  class="form-control" id="notes"></textarea>';
        metaData = metaData + '<button type="button" name="addComment1" class="pull-right btn3 btn-secondary" id="addNoteButton">Add Note</button><button type="button" name="addComment1" class="pull-right btn3 btn-secondary divdisplay" id="cancelNoteButton">Cancel</button></div>';
        metaData = metaData + '</div></div></div></div></div></div>';

        $('#MetacontainerWs').slideUp().remove();
        if (nextEle.length <= 0) {
            curEle.after(metaData);
            $('#MetacontainerWs').slideUp(0).slideDown();
            return false;
        }
        if ((nextPosition.top - curPosition.top) >= 100) {
            curEle.after(metaData);
            $('#MetacontainerWs').slideUp(0).slideDown();
            $('#Metacontainer').append('<i id="closeMetaCont">X</i>');
            $('#MetacontainerWs').append('<i id="closeMetaCont">X</i>');
            return false;
        }
        CFWthumbnail.showMetaData(nextEle, wsId, wsObj);
    },*/
    init: function () {
        var wsId;
        var thumbNails = $('#mainContent').find('#ThumbnailContent .file');
        var thumbNailsCheck = $('#mainContent').find('#ThumbnailContent input.fileCheck');
        thumbNails.hover(function () {
            $(this).addClass('active');
            CFWthumbnail.currentFile = this;
        }, function () {
            CFWthumbnail.UncheckFile();
        });
        thumbNailsCheck.on('click', function () {
            CFHPthumbnail.checkFile();
        });
        /*$('#mainContent').not('#ThumbnailContent .addFilethumb').on('click', '#ThumbnailContent .file p', function () {
            wsId = $(this).attr('id');
            var wsObj = CFWlistview.getWorkspaceDetails(wsId);
            if (!$(this).parent().hasClass('selected')) {
                $('#mainContent').find('#ThumbnailContent .file ').removeClass('selected');
                var curEle = $(this).parent();
                CFWthumbnail.showMetaData(curEle, wsId, wsObj);
                thumbNails.removeClass('selected');
                $(this).parent().addClass('selected');
                $('#MetacontainerWs').append('<i id="closeMetaCont">X</i>');
                $('#mainContent').find('#sharedCount').html(wsObj.sharedCount);
                $('#mainContent').find('#commentCount').html(wsObj.commentsCount);
                $("#mainContent").find('.saveEmailWs, .addNewemailWs,.editEmailWs').hide();
            } else {
                $('#MetacontainerWs').slideUp();
                $(this).parent().removeClass('selected');
            }
            return false;
        });*/
        $('#mainContent').on('click', '#closeMetaCont', function () {
            $('#MetacontainerWs').slideUp();
            $('.LVfileName p').removeClass('active');
            $('#mainContent .file').removeClass('active');
        });
    }
};
/* workspace code........ */
$('#CFCws').click(function() {
    $('#spinner1').removeClass('divdisplay');
    var wspname = $('#wspname').val();
    var email = $('#usrEmail').val().toLowerCase();
    var pwd = $('#enterPswd').val();
    var repwd = $('#RenterPswd').val();
    var comments = $('#WSTextArea').val();
    var m = $('#Msg .statusMesg');
    if (wspname == "") {
        m.text('Please enter Workspace Name.');
        $('#wspname').focus();
        return false;
    }
    else if (156 < wspname.length || 0 < wspname.length && wspname.length < 1) {
        m.text('Workspace name must be between 1 to 156 characters.');
        $('#wspname').focus();
        return false;
    }
    var wslength = $('#ListContent p.pull-left').length;
    for (var i = 0; i < wslength; i++) {
        var wsaname = $('#ListContent p.pull-left:eq(' + i + ')').text();
        if (wspname == wsaname) {
            m.text('Workspace alreday exists.Please enter another name.');
            $('#wspname').focus();
            return false;
        }
    }

    if (email != "") {
        email = email.split(',');
        for (var i = 0; i < email.length; i++) {
            if (!emailReg.test(email[i])) {
                m.text('Please enter a valid e-mail address.');
                $('#usrEmail').focus();
                return false;
            }
            CFManageCloudAccountsAjaxCall.getUsername(email[i]);
            $('#addUsers').append('<p><span class="allemailsws">' + email[i] + '</span><input type="checkbox" class="read" name="readEmails" checked disabled><input type="checkbox" class="edit" name="editEmails"><input type="checkbox" class="coowner" name="coOwnerEmails"><i class="deleteUserEmail"></i></p>');
        }
    }
    if (pwd != repwd) {
        m.text('Password and Reenter Password does not match.');
        $('#enterPswd').focus();
        return false;
    }
    var emailCount = $('.addWorkspaceContent').find('span.allemailsws').length;
    var readEmailsVal = [],
        editEmailsVal = [],
        coOwnerEmailsVal = [];
    for (var i = 0; i < emailCount; i++) {
        var currentRow = $('.addWorkspaceContent').find('#addUsers').children('p:eq(' + i + ')');
        var currentEmail = currentRow.children('span').text();
        if (currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
            coOwnerEmailsVal.push(currentEmail);
            currentRow.children('input[name="coOwnerEmails"]').attr('checked', 'checked');
        }
        if (!currentRow.children('input[name="coOwnerEmails"]').is(':checked')) {
            if (currentRow.children('input[name="editEmails"]').is(':checked')) {
                editEmailsVal.push(currentEmail);
                currentRow.children('input[name="editEmails"]').attr('checked', 'checked');
            }
        }
        if (!currentRow.children('input[name="editEmails"]').is(':checked')) {
            if (currentRow.children('input[name="readEmails"]').is(':checked')) {
                readEmailsVal.push(currentEmail);
            }
        }
    }
    readEmailsVal = (readEmailsVal == "") ? null : readEmailsVal;
    editEmailsVal = (editEmailsVal == "") ? null : editEmailsVal;
    coOwnerEmailsVal = (coOwnerEmailsVal == "") ? null : coOwnerEmailsVal;
    var arr1 = {
        "type": "WORKSPACE",
        "workspaceName": wspname,
        "password": pwd,
        "readEmails": readEmailsVal,
        "coOwnerEmails": coOwnerEmailsVal,
        "editEmails": editEmailsVal,
        "creationDate": null,
        "modifiedDate": null,
        "notes": comments
    };
    var workSpaceJson = JSON.stringify(arr1);
    var apiUrl = apicallurl + "/workspace/create?domainUrl=" + domainUrl + "/WssharedNew";
    $.ajax({
        type: 'PUT',
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        data: workSpaceJson,
        dataType: 'json',
        success: function (workspace) {
            var wid = workspace.id;
            var wname = workspace.workspaceName;
            var owner = workspace.user.lastName;
            $('#LVContent').prepend('<div class="panel-data" name="Workspace"><div class="LVcheckBox" name="WORKSPACE"><input type="checkbox"></div><div class="LVfileName" id="' + wid + '" name="WORKSPACE"><i class="LVWSpace pull-left"></i><p class="pull-left" name="' + wname + '">' + wname + '</p><a href="#" title=""><i class="MetaDataIcon"></i></a></div><div class="LVFavorites">0</div><div class="LVfileSize">0</div><div class="LVdrive">' + owner + '</div><div class="LVaddedDate">---</div><div class="LVmodifiedDate">----</div></div>');
            $('#ThumbnailContent').append('<div class="file ' + workspace.type + '" name="Workspace"><i title="' + workspace.type + '" class="filethumbnail workspace" ></i><strong class="filename" id="' + wid + '" name="' + wname + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(wname,14) + '</strong><div class="filesize">No.Of Files </div><input type="checkbox" class="fileCheck" /><p href="#" id="' + wid + '"><i class="MetaDataIcon"></i></p></div>');
            //var wsdetails = CFManageCloudAccountsAjaxCall.getWorkSpaceForaUser();
            $('#ListContent').find('.panel-data').find('.LVfileName').each(function () {
                var wid = $(this).children("p").text();
                var Wsname = $(this).children("p").text();
                if (wspname == Wsname) {
                    $(this).click();
                }
            });
            $('#spinner1').addClass('divdisplay');
        },
        complete: function (xhr, statusText) {
            CFWthumbnail.init();
            if (xhr.status > 300) {
                //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                showNotyNotification("error","Operation Failed");
            }
        }
    });
    $(document).find('#plugJs').remove();
});
			
$('.userInput').keypress(function(event) {
    var e = $('#usrEmail'),
        c = $('.addWorkspaceContent').find('#addUsers'),
        emailValidat = c.find('p'),
        pcount=c.children('p').length,
        m =$('#Msg .statusMesg');
    var email = e.val().toLowerCase();
	if (event.keyCode == 13) {
		email=email.split(',');
	   for(var i=0;i<email.length;i++){
		if (!emailReg.test(email[i])) {
			m.text('Please enter valid email.');
			e.focus();
			return false;
		}
		for(var j=0;j<pcount;j++){
			var currentRow = c.children('p:eq(' + j + ')');
			if(email[i] == currentRow.children('span').text()){
				m.text('The user already available.');
				$('#enterPswd').focus();
				return false; 
			} 
		}
		CFManageCloudAccountsAjaxCall.getUsername(email[i]);
           var _html = '<p><span class="allemailsws">'+email[i]+'</span>' +
               '<input type="checkbox" class="read" name="readEmails" checked disabled>' +
               '<input type="checkbox" class="edit" name="editEmails">' +
               '<input type="checkbox" class="coowner" name="coOwnerEmails">' +
               '<i class="deleteUserEmail"></i></p>';
		$('#addUsers').append(_html);
		emailValidat.on('click', 'input[name="coOwnerEmails"]', function () {
			if ($(this).is(':checked') == true) {
				$(this).siblings('input[name="readEmails"], input[name="editEmails"]').prop('checked', true);
				$(this).siblings('input[name="readEmails"], input[name="editEmails"]').prop("disabled", true);
			} else {
				$(this).siblings('input[name="editEmails"]').prop("disabled", false);
			}
		});
		e.val('');
    }
}	
});
	// remove username & email Id..........

$('.addWorkspaceContent').on('click','.removeTag1',function(){
	var username=$(this).parent('span').text();
	CFManageCloudAccountsAjaxCall.getUseremail(username);
	$(this).parent('span').remove();
});
    //add new user email..
$('.addWorkspaceContent').on('click', '.addnewuseremail', function () {
    var _this = $('.addWorkspaceContent'),
        a = _this.find('#addUsers'),
        emailValidat =   a.find('p'),
        add = $('.addUserEmail'),
        m = $('#Msg .statusMesg');

	if($('#addUsers p span:has(input)').length > 0){
		return false;
	}

	var _h = '<p><span class="allemailsws">' +
        '<input type="text" placeholder="" class="addUserEmail"/></span>' +
        '<input type="checkbox" class="read" name="readEmails" checked disabled>' +
        '<input type="checkbox" class="edit" name="editEmails" >' +
        '<input type="checkbox" class="coowner" name="coOwnerEmails">' +
        '<i class="deleteUserEmail"></i></p>';
    a.prepend(_h);

    emailValidat.on('click', 'input[name="coOwnerEmails"]', function () {
		if ($(this).is(':checked') == true) {
			$(this).siblings('input[name="readEmails"], input[name="editEmails"]').prop('checked', true);
			$(this).siblings('input[name="readEmail"], input[name="editEmails"]').prop("disabled", true);
		} else {
			$(this).siblings('input[name="editEmails"]').prop("disabled", false);
		}    
	});
	add.keypress(function(event) {
		if (event.keyCode == 13) {				   
			var editedVal = $(this).val().toLowerCase();
			if (!emailReg.test(editedVal)) {
				m.text('Please enter valid email.');
				$('#usrEmail').focus();
				return false;
			}
			var pcount=a.children('p').length;
			for(var j=0;j<pcount;j++){
				var currentRow = a.children('p:eq(' + j + ')');
				if(editedVal == currentRow.children('span').text()){
					$(this).parent('span').parent('p').remove();
					m.text('The user already available.');
					$('#enterPswd').focus();
					return false; 
				} 
			}
            var _h1 = '<span class="allemailsws">'+editedVal+'</span>' +
                '<input type="checkbox" class="read" name="readEmails" checked disabled>' +
                '<input type="checkbox" class="edit" name="editEmails">' +
                '<input type="checkbox" class="coowner" name="coOwnerEmails">' +
                '<i class="deleteUserEmail"></i>';
			$(this).parent('span').parent('p').html(_h1);
			CFManageCloudAccountsAjaxCall.getUsername(editedVal);
		}
	}); 	
});
// remove username & email Id in AccessSettings..........
$('#addUsers').on('click', '.deleteUserEmail', function () {
	var email=$(this).siblings('span').text();
	$.each(mailsUnames, function(key, value) {
		if(key == email){
			var uname=value;
			var lcount=$('.addWorkspaceContent').find('#userDataWS').children('i').length;
			for(var j=0;j<lcount;j++){
				var currentRow = $('.addWorkspaceContent').find('#userDataWS').children('i:eq(' + j + ')');
				if(uname == currentRow.children('span').text()){
					currentRow.remove();
				}
			}
		}      
	});
	$(this).parent().remove();	 
});

$(document).on('click', '#mainContent .filethumbnail[name="Workspace"]', function() {
    $('#FooterLinks').css('width', '80%');
    sendGAEvents("Workspace","Navigate in to WorkSpace");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Navigate in to Workspace"]);
    var wsId = ($(this).siblings('strong').attr('id'));
    var wsname = $(this).siblings('strong').text();
    wsdetails = CFWlistview.getWorkspaceDetails(wsId);
    var UserObj = JSON.parse(localStorage.getItem('CFUser'));
    var uemail = UserObj.primaryEmail;
    if (wsdetails.password == "IGNORE_UPDATE" || wsdetails.password == "NOT_REQUIRED" || wsdetails.password == "" || wsdetails.password == "null" || wsdetails.password == "undefined") {
        $('#spinner1').removeClass("divdisplay");
        setTimeout(function () {
            wsClick(wsId, wsname, wsdetails);
        }, 100);
    }
    else {
        $('#CFWorkspacePwd').click();
        $('#wsPswd').focus();
    }
});

$('#CFWorkspacePwd').click(function() {
    $('#wsPswd').val('');
    $('.statusMesg').text('');
});

$('#CFPwdWorkspace').click(function() {
    var pwd = $('#wsPswd').val();
    var sPwd = wsdetails.password;
    if (pwd == "") {
        $('#wsPswd').focus();
        $('#Msg .statusMesg').text('Please enter password');
        return false;
    }
    else if (pwd != sPwd) {
        $('#Msg .statusMesg').text('Please enter valid password.');
        return false;
    }
    else if (pwd == sPwd) {
        $('#spinner1').removeClass("divdisplay");
        if(wsdetails.editws){
            CFWlistview.showEditWorkspace();
        }else{
            wsClick(wsdetails.id, wsdetails.workspaceName, wsdetails);
        }

    } else {
        return false;
    }
});

$('#wsPswd').keypress(function(e) {
    if (e.which == 13) {
        $('#CFPwdWorkspace').trigger('click');
    }
});

function wsClick(wsId,wsname,wsdetails) {
    $('#secondary').show();
    PageName = "InnerWorkSpace";
    $('#headerText').text(wsdetails.workspaceName);
    $('#actionPanel').css("border-bottom", "none");
    CFHideContents();
    CFShowContents();
    PageNumber = 1;
    WorkSpaceId = [];
    $('#workspaceAct').html('');
    $('.secondary-nav-menu > li').removeClass('active');
    $(this).addClass("active");
    WorkSpaceId.push(wsId);
    var uemail = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
    $('#spanNew').removeClass("divdisplay");
    $('#wsResponsive1').remove();
    $('#panelAlign').css("margin-left", "-37px");
    $('head').append('<link href="../stylesheets/wsResponsive2.css" id="wsResponsive2" rel="stylesheet" type="text/css" />');
    getFilesForaWorkspace(wsdetails);
    workspaceActicities(wsId, PageNumber);
    WorkSpaceId = wsId;
    $('#fileComments').html('');
    $('.commentContent').hide();
    $('#addingComments').addClass("divdisplay");
    $('#commentHeader').addClass("divdisplay");
    $('#NewWorkspace').hide();
    $('#NoWorkspaces').hide();
    $('#secondary  a[id="' + wsId + '"]').parent().addClass('active');
    $('thead > tr > th > input[type="checkbox"]').prop("checked", false);
    if (PageName == "InnerWorkSpace") {
        var _a = {
            'edit':false,
            'upload':false,
            'rename':false
        };
        if(wsdetails.editEmails != null && $.inArray(uemail,wsdetails.editEmails) > -1) {
            var _e = {
                'rename':true,
                'edit':true
            };
            _e = $.extend(_a,_e);
            enablePermisssions(_e);
        }
        else if(wsdetails.readEmails != null && $.inArray(uemail,wsdetails.readEmails) > -1){
            var _r = {
                'edit':true,
                'upload':true,
                'rename':true
            };
            _r = $.extend(_a,_r);
            enablePermisssions(_r);
            $('#NoFilesWorkspace').hide();
            //$.smallBox({title: "You have only view Permission.You can't edit this workspace.", color: "#1ba1e2", timeout: notifyTime, sound: false});
            showNotyNotification("notify","You have only view Permission.You can't edit this workspace.");
        }
        else if(wsdetails.ownerEmailId == uemail || ( wsdetails.coOwnerEmails != null && $.inArray(uemail,wsdetails.coOwnerEmails) > -1)){
             //enablePermisssions(_a);

            enablePermisssions(_a);
            
         }
    }
}

function enablePermisssions(obj){
    var e = $('#CFEditWorkSpace'),
        u = $('#CFUploadFiles');
//when open for preview file in view workspace and came back to cowner the file create controals hidden to to remove that one
     $('.fileCreatecontrols').removeClass('buttonDisable');

    if(obj.edit){
        e.addClass('buttonDisable');
    }else{
        e.removeClass('buttonDisable');
    }
    if(obj.upload){
        u.addClass('buttonDisable');
    }else{
        u.removeClass('buttonDisable');
    }
    /*if(obj.rename){
        $('#CFHRename').css('pointer-events', 'none');
        $('#CFHRename > div').css('opacity', '0.2');
    }else{
        $('#CFHRename').css('pointer-events', 'auto');
        $('#CFHRename > div').css('opacity', '1');
    }*/
}

function getFilesForaWorkspace(WSInfo) {
    //$('#CFUploadFiles').removeClass('buttonDisable');
    $('#CFHDelete').children('div').children('div:eq(1)').text("Remove");
    $('#CFHDelete').attr("title", "Remove from workspace");
    $('#workspaceFiles').html('');
    var ShareObjects = [];
    var Files = [];
    var filetype = '12';
    PageNumber = 1;
    if (WSInfo.files != null) {
        $.each(WSInfo.files, function (i, WSShare) {
            ShareObjects.push(WSShare);
        });
        $.each(ShareObjects, function (i, sobj) {
            if (sobj != null) {
                Files.push(sobj);
            }
        });
    }
    $.each(Files, function (i, file) {
        var filetype1 = file.directory;
        var fileExtn = file.objectExtn;
        var filetype;
        if (filetype1 == false) {
            filetype = "FIL";
            fileClass = "sorting_1";
        }
        if (filetype1 == true) {
            filetype = "FOLDER";
            fileClass = "folder";
        }
        var datatype = file.directory == true ? "Folder" : "File";
        var version = "design";
        if (file.shared == true) {
            version = "sign";
        }
        var _file = '<tr class="gradeA" fexten=' + fileExtn + ' style="display:inline-table" data-type="'+datatype+'">' +
            '<td class="wsfcheckbox"><input type="checkbox" /></td>' +
            '<td class="LVFILEIcon"><i class="LV' + filetype + '" style="width: 22px;height: 29px;display: block;margin-top: 0px;cursor:pointer;"></i></td>' +
            '<td class="'+fileClass+'" name=' + encodeURIComponent(file.objectName) + ' cloudid=' + file.cloudId + ' id=' + encodeURIComponent(file.id) + ' data-type=' + file.objectSize + ' title="'+file.objectName+'"><span style="display:inline-block;width:100%">' + CFManageCloudAccountsAjaxCall.getMaxChars(file.objectName,25) + '</span></td>' +
            '<td style="width:13.5%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getObjectSize(file.objectSize, filetype) + '</td>' +
            '<td class=" " style="width:20%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getDateConversion(file.modifiedTime) + '</td>' +
            '<td style="font-size: 20px;width:7%;padding: 3px 8px 0 5px;"><i class="cf-comments2" id="getComments"></i></td>' +
            '</tr>';
        $('#workspaceFiles').append(_file);
    });
    if(sessionStorage.getItem('clouds') == "false"){
        $('#NoCloudsWorkspace').show();
        $('#CFUploadFiles').addClass('buttonDisable');
        return false;
    }else if(sessionStorage.getItem('clouds')== "true"){
        $('#NoCloudsWorkspace').hide();
    }
    if (Files.length == 0) {
        $('#NoFilesWorkspace').show();
    }else{
        $('#NoFilesWorkspace').hide();
    }
}

$(document).on('click', '.secondary-nav-menu > li.getFilesForWorkspace', function() {
    PageName = "InnerWorkSpace";
    sendGAEvents("Workspace",PageName+" / Navigate into Workspace");
    if (PageName == "InnerWorkSpace") {
        if (count == 1) {
            previousPage = PageName;
        }
        var wsId = ($(this).children('a').attr('id'));
        var wsname = $(this).children('a').text();
        wsdetails = CFWlistview.getWorkspaceDetails(wsId);
        var UserObj = JSON.parse(localStorage.getItem('CFUser'));
        if (wsdetails.password == "NOT_REQUIRED" || wsdetails.password == "IGNORE_UPDATE" || wsdetails.password == "" || wsdetails.password == "null" || wsdetails.password == "undefined") {
            $('#spinner1').removeClass("divdisplay");
            setTimeout(function () {
                wsClick(wsId, wsname, wsdetails);
            }, 100);
        }
        else {
            $('#CFWorkspacePwd').click();
            $('#wsPswd').focus();
        }
    }
});

function workspaceActicities(wsId, PageNumber) {
    $('#showMoreWorkAct').addClass("divdisplay");
    CFWlistview.getWorkspaceActivities(wsId, PageNumber);
}

$('#showMoreWorkAct').click(function() {
    $('#showMoreWorkAct').addClass("divdisplay");
    PageNumber = PageNumber + 1;
    workspaceActicities(WorkSpaceId, PageNumber);
});
//var WorkspaceData = [];
//var addWorkspace;
$('#CFAddWorkspaceButton').on('click',function() {
    var wsname = $('#addWorkspaces_chosen span').text();
    var wslength = $('#addWorkspaces').children('option').length;
    for (var i = 0; i < wslength; i++) {
        var wsoptname = $('#addWorkspaces').children('option:eq(' + i + ')').text();
        if (wsname == wsoptname) {
            var Wsid = $('#addWorkspaces').children('option:eq(' + i + ')').attr("id");
        }
    }
    if (wsname != "" && wsname != null) {
        CFManageCloudAccountsAjaxCall.addFilesToWorkspace(Wsid, FromfileId);
    }
    $(document).find('#plugJs1').remove();
    $(document).find('#plugJs2').remove();
    $(document).find('#plugJs3').remove();
});

$('#workSpaceFiles').on('click','#CFEditWs' ,function() {
    var wspname = $('#workspaceName').val();
    var usermail = $('#workspaceEmailId').val().toLowerCase();
    var notes = $('#messageNotes').val();
    if (notes == undefined || notes == '') {
        notes = "NOT_REQUIRED";
    }
    $('#workspaceEmailId').css('border-color', '');
    $('#workspaceName').css('border-color', '');
    if (wspname == "") {
        $('#workspaceName').css('border-color', 'red');
        $('#statusMsg').text('Please enter workspace name.');
        $('#workspaceName').focus();
        return false;
    }
    if (156 < wspname.length || 0 <= wspname.length && wspname.length < 1) {
        $('#workspaceName').css("border-color", "red");
        $('#statusMsg').text('The workspace name must between 1 to 156 characters.');
        $('#workspaceName').focus();
        return false;
    }
    if(/%/i.test(wspname)){
        $('#workspaceName').css("border-color", "red");
        $('#statusMsg').text('% is not allowed in workspace name.');
        $('#workspaceName').focus();
        return false;
    }else {
        $('#workspaceName').css('border-color', '');
    }
    var wslength = $('#ThumbnailContent strong.filename').length;
    for (var i = 0; i < wslength; i++) {
        var wsaname = $('#ThumbnailContent i.filethumbnail:eq(' + i + ')').attr("title");
        var wsid = $('#ThumbnailContent strong.filename:eq(' + i + ')').attr("id");
        wspname = wspname.trim();
        wsaname = wsaname.trim();
        var wId = "";
        if (PageName == "WorkSpace") {
            wId = FromfileId[0];
        } else {
            wId = WorkSpaceId;
        }
        if (wspname.toLowerCase() == wsaname.toLowerCase() && wId != wsid) {
            $('#workspaceName').css('border-color', 'red');
            $('#statusMsg').text('Workspace already exists.Please enter another name.');
            $('#workspaceName').focus();
            return false;
        }
    }
    var usermailadd = $('#emailInputBox').val();
    if (usermailadd != undefined) {
        usermailadd = $('#emailInputBox').val().toLowerCase();
        if (usermailadd == '') {
            $('#emailInputBox').css('border-color', 'red');
            $('#statusMsg').text('Please enter email.');
            $('#emailInputBox').focus();
            return false;
        } else {
            $('#emailInputBox').css('border-color', '');
        }
        if (!emailReg.test(usermailadd)) {
            $('#emailInputBox').css('border-color', 'red');
            $('#statusMsg').text('Please enter valid email.');
            $('#emailInputBox').focus();
            return false;
        } else {
            $('.emailAddOk').trigger('click');
        }
    }
    if (usermail != '') {
        var user = localStorage.getItem("CFUser");
        user = jQuery.parseJSON(user);
        usermail = usermail.split(',');
        for (var i = 0; i < usermail.length; i++) {
            if (usermail[i] == '') {
                $('#workspaceEmailId').css('border-color', 'red');
                return false;
            }
            if (usermail[i] == user.primaryEmail && usermail[i] != wsDetails.user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('You are the CoOwner.');
                return false;
            }
            if (usermail[i] != user.primaryEmail && usermail[i] == wsDetails.user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('This user is owner of workspace.');
                return false;
            }
            if (usermail[i] == user.primaryEmail && usermail[i] == wsDetails.user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('You are the Owner.');
                return false;
            }
            if ($.inArray(usermail[i], workspacemailsUnames) > -1) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('This Email is already Added.');
                return false;
            }
            if (emailReg.test(usermail[i])) {
                $(this).parent().siblings('div').children('input').val('');
                $(this).parent().siblings('div').children('input').css('border-color', '');
                $('#workspaceEmailId').focus();
                $('#advancedWorkspaceUsers').append('<tr id="' + usermail[i] + '" type="read" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + usermail[i] + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                if ($.inArray('read', FilePer) > -1) {
                    $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
                    $('#advancedWorkspaceUsers #editASAS').prop('disabled', true);
                }
                if ($.inArray('edit', FilePer) > -1) {
                    $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
                }
                if ($.inArray(usermail[i], workspacemailsUnames) < 0) {
                    workspacemailsUnames.push(usermail[i]);
                }
                if (FromfileId.length == 1) {
                    var updateEmail = "";
                    updateEmail += 'workspaceId=' + FromfileId[0] + '&';
                    updateEmail += 'readEmails=' + usermail[i];
                    CFWlistview.addCollabrator(updateEmail);
                }
                $(this).parent().siblings('td').children('input').css('border-color', '');
                var jsondata = "";
                $('#WorkspaceUserNames').append('<span id="' + usermail[i] + '" class="label label-default" style="float:left;margin:2px;">' + usermail[i] + '<i class="removeTag1"></i></span>');
            } else {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#workspaceEmailId').val(usermail[i]);
                $('#statusMsg').text('Please enter valid email.');
                return false;
            }
        }
    }
    var readEmailsVal = [];
    var editEmailsVal = [];
    var coOwnerEmailsVal = [];
    var wsId = "";
    if (PageName == "WorkSpace") {
        wsId = FromfileId[0];
    } else {
        wsId = WorkSpaceId;
    }
    var colabcount = $('#advancedWorkspaceUsers').children('tr').length;
    var updateEmail = '';
    $('#advancedWorkspaceUsers').children('tr').each(function () {
        var email = $(this).attr('id');
        var type = $(this).attr('type');
        if (type == "read") {
            updateEmail += 'readEmails=' + email + '&';
        }
        if (type == "edit") {
            updateEmail += 'editEmails=' + email + '&';
        }
        if (type == "owner") {
            updateEmail += 'coOwnerEmails=' + email + '&';
        }
    });
    updateEmail += 'workspaceId=' + wsId + '&';
    if ($('#setPwdtoWs input[type="checkbox"]').prop('checked') == true) {
        var pass = $('#setPwdtoWs .setPassword:first').val();
        var cpass = $('#setPwdtoWs .setPassword:eq(1)').val();
        if (pass == "" || cpass == "") {
            if (pass == "") {
                $('#setPwdtoWs .setPassword:first').css('border-color', 'red');
                $('#setPwdtoWs .setPassword:eq(1)').css('border-color', '');
                $('#WsdisplayMsg').text("Please enter password.");
                $('#setPwdtoWs .setPassword:first').focus();
                return false;
            }
            if (pass.length < 6 || pass.length > 20) {
                $('#setPwdtoWs .setPassword:first').css('border-color', 'red');
                $('#setPwdtoWs .setPassword:eq(1)').css('border-color', '');
                $('#WsdisplayMsg').text("Password must be 6-20 characters in length.");
                $('#setPwdtoWs .setPassword:first').focus();
                return false;
            }
            if (cpass == "") {
                $('#setPwdtoWs .setPassword:first').css('border-color', '');
                $('#setPwdtoWs .setPassword:eq(1)').css('border-color', 'red');
                $('#WsdisplayMsg').text("Please enter confirm password.");
                $('#setPwdtoWs .setPassword:eq(1)').focus();
            }
            return false;
        }
        if (cpass.length < 6 || cpass.length > 20) {
            $('#setPwdtoWs .setPassword:first').css('border-color', '');
            $('#setPwdtoWs .setPassword:eq(1)').css('border-color', 'red');
            $('#WsdisplayMsg').text("Password must be 6-20 characters in length.");
            $('#setPwdtoWs .setPassword:eq(1)').focus();
            return false;
        }
        if (pass != cpass) {
            $('#setPwdtoWs .setPassword:eq(1)').css('border-color', 'red');
            $('#setPwdtoWs .setPassword:first').css('border-color', '');
            $('#WsdisplayMsg').text("Password and Confirm password should match.");
            $('#setPwdtoWs .setPassword:eq(1)').focus();
            return false;
        }else {
            $('#setPwdtoWs .setPassword').css('border-color', '');
            $('#WsdisplayMsg').text('');
            password = pass;
        }
    }
    if ($('#setPwdtoWs input[type="checkbox"]').prop('checked') == false) {
        password = "NOT_REQUIRED";
    }

    var UserObj = JSON.parse(localStorage.getItem('CFUser'));
    var uemail = UserObj.primaryEmail;
    bl1:{
        if (wsdetails.readEmails != null) {
            for (var i = 0; i < wsdetails.readEmails.length; i++) {
                if (uemail == wsdetails.readEmails[i]) {
                    break bl1;
                }
            }
        }
        if (wsdetails.editEmails != null) {
            for (var i = 0; i < wsdetails.editEmails.length; i++) {
                if (uemail == wsdetails.editEmails[i]) {
                    var updatwname = "";
                    var temp = "IGNORE_UPDATE";
                    var temp1 = "NOT_REQUIRED";
                    updatwname += 'name=' + temp1 + '&';
                    updatwname += 'notes=' + notes + '&';
                    updatwname += 'password=' + temp;
                    CFWlistview.addCommentsWorkspace(wsId, updatwname);
                    break bl1;
                }
            }
        }
        if (wsdetails.coOwnerEmails != null) {
            var updatwname = "";
            for (var i = 0; i < wsdetails.coOwnerEmails.length; i++) {
                if (uemail == wsdetails.coOwnerEmails[i]) {
                    if (colabcount >= 1) {
                        CFWlistview.updateEmailsShared(updateEmail);
                    }
                    var temp = "NOT_REQUIRED";
                    updatwname = 'name=' + wspname + '&notes=' + notes + '&password=' + encodeURIComponent(password);
                    setTimeout(function () {
                        CFWlistview.renameWorkspace(wsId, updatwname, wspname, password);
                    }, 500);
                    break bl1;
                }
            }
        }
        if (colabcount >= 1) {
            CFWlistview.updateEmailsShared(updateEmail);
        }
        updatwname = "";
        var temp = "NOT_REQUIRED";
        updatwname += 'name=' + wspname + '&';
        updatwname += 'notes=' + notes + '&';
        updatwname += 'password=' + encodeURIComponent(password);
        setTimeout(function () {
            CFWlistview.renameWorkspace(wsId, updatwname, wspname, password);
        }, 500);
        break bl1;

    }
    unCheckFile();
    $('#workSpaceFiles').modal('hide');
});
$('#addNewWorkspaceUser').on('click',function() {
    var testid = $('#advancedWorkspaceUsers').children('tr:first').attr('id');
    if (testid == 'newUser') {
        return false
    }else {
        $('#advancedWorkspaceUsers').prepend('<tr id="newUser" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser"><input type="text" style="height: 20px;margin-top: 10px;width:92%;" autofocus id="emailInputBox"/><i class="emailAddOk"></i></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        $('#emailInputBox').focus();
        if ($.inArray('read', FilePer) > -1) {
            $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
            $('#advancedWorkspaceUsers #editASAS').prop('disabled', true);
        }
        if ($.inArray('edit', FilePer) > -1) {
            $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
        }
    }
    var emailInput = $('#emailInputBox');
    var emailClick = $('.emailAddOk');
    $('#emailInputBox').keypress(function (e) {
        if (e.which == 13) {
            $('.emailAddOk').trigger('click');
        }
    });
});
$('#addWorkspaceUser').on('click',function() {
    sendGAEvents("Workspace","Add Collab / Create Workspace");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId')," Add Collab / Create Workspace"]);
    var usermail1 = $(this).parent().siblings('div').children('input').val();
    var usermail = usermail1.toLowerCase();
    var user = localStorage.getItem("CFUser");
    user = jQuery.parseJSON(user);
    usermail = usermail.split(',');
    for (var i = 0; i < usermail.length; i++) {
        usermail[i] = $.trim(usermail[i]);
        if (usermail[i] == '') {
            $('#workspaceEmailId').css('border-color', 'red');
            $('#statusMsg').text('Please enter email id.');
            return false;
        }
        if (FromfileId.length == 1) {
            if (usermail[i] == user.primaryEmail && usermail[i] != wsDetails.user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('You are the CoOwner.');
                return false;
            }
            if (usermail[i] != user.primaryEmail && usermail[i] == wsDetails.user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('This user is owner of workspace.');
                return false;
            }
            if (usermail[i] == user.primaryEmail && usermail[i] == wsDetails.user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('You are the Owner.');
                return false;
            }
        }else if (usermail[i] == user.primaryEmail) {
            $('#workspaceEmailId').css('border-color', 'red');
            $('#statusMsg').text('You are the Owner.');
            return false;
        }
        if ($.inArray(usermail[i], workspacemailsUnames) > -1) {
            $('#workspaceEmailId').css('border-color', 'red');
            $('#statusMsg').text('This Email is already Added.');
            return false;
        }
        if (emailReg.test(usermail[i])) {
            $(this).parent().siblings('div').children('input').val('');
            $(this).parent().siblings('div').children('input').css('border-color', '');
            $('#workspaceEmailId').focus();
            $('#advancedWorkspaceUsers').append('<tr id="' + usermail[i] + '" type="edit" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + usermail[i] + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked id="editASAS"/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
            if ($.inArray('read', FilePer) > -1) {
                $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
                $('#advancedWorkspaceUsers #editASAS').prop('disabled', true);
            }
            if ($.inArray('edit', FilePer) > -1) {
                $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
            }
            if ($.inArray(usermail[i], workspacemailsUnames) < 0) {
                workspacemailsUnames.push(usermail[i]);
            }
            var wId = [];
            var checksum = $(this).closest('#workSpaceFiles').find('#tabName').text();
            if (PageName == "WorkSpace" && checksum == "Edit Workspace") {
                WorkSpaceId = FromfileId[0];
            }
            if (checksum != "Edit Workspace") {
                if (FromfileId.length != 0) {
                    wId.push(FromfileId[0]);
                }
            } else {
                wId.push(WorkSpaceId);
            }
            if (wId.length == 1) {
                var updateEmail = "";
                updateEmail += 'workspaceId=' + wId + '&';
                updateEmail += 'editEmails=' + usermail[i];
                CFWlistview.addCollabrator(updateEmail);
            }
            $(this).parent().siblings('td').children('input').css('border-color', '');
            $('#statusMsg').text('');
            $('#WorkspaceUserNames').append('<span id="' + usermail[i] + '" class="label label-default" style="float:left;margin:2px;">' + usermail[i] + '<i class="removeTag1"></i></span>');
        }else {
            $('#workspaceEmailId').css('border-color', 'red');
            $('#workspaceEmailId').val(usermail[i]);
            $('#statusMsg').text('Please enter valid email.');
            return false;
        }
    }
});
$('table').on('click','.emailAddOk',function() {
    $('#statusMsg').text('');
    var email1 = $(this).siblings('input').val();
    var email = email1.toLowerCase();
    if (email == '') {
        $(this).siblings('input').css('border-color', 'red');
        return false;
    }
    var user = localStorage.getItem("CFUser");
    user = jQuery.parseJSON(user);
    if (email == user.primaryEmail) {
        $('#workspaceEmailId').css('border-color', 'red');
        $('#statusMsg').text('Already you are the Owner.');
        return false;
    }
    if (emailReg.test(email)) {
        if ($.inArray(email, workspacemailsUnames) > -1) {
            $(this).siblings('input').css('border-color', 'red');
            //$.smallBox({title: "This is email is already added.", color: "#e35e00", timeout: notifyTime, sound: false});
            showNotyNotification("error","This email is already added.");
            return false;
        }
        $(this).parent().parent().remove();
        var type = "read";
        if ($(this).parent().siblings('.workspaceAccessUser').children('#editASAS').is(':checked')) {
            type = "edit";
        }
        if ($(this).parent().siblings('.workspaceAccessUser').children('#cownerASAS').is(':checked')) {
            type = "owner";
        }
        if (type == "read") {
            $('#advancedWorkspaceUsers').append('<tr id="' + email + '" type=' + type + '><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + email + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        }
        if (type == "edit") {
            $('#advancedWorkspaceUsers').append('<tr id="' + email + '" type=' + type + '><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + email + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS" checked/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        }
        if (type == "owner") {
            $('#advancedWorkspaceUsers').append('<tr id="' + email + '" type=' + type + '><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + email + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS" checked disabled/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS" checked/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        }
        if ($.inArray('read', FilePer) > -1) {
            $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
            $('#advancedWorkspaceUsers #editASAS').prop('disabled', true);
        }
        if ($.inArray('edit', FilePer) > -1) {
            $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
        }
        if ($.inArray(email, workspacemailsUnames) < 0) {
            workspacemailsUnames.push(email);
        }else {
            $(this).siblings('input').css('border-color', 'red');
            return false;
        }

        if (FromfileId.length == 1) {
            var updateEmail = "";
            updateEmail += 'workspaceId=' + FromfileId[0] + '&';
            if (type == "edit") {
                updateEmail += 'editEmails=' + email;
            } else if (type == "owner") {
                updateEmail += 'coOwnerEmails=' + email;
            }
            updateEmail += 'readEmails=' + email;
            CFWlistview.addCollabrator(updateEmail);
        }
        $(this).siblings('input').css('border-color', '');
        $('#WorkspaceUserNames').append('<span id="' + email + '" class="label label-default" style="float:left;margin:2px;">' + email + '<i class="removeTag1"></i></span>');
    }
    else {
        $(this).siblings('input').css('border-color', 'red');
    }
});
$('#showAdvancedWorkspaceSettings').on('click',function() {
    sendGAEvents("Workspace",PageName+" / Show | hide Advanced Settings");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),PageName+" / Show | hide Advanced Settings"]);
    $('#WorkspaceSettings').toggleClass('divdisplay');
    if ($('#WorkspaceSettings').hasClass("divdisplay")) {
        $('#workSpaceFiles #advanceIcon').removeClass("icon-minus");
        $('#workSpaceFiles #advanceIcon').addClass("icon-plus");
    } else {
        $('#workSpaceFiles #advanceIcon').addClass("icon-minus");
        $('#workSpaceFiles #advanceIcon').removeClass("icon-plus");
    }
});
$('#advancedWorkspaceAS').on('click','.removeEmail1',function() {
    sendGAEvents("Workspace","Remove Collab in Advanced Settings");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Remove Collab in Advanced Settings"]);
    var email = $(this).parent().parent().attr('id');
    workspacemailsUnames = $.grep(workspacemailsUnames, function (i) {
        return i != email;
    });
    $('#WorkspaceUserNames').children('span[id="' + email + '"]').remove();
    var email = $(this).parent().parent().attr('id');
    var type = $(this).parent().parent().attr('type');
    var updateEmail = '';
    updateEmail += 'workspaceId=' + FromfileId[0] + '&';

    if (type == 'owner') {
        updateEmail += 'coOwnerEmails=' + email;
    }else if (type == 'edit') {
        updateEmail += 'editEmails=' + email;
    }else if (type == 'read') {
        updateEmail += 'readEmails=' + email;
    }
    if (FromfileId.length != 0) {
        CFWlistview.deleteFileshare(updateEmail);
    }
    $(this).parent().parent().remove();
});
$('#workSpaceFiles').on('click','#workspaceSubmit' ,function() {
    sendGAEvents("Workspace",PageName+" / Create Workspace");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),PageName+" / Create Workspace"]);
    var readEmailsVal = [];
    var editEmailsVal = [];
    var coOwnerEmailsVal = [];
    var password;
    var WorkspaceData = {};
    var colabcount = $('#advancedWorkspaceUsers').children('tr').length;
    var wsname = $('#workspaceName').val();
    var usermail = $('#workspaceEmailId').val().toLowerCase();
    $('#workspaceEmailId').css('border-color', '');
    $('#workspaceName').css('border-color', '');
    $('#statusMsg').text('');
    if (wsname == "") {
        $('#workspaceName').css('border-color', 'red');
        $('#statusMsg').text('Please enter workspace name.');
        $('#workspaceName').focus();
        return false;
    }
    if (156 < wsname.length || 0 <= wsname.length && wsname.length < 1) {
        $('#workspaceName').css("border-color", "red");
        $('#statusMsg').text('The workspace name must between 1 to 156 characters.');
        $('#workspaceName').focus();
        return false;
    }else {
        $('#workspaceName').css('border-color', '');
    }
    var wslength = $('#ThumbnailContent strong.filename').length;
    for (var i = 0; i < wslength; i++) {
        var wsaname = $('#ThumbnailContent i.filethumbnail:eq(' + i + ')').siblings('strong').attr("name");
        wsname = wsname.trim();
        wsaname = wsaname.trim();
        if (wsname.toLowerCase() == wsaname.toLowerCase()) {
            $('#workspaceName').css('border-color', 'red');
            $('#statusMsg').text('Workspace already exists.Please enter another name.');
            $('#wsname').focus();
            return false;
        }
    }

    var usermailadd = $('#emailInputBox').val();
    if (usermailadd != undefined) {
        usermailadd = $('#emailInputBox').val().toLowerCase();
        if (usermailadd == '') {
            $('#emailInputBox').css('border-color', 'red');
            $('#statusMsg').text('Please enter email.');
            $('#emailInputBox').focus();
            return false;
        } else {
            $('#emailInputBox').css('border-color', '');
        }
        if (!emailReg.test(usermailadd)) {
            $('#emailInputBox').css('border-color', 'red');
            $('#statusMsg').text('Please enter valid email.');
            $('#emailInputBox').focus();
            return false;
        } else {
            $('.emailAddOk').trigger('click');
        }
    }
    if (usermail != '') {
        var user = localStorage.getItem("CFUser");
        user = jQuery.parseJSON(user);
        usermail = usermail.split(',');
        for (var i = 0; i < usermail.length; i++) {
            if (usermail[i] == '') {
                $('#workspaceEmailId').css('border-color', 'red');
                return false;
            }
            if (usermail[i] == user.primaryEmail) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text('Already you are the Owner.');
                return false;
            }

            if ($.inArray(usermail[i], workspacemailsUnames) > -1) {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#statusMsg').text("This Email is already Added");
                return false;
            }
            if (emailReg.test(usermail[i])) {
                $(this).parent().siblings('div').children('input').val('');
                $(this).parent().siblings('div').children('input').css('border-color', '');
                $('#workspaceEmailId').focus();
                $('#advancedWorkspaceUsers').append('<tr id="' + usermail[i] + '" type="read" style="border-bottom:1px solid #eee; height:30px;"><td style="width:51%;text-align:left;" class="workspaceAccessUser">' + usermail[i] + '</td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="workspaceAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="workspaceAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="workspaceAccessUser"><i class="removeEmail1" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                if ($.inArray('read', FilePer) > -1) {
                    $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
                    $('#advancedWorkspaceUsers #editASAS').prop('disabled', true);
                }
                if ($.inArray('edit', FilePer) > -1) {
                    $('#advancedWorkspaceUsers #cownerASAS').prop('disabled', true);
                }
                if ($.inArray(usermail[i], workspacemailsUnames) < 0) {
                    workspacemailsUnames.push(usermail[i]);
                }
                if (FromfileId.length == 1) {
                    var updateEmail = "";
                    updateEmail += 'workspaceId=' + FromfileId[0] + '&';
                    updateEmail += 'readEmails=' + usermail[i];
                    CFWlistview.addCollabrator(updateEmail);
                }
                $(this).parent().siblings('td').children('input').css('border-color', '');
                $('#WorkspaceUserNames').append('<span id="' + usermail[i] + '" class="label label-default" style="float:left;margin:2px;">' + usermail[i] + '<i class="removeTag1"></i></span>');
            } else {
                $('#workspaceEmailId').css('border-color', 'red');
                $('#workspaceEmailId').val(usermail[i]);
                $('#statusMsg').text('Please enter valid email.');
                return false;
            }
        }
    }
    $('#advancedWorkspaceUsers').children('tr').each(function () {
        var email = $(this).attr('id');
        var type = $(this).attr('type');
        if (type == "read") {
            readEmailsVal.push(email);
        }
        if (type == "edit") {
            editEmailsVal.push(email);
        }
        if (type == "owner") {
            coOwnerEmailsVal.push(email);
        }
    });
    var notes = $('#messageNotes').val();

    if ($('#setPwdtoWs input[type="checkbox"]').prop('checked') == true) {
        sendGAEvents("Workspace","Set Password");
        //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Set Password"]);
        var pass = $('#setPwdtoWs .setPassword:first').val();
        var cpass = $('#setPwdtoWs .setPassword:eq(1)').val();
        if (pass == "" || cpass == "") {
            if (pass == "") {
                $('#setPwdtoWs .setPassword:first').css('border-color', 'red');
                $('#setPwdtoWs .setPassword:eq(1)').css('border-color', '');
                $('#WsdisplayMsg').text("Please enter password.");
                $('#setPwdtoWs .setPassword:first').focus();
                return false;
            }
            if (pass.length < 6 || pass.length > 20) {
                $('#setPwdtoWs .setPassword:first').css('border-color', 'red');
                $('#setPwdtoWs .setPassword:eq(1)').css('border-color', '');
                $('#WsdisplayMsg').text("Password must be 6-20 characters in length.");
                $('#setPwdtoWs .setPassword:first').focus();
                return false;
            }
            if (cpass == "") {
                $('#setPwdtoWs .setPassword:first').css('border-color', '');
                $('#setPwdtoWs .setPassword:eq(1)').css('border-color', 'red');
                $('#WsdisplayMsg').text("Please enter confirm password.");
                $('#setPwdtoWs .setPassword:eq(1)').focus();
            }
            return false;
        }
        if (cpass.length < 6 || cpass.length > 20) {
            $('#setPwdtoWs .setPassword:first').css('border-color', '');
            $('#setPwdtoWs .setPassword:eq(1)').css('border-color', 'red');
            $('#WsdisplayMsg').text("Password must be 6-20 characters in length.");
            $('#setPwdtoWs .setPassword:eq(1)').focus();
            return false;
        }
        if (pass != cpass) {
            $('#setPwdtoWs .setPassword:eq(1)').css('border-color', 'red');
            $('#setPwdtoWs .setPassword:first').css('border-color', '');
            $('#WsdisplayMsg').text("Password and Confirm password should  match.");
            $('#setPwdtoWs .setPassword:eq(1)').focus();
            return false;
        }else {
            $('#setPwdtoWs .setPassword').css('border-color', '');
            $('#WsdisplayMsg').text('');
            password = pass;
        }
    }
    if ($('#setPwdtoWs input[type="checkbox"]').prop('checked') == false) {
        password = "NOT_REQUIRED";
    }
    var arr1 = {
        "type": "WORKSPACE",
        "workspaceName": wsname,
        "password": password,
        "readEmails": readEmailsVal,
        "coOwnerEmails": coOwnerEmailsVal,
        "editEmails": editEmailsVal,
        "creationDate": null,
        "modifiedDate": null,
        "notes": notes
    };
    var workSpaceJson = JSON.stringify(arr1);
    var apiUrl = apicallurl + "/workspace/create?domainUrl=" + domainUrl + "/WssharedNew";
    $.ajax({
        type: 'PUT',
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        data: workSpaceJson,
        dataType: 'json',
        success: function (workspace) {
            //$.smallBox({title: "Workspace created successfully.", color: "#22b5d8", timeout: notifyTime, sound: false});
            showNotyNotification("notify","Workspace created successfully.");
            var wid = workspace.id;
            var wname = workspace.workspaceName;
            //var owner = workspace.user.lastName;
            if (workspace.password == "" || workspace.password == "NOT_REQUIRED") {
                $('#ThumbnailContent').append('<div class="file ' + workspace.type + '" name="Workspace"' +
                        ' style="cursor:pointer;"><i title="' + workspace.type + '" name="Workspace"' +
                        ' class="filethumbnail cf-workspace wsIcon" ></i><strong class="filename" id="' + wid + '" name="' + wname + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(wname,14) + '</strong><div class="filesize">No.Of Files </div><input type="checkbox" class="fileCheck" /><p href="#" id="' + wid + '"></p></div>');
                $('#leftNav').prepend('<li class="getFilesForWorkspace"><a href="#" id="' + wid + '"><i class="cf-workspace" style="display:inline-block;margin:0"></i><i class="" style="font-size:13px"></i><span>' + wname + '</strong></a></li>');
            }else {
                $('#ThumbnailContent').append('<div class="file ' + workspace.type + '" name="Workspace"' +
                        ' style="cursor:pointer;"><i title="' + workspace.type + '" name="Workspace"' +
                        ' class="filethumbnail cf-workspace wsIcon" ></i><strong class="filename" id="' + wid + '" name="' + wname + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(wname,14) + '</strong><div class="filesize">No.Of Files </div><input type="checkbox" class="fileCheck" /><p href="#" id="' + wid + '"></p><i  id="wsLock" class="workspaceLockTrue" style="cursor:pointer;"></i></div>');
                $('#leftNav').prepend('<li class="getFilesForWorkspace"><a href="#" id="' + wid + '"><i class="cf-workspace" style="display:inline-block;margin:0"></i><i class="cf-locked" style="font-size:13px"></i><span>' + wname + '</strong></a></li>');
            }
            $('#spinner1').addClass('divdisplay');
            $('#ThumbnailContent').find('.file').find('.filethumbnail ').each(function () {
                var Wsname = $(this).siblings("strong").text();
                wname = CFManageCloudAccountsAjaxCall.getMaxChars(wname,14);
                if (wname == Wsname) {
                   // $(this).click();
                   CFWlistview.goToWorkspace(wid,wname);
                    return false;
                }else {
                }
            });
            $('#CFEditWorkSpace').show();
            $('#NoWorkspaces').hide();
            setTimeout(function () {
                $('#NoFilesWorkspace').hide();
                if(sessionStorage.getItem('clouds') == "false"){
                    $('#NoCloudsWorkspace').show();
                    $('#CFUploadFiles').addClass('buttonDisable');
                    return false;
                }else if(sessionStorage.getItem('clouds')== "true"){
                    $('#NoCloudsWorkspace').hide();
                    $('#CFUploadFiles').removeClass('buttonDisable');
                }
                $('#NewWorkspace').show();
            }, 1500);
        },
        complete: function (xhr, statusText) {
            CFWthumbnail.init();
            if (xhr.status > 300) {
                //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
                showNotyNotification("error","Operation Failed");
            }
        }
    });
    selectEvent.init();
    $('#workSpaceFiles').modal('hide');
});

$('#WorkspaceUserNames').on('click','.removeTag1',function() {
    var emailid = $(this).parent().attr('id');
    workspacemailsUnames = $.grep(workspacemailsUnames, function (i) {
        return i != emailid;
    });
    var email = $('#advancedWorkspaceUsers').children('tr[id="' + emailid + '"]').attr('id');
    var type = $('#advancedWorkspaceUsers').children('tr[id="' + emailid + '"]').attr('type');
    var wId = [];
    if (PageName == "WorkSpace") {
        if (FromfileId.length != 0) {
            wId.push(FromfileId[0]);
        }
    }else {
        wId.push(WorkSpaceId);
    }
    var updateEmail = '';
    updateEmail += 'workspaceId=' + wId + '&';
    if (type == 'owner') {
        updateEmail += 'coOwnerEmails=' + email;
    }else if (type == 'edit') {
        updateEmail += 'editEmails=' + email;
    }else if (type == 'read') {
        updateEmail += 'readEmails=' + email;
    }
    if (wId.length == 0) {
        $('#advancedWorkspaceUsers').children('tr[id="' + emailid + '"]').remove();
        $(this).parent().remove();
    }else if (email != "undefined") {
        CFWlistview.deleteFileshare(updateEmail);
        $('#advancedWorkspaceUsers').children('tr[id="' + emailid + '"]').remove();
        $(this).parent().remove();
    }
});
$('#workspaceEmailId').keypress(function(e) {
    if (e.which == 13) {
        $('#addWorkspaceUser').trigger('click');
    }
});
$('table').on('change','#cownerASAS',function() {
    sendGAEvents("Workspace","Change Permission | Co-Owner");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Change Permission | Co-Owner"]);
    if ($(this).prop('checked') == true) {
        $(this).parent().parent().attr('type', 'owner');
        $(this).parent().prev().children('#editASAS').prop('checked', 'true');
        $(this).parent().prev().children('#editASAS').prop('disabled', 'true');
    }else {
        $(this).parent().parent().attr('type', 'edit');
        $(this).parent().prev().children('#editASAS').prop('checked', 'true');
        $(this).parent().prev().children('#editASAS').removeAttr('disabled');
    }
});
$('table').on('change','#editASAS',function() {
    if ($(this).prop('checked') == true) {
        sendGAEvents("Workspace","Change Permission | Edit");
        //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Change Permission | Edit"]);
        $(this).parent().parent().attr('type', 'edit');
    }else {
        $(this).parent().parent().attr('type', 'read');
    }
});
//Workspace File Selection
$('table thead').find('input').on('change',function(){
    FromfileId = [];
    FromcloudId = [];
    FromObjectName = [];
    Extention = [];
    FileType = [];
    FilePer = [];
    if($(this).is(':checked')){
        $('#workspaceFiles').find('input[type="checkbox"]').prop('checked', true);
        $('#workspaceFiles').find('input:checked').each(function(){
            FromfileId.push(decodeURIComponent($(this).closest('tr').children('td:eq(2)').attr('id')));
            FromcloudId.push($(this).closest('tr').children('td:eq(2)').attr('cloudid'));
            FromObjectName.push($(this).closest('tr').children('td:eq(2)').text());
            Extention.push($(this).closest('tr').attr('fexten'));
            FileType.push($(this).closest('tr').find('.LVFILEIcon').children('i').attr('class'));
            FilePer.push($(this).closest('tr').children('td:eq(2)').attr('fileper'));
        });
    }else{
        $('#workspaceFiles').find('input[type="checkbox"]').prop('checked', false);
    }
    sendGAEvents("Workspace","All File Select in / "+PageName);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"All File Select in / "+PageName]);
    var count = $('#workspaceFiles').find('input:checked').length;
    wIconsEnable(count);
});

$('#mainContent').on('change', 'tbody input[type="checkbox"]', function () {
    FromfileId = [];
    FromcloudId = [];
    FromObjectName = [];
    Extention = [];
    FileType = [];
    FilePer = [];
    $('#workspaceFiles').find('input:checked').each(function(){
        FromfileId.push(decodeURIComponent($(this).closest('tr').children('td:eq(2)').attr('id')));
        FromcloudId.push($(this).closest('tr').children('td:eq(2)').attr('cloudid'));
        FromObjectName.push($(this).closest('tr').children('td:eq(2)').text());
        Extention.push($(this).closest('tr').attr('fexten'));
        FileType.push($(this).closest('tr').find('.LVFILEIcon').children('i').attr('class'));
        FilePer.push($(this).closest('tr').children('td:eq(2)').attr('fileper'));
    });
    sendGAEvents("Workspace","File Select in / "+PageName);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"File Select in / "+PageName]);
    var count = $('#workspaceFiles').find('input:checked').length;
    wIconsEnable(count);
});
function wIconsEnable(count){
    var iconObject = {
        "open":false,
        "download":false,
        "rename":false,
        "delete":false
    };
    if(count < 1) {
        wHideIcons(iconObject);
        disableActionPanel(actionPanel);
    }else {
        var disableIcons = {};
        if($.inArray('LVFOLDER',FileType)>-1){
            disableIcons.download = true;
        }
        if(count > 1){
            disableIcons.rename = true;
        }
        var iconsp = checkPermission(iconObject);
        var finalIocns = $.extend(iconObject,iconsp,disableIcons);
        wHideIcons(finalIocns);
        $('.filecontrols').removeClass('buttonDisable');
    }
}
function checkPermission(object){
    //get primaryEmail for current user
    var useremail = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
    //End
    var createControl = false;
    //Check permissions of the current user
    if (wsDetails.readEmails != null && $.inArray(useremail,wsDetails.readEmails) > -1) {
        object = {
            "rename":true,
            "delete":true
        };
        createControl = true;
    }
    else if(wsDetails.editEmails != null && $.inArray(useremail,wsDetails.editEmails) > -1){
        object = {
            "delete":true
        };
    }
    //End
    //Desable rename for innerfolder in workspace
    // var sid = $('#workspaceFiles').find('.cf-back').attr('sid');
    // if(sid == undefined){
    // }else {
    //     object.rename = true;
    // }
    //End
    hideCreateControls(createControl);
    return object;
}
function hideCreateControls(check){
    if(check) {
        $('.fileCreatecontrols').addClass('buttonDisable');
    }else{
        $('.fileCreatecontrols').removeClass('buttonDisable');
    }
}
function wHideIcons(object){
    if(object.open){
        $('#openFiles').css('pointer-events', 'none');
        $('#openFiles > div').css('opacity', '0.2');
    }else{
        $('#openFiles').css('pointer-events', 'auto');
        $('#openFiles > div').css('opacity', '1');
    }
    if(object.download){
        $('#CFDownload').css('pointer-events', 'none');
        $('#CFDownload > div').css('opacity', '0.2');
    }else{
        $('#CFDownload').css('pointer-events', 'auto');
        $('#CFDownload > div').css('opacity', '1');
    }
    if(object.rename){
        $('#CFHRename').css('pointer-events', 'none');
        $('#CFHRename > div').css('opacity', '0.2');
    }else{
        $('#CFHRename').css('pointer-events', 'auto');
        $('#CFHRename > div').css('opacity', '1');
    }
    if(object.delete){
        $('#CFHDelete').css('pointer-events', 'none');
        $('#CFHDelete > div').css('opacity', '0.2');
    }else{
        $('#CFHDelete').css('pointer-events', 'auto');
        $('#CFHDelete > div').css('opacity', '1');
    }
}
var userInfo;
$('#fileComments').on('click','#editComment',function() {
    $('#addingComments').addClass("divdisplay");
    $('#cancelComment').trigger('click');
    var catid = $(this).attr("cid");
    sendGAEvents("Workspace","Edit Comment : "+catid);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Edit Comment : "+catid]);
    var commentedText = $(this).parents('div').children('.user-content').text();
    userInfo = $(this).parents('div').children('.user-info').text();
    /*$('body').on('mouseup', function (e) {
        var container = $('#page-header').find('#fileComments .article-post');
        if (!container.is(e.target)
            && container.has(e.target).length === 0) {
            $('#cancelComment').trigger('click');
            $('#commentText').css("border-color", "");
            $('body').off('mouseup');
        }
    });*/
    $(this).parents("li").children('div').html('<textarea rows="2" cols="40" style="width: 77%;margin-top: 6px;margin-left:5px;" class="form-control" id="editText" autofocus data-ref="'+commentedText+'">' + commentedText + '</textarea><button class="button  mini blue" cid=' + catid + ' style="margin-top: -31px;margin-left: 10px;" id="saveComment"><i class="icon-save" style="padding-right: 15px;"></i> Save</button><button class="button  mini" cid=' + catid + ' title=' + userInfo + ' style="margin-left: -53px;margin-top: 21px;" id="cancelComment"><i class="icon-remove" ></i> Cancel</button>');
    $('#editText').focus();
});
$('#fileComments').on('click','#deleteComment',function() {
    var catid = $(this).attr("cid");
    sendGAEvents("Workspace","Delete Comment : "+catid);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Delete Comment : "+catid]);
    CFHPlistview.removeComments(catid);
    $(this).parents('li').remove();
});
$('#addCommenttoFile').click(function() {
    var thisData = $('#commentText').val();
    sendGAEvents("Workspace","Add Comment : "+commentId);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Add Comment : "+commentId]);
    if (thisData == "") {
        $('#commentText').css("border-color", "red");
        $('#commentText').focus();
        return false;
    }else {
        $('#commentText').css("border-color", "");
    }
    CFHPlistview.addCommenttoFile(commentId, thisData);
    $('#commentText').val('');
});
$('#fileComments').on('click','#cancelComment',function() {
    $('#addingComments').removeClass("divdisplay");
    $('#commentText').css("border-color", "");
    $('#saveComment').hide();
    $('#cancelComment').hide();
    var catid = $(this).attr("cid");
    sendGAEvents("Workspace","Comments Cancel : "+catid);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Comments Cancel : "+catid]);
    var comments = $(this).siblings('textarea').attr('data-ref');
    $(this).parents("li").html('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> ' + userInfo + '</div> <div class="user-content" style="font-size:20px;">' + comments + '</div> <div class="btn-group"><button class="button  mini blue" cid=' + catid + ' id="editComment"><i class="icon-pencil"></i> Edit</button><button class="button  mini" cid=' + catid + ' style="margin-left: 5px;" id="deleteComment"><i class="icon-remove"></i> Delete</button></div></div>');
});
$('#fileComments').on('click','#saveComment',function() {
    $('#commentText').css("border-color", "");
    var catid = $(this).attr("cid");
    sendGAEvents("Workspace","Comments Save : "+catid);
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Comments Save : "+catid]);
    var comments = $('#editText').val();
    if (comments == "") {
        $('#editText').css("border-color", "red");
        $('#editText').focus();
        return false;
    }else {
        $('#editText').css("border-color", "");
    }
    $('#saveComment').hide();
    $('#cancelComment').hide();
    $(this).closest('.article-post').children('textarea').hide();
    CFHPlistview.updateComments(comments, catid);
    $('#addingComments').removeClass("divdisplay");
});
var commentId;
$('#workspaceFiles').on('click','#getComments',function() {
    if (!$(this).parent().hasClass("commentsVisible")) {
        var UserObj = JSON.parse(localStorage.getItem('CFUser'));
        var uemail = UserObj.primaryEmail;
        var id = $(this).parent().siblings('.sorting_1').attr("id");
        //commentId = "";
        commentId = id;
        sendGAEvents("Workspace","Comments : "+commentId);
       // _gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),"Comments : "+commentId]);
        var comments = CFHPlistview.getFileComments(id);
        $('#fileComments').html('');
        $('#commentText').val('');
        $('#addingComments').removeClass("divdisplay");
        $('.commentContent').show();
        // for (var i = 0; i < comments.length; i++) {
        //     if (comments[i].user.primaryEmail == uemail) {
        //         $('#fileComments').append('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Posted by <b>' + comments[i].user.lastName + '</b>, ' + jQuery.timeago(comments[i].commentDate) + ' </div> <div class="user-content" style="font-size:20px;">' + comments[i].comment + '</div> <div class="btn-group"><button class="button  mini blue" cid=' + comments[i].id + ' id="editComment"><i class="icon-pencil"></i> Edit</button><button class="button  mini" style="margin-left: 5px;" cid=' + comments[i].id + ' id="deleteComment"><i class="icon-remove"></i> Delete</button></div></div></li>');
        //     }else {
        //         $('#fileComments').append('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Posted by <b>' + comments[i].user.lastName + '</b>, ' + jQuery.timeago(comments[i].commentDate) + ' </div> <div class="user-content" style="font-size:20px;">' + comments[i].comment + '</div></div></li>');
        //     }
        // }
        // var filename = $(this).parent().siblings('.sorting_1').text();
        // $('#fileName').text(filename);
        // $('#commentFileName').removeClass("divdisplay");
        // $('#commentHeader').removeClass("divdisplay");
        // $('#addingComments textarea').css('border-color', '');
        // $('#commentHeader').next().slideDown(500);
        // $('.commentContent').css("overflow-y", "auto");

        for (var i = 0; i < comments.length; i++) {
            var _email = comments[i].user == null ? 'Not-Available' : comments[i].user.primaryEmail;
            var lName = comments[i].user == null ? 'Not-Available' : comments[i].user.lastName;
            if (comments[i].user!= null && _email == uemail) {
                $('#fileComments').append('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Posted by <b>' + lName + '</b>, ' + jQuery.timeago(comments[i].commentDate) + ' </div> <div class="user-content" style="font-size:15px;">' + comments[i].comment + '</div> <div class="btn-group"><button class="button  mini blue" cid=' + comments[i].id + ' id="editComment"><i class="icon-pencil"></i> Edit</button><button class="button  mini" style="margin-left: 5px;" cid=' + comments[i].id + ' id="deleteComment"><i class="icon-remove"></i> Delete</button></div></div></li>');
            }else {
                $('#fileComments').append('<li class="separator"><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Posted by <b>' + lName + '</b>, ' + jQuery.timeago(comments[i].commentDate) + ' </div> <div class="user-content" style="font-size:15px;">' + comments[i].comment + '</div></div></li>');
            }
        }
        var filename = $(this).parent().siblings('.sorting_1').text();
        $('#fileName').text(filename);
        $('#commentFileName').removeClass("divdisplay");
        $('#commentHeader').removeClass("divdisplay");
        $('#addingComments').closest('.commentContent').removeClass('divdisplay');
        $('#addingComments textarea').css('border-color', '');
        $('#commentHeader').next().slideDown(500);
        $('.commentContent').css("overflow-y", "auto");

        for (var i = 0; i < $('#workspaceFiles').children().length; i++) {
            $('#workspaceFiles').children('tr:eq(' + i + ')').children().removeClass('commentsVisible');
        }
        $(this).parent().addClass('commentsVisible');
    }else {
        $('#fileComments').html('');
        $('#commentText').val('');
        $('.commentContent').hide();
        $('#addingComments').addClass("divdisplay");
        $('#commentHeader').addClass("divdisplay");
        $(this).parent().removeClass("commentsVisible");
    }
});
$('#closeMetaCont').click(function() {
    for (var i = 0; i < $('#workspaceFiles').children().length; i++) {
        $('#workspaceFiles').children('tr:eq(' + i + ')').children().removeClass('commentsVisible');
    }
    $('#commentText').val('');
    $('#fileComments').html('');
    $('.commentContent').hide();
    $('#addingComments').addClass("divdisplay");
    $('#commentHeader').addClass("divdisplay");
});
$('#innerWorkspaceRight .tab-header:eq(0)').on('click',function() {
    $(this).next().slideToggle(500);
    $(this).next().css('overflow-y', 'auto');
});
$('#CFCreateWorkSpace').on('click',function(){
    sendGAEvents("Workspace",PageName+" / Create Workspace");
    //_gaq.push(['_trackEvent',"Workspace", localStorage.getItem('UserId'),PageName+" / Create Workspace"]);
});