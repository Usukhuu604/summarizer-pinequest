"use client";
import React from "react";
import { useState } from "react";
import { getSdk } from "../graphql/generated/sdk";
import { GraphQLClient } from "graphql-request";

export const Sample = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const client = new GraphQLClient("http://localhost:4000/graphql");
  const sdk = getSdk(client);

  const fetchGraphQLData = async () => {
    setLoading(true);
    try {
      // Get both hello message and health status
      const helloResult = await sdk.GetHello();
      const healthResult = await sdk.GetHealth();

      setData({
        hello: helloResult.data.hello,
        health: healthResult.data.health,
      });
    } catch (error) {
      console.error("GraphQL Error:", error);
      setData({ error: "Failed to fetch data" });
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GraphQL Frontend Test</h1>

      <button
        onClick={fetchGraphQLData}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Fetch GraphQL Data"}
      </button>

      {data && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">GraphQL Response:</h2>
          <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
