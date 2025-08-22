import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(() => ({
      create: vi.fn(() => ({
        mount: vi.fn(),
        unmount: vi.fn(),
        update: vi.fn(),
      })),
    })),
    confirmPayment: vi.fn(),
    confirmCardPayment: vi.fn(),
  })),
}));

// Mock @stripe/react-stripe-js
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => children,
  useStripe: () => ({
    confirmPayment: vi.fn(),
    confirmCardPayment: vi.fn(),
    createToken: vi.fn(),
    createSource: vi.fn(),
    createPaymentMethod: vi.fn(),
    retrievePaymentIntent: vi.fn(),
    confirmPaymentIntent: vi.fn(),
    handleCardAction: vi.fn(),
    handleCardSetup: vi.fn(),
    handleFpxSetup: vi.fn(),
    handleIdealSetup: vi.fn(),
    handleSepaSetup: vi.fn(),
    handleSofortSetup: vi.fn(),
    handleAuBecsDebitSetup: vi.fn(),
    handleBacsDebitSetup: vi.fn(),
    handleBancontactSetup: vi.fn(),
    handleBoletoSetup: vi.fn(),
    handleEpsSetup: vi.fn(),
    handleGrabPaySetup: vi.fn(),
    handleOxxoSetup: vi.fn(),
    handleP24Setup: vi.fn(),
    handlePayPalSetup: vi.fn(),
    handlePromptPaySetup: vi.fn(),
    handleUpiSetup: vi.fn(),
    handleUsBankAccountSetup: vi.fn(),
    handleWeChatPaySetup: vi.fn(),
    handleAfterpayClearpaySetup: vi.fn(),
    handleKlarnaSetup: vi.fn(),
    handleAffirmSetup: vi.fn(),
    handleCashappSetup: vi.fn(),
    handleCustomerUpdate: vi.fn(),
    handleRecaptcha: vi.fn(),
    handleCardAction: vi.fn(),
    handleCardSetup: vi.fn(),
    handleFpxSetup: vi.fn(),
    handleIdealSetup: vi.fn(),
    handleSepaSetup: vi.fn(),
    handleSofortSetup: vi.fn(),
    handleAuBecsDebitSetup: vi.fn(),
    handleBacsDebitSetup: vi.fn(),
    handleBancontactSetup: vi.fn(),
    handleBoletoSetup: vi.fn(),
    handleEpsSetup: vi.fn(),
    handleGrabPaySetup: vi.fn(),
    handleOxxoSetup: vi.fn(),
    handleP24Setup: vi.fn(),
    handlePayPalSetup: vi.fn(),
    handlePromptPaySetup: vi.fn(),
    handleUpiSetup: vi.fn(),
    handleUsBankAccountSetup: vi.fn(),
    handleWeChatPaySetup: vi.fn(),
    handleAfterpayClearpaySetup: vi.fn(),
    handleKlarnaSetup: vi.fn(),
    handleAffirmSetup: vi.fn(),
    handleCashappSetup: vi.fn(),
    handleCustomerUpdate: vi.fn(),
    handleRecaptcha: vi.fn(),
  }),
  useElements: () => ({
    getElement: vi.fn(),
    submit: vi.fn(),
    update: vi.fn(),
    mount: vi.fn(),
    unmount: vi.fn(),
  }),
  PaymentElement: () => <div data-testid="payment-element">Payment Element</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  CardNumberElement: () => <div data-testid="card-number-element">Card Number Element</div>,
  CardExpiryElement: () => <div data-testid="card-expiry-element">Card Expiry Element</div>,
  CardCvcElement: () => <div data-testid="card-cvc-element">Card CVC Element</div>,
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Mock window.alert
global.alert = vi.fn();

// Mock window.confirm
global.confirm = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
