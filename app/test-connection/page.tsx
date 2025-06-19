"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Wifi } from "lucide-react";

export default function TestConnectionPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const testConnection = async () => {
    setStatus("loading");
    setResponse(null);
    setError("");

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/healt`,
        {
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY,
            "ngrok-skip-browser-warning": "true"
          }
        }
      );

      setStatus("success");
      setResponse(res.data);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Connection failed");
      if (err.response) {
        setResponse(err.response.data);
      }
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Test API Connection
          </CardTitle>
          <CardDescription>Periksa koneksi ke backend API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                API Base URL
              </p>
              <code className="block w-full rounded-md bg-muted px-3 py-2 text-sm">
                {process.env.NEXT_PUBLIC_BASE_API_URL}
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                API Key
              </p>
              <code className="block w-full rounded-md bg-muted px-3 py-2 text-sm">
                {process.env.NEXT_PUBLIC_API_KEY?.substring(0, 20)}...
              </code>
            </div>
          </div>

          {/* Test Button */}
          <Button
            onClick={testConnection}
            disabled={status === "loading"}
            className="w-full sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>

          {/* Results */}
          {status !== "idle" && (
            <Alert
              variant={
                status === "success"
                  ? "default"
                  : status === "error"
                  ? "destructive"
                  : "default"
              }
            >
              {status === "success" && <CheckCircle2 className="h-4 w-4" />}
              {status === "error" && <XCircle className="h-4 w-4" />}
              {status === "loading" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <AlertTitle>
                {status === "success"
                  ? "Connection Successful"
                  : status === "error"
                  ? "Connection Failed"
                  : "Testing Connection..."}
              </AlertTitle>
              {error && <AlertDescription>{error}</AlertDescription>}
            </Alert>
          )}

          {response && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">Response:</p>
              <pre className="overflow-auto text-xs">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
