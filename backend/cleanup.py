import os
from datetime import datetime, timedelta
from supabase import create_client

supabase = create_client(os.environ.get("https://rmidgficnfbtrlzanfyd.supabase.co"), os.environ.get("sb_publishable_iiwQ-ixEeVgHYS4OMDERPA_v_DcWDZp"))

def cleanup():
    # Delete posts older than 7 days
    last_week = (datetime.utcnow() - timedelta(days=7)).isoformat()
    supabase.table('posts').delete().lt('created_at', last_week).execute()
    print("✅ Old posts deleted.")

if __name__ == "__main__":
    cleanup()