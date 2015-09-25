var map;
var geoDrawingManager;
var geoInfoWindow;
var geoField; // Holds the polygon usre draws using drawing tools
var wkt; // Holds converted polygon
var drawingControlDiv; // Draw's icon

// Draw Map !
function initialize() {

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
        }
    };

    // show the map with the options listed above
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    // Add OpenStreetMap to mapType
    map.mapTypes.set("OSM", new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                var tilesPerGlobe = 1 << zoom;
                var x = coord.x % tilesPerGlobe;
                if (x < 0) {
                    x = tilesPerGlobe+x;
                }
                return "http://tile.openstreetmap.org/"
                    + zoom
                    + "/"
                    + coord.x
                    + "/"
                    + coord.y
                    + ".png";
            },
            tileSize: new google.maps.Size(256, 256),
            name: "OpenStreetMap",
            maxZoom: 18
        }));

    // HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
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
            content = 'Error: Your browser doesn\'t support geolocation.';
        }
        var options = {
            map: map,
            position: new google.maps.LatLng(48.195882, 16.369107),
            content: content
        };
        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }

    // create a dialog box
    geoInfoWindow = new google.maps.InfoWindow();
    DrawingTools();

    // Draw a polygon after a defined zoom

    drawingControlDiv = document.createElement('div');
    var polyControl = new DrawingControl(drawingControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(drawingControlDiv);
}


// Control drawing icon on map
function DrawingControl(controlDiv, map) {

    var controlUI = document.getElementById('draw_poly');
    controlDiv.appendChild(controlUI);

    controlUI.addEventListener('click', function() {
        geoDrawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    });

    // Zoom conditional statement after all the map's tiles loaded
    google.maps.event.addListener(map, 'tilesloaded', function() {
        var zoom = map.getZoom();
        // Enabled draw's icon
        if (zoom >= 13) {
            controlUI.value = 'Draw a Polygon';
            controlUI.style.pointerEvents = 'auto';
            controlUI.style.opacity = '1';
        }
        // Disabled draw's icon
        else if (zoom < 13) {
            controlUI.value = 'Please Zoom in closer';
            controlUI.style.opacity = '0.7';
            controlUI.style.pointerEvents = 'none';
            geoDrawingManager.setDrawingMode();
        }
    });
}


// Drawing Tools
function DrawingTools() {
    geoDrawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
            drawingModes: []
        },
        polygonOptions: {
            draggable: true,
            editable: true,
            fillColor: '#cccccc',
            fillOpacity: 0.5,
            strokeColor: '#000000'
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
            FieldClickListener();
            GMapPolygonToWKT();
            auto_click();
            empty_textarea();
        }
    );
}


// Open Wiki slide after polygon is completed
function auto_click() {
    if(!$('#cbp-spmenu-s1').hasClass('cbp-spmenu-open')){
        $('#showLeft').trigger('click');
    }
}


// erase all text area in wiki, ready for new polygon
function empty_textarea() {
    var w_title = $('#title').val('');
    var w_raw = $('#raw').val('');
    var w_message = $('#message').val('');
    w_raw = $('#raw').trigger('change');
}


// Convert google map polygon array to Well Known Text
function GMapPolygonToWKT(poly) {
    // Start the Polygon Well Known Text (WKT) expression
    wkt = "SRID=4326;POLYGON(";
    var paths = geoField.getPaths();
    for(var i=0; i<paths.getLength(); i++) {
        var path = paths.getAt(i);
        // Open a ring grouping in the Polygon Well Known Text
        wkt += "(";
        for(var j=0; j<path.getLength(); j++) {
            // setCenteradd each vertice and anticipate another vertice (trailing comma)
            wkt += path.getAt(j).lng().toString()
                + " "
                + path.getAt(j).lat().toString()
                +",";
        }
        // Also close the ring grouping and anticipate another ring (trailing comma)
        wkt += path.getAt(0).lng().toString()
            + " "
            + path.getAt(0).lat().toString()
            + "),";
    }
    // resolve the last trailing "," and close the Polygon
    wkt = wkt.substring(0, wkt.length - 1) + ")";
    return wkt;
}


// Show or hide the drawing tools
function ShowDrawingTools(val) {
    geoDrawingManager.setOptions({
        drawingMode: null
    });
    drawingControlDiv.style.display = 'none';
}


// Allow or disallow polygon to be editable and draggable
function PolygonEditable(val) {
    $('#editicons').show();
    geoField.setOptions({
        editable: val,
        draggable: val
    });
    geoInfoWindow.close();
    GMapPolygonToWKT(geoField);
    return wkt;
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

// Delete created polygon
function DeleteField() {
    geoInfoWindow.close();
    geoField.setMap(null);
    ShowDrawingTools(true);
    drawingControlDiv.style.display = '';
    $('#showLeft').trigger('click'); // Close wiki slide
    $('#editicons').hide();
}


/**
 * Get coordinates of the polygon and display information that should 
 * appear in the polygon's dialog box when it is clicked
 */
function GetMessage(polygon) {
    // save the coordiantes of the path
    var coordinates = polygon.getPath().getArray();
    var message = '';

    var coordinateMessage = '<p style="color:#000">Coordinates are:</p><p class="alert alert-info">';
    for (var i = 0; i < coordinates.length; i++) {
        coordinateMessage += coordinates[i].lat()
            + ', '
            + coordinates[i].lng()
            + '<br>';
    }
    coordinateMessage += '</p>';

    message += coordinateMessage;

    return message;
}
