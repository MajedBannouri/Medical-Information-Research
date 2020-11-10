var request = require('request');
var qs = require('qs')

fetch = (params, callback) => {
    let prs = qs.parse(params);
    let query = {
        query: (prs.query !== undefined)? `${prs.query}` : '',
        section: (prs.section !== undefined)? `/${prs.section}` : '',
        type: (prs.type !== undefined)? `/${prs.type}` : '',
        event: (prs.event !== undefined)? `/${prs.event}` : '',
        title: (prs.title !== undefined)? `/${prs.title}` : '',
        revision: (prs.revision !== undefined)? `/${prs.revision}` : '',
        date: (prs.date !== undefined)? `/${prs.date}` : '',
        format: (prs.format !== undefined)? `/${prs.format}` : '',
    };
    let param = `${query.section + query.type + query.event + query.title + query.revision + query.date + query.format + query.query}`;
    request(`https://en.wikipedia.org/api/rest_v1${param}`, function (error, response, body) {
        if (!query.type.includes('html') && !query.type.includes('pdf')) {
            let data = JSON.parse(body)
            return callback(data)
        } else {
            return callback(body)
        }
    });
}
module.exports = { fetch }