/**
 * Created by VINAY on 09-06-2017.
 */



$("#mulUsrPayments .pricing-table-signup-pro a").click(function(){
    $("#mulUsrPayments .pro").removeClass("planActive");
    $(this).parents(".pro").addClass("planActive");
    var _price = parseFloat($('.planActive h4').text().replace(/[^0-9\.]/g, '')), //.replace("$",""));
        _plan = $('.planActive h4').text().split("$")[0];
    $("#mgrtnPlan").text(_plan);
    $("#mgrtnAccPrice").text("$" + _price);
    $("#mgrtnPriceTotal").text("$" + _price); 
    $("#mgrtnPriceDiscount").text("$0.00");
    multiUsrPayment.enableCouponMulUsr();
});

$("#aplyCpn").click(function(){
    var _code = $("#cpnVal").val();
    var _accprice = parseFloat($('.planActive h4').text().replace(/[^0-9\.]/g, ''));
    switch(_code){

        case "CF20" : $("#mgrtnPriceTotal").text("$" + (_accprice * 0.8).toFixed(2));
                      $("#mgrtnPriceDiscount").text("$" + (_accprice * 0.2).toFixed(2));
                      $("#cpnAplyMsg").text("Coupon applied successfully").css("color","black");
                      multiUsrPayment.disableCouponMulUsr();
                      break;
        default : $("#mgrtnPriceTotal").text("$" + _accprice.toFixed(2));
                  $("#mgrtnPriceDiscount").text("$0.00");
                  $("#cpnAplyMsg").text("Invalid coupon").css("color","red");
                  break;
    }
});

$("#mulUsrPay").click(function(){
    var mulUsrPricing = {
                           'price': $("#mgrtnPriceTotal").text().replace(/[^0-9\.]/g, ''),
                           'plan': $("#mgrtnPlan").text(),
                         };
    localStorage.setItem('CFMulUserPrice',JSON.stringify(mulUsrPricing));
    multiUsrPayment.createPayment();
});

var multiUsrPayment ={

    enableCouponMulUsr : function(){
        $("#cpnAplyMsg").text("");
        $("#aplyCpn").removeClass("disabled");
        $("#cpnVal").removeAttr("disabled");
        $("#cpnVal").val("");
    },

    disableCouponMulUsr : function(){
        $("#aplyCpn").addClass("disabled");
        $("#cpnVal").attr("disabled", "disabled");
    },

    createPayment: function () {
            $('#paypalsuccessmodalinit').modal('show');
            var  CFPrice = JSON.parse(localStorage.getItem('CFMulUserPrice')),
            createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + CFPrice.price + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE=USD&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "returnUrl=" + pmntsreturnurl + "%3Fpaypalsuccess%3Dtrue%26U%3Dtrue%26O%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3Fpaypalcancel%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0=" + CFPrice.plan + "&" +
            "L_PAYMENTREQUEST_0_AMT0=" + CFPrice.price + "&" +
            "L_PAYMENTREQUEST_0_QTY0=1";
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
                    var match, pl = /\+/g,
                        search = /([^&=]+)=?([^&]*)/g,
                        decode = function (s) {
                            return decodeURIComponent(s.replace(pl, " "));
                        },
                        query = pmntresponse;
                    pmntcreateParams = {};
                    while (match = search.exec(query)){
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    }
                    opmnttoken = pmntcreateParams["TOKEN"];
                    pmnttoken = pmntcreateParams["TOKEN"];
                    opmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    localStorage.setItem('paypaltstamp', opmnttimestamp);
                    var paypalcreateurl = paymentcreateurl + opmnttoken;
                    if(opmnttoken == undefined || opmnttoken == null){
                        return showNotyNotification('error','Failed to initiate payment with PayPal.');
                    }
                    window.location.href = paypalcreateurl;
                }
            }
        });
    },

    completePayment : function (tokid, pyrid) {
        var  CFPrice = JSON.parse(localStorage.getItem('CFMulUserPrice')),
        createdata = "method=DoExpressCheckoutPayment&" +
            "PAYMENTREQUEST_0_AMT=" + CFPrice.price + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE=USD&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "TOKEN=" + tokid + "&" +
            "PAYERID=" + pyrid;
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
                    cmpletepmntresponse = xhr.responseText;
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
                    pmntack = pmntcreateParams["ACK"];
                    pmnttid = pmntcreateParams["PAYMENTINFO_0_TRANSACTIONID"];
                    pmntstatus = pmntcreateParams["PAYMENTINFO_0_PAYMENTSTATUS"];
                    if (pmntack == "Success") {
                        pmntack = "PAID";
                        var intpmntid = CFPaymentsInternal.pmntannualonetime(pmnttid, pmntack, pmnttimestamp, pyrid, cmpletepmntresponse);
                        var subname = CFPrice.plan;//"Multi-user Payment ";
                        var status1 = "MULTIUSER_ACTIVE";
                        var stype = "PAY_ONETIME";
                        var myDate = new Date();
                        var etstamp = myDate.getTime() + (365 * 24 * 60 * 60 * 1000);
                        CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                    }
                    else if (pmntack == "Failure") {
                        pmntack = "PENDING";
                        $('#transstatustext').text('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                    }
                }
            }
        });
        return pmntack;
    },
}


function getSubscriptionName(){
    getuserexpiry.getSubscriptionExpiry();
    $('#myaccount_details').hide();
    $('#salesCF').hide();
    $('#pmntinfo').hide();
    $('#mulUsrPayments').show();
    $('#infotitle').text("Multi-User Payment Pricing");
    var subName,_paidPlans = [];
    $.ajax({
        type: "GET",
        url: apicallurl + "/subscription/multiuser/get/" + localStorage.getItem("UserId"),
        async: false,
        dataType: "application/json",
        headers: {
            "Content-Type": "application/json",
            "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (data) {
        },

        complete: function (xhr, statusText) {
            if (xhr.status == 200) {
                subName = xhr.responseText;
                subName = jQuery.parseJSON(subName);
            }
            if (xhr.status > 300) {
            }
        }
    });
    $.each(subName,function(i,c){
        if(c.subscriptionStatus == "MULTIUSER_ACTIVE"){
            _paidPlans.push(c.subscriptionName);
            $("#mulUsrPay").addClass("disabled");
        }
    });

    $.each(_paidPlans,function(i,subscription){
        if(subscription.toLowerCase() == "basic")
            $("#mulUsrPayments .pricing-table-signup-pro .basic").text("PAID").addClass("disabled");
        else if(subscription.toLowerCase() == "Standard")
            $("#mulUsrPayments .pricing-table-signup-pro .standarad").text("PAID").addClass("disabled");
        else if(subscription.toLowerCase() == "advanced")
            $("#mulUsrPayments .pricing-table-signup-pro .advanced").text("PAID").addClass("disabled");
    });
}
