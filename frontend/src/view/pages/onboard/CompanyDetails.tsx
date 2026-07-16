import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { Sparkles, Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormTextarea from "@/components/custom/FormTextarea";
import { toast } from "sonner";
import { createOrganisationDetailsApi } from "@/api/onboard.api";
import OnboardingLayout from "@/view/layout/OnboardingLayout";

// Zod Validation Schema
const schema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z
    .string()
    .min(1, "Website URL is required")
    .url("Please enter a valid URL (e.g., https://example.com)"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(2, "Zip code is required"),
  }),
  contact: z.string().min(5, "Contact number is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

function CompanyDetails() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // States for country-state-city dropdowns
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      website: "",
    },
  });

  // Load countries on mount
  useEffect(() => {
    const formattedCountries = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
    }));
    setCountries(formattedCountries);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const formattedStates = State.getStatesOfCountry(selectedCountry).map(
        (s) => ({
          label: s.name,
          value: s.isoCode,
        }),
      );
      setStates(formattedStates);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
      setValue("address.state", "");
      setValue("address.city", "");
    }
  }, [selectedCountry, setValue]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const formattedCities = City.getCitiesOfState(
        selectedCountry,
        selectedState,
      ).map((c) => ({
        label: c.name,
        value: c.name, // storing city name directly
      }));
      setCities(formattedCities);
      setSelectedCity("");
      setValue("address.city", "");
    }
  }, [selectedCountry, selectedState, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Find actual country name and state name for the payload
      const countryName =
        Country.getCountryByCode(data.address.country)?.name ||
        data.address.country;
      const stateName =
        State.getStateByCodeAndCountry(data.address.state, data.address.country)
          ?.name || data.address.state;

      const payload = {
        ...data,
        address: {
          ...data.address,
          country: countryName,
          state: stateName,
        },
      };

      console.log("Submitting Onboarding Payload:", payload);

      const response = await createOrganisationDetailsApi(payload);
      if (response[2] === 201) {
        toast.success("Organisation details saved successfully!");
        navigate("/onboard/website-urls");
      } else {
        toast.error("Failed to save organisation details. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to save organisation details. Please try again.");
    } finally {
      setIsLoading(false);
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
          {/* Logo / Brand */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-top-1">
                Organisation Setup
              </h1>
              <p className="mt-1 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                Tell us about your company to customize your experience
              </p>
            </div>
          </div>

          <Card className="border-0 bg-card/60 shadow-2xl shadow-black/5 ring-1 ring-white/10 backdrop-blur-xl dark:bg-card/40 dark:ring-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Organisation Profile</CardTitle>
              <CardDescription>
                Provide the details below to initialize your bot workspace
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {/* Basic Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Company Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    required
                    placeholder="Acme Corp"
                  />
                  <FormInput
                    label="Company Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    required
                    placeholder="contact@acme.com"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Website URL"
                    name="website"
                    register={register}
                    error={errors.website}
                    required
                    placeholder="https://acme.com"
                  />
                  <FormInput
                    label="Contact Phone"
                    name="contact"
                    register={register}
                    error={errors.contact}
                    required
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Address Fields Section */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    Office Address
                  </h3>

                  <FormInput
                    label="Street Address"
                    name="address.street"
                    register={register}
                    error={errors.address?.street}
                    required
                    placeholder="123 Main St, Suite 400"
                  />

                  {/* Country, State, City Dropdowns */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormSelect
                      label="Country"
                      name="address.country"
                      options={countries}
                      error={errors.address?.country}
                      required
                      value={selectedCountry}
                      onValueChange={(val) => {
                        setSelectedCountry(val);
                        setValue("address.country", val, {
                          shouldValidate: true,
                        });
                      }}
                    />

                    <FormSelect
                      label="State / Region"
                      name="address.state"
                      options={states}
                      error={errors.address?.state}
                      required
                      disabled={!selectedCountry}
                      value={selectedState}
                      onValueChange={(val) => {
                        setSelectedState(val);
                        setValue("address.state", val, {
                          shouldValidate: true,
                        });
                      }}
                    />

                    <FormSelect
                      label="City"
                      name="address.city"
                      options={cities}
                      error={errors.address?.city}
                      required
                      disabled={!selectedState}
                      value={selectedCity}
                      onValueChange={(val) => {
                        setSelectedCity(val);
                        setValue("address.city", val, { shouldValidate: true });
                      }}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <FormInput
                        label="Zip / Postal Code"
                        name="address.zipCode"
                        register={register}
                        error={errors.address?.zipCode}
                        required
                        placeholder="94016"
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="pt-2 border-t border-white/5">
                  <FormTextarea
                    label="Company Description"
                    name="description"
                    register={register}
                    error={errors.description}
                    required
                    placeholder="Briefly describe what your company does..."
                  />
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-4 border-0 bg-transparent pt-2 pb-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving details...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Save & Proceed</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
}

export default CompanyDetails;
