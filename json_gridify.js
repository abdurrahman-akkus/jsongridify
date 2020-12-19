var LABELS = {};

let GRIDIFY = {
  /**
   * @param  {string} container - table container selector
   * @param  {string} data - table data
   * @param  {string} labels - table heads
   * @return {Promise}   
   * LABELS = {
   * id: {
   * tag: "Name",
   * modifier: {
   *   data:"Converted Data"
   * },
   * class: "Class Name",
   * css: {
   *   styleName: "Style Value",
   * },
   * }, 
   * };
   */
  convertToTable: (container, data, options) => {
    LABELS = options.labels;
    let title = "<h2 class='text-center'>" + options.title + "</h2>";
    let buttons = options.buttons ? getButtons() : "";
    let htmlTags = "";
    data = gridify(data, htmlTags, "", options.tableClass); // data conversion
    data == "" ?
      $(container).html(
        title +
        "<div class='alert alert-warning'>Gösterilecek Hiç Bir Şonuç Bulunamadı!</div>"
      ) :
      $(container).html(title + buttons + data);
    cssRender(container);
  }
}

function getByRealPath(data, path) {
  let pathArr = path.split("-");
  let result = data;
  for (p of pathArr) {
    result = result[p];
  }
  return result;
}

function setByRealPath(data, path) {
  let pathArr = path.split("-");
  let elm = data;
  for (p of pathArr) {
    if (data[p] === undefined) data[p] = {};
    elm = data;
  }
}

function cssRender(container) {
  $(container + " [gridify-title]").each(function(index, el) {
    let result = getByRealPath(LABELS, $(el).attr("gridify-title"));
    if (result !== undefined) {
      if (result.tag !== undefined) $(el).html(result.tag);
      if (result.css !== undefined) $(el).css(result.css);
      if (result.class !== undefined) $(el).addClass(result.class);
    }
  });
  $(container + " [gridify-content]").each(function(index, el) {
    let result = getByRealPath(LABELS, $(el).attr("gridify-content"));
    if (result !== undefined) {
      if (result.css !== undefined) $(el).css(result.css);
      if (result.modifier !== undefined)
        $(el).html(result.modifier[$(el).text()]);
      if (result.class !== undefined) $(el).addClass(result.class);
    }
  });
}

function gridify(data, htmlTags, parent, tableClass) {
  let tip = typeof data;
  parent = (parent == "") ? parent : parent.charAt(parent.length - 1) == "-" ? parent : parent + "-";
  if (isENUZ(data)) {
    //Eğer veri yoksa, boşsa, undefined ise boş döner
    return "";
  } else if (isPrimitive(tip)) {
    //Eğer veri primitive bir değer ise tek değer döner
    return "<td gridify-content='" + parent + "'>" + data + "</td>";
  } else if (Array.isArray(data)) {
    //Eğer veri bir dizi ise
    if (parent != "") {
      htmlTags += createButton();
      htmlTags +=
        "<table class='" + tableClass + " gridify-table' style='display:none;'>"; //table table-striped
    } else {
      htmlTags +=
        "<table class='" + tableClass + " gridify-table data-table'>";
    }
    if (
      typeof data[0] == "object" &&
      !isENUZ(data[0]) &&
      !isPrimitive(data[0]) &&
      !Array.isArray(data[0])
    ) {
      htmlTags += "<thead><tr>";
      for (d in data[0]) {
        htmlTags += "<th gridify-title='" + parent + d + "'>" + d + "</th>";
      }
      htmlTags += "</tr></thead>";
    }
    htmlTags += "<tbody>";
    for (d in data) {
      htmlTags += "<tr>";
      if (isPrimitive(typeof data[d]) || isENUZ(data[d])) {
        htmlTags += "<td gridify-content='" + parent + "'>" + data[d] + "</td>";
      } else {
        htmlTags += gridify(data[d], "", parent);
      }
      htmlTags += "</tr>";
    }
    htmlTags += "</tbody></table>";
    return htmlTags;
  } else {
    //Eğer veri kesinlikle bir object ise
    if (
      typeof parent == "object" &&
      !Array.isArray(parent) &&
      !isENUZ(parent)
    ) {
      htmlTags += createButton();
      htmlTags +=
        "<table class='" + tableClass + " gridify-table' style='display:none;'><thead><tr>";
      for (d in data) {
        htmlTags += "<th gridify-title='" + parent + d + "'>" + d + "</th>";
      }
      htmlTags += "</tr></thead><tbody><tr>";
      for (d in data) {
        if (isPrimitive(typeof data[d]) || isENUZ(data[d])) {
          htmlTags += "<td gridify-content='" + parent + d + "'>" + data[d] + "</td>";
        } else {
          htmlTags += "<td>" + gridify(data[d], "", parent + d) + "</td>";
        }
      }
      htmlTags += "</tr></tbody></table>";
    } else {
      for (d in data) {
        if (isPrimitive(typeof data[d]) || isENUZ(data[d])) {
          htmlTags += "<td gridify-content='" + parent + d + "'>" + data[d] + "</td>";
        } else htmlTags += "<td>" + gridify(data[d], "", parent + d) + "</td>";
      }
    }
    return htmlTags;
  }
}

function isPrimitive(tip) {
  return (
    tip == "number" ||
    tip == "string" ||
    tip == "bigint" ||
    tip == "symbol" ||
    tip == "boolean"
  );
}

function isENUZ(data) {
  return data == "" || data == null || data == undefined || data.length == 0;
}

function createButton() {
  return "<button class='btn btn-sm table-toggler' onclick='toggleTable($(this))'>[+]</button>";
}

function getButtons() {
  return "<button class='btn btn-primary' onclick='expandAll()'>[-] Genişlet</button>" +
    "<button class='btn btn-primary' onclick='collapseAll()'>[+] Daralt</button>";
}

function toggleTable(argument) {
  argument.siblings("table").toggle("fast", function() {
    argument.text() == "[-]" ? argument.text("[+]") : argument.text("[-]");
  });
}

function collapse(argument) {
  argument.siblings("table").hide("fast", function() {
    argument.text("[+]");
  });
}

function expand(argument) {
  argument.siblings("table").show("fast", function() {
    argument.text("[-]");
  });
}

function collapseAll() {
  $(".gridify-table tr:visible table").hide("fast", function() {
    $(".table-toggler").text("[+]");
  });
}

function expandAll() {
  $(".gridify-table tr:visible table").show("fast", function() {
    $(".table-toggler").text("[-]");
  });
}


// TODO Bu fonk. tablodan veriye geri dönmeyi sağlayacak. Geçici olarka askıya aldık.
function getDataFromGridify(param) {
  let data = {};
  $(param)
    .parent("[gridify-content]")
    .siblings("[gridify-content]")
    .each((index, el) => {
      let parent = $(el).attr("gridify-title");
      nestedTable = $(el).find(".gridify-table");
      if (nestedTable.length > 0) {
        if (nestedTable.find("thead").length == 0) {
          let arr = [];
          nestedTable.find("td").each((i1, e1) => arr.push($(el1).text));
          data[parent] = arr;
        } else {
          if (nestedTable.find("tbody").length == 1) {
            let obj = {};
            nestedTable.find("tbody td").each((i1, e1) => {
              obj[parent][$(el1).attr("gridify-title")] = $(el1).text();
            });
            data[parent] = obj;
          } else {}
        }
      } else data[parent] = $(el).text();
      //setByRealPath(data, $(el).attr("gridify-title"));
    });
  return data;
}
