/**
 * Payment calls for paypal api
 *
 */
var MonthlyAMT = 4.99;
var YearlyAMT = 49.99;
var pmntscope ;
var pmntaccess_token;
var pmnttokentype ;
var pmntapp_id;
var pmnttoken;
var opmnttoken;
var pmnttimestamp;
var opmnttimestamp;
var pmntcreateParams;
var createdata;
var pmntprofid;

function paypal_make_basic (user, pass) {
    var tok = user + ':' + pass;
    var hash = Base64.encode(tok);
    return "Basic " + hash;
}

var grantpmnttoken = 'grant_type=client_credentials';

var CFPaymentsPaypal = {

    getpmntToken: function () {
        var pmntUrl = paymenturl + "/oauth2/token";
        $.ajax({
            type: "POST",
            url: pmntUrl,
            data: grantpmnttoken,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": paypal_make_basic(Paypal_clientid, Paypal_clientsecret),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (pmntTokenInfo) {
                pmntscope = pmntTokenInfo.scope;
                pmntaccess_token = pmntTokenInfo.access_token;
                pmnttokentype = pmntTokenInfo.token_type;
                pmntapp_id = pmntTokenInfo.app_id;
            }
        });
    },

    createPmntMnthlyOneTime: function (a) {
        createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "returnUrl=" + pmntsreturnurl + "%3F"+ a.success+"%3Dtrue%26M%3Dtrue%26O%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3F"+ a.cancel+"%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0=CloudFuze+Monthly+Subscription&" +
            "L_PAYMENTREQUEST_0_AMT0=" + a.amount + "&" +
            "L_PAYMENTREQUEST_0_QTY0=1&SOLUTIONTYPE=Sole";
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
                    localStorage.setItem('paypaltstamp', pmnttimestamp);
                    var paypalcreateurl = paymentcreateurl + opmnttoken;

                    if(opmnttoken == undefined || opmnttoken == null){
                        return alertError('Failed to initiate payment with PayPal.');
                    }

                    window.location.href = paypalcreateurl;
                }
                if (xhr.status > 300) {
                }
            }
        });
    },

    createPmntMnthlyRecurring: function (a) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Requesting token from paypal",_time);
        $('#paypalsuccessmodalinit').modal('show').css('display','block');
        createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "L_BILLINGAGREEMENTDESCRIPTION0=CloudFuze+Monthly+Subscripton&" +
            "returnUrl=" + pmntsreturnurl + "%3F"+ a.success+"%3Dtrue%26M%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3F"+ a.cancel+"%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0=CloudFuze+Monthly+Subscription&" +
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
                        sendGAEvents("Token Error from paypal",_time);
                        $('#paypalsuccessmodalinit').modal('hide');
                        return alertError('Failed to initiate payment with PayPal.');
                    }
                    sendGAEvents("Redirecting user to paypal",_time);
                    window.location.href = paypalcreateurl;
                }
            }
        });
    },

    createPmntAnnualOneTime: function (a) {
        createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "returnUrl=" + pmntsreturnurl + "%3F"+ a.success+"%3Dtrue%26Y%3Dtrue%26O%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3F"+ a.cancel+"%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0=CloudFuze+Annual+Subscription&" +
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
                    while (match = search.exec(query)){
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    }
                    opmnttoken = pmntcreateParams["TOKEN"];
                    pmnttoken = pmntcreateParams["TOKEN"];
                    opmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    localStorage.setItem('paypaltstamp', opmnttimestamp);
                    var paypalcreateurl = paymentcreateurl + opmnttoken;
                    if(opmnttoken == undefined || opmnttoken == null){
                        return alertError('Failed to initiate payment with PayPal.');
                    }
                    window.location.href = paypalcreateurl;
                }
            }
        });
    },

    createPmntAnnualRecurring: function (a) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Requesting token from paypal",_time);
        $('#paypalsuccessmodalinit').modal('show').css('display','block');
        createdata = "method=SetExpressCheckout&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount+ "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "L_BILLINGAGREEMENTDESCRIPTION0=CloudFuze+Annual+Subscripton&" +
            "returnUrl=" + pmntsreturnurl + "%3F"+ a.success+"%3Dtrue%26Y%3Dtrue&" +
            "cancelUrl=" + pmntsreturnurl + "%3F"+ a.cancel+"%3Dtrue&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "L_PAYMENTREQUEST_0_NAME0=CloudFuze+Annual+Subscription&" +
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
                        sendGAEvents("Token Error from paypal",_time);
                        $('#paypalsuccessmodalinit').modal('hide');
                        return alertError('Failed to initiate payment with PayPal.');
                    }
                    sendGAEvents("Redirecting user to paypal",_time);
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

    cmpleteMnthlyPmntOneTime: function (a, tokid, pyrid) {
        createdata = "method=DoExpressCheckoutPayment&" +
            "PAYMENTREQUEST_0_AMT=" + a.amount + "&" +
            "PAYMENTREQUEST_0_CURRENCYCODE="+ a.code+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "TOKEN=" + tokid + "&" +
            "PAYERID=" + pyrid;
        //createpmntUrl = "https://devwebapp.cloudfuze.com/pmntrecurring/nvp" ;
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
                    while (match = search.exec(query)) {
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    }
                    pmnttoken = pmntcreateParams["TOKEN"];
                    pmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    pmntack = pmntcreateParams["ACK"];
                    pmnttid = pmntcreateParams["PAYMENTINFO_0_TRANSACTIONID"];
                    pmntstatus = pmntcreateParams["PAYMENTINFO_0_PAYMENTSTATUS"];
                    if (pmntack == "Success") {
                        pmntack = "PAID";
                        var intpmntid = CFPaymentsInternal.pmntmnthlyonetime(pmnttid, pmntack, pmnttimestamp, pyrid, cmpletepmntresponse);
                        var subname = "1 Month";
                        var status1 = "ACTIVE";
                        var stype = "PAY_ONETIME";
                        var expdate = getuserexpiry.searchuserexpiry(localStorage.getItem('UserId'));
                        var expdate_expiresIn = expdate[0].expiresIn;
                        var expdate_createdDate = expdate[0].createdDate;
                        var etstamp;
                        if (expdate_expiresIn == null) {
                            etstamp = expdate_createdDate;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }else {
                            etstamp = expdate_expiresIn;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }
                        $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                    }
                    else if (pmntack == "Failure") {
                        pmntack = "PENDING";
                    //    zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Failed");
                        $('#transstatustext').text('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                    }
                }
            }
        });
        return pmntack;
    },

    cmpleteAnnualPmntOneTime: function (Oamt, tokid, pyrid) {
        createdata = "method=DoExpressCheckoutPayment&" +
            "PAYMENTREQUEST_0_AMT=" + Oamt + "&" +
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
                        var subname = "1 Year ";
                        var status1 = "ACTIVE";
                        var stype = "PAY_ONETIME";
                        var expdate = getuserexpiry.searchuserexpiry(localStorage.getItem('UserId'));
                        var expdate_expiresIn = expdate[0].expiresIn;
                        var expdate_createdDate = expdate[0].createdDate;
                        var etstamp;
                        if (expdate_expiresIn == null) {
                            etstamp = expdate_createdDate;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        } else {
                            etstamp = expdate_expiresIn;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }
                        $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                    }
                    else if (pmntack == "Failure") {
                        pmntack = "PENDING";
                    //    zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Failed");
                        $('#transstatustext').text('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                    }
                }
            }
        });
        return pmntack;
    },

    cmpleteMnthlyPmntRecurring: function (_c) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("Connecting paypal with payment token",_time);
        createdata = "method=CreateRecurringPaymentsProfile&" +
            "AMT=" + _c.amount + "&" +
            "CURRENCYCODE="+_c.country+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "DESC=CloudFuze+Monthly+Subscripton&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "TOKEN=" + _c.token + "&" +
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
                        var subname = "Monthly Recurring";
                        var status1 = "ACTIVE";
                        var stype = "PAY_MONTHLY";
                        var expdate = getuserexpiry.searchuserexpiry(localStorage.getItem('UserId'));
                        var expdate_expiresIn = expdate[0].expiresIn;
                        var expdate_createdDate = expdate[0].createdDate;
                        var etstamp;
                        if (expdate_expiresIn == null) {
                            etstamp = expdate_createdDate;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }
                        else {
                            etstamp = expdate_expiresIn;
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
        sendGAEvents("Get Cloud Files",_time);
        sendGAEvents("Connecting paypal with payment token",_time);
        createdata = "method=CreateRecurringPaymentsProfile&" +
            "AMT=" + _a.amount + "&" +
            "CURRENCYCODE="+_a.country+"&" +
            "PAYMENTREQUEST_0_PAYMENTACTION=sale&" +
            "L_BILLINGTYPE0=RecurringPayments&" +
            "DESC=CloudFuze+Annual+Subscripton&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "TOKEN=" + _a.token + "&" +
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
                        var subname = "Yearly Recurring";
                        var status1 = "ACTIVE";
                        var stype = "PAY_YEARLY";
                        var expdate = getuserexpiry.searchuserexpiry(localStorage.getItem('UserId'));
                        var expdate_expiresIn = expdate[0].expiresIn;
                        var expdate_createdDate = expdate[0].createdDate;
                        var etstamp;
                        if (expdate_expiresIn == null) {
                            etstamp = expdate_createdDate;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        } else {
                            etstamp = expdate_expiresIn;
                            CFSubscriptionsInternal.CreateSubscription(subname, status1, stype, pmnttimestamp, etstamp, intpmntid);
                        }
                        $('#transstatustext').text('Thank you for choosing CloudFuze. Your payment was successful.');
                    }
                    else if (pmntack == "Failure") {
                        pmntack = "PENDING";
                        $('#transstatus').find('#contclick').attr('status', 'failed');
                     //   zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Failed");
                        $('#transstatustext').html('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                        $('#transbutton').text('Please try again');
                    }
                }
            }
        });
        return pmntack;
    },

    cnclRecurringSubscription: function (profid) {
        createdata = "method=ManageRecurringPaymentsProfileStatus&" +
            "version=104.0&" +
            "user=" + API_username + "&" +
            "pwd=" + API_password + "&" +
            "signature=" + Signature + "&" +
            "PROFILEID=" + profid + "&" +
            "ACTION=Cancel";
        //createpmntUrl = "https://devwebapp.cloudfuze.com/pmntrecurring/nvp" ;
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
                    var cnclpmntresponse = xhr.responseText;
                    var match, pl = /\+/g,
                        search = /([^&=]+)=?([^&]*)/g,
                        decode = function (s) {
                            return decodeURIComponent(s.replace(pl, " "));
                        };
                    query = cnclpmntresponse;
                    pmntcreateParams = {};
                    while (match = search.exec(query))
                        pmntcreateParams[decode(match[1])] = decode(match[2]);
                    pmnttoken = pmntcreateParams["TOKEN"];
                    pmnttimestamp = pmntcreateParams["TIMESTAMP"];
                    pmntack1 = pmntcreateParams["ACK"];
                }
            }
        });
        return pmntack1;
    },

    createPayment:function(urlParams){
        pmntpage = urlParams["pinfo"];
        paypal1 = urlParams["paypalsuccess"];
        Monthly = urlParams["M"];
        Yearly = urlParams["Y"];
        Onetime = urlParams["O"];
        multiUserPayment = urlParams["U"];
        var orangeSuccess = urlParams["orangesuccess"],
            orangeCancel = urlParams["orangecancel"],
            cashlog = urlParams["cashlog"],
            payment = urlParams["payment"];

        paypaltoken = urlParams["token"];
        paypalpayerid = urlParams["PayerID"];
        var d = new Date();
        var _time = d.toISOString();

        if (pmntpage) {
            $('#paymentinfo').trigger('click');
        }
        else if (urlParams["paypalcancel"] === "true")
            sendGAEvents("No paypal payment,returned to app",_time);
        else if (paypal1 === "true") {



            var PayPalObject = {
                "amount":null,
                "time":null,
                "country":'',
                "token":paypaltoken,
                "id":paypalpayerid,
                "instace":"cloudfuze"
            };
            PayPalObject.country = JSON.parse(localStorage.getItem('CFUser')).currency == null ? 'USD' : JSON.parse(localStorage.getItem('CFUser')).currency;
            $('#paymentinfo').trigger('click');
            $('#paypalsuccessmodal').modal('show').css('display','block');
            if (Monthly === "true") {
                sendGAEvents("Paypal Monthly payment success",_time);
                PayPalObject.amount = localStorage.getItem('MonthlyAMNT');
                PayPalObject.time = localStorage.getItem('paypaltstamp');
                //CFPaymentsPaypal.cmpleteMnthlyPmntRecurring(PayPalObject);
                paypalPayments.cmpleteMnthlyPmntRecurring(PayPalObject);
                localStorage.removeItem('MonthlyAMNT');
                $('#monthlysubscribe').addClass('divdisplay');
                $('#cnclmonthlysubscribe').removeClass('divdisplay');
                $('#paypalsuccessmodal').modal('hide');
                $('#transstatus').modal('show').css('display','block');
            }
            else if (Yearly === "true") {
                sendGAEvents("Paypal Annual payment success",_time);
                PayPalObject.amount = localStorage.getItem('YearlyAMNT');
                PayPalObject.time = localStorage.getItem('paypaltstamp');
                //CFPaymentsPaypal.cmpleteAnnualPmntRecurring(PayPalObject);
                paypalPayments.cmpleteAnnualPmntRecurring(PayPalObject);
                if(PayPalObject.id === localStorage.getItem("aftPaymtId")){

                }
                localStorage.setItem("aftPaymtId",PayPalObject.id);
                localStorage.setItem('paypalpayerid', paypalpayerid);
                localStorage.removeItem('YearlyAMNT');
                $('#annualsubscribe').addClass('divdisplay');
                $('#cnclannualsubscribe').removeClass('divdisplay');
                $('#paypalsuccessmodal').modal('hide');
                $('#transstatus').modal('show').css('display','block');
            }
            else if(multiUserPayment == "true"){
                sendGAEvents("Paypal multiuser payment success",_time);
                multiUsrPayment.completePayment(paypaltoken,paypalpayerid);
                $('#paypalsuccessmodal').modal('hide');
                $('#transstatus').modal('show').css('display','block');
            }
        }
        else if(orangeSuccess === "true"){
            var object = {
                "amount":null,
                "time":null,
                "country":"EUR",
                "token":paypaltoken,
                "id":paypalpayerid,
                "instance":"orange"
            };
            if(Monthly === "true"){
                object.amount = localStorage.getItem('MonthlyAMNT');
                object.time = localStorage.getItem('paypaltstamp');
                CFPaymentsPaypal.cmpleteMnthlyPmntRecurring(object);
                localStorage.removeItem('MonthlyAMNT');
                localStorage.setItem('paypalpayerid', paypalpayerid);
                $('#monthlysubscribe').addClass('divdisplay');
                $('#cnclmonthlysubscribe').removeClass('divdisplay');
                $('#paypalsuccessmodal').modal('hide');
                $('#transstatus').modal('show').css('display','block');
            }
            else if(Yearly === "true"){
                object.amount = localStorage.getItem('YearlyAMNT');
                object.time = localStorage.getItem('paypaltstamp');
                CFPaymentsPaypal.cmpleteAnnualPmntRecurring(object);

                localStorage.setItem('paypalpayerid', paypalpayerid);
                localStorage.removeItem('YearlyAMNT');
                $('#annualsubscribe').addClass('divdisplay');
                $('#cnclannualsubscribe').removeClass('divdisplay');
                $('#paypalsuccessmodal').modal('hide');
                $('#transstatus').modal('show').css('display','block');
            }
        }
        else if(orangeCancel === "true"){
            $('#transstatus').find('#contclick').attr('status', 'failed');
          //  zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Failed");
            $('#transstatustext').html('Your payment was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
            $('#transbutton').text('Please try again');
            $('#transstatus').modal('show').css('display','block');
        }
        else if(cashlog == "true"&& payment == "true"){
            alert('Cashlog Payment Success');
        }else if(cashlog == "true" && payment == "false"){
            alert('Cashlog Payment Failed');
        }
    }
};

var CFSubscriptionsInternal= {

    CreateSubscription: function (subname, state, stype, ctstamp, etstamp, ipmntid ) {
        var d = new Date();
        var _time = d.toISOString();
        sendGAEvents("creation of user subscription",_time);
        ctstamp = CFInterConvertTimeUtility.Ptstamptomillsec(ctstamp);
        var apiUrl = apicallurl + "/subscription/add";
        //console.log(apiUrl);
        if (etstamp < ctstamp) { //already expired users
            if (subname == "Monthly Recurring") {
                etstamp = CFInterConvertTimeUtility.Pincreasethirty(ctstamp);
            }
            if (subname == "Yearly Recurring") {
                etstamp = CFInterConvertTimeUtility.Pincreaseyear(ctstamp);
            }
        }
        else {
            if (subname == "Monthly Recurring") {
                etstamp = CFInterConvertTimeUtility.Pincreasethirty(etstamp);
            }
            if (subname == "Yearly Recurring") {
                etstamp = CFInterConvertTimeUtility.Pincreaseyear(etstamp);
            }
        }

        if(subname == "Monthly Recurring"){
            subname='Individual Lite Monthly Subscription';
        }
        if(subname == "Basic Monthly Subscription"){
            subname='Individual Lite Monthly Subscription';
        }
        if(subname == "Basic Yearly Subscription"){
            subname='Individual Lite Yearly Subscription';
        }
        if(subname == "Standard Yearly Subscription"){
            subname='Standard Yearly Subscription';
        }
        if(subname == "Standard Monthly Subscription"){
            subname='Standard Monthly Subscription';
        }
        if(subname == "Advanced Yearly Subscription"){
            subname='Pro Yearly Subscription';
        }
        if(subname == "Advanced Monthly Subscription"){
            subname='Pro Monthly Subscription';
        }

        var subsarray = {"subscriptionName": subname, "userId": {"id": localStorage.getItem('UserId')}, "subscriptionStatus": state, "subscriptionType": stype, "subscriptionStartDate": ctstamp, "subscriptionEndDate": etstamp, "paymentId": ipmntid};
        //console.log(subsarray);
        var subsarrayjson = JSON.stringify(subsarray);
        //console.log(subsarrayjson);
        var subsresponse1 = "";
        $.ajax({
            type: "PUT",
            url: apiUrl,
            data: subsarrayjson,
            async: false,
            dataType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                subsresponse1 = data;
            },

            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    subsresponse = xhr.responseText;
                    //console.log(subsresponse.id);
                    subsresponse = jQuery.parseJSON(subsresponse);
                    //console.log(subsresponse);

                    var _pmntObj = {
                        "subscriptionName": subname,
                        "userId":  localStorage.getItem('UserId'),
                        "subscriptionStartDate": CFManageCloudAccountsAjaxCall.getDateConversion(ctstamp),
                        "subscriptionEndDate": CFManageCloudAccountsAjaxCall.getDateConversion(etstamp),
                        "paymentId": ipmntid
                    };
                    sendGAEvents('Payment success.');
                    var _price= localStorage.getItem("DisplayAmt");
                    var _discnt =localStorage.getItem("disctAmt");
                    var _tolPaid =localStorage.getItem("tolAmt");
                    /*    zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"RecurringHistory");
                        zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,_pmntObj,_price,_discnt,_tolPaid,_pmntObj.subscriptionStartDate);*/
                    //zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,_pmntObj);
                }
                if (xhr.status > 300) {
                    //console.log("Payment Operation Failed");
                }
            }
        });
    },

    GetlastSubscriptioninfo : function (){
        var apiUrl= apicallurl + "/subscription/all/"+localStorage.getItem('UserId');
        var subsresponse1;
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                subsresponse1 = data;
            },

            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    subsresponse = xhr.responseText;
                    subsresponse = jQuery.parseJSON(subsresponse);
                }
                if (xhr.status > 300) {
                }
            }
        });
        return subsresponse[0] ;
    },

    CancelSubscription : function(lstsubid) {
        var apiUrl = apicallurl + "/subscription/cancel?subscriptionId=" + lstsubid;
        //console.log(apiUrl);
        var subsresponse1;
        $.ajax({
            type: "POST",
            url: apiUrl,
            async: false,
            dataType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data) {
                subsresponse1 = data;
            },

            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    //  zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,'cancle');
                    cnclsubsresponse = xhr.responseText;
                    cnclsubsresponse = jQuery.parseJSON(cnclsubsresponse);
                }
                if (xhr.status > 300) { 
                }
            }
        });
    }
};

var CFPaymentsInternal = {

    getlastpmntinfo: function (intpmntid) {
        var apiUrl = apicallurl + "/pay/info/" + intpmntid;
        //console.log(apiUrl);
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            dataType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    completeresponse = xhr.responseText;
                    completeresponse = jQuery.parseJSON(completeresponse);
                }
                if (xhr.status > 300) {
                }
            }
        });
        return completeresponse;
    },

    pmntmnthlyonetime: function (pmttid, pmntack, pmnttimestamp, pyrid, cmpletepmntresponse) {
        var apiUrl = apicallurl + "/pay/user/add";
        var pmntarray = {"referenceId": pmnttid, "userId": {"id": localStorage.getItem('UserId')}, "paymentStatus": pmntack, "paymentDate": CFInterConvertTimeUtility.Ptstamptomillsec(pmnttimestamp), "paymentType": "PAYPAL", "billingId": pyrid, "gateWayResponse": cmpletepmntresponse };
        var pmntarrayjson = JSON.stringify(pmntarray);
        $.ajax({
            type: "PUT",
            url: apiUrl,
            data: pmntarrayjson,
            async: false,
            dataType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    completeresponse = xhr.responseText;
                    completeresponse = jQuery.parseJSON(completeresponse);
                    cfinternalpmntid = completeresponse.id;
                }
                if (xhr.status > 300) {
                }
            }
        });
        return cfinternalpmntid;
    },

    pmntmonthlyrecurring: function (pmntack, pmnttimestamp, pyrid, pmntprofid, cmpletepmntresponse) {
        var apiUrl = apicallurl + "/pay/user/add";
        var pmntarray = {"referenceId": "", "userId": {"id": localStorage.getItem('UserId')}, "paymentStatus": pmntack, "paymentDate": CFInterConvertTimeUtility.Ptstamptomillsec(pmnttimestamp), "paymentType": "PAYPAL", "billingId": pyrid, "recurringId": pmntprofid, "gateWayResponse": cmpletepmntresponse};
        var pmntarrayjson = JSON.stringify(pmntarray);
        $.ajax({
                type: "PUT",
                url: apiUrl,
                data: pmntarrayjson,
                async: false,
                dataType: "application/json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                complete: function (xhr, statusText) {
                    if (xhr.status == 200) {
                        completeresponse = xhr.responseText;
                        completeresponse = jQuery.parseJSON(completeresponse);
                        cfinternalpmntid = completeresponse.id;
                    }
                    if (xhr.status > 300) {
                    }
                }
            }
        );
        return cfinternalpmntid;
    },

    pmntannualonetime: function (pmttid, pmntack, pmnttimestamp, pyrid, cmpletepmntresponse) {
        var apiUrl = apicallurl + "/pay/user/add";
        var pmntarray = {"referenceId": pmnttid, "userId": {"id": localStorage.getItem('UserId')}, "paymentStatus": pmntack, "paymentDate": CFInterConvertTimeUtility.Ptstamptomillsec(pmnttimestamp), "paymentType": "PAYPAL", "billingId": pyrid, "gateWayResponse": cmpletepmntresponse};
        var pmntarrayjson = JSON.stringify(pmntarray);
        $.ajax({
                type: "PUT",
                url: apiUrl,
                data: pmntarrayjson,
                async: false,
                dataType: "application/json",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                complete: function (xhr, statusText) {
                    if (xhr.status == 200) {
                        completeresponse = xhr.responseText;
                        completeresponse = jQuery.parseJSON(completeresponse);
                        cfinternalpmntid = completeresponse.id;
                    }
                    if (xhr.status > 300) {
                    }
                }
            }
        );
        return cfinternalpmntid;
    },

    pmntannualrecurring: function (pmntack, pmnttimestamp, pyrid, pmntprofid, cmpletepmntresponse) {
        var apiUrl = apicallurl + "/pay/user/add";
        var pmntarray = {"referenceId": "", "userId": {"id": localStorage.getItem('UserId')}, "paymentStatus": pmntack, "paymentDate": CFInterConvertTimeUtility.Ptstamptomillsec(pmnttimestamp), "paymentType": "PAYPAL", "billingId": pyrid, "recurringId": pmntprofid, "gateWayResponse": cmpletepmntresponse};
        var pmntarrayjson = JSON.stringify(pmntarray);
        $.ajax({
            type: "PUT",
            url: apiUrl,
            data: pmntarrayjson,
            async: false,
            dataType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            complete: function (xhr, statusText) {
                if (xhr.status == 200) {
                    completeresponse = xhr.responseText;
                    completeresponse = jQuery.parseJSON(completeresponse);
                    cfinternalpmntid = completeresponse.id;
                }
                if (xhr.status > 300) {
                }
            }
        });
        return cfinternalpmntid;
    }
};

var getuserexpiry = {

    searchuserexpiry: function (user) {
        var jsondata = "";
        $.ajax({
            type: "GET",
            url: apicallurl + "/users/validate?searchUser=" + user,
            async: false,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success: function (data, textStatus, xhr) {
                var serverDate = CFInterConvertTimeUtility.Ptstamptomillsec(xhr.getResponseHeader("Date"));
                data.servetime = serverDate;
                jsondata = data;
            }
        });
        return jsondata;
    },

    getSubscriptionExpiry:function(){
        var a=JSON.parse(localStorage.getItem('CFUser'));
        var data = this.searchuserexpiry(a.userName);
        serverDate = data.servetime;
        var isCusUser = checkIsaCustomUserForLogin(localStorage.getItem("UserId"));
        if (isCusUser === false) {
            if (data[0].expiresIn != undefined && data[0].expiresIn < serverDate) {
                if (serverDate - data[0].expiresIn > (3 * 24 * 60 * 60 * 1000)) {
                    $('#expireMsg').html('');
                    $('#expireMsg').html('<div  style="font-size: 13pt;text-align: center;color: #FF4C4C;background: #FFF0F0;" class=""><span>Your free trial has expired ' + jQuery.timeago(data[0].expiresIn) + '. Please <a href="settings.html#price?pinfo=true">subscribe</a> to the paid plan to continue the migration.</span></div>');
                    $('#monthlysubscribe').removeClass('divdisplay');
                    $('#cnclmonthlysubscribe').addClass('divdisplay');
                    $('#expirelnk').removeClass('divdisplay');
                } else if (0 < serverDate - data[0].expiresIn < (3 * 24 * 60 * 60 * 1000)) {
                    $('#expireMsg').html('');
                    $('#clouds').prepend('<div id="expireMsg" style="font-size: 13pt;text-align: center;color: #FF4C4C;background: #FFF0F0;" class=""><span>Your free trial has expired ' + jQuery.timeago(data[0].expiresIn) + '. Please <a href="settings.html#price?pinfo=true">subscribe</a> to the paid plan to continue the migration.</span></div>');
                    $('#expirelnk').removeClass('divdisplay');
                }
            } else if (0 > serverDate - data[0].expiresIn && serverDate - data[0].expiresIn > -(3 * 24 * 60 * 60 * 1000)) {
                $('#expireMsg').html('');
                $('#clouds').prepend('<div id="expireMsg" style="font-size: 13pt;text-align: center;color: #FF4C4C;background: #FFF0F0;" class=""><span>Your free trial will expire on ' + CFManageCloudAccountsAjaxCall.getDateConversion(data[0].expiresIn) + ', Please <a href="settings.html#price?pinfo=true">subscribe</a> to the paid plan to continue the migration.</span></div>');
                $('#expirelnk').removeClass('divdisplay');
            } else if (0 > serverDate - data[0].expiresIn && serverDate - data[0].expiresIn > -(11 * 24 * 60 * 60 * 1000)) {
                $('#expireMsg').html('');
                var diffDate = data[0].expiresIn - serverDate;
                var finaldate = diffDate / 86400000;
                finaldate = Math.round(finaldate);
                if (finaldate == 0) {
                    $('#clouds').prepend('<div id="expireMsg" style="font-size: 13pt;text-align: center;color: #FF4C4C;background: #FFF0F0" class=""><span>Your free trial will expire today. Please <a href="settings.html#price?pinfo=true">subscribe</a> to the paid plan to continue the migration.</span></div>');
                }
                if (finaldate > 0) {
                    $('#clouds').prepend('<div id="expireMsg" style="font-size: 13pt;text-align: center;color: #FF4C4C;background: #FFF0F0" class=""><span>Your free trial will expire in ' + finaldate + ' day(s). Please <a href="settings.html#price?pinfo=true">subscribe</a> to the paid plan to continue the migration.</span></div>');
                }
                $('#expirelnk').removeClass('divdisplay');
            }
        }
    },

    getLastSubscription:function(){
        lastsubsresponse = CFSubscriptionsInternal.GetlastSubscriptioninfo();
        if (lastsubsresponse == undefined) {
            $('#subsstatus').text("Active");
            var a=JSON.parse(localStorage.getItem('CFUser'));
            var expdate = getuserexpiry.searchuserexpiry(a.userName);
            var isCusUser = checkIsaCustomUserForLogin(localStorage.getItem('UserId'));
            if(expdate[0].accountType == null){
                $('#subsname').text("Free Trial");
                $('#subslevel').text('Free Trial');
            }
            else if(a.accountType.isActive === true && a.accountType.accountType === "ENTERPRISE_TRIAL" ||a.accountType.accountType === "ENTERPRISE_PAID"){
                if(a.accountType.accountType === "ENTERPRISE_TRIAL"){
                    if (isCusUser == false){
                        $('#subsname').text("Free Trial");
                        $('#subslevel').text('Free Trial');
                    }
                    else{
                        $('#subsname').text("Enterprise Trial");
                        $('#subslevel').text('Enterprise Trial');
                    }

                }
                else if(a.accountType.accountType === "ENTERPRISE_PAID"){
                    if (isCusUser == false){
                        $('#subsname').text("Free Trial");
                        $('#subslevel').text('Free Trial');
                    }
                    else {
                        $('#subsname').text("Enterprise Paid");
                        $('#subslevel').text("Enterprise Paid");
                    }
                }

            }
            var expdate_expiredDate = expdate[0].expiresIn;
            var expdate_createdDate = expdate[0].createdDate;
            if (expdate_expiredDate == null || expdate_expiredDate == "") {
                var testconv1 = CFManageCloudAccountsAjaxCall.getDateConversion(CFInterConvertTimeUtility.Pincreasethirty(expdate_createdDate));
                $('#subsexpdate').text(testconv1);
                $('#setingexpdate').text(testconv1);
                $('#pmntstatus').text("N/A");
                $('#pmntdate').text("N/A");
                $('#pmntlevel').text('N/A');
            }
            else {
                var testconv1 = CFManageCloudAccountsAjaxCall.getDateConversion(expdate_expiredDate);
                if(expdate[0].accountType == null){
                    $('#setingexpdate').text(testconv1);
                }
                else if(a.accountType.accountType === "ENTERPRISE_TRIAL" || a.accountType.accountType === "ENTERPRISE_PAID"){
                    if(a.accountType.accountType === "ENTERPRISE_TRIAL"){
                        if (isCusUser == false){
                            $('#setingexpdate').text(testconv1);
                        }
                        else {
                            var to = CFManageCloudAccountsAjaxCall.getDateConversion(a.accountType.toDate);
                            var str = new Date(to).toLocaleString("en-US", {timeZone: "America/New_York"});
                            var to = CFManageCloudAccountsAjaxCall.getDateConversion(str);
                            var from = CFManageCloudAccountsAjaxCall.getDateConversion(a.accountType.fromDate);
                            var _date = from + " - " + to;
                            $('#setingexpdate').text(_date);
                        }
                    }
                    else if(a.accountType.accountType === "ENTERPRISE_PAID"){
                        if (isCusUser == false){
                            $('#setingexpdate').text(testconv1);
                        }
                        else{

                            $('#setingexpdate').text("Unlimited");
                        }
                    }

                }
                //$('#setingexpdate').text(testconv1);
                $('#pmntstatus').text("N/A");
                $('#pmntdate').text("N/A");
                $('#pmntlevel').text('N/A');
            }
        }
        else {
            $('#subsstatus').text(lastsubsresponse.subscriptionStatus);
			var plan = lastsubsresponse.subscriptionName;
			if(plan == "Individual Lite Yearly Subscription"){
			plan = "Lite - 600 GB/Year";
			}
			else if(plan == "Individual Lite Monthly Subscription"){
			plan = "Lite - 50 GB/Month";
			}
			else if(plan == "Pro Yearly Subscription"){
			plan = "Pro - 2400 GB/Year";
			}
			else if(plan == "Pro Monthly Subscription"){
			plan = "Pro - 200 GB/Month";
			}
            $('#subsname').text(plan);
            var testconv1 = CFManageCloudAccountsAjaxCall.getDateConversion(lastsubsresponse.subscriptionEndDate);
            $('#subsexpdate').text(testconv1);
            $('#setingexpdate').text(testconv1);
            if (lastsubsresponse.subscriptionType == "TRAIL" || lastsubsresponse.subscriptionType == "EXTENDED_TRAIL") {
                $('#subslevel').text('Free Trial');
            } else {
                $('#subslevel').text('Paid');
            }

            if(CFPaymentsInternal != undefined){
                lastpmntresponse = CFPaymentsInternal.getlastpmntinfo(lastsubsresponse.paymentId);
            }
            if(lastpmntresponse != undefined && lastpmntresponse != null){
                $('#pmntstatus').text(lastpmntresponse.paymentStatus);//TODO - check response is null - Rat, Mike(Done)
                $('#pmnttype').text(lastpmntresponse.paymentType);
                $('#pmntdate').text(CFManageCloudAccountsAjaxCall.getDateConversion(lastpmntresponse.paymentDate));
                if (lastpmntresponse.referenceId == "" || lastpmntresponse.referenceId == null) {
                    $('#pmntlevel').text('Recurring');
                } else if (lastpmntresponse.recurringId == "" || lastpmntresponse.recurringId == null) {
                    $('#pmntlevel').text('One Time');
                }
            }

            if (lastsubsresponse.subscriptionName == "") {
            } else if ((lastsubsresponse.subscriptionName).indexOf("Month") != -1 && lastsubsresponse.subscriptionStatus == "ACTIVE") {
                //   zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,lastsubsresponse.subscriptionStatus);
                $('#monthlysubscribe').addClass('divdisplay');
                $('#cnclmonthlysubscribe').removeClass('divdisplay');
            }
            if ((lastsubsresponse.subscriptionName).indexOf("Year") != -1 && lastsubsresponse.subscriptionStatus == "ACTIVE") {
                $('#annualsubscribe').addClass('divdisplay');
                $('#month').addClass('divdisplay');
                $('#cnclannualsubscribe').removeClass('divdisplay');
            }

            if ((lastsubsresponse.subscriptionName).indexOf("Month") == -1 || lastsubsresponse.subscriptionStatus == "INACTIVE") {
              //  zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,lastsubsresponse.subscriptionStatus);
                $('#monthlysubscribe').removeClass('divdisplay');
                $('#cnclmonthlysubscribe').addClass('divdisplay');
            }
            if ((lastsubsresponse.subscriptionName).indexOf("Year") == -1 || lastsubsresponse.subscriptionStatus == "INACTIVE") {
                $('#annualsubscribe').removeClass('divdisplay');
                $('#month').removeClass('divdisplay');
                $('#cnclannualsubscribe').addClass('divdisplay');
            }
        }
    }
};

var moveMigration = {
    getMovePricing:function(){
        var _result = null;
        var apiUrl = apicallurl+'/move/migration/charges';
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            headers: {
                "Content-Type": "application/json",
                "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
            },
            success:function(r){
                return _result = r;
            }
        });
        return _result;
    }
};

var CFInterConvertTimeUtility = {
    Ptstamptomillsec: function (timestmp) {
        var myDate = new Date(timestmp);
        return myDate.getTime();
    },
    Pincreasethirty: function (timestmp) {
        //var myDate = new Date(timestmp);
        var myDate = new Date();
        var result = myDate.getTime();
        result = result + (30 * 24 * 60 * 60 * 1000);
        return result;
    },
    Pincreaseyear: function (timestmp) {
        //var myDate = new Date(timestmp);
        var myDate = new Date();
        var result = myDate.getTime();
        result = result + (365 * 24 * 60 * 60 * 1000);
        return result;
    },
    PmillisectoDate: function (milsec) {
        milsec1 = new Date(milsec).toString();
        return milsec1;
    }
};

$('#closepricing').on('click', function() {
    $('#couponsmessage').text('');
    $('#couponemessage').text('');
    $('#couponcode').val('');
    var tmpamnt = $('#amnt').text();
    DiscAMT = 0;
    $('#discount').text(DiscAMT);
    $('#totalamnt').text((tmpamnt - DiscAMT).toFixed(2));

});

$('#monthlysubscribe').on('click', function() {
    sendGAEvents("Upgrade","Monthly");
    var _model =$('#calcpricemodal');
    var _e = JSON.parse(window.localStorage.CFUser).primaryEmail.split('.');
    _e = _e[_e.length -1];
    var finalAmount;
    if(_e == "org"){
        DiscAMT = (12/100)*MonthlyAMT;
        DiscAMT = DiscAMT.toFixed(2);
        finalAmount = MonthlyAMT - DiscAMT;
        finalAmount =  finalAmount.toFixed(2)
    }
    else if(_e == "edu"){
        DiscAMT = (20/100)*MonthlyAMT;
        DiscAMT = DiscAMT.toFixed(2);
        finalAmount = MonthlyAMT - DiscAMT;
        finalAmount = finalAmount.toFixed(2)
    }
    else{
        finalAmount = MonthlyAMT - DiscAMT
    }
    $('#subscribetype').text('Monthly Subscription');
    $('#amnt').text(MonthlyAMT);
    $('#discount').text(DiscAMT);
    var _cur = JSON.parse(localStorage.getItem('CFUser')).currency;
    if(_cur == null || _cur != 'EUR'){
        _cur = 'USD';
    }
    var cur = {
        'USD':'$',
        'EUR':'\u20AC'
    };
    _model.find('[data-currency]').attr('data-currency',_cur);
    _model.find('[data-currency]').text(cur[_cur]);
    $('#totalamnt').text(finalAmount);
    _model.modal('show');
});

$('#annualsubscribe').on('click', function() {
    sendGAEvents("Upgrade","Anually");
    //_gaq.push(['_trackEvent',"Upgrade", localStorage.getItem('UserId'),"Anually"]);
    var  _e = JSON.parse(window.localStorage.CFUser).primaryEmail.split('.');
    _e = _e[_e.length -1];
    var finalAmount;
    if(_e == "org"){
        DiscAMT = (12/100)*YearlyAMT;
        DiscAMT = DiscAMT.toFixed(2);
        finalAmount = YearlyAMT - DiscAMT;
        finalAmount = finalAmount = finalAmount.toFixed(2)
    }else if(_e == "edu"){
        DiscAMT = (20/100)*YearlyAMT;
        DiscAMT = DiscAMT.toFixed(2);
        finalAmount = YearlyAMT - DiscAMT;
        finalAmount = finalAmount.toFixed(2)
    }else{
        finalAmount = YearlyAMT - DiscAMT
    }
    $('#subscribetype').text('Annual Subscription');
    $('#amnt').text(YearlyAMT);
    $('#discount').text(DiscAMT);
    $('#totalamnt').text(finalAmount );
    $('#calcpricemodal').modal('show').css('display','block');
});

$('#cnclmonthlysubscribe').on('click', function() {
    $('#cnclmonthlysubscribemodal').modal('show');
});

$('#cnclannualsubscribe').on('click', function(){
    $('#cnclannualsubscribemodal').modal('show');
});

$('#cnclmonthlysubscribeyes').on('click', function() {
    $('#processimg').removeClass('divdisplay');
    $('#cnclmonthlysubscribemodal').modal('hide');
    $('#cnclsubscribemodalfinal').modal('show');
    if(lastsubsresponse.subscriptionId){
		setTimeout(function(){
        CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
        $('#cnclsubscribemodalfinal').modal('hide');
        $('#transstatus').modal('show');
        $('#transstatustext').text('Thank you for choosing CloudFuze. Your cancellation was successful.');
	},1000);
		return false;
    }
    else {
        if (lastpmntresponse.recurringId && lastpmntresponse.referenceId == "") {
            var status2 = CFPaymentsPaypal.cnclRecurringSubscription(lastpmntresponse.recurringId);
            if (status2 == "Success") {
                CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
                $('#transstatustext').text('Thank you for choosing CloudFuze. Your cancellation was successful.');
            } else {
                $('#transstatustext').html('Your cancellation was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                $('#transbutton').text('Please try again');
            }
        } else {
            CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
        }
        $('#cnclsubscribemodalfinal').modal('hide');
        $('#transstatus').modal('show').css('display','block');
    }
});

$('#cnclannualsubscribeyes').on('click', function() {
    $('#processimg').removeClass('divdisplay');
    $('#cnclmonthlysubscribemodal').modal('hide');
    $('#cnclsubscribemodalfinal').modal('show');
    if(lastsubsresponse.subscriptionId){
		setTimeout(function(){
        CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);

        $('#cnclsubscribemodalfinal').modal('hide');
        $('#transstatus').modal('show');
        $('#transstatustext').text('Thank you for choosing CloudFuze. Your cancellation was successful.');
	},1000);
		return false;
    }
    else {
        if (lastpmntresponse.recurringId && lastpmntresponse.referenceId == "") {
            var status3 = CFPaymentsPaypal.cnclRecurringSubscription(lastpmntresponse.recurringId);
            if (status3 == "Success") {
                CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
                $('#transstatustext').text('Thank you for choosing CloudFuze. Your cancellation was successful.');
            } else {
                $('#transstatustext').html('Your cancellation was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                $('#transbutton').text('Please try again');
            }
        } else {
            CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
        }

        $('#cnclsubscribemodalfinal').modal('hide');
        $('#transstatus').modal('show');
    }
});
$('.cnclOthersubscribeyes').on('click', function() {
    $('#processimg').removeClass('divdisplay');
    $('#cnclmonthlysubscribemodal').modal('hide');
    $('#cnclsubscribemodalfinal').modal('show');
    if(lastsubsresponse.subscriptionId){
	setTimeout(function(){
        CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);

        $('#cnclsubscribemodalfinal').modal('hide');
        $('#transPrevstatus').modal('show');
        $('#transstatusPrevtext').text('Thank you for choosing CloudFuze. Your previous subscription cancellation was successful.');
	},1000);
		return false;

    }
    else {
        if (lastpmntresponse !== undefined) {
            if (lastpmntresponse.recurringId && lastpmntresponse.referenceId === "") {
                var status3 = CFPaymentsPaypal.cnclRecurringSubscription(lastpmntresponse.recurringId);
                if (status3 == "Success") {
                    CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
                    $('#transstatusPrevtext').text('Thank you for choosing CloudFuze. Your previous subscription cancellation was successful.');
                } else {
                    $('#transstatustext').html('Your cancellation was not successful. Please try again. If still facing problems, contact <a href="mailto:support@cloudfuze.com"> support@cloudfuze.com </a>');
                    $('#transstatusPrevtext').text('Please try again');
                }
            }
        }
        else {
            CFSubscriptionsInternal.CancelSubscription(lastsubsresponse.id);
        }

        $('#cnclsubscribemodalfinal').modal('hide');
        $('#transPrevstatus').modal('show');
    }
});


$('#contclick').on('click', function() {
    var instance = $(this).attr('instance');
    var status = $(this).attr('status');
    if(instance == null || instance == undefined){
        if(localStorage.hasOwnProperty("sourcePayment"))
            window.location.href = "move.html?pinfo=true&newpricing=true";
        else{
            if(window.location.href.indexOf("&U=true&") > -1)
                window.location.href = "settings.html#upgrade?pinfo=true&newpricing=true";
            else{
                window.location.href = "settings.html#";//price?pinfo=true&newpricing=true
                window.location.reload(true);
            }

        }
        sendGAEvents("New pricing payment");
    }
    else{
        if(status == "failed"){
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "index.html?orange=true";
        }
        else{
            window.location.href = "cloudmanager.html#orange";
        }
    }
});

$('#applycoupon').on('click', function() {
    var substypechk = $('#subscribetype').text();
    var bla = $('#couponcode').val();

    if (bla === "") {
        $('#couponemessage').text('Please enter coupon code'); 
        $('#couponsmessage').text('');
        var tmpamnt = $('#amnt').text();
        DiscAMT = 0;
        $('#discount').text(DiscAMT);
        $('#totalamnt').text((tmpamnt - DiscAMT).toFixed(2));
    }else if ($.inArray(CryptoJS.MD5(bla).toString(), cou5) > -1 && substypechk === "Annual Subscription") {
        $('#couponsmessage').text('Your Coupon has been Applied Successfully');
        $('#couponcode').val("");
        $('#couponemessage').text('');
        var tmpamnt = $('#amnt').text();
        DiscAMT = 0.05 * tmpamnt;
        DiscAMT = DiscAMT.toFixed(2);
        $('#discount').text(DiscAMT);
        $('#totalamnt').text((tmpamnt - DiscAMT).toFixed(2));
    }else if ($.inArray(CryptoJS.MD5(bla).toString(), cou10) > -1 && substypechk === "Annual Subscription") {
        $('#couponsmessage').text('Your Coupon has been Applied Successfully');
        $('#couponcode').val("");
        $('#couponemessage').text('');
        var tmpamnt = $('#amnt').text();
        DiscAMT = 0.10 * tmpamnt;
        DiscAMT = DiscAMT.toFixed(2);
        $('#discount').text(DiscAMT);
        $('#totalamnt').text((tmpamnt - DiscAMT).toFixed(2));
    }else if ($.inArray(CryptoJS.MD5(bla).toString(), cou20) != -1 && substypechk === "Annual Subscription") {
        $('#couponsmessage').text('Your Coupon has been Applied Successfully');
        $('#couponcode').val("");
        $('#couponemessage').text('');
        var tmpamnt = $('#amnt').text();
        DiscAMT = 0.20 * tmpamnt;
        DiscAMT = DiscAMT.toFixed(2);
        $('#discount').text(DiscAMT);
        $('#totalamnt').text((tmpamnt - DiscAMT).toFixed(2));
    }else if ($.inArray(CryptoJS.MD5(bla).toString(), cou50) != -1 && substypechk === "Annual Subscription") {
        $('#couponsmessage').text('Your Coupon has been Applied Successfully');
        $('#couponcode').val("");
        $('#couponemessage').text('');
        var tmpamnt = $('#amnt').text();
        DiscAMT = 0.50 * tmpamnt;
        DiscAMT = DiscAMT.toFixed(2);
        $('#discount').text(DiscAMT);
        $('#totalamnt').text((tmpamnt - DiscAMT).toFixed(2));
    }else {
        $('#couponemessage').text('Invalid coupon code');
        $('#couponsmessage').text('');
        var tmpamnt = $('#amnt').text();
        DiscAMT = 0;
        $('#discount').text(DiscAMT);
        $('#totalamnt').text(tmpamnt);
    }
});

var substype;
var MOtime;
var YOtime;

$('#checkoutbutton').on('click', function() {
    var isChecked = $('#terms').is(':checked');
    var _a = {
        "amount":null,
        "code":$('#calcpricemodal').find('[data-currency]').attr('data-currency'),
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    };
    var _cashLog = $('#cashlogPayments'),
        _callBack = domainUrl+"pages/settings.html?cashlog=true&payment=true",
        _callBackError = domainUrl+"pages/settings.html?cashlog=true&payment=false";
    if (isChecked) {
        substype = $('#subscribetype').text();
        MOtime = $('#autorenewal').is(':checked');
        YOtime = $('#autorenewal2').is(':checked');
        if (substype === "Monthly Subscription" && MOtime == true) {
            Monthly = true;
            MonthlyAMT = $('#totalamnt').text();
            localStorage.setItem('MonthlyAMNT', MonthlyAMT);
            _a.amount = MonthlyAMT;
            if(JSON.parse(localStorage.getItem('CFUser')).instance == "ORANGE"){
                _cashLog.find('[name="price"]').val(MonthlyAMT);
                _cashLog.find('[name="callback_url"]').val(_callBack);
                _cashLog.find('[name="error_callback_url"]').val(_callBackError);
                _cashLog.submit();
            }else{
                CFPaymentsPaypal.createPmntMnthlyRecurring(_a);
            }
            $('#calcpricemodal').modal('hide');
        }
        else if (substype === "Annual Subscription" && YOtime == true) {
            Yearly = true;
            YearlyAMT = $('#totalamnt').text();
            localStorage.setItem('YearlyAMNT', YearlyAMT);
            _a.amount = YearlyAMT;
            if(JSON.parse(localStorage.getItem('CFUser')).instance == "ORANGE"){
                _cashLog.find('[name="price"]').val(MonthlyAMT);
                _cashLog.find('[name="callback_url"]').val(_callBack);
                _cashLog.find('[name="error_callback_url"]').val(_callBackError);
                _cashLog.submit();
            }else{
                CFPaymentsPaypal.createPmntAnnualRecurring(_a);
            }
            $('#calcpricemodal').modal('hide');
        }
        else if (substype === "Monthly Subscription" && MOtime == false) {
            Monthly = true;
            MonthlyAMT = $('#totalamnt').text();
            localStorage.setItem('MonthlyAMNT', MonthlyAMT);
            _a.amount = MonthlyAMT;
            CFPaymentsPaypal.createPmntMnthlyOneTime(_a);
            $('#calcpricemodal').modal('hide');
        }
        else if (substype === "Annual Subscription" && YOtime == false) {
            Yearly = true;
            YearlyAMT = $('#totalamnt').text();
            localStorage.setItem('YearlyAMNT', YearlyAMT);
            _a.amount = YearlyAMT;
            CFPaymentsPaypal.createPmntAnnualOneTime(_a);
            $('#calcpricemodal').modal('hide');
        }
    }
    else {
        $('#couponemessage').html('Please agree for terms and condtions');
    }
});

$("#editPswd").click(function() {
    sendGAEvents("clicked on pencil icon beside change password in settings page");
    $('#Cpswd').val('');
    $('#Rpswd').val('');
    $('#Cpswd').css("border-color", "");
    $('#Rpswd').css("border-color", "");
    $('#Cpswd').focus();
    $('#stars').hide();
    $('#changePwd').show();
    $('body').on('mouseup', function (e) {
        var container = $('#changePwd');
        if (!container.is(e.target)
            && container.has(e.target).length === 0) {    //console.log("jsf");
            $('.changePwdCancel').trigger('click');
            $('body').off('mouseup');
        }
    });
});

$('#changePwd').keydown(function (event) {
    if (event.keyCode == 13) {
        $('.changePwdOk').trigger("click");
    }
});

$('.changePwdCancel').click(function() {
    sendGAEvents("clicked on cancel beside change password in settings page");
    $('#stars').show();
    $(this).parent().hide();
});

$('.changePwdOk').click(function() {
    sendGAEvents("clicked on tick mark beside change password in settings page");
    $('#Cpswd').css("border-color", "");
    $('#Rpswd').css("border-color", "");
    var pswd = $('#Cpswd').val();
    var Rpswd = $('#Rpswd').val();
    if (pswd == "" && Rpswd == "") {
        //$.smallBox({title: "Please enter the required fields.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please enter the required fields.");
        $('#Cpswd').css("border-color", "red");
        $('#Rpswd').css("border-color", "red");
        $('#Cpswd').focus();
        return false;
    }else if (pswd == "") {
        //$.smallBox({title: "Please enter password.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please enter password.");
        $('#Cpswd').css("border-color", "red");
        $('#Cpswd').focus();
        return false;
    }else if (pswd.length > 20) {
        //$.smallBox({title: "Please enter a password less than 20 characters.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please enter a password less than 20 characters.");
        $('#Cpswd').css("border-color", "red");
        $('#Cpswd').focus();
        return false;
    }else if (pswd.length < 6) {
        //$.smallBox({title: "Please enter a password with atleast 6 characters.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please enter a password with atleast 6 characters.");
        $('#Cpswd').css("border-color", "red");
        $('#Cpswd').focus();
        return false;
    }else if (Rpswd == "") {
        //$.smallBox({title: "Please Reenter password.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please Reenter password.");
        $('#Rpswd').css("border-color", "red");
        $('#Rpswd').focus();
        return false;
    } else if (Rpswd.length > 20) {
        //$.smallBox({title: "Please enter a confirm password less than 18 characters.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please enter a confirm password less than 20 characters.");
        $('#Cpswd').css("border-color", "red");
        $('#Cpswd').focus();
        return false;
    }
    else if (Rpswd.length < 6) {
        //$.smallBox({title: "Please enter a confirm password with atleast 6 characters.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Please enter a confirm password with atleast 6 characters.");
        $('#Cpswd').css("border-color", "red");
        $('#Cpswd').focus();
        return false;
    }
    else if (pswd != Rpswd) {
        //$.smallBox({title: "Password and Confirm password doesnot match.", color: "#e35e00", timeout: notifyTime, sound: false});
        alertError("Password and Confirm password does not match.");
        $('#Rpswd').css("border-color", "red");
        $('#Rpswd').focus();
        return false;
    }
    if (pswd == Rpswd) {
        pswd = CryptoJS.MD5(pswd);
        Rpswd = CryptoJS.MD5(Rpswd);
        var apiurl = apicallurl + '/auth/user/verifyPassword?newPassword=' + Rpswd + '';
        $.ajax({
            type: "POST",
            url: apiurl,
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("UserAuthDetails"),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS" 
            },
            success: function (data) {
                if (data == null) {
                    $('#AccountSettings .DisplayMsg').text('Password updated successfully');
                    var uid = localStorage.getItem("UserId");
                    var pwd = pswd;
                    localStorage.setItem('UserAuthDetails', CFHPActions.BasicAuth(uid, pwd));
                    //$.smallBox({title: "Your password updated successfully.", color: "#1ba1e2", timeout: notifyTime, sound: false});
                    alertSuccess("Your password updated successfully.");
                    $('.changePwdCancel').trigger('click');
                }
            },
            complete: function (xhr, statusText) {
                if (xhr.status > 300) {
                    //$.smallBox({title: "Operation Failed.", color: "#e35e00", timeout: notifyError, sound: false});
                    alertError("Operation Failed."); 
                }
            },
            error: function (error) {
            }
        });
    }
});

$('#cf-logout').on('click',function(e) {
	alertSuccess("You have been logged out")
// CFManageCloudAccountsAjaxCall.getAllMoveStatusForUser();
 //CFManageCloudAccountsAjaxCall.getAllMoveStatusForSyncUser();
 setTimeout(function(){
   /*	activecampaign.eventTrack('Logout',JSON.parse(localStorage.CFUser).primaryEmail,'clicked');
    if(localStorage.getItem("MigtnDone") === "consumer" || localStorage.getItem("MigtnDone") === "multiUser"){

    }
    else{
     //   zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,'logout',"","","","");
	   activecampaign.getContact(JSON.parse(localStorage.CFUser).primaryEmail,'userBounced',"Yes");
    }*/
    if (localStorage.getItem("socialLogin") === "gloginSoc"){
signOut();
       function signOut(){ 
var auth2 = gapi.auth2.getAuthInstance();
         auth2.signOut().then(function () {
         console.log('User signed out.');
        });
};
      }

sendGAEvents("clicked on logout button");
   
	e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href="index.html";
	},1000);
});

$('#CFEditName').on('click', function() {
    sendGAEvents("clicked on edit name button in settings page");
    $(this).hide();
    var UserName = $('.ProfileContent').text().trim();
    $('.ProfileContent').html("<span class='editUser'><input class='form-control' type='text' name='username' id='uName' value='" + UserName + "' autofocus /></span>");
    $('.ProfileContent').append("<i class='userNameOk fa fa-check' style='cursor:pointer;margin-left:10px;color:green;'></i><i class='userNameCancel fa fa-times' style='margin-left:10px;cursor:pointer;color:red;'></i>");
    $('#uName').focus();
    $('.userNameCancel').click(function () {
        sendGAEvents("clicked on cancel beside name change in settings page");
        $('.ProfileContent').text(UserName);
        $('#CFEditName').show();
        $('.userNameCancel').hide();
        $('.userNameOk').hide();
    });
    $('.userNameOk').click(function () {
        sendGAEvents("clicked on tick mark beside name change in settings page");
        var Updatedusername = $('#uName').val();
        var userReg = /[^a-zA-Z ]/;
        if (Updatedusername == "") {
            $('#uName').css("border-color", "red");
            return false;
        }
        if (Updatedusername.length > 20 || Updatedusername.length > 0 && Updatedusername.length < 2) {
            $('#uName').css("border-color", "red");
           
            alertError("Please enter your Name.Accepts 2-20 characters in this field.");
            return false;
        }
        else if (userReg.test(Updatedusername)) {
            $('#uName').css("border-color", "red");
            //$.smallBox({title: "Please enter a valid Name. Name can contain characters (a-z, A-Z).", color: "#e35e00", timeout: 2000, sound: false});
            alertError("Please enter a valid Name. Name can contain characters (a-z, A-Z).");
            //toastr.error("Please enter a valid Name. Name can contain characters (a-z, A-Z).");
            return false;
        } else {
            $('#uName').css("border-color", "");
        }

        CFManageCloudAccountsAjaxCall.updateUserName(Updatedusername);
   if($('#dash-uname').text().length > 10){
$(".ml-auto1").css("margin-left","5%");
$(".dropdown-content").css("left","10%");
}else{
$(".ml-auto1").css("margin-left","15%");
$(".dropdown-content").css("left","-15%"); 
}
        $('#CFEditName').show();
        $('.userNameCancel').hide();
        $('.userNameOk').hide();

    });
    $('.ProfileContent input').keydown(function (event) {
        var Updatedusername = $('#uName').val();
        if (event.keyCode == 13) {
            $('.userNameOk').trigger("click");
        }
    });
    $('body').on('mouseup', function (e) {
        var container = $('.ProfileContent');
        if (!container.is(e.target)
            && container.has(e.target).length === 0) {    //console.log("jsf");
            $('.userNameCancel').trigger('click');
            $('body').off('mouseup');
        }
    });
});

$('#CFEditMobile').on('click', function() {
    $(this).hide();
    sendGAEvents("clicked on pencil icon beside phone number in settings page");
    var UserName = $('.ProfileContentmobile').text().trim();
    if(UserName == 'Not Available')
        UserName="";
    $('.ProfileContentmobile').html("<span class='editMobile'><input type='text' name='username' id='uMobile' value='" + UserName + "' autofocus /></span>");
    $('.ProfileContentmobile').append("<i class='userNameOk' style='cursor:pointer;margin-left:10px;'></i><i class='userNameCancel' style='margin-left:10px;cursor:pointer;'></i>");
    $('#uName').focus();
    $('.userNameCancel').click(function () {
        sendGAEvents("clicked on cancel beside phone number in settings page");

        $('.ProfileContentmobile').text(UserName);
        $('#CFEditMobile').show();
        $('.userNameCancel').hide();
        $('.userNameOk').hide();
    });
    $('.userNameOk').click(function () {
        sendGAEvents("clicked on tick mark beside phone number in settings page");

        var Updatedusername = $('#uMobile').val();
        var userReg = /[^+]([^0-9])/;
        // if (Updatedusername == "") {
        //    $('#uMobile').css("border-color", "red");
        //     return false;
        // }
        if (Updatedusername.length !=0) {
            if (Updatedusername.length > 15 || Updatedusername.length < 10) {
                $('#uMobile').css("border-color", "red");
                return false;
            }
        }
        else if (userReg.test(Updatedusername)) {
            $('#uMobile').css("border-color", "red");
            //     $.smallBox({title: "Please enter a valid Name. Name can contain characters (a-z, A-Z).", color: "#e35e00", timeout: 2000, sound: false});
            //alertError("Please enter a valid Name. Name can contain characters (a-z, A-Z).");
            //     //toastr.error("Please enter a valid Name. Name can contain characters (a-z, A-Z).");
            return false;
        } else {
            $('#uMobile').css("border-color", "");
        }

        CFManageCloudAccountsAjaxCall.updateMobileNumber(Updatedusername);
        $('#CFEditMobile').show();
        $('.ProfileContentmobile').show();
        $('.userNameCancel').hide();
        $('.userNameOk').hide();

    });
    $('body').on('mouseup', function (e) {
        var container = $('.ProfileContentmobile');
        if (!container.is(e.target)
            && container.has(e.target).length === 0) {    //console.log("jsf");
            $('.userNameCancel').trigger('click');
            $('body').off('mouseup');
        }
    });
});

$('#move_upgrade').on('click',function(){
    var _result = moveMigration.getMovePricing(),
        _modal = $('#moveMigrationPrices'),
        _tbody = _modal.find('[data-content]');

    _tbody.html('');

    $.each(_result,function(i,e){
        var _html = '';
        if(e.moveChanges != -1) {
            _html += '<tr>';
            _html += '<td style="width:70%">'+ e.moveDataSize+'</td>';
            _html += '<td>$'+ e.moveChanges+'</td>';
            _html += '<td><input type="checkbox" data-currency="'+ e.moveChanges+'"></td>';
        }else{
            _html += '<tr>';
            _html += '<td style="width:70%">'+ e.moveDataSize+'</td>';
            _html += '<td colspan="2" style="text-align:center">For pricing contact <a mailto:support@cloudfuze.com>support@cloudfuze.com</a></td>';
        }

        _html +='</tr>';

        _tbody.append(_html);
    });

    _modal.modal('show');
});

$('#moveMigrationPrices').on('change','input',function(){
    var _this = $(this),
        _status = $(this).prop('checked'),
        _parent = $('#moveMigrationPrices');
    if(_status){
        _parent.find('input').prop('checked',false);
        _this.prop('checked',true);
    }
});

$('#move_migrate_pricing').on('click',function(){
    var _parent = $('#moveMigrationPrices'),
        _check = _parent.find('input:checked'),
        _currency = _check.attr('data-currency');
    if(_check.length == 0){
        console.log('Test');
    }else{
        console.log(_currency);
    }
});

$('#paypalPmnt').on('click',function(){
    var d = new Date();
    var _time = d.toISOString();
    sendGAEvents("Clicked on subscribe button",_time);
    $('#CFmoveStatus1').modal('hide');
    $('#CFmoveStatus').modal('hide');
    var _a = {
        "amount":null,
        "code":"USD",
        "success":"paypalsuccess",
        "cancel":"paypalcancel"
    };
    if($('#CFmoveStatus input[name=subscription]:checked').val()=='annually')//annually
    {
        sendGAEvents("preparing annual payment",_time);
        localStorage.setItem('YearlyAMNT', 49.99);
        _a.amount = 49.99;
        CFPaymentsPaypal.createPmntAnnualRecurring(_a);
    }
    else//monthly
    {
        sendGAEvents("preparing monthly payment",_time);
        localStorage.setItem('MonthlyAMNT', 4.99);
        _a.amount = 4.99;
        CFPaymentsPaypal.createPmntMnthlyRecurring(_a);

    }
});
function checkIsaCustomUserForLogin(_userId) {
    var valid = false;
    var _url = apicallurl + "/report/entuser/validate/"+localStorage.getItem("UserId");
    $.ajax({
        type: "GET",
        url: _url,
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
        },
        success: function (result) {
            //alert("@ checkIsaCustomUser result22 = "+result);
            if(result == true){
                valid = true;
            }else{
                valid = false;
            }
        }
    });
    return valid;
}

