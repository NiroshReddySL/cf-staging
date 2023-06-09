/* Share Access Settings Click Eventes By Ramesh*/
$('#addNewShareUser').on('click',function() {
    var testid = $('#advancedUASTBody').children('tr:first').attr('id');
    if (testid == 'newUser') {
        return false
    }else {

        sendGAEvents("Share Functionality","Add New Colab");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Add New Colab"]);
        var aduastBody = $("#advancedUASTBody");
        aduastBody.prepend('<tr id="newUser" style="border-bottom:1px solid #eee; height:30px;"><td style="width:50%;text-align:left;" class="shareAccessUser"><input type="text" style="height: 20px;margin-top: 10px;width:92%;" autofocus id="emailInputBox"/><i class="emailOk"></i></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        $("#emailInputBox").focus();
        if ($.inArray('read', FilePer) > -1) {
            aduastBody.find("#cownerASAS").prop('disabled', true);
            aduastBody.find("#editASAS").prop('disabled', true);
        }
        if ($.inArray('edit', FilePer) > -1) {
            aduastBody.find("#cownerASAS").prop('disabled', true);
        }
    }
    $('#emailInputBox').keypress(function (e) {
        if (e.which == 13) {
            $(".emailOk").trigger("click");
        }
    });
});
	
$('#searchShareUser').on('click',function() {
    var usermail1 = $(this).parent().siblings("div").children("input").val();
    var usermail = usermail1.toLowerCase();
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var user = localStorage.getItem("CFUser");
    user = jQuery.parseJSON(user);
    usermail = usermail.split(',');
    var shEmailId = $("#shareEmailId");
    var aduastBody = $("#advancedUASTBody");
    for (var i = 0; i < usermail.length; i++) {
        usermail[i] = $.trim(usermail[i]);
        if (usermail[i] == '') {
            shEmailId.css('border-color', 'red');
            return false;
        }
        if (usermail[i] == user.primaryEmail) {
            shEmailId.css('border-color', 'red');
            //$.smallBox({title: "Already you are the Owner.", color: "#e35e00", timeout: notifyTime, sound: false});
            showNotyNotification("error","Already you are the Owner.");
            return false;
        }
        if ($.inArray(usermail[i], sharemailsUnames) > -1) {
            shEmailId.css('border-color', 'red');
            //$.smallBox({title: "This Email is already Added.", color: "#e35e00", timeout: notifyTime, sound: false});
            showNotyNotification("error","This Email is already Added.");
            return false;
        }
        if (emailReg.test(usermail[i])) {
            sendGAEvents("Share Functionality","Add New Colab");
            //_gaq.push(['_trackEvent', "Share Functionality", localStorage.getItem('UserId'), "Add New Colab"]);
            $(this).parent().siblings('div').children('input').val('');
            $(this).parent().siblings('div').children('input').css('border-color', '');
            shEmailId.focus();
            $('#advancedUASTBody').append('<tr id="' + usermail[i] + '" type="read" style="border-bottom:1px solid #eee; height:30px;"><td style="width:50%;text-align:left;" class="shareAccessUser">' + usermail[i] + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
            if ($.inArray('read', FilePer) > -1) {
                aduastBody.find("#cownerASAS").prop('disabled', true);
                aduastBody.find("#editASAS").prop('disabled', true);
            }
            if ($.inArray('edit', FilePer) > -1) {
                aduastBody.find("#cownerASAS").prop('disabled', true);
            }
            if ($.inArray(usermail[i], sharemailsUnames) < 0) {
                sharemailsUnames.push(usermail[i]);
            }
            $(this).parent().siblings("td").children("input").css('border-color', '');
            if (CfShareInfo == 0) {
                $("#ShareNames").append('<span id="' + usermail[i] + '" class="label label-default" style="float:left;margin:2px;">' + $.trim(usermail[i]) + '<i class="removeTag1"></i></span>');
            }
            else {
                $("#ShareNames").append('<span id="' + usermail[i] + '" class="label label-default new" style="float:left;margin:2px;">' + $.trim(usermail[i]) + '<i class="removeTag1"></i></span>');
            }
        } else {
            shEmailId.css('border-color', 'red');
            shEmailId.val(usermail[i]);
            return false;
        }
    }
});

$("table").on("click",".emailOk",function() {
    var email1 = $(this).siblings("input").val();
    var email = email1.toLowerCase();
    email = $.trim(email);
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var shEmailId = $("#shareEmailId");
    var aduastBody = $("#advancedUASTBody");
    if (email == '') {
        $(this).siblings('input').css('border-color', 'red');
        return false;
    }
    var user = localStorage.getItem("CFUser");
    user = jQuery.parseJSON(user);
    if (email == user.primaryEmail) {
        shEmailId.css('border-color', 'red');
        //$.smallBox({title: "Already you are the Owner.", color: "#e35e00", timeout: notifyTime, sound: false});
        showNotyNotification("error","Already you are the Owner.");
        return false;
    }
    if (emailReg.test(email)) {
        if ($.inArray(email, sharemailsUnames) > -1) {
            $(this).siblings('input').css('border-color', 'red');
            //$.smallBox({title: "This is email is already added.", color: "#e35e00", timeout: notifyTime, sound: false});
            showNotyNotification("error","This is email is already added.");
            return false;
        }
        sendGAEvents("Share Functionality","Add New Colab");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Add New Colab"]);
        $(this).parent().parent().remove();
        $(this).parent().parent().remove();
        var type = "read";
        if ($(this).parent().siblings('.shareAccessUser').children('#editASAS').is(':checked')) {
            type = "edit";
        }

        if ($(this).parent().siblings('.shareAccessUser').children('#cownerASAS').is(':checked')) {
            type = "owner";
        }
        if (type == "read") {
            aduastBody.append('<tr id="' + email + '" type="' + type + '"><td style="width:50%;text-align:left;" class="shareAccessUser">' + email + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        }
        if (type == "edit") {
            aduastBody.append('<tr id="' + email + '" type="' + type + '"><td style="width:50%;text-align:left;" class="shareAccessUser">' + email + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS" checked/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        }
        if (type == "owner") {
            aduastBody.append('<tr id="' + email + '" type="' + type + '"><td style="width:50%;text-align:left;" class="shareAccessUser">' + email + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS" checked disabled/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS" checked/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
        }

        if ($.inArray('read', FilePer) > -1) {
            aduastBody.find("#cownerASAS").prop('disabled', true);
            aduastBody.find("#editASAS").prop('disabled', true);
        }
        if ($.inArray('edit', FilePer) > -1) {
            aduastBody.find("#cownerASAS").prop('disabled', true);
        }
        if ($.inArray(email, sharemailsUnames) < 0) {
            sharemailsUnames.push(email);
        }
        else {
            $(this).siblings("input").css('border-color', 'red');
            return false;
        }
        $(this).siblings("input").css('border-color', '');
        if (CfShareInfo == 0) {// TODO refactor name here - MIKE(Done)
            $("#ShareNames").append('<span id="' + email + '" class="label label-default" style="float:left;margin:2px;">' + $.trim(email) + '<i class="removeTag1"></i></span>');
        } else {
            $("#ShareNames").append('<span id="' + email + '" class="label label-default new" style="float:left;margin:2px;">' + $.trim(email) + '<i class="removeTag1"></i></span>');
        }
    }else {
        $(this).siblings("input").css('border-color', 'red');
    }
});

$('#showAdvancedShareSettings').on('click',function() {
    sendGAEvents("Share Functionality","Show advanced Settings");
    //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Show advanced Settings"]);
    var advShSettings = $("#advancedShareSettings");
    var advanceIcon = $("#advanceIcon");
    advShSettings.toggleClass("divdisplay");
    if (advShSettings.hasClass("divdisplay")) {
        advanceIcon.removeClass("icon-minus");
        advanceIcon.addClass("icon-plus");
    } else {
        advanceIcon.addClass("icon-minus");
        advanceIcon.removeClass("icon-plus");
    }

});

$('table').on('click','.removeEmail',function() {
    sendGAEvents("Share Functionality","Remove Collab");
    //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Remove Collab"]);
    var email = $(this).parent().parent().attr("id");
    //var emails_count = $("#shareSettings").find("#ShareNames").children("span").length;
    sharemailsUnames = $.grep(sharemailsUnames, function (i) {
        return i != email;
    });
    $("#ShareNames").children('span[id="' + email + '"]').remove();
    var type = $(this).parent().parent().attr('type');
    if (type == 'owner') {
        type = "coOwnerEmails";
    }
    if (type == 'edit') {
        type = 'editEmails';
    }
    if (type == 'read') {
        type = 'readEmails';
    }
    if (CfShareInfo != 0) {
        var fid = encodeURIComponent(FromfileId[0]);
        //var removeColab = "fileId=" + fid + "&" + type + "=" + email;
    }
    $(this).parent().parent().remove();
});

$('#CFAShare,#PriviewShare').click(function(e){
    sendGAEvents("Share Functionality",PageName);
    //_gaq.push(['_trackEvent',"Share", localStorage.getItem('UserId'),PageName]);
    e.preventDefault();
    if(PageName == "Share with Me" || PageName == "Share by Me"){
        if(FromfileId.length > 1){
            for(var i=0;i < FromfileId.length;i++){
                if(!$('[id="'+FromfileId[i]+'"]').children('p').children('sup').hasClass("Protected")){
                }else{
                    //$.smallBox({title:"Please select protected files Individually.",color:"#1ba1e2",timeout:notifyError});
                    showNotyNotification("notify","Please select protected files Individually.");
                    return false;
                }
            }
        }
    }
    setTimeout(function(){
	sharemailsUnames = [];
    var advanceIcon = $("#advanceIcon");
    advanceIcon.removeClass("icon-minus");
    advanceIcon.addClass("icon-plus");
	$("#displayMsg").text('');
	$("#shareLink2 , #shareLink1").hide();
	$("#sharedFilesList").html("<ul id='filesList'></ul>");
    $("#shareEmailId").css('border-color','');
	$("#advancedUASTBody").html('');
	$("#ShareNames").html('');
	$("#datetimepicker").attr('data-days','-1');
	$("advancedShareSettings").removeClass('divdisplay').addClass('divdisplay');
	$("#shareFilesModel").find("input").val('');
	$("#shareFilesModel").find("input[type='checkbox']").prop('checked',false);
	$("#publicPrivateCheck").prop('checked',true);
	$("#shareFilesModel").find("textarea").val('');
	//var shareType = $("#advancedUASTBody").children("tr").length;
    for(var i=0;i<FromObjectName.length;i++){
        $("#filesList").append('<li style="word-wrap:break-word;" fid="'+FromfileId[i]+'"><span style="float:left; width:84%;border-bottom:1px solid #ccc;">'+FromObjectName[i]+'</span><span class="RenameCancel" style="float:right;margin:0;margin-right:5px;"></span></li>');
    }
	if($("#publicPrivateCheck").prop('checked') == true){
	    $("#downloadCount").hide();
		$("#tableHeader , #advancedUAS").show();
	}
	else{
		$("#tableHeader , #advancedUAS").show();
	}
	$(".RenameCancel").on("click",function(){
		var length = $("#filesList").children("li").length;
        var fid = $(this).parent("li").attr("fid");
        FromfileId = $.grep(FromfileId,function(i){return i != fid});
		$(this).parent().remove();
		if(length == 1){
			$("#shareFilesModel > .tab-header > button").trigger('click');
		}
	});
	
		
	var shareAddButn = $("#searchShareUser");
	var shareEmailText = $("#shareEmailId");
	$("body").on('mouseup',function(e){
		if(shareAddButn.is(e.target) || shareEmailText.is(e.target)){}
		else{
			$("#shareEmailId").css('border-color','');
			$("body").off('mouseup');
		}
	});
	$("table").on('change','#cownerASAS',function(){
        sendGAEvents("Share Functionality","Change Permissions - C0-Owner");
        //gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Change Permissions - C0-Owner"]);
		if($(this).prop('checked') == true){
			$(this).parent().parent().attr('type','owner');
			$(this).parent().prev().children("#editASAS").prop('checked','true');
			$(this).parent().prev().children("#editASAS").prop('disabled','true');
		}
		else{
			$(this).parent().parent().attr('type','edit');
			$(this).parent().prev().children("#editASAS").prop('checked','true');
			$(this).parent().prev().children("#editASAS").removeAttr('disabled');
		}
	});
	$("table").on('change','#editASAS',function(){
        sendGAEvents("Share Functionality","Change Permissions - Edit");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Change Permissions - Edit"]);
		if($(this).prop('checked') == true){
			$(this).parent().parent().attr('type','edit');
		}
		else{
			$(this).parent().parent().attr('type','read');
		}
	});
	$("#publicPrivateCheck").on('change',function(){
        sendGAEvents("Share Functionality","Change Public/Private");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Change Pulic/Private"]);
		var val = $(this).prop('checked');
		if(val == true){
			$("#tableHeader , #advancedUAS").show();
		}else{
			$("#tableHeader , #advancedUAS").show();
		}
	});
	$("#setPwdSAS input[type='checkbox']").on('change',function(){
	        $(".setPassword:eq(1)").css('border-color','');
            $(".setPassword:first").css('border-color','');
			$('#displayMsg').text('');
		if($(this).prop('checked') == true){
            sendGAEvents("Share Functionality","Set Password");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Set Password"]);
			$(".setPassword").fadeIn();
		}
		else{
            sendGAEvents("Share Functionality","Remove Password");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Remove Password"]);
			$(".setPassword").fadeOut();
            $("#setPwdSAS .setPassword").val('');
		}
	});
	
	$("#setExpSAS input[type='checkbox']").on('change',function(){
	    $("#datetimepicker").css('border-color','');
		$("#displayMsg").text('');
		if($(this).prop('checked') == true){
            sendGAEvents("Share Functionality","Set Expiry");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Set Expiry"]);
			$(".setExpPassword").fadeIn();
		}else{
            sendGAEvents("Share Functionality","Remove Expiry");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Remove Expiry"]);
			$(".setExpPassword").fadeOut();
            $(".setExpPassword").val('');
		}
	});
	$("#setDownCount input[type='checkbox']").on('change',function(){
	    $("#displayMsg").text('');
	    $("#downloadCount").css('border-color','');
		if($(this).prop('checked') == true){
            sendGAEvents("Share Functionality","Set Download Count");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Set Down Count"]);
			$('.setdownCount').fadeIn();
		}else{
            sendGAEvents("Share Functionality","Remove Download Count");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Remove Down Count"]);
			$('.setdownCount').fadeOut();
			$('.setdownCount').val('');
		}
	});
	Date.prototype.addDays = function(days) {
       this.setDate(this.getDate() + days);
       return this;
    };
	var dateToday = new Date();
	dateToday.addDays(1);
	$('#datetimepicker').datepicker({
		inline: true,
        showOtherMonths: true,
        dateFormat: 'mm/dd/yy',
		minDate: dateToday,
        onSelect: function (date) {
            var selectedDate = $('#datetimepicker').datepicker('getDate');
            Date.prototype.DaysBetween = function () {
                var intMilDay = 24 * 60 * 60 * 1000;
                var intMilDif = arguments[0] - this;
                return Math.floor(intMilDif / intMilDay);
            };
			var days = currentDate.DaysBetween(selectedDate);
            $(this).attr('data-days', days);
        }
	});
	$('.setExpPassword,.setPassword').hide();
	if(FromfileId.length == 1) {
        var fileShareData = CFHPlistview.getFileShare(FromfileId[0]);
        CfShareInfo = fileShareData;
        if (CfShareInfo == 0) {
            $('#shareLink2 , #shareLink1').hide();
        }else if (CfShareInfo != 0) {
            $('#shareLink2 , #shareLink1').show();
            $('#shareUrl').val(CfShareInfo.shareUrl);
            var text = $('#shareUrl').val();
            clipboardURL.setText(text);
            var owner = CfShareInfo.coOwnerEmails;
            var read = CfShareInfo.readEmails;
            var edit = CfShareInfo.editEmails;
            var shareStatus = CfShareInfo.status;
            var password = CfShareInfo.sharePassword;
            var shareDays = CfShareInfo.shareDays;

            if (password != 'NOT_REQUIRED') {
                $("#setPwdSAS").find("input[type='checkbox']").prop('checked', true);
                $(".setPassword").val(password);
                $(".setPassword").fadeIn();
            }

            if(shareDays > 0){
                $('#datetimepicker').css('border-color','');
                $("#setExpSAS").find("input[type='checkbox']").prop('checked', true);
                $('.setExpPassword').fadeIn();
                $('#datetimepicker').attr('data-days',shareDays);
                var expDate = new Date(CfShareInfo.creationDate + (shareDays * 24 * 60 * 60 * 1000));
                var displayDate = (expDate.getMonth()+1)+'/'+expDate.getDate()+'/'+expDate.getFullYear();
                $('.setExpPassword').val(displayDate);
            }

            var maxCount = CfShareInfo.maxViewCount;
            if (maxCount != 'NOT_REQUIRED') {
                if (maxCount == 10000) {
                }else {
                    $("#setDownCount").find("input[type='checkbox']").prop('checked', true);
                    $('.setdownCount').val(maxCount);
                    $('.setdownCount').fadeIn();
                }
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
            if (shareStatus == 'SHARED') {
                $('#publicPrivateCheck').prop('checked', false);
            }else {
                $('#publicPrivateCheck').prop('checked', true);
            }
            if ($('#publicPrivateCheck').prop('checked') == true) {
                $('#tableHeader , #advancedUAS').show();
            }else {
                $('#tableHeader , #advancedUAS').show();
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
            if (CfShareInfo.notes != '' || CfShareInfo.notes != undefined) {
                var messages1 = CfShareInfo.notes;
                if (messages1 != null) {
                    var count = messages1.split('<br/>');
                    var count = count.length;
                    var messages = '';
                    for (var i = 0; i < count; i++) {
                        messages = messages1.replace('<br/>', '\n');
                        messages1 = messages;
                    }
                    $('#messageNotes').val(messages);
                }
            }
            sharemailsUnames = emails;
            $.each(emails, function (i, em) {
                $('#ShareNames').append('<span id="' + em + '" class="label label-default" style="float:left;margin:2px;">' + $.trim(em) + '<i class="removeTag1"></i></span>');
                if ($.inArray(em, owner) > -1) {
                    $('#advancedUASTBody').append('<tr id="' + em + '" type="owner" style="border-bottom:1px solid #eee; height:30px;"><td style="width:50%;text-align:left;" class="shareAccessUser">' + $.trim(em) + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS" checked disabled/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS" checked/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                }
                if ($.inArray(em, edit) > -1) {
                    $('#advancedUASTBody').append('<tr id="' + em + '" type="edit" style="border-bottom:1px solid #eee; height:30px;"><td style="width:50%;text-align:left;" class="shareAccessUser">' + $.trim(em) + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS" checked/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                }
                if ($.inArray(em, read) > -1) {
                    $('#advancedUASTBody').append('<tr id="' + em + '" type="read" style="border-bottom:1px solid #eee; height:30px;"><td style="width:50%;text-align:left;" class="shareAccessUser">' + $.trim(em) + '</td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" checked disabled/></td><td style="width:15%;" class="shareAccessUser"><input type="checkbox" id="editASAS"/></td><td style="width:20%;" class="shareAccessUser"><input type="checkbox" id="cownerASAS"/></td><td style="width:15%;" class="shareAccessUser"><i class="removeEmail" style="margin: 0 11px -9px 0;cursor:pointer;"></i></td></tr>');
                }
            });
        }
    }
	else{
		$('#shareLink2 , #shareLink1').hide();
		CfShareInfo = 0;
	}
    if($.inArray('read',FilePer)>-1){
        $("#advancedUASTBody").find("#cownerASAS").prop('disabled',true);
        $("#advancedUASTBody").find("#editASAS").prop('disabled',true);
    }
    if($.inArray('edit',FilePer)>-1){
        $('#advancedUASTBody #cownerASAS').prop('disabled',true);
    }
	if(CfShareInfo != 0) {//TODO fix variable name - Mike(Done)
        var owner = CfShareInfo.user.primaryEmail;
        var UserObj = JSON.parse(localStorage.getItem('CFUser'));
        var me = UserObj.primaryEmail;
        $('#ownerName').remove();
        $('#ownerName1').remove();
        $('#me').remove();
        $('#me1').remove();
        if (owner != me) {
            $('[id="' + owner + '"]').children('i').hide();
            $('[id="' + owner + '"]').children('i').parent().append('<span id="ownerName">(Owner)</span>');
            $('#advancedUASTBody').children('[id="' + owner + '"]').find('#cownerASAS,.removeEmail').prop("disabled", "true");
            $('#advancedUASTBody').children('[id="' + owner + '"]').find('.removeEmail').hide();
            $('#advancedUASTBody').children('[id="' + owner + '"]').find('.removeEmail').parent().append('<span id="ownerName1">Owner</span>');
        }else {
            $('[id="' + owner + '"]').children('i').hide();
            $('[id="' + owner + '"]').children('i').parent().append('<span id="ownerName">(You)</span>');
            $('#advancedUASTBody').children('[id="' + owner + '"]').find('#cownerASAS,.removeEmail').prop("disabled", "true");
            $('#advancedUASTBody').children('[id="' + owner + '"]').find('.removeEmail').hide();
            $('#advancedUASTBody').children('[id="' + owner + '"]').find('.removeEmail').parent().append('<span id="ownerName1">You</span>');

        }
    }
	if(PageName == "Share with Me"){
	   if(CfShareInfo != 0){
	    var UserObj = JSON.parse(localStorage.getItem('CFUser'));
	    var me=UserObj.primaryEmail;
        var meTag = $("[id='"+me+"']");
        var advancedUASTBody = $("#advancedUASTBody");
        meTag.children("i").hide();
        meTag.children("i").parent().append('<span id="me">(Me)</span>');
        advancedUASTBody.children("[id='"+me+"']").find("#cownerASAS,.removeEmail").prop("disabled","true");
        advancedUASTBody.children("[id='"+me+"']").find(".removeEmail").hide();
        advancedUASTBody.children("[id='"+me+"']").find(".removeEmail").parent().append('<span id="me1">Me</span>');
	 }
	}
    if($.inArray('FILE',FileType) > -1){
        $('#setDownCount').show();
    }else{
        $('#setDownCount').hide();
    }
	$('#shareFilesModel').modal();
    $('#shareEmailId').focus();   },100);
});

$('#shareSubmit').on('click',function() {
    sendGAEvents("Share Functionality","Initiage Share");
    //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Initiate Share"]);
    var sread = [];
    var sedit = [];
    var sowner = [];
    var ShareData = {};
    var domainAdd = '';
    var colabcount = $('#advancedUASTBody').children('tr').length;
    if (colabcount == 0) {
        $('#shareEmailId').css('border-color', 'red');
        return false;
    }
    $('#advancedUASTBody').children('tr').each(function () {
        var email = $(this).attr('id');
        var type = $(this).attr('type');
        if (type == "read") {
            sread.push(email);
        }
        if (type == "edit") {
            sedit.push(email);
        }
        if (type == "owner") {
            sowner.push(email);
        }
    });
    var messages1 = $('#messageNotes').val();
    if (messages1 != null && messages1 != '\n') {
        sendGAEvents("Share Functionality","Notes True");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Notes True"]);
        var count = messages1.split('\n');
        var count = count.length;
        var messages = '';
        for (var i = 0; i < count; i++) {
            messages = messages1.replace('\n', '<br/>');
            messages1 = messages;
            if (i == count - 1) {
                messages = messages + '<br/>';
            }
        }
        ShareData.notes = messages;
    }
    ShareData.coOwnerEmails = sowner;
    ShareData.editEmails = sedit;
    ShareData.readEmails = sread;
    if ($("#setPwdSAS").find("input[type='checkbox']").prop('checked') == true) {
        var pass = $('.setPassword:first').val();
        var cpass = $('.setPassword:eq(1)').val();

        if (pass == "") {
            $('.setPassword:first').css('border-color', 'red');
            $('.setPassword:eq(1)').css('border-color', '');
            $('#displayMsg').text("Please enter password.");
            $('.setPassword:first').focus();
            return false;
        }
        if (pass.length < 6 || pass.length > 20) {
            $('.setPassword:first').css('border-color', 'red');
            $('.setPassword:eq(1)').css('border-color', '');
            $('#displayMsg').text("Password must be 6-20 characters in length.");
            $('.setPassword:first').focus();
            return false;
        }else if (cpass == "") {
            $('.setPassword:first').css('border-color', '');
            $('.setPassword:eq(1)').css('border-color', 'red');
            $('#displayMsg').text("Please enter confirm password.");
            $('.setPassword:eq(1)').focus();
            return false;
        }
        if (cpass.length < 6 || cpass.length > 20) {
            $('.setPassword:eq(1)').css('border-color', 'red');
            $('.setPassword:first').css('border-color', '');
            $('#displayMsg').text("Password must be 6-20 characters in length.");
            $('.setPassword:eq(1)').focus();
            return false;
        }else if (pass != cpass) {
            $('.setPassword:eq(1)').css('border-color', 'red');
            $('.setPassword:first').css('border-color', '');
            $('#displayMsg').text("Password and Confirm password should match.");
            $('.setPassword:eq(1)').focus();
            return false;
        }else {
            sendGAEvents("Share Functionality","Download Password True");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Download Password True"]);
            $('.setPassword').css('border-color', '');
            $('#displayMsg').text('');
            ShareData.sharePassword = pass;
        }
    }else if ($("#setPwdSAS").find("input[type='checkbox']").prop('checked') == false) {
        ShareData.sharePassword = "NOT_REQUIRED";
    }
    if ($("#setExpSAS").find("input[type='checkbox']").prop('checked') == true) {
        var expdate = -1;
        if ($('#datetimepicker').val().trim().length != 0) {
            expdate = $('#datetimepicker').attr('data-days');
        }
        if (expdate < 0) {
            $('#datetimepicker').css('border-color', 'red');
            $('#displayMsg').text("Please choose the expiry date.");
            return false;
        }else {
            $('#datetimepicker').css('border-color', '');
            ShareData.maxDays = expdate;
        }
    }else {
        ShareData.maxDays = 30;
    }
    if ($("#setDownCount").find("input[type='checkbox']").prop('checked') == true) {
        var downcount = $('#downloadCount').val();
        var strTest = parseInt(downcount);
        var index = downcount.indexOf('.');
        if (index > -1) {
            $('#downloadCount').css('border-color', 'red');
            $('#displayMsg').text("Download count should be in integer format.");
            return false;
        }else if (downcount == 0) {
            $('#downloadCount').css('border-color', 'red');
            $('#displayMsg').text("Download count should be greater than zero.");
            return false;
        }else if (downcount == "") {
            $('#downloadCount').css('border-color', 'red');
            $('#displayMsg').text("Please enter download count.");
            return false;
        }else if (downcount < 0) {
            $('#downloadCount').css('border-color', 'red');
            $('#displayMsg').text("Please enter possitive number.");
            return false;
        }else if (isNaN(strTest)) {
            $('#downloadCount').css('border-color', 'red');
            $('#displayMsg').text("Download count must be a number.");
            return false
        }else {
            sendGAEvents("Share Functionality","Download Count True");
            //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Download Count True"]);
            $('#downloadCount').css('border-color', '');
            ShareData.maxViews = downcount;
        }
    }else {
        ShareData.maxViews = "10000";
    }

    if ($('#publicPrivateCheck').prop('checked') == true) {
        ShareData.status = 'PUBLIC';
        sendGAEvents("Share Functionality","Share Public");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Share Public"]);
        domainAdd = "publicNew";
    }else if ($('#publicPrivateCheck').prop('checked') == false) {
        ShareData.status = 'SHARED';
        sendGAEvents("Share Functionality","Share Private");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Share Private"]);
        domainAdd = "publicNew";
    }
    if (CfShareInfo == 0) {
        ShareData.fileId = FromfileId;
        var createpar = '';
        var cmail = ShareData.coOwnerEmails;
        var email = ShareData.editEmails;
        var rmail = ShareData.readEmails;
        var fid = ShareData.fileId;
        if (cmail.length > 0) {
            $.each(cmail, function (i, c) {
                createpar += 'coOwnerEmails=' + c + '&';
            });
        }
        if (email.length > 0) {
            $.each(email, function (i, e) {
                createpar += 'editEmails=' + e + '&';
            });
        }
        if (rmail.length > 0) {
            $.each(rmail, function (i, r) {
                createpar += 'readEmails=' + r + '&';
            });
        }
        if (fid.length > 0) {
            $.each(fid, function (i, f) {
                createpar += 'fileId=' + encodeURIComponent(f) + '&';
            });
        }
        var notes = ShareData.notes;
        createpar += 'sharePassword=' + ShareData.sharePassword + '&maxViews=' + ShareData.maxViews + '&maxDays=' + ShareData.maxDays + '&status=' + ShareData.status + '&notify=true';
        sendGAEvents("Share Functionality","New Share");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"New Share"]);
        CFHPlistview.addNewFileshare(createpar, domainAdd, notes);
        setTimeout(function () {
            if (fid.length > 0) {
                $.each(fid, function (i, f) {
                    $('[id="' + f + '"]').children('i:eq(1)').removeClass('LVSharefalse');
                    $('[id="' + f + '"]').children('i:eq(1)').addClass('LVSharetrue');
                });
            }
        }, 1000);
    }else {
        ShareData.fileId = FromfileId;
        var modifydata = {};
        modifydata.fileId = ShareData.fileId[0];
        modifydata.sharePassword = ShareData.sharePassword;
        modifydata.maxViews = ShareData.maxViews;
        modifydata.maxDays = ShareData.maxDays;
        var notes = ShareData.notes;
        var editper = '';
        var cmail = ShareData.coOwnerEmails;
        var email = ShareData.editEmails;
        var rmail = ShareData.readEmails;
        var fid = ShareData.fileId;
        if (cmail.length > 0) {
            $.each(cmail, function (i, c) {
                editper += 'coOwnerEmails=' + c + '&';
            });
        }
        if (email.length > 0) {
            $.each(email, function (i, e) {
                editper += 'editEmails=' + e + '&';
            });
        }
        if (rmail.length > 0) {
            $.each(rmail, function (i, r) {
                editper += 'readEmails=' + r + '&';
            });
        }
        if (fid.length > 0) {
            $.each(fid, function (i, f) {
                editper += 'fileId=' + encodeURIComponent(f) + '&';
            });
        }
        var mailLength = $('#ShareNames').children().length;
        var NewEmails = [];
        for (var i = 0; i < mailLength; i++) {
            var userEmail = $('#ShareNames').children('span:eq(' + i + ')').text();
            if ($('#ShareNames').children('span:eq(' + i + ')').hasClass('new')) {
                NewEmails.push(userEmail);
            }
        }
        var updateemail = "";
        for (var i = 0; i < NewEmails.length; i++) {
            updateemail += 'readEmails=' + NewEmails[i] + '&';
        }
        var filefid = encodeURIComponent(FromfileId[0]);
        updateemail += 'fileId=' + filefid;
        sendGAEvents("Share Functionality","Update Share");
        //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Update Share"]);
        if (NewEmails.length >= 1) {
            CFHPlistview.addFileshare(updateemail, ShareData.notes);
        }
        setTimeout(function () {
            CFHPlistview.updateEmailsShared(editper);
            CFHPlistview.updateStatus(ShareData.status, fid);
            if (fid.length > 0) {
                $.each(fid, function (i, f) {
                    var state  = $('#secondary').find('.active').children('a').attr('id');
                    if(state == "CFSharedByMe"){
                        return false;
                    }else if(state == "CFSharedWithMe") {
                        return false;
                    }else {
                        $('[id="' + f + '"]').children('i:eq(1)').removeClass('LVSharefalse');
                        $('[id="' + f + '"]').children('i:eq(1)').addClass('LVSharetrue');
                    }
                });
            }
        }, 3000);
        setTimeout(function () {
            CFHPlistview.modifyShare(modifydata, notes);
        }, 3600);
    }
    $('#shareFilesModel').modal('hide');
});

$('#shareEmailId').keypress(function(e){
    if(e.which == 13){
        $('#searchShareUser').trigger('click');
    }
});

$('#ShareNames').on('click','.removeTag1',function() {
    sendGAEvents("Share Functionality","Remove Collab");
    //_gaq.push(['_trackEvent',"Share Functionality", localStorage.getItem('UserId'),"Remove Collab"]);
    $(this).parent().remove();
    //var emails_count = $("#shareSettings").find("#ShareNames").children('span').length;
    var emailid = $(this).parent().attr('id');
    sharemailsUnames = $.grep(sharemailsUnames, function (i) {
        return i != emailid;
    });
    var email = $('#advancedUASTBody').children('tr[id="' + emailid + '"]').attr('id');
    var type = $('#advancedUASTBody').children('tr[id="' + emailid + '"]').attr('type');
    if (type == 'owner') {
        type = "coOwnerEmails";
    } else if (type == 'edit') {
        type = 'editEmails';
    } else if (type == 'read') {
        type = 'readEmails';
    }
    if (CfShareInfo == 0) {
        $('#advancedUASTBody').children('tr[id="' + emailid + '"]').remove();
        $(this).parent().remove();
    }else if (email != "undefined") {
        //var removeColab = "fileId=" + encodeURIComponent(FromfileId[0]) + "&" + type + "=" + email;
        $('#advancedUASTBody').children('tr[id="' + emailid + '"]').remove();
        $(this).parent().remove();
    }
});

$('#copy').on('click',function() {
    sendGAEvents("Share Functionality","Copy Link");
    $('#shareUrl').select();
    //$.smallBox({title: "Share url copied successfully.", color: "#1ba1e2", timeout: notifyTime, sound: false});
    showNotyNotification("notify","Share url copied successfully.");
});

/* Share Access Settings Click Eventes By Mike*/