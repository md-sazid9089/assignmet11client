import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router";
import { Calendar, User, ArrowLeft, Clock, Eye, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Travel Tips for Bangladesh",
      excerpt: "Discover the best practices for traveling across Bangladesh, from packing essentials to local customs you should know.",
      author: "Sarah Ahmed",
      date: "2024-12-15",
      category: "Travel Tips",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop&q=80",
      readTime: "5 min read",
      views: 1240,
      content: `
        <h2>Exploring the Beauty of Bangladesh</h2>
        <p>Bangladesh offers diverse travel experiences from the Sundarbans to the beautiful tea gardens of Sylhet. Whether you're a first-time visitor or a seasoned traveler, these essential tips will help you make the most of your journey.</p>
        
        <h3>1. Best Time to Visit</h3>
        <p>The ideal time to visit Bangladesh is during the winter months (November to February) when the weather is pleasant and comfortable. Avoid the monsoon season (June to September) unless you specifically want to experience the lush greenery and dramatic rainfall.</p>
        
        <h3>2. Essential Documents</h3>
        <p>Ensure your passport is valid for at least six months beyond your planned departure date. Most travelers will need a visa - check with the Bangladesh embassy in your country well in advance.</p>
        
        <h3>3. Currency and Money</h3>
        <p>The local currency is the Bangladeshi Taka (BDT). ATMs are widely available in cities, but it's wise to carry cash when traveling to rural areas. Credit cards are accepted in major hotels and restaurants.</p>
        
        <h3>4. Local Transportation</h3>
        <p>From rickshaws to CNGs (auto-rickshaws), Bangladesh offers various transportation options. For longer distances, consider hiring a car with a driver. The train network is extensive and offers a comfortable way to travel between major cities.</p>
        
        <h3>5. Respect Local Customs</h3>
        <p>Bangladesh is a predominantly Muslim country. Dress modestly, especially when visiting religious sites. Remove shoes before entering mosques and homes. Always ask permission before photographing people.</p>
        
        <h3>6. Food Safety</h3>
        <p>Bengali cuisine is delicious but can be spicy. Start with milder dishes and gradually explore. Drink bottled water and avoid street food initially until your stomach adjusts.</p>
        
        <h3>7. Stay Connected</h3>
        <p>Purchase a local SIM card upon arrival for affordable internet and calling rates. Major providers include Grameenphone, Robi, and Banglalink.</p>
        
        <h3>8. Learn Basic Bengali Phrases</h3>
        <p>Knowing basic phrases like "Shuvo shokal" (Good morning) and "Dhonnobad" (Thank you) will enhance your interactions with locals.</p>
        
        <h3>9. Pack Smart</h3>
        <p>Bring lightweight, breathable clothing, a good sunscreen, insect repellent, and any medications you might need. A power bank is essential as power cuts can occur.</p>
        
        <h3>10. Embrace the Experience</h3>
        <p>Bangladeshi people are incredibly warm and hospitable. Don't hesitate to engage with locals - they're often eager to help and share their culture with visitors.</p>
      `,
    },
    {
      id: 2,
      title: "Budget Travel Guide: Visit Bangladesh for Less",
      excerpt: "Learn how to travel through Bangladesh on a budget without compromising on experience and comfort.",
      author: "Rafiul Islam",
      date: "2024-12-10",
      category: "Budget Travel",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop&q=80",
      readTime: "7 min read",
      views: 892,
      content: `
        <h2>Affordable Adventures in Bangladesh</h2>
        <p>Traveling on a budget in Bangladesh is not only possible but also incredibly rewarding. With careful planning, you can experience the country's rich culture, stunning landscapes, and delicious cuisine without breaking the bank.</p>
        
        <h3>Accommodation Options</h3>
        <p>Budget hotels and guesthouses are available throughout Bangladesh, with prices starting from $10-15 per night. Consider staying in locally-run establishments for an authentic experience and to support local communities.</p>
        
        <h3>Transportation Savings</h3>
        <p>Use local buses and trains instead of private cars. A train journey from Dhaka to Chittagong costs only a few dollars in second class. City transportation via rickshaw or CNG is very affordable.</p>
        
        <h3>Eating Like a Local</h3>
        <p>Street food and local restaurants offer delicious meals for less than $2. Try biriyani, fuchka, and various rice dishes at neighborhood eateries. Avoid tourist-focused restaurants to save money.</p>
        
        <h3>Free and Low-Cost Attractions</h3>
        <p>Many of Bangladesh's best experiences are free or very cheap. Walking through old Dhaka, visiting local markets, exploring beaches, and enjoying natural landscapes cost little to nothing.</p>
        
        <h3>Best Budget Destinations</h3>
        <p>Cox's Bazar, Sylhet, and Sundarbans offer incredible experiences at reasonable prices. Look for package tours from local operators for the best deals.</p>
      `,
    },
    {
      id: 3,
      title: "Hidden Gems: Lesser-Known Destinations in Bangladesh",
      excerpt: "Explore the untouched beauty of Bangladesh's hidden destinations that every traveler should experience.",
      author: "Fatima Khan",
      date: "2024-12-05",
      category: "Destinations",
      image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop&q=80",
      readTime: "6 min read",
      views: 2156,
      content: `
        <h2>Discovering Bangladesh's Best-Kept Secrets</h2>
        <p>Beyond the typical tourist spots, Bangladesh has incredible hidden gems waiting to be discovered. These lesser-known destinations offer unique experiences away from the crowds.</p>
        
        <h3>Ratargul Swamp Forest</h3>
        <p>Located in Sylhet, this freshwater swamp forest is one of the few in the world. During monsoon, you can boat through the submerged forest - a truly magical experience.</p>
        
        <h3>Bichnakandi</h3>
        <p>This scenic spot near the Indian border features crystal-clear water flowing from hills. The panoramic views and serene environment make it perfect for nature lovers.</p>
        
        <h3>Paharpur Buddhist Monastery</h3>
        <p>A UNESCO World Heritage Site, this ancient monastery complex showcases Bangladesh's Buddhist heritage. The intricate terracotta plaques are remarkable.</p>
        
        <h3>Lawachara National Park</h3>
        <p>Home to endangered species including the hoolock gibbon, this park offers excellent trekking opportunities through tropical rainforest.</p>
        
        <h3>Kuakata Beach</h3>
        <p>Unlike crowded Cox's Bazar, Kuakata is peaceful and offers the rare opportunity to watch both sunrise and sunset from the same beach.</p>
        
        <h3>Bagerhat Mosque City</h3>
        <p>Another UNESCO site, this city contains impressive 15th-century mosque architecture, including the famous Sixty Dome Mosque.</p>
      `,
    },
    {
      id: 4,
      title: "Best Season to Visit Different Regions",
      excerpt: "A complete guide on the best times to visit various regions of Bangladesh for optimal experience.",
      author: "Mohammad Ali",
      date: "2024-11-30",
      category: "Travel Tips",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop&q=80",
      readTime: "8 min read",
      views: 1567,
      content: `
        <h2>Timing Your Visit to Bangladesh</h2>
        <p>Each region of Bangladesh has its own perfect season for visiting. Understanding the climate patterns will help you plan the ideal trip.</p>
        
        <h3>Dhaka - November to February</h3>
        <p>The capital is best visited in winter when temperatures are moderate (15-25°C). Avoid the hot summer months when temperatures can exceed 40°C.</p>
        
        <h3>Cox's Bazar - November to March</h3>
        <p>Beach weather is perfect during winter and early spring. The sea is calm, and temperatures are pleasant for swimming and sunbathing.</p>
        
        <h3>Sylhet - November to April</h3>
        <p>Visit during winter for tea garden tours, or during early summer to see the waterfalls at their most spectacular after spring rains.</p>
        
        <h3>Sundarbans - November to February</h3>
        <p>Wildlife spotting is best in winter. The weather is cooler, and animals are more active. Avoid monsoon season when many areas are inaccessible.</p>
        
        <h3>Chittagong Hill Tracts - October to March</h3>
        <p>The hills are most beautiful after monsoon when everything is lush and green, but roads are passable again.</p>
        
        <h3>Monsoon Adventures - June to September</h3>
        <p>If you don't mind rain, monsoon offers dramatic landscapes, fewer tourists, and lower prices. Perfect for experiencing Bangladesh's lush beauty.</p>
      `,
    },
    {
      id: 5,
      title: "Local Food Guide: Must-Try Dishes in Bangladesh",
      excerpt: "Discover the authentic flavors of Bangladesh and where to find the best local cuisine.",
      author: "Sarah Ahmed",
      date: "2024-11-25",
      category: "Food & Culture",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80",
      readTime: "6 min read",
      views: 3421,
      content: `
        <h2>A Culinary Journey Through Bangladesh</h2>
        <p>Bengali cuisine is renowned for its complexity of flavors and unique cooking techniques. From street food to royal dishes, Bangladesh offers unforgettable culinary experiences.</p>
        
        <h3>Biriyani</h3>
        <p>The most beloved dish in Bangladesh. Try Dhaka's famous Kacchi Biriyani - slow-cooked meat with fragrant rice. Haji Biriyani and Fakhruddin are legendary spots.</p>
        
        <h3>Hilsa Fish (Ilish)</h3>
        <p>Bangladesh's national fish, prepared in numerous ways. Ilish Bhaja (fried) and Shorshe Ilish (in mustard sauce) are must-tries during hilsa season (June-October).</p>
        
        <h3>Panta Bhat</h3>
        <p>Fermented rice traditionally eaten during Pohela Boishakh (Bengali New Year). Served with fried fish, pickles, and green chilies.</p>
        
        <h3>Fuchka</h3>
        <p>Bangladesh's version of pani puri - crispy shells filled with spiced chickpeas and tamarind water. Available at every street corner.</p>
        
        <h3>Shingara and Samosa</h3>
        <p>Triangular pastries filled with spiced potatoes or meat. Perfect afternoon snack with tea.</p>
        
        <h3>Mishti (Sweets)</h3>
        <p>Bengali sweets are legendary. Try Roshogolla, Chomchom, Mishti Doi (sweet yogurt), and Sandesh. Visit historic sweet shops in Old Dhaka.</p>
        
        <h3>Street Food Safety Tips</h3>
        <p>Look for busy stalls with high turnover. Observe locals to find the best spots. Start with cooked items before trying raw preparations.</p>
      `,
    },
    {
      id: 6,
      title: "Sustainable Travel: How to Explore Responsibly",
      excerpt: "Learn how to travel in a way that respects the environment and local communities.",
      author: "Rafiul Islam",
      date: "2024-11-20",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop&q=80",
      readTime: "5 min read",
      views: 1823,
      content: `
        <h2>Traveling Responsibly in Bangladesh</h2>
        <p>Sustainable travel is more important than ever. Here are practical ways to minimize your impact while maximizing positive contributions to local communities.</p>
        
        <h3>Support Local Businesses</h3>
        <p>Stay in locally-owned hotels, eat at family restaurants, and buy handicrafts directly from artisans. This ensures your money benefits the community.</p>
        
        <h3>Reduce Plastic Waste</h3>
        <p>Carry a reusable water bottle with a filter, refuse plastic bags, and bring your own shopping bags. Bangladesh faces significant plastic pollution challenges.</p>
        
        <h3>Respect Wildlife</h3>
        <p>When visiting Sundarbans or other wildlife areas, maintain safe distances, never feed animals, and choose eco-certified tour operators.</p>
        
        <h3>Cultural Sensitivity</h3>
        <p>Learn about local customs, dress appropriately, ask before photographing people, and respect religious practices and sacred sites.</p>
        
        <h3>Transportation Choices</h3>
        <p>Use public transportation, walk when possible, or cycle in traffic-friendly areas. If hiring a car, share with other travelers.</p>
        
        <h3>Leave No Trace</h3>
        <p>Always dispose of trash properly, avoid littering beaches and natural areas, and participate in clean-up activities when possible.</p>
        
        <h3>Support Conservation</h3>
        <p>Visit national parks and wildlife sanctuaries - entrance fees support conservation. Consider volunteering with environmental organizations.</p>
      `,
    },
  ];

  const post = blogPosts.find((p) => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Article Not Found</h2>
          <Link to="/blog" className="text-[#b35a44] hover:text-[#8e4636] font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post.title;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12">
      <Helmet>
        <title>{post.title} - Uraan Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#b35a44] dark:hover:text-[#d97757] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <span className="inline-block px-4 py-1 rounded-full bg-[#b35a44] text-white text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share:
            </span>
            <button
              onClick={() => handleShare("facebook")}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare("copy")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          className="mb-12 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div
          className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              lineHeight: "1.8",
              fontSize: "1.125rem",
            }}
          />
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
                    <div className="relative h-40 overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#b35a44] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {relatedPost.readTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </article>

      {/* Custom Styles for Article Content */}
      <style>{`
        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #b35a44;
        }
        
        .article-content p {
          margin-bottom: 1.25rem;
          color: var(--text-secondary);
        }
        
        .article-content strong {
          color: var(--text-primary);
          font-weight: 600;
        }
        
        .dark .article-content h2 {
          color: #ffffff;
        }
        
        .dark .article-content h3 {
          color: #d97757;
        }
        
        .dark .article-content p {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;
