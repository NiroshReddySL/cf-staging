/**
 * Created by VINAY on 29-11-2016.
 */
$('#move-header').on('change','.multiUsrClass',function() {
    $(".multiUsrClass").parent().removeClass();
    if($('.multiUsrClass:checkbox:checked').length > 0 ){
        $('#movecheckModal').prop('disabled',false).addClass('blue');
    }
});
$('#move-header').on('change','.multiUsrChkbox',function() {
    $(".multiUsrChkbox").parent().removeClass();
    if($('.chkMove:checkbox:checked').length) {
        $('.multiUsrClass').prop('checked', true);
        $('.multiUsrClass').parents(".multiUsrCheckSlct").css("color","");
        $('#movecheckModal').prop('disabled',false).addClass('blue');
    }
    else {
        $('.multiUsrClass').prop('checked', false);
        movedClds();
    }
});
$('#move-header').on('change','input:radio[name=multiUsrSrcCld]',function(){
    $("#moveDestination input[name='multiUsrDstCld']:checked").prop("checked",false);
});
$('#move-header').on('change','input:radio[name=multiUsrSrcCld],input:radio[name=multiUsrDstCld]',function(){
    $( "input[name='multiUsrSrcCld']" ).parent().removeClass();
    $( "input[name='multiUsrDstCld']" ).parent().removeClass();
    if($("#moveSource input[name='multiUsrSrcCld']:checked").length > 0 && $("#moveDestination input[name='multiUsrDstCld']:checked").length > 0) {
        var selSrc = {id:"", pid:"", name:"",userId:""},selDst = {id:"", pid:"", name:"",userId:""},sel;
        sel=$("#moveSource input[name='multiUsrSrcCld']:checked").parent().siblings();
        selSrc.id=$(sel).attr("cid");
        selSrc.pid=$(sel).attr("pid");
        selSrc.name=$(sel).attr("cloud");
        selSrc.userId=$(sel).text();
        sel=$("#moveDestination input[name='multiUsrDstCld']:checked").parent().siblings();
        selDst.id=$(sel).attr("cid");
        selDst.pid=$(sel).attr("pid");
        selDst.name=$(sel).attr("cloud");
        selDst.userId=$(sel).text();
        $("#moveSource input[name='multiUsrSrcCld']:checked").parents(".multiUsrDraggable").html("");
        $("#moveDestination input[name='multiUsrDstCld']:checked").parents(".multiUsrDroppable").html("");
        $("#multiUsrUsrsBox #multiUsrUsrs").append('<div style="clear:both;margin-top: 1%;" class="multiUsrCheckSlct"><div style="float: left;width: 8%;margin-top: 1%;"><input type="checkbox" class="multiUsrClass"><img src="../img/drive/'+selSrc.name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulSrc" style="display: block;font-size: 15px;margin-left: 95%;margin-top: -31%" spid="'+selSrc.pid+'" scid="'+selSrc.id+'" sname="'+selSrc.name+'" semail="'+selSrc.userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(selSrc.userId,25)+'</div></div><div style="margin-left: 39%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/'+selDst.name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulDst" style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%" dpid="'+selDst.pid+'" dcid="'+selDst.id+'" dname="'+selDst.name+'" demail="'+selDst.userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(selDst.userId,25)+"/FromCloudFuze"+'</div></div><i class="cf-close" id="rmv_Mapd_Usr" style="float: left;margin-top: 18px;margin-left: 31%;cursor: pointer"></i></div>');
        $('#multiUsrUsrsBox').css("display","block");
        stylechange();
    }
    if($(".multiUsrCheckSlct .multiUsrClass:checkbox:checked").length > 0)
        $('#movecheckModal').removeAttr('disabled').addClass('blue');
});
function multiUserDispaly(cid){
    var apiUrl = apicallurl + "/users/get/user/clouds/list?cloudId="+cid;
    $.ajax({
        type: "GET",
        url: apiUrl,
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            var _src;
            if (moveCheckSum == 'source') {
                var _src=$("#moveSource");
                _src.html('');
                _src.append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px" name=" " id="getClouds" cid="' + SingleCloudId + '" class="moveMultiUserCheck"><span style="width:20%;float: left;display: block;padding-left:10px;font-size: 30px;margin-left: 60px;" class="cf-back"></span></div>');
                _src.append('<div style="width:80%;height:30px;margin: 0 auto;background:rgba(20,124,185,0.6);padding:6px;padding-left: 4px;"><strong style="margin-left: 32%;display: inline-block;width: :90%">Users</strong></div>');
                $.each(data, function (i, data) {
                    _src.append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + data.id + '" pid="' + data.rootFolderId + '" cloud="' + data.cloudName + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+data.cloudUserId.split("|")[1]+'</div></div>');
                });
            }
            else if (moveCheckSum == 'dest') {
                var _src=$("#moveDestination");
                _src.html('');
                _src.append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px" name=" " id="getClouds" cid="' + SingleCloudId + '" class="moveMultiUserCheck"><span style="width:20%;float: left;display: block;padding-left:10px;font-size: 30px;margin-left: 60px;" class="cf-back"></span></div>');
                _src.append('<div style="width:80%;height:30px;margin: 0 auto;background:rgba(20,124,185,0.6);padding:6px;padding-left: 4px;"><strong style="margin-left: 32%;display: inline-block;width: :90%">Users</strong></div>');
                $.each(data, function (i, data) {
                    _src.append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + data.id + '" pid="' + data.rootFolderId + '" cloud="' + data.cloudName + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+data.cloudUserId.split("|")[1]+'</div></div>');
                });
            }
            if($("#moveSource input[name='multiUsrSrcCld']").length > 0 && $("#moveDestination input[name='multiUsrDstCld']").length > 0)
            {
                //$('#multiUsrUsrsBox').css("display","block");
                $("#movePageMultiUsr #primary").css("height","147%");
            }
            else {
                $("#movePageMultiUsr #primary").css("height","100%");
            }
        }
    });
}
function multiUsrMove(srcCldsId,destCldsId) {
    var i,j,k=0;
    for(i=0;i<srcCldsId.length;i++) {
        var src=srcCldsId[i].userId.split("@")[0];
        for(j=0;j<destCldsId.length;j++) {
            var dest=destCldsId[j].userId.split("@")[0];
            if(src == dest) {
                var tmp=[];
                tmp=destCldsId[k];
                destCldsId[k]=destCldsId[j];
                destCldsId[j]=tmp;
                tmp=srcCldsId[k];
                srcCldsId[k]=srcCldsId[i];
                srcCldsId[i]=tmp;
                k++;
            }
        }
    }
    for(i=0,j=0;i<srcCldsId.length,j<destCldsId.length;i++,j++) {
        if(srcCldsId[i] != undefined && destCldsId[j] != undefined) {
            if(srcCldsId[i].userId.split("@")[0] ==destCldsId[j].userId.split("@")[0]) {
                //$("#move_multiUser_map .list-group").append('<div style="clear:both;margin-top: 5%;margin-left: -18%;"><div style="float: left;width: 8%;margin-top: 3%;"><img src="../img/drive/'+srcCldsId[i].name +'.png" style="width: 30px;margin-left: 35%;"></div><span style="display: block;font-size: 15px;">'+ srcCldsId[i].userId+'</span><div style="margin-left: 28%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div></div><div style="float: left;width: 8%;"><img src="../img/drive/'+destCldsId[j].name +'.png" style="width: 30px;margin-left: 35%;></div><span style="display: block;font-size: 15px;">'+ destCldsId[j].userId+'</div><div><button id="move" type="button" class="button mini blue" style="width: 8%;height:30px;border-radius: 0px;margin-top: 2%;margin-left: 5%;">Move</button></div></div>');
                $("#move_multiUser_map .list-group").append('<div style="clear:both;margin-top: 5%;margin-left: -18%;"><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/'+srcCldsId[i].name +'.png" style="width: 30px;margin-left: 35%;"><div style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%">'+ CFManageCloudAccountsAjaxCall.getMaxChars(srcCldsId[i].userId,25)+'</div></div><div style="margin-left: 28%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/'+destCldsId[j].name +'.png" style="width: 30px;margin-left: 35%;"><div style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%">'+ CFManageCloudAccountsAjaxCall.getMaxChars(destCldsId[j].userId,25)+'</div></div><div><button id="move" type="button" class="button mini blue" style="width: 8%;height:30px;border-radius: 0px;margin-top: 2%;margin-left: 5%;">Move</button></div></div>');
            }
            else {
                $("#move_multiUser_pair .src .list-group").append('<div style="float: left;margin-left: -24%;margin-top: 6%;"><input type="checkbox" name="srcCloud" id="" style="float: left;margin-top: 10%"><img src="../img/drive/'+srcCldsId[i].name +'.png" style="margin-left: 10%;float: left;width:20px;margin-top: 8%;"><div style="margin-left:3%;font-size: 17px;float: left;margin-top: 6%">'+ srcCldsId[i].userId+'</div></div>');
                $("#move_multiUser_pair .dest .list-group").append('<div style="float: left;margin-left: 10%;margin-top: 4%;"><input type="radio" name="destCloud" id="" style="float: left;margin-top: 9%"><img src="../img/drive/'+destCldsId[j].name +'.png" style="margin-left: 5%;float: left;width:20px;margin-top: 7%;"><div style="margin-left:3%;font-size: 17px;float: left;margin-top: 6%;margin-left:2%;">'+ destCldsId[j].userId+'</div></div>');
            }
        }
        else if(srcCldsId[i] != undefined)
            $("#move_multiUser_pair .src .list-group").append('<div style="float: left;margin-left: -24%;margin-top: 6%;"><input type="checkbox" name="srcCloud" id="" style="float: left;margin-top: 10%"><img src="../img/drive/'+srcCldsId[i].name +'.png" style="margin-left: 10%;float: left;width:20px;margin-top: 8%;"><div style="margin-left:3%;font-size: 17px;float: left;margin-top: 6%">'+ srcCldsId[i].userId+'</div></div>');
        else if(destCldsId[j] != undefined)
            $("#move_multiUser_pair .dest .list-group").append('<div style="float: left;margin-left: 10%;margin-top: 4%;"><input type="radio" name="destCloud" id="" style="float: left;margin-top: 9%"><img src="../img/drive/'+destCldsId[j].name +'.png" style="margin-left: 5%;float: left;width:20px;margin-top: 7%;"><div style="margin-left:3%;font-size: 17px;float: left;margin-top: 6%;margin-left:2%;">'+ destCldsId[j].userId+'</div></div>');

    }
    $("#move_main").hide();
    $('#move_multiUser').show();
}
function multiUsrCloudsMove(CFMultiUserMove) {
    var moveFileObject = {
        "fromId": CFMultiUserMove.fromRootId,
        "fromCId": CFMultiUserMove.fromCloudId,
        "toId": CFMultiUserMove.toRootId,
        "toCId": CFMultiUserMove.toCloudId,
        "fromMailId":CFMultiUserMove.fromEmailId,
        "toEmailId" : CFMultiUserMove.toEmailId,
        "fromCloudName":CFMultiUserMove.fromCloudName,
        "toCloudName":CFMultiUserMove.toCloudName,
        "notify": false,
        "userEmails": null,
        "isCopy": true,
        "multiUserMove":true,
        "destinationFolderName":null
    };

    //CFMultiUserMove.fromCloudName == "DROPBOX_BUSINESS" && CFMultiUserMove.toCloudName == "ONEDRIVE_BUSINESS_ADMIN"
    if(CFMultiUserMove.fromCloudName == 'DROPBOX_BUSINESS' && CFMultiUserMove.toCloudName == 'G_SUITE'){
        $("#mulUsrCheck .tab-content h4 span").text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
        $("#mulUsrCheck").modal("show");
        return false;
    }


    if(cloudMapping[CFMultiUserMove.fromCloudName] && cloudMapping[CFMultiUserMove.fromCloudName].indexOf(CFMultiUserMove.toCloudName) > -1) {
        moveFileObject.destinationFolderName ="FromCloudFuze";
        if(moveFileObject.toCloudName == "SHAREPOINT_ONLINE_BUSINESS")
            moveFileObject.destinationFolderName = moveFileObject.fromMailId.split("@")[0].replace(".","_");
        $("#mulUsrCheck").modal("hide");
    }
    else if(!cloudMapping[CFMultiUserMove.fromCloudName] || cloudMapping[CFMultiUserMove.fromCloudName].indexOf(CFMultiUserMove.toCloudName) == -1) {
        //(CFMultiUserMove.fromCloudName == "ONEDRIVE_BUSINESS_ADMIN" && CFMultiUserMove.toCloudName == "ONEDRIVE_BUSINESS_ADMIN") || (CFMultiUserMove.fromCloudName == "DROPBOX_BUSINESS" && CFMultiUserMove.toCloudName == "DROPBOX_BUSINESS") || (CFMultiUserMove.fromCloudName == "ONEDRIVE_BUSINESS_ADMIN" && CFMultiUserMove.toCloudName == "DROPBOX_BUSINESS")
        $("#mulUsrCheck .tab-content h4 span").text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
        $("#mulUsrCheck").modal("show");
        return false;
    }
    else {
        $("#mulUsrCheck .tab-content h4 span").text("Both Source and Destination should be multi user clouds.");
        $("#mulUsrCheck").modal("show");
        return false;
    }
    //Disable and Enable Pricing
    var _isEnabled= chkMultiUserPaid();
    if(_isEnabled){
        multiUsrMoveCall(moveFileObject,null);
        return true;
    }
    else{
        $("#CFmulUsrmoveStatus").modal('show');
        return false;
    }
}
$('#multiUsrUsrs').on('click','#rmv_Mapd_Usr',function() {
    var _src=$(this).siblings("div").children(".mulSrc");
    var scid=$(_src).attr("scid"),spid=$(_src).attr("spid"),sname=$(_src).attr("sname"),stext=$(_src).text();
    $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + scid+ '" pid="' +spid + '" cloud="' +sname + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+stext+'</div></div>');
    _src=$(this).siblings("div").children(".mulDst");
    var dcid=$(_src).attr("dcid"),dpid=$(_src).attr("dpid"),dname=$(_src).attr("dname"),dtext=$(_src).text().split("/")[0];
    $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' +dcid + '" pid="' +dpid + '" cloud="' + dname + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+dtext+'</div></div>');
    $(this).parent().html('');
    var multiUsrSrcClds=[],multiUsrDstClds=[];
    if(!($("#multiUsrUsrsBox #multiUsrUsrs .multiUsrCheckSlct .multiUsrClass").length))
    {
        $('#multiUsrUsrsBox').css("display","none");
        stylechange();
    }
    $("#moveSource input[name='multiUsrSrcCld']").each(function( ) {
        var selSrc = {id:"", pid:"", name:"",userId:""},sel;
        sel=$(this).parent().siblings();
        selSrc.id=$(sel).attr("cid");
        selSrc.pid=$(sel).attr("pid");
        selSrc.name=$(sel).attr("cloud");
        selSrc.userId=$(sel).text();
        multiUsrSrcClds.push(selSrc);
    });
    $("#moveDestination input[name='multiUsrDstCld']").each(function( ) {
        var selDst = {id:"", pid:"", name:"",userId:""},sel;
        sel=$(this).parent().siblings();
        selDst.id=$(sel).attr("cid");
        selDst.pid=$(sel).attr("pid");
        selDst.name=$(sel).attr("cloud");
        selDst.userId=$(sel).text();
        multiUsrDstClds.push(selDst);
    });
//
//     // multiUsrDstClds.push(JSON.parse(localStorage.getItem("multiUsrDstClds")));
//     // multiUsrSrcClds.push(JSON.parse(localStorage.getItem("multiUsrSrcClds")));
    var _srcCldsMpd = JSON.parse(localStorage.getItem("multiUsrSrcClds")),_len=Object.keys(_srcCldsMpd).length;
    for(var i=0;i<_len;i++)
        multiUsrSrcClds.push(_srcCldsMpd[i]);

    var srcIds = [],srcClean = [];
    $.each(multiUsrSrcClds, function(index, value) {
        if($.inArray(value.id, srcIds) == -1)
        {
            srcIds.push(value.id);
            srcClean.push(value);
        }
    });

    var _dstCldsMpd = JSON.parse(localStorage.getItem("multiUsrDstClds")),_len=Object.keys(_dstCldsMpd).length;
    for(var i=0;i<_len;i++)
        multiUsrDstClds.push(_dstCldsMpd[i]);

    var dstIds = [],dstClean = [];
    $.each(multiUsrDstClds, function(index, value) {
        if($.inArray(value.id, dstIds) == -1)
        {
            dstIds.push(value.id);
            dstClean.push(value);
        }
    });

    localStorage.removeItem("multiUsrSrcClds");
    localStorage.removeItem("multiUsrDstClds");

localStorage.setItem("multiUsrSrcClds",JSON.stringify(srcClean));
localStorage.setItem("multiUsrDstClds",JSON.stringify(dstClean));
});

function multiUsrMapng() {
    mappedCldsGet();
    var destCldsId = [], srcCldsId = [], i, j, k = 0;
    $("#moveDestination .move").each(function () {
        var clouds = {id: "", pid: "", name: "", userId: ""};
        clouds.id = $(this).attr("cid");
        clouds.pid = $(this).attr("pid");
        clouds.name = $(this).attr("cloud");
        clouds.userId = $(this).text();
        destCldsId.push(clouds);
    });
    $("#moveSource .move").each(function () {
        var clouds = {id: "", pid: "", name: "", userId: ""};
        clouds.id = $(this).attr("cid");
        clouds.pid = $(this).attr("pid");
        clouds.name = $(this).attr("cloud");
        clouds.userId = $(this).text();
        srcCldsId.push(clouds);
    });
    var srclen = srcCldsId.length, destlen = destCldsId.length, _t, cldUsrs = [];
    for (i = 0; i < srclen; i++) {
        _t = true;
        var src = srcCldsId[i].userId.split("@")[0].toLowerCase();
        for (var d = 0; d < cldUsrs.length; d++) {
            if (cldUsrs[d] == src)
                _t = false;
        }
        for (j = 0; j < destlen; j++) {
            var dest = destCldsId[j].userId.split("@")[0].toLowerCase();
            if (src == dest && _t) {
                var tmp = [];
                cldUsrs.push(src);
                tmp = destCldsId[k];
                destCldsId[k] = destCldsId[j];
                destCldsId[j] = tmp;
                tmp = srcCldsId[k];
                srcCldsId[k] = srcCldsId[i];
                srcCldsId[i] = tmp;
                k++;
                j = destCldsId.length;
            }
        }
    }
    localStorage.setItem("multiUsrSrcCldsMul", JSON.stringify(srcCldsId));
    localStorage.setItem("multiUsrDstCldsMul", JSON.stringify(destCldsId));
    var _mulMpd = mappingClouds();
    if (!_mulMpd){
        $("#multiUsrUsrsBox #multiUsrUsrs").html("");
    }
    srcCldsId = JSON.parse(localStorage.getItem("multiUsrSrcClds"));
    destCldsId = JSON.parse(localStorage.getItem("multiUsrDstClds"));
    var i, len = srcCldsId.length;
    if (srcCldsId.length > destCldsId.length)
        len = destCldsId.length;
    setTimeout(function () {
        $('#multiMoveCheck').modal('hide');
        $("#moveSource .multiUsrDraggable").html("");
        $("#moveDestination .multiUsrDroppable").html("");
        for (i = 0; i < len; i++) {
            if (srcCldsId[i].userId.split("@")[0].toLowerCase() == destCldsId[i].userId.split("@")[0].toLowerCase() && !_mulMpd)
                $("#multiUsrUsrsBox #multiUsrUsrs").append('<div style="clear:both;margin-top: 1%;" class="multiUsrCheckSlct"><div style="float: left;width: 8%;margin-top: 1%;"><input type="checkbox" class="multiUsrClass"><img src="../img/drive/' + srcCldsId[i].name + '.png" style="width: 30px;margin-left: 35%;"><div class="mulSrc" style="display: block;font-size: 15px;margin-left: 95%;margin-top: -31%" spid="' + srcCldsId[i].pid + '" scid="' + srcCldsId[i].id + '" sname="' + srcCldsId[i].name + '" semail="' + srcCldsId[i].userId + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(srcCldsId[i].userId, 35) + '</div></div><div style="margin-left: 39%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/' + destCldsId[i].name + '.png" style="width: 30px;margin-left: 35%;"><div class="mulDst" style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%" dpid="' + destCldsId[i].pid + '" dcid="' + destCldsId[i].id + '" dname="' + destCldsId[i].name + '" demail="' + destCldsId[i].userId + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(destCldsId[i].userId, 25) + "/FromCloudFuze" + '</div></div><i class="cf-close" id="rmv_Mapd_Usr" style="float: left;margin-top: 18px;margin-left: 31%;cursor: pointer"></i></div>');
            else {
                $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + srcCldsId[i].id + '" pid="' + srcCldsId[i].pid + '" cloud="' + srcCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">' + srcCldsId[i].userId + '</div></div>');
                $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + destCldsId[i].id + '" pid="' + destCldsId[i].pid + '" cloud="' + destCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">' + destCldsId[i].userId + '</div></div>');
            }
        }
        for (i = len; i < srcCldsId.length; i++){
            $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + srcCldsId[i].id + '" pid="' + srcCldsId[i].pid + '" cloud="' + srcCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">' + srcCldsId[i].userId + '</div></div>');
        }
        for (i = len; i < destCldsId.length; i++){
            $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + destCldsId[i].id + '" pid="' + destCldsId[i].pid + '" cloud="' + destCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">' + destCldsId[i].userId + '</div></div>');
        }

        if ($("#multiUsrUsrsBox #multiUsrUsrs .multiUsrCheckSlct").length > 0){
            $('#multiUsrUsrsBox').css("display", "block");
        }
        stylechange();
        $("#dynamicCloudName").siblings("b").text("Source Cloud Unmapped Users :").css("width", "");
        $("#dynamicDestCloudName").siblings("b").text("Destination Cloud Unmapped Users :").css("width", "");
    }, 5000);
}
function multiUserDispalyBack(cid,b){
    var apiUrl = apicallurl + "/users/get/user/clouds/list?cloudId="+cid;
    $.ajax({
        type: "GET",
        url: apiUrl,
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            var _src;
            if (b=="source") {
                var _src=$("#moveSource");
                _src.html('');
                _src.append('<div data-type="sourceback" style="width: 50%;cursor:pointer;height:30px" name=" " id="getClouds" cid="' + SingleCloudId + '" class="moveMultiUserCheck"><span style="width:20%;float: left;display: block;padding-left:10px;font-size: 30px;margin-left: 60px;" class="cf-back"></span></div>');
                _src.append('<div style="width:80%;height:30px;margin: 0 auto;background:rgba(20,124,185,0.6);padding:6px;padding-left: 4px;"><strong style="margin-left: 32%;display: inline-block;width: :90%">Users</strong></div>');
                $.each(data, function (i, data) {
                    _src.append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + data.id + '" pid="' + data.rootFolderId + '" cloud="' + data.cloudName + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+data.cloudUserId.split("|")[1]+'</div></div>');
                });
            }
            else if (b=="destination") {
                var _src=$("#moveDestination");
                _src.html('');
                _src.append('<div data-type="destback" style="width: 100%;cursor:pointer;height:30px" name=" " id="getClouds" cid="' + SingleCloudId + '" class="moveMultiUserCheck"><span style="width:20%;float: left;display: block;padding-left:10px;font-size: 30px;margin-left: 60px;" class="cf-back"></span></div>');
                _src.append('<div style="width:80%;height:30px;margin: 0 auto;background:rgba(20,124,185,0.6);padding:6px;padding-left: 4px;"><strong style="margin-left: 32%;display: inline-block;width: :90%">Users</strong></div>');
                $.each(data, function (i, data) {
                    _src.append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + data.id + '" pid="' + data.rootFolderId + '" cloud="' + data.cloudName + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+data.cloudUserId.split("|")[1]+'</div></div>');
                });
            }
            if($("#moveSource input[name='multiUsrSrcCld']").length > 0 && $("#moveDestination input[name='multiUsrDstCld']").length > 0) {
                //$('#multiUsrUsrsBox').css("display","block");
                $("#movePageMultiUsr #primary").css("height","147%");
            }
            else {
                $("#movePageMultiUsr #primary").css("height","100%");
            }
        }
    });
}
function stylechange() {
    if($('#multiUsrUsrsBox').css("display") == "none")
        $("#movePageMultiUsr").css("overflow-y","hidden");
    else
        $("#movePageMultiUsr").css("overflow-y","auto");
}
function multiUsrMapngMove() {
    var destCldsId=[],srcCldsId=[],i,j,k=0,_t,cldUsrs=[];
        srcCldsId=JSON.parse(localStorage.getItem("multiUsrSrcClds"));
        destCldsId=JSON.parse(localStorage.getItem("multiUsrDstClds"));
        for(i=0;i<srcCldsId.length;i++)
        {
            _t=true;
            var src=srcCldsId[i].userId.split("@")[0].toLowerCase();
            for(var d=0; d<cldUsrs.length; d++) {
                if (cldUsrs[d] == src)
                    _t=false;
            }
            for(j=0;j<destCldsId.length;j++)
            {
                var dest=destCldsId[j].userId.split("@")[0].toLowerCase();
                if(src == dest && _t)
                {
                    cldUsrs.push(src);
                    var tmp=[];
                    tmp=destCldsId[k];
                    destCldsId[k]=destCldsId[j];
                    destCldsId[j]=tmp;
                    tmp=srcCldsId[k];
                    srcCldsId[k]=srcCldsId[i];
                    srcCldsId[i]=tmp;
                    k++;
                    j=destCldsId.length;
                }
            }
        }
    var _mulMpd = mappingClouds();
    if(!_mulMpd)
        $("#multiUsrUsrsBox #multiUsrUsrs").html("");
    srcCldsId =  JSON.parse(localStorage.getItem("multiUsrSrcClds"));
    destCldsId =  JSON.parse(localStorage.getItem("multiUsrDstClds"));
    var i,len=srcCldsId.length;
    if(srcCldsId.length > destCldsId.length)
        len=destCldsId.length;
        $('#multiMoveCheck').modal('hide');
        $("#moveSource .multiUsrDraggable").html("");
        $("#moveDestination .multiUsrDroppable").html("");
        for(i=0;i<len;i++)
        {
            if(srcCldsId[i].userId.split("@")[0].toLowerCase() == destCldsId[i].userId.split("@")[0].toLowerCase() && !_mulMpd)
                $("#multiUsrUsrsBox #multiUsrUsrs").append('<div style="clear:both;margin-top: 1%;" class="multiUsrCheckSlct"><div style="float: left;width: 8%;margin-top: 1%;"><input type="checkbox" class="multiUsrClass"><img src="../img/drive/'+srcCldsId[i].name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulSrc" style="display: block;font-size: 15px;margin-left: 95%;margin-top: -31%" spid="'+srcCldsId[i].pid+'" scid="'+srcCldsId[i].id+'" sname="'+srcCldsId[i].name+'" semail="'+srcCldsId[i].userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(srcCldsId[i].userId,35)+'</div></div><div style="margin-left: 39%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/'+destCldsId[i].name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulDst" style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%" dpid="'+destCldsId[i].pid+'" dcid="'+destCldsId[i].id+'" dname="'+destCldsId[i].name+'" demail="'+destCldsId[i].userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(destCldsId[i].userId,25)+"/FromCloudFuze"+'</div></div><i class="cf-close" id="rmv_Mapd_Usr" style="float: left;margin-top: 18px;margin-left: 31%;cursor: pointer"></i></div>');
            else
            {
                $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + srcCldsId[i].id + '" pid="' + srcCldsId[i].pid + '" cloud="' + srcCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+srcCldsId[i].userId+'</div></div>');
                $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + destCldsId[i].id + '" pid="' + destCldsId[i].pid + '" cloud="' + destCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+destCldsId[i].userId+'</div></div>');
            }
        }
        for(i=len;i<srcCldsId.length;i++)
            $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + srcCldsId[i].id + '" pid="' + srcCldsId[i].pid + '" cloud="' + srcCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+srcCldsId[i].userId+'</div></div>');
        for(i=len;i<destCldsId.length;i++)
            $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + destCldsId[i].id + '" pid="' + destCldsId[i].pid + '" cloud="' + destCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+destCldsId[i].userId+'</div></div>');

        if($("#multiUsrUsrsBox #multiUsrUsrs .multiUsrCheckSlct").length > 0)
            $('#multiUsrUsrsBox').css("display","block");
        stylechange();
    movedClds();
    $("#dynamicCloudName").siblings("b").text("Source Cloud Unmapped Users :").css("width","");
    $("#dynamicDestCloudName").siblings("b").text("Destination Cloud Unmapped Users :").css("width","");
}
$('#moveSource').on('click','[data-type="sourceback"]',function() {
    $("#dynamicCloudName").siblings("b").text("Source Cloud :").css("width","21%");
    $("#dynamicDestCloudName").siblings("b").text("Destination Cloud :").css("width","26%");
});
$('#moveDestination').on('click','[data-type="destback"]',function(){
    $("#dynamicCloudName").siblings("b").text("Source Cloud :").css("width","21%");
    $("#dynamicDestCloudName").siblings("b").text("Destination Cloud :").css("width","26%");
});
function movedClds() {
    var CFMultiUserMove = JSON.parse(localStorage.getItem("selectedClds")),len;
    if(CFMultiUserMove != null)
      len=CFMultiUserMove.length
    var _parent=$(".multiUsrCheckSlct");
    $.each(_parent, function (j, _parent) {
        for(var i=0;i<len;i++)
        {
            if($(_parent).find(".mulSrc").attr("scid") == CFMultiUserMove[i].fromCId && $(_parent).find(".mulDst").attr("dcid") == CFMultiUserMove[i].toCId)
                $(_parent).css("color","#ccc");
        }
        });
}
$('#move-header').on('change','.multiUsrClass',function() {
    if($(this).is(':checked'))
        $(this).parents(".multiUsrCheckSlct").css("color","");
    else
        movedClds();
    var _tmp=$('.multiUsrClass:checkbox:checked').parents(".multiUsrCheckSlct");
    $.each(_tmp,function (i,_tmp) {
        $(_tmp).css("color","");
    });
});

function multiUsrMapngMoveMul() {
    //$("#multiUsrUsrsBox #multiUsrUsrs").html("");
    var destCldsId=[],srcCldsId=[],i,j,k=0,_t,cldUsrs=[];
        srcCldsId=JSON.parse(localStorage.getItem("multiUsrSrcCldsMul"));
        destCldsId=JSON.parse(localStorage.getItem("multiUsrDstCldsMul"));
        for(i=0;i<srcCldsId.length;i++)
        {
            _t=true;
            var src=srcCldsId[i].userId.split("@")[0].toLowerCase();
            for(var d=0; d<cldUsrs.length; d++) {
                if (cldUsrs[d] == src)
                    _t=false;
            }
            for(j=0;j<destCldsId.length;j++)
            {
                var dest=destCldsId[j].userId.split("@")[0].toLowerCase();
                if(src == dest && _t)
                {
                    var tmp=[];
                    cldUsrs.push(src);
                    tmp=destCldsId[k];
                    destCldsId[k]=destCldsId[j];
                    destCldsId[j]=tmp;
                    tmp=srcCldsId[k];
                    srcCldsId[k]=srcCldsId[i];
                    srcCldsId[i]=tmp;
                    k++;
                    j=destCldsId.length;
                }
            }
        }
    var _mulMpd = mappingClouds();
    if(!_mulMpd)
        $("#multiUsrUsrsBox #multiUsrUsrs").html("");
    srcCldsId =  JSON.parse(localStorage.getItem("multiUsrSrcClds"));
    destCldsId =  JSON.parse(localStorage.getItem("multiUsrDstClds"));
    var i,len=srcCldsId.length;
    if(srcCldsId.length > destCldsId.length)
        len=destCldsId.length;
        $("#moveSource .multiUsrDraggable").html("");
        $("#moveDestination .multiUsrDroppable").html("");
        for(i=0;i<len;i++)
        {
            if(srcCldsId[i].userId.split("@")[0].toLowerCase() == destCldsId[i].userId.split("@")[0].toLowerCase() && !_mulMpd)
                $("#multiUsrUsrsBox #multiUsrUsrs").append('<div style="clear:both;margin-top: 1%;" class="multiUsrCheckSlct"><div style="float: left;width: 8%;margin-top: 1%;"><input type="checkbox" class="multiUsrClass"><img src="../img/drive/'+srcCldsId[i].name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulSrc" style="display: block;font-size: 15px;margin-left: 95%;margin-top: -31%" spid="'+srcCldsId[i].pid+'" scid="'+srcCldsId[i].id+'" sname="'+srcCldsId[i].name+'" semail="'+srcCldsId[i].userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(srcCldsId[i].userId,35)+'</div></div><div style="margin-left: 39%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/'+destCldsId[i].name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulDst" style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%" dpid="'+destCldsId[i].pid+'" dcid="'+destCldsId[i].id+'" dname="'+destCldsId[i].name+'" demail="'+destCldsId[i].userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(destCldsId[i].userId,25)+"/FromCloudFuze"+'</div></div><i class="cf-close" id="rmv_Mapd_Usr" style="float: left;margin-top: 18px;margin-left: 31%;cursor: pointer"></i></div>');
            else
            {
                $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + srcCldsId[i].id + '" pid="' + srcCldsId[i].pid + '" cloud="' + srcCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+srcCldsId[i].userId+'</div></div>');
                $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + destCldsId[i].id + '" pid="' + destCldsId[i].pid + '" cloud="' + destCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+destCldsId[i].userId+'</div></div>');
            }
        }
        for(i=len;i<srcCldsId.length;i++)
            $("#moveSource").append('<div class="multiUsrDraggable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrSrcCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + srcCldsId[i].id + '" pid="' + srcCldsId[i].pid + '" cloud="' + srcCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+srcCldsId[i].userId+'</div></div>');
        for(i=len;i<destCldsId.length;i++)
            $("#moveDestination").append('<div class="multiUsrDroppable ui-widget-content"><div style="float: left;width: 10%;margin-left: 15%;margin-top: 3%"><input type="radio" name="multiUsrDstCld"><img src="../img/PNG/user.png" style="width: 40%;margin-left: 10%;"></div><div cid="' + destCldsId[i].id + '" pid="' + destCldsId[i].pid + '" cloud="' + destCldsId[i].name + '" class="move" style="margin-top: 4%;height: 25px;margin-left:0px;width:60%;font-weight: bold;font-size: 13px">'+destCldsId[i].userId+'</div></div>');

        if($("#multiUsrUsrsBox #multiUsrUsrs .multiUsrCheckSlct").length > 0)
            $('#multiUsrUsrsBox').css("display","block");
        stylechange();
        $("#dynamicCloudName").siblings("b").text("Source Cloud Unmapped Users :").css("width","");
        $("#dynamicDestCloudName").siblings("b").text("Destination Cloud Unmapped Users :").css("width","");
        localStorage.setItem("multiUsrSrcClds",JSON.stringify(srcCldsId));
        localStorage.setItem("multiUsrDstClds",JSON.stringify(destCldsId));
}

$('#move-header').on('change','input[name=srcfile]',function() {
    if($('input[name=multiUsrDstCld]').length > 0 )
        $('#movecheckModal').prop('disabled',true).removeClass('blue');
});
$('#move-header').on('change','input[name=multiUsrDstCld]',function() {
    if($('input[name=srcfile]').length > 0 )
        $('#movecheckModal').prop('disabled',true).removeClass('blue');
});


//Multi-User Move Ajax-call
function multiUsrMoveCall(moveFileObject,files) {
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
        "fromCloudName":moveFileObject.fromCloudName,
        "toCloudName":moveFileObject.toCloudName,
        "fromMailId":moveFileObject.fromMailId,
        "toMailId":moveFileObject.toEmailId,
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
        "success": false,
        "destinationFolderName":moveFileObject.destinationFolderName,
        "multiUserMove":true,
        "cfMultiUserMove":null,
        "fromAdminId":localStorage.getItem("mulUsrSrc"),
        "toAdminId": localStorage.getItem("mulUsrDst"),
    };
    var CFMultiUserMove=[];
    $('.multiUsrClass:checkbox').parents(".multiUsrCheckSlct").each(function () {
        var _parent=$(this);
        var CFMulti=
            {
                "fromEmailId":  $(_parent).find(".mulSrc").attr("semail").trim(),
                "fromCloudId":  $(_parent).find(".mulSrc").attr("scid").trim(),
                "fromCloudName":  $(_parent).find(".mulSrc").attr("sname").trim(),
                "fromRootId":  $(_parent).find(".mulSrc").attr("spid").trim(),
                "toEmailId":$(_parent).find(".mulDst").attr("demail").trim(),
                "toCloudId":$(_parent).find(".mulDst").attr("dcid").trim(),
                "toRootId":$(_parent).find(".mulDst").attr("dpid").trim(),
                "toCloudName":$(_parent).find(".mulDst").attr("dname").trim(),
            }
 	$.each(AllCloudsInfo,function(i,c){
            if(c.id == CFMulti.fromCloudId)
                CFMulti.fromEmailId = c.cloudUserId.split("|")[1];

            if(c.id == CFMulti.toCloudId)
                CFMulti.toEmailId = c.cloudUserId.split("|")[1];
        });
        var _dup=false;
        for(var i=0;i<CFMultiUserMove.length;i++)
        {
                if(CFMultiUserMove[i].fromCloudId == CFMulti.fromCloudId && CFMultiUserMove[i].toCloudId == CFMulti.toCloudId)
                    _dup=true;
        }
        if(!_dup)
          CFMultiUserMove.push(CFMulti);
    });
    localStorage.setItem("mappedClouds",JSON.stringify(CFMultiUserMove));
    //console.log(CFMultiUserMove);
    jsonArray.cfMultiUserMove =CFMultiUserMove;
    jsonArray.fileIds =files;
    var apiurl = apicallurl + "/move/multiuser/create?isCopy=true";
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
            var CFMultiUserMove=[];
            CFMultiUserMove.push(moveFileObject);
            //CFMultiUserMove.push(JSON.parse(localStorage.getItem("selectedClds")));
            var _b=JSON.parse(localStorage.getItem("selectedClds"));
            if(_b != null)
            {
                $.each(_b,function (i,_b) {
                    CFMultiUserMove.push(_b);
                })
            }
            for(var i=0;i<CFMultiUserMove.length;i++)
            {
                for(var j=i+1;j<CFMultiUserMove.length;j++)
                {
                    if(CFMultiUserMove[i].fromCId == CFMultiUserMove[j].fromCId && CFMultiUserMove[i].toCId == CFMultiUserMove[j].toCId)
                        CFMultiUserMove.splice(j,1);
                }
            }
            localStorage.removeItem("selectedClds");
            localStorage.setItem("selectedClds",JSON.stringify(CFMultiUserMove));
        },
        complete: function (xhr) {
            if (xhr.status > 300) {
                unCheckFile();
                //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError});
                showNotyNotification("error","Operation Failed");
            }
        }
    });
}
function mappedCldsGet() {
    $.ajax({
        type: 'GET',
        data:"userId="+localStorage.getItem("UserId")+"&fromAdminId="+localStorage.getItem('mulUsrSrc')+"&toAdminId="+localStorage.getItem('mulUsrDst'),
        url: apicallurl + "/move/multiuser/get",
        async:false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
        },
        success: function (data) {
            localStorage.removeItem("mappedClouds");
            if(data && data.cfMultiUserMove){
                localStorage.setItem("mappedClouds",JSON.stringify(data.cfMultiUserMove));
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}
function mappingClouds() {
    var _list=JSON.parse(localStorage.getItem("mappedClouds")),
        mappedObject= {
                      "srcClds":[],
                      "dstClds":[]
                     };
    $("#multiUsrUsrsBox #multiUsrUsrs").html('');
    var DstObj =  JSON.parse(localStorage.getItem("multiUsrDstClds"));
    var SrcObj =  JSON.parse(localStorage.getItem("multiUsrSrcClds"));
    if(DstObj == undefined && DstObj == null && DstObj == [])
    {
        DstObj =  JSON.parse(localStorage.getItem("multiUsrDstCldsMul"));
        SrcObj =  JSON.parse(localStorage.getItem("multiUsrSrcCldsMul"));
    }
    if(_list != undefined && _list != null && _list != [])
    {
        $.each(_list,function(i){
            var srcClds= {
                "userId":_list[i].fromEmailId,
                "id":_list[i].fromCloudId,
                "name":_list[i].fromCloudName,
                "pid":_list[i].fromRootId
            },
            dstClds={
                "userId":_list[i].toEmailId,
                "id":_list[i].toCloudId,
                "pid": _list[i].toRootId,
                "name":_list[i].toCloudName,
            };
            for(var i=0;DstObj != null && i<DstObj.length;i++)
            {
                if(DstObj[i].id == dstClds.id)
                    DstObj.splice(i, 1);
            }
            for(var i=0;SrcObj != null && i<SrcObj.length;i++)
            {
                if(SrcObj[i].id == srcClds.id)
                    SrcObj.splice(i, 1);
            }
            $("#multiUsrUsrsBox #multiUsrUsrs").append('<div style="clear:both;margin-top: 1%;" class="multiUsrCheckSlct"><div style="float: left;width: 8%;margin-top: 1%;"><input type="checkbox" class="multiUsrClass"><img src="../img/drive/'+srcClds.name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulSrc" style="display: block;font-size: 15px;margin-left: 95%;margin-top: -31%" spid="'+srcClds.pid+'" scid="'+srcClds.id+'" sname="'+srcClds.name+'" semail="'+srcClds.userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(srcClds.userId,35)+'</div></div><div style="margin-left: 39%;"><div class="col-sm-3 multiUser_link"><div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><div class="sr-only"></div></div></div><i class="cf-right-dark"></i></div></div><div style="float: left;width: 8%;margin-top: 1%;"><img src="../img/drive/'+dstClds.name +'.png" style="width: 30px;margin-left: 35%;"><div class="mulDst" style="display: block;font-size: 15px;margin-left: 83%;margin-top: -31%" dpid="'+dstClds.pid+'" dcid="'+dstClds.id+'" dname="'+dstClds.name+'" demail="'+dstClds.userId+'">'+ CFManageCloudAccountsAjaxCall.getMaxChars(dstClds.userId,25)+"/FromCloudFuze"+'</div></div><i class="cf-close" id="rmv_Mapd_Usr" style="float: left;margin-top: 18px;margin-left: 31%;cursor: pointer"></i></div>');
        });
        $('#multiUsrUsrsBox').css("display","block");
        localStorage.setItem("multiUsrSrcCldsMul",JSON.stringify(SrcObj));
        localStorage.setItem("multiUsrDstCldsMul",JSON.stringify(DstObj));
        localStorage.setItem("multiUsrSrcClds",JSON.stringify(SrcObj));
        localStorage.setItem("multiUsrDstClds",JSON.stringify(DstObj));
        movedClds();
        return true;
    }
    else
        return false;
}
function delMapdClds(){
    var _mappedSrc=[],_mappedDst=[];
    $("#multiUsrUsrsBox .mulSrc").each(function()
    {
        _mappedSrc.push($(this).attr("scid"));
    });
    $("#multiUsrUsrsBox .mulDst").each(function()
    {
        _mappedDst.push($(this).attr("dcid"));
    });
    $("#moveSource .multiUsrDraggable .move").each(function(){
        for(var i=0;i<_mappedSrc.length;i++)
        {
            if($(this).attr("cid") == _mappedSrc[i])
                $(this).parents(".multiUsrDraggable").html('');
        }
    });
    $("#moveDestination .multiUsrDroppable .move").each(function(){
        for(var i=0;i<_mappedDst.length;i++)
        {
            if($(this).attr("cid") == _mappedDst[i])
                $(this).parents(".multiUsrDroppable").html('');
        }
    });
}

// $("#CFmulUsrmoveStatus").find(".btn-primary").click(function(){
//     window.location.href = "settings.html#upgrade";
// });

function chkMultiUserPaid(){
    var _isMultiUserPaid = true;
    $.ajax({
        type: 'GET',
        url: apicallurl + "/subscription/multiuser/get/" + localStorage.getItem("UserId"),
        async:false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
        },
        success: function (data) {
            if(data[0].subscriptionStatus == "MULTIUSER_ACTIVE")
                _isMultiUserPaid = true;
        },
        error: function (data) {
        }
    });
   return _isMultiUserPaid;
}