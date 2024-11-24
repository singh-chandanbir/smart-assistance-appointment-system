import json
import requests
import google.generativeai as genai

genai.configure(api_key="AIzaSyD9aqWsg1hrTD4meEO59wE9GKnKM7-6vZE")

gemini_model = genai.GenerativeModel("gemini-1.5-pro-latest")


def run_gemini(prompt):
    result = gemini_model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "patient_info": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "age": {"type": "string"},
                            "symptom": {"type": "string"},
                            "durationOfSymptom": {"type": "string"},
                            "sverityOfSymptom": {"type": "string"},
                        },
                        "required": [
                            "name",
                            "age",
                            "symptom",
                            "durationOfSymptom",
                            "sverityOfSymptom",
                        ],
                    }
                },
                "required": ["patient_info"],
            },
        ),
    )
    return result.text


def send_sms(content, to):
    print(content)
    api_key = "N3kO0X5_VyjD6Nk0TDiKvRDJWdEzI_H2v7qbOde49C-i2bjty9Q2cEdYXcF6xVoF"
    from_number = "+919417725543"

    if to == from_number:
        return {"status": 200, "message": "Cannot send SMS to self"}

    url = "https://api.httpsms.com/v1/messages/send"
    headers = {
        "x-api-key": api_key,
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    payload = {
        "content": content,
        "from": from_number,
        "to": to,
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print(response.json())
    return response.json()


# Example usage
# send


system_prompt = """You're Alex, a virtual assistant at nimhans, helping to schedule appointments for patients. 
Please go through the following set of questions to gather the required details for a new patient appointment:
Ask the following questions one by one:
          1. What is your name?
          2. What is your age?
          3. What are your symptoms?
          4. How long have you been suffering from these symptoms?
Ensure that you receive a clear response to each question before moving on to the next one. Keep the conversation polite, respectful, and strictly relevant. Do not deviate into other topics or give unnecessary responses.Do not add more questions or change the order of the questions. If the patient provides irrelevant information, politely ask them to provide the required information. If the patient asks for information that is not relevant to the appointment, politely inform them that you are only able to provide information related to the appointment. If the patient asks for medical advice, inform them that you are not a doctor and are unable to provide medical advice"""


def generate_random_string(length):
    import random
    import string

    return "".join(random.choices(string.ascii_letters + string.digits, k=length))
