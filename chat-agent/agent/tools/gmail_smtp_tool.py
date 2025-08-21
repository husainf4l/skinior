"""
Gmail SMTP Tool for sending emails using SMTP with app password
This is simpler than OAuth2 and works well for automated email sending
"""

import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from langchain_core.tools import tool

logger = logging.getLogger(__name__)


class GmailSMTPService:
    """Gmail service for sending emails using SMTP with app password"""

    def __init__(self, email: str, password: str):
        """
        Initialize Gmail SMTP service

        Args:
            email: Gmail address (e.g., albalsanai25@gmail.com)
            password: Gmail app password (not regular password)
        """
        self.email = email
        self.password = password
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587

    def send_email(
        self, to_email: str, subject: str, body: str, body_type: str = "plain"
    ) -> bool:
        """
        Send an email using Gmail SMTP

        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Email body content
            body_type: Either 'plain' or 'html'

        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create message
            message = MIMEMultipart()
            message["From"] = self.email
            message["To"] = to_email
            message["Subject"] = subject

            # Add body to message
            if body_type.lower() == "html":
                message.attach(MIMEText(body, "html"))
            else:
                message.attach(MIMEText(body, "plain"))

            # Create SMTP session
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()  # Enable TLS encryption
                server.login(self.email, self.password)

                # Send email
                text = message.as_string()
                server.sendmail(self.email, to_email, text)

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False


def send_email_to_hussein(subject: str, body: str, body_type: str = "plain") -> str:
    """
    Send an email to al-hussein@papayatrading.com using Gmail SMTP

    Args:
        subject: Email subject
        body: Email body content
        body_type: Either 'plain' or 'html'

    Returns:
        str: Status message about the email sending result
    """
    try:
        # Gmail credentials
        gmail_email = "albalsanai25@gmail.com"
        gmail_app_password = "tdpn ozrb nryn aneh"  # App password from Gmail

        if gmail_app_password == "YOUR_APP_PASSWORD_HERE":
            return "❌ Gmail App Password not configured. Please set up an App Password in Gmail settings and update the tool."

        # Initialize Gmail SMTP service
        gmail_service = GmailSMTPService(gmail_email, gmail_app_password)

        # Send email to Hussein at his main email
        to_email = "al-hussein@papayatrading.com"

        # Add Al Balsan AI signature
        body_with_signature = f"{body}\n\n---\nBest regards,\nAl Balsan AI Assistant\nThis is an automated message from Al Balsan Group's AI system."

        success = gmail_service.send_email(
            to_email=to_email,
            subject=subject,
            body=body_with_signature,
            body_type=body_type,
        )

        if success:
            return f"✅ Email sent successfully to {to_email}\nSubject: {subject}\nFrom: {gmail_email}"
        else:
            return f"❌ Failed to send email to {to_email}"

    except Exception as e:
        logger.error(f"Error in send_email_to_hussein: {e}")
        return f"❌ Error sending email: {str(e)}"


def send_request_to_omar_assistant(
    subject: str, request_body: str, body_type: str = "plain"
) -> str:
    """
    Send a request email to Mr Omar's assistant (idiab@upthouse.com) for clarification
    when the AI agent doesn't know the answer.

    Args:
        subject: Email subject
        request_body: The request/question content
        body_type: Either 'plain' or 'html'

    Returns:
        str: Status message about the email sending result
    """
    try:
        # Gmail credentials
        gmail_email = "albalsanai25@gmail.com"
        gmail_app_password = "tdpn ozrb nryn aneh"  # App password from Gmail

        # Format the email with proper signature and no-reply hint
        formatted_body = f"""{request_body}

---
Best regards,
Al Balsan AI Assistant

This is an automated email. Please do not reply to this email directly.
For any questions, please contact: al-hussein@papayatrading.com"""

        # Initialize Gmail SMTP service
        gmail_service = GmailSMTPService(gmail_email, gmail_app_password)

        # Send email to Omar's assistant
        to_email = "idiab@upthouse.com"
        success = gmail_service.send_email(
            to_email=to_email,
            subject=f"[Al Balsan AI] {subject}",
            body=formatted_body,
            body_type=body_type,
        )

        if success:
            return f"✅ Request sent successfully to Mr Omar's assistant ({to_email})\nSubject: [Al Balsan AI] {subject}\nFrom: {gmail_email}"
        else:
            return f"❌ Failed to send request to {to_email}"

    except Exception as e:
        logger.error(f"Error in send_request_to_omar_assistant: {e}")
        return f"❌ Error sending request: {str(e)}"


def send_custom_email(
    to_email: str, subject: str, body: str, body_type: str = "plain"
) -> str:
    """
    Send an email to any recipient using Gmail SMTP

    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Email body content
        body_type: Either 'plain' or 'html'

    Returns:
        str: Status message about the email sending result
    """
    try:
        # Gmail credentials
        gmail_email = "albalsanai25@gmail.com"
        gmail_app_password = "tdpn ozrb nryn aneh"  # App password from Gmail

        if gmail_app_password == "YOUR_APP_PASSWORD_HERE":
            return "❌ Gmail App Password not configured. Please set up an App Password in Gmail settings and update the tool."

        # Add Al Balsan AI signature to custom emails
        formatted_body = f"""{body}

---
Best regards,
Al Balsan AI Assistant

This email was sent on behalf of Al Balsan Group.
For questions, please contact: al-hussein@papayatrading.com"""

        # Initialize Gmail SMTP service
        gmail_service = GmailSMTPService(gmail_email, gmail_app_password)

        # Send email
        success = gmail_service.send_email(
            to_email=to_email, subject=subject, body=formatted_body, body_type=body_type
        )

        if success:
            return f"✅ Email sent successfully to {to_email}\nSubject: {subject}\nFrom: {gmail_email}"
        else:
            return f"❌ Failed to send email to {to_email}"

    except Exception as e:
        logger.error(f"Error in send_custom_email: {e}")
        return f"❌ Error sending email: {str(e)}"


# Test function for development
def test_gmail_smtp_service():
    """Test the Gmail SMTP service with a simple email"""
    try:
        result = send_email_to_hussein(
            subject="Test Email from Al Balsan Assistant (SMTP)",
            body="This is a test email from the Al Balsan AI Assistant system using SMTP.\n\nIf you receive this, the Gmail SMTP integration is working correctly.",
        )
        print(result)
        return result
    except Exception as e:
        error_msg = f"Gmail SMTP service test failed: {e}"
        print(error_msg)
        return error_msg


def test_omar_assistant_email():
    """Test sending email to Omar's assistant"""
    try:
        result = send_request_to_omar_assistant(
            subject="Test Request for Information",
            request_body="This is a test request from the Al Balsan AI Assistant.\n\nThe user has asked a question that requires Mr Omar's input:\n\nTest Question: What is the status of the new project initiative?\n\nPlease provide guidance so I can assist the user properly.",
        )
        print(result)
        return result
    except Exception as e:
        error_msg = f"Omar assistant email test failed: {e}"
        print(error_msg)
        return error_msg


if __name__ == "__main__":
    # Run test when script is executed directly
    test_gmail_smtp_service()


# LangChain Tool Wrappers
@tool
def send_email_tool(subject: str, body: str, body_type: str = "plain") -> str:
    """
    Send an email to al-hussein@papayatrading.com using Gmail SMTP.

    Args:
        subject: Email subject line
        body: Email body content
        body_type: Either 'plain' or 'html' (default: 'plain')

    Returns:
        Status message about the email sending result
    """
    result = send_email_to_hussein(subject, body, body_type)
    return f"Email Tool Summary: {result}"


@tool
def send_request_tool(subject: str, request_body: str, body_type: str = "plain") -> str:
    """
    Send a request email to Mr Omar's assistant when you need clarification
    or don't know the answer to a user's question.

    Args:
        subject: Email subject line
        request_body: The request/question content
        body_type: Either 'plain' or 'html' (default: 'plain')

    Returns:
        Status message about the email sending result
    """
    result = send_request_to_omar_assistant(subject, request_body, body_type)
    return f"Request Tool Summary: {result}"


@tool
def send_custom_email_tool(
    to_email: str, subject: str, body: str, body_type: str = "plain"
) -> str:
    """
    Send an email to any recipient using Gmail SMTP.

    Args:
        to_email: Recipient email address
        subject: Email subject line
        body: Email body content
        body_type: Either 'plain' or 'html' (default: 'plain')

    Returns:
        Status message about the email sending result
    """
    result = send_custom_email(to_email, subject, body, body_type)
    return f"Custom Email Tool Summary: {result}"
