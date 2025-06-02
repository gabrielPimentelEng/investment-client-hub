import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Investment Client Hub
      </h1>

      <div className="flex flex-col space-y-4 w-full max-w-md">
        <p className="text-lg text-gray-600 text-center">
          Welcome to the client management application.
        </p>

        <Button className="w-full">
          Get Started
        </Button>

        <Input placeholder="Enter your email" type="email" className="w-full" />

        <Button variant="outline" className="w-full">
          Learn More
        </Button>
      </div>
    </main>
  );
}
