import sys
import json

def parse_question_and_answers(lines):
  question = lines[0]  # The first line is always the question
  instruction = ""
  correct_answer = ""
  all_answers = []
  # print(lines[1])
  # Check if the second line is an instruction (starts with '(' or has 'True')
  if len(lines) > 1 and (lines[1].startswith("(") or 'true' in lines[1].lower()):
    instruction = lines[1]  # The second line is the instruction
    correct_answer = lines[2]
    all_answers = lines[2:] 
  else: # no instruction
    correct_answer = lines[1]
    all_answers = lines[1:] 

  return question, instruction, correct_answer, all_answers

def write_to_json(questions, filename):
  with open(filename, 'w') as json_file:
    json.dump(questions, json_file, indent=2)  # Indent for readability
  print(f"Questions successfully written to {filename}")

def main():
  # Get input from Node.js (piped as command line argument)
  raw_input = sys.argv[1]  # Raw input is passed from Node.js
  lines = raw_input.splitlines()
  if lines[-1]: # Add an empty line at the end to signify end of input data
    lines.append('') 

  questions = []
  current_question = []
  
  for line in lines:
    line = line.strip()
    if not line:  # Empty line signifies end of current question
      # print(line)
      if current_question:
        question, instruction, correct_answer, all_answers = parse_question_and_answers(current_question)
        questions.append({
          'question': question, 
          'instruction': instruction, 
          'correct_answer': correct_answer, 
          'all_answers': all_answers
        })
        current_question = []  # Reset for next question
    else:
      current_question.append(line)

  # Write questions to file
  if questions:
    # print(questions)
    filename = sys.argv[2]  # Filename passed from Node.js
    write_to_json({'data': questions}, filename)
    print(f"File {filename} generated successfully.")  # Confirmation output for Node.js

if __name__ == "__main__":
  main()
