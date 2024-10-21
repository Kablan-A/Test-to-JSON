function parseQnAs(rawInput) {
  const lines = rawInput.split("\n").map((line) => line.trim());
  lines.push(""); // Add an empty line at the end to signify end of input data

  let questions = [],
    currQuestion = [];

  for (let line of lines) {
    if (!line) {
      if (currQuestion.length) {
        const { question, instruction, correct_answer, all_answers } =
          parseQnAsInner(currQuestion);
        questions.push({ question, instruction, correct_answer, all_answers });
        currQuestion = []; // Reset for next question
      }
    } else {
      currQuestion.push(line);
    }
  }

  return questions;
}

function parseQnAsInner(lines) {
  const question = lines[0];
  let instruction = "",
    correct_answer = "";
  let all_answers = [];

  // Check if the second line is an instruction (starts with '(')
  if (lines.length > 1 && lines[1].startsWith("(")) {
    instruction = lines[1];
    correct_answer = lines[2];
    all_answers = lines.slice(2);
  } else {
    correct_answer = lines[1];
    all_answers = lines.slice(1);
  }

  return { question, instruction, correct_answer, all_answers };
}

module.exports = { parseQnAs };
