function cloneTemplate(context, templateID) {
    return context.getElementById(templateID).content.cloneNode(true);
}

function loadText(context, selector, value) {
    const element = context.querySelector(selector);
    element.innerText = value;
}