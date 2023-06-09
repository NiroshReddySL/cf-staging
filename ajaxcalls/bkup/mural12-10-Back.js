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
//    $("#forNextMove").addClass("disabled");
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
	$("#muralJobOptions").css("display","none");
	$("#muralPreMigrationAnalysis").css("display","none");
    }    else if(_step == 2){
	$("#muralPreMigrationAnalysis").css("display","");
        localStorage.setItem("multiUsrSrcCldName",$('#srcClouds input[name=sourceCloud]:checked').attr("cloudname"));	
	localStorage.setItem("multiUsrDstnCldName",$('#dstClouds input[name=dstCloud]:checked').attr("cloudname"));
	localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr("id"));
        localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr("id"));
        localStorage.setItem("multiUsrDstnEmail",$('#dstClouds input[name=dstCloud]:checked').attr("mail"));
        localStorage.setItem("multiUsrSrcEmail",$('#srcClouds input[name=sourceCloud]:checked').attr("mail"));
        $("#migrationOptions").css("display","none");
	$("#muralJobOptions").css("display","none");
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
        var $srcChkd = $('#srcClouds input[name=sourceCloud]:checked'),$dstChkd = $('#dstClouds input[name=dstCloud]:checked');
        var _cldDtls ={
            srcCldName   : $($srcChkd).siblings('.migrateImg').children().attr('id'),
            dstCldName   : $($dstChkd).siblings('.migrateImg').children().attr('id'),
            srcAdminName : CFManageCloudAccountsAjaxCall.getMaxChars($($srcChkd).parent().siblings().find("h5").text(),20),
            dstAdminName :  CFManageCloudAccountsAjaxCall.getMaxChars($($dstChkd).parent().siblings().find("h5").text(),20)
        };    
        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
        }
	 else if(_step == 3){
        var orgName = CFManageCloudAccountsAjaxCall.getMaxChars(localStorage.MirowebUrl,10)
	$('.sourceWorkspaceTitle').eq('1').html(orgName+' Organization')
	$('.sourceWorkspaceTitle').eq('1').attr('title',localStorage.MirowebUrl+' Organization')
	$('#appendWorkSpaceData').html('')
	$('#appendWorkspaces').html('')
	$("#miroAppendWorkspaces").html('');
        getBoards();
	getWorkSpaceMiro();
       	$("#mappingPreMigration").css("display","");
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
	$("#forNextMove").addClass("disabled");
	//$("#forNextMove").css({"width": "140px", "margin-left": "90%"});
        $("#forNextMove span").text("Next");
	$("#migrationOptions").css("display","none");
	$("#muralJobOptions").css("display","none");
    }else if(_step == 4){
$("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
	$("#mappingPreMigration").css("display","none");
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
	$("#muralJobOptions").css("display","");
	selectedBoards = [];
var _len = $("input[id=boardLevel]:checked").length;
	console.log(_len)
	if (_len != 0) {
		 $.each($("input[id=boardLevel]:checked"), function () {
		 	var obj =  {
		 		userId: localStorage.getItem('UserId'),
		 		fromCloudId: localStorage.getItem('multiUsrSrcCldId'),
		 		fromCloudName: localStorage.getItem('multiUsrSrcCldName'),
		 		toCloudId: localStorage.getItem('multiUsrDstnCldId'),
		 		toCloudName: localStorage.getItem('multiUsrDstnCldName'),
		 		fromMailId: localStorage.getItem('multiUsrSrcEmail'),
		 		toMailId: localStorage.getItem('multiUsrDstnEmail'),
		 		fromBoardId: $(this).attr('fromboardid'),
		 		authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
		 		sourceBoardName: $(this).attr('sourceboardname')
		 	}
		 	selectedBoards.push(obj);
		 })
	}
	localStorage.setItem('SelectedObject',JSON.stringify(selectedBoards))
    $("#forNextMove").css({"width": "140px", "margin-left": "90%"});
    $("#forNextMove span").text("Start Migration");
    }
    else if(_step == 5){
	migrateBoards()
	alertSuccess('Migration Initated Succesfully');
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
        $("#muralPreMigrationAnalysis").css("display","none");
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
	$("#muralJobOptions").css("display","none");
    }
    else if(_step == 2){
	$("#muralJobOptions").css("display","none");
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
$("#mappingPreMigration").css("display","none");
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
        
        if(_step < 4){
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

$(document).on('click','#appendWorkSpaceData',function(){
if($('#appendWorkSpaceData').find('input:checked').length > 0){
$("#forNextMove").removeClass("disabled");
}else{
$("#forNextMove").addClass("disabled");
}
})




$(document).on('click','#openDiv',function(){
$(this).addClass('lnil-chevron-up-circle');
$(this).attr('id','closeDiv');
var folderId = $(this).attr('folderid');
getBoardsFolder(folderId,1);
$('#appendBoards'+folderId).html('');
})

function getBoardsFolder(folderId,pgNo,nxToken){
var userId = localStorage.getItem('UserId');
var cloudId = localStorage.getItem('multiUsrSrcCldId');

if(nxToken === undefined || nxToken === null || nxToken === 'undefined' || nxToken === 'null'){
 var uri = apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId="+folderId+"&page_nbr="+pgNo+"&page_size=20"
}else{
 var uri = apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId="+folderId+"&page_nbr="+pgNo+"&page_size=20&nextPreviousId="+nxToken;
}
 $.ajax({
            type: "GET",
            url : uri, 
	    //url: apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId="+folderId+"&page_nbr="+pgNo+"&page_size=20",
            aync : false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
	 success: function(data){
	if(data.length === 0){
	console.log('Here')
	return null;
	}
	for(let i =0;i< data.length;i++){
	if(data[i].nextPageToken === null || data[i].nextPageToken === undefined || data[i].nextPageToken === "null" || data[i].nextPageToken === "undefined"){
	console.log('Ended')
	localStorage.removeItem('boardNXToken');
	}else{
	localStorage.setItem('boardNXToken',data[i].nextPageToken)
	}
	var _data = data[i];
	 $('#appendBoards'+folderId).append(
	'<tr><td style="padding: 5px;"><input type="checkbox" id="boardLevel" fromBoardId="'+_data.id+'" sourceBoardName="'+_data.objectName+'" parentBid="'+_data.parent+'"></td>'+
'<td>'+_data.objectName+'</td><td>'+_data.objectName+'</td></tr>'	
)
}
if(data.length > 0){
$('#showData'+folderId).css('display','');
}
if(data.length === 20 && (localStorage.boardNXToken !== undefined || localStorage.boardNXToken !== null || localStorage.boardNXToken !== "undefined" || localStorage.boardNXToken !== "null")){
pgNo = pgNo + 1;
getBoardsFolder(folderId,pgNo,localStorage.boardNXToken)
}
}
})

}

function getWorkSpaceMiro() {
      var userId = localStorage.getItem("UserId");
      var cloudId = localStorage.getItem("multiUsrDstnCldId");
      var pgNo = 1;
      $.ajax({
        type: "GET",
        url:
          apicallurl +
          "/boardservice/miro/userId/" +
          userId +
          "/cloudId/" +
          cloudId +
          "?folderId=/&page_nbr=" +
          pgNo +
          "&page_size=20",
        aync: false,
        headers: {
          "Content-Type": "application/json",
          Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        },
        success: function (data) {
          if (pgNo === 1) {
            $("#miroAppendWorkspaces").html("");
          }
          for (let i = 0; i < data.length; i++) {
            var _data = data[i];
	    var wid = _data.id;
	    var appendID = wid.replaceAll('/','_')
            $("#miroAppendWorkspaces").append(
              '<div class="row justify-content-start muralWorkspaces"><div class="col-2 my-auto text-center">' +
                '<i class="lnil lnil-chevron-down-circle" style="color: #0062ff;cursor:pointer;" id="openProject" wid="' +
                _data.id +
                '"></i>' +
                '</div><div class="col-7 my-auto"><span style="margin-left: -20px" title="' +
                _data.objectName +
                '">' +
                CFManageCloudAccountsAjaxCall.getMaxChars(_data.objectName,20)+
                "</span></div>" +
                '<div class="col-1 my-auto" id="hierachyIndicator" style="margin-left: 17px;">Team</div></div><hr class="hratopenWorkspace" id="hr' +
                 appendID +
                '" style="display: none"/><div id="viewRoom'+appendID+'" style="display:none;"></div>'
            );
          }
        },
      });
    }

$(document).on('click','.lnil-chevron-up-circle',function(){
$(this).removeClass('lnil-chevron-up-circle').addClass('lnil-chevron-Down-circle')
var folderId = $(this).attr('folderid');
$('#showData'+folderId).css('display','none');
$('#appendBoards'+folderId).html('');
$(this).attr('id','openDiv');
})


      function getBoards() {
      var userId = localStorage.getItem("UserId");
      var cloudId = localStorage.getItem("multiUsrSrcCldId");
      var pgNo = 1;
      if(localStorage.multiUsrSrcCldName === "MURAL_STAGING"){
          var uri = apicallurl +"/boardservice/userId/staging/" +userId +"/cloudId/" +cloudId +"?folderId=/&page_nbr=" +pgNo +"&page_size=20";
        }else{
          var uri = apicallurl +"/boardservice/userId/" +userId +"/cloudId/" +cloudId +"?folderId=/&page_nbr=" +pgNo +"&page_size=20";

      }
      $.ajax({
        type: "GET",
        url:uri,
        aync: false,
        headers: {
          "Content-Type": "application/json",
          Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        },
        success: function (data) {
          if (pgNo === 1) {
            $("#appendWorkspaces").html("");
          }
          for (let i = 0; i < data.length; i++) {
            var _data = data[i];
            $("#appendWorkspaces").append(
              '<div class="row justify-content-start muralWorkspaces" id="workspace' +
                _data.id +
                '">' +
                '<div class="col-2 my-auto text-center"><i class="lnil lnil-chevron-down-circle" style="color: #0062ff;cursor:pointer;" id="openRooms" wid="' +
                _data.id +
                '"></i></div>' +
                '<div class="col-7 my-auto"><span style="margin-left: -20px;text-overflow: ellipsis;" title="' +
                _data.objectName +
                '">' +
                _data.objectName +
                '</span></div>' +
                '<div class="col-1 my-auto" id="hierachyIndicator" style="margin-left: -12px;">Workspace</div></div>' +
                '<hr class="hratopenWorkspace" id="hr' +
                _data.id +
                '" style="display: none"/>'+
		'<div id="viewRoom'+_data.id+'" style="display:none;"></div>'
            );
          }
        },
      });
    }

$(document).on('click','#selectAllBoards',function(){
	var parentId = $(this).attr('boardid');
	if($(this).is(':checked')){
	$('[parentbid='+parentId+']').prop('checked',true);
	}else{
	$('[parentbid='+parentId+']').prop('checked',false);
	}

})


// TO Open Room
    $(document).on("click", "#openRooms", function () {
      // alert($(this).attr("wid"));
      var wid = $(this).attr("wid");
      getMuralRooms(wid)
      $(`#hr${wid}`).css("display", "");
      $(`#viewRoom${wid}`).css("display", "");
      $(this)
        .addClass("lnil-chevron-up-circle")
        .removeClass("lnil-chevron-down-circle");
      $(this).attr("id", "closeRoom");
      $(this).parent().parent().addClass("openWorkSpace");
    });
    //To Close Room
    $(document).on("click", "#closeRoom", function () {
      var wid = $(this).attr("wid");
      $(`#hr${wid}`).css("display", "none");
      $(`#viewRoom${wid}`).css("display", "none");
      $(this)
        .addClass("lnil-chevron-down-circle")
        .removeClass("lnil-chevron-up-circle");
      $(this).attr("id", "openRooms");
      $(this).parent().parent().removeClass("openWorkSpace");
    });
    // To open Mural Folders
    $(document).on("click", "#openRoomsMural", function () {
      var roomId = $(this).attr('rid');
       var appendID = roomId.replaceAll('/','_')
      $(this).attr("id", "closeRoomMural");
      $(this).find("i").addClass("fa-folder-open").removeClass("fa-folder");
      $("#showFolders"+appendID).css("display", "");
      getMuralFolders(roomId);
    });
    //TO close Mural Folders
    $(document).on("click", "#closeRoomMural", function () {
      var roomId = $(this).attr('rid');
      var appendID = roomId.replaceAll('/','_')
      $(this).attr("id", "openRoomsMural");
      $(this).find("i").addClass("fa-folder").removeClass("fa-folder-open");
      $("#showFolders"+appendID).css("display", "none");
    });
    $(document).on("click", "#openProject", function () {
      // alert($(this).attr("wid"));
      var wid = $(this).attr("wid");
      var appendID = wid.replaceAll('/','_');
      getMiroProjects(wid);
      $(`#hr${appendID}`).css("display", "");
      $(`#viewRoom${appendID}`).css("display", "");
      $(this)
        .addClass("lnil-chevron-up-circle")
        .removeClass("lnil-chevron-down-circle");
      $(this).attr("id", "closeProject");
      $(this).parent().parent().addClass("openOrganization");
    });
    $(document).on("click", "#closeProject", function () {
      $('[name="salescheck"]').click()
	$("#forNextMove").addClass("disabled");
      // alert($(this).attr("wid"));
      var wid = $(this).attr("wid");
      var appendID = wid.replaceAll('/','_')
      $(`#hr${appendID}`).css("display", "none");
      $(`#viewRoom${appendID}`).css("display", "none");
      $(this)
        .addClass("lnil-chevron-down-circle")
        .removeClass("lnil-chevron-up-circle");
      $(this).attr("id", "openProject");
      $(this).parent().parent().removeClass("openOrganization");
    });
	
   function getMiroProjects(wid) {
      var userId = localStorage.getItem("UserId");
      var cloudId = localStorage.getItem("multiUsrDstnCldId");
      var pgNo = 1;
      $.ajax({
        type: "GET",
        url:
          apicallurl +
          "/boardservice/miro/userId/" +
          userId +
          "/cloudId/" +
          cloudId +
          "?folderId="+wid+"&page_nbr=" +
          pgNo +
          "&page_size=20",
        aync: false,
        headers: {
          "Content-Type": "application/json",
          Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        },
        success: function (data) {
	  var appendID = wid.replaceAll('/','_')
          if (pgNo === 1) {
            $("#viewRoom"+appendID).html("");
          }
          for (let i = 0; i < data.length; i++) {
            var _data = data[i];
		//id="openBoardMiro"
            $("#viewRoom"+appendID).append('<div class="row justify-content-start"><div class="col-8 my-auto text-center" rid="'+_data.id+'">'+
'<input type="radio" name="salescheck" id="" style="margin-left: -109px;margin-top:6px;"/><!--<i class="fa fa-caret-right" aria-hidden="true" style="margin-left: 5px"></i>-->'+
'<span style="font-size: 14px; margin-left: 7px;margin-top: 0px;position: absolute;" title="'+_data.objectName+'">'+CFManageCloudAccountsAjaxCall.getMaxChars(_data.objectName,16)+'</span></div>'+
'<div class="col-2 my-auto" style="margin-left: 40px" id="hierachyIndicator">Project</div></div>');
  $('[name="salescheck"]').click()
          }
        },
      });
    }

   function getMuralRooms(wid) {
      var userId = localStorage.getItem("UserId");
      var cloudId = localStorage.getItem("multiUsrSrcCldId");
      var pgNo = 1;
      if(localStorage.multiUsrSrcCldName === "MURAL_STAGING"){
        var uri = apicallurl +"/boardservice/userId/staging/" +userId +"/cloudId/" +cloudId +"?folderId="+wid+"&page_nbr=" +pgNo +"&page_size=20";
      }else{
        var uri = apicallurl +"/boardservice/userId/" +userId +"/cloudId/" +cloudId +"?folderId="+wid+"&page_nbr=" +pgNo +"&page_size=20";
      }
      $.ajax({
        type: "GET",
        url: uri,
        aync: false,
        headers: {
          "Content-Type": "application/json",
          Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        },
        success: function (data) {
          if (pgNo === 1) {
            $("#viewRoom" + wid).html("");
          }
          for (let i = 0; i < data.length; i++) {
            var _data = data[i];
	    var appendID = _data.id;
	    appendID = appendID.replaceAll('/','_')
            $("#viewRoom" + wid).append(
              '<div class="row justify-content-start" id="roomsBody"><div class="col-10 my-auto text-center" style="cursor:pointer;" id="openRoomsMural" rid="' +
                _data.id +
                '">' +
                '<i class="fa fa-folder" aria-hidden="true"></i><span style="font-size: 14px; margin-left: 5px;text-overflow: ellipsis;" title="' +
                _data.objectName +
                '">' +
                _data.objectName +
                "</span></div>" +
                '<div class="col-1 my-auto" id="hierachyIndicator" style="margin-left: -12px;">Room</div></div><div id="showFolders'+appendID+'" style="display:none;"></div>'
            );
          }
        },
      });
    }
    function getMuralFolders(roomId,pgNo,folderNxToken) {
          var userId = localStorage.getItem("UserId");
          var cloudId = localStorage.getItem("multiUsrSrcCldId");
          if(pgNo === undefined) pgNo = 1;
          if(localStorage.multiUsrSrcCldName === "MURAL_STAGING"){
            if(folderNxToken === undefined || pgNo === 1){
                var uri = apicallurl +"/boardservice/userId/staging/"+userId+"/cloudId/"+cloudId+"?folderId="+roomId+"&page_nbr="+pgNo+"&page_size=20"
                   }else{
                var uri = apicallurl +"/boardservice/userId/staging/"+userId+"/cloudId/"+cloudId+"?folderId="+roomId+"&page_nbr="+pgNo+"&page_size=20&nextPreviousId="+folderNxToken;
               }
          }else{
	  if(folderNxToken === undefined || pgNo === 1){
	   var uri = apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId="+roomId+"&page_nbr="+pgNo+"&page_size=20"
          }else{
	   var uri = apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId="+roomId+"&page_nbr="+pgNo+"&page_size=20&nextPreviousId="+folderNxToken;
	  }
    }
          $.ajax({
            type: "GET",
            url: uri,
            aync: false,
            headers: {
              "Content-Type": "application/json",
              Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
            },
            success: function (data) {
	      var appendID = roomId.replaceAll('/','_')
              if (pgNo === 1) {
                $("#showFolders" + appendID).html("");
              }
              for (let i = 0; i < data.length; i++) {
                if(data[i].nextPageToken === null || data[i].nextPageToken === undefined || data[i].nextPageToken === "null" || data[i].nextPageToken === "undefined"){
                    console.log('Ended')
                    localStorage.removeItem('muralBoardNXToken');
                    }else{
                    localStorage.setItem('muralBoardNXToken',data[i].nextPageToken)
                    }
                var _data = data[i];
                $("#showFolders" + appendID).append('<div class="row justify-content-center" id="viewMural"><div class="col-10 my-auto text-center">'+
    '<span class="selectMuralSPAN"><input type="checkbox" id="boardLevel" fromBoardId="'+_data.id+'" sourceBoardName="'+_data.objectName+'" parentBid="'+_data.parent+'"><span title="'+_data.objectName+'">'+_data.objectName+'</span></span></div>'+
    '<div class="col-2 my-auto" id="hierachyIndicator" style="margin-left: -12px;">Mural</div></div>');
              }
	     if(data.length === 20 && (localStorage.muralBoardNXToken !== null)){
		var pageNo = Number(pgNo);
		pageNo = pageNo + 1;
		getMuralFolders(roomId,pageNo,localStorage.muralBoardNXToken)
		}
            },
          });
        }
function migrateBoards() {
    $.ajax({
    type: "POST",
    async: false,
    url: apicallurl+"/boardservice/initiate/migration",
    data: localStorage.SelectedObject,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
    alert();
    window.location.href = "reports.html#mural";
}
})

}


function getMuralReports(pgNo){
//var pgNo = 1;
var userId = localStorage.getItem('UserId');
var moveStatus = {
        "PROCESSED": "Processed",
        "IN_PROGRESS": "In Progress",
        "NOT_PROCESSED": "In queue",
		"NOT_STARTED": "In queue",
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
        "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE":"Processed With Some Conflicts and Pause",
        "PROCESSED_WITH_SOME_PAUSE":"Processed With Some Pause"
    };
$.ajax({
type: "GET",
            url: apicallurl +"/boardservice/migration/get/workspaces/"+userId+"?page_nbr="+pgNo+"&page_size=50",
            aync : false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
	   success: function(data){
	   if(Number(pgNo) === 1){
	   $('#muralReportsTable').html('');
	   }
	   console.log(data)
	   for(let i=0; i < data.length;i++){
		var _data = data[i];
		var jobStatus = moveStatus[_data.processStatus];	   
        if(_data.processStatus === "PROCESSED_WITH_SOME_CONFLICTS" || _data.processStatus === "PROCESSED"){
            var downloadMuralWorkspace = '<i class="lnil lnil-download" id="downloadMuralWorkspaceReports" style="color:#0062ff;font-size: 16px;font-weight: bold;" worspaceId='+_data.id+'></i>'
        }else{
            var downloadMuralWorkspace = '<i class="lnil lnil-download" id="downloadMuralWorkspaceReports" style="opacity:0.4;pointer-events:none;color:#0062ff;font-size: 16px;font-weight: bold;" worspaceId='+_data.id+'></i>'
        }
		$('#muralReportsTable').append(
                 '<tr><td>'+_data.sourceBoardName+'</td><td>'+_data.destBoardName+'</td><td>'+_data.totalWidgets+'</td><td>'+_data.processedCount+'</td><td>'+_data.conflictCount+'</td><td class='+_data.processStatus+'>'+jobStatus +'</td><td style="text-align:center;">'+downloadMuralWorkspace+'</td></tr>'
		);
	   }
	   if(data.length === 50){
	   var pgno = Number(pgNo)
	   pgno = pgno + 1;
	   getMuralReports(pgno)
	   }
}
})
setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
}

$(document).on('click','#boardLevel,[name="salescheck"]',function(){
 if($('[id="boardLevel"]:checked').length > 0 && $('[name="salescheck"]:checked').length > 0){
	$("#forNextMove").removeClass("disabled");
}else{
$("#forNextMove").addClass("disabled");
}
})

$(document).on('click','#muralSummaryReport',function(){
getMuralCSV();
})


function getMuralCSV() {
  console.log("CSVDOWNLOAD");
  var csv_data = [];
  var headForCsv = [
    "Source Board Name",
    "Destination Board Name",
    "Total Widgets",
    "Processed Widgets",
    "Conflict Widgets",
    "Status",
  ];
  var csvrow = [];
  for (var m = 0; m < headForCsv.length; m++) {
    csvrow.push(headForCsv[m]);
  }
  csv_data.push(csvrow.join(","));
  var tablediv = document.getElementById('directMsgsTable')
  var tablebody = $("#muralReports table tbody")
  var rows = $("#muralReports table tbody tr");
			for (var i = 0; i < rows.length; i++) {
				var cols = rows[i].querySelectorAll('td,th');
				var csvrow = [];
				for (var j = 0; j < cols.length; j++) {
				    if(j === 6){
                      continue;
                      }
					csvrow.push(cols[j].innerHTML);
				}
				csv_data.push(csvrow.join(","));
			}
			csv_data = csv_data.join('\n');
  downloadDMSCSVFile(csv_data);
}
function downloadDMSCSVFile(csv_data) {
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });
  var temp_link = document.createElement("a");
  temp_link.download = "Mural_Report.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);
  temp_link.click();
  document.body.removeChild(temp_link);
}

$(document).on("click","#downloadMuralWorkspaceReports",function(){
    var worspaceId = $(this).attr("worspaceId")
    $.ajax({
        type: "GET",
        url: apicallurl + "/boardservice/download/migrationreport/"+worspaceId,
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
                link.download = 'Mural_workspace_report_' + worspaceId + '.csv';
                document.body.appendChild(link);
                link.setAttribute("type", "hidden");
                link.click();
            }
            else if (xhr.status == 202) {
                alertSuccess("Report is in Progress,will be ready in few minutes");
            }
        }
    });
})