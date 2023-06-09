let workSpaceFileFolderEmailRequest, selectedEmailMappings;
var jobStatus = {
  PAUSE: "Pause",
  STARTED: "Started",
  CANCEL: "Canceled",
  CONFLICT: "Conflict",
  SUSPENDED: "Suspended",
  PROCESSED: "Processed",
  COMPLETED: "Completed",
  NOT_STARTED: "In Queue",
  IN_PROGRESS: "In Progress",
  NOT_PROCESSED: "Not Processed",
  PARTIALLY_COMPLETED: "Partially Completed",
  MULTIUSERTRAIL_COMPLETED: "Trial Completed",
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

$("#forNextMove").click(function () {
  $(".ui-helper-hidden-accessible").hide();
  $("#forPreviousMove").removeClass("disabled");
  //    $("#forNextMove").addClass("disabled");
  var _step = parseInt($("#forNextMove").attr("data-step"));
  _step = _step + 1;
  if (_step == 0) return false;
  else if (_step == 1) {
    $("#srcUsrs .custom-search-input input").val("");
    $("#mapdUsrs .custom-search-input input").val("");
    $("#dstnUsrs .custom-search-input input").val("");
    $("#forPreviousMove").addClass("disabled");
    $("#mappingClouds").css("display", "");
    $("#emailMapping").css("display", "none");
    $("#emailOptions").css("display", "none");
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
    $("#mappingClouds").css("display", "none");
    $("#emailMapping").css("display", "flex");
    $("#emailOptions").css("display", "none");
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    localStorage.setItem(
      "selSourceName",
      $("#srcClouds input[name=sourceCloud]:checked").attr("cloudname")
    );
    localStorage.setItem(
      "selDstnName",
      $("#dstClouds input[name=dstCloud]:checked").attr("cloudname")
    );
    localStorage.setItem(
      "selSourceId",
      $("#srcClouds input[name=sourceCloud]:checked").attr("id")
    );
    localStorage.setItem(
      "selDstnId",
      $("#dstClouds input[name=dstCloud]:checked").attr("id")
    );
    localStorage.setItem(
      "selDstnEmail",
      $("#dstClouds input[name=dstCloud]:checked").attr("mail")
    );
    localStorage.setItem(
      "selSourceEmail",
      $("#srcClouds input[name=sourceCloud]:checked").attr("mail")
    );

    localStorage.setItem(
      "selDstnAdminId",
      $("#dstClouds input[name=dstCloud]:checked").attr("adminmemberid")
    );
    localStorage.setItem(
      "selSourceAdminId",
      $("#srcClouds input[name=sourceCloud]:checked").attr("adminmemberid")
    );

    localStorage.setItem(
      "totalDstnClouds",
      $("#dstClouds input[name=dstCloud]:checked").attr("totalclouds")
    );
    localStorage.setItem(
      "totalSrcClouds",
      $("#srcClouds input[name=sourceCloud]:checked").attr("totalclouds")
    );
    getEmailMappings(0, 20);
    $("#forNextMove").addClass("disabled");
  } else if (_step == 3) {
    $("#forNextMove").css({ width: "auto" });
    $("#forNextMove span").text("Start Migration");
    $("#mappingClouds").css("display", "none");
    $("#teamMigrationWidget ul li[data-val=" + (_step - 1) + "]")
      .removeClass("active")
      .addClass("completed");
    $("#forNextMove").attr("data-step", _step);
    $("#forPreviousMove").attr("data-prev", _step);
    $("#teamMigrationWidget ul li[data-val=" + _step + "]").addClass("active");
    // $("#forNextMove").addClass("disabled");
    //$("#forNextMove").css({"width": "140px", "margin-left": "90%"});
    // $("#forNextMove span").text("Next");
    $("#mappingClouds").css("display", "none");
    $("#emailMapping").css("display", "none");
    $("#emailOptions").css("display", "");
  } else if (_step == 4) {
    migrateEmails();
  } else {
    console.log("Not a valied step");
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
    $("#emailMapping").css("display", "none");
    $("#emailOptions").css("display", "");
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

$("#emailBatchesTab").click(function () {
  $(this).addClass("active");
  $("#emailMappingTab").removeClass("active");
  $("#emailBatchesTab_Content").css("display", "");
  $("#emailMappingTab_Content").css("display", "none");
});

$("#emailMappingTab").click(function () {
  $(this).addClass("active");
  $("#emailBatchesTab").removeClass("active");
  $("#emailMappingTab_Content").css("display", "");
  $("#emailBatchesTab_Content").css("display", "none");
});

$("#createBatchCta").click(function () {
  getExistingBatches(0, 50);
  $("#modalBatchCreate").css("display", "flex");
});

$("#closeBatchModal").click(function () {
  $("#modalBatchCreate").css("display", "none");
});

$(".showUsers").click(function () {
  if ($("#hideToDisplay").is(":visible")) {
    $("#hideToDisplay").css("display", "none");
    $(this).html("&gt;");
  } else {
    $("#hideToDisplay").css("display", "");
    $(this).html("&times");
  }
});

$('[id="removeUserFromTheBatch"]').click(function () {
  // alert();
  $(this).parent().parent().remove();
});

$("#navToBatchUsers").click(function () {
  // alert();
  $(".selectedBatch").html(`
    <span>&nbsp;&nbsp;>&nbsp;&nbsp;</span>
    <span>${$(this).attr("title")}</span>
  `);
  $("#batchUsersDiv").css("display", "");
  $(".emailBatchesTable").css("display", "none");
});

$("#goToParentBatch").click(function () {
  $(".selectedBatch").html("");
  $("#batchUsersDiv").css("display", "none");
  $(".emailBatchesTable").css("display", "");
});

function getEmailToken() {
  if (localStorage.emailToken) {
    return localStorage.emailToken;
  } else {
    $.ajax({
      type: "POST",
      url: apicallurl + "/mail/login",
      async: true,
      headers: {
        Authorization: localStorage.UserAuthDetails,
      },
      success: function (res) {
        localStorage.setItem("emailToken", res);
        return localStorage.emailToken;
      },
    });
  }
}

$(document).ready(function () {
  $.ajax({
    type: "POST",
    url: apicallurl + "/mail/register",
    async: false,
    headers: {
      Authorization: localStorage.UserAuthDetails,
    },
    success: function (res) {
      localStorage.setItem("emailToken", res);
      return localStorage.emailToken;
    },
  });
});

function getEmailMappings(pageNo, pageSize) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 0;
  }
  if (pageSize) {
    pageSize = pageSize;
  } else {
    pageSize = 20;
  }

  $("#emailMappingsTableBody").html("");
  if (pageNo === 0) {
    let totalPages =
      Math.ceil(Number(localStorage.totalSrcClouds) / pageSize) - 1;
    appendUserMappingPagination(totalPages);
  }
  $("#showCountValue").html(
    `Showing ${pageNo} of ${
      Math.ceil(Number(localStorage.totalSrcClouds) / pageSize) - 1
    } Page`
  );
  $.ajax({
    type: "GET",
    url: `${apicallurl}/mail/users/mapping/${localStorage.selSourceId}/${
      localStorage.selDstnId
    }?pageNo=${pageNo * 20}&pageSize=${pageSize}`,
    async: true,
    headers: {
      Authorization: getEmailToken(),
    },
    success: function (res, textStatus, xhr) {
      console.log(xhr.getAllResponseHeaders());
      let _res = JSON.parse(res);
      appendEmailMappings(_res, pageNo, pageSize, "autoMap");
    },
    completed: function (xhr) {
      console.log(xhr);
    },
  });
}

function appendUserMappingPagination(totalPages) {
  $("#paginateMappingUsers").html("");
  for (let i = 0; i <= totalPages; i++) {
    $("#paginateMappingUsers").append(`
      <option value="${i}">${i}</option>
    `);
  }
}

$("#paginateMappingUsers").on("change", function () {
  let pageNo = $(this).val();
  getEmailMappings(pageNo, 20);
});

// toCloudId: {
//   id: $(this).attr("fromcloudid"),
// },
// fromCloudId: {
//   id: $(this).attr("fromcloudid"),
// },
// metadata: true,
function migrateEmails() {
  let selectedMappings = [];
  let isDeltatMigration;
  if ($("#jobTypeEmailOptions").val() === "oneTime") {
    isDeltatMigration = false;
  } else {
    isDeltatMigration = true;
  }
  $.each($('[id="selMailMappings"]:checked'), function () {
    let mapping = {
      fromCloudName: localStorage.selSourceName,
      toCloudName: localStorage.selDstnName,
      toMailId: $(this).attr("tomailid"),
      fromMailId: $(this).attr("fromemailid"),
      ownerEmailId: JSON.parse(localStorage.CFUser).userName,
      fromRootId: $(this).attr("srcpath"),
      toRootId: $(this).attr("dstnpath"),
      deltaMigration: isDeltatMigration,
    };
    selectedMappings.push(mapping);
    console.log(mapping);
  });
  $.ajax({
    type: "POST",
    // url: apicallurl + "/mail/move/initiate",
    async: true,
    data: JSON.stringify(selectedMappings),
    headers: {
      Authorization: getEmailToken(),
      "Content-Type": "application/json",
    },
    success: function (data) {
      alertSuccess("Migration Initiated Successfully");
      setTimeout(function () {
        // window.location.href = "reports.html#email";
      }, 1000);
    },
    error: function (err) {
      alertError("Failed To Initiate Migration");
    },
  });
}

$(document).on("click", "#selMailMappings", function () {
  if ($('[id="selMailMappings"]:checked').length > 0) {
    $("#forNextMove").removeClass("disabled");
    $("#createBatchCta").css("display", "flex");
  } else {
    $("#createBatchCta").css("display", "none");
    $("#forNextMove").addClass("disabled");
  }
});

$("#upldMappingCsv").click(function () {
  $("#usersEmailMappingsCsv").click();
});

function uploadUserMappingCsv() {
  var upload = document.getElementById("usersEmailMappingsCsv").files[0];
  var reader = new FileReader();
  reader.onload = function () {
    csvMappingsUploadEmail(reader.result);
  };
  reader.readAsText(upload);
  // localStorage.selSourceAdminId
  // localStorage.selDstnAdminId
}

function csvMappingsUploadEmail(csvStream) {
  $.ajax({
    type: "POST",
    url:
      domainUrl +
      "email/user/csv/" +
      localStorage.selSourceId +
      "/" +
      localStorage.selDstnId,
    data: csvStream,
    headers: {
      "Content-Type": "application/json",
      Authorization: getEmailToken(),
    },
    success: function (data) {
      console.log(data);
      if (data?.body) {
        $("#emailMappingsTableBody").html("");
        appendEmailMappings(data?.body, 1, 500, "CSV");
        downloadValidatedCSV(data?.body[0].csvId);
      }

      // csvMappingsValidateEmail(0, 50);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function csvMappingsValidateEmail(pageNo, pageSize) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 0;
  }
  if (pageSize) {
    pageSize = pageSize;
  } else {
    pageSize = 50;
  }

  if (pageNo === 0) {
    $("#emailMappingsTableBody").html("");
  }
  $.ajax({
    type: "GET",
    url:
      domainUrl +
      "email/user/csv/" +
      localStorage.selSourceId +
      "/" +
      localStorage.selDstnId +
      "?pageNo=" +
      pageNo +
      "&pageSize=" +
      pageSize,
    headers: {
      "Content-Type": "application/json",
      Authorization: getEmailToken(),
    },
    success: function (data) {
      console.log(data);
      appendEmailMappings(data, pageNo, pageSize, "CSV");
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// https://staging.cloudfuze.com/email/move/batches     POST
// https://staging.cloudfuze.com/email/user/batches/all GET

function appendEmailMappings(mappingList, pageNo, pageSize, from) {
  for (let i = 0; i < mappingList?.length; i++) {
    let data = mappingList[i];
    let mappingObject = encodeURIComponent(JSON.stringify(data));
    // console.log(data);
    let srcPathDisplay = "",
      dstnPathDisplay = "";
    if (from !== "autoMap") {
      if (data?.fromMailFolder) {
        srcPathDisplay = `<span style="color: #acacac">/${
          data?.fromMailFolder !== "/" ? data?.fromMailFolder : ""
        }</span>`;
      } else {
        srcPathDisplay = "";
      }

      if (data?.toMailFolder) {
        dstnPathDisplay = `<span style="color: #acacac">/${
          data?.toMailFolder !== "/" ? data?.toMailFolder : ""
        }</span>`;
      } else {
        dstnPathDisplay = "";
      }
    }
    if (data?.toMailId && data?.fromMailId) {
      $("#emailMappingsTableBody").append(`
      <tr matched="${data?.matched}">
        <td><input type="checkbox" mappingObject="${mappingObject}" tocloudid="${
        data?.toCloudId
      }" fromcloudid="${data?.fromCloudId}" tomailid="${
        data?.toMailId
      }" fromemailid="${data?.fromMailId}" srcpath="${
        data?.fromMailFolder ? data?.fromMailFolder : "/"
      }" dstnpath="${
        data?.toMailFolder ? data?.toMailFolder : "/"
      }" id="selMailMappings"/></td>
        <td title="${data?.fromMailId}">
      <div style="display: flex;flex-direction: column;">
        <span>${CFManageCloudAccountsAjaxCall.getMaxChars(
          data?.fromMailId,
          40
        )}</span>
        ${srcPathDisplay}
      </div>
      </td>
        <td title="${data?.toMailId}">
        <div style="display: flex;flex-direction: column;">
          <span>${CFManageCloudAccountsAjaxCall.getMaxChars(
            data?.toMailId,
            40
          )}</span>
          ${dstnPathDisplay}
        </div>
        </td>
        <td>Mapped</td>
        <td></td>
        <td></td>
      </tr>
    `);
    } else {
      $("#emailMappingsTableBody").append(`
      <tr matched="${data?.matched}">
        <td><input type="checkbox" mappingObject="${mappingObject}" tocloudid="${
        data?.toCloudId
      }" fromcloudid="${data?.fromCloudId}" tomailid="${
        data?.toMailId
      }" fromemailid="${data?.fromMailId}" 
      srcpath="${
        data?.fromMailFolder ? data?.fromMailFolder : "/"
      }" dstnpath="${data?.toMailFolder ? data?.toMailFolder : "/"}"
      id="selMailMappings" disabled="true"/></td>
        <td title="${
          data?.fromMailId
            ? CFManageCloudAccountsAjaxCall.getMaxChars(data?.fromMailId, 40)
            : "-"
        }">${data?.fromMailId ? data?.fromMailId : "-"}</td>
        <td title="${
          data?.toMailId
            ? CFManageCloudAccountsAjaxCall.getMaxChars(data?.toMailId, 40)
            : "-"
        }">${data?.toMailId ? data?.toMailId : "-"}</td>
        <td>UnMapped</td>
        <td></td>
        <td></td>
      </tr>
    `);
    }
  }

  $("#totalMappingsCount").html($("#emailMappingsTableBody tr").length);
  $("#totalMatchedMappingsCount").html($('[matched="true"]').length);
  $("#totalUnMatchedMappingsCount").html($('[matched="false"]').length);
  if (from === "autoMap") {
    if (mappingList.length === pageSize) {
      // getEmailMappings(pageNo + 1 * pageSize, pageSize);
    }
  }
}

function getExistingBatches(pageNo, pageSize) {
  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 0;
  }
  if (pageSize) {
    pageSize = pageSize;
  } else {
    pageSize = 50;
  }
  if (pageNo === 0) {
    $(".selectExistBatch").html(`
    <option>Select Batch</option>
    `);
  }
  $.ajax({
    type: "GET",
    url:
      domainUrl +
      "email/user/batches/all?pageNo=" +
      pageNo +
      "&pageSize=" +
      pageSize,
    headers: {
      Authorization: getEmailToken(),
    },
    success: function (data) {
      if (data?.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let _data = data[i];
          $(".selectExistBatch").append(`
            <option value="${_data?.batchId}">${_data?.batchName}</option>
          `);
        }
      }
    },
    error: function (err) {},
  });
}

$("#addNewBatchCTA").click(function () {
  let batchName = $("#newBatchName").val();
  alertSuccess("Started Creating Batch");
  if ($("#newBatchName").val() === "") {
    alertError("Please Enter Batch Name...");
  } else {
    let selectedBatches = [];
    $.each($('[id="selMailMappings"]:checked'), function () {
      selectedBatches.push(
        JSON.parse(decodeURIComponent($(this).attr("mappingobject")))
      );
    });
    $.ajax({
      type: "POST",
      url: domainUrl + "email/move/batches?batch=" + batchName,
      data: JSON.stringify(selectedBatches),
      headers: {
        "Content-Type": "application/json",
        Authorization: getEmailToken(),
      },
      success: function (data) {
        console.log(data);
        $("#modalBatchCreate").css("display", "none");
        alertSuccess("Batch Created Successfully");
      },
      error: function (err) {
        console.log(err);
        alertSuccess("Failed to Create Batch");
        $("#modalBatchCreate").css("display", "none");
      },
    });
  }
});

function getEmailReports() {
  $("#CFShowLoading").show();
  $.ajax({
    type: "GET",
    url: apicallurl + "/mail/reports",
    async: true,
    headers: {
      Authorization: getEmailToken(),
    },
    success: function (data) {
      $(".emailJobsContainer").css("display", "");
      $(".emailWorkSpacesContainer").css("display", "none");
      $("#backToJobs").css("display", "none");
      $("#emailMigrationOneTime").css("display", "");
      $("#emailMigrationOneDelta").css("display", "");
      $(".emailWorkspacesFolders").css("display", "none");
      $(".emailJobsContainer").html("");
      let res = JSON.parse(data);
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        let _data = res[i];
        $(".emailJobsContainer").append(`
            <div class="emailJobDiv">
                      <div class="fixedJobNameDiv" title="${
                        _data?.jobName
                      }" jobid="${_data?.id}" id="goToWorkSpaces">
                        ${_data?.jobName}
                      </div>
                      <div class="placeEmailJobdata">
                        <div class="fromEmailMigrationJob">
                          <div class="imageWrapEmail">
                            <img src="../img/outlook.png" style="width: 20px">
                          </div>
                          <div class="emailWrapperDiv" title="${
                            _data?.fromMailId
                          }">
                            ${_data?.fromMailId}
                          </div>
                        </div>
                        <div class="fromEmailMigrationJob">
                          <div class="imageWrapEmail">
                            <img src="../img/outlook.png" style="width: 20px">
                          </div>
                          <div class="emailWrapperDiv" title="${
                            _data?.toMailId
                          }">
                          ${_data?.toMailId}
                          </div>
                        </div>
                        <div id="reportsStatusForEmail">
                          <span class="span-${_data?.processStaus}">
                            ${jobStatus[_data?.processStaus]}
                          </span>
                        </div>
                      </div>
        </div>
        `);
        $("#CFShowLoading").hide();
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
}

$(document).on("click", '[id="goToWorkSpaces"]', function () {
  let jobId = $(this).attr("jobid");
  let jobName = $(this).attr("title");
  $("#CFShowLoading").show();
  $.ajax({
    type: "GET",
    url: apicallurl + "/mail/reports/" + jobId,
    async: true,
    headers: {
      Authorization: getEmailToken(),
    },
    success: function (data) {
      $(".emailJobsContainer").css("display", "none");
      $(".emailWorkSpacesContainer").css("display", "");
      $("#backToJobs").css("display", "flex");
      $(".emailWorkspacesFolders").css("display", "none");
      $("#emailMigrationOneTime").css("display", "none");
      $("#emailMigrationOneDelta").css("display", "none");
      $("#emailJobName").html(jobName);
      $("#appendEmailWorkspaces").html("");
      let _res = JSON.parse(data);
      console.log(_res);
      for (let i = 0; i < _res.length; i++) {
        let data = _res[i];
        $("#appendEmailWorkspaces").append(`
          <div class="emailJobDiv">
              <div class="fromEmailMigrationJob">
                  <div class="imageWrapEmail">
                    <img src="../img/outlook.png" style="width: 20px">
                  </div>
                  <div class="emailWrapperDiv" title="${
                    data?.fromMailId
                  }" id="goToEmailFileFolders" workspaceid="${data?.id}">
                    ${data?.fromMailId}
                  </div>
              </div>
              <div class="fromEmailMigrationJob">
                    <div class="imageWrapEmail">
                      <img src="../img/outlook.png" style="width: 20px">
                    </div>
                    <div class="emailWrapperDiv" title="${
                      data?.toMailId
                    }" id="goToEmailFileFolders" workspaceid="${data?.id}">
                    ${data?.toMailId}
                    </div>
              </div>
              <div class="emailJobContent">
              <div class="emailJobTotalCount">
              ${data?.totalCount}
              </div>
              <div class="emailJobProcessedCount">
              ${data?.processedCount}
              </div>
              <div id="reportsStatusForEmail">
              <span class="span-${data?.processStatus}">
                  ${jobStatus[data?.processStatus]}
                  </span>
                  </div>
                  </div>
                  </div>       
                  `);
      }
      // <div class="emailJobPickingStatus">
      //   ${data?.picking ? "Picking" : "Completed"}
      // </div>
      $("#CFShowLoading").hide();
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
});

$(document).on("click", "#backToJobs", function () {
  getEmailReports();
});

$(document).on("click", "#goToEmailFileFolders", function () {
  let wsId = $(this).attr("workspaceid");
  $("#CFShowLoading").show();
  getEmailWorkSpaces(wsId, "all", 0, false);
  $(".emailWorkspacesFolders").attr("workspaceid", wsId);
});

function getEmailWorkSpaces(wsId, filter, pageNo, folder) {
  $("#CFShowLoading").show();
  let folderEmailMapping = {
    Inbox: "INBOX",
    INBOX: "INBOX",
    Drafts: "DRAFTS",
    DRAFTS: "DRAFTS",
    "Sent Items": "SENT_ITEMS",
    "SENT ITEMS": "SENT_ITEMS",
    "Deleted Items": "DELETED_ITEMS",
    "DELETED ITEMS": "DELETED_ITEMS",
    "Junk Email": "JUNK_EMAIL",
    "JUNK EMAIL": "JUNK_EMAIL",
    Archive: "ARCHIVE",
    ARCHIVE: "ARCHIVE",
    Outbox: "OUTBOX",
    OUTBOX: "OUTBOX",
  };

  if (pageNo) {
    pageNo = pageNo;
  } else {
    pageNo = 0;
  }

  if (filter) {
    filter = filter;
  } else {
    filter = "all";
  }

  pageSize = 50;

  let iconMapping = {
    INBOX: `<i class="ms-Icon ms-Icon--Inbox"></i>`,
    DRAFTS: `<span class="material-symbols-outlined" style="font-size: 16px;font-weight: 600;margin-left:-1px">edit_note</span>`,
    "SENT ITEMS": `<i class="ms-Icon ms-Icon--Send"></i>`,
    "DELETED ITEMS": `<i class="ms-Icon ms-Icon--Delete"></i>`,
    "JUNK EMAIL": `<i class="ms-Icon ms-Icon--MailAlert"></i>`,
    // "Junk Email": `<i class="ms-Icon ms-Icon--Inbox"></i>`,
    ARCHIVE: `<i class="ms-Icon ms-Icon--Archive"></i>`,
    OUTBOX: `<span class="material-symbols-outlined" style="font-size: 16px;font-weight: 600;margin-left:-1px"> outbox </span>`,
  };

  workSpaceFileFolderEmailRequest = $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/mail/workSpaces/" +
      wsId +
      "?pageNo=" +
      pageNo +
      "&pageSize=" +
      pageSize +
      "&type=" +
      filter +
      "&folder=" +
      folder,
    async: true,
    headers: {
      Authorization: getEmailToken(),
    },
    success: function (data) {
      $("#CFShowLoading").hide();
      $(".emailWorkspacesFolders").attr("atpage", pageNo);
      $(".emailWorkspacesFolders").attr("filter", filter);
      $(".emailJobsContainer").css("display", "none");
      $(".emailWorkspacesFolders").css("display", "flex");
      $(".emailWorkSpacesContainer").css("display", "none");
      $("#backToJobs").css("display", "flex");
      $("#emailMigrationOneTime").css("display", "none");
      $("#emailMigrationOneDelta").css("display", "none");
      if (pageNo === 0) {
        $("#mailsTableData").html(`
        <div class="emailShowDiv">
        <div class="emailMigrationFromMail">From</div>
        <div class="emailMigrationSubject">Subject</div>
        <div class="emailMigrationSubject">To</div>
        <div class="emailMigrationFromMail" style="align-items: center;display: flex;gap: 5px;">Status 
          <span class="dropdown" style="position: absolute;right: 240px;">
          <i class="ms-Icon ms-Icon--Filter" style="cursor: pointer;"></i>
            <div
              class="dropdown-content"
              style="font-weight: 500; font-size: 12px; top: 85%; left: -15%"
              id="dropDownEmailStatus">
              <a status="all"><i class="fa fa-check-circle" style="color: green"></i><span style="margin-left: 5%">All</span></a>
              <a status="PROCESSED"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">Processed</span></a>
              <a status="IN_PROGRESS"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">In-Progress</span></a>
              <a status="CONFLICT"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">Conflict</span></a>
              <a status="NOT_STARTED"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">Not Started</span></a>
              <a status="NOT_PROCESSED"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">Not Processed</span></a>
              <a status="PAUSE"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">Pause</span></a>
              <a status="RETRY"><i class="fa fa-check-circle" style="color: green; display: none"></i><span style="margin-left: 5%">Retry</span></a>
            </div>
            </span>
        </div>
      </div>
      `);
        $("#foldersTableData").html(`
      <div class="emailShowDiv" style="gap:40px;">
      <div class="folderTheadEmail">Folder Name</div>
      <div class="folderTheadEmail">Total Count</div>
        <div class="folderTheadEmail">UnRead mails</div>
        <div class="folderTheadEmail">Processed Size</div>
        <div class="folderTheadEmail" style="align-items: center;display: flex;gap: 5px;">Status <i class="ms-Icon ms-Icon--Filter" style="cursor: pointer;"></i></div>
      </div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_INBOX"></div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_DRAFTS"></div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_SENT_ITEMS"></div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_DELETED_ITEMS"></div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_JUNK_EMAIL"></div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_ARCHIVE"></div>
      <div class="emailShowDiv" style="gap:40px;display:none;" id="emailFolder_OUTBOX"></div>
      `);
      }
      let _res = JSON.parse(data);
      console.log(_res);
      if (_res.length === pageSize) {
        $(".emailWorkspacesFolders").attr("canscroll", true);
      } else {
        $(".emailWorkspacesFolders").attr("canscroll", false);
      }

      for (let i = 0; i < _res.length; i++) {
        let _data = _res[i];
        if (!_data?.folder) {
          $("#mailsTableData").append(`
          <div class="emailShowDiv">
                <div class="emailMigrationFromMail">${_data?.fromMail}</div>
               <div class="emailMigrationSubject">${_data?.subject}</div>
                  <div class="emailMigrationSubject" title="${_data?.toMail}">${
            _data?.toMail
          }</div>
                  <div class="emailMigrationFromMail span-${
                    _data?.processStatus
                  }">${jobStatus[_data?.processStatus]}</div>
          </div>
          `);
        } else {
          if (_data?.mailFolder) {
            if (folderEmailMapping[_data?.mailFolder.toUpperCase()]) {
              $(
                '[id="emailFolder_' +
                  folderEmailMapping[_data?.mailFolder.toUpperCase()] +
                  '"]'
              ).css("display", "flex");

              $(
                '[id="emailFolder_' +
                  folderEmailMapping[_data?.mailFolder.toUpperCase()] +
                  '"]'
              ).html(`
              <div class="folderTheadEmail">
                  <div style="width: 20px;" class="placeEmailIcons">
                  ${iconMapping[_data?.mailFolder.toUpperCase()]}
                  </div>
                  ${_data?.mailFolder ? _data?.mailFolder : "/"}</div>
                  <div class="folderTheadEmail" title="${
                    _data?.unreadCount ? _data?.unreadCount : "-"
                  }">${_data?.unreadCount ? _data?.unreadCount : "-"}</div>
                 <div class="folderTheadEmail">${_data?.totalCount}</div>
                 <div class="folderTheadEmail">${CFManageCloudAccountsAjaxCall.getObjectSize(
                   _data?.totalCount
                 )}</div>
                    <div class="folderTheadEmail span-${
                      _data?.processStatus
                    }">${jobStatus[_data?.processStatus]}</div>
            `);
            } else {
              $("#foldersTableData").append(`
            <div class="emailShowDiv" style="gap: 40px">
            <div class="folderTheadEmail">
            <div style="width: 20px;" class="placeEmailIcons">
            <i class="ms-Icon ms-Icon--FabricFolder"></i>
            </div>
            ${_data?.mailFolder ? _data?.mailFolder : "/"}</div>
            <div class="folderTheadEmail" title="${
              _data?.unreadCount ? _data?.unreadCount : "-"
            }">${_data?.unreadCount ? _data?.unreadCount : "-"}</div>
            <div class="folderTheadEmail">${_data?.totalCount}</div>
            <div class="folderTheadEmail">${CFManageCloudAccountsAjaxCall.getObjectSize(
              _data?.totalCount
            )}</div>
              <div class="folderTheadEmail span-${_data?.processStatus}">${
                jobStatus[_data?.processStatus]
              }</div>
              </div>
              `);
            }
          }
        }
      }
    },
    error: function (err) {
      $("#CFShowLoading").hide();
    },
  });
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

$("#Codescratcher_btn").click(function () {});

function downloadPdf() {
  html2canvas($("#mailsTableData"), {
    onrendered: function (canvas) {
      var imgData = canvas.toDataURL("image/png");
      var pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 211, 298);
      pdf.save("HTML_to_PDF.pdf");
    },
  });
}

$("#emailMigrationFolders").click(function () {
  $(this).addClass("active");
  $("#mailsTableData").css("display", "none");
  $("#foldersTableData").css("display", "flex");
  $("#emailMigrationMails").removeClass("active");
  getEmailWorkSpaces(
    $(".emailWorkspacesFolders").attr("workspaceid"),
    "all",
    0,
    true
  );
});

$("#emailMigrationMails").click(function () {
  $(this).addClass("active");
  $("#mailsTableData").css("display", "flex");
  $("#foldersTableData").css("display", "none");
  $("#emailMigrationFolders").removeClass("active");
  getEmailWorkSpaces(
    $(".emailWorkspacesFolders").attr("workspaceid"),
    "all",
    0,
    false
  );
});

function downloadValidatedCSV(csvId) {
  $.ajax({
    type: "GET",
    url: apicallurl + "/mail/csv/download/" + csvId,
    async: true,
    headers: {
      Authorization: getEmailToken(),
    },
    success: function (data) {
      if (data) {
        var blob = new Blob([data]);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "userMapping_Report_" + csvId + ".csv";
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        link.click();
      }
    },
  });
}

// $('[id="dropDownEmailStatus"]').click(function () {
//   alert($(this).attr("status"));
// });

$(document).on("click", '[id="dropDownEmailStatus"] a', function () {
  let filter = $(this).attr("status");
  $('[class="dropdown-content"]').css("display", "none");
  getEmailWorkSpaces(
    $(".emailWorkspacesFolders").attr("workspaceid"),
    filter,
    0,
    false
  );
});

$("#move-header").on("scroll", function () {
  if (
    $(this).scrollTop() + $(this).innerHeight() >=
    $(this)[0].scrollHeight - 40
  ) {
    if (
      window.location.hash == "#email" ||
      (!(BrowserDetect.browser == "Safari") &&
        window.location.hash.includes("#email"))
    ) {
      if ($(".emailWorkspacesFolders").attr("canscroll") === "true") {
        if (workSpaceFileFolderEmailRequest) {
          workSpaceFileFolderEmailRequest.abort();
        }
        getEmailWorkSpaces(
          $(".emailWorkspacesFolders").attr("workspaceid"),
          $(".emailWorkspacesFolders").attr("filter"),
          Number($(".emailWorkspacesFolders").attr("atpage")) + 20,
          $("#emailMigrationFolders").hasClass("active")
        );
      }
    }
  }
});

