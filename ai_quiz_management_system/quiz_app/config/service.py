from langchain_core.prompts import PromptTemplate
from .configure import get_llm

def get_questions_on_prompt(question_count,subject,grade,level,topic):
    llm = get_llm()

    prompt = PromptTemplate(
        input_variables=['question_count','subject','grade','level','topic'],
        template='''
            You are an AI Quiz generator assistant
            your goal is to generate {question_count} of 4 choice mcq with answer
            of subject {subject} for grade {grade} with {level} level of topic {topic} 

            Return the response in the following Json formate (no addition of json keyword in the starting):
            {{
                "subject": "Math",
                "grade": 10,
                "topic": "Quadratic Equations",
                "difficulty": "Medium",
                "questions": [
                    {{
                        "question_no":1
                        "question": "Solve x² - 5x + 6 = 0.",
                        "options": [
                            "A) x = 2 or x = 3",
                            "B) x = -2 or x = -3",
                            "C) x = 1 or x = 6",
                            "D) x = -1 or x = -6"
                        ],
                        "answer": "A) x = 2 or x = 3"
                    }}
                ]
            }}
            

            and if topic and subject is mismatched then say "Sorry i couldn't generate because topic and subjects are mismatched" 

        Answer:
        '''
        )

    final_prompt = prompt.format(question_count=question_count,subject=subject,grade=grade,level=level,topic=topic)

    response = llm.invoke(final_prompt)

    return response.content