var CFRevisionview = {
  getFileRevisionDetails: function (fileid) {
    var apiUrl =
      apicallurl +
      "/fileshare/revision/all?fileId=" +
      encodeURIComponent(fileid);
    //console.log(apiUrl);
    $.ajax({
      type: "GET",
      url: apiUrl,
      async: false,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (VersionInfo) {
        versionDetails = VersionInfo;
      },
      complete: function (xhr, statusText) {},
    });
    return versionDetails;
  },
  deleteRevision: function (revisionId, fileid) {
    apiUrl =
      apicallurl +
      "/fileshare/revision/delete/" +
      revisionId +
      "?fileId=" +
      fileid;
    $.ajax({
      type: "DELETE",
      url: apiUrl,
      async: false,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (DeleteFile) {},
      statusCode: {
        204: function () {
          $('[id="' + revisionId + '"]').remove();
          if ($("#versionsOfFile").children().length == 0) {
            $("#versionsOfFile").css("border", "none");
            $("#versionsOfFile").html(
              '<span id="NoVersions" style="font-size:12pt;margin-left: 60px;">There are no versions associated with this file.</span>'
            );
          }
        },
      },
      complete: function (xhr, statusText) {
        if (xhr.status == 403) {
          var userDetails = JSON.parse(localStorage.getItem("CFUser"));
          var email = userDetails.primaryEmail;
          //$.smallBox({title:"This emailid "+email+" not authorized.",color:"#1ba1e2",timeout:notifyTime,sound:false});
          showNotyNotification(
            "notify",
            "This emailid " + email + " not authorized."
          );
          return false;
        }
      },
      error: function (error) {},
    });
  },
};

setTimeout(function () {
  var fexten;
  $(document).on("click", "#VersionDetails", function () {
    VersionFileId = [];
    versionFileType = [];
    var id = "";
    var type = "";
    if (PageName == "InnerWorkSpace") {
      id = $(this).parent().siblings("td:eq(2)").attr("id");
      type = $(this).parent(".file ").attr("fileper");
    } else if (viewTrack == "GView") {
      id = $(this).siblings("strong").attr("id");
      type = $(this).parent(".file ").attr("fileper");
    } else {
      id = $(this).parent().attr("id");
      type = $(this)
        .parent(".LVfileName")
        .parent(".panel-data")
        .attr("fileper");
    }
    VersionFileId.push(id);
    versionFileType.push(type);
    $("#FileVersion").trigger("click");
  });
}, 5000);
$("#FileVersion").click(function () {
  var versionDetails = CFRevisionview.getFileRevisionDetails(VersionFileId[0]);
  $("#versionsOfFile").html("");

  for (var i = versionDetails.length; i >= 1; i--) {
    var shareUrl = versionDetails[i - 1].cfFileShare.shareUrl;
    var accessToken = getParameterByName("accessToken", shareUrl);
    var url =
      apicallurl +
      "/fileshare/content/revision/" +
      versionDetails[i - 1].id +
      "?fileId=" +
      encodeURIComponent(VersionFileId[0]) +
      "&accessToken=" +
      accessToken +
      "&token=" +
      CFManageCloudAccountsAjaxCall.getAuthDetails() +
      "&sharePassword=";
    var delet = "notremove";
    $("#versionsOfFile").css("border", "1px solid black");
    if (versionDetails[i - 1].active == true) {
      delet = "remove";
      $("#versionsOfFile").append(
        '<li  style="line-height:' +
          " 25px;text-align: center;border-bottom: 1px solid rgba(17," +
          ' 13, 13, 0.22);" class="separator" id=' +
          versionDetails[i - 1].id +
          '> <a style="color: #22b5d8;font-size: 11pt;float:left;" href="#" title="Version ' +
          versionDetails[i - 1].version +
          '">V' +
          versionDetails[i - 1].version +
          '</a><div style="margin-left: 1%;"><div class="user-content" style="font-size:20px;"><span>' +
          CFManageCloudAccountsAjaxCall.getMaxChars(
            versionDetails[i - 1].fileName,
            50
          ) +
          '</span> <span style="font-size: 10pt;color: blue;">' +
          CFManageCloudAccountsAjaxCall.getObjectSize(
            versionDetails[i - 1].length
          ) +
          '</span></div><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Uploaded by <b>' +
          versionDetails[i - 1].cfFileShare.user.lastName +
          "</b>, " +
          jQuery.timeago(versionDetails[i - 1].creationDate) +
          ' </div></div></div><a style="color: #22b5d8;" href="' +
          url +
          '">Download</a><i class="icon-eye-open" id="versionFilePreview" style="float:right;cursor:pointer;font-size: 19pt;color: blue;margin-top: -52px;margin-right: 0px;"></i><i class="icon-' +
          delet +
          '" style="float:right;cursor:pointer;font-size: 12pt;margin-right:5px;"></i></li>'
      );
    }
  }

  if (versionDetails.length == 1) {
    $("#versionsOfFile").append(
      '<span id="NoVersions" style="font-size:12pt;margin-left: 60px;">There are no versions associated with this file.</span>'
    );
    $("#versionsOfFile").css("border", "none");
  }
  if (PageName == "Share with Me") {
    $("#CFUploadVersionFiles").show();
    if (versionFileType[0] == "read") {
      $("#CFUploadVersionFiles").hide();
    }
  }
});
$("#CFFileVersions").on("click", ".icon-remove", function () {
  var revisionId = $(this).parent().attr("id");
  CFRevisionview.deleteRevision(revisionId, VersionFileId);
});
