var notifyTime = 4000;
var notifyError = 2000;
var MonthlyAMT = 4.99;
var YearlyAMT = 49.99;
var pmntack1;
var pmntack;
var pmntpage;
var lastpmntresponse;
var lastsubsresponse;
var subsresponse;
var cmpletepmntresponse;
var completeresponse;
var cfinternalpmntid;
var Onetime;
var paypal1;
var paypaltoken;
var paypalpayerid;
var paypaldate;
var Monthly;
var Yearly;
var DiscAMT = 0;
var syncing;
var WorkSpaceId;
var spinner;
var cid = 0;
var count = 1;
var fid = 0;
var CloudName = [];
var PrimaryEmail = [];
var CloudId = [];
var CLParent = [];
var CLDisplayName = [];
var AllFilesForAllClouds;
var PageNumber = 1;
var PageSize = 5;
var commentsCount;
var FromfileId = [];
var FilePer = [];
var FromWorkspaceName = [];
var downloadfile = [];
var FromcloudId = [];
var FromObjectName = [];
var Extention = [];
var FileType = [];
var InnerCloudId = [];
var InnerFolderId = [];
var InnerObjectName = [];
var FromShareUrl = [];
var SingleCloudId;
var SinglePId;
var SingleObjectName;
var file;
var CFCreateCloudName;
var moveCheckSum = "";
var searchTerm;
var homeCid = 0;
var previousPage;
var mailsUnames = {};
var sharemailsUnames = [];
var AllCloudsInfo;
var Files = [];
var spinnerClass;
var viewTrack = "LView";
var uploadPageTrack;
var mainProgress = 0;
var previousFileProgressSts;
var HomePageOnload = "Home";
var globalCategoryId;
var slimScrollHeight;
var CfShareInfo = "";
var urlParameterObject = {
  isAscen: "false",
  fetchCollabInfo: "true",
  folderId: "",
  isAllFiles: "true",
  orderField: "modifiedTime",
};
var PageName = "";
var commentInfo;
var wsdetails, wsDetails;
var categoryName;
var OOBCategory = ["Photos", "Music", "Videos", "Documents", "Others"];
var newCategory = false;
var allCategoryData = [];
var CLName = {
  ALFRESCO: "Alfresco", //ECM
  AMAZON: "Amazon S3",
  AMAZON_STORAGE: "Amazon Cloud Drive",
  AXWAY: "Axway",
  AZURE_OBJECT_STORAGE: "Azure", //ECM
  BOX: "Box",
  BOX_BUSINESS: "Box Business",
  CIFS: "CIFS",
  CLOUDIAN: "Cloudian", //ECM
  CMIS: "CMIS", //ECM
  /*'COPY':'Copy Cloud',*/
  DOCUMENTUM: "Documentum", //ECM
  DROP_BOX: "Dropbox",
  DROPBOX_BUSINESS: "Dropbox for Business",
  EGNYTE_STORAGE: "Egnyte",
  EGNYTE_ADMIN: "Egnyte" /*EGNYTE_STORAGE_BUSINESS*/,
  FTP: "FTP",
  G_DRIVE: "Google Drive",
  GOOGLE_STORAGE: "Google Cloud Storage",
  G_DRIVE_MultiUser: "Google Drive-Admin",
  G_SUITE: "Google My Drive",
  GOOGLE_TEAM_DRIVE: "Team Drives",
  GOOGLE_SHARED_DRIVES: "Shared drives",
  GENERIC_OBJECT_STORAGE: "Object Storage", //ECM
  NTLM_STORAGE: "Network File Shares(NFS)", //ECM
  ONEDRIVE: "OneDrive",
  ONEDRIVE_BUSINESS: "OneDrive for Business",
  ONEDRIVE_BUSINESS_ADMIN: "OneDrive for Business",
  ORANGE: "Orange",
  SALES_FORCE: "SalesForce",
  SHAREFILE: "Citrix ShareFile",
  SHAREFILE_BUSINESS: "Share File for Business",
  SHAREPOINT_2010: "SharePoint 2010", //ECM
  SHAREPOINT_2013: "SharePoint 2013", //ECM
  SUGAR_SYNC: "SugarSync",
  SPARK_BUSINESS: "Webex Teams",
  SYNCPLICITY: "syncplicity",
  WALRUS: "Eucalyptus", //ECM
  WEBDAV: "WebDav", //WEBDAV
  YANDEX_DISK: "Yandex",
  CENTURYLINK: "CenturyLink",
  // "SHAREPOINT_ONLINE":"SharePoint Online",
  NFS_ADMIN: "NFS-Admin",
  NETWORK_FILESHARES: "Network FileShares",
  SHAREPOINT_ONLINE_BUSINESS: "SharePoint Online",
  SHARED_DRIVES: "Shared drives",
  WASABI: "Wasabi",
  SHAREPOINT_ONLINE_CONSUMER: "SharePoint Online",
  SHAREPOINT_ONLINE_HYBRID: "SharePoint Online Hybrid",
  SHAREPOINT_CONSUMER_HYBRID: "SharePoint Online Hybrid",
  ONEDRIVE_BUSINESS_ADMIN_HYBRID: "OneDrive for Buisness Hybrid",
  SLACK: "Slack",
  MICROSOFT_TEAMS: "Microsoft Teams",
  MIRO: "MIRO",
  MURAL: "MURAL",
  AZURE_FILESHARE_OBJECT_STORAGE: "Azure",
  OUTLOOK: "Outlook",
  GMAIL: "Gmail",
  GOOGLE_CHAT: "Google Chat",
};

var MultiUserClouds = [
  "MIRO",
  "ONEDRIVE_BUSINESS_ADMIN",
  "DROPBOX_BUSINESS",
  "SPARK_BUSINESS",
  "BOX_BUSINESS",
  "G_SUITE",
  "NFS_ADMIN",
  "EGNYTE_ADMIN",
  "NETWORK_FILESHARES",
  "SYNCPLICITY",
  "SHAREFILE_BUSINESS",
  "SHAREPOINT_ONLINE_BUSINESS",
  "GOOGLE_TEAM_DRIVE",
  "GOOGLE_SHARED_DRIVES",
  "SHAREPOINT_ONLINE_HYBRID",
  "ONEDRIVE_BUSINESS_ADMIN_HYBRID",
  "SLACK",
  "MICROSOFT_TEAMS",
  "AZURE_FILESHARE_OBJECT_STORAGE",
];
var cloudMapping = {
  DROPBOX_BUSINESS: [
    "ONEDRIVE_BUSINESS_ADMIN",
    "G_SUITE",
    "BOX_BUSINESS",
    "SHAREFILE_BUSINESS",
  ],
  G_SUITE: [
    "ONEDRIVE_BUSINESS_ADMIN",
    "DROPBOX_BUSINESS",
    "BOX_BUSINESS",
    "G_SUITE",
    "SHAREFILE_BUSINESS",
  ],
  BOX_BUSINESS: [
    "ONEDRIVE_BUSINESS_ADMIN",
    "EGNYTE_ADMIN",
    "DROPBOX_BUSINESS",
    "SHAREFILE_BUSINESS",
  ],
  ONEDRIVE_BUSINESS_ADMIN: [
    "G_SUITE",
    "ONEDRIVE_BUSINESS_ADMIN",
    "SHAREFILE_BUSINESS",
  ],
  NFS_ADMIN: ["ONEDRIVE_BUSINESS_ADMIN", "SHAREFILE_BUSINESS"],
  NETWORK_FILESHARES: ["ONEDRIVE_BUSINESS_ADMIN", "SHAREFILE_BUSINESS"],
};

var angle = 0;
var moveDestParent;
var PreviewP;
//var clipboardURL = new ZeroClipboard($("#copy"));
var VersionFileId = [];
var versionFileType = [];
var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
var multiEmailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4},?)+$/;
var sharedFolderId;
var actionPanel = {
  open: true,
  download: true,
  share: true,
  rename: true,
  delete: true,
  category: true,
  workspace: true,
  folder: true,
  upload: true,
};
var heartFill = "cf-heart22";
var heart = "cf-heart32";
