function EZcsv2json(csvString) {
    if (csvString === undefined) {
        throw ('You must give the csv\'s string as parameter')
    }
    else if (!csvString) {
        throw ('Your file is empthy')
    }
    var splittedByBack = csvString.split('\n');
    var obj = {};
    var resultats = [];
    var tmp = null;

    var headers = splittedByBack[0].split(',');

    for (var i = 1; i < splittedByBack.length; i++) {
        if (splittedByBack[i]) {
            obj = {};
            tmp = splittedByBack[i].split(',');

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = tmp[j]
            }
            resultats.push(obj)
        }
    }
    return resultats;
}
