var wiki = require('./index.js');

// GET A RANDOM PAGE FROM WIKIPEDIA - /PAGE/RANDOM/{FORMAT}
wiki.fetch({
    section: 'page',
    type: 'random',
    format: 'title', // title, html, summary, related, mobile-sections, mobile-sections-lead
    }, (data) => {
    console.log(data);
});

// GET HTML FOR BASIC SEARCH TERM - /PAGE/HTML/{TITLE}
wiki.fetch({
    section: 'page',
    type: 'html',
    title: 'orlando fl',
    }, (data) => {
    console.log(data);
});

// GET HTML FOR BASIC SEARCH TERM - /PAGE/HTML/{TITLE}
wiki.fetch({
    section: 'page',
    type: 'html',
    title: 'orlando fl',
    }, (data) => {
    console.log(data);
});

// GET SUMMARY FOR BASIC SEARCH TERM - /PAGE/SUMMARY/{TITLE}
wiki.fetch({
    section: 'page',
    type: 'summary',
    title: 'orlando fl',
    }, (data) => {
    console.log(data);
});

// GET ALL NOTABLE BIRTHS ON A SPECIFIC DATE - /FEED/ONTHISDAY/EVENT/MONTH/DAY
wiki.fetch({
    section: 'feed', // 'page', 'data', 'feed', 'transform'
    type: 'onthisday', // 'title', 'summary', 'html', 'media', 'metadata', 'references', 'mobile-html', 'related', 'random', 'pdf', 'data-parsoid', 'lint', 'onthisday', 'segments'
    event: 'births', // 'births', 'all', 'selected', 'deaths', 'events', 'holidays'
    date: '06/21' // Month / Date - 06/11'
    }, (data) => {
    console.log(data);
});

// QUERY SINGLE WORD TERM - "ORLANDO"
wiki.fetch({query: '/page/summary/orlando'}, (data) => {
    console.log(data);
});

// QUERY MULTI WORD TERMS - "ORLANDO FL"
wiki.fetch({query: '/page/summary/orlando%20fl'}, (data) => {
    console.log(data);
});