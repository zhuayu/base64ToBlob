var base64ToBlob = function base64ToBlob(dataURI, filename) {

    var byteString = base64ToByteString(dataURI);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    var mimeType = getMimeTypeFromDataURI(dataURI);

    if (typeof filename === 'undefined') {
        filename = getDateString(new Date()) + '.' + getExtensionByMimeType(mimeType);
    }

    return blobToFile(createBlob(ab, mimeType), filename);
};

var base64ToByteString = function base64ToByteString(dataURI) {

    // get data part of string (remove data:image/jpeg...,)
    var dataPart = dataURI.split(',')[1];

    // remove any whitespace as that causes InvalidCharacterError in IE
    var dataPartCleaned = dataPart.replace(/\s/g, '');

    // to bytestring
    return atob(dataPartCleaned);
};

var getMimeTypeFromDataURI = function getMimeTypeFromDataURI(dataUri) {
    if (!dataUri) {
        return null;
    }
    var matches = dataUri.substr(0, 16).match(/^.+;/);
    if (matches.length) {
        return matches[0].substring(5, matches[0].length - 1);
    }
    return null;
};

var getDateString = function getDateString(date) {
    return date.getFullYear() + '-' + leftPad(date.getMonth() + 1, '00') + '-' + leftPad(date.getDate(), '00') + '_' + leftPad(date.getHours(), '00') + '-' + leftPad(date.getMinutes(), '00') + '-' + leftPad(date.getSeconds(), '00');
};

var leftPad = function leftPad(value) {
    var padding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return (padding + value).slice(-padding.length);
};

var getExtensionByMimeType = function getExtensionByMimeType(mimetype) {
    var type = void 0;
    for (type in MimeTypes) {
        if (!MimeTypes.hasOwnProperty(type)) {
            continue;
        }
        if (MimeTypes[type] === mimetype) {
            return type;
        }
    }
    return mimetype;
};

var blobToFile = function blobToFile(blob, name) {
    if ('lastModified' in File.prototype) {
        blob.lastModified = new Date();
    } else {
        blob.lastModifiedDate = new Date();
    }
    blob.name = name;
    return blob;
};

var createBlob = function createBlob(data, mimeType) {

    var BB = window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

    if (BB) {
        var bb = new BB();
        bb.append(data);
        return bb.getBlob(mimeType);
    }

    return new Blob([data], {
        type: mimeType
    });
};
