#!/bin/bash

# Skinior Chat Agent PM2 Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="/home/husain/skinior/chat-agent"
ECOSYSTEM_FILE="$PROJECT_DIR/ecosystem.config.json"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PM2 is installed
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed. Please install it first:"
        echo "npm install -g pm2"
        exit 1
    fi
}

# Start the application
start_app() {
    print_status "Starting Skinior Chat Agent..."
    cd "$PROJECT_DIR"
    
    # Check if virtual environment exists
    if [ ! -d ".venv" ]; then
        print_error "Virtual environment not found. Please create it first."
        exit 1
    fi
    
    # Start with PM2
    pm2 start "$ECOSYSTEM_FILE"
    print_success "Skinior Chat Agent started successfully!"
}

# Stop the application
stop_app() {
    print_status "Stopping Skinior Chat Agent..."
    pm2 stop skinior-chat-agent
    print_success "Skinior Chat Agent stopped successfully!"
}

# Restart the application
restart_app() {
    print_status "Restarting Skinior Chat Agent..."
    pm2 restart skinior-chat-agent
    print_success "Skinior Chat Agent restarted successfully!"
}

# Reload the application (zero-downtime)
reload_app() {
    print_status "Reloading Skinior Chat Agent (zero-downtime)..."
    pm2 reload skinior-chat-agent
    print_success "Skinior Chat Agent reloaded successfully!"
}

# Show application status
status_app() {
    print_status "Skinior Chat Agent Status:"
    pm2 show skinior-chat-agent
}

# Show application logs
logs_app() {
    print_status "Showing Skinior Chat Agent logs..."
    pm2 logs skinior-chat-agent
}

# Delete the application from PM2
delete_app() {
    print_status "Deleting Skinior Chat Agent from PM2..."
    pm2 delete skinior-chat-agent
    print_success "Skinior Chat Agent deleted from PM2!"
}

# Save PM2 configuration
save_config() {
    print_status "Saving PM2 configuration..."
    pm2 save
    print_success "PM2 configuration saved!"
}

# Setup PM2 startup script
setup_startup() {
    print_status "Setting up PM2 startup script..."
    pm2 startup
    print_warning "Please run the command shown above as root/sudo if prompted"
}

# Show help
show_help() {
    echo "Skinior Chat Agent PM2 Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the application"
    echo "  stop      Stop the application"
    echo "  restart   Restart the application"
    echo "  reload    Reload the application (zero-downtime)"
    echo "  status    Show application status"
    echo "  logs      Show application logs"
    echo "  delete    Delete application from PM2"
    echo "  save      Save PM2 configuration"
    echo "  startup   Setup PM2 startup script"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs"
    echo "  $0 restart"
}

# Main script logic
main() {
    check_pm2
    
    case "${1:-help}" in
        start)
            start_app
            ;;
        stop)
            stop_app
            ;;
        restart)
            restart_app
            ;;
        reload)
            reload_app
            ;;
        status)
            status_app
            ;;
        logs)
            logs_app
            ;;
        delete)
            delete_app
            ;;
        save)
            save_config
            ;;
        startup)
            setup_startup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run the main function
main "$@"
