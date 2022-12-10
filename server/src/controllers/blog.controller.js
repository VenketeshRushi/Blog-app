const BlogModel = require("../model/blog.model");


async function postBlog({ title, description, user, name, url }) {
  
  let data = await BlogModel.create({
    title: title,
    description: description,
    img: url,
    user: user,
    name: name,
  });
  return data.name;
}

async function getAllBlogs(page) {
  let blogs = await BlogModel.find()
    .skip((page - 1) * 9)
    .limit(9);
  let blogscount = await BlogModel.find().countDocuments();

  return { blogs: blogs, blogscount: blogscount };
}

async function getAllYourBlogs({ userid, page }) {
  let blogs = await BlogModel.find({ user: userid })
    .skip((page - 1) * 9)
    .limit(9);
  let blogscount = await BlogModel.find({ user: userid }).countDocuments();

  return { blogs: blogs, blogscount: blogscount };
}

async function deleteblog(id) {
  let blog = await BlogModel.findByIdAndDelete(id);
  return "Blog Deleted Successfully";
}
module.exports = { getAllBlogs, postBlog, getAllYourBlogs, deleteblog };
