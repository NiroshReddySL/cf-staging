/**
 * Created by Vinay on 9/14/2017.
 */


$(document).ready(function(){
    refreshReports();
});

$(document).on('click','.moveWorksapceList .fa-plus',function(){
    $(document).find('.moveWorksapceList i.fa-minus').removeClass('fa-minus').addClass('fa-plus');
    $(document).find('.moveReportDetails').html('').css("display","none");
    $(this).parents("tr").find("i.fa-plus").addClass('fa-minus').removeClass('fa-plus');
    var _htmlCode = appendWorkspaceReport(getWorkspaceReport($(this).parents("tr").attr('wrkspaceid'),'all',1));
    _htmlCode = _htmlCode.replace('TotalCounting',$(this).parents("tr").attr('totcount')).replace('ProcessedCounting',$(this).parents("tr").attr('prcsdcount')).replace('ErrorCounting',$(this).parents("tr").attr('errcount'));
    $(this).parents("tr").next(".moveReportDetails").append(_htmlCode).css("display","table-row");

});

$(document).on('click','.moveWorksapceList .fa-minus',function(){
    $(document).find('.moveWorksapceList i.fa-minus').removeClass('fa-minus').addClass('fa-plus');
    $(document).find('.moveReportDetails').html('').css("display","none");

});
$(document).on('click','.moveWorksapceList .fa-download',function(){
    downloadReportFile($(this).parents("tr").attr('wrkspaceid'));
});
$(document).on('click','#mappedMigration .bg-info .fa-refresh',function(){
    refreshReports();
});
$(document).on('change','.moveReportDetailsTable .statusDropDown select',function () {
    var _html = appendFilterStatusFiles(getWorkspaceReport($(this).parents("tr").prev("tr.moveWorksapceList").attr('wrkspaceid'),$(this).val(),1));
    $(this).parents(".moveReportDetailsTable").find(".reportTable tbody").html('').append(_html);
});
$(document).on('click','#mappedMigration .fa-search',function () {
    appendMigrationWorkspaces(searchMoveWorkspaces($('#mappedMigration .custom-search-input input').val()),'all',1);
});
function refreshReports(){
    $("#mappedMigration #mgrtnReports tbody").html('');
    var _response = getMoveWorkspaces(1);
    appendMigrationWorkspaces(_response);
}

function downloadReportFile(wid){
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/download/movereport?moveWorkSpaceId=" + wid,
        async: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            window.open('file.doc');
        }
    });
}
function searchMoveWorkspaces(searchTerm) {
    var _result;
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/search/moveworkspace?searchUser=" + searchTerm + "&page_nbr=1&page_size=20",
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            _result = data;
        }
    });
    return _result;
}

function appendFilterStatusFiles(reportData) {
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
        "CANCEL": "Cancel"
    };
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width:5%;"> <i class="fa fa-file-text-o"></i> </div><div class="fileName">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed</td><td>SizeMB</td><td>DateDisplay</td></tr>';
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _fileData = reportData[i];
        _filesHtml = _filesHtml + _fileRow.replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSiz, _fileData.cfFileMini.type) ).replace('DateDisplay',CFManageCloudAccountsAjaxCall.getDateConversion(_fileData.createdTime));
    }
    return _filesHtml;
}
function appendWorkspaceReport(reportData) {
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
        "CANCEL": "Cancel"
    };
    var _html = '<td colspan="6"> <div class="moveReportDetailsTable" style="padding: 25px;"> <div class="summary"> <div class="col-md-3"> <div>Total Files/Folders : </div><div class="totCnt">TotalCounting</div></div><div class="col-md-3"> <div>Processed Files/Folders : </div><div class="prcsdCnt">ProcessedCounting</div></div><div class="col-md-3"> <div>Error Files/Folders : </div><div class="errCnt">ErrorCounting</div></div><div class="form-group statusDropDown col-md-3"> <div style="margin-right: 3%;">Status : </div><select class="form-control" style="width: 50%;margin-top: -3%"> <option value="all">All</option> <option value="processed">Processed</option> <option value="error">Error</option> <option value="suspended">Suspended</option> </select> </div></div><div class="reportTable"> <table> <thead> <tr> <th>File-Name</th> <th>Status</th> <th>Size</th> <th>Date</th> </tr></thead> <tbody> BodyToAttachFiles </tbody> </table> </div></div></td>';
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width:5%;"> <i class="fa fa-file-text-o"></i> </div><div class="fileName">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed</td><td>SizeMB</td><td>DateDisplay</td></tr>';
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _fileData = reportData[i];
        _filesHtml = _filesHtml + _fileRow.replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSiz, _fileData.cfFileMini.type) ).replace('DateDisplay',CFManageCloudAccountsAjaxCall.getDateConversion(_fileData.createdTime));
    }
    _html =_html.replace('BodyToAttachFiles',_filesHtml)
    return _html;
}

function getWorkspaceReport(wid,status,pgNo) {
    var _result;
    status = status.toUpperCase();
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/movereport?workspaceId=" + wid + "&page_nbr=" + pgNo + "&status="+ status,
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            _result = data;
        }
    });
    return _result;
}
function getMoveWorkspaces(pageNumber){
    var _response;
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/list?page_size=30&page_nbr=" + pageNumber,
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            _response = data;
        }
    });
    return _response;
}

function appendMigrationWorkspaces(data){
    //$("#mappedMigration #mgrtnReports tbody").html('');
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
        "CANCEL": "Cancel"
    };
    $("#mappedMigration #mgrtnReports tbody").html('');
    var _workspaceLen = data.length;
    var _moveIdHtml = '<tr class="moveWorksapceList" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"> <td> <div> <i class="fa fa-plus" style="cursor: pointer"></i> </div></td><td> <div> <img src=" ../img/drive/srcCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>srcEmailDisplay</div></div></td><td> <div> <img src=" ../img/drive/dstCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>dstEmailDisplay</div></div></td><td class="processStatus">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="fa fa-download" style="cursor: pointer"></i></div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';
    for(var i = 0; i < _workspaceLen; i++ ){
        var _result = data[i];
        if(_result.multiUserMove) {
            var _html = _moveIdHtml.replace('workSpaceId',_result.id).replace('srcEmailId',_result.fromMailId).replace('srcCloudName',_result.fromCloudName).replace('srcCloudId',_result.fromCloudId.id).replace('srcRootId',_result.fromRootId).replace('dstnEmailId',_result.toMailId).replace('dstnCloudName',_result.toCloudName).replace('dstnCloudId',_result.toCloudId.id).replace('dstnCloudRoot',_result.toRootId).replace('srcCloudImage',_result.fromCloudName).replace('srcEmailDisplay',_result.fromMailId).replace('dstCloudImage',_result.toCloudName).replace('dstEmailDisplay',_result.toMailId).replace('processStatus',_result.processStatus).replace('processStatusDispaly',moveStatus[_result.processStatus]).replace('dateDisplay',CFManageCloudAccountsAjaxCall.getDateConversion(_result.createdTime)).replace('processedCount',_result.processedCount).replace('errorCount',_result.errorCount).replace('totalCount',_result.totalFilesAndFolders);

            $("#mappedMigration #mgrtnReports tbody").append(_html);
        }
    }
}

function readableDate(value) {
    var myDate = new Date(value);
    var _date = myDate.getFullYear() + '/' +(myDate.getMonth() + 1) + '/' +  myDate.getDate();
    return _date;
}