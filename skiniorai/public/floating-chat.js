// // Floating Chat Widget - Independent Implementation
// (function() {
//   'use strict';
  
//   // Ensure we only create one instance
//   if (window.skiniorChatWidget) {
//     return;
//   }
  
//   let isOpen = false;
//   let chatButton = null;
//   let chatInterface = null;
  
//   // Create the floating chat button
//   function createChatButton() {
//     const button = document.createElement('button');
//     button.id = 'skinior-chat-button';
//     button.innerHTML = `
//       <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//       </svg>
//     `;
    
//     // Apply critical positioning styles that override everything
//     button.setAttribute('style', `
//       position: fixed !important;
//       bottom: 24px !important;
//       right: 24px !important;
//       width: 56px !important;
//       height: 56px !important;
//       background-color: #2563eb !important;
//       color: white !important;
//       border: none !important;
//       border-radius: 50% !important;
//       cursor: pointer !important;
//       z-index: 2147483647 !important;
//       box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
//       display: flex !important;
//       align-items: center !important;
//       justify-content: center !important;
//       transition: all 0.2s ease !important;
//       margin: 0 !important;
//       padding: 0 !important;
//       font-family: inherit !important;
//       font-size: 0 !important;
//       line-height: 1 !important;
//       transform: translate3d(0, 0, 0) !important;
//       left: auto !important;
//       top: auto !important;
//       float: none !important;
//       clear: none !important;
//       overflow: visible !important;
//       opacity: 1 !important;
//       visibility: visible !important;
//       clip: auto !important;
//       max-width: none !important;
//       max-height: none !important;
//       min-width: 0 !important;
//       min-height: 0 !important;
//       vertical-align: baseline !important;
//       text-align: center !important;
//     `);
    
//     // Add hover effects
//     button.addEventListener('mouseenter', function() {
//       this.style.backgroundColor = '#1d4ed8';
//       this.style.transform = 'translateZ(0) scale(1.05)';
//     });
    
//     button.addEventListener('mouseleave', function() {
//       this.style.backgroundColor = '#2563eb';
//       this.style.transform = 'translateZ(0) scale(1)';
//     });
    
//     // Add click handler
//     button.addEventListener('click', toggleChat);
    
//     return button;
//   }
  
//   // Create the chat interface
//   function createChatInterface() {
//     const container = document.createElement('div');
//     container.id = 'skinior-chat-interface';
//     container.innerHTML = `
//       <div style="background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); width: 384px; height: 500px; display: flex; flex-direction: column;">
//         <div style="background: #2563eb; color: white; padding: 16px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
//           <h3 style="margin: 0; font-size: 16px; font-weight: 600;">AI Assistant</h3>
//           <button id="close-chat" style="background: transparent; border: none; color: white; cursor: pointer; padding: 4px;">
//             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>
//         <div style="flex: 1; padding: 16px; overflow-y: auto;">
//           <div style="text-align: center; color: #6b7280;">Start a conversation with the AI assistant</div>
//         </div>
//         <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
//           <div style="display: flex; gap: 8px;">
//             <input type="text" placeholder="Type your message..." style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; outline: none;">
//             <button style="background: #2563eb; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer;">Send</button>
//           </div>
//         </div>
//       </div>
//     `;
    
//     container.style.cssText = `
//       position: fixed !important;
//       bottom: 96px !important;
//       right: 24px !important;
//       z-index: 2147483647 !important;
//       transform: translateZ(0) !important;
//       display: none !important;
//     `;
    
//     // Add close button functionality
//     container.querySelector('#close-chat').addEventListener('click', toggleChat);
    
//     return container;
//   }
  
//   // Toggle chat function
//   function toggleChat() {
//     isOpen = !isOpen;
    
//     if (isOpen) {
//       if (!chatInterface) {
//         chatInterface = createChatInterface();
//         document.body.appendChild(chatInterface);
//       }
//       chatInterface.style.display = 'block';
//       chatButton.innerHTML = `
//         <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//         </svg>
//       `;
//     } else {
//       if (chatInterface) {
//         chatInterface.style.display = 'none';
//       }
//       chatButton.innerHTML = `
//         <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//         </svg>
//       `;
//     }
//   }
  
//   // Initialize the widget
//   function init() {
//     // Remove any existing instances
//     const existing = document.getElementById('skinior-chat-button');
//     if (existing) {
//       existing.remove();
//     }
    
//     const existingInterface = document.getElementById('skinior-chat-interface');
//     if (existingInterface) {
//       existingInterface.remove();
//     }
    
//     // Create and append the chat button
//     chatButton = createChatButton();
//     document.body.appendChild(chatButton);
    
//     // Mark as initialized
//     window.skiniorChatWidget = true;
//   }
  
//   // Initialize when DOM is ready
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', init);
//   } else {
//     init();
//   }
  
//   // Re-initialize if needed (for SPA navigation)
//   if (window.addEventListener) {
//     window.addEventListener('load', init);
//   }
// })();
