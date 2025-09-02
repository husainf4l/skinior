# Account Deletion API - Apple App Store Compliance

This document describes the account deletion functionality required for Apple App Store compliance. Apple requires apps that support account creation to also provide account deletion functionality.

## API Endpoint

### Delete User Account

**Endpoint:** `DELETE /api/users/account`  
**Authorization:** Required (JWT Bearer Token)  
**Content-Type:** `application/json`

#### Request Body

```json
{
  "confirmationText": "DELETE",
  "reason": "No longer need the service",
  "deleteData": true
}
```

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `confirmationText` | string | ✅ | Must be "DELETE" or "CONFIRM" (case-insensitive) |
| `reason` | string | ❌ | Optional reason for account deletion |
| `deleteData` | boolean | ❌ | `true` for complete deletion, `false` for anonymization (default: `true`) |

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Your account has been successfully deleted. We're sorry to see you go!"
}
```

**Error (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Invalid confirmation text. Please type \"DELETE\" to confirm account deletion.",
  "error": "Bad Request"
}
```

## What Gets Deleted

### Complete Deletion (`deleteData: true`)

When a user chooses complete deletion, the following data is permanently removed:

1. **User Profile**
   - Personal information (name, email, avatar)
   - Authentication credentials
   - OAuth provider connections

2. **Firebase Authentication**
   - Firebase Auth user account
   - All Firebase-related authentication data

3. **Subscriptions**
   - All subscription records
   - Active subscriptions are cancelled
   - Usage tracking data

4. **App Data**
   - Device registrations
   - Push notification settings
   - User preferences

5. **Notifications**
   - All notification history
   - Notification settings

### Anonymization (`deleteData: false`)

When anonymization is chosen:

1. **User Profile** - Personal data is replaced with anonymous values
2. **Firebase Authentication** - Firebase Auth user account deleted, UID cleared
3. **Subscriptions** - Active subscriptions are cancelled but records kept for audit
4. **Payment Records** - Kept for legal/audit purposes but anonymized
5. **Analytics** - Historical usage data anonymized

## Firebase Authentication Handling

**Important:** The account deletion process automatically handles Firebase Authentication cleanup on the **backend** using Firebase Admin SDK. This is the recommended approach because:

### Why Backend Deletion is Better

1. **Security** - Firebase Admin SDK has elevated privileges
2. **Reliability** - Ensures deletion happens even if mobile app fails
3. **Consistency** - All deletion logic in one centralized place
4. **Atomic Operations** - Database and Firebase deletion in same transaction

### What Happens to Firebase

- **Complete Deletion (`deleteData: true`):**
  - Firebase Auth user account is permanently deleted
  - All Firebase authentication tokens are invalidated
  - User cannot sign in with Firebase anymore

- **Anonymization (`deleteData: false`):**
  - Firebase Auth user account is deleted
  - Database `firebaseUid` field is cleared
  - User profile is anonymized but subscription history preserved

### Error Handling

- If Firebase user doesn't exist, deletion continues (user may have been deleted manually)
- If Firebase Admin SDK is not configured, a warning is logged but deletion continues
- Database deletion proceeds even if Firebase deletion fails (with error logging)

### Mobile App Considerations

**DO NOT** try to delete Firebase users from the mobile app (Flutter/iOS). The backend handles this automatically. In your mobile app:

```dart
// ❌ DON'T DO THIS - Firebase deletion handled by backend
// await FirebaseAuth.instance.currentUser?.delete();

// ✅ DO THIS - Call backend API only
await AccountDeletionService.deleteAccount();
```

## Mobile Implementation

### iOS (Swift)

```swift
struct DeleteAccountRequest: Codable {
    let confirmationText: String
    let reason: String?
    let deleteData: Bool
}

func deleteAccount(reason: String? = nil, completion: @escaping (Result<Bool, Error>) -> Void) {
    let request = DeleteAccountRequest(
        confirmationText: "DELETE",
        reason: reason,
        deleteData: true
    )
    
    guard let url = URL(string: "\(APIConfig.baseURL)/users/account") else {
        completion(.failure(APIError.invalidURL))
        return
    }
    
    var urlRequest = URLRequest(url: url)
    urlRequest.httpMethod = "DELETE"
    urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
    urlRequest.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
    
    do {
        urlRequest.httpBody = try JSONEncoder().encode(request)
    } catch {
        completion(.failure(error))
        return
    }
    
    URLSession.shared.dataTask(with: urlRequest) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            completion(.failure(APIError.serverError))
            return
        }
        
        // Account deleted successfully
        // Clear local data and redirect to onboarding
        DispatchQueue.main.async {
            self.clearUserData()
            completion(.success(true))
        }
    }.resume()
}

private func clearUserData() {
    // Clear keychain
    KeychainHelper.deleteToken()
    
    // Clear UserDefaults
    UserDefaults.standard.removeObject(forKey: "userProfile")
    UserDefaults.standard.removeObject(forKey: "subscriptionStatus")
    
    // Clear Core Data if used
    // CoreDataManager.shared.clearAllData()
    
    // Navigate to onboarding
    // AppCoordinator.shared.showOnboarding()
}
```

### Flutter

```dart
class AccountDeletionService {
  static Future<bool> deleteAccount({String? reason}) async {
    try {
      final token = await AuthService.getToken();
      
      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/users/account'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'confirmationText': 'DELETE',
          'reason': reason,
          'deleteData': true,
        }),
      );

      if (response.statusCode == 200) {
        // Clear local data
        await _clearLocalData();
        return true;
      } else {
        throw Exception('Failed to delete account: ${response.body}');
      }
    } catch (e) {
      print('Account deletion error: $e');
      return false;
    }
  }

  static Future<void> _clearLocalData() async {
    // Clear secure storage
    await AuthService.clearToken();
    
    // Clear shared preferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    // ❌ DON'T DELETE FIREBASE USER HERE - Backend handles this
    // await FirebaseAuth.instance.currentUser?.delete(); // DON'T DO THIS
    
    // ✅ Just sign out locally
    await FirebaseAuth.instance.signOut();
    
    // Clear local database if using sqflite
    // await DatabaseHelper.instance.clearAllTables();
  }
}

// UI Widget for account deletion
class DeleteAccountScreen extends StatefulWidget {
  @override
  _DeleteAccountScreenState createState() => _DeleteAccountScreenState();
}

class _DeleteAccountScreenState extends State<DeleteAccountScreen> {
  final _reasonController = TextEditingController();
  bool _isDeleting = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Delete Account'),
        backgroundColor: Colors.red,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.warning,
              color: Colors.red,
              size: 48,
            ),
            SizedBox(height: 16),
            Text(
              'Delete Your Account',
              style: Theme.of(context).textTheme.headline5?.copyWith(
                color: Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'This action cannot be undone. All your data including:',
              style: Theme.of(context).textTheme.bodyText1,
            ),
            SizedBox(height: 8),
            _buildDataList(),
            SizedBox(height: 24),
            TextField(
              controller: _reasonController,
              decoration: InputDecoration(
                labelText: 'Reason for leaving (optional)',
                border: OutlineInputBorder(),
                hintText: 'Help us improve by sharing why you\'re leaving',
              ),
              maxLines: 3,
            ),
            Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isDeleting ? null : _confirmDeletion,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isDeleting
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text(
                        'DELETE MY ACCOUNT',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDataList() {
    final items = [
      'Profile information',
      'Subscription history',
      'App preferences',
      'Notification settings',
      'All personal data',
    ];

    return Column(
      children: items.map((item) => Padding(
        padding: EdgeInsets.symmetric(vertical: 2),
        child: Row(
          children: [
            Icon(Icons.close, color: Colors.red, size: 16),
            SizedBox(width: 8),
            Text(item),
          ],
        ),
      )).toList(),
    );
  }

  Future<void> _confirmDeletion() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Final Confirmation'),
        content: Text(
          'Are you absolutely sure you want to delete your account? '
          'This action cannot be undone and all your data will be permanently lost.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: Text('DELETE'),
          ),
        ],
      ),
    ) ?? false;

    if (confirmed) {
      setState(() {
        _isDeleting = true;
      });

      try {
        final success = await AccountDeletionService.deleteAccount(
          reason: _reasonController.text.trim().isEmpty 
              ? null 
              : _reasonController.text.trim(),
        );

        if (success) {
          // Navigate to goodbye screen or restart app
          Navigator.of(context).pushNamedAndRemoveUntil(
            '/onboarding',
            (route) => false,
          );
        } else {
          _showErrorDialog();
        }
      } catch (e) {
        _showErrorDialog();
      } finally {
        if (mounted) {
          setState(() {
            _isDeleting = false;
          });
        }
      }
    }
  }

  void _showErrorDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(
          'Failed to delete account. Please try again or contact support.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }
}
```

## App Store Guidelines Compliance

### Required Elements

1. **Clear Account Deletion Option**
   - Must be easily discoverable in app settings
   - Should be labeled clearly (e.g., "Delete Account", "Close Account")

2. **Confirmation Process**
   - Must confirm user intent
   - Should explain what data will be deleted
   - Allow user to cancel the process

3. **Data Handling**
   - Clearly communicate what happens to user data
   - Provide option to download data before deletion (if applicable)
   - Respect data retention policies for legal/audit purposes

### UI/UX Best Practices

1. **Placement**
   - Include in Account/Profile settings
   - Place at bottom of settings with warning styling

2. **Visual Design**
   - Use warning colors (red/orange)
   - Include warning icons
   - Clear, bold text for destructive actions

3. **User Education**
   - Explain consequences clearly
   - List what data will be deleted
   - Provide alternatives (e.g., deactivation vs deletion)

## Security Considerations

1. **Authentication Required**
   - User must be logged in
   - Fresh authentication may be required for sensitive operations

2. **Confirmation Mechanisms**
   - Require explicit confirmation text
   - Use multi-step confirmation process

3. **Audit Trail**
   - Log deletion requests for audit purposes
   - Maintain minimal records for legal compliance

4. **Data Retention**
   - Some data may need to be retained for legal reasons
   - Financial records for tax/audit purposes
   - Fraud prevention data

## Testing

### Test Cases

1. **Valid Deletion Request**
   - Confirm account is deleted
   - Verify user cannot log in
   - Check data is removed from database

2. **Invalid Confirmation Text**
   - Verify error response
   - Account should remain active

3. **Subscription Handling**
   - Active subscriptions should be cancelled
   - Verify with payment providers

4. **Data Cleanup**
   - All related data should be removed
   - Foreign key constraints handled properly

### Test Script

```bash
# Test valid account deletion
curl -X DELETE http://localhost:4008/api/users/account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmationText": "DELETE",
    "reason": "Testing account deletion",
    "deleteData": true
  }'

# Test invalid confirmation
curl -X DELETE http://localhost:4008/api/users/account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmationText": "INVALID",
    "deleteData": true
  }'
```

---

**Note:** This implementation provides full Apple App Store compliance for account deletion requirements while maintaining data integrity and security best practices.
