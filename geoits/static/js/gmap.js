    var map;
    var geoDrawingManager;
    var geoInfoWindow;
    var centerPoint;
    var geoField; //holds the polygon usre draws using drawing tools

    // using jQuery for CSRF_TOKEN
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    // Draw Map !
    function initialize() {

        centerPoint = new google.maps.LatLng(42.195882, 36.369107);

        var myOptions = {
            panControl: false,
            zoomControl: false,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            draggable: true,
            disableDoubleClickZoom: true,
            scrollwheel: true,
            zoom: 12,
            center: centerPoint,
            mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN,
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.SATELLITE,
                "OSM"
                ]
            },
        };

        // show the map with the options listed above
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        // Add OSM Map
        map.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));

        // create a dialog box
        geoInfoWindow = new google.maps.InfoWindow();

        DrawingTools();
    }

    // Drawing Tools
    function DrawingTools() {
        geoDrawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON,
                ]
            },
            polygonOptions: {
                draggable: true,
                editable: true,
                fillColor: '#cccccc',
                fillOpacity: 0.5,
                strokeColor: '#000000',
            }
        });
        geoDrawingManager.setMap(map);
        FieldDrawingCompletionListener();
    }


    function FieldDrawingCompletionListener() {
        // capture the field, set selector back to hand, remove drawing
        google.maps.event.addListener(
            geoDrawingManager,
            'polygoncomplete',
            function(polygon) {
                geoField = polygon;
                ShowDrawingTools(false);
                PolygonEditable(false);
                AddPropertyToField();
                FieldClickListener();
                CreateCourseRegionPoly();
            }
        );
    }

    function GMapPolygonToWKT(poly)
    {
     // Start the Polygon Well Known Text (WKT) expression
     var wkt = "SRID=4326;GEOMETRYCOLLECTION(POLYGON(";

     var paths = geoField.getPaths();
     for(var i=0; i<paths.getLength(); i++)
     {
      var path = paths.getAt(i);
      
      // Open a ring grouping in the Polygon Well Known Text
      wkt += "(";
      for(var j=0; j<path.getLength(); j++)
      {
       // setCenteradd each vertice and anticipate another vertice (trailing comma)
       wkt += path.getAt(j).lng().toString() + " " + path.getAt(j).lat().toString() +",";
      }
      
      // Also close the ring grouping and anticipate another ring (trailing comma)
      wkt += path.getAt(0).lng().toString() + " " + path.getAt(0).lat().toString() + "),";
     }
     
     // resolve the last trailing "," and close the Polygon
     wkt = wkt.substring(0, wkt.length - 1) + "))";
     
     return wkt;
    }


    // save the path to database
    function CreateCourseRegionPoly(poly) {
        var wkt = GMapPolygonToWKT(geoField);
        $(function() {
            $("input").click(function() {
                $.ajax({
                    url: "test/",
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    data: {
                        geom : wkt,
                        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert("Messaging failed: " + errorThrown);
                    },
                    success: function(data) {
                        $('#result').append('ServerResponse:' + data.server_response)
                    }
                });
            })
        })
    }

    // show or hide the drawing tools
    function ShowDrawingTools(val) {
        geoDrawingManager.setOptions({
            drawingMode: null,
            drawingControl: val
        });
    }

    // Allow or disallow polygon to be editable and draggable
    function PolygonEditable(val) {
        geoField.setOptions({
            editable: val,
            draggable: val
        });
        geoInfoWindow.close();
        return false;
    }

    // Add custom property to the polygon
    function AddPropertyToField() {
        var obj = {
            'id': 5,
            'GeoITS': 'dev',
            'Issue': 'Tracking'
        };
        geoField.objInfo = obj;
    }

    /**
     * get a formatted message that contains links to re-edit the 
     * polygon, mark the polygon as complete, or delete the polygon.
     */
    function FieldClickListener() {
        google.maps.event.addListener(
            geoField,
            'click',
            function(event) {
                var message = GetMessage(geoField);
                geoInfoWindow.setOptions({
                    content: message
                });
                geoInfoWindow.setPosition(event.latLng);
                geoInfoWindow.open(map);
            }
        );
    }


    // Delete the polygon and show the drawing tools so that new polygon can be created
    function DeleteField() {
        geoInfoWindow.close();
        geoField.setMap(null);
        ShowDrawingTools(true);
    }

    // Get area of the drawn polygon in acres
    function GetArea(poly) {
        var result = parseFloat(google.maps.geometry.spherical.computeArea(poly.getPath())) * 0.000247105;
        return result.toFixed(4);
    }

    /**
     * Get coordinates of the polygon and display information that should 
     * appear in the polygon's dialog box when it is clicked
     */
    function GetMessage(polygon) {
        var coordinates = polygon.getPath().getArray(); // save the coordiantes of the path

        var message = '';

        if (typeof geoField != 'undefined') {
            message += '<h1 style="color:#000; font-size:20px">GeoITS: ' + geoField.objInfo.GeoITS + '<br>' + 'Issue: ' + geoField.objInfo.Issue + '</h1>';
        }

        message += '<div style="color:#000">This polygon has ' + coordinates.length + ' points<br>' + 'Area is ' + GetArea(polygon) + ' acres</div>';

        var coordinateMessage = '<p style="color:#000">My coordinates are:<br>';
        for (var i = 0; i < coordinates.length; i++) {
            coordinateMessage += coordinates[i].lat() + ', ' + coordinates[i].lng() + '<br>';
        }
        coordinateMessage += '</p>';

        message += '<p><a href="#" onclick="PolygonEditable(true);">Edit</a> ' + '<a href="#" onclick="PolygonEditable(false);">Done</a> ' + '<a href="#" onclick="DeleteField(geoField)">Delete</a></p>' + coordinateMessage;

        return message;
    }


    // HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
                map.setCenter(pos);
            },
            function() {
                handleNoGeolocation(true);
            });
    } else {
        // When browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }
        var options = {
            map: map,
            position: new google.maps.LatLng(48.195882, 16.369107),
            content: content
        };
        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);

    }