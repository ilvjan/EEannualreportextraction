const fs = require('fs');
const pdf = require('pdf-parse');
let raamatupidamine = [];
let Bilanss = [];
let Kasumiaruanne = [];
let aruanne;
let dates = [];
let tabel = Boolean;
let page = 0;

function getdate(itemx) {
    if (parseFloat(itemx) > 364 && parseFloat(itemx) < 426) return 1;
    if (parseFloat(itemx) > 300 && parseFloat(itemx) < 364) return 0;
}

function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: true
    }

    return pageData.getTextContent(render_options)
        .then(function(textContent) {
            let lastY, text = '';
            page += 1;
            if (page == 4) {
                for (let item of textContent.items) {
                    if (item.str && item.str !== " ") {
                        if ((item.str === "Bilanss" || item.str === "Kasumiaruannne") && parseInt(item.height) == 14) {
                            tabel = true;
                            aruanne = item.str;
                            const item_str = item.str;
                            let objekt = {
                                [item_str]: {}
                            };
                            raamatupidamine.push(objekt);
                        }
                        if (tabel == 1) {
                            if (dates.length !== 2) {
                                if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 426) {
                                    dates.push(item.str);
                                }
                            }
                            else if (dates.length == 2) {
                                if (parseFloat(item.transform[4]) < 300) {
                                    let obj = {[item.str]: {}};
                                    aruanne.push(obj);
                                }
                                else if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 426 ) {
                                    let key = Object.values(aruanne[aruanne.length - 1])[0];
                                    let date = dates[getdate(item.transform[4])];
                                    let item_str = item.str;
                                    console.log(Object.keys(key));
                                    // if (key.hasOwnProperty(date)) {
                                    //     let obj = Object.values(key)[getdate(item.x)];
                                    //     item_text = obj + item_text;
                                    // }
                                    key[date] = item_str;

                                }
                            }

                            }
console.log(item.transform);
                    }
                }

                // console.log("Raamatupidamine " + raamatupidamine);
                // console.log("Dates " + dates);
                // console.log("Tabel " + tabel);
                // console.log("Page " + page);
                console.log(JSON.stringify(Bilanss));
                console.log(JSON.stringify(Kasumiaruanne));
                tabel = false;
                dates.length = 0;
               // return text;
            }
        })

}

let options = {
    pagerender: render_page
}

let dataBuffer = fs.readFileSync('uploads/Aruanne_14058782.pdf');


pdf(dataBuffer, options).then(function(data) {

    // // number of pages
    // console.log(data.numpages);
    // // number of rendered pages
    //console.log(data.numrender);
    // // PDF info
    // console.log(data.info);
    // // PDF metadata
    // console.log(data.metadata);
    // // PDF.js version
    // // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // PDF text
  // console.log(data.text);

});
