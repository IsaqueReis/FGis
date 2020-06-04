window.addEventListener("load", function () {
    fetch('/api/getAllFeatures').then(function(response) {
        response.json().then( function(json) {
            var featureList = Array.from(json);
            featureList.forEach(f => {
                let cardContainer = document.getElementById('cardContainer');
                let cardId = 'feature$' + f.id;
                Promise.resolve(f.feature_data)
                       .then(JSON.parse)
                       .then(function (parsedJson) {
                            appendCard(cardId, parsedJson.name, parsedJson.category, 
                                       '', cardContainer.id);
                       });
            });
        });
    });
});


function appendCard(id, title, subtitle, description, parentId)
{
    var rootNode = document.createElement('div');
        rootNode.classList = "card mb-1";
        rootNode.style = "width: 100%";
        rootNode.id = id;

    var cardBody = document.createElement('div');
        cardBody.className = "card-body";

    var cardTitle = document.createElement('h5'); 
        cardTitle.className = "card-title";
        cardTitle.innerText = title;

    var cardSubTitle = document.createElement('h6'); 
        cardSubTitle.classList = "card-subtitle mb-2 text-muted";
        cardSubTitle.innerText = subtitle;
    
    var cardText = document.createElement('p');
        cardText.className = "card-text";
        cardText.innerText = description;
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubTitle);
    cardBody.appendChild(cardText);
    rootNode.appendChild(cardBody);
    document.getElementById(parentId).appendChild(rootNode);
}

