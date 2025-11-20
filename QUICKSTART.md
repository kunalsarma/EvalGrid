# EvalGrid - Quick Start Guide

Get up and running with EvalGrid in 5 minutes!

## Step 1: Setup (1 minute)

```bash
cd /path/to/EvalGrid
npm install
npm run dev
```

The app opens at `http://localhost:5173/`

## Step 2: Get Your API Key (30 seconds)

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy your API key

## Step 3: Download Template (30 seconds)

1. Click "Download Template" button
2. This gives you the expected Excel format
3. Customize with your own data

## Step 4: Upload & Configure (2 minutes)

1. **Upload File**: Drag-drop your Excel file
2. **Enter API Key**: Paste your Google AI key
3. **Select Model**: Gemini 2.5 Flash recommended
4. **Add Evaluation Field**:
   - Name: e.g., "Customer Sentiment"
   - Description: "Evaluate overall sentiment"
   - Target Column: Select the column to evaluate
   - Context Columns: Add relevant supporting columns
   - Score Values: Define your scoring scale (1-5, etc.)

## Step 5: Evaluate (varies)

Click "Start Evaluation" and watch the progress bar:
- Green numbers = successful evaluations
- Speed displayed in rows/minute
- Estimated time remaining

## Step 6: Download Results (30 seconds)

Click "Download Results as XLSX" to get your data with evaluation scores added!

## Tips for Best Results

### Evaluation Field Configuration
- **Clear Descriptions**: More detailed descriptions = better LLM evaluation
- **Context Matters**: Include relevant context columns to improve accuracy
- **Specific Scoring**: Define score criteria clearly
- **Multiple Fields**: Chain multiple evaluations (sentiment → tone → accuracy)

### Model Selection
- **Gemini 2.5 Flash**: Best balance of speed and accuracy (recommended)
- **Flash-Lite**: Fastest, great for high volume
- **Pro**: Most accurate, slower

### Example: Customer Service Evaluation

```
Field Name: "Response Quality"
Description: "Rate how well the support agent answered the customer question"

Target Column: "Agent Response"

Context Columns:
- "Customer Question" → "The original problem/request"
- "Customer Level" → "Customer tier (bronze/silver/gold)"

Score Values:
- 1 = "Completely unhelpful, didn't address the issue"
- 2 = "Partially addressed the issue with some inaccuracy"
- 3 = "Adequately addressed the issue"
- 4 = "Well-addressed with clear explanation"
- 5 = "Excellent response, went above and beyond"
```

## Common Issues

### "Invalid API Key" Error
- Check your API key is correct
- Make sure you're using a valid tier
- Try creating a new API key

### Slow Processing
- Switch to a faster model (Flash-Lite)
- Reduce number of rows per evaluation
- Process data in batches

### Rate Limit Errors
- Upgrade your tier
- Use a faster model
- Wait and resume later

## What Gets Stored

✅ **Stored Locally** (in your browser):
- Your API key
- Model preferences
- Field configurations

❌ **NOT Stored**:
- Your actual data
- Evaluation results
- Processing history

Everything is client-side only!

## Next Steps

1. **Read the full README** for detailed feature documentation
2. **Check the PRD** for advanced configuration options
3. **Explore different models** to find your optimal speed/accuracy balance

## Support

- Google AI Studio Help: https://support.google.com/aistudio/
- Gemini API Docs: https://ai.google.dev/docs/

---

Enjoy efficient data evaluation! 🚀
