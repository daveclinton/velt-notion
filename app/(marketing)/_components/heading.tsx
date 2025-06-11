"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/lib/auth-store";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Heading = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const user = getCurrentUser();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">VeltDocs</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl">
        VeltDocs is the collaborative workspace powered by <br />
        <span className="text-blue-600 font-medium">Velt</span>.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter VeltDocs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/sign-in">
            Get VeltDocs free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Heading;
