const {
  conceptExplanationPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let topics = topicsToFocus;

    if (typeof topicsToFocus === "string") {
      topics = topicsToFocus.split(",").map((t) => t.trim());
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topics,
      numberOfQuestions
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    response = result.response;

    let rawText = response.text();
    
    let jsonString = rawText.trim();



    const jsonMatch = rawText.match(/(\[.*\]|\{.*\})/s); // `s` flag = dotall mode

    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      return res
        .status(500)
        .json({ message: "Failed to extract JSON from model response" });
    }


    cleanedText = jsonString.replace(/\\(?!["\\/bfnrtu\n])/g, "\\\\"); // Escape lone backslash, keep \n intact






    // Parse JSON
    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError.message);
      return res.status(500).json({
        message: "Failed to parse model response",
        error: parseError.message,
      });
    }

    // Success: return questions
    return res.status(200).json({ questions: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate questions", error: error.message });
  }
};

const generateConceptExplanation = async (req, res) => {
    try{
        const {question} = req.body;

        if(!question){
          return res.status(400).json({message:"Missing required fields"});
        }

        const prompt = conceptExplanationPrompt(question);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    response = result.response;

    let rawText = response.text();
    
    let jsonString = rawText.trim();

    const jsonMatch = rawText.match(/(\[.*\]|\{.*\})/s); // `s` flag = dotall mode

    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      return res
        .status(500)
        .json({ message: "Failed to extract JSON from model response" });
    }

    jsonString = jsonString.replace(/\\(?!["\\/bfnrtu])/g, "\\\\"); // Escape lone backslashes


    // Parse JSON
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError.message);
      return res.status(500).json({
        message: "Failed to parse model response",
        error: parseError.message,
      });
    }

    res.status(200).json(data)


    }catch(error){
       res
      .status(500)
      .json({ message: "Failed to generate questions", error: error.message });
    }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
