// json数据处理
var arr = [
    { id: "0", name: "0" },
    { id: "1", name: "1", parent: "0" },
    { id: "2", name: "2", parent: "0" },
    { id: "3", name: "3", parent: "1" },
    { id: "4", name: "4", },
    { id: "5", name: "5", parent: "3" },
    { id: "3", name: "3", parent: "5" }
];

function jsonParse(json) {
    var json = JSON.parse(JSON.stringify(json)),        //将json转为字符在转为js对象，避免修改到原json
        arr = [];

    //循环，将json里面的数据都添加到各自的父级，顶级对象
    for (var a = 0; a < json.length; a++) {
        if (json[a].parent) {
            for (var b = 0; b < json.length; b++) {
                // 筛选出对应子项添加到其父级对象的children中
                if (json[a].parent == json[b].id) {
                    if (!json[b].children) {
                        json[b].children = [];
                    }
                    json[b].children.push(json[a]);
                }
            }
        };
    };

    // 循环，将顶级对象添加到一个空白数组里面
    for (var i = 0; i < json.length; i++) {
        if (!json[i].parent) {
            arr.push(json[i]);
        };

    };

    return arr;
};

var end = jsonParse(arr);