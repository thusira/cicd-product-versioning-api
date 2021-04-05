var express = require('express');
var router = express.Router();


// router.get('/tasks', function (req, res, next) {
//     db.tasks.find(function (err, tasks) {
//         if (err) {
//             res.send(err);
//         }
//         res.json(tasks);
//     });
// });

// router.get('/task/:id', function (req, res, next) {
//     db.tasks.findOne({ _id: mongojs.ObjectID(req.params.id) }, function (err, task) {
//         if (err) {
//             res.send(err);
//         }
//         res.json(task);
//     });
// });

// router.post('/task', function (req, res, next) {
//     var task = req.body;
//     if (!task.title || (task.isDone + '')) {
//         res.status(400);
//         res.json({ "error": "Bad Data" });
//     } else {
//         db.tasks.save(task, function (err, task) {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(task);
//         });
//     }

// });

// router.delete('/task/:id', function (req, res, next) {
//     db.tasks.remove({ _id: mongojs.ObjectID(req.params.id) }, function (err, task) {
//         if (err) {
//             res.send(err);
//         }
//         res.json(task);
//     });
// });

// router.put('/task/:id', function (req, res, next) {
//     var task = req.body;
//     var updatedTask = {};

//     if (task.isDone) {
//         updatedTask.isDone = task.isDone;
//     }
//     if (task.title) {
//         updatedTask.title = task.title;
//     }
//     if (!updatedTask) {
//         res.status(400);
//         res.json({ "error": "Bad Data" });
//     } else {
//         db.tasks.update({ _id: mongojs.ObjectID(req.params.id) }, updatedTask, {}, function (err, task) {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(task);
//         });
//     }

// });

module.exports = router;