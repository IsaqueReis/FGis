const TileLayer = ol.layer.Tile;
const VectorLayer = ol.layer.Vector;
const VectorSource = ol.source.Vector;
const MousePosition = ol.control.MousePosition;
const OSM = ol.source.OSM;
const Draw = ol.interaction.Draw;
const Modify = ol.interaction.Modify;
const Snap = ol.interaction.Snap;
const View = ol.View;
const Map = ol.Map;

var justOneGeometry = false;                                //se true aceita apenas uma geometria por vez

var features = new ol.Collection();                         //coleção de desenhos od usuário

var format = new ol.format.WKT();                           //formato de saída dos desenhos 

var deletedFeatures = new ol.Collection();                  //guarda os elementos da feature apagados

var typeSelect = document.getElementById('inputGeometry');  //pega a geometria do elemento

var clearButton = document.getElementById('clear');         //botão que limpa o mapa 

var undoButton = document.getElementById('undo');           //botão de desfazer a ultima alteração 
 
var redoButton = document.getElementById('redo');           //botão de refazer as alterações

var centerButton = document.getElementById('center');       //botão de centralizar a vizualização

var addPointButton = document.getElementById('addPoint');   //botão para adicionar um ponto ao mapa

var addLineStringButton = document.getElementById('addLine');   //botão para adicionar um ponto ao mapa

var addPolyButton = document.getElementById('addPoly');   //botão para adicionar um ponto ao mapa

var lockDrawCheckbox = document.getElementById('lockDraw'); //botão para travar os múltiplos desenhos

var mapTools = document.getElementById('drawTools');        //caixa de ferramentas do mapa

var draw, snap;                                             //guarda o desenho atual, snap do desenho

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

var modify = new Modify({source: source});
map.addInteraction(modify);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//funções de conversão de tipo de coordenada geográfica
function toEPSG4326(element, index, array) {
    element = element.getGeometry().transform('EPSG:3857', 'EPSG:4326');
}

function toEPSG3857(element, index, array) {
    element = element.getGeometry().transform('EPSG:4326', 'EPSG:3857');
}

//desfaz a última alteração
function undoDraw() {

    map.removeLayer(vector);
    if(features.getArray().length >= 1){
        deletedFeatures.push(features.getArray()[features.getArray().length - 1]);
        features.pop();
    }
        
    source = new VectorSource({wrapX: false, features: features});
    vector = new VectorLayer({
        source: source
    });
    map.addLayer(vector);
}

//refaz a última alteração
function redoDraw() {

    if(deletedFeatures.getArray().length >= 1) {
        features.push(deletedFeatures.pop());
    }
}

//limpa todos os desenhos feitos no mapa
function clearMap() {

    map.removeLayer(vector);
    features.clear();
    source = new VectorSource({wrapX: false, features: features});
    vector = new VectorLayer({
        source: source
    });
    map.addLayer(vector);
}

//centraliza a visão do mapa nas coordenadas fornecidas pelo usuário, caso
//confirme que o navegador pegue sua localização atual
function centerInCurrentLocation() {

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            let userCoords = ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857');
            console.log(userCoords);
            map.setView(new View({
                center: userCoords,
                zoom: 15
            }));
        });
    }
}

function drawPoint()
{
    draw = new Draw({
        source: source,
        type: 'Point',
    });

    if(features.getArray().length <= 0)
    {
        snap = new Snap({source: source});
        map.addInteraction(draw);
        map.addInteraction(snap);

    } else if(features.getArray().length >= 1) {

        alert('só é possivel desenhar uma geometria por vez!');
    }
       
}

function drawLineString()
{
    draw = new Draw({
        source: source,
        type: 'LineString'
    });
    
    if(features.getArray().length <= 0)
    {
        snap = new Snap({source: source});
        map.addInteraction(draw);
        map.addInteraction(snap);

    } else if(features.getArray().length >= 1) {

        alert('só é possivel desenhar uma geometria por vez!');
    }
}

function drawPoly()
{
    draw = new Draw({
        source: source,
        type: 'Polygon',
    });
    
    if(features.getArray().length <= 0)
    {
        snap = new Snap({source: source});
        map.addInteraction(draw);
        map.addInteraction(snap);
        
    } else if(features.getArray().length >= 1) {

        alert('só é possivel desenhar uma geometria por vez!');
    }
}


//Listeners de eventos do mapa


//eventos de mouse e teclado
undoButton.addEventListener("click", undoDraw, false);
redoButton.addEventListener("click", redoDraw, false);
clearButton.addEventListener("click", clearMap, false);
centerButton.addEventListener("click", centerInCurrentLocation, false);
addPointButton.addEventListener("click", drawPoint, false);
addLineStringButton.addEventListener("click", drawLineString, false);
addPolyButton.addEventListener("click", drawPoly, false);

//eventos de interação com o mapa

//mostra as cordenadas do pixel atual
map.on('singleclick', function(event) {

    let coordinateArray = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
    let longitudeSmall = document.getElementById('longitude');
    let latitudeSmall = document.getElementById('latitude');

    longitudeSmall.innerText = 'Latitude: ' + coordinateArray[0].toPrecision(6);
    latitudeSmall.innerText = 'Longitude: ' + coordinateArray[1].toPrecision(6);
});

//realiza o dump da coloção de geometrias do mapa
features.addEventListener("add", function(e){
    if(features.getArray().length >= 1)
        map.removeInteraction(draw);

    features.forEach(toEPSG4326);
    console.log(format.writeFeatures(features.getArray(), { rightHanded: true }));
    features.forEach(toEPSG3857);
});
