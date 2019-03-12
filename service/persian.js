var persianNumb = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
var engNumb = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

exports.toPersianDigit = (adad) => {
	var adad = v.split('');
    for (var i = 0; i < adad.length; i++) {
    	if (/\d/.test(adad[i])) {
        	adad[i] = persianNumb[adad[i]];
        }
    }
    return adad.join('');
}
