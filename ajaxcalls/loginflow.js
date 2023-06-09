var password;
var wrapper;
var notifyTime = 4000;
var notifyError = 2000;
var loginAjaxCall = {
  ajaxcall: function (username, password, serverDate, expiresIn) {
    $.ajax({
      type: "POST",
      url: apicallurl + "/auth/user",
      async: false,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        Authorization: loginAjaxCall.BasicAuth(username, password),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (data) {
        if (data != null) {
          if (sessionStorage != undefined && sessionStorage != null) {
            sessionStorage.setItem("CFUser", JSON.stringify(data));
          }
          localStorage.setItem(
            "UserAuthDetails",
            loginAjaxCall.BasicAuth(data.id, password)
          );
          localStorage.setItem("egnyteOldImpl", data.egnyteOldImpl);
        }
      },
      statusCode: {
        200: function () {
          var userDetails = JSON.parse(sessionStorage.getItem("CFUser"));
          if (userDetails.enabled == true) {
            expiresIn = userDetails.expiresIn;
            localStorage.setItem(
              "UserAuthDetails",
              loginAjaxCall.BasicAuth(userDetails.id, password)
            );
            localStorage.setItem("UserId", userDetails.id);
            loginAjaxCall.refreshcloud(
              "all",
              loginAjaxCall.BasicAuth(userDetails.id, password),
              userDetails.id
            );
            localStorage.setItem("UserName", userDetails.lastName);
            localStorage.setItem("CFUser", sessionStorage.getItem("CFUser"));
            sessionStorage.removeItem("CFUser");
            var url = sessionStorage.getItem("url");
            var url1 = sessionStorage.getItem("url1");
            var pmnt = sessionStorage.getItem("pmnt");
            localStorage.setItem("login", true);
            //   zohoCrm.upgradeSubscribtionRecord(username, 'loggedIn');
            if (pmnt != null) {
              window.location.href = pmnt;
            } else if (url != null) {
              window.location.href = url;
            } else if (url1 != null) {
              window.location.href = url1;
            } else if (expiresIn < serverDate) {
              var isCusUser = checkIsaCustomUserForLogin(userDetails.id);
              if (localStorage.newPasswordPolicy === "true") {
                if (serverDate - expiresIn > 3 * 24 * 60 * 60 * 1000) {
                  //alert("Expired user");
                  if (isCusUser == true) {
                    window.location.href = "cloudmanager.html?ver=1231";
                  } else {
                    window.location.href = "settings.html#price?pinfo=true";
                  }
                } else {
                  window.location.href = "cloudmanager.html?ver=1231";
                }
              } else {
                window.location.href = "settings.html#";
              }
            } else {
              if (localStorage.newPasswordPolicy === "true") {
                window.location.href = "cloudmanager.html?ver=1231";
              } else {
                window.location.href = "settings.html#";
              }
            }
            return false;
          } else {
            wrapper = $("#login-manager  .login-wrapper");
            wrapper.addClass("wobble");
            $("#login-submit").html(
              'Login<i class="lni lni-arrow-right" style="float:right;margin-top:2%;"></i>'
            );
            $("#login-manager .statusMesg").html(
              "<p>Please confirm your email address to activate your account</p>"
            );
            $("#login-manager i#resend-link").text("Resend confirmation link");
            return wrapper.bind(
              "webkitAnimationEnd animationEnd mozAnimationEnd",
              function () {
                wrapper.off("webkitAnimationEnd");
                return wrapper.removeClass("wobble");
              }
            );
          }
        },
        401: function () {
          wrapper = $("#login-manager .login-wrapper");
          $("#login-submit").html(
            'Login<i class="lni lni-arrow-right" style="float:right;margin-top:2%;"></i>'
          );
          wrapper.addClass("wobble");
          $("#login-manager .statusMesg1").css("display", "");
          veriftValidation();
          $("#login-manager .statusMesg1").text(
            "*In Valid Credentials Try Again!"
          );
          return wrapper.bind(
            "webkitAnimationEnd animationEnd mozAnimationEnd",
            function () {
              wrapper.off("webkitAnimationEnd");
              return wrapper.removeClass("wobble");
            }
          );
        },
      },
      complete: function (xhr, statusText) {
        if (xhr.status > 300 && xhr.status != 401) {
          //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
          showNotyNotification("error", "Operation Failed");
        }
      },
      error: function (error) {},
    });
  },
  signup: function (data) {
    var _a = "";
    var arr1 = {
      type: "USER",
      role: "SUBSCRIBER",
      enabled: data.enable,
      lastName: data.name,
      mobileNumber: data.phone,
      userGroups: null,
      createdDate: null,
      lastUpdatedDate: null,
      address1: null,
      address2: null,
      region: null,
      city: null,
      country: null,
      zipcode: null,
      userName: data.email,
      primaryEmail: data.email,
      password: CryptoJS.MD5(data.pwd).toString(),
      instance: data.instance,
    };
    var _email = data.email;
    _email = _email.toLowerCase();
    if (
      data.email.split("@")[1] == "sharklasers.com" ||
      data.email == "kampungandroid@qmail.id" ||
      data.email == "cesaroliveira1905@gmail.com"
    ) {
      return "failed";
    }
    var apiUrl =
      apicallurl +
      "/users/add?domainUrl=" +
      domainUrl +
      "/activeNew&trail=30&isEnable=true";
    $.ajax({
      type: "PUT",
      url: apiUrl,
      async: false,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(arr1),
      dataType: "json",
      success: function (result) {
        var data = {
          name: result.lastName,
          email: result.primaryEmail,
          phone: result.mobileNumber,
        };
        PageName = "signup";
        sendGAEvents(data.email + " successfully registered.");
        localStorage.setItem("signUp", true);
        //  zohoCrm.createRecord(data);
        return (_a = result);
      },
      error: function () {
        return (_a = "failed");
      },
    });
    var _c = cfValidations.getUserCurrency(_a);
    if (_c != null && _c != undefined && _c == "EUR") {
      arr1.currency = _c;
    } else {
      arr1.currency = "USD";
    }
    return _a;
  },
  BasicAuth: function (a, b) {
    var c = a + ":" + b;
    c = Base64.encode(c);
    return "Basic " + c;
  },
  refreshcloud: function (a, auth, uid) {
    var apiUrl =
      apicallurl + "/filefolder/refresh/cache/user/" + uid + "/cloud/" + a;
    $.ajax({
      type: "post",
      url: apiUrl,
      async: false,
      headers: {
        Authorization: auth,
      },
      success: function (data) {},
    });
  },
};

ForgotpasswordAjaxCall = {
  searchUser: function (email, checksum, password) {
    var wrapper = $("#login-manager").find(".login-wrapper");
    $.ajax({
      type: "GET",
      url: apicallurl + "/users/validateUser?searchUser=" + email + "",
      async: false,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (data, textStatus, xhr) {
        var serverDate = CFInterConvertTimeUtility.Ptstamptomillsec(
          xhr.getResponseHeader("Date")
        );
        if (data != "" && data !== "User Not Found") {
          if (checksum == "sendPwdLink") {
            wrapper.addClass("wobble");
            $("#login-manager .statusMesg").html(
              "<p>Your account is not yet confirmed. We will resend the confirmation link to your registered email.Please find this email and click on the confirmation link.</p>"
            );
            $("#login-manager i#resend-link").text("Resend confirmation link");
            return wrapper.bind(
              "webkitAnimationEnd animationEnd mozAnimationEnd",
              function () {
                wrapper.off("webkitAnimationEnd");
                return wrapper.removeClass("wobble");
              }
            );
          } else if (checksum == "resendConfirmLink") {
            wrapper.addClass("wobble");
            $("#login-manager .statusMesg").text(
              " The email address you entered is alredy confirmed."
            );
            return wrapper.bind(
              "webkitAnimationEnd animationEnd mozAnimationEnd",
              function () {
                wrapper.off("webkitAnimationEnd");
                return wrapper.removeClass("wobble");
              }
            );
          } else if (checksum == "loginPage") {
            if (password == "") {
              $("#login-manager #email").focusout();
              $("#login-manager #safariChange").focus();
              $("#login-manager .statusMesg1").css("display", "");
              $("#login-manager .statusMesg1").text("*Please enter password.");
              $("#login-manager .statusMesg").css("display", "none");
            } else if (password == undefined) {
              $("#login-manager #email").focusout();
              $("#login-manager #safariChange").focus();
              // $("#login-manager .statusMesg1").text("please enter password.");
              $("#login-manager .statusMesg").css("display", "none");
            } else {
              $("#login-submit").html(
                'Logging in..<i class="lni lni-arrow-right" style="float:right;margin-top:2%;"></i>'
              );
              localStorage.setItem("storageVal", true);
              if (
                data[0].passwordPolicy == "MD5" ||
                data[0].passwordPolicy == null
              ) {
                password = CryptoJS.MD5(password);
              }
              loginAjaxCall.ajaxcall(email, password, serverDate, 0);
            }
          } else if (checksum == "entLogin") {
            var loginDetails = {
              email: email,
              password: password,
              serverDate: serverDate,
              expires: 0,
            };
            $("#dummyFrame").attr(
              "src",
              "https://" +
                $("#login").find("input").val() +
                "." +
                host +
                ".cloudfuze.com/pages/cloudput.html?login=" +
                Base64.encode(loginDetails)
            );
          }
        } else {
          if (checksum == "loginPage") {
            //wrapper = $("#login-manager  .login-wrapper");
            wrapper.addClass("wobble");
            $("#login-manager .statusMesg1").css("display", "");
            $("#login-manager .statusMesg1").text(
              "*In Valid Credentials Try Again!"
            );
            veriftValidation();
            // $("#login-manager #email").focus();
            $("#login-manager #email_reset").focus();
            $("#login-manager #safariChange").focusout();
            return wrapper.bind(
              "webkitAnimationEnd animationEnd mozAnimationEnd",
              function () {
                wrapper.off("webkitAnimationEnd");
                return wrapper.removeClass("wobble");
              }
            );
          } else {
            $("#login-manager .statusMesg").css("display", "");
            $("#login-manager .statusMesg").text(
              "*The Email address you entered is not registered with us."
            );
            $("#login-submit").html(
              'Login<i class="lni lni-arrow-right" style="float:right;margin-top:2%;"></i>'
            );
          }
        }
      },
      complete: function (xhr, statusText) {
        if (xhr.status > 300 && xhr.status < 500) {
          //$.smallBox({title: "Operation failed.", color: "#e35e00", timeout: notifyError, sound: false});
          showNotyNotification("error", "Operation Failed");
          return wrapper.bind(
            "webkitAnimationEnd animationEnd mozAnimationEnd",
            function () {
              wrapper.off("webkitAnimationEnd");
              return wrapper.removeClass("wobble");
            }
          );
        } else if (xhr.status > 499) {
          $("#login_error").fadeIn();
          return wrapper.bind(
            "webkitAnimationEnd animationEnd mozAnimationEnd",
            function () {
              wrapper.off("webkitAnimationEnd");
              return wrapper.removeClass("wobble");
            }
          );
        }
      },
    });
  },
  forgotPassword: function (email) {
    $.ajax({
      type: "POST",
      url:
        apicallurl +
        "/auth/user/forgot?userName=" +
        email +
        "&domainUrl=" +
        domainUrl +
        "/pwdNew",
      async: false,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (data) {
        var checksum = "sendPwdLink";
        showConfForm(checksum);
      },
      complete: function (xhr, statusText) {
        if (xhr.status > 300) {
          //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
          showNotyNotification("error", "Operation Failed");
        }
      },
    });
  },
  resendEmail: function () {
    $.ajax({
      type: "POST",
      url: apicallurl + "/users/resend?domainUrl=" + domainUrl + "/activeNew",
      async: false,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("UserAuthDetails"),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (data) {
        var checksum = "resend";
        showConfForm(checksum);
      },
      complete: function (xhr, statusText) {
        if (xhr.status > 300) {
          //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
          showNotyNotification("error", "Operation Failed");
        }
      },
    });
  },
};

$("#CFsignup").click(function () {
  $(":input", "#CFloginform,#CFsignupform")
    .not(":button, :submit, :reset, :hidden :checkbox")
    .val("");
  $("#CFloginform .statusMesg").text("");
  $("#CFloginform .statusMesg").text("");
  $("#CFloginform").addClass("divdisplay");
  $("#CFsignupform").removeClass("divdisplay");
  document.title = "Sign Up";
  $("#CFSName").focus();
});

$(document).on("click", "#CFResendConfirmLink", function () {
  var email1 = $("#FEmail").val();
  var email = email1.toLowerCase();
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
  var checksum = "resendConfirmLink";
  if (email == "") {
    $("#CFforgotpassword  .statusMesg").text("Please Enter E-mail Address.");
    $("#CFforgotpassword  .statusMesg").css("margin", "0 auto");
    $("#FEmail").focus();
    return false;
  }
  if (email.length > 50) {
    $("#CFforgotpassword  .statusMesg").text(
      "The email address you entered is not associated with CloudFuze9990."
    );
    $("#FEmail").focus();
    return false;
  }
  if (!emailReg.test(email)) {
    $("#CFforgotpassword .statusMesg").text(
      "Please enter a valid E-Mail address."
    );
    $("#FEmail").focus();
    return false;
  }
  ForgotpasswordAjaxCall.searchUser(email, checksum);
});

$("#changeLink").click(function () {
  if ($("#changeLink").text() == "Sign in") {
    $("#loginHeading").css("display", "").text("Login to your account");
    localStorage.setItem("signUp", false);
    $("#changeSpan").text("Create an account for free ? ");
    $("#changeLink").text("Sign up");
    $("#loginNote").css("display", "");
    $("#welcome").css("display", "");
    $("#login").css("display", "");
    $("#login").find("#email").val("");
    $("#login").find("#safariChange").val("");
    $("#loginType").css("display", "");
    $("#register").css("display", "none");
    $(".underscoreDiv").css("display", "");
    $("#socialLogin").css("display", "");
    $("#contentDiv").css("padding-top", "4%");
    $("#hrLine").css("display", "");
    $("#forgot").css("display", "none");
    $("#login-manager .statusMesg").css("display", "none");
    $("#login-manager .statusMesg1").css("display", "none");
    $("#login-manager .statusMesg2").css("display", "none");
    $("#login-manager .statusMesg3").css("display", "none");
    $("#login-manager .statusMesg4").css("display", "none");
    $("#login-manager .statusMesg5").css("display", "none");
    $("#login-manager .statusMesg6").css("display", "none");
    $(document).prop("title", "Login to Your CloudFuze Account");
    window.history.pushState(
      "CloudFuze",
      "Show login link",
      window.location.pathname + "?login=true"
    );
    sendPageView(window.location.href);
  } else if ($("#changeLink").text() == "Sign up") {
    $("#loginHeading").css("display", "").text("Create your free account");
    localStorage.setItem("signUp", true);
    $("#changeSpan").text("Already have an account ? ");
    $("#changeLink").text("Sign in");
    $("#contentDiv").css("padding-top", "1%");
    $("#loginNote").css("display", "none");
    $("#welcome").css("display", "none");
    $("#login").css("display", "none");
    $("#loginType").css("display", "");
    $(".underscoreDiv").css("display", "");
    $("#socialLogin").css("display", "");
    $("#hrLine").css("display", "");
    $("#register").css("display", "");
    $("#register").find("#name").val("");
    $("#register").find("#email").val("");
    $("#register").find("#phone").val("+1");
    $("#register").find("#pwd").val("");
    $("#login-manager .statusMesg").html("");
    $("#login-manager .statusMesg").css("display", "");
    $("#login-manager .statusMesg1").css("display", "none");
    $("#login-manager .statusMesg2").css("display", "none");
    $("#login-manager .statusMesg3").css("display", "none");
    $(document).prop("title", "Sign up for a CloudFuze Account");
    window.history.pushState(
      "CloudFuze",
      "Show signup link",
      window.location.pathname + "?signup=true"
    );
  }
});
$("#forgot-link").click(function () {
  $("#loginHeading").css("display", "").text("Forgot password");
  $("#changeSpan").text("Remember your password ? ");
  $("#changeLink").text("Sign in");
  $("#loginNote").css("display", "none");
  $("#welcome").css("display", "none");
  $("#login").css("display", "none");
  $("#loginType").css("display", "");
  $("#register").css("display", "none");
  $(".underscoreDiv").css("display", "none");
  $("#socialLogin").css("display", "none");
  $("#contentDiv").css("padding-top", "10%");
  $("#hrLine").css("display", "none");
  $("#forgot").css("display", "");
  $("#forgot").find("#pwd").val("");
  window.history.pushState(
    "CloudFuze",
    "Show forgot password link",
    window.location.pathname + "?forgotpassword=true"
  );
  sendPageView(window.location.href);
});

$("#ResendConfirmationLink ").click(function () {
  $("#CFloginform").addClass("divdisplay");
  $(":input", "#CFloginform")
    .not(":button, :submit, :reset, :hidden :checkbox")
    .val("");
  $("#CFloginform .statusMesg").text("");
  $("#CFloginform .statusMesg").text("");
  $("#CFforgotpassword").removeClass("divdisplay");
  $("#CFforgotpassword .statusMesg").text("");
  $("#1").attr("id", "CFResendConfirmLink");
  $("#CFforgotpassword #titletext").text("Resend Confirmation Link");
  $("button:first").attr("id", "");
  $("button:first").attr("id", "ResendConfirmationlink");
  $("#CFforgotpassword #FEmail").focus();
});
$("#CFforgotpwd").click(function () {
  $(":input, :checkbox, :radio", "#CFloginform")
    .not(":button, :submit, :reset, :hidden")
    .val("");
  $("#CFloginform .statusMesg").text("");
  $("#CFforgotpassword .statusMesg").text("");
  $("#CFloginform").addClass("divdisplay");
  $("#CFforgotpassword").removeClass("divdisplay");
  $("#CFforgotpassword #titletext").text("Forgot Password");
  $("#1").attr("id", "CFsendpwdresetlink");
  $("#CFforgotpassword #FEmail").focus();
  document.title = "Forgot Password";
});

$(document).on("click", "#CFsendpwdresetlink", function () {
  var email1 = $("#FEmail").val();
  var email = email1.toLowerCase();
  var checksum = "sendPwdLink";
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
  $("#CFforgotpassword  .statusMesg").css("color", "red");
  $("#CFforgotpassword  .statusMesg").css("text-align", "center");
  if (email == "") {
    $("#CFforgotpassword  .statusMesg").text("Please Enter E-Mail Address");
    $("#FEmail").focus();
    return false;
  }
  if (email.length < 6 || email.length > 50) {
    $("#CFforgotpassword  .statusMesg").text(
      "The email address you entered is not associated with CloudFuze."
    );
    $("#FEmail").focus();
    return false;
  }
  if (!emailReg.test(email)) {
    $("#CFforgotpassword .statusMesg").text(
      "Please enter a valid E-Mail address."
    );
    $("#FEmail").focus();
    return false;
  }
  ForgotpasswordAjaxCall.searchUser(email, checksum);
});
$("#CFLCancel").click(function () {
  window.location.href = "http://www.cloudfuze.com";
});
$("#CFbacktologin").click(function () {
  $("#CFpwdresetlinkconfirmmsg").addClass("divdisplay");
  $("#CFpwdresetlinkconfirmmsg .title4").text("");
  $("#CFloginform").removeClass("divdisplay");
  $("#CFforgotpassword .statusMesg").text("");
  $("#CFloginform a#ResendConfirmationLink").text("");
  document.title = "Login";
  $("#CFloginform #CFUname").focus();
});
$("#CFFcancel").click(function () {
  $(":input", "#CFforgotpassword")
    .not(":button, :submit, :reset, :hidden :checkbox")
    .val("");
  $("#CFforgotpassword .statusMesg").text("");
  $("#CFloginform a#ResendConfirmationLink").text("");
  $("#CFloginform a#CFsendpwdresetlink").text("");
  if (
    $("#CFloginform a[tid='CFLoginLinkText']").attr("id") ==
    "ResendConfirmationLink"
  ) {
    $(this).attr("id", "CFsendpwdresetlink");
  } else if (
    $("#CFloginform a[tid='CFLoginLinkText']").attr("id") ==
    "CFsendpwdresetlink"
  ) {
    $(this).attr("id", "ResendConfirmationLink");
  }
  $("#CFloginform").removeClass("divdisplay");
  $("#CFforgotpassword").addClass("divdisplay");
  $("#CFloginform #CFUname").focus();
  document.title = "Login";
});
$("#CFsignupform input").keypress(function (e) {
  if (e.which == 13) {
    $("#CFcreateAccount").trigger("click");
  }
});
$("#CFloginform input").keypress(function (e) {
  if (e.which == 13) {
    $("#CFlogin").trigger("click");
  }
});
$("#CFforgotpassword input").keypress(function (e) {
  if (e.which == 13) {
    $("#CFsendpwdresetlink").trigger("click");
    $("#CFResendConfirmLink").trigger("click");
  }
});

//TODO - Sudhheer changes

function checkIsaCustomUserForLogin(_userId) {
  var valid = false;
  var _url = apicallurl + "/report/entuser/validate/" + _userId; //+localStorage.getItem("UserId");
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
      if (result == true) {
        valid = true;
      } else {
        valid = false;
      }
    },
  });
  return valid;
}

$(document).on("click", "#loginPageClick", function () {
  location.reload();
});

function veriftValidation() {
  let validCount = localStorage.tryLimit ? Number(localStorage.tryLimit) : 0;
  if (validCount >= 2) {
    grecaptcha.reset();
    $("#login-submit").attr("disabled", true);
    $(".g-recaptcha").css("display", "");
  } else {
    localStorage.setItem("tryLimit", validCount + 1);
  }
}
