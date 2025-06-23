import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { blogPosts, blogCategories } from "@/lib/data-blog";

export default function FeaturedBlogs() {
  // Get the first 3 blog posts
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Latest Health Insights
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Stay informed with our latest articles on health tips, medical
            research, and wellness advice from our expert healthcare
            professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden flex flex-col h-full border-2 hover:border-green-200 transition-all"
            >
              <CardContent className="flex-grow p-6">
                <div className="flex items-center mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {blogCategories.find((cat) => cat.value === post.category)
                      ?.name || post.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link
                    href={`/health-blog`}
                    className="hover:text-green-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter className="pt-0 pb-6 px-6">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Link
                    href={`/health-blog`}
                    className="flex items-center justify-center w-full"
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button className="bg-green-600 hover:bg-green-700">
            <Link href="/health-blog" className="flex items-center">
              View All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
