import os
import json
import feedparser
import requests
import google.generativeai as genai
from supabase import create_client

# CONNECT TO SUPABASE
# We use the Service Role Key here to bypass the RLS policies we just set up
supabase = create_client(os.environ.get("https://rmidgficnfbtrlzanfyd.supabase.co"), os.environ.get("sb_publishable_iiwQ-ixEeVgHYS4OMDERPA_v_DcWDZp"))
genai.configure(api_key=os.environ.get("AIzaSyC5Vh5aIzUHGswD-1_EpchNaDBLEwUBd14"))

RSS_FEED = 'https://techcrunch.com/feed/'

def run_agent():
    print("🤖 Agent Starting...")
    feed = feedparser.parse(RSS_FEED)
    
    # Check top 3 articles
    for entry in feed.entries[:3]:
        # 1. Check Duplicates
        existing = supabase.table('posts').select('id').eq('source_url', entry.link).execute()
        if existing.data:
            continue # Skip if exists

        # 2. Get Clean Text
        print(f"Reading: {entry.title}")
        full_text = requests.get(f"https://r.jina.ai/{entry.link}").text
        
        # 3. Write with AI
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"""
        Act as a tech blogger. Rewrite this news.
        OUTPUT JSON ONLY: {{ "title": "...", "slug": "slug-url-format", "content": "markdown text..." }}
        SOURCE: {full_text}
        """
        
        try:
            res = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            post = json.loads(res.text)
            
            # 4. Save as DRAFT (is_published=False)
            supabase.table('posts').insert({
                "title": post['title'],
                "slug": post['slug'],
                "content": post['content'],
                "source_url": entry.link,
                "is_published": False 
            }).execute()
            print("✅ Draft Saved!")
            break # Stop after 1 to be safe
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_agent()