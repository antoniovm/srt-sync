(function(window, document, SRTParser){

  // Component
  var fInput = document.getElementById('file');
  var tfTime = document.getElementById('time');
  var bSync = document.getElementById('sync');
  var bDownload = document.getElementById('download');
  var dOutput = document.getElementById('output');
  
  var downloadURI = null;
  
  var saveData = (function () {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    
    return function (data, fileName) {
        var blob = new Blob([data], {type: 'text/plain'});
        var url = window.URL.createObjectURL(blob);
        
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
  }());
  
  bDownload.addEventListener('click',function(){
    
    saveData(dOutput.innerText, 'synced.srt');
    
  });

  /**
   * Sync button
   */
  bSync.addEventListener('click',function(){
    
    var timeOffset = tfTime.value;
    
    SRTParser.setTimeOffset(timeOffset);
    
    var outputSRT = SRTParser.toSRTString();
    
    dOutput.innerText = outputSRT;
    
  });

  /**
   * Load and parse SRT input file
   */
  fInput.addEventListener('change',function(){

    var file = this.files[0];

    var reader = new FileReader();
    
    reader.onload = function(progressEvent){
      SRTParser.parseSRT(this.result);
    };
    
    reader.readAsText(file, 'ISO-8859-1');
  });

	
})(window, document, SRTParser);