const {ObjectID} = require('mongodb');
const {isBoolean, pick} = require('lodash');
const moment = require('moment')

const {Todos} = require('./../../models/todo')

async function Update(id, data, creator){
  try{
    if (!ObjectID.isValid(id)){
      return {
        status: 400,
        message: 'Invalid Request Credentials'
      }
    }

    const body = pick(data,['activity', 'isDone']);
    if (body.isDone && isBoolean(body.isDone)){
      body.isDoneDate = Date.now();
    } else {
      body.isDone = false;
      body.isDoneDate = null;
    }

    const doc = await Todos.findOneAndUpdate({_id: id, 
      creator, 
      isDeleted: false},
      { $set: body },
      { new: true }
    );

    if (!doc){
      throw Error()
    } 
    if (doc.isDone === true){
      doc.durationCreatedAt = moment(doc.CreatedAt).calendar();
      doc.durationDoneAt = moment(doc.isDoneDate).calendar();
      return  {
        status: 200,
        message: doc
      };
    }
    doc.durationCreatedAt = moment(doc.CreatedAt).calendar();
    return  {
      status: 200,
      message: doc
    };
  } catch(e){
    return {
      status: 404,
      message: 'No Todo found or Todo has been deleted'
    }
  }
}

module.exports = {Update}