import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Travel Tips for Bangladesh",
      excerpt: "Discover the best practices for traveling across Bangladesh, from packing essentials to local customs you should know.",
      content: "Bangladesh offers diverse travel experiences from the Sundarbans to the beautiful tea gardens of Sylhet. Here are essential tips for every traveler...",
      author: "Sarah Ahmed",
      date: "2024-12-15",
      category: "Travel Tips",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop&q=80",
      readTime: "5 min read",
      views: 1240,
    },
    {
      id: 2,
      title: "Budget Travel Guide: Visit Bangladesh for Less",
      excerpt: "Learn how to travel through Bangladesh on a budget without compromising on experience and comfort.",
      content: "Traveling on a budget in Bangladesh is not only possible but also incredibly rewarding. Here's our comprehensive guide...",
      author: "Rafiul Islam",
      date: "2024-12-10",
      category: "Budget Travel",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop&q=80",
      readTime: "7 min read",
      views: 892,
    },
    {
      id: 3,
      title: "Hidden Gems: Lesser-Known Destinations in Bangladesh",
      excerpt: "Explore the untouched beauty of Bangladesh's hidden destinations that every traveler should experience.",
      content: "Beyond the typical tourist spots, Bangladesh has incredible hidden gems waiting to be discovered...",
      author: "Fatima Khan",
      date: "2024-12-05",
      category: "Destinations",
      image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop&q=80",
      readTime: "6 min read",
      views: 2156,
    },
    {
      id: 4,
      title: "Best Season to Visit Different Regions",
      excerpt: "A complete guide on the best times to visit various regions of Bangladesh for optimal experience.",
      content: "Each region of Bangladesh has its own perfect season for visiting. Let's explore them one by one...",
      author: "Mohammad Ali",
      date: "2024-11-30",
      category: "Travel Tips",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop&q=80",
      readTime: "8 min read",
      views: 1567,
    },
    {
      id: 5,
      title: "Local Food Guide: Must-Try Dishes in Bangladesh",
      excerpt: "Discover the authentic flavors of Bangladesh and where to find the best local cuisine.",
      content: "Bengali cuisine is renowned for its complexity of flavors and unique cooking techniques...",
      author: "Sarah Ahmed",
      date: "2024-11-25",
      category: "Food & Culture",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80",
      readTime: "6 min read",
      views: 3421,
    },
    {
      id: 6,
      title: "Sustainable Travel: How to Explore Responsibly",
      excerpt: "Learn how to travel in a way that respects the environment and local communities.",
      content: "Sustainable travel is more important than ever. Here are practical ways to minimize your impact...",
      author: "Rafiul Islam",
      date: "2024-11-20",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop&q=80",
      readTime: "5 min read",
      views: 1823,
    },
  ];

  const categories = ["All", "Travel Tips", "Budget Travel", "Destinations", "Food & Culture", "Sustainability"];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12">
      <Helmet>
        <title>Travel Blog - Uraan</title>
        <meta name="description" content="Read amazing travel stories, tips, and guides on our blog" />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Travel Stories & Tips
            </motion.h1>
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Explore insightful articles, travel guides, and inspiring stories from fellow travelers
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto relative mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b35a44] focus:border-transparent"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#b35a44] text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#b35a44] dark:hover:border-[#b35a44]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#b35a44] text-white text-sm font-medium">
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#b35a44] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>

                  {/* Stats and Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>{post.readTime}</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.views}
                      </span>
                    </div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-[#b35a44] hover:text-[#8e4636] transition-colors font-medium flex items-center gap-2"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-slate-600 dark:text-slate-400">
              No articles found matching your search. Try different keywords!
            </p>
          </motion.div>
        )}
      </section>

      {/* Newsletter Section */}
      <motion.section
        className="mt-24 py-16 bg-linear-to-r from-[#b35a44] to-[#8e4636] rounded-3xl container mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-clay-100 mb-8">
            Get the latest travel tips, stories, and exclusive offers delivered to your inbox
          </p>
          <form className="flex gap-3 flex-col sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              required
            />
            <button className="px-8 py-3 bg-white text-[#b35a44] font-bold rounded-lg hover:bg-slate-100 transition-colors duration-300">
              Subscribe
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default Blog;
