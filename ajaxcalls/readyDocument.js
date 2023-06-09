$(document).ready(function () {
    var urlParams;
    (window.onpopstate = function () {
        var match,pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
        urlParams = {};
        while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    })();
    pmntpage = urlParams["pinfo"];
	if (pmntpage){
		var url=domainUrl+'/pages/settings.html#price';//?pinfo=true
		sessionStorage.setItem("pmnt",url);
	}
    if (CFManageCloudAccountsAjaxCall != undefined && CFManageCloudAccountsAjaxCall.getUserId()) {
        $("body").removeClass("divdisplay");
    }
    else {
        window.location.href = "index.html";
    }
    CFManageCloudAccountsAjaxCall.getAllCloudTitles(CloudName, CloudId);
    CFManageCloudAccountsAjaxCall.getAllClouds();

});
	$(".settingspage").click(function(){
		var UserObj = JSON.parse(localStorage.getItem('CFUser'));
		$(".ProfileContent").html(UserObj.lastName +" </span>");
		$(".ProfileContentemail").html(UserObj.primaryEmail +" </span>");
        var _mobile = UserObj.mobileNumber == null ? 'Not Available' : UserObj.mobileNumber;
        if(_mobile == "")
            _mobile ="Not Available";
        $(".ProfileContentmobile").html( _mobile+" </span>");
		timeOffset();
		function get_time_zone_offset( ) {
			var current_date = new Date();
			return -current_date.getTimezoneOffset() / 60;
		}
		function timeOffset(){
			var timeZoneData = get_time_zone_offset();
			var timezones = {
				'-12': 'Pacific/Kwajalein',
				'-11': 'Pacific/Samoa',
				'-10': 'Pacific/Honolulu',
				'-9': 'America/Juneau',
				'-8': 'America/Los_Angeles',
				'-7': 'America/Denver',
				'-6': 'America/Mexico_City',
				'-5': 'America/New_York',
				'-4': 'America/Caracas',
				'-3.5': 'America/St_Johns',
				'-3': 'America/Argentina/Buenos_Aires',
				'-2': 'Atlantic/Azores',
				'-1': 'Atlantic/Azores',
				'0': 'Europe/London',
				'1': 'Europe/Paris',
				'2': 'Europe/Helsinki',
				'3': 'Europe/Moscow',
				'3.5': 'Asia/Tehran',
				'4': 'Asia/Baku',
				'4.5': 'Asia/Kabul',
				'5': 'Asia/Karachi',
				'5.5': 'Asia/Calcutta',
				'6': 'Asia/Colombo',
				'7': 'Asia/Bangkok',
				'8': 'Asia/Singapore',
				'9': 'Asia/Tokyo',
				'9.5': 'Australia/Darwin',
				'10': 'Pacific/Guam',
				'11': 'Asia/Magadan',
				'12': 'Asia/Kamchatka'
			};
			$.each(timezones, function (key, value) {
				if (key == timeZoneData) {
					timeZoneData = value;
                    var tspan = $("#timeZone").find("span");
                    tspan.html("");
                    tspan.append("<select class='dropdown'><option value='' class='label'>GMT+"+key+" "+timeZoneData+"</option></select></span>");
				}
			});
		}

    $.each(AllCloudsInfo, function (i, cloud) {
        if(cloud.cloudName == "ONEDRIVE" && cloud.cloudStatus == "INACTIVE"){
            $(".icon-cloud").parent().append('<i class="cf-warning" style="color: rgb(236, 40, 40);font-size: 15pt;position: absolute;top: -12px;right: -4px;width: 32px;height: 32px;"></i>');
            setTimeout(function(){
                $("#ONEDRIVE .ErrorRefresh").parent().attr('title', 'OneDrive API has been upgraded. Please re-connect your cloud.');
                $(".ONEDRIVE").parents(".cf-warning").attr('title', 'OneDrive API has been upgraded. Please re-connect your cloud.');
            }, 3000);
        }
    });
	

});
function checkIsaCustomUserForLogin(_userId) {
        var valid = false;
        var _url = apicallurl + "/report/entuser/validate/"+_userId;//+localStorage.getItem("UserId");
        $.ajax({
            type: "GET",
            url: _url,
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (result) {
                if(result == true){
                    valid = true;
                }else{
                    valid = false;
                }
            }
        });
        return valid;
    }
	
	 function checkUserProgressLimit() {
        var _url = apicallurl + "/move/limit/active"; 
         $.ajax({
            type: "GET",
            url: _url,
            async: true,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
				"Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails()
            },
            success: function (result) {
			/*if(result.entUsage >0){
			var a = result.entUsage;
			}
			else{
             var a = result.usedData;
			}*/
		 var a = result.usedData;
			 var b = result.totalData;
			 var c = a/b*100;
			 var d = getDataSize(a);
			 var e = getDataSize(b);
			 $("#usedData").text(d);
			 $("#usedData1").text(d);
			 $("#totalData").text(e);
			  $("#totalData1").text(e);
			 if($("#usedData").text()==0){
			 if($("#totalData").text().includes('GB')){
			 $("#usedData").text('0'+' GB');
			 $("#usedData1").text('0'+' GB');
			 }
			 }
			  if(result.amountPaid == "Free Trail" || result.amountPaid == "Enterprise Paid"){
			 $("#cancelSubscription").css("display","none");
			 $("#billingDetails").css("display","none");
			 if(result.amountPaid == "Enterprise Paid"){ 
			$(".upgradeBtn").css("display","none");
			 }
			 else
			 $(".upgradeBtn").css("display","");
			 }
else if(result.status == "INACTIVE"){
$("#cancelSubscription").css("display","none");
			 $("#billingDetails").css("display","");
$(".upgradeBtn").css("display","");
}
			 else{
			$(".upgradeBtn").css("display","none");
			 $("#cancelSubscription").css("display",""); 
			 $("#billingDetails").css("display","");
			 }
			
			 if(c > 0 && c < 1){
			 c = 1;
			 }
			 else{
			 c = Math.round(c);
            }
			$(".progress-bar.progress-bar-success").css('width', c+'%');
			}
        });
    }
	function getDataSize(sizeBytes) {
	 var ONE_KB = 1024;
var ONE_MB = ONE_KB * ONE_KB;
var ONE_GB = ONE_KB * ONE_MB;
var ONE_TB = ONE_KB * ONE_GB;
        if (sizeBytes == undefined || sizeBytes == null || sizeBytes == 0) {
            return '0GB';
			}
			var fsize=0;
            if (Math.round(sizeBytes / ONE_GB) > 0) {
                fsize = sizeBytes / ONE_GB;
                displaySize = parseFloat(fsize).toFixed(2) + " GB";
            } else if (Math.round(sizeBytes / ONE_MB) > 0) {
                fsize = sizeBytes / ONE_MB;
                displaySize = parseFloat(fsize).toFixed(2) + " MB";
            } else if (Math.round(sizeBytes / ONE_KB) > 0) {
                fsize = sizeBytes / ONE_KB;
                displaySize = parseFloat(fsize).toFixed(2) + " KB";
            } else if (Math.round(sizeBytes / ONE_TB) > 0) {
                fsize = sizeBytes / ONE_TB;
                displaySize = parseFloat(fsize).toFixed(2) + " TB";
            }else {
                displaySize = sizeBytes + " Bytes";
            }
            return displaySize;
    }

function alertSuccess(msg){
	
	$('.alertScs .msg').text(msg);
	  $('.alertScs').addClass("show");
        $('.alertScs').removeClass("hide");
        $('.alertScs').addClass("showAlert");
        setTimeout(function(){
          $('.alertScs').removeClass("show");
          $('.alertScs').addClass("hide"); 
	   },7000);
	  }
	  
function alertError(msg){
	
	$('.alertErr .msg').text(msg); 
	  $('.alertErr').addClass("show");
        $('.alertErr').removeClass("hide");
        $('.alertErr').addClass("showAlert");
        setTimeout(function(){
          $('.alertErr').removeClass("show");
          $('.alertErr').addClass("hide");
	   },7000);
	  }
	  
	  $('.close-btnScs').click(function(){
        $('.alertScs').removeClass("show");
        $('.alertScs').addClass("hide");
      });
      $('.close-btnErr').click(function(){
        $('.alertErr').removeClass("show");
        $('.alertErr').addClass("hide");
      });
	  
 $(document.body).on('click', function() {
        if(localStorage.getItem("storageVal") == null){
            alertSuccess("You have been logged out");
			setTimeout(function(){
            window.location.href = "index.html";
			},2000);
        }
    });