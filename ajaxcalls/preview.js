var isGOOGLEDOC = false;

$('#LVContent').on('click','.LVfileName[name="FILE"]', function() {
    sendGAEvents("Preview - List View");
    //_gaq.push(['_trackEvent', "Preview - List View", localStorage.getItem('UserId'), PageName]);
    FilePreview.clearModal();
    var rename = $(this).find('p').children('input').length;
    if(rename > 0){
        return false;
    }
    var fileTypes = $('#LVContent').find('.panel-data[data-type="FILE"]');
    var fileIds = [];
    var count = fileTypes.length;
    fileTypes.each(function(){
        fileIds.push($(this).find('.LVfileName').attr('id'));
    });
    var index = fileIds.indexOf($(this).attr('id'));
    FilePreview.showFileCount(count,index);
    var fid = $(this).attr('id');
    var cid = $(this).closest('.panel-data').find('.LVdrive').attr('id');
    var objectName = $(this).children('p').attr('name');
    $('#filePreview').find('#previewFileName').text(objectName);
    FilePreview.preview(fid,cid,'ListView');
});

$('#ThumbnailContent').on('click','.filethumbnail[name="FILE"]',function(){
    sendGAEvents("Preview - Grid View");
    //_gaq.push(['_trackEvent', "Preview - Grid View", localStorage.getItem('UserId'), PageName]);
    FilePreview.clearModal();
    var fileTypes = $('#ThumbnailContent').find('.file[data-type="FILE"]');
    var fileIds = [];
    var count = fileTypes.length;
    fileTypes.each(function(){
        fileIds.push($(this).find('.filename').attr('id'));
    });
    var index = fileIds.indexOf($(this).next().attr('id'));
    FilePreview.showFileCount(count,index);
    var fid = $(this).next().attr('id');
    var cid = $(this).closest('.file').attr('id');
    var objectName = $(this).attr('title');
    $('#filePreview').find('#previewFileName').text(objectName);
    FilePreview.preview(fid,cid,'GridView');
});

$('#workspaceFiles').on('click','.sorting_1',function(){
    sendGAEvents("Preview - Workspace");
    //_gaq.push(['_trackEvent', "Preview - Workspace", localStorage.getItem('UserId'), PageName]);
    FilePreview.clearModal();
    var newName = $('#workspaceFiles').find('input[type="text"]').val();
    if(newName !== undefined){
        return false;
    }
    
    var rename = $(this).children('input').length;
    if(rename > 0){
        return false;
    }
    var _wsFiles = $("#workspaceFiles");
    var fileTypes = _wsFiles.find("tr[data-type='File']");
    var fileIds = [];
    var count = fileTypes.length;
    fileTypes.each(function(){
        var id = decodeURIComponent($(this).find('.sorting_1').attr('id'));
        fileIds.push(id);
    });
    var details = {};
    details.id = decodeURIComponent($(this).attr('id'));
    details.cid = $(this).attr('cloudid');
    details.ext = $(this).closest('tr').attr('fexten');
    details.size = $(this).attr('data-type');
    var index = fileIds.indexOf(details.id);
    FilePreview.showFileCount(count,index);
    var cfback = _wsFiles.find(".cf-back").length;
    if(cfback > 0){
        var sid = _wsFiles.find('.cf-back').attr('sid');
        FilePreview.workspacePreview(details,sid);
    }else{
        FilePreview.workspacePreview(details,"NotRequired");
    }
    var objectName = decodeURIComponent($(this).attr('name'));
    $('#filePreview').find('#previewFileName').text(objectName);
});

var FilePreview = {
    preview : function(id,cid,check){
        var details = "";
        var state = $('#secondary').find('.active').children('a').attr('id');
        if(state == "CFSharedWithMe"){ //Shared By Me Preview
            details = CFHPlistview.getFileShare(id);
            if(details.sharePassword == "NOT_REQUIRED"){
                FilePreview.shareWithMePreview(details);
            }else{
                if(PageName == "InnerFolders"){
                    details = CFHPlistview.getFileDetails(id,cid);
                    details.CFShareId = "require";
                    var shareDetails  = CFHPlistview.getFileShare(sharedFolderId);
                    FilePreview.sharedInnerFiles(details,shareDetails);
                }else{
                    var mpreviewPwdModal = $("#myPriviewPasswordModel");
                    mpreviewPwdModal.find(".CFPriviewPwdok").attr("pwd",details.sharePassword);
                    mpreviewPwdModal.find(".CFPriviewPwdok").attr("fid",id);
                    mpreviewPwdModal.find("input").removeAttr("css").val("");
                    mpreviewPwdModal.find("#Msg").find(".statusMesg").text("");
                    mpreviewPwdModal.modal("show");
                    setTimeout(function(){
                        mpreviewPwdModal.find("input").focus();
                    },300);
                }
            }
        }
        else{
            details = CFHPlistview.getFileDetails(id);
            var checkStatus =  details == null ? "ShowError" : FilePreview.checkFile(details);
            if(checkStatus == "ShowError"){
                var url = apicallurl + '/filefolder/content?fileId=' + encodeURIComponent(id) + '&' +
                    'token=' + CFManageCloudAccountsAjaxCall.getAuthDetails();
                FilePreview.showErrorOnPreview(url,"ext");
            }else{
                FilePreview.handleNormalPreview(details);
            }
        }
    },
    sharedInnerFiles:function(file,shareDetials){
        var shareUrl = shareDetials.shareUrl;
        shareUrl = shareUrl.split('?')[1].split('&');
        var params = {};
        for(var i=0;i<shareUrl.length;i++) {
            var temp = shareUrl[i].split('=');
            if(temp[0] == "fileId"){
                params.fileId = temp[1];
            }else if(temp[0] == "accessToken"){
                params.token = temp[1];
            }
        }
        var url = apicallurl + '/fileshare/content/revision/latest?fileId=' + encodeURIComponent(file.id) + '&' +
            'accessToken='+params.token+
            '&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails()+"" +
            "&sharedFolderId="+encodeURIComponent(sharedFolderId);
        if(shareDetials.sharePassword != "NOT_REQUIRED"){
            url +="&sharePassword="+encodeURIComponent(shareDetials.sharePassword);
        }
        var checkStatus = FilePreview.checkFile(file);
        if(checkStatus == "ShowError"){
            FilePreview.showErrorOnPreview(url,"ext");
            return false;
        }
        var fileStatus = FilePreview.checkFileContent(url);
        var imgFiles = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        var txtFile = ['txt', 'bsh', 'c', 'cc', 'cpp', 'cs', 'csh', 'css', 'cyc', 'cv', 'htm', 'html', 'java', 'js', 'm', 'mxml', 'perl', 'php', 'pl', 'pm', 'py', 'rb', 'sh', 'xhtml', 'xml', 'xsl', 'sql', 'vb'];
        var pdfFile = ['pdf']; //pdf
        var audioFile = ['mp3', 'wav', 'ogg']; // audio
        var videoFile = ['mp4']; //video
        var docFiles = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];//2MB
        if(fileStatus == "FileFound"){
            var fileExt = file.objectExtn;
            if($.inArray(fileExt,imgFiles)>-1){
                FilePreview.showImgFile(url);
            }else if($.inArray(fileExt,txtFile)>-1){
                FilePreview.showTextFile(url,fileExt);
            }else if($.inArray(fileExt,pdfFile)>-1){
                FilePreview.showPdfFile(url);
            }else if($.inArray(fileExt,audioFile)>-1){
                FilePreview.showAudioFile(url);
            }else if($.inArray(fileExt,videoFile)>-1){
                FilePreview.showVideoFile(url);
            }else if($.inArray(fileExt,docFiles) > -1){
                var apiUrl = '';
                if(isGOOGLEDOC){
                    apiUrl = apicallurl + '/fileshare/content/revision/latest?' +
                    'fileId=' + encodeURIComponent(file.id) +
                    '&accessToken=' + params.token +
                    '&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() +
                    '&sharedFolderId='+encodeURIComponent(sharedFolderId);
                }
                else{
                    apiUrl = apicallurl + '/preview/file?fileId=' + encodeURIComponent(file.id)
                        +'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails()
                        +'&accessToken='+params.token
                        +'&isShared=true'
                        +"&sharedFolderId="+encodeURIComponent(sharedFolderId);
                }
                if(shareDetials.sharePassword != "NOT_REQUIRED"){
                    apiUrl += '&sharePassword=' + shareDetials.sharePassword;
                }
                FilePreview.showDocFiles(apiUrl);
            }else{
                FilePreview.showErrorOnPreview(url,'ext');
            }
        }else{
            FilePreview.previewFileNotFound('share');
        }
    },
    shareWithMePreview : function(file){
        var checkStatus = FilePreview.checkFile(file.file);
        if(checkStatus == "ShowError"){
            var test = file.shareUrl;
            test = test.split('?')[1].split('&');
            var params = {};
            var password = '';
            for(var i=0;i<test.length; i++){
                var test1 = test[i].split('=');
                if(test1[0] == "fileId"){
                    params.fileId = test1[1];
                }else if(test1[0] == "accessToken"){
                    params.accessToken = test1[1];
                }
            }
            if(file.sharePassword == "NOT_REQUIRED"){
                password='';
            }else{
                password = file.sharePassword;
            }
            var url =  apicallurl + '/fileshare/content/revision/latest?' +
                'fileId=' + file.file.id + '&' +
                'accessToken=' + params.accessToken + '&' +
                'token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '&' +
                'sharePassword='+password;
            FilePreview.showErrorOnPreview(url,'ext');
        }else {
            FilePreview.handleSharedPreview(file);
        }
    },
    workspacePreview:function(details,sid){
        if(details.id == undefined || details.id == 'undefined'){
            return;
        }
        var url = apicallurl+"/filefolder/content?fileId="+details.id+"&" +
        "token="+CFManageCloudAccountsAjaxCall.getAuthDetails()+"&workspaceId="+WorkSpaceId;
        if(sid != "NotRequired"){
            url += "&sharedFolderId="+sid;
            details.sid = sid;
        }
        var content = FilePreview.checkFileContent(url);
        if(content == "FileFound"){
            var fileExt = details.ext;
            FilePreview.handleAllPreview(fileExt , url , "workspace",details);
        }else{
            FilePreview.previewFileNotFound('workspace');
        }
    },
    checkFile : function(file){
        var checkStatus = "ShowError";
        if(file == undefined || file == null){
            return checkStatus;
        }
        var docFiles = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];//2MB
        if(file.objectSize > 10485760){
            checkStatus = "ShowError";
        }else if($.inArray(file.objectExtn , docFiles)>-1){
            if(file.objectSize > 2097152){
                checkStatus = "ShowError";
            }else{
                checkStatus = "HandlePreview";
            }
        }else{
            checkStatus = "HandlePreview";
        }
        return checkStatus;
    },
    showErrorOnPreview : function(url,check) {
        $('#filePreview').find('#PriviewDownload').attr('data-href',encodeURIComponent(url));
        if(check == "ext"){
            FilePreview.showPreviewDownload(url);
        }
    },
    showPreviewDownload:function(url){
        var text = "We are not able to provide preview for this file.Please download this file using the button below.";
        var prevFileData = '<h4 style="color:#fff; width:60%; text-align:center; line-height:35px;margin: 0 auto;font-size:17px;">' +
        text+'</h4>' +
        '<a class="icon-download-alt" ' +
            'style="color: #22b5d8;font-size: 80px;height: 80px;width: 80px;display: block;margin: 0 auto;" ' +
            'data-href="'+ encodeURIComponent(url)+'"></a>';
        FilePreview.appendPreviewData(prevFileData);
    },
    handleNormalPreview : function(file){
        var url = apicallurl + '/filefolder/content?fileId=' + encodeURIComponent(file.id) + '&' +
        'token=' + CFManageCloudAccountsAjaxCall.getAuthDetails();
        var fileStatus = FilePreview.checkFileContent(url);
        $('#filePreview').find('#PriviewDownload').attr('data-href',encodeURIComponent(url));
        if(fileStatus == "FileFound"){
            var fileExt = file.objectExtn;
            FilePreview.handleAllPreview(fileExt , url , "normal",file);
        }else{
            FilePreview.previewFileNotFound('normal');
        }
    },
    previewFileNotFound : function(check){
        FilePreview.clearModal();
        if(check == "share"){
            //$.smallBox({title:"File might have been removed from the cloud.",color:"#FF9900",timeout:notifyTime});
            showNotyNotification("warn","File might have been removed from the cloud.");
        }else if(check == "normal"){
            //$.smallBox({title:"File might have been removed from the cloud.",color:"#FF9900",timeout:notifyTime});
            showNotyNotification("warn","File might have been removed from the cloud.");
        }else if(check == "workspace"){
            //$.smallBox({title:"Cloud File might have deleted or moved, Please remove the file and add it in workspace.",color:"#FF9900",timeout:notifyTime});
            showNotyNotification("warn","Cloud File might have deleted or moved, Please remove the file and add it in workspace.");
        }
    },
    handleSharedPreview : function(file){
        var test = file.shareUrl;
        test = test.split('?')[1].split('&');
        var params = {};
        var password = '';
        var fileExt = file.file.objectExtn;
        for(var i=0;i<test.length; i++){
            var test1 = test[i].split('=');
            if(test1[0] == "fileId"){
                params.fileId = test1[1];
            }else if(test1[0] == "accessToken"){
                params.accessToken = test1[1];
            }
        }
        if(file.sharePassword == "NOT_REQUIRED"){
            password='';
        }else{
            password = file.sharePassword;
        }
        var url =  apicallurl + '/fileshare/content/revision/latest?' +
        'fileId=' + file.file.id + '&' +
        'accessToken=' + params.accessToken + '&' +
        'token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '&' +
        'sharePassword='+password;
        var docFiles = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];//2MB
        if($.inArray(fileExt,docFiles)>-1){
            url = apicallurl+"/preview/file?fileId="+file.file.id+"&accessToken="+params.accessToken+
                "&token="+CFManageCloudAccountsAjaxCall.getAuthDetails()+"&sharePassword="+password+"&isShared=true"
        }
        if(file.CFShareId == "Required"){
            url +="&sharedFolderId="+sharedFolderId;
        }
        FilePreview.handleAllPreview(fileExt ,url,"shared",file);
    },
    handleAllPreview:function(fileExt,url,check,object,shared){
        var imgFiles = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        var txtFile = ['txt', 'bsh', 'c', 'cc', 'cpp', 'cs', 'csh', 'css', 'cyc', 'cv', 'htm', 'html', 'java', 'js', 'm', 'mxml', 'perl', 'php', 'pl', 'pm', 'py', 'rb', 'sh', 'xhtml', 'xml', 'xsl', 'sql', 'vb'];
        var pdfFile = ['pdf']; //pdf
        var audioFile = ['mp3', 'wav', 'ogg']; // audio
        var videoFile = ['mp4']; //video
        var docFiles = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];//2MB
        $('#filePreview').find('#PriviewDownload').attr('data-href',encodeURIComponent(url));
        if($.inArray(fileExt,imgFiles)>-1){
            FilePreview.showImgFile(url);
        }
        else if($.inArray(fileExt,txtFile)>-1){
            FilePreview.showTextFile(url,fileExt);
        }
        else if($.inArray(fileExt,pdfFile)>-1){
            FilePreview.showPdfFile(url);
        }
        else if($.inArray(fileExt,audioFile)>-1){
            FilePreview.showAudioFile(url);
        }
        else if($.inArray(fileExt,videoFile)>-1){
            FilePreview.showVideoFile(url);
        }
        else if($.inArray(fileExt,docFiles)>-1){
            var apiUrl = '';
            if(check == "workspace"){
                if(isGOOGLEDOC){
                    apiUrl = apicallurl + '/fileshare/content/revision/latest?fileId=' + encodeURIComponent(object.id)
                        +'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails()+"&workspaceId="+WorkSpaceId;
                }else{
                    apiUrl = apicallurl + '/preview/file?fileId=' + encodeURIComponent(object.id)
                        +'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails()+"&workspaceId="+WorkSpaceId;
                }
                if(object.sid != "NotRequired"){
                    apiUrl += "&sharedFolderId="+object.sid;
                }
            }else if(check == "shared"){
                apiUrl = url;
            }else{
                if(isGOOGLEDOC){
                    apiUrl = apicallurl + '/filefolder/content?fileId=' + encodeURIComponent(object.id) +
                        '&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails();
                }else{
                    apiUrl = apicallurl + '/preview/file?fileId=' + encodeURIComponent(object.id)
                        +'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails();
                }
            }
            FilePreview.showDocFiles(apiUrl);
        }else{
            FilePreview.showErrorOnPreview(url,"ext");
        }
    },
    checkFileContent : function(url){
        var status= '';
        $.ajax({
            url : url+'&isDownloading=false',
            type : "GET",
            async: false,
            success : function(userStatus) {
                status = "FileFound"
            },
            error: function() {
                status = "FileNotFound";
            }
        });
        return status;
    },
    showImgFile : function(url){
        var prevFileData = '<img src="' + url + '" id="image" style="cursor:pointer;"/>';/*width:400px;height:400px*/
        $("#filePreview").find(".modal-body").addClass("text-align-center");
        FilePreview.appendPreviewData(prevFileData);
    },
    showTextFile:function(url,ext){
        var documentViewer = $('#priviewBody').documentViewer();
        documentViewer.load(url, {
            extension: ext,
            height: 550,
            enableTextAndCode: true
        });
        $('#filePreview').modal('show');
    },
    showPdfFile : function(url) {
        var docHeight = $(document).height() - 75;
        var prevFileData = '<iframe src = "../javascripts/PdfJs/web/viewer.html?' +
            'file=' + encodeURIComponent(url) + '" width="100%" ' +
            'height="' + docHeight + '" allowfullscreen webkitallowfullscreen>' +
            '</iframe>';
        FilePreview.appendPreviewData(prevFileData);
    },
    showAudioFile : function(url){
        var prevFileData = '<audio style="" controls >' +
            '<source src="' + url + '" type="audio/mpeg">' +
            '<embed height="50" width="100" src="' + url + '">' +
            'Your browser does not support this audio format.' +
            '</audio>';
        FilePreview.appendPreviewData(prevFileData);
    },
    showVideoFile: function(url){
        var prevFileData = '<video width="320" height="240" autobuffer controls autoplay>' +
            '<source src="' + url + '" id="imgPreview" type="video/mp4">' +
            '</video>';
        FilePreview.appendPreviewData(prevFileData);
    },
    showDocFiles:function(url){
        var docHeight = $(document).height() - 110;
        var prevFileData = '';
        if(isGOOGLEDOC){
            url += "&isDownloading=true";
            var _b = decodeURIComponent(url);
            var _a = "https://docs.google.com/viewer?url=";
            _a +=encodeURIComponent(_b)+"&embedded=true";
            prevFileData = '<iframe allowfullscreen webkitallowfullscreen src ="'+_a+'" width="100%" height="'+docHeight+'"></iframe>';
        }else{
            prevFileData = '<iframe src = "../javascripts/PdfJs/web/viewer.html?file=' + encodeURIComponent(url) +
                '" width="100%" height="' + docHeight + '" allowfullscreen webkitallowfullscreen></iframe>';
        }
        FilePreview.appendPreviewData(prevFileData);
    },
    clearModal:function(){
        $('#filePreview').find('#PriviewShare').hide();
        $('#filePreview').find('#rotateScreen').hide();
        $('#filePreview .modal-body').html('');
        $('#filePreview .modal-body').removeClass('text-align-center');
        $('#myPriviewPasswordModel').find('input').val('');
        $('#myPriviewPasswordModel').find('input').removeAttr('css');
        $('#myPriviewPasswordModel').find('.statusMesg').text('');
        $('#filePreview').find('#previewFileName').text('');
    },
    showFileCount:function(count,index){
        index = index + 1;
        var file = '<span>'+index+'</span>';
        var files = '<span>'+count+'</span>';
        var title =   file+ '<span> of </span>' + files + '<span> files </span>';
        var filePreview = $("#filePreview");
        if(index == 1){
            filePreview.find("#PreviousFile").addClass("buttonDisable");
            filePreview.find("#NextFile").removeClass("buttonDisable");
        }else if(index == count){
            filePreview.find("#PreviousFile").removeClass("buttonDisable");
            filePreview.find("#NextFile").addClass("buttonDisable");
        }else{
            filePreview.find("#NextFile").removeClass("buttonDisable");
            filePreview.find("#PreviousFile").removeClass("buttonDisable");
        }
        $("#noOfFiles").html(title);
    },
    appendPreviewData : function(data){
        $("#filePreview").find(".modal-body").html(data);
        $('#myPriviewPasswordModel').hide();
        $('#filePreview').modal('show');
    }
};

$('#myPriviewPasswordModel').on('click','.CFPriviewPwdok',function(){
    var pwd = '';
    if($(this).attr("pwd") != undefined){
        pwd = $(this).attr("pwd").toString();
    }
    var mypreviewPwdModal = $("#myPriviewPasswordModel");
    var value = mypreviewPwdModal.find("input").val().toString();
    var fid = $(this).attr("fid");
    if(pwd != value){
        mypreviewPwdModal.find(".statusMesg").text('Password does not match.');
    }else{
        mypreviewPwdModal.modal("hide");
        var details = CFHPlistview.getFileShare(fid);
        var checkStatus = FilePreview.checkFile(details);
        if(checkStatus == "ShowError"){
            // TODO Share With Me Extension
        }else{
            FilePreview.handleSharedPreview(details);
        }
    }
});

$("#myPriviewPasswordModel").on("keydown",function(e){
    if(e.which == 13){
        sendGAEvents("Preview - KeyBoard Click - OK Preview Password");
        //_gaq.push(['_trackEvent', "Preview - KeyBoard Click - OK Preview Password", localStorage.getItem('UserId'), PageName]);
        $("#myPriviewPasswordModel").find(".CFPriviewPwdok").trigger("click");
    }
    if(e.which == 27){
        sendGAEvents("Preview - KeyBoard Click - Close Preview Password");
        //_gaq.push(['_trackEvent', "Preview - KeyBoard Click - Close Preview Password", localStorage.getItem('UserId'), PageName]);
        $("#myPriviewPasswordModel").modal("hide");
    }
});

$(document).on('keyup',function(ev){
    if($("div:last-child").hasClass("modal-backdrop") && $('#filePreview').hasClass('in')) {
        if (ev.keyCode == 27) {
            sendGAEvents("Preview - KeyBoard Click - Close");
            //_gaq.push(['_trackEvent', "Preview - KeyBoard Click - Close", localStorage.getItem('UserId'), PageName]);
            $(".close").trigger("click");
        }else if (ev.keyCode == 37) {
            sendGAEvents("Preview - KeyBoard Click - Previous");
            //_gaq.push(['_trackEvent', "Preview - KeyBoard Click - Previous", localStorage.getItem('UserId'), PageName]);
            $("#PreviousFile").trigger("click");
        }else if (ev.keyCode == 39) {
            sendGAEvents("Preview - KeyBoard Click - Next");
            //_gaq.push(['_trackEvent', "Preview - KeyBoard Click - Next", localStorage.getItem('UserId'), PageName]);
            $("#NextFile").trigger("click");
        }
    }
});

$("#filePreview").on("click",".close",function(){
    FilePreview.clearModal();
    $('#myPriviewPasswordModel').modal('hide');
    $(document).find(".modal-backdrop").remove();
});

$("#filePreview").on("click","#NextFile",function(){
    sendGAEvents("Preview - Next File");
    //_gaq.push(['_trackEvent', "Preview - Next File", localStorage.getItem('UserId'), PageName]);
    var file = parseInt($("#noOfFiles").children("span:eq(0)").text());
    //$(document).find(".modal-backdrop").remove();
    //var files = parseInt($("#noOfFiles").children("span:eq(2)").text());
    var page = window.location.href;
    var state = sessionStorage.getItem('viewTrack');
    if(/fileManager/i.test(page)){
        if(state = 'GView'){
            $("#ThumbnailContent").find('.file[data-type="FILE"]:eq('+file+')').find('.filethumbnail[name="FILE"]').trigger('click');
        }else{
            $('#LVContent').find('.LVfileName[name="FILE"]:eq('+file+')').trigger('click');
        }
    }else if(/workspace/i.test(page)){
        $('#workspaceFiles').find('tr[data-type="File"]:eq('+file+')').find('.sorting_1').trigger('click');
    }
});

$("#filePreview").on("click","#PreviousFile",function(){
    sendGAEvents("Preview - Previous File");
    //_gaq.push(['_trackEvent', "Preview - Previous File", localStorage.getItem('UserId'), PageName]);
    var file = parseInt($("#noOfFiles").children("span:eq(0)").text());
    //$(document).find(".modal-backdrop").remove();
    //var files = parseInt($("#noOfFiles").children("span:eq(2)").text());
    file = file - 2;
    var page = window.location.href;
    var state = sessionStorage.getItem('viewTrack');
    if(/fileManager/i.test(page)){
        if(state = 'GView'){
            $("#ThumbnailContent").find('.file[data-type="FILE"]:eq('+file+')').find('.filethumbnail[name="FILE"]').trigger('click');
        }else{
            $("#LVContent").find('.LVfileName[name="FILE"]:eq('+file+')').trigger('click');
        }
    }else if(/workspace/i.test(page)){
        $("#workspaceFiles").find('tr[data-type="File"]:eq('+file+')').find('.sorting_1').trigger('click');
    }
});

var downCount = 0;
$("#filePreview").on("click","a[data-href]",function(){
    sendGAEvents("Preview - Download");
    //_gaq.push(['_trackEvent', "Preview - Download", localStorage.getItem('UserId'), PageName]);
    var url = decodeURIComponent($(this).attr('data-href'));
    var hiddenIFrameID = 'hiddenDownloader' + downCount;
    downCount = downCount + 1;
    var iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
});