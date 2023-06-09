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
$("#mapdUsers").on("change","input[name=inputMapdUrs]",function () {
    //  localStorage.removeItem("selectedMappings");
    localStorage.removeItem("validator");
    // localStorage.removeItem("selMappings");
    if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length>0) {
        var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="inputMapdUrs"]:checked').length;
        var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="inputMapdUrs"]').length;
    }
    else if ($('#mapdUsers input[name= "folderMapngCheckBox"]').length>0) {
        var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
        var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
    }
    else {
        var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length;
        var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length;
    }
    if (checkedLength == totalLength) {
        $('#chkInput').prop('checked', true);
    } else {
        $('#chkInput').prop('checked', false);
    }
    var _d = $(this).parent().parent();

        if($(_d).attr('srccldname') ==="DROPBOX_BUSINESS" && $(_d).attr('dstncldname')==="G_SUITE"){
            var _obj ={
                "fromCloudId": {
                    "id":$(_d).attr('srccldid'),
                },
                "toCloudId": {
                    "id":$(_d).attr('dstncldid'),
                },
                "teamFolder":$(_d).attr('teamFolder')
            };
        }

    else {
        var _obj = {
            "fromCloudId": {
                "id": $(_d).attr('srccldid'),
            },
            "toCloudId": {
                "id": $(_d).attr('dstncldid'),
            }
        };
    }
    var _objEmail ={
        "fromMailId": $(_d).attr('srcemail'),
        "fileName":$(_d).attr('srcemail'),
        "toMailId": $(_d).attr('dstnemail'),
        "fromCloudName":$(_d).attr('srccldname'),
        "toCloudName":$(_d).attr('dstncldname'),

    };
    if($(this).is(':checked')){
        mappingOptions.localStorageOperation(_obj,'set');
        mappingOptions.localStorageOperation(_objEmail,'set1');
    }

    else{
        mappingOptions.localStorageOperation(_obj,'delete');
        mappingOptions.localStorageOperation(_objEmail,'delete1');

    }


    if((localStorage.selectedMappings != undefined && localStorage.getItem("selectedMappings").length > 10)||($('#mapdUsrs input[name="csvMapngCheckBox"]').prop('checked') == true || $('#mapdUsrs input[name="inputMapdUrs"]').prop('checked') == true))
        $("#forNextMove").removeClass("disabled"); //$('#mapdUsers input[name=inputMapdUrs]:checked').length ||
    else
        $("#forNextMove").addClass("disabled");
});
$("#forNextMove").click(function () {

    $(".ui-helper-hidden-accessible").hide();
    $("#forPreviousMove").removeClass("disabled");
    $("#forNextMove").addClass("disabled");
   // $("#preview").css("display","none");
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
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
        if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length)
            $("#forNextMove").removeClass("disabled");

        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    }
    else if(_step == 2){
        dataLimit();
        $("#srcUsrs .custom-search-input input").val('');
        $("#mapdUsrs .custom-search-input input").val('');
        $("#dstnUsrs .custom-search-input input").val('');
        $("#CFShowLoading").modal("show");
        mappingOptions.localStorageOperation('','rmv');
        mappingOptions.folderOperation('','rmv');
        CsvOperation('','rmv');
        fldrStorage('','rmv');
        fldrStorage('','rmv1');
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
        var _srcCld = _cldDtls.srcCldName.split(".")[0];
        var _dstnCld = _cldDtls.dstCldName.split(".")[0];
	if(_dstnCld === "SHAREPOINT_ONLINE_HYBRID"){
		if(_srcCld == "BOX_BUSINESS" || _srcCld == "GOOGLE_SHARED_DRIVES"){
				$('#notBoxtoSpoh').modal('hide');
		}
		else{
	$("#CFShowLoading").modal("hide");
		setTimeout(function(){	
	$('#notBoxtoSpoh').modal('show');
	},1000);
	$("#forNextMove").removeClass("disabled");
	return false;
		}
	}
	else if(_dstnCld === "ONEDRIVE_BUSINESS_ADMIN_HYBRID" && _srcCld !== "BOX_BUSINESS"){
	$("#CFShowLoading").modal("hide");
		setTimeout(function(){	
	$('#notBoxtoSpoh').modal('show');
	},1000);
	$("#forNextMove").removeClass("disabled");
	return false;
	}
	else if(_srcCld === "SHAREPOINT_ONLINE_HYBRID"){
	$("#CFShowLoading").modal("hide");	
	setTimeout(function(){
	$('#notBoxtoSpoh').modal('show');
	},1000);
	$("#forNextMove").removeClass("disabled");
	return false;
	}
	else if(_srcCld === "ONEDRIVE_BUSINESS_ADMIN_HYBRID"){
	$("#CFShowLoading").modal("hide");
	setTimeout(function(){	
	$('#notBoxtoSpoh').modal('show');
	},1000);
	$("#forNextMove").removeClass("disabled");
	return false;
	}
	else{
	$('#notBoxtoSpoh').modal('hide');	
	}
	
        if(_srcCld === "ONEDRIVE_BUSINESS_ADMIN" && _dstnCld === "DROPBOX_BUSINESS"){
            $("#csvFileUpload").css("display","none");
            $("#csvFileDownload").css("display","none");
            $("#sortngSrc").css("display","none");
            $("#sortngDstn").css("display","none");
            $("#help").css("display","none");
        }
        else{
            $("#csvFileUpload").css("display","");
            $("#csvFileDownload").css("display","");
            $("#sortngSrc").css("display","");
            $("#sortngDstn").css("display","");
            $("#help").css("display","");
             $('#help').css('visibility', 'hidden');
        } 
        if((_srcCld === "BOX_BUSINESS" && _dstnCld === "GOOGLE_SHARED_DRIVES")||(_srcCld === "BOX_BUSINESS" && _dstnCld === "SHAREPOINT_ONLINE_BUSINESS") || (_srcCld === "DROPBOX_BUSINESS" && _dstnCld === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcCld === "BOX_BUSINESS" && _dstnCld === "SHAREPOINT_ONLINE_HYBRID")|| (_srcCld == "GOOGLE_SHARED_DRIVES" && _dstnCld== "SHAREPOINT_ONLINE_BUSINESS")|| (_srcCld == "GOOGLE_SHARED_DRIVES" && _dstnCld== "SHAREPOINT_ONLINE_HYBRID")|| (_srcCld === "DROPBOX_BUSINESS" && _dstnCld === "GOOGLE_SHARED_DRIVES")|| (_srcCld === "EGNYTE_ADMIN" && _dstnCld === "GOOGLE_SHARED_DRIVES")|| (_srcCld === "SHAREFILE_BUSINESS" && _dstnCld === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcCld === "DROPBOX_BUSINESS" && _dstnCld === "AMAZON")|| (_srcCld=== "SHAREFILE_BUSINESS" && _dstnCld=== "GOOGLE_SHARED_DRIVES")) 
            $('#mapdUsrs .fa-exchange').addClass('disabled'); 
        else
            $('#mapdUsrs .fa-exchange').removeClass('disabled');

        localStorage.setItem("multiUsrSrcCldName",_cldDtls.srcCldName.split(".")[0]);
        localStorage.setItem("multiUsrDstnCldName",_cldDtls.dstCldName.split(".")[0]);
        pgngOptions.setCldImg(_cldDtls);
        sessionStorage.removeItem('source');
        sessionStorage.removeItem('destination');
        appendMappingScreenHtml( $($srcChkd).attr("id"),"source");
        appendMappingScreenHtml( $($dstChkd).attr("id"),"destination");
        csvMappings = false;
        appendingPrevMapping();
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","");
        $('#mappingOptions').css("display","none");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");

        if(($('#mapdUsers input[name=inputMapdUrs]:checked').length)||($('#mapdUsers input[name=csvMapngCheckBox]:checked').length)){
            $("#forNextMove").removeClass("disabled");
	}
        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
        $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
		if(_srcCld === "DROPBOX_BUSINESS" && _dstnCld === "AMAZON"){
		setTimeout(function(){$("#dstnUsrs .forDomainName i").trigger('click');},500);
		}
    }
    else if(_step == 3){
        trialUserMigration();
        if (localStorage.getItem('NoAdmin') ){
            $("#Teamfolders_Yes").prop("checked", false);
            $("#Teamfolders_No").prop("checked", true);
            $("#teamYescont").css("display","none");
            $("#teamNocont").css("display","");
        } else {
            $("#Teamfolders_Yes").prop("checked", true);
            $("#Teamfolders_No").prop("checked", false);
            $("#teamYescont").css("display","");
            $("#teamNocont").css("display","none");
			}


    }
    else if(_step == 4){
        $("#CFShowLoading").modal('show');
        if(mappingOptions.updateJob()){
            $("#forNextMove").removeClass("disabled");

            $("#mappingClouds").css("display","none");
            $("#mappingUsers").css("display","none");
            $('#mappingOptions').css("display","none");
            $('#mappingOptionsNew').css("display","none");
            $("#preview").css("display","");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","none");

            $("#forNextMove").css({"width": "140px", "margin-left": "90%"});
            $("#forNextMove span").text("Start Migration");

            $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
            $("#forNextMove").attr("data-step",_step);
            $("#forPreviousMove").attr("data-prev",_step );
            $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
			setTimeout(function(){
			$("#CFShowLoading").modal('hide');	
			},1000);
        }
      

    }
    else if(_step == 5){
        var _isExists = false;
        $('div.prvsnStatus:contains("Not Provisioned")').each(function () { 
            _isExists=true;
        });
        if(_isExists){
            alertSuccess("Non provisoned users will not migrate");
        }
        if($('#jobType_dropDown :selected').text() === "One-way sync" || $('#jobType_dropDown :selected').text() === "Two-way sync"){
            syncUsers();
            $('#mappedSyncMigration').css("display","");
        }
        else {
			 $('.alertScs .msg').css("margin-top","-2%");
             alertSuccess("Your migration has been initiated. You can monitor it here or log off and see the migration report that will be emailed to you.");
			setTimeout(function(){
            mappingOptions.migrationInitiation(localStorage.getItem("jobId"));
			},2000);
			setTimeout(function(){
			$("#CFShowLoading").modal('hide');	
			},200);
			
         //   $('#mappedMigration').css("display","");
        }
	/*	$("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
        $("#preview").css("display","none");
		$("#forNextMove span").text("Next");
        $("#forNextMove").css({"width": "83.5px", "margin-left": ""});
        $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
        $("#forNextMove").attr("data-step",_step);
        $("#forPreviousMove").attr("data-prev",_step );
	$("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");*/
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
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
        $("#teamMigrationWidget ul li[data-val='1']").addClass("active");
        $("#teamMigrationWidget ul li").removeClass("active").removeClass("completed");
        if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length)
            $("#forNextMove").removeClass("disabled");
    }
    else if(_step == 2){
        localStorage.removeItem("_admin");
        localStorage.removeItem("normalUser");
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
    else if(_step == 3){
        // trialUserMigration();
        //  syncVerification();
        //mappingOptions.createJob();
        //  $("#CFShowLoading").modal("show");
        $("#jobEmptyPopup").css("display","none");
        $('.Editing_Jobname').attr("disabled","disabled");
        $("#checkTimediv").css("display","none");
        $(".Job_NAme").css("display","");
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
     /*   if(localStorage.getItem("multiUsrSrcCldName") === "DROPBOX_BUSINESS" && localStorage.getItem("multiUsrDstnCldName") === "ONEDRIVE_BUSINESS_ADMIN"){
            if((JSON.parse(localStorage.getItem("CFUser")).version === undefined)&& JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined) {
                $('#mappingOptionsNew #jobNewOptions').css("display", "");
            }
            else if((JSON.parse(localStorage.getItem("CFUser")).version !== undefined)|| JSON.parse(localStorage.getItem("CFUser")).fileFolderLink !== undefined){
                if(JSON.parse(localStorage.getItem("CFUser")).version === true || JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true )
                    $('#mappingOptionsNew #jobNewOptions').css("display","none");
                else
                    $('#mappingOptionsNew #jobNewOptions').css("display","");
            }
            else if(JSON.parse(localStorage.getItem("CFUser")).version === undefined){
                if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true )
                    $('#mappingOptionsNew #jobNewOptions').css("display","none");
                else
                    $('#mappingOptionsNew #jobNewOptions').css("display","");
            }
            else if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined){
                if(JSON.parse(localStorage.getItem("CFUser")).version === true )
                    $('#mappingOptionsNew #jobNewOptions').css("display","none");
                else
                    $('#mappingOptionsNew #jobNewOptions').css("display","");
            }

            $('#mappingOptionsNew').css("display","");
        }
        else{*/
            $('#mappingOptions').css("display","");
        //}
        $("#preview").css("display","none");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
    }
    else if(_step == 4){
        $("#forNextMove").removeClass("disabled");

        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","none");
        $('#mappingOptions').css("display","none");
        $('#mappingOptionsNew').css("display","none");
        $("#preview").css("display","");
        $('#mappedMigration').css("display","none");
        $('#mappedSyncMigration').css("display","none");
    }
    else if(_step == 5){
        refreshReports();
        // var _mappingSrcUrs = $('#mapdUsers input:checked');
        // var _pricing = initiateMigration(_mappingSrcUrs);
        // if(_pricing){
        //     setTimeout(function () {
        //         refreshReports();
        //         $("#mappingClouds").css("display","none");
        //         $("#mappingUsers").css("display","none");
        //         $('#mappedMigration').css("display","");
        //     },500);
        // }
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
        /* if(_step == 0)
         return false;
         else if(_step == 1){
         $("#forPreviousMove").addClass("disabled");
         $("#mappingClouds").css("display","");
         $("#mappingUsers").css("display","none");
         $('#mappedMigration').css("display","none");
         $('#mappingOptions').css("display","none");
         if($("#srcClouds input:checked").length && $("#dstClouds input:checked").length)
         $("#forNextMove").removeClass("disabled");
         }
         else if(_step == 2){
         $("#mappingClouds").css("display","none");
         $("#mappingUsers").css("display","");
         $('#mappedMigration').css("display","none");
         $('#mappingOptions').css("display","none");
         if($('#mapdUsers input[name=inputMapdUrs]:checked').length)
         $("#forNextMove").removeClass("disabled");
         }
         else if(_step == 3){
         mappingOptions.createJob();
         }
         else if(_step == 4){
         $("#forNextMove").removeClass("disabled");

         $("#mappingClouds").css("display","none");
         $("#mappingUsers").css("display","none");
         $('#mappingOptions').css("display","none");
         $("#preview").css("display","");
         $('#mappedMigration').css("display","none");
         }
         else if(_step == 5){
         // mappingOptions.migrationInitation();
         // $("#mappingClouds").css("display","none");
         // $("#mappingUsers").css("display","none");
         // $('#mappedMigration').css("display","");
         refreshReports();
         }*/
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
            localStorage.removeItem("_admin");
            localStorage.removeItem("normalUser");
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
        else if(_step == 3){
            //  syncVerification();
            //trialUserMigration();
            $("#mappingClouds").css("display","none");
            $("#mappingUsers").css("display","none");
            // if((localStorage.getItem("multiUsrSrcCldName") === "ONEDRIVE_BUSINESS_ADMIN" && (localStorage.getItem("multiUsrDstnCldName") === "DROPBOX_BUSINESS"))||(localStorage.getItem("multiUsrSrcCldName") === "DROPBOX_BUSINESS" && localStorage.getItem("multiUsrDstnCldName") === "ONEDRIVE_BUSINESS_ADMIN")){
            if(localStorage.getItem("multiUsrSrcCldName") === "DROPBOX_BUSINESS" && localStorage.getItem("multiUsrDstnCldName") === "ONEDRIVE_BUSINESS_ADMIN"){
                if((JSON.parse(localStorage.getItem("CFUser")).version === undefined)&& JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined) {
                    $('#mappingOptionsNew #jobNewOptions').css("display", "");
                }
                else if((JSON.parse(localStorage.getItem("CFUser")).version !== undefined)|| JSON.parse(localStorage.getItem("CFUser")).fileFolderLink !== undefined){
                    if(JSON.parse(localStorage.getItem("CFUser")).version === true || JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true )
                        $('#mappingOptionsNew #jobNewOptions').css("display","none");
                    else
                        $('#mappingOptionsNew #jobNewOptions').css("display","");
                }
                else if(JSON.parse(localStorage.getItem("CFUser")).version === undefined){
                    if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true )
                        $('#mappingOptionsNew #jobNewOptions').css("display","none");
                    else
                        $('#mappingOptionsNew #jobNewOptions').css("display","");
                }
                else if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined){
                    if(JSON.parse(localStorage.getItem("CFUser")).version === true )
                        $('#mappingOptionsNew #jobNewOptions').css("display","none");
                    else
                        $('#mappingOptionsNew #jobNewOptions').css("display","");
                }
                $('#mappingOptionsNew').css("display","");

            }
            else{
                $('#mappingOptions').css("display","");
            }
            $("#preview").css("display","none");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","none");
            $("#forNextMove").removeClass("disabled");
        }
        else if(_step == 4){
            $("#forNextMove").removeClass("disabled");

            $("#mappingClouds").css("display","none");
            $("#mappingUsers").css("display","none");
            $('#mappingOptions').css("display","none");
            $('#mappingOptionsNew').css("display","none");
            $("#preview").css("display","");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","none");
            $("#forNextMove").css({"width": "140px", "margin-left": "90%"}); 
            $("#forNextMove span").text("Start Migration");
        }
        else if(_step == 5){
            refreshReports();
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
function getDomainUserDetails(cid,pgNo,pgSize,searchCloudUser) {
    if(pgNo == undefined)
        pgNo = 1;
    if(pgSize == undefined )
        pgSize = 10;
    var _data = "cloudId="+cid+"&pageNo="+pgNo+"&pageSize="+pgSize;
    if(searchCloudUser != undefined)
        _data=_data+"&searchCloudUser="+searchCloudUser;
    var _usrsList;
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/user/domain/list?" + _data,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
            _usrsList = data;
        }
    });
    return _usrsList;
}
function   appendMappingScreenHtml(cldId,target,pgNo,pgSize,searchCloudUser){
    if(searchCloudUser == undefined)
        migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),pgNo, pgSize,target);
    else{
        searchCloudUser = searchCloudUser.toLowerCase();
        migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),pgNo, pgSize,target,searchCloudUser); // if(searchCloudUser != undefined)
    }
}

function userMappingDisable( id, target){
    if(target == 'source')
        $("#srcUsrs input[cloudid=" + id+ "]").attr('disabled',true).parent().parent("div").addClass('selectedClass');
    else if(target == 'destination')
        $("#dstnUsrs input[cloudid=" + id+ "]").attr('disabled',true).parent().parent("div").addClass('selectedClass');
}
function  appendingPrevMapping(pageNo,pageSize) {
    if(pageNo == undefined)
        pageNo = 1;

    pageSize = parseInt($('#mapdUsrs select').val());
    var  _sortFun = migrationMapping.sortBy();

    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/user/cache/list?sourceCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destCloudId=" + localStorage.getItem("multiUsrDstnCldId") + "&pageNo=" + pageNo +"&pageSize=" + pageSize + _sortFun,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
            $("#mapdUsers tbody").html('');
            $("#chkInput").removeAttr("checked");
            var _len = data.length;
            if(_len == 0 && pageNo == 1){
                var _txt = "0 of 0";
                $("#mapdUsrs .paginationDiv").css("opacity","0.6");
                $('#mapdUsrs .paginationDiv select').prop('disabled', true);
                $('#mapdUsrs .paginationDiv input').prop('disabled', true);

                $("#mapdUsrs .paginationCF input").val(0);
                $("#mapdUsrs .paginationCF span").last().text(_txt );
            }
            if( _len == 0){
                $(document).find("#chkInput").attr("disabled", true).prop( "checked", false );
                if(pageNo != 1)
                    $("#CFShowLoading").modal("hide");
                $('.download').css('pointer-events', 'none');
                $('.download').css('opacity', '0.5');
                $('#help').css('visibility', 'hidden');
                $('#csvFileUpload').removeClass('onlyCsv');
                $("#clearBtn").css("pointer-events",'none');
                $("#clearBtn").css("cursor","not-allowed");
                $("#clearBtn").css("opacity","0.6");
                return false;
            }
            for(var i=0;i<_len;i++){
                var _dataVal = data[i];
                var csvID = _dataVal.csvId;
                var _teamFldr = _dataVal.teamFolder;
                var csvName =  _dataVal.csvName;
                var migrateDstnFolderName = _dataVal.migrateFolderName;
                var _srcUsrDetails =  {
                    "userEmail": _dataVal.sourceCloudDetails.emailId,
                    "userCloudName": _dataVal.sourceCloudDetails.name,
                    "userCloudId": _dataVal.sourceCloudDetails.id,
                    "userRtFolId": _dataVal.sourceCloudDetails.rootFolderId,
                    "folderPath": _dataVal.sourceCloudDetails.folderPath,
                    "srcPathRootFolderId": _dataVal.sourceCloudDetails.pathRootFolderId,
                    "migrateSrcFolderName": _dataVal.sourceCloudDetails.migrateFolderName

                }
                var _dstnUsrDetails =  {
                    "dstnUserEmail": _dataVal.destCloudDetails.emailId,
                    "dstnUserCloudName":_dataVal.destCloudDetails.name ,
                    "dstnUserCloudId":_dataVal.destCloudDetails.id,
                    "dstnUserRtFolId": _dataVal.destCloudDetails.rootFolderId,
                    "dstnFolderPath": _dataVal.destCloudDetails.folderPath,
                    "dstnPathRootFolderId": _dataVal.destCloudDetails.pathRootFolderId
                }
                if ((_srcUsrDetails.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnUsrDetails.dstnUserCloudName === "DROPBOX_BUSINESS") || (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (_srcUsrDetails.userCloudName === "GOOGLE_SHARED_DRIVES" && _dstnUsrDetails.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
                    if (_srcUsrDetails.folderPath === null && _dstnUsrDetails.dstnFolderPath === null) {
                        _srcUsrDetails.folderPath = '/';
                        _dstnUsrDetails.dstnFolderPath = '/';
                    }
                    var isFolder = true;

                    for(j=0;j<data.length;j++){
                        if(data[j].csvId !== 0){
                            csvID = data[j].csvId;
                            $('#csvFileUpload').addClass('onlyCsv');
                        }
                    }
			var _parentName = _dataVal.documentLibrary;  
                    mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails, csvID,_teamFldr, csvName, migrateDstnFolderName, undefined, isFolder,'',_dataVal.duplicateCache,_dataVal.pathException,_parentName);

                }
                else{
                    $("input[cloudid=" + _srcUsrDetails.userCloudId + "]").attr('disabled',true).parent().parent().addClass("selectedClass");
                    $("input[cloudid=" + _dstnUsrDetails.dstnUserCloudId + "]").attr('disabled',true).parent().parent().addClass("selectedClass");
                    $('.download').css('pointer-events', 'none');
                    $('.download').css('opacity', '0.5');
                    $('#help').css('visibility', 'hidden');
                    $('#csvFileUpload').removeClass('onlyCsv');
                    mapdSlectedUrs(_srcUsrDetails,_dstnUsrDetails,csvID,_teamFldr,csvName,migrateDstnFolderName);


                }
            }
   if ((_srcUsrDetails.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnUsrDetails.dstnUserCloudName === "DROPBOX_BUSINESS") || (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(_srcUsrDetails.userCloudName === "GOOGLE_SHARED_DRIVES" && _dstnUsrDetails.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
  if ($('#mapdUsers input[name= "inputMapdUrs"]').length > 0) {
  if(localStorage.getItem('selectedMappings')) {
        if (!JSON.parse(localStorage.getItem('selectedMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
			    var totLen = totalLength;
                        } else {
 if(localStorage.getItem('folderMappings')) {
        if (!JSON.parse(localStorage.getItem('folderMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length;
 var totLen = totalLength;
                        }
                        if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
			  if(localStorage.getItem('FolderChecked')) {
        if (!JSON.parse(localStorage.getItem('FolderChecked')).length)
            $("#forNextMove").addClass("disabled");
    }
                            var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
 var totLen = totalLength;
                        } else {
 if(localStorage.getItem('folderMappings')) {
        if (!JSON.parse(localStorage.getItem('folderMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length;
			    var totLen = totalLength  - $('#mapdUsers input[name= "folderMapngCheckBox"]:disabled').length;
                        }
                        if (checkedLength == totLen) {
                            $('#chkInput').prop('checked', true);

                        } else {
                            $('#chkInput').prop('checked', false);
                        }
}
else{
  if ($('#mapdUsers input[name= "inputMapdUrs"]').length > 0) {
  if(localStorage.getItem('selectedMappings')) {
        if (!JSON.parse(localStorage.getItem('selectedMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
  if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
			  if(localStorage.getItem('FolderChecked')) {
        if (!JSON.parse(localStorage.getItem('FolderChecked')).length)
            $("#forNextMove").addClass("disabled");
    }
                            var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
    if (checkedLength == totalLength) {
                            $('#chkInput').prop('checked', true);

                        } else {
                            $('#chkInput').prop('checked', false);
                        }
}

if(_srcUsrDetails.userCloudName === "BOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN"){
	 $('.download12').css('display', 'block');
	 $('.download12').css('pointer-events', 'none');
                    $('.download12').css('opacity', '0.4');
	 if($('#mapdUsers tr').hasClass('automapRow') == true){
					$('.download12').css('pointer-events', 'auto');
                    $('.download12').css('opacity', '1');
	 }			
			}
            if(pageNo == 1){
                $('#paginationMapng').empty();
                $('#paginationMapng').removeData("twbs-pagination");
                $('#paginationMapng').unbind("page");
                
                $("#mapdUsrs .paginationDiv input").val(1);
               
            }
             var _selInptVal = $('#mapdUsrs select').val();
            var _totPages = Math.ceil(data[0].noOfMappedCloudPressent/_selInptVal);

            var _txt = pageNo + " of " + _totPages;

            $("#mapdUsrs .paginationCF span").last().text(_txt );
            $("#mapdUsrs .paginationCF input").val(pageNo );

            $("#mapdUsrs .paginationCF span").last().text(_txt);
            if( $("#mapdUsers tbody tr input[name=inputMapdUrs]:checked").length == 30 ){
                $("#chkInput").prop('checked', true);
            }

            if( $('#mapdUsers input[name= "csvMapngCheckBox"]').length >0) {
                var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="inputMapdUrs"]:checked').length;
                var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="inputMapdUrs"]').length;
            }
            else{
                var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length;
                var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length;
            }
            if(totalLength !==0){
                if (checkedLength == totalLength) {
                    $('#chkInput').prop('checked', true);
                }
                else{
                    $('#chkInput').prop('checked', false);
                }
            }


            setTimeout(function(){
                if($("#CFShowLoading").attr("autoMap") != "false")
                    $("#CFShowLoading").modal("hide");
            }, 2000);
        }
    });
}
$(document).on('click','#srcUsrs .forDomainName i',function() {
    $("#srcUsrs .forDomainNameMin").css("display","none");
    $("#srcUsrs .forDomainName").css("display","block");
    var _class = $(this).parents("div.forDomainName").attr("class").split(" ")[1];
    var $rmvUsrs = $(document.getElementById("srcCloudUsers").getElementsByClassName(_class));
    migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), 1, 10, "source", $rmvUsrs[1]);
});
$(document).on('click','#dstnUsrs .forDomainName i',function() {
    $("#dstnUsrs .forDomainNameMin").css("display","none");
    $("#dstnUsrs .forDomainName").css("display","block");
    var _class = $(this).parents("div.forDomainName").attr("class").split(" ")[1];
    var $rmvUsrs = $(document.getElementById("dstCloudsUsers").getElementsByClassName(_class));
    migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), 1, 10, "destination", $rmvUsrs[1]);
    
});

var typingTimer;
//check input box empty and Enter key-press
$(document).find("#srcUsrs .custom-search-input input").keyup(function(e){
    if($(this).val().length == 0){
        var searchData = JSON.parse(localStorage.getItem("searchData"));
        searchData.source = false;
        localStorage.setItem("searchData",JSON.stringify(searchData));
        $(".ui-autocomplete.source").css("display","none");
        appendMappingScreenHtml( localStorage.getItem("multiUsrSrcCldId"),"source",1,10,$(this).val().trim());
    }
    else if( e.which == 13){


        var searchData = JSON.parse(localStorage.getItem("searchData"));
        searchData.source = true;
        localStorage.setItem("searchData",JSON.stringify(searchData));
        appendMappingScreenHtml(localStorage.getItem("multiUsrSrcCldId"),"source",1,10,$(this).val().trim());
        return;
    }
    if($(this).val().length &&((e.key != "ArrowLeft" && (e.key != "ArrowRight")))){
        localStorage.setItem('searchVal',$(this).val().trim());
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            var s = localStorage.getItem('searchVal');
            migrationMapping.autoComplete('source',s);

        }, 100);
    }
});
$(document).find("#srcUsrs .custom-search-input input").keypress(function(e){
    if($(this).val().length == 0){
        migrationMapping.autoComplete( "source",e.key);
    }
    else if((e.which == 13) || (e.keyCode == 8))
        $(".ui-autocomplete").css("display","none");

});
$(document).find("#dstnUsrs .custom-search-input input").keyup(function(e){
    if($(this).val().length == 0){
        var searchData = JSON.parse(localStorage.getItem("searchData"));
        searchData.destination = false;
        localStorage.setItem("searchData",JSON.stringify(searchData));
        $(".ui-autocomplete.destination").css("display","none");
        appendMappingScreenHtml(localStorage.getItem("multiUsrDstnCldId"),"destination");
    }
    else if( e.which == 13){

        var searchData = JSON.parse(localStorage.getItem("searchData"));
        searchData.destination = true;
        localStorage.setItem("searchData",JSON.stringify(searchData));
        appendMappingScreenHtml(localStorage.getItem("multiUsrDstnCldId"),"destination",1,10,$(this).val().trim());
        return;
    }
    if($(this).val().length){
        localStorage.setItem('searchVal',$(this).val().trim());
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            var s = localStorage.getItem('searchVal');
            migrationMapping.autoComplete('destination',s);

        }, 100);
    }

    // else if($(this).val().length == 1)
    //     migrationMapping.autoComplete( "destination",$(this).val());
});
$(document).find("#dstnUsrs .custom-search-input input").keypress(function(e){
    if($(this).val().length == 0){
        $(".ui-autocomplete.destination").css("display","none");
        migrationMapping.autoComplete( "destination",e.key);
    }
    else if( e.which == 13)
        $(".ui-autocomplete").css("display","none");
});
$(document).find("#mappedMigration .custom-search-input input").keyup(function(e){
    if($(this).val().length == 0){
        $(".ui-autocomplete.mapping").css("display","none");
        refreshReports();
    }
    else if( e.which == 13)
        mappingOptions.searchJobByName($(this).val());
});
$(document).find("#mappedSyncMigration .custom-search-input input").keyup(function(e){
    if($(this).val().length == 0){
        $(".ui-autocomplete.mapping").css("display","none");
        refreshReports();
    }
    else if( e.which == 13)
        mappingOptions.searchJobByName($(this).val());
});
$(document).find("#mapdUsrs .custom-search-input input").keyup(function(e){
    if($(this).val().length == 0)
    {
        if((e.key == "Control") ||(e.key == "Shift")|| (e.key == "Alt")){
            return false;
        }
        $(".ui-autocomplete.mapping").css("display","none");
        $("#mapdUsers tbody").html('');

        var searchData = JSON.parse(localStorage.getItem("searchData"));
        searchData.mapping = false;
        localStorage.setItem("searchData",JSON.stringify(searchData));
         appendingPrevMapping();
    }
    else if( e.which == 13){
        var searchData = JSON.parse(localStorage.getItem("searchData"));
        searchData.mapping = true;
        localStorage.setItem("searchData",JSON.stringify(searchData));
        autoMappingSearch($(this).val().trim());

        return;
    }
    if($(this).val().length){
        localStorage.setItem('searchVal',$(this).val().trim());
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            var s = localStorage.getItem('searchVal');
            migrationMapping.autoComplete('mapping',s);

        }, 100);
    }
});

/*... Mapped-Users keydown for firefox ...*/
$(document).find("#mapdUsrs .custom-search-input input").keydown(function(e){
    if(e.key == "Control" || e.key == "Shift" || e.key == "Alt"){
        e.preventDefault();
        return false;
    }
});

$(document).find("#mapdUsrs .custom-search-input input").keypress(function(e){
    if($(this).val().length == 0) {
        $(".ui-autocomplete.mapping").css("display","none");
        migrationMapping.autoComplete( "mapping",e.key);
    }
    else if( e.which == 13)
        $(".ui-autocomplete").css("display","none");
});
$(document).on('click','#srcUsrs .forDomainNameMin .fa-plus',function() {
    $("#srcUsrs .forDomainNameMin").css("display","none");
    $("#srcUsrs .forDomainNameMin").find('.fldr_parent1').css("display","none");
    $("#srcUsrs .forDomainNameMin").find('span.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
    $("#srcUsrs .forDomainName").css("display","block");
});
$(document).on('click','#srcUsrs .forDomainNameMin .fa-minus',function() {
    if($(".sourceChkBox").prop('checked',true)){
        $(".sourceChkBox").prop('checked',false);
    }
    $("#srcUsrs .forDomainNameMin").find('.usr-folder').removeClass('fa-angle-up').addClass('fa-angle-down');
    $("#srcUsrs .forDomainNameMin").css("display","none");
    $("#srcUsrs .forDomainNameMin").find('.fldr_parent1').css("display","none");
    $("#srcUsrs .forDomainNameMin").find('span.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
    $("#srcUsrs .forDomainName").css("display","block");
});
$(document).on('click','#dstnUsrs .forDomainNameMin .fa-plus',function() {
    $("#dstnUsrs .forDomainNameMin").css("display","none");
    $("#dstnUsrs .forDomainNameMin").find('.fldr_parent1').css("display","none");
    $("#dstnUsrs .forDomainNameMin").find('span.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');

    $("#dstnUsrs .forDomainName").css("display","block");
});
$(document).on('click','#dstnUsrs .forDomainNameMin .fa-minus',function() {
    if($("input[name='folderradiobtn']:checked")){
        $("input:radio").removeAttr("checked");
    }
    $("#dstnUsrs .forDomainNameMin").find('.usr-folder').removeClass('fa-angle-up').addClass('fa-angle-down');
    $("#dstnUsrs .forDomainNameMin").css("display","none");
    $("#dstnUsrs .forDomainNameMin").find('.fldr_parent1').css("display","none");
    $("#dstnUsrs .forDomainNameMin").find('span.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
    $("#dstnUsrs .forDomainName").css("display","block");
});
$(document).on('click','#srcUsrs .custom-search-input button',function(){
    if(!$("#srcUsrs .custom-search-input input").val().length)
        return false;

    var searchData = JSON.parse(localStorage.getItem("searchData"));
    searchData.source = true;
    localStorage.setItem("searchData",JSON.stringify(searchData));
    appendMappingScreenHtml(localStorage.getItem("multiUsrSrcCldId"),"source",1,10,$("#srcUsrs .custom-search-input input").val().trim());
});
$(document).on('click','#dstnUsrs .custom-search-input button',function(){
    if(!$("#dstnUsrs .custom-search-input input").val().length)
        return false;

    var searchData = JSON.parse(localStorage.getItem("searchData"));
    searchData.destination = true;
    localStorage.setItem("searchData",JSON.stringify(searchData));
    appendMappingScreenHtml(localStorage.getItem("multiUsrDstnCldId"),"destination",1,10,$("#dstnUsrs .custom-search-input input").val().trim());
});
$(document).on('change','#srcUsrs select',function(){
    if($("#srcUsrs .custom-search-input input").val().length)
        return false;
    appendMappingScreenHtml(localStorage.getItem("multiUsrSrcCldId"),"source",1,$(this).val());

});
$(document).on('change','#dstnUsrs select',function(){
    if($("#dstnUsrs .custom-search-input input").val().length)
        return false;

    appendMappingScreenHtml(localStorage.getItem("multiUsrDstnCldId"),"destination",1,$(this).val());
});
$("#srcCloudUsers,#dstCloudsUsers").on('change','input',function(){
    if($("#srcCloudUsers input:radio:checked").length && $("#dstCloudsUsers input:radio:checked").length){
        var $srcCheckedUsr = $("#srcCloudUsers input:radio:checked");
        var $dstCheckedUsr = $("#dstCloudsUsers input:radio:checked");
        var _srcUsrDetails =  {
            "userEmail": $($srcCheckedUsr).attr("usremail"),
            "userCloudName": $($srcCheckedUsr).attr("cldname"),
            "userCloudId": $($srcCheckedUsr).attr("cloudid"),
            "userRtFolId": $($srcCheckedUsr).attr("rtfolid")
        }

        var _dstnUsrDetails =  {
            "dstnUserEmail": $($dstCheckedUsr).attr("usremail"),
            "dstnUserCloudName": $($dstCheckedUsr).attr("cldname"),
            "dstnUserCloudId": $($dstCheckedUsr).attr("cloudid"),
            "dstnUserRtFolId": $($dstCheckedUsr).attr("rtfolid")
        }
        $($srcCheckedUsr).parent().addClass("selectedClass");
        $($dstCheckedUsr).parent().addClass("selectedClass");
        $($srcCheckedUsr).removeAttr('checked');
        $($dstCheckedUsr).removeAttr('checked');
        mapdSlectedUrs(_srcUsrDetails,_dstnUsrDetails,'prepend');
        var _autoSave = autoSaving(_srcUsrDetails,_dstnUsrDetails);
   if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
	var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="csvMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="csvMapngCheckBox"]').length;
}
else{
var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length;
}
			    if (checkedLength == totalLength) {
                            $('#chkInput').prop('checked', true);

                        } else {
                            $('#chkInput').prop('checked', false);
                        }
    }
});
function mapdSlectedUrs(src,dstn,csvId,_teamFldr,csvName,migrateDstnFolderName,append,isFolder,automap,duplicate,pathException,parentName) {
    $("#mapdUsrs .paginationDiv").css("opacity","1");
    $('#mapdUsrs .paginationDiv select').prop('disabled', false);
    $('#mapdUsrs .paginationDiv input').prop('disabled', false);
    if(csvId === ""){
        csvId = 0;
    }
    if(isFolder === true) {
        if ((src.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && dstn.dstnUserCloudName === "DROPBOX_BUSINESS") || (src.userCloudName === "DROPBOX_BUSINESS" && dstn.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (src.userCloudName === "GOOGLE_SHARED_DRIVES" && dstn.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (src.userCloudName === "DROPBOX_BUSINESS" && dstn.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
            if (csvId !== 0) {
                var _obj = {
                    "fromCloudId": {
                        "id": src.userCloudId,
                    },
                    "toCloudId": {
                        "id": dstn.dstnUserCloudId,
                    },
                    "sourceFolderPath": src.folderPath,
                    "destFolderPath": dstn.dstnFolderPath
                };
            }
            else if(csvId === 0 && isFolder === true && !($('#csvFileUpload').hasClass('onlyCsv'))) {
                var _obj = {
                    "fromCloudId": {
                        "id": src.userCloudId,
                    },
                    "toCloudId": {
                        "id": dstn.dstnUserCloudId,
                    },
                    "sourceFolderPath": src.folderPath,
                    "destFolderPath": dstn.dstnFolderPath,
                    "fromRootId": src.userRtFolId,
                    "toRootId": dstn.dstnUserRtFolId
                };
            }
            else
             {
                var _obj = {
                    "fromCloudId": {
                        "id": src.userCloudId,
                    },
                    "toCloudId": {
                        "id": dstn.dstnUserCloudId,
                    },
                    "sourceFolderPath": src.folderPath,
                    "destFolderPath": dstn.dstnFolderPath,
                    "fromRootId": src.userRtFolId,
                    "toRootId": dstn.dstnUserRtFolId
                };
            }
        }
    }

    else{
        $("#srcCloudUsers input[cloudid=" + src.userCloudId + "]").attr('disabled', true);
        $("#dstCloudsUsers input[cloudid=" + dstn.dstnUserCloudId + "]").attr('disabled',true);
        if(src.folderPath === null || dstn.dstnFolderPath === null || src.folderPath === undefined || dstn.dstnFolderPath === undefined || src.folderPath === "undefined" || dstn.dstnFolderPath === "undefined"){
            var _obj ={
                "fromCloudId": {
                    "id":src.userCloudId,
                },
                "toCloudId": {
                    "id":dstn.dstnUserCloudId,
                }
            };
        }
        else{
            var _obj = {
                "fromCloudId": {
                    "id": src.userCloudId,
                },
                "toCloudId": {
                    "id": dstn.dstnUserCloudId,
                },
                "sourceFolderPath": src.folderPath,
                "destFolderPath": dstn.dstnFolderPath
            };
        }
    }
    var _pathTD = 'FromCloudFuze';
    $(document).find("#chkInput").attr("disabled", false);
    $("#clearBtn").css("pointer-events",'auto');
    $("#clearBtn").css("cursor","pointer");
    $("#clearBtn").css("opacity","1");
    var _input,input;
    if ((src.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && dstn.dstnUserCloudName === "DROPBOX_BUSINESS") || (src.userCloudName === "DROPBOX_BUSINESS" && dstn.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (src.userCloudName === "GOOGLE_SHARED_DRIVES" && dstn.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (src.userCloudName === "DROPBOX_BUSINESS" && dstn.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
        if(src.folderPath === null || dstn.dstnFolderPath === null || src.folderPath === undefined || dstn.dstnFolderPath === undefined || src.folderPath === "undefined" || dstn.dstnFolderPath === "undefined"){
            if(mappingOptions.localStorageOperation(_obj,'check'))
                if(pathException === null || pathException === undefined || pathException === 'null' || pathException === 'undefined')
                    _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs" checked="true"></td>';

                else
                    _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs" disabled="disabled"></td>';
            else
            if(pathException === null || pathException === undefined || pathException === 'null' || pathException === 'undefined')
                _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs"></td>';
            else
                _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs" disabled="disabled"></td>';
        }
        if (src.folderPath !== null || dstn.dstnFolderPath !== null) {
               if(automap =="" || automap == true){
                csvmap =true;
            }
            if (csvId !== 0) {
                if (src.folderPath !== null || dstn.dstnFolderPath !== null) {
                    if (CsvOperation(_obj, 'check')) {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                    } else {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                    }
                }
                if (src.folderPath === null || dstn.dstnFolderPath === null) {
                    if (CsvOperation(_obj, 'check')) {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                    } else {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                    }
                }
              /*  if ((src.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && src.userRtFolId === '/') || (dstn.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN" && dstn.dstnUserRtFolId === '/')) {
                    if (CsvOperation(_obj, 'check')) {
                        input = '<td><input type="checkbox" name="csvMapngCheckBox" checked="true" disabled="disabled"></td>';
                    } else {
                        input = '<td><input type="checkbox" name="csvMapngCheckBox" disabled="disabled"></td>';
                    }
                }*/
            }
            else if(csvId === 0 && isFolder === true && ($("#mapdUsers tbody tr").hasClass("CsvMapd"))){

                    if (src.folderPath !== null || dstn.dstnFolderPath !== null) {
                        if (CsvOperation(_obj, 'check')) {
                            input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                        } else {
                            input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                        }
                    }
                    if (src.folderPath === null || dstn.dstnFolderPath === null) {
                        if (CsvOperation(_obj, 'check')) {
                            input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                        } else {
                            input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                        }
                    }
             /*       if ((src.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && src.userRtFolId === '/') || (dstn.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN" && dstn.dstnUserRtFolId === '/')) {
                        if (CsvOperation(_obj, 'check')) {
                            input = '<td><input type="checkbox" name="csvMapngCheckBox" checked="true" disabled="disabled"></td>';
                        } else {
                            input = '<td><input type="checkbox" name="csvMapngCheckBox" disabled="disabled"></td>';
                        }
                    }*/

            }
            else{
                if (mappingOptions.folderOperation(_obj, 'check'))
                    if (duplicate === true) {
                        input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" disabled="disabled" parentName="'+parentName+'"></td>';
                    } else if (pathException === null || pathException === undefined || pathException === 'null' || pathException === 'undefined')
                        input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" parentName="'+parentName+'" checked="true"></td>';
                    else
                        input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" parentName="'+parentName+'" disabled="disabled"></td>';
                else if (duplicate === true) {
                    input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" parentName="'+parentName+'" disabled="disabled"></td>';
                } else if (pathException === null || pathException === undefined || pathException === 'null' || pathException === 'undefined')
                    input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" parentName="'+parentName+'"></td>';
                else
                    input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" parentName="'+parentName+'" disabled="disabled"></td>';
                if ((src.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && src.userRtFolId === '/') || (dstn.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN" && dstn.dstnUserRtFolId === '/')) {
                    input1 = '<td style="width: 5%;"><input type="checkbox" name="folderMapngCheckBox" disabled="disabled"></td>';
                }
            }
        }
    }
    else if(src.userCloudName ==="DROPBOX_BUSINESS" && dstn.dstnUserCloudName ==="G_SUITE") {

        if (src.folderPath === null || dstn.dstnFolderPath === null || src.folderPath === undefined || dstn.dstnFolderPath === undefined || src.folderPath === "undefined" || dstn.dstnFolderPath === "undefined") {
            if (mappingOptions.localStorageOperation(_obj, 'check'))
                _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs" checked="true"></td>';
            else
                _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs"></td>';
        } 
    
    else {
            if (_teamFldr === true) {
                if (localStorage.getItem("multiUsrSrcCldId") === _obj.fromCloudId.id) {
                    if (CsvOperation(_obj, 'check')) {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                    } else {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                    }
                } else {
                    if (CsvOperation(_obj, 'check')) {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true" class="notAllow" disabled="disabled"></td>';
                        localStorage.setItem("teamMigrationMappingPopUp","yes");
                    } else {
                        input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"  class="notAllow" disabled="disabled"></td>';
                        localStorage.setItem("teamMigrationMappingPopUp","yes");
                    }
                }
            } else {
                if (CsvOperation(_obj, 'check')) {
                    input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                } else {
                    input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                }
            }

        }
    }
    else {
        if(src.folderPath === null || dstn.dstnFolderPath === null || src.folderPath === undefined || dstn.dstnFolderPath === undefined || src.folderPath === "undefined" || dstn.dstnFolderPath === "undefined"){
            if(mappingOptions.localStorageOperation(_obj,'check'))
                _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs" checked="true"></td>';
            else
                _input = '<td style="width: 5%;"><input type="checkbox" name="inputMapdUrs"></td>';
        }
        if (src.folderPath !== null || dstn.dstnFolderPath !== null) {
            if (CsvOperation(_obj, 'check')) {
                input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
            } else {
                input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
            }
        }
        if (src.folderPath === null || dstn.dstnFolderPath === null) {
            if (CsvOperation(_obj, 'check')) {
                input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
            } else {
                input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
            }
        }
    }

    if(append != undefined)
        $("#mapdUsers tbody").prepend('<tr  teamFolder="' + _teamFldr +'" srcemail="'+src.userEmail+'" srcCldName="'+src.userCloudName+'" srcCldid="'+src.userCloudId+'" srcRt="'+src.userRtFolId+'" dstnemail="'+dstn.dstnUserEmail+'" dstnCldName="'+dstn.dstnUserCloudName+'" dstnCldid="'+dstn.dstnUserCloudId+'" dstnRt="'+dstn.dstnUserRtFolId+'" >' + _input + '<td style="width: 45%"><img src="../img/PNG/'+src.userCloudName+'.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">'+emailMaxChar(src.userEmail,25)+'</span></td><td style="width: 48%"><img src="../img/PNG/'+dstn.dstnUserCloudName+'.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">'+emailMaxChar(dstn.dstnUserEmail,25)+'</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true" ></i></span></td></tr>');
    else {
        if (src.folderPath == null || src.folderPath === "undefined") {
            if(!$("#mapdUsers tbody tr").hasClass("CsvMapd")) { //(csvId ===0 || csvId===''){
                $("#mapdUsers tbody").append('<tr class="automapRow"  teamFolder="' + _teamFldr +'" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '" dstnemail="' + dstn.dstnUserEmail + '" srcFolderPath="/"  dstnFolderPath="/" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" >' + _input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>');
            }
            else {
                var _html = '<tr class="CsvMapd"  teamFolder="' + _teamFldr +'" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '" dstnemail="' + dstn.dstnUserEmail + '" srcFolderPath="/"  dstnFolderPath="/" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" >' + _input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><span class="csvPath"  style="margin-left: 10%;" title="TitleSrce">/</span></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><span class="csvPath"  style="margin-left: 10%;" title="TitleDstin">/</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                _html = _html.replace('TitleSrce', "/").replace('TitleDstin', "/");
                $("#mapdUsers tbody").prepend(_html);//append
            }
        }
        else {
            if ((src.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && dstn.dstnUserCloudName === "DROPBOX_BUSINESS") || (src.userCloudName === "DROPBOX_BUSINESS" && dstn.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (src.userCloudName === "GOOGLE_SHARED_DRIVES" && dstn.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (src.userCloudName === "DROPBOX_BUSINESS" && dstn.dstnUserCloudName === "GOOGLE_SHARED_DRIVES") ) {
                if (!$("#mapdUsers tbody tr").hasClass("CsvMapd")) {
                    if(csvId !== 0){
                        var sorc = CFManageCloudAccountsAjaxCall.getMaxChars(src.folderPath, 25);
                        var dest = CFManageCloudAccountsAjaxCall.getMaxChars(dstn.dstnFolderPath, 25);
                        var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src1 = sorc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var sourc = src.folderPath;
                        var desti = dstn.dstnFolderPath;
                        var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var _html = '<tr style="width: 100%" id ="csvRow" class="CsvMapd" csvid="' + csvId + '" csvName="' + csvName + '" sourcAdminCloudId="' + src.sourceAdminCloudId + '" destAdminCloudId="' + dstn.destAdminCloudId + '" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '"srcFolderPath="' + src2 + '" srcPathRootFolderId="' + src.srcPathRootFolderId + '" migrateSrcFolderName="' + src.migrateSrcFolderName + '" dstnFolderPath="' + dest2 + '"  dstnemail="' + dstn.dstnUserEmail + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" dstnPathRootFolderId="' + dstn.dstnPathRootFolderId + '" migrateDstnFolderName ="' + migrateDstnFolderName + '" >' + input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+src2+'">' + src1 + '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></p></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                     //   _html = _html.replace('TitleSrce',src2).replace('TitleDstin', dest2);
                      //  $("#mapdUsers tbody").prepend(_html);//append
                    }
                    else if(csvId === 0 && isFolder === true && $('#csvFileUpload').hasClass('onlyCsv')){
                        var sorc = CFManageCloudAccountsAjaxCall.getMaxChars(src.folderPath, 25);
                        var dest = CFManageCloudAccountsAjaxCall.getMaxChars(dstn.dstnFolderPath, 25);
                        var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src1 = sorc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var sourc = src.folderPath;
                        var desti = dstn.dstnFolderPath;
                        var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var _html = '<tr style="width: 100%" id ="csvRow" class="CsvMapd" csvid="' + csvId + '" csvName="' + csvName + '" sourcAdminCloudId="' + src.sourceAdminCloudId + '" destAdminCloudId="' + dstn.destAdminCloudId + '" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '"srcFolderPath="' + src2 + '" srcPathRootFolderId="' + src.srcPathRootFolderId + '" migrateSrcFolderName="' + src.migrateSrcFolderName + '" dstnFolderPath="' + dest2 + '"  dstnemail="' + dstn.dstnUserEmail + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" dstnPathRootFolderId="' + dstn.dstnPathRootFolderId + '" migrateDstnFolderName ="' + migrateDstnFolderName + '" >' + input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+src2+'">' + src1 + '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></p></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                    }
                    else{
		   var sorc = CFManageCloudAccountsAjaxCall.getMaxChars(src.folderPath, 25);
                        var dest = CFManageCloudAccountsAjaxCall.getMaxChars(dstn.dstnFolderPath, 25);
                        var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src1 = sorc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var sourc = src.folderPath;
                        var desti = dstn.dstnFolderPath;
                        var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var srcRoot = src.userRtFolId;
			srcRoot = srcRoot.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var destRoot = dstn.dstnUserRtFolId;
			destRoot = destRoot.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			
                    if (duplicate === true) {
                        if(pathException === null || pathException === undefined || pathException === 'null' || pathException === 'undefined')
                            var _html = '<tr class="folderRow"  teamFolder="' + _teamFldr +'" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + srcRoot+ '" duplicateCache="' + duplicate + '" dstnemail="' + dstn.dstnUserEmail + '" srcFolderPath="' + src2 + '"  dstnFolderPath="' + dest2 + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + destRoot + '" >' + input1 + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+src2+'">' + src1 + '</span></td><td style="width: 48%;"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><span style="margin-right: 20%;float: right;font-size: inherit;"><i class="fa fa-exclamation-circle manualPath"  title="Duplicate Pair" aria-hidden="true" style="color: red;"></i></span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                        else 
                            var _html = '<tr class="folderRow"  teamFolder="' + _teamFldr +'" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + srcRoot+ '" pathException="' + pathException + '"  duplicateCache="' + duplicate + '" dstnemail="' + dstn.dstnUserEmail + '" srcFolderPath="' + src2 + '"  dstnFolderPath="' + dest2 + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + destRoot + '" >' + input1 + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+src2+'">' + src1  + '</span></td><td style="width: 48%;"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><span style="margin-right: 20%;float: right;font-size: inherit;"><i class="fa fa-exclamation-circle pathException"  title="The specified file or folder name is too long. The URL path for all files and folders must be 400 characters or less." aria-hidden="true" style="color: red;"></i></span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                        }
                        else {
                    if(pathException === null || pathException === undefined || pathException === 'null' || pathException === 'undefined')
                        var _html = '<tr class="folderRow"  teamFolder="' + _teamFldr +'" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + srcRoot+ '"  duplicateCache="' + duplicate + '" dstnemail="' + dstn.dstnUserEmail + '" srcFolderPath="' + src2 + '"  dstnFolderPath="' + dest2 + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + destRoot+ '" >' + input1 + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+src2+'">' + src1  + '</span></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                    else
                        var _html = '<tr class="folderRow"  teamFolder="' + _teamFldr +'" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + srcRoot+ '"  pathException="' + pathException + '"  duplicateCache="' + duplicate + '" dstnemail="' + dstn.dstnUserEmail + '" srcFolderPath="' + src2 + '"  dstnFolderPath="' + dest2 + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + destRoot + '" >' + input1 + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+src2+'">' + src1 + '</span></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><span style="margin-right: 20%;float: right;font-size: inherit;"><i class="fa fa-exclamation-circle pathException"  title="The specified file or folder name is too long. The URL path for all files and folders must be 400 characters or less." aria-hidden="true" style="color: red;"></i></span><br/><span class="manualPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                        }
                    }
                  //  _html = _html.replace('TitleSrce', src.folderPath).replace('TitleDstin', dstn.dstnFolderPath);
                    if(automap === true){
                        $("#mapdUsers tbody").append(_html);
                    }
                    else
                        $("#mapdUsers tbody").prepend(_html);//append
                }
                else{
                    var sorc = CFManageCloudAccountsAjaxCall.getMaxChars(src.folderPath, 25);
                    var dest = CFManageCloudAccountsAjaxCall.getMaxChars(dstn.dstnFolderPath, 25);
                    var pl = /\</g;
                    var pl1 = /\>/g;
                    var pl2 = /\"/g;
                    var pl3 = /\'/g;
                    var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    var src1 = sorc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    var sourc = src.folderPath;
                    var desti = dstn.dstnFolderPath;
                    var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			if(csvId == 0){
			csvId = $("#mapdUsers tbody").find("#csvRow").attr("csvid");
			}
                    var _html = '<tr style="width: 100%" id ="csvRow" class="CsvMapd" csvid="' + csvId + '" csvName="' + csvName + '" sourcAdminCloudId="' + src.sourceAdminCloudId + '" destAdminCloudId="' + dstn.destAdminCloudId + '" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '"srcFolderPath="' + src2 + '" srcPathRootFolderId="' + src.srcPathRootFolderId + '" migrateSrcFolderName="' + src.migrateSrcFolderName + '" dstnFolderPath="' + dest2 + '"  dstnemail="' + dstn.dstnUserEmail + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" dstnPathRootFolderId="' + dstn.dstnPathRootFolderId + '" migrateDstnFolderName ="' + migrateDstnFolderName + '" >' + input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+src2+'">' + src1 + '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></p></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                    _html = _html.replace('TitleSrce', src2).replace('TitleDstin', dest2);
                    $("#mapdUsers tbody").prepend(_html);//append
                }
            }
            else {
                var sorc = CFManageCloudAccountsAjaxCall.getMaxChars(src.folderPath, 25);
                var dest = CFManageCloudAccountsAjaxCall.getMaxChars(dstn.dstnFolderPath, 25);
                var pl = /\</g;
                var pl1 = /\>/g;
                var pl2 = /\"/g;
                var pl3 = /\'/g;
                var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                var src1 = sorc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                var sourc = src.folderPath;
                var desti = dstn.dstnFolderPath;
                var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                if(dstn.dstnFolderPath == '' && dstn.dstnUserCloudName ==='SHAREPOINT_ONLINE_BUSINESS'){
                    var _html = '<tr style="width: 100%" id ="csvRow" class="CsvMapd" teamFolder="' + _teamFldr +'" csvid="' + csvId + '" csvName="' + csvName + '" sourcAdminCloudId="' + src.sourceAdminCloudId + '" destAdminCloudId="' + dstn.destAdminCloudId + '" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '"srcFolderPath="' + src2 + '" srcPathRootFolderId="' + src.srcPathRootFolderId + '" migrateSrcFolderName="' + src.migrateSrcFolderName + '" dstnFolderPath="/"  dstnemail="' + dstn.dstnUserEmail + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" dstnPathRootFolderId="' + dstn.dstnPathRootFolderId + '" migrateDstnFolderName ="' + migrateDstnFolderName + '" >' + input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="TitleSrce">' + CFManageCloudAccountsAjaxCall.getMaxChars(src.folderPath, 25) + '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="TitleDstin">/</span></p></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                    _html = _html.replace('TitleSrce', src2).replace('TitleDstin', '/');
                } 
                else{ 
                    var _html = '<tr style="width: 100%" id ="csvRow" class="CsvMapd" teamFolder="' + _teamFldr +'" csvid="' + csvId + '" csvName="' + csvName + '" sourcAdminCloudId="' + src.sourceAdminCloudId + '" destAdminCloudId="' + dstn.destAdminCloudId + '" srcemail="' + src.userEmail + '" srcCldName="' + src.userCloudName + '" srcCldid="' + src.userCloudId + '" srcRt="' + src.userRtFolId + '"srcFolderPath="' + src2 + '" srcPathRootFolderId="' + src.srcPathRootFolderId + '" migrateSrcFolderName="' + src.migrateSrcFolderName + '" dstnFolderPath="' + dest2 + '"  dstnemail="' + dstn.dstnUserEmail + '" dstnCldName="' + dstn.dstnUserCloudName + '" dstnCldid="' + dstn.dstnUserCloudId + '" dstnRt="' + dstn.dstnUserRtFolId + '" dstnPathRootFolderId="' + dstn.dstnPathRootFolderId + '" migrateDstnFolderName ="' + migrateDstnFolderName + '" >' + input + '<td style="width: 45%"><img src="../img/PNG/' + src.userCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+src.userEmail+'">' + emailMaxChar(src.userEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+src2+'">' + src1 + '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + dstn.dstnUserCloudName + '.png" alt="pic" class="forImage"><span class="manualPath" title="'+dstn.dstnUserEmail+'">' + emailMaxChar(dstn.dstnUserEmail, 25) + '</span><br/><p  style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></p></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
                    _html = _html.replace('TitleSrce', src2).replace('TitleDstin', dstn.dstnFolderPath);
                }
                $("#mapdUsers tbody").prepend(_html);//append
            }
        }
        $.each($('.csvPath'), function() {
            if ($(this).text() !== "/" || null) {
                $('.download').css('pointer-events', 'auto');
                $('.download').css('opacity', '1');
                $('#help').css('visibility', 'visible');
            }
        });
    }
    if($('#mapdUsrs input[name="csvMapngCheckBox"]').prop('checked') === true || $('#mapdUsrs input[name="inputMapdUrs"]').prop('checked') === true || $('#mapdUsrs input[name="folderMapngCheckBox"]').prop('checked') === true)
    {
        $('#forNextMove').removeClass('disabled');
    }
    if($('input[name="inputMapdUrs"]:checked').length === 30 || $('input[name="csvMapngCheckBox"]:checked').length === 30 || $('input[name="folderMapngCheckBox"]:checked').length === 30){
        $("#chkInput").prop('checked', true);
    }
//    else{
  //      $(document).find("#chkInput").prop( "checked", false );
  //  }
    if($("#chkInput:checked").length){
        var data = $('#mapdUsers input[name=folderMapngCheckBox]').length;
        for (i = 0; i < data; i++) {
            if ($('#mapdUsers input[name=folderMapngCheckBox]')[i].hasAttribute('disabled')) {
                $("input[name=folderMapngCheckBox]")[i].checked = false;
            } else {
                $("input[name=folderMapngCheckBox]")[i].checked = true;
            }
        }
        if($('#mapdUsers input[name=csvMapngCheckBox]').length !==0){
            var _data = $('#mapdUsers input[name=csvMapngCheckBox]').length;
            for (j = 0; j < _data; j++) {
                if ($('#mapdUsers input[name=csvMapngCheckBox]')[j].hasAttribute('disabled')) {
                    $("input[name=csvMapngCheckBox]")[j].checked = false;
                } else {
                    $("input[name=csvMapngCheckBox]")[j].checked = true;
                }
            }
        }
    }

    if(!Number($("#mapdUsrs .paginationCF input").val())){
        $("#mapdUsrs .paginationCF input").val(1);
        $("#mapdUsrs .paginationCF span").last().text( "1 of 1" );
    }
    $('[data-toggle="tooltip"]').tooltip();
}
$(document).on('click','.closeBtn',function(){
    sendGAEvents("Deleted a mapped user in mappings screen");
    if($('#mapdUsers input[name="csvMapngCheckBox"]').length === 0)
        localStorage.removeItem('FolderChecked');
    localStorage.removeItem('CsvEmailChecked');
    if($('#mapdUsers input[name="inputMapdUrs"]').length === 0){
        localStorage.removeItem('selectedEmail');
        localStorage.removeItem('selectedMappings');
    }
    if($('#mapdUsers input[name="folderMapngCheckBox"]').length === 0){
        localStorage.removeItem('folderEmail');
        localStorage.removeItem('folderMappings');
    }
    localStorage.removeItem("validator");
    $('#csvFileUpload').removeAttr('disabled');
    $('#csvFile').removeAttr('disabled');
    var parent = $(this).parents("tr");
    var _appendSrcId = $(this).parents("tr").attr("srcCldid");
    var _appendDstnId = $(this).parents("tr").attr("dstnCldid");
    var _appendSrcPath =$(this).parents("tr").attr("srcfolderpath");
    var _appendDstnPath = $(this).parents("tr").attr("dstnfolderpath");
    var srccldname =$(this).parents("tr").attr("srccldname");
    var dstncldname = $(this).parents("tr").attr("dstncldname");
    var fromRootId = $(this).parents("tr").attr('srcrt');
    var toRootId = $(this).parents("tr").attr('dstnrt');
    var duplicateCache = $(this).parents("tr").attr('duplicateCache');
    var _path = $(this).parents("tr").attr('pathException');
  var csvid = $(this).parents("tr").attr('csvid');
	if(!((srccldname === 'GOOGLE_SHARED_DRIVES' && dstncldname === 'SHAREPOINT_ONLINE_BUSINESS') || (srccldname === 'DROPBOX_BUSINESS' && dstncldname === 'GOOGLE_SHARED_DRIVES') )){
    $("#srcCloudUsers input[cloudid=" + _appendSrcId + "]").attr('disabled',false).parent().removeClass('selectedClass').parent().removeClass('selectedClass');
    $("#dstCloudsUsers input[cloudid=" + _appendDstnId + "]").attr('disabled',false).parent().removeClass('selectedClass').parent().removeClass('selectedClass');
    $("#srcCloudUsers input[cloudid=" + _appendSrcId + "]").attr('disabled',false).parent().parent().removeClass('selectedClass');
    $("#dstCloudsUsers  input[cloudid=" + _appendDstnId + "]").attr('disabled',false).parent().parent().removeClass('selectedClass');
	}
    $("#srcCloudUsers .usr-folder[user-id=" + _appendSrcId + "]").parent().removeClass('selectedClass');
    $("#dstCloudsUsers  .usr-folder[user-id=" + _appendDstnId + "]").parent().removeClass('selectedClass');
    if(srccldname === 'BOX_BUSINESS' && dstncldname === 'ONEDRIVE_BUSINESS_ADMIN' || srccldname === 'BOX_BUSINESS' && dstncldname === 'GOOGLE_SHARED_DRIVES' || srccldname === 'BOX_BUSINESS' && dstncldname === 'G_SUITE'|| srccldname === 'BOX_BUSINESS' && dstncldname === 'SHAREPOINT_ONLINE_BUSINESS'||srccldname === 'DROPBOX_BUSINESS' && dstncldname === 'SHAREPOINT_ONLINE_BUSINESS' || srccldname === 'G_SUITE' && dstncldname === 'ONEDRIVE_BUSINESS_ADMIN' || srccldname === 'G_SUITE' && dstncldname === 'DROPBOX_BUSINESS' ||srccldname === 'DROPBOX_BUSINESS' && dstncldname === 'G_SUITE')
    {
        if(parent.hasClass('automapRow')){
            var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId;

        }
else if(csvid === undefined){
            var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId;  
        }
        else{
            if(_path === null ||_path === 'null' ||_path === undefined ||_path === 'undefined')
                var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId+"&fromRootFolderId="+encodeURIComponent(fromRootId)+"&toRootFolderId="+encodeURIComponent(toRootId)+"&fromFolderPath="+_appendSrcPath+"&toFolderPath="+_appendDstnPath;
            else
                var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId+"&fromRootFolderId="+encodeURIComponent(fromRootId)+"&toRootFolderId="+encodeURIComponent(toRootId)+"&fromFolderPath="+_appendSrcPath+"&toFolderPath="+_appendDstnPath+"&pathException";
        }
    }
    else if((srccldname === 'DROPBOX_BUSINESS' && dstncldname === 'ONEDRIVE_BUSINESS_ADMIN') || (srccldname === 'ONEDRIVE_BUSINESS_ADMIN' && dstncldname === 'DROPBOX_BUSINESS')||(srccldname === 'GOOGLE_SHARED_DRIVES' && dstncldname === 'SHAREPOINT_ONLINE_BUSINESS')||(srccldname === 'DROPBOX_BUSINESS' && dstncldname === 'GOOGLE_SHARED_DRIVES'))
    {
        if(_path === null ||_path === 'null' ||_path === undefined ||_path === 'undefined')
            var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId+"&fromRootFolderId="+encodeURIComponent(fromRootId)+"&toRootFolderId="+encodeURIComponent(toRootId)+"&fromFolderPath="+encodeURIComponent(_appendSrcPath)+"&toFolderPath="+encodeURIComponent(_appendDstnPath);
        else
            var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId+"&fromRootFolderId="+encodeURIComponent(fromRootId)+"&toRootFolderId="+encodeURIComponent(toRootId)+"&fromFolderPath="+encodeURIComponent(_appendSrcPath)+"&toFolderPath="+encodeURIComponent(_appendDstnPath)+"&pathException";
    } else{
        var _data = "sourceCloudId="+_appendSrcId+"&destCloudId="+_appendDstnId;
    }
    var _local = $(this);
    $.ajax({
        type: "DELETE",
        url: apicallurl + "/mapping/delete/mapplist?" + _data,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
            var _obj = {
                "fromCloudId": {
                    "id": _appendSrcId,
                },
                "toCloudId": {
                    "id": _appendDstnId,
                }
            };
            mappingOptions.localStorageOperation(_obj, 'delete');
            if($('#mapdUsers input[name=folderMapngCheckBox]').length) {
                var _obj = {
                    "fromCloudId": {
                        "id": _appendSrcId
                    },
                    "toCloudId": {
                        "id": _appendDstnId
                    },
                    "fromRootId": fromRootId,
                    "toRootId": toRootId,
                    "sourceFolderPath": _appendSrcPath,
                    "destFolderPath": _appendDstnPath,
                    "folder": "true"
                };
                var _objEmail = {
                    "fromMailId": parent.attr('srcemail'),
                    "fileName": parent.attr('srcemail'),
                    "toMailId": parent.attr('dstnemail'),
                    "fromCloudName": srccldname,
                    "toCloudName": dstncldname

                };
	if(parent.find('input')[0].disabled == false){
                mappingOptions.folderOperation(_obj, 'delete');
                mappingOptions.folderOperation(_objEmail, 'delete1');
}
            }
   if($('#mapdUsers input[name=csvMapngCheckBox]').length) {
                var _obj = {
                    "fromCloudId": {
                        "id": _appendSrcId
                    },
                    "toCloudId": {
                        "id": _appendDstnId
                    },
                    "fromRootId": fromRootId,
                    "toRootId": toRootId,
                    "sourceFolderPath": _appendSrcPath,
                    "destFolderPath": _appendDstnPath,
                    "folder": "true"
                };
                var _objEmail = {
                    "fromMailId": parent.attr('srcemail'),
                    "fileName": parent.attr('srcemail'),
                    "toMailId": parent.attr('dstnemail'),
                    "fromCloudName": srccldname,
                    "toCloudName": dstncldname

                };
if(parent.find('input')[0].disabled == false){
                CsvOperation(_obj, 'delete');
                CsvOperation(_objEmail, 'deleteCSv');
}
            }
            $("#srcCloudUsers input[cloudid = " + $(this).parents("tr").attr("srcCldid") + "]").parent().removeClass("selectedClass");
            $("#dstCloudsUsers input[cloudid = " + $(this).parents("tr").attr("dstnCldid") + "]").parent().removeClass("selectedClass");
            $(_local).parents("tr").remove("");
            if($("#chkInput:checked").length){
                var data = $('#mapdUsers input[name=folderMapngCheckBox]').length;
                for (i = 0; i < data; i++) {
                    if ($('#mapdUsers input[name=folderMapngCheckBox]')[i].hasAttribute('disabled')) {
                        $("input[name=folderMapngCheckBox]")[i].checked = false;
                    } else {
                        $("input[name=folderMapngCheckBox]")[i].checked = true;
                    }
                }
                if($('#mapdUsers input[name=csvMapngCheckBox]').length !==0){
                    var _data = $('#mapdUsers input[name=csvMapngCheckBox]').length;
                    for (j = 0; j < _data; j++) {
                        if ($('#mapdUsers input[name=csvMapngCheckBox]')[j].hasAttribute('disabled')) {
                            $("input[name=csvMapngCheckBox]")[j].checked = false;
                        } else {
                            $("input[name=csvMapngCheckBox]")[j].checked = true;
                        }
                    }
                }
            }
            var _pgNo = $("#mapdUsrs .paginationDiv input.input-sm").val();
            if (!$("#mapdUsrs .closeBtn").length) {
                $('.download').css('pointer-events', 'none');
                $('.download').css('opacity', '0.5');
                $('#help').css('visibility', 'hidden');
                $('#csvFileUpload').removeClass('onlyCsv');
		localStorage.removeItem("Csv");
                $(document).find("#chkInput").attr("disabled", true).prop("checked", false);
                $("#clearBtn").css("pointer-events",'none');
                $("#clearBtn").css("cursor","not-allowed");
                $("#clearBtn").css("opacity","0.6");
                $("#forNextMove").addClass("disabled");
                if (_pgNo == 1) {
                    $("#mapdUsrs .paginationCF span").last().text("0 of 0");
                    $("#mapdUsrs .paginationDiv").css("opacity", "0.6");
                    $('#mapdUsrs .paginationDiv select').prop('disabled', true);
                    $('#mapdUsrs .paginationDiv input').prop('disabled', true);

                    $("#mapdUsrs .paginationDiv input.input-sm").val(0);
                }
                $('#mapdUsrs #csvFileUpload').css({'opacity': '1', 'cursor': 'pointer','pointer-events':'auto'});
                $('#mapdUsrs #csvFileUpload').click(true);
                if((srccldname=== "BOX_BUSINESS" && dstncldname=== "GOOGLE_SHARED_DRIVES")||(srccldname=== "BOX_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS")||(srccldname=== "BOX_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_HYBRID") || (srccldname=== "DROPBOX_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS") || (srccldname=== "GOOGLE_SHARED_DRIVES" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS") || (srccldname=== "GOOGLE_SHARED_DRIVES" && dstncldname=== "SHAREPOINT_ONLINE_HYBRID")|| (srccldname=== "DROPBOX_BUSINESS" && dstncldname=== "GOOGLE_SHARED_DRIVES")|| (srccldname=== "EGNYTE_ADMIN" && dstncldname=== "GOOGLE_SHARED_DRIVES")|| (srccldname=== "SHAREFILE_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS")|| (srccldname === "DROPBOX_BUSINESS" && dstncldname === "AMAZON")|| (srccldname=== "SHAREFILE_BUSINESS" && dstncldname=== "GOOGLE_SHARED_DRIVES"))
                    $('#mapdUsrs .fa-exchange').addClass('disabled'); 
                else
                    $('#mapdUsrs .fa-exchange').removeClass('disabled');
            }
            else {
                migrationMapping.appendMapping(_pgNo, srccldname, dstncldname);

            }

        }
    });

});
//For AutoMapping
$(document).on('click','#mapdUsrs .fa-exchange',function(){
    sendGAEvents("Clicked on Automapping in mappings screen");
	//activecampaign.eventTrack('Automapping',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    localStorage.removeItem("Csv");
    localStorage.removeItem("FolderChecked");
    localStorage.removeItem("CsvEmailChecked");
    localStorage.removeItem("teamMigrationMappingPopUp");
    // if($(this).hasClass('disabled'))
    //     return false;
    $("#CFShowLoading").modal("show");
    $("#mapdUsers tbody").html('');
    csvMappings = false;
    $("div").removeClass('selectedClass');
    $("#srcUsrs input:radio").attr('disabled',false);
    $("#dstnUsrs input:radio").attr('disabled',false);
    $("#CFShowLoading").attr("autoMap","true");
    deleteMapping();
    $("#mapdUsrs .paginationCF input").val(1);
    	localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr('id'));
	localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr('id'));
autoMapping(1,$("#mapdUsrs select").val(),localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"));
    $("#srcUsrs .custom-search-input input").val('');
    $("#dstnUsrs .custom-search-input input").val('');
    var searchData = JSON.parse(localStorage.getItem("searchData"));
    searchData.mapping = false;
    localStorage.setItem("searchData",JSON.stringify(searchData));
    //disableMapping('add');

});
function autoMapping(pgNo,pgSize,_srcMapdCldId,_dstnMapdCldId) {
    if(pgNo == undefined)
        pgNo = 1;
    //if(pgSize == undefined )
    pgSize = parseInt($('#mapdUsrs select').val());
    $("#CFShowLoading").modal("show");
    var _isError = false;
    var _data = "sourceCloudId="+_srcMapdCldId+"&destCloudId="+_dstnMapdCldId+"&pageNo="+pgNo+"&pageSize="+pgSize;
    var _xhr = $.ajax({
        type: "POST",
        url: apicallurl + "/mapping/user/clouds/list?" + _data,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {

            $("#mapdUsers tbody").html('');
            $('#paginationMapng').empty();
            $('#paginationMapng').removeData("twbs-pagination");
            $('#paginationMapng').unbind("page");
            if(data.length === 0){
                setTimeout(function(){
                    $("#CFShowLoading").attr("autoMap","false");
                    $("#CFShowLoading").modal("hide");
                }, 1000);
            }
            else{
                var _totPages = Math.ceil(data[0].noOfMappedCloudPressent/$('#mapdUsrs select').val());

                var _txt = 1 + " of " + _totPages;

                $("#mapdUsrs .paginationCF span").last().text(_txt );
                $("#mapdUsrs .paginationCF input").val(1 );

                $('#paginationMapng').twbsPagination({
                    totalPages: _totPages,
                    visiblePages: 6,
                    startPage: 1,
                    next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                    prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
                    first: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
                    last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                    onPageClick: function (event, page) {
                        appendingPrevMapping(page);
                    }
                });
                for (var i = 0; i < data.length; i++) {
                    var _dataVal = data[i];
                    var csvID = _dataVal.csvId;
                    var csvName =  _dataVal.csvName;
                    var migrateDstnFolderName = _dataVal.migrateFolderName;
                    var _teamFldr = _dataVal.teamFolder;
                    if ((_dataVal.sourceCloudDetails.name === "ONEDRIVE_BUSINESS_ADMIN" && _dataVal.destCloudDetails.name === "DROPBOX_BUSINESS") || (_dataVal.sourceCloudDetails.name === "DROPBOX_BUSINESS" && _dataVal.destCloudDetails.name === "ONEDRIVE_BUSINESS_ADMIN") || (_dataVal.sourceCloudDetails.name === "GOOGLE_SHARED_DRIVES" && _dataVal.destCloudDetails.name === "SHAREPOINT_ONLINE_BUSINESS") || (_dataVal.sourceCloudDetails.name === "DROPBOX_BUSINESS" && _dataVal.destCloudDetails.name === "GOOGLE_SHARED_DRIVES")) {
                        var _srcUsrDetails = {
                            "userEmail": _dataVal.sourceCloudDetails.emailId,
                            "userCloudName": _dataVal.sourceCloudDetails.name,
                            "userCloudId": _dataVal.sourceCloudDetails.id,
                            "userRtFolId": _dataVal.sourceCloudDetails.rootFolderId,
                            "folderPath":'/'
                        }
                        var _dstnUsrDetails = {
                            "dstnUserEmail": _dataVal.destCloudDetails.emailId,
                            "dstnUserCloudName": _dataVal.destCloudDetails.name,
                            "dstnUserCloudId": _dataVal.destCloudDetails.id,
                            "dstnUserRtFolId": _dataVal.destCloudDetails.rootFolderId,
                            "dstnFolderPath":'/'
                        }
                        $("input[cloudid=" + _srcUsrDetails.userCloudId + "]").parent().parent().addClass("selectedClass");
                        $("input[cloudid=" + _dstnUsrDetails.dstnUserCloudId + "]").parent().parent().addClass("selectedClass");
                        var isFolder = true,automap=true;
                        mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails, '',_teamFldr,'','',undefined,isFolder,automap,_dataVal.duplicateCache,_dataVal.pathException);
                    } else {
                        var _srcUsrDetails = {
                            "userEmail": _dataVal.sourceCloudDetails.emailId,
                            "userCloudName": _dataVal.sourceCloudDetails.name,
                            "userCloudId": _dataVal.sourceCloudDetails.id,
                            "userRtFolId": _dataVal.sourceCloudDetails.rootFolderId
                        }
                        var _dstnUsrDetails = {
                            "dstnUserEmail": _dataVal.destCloudDetails.emailId,
                            "dstnUserCloudName": _dataVal.destCloudDetails.name,
                            "dstnUserCloudId": _dataVal.destCloudDetails.id,
                            "dstnUserRtFolId": _dataVal.destCloudDetails.rootFolderId
                        }
                        $("input[cloudid=" + _srcUsrDetails.userCloudId + "]").parent().parent().addClass("selectedClass");
                        $("input[cloudid=" + _dstnUsrDetails.dstnUserCloudId + "]").parent().parent().addClass("selectedClass");
                        mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails,'',_teamFldr);
                    }
                }
				if(data[0].sourceCloudDetails.name === "BOX_BUSINESS" && data[0].destCloudDetails.name === "ONEDRIVE_BUSINESS_ADMIN"){
					 $('.download12').css('display', 'block');
					$('.download12').css('pointer-events', 'auto');
                    $('.download12').css('opacity', '1');
                   			
			}
			else{
			 $('.download12').css('display', 'none');
			 $('.download12').css('pointer-events', 'none');
                    $('.download12').css('opacity', '0.4');
			}
                  alertSuccess("Auto-mapping has been successfully completed.");
                migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), 1, $("#srcCloudUsers select").val(), 'source');
                migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), 1, $("#dstCloudsUsers select").val(), 'destination');
                setTimeout(function () {
                    $("#CFShowLoading").attr("autoMap", "false");
                    $("#CFShowLoading").modal("hide");
                }, 1000);
            }
        },
        error: function (data) {
            _isError = true;
            appendingPrevMapping();
            alertSuccess("Auto-mapping has been successfully completed.");
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),1, $("#srcCloudUsers select").val(),'source');
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),1, $("#dstCloudsUsers select").val(),'destination');
        }
    });
}
function autoSaving(_srcMapdCldId,_dstnMapdCldId,isFolder,parentName) {
    var _autoSave;
    if(_srcMapdCldId.folderPath !== "undefined" || _dstnMapdCldId.dstnFolderPath !== "undefined" || _srcMapdCldId.folderPath !== null || _dstnMapdCldId.dstnFolderPath !== null)
    {	
	if(localStorage.getItem('multiUsrSrcCldName')==="GOOGLE_SHARED_DRIVES" && localStorage.getItem('multiUsrDstnCldName') ==="SHAREPOINT_ONLINE_BUSINESS" && (_dstnMapdCldId.dstnUserRtFolId.split(':')[1] === "FOLDER"||_dstnMapdCldId.dstnUserRtFolId.split(':')[1] === "DOCUMENT_LIBRARY")){
        var _data = "sourceCloudId="+_srcMapdCldId.userCloudId+"&destCloudId="+_dstnMapdCldId.dstnUserCloudId+"&sourcePath="+encodeURIComponent(_srcMapdCldId.folderPath)+"&destPath="+encodeURIComponent(_dstnMapdCldId.dstnFolderPath)+"&sourceFolderId="+ encodeURIComponent(_srcMapdCldId.userRtFolId)+"&destFolderId="+ encodeURIComponent(_dstnMapdCldId.dstnUserRtFolId)+"&documentLibrary="+parentName;
	}
	else if(localStorage.getItem('multiUsrSrcCldName')==="GOOGLE_SHARED_DRIVES" && localStorage.getItem('multiUsrDstnCldName') ==="SHAREPOINT_ONLINE_BUSINESS" && (_dstnMapdCldId.dstnUserRtFolId.split(':')[1] === "SITE")){
        var _data = "sourceCloudId="+_srcMapdCldId.userCloudId+"&destCloudId="+_dstnMapdCldId.dstnUserCloudId+"&sourcePath="+encodeURIComponent(_srcMapdCldId.folderPath)+"&destPath="+encodeURIComponent(_dstnMapdCldId.dstnFolderPath+'/Documents')+"&sourceFolderId="+ encodeURIComponent(_srcMapdCldId.userRtFolId)+"&destFolderId="+ encodeURIComponent(_dstnMapdCldId.dstnUserRtFolId)+"&documentLibrary=Documents";
	}
	else
        var _data = "sourceCloudId="+_srcMapdCldId.userCloudId+"&destCloudId="+_dstnMapdCldId.dstnUserCloudId+"&sourcePath="+encodeURIComponent(_srcMapdCldId.folderPath)+"&destPath="+encodeURIComponent(_dstnMapdCldId.dstnFolderPath)+"&sourceFolderId="+ encodeURIComponent(_srcMapdCldId.userRtFolId)+"&destFolderId="+ encodeURIComponent(_dstnMapdCldId.dstnUserRtFolId);
        var _url = apicallurl + "/mapping/user/unmapped/list?" + _data + "&isFolder=true";
    }
    else{
        var _data = "sourceCloudId="+_srcMapdCldId.userCloudId+"&destCloudId="+_dstnMapdCldId.dstnUserCloudId;
        var _url =   apicallurl + "/mapping/user/unmapped/list?" + _data;
    }
    csvMappings = false;
    $.ajax({
        type: "POST",
        url: _url,
        // async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
            _autoSave = data;
 $(document).find("#chkInput").prop( "checked", false );
            if($("#mapdUsers tbody tr").length != 0) {
                if($("#mapdUsers tbody tr").hasClass('automapRow')){
                    var lastTr = $("#mapdUsers tbody tr").last();
                }
                else{
                    var lastTr = $("#mapdUsers tbody tr").first();
                }
                lastTr.attr('teamFolder', data[0].teamFolder);
            }
            if($("#mapdUsers tbody tr").length > 30){
                appendingPrevMapping(1);
                $("#mapdUsers tbody tr").last().remove();
            }
            if(isFolder === true){
                if($("#mapdUsers tbody tr").length > 29){
                    appendingPrevMapping(1);
                    $("#mapdUsers tbody tr").last().remove();
                }
            }
            setTimeout(function(){
                $("#CFShowLoading").modal("hide");
            }, 2000);
            if(isFolder === true) {
                if (_autoSave.length !== 0) {
	if(localStorage.getItem('multiUsrSrcCldName')==="GOOGLE_SHARED_DRIVES" && localStorage.getItem('multiUsrDstnCldName') ==="SHAREPOINT_ONLINE_BUSINESS" && (_dstnMapdCldId.dstnUserRtFolId.split(':')[1] === "SITE")){
		_dstnMapdCldId.dstnFolderPath = _dstnMapdCldId.dstnFolderPath +'/Documents';
             }
       mapdSlectedUrs(_srcMapdCldId, _dstnMapdCldId, '','', '', '', undefined, isFolder, '', _autoSave[0].duplicateCache,_autoSave[0].pathException,parentName);
                }
            }
        }
    });
    return _autoSave;
}
//Searching in Mapped User
$(document).on('click','#mapdUsrs .custom-search-input button',function(){
    sendGAEvents("Searched mapped users in mappings screen");
    if(!$("#mapdUsrs .custom-search-input input").val().length)
        return false;

    var searchData = JSON.parse(localStorage.getItem("searchData"));
    searchData.mapping = true;
    localStorage.setItem("searchData",JSON.stringify(searchData));
    autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim());
});
function autoMappingSearch(SearchTerm,pageNo) {
    if(pageNo == undefined)
        pageNo = 1;

    var pageSize = $("#mapdUsrs .paginationDiv select").val();

    if($('#mapdUsrs .custom-search-input input').val()){
        var _sortFun = migrationMapping.sortBy();
    }
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/user/search/list?searchMapp=" + SearchTerm + "&sourceCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destCloudId=" + localStorage.getItem("multiUsrDstnCldId") + "&pageSize=" + pageSize +"&pageNo=" + pageNo+_sortFun,
        async : false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
            if(data.length == 0){
                alertError("No Results Found");
                $("#chkInput").attr("disabled", true);
                $("#clearBtn").css("pointer-events",'none');
                $("#clearBtn").css("cursor","not-allowed");
                $("#clearBtn").css("opacity","0.6");
                var _txt ="0 of 0";

                $("#mapdUsrs .paginationCF span").last().text(_txt );
                $("#mapdUsrs .paginationCF input").val(0 );
            }
            else{
                $("#mapdUsers tbody").html("");
                var _totPages = Math.ceil(data[0].noOfMappedCloudPressent/$('#mapdUsrs select').val());
                var _txt = pageNo + " of " + _totPages;

                $("#mapdUsrs .paginationCF span").last().text(_txt );
                $("#mapdUsrs .paginationCF input").val(pageNo );
                if(pageNo == 1){
                    $('#paginationMapng').empty();
                    $('#paginationMapng').removeData("twbs-pagination");
                    $('#paginationMapng').unbind("page");
                    if(data.length != 0)
                    {

                        var _totPages = Math.ceil(data[0].noOfMappedCloudPressent/$('#mapdUsrs select').val());

                        var _txt = 1 + " of " + _totPages;

                        $("#mapdUsrs .paginationCF span").last().text(_txt );
                        $("#mapdUsrs .paginationCF input").val(1 );

                        $('#paginationMapng').twbsPagination({
                            totalPages: _totPages,
                            visiblePages: 6,
                            startPage:1,
                            next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                            prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
                            first:'<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
                            last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                            onPageClick: function (event, page){
                                autoMappingSearch(SearchTerm,page);
                            }
                        });
                    }
                }

                for(var i=0;i<data.length;i++){
                    var _dataVal = data[i];
                    var csvID = _dataVal.csvId;
                    var csvName =  _dataVal.csvName;
                    var _teamFldr = _dataVal.teamFolder;
                    var migrateDstnFolderName = _dataVal.migrateFolderName;
                    var _srcUsrDetails =  {
                        "userEmail": _dataVal.sourceCloudDetails.emailId,
                        "userCloudName": _dataVal.sourceCloudDetails.name,
                        "userCloudId": _dataVal.sourceCloudDetails.id,
                        "userRtFolId": _dataVal.sourceCloudDetails.rootFolderId,
                        "folderPath": _dataVal.sourceCloudDetails.folderPath,
                        "srcPathRootFolderId": _dataVal.sourceCloudDetails.pathRootFolderId,
                        "migrateSrcFolderName": _dataVal.sourceCloudDetails.migrateFolderName
                    }
                    var _dstnUsrDetails =  {
                        "dstnUserEmail": _dataVal.destCloudDetails.emailId,
                        "dstnUserCloudName":_dataVal.destCloudDetails.name ,
                        "dstnUserCloudId":_dataVal.destCloudDetails.id,
                        "dstnUserRtFolId": _dataVal.destCloudDetails.rootFolderId,
                        "dstnFolderPath": _dataVal.destCloudDetails.folderPath,
                        "dstnPathRootFolderId": _dataVal.destCloudDetails.pathRootFolderId
                    }
                    if ((_srcUsrDetails.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnUsrDetails.dstnUserCloudName === "DROPBOX_BUSINESS") || (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (_srcUsrDetails.userCloudName === "GOOGLE_SHARED_DRIVES" && _dstnUsrDetails.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
                        if (_srcUsrDetails.folderPath === null && _dstnUsrDetails.dstnFolderPath === null) {
                            _srcUsrDetails.folderPath = '/';
                            _dstnUsrDetails.dstnFolderPath = '/';
                        }
                        var isFolder = true;
                        for(j=0;j<data.length;j++){
                            if(data[j].csvId !== 0){
                                csvID = data[j].csvId;
                                $('#csvFileUpload').addClass('onlyCsv');
                            }
                        }
                        mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails, csvID,_teamFldr, csvName, migrateDstnFolderName, undefined, isFolder,'',_dataVal.duplicateCache,_dataVal.pathException);
                        if( $('#mapdUsers input[name= "inputMapdUrs"]').length > 0) {
                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
                        else{
                            var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
                        if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
                            var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        } else {
                            var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
                        if (checkedLength == totalLength) {
                            $('#chkInput').prop('checked', true);

                        }
                        else{
                            $('#chkInput').prop('checked', false);
                        }

                    }
                    else {
                        mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails, csvID,_teamFldr, csvName, migrateDstnFolderName,undefined,'','');
                        if( $('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="csvMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="csvMapngCheckBox"]').length;
                        }
                        else{
                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length;
                        }
                        if (checkedLength == totalLength) {
                            $('#chkInput').prop('checked', true);

                        }
                        else{
                            $('#chkInput').prop('checked', false);
                        }
                    }
                }
            }

        }
    });
}

//pagination
$('#paginationSrc,#paginationMapng,#paginationDtn').twbsPagination({
    totalPages: 1,
    visiblePages: 4,
    next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
    prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
    first:'<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
    last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
    onPageClick: function (event, page){}
});

//Editing the path
/*$(document).on('click','.fa-pencil',function(){
    $(this).parent().css("display", "none");
    $(this).parent().siblings().css("display", "");
});*/
$(document).on('click','.Job_NAme',function(){
    sendGAEvents("Clicked on edit Job name in options screen");
    $(this).hide();
    $('.Editing_Jobname').removeAttr("disabled");
    $(".Editing_Jobname").focus();
    $("#checkTimediv").css("display","");
    return false;
});
$(document).on('click','.fa-check',function(){
    sendGAEvents("Changed Job name in options screen");
    var jobEmptyval = $(".Editing_Jobname").val();
    var _jobid  =  localStorage.getItem('jobId');
    if(!jobEmptyval || jobEmptyval == "" ){
        $("#jobEmptyPopup").css("display","");

    }
    else{
        checkDuplicateJobname(jobEmptyval,_jobid);
        //localStorage.setItem('jobName',$(".Editing_Jobname").val());

    }
    return false;
});
function checkDuplicateJobname(jobEmptyval,_jobid){
    $.ajax({
        type: "GET",
        //  url: url,
        //  _changeUrl =  "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration="+_DeltaVal+mappingOptions.migrationOptionsChecked()+ "&withPermissions=true&unsupportedFiles="+_ZipVal;

        url: apicallurl +"/move/multiuser/jobValidation/"+ _jobid +"?jobName=" + jobEmptyval,
        aync : false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            localStorage.setItem('jobName',data);
            $("#jobEmptyPopup").css("display","none");
            $('.Editing_Jobname').attr("disabled","disabled");
            $("#checkTimediv").css("display","none");
            $(".Job_NAme").css("display","");
        },
        complete: function (xhr) {
            if (xhr.status === 409) {
                $("#jobEmptyPopup").css("display","");
                $("#jobEmptyPopup").text('Job Name already exists.');
                //$(".Editing_Jobname").val(localStorage.getItem('jobName'))
                $("#checkTimediv").css("display","");
                $(".Job_NAme").css("display","none");
                $('.Editing_Jobname').removeAttr("disabled");
                $(".Editing_Jobname").focus();
            }
        }

    });
}

$(document).on('click','#checkTimediv .fa-times',function(){
    sendGAEvents("Cancelled editing Job name in options screen");
    var s = localStorage.getItem('jobName');
    $(".Editing_Jobname").val(s);
    $(".Job_NAme").css("display","");
    $("#checkTimediv").css("display","none");
    var jobEmptyval = $(".Editing_Jobname").val();
    if(!jobEmptyval || jobEmptyval == "" ){
        $("#jobEmptyPopup").css("display","");
    }
    else{
        $("#jobEmptyPopup").css("display","none");
        $('.Editing_Jobname').attr("disabled","disabled");
    }
    return false;
});
$(document).on('keyup','.Editing_Jobname',function () {
    if($(".Editing_Jobname").val().length === 0) {
        var jobEmptyval = $(".Editing_Jobname").val();
        if (!jobEmptyval || jobEmptyval == "") {
            $("#jobEmptyPopup").css("display", "");
        }
        else {
            $("#jobEmptyPopup").css("display", "none");
        }
    }
});
$(document).on('keypress','.Editing_Jobname',function (e) {
    var filter = /^([a-zA-Z0-9 _\.\-])+$/;
    if($(".Editing_Jobname").val().length === 0) {

        if (e.key == ' ') {
            return false;
        }
        if (!filter.test(e.key)) {
            $("#jobEmptyPopup").css("display","");
            $("#jobEmptyPopup").text(e.key +' is not allowed.');
            return false;
        }
        else{
            $("#jobEmptyPopup").css("display","none");
            $("#jobEmptyPopup").text('Job Name cannot be empty.');
        }
    }
    if (!filter.test(e.key)) {
        $("#jobEmptyPopup").css("display","");
        $("#jobEmptyPopup").text(e.key +' is not allowed.');
        return false;
    }
    else{
        $("#jobEmptyPopup").css("display","none");
        $("#jobEmptyPopup").text('Job Name cannot be empty.');
    }
});
/*function jobNamCheck (a) {
    var filter = /^([a-zA-Z0-9 _\.\-])+$/;
    if (!filter.test(a)) {
        $("#jobEmptyPopup").css("display","");
        $("#jobEmptyPopup").text(a +'is not allowed.');
        return false;
    }

}*/





//Initiating Migration
function initiateMigration(_mappingSrcUrs){
    $("#mapdUsers tbody tr input[name=inputMapdUrs]:checked").each(function() {
        var _selectedTrValue =  $(this).parents('tr');
        var moveFileObject = {
            "fromId": $(_selectedTrValue).attr("srcrt"),
            "fromCId": $(_selectedTrValue).attr("srccldid"),
            "toId": $(_selectedTrValue).attr("dstnrt"),
            "toCId": $(_selectedTrValue).attr("dstncldid"),
            "fromMailId":  $(_selectedTrValue).attr("srcemail"),
            "toEmailId": $(_selectedTrValue).attr("dstnemail"),
            "fromCloudName": $(_selectedTrValue).attr("srccldname"),
            "toCloudName": $(_selectedTrValue).attr("dstncldname"),
            "notify": false,
            "userEmails": null,
            "isCopy": true,
            "multiUserMove": true,
            "destinationFolderName": 'FromCloudFuze'
        };
        multiUsrMoveNewCall(moveFileObject, []);
    });
}
//clearing all the data in mapped user
$(document).on('click','#clearBtn',function(){
    localStorage.removeItem("teamMigrationMappingPopUp");
    sendGAEvents("Deleted all mappings in mappings screen");
	//activecampaign.eventTrack('Delete all mappings',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    $("#CFShowLoading").modal("show");
        var srccldname = localStorage.getItem('multiUsrSrcCldName');
    var dstncldname = localStorage.getItem('multiUsrDstnCldName');
    if($('#mapdUsrs tbody tr').attr('csvid') !== undefined)
        deleteMapping(true,$('#mapdUsrs tbody tr').attr('csvid'));
    else
        deleteMapping(true);
    $("#mapdUsers tbody").html('');
	
	if(!(srccldname=== "SHAREFILE_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS")){
    $("div").removeClass('selectedClass');
    $("span").removeClass('selectedClass');
	$("#srcUsrs input:radio").attr('disabled',false);
	$("#dstnUsrs input:radio").attr('disabled',false);
	}
	if(srccldname=== "GOOGLE_SHARED_DRIVES" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS"){
    $("#dstnUsrs input:radio").attr('disabled',true);
	}
    //disableMapping('remove');
    $('#csvFileUpload').removeAttr('disabled');
    $('#csvFile').removeAttr('disabled');
    localStorage.removeItem('FolderChecked');
    localStorage.removeItem('CsvEmailChecked');
    localStorage.removeItem('csvMigrationData');
    localStorage.removeItem("validator");
    if($("#mapdUsers tbody").html() == "")
    {
        $('#mapdUsrs #csvFileUpload').css({'opacity': '1','cursor':'pointer'});
        $('#mapdUsrs #csvFileUpload').click(true);
        $('#mapdUsrs .fa-exchange').removeClass('disabled');
    }

    if((srccldname=== "BOX_BUSINESS" && dstncldname=== "GOOGLE_SHARED_DRIVES")||(srccldname=== "BOX_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS")||(srccldname=== "BOX_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_HYBRID") || (srccldname=== "DROPBOX_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS") || (srccldname=== "GOOGLE_SHARED_DRIVES" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS") || (srccldname=== "GOOGLE_SHARED_DRIVES" && dstncldname=== "SHAREPOINT_ONLINE_HYBRID")|| (srccldname=== "DROPBOX_BUSINESS" && dstncldname=== "GOOGLE_SHARED_DRIVES")|| (srccldname=== "EGNYTE_ADMIN" && dstncldname=== "GOOGLE_SHARED_DRIVES")|| (srccldname=== "SHAREFILE_BUSINESS" && dstncldname=== "SHAREPOINT_ONLINE_BUSINESS")|| (srccldname === "DROPBOX_BUSINESS" && dstncldname === "AMAZON")|| (srccldname=== "SHAREFILE_BUSINESS" && dstncldname=== "GOOGLE_SHARED_DRIVES"))
        $('#mapdUsrs .fa-exchange').addClass('disabled');
    else
        $('#mapdUsrs .fa-exchange').removeClass('disabled');
    $('.download').css('pointer-events', 'none');
    $('.download').css('opacity', '0.5');
    $('#help').css('visibility','hidden');
    $('#csvFileUpload').removeClass('onlyCsv');
});

//Migration Screens
 
$(document).on('click','.moveWorksapceList .lnil-chevron-down-circle',function(){
    $(document).find('.moveWorksapceList i.fa-chevron-circle-up').removeClass('fa fa-chevron-circle-up').addClass('lnil lnil-chevron-down-circle');
    $(document).find('.moveReportDetails').html('').css("display","none");
    $(this).closest("tr").find("i.lnil-chevron-down-circle").addClass('fa fa-chevron-circle-up').removeClass('lnil lnil-chevron-down-circle');
    var _htmlCode = appendWorkspaceReport(getWorkspaceReport($(this).parents("tr").attr('wrkspaceid'),'all',1));
    var count = CFManageCloudAccountsAjaxCall.fileFolderCount($(this).parents("tr").attr('wrkspaceid'));
    _htmlCode = _htmlCode.replace('TotalCounting',(count.totalFiles + count.totalFolders)).replace('ProcessedCounting',count.processedCount).replace('ErrorCounting',count.conflictCount);
    var _count = count.totalFiles + count.totalFolders;
    $(this).parents("tr").next(".moveReportDetails").append(_htmlCode).css("display","table-row");
    $(this).parents("tr").attr('totcount',_count);
    moveReportPagination(_count,$(this).parents("tr").attr('wrkspaceid'),'all');
});
$(document).on('click','.moveWorksapceList .fa-chevron-circle-up',function(){
    $(document).find('.moveWorksapceList i.fa-chevron-circle-up').removeClass('fa fa-chevron-circle-up').addClass('lnil lnil-chevron-down-circle');
    $(document).find('.moveReportDetails').html('').css("display","none");

});

$(document).on('click','.moveSyncWorksapceList .lnil-chevron-down-circle',function(){
    $(document).find('.moveSyncWorksapceList i.fa-chevron-circle-up').removeClass('fa-minus').addClass('lnil lnil-chevron-down-circle');
    $(document).find('.moveReportDetails').html('').css("display","none");
    $(this).closest("tr").find("i.lnil-chevron-down-circle").addClass('fa fa-chevron-circle-up').removeClass('lnil lnil-chevron-down-circle');
    var _value = $(this).attr('jobtype');
    if(_value === "TWO_WAY_SYNC"){
        var _htmlCode = appendTwoWaySyncWorkspaceReport(getWorkspaceReport_forTWS($(this).parents("tr").attr('wrkspaceid'),'all',1,$(this).parents("tr").attr('srccldname')));
        var count = CFManageCloudAccountsAjaxCall.fileFolderCount($(this).parents("tr").attr('wrkspaceid'),$(this).parents("tr").attr('srccldname'),_value);
    }
    else{
        var _htmlCode = appendSyncWorkspaceReport(getWorkspaceReport($(this).parents("tr").attr('wrkspaceid'),'all',1));
        var count = CFManageCloudAccountsAjaxCall.fileFolderCount($(this).parents("tr").attr('wrkspaceid'),'',_value);
    }
    _htmlCode = _htmlCode.replace('TotalCounting',(count.totalFiles + count.totalFolders)).replace('ProcessedCounting',count.processedCount).replace('ErrorCounting',count.conflictCount);
    $(this).parents("tr").next(".moveReportDetails").append(_htmlCode).css("display","table-row");
    moveSyncReportPagination($(this).parents("tr").attr('totcount'),$(this).parents("tr").attr('wrkspaceid'),'all',$(this).parents("tr").attr('srccldname'),_value);
});
$(document).on('click','.moveSyncWorksapceList .fa-chevron-circle-up',function(){
    $(document).find('.moveSyncWorksapceList i.fa-chevron-circle-up').removeClass('fa fa-chevron-circle-up').addClass('lnil lnil-chevron-down-circle');
    $(document).find('.moveReportDetails').html('').css("display","none"); 

});
$(document).on('click','.moveSyncWorksapceList .lnil-download',function(){
    if($(this).css('cursor') == 'pointer')
        downloadReportFile($(this).parents("tr").attr('wrkspaceid'));
});
$(document).on('click','#normalDwn',function(){
    if($(this).css('cursor') == 'pointer')
        downloadReportFile($(this).parents("tr").attr('wrkspaceid'));
});
$(document).on('click','#collaborationDwn',function(){
    if($(this).css('cursor') == 'pointer')
        downloadReportFileClb($(this).parents("tr").attr('wrkspaceid'));
});

$(document).on('click','#mappedSyncMigration .bg-info .fa-refresh',function(){
    refreshReports();
});
$(document).on('click','#mappedMigration .bg-info .fa-refresh',function(){
    refreshReports();
});
$(document).on('change','.moveReportDetailsTable .statusDropDown select',function () {
    var _html = appendFilterStatusFiles(getWorkspaceReport($(this).parents("tr").prev("tr.moveWorksapceList").attr('wrkspaceid'),$(this).val(),1));
    $(this).parents(".moveReportDetailsTable").find(".reportTable tbody").html('').append(_html);
    var _count = 0;
    if($(this).val() == 'all')
        _count = parseInt($(".moveReportDetailsTable .summary .totCnt").text());
    if($(this).val() == 'processed')
        _count = parseInt($(".moveReportDetailsTable .summary .prcsdCnt").text());
    if($(this).val() == 'error')
        _count = parseInt($(".moveReportDetailsTable .summary .errCnt").text());

    moveReportPagination(_count,$(this).parents("tr").prev("tr.moveWorksapceList").attr('wrkspaceid'),$(this).val())
});
$(document).on('change','.moveSyncReportDetailsTable .statusDropDown select',function () {
    var _html = appendFilterStatusFiles(getWorkspaceReport($(this).parents("tr").prev("tr.moveSyncWorksapceList").attr('wrkspaceid'),$(this).val(),1));
    $(this).parents(".moveSyncReportDetailsTable").find(".reportTable tbody").html('').append(_html);
    var _count = 0;
    if($(this).val() == 'all')
        _count = parseInt($(".moveSyncReportDetailsTable .summary .totCnt").text());
    if($(this).val() == 'processed')
        _count = parseInt($(".moveSyncReportDetailsTable .summary .prcsdCnt").text());
    if($(this).val() == 'error')
        _count = parseInt($(".moveSyncReportDetailsTable .summary .errCnt").text());

    moveSyncReportPagination(_count,$(this).parents("tr").prev("tr.moveSyncWorksapceList").attr('wrkspaceid'),$(this).val())
});
$(document).on('click','#mappedSyncMigration button',function () {
    if(!$("#mappedSyncMigration .custom-search-input input").val().length)
        return false;
    mappingOptions.searchJobByName($('#mappedSyncMigration .custom-search-input input').val());
});
$(document).on('click','#mappedSyncMigration .filter',function () {
    var _sts = $(this).parents("ul").attr('id');
    if(_sts == 'fromDomain')
        getFilteredReports('/from?page_nbr=1&page_size=20&fromDomainName=' + $(this).text());
    else if(_sts == 'fromCloud')
        getFilteredReports('/from?page_nbr=1&page_size=20&fromCloudName=' + $(this).text());
    else if(_sts == 'toDomain')
        getFilteredReports('/to?page_nbr=1&page_size=20&toDomainName=' + $(this).text());
    else if(_sts == 'toCloud')
        getFilteredReports('/to?page_nbr=1&page_size=20&toCloudName=' + $(this).text());
});
$(document).on('click','#mappedMigration button',function () {
    if(!$("#mappedMigration .custom-search-input input").val().length)
        return false;

    //appendMigrationWorkspaces(searchMoveWorkspaces($('#mappedMigration .custom-search-input input').val()),'all',1);
    mappingOptions.searchJobByName($('#mappedMigration .custom-search-input input').val().trim());
});
$(document).on('click','#mappedMigration .filter',function () {
    var _sts = $(this).parents("ul").attr('id');
    if(_sts == 'fromDomain')
        getFilteredReports('/from?page_nbr=1&page_size=20&fromDomainName=' + $(this).text());
    else if(_sts == 'fromCloud')
        getFilteredReports('/from?page_nbr=1&page_size=20&fromCloudName=' + $(this).text());
    else if(_sts == 'toDomain')
        getFilteredReports('/to?page_nbr=1&page_size=20&toDomainName=' + $(this).text());
    else if(_sts == 'toCloud')
        getFilteredReports('/to?page_nbr=1&page_size=20&toCloudName=' + $(this).text());
});
$("#filterStatus a").click(function () {
    getFilteredReports('/status?page_nbr=1&page_size=20&searchStatus=' + $(this).attr("value"));
});
function refreshReports(){
    mappingOptions.appendMigrationJobs(1,60);
    mappingOptions.appendSyncMigrationJobs(1,60);
}

function  getFilteredReports(url){
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/filter" + url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            appendMigrationWorkspaces(data);
            //    appendSyncMigrationWorkspaces(data);
        }
    });
}
function getFilter(){
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/filter/domainandcloudname",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            var _len = data.sourceDomainNames.length;
            $(".dropdown-submenu .dropdown-menu").html('');
            for(var i=0;i<_len;i++){
                $("#fromDomain").append('<li><a tabindex="-1" href="#" class="from filter">' +  data.sourceDomainNames[i]+ '</a></li>');
            }
            var _len = data.sourceCloudNames.length;
            for(var i=0;i<_len;i++){
                $("#fromCloud").append('<li><a tabindex="-1" href="#" class="from filter">' +  data.sourceCloudNames[i]+ '</a></li>');
            }
            var _len = data.destDomainNames.length;
            for(var i=0;i<_len;i++){
                $("#toDomain").append('<li><a tabindex="-1" href="#" class="to filter">' +  data.destDomainNames[i]+ '</a></li>');
            }
            var _len = data.destCloudNames.length;
            for(var i=0;i<_len;i++){
                $("#toCloud").append('<li><a tabindex="-1" href="#" class="to filter">' +  data.destCloudNames[i]+ '</a></li>');
            }
        }
    });
}

function disableMapping(value){
    if(value == 'add')
        $(document).find('.fa-exchange').addClass('disabeled').css("cursor","not-allowed");
    else if(value == 'remove')
        $(document).find('.fa-exchange').removeClass('disabeled').css("cursor","pointer");
}
/* function disableMapping(value){
    if(value == 'add')
        $('#mapdUsrs .fa-exchange').addClass('noPointer').removeClass('fa-exchange');
    else if(value == 'remove')
        $('#mapdUsrs .noPointer').removeClass('noPointer').addClass('fa-exchange');
}
$('.noPointer').on('click',function(e){
    e.preventDefault();
}); */

function deleteMapping(_async,csvid){
    var _val = false;
    if(_async != undefined)
        _val = _async;
	localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr('id'));
	localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr('id'));
 $("#CFShowLoading").modal("show");
    $.ajax({
        type: "DELETE",
        url: apicallurl + "/mapping/deleteAll/mapplist?sourceAdminCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destAdminCloudId=" + localStorage.getItem("multiUsrDstnCldId"),
        async:_val,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            var searchData = JSON.parse(localStorage.getItem("searchData"));
            searchData.mapping = false;
            localStorage.setItem("searchData",JSON.stringify(searchData));
            $('#mapdUsrs .custom-search-input input').val('');
            var _txt = "0 of 0";
            $("#forNextMove").addClass("disabled");
            $(document).find("#chkInput").attr("disabled", true).prop( "checked", false );
            $("#clearBtn").css("pointer-events",'none');
            $("#clearBtn").css("cursor","not-allowed");
            $("#clearBtn").css("opacity","0.6");
            mappingOptions.localStorageOperation('','rmv');
            mappingOptions.folderOperation('','rmv');
            CsvOperation('','rmv');
             if(csvid !== undefined){
                deleteCsv(csvid);
		localStorage.removeItem("Csv");
		}
            $("#mapdUsrs .paginationDiv").css("opacity","0.6");
            $('#mapdUsrs .paginationDiv select').prop('disabled', true);
            $('#mapdUsrs .paginationDiv input').prop('disabled', true);
            $("#mapdUsrs .paginationCF span").last().text(_txt );
            $("#mapdUsrs .paginationCF input").val(0);
            $(document).find("#chkInput").attr("disabled", true);
            $("#clearBtn").css("pointer-events",'none');
            $("#clearBtn").css("cursor","not-allowed");
            $("#clearBtn").css("opacity","0.6");
            $('#paginationMapng').html('');
            $('#paginationMapng').twbsPagination({
                totalPages: 1,
                visiblePages: 4,
                next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
                first:'<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
                last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                onPageClick: function (event, page){}
            });
			 $('.download12').css('pointer-events', 'none');
                    $('.download12').css('opacity', '0.4');
			
            $('.download').css('pointer-events', 'none');
            $('.download').css('opacity', '0.5');
            $('#help').css('visibility','hidden');
            $('#csvFileUpload').removeClass('onlyCsv');
        }
    });
    setTimeout(function () {
            $("#CFShowLoading").modal("hide");
    }, 1000);
}
function emailMaxChar(string,len){
    if(string.length < len){
        return string;
    }
    var email = string.split('@');
    if(email[0].length > len )
        return(CFManageCloudAccountsAjaxCall.getMaxChars(email[0],len - 5) + '@' +  CFManageCloudAccountsAjaxCall.getMaxChars(email[1],5));
    else
        return(email[0] + '@' +  CFManageCloudAccountsAjaxCall.getMaxChars(email[1],len - email[0].length));
}
function disableDwnldBtn(status){
    /* commenting for download btn*/
    //||status == "MULTIUSER_INACTIVE" ||status == "PROCESSED_WITH_SOME_PAUSE" ||status == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"
    if(status == "PROCESSED" ||status == "MULTIUSER_INACTIVE" ||status == "PROCESSED_WITH_SOME_PAUSE" ||status == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"|| status == "ERROR" || status == "SUSPENDED" || status == "PROCESSED_WITH_SOME_ERRORS" || status == "PROCESSED_WITH_SOME_WARNINGS" || status == "CANCEL" || status == "PROCESSED_WITH_SOME_CONFLICTS" || status == "CONFLICT")
        return('style = "color: #0062FF;font-size:13px;font-weight:bold;cursor: pointer;color: rgba(0,0,0,1)"');
    else
        return('style = "color: #0062FF;font-size:13px;font-weight:bold;cursor: not-allowed;color: rgba(0,0,0,0.6)"'); 
}
function disableCollabDwnldBtn(status){
    if(status == "PROCESSED" ||status == "MULTIUSER_INACTIVE" ||status == "PROCESSED_WITH_SOME_PAUSE" ||status == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"|| status == "ERROR" || status == "SUSPENDED" || status == "PROCESSED_WITH_SOME_ERRORS" || status == "PROCESSED_WITH_SOME_WARNINGS" || status == "CANCEL" || status == "PROCESSED_WITH_SOME_CONFLICTS" || status == "CONFLICT")
        return('style = "color: #0062FF;font-size:13px;font-weight:bold;cursor: pointer;color: rgba(0,0,0,1)"');
    else
        return('style = "color: #0062FF;font-size:13px;font-weight:bold;cursor: not-allowed;color: rgba(0,0,0,0.6)"');
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
        complete: function (xhr) {
            var data = xhr.responseText;
            if (xhr.status == 200) {
                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'migration_report_' + wid + '.csv';
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
function downloadReportFileClb(wid){
    $.ajax({
        type: "GET",
        url: apicallurl + "/mapping/download/colladetails?moveWorkSpaceId=" + wid,
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
                link.download = 'migration_report_' + wid + '.csv';
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
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width:20px;"> <i class="fa fa-file-text-o"></i> </div><div class="fileName">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed</td><td>SizeMB</td><td>DateDisplay</td></tr>';
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _fileData = reportData[i];
        _filesHtml = _filesHtml + _fileRow.replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSize, _fileData.cfFileMini.type) ).replace('DateDisplay',mappingOptions.getDateConversion(_fileData.createdTime));
    }
    return _filesHtml;
}
function appendWorkspaceReport(reportData) {
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
    var _html = '<td colspan="9"> <div class="moveReportDetailsTable" style="padding: 25px;margin-left: 3%;margin-right: -2%;margin-top:-3%;"> <div class="summary" style="margin-bottom:9%;"> <div class="col-md-3" style="float:left;border-radius: 4px;color: #1F2129;padding: 1%;width: 28%;float: left;margin-left: 5%;text-align:center;font-weight:bold;"><div class="totCnt">Total Files/Folders : TotalCounting</div></div><div class="col-md-3 prcsdfileCnt" style="float:left;border-radius: 4px;color: #00C64F;padding: 1%;width: 28%;float: left;margin-left: 5%;text-align:center;font-weight:bold;"><div class="prcsdCnt">Processed Files/Folders : ProcessedCounting</div></div><div class="col-md-3" style="float:left;border-radius: 4px;color: #FF4C4C;padding: 1%;width: 28%;float: left;margin-left: 5%;text-align:center;font-weight:bold;"><div class="errCnt">Conflict Files/Folders : ErrorCounting</div></div><div class="form-group statusDropDown col-md-3"></div></div><div class="reportTable"> <table style="width:95%;"> <thead style="background: #f2f3ff;"> <tr> <th style="width:34%;">File-Name</th> <th style="width:28%;">Status</th> <th style="width:19%;">Size</th> <th style="width:19%;">Date</th> </tr></thead> <tbody> BodyToAttachFiles </tbody> </table> </div><div class="pagination p1" style="padding: 0;margin: 0;border-radius: 0;width: 100%;"> <ul class="paginationReport" class="pagination-sm" style="margin-left:30%"></ul> </div></div></td>';
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width:20px;"> <i class="lnil lnil-files"></i> </div><div class="fileName" title="fileTitle">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed showDesc</td><td>SizeMB</td><td>DateDisplay</td></tr>'; 
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _fileData = reportData[i], _fileRow1 =_fileRow,_a='';
        if(_fileData.cfFileMini.directory)
            _fileRow1 = _fileRow1.replace('class="lnil lnil-files"','class="lnil lnil-folder" style="font-size:16px;"');
        if (_fileData.processStatus == "CONFLICT" || _fileData.processStatus == "CANCEL" || _fileData.processStatus == "WARNING" || _fileData.processStatus == "ERROR") {
            if(_fileData.userErrorMsg == null){
                _fileData.userErrorMsg = "Cancel";
                _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
            }
            else
                _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
        }

	_filesHtml = _filesHtml + _fileRow1.replace('fileTitle',_fileData.cfFileMini.objectName).replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('showDesc',_a).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSize, _fileData.cfFileMini.type) ).replace('DateDisplay',mappingOptions.getDateConversion(_fileData.createdTime));

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

/*For two way Sync*/
/* function getWorkspaceReport_forTWS(wid,status,pgNo,cldName) {
    var _result;
    status = status.toUpperCase();
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/twoway/movereport?workspaceId=" + wid + "&page_nbr=" + pgNo + "&status="+ status+ "&fromCloudName="+cldName,
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
} */

function appendSyncWorkspaceReport(reportData) {
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
        "PAUSE":"Pause"
    };
    //<div style="margin-right: 3%;">Status : </div><select class="form-control" style="width: 50%;margin-top: -3%"> <option value="all">All</option> <option value="processed">Processed</option> <option value="error">Error</option> <option value="suspended">Suspended</option> </select>
    var _html = '<td colspan="8"> <div class="moveSyncReportDetailsTable" style="padding: 25px;"> <div class="summary"> <div class="col-md-3"><div class="totCnt">Total Files/Folders : TotalCounting</div></div><div class="col-md-3" id="syncReportProc"> <div class="prcsdCnt">Processed Files/Folders : ProcessedCounting</div></div><div class="col-md-3"><div class="errCnt">Conflict Files/Folders : ErrorCounting</div></div><div class="form-group statusDropDown col-md-3"></div></div><div class="reportTable"> <table> <thead style="width: 95%;background:#f2f3ff;"> <tr> <th>File-Name</th> <th>Status</th> <th>Size</th> <th>Date</th> </tr></thead> <tbody> BodyToAttachFiles </tbody> </table> </div><div class="pagination p1" style="padding: 0;margin: 0;border-radius: 0;width: 100%;"> <ul class="paginationReport" class="pagination-sm"></ul> </div></div></td>';
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width:20px;"> <i class="fa fa-file-text-o"></i> </div><div class="fileName">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed showDesc</td><td>SizeMB</td><td>DateDisplay</td></tr>'; 
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _fileData = reportData[i], _fileRow1 =_fileRow,_a='';
        if(_fileData.cfFileMini.directory)
            _fileRow1 = _fileRow1.replace('class="fa fa-file-text-o"','class="fa fa-folder" style="font-size:16px;"');
        if (_fileData.processStatus == "CONFLICT" || _fileData.processStatus == "CANCEL" || _fileData.processStatus == "WARNING" || _fileData.processStatus == "ERROR") {
            if(_fileData.userErrorMsg == null){
                _fileData.userErrorMsg = "Cancel";
                _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
            }
            else
                _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
        }

        _filesHtml = _filesHtml + _fileRow1.replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('showDesc',_a).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSize, _fileData.cfFileMini.type) ).replace('DateDisplay',mappingOptions.getDateConversion(_fileData.createdTime));

    }
    _html =_html.replace('BodyToAttachFiles',_filesHtml)
    return _html;
}
/*
function appendTwoWaySyncWorkspaceReport(reportData) {
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
    var clouds = {
        "SYNCPLICITY" : "Syncplicity",
        "SHAREPOINT_ONLINE_BUSINESS" : "Sharepoint Online-Admin",
        "NETWORK_FILESHARES" : "Network FileShares",
        "BOX_BUSINESS" : "Box Business-Admin",
	"ONEDRIVE_BUSINESS_ADMIN" : "Onedrive for Business-Admin",
	"GOOGLE_SHARED_DRIVES":"Shared drives",
	"G_SUITE":"Google Suite",
	"DROPBOX_BUSINESS": "Dropbox Business-Admin",
	"EGNYTE_ADMIN": "Egnyte-Admin"
    }
    var _srcIcon =localStorage.getItem('twoWaySrcIcon');
    var _dstIcon =localStorage.getItem('twoWayDstnIcon');

    var _html = '<td colspan="6"> <div class="moveSyncReportDetailsTable" style="padding: 25px;"><div class="col-md-12" id="tabsForSync"><div class="col-md-6 activeTab" id="twowaySyncSrc" style="cursor:pointer;font-size:14px;font-weight:bold;padding-bottom: 1%;width:45%;text-align: center;"><img src=" ../img/drive/circle/_srcIcon.png" alt="pic" style="height: 20px;width: 20px;margin-right: 2%"/><span id="srcDisplayName">DisplaySrcName</span><i class="fa fa-long-arrow-right" style="margin: 0% 4%;font-size: 18px;"></i><img src=" ../img/drive/circle/_dstIcon.png" alt="pic" style="height: 20px;width: 20px;margin-right: 2%"/><span id="dstnDisplayName">DisplayDstnName</span></div><div class="col-md-6" id="twowaySyncDstn" style="cursor:pointer;font-size:14px;font-weight:bold;padding-bottom: 1%;width:45%;margin-left:5%;text-align: center;"><img src=" ../img/drive/circle/_dstIcon.png" alt="pic" style="height: 20px;width: 20px;margin-right: 2%"/><span id="dstnDisplayName">DisplayDstnName</span><i class="fa fa-long-arrow-right" style="margin: 0% 4%;font-size: 18px;"></i><img src=" ../img/drive/circle/_srcIcon.png" alt="pic" style="height: 20px;width: 20px;margin-right: 2%"/><span id="srcDisplayName">DisplaySrcName</span></div> </div> <div class="summary" style="margin-top: 4%;"> <div class="col-md-3"> <div>Total Files/Folders : </div><div class="totCnt">TotalCounting</div></div><div class="col-md-3" style="width : 28%"> <div>Processed Files/Folders : </div><div class="prcsdCnt">ProcessedCounting</div></div><div class="col-md-3"> <div>Conflict Files/Folders : </div><div class="errCnt">ErrorCounting</div></div><div class="form-group statusDropDown col-md-3"></div></div><div class="reportTable"> <table> <thead> <tr> <th>File-Name</th> <th>Status</th> <th>Size</th> <th>Date</th> </tr></thead> <tbody> BodyToAttachFiles </tbody> </table> </div><div class="pagination p1" style="padding: 0;margin: 0;border-radius: 0;width: 100%;"> <ul class="paginationReport" class="pagination-sm"></ul> </div></div></td>';
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width:20px;"> <i class="fa fa-file-text-o"></i> </div><div class="fileName">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed showDesc</td><td>SizeMB</td><td>DateDisplay</td></tr>';
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _fileData = reportData[i], _fileRow1 =_fileRow,_a='';
        if(_fileData.cfFileMini.directory)
            _fileRow1 = _fileRow1.replace('class="fa fa-file-text-o"','class="fa fa-folder" style="font-size:16px;"');
        if (_fileData.processStatus == "CONFLICT" || _fileData.processStatus == "CANCEL" || _fileData.processStatus == "WARNING" || _fileData.processStatus == "ERROR") {
            if(_fileData.userErrorMsg == null){
                _fileData.userErrorMsg = "Cancel";
                _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
            }
            else
                _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
        }

        _filesHtml = _filesHtml + _fileRow1.replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('showDesc',_a).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSize, _fileData.cfFileMini.type) ).replace('DateDisplay',mappingOptions.getDateConversion(_fileData.createdTime));

    }
    _html =_html.replace('BodyToAttachFiles',_filesHtml);
    _html = _html.replace('_srcIcon',_srcIcon).replace('DisplaySrcName',clouds[_srcIcon]).replace('_dstIcon',_dstIcon).replace('DisplayDstnName',clouds[_dstIcon]).replace('_srcIcon',_srcIcon).replace('DisplaySrcName',clouds[_srcIcon]).replace('_dstIcon',_dstIcon).replace('DisplayDstnName',clouds[_dstIcon]);
    return _html;
} */

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
    $("#mappedMigration #mgrtnReports tbody").html('');
    var _workspaceLen = data.length;
    var _moveIdHtml = '<tr class="moveWorksapceList rmvdCloudClass" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"> <td> <div><div class="migrateImg" style="margin-top: -2%;"> <div id="srcCloudImage" class="migrationImage" style="float: left"/><div></div> <div style="padding-top: 3%;">srcEmailDisplay</div></div></td><td> <div><div class="migrateImg" style="margin-top: -2%;"> <div id="dstCloudImage" class="migrationImage" style="float: left"/></div></div> <div style="padding-top: 3%;">dstEmailDisplay</div></div></td><td class="processStatus">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" style="color: #0062FF;font-size:13px;font-weight:bold;cursor:pointer;" appendStyling></i></div></td><td > <div> <i class="lnil lnil-chevron-down-circle" style="cursor: pointer;color: #0062FF;font-size: 18px;font-weight: 600;"></i> </div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';
    for(var i = 0; i < _workspaceLen; i++ ){
        var _result = data[i];
        if(_result.fromCloudId == null || _result.toCloudId == null)
            _moveIdHtml = _moveIdHtml.replace('rmvdCloudClass','cloudRmvd');
        else
            _moveIdHtml = _moveIdHtml.replace('cloudRmvd','rmvdCloudClass');


        if(_result.multiUserMove) {
            _result = JSON.parse(JSON.stringify(_result, function(key, value) {
                if(value === null) {
                    return "Not Available";
                }
                return value; 
            }));
            var _html ="";
            _html = _moveIdHtml.replace('workSpaceId',_result.id).replace('srcEmailId',_result.fromMailId).replace('srcCloudName',_result.fromCloudName).replace('srcCloudId',_result.fromCloudId.id).replace('srcRootId',_result.fromRootId).replace('dstnEmailId',_result.toMailId).replace('dstnCloudName',_result.toCloudName).replace('dstnCloudId',_result.toCloudId.id).replace('dstnCloudRoot',_result.toRootId).replace('srcCloudImage',_result.fromCloudName).replace('srcEmailDisplay',_result.fromMailId).replace('dstCloudImage',_result.toCloudName).replace('dstEmailDisplay',_result.toMailId).replace('processStatus',_result.processStatus).replace('processStatusDispaly',moveStatus[_result.processStatus]).replace('dateDisplay',mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount',_result.processedCount).replace('errorCount',_result.errorCount).replace('totalCount',_result.totalFilesAndFolders).replace('appendStyling',disableDwnldBtn(_result.processStatus));

            $("#mappedMigration #mgrtnReports tbody").append(_html);
        }
    }
} 
function appendSyncMigrationWorkspaces(data){
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
        "CANCEL": "Cancel"
    };
    $("#mappedSyncMigration #mgrtnSyncReports tbody").html('');
    var _workspaceLen = data.length;
    var _moveIdHtml = '<tr class="moveSyncWorksapceList rmvdCloudClass" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"><td> <div> <img src="../img/PNG/srcCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>srcEmailDisplay</div></div></td><td> <div> <img src="../img/PNG/dstCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>dstEmailDisplay</div></div></td><td class="processStatus">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" style="color: #0062FF;font-size:13px;font-weight:bold;cursor:pointer;" appendStyling></i></div></td> <td > <div> <i class="lnlil lnil-chevron-down-circle" style="cursor: pointer;color: #0062FF;font-size: 18px;font-weight: 600;"></i> </div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';
    for(var i = 0; i < _workspaceLen; i++ ){ 
        var _result = data[i];
        if(_result.fromCloudId == null || _result.toCloudId == null)
            _moveIdHtml = _moveIdHtml.replace('rmvdCloudClass','cloudRmvd');
        else
            _moveIdHtml = _moveIdHtml.replace('cloudRmvd','rmvdCloudClass');

        if(_result.multiUserMove) {
            _result = JSON.parse(JSON.stringify(_result, function(key, value) {
                if(value === null) {
                    return "Not Available";
                }
                return value;
            }));
            var _html ="";
            _html = _moveIdHtml.replace('workSpaceId',_result.id).replace('srcEmailId',_result.fromMailId).replace('srcCloudName',_result.fromCloudName).replace('srcCloudId',_result.fromCloudId.id).replace('srcRootId',_result.fromRootId).replace('dstnEmailId',_result.toMailId).replace('dstnCloudName',_result.toCloudName).replace('dstnCloudId',_result.toCloudId.id).replace('dstnCloudRoot',_result.toRootId).replace('srcCloudImage',_result.fromCloudName).replace('srcEmailDisplay',_result.fromMailId).replace('dstCloudImage',_result.toCloudName).replace('dstEmailDisplay',_result.toMailId).replace('processStatus',_result.processStatus).replace('processStatusDispaly',moveStatus[_result.processStatus]).replace('dateDisplay',mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount',_result.processedCount).replace('errorCount',_result.errorCount).replace('totalCount',_result.totalFilesAndFolders).replace('appendStyling',disableDwnldBtn(_result.processStatus));

            $("#mappedSyncMigration #mgrtnSyncReports tbody").append(_html);
        }
    }
}
function  moveSyncReportPagination(count,wid,status,srcCldName,jobType){
    $('#mappedSyncMigration .paginationReport').empty();
    $('#mappedSyncMigration .paginationReport').removeData("twbs-pagination");
    $('#mappedSyncMigration .paginationReport').unbind("page");
    if (jobType == "TWO_WAY_SYNC"){
        var _data = CFManageCloudAccountsAjaxCall.fileFolderCount(wid,srcCldName,jobType);
    }
    else {
        var _data = CFManageCloudAccountsAjaxCall.fileFolderCount(wid);
    }
    count = Math.ceil((_data.totalFiles + _data.totalFolders)/20);
    $("#mappedSyncMigration .paginationReport").twbsPagination({
        totalPages: count,
        visiblePages: 6,
        next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
        prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
        first:'<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
        last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
        onPageClick: function (event, page) {
            appendWorkspaceReportPaginated(getWorkspaceReport(wid,status,page));
        }
    });
}

function  moveReportPagination(_count,wid,status){
    $('#mappedMigration .paginationReport').empty();
    $('#mappedMigration .paginationReport').removeData("twbs-pagination");
    $('#mappedMigration .paginationReport').unbind("page");
    // var _data = CFManageCloudAccountsAjaxCall.fileFolderCount(wid);
    // count = Math.ceil((_data.totalFiles + _data.totalFolders)/20);
    count = Math.ceil(_count/20);
    $("#mappedMigration .paginationReport").twbsPagination({
        totalPages: count,
        visiblePages: 6,
        next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
        prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
        first:'<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
        last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
        onPageClick: function (event, page) {
            appendWorkspaceReportPaginated(getWorkspaceReport(wid,status,page));
        }
    });
}

function appendWorkspaceReportPaginated(reportData) {
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
    $(".reportTable tbody").html('');
    var _fileRow = '<tr> <td> <div> <div class="fileIcon" style="float: left;width: 20px;"> <i class="lnil lnil-files"></i> </div><div class="fileName">DisplayFileName</div></div></td><td class="PROCESSEDClass">DisplayProcessed showDesc</td><td>SizeMB</td><td>DateDisplay</td></tr>';
    var _len = reportData.length;
    var _filesHtml = '';
    for(var i=0; i < _len; i++){
        var _files = _fileRow,_a = '';
        var _fileData = reportData[i];
        if(_fileData.folder)
            _files = _files.replace('lnil lnil-files','lnil lnil-folder');
        if (_fileData.processStatus == "CONFLICT" || _fileData.processStatus == "PAUSE"|| _fileData.processStatus == "CANCEL" || _fileData.processStatus == "WARNING" || _fileData.processStatus == "ERROR") {
            _a = '<i id="_error' + _fileData.id + '" class="cf-warning3"  title=' + JSON.stringify(_fileData.userErrorMsg) + ' style="margin-left:5px;color:red"></i>';
        }
        _filesHtml = _filesHtml + _files.replace('DisplayFileName',CFManageCloudAccountsAjaxCall.getMaxChars(_fileData.cfFileMini.objectName,30)).replace('PROCESSEDClass',_fileData.processStatus).replace('DisplayProcessed',moveStatus[_fileData.processStatus]).replace('showDesc',_a).replace('SizeMB',CFManageCloudAccountsAjaxCall.getObjectSize(_fileData.cfFileMini.objectSize, _fileData.cfFileMini.type) ).replace('DateDisplay',mappingOptions.getDateConversion(_fileData.createdTime));
    }
    $(".reportTable tbody").html(_filesHtml);
}
$(document).on('change','#chkInput',function () {
    localStorage.removeItem("selMappings");
    if($("#chkInput:checked").length){
        //   $("#forNextMove").removeClass("disabled");
        $("input[name=inputMapdUrs]").prop('checked',true);
        if($('#mapdUsers input[name=inputMapdUrs]:checked').length > 0){
            $("#forNextMove").removeClass("disabled");
        }
        if(!($(this).parents("table").find('tbody tr').hasClass("automapRow"))&& !($(this).parents("table").find('tbody tr').hasClass("folderRow"))){
            $('#mapdUsers input[name=inputMapdUrs]:checked').each(function(){
                if($(this).closest('tr').attr('srccldname') ==="DROPBOX_BUSINESS" && $(this).closest('tr').attr('dstncldname') ==="G_SUITE"){
                    var _obj ={
                        "fromCloudId": {
                            "id":$(this).closest('tr').attr('srccldid'),
                        },
                        "toCloudId": {
                            "id":$(this).closest('tr').attr('dstncldid')
                        },
                        "teamFolder":$(this).closest('tr').attr('teamFolder')
                    };
                }
                else {
                    var _obj = {
                        "fromCloudId": {
                            "id": $(this).closest('tr').attr('srccldid'),
                        },
                        "toCloudId": {
                            "id": $(this).closest('tr').attr('dstncldid')
                        }
                    };
                }
                var _objEmail ={
                    "fromMailId": $(this).closest('tr').attr('srcemail'),
                    "fileName":$(this).closest('tr').attr('srcemail'),
                    "toMailId": $(this).closest('tr').attr('dstnemail'),
                    "fromCloudName":$(this).closest('tr').attr('srccldname'),
                    "toCloudName":$(this).closest('tr').attr('dstncldname'),

                };
                if(!mappingOptions.localStorageOperation(_obj,'check')){
                    mappingOptions.localStorageOperation(_obj,'set');
                    mappingOptions.localStorageOperation(_objEmail,'set1');
                }
            });
        }
        else{
            $('#mapdUsers input[name=inputMapdUrs]:checked').each(function(){
                var _d = $(this).parent().parent();
                if($(_d).attr('srccldname') ==="DROPBOX_BUSINESS" && $(_d).attr('dstncldname') ==="G_SUITE"){
                    var _obj ={
                        "fromCloudId": {
                            "id":$(_d).attr('srccldid'),
                        },
                        "toCloudId": {
                            "id":$(_d).attr('dstncldid')
                        },
                        "teamFolder":$(_d).attr('teamFolder')
                    };
                }
                else {
                    var _obj = {
                        "fromCloudId": {
                            "id": $(_d).attr('srccldid'),
                        },
                        "toCloudId": {
                            "id": $(_d).attr('dstncldid'),
                        }
                    };
                }
                var _objEmail ={
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName":$(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName":$(_d).attr('srccldname'),
                    "toCloudName":$(_d).attr('dstncldname'),

                };
                if(!mappingOptions.localStorageOperation(_obj,'check')){
                    mappingOptions.localStorageOperation(_obj,'set');
                    mappingOptions.localStorageOperation(_objEmail,'set1');
                }
            });
        }
    }
    else{
        $('#mapdUsers input[name=inputMapdUrs]').each(function(){
            var _d = $(this).parent().parent();
            $(this).prop('checked',false);
            var _obj ={
                "fromCloudId": {
                    "id":$(_d).attr('srccldid'),
                },
                "toCloudId": {
                    "id":$(_d).attr('dstncldid'),
                }
            };
            var _objEmail ={
                "fromMailId": $(_d).attr('srcemail'),
                "fileName":$(_d).attr('srcemail'),
                "toMailId": $(_d).attr('dstnemail'),
                "fromCloudName":$(_d).attr('srccldname'),
                "toCloudName":$(_d).attr('dstncldname'),

            };
            mappingOptions.localStorageOperation(_obj,'delete');
            mappingOptions.localStorageOperation(_objEmail,'delete1');
        });
        if(localStorage.getItem('selectedMappings')){
            if (!JSON.parse(localStorage.getItem('selectedMappings')).length)
                $("#forNextMove").addClass("disabled");
            //mappingOptions.localStorageOperation('','rmv');
        }
    }
});
$(document).on('change', 'input[name="folderMapngCheckBox"]', function(){
    //localStorage.removeItem("selectedMappings");
    //localStorage.removeItem('selectedEmail');
    localStorage.removeItem("validator");
    var s =JSON.parse(localStorage.getItem("folderMappings"));
    if($('input[name="folderMapngCheckBox"]:checked').length > 0 || s.length>0){
        $('#forNextMove').removeClass('disabled');
    }
    else
        $('#forNextMove').addClass('disabled');

    if($('#mapdUsers input[name="csvMapngCheckBox"]:checked').length >0){
        $('#forNextMove').removeClass('disabled');
    }
    if( $('#mapdUsers input[name= "inputMapdUrs"]').length > 0) {
        var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
        var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
    }
    else{
        var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
        var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length - $('#mapdUsers input[disabled="disabled"]').length;
    }
    if (checkedLength == totalLength) {
        $('#chkInput').prop('checked', true);

    }
    else{
        $('#chkInput').prop('checked', false);
    }

if($(this).closest('tr').attr('srccldname') === "GOOGLE_SHARED_DRIVES" && $(this).closest('tr').attr('dstncldname') === "SHAREPOINT_ONLINE_BUSINESS"){
	if($(this).closest('tr').attr('dstnrt').split(':')[1] === "FOLDER" || $(this).closest('tr').attr('dstnrt').split(':')[1] === "DOCUMENT_LIBRARY"){
	  var _obj = {
                        "fromCloudId": {
                            "id": $(this).closest('tr').attr('srccldid')
                        },
                        "toCloudId": {
                            "id": $(this).closest('tr').attr('dstncldid')
                        },
                        "fromRootId": $(this).closest('tr').attr('srcrt'),
                        "toRootId": $(this).closest('tr').attr('dstnrt'),
                        "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
                        "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
                        "folder":"true",
	"documentLibrary":$(this).attr('parentName')
    };
	}
else{
     var _obj = {
                        "fromCloudId": {
                            "id": $(this).closest('tr').attr('srccldid')
                        },
                        "toCloudId": {
                            "id": $(this).closest('tr').attr('dstncldid')
                        },
                        "fromRootId": $(this).closest('tr').attr('srcrt'),
                        "toRootId": $(this).closest('tr').attr('dstnrt'),
                        "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
                        "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
                        "folder":"true"
                    };
}
}
		else{

    var _obj = {
        "fromCloudId": {
            "id": $(this).closest('tr').attr('srccldid'),
        },
        "toCloudId": {
            "id": $(this).closest('tr').attr('dstncldid')
        },
        "fromRootId": $(this).closest('tr').attr('srcrt'),
        "toRootId": $(this).closest('tr').attr('dstnrt'),
        "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
        "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
        "folder":"true"
    };
}

   var _objEmail = {
        "fromMailId": $(this).closest('tr').attr('srcemail'),
        "fileName": $(this).closest('tr').attr('srcemail'),
        "toMailId": $(this).closest('tr').attr('dstnemail'),
        "fromCloudName": $(this).closest('tr').attr('srccldname'),
        "toCloudName": $(this).closest('tr').attr('dstncldname'),

    };

    if($(this).is(':checked')) {
        mappingOptions.folderOperation(_obj, 'set');
        mappingOptions.folderOperation(_objEmail, 'set1');
    }
    else{
        mappingOptions.folderOperation(_obj,'delete');
        mappingOptions.folderOperation(_objEmail,'delete1');
    }
    if(localStorage.getItem('folderMappings')) {
        if (!JSON.parse(localStorage.getItem('folderMappings')).length)
            $("#forNextMove").addClass("disabled");
    }
});

function multiUsrMoveNewCall(moveFileObject,files) {
    // var jsonArray = {
    //     "fromRootId": moveFileObject.fromId,
    //     "toRootId": moveFileObject.toId,
    //     "type": "MOVE_WORKSPACE",
    //     "fromCloudId": {
    //         "id": moveFileObject.fromCId
    //     },
    //     "toCloudId": {
    //         "id": moveFileObject.toCId
    //     },
    //     "fromCloudName":moveFileObject.fromCloudName,
    //     "toCloudName":moveFileObject.toCloudName,
    //     "fromMailId":moveFileObject.fromMailId,
    //     "toMailId":moveFileObject.toEmailId,
    //     "fromCloudSpace": null,
    //     "toCloudSpace": null,
    //     "validSpace": true,
    //     "errorDescription": null,
    //     "totalFolders": null,
    //     "totalFiles": null,
    //     "moveFoldersStatus": false,
    //     "totalFilesAndFolders": 0,
    //     "userEmails": moveFileObject.userEmails,
    //     "threadBy": null,
    //     "retry": 0,
    //     "useEncryptKey": false,
    //     "notify": moveFileObject.notify,
    //     "fileMove": false,
    //     "success": false,
    //     "destinationFolderName":moveFileObject.destinationFolderName,
    //     "multiUserMove":true,
    //     "cfMultiUserMove":null,
    //     "fromAdminId":localStorage.getItem("mulUsrSrc"),
    //     "toAdminId": localStorage.getItem("mulUsrDst"),
    // };
    // var CFMultiUserMove=[];
    // $("#mapdUsrs tbody tr").each(function () {
    //     var CFMulti=
    //         {
    //             "fromEmailId":  $(this).attr("srcemail").trim(),
    //             "fromCloudId":  $(this).attr("srccldid").trim(),
    //             "fromCloudName": $(this).attr("srccldname").trim(),
    //             "fromRootId":  $(this).attr("srcrt").trim(),
    //             "toEmailId":$(this).attr("dstnemail").trim(),
    //             "toCloudId":$(this).attr("dstncldid").trim(),
    //             "toRootId":$(this).attr("dstnrt").trim(),
    //             "toCloudName":$(this).attr("dstncldname").trim(),
    //         }
    //     CFMultiUserMove.push(CFMulti);
    // });
    // jsonArray.cfMultiUserMove =CFMultiUserMove;
    // jsonArray.fileIds =files;
    //var MoveToJson = JSON.stringify(jsonArray);
    var MoveToJson = JSON.stringify( mappingOptions.localStorageOperation('','get') );

    $.ajax({
        type: 'POST',
        url: apicallurl + "/move/multiuser/create?isCopy=true",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
        },
        data: MoveToJson,
        dataType: 'json',
        success: function (move) {
            showNotyNotification("success","Migration initiated");
        },
        complete: function (xhr) {
            if (xhr.status > 300) {
                unCheckFile();
                alertError("Operation Failed");
            }
        }
    });
}


//Options Screen
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click','#appendJob .jobsRow .lnil-chevron-down-circle',function () {
    var $parentTr = $(this).closest( ".jobsRow" );
    $('#appendJob .jobsRow .lnil').removeClass('fa fa-chevron-circle-up').addClass('fa-plus');
    $('#appendJob .appendMigrateWorkSpaces').html('').css('display','none');
    $(this).removeClass('lnil lnil-chevron-down-circle').addClass('fa fa-chevron-circle-up');
    /*  var jobType = $($parentTr).attr('jobtype');
        var _htmlData = mappingOptions.getWorkspaces($($parentTr).attr('id'),1,50,jobType); */
    var _htmlData = mappingOptions.getWorkspaces($($parentTr).attr('id'),1,50);
    //$($parentTr).next('.appendMigrateWorkSpaces').css('display','block').html(_htmlData);
});
$(document).on('click','#appendJob .jobsRow .fa-chevron-circle-up',function () { 
    $('#appendJob .jobsRow .fa').removeClass('fa fa-chevron-circle-up').addClass('lnil lnil-chevron-down-circle');
    $('#appendJob .appendMigrateWorkSpaces').html('').css('display','none');
});
$(document).on('click','#appendSyncJob .jobsRow .fa-plus',function () {
    var $parentTr = $(this).closest( ".jobsRow" );
    $('#appendSyncJob .jobsRow .fa').removeClass('fa-minus').addClass('fa-plus');
    $('#appendSyncJob .appendSyncMigrateWorkSpaces').html('').css('display','none');
    $(this).removeClass('fa-plus').addClass('fa-minus');
    var _data = $($parentTr).attr('id');
    var jobType = $($parentTr).attr('jobtype');
    var _htmlData = mappingOptions.getSyncWorkspaces($($parentTr).attr('id'),1,50,jobType);
    //$($parentTr).next('.appendSyncMigrateWorkSpaces').css('display','block').html(_htmlData);
});
$(document).on('click','#appendSyncJob .jobsRow .fa-minus',function () {
    $('#appendSyncJob .jobsRow .fa').removeClass('fa-minus').addClass('fa-plus');
    $('#appendSyncJob .appendSyncMigrateWorkSpaces').html('').css('display','none');
});

$(document).on('click','table .editJob .fa-pencil',function () {
    $('.editJob').css('display','none');
    $('.ClickedEditJob').css('display','flex');
    $('.ClickedEditJob .jobName').val($(".editJob .jobName").text());
    //$("#forNextMove").addClass('disabled');
    //$("#forPreviousMove").addClass('disabled');
});
$(document).on('click','table .ClickedEditJob .fa-times',function () {
    $('.editJob').css('display','flex');
    $('.ClickedEditJob').css('display','none');
    $('.editJob div').css("display",'')
    // $("#forNextMove").removeClass('disabled');
    //$("#forPreviousMove").removeClass('disabled');
});
$(document).on('click','table .ClickedEditJob .fa-check',function () {
    var _val = $('.ClickedEditJob .jobName').val();
    if(_val.length < 4)
    {
        alertError("Min 4  characters are required.");
        return false;
    }
    $('.editJob').css('display','flex');
    $('.ClickedEditJob').css('display','none');
    $('.editJob div').css("display",'')
    $(".editJob .jobName").text(_val);
    //$("#forNextMove").removeClass('disabled');
    //$("#forPreviousMove").removeClass('disabled');
});

$(document).on('click','table .editPath .fa-pencil',function () {
    $('.editPath').css('display','none');
    $('.ClickedEditPath').css('display','flex');
    $('.ClickedEditPath .pathName').val($('.editPath .jobPath').text());
    // $("#forNextMove").addClass('disabled');
    // $("#forPreviousMove").addClass('disabled');
});
$(document).on('click','table .ClickedEditPath .fa-times',function () {
    $('.editPath').css('display','flex');
    $('.ClickedEditPath').css('display','none');
    $('.editPath div').css("display",'')
    // $("#forNextMove").removeClass('disabled');
    // $("#forPreviousMove").removeClass('disabled');
});
$(document).on('click','table .ClickedEditPath .fa-check',function () {
    var _val = $('.ClickedEditPath .pathName').val();
    // if(_val.length < 4)
    // {
    //     alertError("Min 4  characters are required.");
    //     return false;
    // }
    if(_val == '/')
        alertSuccess("Files will get migrated on root.");

    $('.editPath').css('display','flex');
    $('.ClickedEditPath').css('display','none');
    $('.editPath div').css("display",'');
    $('.editPath .jobPath').text(_val);
    // $("#forNextMove").removeClass('disabled');
    // $("#forPreviousMove").removeClass('disabled');
});
// $(document).on('click','table .emailNotify .fa-check',function () {
//     var _val = $('.emailNotify input').val();
//     if(mappingOptions.checkEmail(_val)){
//         var _html = '<div style="float:left;margin:2px;padding:4px;border: 1px solid #ccc;background: #fff;"><span>developer@cloudfuze.com</span> <i class="lnil lnil-cross-circle" style="cursor:pointer;padding:0 2px 0 10px"></i></div>';
//         _html = _html.replace("developer@cloudfuze.com",_val);
//         $('#emailId').append(_html);
//         $('.emailNotify input').val('');
//     }
// });
// $(document).find("table .emailNotify input").keyup(function(e){
//     if( e.which == 13){
//         var _val = $('.emailNotify input').val();
//         if(mappingOptions.checkEmail(_val)){
//             var _html = '<div style="float:left;margin:2px;padding:4px;border: 1px solid #ccc;;background: #fff;"><span>developer@cloudfuze.com</span> <i class="lnil lnil-cross-circle" style="cursor:pointer;padding:0 2px 0 10px"></i></div>';
//             _html = _html.replace("developer@cloudfuze.com",_val);
//             $('#emailId').append(_html);
//             $('.emailNotify input').val('');
//         }
//     }
// });
$(document).on('click','table #emailId .fa-times',function () {
    $(this).parent().remove();
});


$(document).find("#mappingOptions input[type=text]").keypress(function(e) {
    /* if(e.which == 8 || e.which == 17 || e.which == 16 || e.which == 20) */
    if(e.which == 8 || e.which == 17 || e.which == 16 || e.which == 20 || e.which == 39 || e.which == 37)
        return true;
    else if(navigator.userAgent.search("Firefox") && e.which == 0)
        return true;

    else if(e.which == 13)
    {
        var _cls = $(this).attr('class');

        if(_cls.indexOf("pathName") >= 0){
            var _val = $('.ClickedEditPath .pathName').val();
            if(_val == '/')
                alertSuccess("Files will be migrated to root.");

            // $('.editPath').css('display','flex');
            // $('.ClickedEditPath').css('display','none');
            // $('.editPath div').css("display",'')
            // $('.editPath .jobPath').text(_val);
        }
        else{
            var _val = $('.ClickedEditJob .jobName').val();
            if(_val.length < 4)
            {
                alertError("Min 4  characters are required.");
                return false;
            }
            // $('.editJob').css('display','flex');
            // $('.ClickedEditJob').css('display','none');
            // $('.editJob div').css("display",'')
            // $(".editJob .jobName").text(_val);
        }
        return true;
    }
    //Enter: 13,Up: 38,Down: 40,Right: 39,Left: 37,Esc: 27,SpaceBar: 32,Ctrl: 17,Alt: 18,Shift: 16,backspace:8,capslock:20
    if($(this).val().length > 30 && $(this).attr('class') == 'jobName')
    {
        alertSuccess("Max 30 characters are allowed.");
        return false; 
    }
    else if($(this).val().length > 15 && $(this).attr('class') == 'pathName')
    {
        alertSuccess("Max 15 characters are allowed.");
        return false;
    }
    return mappingOptions.acceptCharcter(String.fromCharCode(e.which));
});
$(document).find("#mappingOptions input[type=text].pathName").keydown(function(e) {
    var field=this;
    var _val = $(this).val();
    setTimeout(function () {
        if(field.value.indexOf('/') !== 0) {
            var _val = $(field).val();
            $(field).val('/' + _val);
        }
    }, 1);
});
var mappingOptions ={
    appendMigrationJobs : function(pageNumber,pageSize){
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/get/moveJob?page_nbr=" + _page_Num + "&page_size=30" ,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                mappingOptions.appendJobs(data);
            }
        });
    },

    searchJobByName:function(searchTerm){
        searchTerm = searchTerm.toLowerCase();
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/search/" + searchTerm,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                mappingOptions.appendJobs(data);
                mappingOptions.appendSyncJobs(data);
            }
        });
    },
    appendJobs:function (data) {
        var jobStatus = {
            "STARTED" : "Started",
            "COMPLETED" : "Completed",
            "SUSPENDED" : "Suspended",
            "IN_PROGRESS": "In Progress",
            "MULTIUSERTRAIL_COMPLETED": "Trial Completed"
        };

        /* var job = {
                  "ONETIME" : "One Time",
                  "DELTA" : "Delta"
              };

              var _appendHtml ='<tr id="job_ID" class="jobsRow" jobtype="jobType"> <td style="width: 5%"> <div> <i class="fa fa-plus" style="cursor: pointer"></i> </div></td><td style="width: 35%">Job_Name</td><td style="width:10%" id="jobType">Job_Type</td><td style="width: 20%">DestinationFolder</td><td class="Job_Status" style="font-weight: bold;width: 18%">Job_Status_Show</td><td>Date</td></tr><tr class="appendMigrateWorkSpaces" style="display: none"></tr>',//<td> <i class="lnil lnil-download"></i> </td> */

 var _appendHtml ='<tr id="job_ID" class="jobsRow" style="border-bottom:1px solid #e5e5e5;height:60px;border-top: 1px solid #e5e5e5;"><td style="width: 20%" title="nameofjob">Job_Name</td><td style="width:10%" id="jobType">Job_Type</td><td style="width: 15%">DestinationFolder</td><td class="Job_Status" style="font-weight: bold;width: 15%">Job_Status_Show</td><td style="width: 15%">Date</td><td style="width: 10%"><img src="../img/Pause.png" style="cursor:not-allowed;opacity:0.2;margin-left: 45%;" class="disablePause"></td><td style="width: 10%"><i class="lnil lnil-cross-circle" style="cursor: not-allowed;opacity:0.2;margin-left: 18%;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" class="cleBtn"></i></td> <td style="width: 5%"> <div> <i class="lnil lnil-chevron-down-circle" style="color: #0062FF;font-size: 18px;font-weight: 600;cursor:pointer;"></i> </div></td></tr><tr class="appendMigrateWorkSpaces" style="display: none"></tr>',//<td> <i class="lnil lnil-download"></i> </td>
              _len = data.length;
			  if(_page_Num == 1){
        $("#appendJob tbody").html('');
			  }
        for(var i = 0; i < _len; i++){
                 /*   if(i == 0 && data[0].jobStatus === "COMPLETED") {
                        activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'testMigrationCompleted','Yes');        
			            }*/
            var _data = data[i],_html;
            var selectedtext ;
            selectedtext= data[i].jobType;
            if(selectedtext == undefined){
                selectedtext =data[i].jobType;
            }
            if(selectedtext == null){
                selectedtext="ONETIME";
            }
            var csv = data[i].isCSV;

            // $("#jobType").text("selectedText");
            if(_data.jobStatus != "STARTED"){

                if((selectedtext== "ONETIME") ||(selectedtext== "DELTA")) {
                    /*   if(csv === true)
                                        _html = _appendHtml.replace("job_ID", _data.id).replace("jobType", _data.jobType).replace("Job_Name", _data.jobName).replace("Job_Type", job[selectedtext]).replace("DestinationFolder", '-').replace("Job_Status", _data.jobStatus).replace("Job_Status_Show", jobStatus[_data.jobStatus]).replace("Date", mappingOptions.getDateConversion(_data.createdTime));
                                    else
                                        _html = _appendHtml.replace("job_ID", _data.id).replace("jobType", _data.jobType).replace("Job_Name", _data.jobName).replace("Job_Type", job[selectedtext]).replace("DestinationFolder", '/' + _data.migrateFolderName).replace("Job_Status", _data.jobStatus).replace("Job_Status_Show", jobStatus[_data.jobStatus]).replace("Date", mappingOptions.getDateConversion(_data.createdTime)); */
                    if(csv === true)
				_html = _appendHtml.replace("job_ID", _data.id).replace("nameofjob", _data.jobName).replace("Job_Name", CFManageCloudAccountsAjaxCall.getMaxChars(_data.jobName, 30)).replace("Job_Type", selectedtext).replace("DestinationFolder", '-').replace("Job_Status", _data.jobStatus).replace("Job_Status_Show", jobStatus[_data.jobStatus]).replace("Date", mappingOptions.getDateConversion(_data.createdTime));
                    else if((data[i].fromCloudName === "GOOGLE_SHARED_DRIVES" && data[i].toCloudName === "SHAREPOINT_ONLINE_BUSINESS") || (data[i].fromCloudName === "DROPBOX_BUSINESS" && data[i].toCloudName === "GOOGLE_SHARED_DRIVES"))
                        _html = _appendHtml.replace("job_ID", _data.id).replace("nameofjob", _data.jobName).replace("Job_Name", CFManageCloudAccountsAjaxCall.getMaxChars(_data.jobName, 30)).replace("Job_Type", selectedtext).replace("DestinationFolder", '-').replace("Job_Status", _data.jobStatus).replace("Job_Status_Show", jobStatus[_data.jobStatus]).replace("Date", mappingOptions.getDateConversion(_data.createdTime));
                    else
                        _html = _appendHtml.replace("job_ID", _data.id).replace("nameofjob", _data.jobName).replace("Job_Name", CFManageCloudAccountsAjaxCall.getMaxChars(_data.jobName, 30)).replace("Job_Type", selectedtext).replace("DestinationFolder", '/' + _data.migrateFolderName).replace("Job_Status", _data.jobStatus).replace("Job_Status_Show", jobStatus[_data.jobStatus]).replace("Date", mappingOptions.getDateConversion(_data.createdTime));
                    $("#appendJob tbody").append(_html);

                }
            }
        }
		setTimeout(function () { 
                    $('#CFShowLoading').hide();
                  
                }, 1000);
    },
    appendSyncMigrationJobs : function(pageNumber,pageSize){
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/get/moveJob?page_nbr=" + pageNumber + "&page_size=" + pageSize ,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                mappingOptions.appendSyncJobs(data);
            }
        });
    },

    appendSyncJobs:function (data) {
        var _displayImg, _cancleImg, iconsArray = [];
        var jobStatus = {
            "STARTED" : "Started",
            "COMPLETED" : "Completed",
            "SUSPENDED" : "Suspended",
            "IN_PROGRESS": "In Progress",
            "PAUSE": "Pause",
            "CANCEL": "Cancel"
        };
        var job = {
            "SYNC" : "One-way Sync",
            "TWO_WAY_SYNC" : "Two-way Sync"
        };

        var _len = data.length;

        for (var i = 0; i < _len; i++) {
            if((data[i].fromCloudId == null || data[i].toCloudId == null) && (data[i].jobStatus == "CANCEL")){
                _cancleImg = '<i class="lnil lnil-cross-circle" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" class="cleBtn"></i>';
                _displayImg = '<img src="../img/Pause.png" style="margin-left: 25%;cursor: not-allowed;opacity:0.2" class="dsblePause">';
            }
            else {
                if (data[i].jobStatus == "CANCEL") {
                    _displayImg = '<img src="../img/Pause.png" style="margin-left: 25%;cursor: not-allowed;opacity:0.2" class="dsblePause">';
                    _cancleImg = '<i class="lnil lnil-cross-circle" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" class="cleBtn"><i>';
                    $(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                }
                else if (data[i].jobStatus == "PAUSE") {
                    _displayImg = '<img src="../img/Resume.png" style="margin-left: 25%;cursor: pointer;" class="syncPause">';
                    _cancleImg = '<i class="lnil lnil-cross-circle cnclBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                    $(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                }
                else if (data[i].jobStatus == "IN_PROGRESS") {
                    _displayImg = '<img src="../img/Pause.png" style="margin-left: 25%;cursor: pointer;" class="syncPause">';
                    _cancleImg = '<i class="lnil lnil-cross-circle cnclBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                    $(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                }
                else if (data[i].jobStatus == "COMPLETED") {
                    _displayImg = '<img src="../img/Pause.png" style="margin-left: 25%;cursor: pointer;" class="syncPause">';
                    _cancleImg = '<i class="lnil lnil-cross-circle cnclBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                    $(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                }
                else if (data[i].jobStatus == "SUSPENDED") {
                    _displayImg = '<img src="../img/Pause.png" style="margin-left: 25%;cursor: pointer;" class="syncPause">';
                    _cancleImg = '<i class="lnil lnil-cross-circle cnclBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;">';
                    $(".lnil-download").css("opacity", "0.2").css("cursor", "not-allowed");
                }
            }
            var obj = {
                display : _displayImg,
                cancel : _cancleImg
            };
            iconsArray.push(obj);
        }
        var _appendHtml ='<tr id="job_ID" class="jobsRow" jobtype="jobType"> <td style="width: 5%"> <div> <i class="fa fa-plus" style="cursor: pointer"></i> </div></td><td style="width: 34%">Job_Name</td><td style="width: 10%">Job_Type</td><td class="Job_Status" style="font-weight: bold;width: 25%;text-align: center;">Job_Status_Show</td><td style="width:10%">Date</td><td style="width: 10%;" JobID="jobID">_displayImg</td><td style="width: 10%;" JobId="jobId">_cancleImg</td></tr><tr class="appendSyncMigrateWorkSpaces" style="display: none"></tr>',//<td> <i class="lnil lnil-download"></i> </td>
            _len = data.length;
        $("#appendSyncJob tbody").html('');
        for(var i = 0; i < _len; i++){
            /*  if(i== 0 && data[0].jobStatus === "COMPLETED") {
 			localStorage.setItem("MigtnDone","multiUser");
             activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'testMigrationCompleted','Yes');
			  }  */  
            var _data = data[i],_html;
            var selectedtext ;
            selectedtext= data[i].jobType;
            if(selectedtext == undefined){
                selectedtext =data[i].jobType;
            }
            if(selectedtext == null){
                selectedtext="ONETIME";
            }
            // $("#jobType").text("selectedText");
            if(_data.jobStatus != "STARTED"){
                if(selectedtext=="SYNC" || selectedtext == "TWO_WAY_SYNC") {
                    _html = _appendHtml.replace("job_ID", _data.id).replace("jobType", _data.jobType).replace("Job_Name", _data.jobName).replace("Job_Type", job[_data.jobType]).replace("Job_Status", _data.jobStatus).replace("Job_Status_Show", jobStatus[_data.jobStatus]).replace("Date", mappingOptions.getDateConversion(_data.createdTime)).replace('_displayImg',iconsArray[i].display).replace("jobID", _data.id).replace('_cancleImg',iconsArray[i].cancel).replace("jobId", _data.id);
                    $("#appendSyncJob tbody").append(_html);
                }
            }
        }
    },
    getWorkspaces : function (jobId,pageNumber,pageSize,jobType) {
        /*
            getWorkspaces : function (jobId,pageNumber,pageSize) {
        */
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/get/list/" + jobId + "?page_nbr=" + pageNumber + "&page_size=" + pageSize ,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                var _displayImg,_cancleImg,iconsArray = [];
                $.ajax({
                    type: "GET",
                    url: apicallurl + "/move/queue/status?jobId=" + jobId,
                    headers: {
                        "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    },
                    success: function (refreshdata) {
                        var _len = refreshdata.length;

                        for (var i = 0; i < _len; i++) {
                            if ((refreshdata[i].status == "NOT_PROCESSED" && refreshdata[i].threadStatus == "RESUME")||(refreshdata[i].status == "NOT_STARTED" && refreshdata[i].threadStatus == "RESUME")) {
                                _displayImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            }
                            else if (refreshdata[i].status == "CANCEL" && refreshdata[i].threadStatus == "CANCEL") {
                                _displayImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                                $(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                            }
                            else if (refreshdata[i].status == "PROCESSED" && refreshdata[i].threadStatus == "PAUSE") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor: pointer" class="Pause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                                $(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                            }
                            else if (refreshdata[i].status == "IN_PROGRESS" && refreshdata[i].threadStatus == "RESUME") {
                                _displayImg = '<img src="../img/Pause.png" style="cursor: pointer" class="Pause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if (refreshdata[i].status == "PAUSE" && refreshdata[i].threadStatus == "PAUSE") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:pointer;" class="Pause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            }
                            else if ((refreshdata[i].status == "PROCESSED" && refreshdata[i].threadStatus == "RESUME") && (data[i].processStatus == "PROCESSED_WITH_SOME_CONFLICTS" || data[i].processStatus == "SUSPENDED"  || data[i].processStatus == "WARNING" || data[i].processStatus == "PROCESSED_WITH_SOME_ERRORS" || data[i].processStatus == "PROCESSED_WITH_SOME_WARNINGS" || data[i].processStatus == "ERROR" || data[i].processStatus == "PROCESSED" || data[i].processStatus == "CANCEL" || data[i].processStatus == "CONFLICT" || data[i].processStatus == "NOT_PROCESSED"|| data[i].processStatus == "NOT_STARTED")){
                                _displayImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if (refreshdata[i].status == "PROCESSED" && refreshdata[i].threadStatus == "RESUME") {
                                _displayImg = '<img src="../img/Pause.png" style="cursor:pointer;" class="Pause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            }
                            else if ((refreshdata[i].status == "PROCESSED" && refreshdata[i].threadStatus == "CANCEL") || (refreshdata[i].status == "IN_PROGRESS" && refreshdata[i].threadStatus == "CANCEL")) {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if (data[i].threadStatus == "PROCESSED_WITH_SOME_CONFLICTS" || data[i].threadStatus == "PROCESSED_WITH_SOME_PAUSE" || data[i].threadStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE" || data[i].threadStatus == "SUSPENDED" || data[i].threadStatus == "WARNING" || data[i].threadStatus == "PROCESSED_WITH_SOME_ERRORS" || data[i].threadStatus == "PROCESSED_WITH_SOME_WARNINGS" || data[i].threadStatus == "ERROR" || data[i].threadStatus == "PROCESSED" || data[i].threadStatus == "CONFLICT" || data[i].threadStatus == "NOT_PROCESSED"|| data[i].threadStatus == "NOT_STARTED") {
                                _displayImg = '<img src="../img/Pause.png" style="opacity: 0.2;cursor: not-allowed;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="opacity: 0.2;cursor: not-allowed;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            }
                            else if (refreshdata[i].status == "SUSPENDED" && refreshdata[i].threadStatus == "SUSPENDED") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if (refreshdata[i].status == "PROCESSED" && refreshdata[i].threadStatus == "SUSPENDED") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if (data[i].threadStatus == "PROCESSED" && refreshdata[i].threadStatus == "SUSPENDED") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                            }
                            else if (data[i].threadStatus == "PROCESSED" && refreshdata[i].threadStatus == "RESUME") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if (refreshdata[i].status == "TIMED_OUT" && refreshdata[i].threadStatus == "RESUME") {
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            //if((refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].status == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE") || (refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].status == "PROCESSED_WITH_SOME_PAUSE")){
                            if((refreshdata[i].userType === "MULTIUSER_INACTIVE" && data[i].processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE") || (refreshdata[i].userType === "MULTIUSER_INACTIVE" && data[i].processStatus == "PROCESSED_WITH_SOME_PAUSE")){
                                _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                            }
                            else if((refreshdata[i].userType === "MULTIUSER_INACTIVE") && (refreshdata[i].userPause == false)){
                                _displayImg = '<img src="../img/Pause.png" style="cursor: pointer" class="Pause">';
                                _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: pointer;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                                if (data[i].processStatus == "PROCESSED_WITH_SOME_CONFLICTS" || data[i].processStatus == "SUSPENDED"  || data[i].processStatus == "WARNING" || data[i].processStatus == "PROCESSED_WITH_SOME_ERRORS" || data[i].processStatus == "PROCESSED_WITH_SOME_WARNINGS" || data[i].processStatus == "ERROR" || data[i].processStatus == "PROCESSED" || data[i].processStatus == "CANCEL" || data[i].processStatus == "CONFLICT" || data[i].processStatus == "NOT_PROCESSED"|| data[i].processStatus == "NOT_STARTED"){
                                    _displayImg = '<img src="../img/Pause.png" style="cursor: not-allowed;opacity:0.2;" class="disablePause">';
                                    _cancleImg = '<i class="lnil lnil-cross-circle cleBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;" ></i>';
                                }
                                else if ((refreshdata[i].status == "PROCESSED" && refreshdata[i].threadStatus == "CANCEL") || (refreshdata[i].status == "IN_PROGRESS" && refreshdata[i].threadStatus == "CANCEL")) {
                                    _displayImg = '<img src="../img/Resume.png" style="cursor:not-allowed;opacity:0.2;" class="disablePause">';
                                    _cancleImg = '<i class="lnil lnil-cross-circle cancelBtn" style="cursor: not-allowed;opacity:0.2;margin-left: 12px;margin-top: -3px;color: #FF4C4C;font-size: 15px;font-weight: 600;"></i>';
                                }
                            }
                            var obj = {
                                display : _displayImg,
                                cancel : _cancleImg
                            };
                            iconsArray.push(obj);
                        }
						var _workspaceLen = data.length, _html;
						if((data[0].fromCloudName == "BOX_BUSINESS" && data[0].toCloudName == "DROPBOX_BUSINESS")||(data[0].fromCloudName == "BOX_BUSINESS" && data[0].toCloudName == "G_SUITE")||(data[0].fromCloudName == "DROPBOX_BUSINESS" && data[0].toCloudName == "BOX_BUSINESS")||(data[0].fromCloudName == "BOX_BUSINESS" && data[0].toCloudName == "GOOGLE_SHARED_DRIVES")){
                        var _appendHtml = '<td colspan="8"><table class="table" style="font-size: small;width:90%;margin-left:5%;margin-top: 2%;background:#f2f3ff;color:#1f2129;"> <thead> <tr style="border-bottom:2px solid #bbb!important;"><th style="width: 25%;">From</th> <th style="width: 25%;">To</th> <th style="width: 20%;">Status</th> <th style="width: 15%;">Date</th> <th style="width: 9%;">Download</th> <th style="width: 12%;">Pause/Resume</th><th style="width: 12%;">Cancel</th>  <th style="width: 03%;"></th> </tr></thead> <tbody clas="appendMigrationWrkSpcs">appendWorkspaces </tbody> </table></td>',
					    _moveIdHtml = '<tr class="moveWorksapceList rmvdCloudClass" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"><td> <div> <div class="migrateImg" style="margin-top: -2%;"><div id="srcCloudImage" alt="pic" class="migrationImage" style="float: left"/></div></div> <div title="srcTitleDisp" style="padding-top: 3%;">srcEmailDisplay</div></div></td><td> <div><div class="migrateImg" style="margin-top: -2%;"> <div id="dstCloudImage" alt="pic" class="migrationImage" style="float: left"/></div></div> <div title="dstTitleDisp" style="padding-top: 3%;">dstEmailDisplay</div></div></td><td class="processStatus pauseResumeVal">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" id="normalDwn" appendStyling></i></div></td><td><div style="margin-left: 33px;margin-top: -2px;" class="playResumeBtn">_displayImg </div></td><td><div>_cancleImg</div></td> <td> <div> <i class="lnil lnil-chevron-down-circle" style="cursor: pointer;color: #0062FF;font-size: 18px;font-weight: 600;"></i> </div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';
						}
						else{
                        var _appendHtml = '<td colspan="8"><table class="table" style="font-size: small;width:90%;margin-left:5%;margin-top: 2%;background:#f2f3ff;color:#1f2129;"> <thead> <tr style="border-bottom:2px solid #bbb!important;"><th style="width: 25%;">From</th> <th style="width: 25%;">To</th> <th style="width: 20%;">Status</th> <th style="width: 15%;">Date</th> <th style="width: 9%;">Download</th> <th style="width: 9%;">Download Collaboration</th><th style="width: 12%;">Pause/Resume</th><th style="width: 12%;">Cancel</th>  <th style="width: 03%;"></th> </tr></thead> <tbody clas="appendMigrationWrkSpcs">appendWorkspaces </tbody> </table></td>',
                        _moveIdHtml = '<tr class="moveWorksapceList rmvdCloudClass" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"><td> <div><div class="migrateImg" style="margin-top: -2%;"> <div id="srcCloudImage" alt="pic" class="migrationImage" style="float: left"/></div></div> <div title="srcTitleDisp" style="padding-top: 3%;">srcEmailDisplay</div></div></td><td> <div><div class="migrateImg" style="margin-top: -2%;"><div id="dstCloudImage" alt="pic" class="migrationImage" style="float: left"/></div></div><div title="dstTitleDisp" style="padding-top: 3%;">dstEmailDisplay</div></div></td><td class="processStatus pauseResumeVal">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" id="normalDwn" appendStyling></i></div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" id="collaborationDwn" appendStyling1></i></div></td><td><div style="margin-left: 33px;margin-top: -2px;" class="playResumeBtn">_displayImg </div></td><td><div>_cancleImg</div></td> <td> <div> <i class="lnil lnil-chevron-down-circle" style="cursor: pointer;color: #0062FF;font-size: 18px;font-weight: 600;"></i> </div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';
                        } 
						var moveStatus = {
                            "PROCESSED": "Processed",
                            "PAUSE": "Pause",
                            "IN_PROGRESS": "In Progress",
                            "NOT_PROCESSED": "In queue",
							"NOT_STARTED": "In queue",
                            "ERROR": "Error",
                            "IN_QUEUE": "In queue",
                            "WARNING": "Warning",
                            "SUSPENDED": "Suspended",
                            "PROCESSED_WITH_SOME_ERRORS": "Processed with some errors",
                            "PROCESSED_WITH_SOME_WARNINGS": "Processed with some warnings",
                            "PROCESSED_WITH_SOME_CONFLICTS": "Processed with some conflicts",
                            "CONFLICT": "Conflict",
                            "CANCEL": "Cancel",
                            "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE":"Processed With Some Conflicts and Pause",
                            "PROCESSED_WITH_SOME_PAUSE":"Processed With Some Pause"

                        };
                        for (var i = 0; i < _workspaceLen; i++) {
                            var _result = data[i];
                            if (_result.fromCloudId == null || _result.toCloudId == null)
                                _moveIdHtml = _moveIdHtml.replace('rmvdCloudClass', 'cloudRmvd');
                            else
                                _moveIdHtml = _moveIdHtml.replace('cloudRmvd', 'rmvdCloudClass');


                            if (_result.multiUserMove) {
                                _result = JSON.parse(JSON.stringify(_result, function (key, value) {
                                    if (value === null) {
                                        return "Not Available";
                                    }
                                    return value;
                                }));
                                if (refreshdata[i].threadStatus == "PAUSE" || refreshdata[i].threadStatus == "CANCEL" || refreshdata[i].threadStatus == "SUSPENDED") {
                                    if((refreshdata[i].userType === "MULTIUSER_INACTIVE" && data[i].processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE") || (refreshdata[i].userType === "MULTIUSER_INACTIVE" && data[i].processStatus == "PROCESSED_WITH_SOME_PAUSE")){
                                        if(_result.processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"){
                                            var _value = "Trial completed with conflicts and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(_result.processStatus == "PROCESSED_WITH_SOME_PAUSE"){
                                            _value= "Trial completed and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].userPause == false && refreshdata[i].threadStatus == "PAUSE"){
                                            colorVal =_result.processStatus;
                                            _value = moveStatus[_result.processStatus];
                                        }
                                        else if(refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].userPause == false && refreshdata[i].threadStatus == "RESUME"){
                                            colorVal =_result.processStatus;
                                            _value = moveStatus[_result.processStatus];
                                        }
                                        else{
                                            _value = moveStatus[refreshdata[i].threadStatus];
                                            var colorVal =refreshdata[i].threadStatus;
                                        }
                                       
                                        _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcTitleDisp', _result.fromMailId).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 25)).replace('dstCloudImage', _result.toCloudName).replace('dstTitleDisp', _result.toMailId).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 25)).replace('processStatus',colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)).replace('appendStyling1', disableCollabDwnldBtn(_result.processStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel);
                                    }
                                    else if((refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].status == "IN_PROGRESS") || (refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].status == "PROCESSED")){
                                        if(_result.processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"){
                                            var _value = "Trial completed with conflicts and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(_result.processStatus == "PROCESSED_WITH_SOME_PAUSE"){
                                            _value= "Trial completed and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].userPause == false && refreshdata[i].threadStatus == "PAUSE"){
                                            colorVal =_result.processStatus;
                                            _value = moveStatus[_result.processStatus];
                                        }
                                        else if(refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].userPause == false && refreshdata[i].threadStatus == "RESUME"){
                                            colorVal =_result.processStatus;
                                            _value = moveStatus[_result.processStatus];
                                        }
                                        else{
                                            _value = moveStatus[refreshdata[i].threadStatus];
                                            var colorVal =refreshdata[i].threadStatus;
                                        }
                                        
                                        _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcTitleDisp', _result.fromMailId).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 25)).replace('dstCloudImage', _result.toCloudName).replace('dstTitleDisp', _result.toMailId).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 25)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)).replace('appendStyling1', disableCollabDwnldBtn(_result.processStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel);
                                    }
                                    else{
                                        if(_result.processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"){
                                            var _value = "Trial completed with conflicts and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(_result.processStatus == "PROCESSED_WITH_SOME_PAUSE"){
                                            _value= "Trial completed and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].userPause == false && refreshdata[i].threadStatus == "PAUSE"){
                                            colorVal =_result.processStatus;
                                            _value = moveStatus[_result.processStatus];
                                        }
                                        else if(refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].userPause == false && refreshdata[i].threadStatus == "RESUME"){
                                            colorVal =_result.processStatus;
                                            _value = moveStatus[_result.processStatus];
                                        }
                                        else{
                                            _value =moveStatus[refreshdata[i].threadStatus];
                                            var colorVal =refreshdata[i].threadStatus;
                                        }
                                        /*    _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('jobType', jobType).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 30)).replace('dstCloudImage', _result.toCloudName).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 30)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(refreshdata[i].threadStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel); */
                                        _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcTitleDisp', _result.fromMailId).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 25)).replace('dstCloudImage', _result.toCloudName).replace('dstTitleDisp', _result.toMailId).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 25)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(refreshdata[i].threadStatus)).replace('appendStyling1', disableCollabDwnldBtn(refreshdata[i].threadStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel);
                                    }
                                }
                                else{
                                    if((refreshdata[i].userType === "MULTIUSER_INACTIVE" && data[i].processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE") || (refreshdata[i].userType === "MULTIUSER_INACTIVE" && data[i].processStatus == "PROCESSED_WITH_SOME_PAUSE")){
                                        if(_result.processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"){
                                            var _value = "Trial completed with conflicts and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(_result.processStatus == "PROCESSED_WITH_SOME_PAUSE"){
                                            _value= "Trial completed and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else{
                                            _value = moveStatus[_result.processStatus];
                                            var colorVal =_result.processStatus;
                                        }
                                        /*  _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('jobType', jobType).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 30)).replace('dstCloudImage', _result.toCloudName).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 30)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(refreshdata[i].userType)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel); */
                                        _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcTitleDisp', _result.fromMailId).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 25)).replace('dstCloudImage', _result.toCloudName).replace('dstTitleDisp', _result.toMailId).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 25)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(refreshdata[i].userType)).replace('appendStyling1', disableCollabDwnldBtn(refreshdata[i].userType)).replace('appendStyling1', disableCollabDwnldBtn(refreshdata[i].userType)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel);
                                    }
                                    else if((refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].status == "IN_PROGRESS") || (refreshdata[i].userType === "MULTIUSER_INACTIVE" && refreshdata[i].status == "PROCESSED")){
                                        if(_result.processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"){
                                            var _value = "Trial completed with conflicts and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(_result.processStatus == "PROCESSED_WITH_SOME_PAUSE"){
                                            _value= "Trial completed and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else{
                                            _value = moveStatus[_result.processStatus];
                                            var colorVal =_result.processStatus;
                                        }
                                        /*    _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('jobType', jobType).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 30)).replace('dstCloudImage', _result.toCloudName).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 30)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel); */
                                        _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcTitleDisp', _result.fromMailId).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 25)).replace('dstCloudImage', _result.toCloudName).replace('dstTitleDisp', _result.toMailId).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 25)).replace('processStatus', colorVal).replace('processStatusDispaly', _value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)).replace('appendStyling1', disableCollabDwnldBtn(_result.processStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel);
                                    }
                                    else{
                                        if(_result.processStatus == "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE"){
                                            var _value = "Trial completed with conflicts and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else if(_result.processStatus == "PROCESSED_WITH_SOME_PAUSE"){
                                            _value= "Trial completed and paused";
                                            var colorVal =_result.processStatus;
                                        }
                                        else{
                                            _value = moveStatus[_result.processStatus];
                                            var colorVal =_result.processStatus;
                                        }
			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var srcRootId = _result.fromRootId;
                        srcRootId = srcRootId .replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var destRootId = _result.toRootId;
                        destRootId = srcRootId .replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');


                                        /*    _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('jobType', jobType).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 30)).replace('dstCloudImage', _result.toCloudName).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 30)).replace('processStatus', colorVal).replace('processStatusDispaly',_value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel); */
                                        _html = _html + _moveIdHtml.replace('workSpaceId', _result.id).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', srcRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', destRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcTitleDisp', _result.fromMailId).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 25)).replace('dstCloudImage', _result.toCloudName).replace('dstTitleDisp', _result.toMailId).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 25)).replace('processStatus', colorVal).replace('processStatusDispaly',_value).replace('dateDisplay', mappingOptions.getDateConversion(_result.createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)).replace('appendStyling1', disableCollabDwnldBtn(_result.processStatus)).replace('_displayImg',iconsArray[i].display).replace('_cancleImg',iconsArray[i].cancel);

                                    }

                                }
                            }
                        }
                        _appendHtml = _appendHtml.replace('appendWorkspaces', _html).replace('undefined', '');
                        $('#appendJob #' + jobId).next('.appendMigrateWorkSpaces').html(_appendHtml).css('display', 'table-row');
                    }
                });
            }
        });
    },
    getSyncWorkspaces : function (jobId,pageNumber,pageSize,jobtype) {
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/get/list/" + jobId + "?page_nbr=" + pageNumber + "&page_size=" + pageSize ,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                $.ajax({
                    type: "GET",
                    url: apicallurl + "/move/queue/status?jobId=" + jobId,
                    headers: {
                        "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    },
                    success: function (refreshdata) {

                        var _appendHtml = '<td colspan="6"><table class="table table-striped" style="font-size: small;width:87%;margin-left:10%;margin-top: 2%;"> <thead> <tr style="border-bottom:2px solid #bbb!important;"> <th style="width: 03%;background: #4980b0;color: #fff;"></th> <th style="width: 25%;background: #4980b0;color: #fff;">From</th> <th style="width: 25%;background: #4980b0;color: #fff;">To</th> <th style="width: 20%;background: #4980b0;color: #fff;">Status</th> <th style="width: 15%;background: #4980b0;color: #fff;">Date</th> <th style="width: 9%;background: #4980b0;color: #fff;">Download</th>   </tr></thead> <tbody clas="appendMigrationWrkSpcs">appendSyncWorkspaces </tbody> </table></td>',
                            //var _appendHtml = '<td colspan="5"><table class="table table-striped" style="font-size: small;width:100%;margin-left:5%;margin-top: 2%;"> <thead> <tr style="border-bottom:2px solid #bbb!important;"> <th style="width: 03%;background: #4980b0;color: #fff;"></th> <th style="width: 25%;background: #4980b0;color: #fff;">From</th> <th style="width: 25%;background: #4980b0;color: #fff;">To</th> <th style="width: 20%;background: #4980b0;color: #fff;">Status</th> <th style="width: 15%;background: #4980b0;color: #fff;">Date</th> <th style="width: 9%;background: #4980b0;color: #fff;">Download</th></tr></thead> <tbody clas="appendMigrationWrkSpcs">appendWorkspaces </tbody> </table></td>',

                            _workspaceLen = data.length, _html,
                            //_moveIdHtml = '<tr class="moveWorksapceList rmvdCloudClass" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"> <td> <div> <i class="fa fa-plus" style="cursor: pointer"></i> </div></td><td> <div> <img src="../img/PNG/srcCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>srcEmailDisplay</div></div></td><td> <div> <img src="../img/PNG/dstCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>dstEmailDisplay</div></div></td><td class="processStatus">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" style="color: #0062FF;font-size:13px;font-weight:bold;cursor:pointer;" appendStyling></i></div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';

                            _moveIdHtml = '<tr class="moveSyncWorksapceList rmvdCloudClass" wrkSpaceId="workSpaceId" srcemail="srcEmailId" srccldname="srcCloudName" srccldid="srcCloudId" srcrt="srcRootId" dstnemail="dstnEmailId" dstncldname="dstnCloudName" dstncldid="dstnCloudId" dstnrt="dstnCloudRoot" prcsdCount="processedCount" errCount="errorCount" totCount="totalCount"><td> <div> <img src="../img/PNG/srcCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>srcEmailDisplay</div></div></td><td> <div> <img src="../img/PNG/dstCloudImage.png" alt="pic" class="migrationImage" style="float: left"/> <div>dstEmailDisplay</div></div></td><td class="processStatus pauseResumeVal">processStatusDispaly</td><td> <div>dateDisplay</div></td><td> <div style="margin-left: 24px;"><i class="lnil lnil-download" style="color: #0062FF;font-size:13px;font-weight:bold;" appendStyling></i></div></td> <td> <div> <i class="lnil lnil-chevron-down-circle" style="cursor: pointer;color: #0062FF;font-size: 18px;font-weight: 600;" jobType = "jobtype"></i> </div></td></tr><tr class="moveReportDetails" style="display:none"></tr>';
                        var moveStatus = {
                            "PROCESSED": "Processed",
                            "PAUSE": "Pause",
                            "IN_PROGRESS": "In Progress",
                            "NOT_PROCESSED": "In queue",
							"NOT_STARTED": "In queue",
                            "ERROR": "Error",
                            "IN_QUEUE": "In queue",
                            "WARNING": "Warning",
                            "SUSPENDED": "Suspended",
                            "PROCESSED_WITH_SOME_ERRORS": "Processed with some errors",
                            "PROCESSED_WITH_SOME_WARNINGS": "Processed with some warnings",
                            "PROCESSED_WITH_SOME_CONFLICTS": "Processed with some conflicts",
                            "CONFLICT": "Conflict",
                            "CANCEL": "Cancel"
                        };
                        var _html ='';
                        for (var i = 0; i < _workspaceLen; i++) {
                            var _result = data[i];
                            if (_result.fromCloudId == null || _result.toCloudId == null)
                                _moveIdHtml = _moveIdHtml.replace('rmvdCloudClass', 'cloudRmvd');
                            else
                                _moveIdHtml = _moveIdHtml.replace('cloudRmvd', 'rmvdCloudClass');


                            if (_result.multiUserMove) {
                                _result = JSON.parse(JSON.stringify(_result, function (key, value) {
                                    if (value === null) {
                                        return "Not Available";
                                    }
                                    return value;
                                }));
                                localStorage.setItem("twoWaySrcIcon",_result.fromCloudName);
                                localStorage.setItem("twoWayDstnIcon",_result.toCloudName);
                                _html = _moveIdHtml.replace('workSpaceId', _result.id).replace('jobtype', jobtype).replace('srcEmailId', _result.fromMailId).replace('srcCloudName', _result.fromCloudName).replace('srcCloudId', _result.fromCloudId.id).replace('srcRootId', _result.fromRootId).replace('dstnEmailId', _result.toMailId).replace('dstnCloudName', _result.toCloudName).replace('dstnCloudId', _result.toCloudId.id).replace('dstnCloudRoot', _result.toRootId).replace('srcCloudImage', _result.fromCloudName).replace('srcEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.fromMailId, 30)).replace('dstCloudImage', _result.toCloudName).replace('dstEmailDisplay', CFManageCloudAccountsAjaxCall.getMaxChars(_result.toMailId, 30)).replace('processStatus', _result.processStatus).replace('processStatusDispaly', moveStatus[_result.processStatus]).replace('dateDisplay', mappingOptions.getDateConversion(refreshdata[i].createdTime)).replace('processedCount', _result.processedCount).replace('errorCount', _result.errorCount).replace('totalCount', _result.totalFilesAndFolders).replace('appendStyling', disableDwnldBtn(_result.processStatus)) + _html;
                            }
                        }
                        _appendHtml = _appendHtml.replace('appendSyncWorkspaces', _html);
                        $('#appendSyncJob #' + jobId).next('.appendSyncMigrateWorkSpaces').html(_appendHtml).css('display', 'table-row');

                    }
                });
            }
        });
    },
    deleteJob:function () {
        var _jobId = localStorage["jobId"];
        if(_jobId != undefined){
            $.ajax({
                type: "DELETE",
                url: apicallurl + "/move/newmultiuser/delete/moveJob/" + _jobId ,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (data) {

                }
            });
        }
    },
    createJob:function () {
        /*  var srcCldName = localStorage.getItem('multiUsrSrcCldName');
          var dstnCldName = localStorage.getItem('multiUsrDstnCldName');
          if(srcCldName === 'EGNYTE_ADMIN' && dstnCldName === "ONEDRIVE_BUSINESS_ADMIN") {
              var _dataValue = JSON.parse(localStorage.getItem('selMappings'));
              if (_dataValue.length === 0) {
                  setTimeout(function () {
                      $("#CFShowLoading").modal("hide");
                  }, 500);
                  $(document).find("#chkInput").prop("checked", false);
                  $('input[name="inputMapdUrs"]').removeAttr('checked');
                  $('input[name="csvMapngCheckBox"]').removeAttr('checked');
                  $("#forNextMove").addClass('disabled');
              }
          }
          else { */
        /*  CsvOperation('', 'rmv1');
          if ($('#mapdUsers input[name=csvMapngCheckBox]:checked').length) {
              $('#mapdUsers input[name=csvMapngCheckBox]:checked').each(function () {
                  var _d = $(this).parent().parent();
                  var obj = {
                      "fromCloudId": {
                          "id": $(_d).attr('srccldid'),
                      },
                      "toCloudId": {
                          "id": $(_d).attr('dstncldid'),
                      },
                      "sourceFolderPath": decodeURI($(_d).attr('srcFolderPath')),
                      "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                      "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                      "isCSV": "true"
                  };
                  var EmailObj = {
                      "fromMailId": $(_d).attr('srcemail'),
                      "fileName": $(_d).attr('srcemail'),
                      "toMailId": $(_d).attr('dstnemail'),
                      "fromCloudName": $(_d).attr('srccldname'),
                      "toCloudName": $(_d).attr('dstncldname'),
                  };
                  CsvOperation(obj, 'set');
                  CsvOperation(EmailObj, 'setCsv');
              });
          } else {
              $('#mapdUsers input[name=csvMapngCheckBox]').each(function () {
                  var _d = $(this).parent().parent();
                  $(this).prop('checked', false);
                  var obj = {
                      "fromCloudId": {
                          "id": $(_d).attr('srccldid'),
                      },
                      "toCloudId": {
                          "id": $(_d).attr('dstncldid'),
                      },
                      "sourceFolderPath": decodeURI($(_d).attr('srcFolderPath')),
                      "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                      "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                      "isCSV": "true"
                  };
                  var EmailObj = {
                      "fromMailId": $(_d).attr('srcemail'),
                      "fileName": $(_d).attr('srcemail'),
                      "toMailId": $(_d).attr('dstnemail'),
                      "fromCloudName": $(_d).attr('srccldname'),
                      "toCloudName": $(_d).attr('dstncldname'),
                  };
                  CsvOperation(obj, 'delete');
                  CsvOperation(EmailObj, 'delete');
              });
          }
          mappingOptions.localStorageOperation('', 'rmv1');
          if ($('#mapdUsers input[name=inputMapdUrs]:checked').length) {
              if (!$(this).parents("table").find('tbody tr').hasClass("automapRow")) {
                  $('#mapdUsers input[name=inputMapdUrs]:checked').each(function () {
                      var _obj = {
                          "fromCloudId": {
                              "id": $(this).closest('tr').attr('srccldid'),
                          },
                          "toCloudId": {
                              "id": $(this).closest('tr').attr('dstncldid')
                          }
                      };
                      var _objEmail = {
                          "fromMailId": $(this).closest('tr').attr('srccldid'),
                          "fileName": $(this).closest('tr').attr('srcemail'),
                          "toMailId": $(this).closest('tr').attr('dstncldid'),
                          "fromCloudName": $(this).closest('tr').attr('srccldname'),
                          "toCloudName": $(this).closest('tr').attr('dstncldname'),

                      };
                      mappingOptions.localStorageOperation(_obj, 'set');
                      mappingOptions.localStorageOperation(_objEmail, 'set1');
                  });
              } else {
                  $('#mapdUsers input[name=inputMapdUrs]:checked').each(function () {
                      var _d = $(this).parent().parent();
                      var _obj = {
                          "fromCloudId": {
                              "id": $(_d).attr('srccldid'),
                          },
                          "toCloudId": {
                              "id": $(_d).attr('dstncldid'),
                          }
                      };
                      var _objEmail = {
                          "fromMailId": $(_d).attr('srcemail'),
                          "fileName": $(_d).attr('srcemail'),
                          "toMailId": $(_d).attr('dstnemail'),
                          "fromCloudName": $(_d).attr('srccldname'),
                          "toCloudName": $(_d).attr('dstncldname'),

                      };
                      mappingOptions.localStorageOperation(_obj, 'set');
                      mappingOptions.localStorageOperation(_objEmail, 'set1');
                  });
              }
          } else {
              $('#mapdUsers input[name=inputMapdUrs]').each(function () {
                  var _d = $(this).parent().parent();
                  $(this).prop('checked', false);
                  var _obj = {
                      "fromCloudId": {
                          "id": $(_d).attr('srccldid'),
                      },
                      "toCloudId": {
                          "id": $(_d).attr('dstncldid'),
                      }
                  };
                  var _objEmail = {
                      "fromMailId": $(_d).attr('srcemail'),
                      "fileName": $(_d).attr('srcemail'),
                      "toMailId": $(_d).attr('dstnemail'),
                      "fromCloudName": $(_d).attr('srccldname'),
                      "toCloudName": $(_d).attr('dstncldname'),

                  };
                  mappingOptions.localStorageOperation(_obj, 'delete');
                  mappingOptions.localStorageOperation(_objEmail, 'delete1');
              });
          } */
           var srcName = localStorage.getItem('multiUsrSrcCldName');
         var dstnName = localStorage.getItem('multiUsrDstnCldName');
        /*  if (srcName === 'DROPBOX_BUSINESS' && dstnName === 'ONEDRIVE_BUSINESS_ADMIN' || srcName === 'ONEDRIVE_BUSINESS_ADMIN' && dstnName === 'DROPBOX_BUSINESS') {
             var _dataValue = JSON.parse(localStorage.getItem('folderMappings'));

         } else {*/
        if (localStorage.getItem('FolderChecked')) {
	  if(JSON.parse(localStorage.getItem('FolderChecked')).length !==0) {
            var _dataValue = JSON.parse(localStorage.getItem('FolderChecked'));
        }
	}
        if (_dataValue == null || _dataValue === []) {
            _dataValue = [];
            localStorage.removeItem("csvName");
        }
        if(localStorage.getItem('folderMappings')){
            if(JSON.parse(localStorage.getItem('folderMappings')).length !==0) {
                var fldrUsers = JSON.parse(localStorage.getItem('folderMappings'));
                for (var j = 0; j < fldrUsers.length; j++) {
                    _dataValue.push(fldrUsers[j]);
                }
            }
        }
        if (localStorage.getItem('selectedMappings')) {
        if (JSON.parse(localStorage.getItem('selectedMappings')).length !== 0) {
            var inpUsers = JSON.parse(localStorage.getItem('selectedMappings'));
            for (var i = 0; i < inpUsers.length; i++) {
                _dataValue.push(inpUsers[i]);
            }
        }
        }
        temp = [ ];
        paths=[];
       // path ;
        rootTFolder = false;
        rootFolder = false;
        normalCSVUser = false;
        if ($('#mapdUsers input[name=csvMapngCheckBox]:checked').length) {
            $('#mapdUsers input[name=csvMapngCheckBox]:checked').each(function () {

                var _d = $(this).parent().parent();
                var teamFolderVal = $(_d).attr('teamfolder');
                var path = $(_d).attr('srcfolderpath');
                var mailId = $(_d).attr('srcemail');
                   if((teamFolderVal == 'true') && (path !== '/')){
                       if (mailId === localStorage.getItem("multiUsrSrcEmail")){
                           rootTFolder = true;
                       }
                   }else if((teamFolderVal == 'true') && (path === '/')){
                       rootFolder = true;
                   }else{
                       normalCSVUser = true;
                   }

               temp.push(teamFolderVal);
            });
        }
        






        $.ajax({
            type: "POST",
            url: apicallurl + "/move/newmultiuser/create/job",
            //data:JSON.stringify(_job),
            data: JSON.stringify(_dataValue),
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
			$("#migOptions").find('input').removeAttr('disabled');
			$("#migOptions").find('input').prop('checked', false);
			$('#migNote').css('display', 'none');
                $('#jobType_dropDown').val('One Time');
                $('#jobType_dropDown').find('#onewaySync').css('display','none');
                $('#selectFrequency').css('display', 'none');
                //$(document).find(".jobName").text(data.jobName);
                //$(document).find(".jobName").attr("job-id",data.id);
                $(document).find(".jobCount").text(data.listOfMoveWorkspaceId.length);
                //$(document).find(".jobPath").text('/');
                $('.ClickedEditPath .pathName').val('/');
                if(localStorage.getItem("csvName")){
                    $(document).find(".destinationPath").css("display","none");
                }
                else{
                    $(document).find(".destinationPath").css("display","");
                }
                if((data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "DROPBOX_BUSINESS")||(data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN" && data.toCloudName === "DROPBOX_BUSINESS")|| (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "BOX_BUSINESS")|| (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN" && data.toCloudName === "BOX_BUSINESS")|| (data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "G_SUITE" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_HYBRID")|| (data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "ONEDRIVE_BUSINESS_ADMIN_HYBRID")||(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "G_SUITE")|| (data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS")|| (data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "ONEDRIVE_BUSINESS_ADMIN")|| (data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "SHAREPOINT_ONLINE_HYBRID") || (data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "G_SUITE" && data.toCloudName === "BOX_BUSINESS")||(data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "AMAZON")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")){
                    $(document).find(".destinationPath").css("display","none");  
                }
                else{
                    $(document).find(".destinationPath").css("display","");
                }
				if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "BOX_BUSINESS"){
					$(document).find("#addNotification").css("display","none");
				}
				else{
					$(document).find("#addNotification").css("display","none");	
				}
			/*	if(data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS"){
				$(document).find(".sharesExt").css("display","");
				$(document).find(".metaData").css("display",""); 
				}
				
				else{
				 $(document).find(".sharesExt").css("display","none"); 
				 $(document).find(".metaData").css("display","none");
				}*/
                if((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN" && data.toCloudName === "DROPBOX_BUSINESS") || (data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_HYBRID")|| (data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "ONEDRIVE_BUSINESS_ADMIN_HYBRID")|| (data.fromCloudName === "G_SUITE" && data.toCloudName === "BOX_BUSINESS")|| (data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "ONEDRIVE_BUSINESS_ADMIN")|| (data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "SHAREPOINT_ONLINE_HYBRID")|| (data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS")|| (data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "AMAZON")){//|| (data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS") || (data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "GOOGLE_SHARED_DRIVES")
                    $('#jobType_dropDown').find('#cusDelta').css('display','none');
                    $("#custDelta").css('display','none');
                }
		/*else if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"){
			$('#jobType_dropDown').find('#cusDelta').css('display','');
                        $("#custDelta").css('display','');
		}*/
                else{
                    var _isCustomUser =  CFManageCloudAccountsAjaxCall.isCustomUser();
                    if(_isCustomUser === false){
                        $('#jobType_dropDown').find('#cusDelta').css('display','none');
                        $("#cusDelta").css('display','none');
                    }
                    else{

                        $('#jobType_dropDown').find('#cusDelta').css('display','');
                        $("#custDelta").css('display','');
                    }
                }
                //$(document).find(".jobName").val(data.jobName);
                $('.ClickedEditJob .jobName').val(data.jobName);
                localStorage.setItem('jobName',data.jobName);
                $("#jobEmptyPopup").css("display","none");
                $('.Editing_Jobname').attr("disabled","disabled");
                $("#checkTimediv").css("display","none");
                $(".Job_NAme").css("display","");
                //var _selectedTrValue =  $("#mapdUsers tbody tr input[name=inputMapdUrs]").parents('tr');
                $(document).find(".jobFrom").html('<div style="display: flex"> <img src="../img/drive/circle/' + data.fromCloudName +'.png" alt="'+ data.fromCloudName+'" class="mgrtnOptionsCloudImg"> <div>' + CLName[data.fromCloudName] +'</div></div>');
                $(document).find(".jobTo").html('<div style="display: flex"> <img src="../img/drive/circle/' + data.toCloudName +'.png" alt="'+ data.toCloudName+'" class="mgrtnOptionsCloudImg"> <div>' + CLName[data.toCloudName] +'</div></div>');
                $("#mappingClouds").css("display","none");
                $("#mappingUsers").css("display","none");
              /*  if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"){
                    if((JSON.parse(localStorage.getItem("CFUser")).version === undefined)&& JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined) {
                        $('#mappingOptionsNew #jobNewOptions').css("display", "");
                    }
                    else if((JSON.parse(localStorage.getItem("CFUser")).version !== undefined)|| JSON.parse(localStorage.getItem("CFUser")).fileFolderLink !== undefined){
                        if(JSON.parse(localStorage.getItem("CFUser")).version === true || JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true )
                            $('#mappingOptionsNew #jobNewOptions').css("display","none");
                        else
                            $('#mappingOptionsNew #jobNewOptions').css("display","");
                    }
                    else if(JSON.parse(localStorage.getItem("CFUser")).version === undefined){
                        if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true )
                            $('#mappingOptionsNew #jobNewOptions').css("display","none");
                        else
                            $('#mappingOptionsNew #jobNewOptions').css("display","");
                    }
                    else if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined){
                        if(JSON.parse(localStorage.getItem("CFUser")).version === true )
                            $('#mappingOptionsNew #jobNewOptions').css("display","none");
                        else
                            $('#mappingOptionsNew #jobNewOptions').css("display","");
                    }
				   
                    $('#mappingOptionsNew').css("display","");
                    $('.optionsDiv1 .Editing_Jobname').val(data.jobName);
					$('#mappingOptionsNew #jobNewOptions').css("display","none");
                }
                else{*/
                    $('#mappingOptions').css("display","");
                

                if(data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"){
                    $('#jobType_dropDown').find('#cusDelta').css('display','none');
                    $('#jobType_dropDown').find('#onewaySync').css('display','');
                }
                else{
                    $('#jobType_dropDown').find('#onewaySync').css('display','none');
                    $('#selectFrequency').css('display', 'none');
                }

                /*     if(data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"){
                         $('#jobType_dropDown').find('#delta').css('display','none');
                         $('#jobType_dropDown').find('#twowaySync').css('display','none');
                     }
                     else{
                         $('#jobType_dropDown').find('#delta').css('display','');
                         $('#jobType_dropDown').find('#onewaySync').css('display','');
                         $(".destinationPath").css("display","");
                     }
                     if(data.fromCloudName === "SHAREPOINT_ONLINE_BUSINESS" && data.toCloudName === "SYNCPLICITY"){
                         if($('#jobType_dropDown :selected').text()== "Two-way sync"){
                             $(".spoToSyncCity").css("display","none");
                         }
                         else{
                             $(".spoToSyncCity").css("display","");
                         }
                         localStorage.setItem("fromCloudId",data.fromCloudId);
                         localStorage.setItem("toCloudId",data.toCloudId);
                     }
                     else{
                         $(".spoToSyncCity").css("display","none");
                     }
                     localStorage.setItem("fromCloudName",data.fromCloudName);
                     localStorage.setItem("toCloudName",data.toCloudName); */
				if((data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "DROPBOX_BUSINESS")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "GOOGLE_SHARED_DRIVES")||(data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "G_SUITE")||(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")){
                         $("#replaceChr").css("display","");
						 $("#chrNo").prop("checked","true")
                             $("#addNotification").css("display","none");
							 $("#migOptions").css("display","");
							 $("#pickInsideDiv").css("display","none");
							 if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"){
					$("#vrsnHisId").css("display","none");
					$("#pickInsideDiv").css("display","");
					}
					if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"){
						$("#replaceChr").css("display","none");
					$("#addNotification").css("display","");
				$("#pickInsideDiv").css("display","none");  
				$("#sharedLinkDiv").css("display","none");
				$("#externalDiv").css("display","");
				$("#vrsnHisId").css("display","none");
				$("#metaDataDiv").css("display","");
				$("#subFldrDiv").css("display","none");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display","none");
				$("#pickInsideDiv").css("display","none");
					}
					if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"){
						$("#replaceChr").css("display","none");
					$("#addNotification").css("display","");
				$("#pickInsideDiv").css("display","none");  
				$("#sharedLinkDiv").css("display","none");
				$("#externalDiv").css("display","");
				$("#vrsnHisId").css("display","none");
				$("#metaDataDiv").css("display","");
				$("#subFldrDiv").css("display","none");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display","none");
				$("#pickInsideDiv").css("display","none");
					}
					if((data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "GOOGLE_SHARED_DRIVES")||(data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "G_SUITE")){
					$("#replaceChr").css("display","none");
					$("#addNotification").css("display","");
				$("#pickInsideDiv").css("display","none");  
				$("#sharedLinkDiv").css("display","none");
				$("#externalDiv").css("display","none");
				$("#vrsnHisId").css("display","");
				$("#metaDataDiv").css("display","");
				$("#subFldrDiv").css("display","none");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display","none");
				$("#pickInsideDiv").css("display","none"); 
					}
					if(data.fromCloudName == "GOOGLE_SHARED_DRIVES" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS"){
					$("#replaceChr").css("display","none");
					$("#addNotification").css("display","");
					$("#pickInsideDiv").css("display","none");  
					$("#sharedLinkDiv").css("display","none");
				$("#externalDiv").css("display","none");
				$("#vrsnHisId").css("display","none");
				$("#metaDataDiv").css("display","");
				$("#subFldrDiv").css("display","none");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display","none");
				$("#pickInsideDiv").css("display","none"); 
					}
					
					if(data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "DROPBOX_BUSINESS"){
					$("#replaceChr").css("display","none");
					$("#addNotification").css("display","");
					$("#pickInsideDiv").css("display","none");  
					$("#sharedLinkDiv").css("display","");
				$("#externalDiv").css("display","");
				$("#vrsnHisId").css("display","");
				$("#metaDataDiv").css("display","");
				$("#subFldrDiv").css("display","");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display",""); 
					}
					/*if((data.fromCloudName == "EGNYTE_ADMIN" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName == "EGNYTE_ADMIN" && data.toCloudName == "ONEDRIVE_BUSINESS_ADMIN")){
					$("#replaceChr").css("display","none");
					$("#addNotification").css("display","");
				$("#pickInsideDiv").css("display","none");  
				$("#sharedLinkDiv").css("display","");
				$("#externalDiv").css("display","");
				$("#vrsnHisId").css("display","");
				$("#metaDataDiv").css("display","");
				$("#subFldrDiv").css("display","none");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display","none");
				$("#pickInsideDiv").css("display","none"); 
					}*/
					 if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES"){
						 $("#vrsnHisId").css("display","");
						 $("#metaDataDiv").css("display","");
						 $("#innFilePer").css("display","none");
					}
					 if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE"){
						 $("#innFilePer").css("display","none");
					}
					
		
					$("#teamfolderrow").css("display","none");
				}
				else if(data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "G_SUITE"){
				$("#migOptions").css("display","");
				$("#replaceChr").css("display","none");
				$("#pickInsideDiv").css("display","none");
				$("#vrsnHisId").css("display","none");
				$("#metaDataDiv").css("display","none");
				$("#subFldrDiv").css("display","none");
				$("#innFilePer").css("display","none");
				$("#filecmntDiv").css("display","none");
				$("#pickInsideDiv").css("display","none"); 
				$("#teamfolderrow").css("display","");
				$(document).find(".metaData").css("display","none");
				if (srcName === 'DROPBOX_BUSINESS' && dstnName === 'G_SUITE') {
            var _adminMailId = localStorage.getItem("multiUsrSrcEmail");
            var _adminPresent = false;
            var  _normalUser   = false;
            localStorage.removeItem("_admin");
            localStorage.removeItem("normalUser");
            if (localStorage.getItem("CsvEmailChecked") && localStorage.getItem("selectedEmail")) {
                var _adminCheck1 = JSON.parse(localStorage.getItem("CsvEmailChecked"));
                var _adminCheck2 = JSON.parse(localStorage.getItem("selectedEmail"));
                var _adminCheck = _adminCheck1.concat(_adminCheck2);
            } else if (localStorage.getItem("CsvEmailChecked")) {
                var _adminCheck = JSON.parse(localStorage.getItem("CsvEmailChecked"));
            } else {
                var _adminCheck = JSON.parse(localStorage.getItem("selectedEmail"));
            }

            for (var i = 0; i < _adminCheck.length; i++) {
                if (_adminMailId === _adminCheck[i].fromMailId) {
                    _adminPresent = true;
                } else {
                    _normalUser = true;
                }
            }
            if(_adminPresent == true  && _normalUser == true) {
                localStorage.setItem("_admin", "adminPresent");
                localStorage.setItem("normalUser", "NormalUserPresent");
                $("#teamfolderrow").css("display", "");
            } else if (_adminPresent == true ){
                localStorage.setItem("_admin", "adminPresent");
                $("#teamfolderrow").css("display", "");
            } else{
                localStorage.setItem("_admin", "adminAbsent");
			   $("#teamfolderrow").css("display", "none");
            }
			
			if(_adminPresent == true && localStorage.Csv == "true" && rootTFolder == true){
				$("#teamfolderrow").css("display", "none");
			}
        }
				}
                         else{
						 $("#addNotification").css("display","");
							 $("#migOptions").css("display","none");
                             $("#replaceChr").css("display","none");
                         }
                $('#mappedMigration').css("display","none");
                $('#mappedSyncMigration').css("display","none");
                $("#forNextMove").removeClass('disabled');
                $("#forPreviousMove").removeClass('disabled');
                localStorage.setItem("jobId",data.id);
                setTimeout(function () {
                    $("#CFShowLoading").modal("hide");
                },2000);
                fldrStorage('','rmv');
                fldrStorage('','rmv1');
                mappingOptions.appendOptions(data.fromCloudName,data.toCloudName);
                var _step = parseInt($("#forNextMove").attr("data-step"));
                if(_step == 2) {
                    _step = _step + 1;
                    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
                    $("#forNextMove").attr("data-step", _step);
                    $("#forPreviousMove").attr("data-prev", _step);
                    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
                }
                else if(_step == 3){
                    if (localStorage.getItem('NoAdmin') ) {
                        $("#Teamfolders_Yes").prop("checked", false);
                        $("#Teamfolders_No").prop("checked", true);
                        $("#teamYescont").css("display", "");
                        $("#teamNocont").css("display", "none");
                    } else {
                        $("#Teamfolders_Yes").prop("checked", true);
                        $("#Teamfolders_No").prop("checked", false);
                        $("#teamYescont").css("display","");
                        $("#teamNocont").css("display","none");
                    }

                    $("#teamMigrationWidget ul li[data-val=" + (_step + 1) + "]").removeClass("active");
                    $("#forNextMove").attr("data-step", _step);
                    $("#forPreviousMove").attr("data-prev", _step);
                    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
                }
            }
        });
    },
    migrationOptionsChecked:function(){
        var _specialCharacter = "_",
            _sharedContent = false,
            _fusionTables = false,
            _drawings = false;
        if( localStorage.getItem('multiUsrSrcCldName') == "DROPBOX_BUSINESS" && localStorage.getItem('multiUsrDstnCldName') == "ONEDRIVE_BUSINESS_ADMIN") {
            _specialCharacter = '-';
        }
        else{
            // if($(document).find("#rplcChar:checked").length)
            _specialCharacter =  $(document).find(".splChar").find("[name='splCharacter']:checked").val();
        }
        if($(document).find("#chkShrdCntnt:checked").length)
            _sharedContent =  true;
        if($(document).find("#fsnTbls:checked").length || $("#tmFldrs:checked").length)
            _fusionTables =  true;
        if($(document).find("#gsteDrawings:checked").length)
            _drawings =  true;
        /*    if(localStorage.getItem('fromCloudName') == "SHAREPOINT_ONLINE_BUSINESS" && localStorage.getItem('toCloudName') == "SYNCPLICITY"){
                if($('#jobType_dropDown :selected').text()== "Two-way sync"){
                    localStorage.removeItem('fusionTables');
                }
                if(localStorage.getItem('fusionTables')){
                    _fusionTables = localStorage.getItem('fusionTables');
                }
            } */
        return "&pageNo=1&pageSize=10&specialCharacter=" + encodeURIComponent(_specialCharacter) + "&sharedContent=" + _sharedContent+"&fusionTables=" + _fusionTables + "&drawings=" + _drawings;
    },
    updateJob:function () {
        //emptying jobname
        var _srcOpt = localStorage.getItem('multiUsrSrcCldName'),dstnOpt = localStorage.getItem('multiUsrDstnCldName');
        var _table = $("#preview table");
        $(_table).find(".jobName").text('');
        $(_table).find(".count").html('');
        $(_table).find(".others").text('');
        $(_table).find(".srcImg").html('');
        $(_table).find(".dstImg").html('');
        $(_table).find(".path").text('');

        var selectedText = $("#jobType_dropDown").find("option:selected").val();
            var _jobName =  $(".ClickedEditJob .jobName").val();
        var _jobid  =  localStorage.getItem('jobId'),
            _path = $(".ClickedEditPath .pathName").val();
        _path = _path.indexOf('/') == 0 ? _path.substring(1) : _path;

        if(_jobName.length < 4)
        {
            alertError("For job name minimum 4  characters are required.");
            $("#forNextMove").removeClass('disabled');
            setTimeout(function () {
                $("#CFShowLoading").modal("hide");
            },2000);
            return false;
        }
        var _val = [];
        var fileValue = [];
		
		$(".fileTypeExc .mpParent span").each(function () {
            fileValue.push($(this).text().toLowerCase().trim());
            });
            var _fileTypeNot = $("#my_inputfile").val();
			if(_fileTypeNot === undefined){
                _fileTypeNot ="";
            }
               
            if(_fileTypeNot.length){
            if (!mappingOptions.checkfileType(_fileTypeNot))
                return false;
            else
                fileValue.push(_fileTypeNot); 
        }


     /*   if((_srcOpt === "ONEDRIVE_BUSINESS_ADMIN" && dstnOpt === "DROPBOX_BUSINESS") ||(dstnOpt === "ONEDRIVE_BUSINESS_ADMIN" &&  _srcOpt === "DROPBOX_BUSINESS")) {

            $("#additionalEmails ul li").each(function () {
                _val.push($(this).text().slice(0, -1).trim());
            });
            var _emailNot = $("#additionalEmails").val();
            if(_emailNot.length){
                if (!mappingOptions.checkEmailNew(_emailNot))
                    return false;
                else
                    _val.push(_emailNot);
            }
        } else {*/
            $(".notifiedMails .emailParent span").each(function () {
                _val.push($(this).text());
            });
            var _emailNot = $("#additionalEmailsold").val();
            if(_emailNot === undefined){
                _emailNot ="";
            }
            if(_emailNot.length){
                if (!mappingOptions.checkEmail(_emailNot))
                    return false;
                else
                    _val.push(_emailNot);
            }
        //}
        $(_table).find("tbody").find(".dstnPath").css("display", "none");
        var _DeltaVal = 'false',
            _fileVerVal = 'false',
            _ZipVal = 'false',

            _teamFolderPerm = false;
        var _ZipcheckedVal = $("input[name='formats']:checked").val();
		var _externalUsers = $("input[name='extShares']:checked").val();
		var _externalUsers1 = $("input[name='extShares1']:checked").val();
		var _metadata = $("input[name='metadataInp']:checked").val();
		var _metadata1 = $("input[name='metadata1']:checked").val();
        var _teamfolderVal = $("input[name='Teamfolders']:checked").val();
        if (_teamfolderVal === "Yes"){
            _teamFolderPerm = true;
        }
		if((_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")||(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "DROPBOX_BUSINESS")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "G_SUITE")||(_srcOpt === "SHAREFILE_BUSINESS" && dstnOpt === "G_SUITE")||(_srcOpt === "SHAREFILE_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES")){
		var extMig,shrLinksMig,vrsnHisMig,metaDataMig,subFlderMig,innFileMig,inlineFileMig,pickInsideFldr;
		if($('#extShrsMig:checked').length >0){
		extMig = $('#extShrsMig:checked').val();
		}
		else{
		extMig = "false";
		}
		if($('#sharedMig:checked').length >0){
		shrLinksMig = $('#sharedMig:checked').val();
		}
		else{
		shrLinksMig = "false";
		}
		if($('#vrsnHisMig:checked').length >0){
		vrsnHisMig = $('#vrsnHisMig:checked').val();
		}
		else{
		vrsnHisMig = "false";
		}
		if($('#metaDataMig:checked').length >0){
		metaDataMig = $('#metaDataMig:checked').val();
		}
		else{
		metaDataMig = "false";
		}
		if($('#subFldrMig:checked').length >0){
		subFlderMig = $('#subFldrMig:checked').val();
		}
		else{
		subFlderMig = "false";
		}
		if($('#innFileMig:checked').length >0){
		innFileMig = $('#innFileMig:checked').val();
		}
		else{
		innFileMig = "false";
		}
		if($('#fileCmntMig:checked').length >0){
		inlineFileMig = $('#fileCmntMig:checked').val();
		}
		else{
		inlineFileMig = "false";
		}
		if($('#pickInn:checked').length >0){
		pickInsideFldr = $('#pickInn:checked').val();
		}
		else{
		pickInsideFldr = "false";
		}		
		}
		if((_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "G_SUITE")){ 
		var extMig,shrLinksMig,teamfolders;
		if($('#extShrsMig:checked').length >0){
		extMig = $('#extShrsMig:checked').val();
		}
		else{
		extMig = "false";
		}
		
		if($('#sharedMig:checked').length >0){
		shrLinksMig = $('#sharedMig:checked').val();
		}
		else{
		shrLinksMig = "false";
		}
		
		if($('#Teamfolders:checked').length >0){ 
		teamfolders = $('#Teamfolders:checked').val();
		}
		else{
		teamfolders = "false";
		}		
		}
        var  _fileSize = $("#SizeVal").val();
        if(_fileSize.length == 0){
            _fileSize = "";

        } else {
            _fileSize = $("#SizeVal").val() + ":" + $(".select_jobStart").val();
        }
        if(_ZipcheckedVal === "YES"){
            _ZipVal = "true";
        }
		var fileFolderLink = $(document).find(".migrateLinks").find("[name='sharedLinks']:checked").val();;
		if(localStorage._admin == "adminPresent" && localStorage.Csv == "true" && rootTFolder == true){
				teamfolders = "true"
			}
			
			
        var isBackup = 'false';
        if (($('#jobType_dropDown :selected').text() === "Delta")) {
            _DeltaVal = 'true';
            if((_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "G_SUITE")) {
                _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration=" + _DeltaVal + mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal+ "&teamFoldersMigrate=" + teamfolders; 
            }
			else if(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN"){
				 if (_fileSize.length == 0) {
                    _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration=" + _DeltaVal + mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal+"&externalUsers="+extMig+"&metaData="+metaDataMig;
                } else
                    _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration=" + _DeltaVal + mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal + "&restrictFileSize=" + _fileSize+"&externalUsers="+extMig+"&metaData="+metaDataMig;
            
			}
			else if (_fileSize.length == 0) {
                _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration=" + _DeltaVal + mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal;
            } else
                _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration=" + _DeltaVal + mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal + "&restrictFileSize=" + _fileSize;
				if(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS"){
					_changeUrl = _changeUrl;   /*+"&externalUsers="+extMig+"&metaData="+metaDataMig;*/
				}
				
        }
        else if((_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "G_SUITE")) {
            _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration=" + _DeltaVal + mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal  + "&teamFoldersMigrate=" + teamfolders+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig; 
        }
     
        else if ($('#jobType_dropDown :selected').text() === "One-way sync") {
            isBackup = 'true';
            var d = new Date();
            var f = d.toString().split(' ')[4].split(':');
            var g = d.toString().split(' ')[2];
            var h = d.toString().split(' ')[0].toUpperCase();

            var cronValue = "seconds minutes hours dayOfMonth month dayOfWeek year";
            var tenMins = cronValue.replace('seconds','0').replace('minutes','0/10').replace('hours','*').replace('dayOfMonth','1/1').replace('month','*').replace('dayOfWeek','?').replace('year','*');
            var day = cronValue.replace('seconds',f[2]).replace('minutes',f[1]).replace('hours',f[0]).replace('dayOfMonth','?').replace('month','*').replace('dayOfWeek','*').replace('year','*');
            var month = cronValue.replace('seconds',f[2]).replace('minutes',f[1]).replace('hours',f[0]).replace('dayOfMonth',g).replace('month','*').replace('dayOfWeek','?').replace('year','*');
            var week = cronValue.replace('seconds',f[2]).replace('minutes',f[1]).replace('hours',f[0]).replace('dayOfMonth','?').replace('month','*').replace('dayOfWeek',h).replace('year','*');
            if($('#selectFrequency input[name="selectFreq"]:checked').val() == "Day"){
                var cronExpression = day;
            }
            else if ($('#selectFrequency input[name="selectFreq"]:checked').val() == "tenMinutes") {
                var cronExpression = tenMins;
            }
            else if ($('#selectFrequency input[name="selectFreq"]:checked').val() == "Week") {
                var cronExpression = week;
            }
            else{
                var cronExpression = month;
            }
            if (_fileSize.length == 0) {
                _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isBackup=" + isBackup +  mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal+"&cronExpression=" +cronExpression;
            } else
                _changeUrl = "/move/newmultiuser/update/" + _jobid + "?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isBackup=" + isBackup +  mappingOptions.migrationOptionsChecked() + "&withPermissions=true&unsupportedFiles=" + _ZipVal + "&restrictFileSize=" + _fileSize+"&cronExpression=" +cronExpression;

        }
        else{
            if(_fileSize.length == 0){
                _changeUrl =  "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path +mappingOptions.migrationOptionsChecked()+ "&withPermissions=true&unsupportedFiles="+_ZipVal;
            }
            else
                _changeUrl =  "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path +mappingOptions.migrationOptionsChecked()+ "&withPermissions=true&unsupportedFiles="+_ZipVal+"&restrictFileSize="+_fileSize;
			if((_srcOpt === "EGNYTE_ADMIN" && dstnOpt === "GOOGLE_SHARED_DRIVES")||(_srcOpt === "EGNYTE_ADMIN" && dstnOpt === "G_SUITE")){
				_changeUrl = _changeUrl+"&fileFolderLink="+fileFolderLink;
			}
			
			else if(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN"){
				 if(_fileSize.length == 0){
                    _changeUrl =  "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path +mappingOptions.migrationOptionsChecked()+ "&withPermissions=true&unsupportedFiles="+_ZipVal+"&externalUsers="+extMig+"&metaData="+metaDataMig;
                }
                else
                    _changeUrl =  "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path +mappingOptions.migrationOptionsChecked()+ "&withPermissions=true&unsupportedFiles="+_ZipVal+"&restrictFileSize="+_fileSize+"&externalUsers="+extMig+"&metaData="+metaDataMig;
			}
			else if(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "G_SUITE"){
			
				if($('#selectAllOpts:checked').length > 0){
				if(localStorage._admin == "adminPresent"){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+ "&teamFoldersMigrate=" + teamfolders;
				}
				else{
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig;	
				}
				}
				else{
				if($('#sharedMig:checked').length >0){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig;
				}
				if($('#extShrsMig:checked').length >0){
				_changeUrl = _changeUrl+"&externalUsers="+extMig;
				}
				if(localStorage._admin == "adminPresent"){
				if($('#Teamfolders:checked').length >0){
				_changeUrl = _changeUrl+"&teamFoldersMigrate="+teamfolders;
				}
				}
				}
			}
			else if(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES"){
				_changeUrl = _changeUrl+"&fileFolderLink="+fileFolderLink;
			}
			else  if((_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "DROPBOX_BUSINESS")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES")||(_srcOpt === "BOX_BUSINESS" && dstnOpt === "G_SUITE")||(_srcOpt === "SHAREFILE_BUSINESS" && dstnOpt === "G_SUITE")||(_srcOpt === "SHAREFILE_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES")||(_srcOpt === "GOOGLE_SHARED_DRIVES" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")){
				if($('#selectAllOpts:checked').length > 0){
				if(_srcOpt === "BOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS"){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+"&metaData="+metaDataMig+"&sendComments="+inlineFileMig+"&innerFolderPerms="+subFlderMig+"&innerFilePerms="+innFileMig+"&pickInsideFolder="+pickInsideFldr
				}
				if(_srcOpt === "BOX_BUSINESS" && dstnOpt === "DROPBOX_BUSINESS"){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+"&metaData="+metaDataMig+"&versioning="+vrsnHisMig+"&sendComments="+inlineFileMig+"&innerFolderPerms="+subFlderMig
				}
				if((_srcOpt === "BOX_BUSINESS" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN")){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+"&metaData="+metaDataMig+"&sendComments="+inlineFileMig+"&innerFolderPerms="+subFlderMig+"&innerFilePerms="+innFileMig+"&versioning="+vrsnHisMig
				}
				if(_srcOpt === "BOX_BUSINESS" && dstnOpt === "G_SUITE"){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+"&sendComments="+inlineFileMig+"&innerFolderPerms="+subFlderMig+"&metaData="+metaDataMig+"&versioning="+vrsnHisMig
				}
				if(_srcOpt === "BOX_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES"){ 
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+"&sendComments="+inlineFileMig+"&innerFolderPerms="+subFlderMig+"&metaData="+metaDataMig+"&versioning="+vrsnHisMig
				} 
				if((_srcOpt === "SHAREFILE_BUSINESS" && dstnOpt === "G_SUITE")||(_srcOpt === "SHAREFILE_BUSINESS" && dstnOpt === "GOOGLE_SHARED_DRIVES")){
				_changeUrl = _changeUrl+"&metaData="+metaDataMig+"&versioning="+vrsnHisMig
				}
				if(_srcOpt === "DROPBOX_BUSINESS" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS"){
				_changeUrl = _changeUrl+"&externalUsers="+extMig+"&metaData="+metaDataMig;
				}
				/*if((_srcOpt === "EGNYTE_ADMIN" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")||(_srcOpt === "EGNYTE_ADMIN" && dstnOpt === "ONEDRIVE_BUSINESS_ADMIN")){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig+"&externalUsers="+extMig+"&metaData="+metaDataMig+"&versioning="+vrsnHisMig
				}*/
				}
				else{
				if($('#sharedMig:checked').length >0){
				_changeUrl = _changeUrl+"&fileFolderLink="+shrLinksMig;
				}
				if($('#extShrsMig:checked').length >0){
				_changeUrl = _changeUrl+"&externalUsers="+extMig;
				}
				if($('#vrsnHisMig:checked').length >0){
				_changeUrl = _changeUrl+"&versioning="+vrsnHisMig;
				}
				if($('#metaDataMig:checked').length >0){
				_changeUrl = _changeUrl+"&metaData="+metaDataMig;
				}
				if($('#subFldrMig:checked').length >0){
				_changeUrl = _changeUrl+"&innerFolderPerms="+subFlderMig;
				}
				if($('#innFileMig:checked').length >0){
				_changeUrl = _changeUrl+"&innerFilePerms="+innFileMig;
				}
				if($('#fileCmntMig:checked').length >0){
				_changeUrl = _changeUrl+"&sendComments="+inlineFileMig;
				}
				if($('#pickInn:checked').length >0){
				_changeUrl = _changeUrl+"&pickInsideFolder="+pickInsideFldr;
				}
				}
				
			}
        }
        // for(var i=0;i<_emailLen;i++){
        //     var value = _val[i];
        //     if(value.length && !mappingOptions.checkEmail(value)){
        //         $("#forNextMove").removeClass('disabled');
        //         return false;
        //     }
        //
        // }
        /*     var _DeltaVal = 'false';
             var isBackup = 'false';
             var twoWayBackUp = 'false';
             if($('#jobType_dropDown :selected').text() === "Delta"){
                 _DeltaVal = 'true';
             }
             var url = apicallurl + "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration="+_DeltaVal+"&isBackup="+isBackup+mappingOptions.migrationOptionsChecked()+"&twoWayBackUp=" +twoWayBackUp;

             if($('#jobType_dropDown :selected').text() === "One-way sync"){
                 isBackup = 'true';
             }
             if($('#jobType_dropDown :selected').text() === "Two-way sync"){
                 twoWayBackUp = 'true';
             }
             if($('#jobType_dropDown :selected').text()== "One-way sync" || $('#jobType_dropDown :selected').text()== "Two-way sync"){
                 var d = new Date();
                 var f = d.toString().split(' ')[4].split(':');
                 var g = d.toString().split(' ')[2];
                 var h = d.toString().split(' ')[0].toUpperCase();

                 var cronValue = "seconds minutes hours dayOfMonth month dayOfWeek year";
                 var tenMins = cronValue.replace('seconds','0').replace('minutes','0/10').replace('hours','*').replace('dayOfMonth','1/1').replace('month','*').replace('dayOfWeek','?').replace('year','*');
                 var day = cronValue.replace('seconds',f[2]).replace('minutes',f[1]).replace('hours',f[0]).replace('dayOfMonth','?').replace('month','*').replace('dayOfWeek','*').replace('year','*');
                 var month = cronValue.replace('seconds',f[2]).replace('minutes',f[1]).replace('hours',f[0]).replace('dayOfMonth',g).replace('month','*').replace('dayOfWeek','?').replace('year','*');
                 var week = cronValue.replace('seconds',f[2]).replace('minutes',f[1]).replace('hours',f[0]).replace('dayOfMonth','?').replace('month','*').replace('dayOfWeek',h).replace('year','*');
                 if($('#selectFrequency input[name="selectFreq"]:checked').val() == "Day"){
                     var cronExpression = day;
                 }
                 else if ($('#selectFrequency input[name="selectFreq"]:checked').val() == "tenMinutes") {
                     var cronExpression = tenMins;
                 }
                 else if ($('#selectFrequency input[name="selectFreq"]:checked').val() == "Week") {
                     var cronExpression = week;
                 }
                 else{
                     var cronExpression = month;
                 }

                 var url = apicallurl + "/move/newmultiuser/update/" + _jobid +"?jobName=" + _jobName + "&migrateFolderName=" + _path + "&isDeltaMigration="+_DeltaVal+"&isBackup="+isBackup+mappingOptions.migrationOptionsChecked()+"&twoWayBackUp=" +twoWayBackUp+"&cronExpression=" +cronExpression;
             } */
        $.ajax({
            type: "PUT",
            //  url: url,
            url: apicallurl + _changeUrl,
            aync : false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                localStorage.setItem('jobList',JSON.stringify(data.jobList));
                //var _splChar = $(".splChar input[name=splCharacter]:checked").val();
                // var _shareContent = $("#chkShrdCntnt").is(":checked");
                var _table = $("#preview table");
                //    $(_table).find("tbody").find("#JobName").css("display","");
                $(_table).find(".jobName").text(data.jobName);
                localStorage.setItem('jobName',data.jobName);
                if($('#jobType_dropDown :selected').text() != "One-way sync"){
                    $(_table).find(".count").html(data.listOfMoveWorkspaceId.length);
                }
                else {
                    $(_table).find(".count").html(data.jobList.length);
                    //  $(_table).find("tbody").find("#JobName").css("display", "none");
                }
				if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "BOX_BUSINESS"){
					$(document).find("#additionalNoti").css("display","none");
				}
				else{
					$(document).find("#additionalNoti").css("display","none");	 
				}
                /* if (localStorage.getItem("csvName")||(data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) { */
                if (localStorage.getItem("csvName")|| (data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "DROPBOX_BUSINESS") || (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "BOX_BUSINESS")|| (data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN" && data.toCloudName === "DROPBOX_BUSINESS")|| (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS") || (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS") || (data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN" && data.toCloudName === "BOX_BUSINESS") ||(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "G_SUITE")|| (data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "G_SUITE" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")|| (data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_HYBRID")|| (data.fromCloudName == "BOX_BUSINESS" && data.toCloudName == "ONEDRIVE_BUSINESS_ADMIN_HYBRID")|| (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "SHAREPOINT_ONLINE_HYBRID")|| (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "G_SUITE" && data.toCloudName === "BOX_BUSINESS")||(data.fromCloudName == "EGNYTE_ADMIN" && data.toCloudName == "G_SUITE")||(data.fromCloudName == "EGNYTE_ADMIN" && data.toCloudName == "GOOGLE_SHARED_DRIVES")||(data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "SHAREPOINT_ONLINE_BUSINESS")|| (data.fromCloudName == "DROPBOX_BUSINESS" && data.toCloudName == "AMAZON")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")) {
                    $(_table).find("tbody").find(".dstnPath").css("display", "none");
                }
                else{
                    $(_table).find("tbody").find(".dstnPath").css("display", "");
                    var _path = "/" + data.migrateFolderName;
                    $(_table).find(".path").text(_path);
                }
                if (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN") { 
                    $(_table).find("tbody").find("#JobName").css("display", "");
                    if((JSON.parse(localStorage.getItem("CFUser")).version === undefined)&& JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined) {
                        $('#mappingOptionsNew #jobNewOptions').css("display", "");
                        $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
                    }
                    else if((JSON.parse(localStorage.getItem("CFUser")).version !== undefined)|| JSON.parse(localStorage.getItem("CFUser")).fileFolderLink !== undefined) {
                        if (JSON.parse(localStorage.getItem("CFUser")).version === true || JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true){
                            $(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");
                            $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
			    $(_table).find("tbody").find(".externalShares").css("display", "none");
                            //$(_table).find("tbody").find(".temafolderspreview").css("display", "none");
                        }
                        else
                        {
                            $(_table).find("tbody").find(".fileSizeExclude").css("display", "");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "");
	    		    $(_table).find("tbody").find(".externalShares").css("display", "");
                            $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
                        }
                    }
                    else if(JSON.parse(localStorage.getItem("CFUser")).version === undefined) {
                        if (JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === true) {
                            $(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");
                            $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
			    $(_table).find("tbody").find(".externalShares").css("display", "none");
                        } else {
                            $(_table).find("tbody").find(".fileSizeExclude").css("display", "");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "");
                            $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
			    $(_table).find("tbody").find(".externalShares").css("display", "");
 }
                    }
                    else if(JSON.parse(localStorage.getItem("CFUser")).fileFolderLink === undefined){
                        if(JSON.parse(localStorage.getItem("CFUser")).version === true )
                        {
                            $(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");
                            $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
			    $(_table).find("tbody").find(".externalShares").css("display", "none");
                        }
                        else{

                            $(_table).find("tbody").find(".fileSizeExclude").css("display", "");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "");
			    $(_table).find("tbody").find(".externalShares").css("display", "none");
                            //$(_table).find("tbody").find(".temafolderspreview").css("display", "none");
                        }
                    } 
					$(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                            $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                            $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");


                    if(data.externalUsers === true){
                        var externalUsers = 'Yes';
                    }
                    else{
                        var externalUsers = 'No';
                    }
                    $(_table).find(".externalSharesVal").text(externalUsers);
						$(_table).find("tbody").find(".metadataPre").css("display", "");
				if(data.metaData === true){
                        var metaData = 'Yes';
                    }
                    else{
                        var metaData = 'No';
                    }
                    $(_table).find(".metadataPreVal").text(metaData);
					if(data.restrictFileSize === null || data.restrictFileSize === undefined || data.restrictFileSize === "null" || data.restrictFileSize === "undefined" ){
                        var  size = '-';
                    }
                    else{
                        size = data.restrictFileSize;
                        size = size.replace(':',' ');
                    }
                    $(_table).find(".fileSizeEx").text(size);
                    if(data.unsupportedFiles === true){
                        var unsupported = 'Yes';
                    }
                    else{
                        var unsupported = 'No';
                    }
                    $(_table).find(".unSupportedZipFiles").text(unsupported);
                    //$(_table).find(".fileVerHis").text(fileSizeEx);
                }
              /*  else if (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "G_SUITE") {
                    $(_table).find("tbody").find("#JobName").css("display", "");
                    if (localStorage.getItem("TFldrHide") === undefined || localStorage.getItem("TFldrHide") === null){
                        $(_table).find("tbody").find(".temafolderspreview").css("display", "");
                    }else {
                        $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
                    }
                    $(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                    $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                    $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");
			  }*/
				else if (data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES") {
					$(_table).find("tbody").find("#JobName").css("display", "");
					if(data.jobType == "ONETIME"){
					if(data.fileFolderLink === true){
                        var fileFolderLink = 'Yes';
                    }
                    else{
                        var fileFolderLink = 'No';
                    }
                    $(_table).find(".fileFldrLinkPrevVal").text(fileFolderLink);
					$(_table).find("tbody").find(".fileFldrLinkPrev").css("display", "");
					}
					else{
					$(_table).find("tbody").find(".fileFldrLinkPrev").css("display", "none");					
					}
                    $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
                    $(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                    $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                    $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");
					$(_table).find("tbody").find(".externalShares").css("display", "none");
                }
				/*else if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"){
				$(_table).find("tbody").find(".externalShares").css("display", "");
				if(data.externalUsers === true){
                        var externalUsers = 'Yes';
                    }
                    else{
                        var externalUsers = 'No';
                    }
                    $(_table).find(".externalSharesVal").text(externalUsers);
					$(_table).find("tbody").find(".metadataPre").css("display", "");
				if(data.metaData === true){
                        var metaData = 'Yes';
                    }
                    else{
                        var metaData = 'No';
                    }
                    $(_table).find(".metadataPreVal").text(metaData);
				}*/
                else{
                    // $(_table).find("tbody").find("#JobName").css("display", "none");
		    $(_table).find("tbody").find("#fileFldrLinkPrev").css("display", "none");
                    $(_table).find("tbody").find(".fileSizeExclude").css("display", "none");
                    $(_table).find("tbody").find(".unSupZipFiles").css("display", "none");
                    $(_table).find("tbody").find(".fileTypeExclude").css("display", "none");
                    $(_table).find("tbody").find(".temafolderspreview").css("display", "none");
	            $(_table).find("tbody").find(".externalShares").css("display", "none");


                }
				
				if((data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "DROPBOX_BUSINESS")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "G_SUITE")||(data.fromCloudName == "SHAREFILE_BUSINESS" && data.toCloudName == "GOOGLE_SHARED_DRIVES")){
				if(data.jobType == "ONETIME"){
							
							 $("#previewNew").css("display","");
							 $("#previewOld").css("height","23vh");
					if(data.externalUsers === true){
                        var externalUsers = 'Yes';
                    }
                    else{
                        var externalUsers = 'No';
                    }
					$(_table).find("#MigExt").text(externalUsers);
					if(data.metaData === true){
                        var metaData = 'Yes';
                    }
                    else{
                        var metaData = 'No';
                    }
                    $(_table).find("#MigMetaData").text(metaData);
					
					if(data.fileFolderLink === true){
                        var fileFolderLink = 'Yes';
                    }
                    else{
                        var fileFolderLink = 'No';
                    }
                    $(_table).find("#MigShrs").text(fileFolderLink);
					
					if(data.innerFolderPerms === true){
                        var innerFolderPerms = 'Yes';
                    }
                    else{
                        var innerFolderPerms = 'No';
                    }
                    $(_table).find("#MigSubFldr").text(innerFolderPerms);
					
					if(data.innerFilePerms === true){
                        var innerFilePerms = 'Yes';
                    }
                    else{
                        var innerFilePerms = 'No';
                    }
                    $(_table).find("#MigSubFile").text(innerFilePerms);
					
					if(data.version === true){
                        var version = 'Yes';
                    }
                    else{
                        var version = 'No';
                    }
                    $(_table).find("#MigVrsn").text(version);
					
					if(data.sendComments === true){
                        var sendComments = 'Yes';
                    }
                    else{
                        var sendComments = 'No';
                    }
                    $(_table).find("#MigCmnts").text(sendComments);
					if(data.pickInsideFolder === true){
                        var pickInsideFolder = 'Yes';
                    }
                    else{
                        var pickInsideFolder = 'No';
                    }
                    $(_table).find("#Migpick").text(pickInsideFolder);
					if(data.teamFoldersMigrate === true){
                        var teamFolder = 'Yes';
                    }
                    else{
                        var teamFolder = 'No';
                    }
                    $(_table).find("#teamFldrVal").text(teamFolder);
					
					var specialCharacter = data.specialCharacter;
                    
                    $(_table).find(".replaceChrMig").text(specialCharacter);
					if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"){
					$(".versionHisCls").css("display","none");
					$(".pickInsideCls").css("display","");
					$(".teamFldrCls").css("display","none");
					$("#replaceMig").css("display","");	
					$("#additionalNoti").css("display","none");
					$(".shrCls").css("display", "");
					$(".extCls").css("display", "");
					}
					if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"){
					$(".versionHisCls").css("display","none");
					$(".pickInsideCls").css("display","none");
					$(".teamFldrCls").css("display","none");
					$("#replaceMig").css("display","none");	
					$("#additionalNoti").css("display","");
					$(".shrCls").css("display", "none");
					$(".extCls").css("display", "");
					$(".teamFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					$(".metaCls").css("display",""); 
					$(".inlineCls").css("display","none");
					$(".subFldrCls").css("display","none");
					}
					if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "DROPBOX_BUSINESS"){
					$(".versionHisCls").css("display","");
					$(".pickInsideCls").css("display","none");
					$(".teamFldrCls").css("display","none");
					$("#replaceMig").css("display","");	
					$("#additionalNoti").css("display","none");
					$(".shrCls").css("display", "");
					$(".extCls").css("display", "");
					$(".innerCls").css("display","none");
					$(".metaCls").css("display",""); 
					}
					if(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"){
					$(".versionHisCls").css("display","none");
					$(".pickInsideCls").css("display","none");
					$(".teamFldrCls").css("display","none");
					$("#replaceMig").css("display","");	
					$("#additionalNoti").css("display","");
					$(".shrCls").css("display", "none");
					$(".extCls").css("display", "none");
					$(".teamFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					$(".metaCls").css("display",""); 
					}
					if((data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")){
					$(".pickInsideCls").css("display","none");
					$(".versionHisCls").css("display","");
					$(".teamFldrCls").css("display","none");
					$("#replaceMig").css("display","");	
					$("#additionalNoti").css("display","none");
					}
					if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES"){
					$(".pickInsideCls").css("display","none");
					$(".teamFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					
					$(".versionHisCls").css("display","");
					$(".metaCls").css("display","");
					$("#replaceMig").css("display","");	
					$("#additionalNoti").css("display","none");
					$(".shrCls").css("display", "");
					$(".extCls").css("display", "");
					}
					if(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE"){
					$(".pickInsideCls").css("display","none");
					$(".versionHisCls").css("display","");
					$(".teamFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					$(".metaCls").css("display",""); 
					$("#replaceMig").css("display","");	 
					$("#additionalNoti").css("display","none");
					$(".shrCls").css("display", "");
					$(".extCls").css("display", "");
					}
					/*if((data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")||(data.fromCloudName === "EGNYTE_ADMIN" && data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")){
					$(".pickInsideCls").css("display","none");
					$(".versionHisCls").css("display","");
					$(".teamFldrCls").css("display","none");
					$(".metaCls").css("display","");
					$("#replaceMig").css("display","none");	
					$("#additionalNoti").css("display","");
					$(".shrCls").css("display", "");
					$(".extCls").css("display", "");
					$(".subFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					$(".inlineCls").css("display","none");
					}*/
					
					if(data.fromCloudName === "DROPBOX_BUSINESS" && data.toCloudName === "G_SUITE"){
					$(".pickInsideCls").css("display","none");
					$(".versionHisCls").css("display","none");
					$(".metaCls").css("display","none");
					$(".subFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					$(".inlineCls").css("display","none");
					$(".teamFldrCls").css("display","");
					$("#replaceMig").css("display","none");	  
					$("#additionalNoti").css("display","");
					if(localStorage._admin == "adminAbsent"){
					$(".teamFldrCls").css("display", "none");
					}
					else if(localStorage._admin == "adminPresent" && localStorage.Csv == "true" && rootTFolder == true){
					$(".teamFldrCls").css("display", "none");
					}
					else{
					$(".teamFldrCls").css("display", ""); 
					}
					}
					if((data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "SHAREFILE_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")){
					$(".pickInsideCls").css("display","none");
					$(".versionHisCls").css("display","");
					$(".metaCls").css("display","");
					$(".subFldrCls").css("display","none");
					$(".innerCls").css("display","none");
					$(".inlineCls").css("display","none");
					$(".teamFldrCls").css("display","");
					$("#replaceMig").css("display","none");	  
					$("#additionalNoti").css("display","");
					$(".teamFldrCls").css("display", "none");
					$(".shrCls").css("display", "none");
					$(".extCls").css("display", "none");
										
					}
						
				} 
				else{
				if((data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "G_SUITE")||(data.fromCloudName === "BOX_BUSINESS" && data.toCloudName === "GOOGLE_SHARED_DRIVES")){
					$("#additionalNoti").css("display","none");
				}
							$("#previewNew").css("display","none");
							$("#previewOld").css("height","54vh");
								$("#replaceMig").css("display","none");	
							 }
					 
				
				} 
                         else{
						 $("#replaceMig").css("display","none");	
							$("#additionalNoti").css("display","");
							$("#previewNew").css("display","none");
							$("#previewOld").css("height","54vh");
                         }
						 
                //$(_table).find(".count").html(data.listOfMoveWorkspaceId.length + '<div class="pull-right" style="cursor: pointer;text-decoration:underline">Show</div>');
                $(_table).find(".others").text('');
                
				$(_table).find(".srcImg").html('<img src="../img/PNG/' + data.fromCloudName+ '.png" alt="cloud" style="margin-top: 3%;width: 25px;height: 25px;border: 1px solid #e5e5e5;padding: 1%;background: #fcfcfc;border-radius: 15px;"><div style="margin: 5px;margin-top: 4%;">' + CLName[data.fromCloudName]+ '</div>');
                if(data.toCloudName.length >25)
				$(_table).find(".dstImg").html('<img src="../img/PNG/' + data.toCloudName+ '.png" alt="cloud" style="margin-top: 3%;width: 25px;height: 25px;border: 1px solid #e5e5e5;padding: 1%;background: #fcfcfc;border-radius: 15px;"><div style=""><div style="margin: 5px;margin-top: 8%;">' + CLName[data.toCloudName]+ '</div>');
				else if(data.toCloudName.length >12)
				$(_table).find(".dstImg").html('<img src="../img/PNG/' + data.toCloudName+ '.png" alt="cloud" style="margin-top: 3%;width: 25px;height: 25px;border: 1px solid #e5e5e5;padding: 1%;background: #fcfcfc;border-radius: 15px;"><div style=""><div style="margin: 5px;margin-top: 10%;">' + CLName[data.toCloudName]+ '</div>');
				else
				$(_table).find(".dstImg").html('<img src="../img/PNG/' + data.toCloudName+ '.png" alt="cloud" style="margin-top: 3%;width: 25px;height: 25px;border: 1px solid #e5e5e5;padding: 1%;background: #fcfcfc;border-radius: 15px;"><div style=""><div style="margin: 5px;margin-top: 15%;">' + CLName[data.toCloudName]+ '</div>');
                $(_table).find("#jobType").text(data.jobType);
                if(data.teamFoldersMigrate == true && localStorage.getItem("normalUser") === "NormalUserPresent"){
                    $(_table).find(".teamfoldercondition").text("Yes");
                } else if (data.teamFoldersMigrate == true ){
                    $(_table).find(".teamfoldercondition").text("Yes");
                }else {
                    $(_table).find(".teamfoldercondition").text("No");
                }
                /*   var _step = parseInt($("#forNextMove").attr("data-step"));
                   if (_step == 3) {
                       $("#mappingClouds").css("display", "none");
                       $("#mappingUsers").css("display", "none");
                       $('#mappingOptions').css("display", "none");
                       $("#preview").css("display", "");
                       $('#mappedMigration').css("display", "none");

                       $("#forNextMove").css({"width": "140px", "margin-left": "-51px"});
                       $("#forNextMove span").text("Start Migration");
                       _step = _step + 1;
                       $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
                       $("#forNextMove").attr("data-step", _step);
                       $("#forPreviousMove").attr("data-prev", _step);
                       $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");

                   } */
                var _srcOpt = data.fromCloudName,dstnOpt = data.toCloudName;
                mappingOptions.migrationRestrictions(_jobid,_val,fileValue,_srcOpt,dstnOpt);
                mgrtnPrs.pgntdData(1,10);

            }
        });
        return true;
    },
    /*  spoToSyncUpdate:function(version) {
          var sourceCldId = localStorage.getItem('fromCloudId');
          var destCldId = localStorage.getItem('toCloudId');
          var userId = localStorage.getItem('UserId');
          $.ajax({
              type: "GET",
              url: apicallurl + "/move/multiuser/verify/versionhistory/" + userId + "?sourceCloudId=" + sourceCldId + "&destinationCloudId=" + destCldId + "&version=" + version,
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
              },
              success: function (data) {
                  console.log(data);
                  if (data === "Not_Allow:true") {
                      $('#spoToSyncVersion').modal('show');
                      $('#spoToSync').text('Previously for these combination of users, migration was initiated with File versioning. Click continue for migration with File versioning.');
                      $("#forNextMove").removeClass('disabled');
                      localStorage.setItem('fusionTables',true);
                  }
                  else if (data === "Not_Allow:false") {
                      $('#spoToSyncVersion').modal('show');
                      $('#spoToSync').text('Previously for these combination of users, migration was initiated without File versioning. Click continue for migration without File versioning.');
                      $("#forNextMove").removeClass('disabled');
                      localStorage.setItem('fusionTables',false);
                  }
                  else {
                      localStorage.setItem('fusionTables',version);
                      mappingOptions.updateJob();
                  }
              }
          });
      }, */
    migrationRestrictions:function (jobid,emails,fileValue,_srcOpt,dstnOpt) {
        // var _emails = [],_json;
        // $("#emailId span").each(function(){
        //     _emails.push($(this).text());
        // });
        if((_srcOpt === "ONEDRIVE_BUSINESS_ADMIN" && dstnOpt === "DROPBOX_BUSINESS") ||(dstnOpt === "ONEDRIVE_BUSINESS_ADMIN" &&  _srcOpt === "DROPBOX_BUSINESS")||(_srcOpt === "GOOGLE_SHARED_DRIVES" && dstnOpt === "SHAREPOINT_ONLINE_BUSINESS")){
            _json ={
                "notToMoveExtension":fileValue,
                "emailValues":emails,
            }
        }
        else{
            _json ={
                "notToMoveExtension":[],
                "emailValues":emails
            }
        }
        $.ajax({
            type: "PUT",
            url: apicallurl + "/move/newmultiuser/update/restriction/" + jobid ,
            data : JSON.stringify(_json),
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                //mappingOptions.migrationInitiation(jobid);
                var _len,len ;

                var _table = $("#preview table");
                if(data.emailValues != null)
                    _len = data.emailValues.length;

                $(_table).find(".emails").text(' - ');
                if(data.notToMoveExtension != null)
                    len = data.notToMoveExtension.length;
                $(_table).find(".fileTypeEx").text(' - ');

                for(var i =0; i < _len;i++){
                    if(i === 0)
                        $(_table).find(".emails").text(data.emailValues[0]);
                    else
                        $(_table).find(".emails").append(", " + data.emailValues[i]);
                }
                if((data.fromCloudName === 'DROPBOX_BUSINESS' && data.toCloudName === 'ONEDRIVE_BUSINESS_ADMIN')||(data.fromCloudName === "GOOGLE_SHARED_DRIVES" && data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")){
                    for(var j =0; j < len;j++){
                        if(j === 0)
                            $(_table).find(".fileTypeEx").text(data.notToMoveExtension[0]);
                        else
                            $(_table).find(".fileTypeEx").append(", " + data.notToMoveExtension[j]);
                    }
                }
            }
        });
    },
    migrationIntnRootFolder:function(jobid){
        $.ajax({
            type: "POST",
            url: apicallurl + "/move/newmultiuser/rootfolderid/" + jobid,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {


            }
        });
    },
    migrationInitiation:function(jobid){
        $.ajax({
            type: "POST",
            url: apicallurl + "/move/newmultiuser/create/" + jobid,
			async:false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
          localStorage.setItem("MigtnDone","multiUser");
				//	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'sourceCloud',data.fromCloudName);
				//	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'destinationCloud',data.toCloudName);
        //  zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,'Migration',data.fromCloudName,data.toCloudName);
                    if(data.fromCloudName === 'DROPBOX_BUSINESS' && data.toCloudName === 'ONEDRIVE_BUSINESS_ADMIN'){
                        CFManageCloudAccountsAjaxCall.getAllClouds(data.fromCloudName,data.toCloudName,'multiuserPage');
                    }
                    else if(data.toCloudName === 'DROPBOX_BUSINESS' && data.fromCloudName === 'ONEDRIVE_BUSINESS_ADMIN'){
                        CFManageCloudAccountsAjaxCall.getAllClouds(data.fromCloudName,data.toCloudName,'multiuserPage');
                    }
                sendGAEvents("Initiated a multiuser migration in team migration page");
				//activecampaign.eventTrack('Start Migration',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
                mappingOptions.localStorageOperation('','rmv');
                mappingOptions.folderOperation('','rmv');
                CsvOperation('','rmv');
                localStorage.removeItem("jobId");
				window.location.href = "reports.html#team"
                /*mappingOptions.appendMigrationJobs(1,60); 
                $("#mappingClouds").css("display","none");
                $("#mappingUsers").css("display","none");
                $('#mappingOptions').css("display","none");
                $('#mappingOptionsNew').css("display","none");
                $("#preview").css("display","none");
                $('#mappedMigration').css("display","");
                $('#mappedSyncMigration').css("display","none");


                var _step = parseInt($("#forNextMove").attr("data-step"));
                _step = _step + 1;

                $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
                $("#forNextMove").attr("data-step",_step);
                $("#forPreviousMove").attr("data-prev",_step );
                $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");*/
            }
        });
    },
    acceptCharcter : function(val){
        if (/[a-z\d_-]/i.test(val))
            return val;
        else if(val == '.')
            return val;
        /*   else if(val == ' ')
               return val; */
        else{
            // $('#acceptCharacterError').modal('show');
            alertError("Special character not allowed.");
            return false;
        }
    },
    uniqueArray:function(items){
        return Array.from(new Set(items));
    },
    checkEmail:function (email) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;
        if (!filter.test(email)) {
            alertError(email + ' is not valid email address.');
            return false;
        }
        return mappingOptions.checkDuplicatedEmails(email);

        // var isExists = false;
        // $(emailsList).each(function(){
        //     if($(this).text().trim().toLowerCase() == email.toLowerCase())
        //         isExists = true;
        // });
        // var _len = emailsList.length;
        // for(var i=0;i<_len;i++){
        //     if(emailsList[i].toLowerCase() == email.toLowerCase())
        //              isExists = true;
        // }
        // else if(isExists){
        //     alertError(email + 'This E-mail is already added for notification');
        //     return false;
        // }
        // else{
        //     alertSuccess(email + " is added for notification.");
        //     return true;
        // }
    },
    checkEmailNew:function (email) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;
        if (!filter.test(email)) {
            alertError(email + ' is not valid email address.');
            return false;
        }

        return mappingOptions.checkDuplicatedEmailsNew(email);
    },
    checkDuplicatedEmails:function (email) {
        var _val = [email],_rtn=true;
        $(".notifiedMails .emailParent span").each(function(){
            _val.push($(this).text().trim());
        });
        if(_val.length !== new Set(_val).size){
            _rtn = false;
            alertError(email+ " is already entered.");
            $("#additionalemailsold").val('');

        }
        return _rtn;
    },
    /*checkDuplicatedEmailsNew:function (email) {
        var _val = [email],_rtn=true;
        $(".notifiedMailsNew .emailParent span").each(function(){
            _val.push($(this).text().trim());
        });
        if(_val.length !== new Set(_val).size){
            _rtn = false;
            alertError(email+ " is already entered.");
            $("textarea").val('');

        }
        return _rtn;
    },*/
    checkDuplicatedEmailsNew:function (email) {
        var _val = [email.toLowerCase()],_rtn=true;
        $("#additionalEmails ul li").each(function(){
            _val.push($(this).text().slice(0,-1).trim());
        });

        if(_val.length !== new Set(_val).size){
            _rtn = false;
            alertError(email+ " is already entered.");
            return false;

        }
        else{
            if($('#additionalEmails ul').find('li').length >= 2){
                $('#my_input').css('margin-top','3%');
            }
            else{
                $('#my_input').css('margin-top','0%');

            }
            // append to list of emails with remove button
            $('#additionalEmails ul').append($('<li class="multipleInput-email"><span> ' + email + '</span></li>')
                .append($('<a href="#" class="multipleInput-close" title="Remove">x</a>')
                    .click(function(e) {
                        if($('#additionalEmails ul').find('li').length < 3){
                            $('#my_input').css('margin-top','0%');
                        }
                        $(this).parent().remove();
                        e.preventDefault();
                    })
                )
            );
        }
        return _rtn;
    },
    checkfileType:function (_excFiles) {
        var filter = /^([a-zA-Z0-9])+$/;
        if (!filter.test(_excFiles)) {
            alertError(_excFiles + ' is not valid file type.');
            return false;
        }

        return mappingOptions.checkDuplicatedfileType(_excFiles);
    },
    checkDuplicatedfileType:function (_excFiles) {
        var _val = [_excFiles.toLowerCase()],_rtn=true;
        $(".fileTypeExc .mpParent span").each(function(){
            _val.push($(this).text().trim());
        });

        if(_val.length !== new Set(_val).size){
            _rtn = false;
            alertError(_excFiles+ " is already entered.");
			$("#my_inputfile").val('');

        }
       /* else{
           
            // append to list of emails with remove button
            $('.fileTypeExc .mpParent').append($('<li class="multipleInput-files"><span> ' + _excFiles.toLowerCase() + '</span></li>')
                .append($('<a href="#" class="multipleInput-closefile" title="Remove">x</a>')
                    .click(function(e) {
                        if($('#fileTypeExc ul').find('li').length < 4){
                            $('#my_inputfile').css('margin-top','-2%');
                        }
                        $(this).parent().remove();
                        e.preventDefault();
                    })
                )
            );
        }*/
        return _rtn;
    },
    /*checkDuplicatedfileType:function (_excFiles) {
        var _fileValue = [_excFiles],_rtn=true;
        $(".notifiedFileTypes .emailParent span").each(function(){
            _fileValue.push($(this).text().trim());
        });
        if(_fileValue.length !== new Set(_fileValue).size){
            _rtn = false;
            alertError(_excFiles+ " is already entered.");
            $("#fileTypeExc").val('');

        }
        return _rtn;
    }, */
    getDateConversion:function (timestamp) {
        var _ago = Date.now() - timestamp;
        if( _ago < 86400000)
            return jQuery.timeago(timestamp);
        else
            return CFManageCloudAccountsAjaxCall.getDateConversion(timestamp);
    },
    localStorageOperation : function (value , op) {
        //"fromCloudId"."id"   "toCloudId" ."id"
        var _storage = JSON.parse(localStorage.getItem('selectedMappings')),_rtnValue, _len ;
        var _storageEmail = JSON.parse(localStorage.getItem('selectedEmail')),_manuVal, len ;
        if(_storage != null)
            _len = _storage.length;
        else
        {
            _len = 0;
            _storage = [];
        }
        if(_storageEmail != null)
            len = _storageEmail.length;
        else
        {
            len = 0;
            _storageEmail = [];
        }



        var  operations ={
            checkExists :function () {
                _rtnValue = false;
                for(var i=0; i<_len; i++){
                    if(_storage[i].fromCloudId.id == value.fromCloudId.id  && _storage[i].toCloudId.id == value.toCloudId.id)
                        _rtnValue = true;
                }
            },
            deleteValue : function () {
                var  deletedArray = _storage.filter(function(el) {
                    return el.fromCloudId.id !== value.fromCloudId.id;
                });
                localStorage.setItem('selectedMappings',JSON.stringify(deletedArray));
                _rtnValue = true;
            },
            deleteEmailValue : function () {
                var  deletedArray = _storageEmail.filter(function(el) {
                    return el.fromMailId !== value.fromMailId;
                });
                localStorage.setItem('selectedEmail',JSON.stringify(deletedArray));
                _manuVal = true;
            },

            //
            setValue : function () {
                _storage.push(value);
                localStorage.setItem('selectedMappings',JSON.stringify(_storage));
                _rtnValue = true;
            },
            setEmailVal : function () {
                _storageEmail.push(value);
                localStorage.setItem('selectedEmail',JSON.stringify(_storageEmail));
                _manuVal = true;
            },
            getValue :function () {
                _rtnValue = _storage;
            },
            remove   : function () {
                localStorage.removeItem('selectedMappings');
                localStorage.removeItem('selectedEmail');
                $('input[name="inputMapdUrs"]').removeAttr('checked');
                _rtnValue = true;
            },
            remove_1   : function () {
                localStorage.removeItem('selectedMappings');
                localStorage.removeItem('selectedEmail');
                _rtnValue = true;
            }
        };
        switch(op){

            case 'check'  : operations.checkExists();
                break;
            case 'delete' : operations.deleteValue();
                break;
            case 'delete1' : operations.deleteEmailValue();
                break;
            case 'set'    : operations.setValue();
                break;
            case 'set1'    : operations.setEmailVal();
                break;
            case 'get'    : operations.getValue();
                break;
            case 'rmv'    : operations.remove();
                break;
            case 'rmv1'    : operations.remove_1();
                break;
        }

        return _rtnValue;
        return  _manuVal;
    },
    folderOperation : function (value , op) {
        //"fromCloudId"."id"   "toCloudId" ."id"
        var _storage = JSON.parse(localStorage.getItem('folderMappings')),_rtnValue, _len ;
        var _storageEmail = JSON.parse(localStorage.getItem('folderEmail')),_manuVal, len ;
        if(_storage != null)
            _len = _storage.length;
        else
        {
            _len = 0;
            _storage = [];
        }
        if(_storageEmail != null)
            len = _storageEmail.length;
        else
        {
            len = 0;
            _storageEmail = [];
        }



        var  operations ={
            checkExists :function () {
                _rtnValue = false;
                for(var i=0; i<_len; i++){
                    if(_storage[i].fromCloudId.id === value.fromCloudId.id  && _storage[i].toCloudId.id === value.toCloudId.id){
                        if(_storage[i].fromRootId === value.fromRootId  && _storage[i].toRootId === value.toRootId)
                            _rtnValue = true;
                    }
                }
            },
            deleteValue : function () {
                var  deletedArray = _storage.filter(function(el) {
                    return  el.fromRootId !== value.fromRootId || el.toRootId !== value.toRootId;

                });
                localStorage.setItem('folderMappings',JSON.stringify(deletedArray));
                _rtnValue = true;
            },
            deleteEmailValue : function () {
                var  deletedArray = _storageEmail.filter(function(el) {
                    return el.fromMailId !== value.fromMailId;
                });
                localStorage.setItem('folderEmail',JSON.stringify(deletedArray));
                _manuVal = true;
            },

            //
            setValue : function () {
                _storage.push(value);
                localStorage.setItem('folderMappings',JSON.stringify(_storage));
                _rtnValue = true;
            },
            setEmailVal : function () {
                _storageEmail.push(value);
                localStorage.setItem('folderEmail',JSON.stringify(_storageEmail));
                _manuVal = true;
            },
            getValue :function () {
                _rtnValue = _storage;
            },
            remove   : function () {
                localStorage.removeItem('folderMappings');
                localStorage.removeItem('folderEmail');
                $('input[name="inputMapdUrs"]').removeAttr('checked');
                _rtnValue = true;
            },
            remove_1   : function () {
                localStorage.removeItem('folderMappings');
                localStorage.removeItem('folderEmail');
                _rtnValue = true;
            }
        };
        switch(op){

            case 'check'  : operations.checkExists();
                break;
            case 'delete' : operations.deleteValue();
                break;
            case 'delete1' : operations.deleteEmailValue();
                break;
            case 'set'    : operations.setValue();
                break;
            case 'set1'    : operations.setEmailVal();
                break;
            case 'get'    : operations.getValue();
                break;
            case 'rmv'    : operations.remove();
                break;
            case 'rmv1'    : operations.remove_1();
                break;
        }

        return _rtnValue;
        return  _manuVal;
    },
    appendOptions:function(src,dst){
        /*   if(src == "SHAREPOINT_ONLINE_BUSINESS"){// || src == "NETWORK_FILESHARES"){ //commented on 24Dec2018 -Rathnakar
               $("#chkShrdCntnt").attr("disabled", true);
           }
           else{
               $("#chkShrdCntnt").attr("disabled", false);
           } */
        var _srcHtml='';
        $(".expandDsteOptionsHide .teamfolderrow").show();
        //$(".teamfolderrow").css("display","");
        //$(".expandDsteOptionsHide").find("tr:gt(1)").show();
        if((src == "DROPBOX_BUSINESS" && dst == "G_SUITE")) {/*
            if(temp.includes('true') && localStorage.getItem("Csv") ){
                    $(".expandDsteOptionsHide .teamfolderrow").show();
            }else if ( localStorage.getItem("Csv") && localStorage.getItem("selectedEmail")){
                $(".expandDsteOptionsHide .teamfolderrow").hide();
            }else {
                $(".expandDsteOptionsHide .teamfolderrow").hide();
            }*/
            manaulAdmin = false;
            manaulUser = false;
            manualAdminCheck = localStorage.getItem("multiUsrSrcEmail");
            if(localStorage.getItem("selectedEmail")){
                _manaulAdmin = JSON.parse(localStorage.getItem("selectedEmail"));
                for (var i = 0; i < _manaulAdmin.length; i++) {
                    if (manualAdminCheck === _manaulAdmin[i].fromMailId) {
                        manaulAdmin = true;
                    }else{
                        manaulUser = true;
                    }
                }
            }
            localStorage.removeItem("TFldrHide");
            if(localStorage.getItem("Csv") && localStorage.getItem("selectedEmail")){
                if(localStorage.getItem("selectedEmail")){
                    if(manaulAdmin == true){
                        $(".expandDsteOptionsHide .teamfolderrow").show();
                    }else if(temp.includes('true')){
                        $(".expandDsteOptionsHide .teamfolderrow").show();
                    }else{
                        $(".expandDsteOptionsHide .teamfolderrow").hide();
                        localStorage.setItem("TFldrHide","TeamFolderPHide");
                    }
                } else if ( temp.includes('true') ){
                    $(".expandDsteOptionsHide .teamfolderrow").show();
                }else{
                    $(".expandDsteOptionsHide .teamfolderrow").hide();
                    localStorage.setItem("TFldrHide","TeamFolderPHide");
                }
                //admin check selected emails  $(".expandDsteOptionsHide .teamfolderrow").show();
            }else if (localStorage.getItem("Csv")){
                if(temp.includes('true') ){
                    $(".expandDsteOptionsHide .teamfolderrow").show();
                }else{
                    $(".expandDsteOptionsHide .teamfolderrow").hide();
                    localStorage.setItem("TFldrHide","TeamFolderPHide");
                }
            }else if (localStorage.getItem("_admin")){
                if (localStorage.getItem("_admin") === "adminPresent"){
                    $(".expandDsteOptionsHide .teamfolderrow").show();
                }else{
                    $(".expandDsteOptionsHide .teamfolderrow").hide();
                    localStorage.setItem("TFldrHide","TeamFolderPHide");
                }
            }else{
                $(".expandDsteOptionsHide .teamfolderrow").hide();
                localStorage.setItem("TFldrHide","TeamFolderPHide");
            }
        }
        else {
            $(".expandDsteOptionsHide .teamfolderrow").hide();
            //$(".expandDsteOptionsHide").find("tr:gt(0)").remove();
        }
        $(".expandSourceOptionsHide").find("tr:gt(0)").remove();
       // $(".expandDsteOptionsHide").find("tr:gt(0)").remove();
        $(".expndDstCldName").html("<b>Destination Cloud: </b>" + CLName[dst]);
        $(".expndSrcCldName").html("<b>Source Cloud: </b>" + CLName[src]);
        var $ODSC = $(".expndSrcCldName").parents("tr");
		var $ODST = $(".expndDstCldName").parents("tr");
        $($ODSC).show();
        $(".expandSourceOptionsHide").show();
        if(src === "G_SUITE"){
            if(dst === "G_SUITE"){
                _srcHtml = '<tr><td style="display: flex;width: 100%;"><input type="checkbox" id="fsnTbls"><div style="margin-top: 2px;margin-left: 5px;">Migrate FusionTables</div> </td></tr>';
                _srcHtml = _srcHtml + '<tr><td style="display: flex;width: 100%;"><input type="checkbox" id="gsteDrawings"><div style="margin-top: 2px;margin-left: 5px;">Migrate Drawings</div> </td></tr>';
            }

        }
        else if(src === "ONEDRIVE_BUSINESS_ADMIN"){
            $($ODSC).hide();
            $(".expandSourceOptionsHide").hide();
        }
        // else if(src === "BOX_BUSINESS"){
        //     _srcHtml = '<tr><td style="display: flex;width: 100%;"><input type="checkbox" id="grpFldrs"><div style="margin-top: 2px;margin-left: 5px;">Migrate Group Folders</div> </td></tr>';
        // }
        // else if(src === "DROPBOX_BUSINESS"){
        //     _srcHtml = '<tr><td style="display: flex;width: 100%;"><input type="checkbox" id="tmFldrs"><div style="margin-top: 2px;margin-left: 5px;">Migrate TeamFolders</div> </td></tr>';
        // }
        $(".expandSourceOptionsHide table tbody").append(_srcHtml);
        if((src == "EGNYTE_ADMIN" && dst == "ONEDRIVE_BUSINESS_ADMIN") || (src == "EGNYTE_ADMIN" && dst == "SHAREPOINT_ONLINE_BUSINESS") ||(src == "GOOGLE_SHARED_DRIVES" && dst == "SHAREPOINT_ONLINE_BUSINESS") || (src == "GOOGLE_SHARED_DRIVES" && dst == "SHAREPOINT_ONLINE_HYBRID")) {
            $(".expandSourceOptionsHide").hide();
            $($ODSC).show();
            $(".expandDsteOptionsHide").hide();

        }
		
        if((src == "G_SUITE" && dst == "ONEDRIVE_BUSINESS_ADMIN") || (src == "BOX_BUSINESS" && dst == "DROPBOX_BUSINESS") || (src == "G_SUITE" && dst == "DROPBOX_BUSINESS")|| (src == "BOX_BUSINESS" && dst == "SHAREPOINT_ONLINE_HYBRID") || (src == "G_SUITE" && dst == "BOX_BUSINESS")  || (src == "BOX_BUSINESS" && dst == "ONEDRIVE_BUSINESS_ADMIN_HYBRID") || (src == "BOX_BUSINESS" && dst == "GOOGLE_SHARED_DRIVES")) {
            $(".expandSourceOptionsHide").hide();//|| (src == "DROPBOX_BUSINESS" && dst == "G_SUITE")
        }
        if((src == "DROPBOX_BUSINESS" && dst == "AMAZON")||(src == "BOX_BUSINESS" && dst == "G_SUITE")){
            $($ODSC).hide();
            $(".expandSourceOptionsHide").hide();
        }
		if((src == "DROPBOX_BUSINESS" && dst == "GOOGLE_SHARED_DRIVES")||(src == "SHAREFILE_BUSINESS" && dst == "SHAREPOINT_ONLINE_BUSINESS")|| (src == "DROPBOX_BUSINESS" && dst == "SHAREPOINT_ONLINE_BUSINESS")) {
            //$($ODSC).hide(); 
            $(".expandSourceOptionsHide").hide();
          $(".expandDsteOptionsHide").hide();
        }
		if((src == "BOX_BUSINESS" && dst == "DROPBOX_BUSINESS")||(src == "DROPBOX_BUSINESS" && dst == "SHAREPOINT_ONLINE_BUSINESS")||(src == "GOOGLE_SHARED_DRIVES" && dst == "SHAREPOINT_ONLINE_BUSINESS")||(src == "DROPBOX_BUSINESS" && dst == "ONEDRIVE_BUSINESS_ADMIN")||(src == "BOX_BUSINESS" && dst == "ONEDRIVE_BUSINESS_ADMIN") || (src == "BOX_BUSINESS" && dst == "SHAREPOINT_ONLINE_BUSINESS")|| (src == "BOX_BUSINESS" && dst == "GOOGLE_SHARED_DRIVES")|| (src == "BOX_BUSINESS" && dst == "G_SUITE")||(src == "DROPBOX_BUSINESS" && dst == "G_SUITE")||(src == "SHAREFILE_BUSINESS" && dst == "G_SUITE")||(src == "SHAREFILE_BUSINESS" && dst == "GOOGLE_SHARED_DRIVES")){
		$($ODSC).hide(); 
		$($ODST).hide(); 
            $(".expandSourceOptionsHide").hide();
          $(".expandDsteOptionsHide").hide();
		}
		if(src == "DROPBOX_BUSINESS" && dst == "BOX_BUSINESS"){
            $(".expandSourceOptionsHide").hide();
		}
	if((src == "EGNYTE_ADMIN" && dst == "G_SUITE")||(src == "EGNYTE_ADMIN" && dst == "GOOGLE_SHARED_DRIVES")||(src == "DROPBOX_BUSINESS" && dst == "GOOGLE_SHARED_DRIVES")){//||(src == "DROPBOX_BUSINESS" && dst == "G_SUITE")
	  $(".expandSourceOptionsHide").hide(); 
          $(".expandDsteOptionsHide").hide();
		$($ODSC).hide();
		$($ODST).hide();
		$(".migrateSharedLinks").css("display","");
	}
	else{
	$(".migrateSharedLinks").css("display","none");
	}
	
        // $(".expandSourceOptionsHide").css("display","none");
        // $(".expandDsteOptionsHide").css("display","none");
        /*    if(src == "NETWORK_FILESHARES" && dst == "ONEDRIVE_BUSINESS_ADMIN") {
                $(".expandDsteOptionsHide").hide();
               // $(".expndSrcCldName").hide();
                $(".destinationPath").css("display","none");
               // $(".expndDstCldName").parent().parent().hide();// hiding tr of the div

                // $("#jobType_dropDown option[id='delta']").remove();
                $("#jobType_dropDown option[id='onewaySync']").remove();
                $("#jobType_dropDown option[id='twowaySync']").remove();
            } */
    },
    appendUserPairs:function () {
        //var _userData = JSON.parse(localStorage.getItem("selectedMappings"));
        var _html = '<tr><td><img src="../img/PNG/ONEDRIVE_BUSINESS_ADMIN.png" alt="pic" class="forImage">Melvin@cloudfuze.co</td><td><img src="../img/PNG/ONEDRIVE_BUSINESS_ADMIN.png" alt="pic" class="forImage">Tania@cloudfuze.co</td></tr>';
        //<td style="width: 26%"><div class="arrowHeader"><div></div><a class="line-arrow square right"></a></div></td>

        for(var i=0;i<10;i++)
            $("#appendSelectedPairs").append(_html);
    }
}

var migrationMapping = {
    getDomainsList: function (srcAdminId, dstAdminId, pageNumber, pageSize, target) {
        //if($("#CFShowLoading").attr("autoMap") == "false")

        var _cld,_cldId;
        if (pageNumber == undefined)
            pageNumber = 1;
        if (pageSize == undefined)
            pageSize = 10;
        if (target == 'source'){
            _cld = 'sourceCloudId';
            _cldId = srcAdminId;
        }
        else{
            _cld = 'destCloudId';
            _cldId = dstAdminId;
        }

        $("#CFShowLoading").modal("show");
        $.ajax({
            type: "GET",
            url: apicallurl + "/mapping/user/domain/list/" + _cld + "?srcCloudId=" + srcAdminId + "&destCloudId=" + dstAdminId + "&pageNo=" + pageNumber + "&pageSize=" + pageSize,
            //async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                if(data.length !== 0 && data[0].cloudDetail.length !== 0){
                    if(target === 'source')
                        sessionStorage.setItem('source',data[0].cloudDetail[0].name);
                    else
                        sessionStorage.setItem('destination',data[0].cloudDetail[0].name);
                }
                if(data.length !== 0 && data[0].cloudDetail.length === 0) {
                    setTimeout(function () {
                        if($("#CFShowLoading").attr("autoMap") === "false")
                            $("#CFShowLoading").modal("hide");
                    }, 2000);
                }
                migrationMapping.appendDomains(data, pageSize, target,'',pageNumber);
                //migrationMapping.appendSlctdCloudImg( _cldId ,target);
                var srcName = sessionStorage.getItem('source');
                var dstnName = sessionStorage.getItem('destination');
                if(srcName !== null && dstnName !== null)
                    setTimeout(function () {
                        if($("#CFShowLoading").attr("autoMap") === "false")
                            $("#CFShowLoading").modal("hide");
                        if(localStorage.getItem("multiUsrSrcCldName") === "DROPBOX_BUSINESS" && localStorage.getItem("multiUsrDstnCldName") === "G_SUITE") {
                        if (localStorage.getItem("teamMigrationMappingPopUp") == "yes") {
                            $("#CFTeamFolderMappingPopUp").modal("show");
                        }
                    }
                    }, 2000);
            }
        });


    },
    getSearchUser: function (srcAdminId, dstAdminId, pageNumber, pageSize, target, searchUser) {
        if (!searchUser.length) {
            migrationMapping.getDomainsList(srcAdminId, dstAdminId, pageNumber, pageSize, target);
            return false;
        }
        var _cld;
        if (pageNumber == undefined)
            pageNumber = 1;

        if (pageSize == undefined)
            pageSize = 10;

        if (target == 'source')
            _cld = 'sourceCloudId';
        else
            _cld = 'destCloudId';

        $("#CFShowLoading").modal("show");
        $.ajax({
            type: "GET", 
            url: apicallurl + "/mapping/user/searchUsers/list/" + _cld + "?srcCloudId=" + srcAdminId + "&destCloudId=" + dstAdminId + "&searchCloudUser=" + searchUser + "&pageNo=" + pageNumber + "&pageSize=" + pageSize,
            //async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (response) {
                var _dataLength = response.length;
                if(_dataLength === 0){
                    migrationMapping.getDomainsList(srcAdminId, dstAdminId, pageNumber, pageSize, target);
                    alertError("No Results Found");
                    return false;
                }
                else{
                    var _cldEmails= [];
                    for(var i=0; i<_dataLength;i++){
                        var _cldDetailsLength = response[i].cloudDetail.length;
                        for(var j=0; j<_cldDetailsLength;j++){
                            _cldEmails.push(response[i].cloudDetail[j].emailId);

                        }
                    }


                    migrationMapping.appendDomains(response, pageSize, target, 'searchAppend',pageNumber);

                }
                setTimeout(function () {
                    $("#CFShowLoading").modal("hide");
                }, 2000);
            }
        });


    },
    getPgntdUsrsData: function (domain, srcAdminId, dstAdminId, pageNo, pageSize, target, usrsRmv,keyword) {
        var searchData = JSON.parse(localStorage.getItem("searchData"));
        keyword = "";
        if (target == 'source'){
            _cld = 'sourceCloudId';
            if(searchData.source) {
                keyword = $("#srcUsrs .custom-search-input input").val().trim();
            }
        }
        else{
            _cld = 'destCloudId';
            if(searchData.destination) {
                keyword = $("#dstnUsrs .custom-search-input input").val().trim();
            }
        }
        $.ajax({
            type: "GET",
            url: apicallurl + "/mapping/user/users/list/" + _cld + "?srcAdminCloudId=" + srcAdminId + "&destAdminCloudId=" + dstAdminId + "&domainName=" + encodeURIComponent(domain) + "&pageNo=" + pageNo + "&pageSize=" + pageSize + "&searchUser=" +keyword,
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (domainData) {
                var _usrAppend = '<div class="fldr_parent" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px"><p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><span class="fa fa-plus usr-folder" useremail="emailId" folder-id="root" user-id="cldId" cloudname="cloudName" aria-hidden="true" style="cursor:pointer;"></span><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span style="font-size: initial">&nbsp;&nbsp;userName</span></p></div>';
                var _srcCldName = localStorage.getItem('multiUsrSrcCldName');
                var _dstnCldName = localStorage.getItem('multiUsrDstnCldName');
                var _usrsLength = domainData.cloudDetail.length;
                var _usrDataAppend = '';
                var _usrData = '';
                for (var j = 0; j < _usrsLength; j++) {
                    if((_srcCldName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnCldName === "DROPBOX_BUSINESS") || (_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "ONEDRIVE_BUSINESS_ADMIN")||(_srcCldName === "GOOGLE_SHARED_DRIVES" && _dstnCldName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "GOOGLE_SHARED_DRIVES")){
                        if (target == "source"){
                            if (_srcCldName === "ONEDRIVE_BUSINESS_ADMIN" && domainData.cloudDetail[j].rootFolderId === "/") {
                                _usrAppend = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                    'px solid #f2f2f2;padding: 5px 0px" title="User authentication failed"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder11" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="color: #ddd;cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="checkbox"  name="srccheckBox"  class="sourceChkBox" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" disabled></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                    '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';

                            } else {
                                var _obj ={
                                    "id":domainData.cloudDetail[j].rootFolderId,
                                    "cloudId":domainData.cloudDetail[j].id,
                                };
                                if(fldrStorage(_obj,'check1')){
                                    var input = '<input type="checkbox"   name="srccheckBox" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" checked="checked">';
                                }
                                else{
                                    var input =  '<input type="checkbox"   name="srccheckBox" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName">';
                                }

                                _usrAppend = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                    'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;">'+input+'</div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                    '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span></div>';

                            }
                        }
                        else if (target == "destination"){
                            if (_dstnCldName === "ONEDRIVE_BUSINESS_ADMIN" && domainData.cloudDetail[j].rootFolderId === "/") {
                                _usrAppend = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                    'px solid #f2f2f2;padding: 5px 0px" title="User authentication failed"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder11" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="color: #ddd;cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio"  class="dstnRadioBtn" name="folderradiobtn" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" disabled></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                    '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';
                            } 
			else if(_srcCldName === "GOOGLE_SHARED_DRIVES" && _dstnCldName === "SHAREPOINT_ONLINE_BUSINESS") {
			 _usrAppend = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                    'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio" name="folderradiobtn" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" style="display:none;" disabled="disabled"></div><div style="margin-left: 11%;margin-top: -7%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                    '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span></div>';
			}else if(_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "GOOGLE_SHARED_DRIVES") {
                                _usrAppend = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                    'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio" name="folderradiobtn" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" style="display:none;" disabled="disabled"></div><div style="margin-left: 11%;margin-top: -7%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                    '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span></div>';
                            }
			else {
                                _usrAppend = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                    'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio" name="folderradiobtn" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                    '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span></div>';

                            }
                        }

                    }
					else if(_srcCldName === "EGNYTE_ADMIN" && _dstnCldName === "G_SUITE"){
						if(domainData.cloudDetail[j].standardUser === true){
                        _usrAppend = '<div class="" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title="Standard users data cannot be migrated"> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
						}
						else{
							 _usrAppend = '<div class="" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px"> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="false" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
						}
                    }
					else if(_srcCldName === "EGNYTE_ADMIN" && _dstnCldName === "GOOGLE_SHARED_DRIVES"){
					_usrAppend = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
					else if(_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "AMAZON"){
					_usrAppend = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
					else if(_srcCldName === "SHAREFILE_BUSINESS" && _dstnCldName === "SHAREPOINT_ONLINE_BUSINESS"){
					_usrAppend = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
					else if(_srcCldName === "SHAREFILE_BUSINESS" && _dstnCldName === "GOOGLE_SHARED_DRIVES"){
					_usrAppend = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
                    else{

                        _usrAppend = '<div class="" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px"> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="false" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
                    }


                    _usrDataAppend = _usrAppend;
					if(target != "source" && _dstnCldName === "AMAZON"){
					   var _emailVal = domainData.cloudDetail[j].cloudUserId.split("|")[2];
					}
					else{
                    var _emailVal = domainData.cloudDetail[j].cloudUserId.split("|")[1].split("@")[0];
                    }
					if(_emailVal.length>=25){
                        _emailVal = CFManageCloudAccountsAjaxCall.getMaxChars(_emailVal, 23);
                    }
                    else{
                        _emailVal;
                    }
                    _usrDataAppend = _usrDataAppend.replace("userName", _emailVal).replace("emailId", domainData.cloudDetail[j].cloudUserId.split("|")[1]).replace("cldId", domainData.cloudDetail[j].id).replace("root", domainData.cloudDetail[j].rootFolderId).replace("cloudName", domainData.cloudDetail[j].name);
                    _usrDataAppend = _usrDataAppend.replace("emailId", domainData.cloudDetail[j].cloudUserId.split("|")[1]).replace("cldId", domainData.cloudDetail[j].id).replace("root", domainData.cloudDetail[j].rootFolderId).replace("cloudName", domainData.cloudDetail[j].name);

                    if (domainData.cloudDetail[j].flag){
                        _usrDataAppend = _usrDataAppend.replace('<div class=""', '<div class="selectedClass"').replace('input type="radio" name="srcUsers" disabled="false"', 'input type="radio" name="srcUsers" disabled="disabled"');
                        _usrDataAppend = _usrDataAppend.replace("emailId", domainData.cloudDetail[j].cloudUserId.split("|")[1]).replace("cldId", domainData.cloudDetail[j].id).replace("root", domainData.cloudDetail[j].rootFolderId).replace("cloudName", domainData.cloudDetail[j].name);

                    }
                    else
                        _usrDataAppend = _usrDataAppend.replace('input type="radio" name="srcUsers" disabled="false"', 'input type="radio" name="srcUsers"');

                    if (target != 'source')
                        _usrDataAppend = _usrDataAppend.replace('type="radio" name="srcUsers"', 'type="radio" name="dstUsers"');

                    _usrData = _usrData + _usrDataAppend;
                }
                // var _usrsRmv= usrsRmv.split("#")[1].split(" ")[0];
                // usrsRmv = $(document.getElementById(_usrsRmv).getElementsByClassName(domain));
                // usrsRmv = $(usrsRmv[1]);

                $(usrsRmv).find("div").each(function () {
                    if ($(this).hasClass("pagination"))
                        return false;
                    else
                        $(this).remove();
                });
                $(usrsRmv).find(".pagination.p1").before(_usrData);
                var _num = $(usrsRmv).find(".pagination.p1 span").last().text().match(/\d+$/)[0];
                $(usrsRmv).find(".pagination.p1 span").last().text( pageNo + " of " + _num);
                $(usrsRmv).find(".pagination.p1 input").val(pageNo);
                $(usrsRmv).css("display","block");
                $(usrsRmv).siblings(".forDomainName").css("display","none");


            }
        });
    },
    appendDomains: function (domainListData, pageSize, appendTarget, check,pageNumber) {
        if(pageNumber == undefined)
            pageNumber = 1;

        var _domainLength = domainListData.length;
        if(_domainLength === 0){
            if(appendTarget === 'source'){
                $("#srcUsrs .paginationCF input.input-sm").val(0);
                $("#srcUsrs .paginationCF span").last().text("0 of 0");
                $("#srcUsrs .paginationDiv").addClass("disabled").css("opacity","0.6");
                $("#srcCloudUsers .message-widget").html('');
                $('#srcUsrs .paginationDiv select').prop('disabled', true);
                $('#srcUsrs .paginationDiv input').prop('disabled', true);

            }
            else{
                $("#dstnUsrs .paginationCF input.input-sm").val(0);
                $("#dstnUsrs .paginationCF span").last().text("0 of 0");
                $("#dstnUsrs .paginationDiv").addClass("disabled").css("opacity","0.6");
                $("#dstCloudsUsers .message-widget").html('');
                $('#dstnUsrs .paginationDiv select').prop('disabled', true);
                $('#dstnUsrs .paginationDiv input').prop('disabled', true);
            }
            return false;
        }
        else{
            if (appendTarget === 'source') {
                $("#srcUsrs .paginationDiv").removeClass("disabled").css("opacity", "1");
                $('#srcUsrs .paginationDiv select').prop('disabled', false);
                $('#srcUsrs .paginationDiv input').prop('disabled', false);
            } else {
                $("#dstnUsrs .paginationDiv").removeClass("disabled").css("opacity", "1");
                $('#dstnUsrs .paginationDiv select').prop('disabled', false);
                $('#dstnUsrs .paginationDiv input').prop('disabled', false);
            }

        }

        if (domainListData.length != 0)
            _domainLength = domainListData[0].noOfDomainsPresent;
        var _className;
        if(appendTarget == "source")
            _className = $("#srcUsrs .forDomainNameMin:visible").attr("class");
        else
            _className = $("#dstnUsrs .forDomainNameMin:visible").attr("class");

        var _pgCnt = Math.ceil(_domainLength / pageSize),
            _HTML = '<div class="className"> <div><div class="forDomainName DomainNameAttr" style="display: block"><i class="fa fa-plus" aria-hidden="true" style="padding: 12px;cursor: pointer"></i><span style="font-size: initial;">domainName</span></div>';
        if (check === 'searchAppend') {
            _domainLength = domainListData.length;
            _pgCnt = Math.ceil(_domainLength / pageSize);
        }

        var _valDomain, _len = 0;
        //var _txt = ((pageSize -1) * parseInt($("#srcUsrs select").val()) + 1)  + " of " + _domainLength
        var _size = 0;
        if (domainListData.length != 0)
            _size  = Math.ceil(domainListData[0].noOfDomainsPresent/$("#srcUsrs select").val());

        var _txt = pageNumber + " of " + _size;
        if (appendTarget == "source") {
            
            $("#srcUsrs .paginationCF input.input-sm").val(pageNumber);
            $("#srcUsrs .paginationCF span").last().text(  _txt );
            _len = $("#srcUsrs .custom-search-input input").val().length;
            _valDomain = $("#srcCloudUsers  .forDomainNameMin:visible .fa-minus").next().text();
            $("#srcCloudUsers .message-widget").html('');
            if(_domainLength <10 || _domainLength == 10){
                $("#srcUsrs .paginationDiv").addClass("disabled").css("opacity","0.6");
                $('#srcUsrs .paginationDiv select').prop('disabled', true);
                $('#srcUsrs .paginationDiv input').prop('disabled', true);
            }
        }
        else {
             $("#dstnUsrs .paginationCF input.input-sm").val(pageNumber);
           var _size  = Math.ceil(domainListData[0].noOfDomainsPresent/$("#dstnUsrs select").val());
            var _txt = pageNumber + " of " + _size;
            $("#dstnUsrs .paginationCF span").last().text( _txt );
            _len = $("#dstnUsrs .custom-search-input input").val().length;
            _valDomain = $("#dstCloudsUsers  .forDomainNameMin:visible .fa-minus").next().text();
            $("#dstCloudsUsers .message-widget").html('');
            if(_domainLength <10 || _domainLength == 10){
                $("#dstnUsrs .paginationDiv").addClass("disabled").css("opacity", "0.6");
                $('#dstnUsrs .paginationDiv select').prop('disabled', true);
                $('#dstnUsrs .paginationDiv input').prop('disabled', true);
            }
        }


        for (var i = 0; i < domainListData.length; i++) {//_domainLength
            var domainData = domainListData[i], _html = _HTML;
            console.log(domainData);
            var _pgntn = '<div class=paginationDiv><div class=paginationCF style=display:flex><div style=width:175px><span style="padding:4px;margin-top: 4%;">Go to:</span> <input class="form-control input-sm" value="1" style="margin-top: 7%;"> <span style="margin-top:7%;">1 of ' + Math.ceil(domainData.noOfCloudsPreesent/10) + '</span></div><i class="fa fa-chevron-left" style="font-size: 12px!important;margin-top:5%;"></i> <i class="fa fa-chevron-right" style="font-size: 12px!important;margin-top:5%;"></i></div></div>';
            _html = _html.replace("domainTitle",domainData.domainName).replace("domainName", CFManageCloudAccountsAjaxCall.getMaxChars(domainData.domainName,23)).replace("DomainNameAttr", domainData.domainName);
            _html = _html + '<div class="forDomainNameMin DomainNameAttr" style="display: none"><i class="fa fa-minus" aria-hidden="true" style="padding: 12px;cursor: pointer"></i><span style="font-size: initial;" title="domainTitle">domainName</span> usersList<div class="pagination p1" style="padding: 0;margin: 0;border-top: 1px solid #ccc;border-radius: 0;width: 100%;margin-top: 5%;">' + _pgntn + '</div></div></div></div>';
            _html = _html.replace("domainTitle",domainData.domainName).replace("domainName", CFManageCloudAccountsAjaxCall.getMaxChars(domainData.domainName,23)).replace("DomainNameAttr", domainData.domainName);
            var _usrAppend1;
            var _usrsLength = domainData.cloudDetail.length;
            var _usrDataAppend = '';
            var _srcCldName = localStorage.getItem('multiUsrSrcCldName');
            var _dstnCldName = localStorage.getItem('multiUsrDstnCldName');

            if (appendTarget == "source" && _len &&   check === 'searchAppend')
                _html = _html.replace('class="' + "forDomainName " + domainData.domainName + '" style="display: block"', 'class="' + "forDomainName " + domainData.domainName + '" style="display: none"').replace('<div class="' + "forDomainNameMin " + domainData.domainName + '" style="display: none">', '<div class="' + "forDomainNameMin " + domainData.domainName + '" style="display: block">');

            else if (_len && check === 'searchAppend')
                _html = _html.replace('class="' + "forDomainName " + domainData.domainName + '" style="display: block"', 'class="' + "forDomainName " + domainData.domainName + '" style="display: none"').replace('<div class="' + "forDomainNameMin " + domainData.domainName + '" style="display: none">', '<div class="' + "forDomainNameMin " + domainData.domainName + '" style="display: block">');

            for (var j = 0; j < _usrsLength; j++) {
                if ((_srcCldName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnCldName === "DROPBOX_BUSINESS") || (_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "ONEDRIVE_BUSINESS_ADMIN")||(_srcCldName === "GOOGLE_SHARED_DRIVES" && _dstnCldName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "GOOGLE_SHARED_DRIVES")) {
                    if (appendTarget == "source") {
                        if (_srcCldName === "ONEDRIVE_BUSINESS_ADMIN" && domainData.cloudDetail[j].rootFolderId === "/") {
                            _usrAppend1 = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                'px solid #f2f2f2;padding: 5px 0px" title="User authentication failed"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder11" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="color: #ddd;cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="checkbox"  name="srccheckBox"  class="sourceChkBox" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" disabled></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';

                        } else {
                            _usrAppend1 = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="checkbox"  name="srccheckBox"  class="sourceChkBox" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>\n' +
                                '</div></p> <span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span></div>';
                        }
                    } else if (appendTarget == "destination") {
                        if (_dstnCldName === "ONEDRIVE_BUSINESS_ADMIN" && domainData.cloudDetail[j].rootFolderId === "/") {
                            _usrAppend1 = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                'px solid #f2f2f2;padding: 5px 0px" title="User authentication failed"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder11" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="color: #ddd;cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio"  class="dstnRadioBtn" name="folderradiobtn" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" disabled></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';
                        }
			else if (_srcCldName === "GOOGLE_SHARED_DRIVES" && _dstnCldName === "SHAREPOINT_ONLINE_BUSINESS"){
                            _usrAppend1 = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio"  class="dstnRadioBtn" name="folderradiobtn" disabled="disabled" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" style="display:none;"></div><div style="margin-left: 11%;margin-top: -7%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';

            } else if (_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "GOOGLE_SHARED_DRIVES"){
                            _usrAppend1 = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio"  class="dstnRadioBtn" name="folderradiobtn" disabled="disabled" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName" style="display:none;"></div><div style="margin-left: 11%;margin-top: -7%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';

                        }
			 else {
                            _usrAppend1 = '<div class="fldr_parent" pgno="1" style="border-bottom: 1' +
                                'px solid #f2f2f2;padding: 5px 0px"> <p class="usr-data" style="padding: 5px 0px 5px 35px;margin-bottom:0;"><i class="fa fa-angle-down usr-folder" folder-id="root" cloudname="cloudName" user-id="cldId" useremail="emailId" aria-hidden="true" style="cursor:pointer;font-size: 24px!important;padding-bottom: 2%;margin-left: -13%;"></i><div style="margin-left: 31px;margin-top: -13%;"><input type="radio"  class="dstnRadioBtn" name="folderradiobtn" folderPath="/" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"></div><div style="margin-left: 19%;margin-top: -11%;"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: large;margin-right: -3px;cursor:default;pointer-events: none;margin-left:10px;"></i><span id="textSpan1" style="font-size:initial;" title="'+domainData.cloudDetail[j].emailId+'">&nbsp;&nbsp;userName</span>' +
                                '</div></p><span id="folderLoading" style="position: absolute;left: 10%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" >Loading...</span> </div>';

                        }
                    }

                }
				else if(_srcCldName === "EGNYTE_ADMIN" && _dstnCldName === "G_SUITE"){
						if(domainData.cloudDetail[j].standardUser === true){
                        _usrAppend1 = '<div class="" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title="Standard users data cannot be migrated"> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
						}
						else{
							 _usrAppend1 = '<div class="" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px"> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="false" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
						}
                    }
					else if(_srcCldName === "EGNYTE_ADMIN" && _dstnCldName === "GOOGLE_SHARED_DRIVES"){
					_usrAppend1 = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
					else if(_srcCldName === "DROPBOX_BUSINESS" && _dstnCldName === "AMAZON"){
					_usrAppend1 = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
					else if(_srcCldName === "SHAREFILE_BUSINESS" && _dstnCldName === "SHAREPOINT_ONLINE_BUSINESS"){
					_usrAppend1 = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
					else if(_srcCldName === "SHAREFILE_BUSINESS" && _dstnCldName === "GOOGLE_SHARED_DRIVES"){
					_usrAppend1 = '<div class="selectedClass" style="border-bottom: 1px solid #f2f2f2;padding: 5px 0px" title=""> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="true" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="fa fa-user" aria-hidden="true" style="font-size: large;margin-left: 2%;"></i>&nbsp;&nbsp;userName</span> </div>';
					}
                else{
                    _usrAppend1= '<div class="" style="border-bottom: 1' +
                        'px solid #f2f2f2;padding: 5px 0px"> <span style="font-size: initial"><input type="radio" name="srcUsers" disabled="false" style="margin-left: 11%;margin-bottom: 2%" usremail="emailId" cloudId="cldId" rtfolId="root" cldName="cloudName"><i class="lnil lnil-user-alt" aria-hidden="true" style="font-size: 12px;margin-left: 2%;vertical-align: middle;font-weight: bold;"></i>&nbsp;&nbsp;userName</span> </div>';
                    ;
                }


                var _usrAppend = _usrAppend1;
				if(appendTarget != "source" && _dstnCldName === "AMAZON"){
					   var _emailVal = domainData.cloudDetail[j].cloudUserId.split("|")[2];
					}
					else{
                    var _emailVal = domainData.cloudDetail[j].cloudUserId.split("|")[1].split("@")[0];
                    }
                if(_emailVal.length>=25){
                    _emailVal = CFManageCloudAccountsAjaxCall.getMaxChars(_emailVal, 23);
                }
                else{
                    _emailVal;
                }
                _usrAppend = _usrAppend.replace("userName", _emailVal).replace("emailId", domainData.cloudDetail[j].cloudUserId.split("|")[1]).replace("cldId", domainData.cloudDetail[j].id).replace("root", domainData.cloudDetail[j].rootFolderId).replace("cloudName", domainData.cloudDetail[j].name);
                _usrAppend = _usrAppend.replace("emailId", domainData.cloudDetail[j].cloudUserId.split("|")[1]).replace("cldId", domainData.cloudDetail[j].id).replace("root", domainData.cloudDetail[j].rootFolderId).replace("cloudName", domainData.cloudDetail[j].name);


                if (domainData.cloudDetail[j].flag)
                    _usrAppend = _usrAppend.replace('<div class=""', '<div class="selectedClass"').replace('input type="radio" name="srcUsers" disabled="false"', 'input type="radio" name="srcUsers" disabled="disabled"');
                else
                    _usrAppend = _usrAppend.replace('input type="radio" name="srcUsers" disabled="false"', 'input type="radio" name="srcUsers"');


                if (appendTarget != "source")
                    _usrAppend = _usrAppend.replace("className", "dstCloudsUsers").replace("srcUsers", "dstUsers");
                else
                    _usrAppend = _usrAppend.replace("className", "srcCloudUsers");

                _usrDataAppend = _usrDataAppend + _usrAppend;
            }
            _html = _html.replace("usersList", _usrDataAppend);


            if (appendTarget == "source"){
                $("#srcCloudUsers .message-widget").append(_html);
            }

            else if (appendTarget == "destination"){
                $("#dstCloudsUsers .message-widget").append(_html);
            }

            migrationMapping.apndUsrPagination(domainData.noOfCloudsPreesent, appendTarget, i);
        }
        if(_className != undefined && _className.length){
            _className = _className.split("forDomainNameMin ")[1];
            if (appendTarget == "source"){
                //var _parent = $(document.getElementById("srcUsrs").getElementsByClassName(_className));
                $(".ui-autocomplete").css("display","none");
                // $(_parent[1]).css("display","block");
                // $(_parent[0]).css("display","none");
                // $("#srcCloudUsers .forDomainNameMin." + _className).css("display","block");
                // $("#srcCloudUsers .forDomainName." + _className).css("display","none");
            }

            else if (appendTarget == "destination"){
                // $("#dstCloudsUsers .forDomainNameMin." + _className).css("display","block");
                // $("#dstCloudsUsers .forDomainName." + _className).css("display","none");
                //var _parent = $(document.getElementById("dstUsrs").getElementsByClassName(_className));
                $(".ui-autocomplete").css("display","none");
                //$(_parent[1]).css("display","block");
                //$(_parent[0]).css("display","none");

            }
        }

    },
    apndUsrPagination: function (usrsCount, target, i) {
        var $sel;
        if (target == "source")
            $sel = "#srcCloudUsers .appendUsrPagination:eq(" + i + ")";
        else
            $sel = "#dstCloudsUsers .appendUsrPagination:eq(" + i + ")";

        // $($sel).twbsPagination({
        //     totalPages: Math.ceil(usrsCount / 10),
        //     visiblePages: 3,
        //     next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
        //     prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
        //     first: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
        //     last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
        //     onPageClick: function (event, page) {
        //         var $rmvUsrs, _domain;
        //         if (target == "source") {
        //             //$rmvUsrs = "#srcCloudUsers .forDomainNameMin:eq(" + i + ")";
        //             $rmvUsrs = "#srcCloudUsers .forDomainNameMin[class*='" + _class +"']";
        //             //_domain = $(".forDomainNameMin:eq(" + i + ") i").next("span").text();
        //             _domain = $("#srcUsrs .forDomainNameMin:eq(" + i + ")").attr('class').split(" ")[1];
        //         }
        //         else {
        //             //$rmvUsrs = "#dstCloudsUsers .forDomainNameMin:eq(" + i + ")";
        //             $rmvUsrs = "#dstCloudsUsers .forDomainNameMin[class*='" + _class +"']";
        //             //_domain = $(".forDomainNameMin:eq(" + i + ") i").next("span").text();
        //             _domain = $("#dstnUsrs .forDomainNameMin:eq(" + i + ")").attr('class').split(" ")[1];
        //         }
        //         migrationMapping.getPgntdUsrsData(_domain, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), page, 10, target, $rmvUsrs);
        //     }
        // });
    },
    appendMapping: function (pageNo,srccldname,dstncldname) {
        if(pageNo == 0)
            pageNo = 1;

        var _val = $("#mapdUsrs .paginationDiv select").val(), _rtn = pageNo;
        var pageSize =  _val;


        $.ajax({
            type: "GET",
            url: apicallurl + "/mapping/user/cache/list?sourceCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destCloudId=" + localStorage.getItem("multiUsrDstnCldId") + "&pageNo=" + pageNo + "&pageSize="+pageSize,
            async: false,
            headers: {
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            },
            success: function (data) {
                $("#mapdUsers tbody").html('');
                $("#chkInput").removeAttr("checked");
                var _len = data.length;
                if (_len == 0 && pageNo == 1) {
                    var _txt = "0 of 0";
                    $("#mapdUsrs .paginationDiv").css("opacity", "0.6");
                    $('#mapdUsrs .paginationDiv select').prop('disabled', true);
                    $('#mapdUsrs .paginationDiv input').prop('disabled', true);

                    $("#mapdUsrs .paginationCF input").val(0);
                    $("#mapdUsrs .paginationCF span").last().text(_txt);
                }
                if (_len == 0) {
                    $(document).find("#chkInput").attr("disabled", true).prop("checked", false);
                    if (pageNo != 1)
                        $("#CFShowLoading").modal("hide");
                    $('.download').css('pointer-events', 'none');
                    $('.download').css('opacity', '0.5');
                    $('#help').css('visibility', 'hidden');
                    $('#csvFileUpload').removeClass('onlyCsv');
                    $("#clearBtn").css("pointer-events", 'none');
                    $("#clearBtn").css("cursor", "not-allowed");
                    $("#clearBtn").css("opacity", "0.6");
                    return false;
                }
                for (var i = 0; i < _len; i++) {
                    var _dataVal = data[i];
                    var csvID = _dataVal.csvId;
                    var csvName = _dataVal.csvName;
                    var _teamFldr = _dataVal.teamFolder;
                    var migrateDstnFolderName = _dataVal.migrateFolderName;
                    var _srcUsrDetails = {
                        "userEmail": _dataVal.sourceCloudDetails.emailId,
                        "userCloudName": _dataVal.sourceCloudDetails.name,
                        "userCloudId": _dataVal.sourceCloudDetails.id,
                        "userRtFolId": _dataVal.sourceCloudDetails.rootFolderId,
                        "folderPath": _dataVal.sourceCloudDetails.folderPath,
                        "srcPathRootFolderId": _dataVal.sourceCloudDetails.pathRootFolderId,
                        "migrateSrcFolderName": _dataVal.sourceCloudDetails.migrateFolderName

                    }
                    var _dstnUsrDetails = {
                        "dstnUserEmail": _dataVal.destCloudDetails.emailId,
                        "dstnUserCloudName": _dataVal.destCloudDetails.name,
                        "dstnUserCloudId": _dataVal.destCloudDetails.id,
                        "dstnUserRtFolId": _dataVal.destCloudDetails.rootFolderId,
                        "dstnFolderPath": _dataVal.destCloudDetails.folderPath,
                        "dstnPathRootFolderId": _dataVal.destCloudDetails.pathRootFolderId
                    }
                    if ((_srcUsrDetails.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnUsrDetails.dstnUserCloudName === "DROPBOX_BUSINESS") || (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(_srcUsrDetails.userCloudName === "GOOGLE_SHARED_DRIVES" && _dstnUsrDetails.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
                        if (_srcUsrDetails.folderPath === null && _dstnUsrDetails.dstnFolderPath === null) {
                            _srcUsrDetails.folderPath = '/';
                            _dstnUsrDetails.dstnFolderPath = '/';
                        }
                        var isFolder = true;
                        mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails, csvID,_teamFldr, csvName, migrateDstnFolderName, undefined, isFolder, '', _dataVal.duplicateCache, _dataVal.pathException);
                      

                    } else {
                        $("input[cloudid=" + _srcUsrDetails.userCloudId + "]").attr('disabled', true).parent().parent().addClass("selectedClass");
                        $("input[cloudid=" + _dstnUsrDetails.dstnUserCloudId + "]").attr('disabled', true).parent().parent().addClass("selectedClass");
                        $('.download').css('pointer-events', 'none');
                        $('.download').css('opacity', '0.5');
                        $('#help').css('visibility', 'hidden');
                        $('#csvFileUpload').removeClass('onlyCsv');
                        mapdSlectedUrs(_srcUsrDetails, _dstnUsrDetails, csvID,_teamFldr, csvName, migrateDstnFolderName);
                    }
                }
                    if ((_srcUsrDetails.userCloudName === "ONEDRIVE_BUSINESS_ADMIN" && _dstnUsrDetails.dstnUserCloudName === "DROPBOX_BUSINESS") || (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(_srcUsrDetails.userCloudName === "GOOGLE_SHARED_DRIVES" && _dstnUsrDetails.dstnUserCloudName === "SHAREPOINT_ONLINE_BUSINESS")|| (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "GOOGLE_SHARED_DRIVES")) {
  if ($('#mapdUsers input[name= "inputMapdUrs"]').length > 0) {
  if(localStorage.getItem('selectedMappings')) {
        if (!JSON.parse(localStorage.getItem('selectedMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
			    var totLen = totalLength;
                        } else {
 if(localStorage.getItem('folderMappings')) {
        if (!JSON.parse(localStorage.getItem('folderMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length;
 var totLen = totalLength;
                        }
                        if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
			  if(localStorage.getItem('FolderChecked')) {
        if (!JSON.parse(localStorage.getItem('FolderChecked')).length)
            $("#forNextMove").addClass("disabled");
    }
                            var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
 var totLen = totalLength;
                        } else {
 if(localStorage.getItem('folderMappings')) {
        if (!JSON.parse(localStorage.getItem('folderMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="folderMapngCheckBox"]').length;
			    var totLen = totalLength  - $('#mapdUsers input[name= "folderMapngCheckBox"]:disabled').length;
                        }
                        if (checkedLength == totLen) {
                            $('#chkInput').prop('checked', true);

                        } else {
                            $('#chkInput').prop('checked', false);
                        }
}
else{
  if ($('#mapdUsers input[name= "inputMapdUrs"]').length > 0) {
  if(localStorage.getItem('selectedMappings')) {
        if (!JSON.parse(localStorage.getItem('selectedMappings')).length)
            $("#forNextMove").addClass("disabled");
    }

                            var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
  if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
			  if(localStorage.getItem('FolderChecked')) {
        if (!JSON.parse(localStorage.getItem('FolderChecked')).length)
            $("#forNextMove").addClass("disabled");
    }
                            var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="folderMapngCheckBox"]:checked').length;
                            var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="folderMapngCheckBox"]').length;
                        }
    if (checkedLength == totalLength) {
                            $('#chkInput').prop('checked', true);

                        } else {
                            $('#chkInput').prop('checked', false);
                        }
}
                if (_srcUsrDetails.userCloudName === "DROPBOX_BUSINESS" && _dstnUsrDetails.dstnUserCloudName === "G_SUITE"){
                    if ($('#mapdUsers input[name= "csvMapngCheckBox"]').length > 0) {
                        var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length + $('#mapdUsers input[name="csvMapngCheckBox"]:checked').length;
                        var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length + $('#mapdUsers input[name="csvMapngCheckBox"]').length;
                    } else {
                        var checkedLength = $('#mapdUsers input[name= "inputMapdUrs"]:checked').length;
                        var totalLength = $('#mapdUsers input[name="inputMapdUrs"]').length;
                    }
                if (checkedLength == totalLength) {
                    $('#chkInput').prop('checked', true);

                } else {
                    $('#chkInput').prop('checked', false);
                }
            }
                if (pageNo == 1) {
                    $('#paginationMapng').empty();
                    $('#paginationMapng').removeData("twbs-pagination");
                    $('#paginationMapng').unbind("page");

                    $("#mapdUsrs .paginationDiv input").val(1);

                    var _selInptVal = $('#mapdUsrs select').val();
                    var _totPages = Math.ceil(data[0].noOfMappedCloudPressent / _selInptVal);

                    var _txt = pageNo + " of " + _totPages;

                    $("#mapdUsrs .paginationCF span").last().text(_txt);
                    $("#mapdUsrs .paginationCF input").val(pageNo);

                    $("#mapdUsrs .paginationCF span").last().text(_txt);
                    if ($("#mapdUsers tbody tr input[name=inputMapdUrs]:checked").length == 30) {
                        $("#chkInput").prop('checked', true);
                    }
                    setTimeout(function () {
                        if ($("#CFShowLoading").attr("autoMap") != "false")
                            $("#CFShowLoading").modal("hide");
                    }, 2000);
                }
            }
        });
    },
    appendSlctdCloudImg:function(cloudId,target){
        var _len = AllCloudsInfo.length,
            _html = '<div class="showCloud"><img alt="Cloud" src="../img/PNG/showCloudImg.png"><div>showCloudName</div></div>'
        for(var i =0; i<_len; i++){
            var _cloud = AllCloudsInfo[i];
            if( cloudId == _cloud.id){
                _html = _html.replace('showCloudImg',_cloud.cloudName).replace('showCloudName',_cloud.userDisplayName);
                if(target == 'source')
                    $("#srcCloudUsers .forShow").append(_html);
                else
                    $("#dstnUsrs .forShow").append(_html);
            }
        }
    },
    autoComplete : function (target,keyword) {
        localStorage.removeItem("teamMigrationMappingPopUp");
        var _cldEmails = [],_trgt = '#mapdUsrs';
        if(target == "mapping") {
            _cldEmails = migrationMapping.getEnrtdMpdUsrSearchList(keyword);
        }
        //_cldEmails = migrationMapping.getMpdUsrSearchList(keyword);
        else{
            _cldEmails = migrationMapping.getEntrdSearchuserList(target,keyword);
            //_cldEmails = migrationMapping.getSearchuserList(target,keyword);getEntrdSearchuserList

            if(target == 'source')
                _trgt = '#srcUsrs';
            else
                _trgt = '#dstnUsrs';
        }

        $(_trgt +" .custom-search-input input").autocomplete({
            delay: 500,
            minLength:1,
            source: function( request, response ) {
                $(_trgt +" .custom-search-input input").autocomplete( "option", "source", _cldEmails );
                response( _cldEmails );

            },// _cldEmails,
            focus: function(event, ui) {
                // prevent autocomplete from updating the textbox
                //event.preventDefault();
                $(this).val(ui.item.value);
                $('.autoCompleteScroll.ui-menu-item').each(function () {
                    if($(this).text() === ui.item.value)
                        $(this).css('background-color','#f2f2f2');
                    else
                        $(this).css('background-color','#ffffff');
                })

            },
            select: function( event,ui) {
                if(_trgt == "#srcUsrs"){
                    appendMappingScreenHtml(localStorage.getItem("multiUsrSrcCldId"),"source",1,10,ui.item.value);
                    //  $(".ui-autocomplete").css("margin-top","-33.8% !important");
                }
                else if(_trgt == "#dstnUsrs"){
                    appendMappingScreenHtml(localStorage.getItem("multiUsrDstnCldId"),"destination",1,10,ui.item.value);
                    //  $(".ui-autocomplete").css("margin-top","-34% !important");
                }
                else if(_trgt == '#mapdUsrs'){
                    autoMappingSearch(ui.item.value);
                    if(localStorage.getItem("searchData")){
                        var searchData = JSON.parse(localStorage.getItem("searchData"));
                        searchData.mapping = true;
                        localStorage.setItem("searchData",JSON.stringify(searchData));
                    }
                    //   $(".ui-autocomplete").css("margin-top","-33.8% !important");
                }
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item) {
            ul.addClass(target);
            ul.appendTo(_trgt +" .card-block");
            $(".ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content.source").css("display","none");
            $(".ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content.destination").css("display","none");
            return $("<li class='autoCompleteScroll'>" + item.label + "</li>").appendTo(ul);
        };
    },
    getSearchuserList : function (target,keyword) {
        var _cldEmails= [],_cld = "sourceCloudId";
        if(target != "source")
            _cld = "destCloudId";

        $.ajax({
            type: "GET",
            url: apicallurl + "/mapping/user/searchUsers/list/" + _cld + "?srcCloudId=" + localStorage.multiUsrSrcCldId + "&destCloudId=" + localStorage.multiUsrDstnCldId + "&searchCloudUser=" + keyword + "&pageNo=1",
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (response) {
                var _dataLength = response.length;

                for(var i=0; i<_dataLength;i++){
                    var _cldDetailsLength = response[i].cloudDetail.length;
                    for(var j=0; j<_cldDetailsLength;j++){
                        _cldEmails.push(response[i].cloudDetail[j].emailId);

                    }
                }
            }
        });
        return _cldEmails;
    },
    getEntrdSearchuserList : function (target,keyword) {
        var _cldEmails= [],_cld = "sourceCloudId";
        if(target != "source")
            _cld = "destCloudId";

        $.ajax({
            type: "GET",
            url: apicallurl + "/mapping/user/autoSearchUsers/list/" +_cld+ "?srcCloudId=" + localStorage.multiUsrSrcCldId + "&destCloudId=" + localStorage.multiUsrDstnCldId + "&searchCloudUser=" + keyword,
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (response) {
                _cldEmails = response;

            }
        });
        return _cldEmails;
    },
    getMpdUsrSearchList : function (keyword) {
        var _cldEmails= [];
        $.ajax({
            type: "GET",
            async: false,
            url: apicallurl + "/mapping/user/search/list?searchMapp=" + keyword + "&sourceCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destCloudId=" + localStorage.getItem("multiUsrDstnCldId") +"&pageNo=1",
            headers: {
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            },
            success: function (data) {
                var _len = data.length;

                for(var i=0;i<_len;i++){
                    _cldEmails.push(data[i].sourceCloudDetails.emailId);
                    _cldEmails.push(data[i].destCloudDetails.emailId);
                }
            }
        });
        return mappingOptions.uniqueArray(_cldEmails);

    },
    getEnrtdMpdUsrSearchList : function (keyword) {
        var _cldEmails= [];
        $.ajax({
            type: "GET",
            async: false,
            url: apicallurl + "/mapping/user/autoMapping/search/list?searchMapp=" + keyword + "&sourceCloudId=" + localStorage.getItem("multiUsrSrcCldId") + "&destCloudId=" + localStorage.getItem("multiUsrDstnCldId"),
            headers: {
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            },
            success: function (data) {
                _cldEmails = data;


            }
        });
        return mappingOptions.uniqueArray(_cldEmails);

    },
    sortMapping:function(trgt) {
        var _sort = localStorage.getItem("mpngSrtng"),
            _obj ={
                "sortBy": trgt,
                "orderBy":'ASC'
            };
        if(_sort != null){
            _sort = JSON.parse(_sort);
            if(_sort.orderBy == 'ASC'){
                _obj.orderBy = 'DESC';
            }
        }
        localStorage.setItem("mpngSrtng",JSON.stringify(_obj));
        if(!$('#mapdUsrs .custom-search-input input').val()){
            appendingPrevMapping();
            return false;
        }
        else{
            appendingPrevMapping();
        }


    },
    sortBy:function () {
        var _sort = localStorage.getItem("mpngSrtng"),_rtn='';

        if(_sort != null){
            _sort = JSON.parse(_sort);
            _rtn = "&sortBy=" + _sort.sortBy + "&orderBy=" + _sort.orderBy;
        }
        return _rtn;

    }
}

var pgngOptions = {
    setCldImg : function(_cldDtls){
        var $srcUsrImg = $("#srcCloudUsers .user-img .migrateImg"),$dstUsrImg = $("#dstCloudsUsers .user-img .migrateImg"),
            _rslt = $($srcUsrImg).children('.migrationImage').attr('id');
        $($srcUsrImg).children('.migrationImage').attr("id",$($srcUsrImg).children('.migrationImage').attr('id').replace(_rslt,_cldDtls.srcCldName));
        $($srcUsrImg).parent().siblings().find("h5").text(_cldDtls.srcAdminName);
        _rslt = $($dstUsrImg).children('.migrationImage').attr('id');
        $($dstUsrImg).children('.migrationImage').attr("id",$($dstUsrImg).children('.migrationImage').attr('id').replace(_rslt,_cldDtls.dstCldName));
        $($dstUsrImg).parent().siblings().find("h5").text(_cldDtls.dstAdminName);
    },
    chkNumber : function (val) {
        return !/\D/.test( val );
    }
};

//Source  Show value change

$(document).on('change','#srcUsrs select',function(){
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;
    $('#srcUsrs .paginationCF input').val(1);
    if(searchData.source){
        if($("#srcUsrs .custom-search-input input").val().length){
            migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),1, $('#srcUsrs select').val(),"source",$("#srcUsrs .custom-search-input input").val().toLowerCase().trim()); // if(searchCloudUser != undefined)
            return false;
        }
    }
    else{
        migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), 1, $(this).val(), 'source');
    }

});

$(document).find('#srcUsrs .paginationCF input:last').keypress(function(e){
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    if((!$(this).val().length) && parseInt(e.key) === 0)
        return false;

    var _chkZero = parseInt($(this).val());
    if(($(_chkZero).length == undefined) && (Number(e.key) == 0))
        return false;

    if(e.key == "Enter" && _chkZero && !$("#srcUsrs .custom-search-input input").val().length){
        migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),$(this).val() ,$('#srcUsrs select').val(), 'source');
        $(this).blur();
    }
    else if(e.key == "Enter" && _chkZero && $("#srcUsrs .custom-search-input input").val().length){
        if(searchData.source){
            migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),$(this).val(), $('#srcUsrs select').val(),"source",$("#srcUsrs .custom-search-input input").val().toLowerCase().trim()); // if(searchCloudUser != undefined)
            $(this).blur();
        }
        else {
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),$(this).val() ,$('#srcUsrs select').val(), 'source');

        }


    }

    if(pgngOptions.chkNumber(String.fromCharCode(e.which))){
        if((_chkZero *10 + Number(e.key)) == 0)
            return false;

        var _val = (Number($(this).val())) * 10 + Number(e.key);
        if(parseInt( _val) <= $('#srcUsrs .paginationCF span').text().match(/\d+$/)[0] )
            return true;
        else
            return false;
    }
    else if(e.key == "Backspace"){
        return true;
    }
    else
        return false;
});


//Mapping-users  Show value change

$(document).on('change','#mapdUsrs select',function(){

    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if(searchData.mapping){
        autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim(),1);
    }
    else{
        if(csvMappings === true){
            UpdateCsvPath(1,parseInt($(this).val()));
        }
        else
            appendingPrevMapping(1,parseInt($(this).val()));
    }
    $('#mapdUsrs .paginationCF input').val(1);
    // if(!$("#mapdUsrs .custom-search-input input").val().length){
    //     autoMappingSearch($("#mapdUsrs .custom-search-input input").val(),1);
    // }
    // //return false;
    // else
    //     appendingPrevMapping(1,parseInt($(this).val()));
    //
    // $('#mapdUsrs .paginationCF input').val(1);
    // appendingPrevMapping(1,parseInt($(this).val()));
});

//Mapping Pagination

$(document).find('#mapdUsrs .paginationCF input').keypress(function(e){
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if((!$(this).val().length) && parseInt(e.key) === 0)
        return false;

    var _chkZero = Number($('#mapdUsrs .paginationCF input').val());
    if((_chkZero == 0) && (Number(e.key) == 0))
        return false;

    if(e.key == "Enter" && _chkZero && !$("#mapdUsrs .custom-search-input input").val().length){
        var _val = parseInt($('#mapdUsrs select').val());
        //appendingPrevMapping(Math.ceil($(this).val()/_val),_val);
        if(csvMappings === true){
            UpdateCsvPath(Math.ceil($(this).val()),_val);
        }
        else
            appendingPrevMapping(Math.ceil($(this).val()),_val);
        $(this).blur();
    }
    else if($("#mapdUsrs .custom-search-input input").val().length && e.key == "Enter" ){
        if(searchData.mapping){
            autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim(),_chkZero)
            $('#mapdUsrs .paginationCF input').blur();
            $('#mapdUsrs .paginationCF input').val(_chkZero);
        }
        else{
            if(csvMappings === true){
                UpdateCsvPath(Math.ceil($(this).val()),_val);
            }
            else
                appendingPrevMapping(Math.ceil($(this).val()),_val);
        }

    }
    if(pgngOptions.chkNumber(String.fromCharCode(e.which))){
        if((_chkZero *10 + Number(e.key)) == 0)
            return false;

        var _val = (Number($(this).val())) * 10 + Number(e.key);
        if(parseInt( _val) <= $('#mapdUsrs .paginationCF span').text().match(/\d+$/)[0] )
            return true;
        else
            return false;
    }
    else if(e.key == "Backspace"){
        return true;
    }
    else
        return false;
});

//Destination  Show value change
$(document).on('change','#dstnUsrs select',function(){
    var searchData = JSON.parse(localStorage.getItem("searchData"));
    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    $('#dstnUsrs .paginationCF input').val(1);
    if(searchData.destination) {
        if ($("#dstnUsrs .custom-search-input input").val().length) {
            migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), 1, $('#dstnUsrs select').val(), "destination", $("#dstnUsrs .custom-search-input input").val().toLowerCase().trim()); // if(searchCloudUser != undefined)
            return false;
        }
    }
    else{
        migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), 1, $(this).val(), 'destination');
    }

});

$(document).find('#dstnUsrs .paginationCF input:last').keypress(function(e){
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    if((!$(this).val().length) && parseInt(e.key) === 0)
        return false;

    var _chkZero = parseInt($(this).val());
    if(($(_chkZero).length == undefined) && (Number(e.key) == 0))
        return false;

    if(e.key == "Enter" && _chkZero && !$("#dstnUsrs .custom-search-input input").val().length){
        migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), $(this).val(),$('#dstnUsrs select').val(), 'destination');
        $(this).blur();
    }
    if(e.key == "Enter" && _chkZero && $("#dstnUsrs .custom-search-input input").val().length){
        if(searchData.destination) {
            migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),$(this).val(), $('#dstnUsrs select').val(),"destination",$("#dstnUsrs .custom-search-input input").val().toLowerCase().trim()); // if(searchCloudUser != undefined)
            $(this).blur();
        }
        else{
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), $(this).val(),$('#dstnUsrs select').val(), 'destination');

        }

    }
    if(pgngOptions.chkNumber(String.fromCharCode(e.which))){
        if((_chkZero *10 + Number(e.key)) == 0)
            return false;

        var _val = (Number($(this).val())) * 10 + Number(e.key);
        if(parseInt( _val) <= $('#dstnUsrs .paginationCF span').text().match(/\d+$/)[0] )
            return true;
        else
            return false;
    }
    else if(e.key == "Backspace"){
        return true;
    }
    else
        return false;
});

// Source step-forward
$(document).on('click',"#srcUsrs .fa-chevron-right:last",function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    var _selVal =parseInt($('#srcUsrs select').val());
    //var _curPage = Number($("#srcUsrs .paginationDiv input").val()) + _selVal;
    var _curPage = Number($("#srcUsrs .paginationDiv:last input").val()) + 1;
    var _maxPages = Number($("#srcUsrs .paginationDiv:last span").text().match(/\d+$/)[0]);


    if( _curPage <= _maxPages ){
        var _class = $("#srcUsrs .forDomainNameMin:visible").attr("class");
        $("#srcUsrs .paginationDiv:last input").val(_curPage);
        var _searchCloudUser = $("#srcUsrs .custom-search-input input").val().trim();
        if(searchData.source) {
            if(_searchCloudUser.length)
                migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),_curPage, _selVal,'source',_searchCloudUser);
        }
        else
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'source');
    }

})

// Source step-backward
$(document).on('click',"#srcUsrs .fa-chevron-left:last",function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    var _selVal =parseInt($('#srcUsrs select').val());
    //var _curPage = Number($("#srcUsrs .paginationDiv input").val()) - _selVal;
    var _curPage = Number($("#srcUsrs .paginationDiv:last input").val()) - 1;


    if( _curPage > 0 ){
        var _class = $("#srcUsrs .forDomainNameMin:visible").attr("class");
        //migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'source');
        $("#srcUsrs .paginationDiv:last input").val(_curPage);
        var _searchCloudUser = $("#srcUsrs .custom-search-input input").val().trim();
        if(searchData.source) {
            if(_searchCloudUser.length)
                migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),_curPage, _selVal,'source',_searchCloudUser);
        }
        else
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'source');

    }

})

// Destination step-forward
$(document).on('click',"#dstnUsrs .fa-chevron-right:last",function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    var _selVal =parseInt($('#dstnUsrs select').val());
    //var _curPage = Number($("#dstnUsrs .paginationDiv input").val()) + _selVal;
    var _curPage = Number($("#dstnUsrs .paginationDiv:last input").val()) + 1;
    var _maxPages = Number($("#dstnUsrs .paginationDiv:last span").text().match(/\d+$/)[0]);


    if( _curPage <= _maxPages ){
        var _class = $("#dstnUsrs .forDomainNameMin:visible").attr("class");
        // migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'destination');
        var _searchCloudUser = $("#dstnUsrs .custom-search-input input").val().trim();
        if(searchData.destination) {
            if(_searchCloudUser.length)
                migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),_curPage, _selVal,'destination',_searchCloudUser);
        }
        else
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'destination');

        $("#dstnUsrs .paginationDiv:last input").val(_curPage);
    }

})

// Destination step-backward
$(document).on('click',"#dstnUsrs .fa-chevron-left:last",function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));
    if($(this).parents('.paginationDiv').hasClass('disabled'))
        return false;

    var _selVal =parseInt($('#dstnUsrs select').val());
    //var _curPage = Number($("#dstnUsrs .paginationDiv input").val()) - _selVal;
    var _curPage = Number($("#dstnUsrs .paginationDiv:last input").val()) - 1;


    if( _curPage > 0 ){
        var _class = $("#dstnUsrs .forDomainNameMin:visible").attr("class");
        //migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'destination');
        var _searchCloudUser = $("#dstnUsrs .custom-search-input input").val().trim();
        if(searchData.destination) {
            if(_searchCloudUser.length)
                migrationMapping.getSearchUser(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),_curPage, _selVal,'destination',_searchCloudUser);
        }
        else
            migrationMapping.getDomainsList(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), _curPage, _selVal, 'destination');


        $("#dstnUsrs .paginationDiv:last input").val(_curPage);
    }

})

// Mapped step-forward
$(document).on('click',"#mapdUsrs .fa-chevron-right",function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));

    var _selVal = parseInt($('#mapdUsrs select').val());
    var _curPage = Number($("#mapdUsrs .paginationDiv input").val()) + 1;
    var _maxPages = Number($("#mapdUsrs .paginationDiv span").text().match(/\d+$/)[0]);



    if( _curPage <= _maxPages ){
        if($("#mapdUsrs .custom-search-input input").val().length) {
            if (searchData.mapping) {
                autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim(), _curPage);
            }
            else
                appendingPrevMapping(_curPage, _selVal);
        }
        else{
            if(csvMappings === true){
                UpdateCsvPath(_curPage,_selVal);
            }
            else
                appendingPrevMapping(_curPage,_selVal);
        }
        $("#mapdUsrs .paginationDiv input").val(_curPage);
    }

})

// Mapped step-backward
$(document).on('click',"#mapdUsrs .fa-chevron-left",function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));
    var _selVal = parseInt($('#mapdUsrs select').val());
    var _curPage = Number($("#mapdUsrs .paginationDiv input").val()) - 1;


    if( _curPage > 0 ){
        if($("#mapdUsrs .custom-search-input input").val().length) {
            if (searchData.mapping) {
                autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim(), _curPage);
            }
            else
                appendingPrevMapping(_curPage,_selVal);
        }
        else{
            if(csvMappings === true){
                UpdateCsvPath(_curPage,_selVal);
            }
            else
                appendingPrevMapping(_curPage,_selVal);
        }
        $("#mapdUsrs .paginationDiv input").val(_curPage);
    }

})



/*var pgno =  parseInt($(this).parents(".fldr_parent").attr('pgno'));
    pgno += 1;
    $(this).parents(".fldr_parent").attr('pgno', pgno);
    if($(this).hasClass('hasnext')) {
        $(this).parent(".fldr_parent1").css("display","none");
        $(this).parent(".fldr_parent1").next().css("display","block");
    }
    else{
        dataList(this, pgno);
        return false;
    }
*/




// Source users step-forward
$(document).on('click',"#srcCloudUsers .forDomainNameMin .fa-chevron-right",function () {
    var _selVal = 1; //parseInt($('#srcUsrs select').val());
    var _curPage = Number($(this).siblings().find("input").val()) + _selVal;
    var _maxPages = Number($(this).siblings().find("span:nth-child(3)").text().match(/\d+$/)[0]);
    var _class = $(this).parents("div.forDomainNameMin").attr("class").split(" ")[1];
    //var $rmvUsrs = "#srcCloudUsers .forDomainNameMin[class*='" + _class +"']";
    var $rmvUsrs = $(document.getElementById("srcCloudUsers").getElementsByClassName(_class));
    $($rmvUsrs[1]).css("display","block");
    $($rmvUsrs[0]).css("display","none");
    if( _curPage <= _maxPages ){
        migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), _curPage, 10, "source", $rmvUsrs[1]);
        $(this).siblings().find("input").val(_curPage);
    }
})



// Source users step-backward
$(document).on('click',"#srcCloudUsers .forDomainNameMin .fa-chevron-left",function () {
    var _selVal = 1; //parseInt($('#srcUsrs select').val());
    var _curPage = Number($(this).siblings().find("input").val()) - _selVal;
    var _class = $(this).parents("div.forDomainNameMin").attr("class").split(" ")[1];
    //var $rmvUsrs = "#srcCloudUsers .forDomainNameMin[class*='" + _class +"']";
    var $rmvUsrs = $(document.getElementById("srcCloudUsers").getElementsByClassName(_class));
    $($rmvUsrs[1]).css("display","block");
    $($rmvUsrs[0]).css("display","none");

    if( _curPage > 0 ){
        $(this).siblings().find("input").val(_curPage);
        migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), _curPage, 10, "source", $rmvUsrs[1]);
    }
})

// Destination user step-forward
$(document).on('click',"#dstCloudsUsers .forDomainNameMin .fa-chevron-right",function () {
    var _selVal = 1; //parseInt($('#srcUsrs select').val());
    var _curPage = Number($(this).siblings().find("input").val()) + _selVal;
    var _maxPages = Number($(this).siblings().find("span:nth-child(3)").text().match(/\d+$/)[0]);
    var _class = $(this).parents("div.forDomainNameMin").attr("class").split(" ")[1];
    //var $rmvUsrs = "#dstCloudsUsers .forDomainNameMin[class*='" + _class +"']";
    var $rmvUsrs = $(document.getElementById("dstCloudsUsers").getElementsByClassName(_class));
    $($rmvUsrs[1]).css("display","block");
    $($rmvUsrs[0]).css("display","none");
    if( _curPage <= _maxPages ){
        migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), _curPage, 10, "destination", $rmvUsrs[1]);
        $(this).siblings().find("input").val(_curPage);
    }

})

// Destination users step-backward
$(document).on('click',"#dstCloudsUsers .forDomainNameMin .fa-chevron-left",function () {

    var _selVal = 1; //parseInt($('#srcUsrs select').val());
    var _curPage = Number($(this).siblings().find("input").val()) - _selVal;
    var _class = $(this).parents("div.forDomainNameMin").attr("class").split(" ")[1];
    //var $rmvUsrs = "#dstCloudsUsers .forDomainNameMin[class*='" + _class +"']";
    var $rmvUsrs = $(document.getElementById("dstCloudsUsers").getElementsByClassName(_class));
    $($rmvUsrs[1]).css("display","block");
    $($rmvUsrs[0]).css("display","none");

    if( _curPage > 0 ){
        $(this).siblings().find("input").val(_curPage);
        migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), _curPage, 10, "destination", $rmvUsrs[1]);
    }

});





/*$("#rplcChar").on('change',function(){
    if($(this).is(':checked')){
        $(this).next().next().css("display","");
    }
    else{
        $(this).next().next().css("display","none");
    }
});*/

//source and destination options
$(document).on('click','.fa-plus.expandSourceOptions',function () {
    $(this).removeClass('fa-plus').addClass('fa-minus');
    $(".expandSourceOptionsHide").css('display','');
});
$(document).on('click','.fa-plus.expandDstnOptions',function () {
    $(this).removeClass('fa-plus').addClass('fa-minus');
    $(".expandDsteOptionsHide").css('display','');
});
$(document).on('click','.fa-minus.expandSourceOptions',function () {
    $(this).removeClass('fa-minus').addClass('fa-plus');
    $(".expandSourceOptionsHide").css('display','none');
});
$(document).on('click','.fa-minus.expandDstnOptions',function () {
    $(this).removeClass('fa-minus').addClass('fa-plus');
    $(".expandDsteOptionsHide").css('display','none');
});
$(document).on('click','.bold .cf-plus5',function () {
    //mappingOptions.appendUserPairs();
    $(this).removeClass("cf-plus5").addClass("cf-minus5");
    $(document).find(".showTable").css("display",'none');
    // if($(this).text().toLowerCase().indexOf("show") > -1){
    //     $(this).text("Hide");
    //     $(document).find(".showTable").css("display",'');
    // }
    // else{
    //     $(this).text("Show");
    //     $(document).find(".showTable").css("display",'none');
    // }
});
$(document).on('click','.bold .cf-minus5',function () {
    $(this).removeClass("cf-minus5").addClass("cf-plus5");
    $(document).find(".showTable").css("display",'');

});





/* ... Source Users ...*/

$(document).on('keypress','#srcCloudUsers .paginationCF input',function(e){
    if((!$(this).val().length) && parseInt(e.key) === 0)
        return false;

    var _chkZero = parseInt($(this).val());
    if(($(_chkZero).length == undefined) && (Number(e.key) == 0))
        return false;

    if (e.key == "Enter" && _chkZero) {
        var _class = $(this).parents(".forDomainNameMin").attr("class").split(" ")[1];
        //var $rmvUsrs = "#srcCloudUsers .forDomainNameMin[class*='" + _class +"']";
        var $rmvUsrs = $(document.getElementById("srcCloudUsers").getElementsByClassName(_class));
        migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), $(this).val(), 10, "source", $rmvUsrs[1]);
        $(this).blur();
    }

    if(pgngOptions.chkNumber(String.fromCharCode(e.which))){
        if((_chkZero *10 + Number(e.key)) == 0)
            return false;

        var _val = (Number($(this).val())) * 10 + Number(e.key);
        if(parseInt( _val) <= Number( $(this).siblings("span").text().match(/\d+$/)[0]) )
            return true;
        else
            return false;
    }
    else if(e.key == "Backspace"){
        return true;
    }
    else
        return false;

});

/* ... Destination Users ...*/

$(document).on('keypress','#dstCloudsUsers .paginationCF input',function(e){
    if((!$(this).val().length) && parseInt(e.key) === 0)
        return false;

    var _chkZero = parseInt($(this).val());
    if(($(_chkZero).length == undefined) && (Number(e.key) == 0))
        return false;

    if(e.key == "Enter" && _chkZero){
        var _class = $(this).parents(".forDomainNameMin").attr("class").split(" ")[1];
        //var $rmvUsrs = "#dstCloudsUsers .forDomainNameMin[class*='" + _class +"']";
        var $rmvUsrs = $(document.getElementById("dstCloudsUsers").getElementsByClassName(_class));
        migrationMapping.getPgntdUsrsData(_class, localStorage.getItem("multiUsrSrcCldId"), localStorage.getItem("multiUsrDstnCldId"), $(this).val(), 10, "destination", $rmvUsrs[1]);
        $(this).blur();
    }
    if(pgngOptions.chkNumber(String.fromCharCode(e.which))){
        if((_chkZero *10 + Number(e.key)) == 0)
            return false;

        var _val = (Number($(this).val())) * 10 + Number(e.key);
        if(parseInt( _val) <= Number( $(this).siblings("span").text().match(/\d+$/)[0]) )
            return true;
        else
            return false;
    }
    else if(e.key == "Backspace"){
        return true;
    }
    else
        return false;
});


/*....   Migration-Pairs show value .... */
$(document).on('change','#preview select',function(){
    $('#preview .paginationCF input').val(1);
    mgrtnPrs.pgntdData(1,parseInt($(this).val()));
});



/*....   Migration-Pairs Pagination .... */
$(document).find('#preview .paginationCF input').keypress(function(e){
    if((!$(this).val().length) && parseInt(e.key) === 0)
        return false;
    var _num ;
    if(e.key == "Enter" )
        _num = Number($(this).val());
    else
        _num = Number($(this).val())*10 + Number(e.key);

    if(_num < 1){
        $('#preview .paginationCF input').blur();
        $('#preview .paginationCF input').val($("#preview .paginationCF span").text().split("Go to:")[1].split(" of")[0]);
        return false;
    }


    if(e.key == "Enter" && (_num >0)){
        var _val = parseInt($('#preview select').val());
        mgrtnPrs.pgntdData(Math.ceil($(this).val()),_val);
        $(this).blur();
    }
    if(pgngOptions.chkNumber(String.fromCharCode(e.which))){
        var _val = (Number($(this).val())) * 10 + Number(e.key);
        if(parseInt( _val) <= $('#preview .paginationCF span').text().match(/\d+$/)[0] )
            return true;
        else
            return false;
    }
    else if(e.key == "Backspace"){
        return true;
    }
    else
        return false;
});



/*....   Migration-Pairs step-forward .... */
$(document).on("click","#preview .fa-chevron-right",function () {
    var _selVal = parseInt($('#preview select').val());
    var _curPage = Number($("#preview .paginationDiv input").val()) + 1;
    var _maxPages = Number($("#preview .paginationDiv span").text().match(/\d+$/)[0]);



    if( _curPage <= _maxPages ){
        mgrtnPrs.pgntdData(Math.floor(_curPage/1),parseInt($('#preview select').val()));
        $("#preview .paginationDiv input").val(_curPage);
    }

})

/*....   Migration-Pairs step-backward .... */
$(document).on("click","#preview .fa-chevron-left",function () {
    var _selVal = parseInt($('#preview select').val());
    var _curPage = Number($("#preview .paginationDiv input").val()) - 1;


    if( _curPage > 0 ){
        mgrtnPrs.pgntdData(Math.floor(_curPage/1),parseInt($('#preview select').val()));
        $("#preview .paginationDiv input").val(_curPage);
    }

})


/*....   Migration-Pairs pagination .... */
var mgrtnPrs = {
    pgntdData : function (pgNo,pgSze) {
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/preview/" + localStorage.jobId + "?pageNo=" + pgNo +"&pageSize=" + pgSze,
            //   async: false,
            headers: {
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            },
            success: function (data) {
                var _dataLength = data.previewDetail.length;   //if(_dataLength)
                var _len = data.listOfMoveWorkspaceId.length;
                if(pgNo == 1)
                    $("#preview .paginationDiv input").val(1);

                $("#appendSelectedPairs").html("");
                var _size = parseInt(pgNo*pgSze);
                if( _size > _len)
                    _size = _len;

                //var _txt = " " + parseInt(((pgNo - 1)*pgSze) + 1) + " - " + _size + " of " + _len;
                var _txt = pgNo + " of " + Math.ceil(_len/pgSze);
                $(document).find("#preview .paginationCF div span:nth-child(3)").text(_txt);
                if((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN")  || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")  || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")||((data.fromCloudName === "BOX_BUSINESS")  && (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "BOX_BUSINESS")  && (data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS"))) {
                    $("#preview").find("#previewMapping").find("thead tr th.nonProvisoned").remove();
                    var _th = '<th style="width: 28%;" class="nonProvisoned">Provision Status</th>';
                    $("#preview").find("#previewMapping").find("thead tr").append(_th);
                    $("#preview").find("#previewMapping").find("thead tr").find(".SrcUsrs").css("width", '35%');
                    $("#preview").find("#previewMapping").find("thead tr").find(".DstnUsrs").css("width", '35%');
                    var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%">Not Provisioned</div></div>';
                }
                else {
                    $("#preview").find("#previewMapping").find("thead tr th.nonProvisoned").remove();
                    var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 51%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div></div>';
                }
                //   localStorage.removeItem('FolderChecked');
                for(var i=0;i<_dataLength;i++){
                    var _usrData = data.previewDetail[i];
				if ((((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")))&&((data.previewDetail[i].fromProvision) == true && (data.previewDetail[i].toProvision) == true)){
                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:green">Not Provisioned</div></div>';
				var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Provisioned");
                    }
				else if ((((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")))&&((data.previewDetail[i].fromProvision) == false || (data.previewDetail[i].toProvision) == true)){
                     var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:red">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Not Provisioned");
                    }
				else if ((((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")))&&((data.previewDetail[i].fromProvision) == false || (data.previewDetail[i].toProvision) == false)){
                     var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:red">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Not Provisioned");
                    }
				else if ((((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "BOX_BUSINESS")&&(data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")))&&((data.previewDetail[i].fromProvision) == true || (data.previewDetail[i].toProvision) == false)){
                     var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:red">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Not Provisioned");
                    }
                    else if ((((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN")&&(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")&&(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")))&&((data.previewDetail[i].toProvision) == true || (data.previewDetail[i].fromProvision) == true)){
                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:green">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Provisioned");
                    }
                    else if (((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID"))&& data.previewDetail[i].fromProvision == true){
                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:green">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Provisioned");
                    }
                    else if (((data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID"))&& data.previewDetail[i].toProvision == true){
                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:green">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Provisioned");
                    }else{
                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 35%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;" title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:red">Not Provisioned</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId).replace("Not Provisioned","Not Provisioned");
                    }
                    if(!((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")||(data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")  || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN_HYBRID")||((data.fromCloudName === "BOX_BUSINESS")  && (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN"))||((data.fromCloudName === "BOX_BUSINESS")  && (data.toCloudName === "SHAREPOINT_ONLINE_BUSINESS")))){
                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;height:40px;"><div style="width: 53%" title="srcName"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div title="destName"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div></div>';
                        var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,20)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,20)).replace("srcName",_usrData.fromEmailId).replace("destName",_usrData.toEmailId);
                    }
                    

                    $("#appendSelectedPairs").append(_appendHtml);
                }

                /*         var _dataLength = data.previewDetail.length;   //if(_dataLength)
                                if($('#jobType_dropDown :selected').text() !== "One-way sync") {
                                    var _len = data.listOfMoveWorkspaceId.length;
                                }
                                else {
                                    var _len = JSON.parse(localStorage.getItem('selMappings')).length;
                                }
                                if(pgNo == 1)
                                    $("#preview .paginationDiv input").val(1);

                                $("#appendSelectedPairs").html("");
                                var _size = parseInt(pgNo*pgSze);
                                if( _size > _len)
                                    _size = _len;

                                //var _txt = " " + parseInt(((pgNo - 1)*pgSze) + 1) + " - " + _size + " of " + _len;
                                var _txt = pgNo + " of " + Math.ceil(_len/pgSze);
                                $(document).find("#preview .paginationCF div span:nth-child(3)").text(_txt);
                                if($('#jobType_dropDown :selected').text() === "One-way sync") {
                                    $("#preview").find("#previewMapping").find("thead tr th.job_name").remove();
                                    var JOBNAME = '<th style="width: 19%;" class="job_name">Job Name</th>';
                                    $("#preview").find("#previewMapping").find("thead tr").append(JOBNAME);
                                    $("#preview").find("#previewMapping").find("thead tr").find(".SrcUsrs").css("width", '30%');
                                    $("#preview").find("#previewMapping").find("thead tr").find(".DstnUsrs").css("width", '30%');
                                    if ((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN") || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) {
                                        $("#preview").find("#previewMapping").find("thead tr th.nonProvisoned").remove();
                                        var _th = '<th style="width: 20%;" class="nonProvisoned">Provision Status</th>';
                                        $("#preview").find("#previewMapping").find("thead tr").append(_th);
                                        $("#preview").find("#previewMapping").find("thead tr").find(".SrcUsrs").css("width", '30%');
                                        $("#preview").find("#previewMapping").find("thead tr").find(".DstnUsrs").css("width", '30%');
                                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%;"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div style="width: 20%;margin-right: 6%;">ODFB-ODFB-May.30.2018-46</div><div class = "prvsnStatus" style="width: 15%;">Not Provisioned</div></div>';
                                    }
                                    else {
                                        $("#preview").find("#previewMapping").find("thead tr th.nonProvisoned").remove();
                                        var _html = '<div id="selectedPairs" style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div style="width: 22%;text-align: center;margin-left: 10%">ODFB-ODFB-May.30.2018-46</div></div>';
                                    }
                                }
                                else {
                                    $("#preview").find("#previewMapping").find("thead tr th.job_name").remove();
                                    if ((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN") || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) {
                                        $("#preview").find("#previewMapping").find("thead tr th.nonProvisoned").remove();
                                        var _th = '<th style="width: 28%;" class="nonProvisoned">Provision Status</th>';
                                        $("#preview").find("#previewMapping").find("thead tr").append(_th);
                                        $("#preview").find("#previewMapping").find("thead tr").find(".SrcUsrs").css("width", '35%');
                                        $("#preview").find("#previewMapping").find("thead tr").find(".DstnUsrs").css("width", '35%');
                                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 30%;margin-right: 4%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 30%;margin-right: 5%"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style="width: 20%;text-align: center;margin-left: 5%">Not Provisioned</div></div>';
                                    }
                                    else{
                                        var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 53%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div></div>';
                                    }
                                }
                                //   localStorage.removeItem('FolderChecked');
                                for(var i=0;i<_dataLength;i++){
                                    var _usrData = data.previewDetail[i];
                                    if($('#jobType_dropDown :selected').text() === "One-way sync") {
                                        if (((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN") || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) && ((data.previewDetail[i].toProvision) === true || (data.previewDetail[i].fromProvision) === true)) {
                                            var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div style="width: 20%;margin-right: 6%;">ODFB-ODFB-May.30.2018-46</div><div class = "prvsnStatus" style ="width:15%;color:red">Not Provisioned</div></div>';
                                            var _appendHtml = _html.replace("Melvin@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.fromEmailId, 25)).replace("Tania@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.toEmailId, 25)).replace("ODFB-ODFB-May.30.2018-46",_usrData.jobName).replace("Not Provisioned", "Not Provisioned");
                                        }
                                        else if (((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN") || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) && ((data.previewDetail[i].toProvision) === false || (data.previewDetail[i].fromProvision) === false)) {
                                            var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div style="width: 20%;margin-right: 6%;">ODFB-ODFB-May.30.2018-46</div><div class = "prvsnStatus" style ="width:15%;color:green">Not Provisioned</div></div>';
                                            var _appendHtml = _html.replace("Melvin@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.fromEmailId, 25)).replace("Tania@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.toEmailId, 25)).replace("ODFB-ODFB-May.30.2018-46",_usrData.jobName).replace("Not Provisioned", "Provisioned");
                                        }
                                        else{
                                            var _html = '<div id="selectedPairs" style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div style="width: 22%;text-align: center;margin-left: 10%"">ODFB-ODFB-May.30.2018-46</div>></div>';
                                            var _appendHtml = _html.replace("Melvin@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.fromEmailId, 25)).replace("Tania@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.toEmailId, 25)).replace("ODFB-ODFB-May.30.2018-46",_usrData.jobName);
                                        }
                                    }
                                    else{
                                        if (((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN") || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) && ((data.previewDetail[i].toProvision) === true || (data.previewDetail[i].fromProvision) === true)) {
                                            var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:red">Not Provisioned</div></div>';
                                            var _appendHtml = _html.replace("Melvin@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.fromEmailId, 25)).replace("Tania@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.toEmailId, 25)).replace("Not Provisioned", "Not Provisioned");
                                        }
                                        else if (((data.fromCloudName === "ONEDRIVE_BUSINESS_ADMIN") || (data.toCloudName === "ONEDRIVE_BUSINESS_ADMIN")) && ((data.previewDetail[i].toProvision) === false || (data.previewDetail[i].fromProvision) === false)) {
                                            var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 35%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div style="width: 35%;"><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div><div class = "prvsnStatus" style ="margin-left: 8%;color:green">Not Provisioned</div></div>';
                                            var _appendHtml = _html.replace("Melvin@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.fromEmailId, 25)).replace("Tania@cloudfuze.co", CFManageCloudAccountsAjaxCall.getMaxChars(_usrData.toEmailId, 25)).replace("Not Provisioned", "Provisioned");
                                        }
                                        else{
                                            var _html = '<div style="display: flex;border-bottom: 1px solid #ccc;padding: 8px;background: #ffffff"><div style="width: 53%"><img src="../img/PNG/' + data.fromCloudName + '.png" alt="From cloud Image" class="forImage">Melvin@cloudfuze.co</div><div><img src="../img/PNG/' + data.toCloudName + '.png" alt="To cloud Image" class="forImage">Tania@cloudfuze.co</div></div>';
                                            var _appendHtml = _html.replace("Melvin@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.fromEmailId,25)).replace("Tania@cloudfuze.co",CFManageCloudAccountsAjaxCall.getMaxChars( _usrData.toEmailId,25));

                                        }
                                    }
                                    if(i%2 == 1)
                                        _appendHtml = _appendHtml.replace("#ffffff","#f2f2f2");

                                    $("#appendSelectedPairs").append(_appendHtml);
                                }
                                $("#forNextMove").removeClass("disabled");
                               */
                setTimeout(function(){
                    $("#CFShowLoading").modal('hide');
                }, 1000);

            }
        });
    }
}


/* ....  On Blur  .... */
$(document).find('#srcUsrs #srcCloudUsers').siblings().find("input.input-sm").focusout(function(){
    var _val = $(this).siblings().text().split("Go to:")[1].split(" ")[0];
    if( parseInt($(this).val()) != _val)
        $(this).val(_val);
});
$(document).find('#dstnUsrs #dstCloudsUsers').siblings().find("input.input-sm").focusout(function(){
    // if($(this).val().length || parseInt($(this).val())<1)
    //     $(this).val($(this).siblings().text().split("Go to:")[1].split(" ")[0]);

    var _val = $(this).siblings().text().split("Go to:")[1].split(" ")[0];
    if( parseInt($(this).val()) != _val)
        $(this).val(_val);
});
$(document).find('#mapdUsrs .paginationCF input').focusout(function(){
    var _val = $(this).siblings().text().split("Go to:")[1].split(" ")[0];
    if( parseInt($(this).val()) != _val)
        $(this).val(_val);
});

$(document).on('focusout','#srcUsrs #srcCloudUsers input.input-sm',function(){
    var _val = $(this).siblings().text().split("Go to:")[1].split(" ")[0];
    if( parseInt($(this).val()) != _val)
        $(this).val(_val);
});
$(document).on('focusout','#dstnUsrs #dstCloudsUsers input.input-sm',function(){
    var _val = $(this).siblings().text().split("Go to:")[1].split(" ")[0];
    if( parseInt($(this).val()) != _val)
        $(this).val(_val);
});
$(document).find('#preview .paginationCF input').focusout(function(){
    var _val = $(this).siblings().text().split("Go to:")[1].split(" ")[0];
    if( parseInt($(this).val()) != _val)
        $(this).val(_val);
});


// Adding Notification emails

$(document).find('#additionalemailsold').keypress(function(e){
    if(e.key == "Enter" || e.key == ',' || e.keyCode == 32){
        e.preventDefault();
        var _email = $(this).val().trim();
        if(!mappingOptions.checkEmail(_email)){
            $("#forNextMove").removeClass('disabled');
            return false;
        }
        else{
            var _html = '<div style="border: 1px solid #aaa;padding: 5px;display:inline-block;background: #fff;margin:8px 5px;" class="emailParent"><span>' + _email +'</span><div style=" margin: 0 0 0 13px; font-size: 12px;float: right;" class="closeEmail"><i class="lnil lnil-cross-circle" style="cursor: pointer"></i></div></div>&nbsp'
            $(".notifiedMails").append(_html);
            $(this).val('');
            //$("textarea").val("");
        }
    }

});
$(document).find('#additionalEmails').keypress(function(e){
    if(e.key == "Enter" || e.key == ',' || e.keyCode == 32){
        $("#additionalEmails").animate({ scrollTop: $("#additionalEmails")[0].scrollHeight }, 180);
        e.preventDefault();
        var _email = $(this).val().trim();
        if(_email.length === 0){
            return false;
        }
        if(!mappingOptions.checkEmailNew(_email)){
            $("#forNextMove").removeClass('disabled');
            return false;
        }
        else{
            var _html = '<div style="border: 1px solid #aaa;padding: 5px;display:inline-block;background: #fff;margin:8px 5px;" class="emailParent"><span>' + _email +'</span><div style=" margin: 0 0 0 13px; font-size: 12px;float: right;" class="closeEmail"><i class="lnil lnil-cross-circle" style="cursor: pointer"></i></div></div>&nbsp'
            $(".notifiedMailsNew").append(_html);
            $(this).val('');
            //$("textarea").val("");
        }
    }

});
$(document).find('#my_inputfile').keypress(function(e){
    if(e.key == "Enter" || e.key == ',' || e.keyCode == 32){
      //  $(".fileTypeExc").animate({ scrollTop: $("#fileTypeExc")[0].scrollHeight }, 100);
        e.preventDefault();
        var _excFiles = $(this).val().toLowerCase().trim();
        if(_excFiles.length === 0){
            return false;
        }
        if(!mappingOptions.checkfileType(_excFiles)){
            $("#forNextMove").removeClass('disabled');
            return false;
        }
        else{
            var _html = '<div style="border: 1px solid #aaa;padding: 5px;display:inline-block;background: #fff;margin:8px 5px;" class="mpParent"><span>' + val +'</span><div style=" margin: 0 0 0 13px; font-size: 12px;float: right;" class="closeFile"><i class="lnil lnil-cross-circle" style="cursor: pointer"></i></div></div>&nbsp'
            $(".fileTypeExc").append(_html);
            $(this).val('');
            //$("textarea").val("");
        }
    }

});
$(document).on('click','.closeEmail',function() {
    $(this).parent().remove();
});
$(document).on('click','.closeFile',function() {
    $(this).parent().remove();
});
//sorting order in mapped screen
$("#sortngSrc").click(function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));
    if(searchData.mapping) {
        if ($('#mapdUsrs .custom-search-input input').val()) {
            var obj = JSON.parse(localStorage.getItem("mpngSrtng"));
            obj.sortBy = "sourceCloud";
            //obj.orderBy = 'ASC';
            if (obj.orderBy == 'ASC') {
                obj.orderBy = 'DESC';
            }
            else
                obj.orderBy = 'ASC';
            localStorage.setItem("mpngSrtng", JSON.stringify(obj));
            autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim());
        }
    }
    else{
        migrationMapping.sortMapping("sourceCloud");
    }

});
$("#sortngDstn").click(function () {
    var searchData = JSON.parse(localStorage.getItem("searchData"));
    if(searchData.mapping) {
        if ($('#mapdUsrs .custom-search-input input').val()) {
            var obj = JSON.parse(localStorage.getItem("mpngSrtng"));
            obj.sortBy = "destCloud";
            //obj.orderBy = 'DESC';
            if (obj.orderBy == 'ASC') {
                obj.orderBy = 'DESC';
            }
            else
                obj.orderBy = 'ASC';
            localStorage.setItem("mpngSrtng", JSON.stringify(obj));
            autoMappingSearch($("#mapdUsrs .custom-search-input input").val().trim());
            return false;
        }
    }
    else
        migrationMapping.sortMapping("destCloud");
});
//Pressing other characters at destination

$(document).find("#dstnUsrs .custom-search-input input").keydown(function(e){
    if((e.key == "Control") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
$(document).find("#dstnUsrs .custom-search-input input").keypress(function(e){
    if((e.key == "Control") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
$(document).find("#dstnUsrs .custom-search-input input").keyup(function(e){
    if((e.key == "Control") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp")|| (e.key == "ArrowDown")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
//Pressing other characters at source

$(document).find("#srcUsrs .custom-search-input input").keydown(function(e){
    if((e.key == "Control") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        //return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
$(document).find("#srcUsrs .custom-search-input input").keypress(function(e){
    if((e.key == " ") || (e.key == "Control") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z") || (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        //return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
$(document).find("#srcUsrs .custom-search-input input").keyup(function(e){
    if((e.key == " ") || (e.key == "Control") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        //return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
//Mozilla issues for refresh
$(document).find("#mapdUsrs .custom-search-input input").keydown(function(e){
    if((e.key == " ") || (e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        e.preventDefault();
        return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
$(document).find("#mapdUsrs .custom-search-input input").keypress(function(e){
    if((e.key == " ") || (e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        e.preventDefault();
        return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
$(document).find("#mapdUsrs .custom-search-input input").keyup(function(e){
    if((e.key == " ") ||(e.key == "Escape") || (e.key == "CapsLock")|| (e.key == "Shift")|| (e.key == "Alt")|| (e.key == "ctrl+c")|| (e.key == "ctrl+z")|| (e.key == "ArrowUp") || (e.key == "ArrowDown")){
        e.preventDefault();
        return false;
    }
    else if((e.key == "ArrowLeft") || (e.key == "ArrowRight")){
        $("#CFShowLoading").modal("hide");
    }
});
//Enter loading issue
$(document).find("#srcUsrs .custom-search-input input").keydown(function(e){
    if(($("#srcUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#srcUsrs .custom-search-input input").keypress(function(e){
    if(($("#srcUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#srcUsrs .custom-search-input input").keyup(function(e){
    if(($("#srcUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#dstnUsrs .custom-search-input input").keydown(function(e){
    if(($("#dstnUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#dstnUsrs .custom-search-input input").keypress(function(e){
    if(($("#dstnUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#dstnUsrs .custom-search-input input").keyup(function(e){
    if(($("#dstnUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#mapdUsrs .custom-search-input input").keydown(function(e){
    if(($("#mapdUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#mapdUsrs .custom-search-input input").keypress(function(e){
    if(($("#mapdUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
$(document).find("#mapdUsrs .custom-search-input input").keyup(function(e){
    if(($("#mapdUsrs .custom-search-input input").val().length == 0) && (e.key == "Enter")){
        $("#CFShowLoading").modal("hide");
        e.preventDefault();
        return false;
    }
});
//Long files name option when onedrive business  as destination
$(document).on('click','.fa-plus.longFileName',function () {
    $(this).removeClass('fa-plus').addClass('fa-minus');
    var _options = '<tr class="minusclicked"><td><div id="radioBtnVal"><input type="radio" name="longFileRadioBtn" style="margin-left: 8%;margin-top: 0%;" id="root">&nbspRootLevel<input type="radio" name="longFileRadioBtn" style="margin-left: 6%;margin-top: 0%;" id="parent">&nbspInnerLevel</div></td></tr>';
    $(".expandDsteOptionsHide table tbody").append(_options);
    $(".longFileName").css('display','');
});
$(document).on('click','.fa-minus.longFileName',function () {
    $(this).addClass('fa-plus').removeClass('fa-minus');
});
function dataList(thisevent, pgno,nxtToken,email){
    var triggeredclass = $(thisevent).attr('id');
    var _cloudId = $(thisevent).attr('user-id');
    var _folderId = encodeURIComponent($(thisevent).attr('folder-id'));
    var _userId = localStorage.getItem("UserId");


    var nxtTokenid = encodeURIComponent(nxtToken);//$(thisevent).attr('nxtpgtoken')
    //var prevTokenid = encodeURIComponent($(thisevent).parent(".fldr_parent1").prev().find('.fa-chevron-left').attr('prevPgToken'));
    var  pgNo = pgno;
    var  pgSize = 20;
    var apiurl = apicallurl + "/filefolder/userId/"+_userId+"/cloudId/"+_cloudId+"?folderId="+_folderId+"&page_nbr="+pgNo+"&page_size="+pgSize;
    $.ajax({
        type: "GET",
        url: apiurl,
        //async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Content-Type":"application/json",
        },
        success: function (data) {
            console.log(data);
            /*  if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')) {
                  $(thisevent).parents('#srcUsrs').find('.usr-data').removeClass('scrollActive');
              }
              else{
                  $(thisevent).parents('#dstnUsrs').find('.usr-data').removeClass('scrollActive');

              }*/
            if(data.length == 0){
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#folderLoading').css("display","none");
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#textSpan1').css("display","block").css("margin-left","12%").css("margin-top","-7%");

            }
            if(data.length === 0){
                _html = '<div class="fldr_parent1" nxtpgtoken="' + null + '" pgno="1">';
            }
            else{
		var dataLen = data.length -1;
                _html = '<div class="fldr_parent1" nxtpgtoken="'+data[dataLen].nextPageToken+'" pgno="1">';
		
		}
            var array = [];
            for(var i=0;i<data.length;i++){
                var createdTime = CFManageCloudAccountsAjaxCall.getDateConversion(data[i].createdTime);
                var folderSize = CFManageCloudAccountsAjaxCall.getObjectSize(data[i].folderContentSize);
                var _foldrName = data[i].objectName.length;
                var foldrHover = data[i].objectName;
                foldrHover = foldrHover.replace(/  +/g, ' ');
                if(folderSize === "___"){
                    folderSize =0;
                }
                var titleBar = 'Size : '+folderSize+'&#13Date : '+createdTime;
                if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && data[i].type == 'SITE')
                {
                    array.push(data[i]);

		 }
                else if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && (data[i].type == 'FOLDER'||data[i].type=="DOCUMENT_LIBRARY")) {
                     if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
                         _html += '<p style="display:block;margin-left:22px;width:100%;" class="usr-data"><span user-id="' + data[i].cloudId + '" fromCloudId="' + data[i].cloudId + '" _folderid="' + data[i].id.split("/")[1] + '" folder-id="' + data[i].id.split("/")[2] + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" class="folderChkBox"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span title="' + foldrHover + '" style="font-size:initial;width:100%;">&nbsp;&nbsp;' + data[i].objectName + '</span></p>';
                     else {
                         if (_foldrName >= 23) {
                             if (i === 14)
                                 _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover + '" style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                             else
                                 _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover + '" style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                         } else if (i === 14)
                             _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                         else
                             _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                     }
                 }
                else if(data[i].type == 'FOLDER' || data[i].type == 'DRIVE'||data[i].type == 'DOCUMENT_LIBRARY') {
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')){
                        var _obj ={
                            "id":data[i].id,
                            "cloudId":data[i].cloudId,
                        };
                        var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(/\//g,"-");
                        var _objName = objName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var foldrHover1 = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var dataId = data[i].id;
			dataId = dataId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                       if(fldrStorage(_obj,'check1')){
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"   checked="checked"/>';
                            }
                            else
                            var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"   checked="checked"/>';
                        }
                        else{
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"/>';
                            }
                            else
                            var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"/>';
                        }
                        if(data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span  name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span  name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                        else{
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }

                    }
                    else {
 			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(/\//g,"-");
                        var _objName = objName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var foldrHover1 = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                      var dataId = data[i].id;
			dataId = dataId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        if (data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES") {
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars($.trim(_objName), 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName  + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName  + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                        } else {
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName  + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName  + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        } 
                    }
                }
                else
                    _html += '<p style="cursor:default;display:block;width:100%;margin:5px 0px 5px 45px;"><span user-id="'+data[i].cloudId+'" toCloudId="'+data[i].cloudId+'" folder-id="'+data[i].id+'"></span><i class="lnil lnil-files" style="height: 18px;width: 18px;margin-left: 10px;margin-right: -3px;margin-top: -2px;"></i><span style="font-size:initial;" title="'+_objName+'">&nbsp;&nbsp;'+CFManageCloudAccountsAjaxCall.getMaxChars(_objName,23)+'</span></p>';
            }
            if(array.length !== 0 ){

                for(var j=0;j<array.length;j++){
                    var folderHover = array[j].objectName;
                    var _folderName = array[j].objectName.length;
       			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = array[j].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	folderHover = folderHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
                        _html += '<p style="display:block;margin-left:40px;width:100%;" class="usr-data"><span user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" _folderid="' + array[j].id.split("/")[1] + '" folder-id="' + array[j].id.split("/")[2] + '" parentid="'+ array[j].parent +'" type="'+ array[j].type +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="checkbox"   name="firstInnChkBox" parentPath="/" folderPath="/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox" /><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span title="'+folderHover +'" style="font-size:initial;margin-left: 12px;">&nbsp;&nbsp;' + data[i].objectName + '</span></p>';
                    else {
                        if (_folderName >= 23) {
                            if (j === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" disabled="disabled" parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="' + folderHover + '" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input  type="radio" disabled="disabled"  parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="' + folderHover + '" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        } else if (j === 14)
                            _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input  disabled="disabled"  type="radio" parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio"  disabled="disabled"  parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                    }
                }
            }
            _html += '</div>';
            if($(thisevent).hasClass('fa-angle-up')|| triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                if ((triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") && (data[0].nextPageToken == "" || data.length < 20)) {
                    $(thisevent).find('.active').append(_html);
                    $(thisevent).find('.active').addClass('ended');
                } else if (triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                    $(thisevent).find('.active').append(_html);
                } else {
                    if (data.length < 20)
                        $(thisevent).parents('.fldr_parent').addClass('ended');
                    $(thisevent).parents('.fldr_parent').append(_html);
                }
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#folderLoading').css("display", "none");
                $(thisevent).parents('.fldr_parent').css('padding-bottom','0%');
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#textSpan').css("display", "");
                if ($(thisevent).find('.active').children('.usr-data').siblings().find('input[name="srccheckBox"]:checked').length) {
                    $(thisevent).find('.active').children('.fldr_parent1').find('input').prop("checked", true).attr('disabled', true);
                }
                if ($(thisevent).parent().siblings().find('input[name="srccheckBox"]:checked').length) {
                    $(thisevent).parents('.fldr_parent').children('.fldr_parent1').find('input').prop("checked", true).attr('disabled', true);
                }
            }
        }
    });
    $(thisevent).parent('.usr-data').addClass('haschild');

}
function scrollDataList(thisevent, pgno,nxtToken,email){
    var triggeredclass = $(thisevent).attr('id');
    var  pgNo = pgno;
    var  pgSize = 20;
    var _userId = localStorage.getItem("UserId");
    var _folderId = encodeURIComponent('/');
    var cloudname = $(thisevent).find('.clickeddiv').parents('.fldr_parent').find('span').attr('cloudname');
    var _cloudId = $(thisevent).find('.active .clickeddiv').attr('user-id');
    if((localStorage.getItem('multiUsrSrcCldName') === "DROPBOX_BUSINESS")|| (localStorage.getItem('multiUsrDstnCldName') === "DROPBOX_BUSINESS") || (localStorage.getItem('multiUsrSrcCldName') === "GOOGLE_SHARED_DRIVES"))
        var apiurl = apicallurl + "/filefolder/userId/" + _userId + "/cloudId/" + _cloudId + "?folderId="+_folderId+"&page_nbr="+pgNo+"&page_size=" + pgSize + "&nextPreviousId=" + nxtToken;
    else
        var apiurl = apicallurl + "/filefolder/userId/" + _userId + "/cloudId/" + _cloudId + "?page_nbr="+pgNo+"&page_size=" + pgSize + "&nextPreviousId=" + nxtToken;
    $.ajax({
        type: "GET",
        url: apiurl,
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Content-Type":"application/json",
        },
        success: function (data) {
            console.log(data);
            if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')) {
                $(thisevent).parents('#srcUsrs').find('.usr-data').removeClass('scrollActive');
            }
            else{
                $(thisevent).parents('#dstnUsrs').find('.usr-data').removeClass('scrollActive');

            }
            if(data.length == 0){
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#folderLoading').css("display","none");
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#textSpan1').css("display","block").css("margin-left","12%").css("margin-top","-7%");

            }
            if(data.length === 0){
                _html = '<div class="fldr_parent1" nxtpgtoken="' + null + '" pgno="1">';
            }
            else{
		var dataLen = data.length -1;
                _html = '<div class="fldr_parent1" nxtpgtoken="'+data[dataLen].nextPageToken+'" pgno="1">';
		}
            var array = [];
            for(var i=0;i<data.length;i++){
                var createdTime = CFManageCloudAccountsAjaxCall.getDateConversion(data[i].createdTime);
                var folderSize = CFManageCloudAccountsAjaxCall.getObjectSize(data[i].folderContentSize);
                var _foldrName = data[i].objectName.length;
                var foldrHover = data[i].objectName;
                if(folderSize === "___"){
                    folderSize =0;
                }
                var titleBar = 'Size : '+folderSize+'&#13Date : '+createdTime;
                if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && data[i].type == 'SITE')
                {
                    array.push(data[i]);


                }
                else if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && (data[i].type == 'FOLDER'||data[i].type=="DOCUMENT_LIBRARY")) {
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
                        _html += '<p style="display:block;margin-left:22px;width:100%;" class="usr-data"><span user-id="' + data[i].cloudId + '" fromCloudId="' + data[i].cloudId + '" _folderid="' + data[i].id.split("/")[1] + '" folder-id="' + data[i].id.split("/")[2] + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" class="folderChkBox"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span title="' + foldrHover + '" style="font-size:initial;">&nbsp;&nbsp;' + data[i].objectName + '</span></p>';
                    else {
                        if (_foldrName >= 23) {
                            if (i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover + '" style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover + '" style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        } else if (i === 14)
                            _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>'; 
                        else
                            _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="' + data[i].cloudName + '" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + data[i].id + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + data[i].objectName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:16px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                    }
                }
                else if(data[i].type == 'FOLDER'|| data[i].type == 'DRIVE'||data[i].type == 'DOCUMENT_LIBRARY') {
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')){
                        var _obj ={
                            "id":data[i].id,
                            "cloudId":data[i].cloudId,
                        };
 			 var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(/\//g,"-");
                        var _objName = objName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var foldrHover1 = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var dataId = data[i].id;
			dataId = dataId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        if(fldrStorage(_obj,'check1')){
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"   checked="checked"/>';
                            }
                            else
                            var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"   checked="checked"/>';
                        }
                        else{
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+dataId  +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"/>';
                            }
                            else
                            var input = '<input type="checkbox"  name="firstInnChkBox" parentPath="/" folderPath="/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ dataId +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox"/>';
                        }
                       if(data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId  + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId  + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span  name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span  name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;padding-left: 7px;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                        else{
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="'+data[i].nextPageToken+'"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + dataId + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }

                    }
                    else {
                       var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(/\//g,"-");
                        var _objName = objName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var foldrHover1 = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                      var dataId = data[i].id;
			dataId = dataId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        if (data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudname === "GOOGLE_SHARED_DRIVES") {
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;padding-left: 7px;top: 65%;left: 11%;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;"><span style="position: absolute;">Loading...</span></span></span></p>';
                        } else {
                            if(_foldrName >= 23) {
                                if(i === 14)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan" title="' + foldrHover1 + '" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + data[i].nextPageToken + '"><span name="'+data[i].cloudName +'" user-id="' + data[i].cloudId + '" toCloudId="' + data[i].cloudId + '" folder-id="' + dataId + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="/" folderPath="/' + _objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><i class="lnil lnil-folder" style="height: 15px;width: 15px;margin-left: 7px;margin-right: -3px;margin-top: -2px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(_objName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                    }
                }
                else
                    _html += '<p style="cursor:default;display:block;width:100%;margin:5px 0px 5px 45px;"><span user-id="'+data[i].cloudId+'" toCloudId="'+data[i].cloudId+'" folder-id="'+data[i].id+'"></span><i class="lnil lnil-files" style="height: 18px;width: 18px;margin-left: 10px;margin-right: -3px;margin-top: -2px;"></i><span style="font-size:initial;" title="'+data[i].objectName+'">&nbsp;&nbsp;'+CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23)+'</span></p>';
            }
            if(array.length !== 0 ){

                for(var j=0;j<array.length;j++){
                    var folderHover = array[j].objectName;
                    var _folderName = array[j].objectName.length;
			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = array[j].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	folderHover = folderHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
                        _html += '<p style="display:block;margin-left:40px;width:100%;" class="usr-data"><span user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" _folderid="' + array[j].id.split("/")[1] + '" folder-id="' + array[j].id.split("/")[2] + '" parentid="'+ array[j].parent +'" type="'+ data[j].type +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="checkbox"   name="firstInnChkBox" parentPath="/" folderPath="/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" class="folderChkBox" /><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span title="'+folderHover +'" style="font-size:initial;margin-left: 12px;">&nbsp;&nbsp;' + data[i].objectName + '</span></p>';
                    else {
                        if (_folderName >= 23) {
                            if (j === 14)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input  type="radio"  disabled="disabled"  parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="' + folderHover + '" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" disabled="disabled"  parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="' + folderHover + '" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        } else if (j === 14)
                            _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input  disabled="disabled"  type="radio" parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data" nextPageToken="' + array[j].nextPageToken + '"><span name="' + array[j].cloudName + '" user-id="' + array[j].cloudId + '" toCloudId="' + array[j].cloudId + '" folder-id="' + array[j].id + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio"  disabled="disabled" parentPath="/" folderPath="/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(array[j].objectName, 23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                    }
                }
            }
            _html += '</div>';
            if($(thisevent).hasClass('fa-angle-up')||triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                if ((triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") && (data[0].nextPageToken == "" || data.length < 20)) {
                    $(thisevent).find('.active').append(_html);
                    $(thisevent).find('.active').addClass('ended');
                } else if (triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                    $(thisevent).find('.active').append(_html);
                } else {
                    if (data.length < 20)
                        $(thisevent).parents('.fldr_parent').addClass('ended');
                    $(thisevent).parents('.fldr_parent').append(_html);
                }
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#folderLoading').css("display", "none");
                $(thisevent).parents('.fldr_parent').css('padding-bottom','0%');
                $(thisevent).parent('.usr-data').parent().siblings().siblings().siblings().find('span#textSpan').css("display", "");
                if ($(thisevent).find('.active').children('.usr-data').siblings().find('input[name="srccheckBox"]:checked').length) {
                    $(thisevent).find('.active').children('.fldr_parent1').find('input[type="checkbox"]').prop("checked", true).attr('disabled', true);
                }
                if ($(thisevent).parent().siblings().find('input[name="srccheckBox"]:checked').length) {
                    $(thisevent).parents('.fldr_parent').children('.fldr_parent1').find('input[type="checkbox"]').prop("checked", true).attr('disabled', true);
                }
            }
        }
    });
    $(thisevent).parent('.usr-data').addClass('haschild');

}

$(document).on('click','#dstnFolderScroll .forDomainNameMin .fa-angle-down.usr-folder',function(){
    $('#dstnFolderScroll .fldr_parent').find('span#folderLoading').css("display","none");
    $(this).parents('.fldr_parent').css('padding-bottom','0%');
    $('#dstnFolderScroll .fldr_parent').removeClass('active ended');
    $('#dstnFolderScroll .fldr_parent').find('> .fldr_parent1').html('');
    $('#dstnFolderScroll .fldr_parent').find('.usr-folder').removeClass('fa-angle-up').addClass('fa-angle-down');
    $('#dstnFolderScroll .fldr_parent').parents('.className').find('.active').removeClass('active');
    $('#dstnFolderScroll .fldr_parent').find('.clickeddiv').removeClass('clickeddiv');
    $(this).parents('.fldr_parent').addClass('active');
    $(this).addClass('clickeddiv');
    //$(this).parents('.fldr_parent.active').find('span').css('display','none');
    $(this).parents('.fldr_parent.active').find('span#folderLoading').css("display","");
    $(this).parents('.fldr_parent').css('padding-bottom','10%');
    var pgno = $(this).parents('.fldr_parent').attr('pgno');
    var email = $(this).parents('.fldr_parent.active').find('.usr-folder').attr('useremail');
    /* if(!$(this).parent('.usr-data').hasClass('haschild')) {
         dataList(this, pgno,'',email);
     }
     else{
         $(this).parents('.fldr_parent.active').find('span').css('display','').css("margin-left","2%");
         $(this).parents('.fldr_parent.active').find('span#folderLoading').css("display","none");
     }*/
    dataList(this, pgno,'',email);
    // $(this).parents('.fldr_parent').nextAll().hide();
    $('.pagination.p1').show();
    // $(this).parents('.fldr_parent').find('> .fldr_parent1').show();
    if($('#srcCloudUsers input[name="srccheckBox"]:checked').length){
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="firstInnChkBox"]').prop( "checked", true).attr('disabled',true);
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", true).attr('disabled',true);
    }
    else{
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="firstInnChkBox"]').prop( "checked", false).attr('disabled',false);
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", false).attr('disabled',false);
    }
    $(this).removeClass('fa-angle-down').addClass('fa-angle-up');
    $(this).parents('.fldr_parent').find('.fldr_parent1 > .usr-data').show();
    flagclicked = '1';
    return false;
});
$(document).on('click','#dstnFolderScroll .forDomainNameMin .fa-angle-up.usr-folder',function() {
    $(this).parent('.usr-data').parent().siblings().siblings().siblings().find('span#folderLoading').css("display","none");
    $(this).parents('.fldr_parent').css('padding-bottom','0%');
    $(this).parents('.fldr_parent').find('.fldr_parent1').remove();
    $(this).parents('.fldr_parent').removeClass('active');
    $(this).parents('.className').find('.active').removeClass('active');
    $(this).parents('.fldr_parent').find('.clickeddiv').removeClass('clickeddiv');
    $(this).removeClass('clickeddiv');
    $(this).parents('.fldr_parent').find('.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
    $(this).parents('.fldr_parent').find('.fa-caret-right').css('color','gray');
    $(this).removeClass('fa-angle-up').addClass('fa-angle-down');
    $(this).parents('.fldr_parent').siblings().show();
    return false;
});
$(document).on('click','#srcFolderScroll .forDomainNameMin .fa-angle-down.usr-folder',function(){
    $('#srcFolderScroll .fldr_parent').find('span#folderLoading').css("display","none");
    $(this).parents('.fldr_parent').css('padding-bottom','0%');
    $('#srcFolderScroll .fldr_parent').removeClass('active ended');
    $('#srcFolderScroll .fldr_parent').find('> .fldr_parent1').remove();
    $('#srcFolderScroll .fldr_parent').find('.usr-folder').removeClass('fa-angle-up').addClass('fa-angle-down');
    $('#srcFolderScroll .fldr_parent').parents('.className').find('.active').removeClass('active');
    $('#srcFolderScroll .fldr_parent').find('.clickeddiv').removeClass('clickeddiv');
    $(this).parents('.fldr_parent').addClass('active');
    $(this).addClass('clickeddiv');
    //$(this).parents('.fldr_parent.active').find('span').css('display','none');
    $(this).parents('.fldr_parent.active').find('span#folderLoading').css("display","");
    $(this).parents('.fldr_parent.active').css('padding-bottom','10%');
    var pgno = $(this).parents('.fldr_parent').attr('pgno');
    var email = $(this).parents('.fldr_parent.active').find('.usr-folder').attr('useremail');
    /* if(!$(this).parent('.usr-data').hasClass('haschild')) {
         dataList(this, pgno,'',email);
     }
     else{
         $(this).parents('.fldr_parent.active').find('span').css('display','').css("margin-left","3%");
         $(this).parents('.fldr_parent.active').find('span#folderLoading').css("display","none");
     }*/
    dataList(this, pgno,'',email);
    // $(this).parents('.fldr_parent').nextAll().hide();
    $('.pagination.p1').show();
    // $(this).parents('.fldr_parent').find('> .fldr_parent1').show();

    $(this).removeClass('fa-angle-down').addClass('fa-angle-up');
    $(this).parents('.fldr_parent').find('.fldr_parent1 > .usr-data').show();
    flagclicked = '1';
    return false;
});
$(document).on('click','#srcFolderScroll .forDomainNameMin .fa-angle-up.usr-folder',function() {
    $(this).parent('.usr-data').parent().siblings().siblings().siblings().find('span#folderLoading').css("display","none");
    $(this).parents('.fldr_parent').css('padding-bottom','0%');
    $(this).parents('.fldr_parent').find('.fldr_parent1').remove();
    $(this).parents('.fldr_parent').removeClass('active');
    $(this).parents('.fldr_parent').removeClass('opened');
    $(this).parents('.className').find('.active').removeClass('active');
    $(this).parents('.fldr_parent').find('.clickeddiv').removeClass('clickeddiv');
    $(this).removeClass('clickeddiv');
    $(this).parents('.fldr_parent').find('.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
    $(this).parents('.fldr_parent').find('.fa-caret-right').css('color','gray');
    $(this).removeClass('fa-angle-up').addClass('fa-angle-down');
    $(this).parents('.fldr_parent').siblings().show();
    return false;
});
$('#srcFolderScroll,#dstnFolderScroll').on('scroll', function() {
    if ($('#srcFolderScroll').find('.scrollActive').length ||$('#dstnFolderScroll').find('.scrollActive').length) {
        if ($(this).attr('id') === "srcFolderScroll") {
           if($('#srcFolderScroll').find('.scrollActive').length !== 0) {
                if ($('#srcFolderScroll').find('.scrollActive').position() !== undefined) {
                    if ($('#srcFolderScroll').find('.scrollActive').position().top)
                        var position = $('#srcFolderScroll').find('.scrollActive').position().top;
                }
            }
        } else {
            if($('#dstnFolderScroll').find('.scrollActive').length !== 0) {
                if ($('#dstnFolderScroll').find('.scrollActive').position() !== undefined) {
                    if ($('#dstnFolderScroll').find('.scrollActive').position().top)
                        var position = $('#dstnFolderScroll').find('.scrollActive').position().top;
                }
            }
        }
    }

    if ( $(this).scrollTop() + $(this).innerHeight()  > position){
        /* if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-$(this)[0].scrollHeight/2) {*/
        if(flagclicked == '1') {
            flagclicked = '0';
            return false;
        }
        var pgno = parseInt($(this).find('.active').attr('pgno'));
        var email = $(this).find('.clickeddiv').siblings('input').attr('usremail');//$(this).parents('.fldr_parent').find('.usr-folder').attr('useremail');
        var folderPath = $(this).find('.clickeddiv').siblings('input').attr('folderpath');
        pgno += 1;
        $(this).find(".active").attr('pgno', pgno);
        if ($(this).find('.clickeddiv').parents('.fldr_parent').hasClass('active')) {
            var nxtToken = encodeURIComponent($(this).find('.clickeddiv').parents('.fldr_parent').children('.fldr_parent1:last').attr('nxtpgtoken'));
        } else {
            var nxtToken = encodeURIComponent($(this).find('.clickeddiv').siblings('.fldr_parent1:last').attr('nxtpgtoken'));
        }
        if(nxtToken === "null" || nxtToken === "" || nxtToken === undefined || nxtToken === "undefined"){
            return false;
        }
        else {
            if($(this).find('.clickeddiv').parents('.fldr_parent').hasClass('active')) {
                var email = $(this).find('.clickeddiv').attr('useremail');
                scrollDataList(this, pgno, nxtToken, email);
            }
            else {
                scrollSubDataList(this, pgno, email, folderPath,nxtToken);

            }
        }

        if ($('#srcCloudUsers input[name="srccheckBox"]:checked').length) {
            $('.fldr_parent').children('.fldr_parent1.active').find('input[type="checkbox"]').prop("checked", true).attr('disabled', true);
        }

        if ($(this).find('.clickeddiv').siblings('input[type="checkbox"]').is(':checked')) {
            $(this).find('.clickeddiv').siblings('.fldr_parent1').find('input[type="checkbox"]').prop("checked", true).attr('disabled', true);
        }
        return false;
    }
});
 var _parentName;
function subDataList(thisevent, pgno,email,folderPath)
{
    var triggeredclass = $(thisevent).attr('id');
    var _cloudId = $(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('user-id');
    var _folderId = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('folder-id'));
    var _parentId = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('parentid'));
    var _userId = localStorage.getItem("UserId");
    var  pgNo = pgno;
    var  pgSize = 10;
   var _parentType = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('folder-type'));
	if(_parentType === "SITE"||_parentType === "DOCUMENT_LIBRARY"){
 	_parentName = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('folder-name'));
    
	}
	var apiurl = apicallurl + "/filefolder/userId/"+_userId+"/cloudId/"+_cloudId+"?folderId="+_folderId+"&parentId="+_parentId+"&pageNo="+pgNo+"&page_size="+pgSize;
    $.ajax({
        type: "GET",
        url: apiurl,
        //async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Content-Type":"application/json",
        },
        success: function (data) {
            console.log(data);
            /*     if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')) {
                     $(thisevent).parents('#srcUsrs').find('.usr-data').removeClass('scrollActive');
                 }
                 else{
                     $(thisevent).parents('#dstnUsrs').find('.usr-data').removeClass('scrollActive');

                 }*/
            if (data.length == 0) {
                $(thisevent).siblings('#folderLoading').css('display', 'none');
                $(thisevent).siblings('.fldr_parent1').remove();
                $(thisevent).siblings("#textSpan").css('display', '');
            }
            if(data.length === 0){
                _html = '<div class="fldr_parent1" nxtpgtoken="' + null + '" pgno="1">';
            }
            else {
                $(thisevent).siblings('.fldr_parent1').remove();
		var dataLen = data.length -1;
                _html = '<div class="fldr_parent1" nxtpgtoken="' + data[dataLen].nextPageToken + '" pgno="1">';
            }
            var array = [],array1=[];
            for (var i = 0; i < data.length; i++) {
                var createdTime = CFManageCloudAccountsAjaxCall.getDateConversion(data[i].createdTime);
                var folderSize = CFManageCloudAccountsAjaxCall.getObjectSize(data[i].folderContentSize);
                var _foldrName = data[i].objectName.length;
                var foldrHover = data[i].objectName;
                if(folderSize === "___"){
                    folderSize =0;
                }
                var titleBar = 'Size : '+folderSize+'&#13Date : '+createdTime;
                if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && data[i].type == 'SITE')
                  {
                      array.push(data[i]);

                }
                else if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && (data[i].type == 'FOLDER'||data[i].type=="DOCUMENT_LIBRARY")) {
			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	foldrHover = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
		        _html += '<p style="display:block;margin-left:22px;width:100%;" class="usr-data"><span user-id="' + data[i].cloudId + '" fromCloudId="' + data[i].cloudId + '" _folderid="' + data[i].id.split("/")[1] + '" folder-id="' + data[i].id + '" parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;font-size: 20px;color: gray;"></span><input type="checkbox" name="folderSubChkBox" parentPath="' + folderPath + '" folderPath="' + folderPath + '/' + objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderSubChkBox"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 3px;margin-right: -5px;position:relative;bottom:1px;"><span title="' + foldrHover + '" style="font-size:initial;width:100%;">&nbsp;&nbsp;' + objName + '</span></p>';
                    else{
		    	if(data[i].objectName === "Documents"){
                        if(_foldrName >= 23) {
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' +objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                        else
                        if(i === 9)
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                    }
		    
		else{
		array1.push(data[i]);
		}
		
		}
                }
                else if(data[i].type == 'FOLDER'||data[i].type == 'DRIVE'||data[i].type == 'DOCUMENT_LIBRARY') {
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')){
                        var _obj ={
                            "id":data[i].id,
                            "cloudId":data[i].cloudId,
                        };

                        var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(/\//g,"-");
                        var _objName = objName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var foldrHover1 = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                      	folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			 if(fldrStorage(_obj,'check1')){
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){

                                var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ _objName  +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"  checked="true"/>';
                            }
                            else
			 var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName+'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"  checked="true"/>';
                        }
                        else{
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"/>';
                            }
                            else 
						var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"/>';
                        }
                        if(data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                        else{
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                    }
                    else{
                        if(data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  title="'+foldrHover+'"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  title="'+foldrHover+'"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                        else{
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                    }
                }
                else
                    _html += '<p style="display:block;margin:5px 0px 5px 10px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" fromCloudId="'+data[i].cloudId+'" folder-id="'+data[i].id+'" style="cursor:pointer"></span><img src="../images/icons/file.png" style="height: 18px;width: 18px;margin-left: 10px;margin-right: -3px;"><span style="font-size:initial;" title="'+data[i].objectName+'">&nbsp;&nbsp;'+CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23)+'</span></p>';
            }
		if(array1.length !==0){
			for(var k=0;k<array1.length;k++){
		  var _folderName = array1[k].objectName.length;
		 var folderHover = array1[k].objectName;
				var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = array1[k].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	folderHover = folderHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			if(_folderName >= 23) {
                            if(k === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                        else
                        if(k === 9)
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';


		}
		}
            if(array.length !== 0 ){

                for(var j=0;j<array.length;j++){
                    var folderHover = array[j].objectName;
                    var _folderName = array[j].objectName.length;
			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = array[j].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	folderHover = folderHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
                        _html += '<p style="display:block;margin-left:10px;width:100%;" class="usr-data"><span user-id="' + array[j].cloudId+'" fromCloudId="' + array[j].cloudId + '" _folderid="' + array[j].id.split("/")[1] + '" folder-id="' + array[j].id + '" parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;font-size: 20px;color: gray;"></span><input type="checkbox" name="folderSubChkBox" parentPath="' + folderPath + '" folderPath="' + folderPath + '/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" class="folderChkBox" /><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i>><span title="' + folderHover + '" style="font-size:initial;margin-left: 12px;width:100%;">&nbsp;&nbsp;' + objName + '</span></p>';
                    else{
                        if(_folderName >= 23) {
                            if(j === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio"  disabled="disabled"  parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" disabled="disabled"  parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                        else
                        if(j === 9)
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input  disabled="disabled"   type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" disabled="disabled"  parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                    }
                }
            }
            _html += '</div>';
            if ($(thisevent).hasClass('fa-caret-down')|| triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                if ((triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") && (data[0].nextPageToken == "" || data.length < 10)) {
                    $(thisevent).find('.clickeddiv').parent('.usr-data').append(_html);
                    $(thisevent).find('.active').addClass('ended');
                } else if (triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                    $(thisevent).find('.clickeddiv').parent('.usr-data').append(_html);
                } else {
                    if (data.length < 10) {
                        $(thisevent).parents('.fldr_parent').addClass('ended');
                        $(thisevent).parents('.fldr_parent1').css('display', '')
                    }

                    $(thisevent).parent('.usr-data').append(_html);
                }
                $(thisevent).siblings('#folderLoading').css('display', 'none');
                //  $(thisevent).siblings("#textSpan").css("display","");
                if ($('#srcCloudUsers input[name="srccheckBox"]:checked').length) {
                    $(thisevent).parents('.fldr_parent').children('.clickeddiv').siblings('input[name="firstInnChkBox"]').prop("checked", true).attr('disabled', true);
                    $(thisevent).parents('.fldr_parent').children('.clickeddiv').siblings('input[name="folderSubChkBox"]').prop("checked", true).attr('disabled', true);
                }

                if ($('#srcCloudUsers input[name="firstInnChkBox"]:checked').length) {
                    $(thisevent).parents('.fldr_parent1').children('.clickeddiv').siblings('input[name="folderSubChkBox"]').prop("checked", true).attr('disabled', true);
                }

                if ($(thisevent).siblings('input[type="checkbox"]').is(':checked')) {
                    $(thisevent).siblings('.fldr_parent1').find('input[type="checkbox"]').prop("checked", true).attr('disabled', true);
                }
            }
        }
    });
    $(thisevent).parent('.usr-data').addClass('haschild');
}
function scrollSubDataList(thisevent, pgno,email,folderPath,nxtToken)
{
    var triggeredclass = $(thisevent).attr('id');
    var _cloudId = $(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('user-id');
    var _folderId = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('folder-id'));
    var _parentId = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('parentid'));
    var _userId = localStorage.getItem("UserId");
    var  pgNo = pgno;
    var  pgSize = 10;
 var _parentType = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('folder-type'));
	if(_parentType === "SITE"||_parentType === "DOCUMENT_LIBRARY"){
 	_parentName = encodeURIComponent($(thisevent).parents('.mapp-blck').find('.clickeddiv').attr('folder-name'));
    
	}
    if((localStorage.getItem('multiUsrSrcCldName') === "DROPBOX_BUSINESS") || (localStorage.getItem('multiUsrDstnCldName') === "DROPBOX_BUSINESS")||(localStorage.getItem('multiUsrSrcCldName') === "GOOGLE_SHARED_DRIVES"))
        var apiurl = apicallurl + "/filefolder/userId/" + _userId + "/cloudId/" + _cloudId + "?folderId="+_folderId+"&pageNo="+pgNo+"&page_size=" + pgSize + "&nextPreviousId=" + nxtToken;
    else
        var apiurl = apicallurl + "/filefolder/userId/" + _userId + "/cloudId/" + _cloudId + "?pageNo="+pgNo+"&page_size=" + pgSize + "&nextPreviousId=" + nxtToken;
    $.ajax({
        type: "GET",
        url: apiurl,//apicallurl + "/getfiles/files/"+_cloudId+"?" + "folderId="+_folderId+"&pageNo=1&pageSize=5",
        async: false,
        headers: {
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Content-Type":"application/json",
        },
        success: function (data) {
            console.log(data);
            if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')) {
                $(thisevent).parents('#srcUsrs').find('.usr-data').removeClass('scrollActive');
            }
            else{
                $(thisevent).parents('#dstnUsrs').find('.usr-data').removeClass('scrollActive');

            }
            if (data.length == 0) {
                $(thisevent).siblings('#folderLoading').css('display', 'none');
                $(thisevent).siblings("#textSpan").css('display', '');
            }
            if(data.length === 0){
                _html = '<div class="fldr_parent1" nxtpgtoken="' + null + '" pgno="1">';
            }
            else{
		var dataLen = data.length -1;
                _html = '<div class="fldr_parent1" nxtpgtoken="' + data[dataLen].nextPageToken + '" pgno="1">';
		}
            var array = [],array1=[];
	    for (var i = 0; i < data.length; i++) {
                var createdTime = CFManageCloudAccountsAjaxCall.getDateConversion(data[i].createdTime);
                var folderSize = CFManageCloudAccountsAjaxCall.getObjectSize(data[i].folderContentSize);
                var _foldrName = data[i].objectName.length;
                var foldrHover = data[i].objectName;
                if(folderSize === "___"){
                    folderSize =0;
                }
                var titleBar = 'Size : '+folderSize+'&#13Date : '+createdTime;
                if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && data[i].type == 'SITE')
                {
                                array.push(data[i]);
                }
            else if(data[i].cloudName == 'SHAREPOINT_ONLINE_BUSINESS' && (data[i].type == 'FOLDER'||data[i].type=="DOCUMENT_LIBRARY")) {
			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = data[i].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	foldrHover = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
		        _html += '<p style="display:block;margin-left:22px;width:100%;" class="usr-data"><span user-id="' + data[i].cloudId + '" fromCloudId="' + data[i].cloudId + '" _folderid="' + data[i].id.split("/")[1] + '" folder-id="' + data[i].id + '" parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="' + data[i].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;font-size: 20px;color: gray;"></span><input type="checkbox" name="folderSubChkBox" parentPath="' + folderPath + '" folderPath="' + folderPath + '/' + objName + '" cldname="' + data[i].cloudName + '"cloudid="' + data[i].cloudId + '" rtfolid="' + data[i].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" name="folderSubChkBox"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 3px;margin-right: -5px;position:relative;bottom:1px;"><span title="' + foldrHover + '" style="font-size:initial;width:100%;">&nbsp;&nbsp;' + objName + '</span></p>';
                    else{
		    	if(data[i].objectName === "Documents"){
                        if(_foldrName >= 23) {
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' +objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                        else
                        if(i === 9)
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + data[i].type + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                    }
		    
		else{
		array1.push(data[i]);
		}
		}
                }
                else if(data[i].type == 'FOLDER'||data[i].type == 'DRIVE'||data[i].type == 'DOCUMENT_LIBRARY') {
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs')){
                        var _obj ={
                            "id":data[i].id,
                            "cloudId":data[i].cloudId,
                        };
                      var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
			var hypen = "/";
                        var objName = data[i].objectName.replace(/\//g,"-");
                        var _objName = objName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
			var foldrHover1 = foldrHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        if(fldrStorage(_obj,'check1')){
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ _objName   +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"  checked="true"/>';
                            }
                            else
						var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName+'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"  checked="true"/>';
                        }
                        else{
                            if(data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                                var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ _objName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"/>';
                            }
                            else 
						var input = '<input type="checkbox" name="folderSubChkBox" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderSubChkBox"/>';
                        }

                   if(data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                        else{
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover1+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span>'+input+'<img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(foldrHover1,23) + '</span><span id="folderLoading" style="top: 65%;left: 11%;position: absolute;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                    }
                    else{
                        if(data[i].cloudName === "DROPBOX_BUSINESS" || data[i].cloudName === "GOOGLE_SHARED_DRIVES"){
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  title="'+foldrHover+'"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  title="'+foldrHover+'"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;position:relative;margin-bottom: 6%;width:100%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        }
                        else{
                            if(_foldrName >= 23) {
                                if(i === 9)
                                    _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                                else
                                    _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan" title="'+foldrHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                            }
                            else
                            if(i === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+data[i].cloudName +'" user-id="'+data[i].cloudId+'" fromCloudId="'+data[i].cloudId+'" folder-id="' + data[i].id + '" parentid="'+ data[i].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ data[i].objectName +'" cldname="'+ data[i].cloudName +'"cloudid="'+ data[i].cloudId +'" rtfolid="'+ data[i].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 10px;margin-right: -3px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                    }
                }
                else
                    _html += '<p style="display:block;margin:5px 0px 5px 10px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span fromCloudId="'+data[i].cloudId+'" folder-id="'+data[i].id+'" style="cursor:pointer"></span><img src="../images/icons/file.png" style="height: 18px;width: 18px;margin-left: 10px;margin-right: -3px;"><span style="font-size:initial;" title="'+data[i].objectName+'">&nbsp;&nbsp;'+CFManageCloudAccountsAjaxCall.getMaxChars(data[i].objectName,23)+'</span></p>';
            }
		if(array1.length !==0){
			for(var k=0;k<array1.length;k++){
			var _folderName = array1[k].objectName.length;
 			var folderHover = array1[k].objectName;
				var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = array1[k].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	folderHover = folderHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
 			if(_folderName >= 23) {
                            if(k === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                        else
                        if(k === 9)
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array1[k].cloudName +'" user-id="'+array1[k].cloudId+'" fromCloudId="'+array1[k].cloudId+'" folder-id="' + array1[k].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array1[k].type + '" parentid="'+ array1[k].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 12%;color: gray;font-size: 20px;"></span><input type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array1[k].cloudName +'"cloudid="'+ array1[k].cloudId +'" rtfolid="'+ array1[k].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;" name="folderradiobtn"/><img src="../images/icons/folder.png" style="height: 15px;width: 15px;margin-left: 5px;margin-right: -6px;"><span id="textSpan"  style="font-size:initial;position: absolute;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';


		}
		}
            if(array.length !== 0 ){

                for(var j=0;j<array.length;j++){
                    var folderHover = array[j].objectName;
                    var _folderName = array[j].objectName.length;
			var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var objName = array[j].objectName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        folderPath = folderPath.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                 	folderHover = folderHover.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                    if ($(thisevent).parents('.mapp-blck').hasClass('src-usrs'))
                        _html += '<p style="display:block;margin-left:10px;width:100%;" class="usr-data"><span user-id="' + array[j].cloudId+'" fromCloudId="' + array[j].cloudId + '" _folderid="' + array[j].id.split("/")[1] + '" folder-id="' + array[j].id + '" parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="' + array[j].parent + '" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;font-size: 20px;color: gray;"></span><input type="checkbox" name="folderSubChkBox" parentPath="' + folderPath + '" folderPath="' + folderPath + '/' + objName + '" cldname="' + array[j].cloudName + '"cloudid="' + array[j].cloudId + '" rtfolid="' + array[j].id + '"usremail="' + email + '" style="margin:-2px 0 0 14px;" class="folderChkBox" /><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i>><span title="' + folderHover + '" style="font-size:initial;margin-left: 12px;width:100%;">&nbsp;&nbsp;' + objName + '</span></p>';
                    else{
                        if(_folderName >= 23) {
                            if(j === 9)
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" disabled="disabled"  parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                            else
                                _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio"  disabled="disabled" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan" title="'+folderHover+'" style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                        }
                        else
                        if(j === 9)
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data scrollActive"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input  disabled="disabled"  type="radio" parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';
                        else
                            _html += '<p style="display:block;margin-left:22px;width:100%;position:relative;margin-bottom: 6%;" class="usr-data"><span name="'+array[j].cloudName +'" user-id="'+array[j].cloudId+'" fromCloudId="'+array[j].cloudId+'" folder-id="' + array[j].id + '"  parent-name="' + _parentName + '" folder-name="' + objName + '" folder-type="' + array[j].type + '" parentid="'+ array[j].parent +'" class="usr-folder1 fa fa-caret-right" style="cursor:pointer;margin-left: 5%;color: gray;font-size: 20px;"></span><input type="radio" disabled="disabled"  parentPath="'+folderPath+'" folderPath="'+folderPath+'/'+ objName +'" cldname="'+ array[j].cloudName +'"cloudid="'+ array[j].cloudId +'" rtfolid="'+ array[j].id +'"usremail="'+ email +'" style="margin:-2px 0 0 14px;display: none;" name="folderradiobtn"/><i class="pull-left LVSITE" style="height: 15px;width: 15px;position: relative;left: 45px;"></i><span id="textSpan"  style="font-size:initial;position: absolute;margin-left:26px;width:100%;">&nbsp;&nbsp;' + CFManageCloudAccountsAjaxCall.getMaxChars(objName,23) + '</span><span id="folderLoading" style="position: absolute;top: 65%;left: 11%;padding-left: 7px;display: none;"><img  src="../img/ajax-loader11.gif" alt="img" ><span style="position: absolute;">Loading...</span></span></p>';

                    }
                }
            }
            _html += '</div>';
            if ($(thisevent).hasClass('fa-caret-down')|| triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                if ((triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") && (data[0].nextPageToken == "" || data.length < 10)) {
                    $(thisevent).find('.clickeddiv').parent('.usr-data').append(_html);
                    $(thisevent).find('.active').addClass('ended');
                } else if (triggeredclass == "srcFolderScroll" || triggeredclass == "dstnFolderScroll") {
                    $(thisevent).find('.clickeddiv').parent('.usr-data').append(_html);
                } else {
                    if (data.length < 10) {
                        $(thisevent).parents('.fldr_parent').addClass('ended');
                        $(thisevent).parents('.fldr_parent1').css('display', '')
                    }

                    $(thisevent).parent('.usr-data').append(_html);
                }
                $(thisevent).siblings('#folderLoading').css('display', 'none');
                //  $(thisevent).siblings("#textSpan").css("display","");
                if ($('#srcCloudUsers input[name="srccheckBox"]:checked').length) {
                    $('.fldr_parent').children('.fldr_parent1').find('input[name="firstInnChkBox"]').prop("checked", true).attr('disabled', true);
                    $('.fldr_parent').children('.fldr_parent1').find('input[name="folderSubChkBox"]').prop("checked", true).attr('disabled', true);
                }

                if ($('.fldr_parent').children('.fldr_parent1').children('.fileActive').children('input[type="checkbox"]').is(':checked')) {
                    $('.fldr_parent').children('.fldr_parent1').children('.fileActive').children('.fldr_parent1').find('input').prop("checked", true).attr('disabled', true);
                }

                if ($(thisevent).siblings('input[type="checkbox"]').is(':checked')) {
                    $(thisevent).siblings('.fldr_parent1').find('input[type="checkbox"]').prop("checked", true).attr('disabled', true);
                }
            }
        }
    });
    $(thisevent).parent('.usr-data').addClass('haschild');
}

$(document).on('click','.forDomainNameMin .fldr_parent1 .fa-caret-right',function(){
    $(this).siblings('.fldr_parent1').remove();
    $(this).parents('.className').find('.active').removeClass('active').addClass('opened');
    $(this).closest('.fldr_parent1').addClass('active');
    $(this).parents('.className').find('.clickeddiv').removeClass('clickeddiv').addClass('openeddiv');
    $(this).addClass('clickeddiv');
    //   $(this).siblings('span').css('display','none');
    $(this).siblings('#folderLoading').css('display','');
    $(this).css('margin-bottom', '10px');
    var pgno = $(this).closest('.fldr_parent1').attr('pgno');
    var folderPath = $(this).siblings('input').attr('folderPath');
    var email =$(this).parents('.fldr_parent').find('.usr-folder').attr('useremail');
    /*   if(!$(this).parent('.usr-data').hasClass('haschild')) {
           subDataList(this, pgno,email,folderPath);
       }
       else{
           $(this).siblings('span').css('display','');
           $(this).siblings('#folderLoading').css('display','none');
       }*/
    subDataList(this, pgno,email,folderPath);
    // $(this).parent().siblings().hide();
    // $(this).closest('.fldr_parent1').siblings('.fldr_parent1').hide();
    $(this).parent().find('> .fldr_parent1').remove();


    $(this).parent().find('> .fldr_parent1').find('> .usr-data').remove();
    $(this).removeClass('fa-caret-right').addClass('fa-caret-down');
    $(this).css('color','black');
    flagclicked = '1';
    return false;
});
$(document).on('click','.forDomainNameMin .fldr_parent1 .fa-caret-down',function() {
    $(this).closest('.fldr_parent1').find('.clickeddiv').siblings('#folderLoading').css('display','none');
    $(this).parent('.usr-data').find('.fldr_parent1').remove();
    $(this).parent('.usr-data').siblings('.usr-data:eq(7)').addClass('scrollActive');
    $(this).css('margin-bottom', '0');
    $(this).closest('.fldr_parent1').find('.usr-data > .fa').css('margin-bottom', '0');
    $(this).closest('.fldr_parent1').find('.opened').removeClass('opened');
    $(this).closest('.fldr_parent1').find('.active').removeClass('active');
    $(this).closest('.fldr_parent1').find('.openeddiv').removeClass('openeddiv');
    $(this).closest('.fldr_parent1').find('.clickeddiv').removeClass('clickeddiv');
    $(this).closest('.fldr_parent1').removeClass('active').removeClass('opened');
    $(this).parents('div').eq(1).find('> .usr-data > .openeddiv').removeClass('openeddiv').addClass('clickeddiv');
    $(this).parents('div').eq(1).removeClass('opened').addClass('active');
    $(this).removeClass('clickeddiv').removeClass('openeddiv');
    $(this).parent('.usr-data').find('.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
    $(this).removeClass('fa-caret-down').addClass('fa-caret-right');
    $(this).css('color','gray');
    $(this).parent('.usr-data').siblings().show();
    $(this).closest('.fldr_parent1').siblings('.fldr_parent1').show();
    return false;
});

//CSV file for uploading
$('#csvFileUpload').click(function() {
    sendGAEvents("clicked on CSV upload icon");
	//activecampaign.eventTrack('csv upload',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    document.getElementById("csvFile").value = "";
    $('#csvFile').click();
});
function fileUpload() {
    localStorage.removeItem("selectedMappings");
    localStorage.removeItem('selectedEmail');
    localStorage.removeItem('folderEmail');
    localStorage.removeItem('folderMappings');
    localStorage.removeItem("validator");
    localStorage.removeItem('csvMigrationData');
    if($("#mapdUsers tbody tr").length)
        deleteMapping(true);
    $("#forNextMove").addClass("disabled");
    localStorage.removeItem("csvName");
    var upload = document.getElementById('csvFile').files[0];
    localStorage.setItem("csvName",upload.name);
    $("#CFShowLoading").modal("show");
    $("#CFShowLoading").attr("autoMap","true");
    var reader = new FileReader();
    reader.onload = function() {
        sessionStorage.setItem('result',reader.result);
        sessionStorage.setItem('csvIteration',1);
	localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr('id'));
	localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr('id'));
   csvFileUpld(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"), reader.result);
    };
    reader.readAsText(upload);
};
var noOfMappedCloudPressent;
function csvFileUpld(_srcMapdCldId,_dstnMapdCldId,_fileContent) {
    if($("#mapdUsers tbody tr").hasClass('CsvMapd'))
        deleteCsv();
    var pgNo,pgSize;
    if(pgNo == undefined)
        pgNo = 1;
    pgSize = 30;

    var _data = "sourceCloudId="+_srcMapdCldId+"&destCloudId="+_dstnMapdCldId+"&pageNo="+pgNo+"&pageSize="+pgSize;
    $("#CFShowLoading").modal("show");
	if((localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES")){
	var csvapiUrl = apicallurl + "/mapping/user/path/csv/nonmapped?" + _data;
	}
	else{
	var csvapiUrl = apicallurl + "/mapping/user/path/csv?" + _data;
	}
    $.ajax({
        //async: false,
        type: "POST",
        data:_fileContent,
        //url: apicallurl + "/mapping/user/migration/csv?" + _data,
        url: csvapiUrl,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data, textStatus, xhr) {
            console.log(data);
            var headers = xhr.getAllResponseHeaders().toLowerCase().trim();
            var values = headers.split("\n");
            var count = [];
            for(var i = 0; i < values.length; i++) {
                var hrdValue = values[i].split(': ');
                count[hrdValue[0].trim()] = hrdValue[1].trim();
            }
            var dupLength = count["duplicatecount"];
		var data = data.cfMappingCachesList;
            /*     for(var i=0;i<data.length;i++) {
                     var j=i+1;
                     for (var j; j < data.length; j++) {
                         if (data[i].sourceCloudDetails.emailId == data[j].sourceCloudDetails.emailId || data[i].destCloudDetails.emailId == data[j].destCloudDetails.emailId) {
                             delete data[j];
                         }
                     }
                     function filter_array(data) {
                         var index = -1,
                             arr_length = data ? data.length : 0,
                             resIndex = -1,
                             result = [];

                         while (++index < arr_length) {
                             var value = data[index];

                             if (value) {
                                 result[++resIndex] = value;
                             }
                         }

                         return result;
                     }
                     var data = filter_array(data);
                 }*/
            //deleteMapping();
            $("#mapdUsers tbody").html('');
            $("#srcUsrs").find("div").removeClass('selectedClass');
            $("#dstnUsrs").find("div").removeClass('selectedClass');
            $("#srcUsrs").find("span").removeClass('selectedClass');
            $("#dstnUsrs").find("span").removeClass('selectedClass');
			if(!((localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES"))){
			   $("#srcUsrs input:radio").attr('disabled',false);
            $("#dstnUsrs input:radio").attr('disabled',false);
			}
            $('#paginationMapng').empty();
            $('#paginationMapng').removeData("twbs-pagination");
            $('#paginationMapng').unbind("page");
            if(data.length === 0) {
                alertSuccess("No mappings available in uploaded CSV");
                $(document).find("#chkInput").attr("disabled", true);
                $("#clearBtn").css("pointer-events",'none');
                $("#clearBtn").css("cursor","not-allowed");
                $("#clearBtn").css("opacity","0.6");
                deleteMapping(true);
                $("#CFShowLoading").attr("autoMap","false");
                $("#CFShowLoading").modal("hide");
            }
            else {
                noOfMappedCloudPressent = data[0].noOfMappedCloudPressent;
                var _totPages = Math.ceil(data[0].noOfMappedCloudPressent/$('#mapdUsrs select').val());

                var _txt = 1 + " of " + _totPages;

                $("#mapdUsrs .paginationCF span").last().text(_txt );
                $("#mapdUsrs .paginationCF input").val(1 );

                $('#paginationMapng').twbsPagination({
                    totalPages: _totPages,
                    visiblePages: 6,
                    startPage: 1,
                    next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                    prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
                    first: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
                    last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                    onPageClick: function (event, page) {
                        appendingPrevMapping(page);
                    }
                });

                $(document).find("#chkInput").attr("disabled", false);
                $("#clearBtn").css("pointer-events",'auto');
                $("#clearBtn").css("cursor","pointer");
                $("#clearBtn").css("opacity","1");
                $("#CFShowLoading").attr("autoMap", "true");
                $("#mapdUsers tbody").html('');
                $('.download').css('pointer-events', 'none');
                $('.download').css('opacity', '0.5');
                $('#help').css('visibility', 'hidden');
                $('#csvFileUpload').removeClass('onlyCsv');
                mapdUploadedCsvUrs(data);
                var lngth = $("#mapdUsers tbody tr").length;
                /* if(dupLength > 0)
                 alertSuccess(dupLength +" " + "duplicate entries found");
                alertSuccess(lngth +" " + "pairs are uploaded sucessfully through CSV");*/
            }
            // var _chkCsv = data[0].csv;
            localStorage.setItem("Csv", true);
            localStorage.setItem("csvMigrationData", JSON.stringify(data));
            $.each($('.csvPath'), function(){
                if ($(this).text() != "/" || null) {
                    $('.download').css('pointer-events', 'auto');
                    $('.download').css('opacity', '1');
                    $('#help').css('visibility', 'visible');
                    localStorage.setItem("validator","true");
                }
            });
            if(localStorage.getItem("validator"))
                csvAutoDownload();
            else{
                $("#CFShowLoading").attr("autoMap","false");
                $("#CFShowLoading").modal("hide");
            }
        },
        error: function(err) {
            console.error(err);
        },
	complete: function(xhr){
	if(xhr.status == 404){
 $("#mapdUsers tbody").html('');
	 var headers = xhr.getAllResponseHeaders().toLowerCase().trim();
            var values = headers.split("\n");
            var count = [];
            for(var i = 0; i < values.length; i++) {
                var hrdValue = values[i].split(': ');
                count[hrdValue[0].trim()] = hrdValue[1].trim();
            }
            var exception = count["exception"];
	if(exception == "please upload below 100 pairs"){
	alertSuccess("Maximum of 100 pairs are allowed at a time.");
	   $("#CFShowLoading").attr("autoMap","false");
                $("#CFShowLoading").modal("hide");
	}
	} 
	}
    });
}

function mapdUploadedCsvUrs(data) {
    for(var i=0;i<data.length;i++) {
        $("#mapdUsrs .paginationDiv").css("opacity", "1");
        $('#mapdUsrs .paginationDiv select').prop('disabled', false);
        $('#mapdUsrs .paginationDiv input').prop('disabled', false);
        $("#srcCloudUsers input[cloudid=" + data[i].sourceCloudDetails.id + "]").attr('disabled', true).parent().addClass("selectedClass").parent().addClass("selectedClass");
        $("#dstCloudsUsers input[cloudid=" + data[i].destCloudDetails.id + "]").attr('disabled', true).parent().addClass("selectedClass").parent().addClass("selectedClass");
        $(document).find("#chkInput").attr("disabled", false);
	if((localStorage.getItem("multiUsrSrcCldName")==="DROPBOX_BUSINESS"&& localStorage.getItem("multiUsrDstnCldName") ==="ONEDRIVE_BUSINESS_ADMIN")|| (localStorage.getItem("multiUsrSrcCldName")==="GOOGLE_SHARED_DRIVES"&& localStorage.getItem("multiUsrDstnCldName") ==="SHAREPOINT_ONLINE_BUSINESS") || (localStorage.getItem("multiUsrSrcCldName")==="DROPBOX_BUSINESS"&& localStorage.getItem("multiUsrDstnCldName") ==="GOOGLE_SHARED_DRIVES"))
{
$("#srcCloudUsers input[cloudid=" + data[i].sourceCloudDetails.id + "]").attr('disabled', false).parent().removeClass("selectedClass").parent().removeClass("selectedClass");
$("#dstCloudsUsers input[cloudid=" + data[i].destCloudDetails.id + "]").attr('disabled', false).parent().removeClass("selectedClass").parent().removeClass("selectedClass");
}
        $("#clearBtn").css("pointer-events",'auto');
        $("#clearBtn").css("cursor","pointer");
        $("#clearBtn").css("opacity","1");
        var _obj = {
            "fromCloudId": {
                "id": data[i].sourceCloudId,
            },
            "toCloudId": {
                "id": data[i].destCloudId,
            }
        };
        var EmailObj = {
            "fromMailId": data[i].sourceCloudDetails.emailId,
            "fileName":data[i].sourceCloudDetails.emailId,
            "toMailId": data[i].destCloudDetails.emailId,
            "fromCloudName": data[i].sourceCloudDetails.name,
            "toCloudName": data[i].destCloudDetails.name
        };
        /* if (srcEmail === data[i].sourceCloudDetails.emailId || dstnEmail === data[i].destCloudDetails.emailId) {
             CsvOperation(_obj, 'delete');
         }
         else
             var object = _obj;*/
        var _input;
        if (mappingOptions.localStorageOperation(_obj, 'check'))
            _input = '<td><input type="checkbox" name="inputMapdUrs" checked="true"></td>';
        else
            _input = '<td><input type="checkbox" name="inputMapdUrs"></td>';

        //deleteMapping(true);
        localStorage.removeItem('FolderChecked');
        localStorage.removeItem('CsvEmailChecked');
        var csvName = localStorage.getItem("csvName");
        var src = CFManageCloudAccountsAjaxCall.getMaxChars(data[i].sourceCloudDetails.folderPath, 25);
        var dest = CFManageCloudAccountsAjaxCall.getMaxChars(data[i].destCloudDetails.folderPath, 25);
        var pl = /\</g;
        var pl1 = /\>/g;
        var pl2 = /\"/g;
        var pl3 = /\'/g;
        var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
        var src1 = src.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
        var sourc = data[i].sourceCloudDetails.folderPath;
        var desti = data[i].destCloudDetails.folderPath;
        var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
        var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
        var _html = '<tr style="width: 100%" id="csvRow"  teamFolder="' + data[i].teamFolder +'" csvid="' + data[i].csvId + '" srcemail="' + data[i].sourceCloudDetails.emailId + '" dstnemail="' + data[i].destCloudDetails.emailId + '" sourcAdminCloudId="' + data[i].sourceAdminCloudId + '" destAdminCloudId="' + data[i].destAdminCloudId + '" csvname="' + csvName + '" srccldid="' + data[i].sourceCloudId + '"  srcrt="' + data[i].sourceCloudDetails.rootFolderId + '" dstncldid="' + data[i].destCloudId + '" dstnrt="' + data[i].destCloudDetails.rootFolderId + '" class="CsvMapd" srcPathRootFolderId="' + data[i].sourceCloudDetails.pathRootFolderId + '" srcFolderPath="' + src2 + '"  srcRootFolderId="' + data[i].sourceCloudDetails.rootFolderId + '"  migrateSrcFolderName="' + data[i].sourceCloudDetails.migrateFolderName + '" srcCldName="' + data[i].sourceCloudDetails.name + '"dstnCldName="' + data[i].destCloudDetails.name + '" dstnPathRootFolderId="' + data[i].destCloudDetails.pathRootFolderId + '" dstnRootFolderId="' + data[i].destCloudDetails.rootFolderId + '" dstnFolderPath="' + dest2 + '" migrateDstnFolderName="' + data[i].migrateFolderName + '">' + '<td><input type="checkbox" name="csvMapngCheckBox"></td><td style="width: 45%"><img src="../img/PNG/' + data[i].sourceCloudDetails.name + '.png" alt="pic" class="forImage"><span class="manualPath" title="EmailSrcTitle" style="">' + emailMaxChar(data[i].sourceCloudDetails.emailId, 25) + '</span><br/><span class="csvPath"  style="margin-left: 10%;" title="'+src2+'" data-placement="bottom" style="margin-left: 10%;">' + src1 + '</span></td><td style="width: 48%"><img src="../img/PNG/' + data[i].destCloudDetails.name + '.png" alt="pic" class="forImage"><span class="manualPath" title="EmailDstnTitle">' + emailMaxChar(data[i].destCloudDetails.emailId, 25) + '</span><br/><span class="csvPath" style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></td><td><span style="width: 4%;font-size: inherit;margin-left: -50px;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true" id="closeCsvBtn"></i></span></td></tr>';
        _html = _html.replace('TitleSrce', src2).replace('TitleDstin', dest2).replace('EmailSrcTitle', data[i].sourceCloudDetails.emailId).replace('EmailDstnTitle',  data[i].destCloudDetails.emailId);
        $("#mapdUsers tbody").append(_html);
        /*  var srcEmail = $("#mapdUsers tbody tr:last-child").attr('srcemail');
          var dstnEmail = $("#mapdUsers tbody tr:last-child").attr('dstnemail');*/

        if ($('input[name="inputMapdUrs"]:checked').length == 30){
            $("#chkInput").prop('checked', true);
        }
        else{
            $(document).find("#chkInput").prop("checked", false);
        }



        if (!Number($("#mapdUsrs .paginationCF input").val())) {
            $("#mapdUsrs .paginationCF input").val(1);
            $("#mapdUsrs .paginationCF span").last().text("1 of 1");
        }

    }

    $('[data-toggle="tooltip"]').tooltip();

}
$(document).ready(function(){
    // appendingPrevMapping();
    //  localStorage.removeItem("selMappings");
    localStorage.removeItem('trialUser');
    localStorage.removeItem("validator");
    if(localStorage.getItem("Csv")){
        //deleteMapping(true);
        $('.download').css('pointer-events', 'auto');
        $('.download').css('opacity', '1');
        $('#help').css('visibility', 'visible');
    }
    if($('#mapdUsrs input[name="csvMapngCheckBox"]').prop('checked') == false)
    {
        $('#forNextMove').addClass('disabled');
    }
    $("input[name$='type']").click(function () {
        $("#Timeperiod").css("display","none");
        $("#Timeperiod2").css("display","none");
        $("#DElTA").removeAttr("checked");
        $("#ONEWAY_SYNC").removeAttr("checked");
        $("#TWOWAY_SYNC").removeAttr("checked");
        $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
        $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
        $(".selected_option .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    });
    $("input[name$='type1']").click(function () {
        $("#Timeperiod").css("display","block");
        $("#Timeperiod2").css("display","none");
        $("#ONETIME").removeAttr("checked");
        $("#ONEWAY_SYNC").removeAttr("checked");
        $("#TWOWAY_SYNC").removeAttr("checked");
        $(".dropdown-menu1").css("display","none");
        $("#Timeperiod2 .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
    });
    $("input[name$='type2']").click(function () {
        $("#Timeperiod").css("display","none");
        $("#Timeperiod2").css({"display":"block","top":"60px"});
        $("#ONETIME").removeAttr("checked");
        $("#DElTA").removeAttr("checked");
        $("#TWOWAY_SYNC").removeAttr("checked");
        $("#Timeperiod2 .dropdown-menu1job").css("display","none");
        $("#Timeperiod2 .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
        $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
        $(".selected_option .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(".selected_optionjob span").empty();
    });
    $("input[name$='type3']").click(function () {
        $("#Timeperiod").css("display","none");
        $("#Timeperiod2").css({"display":"block","top":"98px"});
        $("#ONETIME").removeAttr("checked");
        $("#DElTA").removeAttr("checked");
        $("#ONEWAY_SYNC").removeAttr("checked");
        $("#Timeperiod2 .dropdown-menu1job").css("display","none");
        $("#Timeperiod2 .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
        $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
        $(".selected_option .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(".selected_optionjob span").empty();
    });
    $("#SizeVal").bind("cut copy paste",function(e) {
        e.preventDefault();
    });
    $("#fileTypeExc").bind("cut copy paste",function(e) {
        e.preventDefault();
    });

});
/*$(document).on('change', '.mapp-blck input', function(){
    if(($('.src-usrs.mapp-blck input[type="checkbox"]:checked').length > 0) && ($('.dest-usrs.mapp-blck input[type="radio"]:checked').length > 0)) {
        if(!$('#mapdUsrs .fa-exchange').hasClass('disabled'))
        {
            $("#mapdUsers tbody").html('');
            //$('#forNextMove').removeClass('disabled');
            $('#mapdUsrs #csvFileUpload').css({'opacity': '0.5','cursor':'not-allowed'});
            $('#mapdUsrs #csvFileUpload').click(false);
            $('#csvFileUpload').attr('disabled','disabled');
            $('#csvFile').attr('disabled','disabled');
            $('#mapdUsrs .fa-exchange').addClass('disabled');
        }
        var $srcCheckedUsr = $('.src-usrs.mapp-blck input[type="checkbox"]:checked').parents('.fldr_parent').find('.usr-folder');
        var $dstCheckedUsr = $('.dest-usrs.mapp-blck input[type="radio"]:checked').parents('.fldr_parent').find('.usr-folder');
        var fileArray = [];
        $.each($('.src-usrs.mapp-blck input[type="checkbox"]:checked'), function(){
            fileArray.push($(this).parent('.usr-data').children('.usr-folder1').attr('folder-id'));
        });
        var _srcUsrDetails =  {
            "userEmail": $($srcCheckedUsr).attr("useremail"),
            "userCloudName": $($srcCheckedUsr).attr("cloudname"),
            "userCloudId": $($srcCheckedUsr).attr("user-id"),
            "userRtFolId": $($srcCheckedUsr).attr("folder-id"),
            "file":fileArray
        }

        var _dstnUsrDetails =  {
            "dstnUserEmail": $($dstCheckedUsr).attr("useremail"),
            "dstnUserCloudName": $($dstCheckedUsr).attr("cloudname"),
            "dstnUserCloudId": $($dstCheckedUsr).attr("user-id"),
            "dstnUserRtFolId": $($dstCheckedUsr).attr("folder-id"),
            "dstnToRtId":$("#dstCloudsUsers input:radio:checked").parent().find("span").attr("folder-id")
        }
        $($srcCheckedUsr).parent().addClass("selectedClass");
        $($dstCheckedUsr).parent().addClass("selectedClass");
        $('.src-usrs.mapp-blck input[type="checkbox"]:checked').removeAttr('checked');
        $('.dest-usrs.mapp-blck input[type="radio"]:checked').removeAttr('checked');
        mapdSlectedUrs(_srcUsrDetails,_dstnUsrDetails,'prepend');
        var _autoSave = autoSaving(_srcUsrDetails, _dstnUsrDetails);
    }
    else
        $('#forNextMove').addClass('disabled');
});*/
$(document).on('change', 'input[name="csvMapngCheckBox"]', function(){
    //localStorage.removeItem("selectedMappings");
    //localStorage.removeItem('selectedEmail');
    localStorage.removeItem("validator");

    if( $('#mapdUsers input[name= "inputMapdUrs"]').length >0) {
        var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length + $('#mapdUsers input[name="inputMapdUrs"]:checked').length;
        var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length + $('#mapdUsers input[name="inputMapdUrs"]').length;
    }
    else{
        var checkedLength = $('#mapdUsers input[name= "csvMapngCheckBox"]:checked').length;
        var totalLength = $('#mapdUsers input[name="csvMapngCheckBox"]').length;
    }
    if (checkedLength == totalLength) {
        $('#chkInput').prop('checked', true);
    }
    else{
        $('#chkInput').prop('checked', false);
    }
    var _d = $(this).parent().parent();
    var _srcRtFolId, _dstnRtFolId;
    if ($(_d).attr('srcPathRootFolderId') == "null") {
        _srcRtFolId = $(_d).attr('srcRootFolderId');
    }
    else
        _srcRtFolId = $(_d).attr('srcPathRootFolderId');

    var rootId = $(_d).attr('dstnPathRootFolderId');
    if (rootId == "null") {
        _dstnRtFolId = $(_d).attr('dstnRootFolderId');
    }
    else
        _dstnRtFolId = rootId;
    if($(_d).attr('srccldname') ==="DROPBOX_BUSINESS" && $(_d).attr('dstncldname')==="G_SUITE"){
        var obj = {
            "fromCloudId": {
                "id": $(_d).attr('srccldid'),
            },
            "toCloudId": {
                "id": $(_d).attr('dstncldid'),
            },
		"sourceFolderPath": $(_d).attr('srcFolderPath'),
            "destFolderPath": $(_d).attr('dstnFolderPath'),//decodeURI()
            "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
            "teamFolder":$(_d).attr('teamFolder'),
            "isCSV": "true"
        };
    }
    else{
    var obj = {
        "fromCloudId": {
            "id": $(_d).attr('srccldid'),
        },
        "toCloudId": {
            "id": $(_d).attr('dstncldid'),
        },
        "sourceFolderPath":$(_d).attr('srcFolderPath'),//decodeURI($(_d).attr('srcFolderPath'))
        "destFolderPath": $(_d).attr('dstnFolderPath'),//decodeURI($(_d).attr('dstnFolderPath')),
        "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
        "isCSV": "true"
    };
    }
    var EmailObj = {
        "fromMailId": $(_d).attr('srcemail'),
        "fileName":$(_d).attr('srcemail'),
        "toMailId": $(_d).attr('dstnemail'),
        "fromCloudName":$(_d).attr('srccldname'),
        "toCloudName":$(_d).attr('dstncldname'),
    };

    if($(this).is(':checked')) {
        if (!($(this).hasClass('notAllow'))) {
            CsvOperation(obj, 'set');
            CsvOperation(EmailObj, 'setCsv');
        }
    }
    else{
        CsvOperation(obj,'delete');
        CsvOperation(EmailObj,'deleteCSv');
    }
    if($('input[name="csvMapngCheckBox"]:checked').length > 0 || JSON.parse(localStorage.getItem('FolderChecked')).length >0){
        $('#forNextMove').removeClass('disabled');
    }
    else
        $('#forNextMove').addClass('disabled');

    if($('#mapdUsers input[name="inputMapdUrs"]:checked').length >0){
        $('#forNextMove').removeClass('disabled');
    }
    if(JSON.parse(localStorage.getItem('FolderChecked'))){
        if(JSON.parse(localStorage.getItem('FolderChecked')).length == 0){
        if(JSON.parse(localStorage.getItem('selectedMappings')).length == 0){

            $('#forNextMove').addClass('disabled');
         }
        }
    }

});
$(document).on('click', '#chkInput', function(){
    //localStorage.removeItem("selectedMappings");
//    localStorage.removeItem('selectedEmail');
  //  localStorage.removeItem('folderEmail');
  //  localStorage.removeItem('csvEmailChecked');
    localStorage.removeItem("validator");
    //CsvOperation('','rmv');
    sendGAEvents("clicked on select all checkbox");
	//activecampaign.eventTrack('Select all mappings',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    var src = localStorage.getItem('multiUsrSrcCldName');
    var dstn = localStorage.getItem('multiUsrDstnCldName');
    if ((src === "ONEDRIVE_BUSINESS_ADMIN" && dstn === "DROPBOX_BUSINESS") || (src === "DROPBOX_BUSINESS" && dstn === "ONEDRIVE_BUSINESS_ADMIN")|| (src === "GOOGLE_SHARED_DRIVES" && dstn === "SHAREPOINT_ONLINE_BUSINESS")|| (src === "DROPBOX_BUSINESS" && dstn === "GOOGLE_SHARED_DRIVES")){
        if($("#chkInput:checked").length) {
            //  $("#forNextMove").removeClass("disabled");
            var data = $('#mapdUsers input[name=folderMapngCheckBox]').length;
            for (i = 0; i < data; i++) {
                if ($('#mapdUsers input[name=folderMapngCheckBox]')[i].hasAttribute('disabled')) {
                    $("input[name=folderMapngCheckBox]")[i].checked = false;
                } else {
                    $("input[name=folderMapngCheckBox]")[i].checked = true;
                }
                if($('#mapdUsers input[name=folderMapngCheckBox]:checked').length > 0){
                    $("#forNextMove").removeClass("disabled");
                }
            }
            if($('#mapdUsers input[name=csvMapngCheckBox]').length !==0){
                var _data = $('#mapdUsers input[name=csvMapngCheckBox]').length;
                for (j = 0; j < _data; j++) {
                    if ($('#mapdUsers input[name=csvMapngCheckBox]')[j].hasAttribute('disabled')) {
                        $("input[name=csvMapngCheckBox]")[j].checked = false;
                    } else {
                        $("input[name=csvMapngCheckBox]")[j].checked = true;
                    }
		if($('#mapdUsers input[name=csvMapngCheckBox]:checked').length > 0){
                    $("#forNextMove").removeClass("disabled");
                }
                }
            }
            if ($(this).parents("table").find('tbody tr').hasClass("folderRow")) {
                $('#mapdUsers input[name=folderMapngCheckBox]:checked').each(function () {
if($(this).closest('tr').attr('srccldname') === "GOOGLE_SHARED_DRIVES" && $(this).closest('tr').attr('dstncldname') === "SHAREPOINT_ONLINE_BUSINESS"){
	if($(this).closest('tr').attr('dstnrt').split(':')[1] === "FOLDER" || $(this).closest('tr').attr('dstnrt').split(':')[1] === "DOCUMENT_LIBRARY"){
	  var _obj = {
                        "fromCloudId": {
                            "id": $(this).closest('tr').attr('srccldid')
                        },
                        "toCloudId": {
                            "id": $(this).closest('tr').attr('dstncldid')
                        },
                        "fromRootId": $(this).closest('tr').attr('srcrt'),
                        "toRootId": $(this).closest('tr').attr('dstnrt'),
                        "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
                        "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
                        "folder":"true",
	"documentLibrary":$(this).attr('parentName')
    };
	}
else{
     var _obj = {
                        "fromCloudId": {
                            "id": $(this).closest('tr').attr('srccldid')
                        },
                        "toCloudId": {
                            "id": $(this).closest('tr').attr('dstncldid')
                        },
                        "fromRootId": $(this).closest('tr').attr('srcrt'),
                        "toRootId": $(this).closest('tr').attr('dstnrt'),
                        "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
                        "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
                        "folder":"true"
                    };
}
}
		else{
                    var _obj = {
                        "fromCloudId": {
                            "id": $(this).closest('tr').attr('srccldid')
                        },
                        "toCloudId": {
                            "id": $(this).closest('tr').attr('dstncldid')
                        },
                        "fromRootId": $(this).closest('tr').attr('srcrt'),
                        "toRootId": $(this).closest('tr').attr('dstnrt'),
                        "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
                        "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
                        "folder":"true"
                    };



}

   var _objEmail = {
                        "fromMailId": $(this).closest('tr').attr('srcemail'),
                        "fileName": $(this).closest('tr').attr('srcemail'),
                        "toMailId": $(this).closest('tr').attr('dstnemail'),
                        "fromCloudName": $(this).closest('tr').attr('srccldname'),
                        "toCloudName": $(this).closest('tr').attr('dstncldname'),

                    };
                    if (!mappingOptions.folderOperation(_obj, 'check')) {
                        mappingOptions.folderOperation(_obj, 'set');
                        mappingOptions.folderOperation(_objEmail, 'set1');
                    }
                });
            }
else if (src === "GOOGLE_SHARED_DRIVES" && dstn === "SHAREPOINT_ONLINE_BUSINESS") {
                var _data = $('#mapdUsers input[name=csvMapngCheckBox]').length;
                for (i = 0; i < _data; i++) {
                    if ($('#mapdUsers input[name=csvMapngCheckBox]')[i].hasAttribute('disabled')) {
                        $("input[name=csvMapngCheckBox]")[i].checked = false;
                    } else {
                        $("input[name=csvMapngCheckBox]")[i].checked = true;
                    }
                    if ($('#mapdUsers input[name=csvMapngCheckBox]:checked').length > 0) {
                        $("#forNextMove").removeClass("disabled");
                    }
                }
            }
            else {
                $("#forNextMove").removeClass("disabled");
                $("input[name=csvMapngCheckBox]").prop('checked', true);
            }
            $('#mapdUsers input[name=csvMapngCheckBox]:checked').each(function () {
                var _d = $(this).parent().parent();
                if (!($(this).hasClass('notAllow'))) {
            
                        var obj = {
                            "fromCloudId": {
                                "id": $(_d).attr('srccldid'),
                            },
                            "toCloudId": {
                                "id": $(_d).attr('dstncldid'),
                            },
                            "sourceFolderPath": decodeURI($(_d).attr('srcFolderPath')),
                            "destFolderPath": $(_d).attr('dstnFolderPath'),//decodeURI($(_d).attr('dstnFolderPath')),
                            "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                            "isCSV": "true"
                        };
                    
                    var EmailObj = {
                        "fromMailId": $(_d).attr('srcemail'),
                        "fileName": $(_d).attr('srcemail'),
                        "toMailId": $(_d).attr('dstnemail'),
                        "fromCloudName": $(_d).attr('srccldname'),
                        "toCloudName": $(_d).attr('dstncldname'),
                    };

                    if(!CsvOperation(obj,'check')) {
                        CsvOperation(obj, 'set');
                        CsvOperation(EmailObj, 'setCsv');
                    }

                }
            });
        }
        else {
    if ($(this).parents("table").find('tbody tr').hasClass("folderRow")) {
            $('#mapdUsers input[name=folderMapngCheckBox]').each(function () {
                var _d = $(this).parent().parent();
                $(this).prop('checked', false);
                var _obj = {
                    "fromCloudId": {
                        "id": $(this).closest('tr').attr('srccldid')
                    },
                    "toCloudId": {
                        "id": $(this).closest('tr').attr('dstncldid')
                    },
                    "fromRootId": $(this).closest('tr').attr('srcrt'),
                    "toRootId": $(this).closest('tr').attr('dstnrt'),
                    "sourceFolderPath": $(this).closest('tr').attr('srcfolderpath'),
                    "destFolderPath": $(this).closest('tr').attr('dstnfolderpath'),
                    "folder": "true"
                };
                var _objEmail = {
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName": $(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName": $(_d).attr('srccldname'),
                    "toCloudName": $(_d).attr('dstncldname'),

                };
                mappingOptions.folderOperation(_obj, 'delete');
                mappingOptions.folderOperation(_objEmail, 'delete1');
            });
            if(localStorage.getItem('folderMappings')) {
                if (!JSON.parse(localStorage.getItem('folderMappings')).length)
                    $("#forNextMove").addClass("disabled");
            }
}
else{
    $('#mapdUsers input[name=csvMapngCheckBox]').each(function () {
                var _d = $(this).parent().parent();
                $(this).prop('checked', false);
                var obj = {
                    "fromCloudId": {
                        "id": $(_d).attr('srccldid'),
                    },
                    "toCloudId": {
                        "id": $(_d).attr('dstncldid'),
                    },
                    "sourceFolderPath": decodeURI($(_d).attr('srcFolderPath')),
                    "destFolderPath": $(_d).attr('dstnFolderPath'),//decodeURI()
                    "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                    "isCSV": "true"
                };
                var EmailObj = {
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName": $(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName": $(_d).attr('srccldname'),
                    "toCloudName": $(_d).attr('dstncldname'),
                };
                CsvOperation(obj, 'delete');
               CsvOperation(EmailObj, 'deleteCsv');
            });
            if(localStorage.getItem('FolderChecked')) {
                if (!JSON.parse(localStorage.getItem('FolderChecked')).length)
                    $("#forNextMove").addClass("disabled");
            }


}


        }
    }
    else {
        if ($("#chkInput:checked").length) {
            if (src === "DROPBOX_BUSINESS" && dstn === "G_SUITE") {
                var _data = $('#mapdUsers input[name=csvMapngCheckBox]').length;
                for (i = 0; i < _data; i++) {
                    if ($('#mapdUsers input[name=csvMapngCheckBox]')[i].hasAttribute('disabled')) {
                        $("input[name=csvMapngCheckBox]")[i].checked = false;
                    } else {
                        $("input[name=csvMapngCheckBox]")[i].checked = true;
                    }
                    if ($('#mapdUsers input[name=csvMapngCheckBox]:checked').length > 0) {
                        $("#forNextMove").removeClass("disabled");
                    }
                }
            }
            else {
                $("#forNextMove").removeClass("disabled");
                $("input[name=csvMapngCheckBox]").prop('checked', true);
            }
            $('#mapdUsers input[name=csvMapngCheckBox]:checked').each(function () {
                var _d = $(this).parent().parent();
                if (!($(this).hasClass('notAllow'))) {
                    if (src === "DROPBOX_BUSINESS" && dstn === "G_SUITE") {
                        var obj = {
                            "fromCloudId": {
                                "id": $(_d).attr('srccldid'),
                            },
                            "toCloudId": {
                                "id": $(_d).attr('dstncldid'),
                            },
						"sourceFolderPath": $(_d).attr('srcFolderPath'),
                            "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                            "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                            "teamFolder":$(_d).attr('teamFolder'),
                            "isCSV": "true"
                        };
                    }
                    else {
                        var obj = {
                            "fromCloudId": {
                                "id": $(_d).attr('srccldid'),
                            },
                            "toCloudId": {
                                "id": $(_d).attr('dstncldid'),
                            },
                            "sourceFolderPath": $(_d).attr('srcFolderPath'),//decodeURI($(_d).attr('srcFolderPath'))
                            "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                            "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                            "isCSV": "true"
                        };
                    }
                    var EmailObj = {
                        "fromMailId": $(_d).attr('srcemail'),
                        "fileName": $(_d).attr('srcemail'),
                        "toMailId": $(_d).attr('dstnemail'),
                        "fromCloudName": $(_d).attr('srccldname'),
                        "toCloudName": $(_d).attr('dstncldname'),
                    };

                    if(!CsvOperation(obj,'check')) {
                        CsvOperation(obj, 'set');
                        CsvOperation(EmailObj, 'setCsv');
                    }

                }
            });
        } else {
            $('#mapdUsers input[name=csvMapngCheckBox]').each(function () {
                var _d = $(this).parent().parent();
                $(this).prop('checked', false);
                var obj = {
                    "fromCloudId": {
                        "id": $(_d).attr('srccldid'),
                    },
                    "toCloudId": {
                        "id": $(_d).attr('dstncldid'),
                    },
                    "sourceFolderPath": $(_d).attr('srcFolderPath'),//decodeURI($(_d).attr('srcFolderPath')),
                    "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                    "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                    "isCSV": "true"
                };
                var EmailObj = {
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName": $(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName": $(_d).attr('srccldname'),
                    "toCloudName": $(_d).attr('dstncldname'),
                };
                CsvOperation(obj, 'delete');
                CsvOperation(EmailObj, 'deleteCsv');
            });
            if(localStorage.getItem('FolderChecked')) {
                if (!JSON.parse(localStorage.getItem('FolderChecked')).length)
                    $("#forNextMove").addClass("disabled");
                //mappingOptions.localStorageOperation('','rmv');
            }
        }
    }
});

function CsvOperation(value , op) {
    //"fromCloudId"."id"   "toCloudId" ."id"
    var _Fldr = JSON.parse(localStorage.getItem('FolderChecked')),_rtnValue, _len ;
    var _csvEmail = JSON.parse(localStorage.getItem('CsvEmailChecked')),csvValue, len ;
    if(_Fldr != null)
        _len = _Fldr.length;
    else
    {
        _len = 0;
        _Fldr = [];
    }
    if(_csvEmail != null)
        len = _csvEmail.length;
    else
    {
        len = 0;
        _csvEmail = [];
    }
    var  operations ={
        checkExists :function () {
            _rtnValue = false;
            for(var i=0; i<_len; i++){
                if(_Fldr[i].fromCloudId.id == value.fromCloudId.id  && _Fldr[i].toCloudId.id == value.toCloudId.id)
                    if(_Fldr[i].sourceFolderPath== value.sourceFolderPath  && _Fldr[i].destFolderPath == value.destFolderPath)
                        _rtnValue = true;
            }
        },
        deleteValue : function () {
            var  deletedArray = _Fldr.filter(function(el) {
if(el.fromCloudId.id == value.fromCloudId.id  && el.toCloudId.id == value.toCloudId.id && el.sourceFolderPath == value.sourceFolderPath && el.destFolderPath == value.destFolderPath)
                return  false;
else
return true;
            });
            localStorage.setItem('FolderChecked',JSON.stringify(deletedArray));
            _rtnValue = true;
        },
        deleteCsvValue : function () {
            var  deletedCsvArray = _csvEmail.filter(function(el) {
                return el.fromMailId !== value.fromMailId && el.toMailId !== value.toMailId;
            });
            localStorage.setItem('CsvEmailChecked',JSON.stringify(deletedCsvArray));
            csvValue = true;
        },
        setValue : function () {
            _Fldr.push(value);
            localStorage.setItem('FolderChecked',JSON.stringify(_Fldr));
            _rtnValue = true;
        },
        setCsvValue : function () {
            _csvEmail.push(value);
            localStorage.setItem('CsvEmailChecked',JSON.stringify(_csvEmail));
            csvValue = true;
        },
        getValue :function () {
            _rtnValue = _Fldr;
            csvValue = _csvEmail;
        },
        remove   : function () {
            localStorage.removeItem('FolderChecked');
            $('input[name="csvMapngCheckBox"]').removeAttr('checked');
          
            localStorage.removeItem('CsvEmailChecked');
            $('input[name="csvMapngCheckBox"]').removeAttr('checked');
              _rtnValue = true;
            csvValue = true;
        },
        remove_1  : function () {
            localStorage.removeItem('FolderChecked');
            
            localStorage.removeItem('CsvEmailChecked');
            _rtnValue = true;
            csvValue = true;
        }
    };
    switch(op){

        case 'check'  : operations.checkExists();
            break;
        case 'delete' : operations.deleteValue();
            break;
        case 'deleteCSv' : operations.deleteCsvValue();
            break;
        case 'set'    : operations.setValue();
            break;
        case 'setCsv'    : operations.setCsvValue();
            break;
        case 'get'    : operations.getValue();
            break;
        case 'rmv'    : operations.remove();
            break;
        case 'rmv1'    : operations.remove_1();
            break;

    }

    return _rtnValue;
    return csvValue;
};

$(document).on('click', '#closeCsvBtn', function(){
    $(this).parents('.CsvMapd').remove();
});
//CSV file downloading
csvAutoDownload = function() {
    if(sessionStorage.getItem('csvDownload') != 'false'){
		$('.alertScs .msg').css("margin-top","-2%");
        alertSuccess("Your CSV is validating, Once validation is completed, Validation report gets downloaded.");
    }
    sessionStorage.setItem('csvDownload','true');
    $("#CFShowLoading").modal("show");
    $("#CFShowLoading .backdrop p").css("padding","2%");
	$("#CFShowLoading .backdrop p").css("font-size","21px").css("left","0%");
    $("#CFShowLoading .backdrop p").text("Csv validation is in process, Please don't close the window...");
    $("#CFShowLoading").attr("autoMap","true");
    var Users;
    var csvid = $("#mapdUsers tbody").find("#csvRow").attr("csvid");
    var csvName = $("#mapdUsers tbody tr").attr("csvname");
    var userID = localStorage.getItem("UserId");
    var srcAdmincldid = $("#mapdUsers tbody tr").attr("sourcAdminCloudId");
    var dstnAdmincldid = $("#mapdUsers tbody tr").attr("destAdminCloudId");
    var _data = csvid + "?" + "userId=" + userID + "&sourceAdminCloudId=" + srcAdmincldid + "&destAdminCloudId=" + dstnAdmincldid + "&csvName=" + csvName;
    //$("#CFShowLoading").modal("show");
	if((localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES")){
	var csvapiUrl = apicallurl + "/mapping/download/csvcreator/zip/" + _data;
	}
	else{
	var csvapiUrl = apicallurl + "/mapping/download/csvcreator/" + _data;
	}
    $.ajax({
        //async: false,
        type: "GET",
        url: csvapiUrl,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
          xhrFields: {
            responseType: 'blob',
        },
		  success: function (data,textStatus,xhr) {
            if(data.size < 150){
                deleteMapping(true);
                $("#mapdUsers tbody").html('');
                var s = JSON.parse(sessionStorage.getItem('csvIteration'));
                var t = s+1;
                sessionStorage.setItem('csvIteration',t);
                if(s < 4){
                    sessionStorage.setItem('csvDownload','false');
                    csvFileUpld(localStorage.getItem("multiUsrSrcCldId"),localStorage.getItem("multiUsrDstnCldId"),sessionStorage.getItem("result"));
                }
                else{
                    $('.download').css('pointer-events', 'none');
                    $('.download').css('opacity', '0.5');
                    $('#help').css('visibility','hidden');
                    $('#csvFileUpload').removeClass('onlyCsv');
                    $("#CFShowLoading").attr("autoMap", "false");
                    $("#CFShowLoading").modal("hide");
					$("#CFShowLoading .backdrop p").css("font-size","25px").css("left","11%"); 
                    $("#CFShowLoading .backdrop p").text("Please wait while Loading...");
                    alertSuccess("Please upload your CSV again.");
                }
            }
            else{
                $(document).find("#chkInput").attr("disabled", false);
                var response = xhr.getResponseHeader("Content-Disposition").trim();
                var fName = response.split('=')[1];
		  var a = document.createElement('a');
		var url =  URL.createObjectURL(data);
            a.href = url;
            
            a.download = fName;
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
                UpdateCsvPath();
                setTimeout(function(){
					$('.alertScs .msg').css("margin-top","4%"); 
					alertSuccess(noOfMappedCloudPressent +" " + "pairs are uploaded sucessfully through CSV");
				},2000);
                sessionStorage.setItem('csvDownload','true');
                $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
                $("#CFShowLoading .backdrop p").text("Please wait while Loading...");
            }
        },

        error: function (err) {
            console.error(err);
        }
    });
}
var csvMappings = false;
UpdateCsvPath = function(pgNo,pgSize){
    var pgNo;
    var csvID = $("#mapdUsers tbody").find("#csvRow").attr("csvid");
    var userID = localStorage.getItem("UserId");
    var srcAdmincldid = localStorage.getItem("multiUsrSrcCldId");
    var dstnAdmincldid = localStorage.getItem("multiUsrDstnCldId");
    if(pgNo === undefined)
        pgNo = 1;
    if(pgSize === undefined)
        pgSize = 30;
    var data = "?" + "userId=" + userID + "&sourceAdminCloudId=" + srcAdmincldid + "&destAdminCloudId=" + dstnAdmincldid +"&pageNo="+pgNo+"&pageSize="+pgSize;

    $.ajax({
        //async: false,
        type: "GET",
        url: apicallurl + "/mapping/user/latest/mappingcache/" + csvID + data,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
            $("#mapdUsers tbody").html('');
            $('#paginationMapng').empty();
            $('#paginationMapng').removeData("twbs-pagination");
            $('#paginationMapng').unbind("page");
            if (data.length == 0){
                $('.download').css('pointer-events', 'none');
                $('.download').css('opacity', '0.5');
                $('#help').css('visibility','hidden');
                $('#csvFileUpload').removeClass('onlyCsv');
            }
            else{
                var _totPages = Math.ceil(noOfMappedCloudPressent/$('#mapdUsrs select').val());
                var _txt = pgNo  + " of " + _totPages;
                $("#mapdUsrs .paginationCF span").last().text(_txt );
                $("#mapdUsrs .paginationCF input").val(pgNo);

                $('#paginationMapng').twbsPagination({
                    totalPages: _totPages,
                    visiblePages: 6,
                    startPage: 1,
                    next: '<i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                    prev: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i>',
                    first: '<i class="fa fa-angle-left"  style="font-size: 19px;"></i><i class="fa fa-angle-left" style="font-size: 19px;"></i>',
                    last: '<i class="fa fa-angle-right" style="font-size: 19px;"></i><i class="fa fa-angle-right" style="font-size: 19px;"></i>',
                    onPageClick: function (event, page) {
                        UpdateCsvPath(page,$('#mapdUsrs select').val());
                    }
                });
				                alertSuccess(data.length +" " + "pairs are uploaded sucessfully through CSV");

                var csvName = localStorage.getItem("csvName");
                localStorage.removeItem("teamMigrationMappingPopUp");
  if((localStorage.getItem('multiUsrSrcCldName') ==="DROPBOX_BUSINESS"&&localStorage.getItem('multiUsrDstnCldName')==="ONEDRIVE_BUSINESS_ADMIN")|| (localStorage.getItem('multiUsrSrcCldName') ==="ONEDRIVE_BUSINESS_ADMIN"&&localStorage.getItem('multiUsrDstnCldName')==="DROPBOX_BUSINESS")|| (localStorage.getItem('multiUsrSrcCldName') ==="GOOGLE_SHARED_DRIVES"&&localStorage.getItem('multiUsrDstnCldName')==="SHAREPOINT_ONLINE_BUSINESS")|| (localStorage.getItem('multiUsrSrcCldName') ==="DROPBOX_BUSINESS"&&localStorage.getItem('multiUsrDstnCldName')==="GOOGLE_SHARED_DRIVES"))
                $('#csvFileUpload').addClass('onlyCsv');
                for(var i=0;i<data.length;i++){
                    var _obj = {
                        "fromCloudId": {
                            "id": data[i].sourceCloudId,
                        },
                        "toCloudId": {
                            "id": data[i].destCloudId,
                        },
                        "sourceFolderPath": data[i].sourceCloudDetails.folderPath,
                        "destFolderPath": data[i].destCloudDetails.folderPath
                    };
                    if(localStorage.getItem("multiUsrSrcCldName")=="DROPBOX_BUSINESS" && localStorage.getItem("multiUsrDstnCldName") =="G_SUITE") {
                        if (data[i].teamFolder === true) {
                            if (data[i].sourceAdminCloudId === data[i].sourceCloudId) {
                                if (CsvOperation(_obj, 'check')) {
                                    input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                                } else {
                                    input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                                }
                            } else {
                                if (CsvOperation(_obj, 'check')) {
                                    input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true" class="notAllow" disabled="disabled"></td>';
                                    localStorage.setItem("teamMigrationMappingPopUp","yes");
                                } else {
                                    input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" class="notAllow" disabled="disabled"></td>';
                                    localStorage.setItem("teamMigrationMappingPopUp","yes");
                                }
                            }
                        }
                        else{
                            if (CsvOperation(_obj, 'check')) {
                                input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                            } else {
                                input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                            }
                        }
                    }

                    else {

                        if (CsvOperation(_obj, 'check')) {
                            input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox" checked="true"></td>';
                        } else {
                            input = '<td style="width: 5%;"><input type="checkbox" name="csvMapngCheckBox"></td>';
                        }
                    }
                    if(data[i].destCloudDetails.folderPath === "" && data[i].destCloudDetails.name==='SHAREPOINT_ONLINE_BUSINESS'){
                        var _html = '<tr style="width: 100%" id="csvRow" teamFolder="' + data[i].teamFolder +'" csvid="' + data[i].csvId + '" srcemail="' + data[i].sourceCloudDetails.emailId + '" dstnemail="' + data[i].destCloudDetails.emailId + '" sourcAdminCloudId="' + data[i].sourceAdminCloudId + '" destAdminCloudId="' + data[i].destAdminCloudId + '" csvname="' + csvName + '" srccldid="' + data[i].sourceCloudId + '"  srcrt="' + data[i].sourceCloudDetails.rootFolderId + '" dstncldid="' + data[i].destCloudId + '" dstnrt="' + data[i].destCloudDetails.rootFolderId + '" class="CsvMapd" srcPathRootFolderId="' + data[i].sourceCloudDetails.pathRootFolderId + '" srcFolderPath="' + encodeURI(data[i].sourceCloudDetails.folderPath) + '"  srcRootFolderId="' + data[i].sourceCloudDetails.rootFolderId + '"  migrateSrcFolderName="' + data[i].sourceCloudDetails.migrateFolderName + '" srcCldName="' + data[i].sourceCloudDetails.name + '"dstnCldName="' + data[i].destCloudDetails.name + '" dstnPathRootFolderId="' + data[i].destCloudDetails.pathRootFolderId + '" dstnRootFolderId="' + data[i].destCloudDetails.rootFolderId + '" dstnFolderPath="/" migrateDstnFolderName="' + data[i].migrateFolderName + '">'+input+'<td style="width: 45%"><img src="../img/PNG/' + data[i].sourceCloudDetails.name + '.png" alt="pic" class="forImage"><span class="manualPath" title="EmailSrcTitle" style="">' + emailMaxChar(data[i].sourceCloudDetails.emailId, 25) + '</span><br/><p style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="TitleSrce" data-placement="bottom" style="margin-left: 10%;">' + CFManageCloudAccountsAjaxCall.getMaxChars(data[i].sourceCloudDetails.folderPath, 25) + '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + data[i].destCloudDetails.name + '.png" alt="pic" class="forImage"><span class="manualPath" title="EmailDstnTitle">' + emailMaxChar(data[i].destCloudDetails.emailId, 25) + '</span><br/><p style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="TitleDstin">/</span></p></td><td><span style="width: 4%;font-size: inherit;margin-left: -50px;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true" id="closeCsvBtn"></i></span></td></tr>';
                        _html = _html.replace('TitleSrce', data[i].sourceCloudDetails.folderPath).replace('TitleDstin', '/').replace('EmailSrcTitle', data[i].sourceCloudDetails.emailId).replace('EmailDstnTitle',  data[i].destCloudDetails.emailId);
                    }
                    else{
                        var src = CFManageCloudAccountsAjaxCall.getMaxChars(data[i].sourceCloudDetails.folderPath, 25);
                        var dest = CFManageCloudAccountsAjaxCall.getMaxChars(data[i].destCloudDetails.folderPath, 25);
                        var pl = /\</g;
                        var pl1 = /\>/g;
                        var pl2 = /\"/g;
                        var pl3 = /\'/g;
                        var dest1 = dest.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src1 = src.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var sourc = data[i].sourceCloudDetails.folderPath;
                        var desti = data[i].destCloudDetails.folderPath;
                        var dest2 = desti.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var src2 = sourc.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
                        var _html = '<tr style="width: 100%" id="csvRow"  teamFolder="' + data[i].teamFolder +'" csvid="' + data[i].csvId + '" srcemail="' + data[i].sourceCloudDetails.emailId + '" dstnemail="' + data[i].destCloudDetails.emailId + '" sourcAdminCloudId="' + data[i].sourceAdminCloudId + '" destAdminCloudId="' + data[i].destAdminCloudId + '" csvname="' + csvName + '" srccldid="' + data[i].sourceCloudId + '"  srcrt="' + data[i].sourceCloudDetails.rootFolderId + '" dstncldid="' + data[i].destCloudId + '" dstnrt="' + data[i].destCloudDetails.rootFolderId + '" class="CsvMapd" srcPathRootFolderId="' + data[i].sourceCloudDetails.pathRootFolderId + '" srcFolderPath="' + src2 + '"  srcRootFolderId="' + data[i].sourceCloudDetails.rootFolderId + '"  migrateSrcFolderName="' + data[i].sourceCloudDetails.migrateFolderName + '" srcCldName="' + data[i].sourceCloudDetails.name + '"dstnCldName="' + data[i].destCloudDetails.name + '" dstnPathRootFolderId="' + data[i].destCloudDetails.pathRootFolderId + '" dstnRootFolderId="' + data[i].destCloudDetails.rootFolderId + '" dstnFolderPath="' + dest2 + '" migrateDstnFolderName="' + data[i].migrateFolderName + '">'+input+'<td style="width: 45%"><img src="../img/PNG/' + data[i].sourceCloudDetails.name + '.png" alt="pic" class="forImage"><span class="manualPath" title="EmailSrcTitle" data-placement="bottom" style="">' + emailMaxChar(data[i].sourceCloudDetails.emailId, 25) + '</span><br/><p style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+src2+'" data-placement="bottom" style="margin-left: 10%;">' + src1+ '</span></p></td><td style="width: 48%"><img src="../img/PNG/' + data[i].destCloudDetails.name + '.png" alt="pic" class="forImage"><span class="manualPath" title="EmailDstnTitle">' + emailMaxChar(data[i].destCloudDetails.emailId, 25) + '</span><br/><p style="margin:0px;"><span class="csvPath"  style="margin-left: 10%;" title="'+dest2+'">' + dest1 + '</span></p></td><td><span style="width: 4%;font-size: inherit;margin-left: -50px;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true" id="closeCsvBtn"></i></span></td></tr>';
                        _html = _html.replace('TitleSrce', src2).replace('TitleDstin', dest2).replace('EmailSrcTitle', data[i].sourceCloudDetails.emailId).replace('EmailDstnTitle',  data[i].destCloudDetails.emailId);
                    }
                    $("#mapdUsers tbody").append(_html);
                    if(localStorage.getItem("multiUsrSrcCldName") === "DROPBOX_BUSINESS" && localStorage.getItem("multiUsrDstnCldName") === "G_SUITE") {
                        if (localStorage.getItem("teamMigrationMappingPopUp") == "yes") {
                            $("#CFTeamFolderMappingPopUp").modal("show");
                        }
                    }
                }
                $('.download').css('pointer-events', 'auto');
                $('.download').css('opacity', '1');
                $('#help').css('visibility','visible');
            }
            if($('#mapdUsers tbody tr').length !=0 &&($('#mapdUsers input[name=csvMapngCheckBox]:checked').length ===  $('#mapdUsers tbody tr').length)){
                $('#chkInput').prop('checked',true);
				$('#chkInput').prop('disabled',false);
            }
            else{
                $('#chkInput').prop('checked',false);
				$('#chkInput').prop('disabled',true);
            }
            if($("#mapdUsers tbody tr").length > 0){
                $(document).find("#chkInput").attr("disabled", false);
                $("#clearBtn").css("pointer-events",'auto');
                $("#clearBtn").css("cursor","pointer");
                $("#clearBtn").css("opacity","1");
            }
			else{
			 $(document).find("#chkInput").attr("disabled", true);
                $("#clearBtn").css("pointer-events",'none');
              //  $("#clearBtn").css("cursor","pointer");
                $("#clearBtn").css("opacity","0.4");
			}
            if (!Number($("#mapdUsrs .paginationCF input").val())) {
                $("#mapdUsrs .paginationCF input").val(1);
                $("#mapdUsrs .paginationCF span").last().text("1 of 1");
            }
            csvMappings = true;
            $('[data-toggle="tooltip"]').tooltip();

        },

        error: function (err) {
            console.error(err);
        }
    });

}

csvDownload = function(){
    sendGAEvents("Clicked on csv download icon");
	//activecampaign.eventTrack('csv download',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
    $("#CFShowLoading").modal("show");
    $("#CFShowLoading").attr("autoMap","true");
    var csvID = $("#mapdUsers tbody").find("#csvRow").attr("csvid");
    var array = [];
    var Users;
    var csvData = [];
    $("#mapdUsers tbody tr").each(function () {
        var _obj = {
            "sourceCloudId": $(this).attr('srccldid'),
            "sourceEmailId": $(this).attr('srcemail'),
            "sourceFolderPath":  decodeURI($(this).attr('srcFolderPath')),
            "sourceCloudName": $(this).attr('srcCldName'),
            "destCloudId": $(this).attr('dstncldid'),
            "destEmailId":  $(this).attr('dstnemail'),
            "destFolderPath": $(this).attr('dstnFolderPath'),//decodeURI()
            "destCloudName": $(this).attr('dstnCldName'),
        };
        array.push(_obj);
        localStorage.setItem("csvUsers",JSON.stringify(array));
    });
    var _data = localStorage.getItem("csvUsers");
	if((localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN" && localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES")){
	var csvapiUrl = apicallurl + "/mapping/download/csvmappingcache/zip/"+localStorage.UserId
+"/" + csvID;
var responseType = 'blob';
	}
	else{
	var csvapiUrl = apicallurl + "/mapping/download/csvmappingcache/" + csvID;
	var responseType = ''
	}
    $.ajax({
        //async: false,
        type: "POST",
        url: csvapiUrl,
        data: _data,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
		xhrFields: {
            responseType: responseType,
        },
        success: function (data,textStatus,xhr) {
		var response = xhr.getResponseHeader("Content-Disposition").trim();
                var fName = response.split('=')[1];
		  var a = document.createElement('a');
		  if(fName.split('.')[1] == "csv"){
		  var binaryData = [];
		  binaryData.push(data);
		  var url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/csv"}))
		  }
		  else if(fName.split('.')[1] == "zip"){
		  var url =  URL.createObjectURL(data);
		  }
            a.href = url;
            
            a.download = fName;
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
			  $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
                $("#CFShowLoading .backdrop p").text("Please wait while Loading...");
        },
        error: function (err) {
            console.error(err);
        }
    });
}
csvDownload12 = function(){
    $("#CFShowLoading").modal("show");
    $("#CFShowLoading").attr("autoMap","true");
	
	var srcAdmincldid = localStorage.getItem("multiUsrSrcCldId");
    var dstnAdmincldid = localStorage.getItem("multiUsrDstnCldId");
		_url = apicallurl + "/mapping/download/automap?sourceAdminCloudId="+srcAdmincldid+"&destAdminCloudId="+dstnAdmincldid+"&automapcsv=true";
	
    $.ajax({
        //async: false,
        type: "GET",
        url: _url,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data, textStatus, xhr) {
			if (xhr.status == 200) {
			var fName = "automapusers.csv";
			Users = data;
            Users = "data:application/csv," + encodeURIComponent(Users);
            var x = document.createElement("a");
            x.setAttribute("href", Users);
            x.setAttribute("download", fName);
            document.body.appendChild(x);
            x.click();
			}
			else if (xhr.status == 202) {
                alertSuccess("Report is in Progress,will be ready in few minutes");
				//csvDownload12();
            }
            $("#CFShowLoading").attr("autoMap", "false");
            $("#CFShowLoading").modal("hide");
        },

        error: function (err) {
            console.error(err);
        }
    });
}

deleteCsv = function(csvid){
    if(csvid !== undefined)
        csvId = csvid;
    else
        var csvId = $("#mapdUsers tbody").find("#csvRow").attr("csvid");
    $.ajax({
        //async: false,
        type: "DELETE",
        url: apicallurl + "/mapping/delete/csvmappcache/" + csvId,
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
        },
        success: function (data) {
        },

        error: function (err) {
            console.error(err);
        }
    });
}
//PauseResume and Cancel button in report page
$('.pauseResumeVal').html('Pause');
$(document).on('click', '.Pause,.cancelBtn', function(){
    var _val;
    var parent = $(this);
    if($(this).attr('src') == "../img/Resume.png" ){
        $(this).attr('src',"../img/Pause.png");
        _val="RESUME";
    }
    else if($(this).attr('src') == "../img/Pause.png" ){
        $(this).attr('src',"../img/Resume.png");
        _val="PAUSE";
    }
    else{
        _val="CANCEL";
    }
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/pauseresume/workspaceId?"+"workSpaceId="+$(this).parents("tr").attr("wrkspaceid") + "&status=" + _val + "&userId=" + localStorage.getItem("UserId"),
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            if(data.threadStatus == "RESUME"){
                parent.parents("tr").children('td:eq(2)').html('In Progress').css("color","blue").css("font-weight","bold");
            }
            else if(data.threadStatus == "PAUSE"){
                parent.parents("tr").children('td:eq(2)').html('Pause').css("color","red").css("font-weight","bold");
            }
            else if(data.threadStatus == "CANCEL"){
                parent.parents("tr").children('td:eq(2)').html('Cancel').css("color","red").css("font-weight","bold");
                //parent.parents("tr").children('td:eq(5)').find(".lnil-download").css("opacity","0.2").css("cursor","not-allowed");
                parent.parents("tr").children('td:eq(6)').find(".cancelBtn").css("opacity","0.2").css("cursor","not-allowed");
                parent.parents("tr").children('td:eq(5)').find('.Pause').css("opacity","0.2").css("cursor","not-allowed");

            }
            else if(data.threadStatus){
                if(status == "PROCESSED" || status == "ERROR" || status == "SUSPENDED" || status == "PROCESSED_WITH_SOME_ERRORS" || status == "PROCESSED_WITH_SOME_WARNINGS" || status == "CANCEL" || status == "PROCESSED_WITH_SOME_CONFLICTS" || status == "CONFLICT")
                    $('.pauseResumeVal').css("color","red").css("cursor", "not-allowed").css("opacity","0.2");
            }
        }
    });
});
$(document).on('click', '.syncPause', function() {
    var _val;
    var parent = $(this);
    if ($(this).attr('src') == "../img/Resume.png") {
        $(this).attr('src', "../img/Pause.png");
        _val = "RESUME";
    }
    else if ($(this).attr('src') == "../img/Pause.png") {
        $(this).attr('src', "../img/Resume.png");
        _val = "PAUSE";
    }

    var jobId = $(this).parents('tr.jobsRow').attr('id');
    $.ajax({
        type: "GET",
        url: apicallurl + "/move/newmultiuser/update/sync/" + jobId + "?schedulerStatus=" + _val,
        async: false,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            if (data.jobStatus == "IN_PROGRESS") {
                parent.parents("tr").children('td:eq(2)').html('In Progress').css("color", "blue").css("font-weight", "bold");
            }
            else if (data.jobStatus == "PAUSE") {
                parent.parents("tr").children('td:eq(2)').html('Pause').css("color", "red").css("font-weight", "bold");
            }
        }
    });
});
$(document).on('click', '.cnclBtn', function() {
    var parent = $(this);
    if(parent.parents("tr").attr('jobType') === "TWO_WAY_SYNC"){
        $('#cancelSync').find('#cnclMsg').text('Clicking "Proceed" will permanently Stop this Two-way Sync Scheduler');
    }
    else{
        $('#cancelSync').find('#cnclMsg').text('Clicking "Proceed" will permanently Stop this One-way Sync Scheduler');
    }
    $('#cancelSync').modal('show');
    $('#proceed').on('click', function () {
        var _val = "STOP";
        var jobId = parent.parents('tr.jobsRow').attr('id');
        $.ajax({
            type: "GET",
            url: apicallurl + "/move/newmultiuser/update/sync/" + jobId + "?schedulerStatus=" + _val,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                if (data.jobStatus == "CANCEL") {
                    parent.parents("tr").children('td:eq(2)').html('Cancel').css("color", "red").css("font-weight", "bold");
                    parent.parents("tr").children('td:eq(4)').find(".dsblePause").css("opacity", "0.2").css("cursor", "not-allowed");
                    parent.parents("tr").children('td:eq(4)').find('.syncPause').removeClass('syncPause').addClass(".dsblePause").css("opacity", "0.2").css("cursor", "not-allowed");
                    parent.parents("tr").children('td:eq(5)').find(".cnclBtn").removeClass('cnclBtn').addClass("cleBtn").css("opacity", "0.2").css("cursor", "not-allowed");
                }
                $('#cancelSync').modal('hide');
                if(parent.parents("tr").attr('jobType') === "TWO_WAY_SYNC"){
                    showNotyNotification('notify', 'Two-Way Sync scheduler has been cancelled.');
                }
                else{
                    showNotyNotification('notify', 'One-Way Sync scheduler has been cancelled.');
                }
            }
        });
    });
});

function syncVerification() {
    $("#appendSelectedPairs").html("");

    CsvOperation('','rmv1');
    if($('#mapdUsers input[name=csvMapngCheckBox]:checked').length){
        $('#mapdUsers input[name=csvMapngCheckBox]:checked').each(function(){
            if (!($(this).hasClass('notAllow'))) {
                var _d = $(this).parent().parent();
                var obj = {
                    "fromCloudId": {
                        "id": $(_d).attr('srccldid'),
                    },
                    "toCloudId": {
                        "id": $(_d).attr('dstncldid'),
                    },
                    "sourceFolderPath": decodeURI($(_d).attr('srcFolderPath')),
                    "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                    "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                    "isCSV": "true"
                };
                var EmailObj = {
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName": $(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName": $(_d).attr('srccldname'),
                    "toCloudName": $(_d).attr('dstncldname'),
                };
                CsvOperation(obj, 'set');
                CsvOperation(EmailObj, 'setCsv');
            }
        });
    }
    else{
        $('#mapdUsers input[name=csvMapngCheckBox]').each(function(){
            var _d = $(this).parent().parent();
            $(this).prop('checked',false);
            var obj = {
                "fromCloudId": {
                    "id": $(_d).attr('srccldid'),
                },
                "toCloudId": {
                    "id": $(_d).attr('dstncldid'),
                },
                "sourceFolderPath": decodeURI($(_d).attr('srcFolderPath')),
                "destFolderPath": decodeURI($(_d).attr('dstnFolderPath')),
                "destinationFolderName": $(_d).attr('migrateDstnFolderName'),
                "isCSV": "true"
            };
            var EmailObj = {
                "fromMailId": $(_d).attr('srcemail'),
                "fileName":$(_d).attr('srcemail'),
                "toMailId": $(_d).attr('dstnemail'),
                "fromCloudName":$(_d).attr('srccldname'),
                "toCloudName":$(_d).attr('dstncldname'),
            };
            CsvOperation(obj,'delete');
            CsvOperation(EmailObj,'delete');
        });
    }
    mappingOptions.localStorageOperation('','rmv1');
    if($('#mapdUsers input[name=inputMapdUrs]:checked').length){
        if(!$(this).parents("table").find('tbody tr').hasClass("automapRow")){
            $('#mapdUsers input[name=inputMapdUrs]:checked').each(function(){
                var _obj ={
                    "fromCloudId": {
                        "id":$(this).closest('tr').attr('srccldid'),
                    },
                    "toCloudId": {
                        "id":$(this).closest('tr').attr('dstncldid')
                    }
                };
                var _objEmail ={
                    "fromMailId": $(this).closest('tr').attr('srccldid'),
                    "fileName":$(this).closest('tr').attr('srcemail'),
                    "toMailId": $(this).closest('tr').attr('dstncldid'),
                    "fromCloudName":$(this).closest('tr').attr('srccldname'),
                    "toCloudName":$(this).closest('tr').attr('dstncldname'),

                };
                mappingOptions.localStorageOperation(_obj,'set');
                mappingOptions.localStorageOperation(_objEmail,'set1');
            });
        }
        else{
            $('#mapdUsers input[name=inputMapdUrs]:checked').each(function(){
                var _d = $(this).parent().parent();
                var _obj ={
                    "fromCloudId": {
                        "id":$(_d).attr('srccldid'),
                    },
                    "toCloudId": {
                        "id":$(_d).attr('dstncldid'),
                    }
                };
                var _objEmail ={
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName":$(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName":$(_d).attr('srccldname'),
                    "toCloudName":$(_d).attr('dstncldname'),

                };
                mappingOptions.localStorageOperation(_obj,'set');
                mappingOptions.localStorageOperation(_objEmail,'set1');
            });
        }
    }
    else{
        $('#mapdUsers input[name=inputMapdUrs]').each(function(){
            var _d = $(this).parent().parent();
            $(this).prop('checked',false);
            var _obj ={
                "fromCloudId": {
                    "id":$(_d).attr('srccldid'),
                },
                "toCloudId": {
                    "id":$(_d).attr('dstncldid'),
                }
            };
            var _objEmail ={
                "fromMailId": $(_d).attr('srcemail'),
                "fileName":$(_d).attr('srcemail'),
                "toMailId": $(_d).attr('dstnemail'),
                "fromCloudName":$(_d).attr('srccldname'),
                "toCloudName":$(_d).attr('dstncldname'),

            };
            mappingOptions.localStorageOperation(_obj,'delete');
            mappingOptions.localStorageOperation(_objEmail,'delete1');
        });
    }

    if($('input[name="csvMapngCheckBox"]:checked')){
        var CsvSync = JSON.parse(localStorage.getItem('FolderChecked'));
    }
    if(CsvSync == null ||  CsvSync === []) {
        CsvSync =[];
        localStorage.removeItem("csvName");
    }
    if($('#mapdUsers input[name="inputMapdUrs"]:checked').length !== 0){
        var inpUsers = JSON.parse(localStorage.getItem('selectedMappings'));
        for(var i=0;i<inpUsers.length;i++) {
            CsvSync.push(inpUsers[i]);
        }
    }
    localStorage.removeItem("selMappings");
    localStorage.removeItem("syncMappings");
    $.ajax({
        type: "POST",
        url: apicallurl + "/move/newmultiuser/verify/sync",
        data: JSON.stringify(CsvSync),
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            //  localStorage.setItem("syncMappings",data);
            // var syncUsers = localStorage.getItem("syncMappings");

            if($('input[name="csvMapngCheckBox"]:checked')){
                var selMpngs = JSON.parse(localStorage.getItem('FolderChecked'));
                //exists = true;
            }
            if(selMpngs == null)
                selMpngs =[];
            if($('#mapdUsers input[name="inputMapdUrs"]:checked').length != 0){
                var s = JSON.parse(localStorage.getItem('selectedMappings'));
                for(var i=0;i<s.length;i++) {
                    selMpngs.push(s[i]);
                }
            }
            var array1 = [];
            if(data.length !=0) {

                for (var i = 0; i < data.length; i++) {
                    array1.push(data[i]);
                }
            }
            // var selMpngs= JSON.parse(localStorage.getItem('selectedMappings'));

            var array2 = [];
            for(var i=0;i<selMpngs.length;i++){
                array2.push(selMpngs[i].fromCloudId.id);
            }
            //   var UnSync = array2.filter( function(sync) {
            //          return !this.has(sync)
            //      },
            //      new Set(data) );

            if(array1.length  != 0) {
                for (var i=0;i<array2.length;i++){
                    for (var j=0;j<array1.length;j++){
                        if(array2[i] == array1[j])
                            delete selMpngs[i];
                    }
                }
                function filter_array(selMpngs) {
                    var index = -1,
                        arr_length = selMpngs ? selMpngs.length : 0,
                        resIndex = -1,
                        result = [];

                    while (++index < arr_length) {
                        var value = selMpngs[index];

                        if (value) {
                            result[++resIndex] = value;
                        }
                    }

                    return result;
                }
                localStorage.setItem("selMappings",JSON.stringify(filter_array(selMpngs)));
                alertSuccess("Some of the Pairs are under Sync Process and processed Migration process with remaining allowed Pairs");
            }
            else{
                localStorage.setItem("selMappings",JSON.stringify(selMpngs));
            }
            mappingOptions.createJob();
        }
    });

}


function syncUsers() {
    var JOBLIST = JSON.parse(localStorage.getItem("jobList"));
    var _obj ={
        "jobList": JOBLIST
    };
    $.ajax({
        type: "POST",
        url: apicallurl + "/move/newmultiuser/create/syncjob",
        data: JSON.stringify(_obj),
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
            console.log(data);
            mappingOptions.localStorageOperation('','rmv');
            CsvOperation('','rmv');
            localStorage.removeItem("jobList");
            mappingOptions.appendSyncMigrationJobs(1,60);
            $("#mappingClouds").css("display","none");
            $("#mappingUsers").css("display","none");
            $('#mappingOptions').css("display","none");
            $("#preview").css("display","none");
            $('#mappedMigration').css("display","none");
            $('#mappedSyncMigration').css("display","");


            var _step = parseInt($("#forNextMove").attr("data-step"));
            _step = _step + 1;
            $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]").removeClass("active").addClass("completed");
            $("#forNextMove").attr("data-step",_step);
            $("#forPreviousMove").attr("data-prev",_step );
            $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
            //$("#scheck").trigger('click');
        }
    });
}
function trialUserMigration() {
    localStorage.removeItem('CsvEmailChecked');
    if ($('#mapdUsers input[name=csvMapngCheckBox]:checked').length) {
        $('#mapdUsers input[name=csvMapngCheckBox]:checked').each(function () {
            var _d = $(this).parent().parent();
            if(!($(this).hasClass('notAllow'))) {
                var EmailObj = {
                    "fromMailId": $(_d).attr('srcemail'),
                    "fileName": $(_d).attr('srcemail'),
                    "toMailId": $(_d).attr('dstnemail'),
                    "fromCloudName": $(_d).attr('srccldname'),
                    "toCloudName": $(_d).attr('dstncldname'),
                };
                CsvOperation(EmailObj, 'setCsv');
            }

        });
    }
    if(localStorage.getItem('CsvEmailChecked')){
	if(JSON.parse(localStorage.getItem('CsvEmailChecked')).length !==0){
        var checkSelection = JSON.parse(localStorage.getItem('CsvEmailChecked'));
   	 }
	}
    if(checkSelection == null ||  checkSelection === []) {
        checkSelection =[];
        localStorage.removeItem("csvName");
    }
    if(localStorage.getItem('selectedEmail')){
	if(JSON.parse(localStorage.getItem('selectedEmail')).length !==0){
        var inpUsers = JSON.parse(localStorage.getItem('selectedEmail'));
        for(var i=0;i<inpUsers.length;i++) {
            checkSelection.push(inpUsers[i]);
     	   }
   	 }
	}
    if(localStorage.getItem('folderEmail')){
	if(JSON.parse(localStorage.getItem('folderEmail')).length !==0){
        var inputUsers = JSON.parse(localStorage.getItem('folderEmail'));
        for(var i=0;i<inputUsers.length;i++) {
            checkSelection.push(inputUsers[i]);
        	}
    		}
	}
    $.ajax({
        type: "POST",
        url: apicallurl + "/move/multiuser/verify/"+localStorage.getItem("UserId"),
        data: JSON.stringify(checkSelection),
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        complete: function (xhr) {
            $("#crmWebToEntityForm #org_name").val("");
            $("#crmWebToEntityForm #org_email").val("");
            $("#crmWebToEntityForm #org_phone").val("");
            $("#crmWebToEntityForm #org_company").val("");
            $("#crmWebToEntityForm #org_message").val("");
            var data = xhr.responseText;
            if (data == "multiuser paid" || data == "true:success") {
                var srcCldName = localStorage.getItem('multiUsrSrcCldName');
                var dstnCldName = localStorage.getItem('multiUsrDstnCldName');
                /*  if(srcCldName === 'EGNYTE_ADMIN' && dstnCldName === "ONEDRIVE_BUSINESS_ADMIN"){
                      syncVerification();
                  }
                  else */
                mappingOptions.createJob();
                // syncVerification();
            }
            else if (data === "false:User not Paid user data exceed"){
                //dataLimitMulti();
                //  $('#entDataLimit').modal('show');
                $('#enterpriseContact').modal('show');
                $('#entDataChange').text('Your migration has been paused. As your trial period allows you to migrate only 10 Gb data. To Continue the migration, please contact us.');

                $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
//$("#forNextMove").removeClass("disabled");
            }
            else{
                // dataLimitMulti();
                var msg = data;
                var noOfusrs = msg.split(":").pop();
                $("#number").text(noOfusrs);
                $('#enterpriseContact').modal('show');
                $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
//$("#forNextMove").removeClass("disabled");
            }

        }

    });

}

/*function dataLimit(){
    $.ajax({
        url:  apicallurl+"/move/multiuser/verify/datalimit/"+localStorage.getItem("UserId"),
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function(response){
            if(response.userLimitExeceeded ===  true) {
                $('#ExtraUserPayment').modal('show');
                var Csvlength = $('input[name="csvMapngCheckBox"]:checked').length;
                var MapdLength = $('#mapdUsers input[name="inputMapdUrs"]:checked').length;
                var totalLength = Csvlength + MapdLength;
                $("#users").html(totalLength);
                var total = totalLength * 25;
                $("#totalVal").html("$" + total);
                $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
            }
            else {
                mappingOptions.createJob();
                setInterval(dataLimit, 30000);
            }

        }
    });
}
function dataLimitMulti(){
    $.ajax({
        url:  apicallurl+"/move/multiuser/verify/datalimit/"+localStorage.getItem("UserId"),
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function(response){
            if(response.userLimitExeceeded ===  true) {
                $('#entDataLimit').modal('show');
                $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
            }
            else{
                $('#EntMigrationDtls').modal('show');
                $("#CFShowLoading").attr("autoMap", "false");
                $("#CFShowLoading").modal("hide");
            }


        }
    });
}*/
/*function Check(){
    $('.proceedBtn').removeClass('disabled');
    $('.proceedBtn').css('opacity','1');
}*/
function cancel() {
    $("#chkInput").prop('checked', false);
    $('#mapdUsrs input[name= "inputMapdUrs"]').prop('checked', false);
    $('#mapdUsrs input[name="csvMapngCheckBox"]').prop('checked', false);
    $('#mapdUsrs input[name="folderMapngCheckBox"]').prop('checked', false);
    localStorage.removeItem("selectedEmail");
    localStorage.removeItem("selectedMappings");
    localStorage.removeItem('folderEmail');
    localStorage.removeItem('folderMappings');
    localStorage.removeItem("CsvEmailChecked");
    localStorage.removeItem("csvMigrationData");
    localStorage.removeItem("FolderChecked");
    $('#org_name').removeClass("valid").addClass("invld");
    $('#org_email').removeClass("valid").addClass("invld");



}
function dataLimit(){
    $.ajax({
        url:  apicallurl+"/move/multiuser/verify/trailuser/"+localStorage.getItem("UserId"),
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function(response){
            var _isCustomUser =  CFManageCloudAccountsAjaxCall.isCustomUser();
            if(response == "MULTIUSER_INACTIVE" && _isCustomUser == false){
                $("#sixGbmsg").css("display","block");
                $("#cusDelta").css("display","none");

            }
        }
    });
}
/* $(document).on('click','#spoToSyncCont',function(){
    var versioning = $('#fileType_dropDown').val();
    if(versioning === 'false'){
        versioning = 'true';
    }
    else{
        versioning = 'false';
    }

    mappingOptions.spoToSyncUpdate(versioning);
});
//Reports page change for one way sync two
$(document).on('click','#twowaySyncSrc',function(){
    var ivalue = $(this).parents('tbody').find('tr.moveSyncWorksapceList.rmvdCloudClass').children('td').find('i.fa-minus');
    var _htmlCode = appendTwoWaySyncWorkspaceReport(getWorkspaceReport_forTWS($(ivalue).parents("tr").attr('wrkspaceid'),'all',1,$(ivalue).parents("tr").attr('srccldname')));
    var count = CFManageCloudAccountsAjaxCall.fileFolderCount($(ivalue).parents("tr").attr('wrkspaceid'),$(ivalue).parents("tr").attr('srccldname'),$(ivalue).attr('jobtype'));
    _htmlCode = _htmlCode.replace('TotalCounting',(count.totalFiles + count.totalFolders)).replace('ProcessedCounting',count.processedCount).replace('ErrorCounting',count.conflictCount);
    $(document).find('.moveReportDetails').html('').css("display","none");
    $(ivalue).parents("tr").next(".moveReportDetails").css("display","");
    $(ivalue).parents("tr").next(".moveReportDetails").append(_htmlCode);
    $('#twowaySyncDstn').removeClass('activeTab');
    $('#twowaySyncSrc').addClass('activeTab');
    moveSyncReportPagination($(ivalue).parents("tr").attr('totcount'),$(ivalue).parents("tr").attr('wrkspaceid'),'all',$(ivalue).parents("tr").attr('srccldname'),$(ivalue).attr('jobtype'));


});
$(document).on('click','#twowaySyncDstn',function(){
//    $(document).find('.moveReportDetails').html('').css("display","none");
    var ivalue = $(this).parents('tbody').find('tr.moveSyncWorksapceList.rmvdCloudClass').children('td').find('i.fa-minus');
    var _htmlCode = appendTwoWaySyncWorkspaceReport(getWorkspaceReport_forTWS($(ivalue).parents("tr").attr('wrkspaceid'),'all',1,$(ivalue).parents("tr").attr('dstncldname')));
    var count = CFManageCloudAccountsAjaxCall.fileFolderCount($(ivalue).parents("tr").attr('wrkspaceid'),$(ivalue).parents("tr").attr('dstncldname'),$(ivalue).attr('jobtype'));
    _htmlCode = _htmlCode.replace('TotalCounting',(count.totalFiles + count.totalFolders)).replace('ProcessedCounting',count.processedCount).replace('ErrorCounting',count.conflictCount);
    $(document).find('.moveReportDetails').html('').css("display","none");
    $(ivalue).parents("tr").next(".moveReportDetails").css("display","");
    $(ivalue).parents("tr").next(".moveReportDetails").append(_htmlCode);
    $('#twowaySyncSrc').removeClass('activeTab');
    $('#twowaySyncDstn').addClass('activeTab');
    moveSyncReportPagination($(ivalue).parents("tr").attr('totcount'),$(ivalue).parents("tr").attr('wrkspaceid'),'all',$(ivalue).parents("tr").attr('dstncldname'),$(ivalue).attr('jobtype'));

});

$(document).on('change','#jobType_dropDown',function(){
    if($('#jobType_dropDown :selected').text() === "Two-way sync" || $('#jobType_dropDown :selected').text() === "One-way sync") {
        $('#selectFrequency').css('display', '');
    }
    else{
        $('#selectFrequency').css('display', 'none');
    }
    if((localStorage.getItem('fromCloudName') === "SHAREPOINT_ONLINE_BUSINESS") && (localStorage.getItem('toCloudName') === "SYNCPLICITY")){
        if($('#jobType_dropDown :selected').text() === "Two-way sync"){
            $('.spoToSyncCity').css('display', 'none');

        }
        else{
            $('.spoToSyncCity').css('display', '');
        }
    }
    else{
        $('.spoToSyncCity').css('display', 'none');
    }
}); */
$(document).on('change','#jobType_dropDown',function() {
    if ($('#jobType_dropDown :selected').text() === "One-way sync") {
        $('#selectFrequency').css('display', '');
    } else {
        $('#selectFrequency').css('display', 'none');
    }
	if((localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN"&&localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES") ||(localStorage.multiUsrSrcCldName == "EGNYTE_ADMIN"&&localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES")){
	if($('#jobType_dropDown :selected').text() === "Delta"){
	 $('#migrateLinksYes').css('opacity', '0.4').css('pointer-events', 'none');
	 $('#migrateLinksNo').css('opacity', '0.4').css('pointer-events', 'none');
	 $("#migrateLinksYes").prop("checked",false);
	 $("#migrateLinksNo").prop("checked",false);
	 $('#infoLinks').css('display', '');
	 $('#infoImg').css('display', '');
	}
	if($('#jobType_dropDown :selected').text() === "One Time"){
	 $('#migrateLinksYes').css('opacity', '1').css('pointer-events', 'auto');
	 $('#migrateLinksNo').css('opacity', '1').css('pointer-events', 'auto');
	 $('#infoLinks').css('display', 'none');
	 $('#infoImg').css('display', 'none');
	 $("#migrateLinksNo").prop("checked",true);
	}
	}
	if((localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "ONEDRIVE_BUSINESS_ADMIN")||(localStorage.multiUsrSrcCldName == "BOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "ONEDRIVE_BUSINESS_ADMIN")||(localStorage.multiUsrSrcCldName == "BOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "SHAREPOINT_ONLINE_BUSINESS")||(localStorage.multiUsrSrcCldName == "BOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "BOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES")){
	if($('#jobType_dropDown :selected').text() === "Delta"){
	$("#migOptions").find('input').prop('checked', false);
	$("#chrNo").prop("checked",false).attr('disabled','true');
	$("#chrYes").prop("checked",false).attr('disabled','true');
	$("#migOptions").find('input').attr('disabled','true');
	$('#migNote').css('display', '');	
	$("#previewNew").css("display","none");
	$("#previewOld").css("height","54vh");
	}
	
	else{
	$("#chrNo").prop("checked",true).removeAttr('disabled');
	$("#chrYes").prop("checked",false).removeAttr('disabled');
	$("#migOptions").find('input').removeAttr('disabled');
	$('#migNote').css('display', 'none');
	$("#previewNew").css("display","");
	$("#previewOld").css("height","23vh");
	}
	}
	else if((localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "SHAREPOINT_ONLINE_BUSINESS")||(localStorage.multiUsrSrcCldName == "BOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "DROPBOX_BUSINESS")||(localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS"&&localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "SHAREFILE_BUSINESS" &&localStorage.multiUsrDstnCldName == "G_SUITE")||(localStorage.multiUsrSrcCldName == "SHAREFILE_BUSINESS" &&localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES")){
	if($('#jobType_dropDown :selected').text() === "Delta"){
	$("#migOptions").find('input').prop('checked', false);
	$("#migOptions").find('input').attr('disabled','true');
	$('#migNote').css('display', '');	
	$("#previewNew").css("display","none");
	$("#previewOld").css("height","54vh");
	}
	else{
	$("#migOptions").find('input').removeAttr('disabled');
	$('#migNote').css('display', 'none');
	$("#previewNew").css("display","");
	$("#previewOld").css("height","23vh");
	}
	}
});
$("#selectAllOpts").on('change',function(){
	if($("#selectAllOpts:checked").length){
		$("#migOptions").find('input').prop('checked', true);
	}
	else{
		$("#migOptions").find('input').prop('checked', false);
	}
});

/*Folder display checkbox events*/
// $(document).on('change','.forDomainNameMin input',function(){
$("#srcCloudUsers,#dstCloudsUsers").on('change','input',function(){
    if($("#srcCloudUsers input:checkbox:checked").length && $("#dstCloudsUsers input:radio:checked").length) {
        /*  if($("#srcCloudUsers input[name=srccheckBox]:checked").length){
              var $srcCheckedUsr = $("#srcCloudUsers input[name=srccheckBox]:checked");
              var $dstCheckedUsr = $("#dstCloudsUsers input:radio:checked");
          }
          else {*/
        $("#CFShowLoading").modal("show");
        var $srcCheckedUsr = JSON.parse(localStorage.getItem('srcFldrsChecked'));
        var $dstCheckedUsr = $("#dstCloudsUsers input:radio:checked");
        for (var i = 0; i < $srcCheckedUsr.length; i++) {
            var  _srcUsrDetails = $srcCheckedUsr[i];
            var _dstnUsrDetails = {
                "dstnUserEmail": $($dstCheckedUsr).attr("usremail"),
                "dstnUserCloudName": $($dstCheckedUsr).attr("cldname"),
                "dstnUserCloudId": $($dstCheckedUsr).attr("cloudid"),
                "dstnUserRtFolId": $($dstCheckedUsr).attr("rtfolid"),
                "dstnFolderPath": $($dstCheckedUsr).attr("folderPath")
            }
	if((localStorage.getItem("multiUsrSrcCldName")==="GOOGLE_SHARED_DRIVES") && (localStorage.getItem("multiUsrDstnCldName")==="SHAREPOINT_ONLINE_BUSINESS")){
	if($($dstCheckedUsr).siblings('span').attr('folder-type') === "FOLDER"){
		var parentName = $($dstCheckedUsr).siblings('span').attr('parent-name');
		}
else if($($dstCheckedUsr).siblings('span').attr('folder-type') === "DOCUMENT_LIBRARY"){
var parentName = $($dstCheckedUsr).siblings('span').attr('folder-name');
}
		}
            $($srcCheckedUsr[i]).removeAttr('checked');
            $($dstCheckedUsr).removeAttr('checked');
            var isFolder = true;
	//		_srcUsrDetails.folderPath = decodeURIComponent(_srcUsrDetails.folderPath);
        //    _dstnUsrDetails.dstnFolderPath = decodeURIComponent(_dstnUsrDetails.dstnFolderPath);
            var _autoSave = autoSaving(_srcUsrDetails, _dstnUsrDetails,isFolder,parentName);

        }
        $("#srcCloudUsers input:checkbox:checked").prop("checked", false).attr('disabled', false);
        fldrStorage('','rmv');
    }
});

$("#srcCloudUsers").on("change","input[name=srccheckBox]",function () {
    var s = $(this);
    if (s.filter(':checked').length){
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="firstInnChkBox"]').prop( "checked", true).attr('disabled',true);
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", true).attr('disabled',true);
    }
    else{
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="firstInnChkBox"]').prop( "checked", false).attr('disabled',false);
        $(this).parents('.fldr_parent').children('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", false).attr('disabled',false);
    }
});
$("#srcCloudUsers").on("change","input[name=firstInnChkBox]",function () {
    var s = $(this);
    if (s.filter(':checked').length){
        $(this).siblings('.fldr_parent1').find('input').prop( "checked", true).attr('disabled',true);
    }
    else{
        $(this).siblings('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", false).attr('disabled',false);
        //   $(this).parents('.fldr_parent1').find('input[name="firstInnChkBox"]').prop( "checked", false);
        $(this).parents('.fldr_parent').find('input[name="srccheckBox"]').prop( "checked", false).attr('disabled',false);
    }
    /*if(($(this).parent().parent().children().length)=== ($(this).parent().parent().children().children('input:checked').length)){
        $(this).parent().parent('.fldr_parent1').siblings().find('input').prop( "checked", true);
        $(this).parent().parent().find('input').attr('disabled',true);
    }*/
});

$("#srcCloudUsers").on("change","input[name=folderSubChkBox]",function () {
    var s = $(this);
    if (s.filter(':checked').length){
        $(this).closest('.usr-data').find('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", true).attr('disabled',true);
        // $(this).closest('.fldr_parent1').parents('.fldr_parent1').children('.fileActive').find('input[name="firstInnChkBox"]')
    }
    else{
        $(this).closest('.usr-data').find('.fldr_parent1').find('input[name="folderSubChkBox"]').prop( "checked", false).attr('disabled',false);
        $(this).parents('.usr-data').find('input[name="firstInnChkBox"]').prop( "checked", false).attr('disabled',false);
        $(this).parents('.fldr_parent').find('input[name="srccheckBox"]').prop( "checked", false).attr('disabled',false);
    }
    /* if(($(this).parent().parent().children().length)=== ($(this).parent().parent().children().children('input:checked').length)){
         $(this).parent().parent('.fldr_parent1').siblings('input').prop( "checked", true);
         $(this).parent().parent().find('input').attr('disabled',true);
     }*/
});
$("#srcCloudUsers").on('click','input',function(){
    var _srcUsrDetails = {
        "userEmail": $(this).attr("usremail"),
        "userCloudName": $(this).attr("cldname"),
        "userCloudId": $(this).attr("cloudid"),
        "userRtFolId": $(this).attr("rtfolid"),
        "folderPath": $(this).attr("folderPath")
    };
    if($(this).is(':checked')) {
        if(!fldrStorage(_srcUsrDetails,'check')) {
            fldrStorage(_srcUsrDetails, 'set');
        }
    }
    else{
        fldrStorage(_srcUsrDetails,'delete');
    }
});
function fldrStorage(value , op) {
    var _srcFldr = JSON.parse(localStorage.getItem('srcFldrsChecked')),_rtnsrcValue, _len ;
    if(_srcFldr != null)
        _len = _srcFldr.length;
    else
    {
        _len = 0;
        _srcFldr = [];
    }
    var  operations ={
        checkSrcExists :function () {
            _rtnsrcValue = false;
            for(var i=0; i<_len; i++){
                if(_srcFldr[i].userCloudId === value.userCloudId  && _srcFldr[i].userRtFolId === value.userRtFolId)
                    _rtnsrcValue = true;
            }
        },
        checkSrcExists1 :function () {
            _rtnsrcValue = false;
            for(var i=0; i<_len; i++){
                if(_srcFldr[i].userCloudId === value.cloudId  && _srcFldr[i].userRtFolId === value.id)
                    _rtnsrcValue = true;
            }
        },

        deleteSrcValue : function () {
            var  deletedSrcArray = _srcFldr.filter(function(el) {
                return el.userRtFolId !== value.userRtFolId;
            });
            localStorage.setItem('srcFldrsChecked',JSON.stringify(deletedSrcArray));
            _rtnsrcValue = true;
        },

        setSrcValue : function () {
            _srcFldr.push(value);
            localStorage.setItem('srcFldrsChecked',JSON.stringify(_srcFldr));
            _rtnsrcValue = true;
        },

        getValue :function () {
            _rtnsrcValue = _srcFldr;

        },
        remove   : function () {
            localStorage.removeItem('srcFldrsChecked');
            _rtnsrcValue = true;

        },

    };
    switch(op){

        case 'check'  : operations.checkSrcExists();
            break;
        case 'check1'  : operations.checkSrcExists1();
            break;
        case 'delete' : operations.deleteSrcValue();
            break;
        case 'set'    : operations.setSrcValue();
            break;
        case 'get'    : operations.getValue();
            break;
        case 'rmv'    : operations.remove();
            break;
    }

    return _rtnsrcValue;
};
///options page new design
$(".fromDate").datepicker({
    showOn: 'button',
    buttonImageOnly: true,
    buttonImage: 'https://jqueryui.com/resources/demos/datepicker/images/calendar.gif',
    onSelect: function(dateText, inst) {
        var date = $(this).val();
        var time = $('#time').val();
    }
});
$(".toDate").datepicker({
    showOn: 'button',
    buttonImageOnly: true,
    buttonImage: 'https://jqueryui.com/resources/demos/datepicker/images/calendar.gif',
    onSelect: function(dateText, inst) {
        var date = $(this).val();
        var time = $('#time').val();
    }
});
$(document).on('click','.JobOptions .fa-minus',function() {
    $(this).removeClass('fa-minus').addClass('fa-plus');
    $(".optionsDiv1").css("display","none");
    $(".optionsDiv2").css("display","block");
    $(".Fileoptions .fa-plus").removeClass('fa-plus').addClass('fa-minus');
});
$(document).on('click','.JobOptions .fa-plus',function() {
    $(this).removeClass('fa-plus').addClass('fa-minus');
    $(".optionsDiv1").css("display","block");
    $(".optionsDiv2").css("display","none");
    $(".Fileoptions  .fa-minus").removeClass('fa-minus').addClass('fa-plus');
});
$(document).on('click','.Fileoptions  .fa-plus',function() {
    $(this).removeClass('fa-plus').addClass('fa-minus');
    $(".JobOptions .fa-minus").removeClass('fa-minus').addClass('fa-plus');
    $(".optionsDiv2").css("display","block");
    $(".optionsDiv1").css("display","none");
});
$(document).on('click','.Fileoptions  .fa-minus',function() {
    $(this).removeClass('fa-minus').addClass('fa-plus');
    $(".JobOptions .fa-plus").removeClass('fa-plus').addClass('fa-minus');
    $(".optionsDiv2").css("display","none");
    $(".optionsDiv1").css("display","block");
});
$(document).on('click','#Timeperiod .fa-chevron-down',function(){
    $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up")
    $(".dropdown-menu1").css("display","block");
    $(".selected_option").css("border-radius","0");
    $(".selected_option").css({"border-top-left-radius":"10px","border-top-right-radius":"10px"});
});
$(document).on('click','#Timeperiod .fa-chevron-up',function(){
    $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down")
    $(".dropdown-menu1").css("display","none");
    $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
});
$(document).on('click','#Timeperiod2 .fa-chevron-down',function(){
    $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up")
    $(".dropdown-menu1job").css("display","block");
    $(".selected_optionjob").css("border-radius","0");
    $(".selected_optionjob").css({"border-top-left-radius":"10px","border-top-right-radius":"10px"});
});
$(document).on('click','#Timeperiod2 .fa-chevron-up',function(){
    $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down")
    $(".dropdown-menu1job").css("display","none");
    $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
});
//Delta
pastweek = function(){
    $(".selected_option span").text($("#Past_week").text());
    $(".dropdown-menu1").css("display","none");
    $(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
pastMonth = function(){
    $(".selected_option span").text($("#Past_Month").text());
    $(".dropdown-menu1").css("display","none");
    $(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
past3months = function(){
    $(".selected_option span").text($("#Past_3Months").text());
    $(".dropdown-menu1").css("display","none");
    $(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_option").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
//oneway-sync or two way sync
Daily = function(){
    $(".selected_optionjob span").text($("#Daily").text());
    $(".dropdown-menu1job").css("display","none");
    $(".selected_optionjob .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
Weekly = function(){
    $(".selected_optionjob span").text($("#Weekly").text());
    $(".dropdown-menu1job").css("display","none");
    $(".selected_optionjob .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
Monthly = function(){
    $(".selected_optionjob span").text($("#Monthly").text());
    $(".dropdown-menu1job").css("display","none");
    $(".selected_optionjob .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_optionjob").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
//fileoptions
$(document).on('click','#Timeperiodfile .fa-chevron-down',function(){
    $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up")
    $(".dropdown-menufile").css("display","block");
    $(".selected_optionfile").css("border-radius","0");
    $(".selected_optionfile").css({"border-top-left-radius":"10px","border-top-right-radius":"10px"});
});
$(document).on('click','#Timeperiodfile .fa-chevron-up',function(){
    $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down")
    $(".dropdown-menufile").css("display","none");
    $(".selected_optionfile").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
});
$('.allownumericwithdecimal').on("input propertychange paste",function (event) {
    var reg = /^0+/gi;
    if (this.value.match(reg)) {
        this.value = this.value.replace(reg, '');
    }
    return true;
});
$(".allownumericwithdecimal").keypress(function (e) {
    if(this.value.length == 0){
        if(e.which === 46)
            return false;
    }
    if (e.which != 8 && e.which != 0 && ((e.which < 48 && e.which != 46) || e.which > 57)) {
        return false;
    }
    if (e.which === 46 && this.value.split('.').length === 2) {
        return false;
    }
    var s = this.value;
    if(s.includes('.') === true)
        if(s.split('.')[1].length > 4){
            return false;
        }
});
pastweekfile = function(){
    $(".selected_optionfile span").text($("#Past_weekfile").text());
    $(".dropdown-menufile").css("display","none");
    $(".selected_optionfile .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_optionfile").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
pastMonthfile = function(){
    $(".selected_optionfile span").text($("#Past_Monthfile").text());
    $(".dropdown-menufile").css("display","none");
    $(".selected_optionfile .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_optionfile").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
past3monthsfile = function(){
    $(".selected_optionfile span").text($("#Past_3Monthsfile").text());
    $(".dropdown-menufile").css("display","none");
    $(".selected_optionfile .fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    $(".selected_optionfile").css({"border-bottom-left-radius":"10px","border-bottom-right-radius":"10px"});
}
//enter emails

$('#my_input').keyup(function(event) {
    if(event.which == 32 || event.which == 188 || event.which == 13) {
        var val = $(this).val();
        if(val.length === 0 ){
            return false;
        }
        mappingOptions.checkEmailNew(val);
        $(this).attr('placeholder', '');
        // empty input
        $(this).val('');

    }
});
$('#my_input').each(function() {
    var $orig = $(this);
    $(this).closest('form').submit(function (e) {

        var emails = new Array();
        $('.multipleInput-email span').each(function () {
            emails.push($(this).html());
        });
        emails.push($input.val());

        $orig.val(emails.join());

    });
});
$(document).find('#additionalEmails').click(function() {
    $('#my_input').focus();
});
$(document).find('#additionalEmailsplaceholder').click(function() {
    $(this).css("display","none");
    $('#additionalEmails').css("display","");
    $('#my_input').focus();

    $('body').on('mouseup', function (e) {
        var container = $('#additionalEmails');
        if (!container.is(e.target)
            && ($('#my_input').val() === '' && !($('#additionalEmails ul li').hasClass('multipleInput-email')))) {    //console.log("jsf");
            $('#additionalEmailsplaceholder').css("display","");
            $('#additionalEmails').css("display","none");
            $('body').off('mouseup');
        }
    });
});
//file type
$('#my_inputfile').keyup(function(event) {
	if(event.key == "Enter" || event.key == ',' || event.keyCode == 32){
        event.preventDefault();    
        var val = $(this).val().trim();
        if(val.length === 0){
            $(this).val('');
            return false;
        }
        mappingOptions.checkfileType(val);
        $(this).attr('placeholder', '');
            var _html = '<div style="border: 1px solid #aaa;padding: 5px;display:inline-block;background: #fff;margin:8px 5px;" class="mpParent"><span>' + val +'</span><div style=" margin: 0 0 0 13px; font-size: 12px;float: right;" class="closeEmail"><i class="lnil lnil-cross-circle" style="cursor: pointer"></i></div></div>&nbsp'
            $(".fileTypeExc").append(_html);
            $(this).val('');
            //$("textarea").val("");
        
        // empty input
        $(this).val('');

    }
});
$('#my_inputfile').each(function() {
    var $orig = $(this);
    $(this).closest('form').submit(function (e) {

        var _fileTypes = new Array();
        $('.multipleInput-files span').each(function () {
            _fileTypes.push($(this).html());
        });
        _fileTypes.push($input.val());

        $orig.val(_fileTypes.join());

    });
});
$(document).find('#fileTypeExc').click(function() {
    $('#my_inputfile').focus();
});
$(document).find('#fileTypeExcec').click(function() {
    $(this).css("display","none");
    $('#fileTypeExc').css("display","");
    $('#my_inputfile').focus();

    $('body').on('mouseup', function (e) {
        var container = $('#fileTypeExc');
        if (!container.is(e.target)
            && ($('#my_inputfile').val() === '' && !($('#fileTypeExc ul li').hasClass('multipleInput-files')))) {    //console.log("jsf");
            $('#fileTypeExcec').css("display","");
            $('#fileTypeExc').css("display","none");
            $('body').off('mouseup');
        }
    });
});
<!--Name can't be blank-->
$('#org_name').on('input', function() {
    var input=$(this);
    var is_name=input.val();
    if(is_name){
        input.siblings().removeClass('error_show').addClass('error');
        input.removeClass("invalid").addClass("valid");
    }
    else{
        input.removeClass("valid").addClass("invalid");
    }
});

<!--Email must be an email -->
$('#org_email').on('input', function() {
    var input=$(this);
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var is_email=re.test(input.val());
    if(is_email){
        input.removeClass("invalid").addClass("valid");
    }
    else{
        input.removeClass("valid").addClass("invalid");
    }
    if(($("#org_email")[0].validationMessage) == "") {
        input.siblings().removeClass('error_show').addClass('error');
        input.removeClass("invalid").addClass("valid");
    }
    else{
        input.siblings().removeClass('error').addClass('error_show');
        input.removeClass("valid").addClass("invalid");
    }

});
/*$('#org_company').on('input', function() {
    var input=$(this);
    var is_name=input.val();
    if(is_name){
        input.siblings().removeClass('error_show').addClass('error');
        input.removeClass("invalid").addClass("valid");
    }
    else{
        input.removeClass("valid").addClass("invalid");
    }
});
<!--Message can't be blank -->
$('#org_message').keyup(function(event) {
    var input=$(this);
    var message=$(this).val();
    console.log(message);
    if(message){
        input.siblings().removeClass('error_show').addClass('error');
        input.removeClass("invalid").addClass("valid");
    }
    else{
        input.removeClass("valid").addClass("invalid");
    }
});*/


<!-- After Form Submitted Validation-->
$(".submitBtn").click(function(event){
    $('#enterpriseContact').modal({'backdrop': 'static'});
    var forms_data=$("#org").serializeArray();
    var error_free=true;
    for (var input in forms_data){
        var element=$("#org_"+forms_data[input]['name']);
        var value = element.val();
        if(value !== "")
            element.removeClass("invld");
        var valid=element.hasClass("valid");
        var unchange = element.hasClass("invld");
        var error_element=$("span", element.parent());
        if (!valid || unchange){
            error_element.removeClass("error").addClass("error_show");
            $(".errorMsg").css("margin-left","-9%");
            error_free=false;
        }
        else{
            error_element.removeClass("error_show").addClass("error");
        }
    }
    if (!error_free){
        event.preventDefault();
    }
    else{
        var formsData = $("#org").serialize();
        $zopim(function() {
            var data = decodeURIComponent(formsData.split('&')[0])+','+decodeURIComponent(formsData.split('&')[1])+','+decodeURIComponent(formsData.split('&')[2])
                +','+decodeURIComponent(formsData.split('&')[3].replace(/\+/g,' '))+','+decodeURIComponent(formsData.split('&')[4].replace(/\+/g,' '));
            $zopim.livechat.say(data);
        });
        sendGAEvents('Enterprise trial user migration form submitted');
	//	activecampaign.eventTrack('Enterprise Trial User Migration Form',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'Submit');
        $.ajax({
            type: "POST",
            //    url: "https://script.google.com/macros/s/AKfycbxkpP8lBswbYDhMJ0E906yTZQPZtGj69966ivuoMg/exec",
            url: "https://script.google.com/macros/s/AKfycbx_XFZ7HDoHxNTHj8R0XinoWXwdnyEziKf97-0ILA/exec",
            async:false,
            data: formsData,
            success: function() {
			//	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'leadSource','Webapp_Pricing');
              //  zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail, 'contact');
                $('#enterpriseContact').modal('hide');
                $("#org_thankyoumessage").modal('show');
                setTimeout(function(){
                    $("#org_thankyoumessage").modal('hide');
                    cancel();
                },3000);
                $('#org_name').val('');
                $('#org_email').val('');
                $('#org_company').val('');
                $('#org_message').val('');
                $('#org_phone').val('');
                $('#org_name').removeClass("valid").addClass("invld");
                $('#org_email').removeClass("valid").addClass("invld");
                //   $('#org_company').removeClass("valid").addClass("invld");
                //  $('#org_message').removeClass("valid").addClass("invld");

            }
        });
        return false;

    }
});
$("#Teamfolders_No").click(function()
{


    $("#teamYescont").css("display","none");
    $("#teamNocont").css("display","");
    if(rootTFolder == true  ){
        $("#CFTeamFolderPermission").modal("show");
    }
});
$("#Teamfolders_Yes").click(function()
{
    $("#teamYescont").css("display","");
    $("#teamNocont").css("display","none");
    var _adminPresent = localStorage.getItem('_admin');
    if (_adminPresent == 'adminAbsent' ){
        $("#CFTeamFolderAdminPermission").modal("show");
    }

});
$("#temFldrPrmOK").click(function() {
    if(temp.includes('true') && (rootTFolder == true)   ){
        if((rootFolder == false && normalCSVUser == false && manaulUser == false)){
            $("#Teamfolders_Yes").prop("checked", true);
            $("#Teamfolders_No").prop("checked", false);
            $("#teamYescont").css("display","");
            $("#teamNocont").css("display","none");
        }
     
    }

});
$("#temFldrAdminPrmOK").click(function() {
    if(temp.includes('false') && JSON.parse(localStorage.getItem("CsvEmailChecked")).length == 1) {
        $("#Teamfolders_Yes").prop("checked", false);
        $("#Teamfolders_No").prop("checked", true);
        $("#teamYescont").css("display", "none");
        $("#teamNocont").css("display", "");
    }
});
$("#removeMappingPopup").click(function() {
    localStorage.removeItem("teamMigrationMappingPopUp");
});

$("#migOptions").on("change","input[name=boxOptions]",function () {
	if(localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS" && localStorage.multiUsrDstnCldName
	== "G_SUITE"){
	if($("#vrsnHisMig:checked").length >0){
	if($("input[name=boxOptions]:checked").length < 9){
		$('#selectAllOpts').prop("checked",false);
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}
	}
	else{
	if(localStorage._admin == "adminAbsent"){
	if($("input[name=boxOptions]:checked").length < 2){
		$('#selectAllOpts').prop("checked",false); 
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}
	}
	else if($("input[name=boxOptions]:checked").length < 3){
		$('#selectAllOpts').prop("checked",false);
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}	
	}
	}
	else if(localStorage.multiUsrSrcCldName == "BOX_BUSINESS" && localStorage.multiUsrDstnCldName == "GOOGLE_SHARED_DRIVES"){
		if($("input[name=boxOptions]:checked").length < 6){
		$('#selectAllOpts').prop("checked",false);
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}
	}
	else if(localStorage.multiUsrSrcCldName == "BOX_BUSINESS" && localStorage.multiUsrDstnCldName == "DROPBOX_BUSINESS"){
		if($("input[name=boxOptions]:checked").length < 6){ 
		$('#selectAllOpts').prop("checked",false);
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}
	}
	else if(localStorage.multiUsrSrcCldName == "DROPBOX_BUSINESS" && localStorage.multiUsrDstnCldName == "SHAREPOINT_ONLINE_BUSINESS"){
		if($("input[name=boxOptions]:checked").length < 2){ 
		$('#selectAllOpts').prop("checked",false);
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}
	}
	else{
	if($("#Teamfolders:checked").length >0){ 
	if($("input[name=boxOptions]:checked").length < 9){ 
		$('#selectAllOpts').prop("checked",false);
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	} 
	}
		else{ 
		if($("input[name=boxOptions]:checked").length < 7){
		$('#selectAllOpts').prop("checked",false);   
	}
	else{
		$('#selectAllOpts').prop("checked",true);
	}	
		}
	}
});     
