const Application = require('../models/application');
const user = require('../models/user');

module.exports.getUserStats = async (req, res) => {
    const reqUser = await user.findOne({ username: req.user.username });

    const totalApps = await Application.countDocuments({ owner: reqUser._id })
    const acceptedApps = await Application.countDocuments({status:'Accepted', owner: reqUser._id});
    const interviewingApps = await Application.countDocuments({status:'Interviewing', owner: reqUser._id});
    const activeApps = await Application.countDocuments({status:'Active', owner: reqUser._id});
    const rejectedApps = await Application.countDocuments({status:'Rejected', owner: reqUser._id});
    return res.status(201).json( {message: 'Utility values returned'} );
}