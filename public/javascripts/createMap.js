const TileLayer = ol.layer.Tile;
const VectorLayer = ol.layer.Vector;
const VectorSource = ol.source.Vector;
const OSM = ol.source.OSM;
const Draw = ol.interaction.Draw;
const View = ol.View;
const Map = ol.Map;

var raster = new TileLayer({
    source: new OSM()
});

var source = new VectorSource({wrapX: false});

var vector = new VectorLayer({
    source: source
});

var map = new Map({
    layers: [raster, vector],
    target: 'map',
    view: new View({
      center: [-11000000, 4600000],
      zoom: 4
    })
});

//pega a geometria do elemento
var typeSelect = document.getElementById('inputGeometry');

//interação que cria o desenho
var draw;
function addInteraction() {
    var value = typeSelect.value;
    if(value !== 'None') {
        draw = new Draw({
            source: source,
            type: typeSelect.value
        });
        map.addInteraction(draw);
    }
}

//se trocar a geometria selecionada
typeSelect.onchange = function() {
    map.removeInteraction(draw);
    addInteraction();
};

addInteraction();
