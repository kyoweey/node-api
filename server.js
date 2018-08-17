// server.js

// 必要なパッケージの読み込み
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// DBへの接続
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/jsonAPI');

// モデルの宣言
var User       = require('./app/models/user');
var Follows       = require('./app/models/follows');

// POSTでdataを受け取るための記述
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3000番を指定
var port = process.env.PORT || 3000;

// expressでAPIサーバを使うための準備
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// 正しく実行出来るか左記にアクセスしてテストする (GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'Successfully Posted a test message.' });
});

// /users というルートを作成する．
// ----------------------------------------------------
router.route('/users')

// ユーザの作成 (POST http://localhost:3000/api/users)
    .post(function(req, res) {

        console.log(req.body);

        // 新しいユーザのモデルを作成する．
        var user = new User();

        // ユーザの各カラムの情報を取得する．
        user.user_id = req.body.user_id;
        user.name = req.body.name;
        user.age = req.body.age;
        user.job = req.body.job;

        console.log(user);

        // ユーザ情報をセーブする．
        user.save(function(err) {
          console.log('saveする');
            if (err)
                res.send(err);
            res.json({ message: 'User created!' });
        });
    })

// 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });



// /users/:user_id というルートを作成する．
// ----------------------------------------------------
router.route('/users/:user_id')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        User.find({user_id : req.params.user_id}, function(err, user) {

            let resObj = {};

            if (err)
                res.send(err);
            resObj['user'] = user;
            // res.json(user);
            Follows.find({
              user_id: req.params.user_id,
            }, function(err, followers) {
                if (err)
                    res.send(err);
                resObj['followers'] = followers;
                res.json(resObj);
            });
        });
    })
// 1人のユーザの情報を更新 (PUT http://localhost:3000/api/users/:user_id)
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            // ユーザの各カラムの情報を更新する．
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

// 1人のユーザの情報を削除 (DELETE http://localhost:3000/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
          user_id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });













    // /follows というルートを作成する．
// ----------------------------------------------------
router.route('/followers')

// ユーザの作成 (POST http://localhost:3000/api/follows)
  .post(function(req, res) {

      console.log(req.body);

      // 新しいユーザのモデルを作成する．
      var follows = new Follows();

      // ユーザの各カラムの情報を取得する．
      follows.user_id = req.body.user_id;
      follows.follow_id = req.body.follow_id;

      console.log('req')
      console.log(req.params);

      // db.users.count({user_id: {$exists: true}})
      Follows.count({
        user_id: req.body.user_id,
        follow_id: req.body.follow_id,
      }, function(err, count) {
        console.log('count:' + count);
          if (err){
              res.send(err);
          }else if(count===0){

            // ユーザ情報をセーブする．
            follows.save(function(err) {
              console.log('saveする');
                if (err)
                    res.send(err);
                res.json({ message: 'Follows created!' });
            });
          }else{
            res.json({ message: 'It has already been registered' });
          }

      });

  })

// 全てのユーザ一覧を取得 (GET http://localhost:8080/api/follows)
  .get(function(req, res) {
    Follows.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
  });


// /follows/:user_id というルートを作成する．
// ----------------------------------------------------
router.route('/followers/:user_id')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/follows/:user_id)
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        // MyModel.find({ name: 'john', age: { $gte: 18 }});
        Follows.find({
          user_id: req.params.user_id,
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
// 1人のユーザの情報を削除 (DELETE http://localhost:3000/api/users/:user_id)
.delete(function(req, res) {
  Follows.remove({
      _id: req.params.user_id
  }, function(err, user) {
      if (err)
          res.send(err);
      res.json({ message: 'Successfully deleted' });
  });
});



// ルーティング登録
app.use('/api', router);

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);