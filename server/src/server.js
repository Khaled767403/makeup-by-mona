import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✔ Make up by mona API running on http://localhost:${PORT}`);
});
