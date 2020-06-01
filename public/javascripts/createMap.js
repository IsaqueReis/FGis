const TileLayer = ol.layer.Tile;
const VectorLayer = ol.layer.Vector;
const VectorSource = ol.source.Vector;
const OSM = ol.source.OSM;
const Draw = ol.interaction.Draw;
const View = ol.View;
const Map = ol.Map;

function toEPSG4326(element, index, array) {
    element = element.getGeometry().transform('EPSG:3857', 'EPSG:4326');
}

function toEPSG3857(element, index, array) {
    element = element.getGeometry().transform('EPSG:4326', 'EPSG:3857');
}

//verifica se o desenho é a mão livre ou não
var freeHandCheck = false;
//coleção de desenhos od usuário
var features = new ol.Collection();
//formato de saída dos desenhos 
var format = new ol.format.WKT();

var raster = new TileLayer({
    source: new OSM()
});

var source = new VectorSource({wrapX: false, features: features});

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
//checkbox com o tipo de desenho(mão livre ou travado)
var freeHandCheckbox = document.getElementById('freeHand');
//botão que limpa o mapa 
var clearButton = document.getElementById('clear');
//botão de desfazer a ultima alteração 
var undoButton = document.getElementById('undo');

//interação que cria o desenho
var draw;
function addInteraction() {
    var value = typeSelect.value;
    if(value !== 'None') {
        draw = new Draw({
            source: source,
            //features: features,
            type: typeSelect.value,
            freehand : freeHandCheck
        });
        map.addInteraction(draw);
    }
}

//se trocar a geometria selecionada
typeSelect.onchange = function() {
    map.removeInteraction(draw);
    addInteraction();
};

freeHandCheckbox.onchange = function() {
    if(freeHandCheck){
        freeHandCheck = false;
        addInteraction();
    } else {
        freeHandCheck = true;
        addInteraction();
    } 
}

undoButton.addEventListener("click", function() {
    map.removeLayer(vector);
    console.log(features);
    features.pop();
    console.log(features);
    source = new VectorSource({wrapX: false, features: features});
    vector = new VectorLayer({
        source: source
    });
    map.addLayer(vector);
    console.log("desfazer a ultima alteração!");
});

clearButton.addEventListener("click", function(){
    map.removeLayer(vector);
    features.clear();
    source = new VectorSource({wrapX: false, features: features});
    vector = new VectorLayer({
        source: source
    });
    map.addLayer(vector);
    
   console.log("limpar tela");
});

features.addEventListener("add", function(e){
    features.forEach(toEPSG4326);
    console.log(format.writeFeatures(features.getArray(), { rightHanded: true }));
    features.forEach(toEPSG3857);
})

addInteraction();
