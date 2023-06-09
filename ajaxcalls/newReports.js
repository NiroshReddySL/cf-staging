let statusTag = {
  PROCESSED: "Processed",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  CONFLICT: "Conflict",
  CANCEL: "Cancel",
  PAUSE: "Pause",
  SUSPENDED: "Suspended",
  IN_QUEUE: "In queue",
  NOT_PROCESSED: "In queue",
  NOT_STARTED: "In queue",
  STARTED: "Started",
  PARTIALLY_COMPLETED: "Partially Completed",
  PROCESSED_WITH_SOME_CONFLICTS: "Processed with some conflicts",
  PROCESSED_WITH_SOME_CONFLICTS_AND_PAUSE:
    "Processed With Some Conflicts and Pause",
  PROCESSED_WITH_SOME_PAUSE: "Processed With Some Pause",
  MULTIUSERTRAIL_COMPLETED: "Trial Completed",
};

function getFileIcons(fileName, type) {
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
  };
  let fileType = fileName.split(".")[fileName.split(".").length - 1];
  if (type === "folder") {
    return fileTypeImages[type];
  } else if (fileTypeImages[fileType]) {
    return fileTypeImages[fileType];
  } else {
    return "folder.svg";
  }
}
function splitJobName(jobName) {
  if (!jobName) return "-";
  let jobType = jobName.split("-")[0];
  if (jobType === "Onetime") {
    return jobName.split("Onetime-")[1];
  } else if (jobType === "Delta") {
    return jobName.split("Delta-")[1];
  } else if (jobType === "Sync") {
    return jobName.split("Sync-")[1];
  } else {
    return "-";
  }
}
function getJobsSummary() {
  $.ajax({
    url: apicallurl + "/move/newmultiuser/get/moveJobSummary",
    type: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (response) {
      $("#totalJobsCount").html(response.totalJobCount);
      $("#totalProcessedJobsCount").text(response.completedJobCount);
      $("#totalInProcessedJobsCount").text(response.inProgressJobCount);
    },
  });
}
function getTeamReports(pgNo) {
  let pageNo = pgNo ?? 1;
  var apiUrl =
    apicallurl +
    `/move/newmultiuser/get/moveJob?page_nbr=${pageNo}&page_size=30&matchBy=All&oneTimeJobs=true`;
  $.ajax({
    type: "GET",
    url: apiUrl,
    async: true,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (pageNo === 1) $("#teamMigrationReportsJobLevel tbody").html("");
      for (let x = 0; x < data.length; x++) {
        let _data = data[x];
        $("#teamMigrationReportsJobLevel tbody").append(
          `<tr jobid="${_data.id ? _data.id : 0}" tocloudname="${
            _data.toCloudName ? _data.toCloudName : ""
          }" fromcloudname="${
            _data.fromCloudName ? _data.fromCloudName : ""
          }" status="${_data.jobStatus ? _data.jobStatus : "-"}">
                    <td style="width: 5px">
                      <input type="checkbox" id="selectJobs" status="${
                        _data.jobStatus ? _data.jobStatus : "-"
                      }"/>
                    </td>
                    <td class="jobName" style="width: 30%;" title="${
                      _data.jobName ? _data.jobName : "-"
                    }">${CFManageCloudAccountsAjaxCall.getMaxChars(
            _data.jobName
              ? _data.jobName.split("-")[1] + "-" + _data.jobName.split("-")[2]
              : "-",
            40
          )}</td>
                <td>${_data.jobType ? _data.jobType : "-"}</td>
                <td>${_data.totalPairsCount ? _data.totalPairsCount : 0}</td>
                <td>${
                  _data.modifiedTime
                    ? moment(_data.modifiedTime).format("MMM Do, h:mm a")
                    : "-"
                }</td>
                <td>
                  <div>
                    <i class="fa fa-circle dot-${
                      _data.jobStatus ? _data.jobStatus : "-"
                    }"></i>
                    <span>${
                      _data.jobStatus ? statusTag[_data.jobStatus] : "-"
                    }</span>
                  </div>
                </td>
              </tr>
            `
        );
      }
    },
  });
}
getTeamReports();
getJobsSummary();
$(document).on("click", '[id="selectJobs"]', function () {
  if ($(this).is(":checked")) {
    $(this).css("display", "");
  } else {
    $(this).css("display", "none");
  }
  toggleOptionsTab();
  toggleOptions();
});

$(document).on("click", '[id="selectAllJobs"]', function () {
  let totalInputs = $('[id="selectJobs"]').length;
  for (let i = 0; i < totalInputs; i++) {
    if ($("#selectAllJobs:checked").length > 0) {
      $('[id="selectJobs"]')[i].checked = true;
      $(".fixedTopOperations").css("display", "flex");
    } else {
      $('[id="selectJobs"]')[i].checked = false;
    }
  }
  toggleOptions();
  toggleOptionsTab();
});

function toggleOptionsTab() {
  if ($("#selectJobs:checked").length > 0) {
    $(".fixedTopOperations").css("display", "flex");
    if ($('[id="selectJobs"]').length === $("#selectJobs:checked").length) {
      $("#selectAllJobs")[0].checked = true;
    } else {
      $("#selectAllJobs")[0].checked = false;
    }
  } else {
    $(".fixedTopOperations").css("display", "none");
  }
}

function toggleOptions() {
  $(".globalDownloadBtn").removeClass("disableNew");
  $(".globalRunDelta").removeClass("disableNew");
  $("input[id=selectJobs]:checked").map((data, index) => {
    console.log($(index).attr("status"));
    if ($(index).attr("status") === "IN_PROGRESS") {
      $(".globalDownloadBtn").addClass("disableNew");
      return $(".globalRunDelta").addClass("disableNew");
    }
  });
}

$(document).on("click", '[class="jobName"]', function () {
  let jobId, jobName;
  jobId = $(this).parent("tr").attr("jobid");
  jobName = $(this).attr("title");
  //   fromCloudName = $(this).parent("tr").attr("fromcloudname");
  //   toCloudName = $(this).parent("tr").attr("tocloudname");
  $("#CFShowLoading").modal();
  getTableWorkspaces(jobId);
  $("#CFShowLoading").modal("hide");
  $("#jobLevelDiv").css("display", "none");
  $("#jobsSummary").css("display", "none");
  $("#workSpaceLevelData").css("display", "");
  $("#fileFolderSummary").css("display", "none");
  $("#fileFolderLevelData").css("display", "none");
  $('[id="reportsBreadCrumbs"]').append(`<span>></span><p>${jobName}</p>`);
  $('[id="reportsBreadCrumbs"]').attr("id", "toReportsHome");
});

$(document).on("click", "[id='toReportsHome']", function () {
  $(this).html(`<p>Reports</p>`);
  $("#jobLevelDiv").css("display", "");
  $("#jobsSummary").css("display", "flex");
  $("#fileFolderSummary").css("display", "none");
  $(this).attr("id", "reportsBreadCrumbs");
  $("#workSpaceLevelData").css("display", "none");
  $("#fileFolderLevelData").css("display", "none");
});

function getWorkspacesStatus(jobId) {
  let data;
  $.ajax({
    type: "GET",
    url: apicallurl + "/move/queue/status?jobId=" + jobId,
    async: false,
    headers: {
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
    },
    success: function (res) {
      data = res;
    },
  });
  return data;
}

function getTableWorkspaces(jobid, pgno, pagesize) {
  let jobId, pageNo, pageSize;
  jobId = jobid ?? 0;
  pageNo = pgno ?? 1;
  pageSize = pagesize ?? 30;
  $.ajax({
    type: "GET",
    url:
      apicallurl +
      "/move/newmultiuser/get/list/" +
      jobId +
      "?page_nbr=" +
      pageNo +
      "&page_size=" +
      pageSize,
    async: false,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      let workSpaceStatus = getWorkspacesStatus(jobid);
      if (pageNo === 1) $("#teamMigrationReportsWorkSpaceLevel tbody").html("");
      for (let i = 0; i < data.length; i++) {
        let _data = data[i];
        let _workSpaceStatus = workSpaceStatus[i];
        $("#teamMigrationReportsWorkSpaceLevel tbody").append(
          `<tr jobid="${jobId}" workspaceid="${
            _data.id ? _data.id : 0
          }" tocloudname="${
            _data.toCloudName ? _data.toCloudName : ""
          }" fromcloudname="${_data.fromCloudName ? _data.fromCloudName : ""}"
          trimmedName="${
            _data.fromMailId ? _data.fromMailId.split("@")[0] : "-"
          }-${_data.toMailId ? _data.toMailId.split("@")[0] : "-"}"
          >
                  <td style="width: 5px">
                    <input type="checkbox" id="selectWorkSpaces" />
                  </td>
                  <td class="effectName" id="toFileFolders" style="width: 30%;" title="${
                    _data.fromMailId ? _data.fromMailId : "-"
                  }"><div class="fromCloudMailId"><div class="${
            _data.fromCloudName ? "icon-" + _data.fromCloudName : ""
          }"></div><span>${CFManageCloudAccountsAjaxCall.getMaxChars(
            _data.fromMailId ? _data.fromMailId : "-",
            40
          )}</span></div></td>
                  <td class="effectName" id="toFileFolders" style="width: 30%;" title="${
                    _data.toMailId ? _data.toMailId : "-"
                  }"><div class="toCloudMailId"><div class="${
            _data.toCloudName ? "icon-" + _data.toCloudName : ""
          }"></div><span>${CFManageCloudAccountsAjaxCall.getMaxChars(
            _data.toMailId ? _data.toMailId : "-",
            40
          )}</span></div></td>
                  <td>${
                    _data.processedDataSize
                      ? CFManageCloudAccountsAjaxCall.getObjectSize(
                          _data.processedDataSize
                        )
                      : 0
                  }</td>
                  <td>${
                    _workSpaceStatus.modifiedTime
                      ? moment(_workSpaceStatus.modifiedTime).format(
                          "MMM Do, h:mm a"
                        )
                      : "-"
                  }</td>
                  <td>
                    <div>
                      <i class="fa fa-circle dot-${
                        _data.processStatus ? _data.processStatus : "-"
                      }"></i>
                      <span>${
                        _data.processStatus
                          ? statusTag[_data.processStatus]
                          : "-"
                      }</span>
                    </div>
                  </td>
                </tr>
              `
        );
      }
    },
  });
}
function getFileType(type) {
  if (type === "FILE") {
    return "file";
  } else {
    return "folder";
  }
}
$(document).on("click", '[id="toFileFolders"]', function () {
  let workspaceid, fromCloudName, toCloudName, trimmedName;
  workspaceid = $(this).parent("tr").attr("workspaceid");
  fromCloudName = $(this).parent("tr").attr("fromcloudname");
  toCloudName = $(this).parent("tr").attr("tocloudname");
  trimmedName = $(this).parent("tr").attr("trimmedName");
  $("#scrollableFileFolders").attr("workspaceid", workspaceid);
  $("#scrollableFileFolders").attr("fromcloudname", fromCloudName);
  $("#scrollableFileFolders").attr("tocloudname", toCloudName);
  $("#CFShowLoading").modal();
  getFileFolders(workspaceid, fromCloudName, toCloudName);
  getFileFolderCount(workspaceid, fromCloudName, toCloudName);
  $("#fileFolderSummary").css("display", "flex");
  $("#CFShowLoading").modal("hide");
  $("#jobLevelDiv").css("display", "none");
  $("#workSpaceLevelData").css("display", "none");
  $("#fileFolderLevelData").css("display", "");
  $('[id="toReportsHome"]').append(
    `<span id="atFileFolderBreadCrumb">></span><p id="atFileFolderBreadCrumb">${trimmedName}</p>`
  );
  $('[id="toReportsHome"]').attr("id", "toWorkSpaceLevel");
});

$(document).on("click", '[id="toWorkSpaceLevel"]', function () {
  $('[id="atFileFolderBreadCrumb"]').remove();
  $('[id="toWorkSpaceLevel"]').attr("id", "toReportsHome");
  $("#fileFolderSummary").css("display", "none");
  $("#jobLevelDiv").css("display", "none");
  $("#workSpaceLevelData").css("display", "");
  $("#fileFolderLevelData").css("display", "none");
});

function getFileFolders(wsId, fromCloudName, toCloudName, pageNo) {
  let pgNo = pageNo ?? 1;
  if (
    fromCloudName == "SHAREFILE_BUSINESS" &&
    toCloudName == "EGNYTE_ADMIN" &&
    localStorage.egnyteOldImpl === "true"
  ) {
    var _url =
      apicallurl +
      "/move/filefolderinfo/movereportsync?workspaceId=" +
      wsId +
      "&page_nbr=" +
      pgNo +
      "&status=all";
  } else if (
    (fromCloudName == "G_SUITE" &&
      toCloudName == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromCloudName == "DROPBOX_BUSINESS" && toCloudName == "BOX_BUSINESS") ||
    (fromCloudName == "G_SUITE" && toCloudName == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromCloudName == "ONEDRIVE_BUSINESS_ADMIN" && toCloudName == "G_SUITE") ||
    (fromCloudName == "BOX_BUSINESS" && toCloudName == "G_SUITE") ||
    (fromCloudName == "NETWORK_FILESHARES" && toCloudName == "G_SUITE") ||
    (fromCloudName == "NETWORK_FILESHARES" &&
      toCloudName == "GOOGLE_SHARED_DRIVES") ||
    (fromCloudName == "NETWORK_FILESHARES" &&
      toCloudName == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromCloudName == "NETWORK_FILESHARES" &&
      toCloudName == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromCloudName == "SHAREPOINT_ONLINE_BUSINESS" &&
      toCloudName == "GOOGLE_SHARED_DRIVES") ||
    (fromCloudName == "DROPBOX_BUSINESS" &&
      toCloudName == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromCloudName == "BOX_BUSINESS" &&
      toCloudName == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromCloudName == "DROPBOX_BUSINESS" &&
      toCloudName == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromCloudName == "EGNYTE_ADMIN" && toCloudName == "AMAZON") ||
    (fromCloudName == "BOX_BUSINESS" &&
      toCloudName == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromCloudName == "G_SUITE" && toCloudName == "AMAZON") ||
    (fromCloudName == "GOOGLE_SHARED_DRIVES" && toCloudName == "AMAZON") ||
    (fromCloudName == "SHAREFILE_BUSINESS" && toCloudName == "EGNYTE_ADMIN") ||
    (fromCloudName == "BOX_BUSINESS" && toCloudName == "DROPBOX_BUSINESS") ||
    (fromCloudName == "G_SUITE" && toCloudName == "DROPBOX_BUSINESS") ||
    (fromCloudName == "EGNYTE_ADMIN" &&
      toCloudName == "AZURE_OBJECT_STORAGE") ||
    (fromCloudName == "G_SUITE" && toCloudName == "AMAZON")
  ) {
    var _url =
      apicallurl +
      "/move/filefolderinfo/movereport?workspaceId=" +
      wsId +
      "&page_nbr=" +
      pgNo +
      "&status=all";
  } else {
    var _url =
      apicallurl +
      "/move/movereport?workspaceId=" +
      wsId +
      "&page_nbr=" +
      pgNo +
      "&status=all";
  }
  $.ajax({
    type: "GET",
    url: _url,
    async: false,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      if (pgNo === 1) $("#teamMigrationReportsFileFolderLevel tbody").html("");
      if (data.length === 20) {
        $("#scrollableFileFolders").attr("pageNo", pgNo);
      } else {
        $("#scrollableFileFolders").attr("pageNo", false);
      }
      for (let i = 0; i < data.length; i++) {
        let _data = data[i];
        //let _workSpaceStatus = workSpaceStatus[i];
        //   <img src="" class="fa ${
        //     _data?.cfFileMini?.type
        //       ? getFileType(_data?.cfFileMini?.type)
        //       : _data.folder
        //       ? "fa-folder"
        //       : "fa-file"
        //   }"></img>
        $("#teamMigrationReportsFileFolderLevel tbody").append(
          `<tr>
                  <td style="width: 45%;">
                  <div>
                  <img class="tableImage" src="../images/fileTypes/${
                    _data?.cfFileMini?.objectName
                      ? getFileIcons(
                          _data?.cfFileMini?.objectName,
                          _data?.cfFileMini?.type
                            ? getFileType(_data?.cfFileMini?.type)
                            : _data.folder
                            ? "folder"
                            : "file"
                        )
                      : _data.destObjectName
                      ? getFileIcons(
                          _data.destObjectName,
                          _data?.cfFileMini?.type
                            ? getFileType(_data?.cfFileMini?.type)
                            : _data.folder
                            ? "folder"
                            : "file"
                        )
                      : ""
                  }"></img>
                  <span>${
                    _data?.cfFileMini?.objectName
                      ? _data?.cfFileMini?.objectName
                      : _data.destObjectName
                      ? _data.destObjectName
                      : ""
                  }</span>
                  </div>
                  </td>
                    <td>${
                      _data?.cfFileMini?.objectSize
                        ? CFManageCloudAccountsAjaxCall.getObjectSize(
                            _data?.cfFileMini?.objectSize
                          )
                        : _data.fileSize
                        ? CFManageCloudAccountsAjaxCall.getObjectSize(
                            _data.fileSize
                          )
                        : "-"
                    }</td>
                    <td>${
                      _data.fileProcessEndTime
                        ? moment(_data.fileProcessEndTime).format(
                            "MMM Do, h:mm a"
                          )
                        : "-"
                    }</td>
                    <td>
                      <div>
                        <i class="fa fa-circle dot-${
                          _data.processStatus ? _data.processStatus : "-"
                        }"></i>
                        <span>${
                          _data.processStatus
                            ? statusTag[_data.processStatus]
                            : "-"
                        }</span>
                      </div>
                    </td>
                  </tr>
                `
        );
      }
    },
  });
}

$("#scrollableFileFolders").on("scroll", function () {
  if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
    if ($(this).attr("pageNo") !== "false") {
      console.log("ENTERED PAGINATION");
      let wsId, fromCloudName, toCloudName, pageNo;
      wsId = $(this).attr("workspaceid");
      fromCloudName = $(this).attr("fromcloudname");
      toCloudName = $(this).attr("tocloudname");
      pageNo = Number($(this).attr("pageNo"));
      getFileFolders(wsId, fromCloudName, toCloudName, pageNo + 1);
    } else {
      return false;
    }
  }
});

function getFileFolderCount(wsId, fromcloudname, tocloudname) {
  if (fromcloudname == undefined) {
    var apiCall =
      apicallurl + "/move/moveworkspacefilefoldercount?workspaceId=" + wsId;
  } else if (
    fromcloudname == "SHAREFILE_BUSINESS" &&
    _this.attr("dstncldname") == "EGNYTE_ADMIN" &&
    localStorage.egnyteOldImpl === "true"
  ) {
    var apiCall =
      apicallurl +
      "/move/filefolderinfo/moveworkspacefilefoldercountsync?workspaceId=" +
      wsId;
  } else if (
    (fromcloudname == "G_SUITE" &&
      tocloudname == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromcloudname == "DROPBOX_BUSINESS" && tocloudname == "BOX_BUSINESS") ||
    (fromcloudname == "G_SUITE" && tocloudname == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromcloudname == "ONEDRIVE_BUSINESS_ADMIN" && tocloudname == "G_SUITE") ||
    (fromcloudname == "NETWORK_FILESHARES" && tocloudname == "G_SUITE") ||
    (fromcloudname == "NETWORK_FILESHARES" &&
      tocloudname == "GOOGLE_SHARED_DRIVES") ||
    (fromcloudname == "BOX_BUSINESS" && tocloudname == "G_SUITE") ||
    (fromcloudname == "SHAREPOINT_ONLINE_BUSINESS" &&
      tocloudname == "GOOGLE_SHARED_DRIVES") ||
    (fromcloudname == "NETWORK_FILESHARES" &&
      tocloudname == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromcloudname == "NETWORK_FILESHARES" &&
      tocloudname == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromcloudname == "NETWORK_FILESHARES" &&
      tocloudname == "GOOGLE_SHARED_DRIVES") ||
    (fromcloudname == "SHAREPOINT_ONLINE_BUSINESS" &&
      tocloudname == "G_SUITE") ||
    (fromcloudname == "DROPBOX_BUSINESS" &&
      tocloudname == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromcloudname == "DROPBOX_BUSINESS" &&
      tocloudname == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromcloudname == "EGNYTE_ADMIN" && tocloudname == "AMAZON") ||
    (fromcloudname == "BOX_BUSINESS" &&
      tocloudname == "SHAREPOINT_ONLINE_BUSINESS") ||
    (fromcloudname == "BOX_BUSINESS" &&
      tocloudname == "ONEDRIVE_BUSINESS_ADMIN") ||
    (fromcloudname == "G_SUITE" && tocloudname == "AMAZON") ||
    (fromcloudname == "GOOGLE_SHARED_DRIVES" && tocloudname == "AMAZON") ||
    (fromcloudname == "SHAREFILE_BUSINESS" && tocloudname == "EGNYTE_ADMIN") ||
    (fromcloudname == "BOX_BUSINESS" && tocloudname == "DROPBOX_BUSINESS") ||
    (fromcloudname == "G_SUITE" && tocloudname == "DROPBOX_BUSINESS") ||
    (fromcloudname == "EGNYTE_ADMIN" &&
      tocloudname == "AZURE_OBJECT_STORAGE") ||
    (fromcloudname == "G_SUITE" && tocloudname == "AMAZON")
  ) {
    var apiCall =
      apicallurl +
      "/move/filefolderinfo/moveworkspacefilefoldercount?workspaceId=" +
      wsId;
  } else {
    var apiCall =
      apicallurl + "/move/moveworkspacefilefoldercount?workspaceId=" + wsId;
  }
  $.ajax({
    url: apiCall,
    type: "get",
    async: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: CFManageCloudAccountsAjaxCall.getAuthDetails(),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
    },
    success: function (data) {
      $("#totalFileFolders").html(`${data?.totalFiles + data.totalFolders}`);
      $("#processedFileFolders").html(`${data?.processedCount}`);
      $("#conflictFileFolders").html(`${data?.conflictCount}`);
    },
  });
}
