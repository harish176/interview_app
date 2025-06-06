// const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions)=>(`
//     You are an AI trained to generate technical interview questions and answers.

//     Task:
//     -Role:${role}
//     -Candidate Experience: ${experience} years
//     -Focus Topics: ${topicsToFocus.join(", ")}
//     -Write ${numberOfQuestions} interview questions.
//     -For each question, generate a detailed but beginner-friendly answer.
//     -If the answer needs a code example, add a small code block inside. 
//     -Return a pure JSON array like:
//     [
//         {
//             "question":"Question here?",
//             "answer":"Answer here."

//         },

//         ...
//     ]   

//     Important: Do NOT add any extra text. Only return valid JSON
//     `)

const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
You are an AI that generates technical interview questions and answers in clean JSON format.

Instructions:
- Role: ${role}
- Experience: ${experience} years
- Topics: ${topicsToFocus.join(", ")}
- Number of Questions: ${numberOfQuestions}
- For each question, generate a detailed but beginner friendly answer.
- If answer needs a code example, add a small code block inside. 
- It should be more than 5 lines
- Keep formatting very clean. 
- Return a pure JSON array like this
Example output:
[
  {
    "question": "What is closure in JavaScript?",
    "answer": "A closure is a function that retains access to its outer scope. Example: function outer() { let x = 5; return function inner() { return x; } }"
  },
  ...
]
  Important: Do not add any extra text. Only return valid JSON. 
`);


    const conceptExplanationPrompt = (question)=>(`
        You are an AI trained to generate explanations for a given interview question. 
        
        Task:
        -Explain the following interview question and its concept in depth as if ypu're teaching a beginner developer. 
        -Question:"${question}"
        -After the explanation, provide a short and clear title that summarizes the concept for the article or page header. 
        -If the explanation includes a code example, provide a small code block. 
        -Keep the formatting vey clean and clear. 
        -Return the resut as a valid JSON Object int he following format: 
        {
            "title": "Short title here?",
            "explanation": "Explanation here."
        }

        Important: Do NOT add any extra text outside the JSON format. Only return valid JSON. 
    `)

    module.exports= {questionAnswerPrompt, conceptExplanationPrompt}