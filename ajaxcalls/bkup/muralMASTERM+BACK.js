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
	$('#appendWorkSpaceData').html('')
	localStorage.setItem("multiUsrSrcCldName",$('#srcClouds input[name=sourceCloud]:checked').attr("cloudname"));	
	localStorage.setItem("multiUsrDstnCldName",$('#dstClouds input[name=dstCloud]:checked').attr("cloudname"));
	localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr("id"));
        localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr("id"));
        localStorage.setItem("multiUsrDstnEmail",$('#dstClouds input[name=dstCloud]:checked').attr("mail"));
        localStorage.setItem("multiUsrSrcEmail",$('#srcClouds input[name=sourceCloud]:checked').attr("mail"));
        getBoards();
	
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
	$("#forNextMove").addClass("disabled");
	$("#forNextMove").css({"width": "140px", "margin-left": "90%"});
        $("#forNextMove span").text("Start Migration");

    }
    else if(_step == 3){
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


$(document).on('click','.lnil-chevron-up-circle',function(){
$(this).removeClass('lnil-chevron-up-circle').addClass('lnil-chevron-Down-circle')
var folderId = $(this).attr('folderid');
$('#showData'+folderId).css('display','none');
$('#appendBoards'+folderId).html('');
$(this).attr('id','openDiv');
})


function getBoards(){
var userId = localStorage.getItem('UserId');
var cloudId = localStorage.getItem('multiUsrSrcCldId');
var pgNo = 1;
 $.ajax({
            type: "GET",
            url: apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId=/&page_nbr="+pgNo+"&page_size=20",
            aync : false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
	    success: function(data){
	   for(let i =0;i< data.length;i++){
		var _data = data[i];
	     $('#appendWorkSpaceData').append(
'<div class="row" style="margin-top: 2px;border: 1px solid #c7c7c7;border-radius: 5px;padding: 5px;">'+
'<div class="col" style="padding: 5px;"><span style="float: left;margin-left: 20px;">'+
'<i class="lnil lnil-chevron-down-circle" clName='+_data.cloudName+' type='+_data.type+' folderId='+_data.id+' style="color: #0062FF;font-size: 20px;font-weight:600;margin-top:8px;cursor: pointer;" id="openDiv"></i>'+
'</span><span style="margin-left:20px;"><img src="../img/mural50x50.png" style="height: 20px;width: 20px;margin-right: 2%;border-radius: 50%;">'+
'<span>'+_data.objectName+'</span></span></div><div class="row" id="showData'+_data.id+'" style="display: none"><hr style="width: 95%;"/>'+
'<table style="padding: 5px;width: 94%;margin-top: 15px;margin-left: 49px;">'+
'<thead><tr style="background-color: #0062ff;color: #ffffff"><th style="padding: 5px;"><input type="checkbox" id="selectAllBoards" boardId="'+_data.id+'"></th>'+
'<th>Source Board Name</th><th>Destination Board Name</th></tr></thead><tbody id="appendBoards'+_data.id+'"></tbody></table></div></div>'	
	)
}
            }
})
}


$(document).on('click','#selectAllBoards',function(){
	var parentId = $(this).attr('boardid');
	if($(this).is(':checked')){
	$('[parentbid='+parentId+']').prop('checked',true);
	}else{
	$('[parentbid='+parentId+']').prop('checked',false);
	}

})


function migrateBoards() {
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
	console.log(selectedBoards)
	$.ajax({
    type: "POST",
    async: false,
    url: apicallurl+"/boardservice/initiate/migration",
    data: JSON.stringify(selectedBoards),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
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
		$('#muralReportsTable').append(
                 '<tr><td>'+_data.sourceBoardName+'</td><td>'+_data.destBoardName+'</td><td>'+_data.totalWidgets+'</td><td>'+_data.processedCount+'</td><td>'+_data.conflictCount+'</td><td class='+_data.processStatus+'>'+jobStatus +'</td></tr>'
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

$(document).on('click','#boardLevel',function(){
	var pbId = $(this).attr('parentbid');
	if($('input[parentbid='+pbId+']:checked').length === $('input[parentbid='+pbId+']').length){
		$('input[boardid='+pbId+']').prop('checked',true);
	}else{
		$('input[boardid='+pbId+']').prop('checked',false);
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
