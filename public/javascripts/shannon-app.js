    // <![CDATA[
      $(document).ready(function(){
        //first thing check platform and load some files if necessary
        if(navigator.platform == 'iPhone') {
            console.log('using iphone');
            $.get('stylesheets/iphone.css', function(data){ //getting us the iphone css
                if(status == "error") {
                    console.log('missed some file');
                }else {
                var style = '<style>' + data + '</style>';
                $('head').append(style); //add style to the head element
                }
            });
            doIphoneTouches();
        }
        //

        function doIphoneTouches(){
            //map all control clicks to touchend
            $('.cntrl').live('touchend', function(){
                var id = this.getAttribute('id');
                doCntrls(id);
            });
        }

        //

        // do some stuff on load, like add some controls, load the images etc
        var btn = $('#con_btn');
        var contact = $('#contact');
        contact.hide();
        btn.click(function(){
          contact.fadeIn();
          location.href = location.href + '#contact';
        });

        // create panel_content_ct and ajax call for images
          firstImage = 0;
          currImage = null;
          imgData = null;
          maxImages = 8;
          showCase = null;
          loadingMask = null;
          indicators = null;
          caption = null;

        //416-738-8464

          //get ajax call, load data - image name, id, caption, src
            function mapVars (d){
//            $.each(d, function(index, value){
//              console.log(value.src);
//            });
            imgData = d; //load d into imgData
            makeView('#panel_content_ct');
          }

          //do ajax load first thing
          function doAjax(){
            var dataVar = null;
            $.ajax({
              url: 'http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=843806734c834810456499372db41a32&user_id=49349226@N02&extras=description,url_m,url_o&per_page=10&page=1&format=json&jsoncallback=?',
              dataType: 'json',
              success: function(data){
                  //dataVar = data.data; old version
                  dataVar = data.photos.photo;
                  mapVars(dataVar);
                }
            });
          };


          //crseate dom elements to show images, caption and controls
          function makeView(container){
            var c = container;
            var template = '<div class="item">' +
                '<div id="prev_cntrl" class="cntrl">prev</div>' +
                '<div id="next_cntrl" class="cntrl right">next</div>' +
                '<div id="loading_mask">loading...</div>' +
                '<img id="showcase" class="img" src="" />' +
                '<span id="img_caption"></span><br />' +
            '</div>';
            var indicatorsTemplate = '<div class="indicator">&nbsp;</div>'; //an indicator box
            for(i=1; i < imgData.length; i++){
                indicatorsTemplate = indicatorsTemplate + '<div class="indicator">&nbsp;</div>';
            };
            indicatorsTemplate = '<div id="indicators">' + indicatorsTemplate + '</div>';
            template = template + indicatorsTemplate; //add indicators depending on amount of images
            $(template).prependTo(c);

            var inds = $('.indicator');
            $.each(inds, function(index){ //add data to each - allows us to not use ids or classes unncesarily
                $(inds[index]).data('bar', index);
            });
            //load first image, caption etc
            showCase = $('#showcase'); //establish values for showCase & caption
            caption = $('#img_caption');
            loadingMask = $('#loading_mask');
            indicators = inds;
            inds.bind('checkData', function(event, d){ //bind custom event so when data is loaded, we do something
                var t = $(this);
                if(d == t.data('bar')) {
                    t.addClass('sparkle');
                    //console.log('data matches' + d);
                }else{
                    t.removeClass('sparkle');
                }
            });
            loadImage(firstImage, showCase, caption); //load the first image right off the bat
            showCase.bind('load', function(){ //create fx for loading an image - ie some kinda wipe, in ext, this would be put in onrender
              //console.log('loaded an image:' + showCase.attr('src'));
              //loadingMask.fadeOut('fast');
            });
            makeCntrls();
          }

          //loadImage function handles image loading from controls and initialization
          function loadImage(img, showCase, caption){
            //loadingMask.fadeIn('fast'); //show the loading mask until the image is done loading
            currImage = img; //establish currImage as whatever is fed into loadImage
            //showCase.attr('src', imgData[img].src);//set the src for the showcase
            //caption.text(imgData[img].caption); //set the caption for the given img
            showCase.attr('src', imgData[img].url_m); //set the src for the showcase
            caption.html("<h3>" + imgData[img].title + "</h3>" + imgData[img].description._content); //set the caption for the given img
            indicators.trigger('checkData', [img]);//highlight the relevant div showing which img in the series is loaded, checks all indicators at once
          }

          //bind functions to some controls.using live method
          function makeCntrls(){
            $('.cntrl').live('click', function(){
              var id = this.getAttribute('id');
              doCntrls(id);
            });
            $('#prev_cntrl').fadeOut(); //initalize the previous to be disabled by default
          }


          //handle control clicks to go next, previous, etc
          function doCntrls(id){
            var whichCntrl = id;
            //console.log(currImage);
            if (whichCntrl == 'next_cntrl') {
              currImage = currImage + 1; //select the 'next' image to use in functions
              if(currImage >= 0 && currImage <= maxImages-1) {
                loadImage(currImage, showCase, caption);
                $('#prev_cntrl').fadeIn();
                if(maxImages-currImage == 1){
                    //console.log('lasty');
                    $('#' + whichCntrl).fadeOut();
                }
              } else {
                currImage = currImage - 1; //subtract 'nexted' image - ie staying the same
              }
            } else {
              currImage = currImage - 1;
              if(currImage >= 0 && currImage <= maxImages-1) {
                loadImage(currImage, showCase, caption);
                $('#next_cntrl').fadeIn();
                if(maxImages-currImage == maxImages){
                    //console.log('firsty');
                    $('#' + whichCntrl).fadeOut();
                }
              } else {
                currImage = currImage + 1;
              }
            }

          }

          //  514-731-0060 x 237 - 1800-206-7218

        //
        doAjax();
      });
    // ]]>

