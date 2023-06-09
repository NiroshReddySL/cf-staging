$(document).ready(function() {
	CFManageCategoryAjaxCall.getCategory();
});
PageNumber=1;
var CFManageCategoryAjaxCall = {
		getCategory: function(){
	    	var apiUrl=apicallurl+"/category/user/"+CFManageCloudAccountsAjaxCall.getUserId();
			$.ajax({
				type: "GET",
				url: apiUrl,				    
				async: false,
				dataType: "json",
				headers:{
                        "Content-Type":"application/json",
                        "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                    },
				success: function (AllCategory){
					$.each(AllCategory, function(i,cat){
						if(cat.system == true){
							$('#categoryList').append('<li id='+AllCategory[i].id+' class="getFiles"><a href="#" style="width:100%">'+AllCategory[i].categoryName+'</a></li>');
						}
					});
					$.each(AllCategory, function(i,cat){
						if(cat.system == false){
							$('#categoryList').append('<li id='+AllCategory[i].id+' class="getFiles"><a href="#">'+AllCategory[i].categoryName+'</a><i class="removeCategory" data-toggle="modal" data-target="#myModal2"></i><i class="editCategory"></i></li>');
						}
					});
					$('#categoryList').prepend('<li id="addCategory">+ Add New Category</li>');
				},
				complete:function(xhr, statusText){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				},
				statusCode:{
					200: function(){
					},
					204: function(){
						return false;
					}
				}
			});
			CFHPLeftnav.init();
		},
        addCategory: function(thisVal){
			var apiUrl=apicallurl+"/category/create?categoryName="+thisVal+"";
			$.ajax({
				type: "PUT",
				url: apiUrl,				    
				async: false,
				dataType: "json",
				headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                    "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
				success: function (AddCategory){
				    unCheckFile();	
                    newCategory=true;						
					$('#categoryList').append('<li id='+AddCategory.id+' class="getFiles"><a href="#">'+AddCategory.categoryName+'</a><i class="removeCategory" data-toggle="modal" data-target="#myModal2"></i><i class="editCategory"></i></li>');
					return true;
				},
				complete:function(xhr, statusText){
                    if(xhr.status == 406){
                       // $.smallBox({title:xhr.getResponseHeader('exception'),color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error",xhr.getResponseHeader('exception'));
                    }else if(xhr.status > 300){
					     unCheckFile();
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				}
			});
		},

		editCategoryName: function(categoryId,editedVal){
			var apiUrl=apicallurl+"/category/update/"+categoryId+"?categoryName="+editedVal+"";
			$.ajax({
				type: "POST",
				url: apiUrl,
				async: false,
				dataType: "json",
				headers:{
                        "Content-Type":"application/x-www-form-urlencoded",
                        "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                    },
				success: function (EditCategory){
				    newCategory=true;
				},
				complete:function(xhr, statusText){
                    if(xhr.status == 200){
                        var response = xhr.responseText;
                        response = JSON.parse(response);
                        $('.categoryInput').parent('li').html('<a href="#" class="getFiles" id="' + response.id + '">' + response.categoryName + '</a><i class="removeCategory" data-toggle="modal" data-target="#myModal2"></i><i class="editCategory"></i>');
                    }else if(xhr.status == 406){
                        //$.smallBox({title:xhr.getResponseHeader('exception'),color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error",xhr.getResponseHeader('exception'));
                    }else if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				},
				statusCode: {
					200: function(){
					},
					204: function(){
						return false;
					}
				}
			});
		},

		deleteCategory: function(categoryId){
			var apiUrl=apicallurl+"/category/delete/"+categoryId+"";
			$.ajax({
				type: "DELETE",
				url: apiUrl,				    
				async: false,
				dataType: "json",
				headers:{
                        "Content-Type":"application/x-www-form-urlencoded",
                        "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                    },
				success: function (DeleteCategory){
				     newCategory=true;	
					$('ul#categoryList').children('li[id="'+categoryId+'"]').remove();
					if(PageName == "Category" && categoryId == globalCategoryId){
                       $('#CFRecentFilesAndFolders').trigger('click');
					}
				},
				statusCode: {
					200: function(){
					},
					204: function(){
					}
				},
				complete:function(xhr, statusText){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
						//toastr.error("Operation Failed");
					}
				}
			});
			$("#CFDeletePopUp .deletepopup").attr('id','CFDeleteFile');
		},
		
		getFavouriteFiles: function(PageNumber){
			var apiUrl=apicallurl+"/filefolder/favorites?page_size=50&isAscen="+urlParameterObject.isAscen+"&orderField="+urlParameterObject.orderField+"&fetchCollabInfo="+urlParameterObject.fetchCollabInfo+"&page_nbr=" + PageNumber;
			$.ajax({
				type: "GET",
				url: apiUrl,				    
				async: true,
				dataType: "json",
				headers:{
                        "Content-Type":"application/json",
                        "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                    },
				success: function (favFiles){
					$("#breadCrumbdync").empty();
                    $("#breadCrumbdync").append('<li id="FavouriteFiles" class="BCRFList" cloudId="FavouriteFiles" fileId="FavouriteFiles"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">Files </a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a href="#">Favorites </a></li>');
					CFManageCloudAccountsAjaxCall.getAllFileNames(favFiles, PageNumber);
				},
				complete:function(xhr){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				}
			});
			
		},

		addFavouriteFile: function(fileId){
			var apiUrl=apicallurl+"/favorite/add/"+CFManageCloudAccountsAjaxCall.getUserId()+"?fileIds="+encodeURIComponent(fileId);
			$.ajax({
				type: "POST",
				url: apiUrl,				    
				async: false,
				dataType: "json",
				headers:{
                        "Content-Type":"application/x-www-form-urlencoded",
                        "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                    },
				success: function (ALLFilesForAllClouds){
					return true;	
				},
				statusCode: {
					202: function(){
					},
					204: function(){
						return false;
					}
				},
				complete:function(xhr, statusText){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				}
			});
		},
		
		removeFavoriteForFile: function(fileId)	{
		   fileId=encodeURIComponent(fileId);
			var apiUrl=apicallurl+"/favorite/remove/"+CFManageCloudAccountsAjaxCall.getUserId()+"?fileIds="+fileId+"";
			$.ajax({
				type: "DELETE",
				url: apiUrl,				    
				async: false,
				dataType: "json",
				headers:{
                        "Content-Type":"application/x-www-form-urlencoded",
                        "Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails(), 
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                    },
				success: function (addFiletoFavourite){
				if($('#LVContent').children('div').length == 0){
					     $('.LVHcheckBox input').prop("disabled",true);
					}
				return true;	
				},
				statusCode: {
					202: function(){
					},
					204: function(){
						return false;
					}
				},
				complete:function(xhr, statusText){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				}
			});
		},

        getSharedFileNames : function(SharedFileNames, b){

            $("#LVHeader #CFHSortFileName,#LVHeader #CFHSortfileSize").removeAttr('style');
            $("#LVHeader .LVHFavorites").removeAttr('style');

            var _lvc = $('#LVContent');
            var _thc = $('#ThumbnailContent');

            if(PageNumber == 1) {
                _lvc.html('');
                _thc.html('');
            }

            $.each(SharedFileNames,function(i,e){
                if (e.file != null) {
                    var userType = '',
                        sharedFolderId = '';
                    var user = $.parseJSON(localStorage.getItem('CFUser')).primaryEmail;
                    if ($.inArray(user, e.coOwnerEmails) > -1) {
                        userType = 'owner';
                    } else if ($.inArray(user, e.editEmails) > -1) {
                        userType = 'edit';
                    } else if ($.inArray(user, e.readEmails) > -1) {
                        userType = 'read';
                    }
                    var filetype = e.file.directory == true ? 'FOLDER' : 'FILE';
                    sharedFolderId = b == undefined || b == null || b == '' ? e.file.id : '';
                    var fav = e.file.favourite == true ? 'cf-heart22' : 'cf-heart32';
                    var sharetype = e.status;
                    sharetype = e.sharePassword != "NOT_REQUIRED" ? 'Protected' : e.status;

                    var _thumb = '<div class="file ' + CFManageCloudAccountsAjaxCall.getFileIcon(e.file.objectExtn, filetype) + '" id="' + e.file.cloudId + '" 	style="cursor:pointer;" filePer = "' + userType + '" data-type="' + filetype + '">' +
                        '<i title="' + e.file.objectName + '" class="filethumbnail" name="' + filetype + '" sharedFolderId="' + sharedFolderId + '"></i>' +
                        '<strong  class="filename" pid="' + e.file.parent + '" id="' + e.file.id + '" fexten="' + e.file.objectExtn + '">' + CFManageCloudAccountsAjaxCall.getMaxChars(e.file.objectName,14) + '</strong>' +
                        '<div class="filesize" data-type=' + e.file.objectSize + '>' + CFManageCloudAccountsAjaxCall.getObjectSize(e.file.objectSize) + '</div>' +
                        '<sup class="LVPublic ' + sharetype + '" ></sup><input  type="checkbox" class="fileCheck" />';

                    var _list = '<div class="panel-data" id="' + e.file.parent + '"  filePer = "' + userType + '" data-type="' + filetype + '">' +
                        '<div class="LVcheckBox" name="' + filetype + '"><input type="checkbox"/></div>' +
                        '<div class="LVfileName" id="' + e.file.id + '" style="height:20px" name="' + filetype + '" fileShare="' + e.shareUrl + '" sharedFolderId="' + sharedFolderId + '">' +
                        '<i class="LV' + filetype + ' pull-left"></i>' +
                        '<p class="pull-left" name="' + e.file.objectName + '" fexten="' + e.file.objectExtn + '">' +
						CFManageCloudAccountsAjaxCall.getMaxChars(e.file.objectName,40) + '<sup' +
			    ' class="' + sharetype + '">' +
						'</sup></p></div>';

                    var _list_2 = '<div class="LVfileSize" data-type=' + e.file.objectSize + ' style="cursor:pointer;">' + CFManageCloudAccountsAjaxCall.getObjectSize(e.file.objectSize, filetype) + '</div>' +
                        '<div class="LVdrive" id="' + e.file.cloudId + '">' + CLName[e.file.cloudName] + '</div>' +
                        '<div class="LVaddedDate">' + CFManageCloudAccountsAjaxCall.getDateConversion(e.creationDate) + '</div>' +
                        '<div class="LVmodifiedDate">' + CFManageCloudAccountsAjaxCall.getDateConversion(e.modifiedDate) + '</div>' +
                        '</div>';

                    var _fileUser = e.user != null ? e.user.primaryEmail : 'Not Available';

                    if (PageName == "Share by Me") {

                        var _sbl = _list + '<div class="LVFavorites"><a href="#" id="LVFavorite" class="' + fav + '"></a></div>' + _list_2;

                        _lvc.append(_sbl);

                        var _sbt = _thumb + '<i id="ThFav" class="' + fav + '" style="cursor:pointer;"></i></div>';

                        _thc.append(_sbt);

                    } else if (PageName == "Share with Me") {
                        var _swl = _list + '<div class="LVFavorites"><a href="#" id="LVFavorite">'+ CFManageCloudAccountsAjaxCall.getMaxChars(_fileUser,20) +'</a></div>' + _list_2;

                        _lvc.append(_swl);

                        var _swt = _thumb + '<i id="" class="" style="cursor:pointer;"></i>' + CFManageCloudAccountsAjaxCall.getMaxChars(_fileUser,14) + '</div>';

                        _thc.append(_swt);
                    }
                }
            });

			if(PageName =="InnerWorkSpace" || PageName =="Share with Me"){
				$("#LVHeader").children(".LVHFavorites").text("Shared by").css('width','11%');
                $("#CFHSortFileName").css('width','36%');
                $("#CFHSortfileSize").css('width','10%');
				$('#ListContent   .LVFavorites').css("width","9%");
			}
			if(SharedFileNames.length < 40){
			   $('#listShowMore').addClass('divdisplay').text('Show more files...');
			}else {
                $('#listShowMore').removeClass('divdisplay').text('Show more files...');
            }
			if(SharedFileNames.length == 0) {
                $('.LVHcheckBox input').prop("disabled", true);
            }else {
                $('.LVHcheckBox input').prop("disabled", false);
            }
            if($('#mainContentWrapper').hasScrollBar() == true){
                $('#mainContentWrapper').css('width','100%');
            }else if($('#mainContentWrapper').hasScrollBar() == false){
                $('#mainContentWrapper').css('width','99%');
            }
            selectEvent.init();
            $('#spinner1').addClass('divdisplay');
		},

        getFilesShareByMe: function(PageNumber) {
            if (urlParameterObject.orderField == "createdTime") {
                urlParameterObject.orderField = "createdDate";
            }
            if (urlParameterObject.orderField == "modifiedTime") {
                urlParameterObject.orderField = "modifiedDate";
            }
            var apiUrl = apicallurl + "/fileshare/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&page_nbr=" + PageNumber + "&sharedBy=me";
            $.ajax({
                type: "GET",
                url: apiUrl,
                async: true,
                dataType: "json",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (ShareByMe) {
                    $("#breadCrumbdync").empty();
                    $("#breadCrumbdync").append('<li id="ShareByMe" class="BCRFList" cloudId="ShareByMe"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">Files </a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a href="#"> Shared by me</a></li>');
                    CFManageCategoryAjaxCall.getSharedFileNames(ShareByMe,true);
                    return true;
                },
                complete: function (xhr, statusText) {
                    if (xhr.status > 300) {
                        //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
						showNotyNotification("error","Operation Failed");
                    }
                }
            });
        },

		getFilesShareWithMe: function(PageNumber) {
            if (urlParameterObject.orderField == "createdTime") {
                urlParameterObject.orderField = "createdDate";
            }
            if (urlParameterObject.orderField == "modifiedTime") {
                urlParameterObject.orderField = "modifiedDate";
            }
            var apiUrl = apicallurl + "/fileshare/user/" + CFManageCloudAccountsAjaxCall.getUserId() + "?page_size=50&isAscen=" + urlParameterObject.isAscen + "&orderField=" + urlParameterObject.orderField + "&fetchCollabInfo=" + urlParameterObject.fetchCollabInfo + "&page_nbr=" + PageNumber + "&sharedBy=others";

            $.ajax({
                type: "GET",
                url: apiUrl,
                async: true,
                dataType: "json",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
                },
                success: function (ShareWithMe) {
                    $("#breadCrumbdync").empty();
                    $("#breadCrumbdync").append('<li id="ShareWithMe" class="BCRFList" cloudId="ShareWithMe"><a href="#" style="color:blue;text-decoration: underline;cursor:default;">Files </a><span class="divider" style=" font-size: 8pt;padding-left: 5px;">&#9658;</span><a href="#"> Shared with me </a></li>');
                    CFManageCategoryAjaxCall.getSharedFileNames(ShareWithMe);
                    return true;
                },
                complete: function (xhr, statusText) {
                    previousPage = "Share with Me";
                    if (xhr.status > 300) {
                        //$.smallBox({title: "Operation Failed", color: "#e35e00", timeout: notifyError, sound: false});
						showNotyNotification("error","Operation Failed");
                    }
                },
                statusCode: {
                    202: function () {
                    },
                    204: function () {
                        return false;
                    }
                }
            });
            $('#spinner1').addClass('divdisplay');
            selectEvent.init();
        },

        getFilesForCategory : function(categoryId,PageNumber){
			globalCategoryId = categoryId;
			var apiUrl=apicallurl+"/category/files/user/"+CFManageCloudAccountsAjaxCall.getUserId()+"/category?categoryId="+categoryId+"&page_nbr="+PageNumber+"&page_size=50&fetchCollabInfo=true";
			$.ajax({
				type: "GET",
				url: apiUrl,				    
				async: true,
				dataType: "json",
				headers:{
							"Content-Type":"application/x-www-form-urlencoded",
							"Authorization":CFManageCloudAccountsAjaxCall.getAuthDetails()
						},
				success: function (categoryFiles){
					CFManageCloudAccountsAjaxCall.getAllFileNames(categoryFiles,PageNumber);
					CFHPthumbnail.init();
				},
				complete:function(xhr, statusText){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				}
			});
		},

        removeFilesFromCategory : function(fileId,globalCategoryId){
			var apiUrl = apicallurl+"/category/remove/"+globalCategoryId;
			var fileIds = "fileIds="+fileId;
			$.ajax({
				type: "DELETE",
				url: apiUrl,
				async: true,
				dataType: "json",
				data: fileIds,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": CFManageCloudAccountsAjaxCall.getAuthDetails(),
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS"
				},
				success: function (data) {
					$('[id="'+fileId+'"]').parent('.panel-data').remove();
					$('[id="'+fileId+'"]').parent('.file').remove();
					if($('#LVContent').children('div').length == 0){
					     $('.LVHcheckBox input').prop("disabled",true);
					}
				},
				complete:function(xhr, statusText){
					if(xhr.status > 300){
                        //$.smallBox({title:"Operation Failed",color:"#e35e00",timeout:notifyError,sound:false});
						showNotyNotification("error","Operation Failed");
					}
				}
			});
		}
};