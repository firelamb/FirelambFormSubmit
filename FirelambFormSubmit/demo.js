$(document).ready(function () {
    $("#btnajaxpost").FirelambFormSubmit({
        formId: "#frmAjax"
        , submitType: "ajaxPost"
        ,ajaxTips:"正在处理数据，请稍后..."
        , postUrl: "demo/ajax/a.ashx"
        , isEncrypt: true
        , encryptObjs: ["#ajaxpwd2"]
        , encryptType: "RC4"
        , callEvent: function () {
            $("#ajaxpwd2show").html("I am the text from server side post back: "+$("#ajaxpwd2").val());
            $("#ajaxpwd2show").show();
        }
    });

    $("#btndirpost").FirelambFormSubmit({
        formId: "#frmdir"
       , submitType: "dirPost"   
        , isEncrypt: true
        , encryptObjs: ["#ajaxpwd4"]
        , encryptType: "SHA1"
        , callEvent: function () {
            $("#ajaxpwd4show").html("I am the text from server side post back: " + $("#ajaxpwd4").val());
            $("#ajaxpwd4show").show();
        }
    });
    $("#btncallpost").FirelambFormSubmit({
        formId: "#frmcall"
      , submitType: "ajaxPost"
       , postUrl: "demo/ajax/a.ashx"
       , isEncrypt: true
       , encryptObjs: ["#ajaxpwd5"]
       , encryptType: "SHA1"
       , callEvent: function () {
           $("#ajaxpwd5show").html("CallEvent:I am the text from server side post back: " + $("#ajaxpwd5").val());
           $("#ajaxpwd5show").show();
       }
    });
    
});