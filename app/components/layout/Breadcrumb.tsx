"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function BreadcumbLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);

    const breadcrumbs = paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { href, label };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const MAX_ITEMS = 3;
  const showEllipsis = breadcrumbs.length > MAX_ITEMS;

  return (
    <div className="min-h-screen bg-dark from-gray-900 via-blue-900 to-gray-900">
      {pathname !== "/" && breadcrumbs.length > 0 && (
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 flex items-center">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/"
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Home className="h-4 w-4" />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {showEllipsis && (
                    <>
                      <BreadcrumbSeparator className="text-gray-600" />
                      <BreadcrumbItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1 text-gray-400 hover:text-white">
                            <BreadcrumbEllipsis className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="bg-gray-900 border-white/10"
                          >
                            {breadcrumbs.slice(0, -2).map((crumb) => (
                              <DropdownMenuItem key={crumb.href} asChild>
                                <Link
                                  href={crumb.href}
                                  className="text-gray-300 hover:text-white"
                                >
                                  {crumb.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </BreadcrumbItem>
                    </>
                  )}
                  {breadcrumbs
                    .slice(showEllipsis ? -2 : 0)
                    .map((crumb, index, array) => {
                      const isLast = index === array.length - 1;

                      return (
                        <div key={crumb.href} className="flex items-center">
                          <BreadcrumbSeparator className="text-gray-600" />
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage className="text-white font-medium">
                                {crumb.label}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link
                                  href={crumb.href}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  {crumb.label}
                                </Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </div>
                      );
                    })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
