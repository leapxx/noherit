// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());

// Mock data for heritage images
const heritageImages = [
  { id: 1, url: '/images/heritage1.jpg', title: '非遗项目1' },
  { id: 2, url: '/images/heritage2.jpg', title: '非遗项目2' },
  { id: 3, url: '/images/heritage3.jpg', title: '非遗项目3' },
  { id: 4, url: '/images/heritage4.jpg', title: '非遗项目4' },
  { id: 5, url: '/images/heritage5.jpg', title: '非遗项目5' },
  { id: 6, url: '/images/heritage6.jpg', title: '非遗项目6' },
];

// Mock data for heritage details
const heritageDetails = {
  1: { id: 1, title: '非遗项目1', description: '这是关于非遗项目1的详细介绍...', imageUrl: '/images/heritage1.jpg' },
  2: { id: 2, title: '非遗项目2', description: '这是关于非遗项目2的详细介绍...', imageUrl: '/images/heritage2.jpg' },
  3: { id: 3, title: '非遗项目3', description: '这是关于非遗项目3的详细介绍...', imageUrl: '/images/heritage3.jpg' },
  4: { id: 4, title: '非遗项目4', description: '这是关于非遗项目4的详细介绍...', imageUrl: '/images/heritage4.jpg' },
  5: { id: 5, title: '非遗项目5', description: '这是关于非遗项目5的详细介绍...', imageUrl: '/images/heritage5.jpg' },
  6: { id: 6, title: '非遗项目6', description: '这是关于非遗项目6的详细介绍...', imageUrl: '/images/heritage6.jpg' },
};

// API endpoint for random heritage images
app.get('/api/heritage-images/random', (req, res) => {
  const shuffled = heritageImages.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  res.json({ images: selected });
});

// API endpoint for heritage details
app.get('/api/heritage-images/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const heritage = heritageDetails[id];
  if (heritage) {
    res.json(heritage);
  } else {
    res.status(404).json({ error: 'Heritage not found' });
  }
});

// // Mock AI chat endpoint
// app.post('/api/chat', (req, res) => {
//   const { query, heritageId } = req.body;
//   // Here you would typically call your AI service
//   // For this example, we'll just echo the question with a mock response
//   const mockResponse = `关于"${query}"的回答：这是一个模拟的AI回答，实际实现时需要接入真正的AI服务。`;
//   res.json({ answer: mockResponse });
// });

app.post('/api/chat', async (req, res) => {
  const { query, heritageId } = req.body;

  try {
    // 配置 AI 接口请求参数
    const apiKey = 'app-bi5omYMFaXqssrWCvVXtiFcy'; // 将此替换为你的实际 API 密钥
    const apiUrl = 'http://localhost/v1/chat-messages';

    const response = await axios.post(apiUrl, {
      inputs: {},
      query: query,
      response_mode: 'streaming',
      conversation_id: '', // 可选：如果有多个会话
      user: heritageId, // 或者可以使用其他标识符
      files: [
        {
          type: 'image',
          transfer_method: 'remote_url',
          url: 'https://cloud.dify.ai/logo/logo-site.png'
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream'
    });

    // 处理流式响应
    response.data.on('data', (chunk) => {
      const lines = chunk.toString().trim().split('\n');
      lines.forEach((line) => {
        if (line.startsWith('data: ')) {
          const json = JSON.parse(line.slice(6));
          if (json.event === 'message') {
            res.write(`data: ${JSON.stringify({ answer: json.answer })}\n\n`);
          }
        }
      });
    });

    response.data.on('end', () => {
      res.end(); // 结束响应
    });

  } catch (error) {
    console.error('Error calling AI service:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

