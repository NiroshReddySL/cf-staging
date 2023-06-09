var interVel = null;
var timeIntervel;
/*$(document).ready(function () {
	$('#cf_notification').hide();
    CFManageCloudAccountsAjaxCall.getAllEvents(1,10);
    CFManageCloudAccountsAjaxCall.getEventCount();
    var changeEvent='';
    if($.browser.chrome || $.browser.mozilla || $.browser.safari) { //TODO check new functions - Mike
        changeEvent = "visibilitychange";
    }else if($.browser.msie){
        changeEvent = "msvisibilitychange";
    }

    document.addEventListener(changeEvent,eventrun);
    interVel = 90000;
    runRecursive(interVel);

});*/
$('.top-nav .cf_notify').on('click',function(){
    sendGAEvents("Viewed Notifications",PageName+"/"+$(this).attr('id'));
    //_gaq.push(['_trackEvent', "Viewed Notifications" , localStorage.getItem('UserId'),PageName+"/"+$(this).attr('id')]);
    $('#cf_notification').fadeToggle('slow');
});
$('.notification_body').on('click','.cf-cross32',function(){
    sendGAEvents("Cleared Notification",PageName+"/"+$(this).attr('id'));
    //_gaq.push(['_trackEvent', "Cleared Notification" , localStorage.getItem('UserId'),PageName+"/"+$(this).attr('id')]);
    CFManageCloudAccountsAjaxCall.doClearAllEvents($(this).attr('id'));
});
$('.notification_body').on('click','a',function(){
    var a = $(this).closest('li').find('.cf-cross32').attr('id');
    CFManageCloudAccountsAjaxCall.doIgnoreEvents(a);
    sendGAEvents("Viewed Notifications",PageName+"/"+a);
    //_gaq.push(['_trackEvent', "Viewed Notifications" , localStorage.getItem('UserId'),PageName+"/"+a]);
    var text = $(this).attr('data-target');
    var type = '';
    if(text != undefined && text != null){
        type = text.split('?')[1].split('&')[0].split('=')[0];
    }else{
        return false;
    }
    if($('#main').attr('class') == "fileManager" && type == "shared"){
        if($(this).closest('li').attr('class') == "notify_unred"){
            CFManageCloudAccountsAjaxCall.getEventCount();
            CFManageCloudAccountsAjaxCall.getAllEvents();
        }
        $('#CFSharedWithMe').trigger('click');
    }else{
        window.location.href = text;
    }
});
$('#ignore').on('click',function(){
    sendGAEvents("Ignore All Events");
    //_gaq.push(['_trackEvent', "Ignore All Events" , localStorage.getItem('UserId'),PageName]);
    CFManageCloudAccountsAjaxCall.doIgnoreEvents('all');
    CFManageCloudAccountsAjaxCall.getAllEvents(1 , 10);
    CFManageCloudAccountsAjaxCall.getEventCount();
});
$('#clear').on('click',function(){
    sendGAEvents("Clear All Events");
    //_gaq.push(['_trackEvent', "Clear All Events" , localStorage.getItem('UserId'),PageName]);
    CFManageCloudAccountsAjaxCall.doClearAllEvents('all');
});
$('.notification_footer').on('click','button',function(){
    sendGAEvents("Notifications loadMore");
    //_gaq.push(['_trackEvent', "Notifications loadMore" , localStorage.getItem('UserId'),PageName]);
    var number = parseInt($('.notification_footer button').attr('page'));
    var len = parseInt($('.notification_footer button').attr('size'));
    CFManageCloudAccountsAjaxCall.getAllEvents(number+1 , 10);
});
$('#_EntRequestButton').on('click',function(e){
    e.preventDefault();
    sendGAEvents("Enterprise Request");
    //_gaq.push(['_trackEvent', "Enterprise Request" , localStorage.getItem('UserId'),PageName]);
    var entRequest = {};
    entRequest.fullName = $('#_EntFullName').val().trim();
    entRequest.contactNo = $('#_EntContactNo').val().trim();
    entRequest.email = $('#_EntEmail').val().trim();
    entRequest.usersNo = $('#_EntUsersNo').val().trim();
    entRequest.companyName = $('#_EntCompanyName').val().trim();
    /*entRequest.cloudLocation = $('#_EntCloudLocation').val().trim();
    entRequest.storage = $('#_EntStorage').val().trim();
    entRequest.branding = $('#_EntBranding').val().trim();*/
    entRequest.message = $('#_EntMessage').val().trim();
    var _a = [];
    if(entRequest.fullName.length == 0){
        _a.push('Full Name');
    }
    if(entRequest.contactNo.length == 0){
        _a.push('Contact Number');
    }
    if(entRequest.email.length == 0){
        _a.push('Email');
    }
    if(entRequest.usersNo.length ==0){
        _a.push('Number of users');
    }
    if(entRequest.companyName.length == 0){
        _a.push('Company Name');
    }
    /*if(entRequest.cloudLocation.length == 0){
        _a.push('Cloud Location');
    }

    if(entRequest.storage.length == 0){
        _a.push('storage');
    }
    if(entRequest.branding.length == 0){
        _a.push('Banding');
    }*/
    if(entRequest.message.length == 0){
        _a.push('message');
    }

    if(_a.length > 1){
        return $(this).closest('form').find('.errorMessage').text('All Fields are required.');
    }else if(_a.length == 1){
        return $(this).closest('form').find('.errorMessage').text('Please enter '+_a[0]+".");
    }
    var entRequestdata = JSON.stringify(entRequest);
    CFManageCloudAccountsAjaxCall.sendEntLeadRequest(entRequestdata);
    $('#admin_contact').modal('hide');
});
/*function eventrun() {
    if (document.hidden == true || document.msHidden == true) {
        clearInterval(timeIntervel);
    }else{
        CFManageCloudAccountsAjaxCall.getAllEvents(1,10);
        CFManageCloudAccountsAjaxCall.getEventCount();
        interVel = 90000;
        runRecursive(interVel);
    }
}
function runRecursive(interVel){
    timeIntervel = setInterval(function(){
        if(interVel == 90000){
            interVel = 180000;
        }
        else if(interVel == 180000){
            interVel = 90000;
        }
        CFManageCloudAccountsAjaxCall.getAllEvents(1,10);
        CFManageCloudAccountsAjaxCall.getEventCount();
    },interVel);
}*/
$('#CF_Upgrade').on('click',function(e){
    e.preventDefault();
    $('#admin_contact').modal('show');
});