import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // // console.log(data);
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-3xl text-[#b35a44]" />,
      title: "Email",
      details: "support@uran.com",
      link: "mailto:support@uran.com",
    },
    {
      icon: <FaPhone className="text-3xl text-[#d97757]" />,
      title: "Phone",
      details: "0164516880",
      link: "tel:+8801234567890",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-[#b35a44]" />,
      title: "Office",
      details: "123 Mogbazar, Dhaka, Bangladesh",
      link: null,
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", color: "hover:text-blue-600" },

    { icon: <FaInstagram />, name: "Instagram", color: "hover:text-pink-600" },
    { icon: <FaLinkedin />, name: "LinkedIn", color: "hover:text-blue-700" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <Helmet>
        <title>Contact Us - Uraan</title>
      </Helmet>

      <div className="container mx-auto px-4">
     
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-[#334155] dark:text-slate-300 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
       
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             
              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] dark:bg-slate-700 dark:text-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] dark:bg-slate-700 dark:text-white"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] dark:bg-slate-700 dark:text-white"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] dark:bg-slate-700 dark:text-white resize-none"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#b35a44] hover:bg-[#8e4636] text-white py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">{info.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                          {info.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-6">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-[#334155] dark:text-slate-300 text-xl transition-all duration-300 hover:scale-110 hover:bg-[#b35a44] hover:text-white`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] border border-[#334155] rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-[#d97757]">Business Hours</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

