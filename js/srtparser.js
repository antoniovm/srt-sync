var SRTParser = (function(document){
  
  // Model
  var subtitlesModel = [];
  var initialTimeOffset = 0;
  var lineFeed = '\n';
  var timeDelimiter = ' --> ';
  
  var isValidTime = function(time){
    return /^-?(\d{2}):([0-5]\d):([0-5]\d)\,(\d{3})$/.test(time);
  };
  
  var padZeroLeft = function(s, maxLength){
      var pad = Array(maxLength + 1).join('0');
      return pad.substring(0, maxLength - s.length) + s;
  };
  
  var parseTime = function(stringTime){
    // TODO: Validate input data
    var values = stringTime.split(/[\,,\:]/);
    
    var h = parseInt(values[0]);
    var m = parseInt(values[1]);
    var s = parseInt(values[2]);
    var ms = parseInt(values[3]);
    
    return ms + (s + (m + h * 60) * 60) * 1000;
  };
  
  var toTimeString = function(miliTime){
    var pad = '000';
    
    var ms = (miliTime % 1000) + '';
    miliTime = Math.floor(miliTime / 1000);
    var s = (miliTime % 60) + '';
    miliTime = Math.floor(miliTime / 60);
    var m = (miliTime % 60) + '';
    miliTime = Math.floor(miliTime / 60);
    var h = (miliTime) + '';
    
    return padZeroLeft(h, 2) + ':' + padZeroLeft(m, 2) + ':' + padZeroLeft(s, 2) + ',' + padZeroLeft(ms, 3);
  };
  
  var toSRTStringBlock = function(block, index){
    var startTime = block.startTime + initialTimeOffset;
    var endTime = block.endTime + initialTimeOffset;
    
    if(startTime < 0){
      return '';
    }
    
    var output = 
    // N\r\n 
    (index + 1) + lineFeed +
    
    // HH::MM::MM::mmm --> HH::MM::MM::mmm\r\n 
    toTimeString(startTime) + timeDelimiter + toTimeString(endTime) + lineFeed +
    
    // Text\n\n
    block.text.join(lineFeed) + lineFeed;
     
    return output + lineFeed;
  };
  
  return {
    /**
     * Parse SRT format input string
     */
    parseSRT: function(rawData){
      subtitlesModel = [];
      
      if(rawData.indexOf('\r\n')){
        lineFeed = '\r\n';
      }
      
      // Split into subtitle block
      var lines = rawData.split(lineFeed + lineFeed).filter(function(e){
        return e != '';
      });
      
      // Iterate over blocks
      lines.forEach(function(e, i){
        var blockLines = e.trim().split(lineFeed);
        
        // Index
        blockLines.shift();
        
        // Time marks
        var timeMarks = blockLines.shift().split(timeDelimiter);
        
        subtitlesModel.push({
          startTime: parseTime(timeMarks[0]),
          endTime: parseTime(timeMarks[1]),
          text: blockLines
        });
        
      });
      
    },
    
    /**
     * Returns the subtitle in SRT format
     */
    toSRTString: function(){
      // The final string output
      var output = '';
      
      // The subtitle index
      var i = 0;
      
      subtitlesModel.forEach(function(e){
        var block = toSRTStringBlock(e,i)
        
        if (block != '') {
          i++;
          output += block;
        } 
        
      });
      
      return output;
    },
    
    setTimeOffset: function(offset){
      if (!isValidTime(offset)) {
        return;
      }
      
      // Positive
      var sign = 1;
      
      // Check time sign
      if (offset[0] == '-') {
        // Remove minus sign
        offset = offset.substring(1,offset.length);
        sign = -1;
      }
      
      // Parsed time
      initialTimeOffset = parseTime(offset) * sign;
    }
    
  };
  
})(document);