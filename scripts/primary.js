function getFormattedDate(date) {

    var newDate = new Date(date);

    var year = newDate.getFullYear();
    var month = (1 + newDate.getMonth()).toString();
    var day = newDate.getDate().toString();
  
    return month + '/' + day + '/' + year;
}

function getFormatLongDate(date){
    var newDate = new Date(date);
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    var year = newDate.getFullYear();
    var month = newDate.getMonth();
    var day = newDate.getDate().toString();
  
    
    return `${monthNames[month]} ${day}, ${year}`;
}

function getShortDate(date) {

    var newDate = new Date(date);

    var year = newDate.getFullYear();
    var month = (1 + newDate.getMonth()).toString();
    var day = newDate.getDate().toString();
  
    return month + '/' + day;
}

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0
});