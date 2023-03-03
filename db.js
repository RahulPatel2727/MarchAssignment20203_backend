const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const myApp = express();
myApp.use(bodyParser.urlencoded({ extended: true }));
myApp.use(methodOverride('_method'));
myApp.set('view engine', 'ejs');
myApp.use(methodOverride('_method'));
mongoose.connect('mongodb://127.0.0.1:27017/collection',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("connection open"))
.catch((err)=>console.log("connection failed"))
const myArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const MyArticle = mongoose.model('MyArticle', myArticleSchema);
myApp.get('/', async (req, res) => {
  const myArticles = await MyArticle.find().sort('-createdAt');
  res.render('index', { myArticles });
});
myApp.get('/articles/new', (req, res) => {
  res.render('new');
});
myApp.post('/articles', async (req, res) => {
  const { title, content } = req.body;
  const myArticle = new MyArticle({ title, content });
  await myArticle.save();
  res.redirect('/');
});
myApp.get('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const myArticle = await MyArticle.findById(id);
  res.render('show', { myArticle });
});
myApp.get('/articles/:id/edit', async (req, res) => {
  const { id } = req.params;
  const myArticle = await MyArticle.findById(id);
  res.render('edit', { myArticle });
});
myApp.patch('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const myArticle = await MyArticle.findByIdAndUpdate(id, { title, content }, { new: true });
  res.redirect(`/articles/${myArticle.id}`);
});
myApp.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  await MyArticle.findByIdAndDelete(id);
  res.redirect('/');
});
const myPORT = process.env.PORT || 3000;
myApp.listen(myPORT, () => console.log(`Server started on port ${myPORT}`));
