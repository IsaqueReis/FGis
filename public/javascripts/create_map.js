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
const Style = ol.style.Style;
const Stroke = ol.style.Stroke;
const Circle = ol.style.Circle;
const Fill = ol.style.Fill;
const Text = ol.style.Text;
const Select = ol.interaction.Select;

var features = new ol.Collection();                                      //coleção de desenhos od usuário

var format = new ol.format.WKT();                                        //formato de saída dos desenhos 

var centerButton = document.getElementById('center');                    //botão de centralizar a vizualização

var addPointButton = document.getElementById('point');                   //botão para adicionar um ponto ao mapa

var addLineStringButton = document.getElementById('lineString');         //botão para adicionar um ponto ao mapa

var addPolyButton = document.getElementById('polygon');                  //botão para adicionar um ponto ao mapa

var layersButton = document.getElementById('layers');

var draw, snap, featureCount = 0, currentWkt;                           //guarda o desenho atual, snap do desenho, previne iteração de desenho

var raster = new TileLayer({
    source: new OSM()
});

var fill = new Fill({
    color: 'rgba(210, 122, 167,0.2)'
  });
  var stroke = new Stroke({
    color: '#B40404',
    width: 2
  });

var styles = [
    new Style({
      image: new Circle({
        fill: fill,
        stroke: stroke,
        radius: 5
      }),
      fill: fill,
      stroke: stroke
    })
];

var source = new VectorSource({wrapX: false, features: features});

var vector = new VectorLayer({
    source: source,
    style: styles
});

var select = new Select({
    wrapX: false
});
  
var modify = new Modify({
    features: select.getFeatures()
});


var map = new Map({
    interactions: ol.interaction.defaults().extend([select, modify]),
    layers: [raster, vector],
    target: 'map',
    view: new View({
      center: [-11000000, 4600000],
      zoom: 4
    })
});

var modify = new Modify({source: source});
map.addInteraction(modify);

//funções de conversão de tipo de coordenada geográfica
function toEPSG4326(element, index, array) {
    element = element.getGeometry().transform('EPSG:3857', 'EPSG:4326');
}

function toEPSG3857(element, index, array) {
    element = element.getGeometry().transform('EPSG:4326', 'EPSG:3857');
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

function createLayer(feature, attributes, id) {

    //pegando as coordenadas minímas e máximas da feature
    let minx = feature.getGeometry().getExtent()[0];
    let miny = feature.getGeometry().getExtent()[1];
    let maxx = feature.getGeometry().getExtent()[2];
    let maxy = feature.getGeometry().getExtent()[3];

    var source = new VectorSource({
      features: [feature]
    });
  
    var vectorLayer = new VectorLayer({
      source: source, 
      id: id,
      attributes: attributes,
      centerx: ((minx + maxx) / 2),
      centery: ((miny + maxy) / 2)
    });
  
    map.addLayer(vectorLayer);
}

function destroyLayer(id)
{
    let layers = map.getLayers().getArray();

    layers.forEach(l => {
        if(l.get('id') === id)
            map.removeLayer(l);
    });
}

function showLayer(id)
{
    let layers = map.getLayers().getArray();

    layers.forEach(l => {
        if(l.get('id') === id)
        {
            let longitude = l.get('centerx');
            let latitude = l.get('centery');

            map.setView(new ol.View({
                center: [longitude, latitude],
                zoom: 4
            }));
        }
    });
}

function addFeature(attributes) 
{
    if(features.getArray().length <= 0)
        return;
        
    let name     = document.getElementById('inputName').value;
    let localList = document.getElementById('localList');
    let listFeatureId = name.concat(featureCount);
    console.log(listFeatureId);

    var elemTemplate = `
        <a id="${listFeatureId}" class="list-group-item text-left p-2">
            <div class="row">
                <div class="col-sm-8 d-sm-flex align-items-center" style="text-decoration: none">
                    <small style="overflow: hidden">${name}</small>
                </div>
                <div class="col-sm">
                    <div class="row">
                        <div class="col-sm p-0">
                            <button id="${listFeatureId}RemoveButton" class="btn p-0">
                                <img src="/assets/X.svg" alt="" width="20" height="23">
                            </button>
                        </div>
                        <div class="col-sm p-0">
                            <button id="${listFeatureId}ShowButton" class="btn p-0">
                                <img src="/assets/Cursor.svg" alt="" width="18" height="18">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `;
    var template = document.createElement('template');
    elemTemplate = elemTemplate.trim();
    template.innerHTML = elemTemplate;

    localList.appendChild(template.content.firstChild);    

    document.getElementById(`${listFeatureId}RemoveButton`).addEventListener("click", function(){
        document.getElementById(listFeatureId).remove();
        destroyLayer(listFeatureId);
    });

    document.getElementById(`${listFeatureId}ShowButton`).addEventListener("click", function() {
        showLayer(listFeatureId);
    });

    createLayer(features.pop(), attributes, listFeatureId);
    featureCount++;
}

function drawPoint()
{

    if(document.getElementById('inputName').value === '')
    {
        alert("não é possível adicionar um local sem nome!");
        return;
    }
        
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

function drawLineString() {

    if(document.getElementById('inputName').value === '')
    {
        alert("não é possível adicionar um local sem nome!");
        return;
    }

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

function drawPoly(){

    if(document.getElementById('inputName').value === '')
    {
        alert("não é possível adicionar um local sem nome!");
        return;
    }
    
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

    console.log(longitudeSmall.innerText = 'Latitude: ' + coordinateArray[0].toPrecision(6));
    console.log(latitudeSmall.innerText = 'Longitude: ' + coordinateArray[1].toPrecision(6));
});

//realiza o dump da coloção de geometrias do mapa
features.addEventListener("add", function(e){
    if(features.getArray().length >= 1)
        map.removeInteraction(draw);

    features.forEach(toEPSG4326);
    console.log(format.writeFeatures(features.getArray(), { rightHanded: true }));
    currentWkt = format.writeFeatures(features.getArray(), { rightHanded: true });
    features.forEach(toEPSG3857);
});

