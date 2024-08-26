const errorCatchingWrapper = require('../middlewares/errorCatchingWrapper');
const Doc = require('../models/DocumentModel');
const User = require('../models/UserModel');
const Workspace = require('../models/WorkspaceModel');

const uploadDoc = errorCatchingWrapper(async (req, res, next) => {
  const workspace = await Workspace.findById(req.body.workspaceID);
  const owner = await User.findById(req.userCredentials._id);
  const newDoc = new Doc({ ownerID: owner._id, workspaceID: workspace._id });
  newDoc.docName = req.file.filename;
  newDoc.docType = req.file.mimetype;
  newDoc.destination = req.file.path;
  newDoc.docPath = req.file.path;
  const createdDoc = await newDoc.save();
  owner.docsIDs.push(createdDoc._id);
  await owner.save();
  workspace.DocsIDs.push(createdDoc._id);
  await workspace.save();
  res.status(201).json(createdDoc);
});

const downloadDoc = errorCatchingWrapper(async (req, res, next) => {
  const docID = req.params.docID;
  const doc = await Doc.findById(docID);
  res.status(200).download(doc.destination, doc.docName);
});

module.exports = { uploadDoc, downloadDoc };