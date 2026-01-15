import os
import json
import feedparser
import requests
from google import genai
from supabase import create_client, Client

# --- DEBUGGING: Check if keys exist ---
# This prints "Found" or "Missing" to the logs (safe, doesn't show the actual key)
print(f"DEBUG: Supabase URL is {'Found' if os.environ.get('SUPABASE_URL') else 'MISSING'}")
print(f"DEBUG: Service Key is {'Found' if os.environ.get('SUPABASE_SERVICE_KEY') else 'MISSING'}")

# --- SETUP ---
# 1. Load Keys
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") # Ensure this matches your YAML env name
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ CRITICAL ERROR: Supabase Secrets are missing in GitHub Settings!")

# 2. Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_KEY)

RSS_FEED = 'https://techcrunch.com/feed/'

def fetch_clean_text(url):
    try:
        # Use Jina.ai to extract main text
        return requests.get(f"https://r.jina.ai/{url}").text
    except Exception as e:
        print(f"Error fetching text: {e}")
        return ""

def run_agent():
    print("🤖 Agent Starting...")
    feed = feedparser.parse(RSS_FEED)
    
    if not feed.entries:
        print("❌ No entries found in RSS feed.")
        return

    # Process top 2 articles
    for entry in feed.entries[:2]:
        print(f"\nProcessing: {entry.title}")

        # Check Duplicates
        existing = supabase.table('posts').select('id').eq('source_url', entry.link).execute()
        if existing.data:
            print("   ↳ 😴 Already exists. Skipping.")
            continue

        # Fetch Content
        print("   ↳ 📖 Reading article...")
        full_text = fetch_clean_text(entry.link)
        if not full_text: continue

        # Generate with Gemini (New Syntax)
        print("   ↳ 🧠 Writing with Gemini...")
        
        prompt = f"""
        You are a pro tech blogger. Rewrite this news into a blog post.
        
        RULES:
        1. Output ONLY valid JSON.
        2. Format: {{ "title": "...", "slug": "...", "content": "markdown..." }}
        3. Use H2 (##) for headers in markdown.
        4. Tone: Exciting, Professional.
        
        SOURCE:
        {full_text[:5000]} 
        """

        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash', # Or gemini-1.5-pro
                contents=prompt,
                config={
                    'response_mime_type': 'application/json'
                }
            )
            
            post_data = json.loads(response.text)

            # Save to Supabase
            data = {
                "title": post_data['title'],
                "slug": post_data['slug'],
                "content": post_data['content'],
                "source_url": entry.link,
                "is_published": False, # Draft mode
                "views_count": 0,
                "likes_count": 0
            }
            
            supabase.table('posts').insert(data).execute()
            print("   ✅ SUCCESS: Draft saved to database!")
            break # Stop after 1 successful post

        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    run_agent()