import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  HelpCircle,
  Code,
  List,
  Sparkles,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddFaqPayload, FaqItem } from "@/types/api/knowledge-base.types";
import { addFaqToKnowledgeBaseApi } from "@/api/knowledge-base.api";

interface AddFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_FAQ: FaqItem = {
  question: "",
  answer: "",
};

export const AddFaqModal: React.FC<AddFaqModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");
  const [collectionName, setCollectionName] = useState("");
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    { question: "", answer: "" },
  ]);
  const [rawJson, setRawJson] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddFaqItem = () => {
    if (faqItems.length >= 10) {
      toast.error("Maximum 10 FAQ items allowed per request.");
      return;
    }
    setFaqItems([...faqItems, { ...DEFAULT_FAQ }]);
  };

  const handleRemoveFaqItem = (index: number) => {
    if (faqItems.length <= 1) {
      toast.error("At least 1 FAQ item is required.");
      return;
    }
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const handleFaqChange = (
    index: number,
    field: keyof FaqItem,
    value: string,
  ) => {
    const updated = [...faqItems];
    updated[index] = { ...updated[index], [field]: value };
    setFaqItems(updated);
  };

  const syncFormToJson = () => {
    const payload: AddFaqPayload = {
      collectionName: collectionName || "Customer FAQ",
      faqItems,
    };
    setRawJson(JSON.stringify(payload, null, 2));
  };

  const syncJsonToForm = (jsonStr: string) => {
    setRawJson(jsonStr);
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.collectionName && typeof parsed.collectionName === "string") {
        setCollectionName(parsed.collectionName);
      }
      if (Array.isArray(parsed.faqItems)) {
        setFaqItems(
          parsed.faqItems.map((item: any) => ({
            question: String(item.question || ""),
            answer: String(item.answer || ""),
          })),
        );
      }
    } catch {
      // Allow user to continue typing raw JSON without crashing
    }
  };

  const handleTabSwitch = (tab: "form" | "json") => {
    if (tab === "json") {
      syncFormToJson();
    } else {
      syncJsonToForm(rawJson);
    }
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalPayload: AddFaqPayload;

    if (activeTab === "json") {
      try {
        finalPayload = JSON.parse(rawJson);
      } catch {
        toast.error("Invalid JSON format. Please check your syntax.");
        return;
      }
    } else {
      finalPayload = {
        collectionName: collectionName.trim(),
        faqItems: faqItems.map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        })),
      };
    }

    // Validation
    if (
      !finalPayload.collectionName ||
      finalPayload.collectionName.length < 3 ||
      finalPayload.collectionName.length > 50
    ) {
      toast.error("Collection Name must be between 3 and 50 characters.");
      return;
    }

    if (!finalPayload.faqItems || finalPayload.faqItems.length === 0) {
      toast.error("At least 1 FAQ item is required.");
      return;
    }

    if (finalPayload.faqItems.length > 10) {
      toast.error("Maximum 10 FAQ items allowed per collection.");
      return;
    }

    for (let i = 0; i < finalPayload.faqItems.length; i++) {
      const item = finalPayload.faqItems[i];
      if (!item.question || item.question.length < 3) {
        toast.error(`Question ${i + 1} must be at least 3 characters long.`);
        return;
      }
      if (!item.answer || item.answer.length < 3) {
        toast.error(`Answer ${i + 1} must be at least 3 characters long.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const [success, response] = await addFaqToKnowledgeBaseApi(finalPayload);
      if (success) {
        toast.success(
          response?.message || "FAQ Knowledge Base added successfully!",
        );
        onSuccess();
        onClose();
        // Reset form
        setCollectionName("");
        setFaqItems([{ question: "", answer: "" }]);
      } else {
        const errorMsg =
          response?.message ||
          response?.error?.message ||
          "Failed to add FAQ items.";
        toast.error(errorMsg);
      }
    } catch {
      toast.error("An error occurred while adding FAQ knowledge base.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-b from-card/95 to-card/90 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                Add FAQ Knowledge Base
              </h3>
              <p className="text-xs text-muted-foreground/70">
                Train your chatbot with structured Q&A pairs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground/60 hover:bg-white/10 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-black/30 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => handleTabSwitch("form")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-all ${
              activeTab === "form"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Visual Form Mode
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("json")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-all ${
              activeTab === "json"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            JSON Payload Mode
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {activeTab === "form" ? (
            <>
              {/* Collection Name */}
              <div className="space-y-1.5">
                <Label htmlFor="collectionName" className="text-xs font-medium">
                  Collection Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="collectionName"
                  placeholder="e.g. Customer FAQ 4"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  maxLength={50}
                  className="border-white/10 bg-black/20 text-xs focus-visible:ring-purple-500/50"
                />
                <p className="text-[11px] text-muted-foreground/50">
                  Name for grouping these FAQ items in your knowledge base
                </p>
              </div>

              {/* FAQ Items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    FAQ Q&A Pairs ({faqItems.length}/10)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFaqItem}
                    disabled={faqItems.length >= 10}
                    className="h-7 gap-1 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add FAQ Item
                  </Button>
                </div>

                <div className="max-h-[320px] overflow-y-auto space-y-3 pr-1">
                  {faqItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-white/8 bg-black/20 p-3.5 space-y-2.5 transition-all hover:border-white/15"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/15 px-2 py-0.5 text-[11px] font-semibold text-purple-400">
                          <HelpCircle className="h-3 w-3" />
                          FAQ #{idx + 1}
                        </span>

                        {faqItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaqItem(idx)}
                            className="text-muted-foreground/50 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
                            title="Remove FAQ Item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-muted-foreground/70">
                          Question
                        </span>
                        <Input
                          placeholder="e.g. How long do refunds take?"
                          value={item.question}
                          onChange={(e) =>
                            handleFaqChange(idx, "question", e.target.value)
                          }
                          className="border-white/10 bg-card/40 text-xs focus-visible:ring-purple-500/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-muted-foreground/70">
                          Answer
                        </span>
                        <textarea
                          placeholder="e.g. Refunds are processed within 5-7 business days."
                          value={item.answer}
                          onChange={(e) =>
                            handleFaqChange(idx, "answer", e.target.value)
                          }
                          rows={2}
                          className="w-full rounded-md border border-white/10 bg-card/40 p-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* JSON Mode */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">JSON Payload</Label>
                <span className="text-[11px] text-muted-foreground/50">
                  POST /knowledge-base/add/faq
                </span>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => syncJsonToForm(e.target.value)}
                rows={12}
                className="w-full font-mono text-xs rounded-xl border border-white/10 bg-black/40 p-3 text-purple-200 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none leading-relaxed"
                placeholder={`{\n  "collectionName": "Customer FAQ4",\n  "faqItems": [\n    {\n      "question": "How long do refunds take",\n      "answer": "Refunds are processed within 5-7 business days."\n    }\n  ]\n}`}
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-white/10 bg-white/5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 text-xs shadow-lg shadow-purple-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Adding to Knowledge Base...
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5" />
                  Add FAQ Collection
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFaqModal;
