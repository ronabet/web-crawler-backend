const utils = require('../utils/utils');

// Save the links of the startUrl in the cache
const getAllLinks = async (startUrl, index) => {
  this.cache = this.cache || {};
  if(this.cache[startUrl] && this.cache[startUrl][index])
    return this.cache[startUrl][index];
  this.cache[startUrl] = {...this.cache[startUrl], [index] : await utils.findLinks(startUrl, index)};
  return this.cache[startUrl][index];
};

// checks if the page doesn't have any links
const thereArentAnyLinks = async startUrl => ((await getAllLinks(startUrl, 0)) == null);

// checks if max pages or max depth has been exceeded
const iterationCheck = (maxDepth, maxPages) => async (links, currentDepth, currentPages) => {
  if(!(currentDepth < maxDepth && currentPages < maxPages && links.length > 0))
    return false;
  console.log(`currentPages : ${currentPages} , currentDepth : ${currentDepth}`);
  // crawl each url in this depth
  links = links.map((url) => {
    return getAllLinks(url, currentDepth);
  });

  const crawlData = await Promise.all(links);
  const crawlerOutput = crawlData.filter(Boolean).splice(0, maxPages - currentPages);

  links = [...crawlerOutput.map(({links}) => links)];

  return {links, currentPages: currentPages + crawlerOutput.length, currentDepth: currentDepth + 1, crawlerOutput };
};

// checks all the links and returns the final answer
const getAllResults = async (currentLinks, currentDepth, currentPages, checkCurrentLinks) => {
  let allResult = [];
  while(true){
    const result = await checkCurrentLinks(currentLinks, currentDepth, currentPages);
    if(!result)
      break;

    currentLinks = result.links;
    currentPages = result.currentPages;
    currentDepth = result.currentDepth;

    allResult = [...allResult, ...result.crawlerOutput];
  }

  return [...allResult];
}

// main function
exports.crawler = async (res, {startUrl, maxPages, maxDepth}) => {
  console.time('test');

  if(await thereArentAnyLinks(startUrl)){
    res.json({Error: "URL is not valid!"});
    return;
  }

  const checkCurrentLinks = iterationCheck(maxDepth, maxPages);

  let currentLinks = (await getAllLinks(startUrl, 0)).links;
  let currentDepth = 0;
  let currentPages = 0;

  const allResults = await getAllResults(currentLinks, currentDepth, currentPages, checkCurrentLinks);

  res.send(allResults);
  console.timeEnd('test')
};
