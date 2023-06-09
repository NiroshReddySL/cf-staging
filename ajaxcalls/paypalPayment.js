$('#paypalPmntBtn').on('click',function(){
    $('#CFmoveStatus').modal('hide');
    $('#move_main').css("display","none");
    $('#checkoutpng').css("display","");
    $('#headerText').text("Checkout");
    _agile.add_tag('clicked on subscribe button from move limit exceeded popup', {
        success: function (data) {
            console.log("success");
        },
        error: function (data) {
            console.log("error");
        }
    });
    var _a = {
        "amount":null,
        "code":"USD",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    };
    var _b;
    var _chkd=$('#CFmoveStatus input[name=subscription]:checked').val();
    if(_chkd =='AdvncdAnnually')
    {
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',"Pro Yearly Subscription");

        var subtype = localStorage.getItem('CFSubscribtion');
        localStorage.setItem('YearlyAMNT', 349.99);
        localStorage.setItem('CFData', "2400 GB");
        _a.amount = 349.99;
        $("#subscribetypeNew span").text(subtype);
        $("#amntNew").text(_a.amount);
        $("#totalamntNew").text(_a.amount);
        _b="CloudFuze+Advanced+Yearly+Subscription";
        sendGAEvents("Advanced Yearly Subscription Move Limit popup");
        paymentCheck();
        couponCheck();
        //paypalPayments.createPmntAnnualRecurring(_a,_b);
    }
    else if(_chkd =='StndAnnually')
    {
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',"Standard Yearly Subscription");
        var subtype = localStorage.getItem('CFSubscribtion');
        localStorage.setItem('YearlyAMNT', 199.99);
        localStorage.setItem('CFData', "1200 GB");
        _a.amount = 199.99;
        $("#subscribetypeNew span").text(subtype);
        $("#amntNew").text(_a.amount);
        $("#totalamntNew").text(_a.amount);
        _b="CloudFuze+Standard+Yearly+Subscription";
        sendGAEvents("Standard Yearly Subscription Move Limit popup");
        paymentCheck();
        couponCheck();
        //paypalPayments.createPmntAnnualRecurring(_a,_b);
    }
    else if(_chkd =='BasicAnnually')
    {
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',"Individual Lite Monthly Subscription");
        var subtype = localStorage.getItem('CFSubscribtion');
        localStorage.setItem('YearlyAMNT', 99.99);
        localStorage.setItem('CFData', "600 GB");
        _a.amount = 99.99;
        $("#subscribetypeNew span").text(subtype);
        $("#amntNew").text(_a.amount);
        $("#totalamntNew").text(_a.amount);
        _b="CloudFuze+Basic+Yearly+Subscription";
        sendGAEvents("Basic Yearly Subscription Move Limit popup");
        paymentCheck();
        couponCheck();
        //paypalPayments.createPmntAnnualRecurring(_a,_b);
    }
    else if(_chkd =='AdvncdMonthly')
    {
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',"Pro Monthly Subscription");
        var subtype = localStorage.getItem('CFSubscribtion');
        localStorage.setItem('MonthlyAMNT', 34.99);
        localStorage.setItem('CFData', "200 GB");
        _a.amount = 34.99;
        $("#subscribetypeNew span").text(subtype);
        $("#amntNew").text(_a.amount);
        $("#totalamntNew").text(_a.amount);
        _b="CloudFuze+Advanced+Monthly+Subscription";
        sendGAEvents("Advanced Monthly Subscription Move Limit popup");
        paymentCheck();
        couponCheck();
        //paypalPayments.createPmntMonthlyRecurring(_a,_b);
    }
    else if(_chkd =='StndMonthly')
    {
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',"Standard Monthly Subscription");
        var subtype = localStorage.getItem('CFSubscribtion');
        localStorage.setItem('MonthlyAMNT',19.99);
        localStorage.setItem('CFData', "100 GB");
        _a.amount = 19.99;
        $("#subscribetypeNew span").text(subtype);
        $("#amntNew").text(_a.amount);
        $("#totalamntNew").text(_a.amount);
        _b="CloudFuze+Standard+Monthly+Subscription";
        sendGAEvents("Standard Monthly Subscription Move Limit popup");
        paymentCheck();
        couponCheck();
        //paypalPayments.createPmntMonthlyRecurring(_a,_b);
    }
    else
    {
        localStorage.removeItem('CFSubscribtion');
        localStorage.setItem('CFSubscribtion',"Individual Lite Monthly Subscription");
        var subtype = localStorage.getItem('CFSubscribtion');
        localStorage.setItem('MonthlyAMNT', 9.99);
        localStorage.setItem('CFData', "50 GB");
        _a.amount = 9.99;
        $("#subscribetypeNew span").text(subtype);
        $("#amntNew").text(_a.amount);
        $("#totalamntNew").text(_a.amount);
        _b="CloudFuze+Basic+Monthly+Subscription";
        sendGAEvents("Basic Monthly Subscription Move Limit popup");
        paymentCheck();
        couponCheck();
        //paypalPayments.createPmntMonthlyRecurring(_a,_b);
    }
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    couponCheck();
});
var paypalPayments={
    createPmntMonthlyRecurring: function (a,b)
    {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Requesting token from paypal",_time);
        $('#paypalsuccessmodalinit').modal('show').css('display','block');
        createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "L_BILLINGAGREEMENTDESCRIPTION0="+b+"&" +
            "returnUrl=" + pmntsreturnurl + "%3F"+ a.success+"%3Dtrue%26M%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3F"+ a.cancel+"%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0="+b+"&" +
            "L_PAYMENTREQUEST_0_AMT0=" + a.amount + "&" +
            "L_PAYMENTREQUEST_0_QTY0=1&SOLUTIONTYPE=Sole&LANDINGPAGE=Billing";
        $.ajax({
            type: "POST",
            url: createpmntUrl,
            data: createdata,
            async: false,
            dataType: "application/x-www-form-urlencoded",
            success: function (createpmnttoken) {

            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    var pmntresponse = xhr.responseText;
                    //console.log(pmntresponse);
                    var match, pl = /\+/g,
                        search = /([^&=]+)=?([^&]*)/g,
                        decode = function (s) {
                            return decodeURIComponent(s.replace(pl," "));
                        },
                        query = pmntresponse;
                    pmntcreateParams = {};
                    while (match = search.exec(query)){
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    }
                    pmnttoken = pmntcreateParams["TOKEN"];
                    pmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    localStorage.setItem('paypaltstamp', pmnttimestamp);
                    var paypalcreateurl = paymentcreateurl + pmnttoken;
                    if(pmnttoken == undefined || pmnttoken == null){
                        $('#paypalsuccessmodalinit').modal('hide');
                        return showNotyNotification('error','Failed to initiate payment with PayPal.');
                    }
                    window.location.href = paypalcreateurl;
                }
            }
        });
    },
    createPmntAnnualRecurring: function (a,b) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Requesting token from paypal",_time);
        $('#paypalsuccessmodalinit').modal('show').css('display','block');
        createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount+ "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "L_BILLINGAGREEMENTDESCRIPTION0="+b+"&" +
            "returnUrl=" + pmntsreturnurl + "%3F"+ a.success+"%3Dtrue%26Y%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3F"+ a.cancel+"%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0="+b+"&" +
            "L_PAYMENTREQUEST_0_AMT0=" + a.amount + "&" +
            "L_PAYMENTREQUEST_0_QTY0=1";
        //createpmntUrl = "https://devwebapp.cloudfuze.com/pmntrecurring/nvp" ;
        $.ajax({
            type: "POST",
            url: createpmntUrl,
            data: createdata,
            async: false,
            dataType: "application/x-www-form-urlencoded",
            success: function (createpmnttoken) {

            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    var pmntresponse = xhr.responseText;
                    //console.log(pmntresponse);
                    var match, pl = /\+/g,
                        search = /([^&=]+)=?([^&]*)/g,
                        decode = function (s) {
                            return decodeURIComponent(s.replace(pl, " "));
                        },
                        query = pmntresponse;
                    pmntcreateParams = {};
                    while (match = search.exec(query))
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    opmnttoken = pmntcreateParams["TOKEN"];
                    pmnttoken = pmntcreateParams["TOKEN"];
                    pmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    localStorage.setItem('paypaltstamp', pmnttimestamp);
                    var paypalcreateurl = paymentcreateurl + pmnttoken;
                    if(opmnttoken == undefined || opmnttoken == null){
                        $('#paypalsuccessmodalinit').modal('hide');
                        return showNotyNotification('error','Failed to initiate payment with PayPal.');
                    }
                    window.location.href = paypalcreateurl;
                }
                if (xhr.status > 300) {
                    //console.log("Operation Failed");
                }
            },
            error: function (error) {
            }
        });
    },
    cmpleteMnthlyPmntRecurring: function (_c) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Connecting paypal with payment token",_time);
        var _b=localStorage.getItem('CFSubscribtion');
        createdata = "method=CreateRecurringPaymentsProfile&" +
            "AMT=" + _c.amount + "&" +
            "CURRENCYCODE="+_c.country+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "DESC="+_b+"&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "token=" + _c.token + "&" +
            "PAYERID=" + _c.id + "&" +
            "PROFILESTARTDATE=" + _c.time + "&" +
            "BILLINGPERIOD=Month&" +
            "BILLINGFREQUENCY=1&" +
            "MAXFAILEDPAYMENTS=1&" +
            "INITAMT=" + _c.amount + "&" +
            "TRIALTOTALBILLINGCYCLES=1&" +
            "TRIALBILLINGPERIOD=Month&"+
            "TRIALBILLINGFREQUENCY=1";
        $.ajax({
            type: "POST",
            url: createpmntUrl,
            data: createdata,
            async: false,
            dataType: "application/x-www-form-urlencoded",
            success: function (cmpltepmntotime) {

            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    var cmpletepmntresponse = xhr.responseText;
                    var match, pl = /\+/g,
                        search = /([^&=]+)=?([^&]*)/g,
                        decode = function (s) {
                            return decodeURIComponent(s.replace(pl, " "));
                        },
                        query = cmpletepmntresponse;
                    pmntcreateParams = {};
                    while (match = search.exec(query))
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    pmnttoken = pmntcreateParams["TOKEN"];
                    pmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    pmntprofid = pmntcreateParams["PROFILEID"];
                    pmntack = pmntcreateParams["ACK"];
                    $('#transstatus').find('#contclick').attr('instance',_c.instance);
                    if (pmntack == "Success") {
                        $('#transstatus').find('#contclick').attr('status','success');
                        pmntack = "PAID";
                        var intpmntid = CFPaymentsInternal.pmntmonthlyrecurring(pmntack, pmnttimestamp, _c.id, pmntprofid, cmpletepmntresponse);
                        //var subname = "Monthly Recurring";

                        // if(_b == "CloudFuze+Basic+Monthly+Subscripton")
                        //      sendGAEvents("9.99 (Basic Monthly)");
                        //  else if(_b == "CloudFuze+Standard+Monthly+Subscripton")
                        //      sendGAEvents("19.99 (Standard Monthly)");
                        //  else if(_b == "CloudFuze+Advanced+Monthly+Subscripton")
                        //      sendGAEvents("34.99 (Advanced Monthly)");

                        if(_b.indexOf("Lite") >= 0)
                            sendGAEvents("9.99 (Basic Monthly)","Pricing Plans");
                        else if(_b.indexOf("Standard") >= 0)
                            sendGAEvents("19.99 (Standard Monthly)","Pricing Plans");
                        else if(_b.indexOf("Pro") >= 0)
                            sendGAEvents("34.99 (Advanced Monthly)","Pricing Plans");

                        _b=(_b.replace(new RegExp('[+]','g')," ").split('CloudFuze').pop().trim());

                        var subname =_b.replace(/\+/g," ").replace("CloudFuze ","");
                        var status1 = "ACTIVE";
                        var stype = "PAY_MONTHLY";
                        var expdate = getuserexpiry.searchuserexpiry(localStorage.getItem('UserId'));
                        var expdate_expiresIn = expdate[0].expiresIn;
                        var expdate_createdDate = expdate[0].createdDate;
                        var etstamp;
                        if (expdate_expiresIn == null) {
                            etstamp = expdate_createdDate + (30 * 24 * 60 * 60 * 1000);
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }
                        else {
                            //etstamp = expdate_expiresIn;
                            var myDate = new Date();
                            var result = myDate.getTime();
                            etstamp = result + (30 * 24 * 60 * 60 * 1000);
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }

                        if(_c.instance == "orange"){
                            $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                        }
                        else{
                            $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                        }
                    }
                    else if (pmntack == "Failure") {
                        $('#transstatus').find('#contclick').attr('status','failed');
                        pmntack = "PENDING";
                      //  zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Failed");
                        $('#transstatustext').html('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                        $('#transbutton').text('Please try again');
                    }
                }
            }
        });
        return pmntack;

    },
    cmpleteAnnualPmntRecurring: function (_a) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Connecting paypal with payment token",_time);
        var _b=localStorage.getItem('CFSubscribtion');
        createdata = "method=CreateRecurringPaymentsProfile&" +
            "AMT=" + _a.amount + "&" +
            "CURRENCYCODE="+_a.country+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "DESC="+_b+"&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "token=" + _a.token + "&" +
            "PAYERID=" + _a.id + "&" +
            "PROFILESTARTDATE=" + _a.time + "&" +
            "BILLINGPERIOD=Year&" +
            "BILLINGFREQUENCY=1&" +
            "MAXFAILEDPAYMENTS=1&" +
            "INITAMT=" + _a.amount + "&" +
            "TRIALTOTALBILLINGCYCLES=1&" +
            "TRIALBILLINGPERIOD=Year&"+
            "TRIALBILLINGFREQUENCY=1";
        $('#transstatus').find('#contclick').attr('instance',_a.instance);
        $.ajax({
            type: "POST",
            url: createpmntUrl,
            data: createdata,
            async: false,
            dataType: "application/x-www-form-urlencoded",
            success: function (cmpltepmntotime) {

            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    $('#transstatus').find('#contclick').attr('status','success');
                    var cmpletepmntresponse = xhr.responseText;
                    //console.log(cmpletepmntresponse);
                    var match, pl = /\+/g,
                        search = /([^&=]+)=?([^&]*)/g,
                        decode = function (s) {
                            return decodeURIComponent(s.replace(pl, " "));
                        },
                        query = cmpletepmntresponse;
                    pmntcreateParams = {};
                    while (match = search.exec(query))
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    pmnttoken = pmntcreateParams["TOKEN"];
                    pmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    pmntprofid = pmntcreateParams["PROFILEID"];
                    pmntack = pmntcreateParams["ACK"];
                    if (pmntack == "Success") {
                        pmntack = "PAID";
                        if ($('#subsname').text() == "Monthly Recurring") {
                            if (lastpmntresponse.recurringId && lastpmntresponse.referenceId == "") {
                                var status4 = CFPaymentsPaypal.cnclRecurringSubscription(lastpmntresponse.recurringId);
                                //console.log("createannualpmnt");
                                //console.log(status4);id
                                if (status4 == "Success") {
                                    CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
                                }
                            }
                        }
                        var intpmntid = CFPaymentsInternal.pmntannualrecurring(pmntack, pmnttimestamp, _a.id, pmntprofid, cmpletepmntresponse);
                        //var subname = "Yearly Recurring";
                        // if(_b == "CloudFuze+Basic+Yearly+Subscripton")
                        //     sendGAEvents("99.99 (Basic Yearly)");
                        // else if(_b == "CloudFuze+Standard+Yearly+Subscripton")
                        //     sendGAEvents("199.99 (Standard Yearly)");
                        // else if(_b == "CloudFuze+Advanced+Yearly+Subscripton")
                        //     sendGAEvents("349.99 (Advanced Yearly)");

                        if(_b.indexOf("Lite") >= 0)
                            sendGAEvents("99.99 (Basic Yearly)","Pricing Plans");
                        else if(_b.indexOf("Standard") >= 0)
                            sendGAEvents("199.99 (Standard Yearly)","Pricing Plans");
                        else if(_b.indexOf("Pro") >= 0)
                            sendGAEvents("349.99 (Advanced Yearly)","Pricing Plans");

                        var subname = _b.replace(/\+/g," ").replace("CloudFuze ","");

                        var status1 = "ACTIVE";
                        var stype = "PAY_YEARLY";
                        var expdate = getuserexpiry.searchuserexpiry(localStorage.getItem('UserId'));
                        var expdate_expiresIn = expdate[0].expiresIn;
                        var expdate_createdDate = expdate[0].createdDate;
                        var etstamp;
                        if (expdate_expiresIn == null) {
                            etstamp = expdate_createdDate + (365 * 24 * 60 * 60 * 1000);
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        } else {
                            var myDate = new Date();
                            var result = myDate.getTime();
                            etstamp = result + (365 * 24 * 60 * 60 * 1000);
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }
                        $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                    }
                    else if (pmntack == "Failure") {
                        pmntack = "PENDING";
                     //   zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Failed");
                        $('#transstatus').find('#contclick').attr('status', 'failed');
                        $('#transstatustext').html('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                        $('#transbutton').text('Please try again');
                    }
                }
            }
        });
        return pmntack;
    },
}

$('#couponcode').keydown(function(e){
    // $(document).find(".cardTr #UserEntEmail").keypress(function(e) {
    //$(document).on('keypress','#UserEntEmail',function (e) {
    //var customerEmail = $("#UserEntName").val();
    if (e.which === 8 || e.keyCode === 8) {
        //  e.preventDefault();



        $("#couponemessage").css("display","none");

    }

});

$('#basicannualsubscribe').on('click',function(){
    var _a = {
        "amount":"$99.99",
        "code":"USD",
        "data":"600 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
    $("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    $("#applycouponNew").text('Apply Coupon');
    localStorage.setItem('YearlyAMNT', 99.99);
    _b="Individual Lite Yearly Subscription";
    sendGAEvents("Lite Yearly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    //paymentCheck();
    $('#applycouponNew').addClass('blue');
    $('#applycouponNew').css('color','white');
    // $('#applycouponNew').on('click', enableCoupon);
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

    // window.location.href = "checkout.html";
    //paypalPayments.createPmntAnnualRecurring(_a,_b);
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionStatus !== 'INACTIVE'){
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');
    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
});
$('#stndannualsubscribe').on('click',function(){
    var _a = {
        "amount":"$199.99",
        "code":"USD",
        "data":"1200 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
    $("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    $("#applycouponNew").text('Apply Coupon');
    localStorage.setItem('YearlyAMNT', 199.99);
    _b="Standard Yearly Subscription";
    sendGAEvents("Standard Yearly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    //paymentCheck();
    $('#applycouponNew').addClass('blue');
    $('#applycouponNew').css('color','white');
    // $('#applycouponNew').on('click', enableCoupon);
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
    //window.location.href = "checkout.html";
    //paypalPayments.createPmntAnnualRecurring(_a,_b);
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionStatus !== 'INACTIVE'){
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');

    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
});
$('#advncdannualsubscribe').on('click',function(){
    var _a = {
        "amount":"$349.99",
        "code":"USD",
        "data":"2400 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
    $("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    $("#applycouponNew").text('Apply Coupon');
    localStorage.setItem('YearlyAMNT', 349.99);
    _b="Pro Yearly Subscription";
    sendGAEvents("Advanced Yearly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    //paymentCheck();
    $('#applycouponNew').addClass('blue');
    $('#applycouponNew').css('color','white');
    //$('#applycouponNew').on('click', enableCoupon);
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
    // window.location.href = "checkout.html";
    //paypalPayments.createPmntAnnualRecurring(_a,_b);
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionStatus !== 'INACTIVE'){
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');

    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }

});
$('#basicmonthlysubscribe').on('click',function(){
    var _a = {
        "amount":"$9.99",
        "code":"USD",
        "data":"50 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
    $("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    $("#applycouponNew").text('Apply Coupon');
    localStorage.setItem('MonthlyAMNT', 9.99);
    _b="Individual Lite Monthly Subscription";
    sendGAEvents("Lite Monthly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    //paymentCheck();
    $('#applycouponNew').addClass('blue');
    $('#applycouponNew').css('color','white');
    //$('#applycouponNew').on('click', enableCoupon);
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
    // window.location.href = "checkout.html";
    //paypalPayments.createPmntMonthlyRecurring(_a,_b);
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionStatus !== 'INACTIVE'){
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');

    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
});
$('#stndmonthlysubscribe').on('click',function(){
    var _a = {
        "amount":"$19.99",
        "code":"USD",
        "data":"100 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
    $("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    $("#applycouponNew").text('Apply Coupon');
    localStorage.setItem('MonthlyAMNT', 19.99);
    _b="Standard Monthly Subscription";
    sendGAEvents("Standard Monthly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    //paymentCheck();
    $('#applycouponNew').addClass('blue');
    $('#applycouponNew').css('color','white');
    //$('#applycouponNew').on('click', enableCoupon);
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
    // window.location.href = "checkout.html";
    //paypalPayments.createPmntMonthlyRecurring(_a,_b);
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionStatus !== 'INACTIVE'){
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');
    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }
});
$('#advncdmonthlysubscribe').on('click',function(){
    var _a = {
        "amount":"$34.99",
        "code":"USD",
        "data":"200 GB",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    }, _b;
    $("#move_main").css("display","none");
    $("#checkoutpng").css("display","");
    $("#applycouponNew").text('Apply Coupon');
    localStorage.setItem('MonthlyAMNT', 34.99);
    _b="Pro Monthly Subscription";
    sendGAEvents("Advanced Monthly Subscription upgrade button");
    localStorage.setItem('CFSubscribtion',_b);
    localStorage.setItem('CFPrice',_a.amount);
    localStorage.setItem('CFData',_a.data);
    //paymentCheck();
    $('#applycouponNew').addClass('blue');
    $('#applycouponNew').css('color','white');
    //$('#applycouponNew').on('click', enableCoupon);
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
    //paypalPayments.createPmntMonthlyRecurring(_a,_b);
    couponCheck();
    var subscriptionName = $('#subsname').text();
    if(lastsubsresponse !== undefined)
        var subscriptionStatus = lastsubsresponse.subscriptionStatus;
    else
        var subscriptionStatus = 'Active';
    if(subscriptionName !== 'Free Trial' && subscriptionStatus !== 'INACTIVE'){
        $('#cnclOtherSubscribemodal').modal('show').css('display','block');

    }
    else if(subscriptionName == ''){
        return false;
    }

    else{
        window.location.href = 'checkout.html';
    }

});

$('#cnclPrevSubscribeyes').on('click', function() {
    var subscriptionName = $('#subsname').text();
    $('#cnclOtherSubscribemodal').modal('hide');
    if(subscriptionName !== 'Free Trial'){
        $('.cnclOthersubscribeyes').trigger('click');

    }

});



$('#cnclbasicmonthlysubscribe').on('click', function() {
    $('#cnclmonthlysubscribemodal').modal('show').css('display','block');
});
$('#cnclstndmonthlysubscribe').on('click', function() {
    $('#cnclmonthlysubscribemodal').modal('show').css('display','block');

});
$('#cncladvncdmonthlysubscribe').on('click', function() {
    $('#cnclmonthlysubscribemodal').modal('show').css('display','block');
});

$('#cnclbasicannualsubscribe').on('click', function(){
    $('#cnclannualsubscribemodal').modal('show').css('display','block');

});
$('#cnclstndannualsubscribe').on('click', function(){
    $('#cnclannualsubscribemodal').modal('show').css('display','block');
});
$('#cncladvncdannualsubscribe').on('click', function(){
    $('#cnclannualsubscribemodal').modal('show').css('display','block');

});
$('#checkoutbuttonNew').on('click', function() {
    var _amntNew = $("#amntNew").text();
    var _discountNew = $("#discountNew").text();
    var _totalamntNew = $("#totalamntNew").text();
    localStorage.setItem("DisplayAmt",_amntNew);
    localStorage.setItem("disctAmt",_discountNew);
    localStorage.setItem("tolAmt",_totalamntNew);

    if(location.pathname.substring(location.pathname.lastIndexOf("/") + 1) == "move.html"){
        localStorage.setItem("sourcePayment","movePopup");
        localStorage.setItem("popupSourcecld",$("#moveSource #getClouds").attr("cid"));
        localStorage.setItem("popupDestcld",$("#moveDestination #getClouds").attr("cid"));
        localStorage.setItem("popupSrcHeader", $("#move_main .span6:nth-child(1) .tab-header").html());
        localStorage.setItem("popupDestHeader",$("#move_main .span6:nth-child(2) .tab-header").html());
    }
    sendGAEvents("proceed to checkout");
    $("#calcpricemodalNew").modal('hide');
    var _a = {
        "amount":localStorage.getItem('CFPrice'),
        "code":"USD",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    };
    var _b=localStorage.getItem('CFSubscribtion');
    if (_b.indexOf("Yearly") >= 0)
        paypalPayments.createPmntAnnualRecurring(_a,_b);
    else
        paypalPayments.createPmntMonthlyRecurring(_a,_b);
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
$('#applycouponNew').on('click',function() {
    sendGAEvents('clicked on apply coupon');
    if ($("#applycouponNew").text() === 'Remove Coupon') {

        $("#applycouponNew").text('Apply Coupon');
        $('#couponcode').val('');
        $("#couponsmessage").css("display", "none");
        $("#couponsmessage1").css("display", "none");
        $("#couponemessage").css("display", "none");
        $("#discountNew").text("0");
        var _p = $('#subscribetypeNew span').text();//localStorage.getItem('CFSubscribtion');
        if (_p == "Individual Lite Monthly Subscription") {
            $("#totalamntNew").text("$9.99");
        }
        if (_p == "Individual Lite Yearly Subscription") {
            $("#totalamntNew").text("$99.99");
        }
        if (_p == "Standard Monthly Subscription") {
            $("#totalamntNew").text("$19.99");
        }
        if (_p == "Standard Yearly Subscription") {
            $("#totalamntNew").text("$199.99");
        }
        if (_p == "Pro Monthly Subscription") {

            $("#totalamntNew").text("$34.99");
        }
        if (_p == "Pro Yearly Subscription") {
            $("#totalamntNew").text("$349.99");
        }
		if (_p == "Enterprise 1 TB & 20 Users Monthly Plan") {
            $("#totalamntNew").text("$999");
        }
		if (_p == "Enterprise 2 TB & 40 Users Monthly Plan") {
            $("#totalamntNew").text("$999");
        }
		if (_p == "Enterprise 3 TB & 60 Users Monthly Plan") {
            $("#totalamntNew").text("$999");
        }
		if (_p == "Enterprise 4 TB & 80 Users Monthly Plan") {
            $("#totalamntNew").text("$999");
        }
		if (_p == "Enterprise 5 TB & 100 Users Monthly Plan") {
            $("#totalamntNew").text("$999");
        }
		if (_p == "Enterprise 1 TB & 20 Users Yearly Plan") {
            $("#totalamntNew").text("$850");
        }
		if (_p == "Enterprise 2 TB & 40 Users Yearly Plan") {
            $("#totalamntNew").text("$1700");
        }
		if (_p == "Enterprise 3 TB & 60 Users Yearly Plan") {
            $("#totalamntNew").text("$2550");
        }
		if (_p == "Enterprise 4 TB & 80 Users Yearly Plan") {
            $("#totalamntNew").text("$3400");
        }
		if (_p == "Enterprise 5 TB & 100 Users Yearly Plan") {
            $("#totalamntNew").text("$4250");
        }


        /*$("#discountNew").text(localStorage.getItem('disctAmt'));
        $("#totalamntNew").text(localStorage.getItem('DisplayAmt'));*/

        return false;
    }
    var CouponVal = $("#couponcode").val();
    if ( CouponVal == "" && $("#applycouponNew").text() == "Apply Coupon") {
        $('#couponemessage').text('Please enter coupon code');
        $("#couponemessage").css({"display": "block"});
        $('#couponsmessage').text('');
        $("#couponcode").focus();
        return false;

    }
    else
    {
        CouponApiCall(CouponVal);
    }
});
function CouponApiCall(CouponVal) {

    $.ajax({
        type: 'GET',
        url: apicallurl + '/stripe/coupon?couponName='+CouponVal,
        "async": true,
        "crossDomain": true,


        headers: {
            "Authorization": localStorage.getItem('UserAuthDetails'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        success: function (data) {
            console.log(data);
            var coupon_Id = data.couponId;
            var return_coupon = data.couponName;
            var dedectDiscount = data.percentage;
            var parsededectDiscount = parseFloat(dedectDiscount)/100;
            var couponval = $("#couponcode").val();
            localStorage.setItem("AppliedCounpon","couponval");
            $('#couponemessage').text('');

            var _parent = $('#calcpricemodalNew'), _price;
            if ($("#couponcode").val() == return_coupon) {
                var price;

                if(localStorage.getItem("CFSubscribtion") == "Individual Lite Monthly Subscription"){
                    price=9.99;
                }
                if(localStorage.getItem("CFSubscribtion") == "Individual Lite Yearly Subscription"){
                    price=99.99;
                }
                if(localStorage.getItem("CFSubscribtion") == "Standard Monthly Subscription"){
                    price=19.99;
                }
                if(localStorage.getItem("CFSubscribtion") == "Standard Yearly Subscription"){
                    price=199.99;
                }
                if(localStorage.getItem("CFSubscribtion") == "Pro Monthly Subscription"){
                    price=34.99;
                }
                if(localStorage.getItem("CFSubscribtion") == "Pro Yearly Subscription"){
                    price=349.99;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 1 TB & 20 Users Monthly Plan"){
                    price=999;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 2 TB & 40 Users Monthly Plan"){
                    price=1999;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 3 TB & 60 Users Monthly Plan"){
                    price=2999;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 4 TB & 80 Users Monthly Plan"){
                    price=3999;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 5 TB & 100 Users Monthly Plan"){
                    price=4999;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 1 TB & 20 Users Yearly Plan"){
                    price=850;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 2 TB & 40 Users Yearly Plan"){
                    price=1700;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 3 TB & 60 Users Yearly Plan"){
                    price=2550;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 4 TB & 80 Users Yearly Plan"){
                    price=3400;
                }
				if(localStorage.getItem("CFSubscribtion") == "Enterprise 5 TB & 100 Users Yearly Plan"){
                    price=4250;
                }
                if(localStorage.getItem("CFSubscribtion") == undefined){
                    price=199.99;
                }


                var  _price=(price*parsededectDiscount);
                /* $(_parent).find('#discountNew').text(price-_price);
                 $(_parent).find('#totalamntNew').text(_price);*/
                $('#discountNew').text("$"+(_price).toFixed());
                $('#totalamntNew').text("$"+(price-_price).toFixed(2));
                var _amntNew = $("#amntNew").text();
                var _discountNew = $("#discountNew").text();
                var _totalamntNew = $("#totalamntNew").text();
                localStorage.setItem("DisplayAmt",_amntNew);
                localStorage.setItem("disctAmt",_discountNew);
                localStorage.setItem("tolAmt",_totalamntNew);
                // localStorage.setItem('CFPrice',_price)
                //if (localStorage.getItem('YearlyAMNT') != null)
                //  localStorage.setItem('YearlyAMNT',_price);
                // else if (localStorage.getItem('MonthlyAMNT') != null)
                //  localStorage.setItem('MonthlyAMNT', _price);
                $("#couponsmessage").css("display", "");
                $('#couponsmessage').text('Your Coupon has been Applied Successfully');
                //$("#applycouponNew").off( "click" ).removeClass("blue");
                $("#applycouponNew").text('Remove Coupon');
                localStorage.setItem("coupon_Id",coupon_Id);
                return false;



            } else if ($("#couponcode").val() == "" && $("#applycouponNew").text() == "Apply Coupon") {
                $('#couponemessage').text('Please enter coupon code');
                $("#couponemessage").css({"display": "block"});
                $('#couponsmessage').text('');
                return false;
            }  else {
                $('#couponemessage').text('Invalid coupon code');
                $("#couponcode").focus();
                $("#couponemessage").css({"display": "block"});
                $('#couponsmessage').text('');
                return false;
            }
        },
        complete: function (xhr, statusText) {
            if (xhr.status == 404) {
                $('#couponemessage').text('Invalid coupon code');
                $("#couponemessage").css({"display": "block"});
                $("#couponcode").focus();
                $('#couponsmessage').text('');
                return false;
            }
        }
    });
}

function loadMoveSource(){
    moveCheckSum = 'source';
    $("#move_main .span6:nth-child(1) .tab-header").html(localStorage.getItem("popupSrcHeader"));
    CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(localStorage.getItem("popupSourcecld"), 1);
}
function loadMoveDestination(){
    moveCheckSum = 'dest';
    $("#move_main .span6:nth-child(2) .tab-header").html(localStorage.getItem("popupDestHeader"));
    if(localStorage.getItem("popupDestcld") != "undefined")
        CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(localStorage.getItem("popupDestcld"), 1);
}