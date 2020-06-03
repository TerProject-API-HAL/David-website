
/* 
   cette fonction est éxecutée lorsqu'on a reussit à recuperer les critères de recherche spécifier par l'utilisateur
*/

var callbackSucess=function(data){
  console.log("donnee Api",data);//on verifie avec un consol log que notre requete renvoie le resultat
 console.log("nombre d'article:",data.response.numFound);// on affiche le nombre de resulta renvoyé
clearInner(document.getElementById("zone_affiche"));//on efface les anciens resultats
clearInner(document.getElementById("nb_art"));
  var nb_art='';
  nb_art+="Nombre de publication: "+data.response.numFound+"";
  var ref = '';
  /*
		   on parcourt à l'aide d'une boucle les resultats renvoyés par notre requete qu'on ajoute
		   dans une table html pour etre afficher après
		   
		*/
  $.each(data.response.docs, function(key, value){
    ref += '<tr>';
	  ref += '<td>'+value.docid+'</td>';
    ref += '<td>'+value.title_s+'</td>';
	  ref += '<td>'+value.authFullName_s+'</td>';
	  ref += '<td> <a href='+value.uri_s+'>'+value.uri_s+'</a></td>';
	  ref += '<td>'+value.producedDateY_i+'</td>';
	  ref += '<td>'+value.docType_s+'</td>'
	  ref += '<td>'+value.country_s+'</td>';	
    
    ref += '</tr>';
  });
   //$(#tab).load(#tab);
  $('#nb_art').append(nb_art);//on ajoute le nombre de ligne renvoyé sur la page html
  $('#zone_affiche').append(ref);//on ajoute le contenu de la requete dans le tableau html
  $('#entete').text('resultat de la requete');
}

/*
		cette fonction "buttonClikGET" permet de rechercher des publications dans la collection 
		David selon un critère donné. elle prend en entrée deux paramètre la première : "critere" permet de
		préciser le critère de recherche. ce critère peut valoir une année ou un type de publication. exemple 
		"critereRecherche" peut etre égale a 2015 ou egale type de publication THESE. le deuxième paramètre de cette
		fonction appelé "opt" permet de savoir quel critère de recherche a été choisit par l'utilisateur. par 
		exemple si l'utilisateur veut faire la recherche en fonction des année, ce paramètre va valoir 
		annee et aisi de suite.

*/


function rechercheArt(critere,opt){
 /*
		   on commence par recuperer les paramètres de notre fonction depuis la page des statistiques
		   si l'utilisateur souhaite faire la recherche depuis cette page
		*/
  let params = new URLSearchParams(document.location.search.substring(1));
  var type = params.get("docType_s");
  var annee = parseInt(params.get("annee")); 
  var errors = params.get("errors");
  console.log(errors);
  /*
		   on teste pour voir si l'utilisateur veut faire sa recherche en fonction de l'année
		   si c'est le cas on construit l'url avec l'année
		*/
  
if(opt===1)
{

 //var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:" + annee + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
 var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&wt=json&fl=title_s,producedDateD_i,producedDateM_i,docType_s,producedDateY_i,docid,uri_s,country_s,authFullName_s&fq=producedDateY_i:" + critere + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
}
/*
		   on teste pour voir si l'utilisateur veut faire sa recherche en fonction des types de publication
		   si c'est le cas on construit l'url avec le type choisit
		*/
else if(opt===0)
{
	var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&wt=json&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&fq=docType_s:" + critere + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
	
}

/*
		   on teste pour voir si l'utilisateur veut rechercher les publications nationales ou internationales
		   si c'est le cas on construit l'url avec le pays d'origine France pour les publications nationales
		   sinon on recherche les publications qui ont pour pays d'irigine différent de la France
		*/

else if(opt===2)
{
   if(critere==="fr")
   {
   	   var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&wt=json&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&fq=country_s:" + critere + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
   }
   /*
		   au cas ou l'utilisateur ne recherche pas les publications nationale on lui renvoie toutes les
		   autres publications sauf celles qui ont un pays d'origine différent de la France
		   */
   else
   {
   	  var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&fq=producedDateY_i:[2015%20TO%20*]&wt=json&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&fq=!country_s:fr &rows=1000&indent=true&facet=true&facet.field=docType_s";
   }
}
// ici on renvoie toutes les publications qui se trouve dans la collection DAVID
else if(opt===3)
{
	var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&fq=producedDateY_i:[2015%20TO%20*]&wt=json&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true&facet=true&facet.field=docType_s";
}
else
{
	if (type && annee) {
      url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:" + annee + "&fq=docType_s:" + type + "&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true";            
                    }
    else if (errors) {
      url = getErrors();
      }
    else if (type && !annee) {
      url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:[2015%20TO%20*]&fq=docType_s:" + type + "&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true";              
      }
    else if (!type && annee) {
      url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:" + annee + "&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true";            
      }else
        url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:[2015%20TO%20*]&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true";            
	//var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&wt=json&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&fq=docType_s:" + type + "&fq=producedDateY_i:" + annee + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
    //var url="https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:" + annee + "&fq=docType_s:" + type + "&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true"
 }	
		/*
			après avoir recuperer le critère de recherche choisit par l'utilisateur on recupère les donné
			renvoyé par l'api et on traite ces donnée avec une fonction appellée callbackSucess qu'on a 
			déclaré plus haut
		*/	
  var donnee=$.get(url,callbackSucess).done(function(){

  })
  .fail(function(){
    alert("error");
    })
    .always(function(){

    });
}

//Cette fonction permet de trouver les erreurs au niveau du labo David
//Une erreur est une publication d'un auteur du laboratoire David 
//qui n'est pas affilié a la Collectionn David
function getErrors(){
    //Liste des noms complet des membres du labo David
    //nb: %20 est l'expression régulière représentant l'espace dans une requête https
    DavidNames = [
    "Luc%20Bouganim",
    "Mokrane%20Bouzeghoub",
    "Pierre%20Couchenay",
    "Béatrice%20Finance",
    "Jean-Michel%20Fourneau",
    "Danièle%20Gardy",
    "Zoubida%20Kedad",    
    "Leïla%20Kloul",  
    "Stéphane%20Lopes",   
    "Yann%20Loyer",   
    "Dana%20Marinca", 
    "Laurent%20Marsan",   
    "Thierry%20Mautor",   
    "Nicoleta%20Preda",   
    "Philippe%20Pucheral",    
    "Franck%20Quessette",
    "Popa%20Iulian%20Sandou",
    "Guillaume%20Scerri", 
    "Yann%20Strozecki",   
    "Yehia%20Taher",  
    "Sandrine%20Vial",    
    "Laurent%20Yeh",
    "Karine%20Zeitouni"]
    //Defining a url for finding publications with author in DavidNames
    var url = "https://api.archives-ouvertes.fr/search/?q=(" + "\"" + DavidNames[0] +"\"";
            for (var i = 1; i < DavidNames.length; i++) {
                url += " OR " + "\"" + DavidNames[i] +"\"";
            }
            url += ")-DAVID&fq=producedDateY_i:[2015%20TO%20*]&fl=title_s,docid,uri_s,docType_s,authFullName_s,country_s,producedDateY_i&rows=1000&indent=true";
    return url;
}


function clearInner(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
}

function clear(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
    node.parentNode.removeChild(node);
}

