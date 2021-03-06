﻿/**
FirelambFormSubmit
@Verson 1.0.3
@UpdateDate 2014-08-01
@Url 
@Author Firelamb
@Email firelamb@qq.com
**/
(function ($) {
    var defaults = {
        formId: "",//form id
        isEncrypt: false,//是否加密form表单的数据
        encryptObjs: [],//需要加密的form的控件，如#input1,#input2 格式是数组格式,isEncrypt为true时，请记得设置此属性
        encryptType: "MD5",//加密类型 isEncrypt为true时，请记得设置此属性.可设置的属性：MD5，SHA1，SHA256，SHA3，
        //AES,DES,Rabbit,RC4.当加密类型为BASE64时，可在后台如.NET相应的解密

        submitType: "dirPost",//事件类型 dirPost,ajaxPost
        postUrl: "",//ajax提交的目的地址 submitType="ajaxPost"时需要设置此属性
        ajaxTips: "Please Waiting...",// 当提交表单时 页面出现的提示
        // processType: "popup",//当提交的时候页面提示类型popup，tips两个类型可选
        //beforePost: function() {
        //  return true;
        //},//表单提交前执行的函数，例如可以进行格式验证等 记得返回true或者false 以便插件判断是否提交表单
        beforePost: $.noop,
        callEvent: function (json) { }//当submitType='ajaxPost' 时，success调用的回调函数

    };

    $.fn.FirelambFormSubmit = function (options) {

        var opts = $.extend({}, defaults, options || {});

        $(this).on("click", function () {

            // event.preventDefault();

            var r = opts.beforePost();

            if (r != undefined && r != null && r.toString() != "undefined" && r != "" && r) {

                if (opts.isEncrypt) {

                    Encrypt(opts.formId, opts.encryptType, opts.encryptObjs);

                    FirelambSubmit(opts.submitType, opts.formId, opts.postUrl, opts.ajaxTips, opts.callEvent);

                }
                else {
                    FirelambSubmit(opts.submitType, opts.formId, opts.postUrl, opts.ajaxTips, opts.callEvent);
                }
            }

        });


        //预先加载加密插件
        if ((typeof (CryptoJS)).toString() == "undefined") {
            var pluginPaths = $("script[src*='FirelambFormSubmit']").prop("src").split("FirelambFormSubmit/");

            //the lib folder must in the FirelambFormSubmit folder
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/components/core-min.js",
	            function () {
	                loadEncrypt(pluginPaths, opts.encryptType);
	                $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/yepnope/yepnope.js", function () {
	                    yepnope({
	                        load: [pluginPaths[0] + "FirelambFormSubmit/" + "lib/jquery-loadmask-0.4/jquery.loadmask.css",
	                        pluginPaths[0] + "FirelambFormSubmit/" + "lib/jquery-loadmask-0.4/jquery.loadmask.min.js"]
	                    });
	                });

	            });
        }

        return this;
    };

})(jQuery);

//#region 加载对应的加密类型js函数
function loadEncrypt(pluginPaths, encryptpe) {
    switch (encryptpe) {
        case "BASE64":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/EnDecrypt/EnDeCrypt.min.js");
            break;
        case "MD5":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/components/md5.js");
            break;
        case "SHA1":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/components/sha1.js");
            break;
        case "SHA256":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/rollups/SHA256.js");
            break;
        case "SHA3":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/rollups/SHA3.js");
            break;
        case "AES":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/rollups/AES.js");
            break;
        case "DES":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/rollups/tripledes.js");
            break;
        case "Rabbit":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/rollups/Rabbit.js");
            break;
        case "RC4":
            $.getScript(pluginPaths[0] + "FirelambFormSubmit/" + "lib/CryptoJS/rollups/RC4.js");
            break;
    }
}

//#endregion

//#region 提交表单
function FirelambSubmit(submitType, formid, posturl, ajaxTips, callEvent) {
    if (submitType == "dirPost") {
        $(formid).mask(ajaxTips);
        //event.preventDefault();

        if (posturl != undefined && posturl != null) {
            $(formid).attr("action", posturl);
        }
        $(formid).submit();
        return;
    }
    else if (submitType == "ajaxPost") {
        //$(opts.formId).submit(function (e) {
        //    e.preventDefault();
        //    return false;
        //});
        // event.preventDefault();

        $(formid).mask(ajaxTips);

        $.ajax({
            type: "POST",
            data: $(formid).serialize(),
            // contentType:"application/json",
            //dataType: "text",
            //data: $(opts.formId).serializeArray(),
            url: posturl,
            success: function (msg) {
                callEvent(msg);
                $(formid).unmask();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("ajax post error:" + XMLHttpRequest.responseText);
                $(formid).unmask();
            }
        });

        //#region 清空表单
        $(formid).find("input[type='text']").val("");
        $(formid).find("input[type='textarea']").val("");
        $(formid).find("input[type='password']").val("");
        $(formid).find("textarea").val("");
        $(formid).find("input[type='checkbox']").removeAttr("checked");
        $(formid).find("input[type='radio']").removeAttr("selected");
        //#endregion

        //$.post(opts.postUrl, $(opts.formId).serialize(), function (msg) {
        //    alert("成功：" + msg); opts.callEvent();
        //}, "text");
        // return false;
        return;
    }

}
//#endregion

//#region 加密
function Encrypt(formid, encryptType, encryptObjs) {

    switch (encryptType) {
        case "BASE64":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                var s = Base64.encode64(v);
                $(encryptObjs[i]).val(s);

            }
            break;
        case "MD5":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.MD5(v));

            }
            break;
        case "SHA1":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.SHA1("" + v + "").toString());
            }
            break;
        case "SHA256":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.SHA256(v));
            }
            break;
        case "SHA3":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.SHA3(v));
            }
            break;
        case "AES":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                var key = CryptoJS.enc.Hex.parse('FirelambCMSKeyssFirelambCMSKeyss');
                var iv = CryptoJS.enc.Hex.parse('FirelambCMSKeyssFirelambCMSKeyss');
                var encrypted = CryptoJS.AES.encrypt(v, key, { iv: iv });

                $(encryptObjs[i]).val(encrypted);
            }
            break;
        case "DES":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.DES.encrypt(v, "FirelambFormSubmit"));
            }
            break;
        case "Rabbit":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.Rabbit.encrypt(v, "FirelambFormSubmit"));
            }
            break;
        case "RC4":
            for (var i = 0; i < encryptObjs.length; i++) {
                var v = $(encryptObjs[i]).val();
                $(encryptObjs[i]).val(CryptoJS.RC4.encrypt(v, "FirelambFormSubmit"));
            }
            break;
    }


}
//#endregion