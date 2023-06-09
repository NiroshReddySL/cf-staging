var notifyTime = 4000;
var notifyError = 2000;

var isDevweb = /devweb/i.test(hostName);
var isSLWeb = /slweb/i.test(hostName);
var isSubDomain = /.webapp/i.test(hostName);
var isQAWebApp = /.qawebapp/i.test(hostName);
var demos = /demoscli/i.test(hostName);
var environment = "";
var _iframeUrl = "";
if (isDevweb) {
  environment = "devwebapp";
  _iframeUrl = defaultDomain;
} else if (isDemo) {
  environment = "demowebapp";
  _iframeUrl = defaultDomain;
} else if (isQAWebApp) {
  environment = "devwebapp";
  _iframeUrl = defaultDomain;
} else if (isSLWeb) {
  environment = "slwebapp";
  _iframeUrl = "https://devwebapp.cloudfuze.com/";
} else if (isSubDomain && !demos) {
  environment = "devwebapp";
  _iframeUrl = defaultDomain;
} else {
  _iframeUrl = defaultDomain;
}

var ADD_CLOUD = "Add Cloud";
function getHost() {
  var html = "<iframe id='testFram'></iframe>";
  $("#testFram").remove();
  $("body").append(html);
  $("#testFram").attr(
    "src",
    _iframeUrl + "oauth/oauth.html?session=" + apicallurl
  );
  localStorage.setItem("OauthProcess", "Inprogress");
}
/////===================constants declaration================================
var uId = localStorage != null ? localStorage.getItem("UserId") : "";
var _hostname = encodeURIComponent("https://" + window.location.host + "/");
var redirectURL =
  redirectUrl +
  "/oauth/oauth.html?ver=2104&uid=" +
  uId +
  "&hostname=" +
  _hostname +
  "&boxtype="; //TODO encode using js standard method - Rat (Done)
var googleStorageRedirect =
  window.location.origin +
  "/oauth/oauth.html?ver=2104&uid=" +
  uId +
  "&hostname=" +
  _hostname +
  "&boxtype=";
var egnyteRedirect =
  window.location.origin +
  "/oauth/oauth.html?ver=2104&uid=" +
  uId +
  "&hostname=" +
  _hostname +
  "&boxtype="; //TODO encode using js standard method - Rat(Done)
var egnyteBusinessRedirect =
  window.location.origin +
  "/oauth/oauth.html?ver=2104&uid=" +
  uId +
  "&hostname=" +
  _hostname +
  "&boxtype="; //TODO encode using js standard method - Rat(Done)
var ecmMsg =
  '<div style="text-align:center;font-size: 15px;">ECM and Private Cloud Storage is supported in the CloudFuze enterprise version. Please contact us at <a style="color:#1C47CF;text-shadow: none;" href="mailto:sales@cloudfuze.com">sales@cloudfuze.com</a> for this version.</div>';
////====================end of constants declaration=========================
/////=======================box selection events===================================
$("#CiscoSparkCloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Cisco Spark");
    window.open(
      redirectURL + "SPARK_BUSINESS",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});

$("#doOauth_GDrive").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Google Drive");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Google Drive"]);
    window.open(
      redirectURL + "G_DRIVE",
      "_blank",
      "width=750px,height=750px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#googleCloudStorage").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Google Cloud Storage");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Google Drive"]);
    window.open(
      googleStorageRedirect + "GOOGLE_STORAGE",
      "_blank",
      "width=750px,height=750px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});

$("#doOauth_GSuite").click(function () {
  var cldname = "gSuit";
  isCustUser(cldname);

  // $('#Model').modal('show');
  //$('#gsuitemarket').modal('show');
});

$("#gsuitemarket").on("click", '[data-action="addgsuite"]', function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Google SUITE");
    // zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Google SUITE");
    $("#gsuitemarket").modal("hide");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Google Drive"]);
    window.open(
      redirectURL + "G_SUITE",
      "_blank",
      "width=750px,height=750px,scrollbars=1"
    );
  }
});

$("#gsuitemarket").on("click", '[data-action="redirectStore"]', function () {
  if (window["MarketPlaceWindow"]) {
    delete window["MarketPlaceWindow"];
  }
  //var url = 'https://chrome.google.com/webstore/detail/cloudfuze-for-work-dev/jmkmkdmigepilgakahefbcmoflfmooin?hl=en-US';
  var url =
    "https://gsuite.google.com/marketplace/app/cloudfuze_for_production/674570916653?pann=cwsdp&hl=en-US";

  if (isQA) {
    url =
      "https://chrome.google.com/webstore/detail/cloudfuze-for-work-qa/kjmgpllcdgljemiobfngnfbgajanedeg?hl=en-US";
  } else if (demos) url = "https://chrome.google.com/webstore/detail/clkfabmomgpoiicbgcfmfeljjidgfknl?hl=en-US";
  window["MarketPlaceWindow"] = window.open(url, "_blank");
});

$("#doOauth_GTeam").click(function () {
  var cldname = "gTeam";
  isCustUser(cldname);

  // $('#Model').modal('show');
  //$('#gsuitemarketTeam').modal('show');
});
$("#doOauth_GTeam_singleUsr").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Team Drive");
    window.open(
      redirectURL + "SHARED_DRIVES",
      "_blank",
      "width=750px,height=750px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#gsuitemarketTeam").on("click", '[data-action="addgteam"]', function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Google Team");
    $("#gsuitemarketTeam").modal("hide");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Google Drive"]);
    window.open(
      redirectURL + "GOOGLE_SHARED_DRIVES",
      "_blank",
      "width=750px,height=750px,scrollbars=1"
    );
  }
});
$(document).on("click", "#gsuitemarketTeam a.blue", function () {
  if (window["MarketPlaceWindow"]) {
    delete window["MarketPlaceWindow"];
  }
  //var url = 'https://chrome.google.com/webstore/detail/cloudfuze-for-work-dev/jmkmkdmigepilgakahefbcmoflfmooin?hl=en-US';
  var url =
    "https://gsuite.google.com/marketplace/app/cloudfuze_for_production/674570916653?pann=cwsdp&hl=en-US";

  if (isQA) {
    url =
      "https://chrome.google.com/webstore/detail/cloudfuze-for-work-qa/kjmgpllcdgljemiobfngnfbgajanedeg?hl=en-US";
  } else if (demos) url = "https://chrome.google.com/webstore/detail/clkfabmomgpoiicbgcfmfeljjidgfknl?hl=en-US";
  window["MarketPlaceWindow"] = window.open(url, "_blank");
});

$("#doOauth_dropbox").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Drop Box");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Drop Box"]);
    window.open(
      redirectURL + "DROP_BOX",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#doOauth_Egnyte").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Egnyte");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Egnyte"]);
    window.open(
      egnyteRedirect + "EGNYTE_STORAGE",
      "_blank",
      "width=500px,height=550px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#doOauth_Egnyte_Business").click(function () {
  var cldname = "egnyte_business";
  isCustUser(cldname);
});
$("#doVisible_textBox").click(function () {
  getHost(domainUrl);
  $("#displayEmail").css("visibility", "visible");
  $("#myModal button").trigger("click");
});
$("#doOauth_SkyDrive").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "One Drive");
    window.open(
      redirectURL + "ONEDRIVE",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }

  //$("#oAuthDisplayName").val('');
  //$(".errorMsg").text("").css({"display":"none"});
  //$('#oneDriveName').modal('show');
  //$('#myModal button').trigger('click');
});
$("#doOauth_ShareFile").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Share File");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Share File"]);
    window.open(
      redirectURL + "SHAREFILE",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#doOauth_Copy").click(function () {
  getHost(domainUrl);
  window.open(redirectURL + "copy", "_blank", "width=500px,height=500px");
  $("#myModal button").trigger("click");
});
$("#doOauth_Box").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Box");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Box"]);
    window.open(
      redirectURL + "BOX",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#doOauth_Box_Business").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Box_Business");
    // zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Box_Business");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Box_Business"]);
    window.open(
      redirectURL + "BOX_BUSINESS",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#doOauth_ShareFile_Admin").click(function () {
  if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Share File");
    window.open(
      redirectURL + "SHAREFILE_BUSINESS",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
});
$("#orange_credentials,#orange_cloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Orange");
    getHost(domainUrl);
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Google Drive"]);
    window.open(
      redirectURL + "ORANGE",
      "_blank",
      "width=750px,height=750px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
  /*if(environment == "devwebapp" || environment == "slwebapp") {
     getHost(domainUrl);
     //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Google Drive"]);
     window.open(redirectURL + 'ORANGE', '_blank', 'width=750px,height=750px,scrollbars=1');
     $('#myModal button').trigger('click');
     }else{*/

  /*$('#appendCloudContent').html("");
     $('#OauthButtons').html('');
     $('#appendCloudContent').html(ecmMsg);
     $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
     $('#myFTPOauthModel').modal('show');*/
  /*}*/
});
$("#SALES_FORCECloud").on("click", function () {
  $("#OauthButtons").html("");
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "SalesForce");
    window.open(
      redirectURL + "SALES_FORCE",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
    $("#myFTPOauthModel").modal("show");
  }
});
$("#doOauth_dropbox_business").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Drop Box Business");
    // zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"Drop Box Business");
    window.open(
      redirectURL + "DROPBOX_BUSINESS",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myModal button").trigger("click");
  }
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Drop Box"]);
  // if(environment == "devwebapp" || environment == "slwebapp" || environment == "demowebapp"){
  //     getHost(domainUrl);
  //     sendGAEvents(ADD_CLOUD,"Drop Box Business");
  //     window.open(redirectURL + 'DROPBOX_BUSINESS', '_blank', 'width=500px,height=500px');
  //     $('#myModal button').trigger('click');
  // }else{
  //     $('#appendCloudContent').html('');
  //     $('#OauthButtons').html('');
  //     $('#appendCloudContent').html(ecmMsg);
  //     $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
  //     $('#myFTPOauthModel').modal('show');
  // }
});
$("#Onedrive_Business").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "OneDrive For Business");
    window.open(
      redirectURL + "ONEDRIVE_BUSINESS",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
$("#Onedrive_Business_Admin").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "OneDrive For Business Admin");
    // zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,"OneDrive For Business Admin");
    window.open(
      redirectURL + "ONEDRIVE_BUSINESS_ADMIN",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
$("#onedrive_business_hybrid").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "OneDrive For Business Hybrid");
    window.open(
      redirectURL + "ONEDRIVE_BUSINESS_ADMIN_HYBRID",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});

$("#AmazonCloudStorage").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Amazon Storage");
    window.open(
      redirectURL + "AMAZON_STORAGE",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
    $("#myFTPOauthModel").modal("hide");
  }
});
$("#sharepoint_online").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Sharepoint Online");
    window.open(
      redirectURL + "SHAREPOINT_ONLINE",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
$("#sharepoint_online_hybrid").on("click", function () {
  var cldname = "spoh";
  isCustUser(cldname);
});
$("#sharepoint_online_hybridconsumer").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Sharepoint Online Hybrid");
    window.open(
      redirectURL + "SHAREPOINT_CONSUMER_HYBRID",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
$("#sharepoint_online_consumer").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Sharepoint Online");
    window.open(
      redirectURL + "SHAREPOINT_ONLINE_CONSUMER",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
$("#slackCloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Slack");
    window.open(
      redirectURL + "SLACK",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});

// Google Chat Redirect Start's
$("#googleChatCloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "GOOGLE_CHAT");
    window.open(
      redirectURL + "GOOGLE_CHAT",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
// Google Chat Redirect End's

$("#teamsCloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Microsoft Teams");
    window.open(
      redirectURL + "MICROSOFT_TEAMS",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});

$("#outlookMail").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "OUTLOOK");
    window.open(
      redirectURL + "OUTLOOK",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});

$("#gmailMail").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "GMAIL");
    window.open(
      redirectURL + "GMAIL",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});

$("#miroCloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    getHost(domainUrl);
    sendGAEvents(ADD_CLOUD, "Miro");
    window.open(
      redirectURL + "MIRO",
      "_blank",
      "width=500px,height=500px,scrollbars=1"
    );
  }
});
$("#muralCloud").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    //	('#appendCloudContent').html('');
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    $("#errorOnboxSubmit").text("");
    let redirectUri = window.location.origin + "/oauth/oauth.html";
    if (localStorage.muralOauthKeys === "null") {
      $("#myFTPOauthModel").modal();
      var htmlContent =
        '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Redirect Url</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;display: flex;gap: 0px;"><input class="form-control" type="text" placeholder="Enter display name" id="muralRedirectUrl" value=' +
        redirectUri +
        ' style="height: 36px;border-bottom-right-radius: 0px !important;border-top-right-radius: 0px !important;" readonly/><button style="border: none;padding: 0 8px;border-bottom-right-radius: 5px;border-top-right-radius: 5px;outline: none;" id="copyRedirectUri">Copy</button></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Client id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Client id" id="muralClientId" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Client secret<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Client secret" id="muralClientSecret" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
      $("#appendCloudContent").append(htmlContent);
      $("#OauthButtons").append(
        '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="saveMuralClientId" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Save</a>'
      ); //getHost(domainUrl);
    } else {
      sendGAEvents(ADD_CLOUD, "MURAL");
      window.open(
        redirectURL + "MURAL",
        "_blank",
        "width=500px,height=500px,scrollbars=1"
      );
    }
  }
});

$("#ftpCredntialsvisible").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show FTP");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show FTP"]);
    $("#OauthButtons").html("");
    $("#appendCloudContent").html("");
    $("#errorOnboxSubmit").text("");
    var optionsList = "";
    var ftposTypes = [
      "UNIX",
      "VMS",
      "WINDOWS",
      "OS/2",
      "OS/400",
      "AS/400",
      "MVS",
      "TYPE: L8",
      "NETWARE",
      "MACOS PETER",
    ];
    for (var i = 0; i < ftposTypes.length; i++) {
      optionsList += "<option>" + ftposTypes[i] + "</option>";
    }
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="oAuthDisplayName" placeholder="Enter display name." style="height:36px;"/><img id="helpImg1" src="../img/PNG/help.png" data-toggle="tooltip" data-placement="bottom" style="margin-top: -8px;margin-left: 8px;position: absolute;left: 100%;top: 50%;"></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Username<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="userIdFTP" placeholder="Enter Username" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" id="ftpPassword" placeholder="Enter password." style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;" id="NameofAddress">Server<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="IpAddress" placeholder="eg : myhost.com" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Port Number<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="portNum" placeholder="eg : 21"/><img id="helpImg2" src="../img/PNG/help.png" style="margin-top: -8px;margin-left: 8px;position: absolute;left: 100%;top: 50%;" data-toggle="tooltip" data-placement="bottom" ></div></div><div id="errorMsg" style="color:red"><span></span></div>';
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addFTPCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color: #ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
    $("#appendCloudContent").append(htmlContent);
    $("#OAuthBoxType").val("FTP");
    //$('#NameofAddress').text('Server');
    $("#portNum").val("21");
    //$('.addCloudCredPopup:eq( 4 )').append("<br><b>Enter the port number if you are using other than 21 as your FTP port</b>")
    $("#userIdFTP").focusout(function () {
      var path = "/home/" + $("#userIdFTP").val();
      $("#ftpRoot").val(path);
    });
  }
});

$("#ftpBusinessCredntialsvisible").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show FTP");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show FTP"]);
    $("#OauthButtons").html("");
    $("#appendCloudContent").html("");
    $("#errorOnboxSubmit").text("");
    var optionsList = "";
    var ftposTypes = [
      "UNIX",
      "VMS",
      "WINDOWS",
      "OS/2",
      "OS/400",
      "AS/400",
      "MVS",
      "TYPE: L8",
      "NETWARE",
      "MACOS PETER",
    ];
    for (var i = 0; i < ftposTypes.length; i++) {
      optionsList += "<option>" + ftposTypes[i] + "</option>";
    }
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="oAuthDisplayName" placeholder="Enter display name." style="height:36px;"/><img id="helpImg1" src="../img/PNG/help.png" data-toggle="tooltip" data-placement="bottom" style="margin-top: -8px;margin-left: 8px;position: absolute;left: 100%;top: 50%;"></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Username<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="userIdFTP" placeholder="Enter Username" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" id="ftpPassword" placeholder="Enter password." style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;" id="NameofAddress">Server<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="IpAddress" placeholder="eg : myhost.com" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Port Number<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="portNum" placeholder="eg : 21"/><img id="helpImg2" src="../img/PNG/help.png" style="margin-top: -8px;margin-left: 8px;position: absolute;left: 100%;top: 50%;" data-toggle="tooltip" data-placement="bottom" ></div></div><div id="errorMsg" style="color:red"><span></span></div>';
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addFTPCloudBusiness" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color: #ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
    $("#appendCloudContent").append(htmlContent);
    $("#OAuthBoxType").val("FTP");
    //$('#NameofAddress').text('Server');
    $("#portNum").val("21");
    //$('.addCloudCredPopup:eq( 4 )').append("<br><b>Enter the port number if you are using other than 21 as your FTP port</b>")
    $("#userIdFTP").focusout(function () {
      var path = "/home/" + $("#userIdFTP").val();
      $("#ftpRoot").val(path);
    });
  }
});

$("#webDavCredntialsvisible").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show WEB Dav");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show WEB Dav"]);
    $("#OauthButtons").html("");
    $("#appendCloudContent").html("");
    var htmlContent =
      '<div><div class="addCloudCredPopup"><span id="NameofAddress">Enter WebDAV user id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="emailAddressWebDav" placeholder="Enter email."/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="password" id="passwordWebDav" placeholder="Enter password."/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV display name</span></div><div class="addCloudCredPopup"><input type="text" id="webDavDisplayName" placeholder="Enter display name."/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV url</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="webDavURL" placeholder="Enter url"/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDav Root Id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter Root Id" id="webDavRoot" value="/"></div><div id="errorMsg" style="color:red"><span></span></div></div>';
    //var htmlContent = '<div><div class="addCloudCredPopup"><span id="NameofAddress">Enter WebDAV user id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="emailAddressWebDav" placeholder="Enter email."/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="password" id="passwordWebDav" placeholder="Enter password."/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV display name</span></div><div class="addCloudCredPopup"><input type="text" id="webDavDisplayName" placeholder="Enter display name."/></div></div><div><div class="addCloudCredPopup"><span>Select WebDAV Protocol</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><select id="webdavProtocol" style="width:78%;"><option value="https://" selected="selected">HTTPS</option><option value="http://">HTTP</option></select></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV Port Number</span></div><div class="addCloudCredPopup"><input type="text" id="webDavPortNum" value="443"/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDAV url</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="webDavURL" placeholder="Ex:webdav.example.com"/></div></div><div><div class="addCloudCredPopup"><span>Enter WebDav Root Id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter Root Id" id="webDavRoot" value="/"></div><div id="errorMsg" style="color:red"><span></span></div></div>';
    $("#appendCloudContent").append(htmlContent);
    $("#OAuthBoxType").val("WEBDAV");
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addWebDavCloud">Add</a>'
    );
    $("#NameofAddress").text("Enter WebDAV user id");
  }
  // $('#webdavProtocol').change(function(){
  //     var _a= $('#webdavProtocol').find(":selected").text();
  //     if(_a=="HTTPS")
  //         $('#webDavPortNum').val(443);
  //     if(_a=="HTTP")
  //         $('#webDavPortNum').val(80);
  // });
});
$("#CMISvisible").click(function () {
  sendGAEvents(ADD_CLOUD, "Show CMIS");
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show CMIS"]);
  $("#OauthButtons").html("");
  $("#appendCloudContent").html("");
  var optionsList = "";
  var cmisProtocols = ["ATOMPUB", "BROWSER"];
  for (var i = 0; i < cmisProtocols.length; i++) {
    optionsList += "<option>" + cmisProtocols[i] + "</option>";
  }
  var htmlContent =
    '<div id="appendCloudContent"><div class="addCloudCredPopup"><span class="pull-left">Enter CMIS user id</span><span style="color:red;">*</span></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="cmisDisplayName"></div><div class="addCloudCredPopup"><span>Enter CMIS password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="password" placeholder="Password" id="CmiPassword"></div><div class="addCloudCredPopup">Enter repository name</div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Repository name" id="cmisExtraName"></div><div class="addCloudCredPopup"><span>Enter CMIS URL</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter CMIS URL" id="cmisURL"></div><div class="addCloudCredPopup">Select</div><div class="addCloudCredPopup"><select id="osList" style="width: 204px;"><option>ATOMPUB</option><option>BROWSER</option></select></div><div id="errorMsg" style="color:red"><span></span></div></div>';
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addCMISCloud">Add</a>'
    );
    $("#appendCloudContent").append(htmlContent);
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});
/********Sugar Sync*************/
$("#SugarSync").on("click", function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show Sugar Sync");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Sugar Sync"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    var htmlContent =
      '<div><div class="addCloudCredPopup"><span class="pull-left">Enter SugarSync user id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="SFileuid" placeholder="SugarSync User Id"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter SugarSync Password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="password" id="SFilePwd" placeholder="SugarSync Password"/></div><div><div class="addCloudCredPopup"><span class="pull-left">Enter Display Name</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="SFileDisp" placeholder="Enter Display Name"/></div><div class="addCloudCredPopup"><span id="NameofAddress">Enter SugarSync application id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="SFileAppId" placeholder="SugarSync Application ID"/></div></div><div><div class="addCloudCredPopup"><span>Enter SugarSync access key</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="SFileAkey" placeholder="SugarSync Accesskey"/></div></div><div></div><div class="addCloudCredPopup"><span>Enter SugarSync private access key</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input placeholder="SugarSync Private Accesskey" type="text" id="SFilePkey"/></div></div><div></div><div id="errorMsg" style="color:red"><span></span></div></div>';
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addSugarSync">Add</a>'
    );
    $("#appendCloudContent").append(htmlContent);
  }
});
/********Sugar Sync*************/
//********************* add alfresco account ****************** //
$("#alfresco").click(function () {
  sendGAEvents(ADD_CLOUD, "Show Alfresco");
  /// /_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Alfresco"]);
  $("#appendCloudContent").html("");
  $("#OauthButtons").html("");
  var htmlContent =
    '<div id="appendCloudContent"><div class="addCloudCredPopup"><span class="pull-left">Enter Alfresco user id</span>' +
    '<span style="color:red;">*</span></div><div class="addCloudCredPopup">' +
    '<input class="pull-left" type="text" placeholder="Enter user id" id="alfrescoDisplayName"></div><div class="addCloudCredPopup">' +
    '<span>Enter Alfresco password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup">' +
    '<input class="pull-left" type="password" placeholder="Password" id="alfrescoPassword"></div>' +
    '<div class="addCloudCredPopup">Enter repository name</div><div class="addCloudCredPopup">' +
    '<input class="pull-left" type="text" placeholder="Repository name" id="alfrescoExtraName"></div><div class="addCloudCredPopup">' +
    '<span>Enter URL</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup">' +
    '<input class="pull-left" type="text" placeholder="Enter URL" id="alfrescoURL"></div><div class="addCloudCredPopup">' +
    '<span>Enter root folder id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup">' +
    '<input class="pull-left" type="text" value="/" placeholder="Enter root folder id" id="alfrescoRoot"></div>' +
    '<div class="addCloudCredPopup">Select</div>' +
    '<div class="addCloudCredPopup"><select id="osList" style="width: 204px;"><option>ATOMPUB</option><option>BROWSER</option></select></div>' +
    '<div id="errorMsg" style="color:red"><span></span></div></div>';
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addAlfrescoCloud">Add</a>'
    );
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});
//******************* end alfresco *******************//
//******************** documentum Start ***************//
$("#documentum").click(function () {
  sendGAEvents(ADD_CLOUD, "Show Documentum");
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Documentum"]);
  $("#appendCloudContent").html("");
  $("#OauthButtons").html("");
  var htmlContent =
    '<div id="appendCloudContent"><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="DocumentumDisplayName"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter documentum user id<strong style="color:red;">*</strong></span></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter your user id" id="DocumentumUserName"></div><div class="addCloudCredPopup"><span>Enter documentum password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="password" placeholder="Password" id="DocumentumPassword"></div><div class="addCloudCredPopup">Enter repository name<strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Repository name" id="DcoumentumExtraName"></div><div class="addCloudCredPopup"><span>Enter documentum URL</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter URL" id="DocumentumURL"></div><div id="errorMsg" style="color:red"><span></span></div></div>';
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    $("#appendCloudContent").append(htmlContent);
    $("#DcoumentumExtraName").val("MyRepo");
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addDocumentumCloud">Add</a>'
    );
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});
$("#cloudian").click(function () {
  sendGAEvents(ADD_CLOUD, "Show Cloudian");
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Cloudian"]);
  $("#appendCloudContent").html("");
  $("#OauthButtons").html("");
  var htmlContent =
    '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="cloudianDisplayName"/></div><div class="addCloudCredPopup"><span>Access Key ID</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" placeholder="Access Key ID" id="cloudianaccessToken"/></div><div class="addCloudCredPopup"><span class="pull-left">Secret access key</span><strong style="color:red;">*</strong></div>   <div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="refresh token" id="eucasecretToken"/></div><div class="addCloudCredPopup"><span class="pull-left">Cloud url</span><strong style="color:red;">*</strong></div> <div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Url" id="eucaurl"/></div><div id="errorMsg" style="color:red"><span></span></div></div>';
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addeucacloudian">Add</a>'
    );
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});
$("#centurylink").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show Centurylink");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Cloudian"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    var htmlContent =
      '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="centurylinkDisplayName"/></div><div class="addCloudCredPopup"><span>Access Key ID</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" placeholder="Access Key ID" id="centurylinkaccessToken"/></div><div class="addCloudCredPopup"><span class="pull-left">Secret access key</span><strong style="color:red;">*</strong></div>   <div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="refresh token" id="eucasecretToken"/></div><div class="addCloudCredPopup"><span class="pull-left">Cloud url</span><strong style="color:red;">*</strong></div> <div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Url" id="eucaurl"/></div><div id="errorMsg" style="color:red"><span></span></div></div>';
    //if(environment == "devwebapp" || environment == "slwebapp"){
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addeucacentuarylink">Add</a>'
    );
  }
  // }else{
  //     $('#appendCloudContent').html(ecmMsg);
  //     $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
  // }
});

$("#OauthButtons").on("click", "#addeucacentuarylink", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName;
  accessToken = "s3:" + $("#eucasecretToken").val() + ":CENTURYLINK";
  refreshToken = $("#eucaurl").val().trim();
  userDisplayName = $("#centurylinkDisplayName").val().trim();
  clouduserId = "CENTURYLINK|" + $("#centurylinkaccessToken").val();
  if (
    accessToken.length > 0 &&
    refreshToken.length > 0 &&
    clouduserId.length > 0
  ) {
    sendGAEvents(ADD_CLOUD, "Add Cloudian");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Cloudian"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "CENTURYLINK",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});
//******************** documentum end ***************//
/**********Share Point 2013********************/
$("#sharepoint_2013").on("click", function () {
  var cldname = "sharePoint_2013";
  isCustUser(cldname);
  /*  sendGAEvents(ADD_CLOUD,"Show Share Point 2013");
     //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Share Point 2013"]);
     $('#appendCloudContent').html('');
     $('#OauthButtons').html('');
     $('#errorOnboxSubmit').text('');
     var htmlContent = '<div><div class="addCloudCredPopup"><span class="pull-left">Enter SharePoint UserName</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" id="SPUname" placeholder="Enter SharePoint User Name"/></div><div class="addCloudCredPopup"><span>Enter SharePoint Password</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="password" placeholder="Enter SharePoint Password" id="SPPassword"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter SharePoint Domain</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter SharePoint Domain" id="SPDomain"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter SharePoint URL</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter SharePoint URL" id="SPUrl"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter SharePoint List</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter SharePoint List" id="SPList" value="Documents"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter Root Directory</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter Root Directory" id="SPRoot" value="/Shared Documents"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter Display Name</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter Display Name" id="SPDSPName"/></div><div id="errorMsg" style="color:red"><span></span></div></div>';
     if(environment == "devwebapp"){// || environment == "slwebapp"
         $('#appendCloudContent').append(htmlContent);
         $('#OauthButtons').append('<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addSharePoint">Add</a>');
     }else{
         $('#appendCloudContent').html(ecmMsg);
         $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
     } */
});
/**********Share Point 2013********************/
$("#sharepoint_2010").on("click", function () {
  var cldname = "sharePoint_2010";
  isCustUser(cldname);
  /*  sendGAEvents(ADD_CLOUD,"Show SharePoint 2010");
     //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Share Point 2010"]);
     $('#appendCloudContent').html('');
     $('#OauthButtons').html('');
     $('#errorOnboxSubmit').text('');
     var htmlContent = '<div><div class="addCloudCredPopup">' +
         '<span class="pull-left">Enter SharePoint UserName</span>' +
         '<strong style="color:red;">*</strong></div>' +
         '<div class="addCloudCredPopup">' +
         '<input type="text" id="SPUname" placeholder="Enter SharePoint User Name"/></div>' +
         '<div class="addCloudCredPopup">' +
         '<span>Enter SharePoint Password</span><strong style="color:red;">*</strong></div>' +
         '<div class="addCloudCredPopup"><input type="password" placeholder="Enter SharePoint Password" id="SPPassword"/></div>' +
         '<div class="addCloudCredPopup"><span class="pull-left">Enter SharePoint URL</span><strong style="color:red;">*</strong></div>' +
         '<div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter SharePoint URL" id="SPUrl"/></div>' +
         '<div id="errorMsg" style="color:red"><span></span></div></div>';
     if(environment == "devwebapp"){// || environment == "slwebapp"
         $('#appendCloudContent').append(htmlContent);
         $('#OauthButtons').append('<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addSharePoint2010">Add</a>');
     }else{
         $('#appendCloudContent').html(ecmMsg);
         $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
     }*/
});
$("#amazonCredntialsvisible").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show Amazon");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Amazon"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    $("#errorOnboxSubmit").text("");
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="amazonDisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Access key id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Access key id" id="amazonaccessToken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Secret access key<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Secret access key" id="amazonRefreshToken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Bucket Name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="amazonBucketName" placeholder="Bucket name" value="*" style="height: 36px;"/><img src="../img/PNG/help.png" style="margin-top: -8px;margin-left: 8px;position:absolute;top:50%;left:100%;" title="* will sync all the Buckets.\n If you want a specific Bucket to sync,\n please enter Bucket Name." ></div></div><div id="errorMsg" style="color:red"><span></span></div>';
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addAmazonCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
  }
});
$("#amazonGlacierCredntialsvisible").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show Wasabi");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Amazon"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    $("#errorOnboxSubmit").text("");
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Email id <strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="glacierEmailId" placeholder="Enter email id" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Access key id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Access Key id" id="glacieraccessToken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="glacierDisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Secret access key<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Refresh token" id="glacierRefreshToken" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
    $("#appendCloudContent").append(htmlContent);

    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addAmazonGlacierCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
  }
});
/* Amazon s3 business cloud */
$("#amazonCredntialsvisible1").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show Amazon");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Amazon"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    $("#errorOnboxSubmit").text("");
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="amazonDisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Access key id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Access key id" id="amazonaccessToken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Secret access key<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" placeholder="Secret access key" id="amazonRefreshToken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Bucket Name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="amazonBucketName" placeholder="Bucket name" value="*" style="height: 36px;"/><img src="../img/PNG/help.png" style="margin-top: -8px;margin-left: 8px;position:absolute;top:50%;left:100%;" title="* will sync all the Buckets.\n If you want a specific Bucket to sync,\n please enter Bucket Name." ></div></div><div id="errorMsg" style="color:red"><span></span></div>';
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addAmazonCloud1" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
  }
});
/* Wasabi*/
$("#wasabiCredntialsvisible").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    sendGAEvents(ADD_CLOUD, "Show Wasabi");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Amazon"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    $("#errorOnboxSubmit").text("");
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Email id <strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="wasabiEmailId" placeholder="Enter email id" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Access key id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Access Key id" id="wasabiaccessToken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="wasabiDisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Secret access key<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Refresh token" id="wasabiRefreshToken" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
    $("#appendCloudContent").append(htmlContent);

    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addWasabiCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
  }
});

/*Eucalyptus Code*/
$("#eucaCredntialsvisible").click(function () {
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Eucalyptus"]);
  sendGAEvents(ADD_CLOUD, "Show Eucalyptus");
  $("#appendCloudContent").html("");
  $("#OauthButtons").html("");
  var htmlContent =
    '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="eucaDisplayName"/></div><div class="addCloudCredPopup"><span>Access Key ID</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup">   <input type="text" placeholder="Access Key ID" id="eucaaccessToken"/></div><div class="addCloudCredPopup"><span class="pull-left">Secret access key</span><strong style="color:red;">*</strong></div>   <div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="refresh token" id="eucasecretToken"/></div><div class="addCloudCredPopup"><span class="pull-left">Cloud url</span><strong style="color:red;">*</strong></div> <div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Url" id="eucaurl"/></div><div id="errorMsg" style="color:red"><span></span></div></div>';
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addeucaCloud">Add</a>'
    );
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});
///////////================= end of box selection events===========================

$("#Azurevisible").click(function () {
  var cldname = "AZURE_OBJECT_STORAGE";
  isCustUser(cldname);
});
$("#GenObjectCloud").click(function () {
  sendGAEvents(ADD_CLOUD, "Show Object Storage");
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Object Storage"]);
  $("#appendCloudContent").html("");
  $("#OauthButtons").html("");
  var array = ["Cloudian", "Eucalyptus", "HP Helion"];
  var cloudList = "<option>Select Cloud</option>";
  $.each(array, function (i, a) {
    cloudList = cloudList + "<option>" + a + "</option>";
  });
  var htmlContent =
    '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="genObj_DisplayName"/></div><div class="addCloudCredPopup"><span>Enter access id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" placeholder="Enter access id" id="genObj_access_id"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter secret key</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter secret key" id="genObj_secret_key"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud url</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter cloud url" id="genObj_url"/></div><div class="addCloudCredPopup"><span class="pull-left">Choose cloud</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><select id="osList" style="width: 204px">' +
    cloudList +
    '</select></div><div id="errorMsg" style="color:red"><span></span></div></div>';
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addGenObjCloud">Add</a>'
    );
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});
$("#NTLMCloud").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Show NFS Storage");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show NFS Storage"]);
    $("#appendCloudContent").html("");
    $("#OauthButtons").html("");
    var htmlContent =
      '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;">Display name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="NTLM_DisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;">Cloud user id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter cloud user id" id="NTLM_cloud_id" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;">Password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" placeholder="Enter cloud password" id="NTLM_cloud_pwd" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;">Root folder path<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter root folder path" id="NTLM_access_id" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';

    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addNTLMCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color: #ffffff;font-size: 16px;background: #0062FF;">Add</a>'
    );
  }
});

$("#NTLMCloudAdmin").click(function () {
  sendGAEvents(ADD_CLOUD, "Show NFS Admin Storage");
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show NFS Storage"]);
  $("#appendCloudContent").html("");
  $("#OauthButtons").html("");
  var htmlContent =
    '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span><strong style="color:red;padding-left:3%;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter display name" id="NTLM_DisplayName"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud user id</span><strong style="color:red;padding-left:3%;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="text" placeholder="Enter cloud user id" id="NTLM_cloud_id"/></div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud password</span><strong style="color:red;padding-left:3%;">*</strong></div><div class="addCloudCredPopup"><input class="pull-left" type="password" placeholder="Enter cloud password" id="NTLM_cloud_pwd"/></div><div class="addCloudCredPopup"><span>Enter root folder id</span><strong style="color:red;">*</strong></div><div class="addCloudCredPopup"><input type="text" placeholder="Enter root folder id" id="NTLM_access_id"/></div><div id="errorMsg" style="color:red"><span></span></div></div>';
  //if(environment == "devwebapp" || environment == "slwebapp"){
  $("#appendCloudContent").append(htmlContent);
  $("#OauthButtons").append(
    '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addNTLMCloudAdmin">Add</a>'
  );
  // }else{
  //     $('#appendCloudContent').html(ecmMsg);
  //     $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
  // }
});

$("#SMBAdmin").click(function () {
  var cldname = "network_fileshares";
  isCustUser(cldname);
});
$("#myFTPOauthModel").on("keyup", ".smbValues", function () {
  if (
    $("#NTLM_DisplayName").val() != "" &&
    $("#NTLM_hostName").val() != "" &&
    $("#NTLM_access_id").val() != "" &&
    $("#NTLM_cloud_id").val() != "" &&
    $("#NTLM_cloud_pwd").val() != ""
  ) {
    $("#addSMBCloudAdmin").css("cursor", "pointer");
    $("#addSMBCloudAdmin").css("pointer-events", "visible");
    $("#addSMBCloudAdmin").addClass("blue");
  } else {
    $("#addSMBCloudAdmin").css("cursor", "not-allowed");
    $("#addSMBCloudAdmin").css("pointer-events", "none");
    $("#addSMBCloudAdmin").removeClass("blue");
  }
});

$("#doOauth_Syncplicity").click(function () {
  //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Drop Box"]);
  getHost(domainUrl);
  sendGAEvents(ADD_CLOUD, "syncplicity");
  window.open(
    redirectURL + "SYNCPLICITY",
    "_blank",
    "width=500px,height=500px,scrollbars=1"
  );
  $("#myModal button").trigger("click");
});

$("#CIFSCloud").click(function () {
  var cldname = "cifsCloud";
  isCustUser(cldname);
  /* sendGAEvents(ADD_CLOUD,"Show CFIS Storage");
     //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show NFS Storage"]);
     $('#appendCloudContent').html('');
     $('#OauthButtons').html('');
     var htmlContent = '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span></div>' +
         '<div class="addCloudCredPopup">' +
         '<input class="pull-left" type="text" placeholder="Enter display name" id="CFIS_DisplayName"/></div>' +
         '<div class="addCloudCredPopup"><span class="pull-left">Enter cloud user id</span>' +
         '<strong style="color:red;">*</strong></div><div class="addCloudCredPopup">' +
         '<input class="pull-left" type="text" placeholder="Enter cloud user id" id="CFIS_cloud_id"/></div>' +
         '<div class="addCloudCredPopup"><span class="pull-left">Enter cloud password</span>' +
         '<strong style="color:red;">*</strong></div><div class="addCloudCredPopup">' +
         '<input class="pull-left" type="password" placeholder="Enter cloud password" id="CFIS_cloud_pwd"/></div>' +
         '<div class="addCloudCredPopup"><span>Enter root folder id</span><strong style="color:red;">*</strong>' +
         '</div><div class="addCloudCredPopup"><input type="text" placeholder="Enter root folder id" id="CFIS_access_id"/>' +
         '</div><div id="errorMsg" style="color:red"><span></span></div></div>';
     if(environment == "devwebapp" ){ //|| environment == "slwebapp"
         $('#appendCloudContent').append(htmlContent);
         $('#OauthButtons').append('<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addCFISCloud">Add</a>');
     }else{
         $('#appendCloudContent').html(ecmMsg);
         $('#OauthButtons').append('<a class="button mini rounded blue" data-dismiss="modal">Ok</a>');
     }*/
});

$("#doOauth_Yandex").click(function () {
  if (localStorage.getItem("storageVal") == null) {
    showLogOutNotification("notify", "You have been logged out");
    $("#cf-logout").trigger("click");
    window.location.href = "index.html";
  } else {
    sendGAEvents(ADD_CLOUD, "Yandex");
    //_gaq.push(['_trackEvent', "Add Cloud" , localStorage.getItem('UserId'),"Yandex"]);
    $("#OauthButtons").html("");
    $("#appendCloudContent").html("");
    var htmlContent =
      "<div>" +
      '<div class="addCloudCredPopup">' +
      "<span>Enter User Name</span>" +
      '<strong style="color:red;">*</strong>' +
      "</div>" +
      '<div class="addCloudCredPopup">' +
      '<input type="text" id="Yandex_uname" placeholder="Enter User Name"/></div>' +
      "</div>" +
      "<div>" +
      '<div class="addCloudCredPopup">' +
      "<span>Enter Yandex Password</span>" +
      '<strong style="color:red;">*</strong>' +
      "</div>" +
      '<div class="addCloudCredPopup">' +
      '<input type="password" id="Yandex_pwd" placeholder="Enter Yandex Password"/>' +
      '</div><div id="errorMsg" style="color:red"></div>' +
      "</div>";
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addYandexCloud">Add</a>'
    );
    $("#myFTPOauthModel").modal("show");
  }
});

$("#AXWAYCloud").click(function () {
  sendGAEvents(ADD_CLOUD, "Axway");
  //_gaq.push(['_trackEvent', "Add Cloud" , localStorage.getItem('UserId'),"Axway"]);
  $("#OauthButtons").html("");
  $("#appendCloudContent").html("");
  var htmlContent =
    "<div>" +
    '<div class="addCloudCredPopup">' +
    "<span>Enter User Name</span>" +
    '<strong style="color:red;">*</strong>' +
    "</div>" +
    '<div class="addCloudCredPopup">' +
    '<input type="text" id="Axway_uname" placeholder="Enter User Name"/></div>' +
    "</div>" +
    "<div>" +
    '<div class="addCloudCredPopup">' +
    "<span>Enter Axway Password</span>" +
    '<strong style="color:red;">*</strong>' +
    "</div>" +
    '<div class="addCloudCredPopup">' +
    '<input type="password" id="Axway_pwd" placeholder="Enter Axway Password"/>' +
    "</div>" +
    '<div class="addCloudCredPopup">' +
    "<span>Enter Axway URL</span>" +
    '<strong style="color:red;">*</strong>' +
    "</div>" +
    '<div class="addCloudCredPopup">' +
    '<input type="text" id="Axway_url" placeholder="Enter Axway URL"/>' +
    "</div>" +
    '<div id="errorMsg" style="color:red"></div>' +
    "</div>";

  $("#OauthButtons").html("");
  if (environment == "devwebapp") {
    //|| environment == "slwebapp"
    sendGAEvents(ADD_CLOUD, "Show Axway");
    $("#appendCloudContent").append(htmlContent);
    $("#OauthButtons").append(
      '<a class="button mini rounded light-gray" data-dismiss="modal">Cancel</a><a class="button mini rounded blue" id="addAxwayCloud">Add</a>'
    );
  } else {
    $("#appendCloudContent").html(ecmMsg);
    $("#OauthButtons").append(
      '<a class="button mini rounded blue" data-dismiss="modal">Ok</a>'
    );
  }
});

$("#OauthButtons").on("click", "#addeucaCloud", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName;
  accessToken = "s3:" + $("#eucasecretToken").val() + ":WALRUS";
  refreshToken = $("#eucaurl").val();
  userDisplayName = $("#eucaDisplayName").val();
  clouduserId = "WALRUS|" + $("#eucaaccessToken").val();
  if (
    accessToken != undefined &&
    accessToken != null &&
    refreshToken != undefined &&
    refreshToken != null &&
    clouduserId != undefined &&
    clouduserId != null &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    clouduserId.trim().length > 0
  ) {
    //TODO check not null here - Rat (Done)
    sendGAEvents(ADD_CLOUD, "Add Eucalyptus");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Eucalyptus"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "WALRUS",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addAmazonCloud", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    bucketName,
    accessKeyId;
  bucketName = $("#amazonBucketName").val();
  accessKeyId = $("#amazonaccessToken").val();
  if (bucketName == "") {
    accessToken = accessKeyId;
  } else {
    accessToken = accessKeyId + ":" + bucketName;
  }
  refreshToken = $("#amazonRefreshToken").val();
  userDisplayName = $("#amazonDisplayName").val();
  clouduserId = ""; //$('#amazonEmailId').val();

  if (
    accessToken != undefined &&
    accessToken != null &&
    refreshToken != undefined &&
    refreshToken != null &&
    userDisplayName != undefined &&
    userDisplayName != null &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    userDisplayName.trim().length > 0
  ) {
    //TODO check not null here - Rat (Done)
    sendGAEvents(ADD_CLOUD, "Add Amazon");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Amazon"]);
    /* if(emailReg.test( clouduserId)) {
         apiPutData(localStorage.getItem("UserId"), accessToken, refreshToken, clouduserId, "AMAZON", userDisplayName, "");
         $('#myFTPOauthModel').modal('hide');
         }
         else{
         $('#errorMsg').text("Enter valid emailid of the form abd@xyz.com");

         }*/

    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "AMAZON",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addAmazonGlacierCloud", function () {
  var isValidated = false;
  var accessToken, refreshToken, clouduserId, userDisplayName;
  accessToken = $("#glacieraccessToken").val();
  refreshToken = $("#glacierRefreshToken").val();
  userDisplayName = $("#glacierDisplayName").val();
  clouduserId = $("#glacierEmailId").val();
  if (
    accessToken != undefined &&
    accessToken != null &&
    refreshToken != undefined &&
    refreshToken != null &&
    userDisplayName != undefined &&
    userDisplayName != null &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    userDisplayName.trim().length > 0
  ) {
    sendGAEvents(ADD_CLOUD, "Add AMAZON GLACIER");
    if (emailReg.test(clouduserId)) {
      apiPutData(
        localStorage.getItem("UserId"),
        accessToken,
        refreshToken,
        clouduserId,
        "AMAZON_GLACIER",
        userDisplayName,
        ""
      );
      $("#myFTPOauthModel").modal("hide");
    } else {
      $("#errorMsg").text("Enter valid emailid of the form abd@xyz.com");
    }
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addAmazonCloud1", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    bucketName,
    accessKeyId;
  bucketName = "*";
  accessKeyId = $("#amazonaccessToken").val();
  if (bucketName == "") {
    accessToken = accessKeyId;
  } else {
    accessToken = accessKeyId + ":" + bucketName;
  }
  refreshToken = $("#amazonRefreshToken").val();
  userDisplayName = $("#amazonDisplayName").val();
  clouduserId = ""; //$('#amazonEmailId').val();

  if (
    accessToken != undefined &&
    accessToken != null &&
    refreshToken != undefined &&
    refreshToken != null &&
    userDisplayName != undefined &&
    userDisplayName != null &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    userDisplayName.trim().length > 0
  ) {
    //TODO check not null here - Rat (Done)
    sendGAEvents(ADD_CLOUD, "Add Amazon");

    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "AMAZON1",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});
/*wasabi*/

$("#OauthButtons").on("click", "#addWasabiCloud", function () {
  var isValidated = false;
  var accessToken, refreshToken, clouduserId, userDisplayName;
  accessToken = $("#wasabiaccessToken").val();
  refreshToken = $("#wasabiRefreshToken").val();
  userDisplayName = $("#wasabiDisplayName").val();
  clouduserId = $("#wasabiEmailId").val();
  if (
    accessToken != undefined &&
    accessToken != null &&
    refreshToken != undefined &&
    refreshToken != null &&
    userDisplayName != undefined &&
    userDisplayName != null &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    userDisplayName.trim().length > 0
  ) {
    //TODO check not null here - Rat (Done)
    sendGAEvents(ADD_CLOUD, "Add Wasabi");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Amazon"]);
    if (emailReg.test(clouduserId)) {
      apiPutData(
        localStorage.getItem("UserId"),
        accessToken,
        refreshToken,
        clouduserId,
        "WASABI",
        userDisplayName,
        ""
      );
      $("#myFTPOauthModel").modal("hide");
    } else {
      $("#errorMsg").text("Enter valid emailid of the form abd@xyz.com");
    }
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#cancelOauthLocal").click(function () {
  validations.cleandata();
});
$("#OauthButtons").on("click", "#addCMISCloud", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    CMISUrl,
    osType,
    userId,
    password,
    extraName;
  userId = $("#cmisDisplayName").val().trim();
  password = $("#CmiPassword").val();
  extraName = $("#cmisExtraName").val().trim();
  CMISUrl = $("#cmisURL").val().trim();
  osType = $("#osList option:selected").text();
  if (
    userId.trim().length > 0 &&
    password.trim().length > 0 &&
    CMISUrl.trim().length > 0
  ) {
    isValidated = true;
  }
  clouduserId = "CMIS|" + userId;
  accessToken = password + ":" + extraName + ":" + osType;
  refreshToken = CMISUrl;

  if (isValidated) {
    sendGAEvents(ADD_CLOUD, "Add CMIS");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add CMIS"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "CMIS",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg span").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});
/*********Share Point 2013************/
$("#OauthButtons").on("click", "#addSharePoint", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    sharePointUrl,
    SPDomain,
    userId,
    password,
    extraName;
  userId = $("#SPUname").val().trim();
  password = $("#SPPassword").val();
  SPDomain = $("#SPDomain").val().trim();
  sharePointUrl = $("#SPUrl").val().trim();
  userDisplayName = $("#SPDSPName").val().trim();
  extraName = $("#SPRoot").val().trim();
  var list = $("#SPList").val().trim();
  if (
    extraName.length > 0 &&
    list.length > 0 &&
    userId.length > 0 &&
    password.length > 0 &&
    SPDomain.length > 0 &&
    sharePointUrl.length > 0 &&
    userDisplayName.length > 0
  ) {
    isValidated = true;
  }
  if (isValidated) {
    clouduserId = "SHAREPOINT_2013|" + userId;
    accessToken = SPDomain + ":" + password + ":" + list;
    refreshToken = sharePointUrl;
    sendGAEvents(ADD_CLOUD, "Add SharePoint 2013");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add SharePoint 2013"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "SHAREPOINT_2013",
      userDisplayName,
      extraName
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});
$("#OauthButtons").on("click", "#addSharePoint2010", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    sharePointUrl,
    SPDomain,
    userId,
    password,
    root;
  userId = $("#SPUname").val().trim();
  password = $("#SPPassword").val();
  sharePointUrl = $("#SPUrl").val().trim();
  userDisplayName = userId;
  if (userId.length > 0 && password.length > 0 && sharePointUrl.length > 0) {
    isValidated = true;
  }
  if (isValidated) {
    sendGAEvents(ADD_CLOUD, "Add SharePoint 2010");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add SharePoint 2010"]);
    clouduserId = "SHAREPOINT_2010|" + userId;
    accessToken = password;
    refreshToken = sharePointUrl;
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "SHAREPOINT_2010",
      userDisplayName,
      "/"
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

// ******************* alfresco ******************** //
$("#OauthButtons").on("click", "#addAlfrescoCloud", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    alfrescoUrl,
    osType,
    userId,
    password,
    extraName;
  userId = $("#alfrescoDisplayName").val().trim();
  password = $("#alfrescoPassword").val();
  extraName = $("#alfrescoExtraName").val().trim();
  alfrescoUrl = $("#alfrescoURL").val().trim();
  osType = $("#osList option:selected").text();
  var root = $("#alfrescoRoot").val().trim();
  if (
    userId.trim().length > 0 &&
    password.trim().length > 0 &&
    alfrescoUrl.trim().length > 0 &&
    root.length > 0
  ) {
    isValidated = true;
  }
  clouduserId = "ALFRESCO|" + userId;
  accessToken = password + ":" + extraName + ":" + osType;
  refreshToken = alfrescoUrl;
  if (isValidated) {
    sendGAEvents(ADD_CLOUD, "Add Alfresco");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Alfresco"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "ALFRESCO",
      userDisplayName,
      root
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

//********************* alfresco ******************//
//********************* documentum ******************//
$("#OauthButtons").on("click", "#addDocumentumCloud", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    documentumUrl,
    osType,
    userId,
    password,
    extraName;
  userDisplayName = $("#DocumentumDisplayName").val();
  userId = $("#DocumentumUserName").val().trim();
  password = $("#DocumentumPassword").val();
  extraName = $("#DcoumentumExtraName").val().trim();
  documentumUrl = $("#DocumentumURL").val().trim();
  // osType = $("#osList option:selected").text();
  if (
    userId.length > 0 &&
    password.length > 0 &&
    extraName.length > 0 &&
    documentumUrl.length > 0
  ) {
    isValidated = true;
  }
  clouduserId = "DOCUMENTUM|" + userId;
  accessToken = password + ":" + extraName;
  refreshToken = documentumUrl;
  if (isValidated) {
    sendGAEvents(ADD_CLOUD, "Add Documentum");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Documentum"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "DOCUMENTUM",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

//********************* documentum ******************//
$("#OauthButtons").on("click", "#addFTPCloud", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    webDavUrl,
    osType,
    portNum;
  //osType = $("#osList option:selected").text();
  portNum = $("#portNum").val().trim();
  if (portNum == "") {
    $("#portNum").val("21");
  }
  //accessToken = $("#IpAddress").val() + '|' + osType;
  accessToken = $("#IpAddress").val() + ":" + portNum;
  refreshToken = $("#ftpPassword").val();
  userDisplayName = $("#oAuthDisplayName").val().trim();
  clouduserId = $("#userIdFTP").val().trim();
  //var root = $('#ftpRoot').val().trim();
  var root = "/";
  var pattern = /^\d+$/;
  if (
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    clouduserId.trim().length > 0 &&
    root.length > 0
  ) {
    isValidated = true;
  }
  if (!pattern.test(portNum) && portNum !== "") {
    $("#portNum").val("");
    $("#errorMsg").text(
      "Can't accept characters in port number,enter atleast two digits."
    );
    return false;
  }
  if (isValidated) {
    $("#errorMsg").text("").removeAttr("style");
    sendGAEvents(ADD_CLOUD, "Add FTP");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add FTP"]);
    if (osType == "UNIX" && root.charAt(0) != "/") {
      root = "/" + root;
    }
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "FTP",
      userDisplayName,
      root
    );
    //apiPutData(localStorage.getItem("UserId"), accessToken, refreshToken, clouduserId, $(".dropdown-toggle").text().trim(), userDisplayName, root);
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your authentication process."
    );
  }
});

$("#OauthButtons").on("click", "#addFTPCloudBusiness", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    webDavUrl,
    osType,
    portNum;
  //osType = $("#osList option:selected").text();
  portNum = $("#portNum").val().trim();
  if (portNum == "") {
    $("#portNum").val("21");
  }
  //accessToken = $("#IpAddress").val() + '|' + osType;
  accessToken = $("#IpAddress").val() + ":" + portNum;
  refreshToken = $("#ftpPassword").val();
  userDisplayName = $("#oAuthDisplayName").val().trim();
  clouduserId = $("#userIdFTP").val().trim();
  //var root = $('#ftpRoot').val().trim();
  var root = "/";
  var pattern = /^\d+$/;
  if (
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    clouduserId.trim().length > 0 &&
    root.length > 0
  ) {
    isValidated = true;
  }
  if (!pattern.test(portNum) && portNum !== "") {
    $("#portNum").val("");
    $("#errorMsg").text(
      "Can't accept characters in port number,enter atleast two digits."
    );
    return false;
  }
  if (isValidated) {
    $("#errorMsg").text("").removeAttr("style");
    sendGAEvents(ADD_CLOUD, "Add FTP");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add FTP"]);
    if (osType == "UNIX" && root.charAt(0) != "/") {
      root = "/" + root;
    }
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "FTP_BUSINESS",
      userDisplayName,
      root
    );
    //apiPutData(localStorage.getItem("UserId"), accessToken, refreshToken, clouduserId, $(".dropdown-toggle").text().trim(), userDisplayName, root);
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your authentication process."
    );
  }
});

$("#OauthButtons").on("click", "#addWebDavCloud", function () {
  var isValidated = false;
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    webDavUrl,
    osType;
  clouduserId = "WEBDAV|" + $("#emailAddressWebDav").val().trim();
  accessToken = $("#passwordWebDav").val();
  userDisplayName = $("#webDavDisplayName").val();
  // var portNum=$('#webDavPortNum').val();
  // var url=$('#webDavURL').val().trim();
  // refreshToken='';
  // url.substr(url.length - 1);
  // var proto=$('#webdavProtocol').val();
  // if( url.indexOf("://") !=-1)
  //     refreshToken =proto+url.split("//")[1];
  // else
  //     refreshToken =proto+url;
  // if( refreshToken.substr(refreshToken.length - 1) =="/")
  // {
  //     refreshToken=refreshToken.slice(0, -1);
  //     refreshToken +=':'+portNum;
  // }
  // else
  //     refreshToken +=':'+portNum;
  refreshToken = $("#webDavURL").val().trim();
  osType = $("#webDavRoot").val().trim();
  if (
    clouduserId.trim().length > 0 &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0 &&
    osType.trim().length > 0
  ) {
    isValidated = true;
  }
  if (isValidated) {
    sendGAEvents(ADD_CLOUD, "Add WEB Dav");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Webdav"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "WEBDAV",
      userDisplayName,
      osType
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addSugarSync", function () {
  var password = $("#SFilePwd").val();
  var appid = $("#SFileAppId").val().trim();
  var accesskey = $("#SFileAkey").val().trim();
  var paccesskey = $("#SFilePkey").val().trim();
  var dispname = $("#SFileDisp").val().trim();
  var clouduserId = $("#SFileuid").val().trim();
  var accessToken = password + ":" + appid + ":" + accesskey + ":" + paccesskey;
  if (
    clouduserId.trim().length > 0 &&
    password.trim().length > 0 &&
    appid.trim().length > 0 &&
    accesskey.trim().length > 0 &&
    paccesskey.trim().length > 0 &&
    dispname.trim().length > 0
  ) {
    sendGAEvents(ADD_CLOUD, "Add Sugar Sync");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Sugar Sync"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      " ",
      clouduserId,
      "SUGAR_SYNC",
      dispname,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addeucacloudian", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName;
  accessToken = "s3:" + $("#eucasecretToken").val() + ":CLOUDIAN";
  refreshToken = $("#eucaurl").val().trim();
  userDisplayName = $("#cloudianDisplayName").val().trim();
  clouduserId = "CLOUDIAN|" + $("#cloudianaccessToken").val();
  if (
    accessToken.length > 0 &&
    refreshToken.length > 0 &&
    clouduserId.length > 0
  ) {
    sendGAEvents(ADD_CLOUD, "Add Cloudian");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Cloudian"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "CLOUDIAN",
      userDisplayName,
      ""
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addazureCloud", function () {
  var accessToken,
    refreshToken = "",
    clouduserId,
    userDisplayName,
    isAzureFileShare;
  accessToken = $("#azure_atoken").val().trim();
  userDisplayName = $("#AzureDisplayName").val();
  clouduserId = $("#Azure_user_id").val();
  if ($("#isAzureFileShare:checked").length > 0) {
    isAzureFileShare = true;
  } else {
    isAzureFileShare = false;
  }
  if (accessToken.length > 0 && clouduserId.length > 0) {
    sendGAEvents(ADD_CLOUD, "Add Azure");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Azure"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "AZURE_OBJECT_STORAGE",
      userDisplayName,
      "",
      isAzureFileShare
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});
$("#OauthButtons").on("click", "#addGenObjCloud", function () {
  var clname = {
    Cloudian: "CLOUDIAN",
    Eucalyptus: "WALRUS",
    "HP Helion": "",
  };
  var accessToken, refreshToken, clouduserId, userDisplayName, cloudtype;
  cloudtype = $("#osList").val();
  if (cloudtype == "Select Cloud") {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
    return false;
  }
  $.each(clname, function (key, value) {
    if (key == cloudtype) {
      cloudtype = value;
    }
  });
  accessToken = "s3:" + $("#genObj_secret_key").val().trim() + ":" + cloudtype;
  userDisplayName = $("#genObj_DisplayName").val();
  clouduserId = cloudtype + "|" + $("#genObj_access_id").val().trim();
  refreshToken = $("#genObj_url").val().trim();
  if (accessToken.length > 0 && clouduserId.length > 0) {
    sendGAEvents(ADD_CLOUD, "Add Object Storage" + cloudtype);
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Add Object Storage"+cloudtype]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "GENERIC_OBJECT_STORAGE",
      userDisplayName,
      cloudtype
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addNTLMCloud", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName, cloudtype;
  clouduserId = $("#NTLM_cloud_id").val();
  userDisplayName = $("#NTLM_DisplayName").val();
  refreshToken = $("#NTLM_access_id").val();
  cloudtype = $("#NTLM_cloud_pwd").val();
  accessToken = refreshToken + ":" + cloudtype;
  if (
    clouduserId.length > 0 &&
    userDisplayName.length > 0 &&
    cloudtype.length > 0 &&
    refreshToken.length > 0
  ) {
    if (refreshToken.split("/").length < 3) {
      $("#errorMsg").text("Add Network File Shares (NFS) with Folder path");
      return false;
    } else if (refreshToken.split("/").length < 4) {
      if (
        refreshToken.split("/").length == 3 &&
        refreshToken.split("/")[2] == ""
      ) {
        $("#errorMsg").text("Add Network File Shares (NFS) with Folder path");
        return false;
      }
    }
    clouduserId = "NTLM_STORAGE|" + clouduserId;
    sendGAEvents(ADD_CLOUD, "NFS Storage");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"NFS Storage"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "NTLM_STORAGE",
      userDisplayName,
      cloudtype
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addNTLMCloudAdmin", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName, cloudtype;
  clouduserId = $("#NTLM_cloud_id").val();
  userDisplayName = $("#NTLM_DisplayName").val();
  refreshToken = $("#NTLM_access_id").val();
  cloudtype = $("#NTLM_cloud_pwd").val();
  accessToken = refreshToken; //+":"+cloudtype;
  if (clouduserId.length > 0 && userDisplayName.length > 0) {
    clouduserId = "NFS_ADMIN|" + clouduserId;
    sendGAEvents(ADD_CLOUD, "NFS admin Storage");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"NFS Storage"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "NFS_ADMIN",
      userDisplayName,
      cloudtype
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addSMBCloudAdmin", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName, cloudtype;
  var hostName = $("#NTLM_hostName").val();
  var lastLetter = hostName.charAt(hostName.length - 1);
  if (lastLetter === "/") {
    var hostName = hostName.slice(0, -1);
  }
  var folderPath = $("#NTLM_access_id").val();
  var d = folderPath.split("/");
  if (d.length > 2) {
    folderPath = folderPath.slice(0, -1);
  } else {
    folderPath;
  }
  var firstLetter = folderPath.charAt(0);
  if (firstLetter !== "/") {
    var folderPath = "/" + folderPath;
  }
  clouduserId = $("#NTLM_cloud_id").val();
  userDisplayName = $("#NTLM_DisplayName").val();
  refreshToken = hostName + folderPath;
  if (refreshToken.charAt(0) == "/") refreshToken = refreshToken.slice(1);

  cloudtype = $("#NTLM_cloud_pwd").val();
  accessToken = refreshToken + ":" + cloudtype;
  if (clouduserId.length > 0 && userDisplayName.length > 0) {
    clouduserId = "NETWORK_FILESHARES|" + clouduserId;
    sendGAEvents(ADD_CLOUD, "SMB admin Storage");
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "NETWORK_FILESHARES",
      userDisplayName,
      cloudtype
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addCFISCloud", function () {
  var accessToken, refreshToken, clouduserId, userDisplayName, cloudtype;
  clouduserId = $("#CFIS_cloud_id").val().trim();
  userDisplayName = $("#CFIS_DisplayName").val().trim();
  refreshToken = $("#CFIS_access_id").val().trim();
  cloudtype = $("#CFIS_cloud_pwd").val();
  accessToken = refreshToken + ":" + cloudtype;
  if (
    clouduserId.length > 0 &&
    userDisplayName.length > 0 &&
    refreshToken.length > 0
  ) {
    //clouduserId = "CFIS|"+clouduserId;
    sendGAEvents(ADD_CLOUD, "CIFS Storage");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"NFS Storage"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "CIFS",
      userDisplayName,
      cloudtype
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

//addYandexCloud

$("#OauthButtons").on("click", "#addYandexCloud", function () {
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    cloudtype,
    rootFolder;
  clouduserId = $("#Yandex_uname").val().trim();
  accessToken = $("#Yandex_pwd").val();
  refreshToken = "https://webdav.yandex.com";
  if (clouduserId.length > 0 && accessToken.length > 0) {
    userDisplayName = clouduserId;
    clouduserId = "YANDEX_DISK|" + clouduserId;
    rootFolder = "/";
    sendGAEvents(ADD_CLOUD, "Yandex");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"YANDEX_DISK"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "YANDEX_DISK",
      userDisplayName,
      rootFolder
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

$("#OauthButtons").on("click", "#addAxwayCloud", function () {
  var accessToken,
    refreshToken,
    clouduserId,
    userDisplayName,
    cloudtype,
    rootFolder;
  clouduserId = $("#Axway_uname").val().trim();
  accessToken = $("#Axway_pwd").val();
  refreshToken = $("#Axway_url").val().trim();
  if (
    clouduserId.length > 0 &&
    accessToken.length > 0 &&
    refreshToken.length > 0
  ) {
    userDisplayName = clouduserId;
    accessToken = validations.basicAuth(clouduserId, accessToken);
    rootFolder = "/";
    clouduserId = "AXWAY|" + clouduserId;
    sendGAEvents(ADD_CLOUD, "Axway");
    //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"AXWAY"]);
    apiPutData(
      localStorage.getItem("UserId"),
      accessToken,
      refreshToken,
      clouduserId,
      "AXWAY",
      userDisplayName,
      rootFolder
    );
    $("#myFTPOauthModel").modal("hide");
  } else {
    $("#errorMsg").text(
      "Please fill the required data to complete your oauth process"
    );
  }
});

// $('#appendCloudContent').on('click', '#ftpType li', function() {
//     var _txt=$(this).text().trim();
//     $("#ftpType").siblings("button").find(".pull-left").text(_txt);
//     //$("#ftpType").siblings("button").find(".pull-right").html('<span class="caret pull-right"></span>');
// });

$("#oneDriveAdd").click(function () {
  var _email = $("#oAuthDisplayName").val().trim();
  if (_email == "") {
    $(".errorMsg")
      .text("Please enter E-mail address.")
      .css({ display: "block" });
    return false;
  } else if (!emailReg.test(_email)) {
    $(".errorMsg")
      .text("Please enter valid E-mail address.")
      .css({ display: "block" });
    return false;
  }
  getHost(domainUrl);
  sendGAEvents(ADD_CLOUD, "One Drive");
  localStorage.setItem("displayName", _email);
  window.open(
    redirectURL + "ONEDRIVE&_email=" + _email,
    "_blank",
    "width=500px,height=500px,scrollbars=1"
  );
  $("#oneDriveName").modal("hide");
  $("#myModal button").trigger("click");
});

$("#oAuthDisplayName").click(function () {
  $(".errorMsg").css({ display: "none" });
});

$("#sharepoint_online_Admin").on("click", function () {
  var cldname = "sharePointOnline";
  // isCustUser(valid,cldname);
  isCustUser(cldname);
  // $('#Model').modal('show');
  /* getHost(domainUrl);
     sendGAEvents(ADD_CLOUD,"Sharepoint Online Admin");
     window.open(redirectURL + 'SHAREPOINT_ONLINE_BUSINESS', '_blank', 'width=500px,height=500px');*/
});

function isCustUser(cldname) {
  //  var valid = false;
  if (JSON.parse(localStorage.CFUser).standardUser === true) {
    $(".restrictedUser-Pannel").css("display", "flex");
  } else {
    var _url =
      apicallurl + "/report/entuser/validate/" + localStorage.getItem("UserId");
    $.ajax({
      type: "GET",
      url: _url,
      async: false,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (result) {
        //alert("@ checkIsaCustomUser result22 = "+result);
        if (result == true || result == false) {
          //  valid = true;
          if (cldname == "sharePointOnline") {
            getHost(domainUrl);
            sendGAEvents(ADD_CLOUD, "Sharepoint Online Admin");
            window.open(
              redirectURL + "SHAREPOINT_ONLINE_BUSINESS",
              "_blank",
              "width=500px,height=500px"
            );
          } else if (cldname == "spoh") {
            getHost(domainUrl);
            sendGAEvents(ADD_CLOUD, "Sharepoint Online Hybrid");
            window.open(
              redirectURL + "SHAREPOINT_ONLINE_HYBRID",
              "_blank",
              "width=500px,height=500px"
            );
          } else if (cldname == "gTeam" || cldname == "gSuit") {
            if (cldname == "gSuit") {
              $("#gsuitemarket").modal("show");
            } else if (cldname == "gTeam") {
              $("#gsuitemarketTeam").modal("show");
            }
          } else if (cldname == "egnyte_business") {
            getHost(domainUrl);
            sendGAEvents(ADD_CLOUD, "Egnyte for Business");
            //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Egnyte"]);
            window.open(
              egnyteBusinessRedirect + "EGNYTE_ADMIN",
              "_blank",
              "width=500px,height=550px,scrollbars=1"
            ); //EGNYTE_STORAGE_BUSINESS
            $("#myModal button").trigger("click");
          } else if (cldname == "network_fileshares") {
            $("#myFTPOauthModel").modal("show");
            sendGAEvents(ADD_CLOUD, "Show SMB Admin Storage");
            $("#appendCloudContent").html("");
            $("#OauthButtons").html("");
            var htmlContent =
              '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Display name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;position:relative;"><input class="form-control" type="text" id="NTLM_DisplayName" placeholder="Enter display name." style="height:36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Username<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="NTLM_cloud_id" placeholder="Enter Username" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" id="NTLM_cloud_pwd" placeholder="Enter password." style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Host name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="NTLM_hostName" placeholder="eg : Domain.com" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 30%;float: left;padding-top: 1%;color:#1F2129;">Folder path<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" id="NTLM_access_id" placeholder="eg : /folder path" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
            $("#appendCloudContent").append(htmlContent);

            $("#OauthButtons").append(
              '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addSMBCloudAdmin" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color: #ffffff;font-size: 16px;background: #0062FF;">Add</a>'
            );
          } else if (cldname == "sharePoint_2013") {
            $("#myFTPOauthModel").modal("show");
            sendGAEvents(ADD_CLOUD, "Show Share Point 2013");
            //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Share Point 2013"]);
            $("#appendCloudContent").html("");
            $("#OauthButtons").html("");
            $("#errorOnboxSubmit").text("");

            var htmlContent =
              '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint username<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter SharePoint username" id="SPUname" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" placeholder="Enter SharePoint password" id="SPPassword" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint domain<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter SharePoint domain" id="SPDomain" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint URL<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter SharePoint URL" id="SPUrl" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint list<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter SharePoint list" id="SPList" value="Documents" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Root directory<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter Root Directory" id="SPRoot" value="/Shared Documents" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 1%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Display name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="SPDSPName" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
            $("#appendCloudContent").append(htmlContent);
            $("#OauthButtons").append(
              '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addSharePoint" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
            );
          } else if (cldname == "sharePoint_2010") {
            $("#myFTPOauthModel").modal("show");
            sendGAEvents(ADD_CLOUD, "Show SharePoint 2010");
            //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Share Point 2010"]);
            $("#appendCloudContent").html("");
            $("#OauthButtons").html("");
            $("#errorOnboxSubmit").text("");
            var htmlContent =
              '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint username<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter SharePoint username" id="SPUname" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" placeholder="Enter SharePoint password" id="SPPassword" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">SharePoint URL<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter SharePoint URL" id="SPUrl" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
            $("#appendCloudContent").append(htmlContent);
            $("#OauthButtons").append(
              '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addSharePoint2010" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
            );
          } else if (cldname == "AZURE_OBJECT_STORAGE") {
            $("#myFTPOauthModel").modal("show");
            sendGAEvents(ADD_CLOUD, "Show Azure");
            //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show Azure"]);
            $("#appendCloudContent").html("");
            $("#OauthButtons").html("");
            var htmlContent =
              '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Display name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="AzureDisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Account name<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" placeholder="Enter account name" id="Azure_user_id" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Access key<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter access key" id="azure_atoken" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Azure file share</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><label class="switch" style="margin-top: -2%;"><input type="checkbox" id="isAzureFileShare" /><span class="slider round" style=""></span></label></div><div id="errorMsg" style="color:red"><span></span></div>';
            $("#appendCloudContent").append(htmlContent);
            $("#OauthButtons").append(
              '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addazureCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
            );
          } else if (cldname == "cifsCloud") {
            $("#myFTPOauthModel").modal("show");
            sendGAEvents(ADD_CLOUD, "Show CFIS Storage");
            //_gaq.push(['_trackEvent', ADD_CLOUD , localStorage.getItem('UserId'),"Show NFS Storage"]);
            $("#appendCloudContent").html("");
            $("#OauthButtons").html("");
            var htmlContent =
              '<div><div class="addCloudCredPopup"><span class="pull-left">Enter cloud display name</span></div>' +
              '<div class="addCloudCredPopup">' +
              '<input class="pull-left" type="text" placeholder="Enter display name" id="CFIS_DisplayName"/></div>' +
              '<div class="addCloudCredPopup"><span class="pull-left">Enter cloud user id</span>' +
              '<strong style="color:red;padding-left:3%;">*</strong></div><div class="addCloudCredPopup">' +
              '<input class="pull-left" type="text" placeholder="Enter cloud user id" id="CFIS_cloud_id"/></div>' +
              '<div class="addCloudCredPopup"><span class="pull-left">Enter cloud password</span>' +
              '<strong style="color:red;padding-left:3%;">*</strong></div><div class="addCloudCredPopup">' +
              '<input class="pull-left" type="password" placeholder="Enter cloud password" id="CFIS_cloud_pwd"/></div>' +
              '<div class="addCloudCredPopup"><span>Enter root folder id</span><strong style="color:red;">*</strong>' +
              '</div><div class="addCloudCredPopup"><input type="text" placeholder="Enter root folder id" id="CFIS_access_id"/>' +
              '</div><div id="errorMsg" style="color:red"><span></span></div></div>';
            var htmlContent =
              '<div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Display name</div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter display name" id="CFIS_DisplayName" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">User id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="password" placeholder="Enter cloud user id" id="CFIS_cloud_id" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Password<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter cloud password" id="CFIS_cloud_pwd" style="height: 36px;"/></div></div><div class="addCloudCredPopup" style="background: #FCFCFC 0% 0% no-repeat padding-box;border: 1px solid #E5E5E5;border-radius: 4px;height: 9vh;margin-bottom: 3%;padding: 2%;"><div style="width: 40%;float: left;padding-top: 1%;">Root folder id<strong style="color:red;padding-left:3%;">*</strong></div><div style="width: 10%;float: left;padding-top: 1%;">:</div><div style="width: 50%;float: left;"><input class="form-control" type="text" placeholder="Enter root folder id" id="CFIS_access_id" style="height: 36px;"/></div></div><div id="errorMsg" style="color:red"><span></span></div>';
            $("#appendCloudContent").append(htmlContent);
            $("#OauthButtons").append(
              '<a class="button mini rounded light-gray" data-dismiss="modal" style="border: 1px solid #707070;width: 98px;height: 40px;padding: 3% 9%;float: left;color:#707070;font-size:16px;margin-right: 20px;">Cancel</a><a class="button mini rounded blue" id="addCFISCloud" style="border: 1px solid #0062FF;width: 98px;height: 40px;padding:3% 15%;float: left;color:#ffffff;font-size: 16px;background: #0062FF;">Add</a>'
            );
          }
        } else {
          /*	var _cld;
				if (cldname == "sharePointOnline") {
					_cld = "Sharepoint Online Business";
				}
				else if (cldname == "spoh") {
					_cld = "Sharepoint Online Hybrid";
				}
				else if (cldname == "gSuit") {
					_cld = "G Suite";
				}
				else if (cldname == "gTeam") {
					_cld = "Google Shared Drives"
				}
				else if (cldname == "egnyte_business") {
					_cld = "Egnyte Admin"; 
				}
				else if (cldname == "network_fileshares") {
					_cld = "Network Fileshares";
				}
				else if (cldname == "SharePoint_2013") {
					_cld = "SharePoint 2013";
				}
				else if (cldname == "SharePoint_2010") {
					_cld = "SharePoint 2010";
				}
				else if (cldname == "cifsCloud") {
					_cld = "CIFS";
				}
				else if (cldname == "AZURE_OBJECT_STORAGE") {
					_cld = "Azure";
				}
				activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'busCldReqSpt',_cld);*/
          $("#Model").modal("show");
        }
      },
    });
  }
  // return valid;
}

$(document).on("click", "#helpImg1", function () {
  $(this).attr(
    "data-title",
    "Your connectors nickname - \nthis can be anything to help distinguish\nit from other connectors.\nYou can change this later from \nthe Clouds -> Manage Clouds tab"
  );
  $(this).tooltip("show");
});
$(document).on("mouseover", "#helpImg1", function () {
  $(this).attr("title", "");
  $(this).tooltip("hide");
});
$(document).on("click", "#helpImg2", function () {
  $(this).attr(
    "data-title",
    "The default port is 21. We support \nother ports also for FTP connection.\nPlease enter the port number if you\nare using anything other than 21 as \nyour FTP port."
  );
  $(this).tooltip("show");
});
$(document).on("mouseover", "#helpImg2", function () {
  $(this).attr("title", "");
  $(this).tooltip("hide");
});
