$("input[name=toggleBtn]").change(function(){
	$(".slider").addClass('trans');
	//activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'paymentToggle','Yes');
	if(this.checked == true){
			$("#payMonthly").removeClass('active');
		$("#payYearly").addClass('active');
	
		
		$("#tab-1").find(".plan-price:eq(0)").text('$99.99');
		$("#tab-1").find(".plan-price:eq(1)").text('$349.99');
		$("#tab-1").find(".plan-data:eq(0)").text('600 GB/Year');
		$("#tab-1").find(".plan-data:eq(1)").text('2400 GB/Year');
		$("#payMonthly").css('opacity','0.5');
		$("#payYearly").css('opacity','1');

	}
	else{
			$("#payYearly").removeClass('active');
		$("#payMonthly").addClass('active');
	
		$("#tab-1").find(".plan-price:eq(0)").text('$9.99');
		$("#tab-1").find(".plan-price:eq(1)").text('$34.99');
		$("#tab-1").find(".plan-data:eq(0)").text('50 GB/Month');
		$("#tab-1").find(".plan-data:eq(1)").text('200 GB/Month');
		$("#payYearly").css('opacity','0.5');
		$("#payMonthly").css('opacity','1');

	}
});

$(document).find("#lite").click(function(){
	/*activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'clickedOnSubscribe','Yes');
		if(window.location.pathname == "/pages/backUp.html"){
		var _price = "Backup Page";	
	}
	else if(window.location.pathname == "/pages/move.html"){
		var _price = "Migrate Page";	
	}
	else{
		var _price = "Pricing Page";
	}
	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'clickedOnSubscribeFrom',_price); */
	if($(this).siblings('.plan-price').text() == "$99.99"){
	  var _a = {
        "amount":"$99.99",
        "code":"USD",
        "data":"600 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
	$("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    localStorage.setItem('YearlyAMNT', 99.99);
    _b="Individual Lite Yearly Subscription";
    sendGAEvents("Lite Yearly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    $('#couponcode').val('');
    $("#subscribetypeNew span").text(_b);
    $("#amntsize").text(_a.data);
    $("#amntNew").text(_a.amount);
    $("#totalamntNew").text(_a.amount);
    $('#discountNew').text('0');
    $('#couponsmessage').css('display','none');
    $('#couponsmessage1').css('display','none');
    $('#couponemessage').css('display','none');
	if($(this).parents('div').hasClass('planPopUp')){
        $('.planPopUp ').modal('hide');
    }
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
	
    if(subscriptionName !== 'Free Trial' && subscriptionName !== 'Enterprise Paid' && subscriptionStatus !== 'INACTIVE'){
		if($(this).text() == "Cancel Subscription"){
	 $('#cnclannualsubscribemodal').modal('show').css('display','block');
	}
	else{
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');
	}
    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
	}
	else{
		 var _a = {
        "amount":"$9.99",
        "code":"USD",
        "data":"50 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
	$("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
	$("#backToDiv").css("display","");
    localStorage.setItem('MonthlyAMNT', 9.99);
    _b="Individual Lite Monthly Subscription";
    sendGAEvents("Lite Monthly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    $('#couponcode').val('');
    $("#subscribetypeNew span").text(_b);
    $("#amntsize").text(_a.data);
    $("#DataYearRmonth").text("Data per month");
    $("#amntNew").text(_a.amount);
    $("#totalamntNew").text(_a.amount);
    $('#discountNew').text('0');
    $('#couponsmessage').css('display','none');
    $('#couponsmessage1').css('display','none');
    $('#couponemessage').css('display','none');
	if($(this).parents('div').hasClass('planPopUp')){
        $('.planPopUp ').modal('hide');
    }
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionName !== 'Enterprise Paid' && subscriptionStatus !== 'INACTIVE'){
       if($(this).text() == "Cancel Subscription"){
	 $('#cnclmonthlysubscribemodal').modal('show').css('display','block');
	}
	else{
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');
	}
    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
	}
});

$("#pro").click(function(){
	/*activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'clickedOnSubscribe','Yes');
	if(window.location.pathname == "/pages/backUp.html"){
		var _price = "Backup Page";	
	}
	else if(window.location.pathname == "/pages/move.html"){
		var _price = "Migrate Page";	
	}
	else{
		var _price = "Pricing Page";
	}
	activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'clickedOnSubscribeFrom',_price);*/
	if($(this).siblings('.plan-price').text() == "$349.99"){
	  var _a = {
        "amount":"$349.99",
        "code":"USD",
        "data":"2400 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
	$("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
	$("#backToDiv").css("display","");
    localStorage.setItem('YearlyAMNT', 349.99);
    _b="Pro Yearly Subscription";
    sendGAEvents("Advanced Yearly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    $('#couponcode').val('');
    $("#subscribetypeNew span").text(_b);
    $("#amntsize").text(_a.data);
    $("#DataYearRmonth").text("Data per year");
    $("#amntNew").text(_a.amount);
    $("#totalamntNew").text(_a.amount);
    $('#discountNew').text('0');

    $('#discountNew').text('0');
    $('#couponsmessage').css('display','none');
    $('#couponsmessage1').css('display','none');
    $('#couponemessage').css('display','none');

    if($(this).parents('div').hasClass('planPopUp')){
        $('.planPopUp ').modal('hide');
    } 
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionName !== 'Enterprise Paid' && subscriptionStatus !== 'INACTIVE'){
      if($(this).text() == "Cancel Subscription"){
	 $('#cnclannualsubscribemodal').modal('show').css('display','block');
	}
	else{
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');
	}
    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
	}
	else{
		 var _a = {
        "amount":"$34.99",
        "code":"USD",
        "data":"200 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
	$("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
	$("#backToDiv").css("display","");
    localStorage.setItem('MonthlyAMNT', 34.99);
    _b="Pro Monthly Subscription";
    sendGAEvents("Advanced Monthly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    $('#couponcode').val('');
    $("#subscribetypeNew span").text(_b);
    $("#amntsize").text(_a.data);
    $("#DataYearRmonth").text("Data per month");
    $("#amntNew").text(_a.amount);
    $("#totalamntNew").text(_a.amount);
    $('#discountNew').text('0');

    $('#discountNew').text('0');
    $('#couponsmessage').css('display','none');
    $('#couponsmessage1').css('display','none');
    $('#couponemessage').css('display','none');
    if($(this).parents('div').hasClass('planPopUp')){
        $('.planPopUp ').modal('hide');
    }
    couponCheck();
    var subscriptionName = $('#subsname').text(); 
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionName !== 'Enterprise Paid' && subscriptionStatus !== 'INACTIVE'){
       if($(this).text() == "Cancel Subscription"){ 
	 $('#cnclmonthlysubscribemodal').modal('show').css('display','block'); 
	}
	else{
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');
	}
    } 
    else if(subscriptionName == ''){ 
        return false;  
    }

    else{
        window.location.href = 'checkout.html';
    }

	}
});
 $('#backtoDiv').on('click',function(){
        $("#checkoutpng").css("display","none");
        $("#move_main").css("display","");

    });

function couponCheck() {
    var _s=localStorage.getItem('CFSubscribtion'),_p=localStorage.getItem('CFPrice'),_parent=$('#calcpricemodalNew');
    _s=_s.replace(/\+/g," ").replace("CloudFuze ","");
    if(_s == "Basic Monthly Subscription"){
        _s ='Individual Lite Monthly Subscription';
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',_s);
    }
    if(_s == "Basic Yearly Subscription"){
        _s ='Individual Lite Yearly Subscription';
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',_s);
    }
    if(_s == "Standard Yearly Subscription"){
        _s ='Standard Yearly Subscription';
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',_s);
    }
    if(_s == "Standard Monthly Subscription"){
        _s ='Standard Monthly Subscription';
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',_s);
    }
    if(_s == "Advanced Yearly Subscription"){
        _s ='Pro Yearly Subscription';
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',_s);
    }
    if(_s == "Advanced Monthly Subscription"){
        _s ='Pro Monthly Subscription';
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',_s);
    }
    $(_parent).find('#subscribetypeNew').text(_s);
    $(_parent).find('#amntNew').text(_p);
    $(_parent).find('#discountNew').text(0);
    $(_parent).find('#totalamntNew').text(_p);
    $('#applycouponNew').addClass('blue');
    $('#couponcode').val('');
    //  $("#calcpricemodalNew").modal('show');
    return false;
} 

