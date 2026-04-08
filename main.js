var container;
var rawData;

var currentList = null;
var elements = [];

class Element {
    constructor(keyword) {
        this.keyword = keyword;
        elements.push(this)
    }

    draw(data) {}

    get_string_from(data) {
        let str = data.slice(this.keyword.length + 1);
        return str;
    }
}

class Paragraph extends Element {
    draw(data) {
        let p = document.createElement("p");
        p.innerHTML = this.get_string_from(data);
        container.appendChild(p);
    }
}

class List extends Element {
    constructor(data, html) {
        super(data);
        this.html = html;
    }

    draw(data) {
        currentList = document.createElement(this.html);
        container.appendChild(currentList);
    }
}

class ListItem extends Element {
    draw(data) {
        let li = document.createElement("li");
        li.innerHTML = this.get_string_from(data);
        currentList.appendChild(li);
    }
}

class ImageData {
    constructor(src) {
        this.src = src;
    }

    get_src() {
        return "res/" + this.src
    }

    get_alt() {
        return "Slika: " + this.src; 
    }

    to_tag() {
        let image = document.createElement("img");
        image.src = this.get_src();
        image.alt = this.get_alt();
        return image;
    }
}

class Image extends Element {
    draw(data) {
        var image_data = this.get_data(data);
        let image = image_data.to_tag();
        container.appendChild(image);
    }

    get_data(data) {
        let array = data.split(' ');
        return new ImageData(array[1]);
    } 
}

class Link extends Element {
    draw(data) {
        let array = data.split(' ');
        let a = document.createElement("a");
        a.href = array[1];
        array.splice(0, 2);
        a.innerHTML = array.join(' ');
        container.appendChild(a);
    } 
}

new Paragraph("PARA");
new List("LIST", "ul");
new List("NUMBER", "ol");
new ListItem("ITEM");
new Image("IMAGE");
new Link("LINK");

function parseLine(rawLine) {
    for (let el of elements) {
        if (rawLine.startsWith(el.keyword)) {
            el.draw(rawLine);
        }
    }
}

function parseData() {
    let lines = rawData.split('\n');

    lines.forEach(function(lineText) {
        let rawLine = lineText.trim();
        parseLine(rawLine);
    });
}

function loadData(src) {
    window.lessonData = "";
    rawData = "";

    let script = document.createElement("script");
    script.src = src;

    script.onload = function () {
        rawData = window.lessonData.trim();
        parseData();
    };

    document.head.appendChild(script);
}

function loadPage(filename) {
    container.innerHTML = "";
    loadData(`data/${filename}.js`);
}

window.onload = function() {
    container = document.getElementById("output-container");
}

window.addEventListener("load", () => {
    if (!window.location.hash) {
        window.location.replace("#main"); 
    } else {
        loadPage(window.location.hash.substring(1));
    }
});

window.addEventListener("hashchange", () => {
    const pageId = window.location.hash.substring(1) || "main";
    loadPage(pageId);
});
