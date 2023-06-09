// CloudFuze home page action panel events
$('#move-header').on('change','#moveSource .srcCldInput',function() {
sendGAEvents("selected source in backup page");
    localStorage.removeItem('_scrollSrcTokenVal');
    sessionStorage.setItem("source","source");
    var _CloudName = $("#moveDestination .move").attr("cloud"),
        _Modal = $('#mulUsrCheck'),
        _ModalText = _Modal.find(".tab-content h4 span");
    var _cl = $(this).closest('div').children('.move').attr('class');

    if (MultiUserClouds.indexOf(_CloudName) > -1) {
        if (_cl === "move") {
            return false;
        }
        _cl = _cl.split(' ')[1];

        if(cloudMapping[_cl] && cloudMapping[_cl].indexOf(_CloudName) > -1){}
        else if (!cloudMapping[_cl] || cloudMapping[_cl].indexOf(_CloudName) === -1) {
            _ModalText.text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
            _Modal.modal("show");
            return false;
        }
        else {
            _ModalText.text("Both Source and Destination should be multi user clouds.");
            _Modal.modal("show");
            return false;
        }
    }
    else if ($("#dynamicDestCloudName").text() !== "") {
        _cl = _cl.split(' ')[1];
        if (_cl === "ONEDRIVE_BUSINESS_ADMIN" || _cl === "DROPBOX_BUSINESS") {
            _ModalText.text("Both Source and Destination should be multi user clouds.");
            _Modal.modal("show");
            return false;
        }
    }
    $('#backUpBtn').attr('disabled', true).removeClass('blue');
    var cloud_id = $(this).closest('div').children('.move').attr('cid');
    localStorage.setItem("mulUsrSrc", cloud_id);
    var p_id = $(this).closest('div').children('.move').attr('pid');
    moveCheckSum = 'source';
    var name = CFManageCloudAccountsAjaxCall.getMaxChars($(this).closest('div').children('.move').siblings('#userEmail').text(), 16);
	var title =$(this).closest('div').children('.move').siblings('#userEmail').text(); 
    PageName = 'move';
    PageNumber = 1;
    SingleCloudId = cloud_id;
    SinglePId = p_id;
    var type = $(this).closest('div').children('.move').attr('class');
    type = type.split(' ');
    type = type[1];
    for (i = 0; i < AllCloudsInfo.length; i++) {
        if (AllCloudsInfo[i].id === SingleCloudId) {
            if (MultiUserClouds.indexOf(type) > -1) {
                multiUserDispaly(cloud_id);
                if ($("#moveDestination .moveMultiUserCheck").length === 1 && $("#moveSource .moveMultiUserCheck").length === 1) {
                    $('#multiMoveCheck1').modal('show');
                    setTimeout(function () {
                        $('#multiMoveCheck1').modal('hide');
                        window.location.href = "move_multiuser.html";
                    }, 3000);
                    multiUsrMapng();
                }
                return false;
            }
            if (MultiUserClouds.indexOf(AllCloudsInfo[i].cloudName) > -1) {
                return false;
            }
            var _filesCount,_fldCount;
            if(!((AllCloudsInfo[i].cloudName === "DROP_BOX" ||AllCloudsInfo[i].cloudName === "ONEDRIVE" ||AllCloudsInfo[i].cloudName === "G_DRIVE" ||AllCloudsInfo[i].cloudName === "BOX")&& moveCheckSum === 'source')){
                $.ajax({
                    type: "GET",
                    url: apicallurl + "/filefolder/count/filefolders?cloudId=" + AllCloudsInfo[i].id,
                    async: false,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
                    },
                    success: function (data) {
                        if(data === undefined){
                            _filesCount=0;
                            _fldCount=0;

                        }
                        else {
                            _filesCount = data.filesCount;
                            _fldCount = data.foldersCount;
                        }

                        if(_filesCount === undefined){
                            _filesCount=0;
                        }
                        if(_fldCount === undefined){
                            _fldCount=0;
                        }
                    }
                });
            }
            $('#totalfiles').html('');
            if((AllCloudsInfo[i].cloudName === "DROP_BOX" ||AllCloudsInfo[i].cloudName === "ONEDRIVE" ||AllCloudsInfo[i].cloudName === "G_DRIVE" ||AllCloudsInfo[i].cloudName === "BOX")&& moveCheckSum === 'source'){
                $(".tab-header.srcFilesFldrCnt").find('#totalfiles').css("visibility","hidden");
            }
            else
                $('#totalfiles').html("Files : " + _filesCount + " &nbsp; &nbsp;Folders :  " + _fldCount);
            $(".tab-header.srcFilesFldrCnt").find('#totalfiles').css("visibility","visible");

            break;
        }
    }
    $('#breadCrumbdyncmove').empty();
    $('#breadCrumbdyncmove').append('<li id="cloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="cloud"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">My Clouds </a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span></li><li id="allcloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="' + SingleCloudId + '"><a href="#"> ' + name + '</a></li>');

    $('refreshcloudmovesrc').addClass('cf-refresh4');
    $('#dynamicCloudName').text(name);
    $('#dynamicCloudName').attr('title', title);	
    $('#dynamicCloudName').attr('type', type);
    $('#dynamicCloudName').attr('type', type);
//	$('#dynamicCloudName').siblings('.moveHeader').attr('src','../img/PNG/'+type+'.png');
	$('#dynamicCloudName').siblings('.moveHeader').children('.moveHeaderIcon').attr('id', type);
	$('#dynamicCloudName').siblings('.moveHeader').css('display','block'); 
    $('#dynamicCloudName').attr('check', 'sroot');
});


$('#move-header').on('change','#moveDestination .dstnCldInput',function() {
sendGAEvents("selected destination in backup page");
    localStorage.removeItem('_scrollDstnTokenVal');
    sessionStorage.setItem("source","destination");
    var _moveSource = $("#moveSource .move"),
        _CloudName = _moveSource.attr("cloud"),
        _Modal = $('#mulUsrCheck'),
        _ModalText = _Modal.find(".tab-content h4 span"),
        _backUpModal = $('#backUpBtn'),
        _destCloudName = $('#dynamicDestCloudName');
    var _cl = $(this).closest('div').children('.move').attr('class');

    //Multi User Clouds Validation
    if (MultiUserClouds.indexOf(_CloudName) > -1) {
        if (_cl === "move") {
            return false;
        }
        _cl = _cl.split(' ')[1];

        if(cloudMapping[_CloudName] && cloudMapping[_CloudName].indexOf(_cl) > -1){}
        else if (!cloudMapping[_CloudName] || cloudMapping[_CloudName].indexOf(_cl) === -1) {
            _ModalText.text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
            _Modal.modal("show");
            return false;
        }
        else {
            _ModalText.text("Both Source and Destination should be multi user clouds.");
            _Modal.modal("show");
            return false;
        }
    }
    else if ($("#dynamicCloudName").text() !== "") {
        _cl = _cl.split(' ')[1];
        if (MultiUserClouds.indexOf(_cl) > -1) {
            _ModalText.text("Both Source and Destination should be multi user clouds.");
            _Modal.modal("show");
            return false;
        }
    }

    _backUpModal.attr('disabled', true).removeClass('blue');
    if($(document).find("[name='srcCld']:checked").length >0)
        $('#backUpBtn').removeAttr('disabled').addClass('blue');

    moveCheckSum = 'dest';
    var cloud_id = $(this).closest('div').children('.move').attr('cid');
    localStorage.setItem("mulUsrDst", cloud_id);
    var cloudCheck = $(this).closest('div').children('.move').attr('class').split(' ')[1];
    var p_id = $(this).closest('div').children('.move').attr('pid');

    var CLTYPE = ["SHAREPOINT_2013",
        "SHAREPOINT_2010",
        "ALFRESCO",
        "FTP",
        "CIFS"];

    if ($.inArray(cloudCheck, CLTYPE) > -1) {
        p_id = "/" + cloud_id + p_id;
    }
    else if (cloudCheck === "ORANGE") {
        if (isProd) {
            p_id = '/' + cloud_id + '/bWVzIGRvc3NpZXJzIHBhcnRlbmFpcmVzL0Nsb3VkRnV6ZS8'; 
        }
        else if (!isProd) {
            p_id = '/' + cloud_id + '/bWVzIGRvc3NpZXJzIHBhcnRlbmFpcmVzL0Nsb3VkZnV6ZSBEZXYv'; 
        }
    }
    else if (cloudCheck === "AXWAY") {
        p_id = "/" + cloud_id
    }

    moveDestParent = p_id;
    var name = CFManageCloudAccountsAjaxCall.getMaxChars($(this).closest('div').children('.move').siblings('#userEmail').text(), 15);
	var title = $(this).closest('div').children('.move').siblings('#userEmail').text();
    var type = $(this).closest('div').children('.move').attr('class');
    type = type.split(' ');
    type = type[1];
    _destCloudName.attr('type', type);
    PageName = 'move';
    PageNumber = 1;
    SingleCloudId = cloud_id;
    SinglePId = p_id;
    for (i = 0; i < AllCloudsInfo.length; i++) {
        if (AllCloudsInfo[i].id === SingleCloudId) {
            if (MultiUserClouds.indexOf(type) > -1) {
                multiUserDispaly(cloud_id);
                if ($("#moveDestination .moveMultiUserCheck").length === 1 && $("#moveSource .moveMultiUserCheck").length === 1) {
                    $('#multiMoveCheck1').modal('show');
                    setTimeout(function () {
                        $('#multiMoveCheck1').modal('hide');
                        window.location.href = "move_multiuser.html";
                    }, 3000);
                    multiUsrMapng();
                }
                return false;
            }
            if (AllCloudsInfo[i].cloudName === "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName === "DROPBOX_BUSINESS") {
                return false;
            }
            var _filesCount,_fldCount;
            if(!((AllCloudsInfo[i].cloudName === "DROP_BOX" ||AllCloudsInfo[i].cloudName === "ONEDRIVE" ||AllCloudsInfo[i].cloudName === "G_DRIVE" ||AllCloudsInfo[i].cloudName === "BOX")&& moveCheckSum === 'dest')) {
                $.ajax({
                    type: "GET",
                    url: apicallurl + "/filefolder/count/filefolders?cloudId=" + AllCloudsInfo[i].id,
                    async: false,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
                    },
                    success: function (data) {
                        if (data === undefined) {
                            _filesCount = 0;
                            _fldCount = 0;

                        }
                        else {
                            _filesCount = data.filesCount;
                            _fldCount = data.foldersCount;
                        }
                        if (_filesCount === undefined) {
                            _filesCount = 0;
                        }
                        if (_fldCount === undefined) {
                            _fldCount = 0;
                        }
                    }
                });
            }
            $('#totalfilesdestination').html('');
            if((AllCloudsInfo[i].cloudName === "DROP_BOX" ||AllCloudsInfo[i].cloudName === "ONEDRIVE" ||AllCloudsInfo[i].cloudName === "G_DRIVE" ||AllCloudsInfo[i].cloudName === "BOX")&& moveCheckSum === 'dest'){
                $(".tab-header.dstnFilesFldrCnt").find('#totalfiles').css("visibility","hidden");
            }
            else{
                $('#totalfilesdestination').html("Files : " + _filesCount + " &nbsp; &nbsp;Folders :  " + _fldCount);
                $(".tab-header.dstnFilesFldrCnt").find('#totalfiles').css("visibility","visible");
            }

            $('#totalfilesdestination').siblings('i').attr('cid', AllCloudsInfo[i].id);
            break;
        }
    }

    $('#breadCrumbdyncmovedest').empty();


    var _destBreadCrumbHtml = '<li id="cloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="cloud">' +
        '<a href="#" style="color:blue;text-decoration: underline;cursor:default;">My Clouds </a>' +
        '<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span>' +
        '</li><li id="allcloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="' + SingleCloudId + '">' +
        '<a href="#"> ' + name + '</a></li>';

    $('#breadCrumbdyncmovedest').append(_destBreadCrumbHtml);

    _destCloudName.text(name);
	_destCloudName.attr('title',title);
	_destCloudName.siblings('img').attr('src','../img/PNG/'+type+'.png');
	_destCloudName.siblings('.moveHeader').children('.moveHeaderIcon').attr('id', type);
	_destCloudName.siblings('.moveHeader').css('display','block');
    _destCloudName.attr('cid', cloud_id);
    _destCloudName.attr('fid', p_id);
    _destCloudName.attr('check', 'droot');

});
$('#move-header').on('click',"#moveDestination input[name='srcfile']",function() {
   if($('#moveSource').find("[name='srcfile']:checked").length >0)
       $('#backUpBtn').prop('disabled', false).addClass('blue');
});
$('#move-header').on('click',"#moveSource input[name='srcfile']",function() {
    if($('#moveDestination').find("[name='srcfile']:checked").length >0)
        $('#backUpBtn').prop('disabled', false).addClass('blue');
});

$('#move-header').on('change','input',function(){
    sendGAEvents("Selecting Files in Move");
    $('#moveDestination').find('.moveCloudBlockDragHover').addClass('moveCloudBlock').removeAttr('style').removeClass('moveCloudBlockDragHover');
    if($(this).is(':checked')) {
        $(this).parent().addClass('fileActive');
    }
    else {
        $(this).parent().removeClass('fileActive');
        $(this).closest('span').removeClass("fileActive");
        $(this).next().removeClass('fileActive');
    }
    $(document).find("[name='srcCld']:not(:checked)").parent().removeClass("fileActive");
    $(document).find("[name='dstnCld']:not(:checked)").parent().removeClass("fileActive");
    $(document).find("[name='srcfile']:not(:checked)").parent().removeClass("fileActive");
    if(PageName === 'move'){
        $(this).closest('.moveCloudBlockDragHover').addClass('moveCloudBlock').removeClass('moveCloudBlockDragHover');
    }
    if($(document).find("[name='srcCld']:checked").length >0 && $(document).find("[name='dstnCld']:checked").length >0){
        $('#backUpBtn').removeAttr('disabled').addClass('blue');
    }
    if($('input:checked').length > 0){
        if($('input[name="srcCld"]:checked').length > 0 && $('input[name="dstnCld"]:checked').length > 0) {
            $('#dynamicDestCloudName').removeAttr('check');
            $('#backUpBtn').removeAttr('disabled').addClass('blue');
        }
        if($('#dynamicDestCloudName').attr('type') === "SHAREPOINT_ONLINE" && $('#dynamicDestCloudName').attr('check') === "droot")
        {
            $('#backUpBtn').prop('disabled',true).removeClass('blue');
        }
    } 
    if($('input[name="destCloud"]:checked').length > 0){
        moveCheckSum = 'dest';
        PageName = 'moveLanding';
    }
    if($(this).parent().attr('id')==='moveDestination'){
        moveCheckSum = 'dest';
    }
    if($(this).attr('name') === 'destCloud'){
        moveCheckSum = 'dest';
        PageName = 'moveLanding';
    }
    if(moveCheckSum === 'dest'){
        if($(this).attr('name') === 'destCloud'){
            PageName = 'moveLanding';
        }
    }
    if($(this).parent().attr('id') === 'moveSource'){
        moveCheckSum = 'source';
    }
});


$('#moveSource').on('click','#moveSourceCheckbox',function(){
    if($(this).is(':checked')){
        $('#moveSource').find('input[type="checkbox"]').each(function(){
            $(this).prop('checked',true);
            $(this).parent('span').addClass('fileActive');
        });
    }else{
        $('#moveSource').find('input[type="checkbox"]').each(function(){
            $(this).prop('checked',false);
            $('#moveSource').find('.fileActive').each(function(){
                $(this).removeClass('fileActive');
            });
        });
    }
});
//BackUp Initiation
$('#backUpBtn').on('click',function(){
sendGAEvents("clicked on backup button");
 $(".supportcontent").css("display","");
	    $("#ProceedToOptions").css("display","");
            $("#moveMigrationPrices h4").css("display","");  
    if(($("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings().hasClass('SHAREPOINT_ONLINE_CONSUMER')) && ($("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings().hasClass('AMAZON'))||($("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings().hasClass('G_DRIVE')) && ($("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings().hasClass('ONEDRIVE'))||($("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings().hasClass('EGNYTE_STORAGE')) && ($("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings().hasClass('ONEDRIVE'))||($("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings().hasClass('DROP_BOX')) && ($("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings().hasClass('ONEDRIVE'))||($("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings().hasClass('DROP_BOX')) && ($("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings().hasClass('G_DRIVE'))){
        $('#CFShowLoading').modal('show');
        if ($("#moveSource").find("span").hasClass('cf-back')) {
            var fromCloudId = $("#moveSource").find(".list-group").find("span input[name='srcfile']:checked").parent('span').attr('cid');
            var fromRootId = $("#moveSource").find(".list-group").find("span input[name='srcfile']:checked").parent('span').attr('srcparent');
            var array = []; 
            $("#moveSource").find(".list-group").find("span input[name='srcfile']:checked").each(function () {
                var s = $(this).parent('span').attr('id'); 
                array.push(s);
            });
        }
        else {
            var fromCloudId = $("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings('.move').attr("cid");
            var fromRootId = $("#moveSource").find(".moveCloudBlock").find("input[name='srcCld']:checked").siblings('.move').attr("pid");
        }
        if ($("#moveDestination").find("span").hasClass('cf-back')) {
            var toCloudId = $("#moveDestination").find(".list-group").find("span input[name='srcfile']:checked").parent('span').attr('cid');
            var toRootId = $("#moveDestination").find(".list-group").find("span input[name='srcfile']:checked").parent('span').attr('dstnparent');
        }
        else {
            var toCloudId = $("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings('.move').attr("cid");
            var toRootId = $("#moveDestination").find(".moveCloudBlock").find("input[name='dstnCld']:checked").siblings('.move').attr("pid");
        }
        $('input[name=subscription][value=BasicMonthly]').prop('checked',true);
        var obj = {
            "fromRootId": fromRootId,
            "toRootId": toRootId,
            "fromCloudId": {
                "id": fromCloudId
            },
            "toCloudId": {
                "id": toCloudId
            },
            "fileIds": array,
            "consumerBackup": true
        };
        var arr = [];
        arr.push(obj);
        $.ajax({
            type: "POST",
            url: apicallurl + "/move/consumer/create/job",
//            async: false,
            data: JSON.stringify(obj),
            headers: {
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "content-type": "application/json"
            },
            success: function (data) {
                $('#CFShowLoading').modal('hide');
                if (data.duplicatePair === true) {
                    $('#duplicatemigration').modal();
                }
                else {
                    if (data.trialComplete === true) {
                       // $('#CFmoveStatus').modal();
			$('#moveMigrationPrices').modal();
                    }
                    else {
                        getuserexpiry.getLastSubscription();
                        if (lastsubsresponse == undefined) {
                            $('#moveMigrationPrices').modal();
                            $(document).find("#OptionsPopUp").find('.conJobName').val(data.jobName);
                            $(document).find("#OptionsPopUp").find('.conJobName').attr("JobId", data.id);
                            $(document).find("#OptionsPopUp").find('.conJobName').attr("JobName", data.jobName);
                            localStorage.setItem("MigrateFolderName", data.migrateFolderName);
                        }
                        else {
							$('#CFShowLoading').css('display','none');
                            $('#OptionsPopUp').modal();
                            $("#OptionsPopUp").find('.conJobName').val(data.jobName);
                            $("#OptionsPopUp").find('.conJobName').attr("JobId", data.id);
                            $("#OptionsPopUp").find('.conJobName').attr("JobName", data.jobName);
                            localStorage.setItem("MigrateFolderName", data.migrateFolderName);
                        } 
                    }
                }
            }
        });
    }
    else
{
	$('#CFShowLoading').css('display','none');
    $('#Restriction').modal('show');
}
});
$('#ProceedToOptions').on('click',function(){
sendGAEvents("clicked on proceed button in trial user limit popup");
    $('#moveMigrationPrices').modal('hide');
    $('#OptionsPopUp').modal();
});

//Updating Job
$('#toPreview').on('click',function(){
sendGAEvents("clicked on proceed button in options popup");
    var jobID = $("#OptionsPopUp").find('.conJobName').attr("JobId");
    var FolderName = $("#OptionsPopUp").find('.conJobName').attr("MigrateFolderName");
    var JobName =  $("#OptionsPopUp").find('.conJobName').val();
    var ImageBacKUp = false;
    var CloudBackUp = false;
    if($('input[name="sync"]:checked').val() === "Image Sync"){
        ImageBacKUp = true;
    }
    else{
        CloudBackUp = true;
    }
    $.ajax({
        type: "PUT",
        url: apicallurl + "/move/consumer/update/"+jobID+"?jobName="+JobName+"&migrateFolderName="+FolderName+"&imageBacKUp="+ImageBacKUp+"&consumerBackup="+CloudBackUp,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "content-type": "application/json"
        },
        success: function (data) {
            console.log(data);
            $('#OptionsPopUp').modal('hide');
            $('#previewPopUp').modal();
			$('#previewPopUp').find('.consumerJobName').attr('title',data.jobName);
            $('#previewPopUp').find('.consumerJobName').text(CFManageCloudAccountsAjaxCall.getMaxChars(data.jobName,35));
            $('#previewPopUp').find('.consumerJobName').attr("JOBID",data.id);
            var selected = $(document).find("[name='sync']:checked").val();
            $(document).find('.SyncOptions').text(selected);
            var Frequency = $(document).find("[name='Freq']:checked").val();
            $(document).find('.Frequency').text(Frequency);
        }
    });
});
//Start BackUp
$('#Proceed').on('click',function() {
sendGAEvents("clicked on proceed button in preview popup");
  var JobID = $('#previewPopUp').find('.consumerJobName').attr("JOBID");
  var _domain;
  if(apicallurl == "https://devwebapp.cloudfuze.com/proxyservices/v1"){
	  _domain = "dev";
  }
  else if(apicallurl == "https://slwebapp.cloudfuze.com/proxyservices/v1"){
	  _domain = "sl"; 
  }
  else if(apicallurl == "https://staging.cloudfuze.com/proxyservices/v1"){
	  _domain = "staging"; 
  }
  else{
	  _domain = "prod";
  }
    $.ajax({
        type: "POST",
        url: apicallurl + "/move/newConsumer/create/"+JobID+"?domain="+_domain,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "content-type": "application/json"
        },
        success: function (data) {
            $('#previewPopUp').modal('hide');
			
                    $('.alertScs .msg').css("margin-top","-2%");
                        alertSuccess("Your backup has been initiated. You can monitor it here or log off and see the backup report that will be emailed to you.");
        
            setTimeout(function () { 
		localStorage.setItem("MigtnDone","consumer");
                window.location.href = "reports.html#backup";
            }, 2000);
        }
    });

});


