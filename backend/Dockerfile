# Hugging Face Spaces Dockerfile for FastAPI Backend
# Port 7860 is required for Hugging Face Spaces

FROM python:3.13-slim

# Create non-root user
RUN useradd -m -u 1000 user

# Switch to non-root user
USER user

# Set PATH for user
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY --chown=user ./requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY --chown=user . /app

# Expose port 7860 (required for Hugging Face Spaces)
EXPOSE 7860

# Copy startup script
COPY --chown=user start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Run migrations and start server using startup script
# The script will fail if migrations don't run successfully
CMD ["/app/start.sh"]

