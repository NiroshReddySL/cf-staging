$("#move_main").on("change","#mappingClouds input[type=radio]",function () {
    if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length){
        var searchData ={
            "mapping":false,
            "source" : false,
            "destination" : false
        }
        localStorage.setItem("searchData",JSON.stringify(searchData));
        $("#forNextMove").removeClass("disabled");
    }

});

$("#forNextMove").click(function () {

    $(".ui-helper-hidden-accessible").hide();
    $("#forPreviousMove").removeClass("disabled");
    $("#forNextMove").addClass("disabled");
    var _step = parseInt($("#forNextMove").attr("data-step"));
    _step = _step + 1;
    if(_step == 0)
        return false;
    else if(_step == 1){
        $("#srcUsrs .custom-search-input input").val('');
        $("#mapdUsrs .custom-search-input input").val('');
        $("#dstnUsrs .custom-search-input input").val('');
        $("#forPreviousMove").addClass("disabled");
        $("#mappingClouds").css("display","");
        $("#mappingUsers").css("display","none");
		$("#mappingPreMigration").css("display","none");
        if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length)
            $("#forNextMove").removeClass("disabled");

        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    }
	 else if(_step == 2){
		  localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr("id"));
        localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr("id"));
        localStorage.setItem("multiUsrDstnEmail",$('#dstClouds input[name=dstCloud]:checked').attr("mail"));
        localStorage.setItem("multiUsrSrcEmail",$('#srcClouds input[name=sourceCloud]:checked').attr("mail"));


        var $srcChkd = $('#srcClouds input[name=sourceCloud]:checked'),$dstChkd = $('#dstClouds input[name=dstCloud]:checked');
        var _cldDtls ={
            srcCldName   : $($srcChkd).siblings('.migrateImg').children().attr('id'),
            dstCldName   : $($dstChkd).siblings('.migrateImg').children().attr('id'),
            srcAdminName : CFManageCloudAccountsAjaxCall.getMaxChars($($srcChkd).parent().siblings().find("h5").text(),20),
            dstAdminName :  CFManageCloudAccountsAjaxCall.getMaxChars($($dstChkd).parent().siblings().find("h5").text(),20)
        };
		$("#mappingPreMigration").css("display","");
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
		$("#forNextMove").removeClass("disabled");
    }
    else if(_step == 3){
		
        $("#usersTab").trigger('click'); 
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","");
		$("#mappingPreMigration").css("display","none");
            $("#forNextMove").css({"width": "140px", "margin-left": "90%"}); 
            $("#forNextMove span").text("Start Migration");
        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    }
	else if(_step == 4){
		migrateMsg();
	}

});
$("#forPreviousMove").click(function () {
    var _step = parseInt($("#forPreviousMove").attr("data-prev"));
    $(".ui-helper-hidden-accessible").hide();
    if(_step == 6)
        location.reload();
    $("#forNextMove").css({"width": "83.5px"});
    $("#forNextMove span").text("Next");
    $("#preview").css("display","none");
    $("#forNextMove").removeClass("disabled"); 
    _step = _step - 1;

    if(_step == 0)
        return false;
    else if(_step == 1){
        localStorage.removeItem("teamMigrationMappingPopUp");
        $("#srcUsrs .custom-search-input input").val('');
        $("#mapdUsrs .custom-search-input input").val('');
        $("#dstnUsrs .custom-search-input input").val('');
        $("#forPreviousMove").addClass("disabled");
        $("#mappingClouds").css("display","");
        $("#mappingUsers").css("display","none");
		$("#mappingPreMigration").css("display","none");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
        $("#teamMigrationWidget ul li[data-val='1']").addClass("active");
		$("#srcCloudUsers .message-widget").html('');
		$("#dstCloudsUsers .message-widget").html('');
        $("#teamMigrationWidget ul li").removeClass("active").removeClass("completed");
        if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length)
            $("#forNextMove").removeClass("disabled");
    }
    else if(_step == 2){
        $("#srcUsrs .custom-search-input input").val('');
        $("#mapdUsrs .custom-search-input input").val('');
        $("#dstnUsrs .custom-search-input input").val('');
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
		$("#mappingPreMigration").css("display","");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
    }
	else if(_step == 3){
        $("#srcUsrs .custom-search-input input").val('');
        $("#mapdUsrs .custom-search-input input").val('');
        $("#dstnUsrs .custom-search-input input").val('');
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","");
		$("#mappingPreMigration").css("display","none");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
        if($('#mapdUsers input[name=inputMapdUrs]:checked').length)
            $("#forNextMove").removeClass("disabled");
    }
    

    $("#forPreviousMove").attr("data-prev",_step);
    $("#forNextMove").attr("data-step",_step);
    $("#teamMigrationWidget ul li[data-val=" + (_step + 1) + "]").removeClass("active");
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active").removeClass("completed");
});
$("#teamMigrationWidget ul li").click(function () {
    if($("#teamMigrationWidget ul li.last").hasClass("completed"))
        return false;

    if($(this).hasClass("active") || $(this).hasClass("completed"))
    {
        var _step = parseInt($(this).find(".badge").text());
        $("#preview").css("display","none");
        
        if(_step == 0)
            return false;
        else if(_step == 1){
            $("#srcUsrs .custom-search-input input").val('');
            $("#mapdUsrs .custom-search-input input").val('');
            $("#dstnUsrs .custom-search-input input").val('');
            $(".ui-helper-hidden-accessible").hide();
            $("#forPreviousMove").addClass("disabled");
            $("#mappingClouds").css("display","");
            $("#mappingUsers").css("display","none");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","none");
            $('#mappingOptions').css("display","none");
            $('#mappingOptionsNew').css("display","none");
            if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length)
                $("#forNextMove").removeClass("disabled");
        }
        else if(_step == 2){
            $("#srcUsrs .custom-search-input input").val('');
            $("#mapdUsrs .custom-search-input input").val('');
            $("#dstnUsrs .custom-search-input input").val('');
            $("#mappingClouds").css("display","none");
            $("#mappingUsers").css("display","none");
			$("#mappingPreMigration").css("display","");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","none");
            $('#mappingOptions').css("display","none");
            $('#mappingOptionsNew').css("display","none"); 
        }
		else if(_step == 3){
            $("#srcUsrs .custom-search-input input").val('');
            $("#mapdUsrs .custom-search-input input").val('');
            $("#dstnUsrs .custom-search-input input").val('');
            $("#mappingClouds").css("display","none");
            $("#mappingUsers").css("display","");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","none");
            $('#mappingOptions').css("display","none");
            $('#mappingOptionsNew').css("display","none");
            if($('#mapdUsers input[name=inputMapdUrs]:checked').length)
                $("#forNextMove").removeClass("disabled");
        }
        
        if(_step < 3){
            $("#forNextMove").css({"width": "83.5px", "margin-left": "90%"});
            $("#forNextMove span").text("Next");
        }

        $("#forPreviousMove").attr("data-prev",_step);
        $("#forNextMove").attr("data-step",_step);
        //$("#teamMigrationWidget ul li[data-val=" + (_step + 1) + "]").removeClass("active");
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active").removeClass("completed");
        _step = _step + 1;
        for(;_step<6;_step++)
            $("#teamMigrationWidget ul li[data-val=" + (_step) + "]").removeClass("active").removeClass("completed");
    }
});


pageNumb = 1;
function slackChannels(cloudId,nextId){
if(cloudId == undefined)
	cloudId = localStorage.multiUsrSrcCldId;
	for(var i=0;i<AllCloudsInfo.length;i++){
 if(cloudId == AllCloudsInfo[i].id){   
    var workspaceName = AllCloudsInfo[i].metadataUrl;
break;
 }
}
if(nextId == undefined){
	url = apicallurl + "/filefolder/userId/"+localStorage.UserId+"/cloudId/"+cloudId+"?&pageSize=50&pageNo="+pageNumb;
}
else{
	url = apicallurl + "/filefolder/userId/"+localStorage.UserId+"/cloudId/"+cloudId+"?nextPreviousId="+nextId+"&pageSize=50&pageNo="+pageNumb;
}
	 $.ajax({
        type: "GET", 
        url: url,
		async: false,
         headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
        success: function (data) {
			if(pageNumb == 1){
			$("#channelsTable table tbody").html('');
			}
			if(data[0].nextPageToken != null){
				pageNumb++;
				localStorage.setItem('slackNextToken',data[0].nextPageToken);
			}
			else{
				localStorage.setItem('slackNextToken',data[0].nextPageToken);
			}
			$("#channelsTable p").css('display','none');
			var pubCount = 0,pvtCount=0;
			for (var i =0;i<data.length;i++){
		if($("#selectAllChannels:checked").length){
        var _input = '<input type="checkbox" name="channelSelect" id="'+data[i].id+'" workspacename="'+workspaceName+'" channeltype="'+data[i].channelType+'" channelname="'+data[i].objectName+'" destchannelname="'+data[i].objectName+'" destteamname="'+data[i].objectName+'" subchannel="false" channeldate="'+data[i].channelDate+'" checked>';
		}
		else{
		var _input = '<input type="checkbox" name="channelSelect" id="'+data[i].id+'" workspacename="'+workspaceName+'" channeltype="'+data[i].channelType+'" channelname="'+data[i].objectName+'" destchannelname="'+data[i].objectName+'" destteamname="'+data[i].objectName+'" subchannel="false" channeldate="'+data[i].channelDate+'">'; 
		}  

     var _html = '<tr fromRootId="'+data[i].id+'"><td style="width: 1%;">'+_input+'</td><td style="width:18%;" title="'+data[i].objectName+'"><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: text-bottom;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>'+CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 22)+'</td>'+
	 '<td style="width: 16%;">'+data[i].channelType+'</td>'+
	 '<td style="width: 16%;"><select id="msgType_dropDown" style=""><option>Team</option><option>Sub-Channel</option></select></td>'+
	 '<td style="width: 19%;"><span id="destTeamNameSpan" title="'+data[i].objectName+'">'+CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 22)+'</span><i class="lnil lnil-pencil" id="destTeamEdit" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>'+
	 '<td style="width: 18%;"><span id="destChannelNameSpan" title="'+data[i].objectName+'">'+CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 22)+'</span><i class="lnil lnil-pencil" id="destChannelEdit" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>'+
	 '</tr>';
		$("#channelsTable table tbody").append(_html);  
		if(data[i].channelType == "public"){
			pubCount++;
		}
		else{
			pvtCount++;
		}
		}
		$("#mapCount").text($("#channelsTable tbody tr").length);
		$("#pubDiv").text("Public : "); 
		$("#pvtDiv").text("Private : "); 
		$("#pubCount").text(JSON.parse($("#pubCount").text())+pubCount); 
		$("#pvtCount").text(JSON.parse($("#pvtCount").text())+pvtCount);
		//$("#selDiv").css("display","none");
		
		if($("#selectAllChannels:checked").length){
		$("#selCount").text($("#channelsTable tbody tr").length);
		}		
		setTimeout(function () { 
                    $('#CFShowLoading').hide();
                  
                }, 1000);
		}
	 });
}
function slackUsers(){

	 $.ajax({
        type: "POST",
        url: apicallurl + "/mapping/user/clouds/save/permissions?sourceCloudId="+localStorage.multiUsrSrcCldId+"&destCloudId="+localStorage.multiUsrDstnCldId+"&pageNo=1&pageSize=30",
		async: false,
         headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
        success: function (data) {
			$("#usersTable table tbody").html('');
			$("#usersTable p").css('display','none');
			var pubCount = 0,pvtCount=0;
			for (var i =0;i<data.length;i++){
				if(data[i].sourceCloudDetails != null && data[i].destCloudDetails != null){
					pubCount++;
					var _html = '<tr><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td style=""><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails == null && data[i].destCloudDetails != null){
					pvtCount++;
					var _html = '<tr><td><span>-</span></td><td style=""><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails != null && data[i].destCloudDetails == null){
					pvtCount++;
					var _html = '<tr><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td><span>-</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
		
				}$("#usersTable table tbody").append(_html);
		}   
		$("#mapCount").text(data[0].noOfMappedCloudPressent);
		$("#pubDiv").text("Matched : "); 
		$("#pvtDiv").text("Unmatched : ");
		$("#pubCount").text(pubCount); 
		$("#pvtCount").text(pvtCount);
		$("#selDiv").css("display","none");
		$("#selCount").text('00');		
		}
	 });
}
function getSlackUsers(){

	 $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/user/clouds/get/permissions?sourceCloudId="+localStorage.multiUsrSrcCldId+"&destCloudId="+localStorage.multiUsrDstnCldId+"&pageNo=1&pageSize=30",
		async: false,
         headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
        success: function (data) {
			if(data.length == 0){
				slackUsers();
			}
			else{
			$("#usersTable table tbody").html('');
			$("#usersTable p").css('display','none');
			var pubCount = 0,pvtCount=0;
			for (var i =0;i<data.length;i++){
				if(data[i].sourceCloudDetails != null && data[i].destCloudDetails != null){
					pubCount++;
				     var _html = '<tr><td style="padding-left: 4%;"><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td style=""><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails == null && data[i].destCloudDetails != null){
					pvtCount++;
					var _html = '<tr><td style="padding-left: 4%;"><span>-</span></td><td style=""><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails != null && data[i].destCloudDetails == null){
					pvtCount++;
					var _html = '<tr><td style="padding-left: 4%;"><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td><span>-</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
		$("#usersTable table tbody").append(_html);
		}  
		$("#mapCount").text(data[0].noOfMappedCloudPressent); 
		$("#pubDiv").text("Matched : "); 
		$("#pvtDiv").text("Unmatched : ");
		$("#pubCount").text(pubCount); 
		$("#pvtCount").text(pvtCount);
		$("#selDiv").css("display","none");
		$("#selCount").text('00');
		}
		}
	 });
} 

$(document).on('change','#selectAllChannels',function () {
 if($("#selectAllChannels:checked").length){
        $("input[name=channelSelect]:visible").prop('checked',true);
		$("#selDiv").css("display","");
		$("#selCount").text($("input[name=channelSelect]:visible").length);
		$("#forNextMove").removeClass('disabled');
 }
 else{
	 $("input[name=channelSelect]").prop('checked',false);
	 $("#selDiv").css("display","none");
	 $("#selCount").text('00');
	 $("#forNextMove").addClass('disabled'); 
 } 
});

$(document).on('change','input[name=channelSelect]',function () {
	if($("input[name=channelSelect]:checked").length == parseInt($("#mapCount").text())){
		$("#selectAllChannels").prop('checked',true);
	}
	$("#selDiv").css("display","");
 	$("#selCount").text($("input[name=channelSelect]:checked").length);
	if($("input[name=channelSelect]:checked").length > 0){
		$("#forNextMove").removeClass('disabled');
	}
	else{
		$("#forNextMove").addClass('disabled');
	}

});
$(document).on('change','#selectAllUsers',function () {
 if($("#selectAllUsers:checked").length){
        $("input[name=userSelect]").prop('checked',true);
		$("#selDiv").css("display","");
		$("#selCount").text($("#usersTable table tbody tr").length);
 }
 else{
	 $("input[name=userSelect]").prop('checked',false);
	 $("#selDiv").css("display","none");
	 $("#selCount").text('00');
 } 
});

$(document).on('change','input[name=userSelect]',function () {
	if($("input[name=userSelect]:checked").length == parseInt($("#mapCount").text())){
		$("#selectAllUsers").prop('checked',true);

	}
	$("#selDiv").css("display","");
 		$("#selCount").text($("input[name=userSelect]:checked").length);
	
});

$('#channelsTable tbody').on('scroll', function() {
  if ($(this).innerHeight() + $(this).scrollTop()+10 >= $(this)[0].scrollHeight) {
	  
			if(localStorage.getItem('slackNextToken') == "null")
			{
				return false;
			}
	            slackChannels(undefined,localStorage.getItem('slackNextToken'));
	
  }
			$("#CFShowLoading").modal('hide');			
			return false;
        	 
		
});
$("#channelsTab").click(function(){
$(this).addClass("active");
$(this).siblings('li').removeClass("active");
$("#channelsTable").css("display","");
$("#usersTable").css("display","none");
$("#automapBtn").css("display","none");
$("#migrateBtn").css("display","");
$(".searchTextBox").attr("placeholder","Enter Channel Name");
$("#channelCnt").text("Channels : ");
$("#pubDiv").text("Public : "); 
$("#pvtDiv").text("Private : ");
$("#pubCount").text(0);
$("#pvtCount").text(0);
pageNumb = 1; 
slackChannels(localStorage.multiUsrSrcCldId);
$("#selectAllChannels").prop("checked",false); 
});
$("#automapBtn").click(function(){
slackUsers();
});
$("#usersTab").click(function(){
$(this).addClass("active");
$(this).siblings('li').removeClass("active");
$("#usersTable").css("display","");
$("#channelsTable").css("display","none");
$("#automapBtn").css("display","");
$("#migrateBtn").css("display","none");
$(".searchTextBox").attr("placeholder","Enter User Name");
$("#channelCnt").text("Mappings : "); 
getSlackUsers();
$("#selectAllUsers").prop("checked",false);
$("#pubDiv").text("Matched : "); 
$("#pvtDiv").text("Unmatched : "); 
$("#forNextMove").addClass('disabled');

});
$(".fa-search").click(function(){
$(".searchTextBox").css("display","");
});

function migrateMsg(){
        checkSelection =[];
        localStorage.removeItem("csvName");
    var _len = $("input[name=channelSelect]:checked").length;
	if(_len != 0){
         $.each($("input[name=channelSelect]:checked"), function() {
           
    	var obj =  {
        "fromCloudId": {
            "id": localStorage.multiUsrSrcCldId
        },
        "toCloudId": {
            "id": localStorage.multiUsrDstnCldId
        },
        "fromRootId": $(this).attr('id'),
        "toRootId": "/",
        "channelDate": $(this).attr('channeldate'),
		"channelName":$(this).attr('channelname'),
		"channelType":$(this).attr('channeltype'),
		"workSpaceName":$(this).attr('workspacename'),
		"destChannelName":$(this).attr('destchannelname'),
		"destTeamName":$(this).attr('destteamname'),
		"migrateAsSubChannel":JSON.parse($(this).attr('subchannel')), 
			
    };
        checkSelection.push(obj);
     	   });
   	 }
	 $.ajax({
        type: "POST",
		async:false,
        url: apicallurl + "/messagemove/create/messagemove/custom",
        data: JSON.stringify(checkSelection),
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
			setTimeout(function(){
           window.location.href = "reports.html#slack"; 
			},1000);
            }
	 });
}
function getSlackReports(){

	 $.ajax({
        type: "GET",
        url: apicallurl + "/messagemove/list/workspaces?&pageSize=30&pageNo=1&isAscen=false&orderField=createdTime",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
			$("#channelsTable table tbody").html('');
			$("#channelsTable p").css('display','none');
			if(data.length == 0){
					setTimeout(function () { 
                    $('#CFShowLoading').hide();
                  
                }, 1000);
			}
			else{
			
			var pubCount = 0,pvtCount=0;
			var prStat = {
			"NOT_PROCESSED" : "In Queue",
			"IN_PROGRESS" : "In Progress",
			"PROCESSED" : "Processed",
			"SUSPENDED" : "Suspended",
			"PROCESSED_WITH_SOME_CONFLICTS":"Processed With Some Conflicts"
			};
			for (var i =0;i<data.length;i++){
				
				var processStat = data[i].processStatus;
		var _html = '<tr fromRootId="'+data[i].id+'"  id="'+data[i].id+'" channeltype="'+data[i].channelType+'" channelname="'+data[i].channelName+'" channeldate="'+data[i].channelDate+'"><td style="display: flex;"><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>'+data[i].channelName+'</td><td>'+data[i].workSpaceName+'</td><td>'+data[i].channelType+'</td><td>'+prStat[processStat]+'</td><td><i class="lnil lnil-download" id="slackChannelReport" style="color:#0062ff;margin-left: 5%;font-size: 16px;font-weight: bold;"></i></td></tr>';
		$("#channelsTable table tbody").append(_html);
		if(data[i].channelType == "public"){
			pubCount++; 
		}
		else{
			pvtCount++;
		}
		}
			setTimeout(function () { 
                    $('#CFShowLoading').hide();
                  
                }, 1000);
			}
            }
	 });
}
$("#dropPubPvt a").click(function(){
$("#dropPubPvt").css('display',''); 
 var input, filter, table, tr, td, i, txtValue;
 if($(this).text().toLowerCase() == "public"){
	   filter = "public";
	   $(".fa-check-circle.public").css("display","");
	$(".fa-check-circle.private").css("display","none");
	   $(".fa-check-circle.all").css("display","none");
 }
 else if($(this).text().toLowerCase() == "private"){
  filter = "private";
	   $(".fa-check-circle.private").css("display","");
	   $(".fa-check-circle.public").css("display","none");
	   $(".fa-check-circle.all").css("display","none");
}
else{
	filter = "all";
	$(".fa-check-circle.public").css("display","none");
	$(".fa-check-circle.private").css("display","none");
	   $(".fa-check-circle.all").css("display","");
}
  tr = $("#channelsTable table tbody tr")
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
	  if(filter == "all"){
		tr[i].style.display = "";
	  }
      else if (txtValue.indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
	
});

$(document).on('click','.fa-search',function(){
	
    if(!$(".searchTextBox").val().length)
        return false;
	if($(".searchTextBox").attr("placeholder") == "Enter Channel Name"){
 if($(".searchTextBox").val().length){
		var value = $(".searchTextBox").val();
		   $("#channelsTable table tr").each(function(index) {
        if (index !== 0) {

            $row = $(this);

            var id = $row.find("td:eq(1)").text();

            if (id.indexOf(value) !== 0) {
                $row.hide();
            }
            else {
                $row.show();
            }
        }
    });
		
    }	
	}
	else
    userSearch($(".searchTextBox").val().trim());
});
$(document).find(".searchTextBox").keyup(function(e){
	if($(this).attr("placeholder") == "Enter Channel Name"){
	    if($(this).val().length == 0){
			pageNumb=1;
        slackChannels();
    }
    if( e.which == 13){	
    if($(this).val().length){
		var value = $(this).val();
		   $("#channelsTable table tr").each(function(index) {
        if (index !== 0) {

            $row = $(this);

            var id = $row.find("td:eq(1)").text();

            if (id.indexOf(value) !== 0) {
                $row.hide();
            }
            else {
                $row.show();
            }
        }
    });
		
    }
	else{
		alertSuccess("Please enter value");
	}
    }
	}
	else{
    if($(this).val().length == 0){
        getSlackUsers();
    }
    if( e.which == 13){	
    if($(this).val().length){
		userSearch($(this).val());
    }
	else{
		alertSuccess("Please enter value");
	}
    }
	}
    });
function userSearch(SearchTerm,pageNo) {
    if(pageNo == undefined)
        pageNo = 1;

    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/user/autosearch/permission/list?searchMapp=" + SearchTerm + "&sourceCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destCloudId=" + localStorage.getItem("multiUsrDstnCldId") + "&pageSize=30&pageNo=" + pageNo,
        async : false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
          $("#usersTable table tbody").html(''); 
			$("#usersTable p").css('display','none');
			var pubCount = 0,pvtCount=0;
			for (var i =0;i<data.length;i++){
				if(data[i].sourceCloudDetails != null && data[i].destCloudDetails != null){
				     var _html = '<tr><td><input type="checkbox" name="userSelect" srcid="'+data[i].sourceCloudDetails.id+'" dstid="'+data[i].destCloudDetails.id+'"></td><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails == null && data[i].destCloudDetails != null)
					var _html = '<tr><td><input type="checkbox" name="userSelect" srcid="null" dstid="'+data[i].destCloudDetails.id+'"></td><td><span>-</span></td><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				else if(data[i].sourceCloudDetails != null && data[i].destCloudDetails == null)
					var _html = '<tr><td><input type="checkbox" name="userSelect" srcid="'+data[i].sourceCloudDetails.id+'" dstid="null"><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td><span>-</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
		$("#usersTable table tbody").append(_html);
		}  
		$("#mapCount").text(data.noOfMappedCloudPressent);
		$("#pubCount").css("display","none"); 
		$("#pvtCount").css("display","none");  

        } 
    });
}

$("#slackBtn").on('click',function() {
	var parentTr = $(this).parents('tr').siblings();
    $.ajax({
        type: "GET",
        url: apicallurl + "/messagemove/run/premigration?cloudId="+localStorage.getItem("multiUsrSrcCldId"),
        async : false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
			if(data == "Your Request is Already under processing"){
				alertSuccess("Your request is under processing.")
				setTimeout(function(){
					$("#slackBtn").trigger('click');
				},1000);
			}
			else{
				parentTr.children('td:eq(0)').text(data.totalUsersInWorkspace);
				parentTr.children('td:eq(1)').text(data.totalChannels);
				parentTr.children('td:eq(2)').text(data.totalPublicChannel);
				parentTr.children('td:eq(3)').text(data.totalPrivateChannel);
				parentTr.children('td:eq(4)').text(CFManageCloudAccountsAjaxCall.getObjectSizeInGB(data.totalDataSize));
				parentTr.children('td:eq(5)').text(data.totalMessageInChannel);
			}
         } 
    });
});
$("#teamBtn").on('click',function() {
	var parentTr = $(this).parents('tr').siblings();
    $.ajax({
        type: "GET",
        url: apicallurl + "/messagemove/run/premigration?cloudId="+localStorage.getItem("multiUsrDstnCldId"),
        async : false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
          if(data == "Your Request is Already under processing"){
				alertSuccess("Your request is under processing.")
				setTimeout(function(){
					$("#teamBtn").trigger('click');
				},1000);
			}
			else{
				parentTr.children('td:eq(0)').text(data.totalUsersInWorkspace);
				parentTr.children('td:eq(1)').text(data.totalChannels);
				parentTr.children('td:eq(2)').text(data.totalPublicChannel);
				parentTr.children('td:eq(3)').text(data.totalPrivateChannel);
				parentTr.children('td:eq(4)').text(data.totalTeams);
				parentTr.children('td:eq(5)').text(data.totalPublicTeams);
				parentTr.children('td:eq(6)').text(data.totalPrivateTeams);
			}
        } 
    });
});
 
$(document).on('change','#msgType_dropDown',function(){
	if($(this).find('option:selected').text() === "Team"){
		$(this).parents('tr').children('td:first').children('input').attr("subchannel","false");
	}
	else{
		$(this).parents('tr').children('td:first').children('input').attr("subchannel","true");
	}
});

$(document).on('click','#destTeamEdit',function() { 
    $(this).hide();
	var textVal = $(this).siblings('span#destTeamNameSpan').text();
	var _thisBox = $(this).siblings('span#destTeamNameSpan');
	var user_name = _thisBox.attr("title").trim();
						var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
						var userName = user_name.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
						_thisBox.css("padding","0").css("background","none").css("margin-left","0");
    _thisBox.html("<span class='editUser custom-search-input' style='float: left;width: 65%;'><input class='form-control' type='text' name='destteamname' id='teamName' value='" + userName + "' autofocus /></span>");
    $('#teamName').focus();
   
    $('input#teamName').keydown(function (event) {
        if (event.keyCode == 13) {
			       var Updatedusername = $('#teamName').val();
			if(Updatedusername.length == 0){
			alertError("Please provide valid input");
		_thisBox.text(user_name);
		 _thisBox.siblings().show();
		$("#CFShowLoading").modal("hide");
			}
			else{
			$(this).parents('tr').children('td:first').children('input').attr("destteamname",Updatedusername);
			$(this).parent().parent('span#destTeamNameSpan').attr('title',Updatedusername);
			Updatedusername = CFManageCloudAccountsAjaxCall.getMaxChars(Updatedusername, 30);
			_thisBox.text(Updatedusername);
			userName = Updatedusername;
_thisBox.siblings().show(); 		 	
			}
        }
    }); 
    $('body').on('mouseup', function (e) {
        var container = _thisBox;
        if (!container.is(e.target) && container.has(e.target).length === 0) {     
		userName = CFManageCloudAccountsAjaxCall.getMaxChars(userName, 25);
            _thisBox.text(userName);
        _thisBox.siblings().show(); 
            $('body').off('mouseup');
        }
    });
});

$(document).on('click','#destChannelEdit',function() { 
    $(this).hide();
	var textVal = $(this).siblings('span#destChannelNameSpan').text();
	var _thisBox = $(this).siblings('span#destChannelNameSpan');
	var user_name = _thisBox.attr("title").trim();
						var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
						var userName = user_name.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
						_thisBox.css("padding","0").css("background","none").css("margin-left","0");
    _thisBox.html("<span class='editUser custom-search-input' style='float: left;width: 65%;'><input class='form-control' type='text' name='destchannelname' id='channelsName' value='" + userName + "' autofocus /></span>");
    $('#channelsName').focus();
   
    $('input#channelsName').keydown(function (event) {
        if (event.keyCode == 13) {
			       var Updatedusername = $('#channelsName').val();
			if(Updatedusername.length == 0){
			alertError("Please provide valid input");
		_thisBox.text(user_name);
		 _thisBox.siblings().show();
		$("#CFShowLoading").modal("hide");
			}
			else{
				$(this).parents('tr').children('td:first').children('input').attr("destchannelname",Updatedusername);
			$(this).parent().parent('span#destChannelNameSpan').attr('title',Updatedusername);
			Updatedusername = CFManageCloudAccountsAjaxCall.getMaxChars(Updatedusername, 25);
			_thisBox.text(Updatedusername);
			userName = Updatedusername;
_thisBox.siblings().show();			
			}
        }
    });
    $('body').on('mouseup', function (e) {
        var container = _thisBox;
        if (!container.is(e.target) && container.has(e.target).length === 0) {  		
		userName = CFManageCloudAccountsAjaxCall.getMaxChars(userName, 30);
            _thisBox.text(userName); 
        _thisBox.siblings().show(); 
            $('body').off('mouseup');
        }
    });
});

$(document).on('click','#slackChannelReport',function(){
        downloadChannelReport($(this).parents("tr").attr('id'));
});
function downloadChannelReport(wid){
    $.ajax({
        type: "GET",
        url: apicallurl + "/messagemove/download/messagechannelreport/" + wid,
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
                link.download = 'slack_workspace_report_' + wid + '.csv';
                document.body.appendChild(link);
                link.setAttribute("type", "hidden");
                link.click();
            }
            else if (xhr.status == 202) {
                alertSuccess("Report is in Progress,will be ready in few minutes");
            }
        }
    });
}
$(document).on('click','#slackSummaryReport',function(){
        downloadSummaryReport(localStorage.UserId);
});
function downloadSummaryReport(userid){
    $.ajax({
        type: "GET",
        url: apicallurl + "/messagemove/download/messagesummaryreport/" + userid,
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
                link.download = 'slack_summary_report_' + userid + '.csv';
                document.body.appendChild(link);
                link.setAttribute("type", "hidden");
                link.click();
            }
            else if (xhr.status == 202) {
                alertSuccess("Report is in Progress,will be ready in few minutes");
            }
        }
    });
}

$('#csvUsersUpload').click(function() {
    sendGAEvents("clicked on CSV upload icon");
    document.getElementById("csvUserFile").value = "";
    $('#csvUserFile').click();
});

function csvFileUpload(){
			deleteMapping(); 
	   var upload = document.getElementById('csvUserFile').files[0];
    var reader = new FileReader();
    reader.onload = function() {
        sessionStorage.setItem('result',reader.result);
   csvUsersUpld(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), reader.result);
    };
    reader.readAsText(upload);
}


function csvUsersUpld(_srcMapdCldId,_dstnMapdCldId,_fileContent) {
	$.ajax({
        type: "POST",
        data:_fileContent,
        url: apicallurl + "/messagemove/message/user/manualmapping/csv?sourceCloudId="+localStorage.multiUsrSrcCldId+"&destCloudId="+localStorage.multiUsrDstnCldId,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),  
        },
        success: function (data, textStatus, xhr) {
            console.log(data);
			$("#usersTable table tbody").html('');
			$("#usersTable p").css('display','none');
			var pubCount = 0,pvtCount=0;
			for (var i =0;i<data.length;i++){
				if(data[i].sourceCloudDetails != null && data[i].destCloudDetails != null){
					pubCount++;
					var _html = '<tr><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td style=""><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails == null && data[i].destCloudDetails != null){
					pvtCount++;
					var _html = '<tr><td><span>-</span></td><td style=""><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">'+data[i].destCloudDetails.emailId+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
				}
				else if(data[i].sourceCloudDetails != null && data[i].destCloudDetails == null){
					pvtCount++;
					var _html = '<tr><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">'+data[i].sourceCloudDetails.emailId+'</span></td><td><span>-</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="'+data[i].sourceCloudDetails.id+'" destid="'+data[i].destCloudDetails.id+'"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
		
				}$("#usersTable table tbody").append(_html);
		}  
		$("#mapCount").text(data[0].noOfMappedCloudPressent);
		$("#pubDiv").text("Matched : "); 
		$("#pvtDiv").text("Unmatched : ");
		$("#pubCount").text(pubCount); 
		$("#pvtCount").text(pvtCount);
		$("#selDiv").css("display","none");
		$("#selCount").text('00');		
}
	})
}

$("#clearBtn").click(function(){
	deleteMapping();
});

$(document).on('click','.closeBtn',function(){
	var _tr = $(this).parents("tr");
	srcUserId = $(this).attr("srcid");
	destUserId = $(this).attr("destid");
	$.ajax({
        type: "GET",
		async:false,
        url: apicallurl + "/messagemove/user/clouds/deletesingle/permissionsreport?sourceCloudId="+localStorage.multiUsrSrcCldId+"&destCloudId="+localStorage.multiUsrDstnCldId+"&sourceUserCloudId="+srcUserId+"&destUserCloudId="+destUserId,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
			console.log("deleted");  
			$(_tr).remove("");		  
}
	})
}); 

function deleteMapping() {
	$.ajax({
        type: "GET",
		async:false,
        url: apicallurl + "/messagemove/user/clouds/delete/permissionsreport?sourceCloudId="+localStorage.multiUsrSrcCldId+"&destCloudId="+localStorage.multiUsrDstnCldId,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
			console.log("deleted");  
			$("#usersTable table tbody").html('');		  
}
	})
}