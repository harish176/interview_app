const Session = require("../models/Session");
const Question = require("../models/Question");
const { create } = require("../models/User");

// @desc Create a new session and linked Question
// @route POST  /api/sessions/create
// @access Private
exports.createSession = async(req,res)=>{
    try{
        const {role, experience, topicsToFocus, description, questions}=req.body;

        console.log(req.body)

          if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: "Questions must be an array" });
    }
        const userId=req.user._id //assuming you have a middleware setting req.user

        const session = await Session.create({
            user:userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        // que=questions.questions

        const questionDocs = await Promise.all(
            questions.map(async (q)=>{
                const question = await Question.create({
                    session:session._id,
                    question: q.question,
                    answer:q.answer,
                });
                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({success:true,session});
    }catch(error){
        res.status(500).json({success:false, message:"Serever Error"});
    }
}


// @desc get all sessions for the logged-in user
// @route POST  /api/sessions/my-sessions
// @access Private
exports.getMySession = async(req,res)=>{
    try{
        const sessions=await Session.find({user: req.user.id})
            .sort({createdAt:-1})
            .populate("questions");
        res.status(200).json(sessions);
    }catch(error){
        res.status(500).json({success:false, message:"Serever Error"});
    }
}

// @desc Get a session ny ID with populated questions
// @route GET /api/sessions/:id
// @access Private
exports.getSessionById = async(req,res)=>{
    try{
        const session = await Session.findById(req.params.id)
          .populate({
            path:"questions",
            options:{sort:{isPinned:-1, createdAt:1}},
          })
          .exec();

        if(!session){
            return res
                .status(404)
                .json({success:false, message:"Session not found"});
        }

        res.status(200).json({success:true, session})
    }catch(error){
        res.status(500).json({success:false, message:"Serever Error"});
    }
}

// @desc delete a session and its questions
// @route DELETE /api/sessions/:id
// @access Private
exports.deleteSession=async(req,res)=>{
    try{
        const session = await Session.findById(req.params.id);

        if(!session){
            return res.status(404).json({message:"Session not found "});
        }

        if(session.user.toString()!=req.user.id){
            return res.status(401).json({message:"Not authorised to delete this session"})
        }

        await Question.deleteMany({session:session._id})

        await session.deleteOne();

        res.status(200).json({message:"Session deleted successfully"})
    }catch(error){
        res.status(500).json({success:false, message:"Serever Error"});
    }
}