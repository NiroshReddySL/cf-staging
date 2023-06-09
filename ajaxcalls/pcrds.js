var paymenturl = '',
    paymentcreateurl = '',
    Paypal_clientid = '',
    Paypal_clientsecret = '',
    API_username = '',
    API_password = '',
    Signature = '',
    pmntsreturnurl = '',
    createpmntUrl = '';

if (isProd) {
    paymenturl = "https://webapp.cloudfuze.com/proxy/paypal/v1/";
    createpmntUrl = "https://webapp.cloudfuze.com/proxy/pmntrecurring/nvp";
    paymentcreateurl = "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=";
    Paypal_clientid = "AV0PUxAw0yE2pakOsrpSBCp8WhRzuSXNc0js8zlZVHMBQXAdPhxlbVZApBH5";
    Paypal_clientsecret = "EPRV-hB8Dga5obx4VQXlOSJF-o_gdQ6TukYbw65HIQ3k4AQpOpTSTxceWMd9";
    API_username = "payments_api1.cloudfuze.com";
    API_password = 'Q2W7TNW2HNM37S8C';
    Signature = "AyC9Xpk3-XkLtPAIs-lb-8Ht9jtUAbpD8PGwRKLDRkvxG9yH7sRnfPcD";
    pmntsreturnurl = "https%3A%2F%2Fwebapp.cloudfuze.com%2Fpages%2Fsettings.html";

} else if (isSLWeb) {
    paymenturl = "https://slwebapp.cloudfuze.com/proxy/paypal/v1/";
    createpmntUrl = "https://slwebapp.cloudfuze.com/proxy/pmntrecurring/nvp";
    paymentcreateurl = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=";
    Paypal_clientid = "AV0PUxAw0yE2pakOsrpSBCp8WhRzuSXNc0js8zlZVHMBQXAdPhxlbVZApBH5";
    Paypal_clientsecret = "EPRV-hB8Dga5obx4VQXlOSJF-o_gdQ6TukYbw65HIQ3k4AQpOpTSTxceWMd9";
    API_password = "QS8NS7BMZ6G6CDQQ";
    API_username = "merchant_api1.cloudfuze.com";
    Signature = "AFcWxV21C7fd0v3bYYYRCpSSRl31AVVoYfBAPCVjDUuqMMJ9eAlHVCcl";
    pmntsreturnurl = "https%3A%2F%2Fslwebapp.cloudfuze.com%2Fpages%2Fsettings.html";

} else if (isDevweb) {
    paymenturl = "https://devwebapp.cloudfuze.com/proxy/paypal/v1/";
    createpmntUrl = "https://devwebapp.cloudfuze.com/proxy/pmntrecurring/nvp";
    paymentcreateurl = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=";
    Paypal_clientid = "AV0PUxAw0yE2pakOsrpSBCp8WhRzuSXNc0js8zlZVHMBQXAdPhxlbVZApBH5";
    Paypal_clientsecret = "EPRV-hB8Dga5obx4VQXlOSJF-o_gdQ6TukYbw65HIQ3k4AQpOpTSTxceWMd9";
    API_password = "QS8NS7BMZ6G6CDQQ";
    API_username = "merchant_api1.cloudfuze.com";
    Signature = "AFcWxV21C7fd0v3bYYYRCpSSRl31AVVoYfBAPCVjDUuqMMJ9eAlHVCcl";
    pmntsreturnurl = "https%3A%2F%2Fdevwebapp.cloudfuze.com%2Fpages%2Fsettings.html";
    var url = window.location.href;
    if (url.search("/vinay/") >= 0)
        pmntsreturnurl = "https%3A%2F%2Fdevwebapp.cloudfuze.com%2Fdevs%2Fvinay%2Fpages%2Fsettings.html";
}else if (isQA) {
    paymenturl = "https://qawebapp.cloudfuze.com/proxy/paypal/v1/";
    createpmntUrl = "https://qawebapp.cloudfuze.com/proxy/pmntrecurring/nvp";
    paymentcreateurl = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=";
    Paypal_clientid = "AV0PUxAw0yE2pakOsrpSBCp8WhRzuSXNc0js8zlZVHMBQXAdPhxlbVZApBH5";
    Paypal_clientsecret = "EPRV-hB8Dga5obx4VQXlOSJF-o_gdQ6TukYbw65HIQ3k4AQpOpTSTxceWMd9";
    API_password = "QS8NS7BMZ6G6CDQQ";
    API_username = "merchant_api1.cloudfuze.com";
    Signature = "AFcWxV21C7fd0v3bYYYRCpSSRl31AVVoYfBAPCVjDUuqMMJ9eAlHVCcl";
    pmntsreturnurl = "https%3A%2F%2Fqawebapp.cloudfuze.com%2Fpages%2Fsettings.html";
}

//APP-80W284485P519543T
//pchvramesh_api1.gmail.com
//5RHLZ7CF2YU7727W
//AFcWxV21C7fd0v3bYYYRCpSSRl31AZelWT0HKDLu.WRFFukFrGXWLdHf