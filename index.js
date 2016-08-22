var express = require('express');
var http = require('http');
var parser = require('xml2json');
var app = express();

const getContent = function(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
    });
};

app.get('/', function(req, res) {
    var tag = '';
    for (var i = 0; i <= 33; i++) {
        if (i <= 9) i = '0' + i;

        tag += '<a href="/'+i+'">Propinsi '+i+'</a><br />';
    }

    res.send(tag);
});

app.get('/:id', function(req, res) {
    var id = req.params.id;
    var res_data = '';
    getContent('http://data.bmkg.go.id/propinsi_'+id+'_2.xml')
    .then(function (data) {
        var jsonData = parser.toJson(data);
        res.type('application/json');
        res.send(jsonData);
    })
    .catch(function (err) {
        console.error(err);
    });
});

app.listen(8000);
console.log("Server running at http://127.0.0.1:8000/");
