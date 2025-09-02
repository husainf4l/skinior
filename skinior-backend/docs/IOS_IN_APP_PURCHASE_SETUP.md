# iOS In-App Purchase (Subscription) Integration Guide

This guide covers the complete setup of In-App Purchase subscriptions for your mobile app, including App Store Connect configuration and mobile implementation.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [App Store Connect Configuration](#app-store-connect-configuration)
3. [iOS Implementation (Swift/StoreKit)](#ios-implementation-swiftstorekit)
4. [Flutter Implementation](#flutter-implementation)
5. [React Native Implementation](#react-native-implementation)
6. [Backend Integration](#backend-integration)
7. [Testing](#testing)
8. [Production Checklist](#production-checklist)

## Prerequisites

- Apple Developer Program membership ($99/year)
- iOS app with valid Bundle ID
- App Store Connect access
- Backend API for receipt validation
- Xcode for iOS development

## App Store Connect Configuration

### Step 1: Enable In-App Purchases

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app
3. Navigate to **Features** → **In-App Purchases**
4. Click **Create** to add new subscription products

### Step 2: Create Subscription Group

1. Click **Subscription Groups** → **Create**
2. Set Reference Name: `Skinior Subscriptions`
3. Configure subscription group settings:
   - Family Sharing: Enable if desired
   - Subscription Group Display Name (localized)

### Step 3: Create Auto-Renewable Subscriptions

Create subscriptions that match your backend plans:

```
Basic Monthly:
- Product ID: com.skinior.subscription.basic.monthly
- Reference Name: Basic Monthly Subscription
- Duration: 1 Month
- Price: $9.99

Basic Yearly:
- Product ID: com.skinior.subscription.basic.yearly
- Reference Name: Basic Yearly Subscription  
- Duration: 1 Year
- Price: $99.99

Premium Monthly:
- Product ID: com.skinior.subscription.premium.monthly
- Reference Name: Premium Monthly Subscription
- Duration: 1 Month
- Price: $29.99

Premium Yearly:
- Product ID: com.skinior.subscription.premium.yearly
- Reference Name: Premium Yearly Subscription
- Duration: 1 Year
- Price: $299.99
```

### Step 4: Configure Subscription Details

For each subscription:
1. **Subscription Prices** - Set pricing for all territories
2. **Subscription Information** - Add display name and description
3. **Review Information** - Add screenshot and review notes
4. **App Store Promotion** - Configure promotional text (optional)

### Step 5: Create Shared Secret

1. Go to **App Store Connect** → **My Apps** → Your App
2. Navigate to **App Information** → **General Information**
3. Under **App-Specific Shared Secret**, click **Generate**
4. Copy this secret - you'll need it for receipt validation

## iOS Implementation (Swift/StoreKit)

### Step 1: Import Required Frameworks

```swift
import StoreKit
import Foundation
```

### Step 2: Create StoreKit Manager

```swift
class SubscriptionManager: NSObject, ObservableObject {
    static let shared = SubscriptionManager()
    
    @Published var availableProducts: [SKProduct] = []
    @Published var purchasedSubscriptions: Set<String> = []
    
    private var productsRequest: SKProductsRequest?
    
    // Your subscription product IDs from App Store Connect
    private let productIdentifiers: Set<String> = [
        "com.skinior.subscription.basic.monthly",
        "com.skinior.subscription.basic.yearly",
        "com.skinior.subscription.premium.monthly",
        "com.skinior.subscription.premium.yearly"
    ]
    
    override init() {
        super.init()
        SKPaymentQueue.default().add(self)
        fetchProducts()
    }
    
    deinit {
        SKPaymentQueue.default().remove(self)
    }
    
    // MARK: - Product Fetching
    func fetchProducts() {
        guard !productIdentifiers.isEmpty else { return }
        
        productsRequest?.cancel()
        productsRequest = SKProductsRequest(productIdentifiers: productIdentifiers)
        productsRequest?.delegate = self
        productsRequest?.start()
    }
    
    // MARK: - Purchase Methods
    func purchase(product: SKProduct) {
        guard SKPaymentQueue.canMakePayments() else {
            print("Payments not allowed")
            return
        }
        
        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }
    
    func restorePurchases() {
        SKPaymentQueue.default().restoreCompletedTransactions()
    }
}
```

### Step 3: Implement StoreKit Delegates

```swift
// MARK: - SKProductsRequestDelegate
extension SubscriptionManager: SKProductsRequestDelegate {
    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        DispatchQueue.main.async {
            self.availableProducts = response.products
            
            if !response.invalidProductIdentifiers.isEmpty {
                print("Invalid product identifiers: \(response.invalidProductIdentifiers)")
            }
        }
    }
    
    func request(_ request: SKRequest, didFailWithError error: Error) {
        print("Products request failed: \(error.localizedDescription)")
    }
}

// MARK: - SKPaymentTransactionObserver
extension SubscriptionManager: SKPaymentTransactionObserver {
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchasing:
                print("Transaction purchasing...")
                
            case .purchased:
                print("Transaction purchased!")
                handlePurchased(transaction)
                
            case .restored:
                print("Transaction restored!")
                handleRestored(transaction)
                
            case .failed:
                print("Transaction failed: \(transaction.error?.localizedDescription ?? "Unknown error")")
                handleFailed(transaction)
                
            case .deferred:
                print("Transaction deferred (awaiting approval)")
                
            @unknown default:
                print("Unknown transaction state")
            }
        }
    }
    
    private func handlePurchased(_ transaction: SKPaymentTransaction) {
        // Validate receipt with your backend
        validateReceipt(transaction: transaction) { [weak self] success in
            if success {
                // Add to purchased subscriptions
                DispatchQueue.main.async {
                    self?.purchasedSubscriptions.insert(transaction.payment.productIdentifier)
                }
            }
            
            // Always finish the transaction
            SKPaymentQueue.default().finishTransaction(transaction)
        }
    }
    
    private func handleRestored(_ transaction: SKPaymentTransaction) {
        DispatchQueue.main.async {
            self.purchasedSubscriptions.insert(transaction.payment.productIdentifier)
        }
        SKPaymentQueue.default().finishTransaction(transaction)
    }
    
    private func handleFailed(_ transaction: SKPaymentTransaction) {
        SKPaymentQueue.default().finishTransaction(transaction)
    }
}
```

### Step 4: Receipt Validation

```swift
extension SubscriptionManager {
    private func validateReceipt(transaction: SKPaymentTransaction, completion: @escaping (Bool) -> Void) {
        guard let receiptURL = Bundle.main.appStoreReceiptURL,
              let receiptData = try? Data(contentsOf: receiptURL) else {
            completion(false)
            return
        }
        
        let receiptBase64 = receiptData.base64EncodedString()
        
        // Send to your backend
        let request = AppleReceiptValidationRequest(
            receiptData: receiptBase64,
            productId: transaction.payment.productIdentifier,
            transactionId: transaction.transactionIdentifier
        )
        
        // Call your backend API
        NetworkManager.shared.validateAppleReceipt(request) { result in
            switch result {
            case .success:
                completion(true)
            case .failure(let error):
                print("Receipt validation failed: \(error)")
                completion(false)
            }
        }
    }
}

struct AppleReceiptValidationRequest: Codable {
    let receiptData: String
    let productId: String
    let transactionId: String?
}
```

### Step 5: SwiftUI Integration

```swift
struct SubscriptionView: View {
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    
    var body: some View {
        NavigationView {
            List {
                ForEach(subscriptionManager.availableProducts, id: \.productIdentifier) { product in
                    SubscriptionRow(
                        product: product,
                        isPurchased: subscriptionManager.purchasedSubscriptions.contains(product.productIdentifier)
                    ) {
                        subscriptionManager.purchase(product: product)
                    }
                }
            }
            .navigationTitle("Choose Your Plan")
            .toolbar {
                Button("Restore") {
                    subscriptionManager.restorePurchases()
                }
            }
        }
    }
}

struct SubscriptionRow: View {
    let product: SKProduct
    let isPurchased: Bool
    let onPurchase: () -> Void
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(product.localizedTitle)
                    .font(.headline)
                Text(product.localizedDescription)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if isPurchased {
                Text("Purchased")
                    .foregroundColor(.green)
            } else {
                Button(action: onPurchase) {
                    Text(formatPrice(product.price))
                        .font(.headline)
                }
            }
        }
        .padding(.vertical, 4)
    }
    
    private func formatPrice(_ price: NSDecimalNumber) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = product.priceLocale
        return formatter.string(from: price) ?? "\(price)"
    }
}
```

## Flutter Implementation

### Step 1: Add Dependencies

```yaml
dependencies:
  in_app_purchase: ^3.1.11
  in_app_purchase_storekit: ^0.3.6
```

### Step 2: Configure iOS (Info.plist)

Add to `ios/Runner/Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Step 3: Create Subscription Service

```dart
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:in_app_purchase_storekit/in_app_purchase_storekit.dart';
import 'package:in_app_purchase_storekit/store_kit_wrappers.dart';

class SubscriptionService {
  static const List<String> productIds = [
    'com.skinior.subscription.basic.monthly',
    'com.skinior.subscription.basic.yearly',
    'com.skinior.subscription.premium.monthly',
    'com.skinior.subscription.premium.yearly',
  ];

  final InAppPurchase _inAppPurchase = InAppPurchase.instance;
  late StreamSubscription<List<PurchaseDetails>> _subscription;
  
  List<ProductDetails> products = [];
  Set<String> purchasedProductIds = {};

  Future<void> initialize() async {
    // Check if in-app purchase is available
    final bool isAvailable = await _inAppPurchase.isAvailable();
    if (!isAvailable) {
      print('In-app purchase not available');
      return;
    }

    // Listen to purchase updates
    _subscription = _inAppPurchase.purchaseStream.listen(
      _onPurchaseUpdate,
      onDone: () => _subscription.cancel(),
      onError: (error) => print('Purchase stream error: $error'),
    );

    // Load products
    await loadProducts();
    
    // Restore previous purchases
    await restorePurchases();
  }

  Future<void> loadProducts() async {
    final ProductDetailsResponse response = 
        await _inAppPurchase.queryProductDetails(productIds.toSet());
    
    if (response.notFoundIDs.isNotEmpty) {
      print('Products not found: ${response.notFoundIDs}');
    }
    
    products = response.productDetails;
  }

  Future<void> purchaseSubscription(ProductDetails product) async {
    final PurchaseParam purchaseParam = PurchaseParam(
      productDetails: product,
    );
    
    try {
      await _inAppPurchase.buyNonConsumable(purchaseParam: purchaseParam);
    } catch (e) {
      print('Purchase error: $e');
    }
  }

  Future<void> restorePurchases() async {
    try {
      await _inAppPurchase.restorePurchases();
    } catch (e) {
      print('Restore purchases error: $e');
    }
  }

  void _onPurchaseUpdate(List<PurchaseDetails> purchaseDetailsList) {
    for (final PurchaseDetails purchaseDetails in purchaseDetailsList) {
      switch (purchaseDetails.status) {
        case PurchaseStatus.pending:
          print('Purchase pending: ${purchaseDetails.productID}');
          break;
          
        case PurchaseStatus.purchased:
        case PurchaseStatus.restored:
          print('Purchase completed: ${purchaseDetails.productID}');
          _handleSuccessfulPurchase(purchaseDetails);
          break;
          
        case PurchaseStatus.error:
          print('Purchase error: ${purchaseDetails.error}');
          break;
          
        case PurchaseStatus.canceled:
          print('Purchase canceled: ${purchaseDetails.productID}');
          break;
      }
      
      // Always complete the purchase
      if (purchaseDetails.pendingCompletePurchase) {
        _inAppPurchase.completePurchase(purchaseDetails);
      }
    }
  }

  Future<void> _handleSuccessfulPurchase(PurchaseDetails purchaseDetails) async {
    // Validate receipt with your backend
    try {
      await _validateReceiptWithBackend(purchaseDetails);
      purchasedProductIds.add(purchaseDetails.productID);
    } catch (e) {
      print('Receipt validation failed: $e');
    }
  }

  Future<void> _validateReceiptWithBackend(PurchaseDetails purchaseDetails) async {
    final receiptData = purchaseDetails.verificationData.localVerificationData;
    
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/subscriptions/apple/verify'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${await AuthService.getToken()}',
      },
      body: jsonEncode({
        'receiptData': receiptData,
        'productId': purchaseDetails.productID,
        'transactionId': purchaseDetails.purchaseID,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Receipt validation failed');
    }
  }

  bool isProductPurchased(String productId) {
    return purchasedProductIds.contains(productId);
  }

  ProductDetails? getProduct(String productId) {
    try {
      return products.firstWhere((product) => product.id == productId);
    } catch (e) {
      return null;
    }
  }

  void dispose() {
    _subscription.cancel();
  }
}
```

### Step 4: UI Implementation

```dart
class SubscriptionScreen extends StatefulWidget {
  @override
  _SubscriptionScreenState createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  final SubscriptionService _subscriptionService = SubscriptionService();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeSubscriptions();
  }

  Future<void> _initializeSubscriptions() async {
    await _subscriptionService.initialize();
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Choose Your Plan'),
        actions: [
          TextButton(
            onPressed: () => _subscriptionService.restorePurchases(),
            child: Text('Restore'),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: _subscriptionService.products.length,
        itemBuilder: (context, index) {
          final product = _subscriptionService.products[index];
          final isPurchased = _subscriptionService.isProductPurchased(product.id);
          
          return SubscriptionCard(
            product: product,
            isPurchased: isPurchased,
            onPurchase: () => _handlePurchase(product),
          );
        },
      ),
    );
  }

  Future<void> _handlePurchase(ProductDetails product) async {
    try {
      await _subscriptionService.purchaseSubscription(product);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Purchase failed: $e')),
      );
    }
  }

  @override
  void dispose() {
    _subscriptionService.dispose();
    super.dispose();
  }
}

class SubscriptionCard extends StatelessWidget {
  final ProductDetails product;
  final bool isPurchased;
  final VoidCallback onPurchase;

  const SubscriptionCard({
    Key? key,
    required this.product,
    required this.isPurchased,
    required this.onPurchase,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              product.title,
              style: Theme.of(context).textTheme.headline6,
            ),
            SizedBox(height: 8),
            Text(
              product.description,
              style: Theme.of(context).textTheme.bodyText2,
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  product.price,
                  style: Theme.of(context).textTheme.headline6?.copyWith(
                    color: Colors.green,
                  ),
                ),
                if (isPurchased)
                  Chip(
                    label: Text('Purchased'),
                    backgroundColor: Colors.green,
                  )
                else
                  ElevatedButton(
                    onPressed: onPurchase,
                    child: Text('Subscribe'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

## React Native Implementation

### Step 1: Install Dependencies

```bash
npm install react-native-payments
npm install @react-native-async-storage/async-storage
```

### Step 2: iOS Configuration

Add to `ios/YourApp/Info.plist`:
```xml
<key>com.apple.developer.in-app-payments</key>
<array>
    <string>merchant.com.yourcompany.skinior</string>
</array>
```

### Step 3: Implementation

```javascript
import { ApplePayButton, PaymentRequest } from 'react-native-payments';

class ApplePayService {
  static merchantId = 'merchant.com.yourcompany.skinior';

  static async canMakePayments() {
    try {
      return await ApplePayButton.canMakePayments();
    } catch (error) {
      return false;
    }
  }

  static async processSubscription(plan) {
    const METHOD_DATA = [{
      supportedMethods: ['apple-pay'],
      data: {
        merchantIdentifier: this.merchantId,
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        countryCode: 'US',
        currencyCode: 'USD',
        paymentMethodType: 'debit'
      }
    }];

    const DETAILS = {
      id: 'subscription_payment',
      displayItems: [{
        label: plan.name,
        amount: { currency: 'USD', value: plan.price.toString() }
      }],
      total: {
        label: 'Skinior',
        amount: { currency: 'USD', value: plan.price.toString() }
      }
    };

    const OPTIONS = {
      requestPayerName: true,
      requestPayerEmail: true
    };

    try {
      const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);
      const paymentResponse = await paymentRequest.show();
      
      // Send to backend
      await this.sendPaymentToBackend(paymentResponse, plan.id);
      
      await paymentResponse.complete('success');
      return true;
    } catch (error) {
      console.error('Apple Pay error:', error);
      throw error;
    }
  }

  static async sendPaymentToBackend(paymentResponse, planId) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/apple/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        planId,
        paymentToken: paymentResponse.details.paymentToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment processing failed');
    }

    return response.json();
  }
}
```

## Backend Integration

Your backend already has the Apple In-App Purchase webhook endpoint. Here's how to use it:

### API Endpoints for Mobile Apps

```typescript
// Verify Apple receipt - already implemented
POST /api/subscriptions/apple/verify

// Request body:
{
  "receiptData": "base64_encoded_receipt",
  "productId": "com.skinior.subscription.basic.monthly",
  "transactionId": "transaction_id_from_apple"
}

// Apple webhook endpoint - already implemented  
POST /api/subscriptions/webhooks/apple
```

### Add Apple Shared Secret to Environment

Add this to your `.env` file:
```bash
# Apple In-App Purchase
APPLE_SHARED_SECRET=your_shared_secret_from_app_store_connect
```

### Enhanced Receipt Validation (Optional)

Your backend service can be enhanced with Apple's receipt validation:

```typescript
// Add this method to your subscription.service.ts
async verifyAppleReceipt(receiptData: string, isProduction: boolean = true): Promise<any> {
  const url = isProduction 
    ? 'https://buy.itunes.apple.com/verifyReceipt'
    : 'https://sandbox.itunes.apple.com/verifyReceipt';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'receipt-data': receiptData,
      'password': process.env.APPLE_SHARED_SECRET,
      'exclude-old-transactions': true
    }),
  });

  const result = await response.json();
  
  if (result.status === 21007) {
    // Receipt is from sandbox, retry with sandbox URL
    return this.verifyAppleReceipt(receiptData, false);
  }
  
  if (result.status !== 0) {
    throw new Error(`Apple receipt validation failed: ${result.status}`);
  }
  
  return result;
}
```

## Testing

### Test Environment Setup

1. **Sandbox Testing:**
   - Use sandbox Apple ID for testing
   - Set up test subscription products in App Store Connect
   - Use sandbox environment URLs

2. **Test Cards:**
   ```
   Visa: 4242 4242 4242 4242
   Mastercard: 5555 5555 5555 4444
   American Express: 3782 822463 10005
   ```

3. **Testing Checklist:**
   - [ ] Apple Pay button appears only when available
   - [ ] Payment flow completes successfully
   - [ ] Subscription activates in backend
   - [ ] Receipt validation works
   - [ ] Error handling works properly

## Production Checklist

### Before Going Live:

- [ ] Production Merchant ID configured
- [ ] Payment Processing Certificate installed
- [ ] App Store Connect products published
- [ ] Backend webhook endpoints secured with HTTPS
- [ ] Receipt validation implemented
- [ ] Error handling and logging in place
- [ ] Terms of Service and Privacy Policy linked
- [ ] Subscription management UI implemented
- [ ] Cancel/upgrade flows tested
- [ ] Refund policy documented

### Environment Variables Required:

```bash
# Add to your .env file
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=path_to_private_key.p8
APPLE_SHARED_SECRET=your_shared_secret
```

### Security Best Practices:

1. **Always validate receipts server-side**
2. **Use HTTPS for all API calls**
3. **Implement proper error handling**
4. **Log transactions for audit purposes**
5. **Validate payment amounts**
6. **Implement fraud detection**

## Troubleshooting

### Common Issues:

1. **"Apple Pay not available"**
   - Check device compatibility
   - Verify cards are added to Wallet
   - Ensure merchant ID is correct

2. **Payment authorization fails**
   - Check network connectivity
   - Verify certificate configuration
   - Check backend API response

3. **Subscription not activating**
   - Verify webhook is receiving calls
   - Check receipt validation
   - Ensure database updates are working

### Debug Logs:

```javascript
// Enable debug logging in development
if (__DEV__) {
  console.log('Apple Pay configuration:', paymentConfiguration);
  console.log('Payment result:', paymentResult);
}
```

## Support

For additional help:
- [Apple Pay Documentation](https://developer.apple.com/apple-pay/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay)

---

**Note:** This guide assumes you're using the subscription system already implemented in your backend. Make sure your backend is running and accessible from your mobile app.
