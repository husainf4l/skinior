"use client";

import React, { useState } from "react";

interface JoinWaitlistData {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface WaitlistButtonProps {
  variant?: "primary" | "secondary" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children = "Join the Waiting List",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4008";

  const getButtonStyles = () => {
    const baseStyles =
      "font-medium rounded-full transition-all duration-300 hover:scale-[1.02] transform-gpu";

    const sizeStyles = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-2.5 text-xs sm:text-sm",
      lg: "px-6 py-3 text-sm sm:px-8 sm:py-3 sm:text-base",
    };

    const variantStyles = {
      primary:
        "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg active:scale-95",
      secondary:
        "bg-white text-black border border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg active:scale-95",
      white:
        "bg-white text-black hover:bg-gray-50 shadow-xl hover:shadow-2xl active:scale-95",
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const waitlistData: JoinWaitlistData = {
        email: formData.email,
        ...(formData.firstName && { firstName: formData.firstName }),
        ...(formData.lastName && { lastName: formData.lastName }),
      };

      const response = await fetch(`${API_BASE_URL}/waitlist/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(waitlistData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to join waitlist");
      }

      const result = await response.json();
      console.log("Waitlist joined successfully:", result);
      setIsSuccess(true);
      setMessage("🎉 You're on the list! We'll be in touch soon.");

      // Reset form
      setFormData({ email: "", firstName: "", lastName: "" });

      // Close modal after delay
      setTimeout(() => {
        closeModal();
      }, 3000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setMessage("");
    setFormData({ email: "", firstName: "", lastName: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (message && !isSuccess) setMessage("");
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={getButtonStyles()}
        disabled={isLoading}
      >
        {children}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={(e) => {
            // Only close if clicking the backdrop (not the modal content)
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 p-3 rounded-full hover:bg-gray-100 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              type="button"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900 mb-2 sm:mb-3">
                Join the Waitlist
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-2">
                Be among the first to experience the future of skincare.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                We&apos;ll notify you when Skinior is ready.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-sm sm:text-base bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-sm sm:text-base bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-sm sm:text-base bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-2xl text-center text-base ${
                    isSuccess
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white font-semibold py-3 px-6 sm:py-4 sm:px-6 rounded-2xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform-gpu disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95 text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Joining...
                  </div>
                ) : isSuccess ? (
                  "✓ Successfully Joined!"
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>

            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-6 px-2">
              We&apos;ll never spam you. Unsubscribe at any time.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitlistButton;
