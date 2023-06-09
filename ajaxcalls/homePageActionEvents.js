// CloudFuze home page action panel events
var CFHPActions = {
	viewData: $('#actionPanel .fileview a'),
	init: function () {
		CFHPActions.viewData.click(function () {
		$("#mainContent").find(".CFTHCreateFolder").closest('.panel-data').remove();
			$("#mainContent").find(".CFTHCreateFolder").parent('.file').remove();
			$('#openFiles, #CFDownload, #CFHRename').css('pointer-events','auto');
			$('#openFiles > div, #CFDownload > div, #CFHRename > div').css('opacity', '1');
			$('#mainContent').find('.LVcheckBox input[type="checkbox"]').removeAttr('checked'); 
			if(PageName == "WorkSpace"){
				if ($(this).hasClass('list')) {
					$('#CFHSortfileSize').children('span').html('');
					$('#CFHSortFileName').children('span').html('');
					$('#LVContent').show();
					$('#ThumbnailContent').hide();
					$('#LVWContentHeader').removeClass('divdisplay');
					$('#ThumbnailContent > div').removeClass('active');
					$('#ThumbnailContent > div').removeClass('checked');
					$(this).parent('.fileview').children('a[title="List View"]').css('opacity','0.2');
					$(this).parent('.fileview').children('a[title="Grid View"]').css('opacity','1');
					viewTrack = "LView";
				}else {
					$('#CFHSortfileSize').children('span').html('');
					$('#CFHSortFileName').children('span').html('');
					$('#LVContent').hide();
					$('#LVWContentHeader').addClass('divdisplay');
					$('#ThumbnailContent').show();
					$(this).parent('.fileview').children('a[title="Grid View"]').css('opacity','0.2');
					$(this).parent('.fileview').children('a[title="List View"]').css('opacity','1');
					viewTrack = "GView";
				}
			}
			else{
				var height;
				if ($(this).hasClass('list')) {
					unCheckFile();
					if($(window).width() < 1025){
						$('#FooterLinks').css('width',$(window).width());
						height =$(window).height() - $('#FooterLinks').height() - 2 - $('#expireMsg').height() -  $('.contentWrapper:eq(0)').height() -  $('.contentWrapper:eq(1)').height() - 25 - $('#actionPanel').height() - $('#LVContentHeader').height() - $('#primary').height() - $('#secondary').height();
						$('#mainContentWrapper').css('max-height',height).css('height',height);
						if(PageName == "WorkSpace"){
							$('#FooterLinks').css('width','100%');
						}
					}else if($(window).width() > 1024){
						$('#FooterLinks').css('width',$(window).width() - $('#primary').width() - $('#secondary').width());
						height =$(window).height() - $('#FooterLinks').height() - 2 - $('#expireMsg').height() -  $('.contentWrapper:eq(0)').height() -  $('.contentWrapper:eq(1)').height() - 15 - $('#actionPanel').height() - $('#LVContentHeader').height();
						$('#mainContentWrapper').css('max-height',height).css('height',height);
						if(PageName == "WorkSpace"){
							$('#FooterLinks').css('width','95%');
						}
					}
					$('#CFHSortfileSize').children('span').html('');
					$('#CFHSortFileName').children('span').html('');
					$('#LVContent').show();
					$('#LVContentHeader').removeClass('divdisplay');
					$('#ThumbnailContent').hide();
					$('#LVWContentHeader').addClass('divdisplay');
					$('#ThumbnailContent > div').removeClass('active');
					$('#ThumbnailContent > div').removeClass('checked');
					$(this).parent('.fileview').children('a[title="List View"]').css('opacity','0.2');
					$(this).parent('.fileview').children('a[title="Grid View"]').css('opacity','1');
					viewTrack = "LView";
					sessionStorage.setItem("viewTrack",viewTrack);
				}else {
					if ($(window).width() < 1025) {
						$('#FooterLinks').css('width', $(window).width());
						height = $(window).height() - $('#FooterLinks').height() - 2 - $('#expireMsg').height() - $('.contentWrapper:eq(0)').height() - $('.contentWrapper:eq(1)').height() - 15 - $('#actionPanel').height() - $('#primary').height() - $('#secondary').height();
						$('#mainContentWrapper').css('max-height', height).css('height', height);
						if (PageName == "WorkSpace") {
							$('#FooterLinks').css('width', '100%');
						}
					}else if ($(window).width() > 1024) {
						$('#FooterLinks').css('width', $(window).width() - $('#primary').width() - $('#secondary').width());
						height = $(window).height() - $('#FooterLinks').height() - 2 - $('#expireMsg').height() - $('.contentWrapper:eq(0)').height() - $('.contentWrapper:eq(1)').height() - 15 - $('#actionPanel').height();
						$('#mainContentWrapper').css('max-height', height).css('height', height);
						if (PageName == "WorkSpace") {
							$('#FooterLinks').css('width', '95%');
						}
					}
					unCheckFile();
					$('#CFHSortfileSize').children('span').html('');
					$('#CFHSortFileName').children('span').html('');
					$('#LVContent').hide();
					$('#LVContentHeader').addClass('divdisplay');
					$('#ThumbnailContent').show();
					$(this).parent('.fileview').children('a[title="Grid View"]').css('opacity','0.2');
					$(this).parent('.fileview').children('a[title="List View"]').css('opacity','1');
					viewTrack = "GView";
					sessionStorage.setItem("viewTrack",viewTrack);
				}
			}
		});
		$('#page-header').on('click','#tagBackButton', function(){
			$('#sidebar-wrapper .active-link').trigger('click');
		});
		$('#page-header').on('click','#cloudBackButton', function(){
			$('#sidebar-wrapper .active-link').trigger('click');
		});
		//Main nav Home click event
		$(document).on('click','#homeHome', function () {
			var cloudlength=$('#CloudDriveList').children('div').length;
			$('#spinner1').removeClass('divdisplay');
			count=1;
			$('#CFHDelete .filecontrol-title').text('Delete');
			$('#CFHDelete').attr('title','Delete');
			document.title= "All files";
			PageName = "Home";
			$('#headerText').text("All files");
			PageNumber = 1;
			CFHideContents();
			CFShowContents();
			setTimeout(function(){
				CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(homeCid, PageNumber);
			},500);
			$('.globalNav ul li a').removeClass('active');
			$(this).addClass('active');
			InnerFolderId = [];
			$('#'+viewTrack+'').trigger('click');
			$('#AdminDashboard').hide();
			sendGAEvents("All Files");
			//_gaq.push(["All Files" , localStorage.getItem('UserId'),PageName]);
		});
		$('.globalNav ul li a').on('click',function(){
			$('#sidebarContent a').removeClass('active-link');
			$('#CFMyClouds').removeClass('active-link');
		});
		$('#sidebarContent').on('click','a',function(){
			$('.globalNav ul li a').removeClass('active');
			$('#sidebar-wrapper a').removeClass('active-link');
			$('#CFMyClouds').removeClass('active-link');
			$(this).addClass('active-link');
			$('#sidebar-wrapper > div.header > span').text("Home");
		});
		$('#CFHSortFileName').on('click',function(){
			disableActionPanel();
			$('#LVHeader').find('input:checked').trigger('click');
			if($('#LVContent').children('div').length == 0){
				return false;
			}
			if(PageName == "Share by Me" || PageName == "Share with Me"){
				urlParameterObject.orderField = "file.objectName";
			}else{
				urlParameterObject.orderField = "objectName";
			}
			var sort = $(this);
			clearSorting();
			if(sort.hasClass('testSort')){
				PageNumber = 1;
				urlParameterObject.isAscen = "true";
				CFManageCloudAccountsAjaxCall.getSortFiles(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.children('span').html("&#9650");
					sort.removeClass('testSort').addClass('testingSort');
				}
			}else if(sort.hasClass('testingSort') ){
				PageNumber = 1;
				urlParameterObject.isAscen = "false";
				CFManageCloudAccountsAjaxCall.getSortFilesD(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.children('span').html("&#9660");
					sort.removeClass('testingSort').addClass('testSort');
				}
			}
			sendGAEvents("Sort By File Name");
			//_gaq.push(['_trackEvent', "Sort By File Name" , localStorage.getItem('UserId'),PageName]);
		});
		$('#CFHSortfileSize').on('click',function(){
			disableActionPanel();
			$('#LVHeader').find('input:checked').trigger('click');
			if($('#LVContent').children('div').length == 0){
				return false;
			}
			if(PageName == "Share by Me" || PageName == "Share with Me"){
				urlParameterObject.orderField = "file.objectSize";
			}else{
				urlParameterObject.orderField = "objectSize";
			}
			var sort = $(this);
			clearSorting();
			if(sort.hasClass('testSort')){
				PageNumber = 1;
				urlParameterObject.isAscen = "true";
				CFManageCloudAccountsAjaxCall.getSortFiles(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.removeClass('testSort').addClass('testingSort');
					sort.children('span').html("&#9650");
				}
			}else if(sort.hasClass('testingSort') ){
				PageNumber = 1;
				urlParameterObject.isAscen = "false";
				CFManageCloudAccountsAjaxCall.getSortFilesD(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.children('span').html("&#9660");
					sort.removeClass('testingSort').addClass('testSort');
				}
			}
			sendGAEvents("Sort By File Size");
			//_gaq.push(['_trackEvent',"Sort By File Size", localStorage.getItem('UserId'),PageName]);
		});
		$('#CFHSortAddedOn').on('click',function(){
			disableActionPanel();
			$('#LVHeader').find('input:checked').trigger('click');
			if($('#LVContent').children('div').length == 0){
				return false;
			}
			if(PageName == "Share by Me" || PageName == "Share with Me"){
				urlParameterObject.orderField = "createdDate";
			}else{
				urlParameterObject.orderField = "createdTime";
			}
			clearSorting();
			var sort = $(this);
			$('#CFHSortFileName').children('span').html('');
			if(sort.hasClass('testSort')){
				PageNumber = 1;
				urlParameterObject.isAscen = "true";
				CFManageCloudAccountsAjaxCall.getSortFiles(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.removeClass('testSort').addClass('testingSort');
					sort.children('span').html("&#9650");
				}
			}else if(sort.hasClass('testingSort') ) {
				PageNumber = 1;
				urlParameterObject.isAscen = "false";
				CFManageCloudAccountsAjaxCall.getSortFilesD(urlParameterObject.orderField, PageNumber);
				if (PageName != "Favorites") {
					sort.children('span').html("&#9660");
					sort.removeClass('testingSort').addClass('testSort');
				}
			}
			sendGAEvents("Sort By AddedOn");
			//_gaq.push(['_trackEvent',"Sort By AddedOn", localStorage.getItem('UserId'),PageName]);
		});
		$('#CFHSortModifiedOn').on('click',function(){
			disableActionPanel();
			$('#LVHeader').find('input:checked').trigger('click');
			if($('#LVContent').children('div').length == 0){
				return false;
			}
			if(PageName == "Share by Me" || PageName == "Share with Me"){
				urlParameterObject.orderField = "modifiedDate";
			}else{
				urlParameterObject.orderField = "modifiedTime";
			}
			clearSorting();
			var sort = $(this);
			if(sort.hasClass('testSort')){
				PageNumber = 1;
				urlParameterObject.isAscen = "true";
				CFManageCloudAccountsAjaxCall.getSortFiles(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.removeClass('testSort').addClass('testingSort');
					sort.children('span').html("&#9660");
				}
			}
			else if(sort.hasClass('testingSort') ){
				PageNumber = 1;
				urlParameterObject.isAscen = "false";
				CFManageCloudAccountsAjaxCall.getSortFilesD(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.children('span').html("&#9650");
					sort.removeClass('testingSort').addClass('testSort');
				}
			}
			sendGAEvents("Sort By ModifiedOn");
			//_gaq.push(['_trackEvent',"Sort By ModifiedOn", localStorage.getItem('UserId'),PageName]);
		});
		$('#CFHSortCloudDrive').on('click',function(){
			disableActionPanel();
			$('#LVHeader').find('input:checked').trigger('click');
			if($('#LVContent').children('div').length == 0){
				return false;
			}
			if(PageName == "Share by Me" || PageName == "Share with Me"){
				urlParameterObject.orderField = "file.cloudName";
			}else{
				urlParameterObject.orderField = "cloudName";
			}
			var sort = $(this);
			clearSorting();
			if(sort.hasClass('testSort')){
				PageNumber = 1;
				urlParameterObject.isAscen = "true";
				CFManageCloudAccountsAjaxCall.getSortFiles(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.children('span').html("&#9650");
					sort.removeClass('testSort').addClass('testingSort');
				}
			}else if(sort.hasClass('testingSort') ){
				PageNumber = 1;
				urlParameterObject.isAscen = "false";
				CFManageCloudAccountsAjaxCall.getSortFilesD(urlParameterObject.orderField,PageNumber);
				if(PageName != "Favorites"){
					sort.children('span').html("&#9660");
					sort.removeClass('testingSort').addClass('testSort');
				}
			}
			sendGAEvents("Sort By Cloud");
			//_gaq.push(['_trackEvent',"Sort By Cloud", localStorage.getItem('UserId'),PageName]);
		});
		$('#CFHAccountSettings').on('click',function(){
			$('.globalNav ul li a').removeClass('active');
			$('#tabs').tabs();
			$('#AccountSettings').show();
			$('#HomeContent').hide();
			$('#ui-id-1').click();
			var UserObj = JSON.parse(localStorage.getItem('CFUser'));
			$('#tabs-1 .ProfileContent').html(UserObj.lastName +" </span>");
			$('#tabs-1 .ProfileContentemail').html(UserObj.primaryEmail +" </span>");
			// $('#tabs-1 .ProfileContentmobile').html(UserObj.mobileNumber +" </span>");

			timeOffset();
			function get_time_zone_offset( ) {
				var current_date = new Date();
				return -current_date.getTimezoneOffset() / 60;
			}
			var timeZoneData = get_time_zone_offset();
			function timeOffset(){
				var timeZoneData = get_time_zone_offset();
				var timezones = {
					'-12': 'Pacific/Kwajalein',
					'-11': 'Pacific/Samoa',
					'-10': 'Pacific/Honolulu',
					'-9': 'America/Juneau',
					'-8': 'America/Los_Angeles',
					'-7': 'America/Denver',
					'-6': 'America/Mexico_City',
					'-5': 'America/New_York',
					'-4': 'America/Caracas',
					'-3.5': 'America/St_Johns',
					'-3': 'America/Argentina/Buenos_Aires',
					'-2': 'Atlantic/Azores',
					'-1': 'Atlantic/Azores',
					'0': 'Europe/London',
					'1': 'Europe/Paris',
					'2': 'Europe/Helsinki',
					'3': 'Europe/Moscow',
					'3.5': 'Asia/Tehran',
					'4': 'Asia/Baku',
					'4.5': 'Asia/Kabul',
					'5': 'Asia/Karachi',
					'5.5': 'Asia/Calcutta',
					'6': 'Asia/Colombo',
					'7': 'Asia/Bangkok',
					'8': 'Asia/Singapore',
					'9': 'Asia/Tokyo',
					'9.5': 'Australia/Darwin',
					'10': 'Pacific/Guam',
					'11': 'Asia/Magadan',
					'12': 'Asia/Kamchatka'
				};
				$.each(timezones, function (key, value) {
					if (key == timeZoneData) {
						timeZoneData = value;
						$('#tabs-1 #timeZone span').html('');
						$('#tabs-1 #timeZone span').append("<select class='dropdown'><option value='' class='label'>GMT+"+key+" "+timeZoneData+"</option></select></span>");
					}
				});
			}
			/*Progress Bar*/
			var tspaceby = 0;
			var uspaceby = 0;
			var aspaceby = 0;
			var aspacer=0;
			var totalsp=0;
			var usedsp=0;
			for(var i=0;i<AllCloudsInfo.length;i++){
				tspaceby+=AllCloudsInfo[i].totalSpace;
				uspaceby+=AllCloudsInfo[i].usedSpace;
				aspacer=AllCloudsInfo[i].availableSpace;
				aspaceby+=aspacer;
				totalsp=CFManageCloudAccountsAjaxCall.getObjectSize(tspaceby);
				usedsp=CFManageCloudAccountsAjaxCall.getObjectSize(uspaceby);
			}
			var progrssPercent = (uspaceby/tspaceby)*100+'%';
			$(' #usedProgress').css("width",progrssPercent);
			$(' #Progressbar-Space').html('');
			$(' #Progressbar-Space').append("<span>used </span><b id='pused'>"+usedsp+"</b><span> out of </span><b id='ptotal'>"+totalsp+"</b>");
		});
		$('#homeReports').on('click',function(){
			var allCTs=0;
			var allCAs=0;
			var allCUs=0;
			var tspaceby=0;
			var uspaceby=0;
			var aspaceby=0;
			$('#RVContent').html('');
			var pieArry = [];
			var totalCloudspace = 0;
			for(var i=0;i<AllCloudsInfo.length;i++){
				totalCloudspace = totalCloudspace+AllCloudsInfo[i].totalSpace;
			}
			for(var i=0;i<AllCloudsInfo.length;i++) {
				var cloudPie = [];
				//var tspace = AllCloudsInfo[i].totalSpace;
				var uspace = AllCloudsInfo[i].availableSpace;
				var cloudName = AllCloudsInfo[i].cloudName;
				var usedSpacePerc = ((uspace / totalCloudspace) * 100).toFixed(2);
				cloudPie.push(AllCloudsInfo[i].userDisplayName, parseFloat(usedSpacePerc));
				pieArry.push(cloudPie);
			}
			var chart;
			// Build the chart
			$('#pieChart').highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				title: {
					text: 'Free space available'
				},
				credits:{
					enabled:true,
					text:'CloudFuze Inc.',
					href:'#'
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: false
						},
						showInLegend: true
					}
				},
				series: [{
					type: 'pie',
					name: ' ',
					innerSize: '70%',
					data: pieArry
				}]
			});
			/*$('#RVContent').slimscroll({
             alwaysVisible: true,
             height: '140px',
             width: '100%'
             });*/
			for(var i=0;i<AllCloudsInfo.length;i++) {
				var cname = AllCloudsInfo[i].userDisplayName;
				tspaceby += AllCloudsInfo[i].totalSpace;
				var tspace = CFManageCloudAccountsAjaxCall.getReportObjectSize(AllCloudsInfo[i].totalSpace);
				var uspace = CFManageCloudAccountsAjaxCall.getReportObjectSize(AllCloudsInfo[i].usedSpace);
				uspaceby += AllCloudsInfo[i].usedSpace;
				var aspace = AllCloudsInfo[i].availableSpace;
				aspace = CFManageCloudAccountsAjaxCall.getReportObjectSize(aspace);
				aspaceby += AllCloudsInfo[i].availableSpace;
				allCTs += AllCloudsInfo[i].totalSpace;
				allCUs += AllCloudsInfo[i].usedSpace;
				allCAs += AllCloudsInfo[i].availableSpace;
				if (cname == "" || cname == " ") {
					cname = AllCloudsInfo[i].cloudName
				}
				$('#RVContent').append('<div class="panel-data"><div class="Driveicon" id="' + AllCloudsInfo[i].cloudName + '"></div><div class="redrivename1" id="' + AllCloudsInfo[i].id + '">' + cname + '</div><div class="retotalspace1">' + tspace + '</div><div class="reusedspace1">' + uspace + '</div><div class="refreespace1">' + aspace + '</div></div>');
			}
			var allts=CFManageCloudAccountsAjaxCall.getReportObjectSize(allCTs);
			var allus=CFManageCloudAccountsAjaxCall.getReportObjectSize(allCUs);
			//var allas= allCTs-allCUs;
			var allas=CFManageCloudAccountsAjaxCall.getReportObjectSize(allCAs);
			$('#total').html('');
			$('#used').html('');
			$('#free').html('');
			$('#ptotal').html('');
			$('#pused').html('');
			$('#total').append(allts);
			$('#used').append(allus);
			$('#free').append(allas);
			$('#ptotal').append(allts);
			$('#pused').append(allus);
			var progrssPercent = (uspaceby/tspaceby)*100+'%';
			$('#usedProgress').css("width",progrssPercent);
		});
		$(document).on('click','#homeFolder', function () {
			PageName = "Folders";
			$('#spinner1').removeClass('divdisplay');
			count=1;
			CFHideContents();
			CFShowContents();
			document.title = "Folders";
			$('#breadCrumbdync').empty();
			appendBreadCrumb("Folders","Folders","Folders");
			PageNumber = 1;
			setTimeout(function(){
				CFManageCloudAccountsAjaxCall.getAllHomeFolders(PageNumber);
			},100);
			$('.globalNav ul li a').removeClass('active');
			$(this).addClass('active');
			InnerFolderId = [];
			$('#'+viewTrack+'').trigger('click');
		});
		$('#AllFilesandFolders').on('click', function () {
			$('#spinner1').removeClass('divdisplay');
			$('#breadCrumbdync').empty();
			$('#breadCrumbdync').append('<li id="AllItems" class="BCRFList" cloudId="AllItems" fileId="AllItems"><a href="#">All Items</a><span class="divider"></span></li>');
			PageNumber = 1;
			var _files = CFManageCloudAccountsAjaxCall.getAllFiles(PageNumber);
			setTimeout(function(){
				CFManageCloudAccountsAjaxCall.getAllFileNames(_files, PageNumber);},100);
			PageName = "AllItems";
			CFHideContents();
			CFShowContents();
			$('#'+viewTrack+'').trigger('click');
		});
		$(document).on('click','#homeWorkspace', function () {
			$('#spinner1').removeClass('divdisplay');
			$('#page-header input[type="checkbox"]').attr('checked', false);
			PageName = "WorkSpace";
			document.title = "Workspace";
			$('#breadCrumbdync').empty();
			appendBreadCrumb("Workspace","Workspace","Workspace");
			count=1;
			setTimeout(function(){
				CFManageCloudAccountsAjaxCall.getWorkSpaceForaUser();},100);
			$('.globalNav ul li a').removeClass('active');
			$(this).addClass('active');
			InnerFolderId = [];
			CFHideContents();
			CFShowContents();
			$('#'+viewTrack+'').trigger('click');
		});
		/*Navigating into inner Folders*/

		$('#main').on ('click' , '#ThumbnailContent i.filethumbnail[name="FOLDER"] , #ThumbnailContent i.filethumbnail[name="SITE"] , #ThumbnailContent i.filethumbnail[name="NOTEBOOK"]' , function(){
			$('#listShowMore').addClass('divdisplay');
			count=1;
			if(PageName == "Share with Me"){
				sharedFolderId = $(this).attr('sharedFolderId');
			}
			if(count == 1){
				previousPage = PageName;
			}
			FilePer = [];
			if(previousPage == "Share with Me"){
				FilePer.push($(this).closest('.file').attr('fileper'));
			}
			PageName = $(this).attr('name') == "SITE" ? "SharepointSite" : "InnerFolders";
			CFHideContents();
			CFShowContents();
			count= count+1;
			var PageNumber = 1;
			var cid = $(this).parent().attr('id');
			var fid = $(this).parent().children('strong').attr('id');
			var pid = $(this).parent().children('strong').attr('pid');
			var fileName = $(this).parent().children('strong').text();
			var test = $('#CloudDriveList').find('.catactive').closest('.clsubmenu').attr('id');
			var array = ["EGNYTE_STORAGE"];
			if($.inArray(test,array)>-1){
				var testId = fid.split('/');
				var len = testId.length;
				if(testId[2] == "Private"){
					$('#CFUploadFiles').parent().addClass('buttonDisable');
				}else if(testId.length == 3 && testId[2] == "Shared"){
					$('#CFUploadFiles').parent().addClass('buttonDisable');
				}
			}
			SingleCloudId = cid;
			SinglePId = fid;
			SingleObjectName = fileName;
			if($.inArray(fid , InnerFolderId) == -1){
				InnerFolderId.push(fid);
				InnerCloudId.push(cid);
			}
			sendGAEvents("Navigate into Folder - GridView");
			//_gaq.push(['_trackEvent',"Navigate into Folder - GridView", localStorage.getItem('UserId'),PageName]);
			var fileshareUrl;
			if(previousPage == "Share with Me"){
				fileshareUrl = "forword";
				if($.inArray('edit',FilePer)>-1){
				}else if($.inArray('owner',FilePer)>-1){

				}else{

				}
			}
			CFManageCloudAccountsAjaxCall.gotoInnerFolderandFiles(cid,fid,PageNumber,fileshareUrl, sharedFolderId);
			$('#'+viewTrack+'').trigger('click');
		});

		$('#main').on('click', '#LVContent div.LVfileName[name="FOLDER"] , #LVContent div.LVfileName[name="SITE"],#LVContent div.LVfileName[name="NOTEBOOK"]', function() {
			$('#listShowMore').addClass('divdisplay');
			$('#' + viewTrack + '').trigger('click');
			if(PageName == "Share with Me"){
				sharedFolderId = $(this).attr('sharedFolderId');
			}
			else if(PageName == "Share by Me"){
				sharedFolderId = $(this).attr('sharedFolderId');
			}
			else if(previousPage != "Share with Me" && PageName != "InnerFolders"){
				sharedFolderId = "";
			}
			if (count == 1) {
				previousPage = PageName;
			}
			FilePer = [];
			if(previousPage == "Share with Me"){
				FilePer.push($(this).closest('.panel-data').attr('fileper'));
			}
			PageName = $(this).attr('name') == "SITE" ? "SharepointSite" : "InnerFolders";
			CFHideContents();
			CFShowContents();
			count = count + 1;
			var PageNumber = 1;
			var fileid = $(this).attr('id');
			var cloudid = $(this).siblings('.LVdrive').attr('id');
			var pid = $(this).parent().attr('id');
			var filename = $(this).children('p').text();
			var test = $('#CloudDriveList').find('.catactive').closest('.clsubmenu').attr('id');
			var array = ["EGNYTE_STORAGE"];
			if ($.inArray(test, array) > -1) {
				var testId = fileid.split('/');
				var len = testId.length;
				if (testId[2] == "Private") {
					$('#CFUploadFiles').parent().addClass('buttonDisable')
				}else if (testId.length == 3 && testId[2] == "Shared") {
					$('#CFUploadFiles').parent().addClass('buttonDisable');
				}
			}
			SingleCloudId = cloudid;
			SinglePId = fileid;
			SingleObjectName = filename;
			if ($.inArray(fileid, InnerFolderId) == -1) {
				InnerFolderId.push(fileid);
				InnerCloudId.push(cloudid);
			}
			sendGAEvents("Navigate into Folder - ListView");
			//_gaq.push(['_trackEvent', "Navigate into Folder - ListView", localStorage.getItem('UserId'), PageName]);
			var fileshareUrl = $(this).attr('fileshare');
			if(previousPage == "Share with Me"){
				fileshareUrl = "forword";
				if($.inArray('edit',FilePer)>-1){

				}
				else if($.inArray('owner',FilePer)>-1){

				}
				else{

				}
			}
			CFManageCloudAccountsAjaxCall.gotoInnerFolderandFiles(cloudid, fileid, PageNumber, fileshareUrl, sharedFolderId);
		});

		function getReplaceFileIdParam(url, value) {
			//http://stackoverflow.com/questions/5413899/search-and-replace-specific-query-string-parameter-value-in-javascript
			url = url.replace(/([?|&]fileId=)[^\&]+/, '$1' +  value);
			return url;
		}
		function getParameterByName(url, name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(url);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		$('#CFASPCPassword').on('click', function(){
			$('#AccountSettings .ASPStatusMsg').text("");
			var pwd = $('#AccountSettings #ASPPwd').val();
			var cpwd = $('#AccountSettings #ASPCPwd').val();
			if(pwd !=cpwd){
				$('#AccountSettings .ASPStatusMsg').text("Password does not match");
			}
			if(pswd == "" && Rpswd == ""){
				$('#AccountSettings .ASPStatusMsg').text('Please enter the required fields');
				return false;
			}else if(pswd == ""){
				$('#AccountSettings .ASPStatusMsg').text('Please enter confirm password');
				$('#Cpswd').focus();
				return false;
			}else if(pswd.length > 20){
				$('#AccountSettings .ASPStatusMsg').text('Please enter a password less than 20 characters.');
				$('#Cpswd').focus();
				return false;
			}else if(pswd.length < 6){
				$('#AccountSettings .ASPStatusMsg').text('Please enter a password with atleast 6 characters.');
				$('#Cpswd').focus();
				return false;
			}else if(Rpswd == ""){
				$('#AccountSettings .DisplayMsg').text('Please Reenter password');
				$('#Rpswd').focus();
				return false;
			}else if(pswd != Rpswd){
				$('#AccountSettings .ASPStatusMsg').text('Password and Re-enter password should match.');
				$('#Rpswd').focus();
				return false;
			}
			if(pswd == Rpswd){
				sendGAEvents("Change Password");
				//_gaq.push(['_trackEvent',"Change Password", localStorage.getItem('UserId')]);
				var apiurl = apicallurl+'/auth/user/changepassword?newPassword='+Rpswd+'';
				$.ajax({
					type:"POST",
					url:apiurl,
					dataType:"json",
					headers: {
						"Content-Type": "application/json",
						"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
						"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
					},
					success: function(data){
					},
					error: function(error){
					}
				});
			}
		});
		$('#CFCreateFolder').on('click',function(){
			if(PageName == "CloudDrive" || PageName == "InnerFolders"){
				$('#LVContent').prepend('<div class="panel-data" name="back">' +
					'<div class="LVcheckBox"><input type="checkbox"/></div>' +
					'<div class="LVfileName" style="height:20px"><i class="LVFOLDER pull-left"></i>' +
					'<p class="pull-left"><input type="text" style="height:20px;float:left;" class="CFTHCreateFolder" placeholder="Folder Name"/>' +
					'<i class="FolderOk"></i><i class="FolderCancel"></i></p>' +
					'<a href="#" title=""><!--i class="MetaDataIcon"></i--></a></div>' +
					'<div class="LVFavorites">' +
					'<a href="#" id="LVFavorite" class="'+heart+'"></a></div>' +
					'<div class="LVfileSize" style="cursor:pointer;">---</div>' +
					'<div class="LVdrive">---</div>' +
					'<div class="LVaddedDate">---</div>' +
					'<div class="LVmodifiedDate">---</div></div>');
				$('#ThumbnailContent').prepend('<div class="file folder"  style="cursor:pointer;height:99px">' +
					'<i title="New Folder" class="filethumbnail" ></i>' +
					'<input type="text" placeholder="Folder Name" class="CFTHCreateFolder" style="width:100%;height:20px;"/>' +
					'<input type="checkbox" class="fileCheck"/>' +
					'<i class="FolderOk" style="position:absolute;left:0;top:134px"></i>' +
					'<i class="FolderCancel" style="position:absolute;left:24px;top:134px"></i></div>');
				var container ='';
				var container1 = '';
				if(viewTrack == 'LView'){
					container = $('.CFTHCreateFolder');
					container1 = $('.CFTHCreateFolder').siblings('.FolderOk');
				}else if(viewTrack == 'GView'){
					container = $('.CFTHCreateFolder');
					container1 = $('.FolderOk');
				}
				$('body').on('mouseup',function (e){
					if (container.is(e.target) || container1.is(e.target)){}
					else{
						$('.FolderCancel').trigger('click');
						//$('body').off('mouseup');
					}
				});
				$('.CFTHCreateFolder').focus();
				$('.FolderOk').on('click',function(){
					//$('body').off('mouseup');
					var FolderName = $(this).parent().children('input').val();
					if(FolderName.length == 0){
						$('.CFTHCreateFolder').css('border-color','red');
					}else{
						$('.CFTHCreateFolder').css('border-color','');
						$('#creating').removeClass("divdisplay");
						var _a = '';
						if(InnerFolderId.length == 0){
							_a = CFManageCloudAccountsAjaxCall.createFolder(SingleCloudId,"",FolderName);
						}else {
							_a = CFManageCloudAccountsAjaxCall.createFolder(SingleCloudId, SinglePId, FolderName);
						}
						if(_a){
							uploadPageTrack = "";
							$('.FolderOk').remove();
							$('.FolderCancel').remove();
						}
					}
					$('body').on('mouseup',function (e){
						if (container.is(e.target) || container1.is(e.target)){}
						else{
							$('.FolderCancel').trigger('click');
							$('body').off('mouseup');
						}
					});
				});
				$('.FolderCancel').on('click',function(){
					if(PageName == "CloudDrive" || PageName == "Favorites" || PageName == "InnerFolders"){
						$('#ThumbnailContent .folder:first').remove();
						$('#LVContent .panel-data:first').remove();
					}
					if(uploadPageTrack == "CloudDrive"){
						$('#ThumbnailContent .folder:first').remove();
						$('#LVContent .panel-data:first').remove();
					}
					uploadPageTrack = "";
				});
				$('#ThumbnailContent .CFTHCreateFolder, #LVContent .CFTHCreateFolder').on('keydown', function (event) {
					if (event.keyCode == 13) {
						$('body').off('mouseup');
						var FolderName =$(this).val();
						if(FolderName.length == 0){
							$('.CFTHCreateFolder').css('border-color','red');
						}else{
							$('.CFTHCreateFolder').css('border-color','');
							$('#creating').removeClass("divdisplay");
							if(InnerFolderId.length == 0){
								CFManageCloudAccountsAjaxCall.createFolder(SingleCloudId,"",FolderName);
							}else{
								CFManageCloudAccountsAjaxCall.createFolder(SingleCloudId , SinglePId, FolderName);
							}
							uploadPageTrack = "";
						}
					}else if(event.keyCode == 27){
						$('body').off('mouseup');
						$('.FolderCancel').trigger('click');
					}
					$('body').on('mouseup',function (e){
						if (container.is(e.target) || container1.is(e.target)){}
						else{
							$('.FolderCancel').trigger('click');
							$('body').off('mouseup');
						}
					});
				});
			}
			sendGAEvents("CreateFolder");
			//_gaq.push(['_trackEvent',"CreateFolder", localStorage.getItem('UserId'),PageName]);
		});
		$('#CFUploadVersionFiles').on('click', function(){
			Files = 0;
			count = 1;
			previousFileProgressSts = null;
			$('iframe').remove();
			var pageStatus = ["Recent files",
				"InnerFolders",
				"CloudDrive",
				"InnerWorkSpace",
				"InnerWorkspaceFolders",
				"Share by Me",
				"Share with Me",
				"Favorites",
				"Home",
				"Category"];
			if($.inArray(PageName , pageStatus)>-1){
				$('#UploadForm #fileUpload').click();
				$('#fileUpload').on('change', function(){
					var token= CFManageCloudAccountsAjaxCall.getAuthDetails();
					var url="";
					Files = $(this).get(0).files;
					$.each(Files, function(i, file){
						if(count == 1){
							mainProgress = 0;
							var Upname = Files[0].name;
							var Upsize = Files[0].size;
							url=""+apicallurl+"/fileshare/addrevision/content?token="+token+"&fileId="+VersionFileId+"&active=true&changeDesc=updated the revisions .Please approve&fileSize="+Upsize+"&newName="+Upname;
							var form = $('#UploadForm');
							form.attr('action',url);
							var iframe = $('<iframe name="UploadIframe" id="UploadIframe"  style="display: none"></iframe>');
							form.attr("target", "UploadIframe");
							$('body').append(iframe);
							$('#UploadForm').submit();
							$('#UploadIframe').load(function(){
								var iframeContents = $('#UploadIframe')[0].contentWindow.document.body.innerHTML;
								var tempstring = iframeContents.split('>');
								var tempstring1=tempstring[1].split('<');
								var obj = JSON.parse(tempstring1[0]);
								var fileslength = Files.length;
								var objlength = obj.length;
								var diff = fileslength - objlength;
								if(objlength != 0){
									if(obj.id == "Provider accepts Single File Stream , Please select Single File"){
										$('.progress-striped').remove();
										mainProgress = 0;
										//$.smallBox({title:"Provider accepts single file stream , please select single file.",color:"#e35e00",timeout:notifyError});
										alertError("Provider accepts single file stream , please select single file.");
										return false;
									}else if(obj.id == ""){
										$('.progress-striped').remove();
										mainProgress = 0;
										return false;
									}else{
										completeUpload(obj,diff,fileslength);
									}
								}else if(objlength == 0){
									$('.progress-striped').remove();
									mainProgress = 0;
									//$.smallBox({title:"The file is upload is failed or partially uploaded. Please download and verify.",color:"#1ba1e2",timeout:notifyError});
									alertSuccess("The file is upload is failed or partially uploaded. Please download and verify.");
								}
								document.getElementById("UploadForm").reset();
							});
						}
						count = count + 1;
						var formdata = new FormData();
						formdata.append("fileUpload", file);
						var ajax = new XMLHttpRequest();
						ajax.upload.addEventListener("progress", progressHandler, false);
						ajax.open("POST",'#');
						ajax.send(formdata);
					});
				});
			}else{
				$('#CFFolder').removeClass('divdisplay');
				$('#CFFolder').animate({right:'0px'}, 500);
			}
		});
		$('#CFUploadFiles').on('click',function(){
			if(PageName == 'InnerWorkSpace'){
				$(this).addClass('buttonDisable');
			}else{
				$(this).parent().addClass('buttonDisable');
			}

			Dropzone.prototype.defaultOptions.uploadMultiple = true;
			$('#panelPosition').removeClass('cf-plus4').addClass('cf-minus4');
			$('#my-awesome-dropzone').slideDown();
			setTimeout(function(){$('#my-awesome-dropzone').css('overflow-y','auto');},501);
			$('#dropZone_Upload').fadeIn();
			sendGAEvents("Upload");
			//_gaq.push(['_trackEvent',"Upload", localStorage.getItem('UserId'),PageName]);
		});
		$(document).on('click', '#favourite' ,function(){
			count=1;
			PageName = "Favorites";
			$('#CFHDelete .filecontrol-title').text('Remove');
			$('#CFHDelete').attr('title','Remove');
			document.title="Favorites";
			$('#headerText').text(PageName);
			PageNumber=1;
			CFManageCategoryAjaxCall.getFavouriteFiles(PageNumber);
			CFHideContents();
			CFShowContents();
			InnerFolderId = [];
			$('#'+viewTrack+'').trigger('click');
			sendGAEvents("Navigate to Favourites");
			//_gaq.push(['_trackEvent',"Navigate to Favourites", localStorage.getItem('UserId'),PageName]);
		});
		$(document).on('click','#CFSharedByMe',  function(){
			sendGAEvents("Navigate to SharedByMe");
			//_gaq.push(['_trackEvent',"Navigate to SharedByMe", localStorage.getItem('UserId')]);
			count=1;
			$('#spinner1').removeClass('divdisplay');
			PageName = "Share by Me";
			$('#CFHDelete .filecontrol-title').text('Unshare');
			$('#CFHDelete').attr('title','Unshare');
			document.title="Shared by me";
			$('#headerText').text("Shared by me");
			CFHideContents();
			CFShowContents();
			$('#ThumbnailContent').html('');
			$('#LVContent').html('');
			$('#listShowMore').addClass('divdisplay');
			PageNumber=1;
			setTimeout(function(){CFManageCategoryAjaxCall.getFilesShareByMe(PageNumber);},100);
			InnerFolderId = [];
			$('#'+viewTrack+'').trigger('click');
		});
		$(document).on('click','#CFSharedWithMe', function(){
			sendGAEvents("Navigate to SharedWithMe");
			//_gaq.push(['_trackEvent',"Navigate to SharedWithMe", localStorage.getItem('UserId')]);
			CFManageCloudAccountsAjaxCall.doIgnoreEvents('FILESHARE');
			$('#spinner1').removeClass('divdisplay');
			count=1;
			PageName = "Share with Me";
			$('#CFHDelete .filecontrol-title').text('Unshare');
			$('#CFHDelete').attr('title','Unshare');
			document.title="Shared with me";
			$('#headerText').text("Shared with me");
			CFHideContents();
			CFShowContents();
			$('#listShowMore').addClass('divdisplay');
			$('#ThumbnailContent').html('');
			$('#LVContent').html('');
			PageNumber=1;
			setTimeout(function() {
				CFManageCategoryAjaxCall.getFilesShareWithMe(PageNumber);
			},10);
			$('#'+viewTrack+'').trigger('click');
		});
		$('#page-header').on('click', '#LVFavorite', function(){
			sendGAEvents("Add To Favourites - ListView");
			//_gaq.push(['_trackEvent',"Add To Favourites - ListView", localStorage.getItem('UserId')]);
			var fileId=$(this).parents('.panel-data').children('.LVfileName').attr("id");
			var fcname=$(this).attr("class");
			var pname = PageName;
			if(fcname == heart){
				CFManageCategoryAjaxCall.addFavouriteFile(fileId);
				$(this).removeClass('cf-heart32');
				$(this).addClass('cf-heart22');
				$('#ThumbnailContent strong[id="'+fileId+'"]').siblings('#ThFav').removeClass('cf-heart32');
				$('#ThumbnailContent strong[id="'+fileId+'"]').siblings('#ThFav').addClass('cf-heart22');
			}
			if(fcname == heartFill){
				CFManageCategoryAjaxCall.removeFavoriteForFile(fileId);
				$(this).addClass('cf-heart32');
				$(this).removeClass('cf-heart22');
				$('#ThumbnailContent strong[id="'+fileId+'"]').siblings('#ThFav').addClass('cf-heart32');
				$('#ThumbnailContent strong[id="'+fileId+'"]').siblings('#ThFav').removeClass('cf-heart22');
				if(PageName == "Favorites"){
					$('#ListContent .LVfileName[id="'+fileId+'"]').parent('.panel-data').remove();
					$('#ThumbnailContent strong[id="'+fileId+'"]').parent('.file').remove();
				}
			}
		});
		$('#page-header').on('click', '#ThFav', function(){
			sendGAEvents("Add To Favourites - GridView");
			//_gaq.push(['_trackEvent',"Add To Favourites - GridView", localStorage.getItem('UserId'),PageName]);
			var fileId = $(this).parent('.file').children('strong').attr('id');
			var favCname = $(this).attr('class');
			if(favCname == heart){
				CFManageCategoryAjaxCall.addFavouriteFile(fileId);
				$(this).removeClass('cf-heart32');
				$(this).addClass('cf-heart22');
				$('#ListContent .LVfileName[id="'+fileId+'"]').siblings('.LVFavorites').children('#LVFavorite').removeClass('cf-heart32');
				$('#ListContent .LVfileName[id="'+fileId+'"]').siblings('.LVFavorites').children('#LVFavorite').addClass('LVFav');
			}
			if(favCname == "cf-heart22"){
				CFManageCategoryAjaxCall.removeFavoriteForFile(fileId);
				$(this).addClass('cf-heart32');
				$(this).removeClass('cf-heart22');
				$('#ListContent .LVfileName[id="'+fileId+'"]').siblings('.LVFavorites').children('#LVFavorite').removeClass('LVFav');
				$('#ListContent .LVfileName[id="'+fileId+'"]').siblings('.LVFavorites').children('#LVFavorite').addClass('cf-heart32');
				if(PageName == "Favorites"){
					$('#ListContent .LVfileName[id="'+fileId+'"]').parent('.panel-data').remove();
					$('#ThumbnailContent strong[id="'+fileId+'"]').parent('.file').remove();
				}
			}
		});
		$(document).on('click','#CFRecentFilesAndFolders', function(){
			sendGAEvents("Navigate to Recent Files");
			//_gaq.push(['_trackEvent',"Navigate to Recent Files", localStorage.getItem('UserId')]);
			count=1;
			$('#spinner1').removeClass('divdisplay');
			$('#CFHDelete .filecontrol-title').text('Delete');
			$('#CFHDelete').attr('title','Delete');
			PageName = "Recent files";
			CFHideContents();
			CFShowContents();
			document.title="Recent files";
			$('#headerText').text("Recent files");
			PageNumber=1;
			CFManageCloudAccountsAjaxCall.getRecentFilesandFolders(PageNumber);
			$('#breadCrumbdync').empty();
			$('#breadCrumbdync').append('<li id="RecentFiles" class="BCRFList" cloudId="RecentFiles" fileId="RecentFiles"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">Files</a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a href="#"> Recent files</a></li>');
			var thumbNails = $('#mainContent').find('#ThumbnailContent .file');
			var thumbNailsCheck = $('#mainContent').find('#ThumbnailContent input.fileCheck');
			thumbNails.hover(function(){
				$(this).addClass('active');
			},function(){
				CFHPthumbnail.UncheckFile();
			});
			InnerFolderId = [];
			$('#'+viewTrack+'').trigger('click');
		});
		$('#openFiles').on('click', function(e){
			if(PageName == "InnerWorkSpace"){
				$('#workspaceFiles').find('.wsfcheckbox').find("input:checkbox").each(function (){
					if ($(this).is(":checked")) {
						$(this).parent().siblings('.sorting_1').click();
					}
				});
			}
			$('#LVContent').find('.LVcheckBox').find("input:checkbox").each(function (){
				if ($(this).is(":checked")) {
					$(this).parent().siblings('.LVfileName').children('p').click();
				}
			});
			$('#ThumbnailContent').find("input:checkbox").each(function (){
				if ($(this).is(":checked")) {
					$(this).parent().children('.filethumbnail').click();
				}
			});
		});
		$('#filePreview').find('button').on('click', function(){
			$('#page-header input[type="checkbox"]').attr('checked', false);
		});
		$('#CFDownload').on('click', function(e){
			sendGAEvents("Download");
			var viewCountDownload;
			var maxViewCountDownload;
			e.preventDefault();
			downCount = 0;
			var sharedFolderFiles = [];
			$('body').find('iframe').remove();
			for(var i=0;i < FromfileId.length;i++) {
				var shareFolId = $('[id="' + FromfileId[i] + '"]').parents('.panel-data').children('.LVfileName').attr("sharedfolderid");
				if (shareFolId != undefined && shareFolId != '') {
					var sharedFolderFile = {};
					sharedFolderFile.sharedfolderid = shareFolId;
					sharedFolderFile.fileid = FromfileId[i];
					sharedFolderFiles.push(sharedFolderFile);
				}
			}
			if(PageName == "Share with Me" || sharedFolderFiles.length > 0){
				if(FromfileId.length > 1){
					for(var i=0;i < FromfileId.length;i++){
						if(!$('[id="'+FromfileId[i]+'"]').children('p').children('sup').hasClass("Protected")){
						}else{
							//$.smallBox({title:"Please select protected files Individually.",color:"#1ba1e2",timeout:notifyError});
							alertSuccess("Please select protected files Individually.");
							return false;
						}
					}
				}
				$.each(FromfileId, function(i,downfileid) {
					var fileinfo;
					var shareUrl;
					var accessToken;
					var sharedFolderId = getShareFolderIdByFileId(sharedFolderFiles, downfileid);
					if (sharedFolderId != undefined && sharedFolderId != '') {
						fileinfo = CFHPlistview.getFileShare(sharedFolderId);
					} else {
						fileinfo = CFHPlistview.getFileShare(downfileid);
					}
					viewCountDownload = fileinfo.viewCount;
					maxViewCountDownload = fileinfo.maxViewCount;
					if (fileinfo == 0) {
						setTimeout(function () {
							PageNumber = 1;
							CFManageCategoryAjaxCall.getFilesShareWithMe(PageNumber);
						}, 100);
						$('[id="' + downfileid + '"]').parent('.panel-data').remove();
						$('[id="' + downfileid + '"]').parent('.file').remove();
						showNotyNotification('notify',"file(s) download count may have been exceeded or file(s) is expired. Please contact the Owner.")
					}else if (PageName == "Share with Me" || sharedFolderFiles.length > 0) {
						if (fileinfo.sharePassword != "NOT_REQUIRED") {
							shareUrl = fileinfo.shareUrl;
							accessToken = getParameterByName(shareUrl,"accessToken");
							var url = "";
							if(PageName == "InnerFolders"){
								url = apicallurl + '/fileshare/content/revision/latest?' +
									'fileId=' + encodeURIComponent(downfileid) +
									'&accessToken=' + accessToken +
									'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() +
									'&sharePassword='+fileinfo.sharePassword+
									'&sharedFolderId='+sharedFolderId;
								downloadURL(url);
							}else{
								$('#CFDownloadPwd').click();
								url = apicallurl + '/fileshare/content/revision/latest?fileId=' + encodeURIComponent(downfileid) + '&accessToken=' + accessToken + '&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '&sharePassword=';
								$('#myPasswordModel').find('button:eq(0)').val(url);
							}
						}else {
							if (viewCountDownload == maxViewCountDownload) {
								var user = JSON.parse(localStorage.getItem('CFUser'));
								user = user.primaryEmail;
								var emails = "coOwnerEmails=" + user + "&editEmails=" + user + "&readEmails=" + user + "&fileId=" + downfileid;
								CFHPlistview.removeFileshare(emails);
								setTimeout(function () {
									CFManageCategoryAjaxCall.getFilesShareWithMe(PageNumber);
								}, 500);

								showNotyNotification('notify',
									"Your download count may have been exceeded or file is expired. Please contact the Owner.")
							}else {
								shareUrl = fileinfo.shareUrl;
								accessToken = getParameterByName(shareUrl,"accessToken");
								url = apicallurl + '/fileshare/content/revision/latest?fileId=' + encodeURIComponent(downfileid) + '&accessToken=' + accessToken + '&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '&sharePassword=';
								if (sharedFolderId != undefined && sharedFolderId != '') {
									url = url + "&sharedFolderId=" + sharedFolderId
								}
								downloadURL(url);
							}
						}
					}else {
						shareUrl = fileinfo.shareUrl;
						var password = fileinfo.sharePassword;
						accessToken = getParameterByName(shareUrl,"accessToken");
						url = apicallurl + '/fileshare/content/revision/latest?fileId=' + encodeURIComponent(downfileid) + '&accessToken=' + accessToken + '&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '&sharePassword=' + password + '&WorkspaceId=' + WorkSpaceId;
						downloadURL(url);
						setTimeout(function () {
							if (PageName == "InnerWorkSpace") {
								$('#workspaceAct').html('');
								workspaceActicities(WorkSpaceId, 1);
							}
						}, 2000);
					}
				});
			}
			else if(PageName == "InnerWorkSpace") {
				$.each(FromfileId, function (i, downfileid) {
					url = apicallurl + '/filefolder/content?fileId=' + encodeURIComponent(downfileid) +
						'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '&workspaceId=' + WorkSpaceId;
					downloadURL(url);
				});
				$('#main').find('input').prop('checked',false);
				disableActionPanel();
			}
			else {
				$.each(FromfileId, function (i, downfileid) {
					url = apicallurl + '/filefolder/content?fileId=' + encodeURIComponent(downfileid) +
						'&token=' + CFManageCloudAccountsAjaxCall.getAuthDetails() + '';
					downloadURL(url);
				});
			}
		});

		function getShareFolderIdByFileId(coll, fileId){
			for(var i=0;i<coll.length;i++){
				if(coll[i].fileid  == fileId){
					return coll[i].sharedfolderid;
				}
			}
		}
		// sideBar navigation
		$('#CFDownloadPwd').click(function() {
			$('#Msg .statusMesg').text("");
			$('#sharePswd').val("");
		});
		$('#CFPwdButton').click(function() {
			var pwd = $('#sharePswd').val();
			var fileinfo = '';
			if (pwd == "") {
				$('#sharePswd').focus();
				$('#Msg .statusMesg').text('Please enter password');
				return false;
			}
			if(previousPage == "Share with Me"){
				if(sharedFolderId == undefined || sharedFolderId == ""){
					fileinfo = CFHPlistview.getFileShare(FromfileId[0]);
					sharedFolderId = "";
				}else{
					fileinfo = CFHPlistview.getFileShare(sharedFolderId);
				}
			}else{
				fileinfo = CFHPlistview.getFileShare(FromfileId[0]);
			}
			var sPwd = fileinfo.sharePassword;
			if (pwd != sPwd) {
				$('#Msg .statusMesg').text('Please enter valid password.');
				return false;
			}
			if (pwd == sPwd) {
				var url = $('#myPasswordModel').find('button:eq(0)').val();
				url += pwd;
				if(previousPage == "Share with Me"){
					url += "&sharedFolderId="+sharedFolderId
				}
				sendGAEvents("Protected Download");
				//_gaq.push(['_trackEvent',"Protected Download", localStorage.getItem('UserId'),PageName]);
				downloadURL(url);
				$('#myPasswordModel').modal('hide');
			}else {
				return false;
			}
		});
		//File preview
		$(document).on('click', '.LVFILE', function(){
			var thisFileId = $(this).parent('.LVfileName').attr('id');
			var url = apicallurl+'/filefolder/content?fileId='+encodeURIComponent(thisFileId)+'&token='+CFManageCloudAccountsAjaxCall.getAuthDetails()+'';
		});
		var cat = [];
		var catid= [];
		$('#addToCategory').on('click', function(e){
			sendGAEvents("Add To Category");
			//_gaq.push(['_trackEvent',"Add To Category", localStorage.getItem('UserId'),PageName]);
			$('#addtocatlist').html('');
			$('#addtocatlist').css('border-color','');
			$('#addtocatlist').append('<option data-placeholder="true">Select Category</option>');
			cat = [];
			catid= [];
			$('#categoryList a').each(function(){
				var scat = ["Photos", "Music", "Videos", "Documents", "Others"];
				if($.inArray($(this).text(),scat) < 0){
					cat.push($(this).text());
					catid.push($(this).parent().attr('id'));
				}
			});
			$.each(cat,function(i,ca){
				$('#addtocatlist').append('<option>'+ca+'</option>');
			});
			$('#mycategorymodel').modal();
			$('#addtocatlist').on('change',function(){
				var catname = $('#addtocatlist').val();
				if(catname == "Select Category"){
					$('#addtocatlist').css('border-color','red');
					return false
				}else{
					$('#addtocatlist').css('border-color','');
					return false
				}
			});
		});
		$('#mycategorymodel').on('click','#addtocategory',function(e){
			e.preventDefault();
			var catname = $('#addtocatlist').val();
			if(catname == "Select Category"){
				$('#addtocatlist').css('border-color','red');
				return false
			}else{
				$('#addtocatlist').css('border-color','');
				$('#cancelcategory').trigger('click');
				var catindex = $.inArray(catname , cat);
				var categid = catid[catindex];
				if(categid != "undefined"){
					CFManageCloudAccountsAjaxCall.addCategoryToFiles(categid,FromfileId);
				}
			}
		});
		$('#CFHDelete').on('click', function(){
			sendGAEvents("Delete");
			//_gaq.push(['_trackEvent',"Delete", localStorage.getItem('UserId'),PageName]);
			$('#deletemodal .tab-header').find('span').text('Delete');
			$('.deletemodalid').text('Delete');
			$('#deletefilename').css('font-size','15pt');
			var pname = PageName;
			if(pname == "WorkSpace"){
				$('#deletemodal #deletesection').text("Are you sure you want to delete the selected Workspace(s)?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteWs');
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromWorkspaceName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else if(pname == "Share with Me"){
				$('#deletemodal #deletesection').text("Are you sure you want to remove the selected file(s) from Shared with me?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteSharedwithfile');
				$('#deletemodal .tab-header').find('span').text('Delete');
				$('#deletemodal #CFDeleteSharedwithfile').text('Remove');
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else if(pname == "Tag"){
				$('#deletemodal #deletesection').text("Are you sure you want to remove the selected file(s) from this Tag?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteTagFiles');
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else if(pname == "Category"){
				$('#deletemodal #deletesection').text("Are you sure you want to remove the selected file(s) from this Category?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteCatFiles');
				$('#deletemodal .tab-header').find('span').text('Remove');
				$('#deletemodal #CFDeleteCatFiles').text('Remove');
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else if(pname == "Favorites"){
				$('#deletemodal #deletesection').text("Are you sure you want to remove the selected file(s) from favorites?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteFavFile');
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else if(pname == 'Share by Me'){
				$('#deletemodal #deletesection').text("Are you sure you want to remove the selected file from Shared by me?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteShareBMFile');
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else if(pname == 'InnerWorkSpace'){
				$('#deletemodal #deletesection').text("Are you sure you want to remove the selected file(s) from Workspace?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteFile');
				$('#deletemodal').find('span').text("Remove");
				$('#CFDeleteFile').text("Remove");
				if(FromfileId.length == 1){
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					$('#deletefilename').text('');
				}
			}else{
				$('#deletemodal #deletesection').text("Are you sure you want to delete the selected file(s)?");
				$('#deletemodal .deletemodalid').attr('id','CFDeleteFile');
				if(FromfileId.length == 1){
					if(FileType == "FOLDER"){
						$('#deletemodal #deletesection').text("Are you sure you want to delete the selected folder(s)?");
					}
					$('#deletefilename').text(FromObjectName[0]);
				}else{
					if($.inArray('FILE',FileType) > -1){
					}else{
						$('#deletemodal #deletesection').text("Are you sure you want to delete the selected folder(s)?");
					}
					if(PageName == "InnerWorkSpace"){
						$('#deletemodal #deletesection').text("Are you sure you want to delete the selected file(s)?");
					}
					$('#deletefilename').text('');
				}
			}
		});
		$('#canceldelete').on('click',function(){
			disableActionPanel();
			$('#page-header input').prop('checked',false);

		});
		$('#deletemodal').on('click','#CFDeleteWs' ,function(){
			$.each(FromfileId,function(i,fileId){
				sendGAEvents("Delete Workspace / File in Workspace",PageName+"/"+fileId+"/"+WorkSpaceId);
				//_gaq.push(['_trackEvent',"Delete Workspace / File in Workspace", localStorage.getItem('UserId'),PageName+"/"+fileId+"/"+WorkSpaceId]);
				var userDetails  = JSON.parse(localStorage.getItem("CFUser"));
				var email        = userDetails.primaryEmail;
				wsDetails = CFWlistview.getWorkspaceDetails(fileId);
				var wsOwner      = wsDetails.user.primaryEmail;
				var opType;
				var updateEmail="";
				if(wsOwner == email){
					CFManageCloudAccountsAjaxCall.deleteWorspace(fileId);
				}else{
					updateEmail += 'workspaceId=' + fileId + '&';
					updateEmail += 'readEmails=' + email + '&';
					updateEmail += 'editEmails=' + email + '&';
					updateEmail += 'coOwnerEmails=' + email;
					CFManageCloudAccountsAjaxCall.removeWorkspace(fileId,updateEmail);
				}
			});
			disableActionPanel();
			if(PageName == "WorkSpace"){
				$('#CFEditWorkSpace').addClass('buttonDisable');
			}
			if(PageName == "InnerWorkSpace"){
				$('#CFEditWorkSpace').removeClass('buttonDisable');
			}
		});
		$('#deletemodal').on('click','#CFDeleteFavFile' ,function(){
			$.each(FromfileId,function(i,fileId){
				sendGAEvents("Delete files in Favourites",fileId);
				//_gaq.push(['_trackEvent',"Delete files in Favourites", localStorage.getItem('UserId'),fileId]);
				CFManageCategoryAjaxCall.removeFavoriteForFile(fileId);
				$('#ListContent .LVfileName[id="'+fileId+'"]').parent('.panel-data').remove();
				$('#ThumbnailContent strong[id="'+fileId+'"]').parent('.file').remove();
			});
			disableActionPanel();
		});
		$('#deletemodal').on('click','#CFDeleteCatFiles' ,function(){
			for(var i=0; i < FromfileId.length; i++){
				sendGAEvents("Delete files in Category",globalCategoryId+"/"+FromfileId[i]);
				//_gaq.push(['_trackEvent',"Delete files in Category", localStorage.getItem('UserId'),globalCategoryId+"/"+FromfileId[i]]);
				CFManageCategoryAjaxCall.removeFilesFromCategory(FromfileId[i],globalCategoryId);
			}
			disableActionPanel();
		});
		$('#deletemodal').on('click','#CFDeleteShareBMFile' ,function(){
			for(var i=0; i < FromfileId.length; i++){
				sendGAEvents("Delete files in ShareByMe",FromfileId[i]);
				//_gaq.push(['_trackEvent',"Delete files in ShareByMe", localStorage.getItem('UserId'),FromfileId[i]]);
				CFHPlistview.deleteFileshare(FromfileId[i]);
			}
			disableActionPanel();
		});
		$('#deletemodal').on('click','#CFDeleteFile', function() {
			if (PageName == "InnerWorkSpace") {
				$('#wsdeleting').show();
			}
			$('#deleting').removeClass("divdisplay");
			$('#spinner2').removeClass("divdisplay");
			setTimeout(function () {
				deleteFile();
			}, 200);
		});
		function deleteFile(){
			var pname = PageName;
			if(pname == "InnerWorkSpace"){
				$('#commentContent').html('');
				CFManageCloudAccountsAjaxCall.deleteWorkspaceFile(WorkSpaceId,FromfileId);
				$('#commentText').val('');
				$('#fileComments').html('');
				$('.commentContent').hide();
				$('#addingComments').addClass("divdisplay");
				$('#commentHeader').addClass("divdisplay");
				$('#workspaceAct').html('');
				workspaceActicities(WorkSpaceId, 1);
			}else{
				for(var i=0; i < FromObjectName.length; i++){
					sendGAEvents("Delete files",PageName+"/"+FromfileId[i]);
					//_gaq.push(['_trackEvent',"Delete files", localStorage.getItem('UserId'),PageName+"/"+FromfileId[i]]);
					CFManageCloudAccountsAjaxCall.deleteFile(FromfileId[i]);
				}
			}
			disableActionPanel(actionPanel)
		}

		$('#deletemodal').on('click','#CFDeleteSharedwithfile', function(){
			for(var i=0; i < FromfileId.length; i++) {
				sendGAEvents("Delete files in SharedWithMe",FromfileId[i]);
				//_gaq.push(['_trackEvent', "Delete files in SharedWithMe", localStorage.getItem('UserId'), FromfileId[i]]);
				var UserObj = JSON.parse(localStorage.getItem('CFUser'));
				var uemail = UserObj.primaryEmail;
				var fid = encodeURIComponent(FromfileId[i]);
				var updateEmail = "";
				updateEmail += 'readEmails=' + uemail + '&';
				updateEmail += 'editEmails=' + uemail + '&';
				updateEmail += 'coOwnerEmails=' + uemail + '&';
				updateEmail += 'fileId=' + fid;
				CFHPlistview.removeFileshare(updateEmail, FromfileId[i]);
			}
			disableActionPanel(actionPanel);
		});
		var timeoutReference;
		$(document).on('keydown','#CFHomeSearch' ,function (event){
			sendGAEvents("Search")
			//_gaq.push(['_trackEvent',"Search", localStorage.getItem('UserId'),PageName]);
			PageNumber=1;
			if (timeoutReference){
				clearTimeout(timeoutReference);
			}
			timeoutReference = setTimeout(function() {
				searchTerm = $('.search').val();
				$('.secondary-nav-menu > li').removeClass('active');
				$('#CFRecentFilesAndFolders').parent().addClass('active');
				$('#headerText').text("Recent files");
				$('#breadCrumbdync').empty();
				$('#breadCrumbdync').append('<li id="RecentFiles" class="BCRFList" cloudId="RecentFiles" fileId="RecentFiles"><a href="#"  style="color:blue;text-decoration:underline;">Files</a><span> > </span> <a href="#"> Recent files</a><span class="divider"></span></li>');
				if(count == 1){
					previousPage = PageName;
				}
				count= count+1;
				if(previousPage == "WorkSpace"){
					return false;
				}else if (event.keyCode == 8 || event.keyCode == 46) {
					PageName = "search";
					CFManageCloudAccountsAjaxCall.searchFiles(searchTerm , PageNumber);
				}else{
					PageName = "search";
					CFManageCloudAccountsAjaxCall.searchFiles(searchTerm , PageNumber);
				}
			},900);
			$('#CFHomeSearch').focus();
		});

		$('#ConfirmPswd').click(function(){
			var pswd = $('#Cpswd').val();
			var Rpswd = $('#Rpswd').val();
			if(pswd == "" && Rpswd == ""){
				$('#AccountSettings .DisplayMsg').text('Please enter the required fields');
				return false;
			}else if(pswd == ""){
				$('#AccountSettings .DisplayMsg').text('Please enter confirm password');
				$('#Cpswd').focus();
				return false;
			}else if(pswd.length > 18){
				$('#AccountSettings .DisplayMsg').text('Please enter a password less than 18 characters.');
				$('#Cpswd').focus();
				return false;
			}else if(pswd.length < 6){
				$('#AccountSettings .DisplayMsg').text('Please enter a password with atleast 6 characters.');
				$('#Cpswd').focus();
				return false;
			}else if(Rpswd == ""){
				$('#AccountSettings .DisplayMsg').text('Please Reenter password');
				$('#Rpswd').focus();
				return false;
			}else if(pswd != Rpswd){
				$('#AccountSettings .DisplayMsg').text('Password and Re-enter password should match.');
				$('#Rpswd').focus();
				return false;
			}
			if(pswd == Rpswd){
				sendGAEvents("ChangePassword");
				//activecampaign.eventTrack('Change Password',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
				//_gaq.push(['_trackEvent',"Change Password", localStorage.getItem('UserId')]);
				Rpswd=CryptoJS.MD5(Rpswd);
				var apiurl = apicallurl+'/auth/user/changepassword?newPassword='+Rpswd+'';
				$.ajax({
					type:"POST",
					url:apiurl,
					dataType:"json",
					headers: {
						"Content-Type": "application/json",
						"Authorization": localStorage.getItem("UserAuthDetails"),
						"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
					},
					success: function(data){
						if(data == null)
						{
							$('#AccountSettings .DisplayMsg').text('Password updated successfully');
							var uid=localStorage.getItem("UserId");
							var pwd= pswd;
							pwd=CryptoJS.MD5(pwd);
							localStorage.setItem('UserAuthDetails',CFHPActions.BasicAuth(uid,pwd));
						}
					},
					complete:function(xhr){
						if(xhr.status > 300){
							//$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
							alertError("Operation Failed");
						}
					},
					error: function(error){
					}
				});
			}
		});
		$('#CFEditName').on('click', function(){
			sendGAEvents("Update Name");
			//activecampaign.eventTrack('Update Name',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
			//_gaq.push(['_trackEvent',"Change Name", localStorage.getItem('UserId')]);
			var UserName = $('.ProfileContent').text();
			$('.ProfileContent').html("<span class='editUser'><input type='text' name='username' value='"+UserName+"' autofocus /></span>");
			$('.ProfileContent input').focusout(function(){
				$('.ProfileContent').text(UserName);
			});
			$('.ProfileContent input').focusout(function(){
				var Updatedusername = $(this).val();
				CFManageCloudAccountsAjaxCall.updateUserName(Updatedusername);
			});
			$('.ProfileContent input').keydown(function (event) {
				var Updatedusername = $(this).val();
				if (event.keyCode == 13) {
					CFManageCloudAccountsAjaxCall.updateUserName(Updatedusername);
				}else if(event.keyCode == 27){
					$('.ProfileContent').text(UserName);
				}
			});
		});
		$('#globalRefresh').on('click',function(e){
			$(this).addClass('refreshicon1 refreshloader');
			$(this).removeClass('refreshicon');
//			CFManageCloudAccountsAjaxCall.refreshcloud("all");
		});
	},
	BasicAuth : function(uid,pwd) {
		var tok = uid + ':' + pwd;
		var hash = btoa(tok);
		return "Basic " + hash;
	},
	getMoveCount : function(){
		var _a = null;
		$.ajax({
			type: "GET",
			url: apicallurl + "/move/usermovelimit",
			async: false,
			dataType: "json",
			headers: {
				"Content-Type": "application/json",
				"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
			},
			success: function (xhr) {
				return _a = xhr;
			},
			complete:function(xhr){
				return _a = xhr;
			}
		});
		return _a;
	},
	getNoLimitVerifyStatus : function(b) {
		var _a = null;
		$.ajax({
			type: "POST",
			url: apicallurl + "/move/verify",
			async: false,
			dataType: "json",
			data: b,
			headers: {
				"Content-Type": "application/json",
				"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
			},
			complete: function (xhr) {
				return _a = xhr;
			}
		});
		return _a;
	},
	getVerifyStatus : function(b,fileCount,fileSize,fileType) {
		var _a = null;
		$.ajax({
			type: "POST",
			url: apicallurl + "/move/verify?remainingCount="+fileCount+"&remainingSize="+fileSize,
			async: false,
			dataType: "json",
			data: b,
			headers: {
				"Content-Type": "application/json",
				"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
			},
			success: function(data){
				if(data !== null)
				{

					if(fileType !== "FOLDER") {
						localStorage.setItem("fileSizeMessage", data.message);
						localStorage.setItem("remainFileFolderSize", data.remaianingSize);
						localStorage.setItem("remainFileFolderCount", data.remainingNoFiles);
					}

				}
			},
			complete: function (xhr,statusText) {
				return _a = xhr;
			}
		});
		return _a;
	},
	getFileCount : function(a,filecount,fileSize){
		var _a = null;
		$.ajax({
			type: "POST",
			url: apicallurl + "/move/filecountinfolder?remainingCount="+filecount+"&remainingSize="+fileSize,
			async: false,
			dataType: "json",
			data: a,
			headers: {
				"Content-Type": "application/json",
				"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
			},
			success: function(data){
				if(data !== null)
				{

					localStorage.setItem("fileSizeMessage", data.message);
					localStorage.setItem("remainFileFolderSize",data.remaianingSize);
					localStorage.setItem("remainFileFolderCount",data.remainingNoFiles);

				}
			},
			complete: function (xhr) {
				return _a = xhr;
			}
		});
		return _a;
	}
};

var selectEvent = {
	init:function(){
		var thumbNails = $('#mainContent').find('#ThumbnailContent .file');
		var thumbNailsCheck = $('#mainContent').find('#ThumbnailContent input.fileCheck');
		thumbNails.hover(function(){
			$(this).addClass('active');
			CFHPthumbnail.currentFile = this;
		},function(){
			CFHPthumbnail.UncheckFile();
		});
		thumbNailsCheck.on('click',function(){CFHPthumbnail.checkFile();});
	}
};

//Select All Files List View
$('#main').on('change','.LVHcheckBox>input[type="checkbox"]',function(){
	FromfileId = [];
	FromcloudId = [];
	FromObjectName = [];
	Extention = [];
	FileType = [];
	var temp = FilePer;
	if(PageName == "InnerFolders" && previousPage == "Share with Me"){ }
	else{
		FilePer = [];
	}
	if($(this).is(':checked')){
		sendGAEvents("Select All Files - List View");
		//_gaq.push(['_trackEvent', "Select All Files - List View", localStorage.getItem('UserId'), PageName]);
		$('#LVContent').find('input[type="checkbox"]').prop('checked', true);
		$('#LVContent').find('.panel-data').addClass('panel-dataHoverClass');
		var count = $('#LVContent').children('.panel-data').length;
		if(count > 0){
			$('#LVContent').find('.LVcheckBox').find("input:checkbox").each(function () {
				FromfileId.push($(this).parent().siblings('.LVfileName').attr('id'));
				FromcloudId.push($(this).parent().siblings('.LVdrive').attr('id'));
				FromObjectName.push($(this).parent().siblings('.LVfileName').children('p').attr('name'));
				Extention.push($(this).parent().siblings('.LVfileName').children('p').attr('fexten'));
				FileType.push($(this).parent().parent().attr('data-type'));
				FilePer.push($(this).parent().parent().attr('fileper'));
			});
		}
		iconEnable(count,temp);
	}else{
		clearSelectFiles();
		$('#LVContent input[type="checkbox"]').prop('checked', false);
		$('#LVContent').find('.panel-data').removeClass('panel-dataHoverClass');
	}
});

//Select List View
$('#main #LVContent').on('change','div.LVcheckBox > input',function () {
	sendGAEvents("Select Files - List View");
	FromfileId = [];
	FromcloudId = [];
	FromObjectName = [];
	Extention = [];
	FileType = [];
	var temp = FilePer;
	FilePer = [];
	var checkCount = $('.LVcheckBox input[type="checkbox"]:checked').length;
	if($(this).not(':checked')){
		$(this).closest('.panel-data').removeClass('panel-dataHoverClass');
	}
	if($(this).is(':checked')){
		$(this).closest('.panel-data').addClass('panel-dataHoverClass');
	}
	$(".LVcheckBox>input:checked").each(function () {
		FromfileId.push($(this).parent().siblings('.LVfileName').attr('id'));
		FromcloudId.push($(this).parent().siblings('.LVdrive').attr('id'));
		FromObjectName.push($(this).parent().siblings('.LVfileName').children('p').attr('name'));
		Extention.push($(this).parent().siblings('.LVfileName').children('p').attr('fexten'));
		FileType.push($(this).parent().parent().attr('data-type'));
		FilePer.push($(this).parent().parent().attr('fileper'));
	});

	iconEnable(checkCount,temp);
});

//Select Thumb View - Workspace
$('#main #ThumbnailContent').on('change','div.file > input', function () {
	FromfileId = [];
	FromcloudId = [];
	FromObjectName = [];
	Extention = [];
	FileType = [];
	var temp = FilePer;
	FilePer = [];
	$("#ThumbnailContent input:checked").each(function (e) {
		sendGAEvents("Select Files - Grid View");
		//_gaq.push(['_trackEvent', "Select Files - Grid View", localStorage.getItem('UserId'), PageName]);
		var fid = $(this).parent().children('strong').attr('id');
		FromfileId.push(fid);
		var fcid = $(this).parent().attr('id');
		FromcloudId.push(fcid);
		var fname = $(this).parent().children('i').attr('title');
		FromObjectName.push(fname);
		var fext = $(this).parent().children('strong').attr('fexten');
		Extention.push(fext);
		var ftype = $(this).parent().attr('data-type');
		FileType.push(ftype);
		var type = $(this).parent().attr('fileper');
		FilePer.push(type);
	});
	var count = $("#ThumbnailContent input:checked").length;
	if(PageName == "WorkSpace"){
		var iconObject = {
			"open":false,
			"download":true,
			"rename":false,
			"delete":false,
			"edit":true
		};
		if(count == 0){
			var _a ={
				"open":true,
				"download":true,
				"rename":true,
				"delete":true,
				"edit":true
			};
			wRootIocnsHide(_a)
		}
		if(count > 0){
			var icons, final;
			if(count == 1){
				wsDetails = CFWlistview.getWorkspaceDetails(FromfileId[0]);
				icons = wRootEnable(iconObject);
				final = $.extend(iconObject,icons);
				wRootIocnsHide(final);
			}else{
				icons = {
					"open":true,
					"download":true,
					"rename":true
				};
				final = $.extend(iconObject,icons);
				wRootIocnsHide(final);
			}
			$('.filecontrols').removeClass('buttonDisable');
		}
	}
	else{
		iconEnable(count,temp);
	}
});

function wRootEnable(object){
	var useremail = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
	if (wsDetails.readEmails != null && $.inArray(useremail,wsDetails.readEmails) > -1) {
		object.rename = true;
	}else if(wsDetails.editEmails != null && $.inArray(useremail,wsDetails.editEmails) > -1) {
		object.edit = true;
	}else{
		object.edit = false;
	}
	return object;
}

function wRootIocnsHide(object){
	if(object.open){
		$('#openFiles').css('pointer-events', 'none');
		$('#openFiles > div').css('opacity', '0.2');
	}else{
		$('#openFiles').css('pointer-events', 'auto');
		$('#openFiles > div').css('opacity', '1');
	}
	if(object.download){
		$('#CFDownload').css('pointer-events', 'none');
		$('#CFDownload > div').css('opacity', '0.2');
	}else{
		$('#CFDownload').css('pointer-events', 'auto');
		$('#CFDownload > div').css('opacity', '1');
	}
	if(object.rename){
		$('#CFHRename').css('pointer-events', 'none');
		$('#CFHRename > div').css('opacity', '0.2');
	}else{
		$('#CFHRename').css('pointer-events', 'auto');
		$('#CFHRename > div').css('opacity', '1');
	}
	if(object.delete){
		$('#CFHDelete').css('pointer-events', 'none');
		$('#CFHDelete > div').css('opacity', '0.2');
	}else{
		$('#CFHDelete').css('pointer-events', 'auto');
		$('#CFHDelete > div').css('opacity', '1');
	}
	if(object.edit){
		$('#CFEditWorkSpace').addClass('buttonDisable');
	}else{
		$('#CFEditWorkSpace').removeClass('buttonDisable');
	}
}
//selectEvent Functions
function iconEnable(checkCount,temp){
	var iconObj = {
		"open":false,
		"download":false,
		"share":false,
		"rename":false,
		"delete":false,
		"category":false,
		"workspace":false,
		"folder":false,
		"upload":false
	};
	var disableObject = {}, icons;
	var _c = $('#CloudDriveList').find('.catactive').closest('.clsubmenu').attr('id');
	var _sn = $('#secondary').find('.active').children('a').attr('id');
	var array = ["AMAZON","WALRUS","CLOUDIAN","EGNYTE_STORAGE","AZURE_OBJECT_STORAGE","SALES_FORCE","DOCUMENTUM","ORANGE"];
	if(checkCount < 1){
		return clearSelectFiles();
	}
	else if(checkCount > 0){
		if((PageName == "CloudDrive" && _c == "SHAREPOINT_2010") || PageName == "SharepointSite"){
			return false;
		}else if(PageName == "CloudDrive" && _c == "AMAZON"){
			disableObject = $.extend({},actionPanel);
			disableObject.share =false;
			disableObject.workspace =false;
			return disableIcons(disableObject);
		}
		else if(PageName == "CloudDrive" && _c == "SALES_FORCE") {
			disableObject.delete = true;
		}
		else if(PageName == "InnerFolders" && _c == "SHAREPOINT_ONLINE" && FileType == "FOLDER" ) {
			disableObject.rename = true;
		}
		else if(PageName == "CloudDrive" && _c == "EGNYTE_STORAGE"){
			disableObject.delete = true;
			disableObject.rename = true;
		}
		else if(PageName == 'CloudDrive' && _c == 'ORANGE'){
			disableObject.delete = true;
			disableObject.rename = true;
			disableObject.workspace = true;
			disableObject.share = true;
			disableObject.category = true;
		}
		else if(_c == 'DROPBOX_BUSINESS'){
			disableObject = $.extend({},actionPanel);
			disableObject.open = false;
			return disableIcons(disableObject);
		}
		else if(_sn == "favourite"){
			disableObject = checkDropBoxBusiness();
			icons = $.extend(iconObj,disableObject);
			return disableIcons(icons);
		}
		disableObject.download=true;
		$('.filecontrols').removeClass('buttonDisable');
		if(checkCount > 1){
			disableObject.rename = true;
			disableObject.open = true;
		}
		icons = $.extend(iconObj,disableObject);
		disableIcons(icons);
		enableCrateControls(true,true);
	}
	if($.inArray("NOTEBOOK", FileType) > -1){
		$( "#CFHRename" ).click(function()
		{
			$( ".renameInput" ).click(function()
			{
				$( ".renameInput" ).keydown();
				return false;
			});
		});
		disableObject = {
			"category":true,
			"download":true,
			"encrypt":true,
			"decrypt":true,
			"open":true,
			"share":true,
			"workspace":true,
			"folder":true,
			"upload":true
		};
		icons = $.extend(iconObj,disableObject);
		disableIcons(icons);
	}
	else if($.inArray("NOTE", FileType) > -1){
		disableObject = {
			"category":true,
			"download":true,
			"encrypt":true,
			"decrypt":true,
			"open":true,
			"share":true,
			"workspace":true,
			"folder":true,
			"upload":true
		};
		icons = $.extend(iconObj,disableObject);
		disableIcons(icons);
	}
	else if($.inArray("SITE", FileType) > -1){
		var _a = {
			"open":true,
			"download":true,
			"share":true,
			"rename":true,
			"delete":true,
			"category":true,
			"workspace":true,
			"folder":false,
			"upload":false
		};
		disableIcons(_a);
	}
	else if($.inArray("FOLDER", FileType) > -1){
		disableObject = {
			"category":true,
			"download":true
		};
		if(PageName == 'CloudDrive' && _c == 'ORANGE'){
			disableObject.share = true;
			disableObject.workspace = true;
			disableObject.category = true;
		}
		icons = $.extend(iconObj,disableObject);
		disableIcons(icons);
	}
	else{
		disableObject = {
			"category":false,
			"download":false
		};
		if(PageName == 'CloudDrive' && _c == 'ORANGE'){
			disableObject.share = true;
			disableObject.workspace = true;
			disableObject.category = true;
		}
		icons = $.extend(iconObj,disableObject);
		disableIcons(icons);
	}
	if(PageName == 'Share with Me'){
		disableObject = checkShareWithMe();
		icons = $.extend(iconObj,disableObject);
		icons.delete = false;
		disableIcons(icons);
	}
	else if(PageName == "InnerFolders"){
		if(previousPage == "Share with Me") {
			FilePer = temp;
			disableObject = checkShareWithMe();
			icons = $.extend(iconObj,disableObject);
			icons.rename = true;
			icons.share = true;
			disableIcons(icons);
		}
		else if(_c == "ORANGE"){
			var _di = {
				"open":false,
				"download":true,
				"share":true,
				"rename":true,
				"delete":true,
				"category":true,
				"workspace":true,
				"folder":true,
				"upload":true
			};
			if($.inArray("FOLDER", FileType) < 0){
				_di.download = false;
			}
			if(!/Cloudfuze Dev/g.test(atob(SinglePId.split('/')[2])) && !isProd){
				disableIcons(_di)
			}else if(!/CloudFuze/g.test(atob(SinglePId.split('/')[2])) && isProd){
				disableIcons(_di);
			}
		}
	}
}

function checkShareWithMe(){
	var disableObject = {};

	if($.inArray('read',FilePer) > -1){
		disableObject = {
			"share":true,
			"rename":true,
			"delete":true,
			"category":true,
			"workspace":true,
			"folder":true,
			"upload":true
		};
	}
	else if($.inArray('edit',FilePer) > -1){
		disableObject = {
			"share":true,
			"delete":true,
			"workspace":true,
			"category":true
		};
	}
	else{
		disableObject = {
			"workspace":true,
			"category":true
		};
	}
	return disableObject;
}

function clearSelectFiles(){
	disableActionPanel(actionPanel);
}

function disableIcons(iconObject){
	if(iconObject.open){
		$('#openFiles').css('pointer-events','none');
		$('#openFiles > div').css('opacity','0.2');
	}else{
		$('#openFiles').css('pointer-events','auto');
		$('#openFiles > div').css('opacity','1');
	}
	if(iconObject.download){
		$('#CFDownload').css('pointer-events','none');
		$('#CFDownload>div').css('opacity','0.2');
	}else{
		$('#CFDownload').css('pointer-events','auto');
		$('#CFDownload>div').css('opacity','1');
	}
	if(iconObject.share){
		$('#CFAShare').css('pointer-events','none');
		$('#CFAShare>div').css('opacity','0.2');
	}else{
		$('#CFAShare').css('pointer-events','auto');
		$('#CFAShare>div').css('opacity','1');
	}
	if(iconObject.rename){
		$('#CFHRename').css('pointer-events','none');
		$('#CFHRename>div').css('opacity','0.2');
	}else{
		$('#CFHRename').css('pointer-events','auto');
		$('#CFHRename>div').css('opacity','1');
	}
	if(iconObject.delete){
		$('#CFHDelete').css('pointer-events','none');
		$('#CFHDelete>div').css('opacity','0.2');
	}else{
		$('#CFHDelete').css('pointer-events','auto');
		$('#CFHDelete>div').css('opacity','1');
	}
	if(iconObject.category){
		$('#addToCategory').css('pointer-events','none');
		$('#addToCategory>div').css('opacity','0.2');
	}else{
		$('#addToCategory').css('pointer-events','auto');
		$('#addToCategory>div').css('opacity','1');
	}
	if(iconObject.workspace){
		$('#addToWorkspace').css('pointer-events','none');
		$('#addToWorkspace>div').css('opacity','0.2');
	}else{
		$('#addToWorkspace').css('pointer-events','auto');
		$('#addToWorkspace>div').css('opacity','1');
	}
}

function completeUpload(fileobj){
	if(fileobj.length != 0){
		$('#NoVersions').remove();
		var shareUrl=fileobj.cfFileShare.shareUrl;
		shareUrl=shareUrl.replace("amp;","");
		var accessToken=getParameterByName("accessToken",shareUrl);
		var url = apicallurl+'/fileshare/content/revision/'+fileobj.id+'?fileId='+encodeURIComponent(VersionFileId[0])+'&accessToken='+accessToken+'&token='+CFManageCloudAccountsAjaxCall.getAuthDetails()+'&sharePassword=';
		$('#versionsOfFile').css("border","1px solid black");
		$('#versionsOfFile').prepend('<li  style="line-height: 19px;text-align: center;border-bottom: 1px' +
			' solid rgba(17, 13, 13, 0.22);" class="separator" id='+fileobj.id+'> <a style="color:' +
			' #22b5d8;font-size: 11pt;float:left;" href="#" title="Version '+(fileobj.version)+'">Version:v'+(fileobj.version)+'</a><div style="margin-left: 1%;"><div class="user-content" style="font-size:20px;"><span>'+CFManageCloudAccountsAjaxCall.getMaxChars(fileobj.fileName,40)+'</span> <span style="font-size: 10pt;color: blue;">'+CFManageCloudAccountsAjaxCall.getObjectSize(fileobj.length)+'</span></div><div class="article-post"><div class="user-info" style="color:#433A68;font-size:12px;"> Uploaded by <b>'+fileobj.cfFileShare.user.lastName+'</b>, '+jQuery.timeago(fileobj.creationDate)+' </div></div></div><a style="color: #22b5d8;" href="'+url+'">Download</a><i class="icon-remove" style="float:right;cursor:pointer;margin-top: -27px;"></i></li>');

	}
	selectEvent.init();
}

function disableActionPanel(){
	//$('.filecontrols').addClass('buttonDisable');
	disableIcons(actionPanel);
	enblePanel();
}

$('[data-dismiss="modal"]').on('click',function(){
	sendGAEvents("Close Modal");
	//_gaq.push(['_trackEvent',"Close Modal", localStorage.getItem('UserId'),PageName]);
	$('#page-header input[type="checkbox"]').prop('checked',false);
	disableActionPanel(actionPanel);
	$('#LVContent').children('.panel-dataHoverClass').each(function(){
		$(this).removeClass('.panel-dataHoverClass');
	});

	var _a = $(this).closest('.modal').find('.button.light-gray').attr('id');
	if(_a == "_sharePwdClose"){
		PageName = previousPage;
		enblePanel();
	}
});

$('#move-header').on('click','#moveSource .move',function() {
	_scroll = true;
	sendGAEvents("clicked on a source cloud in move page");
	//activecampaign.eventTrack('Source Cloud',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
	if(localStorage.getItem("storageVal") == null){
		$('#cf-logout').trigger("click");
		window.location.href = "index.html";
	}
	$("#CFShowLoading").css("display","");
	localStorage.removeItem('_scrollSrcTokenVal');
	sessionStorage.setItem("source","source");
	var _CloudName = $("#moveDestination .move").attr("cloud"),
		_Modal = $('#mulUsrCheck'),
		_ModalText = _Modal.find(".tab-content h4 span");
	var _cl = $(this).attr('class');

	if (MultiUserClouds.indexOf(_CloudName) > -1) {
		if (_cl == "move") {
			return false;
		}
		_cl = _cl.split(' ')[1];

		if(cloudMapping[_cl] && cloudMapping[_cl].indexOf(_CloudName) > -1){}
		else if (!cloudMapping[_cl] || cloudMapping[_cl].indexOf(_CloudName) == -1) {
			_ModalText.text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
			_Modal.modal("show");
			return false;
		}
		else {
			_ModalText.text("Both Source and Destination should be multi user clouds.");
			_Modal.modal("show");
			return false;
		}
	}
	else if ($("#dynamicDestCloudName").text() != "") {
		_cl = _cl.split(' ')[1];
		if(($("#dynamicDestCloudName").attr("type") == "SHAREPOINT_CONSUMER_HYBRID") && _cl !== "NTLM_STORAGE" ){
			$('#RestrictionMOVE').modal('show');
			$("#CFShowLoading").css("display","none");
			return false;
		}
		if(_cl == "SHAREPOINT_CONSUMER_HYBRID"){


			$('#RestrictionSrc').modal('show');
			$("#CFShowLoading").css("display","none");
			return false;

		}
		if (_cl == "ONEDRIVE_BUSINESS_ADMIN" || _cl == "DROPBOX_BUSINESS") {
			_ModalText.text("Both Source and Destination should be multi user clouds.");
			_Modal.modal("show");
			return false;
		}
	}
	if(_cl.split(' ')[1] == "SHAREPOINT_CONSUMER_HYBRID"){

		$('#RestrictionSrc').modal('show');
		$("#CFShowLoading").css("display","none");
		return false;

	}
	$('#movecheckModal').attr('disabled', true).removeClass('blue');
	var cloud_id = $(this).attr('cid');
	localStorage.setItem("mulUsrSrc", cloud_id);
	var p_id = $(this).attr('pid');
	moveCheckSum = 'source';
	var name = CFManageCloudAccountsAjaxCall.getMaxChars($(this).siblings('#userEmail').text(), 16);
	var title =$(this).siblings('#userEmail').text(); 
	PageName = 'move';
	PageNumber = 1;
	SingleCloudId = cloud_id;
	SinglePId = p_id;
	var type = $(this).attr('class');
	type = type.split(' ');
	type = type[1];
	for (i = 0; i < AllCloudsInfo.length; i++) {
		if (AllCloudsInfo[i].id === SingleCloudId) {
	
			if (MultiUserClouds.indexOf(type) > -1) {
				multiUserDispaly(cloud_id);
				if ($("#moveDestination .moveMultiUserCheck").length == 1 && $("#moveSource .moveMultiUserCheck").length == 1) {
					$('#multiMoveCheck1').modal('show');
					setTimeout(function () {
						$('#multiMoveCheck1').modal('hide');
						window.location.href = "move_multiuser.html";
					}, 3000);
					multiUsrMapng();
				}
				return false;
			}
			if (MultiUserClouds.indexOf(AllCloudsInfo[i].cloudName) > -1) {
				return false;
			}
			var _filesCount,_fldCount;
			if(!((AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" ||AllCloudsInfo[i].cloudName == "G_DRIVE" ||AllCloudsInfo[i].cloudName == "BOX"  || AllCloudsInfo[i].cloudName == "GOOGLE_STORAGE"|| AllCloudsInfo[i].cloudName == "AZURE_OBJECT_STORAGE" ||AllCloudsInfo[i].cloudName == "SHAREPOINT_ONLINE_CONSUMER"||AllCloudsInfo[i].cloudName == "SHAREPOINT_CONSUMER_HYBRID" ||AllCloudsInfo[i].cloudName == "AMAZON" ||AllCloudsInfo[i].cloudName == "SHARED_DRIVES")&& moveCheckSum == 'source')){
				$.ajax({
					type: "GET",
					url: apicallurl + "/filefolder/count/filefolders?cloudId=" + AllCloudsInfo[i].id,
					async: false,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
						"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
					},
					success: function (data) {
						if(data == undefined){
							_filesCount=0;
							_fldCount=0;

						}

						_filesCount = data.filesCount;
						_fldCount = data.foldersCount;


						if(_filesCount == undefined){
							_filesCount=0;
						}
						if(_fldCount == undefined){
							_fldCount=0;
						}
					}
				});
			}
			$('#totalfiles').html('');
			if((AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" ||AllCloudsInfo[i].cloudName == "G_DRIVE" ||AllCloudsInfo[i].cloudName == "BOX" ||AllCloudsInfo[i].cloudName == "GOOGLE_STORAGE" ||AllCloudsInfo[i].cloudName == "AZURE_OBJECT_STORAGE" ||AllCloudsInfo[i].cloudName == "SHAREPOINT_ONLINE_CONSUMER"||AllCloudsInfo[i].cloudName == "SHAREPOINT_CONSUMER_HYBRID" ||AllCloudsInfo[i].cloudName == "AMAZON"||AllCloudsInfo[i].cloudName == "SHARED_DRIVES")&& moveCheckSum == 'source'){
				$(".tab-header.srcFilesFldrCnt").find('#totalfiles').css("visibility","hidden");
			}
			else
				$('#totalfiles').html("Files : " + _filesCount + " &nbsp; &nbsp;Folders :  " + _fldCount);
			$(".tab-header.srcFilesFldrCnt").find('#totalfiles').css("visibility","visible");

			break;
		}
	}
	$('#breadCrumbdyncmove').empty();
	$('#breadCrumbdyncmove').append('<li id="cloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="cloud"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">My Clouds </a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span></li><li id="allcloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="' + SingleCloudId + '"><a href="#"> ' + name + '</a></li>');

	$('refreshcloudmovesrc').addClass('cf-refresh4');
	$('#dynamicCloudName').text(name);
	$('#dynamicCloudName').attr('title',title);
	$('#dynamicCloudName').attr('type', type);
	//$('#dynamicCloudName').siblings('img').attr('src','../img/PNG/'+type+'.png');
	$('#dynamicCloudName').siblings('.moveHeader').children('.moveHeaderIcon').attr('id', type);
	$('#dynamicCloudName').siblings('.moveHeader').css('display','block');
	$('#dynamicCloudName').attr('check', 'sroot');
	$('#spinner1').show();
	CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(cloud_id, PageNumber);
});

$('#move-header').on('click','#moveDestination .move',function() {
	_scrolll = true; 
	sendGAEvents("clicked on a destination cloud in move page");
	//activecampaign.eventTrack('Destination cloud',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
	if(localStorage.getItem("storageVal") == null){
		$('#cf-logout').trigger("click");
		window.location.href = "index.html";
	}
	$("#CFShowLoading").css("display","");
	localStorage.removeItem('_scrollDstnTokenVal');
	sessionStorage.setItem("source","destination");
	var _moveSource = $("#moveSource .move"),
		_CloudName = _moveSource.attr("cloud"),
		_Modal = $('#mulUsrCheck'),
		_ModalText = _Modal.find(".tab-content h4 span"),
		_moveCheckModal = $('#movecheckModal'),
		_destCloudName = $('#dynamicDestCloudName');
	var _cl = $(this).attr('class');

	//Multi User Clouds Validation
	if (MultiUserClouds.indexOf(_CloudName) > -1) {
		if (_cl == "move") {
			return false;
		}
		_cl = _cl.split(' ')[1];

		if(cloudMapping[_CloudName] && cloudMapping[_CloudName].indexOf(_cl) > -1){}
		else if (!cloudMapping[_CloudName] || cloudMapping[_CloudName].indexOf(_cl) == -1) {
			_ModalText.text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
			_Modal.modal("show");
			return false;
		}
		else {
			_ModalText.text("Both Source and Destination should be multi user clouds.");
			_Modal.modal("show");
			return false;
		}
	}
	else if ($("#dynamicCloudName").text() != "") {
		_cl = _cl.split(' ')[1];
		if($("#dynamicCloudName").attr("type") !== "NTLM_STORAGE" && _cl == "SHAREPOINT_CONSUMER_HYBRID"){
			$('#RestrictionMOVE').modal('show');
			$("#CFShowLoading").css("display","none");
			return false;

		}
		if (MultiUserClouds.indexOf(_cl) > -1) {
			_ModalText.text("Both Source and Destination should be multi user clouds.");
			_Modal.modal("show");
			return false;
		}
	}

	_moveCheckModal.attr('disabled', true).removeClass('blue');
	moveCheckSum = 'dest';
	var cloud_id = $(this).attr('cid');
	localStorage.setItem("mulUsrDst", cloud_id);
	var cloudCheck = $(this).attr('class').split(' ')[1];
	var p_id = $(this).attr('pid');

	var CLTYPE = ["SHAREPOINT_2013",
		"SHAREPOINT_2010",
		"ALFRESCO",
		"FTP",
		"CIFS"];

	if ($.inArray(cloudCheck, CLTYPE) > -1) {
		p_id = "/" + cloud_id + p_id;
	}
	else if (cloudCheck == "ORANGE") {
		if (isProd) {
			p_id = '/' + cloud_id + '/bWVzIGRvc3NpZXJzIHBhcnRlbmFpcmVzL0Nsb3VkRnV6ZS8'; //btoa('mes dossiers partenaires/CloudFuze')
		}
		else if (!isProd) {
			p_id = '/' + cloud_id + '/bWVzIGRvc3NpZXJzIHBhcnRlbmFpcmVzL0Nsb3VkZnV6ZSBEZXYv'; // btoa('mes dossiers partenaires/Cloudfuze Dev')
		}
	}
	else if (cloudCheck == "AXWAY") {
		p_id = "/" + cloud_id
	}

	moveDestParent = p_id;
	var name = CFManageCloudAccountsAjaxCall.getMaxChars($(this).siblings('#userEmail').text(), 16);
	var title = $(this).siblings('#userEmail').text();
	var type = $(this).attr('class');
	type = type.split(' ');
	type = type[1];
	_destCloudName.attr('type', type);
	PageName = 'move';
	PageNumber = 1;
	SingleCloudId = cloud_id;
	SinglePId = p_id;
	for (i = 0; i < AllCloudsInfo.length; i++) {
		if (AllCloudsInfo[i].id === SingleCloudId) {
			/*$('#totalfilesdestination').siblings('.dummy').attr('cid',cloud_id);
             var apiUrl = apicallurl + "/users/" + CFManageCloudAccountsAjaxCall.getUserId() + "/loadstatus?cloudId=" + cloud_id;
             $.ajax({
             type: "GET",
             url: apiUrl,
             async: true,
             dataType: "json",
             headers: {
             "Content-Type": "application/json",
             "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails()
             },
             success: function (Syncstatus) {
             if (Syncstatus == false)
             $('#totalfilesdestination').siblings('.dummy').addClass('cf-refresh4').removeClass('cloudSpinn');
             if (Syncstatus == true)
             $('#totalfilesdestination').siblings('.dummy').addClass('cloudSpinn').removeClass('cf-refresh4');
             }
             });*/
			//type == "DROPBOX_BUSINESS" || type == "ONEDRIVE_BUSINESS_ADMIN"
			if (MultiUserClouds.indexOf(type) > -1) {
				multiUserDispaly(cloud_id);
				if ($("#moveDestination .moveMultiUserCheck").length == 1 && $("#moveSource .moveMultiUserCheck").length == 1) {
					/*if (type == "DROPBOX_BUSINESS" || type == "G_SUITE" || _moveSource.attr("cloud") == $("#moveDestination .move").attr("cloud")) {
                     _ModalText.text("This multi user migration is not available as of now. Please contact support@cloudfuze.com for the release date.");
                     _Modal.modal("show");
                     return false;
                     }*/
					$('#multiMoveCheck1').modal('show');
					setTimeout(function () {
						$('#multiMoveCheck1').modal('hide');
						window.location.href = "move_multiuser.html";
					}, 3000);
					//$('#multiMoveCheck').modal('show');
					multiUsrMapng();
				}
				return false;
			}
			if (AllCloudsInfo[i].cloudName == "ONEDRIVE_BUSINESS_ADMIN" || AllCloudsInfo[i].cloudName == "DROPBOX_BUSINESS") {
				// if($("#moveDestination .moveMultiUserCheck").length == 1 && $("#moveSource .moveMultiUserCheck").length == 1)
				// 	$('#movecheckModal').prop('disabled',false).addClass('blue');
				return false;
			}
			var _filesCount,_fldCount;
			if(!((AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" ||AllCloudsInfo[i].cloudName == "G_DRIVE" ||AllCloudsInfo[i].cloudName == "BOX" || AllCloudsInfo[i].cloudName == "GOOGLE_STORAGE" || AllCloudsInfo[i].cloudName == "AZURE_OBJECT_STORAGE"||AllCloudsInfo[i].cloudName == "SHAREPOINT_ONLINE_CONSUMER" ||AllCloudsInfo[i].cloudName == "SHAREPOINT_CONSUMER_HYBRID"||AllCloudsInfo[i].cloudName == "AMAZON"||AllCloudsInfo[i].cloudName == "SHARED_DRIVES")&& moveCheckSum == 'dest')) {
				/* if(!((AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" ||AllCloudsInfo[i].cloudName == "G_DRIVE" ||AllCloudsInfo[i].cloudName == "BOX"||AllCloudsInfo[i].cloudName == "SHAREPOINT_ONLINE_CONSUMER")&& moveCheckSum == 'dest')) { */
				$.ajax({
					type: "GET",
					url: apicallurl + "/filefolder/count/filefolders?cloudId=" + AllCloudsInfo[i].id,
					async: false,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
						"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
					},
					success: function (data) {
						if (data == undefined) {
							_filesCount = 0;
							_fldCount = 0;

						}

						_filesCount = data.filesCount;
						_fldCount = data.foldersCount;

						if (_filesCount == undefined) {
							_filesCount = 0;
						}
						if (_fldCount == undefined) {
							_fldCount = 0;
						}
					}
				});
			}
			$('#totalfilesdestination').html('');
			if((AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" ||AllCloudsInfo[i].cloudName == "G_DRIVE" ||AllCloudsInfo[i].cloudName == "BOX" || AllCloudsInfo[i].cloudName == "GOOGLE_STORAGE" ||AllCloudsInfo[i].cloudName == "AZURE_OBJECT_STORAGE"||AllCloudsInfo[i].cloudName == "SHAREPOINT_ONLINE_CONSUMER"||AllCloudsInfo[i].cloudName == "SHAREPOINT_CONSUMER_HYBRID"||AllCloudsInfo[i].cloudName == "AMAZON"||AllCloudsInfo[i].cloudName == "SHARED_DRIVES")&& moveCheckSum == 'dest'){
				/* if((AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" ||AllCloudsInfo[i].cloudName == "G_DRIVE" ||AllCloudsInfo[i].cloudName == "BOX"||AllCloudsInfo[i].cloudName == "SHAREPOINT_ONLINE_CONSUMER")&& moveCheckSum == 'dest'){ */
				$(".tab-header.dstnFilesFldrCnt").find('#totalfiles').css("visibility","hidden");
			}
			else{
				$('#totalfilesdestination').html("Files : " + _filesCount + " &nbsp; &nbsp;Folders :  " + _fldCount);
				$(".tab-header.dstnFilesFldrCnt").find('#totalfiles').css("visibility","visible");
			}

			$('#totalfilesdestination').siblings('i').attr('cid', AllCloudsInfo[i].id);
			break;
		}
	}
	/*$( ".cf-refresh4" ).click(function() {
     $(this).removeClass('cf-refresh4').addClass('cloudSpinn');
     var id = $(this).attr('cid');
     sendGAEvents("Clicked on Cloud Sync",id);
     refreshCloud.push(id);
     CFManageCloudAccountsAjaxCall.refreshcloud(id);
     });*/


	$('#breadCrumbdyncmovedest').empty();


	var _destBreadCrumbHtml = '<li id="cloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="cloud">' +
		'<a href="#" style="color:blue;text-decoration: underline;cursor:default;">My Clouds </a>' +
		'<span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span>' +
		'</li><li id="allcloud" pid="' + SingleCloudId + '" class="BCRFList" cloudId="' + SingleCloudId + '">' +
		'<a href="#"> ' + name + '</a></li>';
 
	$('#breadCrumbdyncmovedest').append(_destBreadCrumbHtml);

	_destCloudName.text(name);
	_destCloudName.attr('title',title);
//	_destCloudName.siblings('img').attr('src','../img/PNG/'+type+'.png');   
	_destCloudName.siblings('.moveHeader').children('.moveHeaderIcon').attr('id', type);
	_destCloudName.siblings('.moveHeader').css('display','block');
	_destCloudName.attr('cid', cloud_id);
	_destCloudName.attr('fid', p_id);
	_destCloudName.attr('check', 'droot');

	if ($('[type="checkbox"]:checked').not("#terms").length > 0) {
		_moveCheckModal.prop('disabled', false).addClass('blue');
	}
	else {
		_moveCheckModal.prop('disabled', true).removeClass('blue');
	}

	//  $('#spinner2').show();

	if (cloudCheck == "ORANGE") {
		PageName = 'innermove';
		SinglePId = p_id;
		SingleCloudId = cloud_id;
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber);
	}
	else if(_destCloudName.attr('type') == "SHAREPOINT_CONSUMER_HYBRID"){
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(cloud_id, PageNumber,undefined,'/');
	}
	else {
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(cloud_id, PageNumber);
	}

	if (_destCloudName.attr('type') == "SHAREPOINT_ONLINE" ||_destCloudName.attr('type') == "SHAREPOINT_ONLINE_CONSUMER"  ||_destCloudName.attr('type') == "SHAREPOINT_CONSUMER_HYBRID" ) {
		_moveCheckModal.prop('disabled', true).removeClass('blue');
	}
});

$('#CFFileMove').on('click',function() {
	//var _mcount = CFHPActions.getMoveCount();

	var _srcName = $("#dynamicCloudName").attr("type");
	//var _srcName = $(".srcName").find("i").attr('id');
	var _dstName  = $(".dstnName").find("i").attr('id');
	//activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'sourceCloud',_srcName);
	//activecampaign.getContact(JSON.parse(localStorage.getItem('CFUser')).primaryEmail, 'destinationCloud',_dstName);
	//zohoCrm.upgradeSubscribtionRecord(JSON.parse(localStorage.CFUser).primaryEmail,'Migration',_srcName,_dstName);
	sendGAEvents("Move Files initiated");
	//activecampaign.eventTrack('Confirm Personal Migration',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
	if(_srcName === "NTLM_STORAGE" && _dstName === "SHAREPOINT_CONSUMER_HYBRID"){
		var sharePointListItemId;
		if($('#moveDestination input:checked').length !== 0){// && $('[data-type="destback"]').attr('id')=="getClouds"
			if($('#moveDestination input:checked').siblings('label').children('i').hasClass('cf-network')){
				sharePointListItemId = $('#moveDestination input:checked').siblings().parent('span').attr('id');
			}
		}

		if(sharePointListItemId === undefined){
			sharePointListItemId = sharepointListId;
		}

	}	var srcId = [];
	var srcCId = [];
	var emails = [];
	var emails1;
	var moveFileObject = {
		"fromId": "",
		"fromCId": "",
		"toId": "",
		"toCId": "",
		"notify": false,
		"userEmails": null,
		"isCopy": false
	};
	if ($('#nofityMeCheckBox').prop('checked') == true) {
		var obj = localStorage.getItem("CFUser");
		obj = jQuery.parseJSON(obj);
		emails.push(obj.primaryEmail);
		moveFileObject.notify = true;
		moveFileObject.userEmails = emails;
	}
	if ($('#nofityOthersCheckBox').prop('checked') == true) {
		emails1 = $('#moveNotifyEmails').val().trim();
		if (emails1 == '') {
			$('#moveNotifyEmails').css('border-color', 'red');
			$(this).removeClass('buttonDisable');
			$('#movecheckModal').attr('disabled', false).addClass('blue');

			return false
		}
		if (emails1 != '') {
			emails1 = emails1.split(',');
			for (var i = 0; i < emails1.length; i++) {
				emails1[i] = emails1[i].trim().toLowerCase();
				emails.push(emails1[i]);
				moveFileObject.notify = true;
				moveFileObject.userEmails = emails;
			}
			$(this).addClass('buttonDisable'); 
			$('#movecheckModal').attr('disabled', true).removeClass('blue'); 
		}
	}
	else{
		$(this).addClass('buttonDisable');
		$('#movecheckModal').attr('disabled', true).removeClass('blue');
	}
	$('#moveFilesList>li>i.lnil-checkmark-circle').each(function () {
		if(_srcName === "SHARED_DRIVES"){// && _dstName === "SHAREPOINT_ONLINE_CONSUMER"
		if($(this).parent().attr('type')=="DRIVE"){
		srcId.push($(this).parent().attr('id')+':'+$(this).parent().attr('name'));
		}
		else
		srcId.push($(this).parent().attr('id'));
		}
		else{
			srcId.push($(this).parent().attr('id'));
		}
		srcCId.push($(this).parent().attr('cid'));
	});
	if (srcId.length == 0) {
		alert('The selected file(s) / folder(s) can not be moved to the destination cloud.');
		$('#movePopup [data-dismiss="modal"]').trigger('click');
		return false;
	}
	moveFileObject.toId = $("#toCloudDispName").prev('.Driveicon').children('.drive').attr("fid"); 
	moveFileObject.toCId = $("#toCloudDispName").attr('cid');
	moveFileObject.isCopy = $("#deleteSourceFiles").prop("checked") != true;
	var fileId;
	if($('#moveSourceCheckbox').is(':checked'))
				{
					moveFileObject.fromRootId = $("#moveSource").find(".list-group").find("span").attr("srcparent");
			moveFileObject.fromCId=$("#moveSource").find(".list-group").find("span").attr("cid");
			

				}
				else{
	if(_srcName === "SHARED_DRIVES"){// && _dstName === "SHAREPOINT_ONLINE_CONSUMER"
	moveFileObject.fromId = srcId[0].split(':')[0];
	}
	else{
		moveFileObject.fromId = srcId[0];
	}
	moveFileObject.fromCId = srcCId[0];
}
	CFManageCloudAccountsAjaxCall.moveToAjaxCall(moveFileObject, srcId, sharePointListItemId);
/*	if(_dstName !== "SHAREPOINT_CONSUMER_HYBRID"){
		setTimeout(function () {
//			$('#moveReports').trigger('click');
			window.location.href = "reports.html#personal"
			localStorage.setItem("MigtnDone","consumer");
			
		}, 2000);

		setTimeout(function () {
			alertSuccess("Your migration has been initiated. You can monitor it here or log off and see the migration report that will be emailed to you.");
		}, 1000);
}
	else{
		
}*/
	$('#movePopup [data-dismiss="modal"]').trigger('click');
	$('#nofityMeCheckBox,#nofityOthersCheckBox').prop('checked', false);
	$('#nofityOthersCheckBox').css('border-color', '#000');
});

$('#move-header').on('change','input',function(){
	sendGAEvents("Selecting Files in Move");
	//_gaq.push(['_trackEvent',"Selecting Files in Move", localStorage.getItem('UserId')]);
	$('#moveDestination').find('.moveCloudBlockDragHover').addClass('moveCloudBlock').removeAttr('style').removeClass('moveCloudBlockDragHover');
	if($(this).is(':checked') && !$(this).hasClass('notifyCheckbox')) {
	if($(this).attr('type') == "radio"){
	$(this).parent().siblings().removeClass('fileActive');
		}
		$(this).parent().addClass('fileActive');
	}else {
		$(this).parent().removeClass('fileActive');
		$(this).closest('span').removeClass("fileActive");
		$(this).next().removeClass('fileActive');
		if(!$(this).hasClass('notifyCheckbox')){
		$('#moveSourceCheckbox').prop('checked',false);
		$('#moveSourceCheckbox').parent().removeClass('fileActive');
		}
	}
	if($('this input[type="radio"]').is(':checked')) {
		$('#moveDestination .fileActive').each(function () { 
			$(this).removeClass('fileActive');
		});
		$(this).parent().addClass('fileActive');
	}
	if(PageName == 'move'){
		$(this).closest('.moveCloudBlockDragHover').addClass('moveCloudBlock').removeClass('moveCloudBlockDragHover');
	}
	if($('[type="checkbox"]:checked').not( "#terms" ).length > 0) {
		if($('#dynamicDestCloudName').attr('check') == 'droot' || $('#dynamicDestCloudName').attr('check') == 'folder'){
			$('#movecheckModal').removeAttr('disabled').addClass('blue');
		}
	}else{
		$('#movecheckModal').attr('disabled',true).removeClass('blue');
	}
	if($('input:checked').length > 0){
		if($('[type="radio"]:checked').length > 0) {
			$('#dynamicDestCloudName').removeAttr('check');
			$('#movecheckModal').removeAttr('disabled').addClass('blue');
		}
		if($('[type="checkbox"]:checked').length == 0){
			$('#movecheckModal').prop('disabled',true).removeClass('blue');
		}
		if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_ONLINE" && $('#dynamicDestCloudName').attr('check') == "droot")
		{
			$('#movecheckModal').prop('disabled',true).removeClass('blue');
		}
		if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_ONLINE_CONSUMER" && $('#dynamicDestCloudName').attr('check') == "droot")
		{
			$('#movecheckModal').prop('disabled',true).removeClass('blue');
		}
		if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_CONSUMER_HYBRID" && $('#dynamicDestCloudName').attr('check') == "droot")
		{
			$('#movecheckModal').prop('disabled',true).removeClass('blue');
		}
	}
	if($('[data-type="destback"]').length == 0)
		$('#movecheckModal').prop('disabled',true).removeClass('blue');
	if($('#moveSource .list-group-item').length == 0)
		$('#movecheckModal').prop('disabled',true).removeClass('blue');
	if($('input[name="destCloud"]:checked').length > 0){
		moveCheckSum = 'dest';
		PageName = 'moveLanding';
	}
	if($(this).parent().attr('id')=='moveDestination'){
		moveCheckSum = 'dest';
	}
	if($(this).attr('name') == 'destCloud'){
		moveCheckSum = 'dest';
		PageName = 'moveLanding';
	}
	if(moveCheckSum == 'dest'){
		if($(this).attr('name') == 'destCloud'){
			PageName = 'moveLanding';
		}
	}
	if($(this).parent().attr('id') == 'moveSource'){
		moveCheckSum = 'source';
	}
});

var _scroll=true;
$('#moveSource').on('scroll',function(event) {
	event.preventDefault();
	sessionStorage.setItem("source","source");
	var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	if(localStorage.getItem('_scrollSrcTokenVal')&& !(_srcCldName === "BOX")){
		var token = localStorage.getItem('_scrollSrcTokenVal');
		if(token == "null" || token == undefined)
			return false;
	}
	sessionStorage.setItem("source","source");

	if((_srcCldName === "DROP_BOX")||(_srcCldName === "ONEDRIVE")||(_srcCldName === "G_DRIVE")||(_srcCldName === "BOX")||(_srcCldName === "GOOGLE_STORAGE")||(_srcCldName === "AZURE_OBJECT_STORAGE")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID")||(_srcCldName === "AMAZON")||(_srcCldName === "SHARED_DRIVES")) {
		/*if((_srcCldName === "DROP_BOX")||(_srcCldName === "ONEDRIVE")||(_srcCldName === "G_DRIVE")||(_srcCldName === "BOX")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER")) {*/
		PageName = 'scrollDown';
	}
	var _parent = $('#moveSource').siblings('#movePageShowMore'),
		_pageNumber = _parent.attr('movepagenumber');

	if(_pageNumber == undefined || _pageNumber == '-1' || _pageNumber == ""){
		return false;
	}
	if(localStorage.getItem('_scrollSrcTokenVal') != null && localStorage.getItem('_scrollSrcTokenVal') !== "" && !(_srcCldName === "BOX")){
		_scroll =true;
	}
	else if(!((_srcCldName === "DROP_BOX")||(_srcCldName === "ONEDRIVE")||(_srcCldName === "G_DRIVE")||(_srcCldName === "BOX")||(_srcCldName === "GOOGLE_STORAGE")||(_srcCldName === "AZURE_OBJECT_STORAGE")||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID")||(_srcCldName === "AMAZON")||(_srcCldName === "SHARED_DRIVES"))) {
	_scroll = true;
	} 
	var element = $(this);
	if(_scroll && element[0].scrollHeight - element.innerHeight() <= element.scrollTop()+1) {
		var _checkToken=localStorage.getItem("_scrollSrcTokenVal");
		if( _checkToken == ""){
			return false;
		}
		else{
		//	_scroll = false;
			//   $('#spinner2').show();
			$("#CFShowLoading").css("display","");
			PageNumber = parseInt(_pageNumber); 
			_parent.trigger('click');
		}
	}
});


$('#moveSource').siblings('#movePageShowMore').on('click',function(){
	sendGAEvents("Show More on Move Source");
	//_gaq.push(['_trackEvent',"Show More on Move Source", localStorage.getItem('UserId')]);
	moveCheckSum = 'source';
	var idofCloud=  $(this).siblings('.tab-content').children('[data-type="sourceback"]').attr('cid');
	var testId = $(this).siblings('.tab-content').children('[data-type="sourceback"]').attr('id');
	for (i = 0; i < AllCloudsInfo.length; i++) {
		if (AllCloudsInfo[i].id === idofCloud) {
			break;
		}
	}
	if(PageName == 'innermove'){
		if($(this).attr('data-cid') !== undefined)
			idofCloud = $(this).attr('data-cid');
		testId =$(".list-group-item.dropabbleParent.ui-draggable.ui-draggable-handle.ui-selectable").attr("srcparent");// $(this).attr('data-id');
	}
	if(testId == 'getClouds' || testId == 'cloudFolders'){
		PageName ='move';
		SingleCloudId = idofCloud;
	}else{
		SinglePId = testId;
		//idofCloud = testId;
		SingleCloudId = idofCloud;
	}
	PageNumber = PageNumber + 1;
	var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	if(PageName == 'move'|| PageName == 'scrollDown'){
		if(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER") {
			SinglePId = $(this).attr('data-id');
			CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
		}

		else if( _srcCldName === "SHAREPOINT_CONSUMER_HYBRID"){
			if(PageName =="scrollDown"){
				var backLen = $('[data-type="sourceback"]').attr('id').split(':').length;
				if($('[data-type="sourceback"]').attr('id').split(':')[backLen-1] ==="DOCUMENT_LIBRARY" || $('[data-type="sourceback"]').attr('id').split(':')[backLen-1] ==="FOLDER"){
					if($(this).siblings('#moveSource').children('.list-group').children('span').attr('srcGrandParent') !== undefined){
						var parentId = $(this).siblings('#moveSource').children('.list-group').children('span').attr('srcGrandParent');

					}
					else{
						var parentId = $(this).siblings('#moveSource').children('.list-group').children('span').attr('srcParent');
					}
					SinglePId = $(this).attr('data-id');
					CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber,parentId);
				}
				else{
					SinglePId = $(this).attr('data-id');
					CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
				}
			}
			else{
				SinglePId = $(this).attr('data-id');
				CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
			}
		}

		else
			CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
	}
	if(PageName == 'innermove'){
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
	}
	_scroll = false;
});
var _scrolll =true;
$('#moveDestination').on('scroll',function(event) {
	event.preventDefault();
	sessionStorage.setItem("source","destination");
	var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	if(localStorage.getItem('_scrollDstnTokenVal')&& !(_dstnCldName === "BOX")){
		var token = localStorage.getItem('_scrollDstnTokenVal');
		if(token == "null" || token == undefined)
			return false;
	} 
	if((_dstnCldName === "DROP_BOX")||(_dstnCldName === "ONEDRIVE")||(_dstnCldName === "G_DRIVE")||(_dstnCldName === "BOX") ||(_dstnCldName === "GOOGLE_STORAGE") ||(_dstnCldName === "AZURE_OBJECT_STORAGE")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID")||(_dstnCldName === "AMAZON")||(_dstnCldName === "SHARED_DRIVES")) {
		/* if((_dstnCldName === "DROP_BOX")||(_dstnCldName === "ONEDRIVE")||(_dstnCldName === "G_DRIVE")||(_dstnCldName === "BOX") ||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER")) { */
		PageName = 'scrollDown';
	}
	var _parent = $('#moveDestination').siblings('#movePageShowMore'),
		_pageNumber = _parent.attr('movepagenumber');

	if(_pageNumber == undefined || _pageNumber == '-1' || _pageNumber == ""){ 
		return false;
	}
if(localStorage.getItem('_scrollDstnTokenVal') != null && localStorage.getItem('_scrollDstnTokenVal') !== ""){
		_scrolll =true; 
	}
else if(!((_dstnCldName === "DROP_BOX")||(_dstnCldName === "ONEDRIVE")||(_dstnCldName === "G_DRIVE")||(_dstnCldName === "BOX") ||(_dstnCldName === "GOOGLE_STORAGE") ||(_dstnCldName === "AZURE_OBJECT_STORAGE")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID")||(_dstnCldName === "AMAZON")||(_dstnCldName === "SHARED_DRIVES"))) {
	
	_scrolll = true;
	} 
	var element = $(this);
	if(_scrolll && element[0].scrollHeight - element.innerHeight() <= element.scrollTop()+1){
		var _checkToken=localStorage.getItem("_scrollDstnTokenVal");
		if( _checkToken == ""){
			return false;
		}
		else{
		//	_scroll = false;
			// $('#spinner2').show();
			$("#CFShowLoading").css("display","");
			PageNumber = parseInt(_pageNumber);
			_parent.trigger('click'); 
		}
	}
});

$('#moveDestination').siblings('#movePageShowMore').on('click',function(){
	sendGAEvents("Show More on Move Destination");
	//_gaq.push(['_trackEvent',"Show More on Move Destination", localStorage.getItem('UserId')]);
	moveCheckSum = 'dest';
	$('#spinner1').css('visibility','visible');
	var idofCloud =  $(this).siblings('.tab-content').children('[data-type="destback"]').attr('cid');
	var testId = $(this).siblings('.tab-content').children('[data-type="destback"]').attr('id');
	for (i = 0; i < AllCloudsInfo.length; i++) {
		if (AllCloudsInfo[i].id === idofCloud) {
			break;
		}
	}
	if(PageName == 'innermove'){
		idofCloud = $(this).attr('data-cid');
		testId = $(".list-group-item.dropabbleParent.ui-droppable").attr("dstnparent");//$(this).attr('data-id');
	}
	if(testId == 'getClouds'){
		PageName ='move';
		SingleCloudId = idofCloud;
	}else{
		SinglePId = testId;
		//idofCloud = testId;
		SingleCloudId = idofCloud;
	}
	PageNumber = PageNumber + 1;
	var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	if(PageName == 'move'|| PageName == 'scrollDown'){
		if(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER") {
			SinglePId = $(this).attr('data-id');
			CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
		}
		else if( _dstnCldName === "SHAREPOINT_CONSUMER_HYBRID"){
			if(PageName =="scrollDown"){
				var prev1 = $('[data-type ="destback"]').attr('previousParentId');

				var array = prev1.split('*');
				var string = '';
				if(array.length ==2){
					string = array[0];
				}
				else{
					for(var i =0;i<array.length;i++){
						string = string + array[i];
						if(i==array.length-2){
							break;
						}
						else
							string = string+'*';
					}
				}
				prevParentId = string;
				if(prevParentId == undefined)
					var prevParentId = '/';
				var backLenDes = $('[data-type="destback"]').attr('previousparentid').split('*').length;
				var checkin = $('[data-type="destback"]').attr('previousparentid').split('*')[backLenDes-1].split(':')[$('[data-type="destback"]').attr('previousparentid').split('*')[backLenDes-1].split(':').length-1];
				if(checkin ==="DOCUMENT_LIBRARY" || checkin  ==="FOLDER"){

					var parentId = sharepointListId;
					SinglePId = $(this).attr('data-id');
					CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber,parentId,prevParentId);
				}
				else{
					SinglePId = $(this).attr('data-id');
					CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber,undefined,prevParentId);
				}
			}
			else{
				SinglePId = $(this).attr('data-id'); 
				CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber,undefined,prevParentId);
			}
		}
		else
			CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
	}
	if(PageName == 'innermove'){
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(idofCloud,PageNumber);
	}
		_scrolll = false;
});

$('#moveSource').on('click','[data-type="FOLDER"],[data-type="SITE"],[data-type="DOCUMENT_LIBRARY"],[data-type="DRIVE"]',function(e){
	sessionStorage.setItem("source","source");
	sendGAEvents("Navigate into Folders on Move Source");
	//_gaq.push(['_trackEvent',"Navigate into Folders on Move Source", localStorage.getItem('UserId')]);
	if(e.ctrlKey){
		$(this).siblings('input').attr('checked',true);
		$(this).parent().addClass('fileActive');
		return false;
	}
	PageName = 'innermove';
	moveCheckSum = 'source';
	PageNumber = 1;
	//var scid = $(this).attr('cid');
	//var sfid = $(this).attr('id');
	SinglePId = $(this).attr('id');
	SingleCloudId = $(this).attr('cid');
	for(var i=0;i<AllCloudsInfo.length;i++){
		if(AllCloudsInfo[i].id  == SingleCloudId){
			break;
		}
	}
	$('#moveSource').next().attr('data-id',SinglePId).attr('data-cid',SingleCloudId);
	// $('#spinner2').show();
	$("#CFShowLoading").css("display","");
	if($('#dynamicCloudName').attr('type') === "SHAREPOINT_CONSUMER_HYBRID"){
		if($(this).attr('data-type') === "DOCUMENT_LIBRARY"){
			var parentId = $(this).parent('span').attr('srcParent');
		}
		else if($(this).attr('data-type') === "FOLDER"){
			var parentId = $(this).parent('span').attr('srcGrandParent');
		}
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId,PageNumber,parentId);

	}
	else
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId,PageNumber);

});

$('#moveSource').on('click','[data-type="sourceback"]',function(){
	sessionStorage.setItem("source","source");
	sendGAEvents("Navigate back on Move Source");
	if($("#moveSource input[name='multiUsrSrcCld']").length >= 0 && $("#moveDestination input[name='multiUsrDstCld']").length >= 0)
	{
		$('#multiUsrUsrsBox').css("display","none");
		//stylechange();
		if($("#moveDestination input[name='multiUsrDstCld']").length != 0 || $("#moveDestination").children().text() == "Users")
		{
			//setTimeout(function() { multiUserDispalyBack(localStorage.getItem("mulUsrDst"),"destination"); }, 5000);
			//multiUserDispalyBack(localStorage.getItem("mulUsrDst"),"destination");
			if($("#moveSource input[name='multiUsrSrcCld']").length != 0 || $("#moveSource").children().text() == "Users")
				//if($("#moveDestination div strong").text() != "Users")
			{
				window.location.href = "move.html";
				//localStorage.removeItem("mulUsrDst");
				localStorage.removeItem("mulUsrSrc");
				localStorage.removeItem("multiUsrSrcClds");
				localStorage.removeItem("multiUsrDstClds");
				localStorage.removeItem("multiUsrSrcCldsMul");
				localStorage.removeItem("multiUsrDstCldsMul");
				localStorage.removeItem("mappedClouds");
			}
		}
		else
			localStorage.removeItem("mulUsrSrc");
		localStorage.removeItem("multiUsrSrcClds");
		localStorage.removeItem("multiUsrDstClds");
	}
	var navid = $(this).attr('id');
	var cloudid = $(this).attr('cid');
	$('#movecheckModal').attr('disabled',true).removeClass('blue');
	var _srcCldName = $(".tab-header.srcFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	//if(AllCloudsInfo[i].cloudName == "DROP_BOX" ||AllCloudsInfo[i].cloudName == "ONEDRIVE" || AllCloudsInfo[i].cloudName == "G_DRIVE" || AllCloudsInfo[i].cloudName == "BOX"){
	if((_srcCldName == "DROP_BOX") ||(_srcCldName == "ONEDRIVE") || (_srcCldName == "G_DRIVE")|| (_srcCldName == "BOX") || (_srcCldName == "GOOGLE_STORAGE") ||(_srcCldName === "AZURE_OBJECT_STORAGE") ||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER")||(_srcCldName === "SHAREPOINT_CONSUMER_HYBRID") ||(_srcCldName === "AMAZON")||(_srcCldName === "SHARED_DRIVES")){
		/*  if((_srcCldName == "DROP_BOX") ||(_srcCldName == "ONEDRIVE") || (_srcCldName == "G_DRIVE")|| (_srcCldName == "BOX") ||(_srcCldName === "SHAREPOINT_ONLINE_CONSUMER")){*/

		PageName = 'back';
	}
	else
		PageName = 'innermove';

	moveCheckSum = 'source';
	if( _srcCldName === "SHAREPOINT_CONSUMER_HYBRID" ){
		navid = 'getClouds';
	}
	if(navid == 'getClouds'){
		$('.dummySrc').removeClass('cf-refresh4');
		$('.dummySrc').removeClass('cloudSpinn');
		$('#moveSource').next().removeAttr('movepagenumber');
		CFManageCloudAccountsAjaxCall.getAllClouds();
		$('#dynamicCloudName').siblings('.moveHeader').children('.moveHeaderIcon').removeAttr('id');
		$('#dynamicCloudName').siblings('.moveHeader').css('display','none');
		var dispanme = '';
		if(moveCheckSum == null || moveCheckSum == ''){
			$('#moveSource , #moveDestination').html('');
		}
		else if(moveCheckSum == 'source'){
			$('#moveSource').html('');
			$('#moveSource').siblings('#movePageShowMore').hide();
		}
		else if(moveCheckSum == 'dest'){
			$('#moveDestination').html('');
			$('#moveDestination').siblings('#movePageShowMore').hide();
		}
		$.each(AllCloudsInfo,function(i,cloud){
			var email = cloud.cloudUserId;
			email = email.split('|');
			email = email[1];
			if(cloud.userDisplayName != '' || cloud.userDisplayName != null){dispanme = cloud.userDisplayName;}
			else{
				dispanme = email;
				}
				
			var titleName = dispanme;
			dispanme = CFManageCloudAccountsAjaxCall.getMaxChars(dispanme,20);
			var _warning = cloud.cloudStatus == "INACTIVE" ? "cf-warning" : "";
			var _msg="";
			if(cloud.cloudName == "ONEDRIVE" && cloud.cloudStatus == "INACTIVE")
				_msg="OneDrive API has been upgraded. Please re-connect your cloud.";
			//cloud.cloudName != "DROPBOX_BUSINESS" && cloud.cloudName != "ONEDRIVE_BUSINESS_ADMIN"
			if((MultiUserClouds.indexOf(cloud.cloudName) == -1)) {// || cloud.userType == "ADMIN"
								var srcHtml = '<div class="moveCloudBlock button ' + _warning + '" style="padding:0px" title="' + _msg +'">' +
                    '<div class="move ' + cloud.cloudName + '" cid="' + cloud.id + '" pid="' + cloud.rootFolderId + '"></div>' +
                    '<p id="userEmail" title="'+titleName+'">' + dispanme + '</p></div>';			
				
			    $('#moveSource').append(srcHtml);
			}

			
		});
		PageName = 'moveLanding';
		$('#moveSource').siblings('.tab-header').children('.move').css('display','none');
		$('#moveSource').siblings('.tab-header').children('#dynamicCloudName').html('');
		$('#moveSource').siblings('.tab-header').children('#totalfiles').html('');

	}
	else if(navid == 'cloudFolders'){
		PageNumber = 1;
		SingleCloudId = cloudid;
		previousPage = PageName;
		PageName = 'CloudDrive';
		SinglePId = SingleCloudId;
		//  $('#spinner2').show();
		$("#CFShowLoading").css("display","");
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber);
	}
	else{
		SinglePId = navid;
		SingleCloudId = cloudid;
		PageNumber = 1;
		//CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(navid, PageNumber);
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber);

	}
});

$('#moveDestination').on('click','[data-type="FOLDER"],[data-type="SITE"],[data-type="DOCUMENT_LIBRARY"],[data-type="DRIVE"]',function(e){
	sessionStorage.setItem("source","destination");
	sendGAEvents("Navigate into Folders on Move Destination");
	//_gaq.push(['_trackEvent',"Navigate into Folders on Move Destination", localStorage.getItem('UserId')]);
	$('#dynamicDestCloudName').removeAttr('recheck');
	if(e.ctrlKey){
		$(this).siblings('input').attr('checked',true);
		$(this).parent().addClass('fileActive');
		return false;
	}
	if($('[type="checkbox"]:checked').length > 0){
		$('#movecheckModal').prop('disabled',false).addClass('blue');
	}
	PageName = 'innermove';
	moveCheckSum = 'dest';
	PageNumber = 1;
	var scid = $(this).attr('cid');
	var sfid = $(this).attr('id');
	SinglePId = sfid;
	SingleCloudId = scid;
	moveDestParent = sfid;
	for(var i=0;i<AllCloudsInfo.length;i++){
		if(AllCloudsInfo[i].id  == SingleCloudId){
			break;
		}
	}
	$('#moveDestination').next().attr('data-id',sfid).attr('data-cid',scid);
	//$('#spinner2').show();
	$("#CFShowLoading").css("display","");
	$('#dynamicDestCloudName').attr('fid',sfid);
	$('#dynamicDestCloudName').attr('check','folder');
	//CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(scid,PageNumber);
	if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_ONLINE")
	{
		if($('#dynamicDestCloudName [data-type="SITE"]').length || $('#moveDestination [data-type="FOLDER"] p').text().trim() == "Shared Documents")
			$('#movecheckModal').prop('disabled',true).removeClass('blue');
	}
	if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_CONSUMER_HYBRID"  )
	{
		var prevParentId = $(this).parent('span').attr('prevParentId');
		if($(this).attr('data-type') === "DOCUMENT_LIBRARY"){
			var parentId = sharepointListId;
		}
		else if($(this).attr('data-type') === "FOLDER"){
			var parentId = sharepointListId;
		}

		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId,PageNumber,parentId,prevParentId);
	}
	else{
		CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(scid,PageNumber,undefined,prevParentId);
	}

	if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_ONLINE_CONSUMER"  )
	{
		if($('#dynamicDestCloudName [data-type="SITE"]').length || $('#moveDestination [data-type="FOLDER"] p').text().trim() == "Shared Documents")
			$('#movecheckModal').prop('disabled',true).removeClass('blue');
	}
});

$('#moveDestination').on('click','[data-type="destback"]',function(){
	sessionStorage.setItem("source","destination");
	sendGAEvents("Navigate back on Move destination");
	if($("#moveSource input[name='multiUsrSrcCld']").length >= 0 && $("#moveDestination input[name='multiUsrDstCld']").length >= 0)
	{
		$('#multiUsrUsrsBox').css("display","none");
		//stylechange();
		if($("#moveSource input[name='multiUsrSrcCld']").length != 0 || $("#moveSource").children().text() == "Users")
		{
			//setTimeout(function() { multiUserDispalyBack(localStorage.getItem("mulUsrSrc"),"source"); }, 5000);
			//multiUserDispalyBack(localStorage.getItem("mulUsrSrc"),"source");
			if($("#moveDestination input[name='multiUsrDstCld']").length != 0 || $("#moveDestination").children().text() == "Users")
				//if($("#moveSource div strong").text() != "Users")
			{
				window.location.href = "move.html";
				localStorage.removeItem("mulUsrDst");
				//localStorage.removeItem("mulUsrSrc");
				localStorage.removeItem("multiUsrSrcClds");
				localStorage.removeItem("multiUsrDstClds");
				localStorage.removeItem("multiUsrSrcCldsMul");
				localStorage.removeItem("multiUsrDstCldsMul");
				localStorage.removeItem("mappedClouds");
			}
		}
		else
			localStorage.removeItem("mulUsrDst");
		localStorage.removeItem("multiUsrSrcClds");
		localStorage.removeItem("multiUsrDstClds");
	}
	$('.tab-header .dummy').removeClass("cf-refresh4");
	$('.tab-header .dummy').removeClass("cloudSpinn");
	$('#dynamicDestCloudName').removeAttr('recheck');
	var navid = $(this).attr('id');
	var cloudid= $(this).attr('cid');
	var _dstnCldName = $(".tab-header.dstnFilesFldrCnt").find(".moveHeaderIcon").attr("id");
	if((_dstnCldName == "DROP_BOX") ||(_dstnCldName == "ONEDRIVE") || (_dstnCldName == "G_DRIVE")|| (_dstnCldName == "BOX") || (_dstnCldName == "GOOGLE_STORAGE") ||(_dstnCldName === "AZURE_OBJECT_STORAGE")||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER")||(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID")||(_dstnCldName === "AMAZON")||(_dstnCldName === "SHARED_DRIVES")){
		/*if((_dstnCldName == "DROP_BOX") ||(_dstnCldName == "ONEDRIVE") || (_dstnCldName == "G_DRIVE")|| (_dstnCldName == "BOX") ||(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER")){ */
		PageName = 'back';
	}
	else
		PageName = 'innermove'; 

	moveCheckSum = 'dest';
	if(navid == '/'+cloudid+'/bWVzIGRvc3NpZXJzIHBhcnRlbmFpcmVzLw'){ //btoa('mes dossiers partenaires/')
		navid = 'getClouds';
	}
	/*if(_dstnCldName === "SHAREPOINT_ONLINE_CONSUMER"){
		navid = 'getClouds';
	}*/  
	if(navid == 'getClouds'){
		$('#moveDestination').next().removeAttr('movepagenumber');
		CFManageCloudAccountsAjaxCall.getAllClouds();
		$('#dynamicDestCloudName').siblings('.moveHeader').children('.moveHeaderIcon').removeAttr('id');
		$('#dynamicDestCloudName').siblings('.moveHeader').css('display','none');
		var dispanme = '';
		if(moveCheckSum == null || moveCheckSum == ''){
			$('#moveSource , #moveDestination').html('');
		}
		else if(moveCheckSum == 'source'){
			$('#moveSource').html('');
			$('#moveSource').siblings('#movePageShowMore').hide();
		}
		else if(moveCheckSum == 'dest'){
			$('#moveDestination').html('');
			$('#moveDestination').siblings('#movePageShowMore').hide();
		}
		$.each(AllCloudsInfo,function(i,cloud){
			var email = cloud.cloudUserId;
			email = email.split('|');
			email = email[1];
			var _warning = cloud.cloudStatus == "INACTIVE" ? "cf-warning" : "";
			var _msg="";
			if(cloud.cloudName == "ONEDRIVE" && cloud.cloudStatus == "INACTIVE")
				_msg="OneDrive API has been upgraded. Please re-connect your cloud.";
			if(cloud.userDisplayName != '' || cloud.userDisplayName != null){dispanme = cloud.userDisplayName;}
			else{
				dispanme = email
				}
				var titleName = dispanme;
			dispanme = CFManageCloudAccountsAjaxCall.getMaxChars(dispanme,20); 
			//cloud.cloudName != "DROPBOX_BUSINESS" && cloud.cloudName != "ONEDRIVE_BUSINESS_ADMIN"
			if((MultiUserClouds.indexOf(cloud.cloudName) == -1)) {// || cloud.userType == "ADMIN"
			var destHtml= '<div class="moveCloudBlock button ' + _warning + '" style="padding:0px" title="' + _msg +'">' +
                    '<input type="radio"  name="destCloud" class="destCloudInput" style="margin: 5px;height: 15px;width: 15px;display:none;">' +
                    '<div class="move ' + cloud.cloudName + '"  cid="' + cloud.id + '" pid="' + cloud.rootFolderId + '"></div>' +
                    '<p id="userEmail" title="'+titleName+'">' + dispanme + '</i></p></div>'
				
                $('#moveDestination').append(destHtml);
			}

			$('#moveDestination .moveCloudBlock').droppable({accept:'#moveSource .list-group-item',drop:dropEventHandler,over:function(){$(this).addClass('moveCloudBlockDragHover').removeClass('moveCloudBlock');},out:function(){$(this).removeClass('moveCloudBlockDragHover').addClass('moveCloudBlock');}});
		});
		PageName = 'moveLanding';
		$('#moveDestination').siblings('.tab-header').children('.move').css('display','none');
		$('#moveDestination').siblings('.tab-header').children('#dynamicDestCloudName').html('');
		$('#moveDestination').siblings('.tab-header').children('#totalfilesdestination').html('');
		$('#VerifyMsg,#moveMsg').html('').removeAttr('class');
		$('#verifyStatus').removeAttr('class').removeAttr('style');
		$('#dynamicDestCloudName').removeAttr('check');
		$('#movecheckModal').prop('disabled',true).removeClass('blue');
	}
	else{
		SinglePId = navid;
		SingleCloudId = cloudid;
		PageNumber = 1;
		// $('#spinner2').show();
		$("#CFShowLoading").css("display","");
		//CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(navid, PageNumber);
		if(_dstnCldName === "SHAREPOINT_CONSUMER_HYBRID"){
			var prev1 = $(this).attr('previousParentId');
			var prev2 = prev1.split('*').length-3;
			var prevParentId = prev1.split('*')[prev2];
			var array = prev1.split('*');
			var string = '';
			if(array.length ==2){
				string = array[0];
			}
			else{
				for(var i =0;i<array.length;i++){
					string = string + array[i];
					if(i==array.length-3){
						//string = string + array[i];
						break;}
					else
						string = string+'*';
				}
			}
			prevParentId = string;
			if(prevParentId == undefined)
				var prevParentId = '/';
			CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber,sharepointListId,prevParentId);
		}
		else
			CFManageCloudAccountsAjaxCall.getAllRootFoldersAndFiles(SingleCloudId, PageNumber);
	}
	if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_ONLINE" && $('#dynamicDestCloudName [data-type="SITE"]'))
	{
		$('#movecheckModal').prop('disabled',true).removeClass('blue');
	}
	if($('#dynamicDestCloudName').attr('type') == "SHAREPOINT_ONLINE_CONSUMER" && $('#dynamicDestCloudName [data-type="SITE"]'))
	{
		$('#movecheckModal').prop('disabled',true).removeClass('blue');
	}
});

$('#moveSource').on('click','#moveSourceCheckbox',function(){
	if($(this).is(':checked')){
		$('#moveSource').find('input[type="checkbox"]').each(function(){
			$(this).prop('checked',true);
			$(this).parent('span').addClass('fileActive');
		});
	}else{
		$('#moveSource').find('input[type="checkbox"]').each(function(){
			$(this).prop('checked',false);
			$('#moveSource').find('.fileActive').each(function(){
				$(this).removeClass('fileActive');
			});
		});
	}
});

$('#movecheckModal').on('click',function(){

	if($('.multiUsrClass:checkbox:checked').length > 0 ) {
		sendGAEvents("Move For Multi-User");
		var _chk=[];
		$('.multiUsrClass:checkbox:checked').parents(".multiUsrCheckSlct").each(function () {
			var _parent=$(this);
			var CFMultiUserMove={
				"userId":localStorage.getItem('UserId'),
				"fromCloudId":$(_parent).find(".mulSrc").attr("scid"),
				"fromCloudName":$(_parent).find(".mulSrc").attr("sname"),
				"fromRootId":$(_parent).find(".mulSrc").attr("spid"),
				"fromEmailId":$(_parent).find(".mulSrc").text(),
				"toCloudId":$(_parent).find(".mulDst").attr("dcid"),
				"toCloudName":$(_parent).find(".mulDst").attr("dname"),
				"toRootId":$(_parent).find(".mulDst").attr("dpid"),
				"toEmailId":$(_parent).find(".mulDst").text(),
			};

			$.each(AllCloudsInfo,function(i,c){
				if(c.id == CFMultiUserMove.fromCloudId)
					CFMultiUserMove.fromEmailId = c.cloudUserId.split("|")[1];
				if(c.id == CFMultiUserMove.toCloudId)
					CFMultiUserMove.toEmailId = c.cloudUserId.split("|")[1];
			});
			_chk=multiUsrCloudsMove(CFMultiUserMove,null)
		});
		if(_chk) {
			alertSuccess("Multi-User Move has been initiated.");
			setTimeout(function() {
				$('#moveReports').trigger('click');
				localStorage.setItem("MigtnDone","consumer");
			}, 5000);
		}
		return false;
	}
	sendGAEvents("Move Files initiated - Verify Call");
	//activecampaign.eventTrack('Migrate',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
	var dynamicDestination = $('#dynamicDestCloudName'),
		dinput = $('#moveDestination input:checked'),
		dynamicSource = $('#dynamicCloudName'),
		siteCount = $('#moveSource').find('label[data-type="SITE"]').length,
		shareFolder = $('#moveSource').find('i.lnil-folder').each(function(){
			$(this).find('p').text();
		});
	$('#deleteSourceFiles').removeAttr('disabled');
	/*	if(dinput.length ==0)
            dinput = $('#moveDestination .fileActive');*/
	if(dinput.length ==0) {
		$('#dynamicDestCloudName').attr('check','droot');
		dynamicDestination = $('#dynamicDestCloudName');

	}
	if(dynamicDestination.attr('type') == "EGNYTE_STORAGE" && dynamicDestination.attr('check') == "droot"){
		if (dinput.length == 0) {

			if($('#moveDestination').find('i').hasClass('lnil-folder')) {
				alertSuccess( 'Please select destination folder.');
				$('#moveFileCheck').modal('hide');
				return false;

			}
		}
	}
	
	else if(dynamicDestination.attr('type') == "SHARED_DRIVES" && dynamicDestination.attr('check') == "droot"){
		if(dinput.length == 0 && $('#moveDestination').find('label').attr('data-type') == "DRIVE"){
			if($('#moveDestination').find('i').hasClass('lnil-folder')) {
				alertSuccess( 'Please select destination folder.');
				$('#moveFileCheck').modal('hide');
				return false;
			}
		}
	}
	else if(dynamicDestination.attr('type') == "AZURE_OBJECT_STORAGE" && dynamicDestination.attr('check') == "droot" && $('#moveDestination').children('div#getClouds').length){
		if(dinput.length == 0){
			if($('#moveDestination').find('i').hasClass('lnil-folder')) {
				alertSuccess( 'Please select a container.');
				$('#moveFileCheck').modal('hide');
				return false;
			}
		}
	}
	/*else if(dynamicDestination.attr('type') == "WASABI" && dynamicDestination.attr('check') == "droot"){
		if(dinput.length == 0){
			if($('#moveDestination').find('i').hasClass('cf-folder6')) {
				alertSuccess( 'Please select destination folder.');
				$('#moveFileCheck').modal('hide');
				return false;
			}
		}
	}
	else if(dynamicDestination.attr('type') == "AMAZON" && dynamicDestination.attr('check') == "droot" && $('#moveDestination').children('div#getClouds').length){
		if(dinput.length == 0){
			if($('#moveDestination').find('i').hasClass('cf-folder6')) {
				alertSuccess( 'Please select a container.');
				$('#moveFileCheck').modal('hide');
				return false;
			}
		}
	}*/
	else  if(dynamicDestination.attr('type') == "SHAREPOINT_ONLINE" && dynamicDestination.attr('check') == "droot")
	{
		if(!$("#movecheckModal").hasClass("blue"))
		{
			alertSuccess('Cannot migrate into Sites.');
			$('#moveFileCheck').modal('hide');
			return false;
		}
	}
	else  if(dynamicDestination.attr('type') == "SHAREPOINT_ONLINE_CONSUMER" && dynamicDestination.attr('check') == "droot")
	{
		if(!$("#movecheckModal").hasClass("blue"))
		{
			alertSuccess('Please select destination folder.');
			$('#moveFileCheck').modal('hide');
			return false;
		}
		/* if(dinput.length == 0){
                   if($('[data-type="destback"]').attr('id') =='getClouds' && ($('#moveDestination').children('.list-group').children().length!==0)){
                   alertSuccess('Please select destination folder.');
                   $('#moveFileCheck').modal('hide');
                   return false;
                    }
                   } */
	}
	else  if( dynamicDestination.attr('type') == "SHAREPOINT_CONSUMER_HYBRID"  && dynamicDestination.attr('check') == "droot")
	{
		if(dinput.length == 0){
			if($('[data-type="destback"]').attr('id') =='getClouds'){
				alertSuccess('Please select destination folder.');
				$('#moveFileCheck').modal('hide');
				return false;
			}
		}
	}
	else if($('#moveDestination .fileActive').children('div').attr('class') == 'move EGNYTE_STORAGE'){
		alertSuccess('Please select destination folder.');
		$('#moveFileCheck').modal('hide');
		return false;
	}
	else if($('#moveDestination .fileActive').children('div').attr('class') == 'move AZURE_OBJECT_STORAGE'){
		alertSuccess('Please select a container.');
		$('#moveFileCheck').modal('hide');
		return false;
	}
	else if($('#moveDestination .fileActive').children('div').attr('class') == 'move SHAREPOINT_ONLINE_CONSUMER'){
		alertSuccess('Please select destination folder.');
		$('#moveFileCheck').modal('hide');
		return false;
	}
	/*else if($('#moveDestination .fileActive').children('div').attr('class') == 'move WASABI'){
		alertSuccess('Please select destination folder.');
		$('#moveFileCheck').modal('hide');
		return false;
	}
	else if($('#moveDestination .fileActive').children('div').attr('class') == 'move AMAZON'){
		alertSuccess('Please select a container.');
		$('#moveFileCheck').modal('hide');
		return false;
	}*/
	else if($('#moveDestination .fileActive').children('div').attr('class') == 'move SHARED_DRIVES'){
		alertSuccess('Please select destination folder.');
		$('#moveFileCheck').modal('hide');
		return false;
	}
	$('#moveFileCheck').modal('show');

	setTimeout(function() {
		$('#movePopup').find("#CFFileMove").removeClass('buttonDisabled');
		$('#moveFilesList').html('');
		$('#moveNotifyEmails').val('').hide();
		$('#CFFileMove').addClass('blue').attr('disabled', false);
		$('#nofityOthersCheckBox,#nofityMeCheckBox').prop('checked', false);
		var fileNames = [],
			i,
			fileId = [],
			fileCid = [],
			fileType= [],
			srcName,
			srcType,
			destName,
			destType = "",
			destid,
			destcid,
			passCount = [],
			failCount = [],
			moveVerify = {
				"fromCloudId": {
					"id": ""
				},
				"toCloudId": {
					"id": ""
				},
				"fromRootId": "",
				"toRootId": "",
				"deleteOriginalFiles": false,
				"createdTime": "",
				"modifiedTime": "",
				"userEmails": [],
				"useEncryptKey": false,
				"notify": false,
				"fileMove": false,
				"success": false
			};
		$('#moveSource').find('.list-group-item input:checked').each(function () {
			var _this = $(this).siblings('label');
			fileNames.push(_this.children('p').attr('title'));
			fileId.push(_this.attr('id'));
			fileCid.push(_this.attr('cid'));
			fileType.push(_this.attr('data-type'));
			var size = _this.attr('size');
		});
		 var gprt=$("#moveSource").find(".list-group").find("span").attr("srcgrandparent");
		 if(($('#moveSourceCheckbox').is(':checked'))&&(gprt==null||gprt==""))
				{
               var pl = /\</g;
               var pl1 = /\>/g;
               var pl2 = /\"/g;
               var pl3 = /\'/g;
               var source_cloudname=dynamicSource.attr('type');
               var _fileName = "G_DRIVE_Root";
               var _fileId = fileId[i];

               switch(source_cloudname)
               {
               	case "G_DRIVE":
               	_fileName="G_DRIVE_Root";
               	break;
               	case "BOX":
               	_fileName="BOX_Root";
               	break;
				case "DROPBOX":
				_fileName="DROPBOX_Root";
				break;
				case "ONEDRIVE":
					_fileName="ONEDRIVE_Root";
					break;
                 case "FTP":
					 _fileName="FTP_Root";
					 break;
				case "SHAREPOINT_ONLINE_CONSUMER":
					_fileName="SPO_Root";
					break;
               	default:
                _fileName="root";
                break;
               	    
               }
               _fileName = _fileName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
              // _fileId = _fileId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');			
			$('#moveFilesList').append('<li id="' + _fileId + '" ' +
				'cid="' + fileCid[i] + '" ' +
				'name="' + _fileName + '" ' +
				'type="' + fileType[i] + '" ' +
				'style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' +
				'<i style="margin:3% 17% 3% 9%;font-weight:bold;"></i>' + _fileName + '</li>');
		}
		else
		{
		for (i = 0; i < fileNames.length; i++) {
               var pl = /\</g;
               var pl1 = /\>/g;
               var pl2 = /\"/g;
               var pl3 = /\'/g;
               var _fileName = fileNames[i];
               var _fileId = fileId[i];
               _fileName = _fileName.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');
               _fileId = _fileId.replace(pl,'&lt;').replace(pl1,'&gt;').replace(pl2,'&quot;').replace(pl3,'&apos;');			
			$('#moveFilesList').append('<li id="' + _fileId + '" ' +
				'cid="' + fileCid[i] + '" ' +
				'name="' + _fileName + '" ' +
				'type="' + fileType[i] + '" ' +
				'style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' +
				'<i style="margin:3% 17% 3% 9%;font-weight:bold;"></i>' + _fileName + '</li>');
		}
		}
		var testdest = dynamicDestination.text();
		if (testdest == "") {
			srcName = dynamicSource.text();
			srcType = dynamicSource.attr('type');
			var _dinput = $('#moveDestination .fileActive');
			destName = _dinput.children('p').text();
			destType = _dinput.children('.move').attr('class');
			destType = destType.split(' ');
			destType = destType[1];
			destid = _dinput.children('.move').attr('pid');
			destcid = _dinput.children('.move').attr('cid');
			var CLTYPE = ["SHAREPOINT_2013",
				"SHAREPOINT_2010",
				"ALFRESCO",
				"FTP",
				"ORANGE",
				"CIFS"];

			if($.inArray(destType,CLTYPE)>-1){
				destid = "/"+destcid+destid;
			}
			else if(destType =="AXWAY"){
				destid = "/"+destcid
			}
		}
		else if (testdest != "" && dynamicSource.attr('check') != 'droot') {
			srcName = dynamicSource.text();
			srcType = dynamicSource.attr('type');
			destName = dynamicDestination.text();
			destType = dynamicDestination.attr('type');
			destid = dinput.parent('.list-group-item').attr('id');
			destcid = dinput.parent('.list-group-item').attr('cid');
			if( destid == undefined)
				destid = dinput.attr('id');
			if( destcid == undefined)
				destcid = dinput.attr('cid');

		}
		if (dynamicDestination.attr('check') == 'droot' || dynamicDestination.attr('check') == 'folder') {
			destcid = dynamicDestination.attr('cid');
			destid = dynamicDestination.attr('fid');
		}
		if (dynamicDestination.attr('check') == 'droot' &&  dynamicDestination.attr('type') == "BOX"){
			if(destid == undefined){
				destid = "0";
			}
		}
		var _mcount = CFHPActions.getMoveCount();
		if (_mcount.status === 406) {
			_mcount = 0;

		}
		else {
			if (_mcount.responseText !== '"No Limit"') {
				var _mSize = JSON.parse(_mcount.responseText);
			}
			var _folder = fileType.filter(function (e, i) {
				return (e == "FOLDER" || e == "DRIVE");
			});

			var _FC = fileType.filter(function(e,i){
				return (e == "FILE");
			}).length;
			localStorage.removeItem("fileSizeMessage");
			localStorage.removeItem('remainFileFolderSize');
			localStorage.removeItem('remainFileFolderCount');
			localStorage.removeItem('filesinFolderstatus');
			if (_folder.length > 0 && _mcount.responseText !== '"No Limit"') {
				$.each(fileType, function (i, e) {
					if (e == "FOLDER" || e== "DRIVE") {
						moveVerify.fromCloudId.id = fileCid[i];
				//srikanth		
				if(($('#moveSourceCheckbox').is(':checked'))&&(gprt==null||gprt==""))
				{
					moveVerify.fromRootId = $("#moveSource").find(".list-group").find("span").attr("srcparent");
				}
				else{
						moveVerify.fromRootId = fileId[i];
					}
						moveVerify.toCloudId.id = destcid;
						moveVerify.toRootId = destid;
						var _message = localStorage.getItem("fileSizeMessage");
						var _valRemFilFolSize = localStorage.getItem('remainFileFolderSize');
						var _valRemFilFolCount = localStorage.getItem('remainFileFolderCount');
						if (_valRemFilFolSize != null && _valRemFilFolCount != null) {
							var _FCXhr = CFHPActions.getFileCount(JSON.stringify(moveVerify), _valRemFilFolCount, _valRemFilFolSize);
						} else {
							var _FCXhr = CFHPActions.getFileCount(JSON.stringify(moveVerify), _mSize.remainingNoFiles, _mSize.remaianingSize);
						}
					
						if(_FCXhr.status == 200){
							_FC += parseInt(_FCXhr.responseText);
						}
						else if (_FCXhr.status == 406) {
							localStorage.setItem('filesinFolderstatus','406')
							$('#individualYearly').prop('checked',true);
							$('#individualMonthly').prop('checked',false);
							$('#proYearly').prop('checked',true);
							$('#proMontly').prop('checked',false);
							$('#moveFileCheck').modal('hide');
							$("#liteYearly:hidden").show();
							$("#liteMonthly").hide();
							$("#proYearlychecked:hidden").show();
							$("#proMnthlychecked").hide();
							$('#moveMigrationPrices').modal('show');
							//'#moveMigrationPrices').css("display","");
							var d = new Date();
							var _time = d.toISOString();
							sendGAEvents("Showing move limit price popup",_time);
							return false;

						}

					}
				});
			}
			var filesStatus =   localStorage.getItem('filesinFolderstatus');
			var fileSize = localStorage.getItem("fileSizeMessage");
			if(filesStatus == '406'){
				return false;
			}
		/*	if (_mcount.responseText  != '"No Limit"') {
				_agile.add_tag('Trial user initiated move', {
					success: function (data) {
						console.log("success");
					},
					error: function (data) {
						console.log("error");  
					}
				});
		}*/
			//'#moveFileCheck').modal('show');
			localStorage.removeItem('remainFileSize');
			localStorage.removeItem('remainFileCount');
			var count=0;
			var gparent=$("#moveSource").find(".list-group").find("span").attr("srcgrandparent");
			for (i = 0; i < fileNames.length; i++) {
				if(count==1)
				break;
				var _moveFileChild = $('#moveFilesList').children('li:eq("'+i+'")').children('i'),//children('[id="' + fileId[i] + '"]')
					_moveFileId = fileId[i];
				moveVerify.fromCloudId.id = fileCid[i];
                           //srikanth		
				if(($('#moveSourceCheckbox').is(':checked'))&&(gparent==null||gparent==""))
				{
					count=1;
					moveVerify.fromRootId = $("#moveSource").find(".list-group").find("span").attr("srcparent");
				}
				else
				{
				moveVerify.fromRootId = fileId[i];
				}
				moveVerify.toCloudId.id = destcid;
				if($("#dynamicCloudName").attr("type")== "NTLM_STORAGE" ||$("#dynamicDestCloudName").attr("type")== "SHAREPOINT_CONSUMER_HYBRID"||$("#dynamicDestCloudName").attr("type")== "ONEDRIVE_BUSINESS"){ 
					if(destid == undefined)
					destid = $('#moveDestination').siblings('#movePageShowMore').attr('data-id');
					moveVerify.toRootId = destid;
				}
				else if($("#dynamicDestCloudName").attr("type") == "AMAZON" || $("#dynamicDestCloudName").attr("type") == "WASABI"){
				if($("#moveDestination").find('.list-group-item.fileActive').length == 0){
				moveVerify.toRootId = destid; 
				}
				else{
                    			destid = $("#moveDestination").find('.list-group-item.fileActive').attr('id');
					moveVerify.toRootId = destid;
					
				}
				}
				else{
					moveVerify.toRootId = destid; 
				}
				if($("#dynamicCloudName").attr("type")== "NTLM_STORAGE" ||$("#dynamicDestCloudName").attr("type")== "SHAREPOINT_CONSUMER_HYBRID"){
					var sharePointListItemId;
					if($('#moveDestination input:checked').length !== 0){
						if($('#moveDestination input:checked').siblings('label').children('i').hasClass('cf-network')){
							sharePointListItemId = $('#moveDestination input:checked').siblings().parent('span').attr('id');
						}
					}

					if(sharePointListItemId === undefined){
						sharePointListItemId = sharepointListId;
					}
				}
				moveVerify.sharePointListItemId = sharePointListItemId;
				var jsondata = JSON.stringify(moveVerify);
				if (_mcount.responseText !== '"No Limit"') {
					var _message = localStorage.getItem("fileSizeMessage");
					var _valRemFilSize = localStorage.getItem('remainFileFolderSize');
					var _valRemFilCount = localStorage.getItem('remainFileFolderCount');
					if (_valRemFilSize != null && _valRemFilCount != null) {
						if (_folder.length)
							var _xhr = CFHPActions.getVerifyStatus(jsondata, _valRemFilCount, _valRemFilSize, fileType[i]);
						else
							var _xhr = CFHPActions.getVerifyStatus(jsondata, _valRemFilCount, _valRemFilSize);
					} else {
						if (_folder.length)
							var _xhr = CFHPActions.getVerifyStatus(jsondata, _mSize.remainingNoFiles, _mSize.remaianingSize, fileType[i]);
						else
							var _xhr = CFHPActions.getVerifyStatus(jsondata, _mSize.remainingNoFiles, _mSize.remaianingSize);
					}
					var _fileResponse = _xhr.getResponseHeader('exception');
					if ((_xhr.status == 406 && _fileResponse == "Limit is exceed: Size") || (_xhr.status == 406 && _fileResponse == "Limit is exceed: Files") || (_xhr.status == 200 && _message == "Limit is exceed: Size")||(_xhr.status == 200 && _message == "Limit is exceed: Files")) {
						
						_mcount = 0;
						break;
					} else {
						if (_xhr.status == 406) {

							$("#CFFileMove").addClass('buttonDisable');
							var test = _xhr.getResponseHeader('exception');
							$('#fileFailDive').html('<i class="lnil lnil-cross-circle" style="color: red;font-weight:bold;"></i>&nbsp;&nbsp;' + test);
							_moveFileChild.removeClass('lnil lnil-checkmark-circle').addClass('lnil lnil-cross-circle').css('color', 'red');
							failCount.push(_moveFileId);
						} else if (_xhr.status == 200) {
							$("#CFFileMove").removeClass('buttonDisable');
							_moveFileChild.removeClass('lnil lnil-cross-circle').addClass('lnil lnil-checkmark-circle').css('color', 'limegreen');
							passCount.push(_moveFileId);
						} else if (_xhr.status == 400) {
							$("#CFFileMove").addClass('buttonDisable');
							_moveFileChild.removeClass('lnil lnil-checkmark-circle').addClass('lnil lnil-cross-circle').css('color', 'red');
							failCount.push(_moveFileId);
						}
					}
				} else {
					var _xhr = CFHPActions.getNoLimitVerifyStatus(jsondata);
					if (_xhr.status == 406) {
						$("#CFFileMove").addClass('buttonDisable');
						//$.smallBox({title:'Please select destination folder.',color:"#1ba1e2",timeout:2000});
						var test = _xhr.getResponseHeader('exception');
						$('#fileFailDive').html('<i class="lnil lnil-cross-circle" style="color: red;font-weight:bold;"></i>&nbsp;&nbsp;' + test);
						_moveFileChild.addClass('lnil lnil-cross-circle').css('color', 'red');
						failCount.push(_moveFileId);
					} else if (_xhr.status == 200) {
						$("#CFFileMove").removeClass('buttonDisable');
						_moveFileChild.removeClass('lnil lnil-cross-circle').addClass('lnil lnil-checkmark-circle').css('color', 'limegreen');
						passCount.push(_moveFileId);
					} else if (_xhr.status == 400) {
						$("#CFFileMove").addClass('buttonDisable');
						_moveFileChild.addClass('lnil lnil-cross-circle').css('color', 'red');
						failCount.push(_moveFileId);
					}
				}
			}
		}
		if(_mcount == 0){
			$('input[name=subscription]').prop('checked',false);
			$('input[name=subscription]').parent().css({"border":"1px solid black"});
			$(".btn-group.btn-toggle button:nth-child(1)").removeClass("btn-primary");
			$(".btn-group.btn-toggle button:nth-child(2)").addClass("btn-primary");
			$("#yrlyPkg").css("display","none");
			$("#mnthlyPkg").css("display","block");
			$('input[name=subscription][value=StndMonthly]').prop('checked',true);
			$('input[name=subscription]:checked').parent().css({"border":"2px solid #3276b1"});
			//$.smallBox({title:'Your move limit is exceeded for the day.',color:"rgba(20,124,185,0.8)",timeout:2000});
			$("#CFmoveStatus .pricing input[value='StndMonthly']").attr('checked','checked');
			$("#CFmoveStatus .pricing input[value='StndMonthly']").prop("checked", true);
			$('#individualYearly').prop('checked',true);
			$('#individualMonthly').prop('checked',false);
			$('#proYearly').prop('checked',true);
			$('#proMontly').prop('checked',false);
			$("#liteYearly:hidden").show();
			$("#liteMonthly").hide();
			$("#proYearlychecked:hidden").show();
			$("#proMnthlychecked").hide();
			$('#moveFileCheck').modal('hide');
			$('#moveMigrationPrices').modal('show');
			$('#moveMigrationPrices').css("display","");
			var d = new Date();
			var _time = d.toISOString();
			sendGAEvents("Showing move limit price popup",_time);
			return false;
		}
		else if(_mcount != '"No Limit"' &&_FC > _mcount){
			$('input[name=subscription]').prop('checked',false);
			$('input[name=subscription]').parent().css({"border":"1px solid black"});
			$(".btn-group.btn-toggle button:nth-child(1)").removeClass("btn-primary");
			$(".btn-group.btn-toggle button:nth-child(2)").addClass("btn-primary");
			$("#yrlyPkg").css("display","none");
			$("#mnthlyPkg").css("display","block");
			$('input[name=subscription][value=StndMonthly]').prop('checked',true);
			$('input[name=subscription]:checked').parent().css({"border":"2px solid #3276b1"});
			// $.smallBox({title:'Selected files are beyond your daily limit please select '+_mcount+' files only.',color:"#f86227",timeout:2000});
			$("#CFmoveStatus .pricing input[value='StndMonthly']").attr('checked','checked');
			$("#CFmoveStatus .pricing input[value='StndMonthly']").prop("checked", true);
			$('#individualYearly').prop('checked',true);
			$('#individualMonthly').prop('checked',false);
			$('#proYearly').prop('checked',true);
			$('#proMontly').prop('checked',false);
			$("#liteYearly:hidden").show();
			$("#liteMonthly").hide();
			$("#proYearlychecked:hidden").show();
			$("#proMnthlychecked").hide();
			$('#moveFileCheck').modal('hide');
			$('#moveMigrationPrices').modal('show');
			$('#moveMigrationPrices').css("display","");
			var d = new Date();
			var _time = d.toISOString();
			sendGAEvents("Showing move limit price popup",_time);
			return false;
		}
		$('#fromCloudDispName').prev('div').children('.drive').attr('id', srcType);
	//	$('#fromCloudDispName').prev(('div').children('.drive').attr('src', '../img/PNG/'+srcType+'.png');
	//	$('#toCloudDispName').prev('div').children('.drive').attr('src','../img/PNG/'+destType+'.png');
		$('#fromCloudDispName').text(srcName);
		$('#toCloudDispName').prev('div').children('.drive').attr('id', destType);
		$('#toCloudDispName').prev('div').children('.drive').attr('fid', destid);
		$('#toCloudDispName').text(destName);
		$('#toCloudDispName').attr('cid', destcid);
		// var gprt=$("#moveSource").find(".list-group").find("span").attr("srcgrandparent");
		 if(($('#moveSourceCheckbox').is(':checked'))&&(gprt==null||gprt=="")){
		 	$('#passCount').text(passCount.length).siblings('#totalCount').text(1);
		$('#failCount').text(failCount.length).siblings('#totalCount').text(1);
		 }
		 else{
		$('#passCount').text(passCount.length).siblings('#totalCount').text(fileNames.length);
		$('#failCount').text(failCount.length).siblings('#totalCount').text(fileNames.length);
		 }
		if (passCount.length > 0) {
			$('#filePassDive').show();
		}else {
			$('#filePassDive').hide();
		}
		if (failCount.length > 0) {
			$('#fileFailDive').show();
		}else {
			$('#fileFailDive').hide();
		}
		/* if(srcType == "ONEDRIVE_BUSINESS" && destType == "DROP_BOX"){
         $('.lnil lnil-checkmark-circle').each(function(){
         $('#moveFilesList').find(".lnil lnil-checkmark-circle").removeClass('lnil lnil-checkmark-circle').addClass('lnil lnil-cross-circle').css("color","red");
         $('#fileFailDive').html('<i style="color:red" class="lnil lnil-cross-circle"></i> `File Move is not allowed.');
         });
         $('#filePassDive').hide();
         $('#fileFailDive').show();
         $('#movePopup').find("#CFFileMove").addClass('buttonDisabled');
         }
         else */if(srcType== "AXWAY" &&  destType == "G_DRIVE"){ 
			$('.lnil-checkmark-circle').each(function(){
				$('#moveFilesList').find(".lnil-checkmark-circle").removeClass('lnil lnil-checkmark-circle').addClass('lnil lnil-cross-circle').css("color","red");
				$('#fileFailDive').html('<i style="color:red;font-weight:bold;" class="lnil lnil-cross-circle"></i> File Move is not allowed.');
			});
			$('#filePassDive').hide();
			$('#fileFailDive').show();
			$('#movePopup').find("#CFFileMove").addClass('buttonDisabled');
		}
		if($('#movePopup .modal-footer .buttonDisable').length ==1 && $("#fileFailDive:contains('still Syncing')").length == 1)
		{
			$("#overlayDisableButton").css("display", "block");
			$( "#overlayDisableButton" ).mouseover(function() {
				$('#movePopup .modal-footer span').text("Cloud sync is still in progress.Please try after sometime.");
			});
			$( "#overlayDisableButton" ).mouseout(function() {
				$('#movePopup .modal-footer span').text("");
			});
		}
		else
			$("#overlayDisableButton").css("display", "none");
		$('#movePopup .modal-footer span').text("");
		setTimeout(function(){
			if(siteCount > 0){
				$('#deleteSourceFiles').prop('checked',false);
				$('#deleteSourceFiles').attr('disabled','disabled');
			}
			$('#moveFileCheck').modal('hide');
			$('#movePopup').modal();//$('#overageCharges').modal();
		},1000);
	},2000);
});
/*$('#ovrChrgs').on('click',function(){
	$('#overageCharges').modal('hide');
	$('#movePopup').modal();
});*/
$('#nofityOthersCheckBox').on('click',function(){
	if($(this).is(':checked')){
		$('#moveNotifyEmails').show();
	}else{
		$('#moveNotifyEmails').hide();
	}
});

$('#moveReportFilesList').on('click','.button.movereport',function(){
	sendGAEvents("clicked on migration reports button");
	//activecampaign.eventTrack('Migration Reports',JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'clicked');
	CFManageCloudAccountsAjaxCall.movereportForGiveId($(this).attr('data-move'),parseInt($(this).attr('data-page')) +1 );
});

function getcatData() {
	var apiUrl = apicallurl + "/category/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "";
	var allCategory = [];
	var fileIds = FromfileId;
	$.ajax({
		type: "GET",
		url: apiUrl,
		async: false,
		dataType: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
		},
		success: function (AllCategory) {
			$.each(AllCategory, function (i, category) {
				var categoryObj;
				if ($.inArray(category.categoryName, OOBCategory) > -1) {
				} else {
					categoryObj = {
						id: category.id,
						categoryName: category.categoryName
					};
					allCategory.push(categoryObj);
				}
			});
			newCategory = false;
			allCategoryData = allCategory;
		}
	});
	return allCategoryData;
}

$('#addToCategory').on('click', function(e) {
	sendGAEvents("Add to Category");
	//_gaq.push(['_trackEvent',"Add to Category", localStorage.getItem('UserId')]);
	$('#mycategorymodel .DisplayMsg').text('');
	$('#CreateCategory').css('border-color', '');
	$('.ms-close-btn').trigger("click");
	var addCategory = $('#mycategorymodel #CreateCategory');
	var cs = $(addCategory).magicSuggest({
		width: 250,
		sortOrder: 'categoryName',
		maxDropHeight: 136,
		displayField: 'categoryName',
		data: function dataRen() {
			if (allCategoryData != "") {
				if (newCategory == false) {
					return allCategoryData;
				}else {
					return getcatData();
				}
			} else {
				return getcatData();
			}
		}
	});
	$('#ms-input-0').css('border', 'none');
	$('#CreateCategory').css('position','absolute');
	$('#CreateCategory').css('left','60px');
	setTimeout(function(){
		$('#CreateCategory').addClass('ms-ctn-bootstrap-focus');
	},500);
});

$('#CFAddCategoryButton').on('click',function(e) {
	var regexp = new RegExp(/^[A-Za-z][-a-zA-Z 0-9._,]*$/);//TODO maek it global reg exprn - Mike
	/* var regexp = new RegExp(/^[a-zA-Z0-9._-]+$/); */
	$('#CreateCategory').css('border-color', '');
	$('#mycategorymodel .DisplayMsg').text('');
	setTimeout(function () {
		var CatName = $('#ms-sel-ctn-0').children('div').text();
		var CatLength = $('#ms-sel-ctn-0').children('div').length;
		if (CatName.trim().length == 0) {
			$('#mycategorymodel .DisplayMsg').text('Please enter category name or choose a Category.');
			$('#CreateCategory').css('border-color', 'red');
			return false;
		}
		for (var i = 0; i < CatLength; i++) {
			for (j = 0; j < i; j++) {
				var CatNameI = $('#ms-sel-ctn-0').children('div:eq(' + i + ')').text();
				var CatNameJ = $('#ms-sel-ctn-0').children('div:eq(' + j + ')').text();
				CatNameI = $.trim(CatNameI);
				CatNameJ = $.trim(CatNameJ);
				if (CatNameI.toLowerCase() == CatNameJ.toLowerCase()) {
					$('#CreateCategory').css('border-color', 'red');
					$('#mycategorymodel .DisplayMsg').text('Cannot create the category with same name .');
					return false;
				}
			}
		}

		for (var i = 0; i < CatLength; i++) {
			var CatName = $('#ms-sel-ctn-0').children('div:eq(' + i + ')').text();
			CatName = $.trim(CatName);
			if (CatName.trim().length == 0) {
				$('#mycategorymodel .DisplayMsg').text('Please enter categoryName or choose a Category.');
				$('#CreateCategory').css('border-color', 'red');
				return false;
			}else if (!CatName.match(regexp)) {
				$('#mycategorymodel .DisplayMsg').text('Category name doesnot contains special character');
				$('#mycategorymodel .ms-ctn-bootstrap-focus').css('border', 'none');
				$('#CreateCategory').css('border-color', 'red');
				return false;
			}
			var catname = [];
			$('#categoryList').children('li').children('a').each(function () {
				catname.push($(this).text());
			});
			var bool = false;
			$.each(catname, function (i, catname) {
				if (CatName == catname) {
				}else if (CatName.toLowerCase() == catname.toLowerCase()) {
					$('#CreateCategory').css('border-color', 'red');
					$('#mycategorymodel .DisplayMsg').text('Category already exists,please enter another name.');
					bool = true;
				}
			});
			if (bool == true) {
				return false;
			}
		}
		for (var i = 0; i < CatLength; i++) {
			var CatName = $('#ms-sel-ctn-0').children('div:eq(' + i + ')').text();
			CatName = $.trim(CatName);
			if (CatName != null && CatName.match(regexp)) {
				CFManageCloudAccountsAjaxCall.createCategoryGlobal(CatName);
			}
		}
		$('#cancelcategory').trigger('click');
	}, 500);
});

$('#panelPosition').on('click',function(){
	if($(this).hasClass('cf-plus4')){
		$(this).closest('#dropZone_Upload').find('form').slideDown(500);
		setTimeout(function(){$('#my-awesome-dropzone').css('overflow-y','auto');},501);
		$(this).removeClass('cf-plus4').addClass('cf-minus4');
	}else if($(this).hasClass('cf-minus4')){
		$(this).parent().next().slideUp(500);
		setTimeout(function(){$('#my-awesome-dropzone').css('overflow-y','auto');},501);
		$(this).removeClass('cf-minus4').addClass('cf-plus4');
	}
});

$('#my-awesome-dropzone .dz-remove').on('click',function(){
	var len = $('#my-awesome-dropzone').find('.dz-remove').length;
	if(len == 0){
		$('#my-awesome-dropzone').removeClass('dz-started');
	}
});

function completeFileUpload(fileobj){
	var parentFile = '';
	if($.type(fileobj) == "array"){
		parentFile = fileobj[0].parentFileRef;
	}else{
		parentFile = fileobj.parentFileRef;
	}
	var fids = [];
	var id;
	if(parentFile != null || parentFile != undefined) {
		var parentFolder = parentFile;
		$('#breadCrumbdync li').each(function () {
			fids.push($(this).attr('id'));
		});
		if (PageName == "CloudDrive") {
			fids[0] = $('#breadCrumbdync > li').attr('pid');
			id = fids[0].toString();
			var fileName = ['All Files', 'My Drive', 'SkyDrive', "", 'My Files & Folders', 'cloudian','My SugarSync',""];
			if(isProd){
				fileName.push('CloudFuze');
			}else{
				fileName.push('Cloudfuze Dev');
			}
			if ($.inArray(parentFolder.objectName, fileName) > -1 && id.indexOf('/') > -1) {
				id = "/" + SingleCloudId + "" + id;
				fids[0] = id;
			}
			if(id != fileobj[0].cloudId){
				return false;
			}
		}
		if (parentFolder != null && $.inArray(parentFolder.id, fids) < 0) {
			if(PageName == "Home" || PageName == 'Recent files' || PageName == 'InnerWorkSpace' || PageName == "CloudDrive"){
				var _c = $('#CloudDriveList').find('.catactive').closest('.clsubmenu').attr('id');
				if(_c == "AMAZON_STORAGE" && PageName == "CloudDrive"){
					return false;
				}
			}
			else{
				return false;
			}
		}
	}
	else if(parentFile == null || parentFile == undefined){
		if (PageName == "CloudDrive") {
			fids = [];
			$('#breadCrumbdync li').each(function () {
				fids.push($(this).attr('id'));
			});
			fids[0] = $('#breadCrumbdync > li').attr('pid');
			id = fids[0].toString();
			if(id != fileobj[0].cloudId){
				return false;
			}
		}
	}
	if(fileobj.length != 0){
		$.each(fileobj,function(i,file) {
			if(PageName == 'InnerWorkSpace'){
				sendGAEvents("Upload In Workspace");
				//_gaq.push(['_trackEvent',"Upload In Workspace", localStorage.getItem('UserId')]);
				var check = $('#workspaceFiles').find('.cf-back').attr('sid');
				var type;
				var class1;
				var html;
				if(check != undefined){
					type = file.directory == false ? 'FIL' : 'FOLDER';
					class1= file.directory == false ? "sorting_1" : "folder";
					html ='<tr pid="'+file.parent+'" class="gradeA" fexten="'+file.objectExtn+'" style="display:inline-table">' +
						'<td class="wsfcheckbox"><input type="checkbox" /></td>' +
						'<td class="LVFILEIcon"><i class="LV'+type+'"' +
						'style="width: 22px;height: 29px;display: block;margin-top: 0px;cursor:pointer;"></i></td>';
					html +=
						'<td class="' +class1+ '" name="' + encodeURIComponent(file.objectName) + '" cloudid="' + file.cloudId + '" id="' + encodeURIComponent(file.id) + '" data-type="'+file.objectSize+'" title="'+file.objectName+'" ><span style="display:inline-block;width:100%">' + CFManageCloudAccountsAjaxCall.getMaxChars(file.objectName,40) + '</span></td>' +
						'<td style="width:13.5%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getObjectSize(file.objectSize, filetype) + '</td>' +
						'<td class=" " style="width:20%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getDateConversion(file.modifiedTime) + '</td>' +
						'<td style="font-size: 20px;width:7%;padding: 3px 8px 0 5px;"><i class="cf-comments2" id="getComments"></i></td></tr>';
					$('#workspaceFiles').append(html);
					workspaceActicities(WorkSpaceId , 1);
				}else{
					type = file.directory == false ? 'FIL' : 'FOLDER';
					class1= file.directory == false ? "sorting_1" : "folder";
					html ='<tr pid="'+file.parent+'" class="gradeA" fexten="'+file.objectExtn+'" style="display:inline-table">' +
						'<td class="wsfcheckbox"><input type="checkbox" /></td>' +
						'<td class="LVFILEIcon"><i class="LV'+type+'"' +
						'style="width: 22px;height: 29px;display: block;margin-top: 0px;cursor:pointer;"></i></td>';
					html +=
						'<td class="' +class1+ '" name="' + encodeURIComponent(file.objectName) + '" cloudid="' + file.cloudId + '" id="' + encodeURIComponent(file.id) + '" data-type="'+file.objectSize+'" title="'+file.objectName+'" ><span style="display:inline-block;width:100%">' + CFManageCloudAccountsAjaxCall.getMaxChars(file.objectName,40) + '</span></td>' +
						'<td style="width:13.5%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getObjectSize(file.objectSize, filetype) + '</td>' +
						'<td class=" " style="width:20%;padding: 2px 2px 0 2px;">' + CFManageCloudAccountsAjaxCall.getDateConversion(file.modifiedTime) + '</td>' +
						'<td style="font-size: 20px;width:7%;padding: 3px 8px 0 5px;"><i class="cf-comments2" id="getComments"></i></td></tr>';
					$('#workspaceFiles').append(html);
					$('#NoFilesWorkspace').hide();
					CFManageCloudAccountsAjaxCall.addFilesToWorkspace(WorkSpaceId , file.id);
					workspaceActicities(WorkSpaceId , 1);
				}
				return false;
			}
			var objectName = file.objectName;
			var objectSize = file.objectSize;
			var cloudName = file.cloudName;
			var cloudId = file.cloudId;
			var fileId = file.id;
			var parent = file.parent;
			var fileExten = file.objectExtn;
			var filetype = file.type;
			var favourite = file.favourite;
			var favouriteicon;
			if (favourite == true) {
				favouriteicon = heartFill;
			}
			else if (favourite == false) {
				favouriteicon = heart;
			}
			var fileIcon = CFManageCloudAccountsAjaxCall.getFileIcon(fileExten, filetype);
			var dateCreated = CFManageCloudAccountsAjaxCall.getDateConversion(file.createdTime);
			var dateModified = CFManageCloudAccountsAjaxCall.getDateConversion(file.modifiedTime);

			var _listFile = '<div class="panel-data" id="' + parent + '" data-type="' + filetype + '" fileper="'+FilePer[0]+'">' +
				'<div class="LVcheckBox" name="' + filetype + '">' +
				'<input type="checkbox"/></div><div class="LVfileName" id="' + fileId + '" style="height:20px" name="' + filetype + '">' +
				'<i class="LV' + filetype + ' pull-left"></i><p class="pull-left" name="' + objectName + '" fexten="' + fileExten + '">' +
				CFManageCloudAccountsAjaxCall.getMaxChars(objectName,50) + '</p></div><div class="LVFavorites">' +
				'<a href="#" id="LVFavorite" class="' + favouriteicon + '"></a></div>' +
				'<div class="LVfileSize" style="cursor:pointer;">' + CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) +
				'</div><div class="LVdrive" id="' + cloudId + '">' + CLName[cloudName] +
				'</div><div class="LVaddedDate">' + dateCreated + '</div><div class="LVmodifiedDate">' + dateModified + '</div></div>';

			var _thumbFile = '<div class="file ' + fileIcon + '" id="' + cloudId + '" style="cursor:pointer;"' +
				' data-type="' + filetype + '">' +
				'<i title="' + objectName + '" class="filethumbnail" name="' + filetype + '"></i>' +
				'<strong class="filename" pid="' + parent + '" id="' + fileId + '" fexten="' + fileExten + '">' +
				CFManageCloudAccountsAjaxCall.getMaxChars(objectName,14) + '</strong><div class="filesize">' +
				CFManageCloudAccountsAjaxCall.getObjectSize(objectSize, filetype) + '</div>' +
				'<input type="checkbox" class="fileCheck" name="' + filetype + '"/><a href="#" id="' + fileId + '">' +
				'<!--i class="MetaDataIcon"></i--></a><i id="ThFav" class="' + favouriteicon + '" style="cursor:pointer;"></i></div>';

			$('#ListContent #LVContent').prepend(_listFile);
			$('#ThumbnailContent').prepend(_thumbFile);
			$('.LVHcheckBox input').prop("disabled", false);
			if($('#CFSharedWithMe').parent('li').hasClass('active')){
				$('#ListContent').find('.LVFavorites').addClass('buttonDisable');
			}
		});
	}
	selectEvent.init();
}

//Folder Navigation InnerWorkspace
$('#workspaceFiles').on('click','td.folder',function(){
	var object = {};

	if($(this).hasClass('Rename')){
		return false;
	}

	object.cloudId = $(this).attr('cloudid');
	object.sharedFolderId = $(this).closest('tr').attr('shareId');
	object.folderId = decodeURIComponent($(this).attr('id'));
	CFWlistview.navigateWorkspaceFolders(object);
	$('#main').find('input').prop('checked',false);
	disableActionPanel(actionPanel);
});

$('#workspaceFiles').on('click','i.cf-back',function(){
	var object={};
	object.cloudId = $(this).closest('tr').attr('cid');
	object.sharedFolderId = $(this).attr('sid');
	object.folderId = decodeURIComponent($(this).attr('pid'));
	object.fileId = decodeURIComponent($(this).attr('fid'));
	if(object.sharedFolderId == object.folderId){
		var child = $('.cf-back').attr('child');
		if(child == "true"){
			CFWlistview.navigateWorkspaceFolders(object);
		}else{
			var wdetails = CFWlistview.getWorkspaceDetails(WorkSpaceId);
			getFilesForaWorkspace(wsdetails);
		}
	}
	else if(object.fileId == object.sharedFolderId){
		var wdetails = CFWlistview.getWorkspaceDetails(WorkSpaceId);
		getFilesForaWorkspace(wsdetails);
	}
	else if(object.folderId == '/'+object.cloudId+'/'){
		var wdetails = CFWlistview.getWorkspaceDetails(WorkSpaceId);
		getFilesForaWorkspace(wsdetails);
	}
	else{
		CFWlistview.navigateWorkspaceFolders(object);
	}
	$('#main').find('input').prop('checked',false);
	disableActionPanel(actionPanel);
});

//FolderShare Navigation ShareWithME
$('#CFSharePwdButton').on('click',function(){
	$(this).addClass('buttonDisable');
	var fileId = SinglePId;
	var cloudId = SingleCloudId;
	var Pn = PageNumber;
	var sharedPassword = CFHPlistview.getFileShare(fileId).sharePassword;
	var fileShareUrl = "forword";
	var enpwd = $(this).closest('.modal').find('input').val();
	if(sharedPassword != enpwd){
		$('#Msg span').text('Please enter correct password.');
	}else{
		$('#Msg span').text('');
		CFManageCloudAccountsAjaxCall.gotoInnerFolderandFiles(cloudId, fileId, Pn, fileShareUrl, sharedFolderId ,sharedPassword);
	}
});

$('#sharePasswordModel').on('keydown','input',function(e){
	if(e.keyCode == 13){
		$('#CFSharePwdButton').trigger('click');
	}else if(e.keyCode == 27){
		$('#sharePasswordModel').modal('hide');
	}
});

$('#myPasswordModel').on('keydown','input',function(e){
	if(e.keyCode == 13){
		$('#myPasswordModel').find('#CFPwdButton').trigger('click');
	}else if(e.keyCode == 27){
		$('#myPasswordModel').modal('hide');
	}
});

function enblePanel(){
	var _cloudName = $('#CloudDriveList').find('.catactive').closest('.clsubmenu').attr('id');
	var _x = ["WALRUS","AZURE_OBJECT_STORAGE","SALES_FORCE","DOCUMENTUM","CENTURYLINK"];
	var _a = $('#secondary').find('.active').children('a').attr('id');
	var _b = ['favourite','CFSharedByMe','CFSharedWithMe','CFRecentFilesAndFolders','categorytogle'];
	var _y = ['owner'];
	if(PageName == "CloudDrive") {
		var _c =["SHAREPOINT_2010","CLOUDIAN","DOCUMENTUM","EGNYTE_STORAGE","ORANGE","AMAZON","DROPBOX_BUSINESS"];
		if ($.inArray(_cloudName,_c)>-1) {
			return enableCrateControls(true,true);
		}
		else if ($.inArray(_cloudName, _x) > -1) {
			return enableCrateControls(false,true);
		}
		else {
			return enableCrateControls(false,false);
		}
	}else if(PageName == "search" && previousPage=="CloudDrive") {
		var _c =["SHAREPOINT_2010","CLOUDIAN","DOCUMENTUM","EGNYTE_STORAGE","ORANGE","AMAZON"];
		if ($.inArray(_cloudName,_c)>-1) {
			return enableCrateControls(true,true);
		}
		else if ($.inArray(_cloudName, _x) > -1) {
			return enableCrateControls(false,true);
		}
		else {
			return enableCrateControls(false,false);
		}
	}
	else if(PageName == "InnerFolders") {
		var _fileDetails = CFHPlistview.getFileDetails(SinglePId);
		if ($.inArray(_a, _b) > -1) {
			if (_a == 'CFSharedWithMe') {
				var t = $('#LVContent > .panel-data').attr('fileper');
			}
			if (FilePer.length > 0) {
				t = FilePer[0];
			}
			if ((_a == 'CFSharedWithMe') && ($.inArray(t, _y) > -1)) {
				return enableCrateControls(false, false);
			}
			else if (_a == 'CFSharedByMe' || _a == 'favourite' || _a == 'CFRecentFilesAndFolders') {
				return enableCrateControls(false, false);
			}
			else {
				return enableCrateControls(true, true);
			}
		}
		var _f = '';
		if (isProd) {
			_f = /CloudFuze/g;
		} else if (!isProd) {
			_f = /Cloudfuze Dev/g;
		}
		if (_cloudName == "ORANGE" && SinglePId != '/' && _f.test(atob(SinglePId.split('/' + SingleCloudId + '/')[1]))) {
			return enableCrateControls(false, false);
		}
		else if (_cloudName == 'ORANGE' || _cloudName == 'DROPBOX_BUSINESS') {
			return enableCrateControls(true, true);
		} else if (_cloudName == 'EGNYTE_STORAGE') {
			if (/\/Private\//g.test(SinglePId)) {
				return enableCrateControls(false, false);
			} else if (/\/Shared\/Documents/g.test(SinglePId)) {
				return enableCrateControls(false, false);
			} else {
				return enableCrateControls(true, true);
			}
		} else if (_fileDetails != null && _fileDetails.type == "NOTEBOOK") {
			return enableCrateControls(true, true);
		}
		else {
			return enableCrateControls(false, false);
		}
	}
	if($.inArray(_a,_b) > -1){
		return enableCrateControls(true,true);
	}
}

$('#deleteSourceFiles').on('change',function(){
	var _a = $(this).closest('.modal-body').find('#fromCloudDispName').prev().attr('id');
	if(_a == "SALES_FORCE"){
		alert('Move is not allowed from SalesForce');
		$(this).removeAttr('checked');
	}
});

function enableCrateControls(c,u){
	var _c = $("#CFCreateFolder").parent(),
		_u =$('#CFUploadFiles').parent();

	if(c){
		_c.addClass('buttonDisable');
	}else{
		_c.removeClass('buttonDisable');
	}

	if(u){
		_u.addClass('buttonDisable');
	}else{
		_u.removeClass('buttonDisable');
	}
}
function checkDropBoxBusiness() {
	var _a = false,
		_disable = $.extend({},actionPanel);
	$.each(AllCloudsInfo, function (i, e) {
		if (!_a) {
			$.each(FromcloudId, function (j, f) {
				if (f == e.id && !_a) {
					return _a = true;
				}
			});
		}
		else {
			return _a;
		}
	});

	if (_a) {
		_disable.open = false;
		return _disable;
	} else {
		_disable.open = true;
		return _disable;
	}
}
$('#CFMove').on('click', function() {
	window.location.href = "settings.html#move";
});
/*function syncStatus(cid){
 var a;
 var apiUrl = apicallurl + "/move/sync/status?"+ cid;
 $.ajax({
 type: "POST",
 url: apiUrl,
 async: false,
 dataType: "json",
 headers: {
 "Content-Type": "application/json",
 "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
 "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
 },
 complete: function (xhr) {
 a= xhr.getResponseHeader('exception');
 }
 });
 return a;
 };
 $( ".dummy,.dummySrc" ).click(function() {
 if($(".dummy").attr('cid')==$(".dummySrc").attr('cid'))
 {
 $(".dummy").removeClass('cf-refresh4').addClass('cloudSpinn');  
 $(".dummySrc").removeClass('cf-refresh4').addClass('cloudSpinn');
 }
 else
 $(this).removeClass('cf-refresh4').addClass('cloudSpinn');
 var id = $(this).attr('cid');
 sendGAEvents("Clicked on Cloud Sync",id);
 refreshCloud.push(id);
 CFManageCloudAccountsAjaxCall.refreshcloud(id);
 });*/
