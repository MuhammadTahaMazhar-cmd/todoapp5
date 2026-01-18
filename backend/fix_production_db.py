#!/usr/bin/env python3
"""
Quick script to run migrations on production database.
Usage: python fix_production_db.py
Make sure DATABASE_URL environment variable is set to your production database.
"""

import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Warning: python-dotenv not installed, using environment variables directly")

# Import alembic
try:
    from alembic import command
    from alembic.config import Config
except ImportError:
    print("Error: alembic not installed. Run: pip install alembic")
    sys.exit(1)

def main():
    """Run migrations on production database"""
    # Get DATABASE_URL from environment
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("=" * 60)
        print("ERROR: DATABASE_URL environment variable is not set!")
        print("=" * 60)
        print("\nPlease set DATABASE_URL before running this script:")
        print("\n  Windows PowerShell:")
        print('    $env:DATABASE_URL="postgresql://user:pass@host:port/dbname"')
        print("\n  Windows CMD:")
        print('    set DATABASE_URL=postgresql://user:pass@host:port/dbname')
        print("\n  Linux/Mac:")
        print('    export DATABASE_URL="postgresql://user:pass@host:port/dbname"')
        print("\n" + "=" * 60)
        sys.exit(1)
    
    # Configure alembic
    alembic_cfg = Config(str(backend_dir / "alembic.ini"))
    alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)
    
    # Display database info (hide password)
    db_display = db_url
    if "@" in db_display:
        parts = db_display.split("@")
        if ":" in parts[0]:
            user_pass = parts[0].split(":")[0] + ":***"
            db_display = user_pass + "@" + parts[1]
    
    print("=" * 60)
    print("Running Production Database Migrations")
    print("=" * 60)
    print(f"Database: {db_display}")
    print("=" * 60)
    print()
    
    try:
        # Run migrations
        print("Running migrations...")
        command.upgrade(alembic_cfg, "head")
        
        print("\n" + "=" * 60)
        print("✅ SUCCESS! Migrations completed successfully!")
        print("=" * 60)
        
        # Verify current migration
        from alembic.script import ScriptDirectory
        script = ScriptDirectory.from_config(alembic_cfg)
        current = script.get_current_head()
        print(f"\nCurrent migration: {current}")
        print("\n✅ The 'tasks' table should now exist in your database!")
        print("\nNext steps:")
        print("1. Restart your backend server")
        print("2. Test the API endpoints")
        print("3. Verify tasks can be fetched from the frontend")
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ MIGRATION FAILED!")
        print("=" * 60)
        print(f"\nError: {e}")
        print("\n" + "=" * 60)
        print("Troubleshooting:")
        print("=" * 60)
        print("1. Verify DATABASE_URL is correct")
        print("2. Check database server is accessible")
        print("3. Ensure database user has CREATE TABLE permissions")
        print("4. Verify database exists")
        print("\nExample DATABASE_URL format:")
        print("  postgresql://username:password@host:port/database_name")
        sys.exit(1)

if __name__ == "__main__":
    main()

