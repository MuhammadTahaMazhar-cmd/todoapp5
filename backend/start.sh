#!/bin/bash
set -e  # Exit on any error

echo "=========================================="
echo "Starting Backend Application"
echo "=========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set!"
    echo "Please set DATABASE_URL in your Hugging Face Space secrets."
    exit 1
fi

echo "Database URL configured: ${DATABASE_URL%%@*}@***"

# Verify we're in the right directory
echo ""
echo "Current directory: $(pwd)"
echo "Checking for required files..."

# Check for alembic.ini
if [ ! -f "alembic.ini" ]; then
    echo "ERROR: alembic.ini not found in current directory!"
    echo "Files in current directory:"
    ls -la
    exit 1
fi
echo "✅ Found alembic.ini"

# Check if alembic directory exists
if [ ! -d "alembic" ]; then
    echo "ERROR: alembic directory not found!"
    exit 1
fi
echo "✅ Found alembic directory"

# Check if src directory exists (needed for imports)
if [ ! -d "src" ]; then
    echo "ERROR: src directory not found!"
    exit 1
fi
echo "✅ Found src directory"

# Check if migration files exist
MIGRATION_COUNT=$(find alembic/versions -name "*.py" -not -name "__*" 2>/dev/null | wc -l)
echo "Found $MIGRATION_COUNT migration file(s)"

# Fix alembic_version if it points to non-existent revision
echo ""
echo "Checking Alembic version..."
python -c "
import os
import sys
from dotenv import load_dotenv
load_dotenv()

try:
    from sqlmodel import create_engine, text
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            # Check if alembic_version table exists
            result = conn.execute(text(\"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'alembic_version')\"))
            table_exists = result.scalar()
            
            if table_exists:
                # Get current version
                result = conn.execute(text(\"SELECT version_num FROM alembic_version LIMIT 1\"))
                row = result.fetchone()
                current_version = row[0] if row else None
                
                # Valid revisions we have: '001' and '002'
                valid_revisions = ['001', '002']
                
                if current_version and current_version not in valid_revisions:
                    print(f'⚠️  Invalid Alembic version detected: {current_version}')
                    print('Fixing by setting to latest revision: 002')
                    conn.execute(text(\"UPDATE alembic_version SET version_num = '002'\"))
                    conn.commit()
                    print('✅ Fixed Alembic version to 002')
                elif current_version:
                    print(f'✅ Alembic version is correct: {current_version}')
                else:
                    print('ℹ️  No version recorded, migrations will set it')
            else:
                print('ℹ️  alembic_version table does not exist (will be created by migrations)')
except Exception as e:
    print(f'⚠️  Could not check Alembic version: {e}')
    print('Continuing with migrations...')
" || echo "⚠️  Version check failed, continuing..."

# Run database migrations with verbose output
echo ""
echo "Running database migrations..."
echo "----------------------------------------"

# Try to upgrade, if it fails due to invalid version, fix and retry
alembic upgrade head 2>&1 | tee /tmp/alembic_output.log || true
MIGRATION_EXIT_CODE=${PIPESTATUS[0]}

if [ $MIGRATION_EXIT_CODE -ne 0 ]; then
    # Check if error is about missing revision
    if grep -q "Can't locate revision" /tmp/alembic_output.log 2>/dev/null; then
        echo ""
        echo "⚠️  Migration failed due to invalid revision. Attempting to fix..."
        python -c "
import os
from dotenv import load_dotenv
from sqlmodel import create_engine, text
load_dotenv()

db_url = os.getenv('DATABASE_URL')
if db_url:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        # Get current invalid version
        result = conn.execute(text(\"SELECT version_num FROM alembic_version LIMIT 1\"))
        row = result.fetchone()
        invalid_version = row[0] if row else None
        print(f'Found invalid version: {invalid_version}')
        
        # Set to latest valid revision
        conn.execute(text(\"UPDATE alembic_version SET version_num = '002'\"))
        conn.commit()
        print('✅ Fixed Alembic version to 002')
"
        echo ""
        echo "Retrying migrations..."
        alembic upgrade head
        MIGRATION_EXIT_CODE=$?
    fi
fi

# Verify table exists after migrations
echo ""
echo "Verifying tasks table exists..."
python -c "
import os
import sys
from dotenv import load_dotenv
load_dotenv()

try:
    from sqlmodel import create_engine, text
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text(\"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks')\"))
            exists = result.scalar()
            if exists:
                print('✅ Tasks table exists in database')
                sys.exit(0)
            else:
                print('❌ Tasks table does not exist!')
                sys.exit(1)
except Exception as e:
    print(f'⚠️  Could not verify table: {e}')
    sys.exit(1)
" || TABLE_EXISTS=0

if [ "$TABLE_EXISTS" != "0" ] && [ $MIGRATION_EXIT_CODE -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    CURRENT_REV=$(alembic current 2>&1 | grep -oP 'Rev: \K[^ ]+' || echo "unknown")
    echo "Current database revision: $CURRENT_REV"
elif [ "$TABLE_EXISTS" = "0" ]; then
    echo ""
    echo "⚠️  Tasks table missing. Attempting direct creation..."
    python create_tables_directly.py
    
    if [ $? -eq 0 ]; then
        echo "✅ Tables created directly!"
    else
        echo "❌ Failed to create tables!"
        echo ""
        echo "Troubleshooting:"
        echo "1. Check DATABASE_URL is correct"
        echo "2. Verify database is accessible"
        echo "3. Check database user has CREATE TABLE permissions"
        exit 1
    fi
elif [ $MIGRATION_EXIT_CODE -ne 0 ]; then
    echo "❌ Migration failed, but table exists. Continuing..."
fi

echo ""
echo "Starting FastAPI server..."
echo "=========================================="

# Start the server
exec uvicorn app:app --host 0.0.0.0 --port 7860

