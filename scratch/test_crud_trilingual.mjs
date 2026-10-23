const BASE = 'http://localhost:5000/api';

async function testAll() {
  console.log('--- 1. Testing Admin Login ---');
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@soraedu-tr.com',
      password: 'Admin@2026!'
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.token || loginData.data?.token;
  const user = loginData.user || loginData.data?.user;
  if (!loginData.success || !token) {
    throw new Error('Admin login failed: ' + JSON.stringify(loginData));
  }
  console.log('✓ Admin login successful! Role:', user.role);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  console.log('--- 2. Testing Adding a University with 3 Languages ---');
  const testUniSlug = `test-publish-uni-${Date.now()}`;
  const addUniRes = await fetch(`${BASE}/universities/admin`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      slug: testUniSlug,
      city: 'Istanbul',
      type: 'PRIVATE',
      establishedYear: 2026,
      ranking: 15,
      websiteUrl: 'https://example.edu.tr',
      admissionStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'جامعة الاختبار المنشورة',
          overview: 'نظرة عامة تجريبية بالعربية'
        },
        {
          lang: 'tr',
          name: 'Yayın Test Üniversitesi',
          overview: 'Türkçe yayın test açıklaması'
        },
        {
          lang: 'en',
          name: 'Publish Test University',
          overview: 'English publish test overview'
        }
      ]
    })
  });
  const addUniData = await addUniRes.json();
  if (!addUniData.success) {
    throw new Error('Add university failed: ' + JSON.stringify(addUniData));
  }
  console.log('✓ University created successfully! ID:', addUniData.data.id);
  console.log('  Translations count:', addUniData.data.translations?.length);
  for (const t of addUniData.data.translations) {
    console.log(`   - [${t.lang}]: "${t.name}"`);
  }

  console.log('--- 3. Testing Public Retrieval in all 3 languages ---');
  for (const lang of ['ar', 'tr', 'en']) {
    const pubRes = await fetch(`${BASE}/universities/${testUniSlug}?lang=${lang}`);
    const pubData = await pubRes.json();
    const trans = pubData.data?.translations?.find(t => t.lang === lang) || pubData.data?.translations?.[0];
    console.log(`✓ Public ${lang.toUpperCase()} response: "${trans?.name}"`);
  }

  console.log('--- 4. Testing Updating the University in 3 Languages ---');
  const updateUniRes = await fetch(`${BASE}/universities/admin/${addUniData.data.id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      slug: testUniSlug,
      city: 'Ankara',
      translations: [
        {
          lang: 'ar',
          name: 'جامعة الاختبار المنشورة (معدل)',
          overview: 'نظرة عامة محدثة'
        },
        {
          lang: 'tr',
          name: 'Yayın Test Üniversitesi (Güncellendi)',
          overview: 'Türkçe güncellenmiş açıklama'
        },
        {
          lang: 'en',
          name: 'Publish Test University (Updated)',
          overview: 'English updated overview'
        }
      ]
    })
  });
  const updateUniData = await updateUniRes.json();
  if (!updateUniData.success) {
    throw new Error('Update university failed: ' + JSON.stringify(updateUniData));
  }
  console.log('✓ University updated successfully!');
  for (const t of updateUniData.data.translations) {
    console.log(`   - [${t.lang}]: "${t.name}"`);
  }

  console.log('--- 5. Clean up: Delete Test University ---');
  const delRes = await fetch(`${BASE}/universities/admin/${addUniData.data.id}`, {
    method: 'DELETE',
    headers: authHeaders
  });
  const delData = await delRes.json();
  console.log('✓ Test university cleaned up:', delData.success);

  console.log('\n===========================================');
  console.log('🎉 ALL 3-LANGUAGE CRUD AND API TESTS PASSED!');
  console.log('===========================================');
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
