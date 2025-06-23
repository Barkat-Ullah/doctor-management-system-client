/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Search,
  ArrowUp,
  BookOpen,
  Users,
  Award,
  Clock,
  Eye,
} from "lucide-react";
import { blogCategories, blogPosts } from "@/lib/data-blog";

const POSTS_PER_PAGE = 3;

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const categoryParam = searchParams.get("category");
  const pageParam = searchParams.get("page");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize state from URL parameters
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (pageParam) {
      setCurrentPage(Number.parseInt(pageParam, 10));
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categoryParam, pageParam]);

  // Filter posts based on search term and active category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    setCurrentPage(1); // Reset to first page on category change
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section - Enhanced */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Health & Medical <span className="text-green-600">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover the latest health insights, medical breakthroughs, and
              wellness tips from our team of expert healthcare professionals and
              certified medical practitioners.
            </p>

            {/* Stats Section */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                  <Users className="h-4 w-4" />
                  <span>1000+ Readers</span>
                </div>
                <p className="text-sm text-gray-500">Monthly Active</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                  <Award className="h-4 w-4" />
                  <span>50+ Articles</span>
                </div>
                <p className="text-sm text-gray-500">Expert Written</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>Weekly Updates</span>
                </div>
                <p className="text-sm text-gray-500">Fresh Content</p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search health articles..."
                    className="pl-10 border-2 border-green-200 focus:border-green-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-6"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            {/* Categories - Enhanced */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Browse by Category
              </h2>
              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={handleCategoryChange}
              >
                <TabsList className="w-full flex flex-wrap justify-start overflow-x-auto bg-gray-50 p-1">
                  {blogCategories.map((category) => (
                    <TabsTrigger
                      key={category.value}
                      value={category.value}
                      className="px-4 py-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Results Info */}
            {filteredPosts.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">
                  📚 Found{" "}
                  <span className="font-bold">{filteredPosts.length}</span>{" "}
                  article
                  {filteredPosts.length !== 1 ? "s" : ""}
                  {activeCategory !== "all" && (
                    <span className="ml-2">
                      in "
                      {
                        blogCategories.find(
                          (cat) => cat.value === activeCategory
                        )?.name
                      }
                      " category
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Blog Posts - Enhanced */}
            {paginatedPosts.length > 0 ? (
              <div className="space-y-8">
                {paginatedPosts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden border-2 hover:border-green-300 hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1">
                          📋{" "}
                          {blogCategories.find(
                            (cat) => cat.value === post.category
                          )?.name || post.category}
                        </Badge>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Article #
                          {index + 1 + (currentPage - 1) * POSTS_PER_PAGE}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight hover:text-green-600 transition-colors">
                        {post.title}
                      </h2>

                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <p className="text-lg text-blue-800 font-medium leading-relaxed">
                          💡 <strong>Quick Summary:</strong> {post.excerpt}
                        </p>
                      </div>

                      <div className="prose prose-green max-w-none prose-lg">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <div
                            dangerouslySetInnerHTML={{ __html: post.content }}
                          />
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3 font-medium flex items-center gap-2">
                          🏷️ <span>Related Topics:</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-gray-50 hover:bg-gray-100 border-gray-300"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Article Meta Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />5 min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Medical Expert Reviewed
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    No Articles Found
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We couldn't find any articles matching your search criteria.
                    Try adjusting your search terms or browse all articles.
                  </p>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                  >
                    View All Articles
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination - Enhanced */}
            {totalPages > 1 && (
              <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-4">
                  <p className="text-gray-600">
                    Page{" "}
                    <span className="font-bold text-green-600">
                      {currentPage}
                    </span>{" "}
                    of <span className="font-bold">{totalPages}</span> | Showing{" "}
                    <span className="font-bold text-green-600">
                      {filteredPosts.length}
                    </span>{" "}
                    total articles
                  </p>
                </div>
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="cursor-pointer hover:bg-green-100"
                        >
                          ← Previous
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer ${
                              currentPage === page
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "hover:bg-green-100"
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="cursor-pointer hover:bg-green-100"
                        >
                          Next →
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section - Enhanced */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-green-200">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  📧 Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Get the latest health tips, medical breakthroughs, and
                  wellness advice delivered directly to your inbox. Join our
                  community of health-conscious readers.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-green-800 font-medium">
                    ✅ Weekly Health Tips | ✅ Expert Medical Advice | ✅ Latest
                    Article Updates | ✅ Exclusive Content
                  </p>
                </div>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow border-2 border-green-200 focus:border-green-400"
                    required
                  />
                  <Button className="bg-green-600 hover:bg-green-700 whitespace-nowrap px-6">
                    Subscribe Now
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                  We respect your privacy. Unsubscribe at any time. No spam,
                  just valuable health content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll to top button - Enhanced */}
        {showScrollTop && (
          <Button
            className="fixed bottom-6 right-6 p-3 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50 transition-all duration-300 hover:scale-110"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </main>
    </>
  );
}
