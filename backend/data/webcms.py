import requests
from bs4 import BeautifulSoup
from datetime import datetime

#
# def extract_deadlines_with_ai(content):
#     prompt = f"""
#     Extract all deadlines or due dates from the following text. For each deadline, provide:
#     1. The name of the item/assignment/quiz
#     2. The exact deadline date and time
#     3. Any additional deadline-related information
#     
#     Return the information in JSON format like this:
#     [
#         {{
#             "item": "name of the item",
#             "deadline": "the exact deadline",
#             "additional_info": "any other relevant information"
#         }}
#     ]
#     
#     If no deadlines are found, return an empty list.
#     
#     Text:
#     {content}
#     """
#     
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant that extracts deadline information from text."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.1
#     )
#     
#     ai_response = response.choices[0].message.content
#     
#     try:
#         import re
#         json_match = re.search(r'\[.*\]', ai_response, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             deadlines = json.loads(json_str)
#         else:
#             deadlines = json.loads(ai_response)
#     except json.JSONDecodeError:
#         print("Failed to parse AI response as JSON. Raw response:")
#         print(ai_response)
#         deadlines = []
#     
#     return deadlines

def scrape_upcomming_due_dates(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    notices = []
    notice_items = soup.select('.panel-primary .list-group-item')
    for item in notice_items:
        title = item.find('strong').text.strip() if item.find('strong') else 'No title'
        poster = item.select_one('a').text.strip() if item.select_one('a') else 'Unknown'
        time_posted = item.select_one('abbr.timeago')['title'] if item.select_one('abbr.timeago') else 'Unknown'
        content = ' '.join([p.text.strip() for p in item.find_all('p')])
        
        data = {
            'title': title,
            'poster': poster,
            'time_posted': time_posted,
            'content': content
        }


    
    due_dates = []
    due_date_items = soup.select(".col-sm-4 .panel-primary .list-group-item")
    for item in due_date_items:
        title = item.select_one("a").text.strip() if item.select_one("a") else "No title"
        due_date = item.select_one("abbr.timeago")["title"] if item.select_one("abbr.timeago") else "Unknown"
        
        due_dates.append({
            "title": title,
            "due_date": due_date
        })
    
    return due_dates
    


WEBCMS = "https://webcms3.cse.unsw.edu.au"
def get_course_links():
    response = requests.get(WEBCMS)
    soup = BeautifulSoup(response.content, "html.parser")

    course_subdir = []
    course_items = soup.select(".panel-primary .list-group-item")
    for course in course_items:
        full_path = WEBCMS + course.select_one("a")["href"]
        course_subdir.append(full_path)

    return course_subdir


for course in get_course_links():
    print(scrape_upcomming_due_dates(course))

