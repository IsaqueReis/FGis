//guarda uma lista de atributos
var attributes = [];

//conta o número de linhas adicionadas
var tableRowsCount = 0;

//adicionar atributos al ista
var addButton = document.getElementById('addAttribute').addEventListener("click", function(){

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




