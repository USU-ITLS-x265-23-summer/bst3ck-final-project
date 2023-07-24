function getFormattedDate(date) {

    var newDate = new Date(date);

    var year = newDate.getFullYear();
    var month = (1 + newDate.getMonth()).toString();
    var day = newDate.getDate().toString();
  
    return month + '/' + day + '/' + year;
}