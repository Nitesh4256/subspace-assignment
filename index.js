const express = require("express");
const fetchData = require("./midleware/fatchData");
const axios = require("axios");

const app = express();
const PORT = 8000;

app.get("/api/blog-stats", fetchData, (req, res) => {
  const { blogStats } = res.locals;
  res.json(blogStats);
});

app.get("/api/blog-search", async (req, res) => {
  const { query } = req.query;

  // Check if the query parameter is provided
  if (!query) {
    res.status(400).json({ error: 'Query parameter "query" is required.' });
    return;
  }
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogs = response.data.blogs;

    const matchingBlogs = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ matchingBlogs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log("server is listing on PORT : 8000");
});
