import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Search,
  Plus,
  Check,
  ArrowRight,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  extractOrganisationWebsiteUrlsApi,
  scrapeOrganisationWebsiteUrlsApi,
} from "@/api/onboard.api";
import OnboardingLayout from "@/view/layout/OnboardingLayout";
import OnboardingStepper from "@/view/features/onboarding/OnboardingStepper";

const MAX_URLS_TO_SELECT = 10;

export default function ExtractWebsiteUrls() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  // Fetch URLs on page load
  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);

      const response = await extractOrganisationWebsiteUrlsApi();
      const success = response[0];
      const responseData = response[1];

      if (success) {
        const rawData = responseData?.data;
        let extractedList: string[] = [];

        if (Array.isArray(rawData)) {
          extractedList = rawData;
        } else if (rawData && Array.isArray(rawData.urls)) {
          extractedList = rawData.urls;
        } else if (Array.isArray(responseData)) {
          extractedList = responseData;
        }

        setUrls(extractedList);
        // Select up to MAX_URLS_TO_SELECT by default
        const defaultSelection = new Set<string>();
        extractedList.slice(0, MAX_URLS_TO_SELECT).forEach((url) => {
          defaultSelection.add(url);
        });
        setSelectedUrls(defaultSelection);

        if (extractedList.length > 0) {
          toast.success(
            `Successfully fetched website URLs! Selected first ${Math.min(extractedList.length, MAX_URLS_TO_SELECT)}.`,
          );
        } else {
          toast.success("Successfully fetched website URLs!");
        }
      } else {
        toast.error("Failed to fetch website URLs. Please add them manually.");
      }
      setIsLoading(false);
    };

    fetchUrls();
  }, []);

  // Filter URLs based on search query
  const filteredUrls = urls.filter((url) =>
    url.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Toggle individual URL selection
  const toggleUrl = (url: string) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(url)) {
      newSelected.delete(url);
      setSelectedUrls(newSelected);
    } else {
      if (newSelected.size >= MAX_URLS_TO_SELECT) {
        toast.warning(
          `You can select a maximum of ${MAX_URLS_TO_SELECT} URLs to crawl.`,
        );
        return;
      }
      newSelected.add(url);
      setSelectedUrls(newSelected);
    }
  };

  // Select all filtered URLs up to MAX_URLS_TO_SELECT
  const selectAllFiltered = () => {
    const newSelected = new Set(selectedUrls);
    let reachedLimit = false;

    for (const url of filteredUrls) {
      if (!newSelected.has(url)) {
        if (newSelected.size >= MAX_URLS_TO_SELECT) {
          reachedLimit = true;
          break;
        }
        newSelected.add(url);
      }
    }

    setSelectedUrls(newSelected);
    if (reachedLimit) {
      toast.warning(
        `Selection capped at the maximum limit of ${MAX_URLS_TO_SELECT} URLs.`,
      );
    }
  };

  // Deselect all filtered URLs
  const deselectAllFiltered = () => {
    const newSelected = new Set(selectedUrls);
    filteredUrls.forEach((url) => newSelected.delete(url));
    setSelectedUrls(newSelected);
  };

  // Add a custom URL to the list
  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;

    let formattedUrl = customUrl.trim();
    // Simple validation/formatting
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
      if (urls.includes(formattedUrl)) {
        toast.warning("This URL is already in the list.");
        return;
      }

      setUrls((prev) => [formattedUrl, ...prev]);
      setSelectedUrls((prev) => {
        const next = new Set(prev);
        if (next.size >= MAX_URLS_TO_SELECT) {
          toast.warning(
            `URL added to list but not selected. Maximum selection is ${MAX_URLS_TO_SELECT}.`,
          );
          return next;
        }
        next.add(formattedUrl);
        return next;
      });
      setCustomUrl("");
      toast.success("Custom URL added successfully!");
    } catch (e) {
      toast.error("Please enter a valid URL.");
    }
  };

  // Remove a URL from the master list
  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls((prev) => prev.filter((url) => url !== urlToRemove));
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      next.delete(urlToRemove);
      return next;
    });
    toast.success("URL removed from the list.");
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (selectedUrls.size === 0) {
      toast.error("Please select at least one URL to crawl.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedList = Array.from(selectedUrls);
      console.log("Submitting selected URLs for crawling:", selectedList);
      const response = await scrapeOrganisationWebsiteUrlsApi({
        selectedUrls: selectedList,
      });
      if (response[0]) {
        toast.success(
          `Successfully submitted ${selectedList.length} URLs for crawling!`,
        );
        navigate("/onboard/api-keys");
      } else {
        toast.error("Failed to submit URLs. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit URLs. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout>
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

        <div className="relative z-10 w-full max-w-2xl">
          {/* Onboarding Stepper */}
          <OnboardingStepper />

          {/* Logo / Brand */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-top-1">
                Configure Website URLs
              </h1>
              <p className="mt-1 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                Select the pages you want your bot to crawl and train on
              </p>
            </div>
          </div>

          <Card className="border-0 bg-card/60 shadow-2xl shadow-black/5 ring-1 ring-white/10 backdrop-blur-xl dark:bg-card/40 dark:ring-white/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Extracted Pages</CardTitle>
                  <CardDescription>
                    We automatically fetched these pages from your site map and
                    links
                  </CardDescription>
                </div>
                {!isLoading && urls.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {selectedUrls.size} of {urls.length} Selected (Max{" "}
                    {MAX_URLS_TO_SELECT})
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {isLoading ? (
                /* Beautiful Loading State */
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
                    <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-400 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-md font-semibold text-foreground">
                      Analyzing website pages...
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      We are parsing your website sitemap and structural layout
                      to extract all accessible pages. This may take a few
                      seconds.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Custom URL Input Section */}
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Plus className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="https://example.com/custom-subpage"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCustomUrl()
                        }
                        className="w-full bg-background border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="bg-purple-600/90 text-white hover:bg-purple-600 active:scale-95 transition-all text-xs py-2 px-4"
                    >
                      Add Custom URL
                    </Button>
                  </div>

                  {/* Search and Bulk Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Filter pages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    {urls.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={selectAllFiltered}
                          className="h-8 border-white/10 bg-white/5 text-xs px-3 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={deselectAllFiltered}
                          className="h-8 border-white/10 bg-white/5 text-xs px-3 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                        >
                          Deselect All
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Scrollable URL List */}
                  <div className="rounded-lg border border-white/10 bg-black/20 overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5 custom-scrollbar animate-in fade-in-50 duration-200">
                      {filteredUrls.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2">
                          <AlertCircle className="h-8 w-8 text-muted-foreground/60" />
                          <p className="text-sm">
                            {urls.length === 0
                              ? "No website URLs found."
                              : "No matching pages found."}
                          </p>
                          {urls.length === 0 && (
                            <p className="text-xs text-muted-foreground/60">
                              Please use the "Add Custom URL" field above to
                              specify pages.
                            </p>
                          )}
                        </div>
                      ) : (
                        filteredUrls.map((url) => {
                          const isSelected = selectedUrls.has(url);
                          return (
                            <div
                              key={url}
                              onClick={() => toggleUrl(url)}
                              className="group flex items-center justify-between p-3.5 hover:bg-white/5 transition-colors cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-4">
                                <div className="transition-transform duration-200 group-hover:scale-105">
                                  {isSelected ? (
                                    <div className="flex h-4 w-4 items-center justify-center rounded bg-purple-600 text-white">
                                      <Check className="h-3 w-3 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="h-4 w-4 rounded border border-white/30" />
                                  )}
                                </div>
                                <span
                                  className={`text-xs truncate font-mono transition-colors ${
                                    isSelected
                                      ? "text-foreground"
                                      : "text-muted-foreground/70"
                                  }`}
                                >
                                  {url}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveUrl(url);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all duration-200"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="border-0 bg-transparent pt-2 pb-6">
              <Button
                type="button"
                size="lg"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 active:scale-[0.98]"
                disabled={isLoading || isSubmitting || selectedUrls.size === 0}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting configurations...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Submit & Start Crawl</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
}
