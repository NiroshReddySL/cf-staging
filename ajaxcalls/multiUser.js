/**
 * Created by Vinay on 8/7/2017.
 */
function showProgressModal(){
    $("#progressbar").css("display","block");
    $("#mapClouds").addClass("disabled");
    $("input:radio").attr('disabled',true);
    var current_progress = 0;
    var interval = setInterval(function() {
        current_progress += 10;
        $("#dynamic").css("width", current_progress + "%").attr("aria-valuenow", current_progress).text(current_progress + "% Complete");
        if (current_progress >= 100)
            clearInterval(interval);
    }, 300);
}
$("#move_main").on("change","input[type=radio]",function () {
    if($("#moveSource input:checked").length && $("#moveDestination input:checked").length)
       $("#mapClouds").removeClass("disabled");
});

$("#mapClouds").click(function () {
    showProgressModal();
    $("#teamMigrationWidget [data-target='#step1']").removeClass("active").addClass("completed");
    $("#teamMigrationWidget [data-target='#step1'] span").removeClass("badge-info");
    $("#teamMigrationWidget [data-target='#step2']").addClass("active");
    $("#teamMigrationWidget [data-target='#step2'] span").first().addClass("badge-info");
    var _slctdSrc = $("#moveSource").find("input:checked").siblings("span");
    var _slctdDst = $("#moveDestination").find("input:checked").siblings("span");


    setTimeout(function(){
        $("#mappingClouds").css("display","none");
        $("#mappingUsers").css("display","block");
        $("#progressbar").css("display","none");
        $("#mapClouds").removeClass("disabled");
        $("input:radio").attr('disabled',false);
    }, 4000);
});

$("#teamMigrationWidget li").click(function () {
    if($(this).hasClass("completed") && !$("#mapClouds").hasClass("disabled")){
        var _attr = $(this).attr("data-target");
        if(_attr == "#step1"){
            $("#teamMigrationWidget li").removeClass("active completed");
            $("#teamMigrationWidget li span").removeClass("badge-info");
            $("#teamMigrationWidget [data-target='#step1']").addClass("active");
            $("#teamMigrationWidget [data-target='#step1'] span").first().addClass("badge-info");
            $("#mappingClouds").css("display","block");
            $("#mappingUsers").css("display","none");
        }

    }
});

$("#mapUsers").click(function () {
    $("#mappingUsers").css("display","none");
    $("#mappingClouds").css("display","none");
    $("#manualMappingUsers").css("display","block");
});

$("#mpngPrcd").click(function () {
    $("#mappingUsers").css("display","block");
    $("#mappingClouds").css("display","none");
    $("#manualMappingUsers").css("display","none");
});



