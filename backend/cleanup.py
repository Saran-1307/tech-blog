import os
import json
import random
import feedparser
import warnings
import google.generativeai as genai
from supabase import create_client, Client

# 1. Silence Warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# --- CONFIGURATION ---
SUPABASE_URL = "https://rmidgficnfbtrlzanfyd.supabase.co"

# ⚠️ PASTE YOUR KEYS HERE
SUPABASE_KEY = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaWRnZmljbmZidHJsemFuZnlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ2NTM1NCwiZXhwIjoyMDg0MDQxMzU0fQ"
GEMINI_KEY = "AIzaSyDf3di8IpAMadOO6g4Ck6De3ZWzV8e8iIw"

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    genai.configure(api_key=GEMINI_KEY)
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit(1)

# --- CATEGORY RSS FEEDS ---
FEED_SOURCES = {
    "Technology": "https://techcrunch.com/feed/",
    "World": "http://feeds.bbci.co.uk/news/world/rss.xml",
    "Sports": "http://feeds.bbci.co.uk/sport/rss.xml",
    "Business": "http://feeds.bbci.co.uk/news/business/rss.xml",
    "Health": "http://feeds.bbci.co.uk/news/health/rss.xml",
    "Entertainment": "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
}

# --- IMAGE COLLECTIONS ---
CATEGORY_IMAGES = {
    "Technology": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        "https://images.unsplash.com/photo-1531297461136-82lwDe4105q"
    ],
    "World": [
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
    ],
    "Sports": [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
        "https://images.unsplash.com/photo-1471295253337-3ceaaedca402",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b"
    ],
    "Business": [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
    ],
    "Health": [
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7"
    ],
    "Entertainment": [
        "https://images.unsplash.com/photo-1514525253440-b393452e3720",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
        "https://images.unsplash.com/photo-1499364615650-ec387c1470c5"
    ]
}

def run_agent():
    print("🤖 Agent Starting (Deep Search Mode)...")
    
    for category, rss_url in FEED_SOURCES.items():
        print(f"\n🔍 Checking {category} News...")
        feed = feedparser.parse(rss_url)
        
        if not feed.entries:
            print(f"   ❌ No entries found for {category}.")
            continue

        # --- FIX: Loop through TOP 10 entries until we find a new one ---
        posts_found = 0
        for entry in feed.entries[:10]:
            
            # Check if post already exists
            existing = supabase.table('posts').select('id').eq('source_url', entry.link).execute()
            if existing.data:
                # If exists, skip silently and try the next one
                continue

            print(f"   ✨ Found New Story: {entry.title}")

            # Extract Real Author
            real_author = ""
            if hasattr(entry, 'author'):
                real_author = entry.author
            elif hasattr(entry, 'creators'):
                real_author = entry.creators[0] if len(entry.creators) > 0 else "AI Reporter"
            real_author = real_author.strip()

            # Get Content
            full_text = getattr(entry, 'summary', '') or getattr(entry, 'description', '')
            full_text = full_text.replace("<p>", "").replace("</p>", "").replace("[&#8230;]", "...")
            
            if not full_text: continue

            print("   ↳ 🧠 Writing Blog Post...")

            try:
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                prompt = f"""
                You are a journalist. Rewrite this news summary into a blog post.
                
                Summary: "{full_text}"
                Category: "{category}"
                
                OUTPUT JSON: {{ "title": "...", "slug": "...", "content": "..." }}
                """

                result = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
                post_data = json.loads(result.text)
                
                # Random Image
                image_pool = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES["Technology"])
                random_image = random.choice(image_pool) + "?auto=format&fit=crop&w=800&q=80"

                # Insert
                supabase.table('posts').insert({
                    "title": post_data['title'],
                    "slug": post_data['slug'],
                    "content": post_data['content'],
                    "source_url": entry.link,
                    "image_url": random_image,
                    "category": category,
                    "author": real_author,
                    "is_published": True,
                    "views_count": random.randint(100, 1000),
                    "likes_count": random.randint(10, 50),
                    "ad_image": None,
                    "ad_link": None
                }).execute()
                
                print(f"   ✅ SUCCESS: Saved new post!")
                posts_found += 1
                break # Stop after finding 1 new post for this category

            except Exception as e:
                print(f"   ❌ Error: {e}")
        
        if posts_found == 0:
            print("   ↳ 😴 No new stories found in top 10.")

if __name__ == "__main__":
    run_agent()