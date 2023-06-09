var jobStatus = {
  PAUSE: "Pause",
  STARTED: "Started",
  CANCEL: "Canceled",
  IN_QUEUE: "In Queue",
  CONFLICT: "Conflict",
  SUSPENDED: "Suspended",
  PROCESSED: "Processed",
  COMPLETED: "Completed",
  NOT_STARTED: "In Queue",
  PICKING_INPRGS: "Picking In Progress",
  NOT_PROCESSED: "Not Processed",
  LINK_WS_CREATED: "Link Created",
  IN_PROGRESS: "In Progress",
  SCAN_IN_PROGRESS: "In Progress",
  NOT_PROCESSED: "Not Processed",
  MOVE_IN_PROGRESS: "In Progress",
  METADATA_STARTED: "Metadata Started",
  PARTIALLY_COMPLETED: "Partially Completed",
  MULTIUSERTRAIL_COMPLETED: "Trial Completed",
  PROCESSED_WITH_CONFLICTS: "Processed With Conflicts",
};
function CFNewLoader(action, message) {
  if (action === "show") {
    $("#CFShowLoading").show();
  } else {
    $("#CFShowLoading").hide();
  }

  if (message) {
    $("#loaderText").html(message);
  } else {
    $("#loaderText").html("Please wait while loading...");
  }
}

$("#move_main").on("change", "#mappingClouds input[type=radio]", function () {
  if (
    $("#srcClouds input:checked").length &&
    $("#dstClouds input:checked").length
  ) {
    var searchData = {
      mapping: false,
      source: false,
      destination: false,
    };
    localStorage.setItem("searchData", JSON.stringify(searchData));
    $("#forNextMove").removeClass("disabled");
  }
});

$("#forNextMove").on("click", function () {
  $(".ui-helper-hidden-accessible").hide();
  $("#forPreviousMove").removeClass("disabled");
  //    $("#forNextMove").addClass("disabled");
  var _step = parseInt($("#forNextMove").attr("data-step"));
  _step = _step + 1;
  if (_step == 0) return false;
  else if (_step == 1) {
    selectedEmailMappings = [];
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#forPreviousMove").addClass("disabled");
    $("#mappingClouds").css("display", "");
    $("#linkEx-PreScan").css("display", "none");
    if (
      $("#srcClouds input:checked").length &&
      $("#dstClouds input:checked").length
    )
      $("#forNextMove").removeClass("disabled");

    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    $("#muralJobOptions").css("display", "none");
  } else if (_step == 2) {
    $("#mappingClouds").css("display", "none");
    $("#linkEx-PreScan").css("display", "flex");
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    $("#mappingsEmailOptions").css("display", "none");

    localStorage.setItem(
      "lnKxSourceCldName",
      $("#srcClouds input[name=sourceCloud]:checked").attr("cloudname")
    );
    localStorage.setItem(
      "lnKxDstnCldName",
      $("#dstClouds input[name=dstCloud]:checked").attr("cloudname")
    );
    localStorage.setItem(
      "lnKxSourceCldId",
      $("#srcClouds input[name=sourceCloud]:checked").attr("id")
    );
    localStorage.setItem(
      "lnKxDstnCldId",
      $("#dstClouds input[name=dstCloud]:checked").attr("id")
    );
    localStorage.setItem(
      "lnKxSourceCldEmail",
      $("#dstClouds input[name=dstCloud]:checked").attr("mail")
    );
    localStorage.setItem(
      "lnKxDstnCldEmail",
      $("#srcClouds input[name=sourceCloud]:checked").attr("mail")
    );
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    $("#forNextMove").css({
      background: "#f2f2f2",
      color: "#454545",
      width: "80px",
    });
    $("#forNextMove span").text("Fix Links");
    // $("#forNextMove i").hide();
    getPreScanSummary();
    getLinkExPreMigrationUsers();
    $("#forNextMove").addClass("disabled");
  } else if (_step == 3) {
    startFixLinks();
    // $("#forNextMove").css({ width: "auto" });
    // $("#forNextMove span").text("Start Migration");
    // $("#linkEx-PreScan").css("display", "none");
    // $("#linkEx-mappping").css("display", "flex");
    // $("#mappingClouds").css("display", "none");
    // $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
    //   .removeClass("active")
    //   .addClass("completed");
    // $("#mappingsEmailOptions").css("display", "");
    // $("#forNextMove").attr("data-step", _step);
    // $("#forPreviousMove").attr("data-prev", _step);
    // $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    // $("#forNextMove").css({ background: "#0062ff", color: "#fff" });
    // $("#forNextMove span").text("Fix Links");
    // $("#forNextMove i").hide();
    // $("#mappingClouds").css("display", "none");
    // $("#emailMapping").css("display", "none");
    // $("#emailOptions").css("display", "");
    // $("#forNextMove").addClass("disabled");
    // getLinkExAutoMap(1);
  } else if (_step == 4) {
    // $("#modalBatchCreate").css("display", "flex");
    // $("#newBatchName").focus();
  } else {
    console.log("Not a valied step");
  }
});

$("#forPreviousMove").on("click", function () {
  var _step = parseInt($("#forPreviousMove").attr("data-prev"));
  $(".ui-helper-hidden-accessible").hide();
  if (_step == 6) location.reload();
  $("#forNextMove").css({ width: "83.5px" });
  $("#forNextMove span").text("Next");
  $("#preview").css("display", "none");
  $("#forNextMove").removeClass("disabled");
  _step = _step - 1;

  if (_step == 0) return false;
  else if (_step == 1) {
    selectedEmailMappings = [];
    $("#muralPreMigration").css("display", "none");
    $("#linkEx-mappping").css("display", "none");
    localStorage.removeItem("teamMigrationMappingPopUp");
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#forPreviousMove").addClass("disabled");
    $("#mappingClouds").css("display", "");
    $("#linkEx-PreScan").css("display", "none");
    $("#teamMigrationWidget ul li[data-val='1']").addClass("active");
    $("#srcCloudUsers .message-widget").html("");
    $("#dstCloudsUsers .message-widget").html("");
    $("#teamMigrationWidget ul li")
      .removeClass("active")
      .removeClass("completed");

    if (
      $("#srcClouds input:checked").length &&
      $("#dstClouds input:checked").length
    )
      $("#forNextMove").removeClass("disabled");
    $("#forNextMove").css({
      background: "#f2f2f2",
      color: "#454545",
      width: "80px",
    });
    $("#forNextMove span").text("Next");
    $("#forNextMove i").show();
  } else if (_step == 2) {
    $("#linkEx-PreScan").css("display", "flex");
    $("#linkEx-mappping").css("display", "none");
    $("#mappingsEmailOptions").css("display", "none");
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#mappingClouds").css("display", "none");
    $("#emailMapping").css("display", "flex");
    $("#emailOptions").css("display", "none");
  } else if (_step == 3) {
    $("#mappingClouds").css("display", "none");
    $("#emailMapping").css("display", "none");
    $("#emailOptions").css("display", "");
  } else if (_step == 4) {
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    if ($("#mapdUsers input[name=inputMapdUrs]:checked").length)
      $("#forNextMove").removeClass("disabled");
  }

  $("#forPreviousMove").attr("data-prev", _step);
  $("#forNextMove").attr("data-step", _step);
  $("#teamMigrationWidget ul li[data-val=" + (_step + 1) + "]").removeClass(
    "active"
  );
  $("#teamMigrationWidget ul li[data-val=" + _step + "]")
    .addClass("active")
    .removeClass("completed");
});
$("#teamMigrationWidget ul li").on("click", function () {
  if ($("#teamMigrationWidget ul li.last").hasClass("completed")) return false;

  if ($(this).hasClass("active") || $(this).hasClass("completed")) {
    var _step = parseInt($(this).find(".badge").text());
    $("#preview").css("display", "none");

    if (_step == 0) return false;
    else if (_step == 1) {
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $(".ui-helper-hidden-accessible").hide();
      $("#forPreviousMove").addClass("disabled");
      $("#mappingClouds").css("display", "");
      $("#mappingPreMigration").css("display", "none");
      $("#muralPreMigration").css("display", "none");
      $("#muralJobOptions").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingPreMigration").css("display", "none");
      $("#muralJobOptions").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
      $("#linkEx-PreScan").css("display", "none");
      $("#linkEx-mappping").css("display", "none");
      $("#forNextMove").css({
        background: "#f2f2f2",
        color: "#454545",
        width: "80px",
      });
      $("#forNextMove span").text("Next");
      $("#forNextMove i").show();
      if (
        $("#srcClouds input:checked").length &&
        $("#dstClouds input:checked").length
      )
        $("#forNextMove").removeClass("disabled");
    } else if (_step == 2) {
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#mappingPreMigration").css("display", "none");
      $("#muralPreMigration").css("display", "");
      $("#muralJobOptions").css("display", "none");
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#muralJobOptions").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
      $("#linkEx-PreScan").css("display", "flex");
      $("#linkEx-mappping").css("display", "none");
      $("#forNextMove").css({ background: "#f2f2f2", color: "#454545" });
      $("#forNextMove span").text("Next");
      $("#forNextMove i").show();
      $("#forNextMove").removeClass("disabled");
    } else if (_step == 3) {
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "");
      $("#muralPreMigration").css("display", "done");
      $("#mappingPreMigration").css("display", "");
      $("#muralJobOptions").css("display", "none");
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
      if ($("#mapdUsers input[name=inputMapdUrs]:checked").length)
        $("#forNextMove").removeClass("disabled");
    }

    if (_step < 4) {
      $("#forNextMove").css({ width: "83.5px" });
      $("#forNextMove span").text("Next");
    }

    $("#forPreviousMove").attr("data-prev", _step);
    $("#forNextMove").attr("data-step", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]")
      .addClass("active")
      .removeClass("completed");
    _step = _step + 1;
    for (; _step < 6; _step++)
      $("#teamMigrationWidget ul li[data-val=" + _step + "]")
        .removeClass("active")
        .removeClass("completed");
  }
});

function getLinkExPreMigrationUsers(pageNo, from) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    if (!from) {
      $("#CFShowLoading").show();
    }
    $(".linkEx-preScan-usersTable-Body").html("");
  }
  // id="linkEx-reportsUser"  wsid="${
  // res?.moveWorkSpaceId
  // }"
  // <div class="placeUserName"><span>${res?.userDisplayName}</span></div>
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/getCloudDetails_v1?sourceAdminCloudId=${localStorage.lnKxSourceCldId}&page_nbr=${pageNo}&page_size=50&destAdminCloud=${localStorage.lnKxDstnCldId}`,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();

      if (data.length > 0) {
        data?.map((res, index) => {
          let checkInp;
          if (res?.scanStatus === "IN_QUEUE") {
            checkInp = `<input type="checkbox" style="margin: 0" id="selectPreScanUser" cloudid="${res?.fromCloudId}" id="selectPreScanUser"  scanstatus="${res?.scanStatus}" wsid="${res?.id}"/>`;
          } else if (res?.scanStatus === "PROCESSED") {
            checkInp = `<input type="checkbox" id="selectLinkExMappings" userid="${res?.userId}" srcadmincldid="${res?.fromAdminCloudId}" dstnadminid="${res?.toAdminCloudId}" destCloudId="${res?.toCloudId}" srcCloudId="${res?.fromCloudId}" scanstatus="${res?.scanStatus}" wsid="${res?.id}"/>`;
          } else {
            checkInp = `<input type="checkbox" style="margin: 0" scanstatus="${res?.scanStatus}"disabled/>`;
          }
          $(".linkEx-preScan-usersTable-Body").append(`
            <div class="linkEx-preScan-usersTable-bodyData" workspace="${
              res?.id
            }">
            <div class="placeSelectPreScanAll">
             ${checkInp}
            </div>
            <div class="placeUserEmail preScanDone" style="position: relative;"><span title="${
              res?.fromMailId
            }">${res?.fromMailId}
            </span><span style="position: absolute;top: 23px;color: #acacac;font-size: 10px;">${
              res?.sourceFolderPath && res?.destFolderPath
                ? res?.sourceFolderPath
                : ""
            }</span></div>
            <div class="placeUserEmail preScanDone" style="position: relative;"><span title="${
              res?.toMailId
            }">${res?.toMailId}
            </span><span style="position: absolute;top: 23px;color: #acacac;font-size: 10px;">${
              res?.sourceFolderPath && res?.destFolderPath
                ? res?.destFolderPath
                : ""
            }</span></div>
            <div class="placeTotalOroginalFiles">
              <span>${res?.totalFilesWithLinks}</span>
            </div>
            <div class="placeTotalLinks">
              <span>${res?.totalLinks}</span>
            </div>
            <div class="placeTotalLinksFiles">
              <span>${res?.totalLinkedFiles}</span>
            </div>
            <div class="placeTotalLinksFiles">
              <span class="span-${res?.scanStatus ?? "IN_PROGRESS"}">${
            jobStatus[res?.scanStatus ?? "IN_PROGRESS"]
          }</span>
            </div>
            <div class="placeScanStatus" style="position: relative;">
            <span scancid="cloud_${res?.sourceCloudId}" class="span-${
            res?.processStatus
          }">${jobStatus[res?.processStatus]}</span>
              
            </div>
            <div class="placeScanStatus" style="width: 100px;gap: 10px;justify-content: space-evenly;height: 100%;">
            ${
              res?.errorDesc
                ? `
                  <i title="${res?.errorDesc}" style="font-size: 12px !important;text-overflow: clip;"
                  class="fa fa-info-circle showErrDesc" ></i>
              `
                : `<i
                  title="${res?.errorDesc}"
                  style="font-size: 12px !important;text-overflow: clip;visibility: hidden;"
                  class="fa fa-info-circle"></i>`
            }
            <i style="cursor: pointer;margin-top: 1px;" class="lnil lnil-cross-circle" style="font-size: 12px !important;" wsid="${
              res?.id
            }" id="removeSingleWS" title="Remove Workspace"></i>
            ${
              res?.scanStatus === "PROCESSED"
                ? ` <i
                  class="lnil lnil-download"
                  style="cursor: pointer;"
                  id="requestPreScanReport"
                  wsid="${res?.id}"
                  title="Download Workspace Report"></i>`
                : `<i
                  class="lnil lnil-download"
                  style="cursor: pointer;visibility:hidden"></i>`
            }
            </div>
          </div>
          `);
        });
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
  checkScanStatus();
}
// <div class="placeTotalLinksFiles">
//   <span>${CFManageCloudAccountsAjaxCall.getObjectSize(
//     res?.totalOriginalFilesSize
//   )}</span>
// </div>

$(document).on("click", "#removeSingleWS", function () {
  CFNewLoader("show", "Removing Workspace");
  deleteWorkSpaces([
    {
      id: $(this).attr("wsid"),
    },
  ]);
});

$(document).on("click", "#requestPreScanReport", function () {
  let workSpaceId = $(this).attr("wsid");

  $.ajax({
    method: "POST",
    url: `${apicallurl}/hyperlinks/preScanDownLoad?moveWorkSpaceId=${workSpaceId}`,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (res) {
      alertSuccess(
        "Thank you for requesting the report. It is being prepared and will be sent to your email shortly"
      );
    },
    error: function (err) {
      alertError("Unable to generate reports");
    },
  });
});

$(document).on("click", "#deleteMultipleWorkSpaces", function () {
  CFNewLoader("show", "Removing Workspaces");
  let selectedWorkspaces = [];
  $.each(
    $(
      "input[id=selectPreScanUser]:checked,input[id=selectLinkExMappings]:checked"
    ),
    function () {
      let obj = {
        id: $(this).attr("wsid"),
      };
      selectedWorkspaces.push(obj);
    }
  );
  deleteWorkSpaces(selectedWorkspaces);
});

function deleteWorkSpaces(wsList) {
  $.ajax({
    type: "POST",
    url: `${apicallurl}/hyperlinks/deleteHyperWorkspace`,
    data: JSON.stringify(wsList),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      CFNewLoader();
      wsList?.map((res) => {
        $('[workspace="' + res?.id + '"]').remove();
      });
      alertSuccess("Workspace Removed Successfully...");
      $("#selAllLinkScan").prop("checked", false);
    },
    error: function (err) {
      CFNewLoader();
      alertError("Failed To Remove Workspace");
    },
  });
}

$(document).on("click", "#linkEx-reportsUser", function () {
  $("#linkEx-preScan-Reports").css("display", "flex");
  $("#linkEx-PreScan").css("display", "none");
  $(".alignNxtPrev").css("display", "none");
  getPreScanReports($(this).attr("wsid"), 1);
});

$(document).on("click", ".linkEx-preScan-reportsBack", function () {
  $(".alignNxtPrev").css("display", "flex");
  $("#linkEx-PreScan").css("display", "flex");
  $("#linkEx-preScan-Reports").css("display", "none");
});

function getLinkExJobs(pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $(".jobLevelReports-Body").html("");
  }
  $.ajax({
    type: "GET",
    // url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkJobs?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkJobs?userId=619b6085c2dc682aa94a2c92&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic NjE5YjYwODVjMmRjNjgyYWE5NGEyYzkyOjE3MTRjYjRkZjM1NWU4NWRlMDhjNTE4YTNmM2Y2YzQ2",
      // Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data) {
        data?.map((res, index) => {
          $(".jobLevelReports-Body").append(`
              <div class="jobLevelReports-Title">
              <div class="linkExJobName"><span id="moveToLinkExWorkSpaces" jobid="${
                res?.jobId
              }">LinkEx-${index + 1}</span></div>
              <div class="linkExTotalLinks"><span>${
                res?.totalFiles
              }</span></div>
              <div class="linkExmigratedLinks">
                <span>${res?.totalFilesWithLinks}</span>
              </div>
              <div class="linkExProcessedOn">
                <span>${getDateConversion(res?.createdTime)}</span>
              </div>
              <div class="linkExStatus"><span class="span-${
                res?.processStatus
              }">${jobStatus[res?.processStatus]}</span></div>
            </div>
              `);
        });
      }
      if (data.length === 50) {
        getLinkExJobs(Number(pageNo) + 1);
      }
    },
  });
}

function getDateConversion(timestamp) {
  var _ago = Date.now() - timestamp;
  if (
    timestamp === undefined ||
    timestamp === "" ||
    timestamp === null ||
    timestamp === "null"
  ) {
    return "-";
  } else if (_ago < 86400000) {
    return jQuery.timeago(timestamp);
  } else {
    return CFManageCloudAccountsAjaxCall.getDateConversion(timestamp);
  }
}

$(document).on("click", "#moveToLinkExWorkSpaces", function () {
  $("#moveToWorkspaces").html(`&nbsp;> Workspaces`);
  $(".jobLevelReports").css("display", "none");
  $(".workSpaceLevelReports").css("display", "");
  getWorkSpaceReports($(this).attr("jobid"), 1);
});

$(document).on("click", "#moveToJobs", function () {
  $("#moveToWorkspaces").html(``);
  $("#moveToFileFolders").html(``);
  $(".jobLevelReports").css("display", "");
  $(".workSpaceLevelReports").css("display", "none");
  // getWorkSpaceReports($(this).attr("jobid"), 1);
});

function getWorkSpaceReports(jobId, pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $(".workSpaceLevelReports-Body").html("");
  }
  $.ajax({
    type: "GET",
    // url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkJobs?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkWorkspaces?userId=619b6085c2dc682aa94a2c92&page_nbr=${pageNo}&page_size=50&matchBy=all&jobId=${jobId}`,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic NjE5YjYwODVjMmRjNjgyYWE5NGEyYzkyOjE3MTRjYjRkZjM1NWU4NWRlMDhjNTE4YTNmM2Y2YzQ2",
      // Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data) {
        data?.map((res) => {
          $(".workSpaceLevelReports-Body").append(`
              <div class="jobLevelReports-Title">
              <div class="linkExJobName"><span id="moveToLinkExWorkSpacesFiles" wsid="${
                res?.moveWorkSpaceId
              }">${res?.ownerEmailId}</span></div>
              <div class="linkExTotalLinks"><span>${
                res?.totalFilesWithLinks
              }</span></div>
              <div class="linkExmigratedLinks">
                <span>${res?.totalProcessedCount}</span>
              </div>
              <div class="linkExProcessedOn">
                <span>${getDateConversion(res?.createdTime)}</span>
              </div>
              <div class="linkExStatus"><span class="span-${
                res?.processStatus
              }">${jobStatus[res?.processStatus]}</span></div>
            </div>
              `);
        });
      }
      if (data.length === 50) {
        getWorkSpaceReports(jobId, Number(pageNo) + 1);
      }
    },
  });
}

$(document).on("click", "#moveToLinkExWorkSpacesFiles", function () {
  $("#moveToFileFolders").html(`&nbsp;> Files`);
  $(".jobLevelReports").css("display", "none");
  $(".workSpaceLevelReports").css("display", "none");
  $(".fileFolderLevelReports").css("display", "");
  getWorkSpaceFilesReports($(this).attr("wsid"), 1);
});

$(document).on("click", "#moveToWorkspaces", function () {
  $("#moveToFileFolders").html(``);
  $(".jobLevelReports").css("display", "none");
  $(".workSpaceLevelReports").css("display", "");
  $(".fileFolderLevelReports").css("display", "none");
  // getWorkSpaceFilesReports($(this).attr("wsid"), 1);
});

function getWorkSpaceFilesReports(wsId, pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $(".fileFolderLevelReports-Body").html("");
  }
  $.ajax({
    type: "GET",
    // url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkJobs?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinks?userId=619b6085c2dc682aa94a2c92&page_nbr=${pageNo}&page_size=50&matchBy=all&moveWorkSpaceId=${wsId}`,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic NjE5YjYwODVjMmRjNjgyYWE5NGEyYzkyOjE3MTRjYjRkZjM1NWU4NWRlMDhjNTE4YTNmM2Y2YzQ2",
      // Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data) {
        data?.map((res) => {
          $(".fileFolderLevelReports-Body").append(`
              <div class="jobLevelReports-Title">
              <div class="linkExJobName" style="width:20%;"><div class="alignWorkSpaceFolder">
              <img src="../img/fileTypes/${getFileIcons(
                res?.sourceObjectName
              )}" class="tableImg" alt="icon" />
              <span>${res?.sourceObjectName}</span></div></div>
              <div class="linkExTotalLinks" style="width:20%;"><span>${
                res?.destFolderPath ? res?.destFolderPath : "-"
              }</span></div>
              <div class="linkExmigratedLinks" style="width:11%;">
                <span>${CFManageCloudAccountsAjaxCall.getObjectSize(
                  res?.objectSize
                )}</span>
              </div>
              <div class="linkExmigratedLinks" style="width:11%;">
                <span>${
                  res?.noOfProcessedLinks
                    ? res?.noOfProcessedLinks
                    : 0 + res?.noOfProcessedLinks
                    ? res?.noOfProcessedLinks
                    : 0 + res?.noOfConflictLinks
                    ? res?.noOfConflictLinks
                    : 0
                }</span>
              </div>
              <div class="linkExmigratedLinks" style="width:11%;">
                <span>${res?.noOfProcessedLinks}</span>
              </div>
              <div class="linkExProcessedOn" style="width:15%;">
                <span>${getDateConversion(res?.endTime)}</span>
              </div>
              <div class="linkExStatus" style="width:12%;"><span class="span-${
                res?.processStatus
              }">${jobStatus[res?.processStatus]}</span></div>
            </div>
              `);
        });
      }
      if (data.length === 50) {
        getWorkSpaceFilesReports(wsId, Number(pageNo) + 1);
      }
    },
  });
}

getFileIcons = (fileName) => {
  // console.log(fileName, type);
  if (fileName === undefined || fileName === "undefined") return "-";
  let fileTypeImages = {
    pdf: "pdf.svg",
    ppt: "pptx.svg",
    pptx: "pptx.svg",
    doc: "docx.svg",
    docx: "docx.svg",
    xls: "xlsx.svg",
    xlsx: "xlsx.svg",
    csv: "xlsx.svg",
    jpeg: "photo.svg",
    jpg: "photo.svg",
    png: "photo.svg",
    gif: "photo.svg",
    zip: "zip.svg",
    mp4: "video.svg",
    mov: "video.svg",
    wmv: "video.svg",
    avi: "video.svg",
    webm: "video.svg",
    flv: "video.svg",
    exe: "exe.svg",
    html: "html.svg",
    folder: "folder.svg",
    file: "file.svg",
    SITE: "spo.svg",
    gdoc: "gdocs.svg",
  };
  let fileType = fileName.split(".")[fileName.split(".").length - 1];
  if (fileTypeImages[fileType]) {
    return fileTypeImages[fileType];
  } else if (fileTypeImages[fileType] === undefined) {
    return "file.svg";
  } else {
    return "folder.svg";
  }
};

function getPreScanReports(wsId, pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $(".linkEx-preScan-reportsTables-Body").html("");
  }
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/getHyperLinks?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all&moveWorkSpaceId=${wsId}`,
    headers: {
      "Content-Type": "application/json",
      // Authorization:
      //   "Basic NjE5YjYwODVjMmRjNjgyYWE5NGEyYzkyOjE3MTRjYjRkZjM1NWU4NWRlMDhjNTE4YTNmM2Y2YzQ2",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();

      if (data) {
        data?.map((res) => {
          $(".linkEx-preScan-reportsTables-Body").append(`
                <div class="linkEx-preScan-usersTable-Title">
                          <div class="placeFolderName">
                          <div class="linkExJobName" style="width:100%;"><div class="alignWorkSpaceFolder">
                              <img src="../img/fileTypes/${getFileIcons(
                                res?.sourceObjectName
                              )}" class="tableImg" alt="icon" />
                              <span id="getSrcDstnPath" wsid="${
                                res?.moveWorkSpaceId
                              }" srcid="${res?.sourceId}">${
            res?.sourceObjectName
          }</span>
                          </div>
                          </div>
                          </div>
                          <div class="placeFilePath"><span title="${
                            res?.sourcePath
                          }">${
            res?.sourcePath ? res?.sourcePath : "-"
          }</span></div>
                          <div class="placeFileSize">
                            <span>${CFManageCloudAccountsAjaxCall.getObjectSize(
                              res?.objectSize
                            )}</span>
                          </div>
                          <div class="placeFileTotalLinks">
                            <span>${res?.links}</span>
                          </div>
                          <div class="placeFileTotalLinksFiles">
                            <span>${res?.noOfProcessedLinks}</span>
                          </div>
                          <div class="placeFileScanStatus">
                          <span class="span-${res?.processStatus}">${
            jobStatus[res?.processStatus]
          }</span>
                          </div>
                        </div>
              `);
        });
      }
      if (data?.length === 50) {
        getPreScanReports(wsId, Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

$("#addNewBatchCTACancel").on("click", function () {
  $("#modalBatchCreate").css("display", "none");
});

$("#addNewBatchCTA").on("click", function () {
  $("#modalBatchCreate").css("display", "none");
});

function getPreScanSummary() {
  $("#link-preScan-totalUsers").html("0");
  $("#link-preScan-totalOriginalFiles").html("0");
  $("#link-preScan-totalLinks").html("0");
  $("#link-preScan-totalLinkFiles").html("0");
  $("#link-preScan-dataSize").html("0");
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/hyperlinks/hyperLinkSummary_v1?userId=" +
      CFManageCloudAccountsAjaxCall.getUserId() +
      "&sourceAdminCloudId=" +
      localStorage.lnKxSourceCldId,
    async: true,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#link-preScan-totalUsers").html(data?.totalUsers);
      $("#link-preScan-totalOriginalFiles").html(data?.totalFilesWithLinks);
      $("#link-preScan-totalLinks").html(data?.totalLinks);
      $("#link-preScan-totalLinkFiles").html(data?.totalLinkedFiles);
      $("#link-preScan-dataSize").html(
        CFManageCloudAccountsAjaxCall.getObjectSize(
          data?.totalOriginalFilesSize
        )
      );
      $(".preScanLstUpdt").html(`Updated on ${new Date().toLocaleString()}`);
    },
  });
}

function getLinkExAutoMap(pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $("#emailMappingsTableBody").html("");
  }
  let pageSize = 50;
  $.ajax({
    type: "POST",
    url: `${apicallurl}/mapping/user/clouds/list?sourceCloudId=${localStorage.lnKxSourceCldId}&destCloudId=${localStorage.lnKxDstnCldId}&pageNo=${pageNo}&pageSize=${pageSize}`,
    async: true,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (res) {
      $("#CFShowLoading").hide();
      res?.map((data) => {
        if (data?.mapped) {
          $("#emailMappingsTableBody").append(`
            <tr matched="true">
          <td>
          <input type="checkbox" id="selectLinkExMappings" userid="${data?.userId}" srcadmincldid="${data?.sourceAdminCloudId}" dstnadminid="${data?.destAdminCloudId}" destCloudId="${data?.destCloudId}" srcCloudId="${data?.sourceCloudId}">
          </td>
          <td title="sophia@pepperwood.club">
          <div style="display: flex; flex-direction: column">
          <span>${data?.sourceCloudDetails?.emailId}</span>
          </div>
          </td>
          <td title="sophia@pepperwood.club">
          <div style="display: flex; flex-direction: column">
          <span>${data?.destCloudDetails?.emailId}</span>
            </div>
          </td>
          <td>Mapped</td>
          <td></td>
          </tr>
          `);
        } else {
          $("#emailMappingsTableBody").append(`
            <tr matched="false">
          <td>
          <input type="checkbox" disabled>
          </td>
          <td title="sophia@pepperwood.club">
          <div style="display: flex; flex-direction: column">
          <span>${
            data?.sourceCloudDetails?.emailId
              ? data?.sourceCloudDetails?.emailId
              : "<span style='color:#454545;padding:5px;background:#f2f3ff;border-radius:5px'>Not Matched</span>"
          }</span>
          </div>
          </td>
          <td title="sophia@pepperwood.club">
          <div style="display: flex; flex-direction: column">
          <span>${
            data?.destCloudDetails?.emailId
              ? data?.destCloudDetails?.emailId
              : "<span style='color:#454545;padding:5px;background:#f2f3ff;border-radius:5px'>Not Matched</span>"
          }</span>
            </div>
          </td>
          <td>Not Mapped</td>
          <td></td>
          </tr>
          `);
        }
      });

      if (res?.length === 50) {
        getLinkExAutoMap(Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

$("#upldMappingCsv").on("click", function () {
  $("#collectPreScanCSV").trigger("click");
});

function usersLinkExPreScanCsv() {
  $("#CFShowLoading").show();
  var upload = document.getElementById("collectPreScanCSV").files[0];
  localStorage.setItem("lnKxCSVName", upload.name);
  var reader = new FileReader();
  reader.onload = function () {
    csvPreScanMappingsUpload(reader.result);
  };
  reader.readAsText(upload);
  $("#collectPreScanCSV").val("");
}

function csvPreScanMappingsUpload(csvData) {
  let uri;
  if (
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "EGNYTE_ADMIN") ||
    (localStorage.lnKxSourceCldName == "SHAREPOINT_ONLINE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "GOOGLE_SHARED_DRIVES") ||
    (localStorage.lnKxSourceCldName == "GOOGLE_SHARED_DRIVES" &&
      localStorage.lnKxDstnCldName == "EGNYTE_ADMIN") ||
    (localStorage.lnKxSourceCldName == "GOOGLE_SHARED_DRIVES" &&
      localStorage.lnKxDstnCldName == "SHAREPOINT_ONLINE_BUSINESS") ||
    (localStorage.lnKxSourceCldName == "G_SUITE" &&
      localStorage.lnKxDstnCldName == "EGNYTE_ADMIN") ||
    (localStorage.lnKxSourceCldName == "EGNYTE_ADMIN" &&
      localStorage.lnKxDstnCldName == "G_SUITE") ||
    (localStorage.lnKxSourceCldName == "EGNYTE_ADMIN" &&
      localStorage.lnKxDstnCldName == "GOOGLE_SHARED_DRIVES") ||
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "G_SUITE") ||
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "GOOGLE_SHARED_DRIVES") ||
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "SHAREPOINT_ONLINE_BUSINESS")
  ) {
    uri = `${apicallurl}/hyperlinks/user/path/csv/nonmapped?sourceCloudId=${localStorage.lnKxSourceCldId}&destCloudId=${localStorage.lnKxDstnCldId}&pageNo=1&pageSize=500`;
  } else {
    uri = `${apicallurl}/hyperlinks/user/csv?sourceCloudId=${localStorage.lnKxSourceCldId}&destCloudId=${localStorage.lnKxDstnCldId}&pageNo=1&pageSize=500`;
  }

  $.ajax({
    type: "POST",
    url: uri,
    async: true,
    data: csvData,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data, textStatus, xhr) {
      var headers = xhr.getAllResponseHeaders().toLowerCase().trim();
      var values = headers.split("\n");
      var count = [];
      for (var i = 0; i < values.length; i++) {
        var hrdValue = values[i].split(": ");
        count[hrdValue[0].trim()] = hrdValue[1].trim();
      }
      var dupLength = count["duplicatecount"];
      if (data.hyperLinkMappingCahche == undefined) {
        var data = data;
      } else {
        var data = data.hyperLinkMappingCahche;
      }
      if (data?.length !== 0) {
        localStorage.setItem("lnKxCSVId", data[0]?.csvId);
        checkHyperLinkCsvStatus();
        linkExCsvAutoDownload();
      } else {
        alertError("No valid mappings found...");
        $("#CFShowLoading").hide();
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

function linkExCsvAutoDownload() {
  let uri;
  let isForSpo = false;
  if (
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "EGNYTE_ADMIN") ||
    (localStorage.lnKxSourceCldName == "SHAREPOINT_ONLINE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "GOOGLE_SHARED_DRIVES") ||
    (localStorage.lnKxSourceCldName == "GOOGLE_SHARED_DRIVES" &&
      localStorage.lnKxDstnCldName == "EGNYTE_ADMIN") ||
    (localStorage.lnKxSourceCldName == "GOOGLE_SHARED_DRIVES" &&
      localStorage.lnKxDstnCldName == "SHAREPOINT_ONLINE_BUSINESS") ||
    (localStorage.lnKxSourceCldName == "G_SUITE" &&
      localStorage.lnKxDstnCldName == "EGNYTE_ADMIN") ||
    (localStorage.lnKxSourceCldName == "EGNYTE_ADMIN" &&
      localStorage.lnKxDstnCldName == "G_SUITE") ||
    (localStorage.lnKxSourceCldName == "EGNYTE_ADMIN" &&
      localStorage.lnKxDstnCldName == "GOOGLE_SHARED_DRIVES") ||
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "G_SUITE") ||
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "GOOGLE_SHARED_DRIVES") ||
    (localStorage.lnKxSourceCldName == "SHAREFILE_BUSINESS" &&
      localStorage.lnKxDstnCldName == "SHAREPOINT_ONLINE_BUSINESS")
  ) {
    isForSpo = true;
    uri = `${apicallurl}/hyperlinks/download/csvcreator/zip/${
      localStorage.lnKxCSVId
    }?sourceAdminCloudId=${localStorage.lnKxSourceCldId}&destAdminCloudId=${
      localStorage.lnKxDstnCldId
    }&userId=${CFManageCloudAccountsAjaxCall.getUserId()}&csvName=${
      localStorage.lnKxCSVName
    }`;
  } else {
    isForSpo = false;
    uri = `${apicallurl}/hyperlinks/download/hyperlinkcsvcreator/${
      localStorage.lnKxCSVId
    }?sourceAdminCloudId=${localStorage.lnKxSourceCldId}&destAdminCloudId=${
      localStorage.lnKxDstnCldId
    }&userId=${CFManageCloudAccountsAjaxCall.getUserId()}&csvName=${
      localStorage.lnKxCSVName
    }`;
  }

  $.ajax({
    type: "GET",
    url: uri,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    xhrFields: {
      responseType: "blob",
    },
    success: function (data, textStatus, xhr) {
      if (data.size > 150) {
        var response = xhr.getResponseHeader("Content-Disposition").trim();
        var fName = response.split("=")[1];
        var a = document.createElement("a");
        var url = URL.createObjectURL(data);
        a.href = url;
        a.download = fName;
        document.body.append(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        getCSVLinkExValidatedPairs(1, isForSpo);
      } else {
        $("#CFShowLoading").hide();
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

function getCSVLinkExValidatedPairs(pageNo, isForSpo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $(".linkEx-preScan-usersTable-Body").html("");
  }
  pageSize = 50;
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/user/latest/hyperlinkmappingcache/${
      localStorage.lnKxCSVId
    }?sourceAdminCloudId=${localStorage.lnKxSourceCldId}&destAdminCloudId=${
      localStorage.lnKxDstnCldId
    }&userId=${CFManageCloudAccountsAjaxCall.getUserId()}&pageNo=${pageNo}&pageSize=${pageSize}`,
    // url: apicallurl + "/mapping/user/latest/mappingcache/" + csvID + data,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();

      if (data.length > 0) {
        let workSpaceList = [];
        data?.map((res) => {
          let mappingObj = {
            userId: res?.userId,
            sourceCloudId: res?.sourceCloudId,
            destCloudId: res?.destCloudId,
            fromMailId: res?.sourceCloudDetails?.emailId,
            toMailId: res?.destCloudDetails?.emailId,
            fromRootId: res?.fromRootId,
            toRootId: res?.toRootId,
            sourceAdminCloudId: res?.sourceAdminCloudId,
            destAdminCloudId: res?.destAdminCloudId,
            sourceFolderPath: res?.sourceCloudDetails?.folderPath,
            destFolderPath: res?.destCloudDetails?.folderPath,
          };

          workSpaceList.push(mappingObj);

          let checkInp;
          if (res?.processStatus === "IN_QUEUE") {
            checkInp = `<input type="checkbox" style="margin: 0" id="selectPreScanUser" cloudid="${res?.fromCloudId}" id="selectPreScanUser"  scanstatus="${res?.processStatus}"/>`;
          } else if (res?.processStatus === "NOT_PROCESSED") {
            checkInp = `<input type="checkbox" id="selectLinkExMappings" userid="${res?.userId}" srcadmincldid="${res?.fromAdminCloudId}" dstnadminid="${res?.toAdminCloudId}" destCloudId="${res?.toCloudId}" srcCloudId="${res?.fromCloudId}" scanstatus="${res?.processStatus}"/>`;
          } else {
            checkInp = `<input type="checkbox" style="margin: 0" scanstatus="${res?.processStatus}"disabled/>`;
          }
          $(".linkEx-preScan-usersTable-Body").append(`
            <div class="linkEx-preScan-usersTable-bodyData">
            <div class="placeSelectPreScanAll">
             ${checkInp}
            </div>
            <div class="placeUserEmail preScanDone"><span title="${
              res?.sourceCloudDetails?.emailId
            }">${res?.sourceCloudDetails?.emailId}</span></div>
            <div class="placeUserEmail preScanDone"><span title="${
              res?.sourceCloudDetails?.emailId
            }">${res?.destCloudDetails?.emailId}</span></div>
            <div class="placeTotalOroginalFiles">
              <span>${
                res?.totalFilesWithLinks ? res?.totalFilesWithLinks : 0
              }</span>
            </div>
            <div class="placeTotalLinks">
              <span>${res?.totalLinks ? res?.totalLinks : 0}</span>
            </div>
            <div class="placeTotalLinksFiles">
              <span>${res?.totalLinkedFiles ? res?.totalLinkedFiles : 0}</span>
            </div>
            <div class="placeTotalLinksFiles">
              <span>${CFManageCloudAccountsAjaxCall.getObjectSize(
                res?.totalOriginalFilesSize
              )}</span>
            </div>
            <div class="placeScanStatus">
              <span scancid="cloud_${res?.sourceCloudId}" class="span-${
            res?.processStatus
          }">${jobStatus[res?.processStatus]}</span>
            </div>
          </div>
            `);
        });
        if (isForSpo) {
          createHyperLinkWorkspaceSpo();
        } else {
          createHyperLinkWorkspace(workSpaceList);
        }
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

$(document).on("click", "#selectLinkExMappings", function () {
  if ($('[id="selectLinkExMappings"]:checked').length > 0) {
    $("#forNextMove").removeClass("disabled");
  } else {
    $("#forNextMove").addClass("disabled");
  }
  if ($('[id="selectLinkExMappings"]').length > 5) {
    if (
      $('[id="selectLinkExMappings"]').length ===
      $('[id="selectLinkExMappings"]:checked').length
    ) {
      $("#selAllLinkScan").prop("checked", true);
      // $("#selectAllLinkExMappings").prop("checked", true);
    } else {
      $("#selAllLinkScan").prop("checked", false);
      // $("#selectAllLinkExMappings").prop("checked", false);
    }
  }
  checkScanStatus();
});

$(document).on("click", "#selectAllLinkExMappings", function () {
  if ($(this).is(":checked")) {
    $("#forNextMove").removeClass("disabled");
    $('[id="selectLinkExMappings"]').prop("checked", true);
  } else {
    $("#forNextMove").addClass("disabled");
    $('[id="selectLinkExMappings"]').prop("checked", false);
  }
  checkScanStatus();
});

function startFixLinks() {
  $("#CFShowLoading").show();
  let fixArray = [];
  let lnKxSourceCldId = localStorage.lnKxSourceCldId;
  let lnKxDstnCldId = localStorage.lnKxDstnCldId;
  let userId = CFManageCloudAccountsAjaxCall.getUserId();
  $.each($("input[id=selectLinkExMappings]:checked"), function () {
    let fixObj = {
      userId: userId,
      sourceAdminCloudId: lnKxSourceCldId,
      destAdminCloudId: lnKxDstnCldId,
      sourceCloudId: $(this).attr("srccloudid"),
      destCloudId: $(this).attr("destcloudid"),
    };
    fixArray.push(fixObj);
  });
  console.log(fixArray);
  $.ajax({
    type: "POST",
    url: `${apicallurl}/hyperlinks/fixLinks_v1`,
    data: JSON.stringify(fixArray),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      window.location.href = "linkExReports.html";
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

// ${
//   res?.destUrl
//     ? `<div class="circleLinks" lnk="${res?.destUrl}"><i class="lnil lnil-link" id="modalLinkIcon"></i></div>`
//     : ""
// }

//
//   res?.sourceUrl
//     ? `<div class="circleLinks" lnk="${res?.sourceUrl}"><i class="lnil lnil-link" id="modalLinkIcon"></i></div>`
//     : ""
// }

function getFileSrcDstnPath(wsId, srcId, pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $(".modalPathBody").html("");
  }
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/getHyperLinkUrls?moveWorkSpaceId=${wsId}&sourceId=${srcId}&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    async: true,
    headers: {
      // Authorization:
      //   "Basic NjE5YjYwODVjMmRjNjgyYWE5NGEyYzkyOjE3MTRjYjRkZjM1NWU4NWRlMDhjNTE4YTNmM2Y2YzQ2",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      if (data.length === 0 && pageNo === 1) {
        alertError("No Links Found");
      }
      if (data.length > 0) {
        if (pageNo === 1) {
          $(".modalPathBody").html("");
          $(".modalPaths-Parent").css("display", "flex");
        }
        data?.map((res) => {
          $(".modalPathBody").append(`
              <div class="modalPathHeadder">
                <div class="originalFileNmae">
                  <span style="padding: 0 10px;">${
                    res?.originalFileName ? res?.originalFileName : "-"
                  }</span>
                </div>
                <div class="originalFileNmae">
                  <span style="padding: 0 10px;">${
                    res?.objectName ? res?.objectName : "-"
                  }</span>
                </div>
                <div class="srcPathModal">
                  <span style="padding: 0 10px;" id="modalLinksPath" title="${
                    res?.sourceUrl
                  }">${res?.sourceUrl ? res?.sourceUrl : "-"}</span>
                </div>
                <div class="dstnPathModal">
                  <span style="padding: 0 10px;" id="modalLinksPath" title="${
                    res?.destUrl
                  }">${res?.destUrl ? res?.destUrl : "-"}</span>
                  </div>
                  <div class="statusModal">
                  <span class="span-${
                    res?.processStatus
                  }" style="padding: 0 10px;">${
            jobStatus[res?.processStatus]
              ? jobStatus[res?.processStatus]
              : res?.processStatus
          }</span>
                  </div>
                  </div>
              `);
        });
      }
      if (data?.length === 50) {
        getFileSrcDstnPath(wsId, srcId, Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

$("#closeLinksModal").on("click", function () {
  $(".modalPaths-Parent").css("display", "none");
});

$("#scanLinksCTA").on("click", function () {
  startScanLinks();
});

function startScanLinks() {
  $("#CFShowLoading").show();
  let srcAdminCldId = localStorage.lnKxSourceCldId;
  let userId = CFManageCloudAccountsAjaxCall.getUserId();
  let selectedPreScan = [];
  $.each($("input[id=selectPreScanUser]:checked"), function () {
    let preScanObj = {
      userId: userId,
      sourceAdminCloudId: srcAdminCldId,
      sourceCloudId: $(this).attr("cloudid"),
    };
    selectedPreScan.push(preScanObj);
  });
  $.ajax({
    type: "POST",
    url: `${apicallurl}/hyperlinks/scanForLink`,
    data: JSON.stringify(selectedPreScan),
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      alertSuccess("Pre Scan Initiated Successfully");
      selectedPreScan.map((res) => {
        $('[scancid="cloud_' + res?.sourceCloudId + '"]')
          .removeClass("span-Not_Scaned")
          .addClass("span-IN_PROGRESS")
          .html("In Progress");
      });

      $("#scanLinksCTA").addClass("disabled");
      $('[id="selectPreScanUser"]').prop("checked", false);
      $("#selAllLinkScan").prop("checked", false);

      getLinkExPreMigrationUsers(1, "PRESCAN");
      getPreScanSummary();
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

$(document).on("click", "#selectPreScanUser", function () {
  if ($('[id="selectPreScanUser"]:checked').length > 0) {
    $("#scanLinksCTA").removeClass("disabled");
  } else {
    $("#scanLinksCTA").addClass("disabled");
  }
  if (
    $('[id="selectPreScanUser"]').length ===
    $('[id="selectPreScanUser"]:checked').length
  ) {
    $("#selAllLinkScan").prop("checked", true);
  } else {
    $("#selAllLinkScan").prop("checked", false);
  }
  checkScanStatus();
});

$("#selAllLinkScan").on("click", function () {
  if ($(this).is(":checked")) {
    $("#scanLinksCTA").removeClass("disabled");
    $('[id="selectPreScanUser"]').prop("checked", true);
    $('[id="selectLinkExMappings"]').prop("checked", true);
  } else {
    $("#scanLinksCTA").addClass("disabled");
    $('[id="selectLinkExMappings"]').prop("checked", false);
    $('[id="selectPreScanUser"]').prop("checked", false);
  }
  checkScanStatus();
});

function checkScanStatus() {
  if (
    $('[id="selectLinkExMappings"]:checked').length > 0 ||
    $('[id="selectPreScanUser"]:checked').length > 0
  ) {
    $("#downloadPreScanTable").css({ marginLeft: "0" });
    $("#deleteMultipleWorkSpaces").css({ display: "", marginLeft: "auto" });
  } else {
    $("#downloadPreScanTable").css({ marginLeft: "auto" });
    $("#deleteMultipleWorkSpaces").css({ display: "none", marginLeft: 0 });
  }
  if ($('[id="selectLinkExMappings"]').length > 0) {
    if (
      $('[id="selectLinkExMappings"]:checked').length ===
      $('[id="selectLinkExMappings"]').length
    ) {
      $("#scanLinksCTA").addClass("disabled");
      $("#forNextMove").removeClass("disabled");
      $("#forNextMove").css({
        background: "#0062ff",
        color: "#fff",
        width: "90px",
      });
      $("#scanLinksCTA").css({ background: "#f2f2f2", color: "#454545" });
    } else {
      $("#scanLinksCTA").css({ background: "#0062ff", color: "#fff" });
    }
  }

  if ($('[scanstatus="PROCESSED"]:checked').length > 0) {
    $("#forNextMove").removeClass("disabled");
    $("#forNextMove").css({
      background: "#0062ff",
      color: "#fff",
      width: "90px",
    });
    $("#scanLinksCTA").css({ background: "#f2f2f2", color: "#454545" });
  }

  if ($('[id="selectPreScanUser"]:checked').length > 0) {
    $("#scanLinksCTA").css({ background: "#0062ff", color: "#fff" });
    $("#scanLinksCTA").removeClass("disabled");
  }
}

$("#downloadPreScanTable").on("click", function () {
  downloadMappingsCsvNew();
  alertSuccess("Report Downloaded Successfully");
});

function downloadMappingsCsvNew() {
  let csv_data = [];
  var headForCsv = [
    "Source User",
    "Destination User",
    "Files With Links",
    "Total Links",
    "Total Linked Files",
    "Files With Links Size",
    "Scan Status",
  ];
  var csvrow = [];
  for (var m = 0; m < headForCsv.length; m++) {
    csvrow.push(headForCsv[m]);
  }
  csv_data.push(csvrow.join(","));
  let scs = $(".linkEx-preScan-usersTable-bodyData");
  for (let x = 0; x < scs.length; x++) {
    let ad = $(scs)[x];
    let csvrow = [];
    for (let m = 0; m < 8; m++) {
      if (m !== 0) {
        csvrow.push($(ad)?.find("div")[m].textContent.trim());
      }
    }
    csv_data.push(csvrow.join(","));
  }
  csv_data = csv_data.join("\n");
  downloadCSVFileTemp(csv_data, "Pre-Scan_User_Data");
}

function downloadCSVFileTemp(csv_data, from) {
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });
  var temp_link = document.createElement("a");
  temp_link.download = from + ".csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);
  temp_link.click();
  document.body.removeChild(temp_link);
}

function createHyperLinkWorkspace(mappingList) {
  CFNewLoader("show");
  if (mappingList.length === 0) {
    alertError("No Mappings Found");
    return false;
  }
  $.ajax({
    type: "POST",
    url: `${apicallurl}/hyperlinks/workspace/create`,
    data: JSON.stringify(mappingList),
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Content-Type": "application/json",
    },
    success: function (data) {
      CFNewLoader();
      getLinkExPreMigrationUsers();
      console.log("HyperLink Workspaces Created Successfully");
      console.log(data);
    },
    error: function (err) {
      alertError("Failed To Create HyperLink WorkSpace");
      CFNewLoader();
    },
  });
}

function createHyperLinkWorkspaceSpo() {
  CFNewLoader("show");
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/workspace/create/${localStorage.lnKxCSVId}?userId=${localStorage.UserId}`,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Content-Type": "application/json",
    },
    success: function (data) {
      CFNewLoader();
      getLinkExPreMigrationUsers();
      console.log("HyperLink Workspaces Created Successfully");
      console.log(data);
    },
    error: function (err) {
      alertError("Failed To Create HyperLink WorkSpace");
      CFNewLoader();
    },
  });
}

function checkHyperLinkCsvStatus() {
  $.ajax({
    type: "POST",
    url: `${apicallurl}/hyperlinks/check/csvvalidationstatus/${localStorage.lnKxCSVId}`,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      console.log(data);
    },
  });
}
