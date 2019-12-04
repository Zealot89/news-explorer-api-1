const Article = require("../models/article");

module.exports.getArticles = (req, res) => {
  Article.find({})
    .then(article => res.send({
      data: article
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }));
};

module.exports.postArticle = (req, res) => {
  const {
    keyword,
    text,
    date,
    source,
    link,
    image
  } = req.body;
  const owner = req.user;
  Article.create({
      keyword,
      text,
      date,
      source,
      link,
      image,
      owner
    })
    .then(article => res.send({
      data: article
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }));
};

module.exports.deleteArticle = (req, res) => {
  const curent_user = req.user._id;

  Article.findById(req.params.id, function (err, article) {
    if (err) return res.status(500).send("There was a problem deleting the article.");
    console.log(req.params.id);
    const owner = article.owner.toString();

    if (curent_user === owner) {
      Article.findByIdAndRemove(req.params.id)
        .then(articles => res.status(200).send("Article deleted"))
        .catch(err => res.status(500).send("User not authorized to delete this article"));
    } else {
      res.status(401).send("User not authorized to delete this article");
    }
  });
};