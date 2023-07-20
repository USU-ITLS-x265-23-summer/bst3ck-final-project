console.log("Starting client js");

$(document).ready(function(){
    
    $.ajax({
      type: "GET",
      url: "http://www.bksteckler.com/klokke/test.php",
      async   : true,
      success: function (data) {
            console.log("hola Ben");
            console.log(data);
            console.log(data[0].clientName);

            result = "";
            data.forEach(function(item, index) {
                console.log(item, index);
                result += `<li class='client-name' id='clientId-${item.clientId}'>${item.clientName}</li>`;
                
            });
            console.log(result);

            document.getElementById("fullClientList").innerHTML = result;

        },
    });

});