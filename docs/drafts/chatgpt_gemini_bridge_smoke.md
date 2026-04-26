# ChatGPT Gemini Bridge Smoke Draft

Goal: confirm ChatGPT can ask Codex to route a draft to Gemini for review.

Candidate change: keep the AI collaboration loop as a review-only workflow. Do not change runtime behavior.

Risk to check: secrets must not be printed, Gemini output must be treated as candidate input, and Codex validation remains required before repository promotion.
