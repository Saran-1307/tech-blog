import os
import datetime
from supabase import create_client, Client

# --- 1. SETUP SUPABASE ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Uses the Service Role Key from GitHub Secrets

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit(1)

def run_cleanup():
    print("🧹 Database Cleanup Starting...")

    # Calculate the date 14 days ago
    fourteen_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=14)
    cutoff_date = fourteen_days_ago.isoformat()

    try:
        # Delete posts created before the cutoff date
        response = supabase.table('posts').delete().lt('created_at', cutoff_date).execute()
        
        deleted_count = len(response.data)
        print(f"✅ SUCCESS: Deleted {deleted_count} old posts (older than 14 days).")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")

if __name__ == "__main__":
    run_cleanup()