#!/usr/bin/env python3
"""
Directly create tables if migrations fail.
This is a fallback to ensure the database schema exists.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from sqlmodel import create_engine, text

load_dotenv()

def create_tables_directly():
    """Create tasks table directly if it doesn't exist."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not set!")
        return False
    
    print("=" * 60)
    print("Creating Tables Directly (Fallback)")
    print("=" * 60)
    
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            # Check if tasks table exists
            result = conn.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks')"
            ))
            table_exists = result.scalar()
            
            if table_exists:
                print("✅ Tasks table already exists!")
                return True
            
            print("Creating tasks table...")
            
            # Create tasks table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS tasks (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL,
                    title VARCHAR(200) NOT NULL,
                    description VARCHAR(1000),
                    completed BOOLEAN NOT NULL DEFAULT false,
                    due_date TIMESTAMP,
                    due_date_end TIMESTAMP,
                    priority VARCHAR(10) CHECK (priority IS NULL OR priority IN ('low', 'medium', 'high')),
                    category VARCHAR(100),
                    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
                    updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
                )
            """))
            
            # Create indexes
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_tasks_user_id ON tasks(user_id)
            """))
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_tasks_completed ON tasks(completed)
            """))
            
            conn.commit()
            
            # Verify
            result = conn.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks')"
            ))
            exists = result.scalar()
            
            if exists:
                print("✅ Tasks table created successfully!")
                
                # Set alembic version
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS alembic_version (
                        version_num VARCHAR(32) NOT NULL PRIMARY KEY
                    )
                """))
                conn.execute(text("""
                    INSERT INTO alembic_version (version_num) VALUES ('002')
                    ON CONFLICT (version_num) DO UPDATE SET version_num = '002'
                """))
                conn.commit()
                print("✅ Alembic version set to 002")
                
                return True
            else:
                print("❌ Failed to create table")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = create_tables_directly()
    sys.exit(0 if success else 1)

