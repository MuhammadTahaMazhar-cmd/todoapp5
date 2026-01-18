#!/usr/bin/env python3
"""
Fix Alembic version table if it's pointing to a non-existent revision.
This script sets the version to the latest available migration.
"""

import os
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from sqlmodel import create_engine, text

# Load environment variables
load_dotenv()

def fix_alembic_version():
    """Fix alembic_version table to point to latest available revision."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not set!")
        sys.exit(1)
    
    # Latest migration revision (check available migrations)
    latest_revision = "002"  # Based on available migration files
    
    print("=" * 60)
    print("Fixing Alembic Version Table")
    print("=" * 60)
    print(f"Database: {database_url.split('@')[0]}@***")
    print(f"Setting version to: {latest_revision}")
    print()
    
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            # Check current version
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            current_version = result.scalar()
            print(f"Current version in DB: {current_version}")
            
            # Update to latest
            conn.execute(text(f"UPDATE alembic_version SET version_num = '{latest_revision}'"))
            conn.commit()
            
            # Verify
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            new_version = result.scalar()
            print(f"New version in DB: {new_version}")
            
            if new_version == latest_revision:
                print()
                print("✅ Alembic version fixed successfully!")
                return True
            else:
                print()
                print("❌ Failed to update version")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = fix_alembic_version()
    sys.exit(0 if success else 1)
