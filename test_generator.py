import sys

def parse_question_and_answers(lines):
  question = lines[0]  # The first line is always the question
  instruction = ""
  answers = []
  # print(lines[1])
  # Check if the second line is an instruction (starts with '(' or has 'True')
  if len(lines) > 1 and (lines[1].startswith("(") or 'True' in lines[1]):
    instruction = lines[1]  # The second line is the instruction
    answers = lines[2:]  # The remaining lines are answers
  else:
    answers = lines[1:]  # No instruction, so all remaining lines are answers

  return question, instruction, answers

def write_to_file(questions, filename):
  with open(filename, 'w') as f:
    for index, qa in enumerate(questions, start=1):
      f.write(f"{index}. {qa['question']}\n")
      if qa['instruction']:
        f.write(f"   {qa['instruction']}\n")
      for i, answer in enumerate(qa['answers'], start=97):  # ASCII 'a' starts at 97
        f.write(f"   {chr(i)}. {answer}\n")
      f.write("\n")

def main():
  # Get input from Node.js (piped as command line argument)
  raw_input = sys.argv[1]  # Raw input is passed from Node.js
  lines = raw_input.splitlines()
  if lines[-1] != '':
    lines.append('') # Add an empty line at the end to signify end of input data

  questions = []
  current_question = []
  
  for line in lines:
    line = line.strip()
    if not line:  # Empty line signifies end of current question
      # print(line)
      if current_question:
        question, instruction, answers = parse_question_and_answers(current_question)
        questions.append({'question': question, 'instruction': instruction, 'answers': answers})
        current_question = []  # Reset for next question
    else:
      current_question.append(line)

  # Write questions to file
  if questions:
    # print(questions)
    filename = sys.argv[2]  # Filename passed from Node.js
    write_to_file(questions, filename)
    print(f"File {filename} generated successfully.")  # Confirmation output for Node.js

if __name__ == "__main__":
  main()
