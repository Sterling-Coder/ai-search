import re
import json
from textwrap import wrap

# 1. Sample scraped text (replace this with your actual scraped content)
scraped_text = """
Products
Resources
Products
Modern B2B ticketing platform
The complete customer view
Data for smarter decisions
Outreach to Slack & MS Teams
Real-time sync with your tools
Thena allows us tomanage and scale our support operations efficiently,ensuring nothing slips through the cracks and allowing our team to focus on what matters most.
We got ourhighest NPS score ever,core component of it was Thena.
Thena has been invaluable in bringingeverything together in one place.
We were wasting at least 10 hours per weektrying to manage the volume of channels manually.
Working with Thena’s API has been transformativefor Embrace. Its robust and flexible design allows us to tailor data flows to meet our unique needs, seamlessly integrating with existing tools.
Resources
Change your world of ticketing with
The modern
B2B ticketing platform
Support and grow your customers in
Slack
MS Teams
Email
Web
The new B2B support engine, AI-first.
AI turns customer messages into actionable support tickets, saving hours spent identifying action items.
AI auto-applies custom fields to tickets, saving time and effort while ensuring accurate categorization.
AI crafts concise summaries and action items, providing precise details you need—no human hours required.
AI converts tickets into rich help center articles to scale your knowledge base—no human hours required.
AI delivers impactful, action-ready insights—no endless hours spent on analysis or spreadsheets.
Fast, modern support.Exceptional experiences.
Create, edit, and maintain a publicly hosted knowledgebase. Empower customers with instant self-service answers.
Resolve customer issues where conversations happen. Convert Slack message into actionable tickets.
Bridge Slack and MS Teams. Mirror conversations and convert messages into tickets for unifiCreate, edit, and maintain a publicly hosted knowledgebase. Empower customers with instant self-service answers.
Resolve customer issues where conversations happen. Convert Slack message into actionable tickets.
Bridge Slack and MS Teams. Mirror conversations and convert messages into tickets for unifiself-service answers.
Resolve customer issues where conversations happen. Convert Slack message into actionable tickets.
Bridge Slack and MS Teams. Mirror conversations and convert messages into tickets for unifiResolve customer issues where conversations happen. Convert Slack message into actionable tickets.
Bridge Slack and MS Teams. Mirror conversations and convert messages into tickets for unifiickets.
Bridge Slack and MS Teams. Mirror conversations and convert messages into tickets for unified tracking.
Stop juggling platforms. Connect your emails to track and respond—all from one place.      
Bridge Slack and MS Teams. Mirror conversations and convert messages into tickets for unified tracking.
Stop juggling platforms. Connect your emails to track and respond—all from one place.      
Engage with customers in real time. Tackle queries instantly for an exceptional experience.ed tracking.
Stop juggling platforms. Connect your emails to track and respond—all from one place.      
Engage with customers in real time. Tackle queries instantly for an exceptional experience.Stop juggling platforms. Connect your emails to track and respond—all from one place.      
Engage with customers in real time. Tackle queries instantly for an exceptional experience.Engage with customers in real time. Tackle queries instantly for an exceptional experience.Streamline customer inputs from anywhere. Turn forms into tickets for faster resolutions.  
Streamline customer inputs from anywhere. Turn forms into tickets for faster resolutions.  
Next-gen support, driven by storiesthat speak for themselves.
It would be impossible to stay on top of everything without Thena.‍
Handle releases, updates, and OOO alerts with Thena’s unified platform.
Change your world of ticketing with
"""  # Paste your full scraped string here

# 2. Clean the text (remove weird characters)
cleaned_text = re.sub(r'[^\x00-\x7F]+', ' ', scraped_text)

# 3. Chunking (example: 300-character chunks)
chunks = wrap(cleaned_text, width=300)

# 4. Convert to JSON format
json_data = [{"id": f"chunk_{i+1}", "text": chunk} for i, chunk in enumerate(chunks)]

# 5. Save to file
with open("thena_chunks.json", "w", encoding="utf-8") as f:
    json.dump(json_data, f, indent=2)

print(f"✅ Saved {len(chunks)} chunks to thena_chunks.json")