// Data of different locations being marked on the map.
var locations;
locations = [
    {
        title: "IIT Bombay",
        position: {lat: 19.1334302, lng: 72.91326789999999},
        visible: ko.observable(true),
        venueId: '4b11f6fdf964a520a08723e3',
        id: 1
    },
    {
        title: "Gateway of India",
        position: {lat: 18.9219841, lng: 72.8346543},
        visible: ko.observable(true),
        venueId: '4b0587d1f964a520cea222e3',
        id: 2
    },
    {
        title: "Mount Mary Basilica",
        position: {lat: 19.046508, lng: 72.82243810000001},
        visible: ko.observable(true),
        venueId: '4b0587d2f964a520f3a222e3',
        id: 3
    },
    {
        title: "Haji Ali Dargah",
        position: {lat: 18.982747, lng: 72.8089648},
        visible: ko.observable(true),
        venueId: '514e35b0e4b023ae13d3858b',
        id: 4
    },
    {
        title: "Chhatrapati Shivaji International Airport (BOM)",
        position: {lat: 19.0895595, lng: 72.8656144},
        visible: ko.observable(true),
        venueId: '4b0587e5f964a5202ea622e3',
        id: 5
    },
    {
        title: "Juhu Beach",
        position: {lat: 19.1194644, lng : 72.82015989999999},
        visible: ko.observable(true),
        venueId: '4d0d00a6f393224bbadc19ee',
        id: 6
    },
    {
        title: "Sanjay Gandhi National Park",
        position: {lat: 19.2210347, lng: 72.9067922},
        visible: ko.observable(true),
        venueId: '4b0587d1f964a520d8a222e3',
        id: 7
    },
    {
        title: "Siddhivinayak Temple",
        position: {lat: 19.0168986, lng: 72.8303439},
        visible: ko.observable(true),
        venueId: '4b0587e4f964a520fba522e3',
        id: 8
    },
    {
        title: "Essel World",
        position: {lat: 19.2327242, lng: 72.8055083},
        visible: ko.observable(true),
        venueId: '4b0587e6f964a5205da622e3',
        id: 9
    },
    {
        title: "Babulnath Temple",
        position: {lat: 18.9592844, lng: 72.8087115},
        visible: ko.observable(true),
        venueId: '4b0587d1f964a520e1a222e3',
        id: 10
    },
    {
        title: "Powai Lake",
        position: {lat: 19.1265972, lng: 72.90619029999999},
        visible: ko.observable(true),
        venueId: '4d9b9eb44fdab60cbd944ff2',
        id: 11
    },
    {
        title: "Jahenger Art Gallery",
        position: {lat: 18.9274559, lng: 72.83170299999999},
        visible: ko.observable(true),
        venueId: '4b0587d3f964a5203ca322e3',
        id: 12
    },
    {
        title: "Navi Mumbai",
        position: {lat: 19.0330488, lng: 73.0296625},
        visible: ko.observable(true),
        venueId: '4d45838dbf61a1cd66ea13ac',
        id: 13
    }
];

var infowindow;
var map;

// Marker class that initializes the marker with it's data.
var Marker = function(location, markers) {
    var position = location.position;
    var title = location.title;
    var id = location.id;

    this.venueId = location.venueId;
    this.content = "";

    this.marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: title,
                    animation: google.maps.Animation.DROP,
                    id: id,
                });

    this.setContent = function() {
        if (this.content) {
            return this.content;
        }

        var topTips = [];
        var venueUrl = 'https://api.foursquare.com/v2/venues/' + this.venueId + '/tips?sort=recent&limit=5&v=20150609&client_id=TYQTTIWADZWGKTMPTJ2LYKHDHOWKTP2VCXCIBL4H1MYLEHBA&client_secret=B0ZY2MLGBP13OTL2SKAQNZ2KYFLMQADWWQ1B5XK2UAAJYXPO';
        var that = this;

        $.getJSON(venueUrl, function(data) {
            console.log(data);
            data.response.tips.items.forEach(function(item) {
                topTips.push('<li>' + item.text + '</li>');
            });
        }).done(function(){
            that.content = '<h2>' + that.marker.title + '</h2>' + '<h3>Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
        }).fail(function(jqXHR, textStatus) {
            that.content = '<h2>' + that.marker.title + '</h2>' + '<h3>Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this location\'s comments.</h4>';
            console.log('getJSON request failed! ' + textStatus);
        });
    };

    // function that opens infowindow when clicked on that particular marker.
    google.maps.event.addListener( this.marker, 'click', function() {
        markers.forEach( function(marker) {
            if (marker.marker.getAnimation() !== null) {
                marker.marker.setAnimation(null);

            }
        });
        this.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.setContent('<div>' + markers[this.id - 1].content + '</div>');
        infowindow.open(map, this);
    });
};


function AppViewModel() {

    var self = this;

    self.markers = ko.observableArray([]);
    self.query = ko.observable("");
    infowindow = new google.maps.InfoWindow();

    // initMap function initializes the map on page load.
    self.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.1493839, lng: 72.9238321},
            zoom: 11
        });

        // Event listener function centers the map when window resizes.
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    };


    // populateInfoWindow function opens the infowindow on clicking the marker by
    //populating it with the title and position.
    self.populateInfoWindow = function() {
        self.markers().forEach( function(marker) {
            if (marker.marker.getAnimation() !== null) {
                marker.marker.setAnimation(null);
            }
        });
        var myMarker = self.markers()[this.id - 1];
        var marker = myMarker.marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.setContent('<div>' + myMarker.content + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    };

    // filterMarkers function filters the markers based on the search input given.
    self.filterMarkers = function() {
        var results = [];
        var query = self.query().toLowerCase();
        self.markers().forEach(function( marker ) {
            if (marker.marker.title.toLowerCase().includes(query)) {
                results.push(marker);
            }
        });
        return results;
    };

    //filterLocations function filters the locations list based on the input query.
    self.filterLocationList = function() {
        var results = [];
        var query = self.query().toLowerCase();
        locations.forEach( function( location ) {
            if(location.title.toLowerCase().includes(query)) {
                results.push( location );
            }
        });
        return results;
    };

    // updateList function updates the locations list and set Markers on the map when the
    // page loads. Also, updates the list whenever search is done.
    self.updateList = function() {
        self.clearMarkers();
        self.clearList();
        self.setLocations( self.filterLocationList() );
        self.setMarkers( self.filterMarkers() );
    };

    // clearList initially empties the locations list to filter the locations.
    self.clearList = function() {
        locations.forEach( function( location ) {
            location.visible( false );
        });
    };

    // clearMarkers erases the markers on the map to trigger search query.
    self.clearMarkers = function() {
        self.markers().forEach(function (marker) {
            marker.marker.setVisible( false );
        });
    };

    //setLocations function displays the filtered locations in the side-menu.
    self.setLocations = function( filterLocations ) {
        filterLocations.forEach( function( location ) {
            location.visible( true );
        });
    };

    //setMarkers function displays the filtered markers on the map
    self.setMarkers = function(filterMarkers) {
        filterMarkers.forEach( function( marker ) {
            marker.marker.setVisible( true );
            if(self.query()) {
                marker.marker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
                marker.marker.setAnimation(google.maps.Animation.DROP);
            }
        });
    };

    // setMarkers creates marker instances for every location when the page loads and
    // when the search is processed.
    self.createMarkers = function() {
        locations.forEach(function(location) {
            var marker = new Marker(location, self.markers());
            marker.setContent();
            self.markers.push(marker);
        });
    };
}

// function that alerts the error message when map doesn't load
function googleError() {
    alert("Failed to load Google Maps API");
}

var viewModel;

function initialize() {

    viewModel = new AppViewModel();

    viewModel.initMap();
    viewModel.createMarkers();

    ko.applyBindings(viewModel);
}

function mediaSize() {

    // condition for smaller screens to keep the page responsive
    if (window.matchMedia('(max-width: 767px)').matches) {
        $('.sidebar').addClass('hide');
        $('.responsive-header').removeClass('hide');

        //hamburger icon to open the locations list
        $('.hamburger').click(function(){
            $('#map').css('left','360px');
            $('.hamburger').addClass('hide');
            $('.cross').removeClass('hide');
        });

        //cross icon to close the locations list
        $('.cross').click(function(){
            $('#map').css('left','0px');
            $('.hamburger').removeClass('hide');
            $('.cross').addClass('hide');
        });
    }

    // bring back to default design when window size increases
    else{
        $('.sidebar').addClass('show');
        $('.responsive-header').addClass('hide');
    }
}

$(document).ready(function() {
    window.addEventListener('resize', mediaSize);
});