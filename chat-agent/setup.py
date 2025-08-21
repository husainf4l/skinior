#!/usr/bin/env python3
"""
Setup Script for Balsan Financial AI Agent Service

This script sets up the agent service environment, creates virtual environment,
installs dependencies, and prepares the service for running.
"""

import subprocess
import sys
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def run_command(command, description):
    """Run a shell command and handle errors"""
    logger.info(f"Running: {description}")
    try:
        result = subprocess.run(
            command, shell=True, check=True, capture_output=True, text=True
        )
        logger.info(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ {description} failed:")
        logger.error(f"   Command: {command}")
        logger.error(f"   Error: {e.stderr}")
        return False


def setup_virtual_environment():
    """Set up Python virtual environment"""
    logger.info("🐍 Setting up Python virtual environment...")

    # Create virtual environment
    if not run_command("python3 -m venv venv", "Creating virtual environment"):
        return False

    # Activate and upgrade pip
    activate_cmd = (
        "source venv/bin/activate" if os.name != "nt" else "venv\\Scripts\\activate"
    )

    if not run_command(f"{activate_cmd} && pip install --upgrade pip", "Upgrading pip"):
        return False

    return True


def install_dependencies():
    """Install Python dependencies"""
    logger.info("📦 Installing Python dependencies...")

    activate_cmd = (
        "source venv/bin/activate" if os.name != "nt" else "venv\\Scripts\\activate"
    )

    if not run_command(
        f"{activate_cmd} && pip install -r requirements.txt", "Installing dependencies"
    ):
        return False

    return True


def create_logs_directory():
    """Create logs directory"""
    logger.info("📁 Creating logs directory...")

    try:
        os.makedirs("logs", exist_ok=True)
        logger.info("✅ Logs directory created")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to create logs directory: {str(e)}")
        return False


def verify_setup():
    """Verify that setup was successful"""
    logger.info("🔍 Verifying setup...")

    # Check if virtual environment exists
    venv_path = "venv/bin/python" if os.name != "nt" else "venv\\Scripts\\python.exe"
    if not os.path.exists(venv_path):
        logger.error("❌ Virtual environment not found")
        return False

    # Check if main files exist
    required_files = ["main.py", "requirements.txt", "start_agent.py"]
    for file in required_files:
        if not os.path.exists(file):
            logger.error(f"❌ Required file not found: {file}")
            return False

    logger.info("✅ Setup verification completed successfully")
    return True


def main():
    """Main setup function"""
    print("🚀 BALSAN FINANCIAL AI AGENT SERVICE SETUP")
    print("=" * 50)

    current_dir = os.getcwd()
    logger.info(f"Setting up agent service in: {current_dir}")

    # Run setup steps
    steps = [
        ("Create virtual environment", setup_virtual_environment),
        ("Install dependencies", install_dependencies),
        ("Create logs directory", create_logs_directory),
        ("Verify setup", verify_setup),
    ]

    success_count = 0

    for step_name, step_function in steps:
        logger.info(f"\n📋 Step: {step_name}")
        if step_function():
            success_count += 1
        else:
            logger.error(f"❌ Setup failed at step: {step_name}")
            break

    print(f"\n" + "=" * 50)
    print("📈 SETUP SUMMARY")
    print("=" * 50)

    if success_count == len(steps):
        print("🎉 SETUP COMPLETED SUCCESSFULLY!")
        print("\n📋 Next Steps:")
        print("1. Activate the virtual environment:")
        if os.name != "nt":
            print("   source venv/bin/activate")
        else:
            print("   venv\\Scripts\\activate")
        print("2. Start the agent service:")
        print("   python start_agent.py")
        print("3. Test the service:")
        print("   python test_agent_service.py")
        print("\n🌐 The agent service will be available at:")
        print("   http://localhost:8001")
        print("   API Documentation: http://localhost:8001/docs")
    else:
        print(f"❌ SETUP FAILED ({success_count}/{len(steps)} steps completed)")
        print("Please check the error messages above and try again.")


if __name__ == "__main__":
    main()
