    // <![CDATA[

//        var jQT = new $.jQTouch({
//          initializeTouch: 'body, div.touch, a ',
//          touchSelector: [ '#swipe_test' ]
//        });


      $(document).ready(function(){

        //first thing check platform and load some files if necessary

          // create panel_content_ct and ajax call for images
          firstImage = 0;
          currImage = null;
          imgData = null;
          maxImages = 20;
          showCase = null;
          loadingMask = null;
          indicators = null;
          caption = null;
          imgTitle = null;
          browserPlatform = 'desktop';


        if(navigator.platform == 'iPhone') {
            //console.log('using iphone');
            $.get('stylesheets/iphone.css', function(data){ //getting us the iphone css
                if(status == "error") {
                    //console.log('missed some file');
                }else {
                var style = '<style>' + data + '</style>';
                $('head').append(style); //add style to the head element
                }
            });
            browserPlatform = 'iphone';
            $('body').addClass('iphone');
        }else{
            $('#header .panel_menu').delay(4000).css({opacity:0, visibility:'visible'}).animate({opacity:1}, 1000);
        }
        //
        function doIphoneTouches(){
            //map all control clicks to touchend
            $('.cntrl').live('touchend', function(){
                var id = this.getAttribute('id');
                doCntrls(id);
                $(this).removeClass('sparkle');
            });
            $('.cntrl').live('touchstart', function(){
               $(this).addClass('sparkle');
            });
        }

        //

        // do some stuff on load, like add some controls, load the images etc
        var conBtn = $('#con_btn');
        var contact = $('#contact');
        var bioBtn = $('#bio_btn');
        var biography = $('#biography');
        contact.hide();
        biography.hide();
        conBtn.click(function(e){
            openPanel(contact);
            e.preventDefault();
        });
        bioBtn.click(function(e){
            openPanel(biography);
            e.preventDefault();
        });

        function openPanel(element){
          $('.active_panel').removeClass('active_panel').hide();
          element.fadeIn('fast');
          element.addClass('active_panel');
          var cId = element.selector;
          var closer = cId + ' .closer';
          $(closer).click(function(){
            element.hide();
            element.removeClass('active_panel');
          });
        }

        //416-738-8464

          //get ajax call, load data - image name, id, caption, src
          function mapVars (d){
            imgData = d; //load d into imgData
            makeView('#panel_content_ct');
          }

          //do ajax load first thing
          function doAjax(){
            var dataVar = null;
            $.ajax({
              url: 'http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=843806734c834810456499372db41a32&user_id=49349226@N02&extras=description,url_m,url_o,url_sq,&per_page='+ maxImages +'&page=1&format=json&jsoncallback=?',
              dataType: 'json',
              success: function(data){
                  dataVar = data.photos.photo;
                  mapVars(dataVar);
                }
            });
          };


          //crseate dom elements to show images, caption and controls
          function makeView(container){
            var c = container;
            var template = '<div class="item">' +
                '<div id="controls">' +
                '<div id="prev_cntrl" class="cntrl">&laquo;prev</div>' +
                '<div id="next_cntrl" class="cntrl right">next&raquo;</div>' +
                '<div id="img_grid"></div>' +
                '</div>' +
                '<div id="loading_mask">loading</div>' +
                '<h3 id="img_title"></h3>' +
                '<div id="swipe_test"></div><img id="showcase" class="img" src="" />';
            var indicatorsTemplate = '<div class="indicator">&nbsp;</div>'; //an indicator box
            for(i=1; i < imgData.length; i++){
                indicatorsTemplate = indicatorsTemplate + '<div class="indicator">&nbsp;</div>';
            };
            indicatorsTemplate = '<div id="indicators">' + indicatorsTemplate + '</div>';
            template = template + indicatorsTemplate; //add indicators depending on amount of images
            template = template + '<span id="img_caption" class="matte"></span><br />' +
            '</div>';
            $(template).prependTo(c);

            var inds = $('.indicator');
            $.each(inds, function(index){ //add data to each - allows us to not use ids or classes unncesarily
                $(inds[index]).data('bar', index);

                if(browserPlatform=="desktop"){
                    var thumb = '<img id="grid_'+ index +'" class="grid_img" src='+ imgData[index].url_sq +' />';
                    $('#img_grid').append(thumb);
                    if(index == maxImages - 1){
                        $('#controls').css({opacity:1}).delay(1500);
                        $('#controls').animate({opacity:0.1}, 1500);
                        $('#controls').bind('mouseenter', function(){
                            $('#controls').animate({opacity:1}, 300);
                            $('#img_title').hide();
                        });
                        $('#controls').bind('mouseleave', function(e){
                            $('#controls').animate({opacity:0.1}, 300);
                            e.stopPropagation();
                        });
                    }
                }
            });
            //load first image, caption etc
            showCase = $('#showcase'); //establish values for showCase & caption
            caption = $('#img_caption');
            imgTitle = $('#img_title');
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
            $('#grid_0').addClass('sparkle');
            showCase.bind('load', function(){ //create fx for loading an image - ie some kinda wipe, in ext, this would be put in onrender
              //console.log('loaded an image:' + showCase.attr('src'));
              showCase.show(); //initially hidden, but then shown, only applies to first load
              loadingMask.hide();
            });
            showCase.bind('mouseenter', function(){
              imgTitle.show();
              imgTitle.delay('6000').fadeOut();
            });
            makeCntrls();
          }

          //loadImage function handles image loading from controls and initialization
          function loadImage(img, showCase, caption){
            if(browserPlatform == 'desktop'){
                var imgUrl = imgData[img].url_o;
            }else{
                var imgUrl = imgData[img].url_m;
            };
            loadingMask.show();//show the loading mask until the image is done loading
            showCase.attr('src', imgUrl).attr('alt', imgData[img].title); //set the src for the showcase
            currImage = img; //establish currImage as whatever is fed into loadImage
            //showCase.attr('src', imgData[img].src);//set the src for the showcase
            //caption.text(imgData[img].caption); //set the caption for the given img
            imgTitle.text(imgData[img].title); //show the title briefly, then fade it out?
            caption.html("<h3>" + imgData[img].title + "</h3>" + imgData[img].description._content); //set the caption for the given img
            indicators.trigger('checkData', [img]);//highlight the relevant div showing which img in the series is loaded, checks all indicators at once
          }

          //bind functions to some controls.using live method
          function makeCntrls(){
            if(browserPlatform == 'desktop') {
                $('.cntrl').addClass('hoverable'); // only hover styles on desktop
                $('.cntrl').live('click', function(){
                    var id = this.getAttribute('id');
                    doCntrls(id);
                });
                $('.grid_img').live('click', function(){
                    var id = this.getAttribute('id').split('_')[1];
                    id = parseInt(id);
                    if (currImage !== id) {
                        $('.grid_img.sparkle').removeClass('sparkle');
                        $(this).addClass('sparkle');
                        currImage = parseInt(id) - 1;
                        if(currImage + 1 == maxImages -1){
                            $('#prev_cntrl').addClass('active');
                            $('#next_cntrl').removeClass('active');
                        }else if(currImage + 1 == 0){
                            $('#prev_cntrl').removeClass('active');
                            $('#next_cntrl').addClass('active');
                        }else{
                            $('#prev_cntrl').addClass('active');
                        }
                        loadImage(currImage + 1, showCase, caption);
                    }
                });
            }else{
                doIphoneTouches();
            }
//            $('.cntrl').live('mouseover mouseout', function(){
//                $(this).toggleClass('sparkle');
//                return false;
//            });
            $('#next_cntrl').addClass('active'); //initalize the previous to be disabled by default
          }


          //handle control clicks to go next, previous, etc
          function doCntrls(id){
            var whichCntrl = id;
            if (whichCntrl == 'next_cntrl') {
              currImage = currImage + 1; //select the 'next' image to use in functions
              if(currImage >= 0 && currImage <= maxImages-1) {
                loadImage(currImage, showCase, caption);
                $('#prev_cntrl').addClass('active');
                $('.grid_img.sparkle').removeClass('sparkle');
                $('#grid_' + currImage).addClass('sparkle');
                if(maxImages-currImage == 1){
                    //console.log('lasty');
                    $('#' + whichCntrl).removeClass('active');
                }
              } else {
                currImage = currImage - 1; //subtract 'nexted' image - ie staying the same
              }
            } else {
              currImage = currImage - 1;
              if(currImage >= 0 && currImage <= maxImages-1) {
                loadImage(currImage, showCase, caption);
                $('#next_cntrl').addClass('active');
                $('.grid_img.sparkle').removeClass('sparkle');
                $('#grid_' + currImage).addClass('sparkle');
                if(maxImages-currImage == maxImages){
                    //console.log('firsty');
                    $('#' + whichCntrl).removeClass('active');
                }
              } else {
                currImage = currImage + 1;
              }
            }

          }

          //  514-731-0060 x 237 - 1800-206-7218

        //

        //JQTouch stuff
        //$('#showcase').live('swipe tap', function(event, info){console.log(event);});

        $(function(){//swipe test

           $('#header').bind('touchmove', function(event) {
            event.preventDefault();
            var ts = event.targetTouches;
            console.log(ts);
            //var touch = event.touches[0];
            //console.log("Touch x:" + touch.pageX + ", y:" + touch.pageY);
        }, false);


//            $('#swipe_test').live("swipe", function(event, info){
//                //console.log(info.direction);
//                if(info.direction == "left") {
//                    //event.preventDefault();
//                    doCntrls('next_cntrl');
//                }else{
//                    //event.preventDefault();
//                    doCntrls('prev_cntrl');
//                }
//            });
        });

//        $('body').tap(function(){
//           alert('foo');
//        });

//        $(function(){ tap test
//            $('#header').tap( function(e){
//                console.log('Tapped!');
//            });
//        });

        //


        doAjax();
      });
    // ]]>

