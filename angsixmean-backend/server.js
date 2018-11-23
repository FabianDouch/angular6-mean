import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//importing the issue model/schema
import Issue from './models/Issue';

//setting up the express app
const app = express();
//this is what is returned from the express router
const router = express.Router();
//attaching the cors middleware to application
app.use(cors());

//attaching the bodyParser middleware in json format because that
//is the most likely format from requests
app.use(bodyParser.json());
//connecting to mongo database - @args contains a string/url to mongo db instance
mongoose.connect('mongodb://localhost:27017/issues');

//storing the mongo db connection
const connection = mongoose.connection;
//event listener, only occuring once
connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});
//this function is set up to retrieve all issues from db
//@args request, response
router.route('/issues').get((req, res) => {
  Issue.find((err, issues) => {
    if (err)
        console.log(err);
    else {
        res.json(issues);
      }
  })
});
//this function is set up to retrieve a specific issue from the db
//@args request, response
router.route('/issues/:id').get((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (err)
        console.log(err);
    else {
      res.json(issue);
    }
  })
});

//this function is set up to add new issues to database
//creates a new Issue schema then pass @args request, response
router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

//updating a current issue @args request, response
router.route('/issues/update/:id').post((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
      if (!issue)
          return next(new Error('Could not load document'));
      else {
          issue.title = req.body.title;
          issue.responsible = req.body.responsible;
          issue.description = req.body.description;
          issue.severity = req.body.severity;
          issue.status = req.body.status;

          issue.save().then(issue => {
            res.json('Update done');
          }).catch(err => {
            res.status(400).send('Update failed');
          });
      }
  })
});

router.route('/issues/delete/:id').get((req, res) => {
  Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
    if (err)
          res.json(err);
        else {
          res.json('Removed successfully');
        }
  })
})

//attaching router middleware
app.use('/', router);

app.listen(4000, () => console.log('Express server running on port 4000'));
