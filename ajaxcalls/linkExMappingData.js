var jobStatus = {
  PAUSE: "Pause",
  STARTED: "Started",
  CANCEL: "Canceled",
  CONFLICT: "Conflict",
  IN_QUEUE: "In Queue",
  SUSPENDED: "Suspended",
  PROCESSED: "Processed",
  COMPLETED: "Completed",
  NOT_STARTED: "In Queue",
  NOT_PROCESSED: "Not Processed",
  LINK_WS_CREATED: "Link Created",
  IN_PROGRESS: "In Progress",
  SCAN_IN_PROGRESS: "In Progress",
  NOT_PROCESSED: "Not Processed",
  METADATA_STARTED: "Metadata Started",
  MOVE_IN_PROGRESS: "In Progress",
  PARTIALLY_COMPLETED: "Partially Completed",
  MULTIUSERTRAIL_COMPLETED: "Trial Completed",
  PROCESSED_WITH_CONFLICTS: "Processed With Conflicts",
  PROCESSED_WITH_SOME_CONFLICTS: "Processed With Some Conflicts",
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
    $("#forNextMove").css({ background: "#0062ff", color: "#fff" });
    $("#forNextMove span").text("Fix Links");
    $("#forNextMove i").hide();
    $("#forNextMove").addClass("disabled");
    getLinkExPreMigrationUsers();
    getPreScanSummary();
  } else {
    startFixLinks();
    // $("#modalBatchCreate").css("display", "flex");
    // $("#newBatchName").focus();
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
    $("#forNextMove").css({ background: "#f2f2f2", color: "#454545" });
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
    $("#forNextMove").css({ background: "#f2f2f2", color: "#454545" });
    $("#forNextMove span").text("Next");
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
      $("#forNextMove").css({ background: "#f2f2f2", color: "#454545" });
      $("#forNextMove span").text("Next");
      $("#forNextMove i").show();
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
      if (
        $("#srcClouds input:checked").length &&
        $("#dstClouds input:checked").length
      )
        $("#forNextMove").removeClass("disabled");
      $("#mappingClouds").css("display", "");
      $("#linkEx-PreScan").css("display", "none");
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

function getLinkExPreMigrationUsers(pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $(".linkEx-preScan-usersTable-Body").html("");
  }
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/hyperlinks/getHyperLinkWorkspaces?userId=" +
      CFManageCloudAccountsAjaxCall.getUserId() +
      "&page_nbr=" +
      pageNo +
      "&page_size=50&matchBy=all",
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      if (data.length > 0) {
        data?.map((res, index) => {
          $(".linkEx-preScan-usersTable-Body").append(`
        <div class="linkEx-preScan-usersTable-bodyData">
        <div class="placeSelectPreScanAll">
          <input type="checkbox" style="margin: 0" id="selectPreScanUser" wsid="${
            res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id
          }"/>
        </div>
        <div class="placeUserEmail preScanDone"><span id="linkEx-reportsUser" wsid="${
          res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id
        }">${res?.fromMailId ? res?.fromMailId : "-"}<br/>${
            res?.sourceFolderPath
          }</span></div>
        <div class="placeUserEmail preScanDone"><span id="linkEx-reportsUser" wsid="${
          res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id
        }">${res?.toMailId ? res?.toMailId : "-"}<br />${
            res?.destFolderPath
          }</span></div>
        <div class="placeTotalOroginalFiles">
          <span>${res?.totalFiles}</span>
        </div>
        <div class="placeTotalLinks">
          <span>${res?.totalFilesWithLinks}</span>
        </div>
        <div class="placeTotalLinksFiles">
          <span>${CFManageCloudAccountsAjaxCall.getObjectSize(
            res?.totalOriginalFilesSize
          )}</span>
        </div>
        <div class="placeScanStatus">
          <span class="span-${res?.processStatus}">${
            jobStatus[res?.processStatus]
          }</span>
        </div>
      </div>
        `);
        });
      }
      if (data.length === 50) {
        getLinkExPreMigrationUsers(Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
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

// <div class="linkExTotalLinks"><span>${res?.totalFiles}</span></div>
// <div class="linkExmigratedLinks">
//   <span>${res?.totalFilesWithLinks}</span>
// </div>
function getLinkExJobs(pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }

  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $(".jobLevelReports-Body").html("");
  }
  //&report=true
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/getHyperLinkJobs?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    // url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkJobs?userId=619b6085c2dc682aa94a2c92&page_nbr=${pageNo}&page_size=50&matchBy=all`,
    async: true,
    headers: {
      "Content-Type": "application/json",
      // Authorization:
      //   "Basic NjE5YjYwODVjMmRjNjgyYWE5NGEyYzkyOjE3MTRjYjRkZjM1NWU4NWRlMDhjNTE4YTNmM2Y2YzQ2",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      if (data) {
        data?.map((res, index) => {
          $(".jobLevelReports-Body").append(`
          <div class="jobLevelReports-Title" style="justify-content: space-between;">
          <div class="linkExJobName"><span id="moveToLinkExWorkSpaces" jobid="${
            res?.jobId
          }">LinkEx-${data?.length - index}</span></div>
          <div class="linkExProcessedOn">
            <span>${getDateConversion(res?.modifiedTime)}</span>
          </div>
          <div class="linkExStatus"><span class="span-${res?.processStatus}">${
            jobStatus[res?.processStatus]
          }</span></div>
        </div>
          `);
        });
      }
      if (data.length === 50) {
        getLinkExJobs(Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
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
  $(".fileFolderLevelReports").css("display", "none");
  // getWorkSpaceReports($(this).attr("jobid"), 1);
});

function getWorkSpaceReports(jobId, pageNo) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 1;
  }
  if (pageNo === 1) {
    $("#CFShowLoading").show();
    $(".workSpaceLevelReports-Body").html("");
  }
  // &report=true
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/getHyperLinkWorkspaces?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all&jobId=${jobId}&linkEx=true`,
    // url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinkWorkspaces?userId=619b6085c2dc682aa94a2c92&page_nbr=${pageNo}&page_size=50&matchBy=all&jobId=${jobId}`,
    async: true,
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
          $(".workSpaceLevelReports-Body").append(`
          <div class="jobLevelReports-Title">
          <div class="linkExJobName"><span id="moveToLinkExWorkSpacesFiles" wsid="${
            res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id
          }">${res?.fromMailId}</span></div>
          <div class="linkExTotalLinks"><span>${res?.totalFiles}</span></div>
          <div class="linkExmigratedLinks">
            <span>${res?.totalFilesWithLinks}</span>
          </div>
          <div class="linkExProcessedOn">
            <span>${getDateConversion(res?.modifiedTime)}</span>
          </div>
          <div class="linkExStatus" style="position: relative;"><span class="span-${
            res?.processStatus
          }">${jobStatus[res?.processStatus]}</span>
          <span style="position: absolute;right: 10px;cursor: pointer;" sourceid="null" id="downloadWorkSpaceCSV" wsmail="${
            res?.fromMailId
          }" wsid="${res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id}">
          <i class="lnil lnil-download" id="icon-${res?.moveWorkSpaceId}"></i>
          </span>
          </div>
        </div>
          `);
        });
      }
      if (data.length === 50) {
        getWorkSpaceReports(jobId, Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
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
    $("#CFShowLoading").show();
    $(".fileFolderLevelReports-Body").html("");
  }
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/getHyperLinks?userId=${CFManageCloudAccountsAjaxCall.getUserId()}&page_nbr=${pageNo}&page_size=50&matchBy=all&moveWorkSpaceId=${wsId}`,
    // url: `https://staging.cloudfuze.com/proxyservices/v1/hyperlinks/getHyperLinks?userId=619b6085c2dc682aa94a2c92&page_nbr=${pageNo}&page_size=50&matchBy=all&moveWorkSpaceId=${wsId}`,
    async: true,
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
          $(".fileFolderLevelReports-Body").append(`
          <div class="jobLevelReports-Title">
          <div class="linkExJobName" style="width:20%;"><div class="alignWorkSpaceFolder">
          <img src="../img/fileTypes/${getFileIcons(
            res?.sourceObjectName
          )}" class="tableImg" alt="icon" />
          <span id="getSrcDstnPath" wsid="${
            res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id
          }" title="${res?.sourceObjectName}" srcid="${res?.sourceId}">${
            res?.sourceObjectName
          }</span></div></div>
          <div class="linkExTotalLinks" style="width:20%;"><span id="getSrcDstnPath" wsid="${
            res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id
          }" srcid="${res?.sourceId}" title="${res?.sourcePath}">${
            res?.sourcePath ? res?.sourcePath : "-"
          }</span></div>
          <div class="linkExmigratedLinks" style="width:11%;">
            <span>${CFManageCloudAccountsAjaxCall.getObjectSize(
              res?.objectSize
            )}</span>
          </div>
          <div class="linkExmigratedLinks" style="width:11%;">
            <span>${res?.links}</span>
          </div>
          <div class="linkExmigratedLinks" style="width:11%;">
            <span>${res?.noOfProcessedLinks}</span>
          </div>
          <div class="linkExProcessedOn" style="width:15%;">
            <span>${getDateConversion(res?.endTime)}</span>
          </div>
          <div class="linkExStatus" style="width:12%;position: relative;"><span class="span-${
            res?.processStatus
          }">${
            jobStatus[res?.processStatus]
              ? jobStatus[res?.processStatus]
              : res?.processStatus
          }</span>
          <span style="position: absolute;right: 10px;cursor: pointer;" sourceid="${
            res?.sourceId
          }" id="downloadWorkSpaceCSV" wsmail="${
            res?.sourceObjectName
          }" wsid="${res?.moveWorkSpaceId ? res?.moveWorkSpaceId : res?.id}">
          <i class="lnil lnil-download" id="icon-${res?.sourceId}"></i>
          </span>
          </div>
        </div>
          `);
        });
      }
      if (data.length === 50) {
        getWorkSpaceFilesReports(wsId, Number(pageNo) + 1);
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
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
                              ? res?.moveWorkSpaceId
                              : res?.id
                          }" srcid="${res?.sourceId}">${
            res?.sourceObjectName
          }</span>
                      </div>
                      </div>
                      </div>
                      <div class="placeFilePath"><span title="${
                        res?.sourcePath
                      }">${res?.sourcePath ? res?.sourcePath : "-"}</span></div>
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
      "/hyperlinks/hyperLinkSummary?userId=" +
      CFManageCloudAccountsAjaxCall.getUserId(),
    async: true,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#link-preScan-totalUsers").html(data?.totalUsers);
      $("#link-preScan-totalOriginalFiles").html(data?.totalFiles);
      $("#link-preScan-totalLinks").html(data?.totalFilesWithLinks);
      $("#link-preScan-totalLinkFiles").html("0");
      $("#link-preScan-dataSize").html(
        CFManageCloudAccountsAjaxCall.getObjectSize(
          data?.totalOriginalFilesSize
        )
      );
    },
  });
}

$(document).on("click", "#getSrcDstnPath", function () {
  getFileSrcDstnPath($(this).attr("wsid"), $(this).attr("srcid"), 1);
});

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

function startFixLinks() {
  CFNewLoader("show", "Initiating Link Fix Please Wait");
  let selectedWorkSpaces = [];
  $.each($("input[id=selectPreScanUser]:checked"), function () {
    selectedWorkSpaces.push($(this).attr("wsid"));
  });
  $.ajax({
    type: "POST",
    url: apicallurl + "/hyperlinks/initiateReplaceLinksForWorkspaces",
    data: JSON.stringify(selectedWorkSpaces),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data === "Replacing Links In Destination") {
        alertSuccess("Initiated successfully");
        setTimeout(function () {
          window.location.href = "linkExReports.html#slack";
        }, 1000);
      }
      CFNewLoader("hide");
    },
    error: function (err) {
      CFNewLoader("hide");
    },
  });
}

$(document).on("click", "#selectPreScanUser", function () {
  if ($('[id="selectPreScanUser"]:checked').length > 0) {
    $("#forNextMove").removeClass("disabled");
  }

  if (
    $('[id="selectPreScanUser"]').length ===
    $('[id="selectPreScanUser"]:checked').length
  ) {
    $("#forNextMove").removeClass("disabled");
    $("#selAllLinkFix").prop("checked", true);
  } else {
    $("#selAllLinkFix").prop("checked", false);
  }
});

$("#selAllLinkFix").on("click", function () {
  if ($(this).is(":checked")) {
    $("#forNextMove").removeClass("disabled");
    $('[id="selectPreScanUser"]').prop("checked", true);
  } else {
    $('[id="selectPreScanUser"]').prop("checked", false);
  }
});

$(document).on("click", ".circleLinks", function () {
  navigator.clipboard.writeText($(this).attr("lnk"));
  alertSuccess("Link copied successfully");
});

$("#upldMappingCsv").on("click", function () {
  $("#collectPreScanCSV").trigger("click");
});

function usersLinkExPreScanCsv() {
  var upload = document.getElementById("collectPreScanCSV").files[0];
  var reader = new FileReader();
  reader.onload = function () {
    csvPreScanMappingsUpload(reader.result);
  };
  reader.readAsText(upload);
  $("#collectPreScanCSV").val("");
}

function csvPreScanMappingsUpload(csvData) {
  console.log(csvData);
}

$(document).on("click", "#downloadWorkSpaceCSV", function () {
  $("#CFShowLoading").show();
  getReportsCSVLinkEx(
    $(this).attr("wsid"),
    $(this).attr("sourceid"),
    $(this).attr("wsmail"),
    "initial"
  );
});

function getReportsCSVLinkEx(wsId, srcId, fileName, mode) {
  let param;
  if (srcId !== "null") {
    param = `moveWorkSpaceId=${wsId}&sourceId=${srcId}`;
  } else {
    param = `moveWorkSpaceId=${wsId}`;
  }
  $.ajax({
    type: "GET",
    url: `${apicallurl}/hyperlinks/linkexReportDownload?${param}`,
    async: true,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (xhr) {
      alertSuccess(
        "Thank you for requesting the report. It is being prepared and will be sent to your email shortly"
      );
      $("#CFShowLoading").hide();
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}
