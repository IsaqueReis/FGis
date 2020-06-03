const TileLayer = ol.layer.Tile;
const VectorLayer = ol.layer.Vector;
const VectorSource = ol.source.Vector;
const OSM = ol.source.OSM;
const Draw = ol.interaction.Draw;
const View = ol.View;
const Map = ol.Map;

var freeHandCheck = false;                                  //verifica se o desenho é a mão livre ou não

var justOneGeometry = false;                                //se true aceita apenas uma geometria por vez

var features = new ol.Collection();                         //coleção de desenhos od usuário

var format = new ol.format.WKT();                           //formato de saída dos desenhos 

var deletedFeatures = new ol.Collection();                  //guarda os elementos da feature apagados

var typeSelect = document.getElementById('inputGeometry');  //pega a geometria do elemento

var freeHandCheckbox = document.getElementById('freeHand'); //checkbox com o tipo de desenho(mão livre ou travado)

var clearButton = document.getElementById('clear');         //botão que limpa o mapa 

var undoButton = document.getElementById('undo');           //botão de desfazer a ultima alteração 
 
var redoButton = document.getElementById('redo');           //botão de refazer as alterações

var centerButton = document.getElementById('center');       //botão de centralizar a vizualização

var lockDrawCheckbox = document.getElementById('lockDraw'); //botão para travar os múltiplos desenhos

var draw;                                                   //guarda o desenho

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

//adiciona o desenho ao mapa
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

//Listeners de eventos do mapa


//eventos de mouse e teclado
undoButton.addEventListener("click", undoDraw, false);
redoButton.addEventListener("click", redoDraw, false);
clearButton.addEventListener("click", clearMap, false);
centerButton.addEventListener("click", centerInCurrentLocation, false);


//eventos de interação com o mapa

//troca o tipo de geometria desenhada
typeSelect.onchange = function() {
    map.removeInteraction(draw);
    addInteraction();
};

//trata o evento da checkbox de desenho à mão livre
freeHandCheckbox.onchange = function() {
    if(freeHandCheck){
        freeHandCheck = false;
        addInteraction();
    } else {
        freeHandCheck = true;
        addInteraction();
    } 
}

//aceita apenas um desenho
lockDrawCheckbox.onchange = function() {
    if(justOneGeometry){
        justOneGeometry = false;
        undoButton.disabled = false;
        redoButton.disabled = false;
    } else {
        justOneGeometry = true;
        undoButton.disabled = true;
        redoButton.disabled = true;
    }
}



//mostra as cordenadas do pixel atual
map.on('singleclick', function(event) {

    console.log("EPSG:3857: ", event.coordinate);
    console.log("EPSG:4326: ", ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
});

//realiza o dump da coloção de geometrias do mapa
features.addEventListener("add", function(e){
    features.forEach(toEPSG4326);
    console.log(format.writeFeatures(features.getArray(), { rightHanded: true }));
    features.forEach(toEPSG3857);
})

addInteraction();
