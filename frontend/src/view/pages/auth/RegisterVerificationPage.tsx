import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  checkRegisterVerificationLinkAuthApi,
  verifyRegisterVerificationLinkAuthApi,
} from "@/api/auth.api";

type VerificationStatus =
  | "checking"
  | "verifying"
  | "verified"
  | "expired"
  | "error";

function RegisterVerificationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("expired");
      setMessage("Verification link is missing or invalid.");
      return;
    }

    verifyToken(token);
  }, [token]);

  const verifyToken = async (token: string) => {
    try {
      // Step 1: Check if the link is expired
      setStatus("checking");
      const checkResponse = await checkRegisterVerificationLinkAuthApi(token);

      if (!checkResponse[0] || !checkResponse[1]?.data?.isTokenValid) {
        setStatus("expired");
        setMessage(
          checkResponse[1]?.message ||
            "Verification link has expired. Please register again.",
        );
        setSearchParams({});
        return;
      }

      // Step 2: Token is valid, verify the account
      setStatus("verifying");
      const verifyResponse = await verifyRegisterVerificationLinkAuthApi(token);

      if (verifyResponse[0]) {
        setStatus("verified");
        setMessage(
          verifyResponse[1]?.message || "Email verified successfully!",
        );

        // Redirect to onboard after 2 seconds
        setTimeout(() => {
          navigate("/onboard/company-details");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(
          verifyResponse[1]?.message ||
            "Verification failed. Please try again.",
        );

        setSearchParams({});
      }
    } catch {
      setStatus("error");

      setSearchParams({});
      setMessage("Something went wrong. Please try again.");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "checking":
        return (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
            <CardTitle className="text-xl">Checking your link...</CardTitle>
            <CardDescription>
              Please wait while we verify your registration link.
            </CardDescription>
          </>
        );

      case "verifying":
        return (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
            <CardTitle className="text-xl">Verifying your account...</CardTitle>
            <CardDescription>
              Almost there! We're activating your account.
            </CardDescription>
          </>
        );

      case "verified":
        return (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 animate-in fade-in">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <CardTitle className="text-xl text-emerald-500">
              Email Verified!
            </CardTitle>
            <CardDescription>{message}</CardDescription>
            <p className="text-xs text-muted-foreground">
              Redirecting you to onboarding in 2 seconds...
            </p>
          </>
        );

      case "expired":
        return (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 animate-in fade-in">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">
              Link Expired
            </CardTitle>
            <CardDescription>{message}</CardDescription>
            <Link to="/signup" className="w-full">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 active:scale-[0.98]">
                Register Again
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        );

      case "error":
        return (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 animate-in fade-in">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">
              Verification Failed
            </CardTitle>
            <CardDescription>{message}</CardDescription>
            <Link to="/signup" className="w-full">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 active:scale-[0.98]">
                Try Again
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        );
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Animated gradient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link
            to="/"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25 transition-transform hover:scale-105"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Email Verification
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifying your EmbedBot account
            </p>
          </div>
        </div>

        <Card className="border-0 bg-card/60 shadow-2xl shadow-black/5 ring-1 ring-white/10 backdrop-blur-xl dark:bg-card/40 dark:ring-white/5">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center gap-4 text-center">
              {renderContent()}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {(status === "checking" || status === "verifying") && (
              <div className="flex justify-center">
                <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterVerificationPage;
