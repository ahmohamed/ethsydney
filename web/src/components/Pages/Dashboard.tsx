import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [connectedTag, setConnectedTag] = useState<string>("");
  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">1. Your Tag</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {connectedTag ? (
            <li className="bg-gray-100 rounded-lg shadow-md p-4">
              <p className="text-gray-800 font-medium">{connectedTag}</p>
            </li>
          ) : (
            <li className="bg-gray-100 border-orange-600 rounded-lg shadow-md p-4">
              <p className="text-gray-800 font-bold">Add your tag ➕</p>
            </li>
          )}
        </ul>
      </section>

      <section>
        <h1 className="text-3xl font-bold mt-10">2. Mint your Connectvatar</h1>
        <div className="flex flex-col space-y-4">
          <p className="text-zinc-600 font-medium">
            Create a unique digital representation of yourself.
          </p>
          <Button className=" font-bold py-2 px-4 rounded-md shadow-md">
            Mint Now
          </Button>
          <p className="text-gray-500 text-sm">
            This will require a small gas fee (one-time cost).
          </p>
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-bold mt-10">
          3. View your connekt balance
        </h1>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <p className="text-gray-300 font-medium">Connekt Coin (CNKT)</p>
          <span className="text-xl font-bold text-yellow-500">10.00 CNKT</span>
        </div>
      </section>
    </div>
  );
}
