# 📋 Waitlist Feature Documentation

## Overview

The Waitlist feature allows users to sign up for early access to Skinior by providing their email and optional additional information. This feature is commonly used on landing pages to collect interested users before the full product launch.

## Features

- ✅ **Email Collection** - Capture user emails for future communication
- ✅ **Optional Information** - Collect name, phone, interests, and source
- ✅ **Duplicate Prevention** - Prevent duplicate email signups
- ✅ **Email Verification** - Track verification status
- ✅ **Analytics** - Get insights about signup sources and interests
- ✅ **Export Functionality** - Export waitlist data for marketing
- ✅ **RESTful API** - Complete CRUD operations

## Database Schema

```prisma
model Waitlist {
  id          String   @id @default(cuid())
  email       String   @unique
  firstName   String?
  lastName    String?
  phone       String?
  interests   String[] // Array of interests (e.g., ["skincare", "ai", "early-access"])
  source      String?  // How they found us (e.g., "google", "social", "referral")
  isVerified  Boolean  @default(false) // Email verification status
  isActive    Boolean  @default(true)  // Active in waitlist

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("waitlist")
}
```

## API Endpoints

### 1. Join Waitlist

**POST** `/api/waitlist/join`

Add a new email to the waitlist.

**Request Body:**

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "interests": ["skincare", "ai", "early-access"],
  "source": "google"
}
```

**Response:**

```json
{
  "id": "clm3...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "interests": ["skincare", "ai", "early-access"],
  "source": "google",
  "isVerified": false,
  "isActive": true,
  "createdAt": "2025-08-30T13:37:50.000Z",
  "updatedAt": "2025-08-30T13:37:50.000Z"
}
```

### 2. Get Waitlist Entry

**GET** `/api/waitlist/entry/:email`

Retrieve a specific waitlist entry by email.

**Response:**

```json
{
  "id": "clm3...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "interests": ["skincare", "ai", "early-access"],
  "source": "google",
  "isVerified": false,
  "isActive": true,
  "createdAt": "2025-08-30T13:37:50.000Z",
  "updatedAt": "2025-08-30T13:37:50.000Z"
}
```

### 3. Get All Waitlist Entries

**GET** `/api/waitlist/entries`

Retrieve all waitlist entries (admin use).

**Response:**

```json
[
  {
    "id": "clm3...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "interests": ["skincare", "ai", "early-access"],
    "source": "google",
    "isVerified": false,
    "isActive": true,
    "createdAt": "2025-08-30T13:37:50.000Z",
    "updatedAt": "2025-08-30T13:37:50.000Z"
  }
]
```

### 4. Update Waitlist Entry

**PUT** `/api/waitlist/entry/:email`

Update an existing waitlist entry.

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "interests": ["skincare", "ai", "early-access", "beta-testing"]
}
```

### 5. Verify Email

**POST** `/api/waitlist/verify/:email`

Mark an email as verified (useful for email verification flows).

### 6. Remove from Waitlist

**DELETE** `/api/waitlist/entry/:email`

Mark an entry as inactive (soft delete).

**Response:**

```json
{
  "message": "Successfully removed from waitlist"
}
```

### 7. Get Waitlist Statistics

**GET** `/api/waitlist/stats`

Get analytics about the waitlist.

**Response:**

```json
{
  "totalSignups": 150,
  "verifiedEmails": 89,
  "activeSignups": 142,
  "topInterests": [
    { "interest": "skincare", "count": 95 },
    { "interest": "ai", "count": 67 },
    { "interest": "early-access", "count": 45 }
  ],
  "topSources": [
    { "source": "google", "count": 45 },
    { "source": "social", "count": 32 },
    { "source": "referral", "count": 28 }
  ]
}
```

### 8. Export Waitlist

**GET** `/api/waitlist/export`

Export all active waitlist entries for marketing purposes.

## Frontend Integration Examples

### Basic Email Signup Form

```javascript
// React component for waitlist signup
const WaitlistForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    interests: [],
    source: 'website',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4008/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Successfully joined the waitlist!');
        // Reset form or show success message
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="First name (optional)"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Last name (optional)"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
      <button type="submit">Join Waitlist</button>
    </form>
  );
};
```

### Fetch Waitlist Statistics

```javascript
const fetchWaitlistStats = async () => {
  try {
    const response = await fetch('http://localhost:4008/api/waitlist/stats');
    const stats = await response.json();
    console.log('Waitlist Stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};
```

## Error Handling

### Common Error Responses

#### 1. Email Already Exists (409)

```json
{
  "statusCode": 409,
  "message": "Email already exists in waitlist",
  "error": "Conflict"
}
```

#### 2. Waitlist Entry Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Waitlist entry not found",
  "error": "Not Found"
}
```

#### 3. Validation Error (400)

```json
{
  "statusCode": 400,
  "message": ["email must be a valid email", "interests must be an array"],
  "error": "Bad Request"
}
```

## Best Practices

### Frontend Implementation

1. **Validate emails** on the frontend before submission
2. **Show loading states** during form submission
3. **Provide clear success/error messages**
4. **Consider adding reCAPTCHA** to prevent spam
5. **Track signup sources** for analytics

### Backend Security

1. **Rate limiting** on the join endpoint
2. **Input validation** using class-validator
3. **Sanitize inputs** to prevent XSS
4. **Consider email verification** before adding to active list
5. **Regular cleanup** of inactive entries

### Marketing Integration

1. **Export data regularly** for email marketing
2. **Segment users** by interests and sources
3. **Track conversion rates** from waitlist to active users
4. **Send welcome emails** immediately after signup
5. **Follow up** with interested users

## Testing

### Unit Tests Example

```typescript
describe('WaitlistService', () => {
  it('should add new email to waitlist', async () => {
    const waitlistData = {
      email: 'test@example.com',
      firstName: 'Test',
      interests: ['skincare'],
    };

    const result = await waitlistService.joinWaitlist(waitlistData);

    expect(result.email).toBe(waitlistData.email);
    expect(result.isActive).toBe(true);
  });

  it('should prevent duplicate emails', async () => {
    const waitlistData = {
      email: 'duplicate@example.com',
    };

    await waitlistService.joinWaitlist(waitlistData);

    await expect(waitlistService.joinWaitlist(waitlistData)).rejects.toThrow(
      ConflictException,
    );
  });
});
```

### Integration Tests

```typescript
describe('Waitlist Controller (e2e)', () => {
  it('POST /api/waitlist/join', async () => {
    const waitlistData = {
      email: 'e2e-test@example.com',
      firstName: 'E2E',
      interests: ['testing'],
    };

    const response = await request(app.getHttpServer())
      .post('/api/waitlist/join')
      .send(waitlistData)
      .expect(201);

    expect(response.body.email).toBe(waitlistData.email);
    expect(response.body.interests).toEqual(waitlistData.interests);
  });
});
```

## Future Enhancements

1. **Email Verification** - Send verification emails with tokens
2. **Referral System** - Track who referred new signups
3. **Priority Queue** - Allow users to move up in the waitlist
4. **Geographic Data** - Track user locations for regional launches
5. **A/B Testing** - Test different signup forms and messaging
6. **Integration with Email Services** - Mailchimp, SendGrid, etc.
7. **Waitlist Position** - Show users their position in line
8. **Social Sharing** - Allow users to share and get priority

---

## Conclusion

The Waitlist feature provides a solid foundation for collecting and managing early user interest. It includes comprehensive CRUD operations, analytics, and is designed to scale with your user base.

For questions or additional features, refer to the API documentation or contact the development team.
