//TODO make us of this class for Util functions - Mike , Rat
var opts = {
    lines: 10, // The number of lines to draw
    length: 5, // The length of each line
    width: 2, // The line thickness
    radius: 4, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#3333FF', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

function bindOsList() {
    var jsonString = '[{"JD_No":1,"JD_Name":"UNIX"}, {"JD_No":2,"JD_Name":"VMS"}, {"JD_No": 3, "JD_Name": "WINDOWS"},{"JD_No":4,"JD_Name":"OS/2"}, {"JD_No":5,"JD_Name":"OS/400"}, {"JD_No": 6, "JD_Name": "AS/400"},{"JD_No": 7, "JD_Name": "MVS"},{"JD_No": 8, "JD_Name": "TYPE: L8"},{"JD_No": 9, "JD_Name": "NETWARE"},{"JD_No": 10, "JD_Name": "MACOS PETER"}]';
    var json_data = JSON.parse(jsonString);
    for (var i = 0; i < json_data.length; i++) {
        var option = $("<option>");
        for (var key in json_data[i]) {
            // There should only be two keys, if its a number its ID, else option name
            if (typeof json_data[i][key] === "number") {
                //            option.attr("value", json_data[i][key]);
            } else {
                option.html(json_data[i][key]);
            }
        }
        $("#osList").append(option);
    }
}
var validations = {
    cleandata: function () {
        $("#IpAddress").val("");
        $("#ftpPassword").val("");
        $('#oAuthDisplayName').val("");
        $('#webDavURL').val("");
        $('#displayEmail').css('visibility', 'hidden');
    },
    parseUrl:function(a){
        var params = [];
        if(a == undefined || a == null || a == ''){
            return null;
        }
        a = a.split("?")[1];
        if(a == undefined || a == null || a == ''){
            return null;
        }
        a = a.split('&');
        $.each(a,function(i,b){
            var c = b.split('=');
            var d = {};
            d.key = c[0];
            d.value = c[1];
            params.push(d);
        });
        return params;
    },
    getUrlParam : function (a,x) {
        var c;
        $.each(a, function (i,b) {
            if(b.key == x){
                return c = b.value;
            }
        })
        return c;
    },
    basicAuth : function (a,b) {
        var tok = a + ':' + b;
        var hash = Base64.encode(tok);
        return "Basic " + hash;
    }
}