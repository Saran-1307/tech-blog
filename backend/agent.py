import os
import json
import feedparser
import requests
import warnings
import google.generativeai as genai
from supabase import create_client, Client

# 1. Silence the annoyance (Ignore the warning)
warnings.filterwarnings("ignore", category=FutureWarning)

# 2. DEBUG: Check if secrets exist
# This will print "Found" or "MISSING" in your GitHub logs.
print(f"DEBUG: Supabase URL is {'Found' if os.environ.get('SUPABASE_URL') else 'MISSING'}")
print(f"DEBUG: Service Key is {'Found' if os.environ.get('SUPABASE_SERVICE_KEY') else 'MISSING'}")
print(f"DEBUG: Gemini Key is {'Found' if os.environ.get('GEMINI_API_KEY') else 'MISSING'}")

# 3. Load Keys
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

# 4. Initialize
if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ STOPPING: You need to add secrets in GitHub Settings!")
    exit(1) # Stop the script safely

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    genai.configure(api_key=GEMINI_KEY)
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit(1)

RSS_FEED = 'https://techcrunch.com/feed/'

def fetch_clean_text(url):
    try:
        return requests.get(f"https://r.jina.ai/{url}").text
    except:
        return ""

def run_agent():
    print("🤖 Agent Starting (Stable Version)...")
    feed = feedparser.parse(RSS_FEED)
    
    if not feed.entries:
        print("❌ No entries found.")
        return

    for entry in feed.entries[:2]:
        print(f"\nProcessing: {entry.title}")

        existing = supabase.table('posts').select('id').eq('source_url', entry.link).execute()
        if existing.data:
            print("   ↳ 😴 Already exists.")
            continue

        print("   ↳ 📖 Reading...")
        full_text = fetch_clean_text(entry.link)
        
        print("   ↳ 🧠 Writing...")
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        prompt = f"""
        Rewrite this news into a blog post.
        OUTPUT JSON: {{ "title": "...", "slug": "...", "content": "markdown..." }}
        SOURCE: {full_text[:4000]}
        """

        try:
            # Generate
            result = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            post = json.loads(result.text)
            
            # Save
            supabase.table('posts').insert({
                "title": post['title'],
                "slug": post['slug'],
                "content": post['content'],
                "source_url": entry.link,
                "is_published": False,
                "views_count": 0,
                "likes_count": 0
            }).execute()
            print("   ✅ SUCCESS: Draft saved!")
            break
        except Exception as e:
            print(f"   ❌ AI/DB Error: {e}")

if __name__ == "__main__":
    run_agent()