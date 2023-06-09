var hostName = window.location.hostname;
var defaultDomain = null;
var isDevweb =/devweb/i.test(hostName);
var isSLWeb = /slweb/i.test(hostName);
var isWebappCheck = /webapp/i.test(hostName);
var isQA = /qaweb/i.test(hostName);
var isDemo = /demos.cloudfuze/i.test(hostName);
var isOnpremise = false;
var isProd = false;
var apicallurl = "",redirectUrl = "",GA = "";
// TODO make same variables useful to all environments - Mike (Done)

if(isDevweb) {
    defaultDomain = "https://devwebapp.cloudfuze.com/";
    redirectUrl = "https://devwebapp.cloudfuze.com";
    GA = "UA-56350345-1";
    isProd = false;
}
else if(isDemo) {
    defaultDomain = "https://demos.cloudfuze.com/";
    redirectUrl = "https://demos.cloudfuze.com";
    GA = "UA-56350345-1";
    isProd = false;
}
else if(isQA) {
    defaultDomain = "https://qawebapp.cloudfuze.com/";
    redirectUrl = "https://qawebapp.cloudfuze.com";
    GA = "UA-56350345-1";
    isProd = false;
}
else if(isSLWeb) {
    defaultDomain = "https://slwebapp.cloudfuze.com/";
    redirectUrl = "https://devwebapp.cloudfuze.com";
    GA = "UA-56350345-1";
    isProd = false;
}
else if(isWebappCheck == false){
    isOnpremise = true;
    defaultDomain = "https://"+hostName+"/";
    redirectUrl = defaultDomain;
    GA = "UA-56350345-1";
    isProd = true;
}
else {
    defaultDomain = "https://webapp.cloudfuze.com/";
    redirectUrl = "https://webapp.cloudfuze.com";
    GA = "UA-37344062-1";
    isProd = true;
}

var domainUrl = "https://"+hostName+"/";
apicallurl = "https://" + hostName + "/proxyservices/v1";

var CFInterConvertTimeUtility = {
    Ptstamptomillsec: function (timestmp) {
        var myDate = new Date(timestmp);
        var result = myDate.getTime();
        return result;
    }
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', GA, 'auto');
ga('send', 'pageview');


/*var _gaq = _gaq || [];
_gaq.push(['_setAccount', GA]);// TODO make GA vars to all environments - Mike (Done)
_gaq.push(['_trackPageview']);
_gaq.push(['_addIgnoredRef', 'www.cloudfuze.com']);
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();*/


if (window.addEventListener) {
    window.addEventListener('error', trackJavaScriptError, false);
}
else if (window.attachEvent) {
    window.attachEvent('onerror', trackJavaScriptError);
}
else {
    window.onerror = trackJavaScriptError;
}
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++)	{
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};
BrowserDetect.init();
function trackJavaScriptError(e) {
    var _msg = e.filename+' : '+e.lineno+' - '+BrowserDetect.browser+' Ver: '+BrowserDetect.version+' OS: '+BrowserDetect.OS;
    //_gaq.push(['_trackEvent', "JavaScript Error" , e.message, _msg]);//Old Code
    ga('send', 'event', "JavaScript Error" , e.message, _msg); //New Code
}

/*GA Events Tracking*/
function sendGAEvents(a,b){
    if(b == null || b == undefined){
        b = PageName;
    }
    //_gaq.push(['_trackEvent', a , localStorage.getItem('UserId'),b]); //OLD Code
    ga('send', 'event', a,localStorage.getItem('UserId'),b); // New Code
}

function sendPageView(a){
    ga('send', 'pageview', a); // New Code
}
/*var token;
var zohoCrm = {

    url : function () {
        return (defaultDomain + 'proxy/zoho/');
    },
    token : function () {
        $.ajax({
            method: "GET",
            async: false,
            url: apicallurl + '/users/zoho/token',
            success: function (data) {
                token=data;
                return token;
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
        return token;
    },
    authToken : function () {
        return 'ec781fb0f3f0d4554ed1109bf7b2949b';
        //return '312c55f37a6c2e43d5f9738b4a2cf7f1';
    },
    scope : function () {
        return 'crmapi';
    },
    format : function () {
        return 1;
    },

    createRecord: function (obj) {

        var _chkNonPubEmail = obj.email;
        var str = _chkNonPubEmail.split('@').slice(1);
        var allowedDomains = ['gmail.com', 'yahoo.com', 'inbox.com',
            'iCloud.com', 'mail.com', 'aol.com', 'msn.com', 'hotmail.com', 'outlook.com', 'live.com', 'yopmail.com',
	    'rediff.com', 'gmx.com', 'yandex.com', 'protonmail.com'];

        var _Obj;

        if ($.inArray(str[0], allowedDomains) === -1) {
            _Obj = {
                "last_Name" :obj.name,
                "email":obj.email,
                "user_Logged_In":"1",
                "business_Email":"YES",
				"phone_Number":obj.phone
            };
        }
        else{
            _Obj = {
                "last_Name" :obj.name,
                "email":obj.email,
                "user_Logged_In":"1",
                "business_Email":"NO",
				"phone_Number":obj.phone
            };
        }

        $.ajax({
            method: "POST",
            async: false,
            data: JSON.stringify(_Obj),
            url: apicallurl+"/zoho/create/user",
            headers: {"Content-Type":"application/json"},
            success:function(data){
                console.log(data);
            },
            
error:function(xhr){
 if(xhr.status == 401){
localStorage.setItem('zohoError','401');
}
}
  
        });
    },

    upgradeSubscribtionRecord:function (email,Info,zohoData1,zohoData2,zohoData3,str,allowedDomains) {
        var _id,_createdDate,_loggedInVal,_amtPaid,_dis,_price,_paidDate;

        $.ajax({
            url: apicallurl +"/zoho/search?email="+email,
            type: 'GET',
            async: false,
            success: function (response) {
                if(response !== undefined) {
                    if (response.data.length !== 0) {
                        _id = response.data[0].id;
                        _createdDate = response.data[0].createdTime;
                        _loggedInVal = response.data[0].userLoggedIn;
                        if (Info === "RecurringHistory") {
                            _amtPaid = response.data[0].amountPaid;
                            _dis = response.data[0].discount;
                            _price = response.data[0].price;
                            _paidDate = response.data[0].paidDate;
                        }
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
                if(localStorage.getItem('CFUser') !== null) {
                    var _chkNonPubEmail = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
                    var str = _chkNonPubEmail.split('@').slice(1);
                    var allowedDomains = ['gmail.com', 'yahoo.com', 'inbox.com',
                        'iCloud.com', 'mail.com', 'aol.com', 'msn.com', 'hotmail.com', 'outlook.com', 'live.com', 'yopmail.com',
			'rediff.com', 'gmx.com', 'yandex.com', 'protonmail.com'];
                }

                if(_id === undefined){
                    var _obj1 = JSON.parse(localStorage.CFUser);
                    var data1 = {
                        name : _obj1.lastName,
                        email : _obj1.primaryEmail
                    };
                    zohoCrm.createRecord(data1);
                    zohoCrm.upgradeSubscribtionRecord(data1.email,Info,zohoData1,zohoData2,zohoData3,_amtPaid,_dis,_price,str,allowedDomains);
                    return;
                }
                else if(_id=== null){
                    var _obj2 = JSON.parse(localStorage.CFUser);
                    var data2 = {
                        name : _obj2.lastName,
                        email : _obj2.primaryEmail
                    };
                    zohoCrm.createRecord(data2);
                    zohoCrm.upgradeSubscribtionRecord(data2.email,Info,zohoData1,zohoData2,zohoData3,_amtPaid,_dis,_price,str,allowedDomains);
                    return;
                }
                if( Info === "RecurringHistory") {
                    zohoCrm.updaterecord(str, allowedDomains, Info, _id, zohoData1, zohoData2, zohoData3, _loggedInVal, _amtPaid, _dis, _price, _paidDate);
                }
                else{
                    zohoCrm.updaterecord(str, allowedDomains, Info, _id, zohoData1, zohoData2, zohoData3, _loggedInVal);
                }
            },
error:function(xhr){
 if(xhr.status == 401){
localStorage.setItem('zohoError','401');
}
},
 	    complete:function(xhr){
                if(xhr.status == 500){
                   var _obj3 = JSON.parse(localStorage.getItem('CFUser'));
                    var data3 = {
                        name : _obj3.lastName,
                        email : _obj3.primaryEmail
                    };
 			zohoCrm.createRecord(data3);
		}
            }
        });
    },
    updaterecord : function (str,allowedDomains,Info,_id,zohoData1,zohoData2,zohoData3,_loggedInVal,_amtPaid,_dis,_price,_paidDate) {
        var _record = '';
        if( Info === "trial"){
            _record = zohoCrm.trialUser();
        }
        else if( Info === "Migration"){
            _record = zohoCrm.migrtnSrcDst(Info,zohoData1,zohoData2,str,allowedDomains);
        }
        else if( Info === "Pricing"){
            _record = zohoCrm.mspPricing(Info,str,allowedDomains);
        }
        else if( Info === "RecurringHistory"){
            _record = zohoCrm.RecurringHistory(Info,_amtPaid,_paidDate,str,allowedDomains);
        }
        else if( Info === "logout"){
            _record = zohoCrm.logout(Info,str,allowedDomains);
        }
        else if( Info === "navClick"){
            _record = zohoCrm.navClick(Info,str,allowedDomains);
        }
        else if( Info === "MSP"){
            _record = zohoCrm.mspClicked(Info,str,allowedDomains);
        }
		else if( Info === "phoneNumber"){
            _record = zohoCrm.phoneNumber(Info,zohoData1,str,allowedDomains);
        }
        else if( Info === "Failed"){
            _record = zohoCrm.Failed(Info);
        }
        else if( Info === "cancle"){
            _record = zohoCrm.cancleSubscription(Info);
        }
        else if( Info === "loggedIn"){
            _record = zohoCrm.loggedIn(Info,JSON.parse(_loggedInVal),str,allowedDomains);
        }
        else if( Info === "teamMigrationOpted"){
            _record = zohoCrm.teamMigrationOpted(Info,str,allowedDomains);
        }
        else if( Info === "CloudsPage"){
            _record = zohoCrm.totalbizUsers(zohoData1,str,allowedDomains);
        }
        else if( Info === "OneDrive For Business Admin"){
            _record = zohoCrm.addCloud(Info,str,allowedDomains);
        }
        else if( Info === "Google SUITE"){
            _record = zohoCrm.addCloud(Info,str,allowedDomains);
        }
        else if( Info === "G_DRIVE"){
            _record = zohoCrm.addCloud(Info,str,allowedDomains);
        }
        else if( Info === "Box_Business"){
            _record = zohoCrm.addCloud(Info,str,allowedDomains);
        }
        else if( Info === "Drop Box Business"){
            _record = zohoCrm.addCloud(Info,str,allowedDomains);
        }
        else if( Info === "login"){
            _record = zohoCrm.loginTime(Info,str,allowedDomains);
        }
        else if( Info === "ACTIVE"){
            _record = zohoCrm.paymentStatus();
        }
        else if(Info === "INACTIVE"){
            _record = zohoCrm.paymentNotDone();
        }
        else if(Info === "contact"){
            _record = zohoCrm.contact();
        }
        else{
            _record = zohoCrm.subscribtion(Info);
        }
        if(_record == undefined){
            return false;
        }
        else {
            $.ajax({
                type: 'PUT',
                async: false,
                data: JSON.stringify(_record),
                headers: {"Content-Type": "application/json"},
                url: apicallurl + "/zoho/update/user?record_id=" + _id,
                success: function (response) {

            },
        error:function(xhr){
 if(xhr.status == 401){
localStorage.setItem('zohoError','401');
}
}
        });
}
    },
    subscribtion : function(Info){
        var paymentInformation;
        paymentInformation = {
            "amount_Paid":Info.amountPaid,
            "discount":Info.discount,
            "price":Info.totAmount,
            "paid_Date":Info.subscriptionStartDate
        };
        return paymentInformation;
    },
    RecurringHistory : function(Info,_amtPaid,_paidDate,str,allowedDomains){
        var RecurringHistory;
      //  if ($.inArray(str[0], allowedDomains) === -1) {
            if (_amtPaid === undefined || _amtPaid === null) {
                RecurringHistory = {
                    "recurring_Payment_History": "",
                };
            } else {
                RecurringHistory = {
                    "recurring_Payment_History": 'amount=' + _amtPaid + ', Paid Date : ' + _paidDate
                };
            }
            return RecurringHistory;
       // }
    },
    contact : function(){
        var contact;
        contact = {
            "lead_Source":"Webapp_Pricing"
        };
        return contact;
    },
    Failed : function(Info){
        var FailedUsers;
        FailedUsers = {
            "failed_Payments":Info
        };
        return FailedUsers;
    },
	 phoneNumber : function(Info,phone,str,allowedDomains){
        var phoneNumber;
        phoneNumber = {
            "phone_Number":phone
        };
        return phoneNumber;
    },
    logout : function(Info,str,allowedDomains){
        var userBounced;
      //  if ($.inArray(str[0], allowedDomains) === -1) {
            userBounced= {
                "user_Bounced":"Yes"
            };
            return userBounced;
     //   }
    },
    navClick : function(Info,str,allowedDomains){
        var userBounced;
      //  if ($.inArray(str[0], allowedDomains) === -1) {
            userBounced= {
                "user_Bounced":"Yes"
            };
            return userBounced;
      //  }
    },
    mspPricing : function(Info,str,allowedDomains){
        var leadTypeEnt;
     //   if ($.inArray(str[0], allowedDomains) === -1) {
            leadTypeEnt = {
                "lead_Type":"Enterprise"
            };
            return leadTypeEnt;
   //     }
    },
    mspClicked : function(Info,str,allowedDomains){
        var leadTypeMsp;
     //   if ($.inArray(str[0], allowedDomains) === -1) {
            leadTypeMsp = {
                "lead_Type":"MSP"
            };
            return leadTypeMsp;
     //   }
    },

    trialUser : function () {
        var test_migration;
        test_migration = {
            "test_Migration_Completed":"Yes"
        };
        return test_migration;
    },
    migrtnSrcDst : function (Info,src,dstn,str,allowedDomains) {
        var srcDest;
     //   if ($.inArray(str[0], allowedDomains) === -1) {
            srcDest = {
                "source_Cloud": src,
                "destination_Cloud": dstn
            };
            return srcDest;
    //    }

    },
    teamMigrationOpted : function (Info,str,allowedDomains) {
        var teamMigOpt;
     //   if ($.inArray(str[0], allowedDomains) === -1) {
            teamMigOpt = {
                "team_Migration_Opted": "Yes"
            };
            return teamMigOpt;
     //   }

    },

    totalbizUsers : function (userdata,str,allowedDomains) {
        var totalUsers={};
      //  if ($.inArray(str[0], allowedDomains) === -1) {
            if(userdata.srcDest !== undefined){
                if (userdata.srcDest === 'dToO') {
                    totalUsers.total_Users = 'D - ODFB - ' + totalodfbUsers.toString() + ', S - DBFB - ' + totaldbfbUsers.toString();
                } else if (userdata.srcDest === 'oToD') {
                    totalUsers.total_Users = 'S - ODFB - ' + totalodfbUsers.toString() + ', D - DBFB - ' + totaldbfbUsers.toString();
                }
            }
            if( userdata.totalOdfbUsers !== undefined) {
                totalUsers.total_Users = 'ODFB - ' + totalodfbUsers.toString() + ', DBFB - ' + totaldbfbUsers.toString();
            }
            var _s = userdata.addedCldsList;
            var _t = userdata.totalNumOfClouds;
            totalUsers.added_Clouds_List = _s.toLocaleString();
            totalUsers.total_Clouds_Added = _t.toString();
            return totalUsers;

     //   }
    },
    cancleSubscription : function () {
        var addCldsList;
        addCldsList = {
            "recurring_Status":"Cancelled"
        };
        return addCldsList;
    },
    loggedIn : function (Info,loggedInVal,str,allowedDomains) {
        var logValues;
        var Log = loggedInVal+1;

        logValues = {
            "user_Logged_In":Log.toString()
        };
        return logValues;

    },
    paymentStatus : function () {
        var paymentSuccess;
        paymentSuccess = {
            "recurring_Status":"Active"
        };
        return paymentSuccess;
    },
    paymentNotDone : function () {
        var paymentFail;
        paymentFail = {
            "recurring_Status":"cancelled"
        };
        return paymentFail;
    }
};
*/
var activecampaign ={
	eventTrack : function (eventData,email,event) {
	if(email==undefined){
	email = JSON.parse(localStorage.getItem('CFUser')).primaryEmail;
	}
	var _data ='actid=649987855&key=a98a0183859e149210ea558cb47828206b3094a8&event='+event+'&eventdata='+eventData+'&visit={"email":"'+email+'"}';
           
        $.ajax({
            method: "POST",
            async: true,
			data: _data,
			 headers: { 
			 "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/x-www-form-urlencoded"
            },
			
            url: defaultDomain+'/proxy/trackevent/',//https://trackcmp.net/event
            success: function (data) {
              console.log(data);
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
      //  return data;
    },
		createContact : function (obj,string) {
					var _chkNonPubEmail = obj.email;
                    var str = _chkNonPubEmail.split('@').slice(1);
					str = str = str[0].toLowerCase();
                    var allowedDomains = ['gmail.com', 'yahoo.com', 'inbox.com',
                        'icloud.com', 'mail.com', 'aol.com', 'msn.com', 'hotmail.com', 'outlook.com', 'live.com', 'yopmail.com','rediff.com', 'gmx.com', 'yandex.com', 'protonmail.com'];
	
	if ($.inArray(str, allowedDomains) === -1) {
				var busEmail = 'Yes';
				}
				else{
				var busEmail = 'No';
				}
				
	var _Obj = {
              
		"contact": {
		"email": obj.email,
		"lastName": obj.name,
		"phone": obj.phone,
		"fieldValues":[
      {
        "field":"9",
        "value":"1"
      },
      {
        "field":"10",
        "value": busEmail
      }
		]
	}
            };
        $.ajax({
            method: "POST", 
			data: JSON.stringify(_Obj),
			 headers: {
               "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/json"
            },
            url: defaultDomain+'/proxy/camping/contact/sync',
            success: function (data) {
			 
				if ($.inArray(str, allowedDomains) === -1) {
			/*var s = data.contact.cdate.split('T')[1].split('-')[0]; 
			if(s > "11:30:00"&& s < "19:29:59"){
			  activecampaign.updateCustomFields(obj.email,string,data.contact.id,"Sujit");
			} 
			else{
			  
			}*/
				activecampaign.updateCustomFields(obj.email,'leadAssignee',data.contact.id,"Rajesh, Roopal");
				}
				else{
			 activecampaign.updateCustomFields(obj.email,'leadAssignee',data.contact.id,"Deepika");
				}
			
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
    },
	contactList : function (id) {
	var _Obj = {
              
		"contactList": {
		"list": 1,
		"contact": id,
		"status": 1
}
            };
        $.ajax({
            method: "POST",
		data: JSON.stringify(_Obj),
			 headers: {
               "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/json"
            },
            url: defaultDomain+'proxy/camping/contactLists',
            success: function (data) {
              console.log(data);
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
    },
	getContact : function (email,string,info) {
	if(email == undefined){
	email = JSON.parse(localStorage.getItem("CFUser")).primaryEmail;
	}
        $.ajax({
            method: "GET",
			 headers: {
               "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/json"
            },
            url: defaultDomain+'/proxy/camping/contacts?email='+email,
            success: function (data) {
			if(data.contacts.length ==0){
			var userObject = JSON.parse(localStorage.getItem('CFUser'));
			var data ={
                    "name" : userObject.lastName,
                    "email" : userObject.primaryEmail,
					"phone" : userObject.mobileNumber
            };
			activecampaign.createContact(data);
                      //  activecampaign.getContact(userDetails.primaryEmail, 'leadAssignee');
			localStorage.setItem('oldUser','Yes');
			activecampaign.eventTrack('SignUp',email,'clicked');
			//activecampaign.getContact(email,'loggedIn',1);
			}
			var _chkNonPubEmail = email;
                    var str = _chkNonPubEmail.split('@').slice(1);
			str = str = str[0].toLowerCase();
                    var allowedDomains = ['gmail.com', 'yahoo.com', 'inbox.com',
                        'icloud.com', 'mail.com', 'aol.com', 'msn.com', 'hotmail.com', 'outlook.com', 'live.com', 'yopmail.com',
			'rediff.com', 'gmx.com', 'yandex.com', 'protonmail.com'];
			
			if(string == "loggedIn"){
			activecampaign.getFieldValues(email,string,data.contacts[0].id,info);
			}
			else if(string == "recurringPaymentHistory"){
			activecampaign.getFieldValues(email,string,data.contacts[0].id,info);
			}
			else if(string == "contactList"){
			activecampaign.contactList(data.contacts[0].id);
			}
			else if(string == "leadAssignee"){
				if(data.contacts.length != 0){
				if ($.inArray(str, allowedDomains) === -1) { 
			/*var s = data.contacts[0].created_timestamp.split(' ')[1];
			if(s > "11:30:00"&& s < "19:29:59"){
			  activecampaign.updateCustomFields(email,string,data.contacts[0].id,"Sujit");
			}
			else{
			  activecampaign.updateCustomFields(email,string,data.contacts[0].id,"Sujit");
			}*/
			activecampaign.updateCustomFields(email,string,data.contacts[0].id,"Rajesh, Roopal");
				}
				else{
			 activecampaign.updateCustomFields(email,string,data.contacts[0].id,"Deepika");
				}
				}
			}
			else
			  activecampaign.updateCustomFields(email,string,data.contacts[0].id,info);
			
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
      //  return data.contacts[0].id;
    },
	getContactDtls : function (email) {
	if(email == undefined){
	email = JSON.parse(localStorage.getItem("CFUser")).primaryEmail;
	}
	var _dtls;
        $.ajax({
            method: "GET",
			 headers: {
               "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/json"
            },
            url: defaultDomain+'/proxy/camping/contacts?email='+email,
            success: function (data) {
			if(data.contacts.length ==0){
			var userObject = JSON.parse(localStorage.getItem('CFUser'));
			var data ={
                    "name" : userObject.lastName,
                    "email" : userObject.primaryEmail,
					"phone" : userObject.mobileNumber
            };
			activecampaign.createContact(data);
			activecampaign.eventTrack('SignUp',email,'clicked'); 
			}
			else{
				activecampaign.updateCustomFields(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'totalDataSize',data.contacts[0].id,totalDataSize);
				activecampaign.updateCustomFields(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'totalCloudsAdded',data.contacts[0].id,totalNumOfClouds);
				activecampaign.updateCustomFields(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'addedCloudsList',data.contacts[0].id,addedCldsList);    
				if (addedCldsList.includes("ONEDRIVE_BUSINESS_ADMIN") || addedCldsList.includes("DROPBOX_BUSINESS")) {
                        if(localStorage.getItem('CFUser') != undefined){
				   activecampaign.updateCustomFields(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'totalUsers',data.contacts[0].id,totalodfbUsers+totaldbfbUsers);   
						}
                  } 
				    if(UserType.includes('ADMIN')){
			   activecampaign.updateCustomFields(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,'addedDomainsList',data.contacts[0].id,totalDomains.toString());   
			if(totalDomains.length>0){
					activecampaign.updateCustomFields(JSON.parse(localStorage.getItem('CFUser')).primaryEmail,"leadAssignee",data.contacts[0].id,"Rajesh, Roopal");	
					}		
			}
			}
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
    },
	
	getFieldValues : function (email,string,contactww,info) {
        $.ajax({
            method: "GET",
            async: false,
		//data: JSON.stringify(_Obj),
			 headers: {
               "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/json"
            },
            url: defaultDomain+"/proxy/camping/contacts/"+contactww+"/fieldValues",
            success: function (data) {
              console.log(data);
			  var fiedIdexist = [];
			  for(i=0;i<data.fieldValues.length;i++){
				  fiedIdexist.push(data.fieldValues[i].field);
			  }
			  if((string == "loggedIn")&&(fiedIdexist.includes("9"))){
				   for(i=0;i<fiedIdexist.length;i++){
					   var p = 9;
					  if(p == data.fieldValues[i].field ){
						   var fieldval = data.fieldValues[i].value;
						   fieldval++;
					  }
					 
				   }
				 
				  var info  = fieldval;
				  activecampaign.updateCustomFields(email,string,contactww,info);
			  }
			  else if((string == "recurringPaymentHistory")&&(fiedIdexist.includes("15"))){
			  for(i=0;i<fiedIdexist.length;i++){
					   var q = 11,r=14;
					  if(q == data.fieldValues[i].field ){
						   var fieldvalue1 = data.fieldValues[i].value.toString();
					  }
					  if(r == data.fieldValues[i].field ){
						   var fieldvalue2 = data.fieldValues[i].value.toString();
					  }
					 
				   }
				 
				  var info  = 'Amount Paid : '+fieldvalue1+', Paid Date : '+fieldvalue2;
				  activecampaign.updateCustomFields(email,string,contactww,info);
			  }
			  else{
				  
				  activecampaign.updateCustomFields(email,string,contactww,1);

			  }
	            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
        //return data;
    },
			
	updateCustomFields : function (email,string,id,info) {
		var _obj = {},fieldId; 
		if(string == "loggedIn"){
			fieldId = 9;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "totalCloudsAdded"){
			fieldId = 1;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "addedCloudsList"){
			fieldId = 2;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info.toString()
			};
		}
		else if(string == "teamMigrationOpted"){
			fieldId = 7;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "userBounced"){
			fieldId = 8;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}else if(string == "totalUsers"){
			fieldId = 5;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "businessEmail"){
			fieldId = 10;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "addedDomainsList"){
			fieldId = 16;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		
		else if(string == "sourceCloud"){
			fieldId = 17;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "destinationCloud"){
			fieldId = 18;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "testMigrationCompleted"){
			fieldId = 6;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "amountPaid"){
			fieldId = 11;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "price"){
			fieldId = 12;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "discount"){
			fieldId = 13;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "paidDate"){
			fieldId = 14;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		
		else if(string == "recurringPaymentHistory"){
			fieldId = 15;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "failedPayments"){
			fieldId = 19;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "leadSource"){
			fieldId = 22;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "leadAssignee"){
			fieldId = 23;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "pricingPageVisited"){
			fieldId = 27;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
			else if(string == "paymentToggle"){
			fieldId = 28;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
			else if(string == "accountDeleted"){
			fieldId = 29;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
			else if(string == "totalDataSize"){
			fieldId = 30;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "busCldReqSpt"){
			fieldId = 31;
		_obj.fieldValue = {  
        "contact": id,
        "field": fieldId, 
        "value": info
			};
		}
		else if(string == "clickedOnSubscribe"){
			fieldId = 32;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "clickedOnSubscribeFrom"){
			fieldId = 33;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "device"){
			fieldId = 34;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
		else if(string == "reasonForLeaving"){
			fieldId = 35;
		_obj.fieldValue = {
        "contact": id,
        "field": fieldId,
        "value": info
			};
		}
        $.ajax({
            method: "POST",
		data: JSON.stringify(_obj),
			 headers: {
               "Api-Token":"3e4d0adb31ed4fad5c44d98b8d263156140e1a7a6e6e233c841f483a01d83375635d29d4",
			   "Content-Type":"application/json"
            },
            url: defaultDomain+'/proxy/camping/fieldValues',
            success: function (data) {
              console.log(data);
            },
            error: function (data) {
                console.log(data);
            },
            complete:function(xhr){
                if(xhr.status >300)
                    return false;
            }
        });
    }

}
