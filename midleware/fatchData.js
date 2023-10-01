const axios = require("axios");
const _ = require("lodash");
const fetchData = async (req, res, next) => {
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
    const totalBlogs = blogs.length;
    const longestTitleBlog = _.maxBy(blogs, "title.length");
    const blogsWithPrivacy = _.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes("privacy")
    );
    const uniqueBlogTitles = _.uniqBy(blogs, "title").map((blog) => blog.title);

    res.locals.blogStats = {
      totalBlogs,
      longestTitle: longestTitleBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles,
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = fetchData;
