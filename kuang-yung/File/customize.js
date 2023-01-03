function previewImg(tarObj) {
    $("#preview_mask").html(`<img src=${tarObj.src}/>`);
    $("body").css("overflow-y", "hidden");
    $("#preview_mask").css("display", "block");
}

function onImgError(tarObj) {
    var errMsg = document.createElement('span');
    errMsg.innerHTML = "無法預覽";
    tarObj.parentNode.replaceChild(errMsg, tarObj);
}

function closePreview() {
    $("#preview_mask").css("display", "none");
    $("body").css("overflow-y", "unset");
}