var steem = require('steem');
var fs = require('fs');

function updateSteemArticles(username) {
  steem.api.getDiscussionsByBlog({limit:100, tag:username}, function(err, result) {
    for (var i = 0; i < result.length; i++) {
      const { title, body, category, author, permlink, created, json_metadata } = result[i];
      if (result[i].author == username || hexo.config.steem_resteems) {
        const tags = JSON.parse(json_metadata).tags || [];
        const date = new Date(`${created}Z`);
        const content = body.replace(/\|/g, '|').replace(/%/g, '％').replace(/{/g, '｛').replace(/}/g, '｝');
        // let t = title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“');//.replace(/\[|\]|:|-|#|\(|\)|\'/g, '').replace('?', '').replace('?', '');
        // console.log(t, tags);
        var file_name = '/Users/pravda/Library/Mobile\ Documents/com\~apple\~CloudDocs/HexoBlog/source/_posts/_steemit/' + `${created.replace('T', '-')}-${category}` + '.md';
        fs.stat(file_name, function(err) {
            if (!err) {
                console.log('file or directory exists');
            }
            else if (err.code === 'ENOENT') {
                console.log(file_name);
                hexo.post.create({
                  path: '_steemit/' + `${created.replace('T', '-')}-${category}`,
                  title: title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“'),
                  content,
                  date,
                  category: 'Uncategorized',
                  tags,
                  author,
                }, true)
            }
        });
      }
    }
  });
}

if (hexo.config.steem_users) {
  for (var i = 0; i < hexo.config.steem_users.length; i++) {
    updateSteemArticles(hexo.config.steem_users[i])
  }
} else {
  console.log('No steem usernames found, please add to the _config.yml')
}
