// server.js

// 各パッケージの読み込み
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
// DBへの接続
const mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/jsonAPI');
// 各モデルの宣言
var User         = require('./app/models/user');
var Follows      = require('./app/models/follows');
// POSTでdataを受け取る
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// portの指定
const port = process.env.PORT || 3000;
// express
const router = express.Router();

router.use(function(req, res, next) {
    console.log('Connecting...');
    next();
});

// GET http://localhost:3000/api
router.get('/', function(req, res) {
    res.json({ message: 'Successfully.' });
});

// /users
// ---------------------------------------------------- //
router.route('/users')
// ユーザ作成 
// POST http://localhost:3000/api/users
    .post(function(req, res) {
        // 新しいユーザのモデルを作成する．
        let user = new User();
        user.user_id = req.body.user_id;
        user.name = req.body.name;
        user.age = req.body.age;
        user.job = req.body.job;
        // ユーザ情報をセーブ．
        user.save(function(err) {
          console.log('save.');
            if (err)
                res.send(err);
            res.json({ message: 'User created!' });
        });
    })
// 全てのユーザを取得
// GET http://localhost:3000/api/users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// /users/:user_id
// ---------------------------------------------------- //
router.route('/users/:id')
// 1人のユーザを取得
// GET http://localhost:3000/api/users/:id
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        User.findById(req.params.id, function(err, user) {
            let resObj = {};
            if (err)
                res.send(err);
            res.json(user);
            // user情報とfollowers情報をまとめる
            // resObj['user'] = user;
            // Follows.find({
            //   user_id: req.params.user_id,
            // }, function(err, followers) {
            //     if (err)
            //         res.send(err);
            //     resObj['followers'] = followers;
            //     res.json(resObj);
            // });
        });
    })
// 1人のユーザの情報を更新
// PUT http://localhost:3000/api/users/:id
    .put(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err)
                res.send(err);
            user.user_id = req.body.user_id;
            user.name = req.body.name;
            user.age = req.body.age;
            user.job = req.body.job;
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })
// 1人のユーザの情報を削除
// DELETE http://localhost:3000/api/users/:user_id
    .delete(function(req, res) {
        User.remove({
          _id: req.params.id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

// /followers
// ---------------------------------------------------- //
router.route('/followers')
// フォロー情報作成
// POST http://localhost:3000/api/followers)
  .post(function(req, res) {
      // モデルを作成．
      let follows = new Follows();
      follows.user_id = req.body.user_id;
      follows.follow_id = req.body.follow_id;
      // すでに登録されていないかを確認
      Follows.count({
        user_id: req.body.user_id,
        follow_id: req.body.follow_id,
      }, function(err, count) {
          if (err){
              res.send(err);
          }else if(count===0){
            // セーブする．
            follows.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Followers created!' });
            });
          }else{
            res.json({ message: 'It has already been registered' });
          }
      });
  })
// 全てのフォロー情報を取得
// GET http://localhost:3000/api/follows
  .get(function(req, res) {
    Follows.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
  });


// /followers/:user_id
// ---------------------------------------------------- //
router.route('/followers/:user_id')
// ユーザ1人のフォロー情報を取得
// GET http://localhost:3000/api/followers/:user_id
    .get(function(req, res) {
        Follows.find({
          user_id: req.params.user_id,
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });

// /account/:id
// ---------------------------------------------------- //
router.route('/account/:id')
// 1人のユーザ情報とフォローワー情報を取得
// GET http://localhost:3000/api/account/:id
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        User.findById(req.params.id, function(err, user) {
            let resObj = {};
            if (err)
                res.send(err);
            // user情報とfollowers情報をまとめる
            resObj['user'] = user;
            Follows.find({
              user_id: req.params.user_id,
            }, function(err, followers) {
                if (err)
                    res.send(err);
                resObj['followers'] = followers;
                res.json(resObj);
            });
        });
    });

// ルーティング登録
app.use('/api', router);
//サーバ起動
app.listen(port);
console.log('listen on port ' + port);