// Show or Hide wiki slide
var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
    showLeft = document.getElementById( 'showLeft' ),
    body = document.body;
showLeft.onclick = function() {
    classie.toggle( menuLeft, 'cbp-spmenu-open' );
    };
    hideLeft = document.getElementById( 'hideSlide' ),
hideLeft.onclick = function() {
    classie.toggle( this, 'active' );
    classie.toggle( menuLeft, 'cbp-spmenu-open' );
};


// Hide wiki slide when user clicks on cross bar
$("#hideSlide").click(function() {
    if(typeof geoField != 'undefined') {
    geoField.setMap(null);
    }
    ShowDrawingTools(true);
    $("#editicons").hide();
    drawingControlDiv.style.display = '';
});


// Login and SignUp functions
$("#signin").click(function() {
    window.location.href="/accounts/login/";
});

$("#register").click(function() {
    window.location.href="/accounts/signup/";
});


$(document).ready(function() {
    var currentPolygon;
    // Markdown settings
    new Vue({
        el: '#editor',
        data: {
            input: ''
        },
        filters: {
            marked: marked
        }
    });
    var polyArray = [];

    // Submit polygon and Wiki content
    $("#submit").click(function() {
    var w_title = $('#title').val();
    var w_raw = $('#raw').val();
    var w_poly_id = $('#poly_id').val();
        $.ajax({
            url: "test/",
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: {
                geom: wkt,
                title: w_title,
                raw: w_raw,
                message: '',
                markup: "Markdown",
                polygon_id: w_poly_id,
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Messaging failed: " + errorThrown);
            },
            success: function(data) {
                if(!data.success){
                    window.location.href="/accounts/login/";
                }
                else {
                    $('#showLeft').click();
                    location.reload();
                }
            }
        });
    });
    initialize();

    // Load all polygons from database to map
    $.ajax({
        url: "load_polygons/",
        dataType: 'json',
        type: 'GET',
        success: function(data, status, jqXHR){
            $.each(data, function(i, polygon){
                var coords = [];
                $.each(polygon.geom, function(i,points){
                    $.each(points, function(i, point){
                        coords.push({lat: point[1], lng: point[0]});
                    });
                });
            var poly = new google.maps.Polygon({
                paths: coords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

                var polygonStore = [];
                polygonStore['id'] = polygon.id;
                polygonStore['obj'] = poly;
                poly.indexID = polygon.id;
                poly.selected = false;
                polyArray.push(polygonStore);
                google.maps.event.addListener(poly, 'click', function (event) {
                    if(currentPolygon){
                        currentPolygon.setOptions({strokeColor: "#FF0000"});
                    }
                    currentPolygon = this;
                    this.setOptions({strokeColor: "#000000"});
                    console.log(this.indexID);
                    var id = this.indexID;

                    // load polygon's wiki page
                    $.ajax({
                        url: "get_wiki/?id=" + id,
                        dataType: 'json',
                        type: 'GET',
                        success: function(data, status, jqXHR){
                            $("#title").val(data.title);
                            $("#raw").val(data.raw);
                            $("#raw").trigger("change");
                            $("#poly_id").val(id);

                            // Wiki git history setttings
                            var link = "/wiki/" + id + "/history/";
                            var a = document.getElementById('hist');
                            a.href = link;
                        }
                    });
                    // open wiki slide when polygon is clicked
                    var menuLeft = document.getElementById( 'cbp-spmenu-s1' );
                    if(!$('#cbp-spmenu-s1').hasClass('cbp-spmenu-open')){
                        classie.toggle( menuLeft, 'cbp-spmenu-open' );
                    }
                });
                poly.setMap(map);
            });
        }
    });
});
