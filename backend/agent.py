import os
import json
import random
import requests
import feedparser
import warnings
import time
from google import genai
from google.genai import types
from supabase import create_client, Client

# 1. Silence Warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# --- CONFIGURATION ---
SUPABASE_URL = "https://rmidgficnfbtrlzanfyd.supabase.co"

# ⚠️ PASTE YOUR REAL KEYS HERE
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_KEY = os.getenv("GEMINI_KEY")
NEWSDATA_KEY = os.getenv("NEWSDATA_KEY")
GNEWS_KEY = os.getenv("GNEWS_KEY")


try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    client = genai.Client(api_key=GEMINI_KEY)
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit(1)

# --- CONFIGURATION ---
CATEGORIES = ["Technology", "World", "Sports", "Business", "Health", "Entertainment"]

BACKUP_AUTHORS = [
    "Alex Carter", "Jordan Lee", "Casey Smith", "Taylor Davis",
    "Morgan Kim", "Jamie Wilson", "Reese Parker", "Quinn Roberts",
    "Avery Mitchell", "Riley Thompson", "Charlie Evans", "Sam Patel",
    "Dakota Clark", "Hayden Wright", "Cameron Hall", "Skyler Johnson",
    "Rowan Adams", "Finley Scott", "Emerson Lewis", "River King"
]

RSS_FEEDS = {
    "Technology": "https://techcrunch.com/feed/",
    "World": "http://feeds.bbci.co.uk/news/world/rss.xml",
    "Sports": "http://feeds.bbci.co.uk/sport/rss.xml",
    "Business": "http://feeds.bbci.co.uk/news/business/rss.xml",
    "Health": "http://feeds.bbci.co.uk/news/health/rss.xml",
    "Entertainment": "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
}

# --- EXTENDED FALLBACK IMAGES ---
FALLBACK_IMAGES = {
    "Technology": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
        "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
        "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
        "https://images.unsplash.com/photo-1526378722443-4f4f6f1f5d15",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
        "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93",
        "https://images.unsplash.com/photo-1581091215367-59ab6c28c7f7",
        "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
        "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9",
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
        "https://images.unsplash.com/photo-1629904853716-f0bc54eea481"
    ],
    "World": [
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
        "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4",
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba",
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
        "https://images.unsplash.com/photo-1499346030926-9a72daac6c63"
    ],
    "Sports": [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b",
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0",
        "https://images.unsplash.com/photo-1518600506278-4e8ef466b810",
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6",
        "https://images.unsplash.com/photo-1471295253337-3ceaaedca402",
        "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        "https://images.unsplash.com/photo-1505842465776-3d90f6163100",
        "https://images.unsplash.com/photo-1508804185872-d7badad00f7d",
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e",
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
        "https://images.unsplash.com/photo-1530549387789-4c1017266635",
        "https://images.unsplash.com/photo-1519861531473-9200262188bf"
    ],
    "Business": [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa",
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
        "https://images.unsplash.com/photo-1549924231-f129b911e442",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1508385082359-f38ae991e8f5",
        "https://images.unsplash.com/photo-1556157382-97eda2d62296",
        "https://images.unsplash.com/photo-1485217988980-11786ced9454",
        "https://images.unsplash.com/photo-1523952578875-6f8f1f7a9f6a",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0",
        "https://images.unsplash.com/photo-1521791136064-7986c2920216"
    ],
    "Health": [
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8",
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
        "https://images.unsplash.com/photo-1556761175-4cdaed2e6f6a",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
        "https://images.unsplash.com/photo-1542736667-069246bdbc6d",
        "https://images.unsplash.com/photo-1514996937319-344454492b37",
        "https://images.unsplash.com/photo-1530497610245-94d3c16cda28",
        "https://images.unsplash.com/photo-1551076805-e1869033e561",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
        "https://images.unsplash.com/photo-1531988042231-d39cfa2d4e2a",
        "https://images.unsplash.com/photo-1556761175-93c90d3d9c6b",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef"
    ],
    "Entertainment": [
        "https://images.unsplash.com/photo-1514525253440-b393452e3720",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        "https://images.unsplash.com/photo-1497032205916-ac775f0649ae",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728",
        "https://images.unsplash.com/photo-1515165562835-c4c1b5721a20",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
        "https://images.unsplash.com/photo-1519183071298-a2962e402c55",
        "https://images.unsplash.com/photo-1522120693274-63d6bb40846e",
        "https://images.unsplash.com/photo-1487180144351-b8472da7d491",
        "https://images.unsplash.com/photo-1499364615650-ec38552f4f34",
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29",
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
        "https://images.unsplash.com/photo-1485841890310-6a055c88698a",
        "https://images.unsplash.com/photo-1509281373149-e957c6296406",
        "https://images.unsplash.com/photo-1517638851339-4aa32003c11a"
    ]
}


# --- HELPER FUNCTIONS ---

def get_author_name(raw_name):
    """Ensures we always have a human name"""
    if not raw_name or "http" in raw_name or len(raw_name) < 3:
        return random.choice(BACKUP_AUTHORS)
    return raw_name.strip()


def generate_blog_post(summary, category, author):
    """Uses Google GenAI with a 3-Model Fallback System for LONG-FORM CONTENT"""
    
    models_to_try = [

        "gemini-1.5-pro" , 
        "gemini-2.5-flash",      
        
        "gemini-2.5-flash-lite"                
    ]

    # --- NEW: ADVANCED PROMPT FOR 3-5 MINUTE READ ---
    prompt = f"""
    You are an award-winning journalist named {author} writing a deep-dive article for the {category} section. 
    Your goal is to transform the provided news summary into an engaging, high-quality blog post that takes 3 to 5 minutes to read (approx. 700 to 1000 words).

    News Summary: "{summary}"

    Follow these strict content guidelines:
    1. Title: Create a compelling, click-worthy headline.
    2. Hook/Introduction: Start with a captivating hook that draws the reader in and sets the stage for the story.
    3. Body (The Core): Expand on the summary. Provide context, explore the "Why it matters", and dive into the implications. Break this down into 3-4 distinct sections using engaging Markdown subheadings (##). 
    4. Style: Use a conversational yet professional tone. Use bullet points or bold text for emphasis where appropriate. Avoid sounding robotic.
    5. Conclusion: End with a thought-provoking takeaway or looking ahead to the future.

    OUTPUT ONLY VALID JSON with this exact structure:
    {{ "title": "...", "slug": "...", "content": "..." }}
    """

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            print(f"      🧠 AI Success using model: {model_name}")
            return json.loads(response.text)

        except Exception as e:
            error_msg = str(e)
            print(f"      ⚠️ Model {model_name} failed: {error_msg[:100]}...")
            if "429" in error_msg:
                print("      ⏳ Rate limit detected. Waiting 10s before switching models...")
                time.sleep(10)

    print("      ❌ ALL AI MODELS FAILED. Skipping this post.")
    return None


def save_post(post_data, source_url, image_url, category, author):
    """Saves to Supabase"""
    try:
        supabase.table('posts').insert({
            "title": post_data['title'],
            "slug": post_data['slug'],
            "content": post_data['content'],
            "source_url": source_url,
            "image_url": image_url,
            "category": category,
            "author": author,
            "is_published": True,
            "views_count": random.randint(100, 1000),
            "likes_count": random.randint(10, 50),
            "ad_image": None,
            "ad_link": None
        }).execute()
        print(f"      ✅ SUCCESS: Saved new long-form post by {author}!")

        print("      ⏳ Waiting 15s to be safe...")
        time.sleep(15)
        return True
    except Exception as e:
        return False


# --- STRATEGY 1: RSS FEEDS ---
def fetch_rss(category):
    if category not in RSS_FEEDS: return False
    print(f"   📡 Strategy 1: Checking RSS Feed ({RSS_FEEDS[category]})...")

    feed = feedparser.parse(RSS_FEEDS[category])
    if not feed.entries: return False

    for entry in feed.entries[:10]:
        existing = supabase.table('posts').select('id').eq('source_url', entry.link).execute()
        if existing.data: continue

        print(f"      ✨ Found RSS Story: {entry.title}")

        image = None
        if hasattr(entry, 'media_content'):
            for media in entry.media_content:
                if 'url' in media: image = media['url']; break
        if not image and hasattr(entry, 'media_thumbnail'):
            image = entry.media_thumbnail[0]['url'].replace("/240/", "/1024/")
        
        # New Fallback logic using the large arrays
        if not image: 
            image_pool = FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["Technology"])
            image = random.choice(image_pool) + "?auto=format&fit=crop&w=800&q=80"

        raw_author = None
        if hasattr(entry, 'author'):
            raw_author = entry.author
        elif hasattr(entry, 'creators'):
            raw_author = entry.creators[0] if len(entry.creators) > 0 else None
        author = get_author_name(raw_author)

        content = getattr(entry, 'summary', '') or getattr(entry, 'description', '')
        content = content.replace("<p>", "").replace("</p>", "").replace("[&#8230;]", "...")

        if len(content) < 50: continue

        post_json = generate_blog_post(content, category, author)
        if post_json:
            if save_post(post_json, entry.link, image, category, author):
                return True

    print("      ⚠️ No fresh RSS stories found.")
    return False


# --- STRATEGY 2: NEWSDATA.IO ---
def fetch_newsdata(category):
    print(f"   🛡️ Strategy 2: Switching to NewsData API...")
    url = f"https://newsdata.io/api/1/news?apikey={NEWSDATA_KEY}&category={category.lower()}&language=en"

    try:
        response = requests.get(url)
        data = response.json()
        if "results" not in data or not data["results"]: return False

        for article in data["results"][:5]:
            existing = supabase.table('posts').select('id').eq('source_url', article['link']).execute()
            if existing.data: continue

            print(f"      ✨ Found API Story: {article['title'][:40]}...")

            raw_author = article.get('creator')[0] if article.get('creator') else None
            author = get_author_name(raw_author)

            image = article.get('image_url')
            if not image or image.startswith("http://"): 
                image_pool = FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["Technology"])
                image = random.choice(image_pool) + "?auto=format&fit=crop&w=800&q=80"
                
            content = article.get('description') or article.get('content') or ""

            if len(content) < 50: continue

            post_json = generate_blog_post(content, category, author)
            if post_json and save_post(post_json, article['link'], image, category, author):
                return True
        return False
    except:
        return False


# --- STRATEGY 3: GNEWS.IO ---
def fetch_gnews(category):
    print(f"   🛡️ Strategy 3: Switching to GNews API...")
    url = f"https://gnews.io/api/v4/top-headlines?category={category.lower()}&lang=en&apikey={GNEWS_KEY}"

    try:
        response = requests.get(url)
        data = response.json()
        if "articles" not in data or not data["articles"]: return False

        for article in data["articles"][:5]:
            existing = supabase.table('posts').select('id').eq('source_url', article['url']).execute()
            if existing.data: continue

            print(f"      ✨ Found GNews Story: {article['title'][:40]}...")

            raw_author = article.get('source', {}).get('name')
            author = get_author_name(raw_author)

            image = article.get('image')
            if not image: 
                image_pool = FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["Technology"])
                image = random.choice(image_pool) + "?auto=format&fit=crop&w=800&q=80"
                
            content = article.get('description') or article.get('content') or ""

            if len(content) < 50: continue

            post_json = generate_blog_post(content, category, author)
            if post_json and save_post(post_json, article['url'], image, category, author):
                return True
        return False
    except:
        return False


# --- MAIN LOOP ---
def run_agent():
    print("🤖 Hybrid Agent Starting (Long-Form Content Mode)...")

    for category in CATEGORIES:
        print(f"\n🔍 Processing Category: {category}")

        if fetch_rss(category): continue
        if fetch_newsdata(category): continue
        fetch_gnews(category)


if __name__ == "__main__":
    run_agent()