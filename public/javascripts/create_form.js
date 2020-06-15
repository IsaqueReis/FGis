//guarda uma lista de atributos
var attributes = [];

//conta o número de linhas adicionadas
var tableRowsCount = 0;

//adicionar atributos al ista
var addButton = document.getElementById('addAttribute').addEventListener("click", function(){

        let inputContainer = document.getElementById('attrInput');
        let inputControls = document.getElementById('attrInputControls');
        let attrsTable = document.getElementById('attrTable');

        hideOrShowDivs(inputContainer, inputControls, attrsTable);
});

var cancelButton = document.getElementById('cancelAddProperty').addEventListener("click", function(){

    let inputContainer = document.getElementById('attrInput');
    let inputControls = document.getElementById('attrInputControls');
    let attrsTable = document.getElementById('attrTable');

    hideOrShowDivs(inputContainer, inputControls, attrsTable);
});

var addToTableButton = document.getElementById('addProperty').addEventListener("click", function(){
   
    let attrCurrentKey = document.getElementById('attrKey').value;
    let attrCurrentValue = document.getElementById('attrValue').value;

    if(attributes.findIndex(x => x.key === attrCurrentKey) >= 0)
    {
        alert("Atributo já adicionado!");
        return;
    }
        

    attributes.push({key: attrCurrentKey, value: attrCurrentValue});

    let attrRowId = 'attrRow'.concat(tableRowsCount);
    console.log(attrRowId);

    appendDomNode(attrRowId, 'tr', "", [], 'featureAttrs');
    createTableEntry(attrRowId, attrCurrentKey, attrCurrentValue);
    tableRowsCount++;
});

var addLayerButton = document.getElementById('addFeature').addEventListener("click", function(){
    /*
    var feature = {
        name: document.getElementById('inputName').value,
        attributes: attributes,
        wkt: currentWkt
    }
    */

    addFeature(attributes);

    //sendFeature(feature);
});

var submitButton = document.getElementById('submitButton').addEventListener("click", function() {
    let layers = map.getLayers().getArray();

    layers.forEach(l => {
        //let features = l.getFeatures();
        if(l.get('id') !== undefined)
        {
            let source = l.getSource();
            let features = source.getFeatures();
            features.forEach(toEPSG4326);

            let feature = {
                name: document.getElementById('inputName').value,
                attributes: l.get('attributes'),
                wkt: format.writeFeatures(features, { rightHanded: true })
            };

            sendFeature(feature);

            features.forEach(toEPSG3857);
        }
            
    });
});

function hideOrShowDivs()
{
    for(let i = 0; i < arguments.length; i++)
        if(arguments[i].hidden)
            arguments[i].hidden = false;
        else 
            arguments[i].hidden = true;
}

//adiciona um nó filho a um elemento dom dado sua id, tag, innerText, classes CSS e nó pai
function appendDomNode(domNodeId, domNodeTag, domNodeInnerText, domNodeCssClassList, parentId)
{
    var node = document.createElement(domNodeTag);
    node.id = domNodeId;
    node.innerText = domNodeInnerText;
    node.classList = domNodeCssClassList;

    if(domNodeTag === 'a')
        node.href = '#';

    document.getElementById(parentId).appendChild(node);
}

//cria uma linha na tabela especificada por attrRowId, um botão para 
//remover o elemento criado é adicionado automaticamente
function createTableEntry(attrRowId, attrCurrentKey, attrCurrentValue)
{
    appendDomNode(`${attrRowId}Key`, 'td', attrCurrentKey, '', attrRowId);
    appendDomNode(`${attrRowId}Value`,'td', attrCurrentValue, '', attrRowId);
    appendDomNode(`${attrRowId}Remove`,'td', '', '', attrRowId);
    appendDomNode(`${attrRowId}RemoveLink`, 'a', 'Remover', '', `${attrRowId}Remove`);

    document.getElementById(`${attrRowId}RemoveLink`).addEventListener("click", function(){
        document.getElementById(attrRowId).remove();
        attributes.splice(attributes.findIndex(x => x.key === attrCurrentKey), 1);
    });
}

//envia o json para ser salvo no banco
function sendFeature(feature)
{
    // Criando um objeto XHR
    let xhr = new XMLHttpRequest(); 
    let url = "/api/saveFeature"; 

    // abrindo uma conexão do tipo POST
    xhr.open("POST", url, true);

    // Setando o header do tipo de conteúdo que será eviado, no caso JSON
    xhr.setRequestHeader("Content-Type", "application/json"); 

    // Create a state change callback 
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200) { 
            // Print received data from server 
            console.log(this.responseText); 
        } 
    }; 
    
    //convertendo o objeto em uma string JSON
    var data = JSON.stringify(feature);

    console.log(data);
    // Sending data with the request 
    xhr.send(data); 
}



