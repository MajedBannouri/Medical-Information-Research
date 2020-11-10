# Wiki-Page
### A straightforward and lightweight Node.js module for accessing Wikimedia content using the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/#/Page%20content)



### Install using the node.js package manager npm:
`$ npm install wiki-page`



## Examples: 
* Demos of the module are located in: [./test](test.js)
* Also, the [Wikipedia REST API documentation](https://en.wikipedia.org/api/rest_v1/#/Page%20content) contains some working examples



# Usage
## Require Module and Initialize Client
`var wiki = require('wiki-page');`



## Wiki fetch - [EXAMPLES](test.js)
`wiki.get({params}, callback)`
```
wiki.fetch({
    section: 'page',
    type: 'summary',
    title: 'orlando fl',
    }, (data) => {
    console.log(data);
});
```

## params {Object} Documentation - Please see the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/#/Page%20content) for full list of endpoints
* `section`: The section type in the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/#/Page%20content) - `'page', 'data', 'feed', 'transform', etc.`
* `type`: The content type - `'pdf', 'title', 'summary', 'html', 'media', 'metadata', 'references', 'mobile-html', 'related', 'random', 'pdf', 'data-parsoid', 'lint', 'onthisday', 'segments'`
* `title`: The subject of the returned content - `'calico cat', 'german shepard' or 'ford falcon'`
* `event`: For use in endpoints that require and event type - `'births', 'all', 'selected', 'deaths', 'events', 'holidays'`
* `revision`: For use in endpoints that require a revision number - `'3606853'`
* `date`: For use in endpoints that require a date - `'06/11' or '2012/05/12'`
* `format`: For use in endpoints that require a format - `'title', 'html', 'summary', 'related', 'mobile-sections', 'mobile-sections-lead'`



## Alternatively you can use the complete endpoint provided in the [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/#/Page%20content) - [EXAMPLES](test.js)
`wiki.fetch({endpoint}, callback)`
```
wiki.fetch({query: '/page/summary/orlando'}, (data) => {
    console.log(data);
});
```


## Testing
Clone the repo and run the `test.js` file using `$ node test`

```
$ git clone git://github.com/waltir/wiki-page.git
$ cd wiki-page
$ npm install
$ node test
```