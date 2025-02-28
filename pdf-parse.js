const fs = require('fs');
const pdf = require('pdf-parse');

let pdfDataExtracted = [];
let page = 0;


function getDateIndex
(xposition) {
    if (parseFloat(xposition) > 364 && parseFloat(xposition) < 426) return 1;
    if (parseFloat(xposition) > 300 && parseFloat(xposition) < 364) return 0;
}

function parseItem(items) {
    let reportname;
    let dates = [];
    let aruanne = [];
    let isTabel = Boolean;
    for (let item of items) {

        if (item.str && item.str !== " ") {
            if ((item.str === "Bilanss" || item.str === "Kasumiaruanne") && parseInt(item.height) == 14) {
                isTabel = true;
                reportname = item.str;
            }
            if (isTabel == 1) {
                if (dates.length !== 2) {
                    if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 426) {
                        dates.push(item.str);
                    }
                }
                else if (dates.length == 2) {
                    if (parseFloat(item.transform[4]) < 300) {
                        let obj = { [item.str]: {} };
                        aruanne.push(obj);
                    }
                    else if (parseFloat(item.transform[4]) > 300 && parseFloat(item.transform[4]) < 426) {
                        let key = Object.values(aruanne[aruanne.length - 1])[0];
                        let date = dates[getDateIndex
                            (item.transform[4])];
                        let item_str = item.str;
                        //console.log(Object.keys(key));
                        key[date] = item_str;

                    }
                }

            }
            //console.log(item.transform);
        }

    }
    dates.length = 0;
    isTabel = false;
    return report = {
        [reportname]: aruanne
    };
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
        .then(function (textContent) {
            page += 1;
            if (page == 4 || page == 5) {
                pdfDataExtracted
            .push(parseItem(textContent.items));
                console.log(JSON.stringify(pdfDataExtracted
                , null, 2));
            }
        })

}



let options = {
    pagerender: render_page
}

let dataBuffer = fs.readFileSync('uploads/Aruanne_14058782.pdf');


pdf(dataBuffer, options).then(function (data) {
    

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
