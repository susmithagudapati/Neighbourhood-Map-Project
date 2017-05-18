var locations = [
    {
        title: 'IIT Bombay',
        position: {lat: 19.1334302, lng: 72.91326789999999},
        id: 1
    },
    {
        title: 'Gateway of India',
        position: {lat: 18.9219841, lng: 72.8346543},
        id: 2
    },
    {
        title: 'Mount Mary Basilica',
        position: {lat: 19.046508, lng: 72.82243810000001},
        id: 3
    },
    {
        title: 'Wankhede stadium',
        position: {lat: 18.9388993, lng: 72.8257783},
        id: 4
    },
    {
        title: 'Chhatrapati Shivaji International Airport (BOM)',
        position: {lat: 19.0895595, lng: 72.8656144},
        id: 5
    }
];

var map;
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 19.1493839, lng: 72.9238321},
        zoom: 10
    });

    var Marker = function(location) {
        var position = location.position;
        var title = location.title;
        var id = location.id;

        this.marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        id: id
                    });
    };

    var AppViewModel = function() {
        var markers = ko.observableArray();

        locations.forEach(function(location) {
            markers.push(new Marker(location));
        });
    };

    ko.applyBindings(new AppViewModel());
}