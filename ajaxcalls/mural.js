let boardMappingCache = [],
  boardsReportsRequest,
  searchBoardsRequest,
  filterBoardsReportsRequest;
var moveStatus = {
  PROCESSED: "Processed",
  RETRYING: "Retrying",
  IN_PROGRESS: "In Progress",
  NOT_PROCESSED: "Not Processed",
  NOT_STARTED: "In queue",
  ERROR: "Error",
  IN_QUEUE: "In queue",
  WARNING: "Warning",
  SUSPENDED: "Suspended",
  PROCESSED_WITH_SOME_ERRORS: "Processed with some errors",
  PROCESSED_WITH_SOME_WARNINGS: "Processed with some warnings",
  PROCESSED_WITH_SOME_CONFLICTS: "Processed with some conflicts",
  CONFLICT: "Conflict",
  CANCEL: "Cancel",
  PAUSE: "Pause",
  PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE:
    "Processed With Some Conflicts and Pause",
  PROCESSED_WITH_SOME_PAUSE: "Processed With Some Pause",
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

$(document).ready(function () {
  localStorage.removeItem("selSourceCloud");
  localStorage.removeItem("selDstnCloud");
});

$(document).on("click", 'input[name="sourceCloud"]', function () {
  localStorage.setItem("selSourceCloud", $(this).attr("cloudname"));
  localStorage.setItem("namespaceid", $(this).attr("namespaceid"));
  localStorage.setItem("admincloudid", $(this).attr("admincloudid"));
  console.log($(this).attr("cloudname"));
  trackSelectedClouds();
});

$(document).on("click", 'input[name="dstCloud"]', function () {
  localStorage.setItem("selDstnCloud", $(this).attr("cloudname"));
  console.log($(this).attr("cloudname"));
  trackSelectedClouds();
});

function trackSelectedClouds() {
  let selectedSource = localStorage.getItem("selSourceCloud") ?? "";
  let selectedDestination = localStorage.getItem("selDstnCloud") ?? "";
  console.log(selectedSource, selectedDestination);
  if (selectedSource === "LUCID") {
    $('[data-target="PreMigration"]').css("display", "none");
    $('[data-target="PreMigration"]').attr("data-val", "10");
    $('[data-target="Mapping"]').attr("data-val", "2");
    $('[data-target="Mapping"]').find(".badge").html("2");
    $('[data-target="options"]').find(".badge").html("3");
    $('[data-target="options"]').attr("data-val", "3");
    // $('[data-target="options"]').css("display", "none");
    $('[data-target="Migration"]').find(".badge").html("4");
    $('[data-target="Migration"]').css("data-val", "4");
  } else {
    $('[data-target="PreMigration"]').css("display", "");
    $('[data-target="PreMigration"]').attr("data-val", "2");
    $('[data-target="Mapping"]').css("data-val", "3");
    $('[data-target="Mapping"]').find(".badge").html("3");
    $('[data-target="options"]').find(".badge").html("4");
    $('[data-target="options"]').css("data-val", "4");
    $('[data-target="options"]').css("display", "");
    $('[data-target="Migration"]').find(".badge").html("5");
    $('[data-target="Migration"]').css("data-val", "5");
  }
}

$("#forNextMove").click(function () {
  $(".ui-helper-hidden-accessible").hide();
  $("#forPreviousMove").removeClass("disabled");
  //    $("#forNextMove").addClass("disabled");
  var _step = parseInt($("#forNextMove").attr("data-step"));
  _step = _step + 1;
  if (_step == 0) return false;
  else if (_step == 1) {
    $("#muralPreMigration").css("display", "none");
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#forPreviousMove").addClass("disabled");
    $("#mappingClouds").css("display", "");
    $("#mappingUsers").css("display", "none");
    $("#mappingPreMigration").css("display", "none");
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
    var orgName = CFManageCloudAccountsAjaxCall.getMaxChars(
      localStorage.MirowebUrl,
      10
    );
    $(".sourceWorkspaceTitle")
      .eq("1")
      .html(orgName + " Organization");
    $(".sourceWorkspaceTitle")
      .eq("1")
      .attr("title", localStorage.MirowebUrl + " Organization");
    $("#appendWorkSpaceData").html("");
    $("#appendWorkspaces").html("");
    $("#miroAppendWorkspaces").html("");
    localStorage.setItem(
      "multiUsrSrcCldName",
      $("#srcClouds input[name=sourceCloud]:checked").attr("cloudname")
    );

    localStorage.setItem(
      "multiUsrDstnCldName",
      $("#dstClouds input[name=dstCloud]:checked").attr("cloudname")
    );
    localStorage.setItem(
      "multiUsrSrcCldId",
      $("#srcClouds input[name=sourceCloud]:checked").attr("id")
    );
    localStorage.setItem(
      "multiUsrDstnCldId",
      $("#dstClouds input[name=dstCloud]:checked").attr("id")
    );
    localStorage.setItem(
      "multiUsrDstnEmail",
      $("#dstClouds input[name=dstCloud]:checked").attr("mail")
    );
    localStorage.setItem(
      "multiUsrSrcEmail",
      $("#srcClouds input[name=sourceCloud]:checked").attr("mail")
    );
    // getBoards();
    // getWorkSpaceMiro();
    var $srcChkd = $("#srcClouds input[name=sourceCloud]:checked"),
      $dstChkd = $("#dstClouds input[name=dstCloud]:checked");
    var _cldDtls = {
      srcCldName: $($srcChkd).siblings(".migrateImg").children().attr("id"),
      dstCldName: $($dstChkd).siblings(".migrateImg").children().attr("id"),
      srcAdminName: CFManageCloudAccountsAjaxCall.getMaxChars(
        $($srcChkd).parent().siblings().find("h5").text(),
        20
      ),
      dstAdminName: CFManageCloudAccountsAjaxCall.getMaxChars(
        $($dstChkd).parent().siblings().find("h5").text(),
        20
      ),
    };
    if (localStorage.multiUsrSrcCldName === "LUCID") {
      getLucidBoards("/", 1, 50);
      getWorkSpaceMiro();
      $("#changeSouceTitle").html("Lucid");
      $(".sourceImageCloud").attr("id", "LUCID");
      $("#muralPreMigration").css("display", "none");
      $("#mappingPreMigration").css("display", "");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#forNextMove").addClass("disabled");
      // $("#forNextMove").css({ width: "auto" });
      // $("#forNextMove span").text("Start Migration");
      $(".emailMappingTab").css("display", "flex");
    } else {
      getPreMigrationStatus();
      $("#forNextMove").removeClass("disabled");
      $("#muralPreMigration").css("display", "");
      $("#mappingPreMigration").css("display", "none");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#forNextMove span").text("Next");
      $(".emailMappingTab").css("display", "none");
    }
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    //$("#forNextMove").addClass("disabled");
    //$("#forNextMove").css({"width": "140px", "margin-left": "90%"});
    // $("#forNextMove span").text("Next");
    $("#migrationOptions").css("display", "none");
    $("#muralJobOptions").css("display", "none");
  } else if (_step == 3) {
    $("#muralPreMigration").css("display", "none");
    if (localStorage.multiUsrSrcCldName === "LUCID") {
      selectedBoards = [];
      $("#forNextMove").css({ width: "auto" });
      $("#forNextMove span").text("Start Migration");
      $("#mappingPreMigration").css("display", "none");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#muralJobOptions").css("display", "");
      $("#migrateAsExternalUsers").css("display", "none");
      // migrateBoards();
      $("#sourceOptionCloudName").html(localStorage.multiUsrSrcCldName);
      $("#dstnOptionCloudName").html(localStorage.multiUsrDstnCldName);
      $("#forNextMove").removeClass("disabled");
    } else {
      $("#migrateAsExternalUsers").css("display", "");
      $(".sourceImageCloud").attr("id", "MURAL");
      $("#changeSouceTitle").html("Mural Workspace");
      getBoards();
      $("#muralJobOptions").css("display", "none");
      $("#mappingPreMigration").css("display", "");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#forNextMove span").text("Next");
      $("#forNextMove").addClass("disabled");
    }

    getWorkSpaceMiro();
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    //$("#forNextMove").css({"width": "140px", "margin-left": "90%"});
    // $("#migrationOptions").css("display", "none");
    // $("#muralJobOptions").css("display", "none");
  } else if (_step == 4) {
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    if (localStorage.multiUsrSrcCldName === "LUCID") {
      selectedBoards = [];
      migrateBoards();
    } else {
      $("#migrateAsExternalUsers").css("display", "");
      $("#sourceOptionCloudName").html(localStorage.multiUsrSrcCldName);
      $("#dstnOptionCloudName").html(localStorage.multiUsrDstnCldName);
      $("#forNextMove").css({ width: "auto" });
      $("#forNextMove span").text("Start Migration");
      $("#mappingPreMigration").css("display", "none");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#muralJobOptions").css("display", "");
    }
  } else if (_step == 5) {
    migrateBoards();
  }
});
$("#forPreviousMove").click(function () {
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
    $("#muralPreMigration").css("display", "none");
    localStorage.removeItem("teamMigrationMappingPopUp");
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#forPreviousMove").addClass("disabled");
    $("#mappingClouds").css("display", "");
    $("#mappingUsers").css("display", "none");
    $("#mappingPreMigration").css("display", "none");
    $("#mappedMigration").css("display", "none");
    $("#mappedSyncMigration").css("display", "none");
    $("#mappingOptions").css("display", "none");
    $("#mappingOptionsNew").css("display", "none");
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
    $("#muralJobOptions").css("display", "none");
  } else if (_step == 2) {
    $("#muralPreMigration").css("display", "");
    $("#muralJobOptions").css("display", "none");
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#mappingClouds").css("display", "none");
    $("#mappingUsers").css("display", "none");
    $("#mappingPreMigration").css("display", "none");
    $("#mappedMigration").css("display", "none");
    $("#mappedSyncMigration").css("display", "none");
    $("#mappingOptions").css("display", "none");
    $("#mappingOptionsNew").css("display", "none");
    if (localStorage.multiUsrSrcCldName === "LUCID") {
      $("#muralPreMigration").css("display", "none");
      $("#mappingPreMigration").css("display", "");
    }
  } else if (_step == 3) {
    $("#muralPreMigration").css("display", "none");
    $("#muralJobOptions").css("display", "none");
    $("#mappingClouds").css("display", "none");
    $("#mappingUsers").css("display", "none");
    $("#mappingPreMigration").css("display", "");
    $("#mappedMigration").css("display", "none");
    $("#mappedSyncMigration").css("display", "none");
    $("#mappingOptions").css("display", "none");
    $("#mappingOptionsNew").css("display", "none");
    if (localStorage.multiUsrSrcCldName === "LUCID") {
      $("#muralPreMigration").css("display", "none");
      $("#mappingPreMigration").css("display", "none");
      $("#muralJobOptions").css("display", "");
    }
  } else if (_step == 4) {
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#mappingClouds").css("display", "none");
    $("#mappingUsers").css("display", "");
    $("#mappingPreMigration").css("display", "none");
    $("#mappedMigration").css("display", "none");
    $("#mappedSyncMigration").css("display", "none");
    $("#mappingOptions").css("display", "none");
    $("#mappingOptionsNew").css("display", "none");
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
$("#teamMigrationWidget ul li").click(function () {
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
      if (
        $("#srcClouds input:checked").length &&
        $("#dstClouds input:checked").length
      )
        $("#forNextMove").removeClass("disabled");
    } else if (_step == 2) {
      $("#forNextMove").removeClass("disabled");
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
    //$("#teamMigrationWidget ul li[data-val=" + (_step + 1) + "]").removeClass("active");
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

pageNumb = 1;

$(document).on("click", "#appendWorkSpaceData", function () {
  if ($("#appendWorkSpaceData").find("input:checked").length > 0) {
    $("#forNextMove").removeClass("disabled");
  } else {
    $("#forNextMove").addClass("disabled");
  }
});

$(document).on("click", "#openDiv", function () {
  $(this).addClass("lnil-chevron-up-circle");
  $(this).attr("id", "closeDiv");
  var folderId = $(this).attr("folderid");
  getBoardsFolder(folderId, 1);
  $("#appendBoards" + folderId).html("");
});

function getBoardsFolder(folderId, pgNo, nxToken) {
  var userId = localStorage.getItem("UserId");
  var cloudId = localStorage.getItem("multiUsrSrcCldId");

  if (
    nxToken === undefined ||
    nxToken === null ||
    nxToken === "undefined" ||
    nxToken === "null"
  ) {
    var uri =
      apicallurl +
      "/boardservice/userId/" +
      userId +
      "/cloudId/" +
      cloudId +
      "?folderId=" +
      folderId +
      "&page_nbr=" +
      pgNo +
      "&page_size=50";
  } else {
    var uri =
      apicallurl +
      "/boardservice/userId/" +
      userId +
      "/cloudId/" +
      cloudId +
      "?folderId=" +
      folderId +
      "&page_nbr=" +
      pgNo +
      "&page_size=50&nextPreviousId=" +
      nxToken;
  }
  $.ajax({
    type: "GET",
    url: uri,
    //url: apicallurl +"/boardservice/userId/"+userId+"/cloudId/"+cloudId+"?folderId="+folderId+"&page_nbr="+pgNo+"&page_size=20",
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (data.length === 0) {
        console.log("Here");
        return null;
      }
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].nextPageToken === null ||
          data[i].nextPageToken === undefined ||
          data[i].nextPageToken === "null" ||
          data[i].nextPageToken === "undefined"
        ) {
          console.log("Ended");
          localStorage.removeItem("boardNXToken");
        } else {
          localStorage.setItem("boardNXToken", data[i].nextPageToken);
        }
        var _data = data[i];
        $("#appendBoards" + folderId).append(
          '<tr><td style="padding: 5px;"><input type="checkbox" id="boardLevel" fromBoardId="' +
            _data.id +
            '" sourceBoardName="' +
            _data.objectName +
            '" parentBid="' +
            _data.parent +
            '"></td>' +
            "<td>" +
            _data.objectName +
            "</td><td>" +
            _data.objectName +
            "</td></tr>"
        );
      }
      if (data.length > 0) {
        $("#showData" + folderId).css("display", "");
      }
      if (
        data.length === 50 &&
        (localStorage.boardNXToken !== undefined ||
          localStorage.boardNXToken !== null ||
          localStorage.boardNXToken !== "undefined" ||
          localStorage.boardNXToken !== "null")
      ) {
        pgNo = pgNo + 1;
        getBoardsFolder(folderId, pgNo, localStorage.boardNXToken);
      }
    },
  });
}

function getWorkSpaceMiro() {
  var userId = localStorage.getItem("UserId");
  var cloudId = localStorage.getItem("multiUsrDstnCldId");
  var pgNo = 1;
  let uri =
    apicallurl +
    "/boardservice/miro/userId/" +
    userId +
    "/cloudId/" +
    cloudId +
    "?folderId=/&page_nbr=" +
    pgNo +
    "&page_size=50";

  uri = `http://127.0.0.1:8001/get/miro`;

  $.ajax({
    type: "GET",
    url: uri,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (pgNo === 1) {
        $("#miroAppendWorkspaces").html("");
      }
      for (let i = 0; i < data.length; i++) {
        var _data = data[i];
        var wid = _data.id;
        var appendID = wid.replaceAll("/", "_");
        localStorage.setItem("dstnTeamName", _data.objectName);
        // $('[id="miroWorkspaceNameLucid"]').append(
        //   CFManageCloudAccountsAjaxCall.getMaxChars(_data.objectName, 20)
        // );
        $("#miroAppendWorkspaces").append(
          '<div class="row justify-content-start muralWorkspaces"><div class="my-auto text-center">' +
            '<i class="lnil lnil-chevron-down-circle" style="color: #0062ff;cursor:pointer;" id="openProject" wid="' +
            _data.id +
            '"></i>' +
            '</div><div class="my-auto"><span style="margin-left: -20px" title="' +
            _data.objectName +
            '">' +
            CFManageCloudAccountsAjaxCall.getMaxChars(_data.objectName, 20) +
            "</span></div>" +
            '<div class="my-auto" id="hierachyIndicator" style="position: absolute;right: 15px;">Team</div></div><hr class="hratopenWorkspace" id="hr' +
            appendID +
            '" style="display: none"/><div id="viewRoom' +
            appendID +
            '" style="display:none;"></div>'
        );
      }
    },
  });
}

$(document).on("click", ".lnil-chevron-up-circle", function () {
  $(this)
    .removeClass("lnil-chevron-up-circle")
    .addClass("lnil-chevron-Down-circle");
  var folderId = $(this).attr("folderid");
  $("#showData" + folderId).css("display", "none");
  $("#appendBoards" + folderId).html("");
  $(this).attr("id", "openDiv");
});

function getBoards() {
  var userId = localStorage.getItem("UserId");
  var cloudId = localStorage.getItem("multiUsrSrcCldId");
  var pgNo = 1;
  if (pgNo === 1) {
    $("#appendWorkspaces").html("");
  }
  if (localStorage.multiUsrSrcCldName === "MURAL_STAGING") {
    var uri =
      apicallurl +
      "/boardservice/userId/staging/" +
      userId +
      "/cloudId/" +
      cloudId +
      "?folderId=/&page_nbr=" +
      pgNo +
      "&page_size=50";
  } else {
    var uri =
      apicallurl +
      "/boardservice/userId/" +
      userId +
      "/cloudId/" +
      cloudId +
      "?folderId=/&page_nbr=" +
      pgNo +
      "&page_size=50";
  }

  uri = `http://127.0.0.1:8001/get/mural/Room`;

  $.ajax({
    type: "GET",
    url: uri,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (pgNo === 1) {
        $("#appendWorkspaces").html("");
      }
      for (let i = 0; i < data.length; i++) {
        var _data = data[i];
        $("#appendWorkspaces").append(
          '<div class="row justify-content-start muralWorkspaces" id="workspace' +
            _data.id +
            '">' +
            '<div class="my-auto text-center"><i class="lnil lnil-chevron-down-circle" style="color: #0062ff;cursor:pointer;" id="openRooms" wid="' +
            _data.id +
            '"></i></div>' +
            '<div class="my-auto"><span style="margin-left: -20px;text-overflow: ellipsis;" title="' +
            _data.objectName +
            '">' +
            CFManageCloudAccountsAjaxCall.getMaxChars(_data.objectName, 20) +
            "</span></div>" +
            '<div class="my-auto" id="hierachyIndicator" style="position: absolute;right: 15px;">Workspace</div></div>' +
            '<hr class="hratopenWorkspace" id="hr' +
            _data.id +
            '" style="display: none"/>' +
            '<div id="viewRoom' +
            _data.id +
            '" style="display:none;"></div>'
        );
      }
    },
  });
}

$(document).on("click", "#selectAllBoards", function () {
  var parentId = $(this).attr("boardid");
  if ($(this).is(":checked")) {
    $("[parentbid=" + parentId + "]").prop("checked", true);
  } else {
    $("[parentbid=" + parentId + "]").prop("checked", false);
  }
});

// TO Open Room
$(document).on("click", "#openRooms", function () {
  // alert($(this).attr("wid"));
  var wid = $(this).attr("wid");
  getMuralRooms(wid);
  $(`#hr${wid}`).css("display", "");
  $(`#viewRoom${wid}`).css("display", "");
  $(this)
    .addClass("lnil-chevron-up-circle")
    .removeClass("lnil-chevron-down-circle");
  $(this).attr("id", "closeRoom");
  $(this).parent().parent().addClass("openWorkSpace");
});
//To Close Room
$(document).on("click", "#closeRoom", function () {
  var wid = $(this).attr("wid");
  $(`#hr${wid}`).css("display", "none");
  $(`#viewRoom${wid}`).css("display", "none");
  $(this)
    .addClass("lnil-chevron-down-circle")
    .removeClass("lnil-chevron-up-circle");
  $(this).attr("id", "openRooms");
  $(this).parent().parent().removeClass("openWorkSpace");
});
// To open Mural Folders
$(document).on("click", "#openRoomsMural", function (e) {
  if (e?.target?.attributes?.type?.value === "checkbox") {
    console.log("Selected CheckBox");
  } else {
    var roomId = $(this).attr("rid");
    var appendID = roomId.replaceAll("/", "_");
    $(this).attr("id", "closeRoomMural");
    $(this).find("i").addClass("fa-folder-open").removeClass("fa-folder");
    $("#showFolders" + appendID).css("display", "");
    getMuralFolders(roomId);
  }
});
//TO close Mural Folders
$(document).on("click", "#closeRoomMural", function () {
  var roomId = $(this).attr("rid");
  var appendID = roomId.replaceAll("/", "_");
  $(this).attr("id", "openRoomsMural");
  $(this).find("i").addClass("fa-folder").removeClass("fa-folder-open");
  $("#showFolders" + appendID).css("display", "none");
});
$(document).on("click", "#openProject", function () {
  // alert($(this).attr("wid"));
  var wid = $(this).attr("wid");
  var appendID = wid.replaceAll("/", "_");
  getMiroProjects(wid);
  $(`#hr${appendID}`).css("display", "");
  $(`#viewRoom${appendID}`).css("display", "");
  $(this)
    .addClass("lnil-chevron-up-circle")
    .removeClass("lnil-chevron-down-circle");
  $(this).attr("id", "closeProject");
  $(this).parent().parent().addClass("openOrganization");
});
$(document).on("click", "#closeProject", function () {
  $('[name="salescheck"]').click();
  // alert($(this).attr("wid"));
  var wid = $(this).attr("wid");
  var appendID = wid.replaceAll("/", "_");
  $(`#hr${appendID}`).css("display", "none");
  $(`#viewRoom${appendID}`).css("display", "none");
  $(this)
    .addClass("lnil-chevron-down-circle")
    .removeClass("lnil-chevron-up-circle");
  $(this).attr("id", "openProject");
  $(this).parent().parent().removeClass("openOrganization");
});

function getMiroProjects(wid) {
  var userId = localStorage.getItem("UserId");
  var cloudId = localStorage.getItem("multiUsrDstnCldId");
  var pgNo = 1;
  let uri;

  uri =
    apicallurl +
    "/boardservice/miro/userId/" +
    userId +
    "/cloudId/" +
    cloudId +
    "?folderId=" +
    wid +
    "&page_nbr=" +
    pgNo +
    "&page_size=50";

  uri = `http://127.0.0.1:8001/get/miro/project`;

  $.ajax({
    type: "GET",
    url: uri,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      var appendID = wid.replaceAll("/", "_");
      if (pgNo === 1) {
        $("#viewRoom" + appendID).html("");
      }
      for (let i = 0; i < data.length; i++) {
        var _data = data[i];
        //id="openBoardMiro"
        $("#viewRoom" + appendID).append(
          '<div class="justify-content-start" style="display: flex;align-items: center;"><div class="my-auto text-center" rid="' +
            _data.id +
            '">' +
            '<input type="radio" name="salescheck" class="dstnMiro" style="margin-left: 40px;margin-top:6px;"/><!--<i class="fa fa-caret-right" aria-hidden="true" style="margin-left: 5px"></i>-->' +
            '<span style="font-size: 14px; margin-left: 7px;margin-top: 0px;position: absolute;" title="' +
            _data.objectName +
            '">' +
            CFManageCloudAccountsAjaxCall.getMaxChars(_data.objectName, 16) +
            "</span></div>" +
            '<div class="my-auto" style="margin-left: auto" id="hierachyIndicator">Project</div></div>'
        );
        $('[name="salescheck"]').click();
      }
    },
  });
}

function getMuralRooms(wid) {
  var userId = localStorage.getItem("UserId");
  var cloudId = localStorage.getItem("multiUsrSrcCldId");
  var pgNo = 1;
  if (localStorage.multiUsrSrcCldName === "MURAL_STAGING") {
    var uri =
      apicallurl +
      "/boardservice/userId/staging/" +
      userId +
      "/cloudId/" +
      cloudId +
      "?folderId=" +
      wid +
      "&page_nbr=" +
      pgNo +
      "&page_size=50";
  } else {
    var uri =
      apicallurl +
      "/boardservice/userId/" +
      userId +
      "/cloudId/" +
      cloudId +
      "?folderId=" +
      wid +
      "&page_nbr=" +
      pgNo +
      "&page_size=50";
  }
  uri = `http://127.0.0.1:8001/get/mural/Folders`;
  $.ajax({
    type: "GET",
    url: uri,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (pgNo === 1) {
        $("#viewRoom" + wid).html("");
      }
      for (let i = 0; i < data.length; i++) {
        var _data = data[i];
        var appendID = _data.id;
        var objName;
        if (
          _data.objectName === null ||
          _data.objectName === undefined ||
          _data.objectName === "null" ||
          _data.objectName === "undefined"
        ) {
          objName = "-";
        } else {
          objName = _data.objectName;
        }
        let isFolder;
        if (_data?.type === "ROOM") {
          isFolder = true;
        } else {
          isFolder = false;
        }
        appendID = appendID.replaceAll("/", "_");
        $("#viewRoom" + wid).append(
          '<div class="justify-content-start" id="roomsBody"><div class="my-auto text-center" style="cursor:pointer;" id="openRoomsMural" rid="' +
            _data.id +
            '">' +
            '<span style="padding: 0 10px;display: flex;align-items: center;"><input type="checkbox" isfolder="' +
            isFolder +
            '" id="boardLevel" fromBoardId="' +
            _data.id +
            '" sourceBoardName="' +
            objName +
            '" parentBid="' +
            _data.parent +
            '" style="margin: 0;"></span><i class="fa fa-folder" aria-hidden="true"></i><span style="font-size: 14px; margin-left: 5px;text-overflow: ellipsis;" title="' +
            _data.objectName +
            '">' +
            CFManageCloudAccountsAjaxCall.getMaxChars(objName, 20) +
            "</span></div>" +
            '<div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Room</div></div><div id="showFolders' +
            appendID +
            '" style="display:none;"></div>'
        );
      }
    },
  });
}
function getMuralFolders(roomId, pgNo, folderNxToken) {
  var userId = localStorage.getItem("UserId");
  var cloudId = localStorage.getItem("multiUsrSrcCldId");
  if (pgNo === undefined) pgNo = 1;
  if (localStorage.multiUsrSrcCldName === "MURAL_STAGING") {
    if (folderNxToken === undefined || pgNo === 1) {
      var uri =
        apicallurl +
        "/boardservice/userId/staging/" +
        userId +
        "/cloudId/" +
        cloudId +
        "?folderId=" +
        roomId +
        "&page_nbr=" +
        pgNo +
        "&page_size=50";
    } else {
      var uri =
        apicallurl +
        "/boardservice/userId/staging/" +
        userId +
        "/cloudId/" +
        cloudId +
        "?folderId=" +
        roomId +
        "&page_nbr=" +
        pgNo +
        "&page_size=50&nextPreviousId=" +
        folderNxToken;
    }
  } else {
    if (folderNxToken === undefined || pgNo === 1) {
      var uri =
        apicallurl +
        "/boardservice/userId/" +
        userId +
        "/cloudId/" +
        cloudId +
        "?folderId=" +
        roomId +
        "&page_nbr=" +
        pgNo +
        "&page_size=50";
    } else {
      var uri =
        apicallurl +
        "/boardservice/userId/" +
        userId +
        "/cloudId/" +
        cloudId +
        "?folderId=" +
        roomId +
        "&page_nbr=" +
        pgNo +
        "&page_size=50&nextPreviousId=" +
        folderNxToken;
    }
  }
  uri = "http://localhost:8001/getFolders";
  $.ajax({
    type: "GET",
    url: uri,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      var appendID = roomId.replaceAll("/", "_");
      if (pgNo === 1) {
        $("#showFolders" + appendID).html("");
      }
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].nextPageToken === null ||
          data[i].nextPageToken === undefined ||
          data[i].nextPageToken === "null" ||
          data[i].nextPageToken === "undefined"
        ) {
          console.log("Ended");
          localStorage.removeItem("muralBoardNXToken");
        } else {
          localStorage.setItem("muralBoardNXToken", data[i].nextPageToken);
        }
        var objName;
        var _data = data[i];
        if (
          _data.objectName === null ||
          _data.objectName === undefined ||
          _data.objectName === "null" ||
          _data.objectName === "undefined"
        ) {
          objName = "-";
        } else {
          objName = _data.objectName;
          var pl = /\</g;
          var pl1 = /\>/g;
          var pl2 = /\"/g;
          var pl3 = /\'/g;
          objName = objName
            .replace(pl, "&lt;")
            .replace(pl1, "&gt;")
            .replace(pl2, "&quot;")
            .replace(pl3, "&apos;");
        }
        let isFolder;
        if (_data?.type === "ROOM") {
          isFolder = true;
        } else {
          isFolder = false;
        }
        let isDisabled;
        $("#showFolders" + appendID).append(
          '<div class="" id="viewMural"><div class="my-auto text-center">' +
            '<span class="selectMuralSPAN"><input type="checkbox" id="boardLevel" isfolder="' +
            isFolder +
            '" fromBoardId="' +
            _data.id +
            '" sourceBoardName="' +
            objName +
            '" parentBid="' +
            _data.parent +
            '"><span title="' +
            objName +
            '" disabled="' +
            isDisabled +
            '">' +
            CFManageCloudAccountsAjaxCall.getMaxChars(objName, 20) +
            "</span></span></div>" +
            '<div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Mural</div></div>'
        );
      }
      if (data.length === 50 && localStorage.muralBoardNXToken !== null) {
        var pageNo = Number(pgNo);
        pageNo = pageNo + 1;
        getMuralFolders(roomId, pageNo, localStorage.muralBoardNXToken);
      }
      if (roomId) {
        if (
          $('[fromboardid="' + roomId + '"]').prop("disabled") ||
          $('[fromboardid="' + roomId + '"]').is(":checked")
        ) {
          $('[parentbid="' + roomId + '"]')
            .prop("checked", false)
            .prop("disabled", true);
        }
      }
    },
  });
}
function migrateBoards() {
  $("#forNextMove").addClass("disabled");
  $("#loaderTextS").html("Preparing to initiate migration, please wait...");
  $("#CFShowLoading").modal("show");
  let isExternalUsersMigration, isCollaborationsMove;
  if ($("#externalUsersMigration:checked").length > 0) {
    isExternalUsersMigration = true;
  } else {
    isExternalUsersMigration = false;
  }
  if ($("#collaborationsMove:checked").length > 0) {
    isCollaborationsMove = true;
  } else {
    isCollaborationsMove = false;
  }
  let selectedBoards = [];
  var _len = $("input[id=mappingSelect]:checked").length;
  console.log(_len);
  if (_len != 0) {
    $.each($("input[id=mappingSelect]:checked"), function () {
      var obj = {
        userId: localStorage.getItem("UserId"),
        fromCloudId: localStorage.getItem("multiUsrSrcCldId"),
        fromCloudName: localStorage.getItem("multiUsrSrcCldName"),
        toCloudId: localStorage.getItem("multiUsrDstnCldId"),
        toCloudName: localStorage.getItem("multiUsrDstnCldName"),
        fromMailId: localStorage.getItem("multiUsrSrcEmail"),
        toMailId: localStorage.getItem("multiUsrDstnEmail"),
        fromBoardId: $(this).attr("fromboardid"),
        authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
        sourceBoardName: $(this).attr("sourceboardname"),
        folderMigration: $(this).attr("isfolder") === "true" ? true : false,
      };
      if (localStorage.selSourceCloud === "LUCID") {
        // obj.accountId = localStorage.namespaceid;
        obj.fromAdminCloudId =
          localStorage.admincloudid === "null"
            ? null
            : localStorage.admincloudid;
      }
      selectedBoards.push(obj);
    });
  }
  localStorage.setItem("SelectedObject", JSON.stringify(selectedBoards));
  $.ajax({
    type: "POST",
    async: true,
    url:
      apicallurl +
      `/boardservice/initiate/migration?externalUsersMigration=${isExternalUsersMigration}&collaborationsMove=${isCollaborationsMove}`,
    data: JSON.stringify(selectedBoards),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#CFShowLoading").modal("hide");
      alertSuccess("Migration Initated Succesfully");
      window.location.href = "reports.html#mural";
    },
    error: function (err) {
      $("#CFShowLoading").modal("hide");
      alertError("Failed To Initiate Migration");
    },
  });
}

$(document).on("click", '#boardLevel,[name="salescheck"]', function () {
  if ($('[isfolder="true"]:checked').length > 5) {
    alertError(
      "The folder level mapping limit of 5 from the source has been reached."
    );
    $(this).prop("checked", false);
  } else if (
    $('[id="boardLevel"]:checked').length > 0 &&
    $('[name="salescheck"]:checked').length > 0
  ) {
    appendSelectedMapping();
  }

  if ($("#multiUserTabForLucid").hasClass("active")) {
    if ($('[id="boardLevel"]:checked').length > 0) {
      $("#forNextMove").removeClass("disabled");
    } else {
      $("#forNextMove").addClass("disabled");
    }
  }
});

$(document).on("click", "#muralSummaryReport", function () {
  getMuralCSV();
});

function getMuralCSV() {
  console.log("CSVDOWNLOAD");
  var csv_data = [];
  var headForCsv = [
    "Source Board Name",
    "Destination Board Name",
    "Total Widgets",
    "Processed Widgets",
    "Conflict Widgets",
    "Status",
  ];
  var csvrow = [];
  for (var m = 0; m < headForCsv.length; m++) {
    csvrow.push(headForCsv[m]);
  }
  csv_data.push(csvrow.join(","));
  var tablediv = document.getElementById("directMsgsTable");
  var tablebody = $("#muralReports table tbody");
  var rows = $("#muralReports table tbody tr");
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].querySelectorAll("td,th");
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      if (j === 6) {
        continue;
      }
      csvrow.push(cols[j].innerHTML);
    }
    csv_data.push(csvrow.join(","));
  }
  csv_data = csv_data.join("\n");
  downloadCSVFile(csv_data, "Mural_Report");
}
function downloadCSVFile(csv_data, fileName) {
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });
  var temp_link = document.createElement("a");
  temp_link.download = fileName;
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);
  temp_link.click();
  document.body.removeChild(temp_link);
}

$(document).on("click", "#downloadMuralWorkspaceReports", function () {
  var worspaceId = $(this).attr("worspaceId");
  $.ajax({
    type: "GET",
    url: apicallurl + "/boardservice/download/migrationreport/" + worspaceId,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    complete: function (xhr) {
      var data = xhr.responseText;
      if (xhr.status == 200) {
        var blob = new Blob([data]);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Mural_workspace_report_" + worspaceId + ".csv";
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        link.click();
        $('[worspaceId="' + worspaceId + '"]').addClass("lnil-checkmark");
        $(this).css("color", "#00C64F");
      } else if (xhr.status == 202) {
        $(".alertScs").addClass("show");
        $(".alertScs").removeClass("hide");
        $(".alertScs .msg").html(
          "Thank you for requesting the report. It is being prepared and will be sent to your email shortly"
        );
        // /        alertSuccess("Report is in Progress,will be ready in few minutes");
      }
    },
  });
});

$(document).on("click", '[id="remoteActionsMiro"]', function () {
  var workspaceId = $(this).attr("worspaceid");
  var remoteStatus = $(this).attr("status");
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/boardservice/cancelorpauseorresumemigration/" +
      workspaceId +
      "/" +
      remoteStatus,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (data.statusCode === "OK") {
        getMuralReports(1);
      }
    },
  });
});

$(document).on("change", "#collaborationsMove", function () {
  if ($(this).is(":checked")) {
    $("#collaborationsMoveTrue").removeClass("switchDisable");
    $("#collaborationsMoveFalse").addClass("switchDisable");
  } else {
    $("#collaborationsMoveTrue").addClass("switchDisable");
    $("#collaborationsMoveFalse").removeClass("switchDisable");
  }
});

$(document).on("change", "#externalUsersMigration", function () {
  if ($(this).is(":checked")) {
    $("#externalUsersMigrationTrue").removeClass("switchDisable");
    $("#externalUsersMigrationFalse").addClass("switchDisable");
  } else {
    $("#externalUsersMigrationTrue").addClass("switchDisable");
    $("#externalUsersMigrationFalse").removeClass("switchDisable");
  }
});

$(document).on("click", "#externalUsersMigrationText", function () {
  $("#optionsModal").modal();
  $("#optionsModal").find(".modal-title").text("Migrate External Users");
  $("#optionsModal")
    .find(".modal-body p")
    .text("Guest users on the Mural will be migrated Miro");
});

$(document).on("click", "#collaborationsMoveText", function () {
  $("#optionsModal").modal();
  $("#optionsModal").find(".modal-title").text("Migrate Collaborations");
  $("#optionsModal")
    .find(".modal-body p")
    .text("All the collaborators on the Mural will be migrated to Miro");
});

function getMuralMigrationSummary() {
  $.ajax({
    type: "GET",
    url: apicallurl + "/boardservice/dashboard/workspacesstaus",
    // url: "http://127.0.0.1:8000/dashboard/mural",
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (resp) {
      $(".muralLstTimeStamp").html(`Updated ${new Date().toLocaleString()}`);
      let data = JSON.parse(resp);
      $("#totalMuralBoards").html(data?.totalWorkspace);
      $("#totalMuralProcessedBoards").html(
        data?.processedWorkspace + data?.processedWithSomeConflictWorkpsace
      );
      $("#totalMuralInProcessBoards").html(data?.inprogressWorkpsace);
      $("#totalMuralConflictBoards").html(data?.conflictWorkspaces);
    },
  });
}

$(document).on("click", "#syncMuralReports", function () {
  getMuralMigrationSummary();
  getMuralReports(1);
});

$(document).on("click", "#pauseMuralBoards", function () {
  if ($("input[id=actinCheckBox]:checked").length === 0) {
    alertError("Please select at least one workspace");
  } else {
    let pauseBody = [];
    $.each($("input[id=actinCheckBox]:checked"), function () {
      var status = $(this).attr("status");
      if (
        status === "PAUSE" ||
        status === "IN_PROGRESS" ||
        status === "RETRYING" ||
        status === "NOT_PROCESSED"
      ) {
        let bdy = {
          id: $(this).attr("wsid"),
        };
        pauseBody.push(bdy);
      }
    });
    if (pauseBody.length === 0) {
      $("input[id=actinCheckBox]:checked").prop("checked", false);
      alertError(
        "Pause migration is not possible with the selected workspaces"
      );
    } else {
      pauseResume(pauseBody, "pause");
    }
  }
});

$(document).on("click", "#resumeMuralBoards", function () {
  if ($("input[id=actinCheckBox]:checked").length === 0) {
    alertError("Please select at least one workspace");
  } else {
    let resumeBody = [];
    $.each($("input[id=actinCheckBox]:checked"), function () {
      var status = $(this).attr("status");
      if (status === "PAUSE") {
        let bdy = {
          id: $(this).attr("wsid"),
        };
        resumeBody.push(bdy);
      }
    });
    if (resumeBody.length === 0) {
      $("input[id=actinCheckBox]:checked").prop("checked", false);
      alertError(
        "Resume migration is not possible with the selected workspaces"
      );
    } else {
      pauseResume(resumeBody, "resume");
    }
  }
});

$(document).on("click", "#cancelMuralBoards", function () {
  if ($("input[id=actinCheckBox]:checked").length === 0) {
    alertError("Please select at least one workspace");
  } else {
    let cancelBody = [];
    $.each($("input[id=actinCheckBox]:checked"), function () {
      var status = $(this).attr("status");
      if (
        status === "PAUSE" ||
        status === "IN_PROGRESS" ||
        status === "RETRYING" ||
        status === "NOT_PROCESSED"
      ) {
        let bdy = {
          id: $(this).attr("wsid"),
        };
        cancelBody.push(bdy);
      }
    });
    if (cancelBody.length === 0) {
      $("input[id=actinCheckBox]:checked").prop("checked", false);
      alertError(
        "Cancel migration is not possible with the selected workspaces"
      );
    } else {
      pauseResume(cancelBody, "cancel");
    }
  }
});

$(document).on("click", "#downloadMuralBoards", function () {
  let selectedDownload = [];
  $.each($("input[id=actinCheckBox]:checked"), function () {
    var status = $(this).attr("status");
    if (
      status === "PROCESSED" ||
      status === "PROCESSED_WITH_SOME_ERRORS" ||
      status === "PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE" ||
      status === "PROCESSED_WITH_SOME_CONFLICTS" ||
      status === "PROCESSED_WITH_SOME_WARNINGS"
    ) {
      selectedDownload.push({ id: $(this).attr("wsid") });
    } else {
      $('[wsid="' + $(this).attr("wsid") + '"]').prop("checked", false);
    }
  });
  if (selectedDownload.length === 0) {
    alertError("Download Report is not possible for selected workspaces");
  } else {
    downloadReportsBulk(selectedDownload);
  }
});

function pauseResume(bodyObject, actionEvent) {
  $.ajax({
    type: "POST",
    url: apicallurl + "/boardservice/cancelorpauseorresume/" + actionEvent,
    async: false,
    data: JSON.stringify(bodyObject),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (data.statusCode === "OK") {
        getMuralReports(1);
        if (actionEvent === "pause")
          bodyObject.map((data) => {
            let workspaceId = data?.id;
            let sts = `wstatus${workspaceId}`;
            let wssts = `wstatusText${workspaceId}`;
            $('[id="' + sts + '"]')
              .removeClass("IN_PROGRESS")
              .removeClass("RETRYING")
              .addClass("PAUSE");
            $('[id="' + wssts + '"]').html("Pause");
            $('[wsid="' + workspaceId + '"]').prop("checked", false);
          });
      } else if (actionEvent === "resume") {
        bodyObject.map((data) => {
          let workspaceId = data?.id;
          let sts = `wstatus${workspaceId}`;
          let wssts = `wstatusText${workspaceId}`;
          $('[id="' + sts + '"]')
            .removeClass("PAUSE")
            .removeClass("RETRYING")
            .addClass("IN_PROGRESS");
          $('[id="' + wssts + '"]').html("In Progress");
          $('[wsid="' + workspaceId + '"]').prop("checked", false);
        });
      } else if (actionEvent === "cancel") {
        bodyObject.map((data) => {
          let workspaceId = data?.id;
          let sts = `wstatus${workspaceId}`;
          let wssts = `wstatusText${workspaceId}`;
          $('[id="' + sts + '"]')
            .removeClass("PAUSE")
            .removeClass("RETRYING")
            .addClass("CANCEL");
          $('[id="' + wssts + '"]').html("cancel");
          $('[wsid="' + workspaceId + '"]').prop("checked", false);
        });
      }
      getMuralMigrationSummary();
      getMuralReports(1);
    },
  });
}

function downloadReportsBulk(workspaceId) {
  $.ajax({
    type: "POST",
    // url: apicallurl + "/boardservice/download/migrationreport/" + workspaceId,
    url: apicallurl + "/boardservice/sent/report",
    data: JSON.stringify(workspaceId),
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (xhr) {
      alertSuccess(
        "Thank you for requesting the report. It is being prepared and will be sent to your email shortly"
      );
      workspaceId?.map((data) => {
        $('[wsid="' + data?.id + '"]').prop("checked", false);
      });
    },
  });
}

$("#openMuralTable").click(function () {
  $("#filterPreMigTable").css("display", "flex");
  $("#runMuralPreMigration").css("display", "none");
  $("#selectedFiltersDiv").css("display", "flex");
  resetFilters();
  $("#slackBtn").css("display", "none");
  $("#inputMuralPreMigrationSearch").val("");
  $("#newMuralPreMigrationSummary").css("display", "none");
  $("#appendInnerBreadCrumbs").html("");
  $("#appendInnerBreadCrumbs").append(
    "<span> > </span><span class='navActive'>Murals</span>"
  );
  $("#actionSearchInput").removeClass("fa-times");

  $("#muralPreMigrationTableSummary").css("display", "");
  $("#muralPreMigrationBoardsTable").html("");
  getPreMigrationBoards();
});

$("#summaryNavBreadCrumb").click(function () {
  resetFilters();
  $("#filterPreMigTable").css("display", "none");
  $("#selectedFiltersDiv").css("display", "none");
  $("#initMigration").css("display", "none");
  $("#runMuralPreMigration").css("display", "");
  $("#inputMuralPreMigrationSearch").val("");
  $("#slackBtn").css("display", "");
  $("#newMuralPreMigrationSummary").css("display", "");
  $("#appendInnerBreadCrumbs").html("");
  $("#actionSearchInput").removeClass("fa-times");

  //$("#appendInnerBreadCrumbs").append("<span> > </span><span class='navActive'>Murals</span>")
  $("#muralPreMigrationTableSummary").css("display", "none");
});

$("#runMuralPreMigration").click(function () {
  CFNewLoader("show");
  initiatePreMigration();
});

$("#refreshPreMigReport").on("click", function () {
  CFNewLoader("show");
  initiatePreMigration();
});

function initiatePreMigration() {
  let uri;
  uri =
    apicallurl +
    "/boardservice/premigration/workspace/" +
    localStorage.multiUsrSrcCldId;

  uri = `http://localhost:8001/get/mural/premigration`;
  $.ajax({
    type: "POST",
    url: uri,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      CFNewLoader();
      let _data = JSON.parse(data);
      if (_data?.totalBoards > 0) {
        $("#openMuralTable").css("display", "");
      }
      if (_data?.premigrationStatus === "PROCESSED") {
        $("#runMuralPreMigration").css({
          opacity: "1",
          "pointer-events": "auto",
        });
        $(".showStatusPreMigration")
          .css({ display: "", color: "#00C64F", border: "1px solid #00C64F" })
          .find("span")
          .html("Completed");
      } else {
        setTimeout(() => {
          initiatePreMigration();
        }, 15000);
        $("#runMuralPreMigration").css({
          opacity: "0.4",
          "pointer-events": "none",
        });
        $(".showStatusPreMigration")
          .css({ display: "", color: "#FFB900", border: "1px solid #FFB900" })
          .find("span")
          .html("In-Progress");
      }
      $(".muralLstTimeStampPreScan")
        .css("display", "flex")
        .html(
          `Updated ${
            _data?.lastUpdateTime
              ? new Date(_data?.lastUpdateTime).toLocaleString()
              : new Date().toLocaleString()
          }`
        );
      $("#refreshPreMigReport").css("display", "");
      console.log(getDateConversion(_data?.lastUpdateTime));
      $("#totalMuralBoards").html(_data?.totalBoards);
      $("#totalMuralProcessedBoards").html(_data?.totalWidgets);
      $("#totalMuralInProcessBoards").html(_data?.totalUnsupportedWidgets);
      $("#totalMuralConflictBoards").html(_data?.totalMigratablwWidgets);
    },
    error: function (err) {
      CFNewLoader();
    },
  });
}

function getPreMigrationStatus() {
  CFNewLoader("show");
  $.ajax({
    type: "GET",
    url: `${apicallurl}/boardservice/get/premigration/workspace/${localStorage.multiUsrSrcCldId}`,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      CFNewLoader();
      if (data !== `Premigration didn't initite yet`) {
        initiatePreMigration();
      }
    },
    error: function (err) {
      CFNewLoader();
    },
  });
}

function getPreMigrationBoards(pgno) {
  var processStatus = {
    IN_PROGRESS: "In Progress",
    PROCESSED: "Completed",
    NOT_PROCESSED: "Not Processed",
    IN_QUEUE: "In Queue",
    CONFLICT: "Conflict",
  };

  var pgNo = pgno ?? 1;

  let uri;
  uri =
    apicallurl +
    "/boardservice/premigration/get/boards/" +
    localStorage.UserId +
    "/" +
    localStorage.multiUsrSrcCldId +
    "?page_nbr=" +
    pgNo +
    "&page_size=50";
  (uri = "http://localhost:8001/get/mural/premigration/reports"),
    $.ajax({
      type: "GET",
      url: uri,
      async: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      },
      success: function (data) {
        if (pgNo === 1) {
          $("#muralPreMigrationBoardsTable").html("");
        }
        if (data?.length > 0) {
          for (let i = 0; i < data?.length; i++) {
            let _data = data[i];
            let cretDate = _data?.boardCreatedTime;
            cretDate = `${cretDate?.split(":")[2]}-${cretDate?.split(":")[1]}-${
              cretDate?.split(":")[0]
            }`;
            let modfDate = _data?.boardLastModifiedTime;
            modfDate = `${modfDate?.split(":")[2]}-${modfDate?.split(":")[1]}-${
              modfDate?.split(":")[0]
            }`;
            var createdBy = _data?.createdBy;
            var boardName = _data?.boardName;
            var lstDate = _data?.lastUpdateTime;
            if (lstDate) {
              lstDate = `${
                new Date(_data?.lastUpdateTime).toString().split(" ")[1]
              } ${new Date(_data?.lastUpdateTime).toString().split(" ")[2]},${
                new Date(_data?.lastUpdateTime).toString().split(" ")[3]
              }`;
            } else {
              lstDate = "";
            }
            var pl = /\</g;
            var pl1 = /\>/g;
            var pl2 = /\"/g;
            var pl3 = /\'/g;
            boardName = boardName
              .replace(pl, "&lt;")
              .replace(pl1, "&gt;")
              .replace(pl2, "&quot;")
              .replace(pl3, "&apos;");
            createdBy = createdBy
              .replace(pl, "&lt;")
              .replace(pl1, "&gt;")
              .replace(pl2, "&quot;")
              .replace(pl3, "&apos;");
            // <td
            //   title="${
            //     _data?.muralWorkspaceName
            //   }">
            //   $
            //   {CFManageCloudAccountsAjaxCall.getMaxChars(
            //     _data?.muralWorkspaceName,
            //     25
            //   )}
            // </td>;
            //   <span style="font-size: 12px;"><span style="color: #acacac;font-weight: 400;font-size: 10px;">Created Date:</span> ${
            //     new Date(cretDate).toString().split(" ")[1]
            //   } ${new Date(cretDate).toString().split(" ")[2]},${
            //   new Date(cretDate).toString().split(" ")[3]
            // }</span>
            $("#muralPreMigrationBoardsTable").append(`<tr>
          <td style="width: 5px;">
            <span><input type="checkbox" workspacename="${
              _data?.muralWorkspaceName
            }" boardObject="${encodeURIComponent(
              JSON.stringify(_data)
            )}" id="checkForPreMig"/></span>
          </td>
          <td title="${boardName}">
            ${CFManageCloudAccountsAjaxCall.getMaxChars(boardName, 25)}
          </td>
          <td title="${createdBy}">
          ${CFManageCloudAccountsAjaxCall.getMaxChars(createdBy, 25)}
          </td>
          <td>${_data?.totalBoardWidgets}</td>
          <td>${_data?.totalBoardMigratableWidgets}</td>
          <td>${_data?.totalBoardUnsupportedWidgets}</td>
          <td created="${new Date(cretDate).getTime()}" updated="${new Date(
              modfDate
            ).getTime()}">
          <span style="padding: 0 4px;">
            ${new Date(cretDate).toString().split(" ")[1]} ${
              new Date(cretDate).toString().split(" ")[2]
            },${new Date(cretDate).toString().split(" ")[3]}
          </span>  
          </div>
          </td>
          <td created="${new Date(cretDate).getTime()}" updated="${new Date(
              modfDate
            ).getTime()}">
          <span style="padding: 0 4px;">
            ${new Date(modfDate).toString().split(" ")[1]} ${
              new Date(modfDate).toString().split(" ")[2]
            },${new Date(modfDate).toString().split(" ")[3]}
          </span>  
          </div>
          </td>
          <td class="${_data?.premigrationBoardStatus}">
            <div style="display: flex;flex-direction: column;gap: 0;">
            <span>${processStatus[_data?.premigrationBoardStatus]}</span>
                <span style="color: #acacac;font-weight: 400;font-size: 10px;">${lstDate}</span>
            </div>
          </td>
          </tr>`);
            // <td><span>Not Initiated</span></td>
            preMigFilter.appendUsers(createdBy);
          }
          if (data?.length === 50) {
            let pzNo = Number(pgNo);
            getPreMigrationBoards(pzNo + 1);
          }
        }
      },
    });
}

$("#actionSearchInput").click(function () {
  if ($(this).hasClass("fa-times")) {
    $("#inputMuralPreMigrationSearch").val("");
  }
  $(this).toggleClass("fa-times");
  // $("#inputMuralPreMigrationSearch").toggle();
});

$("#inputMuralPreMigrationSearch").on("input", function () {
  var filter = $(this).val();
  filter = filter.toUpperCase();
  var table = $("#muralPreMigrationBoardsTable tr");
  for (i = 0; i < table.length; i++) {
    td = table[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.title;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        table[i].style.display = "";
      } else {
        table[i].style.display = "none";
      }
    }
  }
});

$(
  "#boardsCreatedAfter,#boardsCreatedBefore,#boardsModifiedAfter,#boardsModifiedBefore"
).datepicker({
  dateFormat: "yy-mm-dd",
  changeMonth: true,
  changeYear: true,
  showOn: "both",
});

$("#openPreMigrationFilters").click(function () {
  $("#filterDropDownPreMigTable").css("display", "flex");
});

$('[id="closeFilterPreMig"]').click(function () {
  $("#filterDropDownPreMigTable").css("display", "none");
});

let appendMuralUser = [];
let filterObject = {
  userName: "",
  boardsCreatedAfter: 0,
  boardsCreatedBefore: 0,
  boardsModifiedAfter: 0,
  boardsModifiedBefore: 0,
  widgetsStartRange: 0,
  widgetsEndRange: 0,
};
var preMigFilter = {
  appendUsers: function (userName) {
    $(".selectRoomFilter").html(
      `<option value="CFDEFAULTROOM">Select User</option>`
    );
    if (appendMuralUser.length === 0) {
      appendMuralUser.push(userName);
    } else {
      if (!appendMuralUser.includes(userName)) {
        appendMuralUser.push(userName);
      }
    }
    appendMuralUser?.map((data) => {
      return $(".selectRoomFilter").append(
        `<option value="${data}">${data}</option>`
      );
    });
  },
};

$(".selectRoomFilter").on("change", function () {
  console.log($(this).val());
  filterObject.userName = $(this).val();
});

$("#boardsCreatedAfter").on("change", function () {
  let dt = $(this).val();
  dt = new Date(
    `${dt.split("-")[1]}/${dt.split("-")[2]}/${dt.split("-")[0]}`
  ).getTime();
  if (filterObject.boardsCreatedBefore === 0) {
    filterObject.boardsCreatedAfter = dt;
  } else if (dt > filterObject.boardsCreatedBefore) {
    $(this).val("").focus();
    alertError(
      `Please ensure that the "From Date" is earlier than the "To Date"`
    );
    filterObject.boardsCreatedAfter = 0;
  } else {
    filterObject.boardsCreatedAfter = dt;
  }
});

$("#boardsCreatedBefore").on("change", function () {
  let dt = $(this).val();
  dt = new Date(
    `${dt.split("-")[1]}/${dt.split("-")[2]}/${dt.split("-")[0]}`
  ).getTime();
  if (filterObject.boardsCreatedAfter === 0) {
    filterObject.boardsCreatedBefore = dt;
  } else if (dt < filterObject.boardsCreatedAfter) {
    $(this).val("").focus();
    alertError(
      `Please ensure that the "From Date" is earlier than the "To Date"`
    );
    filterObject.boardsCreatedBefore = 0;
  } else {
    filterObject.boardsCreatedBefore = dt;
  }
});

$("#boardsModifiedAfter").on("change", function () {
  let dt = $(this).val();
  dt = new Date(
    `${dt.split("-")[1]}/${dt.split("-")[2]}/${dt.split("-")[0]}`
  ).getTime();
  if (filterObject.boardsModifiedBefore === 0) {
    filterObject.boardsModifiedAfter = dt;
  } else if (dt > filterObject.boardsModifiedBefore) {
    $(this).val("").focus();
    alertError(
      `Please ensure that the "From Date" is earlier than the "To Date"`
    );
    filterObject.boardsModifiedAfter = 0;
  } else {
    filterObject.boardsModifiedAfter = dt;
  }
});

$("#boardsModifiedBefore").on("change", function () {
  let dt = $(this).val();
  dt = new Date(
    `${dt.split("-")[1]}/${dt.split("-")[2]}/${dt.split("-")[0]}`
  ).getTime();
  if (filterObject.boardsModifiedAfter === 0) {
    filterObject.boardsModifiedBefore = dt;
  } else if (dt < filterObject.boardsModifiedAfter) {
    $(this).val("").focus();
    alertError(`Please ensure that the "To Date" is behind "From Date"`);
    filterObject.boardsModifiedBefore = 0;
  } else {
    filterObject.boardsModifiedBefore = dt;
  }
});

$("#widgetsRangeFromCount").on("change", function () {
  let count = $(this).val();
  if (filterObject?.widgetsEndRange === 0) {
    filterObject.widgetsStartRange = count;
  } else if (Number(count) > filterObject?.widgetsEndRange) {
    $(this).val("").focus();
    filterObject.widgetsStartRange = 0;
    alertError(`Please ensure that the "Min Count" is less than "Max Count"`);
  } else {
    filterObject.widgetsStartRange = Number(count);
  }
});

$("#widgetsRangeToCount").on("change", function () {
  let count = $(this).val();
  if (filterObject?.widgetsStartRange === 0) {
    filterObject.widgetsEndRange = count;
  } else if (Number(count) < filterObject?.widgetsStartRange) {
    $(this).val("").focus();
    filterObject.widgetsEndRange = 0;
    alertError(
      `Please ensure that the "Max Count" is greater than "Min Count"`
    );
  } else {
    filterObject.widgetsEndRange = Number(count);
  }
});

$("#applyFilter").click(function () {
  showFilter();
});

function showFilter() {
  $("#selectedFiltersDiv").html("");
  $("#filterDropDownPreMigTable").css("display", "none");
  if (filterObject?.userName) {
    $("#selectedFiltersDiv").html(`
                      <div class="appliedFilters">
                       <span title="Created By: ${
                         filterObject?.userName
                       }">Created By: ${CFManageCloudAccountsAjaxCall.getMaxChars(
      filterObject?.userName,
      15
    )}</span>
                       <i class="lnil lnil-cross-circle" style="cursor: pointer;" id="cancelFilter" title="Remove Filter" data-for="userName"></i>
                      </div>
                      `);
  }
  let cretAft, cretBwt, modfAft, modfBwt;
  if (
    filterObject?.boardsCreatedAfter !== 0 &&
    filterObject?.boardsCreatedAfter
  ) {
    cretAft = `From ${getDateFormat(filterObject?.boardsCreatedAfter)}`;
  }

  if (
    filterObject?.boardsCreatedBefore !== 0 &&
    filterObject?.boardsCreatedBefore
  ) {
    cretBwt = ` To ${getDateFormat(filterObject?.boardsCreatedBefore)}`;
  }

  if (
    filterObject?.boardsModifiedAfter !== 0 &&
    filterObject?.boardsModifiedAfter
  ) {
    modfAft = `From ${getDateFormat(filterObject?.boardsModifiedAfter)}`;
  }

  if (
    filterObject?.boardsModifiedBefore !== 0 &&
    filterObject?.boardsModifiedBefore
  ) {
    modfBwt = ` To ${getDateFormat(filterObject?.boardsModifiedBefore)}`;
  }

  if (cretAft !== undefined || cretBwt !== undefined) {
    $("#selectedFiltersDiv").append(`
                    <div class="appliedFilters">
                     <span>Created ${cretAft ? cretAft : ""} ${
      cretBwt ? cretBwt : ""
    }</span>
                     <i class="lnil lnil-cross-circle" style="cursor: pointer;" id="cancelFilter" title="Remove Filter" data-for="createdRange"></i>
                    </div>
                    `);
  }
  if (modfAft !== undefined || modfBwt !== undefined) {
    $("#selectedFiltersDiv").append(`
                    <div class="appliedFilters">
                     <span>Modified ${modfAft ? modfAft : ""} ${
      modfBwt ? modfBwt : ""
    }</span>
                     <i class="lnil lnil-cross-circle" style="cursor: pointer;" id="cancelFilter" title="Remove Filter" data-for="modifiedRange"></i>
                    </div>
                    `);
  }
  if (
    filterObject?.widgetsStartRange !== 0 &&
    filterObject?.widgetsEndRange !== 0
  ) {
    $("#selectedFiltersDiv").append(`
                      <div class="appliedFilters">
                      <span>Widgets Between: ${filterObject?.widgetsStartRange} To ${filterObject?.widgetsEndRange}</span>
                      <i class="lnil lnil-cross-circle" style="cursor: pointer;" id="cancelFilter" title="Remove Filter" data-for="widgetsRange"></i>
                      </div>
                      `);
  } else if (
    filterObject?.widgetsStartRange !== 0 &&
    filterObject?.widgetsEndRange === 0
  ) {
    $("#selectedFiltersDiv").append(`
                      <div class="appliedFilters">
                      <span>Minimum Widgets: ${filterObject?.widgetsStartRange}</span>
                      <i class="lnil lnil-cross-circle" style="cursor: pointer;" id="cancelFilter" title="Remove Filter" data-for="widgetsRange"></i>
                      </div>
                      `);
  } else if (
    filterObject?.widgetsStartRange === 0 &&
    filterObject?.widgetsEndRange !== 0
  ) {
    $("#selectedFiltersDiv").append(`
                      <div class="appliedFilters">
                      <span>Maximum Widgets: ${filterObject?.widgetsEndRange}</span>
                      <i class="lnil lnil-cross-circle" style="cursor: pointer;" id="cancelFilter" title="Remove Filter" data-for="widgetsRange"></i>
                      </div>
                      `);
  }

  startPremigrationFilters();
}

function getDateFormat(date) {
  return `${new Date(date).toString().split(" ")[1]} ${
    new Date(date).toString().split(" ")[2]
  }, ${new Date(date).toString().split(" ")[3]}`;
}

function startPremigrationFilters() {
  if (
    filterObject?.userName === "" &&
    filterObject?.boardsCreatedAfter === 0 &&
    filterObject?.boardsCreatedBefore === 0 &&
    filterObject?.boardsModifiedAfter === 0 &&
    filterObject?.boardsModifiedBefore === 0 &&
    filterObject?.widgetsStartRange === 0 &&
    filterObject?.widgetsEndRange === 0
  ) {
    $("#resetFilters").css("display", "none");
  } else {
    $("#resetFilters").css("display", "flex");
  }
  $("#muralPreMigrationBoardsTable tr").show();
  //Name Filter Starts
  if (filterObject?.userName) {
    let filter = filterObject?.userName;
    tr = $("#muralPreMigrationBoardsTable tr:visible");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent.trim();
        console.log(txtValue);
        if (filter == "all") {
          tr[i].style.display = "";
        } else if (txtValue === filter) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  //Name Filter Ends

  //Created After Date Filter Starts
  if (filterObject?.boardsCreatedAfter || filterObject?.boardsCreatedBefore) {
    let filter1 = filterObject?.boardsCreatedAfter;
    let filter2 = filterObject?.boardsCreatedBefore;
    tr = $("#muralPreMigrationBoardsTable tr:visible");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[6];
      if (td) {
        txtValue = td.getAttribute("created");
        //txtValue1 = td.getAttribute("created");
        console.log(txtValue);
        if (filter1 !== 0 && filter2 !== 0) {
          if (
            Number(txtValue) > filter1 - 1000 * 60 * 60 * 24 &&
            Number(txtValue) < filter2 + 1000 * 60 * 60 * 24
          ) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (filter1 !== 0) {
          if (Number(txtValue) > filter1 - 1000 * 60 * 60 * 24) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (filter2 !== 0) {
          if (Number(txtValue) < filter2 + 1000 * 60 * 60 * 24) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
  //Created After Date Filter Ends

  //Modified Date Filter Starts
  if (filterObject?.boardsModifiedAfter || filterObject?.boardsModifiedBefore) {
    let filter1 = filterObject?.boardsModifiedAfter;
    let filter2 = filterObject?.boardsModifiedBefore;
    tr = $("#muralPreMigrationBoardsTable tr:visible");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[6];
      if (td) {
        txtValue = td.getAttribute("updated");
        //txtValue1 = td.getAttribute("created");
        console.log(txtValue);
        if (filter1 !== 0 && filter2 !== 0) {
          if (
            Number(txtValue) > filter1 &&
            Number(txtValue) < filter2 + 1000 * 60 * 60 * 24
          ) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (filter1 !== 0) {
          if (Number(txtValue) > filter1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (filter2 !== 0) {
          if (Number(txtValue) < filter2 + 1000 * 60 * 60 * 24) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
  //Modified Date Filter Ends

  //Widgets Range Filter Starts
  if (filterObject?.widgetsStartRange || filterObject?.widgetsEndRange) {
    let filter1 = filterObject?.widgetsStartRange;
    let filter2 = filterObject?.widgetsEndRange;
    tr = $("#muralPreMigrationBoardsTable tr:visible");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[3];
      if (td) {
        txtValue = td.textContent;
        console.log(txtValue);
        if (filter1 !== 0 && filter2 !== 0) {
          if (Number(txtValue) >= filter1 && Number(txtValue) <= filter2) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (filter1 !== 0) {
          if (Number(txtValue) >= filter1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (filter2 !== 0) {
          if (Number(txtValue) <= filter2) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
  //Widgets Range Filter Ends

  //}
}

$(document).on("click", "#cancelFilter", function () {
  if ($(this).attr("data-for") === "userName") {
    $(".selectRoomFilter").val("CFDEFAULTROOM");
    filterObject.userName = "";
  } else if ($(this).attr("data-for") === "createdRange") {
    $("#boardsCreatedAfter").val("");
    $("#boardsCreatedBefore").val("");
    filterObject.boardsCreatedAfter = 0;
    filterObject.boardsCreatedBefore = 0;
  } else if ($(this).attr("data-for") === "modifiedRange") {
    $("#boardsModifiedAfter").val("");
    $("#boardsModifiedBefore").val("");
    filterObject.boardsModifiedAfter = 0;
    filterObject.boardsModifiedBefore = 0;
  } else if ($(this).attr("data-for") === "widgetsRange") {
    $("#widgetsRangeFromCount").val("");
    $("#widgetsRangeToCount").val("");
    filterObject.widgetsStartRange = 0;
    filterObject.widgetsEndRange = 0;
  }
  $(this).parent().remove();
  showFilter();
});

$("#resetFilters").click(function () {
  resetFilters();
});

function resetFilters() {
  $("#resetFilters").css("display", "none");
  $(".selectRoomFilter").val("CFDEFAULTROOM");
  filterObject.userName = "";
  $("#boardsCreatedAfter").val("");
  $("#boardsCreatedBefore").val("");
  filterObject.boardsCreatedAfter = 0;
  filterObject.boardsCreatedBefore = 0;
  $("#boardsModifiedAfter").val("");
  $("#boardsModifiedBefore").val("");
  filterObject.boardsModifiedAfter = 0;
  filterObject.boardsModifiedBefore = 0;
  $("#widgetsRangeFromCount").val("");
  $("#widgetsRangeToCount").val("");
  filterObject.widgetsStartRange = 0;
  filterObject.widgetsEndRange = 0;
  $("#selectedFiltersDiv").html("");
  $("#muralPreMigrationBoardsTable tr").show();
}

function escapeSpecialChar(text) {
  if (text === undefined || text === null) {
    return "-";
  }
  var pl = /\</g;
  var pl1 = /\>/g;
  var pl2 = /\"/g;
  var pl3 = /\'/g;

  return text
    .replace(pl, "&lt;")
    .replace(pl1, "&gt;")
    .replace(pl2, "&quot;")
    .replace(pl3, "&apos;");
}

function getLucidBoards(folderId, pgNo, pageSize) {
  var userId = localStorage.getItem("UserId");
  // var cloudId = "63e22e0dc2dcd939907591d6";
  var cloudId = localStorage.getItem("multiUsrSrcCldId");
  if (pgNo === undefined) pgNo = 1;
  if (pageSize === undefined) pageSize = 50;
  if (pgNo === 1 && folderId === "/") {
    $("#appendWorkspaces").html("");
    $("#appendWorkspaces").append(`
                  <div id="lucidFldrs"></div>
                  <div id="lucidDocs"></div>
                `);
  }

  var uri =
    apicallurl +
    "/boardservice/userId/" +
    userId +
    "/cloudId/" +
    cloudId +
    "?folderId=" +
    folderId +
    "&page_nbr=" +
    pgNo +
    "&page_size=" +
    pageSize;

  $.ajax({
    type: "GET",
    url: uri,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (folderId !== "/") {
        if ($('[checkFolderId="' + folderId + '"]').hasClass("fa-spinner")) {
          $('[checkFolderId="' + folderId + '"]')
            .addClass("fa-folder-open")
            .removeClass("fa-spinner");
        }
        if (data.length === 0) {
          $('[id="lucidFldr' + folderId + '"]').css({
            "margin-top": "-5px",
            "margin-left": "9px",
          });
          $('[id="lucidFldr' + folderId + '"]').append(`
                            <span class="selectMuralSPAN" style="font-size:12px;color:#acacac;margin-left:0px;cursor: pointer;">
                              No Folders/Documents
                            </span>
                    `);
        }
      }
      for (let i = 0; i < data.length; i++) {
        var _data = data[i];
        let objName = escapeSpecialChar(_data.objectName);
        if (folderId === "/") {
          if (_data?.type === "document") {
            $('[id="lucidDocs"]').append(`
                      <div class="" id="viewMural">
                        <div class="my-auto text-center">
                          <span class="selectMuralSPAN" style="margin-left:0px;">
                          <input type="checkbox" id="boardLevel" fromBoardId="${
                            _data.id
                          }" sourceBoardName="${escapeSpecialChar(
              objName
            )}" parentBid="${_data.parent}">
                          <span title="${objName}">${CFManageCloudAccountsAjaxCall.getMaxChars(
              objName,
              20
            )}</span></span></div><div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Documents</div></div>`);
          } else {
            $('[id="lucidFldrs"]').append(`
                      <div class="" id="viewMural">
                        <div class="my-auto text-center">
                          <span class="selectMuralSPAN" style="margin-left:0px;cursor: pointer;" folderId="${
                            _data?.id
                          }" id="openLucidFolder">
                          <i class="fa fa-folder" style="width: 18px;" checkFolderId="${
                            _data?.id
                          }"></i>
                          <span title="${escapeSpecialChar(
                            objName
                          )}">${CFManageCloudAccountsAjaxCall.getMaxChars(
              objName,
              20
            )}</span></span></div><div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Folder</div></div>
                        <div id="lucid${
                          _data?.id
                        }" style="display:none;padding-left: 15px;">
                              <div id="lucidFldr${_data?.id}"></div>
                              <div id="lucidDocs${_data?.id}"></div>
                        </div>
                        `);
          }
        } else {
          if (_data?.type === "document") {
            $('[id="lucidDocs' + folderId + '"]').append(`
                      <div class="" id="viewMural">
                        <div class="my-auto text-center">
                          <span class="selectMuralSPAN" style="margin-left:0px;">
                          <input type="checkbox" id="boardLevel" fromBoardId="${
                            _data.id
                          }" sourceBoardName="${escapeSpecialChar(
              objName
            )}" parentBid="${_data.parent}">
                          <span title="${objName}">${CFManageCloudAccountsAjaxCall.getMaxChars(
              objName,
              20
            )}</span></span></div><div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Documents</div></div>
                      `);
          } else {
            $('[id="lucidFldr' + folderId + '"]').append(`
                      <div class="" id="viewMural">
                        <div class="my-auto text-center">
                          <span class="selectMuralSPAN" style="margin-left:0px;cursor: pointer;" folderId="${
                            _data?.id
                          }" id="openLucidFolder">
                          <i class="fa fa-folder" style="width: 18px;" checkFolderId="${
                            _data?.id
                          }"></i>
                          <span title="${escapeSpecialChar(
                            objName
                          )}">${CFManageCloudAccountsAjaxCall.getMaxChars(
              objName,
              20
            )}</span></span></div><div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Folder</div></div>
                        <div id="lucid${
                          _data?.id
                        }" style="display:none;padding-left: 15px;">
                              <div id="lucidFldr${_data?.id}"></div>
                              <div id="lucidDocs${_data?.id}"></div>
                        </div>
                        `);
          }
        }
      }
    },
  });
}

$(document).on("click", "#openLucidFolder", function () {
  var folderId = $(this).attr("folderId");
  console.log(folderId);
  $(this).attr("id", "closeLucidFolder");
  $(this).find("i").addClass("fa-spinner").removeClass("fa-folder");
  $("#lucid" + folderId).css("display", "");
  getLucidBoards(folderId);
});

$(document).on("click", "#closeLucidFolder", function () {
  var folderId = $(this).attr("folderId");
  $(this).attr("id", "openLucidFolder");
  $(this).removeClass("fa-spinner");
  $(this).find("i").addClass("fa-folder").removeClass("fa-folder-open");
  $("#lucid" + folderId).css("display", "none");
  $('[id="lucidFldr' + folderId + '"]').html("");
  $('[id="lucidDocs' + folderId + '"]').html("");
});

$("#multiUserTabForLucid").on("click", function () {
  $(this).addClass("active");
  $("#singleUserTabForLucid").removeClass("active");
  $("#changeSource").removeClass("col-xl-3").addClass("col-xl-12");
  // $("#dummyFiller").removeClass("col-xl-6").addClass("col-xl-3");
  $("#dummyFiller").css("display", "none");
  $(".destCloudAddStart").css("display", "none");
  $("#appendWorkspaces").html("");
  $("#workspaceBody").css("display", "none");
  $(".singleSourceHead").parent().css("display", "none");
  $("#showCSVFileUpload").css("display", "flex");
  $("#singleUserSelection").css("display", "none");
  $("#placeMultiLucid").css("display", "flex");
  getCacheLucidCsvBoards();
});

$("#singleUserTabForLucid").on("click", function () {
  $(this).addClass("active");
  $("#placeMultiLucid").css("display", "none");
  $("#appendWorkspaces").html("");
  $("#singleUserSelection").css("display", "");
  $("#showCSVFileUpload").css("display", "none");
  $("#multiUserTabForLucid").removeClass("active");
  $("#changeSource").removeClass("col-xl-12").addClass("col-xl-3");
  $(".destCloudAddStart").css("display", "");
  $("#dummyFiller").css("display", "");
  $("#workspaceBody").css("display", "");
  $(".singleSourceHead").parent().css("display", "");
  getLucidBoards("/", 1, 50);
  $("#forNextMove").addClass("disabled");
});

$("#showCSVFileUpload").on("click", function () {
  $("#uploadCSVLucidMappings").trigger("click");
});

function uploadLucidMappingCsv() {
  var upload = document.getElementById("uploadCSVLucidMappings").files[0];
  var reader = new FileReader();
  reader.onload = function () {
    csvMappingsUploadLucid(reader.result);
  };
  reader.readAsText(upload);
  $("#uploadCSVLucidMappings").val("");
}

function csvMappingsUploadLucid(csvStream) {
  CFNewLoader("show", "Validating CSV Please Wait");
  $("#lucidMultiBody").html("");
  $.ajax({
    type: "POST",
    url: `${apicallurl}/boardservice/csv/lucidvalidation/${localStorage.multiUsrSrcCldId}?adminCloudId=${localStorage.admincloudid}`,
    data: csvStream,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#selectAllLucidCSVBoards").prop("checked", false);
      CFNewLoader("show", "Validating CSV Please Wait");
      getCacheLucidCsvBoards();
    },
    error: function (err) {
      CFNewLoader();
      alertError("Failed to validate csv");
    },
  });
}

function getCacheLucidCsvBoards() {
  $("#selectAllLucidCSVBoards").prop("checked", false);
  $("#lucidMultiBody").html("");
  $("#CFShowLoading").show();
  $.ajax({
    type: "GET",
    url: `${apicallurl}/boardservice/get/boards/${localStorage.UserId}/${localStorage.multiUsrSrcCldId}`,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      CFNewLoader();
      for (let i = 0; i < data?.length; i++) {
        let res = data[i];

        let usersName = "";
        let titleUsersName = "";

        let maxCharCount = 0;
        if (res?.collaborators?.length < 3) {
          maxCharCount = 15;
        } else {
          maxCharCount = 10;
        }
        if (res?.collaborators?.length !== 0) {
          for (let j = 0; j < res?.collaborators?.length; j++) {
            if (j >= 5) {
              break;
            } else if (j === 0) {
              titleUsersName = titleUsersName + res?.collaborators[j]?.name;
              usersName =
                usersName +
                CFManageCloudAccountsAjaxCall.getMaxChars(
                  res?.collaborators[j]?.name,
                  maxCharCount
                );
            } else {
              titleUsersName =
                titleUsersName + ", " + res?.collaborators[j]?.name;
              usersName =
                usersName +
                ", " +
                CFManageCloudAccountsAjaxCall.getMaxChars(
                  res?.collaborators[j]?.name,
                  maxCharCount
                );
            }
          }
        }
        console.log(usersName);
        // <div class="placeMIROICON">
        //   <img src="../img/lucid.png"/>
        // </div>
        // <div class="placeMIROICON">
        //   <img src="../img/miro50x50.png" />
        // </div>;
        // <input type="checkbox" id="selecteLucidCSVBoard"/>
        $("#lucidMultiBody").append(`
            <div class="lucidCSVContentHeader">
              <div class="lucidCSVCheckbox"><input type="checkbox" id="boardLevel" fromBoardId="${
                res?.boardId
              }" sourceBoardName="${escapeSpecialChar(
          res?.boardName
        )}" parentBid="${res?.parent}"></div>
              <div class="lucidTitle" style="padding: 0 20px;">
              ${CFManageCloudAccountsAjaxCall.getMaxChars(
                res?.boardName,
                40
              )}</div>
              <div class="lucidUsers"><span title="${titleUsersName}">${usersName}</span>${
          res?.users?.length > 4
            ? `<div class="showMoreCountUsersLucid" userslist="${encodeURIComponent(
                JSON.stringify(res?.collaborators)
              )}">...more</div>`
            : ""
        }</div>
              <div class="miroLucidTeam" style="padding: 0 20px;">
              <span id="miroWorkspaceNameLucid">${CFManageCloudAccountsAjaxCall.getMaxChars(
                localStorage.dstnTeamName,
                25
              )}</span></div>
            </div>
            `);
      }
      checkDstnTeamName();
      $(".lucidMultiSummary").css("display", "flex");
      $("#totalLucidCSVBoards").html(
        $('[class="lucidCSVContentHeader"]').length - 1
      );
    },
    error: function () {
      $("#CFShowLoading").hide();
    },
  });
}

$(document).on("click", "#boardLevel", function () {
  if ($(this).attr("isfolder") === "true") {
    if ($(this).is(":checked") || $(this).prop("disabled")) {
      $.each(
        $('[parentbid="' + $(this).attr("fromboardid") + '"]'),
        function () {
          $('[removeid="' + $(this).attr("fromboardid") + '"]').trigger(
            "click"
          );
        }
      );
      $('[parentbid="' + $(this).attr("fromboardid") + '"]')
        .prop("checked", false)
        .prop("disabled", true);
    } else {
      $('[parentbid="' + $(this).attr("fromboardid") + '"]')
        .prop("checked", false)
        .prop("disabled", false);
    }
  }
  if ($('[id="boardLevel"]:checked').length > 0) {
    $("#selectedBoardsSel").css("display", "flex");
    $("#totalSelectedLucidCSVBoards").html(
      $('[id="boardLevel"]:checked').length
    );
  } else {
    $("#selectedBoardsSel").css("display", "none");
  }

  if ($('[id="boardLevel"]:checked').length !== $('[id="boardLevel"]').length) {
    $("#selectAllLucidCSVBoards").prop("checked", false);
  } else {
    $("#selectAllLucidCSVBoards").prop("checked", true);
  }
});

$("#selectAllLucidCSVBoards").on("click", function () {
  if ($(this).is(":checked")) {
    $('[id="boardLevel"]').prop("checked", true);
    $("#selectedBoardsSel").css("display", "flex");
    $("#totalSelectedLucidCSVBoards").html(
      $('[id="boardLevel"]:checked').length
    );
  } else {
    $("#selectedBoardsSel").css("display", "none");
    $('[id="boardLevel"]').prop("checked", false);
  }
});

function checkDstnTeamName() {
  $('[id="miroWorkspaceNameLucid"]').html(
    CFManageCloudAccountsAjaxCall.getMaxChars(localStorage.dstnTeamName, 25)
  );
  $('[id="miroWorkspaceNameLucid"]').attr("title", localStorage.dstnTeamName);
}

$(document).on("click", ".showMoreCountUsersLucid", function () {
  let usersObject = JSON.parse(decodeURIComponent($(this).attr("userslist")));
  $(".filterOptionsForMultiParent-Body-Body").html("");
  usersObject?.map((data) => {
    $(".filterOptionsForMultiParent-Body-Body").append(`
          <div class="lucidPopupUserEMailBody">
            <div title="${
              data?.name
            }">${CFManageCloudAccountsAjaxCall.getMaxChars(
      data?.name,
      30
    )}</div>
            <div title="${
              data?.email
            }">${CFManageCloudAccountsAjaxCall.getMaxChars(data?.email, 30)}
            </div>
          </div>
        `);
  });
  $(".filterOptionsForMultiParent").css("display", "flex");
});

$("#closeNewFilters").on("click", function () {
  $(".filterOptionsForMultiParent").css("display", "none");
});

function appendSelectedMapping() {
  $(".boardMappingTable table tbody").html("");
  $.each($("input[id=boardLevel]:checked"), function () {
    var obj = {
      userId: localStorage.getItem("UserId"),
      fromCloudId: localStorage.getItem("multiUsrSrcCldId"),
      fromCloudName: localStorage.getItem("multiUsrSrcCldName"),
      toCloudId: localStorage.getItem("multiUsrDstnCldId"),
      toCloudName: localStorage.getItem("multiUsrDstnCldName"),
      fromMailId: localStorage.getItem("multiUsrSrcEmail"),
      toMailId: localStorage.getItem("multiUsrDstnEmail"),
      fromBoardId: $(this).attr("fromboardid"),
      authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      sourceBoardName: $(this).attr("sourceboardname"),
      isFolder: $(this).attr("isfolder"),
    };
    $(this).prop("checked", false);
    $(this).attr("disabled", true);
    boardMappingCache.push(obj);
  });

  boardMappingCache.map((data) => {
    $(".boardMappingTable table tbody").append(`<tr>
    <td style="width: 2%">
    <input type="checkbox" isfolder="${
      data.isFolder
    }" id="mappingSelect" fromBoardId="${
      data.fromBoardId
    }" sourceBoardName="${escapeSpecialChar(
      data.sourceBoardName
    )}" style="margin: 0;">
    </td>
    <td style="width: 40%">
      <span title="${escapeSpecialChar(
        data?.sourceBoardName
      )}">${CFManageCloudAccountsAjaxCall.getMaxChars(
      escapeSpecialChar(data?.sourceBoardName),
      20
    )}</span>
    </td>
    <td style="width: 40%">
      <span>Root</span>
    </td>
    <td style="width: 2%">
    <i class="lnil lnil-cross-circle" style="cursor: pointer" title="Remove Mapping" id="removeBoardFromMappingList" removeid="${
      data?.fromBoardId
    }"></i>
      </td>
      </tr>`);
  });
  // <td style="width: 30%;vertical-align: middle;">Not Initiated</td>

  $("#totalBoardsMappingsCache").html(boardMappingCache.length);

  if ($("#selectAllMappingBoards").is(":checked")) {
    $('[id="mappingSelect"]').prop("checked", true);
    $("#totalSelectedMappingsCache").html(
      $('[id="mappingSelect"]:checked').length
    );
    $("#toggleSelectedCacheMapping").css("display", "flex");
  }
}

$("#selectAllMappingBoards").on("click", function () {
  if ($(this).is(":checked")) {
    $('[id="mappingSelect"]').prop("checked", true);
    $("#totalSelectedMappingsCache").html(
      $('[id="mappingSelect"]:checked').length
    );
    $("#toggleSelectedCacheMapping").css("display", "flex");
    $("#forNextMove").removeClass("disabled");
  } else {
    $('[id="mappingSelect"]').prop("checked", false);
    $("#totalSelectedMappingsCache").html(
      $('[id="mappingSelect"]:checked').length
    );
    $("#forNextMove").addClass("disabled");
    $("#toggleSelectedCacheMapping").css("display", "none");
  }
});

$(document).on("click", '[id="mappingSelect"]', function () {
  if (
    $('[id="mappingSelect"]').length ===
    $('[id="mappingSelect"]:checked').length
  ) {
    $("#selectAllMappingBoards").prop("checked", true);
  } else {
    $("#selectAllMappingBoards").prop("checked", false);
  }

  if ($('[id="mappingSelect"]:checked').length > 0) {
    $("#toggleSelectedCacheMapping").css("display", "flex");
    $("#forNextMove").removeClass("disabled");
  } else {
    $("#toggleSelectedCacheMapping").css("display", "none");
    $("#forNextMove").addClass("disabled");
  }

  $("#totalSelectedMappingsCache").html(
    $('[id="mappingSelect"]:checked').length
  );
});

$(document).on("click", "#removeBoardFromMappingList", function () {
  if ($(this).attr("from") === "csv") {
    $(this).parent().parent().remove();
    $("#totalBoardsMappingsCache").html($('[id="mappingSelect"]').length);
    $("#totalSelectedMappingsCache").html(
      $('[id="mappingSelect"]:checked').length
    );
    return false;
  }
  let boardId = $(this).attr("removeid");
  if ($('[fromboardid="' + boardId + '"]').attr("isfolder") === "true") {
    $('[parentbid="' + boardId + '"]').attr("disabled", false);
  }
  $('[fromboardid="' + boardId + '"]').attr("disabled", false);
  boardMappingCache.map((data, index) => {
    if (data?.fromBoardId === boardId) {
      let dup = boardMappingCache.splice(index, 1);
      console.log(dup);
    }
  });
  $(this).parent().parent().remove();
  $("#totalBoardsMappingsCache").html(boardMappingCache.length);
  $("#totalSelectedMappingsCache").html(
    $('[id="mappingSelect"]:checked').length
  );
});

$("#deleteMappingCache").on("click", function () {
  boardMappingCache = [];
  $(".dstnMiro").prop("checked", false);
  $("#totalBoardsMappingsCache").html(0);
  $("#forNextMove").addClass("disabled");
  $(".boardMappingTable table tbody").html("");
  $('[id="boardLevel"]').attr("disabled", false);
  alertSuccess("Mappings Deleted Successfully...");
  $("#selectAllMappingBoards").prop("checked", false);
  $("#toggleSelectedCacheMapping").css("display", "none");
});

$(document).on("click", '[id="checkForPreMig"]', function () {
  if ($('[id="checkForPreMig"]:checked').length > 0) {
    $("#initMigration").css("display", "");
  } else {
    $("#initMigration").css("display", "none");
  }
});

let selcMig = [],
  selWorkspaces = [];
function saveMigrationFromPreMig() {
  selcMig = [];
  selWorkspaces = [];
  $.each($('[id="checkForPreMig"]:checked'), function () {
    if (!selWorkspaces.includes($(this).attr("workspacename"))) {
      selWorkspaces.push($(this).attr("workspacename"));
    }
    selcMig.push(JSON.parse(decodeURIComponent($(this).attr("boardobject"))));
  });
}

function appendWorkspacesPreMig() {
  $("#appendWorkspaces").html("");
  selWorkspaces?.map((data) => {
    $("#appendWorkspaces").append(
      '<div class="row justify-content-start muralWorkspaces openWorkSpace">' +
        '<div class="my-auto text-center"><i class="lnil lnil-chevron-up-circle" style="color: #0062ff;cursor:pointer;" id="openRooms" ></i></div>' +
        '<div class="my-auto"><span style="margin-left: -20px;text-overflow: ellipsis;" title="' +
        data +
        '">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(data, 20) +
        "</span></div>" +
        '<div class="my-auto" id="hierachyIndicator" style="position: absolute;right: 15px;">Workspace</div></div>' +
        '<hr class="hratopenWorkspace" id="hr' +
        data +
        '"/>' +
        '<div id="viewRoom' +
        data +
        '"></div>'
    );
  });
}

function appendPreMigMapping() {
  //$("#appendWorkspaces").html("")
  selcMig.map((data) => {
    $("#viewRoom" + data?.muralWorkspaceName).append(
      '<div class="" id="viewMural"><div class="my-auto text-center">' +
        '<span class="selectMuralSPAN"><input type="checkbox" checked="true" id="boardLevel" fromBoardId="' +
        data.boardId +
        '" sourceBoardName="' +
        data.boardName +
        '" parentBid="' +
        data.id +
        '"><span title="' +
        data.boardName +
        '">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(data.boardName, 20) +
        "</span></span></div>" +
        '<div class="my-auto" id="hierachyIndicator" style="margin-left: auto;">Mural</div></div>'
    );
  });
}

$("#initMigration").click(function () {
  saveMigrationFromPreMig();
  appendWorkspacesPreMig();
  let _step = 3;
  $("#muralPreMigration").css("display", "none");
  getWorkSpaceMiro();
  appendPreMigMapping();
  $("#mappingPreMigration").css("display", "");
  $("#mappingClouds").css("display", "none");
  $("#mappingUsers").css("display", "none");
  $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
    .removeClass("active")
    .addClass("completed");
  $("#forNextMove").attr("data-step", _step);
  $("#forPreviousMove").attr("data-prev", _step);
  $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
  $("#forNextMove").addClass("disabled");
  //$("#forNextMove").css({"width": "140px", "margin-left": "90%"});
  $("#forNextMove span").text("Next");
  $("#migrationOptions").css("display", "none");
  $("#muralJobOptions").css("display", "none");
});

$('[id="checkForPreMig"]').on("click", function () {
  if (
    $('[id="checkForPreMig"]').length ===
    $('[id="checkForPreMig"]:checked').length
  ) {
    $("#checkAllForPreMig").prop("checked", true);
  } else {
    $("#checkAllForPreMig").prop("checked", false);
  }
  if ($('[id="checkForPreMig"]:checked').length > 0) {
    $("#initMigration").css("display", "");
  } else {
    $("#initMigration").css("display", "none");
  }
});

$("#checkAllForPreMig").on("click", function () {
  if ($(this).is(":checked")) {
    $('[id="checkForPreMig"]').prop("checked", true);
    $("#initMigration").css("display", "");
  } else {
    $("#initMigration").css("display", "none");
    $('[id="checkForPreMig"]').prop("checked", false);
  }
});

$("#showMuralStatus").on("click", function () {
  $(".statuFiltersMural").css({
    display: "flex",
    top: $(this).offset().top + 15 + "px",
    left: $(this).offset().left - 135 + "px",
  });
});

$(".statuFiltersMural").on("mouseleave", function () {
  $(".statuFiltersMural").css("display", "none");
});

$("#csvMuralsUpload").on("click", function () {
  document.getElementById("csvMuralsFile").value = "";
  $("#csvMuralsFile").trigger("click");
});

function csvMuralMappingFileUpload() {
  $("#CFShowLoading").show();
  $("#loaderTextS").html("Uploading CSV please wait...");
  var upload = document.getElementById("csvMuralsFile").files[0];
  console.log(upload);
  localStorage.setItem("muralMappingFileName", upload?.name.split(".csv")[0]);
  var reader = new FileReader();
  reader.onload = function () {
    sessionStorage.setItem("result", reader.result);
    csvMuralMappingUsersUpld(reader.result);
  };
  reader.readAsText(upload);
}

function csvMuralMappingUsersUpld(fileStream) {
  console.log(fileStream);
  let uri;
  uri =
    apicallurl +
    "/boardservice/csv/workspaces/" +
    localStorage.getItem("multiUsrSrcCldId");

  $.ajax({
    async: true,
    method: "POST",
    url: uri,
    data: fileStream,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (res) {
      $(".boardMappingTable table tbody").html("");
      if (!res || res.length === 0) {
        $("#CFShowLoading").hide();
        alertError("No Vaild CSV Mappigns Found");
        return false;
      }
      res?.map((data) => {
        $(".boardMappingTable table tbody").append(`<tr>
        <td style="width: 2%">
    <input type="checkbox" id="mappingSelect" fromBoardId="${
      data.boardId
    }" sourceBoardName="${escapeSpecialChar(
          data.boardName
        )}" style="margin: 0;">
      </td>
      <td style="width: 40%">
      <span title="${escapeSpecialChar(
        data?.boardName
      )}">${CFManageCloudAccountsAjaxCall.getMaxChars(
          escapeSpecialChar(data?.boardName),
          20
        )}</span>
          </td>
          <td style="width: 40%">
          <span>Root</span>
    </td>
    <td style="width: 2%">
    <i class="lnil lnil-cross-circle" style="cursor: pointer" id="removeBoardFromMappingList" from="csv" removeid="${
      data?.fromBoardId
    }"></i>
    </td>
    </tr>`);
      });
      $("#CFShowLoading").hide();
      $("#loaderTextS").html(
        "Csv validation is in process, Please don't close the window..."
      );
      valudateCSVMuralMappingUsersUpld(fileStream);
      $("#totalBoardsMappingsCache").html($('[id="mappingSelect"]').length);
    },
    error: function (err) {
      $("#CFShowLoading").hide();
      alertError("No Mappings Found...!");
    },
  });
}

{
  /* <td style="width: 30%;vertical-align: middle;">Not Initiated</td> */
}
function valudateCSVMuralMappingUsersUpld(fileStream) {
  $("#CFShowLoading").show();
  console.log(fileStream);
  $.ajax({
    async: true,
    method: "POST",
    url:
      apicallurl +
      "/boardservice/csv/validation/" +
      localStorage.getItem("multiUsrSrcCldId"),
    data: fileStream,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      console.log(data);
      downloadCSVFile(data, localStorage.muralMappingFileName + "_Report");
      CFNewLoader();
    },
    error: function (err) {
      CFNewLoader();
      alertError("Failed to download validated csv report...!");
    },
  });
}

function getMuralReports(pgNo) {
  if (Number(pgNo) === 1) {
    abortAjaxRequest("FILTER_REPORTS");
    CFNewLoader("Show");
    $("#muralReportsTable").html("");
  }
  $(".muralTable").attr("filters", "END");

  var userId = localStorage.getItem("UserId");
  boardsReportsRequest = $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/boardservice/migration/get/workspaces/" +
      userId +
      "?page_nbr=" +
      pgNo +
      "&page_size=50",
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      CFNewLoader();
      $('[id="changeStatusFilterForMuralReports"]').removeClass(
        "activeFilterMural"
      );
      $('[status="ALL"]').addClass("activeFilterMural");
      if (data) {
        appendBoardReports(data);
      }

      if (data?.length === 50) {
        $(".muralTable").attr("atpage", pgNo);
      } else {
        $(".muralTable").attr("atpage", "END");
      }
    },
  });
  setTimeout(function () {
    $("#CFShowLoading").hide();
  }, 1000);
}

$('[id="changeStatusFilterForMuralReports"]').on("click", function () {
  $('[id="changeStatusFilterForMuralReports"]').removeClass(
    "activeFilterMural"
  );
  $(this).addClass("activeFilterMural");
  if ($(this).attr("status") === "ALL") {
    getMuralReports(1);
    $(".muralTable").attr("filters", "END");
  } else {
    filterBoardReports(1, $(this).attr("status"));
    $(".muralTable").attr("filters", $(this).attr("status"));
  }

  $(".statuFiltersMural").css("display", "none");
});

function filterBoardReports(pgNo, filter) {
  let pageNo = pgNo ?? 1;
  let pageSize = 50;
  if (Number(pageNo) === 1) {
    abortAjaxRequest("REPORTS");
    CFNewLoader("Show");
    $("#muralReportsTable").html("");
  }
  filterBoardsReportsRequest = $.ajax({
    type: "GET",
    url: `${apicallurl}/boardservice/migration/get/workspaces/filter/${localStorage.UserId}?page_nbr=${pageNo}&page_size=${pageSize}&processStatus=${filter}`,
    aync: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      CFNewLoader();
      if (data) {
        appendBoardReports(data);
      }
      if (data?.length === 50) {
        $(".muralTable").attr("atpage", pgNo);
      } else {
        $(".muralTable").attr("atpage", "END");
      }
    },
    error: function (err) {
      CFNewLoader();
    },
  });
}

function appendBoardReports(data) {
  if (data) {
    for (let i = 0; i < data.length; i++) {
      var _data = data[i];
      var jobStatus = moveStatus[_data.processStatus];
      var createdTimeStamp = _data.createdTime;
      if (
        createdTimeStamp === undefined ||
        createdTimeStamp === "" ||
        createdTimeStamp === null ||
        createdTimeStamp === "null"
      ) {
        createdTimeStamp = "-";
      } else {
        createdTimeStamp = getDateConversion(_data.createdTime);
      }
      if (
        _data.sourceBoardName === undefined ||
        _data.sourceBoardName === "" ||
        _data.sourceBoardName === null ||
        _data.sourceBoardName === "null"
      ) {
        var sourceBoardName = "-";
      } else {
        var sourceBoardName = escapeSpecialChar(_data.sourceBoardName);
      }
      if (
        _data.destBoardName === undefined ||
        _data.destBoardName === "" ||
        _data.destBoardName === null ||
        _data.destBoardName === "null"
      ) {
        var destinationBoardName = "-";
      } else {
        var destinationBoardName = escapeSpecialChar(_data.destBoardName);
      }
      if (
        _data.processStatus === "PROCESSED_WITH_SOME_CONFLICTS" ||
        _data.processStatus === "PROCESSED" ||
        _data.processStatus === "IN_QUEUE"
      ) {
        var downloadMuralWorkspace =
          '<i class="lnil lnil-download" id="downloadMuralWorkspaceReports" style="color:#0062ff;font-size: 16px;font-weight: bold;" worspaceId=' +
          _data.id +
          "></i>";
      } else {
        var downloadMuralWorkspace =
          '<i class="lnil lnil-download" id="downloadMuralWorkspaceReports" style="opacity:0.4;pointer-events:none;color:#0062ff;font-size: 16px;font-weight: bold;" worspaceId=' +
          _data.id +
          "></i>";
      }
      if (
        _data.processStatus === "CANCEL" ||
        _data.processStatus === "CONFLICT" ||
        _data.processStatus === "IN_QUEUE" ||
        _data.processStatus === "SUSPENDED"
      ) {
        var inputCheckbox = `<input type="checkbox" disabled/>`;
      } else {
        var inputCheckbox = `<input type="checkbox" wsid="${_data?.id}" id="actinCheckBox" status="${_data.processStatus}"/>`;
      }
      $("#muralReportsTable").append(
        ` <tr>
                        <td style="padding: 0 !important;width: 5px;">${inputCheckbox}</td>
                        <td title="${sourceBoardName}">${CFManageCloudAccountsAjaxCall.getMaxChars(
          sourceBoardName,
          25
        )}</td>
      <!--<td title="Smart Home End Consumer SE">Smart Home... Consumer SE</td>-->
      <td>${_data.totalWidgets}</td>
      <td>${_data.processedCount}</td>
      <td>${_data.unsupportedWidgets}</td>
      <td>${_data.conflictCount}</td>
      <!--<td>Oct 25, 2022</td>-->
      <td
      class="${_data.processStatus}"
      id="wstatus${_data.id}">
      <div style="display: flex;flex-direction: column;gap: 0;">
      <span id="wstatusText${_data.id}">${jobStatus}</span>
        <span style="color: #acacac;font-weight: 400;font-size: 10px;">${createdTimeStamp}</span>
        </div>
        </td>
        </tr>
        <tr>`
      );
    }
  }
}

$("#moveBoardTable").on("scroll", function () {
  if (
    $(this).scrollTop() + $(this).innerHeight() >=
    $(this)[0].scrollHeight - 40
  ) {
    if ($(".muralTable").attr("atpage") !== "END") {
      if ($(".muralTable").attr("filters") === "END") {
        abortAjaxRequest("REPORTS");
        abortAjaxRequest("FILTER_REPORTS");
        getMuralReports(Number($(".muralTable").attr("atpage")) + 1);
      } else if ($(".muralTable").attr("filters") === "SEARCH") {
        abortAjaxRequest("REPORTS");
        abortAjaxRequest("SEARCH_REPORTS");
        abortAjaxRequest("FILTER_REPORTS");
        getBoardFilterReports(Number($(".muralTable").attr("atpage")) + 1);
      } else {
        abortAjaxRequest("REPORTS");
        abortAjaxRequest("FILTER_REPORTS");
        filterBoardReports(
          Number($(".muralTable").attr("atpage")) + 1,
          $(".muralTable").attr("filters")
        );
      }
    }
  }
});

function abortAjaxRequest(requestName) {
  if (requestName === "REPORTS") {
    if (boardsReportsRequest) {
      boardsReportsRequest.abort();
    }
  }
  if (requestName === "FILTER_REPORTS") {
    if (filterBoardsReportsRequest) {
      filterBoardsReportsRequest.abort();
    }
  }
  if (requestName === "SEARCH_REPORTS") {
    if (searchBoardsRequest) {
      searchBoardsRequest.abort();
    }
  }
}

// Boards Search

$("#toogleBoardsFilters").on("click", function () {
  $("#fullBoardsFilters").css("display", "flex");
});

$("#closeFilterBoardsReports").on("click", function () {
  $("#fullBoardsFilters").css("display", "none");
});

$(
  "#boardsInitiatedAfter,#boardsInitiatedBefore,#boardsProcessedAfter,#boardsProcessedBefore"
).datepicker({
  dateFormat: "yy-mm-dd",
  maxDate: 0,
  changeMonth: true,
  changeYear: true,
  showOn: "both",
});

$("#boardsInitiatedAfter").on("change", function () {
  var selectedInitiatedAfterDate = $(this).datepicker("getDate");
  $(
    "#boardsProcessedAfter,#boardsInitiatedBefore,#boardsProcessedBefore"
  ).datepicker("option", "minDate", selectedInitiatedAfterDate);
});

$("#boardsProcessedAfter").on("change", function () {
  var selectedProcessedAfterDate = $(this).datepicker("getDate");
  $("#boardsProcessedBefore").datepicker(
    "option",
    "minDate",
    selectedProcessedAfterDate
  );
});

$("#totalWidgetsRangeFromCount").on("change", function () {
  if ($("#totalWidgetsRangeToCount").val()) {
    if (Number($(this).val()) > Number($("#totalWidgetsRangeToCount").val())) {
      alertError(
        "Minimum Widget Count Should Be Less Than Maximum Widget Count"
      );
      $(this).val("");
      $("#totalWidgetsRangeFromCount").focus();
    }
  }
});

$("#totalWidgetsRangeToCount").on("change", function () {
  if ($("#totalWidgetsRangeFromCount").val()) {
    if (
      Number($(this).val()) < Number($("#totalWidgetsRangeFromCount").val())
    ) {
      alertError(
        "Maximum Widget Count Should Be Greater Than Minimum Widget Count"
      );
      $(this).val("");
      $("#totalWidgetsRangeToCount").focus();
    }
  }
});

$("#applyFilterReports").on("click", function () {
  getBoardFilterReports();
});

function getBoardFilterReports(pgNo) {
  let pageNo = pgNo ?? 1;
  function getTimeMS(date) {
    return new Date(date).getTime();
  }
  let initiatedAfterDate = $("#boardsInitiatedAfter").val();
  let initiatedBeforeDate = $("#boardsInitiatedBefore").val();
  let processedAfterDate = $("#boardsProcessedAfter").val();
  let processedBeforeDate = $("#boardsProcessedBefore").val();
  let minWidgets = $("#totalWidgetsRangeFromCount").val();
  let maxWidgets = $("#totalWidgetsRangeToCount").val();

  let searchValues = {
    startFromDate: initiatedAfterDate ? getTimeMS(initiatedAfterDate) : null,
    startToDate: initiatedBeforeDate ? getTimeMS(initiatedBeforeDate) : null,
    endFromDate: processedAfterDate ? getTimeMS(processedAfterDate) : null,
    endToDate: processedBeforeDate ? getTimeMS(processedBeforeDate) : null,
    minWidgets: minWidgets ? Number(minWidgets) : null,
    maxWidgets: maxWidgets ? Number(maxWidgets) : null,
  };

  if (
    searchValues.startFromDate === null &&
    searchValues.startToDate === null &&
    searchValues.endFromDate === null &&
    searchValues.endToDate === null &&
    searchValues.minWidgets === null &&
    searchValues.maxWidgets === null
  ) {
    alertError("Select Atleast One Filed To Apply Filters");
    return false;
  }

  if (Number(pageNo) === 1) {
    abortAjaxRequest("FILTER_REPORTS");
    abortAjaxRequest("SEARCH_REPORTS");
    CFNewLoader("Show");
    $("#muralReportsTable").html("");
  }
  $(".muralTable").attr("filters", "SEARCH");
  searchBoardsRequest = $.ajax({
    type: "GET",
    url: `${apicallurl}/boardservice/migration/get/workspaces/filter/date/${localStorage.UserId}?page_nbr=${pageNo}&page_size=100&startFormDate=${searchValues.startFromDate}&startToDate=${searchValues.startToDate}&endFormDate=${searchValues.endFromDate}&endToDate=${searchValues.endToDate}&minWidgets=${searchValues.minWidgets}&maxWidgets=${searchValues.maxWidgets}`,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success(data) {
      CFNewLoader();
      if (data) {
        appendBoardReports(data);
      } else {
        alertError("No Reports Found");
      }

      if (data?.length === 100) {
        $(".muralTable").attr("atpage", pageNo);
      } else {
        $(".muralTable").attr("atpage", "END");
      }
    },
  });
}

$(
  "#boardsInitiatedAfter,#boardsInitiatedBefore,#boardsProcessedAfter,#boardsProcessedBefore,#boardsCreatedAfter,#boardsCreatedBefore,#boardsModifiedAfter,#boardsModifiedBefore"
).on("keydown", function (e) {
  console.log(e);
  var keyCode = e.keyCode || e.which;

  if (keyCode === 8 || keyCode === 46) {
    $(this).datepicker("setDate", null);
    if ($(this).attr("id") === "boardsInitiatedAfter") {
      $(
        "#boardsProcessedAfter,#boardsInitiatedBefore,#boardsProcessedBefore"
      ).datepicker("option", "minDate", null);
    }

    if ($(this).attr("id") === "boardsProcessedAfter") {
      $("#boardsProcessedBefore").datepicker("option", "minDate", null);
    }
  } else {
    alertError("Manual Date Input is restricted select through Date Picker");
    e.preventDefault();
  }
});
