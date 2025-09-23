# CSC Rahti Demo Application
# Optimized for CSC's Rahti container platform
# Uses non-root user and proper security settings

# Build frontend
FROM node:20 AS frontend
WORKDIR /mypage
COPY mypage/package*.json ./
RUN npm install
COPY mypage/ ./
RUN npm run build

# Build backend
FROM python:3.11-slim

# Metadata
LABEL maintainer="CSC Demo Application"
LABEL description="Demo application for CSC Rahti container platform"
LABEL version="1.0"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=8080

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user (required for Rahti)
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy React build backend static-folder
COPY --from=mypage /mypage/dist ./mypage/dist

# Change ownership to non-root user (OpenShift will override the user ID)
RUN chown -R appuser:appuser /app

# Switch to non-root user (OpenShift will assign the actual user ID)
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
