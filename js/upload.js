var objUpload;

var Upload = function(){ 
  var o = this;
  this.script = '_ctrl/upload.php';
  
  this.onLoad = function(){ o.addEventListeners(); };
  
  this.addEventListeners = function(){ 
	$(document).on("change","#fileToUpload",function(){ o.fileSelected(); })
	$(document).on("click","div.onClickUpload",function(e){ e.stopImmediatePropagation(); $("#fileToUpload").click(); });
  }
  
  this.fileSelected = function(){ 
    $("#loader").fadeIn();
    var count = document.getElementById('fileToUpload').files.length;
   // document.getElementById('details').innerHTML = "";
    for(var index = 0; index < count; index ++){
      var file = document.getElementById('fileToUpload').files[index]; 
      var fileSize = 0;
      if(file.size > 1024 * 1024) fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB'; else fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
      //document.getElementById('details').innerHTML += 'Name: ' + file.name + '<br>Size: ' + fileSize + '<br>Type: ' + file.type;
      //document.getElementById('details').innerHTML += '<p>';
    }
	o.uploadFile();
  }
  
  this.uploadProgress = function(evt){
    if(evt.lengthComputable){
      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
       //document.getElementById('progress').innerHTML = percentComplete.toString() + '%';
    }else{
      //document.getElementById('progress').innerHTML = 'unable to compute';
    }
  }    
  
  this.uploadFile = function(){ 
    var fd = new FormData();
    var count = document.getElementById('fileToUpload').files.length;
    for (var index = 0; index < count; index ++){
      var file = document.getElementById('fileToUpload').files[index];
      fd.append("myFile", file);
    }
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", o.uploadProgress, false);
      xhr.addEventListener("load", o.uploadComplete, false);
      xhr.addEventListener("error", o.uploadFailed, false);
      xhr.addEventListener("abort", o.uploadCanceled, false);
      xhr.open("POST", o.script);
      xhr.send(fd);
  }
  
  this.uploadFailed = function(evt){ console.log('there was an error attempting to upload the file.'); }
  this.uploadCanceled = function(evt){ console.log('the upload has been canceled by the user or the browser dropped the connection.'); }
  this.uploadComplete = function(evt){ 
    
	$("#imagen").val(evt.target.response.trim());
	$("#message").val('<img  class="materialboxed" src="tmp/'+evt.target.response+'" width="50%" height="50%">');
	$("a.onClickEnviar").click();
	$("#loader").fadeOut();
  }
  
  
  o.onLoad();
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}