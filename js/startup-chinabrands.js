var hostname = "https://wooshark.website";





function getImages(imagesBlock) {
    return imagesBlock;

}



function buildNameListValues(variations, wharehouses) {
    var colorValues = [];
    var sizeValues = [];

    variations.forEach(function(item, index) {
        if (item.color) {
            colorValues.push(item.color);
        }

        if (item.size) {
            sizeValues.push(item.size);
        }
    });

    var attribuesNamesAndValues = [];
    if (colorValues.length) {
        attribuesNamesAndValues.push({
            name: "color",
            value: colorValues
        });
    }

    if (sizeValues.length) {
        attribuesNamesAndValues.push({
            name: "size",
            value: sizeValues
        });
    }

    if (wharehouses && wharehouses.length && wharehouses[0]) {
        attribuesNamesAndValues.push({
            name: "warehouse",
            value: wharehouses
        });
    }

    return attribuesNamesAndValues;
}



function getAttrValues(item) {
    var values = [];
    item.skuPropertyValues.forEach(function(item) {

        values.push(item.propertyValueDisplayName);

    });
    console.log('values', values);
    return values;
}




function getAttributesVariations(skuPropIds, productSKUPropertyList) {
    var attributesVariations = [];
    var attributesIds = skuPropIds.split(",");
    for (var i = 0; i < attributesIds.length; i++) {
        productSKUPropertyList.forEach(function(item) {
            item.skuPropertyValues.forEach(function(element) {
                if (attributesIds[i] == element.propertyValueId) {
                    attributesVariations.push({
                        name: item.skuPropertyName,
                        value: element.propertyValueDisplayName,
                        image: element.skuPropertyImagePath
                    });
                }
            });

        });
    }
    return attributesVariations;
}



function getItemSpecificfromTable(globalvariation, itemSpec) {
    var trs = itemSpec;
    var attributesFromVariations = globalvariation.NameValueList.map(function(item) {
        return item.name;
    });

    if (trs && trs.length) {
        trs.forEach(function(item, index) {
            if (index) {
                if (attributesFromVariations.indexOf(item.attrName) == -1) {
                    globalvariation.NameValueList.push({
                        name: item.attrName || '-',
                        visible: true,
                        variation: false,
                        value: [item.attrValue]
                    })
                }
            }
        });
    }
    return globalvariation;
}




globalBulkCount = 0;



function handleServerResponse(responseCode, title, data) {


    // var responseWoocomerce = response.status;

    if (responseCode === 200) {
        incrementAllowedImport();

        try {

            displayToast('Product ' + title + '  imported successfully', 'green');
        } catch (e) {
            displayToast('exception during import', 'red');
        }

        jQuery('.loader2').css({
            "display": "none"
        });

    } else if (responseCode == 0) {
        // stopLoadingError();
        displayToast('Error establishing connection to server This can be caused by 1- Firewall block or filtering 2- An installed browser extension is mucking things', 'red');

        jQuery('.loader2').css({
            "display": "none"
        });
    } else if (responseCode == 500) {
        displayToast('The server encountered an unexpected condition which prevented it from fulfilling the request, please try again or inform us by email wooebayimporter@gmail.com', 'red');
        jQuery('.loader2').css({
            "display": "none"
        });
    } else if (responseCode == 413) {
        displayToast('The server is refusing to process a request because the request entity is larger than the server is willing or able to process. The server MAY close the connection to prevent the client from continuing the request.', 'red');
        jQuery('.loader2').css({
            "display": "none"
        });
    } else if (responseCode == 504) {
        displayToast('Gateway Timeout Error, the server, acting as a gateway, timed out waiting for another server to respond', 'red');
        jQuery('.loader2').css({
            "display": "none"
        });
    } else if (data) {

        displayToast(data, 'red');
        jQuery('.loader2').css({
            "display": "none"
        });


    } else {
        displayToast('Error while inserting the product', 'red');
        jQuery('.loader2').css({
            "display": "none"
        });
    }




}






let waitingListProducts = [];

function importProducts(chinabrandsProduct) {


    try {

        var website = jQuery('#website').val().trim();
        var key_client = jQuery('#key_client').val().trim();
        var sec_client = jQuery('#sec_client').val().trim();
    } catch {
        displayToast('Error while colleting connection details')
    }

    var statusCode;


    fetch(hostname + ":8002/wordpress", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            aliExpressProduct: chinabrandsProduct,
            isVariationImage: true,
            isPublish: true,
            clientWebsite: website,
            clientKey: key_client,
            clientSecretKey: sec_client
        })
    }).then(response => {
        statusCode = response.status;
        return response.json()
    })




    .then(contents => {
        handleServerResponse(statusCode, chinabrandsProduct.title, contents.data);



    })

    .catch((r) => {
        displayToast('Cannot insert product into shop', 'red')
        jQuery('.loader2').css({
            "display": "none"
        });
    })

}



function getDescription(productUrl, callback) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = productUrl; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
        .then(response => response.text())
        .then(contents => {
            callback(contents)
        })
        .catch((r) => console.log(' -- - -' + r))
}


function getProductId(productUrl) {
    var indexStart = productUrl.indexOf('.html');
    var productIdSubstring = productUrl.substring(0, indexStart);
    var productId = productIdSubstring.match(/\d+/)[0];
    return productId;
}

function getWhareHouseName(value) {
    var whareHousMapping = {
        YB: "CN-1",
        ZQ01: "CN-5",
        ZQDZ01: "CN-7",
        FCYWHQ: "CN-8",
        SZXIAWAN: "CN-9",
        B2BREXIAOWH: "CN-11",
        HKB2BC: "HK-3",
        FXHKGCZY: "HK-4",
        FXLAWH: "US-1",
        FXLAWH2: "US-2",
        MXTJWH: "US-3",
        FXJFKGC: "US-4",
        USZYCB: "US-5",
        GBYKDFX: "UK-3",
        GBYKDFX2: "UK-4",
        RUFENXIAO: "RU-1",
        FXRUWJ: "RU-2",
        ESTJWH: "ES-1",
        AU4PXHXY: "AU-1",
        FREDCGC: "FR-1",
        FXCZBLG2: "	CZ-1"
    };
    return whareHousMapping[value] ? whareHousMapping[value] : whareHousMapping['YB'];
}

function getAttribVariations(item, whareH) {
    var attributesVariations = [];
    if (item.color) {
        attributesVariations.push({
            name: "color",
            value: item.color,
            image: item.original_img ? item.original_img[0] : ""
        });
    }

    if (item.size) {
        attributesVariations.push({
            name: "size",
            value: item.size
        });
    }

    if (whareH) {
        attributesVariations.push({
            name: "wharehouse",
            value: getWhareHouseName(whareH)
        });
    }

    return attributesVariations;
}


function buildProduct(productId, productUrlServer, callback) {
    // getChinBanrdsProductDetails(productId);

    var categories = [];
    jQuery(".categories input:checked").each(function() {
        categories.push(
            jQuery(this)
            .attr("value")
            .trim()
        );
    });

    if (productId) {
        var variations = getChinBanrdsProductDetails(productId, function(
            data
        ) {
            console.log("response-----", data);
            var imagesServer = [];
            var titleServer = "";
            var descriptionServer = "";
            var globalvariation = {
                variations: []
            };
            var wharehouses = [];
            if (data && data.msg && data.msg && data.msg.length) {
                data.msg.forEach(function(item, index) {
                    if (item.status) {
                        titleServer = item.title;
                        descriptionServer = item.goods_desc;
                        var OriginalImages = item.original_img.length ?
                            item.original_img :
                            item.desc_img;
                        OriginalImages.forEach(function(item) {

                            if (imagesServer.indexOf(item) == -1 && imagesServer.length < 10) {
                                imagesServer.push(item);
                            }
                        });

                        var varFromwebsite = item.warehouse_list;
                        if (varFromwebsite) {
                            var properties = Object.getOwnPropertyNames(
                                varFromwebsite
                            );
                            properties.forEach(function(element, index) {
                                if (element && wharehouses.indexOf(element) == -1) {
                                    wharehouses.push(getWhareHouseName(element));
                                }
                                // $('#priceVariationNotification').show();
                                // if(element.sku == message.data.msg.productId){
                                globalvariation.variations.push({
                                    identifier: item.sku,
                                    SKU: item.sku + getWhareHouseName(element),
                                    availQuantity: varFromwebsite[element].goods_number,
                                    salePrice: varFromwebsite[element].promote_price ||
                                        varFromwebsite[element].price,
                                    regularPrice: varFromwebsite[element].price,
                                    weight: item.volume_weight,
                                    attributesVariations: getAttribVariations(
                                        item,
                                        element
                                    )
                                });
                            });
                        }
                    }
                });
                // if (aliExpressVariations && aliExpressVariations[0]) {
                globalvariation.NameValueList = buildNameListValues(
                    data.msg,
                    wharehouses
                );

                var weight = "";
                var reviews = [];

                var variations = [];
                // if (data.variations) {
                variations = globalvariation;

                var chinabrands = {
                    variations: variations,
                    currentPrice: "",
                    originalPrice: "",
                    // itemSpec: itemSpec,
                    title: titleServer,
                    description: descriptionServer,
                    productUrl: productUrlServer,
                    reviews: reviews,
                    weight: weight.toString(),
                    productId: productId,
                    productCategoies: categories,
                    shortDescription: "",
                    importSalePrice: true,
                    totalAvailQuantity: 1,
                    images: imagesServer,
                    simpleSku: productId + 'P',
                    featured: true
                };
                console.log("chinabrands", chinabrands);

                callback(chinabrands);
            }
        });
    }
}




function getChinBanrdsProductDetails(productId, callback) {
    var xmlhttpToken = new XMLHttpRequest();
    xmlhttpToken.onreadystatechange = function() {
        if (xmlhttpToken.readyState == 4) {
            var responseWoocomerce = xmlhttpToken.status;
            if (responseWoocomerce === 200) {
                try {
                    var data = JSON.parse(xmlhttpToken.response).data;
                    // console.log('*********************', data);
                    // drawProductDEtails(data)
                    callback(data);
                } catch (e) {}
            } else if (responseWoocomerce === 500) {
                displayToast(
                    "error connecting to chinabrands api, please contact wooebayimporter@gmail.com, suject error token chinabrnds", 'red'
                );
                jQuery('.loader2').css({
                    "display": "none"
                });
            } else if (responseWoocomerce === 466) {
                displayToast(
                    "please reload the page and try again, if the issue persist, please contact wooebayimporter@gmail.com, suject error token chinabrnds", 'red'
                );
                jQuery('.loader2').css({
                    "display": "none",
                });
            } else {
                displayToast(
                    "Error while retrieving product details", 'red'
                );
                jQuery('.loader2').css({
                    "display": "none"
                });
            }
        }
    };

    xmlhttpToken.open(
        "POST",
        hostname + ":8002/getChinabrandsProductDetails",
        true
    );
    xmlhttpToken.setRequestHeader("Content-Type", "application/json");
    xmlhttpToken.send(JSON.stringify({ productId: productId }));
}





function insertProductIntoWaitingList(chinabrandsProduct, isDirectimport) {

    var xmlhttpMultipl = new XMLHttpRequest();
    xmlhttpMultipl.onreadystatechange = function() {
        handleServerResponse(xmlhttpMultipl, true);
    };


    var isVariationImage = false;

    xmlhttpMultipl.open("POST", hostName + ":8002/wordpress", true);
    xmlhttpMultipl.setRequestHeader(
        "Content-Type",
        "application/json"
    );
    xmlhttpMultipl.send(
        JSON.stringify({
            aliExpressProduct: chinabrandsProduct,
            isVariationImage: isVariationImage,
            isPublish: true,
            clientWebsite: clientWebsite,
            clientKey: clientKey,
            clientSecretKey: clientSecretKey
        })
    );

}

function getCurrentTotalImportItemsValues() {
    var totalImportItems = localStorage.getItem("totalImportItemsChinabrands");
    if (totalImportItems) {
        return parseInt(totalImportItems);
    } else {
        return 1;
    }
}

function incrementAllowedImport() {
    var newValue = getCurrentTotalImportItemsValues() + 1;
    localStorage.setItem("totalImportItemsChinabrands", newValue);
    console.log("------ totel imported item", newValue);
    // jQuery("#remaining").text("Imported products: " + newValue);
}

jQuery(document).on("click", "#importProductToShopBySkuChinabrands", function(event) {







    var productId = jQuery('#productSku').val();

    if (productId) {
        jQuery('.loader2').css({
            "display": "block",
            "background-color": "black"

        });
        if (getCurrentTotalImportItemsValues() < 25) {

            buildProduct(productId, "productUrl", function(ebayProduct) {
                importProducts(ebayProduct);
            });

        } else {

            jQuery(".loader2").css({
                display: "none"
            });

            displayToast(
                "You have reached the maximum number of products to import for this month using the free version. please upgrade to pro version",
                "red"
            );

            setTimeout(function() {
                window.open("https://www.wooshark.com/chinabrands");
            }, 3000);
        }

        // getChinBanrdsProductDetails(productId);
        // var productUrl = 'https://aliexpress.com/item/' + productId + '.html';
        // const proxyurl = "https://cors-anywhere.herokuapp.com/";
        // const url = productUrl; // site that doesn’t send Access-Control-*
        // fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
        //     .then(response => response.text())
        //     .then(contents => {
        //         console.log(contents);
        //         var $data = jQuery(contents)

        //         // prepareProductDetails($data, contents, productId, productUrl, []);
        //     })
        //     .catch(() => {
        //         console.log("Can’t access " + url + " response. Blocked by browser?")
        //         jQuery('.loader2').css({
        //             "display": "none"
        //         });
        //     })
    } else {
        displayToast('Cannot get product sku', 'red');
    }

})


function save_options(website, key_client, sec_client) {

    // var website = document.getElementsByClassName('website')[0].value.trim();

    // var key_client = document.getElementsByClassName('key_client')[0].value.trim();

    // var sec_client = document.getElementsByClassName('sec_client')[0].value.trim();

    if (website && key_client && sec_client) {
        localStorage.setItem('website', website);
        localStorage.setItem('key_client', key_client);
        localStorage.setItem('sec_client', sec_client);
    }
}

// document.addEventListener('DOMContentLoaded', restore_options);

jQuery(document).ready(function() {
    // jQuery("#not-connected").show();
    // jQuery("#connected").hide();
    jQuery('.nav-item a[id="pills-advanced-tab"]').html(
        jQuery('.nav-item a[id="pills-advanced-tab"]').text() +
        '<span   class="badge badge-light"> <i class="fas fa-star"></i> </span>'
    );

    jQuery("#remaining").text(
        "Imported products: " + localStorage.getItem("totalImportItems") || 1
    );

    restore_options();
});

function isNotConnected() {
    jQuery("#not-connected").show();
    jQuery("#connected").hide();
}

jQuery(document).on("click", ".product-page-item", function(event) {

    var pageNo = 1;
    var website, key_client, sec_client;

    website = localStorage.getItem("website");
    key_client = localStorage.getItem("key_client");
    sec_client = localStorage.getItem("sec_client");


    try {
        pageNo = parseInt(jQuery(this)[0].innerText);
        getAllProducts(website, key_client, sec_client, pageNo);
    } catch (e) {
        pageNo = 1;
        displayToast(
            "error while index selection, please contact wooshark, wooebayimporter@gmail.com",
            "red"
        );
    }
});




var numberOfPageBy20 = 0;

function getAllProducts(clientWebsite, clientKey, clientSecretKey, pageIndex) {
    // jQuery("#pagination").empty();
    // jQuery("#pagination").show();
    jQuery("#product-pagination").empty();

    var counterToUpdate = 0;
    var xhr = [];
    var percentageProgress = 0;
    var incrementPercentaage = 100 / numberOfPageBy20;
    var counter = numberOfPageBy20 + 1;

    var productsToUpdate = [];
    var xmlUpdateRequest = new XMLHttpRequest();
    xmlUpdateRequest.onreadystatechange = function() {
        if (this.readyState == 4) {
            var responseWoocomerce = this.status;

            if (responseWoocomerce === 200) {
                var Jsondata = JSON.parse(this.response);
                var data = Jsondata.data;
                if (data) {
                    // data.forEach(function(item) {
                    // productsToUpdate.push(item);
                    var table = jQuery("#products-wooshark");
                    table.find("tbody tr").remove();
                    data.forEach(function(item) {
                        counterToUpdate++;
                        var productUrl = item.meta_data.find(function(item) {
                            return item.key == "productUrl";
                        });
                        table.append(
                            "<tr>" +
                            "<td><img width='80px'  height='80px' src=" +
                            item.images[0].src +
                            "></img></td>" +
                            "<td>" +
                            item.sku +
                            "</td>" +
                            " <td>" +
                            item.name.substring(0, 50) +
                            "</td>" +
                            "<td>" +
                            item.price +
                            "</td>" +
                            "<td><button class='btn btn-primary' ><a style='color:white' href=" +
                            productUrl.value +
                            "  target='_blank'> Original product url </a></button></td></tr>"
                        );
                    });

                    // var numberOfPage = Math.round(data.length / 20);
                    if (numberOfPageBy20 > 12) {
                        numberOfPageBy20 = 12;
                    }
                    //
                    for (var i = 1; i < numberOfPageBy20; i++) {
                        jQuery(
                            ' <li id="product-page-' +
                            i +
                            '" class="product-page-item"><a class="page-link">' +
                            i +
                            "</a></li>"
                        ).appendTo("#product-pagination");
                    }

                    // jQuery('.nav-item a[id="pills-connect-products"]').html(
                    //     jQuery('.nav-item a[id="pills-connect-products"]').text() +
                    //     ('<span class="badge badge-light">' + counterToUpdate + "</span>")
                    // );
                }
            } else {
                displayToast("error while retrieving products", "red");
            }
        }
    };
    xmlUpdateRequest.open(
        "POST", hostname + ":8002/getProductToupdateWordpressPlugin",
        true
    );
    xmlUpdateRequest.setRequestHeader("Content-Type", "application/json");
    xmlUpdateRequest.send(
        JSON.stringify({
            page: pageIndex,
            perPage: 20,
            clientWebsite: clientWebsite,
            clientKey: clientKey,
            clientSecretKey: clientSecretKey
        })
    );
    // }
}
// function getAllProducts(clientWebsite, clientKey, clientSecretKey, pageIndex) {
//     var counterToUpdate = 0;
//     var xhr = [];
//     var percentageProgress = 0;
//     var incrementPercentaage = 100 / numberOfPageBy20;
//     var counter = numberOfPageBy20 + 1;

//     var productsToUpdate = [];
//     var xmlUpdateRequest = new XMLHttpRequest();
//     xmlUpdateRequest.onreadystatechange = function() {
//         if (this.readyState == 4) {
//             var responseWoocomerce = this.status;

//             if (responseWoocomerce === 200) {
//                 var Jsondata = JSON.parse(this.response);
//                 var data = Jsondata.data;
//                 if (data) {
//                     // data.forEach(function(item) {
//                     // productsToUpdate.push(item);
//                     var table = jQuery("#products-wooshark");
//                     table.find("tbody tr").remove();
//                     data.forEach(function(item) {
//                         counterToUpdate++;
//                         var productUrl = item.meta_data.find(function(item) {
//                             return item.key == "productUrl";
//                         });
//                         table.append(
//                             "<tr>" +
//                             "<td><img width='80px'  height='80px' src=" +
//                             item.images[0].src +
//                             "></img></td>" +
//                             "<td>" +
//                             item.sku +
//                             "</td>" +
//                             " <td>" +
//                             item.name.substring(0, 50) +
//                             "</td>" +
//                             "<td>" +
//                             item.salePrice +
//                             "</td>" +
//                             "<td><button class='btn btn-primary' ><a style='color:white' href=" +
//                             productUrl.value +
//                             "  target='_blank'> Original product url </a></button></td></tr>"
//                         );
//                     });

//                     // var numberOfPage = Math.round(data.length / 20);
//                     if (numberOfPageBy20 > 12) {
//                         numberOfPageBy20 = 12;
//                     }
//                     for (var i = 2; i < numberOfPageBy20; i++) {
//                         jQuery(
//                             ' <li id="product-page-' +
//                             i +
//                             '" class="product-page-item"><a class="page-link">' +
//                             i +
//                             "</a></li>"
//                         ).appendTo("#product-pagination");
//                     }

//                     jQuery('.nav-item a[id="pills-connect-products"]').html(
//                         jQuery('.nav-item a[id="pills-connect-products"]').text() +
//                         ('<span class="badge badge-light">' + counterToUpdate + "</span>")
//                     );
//                 }
//             } else {
//                 displayToast("error while retrieving products", "red");
//             }
//         }
//     };
//     xmlUpdateRequest.open(
//         "POST",
//         hostname + ":8002/getProductToupdateWordpressPlugin",
//         true
//     );
//     xmlUpdateRequest.setRequestHeader("Content-Type", "application/json");
//     xmlUpdateRequest.send(
//         JSON.stringify({
//             page: pageIndex,
//             perPage: 20,
//             clientWebsite: clientWebsite,
//             clientKey: clientKey,
//             clientSecretKey: clientSecretKey
//         })
//     );
//     // }
// }



function getNumberOfPage(clientWebsite, clientKey, clientSecretKey) {
    // startLoadingEffect();
    // productsToUpdate = [];
    var xmlhttpProduct = new XMLHttpRequest();
    xmlhttpProduct.onreadystatechange = function() {
        if (xmlhttpProduct.readyState == 4) {
            var responseWoocomerce = xmlhttpProduct.status;
            if (responseWoocomerce === 200) {
                var Jsondata = JSON.parse(xmlhttpProduct.response);
                numberOfPageBy20 = Jsondata.data;
                console.log("xxxxxxxxxxxxxxxxxxxx", numberOfPageBy20);
                getAllProducts(clientWebsite, clientKey, clientSecretKey, 1);
            } else {
                displayToast("Error while retrieving data from woocommerce", "red");
            }
        }
    };
    xmlhttpProduct.open("POST", hostname + ":8002/getNumberOfPages", true);
    xmlhttpProduct.setRequestHeader("Content-Type", "application/json");
    xmlhttpProduct.send(
        JSON.stringify({
            clientWebsite: clientWebsite,
            clientKey: clientKey,
            clientSecretKey: clientSecretKey
        })
    );
}



function connectToStore() {
    jQuery(".loader").css({
        display: "block",
        "background-color": "black"
    });

    var website = jQuery("#website")
        .val()
        .trim();
    var key_client = jQuery("#key_client")
        .val()
        .trim();
    var sec_client = jQuery("#sec_client")
        .val()
        .trim();

    save_options(website, key_client, sec_client);

    var xmlConnectToStore = new XMLHttpRequest();
    xmlConnectToStore.onreadystatechange = function() {
        if (xmlConnectToStore.readyState == 4) {
            // console.log(readBody(xmlConnect));
            var responseWoocomerce = xmlConnectToStore.status;
            if (responseWoocomerce === 200) {
                jQuery(".loader").css({
                    display: "none"
                });
                jQuery('.nav-item a[id="pills-connect-tab"]').css({
                    "background-color": "green"
                });
                jQuery('.nav-item a[id="pills-connect-tab"]').css({ color: "white" });

                jQuery("#not-connected").hide();
                jQuery("#connected").show();

                displayToast("Connected successfully", "green");
                jQuery("#isConnectedArea").css("background-color", "green");

                getNumberOfPage(website, key_client, sec_client);
                // getCategories(website, key_client, sec_client);
            } else if (responseWoocomerce === 0) {
                isNotConnected();
                displayToast(
                    "Error establishing connection to host " +
                    website +
                    " This can be caused by 1- Firewall block or filtering 2- An installed browser extension is mucking things, disable other chrome extensions one by one and try again 3- Installed plugin that prevent the connection to your host (security plugins, cache plugins, etc..",
                    "red"
                );

                jQuery("#isConnectedArea").css("background-color", "red");

                jQuery(".loader").css({
                    display: "none"
                });
            } else {
                isNotConnected();
                jQuery("#isConnectedArea").css("background-color", "red");

                if (
                    xmlConnectToStore.response &&
                    xmlConnectToStore.response &&
                    xmlConnectToStore.response.length > 13
                ) {
                    try {
                        var data = JSON.parse(xmlConnect.response).data;
                        displayToast(
                            "Error establishing connection to host " + website + "  " + data,
                            "red"
                        );
                    } catch (e) {
                        displayToast(
                            "Error establishing connection to host " + website,
                            "red"
                        );
                    }
                } else {
                    displayToast(
                        "Error establishing connection to host " +
                        website +
                        " wordpress url is not valid",
                        "red"
                    );

                    jQuery(".loader").css({
                        display: "none"
                    });
                }

                jQuery(".loader").css({
                    display: "none"
                });
            }
        }
    };

    xmlConnectToStore.open("POST", hostname + ":8002/authentification", true);
    xmlConnectToStore.setRequestHeader("Content-Type", "application/json");

    xmlConnectToStore.send(
        JSON.stringify({
            premuimExtension: false,
            clientWebsite: website,
            clientKey: key_client,
            clientSecretKey: sec_client,
            isPluginWordpress: true
        })
    );
}


function restore_options() {
    var website, key_client, sec_client;

    website = localStorage.getItem("website");
    key_client = localStorage.getItem("key_client");
    sec_client = localStorage.getItem("sec_client");

    document.getElementsByClassName("website")[0].value = website || "";
    document.getElementsByClassName("key_client")[0].value = key_client || "";
    document.getElementsByClassName("sec_client")[0].value = sec_client || "";
    if (website && key_client && sec_client) {
        connectToStore();
    } else {
        jQuery("#not-connected").show();
        jQuery("#connected").hide();

        jQuery('.nav-item a[id="pills-connect-tab"]').css({
            "background-color": "red"
        });
        jQuery('.nav-item a[id="pills-connect-tab"]').css({ color: "white" });
    }
}

function displayToast(data, color) {

    jQuery.toast({
        text: data,
        // It can be plain, fade or slide
        bgColor: 'white', // Background color for toast
        textColor: color, // text color
        hideAfter: 5000,
        stack: 5, // `false` to show one stack at a time count showing the number of toasts that can be shown at once
        textAlign: 'left', // Alignment of text i.e. left, right, center
        position: 'bottom-right' // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
    })

}





jQuery(document).on("click", "#connectToStore", function(event) {
    jQuery('.loader').css({
        "display": "block",
        "background-color": "black"

    });

    var website = jQuery('#website').val().trim();
    var key_client = jQuery('#key_client').val().trim();
    var sec_client = jQuery('#sec_client').val().trim();

    save_options(website, key_client, sec_client);



    var xmlConnect = new XMLHttpRequest();
    xmlConnect.onreadystatechange = function() {
        if (xmlConnect.readyState == 4) {
            // console.log(readBody(xmlConnect));
            var responseWoocomerce = xmlConnect.status;
            if (responseWoocomerce === 200) {
                jQuery('.loader').css({
                    "display": "none"
                });


                // window.open('https://www.aliexpress.com/', '_blank');
                displayToast('Connected successfully', 'green');
                jQuery('#isConnectedArea').css("background-color", "green");
                // getCategories(website, key_client, sec_client);


            } else if (responseWoocomerce === 0) {
                displayToast('Error establishing connection to host ' + website + ' This can be caused by 1- Firewall block or filtering 2- An installed browser extension is mucking things, disable other chrome extensions one by one and try again 3- Installed plugin that prevent the connection to your host (security plugins, cache plugins, etc..', 'red')

                jQuery('#isConnectedArea').css("background-color", "red");

                jQuery('.loader').css({
                    "display": "none"
                });

            } else {
                jQuery('#isConnectedArea').css("background-color", "red");

                if (xmlConnect.response && xmlConnect.response && xmlConnect.response.length > 13) {
                    try {
                        var data = JSON.parse(xmlConnect.response).data;
                        displayToast('Error establishing connection to host ' + website + '  ' + data, 'red');


                    } catch (e) {
                        displayToast('Error establishing connection to host ' + website, 'red');




                    }
                } else {

                    displayToast('Error establishing connection to host ' + website + ' wordpress url is not valid', 'red');

                    jQuery('.loader').css({
                        "display": "none"
                    });

                }



                jQuery('.loader').css({

                    "display": "none"

                });



            }

        }

    };

    xmlConnect.open("POST", hostname + ":8002/authentification", true);
    xmlConnect.setRequestHeader("Content-Type", "application/json");

    xmlConnect.send(JSON.stringify({
        premuimExtension: false,
        clientWebsite: website,
        clientKey: key_client,
        clientSecretKey: sec_client
    }));



})

jQuery(document).on("click", "#select-category", function(event) {
    if (jQuery(".categories").is(":hidden")) {
        jQuery(".categories").show();
        getCategories();
    } else {
        jQuery(".categories").hide();
    }
});

function getCategories(website, key_client, sec_client) {
    var website = jQuery("#website")
        .val()
        .trim();
    var key_client = jQuery("#key_client")
        .val()
        .trim();
    var sec_client = jQuery("#sec_client")
        .val()
        .trim();

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            var responseWoocomerce = xmlhttp.status;
            if (responseWoocomerce === 200) {
                var savedCategories = JSON.parse(xmlhttp.response).data;

                jQuery(".categories").empty();
                jQuery.each(savedCategories, function(key, val) {
                    var items = "";
                    items =
                        '<div class="checkbox">' +
                        '<label><input id="category' +
                        val.id +
                        '" type="checkbox" class="chk" value="' +
                        val.id +
                        ' "/>' +
                        val.name +
                        "</label>";
                    (" </div>");
                    jQuery(".categories").append(jQuery(items));
                });
            }
        }
    };

    // xmlhttp.send(JSON.stringify({ clientWebsite: clientWebsite, clientKey: clientKey, clientSecretKey: clientSecretKey }));

    xmlhttp.open("POST", hostname + ":8002/categories", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(
        JSON.stringify({
            clientWebsite: website,
            clientKey: key_client,
            clientSecretKey: sec_client
        })
    );
}