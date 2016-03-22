"use strict";
import Redaxtor from 'redaxtor'
import RedaxtorMedium from 'redaxtor-medium'

let components = {
    html: RedaxtorMedium
}


var redaxtor = new Redaxtor({
    pieces: {
        attribute: "data-piece",//optional
        attributeId: "data-id",//optional
        attributeGetURL: "data-get-url",//optional
        attributeSaveURL: "data-save-url",//optional
        components: components,
        getURL: "lalala"
    }
});

window.redaxtor = redaxtor;