<%@ WebHandler Language="C#" Class="a" %>

using System;
using System.Web;

public class a : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
      // context.Response.ContentType = "application/json";
      context.Response.ContentType = "text/plain";
        var s = context.Request.Form["ajaxpwd2"];
        //s = context.Request.QueryString["ajaxpwd2"];
      //  s = context.Request.Params["ajaxpwd2"];
        var ss = context.Request.Form["ajaxpwd1"];
      //  ss = context.Request.Params["ajaxpwd1"].ToString();
        context.Response.Write(s);
        
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}