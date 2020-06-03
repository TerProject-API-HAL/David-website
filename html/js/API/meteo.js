var callBackGetSuccess = function(data){
	//console.log("dinnee api", data);
	/*console.log(data.response.docs)
	var element = document.getElementById("zone_meteo");
	element.innerHTML = "La temperature est de " + data;*/
	//$("#data").mirandajs(data.response.docs);
	var ref = '';
	$.each(data.response.docs, function(key, value){
		ref += '<tr>';
		ref += '<td>'+value.docid+'</td>';
		ref += '<td>'+value.docid+'</td>';
		ref += '<td>'+value.docid+'</td>';
		ref += '</tr>';
	});
	$('#data').append(ref);

}


function buttonClickGet(){

	var url = "https://api.archives-ouvertes.fr/search/DAVID"
	$.get(url, callBackGetSuccess).done(function(){
		alert("succes");

	})
	.fail(function(){
		alert("error");
	})
	.always(function(){
		alert("finished");
	})
}