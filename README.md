# JSON Gridify
JSON Gridify is a library that generates table from raw data. Even nested json array and object can be converted.
Note: It uses JQuery. 

## General
Main function is 
```javascript
GRIDIFY.convertToTable(container, data, options)
```

### Parameters
+ container: the DOM element that table is written on
+ data: the rawdata that must be a valid JSON
+ options: the js object data that is used to generate table properly. It waits for some attributes: [Options](https://github.com/akkus12345/jsongridify"Options")

#### Options
+ title: tables title
+ buttons: a boolean value that shows helper buttons while true and vice versa
+ tableClass: add class to the table
+ labels: [Labels](https://github.com/akkus12345/jsongridify "Labels")

Example:
```javascript
options:{
  title: "Example Table",
  buttons: true,
  tableClass: "my-table",
  labels: {} // It will be shown on Labels part
}
```

#### Labels
 + label name: the name that refer to each attribute of real data
   + tag: appears as table head of the related attribute
   + modifier: converts data to a dom element or a modified text node
   + class: adds class to the related th and td elements
   + css: adds css style to the related th and td elements
   
Example:
```javascript
let exampleRawData = [{
  "id": 1,
  "name": "Jhon Doe",
  "gender": "M",
  "military": {
    "status": "D",
    "exempt": {
      "status": "F",
      "date": "2020-10-10"
    }
  },
  "isMaried": true
}];

let options = {
  labels: {
    id: {
      tag: "ID",
      classd: "d-none",
    },
    name: {
      tag: "Full Name",
      css: {
        color: "red",
      }
    },
    gender: {
      tag: "Gender",
      modifier: {
        M: "Male",
        F: "Female",
      }
    },
    military: { // nested 
      tag: "Militarial Status",
      status: {
        tag: "Status",
        modifier: {
          D: "Done",
          E: "Exempt",
        }
      },
      exempt: {
        status: {
          tag: "Status",
          modifier: {
            I: "Infinite",
            E: "Finite",
          }
        },
        date: {
          tag: "Exempt Date"
        }
      },
      isMaried: {
        tag: "Are You Married?",
        modifier: {
          true: "<input type='checkbox' checked disabled><label hidden>Married</label>",
          false: "<input type='checkbox' disabled><label hidden>Single</label>",
        },
      }
    }
  }
};
```
