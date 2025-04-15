const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { team1, team2 } = req.body;

  const prompt = `Analyze the following Honor of Kings draft. Provide team synergy, strengths, weaknesses, and win conditions.

Team 1: ${team1.join(', ')}
Team 2: ${team2.join(', ')}

Respond in markdown format.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in MOBA games and Honor of Kings.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No analysis generated.';
    res.json({ analysis: content });
  } catch (error) {
    console.error('Error from OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

app.get('/', (req, res) => {
  res.send('Honor of Kings GPT Draft Analyzer is running.');
});

app.listen(PORT, () => {
  console.log(\`Server listening on port \${PORT}\`);
});
