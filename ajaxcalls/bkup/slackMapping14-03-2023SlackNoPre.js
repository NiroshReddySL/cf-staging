let usersMappingRequest,
  channelsMappingRequest,
  userMappingSearchRequest,
  userAuthSearchRequest;
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

$(document).ready(function () {
  localStorage.removeItem("selSourceCloud");
  localStorage.removeItem("selDstnCloud");
});

$(document).on("click", 'input[name="sourceCloud"]', function () {
  localStorage.setItem("selSourceCloud", $(this).attr("cloudname"));
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
  if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
    $('[data-target="preMigration"]').css("display", "none");
    $('[data-target="directMessages"]').css("display", "none");
    $('[data-target="mapping"]').attr("data-val", 2);
    $('[data-target="mapping"]').find(".badge").html("2");
    $("#teamMigrationWidget").find("ul").css("margin-left", "-8%");
    $('[data-target="slackMigrate"]').css("display", "");
    $('[data-target="slackMigrate"]').attr("data-val", 3);
    $('[data-target="slackMigrate"]').find(".badge").html("3");
    $("#changeNameBadge").html("Map & Authenticate");
  } else if (
    selectedSource === "MICROSOFT_TEAMS" &&
    selectedDestination === "MICROSOFT_TEAMS"
  ) {
    $('[data-target="preMigration"]').css("display", "none");
    $('[data-target="directMessages"]').css("display", "none");
    $('[data-target="mapping"]').attr("data-val", 2);
    $('[data-target="mapping"]').find(".badge").html("2");
    $("#teamMigrationWidget").find("ul").css("margin-left", "-8%");
    $('[data-target="slackMigrate"]').css("display", "");
    $('[data-target="slackMigrate"]').attr("data-val", 3);
    $('[data-target="slackMigrate"]').find(".badge").html("3");
  } else {
    $("#changeNameBadge").html("Map & Migrate");
    $('[data-target="slackMigrate"]').css("display", "none");
    $('[data-target="slackMigrate"]').attr("data-val", 9);
    $('[data-target="slackMigrate"]').find(".badge").html("9");
    $('[data-target="mapping"]').attr("data-val", 3);
    $('[data-target="mapping"]').find(".badge").html("3");
    $('[data-target="preMigration"]').css("display", "");
    $('[data-target="directMessages"]').css("display", "");
    $("#teamMigrationWidget").find("ul").css("margin-left", "-6%");
  }
}

$("#forNextMove").click(function () {
  let selectedSource = localStorage.getItem("selSourceCloud") ?? "";
  let selectedDestination = localStorage.getItem("selDstnCloud") ?? "";

  $(".ui-helper-hidden-accessible").hide();
  $("#forPreviousMove").removeClass("disabled");
  $("#forNextMove").addClass("disabled");
  var _step = parseInt($("#forNextMove").attr("data-step"));
  _step = _step + 1;
  if (_step == 0) return false;
  else if (_step == 1) {
    $("#selDiv").css("display", "none");
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
    $("#mappingDirectMsgs").css("display", "none");
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
  } else if (_step == 2) {
    $("#selDiv").css("display", "none");
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

    if (localStorage.selSourceCloud === "SLACK") {
      $("#sourceImageAtUserMapping").attr("src", "../img/PNG/SLACK1.png");
    } else {
      $("#sourceImageAtUserMapping").attr(
        "src",
        "../img/PNG/MICROSOFT_TEAMS1.png"
      );
    }

    if (localStorage.selDstnCloud === "SLACK") {
      $("#destinationImageAtUserMapping").attr("src", "../img/PNG/SLACK1.png");
    } else {
      $("#destinationImageAtUserMapping").attr(
        "src",
        "../img/PNG/MICROSOFT_TEAMS1.png"
      );
    }

    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    $("#forNextMove").removeClass("disabled");
    $("#channelsTab").find("a").html("Public Channels");
    if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
      runForStepThree(_step, "Slack");
      $("#mappingPreMigration").css("display", "none");
      $("#mappingClouds").css("display", "none");
      //$("#mappingUsers").css("display","none");
      $("#privateChannelsTab").css("display", "none");
      $("#authenticateUsersTabSlack").css("display", "");
      // $("#privateChannelsTab").css("display", "none");
      $("#authenticateUsersSrcTabSlack").css("display", "");
    } else if (
      selectedSource === "MICROSOFT_TEAMS" &&
      selectedDestination === "MICROSOFT_TEAMS"
    ) {
      $("#channelsTab").find("a").html("Teams and Channels");
      $("#syncChannels").css("display", "");
      $("#clearChannelsCsvBtn").css("display", "");
      $("#checkInputThead").css("width", "5px");
      $("#migrateAsChannelsThead").css("width", "24.5%");
      $("#channelsTab").css("display", "");
      $("#privateChannelsTab").css("display", "none");
      $("#usersTab").css("display", "");
      runForStepThree(_step, "Teams");
      $("#forNextMove").css({ width: "140px" });
      $("#forNextMove span").text("Start Migration");
      $("#forNextMove").addClass("disabled");
    } else {
      $(".privateChannels").css("display", "none");
      $("#privateChannelsTab").css("display", "none");
      $("#mappingPreMigration").css("display", "");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#destinationImageAtUserMapping").attr(
        "src",
        "../img/PNG/MICROSOFT_TEAMS1.png"
      );
      $("#authenticateUsersTabSlack").css("display", "none");
      $("#authenticateUsersSrcTabSlack").css("display", "none");
    }
  } else if (_step == 3) {
    $("#selDiv").css("display", "none");
    if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
      $("#privateChannelsTab").css("display", "");
      startStepThreeForSlack(_step);
    } else if (
      selectedSource === "MICROSOFT_TEAMS" &&
      selectedDestination === "MICROSOFT_TEAMS"
    ) {
      $("#loaderText").html("Preparing to initiate migration, please wait...");
      $("#CFShowLoading").toggle();
      localStorage.setItem("trackDirectMessagesForSlack", "TEAMS");
      migrateMsg();
    } else {
      $("#syncChannels").css("display", "");
      $("#clearChannelsCsvBtn").css("display", "");
      $("#checkInputThead").css("width", "5px");
      $("#migrateAsChannelsThead").css("width", "24.5%");
      $("#channelsTab").css("display", "");
      $("#privateChannelsTab").css("display", "");
      $("#usersTab").css("display", "");
      runForStepThree(_step, "Teams");
    }
  } else if (_step == 4) {
    //alert();
    if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
      $("#loaderText").html("Preparing to initiate migration, please wait...");
      $("#CFShowLoading").toggle();
      migrateMsg();
    } else {
      for (var i = 0; i < AllCloudsInfo.length; i++) {
        if (localStorage.multiUsrSrcCldId == AllCloudsInfo[i].id) {
          localStorage.setItem("workspaceName", AllCloudsInfo[i].metadataUrl);
          break;
        }
      }
      localStorage.setItem("userTableStatus", "NO");
      $("#CFShowLoading").show();
      //migrateMsg();
      $("#srcUsersTab").trigger("click");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#mappingDirectMsgs").css("display", "");
      $("#mappingPreMigration").css("display", "none");
      $("#forNextMove").css({ width: "140px" });
      $("#forNextMove span").text("Start Migration");
      $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
        .removeClass("active")
        .addClass("completed");
      $("#forNextMove").attr("data-step", _step);
      $("#forPreviousMove").attr("data-prev", _step);
      $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass(
        "active"
      );
      if (
        $("input[name=channelSelect]:checked").length !== 0 ||
        $("input[id=selectAllChannels]:checked").length !== 0
      ) {
        $("#forNextMove").removeClass("disabled");
      } else {
        $("#forNextMove").addClass("disabled");
      }
    }
  } else if (_step == 5) {
    migrateMsg();
  }
});

function runForStepThree(_step, cloud) {
  localStorage.removeItem("isPrivateChannelsTabClicked");
  localStorage.removeItem("isChannelsTabClicked");
  localStorage.removeItem("ChannelsFetchedList");
  localStorage.removeItem("privateChannelsCacheList");
  localStorage.removeItem("isPrivateChannelMigration");
  localStorage.removeItem("isDmsTabClicked");
  localStorage.removeItem("isDmAllOptionsClicked");
  localStorage.removeItem("isDmGroupOptionsClicked");
  localStorage.removeItem("isDmOneToOneOptionsClicked");
  localStorage.removeItem("cloudListDMGROUP");
  localStorage.removeItem("cloudListDMONE");
  localStorage.removeItem("cloudListDM");
  localStorage.removeItem("dmsCacheList");
  localStorage.removeItem("dmAllCacheList");
  localStorage.removeItem("dmGroupCacheList");
  localStorage.removeItem("dmOnetoOneCacheList");
  localStorage.removeItem("isPrivateChannelMigration");

  /*localStorage.setItem("multiUsrSrcCldId",$('#srcClouds input[name=sourceCloud]:checked').attr("id"));
                    localStorage.setItem("multiUsrDstnCldId",$('#dstClouds input[name=dstCloud]:checked').attr("id"));
                    localStorage.setItem("multiUsrDstnEmail",$('#dstClouds input[name=dstCloud]:checked').attr("mail"));
                    localStorage.setItem("multiUsrSrcEmail",$('#srcClouds input[name=sourceCloud]:checked').attr("mail"));*/

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
  $("#mappingDirectMsgs").css("display", "none");
  $("#usersTab").trigger("click");
  $("#mappingClouds").css("display", "none");
  $("#mappingUsers").css("display", "");
  $("#mappingPreMigration").css("display", "none");
  if (cloud === "Slack") {
    $("#channelsTab").css("display", "none");
    $("#usersTab").css("display", "");
    $("#authenticateUsersTabSlack").css("display", "");
    $("#authenticateUsersSrcTabSlack").css("display", "");
  } else {
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    $("#forNextMove").removeClass("disabled");
  }
}

$("#forPreviousMove").click(function () {
  let selectedSource = localStorage.getItem("selSourceCloud") ?? "";
  let selectedDestination = localStorage.getItem("selDstnCloud") ?? "";

  var _step = parseInt($("#forPreviousMove").attr("data-prev"));
  $(".ui-helper-hidden-accessible").hide();
  if (_step == 6) location.reload();
  $("#forNextMove").css({ width: "83.5px" });
  $("#forNextMove span").text("Next");
  $("#preview").css("display", "none");
  $("#forNextMove").removeClass("disabled");
  _step = _step - 1;
  resetFilters("");
  if (_step == 0) return false;
  else if (_step == 1) {
    localStorage.setItem("userTableStatus", "NO");
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
    $("#mappingDirectMsgs").css("display", "none");
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
  } else if (_step == 2) {
    if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
      $("#channelsTab").css("display", "none");
      $("#usersTab").css("display", "");
      $("#authenticateUsersTabSlack").css("display", "");
      $("#authenticateUsersSrcTabSlack").css("display", "");
      $("#privateChannelsTab").css("display", "none");
      $("#forNextMove").css({ width: "83.5px" });
      $("#forNextMove span").text("Next");
      $("#usersTab").click();
    } else {
      $("#channelsTab").css("display", "");
      $("#usersTab").css("display", "");
      $("#selDiv").css("display", "none");
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "none");
      $("#mappingPreMigration").css("display", "");
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
    }
  } else if (_step == 3) {
    $("#selDiv").css("display", "none");
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
    $("#mappingDirectMsgs").css("display", "none");
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
  //  $("#forNextMove").removeClass("disabled");
  if ($("#teamMigrationWidget ul li.last").hasClass("completed")) return false;

  if ($(this).hasClass("active") || $(this).hasClass("completed")) {
    var _step = parseInt($(this).find(".badge").text());
    $("#preview").css("display", "none");

    if (_step == 0) return false;
    else if (_step == 1) {
      $("#selDiv").css("display", "none");
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $(".ui-helper-hidden-accessible").hide();
      $("#forPreviousMove").addClass("disabled");
      $("#mappingClouds").css("display", "");
      $("#mappingUsers").css("display", "none");
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingPreMigration").css("display", "none");
      $("#mappingDirectMsgs").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
      if (
        $("#srcClouds input:checked").length &&
        $("#dstClouds input:checked").length
      )
        $("#forNextMove").removeClass("disabled");
    } else if (_step == 2) {
      $("#selDiv").css("display", "none");
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $("#mappingClouds").css("display", "none");
      if (localStorage.selSourceCloud === localStorage.selDstnCloud) {
        $("#mappingUsers").css("display", "");
        $("#mappingPreMigration").css("display", "none");
        $("#channelsTab").css("display", "none");
        $("#authenticateUsersTabSlack").css("display", "");
        $("#authenticateUsersSrcTabSlack").css("display", "");
        $("#usersTab").css("display", "");
        $("#usersTab").click();
        $("#forNextMove").removeClass("disabled");
      } else {
        $("#mappingUsers").css("display", "none");
        $("#mappingPreMigration").css("display", "");
      }
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#mappingDirectMsgs").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
    } else if (_step == 3) {
      $("#selDiv").css("display", "none");
      $("#srcUsrs .custom-search-input input").val("");
      $("#mapdUsrs .custom-search-input input").val("");
      $("#dstnUsrs .custom-search-input input").val("");
      $("#mappingClouds").css("display", "none");
      $("#mappingUsers").css("display", "");
      $("#mappedMigration").css("display", "none");
      $("#mappedSyncMigration").css("display", "none");
      $("#mappingOptions").css("display", "none");
      $("#mappingOptionsNew").css("display", "none");
      $("#mappingDirectMsgs").css("display", "none");
      if ($("#mapdUsers input[name=inputMapdUrs]:checked").length)
        $("#forNextMove").removeClass("disabled");
    }

    if (_step < 4) {
      $("#selDiv").css("display", "none");
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
    for (; _step < 5; _step++)
      $("#teamMigrationWidget ul li[data-val=" + _step + "]")
        .removeClass("active")
        .removeClass("completed");
  }
});

function startStepThreeForSlack(_step) {
  console.log("THIS IS STEP THREE");
  $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
    .removeClass("active")
    .addClass("completed");
  $("#forNextMove").attr("data-step", _step);
  $("#forPreviousMove").attr("data-prev", _step);
  $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
  $("#forNextMove").removeClass("disabled");
  $("#channelsTab").css("display", "");
  $("#channelsTab").click();
  $("#checkInputThead").css("width", "46px");
  $("#migrateAsChannelsThead").css("width", "47.6%");
  $("#usersTab").css("display", "none");
  $("#authenticateUsersTabSlack").css("display", "none");
  $("#authenticateUsersSrcTabSlack").css("display", "none");
  $("#forNextMove").css({ width: "140px" });
  $("#forNextMove span").text("Start Migration");
  $("#forNextMove").addClass("disabled");
  $("#syncChannels").css("display", "none");
  $("#clearChannelsCsvBtn").css("display", "none");
}

function fetchCacheChannels(data, type, pgNo) {
  if (type === "CSV" && data.length === 0) {
    alertError("Please upload valid csv");
    return false;
  }
  if (pgNo === 1 || pgNo === undefined) {
    $("#channelsTable table tbody").html("");
  }
  for (var i = 0; i < AllCloudsInfo.length; i++) {
    if (localStorage.multiUsrSrcCldId == AllCloudsInfo[i].id) {
      var workspaceName = AllCloudsInfo[i].metadataUrl;
      break;
    }
  }
  var channelName,
    dstnChannelName,
    dstnTeamName,
    fromCloudId,
    iids,
    channelType;
  //var data = JSON.parse(localStorage.ChannelsFetchedList);
  var pubCount = 0,
    pvtCount = 0;
  for (var i = 0; i < data.length; i++) {
    if (type === "CSV") {
      console.log(data[i].channelName);
      fromCloudId = data[i].fromCloudId.id;
      channelName = data[i].channelName;
      dstnChannelName = data[i].destChannelName;
      dstnTeamName = data[i].destTeamName;
      iids = data[i].fromRootId;
      channelType = data[i].channelType;
    } else if (type === "PVT") {
      fromCloudId = data[i].cloudId;
      channelName = data[i].channelName;
      dstnChannelName = data[i].channelName;
      dstnTeamName = data[i].channelName;
      iids = data[i].fromRootId;
      channelType = data[i].types;
    } else {
      fromCloudId = data[i].cloudId;
      channelName = data[i].objectName;
      dstnChannelName = data[i].objectName;
      dstnTeamName = data[i].objectName;
      iids = data[i].id;
      channelType = data[i].channelType;
    }
    if ($("#selectAllChannels:checked").length) {
      var _input =
        '<input type="checkbox" name="channelSelect" id="' +
        iids +
        '" cid="' +
        fromCloudId +
        '" workspacename="' +
        '" aid="' +
        data[i].adminCloudId +
        '" workspacename="' +
        workspaceName +
        '" channeltype="' +
        channelType +
        '" channelname="' +
        channelName +
        '" destchannelname="' +
        dstnChannelName +
        '" destteamname="' +
        dstnTeamName +
        '" subchannel="false" channeldate="' +
        data[i].channelDate +
        '" checked>';
    } else {
      var _input =
        '<input type="checkbox" name="channelSelect" id="' +
        iids +
        '" cid="' +
        fromCloudId +
        '" aid="' +
        data[i].adminCloudId +
        '" workspacename="' +
        workspaceName +
        '" channeltype="' +
        channelType +
        '" channelname="' +
        channelName +
        '" destchannelname="' +
        dstnChannelName +
        '" destteamname="' +
        dstnTeamName +
        '" subchannel="false" channeldate="' +
        data[i].channelDate +
        '">';
    }
    if (
      data[i].createdBy === "" ||
      data[i].createdBy === null ||
      data[i].createdBy === undefined
    ) {
      var createdBy = "-";
    } else {
      createdBy = data[i].createdBy;
    }
    if (data[i].channelType === "public") {
      var _html =
        '<tr fromRootId="' +
        data[i].id +
        '"><td style="width: 1%;">' +
        _input +
        '</td><td style="width:18%;" title="' +
        channelName +
        '" id="public"><i class="fa fa-hashtag" style="color:#000;font-size: 10px !important;font-weight:100 !important;"></i>&nbsp;' +
        CFManageCloudAccountsAjaxCall.getMaxChars(channelName, 16) +
        "</td>" +
        '<td style="width: 16%;"><span title="' +
        createdBy +
        '" id="createdByUsers">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(createdBy, 14) +
        "</span></td>" +
        //'<td style="width: 16%;"><select id="JobType_dropDown" style=""><option>One Time</option><option>Delta</option></select></td>' +
        '<td style="width: 16%;"><select id="msgType_dropDown" style=""><option>Team</option><option>Sub-Channel</option></select></td>' +
        '<td style="width: 19%;"><span id="destTeamNameSpan" title="' +
        dstnTeamName +
        '">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(dstnTeamName, 14) +
        '</span><i class="lnil lnil-pencil" id="destTeamEdit" channelobject="' +
        encodeURIComponent(JSON.stringify(data[i])) +
        '" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
        '<td style="width: 18%;"><span id="destChannelNameSpan" title="' +
        dstnChannelName +
        '">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(dstnChannelName, 14) +
        '</span><i class="lnil lnil-pencil" id="destChannelEdit" channelobject="' +
        encodeURIComponent(JSON.stringify(data[i])) +
        '" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
        "</tr>";
    } else {
      var _html =
        '<tr fromRootId="' +
        data[i].id +
        '"><td style="width: 1%;">' +
        _input +
        '</td><td style="width:18%;" title="' +
        channelName +
        '" id="private"><i class="fa fa-lock" style="color:#000;font-size: 10px !important;font-weight:100 !important;"></i>&nbsp;' +
        CFManageCloudAccountsAjaxCall.getMaxChars(channelName, 16) +
        "</td>" +
        '<td style="width: 16%;" id="createdByUsersTd"><span title="' +
        createdBy +
        '" id="createdByUsers">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(createdBy, 14) +
        "</span></td>" +
        //'<td style="width: 16%;"><select id="JobType_dropDown" style=""><option>One Time</option><option>Delta</option></select></td>' +
        '<td style="width: 16%;"><select id="msgType_dropDown" style=""><option>Team</option><option>Sub-Channel</option></select></td>' +
        '<td style="width: 19%;"><span id="destTeamNameSpan" title="' +
        dstnTeamName +
        '">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(dstnTeamName, 14) +
        '</span><i class="lnil lnil-pencil" id="destTeamEdit" channelobject="' +
        encodeURIComponent(JSON.stringify(data[i])) +
        '" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
        '<td style="width: 18%;"><span id="destChannelNameSpan" title="' +
        dstnChannelName +
        '">' +
        CFManageCloudAccountsAjaxCall.getMaxChars(dstnChannelName, 14) +
        '</span><i class="lnil lnil-pencil" id="destChannelEdit" channelobject="' +
        encodeURIComponent(JSON.stringify(data[i])) +
        '" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
        "</tr>";
    }
    $("#channelsTable table tbody").append(_html);
    if (data[i].channelType == "public") {
      pubCount++;
    } else {
      pvtCount++;
    }
  }
  if (type === "CSV") {
    $('[id="createdByUsers"]').parent("td").css("display", "none");
    $("#createdByThead").css("display", "none");
    $("#channelNameThead").css("width", "34%");
    $("#migrateTypeThead").css("width", "16%");
    $("#migrateAsThead").css("width", "16%");
    $("#dstnTeamNameThead").css("width", "28%");
    $("#migrateTypeThead").children("span").css("margin-left", "18px");
    $("#migrateAsThead").children("span").css("margin-left", "-38px");
    $("#dstnChannelNameThead").children("span").css("margin-left", "-30px");
  } else {
    $('[id="createdByUsers"]').parent("td").css("display", "");
    $("#createdByThead").css("display", "");
    $("#channelNameThead").css("width", "25%");
    $("#migrateTypeThead").css("width", "16%");
    $("#migrateTypeThead").children("span").css("margin-left", "70px");
    $("#migrateAsThead").children("span").css("margin-left", "18%");
    $('[id="private"]').css("width", "18%");
    $('[id="public"]').css("width", "18%");
  }
  $("#mapCount").text($("#channelsTable tbody tr").length);
  $("#pubDiv").text("Public : ");
  $("#pvtDiv").text("Private : ");
  $("#channelCntNewCount").text($("#channelsTable tbody tr").length);
  $("#pubDiv").text("Public : ");
  $("#pvtDiv").text("Private : ");
  $("#publicCntNewCount").text(
    Number($("#publicCntNewCount").text()) + pubCount
  );
  $("#pvtDivNewCount").text(Number($("#pvtDivNewCount").text()) + pvtCount);
  $("#csvChannels").css("display", "");
  if ($("#selectAllChannels:checked").length) {
    $("#selCount").text($("#channelsTable tbody tr").length);
  }
}

var channelsFetchedList = [];

pageNumb = 1;
function slackChannels(cloudId, type, pgNo) {
  $("#displayFooterTextChannels").css("display", "flex");
  $("#displayFooterText").css("display", "none");
  var pageNo, fetchType;
  if (type) {
    fetchType = type;
  } else {
    fetchType = "public";
  }
  if (pgNo) {
    pageNo = pgNo;
  } else {
    pageNo = 1;
    $("#csvChannels").css("display", "none");
    $("#selDivNewChannelsCount").css("display", "none");
    $("#publicCntNewCount").html(0);
    $("#pvtDivNewCount").html(0);
  }
  localStorage.setItem("isPrivateChannelMigration", "false");
  if (cloudId == undefined) cloudId = localStorage.multiUsrSrcCldId;
  for (var i = 0; i < AllCloudsInfo.length; i++) {
    if (cloudId == AllCloudsInfo[i].id) {
      var workspaceName = AllCloudsInfo[i].metadataUrl;
      break;
    }
  }

  url =
    apicallurl +
    "/messagemove/get/slack/channel?adminCloudId=" +
    cloudId +
    "&pageNo=" +
    pageNo +
    "&pageSize=50&channelType=" +
    fetchType;
  $.ajax({
    type: "GET",
    url: url,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if ($("#usersTab").hasClass("active")) {
        return false;
      }
      if (
        fetchType === "public" &&
        pageNo === 1 &&
        data === "No Provision User Found"
      ) {
        $("#loaderText").text(
          "Please wait while channels are being fetched..."
        );
        $("#CFShowLoading").show();
        startSyncChannels(true);
        return false;
      } else if (
        fetchType === "public" &&
        pageNo !== 1 &&
        data === "No Provision User Found"
      ) {
        slackChannels(cloudId, "private", 1);
      } else if (
        fetchType === "private" &&
        data === "No Provision User Found"
      ) {
        $("#CFShowLoading").hide();
        return false;
      } else {
        if (data === "No Provision User Found" || data.length === 0) {
          $("#CFShowLoading").hide();
        }
      }

      if (data.length > 0) {
        $("#usrSeach").css("display", "none");
        $("#chnlSrch").css("display", "flex");

        if (pageNo == 1) {
          localStorage.removeItem("ChannelsFetchedList");
          $("#channelsTable table tbody").html("");
        }
        $("#usrMapping").css("display", "none");
        $("#channelsTable p").css("display", "none");
        var pubCount = 0,
          pvtCount = 0;
        for (var i = 0; i < data.length; i++) {
          channelsFetchedList.push(data[i]);
          localStorage.setItem(
            "ChannelsFetchedList",
            JSON.stringify(channelsFetchedList)
          );
          if (data[i].destTeamName) {
            var destTeamName = data[i].destTeamName;
            destTeamName = getReplaceSpChar(destTeamName);
          } else {
            var destTeamName = data[i].channelName;
            destTeamName = getReplaceSpChar(destTeamName);
          }
          if (data[i].destChannelName) {
            var destChannelName = data[i].destChannelName;
            destChannelName = getReplaceSpChar(destChannelName);
          } else {
            var destChannelName = data[i].channelName;
            destChannelName = getReplaceSpChar(destChannelName);
          }
          if ($("#selectAllChannels:checked").length) {
            var _input =
              '<input type="checkbox" name="channelSelect" id="' +
              data[i].fromRootId +
              '"aid="' +
              data[i].adminCloudId +
              '" cid="' +
              data[i].cloudId +
              '" workspacename="' +
              workspaceName +
              '" channeltype="' +
              data[i].types +
              '" channelname="' +
              data[i].channelName +
              '" destchannelname="' +
              destChannelName +
              '" destteamname="' +
              destTeamName +
              '" subchannel="false" channeldate="' +
              data[i].channelDate +
              '" checked>';
          } else {
            var _input =
              '<input type="checkbox" name="channelSelect" id="' +
              data[i].fromRootId +
              '" aid="' +
              data[i].adminCloudId +
              '" cid="' +
              data[i].cloudId +
              '" workspacename="' +
              workspaceName +
              '" channeltype="' +
              data[i].types +
              '" channelname="' +
              data[i].channelName +
              '" destchannelname="' +
              destChannelName +
              '" destteamname="' +
              destTeamName +
              '" subchannel="false" channeldate="' +
              data[i].channelDate +
              '">';
          }
          if (
            data[i].createdBy === "" ||
            data[i].createdBy === null ||
            data[i].createdBy === undefined
          ) {
            var createdBy = "-";
          } else {
            createdBy = data[i].createdBy;
          }
          if (data[i].types === "public") {
            var _html =
              '<tr fromRootId="' +
              data[i].id +
              '"><td style="width: 1%;">' +
              _input +
              '</td><td style="width:18%;" title="' +
              data[i].channelName +
              '" id="public"><i class="fa fa-hashtag" style="color:#000;font-size: 10px !important;font-weight:100 !important;"></i>&nbsp;' +
              CFManageCloudAccountsAjaxCall.getMaxChars(
                data[i].channelName,
                16
              ) +
              "</td>" +
              //'<td style="width: 16%;display:none;"><span title="'+createdBy+'" id="createdByUsers">'+CFManageCloudAccountsAjaxCall.getMaxChars(createdBy, 14)+'</span></td>'+
              //'<td style="width: 16%;"><select id="JobType_dropDown" style=""><option>One Time</option><option>Delta</option></select></td>'+
              '<td style="width: 16%;"><select id="msgType_dropDown" style=""><option>Team</option><option>Sub-Channel</option></select></td>' +
              '<td style="width: 19%;"><span id="destTeamNameSpan" title="' +
              destTeamName +
              '">' +
              CFManageCloudAccountsAjaxCall.getMaxChars(destTeamName, 14) +
              '</span><i class="lnil lnil-pencil" id="destTeamEdit" channelobject=' +
              encodeURIComponent(JSON.stringify(data[i])) +
              ' style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
              '<td style="width: 18%;"><span id="destChannelNameSpan" title="' +
              destChannelName +
              '">' +
              CFManageCloudAccountsAjaxCall.getMaxChars(destChannelName, 14) +
              '</span><i class="lnil lnil-pencil" id="destChannelEdit" channelobject=' +
              encodeURIComponent(JSON.stringify(data[i])) +
              ' style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
              "</tr>";
          } else {
            let cwidth;
            if (
              localStorage.selSourceCloud === "SLACK" &&
              localStorage.selDstnCloud === "SLACK"
            ) {
              cwidth = `width: 18%`;
            } else {
              cwidth = `width: 13%`;
            }
            var _html =
              '<tr fromRootId="' +
              data[i].id +
              '"><td style="width: 1%;">' +
              _input +
              '</td><td style="' +
              cwidth +
              '" title="' +
              data[i].channelName +
              '" id="private"><i class="fa fa-lock" style="color:#000;font-size: 10px !important;font-weight:100 !important;"></i>&nbsp;' +
              CFManageCloudAccountsAjaxCall.getMaxChars(
                data[i].channelName,
                16
              ) +
              "</td>" +
              //'<td style="width: 16%;display:none;"><span title="'+createdBy+'" id="createdByUsers">'+CFManageCloudAccountsAjaxCall.getMaxChars(createdBy, 14)+'</span></td>'+
              //'<td style="width: 16%;"><select id="JobType_dropDown" style=""><option>One Time</option><option>Delta</option></select></td>'+
              // '<td style="width: 16%;"><select id="msgType_dropDown" style=""><option>Team</option><option>Sub-Channel</option></select></td>' +
              '<td style="width: 19%;"><span id="destTeamNameSpan" title="' +
              destTeamName +
              '">' +
              CFManageCloudAccountsAjaxCall.getMaxChars(destTeamName, 14) +
              '</span><i class="lnil lnil-pencil" id="destTeamEdit" channelobject=' +
              encodeURIComponent(JSON.stringify(data[i])) +
              ' style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
              '<td style="width: 18%;"><span id="destChannelNameSpan" title="' +
              destChannelName +
              '">' +
              CFManageCloudAccountsAjaxCall.getMaxChars(destChannelName, 14) +
              '</span><i class="lnil lnil-pencil" id="destChannelEdit" channelobject=' +
              encodeURIComponent(JSON.stringify(data[i])) +
              ' style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
              "</tr>";
          }
          $("#channelsTable table tbody").append(_html);
          if (data[i].types == "public") {
            pubCount++;
          } else {
            pvtCount++;
          }
        }
        if (
          $("#channelsTab").hasClass("active") ||
          $("#privateChannelsTab").hasClass("active")
        ) {
          $("#channelCntNewCount").text($("#channelsTable tbody tr").length);
          $("#pubDiv").text("Public : ");
          $("#pvtDiv").text("Private : ");
          $("#publicCntNewCount").text(
            Number($("#publicCntNewCount").text()) + pubCount
          );
          $("#pvtDivNewCount").text(
            Number($("#pvtDivNewCount").text()) + pvtCount
          );
        }
        $('[id="createdByUsers"]').parent("td").css("display", "");
        $("#createdByThead").css("display", "");
        if ($("#selectAllChannels:checked").length) {
          $("#selCount").text($("#channelsTable tbody tr").length);
        }
        setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
        let selectedSource = localStorage.getItem("selSourceCloud") ?? "";
        let selectedDestination = localStorage.getItem("selDstnCloud") ?? "";
        if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
          $('[id="msgType_dropDown"]').parent().css("display", "none");
          $('[id="destTeamNameSpan"]').parent().css("display", "none");
          $("#dstnTeamTableHead").css("display", "none");
          $(".privateChannels").css("display", "none");
          $("#channelsCsvUpload").css("display", "none");
        } else {
          $('[id="msgType_dropDown"]').parent().css("display", "");
          $('[id="destTeamNameSpan"]').parent().css("display", "");
          $("#dstnTeamTableHead").css("display", "");
          $(".privateChannels").css("display", "none");
          $("#channelsCsvUpload").css("display", "");
        }

        if (data?.length === 50) {
          slackChannels(cloudId, fetchType, Number(pageNo) + 1);
        } else {
          $("#csvChannels").css("display", "");
        }
      }
    },
  });
}
function slackUsers() {
  $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/mapping/user/clouds/save/permissions?sourceCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=1&pageSize=30",
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#usersTable table tbody").html("");
      getSlackUsers(1);
    },
  });
}

var cloudDataKey = {};
var arrkeyval = {};
function pushFromCloudToCloud(fromCloud, ToCloud) {
  arrkeyval[fromCloud] = ToCloud;
  Object.assign(cloudDataKey, arrkeyval);
  localStorage.setItem("cloudDataKey", JSON.stringify(cloudDataKey));
}

function getSlackUsers(pgNo) {
  if (pgNo) {
    if (pgNo === 1) {
      $("#viewCountPages").css("display", "none");
      $("#paginationUsers").parent().css("display", "none");
    }
  }
  $("#displayFooterTextUsersMapping").css("visibility", "");
  $("#CFShowLoading").show();
  $("#displayFooterTextUsersMapping").css("display", "flex");
  $("#displayFooterTextChannels").css("display", "none");
  $("#displayFooterText").css("display", "none");
  let pageSize = 200;
  if (pgNo === 1) {
    cancelRequest("usersMapping");
    $("#mappingNewCount").html(0);
    $("#matchedNewCount").html(0);
    $("#unMatchedNewCount").html(0);
    pushFromCloudToCloud(
      localStorage.multiUsrSrcCldId,
      localStorage.multiUsrSrcCldId
    );
  }
  usersMappingRequest = $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/mapping/user/clouds/get/permissions?sourceCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=" +
      pgNo +
      "&pageSize=" +
      pageSize,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $(".userMappingSrcStatus").css("display", "");
      $("#usrSeach").css("display", "flex");
      $("#chnlSrch").css("display", "none");
      $("#usrMapping").css("display", "");
      $("#csvChannels").css("display", "none");
      if (data.length == 0) {
        slackUsers();
      } else {
        $("#usersTable table tbody").html("");
        if (pgNo === 1) {
          $("#paginationUsers").html("");
          getIdsForMappingPagination(
            Math.ceil(data[0]?.noOfMappedCloudPressent / pageSize)
          );
          localStorage.setItem(
            "usersMappingCount",
            data[0]?.noOfMappedCloudPressent
          );
          $("#displayUserProgressBar").css("display", "none");
          $("#displayFooterText").css("margin-top", "-0.5%");
          $("#displayFooterText").css("display", "none");
          $("#usrMapping").css("margin-top", "-3%");
          var pubCount = 0,
            pvtCount = 0;
        } else {
          pvtCount = Number($("#matchedNewCount").text());
          pubCount = Number($("#unMatchedNewCount").text());
        }

        if (Math.ceil(data[0]?.noOfMappedCloudPressent / pageSize) === 1) {
          $("#viewCountPages").css("display", "none");
          $("#paginationUsers").parent().css("display", "none");
          $("#viewCountPages span").html(
            `Showing ${pgNo} of ${Math.ceil(
              data[0]?.noOfMappedCloudPressent / pageSize
            )} Page`
          );
        } else {
          $("#viewCountPages").css("display", "");
          $("#paginationUsers").parent().css("display", "");
          $("#viewCountPages span").html(
            `Showing ${pgNo} of ${Math.ceil(
              data[0]?.noOfMappedCloudPressent / pageSize
            )} Pages`
          );
        }

        $("#usersTable p").css("display", "none");
        let imgSrc, imgDstn, srcCloudStatus;

        for (var i = 0; i < data.length; i++) {
          //	if(data[i].destCloudDetails){
          if (data[i]?.destCloudDetails?.name === "SLACK") {
            imgDstn =
              '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
          } else {
            imgDstn =
              '<img src="../img/PNG/MICROSOFT_TEAMS1.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
          }
          if (data[i]?.sourceCloudDetails?.name === "SLACK") {
            imgSrc =
              '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
          } else {
            imgSrc =
              '<img src="../img/PNG/MICROSOFT_TEAMS1.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
          }
          if (data[i]?.sourceCloudDetails?.cloudStatus) {
            if (data[i]?.sourceCloudDetails?.cloudStatus === "ACTIVE") {
              srcCloudStatus = "Active";
            } else {
              srcCloudStatus = "In-Active";
            }
          } else {
            srcCloudStatus = "-";
          }
          if (
            data[i].sourceCloudDetails != null &&
            data[i].destCloudDetails != null
          ) {
            pushFromCloudToCloud(
              data[i].sourceCloudDetails.id,
              data[i].destCloudDetails.id
            );
            pubCount++;
            var _html =
              '<tr data-attr="matchedUserPairs"><td style="padding-left: 4%;width: 40%;">' +
              imgSrc +
              '<span style="vertical-align: -webkit-baseline-middle;">' +
              data[i].sourceCloudDetails.emailId +
              "</span></td>" +
              "<td>" +
              srcCloudStatus +
              '</td><td style="">' +
              imgDstn +
              data[i].destCloudDetails.emailId +
              "</span></td></tr>";
          } else if (
            data[i].sourceCloudDetails == null &&
            data[i].destCloudDetails != null
          ) {
            pvtCount++;
            var _html =
              '<tr><td style="padding-left: 4%;width: 40%;"><span>-</span></td><td>' +
              srcCloudStatus +
              '</td><td style="">' +
              imgDstn +
              '<span style="vertical-align: -webkit-baseline-middle;">' +
              data[i].destCloudDetails.emailId +
              "</span></td></tr>";
          } else if (
            data[i].sourceCloudDetails != null &&
            data[i].destCloudDetails == null
          ) {
            pvtCount++;
            var _html =
              '<tr><td style="padding-left: 4%;width: 40%;">' +
              imgSrc +
              '<span style="vertical-align: -webkit-baseline-middle;">' +
              data[i].sourceCloudDetails.emailId +
              "</span></td><td>" +
              srcCloudStatus +
              "</td><td><span>-</span></td></tr>";
          }
          $("#usersTable table tbody").append(_html);
        }
        $("#mappingNewCount").text(data[0].noOfMappedCloudPressent);
        $("#pubDiv").text("Matched : ");
        $("#pvtDiv").text("Unmatched : ");
        $("#unMatchedNewCount").text(data[0].notMatched);
        $("#selDiv").css("display", "none");
        $("#selCount").text("00");
        $("#matchedNewCount").text(data[0].matched);
      }
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
      $("#usrMapping").css("margin-top", "-2.5%");
      $("#mapCount").html($("#usersTable table tbody tr").length);
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

function getIdsForMappingPagination(size) {
  if (size) {
    for (let i = 1; i <= size; i++) {
      $("#paginationUsers").append(`
          <option value="${i}">${i}</option>
        `);
    }
  }
}

$("#paginationUsers").on("change", function () {
  let pageNo = $(this).val();
  getSlackUsers(Number(pageNo));
});

$(document).on("change", "#selectAllChannels", function () {
  if ($("#selectAllChannels").is(":checked")) {
    $("input[name=channelSelect]:visible").prop("checked", true);
    $("#selDivNewChannelsCount").css("display", "");
    $("#newChannelsSelCount").text(
      $("input[name=channelSelect]:visible").length
    );
    $("#forNextMove").removeClass("disabled");
  } else {
    $("input[name=channelSelect]").prop("checked", false);
    $("#selDivNewChannelsCount").css("display", "none");
    $("#newChannelsSelCount").text("00");
    //$("#forNextMove").addClass('disabled');
  }
});

$(document).on("change", "input[name=channelSelect]", function () {
  if (
    localStorage.selSourceCloud === "MICROSOFT_TEAMS" &&
    localStorage.selDstnCloud === "MICROSOFT_TEAMS"
  ) {
    let teamId = $(this).attr("forteamid");
    if (
      $('[forteamid="' + teamId + '"]:visible').length ===
      $('[forteamid="' + teamId + '"]:visible:checked').length
    ) {
      $('[allteamid="' + teamId + '"]').prop("checked", true);
    } else {
      $('[allteamid="' + teamId + '"]').prop("checked", false);
    }
  }

  if (
    $("input[name=channelSelect]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllChannels").prop("checked", true);
  }
  $("#selDivNewChannelsCount").css("display", "");
  $("#newChannelsSelCount").text(
    $("input[name=channelSelect]:visible:checked").length
  );
  if ($("input[name=channelSelect]:checked").length > 0) {
    $("#forNextMove").removeClass("disabled");
  }
  /*else{
                    $("#forNextMove").addClass('disabled');
                }*/
});
$(document).on("change", "#selectAllUsers", function () {
  if ($("#selectAllUsers:checked").length) {
    $("input[name=userSelect]").prop("checked", true);
    $("#selDiv").css("display", "");
    $("#selCount").text($("#usersTable table tbody tr").length);
  } else {
    $("input[name=userSelect]").prop("checked", false);
    $("#selDiv").css("display", "none");
    $("#selCount").text("00");
  }
});

$(document).on("change", "input[name=userSelect]", function () {
  if (
    $("input[name=userSelect]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllUsers").prop("checked", true);
  }
  $("#selDiv").css("display", "");
  $("#selCount").text($("input[name=userSelect]:checked").length);
});

$("#channelsTable tbody").on("scroll", function () {
  if (
    $(this).innerHeight() + $(this).scrollTop() + 10 >=
    $(this)[0].scrollHeight
  ) {
    if (localStorage.getItem("slackNextToken") == "null") {
      $("#csvChannels").css("display", "");
      return false;
    }
    //	            slackChannels(undefined,localStorage.getItem('slackNextToken'));
  }
  $("#CFShowLoading").modal("hide");
  return false;
});

$("#authenticateUsersTabSlack").click(function () {
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $("#channelsTable").css("display", "none");
  $("#usersTable").css("display", "none");
  $("#syncChannels").css("display", "none");
  $("#clearChannelsCsvBtn").css("display", "none");
  $("#chnlSrch").css("display", "none");
  $("#usrSeach").css("display", "none");
  $("#slackUserDiv").css("display", "");
  $("#displayFooterTextChannels").css("display", "none");
  $("#displayFooterTextUsersMapping").css("display", "none");
  $("#usrMapping").css("display", "none");
  $(".fa-check-circle.dropSentEmailAuthenticated").css("display", "none");
  $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
  $(".fa-check-circle.dropAuthenticated").css("display", "none");
  $(".fa-check-circle.allAuthenticated").css("display", "");
  getSlacktoSlackUsers(1, localStorage.multiUsrDstnCldId, "source");
});

$("#authenticateUsersSrcTabSlack").click(function () {
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $("#channelsTable").css("display", "none");
  $("#usersTable").css("display", "none");
  $("#syncChannels").css("display", "none");
  $("#clearChannelsCsvBtn").css("display", "none");
  $("#chnlSrch").css("display", "none");
  $("#usrSeach").css("display", "none");
  $("#slackUserDiv").css("display", "");
  $("#displayFooterTextChannels").css("display", "none");
  $("#displayFooterTextUsersMapping").css("display", "none");
  $("#usrMapping").css("display", "none");
  $(".fa-check-circle.dropSentEmailAuthenticated").css("display", "none");
  $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
  $(".fa-check-circle.dropAuthenticated").css("display", "none");
  $(".fa-check-circle.allAuthenticated").css("display", "");
  getSlacktoSlackUsers(1, localStorage.multiUsrSrcCldId, "source");
});

$("#channelsTab").click(function () {
  $("#migrateAsTableHead").css("display", "");
  $(".filterTable").css("display", "none");
  $(".filterUserTable").css("display", "none");
  $("#channelSearch").removeClass("fa-times");
  $("#slackUserDiv").css("display", "none");
  $("#usrSeach").css("display", "none");
  $("#chnlSrch").css("display", "");
  $("#selDiv").css("display", "none");
  $("#syncChannels").css("display", "");
  $("#usrMapping").css("display", "none");
  $("#privateUsers").css("display", "none");
  $("#channelsTable").css("display", "");
  $("#usersTable").css("display", "none");
  $("#automapBtn").css("display", "none");
  $("#migrateBtn").css("display", "");
  $(".searchTextBox").attr("placeholder", "Enter Channel Name");
  $("#channelCnt").text("Channels : ");
  $("#pubDiv").text("Public : ");
  $("#pvtDiv").text("Private : ");
  $("#displayUserProgressBar").css("display", "none");
  $("#displayFooterText").css("display", "flex");
  $("#displayFooterText").css("margin-top", "1.5%");
  pageNumb = 1;
  localStorage.setItem("isPrivateChannelMigration", false);
  localStorage.setItem("userTableStatus", "NO");
  $("#startPrivateChannels").css({ "pointer-events": "auto", opacity: "1" });
  //if(localStorage.isChannelsTabClicked === undefined){
  localStorage.removeItem("ChannelsFetchedList");
  if (
    $("#usersTab").hasClass("active") ||
    $("#authenticateUsersTabSlack").hasClass("active") ||
    $("#authenticateUsersSrcTabSlack").hasClass("active") ||
    $("#privateChannelsTab").hasClass("active")
  ) {
    $("#publicCntNewCount").text(0);
    $("#pvtDivNewCount").text(0);
    $(".fa-check-circle.public").css("display", "none");
    $(".fa-check-circle.private").css("display", "none");
    $(".fa-check-circle.all").css("display", "");
    if (
      localStorage.selSourceCloud === "MICROSOFT_TEAMS" &&
      localStorage.selDstnCloud === "MICROSOFT_TEAMS"
    ) {
      $("#channelsTable").css("display", "none");
      $("#teamsTable").css("display", "");
      $("#displayFooterTextChannels").find("#channelCntNew").html("Teams :");
      $("#onlyForChannels").css("display", "none");
      $("#syncChannels").css("display", "none");
      $(".filterTable").attr("placeholder", "Enter Team Name");
      getTeams(localStorage.multiUsrSrcCldId);
    } else {
      $("#onlyForChannels").css("display", "");
      $(".filterTable").attr("placeholder", "Enter Channel Name");
      $("#syncChannels").css("display", "");
      // getprovisionedUsersForChannels(1);
      $("#displayFooterTextChannels").find("#channelsTable").css("display", "");
      $("#teamsTable").css("display", "none");
      // $("#channelCntNew").html("Channesl :");
      if (
        localStorage.selDstnCloud === "SLACK" &&
        localStorage.selSourceCloud === "SLACK"
      ) {
        $("#migrateAsTableHead").css("display", "none");
      } else {
        $("#migrateAsTableHead").css("display", "");
      }
      slackChannels(localStorage.multiUsrSrcCldId);
    }
  }
  //}else{
  //fetchCacheChannels(JSON.parse(localStorage.ChannelsFetchedList))
  //}
  $("#displayFooterTextChannels").css("display", "flex");
  $("#displayFooterTextUsersMapping").css("display", "none");
  $("#displayFooterText").css("display", "none");
  // localStorage.setItem("isChannelsTabClicked", true);
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $(".privateChannels").css("display", "none");
  // $("#onlyForChannels").css("display", "");
  $(".privateChannels").parent().css("margin-bottom", "1%");
  $("#selectAllChannels").prop("checked", false);
});
$("#automapBtn").click(function () {
  slackUsers();
});
$("#usersTab").click(function () {
  $(".filterTable").css("display", "none");
  $(".filterUserTable").css("display", "");
  $("#channelSearch").removeClass("fa-times");
  $("#slackUserDiv").css("display", "none");
  $("#usrSeach").css("display", "");
  $("#chnlSrch").css("display", "none");
  $("#selDiv").css("display", "none");
  $("#syncChannels").css("display", "none");
  $("#onlyForChannels").css("display", "none");
  $("#privateUsers").css("display", "none");
  $(".privateChannels").css("display", "none");
  $(".privateChannels").parent().css("margin-bottom", "4%");
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $("#teamsTable").css("display", "none");
  $("#usersTable").css("display", "");
  $("#channelsTable").css("display", "none");
  $("#automapBtn").css("display", "");
  $("#migrateBtn").css("display", "none");
  localStorage.setItem("userTableStatus", "YES");
  resetFilters("USERS_MAPPING");
  $(".searchTextBox").attr("placeholder", "Enter User Name");
  $(".filterUserTable").attr("placeholder", "Enter User Email");
  $(".filterUserTable").css("display", "");
  $(".filterUserTable").val("");
  $("#channelCnt").text("Mappings : ");
  $("#usersTable table tbody").html("");
  getSlackUsers(1);
  $("#displayFooterTextChannels").css("display", "none");
  $("#displayFooterText").css("display", "none");
  $("#displayFooterTextUsersMapping").css("display", "flex");
  let selectedSource = localStorage.getItem("selSourceCloud") ?? "";
  let selectedDestination = localStorage.getItem("selDstnCloud") ?? "";
  if (selectedSource === "SLACK" && selectedDestination === "SLACK") {
    $('[id="destTeamNameSpan"]').parent().css("display", "none");
    $("#dstnTeamTableHead").css("display", "none");
    $("#migrateAsTableHead").css("display", "none");
    $(".privateChannels").css("display", "none");
    $("#channelsCsvUpload").css("display", "none");
    $('[id="destTeamNameSpan"]').parent().css("display", "");
    $("#dstnTeamTableHead").css("display", "");
    $("#migrateAsTableHead").css("display", "");
    $(".privateChannels").css("display", "none");
    $("#channelsCsvUpload").css("display", "");
  }

  $("#selectAllUsers").prop("checked", false);
  $("#pubDiv").text("Matched : ");
  $("#pvtDiv").text("Unmatched : ");
  //$("#forNextMove").addClass('disabled');
});
$("#searchUsersIcon").click(function () {
  if ($(this).hasClass("fa-times")) {
    $(this).addClass("fa-search").removeClass("fa-times");
    $(".searchTextBox").css("display", "none");
    $(".filterUserTable").css("display", "none");
    $(".filterUserTable").val("");
  } else {
    $(this).addClass("fa-times").removeClass("fa-search");
    $(".searchTextBox").css("display", "");
    $(".filterUserTable").css("display", "");
  }
});

$("#channelSearch").click(function () {
  $(".filterTable").val("");
  if ($(this).hasClass("fa-times")) {
    $("#channelsTable table tbody tr").css("display", "");
  }
  $(this).toggleClass("fa-times").css("margin-left", "5px");
  $(".filterTable").toggle();

  //$("#chnlSrch").css("margin-left","74%");
  //$("#channelSearch").css("margin-left","12%");
});

function migrateMsg() {
  var deltaCount = 0;
  $.each($('[id="JobType_dropDown"]').find("option:selected"), function () {
    if ($(this).text() === "Delta") {
      deltaCount++;
    }
  });
  console.log(deltaCount);
  if (deltaCount > 0) {
    localStorage.setItem("isDelta", true);
  } else {
    localStorage.setItem("isDelta", false);
  }

  var getToCloud = JSON.parse(localStorage.cloudDataKey);
  checkSelection = [];
  localStorage.removeItem("csvName");
  if (
    $("#channelsTab").hasClass("active") ||
    $("#privateChannelsTab").hasClass("active")
  ) {
    var _len = $("input[name=channelSelect]:checked").length;
    if (_len != 0) {
      $.each($("input[name=channelSelect]:checked"), function () {
        if ($(this).parent().parent().attr("style") != "display: none;") {
          if (
            localStorage.selSourceCloud === "MICROSOFT_TEAMS" &&
            localStorage.selDstnCloud === "MICROSOFT_TEAMS"
          ) {
            var obj = {
              fromCloudId: {
                id: localStorage.multiUsrSrcCldId,
              },
              toCloudId: {
                id: localStorage.multiUsrDstnCldId,
              },
              srcChannelId: $(this).attr("srcchannelid"),
              fromRootId: $(this).attr("teamid"),
              toRootId: "/",
              channelName: $(this).attr("channelname"),
              channelType: $(this).attr("channeltype"),
              specialCharacter: "-",
              workSpaceName: $(this).attr("workSpaceName"),
              destChannelName: $(this).attr("dstnchannelname"),
              destTeamName: $(this).attr("teamname"),
              migrateAsSubChannel: false,
            };
          } else if ($(this).attr("channeltype") === "private") {
            if (
              localStorage.selSourceCloud === "SLACK" &&
              localStorage.selDstnCloud === "SLACK"
            ) {
              var obj = {
                fromCloudId: {
                  id: $(this).attr("aid"),
                },
                toCloudId: {
                  id: localStorage.multiUsrDstnCldId,
                },
                sourceDelegateCloudId: $(this).attr("cid"),
                fromRootId: $(this).attr("id"),
                toRootId: "/",
                channelDate: $(this).attr("channeldate"),
                channelName: $(this).attr("channelname"),
                channelType: $(this).attr("channeltype"),
                specialCharacter: "-",
                workSpaceName: $(this).attr("workspacename"),
                destChannelName: $(this).attr("destchannelname"),
                destTeamName:
                  $(this).attr("destteamname") === "null"
                    ? null
                    : $(this).attr("destteamname"),
                migrateAsSubChannel: JSON.parse($(this).attr("subchannel")),
              };
            } else {
              var obj = {
                fromCloudId: {
                  id: $(this).attr("cid"),
                },
                toCloudId: {
                  id: localStorage.multiUsrDstnCldId,
                },
                fromRootId: $(this).attr("id"),
                toRootId: "/",
                channelDate: $(this).attr("channeldate"),
                channelName: $(this).attr("channelname"),
                channelType: $(this).attr("channeltype"),
                specialCharacter: "-",
                workSpaceName: $(this).attr("workspacename"),
                destChannelName: $(this).attr("destchannelname"),
                destTeamName:
                  $(this).attr("destteamname") === "null"
                    ? null
                    : $(this).attr("destteamname"),
                migrateAsSubChannel: JSON.parse($(this).attr("subchannel")),
              };
            }
          } else {
            if (
              localStorage.selSourceCloud === "SLACK" &&
              localStorage.selDstnCloud === "SLACK"
            ) {
              var obj = {
                fromCloudId: {
                  id: $(this).attr("aid"),
                },
                toCloudId: {
                  id: localStorage.multiUsrDstnCldId,
                },
                sourceDelegateCloudId: $(this).attr("cid"),
                fromRootId: $(this).attr("id"),
                toRootId: "/",
                channelDate: $(this).attr("channeldate"),
                channelName: $(this).attr("channelname"),
                channelType: $(this).attr("channeltype"),
                specialCharacter: "-",
                workSpaceName: $(this).attr("workspacename"),
                destChannelName: $(this).attr("destchannelname"),
                destTeamName:
                  $(this).attr("destteamname") === "null"
                    ? null
                    : $(this).attr("destteamname"),
                migrateAsSubChannel: JSON.parse($(this).attr("subchannel")),
              };
            } else {
              var obj = {
                fromCloudId: {
                  //"id": $(this).attr('cid')
                  id: localStorage.multiUsrSrcCldId,
                },
                toCloudId: {
                  //"id":getToCloud[$(this).attr('cid')]
                  id: localStorage.multiUsrDstnCldId,
                },
                fromRootId: $(this).attr("id"),
                toRootId: "/",
                channelDate: $(this).attr("channeldate"),
                channelName: $(this).attr("channelname"),
                channelType: $(this).attr("channeltype"),
                //		"workSpaceName":localStorage.slackWorkSpaceName,
                specialCharacter: "-",
                workSpaceName: $(this).attr("workspacename"),
                destChannelName: $(this).attr("destchannelname"),
                destTeamName:
                  $(this).attr("destteamname") === "null"
                    ? null
                    : $(this).attr("destteamname"),
                migrateAsSubChannel: JSON.parse($(this).attr("subchannel")),
              };
            }
          }
          checkSelection.push(obj);
        }
      });
    }
    //var _url = apicallurl + "/messagemove/create";
    var _url =
      apicallurl +
      "/messagemove/create/messagemove/custom?willHaveDelta=" +
      localStorage.isDelta +
      "&deltaMigration=false"; //+localStorage.isDelta;
  } else {
    var _len = $("input[name=messageSelect]:checked").length;
    if (_len != 0) {
      $.each($("input[name=messageSelect]:checked"), function () {
        var str = $(this).attr("userid"),
          emailPairs = [];
        str = str.split(",");
        for (var i = 0; i < str.length; i++) {
          emailPairs.push(str[i]);
        }
        emailPairs = emailPairs.filter(Boolean);
        var obj = {
          fromCloudId: {
            id: localStorage.multiUsrSrcCldId,
          },
          toCloudId: {
            id: localStorage.multiUsrDstnCldId,
          },
          fromRootId: $(this).attr("id"),
          toRootId: "/",
          channelDate: $(this).attr("channeldate"),
          channelType: $(this).attr("channeltype"),
          emailPairs: emailPairs,
          workSpaceName: $(this).attr("workspacename"),
          channelName: $(this).attr("channelname"),
        };
        checkSelection.push(obj);
      });
    }
    var _url =
      apicallurl +
      "/messagemove/create?directOrGroupMessage=true&isDelta=false";
  }
  $.ajax({
    type: "POST",
    async: false,
    url: _url,
    data: JSON.stringify(checkSelection),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#CFShowLoading").toggle();
      alertSuccess("Migration initiated successfully");
      setTimeout(function () {
        window.location.href = "reports.html#slack";
      }, 1000);
    },
  });
}

function getSlackReports(pgNo) {
  if (pgNo === undefined || pgNo === null) pgNo = 1;
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/list/workspaces?page_size=50&page_nbr=" +
      pgNo +
      "&isAscen=false&orderField=createdTime",
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      if (pgNo === 1) {
        $("#channelsTable table tbody").html("");
        $("#directMsgsTable table tbody").html("");
      }
      $("#channelsTable p").css("display", "none");
      if (data.length == 0) {
        setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
      } else {
        var pubCount = 0,
          pvtCount = 0;
        var prStat = {
          NOT_PROCESSED: "In Queue",
          IN_PROGRESS: "In Progress",
          PROCESSED: "Processed",
          SUSPENDED: "Suspended",
          PROCESSED_WITH_SOME_CONFLICTS: "Processed With Some Conflicts",
          CONFLICT: "Conflict",
          NO_MESSAGE: "No Messages",
        };
        var Type = {
          im: "One-One",
          mpim: "Group",
          //One-One:"One-One",
          Group: "Group",
        };
        let jobType;
        for (var i = 0; i < data.length; i++) {
          let toCloudAdminId, fromCloudAdminId;
          var processStat = data[i].processStatus;
          if (
            data[i].toCloudId === null ||
            data[i].toCloudId.adminCloudId === null ||
            data[i].toCloudId.adminCloudId === undefined ||
            data[i].toCloudId.adminCloudId === "null" ||
            data[i].toCloudId.adminCloudId === "undefined"
          ) {
            toCloudAdminId = "-";
          } else {
            toCloudAdminId = data[i].toCloudId.adminCloudId;
          }
          if (
            data[i].fromCloudId === null ||
            data[i].fromCloudId.adminCloudId === null ||
            data[i].fromCloudId.adminCloudId === undefined ||
            data[i].fromCloudId.adminCloudId === "null" ||
            data[i].fromCloudId.adminCloudId === "undefined"
          ) {
            fromCloudAdminId = "-";
          } else {
            fromCloudAdminId = data[i].fromCloudId.id;
          }

          if (
            $("#channelsRepTab").hasClass("active") &&
            data[i].directOrGroupMessage == false
          ) {
            if (
              (data[i].teamClosed === false ||
                data[i].teamClosed === undefined ||
                data[i].teamClosed === null) &&
              data[i].fromCloudId !== undefined &&
              data[i].fromCloudId !== null
            ) {
              if (
                prStat[processStat] === "Processed" ||
                prStat[processStat] === "Processed With Some Conflicts"
              ) {
                var deltaBtn = "";

                var selectMultiDelta = `<input type="checkbox" id="multiSelectForDelta" dstndeligate="${data[i].destDelegateCloudId}" srcdeligate="${data[i].sourceDelegateCloudId}" srcDeltaId="${data[i].sourceDeltaId}" cid="${fromCloudAdminId}" tocid="${toCloudAdminId}"
                   fromrootid="${data[i].fromRootId}" torootid="${data[i].toRootId}" cname="${data[i].channelName}" ctype="${data[i].channelType}"
                  wname="${data[i].workSpaceName}" destchannelname="${data[i].destChannelName}" dstteamname="${data[i].destTeamName}" srcChannelId="${data[i].srcChannelId}"
                  sourceDeltaId="${data[i].sourceDeltaId}" cloudName="${data[i].fromCloudName}" tocloudname="${data[i].toCloudName}" channelid="${data[i].channelId}">`;

                //var deltaBtn = '<button id="deltaslack" style="background: #1220F6 0% 0% no-repeat padding-box;color: #fff;border: 0px;height: 25px;border-radius: 4px;font-weight: 500;">Initiate Delta</button>'
              } else {
                //var deltaBtn = ''
                var selectMultiDelta = '<input type="checkbox" disabled>';
                var deltaBtn = "";
                //var deltaBtn = '<button srcDeltaId='+data[i].sourceDeltaId+' cid='+fromCloudAdminId+' tocid='+toCloudAdminId+' fromrootid='+data[i].fromRootId+' torootid='+data[i].toRootId+' cname='+data[i].channelName+' ctype='+data[i].channelType+' wname='+data[i].workSpaceName+' destchannelname='+data[i].destChannelName+' dstteamname='+data[i].destTeamName+' style="background: #1220F6 0% 0% no-repeat padding-box;color: #fff;border: 0px;height: 25px;border-radius: 4px;font-weight: 500;opacity:0.4;pointer-events:none;">Initiate Delta</button>'
              }
            } else {
              var selectMultiDelta = '<input type="checkbox" disabled>';

              var deltaBtn = "";
            }
            if (data[i]?.deltaMigration) {
              jobType = "Delta";
            } else {
              jobType = "One-Time";
            }
            let cloudImg;
            if (data[i].fromCloudName === "SLACK") {
              cloudImg =
                '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
            } else {
              cloudImg =
                '<img src="../img/PNG/MICROSOFT_TEAMS1.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
            }
            var _html =
              '<tr fromRootId="' +
              data[i].id +
              '"  id="' +
              data[i].id +
              '" channeltype="' +
              data[i].channelType +
              '" channelname="' +
              data[i].channelName +
              '" channeldate="' +
              data[i].channelDate +
              '"><td style="width:5px;">' +
              selectMultiDelta +
              '</td><td class="chnlName"><div style="display: flex;align-items: center;gap:5px;"><span>' +
              cloudImg +
              "</span>" +
              "<span>" +
              data[i].channelName +
              "</span></div>" +
              "</td><td class='jobType'>" +
              jobType +
              "</td><td>" +
              data[i].workSpaceName +
              "</td><td class='chnlName'>" +
              data[i].channelType +
              "</td><td id=" +
              processStat +
              ">" +
              prStat[processStat] +
              '</td><td class="dltaBTN" style="display:none;">' +
              deltaBtn +
              '</td><td style="text-align:center;"><i class="lnil lnil-download" id="slackChannelReport" style="color:#0062ff;font-size: 16px;font-weight: bold;"></i></td></tr>';
            $("#channelsTable table tbody").append(_html);
          } else if (
            $("#directMsgsRepTab").hasClass("active") &&
            data[i].directOrGroupMessage == true
          ) {
            if (
              data[i].fromCloudId !== undefined &&
              data[i].fromCloudId !== null
            ) {
              if (
                prStat[processStat] === "Processed" ||
                prStat[processStat] === "Processed With Some Conflicts"
              ) {
                //var deltaBtn = ''
                var dmMultiDelta =
                  '<input type="checkbox" id="dmMultiDeltaCheckBox" channelName="' +
                  data[i].channelName +
                  '" chnalDate="' +
                  data[i].sourceDeltaId +
                  '" srcDelegateCloudId="' +
                  data[i].sourceDelegateCloudId +
                  '" teamsId="' +
                  data[i].teamsId +
                  '" dstnDelegateCloudId="' +
                  data[i].destDelegateCloudId +
                  '" dstnFolderId="' +
                  data[i].destFolderIds +
                  '" dstnWebUrl="' +
                  data[i].destWebUrls +
                  '" srcDelCldId="' +
                  data[i].sourceDelegateCloudId +
                  '" dstnDelCldId="' +
                  data[i].destDelegateCloudId +
                  '" mainWSId="' +
                  data[i].mainWSId +
                  '" emailPairs="' +
                  data[i].emailPairs +
                  '" srcDeltaId="' +
                  data[i].sourceDeltaId +
                  '"fromrootid="' +
                  data[i].fromRootId +
                  '" torootid="' +
                  data[i].toRootId +
                  '" fromcid="' +
                  data[i].fromCloudId.adminCloudId +
                  '" tocid="' +
                  data[i].toCloudId.adminCloudId +
                  '" srcDeltaId="' +
                  data[i].sourceDeltaId +
                  '" ctype="' +
                  data[i].channelType +
                  '" wname="' +
                  data[i].workSpaceName +
                  '">';
                //var deltaBtn = '<button id="dmDeltaslack" style="background: #1220F6 0% 0% no-repeat padding-box;color: #fff;border: 0px;height: 25px;border-radius: 4px;font-weight: 500;">Initiate Delta</button>'
                var deltaBtn = "";
              } else {
                //var deltaBtn = ''
                var dmMultiDelta = '<input type="checkbox" disabled>';
                var deltaBtn = "";
                //var deltaBtn = '<button id="dmDeltaslack" dstnFolderId="'+data[i].destFolderIds+'" dstnWebUrl="'+data[i].destWebUrls+'" srcDelCldId="'+data[i].sourceDelegateCloudId+'" dstnDelCldId="'+data[i].destDelegateCloudId+'" mainWSId="'+data[i].mainWSId+'" emailPairs="'+data[i].emailPairs+'" srcDeltaId="'+data[i].sourceDeltaId+'"fromrootid="'+data[i].fromRootId+'" torootid="'+data[i].toRootId+'" fromcid="'+data[i].fromCloudId.adminCloudId+'" tocid="'+data[i].toCloudId.adminCloudId+'" srcDeltaId="'+data[i].sourceDeltaId+'" ctype="'+data[i].channelType+'" wname="'+data[i].workSpaceName+'" style="background: #1220F6 0% 0% no-repeat padding-box;color: #fff;border: 0px;height: 25px;border-radius: 4px;font-weight: 500;opacity:0.4;pointer-events:none;">Initiate Delta</button>'
              }
            } else {
              var dmMultiDelta = '<input type="checkbox" disabled>';
              var deltaBtn = "";
              //<td>'+deltaBtn+'</td>
            }
            let jobType;
            if (data[i]?.deltaMigration) {
              jobType = "Delta";
            } else {
              jobType = "One-Time";
            }
            var processStat = data[i].processStatus;
            var typeStat = data[i].channelType;
            var html2 =
              '<tr fromRootId="' +
              data[i].id +
              '"  id="' +
              data[i].id +
              '" channeltype="' +
              data[i].channelType +
              '" channelname="' +
              data[i].channelName +
              '" channeldate="' +
              data[i].channelDate +
              '"><td>' +
              dmMultiDelta +
              '</td><td style="">' +
              data[i].channelName +
              "</td><td>" +
              jobType +
              "</td><td>" +
              data[i].workSpaceName +
              "</td><td>" +
              Type[typeStat] +
              "</td><td id=" +
              processStat +
              ">" +
              prStat[processStat] +
              "</td>" +
              '<td style="text-align:center;"><i class="lnil lnil-download" id="slackDMReport" style="color:#0062ff;font-size: 16px;font-weight: bold;"></i></td></tr>';
            $("#directMsgsTable table tbody").append(html2);
          }
        }
        setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
        if (data.length === 50) {
          var pageNo = pgNo + 1;
          getSlackReports(pageNo);
        }
      }
    },
  });
}

var input, filter, table, tr, td, i, txtValue;
$("#dropPubPvt a").click(function () {
  $("#dropPubPvt").css("display", "");
  if ($(this).text().toLowerCase() == "public") {
    filter = "public";
    $(".fa-check-circle.public").css("display", "");
    $(".fa-check-circle.private").css("display", "none");
    $(".fa-check-circle.all").css("display", "none");
    $("#selCount").html($("input[channeltype='public']").length);
  } else if ($(this).text().toLowerCase() == "private") {
    filter = "private";
    $(".fa-check-circle.private").css("display", "");
    $(".fa-check-circle.public").css("display", "none");
    $(".fa-check-circle.all").css("display", "none");
    $("#selCount").html($("input[channeltype='private']").length);
  } else {
    filter = "all";
    $(".fa-check-circle.public").css("display", "none");
    $(".fa-check-circle.private").css("display", "none");
    $(".fa-check-circle.all").css("display", "");
    $("#selCount").html($("#channelsTable table tbody tr").length);
  }
  tr = $("#channelsTable table tbody tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.id;
      if (filter == "all") {
        tr[i].style.display = "";
      } else if (txtValue.indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  $("#newChannelsSelCount").text(
    $("input[name=channelSelect]:visible:checked").length
  );
  if (
    $("input[name=channelSelect]:visible:checked").length ===
    $("input[name=channelSelect]:visible").length
  ) {
    $('[id="selectAllChannels"]').prop("checked", true);
  } else {
    $('[id="selectAllChannels"]').prop("checked", false);
  }
});

$("#dropAuthenticated a").click(function () {
  $("#dropPubPvt").css("display", "");
  console.log($(this).text().toLowerCase());
  if ($(this).text().toLowerCase() == "authenticated") {
    filter = "Authenticated";
    $(".fa-check-circle.dropAuthenticated").css("display", "");
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='public']").length);
  } else if ($(this).text().toLowerCase() == "not authenticated") {
    filter = "Not Authenticated";
    $(".fa-check-circle.dropNotAuthenticated").css("display", "");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='private']").length);
  } else {
    filter = "all";
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "");
    $("#selCount").html($("#srcUsrsTable table tbody tr").length);
  }
  tr = $("#srcUsrsTable table tbody tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent;
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
});

$("#dropAuthenticatedDestination a").click(function () {
  $("#dropPubPvt").css("display", "");
  console.log($(this).text().toLowerCase());
  if ($(this).text().toLowerCase() == "authenticated") {
    filter = "Authenticated";
    $(".fa-check-circle.dropAuthenticated").css("display", "");
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='public']").length);
  } else if ($(this).text().toLowerCase() == "not authenticated") {
    filter = "Not Authenticated";
    $(".fa-check-circle.dropNotAuthenticated").css("display", "");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='private']").length);
  } else {
    filter = "all";
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "");
    $("#selCount").html($("#dstnUsrsTable table tbody tr").length);
  }
  tr = $("#dstnUsrsTable table tbody tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent;
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
});

$(document).on("click", ".fa-search", function () {
  if (!$(".searchTextBox").val().length) return false;
  if ($(".searchTextBox").attr("placeholder") == "Enter Channel Name") {
    if ($(".searchTextBox").val().length) {
      var value = $(".searchTextBox").val();
      $("#channelsTable table tr").each(function (index) {
        if (index !== 0) {
          $row = $(this);

          var id = $row.find("td:eq(1)").text();

          if (id.indexOf(value) !== 0) {
            $row.hide();
          } else {
            $row.show();
          }
        }
      });
    }
  } else userSearch($(".searchTextBox").val().trim());
});
$(document)
  .find(".searchTextBox")
  .keyup(function (e) {
    if ($(this).attr("placeholder") == "Enter User Name") {
      return null;
    }
    if ($(this).attr("placeholder") == "Search By DM Name") {
      return null;
    }
    if ($(this).attr("placeholder") == "Enter Channel Name") {
      if ($(this).val().length == 0) {
        pageNumb = 1;
        slackChannels();
      }
      if (e.which == 13) {
        if ($(this).val().length) {
          var value = $(this).val();
          $("#channelsTable table tr").each(function (index) {
            if (index !== 0) {
              $row = $(this);

              var id = $row.find("td:eq(1)").text();

              if (id.indexOf(value) !== 0) {
                $row.hide();
              } else {
                $row.show();
              }
            }
          });
        } else {
          alertSuccess("Please enter value");
        }
      }
    } else {
      if ($(this).val().length == 0) {
        getSlackUsers(1);
      }
      if (e.which == 13) {
        if ($(this).val().length) {
          userSearch($(this).val());
        } else {
          alertSuccess("Please enter value");
        }
      }
    }
  });
function userSearch(SearchTerm, pageNo) {
  if (pageNo == undefined) pageNo = 1;

  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/mapping/user/autosearch/permission/list?searchMapp=" +
      SearchTerm +
      "&sourceCloudId=" +
      localStorage.getItem("multiUsrSrcCldId") +
      "&destCloudId=" +
      localStorage.getItem("multiUsrDstnCldId") +
      "&pageSize=30&pageNo=" +
      pageNo,
    async: false,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      $("#usersTable table tbody").html("");
      $("#usersTable p").css("display", "none");
      var pubCount = 0,
        pvtCount = 0;
      for (var i = 0; i < data.length; i++) {
        if (
          data[i].sourceCloudDetails != null &&
          data[i].destCloudDetails != null
        ) {
          var _html =
            '<tr><td><input type="checkbox" name="userSelect" srcid="' +
            data[i].sourceCloudDetails.id +
            '" dstid="' +
            data[i].destCloudDetails.id +
            '"></td><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].sourceCloudDetails.emailId +
            '</span></td><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].destCloudDetails.emailId +
            '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
        } else if (
          data[i].sourceCloudDetails == null &&
          data[i].destCloudDetails != null
        )
          var _html =
            '<tr><td><input type="checkbox" name="userSelect" srcid="null" dstid="' +
            data[i].destCloudDetails.id +
            '"></td><td><span>-</span></td><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].destCloudDetails.emailId +
            '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
        else if (
          data[i].sourceCloudDetails != null &&
          data[i].destCloudDetails == null
        )
          var _html =
            '<tr><td><input type="checkbox" name="userSelect" srcid="' +
            data[i].sourceCloudDetails.id +
            '" dstid="null"><td style=""><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].sourceCloudDetails.emailId +
            '</span></td><td><span>-</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
        $("#usersTable table tbody").append(_html);
      }
      $("#mapCount").text(data.noOfMappedCloudPressent);
      $("#pubCount").css("display", "none");
      $("#pvtCount").css("display", "none");
    },
  });
}

$("#teamBtn").on("click", function () {
  var parentTr = $(this).parents("tr").siblings();
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/run/premigration?cloudId=" +
      localStorage.getItem("multiUsrDstnCldId"),
    async: false,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data == "Your Request is Already under processing") {
        alertSuccess("Your request is under processing.");
        setTimeout(function () {
          $("#teamBtn").trigger("click");
        }, 1000);
      } else {
        parentTr.children("td:eq(0)").text(data.totalUsersInWorkspace);
        parentTr.children("td:eq(1)").text(data.totalChannels);
        parentTr.children("td:eq(2)").text(data.totalPublicChannel);
        parentTr.children("td:eq(3)").text(data.totalPrivateChannel);
        parentTr.children("td:eq(4)").text(data.totalTeams);
        parentTr.children("td:eq(5)").text(data.totalPublicTeams);
        parentTr.children("td:eq(6)").text(data.totalPrivateTeams);
      }
    },
  });
});

$(document).on("change", "#msgType_dropDown", function () {
  if ($(this).find("option:selected").text() === "Team") {
    $(this)
      .parents("tr")
      .children("td:first")
      .children("input")
      .attr("subchannel", "false");
  } else {
    $(this)
      .parents("tr")
      .children("td:first")
      .children("input")
      .attr("subchannel", "true");
  }
});

$(document).on("click", "#destTeamEdit", function () {
  let channelsObject = $(this).attr("channelobject");
  $(this).hide();
  var textVal = $(this).siblings("span#destTeamNameSpan").text();
  var _thisBox = $(this).siblings("span#destTeamNameSpan");
  var user_name = _thisBox.attr("title").trim();
  var pl = /\</g;
  var pl1 = /\>/g;
  var pl2 = /\"/g;
  var pl3 = /\'/g;
  var userName = user_name
    .replace(pl, "&lt;")
    .replace(pl1, "&gt;")
    .replace(pl2, "&quot;")
    .replace(pl3, "&apos;");
  _thisBox
    .css("padding", "0")
    .css("background", "none")
    .css("margin-left", "0");
  _thisBox.html(
    "<span class='editUser custom-search-input' style='float: left;width: 65%;'><input class='form-control' type='text' name='destteamname' id='teamName' value='" +
      userName +
      "' autofocus /></span>"
  );
  $("#teamName").focus();

  $("input#teamName").keydown(function (event) {
    if (event.keyCode == 13) {
      var Updatedusername = $("#teamName").val();
      if (Updatedusername.length == 0) {
        alertError("Please provide valid input");
        _thisBox.text(user_name);
        _thisBox.siblings().show();
        $("#CFShowLoading").modal("hide");
      } else {
        updateChannels("team", Updatedusername, channelsObject);
        $(this)
          .parents("tr")
          .children("td:first")
          .children("input")
          .attr("destteamname", Updatedusername);
        $(this)
          .parent()
          .parent("span#destTeamNameSpan")
          .attr("title", Updatedusername);
        Updatedusername = CFManageCloudAccountsAjaxCall.getMaxChars(
          Updatedusername,
          30
        );
        _thisBox.text(Updatedusername);
        userName = Updatedusername;
        _thisBox.siblings().show();
      }
    }
  });

  $("body").on("mouseup", function (e) {
    var container = _thisBox;
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      userName = CFManageCloudAccountsAjaxCall.getMaxChars(userName, 25);
      _thisBox.text(userName);
      _thisBox.siblings().show();
      $("body").off("mouseup");
    }
  });
});

$(document).on("click", "#destChannelEdit", function () {
  let channelsObject = $(this).attr("channelobject");
  $(this).hide();
  var textVal = $(this).siblings("span#destChannelNameSpan").text();
  var _thisBox = $(this).siblings("span#destChannelNameSpan");
  var user_name = _thisBox.attr("title").trim();
  var pl = /\</g;
  var pl1 = /\>/g;
  var pl2 = /\"/g;
  var pl3 = /\'/g;
  var userName = user_name
    .replace(pl, "&lt;")
    .replace(pl1, "&gt;")
    .replace(pl2, "&quot;")
    .replace(pl3, "&apos;");
  _thisBox
    .css("padding", "0")
    .css("background", "none")
    .css("margin-left", "0");
  _thisBox.html(
    "<span class='editUser custom-search-input' style='float: left;width: 65%;'><input class='form-control' type='text' name='destchannelname' id='channelsName' value='" +
      userName +
      "' autofocus /></span>"
  );
  $("#channelsName").focus();

  $("input#channelsName").keydown(function (event) {
    if (event.keyCode == 13) {
      var Updatedusername = $("#channelsName").val();
      if (Updatedusername.length == 0) {
        alertError("Please provide valid input");
        _thisBox.text(user_name);
        _thisBox.siblings().show();
        $("#CFShowLoading").modal("hide");
      } else {
        if (
          localStorage.selSourceCloud === "SLACK" &&
          localStorage.selDstnCloud === "SLACK" &&
          Updatedusername.length > 80
        ) {
          alertError("Maximum 80 Characters are allowed for channel name");
        } else {
          updateChannels("channel", Updatedusername, channelsObject);
          $(this)
            .parents("tr")
            .children("td:first")
            .children("input")
            .attr("destchannelname", Updatedusername);
          $(this)
            .parent()
            .parent("span#destChannelNameSpan")
            .attr("title", Updatedusername);
          Updatedusername = CFManageCloudAccountsAjaxCall.getMaxChars(
            Updatedusername,
            25
          );
          _thisBox.text(Updatedusername);
          userName = Updatedusername;
          _thisBox.siblings().show();
        }
      }
    }
  });
  $("body").on("mouseup", function (e) {
    var container = _thisBox;
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      userName = CFManageCloudAccountsAjaxCall.getMaxChars(userName, 30);
      _thisBox.text(userName);
      _thisBox.siblings().show();
      $("body").off("mouseup");
    }
  });
});

function updateChannels(type, Updatedusername, selectedObject) {
  //console.log(Updatedusername,JSON.parse(selectedObject))
  let obj = JSON.parse(decodeURIComponent(selectedObject));
  if (type === "team") {
    obj.destTeamName = Updatedusername;
  } else {
    obj.destChannelName = Updatedusername;
  }
  console.log(selectedObject);
  $.ajax({
    type: "POST",
    url: apicallurl + "/messagemove/save/slack/channel",
    data: JSON.stringify(obj),
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (res) {
      //if(res){
      if (type === "team") {
        alertSuccess("Destination TeamName Updated Successfully");
      } else {
        alertSuccess("Destination ChannelName Updated Successfully");
      }
      //}
    },
  });
}

$(document).on("click", "#slackChannelReport", function () {
  downloadChannelReport($(this).parents("tr").attr("id"));
});
$(document).on("click", "#slackDMReport", function () {
  downloadDMReport($(this).parents("tr").attr("id"));
});
function downloadDMReport(wid) {
  $.ajax({
    type: "GET",
    url: apicallurl + "/messagemove/download/messagedmreport/" + wid,
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
        link.download = "slack_workspace_dm_report_" + wid + ".csv";
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        link.click();
      } else if (xhr.status == 202) {
        alertSuccess("Report is in Progress,will be ready in few minutes");
      }
    },
  });
}
function downloadChannelReport(wid) {
  $.ajax({
    type: "GET",
    url: apicallurl + "/messagemove/download/messagechannelreport/" + wid,
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
        link.download = "slack_workspace_report_" + wid + ".csv";
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        link.click();
      } else if (xhr.status == 202) {
        alertSuccess("Report is in Progress,will be ready in few minutes");
      }
    },
  });
}
$(document).on("click", "#slackSummaryReport", function () {
  downloadSummaryReport(localStorage.UserId);
});
$(document).on("click", "#slackSummaryReportDM", function () {
  downloadSummaryReportDM(localStorage.UserId);
});
function downloadSummaryReportDM(userid) {
  //For DM's
  $.ajax({
    type: "GET",
    url: apicallurl + "/messagemove/download/messagedmsummaryreport/" + userid,
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
        link.download = "slack_DM_summary_report_" + userid + ".csv";
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        link.click();
      } else if (xhr.status == 202) {
        alertSuccess("Report is in Progress,will be ready in few minutes");
      }
    },
  });
}
function downloadSummaryReport(userid) {
  //For Channels
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/download/messagechannelsummaryreport/" +
      userid,
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
        link.download = "slack_Channels_summary_report_" + userid + ".csv";
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        link.click();
      } else if (xhr.status == 202) {
        alertSuccess("Report is in Progress,will be ready in few minutes");
      }
    },
  });
}

$("#csvUsersUpload").click(function () {
  //  sendGAEvents("clicked on CSV upload icon");
  document.getElementById("csvUserFile").value = "";
  $("#csvUserFile").click();
});

$("#dmsCsvUpload").click(function () {
  //    sendGAEvents("clicked on CSV upload icon");
  document.getElementById("dmsCsvFileInput").value = "";
  $("#dmsCsvFileInput").click();
});

$("#channelsCsvUpload").click(function () {
  //    sendGAEvents("clicked on CSV upload icon");
  document.getElementById("channelsCsvFileInput").value = "";
  $("#channelsCsvFileInput").click();
});

function csvFileUpload() {
  deleteMapping("CSV");
  $("#CFShowLoading").show();
  $("#loaderText").html("Validating User Mapping CSV");
  var upload = document.getElementById("csvUserFile").files[0];
  var reader = new FileReader();
  reader.onload = function () {
    sessionStorage.setItem("result", reader.result);
    csvUsersUpld(
      localStorage.getItem("multiUsrSrcCldId"),
      localStorage.getItem("multiUsrDstnCldId"),
      reader.result
    );
  };
  reader.readAsText(upload);
}

function dmsCsvFileUpload() {
  //deleteDmsMapping();
  var upload = document.getElementById("dmsCsvFileInput").files[0];
  var reader = new FileReader();
  reader.onload = function () {
    sessionStorage.setItem("result", reader.result);
    csvmessagesUpload(
      localStorage.getItem("multiUsrSrcCldId"),
      localStorage.getItem("multiUsrDstnCldId"),
      reader.result,
      "dm"
    );
    validateCsv(
      localStorage.getItem("multiUsrSrcCldId"),
      localStorage.getItem("multiUsrDstnCldId"),
      reader.result,
      false
    );
  };
  reader.readAsText(upload);
}
function channelsCsvFileUpload() {
  var upload = document.getElementById("channelsCsvFileInput").files[0];
  var reader = new FileReader();
  reader.onload = function () {
    sessionStorage.setItem("result", reader.result);
    csvmessagesUpload(
      localStorage.getItem("multiUsrSrcCldId"),
      localStorage.getItem("multiUsrDstnCldId"),
      reader.result,
      "channel"
    );
    validateCsv(
      localStorage.getItem("multiUsrSrcCldId"),
      localStorage.getItem("multiUsrDstnCldId"),
      reader.result,
      true
    );
  };
  reader.readAsText(upload);
}

function csvmessagesUpload(srcCloudId, dstnCloudId, inputStream, type) {
  $.ajax({
    type: "POST",
    data: inputStream,
    url:
      apicallurl +
      "/messagemove/" +
      type +
      "/path/csv?sourceCloudId=" +
      srcCloudId +
      "&destCloudId=" +
      dstnCloudId,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data, textStatus, xhr) {
      if (type === "dm") {
        $("#directMsgsTable table tbody").html("");
        fetchCacheDm(data, "CSV");
      } else {
        fetchCacheChannels(data, "CSV");
      }
    },
  });
}

function validateCsv(srcCloudId, dstnCloudId, inputStream, boolean) {
  $("#pvtDivNewCount").text(0);
  $("#publicCntNewCount").text(0);
  $.ajax({
    type: "POST",
    data: inputStream,
    url:
      apicallurl +
      "/messagemove/report/csv?sourceCloudId=" +
      srcCloudId +
      "&destCloudId=" +
      dstnCloudId +
      "&isChannel=" +
      boolean,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data, textStatus, xhr) {
      var blob = new Blob([data]);
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      if (boolean === true) {
        link.download = "CHANNELS_VALIDATED_" + srcCloudId + ".csv";
      } else {
        link.download = "DM_VALIDATED_" + srcCloudId + ".csv";
      }
      document.body.appendChild(link);
      link.setAttribute("type", "hidden");
      link.click();
    },
  });
}

$(document).on("click", "#clearDmsCsvBtn", function () {
  $("#directMsgsTable table tbody").html("");
  slackMsgs(localStorage.multiUsrSrcCldId, 1);
});

$(document).on("click", "#clearChannelsCsvBtn", function () {
  $("#channelsTable table tbody").html("");
  slackChannels(localStorage.multiUsrSrcCldId);
});

function csvUsersUpld(_srcMapdCldId, _dstnMapdCldId, _fileContent) {
  $.ajax({
    type: "POST",
    data: _fileContent,
    url:
      apicallurl +
      "/messagemove/message/user/manualmapping/csv?sourceCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destCloudId=" +
      localStorage.multiUsrDstnCldId,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data, textStatus, xhr) {
      $(".userMappingSrcStatus").css("display", "none");
      console.log(data);
      $("#usersTable table tbody").html("");
      $("#usersTable p").css("display", "none");
      var pubCount = 0,
        pvtCount = 0;
      for (var i = 0; i < data.length; i++) {
        let cldImgSrc, cldImgDstn, srcCloudStatus;
        if (data[i]?.sourceCloudDetails?.name === "SLACK") {
          cldImgSrc =
            '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
        } else {
          cldImgSrc =
            '<img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
        }
        if (data[i]?.destCloudDetails?.name === "SLACK") {
          cldImgDstn =
            '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
        } else {
          cldImgDstn =
            '<img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
        }
        if (data[i]?.sourceCloudDetails?.cloudStatus) {
          if (data[i]?.sourceCloudDetails?.cloudStatus === "ACTIVE") {
            srcCloudStatus = "Active";
          } else {
            srcCloudStatus = "In-Active";
          }
        } else {
          srcCloudStatus = "-";
        }
        if (
          data[i].sourceCloudDetails != null &&
          data[i].destCloudDetails != null
        ) {
          pubCount++;
          var _html =
            '<tr data-attr="matchedUserPairs"><td style="padding-left: 4%;">' +
            cldImgSrc +
            '<span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].sourceCloudDetails.emailId +
            '</span></td><td style="">' +
            cldImgDstn +
            data[i].destCloudDetails.emailId +
            '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="' +
            data[i].sourceCloudDetails.id +
            '" destid="' +
            data[i].destCloudDetails.id +
            '"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
        } else if (
          data[i].sourceCloudDetails == null &&
          data[i].destCloudDetails != null
        ) {
          pvtCount++;
          var _html =
            '<tr><td style="padding-left: 4%;"><span>-</span></td><td style="">' +
            cldImgDstn +
            '<span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].destCloudDetails.emailId +
            '</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="' +
            data[i].sourceCloudDetails.id +
            '" destid="' +
            data[i].destCloudDetails.id +
            '"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
        } else if (
          data[i].sourceCloudDetails != null &&
          data[i].destCloudDetails == null
        ) {
          pvtCount++;
          var _html =
            '<tr><td style="padding-left: 4%;">' +
            cldImgSrc +
            '<span style="vertical-align: -webkit-baseline-middle;">' +
            data[i].sourceCloudDetails.emailId +
            '</span></td><td><span>-</span></td><td><span style="margin-left: -50px;font-size: inherit;" class="closeBtn" srcid="' +
            data[i].sourceCloudDetails.id +
            '" destid="' +
            data[i].destCloudDetails.id +
            '"><i class="lnil lnil-cross-circle" aria-hidden="true"></i></span></td></tr>';
        }
        $("#usersTable table tbody").append(_html);
      }
      let userCnt = 0;
      if (!data[0]?.noOfMappedCloudPressent) {
        userCnt = 0;
      } else {
        userCnt = data[0]?.noOfMappedCloudPressent;
      }
      $("#mappingNewCount").text(userCnt);
      $("#pubDiv").text("Matched : ");
      $("#pvtDiv").text("Unmatched : ");
      $("#pubCount").text(pubCount);
      $("#pvtCount").text(pvtCount);
      $("#matchedNewCount").html($('[data-attr="matchedUserPairs"]').length);
      $("#unMatchedNewCount").text(
        $("#usersTable table tbody tr").length -
          $('[data-attr="matchedUserPairs"]').length
      );
      $("#selDiv").css("display", "none");
      $("#selCount").text("00");
      $("#CFShowLoading").hide();
      $("#loaderText").html("Please wait while loading...");
    },
    error: function (err) {
      $("#CFShowLoading").hide();
      $("#loaderText").html("Please wait while loading...");
    },
  });
}

$("#clearBtn").click(function () {
  deleteMapping("");
});

$(document).on("click", ".closeBtn", function () {
  var _tr = $(this).parents("tr");
  srcUserId = $(this).attr("srcid");
  destUserId = $(this).attr("destid");
  $.ajax({
    type: "GET",
    async: false,
    url:
      apicallurl +
      "/messagemove/user/clouds/deletesingle/permissionsreport?sourceCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&sourceUserCloudId=" +
      srcUserId +
      "&destUserCloudId=" +
      destUserId,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      console.log("deleted");
      $(_tr).remove("");
      $("#mappingNewCount").html($("#usersTable table tbody tr").length);
      $("#matchedNewCount").html($('[data-attr="matchedUserPairs"]').length);
    },
  });
});

function deleteMapping(from) {
  $.ajax({
    type: "GET",
    async: true,
    url:
      apicallurl +
      "/messagemove/user/clouds/delete/permissionsreport?sourceCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destCloudId=" +
      localStorage.multiUsrDstnCldId,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (from === "CSV") {
        $("#usersTable table tbody").html("");
      } else {
        getSlackUsers(1);
      }
      console.log("deleted");
    },
  });
}

$("#directMsgsTab").click(function () {
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  //$("#channelsTable").css("display", "none");
  $("[id='downloadDstnUsers']").css("display", "none");
  $("[id='downloadSourceUsers']").css("display", "none");
  $("#directMsgsRepTab").trigger("click");
  $("#directMsgsTable").css("display", "");
  //$("#usersTable").css("display", "none");
  $("#dstnUsrsTable").css("display", "none");
  $("#srcUsrsTable").css("display", "none");
  $("#automapBtn").css("display", "none");
  $("#migrateBtn").css("display", "");
  $('[class="destinationUserTable"]')
    .addClass("searchDMSHERE")
    .removeClass("destinationUserTable");
  $('[class="sourceUserTable"]')
    .addClass("searchDMSHERE")
    .removeClass("sourceUserTable");
  $('[class="searchDMSHERE"]').attr("placeholder", "Search By DM Name");
  $("#channelCnt").text("Total Items : ");
  $("#selSibling").css("margin-left", "2%");
  $("#directbtn").css("display", "none");
  $("#directSelect").css("display", "none");
  $("#directMsgsTable table tbody").html("");
  resetFilters();
  slackMsgs(localStorage.multiUsrSrcCldId, 1);
  localStorage.setItem("isDmsTabClicked", true);
  $("#selectAllMsgs").prop("checked", false);
  if ($("#directMsgsTab").hasClass("active")) {
    localStorage.setItem("trackDirectMessagesForSlack", "DM");
  } else {
    localStorage.setItem("trackDirectMessagesForSlack", "CHANNELS");
  }
  $("#selSibling").css("margin-left", "75%");
  $("#searchDmsIcons").css("display", "");
});
$("#srcUsersTab").click(function () {
  $('[name="selectAllSrcUsers"]').prop("checked", false);
  localStorage.setItem("trackDirectMessagesForSlack", "CHANNELS");
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $(this).siblings("div").removeClass("active");
  $("#srcUsrsTable").css("display", "");
  $("#directMsgsTable").css("display", "none");
  $("#dstnUsrsTable").css("display", "none");
  $("#automapBtn").css("display", "");
  $("#migrateBtn").css("display", "none");
  $(".searchTextBox")
    .addClass("sourceUserTable")
    .removeClass("searchTextBox")
    .css("display", "");
  $('[class="destinationUserTable"]')
    .addClass("sourceUserTable")
    .removeClass("destinationUserTable");
  $('[class="searchDMSHERE"]')
    .addClass("sourceUserTable")
    .removeClass("searchDMSHERE");
  $('[class="sourceUserTable"]').attr("placeholder", "Enter User Email");
  $("#channelCnt").text("Mappings : ");
  $("#selSibling").css("margin-left", "2%");
  $("#directSelect").css("display", "none");
  $("#directbtn").css("display", "");
  resetFilters();
  getTotalUsersCount();
  // getSlackSrcUsers(1);
  $("#selectAllUsers").prop("checked", false);
  $("#pubDiv").css("display", "").text("Matched : ");
  $("#pvtDiv").css("display", "").text("Unmatched : ");
  $("[id='downloadSourceUsers']").css("display", "");
  $("[id='downloadDstnUsers']")
    .css("display", "")
    .attr("id", "downloadSourceUsers");
  $("#searchDmsIcons").css("display", "none");
  $('[class="sourceUserTable"]').css("display", "");
  $('[class="sourceUserTable"]').val("");
});
$("#dstnUsersTab").click(function () {
  $('[name="selectAllDstnUsers"]').prop("checked", false);
  localStorage.setItem("trackDirectMessagesForSlack", false);
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $("#srcUsrsTable").css("display", "none");
  $("#directMsgsTable").css("display", "none");
  $("#dstnUsrsTable").css("display", "");
  $("#automapBtn").css("display", "");
  $("#migrateBtn").css("display", "none");
  $(".searchTextBox").attr("placeholder", "Enter User Name");
  $("#channelCnt").text("Mappings : ");
  $("#selSibling").css("margin-left", "2%");
  $("#directSelect").css("display", "none");
  $("#directbtn").css("display", "");
  $('[class="sourceUserTable"]')
    .addClass("destinationUserTable")
    .removeClass("sourceUserTable");
  $('[class="searchDMSHERE"]')
    .addClass("destinationUserTable")
    .removeClass("searchDMSHERE");
  $('[class="destinationUserTable"]').attr("placeholder", "Enter User Email");
  resetFilters();
  getTotalUsersCount();
  // getSlackSrcUsers(1);
  $("#selectAllUsers").prop("checked", false);
  $("#pubDiv").css("display", "").text("Matched : ");
  $("#pvtDiv").css("display", "").text("Unmatched : ");
  $("[id='downloadSourceUsers']")
    .css("display", "")
    .attr("id", "downloadDstnUsers");
  $("[id='downloadDstnUsers']").css("display", "");
  $('[class="destinationUserTable"]').css("display", "");
  $('[class="destinationUserTable"]').val("");
  $("#searchDmsIcons").css("display", "none");
});
$("#channelsRepTab").click(function () {
  $('[id="dmDeltaslack"]').css("display", "none");
  $('[id="deltaslack"]').css("display", "");
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $(this).siblings("div").removeClass("active");

  $("#channelsTable").css({
    display: "",
    width: "100%",
    height: "auto",
    overflow: "auto",
  });
  $("#directMsgsTable").css("display", "none");
  $("#slackSummaryReport").css("display", "");
  $("#slackReportsTeamsDiv").css("display", "none");
  $("#slackSummaryReportDM").css("display", "none");
  getSlackReports();
  $('[class="destinationUserTable"]').css("display", "");
  $('[class="destinationUserTable"]').val("");
});
$("#teamsSlackRepTab").click(function () {
  $('[id="dmDeltaslack"]').css("display", "none");
  $('[id="deltaslack"]').css("display", "none");
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $("#slackReportsTeamsDiv").css({
    display: "",
    width: "100%",
    height: "auto",
    overflow: "auto",
  });
  $("#directMsgsTable").css("display", "none");
  $("#slackSummaryReport").css("display", "none");
  $("#channelsTable").css("display", "none");
  $("#slackSummaryReportDM").css("display", "none");
  getCloseTeamsReports(1);
});

$("#directMsgsRepTab").click(function () {
  $('[id="dmDeltaslack"]').css("display", "");
  $('[id="deltaslack"]').css("display", "none");
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $("#channelsTable").css({ display: "none", width: "0", height: "0" });
  $("#directMsgsTable").css({
    display: "",
    width: "100%",
    height: "auto",
    overflow: "auto",
  });
  $("#directSelect").css("display", "");
  $("#slackReportsTeamsDiv").css("display", "none");
  $("#directMsgsTable table tbody").html("");
  getSlackReports();
  $("#slackSummaryReport").css("display", "none");
  $("#slackSummaryReportDM").css("display", "");
});

function getCloseTeamsReports(pgNo) {
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/createdteams?pageNo=" +
      pgNo +
      "&pageSize=50",
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      if (pgNo === 1) {
        $("#slackReportsTeamsDiv table tbody").html("");
      }
      for (let i = 0; i < data.length; i++) {
        let _data = data[i],
          closeBtn;
        if (_data.optedDeltaMigration !== false) {
          var selectMultiDelta =
            '<input type="checkbox" id="multiSelectForDelta" disabled="true">';

          // '<input type="checkbox" id="multiSelectForDelta" srcDeltaId=' +
          // data[i].sourceDeltaId +
          // " cid=" +
          // fromCloudAdminId +
          // " tocid=" +
          // toCloudAdminId +
          // " fromrootid=" +
          // data[i].fromRootId +
          // " torootid=" +
          // data[i].toRootId +
          // " cname=" +
          // data[i].channelName +
          // " ctype=" +
          // data[i].channelType +
          // " wname=" +
          // data[i].workSpaceName +
          // " destchannelname=" +
          // data[i].destChannelName +
          // " dstteamname=" +
          // data[i].destTeamName +
          // ">";
          closeBtn =
            '<button id="closeTeamsMigration" workspaceid=' +
            _data.id +
            ' style="background: #1220F6 0% 0% no-repeat padding-box;color: #fff;border: 0px;height: 25px;border-radius: 4px;font-weight: 500;">Close Migration</button>';
        } else {
          var selectMultiDelta =
            '<input type="checkbox" id="multiSelectForDelta" disabled="true">';
          closeBtn =
            '<button id="closeTeamsMigration" workspaceid=' +
            _data.id +
            ' style="background: #1220F6 0% 0% no-repeat padding-box;color: #fff;border: 0px;height: 25px;border-radius: 4px;font-weight: 500;opacity:0.4;pointer-events:none;">Close Migration</button>';
        }
        let appendHtml =
          '<tr><td title="' +
          escapeSpecialChar(_data.jobName) +
          '">' +
          CFManageCloudAccountsAjaxCall.getMaxChars(
            escapeSpecialChar(_data.jobName),
            50
          ) +
          "</td><td title=" +
          _data.listOfMessageWorkspaceId +
          " style='text-align:center;'>" +
          _data.listOfMessageWorkspaceId.length +
          "</td><td style='text-align:center;'>" +
          closeBtn +
          "</td></tr>";
        $("#slackReportsTeamsDiv table tbody").append(appendHtml);
      }
    },
  });
}

$(document).on("click", '[id="closeTeamsMigration"]', function () {
  let workSpaceId = $(this).attr("workspaceid");

  $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/messagemove/close/createdteams?messageJobId=" +
      workSpaceId,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Team Closed Successfully");
      $('[workspaceid="' + workSpaceId + '"]').css({
        opacity: "0.4",
        "pointer-events": "none",
      });
    },
  });
});

function slackMsgsCheck(cloudId, selected, pgNo) {
  if (pgNo == undefined) pgNo = 1;
  if (cloudId == undefined) cloudId = localStorage.multiUsrSrcCldId;
  if (selected == undefined) selected = "/usersalldmgroup";
  for (var i = 0; i < AllCloudsInfo.length; i++) {
    if (cloudId == AllCloudsInfo[i].id) {
      localStorage.setItem("workspaceName", AllCloudsInfo[i].metadataUrl);
      break;
    }
  }
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/verified/provisionmapping?adminCloudId=" +
      cloudId +
      "&sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=" +
      pgNo +
      "&pageSize=50",
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      _count = 0;
      if (data == "No Provision User Found" || data.length == 0) {
        slackMsgs(localStorage.multiUsrSrcCldId, "/usersalldmgroup", 1);
      } else {
        if (pgNo === 1) {
          var array = [];
        } else {
          var array = JSON.parse(localStorage.cloudListDM);
        }
        data.forEach(function (data) {
          array.push(data.cloudId);
          localStorage.setItem("cloudList", array);
          localStorage.setItem("cloudListDM", JSON.stringify(array));
          localStorage.setItem("cloudListDMGROUP", JSON.stringify(array));
          localStorage.setItem("cloudListDMONE", JSON.stringify(array));
        });
        if (
          localStorage.getItem("isDmsTabClicked") === undefined ||
          localStorage.getItem("isDmsTabClicked") === null
        ) {
          localStorage.removeItem("dmsCacheList", JSON.stringify(dmsCacheList));
          slackMsgs(localStorage.multiUsrSrcCldId, 1);
        } else {
          fetchCacheDm(JSON.parse(localStorage.dmsCacheList));
        }
        localStorage.setItem("isDmsTabClicked", true);
      }
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
      if (data.length === 50) {
        var pageNo = pgNo + 1;
        slackMsgsCheck(cloudId, selected, pageNo);
      }
    },
  });
}

function getSrcDstnUsers(pgno) {
  var pageNo = pgno ?? 1;
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/create/provisionmapping?sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=1&pageSize=20",
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (data.length == 0) {
        if (pageNo <= 3) {
          getSrcDstnUsers(pageNo + 1);
          alertError("No user found...");
        }
      } else {
        getSlackSrcUsers(1);
      }
    },
  });
}

function getSlackSrcUsers(pgNo) {
  if ($("#srcUsersTab").hasClass("active")) {
    var adminId = localStorage.multiUsrSrcCldId;
  } else {
    var adminId = localStorage.multiUsrDstnCldId;
  }

  let pageSize = 200;

  $("#dmContent").css("display", "none");
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/provisionmapping?adminCloudId=" +
      adminId +
      "&sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=" +
      pgNo +
      "&pageSize=" +
      pageSize,
    async: false,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#footerValues").css("display", "inline-flex");
      $("#footerValues").find("#channelCnt").css("display", "");
      if (data == "No Provision User Found") {
        if (Number(pgNo) === 1) {
          getSrcDstnUsers();
        }
      } else {
        if ($("#srcUsersTab").hasClass("active")) {
          $("#srcUsrsTable table tbody").html("");
          if (Number(pgNo) === 1) {
            var pubCount = 0,
              pvtCount = 0;
          } else {
            pubCount = Number($("#mappingDirectMsgs #pubCount").text());
            pvtCount = Number($("#mappingDirectMsgs #pvtCount").text());
          }
          $(".totalPagesSummaryAuth").html(`
          <span style="color: #acacac;font-size: 12px;">Showing ${pgNo} of ${Math.ceil(
            Number(localStorage.getTotalSlackUsersCount) / pageSize
          )} Page</span>
          `);
          for (var i = 0; i < data.length; i++) {
            if (data[i].provisioned == true) {
              pubCount++;
              var _html =
                '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input disabled type="checkbox" name="selectSrcUsers" id="' +
                data[i].id +
                '" adminid="' +
                data[i].adminCloudId +
                '" cloudid="' +
                data[i].cloudId +
                '" provisioned="' +
                data[i].provisioned +
                '" emailsent="' +
                data[i].emailSent +
                '" userid="' +
                data[i].userId +
                '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
                data[i].emailId +
                "</span></td><td>Authenticated</td></tr>";
            } else {
              if (data[i].emailSent == false) {
                var _html =
                  '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectSrcUsers" id="' +
                  data[i].id +
                  '" adminid="' +
                  data[i].adminCloudId +
                  '" cloudid="' +
                  data[i].cloudId +
                  '" provisioned="' +
                  data[i].provisioned +
                  '" emailsent="' +
                  data[i].emailSent +
                  '" userid="' +
                  data[i].userId +
                  '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
                  data[i].emailId +
                  "</span></td><td>Not Authenticated</td></tr>";
              } else {
                pvtCount++;
                var _html =
                  '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectSrcUsers" id="' +
                  data[i].id +
                  '" adminid="' +
                  data[i].adminCloudId +
                  '" cloudid="' +
                  data[i].cloudId +
                  '" provisioned="' +
                  data[i].provisioned +
                  '" emailsent="' +
                  data[i].emailSent +
                  '" userid="' +
                  data[i].userId +
                  '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
                  data[i].emailId +
                  '</span></td><td>Email Sent <a href="#" id="resendCode" cldname="' +
                  data[i].cloudName +
                  '">Resend Code</a></td></tr>';
              }
            }

            $("#srcUsrsTable table tbody").append(_html);
          }
        } else {
          $(".totalPagesSummaryAuth").html(`
          <span style="color: #acacac;font-size: 12px;">Showing ${pgNo} of ${Math.ceil(
            Number(localStorage.getTotalTeamsUsersCount) / pageSize
          )} Page</span>
          `);
          $("#dstnUsrsTable table tbody").html("");
          if (Number(pgNo) === 1) {
            var pubCount = 0,
              pvtCount = 0;
          } else {
            pubCount = Number($("#mappingDirectMsgs #pubCount").text());
            pvtCount = Number($("#mappingDirectMsgs #pvtCount").text());
          }
          for (var i = 0; i < data.length; i++) {
            if (data[i].provisioned == true) {
              pubCount++;
              var _html =
                '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input disabled type="checkbox" name="selectDstnUsers" id="' +
                data[i].id +
                '" adminid="' +
                data[i].adminCloudId +
                '" cloudid="' +
                data[i].cloudId +
                '" provisioned="' +
                data[i].provisioned +
                '" emailsent="' +
                data[i].emailSent +
                '" userid="' +
                data[i].userId +
                '"></td><td><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">' +
                data[i].emailId +
                "</span></td><td>Authenticated</td></tr>";
            } else {
              if (data[i].emailSent == false) {
                var _html =
                  '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectDstnUsers" id="' +
                  data[i].id +
                  '" adminid="' +
                  data[i].adminCloudId +
                  '" cloudid="' +
                  data[i].cloudId +
                  '" provisioned="' +
                  data[i].provisioned +
                  '" emailsent="' +
                  data[i].emailSent +
                  '" userid="' +
                  data[i].userId +
                  '"></td><td><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">' +
                  data[i].emailId +
                  "</span></td><td>Not Authenticated</td></tr>";
              } else {
                pvtCount++;
                var _html =
                  '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectDstnUsers" id="' +
                  data[i].id +
                  '" adminid="' +
                  data[i].adminCloudId +
                  '" cloudid="' +
                  data[i].cloudId +
                  '" provisioned="' +
                  data[i].provisioned +
                  '" emailsent="' +
                  data[i].emailSent +
                  '" userid="' +
                  data[i].userId +
                  '"></td><td><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">' +
                  data[i].emailId +
                  '</span></td><td>Email Sent <a href="#" id="resendCode" cldname="' +
                  data[i].cloudName +
                  '">Resend Code</a></td></tr>';
              }
            }

            $("#dstnUsrsTable table tbody").append(_html);
          }
        }

        $("#mappingDirectMsgs #channelCnt").text("Total Users : ");
        $("#mappingDirectMsgs #pubDiv")
          .css("display", "")
          .text("Authenticated : ");
        $("#mappingDirectMsgs #pvtDiv")
          .css("display", "")
          .text("Email Sent : ");
        // $("#mappingDirectMsgs #pubCount").css("display", "").text(pubCount);
        // $("#mappingDirectMsgs #pvtCount").css("display", "").text(pvtCount);
        // if ($("#srcUsersTab").hasClass("active")) {
        //   $("#mappingDirectMsgs #mapCount").text(
        //     $("#srcUsrsTable table tbody tr").length
        //   );
        // } else {
        //   $("#mappingDirectMsgs #mapCount").text(
        //     $("#dstnUsrsTable table tbody tr").length
        //   );
        // }
        $("#mappingDirectMsgs #selDiv").css("display", "none");
        $("#mappingDirectMsgs #selCount").text("00");
      }
      if (data.length === 30) {
        var pgno = Number(pgNo);
        pgno++;
        getSlackSrcUsers(pgno);
      }
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}

var dmOnetoOneCacheList = [];
var dmGroupCacheList = [];
var dmAllCacheList = [];
function getdmlog(cloudId, selected, pgNo) {
  if (pgNo === undefined) pgNo = 1;
  var uri =
    apicallurl +
    "/messagemove/get/slackdms?adminCloudId=" +
    cloudId +
    "&pageNo=" +
    pgNo +
    "&pageSize=50";
  var _workspaceName = localStorage.getItem("workspaceName");
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
      if (data.length > 0) {
        $("#dmContent").css("display", "");
        $("#directMsgsTable p").css("display", "none");
        for (var i = 0; i < data.length; i++) {
          if (selected === "/usersalldmgroup") {
            dmAllCacheList.push(data[i]);
            localStorage.setItem(
              "dmAllCacheList",
              JSON.stringify(dmAllCacheList)
            );
          } else if (selected === "/usersmpim") {
            dmGroupCacheList.push(data[i]);
            localStorage.setItem(
              "dmGroupCacheList",
              JSON.stringify(dmGroupCacheList)
            );
          } else if (selected === "/usersim") {
            dmOnetoOneCacheList.push(data[i]);
            localStorage.setItem(
              "dmOnetoOneCacheList",
              JSON.stringify(dmOnetoOneCacheList)
            );
          }
          var _html =
            '<tr fromRootId="' +
            data[i].id +
            '"><td><input type="checkbox" name="messageSelect" id="' +
            data[i].fromRootId +
            '" channelname="' +
            data[i].channelName +
            '" workspacename="' +
            _workspaceName +
            '" userid="' +
            data[i].emailPairs +
            '" channeltype="' +
            data[i].channelType +
            '" onjectname="' +
            data[i].channelName +
            '" channeldate="' +
            data[i].channelDate +
            '"></td><td style="">' +
            data[i].channelName +
            "</td><td>" +
            data[i].channelName +
            "</td></tr>";
          $("#directMsgsTable table tbody").append(_html);
        }
        $("#mapCount").css("display", "").text(data.length);
        setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
        $("#totalDMsgs").html($("#directMsgsTable table tbody tr").length);
        tr = $("#directMsgsTable table tbody tr");
        var dmCount = 0;
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[2];
          var txt = td.textContent || td.innerText;
          if (txt.indexOf("mpdm") > -1) {
            dmCount++;
          }
          //console.log(txt)
        }
        //console.log(dmCount)
        if (data.length === 50) {
          var pgno = Number(pgNo);
          pgno++;
          getdmlog(cloudId, selected, pgno);
        } else {
          if (selected === "/usersalldmgroup") {
            var list = JSON.parse(localStorage.cloudListDM);
          } else if (selected === "/usersmpim") {
            var list = JSON.parse(localStorage.cloudListDMGROUP);
          } else if (selected === "/usersim") {
            var list = JSON.parse(localStorage.cloudListDMONE);
          }
          list.splice(0, 1);
          var modList = list;
          console.log(list);
          if (selected === "/usersalldmgroup") {
            list = localStorage.setItem("cloudListDM", JSON.stringify(modList));
          } else if (selected === "/usersmpim") {
            list = localStorage.setItem(
              "cloudListDMGROUP",
              JSON.stringify(modList)
            );
          } else if (selected === "/usersim") {
            list = localStorage.setItem(
              "cloudListDMONE",
              JSON.stringify(modList)
            );
          }
          if (selected === "/usersalldmgroup") {
            list = JSON.parse(localStorage.cloudListDM);
          } else if (selected === "/usersmpim") {
            list = JSON.parse(localStorage.cloudListDMGROUP);
          } else if (selected === "/usersim") {
            list = JSON.parse(localStorage.cloudListDMONE);
          }
          if (list.length !== 0) {
            $("#fetchedDmUsersCount").html(
              Number($("#fetchedDmUsersCount").text()) + 1
            );
            getdmlog(list[0], selected);
          } else {
            $("#fetchedDmUsersCount").html(
              Number($("#fetchedDmUsersCount").text()) + 1
            );
            alertSuccess("Direct Messages Fetched Successfully");
          }
        }
        $("#countGropuDM").html(dmCount);
        $("#countOneDM").html(Number(tr.length) - Number(dmCount));
        $("#mappingDirectMsgs #channelCnt").css("display", "none");
        $("#mappingDirectMsgs #pubDiv").css("display", "none");
        $("#mappingDirectMsgs #pvtDiv").css("display", "none");
        $("#mappingDirectMsgs #pubCount").css("display", "none");
        $("#mappingDirectMsgs #pvtCount").css("display", "none");
        $("#mappingDirectMsgs #footerValues").css("display", "none");
      }
    },
  });
}

function fetchCacheDm(data, from) {
  if (from === "CSV" && data.length === 0) {
    alertError("Please upload valid csv");
    return false;
  }
  $("#dmContent").css("display", "");
  console.log("Getting DMs From Cache");
  var _workspaceName = localStorage.getItem("workspaceName");
  $("#directMsgsTable table tbody").html("");
  for (var i = 0; i < data.length; i++) {
    var emailPair = data[i].emailPairs;
    var dmType;
    var imType;
    if (from === "CSV") {
      emailPair = emailPair;
      dmType = imType = data[i].channelType;
    } else {
      dmType = imType = data[i].types;
      emailPair = emailPair.split(",");
    }
    if (imType === "im") {
      var inputField =
        '<input type="checkbox" name="messageSelect" id="' +
        data[i].fromRootId +
        '" channelname="' +
        data[i].channelName +
        '" workspacename="' +
        _workspaceName +
        '" userid="' +
        data[i].emailPairs +
        '" channeltype="im" onjectname="' +
        data[i].channelName +
        '" channeldate="' +
        data[i].channelDate +
        '">';
    } else {
      var inputField =
        '<input type="checkbox" name="messageSelect" id="' +
        data[i].fromRootId +
        '" channelname="' +
        data[i].channelName +
        '" workspacename="' +
        _workspaceName +
        '" userid="' +
        data[i].emailPairs +
        '" channeltype="mpim" onjectname="' +
        data[i].channelName +
        '" channeldate="' +
        data[i].channelDate +
        '">';
    }
    var sno = i + 1;
    var _html =
      '<tr fromRootId="' +
      data[i].id +
      '" id="' +
      imType +
      '"><td style="width: 10px;text-align:center;">' +
      sno +
      '</td><td style="width: 61px;text-align:center;">' +
      inputField +
      '</td><td id="' +
      data[i].dmType +
      '">' +
      data[i].channelName +
      "</td></tr>";
    $("#directMsgsTable table tbody").append(_html);
  }
  $("#mapCount").css("display", "").text(data.length);
  setTimeout(function () {
    $("#CFShowLoading").hide();
  }, 1000);
  $("#totalDMsgs").html($("#directMsgsTable table tbody tr").length);
  tr = $("#directMsgsTable table tbody tr");
  var dmCount = 0;
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    var txt = td.textContent || td.innerText;
    if (txt.indexOf("mpdm") > -1) {
      dmCount++;
    }
    //console.log(txt)
  }
  $("#countGropuDM").html(dmCount);
  $("#countOneDM").html(Number(tr.length) - Number(dmCount));
  $("#mappingDirectMsgs #channelCnt").css("display", "none");
  $("#mappingDirectMsgs #pubDiv").css("display", "none");
  $("#mappingDirectMsgs #pvtDiv").css("display", "none");
  $("#mappingDirectMsgs #pubCount").css("display", "none");
  $("#mappingDirectMsgs #pvtCount").css("display", "none");
  $("#mappingDirectMsgs #footerValues").css("display", "none");
}

var dmsCacheList = [];
function slackMsgs(cloudId, pgNo) {
  if (cloudId == undefined) cloudId = localStorage.multiUsrSrcCldId;
  //if (selected == undefined) selected = "/usersalldmgroup";
  //if(nextId === undefined){
  //var uri = apicallurl +"/filefolder/userId/" +localStorage.UserId +"/cloudId/" +cloudId +"?folderId=" +selected+"&page_nbr="+pgNo+"&page_size=50"
  var uri =
    apicallurl +
    "/messagemove/get/slackdms?adminCloudId=" +
    cloudId +
    "&pageNo=" +
    pgNo +
    "&pageSize=50";
  //}else{
  //uri = apicallurl +"/filefolder/userId/" +localStorage.UserId +"/cloudId/" +cloudId +"?folderId=" +selected +"&nextPreviousId="+nextId+"&page_nbr="+pgNo+"&page_size=20"
  //}
  var _workspaceName = localStorage.getItem("workspaceName");
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
      if (data === "No Provision User Found") {
        return false;
      }
      if (data.length > 0) {
        $("#dmContent").css("display", "");
        if (Number(pgNo) === 1) {
          dmsCacheList = [];
          localStorage.removeItem("dmsCacheList");
        }
        if (cloudId == localStorage.multiUsrSrcCldId) {
          if (Number(pgNo) === 1) {
            //$("#directMsgsTable table tbody").html("");
          }
        }
        $("#directMsgsTable p").css("display", "none");
        for (var i = 0; i < data.length; i++) {
          if (Number(pgNo) === 1) {
            var sno = i + 1;
          } else {
            var sno = Number($("#directMsgsTable table tbody tr").length) + 1;
          }
          var emailPair = data[i].emailPairs;
          if (
            emailPair === "null" ||
            emailPair === "undefined" ||
            emailPair === null ||
            emailPair === undefined
          ) {
            continue;
          } else {
            dmsCacheList.push(data[i]);
            localStorage.setItem("dmsCacheList", JSON.stringify(dmsCacheList));
            emailPair = emailPair.split(",");
          }
          if (data[i].types === "im" && emailPair[0] === emailPair[1]) {
            var inputField =
              '<input type="checkbox" name="messageSelect" id="' +
              data[i].fromRootId +
              '" channelname="' +
              data[i].channelName +
              '" workspacename="' +
              _workspaceName +
              '" userid="' +
              data[i].emailPairs +
              '" channeltype="im" onjectname="' +
              data[i].channelName +
              '" channeldate="' +
              data[i].channelDate +
              '">';
          } else {
            var inputField =
              '<input type="checkbox" name="messageSelect" id="' +
              data[i].fromRootId +
              '" channelname="' +
              data[i].channelName +
              '" workspacename="' +
              _workspaceName +
              '" userid="' +
              data[i].emailPairs +
              '" channeltype="' +
              data[i].types +
              '" onjectname="' +
              data[i].channelName +
              '" channeldate="' +
              data[i].channelDate +
              '">';
          }

          var _html =
            '<tr fromRootId="' +
            data[i].id +
            '" id="' +
            data[i].types +
            '"><td style="width: 10px;text-align:center;">' +
            sno +
            '</td><td style="width: 61px;text-align:center;">' +
            inputField +
            '</td><td id="' +
            data[i].dmType +
            '">' +
            data[i].channelName +
            "</td></tr>";
          /*if(emailPair === "null" ||emailPair === "undefined" || emailPair === null ||emailPair === undefined || emailPair === ""){
                continue;
                }else{*/
          $("#directMsgsTable table tbody").append(_html);
          /*}*/
        }
        $("#mapCount").css("display", "").text(data.length);
        setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
        $("#totalDMsgs").html($("#directMsgsTable table tbody tr").length);
        tr = $("#directMsgsTable table tbody tr");
        var dmCount = 0;
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[2];
          var txt = td.textContent || td.innerText;
          if (txt.indexOf("mpdm") > -1) {
            dmCount++;
          }
          //console.log(txt)
        }
        //console.log(dmCount)
        if (data.length === 50) {
          var pgno = Number(pgNo);
          pgno++;
          slackMsgs(cloudId, pgno);
        }
        $("#countGropuDM").html(dmCount);
        $("#countOneDM").html(Number(tr.length) - Number(dmCount));
        $("#mappingDirectMsgs #channelCnt").css("display", "none");
        $("#mappingDirectMsgs #pubDiv").css("display", "none");
        $("#mappingDirectMsgs #pvtDiv").css("display", "none");
        $("#mappingDirectMsgs #pubCount").css("display", "none");
        $("#mappingDirectMsgs #pvtCount").css("display", "none");
        $("#mappingDirectMsgs #footerValues").css("display", "none");
      }
    },
  });
}

_count = 0;
/*$("#directMsgsTable").on("scroll", function () {
              var list = localStorage.cloudList.split(",");
              if (list.length > 1 && list.length > _count) {
                if (list[_count] != localStorage.multiUsrSrcCldId) {
                  if ($("#directSelect :selected").text() === "One-One") {
                    var selected = "/usersim";
                  } else if ($("#directSelect :selected").text() === "Group") {
                    var selected = "/usersmpim";
                  } else {
                    var selected = "/usersalldmgroup";
                  }
                    slackMsgs(list[_count], selected,1);
                }
                _count++;
              }
            });*/
pageNumb = 1;
$("#channelsTable").on("scroll", function () {
  if (localStorage.getItem("slackNextToken") != null) {
    pageNumb++;
    //slackChannels(localStorage.multiUsrSrcCldId, pageNumb);
  } else return false;
});

$(document).on("click", "#directbtn", function () {
  if ($("#srcUsersTab").hasClass("active")) {
    if ($("input[name=selectSrcUsers]:checked").length === 0) {
      alertError("Please select at least one user to authenticate");
    } else if ($("input[name=selectSrcUsers]:checked").length === 1) {
      sendSlackEmail();
    } else {
      sendSlackBulkEmail();
    }
  } else {
    if ($("input[name=selectDstnUsers]:checked").length === 0) {
      alertError("Please select at least one user to authenticate");
    } else if ($("input[name=selectDstnUsers]:checked").length === 1) {
      sendTeamsEmail();
    } else {
      sendTeamsBulkEmail();
    }
  }
});

function sendSlackEmail(clId) {
  var cloudId = clId ?? $("input[name=selectSrcUsers]:checked").attr("cloudid");
  if (cloudId == undefined) {
    cloudId = localStorage.getItem("resendId");
  }
  $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/messagemove/send/email/slack?sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&cloudId=" +
      cloudId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Co`ntrol-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Email Sent");
      $("input[name=selectSrcUsers]:checked")
        .parent("td")
        .next()
        .next()
        .html(
          'Email Sent<a href="#" id="resendCode" cldName="SLACK"> Resend Code</a>'
        );
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}
function sendSlackBulkEmail() {
  var array = [],
    length;
  length = $("input[name=selectSrcUsers]:checked").length;
  for (var i = 0; i < length; i++) {
    array.push(
      $("input[name=selectSrcUsers]:checked:eq(" + i + ")").attr("cloudid")
    );
  }
  $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/messagemove/send/email/bulk/slack?sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId,
    data: JSON.stringify(array),
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Bulk Email Sent.");
      for (var j = 0; j < length; j++) {
        $("input[name=selectSrcUsers]:checked:eq(" + j + ")")
          .parent("td")
          .next()
          .next()
          .html(
            'Email Sent<a href="#" id="resendCode" cldName="SLACK"> Resend Code</a>'
          );
      }
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}

function sendTeamsEmail(clid) {
  var cloudId =
    clid ?? $("input[name=selectDstnUsers]:checked").attr("cloudid");
  if (cloudId == undefined) {
    cloudId = localStorage.getItem("resendId");
  }
  $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/messagemove/send/email/teams?adminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&cloudId=" +
      cloudId,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Co`ntrol-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Email Sent");
      $("input[name=selectDstnUsers]:checked")
        .parent("td")
        .next()
        .next()
        .html(
          'Email Sent<a href="#" id="resendCode" cldName="MICROSOFT_TEAMS"> Resend Code</a>'
        );

      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}
function sendTeamsBulkEmail() {
  var array = [],
    length;
  length = $("input[name=selectDstnUsers]:checked").length;
  for (var i = 0; i < length; i++) {
    array.push(
      $("input[name=selectDstnUsers]:checked:eq(" + i + ")").attr("cloudid")
    );
  }
  $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/messagemove/send/email/bulk/teams?adminCloudId=" +
      localStorage.multiUsrDstnCldId,
    data: JSON.stringify(array),
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Bulk Email Sent");
      for (var j = 0; j < length; j++) {
        $("input[name=selectDstnUsers]:checked:eq(" + j + ")")
          .parent("td")
          .next()
          .next()
          .html(
            'Email Sent<a href="#" id="resendCode" cldName="MICROSOFT_TEAMS"> Resend Code</a>'
          );
      }
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}

$(document).on("click", "#resendCode", function () {
  //  $("#directbtn").trigger("click");
  var cldId = $(this).parent().prev().prev().children("input").attr("cloudid");
  let cldName = $(this).attr("cldName");
  if (cldName === "SLACK") {
    sendSlackEmail(cldId);
  } else {
    sendTeamsEmail(cldId);
  }
  localStorage.setItem("resendId", cldId);
});

// $(document).on("change", "#selectAllChannels", function () {
//   if (filter == "public") {
//     $("#selCount").html($("input[channeltype='public']").length);
//     $("input[channeltype='public']").prop("checked", true);
//     $("input[channeltype='private']").prop("checked", false);
//   } else if (filter == "private") {
//     $("#selCount").html($("input[channeltype='private']").length);
//     $("input[channeltype='private']").prop("checked", true);
//     $("input[channeltype='public']").prop("checked", false);
//   } else {
//     $("#selCount").html($("#channelsTable table tbody tr").length);
//   }
//   if ($("#selectAllChannels:checked").length) {
//     $("input[name=channelSelect]").prop("checked", true);
//     $("#selDiv").css("display", "").css("margin-left", "0%");
//   } else {
//     $("input[name=channelSelect]").prop("checked", false);
//     $("#selDiv").css("display", "none").css("margin-left", "0%");
//     $("#selCount").text("00");
//   }
// });

$(document).on("change", "#selectAllMsgs", function () {
  if ($("#selectAllMsgs").is(":checked")) {
    $("input[name=messageSelect]").prop("checked", true);
    $("#selDiv").css("display", "").css("margin-left", "-20%");
    $("#selCount").text($("#directMsgsTable table tbody tr").length);
    $("#forNextMove").removeClass("disabled");
    $("#counttotalSelectedDM").html(
      $('[name="messageSelect"]:visible:checked').length
    );
    $("#totalSelectedDM").css("display", "");
  } else {
    $("#totalSelectedDM").css("display", "none");
    $("input[name=messageSelect]").prop("checked", false);
    $("#selDiv").css("display", "none").css("margin-left", "-20%");
    $("#selCount").text("00");
    $("#forNextMove").addClass("disabled");
  }
});

$(document).on("change", "input[name=selectAllSrcUsers]", function () {
  if ($("input[name=selectAllSrcUsers]:checked").length) {
    var leng = $("input[name=selectSrcUsers]").length;
    for (i = 0; i < leng; i++) {
      if ($("input[name=selectSrcUsers]")[i].hasAttribute("disabled")) {
        $("input[name=selectSrcUsers]")[i].checked = false;
      } else {
        $("input[name=selectSrcUsers]")[i].checked = true;
      }
    }
  } else {
    $("input[name=selectSrcUsers]").prop("checked", false);
    //$("#forNextMove").addClass('disabled');
  }
});

$(document).on("change", "input[name=selectAllDstnUsers]", function () {
  if ($("input[name=selectAllDstnUsers]:checked").length) {
    var leng = $("input[name=selectDstnUsers]").length;
    for (i = 0; i < leng; i++) {
      if ($("input[name=selectDstnUsers]")[i].hasAttribute("disabled")) {
        $("input[name=selectDstnUsers]")[i].checked = false;
      } else {
        $("input[name=selectDstnUsers]")[i].checked = true;
      }
    }
  } else {
    $("input[name=selectDstnUsers]").prop("checked", false);
    //$("#forNextMove").addClass('disabled');
  }
});

$(document).on("change", "input[name=channelSelect]", function () {
  if (
    $("input[name=channelSelect]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllChannels").prop("checked", true);
  }
  $("#selDiv").css("display", "").css("margin-left", "0%");
  //uncheck Count Filter
  if (filter == "public") {
    $("#selCount").html($("input[channeltype='public']:checked").length);
  } else if (filter == "private") {
    $("#selCount").html($("input[channeltype='private']:checked").length);
  } else {
    $("#selCount").text($("input[name=channelSelect]:checked").length);
  }
  //End uncheck Count Filter

  if ($("input[name=channelSelect]:checked").length > 0) {
    $("#forNextMove").removeClass("disabled");
  }
  /*else {
                $("#forNextMove").addClass("disabled");
              }*/
});
$(document).on("change", "input[name=messageSelect]", function () {
  if (
    $("input[name=messageSelect]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllMsgs").prop("checked", true);
  }
  $("#selDiv").css("display", "").css("margin-left", "-20%");
  $("#selCount").text($("input[name=messageSelect]:checked").length);
  if ($("input[name=messageSelect]:checked").length > 0) {
    $("#forNextMove").removeClass("disabled");
  } else {
    $("#forNextMove").addClass("disabled");
  }
});
$(document).on("change", "input[name=selectDstnUsers]", function () {
  if (
    $("input[name=selectDstnUsers]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllDstnUsers").prop("checked", true);
  }
  /*if ($("input[name=selectDstnUsers]:checked").length > 0) {
                $("#forNextMove").removeClass("disabled");
              } else {
                $("#forNextMove").addClass("disabled");
              }*/
});

$(document).on("change", "input[name=selectSrcUsers]", function () {
  if (
    $("input[name=selectSrcUsers]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllSrcUsers").prop("checked", true);
  }
  /*if ($("input[name=selectSrcUsers]:checked").length > 0) {
                $("#forNextMove").removeClass("disabled");
              } else {
                $("#forNextMove").addClass("disabled");
              }*/
});

$(document).on("change", "#selectAllUsers", function () {
  if ($("#selectAllUsers:checked").length) {
    $("input[name=userSelect]").prop("checked", true);
    $("#selDiv").css("display", "");
    $("#selCount").text($("#usersTable table tbody tr").length);
  } else {
    $("input[name=userSelect]").prop("checked", false);
    $("#selDiv").css("display", "none");
    $("#selCount").text("00");
  }
});

$(document).on("change", "input[name=userSelect]", function () {
  if (
    $("input[name=userSelect]:checked").length ==
    parseInt($("#mapCount").text())
  ) {
    $("#selectAllUsers").prop("checked", true);
  }
  $("#selDiv").css("display", "");
  $("#selCount").text($("input[name=userSelect]:checked").length);
});

$("#dropOneGroup a").click(function () {
  $("#dropOneGroup").css("display", "");
  if ($(this).text().toLowerCase() == "one-one") {
    filter = "One-One";
    $(".fa-check-circle.one").css("display", "");
    $(".fa-check-circle.group").css("display", "none");
    $(".fa-check-circle.all").css("display", "none");
    var filter = $(this).text();
    filter = filter.toUpperCase();
    var table = $("#directMsgsTable table tbody tr");
    for (i = 0; i < table.length; i++) {
      td = table[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          table[i].style.display = "";
        } else {
          table[i].style.display = "none";
        }
      }
    }
  } else if ($(this).text().toLowerCase() == "group") {
    filter = "Group";
    $(".fa-check-circle.group").css("display", "");
    $(".fa-check-circle.one").css("display", "none");
    $(".fa-check-circle.all").css("display", "none");
    var filter = $(this).text();
    filter = filter.toUpperCase();
    var table = $("#directMsgsTable table tbody tr");
    for (i = 0; i < table.length; i++) {
      td = table[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          table[i].style.display = "";
        } else {
          table[i].style.display = "none";
        }
      }
    }
  } else {
    filter = "all";
    $(".fa-check-circle.one").css("display", "none");
    $(".fa-check-circle.group").css("display", "none");
    $(".fa-check-circle.all").css("display", "");
    var filter = $(this).text();
    filter = filter.toUpperCase();
    var table = $("#directMsgsTable table tbody tr");
    for (i = 0; i < table.length; i++) {
      td = table[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) === -1) {
          table[i].style.display = "";
        } else {
          table[i].style.display = "none";
        }
      }
    }
  }
});

$(document).on("click", "#csvDMS", function () {
  getDMSCSV();
});

$(document).on("click", "#csvChannels", function () {
  getChannelsCSV();
});

$(document).on("click", '[id="downloadSourceUsers"]', function () {
  getSourceUsersCsv("src");
});

$(document).on("click", '[id="downloadDstnUsers"]', function () {
  getSourceUsersCsv("dstn");
});

function getSourceUsersCsv(from) {
  console.log("CSVDOWNLOAD");
  var csv_data = [];
  if (from === "src") {
    var headForCsv = ["Source Users", "Authenticated Status"];
  } else {
    var headForCsv = ["Destination Users", "Authenticated Status"];
  }
  var csvrow = [];
  for (var m = 0; m < headForCsv.length; m++) {
    csvrow.push(headForCsv[m]);
  }
  csv_data.push(csvrow.join(","));
  if (from === "src") {
    var tablediv = document.getElementById("srcUsrsDivTable");
    var tablebody = $("#srcUsrsTable table tbody");
    var rows = $("#srcUsrsTable table tbody tr");
    var fileName = "Sources_Users";
  } else {
    var tablediv = document.getElementById("srcUsrsDivTable");
    var tablebody = $("#dstnUsrsTable table tbody");
    var rows = $("#dstnUsrsTable table tbody tr");
    var fileName = "Destination_Users";
  }
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].querySelectorAll("td,th");
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      if (j === 0) {
        continue;
      }
      if (j === 1) {
        csvrow.push(cols[j].innerText);
      }
      if (j === 2) {
        csvrow.push(cols[j].innerText);
      }
    }
    csv_data.push(csvrow.join(","));
  }
  //var csv_footer = []
  var csvrow = [];
  csv_data.push(csvrow.join(","));
  var csvrow = [];
  var arrFooter = [
    "Total Users-" + $("#mapCount").text(),
    "Authenticated -" + $("#footerValues").find("#pubCount").text(),
  ];
  for (var m = 0; m < arrFooter.length; m++) {
    csvrow.push(arrFooter[m]);
  }
  csv_data.push(csvrow.join(","));
  console.log(arrFooter);
  csv_data = csv_data.join("\n");
  downloadDMSCSVFile(csv_data, fileName);
}

function getDMSCSV() {
  console.log("CSVDOWNLOAD");
  var csv_data = [];
  var headForCsv = ["Source Chat Name"];
  var csvrow = [];
  for (var m = 0; m < headForCsv.length; m++) {
    csvrow.push(headForCsv[m]);
  }
  csv_data.push(csvrow.join(","));
  var tablediv = document.getElementById("directMsgsTable");
  var tablebody = $("#directMsgsTable table tbody");
  var rows = $("#directMsgsTable table tbody tr");
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].querySelectorAll("td,th");
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      if (j === 0 || j === 1) {
        continue;
      }
      csvrow.push(cols[j].innerHTML);
    }
    csv_data.push(csvrow.join(","));
  }
  var csvrow = [];
  csv_data.push(csvrow.join(","));
  var csvrow = [];
  var arrFooter = [
    "Total DM-",
    $("#totalDMsgs").text(),
    " ",
    "Group DM -",
    $("#countGropuDM").text(),
    " ",
    "One-One DM -",
    $("#countOneDM").text(),
  ];
  for (var m = 0; m < arrFooter.length; m++) {
    csvrow.push(arrFooter[m]);
  }
  csv_data.push(csvrow.join(","));
  console.log(arrFooter);
  csv_data = csv_data.join("\n");
  downloadDMSCSVFile(csv_data, "DM'S_Report");
}
function downloadDMSCSVFile(csv_data, from) {
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

function getChannelsCSV() {
  console.log("CSVDOWNLOAD");
  var csv_data = [];
  var headForCsv = [];
  if ($("#channelsTab").hasClass("active")) {
    headForCsv = [
      "Channel Name",
      "Migrate As	",
      "Destination Team Name",
      "Destination Channel Name",
    ];
  } else {
    headForCsv = [
      "Channel Name",
      "Destination Team Name",
      "Destination Channel Name",
    ];
  }
  var csvrow = [];
  for (var m = 0; m < headForCsv.length; m++) {
    csvrow.push(headForCsv[m]);
  }
  csv_data.push(csvrow.join(","));
  var rows = $("#channelsTable table tbody tr");
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].querySelectorAll("td,th");
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      if ($("#channelsTab").hasClass("active")) {
        if (j === 0) {
          continue;
        } else if (j === 1) {
          csvrow.push(cols[j].title);
        } else if (j === 2) {
          var cl = cols[j];
          csvrow.push($('[id="msgType_dropDown"]:eq(' + i + ")").val());
        } else if (j === 3) {
          csvrow.push($('[id="destTeamNameSpan"]:eq(' + i + ")").attr("title"));
        } else if (j === 4) {
          csvrow.push(
            $('[id="destChannelNameSpan"]:eq(' + i + ")").attr("title")
          );
        }
      } else {
        if (j === 0) {
          continue;
        } else if (j === 1) {
          csvrow.push(cols[j].title);
        } else if (j === 2) {
          csvrow.push($('[id="destTeamNameSpan"]:eq(' + i + ")").attr("title"));
        } else if (j === 3) {
          csvrow.push(
            $('[id="destChannelNameSpan"]:eq(' + i + ")").attr("title")
          );
        }
      }
    }
    csv_data.push(csvrow.join(","));
  }
  var csvrow = [];
  csv_data.push(csvrow.join(","));
  var csvrow = [];
  var arrFooter = [];
  if ($("#channelsTab").hasClass("active")) {
    arrFooter = [
      "Total Public Channels :",
      $("#channelsTable table tbody tr").length,
      " ",
    ];
  } else {
    arrFooter = [
      "Total Private Channels :",
      $("#channelsTable table tbody tr").length,
      " ",
    ];
  }
  for (var m = 0; m < arrFooter.length; m++) {
    csvrow.push(arrFooter[m]);
  }
  csv_data.push(csvrow.join(","));
  console.log(arrFooter);
  csv_data = csv_data.join("\n");
  downloadChannelsSVFile(csv_data);
}
function downloadChannelsSVFile(csv_data) {
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });
  var temp_link = document.createElement("a");
  if ($("#channelsTab").hasClass("active")) {
    temp_link.download = "Public_Channels_Report.csv";
  } else {
    temp_link.download = "Private_Channels_Report.csv";
  }
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);
  temp_link.click();
  document.body.removeChild(temp_link);
}

$(".filterTable").on("input", function () {
  var filter = $(this).val();
  filter = filter.toUpperCase();
  if (
    localStorage.selSourceCloud === "MICROSOFT_TEAMS" &&
    localStorage.selDstnCloud === "MICROSOFT_TEAMS"
  ) {
    var table = $("#teamsTableTBody tr");
  } else {
    var table = $("#channelsTable table tbody tr");
  }
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

function isValidEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

$(".filterUserTable").on("input", function () {
  $("#CFShowLoading").css("display", "none");
  if (isValidEmail($(this).val())) {
    console.log($(this).val());
    cancelRequest("searchUserMapping");
    searchUserData();
  }
  if ($(this).val().length === 0 || $(this).val() === "") {
    getSlackUsers(1);
  }
});

$(document).on("input", '[class="sourceUserTable"]', function () {
  var filter = $(this).val();
  if ($(this).val() === "" || $(this).val().length === 0) {
    getTotalUsersCount();
  }

  if (isValidEmail($(this).val())) {
    cancelRequest("userAuthSearch");
    getSlackSrcUsersSearch();
  }
});

$(document).on("input", '[class="destinationUserTable"]', function () {
  var filter = $(this).val();
  if ($(this).val() === "" || $(this).val().length === 0) {
    getTotalUsersCount();
  }

  if (isValidEmail($(this).val())) {
    cancelRequest("userAuthSearch");
    getSlackSrcUsersSearch();
  }
});

$(document).on("input", '[class="searchDMSHERE"]', function () {
  var filter = $(this).val();
  filter = filter.toUpperCase();
  var table = $("#directMsgsTable table tbody tr");
  for (i = 0; i < table.length; i++) {
    td = table[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        table[i].style.display = "";
      } else {
        table[i].style.display = "none";
      }
    }
  }
});

$(document).on("change", '[id="directSelect"]', function () {
  console.log($(this).val());
  $("#dmUsersFetchCount").css("display", "");
  var list = JSON.parse(localStorage.cloudListDM);
  if ($(this).val() === "1") {
    if (
      localStorage.isDmAllOptionsClicked === undefined ||
      localStorage.isDmAllOptionsClicked === null
    ) {
      $("#directMsgsTable table tbody").html("");
      var selected = "/usersalldmgroup";
      $("#fetchedDmUsersCount").html("0");
      $("#totalDmUsersCount").html(
        "/" + JSON.parse(localStorage.cloudListDM).length
      );
      var initId = JSON.parse(localStorage.cloudListDM)[0];
      getdmlog(initId, selected, 1);
      localStorage.setItem("isDmAllOptionsClicked", true);
    } else {
      fetchCacheDm(JSON.parse(localStorage.dmAllCacheList));
    }
    console.log(initId);
  } else if ($(this).val() === "2") {
    if (
      localStorage.isDmGroupOptionsClicked === undefined ||
      localStorage.isDmGroupOptionsClicked === null
    ) {
      $("#directMsgsTable table tbody").html("");
      var selected = "/usersmpim";
      $("#fetchedDmUsersCount").html("0");
      $("#totalDmUsersCount").html(
        "/" + JSON.parse(localStorage.cloudListDMGROUP).length
      );
      var ginitId = JSON.parse(localStorage.cloudListDMGROUP)[0];
      getdmlog(ginitId, selected, 1);
      localStorage.setItem("isDmGroupOptionsClicked", true);
    } else {
      fetchCacheDm(JSON.parse(localStorage.dmGroupCacheList));
    }
  } else if ($(this).val() === "3") {
    $("#directMsgsTable table tbody").html("");
    if (
      localStorage.isDmOneToOneOptionsClicked === undefined ||
      localStorage.isDmOneToOneOptionsClicked === null
    ) {
      var selected = "/usersim";
      $("#fetchedDmUsersCount").html("0");
      $("#totalDmUsersCount").html(
        "/" + JSON.parse(localStorage.cloudListDMONE).length
      );
      var oinitId = JSON.parse(localStorage.cloudListDMONE)[0];
      getdmlog(oinitId, selected, 1);
      localStorage.setItem("isDmOneToOneOptionsClicked", true);
    } else {
      fetchCacheDm(JSON.parse(localStorage.dmOnetoOneCacheList));
    }
  } else {
    console.log("-");
  }
});

function getprovisionedUsersForChannels(pgNo) {
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/provisionmapping?adminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=" +
      pgNo +
      "&pageSize=30",
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      console.log(data);
      if (Number(pgNo) === 1) {
        localStorage.removeItem("provisionedChannelList");
        var provisionedList = [];
      }
      if (
        localStorage.provisionedChannelList === "undefined" ||
        localStorage.provisionedChannelList === undefined
      ) {
        var provisionedList = [];
      } else {
        provisionedList = JSON.parse(localStorage.provisionedChannelList);
      }
      if (data === "No Provision User Found") {
        alertSuccess("No Provision User Found");
      } else {
        data.forEach((e) => {
          if (e.provisioned === true) {
            if (localStorage.multiUsrSrcCldId === e.cloudId) {
              console.log(e.cloudId, e.emailId);
              //return false;
            } else {
              provisionedList.push(e.cloudId);
              localStorage.setItem(
                "provisionedChannelList",
                JSON.stringify(provisionedList)
              );
              pushData(e.cloudId, e.emailId);
            }
          }
        });
      }
      if (data.length === 30) {
        var pgno = Number(pgNo);
        pgno++;
        getprovisionedUsersForChannels(pgno);
      }
    },
  });
}

function callPrivateChannels() {
  var list = JSON.parse(localStorage.provisionedChannelList);
  list.forEach((x) => {
    getPrivateChannels(x);
  });
}
$(document).on("click", "#startPrivateChannels", function () {
  localStorage.setItem("slackNextToken", null);
  $(this).css({ "pointer-events": "none", opacity: "0.4" });
  if (localStorage.provisionedChannelList !== undefined) {
    $("#channelsTable table tbody").html("");
    $("#pvtCount").html("0");
    $("#pubCount").html("0");
    i; //f(localStorage.isPrivateChannelsTabClicked=== undefined){
    var list = JSON.parse(localStorage.provisionedChannelList);
    getPrivateChannels(list[0]);
    $("#privateUsers").css("display", "");
    $("#fetchedPrivateCount").html("0");
    $("#totalPrivateUser").html("/" + list.length);
    //}else{
    //  fetchCacheChannels(JSON.parse(localStorage.privateChannelsCacheList))
    //}
    localStorage.setItem("isPrivateChannelsTabClicked", true);
  } else {
    alertError("Please Authenticate Atleast One Non-Admin User");
    $("#CFShowLoading").hide();
  }
});

var privateChannelsFetchedList = [];
function getPrivateChannels(cloudId, nextId, pgno) {
  localStorage.setItem("isPrivateChannelMigration", "true");
  if (
    pgno === undefined ||
    pgno === null ||
    pgno === "undefined" ||
    pgno === "null"
  ) {
    pgno = 1;
  }
  if (cloudId == undefined) {
    cloudId = localStorage.multiUsrSrcCldId;
  }
  for (var i = 0; i < AllCloudsInfo.length; i++) {
    if (localStorage.multiUsrSrcCldId == AllCloudsInfo[i].id) {
      var workspaceName = AllCloudsInfo[i].metadataUrl;
      //localStorage.setItem("slackWorkSpaceName",workspaceName)
      break;
    }
  }
  url =
    apicallurl +
    "/messagemove/get/slackdms?adminCloudId=" +
    cloudId +
    "&pageNo=" +
    pgno +
    "&pageSize=50&channelType=private";

  $.ajax({
    type: "GET",
    url: url,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (data === "No Provision User Found") {
        alertError(data);
        //return false;
      }
      if (data.length > 0 && data !== "No Provision User Found") {
        $("#usrSeach").css("display", "none");
        $("#chnlSrch").css("display", "flex");
        var key = JSON.parse(localStorage.KeyVAl);
        key = key[0];
        if (pageNumb == 1) {
          localStorage.removeItem("privateChannelsFetchedList");
          //$("#channelsTable table tbody").html('');
          $("#pvtCount").html("0");
          $("#pubCount").html("0");
        }
        $("#usrMapping").css("display", "none");
        if (data[0].nextPageToken != null) {
          pageNumb++;
          localStorage.setItem("slackNextTokenPVT", data[0].nextPageToken);
        } else {
          $("#csvChannels").css("display", "");
          localStorage.setItem("slackNextTokenPVT", data[0].nextPageToken);
        }
        $("#channelsTable p").css("display", "none");
        var pubCount = 0,
          pvtCount = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].destTeamName) {
            var destTeamName = data[i].destTeamName;
          } else {
            var destTeamName = data[i].channelName;
          }
          if (data[i].destChannelName) {
            var destChannelName = data[i].destChannelName;
          } else {
            var destChannelName = data[i].channelName;
          }
          if ($("#selectAllChannels").is(":checked")) {
            var _input =
              '<input type="checkbox" name="channelSelect" id="' +
              data[i].fromRootId +
              '" cid="' +
              data[i].cloudId +
              '" aid="' +
              data[i].adminCloudId +
              '" workspacename="' +
              workspaceName +
              '" channeltype="' +
              data[i].types +
              '" channelname="' +
              data[i].channelName +
              '" destchannelname="' +
              destChannelName +
              '" destteamname="' +
              destTeamName +
              '" subchannel="false" channeldate="' +
              data[i].channelDate +
              '" checked>';
          } else {
            var _input =
              '<input type="checkbox" name="channelSelect" id="' +
              data[i].fromRootId +
              '" cid="' +
              data[i].cloudId +
              '" aid="' +
              data[i].adminCloudId +
              '" workspacename="' +
              workspaceName +
              '" channeltype="' +
              data[i].types +
              '" channelname="' +
              data[i].channelName +
              '" destchannelname="' +
              destChannelName +
              '" destteamname="' +
              destTeamName +
              '" subchannel="false" channeldate="' +
              data[i].channelDate +
              '">';
          }
          if (
            data[i].createdBy === "" ||
            data[i].createdBy === null ||
            data[i].createdBy === undefined
          ) {
            var createdBy = "-";
          } else {
            createdBy = data[i].createdBy;
          }
          // if((data[i].channelType !== 'public') && (data[i].createdBy === key[data[i].cloudId].split('@')[0])){
          if (
            data[i].channelType !== "public" &&
            key[data[i].cloudId] === data[i].creatorEmailId
          ) {
            privateChannelsFetchedList.push(data[i]);
            localStorage.setItem(
              "privateChannelsCacheList",
              JSON.stringify(privateChannelsFetchedList)
            );
            var _html =
              '<tr fromRootId="' +
              data[i].id +
              '"><td style="width: 1%;">' +
              _input +
              '</td><td style="width:18%;" title="' +
              data[i].channelName +
              '" id="private"><i class="fa fa-lock" style="color:#000;font-size: 10px !important;font-weight:100 !important;"></i>&nbsp;' +
              CFManageCloudAccountsAjaxCall.getMaxChars(
                data[i].channelName,
                16
              ) +
              "</td>" +
              //'<td style="width: 16%;"><span title="'+createdBy+'" id="createdByUsers">'+CFManageCloudAccountsAjaxCall.getMaxChars(createdBy, 14)+'</span></td>'+
              //'<td style="width: 16%;"><select id="JobType_dropDown" style=""><option>One Time</option><option>Delta</option></select></td>'+
              '<td style="width: 16%;"><select id="msgType_dropDown" style=""><option>Team</option><option>Sub-Channel</option></select></td>' +
              '<td style="width: 19%;"><span id="destTeamNameSpan" title="' +
              destTeamName +
              '">' +
              CFManageCloudAccountsAjaxCall.getMaxChars(destTeamName, 14) +
              '</span><i class="lnil lnil-pencil" id="destTeamEdit" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
              '<td style="width: 18%;"><span id="destChannelNameSpan" title="' +
              destChannelName +
              '">' +
              CFManageCloudAccountsAjaxCall.getMaxChars(destChannelName, 14) +
              '</span><i class="lnil lnil-pencil" id="destChannelEdit" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i></td>' +
              "</tr>";
            $("#channelsTable table tbody").append(_html);
            if (data[i].channelType == "public") {
              pubCount++;
            } else {
              pvtCount++;
            }
          }
        }
        $('[id="createdByUsers"]').parent("td").css("display", "");
        $("#createdByThead").css("display", "");
        $("#channelNameThead").css("width", "25%");
        $("#migrateTypeThead").css("width", "16%");
        $("#migrateTypeThead").children("span").css("margin-left", "70px");
        $("#migrateAsThead").children("span").css("margin-left", "18%");
        $('[id="private"]').css("width", "18%");
        $('[id="public"]').css("width", "18%");

        $("#mapCount").text($("#channelsTable tbody tr").length);
        $("#pubDiv").text("Public : ");
        $("#pvtDiv").text("Private : ");
        //$("#pubCount").text(JSON.parse($("#pubCount").text())+pubCount);
        $("#pvtCount").text(JSON.parse($("#pvtCount").text()) + pvtCount);
        //$("#selDiv").css("display","none");

        if ($("#selectAllChannels:checked").length) {
          $("#selCount").text($("#channelsTable tbody tr").length);
        }
        setTimeout(function () {
          $("#CFShowLoading").hide();
        }, 1000);
      }
      if (localStorage.getItem("slackNextTokenPVT") == "null") {
        console.log($("#pubCount").text());
        var list = JSON.parse(localStorage.provisionedChannelList);
        list.splice(0, 1);
        console.log(list);
        list = localStorage.setItem(
          "provisionedChannelList",
          JSON.stringify(list)
        );
        var list = JSON.parse(localStorage.provisionedChannelList);
        if (list.length !== 0) {
          $("#fetchedPrivateCount").html(
            Number($("#fetchedPrivateCount").text()) + 1
          );
          getPrivateChannels(list[0]);
        } else {
          $("#fetchedPrivateCount").html(
            Number($("#fetchedPrivateCount").text()) + 1
          );
          alertSuccess("Private Channels Fetched Successfully");
        }
        $("#csvChannels").css("display", "");
        return false;
      } else {
        var pgNo = Number(pgno);
        pgNo = pgNo + 1;
        getPrivateChannels(
          cloudId,
          localStorage.getItem("slackNextTokenPVT"),
          pgNo
        );
      }
    },
  });
}

var arr = {};
function pushData(cid, email) {
  arr[cid] = email;
  Object.assign(arr, arr);
  localStorage.setItem("KeyVAl", JSON.stringify([arr]));
}

$(document).on("click", '[id="multiSelectForDelta"]', function () {
  if ($("input[id='multiSelectForDelta']:checked").length > 0) {
    $('[id="deltaslack"]').css({ opacity: "1", "pointer-events": "auto" });
  } else {
    $('[id="deltaslack"]').css({ opacity: "0.4", "pointer-events": "none" });
  }
});

$(document).on("click", '[id="dmMultiDeltaCheckBox"]', function () {
  if ($("input[id='dmMultiDeltaCheckBox']:checked").length > 0) {
    $('[id="dmDeltaslack"]').css({ opacity: "1", "pointer-events": "auto" });
  } else {
    $('[id="dmDeltaslack"]').css({ opacity: "0.4", "pointer-events": "none" });
  }
});

$(document).on("click", '[id="deltaslack"]', function () {
  checkSelection = [];
  var _len = $("input[id='multiSelectForDelta']:checked").length;
  if (_len != 0) {
    $.each($("input[id='multiSelectForDelta']:checked"), function () {
      if ($(this).attr("cloudname") === "MICROSOFT_TEAMS") {
        var obj = {
          fromCloudId: {
            id: $(this).attr("cid"),
          },
          toCloudId: {
            id: $(this).attr("tocid"),
          },
          channelDate: $(this).attr("srcdeltaid"),
          fromRootId: $(this).attr("fromrootid"),
          toRootId: $(this).attr("torootid"),
          channelName: $(this).attr("cname"),
          channelType: $(this).attr("ctype"),
          specialCharacter: "-",
          workSpaceName: $(this).attr("wname"),
          destChannelName: $(this).attr("destchannelname"),
          destTeamName: $(this).attr("dstteamname"),
          srcChannelId: $(this).attr("srcchannelid"),
          sourceDeltaId: $(this).attr("sourcedeltaid"),
        };
      } else if (
        $(this).attr("cloudname") === "SLACK" &&
        $(this).attr("tocloudname") === "SLACK"
      ) {
        var obj = {
          fromCloudId: {
            id: $(this).attr("cid"),
          },
          toCloudId: {
            id: $(this).attr("tocid"),
          },
          channelDate: $(this).attr("srcdeltaid"),
          fromRootId: $(this).attr("fromrootid"),
          toRootId: $(this).attr("torootid"),
          channelName: $(this).attr("cname"),
          channelType: $(this).attr("ctype"),
          specialCharacter: "-",
          sourceDelegateCloudId: $(this).attr("srcdeligate"),
          destDelegateCloudId: $(this).attr("dstndeligate"),
          workSpaceName: $(this).attr("wname"),
          destChannelName: $(this).attr("destchannelname"),
          destTeamName: $(this).attr("dstteamname"),
        };
      } else {
        var obj = {
          fromCloudId: {
            id: $(this).attr("cid"),
          },
          toCloudId: {
            id: $(this).attr("tocid"),
          },
          channelDate: $(this).attr("srcdeltaid"),
          fromRootId: $(this).attr("fromrootid"),
          toRootId: $(this).attr("torootid"),
          channelName: $(this).attr("cname"),
          channelType: $(this).attr("ctype"),
          specialCharacter: "-",
          // sourceDelegateCloudId: $(this).attr("srcdeligate"),
          // destDelegateCloudId: $(this).attr("dstndeligate"),
          workSpaceName: $(this).attr("wname"),
          destChannelName: $(this).attr("destchannelname"),
          destTeamName: $(this).attr("dstteamname"),
        };
      }
      checkSelection.push(obj);
    });
  }
  console.log(checkSelection);
  $.ajax({
    type: "POST",
    async: false,
    url:
      apicallurl +
      "/messagemove/create/messagemove/custom?willHaveDelta=false&deltaMigration=true",
    data: JSON.stringify(checkSelection),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Delta Initiated Successfully");
      getSlackReports();
    },
  });
});

$(document).on("click", '[id="dmDeltaslack"]', function () {
  checkDmSelection = [];
  var _len = $("input[id='dmMultiDeltaCheckBox']:checked").length;
  if (_len != 0) {
    $.each($("input[id='dmMultiDeltaCheckBox']:checked"), function () {
      var obj = {
        fromCloudId: {
          id: $(this).attr("fromcid"),
        },
        toCloudId: {
          id: $(this).attr("tocid"),
        },
        channelDate: $(this).attr("chnalDate"),
        fromRootId: $(this).attr("fromrootid"),
        toRootId: $(this).attr("torootid"),
        channelName: $(this).attr("cname"),
        emailPairs: $(this).attr("emailPairs").split(","),
        destWebUrls: $(this).attr("dstnweburl").split(","),
        destFolderIds: $(this).attr("dstnfolderid").split(","),
        channelType: $(this).attr("ctype"),
        specialCharacter: "-",
        mainWSId: $(this).attr("mainWSId"),
        workSpaceName: $(this).attr("wname"),
        sourceDelegateCloudId: $(this).attr("srcDelegateCloudId"),
        destDelegateCloudId: $(this).attr("dstnDelegateCloudId"),
        teamsId: $(this).attr("teamsId"),
        channelName: $(this).attr("channelName"),
      };
      checkDmSelection.push(obj);
    });
  }
  console.log(checkDmSelection);
  $.ajax({
    type: "POST",
    async: false,
    url:
      apicallurl + "/messagemove/create?directOrGroupMessage=true&isDelta=true",
    data: JSON.stringify(checkDmSelection),
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      alertSuccess("Delta Initiated Successfully");
      getSlackReports();
    },
  });
});

$("#dropDMFilter a").click(function () {
  //$("#dropPubPvt").css("display", "");
  console.log($(this).text().toLowerCase());
  if ($(this).text().toLowerCase() == "group") {
    filter = "mpim";
    $(".fa-check-circle.groupDM").css("display", "");
    $(".fa-check-circle.oneToOneDM").css("display", "none");
    $(".fa-check-circle.allDM").css("display", "none");
    //$("#selCount").html($("input[channeltype='public']").length);
  } else if ($(this).text().toLowerCase() == "one-one") {
    filter = "im";
    $(".fa-check-circle.oneToOneDM").css("display", "");
    $(".fa-check-circle.allDM").css("display", "none");
    $(".fa-check-circle.groupDM").css("display", "none");
    //$("#selCount").html($("input[channeltype='private']").length);
  } else {
    filter = "all";
    $(".fa-check-circle.oneToOneDM").css("display", "none");
    $(".fa-check-circle.groupDM").css("display", "none");
    $(".fa-check-circle.allDM").css("display", "");
    //$("#selCount").html($("#srcUsrsTable table tbody tr").length);
  }
  tr = $("#directMsgsTable table tbody tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i];
    if (td) {
      txtValue = td.id;
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

  if (
    $('[name="messageSelect"]:visible:checked').length ===
    $('[name="messageSelect"]:visible').length
  ) {
    $('[id="selectAllMsgs"]').prop("checked", true);
  } else {
    $('[id="selectAllMsgs"]').prop("checked", false);
  }
  $("#counttotalSelectedDM").html(
    $('[name="messageSelect"]:visible:checked').length
  );
});

$("#summaryNavBreadCrumb").click(function () {
  localStorage.setItem("atpremigchannels", false);
  $(this).addClass("navActive");
  $("#slackBtn").css("display", "");
  $("#slackPreMigRefresh").css("display", "none");
  $("#slackChannelsPreMigrationTable").css("display", "none");
  $("#appendInnerBreadCrumbs").html("");
  $(".slackPremigrationTopContainer").css("display", "");
});

$("#slackBtn").on("click", function () {
  getChannelsPreMigrationSummary();
  getDmsPreMigrationSummary();
});

function getChannelsPreMigrationSummary() {
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/run/premigration?cloudId=" +
      localStorage.getItem("multiUsrSrcCldId"),
    async: false,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data == "Your Request is Already under processing") {
        $(".showStatusPreMigration")
          .css({ display: "", color: "#FFB900", border: "1px solid #FFB900" })
          .find("span")
          .html("In-Progress");
        localStorage.setItem("premigrationstatus", "inprogress");
        alertSuccess("Your request is under processing.");
        getPreMigrationStatus();
      } else if (data.totalUsersInWorkspace === 0) {
        $(".showStatusPreMigration")
          .css({ display: "", color: "#FFB900", border: "1px solid #FFB900" })
          .find("span")
          .html("In-Progress");
        getPreMigrationStatus();
        $('[id="viewChannelsTable"]').css("display", "").attr("wsid", data.id);
      } else {
        if (
          localStorage.dmspremigrationstatus === "completed" &&
          localStorage.channelspremigrationstatus === "completed"
        ) {
          localStorage.setItem("premigrationstatus", "completed");
          $(".showStatusPreMigration")
            .css({ display: "", color: "#00C64F", border: "1px solid #00C64F" })
            .find("span")
            .html("Completed");
        }
        //$("#slackBtn").html("Completed")
        $("#sortStylePublicPVT").css("display", "");
        localStorage.setItem("channelspremigrationstatus", "completed");
        $("#totalUsersPreMigration").html(data.totalUsersInWorkspace);
        $("#totalChannelsPreMigration").html(
          data.totalPublicChannel + data.totalPrivateChannel
        );
        $("#totalPublicChannelsPreMigration").html(data.totalPublicChannel);
        $("#totalPrivateChannelsPreMigration").html(data.totalPrivateChannel);
        $("#totalChannelMessagesPreMigration").html(data.totalMessageInChannel);
        $("#totalDataSizePreMigration").html(
          CFManageCloudAccountsAjaxCall.getObjectSize(data.totalDataSize)
        );
        $('[id="viewChannelsTable"]').css("display", "").attr("wsid", data.id);
      }
    },
  });
}

function getDmsPreMigrationSummary() {
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/run/premigration?channelId=dm&cloudId=" +
      localStorage.getItem("multiUsrSrcCldId"),
    async: false,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data == "Your Request is Already under processing") {
        $(".showStatusPreMigration")
          .css({ display: "", color: "#FFB900", border: "1px solid #FFB900" })
          .find("span")
          .html("In-Progress");
        localStorage.setItem("premigrationstatus", "inprogress");
        alertSuccess("Your request is under processing.");
        getPreMigrationStatus();
      } else if (data.totalUsersInWorkspace === 0) {
        $(".showStatusPreMigration")
          .css({ display: "", color: "#FFB900", border: "1px solid #FFB900" })
          .find("span")
          .html("In-Progress");
        localStorage.setItem("premigrationstatus", "inprogress");
        getPreMigrationStatus();
        $('[id="viewChannelsTable"]').css("display", "").attr("wsid", data.id);
      } else {
        localStorage.setItem("dmspremigrationstatus", "completed");
        localStorage.setItem("premigrationstatus", "completed");
        if (
          localStorage.dmspremigrationstatus === "completed" &&
          localStorage.channelspremigrationstatus === "completed"
        ) {
          $(".showStatusPreMigration")
            .css({ display: "", color: "#00C64F", border: "1px solid #00C64F" })
            .find("span")
            .html("Completed");
        }
        //$("#slackBtn").html("Completed")
        //$("#sortStylePublicPVT").css("display","");
        $("#totalDmsCount").html(data.totalPrivateChannel);
        $("#totalDmsMessagesCount").html(data.totalMessageInChannel);
        $("#totalDmsDataSize").html(
          CFManageCloudAccountsAjaxCall.getObjectSize(data.totalDataSize)
        );
        $('[id="viewDMsTable"]').css("display", "").attr("wsid", data.id);
      }
    },
  });
}

function getPreMigrationStatus() {
  if (localStorage.premigrationstatus === "inprogress") {
    //$("#slackBtn").html("In-Progress")
    setTimeout(function () {
      console.log("checking for premigration status");
      $("#slackBtn").trigger("click");
    }, 50000);
  }
}

$("#slackPreMigRefresh").click(function () {
  localStorage.setItem("atpremigchannels", false);
  $(this).find("i").addClass("animateRefreshBtn");
  if ($(this).attr("data-for") === "channels") {
    getPreMigrationChannels();
  } else {
    getPreMigrationDms();
  }
});

$(document).on("click", "#viewChannelsTable", function () {
  $(".tableSlackChannelsPreMigration table tbody").html("");
  getPreMigrationChannels();
  $("#slackPreMigRefresh").css("display", "");
  $("#slackBtn").css("display", "none");
  $("#summaryNavBreadCrumb").removeClass("navActive");
  $("#appendInnerBreadCrumbs").html("");
  $("#appendInnerBreadCrumbs").append(
    "<span> > </span><span class='navActive'>Channels</span>"
  );
  $(".slackPremigrationTopContainer").css("display", "none");
  $("#slackChannelsPreMigrationTable").css("display", "");
});

$(document).on("click", "#viewDMsTable", function () {
  $(".tableSlackChannelsPreMigration table tbody").html("");
  getPreMigrationDms();
  $("#slackPreMigRefresh").css("display", "");
  $("#slackBtn").css("display", "none");
  $("#summaryNavBreadCrumb").removeClass("navActive");
  $("#appendInnerBreadCrumbs").html("");
  $("#appendInnerBreadCrumbs").append(
    "<span> > </span><span class='navActive'>Direct Messages</span>"
  );
  $(".slackPremigrationTopContainer").css("display", "none");
  $("#slackChannelsPreMigrationTable").css("display", "");
});

let totalMessages = 0;
function getPreMigrationChannels(wsid, pgno) {
  let pgNo = pgno ?? 1;
  let wsId = wsid ?? $('[id="viewChannelsTable"]').attr("wsid");
  let asyncType = true;
  if (pgNo === 1) {
    $("#CFShowLoading").show();
    asyncType = false;
  } else {
    $("#CFShowLoading").hide();
    asyncType = true;
  }

  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/run/premigration/channeldetails?messageWSId=" +
      wsId +
      "&pageNo=" +
      pgNo +
      "&pageSize=50",
    async: asyncType,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data) {
        if (pgNo === 1) {
          console.time();
          localStorage.setItem("atpremigchannels", true);
          $(".tableSlackChannelsPreMigration table tbody").html("");
          totalMessages = 0;
          if (data === "") {
            alert("NO DAta");
          }
        } else {
          $("#CFShowLoading").hide();
          totalMessages = totalMessages;
        }
        var processStatus = {
          IN_PROGRESS: "In Progress",
          PROCESSED: "Processed",
          NOT_PROCESSED: "Not Processed",
        };
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let _data = data[i];
            totalMessages = totalMessages + _data.totalMessageInChannel;
            let fileCount = _data.filesCount ? _data.filesCount : "0";
            if (_data.publicChannel) {
              $(".tableSlackChannelsPreMigration table tbody").append(
                "<tr id='publicPreMigration'><td title=" +
                  _data.channelName +
                  "><i class='fa fa-hashtag' style='color:#000;font-size: 10px !important;font-weight:100 !important;'></i>&nbsp;" +
                  CFManageCloudAccountsAjaxCall.getMaxChars(
                    _data.channelName,
                    15
                  ) +
                  "</td><td>" +
                  _data.totalMessageInChannel +
                  "</td><td>" +
                  _data.totalUsersInPublicChannel +
                  "</td><td>" +
                  fileCount +
                  "</td><td>" +
                  CFManageCloudAccountsAjaxCall.getObjectSize(
                    _data.totalDataSize
                  ) +
                  "</td><td class=" +
                  _data.processStatus +
                  "><span class='span-" +
                  _data.processStatus +
                  "'>" +
                  processStatus[_data.processStatus] +
                  "</span></td></tr>"
              );
            } else {
              $(".tableSlackChannelsPreMigration table tbody").append(
                "<tr id='privatePreMigration'><td title=" +
                  _data.channelName +
                  "><i class='fa fa-lock' style='color:#000;font-size: 10px !important;font-weight:100 !important;'></i>&nbsp;" +
                  CFManageCloudAccountsAjaxCall.getMaxChars(
                    _data.channelName,
                    15
                  ) +
                  "</td><td>" +
                  _data.totalMessageInChannel +
                  "</td><td>" +
                  _data.totalUsersInPrivateChannel +
                  "</td><td>" +
                  fileCount +
                  "</td><td>" +
                  CFManageCloudAccountsAjaxCall.getObjectSize(
                    _data.totalDataSize
                  ) +
                  "</td><td class=" +
                  _data.processStatus +
                  "><span class='span-" +
                  _data.processStatus +
                  "'>" +
                  processStatus[_data.processStatus] +
                  "</span></td></tr>"
              );
            }
          }
          $("#downloadChannelsCSVforPerMigration").attr("data-for", "channels");
          $("#slackPreMigRefresh").attr("data-for", "channels");
          $("#fetchTotalMessagesChannelCountPreMig").html(totalMessages);
          $("#fetchChannelCountPreMig").html(
            $(".tableSlackChannelsPreMigration table tbody tr").length
          );
          $("#fetchPublicChannelCountPreMig").html(
            $('[id="publicPreMigration"]').length
          );
          $("#fetchPrivateChannelCountPreMig").html(
            $('[id="privatePreMigration"]').length
          );
          $(".tableSlackPreMigSummaryDms").css("display", "none");
          $(".tableSlackPreMigSummaryChannels").css("display", "flex");
          $("#dropDownDmsPreMig").css("display", "none");
          $("#dropDownChannelsPreMig").css("display", "");
          $(".fa-check-circle.publicPreMig").css("display", "none");
          $(".fa-check-circle.privatePreMig").css("display", "none");
          $(".fa-check-circle.allPreMig").css("display", "");
        }
        if (data.length === 50 && localStorage.atpremigchannels === "true") {
          getPreMigrationChannels(wsId, pgNo + 1);
        } else {
          $("#slackPreMigRefresh").find("i").removeClass("animateRefreshBtn");
          console.timeEnd();
        }
      } else {
        $('[id="alertNoData"]').remove();
        if (pgNo === 1) {
          $(".tableSlackChannelsPreMigration").append(
            `<div id="alertNoData" style="display:flex;align-items: center;width: 100%;height: 100%;color: #acacac;justify-content: center;text-decoration: underline;">No Channels Pre-Migration Data Found</div>`
          );
          alertError("No Data Found...");
        }
        $("#CFShowLoading").hide();
      }
    },
  });
}

let totalDms = 0;
function getPreMigrationDms(wsid, pgno) {
  let pgNo = pgno ?? 1;
  let wsId = wsid ?? $('[id="viewDMsTable"]').attr("wsid");
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/run/premigration/channeldetails?messageWSId=" +
      wsId +
      "&pageNo=" +
      pgNo +
      "&pageSize=50",
    async: true,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (pgNo === 1) {
        console.time();
        localStorage.setItem("atpremigchannels", true);
        $(".tableSlackChannelsPreMigration table tbody").html("");
        totalMessages = 0;
      } else {
        totalMessages = totalMessages;
      }
      var processStatus = {
        IN_PROGRESS: "In Progress",
        PROCESSED: "Processed",
        NOT_PROCESSED: "Not Processed",
        CONFLICT: "Conflict",
      };
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let _data = data[i];
          totalMessages = totalMessages + _data.totalMessageInChannel;
          let fileCount = _data.filesCount ? _data.filesCount : "0";
          if (_data.group === true) {
            $(".tableSlackChannelsPreMigration table tbody").append(
              "<tr id='groupDmPreMig'><td title=" +
                _data.channelName.split("mpdm-")[1].split("-1")[0] +
                "><i class='fas fa-user-friends' style='display:none;color:#000;font-size: 10px !important;font-weight:100 !important;'></i>&nbsp;" +
                CFManageCloudAccountsAjaxCall.getMaxChars(
                  _data.channelName.split("mpdm-")[1].split("-1")[0],
                  20
                ) +
                "</td><td>" +
                _data.totalMessageInChannel +
                "</td><td>" +
                _data.channelName.split("mpdm-")[1].split("-1")[0].split("--")
                  .length +
                "</td><td>" +
                fileCount +
                "</td><td>" +
                CFManageCloudAccountsAjaxCall.getObjectSize(
                  _data.totalDataSize
                ) +
                "</td><td class=" +
                _data.processStatus +
                "><span class='span-" +
                _data.processStatus +
                "'>" +
                processStatus[_data.processStatus] +
                "</span></td></tr>"
            );
          } else {
            $(".tableSlackChannelsPreMigration table tbody").append(
              "<tr id='oneToOnePreMig'><td title=" +
                _data.channelName +
                "><i style='display:none;color:#000;font-size: 10px !important;font-weight:100 !important;'></i>&nbsp;" +
                CFManageCloudAccountsAjaxCall.getMaxChars(
                  _data.channelName,
                  15
                ) +
                "</td><td>" +
                _data.totalMessageInChannel +
                "</td><td>2</td><td>" +
                fileCount +
                "</td><td>" +
                CFManageCloudAccountsAjaxCall.getObjectSize(
                  _data.totalDataSize
                ) +
                "</td><td class=" +
                _data.processStatus +
                "><span class='span-" +
                _data.processStatus +
                "'>" +
                processStatus[_data.processStatus] +
                "</span></td></tr>"
            );
          }
          //fas fa-lock
        }
        $("#downloadChannelsCSVforPerMigration").attr("data-for", "dms");
        $("#slackPreMigRefresh").attr("data-for", "dms");
        $("#fetchTotalMessagesChannelCountPreMigDms").html(totalMessages);
        $("#fetchChannelCountPreMigDms").html(
          $(".tableSlackChannelsPreMigration table tbody tr").length
        );
        $("#fetchPublicChannelCountPreMigDms").html(
          $('[id="groupDmPreMig"]').length
        );
        $("#fetchPrivateChannelCountPreMigDms").html(
          $('[id="oneToOnePreMig"]').length
        );
        $(".tableSlackPreMigSummaryDms").css("display", "flex");
        $(".tableSlackPreMigSummaryChannels").css("display", "none");
        $("#dropDownDmsPreMig").css("display", "");
        $(".fa-check-circle.groupDmPreMig").css("display", "none");
        $(".fa-check-circle.oneToOnePreMig").css("display", "none");
        $(".fa-check-circle.allDmsPreMig").css("display", "");
        $("#dropDownChannelsPreMig").css("display", "none");
      }
      if (data.length === 50 && localStorage.atpremigchannels === "true") {
        getPreMigrationChannels(wsId, pgNo + 1);
      } else {
        $("#slackPreMigRefresh").find("i").removeClass("animateRefreshBtn");
        console.timeEnd();
      }
    },
  });
}

$("#dropDownChnlsPreMig a").click(function () {
  $("#dropDownChnlsPreMig").css("display", "");
  if ($(this).text().toLowerCase() == "public") {
    filter = "publicPreMigration";
    $(".fa-check-circle.publicPreMig").css("display", "");
    $(".fa-check-circle.privatePreMig").css("display", "none");
    $(".fa-check-circle.allPreMig").css("display", "none");
  } else if ($(this).text().toLowerCase() == "private") {
    filter = "privatePreMigration";
    $(".fa-check-circle.privatePreMig").css("display", "");
    $(".fa-check-circle.publicPreMig").css("display", "none");
    $(".fa-check-circle.allPreMig").css("display", "none");
  } else {
    filter = "all";
    $(".fa-check-circle.publicPreMig").css("display", "none");
    $(".fa-check-circle.privatePreMig").css("display", "none");
    $(".fa-check-circle.allPreMig").css("display", "");
  }
  console.log(filter);
  tr = $(".tableSlackChannelsPreMigration table tbody tr");
  for (i = 0; i < tr.length; i++) {
    tRow = tr[i];
    if (tRow) {
      txtValue = tRow.id;
      console.log(txtValue);
      if (filter == "all") {
        tRow.style.display = "";
      } else if (txtValue.indexOf(filter) > -1) {
        tRow.style.display = "";
      } else {
        tRow.style.display = "none";
      }
    }
  }
  updateTableStyle();
});

$("#dropDownDmsPreMig a").click(function () {
  $("#dropDownDmsPreMig").css("display", "");
  if ($(this).text().toLowerCase() == "group") {
    filter = "groupDmPreMig";
    $(".fa-check-circle.groupDmPreMig").css("display", "");
    $(".fa-check-circle.oneToOnePreMig").css("display", "none");
    $(".fa-check-circle.allDmsPreMig").css("display", "none");
  } else if ($(this).text().toLowerCase() == "one-one") {
    filter = "oneToOnePreMig";
    $(".fa-check-circle.groupDmPreMig").css("display", "none");
    $(".fa-check-circle.oneToOnePreMig").css("display", "");
    $(".fa-check-circle.allDmsPreMig").css("display", "none");
  } else {
    filter = "all";
    $(".fa-check-circle.groupDmPreMig").css("display", "none");
    $(".fa-check-circle.oneToOnePreMig").css("display", "none");
    $(".fa-check-circle.allDmsPreMig").css("display", "");
  }
  console.log(filter);
  tr = $(".tableSlackChannelsPreMigration table tbody tr");
  for (i = 0; i < tr.length; i++) {
    tRow = tr[i];
    if (tRow) {
      txtValue = tRow.id;
      console.log(txtValue);
      if (filter == "all") {
        tRow.style.display = "";
      } else if (txtValue.indexOf(filter) > -1) {
        tRow.style.display = "";
      } else {
        tRow.style.display = "none";
      }
    }
  }
  updateTableStyle();
});

function updateTableStyle() {
  $(".tableSlackChannelsPreMigration table tbody tr:visible:odd")
    .removeClass("even")
    .addClass("odd");
  $(".tableSlackChannelsPreMigration table tbody tr:visible:even")
    .removeClass("odd")
    .addClass("even");
}

$("#downloadChannelsCSVforPerMigration").click(function () {
  if ($(this).attr("data-for") === "channels") {
    var csv_data = [];
    var headForCsv = [
      "Channel Name",
      "Total Messages",
      "Total Public / Private Channels",
      //"Total Private Channels",
      "Total Files",
      "Total Data Size",
      "Status",
    ];
    var csvrow = [];
    for (var m = 0; m < headForCsv.length; m++) {
      csvrow.push(headForCsv[m]);
    }
    csv_data.push(csvrow.join(","));
    var tablediv = document.getElementById("directMsgsTable");
    var tablebody = $(".tableSlackChannelsPreMigration table tbody");
    var rows = $(".tableSlackChannelsPreMigration table tbody tr");
    for (var i = 0; i < rows.length; i++) {
      if ($(rows[i]).is(":visible")) {
        var cols = rows[i].querySelectorAll("td,th");
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
          if (j === 0) {
            csvrow.push(cols[j].title);
          } else {
            csvrow.push(cols[j].textContent);
          }
        }
        csv_data.push(csvrow.join(","));
      }
    }
    //var csv_footer = []
    var csvrow = [];
    csv_data.push(csvrow.join(","));
    var csvrow = [];
    var arrFooter = [
      "Total Channels-" + $("#fetchChannelCountPreMig").text(),
      "Total Messages-" + $("#fetchTotalMessagesChannelCountPreMig").text(),
      "Public Channels -" + $("#fetchPublicChannelCountPreMig").text(),
      "Private Channels -" + $("#fetchPrivateChannelCountPreMig").text(),
    ];
    for (var m = 0; m < arrFooter.length; m++) {
      csvrow.push(arrFooter[m]);
    }
    csv_data.push(csvrow.join(","));
    console.log(arrFooter);
    csv_data = csv_data.join("\n");
    downloadDMSCSVFile(csv_data, "Channels_Pre-Migration_Report");
  } else {
    var csv_data = [];
    var headForCsv = [
      "DM Name",
      "Total Messages",
      "Total members",
      "Total Files",
      "Total Data Size",
      "Status",
    ];
    var csvrow = [];
    for (var m = 0; m < headForCsv.length; m++) {
      csvrow.push(headForCsv[m]);
    }
    csv_data.push(csvrow.join(","));
    var tablediv = document.getElementById("directMsgsTable");
    var tablebody = $(".tableSlackChannelsPreMigration table tbody");
    var rows = $(".tableSlackChannelsPreMigration table tbody tr");
    for (var i = 0; i < rows.length; i++) {
      if ($(rows[i]).is(":visible")) {
        var cols = rows[i].querySelectorAll("td,th");
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
          if (j === 0) {
            csvrow.push(cols[j].title);
          } else {
            csvrow.push(cols[j].textContent);
          }
        }
        csv_data.push(csvrow.join(","));
      }
    }
    //var csv_footer = []
    var csvrow = [];
    csv_data.push(csvrow.join(","));
    var csvrow = [];
    var arrFooter = [
      "Total Direct Messages-" + $("#fetchChannelCountPreMigDms").text(),
      "Group -" + $("#fetchPublicChannelCountPreMigDms").text(),
      "One-One -" + $("#fetchPrivateChannelCountPreMigDms").text(),
      "Total Messages-" + $("#fetchTotalMessagesChannelCountPreMigDms").text(),
    ];
    for (var m = 0; m < arrFooter.length; m++) {
      csvrow.push(arrFooter[m]);
    }
    csv_data.push(csvrow.join(","));
    console.log(arrFooter);
    csv_data = csv_data.join("\n");
    downloadDMSCSVFile(csv_data, "Dms_Pre-Migration_Report");
  }
});

$("#syncChannels").click(function () {
  $(this).addClass("animateRefreshBtn");
  startSyncChannels(true);
});

function startSyncChannels(isAdmin) {
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/sync/slack/channel?cloudId=" +
      localStorage.multiUsrSrcCldId +
      "&isAdmin=" +
      isAdmin,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (res) {
      $("#CFShowLoading").hide();
      $("#syncChannels").removeClass("animateRefreshBtn");
      slackChannels(localStorage.multiUsrSrcCldId);
      alertSuccess("Channels Synced Successfully");
    },
  });
}

function getSlacktoSlackUsers(pgNo, adminId, path) {
  $("#dmContent").css("display", "none");
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/provisionmapping?adminCloudId=" +
      adminId +
      "&sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&pageNo=" +
      pgNo +
      "&pageSize=30",
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#footerValues").css("display", "inline-flex");
      $("#footerValues").find("#channelCnt").css("display", "");
      if (data == "No Provision User Found") {
        if (Number(pgNo) === 1) {
          getSrcDstnUsers();
        }
      } else {
        // if (path === "source") {
        if (Number(pgNo) === 1) {
          var pubCount = 0,
            pvtCount = 0;
          $("#dstnSlacktoSlackTable table tbody").html("");
        } else {
          pubCount = Number($("#mappingDirectMsgs #pubCount").text());
          pvtCount = Number($("#mappingDirectMsgs #pvtCount").text());
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].provisioned == true) {
            pubCount++;
            var _html =
              '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input disabled type="checkbox" name="selectSrcUsers" id="' +
              data[i].id +
              '" adminid="' +
              data[i].adminCloudId +
              '" cloudid="' +
              data[i].cloudId +
              '" provisioned="' +
              data[i].provisioned +
              '" emailsent="' +
              data[i].emailSent +
              '" userid="' +
              data[i].userId +
              '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
              data[i].emailId +
              "</span></td><td>Authenticated</td></tr>";
          } else {
            if (data[i].emailSent == false) {
              var _html =
                '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectSrcUsers" id="' +
                data[i].id +
                '" adminid="' +
                data[i].adminCloudId +
                '" cloudid="' +
                data[i].cloudId +
                '" provisioned="' +
                data[i].provisioned +
                '" emailsent="' +
                data[i].emailSent +
                '" userid="' +
                data[i].userId +
                '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
                data[i].emailId +
                "</span></td><td>Not Authenticated</td></tr>";
            } else {
              pvtCount++;
              var _html =
                '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectSrcUsers" id="' +
                data[i].id +
                '" adminid="' +
                data[i].adminCloudId +
                '" cloudid="' +
                data[i].cloudId +
                '" provisioned="' +
                data[i].provisioned +
                '" emailsent="' +
                data[i].emailSent +
                '" userid="' +
                data[i].userId +
                '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
                data[i].emailId +
                '</span></td><td>Email Sent <a href="#" id="resendCode"  cldname="' +
                data[i].cloudName +
                '">Resend Code</a></td></tr>';
            }
          }
          $("#dstnSlacktoSlackTable table tbody").append(_html);
        }
        // }
      }
      // if (adminId === localStorage.multiUsrSrcCldId) {
      if (data.length === 30) {
        var pgno = Number(pgNo);
        pgno++;
        getSlacktoSlackUsers(pgno, adminId, path);
      }
      $("#totalSlackDstnUsers").html(
        $("#dstnSlacktoSlackTable table tbody tr").length
      );
      $("#totalSlackDstnAuthUsers").html(pubCount);
      $("#totalSlackDstnEmailSentUsers").html(pvtCount);

      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}

$(document).on("click", "#authAtSlacktoSlack", function () {
  if ($("input[name=selectSrcUsers]:checked").length < 2) {
    sendSlackEmail();
  } else {
    sendSlackBulkEmail();
  }
});

$("#dropSlackToSlackAuthenticated a").click(function () {
  $("#dropPubPvt").css("display", "");
  console.log($(this).text().toLowerCase());
  if ($(this).text().toLowerCase() == "authenticated") {
    filter = "Authenticated";
    $(".fa-check-circle.dropSentEmailAuthenticated").css("display", "none");
    $(".fa-check-circle.dropAuthenticated").css("display", "");
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='public']").length);
  } else if ($(this).text().toLowerCase() == "not authenticated") {
    filter = "Not Authenticated";
    $(".fa-check-circle.dropSentEmailAuthenticated").css("display", "none");
    $(".fa-check-circle.dropNotAuthenticated").css("display", "");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='private']").length);
  } else if ($(this).text().toLowerCase() == "email sent") {
    filter = "Email Sent Resend Code";
    $(".fa-check-circle.dropSentEmailAuthenticated").css("display", "");
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "none");
    $("#selCount").html($("input[channeltype='private']").length);
  } else {
    filter = "all";
    $(".fa-check-circle.dropSentEmailAuthenticated").css("display", "none");
    $(".fa-check-circle.dropNotAuthenticated").css("display", "none");
    $(".fa-check-circle.dropAuthenticated").css("display", "none");
    $(".fa-check-circle.allAuthenticated").css("display", "");
    $("#selCount").html($("#srcUsrsTable table tbody tr").length);
  }
  tr = $("#dstnSlacktoSlackTable table tbody tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent;
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
});

function getReplaceSpChar(text) {
  if (text === "" || text === undefined || text === null) {
    return "";
  } else {
    var pl = /\</g;
    var pl1 = /\>/g;
    var pl2 = /\"/g;
    var pl3 = /\'/g;
    let replaceText = text
      .replace(pl, "&lt;")
      .replace(pl1, "&gt;")
      .replace(pl2, "&quot;")
      .replace(pl3, "&apos;");
    return replaceText;
  }
}

$(document).on("input", "#channelsName", function () {
  if (localStorage.selSourceCloud === localStorage.selDstnCloud) {
    let spclRegax = /[!@#$%^&*()`~_+\=\[\]{};'" ":"\\|,.<>\/?]+/;
    if (spclRegax.test($(this).val()[$(this).val().length - 1])) {
      alertError(
        'Slack won\'t accept withspaces and special characters except "-"'
      );
      $(this).val(
        $(this)
          .val()
          .substring(0, $(this).val().length - 1)
      );
    } else if (spclRegax.test($(this).val())) {
      alertError(
        'Slack won\'t accept withspaces and special characters except "-"'
      );
      $(this).val(
        $(this)
          .val()
          .replaceAll(/[!#$%^&*()`~@_+\=\[\]{};'" ":"\\|,.<>\/?]+/g, "")
      );
    }
  }

  if (
    localStorage.selSourceCloud === "SLACK" &&
    localStorage.selDstnCloud === "SLACK"
  ) {
    if ($(this).val().length > 80) {
      $(this).val(
        $(this)
          .val()
          .substring(0, $(this).val().length - 1)
      );
      alertError("Maximum 80 Characters are allowed for channel name");
    }
  }
});

$("#searchDmsIcons").click(function () {
  if ($(this).hasClass("fa-times")) {
    $(this).addClass("fa-search").removeClass("fa-times");
    if ($("#dstnUsersTab").hasClass("active")) {
      $('[class="destinationUserTable"]').css("display", "none");
      $('[class="destinationUserTable"]').val("");
    } else if ($("#directMsgsTab").hasClass("active")) {
      $('[class="searchDMSHERE"]').css("display", "none");
      $('[class="searchDMSHERE"]').val("");
    } else {
      $('[class="sourceUserTable"]').css("display", "none");
      $('[class="sourceUserTable"]').val("");
    }
  } else {
    $(this).addClass("fa-times").removeClass("fa-search");
    if ($("#dstnUsersTab").hasClass("active")) {
      $('[class="destinationUserTable"]').css("display", "");
      $('[class="destinationUserTable"]').val("");
    } else if ($("#directMsgsTab").hasClass("active")) {
      $('[class="searchDMSHERE"]').css("display", "");
      $('[class="searchDMSHERE"]').val("");
    } else {
      $('[class="sourceUserTable"]').css("display", "");
      $('[class="sourceUserTable"]').val("");
    }
  }
});

function resetFilters(from) {
  if (from === "USERS_MAPPING") {
    $("#searchUsersIcon").addClass("fa-search").removeClass("fa-times");
    $(".searchTextBox").css("display", "none");
    $(".filterUserTable").css("display", "none");
    $(".filterUserTable").val("");
  } else if (from === "DMS_SOURCE") {
    $("#searchDmsIcons").addClass("fa-search").removeClass("fa-times");
    $('[class="sourceUserTable"]').css("display", "none");
    $('[class="sourceUserTable"]').val("");
  } else {
    $("#searchDmsIcons").addClass("fa-search").removeClass("fa-times");
    $('[class="sourceUserTable"]').css("display", "none");
    $('[class="sourceUserTable"]').val("");
    $("#searchUsersIcon").addClass("fa-search").removeClass("fa-times");
    $(".searchTextBox").css("display", "none");
    $(".filterUserTable").css("display", "none");
    $('[class="sourceUserTable"]').css("display", "none");
    $('[class="destinationUserTable"]').css("display", "none");
    $('[class="searchDMSHERE"]').css("display", "");
    $(".filterUserTable").val("");
    $('[class="destinationUserTable"]').css("display", "none");
    $('[class="searchDMSHERE"]').css("display", "none");
    $('[class="sourceUserTable"]').css("display", "none");
    $("#searchDmsIcons").addClass("fa-search").removeClass("fa-times");
  }
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

function getTeams(cId) {
  $("#teamsTableTBody").html("");
  $("#CFShowLoading").show();
  $("#loaderText").html("Fetching Teams Please Wait");
  $.ajax({
    type: "get",
    url: apicallurl + "/messagemove/get/teams?cloudId=" + cId,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      console.log(data);
      let publicCount = 0;
      let privateCount = 0;

      for (let i = 0; i < data.length; i++) {
        let _data = data[i];

        if (_data?.privateChannel) {
          privateCount++;
        } else {
          publicCount++;
        }

        // <input type="checkbox" /></td>
        $("#teamsTableTBody").append(`
          <tr>
            <td style="width:30px;">
            <i class="lnil lnil-chevron-down-circle" style="color: #0062FF;cursor: pointer;" teamsid="${
              _data?.teamsId
            }" teamsname="${escapeSpecialChar(
          _data?.teamName
        )}" id="selectTeams"></i>
            <td title="${escapeSpecialChar(_data?.teamName)}">
            ${CFManageCloudAccountsAjaxCall.getMaxChars(
              escapeSpecialChar(_data?.teamName),
              25
            )}
            </td>
            <td>${_data?.privateChannel ? "Private" : "Public"}</td>
            <td>
              <span id="destTeamNameSpan" title="${escapeSpecialChar(
                _data?.teamName
              )}">
               ${CFManageCloudAccountsAjaxCall.getMaxChars(
                 escapeSpecialChar(_data?.teamName),
                 40
               )}
              </span>
              <i class="lnil lnil-pencil" id="destTeamEditTeamName" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i>
            </td>
          </tr>
          <tr id="teamsChannel${_data?.teamsId}" style="display:none">
            <td colspan="4" style="padding: 10px 50px;">
              <table>
                <thead style="background: #EEE;">
                  <th style="width:20px"><input type="checkbox" id="selectAllChannelsTeams" allteamid="${
                    _data?.teamsId
                  }" teamname="${escapeSpecialChar(
          _data?.teamName
        )}" teamnameselall="${escapeSpecialChar(_data?.teamName)}"/></th>
                  <th style="width:300px;" id="dstnTeamNameThead">
                    <span>Channel Name</span>
                  </th>
                  <th style="width:300px;" id="dstnChannelNameThead">
                    <span>Destination Channel Name</span>
                  </th>
                </thead>
                <tbody id="tbody${_data?.teamsId}">
                </tbody>
              </table>
            </td>
          </tr>
        `);
      }
      $("#displayFooterTextChannels")
        .find("#channelCntNewCount")
        .html(data?.length);
      $("#displayFooterTextChannels")
        .find("#publicCntNewCount")
        .html(publicCount);
      $("#displayFooterTextChannels")
        .find("#pvtDivNewCount")
        .html(privateCount);
      $("#CFShowLoading").hide();
      $("#loaderText").html("Please wait while loading...");
    },
    error: function (err) {
      alertError("Failed To Fetch Teams");
      $("#CFShowLoading").hide();
      $("#loaderText").html("Please wait while loading...");
    },
  });
}

$(document).on("click", "#selectTeams", function () {
  let teamId = $(this).attr("teamsid");
  let teamName = $(this).attr("teamsname");
  if ($(this).hasClass("lnil-chevron-down-circle")) {
    getTeamsChannels(teamId, teamName);
    $(this)
      .addClass("lnil-chevron-up-circle")
      .removeClass("lnil-chevron-down-circle");
  } else {
    $(this)
      .addClass("lnil-chevron-down-circle")
      .removeClass("lnil-chevron-up-circle");
    $('[id="teamsChannel' + teamId + '"]').css("display", "none");
  }
});

function getTeamsChannels(teamId, teamName) {
  $("#CFShowLoading").show();
  $("#loaderText").html("Fetching Teams Channels Please Wait");
  $.ajax({
    type: "get",
    url:
      apicallurl +
      "/messagemove/get/teams/channel?cloudId=" +
      localStorage.multiUsrSrcCldId +
      "&teamsId=" +
      teamId,
    async: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $('[id="teamsChannel' + teamId + '"]').css("display", "");
      $('[id="tbody' + teamId + '"]').html("");
      for (let i = 0; i < data.length; i++) {
        let _data = data[i];
        $('[id="tbody' + teamId + '"]').append(`
        <tr style="border-bottom: 1px solid #acacac1c;">
        <td style="width:20px;padding: 12px 15px">
          <input type="checkbox" srcchannelid="${
            _data?.id
          }" teamid="${teamId}" teamname="${escapeSpecialChar(
          teamName
        )}" dstnchannelname="${escapeSpecialChar(
          _data?.objectName
        )}" channelname="${escapeSpecialChar(
          _data?.objectName
        )}" workspacename="${
          localStorage.multiUsrSrcEmail.split("@")[1].split(".")[0]
        }" channeltype="${
          _data?.channelType
        }" name="channelSelect" fromteam="${escapeSpecialChar(
          teamName
        )}" forteamid="${teamId}"/>
        </td>
        <td style="width:300px;padding: 12px 15px;" title="${escapeSpecialChar(
          _data?.objectName
        )}">${CFManageCloudAccountsAjaxCall.getMaxChars(
          escapeSpecialChar(_data?.objectName),
          20
        )}</td>    
        <td style="width:300px;padding: 12px 15px;"> <span id="destTeamNameSpan" title="${escapeSpecialChar(
          _data?.objectName
        )}">
          ${CFManageCloudAccountsAjaxCall.getMaxChars(
            escapeSpecialChar(_data?.objectName),
            40
          )}
            </span>
            <i class="lnil lnil-pencil" id="destTeamEditChannels" style="font-weight: 600;font-size: 15px;float: right;margin-right: 15%;"></i>
            </td>    
            </tr>
            
            `);
      }
      $("#CFShowLoading").hide();
      $("#loaderText").html("Please wait while loading...");
    },
    error: function (err) {
      alertError("Failed to get teams channels...");
      $('[id="teamsChannel' + teamId + '"]').css("display", "none");
      $("#CFShowLoading").hide();
      $("#loaderText").html("Please wait while loading...");
    },
  });
}

$(document).on("click", "#selectAllChannelsTeams", function () {
  let teamId = $(this).attr("allteamid");
  if ($(this).is(":checked")) {
    $('[forteamid="' + teamId + '"]').prop("checked", true);
    $("#forNextMove").removeClass("disabled");
    $("#selDivNewChannelsCount").css("display", "");
    $("#newChannelsSelCount").text(
      $("input[name=channelSelect]:visible:checked").length
    );
  } else {
    $('[forteamid="' + teamId + '"]').prop("checked", false);
    $("#newChannelsSelCount").text(
      $("input[name=channelSelect]:visible:checked").length
    );
    if ($('[name="channelSelect"]:checked').length === 0) {
      $("#forNextMove").addClass("disabled");
    }
  }
});

$(document).on("click", "#destTeamEditTeamName", function () {
  $(this).hide();
  var textVal = $(this)
    .parents("tr")
    .children("td:eq(0)")
    .find("i")
    .attr("teamsid");
  var _thisBox = $(this).siblings("span#destTeamNameSpan");
  var user_name = _thisBox.attr("title").trim();
  var pl = /\</g;
  var pl1 = /\>/g;
  var pl2 = /\"/g;
  var pl3 = /\'/g;
  var userName = user_name
    .replace(pl, "&lt;")
    .replace(pl1, "&gt;")
    .replace(pl2, "&quot;")
    .replace(pl3, "&apos;");
  _thisBox
    .css("padding", "0")
    .css("background", "none")
    .css("margin-left", "0");
  _thisBox.html(
    "<span class='editUser custom-search-input' style='float: left;width: 65%;'><input class='form-control' type='text' name='destteamname' id='teamsTeamName' value='" +
      userName +
      "' autofocus /></span>"
  );
  $("#teamsTeamName").focus();

  $("input#teamsTeamName").keydown(function (event) {
    if (event.keyCode == 13) {
      var Updatedusername = $("#teamsTeamName").val();
      if (Updatedusername.length == 0) {
        alertError("Please provide valid input");
        _thisBox.text(user_name);
        _thisBox.siblings().show();
        $("#CFShowLoading").modal("hide");
      } else if (Updatedusername.length > 256) {
        $("#teamsTeamName").val(
          $("#teamsTeamName")
            .val()
            .substring(0, $(this).val().length - 1)
        );
        alertError("Destination channel name cannot exceed 50 characters");
      } else {
        $(this)
          .parents("tr")
          .children("td:first")
          .children("i")
          .attr("teamsname", Updatedusername);

        $('[forteamid="' + textVal + '"]').attr("teamname", Updatedusername);
        $(this)
          .parent()
          .parent("span#destTeamNameSpan")
          .attr("title", Updatedusername);
        Updatedusername = CFManageCloudAccountsAjaxCall.getMaxChars(
          Updatedusername,
          30
        );
        _thisBox.text(Updatedusername);
        userName = Updatedusername;
        _thisBox.siblings().show();
      }
    }
  });
  $("body").on("mouseup", function (e) {
    var container = _thisBox;
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      userName = CFManageCloudAccountsAjaxCall.getMaxChars(userName, 25);
      _thisBox.text(userName);
      _thisBox.siblings().show();
      $("body").off("mouseup");
    }
  });
});

$(document).on("click", "#destTeamEditChannels", function () {
  $(this).hide();
  var textVal = $(this).siblings("span#destTeamNameSpan").text();
  var _thisBox = $(this).siblings("span#destTeamNameSpan");
  var user_name = _thisBox.attr("title").trim();
  var pl = /\</g;
  var pl1 = /\>/g;
  var pl2 = /\"/g;
  var pl3 = /\'/g;
  var userName = user_name
    .replace(pl, "&lt;")
    .replace(pl1, "&gt;")
    .replace(pl2, "&quot;")
    .replace(pl3, "&apos;");
  _thisBox
    .css("padding", "0")
    .css("background", "none")
    .css("margin-left", "0");
  _thisBox.html(
    "<span class='editUser custom-search-input' style='float: left;width: 65%;'><input class='form-control' type='text' name='destteamname' id='channelsTeamName' value='" +
      userName +
      "' autofocus /></span>"
  );
  $("#channelsTeamName").focus();

  $("input#channelsTeamName").keydown(function (event) {
    if (event.keyCode == 13) {
      var Updatedusername = $("#channelsTeamName").val();
      if (Updatedusername.length == 0) {
        alertError("Please provide valid input");
        _thisBox.text(user_name);
        _thisBox.siblings().show();
        $("#CFShowLoading").modal("hide");
      } else if (Updatedusername.length > 50) {
        $("#channelsTeamName").val(
          $("#channelsTeamName")
            .val()
            .substring(0, $(this).val().length - 1)
        );
        alertError("Destination channel name cannot exceed 50 characters");
      } else {
        $(this)
          .parents("tr")
          .children("td:first")
          .children("input")
          .attr("dstnchannelname", Updatedusername);

        $(this)
          .parent()
          .parent("span#destTeamNameSpan")
          .attr("title", Updatedusername);
        Updatedusername = CFManageCloudAccountsAjaxCall.getMaxChars(
          Updatedusername,
          30
        );
        _thisBox.text(Updatedusername);
        userName = Updatedusername;
        _thisBox.siblings().show();
      }
    }
  });
  $("body").on("mouseup", function (e) {
    var container = _thisBox;
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      userName = CFManageCloudAccountsAjaxCall.getMaxChars(userName, 25);
      _thisBox.text(userName);
      _thisBox.siblings().show();
      $("body").off("mouseup");
    }
  });
});

$(document).on("input", "#channelsTeamName", function () {
  if ($(this).val().length > 50) {
    $(this).val(
      $(this)
        .val()
        .substring(0, $(this).val().length - 1)
    );
    alertError("Destination channel name cannot exceed 50 characters");
  }
});

$(document).on("input", "#teamsTeamName", function () {
  if ($(this).val().length > 256) {
    $(this).val(
      $(this)
        .val()
        .substring(0, $(this).val().length - 1)
    );
    alertError("Destination Team name cannot exceed 256 characters");
  }
});

$(document).on("click", '[name="messageSelect"]', function () {
  if ($('[name="messageSelect"]:checked').length > 0) {
    $("#totalSelectedDM").css("display", "");
  } else {
    $("#totalSelectedDM").css("display", "none");
  }
  $("#counttotalSelectedDM").html(
    $('[name="messageSelect"]:visible:checked').length
  );
  if (
    $('[name="messageSelect"]').length ===
    $('[name="messageSelect"]:checked').length
  ) {
    $('[id="selectAllMsgs"]').prop("checked", true);
  } else {
    $('[id="selectAllMsgs"]').prop("checked", false);
  }
});

$(document).on("click", '[name="channelSelect"]', function () {
  if (
    $('[name="channelSelect"]').length ===
    $('[name="channelSelect"]:checked').length
  ) {
    $('[id="selectAllChannels"]').prop("checked", true);
  } else {
    $('[id="selectAllChannels"]').prop("checked", false);
  }
});

$(document).on("click", '[name="selectSrcUsers"]', function () {
  if (
    $('[name="selectSrcUsers"]').length ===
    $('[name="selectSrcUsers"]:checked').length
  ) {
    $('[name="selectAllSrcUsers"]').prop("checked", true);
  } else {
    $('[name="selectAllSrcUsers"]').prop("checked", false);
  }
});

$(document).on("click", '[name="selectDstnUsers"]', function () {
  if (
    $('[name="selectDstnUsers"]').length ===
    $('[name="selectDstnUsers"]:checked').length
  ) {
    $('[name="selectAllDstnUsers"]').prop("checked", true);
  } else {
    $('[name="selectAllDstnUsers"]').prop("checked", false);
  }
});

$("#privateChannelsTab").click(function () {
  $("#migrateAsTableHead").css("display", "none");
  $(".filterTable").css("display", "none");
  $(".filterUserTable").css("display", "none");
  $("#channelSearch").removeClass("fa-times");
  $("#slackUserDiv").css("display", "none");
  $("#usrSeach").css("display", "none");
  $("#chnlSrch").css("display", "");
  $("#selDiv").css("display", "none");
  $("#syncChannels").css("display", "");
  $("#usrMapping").css("display", "none");
  $("#privateUsers").css("display", "none");
  $("#channelsTable").css("display", "");
  $("#usersTable").css("display", "none");
  $("#automapBtn").css("display", "none");
  $("#migrateBtn").css("display", "");
  $(".searchTextBox").attr("placeholder", "Enter Channel Name");
  $("#channelCnt").text("Channels : ");
  $("#pubDiv").text("Public : ");
  $("#pvtDiv").text("Private : ");
  $("#displayUserProgressBar").css("display", "none");
  $("#displayFooterText").css("display", "flex");
  $("#displayFooterText").css("margin-top", "1.5%");
  pageNumb = 1;
  localStorage.setItem("isPrivateChannelMigration", false);
  localStorage.setItem("userTableStatus", "NO");
  $("#startPrivateChannels").css({ "pointer-events": "auto", opacity: "1" });
  //if(localStorage.isChannelsTabClicked === undefined){
  localStorage.removeItem("ChannelsFetchedList");
  if (
    $("#channelsTab").hasClass("active") ||
    $("#usersTab").hasClass("active") ||
    $("#authenticateUsersTabSlack").hasClass("active") ||
    $("#authenticateUsersSrcTabSlack").hasClass("active") ||
    $("#privateChannelsTab").hasClass("active")
  ) {
    $("#publicCntNewCount").text(0);
    $("#pvtDivNewCount").text(0);
    $(".fa-check-circle.public").css("display", "none");
    $(".fa-check-circle.private").css("display", "none");
    $(".fa-check-circle.all").css("display", "");
    if (
      localStorage.selSourceCloud === "MICROSOFT_TEAMS" &&
      localStorage.selDstnCloud === "MICROSOFT_TEAMS"
    ) {
      $("#channelsTable").css("display", "none");
      $("#teamsTable").css("display", "");
      $("#displayFooterTextChannels").find("#channelCntNew").html("Teams :");
      $("#onlyForChannels").css("display", "none");
      $("#syncChannels").css("display", "none");
      $(".filterTable").attr("placeholder", "Enter Team Name");
      getTeams(localStorage.multiUsrSrcCldId);
    } else {
      $("#onlyForChannels").css("display", "");
      $(".filterTable").attr("placeholder", "Enter Channel Name");
      $("#syncChannels").css("display", "");
      // getprovisionedUsersForChannels(1);
      $("#displayFooterTextChannels").find("#channelsTable").css("display", "");
      $("#teamsTable").css("display", "none");
      $("#channelCntNew").html("Channesl :");
      if (
        localStorage.selDstnCloud === "SLACK" &&
        localStorage.selSourceCloud === "SLACK"
      ) {
        $("#migrateAsTableHead").css("display", "none");
      } else {
        // $("#migrateAsTableHead").css("display", "");
      }
      slackChannels(localStorage.multiUsrSrcCldId, "private");
    }
  }
  //}else{
  //fetchCacheChannels(JSON.parse(localStorage.ChannelsFetchedList))
  //}
  $("#displayFooterTextChannels").css("display", "flex");
  $("#displayFooterTextUsersMapping").css("display", "none");
  $("#displayFooterText").css("display", "none");
  // localStorage.setItem("isChannelsTabClicked", true);
  $(this).addClass("active");
  $(this).siblings("li").removeClass("active");
  $(".privateChannels").css("display", "none");
  // $("#onlyForChannels").css("display", "");
  $(".privateChannels").parent().css("margin-bottom", "1%");
  $("#selectAllChannels").prop("checked", false);
});

$("#searchApiUsers").click(function () {
  searchUserData();
});

function searchUserData() {
  $("#CFShowLoading").css("display", "");
  $("#loaderText").html("Searching for the user please wait");
  $("#displayFooterTextUsersMapping").css("visibility", "hidden");
  userMappingSearchRequest = $.ajax({
    type: "POST",
    url:
      apicallurl +
      "/messagemove/get/user/pair?sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&email=" +
      $(".filterUserTable").val(),
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if (data) {
        $("#CFShowLoading").css("display", "none");
        $("#loaderText").html("Please wait while loading...");
        let imgSrc, imgDstn, srcCloudStatus;
        if (data?.destCloudDetails?.name === "SLACK") {
          imgDstn =
            '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
        } else {
          imgDstn =
            '<img src="../img/PNG/MICROSOFT_TEAMS1.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
        }
        if (data?.sourceCloudDetails?.name === "SLACK") {
          imgSrc =
            '<svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg>';
        } else {
          imgSrc =
            '<img src="../img/PNG/MICROSOFT_TEAMS1.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;">';
        }
        if (data?.sourceCloudDetails?.cloudStatus) {
          if (data?.sourceCloudDetails?.cloudStatus === "ACTIVE") {
            srcCloudStatus = "Active";
          } else {
            srcCloudStatus = "In-Active";
          }
        } else {
          srcCloudStatus = "-";
        }
        if (data.sourceCloudDetails != null && data.destCloudDetails != null) {
          pushFromCloudToCloud(
            data.sourceCloudDetails.id,
            data.destCloudDetails.id
          );
          pubCount++;
          var _html =
            '<tr data-attr="matchedUserPairs"><td style="padding-left: 4%;width: 40%;">' +
            imgSrc +
            '<span style="vertical-align: -webkit-baseline-middle;">' +
            data.sourceCloudDetails.emailId +
            "</span></td>" +
            "<td>" +
            srcCloudStatus +
            '</td><td style="">' +
            imgDstn +
            data.destCloudDetails.emailId +
            "</span></td></tr>";
        } else if (
          data.sourceCloudDetails == null &&
          data.destCloudDetails != null
        ) {
          pvtCount++;
          var _html =
            '<tr><td style="padding-left: 4%;width: 40%;"><span>-</span></td><td>' +
            srcCloudStatus +
            '</td><td style="">' +
            imgDstn +
            '<span style="vertical-align: -webkit-baseline-middle;">' +
            data.destCloudDetails.emailId +
            "</span></td></tr>";
        } else if (
          data.sourceCloudDetails != null &&
          data.destCloudDetails == null
        ) {
          pvtCount++;
          var _html =
            '<tr><td style="padding-left: 4%;width: 40%;">' +
            imgSrc +
            '<span style="vertical-align: -webkit-baseline-middle;">' +
            data.sourceCloudDetails.emailId +
            "</span></td><td>" +
            srcCloudStatus +
            "</td><td><span>-</span></td></tr>";
        }
        $("#usersTable table tbody").html(_html);
      } else {
        alertError("No user found");
      }
    },
    error: function (err) {
      console.log(err);
      $("#CFShowLoading").css("display", "none");
      $("#loaderText").html("Please wait while loading...");
      if (err?.statusText !== "abort") {
        alertError("No user found");
      }
    },
  });
}

function getTotalUsersCount(from) {
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/provision/count?sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (data) {
      if ($("#srcUsersTab").hasClass("active")) {
        $("#mappingDirectMsgs #mapCount").text(data?.totalSlackCount);
        $("#mappingDirectMsgs #pubCount")
          .css("display", "")
          .text(data?.slackProvisionedCount);
        $("#mappingDirectMsgs #pvtCount")
          .css("display", "")
          .text(data?.slackEmailSentCount);
        appendAuthPages(Math.ceil(data?.totalSlackCount / 200));
        localStorage.setItem("getTotalSlackUsersCount", data?.totalSlackCount);
      } else {
        $("#mappingDirectMsgs #mapCount").text(data?.totalTeamsCount);
        $("#mappingDirectMsgs #pubCount")
          .css("display", "")
          .text(data?.teamsProvisionedCount);
        $("#mappingDirectMsgs #pvtCount")
          .css("display", "")
          .text(data?.teamsEmailSentCount);
        appendAuthPages(Math.ceil(data?.totalTeamsCount / 200));

        localStorage.setItem("getTotalTeamsUsersCount", data?.totalTeamsCount);
      }
      getSlackSrcUsers(1);
    },
  });
}

function appendAuthPages(totalPages) {
  $("#changePaginationAuth").html("");
  for (let i = 1; i <= totalPages; i++) {
    $("#changePaginationAuth").append(`
      <option value="${i}">${i}</option>
    `);
  }
}

$("#changePaginationAuth").on("change", function () {
  let pageNo = $(this).val();
  getSlackSrcUsers(pageNo);
});

function getSlackSrcUsersSearch() {
  let searchInp;
  if ($("#srcUsersTab").hasClass("active")) {
    var adminId = localStorage.multiUsrSrcCldId;
    searchInp = $('[class="sourceUserTable"]').val();
  } else {
    var adminId = localStorage.multiUsrDstnCldId;
    searchInp = $('[class="destinationUserTable"]').val();
  }

  let pageSize = 2;

  $("#dmContent").css("display", "none");
  userAuthSearchRequest = $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/messagemove/get/provision/pair?adminCloudId=" +
      adminId +
      "&sourceAdminCloudId=" +
      localStorage.multiUsrSrcCldId +
      "&destAdminCloudId=" +
      localStorage.multiUsrDstnCldId +
      "&email=" +
      searchInp,
    async: false,
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#footerValues").css("display", "inline-flex");
      $("#footerValues").find("#channelCnt").css("display", "");

      if ($("#srcUsersTab").hasClass("active")) {
        $("#srcUsrsTable table tbody").html("");
        if (data.provisioned == true) {
          pubCount++;
          var _html =
            '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input disabled type="checkbox" name="selectSrcUsers" id="' +
            data.id +
            '" adminid="' +
            data.adminCloudId +
            '" cloudid="' +
            data.cloudId +
            '" provisioned="' +
            data.provisioned +
            '" emailsent="' +
            data.emailSent +
            '" userid="' +
            data.userId +
            '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
            data.emailId +
            "</span></td><td>Authenticated</td></tr>";
        } else {
          if (data.emailSent == false) {
            var _html =
              '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectSrcUsers" id="' +
              data.id +
              '" adminid="' +
              data.adminCloudId +
              '" cloudid="' +
              data.cloudId +
              '" provisioned="' +
              data.provisioned +
              '" emailsent="' +
              data.emailSent +
              '" userid="' +
              data.userId +
              '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
              data.emailId +
              "</span></td><td>Not Authenticated</td></tr>";
          } else {
            pvtCount++;
            var _html =
              '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectSrcUsers" id="' +
              data.id +
              '" adminid="' +
              data.adminCloudId +
              '" cloudid="' +
              data.cloudId +
              '" provisioned="' +
              data.provisioned +
              '" emailsent="' +
              data.emailSent +
              '" userid="' +
              data.userId +
              '"></td><td><svg xmlns="http://www.w3.org/2000/svg"  style="margin-right: 2%;vertical-align: -webkit-baseline-middle;" class="icon" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#4A144B" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM529 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V311.4zM361.5 580.2c0 27.8-22.5 50.4-50.3 50.4-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h50.3v50.4zm134 134.4c0 27.8-22.5 50.4-50.3 50.4-27.8 0-50.3-22.6-50.3-50.4V580.2c0-27.8 22.5-50.4 50.3-50.4 13.3 0 26.1 5.3 35.6 14.8s14.7 22.3 14.7 35.6v134.4zm-50.2-218.4h-134c-27.8 0-50.3-22.6-50.3-50.4 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4-.1 27.9-22.6 50.4-50.3 50.4zm0-134.4c-13.3 0-26.1-5.3-35.6-14.8S395 324.8 395 311.4c0-27.8 22.5-50.4 50.3-50.4 27.8 0 50.3 22.6 50.3 50.4v50.4h-50.3zm134 403.2c-27.8 0-50.3-22.6-50.3-50.4v-50.4h50.3c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm134-134.4h-134c-13.3 0-26.1-5.3-35.6-14.8-9.4-9.5-14.7-22.3-14.7-35.6 0-27.8 22.5-50.4 50.3-50.4h134c27.8 0 50.3 22.6 50.3 50.4 0 27.8-22.5 50.4-50.3 50.4zm0-134.4H663v-50.4c0-27.8 22.5-50.4 50.3-50.4s50.3 22.6 50.3 50.4c0 27.8-22.5 50.4-50.3 50.4z"/></svg><span style="vertical-align: -webkit-baseline-middle;">' +
              data.emailId +
              '</span></td><td>Email Sent <a href="#" id="resendCode" cldname="' +
              data.cloudName +
              '">Resend Code</a></td></tr>';
          }
        }

        $("#srcUsrsTable table tbody").html(_html);
      } else {
        $("#dstnUsrsTable table tbody").html("");
        if (data.provisioned == true) {
          pubCount++;
          var _html =
            '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input disabled type="checkbox" name="selectDstnUsers" id="' +
            data.id +
            '" adminid="' +
            data.adminCloudId +
            '" cloudid="' +
            data.cloudId +
            '" provisioned="' +
            data.provisioned +
            '" emailsent="' +
            data.emailSent +
            '" userid="' +
            data.userId +
            '"></td><td><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">' +
            data.emailId +
            "</span></td><td>Authenticated</td></tr>";
        } else {
          if (data.emailSent == false) {
            var _html =
              '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectDstnUsers" id="' +
              data.id +
              '" adminid="' +
              data.adminCloudId +
              '" cloudid="' +
              data.cloudId +
              '" provisioned="' +
              data.provisioned +
              '" emailsent="' +
              data.emailSent +
              '" userid="' +
              data.userId +
              '"></td><td><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">' +
              data.emailId +
              "</span></td><td>Not Authenticated</td></tr>";
          } else {
            pvtCount++;
            var _html =
              '<tr><td style="padding-left: 3%;vertical-align: middle;padding-top: 1%;"><input type="checkbox" name="selectDstnUsers" id="' +
              data.id +
              '" adminid="' +
              data.adminCloudId +
              '" cloudid="' +
              data.cloudId +
              '" provisioned="' +
              data.provisioned +
              '" emailsent="' +
              data.emailSent +
              '" userid="' +
              data.userId +
              '"></td><td><img src="../img/PNG/MICROSOFT_TEAMS.png" style="height: 20px;width: 20px;vertical-align: -webkit-baseline-middle;margin-right: 2%;"><span style="vertical-align: -webkit-baseline-middle;">' +
              data.emailId +
              '</span></td><td>Email Sent <a href="#" id="resendCode" cldname="' +
              data.cloudName +
              '">Resend Code</a></td></tr>';
          }

          $("#dstnUsrsTable table tbody").html(_html);
        }
      }
      setTimeout(function () {
        $("#CFShowLoading").hide();
      }, 1000);
    },
  });
}

function cancelRequest(at) {
  $("#CFShowLoading").hide();
  if (at === "usersMapping") {
    if (usersMappingRequest) {
      usersMappingRequest.abort();
      console.log("usersMapping Request Cancelled Successfully");
    }
  } else if (at === "channelsMapping") {
    if (channelsMappingRequest) {
      channelsMappingRequest.abort();
      console.log("channelsMapping Request Cancelled Successfully");
    }
  } else if (at === "searchUserMapping") {
    if (userMappingSearchRequest) {
      userMappingSearchRequest.abort();
      console.log("channelsMapping Request Cancelled Successfully");
    } else {
      console.error("Failed to abort the channelsMapping Request");
    }
  } else if (at === "userAuthSearch") {
    if (userAuthSearchRequest) {
      userAuthSearchRequest.abort();
      console.log("User Auth Search Requested Aborted Successfully");
    }
  }
}
