const https = require('http');

async function testActivitiesAPI() {
  try {
    console.log('🔍 Testing Activities API Endpoint...\n');

    // Test the activities API endpoint
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/api/user/activities',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You would normally need authentication headers here
        // For now, testing without auth to see the response structure
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response Headers:', res.headers);
        console.log('Response Body:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('\n📊 Parsed Response:');
          console.log(JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log('Could not parse as JSON:', e.message);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
    });

    req.end();

  } catch (error) {
    console.error('❌ Error testing activities API:', error);
  }
}

testActivitiesAPI();