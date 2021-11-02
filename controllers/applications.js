const Application = require('../models/application');
const user = require('../models/user');

module.exports.index = async (req, res) => {
    const reqUser = await user.findOne({ username: req.query.username });

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword 
    ?   {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            },
        } 
    :   {}

    const count = await Application.countDocuments({ ... keyword });
    const applications = await Application.find({ ...keyword , owner: reqUser._id}).limit(pageSize).skip(pageSize * (page - 1));
    res.json({applications, page, pages: Math.ceil(count/pageSize) });
};


module.exports.newApplication = async (req, res, next) => {
    const {companyName, jobTitle, jobLocation, dateApplied, status, notes} = req.body;

    const application = new Application({
        companyName: companyName,
        jobTitle: jobTitle,
        jobLocation: jobLocation,
        dateApplied: dateApplied,
        status: status,
        notes: notes,
    });

    const reqUser = await user.findOne({ username: req.query.username });
    application.owner = reqUser._id;     
    await application.save();
    res.status(201).json( { application })
}

module.exports.displayApplication = async (req, res) => {
    const application = await Application.findById(req.params.id);

    if(!application){
        return res.status(404).json( {message: 'Application not found'} );
    } else {
            return res.status(200).json( application );
    }
};

module.exports.editApplication = async (req, res) => {
    const {companyName, jobTitle, jobLocation, dateApplied, status, notes} = req.body;

    const application = await Application.findById(req.params.id);

    if(application) {
        application.companyName=companyName;
        application.jobTitle=jobTitle;
        application.jobLocation=jobLocation;
        application.dateApplied=dateApplied;
        application.status=status;
        application.notes=notes;

        const updatedApplication = await application.save()
        res.status(201).json(updatedApplication);
    } else {
        res.status(404).json({ message: 'Product not found'});
    }
};

module.exports.deleteApplication = async (req, res) => {
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    return res.status(204).json( {message: 'Application deleted'} );
};

module.exports.getUserStats = async (req, res) => {
    const reqUser = await user.findOne({ username: req.query.username });

    const totalApps = await Application.countDocuments({ owner: reqUser._id })
    const acceptedApps = await Application.countDocuments({status:'Accepted', owner: reqUser._id});
    const interviewingApps = await Application.countDocuments({status:'Interviewing', owner: reqUser._id});
    const activeApps = await Application.countDocuments({status:'Active', owner: reqUser._id});
    const rejectedApps = await Application.countDocuments({status:'Rejected', owner: reqUser._id});
    res.status(201).json({ totalApps, acceptedApps, interviewingApps, activeApps, rejectedApps });
}